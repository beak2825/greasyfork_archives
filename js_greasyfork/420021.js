// ==UserScript==
// @name         AdvProfit (Bot)
// @icon         https://icons.duckduckgo.com/ip2/advprofit.ru.ico
// @namespace    https://greasyfork.org/users/592063
// @version      0.5.2.1
// @description  ¡Bot para AdvProfit!
// @author       wuniversales
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420021/AdvProfit%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/420021/AdvProfit%20%28Bot%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function addGlobalStyle(css) {
        let head, style;
        let escape_HTML_Policy = window.trustedTypes.createPolicy("Peach_Policy", {createHTML: (to_escape) => to_escape});
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = escape_HTML_Policy.createHTML(css.replace(/;/g, ' !important;'));
        head.appendChild(style);
    }
    addGlobalStyle('a[href^="https://advprofit.ru/away/go?company_id="], div.advhelper{display:none;visibility: hidden;}');
})();