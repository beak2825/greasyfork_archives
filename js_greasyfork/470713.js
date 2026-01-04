// ==UserScript==
// @name         Disable Border Top Color 2
// @namespace    your-namespace
// @version      1.0
// @description  Disables border-top-color in the specified selector
// @match        https://vanced-youtube.neocities.org/2011/*
// @run-at       document-end
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470713/Disable%20Border%20Top%20Color%202.user.js
// @updateURL https://update.greasyfork.org/scripts/470713/Disable%20Border%20Top%20Color%202.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS to disable border-top-color
    GM_addStyle('.gbz0l .gbtb2 { border-top-color: transparent !important; }');
})();