// ==UserScript==
// @name        Omins Invoice ➜ Monday.com (stable)
// @namespace   http://tampermonkey.net/
// @version     1.10
// @description Create a Monday item from an Omins invoice page—single click, no page reload races
// @author      Gemini & WillH
// @match       https://omins.snipesoft.net.nz/ominst/modules/omins/invoices_addedit.php?tableid=1041&id=*
// @match       https://omins.snipesoft.net.nz/modules/omins/invoices_addedit.php*
// @icon        https://www.google.com/s2/favicons?sz=64&domain=net.nz
// @grant       GM_xmlhttpRequest
// @connect     api.monday.com
// @downloadURL https://update.greasyfork.org/scripts/489678/Omins%20Invoice%20%E2%9E%9C%20Mondaycom%20%28stable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489678/Omins%20Invoice%20%E2%9E%9C%20Mondaycom%20%28stable%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // ==== CONFIG ====
  const MONDAY_BOARD_ID = 7986107981;
  const MONDAY_API_URL = 'https://api.monday.com/v2';
  const MONDAY_API_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJ0aWQiOjMyMDQ1MjE0MSwiYWFpIjoxMSwidWlkIjo1MjQwNDc3MSwiaWFkIjoiMjAyNC0wMi0xM1QwNjoyMDo1MS4wMDBaIiwicGVyIjoibWU6d3JpdGUiLCJhY3RpZCI6MjI4MjYxLCJyZ24iOiJ1c2UxIn0.nmNyxqkHoTQLCgeM4X-cR7dWcWrlX0NCTPt7OmTZTk0'; // ⚠️ Do NOT commit a real token in public. Prefer a server proxy if possible.
  const USE_GM_REQUEST = true; // true = use GM_xmlhttpRequest (bypasses page CSP/CORS), false = use window.fetch

  // ==== UTILITIES ====
  function waitFor(selector, timeoutMs = 15000) {
    return new Promise((resolve, reject) => {
      const immediate = document.querySelector(selector);
      if (immediate) return resolve(immediate);

      const obs = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          obs.disconnect();
          resolve(el);
        }
      });
      obs.observe(document.documentElement, { childList: true, subtree: true });

      setTimeout(() => {
        obs.disconnect();
        reject(new Error(`Timeout waiting for ${selector}`));
      }, timeoutMs);
    });
  }

  function buildItemName() {
    const getVal = (sel) => (document.querySelector(sel) || {}).value || '';
    const id = getVal('#id') || getVal('[name="id"]');
    const company = getVal('#company') || getVal('[name="company"]');
    const name = getVal('#name') || getVal('[name="name"]');

    const who = (company || name || '').trim();
    const num = (id || '').trim();
    const base = [num, who].filter(Boolean).join(' - ');
    return base || 'Omins Invoice';
  }

  function toast(msg, ok = true, ms = 3000) {
    const t = document.createElement('div');
    t.textContent = msg;
    t.style.position = 'fixed';
    t.style.right = '16px';
    t.style.bottom = '16px';
    t.style.padding = '10px 14px';
    t.style.borderRadius = '8px';
    t.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
    t.style.fontFamily = 'system-ui, sans-serif';
    t.style.fontSize = '13px';
    t.style.zIndex = 999999;
    t.style.background = ok ? '#e6ffed' : '#ffecec';
    t.style.color = ok ? '#046c4e' : '#8a1f1f';
    t.style.border = `1px solid ${ok ? '#b7f5c8' : '#ffc9c9'}`;
    document.body.appendChild(t);
    setTimeout(() => t.remove(), ms);
  }

  function gqlCreateItemQuery(itemName) {
    // Safely JSON-quote the itemName for GraphQL string literal
    const safe = JSON.stringify(itemName);
    return {
      query: `mutation { create_item(board_id: ${MONDAY_BOARD_ID}, item_name: ${safe}) { id } }`
    };
  }

  async function createMondayItem(itemName) {
    const payload = JSON.stringify(gqlCreateItemQuery(itemName));

    if (USE_GM_REQUEST) {
      return new Promise((resolve, reject) => {
        GM_xmlhttpRequest({
          method: 'POST',
          url: MONDAY_API_URL,
          headers: {
            'Authorization': MONDAY_API_TOKEN,
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          data: payload,
          onload: (res) => {
            try {
              const json = JSON.parse(res.responseText || '{}');
              if (res.status >= 200 && res.status < 300) {
                resolve(json);
              } else {
                reject(new Error(`HTTP ${res.status}: ${res.responseText}`));
              }
            } catch (e) {
              reject(e);
            }
          },
          onerror: (err) => reject(err),
          ontimeout: () => reject(new Error('Request timed out'))
        });
      });
    } else {
      const res = await fetch(MONDAY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': MONDAY_API_TOKEN,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: payload
      });
      const json = await res.json();
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${JSON.stringify(json)}`);
      return json;
    }
  }

  // ==== MAIN ====
  (async () => {
    let topButtons;
    try {
      topButtons = await waitFor('#topButtons');
    } catch (e) {
      console.warn('[Omins➜Monday] #topButtons not found, rendering button near body start');
      topButtons = document.body;
    }

    // Container
    const container = document.createElement('div');
    container.className = 'monday-button-container';
    container.style.margin = '6px 0';

    // Button (NOT submit)
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = 'Create Monday Item';
    btn.classList.add('Buttons');
    btn.style.width = '100%';

    container.appendChild(btn);
    topButtons.insertBefore(container, topButtons.firstChild);

    // Click handler with in-flight guard
    let busy = false;

    btn.addEventListener('click', async (ev) => {
      ev.preventDefault();
      if (busy) return;
      busy = true;
      btn.disabled = true;
      btn.textContent = 'Creating…';

      try {
        const itemName = buildItemName();
        const result = await createMondayItem(itemName);
        const id = result?.data?.create_item?.id;
        if (id) {
          toast(`Created Monday item #${id}`, true);
          console.log('[Omins➜Monday] Success:', result);
        } else {
          console.warn('[Omins➜Monday] Unexpected response:', result);
          toast('Created? Check console for details.', true);
        }
      } catch (err) {
        console.error('[Omins➜Monday] Error:', err);
        toast(`Failed to create item: ${String(err.message || err)}`, false, 5000);
      } finally {
        busy = false;
        btn.disabled = false;
        btn.textContent = 'Create Monday Item';
      }
    });
  })();
})();
