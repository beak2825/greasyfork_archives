// ==UserScript==
// @name         hidden_no_need
// @namespace    https://mesak.tw
// @version      0.1
// @description  hidden uq sale
// @author       You
// @match        https://uq.goodjack.tw/lists/sale
// @icon         https://www.google.com/s2/favicons?sz=64&domain=goodjack.tw
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467784/hidden_no_need.user.js
// @updateURL https://update.greasyfork.org/scripts/467784/hidden_no_need.meta.js
// ==/UserScript==
GM_addStyle(`
.card:has(.hide) {
    display: none !important;
}
`);
(function() {
    'use strict';
    [...document.querySelectorAll('span')].filter(ele=>!ele.textContent.indexOf('已售罄')).forEach( node => node.classList.add('hide') );

    [...document.querySelectorAll('h2')].forEach( (node) => {
        let putNode = document.createElement("div");
        putNode.innerHTML = `
<span class="ts horizontal basic label">售完</span>
<span class="ts negative horizontal basic label">UNIQLO</span>
<span class="ts info horizontal basic label">GU</span>
`
        node.append(putNode)
    })
})();