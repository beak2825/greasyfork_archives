// ==UserScript==
// @name         Hot
// @namespace    https://github.com/sachinsenal0x64/hot.nvim
// @version      1.0
// @description  🔥 A hot reloader for the Browser.
// @author       sachinsenal0x64
// @match        *://*.localhost:8086/*
// @match        *://*.atom.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493413/Hot.user.js
// @updateURL https://update.greasyfork.org/scripts/493413/Hot.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create a meta tag for auto-refresh
    var metaTag = document.createElement('meta');
    metaTag.setAttribute('http-equiv', 'refresh');
    metaTag.setAttribute('content', '5'); // Refresh every 5 seconds

    // Find the <head> element and append the meta tag to it
    var head = document.querySelector('head');
    head.appendChild(metaTag);
})();