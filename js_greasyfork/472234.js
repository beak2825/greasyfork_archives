// ==UserScript==
// @name         Web Environment Integrity Blocker
// @namespace    b3fa6754-eb94-4025-aa98-114b96e1d616
// @version      1.0.0
// @description  Blocks a website if it's using Web Environment Integrity (WEI)
// @author       https://github.com/groundcat
// @license      MIT
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/472234/Web%20Environment%20Integrity%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/472234/Web%20Environment%20Integrity%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Flag for detecting WEI usage
    var weiUsed = false;

    // Get all properties of window object
    var props = Object.getOwnPropertyNames(window);

    // Check each property for getEnvironmentIntegrity method
    for (var i = 0; i < props.length; i++) {
        try {
            if (window[props[i]] && window[props[i]].getEnvironmentIntegrity) {
                weiUsed = true;
                break;
            }
        } catch (e) {
            // Ignore properties that throw errors on access
        }
    }

    // If getEnvironmentIntegrity method is found, show warning
    if (weiUsed) {
        document.documentElement.innerHTML = `
            <div style="background-color: darkred; color: white; height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center;">
                <div>
                    <h1 style="font-size: 2em;">WARNING</h1>
                    <p>This website is using Web Environment Integrity, which might breach your privacy.</p>
                    <a href="https://www.fsf.org/blogs/community/web-environment-integrity-is-an-all-out-attack-on-the-free-internet" style="color: white; text-decoration: underline;">Here is why</a>
                </div>
            </div>
        `;

        // Stop further execution of scripts on the page
        window.stop();
    }
})();
