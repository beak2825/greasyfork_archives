// ==UserScript==
// @name         Revert to Old Roblox Font
// @namespace    https://tampermonkey.net
// @version      1.21
// @description  Change the font on Roblox Website back to the old font (Gotham) Based off verticalfx's userscript just slightly better.
// @author       void1z
// @match        *://*.roblox.com/*
// @grant        none
// @license MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/492966/Revert%20to%20Old%20Roblox%20Font.user.js
// @updateURL https://update.greasyfork.org/scripts/492966/Revert%20to%20Old%20Roblox%20Font.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function applyCustomFont() {
        var customFont = 'HCo Gotham SSm';
        var css = '* { font-family: "' + customFont + '" !important; }';
        var head = document.head || document.getElementsByTagName('head')[0];
        var style = document.createElement('style');

        head.appendChild(style);
        style.type = 'text/css';

        if (style.styleSheet) {
            style.styleSheet.cssText = css;
        } else {
            style.appendChild(document.createTextNode(css));
        }
    }

    // Wait bro.
    setTimeout(applyCustomFont, 100);
})();
