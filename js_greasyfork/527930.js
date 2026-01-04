// ==UserScript==
// @name         Change Specific Username Color
// @namespace    v4c.fun
// @version      1.3
// @description  Change the color of a specific username in chat
// @author       udnidgnik
// @match        https://cytu.be/r/v4c
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527930/Change%20Specific%20Username%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/527930/Change%20Specific%20Username%20Color.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const targetUsername = "KING__DINDU"; // Change this to your exact username
    const newColor = "#FF5B00"; // Change this to your preferred color (Orange-Red)

    function changeColors() {
        document.querySelectorAll('.userlist_op, .userlist-myName, .user-link').forEach(el => {
            if (el.textContent.trim() === targetUsername) {
                el.style.setProperty("color", newColor, "important");
                el.style.setProperty("font-weight", "bold", "important");

                // Find the next sibling span containing ": " and change its color
                let nextEl = el.nextElementSibling;
                if (nextEl && nextEl.tagName === "SPAN" && nextEl.textContent.trim() === ":") {
                    nextEl.style.setProperty("color", newColor, "important");
                    nextEl.style.setProperty("font-weight", "bold", "important");
                }
            }
        });
    }

    // Run once on page load
    changeColors();

    // Observe for dynamically added usernames & colons
    const observer = new MutationObserver(changeColors);
    observer.observe(document.body, { childList: true, subtree: true });

})();