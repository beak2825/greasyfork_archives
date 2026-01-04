// ==UserScript==
// @name         market Favs
// @namespace    zed.market.favs
// @version      1.0.2
// @description  Pin your favorite items so you can see the price history on any page, includes live updates without visiting the market
// @author       MathewPerry
// @match        https://www.zed.city/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/545075/market%20Favs.user.js
// @updateURL https://update.greasyfork.org/scripts/545075/market%20Favs.meta.js
// ==/UserScript==


(function () {
  // ===============================
  // Config
  // ===============================
  const PINNED_ITEM_LIMIT = 12;
  const MARKET_KEY = "Zed-market-data";
  const HISTORY_KEY = "Zed-market-data-history";
  const PINNED_KEY = "Zed-pinned-items";
  const COLLAPSE_KEY = "Zed-pinned-collapsed";
  const LAST_SUCCESS_KEY = "Zed-market-last-success";// last successful save (ms)
  const NEXT_ALLOWED_KEY = "Zed-market-next-allowed";// earliest next attempt (ms)
  const HISTORY_LIMIT = 50;
  const STALE_MS = 10 * 60 * 1000;
  const POLL_MS = 60 * 1000;
  const RETRY_MIN_MS = 5 * 1000;// at least 5s between retries
  const RETRY_MAX_MS = 5 * 60 * 1000;// cap at 5m
  const DEBUG = false;

  // Compact UI tuning
  const SPARK_W = 100;
  const SPARK_H = 22;

  const isCollapsed = () => localStorage.getItem(COLLAPSE_KEY) === "1";
  const setCollapsed = (v) => localStorage.setItem(COLLAPSE_KEY, v ? "1" : "0");
  const log = (...a) => DEBUG && console.log("[zed-market-data]", ...a);

  // Init stores if missing
  for (const k of [MARKET_KEY, HISTORY_KEY]) {
    if (!localStorage.getItem(k)) localStorage.setItem(k, JSON.stringify({}));
  }

  // ===============================
  // Utils
  // ===============================
  const normalizeName = (name) => (name || "").replace(/[★☆]/g, "").trim().toLowerCase();
  const getPinnedItems = () => [...new Set(JSON.parse(localStorage.getItem(PINNED_KEY) || "[]").map(normalizeName))];
  const setPinnedItems = (items) => localStorage.setItem(PINNED_KEY, JSON.stringify([...new Set(items.map(normalizeName))]));
  const getMarket = () => JSON.parse(localStorage.getItem(MARKET_KEY) || "{}");
  const setMarket = (obj) => localStorage.setItem(MARKET_KEY, JSON.stringify(obj || {}));
  const getHistory = () => JSON.parse(localStorage.getItem(HISTORY_KEY) || "{}");
  const setHistory = (obj) => localStorage.setItem(HISTORY_KEY, JSON.stringify(obj || {}));

  function appendHistory(name, price) {
    try {
      const now = Date.now();
      const bag = getHistory();
      const k = normalizeName(name);
      const cur = bag[k] || { v: 2, h: [] };
      const last = cur.h.at?.(-1);
      if (!last || Number(last[1]) !== Number(price)) {
        cur.h.push([now, Number(price)]);
        if (cur.h.length > HISTORY_LIMIT) cur.h = cur.h.slice(-HISTORY_LIMIT);
        bag[k] = cur;
        setHistory(bag);
      }
    } catch (e) {
      console.error("[zed-market-data] appendHistory failed:", e);
    }
  }

  function extractItems(apiResponse) {
    if (!apiResponse) return null;
    if (Array.isArray(apiResponse.items)) return apiResponse.items;
    if (Array.isArray(apiResponse)) return apiResponse; // tolerate bare array
    if (apiResponse.data && Array.isArray(apiResponse.data.items)) return apiResponse.data.items;
    return null;
  }

  function saveMarketPrices(apiResponse) {
    try {
      const items = extractItems(apiResponse);
      if (!items) return;

      const market = getMarket();
      for (const item of items) {
        if (!item || typeof item.name !== "string") continue;
        const name = item.name;
        const price = Number(item.market_price);
        if (!Number.isFinite(price)) continue;
        market[name] = price;
        appendHistory(name, price);
      }
      setMarket(market);

      const now = Date.now();
      localStorage.setItem(LAST_SUCCESS_KEY, String(now));
      // After success, next attempt is after POLL_MS
      localStorage.setItem(NEXT_ALLOWED_KEY, String(now + POLL_MS));

      window.dispatchEvent(new CustomEvent("zed:marketDataUpdated", { detail: now }));
    } catch (e) {
      console.error("[zed-market-data] saveMarketPrices failed:", e);
    }
  }

  // ===============================
  // Capture market prices (XHR + fetch hooks)
  // ===============================
  const _open = XMLHttpRequest.prototype.open;
  const _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.open = function (method, url) { this._zed_url = url; return _open.apply(this, arguments); };
  XMLHttpRequest.prototype.send = function () {
    this.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        try {
          const url = this._zed_url || "";
          if (typeof url === "string" && url.includes("getMarket") && !url.includes("getMarketUser")) {
            const resp = JSON.parse(this.responseText);
            saveMarketPrices(resp);
          }
        } catch (_) {}
      }
    });
    return _send.apply(this, arguments);
  };

  const _origFetch = window.fetch;
  window.fetch = async function (...args) {
    const res = await _origFetch.apply(this, args);
    try {
      const req = args[0];
      const url = typeof req === "string" ? req : (req && req.url) || "";
      if (url.includes("getMarket") && !url.includes("getMarketUser")) {
        const clone = res.clone();
        const json = await clone.json();
        saveMarketPrices(json);
      }
    } catch (_) {}
    return res;
  };

  // ===============================
  // Active poller with backoff (runs on ANY zed.city page)
  // ===============================
  let pollInFlight = false;
  let backoffMs = RETRY_MIN_MS;

  function scheduleNextAllowed(delayMs) {
    const when = Date.now() + delayMs;
    localStorage.setItem(NEXT_ALLOWED_KEY, String(when));
    return when;
  }

  async function pollMarketOnce() {
    if (pollInFlight) return;
    pollInFlight = true;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15s safety
      const res = await _origFetch("https://api.zed.city/getMarket", {
  signal: controller.signal,
  cache: "no-store",
  mode: "cors",
  credentials: "include",
});
      clearTimeout(timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      saveMarketPrices(json);

      // success → reset backoff & schedule next at POLL_MS
      backoffMs = RETRY_MIN_MS;
      scheduleNextAllowed(POLL_MS);
    } catch (e) {
      log("poll error:", e?.message || e);
      // failure → exponential backoff (min 5s) + jitter
      const jitter = Math.floor(Math.random() * 1000);
      backoffMs = Math.min(Math.max(backoffMs * 2, RETRY_MIN_MS), RETRY_MAX_MS);
      scheduleNextAllowed(backoffMs + jitter);
    } finally {
      pollInFlight = false;
    }
  }

  function startMarketPoller() {
    if (!localStorage.getItem(NEXT_ALLOWED_KEY)) {
      localStorage.setItem(NEXT_ALLOWED_KEY, "0");
    }

    const now = Date.now();
    const nextAllowed = Number(localStorage.getItem(NEXT_ALLOWED_KEY) || 0);
    const lastSuccess = Number(localStorage.getItem(LAST_SUCCESS_KEY) || 0);
    if (now >= nextAllowed && (now - lastSuccess >= POLL_MS)) {
      pollMarketOnce();
    }

    // 1s tick to decide whether we can poll
    setInterval(() => {
      const now = Date.now();
      const nextAllowed = Number(localStorage.getItem(NEXT_ALLOWED_KEY) || 0);
      const lastSuccess = Number(localStorage.getItem(LAST_SUCCESS_KEY) || 0);
      if (now >= nextAllowed && (now - lastSuccess >= POLL_MS)) {
        pollMarketOnce();
      }
    }, 1000);

    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) {
        const now = Date.now();
        const nextAllowed = Number(localStorage.getItem(NEXT_ALLOWED_KEY) || 0);
        const lastSuccess = Number(localStorage.getItem(LAST_SUCCESS_KEY) || 0);
        if (now >= nextAllowed && (now - lastSuccess >= POLL_MS)) {
          pollMarketOnce();
        }
      }
    });
  }

  // ===============================
  // UI helpers
  // ===============================
  function getMarketHost() {
    return (
      document.querySelector(".zed-grid.has-title.has-content") ||
      document.querySelector(".zed-grid.has-content") ||
      document.querySelector(".zed-grid") ||
      document.querySelector(".q-page-container") ||
      document.querySelector(".q-px-xs")
    );
  }

  function ensurePinnedBar(host) {
    let pinnedDiv = document.getElementById("pinnedItems");
    if (!pinnedDiv) {
      pinnedDiv = document.createElement("div");
      pinnedDiv.id = "pinnedItems";
      pinnedDiv.style = `
        background: rgba(0,0,0,0.5);
        border: 1px solid #666;
        padding: 8px 10px;         /* compact */
        margin: 6px 0 10px;        /* compact */
        border-radius: 8px;
        color: #fff;
        font-size: 13px;
        width: 100%;
        display: block;
        box-sizing: border-box;
        grid-column: 1 / -1;
      `;
      if (host.firstChild) host.insertBefore(pinnedDiv, host.firstChild);
      else host.appendChild(pinnedDiv);
    } else {
      if (pinnedDiv.parentElement === host && host.firstChild !== pinnedDiv) {
        host.insertBefore(pinnedDiv, host.firstChild);
      }
      pinnedDiv.style.gridColumn = "1 / -1";
      pinnedDiv.style.width = "100%";
      pinnedDiv.style.display = "block";
    }
    return pinnedDiv;
  }

  function renderSparkline(el, series, w = SPARK_W, h = SPARK_H, pad = 2) {
    el.innerHTML = "";
    if (!series || series.length < 2) return;
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    el.appendChild(c);
    const ctx = c.getContext("2d");

    const ys = series.map(p => Number(p[1])).filter(Number.isFinite);
    const n = ys.length; if (n < 2) return;

    const min = Math.min(...ys), max = Math.max(...ys);
    const span = Math.max(1, max - min);
    const x = (i) => pad + (i * (w - pad * 2)) / (n - 1);
    const y = (val) => h - pad - ((val - min) * (h - pad * 2)) / span;

    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(x(0), y(ys[0]));
    for (let i = 1; i < n; i++) ctx.lineTo(x(i), y(ys[i]));
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(x(n - 1), y(ys[n - 1]), 1.5, 0, Math.PI * 2);
    ctx.fill();
  }

  // ===============================
  // UI: Pinned bar + toggle
  // ===============================
  function renderPinnedItems() {
      if (document.documentElement.hasAttribute('data-mail')) return;
    try {
      const host = getMarketHost();
      if (!host) { setTimeout(renderPinnedItems, 500); return; }
      const pinnedDiv = ensurePinnedBar(host);
      const pinned = getPinnedItems();
      const market = getMarket();
      const history = getHistory();

      pinnedDiv.innerHTML = "";

      // Header
      const header = document.createElement("div");
      header.style = "display:flex;align-items:center;gap:10px;justify-content:space-between;flex-wrap:wrap;";

      const leftHdr = document.createElement("div");
      leftHdr.style = "display:flex;align-items:center;gap:8px;";

      const title = document.createElement("strong");
      title.textContent = "⭐ Pinned Items";

      const tsSpan = document.createElement("span");
      tsSpan.id = "pinned-last-updated";
      tsSpan.style = "opacity:.8;font-size:12px;";

      leftHdr.appendChild(title);
      leftHdr.appendChild(tsSpan);

      const rightHdr = document.createElement("div");
      rightHdr.style = "display:flex;align-items:center;gap:8px;";

      const tip = document.createElement("div");
      tip.textContent = "";
      tip.style = "opacity:.8;font-size:12px;";

      const toggleBtn = document.createElement("button");
      toggleBtn.textContent = isCollapsed() ? "▸" : "▾";
      toggleBtn.title = (isCollapsed() ? "Show" : "Hide") + " market ticker";
      toggleBtn.style = `
        cursor:pointer;border:1px solid #666;border-radius:6px;background:rgba(255,255,255,0.08);
        color:#fff;font-size:12px;line-height:1;padding:4px 8px;
      `;
      toggleBtn.onclick = () => { setCollapsed(!isCollapsed()); renderPinnedItems(); };

      rightHdr.appendChild(tip);
      rightHdr.appendChild(toggleBtn);
      header.appendChild(leftHdr);
      header.appendChild(rightHdr);
      pinnedDiv.appendChild(header);

      if (pinned.length === 0) {
        pinnedDiv.appendChild(Object.assign(document.createElement("i"), { textContent: "No pinned items" }));
        return;
      }

      const lastTs = Number(localStorage.getItem(LAST_SUCCESS_KEY) || 0) ||
        Object.values(history).map(v => v?.h?.at?.(-1)?.[0]).filter(Boolean).sort((a, b) => b - a)[0];
      if (lastTs) {
        const age = Date.now() - lastTs;
        const mins = Math.floor(age / 60000);
        tsSpan.textContent = `Last updated: ${mins ? `${mins}m` : "just now"} ago`;
      } else {
        tsSpan.textContent = `(waiting for market data…)`;
      }

      // Collapsed? keep header only.
      if (isCollapsed()) return;

      // Rows container (compact)
      const rows = document.createElement("div");
      rows.style = `
        display:grid;
        grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); /* was 260px */
        gap: 4px 8px;            /* tighter spacing */
        margin-top: 6px;         /* compact */
        width: 100%;
      `;
      pinnedDiv.appendChild(rows);

      for (const pinnedName of pinned) {
        const displayKey = Object.keys(market).find(k => normalizeName(k) === pinnedName);
        const displayName = displayKey || pinnedName;
        const price = displayKey ? market[displayKey] : null;

        const hist = history[pinnedName] || history[normalizeName(displayName)] || history[normalizeName(pinnedName)];
        const series = hist?.h || [];
        const first = series.length ? series[0][1] : null;
        const last = series.length ? series.at?.(-1)?.[1] : price;

        const pct = (first && last) ? ((Number(last) - Number(first)) / Number(first)) * 100 : null;
        const isUp = pct != null && pct >= 0;

        const isStale = series.length
          ? (Date.now() - (series.at?.(-1)?.[0] || 0) > STALE_MS)
          : true;

        const row = document.createElement("div");
        row.style = `
          display:flex; align-items:center; justify-content:space-between;
          column-gap: 8px;
          padding:4px 6px;                 /* compact */
          border-radius:6px;
          border:1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.04);
          ${isStale ? "opacity:.85;" : ""}
        `;

        const left = document.createElement("div");
        left.style = "display:flex;align-items:center;gap:6px;min-width:0;flex:1;";

        const nameSpan = document.createElement("span");
        nameSpan.textContent = displayName;
        nameSpan.style = `
          cursor:pointer;
          white-space:nowrap; overflow:hidden; text-overflow:ellipsis;
          flex: 1 1 50%;     /* ensure ~1/2+ width before truncation */
          min-width: 45%;
        `;
        nameSpan.title = "Click to search this item";
        nameSpan.onclick = () => {
          const input = document.querySelector("input[type='text']");
          if (input) {
            input.value = displayName;
            input.dispatchEvent(new Event("input", { bubbles: true }));
          }
        };

        const spark = document.createElement("span");
        spark.className = "spark";
        spark.style = `
          display:inline-block;
          width:${SPARK_W}px; height:${SPARK_H}px;
          flex: 0 0 ${SPARK_W}px;
        `;

        left.appendChild(nameSpan);
        left.appendChild(spark);

        const right = document.createElement("div");
        right.style = "display:flex;align-items:center;gap:6px;flex:0 0 auto;";

        const priceSpan = document.createElement("span");
        priceSpan.textContent = price != null ? `$${Number(price).toLocaleString()}` : "N/A";
        priceSpan.style = "font-variant-numeric: tabular-nums;";

        const pctSpan = document.createElement("span");
        if (pct != null && isFinite(pct)) {
          pctSpan.textContent = `${isUp ? "+" : ""}${pct.toFixed(1)}%`;
          pctSpan.style = `
            font-size:12px;padding:1px 6px;border-radius:999px;
            background:${isUp ? "rgba(0,200,0,.15)" : "rgba(220,0,0,.15)"};
            color:${isUp ? "#7CFC9A" : "#FFAAAA"};
            white-space:nowrap;
          `;
        }

        right.appendChild(priceSpan);
        if (pctSpan.textContent) right.appendChild(pctSpan);

        row.appendChild(left);
        row.appendChild(right);
        rows.appendChild(row);

        try { renderSparkline(spark, series); } catch (_) {}
      }
    } catch (e) {
      console.error("[zed-market-data] renderPinnedItems failed:", e);
    }
  }

  // ===============================
  // Stars in market list
  // ===============================
  function injectStarsIntoMarketItems() {
    const items = document.querySelectorAll(".q-item");
    if (!items.length) return;
    const pinned = getPinnedItems();

    items.forEach((item) => {
      const label = item.querySelector(".q-item__label");
      if (!label) return;

      const rawText = label.textContent.trim();
      const itemName = rawText.split("\n")[0].trim();
      if (!itemName) return;

      const normName = normalizeName(itemName);

      let star = label.querySelector(".market-fav-star");
      const storedName = star?.dataset?.itemName;

      if (!star || normalizeName(storedName) !== normName) {
        if (star) star.remove();

        label.style.position = "relative";

        star = document.createElement("span");
        star.className = "market-fav-star";
        star.innerHTML = pinned.includes(normName) ? "★" : "☆";
        star.dataset.itemName = itemName;
        star.title = "Click to pin/unpin";
        star.style.cssText = `
          position:absolute; top:2px; right:5px; font-size:1.2em;
          cursor:pointer; color:gold; z-index:10; user-select:none;
        `;

        star.onclick = (e) => {
          e.stopPropagation();
          e.preventDefault();

          let list = getPinnedItems();
          const index = list.findIndex((p) => p === normName);

          if (index >= 0) {
            list.splice(index, 1);
            star.innerHTML = "☆";
          } else {
            if (list.length >= PINNED_ITEM_LIMIT) {
              alert(`You can only pin up to ${PINNED_ITEM_LIMIT} items.`);
              return;
            }
            list.push(normName);
            star.innerHTML = "★";
          }

          setPinnedItems(list);
          renderPinnedItems();
        };

        label.appendChild(star);
        log("Injected/Updated star:", itemName);
      } else {
        star.innerHTML = pinned.includes(normName) ? "★" : "☆";
      }
    });
  }

  function hookSearchBar() {
    const input = document.querySelector("input[type='text']");
    if (!input) { setTimeout(hookSearchBar, 500); return; }
    input.addEventListener("input", () => setTimeout(injectStarsIntoMarketItems, 300));
  }

  function observeMarket() {
      if (document.documentElement.hasAttribute('data-mail')) return;
    const container =
      document.querySelector(".zed-grid.has-title.has-content") ||
      document.querySelector(".zed-grid.has-content") ||
      document.querySelector(".zed-grid");

    if (!container) { setTimeout(observeMarket, 500); return; }

    const observer = new MutationObserver(() => { debounceInjectStars(); });
    observer.observe(container, { childList: true, subtree: true });

    injectStarsIntoMarketItems();
    renderPinnedItems();
    hookSearchBar();
  }

  let lastInjectTime = 0;
  function debounceInjectStars() {
    const now = Date.now();
    if (now - lastInjectTime > 300) { lastInjectTime = now; injectStarsIntoMarketItems(); }
  }

    // ===============================
    // URL handling
    // ===============================
    function updateMailFlag() {
        document.documentElement.toggleAttribute('data-mail', location.pathname.startsWith('/mail'));
    }

    // rAF-throttled renderer to avoid bursty reflows
    let _renderScheduled = false;
    function scheduleRender() {
        if (_renderScheduled) return;
        _renderScheduled = true;
        requestAnimationFrame(() => {
            _renderScheduled = false;
            renderPinnedItems();
        });
    }

    function handleURL() {
        // set/clear the mail flag every time we "navigate"
        updateMailFlag();

        // Render the bar anywhere a suitable host exists (not just /market)
        setTimeout(() => { if (getMarketHost()) scheduleRender(); }, 300);

        // Stars only make sense on the market page
        if (location.pathname.includes("/market")) setTimeout(observeMarket, 500);
    }

    // ===============================
    // Boot
    // ===============================
    // Hide pinned ticker completely on /mail via attribute on <html>
    (() => {
        const hideTickerCSS = document.createElement('style');
        hideTickerCSS.textContent = `html[data-mail] #pinnedItems{display:none!important;}`;
        document.head.appendChild(hideTickerCSS);
    })();

    window.addEventListener("zed:marketDataUpdated", scheduleRender);
    window.addEventListener("hashchange", handleURL);
    window.addEventListener("popstate", handleURL);

    // Wrap history once (don’t re-wrap elsewhere)
    const _pushState = history.pushState;
    history.pushState = function (...args) { const r = _pushState.apply(this, args); handleURL(); return r; };
    const _replaceState = history.replaceState;
    history.replaceState = function (...args) { const r = _replaceState.apply(this, args); handleURL(); return r; };

    // Lightweight route watcher: history hooks + mild pathname poll
    (() => {
        document.addEventListener('visibilitychange', () => { if (!document.hidden) handleURL(); });

        let last = location.pathname;
        setInterval(() => {
            const cur = location.pathname;
            if (cur !== last) { last = cur; handleURL(); }
        }, 1500); // was 250ms; reduce wakeups
    })();

    console.log("[zed-market-data] loaded v1.0.2");
    startMarketPoller();
    handleURL(); // initial run

})();