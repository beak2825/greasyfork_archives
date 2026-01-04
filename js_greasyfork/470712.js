// ==UserScript==
// @name         Disable Border Top Color
// @namespace    your-namespace
// @version      1.0
// @description  Disables border-top-color in the specified element
// @match        https://vanced-youtube.neocities.org/2011/*
// @run-at       document-end
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470712/Disable%20Border%20Top%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/470712/Disable%20Border%20Top%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS to disable border-top-color
    GM_addStyle('.gbtb2 { border-top-color: transparent !important; }');
})();