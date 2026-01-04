// ==UserScript==
// @name         SDB under sales history
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  SDB under sales history!
// @author       Community
// @match        *://*.grundos.cafe/market/sales/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/473081/SDB%20under%20sales%20history.user.js
// @updateURL https://update.greasyfork.org/scripts/473081/SDB%20under%20sales%20history.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll('.market_grid div.data').forEach((n, i) => {
        if ((i + 3) % 4 === 0) {
            const el = document.createElement('a');
            const img = document.createElement('img');
            img.setAttribute('src', 'https://grundoscafe.b-cdn.net/misc/sdb.gif');
            img.setAttribute('style', 'width:20px;');
            el.setAttribute('href', `/safetydeposit/?page=1&query=${encodeURIComponent(n.innerText)}&exact=1`);
            el.setAttribute('target', '_blank');
            el.appendChild(img);
            n.appendChild(el);
            n.setAttribute('style', 'display: flex;flex-flow: column nowrap;');
        }
    });
})();