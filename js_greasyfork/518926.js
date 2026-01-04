// ==UserScript==
// @name         User-Agent Switcher for Chrome
// @license MIT
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Switch user-agent to Google Chrome
// @author       You
// @match        *://*/*  // Change this to the website URL where you want to apply the switch
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518926/User-Agent%20Switcher%20for%20Chrome.user.js
// @updateURL https://update.greasyfork.org/scripts/518926/User-Agent%20Switcher%20for%20Chrome.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Define the Google Chrome user-agent string (Windows version)
    const chromeUserAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/117.0.0.0 Safari/537.36";
    
    // Change the user-agent for the current page
    Object.defineProperty(navigator, 'userAgent', {
        get: function() { return chromeUserAgent; }
    });
    
    console.log("User-Agent has been switched to Google Chrome!");
})();
