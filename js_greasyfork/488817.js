// ==UserScript==
// @name         Reddit Automatic Dark Mode
// @namespace    https://github.com/r0uv3n/
// @version      2024-03-02
// @description  Switches Reddit cark mode on and off according to System Theme (if exposed by browser).
// @author       Henry Ruben Fischer
// @match        *://*.reddit.com/*
// @icon         https://www.redditstatic.com/shreddit/assets/favicon/64x64.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488817/Reddit%20Automatic%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/488817/Reddit%20Automatic%20Dark%20Mode.meta.js
// ==/UserScript==

// jshint esversion:11
(function() {
    'use strict';
    const getPreferredTheme = () => window?.matchMedia?.('(prefers-color-scheme:dark)')?.matches ? 'dark' : 'light';
    const darkModeToggle = document.getElementsByName("darkmode-switch-name")[0];
    const getRedditTheme = () => darkModeToggle.attributes["aria-checked"] ? 'dark' : 'light';
    const applyPreferredTheme = () => {
        if (getRedditTheme() != getPreferredTheme()) {
            darkModeToggle.click();
        }
    }
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',applyPreferredTheme);
    // The above event listener is probably not applied on page load, so we do that manually once. Also we need to wait a bit since reddit seems to set the theme manually after a bit.
    setTimeout(applyPreferredTheme, 3000); //Two seconds will elapse and Code will execute.

})();