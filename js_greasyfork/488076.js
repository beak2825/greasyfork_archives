// ==UserScript==
// @name         Gaia Avatar Inventory size increaser
// @namespace    http://tampermonkey.net/
// @version      2024-02-23
// @description  It just makes the inventory element wider and taller
// @author       Taggy
// @match        https://www.gaiaonline.com/avatar/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gaiaonline.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488076/Gaia%20Avatar%20Inventory%20size%20increaser.user.js
// @updateURL https://update.greasyfork.org/scripts/488076/Gaia%20Avatar%20Inventory%20size%20increaser.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.innerHTML = css;
        head.appendChild(style);
}
    addGlobalStyle(`
    #gaia_content #bd {
		width: 100% !important;
	}
    #grid_ad_2 {
    	visibility: collapse;
    }
    #gaia_content #center {
		width: 74%;
		margin: 0 5px 0 0;
	}
    #gaia_content #center .yui-content {
    	max-height: 500px;
    }
    `)
})();