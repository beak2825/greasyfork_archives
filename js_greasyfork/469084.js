// ==UserScript==
// @name         Fumen for Mobile Dark Mode
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  dark mode to prevent blindness
// @author       13pake
// @match        https://knewjade.github.io/fumen-for-mobile*
// @icon         https://knewjade.github.io/fumen-for-mobile/icons/favicon-32x32.png
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/469084/Fumen%20for%20Mobile%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/469084/Fumen%20for%20Mobile%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle("body { color: #fff; background-color: #363941; }");
    GM_addStyle(".white { background-color: #363941 !important; }");
    GM_addStyle(".btn.white, .btn-flat { color: #fff !important; border-color: #fff !important; }");
    GM_addStyle(".btn.disabled { background-color: #363941 !important; color: #999 !important; border-color: #999 !important; }");
    GM_addStyle("body > div > div > .lighten-5 { visibility: hidden !important; }");
    GM_addStyle("#text-comment, [datatest='btn-raw-fumen'] { color: #fff !important; background: rgba(0,0,0,0.2) !important;");
    GM_addStyle("#text-comment::placeholder { color: #999 !important; }");
    GM_addStyle(".modal, .modal-footer { background-color: #363941 !important; }");
    GM_addStyle(".modal a > div { color: #fff !important; }");
    GM_addStyle(".modal a > .z-depth-1:hover { background-color: rgba(0,0,0,0.2) !important; }");
    GM_addStyle("#input-fumen { color: #fff; border-color: #fff; }");

})();