// ==UserScript==
// @name         Civitai Auto-Clicker for Buzz and Follow
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Automatically clicks "Claim 25 Buzz" once and "Follow" on three different pages per session on Civitai
// @author       Your Name
// @match        https://civitai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/509803/Civitai%20Auto-Clicker%20for%20Buzz%20and%20Follow.user.js
// @updateURL https://update.greasyfork.org/scripts/509803/Civitai%20Auto-Clicker%20for%20Buzz%20and%20Follow.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const buttonConfig = {
        "Claim 25 Buzz": { limit: 1, clicked: 0 },
        "Follow": { limit: 3, clicked: 0, pages: [] }
    };

    function initializeSession() {
        Object.keys(buttonConfig).forEach(key => {
            const storedValue = sessionStorage.getItem(key);
            if (storedValue === null) {
                sessionStorage.setItem(key, JSON.stringify(buttonConfig[key]));
            } else {
                buttonConfig[key] = JSON.parse(storedValue);
            }
        });
    }

    function updateClickCount(buttonText) {
        buttonConfig[buttonText].clicked++;
        if (buttonText === "Follow") {
            buttonConfig[buttonText].pages.push(window.location.href);
        }
        sessionStorage.setItem(buttonText, JSON.stringify(buttonConfig[buttonText]));
    }

    function findButtonByText(text) {
        return Array.from(document.querySelectorAll('button')).find(
            button => button.textContent.trim() === text
        );
    }

    function clickButton(button, buttonText) {
        if (button && !button.disabled && button.offsetParent !== null) {
            button.click();
            updateClickCount(buttonText);
            console.log(`Clicked button: ${buttonText}. Click count: ${buttonConfig[buttonText].clicked}`);
        }
    }

    function checkAndClickButtons() {
        Object.keys(buttonConfig).forEach(buttonText => {
            if (buttonConfig[buttonText].clicked < buttonConfig[buttonText].limit) {
                if (buttonText === "Follow") {
                    if (!buttonConfig[buttonText].pages.includes(window.location.href)) {
                        const button = findButtonByText(buttonText);
                        if (button) clickButton(button, buttonText);
                    }
                } else {
                    const button = findButtonByText(buttonText);
                    if (button) clickButton(button, buttonText);
                }
            }
        });
    }

    function isScriptFinished() {
        return Object.keys(buttonConfig).every(key =>
            buttonConfig[key].clicked >= buttonConfig[key].limit
        );
    }

    // Initialize session
    initializeSession();

    // Initial check
    checkAndClickButtons();

    // Set up a MutationObserver to watch for DOM changes
    const observer = new MutationObserver((mutations) => {
        if (!isScriptFinished()) {
            checkAndClickButtons();
        } else {
            observer.disconnect();
            console.log("All click limits reached. Script finished.");
        }
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // Also check periodically, just in case
    const intervalId = setInterval(() => {
        if (!isScriptFinished()) {
            checkAndClickButtons();
        } else {
            clearInterval(intervalId);
            console.log("All click limits reached. Script finished.");
        }
    }, 1000);

    // Log to confirm script is running
    console.log("Civitai Auto-Clicker script is active");
    console.log("Current state:", JSON.stringify(buttonConfig));
})();