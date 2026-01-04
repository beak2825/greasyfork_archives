// ==UserScript==
// @name         Toggle freeze page
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Toggle full page freeze using a ❄️ button. Blocks scrolling and clicks, but ❄️ stays usable.
// @author       You
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544464/Toggle%20freeze%20page.user.js
// @updateURL https://update.greasyfork.org/scripts/544464/Toggle%20freeze%20page.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let frozenOverlay = null;
    let originalOverflow = "";

    // Create ❄️ button
    const freezeButton = document.createElement("div");
    freezeButton.textContent = "❄️";
    Object.assign(freezeButton.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        fontSize: "30px",
        cursor: "pointer",
        zIndex: "1000001", // Higher than overlay
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        color: "white",
        borderRadius: "50%",
        width: "50px",
        height: "50px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        userSelect: "none",
        boxShadow: "0 0 10px rgba(0,0,0,0.5)"
    });

    document.body.appendChild(freezeButton);

    function toggleFreeze() {
        if (frozenOverlay) {
            // Unfreeze
            frozenOverlay.remove();
            frozenOverlay = null;
            document.body.style.overflow = originalOverflow;
        } else {
            // Freeze
            originalOverflow = document.body.style.overflow;

            frozenOverlay = document.createElement("div");
            Object.assign(frozenOverlay.style, {
                position: "fixed",
                top: "0",
                left: "0",
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0, 0, 0, 0.4)",
                zIndex: "1000000", // Just under the button
                pointerEvents: "all"
            });

            document.body.appendChild(frozenOverlay);
            document.body.style.overflow = "hidden";
        }
    }

    freezeButton.addEventListener("click", toggleFreeze);
})();