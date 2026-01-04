// ==UserScript==
// @name         Surfe.be (Bot)
// @icon         https://icons.duckduckgo.com/ip2/surfe.be.ico
// @version      0.5.2.3
// @namespace    https://greasyfork.org/users/592063
// @description  Script automatizado para Surfe.be, oculta la publicidad.
// @author       wuniversales
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414996/Surfebe%20%28Bot%29.user.js
// @updateURL https://update.greasyfork.org/scripts/414996/Surfebe%20%28Bot%29.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function addGlobalStyle(css) {
        let head, style;
        let escape_HTML_Policy = window.trustedTypes.createPolicy("Surfe_Policy", {createHTML: (to_escape) => to_escape});
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = escape_HTML_Policy.createHTML(css.replace(/;/g, ' !important;'));
        head.appendChild(style);
    }
    addGlobalStyle("div#justroll,div#justroll-adv{display:none;}");
})();