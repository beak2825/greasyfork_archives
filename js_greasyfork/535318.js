// ==UserScript==
// @name         Disable Default YouTube Hotkeys
// @description  Disable default YouTube hotkeys without affecting typing
// @namespace    https://greasyfork.org/users/1458847
// @license      MIT
// @match        https://*.youtube.com/watch*
// @match        https://youtube.com/watch*
// @version      1.0
// @downloadURL https://update.greasyfork.org/scripts/535318/Disable%20Default%20YouTube%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/535318/Disable%20Default%20YouTube%20Hotkeys.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Function to handle keydown events and disable selected default hotkeys
    window.addEventListener("keydown", function (event) {
        const targetElement = event.target;

        const isTextInput =
            targetElement.type === "text" ||
            targetElement.type === "textarea" ||
            targetElement.type === "input" ||
            targetElement.id === "contenteditable-root";
        if (isTextInput) return;

        // Disable W (for fullscreen)
        if (event.key.toLowerCase() === "w") {
            preventPropagation(event);
        }
    }, true);

    function preventPropagation(event){
        event.preventDefault();
        event.stopPropagation();
    }
})();