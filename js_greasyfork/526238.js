// ==UserScript==
// @name         ChatGPT equations to Microsoft Word (Katex to MathML)
// @namespace    https://chatgpt.com/
// @version      1.0
// @description  Add a copy button to ChatGPT equations for copying to Microsoft Word
// @author       Bui Quoc Dung
// @match        https://chatgpt.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/526238/ChatGPT%20equations%20to%20Microsoft%20Word%20%28Katex%20to%20MathML%29.user.js
// @updateURL https://update.greasyfork.org/scripts/526238/ChatGPT%20equations%20to%20Microsoft%20Word%20%28Katex%20to%20MathML%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Function to add the copy button
    function addCopyButton(mathElement, mathML) {
        if (!mathML) return;

        // Check if the button already exists
        if (mathElement.parentElement.querySelector(".copy-mathml-btn")) {
            return;
        }

        // Create a wrapper to ensure proper positioning
        let wrapper = document.createElement("div");
        wrapper.style.display = "inline-flex";
        wrapper.style.alignItems = "center";
        wrapper.style.marginLeft = "10px";

        // Create the copy button
        let copyButton = document.createElement("button");
        copyButton.textContent = "C";
        copyButton.classList.add("copy-mathml-btn");
        copyButton.style.cursor = "pointer";
        copyButton.style.padding = "5px 10px";
        copyButton.style.border = "1px solid #ccc";
        copyButton.style.borderRadius = "5px";
        copyButton.style.background = "#f8f8f8";
        copyButton.style.fontSize = "15px";
        copyButton.style.marginLeft = "10px"; // Ensure space between equation and button

        // Handle click event to copy MathML
        copyButton.addEventListener("click", function () {
            navigator.clipboard.writeText(mathML).catch(err => {
                console.error("Copy failed:", err);
            });
        });

        // Wrap the equation and button together
        mathElement.parentElement.style.display = "inline-flex";
        wrapper.appendChild(copyButton);
        mathElement.parentElement.appendChild(wrapper);
    }

    // Find and process KaTeX formulas on the page
    function processKatexElements() {
        let katexElements = document.querySelectorAll(".katex-mathml");

        for (let el of katexElements) {
            let mathML = el.innerHTML.trim(); // Get MathML content
            addCopyButton(el, mathML);
        }
    }

    // Run when the page loads
    function init() {
        console.log("MathML Copy Button Activated!");
        processKatexElements();

        // Observe DOM changes to detect new formulas
        let observer = new MutationObserver(processKatexElements);
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Start the script
    init();
})();
