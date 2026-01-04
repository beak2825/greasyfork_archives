// ==UserScript==
// @name         Snapchat Unbreaker
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  Improve the Snapchat web experience by disabling screenshot prevention features that harm usability.
// @match        https://web.snapchat.com/*
// @match        https://www.snapchat.com/web/*
// @icon         http://snapchat.com/favicon.ico
// @license      MIT
// @run-at       document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479894/Snapchat%20Unbreaker.user.js
// @updateURL https://update.greasyfork.org/scripts/479894/Snapchat%20Unbreaker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function unblockControlKeyEvents() {
        const events = ["keydown", "keyup", "keypress"];
        const modifyKeys = ["Control", "Meta", "Alt", "Shift"];
        for (const event_type of events) {
            document.addEventListener(
                event_type,
                function (e) {
                    if (modifyKeys.includes(e.key)) {
                        e.preventDefault();
                        e.stopPropagation();
                        console.log(`'${event_type}' event for '${e.key}' received and prevented:`, e);
                        e.stopImmediatePropagation();
                    }
                },
                true
            );
        }
    }

    function unblockEvent() {
        for (const event_type of arguments) {
            document.addEventListener(
                event_type,
                function (e) {
                    e.stopPropagation();
                    console.log(`'${event_type}' event received and prevented:`, e);
                },
                true
            );
        }
    }

    function fixConsole() {
        const iframe = document.createElement("iframe");
        iframe.style.display = "none";
        document.body.appendChild(iframe);
        const nativeConsole = iframe.contentWindow.console;
        window.console = nativeConsole;
    }

    function setupUnblocker() {
        fixConsole();
        unblockControlKeyEvents();

        // Allow right-click without losing focus
        unblockEvent("contextmenu");
    }

    console.dir("Snapchat unbreaker running!");
    setupUnblocker();
    // Run a few extra times to ensure event listeners take priority.
    setTimeout(setupUnblocker, 1000);
    setTimeout(setupUnblocker, 5000);
    setTimeout(setupUnblocker, 10000);

    // Ensure focus is always true.
    document.hasFocus = function() { return true; }

})();
