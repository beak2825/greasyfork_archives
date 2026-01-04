// ==UserScript==
// @name         Aternos Auto-Start and Restart Bot
// @namespace    https://aternos.org/
// @version      3.7
// @description  Start Aternos server and handle actions automatically.
// @author       Zephyr5929
// @match        https://aternos.org/server/*
// @grant        none
// @license      MIT
// @icon         https://media.forgecdn.net/avatars/375/55/637549609568691156.png
// @downloadURL https://update.greasyfork.org/scripts/524506/Aternos%20Auto-Start%20and%20Restart%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/524506/Aternos%20Auto-Start%20and%20Restart%20Bot.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const INITIAL_DELAY_MS = 10000;
    let startExecuted = false;
    let confirmSkipped = false;

    function onDOMReady(callback) {
        if (document.readyState === "complete" || document.readyState === "interactive") {
            callback();
        } else {
            document.addEventListener("DOMContentLoaded", callback);
        }
    }

    function isVisible(selector) {
        const element = document.querySelector(selector);
        return element && element.offsetParent !== null;
    }

    function clickElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            console.log(`Clicking element: ${selector}`);
            element.click();
            return true;
        } else {
            console.warn(`Element not found: ${selector}`);
            return false;
        }
    }

    function handleServerStart() {
        if (isVisible("#restart")) {
            console.log("'Restart' button is visible. Skipping 'Start' and 'Confirm now!' actions.");
            return;
        }
        if (isVisible("#start")) {
            console.log("'Start' button is visible. Starting the server...");
            if (clickElement("#start")) {
                startExecuted = true;
                monitorRestartOrConfirmButton();
            }
        } else {
            console.warn("'Start' button is not visible. No action taken.");
        }
    }

    function monitorRestartOrConfirmButton() {
        console.log("Monitoring for 'Restart' or 'Confirm now!' button...");
        const observer = new MutationObserver(() => {
            if (isVisible("#restart")) {
                console.log("'Restart' button detected. Skipping 'Confirm now!' and proceeding...");
                confirmSkipped = true;
                observer.disconnect();
            } else if (isVisible("#confirm")) {
                console.log("'Confirm now!' button detected. Clicking...");
                if (clickElement("#confirm")) {
                    observer.disconnect();
                }
            }
        });
        observer.observe(document.body, {
            childList: true,
            subtree: true,
        });
        setTimeout(() => observer.disconnect(), 30000);
    }

    onDOMReady(() => {
        console.log("Page loaded. Waiting 10 seconds before starting...");
        setTimeout(() => {
            handleServerStart();
        }, INITIAL_DELAY_MS);
    });
})();
