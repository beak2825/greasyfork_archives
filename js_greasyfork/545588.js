// ==UserScript==

    // @name         Zed.City – QOL Update (Market Favs + Profit Helper/Networth + Timer Bar) - BETA TEST
    // @namespace    zed.city.aio
    // @version      1.0.1
    // @description  One Script to rule them all, and in the Zombie infested wasteland bind them.
    // @author       MathewPerry
    // @match        https://www.zed.city/*
    // @run-at       document-idle
    // @grant        GM_registerMenuCommand
    // @grant        GM_setValue
    // @grant        GM_getValue
    // @grant        GM_xmlhttpRequest
    // @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/545588/ZedCity%20%E2%80%93%20QOL%20Update%20%28Market%20Favs%20%2B%20Profit%20HelperNetworth%20%2B%20Timer%20Bar%29%20-%20BETA%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/545588/ZedCity%20%E2%80%93%20QOL%20Update%20%28Market%20Favs%20%2B%20Profit%20HelperNetworth%20%2B%20Timer%20Bar%29%20-%20BETA%20TEST.meta.js
// ==/UserScript==

    (function() {
      'use strict';

      const SETTINGS_KEY = 'zed-aio-settings';
      const DefaultSettings = {
        marketFavs: true,
        profitHelper: true,
        timerBar: true
      };
      function readSettings(){
        try {
          const raw = localStorage.getItem(SETTINGS_KEY);
          return Object.assign({}, DefaultSettings, raw ? JSON.parse(raw) : {});
        } catch(e) {
          return Object.assign({}, DefaultSettings);
        }
      }
      function writeSettings(s){
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
      }
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

        if (row.querySelector('.zed-aio-opts-btn')) return; // already mounted

        const btn = document.createElement('button');
        btn.className = 'zed-aio-opts-btn q-btn q-btn-item non-selectable no-outline q-btn--flat q-btn--round text-grey-7 q-btn--actionable q-focusable q-hoverable';
        btn.type = 'button';
        btn.setAttribute('aria-label', 'Options');
        btn.innerHTML = '<span class="q-focus-helper"></span><span class="q-btn__content text-center col items-center q-anchor--skip justify-center row"><i class="q-icon fal fa-cog" aria-hidden="true"></i></span>';
        row.insertBefore(btn, row.firstChild);

        const panel = document.createElement('div');
        panel.className = 'zed-aio-opts-panel';
        panel.style.cssText = 'position:absolute;z-index:9999;margin-top:8px;padding:10px 12px;border-radius:8px;background:rgba(20,20,20,.98);border:1px solid rgba(255,255,255,.12);box-shadow:0 6px 20px rgba(0,0,0,.35);color:#ddd;font-size:10px;display:none;left:0;transform:translateX(-4px);width:150px;';
        panel.innerHTML = [
          '<div style="font-weight:200;margin-bottom:8px">Options</div>',
          '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="marketFavs">Market Favs</label>',
          '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="profitHelper">Profit Helper/Networth</label>',
          '<label style="display:flex;gap:8px;align-items:center;margin:4px 0"><input type="checkbox" data-k="timerBar">Timer Bar</label>',
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
      const RUN_TIMERS = !!SETTINGS.timerBar;

      // ---------- Market Favs ----------
      function run_MarketFavs(){



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

        console.log("[zed-market-data] loaded v1.0.2");
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
        "armour_bench","ammo_bench","chem_bench","kitchen","furnace","weapon_bench"
      ];

      // ====== ACTION WORDS ======
      const ACTIONS = ["Craft","Salvage","Combine","Recycle","Bulk Recycle","Smelt","Forge","Burn","Purify","Create"];
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






    /* ===== Inventory Net Worth ===== */
    (() => {
      const MARKET_KEY = "Zed-market-data";
      const MARKET_CSRF_KEY = "Zed-market-csrf-token";
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
        // Try GET; fallback to POST with CSRF if allowed and provided
        try {
          const r = await fetch(url, { credentials: 'include' });
          if (!r.ok) throw new Error('GET failed');
          return await r.json();
        } catch {}
        if (!postBodyIfNoGet) return null;
        try {
          const csrf = localStorage.getItem(MARKET_CSRF_KEY) || "";
          const r = await fetch(url, {
            method: 'POST',
            credentials: 'include',
            headers: { 'content-type': 'application/json', ...(csrf ? { 'X-CSRF-Token': csrf } : {}) },
            body: JSON.stringify({})
          });
          if (!r.ok) throw new Error('POST failed');
          return await r.json();
        } catch { return null; }
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
            ${tileHTML('furnace')}
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

        // Hide new tiles until we confirm ownership
        setTileVisible('mine_iron', false);
        setTileVisible('mine_coal', false);

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
            grid-auto-flow: column;
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

          /* default single timer pill */
          .zed-time {
            margin-top: 0px;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: 600;
            color: #fff;
            background: rgba(255,255,255,0.08);
            border-radius: 8px;
            min-width: 44px;
            text-align: center;
            letter-spacing: 0.2px;
          }
          .zed-time.alert { color: #ff4d4f; background: rgba(255,77,79,0.12); }

          /* Furnace: vertical list of linked pills */
          .zed-tile[data-key="furnace"] .zed-time {
            display: flex;
            flex-direction: column;
            gap: 4px;
            background: transparent;
            padding: 0;
          }
          .zed-tile[data-key="furnace"] .zed-subtime {
            display: block;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: 600;
            color: #fff;
            background: rgba(255,255,255,0.08);
            border-radius: 6px;
            min-width: 52px;
            text-align: center;
            text-decoration: none;
          }
          .zed-tile[data-key="furnace"] .zed-subtime.alert {
            color: #ff4d4f;
            background: rgba(255,77,79,0.12);
          }

          @media (max-width: 600px) {
            .zed-icon { font-size: 10x; }
            .zed-time { font-size: 10px; min-width: 44px; }
            .zed-tile[data-key="furnace"] .zed-subtime { font-size: 10px; min-width: 44px; }
          }
        `;
        document.head.appendChild(style);
      }

      /** Formatting helpers **/
      function fmt(seconds) {
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
        if (seconds <= TEN_MIN) el.classList.add('alert'); // include 0
        else el.classList.remove('alert');
      }

      // Show/hide a tile by key
      function setTileVisible(key, visible) {
        const el = document.querySelector(`.zed-tile[data-key="${key}"]`);
        if (!el) return;
        el.classList.toggle('hidden', !visible);
      }

      /** XHR interception to learn about Radio/Junk timers as you browse **/
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

              // Junk store: response.limits.reset_time
              if (url.includes('store_id') && url.includes('junk')) {
                const reset = res?.limits?.reset_time; // seconds
                if (reset) {
                  const until = Date.now() + reset * 1000;
                  const s = saved();
                  s.junk = { until, href: '/store/junk' };
                  save(s);
                }
              }

              // Radio tower: response.expire (seconds)
              if (url.includes('getRadioTower')) {
                const expire = res?.expire;
                if (expire) {
                  const until = Date.now() + expire * 1000;
                  const s = saved();
                  s.radio = { until, href: '/stronghold' }; // id unknown here; link list
                  save(s);
                }
              }
            } catch { /* ignore */ }
          });
          return sendOrig.apply(this, arguments);
        };
      })();

      /** Stronghold cache helpers (for travel mode) **/
      function writeStrongholdCache(entries) {
        // entries: [{ id, until }]
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
          const list = (data.furnaces || []).map(f => ({
            id: f.id,
            seconds: Math.max(0, Math.floor((f.until - now) / 1000)),
          }));
          return list;
        } catch {
          return null;
        }
      }

      /** Stats polling (Energy, Rads, XP, Raid) **/
      async function refreshStats() {
        const data = await fetchJSON(API.stats);
        if (!data) return;

        const energyMax = data?.membership ? 150 : (data?.stats?.max_energy || 100);
        const energyMissing = Math.max(0, energyMax - (data?.energy ?? 0));
        const tickSeconds = data?.energy_tick ?? (data?.membership ? 600 : 900);
        const toNextEnergy = Math.max(0, data?.energy_regen ?? 0);
        const ticksNeeded = energyMissing > 0 ? Math.ceil(energyMissing / 5) : 0;
        const energySeconds = ticksNeeded > 0 ? toNextEnergy + (ticksNeeded - 1) * tickSeconds : 0;
        setTile('energy', '/stronghold', energySeconds); // original route

        // RADS — total time until full; members get +20 max
        const radBaseMax = (data?.stats?.max_rad ?? 60);
        const radMax = radBaseMax + (data?.membership ? 20 : 0);
        const radMissing = Math.max(0, radMax - (data?.rad ?? 0));
        const baseTick = 300; // 5 minutes per +1 rad
        const toNext = Math.max(0, data?.rad_regen || 0); // seconds remaining to next +1
        const radSeconds = radMissing > 0 ? Math.max(0, (radMissing - 1) * baseTick) + toNext : 0;
        setTile('rads', '/scavenge', radSeconds); // original route

        // XP — just a number
        const xpToGo = Math.max(0, Math.round((data?.xp_end || 0)) - Math.round((data?.experience || 0)));
        setTile('xp', '/profile', null, xpToGo.toLocaleString()); // original route

        // Raid cooldown
        const raid = Math.max(0, data?.raid_cooldown ?? 0);
        setTile('raid', '/raids', raid); // original route
      }

      /** Stronghold polling (Furnaces + Auto Mines) **/
      async function refreshStronghold() {
        const tile = document.querySelector('.zed-tile[data-key="furnace"]');
        const timeEl = tile?.querySelector('.zed-time');
        if (!tile || !timeEl) return;

        // helper to render a list of {id, seconds}
        function renderFurnaces(list) {
          const rows = list
            .slice()
            .sort((a, b) => (a.id || 0) - (b.id || 0))
            .map(({ id, seconds }) => {
              const alert = (seconds <= TEN_MIN) ? 'alert' : '';
              return `<a href="/stronghold/${id}" class="zed-subtime ${alert}" data-seconds="${seconds}">${fmt(seconds)}</a>`;
            });
          timeEl.innerHTML = rows.join('') || `<span class="zed-subtime" data-seconds="0">${fmt(0)}</span>`;
        }

        // try live API first
        const data = await fetchJSON(API.stronghold);
        if (data && data.stronghold) {
          const now = Date.now();
          const buildings = Object.values(data.stronghold) || [];
          const furnacesRaw = buildings.filter(b => b?.codename === 'furnace');

          const computed = furnacesRaw.map((f) => {
            let seconds = 0;
            const bpWait = f?.items?.['item_requirement-bp']?.vars?.wait_time; // seconds per craft
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

          // cache for travel mode
          writeStrongholdCache(computed.map(({ id, until }) => ({ id, until })));

          // --- NEW: Auto Mines (show only if owned) ---
          const ironMine = buildings.find(b => b?.codename === 'iron_automine');
          if (ironMine) {
            const secsIron = Math.max(0,
              typeof ironMine?.timeLeft === 'number' ? ironMine.timeLeft : (ironMine?.wait || 0)
            );
            setTile('mine_iron', ironMine?.id ? `/stronghold/${ironMine.id}` : '#', secsIron);
            setTileVisible('mine_iron', true);
          } else {
            setTileVisible('mine_iron', false);
          }

          const coalMine = buildings.find(b => b?.codename === 'coal_automine');
          if (coalMine) {
            const secsCoal = Math.max(0,
              typeof coalMine?.timeLeft === 'number' ? coalMine.timeLeft : (coalMine?.wait || 0)
            );
            setTile('mine_coal', coalMine?.id ? `/stronghold/${coalMine.id}` : '#', secsCoal);
            setTileVisible('mine_coal', true);
          } else {
            setTileVisible('mine_coal', false);
          }

          // render furnaces
          renderFurnaces(computed.map(({ id, seconds }) => ({ id, seconds })));
          return;
        }

        // fall back to cache (traveling/offline)
        const cached = readStrongholdCache();
        if (cached && cached.length) {
          renderFurnaces(cached);
        }
      }

      /** Tile setters **/
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

      /** Apply saved (Radio/Junk) timers under their icons **/
      function refreshSavedTimers() {
        const now = Date.now();
        const s = saved();

        // Junk
        if (s.junk) {
          const secs = Math.max(0, Math.floor((s.junk.until - now) / 1000));
          setTile('junk', s.junk.href || '/store/junk', secs);
        }

        // Radio
        if (s.radio) {
          const secs = Math.max(0, Math.floor((s.radio.until - now) / 1000));
          setTile('radio', s.radio.href || '/stronghold', secs);
        }
      }

      /** Tick: decrement every second for smooth countdowns **/
      function tick() {
        // Decrement ANY element inside the bar that has data-seconds
        document.querySelectorAll('#zed-timerbar [data-seconds]').forEach(el => {
          const s = parseInt(el.dataset.seconds || '-1', 10);
          if (isNaN(s) || s < 0) return; // labels or finished
          const next = Math.max(0, s - 1);
          el.dataset.seconds = String(next);
          el.textContent = fmt(next);
          applyAlertClass(el, next);
        });
      }

      /** Boot **/
      function startIntervals() {
        if (__zed_started) return;
        __zed_started = true;

        // initial pulls
        refreshStats();
        refreshStronghold();
        refreshSavedTimers();

        // singletons
        setIntervalSafe('stats', refreshStats, POLL_STATS_EVERY);
        setIntervalSafe('stronghold', refreshStronghold, POLL_STRONGHOLD_EVERY);
        setIntervalSafe('saved', refreshSavedTimers, 5 * 1000);
        setIntervalSafe('tick', tick, 1000);
      }

      function boot() {
        if (ensureBar()) { startIntervals(); return; }

        // SPA observer to catch late toolbar mounting
        const obs = new MutationObserver(() => {
          if (ensureBar()) {
            obs.disconnect();
            startIntervals();
          }
        });
        obs.observe(document.documentElement, { childList: true, subtree: true });

        // safety timeout: stop watching after 20s and try retries
        setTimeout(() => {
          obs.disconnect();
          (function retryUntilReady(tries = 40) {
            if (ensureBar()) {
              startIntervals();
            } else if (tries > 0) {
              setTimeout(() => retryUntilReady(tries - 1), 500);
            }
          })();
        }, 20000);
      }

      boot();
    })();

      }

      // Run selected modules
      try { if (RUN_MARKET) run_MarketFavs(); } catch(e){ console.error('[AIO] MarketFavs error:', e); }
      try { if (RUN_PROFIT) run_ProfitHelper(); } catch(e){ console.error('[AIO] ProfitHelper error:', e); }
      try { if (RUN_TIMERS) run_Timers(); } catch(e){ console.error('[AIO] Timers error:', e); }

    })();
