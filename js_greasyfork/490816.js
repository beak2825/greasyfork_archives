// ==UserScript==
// @name         Kiwipost.ge parcel info
// @name:en      Kiwipost.ge parcel info
// @namespace    http://dev-exp.io/
// @version      0.6
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
// @copyright    2023, outerspace (https://openuserjs.org/users/outerspace)
// @license      MIT
// @keywords     kiwipost, georgia, parcel, freight, forwarder
// @downloadURL https://update.greasyfork.org/scripts/490816/Kiwipostge%20parcel%20info.user.js
// @updateURL https://update.greasyfork.org/scripts/490816/Kiwipostge%20parcel%20info.meta.js
// ==/UserScript==

function lerp(amt, start, end) {
  return (1 - amt) * start + amt * end
}
const debounce = (fn, delay = 100) => {
  let timer = null;
  return () => (new Promise((resolve, reject) => {
    if (timer) return;
    timer = setTimeout(() => {
      fn.apply(this, arguments);
      timer = null;
      resolve();
    }, delay);
  }));
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

  const dataMap = {};
  const getParcelInfo = async (tracking_number) => {
    let res = GM_getValue(tracking_number);
    if (res) {
      if (!res.comment) GM_deleteValue(tracking_number)
      else return res;;
    }
    try {
      GM_xmlhttpRequest({
        method: "GET",
        url: `https://api.kiwipost.ge/json/orders/single/${dataMap[tracking_number].id}`,
        headers: {
          "Content-Type": "application/json"
        },
        onload: function (response) {
          const res = JSON.parse(response.responseText);
          if (res && res.comment) {
            GM_setValue(tracking_number, res)
          }
        },
      });
    }
    catch (e) {}
  }

  const comparer = (a, b) => {

    const v1 = a.getAttribute('data-sort');
    const v2 = b.getAttribute('data-sort');
    return v1 && v2 && v1.localeCompare(v2);
  };

  const updated = debounce(() => {
    const cells = document.querySelectorAll('.tab-pane.show .table-item tr td:first-child');
    cells.forEach(c => {
      let tr = c.closest('tr');
      let tracking_number = c.getAttribute('data-tracking');
      if (!tracking_number) {
        tracking_number = c.textContent.trim();
        c.setAttribute('data-tracking', tracking_number.replace('TRACKING ID:', '').trim())
      }

      getParcelInfo(tracking_number).then((parcelInfo) => {
        if (!parcelInfo) return;
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

      });
    });
    console.log('updated');

  }, 1000);
  GM_xmlhttpRequest({
    method: "GET",
    url: "https://api.kiwipost.ge/json/all-orders",
    headers: {
      "Content-Type": "application/json"
    },
    onload: function (response) {
      const res = JSON.parse(response.responseText);
      res.forEach(r => {
        dataMap[r.tracking_number] = r;
      });

      observeDOM(document.querySelector('#app'), async function (m) {
        if (watchDOMChanges) {
          await updated();
        }
      });
      updated();

      document.addEventListener('click', () => {
        document.querySelectorAll('.table-item table tbody').forEach(table => {
          Array.from(table.querySelectorAll('tr:nth-child(n)'))
            .sort(comparer)
            .forEach(tr => table.appendChild(tr));
        });
      });
    },
  });
})();
