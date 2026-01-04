// ==UserScript==
// @name         Wikipedia Content Max Width
// @description  Limit Wikipedia main content width to 1024px.
// @match        *://*.wikipedia.org/*
// @version      0.1
// @namespace https://greasyfork.org/users/658805
// @downloadURL https://update.greasyfork.org/scripts/406165/Wikipedia%20Content%20Max%20Width.user.js
// @updateURL https://update.greasyfork.org/scripts/406165/Wikipedia%20Content%20Max%20Width.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var node = document.createElement('style');
    node.innerHTML = '@media screen and (min-width: 1280px) { #mw-head { max-width: calc(1024px + 160px + 82px) !important; right: auto !important; left: calc((100vw - (1024px + 160px + 16px * 6)) / 2) !important; } #content { max-width: 1024px !important; border-right-width: 1px !important; margin-left: calc((100vw - (1024px + 160px + 16px * 6)) / 2 + 160px + 16px) !important; } #mw-panel { left: calc((100vw - (1024px + 160px + 16px * 6)) / 2) !important; } }';
    document.head.appendChild(node);
})();
