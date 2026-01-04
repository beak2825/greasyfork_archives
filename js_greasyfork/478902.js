// ==UserScript==
// @name         TUM Logo Replacer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Replace the word 'tum' with the TUM Logo
// @author       https://github.com/jaylann
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/478902/TUM%20Logo%20Replacer.user.js
// @updateURL https://update.greasyfork.org/scripts/478902/TUM%20Logo%20Replacer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Inline SVG content
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="-16 -31 408 213" preserveAspectRatio="xMidYMid meet"><path fill="#3070b3" d="M141-31v173h44V-31h207v212h-39V8h-45v173h-39V8h-45v173H101V8H62v173H23V8h-39v-39Z"/></svg>`;

    // Function to replace 'tum' with image
    function replaceTextWithImage() {
        const elements = document.body.getElementsByTagName('*');
        for (let i = 0; i < elements.length; i++) {
            const element = elements[i];
            if (element.children.length === 0) {
                const text = element.textContent;
                if (text.match(/\btum\b/gi) || text.match(/\btechnische universität münchen\b/gi)) {
                    const fontSize = window.getComputedStyle(element).fontSize;
                    const replacement = `<span style="height:${fontSize};width:${parseFloat(fontSize) * 2}px;display:inline-block;vertical-align:middle;">${svgContent}</span>`;
                    element.innerHTML = text
                        .replace(/\btum\b/gi, replacement)
                        .replace(/\btechnische universität münchen\b/gi, replacement);
                }
            }
        }
    }

    // Call the function to replace 'tum' with image
    replaceTextWithImage();
})();
