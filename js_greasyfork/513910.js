// ==UserScript==
// @name         Block External Scripts Per Domain
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Blocks any JS script from loading unless it matches the current domain
// @author       yourname
// @match        *://kemono.su/*
// @match        *://coomer.su/*
// @match        *://gelbooru.com/*
// @match        *://rule34.xxx/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/513910/Block%20External%20Scripts%20Per%20Domain.user.js
// @updateURL https://update.greasyfork.org/scripts/513910/Block%20External%20Scripts%20Per%20Domain.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Get the current domain
    const currentDomain = location.hostname;

    // Function to check if a URL is from the current domain
    function isAllowedDomain(url) {
        try {
            const scriptDomain = new URL(url).hostname;
            return scriptDomain === currentDomain;
        } catch (e) {
            return false;  // Handle invalid URLs gracefully
        }
    }

    // Override the default script element behavior
    const originalCreateElement = document.createElement;
    document.createElement = function(tagName) {
        if (tagName.toLowerCase() === 'script') {
            const scriptElement = originalCreateElement.call(document, tagName);

            // Use a setter to intercept the 'src' attribute
            Object.defineProperty(scriptElement, 'src', {
                set: function(url) {
                    if (!isAllowedDomain(url)) {
                        console.warn('Blocked external script:', url);
                        return '';  // Block the script
                    }
                    return scriptElement.setAttribute('src', url);
                },
                get: function() {
                    return scriptElement.getAttribute('src');
                }
            });

            return scriptElement;
        }

        // For other elements, return normally
        return originalCreateElement.call(document, tagName);
    };

    // Optional: Block inline scripts not from the current domain
    const originalAppendChild = Node.prototype.appendChild;
    Node.prototype.appendChild = function(node) {
        if (node.tagName === 'SCRIPT' && !node.src) {
            console.warn('Blocked inline script');
            return;  // Block inline scripts
        }
        return originalAppendChild.call(this, node);
    };

})();
