// ==UserScript==
// @name        SpyShop Bypass Select,Copy & Paste
// @namespace   https://github.com/x3ric
// @match       https://www.spyshop.pl/blog/*
// @grant       none
// @version     1.1
// @author      x3ric
// @license     MIT
// @description Bypass Copy and Paste for spyshop.pl 
// @downloadURL https://update.greasyfork.org/scripts/523340/SpyShop%20Bypass%20Select%2CCopy%20%20Paste.user.js
// @updateURL https://update.greasyfork.org/scripts/523340/SpyShop%20Bypass%20Select%2CCopy%20%20Paste.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Overriding the specific script functionalities by resetting the event handlers
    document.onkeydown = null;
    document.onselectstart = null;
    document.onmousedown = null;
    document.onclick = null;
    // Reset CSS styles that prevent user interaction
    document.querySelectorAll('*').forEach(el => {
        el.style.userSelect = 'text';
        el.style.cursor = '';
    });
    // Remove event listeners that were added via the problematic script
    function removeAllEventListeners() {
        var newElement = document.createElement('div');
        newElement.innerHTML = document.body.innerHTML;
        document.body.innerHTML = newElement.innerHTML;
    }
    // Call this function to remove listeners on page load and navigation events
    window.onload = removeAllEventListeners;
    document.addEventListener('DOMContentLoaded', removeAllEventListeners);
    // Patch for the Safari touch call, if necessary
    document.addEventListener('touchstart', function(e) {
        e.stopPropagation();
    }, true);
    document.addEventListener('touchend', function(e) {
        e.stopPropagation();
    }, true);
})();
