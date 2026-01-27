// ==UserScript==
// @name         Kiwipost.ge parcel info
// @name:en      Kiwipost.ge parcel info
// @namespace    http://dev-exp.io/
// @version      0.7
// @description  Display the comment, price and the website info for each parcel on the dashboard
// @author       outerspace
// @match        https://kiwipost.ge/dashboard*
// @match        https://dashboard.kiwipost.ge/*
// @match        https://api.kiwipost.ge/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      api.kiwipost.ge
// @connect      kiwipost.ge
// @connect      *
// @sandbox      JavaScript
// @copyright    2023, outerspace (https://openuserjs.org/users/outerspace)
// @license      MIT
// @keywords     kiwipost, georgia, parcel, freight, forwarder
// @downloadURL https://update.greasyfork.org/scripts/490816/Kiwipostge%20parcel%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/490816/Kiwipostge%20parcel%20info.meta.js
// ==/UserScript==
//
// OPTIMIZATIONS (v0.7):
// - Skips "Collected" tab (567 items - too large)
// - Limits processing to max 50 items per tab
// - Uses data-processed attribute to avoid reprocessing
// - Smarter DOM observer (only childList, not all attribute changes)
// - Explicit tab click detection for reliable updates
// - Better debouncing with watchDOMChanges flag
// - Improved performance and reliability

function lerp(amt, start, end) {
  return (1 - amt) * start + amt * end
}
const debounce = (fn, delay = 100) => {
  let timer = null;
  return function() {
    const args = arguments;
    const context = this;
    return new Promise((resolve, reject) => {
      if (timer) return;
      timer = setTimeout(() => {
        fn.apply(context, args);
        timer = null;
        resolve();
      }, delay);
    });
  };
};
let ranOnce = false;
const once = (fn) => {
  if (!ranOnce) fn();
  ranOnce = true;
};
const cyrb53 = (str, seed = 0) => {
  let h1 = 0xdeadbeef ^ seed,
    h2 = 0x41c6ce57 ^ seed;
  for (let i = 0, ch; i < str.length; i++) {
    ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
  h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
  h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

  return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent;
let watchDOMChanges = true;

function groupColor(number) {
  number = (number % 0xFFFFFF / 0xFFFFFF)
  var h = ~~lerp(number, 0, 360);
  var s = 80; //~~lerp(number, 42, 98);
  var l = 95; //~~lerp(number, 40, 90);
  return `hsl(${h},${s}%,${l}%)`;
};

const observeDOM = (function () {
  const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;

  return function (obj, callback) {
    if (!obj || obj.nodeType !== 1) return;

    if (MutationObserver) {
      // define a new observer
      const mutationObserver = new MutationObserver(callback)

      // have the observer observe for changes in children
      mutationObserver.observe(obj, {
        childList: true,
        subtree: true,
        attributes: true,
        characterData: true
      })
      return mutationObserver
    }

    // browser support fallback
    else if (window.addEventListener) {
      obj.addEventListener('DOMNodeInserted', callback, false)
      obj.addEventListener('DOMNodeRemoved', callback, false)
    }
  }
})();

(function () {
  'use strict';

  console.log('Kiwipost parcel info script loaded (v0.7 optimized)');
  console.log('Current URL:', window.location.href);
  console.log('GM_xmlhttpRequest available:', typeof GM_xmlhttpRequest);

  const dataMap = {};
  const getParcelInfo = async (tracking_number) => {
    console.log('[getParcelInfo] Called for:', tracking_number);

    let res = GM_getValue(tracking_number);
    if (res) {
      console.log('[getParcelInfo] Found in cache:', tracking_number);
      if (!res.comment) {
        console.log('[getParcelInfo] Cached item has no comment, deleting');
        GM_deleteValue(tracking_number);
      }
      else return res;
    }

    // Return a Promise that resolves with the parcel info
    return new Promise((resolve, reject) => {
      try {
        if (!dataMap[tracking_number] || !dataMap[tracking_number].id) {
          console.warn('[getParcelInfo] No dataMap entry for:', tracking_number);
          resolve(null);
          return;
        }

        console.log('[getParcelInfo] Fetching from API for:', tracking_number);

        GM_xmlhttpRequest({
          method: "GET",
          url: `https://api.kiwipost.ge/json/orders/single/${dataMap[tracking_number].id}`,
          headers: {
            "Content-Type": "application/json"
          },
          onload: function (response) {
            const res = JSON.parse(response.responseText);
            if (res && res.comment) {
              GM_setValue(tracking_number, res);
              resolve(res);
            } else {
              resolve(null);
            }
          },
          onerror: function(error) {
            console.error('getParcelInfo API error:', error);
            resolve(null);
          }
        });
      }
      catch (e) {
        console.error('getParcelInfo error:', e);
        resolve(null);
      }
    });
  }

  const comparer = (a, b) => {

    const v1 = a.getAttribute('data-sort');
    const v2 = b.getAttribute('data-sort');
    return v1 && v2 && v1.localeCompare(v2);
  };

  const updated = debounce(() => {
    console.log('[UPDATE] Running updated function...');
    console.log('[UPDATE] Time:', new Date().toISOString());

    // Temporarily disable watching to prevent loop
    watchDOMChanges = false;

    // Check if we're on the "Collected" tab - if so, skip processing
    const collectedTab = document.querySelector('[role="tab"][aria-selected="true"]');
    if (collectedTab) {
      console.log('[UPDATE] Active tab:', collectedTab.textContent);
    }

    if (collectedTab && collectedTab.textContent.toLowerCase().includes('collected')) {
      console.log('[UPDATE] Skipping Collected tab - too many items');
      watchDOMChanges = true;
      return;
    }

    const cells = document.querySelectorAll('.tab-pane.show .table-item tr td:first-child');
    console.log('[UPDATE] Found cells:', cells.length);
    console.log('[UPDATE] dataMap has', Object.keys(dataMap).length, 'entries');

    // Limit processing to reasonable number of items
    if (cells.length > 50) {
      console.warn(`Too many cells (${cells.length}), limiting to first 50`);
    }

    const cellsToProcess = Array.from(cells).slice(0, 50);
    let processedCount = 0;

    cellsToProcess.forEach(c => {
      let tr = c.closest('tr');
      let tracking_number = c.getAttribute('data-tracking');
      if (!tracking_number) {
        tracking_number = c.textContent.trim().replace('TRACKING ID:', '').trim();
        c.setAttribute('data-tracking', tracking_number);
      }

      // Skip if already processed
      if (c.getAttribute('data-processed') === 'true') {
        return;
      }

      processedCount++;

      getParcelInfo(tracking_number).then((parcelInfo) => {
        if (!parcelInfo) {
          c.setAttribute('data-processed', 'true');
          return;
        }
        let color = "";
        if (dataMap[tracking_number]) {
          const flight = dataMap[tracking_number].transfer.number;
          const arrive = dataMap[tracking_number].transfer.arrive;
          color = groupColor(cyrb53(`${parcelInfo.obtain_webstore}-${flight}-${arrive}`));
          c.closest('tr').setAttribute('style', `background-color: ${color};`);

          const isoDate = arrive.split('.').reverse().join('.');
          const sortString = `${isoDate}-${flight}-${parcelInfo.obtain_webstore}`;
          tr.setAttribute('data-sort', sortString);
        }
        c.innerHTML = `${tracking_number}<br/>
                <span style="font-size: 12px; line-height: 13px;color: gray;font-weight: normal; font-family: helv;">${parcelInfo.comment}<br/>
                 ${parcelInfo.obtain_webstore} ${parcelInfo.obtain_cost}${parcelInfo.obtain_currency}</span>
                `;

        c.setAttribute('data-processed', 'true');
      });
    });

    console.log(`[UPDATE] Finished - processed ${processedCount} new items`);
    console.log('[UPDATE] Re-enabling DOM watching in 2 seconds...');

    // Re-enable watching after a short delay
    setTimeout(() => {
      watchDOMChanges = true;
      console.log('[UPDATE] DOM watching re-enabled');
    }, 2000);
  }, 1000);

  console.log('[API] Attempting to fetch all orders...');
  console.log('[API] Time:', new Date().toISOString());

  GM_xmlhttpRequest({
    method: "GET",
    url: "https://api.kiwipost.ge/json/all-orders",
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": "en-US,en;q=0.5",
      "Access-Control-Request-Headers": "lang,x-requested-with,x-xsrf-token",
      "Access-Control-Request-Method": "GET",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors ",
      "Sec-Fetch-Site": "same-site"
    },
    onload: function (response) {
      console.log('[API] Request successful!');
      console.log('[API] Response status:', response.status);
      console.log('[API] Response length:', response.responseText?.length);

      const res = JSON.parse(response.responseText);
      console.log('[API] Parsed orders count:', res.length);

      res.forEach(r => {
        dataMap[r.tracking_number] = r;
      });

      console.log('[API] dataMap populated with', Object.keys(dataMap).length, 'orders');

      const appElement = document.querySelector('#app');
      if (appElement) {
        console.log('Found #app element, setting up observer');

        // More efficient observer - only watch for childList changes, not all attributes
        const observer = new MutationObserver((mutations) => {
          if (!watchDOMChanges) return;

          // Check if any mutation actually affects the table
          const hasRelevantChange = mutations.some(m => {
            return m.type === 'childList' &&
                   (m.target.classList?.contains('table-item') ||
                    m.target.classList?.contains('tab-pane') ||
                    m.target.closest?.('.table-item'));
          });

          if (hasRelevantChange) {
            updated();
          }
        });

        observer.observe(appElement, {
          childList: true,
          subtree: true
        });
      } else {
        console.error('Could not find #app element');
      }

      updated();

      console.log('[API] Setup complete - observer and event listeners installed');

      // Listen for tab clicks to trigger updates and sorting
      document.addEventListener('click', (e) => {
        const isTabClick = e.target.closest('[role="tab"]');
        const isHeaderClick = e.target.closest('th');

        if (isTabClick) {
          console.log('Tab clicked, triggering update...');
          // Give the UI time to switch tabs, then update
          setTimeout(() => {
            updated();
            // Also sort after update
            setTimeout(() => {
              document.querySelectorAll('.tab-pane.show .table-item table tbody').forEach(table => {
                const rows = Array.from(table.querySelectorAll('tr:nth-child(n)'));
                if (rows.length > 0 && rows[0].hasAttribute('data-sort')) {
                  rows.sort(comparer).forEach(tr => table.appendChild(tr));
                }
              });
            }, 500);
          }, 200);
        } else if (isHeaderClick) {
          // Just sort when clicking headers
          setTimeout(() => {
            document.querySelectorAll('.tab-pane.show .table-item table tbody').forEach(table => {
              const rows = Array.from(table.querySelectorAll('tr:nth-child(n)'));
              if (rows.length > 0 && rows[0].hasAttribute('data-sort')) {
                rows.sort(comparer).forEach(tr => table.appendChild(tr));
              }
            });
          }, 100);
        }
      });
    },
    onerror: function(error) {
      console.error('[API] Request FAILED!');
      console.error('[API] Error object:', error);
      console.error('[API] Error type:', typeof error);
      console.error('[API] Error details:', JSON.stringify(error, null, 2));
      console.error('[API] This usually means Tampermonkey blocked the request');
      console.error('[API] Recommendation: Use Violentmonkey instead, or paste code directly in console');
    },
    ontimeout: function() {
      console.error('[API] Request TIMEOUT!');
    },
    onabort: function() {
      console.error('[API] Request ABORTED!');
    }
  });

  console.log('[API] GM_xmlhttpRequest call made, waiting for response...');
})();
