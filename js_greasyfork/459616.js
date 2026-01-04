  // ==UserScript==
  // @name        Academic Article Unlocker
  // @match       *://*/doi/*
  // @match       *://*/doiLanding*
  // @match       *://*/*?doi=*
  // @match       *://*.nlm.nih.gov/*
  // @match       *://www.nature.com/articles/*
  // @match       *://zenodo.org/record/*
  // @match       *://www.sciencedirect.com/science/article/*
  // @match       *://ieeexplore.ieee.org/document/*
  // @match       *://www.epistemonikos.org/*/documents/*
  // @match       *://psycnet.apa.org/record/*
  // @match       *://www.cdc.gov/mmwr/volumes/*
  // @match       *://iastatedigitalpress.com/jlsc/*
  // @match       *://www.researchgate.net/publication/*
  // @match       *://www.thelancet.com/journals/*
  // @match       *://www.nber.org/papers/*
  // @match       *://psycnet.apa.org/record/*
  // @match       *://www.cell.com/*/fulltext/*
  // @match       *://pubs.rsc.org/*/articlelanding/*
  // @match       *://*.biomedcentral.com/articles/*
  // @match       *://nowpublishers.com/article/*
  // @match       *://jamanetwork.com/*
  // @match       *://www.bmj.com/content/*
  // @match       *://*.aspetjournals.org/content/*
  // @match       *://philpapers.org/rec/*
  // @match       *://www.jci.org/articles/*
  // @match       *://www.computer.org/csdl/*
  // @match       *://muse.jhu.edu/pub/*
  // @match       *://muse.jhu.edu/article/*
  // @match       *://www.deepdyve.com/lp/*
  // @match       *://www.degruyter.com/document/doi/*
  // @match       *://www.nli.org.il/en/articles/*
  // @match       *://link.springer.com/*
  // @match       *://www.jstor.org/stable/*
  // @match       *://www.frontiersin.org/journals/*
  // @match       *://www.cambridge.org/core/journals/*
  // @match       *://annalsofglobalhealth.org/*
  // @exclude     *://annas-archive.org/*
  // @grant       none
  // @version     3.1.7
  // @author      NoUser
  // @description Easily access open-access versions of academic articles with the click of a button. Say goodbye to paywalls and hello to knowledge.
  // @run-at      document-end
  // @namespace   https://greasyfork.org/en/scripts/459616-academic-article-unlocker
  // @homepage    https://greasyfork.org/en/scripts/459616-academic-article-unlocker
  // @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/459616/Academic%20Article%20Unlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/459616/Academic%20Article%20Unlocker.meta.js
  // ==/UserScript==

const ENABLE_SCIHUB = true; // Set to false to hide the Sci-Hub button
const SCIHUB_URL = "https://sci-hub.ru/"; // Change to your preferred Sci-Hub mirror

(function () {
  "use strict";

  function findDoi() {
    for (const meta of document.querySelectorAll("meta")) {
      if (
        meta.name &&
        [
          "citation_doi",
          "doi",
          "dc.doi",
          "dc.identifier",
          "prism.doi",
        ].includes(meta.name.toLowerCase())
      ) {
        const c = meta.content;
        if (c && c.trim().startsWith("10.")) return c.trim();
      }
    }
    const els = document.querySelectorAll("[data-doi]");
    if (els.length === 1) {
      const d = els[0].getAttribute("data-doi");
      if (d && d.trim().startsWith("10.")) return d.trim();
    }
    const m = window.location.href.match(
      /\b(10\.\d{4,9}\/[-._;()/:A-Z0-9]+)\b/i
    );
    return m ? m[1] : null;
  }

  async function getOpenAccessStatus() {
    const doi = findDoi();
    if (!doi) return {};
    try {
      const res = await fetch(
        `https://api.unpaywall.org/v2/${doi}?email=unpaywall@impactstory.org`
      );
      if (!res.ok) return {};
      return await res.json();
    } catch {
      return {};
    }
  }

  function createButtonContainer() {
    const container = document.createElement("div");
    container.id = "article-unlocker-container";
    const shadow = container.attachShadow({ mode: "closed" });
    const style = document.createElement("style");
    style.textContent = `
      :host {
        position: fixed;
        right: 0;
        bottom: 0;
        z-index: 9999;
        font-family: system-ui, sans-serif;
      }
      .unlocker-wrapper {
        background: #fcfdfe;
        border: 1.5px solid #e3e7ee;
        border-radius: 18px 18px 0 0;
        box-shadow: 0 0 16px 0 rgba(60,72,90,0.13);
        min-width: 2px;
        max-width: 320px;
        margin: 0 12px 12px 0;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        transition: transform 0.3s cubic-bezier(.4,1.4,.6,1), box-shadow 0.2s;
        transform: translateY(0);
      }
      .unlocker-wrapper.collapsed {
        box-shadow: none;
        background: transparent;
        border: none;
        min-width: 0;
        max-width: none;
        margin: 0 16px 8px 0;
        transform: translateY(calc(100% - 30px));
        pointer-events: auto;
      }
      .toggle-button {
        background: none;
        border: none;
        cursor: pointer;
        padding: 8px 0;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        transition: background 0.15s;
        z-index: 2;
        position: relative;
      }
      .toggle-arrow {
        width: 40px;
        height: 40px;
        transition: transform 0.2s;
        display: block;
        margin: 0 auto;
      }
      .unlocker-wrapper.collapsed .toggle-arrow {
        transform: rotate(180deg);
      }
      .button-group {
        display: flex;
        flex-direction: column;
        padding: 8px 0 14px 0;
        transition: max-height 0.3s, opacity 0.2s;
        max-height: 800px;
        opacity: 1;
      }
      .unlocker-wrapper.collapsed .button-group {
        max-height: 0;
        opacity: 0;
        pointer-events: none;
        padding: 0;
      }
      .access-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 18px;
        margin: 0 10px 6px 10px;
        text-decoration: none;
        font-size: 18px;
        font-weight: 600;
        color: #2d3748;
        border-radius: 10px;
        transition: background 0.13s, text-decoration 0.13s;
      }
      .access-link:visited {
        color: #6b7280;
      }
      .access-link:hover,
      .access-link:focus {
        background: #f2f6fa;
        text-decoration: underline;
      }
      .access-link img {
        width: 45px;
        height: 45px;
        flex-shrink: 0;
      }
      .scihub-link span { color: #c00; }
      .unpaywall-link span { color: #2CBB4C; }
    `;
    const wrapper = document.createElement("div");
    wrapper.className = "unlocker-wrapper";
    const toggle = document.createElement("button");
    toggle.className = "toggle-button";
    toggle.title = "Show/hide unlocker";
    toggle.innerHTML = `
      <svg class="toggle-arrow" viewBox="0 0 24 24">
        <polygon points="12,16 6,9 18,9" fill="#6c757d"/>
      </svg>`;
    const group = document.createElement("div");
    group.className = "button-group";
    wrapper.append(toggle, group);
    shadow.append(style, wrapper);
    document.body.append(container);
    toggle.addEventListener("click", () => {
      wrapper.classList.toggle("collapsed");
    });
    return group;
  }

  const buttonGroup = createButtonContainer();

  function createLink(icon, label, cls, url) {
    const a = document.createElement("a");
    a.className = `access-link ${cls}`;
    a.href = url;
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    a.innerHTML = `<img src="${icon}" alt=""><span>${label}</span>`;
    buttonGroup.appendChild(a);
  }

  const scIcon =
    "data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgd2lkdGg9IjQ1IiAgaGVpZ2h0PSI0NSIgIHZpZXdCb3g9IjAgMCAyNCAyNCIgIGZpbGw9Im5vbmUiICBzdHJva2U9IiNDQzAwMDAiICBzdHJva2Utd2lkdGg9IjIuMiIgIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik01IDExbTAgMmEyIDIgMCAwIDEgMiAtMmgxMGEyIDIgMCAwIDEgMiAydjZhMiAyIDAgMCAxIC0yIDJoLTEwYTIgMiAwIDAgMSAtMiAtMnoiIC8+PHBhdGggZD0iTTEyIDE2bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMCIgLz48cGF0aCBkPSJNOCAxMXYtNWE0IDQgMCAwIDEgOCAwIiAvPjwvc3ZnPg==";
  const unIcon =
    "data:image/svg+xml;base64,PHN2ZyAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiAgd2lkdGg9IjQ1IiAgaGVpZ2h0PSI0NSIgIHZpZXdCb3g9IjAgMCAyNCAyNCIgIGZpbGw9Im5vbmUiICBzdHJva2U9IiMyQ0JCNEMiICBzdHJva2Utd2lkdGg9IjIuMiIgIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgIHN0cm9rZS1saW5lam9pbj0icm91bmQiPjxwYXRoIHN0cm9rZT0ibm9uZSIgZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik01IDExbTAgMmEyIDIgMCAwIDEgMiAtMmgxMGEyIDIgMCAwIDEgMiAydjZhMiAyIDAgMCAxIC0yIDJoLTEwYTIgMiAwIDAgMSAtMiAtMnoiIC8+PHBhdGggZD0iTTEyIDE2bS0xIDBhMSAxIDAgMSAwIDIgMGExIDEgMCAxIDAgLTIgMCIgLz48cGF0aCBkPSJNOCAxMXYtNWE0IDQgMCAxIDEgOCAwIiAvPjwvc3ZnPg==";

  (async function () {
    if (ENABLE_SCIHUB) {
      createLink(
        scIcon,
        "Sci‑Hub",
        "scihub-link",
        SCIHUB_URL + window.location.href
      );
    }
    const data = await getOpenAccessStatus();
    if (data.best_oa_location?.url) {
      createLink(unIcon, "Unpaywall", "unpaywall-link", data.best_oa_location.url);
    }
  })();
})();