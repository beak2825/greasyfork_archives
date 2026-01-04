// ==UserScript==
// @name         dcinside Automatic Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Switches dcinside dark mode on and off according to System Theme (if exposed by browser).
// @author       Orthon Jiang
// @match        *://*.dcinside.com/*
// @icon         https://gall.dcinside.com/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/518941/dcinside%20Automatic%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/518941/dcinside%20Automatic%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const getPreferredTheme = () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'light';
    const getDcinsideTheme = () => document.getElementById("css-darkmode") ? 'dark' : 'light';
    const applyPreferredTheme = () => {
        if (getDcinsideTheme() != getPreferredTheme()) {
            darkmode();
        }
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyPreferredTheme);
    // The above event listener is probably not applied on page load, so we do that manually once. Also we need to wait a bit since reddit seems to set the theme manually after a bit.
    setTimeout(applyPreferredTheme, 2000); //Two seconds will elapse and Code will execute.

})();