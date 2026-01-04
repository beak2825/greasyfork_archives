// ==UserScript==
// @name         Keep ChatGPT Element Resizer & Repositioner
// @namespace    https://greasyfork.org/en/users/567951-stuart-saddler
// @version      1.0
// @description  Enhances the usability of the Keep ChatGPT extension by resizing and repositioning its element above the search box on chatgpt.com.
// @author       Stuart Saddler
// @match        https://chatgpt.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/521676/Keep%20ChatGPT%20Element%20Resizer%20%20Repositioner.user.js
// @updateURL https://update.greasyfork.org/scripts/521676/Keep%20ChatGPT%20Element%20Resizer%20%20Repositioner.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to adjust and reposition the element
    function adjustElement() {
        const element = document.getElementById('kcg');
        const appElement = document.getElementById('App');

        if (element) {
            // Move the kcg element above the App element
            if (appElement && appElement.parentNode && appElement.previousSibling !== element) {
                appElement.parentNode.insertBefore(element, appElement);
            }

            // Resize and align the element
            element.style.width = '25px'; // Adjust the width
            element.style.height = '25px'; // Reduce height by half
            element.style.fontSize = '12px'; // Adjust font size
            element.style.padding = '5px'; // Adjust padding
            element.style.margin = '5px 0'; // Remove horizontal centering
            element.style.textAlign = 'left'; // Ensure content is left-aligned

            // Remove the element text
            const unwantedText = Array.from(element.childNodes).find(
                (node) => node.nodeType === Node.TEXT_NODE && node.textContent.includes('by xcanwin')
            );
            if (unwantedText) {
                element.removeChild(unwantedText);
            }
        }
    }

    // Apply adjustments on page load
    window.addEventListener('load', adjustElement);

    // Observe dynamic changes to the DOM
    const observer = new MutationObserver(() => {
        adjustElement();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Periodic fallback for additional enforcement
    setInterval(() => {
        adjustElement();
    }, 1000);
})();