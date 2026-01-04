// ==UserScript==
// @name         GeoGuessr Friends: Tiny Flag by Name
// @namespace    gg-friends-flag-stable
// @version      3.4.0
// @description  Adds a small country flag next to every visible player name across the GeoGuessr interface — from friends lists and the side panel to leaderboards, search results, and more — making it easy to see where players are from at a glance.
// @icon         https://www.google.com/s2/favicons?domain=geoguessr.com
// @match        https://www.geoguessr.com/*
// @run-at       document-start
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545780/GeoGuessr%20Friends%3A%20Tiny%20Flag%20by%20Name.user.js
// @updateURL https://update.greasyfork.org/scripts/545780/GeoGuessr%20Friends%3A%20Tiny%20Flag%20by%20Name.meta.js
// ==/UserScript==


(function () {
  "use strict";

  const FLAG_BASE = "https://www.geoguessr.com/static/flags";
  const USER_API  = (id) => `/api/v3/users/${id}`;
  const NAME_SEL  = '[class*="user-nick_nick__"]';
  const LINK_SEL  = "a[href^='/user/']";

  GM_addStyle(`
    .gg-flag {
      display:inline-block;
      margin-left:6px;
      vertical-align:middle;
      line-height:1;
      flex:0 0 auto;
    }
    .gg-flag img {
      height:12px;
      width:auto;
      display:inline-block;
      vertical-align:middle;
    }
  `);

  // --- Fetch queue to avoid overloading ---
  const MAX_CONCURRENCY = 50;
  let running = 0;
  const queue = [];
  function enqueue(task) {
    return new Promise((resolve, reject) => { queue.push({ task, resolve, reject }); pump(); });
  }
  function pump() {
    while (running < MAX_CONCURRENCY && queue.length) {
      const { task, resolve, reject } = queue.shift();
      running++;
      Promise.resolve().then(task).then(resolve, reject).finally(() => { running--; pump(); });
    }
  }

  // --- Caches ---
  const countryById = new Map();       // Cache: id -> Promise<string|null>
  const processed   = new WeakSet();   // Marks name elements already processed
  const observed    = new WeakSet();   // Elements already watched by IntersectionObserver

  function extractIdFromHref(href) {
    const m = String(href||"").match(/\/user\/([^/?#]+)/i);
    return m ? m[1] : null;
  }

  function getCountry(id) {
    if (!id) return Promise.resolve(null);
    if (countryById.has(id)) return countryById.get(id);
    const p = enqueue(() =>
      fetch(USER_API(id), { credentials: "include" })
        .then(r => r.ok ? r.json() : null)
        .then(j => j && j.countryCode ? String(j.countryCode).toUpperCase() : null)
        .catch(() => null)
    );
    countryById.set(id, p);
    return p;
  }

  // --- KEY: Simple, robust check if GeoGuessr already shows a flag near the name ---
  function hasNativeFlagNear(nameEl) {
    // We go up a few levels and search for their flag classes in the respective ancestor's subtree.
    // Matches both the IMG class itself (country-flag_flag__) and the container class (user-nick_flag__).
    let cur = nameEl;
    for (let i = 0; cur && i < 6; i++) {
      if (cur.querySelector('img[class^="country-flag_flag__"], [class^="user-nick_flag__"] img')) {
        return true;
      }
      cur = cur.parentElement;
    }
    return false;
  }

  function placeFlagAfterName(nameEl, code) {
    if (!nameEl || !code) return;

    // Never add if GeoGuessr already shows a flag near the name
    if (hasNativeFlagNear(nameEl)) { processed.add(nameEl); return; }

    // Don’t add more than one of our own
    if (nameEl.nextElementSibling?.classList?.contains("gg-flag")) {
      const img = nameEl.nextElementSibling.querySelector("img");
      if (img) img.src = `${FLAG_BASE}/${code}.svg`;
      processed.add(nameEl);
      return;
    }

    const span = document.createElement("span");
    span.className = "gg-flag";
    const img = document.createElement("img");
    img.alt = "";
    img.decoding = "async";
    img.src = `${FLAG_BASE}/${code}.svg`;
    img.onerror = () => span.remove();
    span.appendChild(img);

    nameEl.insertAdjacentElement("afterend", span);
    processed.add(nameEl);
  }

  async function handleAnchor(a) {
    if (!a) return;
    const nameEl = a.querySelector(NAME_SEL);
    if (!nameEl || processed.has(nameEl)) return;

    // If GeoGuessr already has the flag near the name — do nothing.
    if (hasNativeFlagNear(nameEl)) { processed.add(nameEl); return; }

    const id = extractIdFromHref(a.getAttribute("href"));
    if (!id) return;

    const code = await getCountry(id);
    if (!code) { processed.add(nameEl); return; }

    // After await, the page might have inserted its own flag — check again
    if (hasNativeFlagNear(nameEl)) { processed.add(nameEl); return; }

    placeFlagAfterName(nameEl, code);
  }

  // Process only when the row is actually visible
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.unobserve(e.target);
      observed.delete(e.target);
      const anchor = e.target.closest(LINK_SEL) || e.target;
      handleAnchor(anchor);
    }
  }, { root: null, rootMargin: "0px 0px 200px 0px", threshold: 0 });

  function watchAnchor(a) {
    if (!a || observed.has(a)) return;
    observed.add(a);
    const nameEl = a.querySelector(NAME_SEL);
    io.observe(nameEl || a);
  }

  function scan(root) {
    if (!root || root.nodeType !== 1) return;
    root.querySelectorAll(LINK_SEL).forEach(watchAnchor);
  }

  // Continuously find new nodes
  const mo = new MutationObserver((muts) => {
    for (const m of muts) {
      if (m.addedNodes && m.addedNodes.length) {
        for (const n of m.addedNodes) scan(n);
      }
    }
  });

  function start() {
    if (!document.body) { requestAnimationFrame(start); return; }
    mo.observe(document.documentElement, { childList: true, subtree: true });
    scan(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start, { once: true });
  } else {
    start();
  }
})();
