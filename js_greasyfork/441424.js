// ==UserScript==
// @name         5 Billion Sales (Bot)
// @icon         https://icons.duckduckgo.com/ip2/5billionsales.com.ico
// @version      0.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para 5 Billion Sales, oculta la publicidad.
// @author       wuniversales
// @include      *
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441424/5%20Billion%20Sales%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/441424/5%20Billion%20Sales%20%28Bot%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function addGlobalStyle(css) {
        let head, style;
        let escape_HTML_Policy = window.trustedTypes.createPolicy("5_billion_sales_Policy", {createHTML: (to_escape) => to_escape});
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = escape_HTML_Policy.createHTML(css.replace(/;/g, ' !important;'));
        head.appendChild(style);
    }
    addGlobalStyle("div#gVmKxysM2S784a4WXwFivx2nHUb23cefReDWIByJJ5TpAXdNKBevqobCCT0btvBVOHQvMNtAVcyvTzpTKwEtghzFggn0EYHjQ6C6{display:none;}");
})();