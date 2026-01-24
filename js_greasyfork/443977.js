// ==UserScript==
// @name         WordPress.org Plugins - Copy Helpers
// @namespace    https://brickslabs.com/
// @version      0.2
// @description  Adds Copy buttons to WP.org plugin pages.
// @author       Sridhar Katakam & Gemini
// @match        https://wordpress.org/plugins/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/443977/WordPressorg%20Plugins%20-%20Copy%20Helpers.user.js
// @updateURL https://update.greasyfork.org/scripts/443977/WordPressorg%20Plugins%20-%20Copy%20Helpers.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 1. Inject Styles
    const style = document.createElement('style');
    style.textContent = `
        .wp-copy-btns-wrapper {
            display: flex;
            gap: 8px;
            margin-top: 10px;
            position: relative;
            z-index: 10; /* Ensure buttons stay above the link wrapper */
        }
        .wp-copy-btn {
            cursor: pointer;
            border-radius: 6px;
            padding: 4px 12px;
            border: 1px solid #3e58e1;
            font-size: 12px;
            font-weight: 600;
            background-color: #3e58e1;
            color: #fff;
            transition: all 0.2s ease;
            line-height: 1.4;
        }
        .wp-copy-btn:hover {
            background-color: #213fd4;
            border-color: #213fd4;
        }
        .wp-copy-btn.copied {
            background-color: #00a32a;
            border-color: #00a32a;
        }
    `;
    document.head.appendChild(style);

    // 2. Modern Copy Function with Propagation Stop
    async function handleCopy(text, button, event) {
        // CRITICAL: Stop the click from bubbling up to the link wrapper
        event.preventDefault();
        event.stopPropagation();

        try {
            await navigator.clipboard.writeText(text);
            const originalText = button.textContent;
            button.textContent = "Copied ✓";
            button.classList.add('copied');

            setTimeout(() => {
                button.textContent = originalText;
                button.classList.remove('copied');
            }, 1200);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    }

    // 3. Updated Logic for the Grid Layout
    function init() {
        // Target the headers specifically within the post blocks
        const headers = document.querySelectorAll('.wp-block-post .entry-header:not([data-copy-added])');

        headers.forEach(header => {
            const titleLink = header.querySelector('.entry-title a');
            if (!titleLink) return;

            // Prevent duplicate injection
            header.setAttribute('data-copy-added', 'true');
            header.querySelector('.entry-title').style.marginBottom = "0";

            const url = titleLink.href;
            const name = titleLink.textContent.trim();

            const wrapper = document.createElement('div');
            wrapper.className = 'wp-copy-btns-wrapper';

            // Create Link Button
            const btnLink = document.createElement('button');
            btnLink.className = 'wp-copy-btn';
            btnLink.textContent = 'Copy Link';
            btnLink.onclick = (e) => handleCopy(url, btnLink, e);

            // Create Name Button
            const btnName = document.createElement('button');
            btnName.className = 'wp-copy-btn';
            btnName.textContent = 'Copy Name';
            btnName.onclick = (e) => handleCopy(name, btnName, e);

            wrapper.appendChild(btnLink);
            wrapper.appendChild(btnName);
            header.appendChild(wrapper);
        });
    }

    // Run on load and watch for infinite scroll results
    init();
    const observer = new MutationObserver(() => init());
    observer.observe(document.body, { childList: true, subtree: true });

})();