// ==UserScript==
// @name         Highlight VSBattles Stats based on Key
// @description  Highlights stat sections separated by '|' with different colours in a cyclical pattern on VSBattles wiki.
// @namespace    https://github.com/kaubu
// @match        *://vsbattles.fandom.com/*
// @match        *://fcoc-vs-battles.fandom.com/*
// @match        *://miscvsbattles.fandom.com/*
// @version      1.0.2
// @author       kaubu (https://github.com/kaubu)
// @grant        none
// @license      0BSD
// @downloadURL https://update.greasyfork.org/scripts/531617/Highlight%20VSBattles%20Stats%20based%20on%20Key.user.js
// @updateURL https://update.greasyfork.org/scripts/531617/Highlight%20VSBattles%20Stats%20based%20on%20Key.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Optimised colors for both dark (#19182f) and light (#d4e6f7) backgrounds
    const colors = ["#E74C3C", "#E67E22", "#2ECC71", "#9B59B6", "#D81B60", "#1ABC9C"];

    function highlightElements(paragraph) {
        // Ensure the paragraph contains a "|" before proceeding
        if (!paragraph.textContent.includes("|")) return;

        let boldElements = Array.from(paragraph.querySelectorAll("b"));
        if (boldElements.length === 0) return;

        let colorIndex = 0; // Reset color cycle for each paragraph
        let nodes = Array.from(paragraph.childNodes); // Get all nodes in the paragraph

        nodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE && node.textContent.includes("|")) {
                // When encountering a '|', move to the next color
                colorIndex = (colorIndex + 1) % colors.length;
            } else if (
                node.nodeType === Node.ELEMENT_NODE &&
                node.tagName === "B" &&
                !node.textContent.includes("Key:") && // Ignore "Key:" bold text
                !node.querySelector("a") // Ignore bold elements that contain links
            ) {
                // Apply color to valid bold text only
                node.style.color = colors[colorIndex];
                node.style.fontWeight = "bold";
            }
        });
    }

    function processParagraphs() {
        let paragraphs = document.querySelectorAll(".mw-content-ltr > p");
        paragraphs.forEach(highlightElements);
    }

    // Run the script on the target paragraphs
    processParagraphs();
})();