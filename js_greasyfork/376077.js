// ==UserScript==
// @name            GitHub shorter title edited files
// @description     Change title edited file in editor to filename.
// @author          hawkeye116477, krystian3w
// @namespace       https://greasyfork.org/users/167625
// @icon            https://i.imgur.com/KmWlHbe.png
// @match           https://github.com/*/*/edit/*/*
// @version         1.0.8
// @grant           none
// @run-at          document-idle
// @compatible      firefox Firefox
// @compatible      chrome Chrome
// @compatible      edge Edge
// @downloadURL https://update.greasyfork.org/scripts/376077/GitHub%20shorter%20title%20edited%20files.user.js
// @updateURL https://update.greasyfork.org/scripts/376077/GitHub%20shorter%20title%20edited%20files.meta.js
// ==/UserScript==

"use strict";

(function () {
    let lastUrl = location.href;

    // Function to run on pages with "edit" in the URL
    function runOnEditPage() {
        if (!location.href.includes("/edit/")) return;

        const updateTitle = () => {
            const el = document.querySelector('[aria-label="File name"]');
            if (el && el.value) {
                document.title = el.value;
                return true;
            }
            return false;
        };

        if (!updateTitle()) {
            const observer = new MutationObserver(() => {
                if (updateTitle()) observer.disconnect();
            });
            observer.observe(document.body, { childList: true, subtree: true });
        }
    }

    // Observe SPA URL changes
    const observeUrl = () => {
        const bodyObserver = new MutationObserver(() => {
            if (location.href !== lastUrl) {
                lastUrl = location.href;
                runOnEditPage();
            }
        });
        bodyObserver.observe(document.body, { childList: true, subtree: true });
    };

    // Hook into history API (for pushState/replaceState)
    const interceptHistory = () => {
        const origPush = history.pushState;
        const origReplace = history.replaceState;

        const handler = function () {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                runOnEditPage();
            }
        };

        history.pushState = function () {
            origPush.apply(this, arguments);
            handler();
        };

        history.replaceState = function () {
            origReplace.apply(this, arguments);
            handler();
        };

        window.addEventListener("popstate", handler);
    };

    observeUrl();
    interceptHistory();
    runOnEditPage(); // Initial load
})();
