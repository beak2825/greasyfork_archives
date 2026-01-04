// ==UserScript==
// @name         Smart Ad & Tracker Cleaner (EasyList + Peter Lowe)
// @namespace    https://example.com/tm/smart-ad-cleaner
// @version      1.0.1
// @description  Consumer-friendly ad & tracker removal using EasyList (cosmetic + network) + Peter Lowe hosts. Caches lists in localStorage (24h). Silent, standalone, preserves useful embeds (YouTube/Maps/Vimeo/etc.). Safe selectors only; avoids removing all scripts/iframes blindly.
// @author       Iamnobody
// @license      MIT
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      easylist.to
// @connect      pgl.yoyo.org
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/489796/Smart%20Ad%20%20Tracker%20Cleaner%20%28EasyList%20%2B%20Peter%20Lowe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489796/Smart%20Ad%20%20Tracker%20Cleaner%20%28EasyList%20%2B%20Peter%20Lowe%29.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // -------- CONFIG --------
  const EASYLIST_URL = "https://easylist.to/easylist/easylist.txt"; // cosmetic + network rules
  const PETER_LOWE_URL = "https://pgl.yoyo.org/adservers/serverlist.php?hostformat=hosts&showintro=0&mimetype=plaintext";
  const CACHE_KEY = "sm_ac_cache_v1"; // stores { ts, easylistText, peterText, selectors[], domains[] }
  const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
  const POLL_INTERVAL_MS = 3000; // periodically apply rules in first seconds
  const OBSERVE_DURATION_MS = 20000; // observe DOM for this many ms after load
  const MAX_SELECTOR_TRIES = 500; // limit to avoid heavy operations

  // Domains we MUST NOT remove (useful embeds)
  const ALLOW_DOMAINS = [
    "youtube.com", "youtu.be", "google.com/maps", "maps.google.com", "googleusercontent.com",
    "gstatic.com", "vimeo.com", "player.vimeo.com", "openstreetmap.org", "docs.google.com",
    "drive.google.com", "twitter.com", "t.co", "facebook.com", "instagram.com", "maps.googleapis.com"
  ];

  // Extra safe attribute selectors to remove if present (lightweight)
  const SAFE_ATTR_SELECTORS = [
    "[data-ad]", "[data-ads]", "[data-ad-client]", "[data-ad-slot]", "[data-qa='ad']"
  ];

  // -------- Storage helpers --------
  function lsGet(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (e) {
      return fallback;
    }
  }
  function lsSet(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      /* ignore quota errors silently */
    }
  }

  // -------- Fetch lists (GM_xmlhttpRequest) --------
  function fetchText(url) {
    return new Promise((resolve, reject) => {
      GM_xmlhttpRequest({
        method: "GET",
        url,
        responseType: "text",
        onload(resp) {
          if (resp.status >= 200 && resp.status < 300) resolve(resp.responseText);
          else reject(new Error("HTTP " + resp.status));
        },
        onerror(err) { reject(err); }
      });
    });
  }

  // -------- Parse rules --------
  function parseEasyList(text) {
    // extract cosmetic selectors: lines starting with "##" or "#@#"
    const selectors = new Set();
    const networkDomains = new Set();

    const lines = text.split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("!")) continue; // comment

      // cosmetic rule
      if (line.startsWith("##")) {
        const sel = line.slice(2).trim();
        if (sel) selectors.add(sel);
        continue;
      }
      // cosmetic exception with #@# (rare) - skip
      if (line.startsWith("#@#")) {
        // could be exceptions, ignore for blocking
        continue;
      }

      // network rule like "||example.com^" or "||example.com^$third-party"
      // try to extract domain
      if (line.startsWith("||")) {
        const rest = line.slice(2);
        const match = rest.match(/^([^\^\/\:\$]+)/);
        if (match && match[1]) {
          networkDomains.add(match[1]);
        }
        continue;
      }

      // domain anchored rules like "example.com##.ad" - skip
      const anchorMatch = line.match(/^([^\#\/\:\s]+)\#\#/);
      if (anchorMatch && anchorMatch[1]) {
        networkDomains.add(anchorMatch[1]);
      }
    }

    return { selectors: Array.from(selectors), domains: Array.from(networkDomains) };
  }

  function parsePeterLowe(text) {
    // hostfile lines: "0.0.0.0 domain.com" or "127.0.0.1 domain.com"
    const domains = new Set();
    const lines = text.split(/\r?\n/);
    for (const raw of lines) {
      const line = raw.trim();
      if (!line || line.startsWith("#")) continue;
      const parts = line.split(/\s+/);
      if (parts.length >= 2) {
        const d = parts[1].replace(/^\.*|\.*$/g, "");
        if (d && d.indexOf(":") === -1) domains.add(d);
      } else {
        // fallback: if line looks like a domain only
        if (line.indexOf(".") > -1 && !line.includes(" ")) domains.add(line);
      }
    }
    return Array.from(domains);
  }

  // -------- Utility --------
  function domainMatchInUrl(url, domain) {
    if (!url) return false;
    try {
      const u = url.toLowerCase();
      return u.includes(domain.toLowerCase());
    } catch (e) {
      return url.toLowerCase().indexOf(domain.toLowerCase()) !== -1;
    }
  }

  function isAllowedDomainInUrl(url) {
    if (!url) return false;
    for (const ad of ALLOW_DOMAINS) {
      if (url.indexOf(ad) !== -1) return true;
    }
    return false;
  }

  // -------- Apply rules safely --------
  function applySelectors(selectors) {
    if (!selectors || selectors.length === 0) return;
    let tries = 0;
    for (const sel of selectors) {
      if (tries++ > MAX_SELECTOR_TRIES) break;
      try {
        // Some selectors from lists can be invalid in the page context; guard with try/catch
        const nodes = document.querySelectorAll(sel);
        if (!nodes || nodes.length === 0) continue;
        nodes.forEach(n => {
          // protect critical site areas: don't remove if it is a top-level embed from allowed domains
          let src = "";
          if (n instanceof HTMLIFrameElement) src = n.src || "";
          else if (n instanceof HTMLImageElement) src = n.src || "";
          else src = (n.getAttribute && (n.getAttribute("src") || n.getAttribute("href"))) || "";
          if (src && isAllowedDomainInUrl(src)) return;
          try { n.remove(); } catch (e) { /* ignore */ }
        });
      } catch (e) {
        // ignore invalid selectors
      }
    }
  }

  function applyDomainBlocks(domains) {
    if (!domains || domains.length === 0) return;
    // Check scripts, images, iframes, link[href], source[src], audio/video, embed, object
    const tagAttrs = [
      { tag: "script", attr: "src" },
      { tag: "iframe", attr: "src" },
      { tag: "img", attr: "src" },
      { tag: "audio", attr: "src" },
      { tag: "video", attr: "src" },
      { tag: "source", attr: "src" },
      { tag: "link", attr: "href" },
      { tag: "embed", attr: "src" },
      { tag: "object", attr: "data" },
      { tag: "iframe", attr: "data-src" },
      { tag: "*", attr: "data-ad-src" } // custom attribute common in some ad frameworks
    ];

    // For performance, create a combined regex of domains (escaped), but cap length
    // We'll instead iterate over elements and check against domain list to avoid huge regex
    tagAttrs.forEach(({ tag, attr }) => {
      try {
        const nodes = tag === "*" ? document.querySelectorAll("[data-ad-src]") : document.getElementsByTagName(tag);
        if (!nodes || nodes.length === 0) return;
        Array.from(nodes).forEach(node => {
          try {
            const val = (node.getAttribute && node.getAttribute(attr)) || (node[attr] || "");
            if (!val) return;
            const v = val.toLowerCase();
            // allow if from allowed domains (preserve embeds)
            if (isAllowedDomainInUrl(v)) return;
            // Check any domain substring match
            for (const d of domains) {
              if (d.length < 3) continue;
              if (v.indexOf(d.toLowerCase()) !== -1) {
                // remove node (but avoid removing top-level <html> etc.)
                node.remove();
                break;
              }
            }
          } catch (e) { /* ignore per node */ }
        });
      } catch (e) { /* ignore per tag */ }
    });

    // Additionally, remove elements that have obvious ad-related attributes (safe ones)
    SAFE_ATTR_SELECTORS.forEach(sel => {
      try {
        document.querySelectorAll(sel).forEach(n => n.remove());
      } catch (e) { /* ignore invalid */ }
    });
  }

  // -------- Core: fetch + cache + apply --------
  async function prepareAndApply() {
    try {
      // Load cached
      let cache = lsGet(CACHE_KEY, null);
      const now = Date.now();
      let needFetch = true;
      if (cache && cache.ts && (now - cache.ts) < CACHE_TTL_MS && cache.selectors && cache.domains) {
        needFetch = false;
      }

      if (needFetch) {
        // fetch both lists concurrently
        const [easyText, peterText] = await Promise.allSettled([fetchText(EASYLIST_URL), fetchText(PETER_LOWE_URL)]);
        let easy = "";
        let peter = "";
        if (easyText.status === "fulfilled") easy = easyText.value;
        if (peterText.status === "fulfilled") peter = peterText.value;

        const parsed = parseEasyList(easy);
        const peterDomains = parsePeterLowe(peter);

        // merge domain lists (unique)
        const domainsSet = new Set([...(parsed.domains || []), ...(peterDomains || [])]);

        cache = {
          ts: now,
          easyText: easy,
          peterText: peter,
          selectors: parsed.selectors || [],
          domains: Array.from(domainsSet)
        };
        lsSet(CACHE_KEY, cache);
      }

      // apply rules now
      if (cache && cache.selectors) applySelectors(cache.selectors);
      if (cache && cache.domains) applyDomainBlocks(cache.domains);

    } catch (e) {
      // silent fail (per user choice)
      // console.error("Smart Ad Cleaner error:", e);
    }
  }

  // Run apply repeatedly for the first OBSERVE_DURATION_MS ms to catch late-load ads
  async function runCleaner() {
    await prepareAndApply();
    const start = Date.now();
    const interval = setInterval(async () => {
      await prepareAndApply();
      if (Date.now() - start > OBSERVE_DURATION_MS) clearInterval(interval);
    }, POLL_INTERVAL_MS);

    // MutationObserver to catch dynamic insertions quickly
    const mo = new MutationObserver(muts => {
      // quick run, but keep it light — call prepareAndApply() which uses cached parsed selectors/domains
      prepareAndApply();
    });
    try {
      mo.observe(document.documentElement || document.body, { childList: true, subtree: true });
      // stop observer after OBSERVE_DURATION_MS
      setTimeout(() => mo.disconnect(), OBSERVE_DURATION_MS + 2000);
    } catch (e) {
      // ignore observe errors
    }
  }

  // Kick off (don't wait for load; run at document-end)
  runCleaner();

  // Also schedule a daily background refresh of lists (non-blocking)
  (async function refreshCacheDaily() {
    const cache = lsGet(CACHE_KEY, null);
    const now = Date.now();
    if (!cache || !cache.ts || (now - cache.ts) > CACHE_TTL_MS) {
      try { await prepareAndApply(); } catch (e) { /* silent */ }
    }
  })();

})();
