// ==UserScript==
// @name         CSS Selector Copy
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Click elements to get their CSS selector instantly
// @author       Bui Quoc Dung
// @match        *://*/*
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538027/CSS%20Selector%20Copy.user.js
// @updateURL https://update.greasyfork.org/scripts/538027/CSS%20Selector%20Copy.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add styles for our dialog
    GM_addStyle(`
        .instant-selector-dialog {
            position: fixed;
            z-index: 999999;
            background: white;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            padding: 16px;
            max-width: 400px;
            width: 90%;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            animation: dialogFadeIn 0.15s ease-out;
            border: 1px solid #e0e0e0;
        }

        @keyframes dialogFadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .selector-header {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 12px;
            color: #202124;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .selector-header svg {
            width: 18px;
            height: 18px;
            fill: #5f6368;
        }

        .selector-display {
            background: #f8f9fa;
            border-radius: 6px;
            padding: 12px;
            font-family: 'Roboto Mono', monospace;
            font-size: 13px;
            line-height: 1.5;
            margin-bottom: 16px;
            max-height: 200px;
            overflow-y: auto;
            border: 1px solid #e0e0e0;
            white-space: pre-wrap;
            word-break: break-all;
        }

        .selector-options {
            display: flex;
            gap: 16px;
            margin-bottom: 16px;
            padding-bottom: 16px;
            border-bottom: 1px solid #f1f1f1;
        }

        .option-radio {
            display: flex;
            align-items: center;
            gap: 6px;
            cursor: pointer;
            font-size: 14px;
        }

        .selector-buttons {
            display: flex;
            justify-content: flex-end;
            gap: 8px;
        }

        .selector-button {
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: 500;
            font-size: 14px;
            cursor: pointer;
            border: none;
            transition: all 0.2s;
        }

        .copy-button {
            background: #1a73e8;
            color: white;
        }

        .copy-button:hover {
            background: #1765cc;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }

        .copy-button.copied {
            background: #34a853;
        }

        .close-button {
            background: transparent;
            color: #5f6368;
            border: 1px solid #dadce0;
        }

        .close-button:hover {
            background: #f8f9fa;
        }
    `);

    // Create dialog element
    const dialog = document.createElement('div');
    dialog.className = 'instant-selector-dialog';
    dialog.style.display = 'none';
    document.body.appendChild(dialog);

    // Add dialog content
    dialog.innerHTML = `
        <div class="selector-header">
            <svg viewBox="0 0 24 24"><path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm4 12h-2v2c0 .55-.45 1-1 1s-1-.45-1-1v-2H9v-2h2v-2c0-.55.45-1 1-1s1 .45 1 1v2h2v2z"></path></svg>
            <span>CSS Selector</span>
        </div>
        <div class="selector-display" id="selector-display"></div>
        <div class="selector-options">
            <label class="option-radio">
                <input type="radio" name="selector-option" value="with" checked> With :nth-of-type
            </label>
            <label class="option-radio">
                <input type="radio" name="selector-option" value="without"> Without :nth-of-type
            </label>
        </div>
        <div class="selector-buttons">
            <button class="selector-button copy-button" id="copy-button">Copy</button>
            <button class="selector-button close-button" id="close-button">Close</button>
        </div>
    `;

    // Get references to dialog elements
    const selectorDisplay = dialog.querySelector('#selector-display');
    const copyButton = dialog.querySelector('#copy-button');
    const closeButton = dialog.querySelector('#close-button');
    const optionRadios = dialog.querySelectorAll('input[name="selector-option"]');

    // Your improved selector function
    function getFullCssSelector(el, includeNth = true) {
        if (!(el instanceof Element)) return;
        const path = [];
        while (el) {
            let selector = el.nodeName.toLowerCase();
            if (el.id) {
                selector += "#" + el.id;
                path.unshift(selector);
                break;
            } else {
                if (el.className && typeof el.className === 'string') {
                    const classes = el.className.trim().split(/\s+/).join(".");
                    if (classes) selector += "." + classes;
                }

                if (includeNth) {
                    let sibling = el, nth = 1;
                    while ((sibling = sibling.previousElementSibling)) {
                        if (sibling.nodeName === el.nodeName) nth++;
                    }
                    selector += `:nth-of-type(${nth})`;
                }

                path.unshift(selector);
                el = el.parentElement;
            }
        }
        return path.join(" > ");
    }

    // Position and show dialog
    function showDialog(element, event) {
        const includeNth = dialog.querySelector('input[name="selector-option"]:checked').value === 'with';
        const selector = getFullCssSelector(element, includeNth);

        selectorDisplay.textContent = selector;

        // Position dialog near the click
        const x = event.clientX;
        const y = event.clientY;

        dialog.style.left = `${Math.min(x + 20, window.innerWidth - 420)}px`;
        dialog.style.top = `${Math.min(y + 20, window.innerHeight - dialog.offsetHeight - 20)}px`;
        dialog.style.display = 'block';
    }

    // Hide dialog
    function hideDialog() {
        dialog.style.display = 'none';
    }

    // Handle copy button click
    copyButton.addEventListener('click', () => {
        GM_setClipboard(selectorDisplay.textContent, 'text');
        copyButton.textContent = 'Copied!';
        copyButton.classList.add('copied');
        setTimeout(() => {
            copyButton.textContent = 'Copy';
            copyButton.classList.remove('copied');
        }, 2000);
    });

    // Handle close button click
    closeButton.addEventListener('click', hideDialog);

    // Close dialog when clicking outside
    document.addEventListener('click', (e) => {
        if (dialog.style.display === 'block' && !dialog.contains(e.target)) {
            hideDialog();
        }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && dialog.style.display === 'block') {
            hideDialog();
        }
    });

    // Handle Ctrl+Click or Alt+Click on elements
    document.addEventListener('click', (e) => {
        // Only activate with Ctrl+Click or Alt+Click to avoid conflict with normal clicks
        if (e.ctrlKey || e.altKey) {
            e.preventDefault();
            e.stopPropagation();
            showDialog(e.target, e);
        }
    }, true);
})();