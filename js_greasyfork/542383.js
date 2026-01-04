// ==UserScript==
// @name         Hugging Face Repo Size
// @namespace    HF Repo Size
// @version      0.2
// @description  Show total storage size (MB/GB) of any Hugging Face model, dataset, or space as soon as the page loads.
// @author       sm18lr88
// @license      MIT
// @match        https://huggingface.co/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542383/Hugging%20Face%20Repo%20Size.user.js
// @updateURL https://update.greasyfork.org/scripts/542383/Hugging%20Face%20Repo%20Size.meta.js
// ==/UserScript==

(function () {
  "use strict";

  /** Format bytes → human-readable MB / GB string */
  function fmt(bytes) {
    if (!bytes) return " – ";
    const mb = bytes / (1024 ** 2);
    return mb < 1000 ? `${mb.toFixed(2)} MB` : `${(mb / 1024).toFixed(2)} GB`;
  }

  /** Extract “owner/repo” path and choose the correct API endpoint */
  function apiInfo(urlPath) {
    const clean = urlPath.replace(/^\/|\/$/g, "");
    if (!clean) return null;
    if (clean.startsWith("datasets/"))
      return { api: `https://huggingface.co/api/datasets/${clean.slice(9)}` };
    if (clean.startsWith("spaces/"))
      return { api: `https://huggingface.co/api/spaces/${clean.slice(7)}` };
    return { api: `https://huggingface.co/api/models/${clean}` };
  }

  /** Compute total bytes from API response */
  function totalBytes(info) {
    if (typeof info.usedStorage === "number") return info.usedStorage;

    if (Array.isArray(info.siblings)) {
      return info.siblings.reduce((sum, s) => {
        if (typeof s.size === "number") return sum + s.size;
        if (s.LFS && typeof s.LFS.size === "number") return sum + s.LFS.size;
        return sum;
      }, 0);
    }
    return null;
  }

  /** Insert badge next to page title */
  function show(str) {
    const bannerId = "hf-size-badge";
    if (document.getElementById(bannerId)) return;

    const title = document.querySelector("h1");
    if (!title) return; // title not yet in DOM

    const span = document.createElement("span");
    span.id = bannerId;
    span.textContent = ` (${str})`;
    span.style.cssText =
      "margin-left:4px;padding:2px 6px;background:#2d6590;color:#fff;border-radius:4px;font-size:13px;";
    title.appendChild(span);
  }

  /** Fetch & display size */
  async function process() {
    const info = apiInfo(location.pathname);
    if (!info) return;

    try {
      const res = await fetch(info.api, { credentials: "omit" });
      if (!res.ok) throw new Error(`API ${res.status}`);
      const data = await res.json();
      show(fmt(totalBytes(data)));
    } catch {
      show("size N/A");
    }
  }

  //------------------------------------------------------------------
  // Run on initial load and whenever HF’s client-side routing changes
  //------------------------------------------------------------------
  const pushState = history.pushState;
  history.pushState = function () {
    pushState.apply(this, arguments);
    setTimeout(process, 50);
  };
  window.addEventListener("popstate", () => setTimeout(process, 50));
  document.addEventListener("DOMContentLoaded", process);
  process();
})();
