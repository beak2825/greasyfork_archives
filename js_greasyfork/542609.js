// ==UserScript==
// @name         人力查詢時顯示員工編號EIP
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  修正 Alt 為 Title 並顯示員工編號
// @author       Shanlan
// @match        https://eip.cht.com.tw/searchEmployee*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cht.com.tw
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542609/%E4%BA%BA%E5%8A%9B%E6%9F%A5%E8%A9%A2%E6%99%82%E9%A1%AF%E7%A4%BA%E5%93%A1%E5%B7%A5%E7%B7%A8%E8%99%9FEIP.user.js
// @updateURL https://update.greasyfork.org/scripts/542609/%E4%BA%BA%E5%8A%9B%E6%9F%A5%E8%A9%A2%E6%99%82%E9%A1%AF%E7%A4%BA%E5%93%A1%E5%B7%A5%E7%B7%A8%E8%99%9FEIP.meta.js
// ==/UserScript==

(function() {
  'use strict';
  document.querySelectorAll('.search-result').forEach(result => {
    const tagElement = result.querySelector('[tagid]');
    if (!tagElement) return;
    const id = parseInt(tagElement.getAttribute('tagid'));
    const nameCell = result.querySelector('.name-cell');
    if (nameCell) nameCell.insertAdjacentHTML('afterend', `<div>員工編號: ${id}</div>`);
  });
})();
