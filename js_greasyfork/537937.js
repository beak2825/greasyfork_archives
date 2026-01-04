// ==UserScript==
// @name        Dark Mode
// @namespace   Violentmonkey Scripts
// @match       *://jav.guru/*
// @grant       none
// @version     1.0
// @author      -
// @description 5/15/2025, 3:06:18 PM
// @downloadURL https://update.greasyfork.org/scripts/537937/Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/537937/Dark%20Mode.meta.js
// ==/UserScript==

(function () {
    function addDarkClass() {
        if (!document.body.classList.contains("wp-night-mode-on")) {
            document.body.classList.add("wp-night-mode-on");
            console.log("[VM] wp-night-mode-on class added");
        }
    }

    // Wait until the DOM is ready and the body exists
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", addDarkClass);
    } else {
        addDarkClass();
    }

    // Also use MutationObserver in case body is changed or replaced
    const observer = new MutationObserver(() => {
        addDarkClass();
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });
})();