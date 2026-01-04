// ==UserScript==
// @name         Dark Mode for dealabs.com
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds 'dark' class to the HTML tag on dealabs.com and replaces --textTranslucentPrimary variable
// @author       bNj
// @match        https://www.dealabs.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dealabs.com
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516222/Dark%20Mode%20for%20dealabscom.user.js
// @updateURL https://update.greasyfork.org/scripts/516222/Dark%20Mode%20for%20dealabscom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Set background color and replace CSS variable, then add 'dark' class immediately
    document.documentElement.style.backgroundColor = '#000';
    document.documentElement.style.setProperty('--textTranslucentPrimary', '#ddd');
    document.documentElement.classList.add('dark');
})();
