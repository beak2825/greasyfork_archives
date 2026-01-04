// ==UserScript==
// @name         TDTChannels Cleaner
// @namespace    https://greasyfork.org/users/592063
// @version      0.1.1
// @description  TDTChannels Cleaner.
// @author       wuniversales
// @match        https://tdtchannels.com/*
// @match        https://*.tdtchannels.com/*
// @icon         https://icons.duckduckgo.com/ip2/tdtchannels.com.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/441174/TDTChannels%20Cleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/441174/TDTChannels%20Cleaner.meta.js
// ==/UserScript==
 
let deleteads=true;
 
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
    addGlobalStyle("div.right-separator{display:none;}");
})();