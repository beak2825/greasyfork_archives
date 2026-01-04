// ==UserScript==
// @name         webshare list mark
// @namespace    http://tampermonkey.net/
// @version      0.0.1
// @description  为 webshare 代理列表添加地址备注
// @author       SCate
// @match        *://dashboard.webshare.io/proxy/list?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webshare.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529479/webshare%20list%20mark.user.js
// @updateURL https://update.greasyfork.org/scripts/529479/webshare%20list%20mark.meta.js
// ==/UserScript==

(function() {
  'use strict';
  const runner = () => {
    const addrList = document.querySelectorAll('.MuiDataGrid-cell[data-field="proxy_address"]');
    if (addrList.length) {
      Array.from(addrList).forEach(div => {
        const addr = div.innerText;
        if (div.added || !addr) return;
        const mark = window.localStorage.getItem(addr);
        const input = document.createElement('input');
        input.value = mark;
        input.style.width = '35px';
        input.style.marginRight = '8px';
        input.style.color = '#55e2bc';

        input.onblur = e => {
          const val = e.target.value;
          window.localStorage.setItem(addr, val);
        };
        const apendNode = div.firstChild.firstChild.firstChild;
        apendNode.insertBefore(input, apendNode.firstChild);
        div.added = true;
      })
    }
    setTimeout(runner, 100);
  }
  runner()
})();