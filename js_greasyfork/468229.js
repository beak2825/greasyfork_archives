// ==UserScript==
// @name         Simple Efilm
// @icon         https://icons.duckduckgo.com/ip2/efilm.online.ico
// @version      0.1
// @namespace    https://greasyfork.org/users/592063
// @description  Script simple para Efilm.
// @author       wuniversales
// @include      *efilm.online/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468229/Simple%20Efilm.user.js
// @updateURL https://update.greasyfork.org/scripts/468229/Simple%20Efilm.meta.js
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
    addGlobalStyle("div.jw-captions.jw-captions-enabled{display:none;}");
})();