// ==UserScript==
// @name         Swisscows (No-ads)
// @namespace    https://greasyfork.org/users/592063
// @icon         https://icons.duckduckgo.com/ip2/swisscows.com.ico
// @version      0.1.1
// @description  Hide ads from Swisscows.
// @author       wuniversales
// @match        http*://swisscows.com/*
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422438/Swisscows%20%28No-ads%29.user.js
// @updateURL https://update.greasyfork.org/scripts/422438/Swisscows%20%28No-ads%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css.replace(/;/g, ' !important;');
        head.appendChild(style);
    }
    addGlobalStyle("article.sales,div.banners-wrap{display:none;}");
})();