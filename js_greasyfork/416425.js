// ==UserScript==
// @name         Peach (Bot)
// @icon         https://icons.duckduckgo.com/ip2/peachplugin.com.ico
// @version      0.5.2.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Peach, oculta la publicidad.
// @author       wuniversales
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416425/Peach%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/416425/Peach%20%28Bot%29.meta.js
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
    addGlobalStyle("iframe#peachBalanceChanged, img#peachSpinningIcon, iframe.peachPostSmallClass112233{display:none;}");
})();