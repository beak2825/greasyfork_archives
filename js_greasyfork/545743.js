// ==UserScript==
// @name         Zed.City – QOL Update By MathewPerry
// @namespace    zed.city.aio
// @version      1.7.0
// @description  Could I *BE* any more scripts!? (Market Favs, Profit Helper, Inventory Net Worth, Timer Bar, Exploration Data, Auto fill for selling, Store Remaining Amount + Rad ROI Tracker + Durability converter + Market Buy Tracker + Gym Tracker). Each feature can be toggled from the cog in the header.
// @author       MathewPerry
// @match        https://www.zed.city/*
// @run-at       document-idle
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zed.city
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545743/ZedCity%20%E2%80%93%20QOL%20Update%20By%20MathewPerry.user.js
// @updateURL https://update.greasyfork.org/scripts/545743/ZedCity%20%E2%80%93%20QOL%20Update%20By%20MathewPerry.meta.js
// ==/UserScript==

(function() {
  'use strict';

  const SETTINGS_KEY = 'zed-aio-settings';
  const DefaultSettings = {
    marketFavs: true,
    profitHelper: true,
    networth: true,
    timerBar: true,
    explorationData: true,
    marketSelling: true,
    storeRemainingAmounts: true,
    radTracker: true,
    durability: true,
    marketBuyTracker: true,
    gymTracker: true

  };
  function readSettings(){
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return Object.assign({}, DefaultSettings, raw ? JSON.parse(raw) : {});
    } catch(e) {
      return Object.assign({}, DefaultSettings);
    }
  }
  function writeSettings(s){ localStorage.setItem(SETTINGS_KEY, JSON.stringify(s)); }
  let SETTINGS = readSettings();

  // Find the exact toolbar row and insert Options button as FIRST child (left)
  function findToolbarRow(){
    const exact = document.querySelector('div.q-gutter-xs.row.items-center.no-wrap.col-xs-4.order-xs-first.order-sm-none.col-sm-auto.justify-end');
    if (exact) return exact;
    return document.querySelector('.q-toolbar .row.justify-end') || document.querySelector('.q-header .row.justify-end');
  }

  function mountOptions(){
    const row = findToolbarRow();
    if (!row) return;
    if (row.querySelector('.zed-aio-opts-btn')) return;

    const btn = document.createElement('button');
    btn.className = 'zed-aio-opts-btn q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--round text-grey-7 q-btn--actionable q-focusable q-hoverable';
    btn.type = 'button';
    btn.setAttribute('aria-label', 'Options');
    btn.innerHTML = '<span class="q-focus-helper"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon fal fa-cog" aria-hidden="true"></i></span>';
    row.insertBefore(btn, row.firstChild);

    const panel = document.createElement('div');
    panel.className = 'zed-aio-opts-panel';
    panel.style.cssText = 'position:absolute;z-index:9999;margin-top:8px;padding:10px 12px;border-radius:8px;background:rgba(20,20,20,.98);border:1px solid rgba(255,255,255,.12);box-shadow:0 6px 20px rgba(0,0,0,.35);color:#ddd;font-size:10px;display:none;left:0;transform:translateX(-24px);width:200px;';
    panel.innerHTML = [
      '<div style="font-weight:200;margin-bottom:8px">Options</div>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="marketFavs">Market Favs</label>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="profitHelper">Profit Helper</label>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="networth">Networth</label>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="timerBar">Timer Bar</label>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="explorationData">Exploration Data</label>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="marketSelling">Auto Fill sell price</label>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="storeRemainingAmounts">Shows Store amounts</label>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="radTracker">Shows ROI on Rad Spent</label>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="durability">Shows durability on items</label>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="marketBuyTracker">Shows Market buy history</label>',
      '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="gymTracker">Gym Tracker</label>',


      '<div style="opacity:.75;margin-top:8px">Page will reload to apply.</div>'
    ].join('');
    btn.style.position = 'relative';
    btn.appendChild(panel);

    panel.querySelectorAll('input[type=checkbox][data-k]').forEach(cb => {
      const k = cb.getAttribute('data-k');
      cb.checked = !!SETTINGS[k];
      cb.addEventListener('change', () => {
        SETTINGS[k] = cb.checked;
        writeSettings(SETTINGS);
        location.reload();
      });
    });

    let open = false;
    function show(){ panel.style.display = 'block'; open = true; }
    function hide(){ panel.style.display = 'none'; open = false; }
    btn.addEventListener('click', (e) => { e.stopPropagation(); open ? hide() : show(); });
    document.addEventListener('click', (e) => { if (open && !btn.contains(e.target)) hide(); });
    document.addEventListener('keydown', (e) => { if (open && e.key === 'Escape') hide(); });
  }

  // Retry mount in case SPA header loads late
  (function retryMount(){
    let tries = 0;
    const t = setInterval(() => {
      tries++;
      mountOptions();
      if (findToolbarRow() && tries > 1 || tries > 60) clearInterval(t);
    }, 250);
  })();

  // ---------- Module gates ----------
  const RUN_MARKET = !!SETTINGS.marketFavs;
  const RUN_PROFIT = !!SETTINGS.profitHelper;
  const RUN_NETWORTH = !!SETTINGS.networth;
  const RUN_TIMERS = !!SETTINGS.timerBar;
  const RUN_EXPLORATION = !!SETTINGS.explorationData;
  const RUN_MARKETSELLING = !!SETTINGS.marketSelling;
  const RUN_STOREREMAININGAMOUNTS = !!SETTINGS.storeRemainingAmounts;
  const RUN_RADTRACKER = !!SETTINGS.radTracker;
  const RUN_DURABILITY = !!SETTINGS.durability;
  const RUN_MARKETBUYTRACKER = !!SETTINGS.marketBuyTracker;
  const RUN_GYMTRACKER = !!SETTINGS.gymTracker;



// ===============================
// NetBus (hardened, private, no CSRF exposure)
// ===============================
(function NetBus(){
  const FLAG_XHR = '__zedNetBusXHR';
  const FLAG_FETCH = '__zedNetBusFetch';

  // Private in-closure bus (not on window)
  const Bus = new EventTarget();

  // Compat shim: same API name your modules already use
  // Returns an unsubscribe function.
  window.addNetListener = function addNetListener(pattern, handler){
    const re = pattern instanceof RegExp ? pattern : new RegExp(String(pattern), 'i');
    const listener = (e) => {
      const { url = '', response, source } = e.detail || {};
      if (re.test(url)) handler(url, response, source);
    };
    Bus.addEventListener('net', listener);
    return () => Bus.removeEventListener('net', listener);
  };

  // Scrub likely secrets before emitting to modules (belt & braces)
  function scrub(obj){
    try {
      return JSON.parse(JSON.stringify(obj, (k, v) => (
        /csrf|token|auth|session|secret|cookie/i.test(k) ? undefined : v
      )));
    } catch { return null; }
  }

  // ---- XHR wrapper (guarded) ----
  if (!XMLHttpRequest.prototype[FLAG_XHR]) {
    const originalOpen = XMLHttpRequest.prototype.open;
    const originalSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function (method, url) {
      this._zedURL = url;
      return originalOpen.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
      this.addEventListener('readystatechange', function(){
        if (this.readyState === 4) {
          try {
            if (this.responseType && this.responseType !== '' && this.responseType !== 'text') return;
            const text = this.responseText || '';
            const first = text[0];
            if (!text || (first !== '{' && first !== '[')) return; // quick JSON gate
            const json = JSON.parse(text);
            const clean = scrub(json);
            // Emit ONLY on the private bus
            Bus.dispatchEvent(new CustomEvent('net', {
              detail: { url: this._zedURL || '', response: clean, source: 'xhr' }
            }));
          } catch(e){}
        }
      });
      return originalSend.apply(this, arguments);
    };
    Object.defineProperty(XMLHttpRequest.prototype, FLAG_XHR, { value: true, configurable: false });
  }

  // ---- fetch wrapper (guarded) ----
  if (!window[FLAG_FETCH]) {
    const origFetch = window.fetch;
    window.fetch = async function(){
      const res = await origFetch.apply(this, arguments);
      try {
        const clone = res.clone();
        const ct = clone.headers.get('content-type') || '';
        if (ct.includes('application/json')) {
          const json = await clone.json();
          const clean = scrub(json);
          const req = arguments[0];
          const url = typeof req === 'string' ? req : (req && req.url) || '';
          Bus.dispatchEvent(new CustomEvent('net', {
            detail: { url, response: clean, source: 'fetch' }
          }));
        }
      } catch(e){}
      return res;
    };
    Object.defineProperty(window, FLAG_FETCH, { value: true, configurable: false });
  }
})();

    //-----Marketdata, always run -------
    // ===============================
      // Config
      // ===============================
      const PINNED_ITEM_LIMIT = 100;
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
    const lastTs = Number(last?.[0] || 0);
    const lastVal = Number(last?.[1]);

    // append if price changed OR last update was > 60 minutes ago
    if (!last || lastVal !== Number(price) || (now - lastTs) > 60 * 60 * 1000) {
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

              // Also capture stats for instant timers
              if (typeof url === "string" && url.includes("getStats")) {
                try {
                  const stats = JSON.parse(this.responseText);
                  if (window.zedApplyStats) window.zedApplyStats(stats);
                } catch(_) {}
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
      // Active poller with backoff
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
          const timeout = setTimeout(() => controller.abort(), 15000);
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


      // ---------- Market Favs ----------
      function run_MarketFavs(){



    (function () {



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

    function findNavShell() {
      // inner row with the <a> tabs
      const tabsContent = document.querySelector(
        ".q-tabs__content.scroll--mobile.row.no-wrap.items-center.self-stretch.hide-scrollbar.relative-position.q-tabs__content--align-center"
      );
      if (!tabsContent) return null;

      // the q-tabs component
      const qtabs = tabsContent.closest(".q-tabs");

      // the outer bar wrapper you showed (preferred anchor)
      const shell =
        qtabs?.closest(".gt-xs.bg-grey-3.text-grey-5.text-h6") ||
        qtabs?.parentElement || // fallback: parent of .q-tabs
        tabsContent;

      return shell;
    }

    function findStickyAncestor(el) {
      let cur = el;
      while (cur && cur !== document.body) {
        const cs = getComputedStyle(cur);
        if (cs.position === "sticky" || cs.position === "fixed") return cur;
        cur = cur.parentElement;
      }
      return null;
    }

    function ensurePinnedBar() {
      // the inner row with the <a> tabs
      const tabsContent = document.querySelector(
        ".q-tabs__content.scroll--mobile.row.no-wrap.items-center.self-stretch.hide-scrollbar.relative-position.q-tabs__content--align-center"
      );
      if (!tabsContent) return null;

      // (re)use/create bar
      let pinnedDiv = document.getElementById("pinnedItems");
      if (!pinnedDiv) {
        pinnedDiv = document.createElement("div");
        pinnedDiv.id = "pinnedItems";
        pinnedDiv.style = `
          background: rgba(0,0,0,0.5);
          border: 1px solid #666;
          padding: 5px 0px;
          margin: 0px 0 0px;
          border-radius: 0px;
          color: #fff;
          font-size: 12px;
          width: 100%;
          box-sizing: border-box;
          display: block;
          flex: 0 0 100%;
          align-self: stretch;
          position: relative; /* normal flow so it scrolls away */
        `;
      }

      // Find the sticky/fixed ancestor (likely the header)
      const sticky = findStickyAncestor(tabsContent) ||
                     tabsContent.closest(".q-header, .q-layout__header");

      // Prefer to insert as the FIRST child of the main scrolling container
      const pageContainer = (sticky && sticky.nextElementSibling && sticky.nextElementSibling.matches(".q-page-container"))
        ? sticky.nextElementSibling
        : document.querySelector(".q-page-container") ||
          document.querySelector(".zed-grid.has-title.has-content, .zed-grid.has-content, .zed-grid") ||
          document.querySelector(".q-page"); // fallbacks

      if (pageContainer) {
        // Put our bar at the very top of the scrolled page content (below the header)
        pageContainer.insertBefore(pinnedDiv, pageContainer.firstChild);
        pinnedDiv.dataset.anchor = "below-sticky-header";
        return pinnedDiv;
      }

      // Last resort: place right after the sticky header element itself
      if (sticky && sticky.parentNode) {
        sticky.insertAdjacentElement("afterend", pinnedDiv);
        pinnedDiv.dataset.anchor = "below-sticky-header";
        return pinnedDiv;
      }

      // If we got here, just append to body (still scrolls, but not ideal layout-wise)
      if (!pinnedDiv.parentElement) document.body.appendChild(pinnedDiv);
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

        console.log("[zed-market-data] loaded");
        startMarketPoller();
        handleURL(); // initial run

    })();
      }

      // ---------- Profit Helper ----------
      function run_ProfitHelper(){


    (() => {
      // ====== DEBUG ======
      const DEBUG_NUMBER_BADGES = false;
      const DEBUG_CONSOLE = false;

      // ====== PRICING CONFIG ======
      const MARKET_KEY = "Zed-market-data";
      const PRICE_FALLBACK = "buy"; // fallback to vars.buy (else vars.sell) per unit

      // ====== BENCH RECIPE CACHE (1 hour) ======
      const RECIPES_CACHE_KEY = "Zed-recipes-cache-v1";
      const RECIPES_CACHE_TTL = 3600_000; // 1 hour

      // ====== ROUTING ======
      const STRONGHOLD_RE = /\/stronghold\/\d+/;
      const isOnStronghold = () => STRONGHOLD_RE.test(location.pathname) || location.href.includes("/stronghold/");

      // ====== BENCH TYPES ======
      const BENCH_TYPES = [
        "crafting_bench","medical_bay","tech_lab","materials_bench",
        "armour_bench","ammo_bench","chem_bench","kitchen","furnace","weapon_bench","grill"
      ];

      // ====== ACTION WORDS ======
      const ACTIONS = ["Craft","Salvage","Combine","Recycle","Bulk Recycle","Smelt","Forge","Burn","Purify","Create","Cook","Cooked"];
      const ACTION_RE = new RegExp(`^(?:${ACTIONS.map(a => a.replace(/\s+/g,"\\s+")).join("|")})\\b`, "i");

      // ====== RADIO TOWER (card detection) ======
      function getRadioCardButtons(root=document){
        const spans = root.querySelectorAll('.q-btn .q-btn__content .block');
        return [...spans].filter(s => (s.textContent || "").trim().toLowerCase() === "trade")
          .map(s => s.closest('.q-btn'));
      }
      const RADIO_CARD_CONTAINER = (btn) => btn?.closest('.q-pa-md') || btn?.closest('.grid-cont') || btn?.closest('.zed-grid');

      // ====== STATE ======
      const processedBenchNodes = new WeakSet();
      const processedRadio = new WeakSet();
      const lastVals = new WeakMap();
      let recipeIndexes = {};
      let recipeIndexesNorm = {};
      let radioTrades = null;
      let rerenderQueued = false;
      let mo = null;
      let globalBadgeSeq = 0;

      // ====== UTILS ======
      const fmt = (n) => (Number.isFinite(n) ? `$${Math.round(n).toLocaleString()}` : "N/A");
      const safeNum = (v) => (Number.isFinite(+v) ? +v : 0);
      const collapseSpaces = (s) => String(s || "").replace(/\s+/g," ").trim();
      const normalizeTitle = (s) => collapseSpaces(s).replace(/\s*blueprint\s*$/i,"").toLowerCase();
      const log = (...a) => { if (DEBUG_CONSOLE) console.log("[ZedProfit]", ...a); };

      const getMarket = () => {
        try { return JSON.parse(localStorage.getItem(MARKET_KEY) || "{}"); }
        catch { return {}; }
      };
      const bestPriceForName = (name, vars = {}) => {
        const m = getMarket();
        if (m && m[name] != null) return +m[name]; // unit price from market cache
        const fb = PRICE_FALLBACK === "buy" ? vars?.buy : vars?.sell; // unit fallback
        if (fb != null) return +fb;
        return null;
      };
      const getQty = (obj) => {
        const v = obj?.qty ?? obj?.quantity ?? obj?.count ?? obj?.amount ?? obj?.vars?.qty;
        const n = Number(v);
        return Number.isFinite(n) && n > 0 ? n : 1;
      };

      // ====== CSS ======
      (function injectCSS(){
        if (document.getElementById("zed-craft-css")) return;
        const css = `
          .zed-craft-badge{
            margin-left:6px;
            font-size:12px;
            padding:1px 6px;
            border-radius:999px;
            display:inline-block;
            font-weight:bold;
            white-space:nowrap;
          }
          .zed-pos{ background: rgba(0,200,0,.15); color:#7CFC9A; } /* Market Favs positive */
          .zed-neg{ background: rgba(220,0,0,.15); color:#FFAAAA; } /* Market Favs negative */
          .zed-dim{ opacity:.85 }
        `;
        const style = document.createElement("style");
        style.id = "zed-craft-css";
        style.textContent = css;
        document.head.appendChild(style);
      })();

      // ====== CACHE HELPERS ======
      function readRecipesCache() {
        try { return JSON.parse(localStorage.getItem(RECIPES_CACHE_KEY) || "{}"); }
        catch { return {}; }
      }
      function writeRecipesCache(cacheObj) {
        try { localStorage.setItem(RECIPES_CACHE_KEY, JSON.stringify(cacheObj)); } catch {}
      }
      function getCachedBenchJson(type) {
        const cache = readRecipesCache();
        const entry = cache[type];
        if (!entry) return null;
        if ((Date.now() - (entry.ts || 0)) > RECIPES_CACHE_TTL) return null;
        return entry.json || null;
      }
      function setCachedBenchJson(type, json) {
        const cache = readRecipesCache();
        cache[type] = { ts: Date.now(), json };
        writeRecipesCache(cache);
      }

      // ====== FETCHERS: BENCHES ======
      async function fetchRecipesForBench(type) {
        const cached = getCachedBenchJson(type);
        if (cached) return indexRecipes(cached);

        const res = await fetch(`https://api.zed.city/getRecipes?type=${encodeURIComponent(type)}`, { credentials:"include" });
        if (!res.ok) throw new Error(`getRecipes failed for ${type}`);
        const json = await res.json();
        setCachedBenchJson(type, json);
        return indexRecipes(json);
      }

      function indexRecipes(recipesJson) {
        const orig = new Map();
        const norm = new Map();
        const list = Array.isArray(recipesJson?.items) ? recipesJson.items : [];
        for (const r of list) {
          const displayName = collapseSpaces(r?.name || "");
          const reqs = r?.vars?.items || {};
          const outObj = r?.vars?.output || {};
          const outputs = [];
          for (const k of Object.keys(outObj)) {
            const item = outObj[k];
            if (!item) continue;
            outputs.push({ name: item.name || k, item, qty: getQty(item) });
          }
          const rec = { reqs, outputs, displayName };
          orig.set(displayName, rec);
          const keyNorm = normalizeTitle(displayName);
          if (keyNorm) norm.set(keyNorm, rec);
        }
        return { orig, norm };
      }

      async function loadAllRecipes() {
        recipeIndexes = {};
        recipeIndexesNorm = {};
        await Promise.all(BENCH_TYPES.map(async type => {
          try {
            const { orig, norm } = await fetchRecipesForBench(type);
            recipeIndexes[type] = orig;
            recipeIndexesNorm[type] = norm;
          } catch {
            recipeIndexes[type] = new Map();
            recipeIndexesNorm[type] = new Map();
          }
        }));
      }

      // ====== FETCHERS: RADIO TOWER (no cache on purpose) ======
      async function getStrongholdJson() {
        const res = await fetch(`https://api.zed.city/getStronghold`, { credentials:"include" });
        if (!res.ok) throw new Error("getStronghold failed");
        return res.json();
      }
      function findRadioTowerId(strongholdJson) {
        const buildings = strongholdJson?.stronghold || strongholdJson || {};
        for (const k of Object.keys(buildings)) {
          const b = buildings[k];
          if (b?.codename === "radio_tower") return Number(b.id || k);
        }
        return null;
      }
      async function fetchRadioTrades(radioId) {
        let res = await fetch(`https://api.zed.city/getRadioTower?id=${encodeURIComponent(radioId)}`, { credentials:"include" });
        if (!res.ok) {
          res = await fetch(`https://api.zed.city/getRadioTower`, { credentials:"include" });
          if (!res.ok) throw new Error("getRadioTower failed");
        }
        const json = await res.json();
        return indexRadioTrades(json);
      }
      function indexRadioTrades(json) {
        const orig = new Map();
        const norm = new Map();
        const list = [];
        const items = Array.isArray(json?.items) ? json.items : (Array.isArray(json) ? json : []);
        for (const t of items) {
          const displayName = collapseSpaces(t?.name || "");
          const reqs = t?.vars?.items || {};
          const outObj = t?.vars?.output || {};
          const outputs = [];
          for (const k of Object.keys(outObj)) {
            const item = outObj[k];
            if (!item) continue;
            outputs.push({ name: item.name || k, item, qty: getQty(item) });
          }
          const rec = { reqs, outputs, displayName, isRadio:true };
          list.push(rec);
          if (displayName) {
            orig.set(displayName, rec);
            norm.set(normalizeTitle(displayName), rec);
          }
        }
        return { list, orig, norm };
      }

      // ====== COMPUTE ======
      function sumIngredientCost(itemReqs) {
        let total = 0, missing = [];
        for (const key of Object.keys(itemReqs || {})) {
          const req = itemReqs[key];
          if (!req?.name) continue;
          const unit = bestPriceForName(req.name, req.vars || {});
          const qty = safeNum(req.req_qty ?? req.qty ?? 0);
          if (unit == null) missing.push(req.name);
          total += (unit ?? 0) * qty;
        }
        return { total, missing };
      }

      function lookupRecipeOrTrade(displayName) {
        const text = collapseSpaces(displayName);
        const keyNorm = normalizeTitle(text);

        // benches
        for (const type of BENCH_TYPES) {
          const byOrig = recipeIndexes[type];
          if (byOrig?.has(text)) return byOrig.get(text);
          const byNorm = recipeIndexesNorm[type];
          if (keyNorm && byNorm?.has(keyNorm)) return byNorm.get(keyNorm);
        }
        // radio
        if (radioTrades?.orig?.has(text)) return radioTrades.orig.get(text);
        if (keyNorm && radioTrades?.norm?.has(keyNorm)) return radioTrades.norm.get(keyNorm);
        return null;
      }

      function computeRec(rec) {
        if (!rec) return null;
        const { total: cost, missing } = sumIngredientCost(rec.reqs);

        let valueTotal = 0;
        let anyVal = false;
        const outQtyNotes = [];

        for (const out of rec.outputs || []) {
          const unitFromMarket = bestPriceForName(out.name, out.item?.vars || {});
          let unitVal = unitFromMarket;
          if (unitVal == null && Number.isFinite(out.item?.value)) unitVal = +out.item.value; // per-unit fallback
          if (unitVal == null) continue;

          const qty = getQty(out.item) || out.qty || 1;
          valueTotal += unitVal * qty;
          anyVal = true;
          if (qty > 1) outQtyNotes.push(`${out.name}×${qty}`);
        }

        const value = anyVal ? valueTotal : null;
        const profit = (Number.isFinite(cost) && Number.isFinite(value)) ? (value - cost) : null;
        return { cost, value, profit, missing, outQtyNotes };
      }

      // ====== BENCH MATCHER (permissive) ======
      function isBenchRow(el) {
        if (!el || el.nodeType !== 1) return false;
        const hasClassCol = el.classList?.contains("col");
        const likelyContainer = hasClassCol || /^(DIV|SPAN|A|BUTTON)$/i.test(el.tagName);
        if (!likelyContainer) return false;
        const t = collapseSpaces(el.textContent || "");
        if (!t) return false;
        if (ACTION_RE.test(t)) return true;
        if (/\bBlueprint$/i.test(t)) return true;
        return false;
      }

      // ====== DOM ======
      function makeOrUpdateBadge(el, data, debugId=null) {
        const prev = lastVals.get(el) || {};
        const round = (x) => Number.isFinite(x) ? Math.round(x) : NaN;
        if (round(prev.cost) === round(data.cost) &&
            round(prev.value) === round(data.value) &&
            round(prev.profit) === round(data.profit)) return;

        let badge = el.querySelector(":scope > .zed-craft-badge");
        let txtCore = `${fmt(data.cost)} → ${fmt(data.value)} (${data.profit > 0 ? "+" : ""}${fmt(data.profit).replace("$","")})`;
        if (DEBUG_NUMBER_BADGES && debugId != null) txtCore += ` [#${debugId}]`;

        if (!badge) {
          badge = document.createElement("span");
          badge.className = "zed-craft-badge";
          el.appendChild(badge);
        }
        badge.textContent = txtCore;

        // Market Favs logic: zero treated as positive
        badge.classList.remove("zed-pos", "zed-neg");
        if (!Number.isFinite(data.profit) || data.profit >= 0) badge.classList.add("zed-pos");
        else badge.classList.add("zed-neg");

        const missingNames = (data.missing || []);
        badge.classList.toggle("zed-dim", missingNames.length > 0);
        const parts = [];
        if (missingNames.length) parts.push(`Missing prices: ${missingNames.join(", ")}`);
        if (data.outQtyNotes?.length) parts.push(`Outputs: ${data.outQtyNotes.join(", ")}`);
        badge.title = parts.join(" • ");

        lastVals.set(el, { cost: data.cost, value: data.value, profit: data.profit });
      }

      // ====== RENDER ======
      function renderBenches(root=document){
        if (!Object.keys(recipeIndexes).length) return;

        const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT, {
          acceptNode(node) {
            return (!processedBenchNodes.has(node) && isBenchRow(node))
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_SKIP;
          }
        });

        let node;
        while ((node = walker.nextNode())) {
          // If this match is inside an .item-row that already has *any* badge, skip.
          const row = node.closest?.('.item-row');
          if (row && (row.dataset.zedBadgeDone === "1" || row.querySelector('.zed-craft-badge'))) {
            processedBenchNodes.add(node);
            continue;
          }

          const title = collapseSpaces(node.textContent || "");
          const rec = lookupRecipeOrTrade(title);
          const data = computeRec(rec);
          if (!data) { processedBenchNodes.add(node); continue; }

          // Place badge here (first hit in this row wins)
          const host = document.createElement("span");
          node.appendChild(host);
          const id = ++globalBadgeSeq;
          makeOrUpdateBadge(host, data, id);

          // Mark the entire row as done so later matches inside it are ignored
          if (row) row.dataset.zedBadgeDone = "1";

          processedBenchNodes.add(node);
        }
      }

      function renderRadio(root=document){
        if (!radioTrades?.list?.length) return;
        const buttons = getRadioCardButtons(root);
        buttons.forEach((btn, i) => {
          const container = RADIO_CARD_CONTAINER(btn) || btn.parentElement;
          if (!container || processedRadio.has(container) || container.querySelector(".zed-craft-badge")) return;

          const rec = radioTrades.list[i];
          const data = computeRec(rec);
          if (!data) { processedRadio.add(container); return; }

          const hostWrap = document.createElement("div");
          hostWrap.style.marginTop = "6px";
          (btn.parentElement || container).appendChild(hostWrap);

          const id = ++globalBadgeSeq;
          makeOrUpdateBadge(hostWrap, data, id);

          processedRadio.add(container);
        });
      }

      function renderPass(root=document){
        renderBenches(root);
        renderRadio(root);
      }

      function queueRender(root=document){
        if (rerenderQueued) return;
        rerenderQueued = true;
        requestAnimationFrame(() => {
          rerenderQueued = false;
          renderPass(root);
        });
      }

      // ====== OBSERVERS & ROUTING ======
      function connectObserver() {
        if (mo) mo.disconnect();
        mo = new MutationObserver((muts) => {
          for (const m of muts) for (const n of m.addedNodes || []) {
            if (n.nodeType === 1) queueRender(n);
          }
        });
        mo.observe(document.body, { childList:true, subtree:true });
      }
      function disconnectObserver(){ if (mo) { mo.disconnect(); mo = null; } }

      async function initForPage() {
        try {
          if (!isOnStronghold()) {
            recipeIndexes = {};
            recipeIndexesNorm = {};
            radioTrades = null;
            connectObserver();
            return;
          }

          // Benches (cached)
          await loadAllRecipes();

          // Radio Tower (live)
          try {
            const sh = await getStrongholdJson();
            const radioId = findRadioTowerId(sh);
            radioTrades = radioId ? await fetchRadioTrades(radioId) : null;
          } catch {
            radioTrades = null;
          }

          connectObserver();
          queueRender(document);
        } catch (e) {
          if (DEBUG_CONSOLE) console.warn(e);
        }
      }

      let lastURL = location.href;
      function onRouteChange() {
        if (location.href === lastURL) return;
        lastURL = location.href;

        processedBenchNodes.clear?.();
        processedRadio.clear?.();
        lastVals.clear?.();
        disconnectObserver();

        // Keep localStorage cache; just clear in-memory
        recipeIndexes = {};
        recipeIndexesNorm = {};
        radioTrades = null;

        requestAnimationFrame(() => {
          initForPage();
          setTimeout(() => queueRender(document), 150);
        });
      }

      // SPA hooks
      const _ps = history.pushState;
      history.pushState = function (...a) { const r = _ps.apply(this, a); onRouteChange(); return r; };
      const _rs = history.replaceState;
      history.replaceState = function (...a) { const r = _rs.apply(this, a); onRouteChange(); return r; };
      window.addEventListener("popstate", onRouteChange);
      document.addEventListener("click", (e) => {
        const a = e.target.closest?.("a[href]");
        if (!a) return;
        setTimeout(onRouteChange, 0);
      }, { capture:true });

      // Safety net
      const hintObserver = new MutationObserver((muts) => {
        for (const m of muts) for (const n of m.addedNodes || []) {
          if (n.nodeType !== 1) continue;
          if (/\b(Craft|Salvage|Combine|Recycle|Blueprint|Trade|Smelt|Forge|Burn|Purify|Create)\b/i.test(n.textContent || "")) {
            initForPage(); hintObserver.disconnect(); return;
          }
        }
      });
      hintObserver.observe(document.documentElement, { childList:true, subtree:true });

      // Re-render when market cache changes
      window.addEventListener("zed:marketDataUpdated", () => queueRender(document));
      window.addEventListener("storage", (e) => { if (e.key === MARKET_KEY) queueRender(document); });

      // Kick off
      initForPage();
    })();
      }

    /* ===== Inventory Net Worth ===== */
           function run_networth(){

    (() => {
      const MARKET_KEY = "Zed-market-data";

      const API_ITEMS = "https://api.zed.city/loadItems";
      const API_STATS = "https://api.zed.city/getStats";

      const INVENTORY_GRID_SEL = 'div.zed-grid.has-title.has-content';
      const PANEL_ID = 'inventory-networth-api';
      const INVENTORY_RE = /\/inventory(?:$|[?#])/;

      // --- state
      let panel = null;
      let itemsCache = null;
      let cashBalance = null;
      let lastMarketStr = null;

      // --- utils
      const onInventory = () => INVENTORY_RE.test(location.pathname) || location.href.includes('/inventory');
      const $ = (sel, root=document) => root.querySelector(sel);
      const money = n => Number.isFinite(n) ? ('$' + Math.round(n).toLocaleString()) : 'N/A';
      const parseCash = (obj) => {
        // Try a few common shapes safely
        const cands = [
          obj?.money, obj?.cash, obj?.balance, obj?.stats?.money, obj?.user?.money, obj?.data?.money
        ].filter(v => Number.isFinite(+v));
        return cands.length ? +cands[0] : null;
      };
      const readMarket = () => {
        const s = localStorage.getItem(MARKET_KEY) || "{}";
        if (s === lastMarketStr) return null;
        lastMarketStr = s;
        try { return JSON.parse(s); } catch { return {}; }
      };

      // Find the inventory grid by structure (hash-proof)
      function findInventoryGrid() {
        try {
          const q = document.querySelector(`${INVENTORY_GRID_SEL}:has(.grid-cont .q-list)`);
          if (q) return q;
        } catch {}
        // Fallback: scan candidates for the expected inner structure
        const grids = document.querySelectorAll(INVENTORY_GRID_SEL);
        for (const el of grids) {
          if (el.querySelector('.grid-cont .q-list')) return el;
        }
        return null;
      }

      function ensurePanel() {
        if (panel && panel.isConnected) return panel;
        const bottom = findInventoryGrid();
        if (!bottom || !bottom.parentNode) return null;

        const p = document.createElement('div');
        p.id = PANEL_ID;
        p.style.margin = '8px 0 10px';
        p.style.padding = '4px 4px';
        p.style.borderRadius = '4px';
        p.style.background = 'rgba(255,255,255,0.06)';
        p.style.border = '1px solid rgba(255,255,255,0.08)';
        p.style.display = 'flex';
        p.style.flexWrap = 'wrap';
        p.style.alignItems = 'center';
        p.style.gap = '4px';
        p.style.fontSize = '12px';

        const h = document.createElement('div');
        h.textContent = 'Net Worth';
        h.style.fontWeight = '700';
        h.style.marginRight = '8px';
        p.appendChild(h);

        const v = document.createElement('div');
        v.className = 'zed-nw-total';
        v.style.fontWeight = '700';
        v.style.padding = '2px 8px';
        v.style.borderRadius = '999px';
        v.style.background = 'rgba(0,200,0,.15)';
        v.style.color = '#7CFC9A';
        v.textContent = '$…';
        p.appendChild(v);

        const b = document.createElement('div');
        b.className = 'zed-nw-breakdown';
        b.style.opacity = '0.85';
        b.textContent = 'items: $0 + cash: $0';
        p.appendChild(b);

        bottom.parentNode.insertBefore(p, bottom);
        panel = p;
        return panel;
      }

      function setPanel(itemsVal, cashVal, priced, unpriced) {
        if (!panel) return;
        const total = (Number(itemsVal)||0) + (Number(cashVal)||0);
        const v = panel.querySelector('.zed-nw-total');
        const b = panel.querySelector('.zed-nw-breakdown');
        if (v) v.textContent = money(total);
        if (b) b.textContent = `items: ${money(itemsVal||0)} + cash: ${money(cashVal||0)} · unpriced: ${unpriced}`;
      }

      function computeFromCaches() {
        const market = readMarket() ?? JSON.parse(lastMarketStr || "{}");
        // items
        let itemsVal = 0, priced = 0, unpriced = 0;
        if (Array.isArray(itemsCache)) {
          for (const it of itemsCache) {
            const name = it?.name;
            const qty = Number(it?.quantity) || 0;
            const unit = (name && market[name] != null) ? Number(market[name]) : null;
            if (unit != null && Number.isFinite(unit)) { itemsVal += unit * qty; priced++; }
            else { unpriced++; }
          }
        }
        setPanel(itemsVal, cashBalance||0, priced, unpriced);
      }

      async function fetchOnce(url, postBodyIfNoGet=false) {

        try {
          const r = await fetch(url, { credentials: 'include' });
          if (!r.ok) throw new Error('GET failed');
          return await r.json();
        } catch {}


      }

      async function initInventoryNW() {
        if (!onInventory()) return;

        // Wait briefly for the inventory grid (debounced observer, short timeout)
        const waitForGrid = () => new Promise(res => {
          const now = findInventoryGrid();
          if (now) return res(true);

          let done = false, rafId = 0, timer = 0;
          const debounce = (() => {
            let queued = false;
            return () => {
              if (queued) return;
              queued = true;
              rafId = requestAnimationFrame(() => { queued = false; check(); });
            };
          })();

          const mo = new MutationObserver(debounce);

          function check() {
            if (done) return;
            if (findInventoryGrid()) {
              done = true;
              mo.disconnect();
              cancelAnimationFrame(rafId);
              clearTimeout(timer);
              res(true);
            }
          }

          mo.observe(document.documentElement, { childList: true, subtree: true });
          timer = setTimeout(() => { if (!done) { done = true; mo.disconnect(); res(false); } }, 1500);
          // kick once
          debounce();
        });

        const ok = await waitForGrid();
        if (!ok) return;
        if (!ensurePanel()) return;

        // Fetch once if we haven't intercepted yet
        if (!Array.isArray(itemsCache)) {
          const ji = await fetchOnce(API_ITEMS, true);
          if (ji && Array.isArray(ji.items)) itemsCache = ji.items;
        }
        if (!Number.isFinite(cashBalance)) {
          const js = await fetchOnce(API_STATS, true);
          const cash = js ? parseCash(js) : null;
          if (Number.isFinite(cash)) cashBalance = cash;
        }

        computeFromCaches();

        // tiny self-heal: reattach if grid/panel moves (debounced)
        (function liteReattach(){
          let queued = false;
          const reattach = () => {
            if (queued) return;
            queued = true;
            requestAnimationFrame(() => {
              queued = false;
              const grid = findInventoryGrid();
              if (!grid) return;
              if (!panel || !panel.isConnected || panel.nextSibling !== grid) {
                if (panel && panel.isConnected) panel.remove();
                panel = null;
                ensurePanel();
                computeFromCaches();
              }
            });
          };
          const mo = new MutationObserver(reattach);
          mo.observe(document.documentElement, { childList: true, subtree: true });

          // hook route changes
          const _ps = history.pushState;
          history.pushState = function(...a){ const r = _ps.apply(this, a); reattach(); return r; };
          const _rs = history.replaceState;
          history.replaceState = function(...a){ const r = _rs.apply(this, a); reattach(); return r; };
          window.addEventListener('popstate', reattach);
          window.addEventListener('hashchange', reattach);
        })();
      }

      // Market Favs updates → recompute only
      window.addEventListener('storage', (e) => { if (e.key === MARKET_KEY) computeFromCaches(); });
      window.addEventListener('zed:marketDataUpdated', computeFromCaches);

      // Minimal network hooks (ONLY intercept our two endpoints)
      ;(function hookFetchOnce(){
        if (window.__nw2_fetch_hooked__) return;
        window.__nw2_fetch_hooked__ = true;
        const orig = window.fetch;
        window.fetch = async function(input, init) {
          const resp = await orig.apply(this, arguments);
          try {
            const url = typeof input === 'string' ? input : (input?.url || '');
            if (url.includes('loadItems') || url.includes('getStats')) {
              const clone = resp.clone();
              clone.json().then(j => {
                if (url.includes('loadItems') && Array.isArray(j?.items)) {
                  itemsCache = j.items;
                }
                if (url.includes('getStats')) {
                  const cash = parseCash(j);
                  if (Number.isFinite(cash)) cashBalance = cash;
                }
                if (onInventory() && panel) computeFromCaches();
              }).catch(()=>{});
            }
          } catch {}
          return resp;
        };
      })();

      ;(function hookXHROnce(){
        if (window.__nw2_xhr_hooked__) return;
        window.__nw2_xhr_hooked__ = true;
        const open = XMLHttpRequest.prototype.open;
        const send = XMLHttpRequest.prototype.send;
        XMLHttpRequest.prototype.open = function(method, url) {
          this.__nw2_url = url || '';
          return open.apply(this, arguments);
        };
        XMLHttpRequest.prototype.send = function(body) {
          const url = this.__nw2_url || '';
          if (url.includes('loadItems') || url.includes('getStats')) {
            this.addEventListener('readystatechange', function() {
              if (this.readyState === 4) {
                try {
                  const j = JSON.parse(this.responseText);
                  if (url.includes('loadItems') && Array.isArray(j?.items)) {
                    itemsCache = j.items;
                  }
                  if (url.includes('getStats')) {
                    const cash = parseCash(j);
                    if (Number.isFinite(cash)) cashBalance = cash;
                  }
                  if (onInventory() && panel) computeFromCaches();
                } catch {}
              }
            });
          }
          return send.apply(this, arguments);
        };
      })();

      // SPA routing trigger + first load
      function onRouteChange(){ if (onInventory()) initInventoryNW(); }
      const _ps = history.pushState;
      history.pushState = function(...a){ const r = _ps.apply(this, a); onRouteChange(); return r; };
      const _rs = history.replaceState;
      history.replaceState = function(...a){ const r = _rs.apply(this, a); onRouteChange(); return r; };
      window.addEventListener('popstate', onRouteChange);
      window.addEventListener('hashchange', onRouteChange);

      // First load
      initInventoryNW();
    })();


      }

// ---------- Timers ----------
function run_Timers(){

(function () {
  'use strict';

  /** CONFIG **/
  const API = {
    stats: 'https://api.zed.city/getStats',
    stronghold: 'https://api.zed.city/getStronghold',
  };

  const ICON = {
    energy: '⚡',
    rads: '☢',
    xp: '🏆',
    raid: '🎯',
    furnace: '🔥',
    mine_iron: '⛏️',
    mine_coal: '⛏️',
    junk: '🛒',
    radio: '🗼',
  };

  const TEN_MIN = 10 * 60; // seconds
  const POLL_STATS_EVERY = 60 * 1000;
  const POLL_STRONGHOLD_EVERY = 60 * 1000;

  const SAVED_KEY = 'zed-timerbar-saved'; // junk/radio
  const SH_CACHE_KEY = 'zed-timerbar-stronghold-cache'; // furnace cache for travel mode

  const saved = () => JSON.parse(localStorage.getItem(SAVED_KEY) || '{}');
  const save = (obj) => localStorage.setItem(SAVED_KEY, JSON.stringify(obj));

  let __zed_started = false;
  const __zed_intervals = { stats: null, stronghold: null, saved: null, tick: null };
  function setIntervalSafe(key, fn, ms) {
    if (__zed_intervals[key]) clearInterval(__zed_intervals[key]);
    __zed_intervals[key] = setInterval(fn, ms);
  }

  /** Cross-origin friendly JSON fetch (falls back to GM_xmlhttpRequest) **/
  function fetchJSON(url) {
    return new Promise(async (resolve) => {
      try {
        const r = await fetch(url, { method: 'GET', mode: 'cors', credentials: 'include' });
        if (r && r.ok) {
          resolve(await r.json());
          return;
        }
      } catch { /* try GM below */ }

      if (typeof GM_xmlhttpRequest === 'function') {
        try {
          GM_xmlhttpRequest({
            method: 'GET',
            url,
            onload: (res) => {
              try { resolve(JSON.parse(res.responseText)); } catch { resolve(null); }
            },
            onerror: () => resolve(null),
            ontimeout: () => resolve(null),
          });
          return;
        } catch { /* noop */ }
      }

      resolve(null);
    });
  }

  /** DOM: create bar just under the main toolbar **/
  function ensureBar() {
    const toolbar =
      document.querySelector('div.q-toolbar.row.no-wrap.items-center[role="toolbar"]') ||
      document.querySelector('div.q-toolbar[role="toolbar"]') ||
      document.querySelector('.q-header .q-toolbar') ||
      document.querySelector('header .q-toolbar');

    if (!toolbar) return null;

    let holder = document.getElementById('zed-timerbar');
    if (holder) return holder;

    holder = document.createElement('div');
    holder.id = 'zed-timerbar';
    holder.setAttribute('role', 'group');
    holder.innerHTML = `
      <div class="zed-timerbar-inner">
        ${tileHTML('energy')}
        ${tileHTML('rads')}
        ${tileHTML('xp')}
        ${tileHTML('raid')}
        <span id="zed-furnace-mount" style="display:none"></span>
        ${tileHTML('mine_iron')}
        ${tileHTML('mine_coal')}
        ${tileHTML('junk')}
        ${tileHTML('radio')}
      </div>
    `;

    if (toolbar.parentElement) {
      toolbar.parentElement.insertBefore(holder, toolbar.nextSibling);
    } else {
      document.body.insertBefore(holder, document.body.firstChild);
    }
    injectStyles();

    // Hide mines until confirmed
    setTileVisible('mine_iron', false);
    setTileVisible('mine_coal', false);

    // Remove any legacy single furnace tile
    holder.querySelectorAll('.zed-tile[data-key="furnace"]').forEach(el => el.remove());

    return holder;
  }

  function tileHTML(key) {
    return `
      <a class="zed-tile" data-key="${key}" href="#" title="${key.toUpperCase()}">
        <div class="zed-icon">${ICON[key] || '•'}</div>
        <div class="zed-time" data-seconds="-1">--:--</div>
      </a>
    `;
  }

  function injectStyles() {
    if (document.getElementById('zed-timerbar-style')) return;
    const style = document.createElement('style');
    style.id = 'zed-timerbar-style';
    style.textContent = `
      #zed-timerbar {
        display: flex;
        justify-content: center;
        padding: 2px 8px;
        background: rgba(9,10,11,0.9);
        border-top: 1px solid rgba(255,255,255,0.06);
      }
      .zed-timerbar-inner {
        display: flex;
        flex-wrap: wrap;
        gap: 0px;
        justify-content: center;
        align-items: flex-start;
      }
      .zed-tile {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 6px;
        text-decoration: none;
        padding: 2px 8px;
      }
      .zed-tile.hidden { display: none !important; }
      .zed-icon { font-size: 12px; line-height: 1; }
      .zed-time {
        padding: 2px 6px;
        font-size: 12px;
        font-weight: 600;
        color: #fff;
        background: rgba(255,255,255,0.08);
        border-radius: 8px;
        min-width: 44px;
        text-align: center;
      }
      .zed-time.alert { color: #ff4d4f; background: rgba(255,77,79,0.12); }
      #zed-furnace-mount { display:none; }
    `;
    document.head.appendChild(style);
  }

  /** Formatting **/
  function fmt(seconds) {
  // Show D:HH:MM:SS (days shown only when needed)
  if (seconds == null || seconds <= 0) return '00:00';
  let s = Math.floor(seconds);

  const d = Math.floor(s / 86400); s -= d * 86400;
  const h = Math.floor(s / 3600); s -= h * 3600;
  const m = Math.floor(s / 60); s -= m * 60;

  const pad = (n) => (n < 10 ? '0' + n : '' + n);
  const parts = [];
  if (d) parts.push(pad(d));
  if (h || parts.length) parts.push(pad(h));
  parts.push(pad(m));
  parts.push(pad(s));

  return parts.join(':');
}
  function applyAlertClass(el, seconds) {
    if (!el) return;
    if (seconds <= TEN_MIN) el.classList.add('alert');
    else el.classList.remove('alert');
  }

  function setTileVisible(key, visible) {
    const el = document.querySelector(`.zed-tile[data-key="${key}"]`);
    if (!el) return;
    el.classList.toggle('hidden', !visible);
  }

  /** XHR intercept **/
  (function interceptXHR() {
    const openOrig = XMLHttpRequest.prototype.open;
    const sendOrig = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.open = function (method, url) {
      this._zedURL = url;
      return openOrig.apply(this, arguments);
    };
    XMLHttpRequest.prototype.send = function (body) {
      this.addEventListener('readystatechange', function () {
        if (this.readyState !== 4) return;
        try {
          const url = String(this._zedURL || '');
          const res = JSON.parse(this.responseText || 'null');
          if (!res) return;
          if (url.includes('store_id') && url.includes('junk')) {
            const reset = res?.limits?.reset_time;
            if (reset) {
              const until = Date.now() + reset * 1000;
              const s = saved();
              s.junk = { until, href: '/store/junk' };
              save(s);
            }
          }
          if (url.includes('getRadioTower')) {
            const expire = res?.expire;
            if (expire) {
              const until = Date.now() + expire * 1000;
              const s = saved();
              s.radio = { until, href: '/stronghold' };
              save(s);
            }
          }
        } catch {}
      });
      return sendOrig.apply(this, arguments);
    };
  })();

  function writeStrongholdCache(entries) {
    const payload = {
      saved_at: Date.now(),
      furnaces: entries.map(e => ({ id: e.id, until: e.until })),
    };
    localStorage.setItem(SH_CACHE_KEY, JSON.stringify(payload));
  }
  function readStrongholdCache() {
    try {
      const raw = localStorage.getItem(SH_CACHE_KEY);
      if (!raw) return null;
      const data = JSON.parse(raw);
      const now = Date.now();
      return (data.furnaces || []).map(f => ({
        id: f.id,
        seconds: Math.max(0, Math.floor((f.until - now) / 1000)),
      }));
    } catch {
      return null;
    }
  }

function zedApplyStats(data) {
  // --- Base energy max ---
  const baseEnergyMax = data?.membership ? 150 : (data?.stats?.max_energy || 100);
  let energyMax = baseEnergyMax;

  // --- Sum all flat max-energy bonuses from effects ---
  const effects = Object.values(data?.effects || {});
  const toNumber = v => {
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };

  const flatEnergyBonus = effects.reduce((sum, eff) => {
    if (eff?.stat !== 'max_energy') return sum;
    return sum + toNumber(eff?.vars?.max_energy_flat);
  }, 0);

  energyMax += flatEnergyBonus;

  // --- Energy calculations ---
  const energyMissing = Math.max(0, energyMax - (data?.energy ?? 0));
  const tickSeconds = data?.energy_tick ?? (data?.membership ? 600 : 900);
  const toNextEnergy = Math.max(0, data?.energy_regen ?? 0);
  const ticksNeeded = energyMissing > 0 ? Math.ceil(energyMissing / 5) : 0;
  const energySeconds = ticksNeeded > 0 ? toNextEnergy + (ticksNeeded - 1) * tickSeconds : 0;
  setTile('energy', '/stronghold', energySeconds);

  // --- Radiation calculations ---
  const radBaseMax = (data?.stats?.max_rad ?? 60);
  const radMax = radBaseMax + (data?.membership ? 20 : 0);
  const radMissing = Math.max(0, radMax - (data?.rad ?? 0));
  const baseTick = 300;
  const toNext = Math.max(0, data?.rad_regen || 0);
  const radSeconds = radMissing > 0 ? Math.max(0, (radMissing - 1) * baseTick) + toNext : 0;
  setTile('rads', '/scavenge', radSeconds);

  // --- XP tile ---
  const xpToGo = Math.max(0, Math.round((data?.xp_end || 0)) - Math.round((data?.experience || 0)));
  setTile('xp', '/profile', null, xpToGo.toLocaleString());

  // --- Raid cooldown ---
  const raid = Math.max(0, data?.raid_cooldown ?? 0);
  setTile('raid', '/raids', raid);
}

window.zedApplyStats = zedApplyStats;

  async function refreshStats() {
    const data = await fetchJSON(API.stats);
    if (!data) return;
    if (window.zedApplyStats) window.zedApplyStats(data);
  }

  async function refreshStronghold() {
    function ensureFurnaceMount() {
      let mount = document.getElementById('zed-furnace-mount');
      if (!mount) {
        const fallback = document.querySelector('.zed-timerbar-inner');
        mount = document.createElement('span');
        mount.id = 'zed-furnace-mount';
        (fallback || document.body).appendChild(mount);
      }
      return mount;
    }

    function createFurnaceTile(id, seconds) {
      const a = document.createElement('a');
      a.className = 'zed-tile';
      a.href = `/stronghold/${id}`;
      a.title = `FURNACE ${id}`;
      const icon = document.createElement('div');
      icon.className = 'zed-icon';
      icon.textContent = '🔥';
      const time = document.createElement('div');
      time.className = 'zed-time';
      time.dataset.seconds = String(Math.max(0, seconds || 0));
      time.textContent = fmt(seconds || 0);
      a.appendChild(icon);
      a.appendChild(time);
      return a;
    }

    function renderFurnaces(list) {
      const mount = ensureFurnaceMount();
      if (!mount) return;
      const container = mount.parentElement || document;
      if (!list.length) {
        container.querySelectorAll('.zed-tile[data-furnace-id]').forEach(el => el.remove());
        return;
      }
      const existing = new Set(list.map(r => String(r.id)));
      container.querySelectorAll('.zed-tile[data-furnace-id]').forEach(el => {
        if (!existing.has(el.dataset.furnaceId)) el.remove();
      });
      list.forEach(({ id, seconds }) => {
        let tile = container.querySelector(`.zed-tile[data-furnace-id="${id}"]`);
        if (!tile) {
          tile = createFurnaceTile(id, seconds || 0);
          tile.dataset.furnaceId = String(id);
          mount.insertAdjacentElement('afterend', tile);
        } else {
          const timeEl = tile.querySelector('.zed-time');
          const s = Math.max(0, Number(seconds || 0));
          timeEl.dataset.seconds = String(s);
          timeEl.textContent = fmt(s);
          applyAlertClass(timeEl, s);
        }
      });
    }

    const data = await fetchJSON(API.stronghold);
    if (data && data.stronghold) {
      const now = Date.now();
      const buildings = Object.values(data.stronghold) || [];
      const furnacesRaw = buildings.filter(b => b?.codename === 'furnace');
      const computed = furnacesRaw.map((f) => {
        let seconds = 0;
        const bpWait = f?.items?.['item_requirement-bp']?.vars?.wait_time;
        const qtyEach = f?.items?.['item_requirement-bp']?.vars?.items?.['item_requirement-1']?.qty;
        const total = f?.items?.['item_requirement-1']?.quantity;
        if (f?.in_progress && typeof f?.timeLeft === 'number' && bpWait && qtyEach && total) {
          const done = f?.iterationsPassed || 0;
          const remainingIters = Math.max(0, Math.floor(total / qtyEach) - done - 1);
          seconds = Math.max(0, (remainingIters * bpWait) + (f.timeLeft || 0));
        } else if (typeof f?.wait === 'number') {
          seconds = Math.max(0, f.wait);
        }
        return { id: f.id, seconds, until: now + seconds * 1000 };
      });
      writeStrongholdCache(computed.map(({ id, until }) => ({ id, until })));
      const ironMine = buildings.find(b => b?.codename === 'iron_automine');
      if (ironMine) {
        const secsIron = Math.max(0,
          typeof ironMine?.timeLeft === 'number' ? ironMine.timeLeft : (ironMine?.wait || 0)
        );
        setTile('mine_iron', ironMine?.id ? `/stronghold/${ironMine.id}` : '#', secsIron);
        setTileVisible('mine_iron', true);
      } else setTileVisible('mine_iron', false);
      const coalMine = buildings.find(b => b?.codename === 'coal_automine');
      if (coalMine) {
        const secsCoal = Math.max(0,
          typeof coalMine?.timeLeft === 'number' ? coalMine.timeLeft : (coalMine?.wait || 0)
        );
        setTile('mine_coal', coalMine?.id ? `/stronghold/${coalMine.id}` : '#', secsCoal);
        setTileVisible('mine_coal', true);
      } else setTileVisible('mine_coal', false);
      renderFurnaces(computed.map(({ id, seconds }) => ({ id, seconds })));
      return;
    }
    const cached = readStrongholdCache();
    if (cached && cached.length) renderFurnaces(cached);
  }

  function setTile(key, href, seconds, overrideLabel) {
    const tile = document.querySelector(`.zed-tile[data-key="${key}"]`);
    if (!tile) return;
    tile.href = href || '#';
    const timeEl = tile.querySelector('.zed-time');
    if (!timeEl) return;
    if (overrideLabel != null) {
      timeEl.textContent = String(overrideLabel);
      timeEl.dataset.seconds = '-1';
      timeEl.classList.remove('alert');
      return;
    }
    const s = Math.max(0, Number(seconds || 0));
    timeEl.textContent = fmt(s);
    timeEl.dataset.seconds = String(s);
    applyAlertClass(timeEl, s);
  }

  function refreshSavedTimers() {
    const now = Date.now();
    const s = saved();
    if (s.junk) {
      const secs = Math.max(0, Math.floor((s.junk.until - now) / 1000));
      setTile('junk', s.junk.href || '/store/junk', secs);
    }
    if (s.radio) {
      const secs = Math.max(0, Math.floor((s.radio.until - now) / 1000));
      setTile('radio', s.radio.href || '/stronghold', secs);
    }
  }

  function tick() {
    document.querySelectorAll('#zed-timerbar [data-seconds]').forEach(el => {
      const s = parseInt(el.dataset.seconds || '-1', 10);
      if (isNaN(s) || s < 0) return;
      const next = Math.max(0, s - 1);
      el.dataset.seconds = String(next);
      el.textContent = fmt(next);
      applyAlertClass(el, next);
    });
  }

  function startIntervals() {
    if (__zed_started) return;
    __zed_started = true;
    refreshStats();
    refreshStronghold();
    refreshSavedTimers();
    setIntervalSafe('stats', refreshStats, POLL_STATS_EVERY);
    setIntervalSafe('stronghold', refreshStronghold, POLL_STRONGHOLD_EVERY);
    setIntervalSafe('saved', refreshSavedTimers, 5 * 1000);
    setIntervalSafe('tick', tick, 1000);
  }

  function boot() {
    if (ensureBar()) { startIntervals(); return; }
    const obs = new MutationObserver(() => {
      if (ensureBar()) {
        obs.disconnect();
        startIntervals();
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(() => {
      obs.disconnect();
      (function retryUntilReady(tries = 40) {
        if (ensureBar()) startIntervals();
        else if (tries > 0) setTimeout(() => retryUntilReady(tries - 1), 500);
      })();
    }, 20000);
  }

  boot();
})();

}

// ==========================================================
//  Exploration Data with arrival-based pruning (no legacy migration)
// ==========================================================
function run_ExplorationData(){
  (function(){
    // ---------------------------------
    // Storage (data + UI state)
    // ---------------------------------
    const DATA_KEY = "Zed-exploration-data";
    const UI_KEY = "Zed-exploration-ui"; // { [location]: { NPCs: true/false, Gates: true/false } }

    // Initialize fresh keys — no legacy migration
    if (!localStorage.getItem(DATA_KEY)) {
      localStorage.setItem(DATA_KEY, JSON.stringify({}));
    }
    if (!localStorage.getItem(UI_KEY)) {
      localStorage.setItem(UI_KEY, JSON.stringify({}));
    }

    // helpers: read/write
    function readData() { try { return JSON.parse(localStorage.getItem(DATA_KEY)) || {}; } catch { return {}; } }
    function writeData(all) { localStorage.setItem(DATA_KEY, JSON.stringify(all)); }
    function readUI() { try { return JSON.parse(localStorage.getItem(UI_KEY)) || {}; } catch { return {}; } }
    function writeUI(ui) { localStorage.setItem(UI_KEY, JSON.stringify(ui)); }

    function getSectionState(location, sectionTitle, defaultOpen = true) {
      const ui = readUI();
      return ui[location]?.[sectionTitle] ?? defaultOpen;
    }
    function setSectionState(location, sectionTitle, isOpen) {
      const ui = readUI();
      if (!ui[location]) ui[location] = {};
      ui[location][sectionTitle] = isOpen;
      writeUI(ui);
    }

    // ---------------------------------
    // Minimal state / other helpers
    // ---------------------------------
    let current_location = "City";
    const TIMER_THRESHOLD = 10 * 60;

    function slugify(s) { return String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, ""); }

    function getDayHourMinute(seconds) {
  seconds = Math.max(0, Math.floor(Number(seconds) || 0));

  let days = Math.floor(seconds / 86400);
  seconds -= days * 86400;

  let hours = Math.floor(seconds / 3600);
  seconds -= hours * 3600;

  let minutes = Math.floor(seconds / 60);
  seconds -= minutes * 60;

  const pad = (n) => (n < 10 ? "0" + n : String(n));
  const time = [];

  if (days > 0) time.push(pad(days));
  if (hours > 0 || time.length) time.push(pad(hours));
  if (minutes > 0 || time.length) time.push(pad(minutes));
  time.push(pad(seconds));

  return time.join(":");
}


    function updateTimers() {
  document.querySelectorAll(".explore-ui .timer").forEach((el) => {
    let t = Number(el.timeLeft);
    if (isNaN(t)) return;

    // already finished?
    if (t <= -1) {
      el.classList.add("alert");
      el.textContent = getDayHourMinute(0);
      const row = el.closest('.rowline');
      const kind = row?.dataset?.kind || '';
      const state = row?.querySelector('.state');
      if (state) {
        if (kind === 'scavenge') { state.className = 'state ok'; state.textContent = 'Ready'; }
        else if (kind === 'gate') { state.className = 'state warn'; state.textContent = 'Locked'; }
      }
      return;
    }

    const next = t - 1;
    el.timeLeft = next;

    if (next <= TIMER_THRESHOLD) el.classList.add("alert"); else el.classList.remove("alert");

    // when it hits zero, set the right state and freeze
    if (next <= 0) {
      el.timeLeft = -1;
      el.textContent = getDayHourMinute(0);
      const row = el.closest('.rowline');
      const kind = row?.dataset?.kind || '';
      const state = row?.querySelector('.state');
      if (state) {
        if (kind === 'scavenge') { state.className = 'state ok'; state.textContent = 'Ready'; }
        else if (kind === 'gate') { state.className = 'state warn'; state.textContent = 'Locked'; }
      }
      return;
    }

    // normal ticking
    el.textContent = getDayHourMinute(next);
  });
}

    // ---------------------------------
    // Safe XHR intercept (guarded so we don’t double-wrap prototype)
    // ---------------------------------
    (function () {
      if (XMLHttpRequest.prototype.__zedExplorationWrapped) return;
      const originalOpen = XMLHttpRequest.prototype.open;
      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (method, url) {
        this._interceptedURL = url;
        return originalOpen.apply(this, arguments);
      };
      XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            try {
              const response = JSON.parse(this.responseText);
              const eventData = { url: this._interceptedURL, response };
              window.dispatchEvent(new CustomEvent("xhrIntercepted", { detail: eventData }));
            } catch (e) {}
          }
        });
        return originalSend.apply(this, arguments);
      };
      Object.defineProperty(XMLHttpRequest.prototype, '__zedExplorationWrapped', { value: true, configurable: false });
    })();

    // ---------------------------------
    // Data collectors
    // ---------------------------------

    // When we receive getLocation, we treat that as "arriving" at a top-level location.
    // We store an arrival timestamp and mark that this location needs a one-time prune.
    function handleLocation(response) {
      current_location = response.name || current_location;
      const all = readData();
      const cur = all[current_location] || {};
      const meta = cur.meta || {};
      meta.lastArrival = Date.now();
      meta.needsArrivalPrune = true; // first getRoom after arrival will prune stale stuff
      all[current_location] = {
        npcs: cur.npcs || {},
        gates: cur.gates || {},
        scavenge: cur.scavenge || {},
        meta
      };
      writeData(all);
    }

    // Helper: prune entries whose timers already hit 0 *before arrival*.
    function pruneOnArrival(cur) {
      const now = Date.now();
      const arrivalTs = cur?.meta?.lastArrival || now;
      const result = {
        npcs: {},
        gates: {},
        scavenge: cur.scavenge || {},
        meta: { ...(cur.meta || {}), needsArrivalPrune: false, prunedAt: now }
      };

      // NPCs: respawn_time is an absolute ms timestamp we saved previously.
      // If respawn_time <= arrivalTs (i.e., timer would have been 0 or negative BEFORE we arrived),
      // drop it so new spawns/renames won't duplicate.
      for (const id in (cur.npcs || {})) {
        const npc = cur.npcs[id];
        const respawn = Number(npc.respawn_time || 0);
        if (respawn > arrivalTs) {
          result.npcs[id] = npc;
        }
      }

      // Gates: gate_next_change_time/gate_unlock_time are absolute ms timestamps when state changes.
      // If that time <= arrivalTs, drop it so we accept whatever the room now tells us.
      for (const id in (cur.gates || {})) {
        const g = cur.gates[id];
        const changeAt = Number(g.gate_next_change_time || g.gate_unlock_time || 0);
        if (changeAt > arrivalTs) {
          result.gates[id] = g;
        }
      }

      return result;
    }

    // Merge helper: add/replace by id without deleting other sub-area items
    function mergeById(target, incoming) {
      for (const id in incoming) {
        target[id] = incoming[id];
      }
      return target;
    }

    function saveExplorationData(response) {
      const all = readData();
      const now = Date.now();

      const cur = all[current_location] || { npcs: {}, gates: {}, scavenge: {}, meta: {} };

      // If this is the first room load after arriving, prune stale entries once.
      let working = cur;
      if (cur.meta?.needsArrivalPrune) {
        working = pruneOnArrival(cur);
      } else {
        // ensure meta object exists
        working.meta = working.meta || {};
      }

      // Build fresh payloads from this getRoom
      const npcsIncoming = {};
      if (Array.isArray(response.npcs)) {
        const timeNow = new Date();
        for (const npc of response.npcs) {
          const id = npc.id;
          const life = npc.vars?.life;
          const max_life = npc.vars?.max_life;
          const respawn_left = npc.vars?.respawn_time || 0; // seconds until respawn
          const respawn_time = timeNow.getTime() + respawn_left * 1000; // absolute ms
          npcsIncoming[id] = { name: npc.name, life, max_life, respawn_time };
        }
      }

      const gatesIncoming = {};
      if (Array.isArray(response.gates)) {
        const timeNow = new Date().getTime();
        for (const gate of response.gates) {
          const id = gate.id;
          const unlocked = !!(gate.vars?.unlocked);
          const next_secs = gate.vars?.unlock_time || 0;
          const gate_next_change_time = next_secs ? timeNow + next_secs * 1000 : 0;
          const required_items = {};
          if (gate.items) {
            for (const key in gate.items) {
              const it = gate.items[key];
              required_items[it.name] = it.req_qty;
            }
          }
          const gate_unlock_time = gate_next_change_time; // legacy fallback (renderer uses next_change)
          gatesIncoming[id] = { name: gate.name, unlocked, gate_next_change_time, gate_unlock_time, unlock_time: next_secs, required_items };
        }
      }

      // Scavenge only updated when we see it; we don't want to erase existing cooldowns from other sub-areas.
      const scavengeIncoming = {};
      const scavenge_invalid = ["Fuel Pumps","Foundation Pit","Bulk Goods Lockup","Scrap Pile","Warm Springs","Red River","Grand Lake"];
      if (Array.isArray(response.scavenge)) {
        const tNow = new Date().getTime();
        for (const s of response.scavenge) {
          if (scavenge_invalid.includes(s.name)) continue;
          const cooldown = s.vars?.cooldown || 0;
          scavengeIncoming[s.id] = { name: s.name, cooldown, cooldown_end: cooldown ? tNow + cooldown * 1000 : -1 };
        }
      }

      // Merge the new data without wiping other entries (sub-areas)
      working.npcs = mergeById(working.npcs || {}, npcsIncoming);
      working.gates = mergeById(working.gates || {}, gatesIncoming);
      working.scavenge = mergeById(working.scavenge || {}, scavengeIncoming);

      // Bookkeeping
      working.meta.lastRoomUpdate = now;

      all[current_location] = working;
      writeData(all);
    }

    function handleExplorationTrade(response) {
      const all = readData();
      const cur = all[current_location] || { npcs: {}, gates: {}, scavenge: {}, meta: {} };
      const now = new Date();
      const job = response.job;
      const wait = job?.vars?.cooldown || 0;
      cur.scavenge[job.id] = { name: job.name, cooldown: wait, cooldown_end: now.getTime() + wait * 1000 };
      all[current_location] = cur; writeData(all);
    }

    function handleStartJob(response) {
      if (response.error) return;
      const code = response.job?.codename || "";
      if (code.startsWith("job_fuel_depot_fuel_trader") || code.startsWith("job_vault_lockbox") || code.startsWith("job_demolition_site")) {
        handleExplorationTrade(response);
      }
    }

    // ---------------------------------
    // Collapsible UI (per-location persistent)
    // ---------------------------------
    function preventNav(e) { e.preventDefault(); e.stopPropagation(); }

    function makeCollapsibleSection(title, contentElement, initiallyOpen, locationName) {
      const slug = `${slugify(locationName)}-${slugify(title)}`;
      const wrapper = document.createElement("div");
      wrapper.className = "collapsible-section explore-ui";
      wrapper.setAttribute("data-exploration-ui", "1");

      const header = document.createElement("button");
      header.type = "button";
      header.className = "collapsible-header";
      header.setAttribute("aria-expanded", initiallyOpen ? "true" : "false");
      header.setAttribute("aria-controls", `${slug}-section`);
      header.innerHTML = `<span class="arrow">${initiallyOpen ? "▼" : "►"}</span> ${title}`;
      ["pointerdown","mousedown","touchstart"].forEach(evt => { header.addEventListener(evt, preventNav, true); });

      const body = document.createElement("div");
      body.id = `${slug}-section`;
      body.className = "collapsible-body";
      body.style.display = initiallyOpen ? "block" : "none";
      body.appendChild(contentElement);

      function toggle(open) {
        const isOpen = open !== undefined ? open : body.style.display === "none";
        body.style.display = isOpen ? "block" : "none";
        header.querySelector(".arrow").textContent = isOpen ? "▼" : "►";
        header.setAttribute("aria-expanded", isOpen ? "true" : "false");
        body.toggleAttribute("hidden", !isOpen);
        setSectionState(locationName, title, isOpen); // persist
      }
      header.addEventListener("click", () => toggle());
      header.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } });

      wrapper.appendChild(header);
      wrapper.appendChild(body);
      return wrapper;
    }

    // compact renderers (3-up, with pipes)
    function makeSep(){ const s=document.createElement('span'); s.className='sep'; s.textContent=' | '; return s; }

function createNPCSection(locationName, npcs){
  const content = document.createElement('div');
  content.className = 'grid three-up';

  if (!npcs || Object.keys(npcs).length === 0){
    const empty = document.createElement('div');
    empty.className = 'rowline empty';
    empty.textContent = 'No NPCs available';
    content.appendChild(empty);
    const open = getSectionState(locationName, 'NPCs', true);
    return makeCollapsibleSection('NPCs', content, open, locationName);
  }

  const now = Date.now();

  for (const id in npcs){
    const npc = npcs[id];
    const item = document.createElement('div');
    item.className = 'rowline';
    item.title = npc.name;

    // HP column
    const life = npc.life ?? '—';
    const maxLife = npc.max_life ?? '—';

    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.textContent = npc.name;

    const hpEl = document.createElement('span');
    hpEl.className = 'hp';
    hpEl.textContent = `${life}/${maxLife}`;

    // Timer column
    const respawnMs = npc.respawn_time ? npc.respawn_time - now : 0;
    const secs = Math.max(0, Math.floor(respawnMs / 1000));

    const timerEl = document.createElement('span');
    timerEl.className = 'timer';
    timerEl.timeLeft = secs; // updateTimers() decrements this
    timerEl.textContent = getDayHourMinute(secs); // always DD:HH:MM:SS

    // Compose row
    item.appendChild(nameEl);
    item.appendChild(makeSep());
    item.appendChild(hpEl);
    item.appendChild(makeSep());
    item.appendChild(document.createTextNode('{'));
    item.appendChild(timerEl);
    item.appendChild(document.createTextNode('}'));

    content.appendChild(item);
  }

  const open = getSectionState(locationName, 'NPCs', true);
  return makeCollapsibleSection('NPCs', content, open, locationName);
}


   function createGatesSection(locationName, gates){
  const content = document.createElement('div');
  content.className = 'grid three-up';

  if (!gates || Object.keys(gates).length === 0){
    const empty = document.createElement('div');
    empty.className = 'rowline empty';
    empty.textContent = 'No gates available';
    content.appendChild(empty);
    const open = getSectionState(locationName, 'Gates', true);
    return makeCollapsibleSection('Gates', content, open, locationName);
  }

  const now = Date.now();

  for (const id in gates){
    const gate = gates[id];
    const item = document.createElement('div');
      item.className = 'rowline';
      item.dataset.kind = 'gate';

    // Tooltip: full requirement breakdown if present
    if (gate.required_items && Object.keys(gate.required_items).length){
      const list = Object.entries(gate.required_items).map(([n,q]) => `${n} (${q})`).join(', ');
      item.title = `Items: ${list}`;
    }

    // Compute time left (if any)
    let changeMillis = 0;
    if (gate.gate_next_change_time) changeMillis = gate.gate_next_change_time - now;
    else if (gate.gate_unlock_time) changeMillis = gate.gate_unlock_time - now;

    let secs = Math.max(0, Math.floor(changeMillis / 1000));
    const isUnlockedNow = !!gate.unlocked && secs > 0; // only unlocked while timer is running

    // Left + middle columns
    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.textContent = gate.name;

    const stateEl = document.createElement('span');
    stateEl.className = isUnlockedNow ? 'state ok' : 'state warn';
    stateEl.textContent = isUnlockedNow ? 'Unlocked' : 'Locked';

    // Right column
    let thirdEl;
    if (secs > 0){
      const timerEl = document.createElement('span');
      timerEl.className = 'timer';
      timerEl.timeLeft = secs;                // ticking handled by updateTimers()
      timerEl.textContent = getDayHourMinute(secs); // always DD:HH:MM:SS
      thirdEl = timerEl;
    } else {
      const needEl = document.createElement('span');
      needEl.className = 'needs';
      if (gate.required_items && Object.keys(gate.required_items).length){
        needEl.textContent = Object.entries(gate.required_items)
          .map(([n,q]) => `${n} (${q})`)
          .join(', ');
      } else {
        needEl.textContent = '—';
      }
      thirdEl = needEl;
    }

    // Compose row
    item.appendChild(nameEl);
    item.appendChild(makeSep());
    item.appendChild(stateEl);
    item.appendChild(makeSep());
    item.appendChild(document.createTextNode('{'));
    item.appendChild(thirdEl);
    item.appendChild(document.createTextNode('}'));

    content.appendChild(item);
  }

  const open = getSectionState(locationName, 'Gates', true);
  return makeCollapsibleSection('Gates', content, open, locationName);
}

      function createScavengeSection(locationName, scavenge){
  const content = document.createElement('div');
  content.className = 'grid three-up';

  if (!scavenge || Object.keys(scavenge).length === 0){
    const empty = document.createElement('div');
    empty.className = 'rowline empty';
    empty.textContent = 'No loot crates found';
    content.appendChild(empty);
    const open = getSectionState(locationName, 'Loot Crates', true);
    return makeCollapsibleSection('Loot Crates', content, open, locationName);
  }

  const now = Date.now();

  for (const id in scavenge){
    const s = scavenge[id];
    const item = document.createElement('div');
    item.className = 'rowline';
    item.dataset.kind = 'scavenge'; // so updateTimers knows how to flip state

    const nameEl = document.createElement('span');
    nameEl.className = 'name';
    nameEl.textContent = s.name || 'Loot';

    // time remaining (we persist cooldown_end in ms)
    let secs = 0;
    if (typeof s.cooldown_end === 'number' && s.cooldown_end > 0){
      secs = Math.max(0, Math.floor((s.cooldown_end - now) / 1000));
    }

    // state badge
    const stateEl = document.createElement('span');
    if (secs === 0){
      stateEl.className = 'state ok';
      stateEl.textContent = 'Ready';
    } else {
      stateEl.className = 'state warn';
      stateEl.textContent = 'Cooling';
    }

    // right column: the live timer (always show; freezes at 00:00:00:00)
    const timerEl = document.createElement('span');
    timerEl.className = 'timer';
    timerEl.timeLeft = secs === 0 ? -1 : secs; // -1 means “finished” to our updater
    timerEl.textContent = getDayHourMinute(secs);

    // compose row
    item.appendChild(nameEl);
    item.appendChild(makeSep());
    item.appendChild(stateEl);
    item.appendChild(makeSep());
    item.appendChild(document.createTextNode('{'));
    item.appendChild(timerEl);
    item.appendChild(document.createTextNode('}'));

    content.appendChild(item);
  }

  const open = getSectionState(locationName, 'Loot Crates', true);
  return makeCollapsibleSection('Loot Crates', content, open, locationName);
}



    // ---------------------------------
    // Render on Explore screen
    // ---------------------------------
    function safeInsertAfter(card, node){
      try { if (card && card.parentNode) { card.parentNode.insertBefore(node, card.nextSibling); return true; } } catch(e) {}
      return false;
    }
    function display_exploration_data(){
      try {
        const all = readData();
        if (!location.href.includes('/explore')) return;
        const titles = Array.from(document.querySelectorAll('.job-name'));
        if (titles.length === 0) return;
        for (const titleEl of titles){
          if (titleEl.hasAttribute('data-exploration-processed')) continue;
          const locationName = (titleEl.textContent || '').trim();
          const locationData = all[locationName];
          if (!locationData) { titleEl.setAttribute('data-exploration-processed','1'); continue; }
          const container = document.createElement('div');
          container.className = 'exploration-data-container explore-ui';
          container.setAttribute('data-exploration-ui', '1');
          container.appendChild(createNPCSection(locationName, locationData.npcs));
          container.appendChild(createGatesSection(locationName, locationData.gates));
            container.appendChild(createScavengeSection(locationName, locationData.scavenge));
          let card = titleEl; let p = titleEl.parentElement;
          while (p){
            const classes = [...p.classList];
            if (classes.some(c => c.startsWith('job-cont'))) { card = p; break; }
            p = p.parentElement;
          }
          if (!safeInsertAfter(card, container)) { card.insertAdjacentElement('afterend', container); }
          titleEl.setAttribute('data-exploration-processed','1');
        }
      } catch(err){ console.error('[Exploration UI] render error:', err); }
    }

    // ---------------------------------
    // Wiring (guarded push/replace wrappers)
    // ---------------------------------
    window.addEventListener('xhrIntercepted', (e) => {
      const { url, response } = e.detail;
      if (String(url).includes('getLocation')) { handleLocation(response); }
      else if (String(url).includes('getRoom')) { saveExplorationData(response); display_exploration_data(); }
      else if (String(url).includes('startJob')) { handleStartJob(response); }
    });

    function onRouteChange(){ setTimeout(() => { if (location.href.includes('/explore')) display_exploration_data(); }, 300); }

    if (!history.__zedExploreWrapped){
      const origPush = history.pushState;
      history.pushState = function(){ const r = origPush.apply(this, arguments); onRouteChange(); return r; };
      const origReplace = history.replaceState;
      history.replaceState = function(){ const r = origReplace.apply(this, arguments); onRouteChange(); return r; };
      Object.defineProperty(history, '__zedExploreWrapped', { value: true, configurable: false });
    }

    window.addEventListener('hashchange', onRouteChange);
    window.addEventListener('popstate', onRouteChange);

    const mo = new MutationObserver(() => { if (location.href.includes('/explore')) display_exploration_data(); });
    mo.observe(document.documentElement, { childList: true, subtree: true });

    const timerId = setInterval(updateTimers, 1000);
    // Stop timers if user turns the toggle off without reload (defensive)
    window.addEventListener('beforeunload', () => clearInterval(timerId));

    // ---------------------------------
    // Styling
    // ---------------------------------
    const style = document.createElement('style');
    style.textContent = `
      .exploration-data-container { margin-top:4px; padding:4px; border-radius:4px; background: linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02)); backdrop-filter: blur(2px); position: relative; z-index: 1; font-size:10px; box-shadow: 0 1px 8px rgba(0,0,0,.12); }
      .collapsible-header { cursor:pointer; font-weight:700; letter-spacing:.2px; margin:4px 0 4px; user-select:none; display:flex; align-items:center; gap:4px; background:transparent; border:0; padding:0; color:inherit; font:inherit; text-align:left; }
      .collapsible-header .arrow { width:1em; text-align:center; }
      .collapsible-body { margin-left:0; }
      .grid.three-up { display:grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap:0; border:1px solid rgba(255,255,255,0.08); border-radius:8px; overflow:hidden; }
      .grid.three-up .rowline { padding:4px 4px; display:flex; align-items:baseline; gap:4px; min-width:0; white-space:nowrap; overflow:hidden; background: rgba(255,255,255,0.02); transition: background .15s ease, transform .05s ease; }
      .grid.three-up .rowline:nth-child(odd) { background: rgba(255,255,255,0.015); }
      .grid.three-up .rowline:hover { background: rgba(255,255,255,0.06); }
      .grid.three-up .rowline .name { font-weight:600; overflow:hidden; text-overflow:ellipsis; }
      .grid.three-up .sep { opacity:.5; }
      .grid.three-up .timer.alert { color:#ff4d4f; }
      .rowline.empty { padding:6px; opacity:.75; }
      .state.ok { color:#9cff9c; }
      .state.warn { color:#ffae7a; }
    `;
      style.textContent += `
  .grid.three-up .needs { opacity:.9; font-style:italic; }
`;
    document.head.appendChild(style);
  })();
}

    // ---------- Market selling ----------
function run_marketSelling(){
  (function(){
    'use strict';

    const MARKET_KEY = "Zed-market-data";
    let modalActive = false;

    function getMarketMap(){
      try { return JSON.parse(localStorage.getItem(MARKET_KEY) || "{}"); }
      catch { return {}; }
    }

    function fillSellPriceRespectfully(){
      const titleDiv = document.querySelector(".title div");
      if (!titleDiv || !/Create Listing/i.test(titleDiv.textContent || "")) return false;

      const nameEl = document.querySelector(".q-py-sm > div:nth-child(1)");
      if (!nameEl) return false;

      const itemName = (nameEl.textContent || "").trim();
      if (!itemName) return false;

      const market = getMarketMap();
      const price = Number(market[itemName]);
      if (!Number.isFinite(price)) return false;

      const moneyWrap = document.querySelector(".zed-money-input");
      const input = moneyWrap && moneyWrap.querySelector("input");
      if (!input) return false;

      // Respect the user: only prefill if empty or previously autofilled
      const alreadyAuto = input.dataset.autofilled === "1";
      const emptyField = (input.value || "").trim() === "";

      if (!alreadyAuto && !emptyField) return true; // user already typed something

      // Don’t change while the user is actively typing
      if (document.activeElement === input && !alreadyAuto) return true;

      input.value = String(price - 1);
      input.dataset.autofilled = "1";
      input.dispatchEvent(new Event("input", { bubbles: true }));

      // First user edit disables further autofill for this modal
      const onUserEdit = () => {
        delete input.dataset.autofilled;
        input.removeEventListener("input", onUserEdit);
      };
      input.addEventListener("input", onUserEdit);

      return true;
    }

    // Watch for the Create Listing modal appearing/disappearing
    const mo = new MutationObserver(() => {
      const isOpen = !!document.querySelector(".title div") &&
                     /Create Listing/i.test((document.querySelector(".title div")?.textContent || ""));

      if (isOpen && !modalActive) {
        modalActive = true;
        // Try a few times to catch late-drawn inputs, then stop
        let tries = 8;
        const tryFill = () => {
          if (fillSellPriceRespectfully() || --tries <= 0 || !modalActive) return;
          setTimeout(tryFill, 60);
        };
        tryFill();
      } else if (!isOpen && modalActive) {
        // Modal closed: reset state for next time
        modalActive = false;
      }
    });

    mo.observe(document.documentElement, { childList: true, subtree: true });

    // Also try once shortly in case the modal is already open
    setTimeout(() => { if (!modalActive) fillSellPriceRespectfully(); }, 200);
  })();
}

    // ---------- Store Remaining ----------
function run_storeRemainingAmounts() {
  if (window.__SRA_INIT__) return; window.__SRA_INIT__ = true;

  const ITEM_LIMIT = 360;
  let used = 0;
  const stock = Object.create(null);
  const inv = Object.create(null);

  function handleStore(resp){
    const total = +resp?.limits?.limit || 0;
    const left = +resp?.limits?.limit_left || 0;
    used = Math.max(0, total - left);

    for (const it of (resp?.storeItems || [])) stock[it.name] = +it.quantity || 0;
    for (const it of (resp?.userItems || [])) inv[it.name] = +it.quantity || 0;

    microTry(insertBadge);
    //microTry(autofillQty); -- BUG
  }

  function microTry(fn, tries=10){
    (function loop(){ if (fn() === true || --tries <= 0) return; setTimeout(loop, 50); })();
  }

  function insertBadge(){
    const host = document.querySelector('.text-h4');
    if (!host) return false;
    let badge = document.getElementById('zed-item-limit');
    if (!badge){ badge = document.createElement('div'); badge.id = 'zed-item-limit'; host.appendChild(badge); }
    badge.textContent = ` [ ${used} / ${ITEM_LIMIT} ]`;
    host.style.color = used < ITEM_LIMIT ? '#6fcf97' : '#e76f51';
    return true;
  }

  /*function autofillQty(){     ///TODO FIX BUG CAUSING MASS DELITION OF ITEMS BY ACCIDENT - NOT GOOD!! BAD CODE. Hello, if you are reading this :)
    const nameEl = document.querySelector('.small-modal > div:nth-child(1)');
    const qtyInput = document.querySelector('.small-modal div.grid-cont input');
    const actionEl = document.querySelector('div.text-center:nth-child(2) > button span span');
    if (!nameEl || !qtyInput || !actionEl) return false;

    const item = (nameEl.textContent || '').trim();
    const buying = /Buy/i.test(actionEl.textContent || '');
    let qty = 0;

    if (buying){
      const remaining = Math.max(0, ITEM_LIMIT - used);
      qty = Math.min(remaining, +stock[item] || 0);
    } else {
      qty = +inv[item] || 0;
    }

    qtyInput.value = String(qty);
    qtyInput.dispatchEvent(new Event('input', { bubbles:true }));
    return true;
  }*/

  // ---- Chain-safe XHR hook: tap current impl, don't clobber it ----
  (function hookXHROnce(){
    if (XMLHttpRequest.prototype.__sraHooked__) return;
    const prevOpen = XMLHttpRequest.prototype.open;
    const prevSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(method, url){
      this.__sra_url = url || '';
      return prevOpen.apply(this, arguments); // chain
    };
    XMLHttpRequest.prototype.send = function(body){
      // read after completion
      this.addEventListener('readystatechange', function(){
        if (this.readyState !== 4) return;
        try {
          const url = String(this.__sra_url || '');
          if (url.includes('store_id')) {
            const json = JSON.parse(this.responseText || 'null');
            if (json) handleStore(json);
          }
        } catch {}
      });
      return prevSend.apply(this, arguments); // chain
    };
    Object.defineProperty(XMLHttpRequest.prototype, '__sraHooked__', { value: true });
  })();

  // ---- Chain-safe fetch hook (tiny) ----
  (function hookFetchOnce(){
    if (window.__sraFetchHooked__) return;
    window.__sraFetchHooked__ = true;
    const prevFetch = window.fetch;
    window.fetch = async function(){
      const res = await prevFetch.apply(this, arguments);
      try {
        const req = arguments[0];
        const url = typeof req === 'string' ? req : (req && req.url) || '';
        if (url.includes('store_id')) {
          const clone = res.clone();
          const json = await clone.json();
          if (json) handleStore(json);
        }
      } catch {}
      return res;
    };
  })();

  // also try filling when user opens the modal ---- BUG
 // document.addEventListener('click', () => microTry(autofillQty), true);
}


// ===============================
// Rad Tracker (uses Zed-market-data + codename index)
// ===============================
function run_radTracker(){
  (function(){
    // --- keys from your market module
    const MARKET_KEY = "Zed-market-data";
    const CODEMAP_KEY = "Zed-market-codemap";
    const ROI_KEY = "Zed-explore-roi";

    // init ROI store
    if (!localStorage.getItem(ROI_KEY)) {
      localStorage.setItem(ROI_KEY, JSON.stringify({ trip:{ rads:0, value:0 }, lastSummaryAt:0 }));
    }

    // ---------- small storage helpers ----------
    const readROI = () => { try { return JSON.parse(localStorage.getItem(ROI_KEY)) || { trip:{rads:0,value:0}, lastSummaryAt:0 }; } catch { return { trip:{rads:0,value:0}, lastSummaryAt:0 }; } };
    const writeROI = (roi) => localStorage.setItem(ROI_KEY, JSON.stringify(roi));
    const readMarket = () => { try { return JSON.parse(localStorage.getItem(MARKET_KEY) || "{}"); } catch { return {}; } };
    const readCodeMap = () => { try { return JSON.parse(localStorage.getItem(CODEMAP_KEY) || "{}"); } catch { return {}; } };
    const writeCodeMap = (m) => localStorage.setItem(CODEMAP_KEY, JSON.stringify(m || {}));

    // ---------- UI helpers ----------
    function roiGet(){ const r = readROI(); return { ...r.trip, roi: r.trip.rads > 0 ? (r.trip.value / r.trip.rads) : 0 }; }
    function roiAddRads(n){ if (!Number.isFinite(+n) || !+n) return; const r=readROI(); r.trip.rads = Math.max(0,(r.trip.rads||0)+(+n)); writeROI(r); refreshRoiPanel(); }
    function roiAddValue(n){ if (!Number.isFinite(+n) || !+n) return; const r=readROI(); r.trip.value= Math.max(0,(r.trip.value||0)+(+n)); writeROI(r); refreshRoiPanel(); }
    function roiClearAll(){ writeROI({ trip:{rads:0,value:0}, lastSummaryAt:0 }); refreshRoiPanel(); }

    // ---------- build a codename→name/price index whenever getMarket is seen ----------
    // getMarket responses have items with { name, codename, market_price }.
    // We'll mirror them into CODEMAP_KEY for fast codename lookups.
    if (typeof addNetListener === "function") {
      addNetListener(/getMarket(?!User)/i, (_url, resp) => {
        try {
          const items = (resp && (resp.items || (resp.data && resp.data.items) || Array.isArray(resp) && resp)) || [];
          if (!Array.isArray(items) || !items.length) return;
          const m = readCodeMap();
          const now = Date.now();
          for (const it of items) {
            const code = it?.codename; const name = it?.name;
            const price = Number(it?.market_price);
            if (!code || !name) continue;
            const entry = m[code] || {};
            m[code] = {
              name,
              // prefer latest numeric price if present
              price: Number.isFinite(price) ? price : (Number.isFinite(entry.price) ? entry.price : undefined),
              ts: now
            };
          }
          writeCodeMap(m);
        } catch {}
      });
    }

    // ---------- pricing helper (codename → unit price) ----------
    function unitPriceForCodename(code, rewardVars){
      if (!code) return null;

      // 1) Try codemap direct (latest market_price we saw with this codename)
      const cm = readCodeMap()[code];
      if (cm && Number.isFinite(cm.price)) return cm.price;

      // 2) Try codemap name → market cache (name -> price in MARKET_KEY)
      //    This covers cases where our codemap has name but not price yet.
      if (cm && typeof cm.name === "string") {
        const named = readMarket()[cm.name];
        if (Number.isFinite(+named)) return +named;
      }

      // 3) Last resort: if reward payload has hints
      const fallbacks = [
        Number(rewardVars?.value),
        Number(rewardVars?.vars?.sell),
        Number(rewardVars?.vars?.buy)
      ];
      for (const v of fallbacks) if (Number.isFinite(v)) return v;

      // 4) Also try a naive name lookup if the reward included a readable name
      //    (some APIs send both name and codename)
      const nameFromReward = rewardVars?.name;
      if (nameFromReward) {
        const byName = readMarket()[nameFromReward];
        if (Number.isFinite(+byName)) return +byName;
      }

      return null;
    }

    // ---------- Start_job valuation ----------
    function valueStartJob(resp){
      const outcome = resp?.outcome || {};
      const job = resp?.job || {};
      const iters = Number.isFinite(outcome.iterations) ? outcome.iterations : 1;

      // Rads from requirement "rad" in job.items (req_qty * iterations)
      let radSpent = 0;
      if (job.items) {
        for (const k of Object.keys(job.items)) {
          const req = job.items[k];
          if (req?.codename === "rad") radSpent += (Number(req.req_qty) || 0) * iters;
        }
      }

      // Loot value = Σ (posted_qty × unitPriceForCodename)
      let valueAdd = 0;
      for (const r of Array.isArray(outcome.rewards) ? outcome.rewards : []) {
        const code = r.codename || r.name || "unknown";
        const qty = Number.isFinite(r.posted_qty) ? r.posted_qty : 0;
        if (qty <= 0) continue;

        const unit = unitPriceForCodename(code, r);
        if (Number.isFinite(+unit)) valueAdd += (+unit) * qty;
      }

      return { radSpent, valueAdd };
    }

    // ---------- scan network responses ----------
    function scanResponse(url, response){
      try{
        if (!/start_job|startJob/i.test(url)) return;
        if (!response?.outcome) return;

        const { radSpent, valueAdd } = valueStartJob(response);
        if (radSpent > 0) roiAddRads(radSpent);
        if (valueAdd > 0) roiAddValue(valueAdd);

        // console.debug("[radTracker] Δ", { radSpent, valueAdd });
      } catch {}
    }

    // ---------- wire to XHR/fetch (guarded) ----------
    (function (){
      const FLAG = '__radTrackerWrapped';
      if (XMLHttpRequest.prototype[FLAG]) return;
      const originalOpen = XMLHttpRequest.prototype.open;
      const originalSend = XMLHttpRequest.prototype.send;
      XMLHttpRequest.prototype.open = function (method, url) { this._url = url; return originalOpen.apply(this, arguments); };
      XMLHttpRequest.prototype.send = function (body) {
        this.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            try {
              const text = this.responseText || "";
              const first = text[0];
              if (!text || (first !== '{' && first !== '[')) return;
              const response = JSON.parse(text);
              scanResponse(this._url || "", response);
            } catch {}
          }
        });
        return originalSend.apply(this, arguments);
      };
      Object.defineProperty(XMLHttpRequest.prototype, FLAG, { value: true, configurable: false });
    })();

    // ---------- mini UI ----------
    let roiPanel, roiBtn;
    function refreshRoiPanel(){
      if (!roiPanel) return;
      const m = roiGet();
      roiPanel.querySelector(".erp-rads").textContent = m.rads.toFixed(0);
      roiPanel.querySelector(".erp-value").textContent = m.value.toFixed(0);
      roiPanel.querySelector(".erp-vpr").textContent = (m.rads > 0 ? m.roi : 0).toFixed(2);
    }
    function toggleRoiPanel(){ if (!roiPanel) return; roiPanel.classList.toggle('open'); if (roiPanel.classList.contains('open')) refreshRoiPanel(); }
    function buildRoiPanel(){
      if (roiPanel) return roiPanel;
      roiPanel = document.createElement('div');
      roiPanel.className = 'explore-roi-panel';
      roiPanel.innerHTML = `
        <div class="erp-head"><strong>RAD ROI</strong><button class="erp-close" aria-label="Close">✕</button></div>
        <div class="erp-body">
          <div class="erp-row"><span>Rads spent:</span><b class="erp-rads">0</b></div>
          <div class="erp-row"><span>Loot value:</span><b class="erp-value">0</b></div>
          <div class="erp-row"><span>Value / Rad:</span><b class="erp-vpr">0</b></div>
        </div>
        <div class="erp-actions"><button class="erp-reset">Reset</button></div>
      `;
      roiPanel.querySelector(".erp-close").addEventListener("click", toggleRoiPanel);
      roiPanel.querySelector(".erp-reset").addEventListener("click", () => roiClearAll());
      document.body.appendChild(roiPanel);
      refreshRoiPanel();
      return roiPanel;
    }
    function ensureRoiButton(){
      if (roiBtn) return roiBtn;
      roiBtn = document.createElement('button');
      roiBtn.className = 'explore-roi-btn';
      roiBtn.type = 'button';
      roiBtn.title = 'Show ROI';
      roiBtn.textContent = 'Rad ROI';
      roiBtn.addEventListener('click', () => { buildRoiPanel(); toggleRoiPanel(); });
      const gearLike = document.querySelector('.gear, .settings, .zed-gear, .zed-options, [data-gear], [data-zed-gear]');
      if (gearLike?.parentElement) gearLike.parentElement.appendChild(roiBtn);
      else document.body.appendChild(roiBtn);
      return roiBtn;
    }
const style = document.createElement('style');
style.textContent = `
  .explore-roi-btn {
    position:fixed; right:12px; bottom:45%; z-index:9999;
    padding:6px 12px; font-weight:600; font-size:12px; border-radius:8px;
    border:1px solid rgba(255,255,255,.15);
    background:rgba(20,20,28,.75); color:#fff; cursor:pointer;
    box-shadow: 0 3px 12px rgba(0,0,0,.4); backdrop-filter: blur(5px);
    transition: all .15s ease;
  }
  .explore-roi-btn:hover {
    background:rgba(32,34,44,.9);
    transform: translateY(-1px);
  }

  .explore-roi-panel {
    position:fixed; right:12px; bottom:110px; z-index:10000; width:240px;
    display:none; padding:12px; border-radius:12px;
    background:rgba(16,18,22,.95); color:#fff;
    border:1px solid rgba(255,255,255,.12);
    box-shadow:0 8px 28px rgba(0,0,0,.55); backdrop-filter: blur(8px);
    font-size:13px;
  }
  .explore-roi-panel.open { display:block; }

  .erp-head {
    display:flex; align-items:center; justify-content:space-between;
    margin-bottom:10px; font-weight:600; font-size:14px;
  }

  .erp-body {
    display:grid;
    grid-template-columns: 1fr auto;
    gap:8px 6px;
    margin-bottom:10px;
  }

  .erp-row {
    grid-column: 1 / -1;
    display:flex; align-items:center; justify-content:space-between;
    padding:6px 8px;
    border-radius:8px;
    background:rgba(255,255,255,.05);
    border:1px solid rgba(255,255,255,.08);
  }

  .erp-label { font-weight:500; color:#e2e2e2; }
  .erp-value { font-weight:600; color:#fff; font-variant-numeric: tabular-nums; }

  .erp-actions {
    display:flex; gap:6px; margin-top:8px;
  }
  .erp-actions button {
    flex:1 1 auto; padding:6px 10px; border-radius:6px;
    border:1px solid rgba(255,255,255,.18);
    background:rgba(32,36,42,.85); color:#fff;
    cursor:pointer; font-size:12px;
    transition: all .15s ease;
  }
  .erp-actions button:hover {
    background:rgba(45,50,60,.9);
  }
`;
document.head.appendChild(style);


    ensureRoiButton();
    buildRoiPanel();
  })();
}


    // ---------- Market Favs ----------
      function run_Durability(){
// Lite Durability/Condition annotator — FIXED (plain object)
(function(){
  const TIER_USES = {
    brittle:10,"very weak":25,poor:50,weak:100,moderate:150,tempered:200,
    resilient:250,durable:300,reinforced:350,robust:500,"long lasting":1000,
    enduring:2000,pristine:3000,embued:4000,imbued:4000,immaculate:5000
  };
  const TIERS = Object.keys(TIER_USES);
  const norm = s => String(s||'').toLowerCase().replace(/\s+/g,' ').trim();

  function readTierWord(el){
    const txt = norm(el.textContent||'');
    return TIERS.find(t => txt.includes(t)) || null;
  }
  function findConditionPercent(scope){
    const condEl = scope.querySelector('.stat-condition') || (() => {
      const blocks = scope.querySelectorAll('.stat-block');
      for (const b of blocks) {
        const l = b.querySelector('.stat-label');
        if (l && norm(l.textContent)==='condition') return b;
      }
      return null;
    })();
    if (!condEl) return null;
    const m = (condEl.textContent||'').match(/(\d{1,3})\s*%/);
    return m ? Math.min(100, Math.max(0, parseInt(m[1],10))) / 100 : null;
  }
  function update(root=document){
    root.querySelectorAll('.stat-block').forEach(block=>{
      const lbl = block.querySelector('.stat-label');
      if (!lbl || norm(lbl.textContent) !== 'durability') return;

      const val = block.querySelector('.stat-durability') || block.querySelector('.stat-value');
      if (!val) return;

      const tierWord = readTierWord(val);
      if (!tierWord) return;

      const max = TIER_USES[tierWord];
      if (!max) return;

      const grid = block.closest('.item-stats-grid') || document;
      const pct = findConditionPercent(grid);
      const text = (pct!=null) ? `${Math.round(max*pct)}/${max}` : `${max}`;

      let badge = val.querySelector('.zed-dur-uses-badge');
      if (!badge) {
        badge = document.createElement('span');
        badge.className = 'zed-dur-uses-badge';
        badge.style.cssText = 'margin-left:.5rem;font-size:12px;opacity:.9;';
        val.appendChild(badge);
      }
      badge.textContent = text;
    });
  }
  function scheduleBurst(){
    requestAnimationFrame(update);
    setTimeout(update, 80);
    setTimeout(update, 200);
    setTimeout(update, 450);
  }
  document.addEventListener('click', scheduleBurst, true);
  document.addEventListener('keyup', e => { if (e.key==='Enter'||e.key===' ') scheduleBurst(); }, true);
  new MutationObserver(m=>{ for (const x of m) for (const n of x.addedNodes||[]) if (n.nodeType===1 && n.querySelector?.('.stat-durability,.stat-condition,.item-stats-grid,.stat-block')) update(n); })
    .observe(document.body,{childList:true,subtree:true});
  setTimeout(update, 200);
})();

      }


// ===============================
// Market Buy Tracker
// ===============================
function run_marketBuyTracker(){
  (function(){
    const API_ITEMS = "https://api.zed.city/loadItems";
    const MARKET_KEY = "Zed-market-data";
    const MBT_LOG_KEY = "Zed-market-buys-log"; // array of entries to persist
    const POLL_MS = 30_000;

    let lastSnapshot = new Map();
    let lastSnapshotAt = 0;
    let pollTimer = null;
    let inFlightBuy = false;
    let panel, btn, list;

    const nowISO = () => new Date().toLocaleString();
    const readMarket = () => { try { return JSON.parse(localStorage.getItem(MARKET_KEY)||"{}"); } catch { return {}; } };
    const readLog = () => { try { return JSON.parse(localStorage.getItem(MBT_LOG_KEY)||"[]"); } catch { return []; } };
    const writeLog = (arr) => localStorage.setItem(MBT_LOG_KEY, JSON.stringify(arr.slice(-500))); // keep last 500

    function indexInv(json){
      const map = new Map();
      const items = Array.isArray(json?.items) ? json.items : [];
      for (const it of items){
        const key = it.codename || it.id || it.name;
        const qty = Number(it.quantity)||0;
        map.set(key, qty);
      }
      return map;
    }

    async function fetchInventory(){
      try{
        const r = await fetch(API_ITEMS, {credentials:"include"});
        if (!r.ok) return;
        const j = await r.json();
        lastSnapshot = indexInv(j);
        lastSnapshotAt = Date.now();
      }catch{}
    }

    function startPoll(){
      clearInterval(pollTimer);
      pollTimer = setInterval(fetchInventory, POLL_MS);
      fetchInventory();
    }

    function ensureStyles(){
      if (document.getElementById("mbt-style")) return;
      const css = document.createElement("style");
      css.id = "mbt-style";
      css.textContent = `
      .mbt-btn {
        position:fixed; right:12px; bottom:55%; z-index:9999;
        padding:6px 12px; font-weight:600; font-size:12px; border-radius:8px;
        border:1px solid rgba(255,255,255,.15);
        background:rgba(20,20,28,.75); color:#fff; cursor:pointer;
        box-shadow:0 3px 12px rgba(0,0,0,.4); backdrop-filter: blur(5px);
        transition:all .15s ease;
      }
      .mbt-btn:hover { background:rgba(32,34,44,.9); transform: translateY(-1px); }
      .mbt-panel {
        position:fixed; right:12px; bottom:110px; z-index:10000; width:300px;
        display:none; padding:12px; border-radius:12px;
        background:rgba(16,18,22,.95); color:#fff;
        border:1px solid rgba(255,255,255,.12);
        box-shadow:0 8px 28px rgba(0,0,0,.55); backdrop-filter: blur(8px);
        font-size:12px;
      }
      .mbt-panel.open { display:block; }
      .mbt-head { display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; font-weight:700; }
      .mbt-list {
        max-height:260px; overflow:auto; display:flex; flex-direction:column; gap:6px;
        padding-right:2px;
      }
      .mbt-row {
        display:grid; grid-template-columns: 1fr auto; gap:4px 8px;
        padding:6px 8px; border-radius:8px;
        background:rgba(255,255,255,.05); border:1px solid rgba(255,255,255,.08);
      }
      .mbt-row .meta { grid-column:1 / -1; opacity:.85; font-size:11px; display:flex; gap:6px; flex-wrap:wrap; }
      .mbt-row .name { font-weight:600; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
      .mbt-row .qty { font-variant-numeric: tabular-nums; }
      .mbt-row .price { justify-self:end; font-variant-numeric: tabular-nums; }
      .mbt-actions { display:flex; gap:6px; margin-top:8px; }
      .mbt-actions button {
        flex:1 1 auto; padding:6px 10px; border-radius:6px;
        border:1px solid rgba(255,255,255,.18);
        background:rgba(32,36,42,.85); color:#fff;
        cursor:pointer; font-size:12px; transition:.15s ease;
      }
      .mbt-actions button:hover { background:rgba(45,50,60,.9); }
      `;
      document.head.appendChild(css);
    }
    function ensureUI(){
      ensureStyles();
      if (!btn){
        btn = document.createElement("button");
        btn.className = "mbt-btn";
        btn.textContent = "Market Buys";
        btn.title = "Show Market Buys";
        btn.addEventListener("click", () => { ensurePanel(); panel.classList.toggle("open"); });
        document.body.appendChild(btn);
      }
      ensurePanel();
    }
    function ensurePanel(){
      if (panel) return panel;
      panel = document.createElement("div");
      panel.className = "mbt-panel";
      panel.innerHTML = `
        <div class="mbt-head"><span>MARKET BUYS</span><button class="mbt-close" aria-label="Close">✕</button></div>
        <div class="mbt-list"></div>
        <div class="mbt-actions">
          <button class="mbt-clear">Clear</button>

        </div>
      `;
      panel.querySelector(".mbt-close").onclick = () => panel.classList.toggle("open");
      panel.querySelector(".mbt-clear").onclick = () => { writeLog([]); renderFromStorage(); };

      list = panel.querySelector(".mbt-list");
      document.body.appendChild(panel);
      renderFromStorage();
      return panel;
    }
    function renderFromStorage(){
      if (!list) return;
      const data = readLog().slice().reverse();
      list.innerHTML = "";
      for (const entry of data){
        const row = document.createElement("div");
        row.className = "mbt-row";
        const spend = Number(entry.cost)||0;
        const unitTxt = Number.isFinite(entry.unit) ? `$${Math.round(entry.unit).toLocaleString()}` : "—";
        row.innerHTML = `
          <div class="name">${entry.name} <span class="qty">×${entry.qty}</span></div>
          <div class="price">$${Math.round(spend).toLocaleString()}</div>
          <div class="meta">
            <span>${entry.time}</span>
            <span>Unit: ${unitTxt}</span>
          </div>
        `;
        list.appendChild(row);
      }
    }
    function pushLog(entry){
      const arr = readLog();
      arr.push(entry);
      writeLog(arr);
      ensureUI();
      const row = document.createElement("div");
      row.className = "mbt-row";
      const unitTxt = Number.isFinite(entry.unit) ? `$${Math.round(entry.unit).toLocaleString()}` : "—";
      row.innerHTML = `
        <div class="name">${entry.name} <span class="qty">×${entry.qty}</span></div>
        <div class="price">$${Math.round(entry.cost||0).toLocaleString()}</div>
        <div class="meta">
          <span>${entry.time}</span>
          <span>Unit: ${unitTxt}</span>
        </div>
      `;
      list?.insertBefore(row, list.firstChild || null);
    }

    function computeDiff(prev, next, nameByKey){
      const diffs = [];
      const keys = new Set([...prev.keys(), ...next.keys()]);
      for (const k of keys){
        const a = Number(prev.get(k)||0);
        const b = Number(next.get(k)||0);
        const d = b - a;
        if (d > 0){
          const name = nameByKey?.get(k) || String(k);
          diffs.push({ key:k, name, qty:d });
        }
      }
      return diffs;
    }

    function buildNameMap(json){
      const map = new Map();
      const items = Array.isArray(json?.items) ? json.items : [];
      for (const it of items){
        const key = it.codename || it.id || it.name;
        map.set(key, it.name || it.codename || String(it.id));
      }
      return map;
    }

    async function handleBuy(url, resp){
      if (inFlightBuy) return;
      inFlightBuy = true;
      try{
        const bag = Array.isArray(resp?.reactive_items_qty) ? resp.reactive_items_qty : [];
        if (!bag.length) { inFlightBuy = false; return; }

        clearInterval(pollTimer);

        const before = new Map(lastSnapshot);
        const r = await fetch(API_ITEMS, {credentials:"include"});
        if (!r.ok) { startPoll(); inFlightBuy = false; return; }
        const inv = await r.json();

        const after = indexInv(inv);
        const names = buildNameMap(inv);
        const changes = computeDiff(before, after, names);

        const unitPrices = readMarket();
        const time = nowISO();

        for (const ch of changes){
          const unit = Number(unitPrices[ch.name]);
          const cost = Number.isFinite(unit) ? unit * ch.qty : 0;
          pushLog({
            time, name: ch.name, qty: ch.qty,
            unit: Number.isFinite(unit) ? unit : null,
            cost, method: 'marketBuyItem'
          });
        }

        lastSnapshot = after;
        lastSnapshotAt = Date.now();

      } catch (e) {
      } finally {
        startPoll();
        inFlightBuy = false;
      }
    }

    if (typeof addNetListener === "function"){
      addNetListener(/marketBuyItem/i, handleBuy);
    }

    startPoll();
    document.addEventListener("visibilitychange", () => { if (!document.hidden) fetchInventory(); });
    ensureUI();
    renderFromStorage();
  })();
}

    // ---------- Gym Tracker ----------
function run_GymTracker(){

  (function () {
    // ---------- Storage ----------
    const STORE_KEY = 'zed-gym-sessions-v1';
    const MAX_KEEP  = 5000;

    let lastStats = null;   // { morale, strength, defense, agility, speed }
    let lastStatsAt = 0;

    const readJSON = (k, fallback) => {
      try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : fallback; }
      catch { return fallback; }
    };
    const writeJSON = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };

    const readBag = () => readJSON(STORE_KEY, []);
    const writeBag = (arr) => writeJSON(STORE_KEY, arr);

    // ---------- Metric ----------
    function gainPerIter(r){
      if (!r) return null;
      const it = Math.max(1, Number(r.iterations || 1));
      const gt = Number(r.gain_total);
      if (!Number.isFinite(gt)) return null;
      return gt / it;
    }

    // ---------- Network listeners ----------
    // Capture latest morale + stats from getStats
    window.addNetListener?.(/api\.zed\.city\/getStats/i, (_url, json) => {
      const morale = Number(json?.morale ?? json?.stats?.morale ?? json?.data?.morale);
      const s = {
        morale: Number.isFinite(morale) ? morale : null,
        strength: Number(json?.strength ?? json?.stats?.strength),
        defense:  Number(json?.defense ?? json?.stats?.defense),
        agility:  Number(json?.agility ?? json?.stats?.agility),
        speed:    Number(json?.speed ?? json?.stats?.speed),
      };
      lastStats = s;
      lastStatsAt = Date.now();
    });

    // Capture gym results from startJob
    window.addNetListener?.(/api\.zed\.city\/startJob/i, (_url, json) => {
      const out = json?.outcome || json || {};
      const gr  = out?.gym_rewards || json?.gym_rewards;
      if (!gr || typeof gr?.skill !== 'string') return;

      const skill = String(gr.skill).toLowerCase();
      const gainTotal = Number(gr.gain);
      const iters = Math.max(1, Number(out?.iterations || 1));
      if (!Number.isFinite(gainTotal)) return;

      const fresh = (Date.now() - lastStatsAt) <= 30_000 ? lastStats : null;
      let baseStat = fresh ? Number(fresh[skill]) : null;
      const morale = fresh ? Number(fresh.morale) : null;

      const bag = readBag();

      // backfill base stat if missing using last known for that skill
      if (!Number.isFinite(baseStat)) {
        for (let i = bag.length - 1; i >= 0; i--) {
          const r = bag[i];
          if (r.skill === skill && Number.isFinite(r.base_stat)) {
            baseStat = Number(r.base_stat);
            break;
          }
        }
      }

      const rec = {
        t: Date.now(),
        skill,
        iterations: iters,
        gain_total: gainTotal,
        base_stat: Number.isFinite(baseStat) ? baseStat : null,
        morale: Number.isFinite(morale) ? morale : null
      };

      bag.push(rec);
      if (bag.length > MAX_KEEP) bag.splice(0, bag.length - MAX_KEEP);
      writeBag(bag);
    });

    // ---------- Styles & floating button (similar to Market Buy Tracker) ----------
    function ensureStyles(){
      if (document.getElementById("gym-style")) return;
      const css = document.createElement("style");
      css.id = "gym-style";
      css.textContent = `
        .gym-btn {
          position:fixed;
          right:12px;
          bottom:50%; /* stacked near Buys button */
          z-index:9999;
          padding:6px 12px;
          font-weight:600;
          font-size:12px;
          border-radius:8px;
          border:1px solid rgba(255,255,255,.15);
          background:rgba(20,20,28,.75);
          color:#fff;
          cursor:pointer;
          box-shadow:0 3px 12px rgba(0,0,0,.4);
          backdrop-filter: blur(5px);
          transition:all .15s ease;
        }
        .gym-btn:hover {
          background:rgba(32,34,44,.9);
          transform: translateY(-1px);
        }
      `;
      document.head.appendChild(css);
    }

    function ensureButton(){
      ensureStyles();
      if (document.getElementById("zed-gym-btn")) return;

      const btn = document.createElement("button");
      btn.id = "zed-gym-btn";
      btn.className = "gym-btn";
      btn.textContent = "Gym History";
      btn.title = "Show Gym History";
      btn.addEventListener("click", openGymHistoryModal);
      document.body.appendChild(btn);
    }

    // ---------- History Modal ----------
    function openGymHistoryModal(){
      const prev = document.getElementById('zed-gym-history-modal');
      if (prev) { prev.remove(); }

      const overlay = document.createElement('div');
      overlay.id = 'zed-gym-history-modal';
      overlay.style.cssText = `
        position:fixed;inset:0;z-index:10000;
        background:rgba(0,0,0,.6);
        display:flex;align-items:center;justify-content:center;
      `;
      overlay.addEventListener('click', e => { if (e.target === overlay) overlay.remove(); });

      const box = document.createElement('div');
      box.style.cssText = `
        width:min(1100px,92vw);
        height:min(78vh,800px);
        background:#15171a;
        color:#eaeaea;
        border-radius:10px;
        box-shadow:0 10px 40px rgba(0,0,0,.4);
        display:flex;
        flex-direction:column;
        border:1px solid rgba(255,255,255,.12);
      `;

      box.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 14px;border-bottom:1px solid rgba(255,255,255,.1)">
          <strong style="font-size:16px">🏋️ Gym History</strong>
          <div style="margin-left:auto;display:flex;gap:8px;align-items:center;flex-wrap:wrap">
            <label style="display:flex;gap:6px;align-items:center">
              <span>View:</span>
              <select id="zed-gym-view" style="background:#0f1113;border:1px solid #333;color:#eee;border-radius:6px;padding:4px 8px">
                <option value="sessions">Sessions</option>
                <option value="line_total">Line (Total Skill)</option>
              </select>
            </label>
            <label style="display:flex;gap:6px;align-items:center">
              <span>Skill:</span>
              <select id="zed-gym-skill" style="background:#0f1113;border:1px solid #333;color:#eee;border-radius:6px;padding:4px 8px">
                <option value="all">All</option>
                <option value="strength">Strength</option>
                <option value="defense">Defense</option>
                <option value="agility">Agility</option>
                <option value="speed">Speed</option>
              </select>
            </label>
            <button id="zed-gym-export" title="Export CSV"
              style="padding:4px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.15);background:#0f1113;color:#eee;cursor:pointer">
              Export CSV
            </button>
            <button id="zed-gym-close"
              style="padding:4px 10px;border-radius:6px;border:1px solid rgba(255,255,255,.15);background:#0f1113;color:#eee;cursor:pointer">
              Close
            </button>
          </div>
        </div>
        <div style="padding:10px;overflow:auto;flex:1">
          <div id="zed-gym-table"></div>
        </div>
      `;

      overlay.appendChild(box);
      document.body.appendChild(overlay);

      const viewSel  = box.querySelector('#zed-gym-view');
      const skillSel = box.querySelector('#zed-gym-skill');
      const closeBtn = box.querySelector('#zed-gym-close');
      const exportBtn= box.querySelector('#zed-gym-export');

      const rerender = () => renderGymHistoryTable(viewSel.value, skillSel.value);

      viewSel.addEventListener('change', rerender);
      skillSel.addEventListener('change', rerender);
      closeBtn.addEventListener('click', ()=> overlay.remove());
      exportBtn.addEventListener('click', ()=> exportGymHistoryCSV(viewSel.value, skillSel.value));

      rerender();
    }

    function renderGymHistoryTable(mode, skillFilter){
      const mount = document.getElementById('zed-gym-table');
      if (!mount) return;

      const bag = readBag().slice(); // oldest → newest
      const filtered = (skillFilter === 'all')
        ? bag
        : bag.filter(r => r.skill === skillFilter);

      // ---- View: Sessions (itemised list) ----
      if (mode === 'sessions'){
        if (!filtered.length){
          mount.innerHTML = `<div style="padding:12px;text-align:center;opacity:.8">No sessions recorded yet.</div>`;
          return;
        }

        const rows = filtered.map(r => {
          const dt = new Date(r.t);
          const ts = dt.toLocaleString();
          const gpi = gainPerIter(r);
          return `
            <tr>
              <td style="text-align:center">${ts}</td>
              <td style="text-align:center;text-transform:capitalize">${r.skill}</td>
              <td style="text-align:center">${r.iterations}</td>
              <td style="text-align:center">${(Number.isFinite(gpi)?gpi:0).toFixed(3)}</td>
              <td style="text-align:center">${r.morale ?? '—'}</td>
              <td style="text-align:center">${(r.gain_total ?? 0).toFixed(2)}</td>
            </tr>
          `;
        }).reverse().join('');

        mount.innerHTML = `
          <div style="margin-bottom:6px;opacity:.85;text-align:center">
            Itemised history of all gym trains.
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:12px">
            <thead>
              <tr style="background:#101215">
                <th style="text-align:center;padding:6px;border-bottom:1px solid #333">Time</th>
                <th style="text-align:center;padding:6px;border-bottom:1px solid #333">Skill</th>
                <th style="text-align:center;padding:6px;border-bottom:1px solid #333">Iterations</th>
                <th style="text-align:center;padding:6px;border-bottom:1px solid #333">Gain / Iteration</th>
                <th style="text-align:center;padding:6px;border-bottom:1px solid #333">Morale</th>
                <th style="text-align:center;padding:6px;border-bottom:1px solid #333">Total Gain</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        `;
        return;
      }

      // ---- View: Line (Total Skill) ----
      if (mode === 'line_total'){
        if (!filtered.length){
          mount.innerHTML = `<div style="padding:12px;text-align:center;opacity:.8">No sessions recorded yet.</div>`;
          return;
        }

        const skills = (skillFilter === 'all')
          ? ['strength','defense','agility','speed']
          : [skillFilter];

        const series = skills.map(sk => {
          const rows = bag
            .filter(r => r.skill === sk && Number.isFinite(r.base_stat))
            .map(r => ({ t:r.t, y:Number(r.base_stat) }))
            .sort((a,b) => a.t - b.t);
          return { key: sk, rows };
        });

        const allPts = series.flatMap(s => s.rows);
        if (!allPts.length){
          mount.innerHTML = `<div style="padding:12px;text-align:center;opacity:.8">No base stat data to chart yet.</div>`;
          return;
        }

        // date range: from first logged to last
        const minT = Math.min(...allPts.map(p=>p.t));
        const maxT = Math.max(...allPts.map(p=>p.t));
        const minY = Math.min(...allPts.map(p=>p.y));
        const maxY = Math.max(...allPts.map(p=>p.y));

        const W = Math.min(1000, mount.clientWidth || 1000);
        const H = 420;
        const padL=60, padR=20, padT=20, padB=50;
        const chartW = W - padL - padR;
        const chartH = H - padT - padB;

        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = H;
        canvas.style.cssText = 'width:'+W+'px;height:'+H+'px;display:block;margin:0 auto;';
        const ctx = canvas.getContext('2d');

        const xScale = t => padL + ((t - minT)/((maxT-minT)||1))*chartW;
        const yScale = y => padT + (1 - (y - minY)/((maxY-minY)||1))*chartH;

        // bg + axes
        ctx.fillStyle = '#0f1113';
        ctx.fillRect(0,0,W,H);
        ctx.strokeStyle='#333';
        ctx.lineWidth=1;
        ctx.beginPath(); ctx.moveTo(padL,H-padB); ctx.lineTo(W-padR,H-padB); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(padL,padT); ctx.lineTo(padL,H-padB); ctx.stroke();

        // labels
        ctx.fillStyle='#ddd';
        ctx.font='12px sans-serif';
        ctx.textAlign='center';
        ctx.fillText('Date', padL+chartW/2, H-18);
        ctx.save();
        ctx.translate(16, padT+chartH/2);
        ctx.rotate(-Math.PI/2);
        ctx.fillText('Total Skill', 0, 0);
        ctx.restore();

        // X ticks: dates from start → current
        ctx.fillStyle='#777';
        ctx.textAlign='center';
        for (let i=0; i<=5; i++){
          const tt = minT + (i/5)*(maxT-minT);
          const px = xScale(tt);
          const label = new Date(tt).toLocaleDateString();
          ctx.beginPath(); ctx.moveTo(px,H-padB); ctx.lineTo(px,H-padB+4); ctx.stroke();
          ctx.fillText(label, px, H-padB+16);
        }

        // Y ticks
        ctx.textAlign='right';
        for (let i=0; i<=5; i++){
          const vy = minY + (i/5)*(maxY-minY);
          const py = yScale(vy);
          ctx.beginPath(); ctx.moveTo(padL-4,py); ctx.lineTo(padL,py); ctx.stroke();
          ctx.fillText(Math.round(vy), padL-6, py+3);
        }

        const colorMap = {
          strength: '#8ab4f8',
          defense:  '#f28b82',
          agility:  '#fdd663',
          speed:    '#81c995'
        };

        // Draw series
        series.forEach(s => {
          if (!s.rows.length) return;
          ctx.strokeStyle = colorMap[s.key] || '#8ab4f8';
          ctx.lineWidth = 2;
          ctx.beginPath();
          s.rows.forEach((p,i) => {
            const px = xScale(p.t), py = yScale(p.y);
            if (i === 0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
          });
          ctx.stroke();

          ctx.fillStyle = colorMap[s.key] || '#8ab4f8';
          s.rows.forEach(p => {
            ctx.beginPath();
            ctx.arc(xScale(p.t), yScale(p.y), 2.5, 0, Math.PI*2);
            ctx.fill();
          });
        });

        // Legend
        mount.innerHTML = '';
        mount.appendChild(canvas);

        const active = series.filter(s => s.rows.length);
        if (active.length > 1){
          const legend = document.createElement('div');
          legend.style.cssText = 'text-align:center;margin-top:6px;opacity:.9;font-size:12px;';
          legend.innerHTML = active.map(s => {
            const c = colorMap[s.key] || '#8ab4f8';
            return `
              <span style="margin:0 8px">
                <span style="display:inline-block;width:10px;height:10px;background:${c};border-radius:2px;margin-right:6px;vertical-align:middle"></span>
                ${s.key}
              </span>
            `;
          }).join('');
          mount.appendChild(legend);
        }
        return;
      }

      // fallback
      mount.innerHTML = `<div style="padding:12px;text-align:center;opacity:.8">No view.</div>`;
    }

    // ---------- CSV Export ----------
    function exportGymHistoryCSV(mode, skillFilter){
      const bag = readBag().slice();
      const filtered = (skillFilter === 'all')
        ? bag
        : bag.filter(r => r.skill === skillFilter);

      let csv = 'time_iso,skill,iterations,gain_total,gain_per_iter,morale,base_stat\n';
      for (const r of filtered){
        const iso = new Date(r.t).toISOString();
        const gpi = gainPerIter(r);
        csv += [
          iso,
          r.skill,
          r.iterations ?? '',
          (r.gain_total ?? 0).toFixed(3),
          (Number.isFinite(gpi)?gpi:0).toFixed(6),
          r.morale ?? '',
          r.base_stat ?? ''
        ].join(',') + '\n';
      }

      const blob = new Blob([csv], {type:'text/csv;charset=utf-8;'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const stamp = new Date().toISOString().replace(/[:.]/g,'-');
      a.download = `zed-gym-${mode}-${skillFilter}-${stamp}.csv`;
      document.body.appendChild(a);
      a.click();
      setTimeout(()=>{ URL.revokeObjectURL(url); a.remove(); }, 500);
    }

    // ---------- Bootstrap ----------
    (function bootstrap(){
      ensureButton();

      // if DOM changes (SPA nav), re-add button if needed
      const mo = new MutationObserver(() => {
        if (!document.getElementById("zed-gym-btn")) ensureButton();
      });
      mo.observe(document.documentElement, { childList:true, subtree:true });

      // also on history nav
      const _push = history.pushState, _replace = history.replaceState;
      history.pushState = function(){
        const r = _push.apply(this, arguments);
        setTimeout(ensureButton, 50);
        return r;
      };
      history.replaceState = function(){
        const r = _replace.apply(this, arguments);
        setTimeout(ensureButton, 50);
        return r;
      };
      window.addEventListener('popstate', () => setTimeout(ensureButton, 50));
    })();

  })();

}

  // ---------- Boot toggles ----------
  if (RUN_MARKET) run_MarketFavs();
  if (RUN_PROFIT) run_ProfitHelper();
  if (RUN_NETWORTH) run_networth();
  if (RUN_TIMERS) run_Timers();
  if (RUN_EXPLORATION) run_ExplorationData();
  if (RUN_MARKETSELLING) run_marketSelling();
  if (RUN_STOREREMAININGAMOUNTS) run_storeRemainingAmounts();
  if (RUN_RADTRACKER) run_radTracker();
  if (RUN_DURABILITY) run_Durability();
  if (RUN_MARKETBUYTRACKER) run_marketBuyTracker();
  if (RUN_GYMTRACKER) run_GymTracker();




    })();
