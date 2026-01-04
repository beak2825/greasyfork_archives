// ==UserScript==
// @name         [Neopets] New Style Inventory Button
// @namespace    https://greasyfork.org/en/scripts/445906
// @version      0.2
// @description  Adds an inventory button next to bank shortcut on new pages.
// @author       Piotr Kardovsky
// @match        http*://www.neopets.com/*
// @match        http*://neopets.com/*
// @icon         https://www.neopets.com//favicon.ico
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/445906/%5BNeopets%5D%20New%20Style%20Inventory%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/445906/%5BNeopets%5D%20New%20Style%20Inventory%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`.navsub-gft-icon__2020 {
        background: url(https://images.neopets.com/themes/h5/basic/images/alert/gift-icon.svg) center center no-repeat;
        background-size: 100% auto;
	    width: 25px;
        height: 25px;
	    margin: auto 4px auto 0;
	    float:left;
	    vertical-align:middle;
    }`);

    let m = document.querySelector('.navsub-right__2020');
    if (m) {
        let inv = document.createElement('a');
        inv.href = '/inventory.phtml';
        inv.innerHTML =`<div class="navsub-np-meter__2020" style="display: inline-block; margin-bottom: 0px;">
		<div class="navsub-gft-icon__2020"></div>
		<span class="np-text__2020">Inventory</span>
	    </div>`;
        m.prepend(inv);
    }
})();