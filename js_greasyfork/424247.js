// ==UserScript==
// @name         Copy URL Buttons in Google Search Results
// @namespace    https://wpdevdesign.com/
// @match        *://*.google.*/search?*
// @grant        none
// @version      1.0.2
// @author       Sridhar Katakam & Gemini
// @description  Adds a sleek 1-click copy button to Google Search results with support for infinite scrolling.
// @downloadURL https://update.greasyfork.org/scripts/424247/Copy%20URL%20Buttons%20in%20Google%20Search%20Results.user.js
// @updateURL https://update.greasyfork.org/scripts/424247/Copy%20URL%20Buttons%20in%20Google%20Search%20Results.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // CSS for the copy button
    const buttonStyles = `
        .copy-url-btn {
            cursor: pointer;
            margin-left: 12px;
            border-radius: 8px;
            padding: 2px 10px;
            border: 1px solid #dadce0;
            background-color: #f8f9fa;
            color: #3c4043;
            font-size: 12px;
            font-family: Roboto, Arial, sans-serif;
            transition: background-color 0.2s;
            vertical-align: middle;
        }
        .copy-url-btn:hover {
            background-color: #eeeeee;
            border-color: #bdc1c6;
        }
        .copy-url-btn.success {
            background-color: #e6f4ea;
            color: #137333;
            border-color: #137333;
        }
    `;

    // Inject styles into the head
    const styleSheet = document.createElement("style");
    styleSheet.innerText = buttonStyles;
    document.head.appendChild(styleSheet);

    async function copyToClipboard(event) {
        event.preventDefault();
        event.stopPropagation();

        const btn = event.currentTarget;
        const url = btn.getAttribute('data-url');

        try {
            await navigator.clipboard.writeText(url);
            const originalText = btn.textContent;
            btn.textContent = "Copied ✓";
            btn.classList.add('success');

            setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('success');
            }, 1500);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    function addButtons() {
      // This targets any link that contains an h3, which is the standard structure for Google titles
      const results = document.querySelectorAll('a:has(h3):not([data-copy-added])');

        results.forEach(el => {
            const h3 = el.querySelector('h3');
            if (!h3) return;

            const button = document.createElement("button");
            button.className = "copy-url-btn";
            button.textContent = "Copy URL";
            button.setAttribute('data-url', el.href);

            // Mark as processed
            el.setAttribute('data-copy-added', 'true');

            button.addEventListener("click", copyToClipboard);
            h3.appendChild(button);
        });
    }

    // Run once on load
    addButtons();

    // Watch for changes (infinite scroll / AJAX)
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                addButtons();
            }
        }
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();