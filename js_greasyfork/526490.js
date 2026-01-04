// ==UserScript==
// @name        Hide ratings on backloggd.com
// @namespace   Violentmonkey Scripts
// @icon        https://www.backloggd.com/favicon.ico
// @match       https://backloggd.com/*
// @match       https://www.backloggd.com/*
// @run-at      document-start
// @grant       none
// @version     1.0.3
// @author      epicBlast
// @description 10/2/2025, 22:34:48
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526490/Hide%20ratings%20on%20backloggdcom.user.js
// @updateURL https://update.greasyfork.org/scripts/526490/Hide%20ratings%20on%20backloggdcom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Selector for the target element
    const selectorParent = "#game-stats > div.row.mt-4.mt-md-3 > div.col-4.col-xl-3.d-none.d-md-block.order-1 > div.container.backloggd-container.center-container.h-100"
    const selectorScore = "#game-rating > h1";
    const selectorGraph = "#ratings-bars-height"

    function hideElements() {
        console.log("hideElements entry")
        let style = document.getElementById("hide-elements-style")
        if (!style) {
            style = document.createElement("style");
            style.id = "hide-elements-style";
            style.innerHTML = `${selectorScore}, ${selectorGraph} { display: none !important; }`;
            document.head.appendChild(style);
            console.log("style created")
        }
        else {
            style.innerHTML = `${selectorScore}, ${selectorGraph} { display: none !important; }`;
        }
    }

    function showElements() {
        console.log("showElements entry")
        const style = document.getElementById("hide-elements-style")
        if (!style) return;
        style.innerHTML = `
            ${selectorScore} { display: block; }
            ${selectorGraph} { display: flex; }
        `;
    }

    function toggleElements() {
        const style = document.getElementById("hide-elements-style");
        if (!style) return;

        if (style.innerHTML.includes("display: none !important")) {
            showElements();
        } else {
            hideElements();
        }
    }

    function removeStyle() {
        const existingStyle = document.getElementById("hide-elements-style");
        if (existingStyle) {
            existingStyle.remove();
        }
    }

    function addEye() {
        const parent = document.querySelector(selectorParent);
        if (!parent || parent.querySelector(".eye-toggle")) return;

        // Create an eye icon button
        const eyeIcon = document.createElement("button");
        eyeIcon.innerHTML = "👁";
        eyeIcon.className = "eye-toggle";
        eyeIcon.style.cursor = "pointer";
        eyeIcon.style.background = "none";
        eyeIcon.style.border = "none";
        eyeIcon.style.fontSize = "20px";
        eyeIcon.style.padding = "5px";

        // Insert the eye icon as the first child of the parent element
        parent.insertBefore(eyeIcon, parent.firstChild);

        // Toggle visibility on click
        eyeIcon.addEventListener("click", function() {
            toggleElements();
        });
    }

    function mainExecutor() {
        console.log("mainExecutor entry")
        if (document.querySelector('#user-info, #profile-sidebar')) {
            removeStyle();
        } else {
            const style = document.getElementById("hide-elements-style");
            if (!style) {
                hideElements();
            }
            addEye();
        }
    }

    function observePageChanges() {
        new MutationObserver(mutations => {
            if (!document.body.matches('#game-body, #user-info, #profile-sidebar') && !mutations.some(m => m.addedNodes.length)) return;
            mainExecutor();
        }).observe(document.documentElement, { childList: true, subtree: true });
    }

    observePageChanges();
    window.addEventListener("load", mainExecutor);
})();