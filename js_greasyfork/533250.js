// ==UserScript==
// @name         Example Script
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Example userscript with valid metadata
// @author       Your Name
// @match        https://example.com/*
// @icon         https://www.google.com/s2/favicons?domain=example.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533250/Example%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/533250/Example%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Your code here
    console.log('Userscript loaded successfully!');
    
    function init() {
        alert('Page loaded - script activated!');
    }
    
    window.addEventListener('DOMContentLoaded', init);
})();