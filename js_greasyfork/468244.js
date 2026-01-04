// ==UserScript==
// @name         Auto Scroll Down
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  Automatically scroll down the page
// @author       Your Name
// @match        *://*/*
// @license      MIT
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/468244/Auto%20Scroll%20Down.user.js
// @updateURL https://update.greasyfork.org/scripts/468244/Auto%20Scroll%20Down.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default values
    let scrollInterval = GM_getValue('scrollInterval', 1000); // in milliseconds
    let scrollBy = GM_getValue('scrollBy', 100); // in pixels
    let scrollDirection = GM_getValue('scrollDirection', 'down'); // 'up' or 'down'
    let autoScroll = false;
    let scrollIntervalId = null;

    // Register menu commands
    GM_registerMenuCommand('Set Scroll Interval', function() {
        let value = prompt('Enter scroll interval in milliseconds:', scrollInterval);
        scrollInterval = parseInt(value);
        GM_setValue('scrollInterval', scrollInterval);
    });

    GM_registerMenuCommand('Set Scroll By', function() {
        let value = prompt('Enter scroll by value in pixels:', scrollBy);
        scrollBy = parseInt(value);
        GM_setValue('scrollBy', scrollBy);
    });

    GM_registerMenuCommand('Set Scroll Direction', function() {
        let value = prompt('Enter scroll direction (up or down):', scrollDirection);
        scrollDirection = value.toLowerCase();
        GM_setValue('scrollDirection', scrollDirection);
    });

    GM_registerMenuCommand('Toggle Auto Scroll', function() {
        autoScroll = !autoScroll;
        if (autoScroll) {
            scrollIntervalId = setInterval(scroll, scrollInterval);
        } else if (scrollIntervalId) {
            clearInterval(scrollIntervalId);
            scrollIntervalId = null;
        }
    });

    // Scroll function
    function scroll() {
        if (scrollDirection === 'up') {
            window.scrollBy(0, -scrollBy);
        } else {
            window.scrollBy(0, scrollBy);
        }
    }
})();
