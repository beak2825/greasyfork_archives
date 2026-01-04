// ==UserScript==
// @name         Game Attack
// @namespace    https://github.com/ghsjulian
// @version      1.0
// @description  This script will automatically set number to your casino game. Let's try to do it.
// @author       Ghs Julian
// @match        *://*/*
// @grant        none
// @downloadURL
// @updateURL
// @downloadURL https://update.greasyfork.org/scripts/524475/Game%20Attack.user.js
// @updateURL https://update.greasyfork.org/scripts/524475/Game%20Attack.meta.js
// ==/UserScript==

(function () {
    "use strict";
    const container = document.querySelector(".container");
    const insetForm = document.createElement("div");
    const input = document.createElement("input");

    function openBox() {
        // Apply styles directly using JavaScript
        insetForm.style.width = "200px";
        insetForm.style.maxWidth = "200px";
        insetForm.style.padding = "0.2rem";
        insetForm.style.background = "#002e38";
        insetForm.style.position = "absolute";
        insetForm.style.left = "0";
        insetForm.style.right = "0";
        insetForm.style.top = "0";
        insetForm.style.margin = "3rem auto";
        insetForm.style.borderRadius = "10px";
        insetForm.style.animation = "gh-spin 0.5s linear";

        input.type = "number";
        input.placeholder = "Enter Target Number";
        // Apply styles to the input
        input.style.width = "200px";
        input.style.maxWidth = "200px";
        input.style.fontWeight = "900";
        input.style.color = "#ffffff";
        input.style.fontSize = "19px";
        input.style.borderRadius = "10px";
        input.style.border = "none";
        input.style.outline = "none";
        input.style.background = "transparent";
        input.style.padding = "0.7rem 1rem";
        input.style.margin = "auto";
        input.setAttribute("id", "gh-value");

        insetForm.appendChild(input);
        container.appendChild(insetForm);
        // Add the keyframes for the animation
        const styleSheet = document.styleSheets[0];
        styleSheet.insertRule(
            `
    @keyframes gh-spin {
        from {
            transform: scale(0);
            opacity: 0.7;
        }
        to {
            transform: scale(1);
            opacity: 1;
        }
    }
`,
            styleSheet.cssRules.length
        );
    }

    function setNumber(target) {
        alert(target);
    }

    input.addEventListener("keyup", e => {
        const event = e.target.value;
        if (event !== "") {
            if (e.keyCode == 13) {
                setNumber(event);
            }
        } else {
            return;
        }
    });

    openBox();
})();
