// ==UserScript==
// @name         Enable Twitter/X 'Open in App' Prompt
// @namespace    http://tampermonkey.net/
// @icon         data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAJkSURBVHgB7VZBbtpQEH3zIW0WVYuXVaH4Bs0NSk4AOUFhEarskhMknIDsqkKlcIT0BNAT1D1B3ZJK3dmVuirwp/MhVmzAxiagKBJv9+ePZ97M/JkxsMMODwzChlD84FWQp3MxeCDHAhiumB+MJrr1+8Ryw3p/9+H4DctfIPCq49Xlw8Kv99YlMuB19885gy/i7llziwGfFFWJyR02XzSCuwiBUse7BlFVaz5LS8KQVkRXaXRJsqImfDjKSZBNyzEyFWFKVJ4KFbWLElUao6KbSk8i9TXgTPaorxTskPwOxa7/9baGt4zg8oQbNyfWYJlRU0/KUx9ZwNwYNq1ecFRzl18QpW0bB0Ks//KjV1uwlbuLJA3GxEdh5wb5yGEPl3qMd2xecYQHKnlFlVLX95kxYCFKGg5IlU2a0uLpCM68LEJA+sJ/Dm6Jy3aMjQIRakRUm+UuvfOp/X34iQSejeFo0Hdx4optG5uFH/R+GHNvANcm3VtwLs+Lvy2TRwhIOnrYHhysIuDKcCDwGbYAjglOzQt+HssElF6dvoNNOZeuCSbfSgIGMjILMo4/ExZf7TqghNLmlwm1gpSC2tmaLAZMvWGz0Iu7XpqBm2NrQNN5cD+Y5ZOTdZyok3RZMusZOJUN+QZrQFb0oQkG6xIIYHe8A03Unx/Ryd6jS2ctAsbxmFRVynGKlM5na5ePVkUe0p+h9MmraS2zXqYgmSWjOPtElHbLTVB3Q79gqQlMScxqXpeav0UWiGMmXKSNOpZAAPvKs/U/1MRoxRxl+5WD+psUy2D5IdmRVoWjnqDnLlkyO+zwaPAf1zXwZL751PUAAAAASUVORK5CYII=
// @author       Kayleigh
// @version      0.5
// @license      MIT
// @description  Attempt to enable the 'Open in App' prompt on Twitter/X
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500063/Enable%20TwitterX%20%27Open%20in%20App%27%20Prompt.user.js
// @updateURL https://update.greasyfork.org/scripts/500063/Enable%20TwitterX%20%27Open%20in%20App%27%20Prompt.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function createOpenInAppButton() {
        const button = document.createElement('button');
        button.textContent = 'Open in Twitter App';
        button.style.cssText = `
            position: fixed;
            top: 10px;
            left: 10px;
            z-index: 9999;
            padding: 0 20px;
            height: 30px;
            background-color: #1DA1F2;
            color: white;
            border: none;
            border-radius: 9999px;
            cursor: pointer;
            font-family: "TwitterChirp", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            font-size: 13px;
            font-weight: bold;
            transition: background-color 0.2s;
        `;
        button.onmouseover = function() {
            this.style.backgroundColor = '#1a91da';
        };
        button.onmouseout = function() {
            this.style.backgroundColor = '#1DA1F2';
        };
        button.onclick = function() {
            const currentPath = window.location.pathname;
            const tweetMatch = currentPath.match(/\/status\/(\d+)/);
            const userMatch = currentPath.match(/^\/([^\/]+)$/);
            
            let appUrl;
            if (tweetMatch) {
                appUrl = `twitter://status?id=${tweetMatch[1]}`;
            } else if (userMatch) {
                appUrl = `twitter://user?screen_name=${userMatch[1]}`;
            } else {
                appUrl = 'twitter://timeline';
            }
            
            window.location.href = appUrl;
        };
        document.body.appendChild(button);
    }

    function removeElements() {
        // Remove login and signup buttons
        ['login', 'signup'].forEach(testId => {
            const element = document.querySelector(`[data-testid="${testId}"]`);
            if (element && element.parentElement) {
                element.parentElement.remove();
            }
        });

        // Remove follow buttons
        const followButtons = document.querySelectorAll('button[data-testid$="-follow"]');
        followButtons.forEach(button => {
            if (button.parentElement) {
                button.parentElement.remove();
            }
        });
    }

    function init() {
        createOpenInAppButton();
        removeElements();
    }

    // Run on page load
    init();

    // Re-run when the URL changes (for single-page app navigation)
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            init();
        }
    }).observe(document, {subtree: true, childList: true});

    // Periodically check for and remove elements (in case they're added dynamically)
    setInterval(removeElements, 1000);
})();