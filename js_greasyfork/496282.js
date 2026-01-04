// ==UserScript==
// @name         Add Bottom Copy Button to Code Blocks in ChatGPT
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Adds a copy button at the bottom of code blocks in ChatGPT, styled similarly to the existing top button
// @author       You
// @match        *://chatgpt.com/*
// @match        *://chat.openai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/496282/Add%20Bottom%20Copy%20Button%20to%20Code%20Blocks%20in%20ChatGPT.user.js
// @updateURL https://update.greasyfork.org/scripts/496282/Add%20Bottom%20Copy%20Button%20to%20Code%20Blocks%20in%20ChatGPT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Function to create and append copy buttons to code blocks
    function addBottomCopyButtons() {
        // Select all pre elements with code blocks
        const codeBlocks = document.querySelectorAll('pre > div');

        codeBlocks.forEach((codeBlock) => {
            // Check if the bottom copy button already exists to avoid duplicates
            if (codeBlock.querySelector('.bottom-copy-button')) return;

            // Create the copy button container
            const copyButtonContainer = document.createElement('div');
            copyButtonContainer.className = 'flex items-center';
            copyButtonContainer.style.position = 'absolute';
            copyButtonContainer.style.bottom = '0';
            copyButtonContainer.style.width = '100%';
            copyButtonContainer.style.background = 'transparent';
            copyButtonContainer.style.display = 'flex';
            copyButtonContainer.style.justifyContent = 'flex-end';
            copyButtonContainer.style.paddingRight = '12px';
            copyButtonContainer.style.padding = '10px';
            copyButtonContainer.style.pointerEvents = 'none';

            // Create the copy button span and button elements
            const spanElement = document.createElement('span');
            spanElement.dataset.state = 'closed';

            const buttonElement = document.createElement('button');
            buttonElement.className = 'flex gap-1 items-center bottom-copy-button';
            buttonElement.style.cssText = `
                -webkit-text-size-adjust: 100%;
                -webkit-tap-highlight-color: transparent;
                tab-size: 4;
                --selection: #007aff;
                --white: #fff;
                --black: #000;
                --gray-50: #f9f9f9;
                --gray-100: #ececec;
                --gray-200: #e3e3e3;
                --gray-300: #cdcdcd;
                --gray-400: #b4b4b4;
                --gray-500: #9b9b9b;
                --gray-600: #676767;
                --gray-700: #424242;
                --gray-750: #2f2f2f;
                --gray-800: #212121;
                --gray-900: #171717;
                --gray-950: #0d0d0d;
                --red-500: #ef4444;
                --red-700: #b91c1c;
                --brand-purple: #ab68ff;
                --surface-error: 249 58 55;
                color-scheme: dark;
                -webkit-font-smoothing: antialiased;
                --tw-prose-invert-body: var(--text-primary);
                --tw-prose-invert-headings: var(--text-primary);
                --tw-prose-invert-lead: var(--text-primary);
                --tw-prose-invert-links: var(--text-primary);
                --tw-prose-invert-bold: var(--text-primary);
                --tw-prose-invert-counters: var(--text-primary);
                --tw-prose-invert-bullets: var(--text-primary);
                --tw-prose-invert-hr: var(--border-xheavy);
                --tw-prose-invert-quotes: var(--text-primary);
                --tw-prose-invert-quote-borders: #374151;
                --tw-prose-invert-captions: var(--text-secondary);
                --tw-prose-invert-code: var(--text-primary);
                --tw-prose-invert-pre-code: #d1d5db;
                --tw-prose-invert-pre-bg: rgba(0,0,0,.5);
                --tw-prose-invert-th-borders: #4b5563;
                --tw-prose-invert-td-borders: #374151;
                word-wrap: break-word;
                --tw-prose-body: var(--tw-prose-invert-body);
                --tw-prose-headings: var(--tw-prose-invert-headings);
                --tw-prose-lead: var(--tw-prose-invert-lead);
                --tw-prose-links: var(--tw-prose-invert-links);
                --tw-prose-bold: var(--tw-prose-invert-bold);
                --tw-prose-counters: var(--tw-prose-invert-counters);
                --tw-prose-bullets: var(--tw-prose-invert-bullets);
                --tw-prose-hr: var(--tw-prose-invert-hr);
                --tw-prose-quotes: var(--tw-prose-invert-quotes);
                --tw-prose-quote-borders: var(--tw-prose-invert-quote-borders);
                --tw-prose-captions: var(--tw-prose-invert-captions);
                --tw-prose-code: var(--tw-prose-invert-code);
                --tw-prose-pre-code: var(--tw-prose-invert-pre-code);
                --tw-prose-pre-bg: var(--tw-prose-invert-pre-bg);
                --tw-prose-th-borders: var(--tw-prose-invert-th-borders);
                --tw-prose-td-borders: var(--tw-prose-invert-td-borders);
                --text-primary: var(--gray-100);
                --text-secondary: var(--gray-300);
                --text-tertiary: var(--gray-400);
                --text-quaternary: var(--gray-500);
                --text-error: var(--red-500);
                --border-light: hsla(0,0%,100%,.1);
                --border-medium: hsla(0,0%,100%,.15);
                --border-heavy: hsla(0,0%,100%,.2);
                --border-xheavy: hsla(0,0%,100%,.25);
                --main-surface-primary: var(--gray-800);
                --main-surface-secondary: var(--gray-750);
                --main-surface-tertiary: var(--gray-700);
                --sidebar-surface-primary: var(--gray-900);
                --sidebar-surface-secondary: var(--gray-800);
                --sidebar-surface-tertiary: var(--gray-750);
                --link: #7ab7ff;
                --link-hover: #5e83b3;
                --tw-bg-opacity: 1;
                border: 0 solid #e3e3e3;
                box-sizing: border-box;
                --tw-border-spacing-x: 0;
                --tw-border-spacing-y: 0;
                --tw-translate-x: 0;
                --tw-translate-y: 0;
                --tw-rotate: 0;
                --tw-skew-x: 0;
                --tw-skew-y: 0;
                --tw-scale-x: 1;
                --tw-scale-y: 1;
                --tw-pan-x: ;
                --tw-pan-y: ;
                --tw-pinch-zoom: ;
                --tw-scroll-snap-strictness: proximity;
                --tw-gradient-from-position: ;
                --tw-gradient-via-position: ;
                --tw-gradient-to-position: ;
                --tw-ordinal: ;
                --tw-slashed-zero: ;
                --tw-numeric-figure: ;
                --tw-numeric-spacing: ;
                --tw-numeric-fraction: ;
                --tw-ring-inset: ;
                --tw-ring-offset-width: 0px;
                --tw-ring-offset-color: #fff;
                --tw-ring-color: rgba(69,89,164,.5);
                --tw-ring-offset-shadow: 0 0 transparent;
                --tw-ring-shadow: 0 0 transparent;
                --tw-shadow: 0 0 transparent;
                --tw-shadow-colored: 0 0 transparent;
                --tw-blur: ;
                --tw-brightness: ;
                --tw-contrast: ;
                --tw-grayscale: ;
                --tw-hue-rotate: ;
                --tw-invert: ;
                --tw-saturate: ;
                --tw-sepia: ;
                --tw-drop-shadow: ;
                --tw-backdrop-blur: ;
                --tw-backdrop-brightness: ;
                --tw-backdrop-contrast: ;
                --tw-backdrop-grayscale: ;
                --tw-backdrop-hue-rotate: ;
                --tw-backdrop-invert: ;
                --tw-backdrop-opacity: ;
                --tw-backdrop-saturate: ;
                --tw-backdrop-sepia: ;
                --tw-contain-size: ;
                --tw-contain-layout: ;
                --tw-contain-paint: ;
                --tw-contain-style: ;
                font-feature-settings: inherit;
                color: rgba(155, 155, 155, 0.8); /* Greyer font color with some transparency */
                font-family: inherit;
                font-size: 0.8rem; /* Smaller font size */
                font-variation-settings: inherit;
                font-weight: inherit;
                letter-spacing: inherit;
                line-height: inherit;
                margin: 0;
                padding: 0;
                text-transform: none;
                -webkit-appearance: button;
                background-color: transparent;
                background-image: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                gap: .25rem;
            `;
            buttonElement.style.pointerEvents = 'auto';

            // SVG and text for the button
            const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
            svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
            svgElement.setAttribute('width', '24');
            svgElement.setAttribute('height', '24');
            svgElement.setAttribute('fill', 'none');
            svgElement.setAttribute('viewBox', '0 0 24 24');
            svgElement.setAttribute('class', 'icon-sm');

            const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathElement.setAttribute('fill', 'currentColor');
            pathElement.setAttribute('fill-rule', 'evenodd');
            pathElement.setAttribute('d', 'M7 5a3 3 0 0 1 3-3h9a3 3 0 0 1 3 3v9a3 3 0 0 1-3 3h-2v2a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3v-9a3 3 0 0 1 3-3h2zm2 2h5a3 3 0 0 1 3 3v5h2a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1h-9a1 1 0 0 0-1 1zM5 9a1 1 0 0 0-1 1v9a1 1 0 0 0 1 1h9a1 1 0 0 0 1-1v-9a1 1 0 0 0-1-1z');
            pathElement.setAttribute('clip-rule', 'evenodd');

            svgElement.appendChild(pathElement);
            buttonElement.appendChild(svgElement);

            const tickSVG = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="icon-sm">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M18.0633 5.67375C18.5196 5.98487 18.6374 6.607 18.3262 7.06331L10.8262 18.0633C10.6585 18.3093 10.3898 18.4678 10.0934 18.4956C9.79688 18.5234 9.50345 18.4176 9.29289 18.2071L4.79289 13.7071C4.40237 13.3166 4.40237 12.6834 4.79289 12.2929C5.18342 11.9023 5.81658 11.9023 6.20711 12.2929L9.85368 15.9394L16.6738 5.93664C16.9849 5.48033 17.607 5.36263 18.0633 5.67375Z" fill="currentColor"></path>
                </svg>`;

            // Add the click event to the copy button
            buttonElement.addEventListener('click', () => {
                const code = codeBlock.querySelector('code').innerText;
                navigator.clipboard.writeText(code).then(() => {
                    buttonElement.innerHTML = tickSVG;
                    setTimeout(() => {
                        buttonElement.innerHTML = '';
                        buttonElement.appendChild(svgElement);
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });

            // Append the span and button to the container
            spanElement.appendChild(buttonElement);
            copyButtonContainer.appendChild(spanElement);

            // Append the copy button container to the code block
            codeBlock.style.position = 'relative';
            codeBlock.appendChild(copyButtonContainer);
        });
    }

    // Run the function on page load
    addBottomCopyButtons();

    // Create a MutationObserver to detect changes in the DOM
    const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                addBottomCopyButtons();
            }
        }
    });

    // Start observing the body for changes
    observer.observe(document.body, { childList: true, subtree: true });
})();
