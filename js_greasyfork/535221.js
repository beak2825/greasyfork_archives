// ==UserScript==
// @name         PerplexityTools - Floating Copy Button For Code (AFU IT)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds copy button for make copying code easier
// @author       AFU IT
// @match        https://www.perplexity.ai/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535221/PerplexityTools%20-%20Floating%20Copy%20Button%20For%20Code%20%28AFU%20IT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535221/PerplexityTools%20-%20Floating%20Copy%20Button%20For%20Code%20%28AFU%20IT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CHECK_INTERVAL = 2000; // Check every 2 seconds

    // Function to remove existing arrow buttons
    function removeArrowButtons() {
        // Find all buttons with the specific styling and SVG content
        const buttons = document.querySelectorAll('button[style*="position: sticky"][style*="top: 95px"]');

        buttons.forEach(button => {
            const svg = button.querySelector('svg');
            if (svg) {
                const path = svg.querySelector('path');
                if (path) {
                    const pathData = path.getAttribute('d');
                    // Check for up arrow path (M12 19V5M5 12l7-7 7 7)
                    // or down arrow path (M12 5v14M5 12l7 7 7-7)
                    if (pathData === 'M12 19V5M5 12l7-7 7 7' || pathData === 'M12 5v14M5 12l7 7 7-7') {
                        button.remove();
                    }
                }
            }
        });
    }

    // Floating copy button functionality
    function addFloatingButtons() {
        // First remove any existing arrow buttons
        removeArrowButtons();

        // Find all pre elements that don't already have our buttons
        const codeBlocks = document.querySelectorAll('pre:not(.buttons-added)');

        codeBlocks.forEach(block => {
            // Mark this block as processed
            block.classList.add('buttons-added');

            // Create the copy button with Perplexity's styling
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'focus-visible:bg-offsetPlus dark:focus-visible:bg-offsetPlusDark hover:bg-offsetPlus text-textOff dark:text-textOffDark hover:text-textMain dark:hover:bg-offsetPlusDark dark:hover:text-textMainDark font-sans focus:outline-none outline-none outline-transparent transition duration-300 ease-out font-sans select-none items-center relative group/button justify-center text-center items-center rounded-full cursor-pointer active:scale-[0.97] active:duration-150 active:ease-outExpo origin-center whitespace-nowrap inline-flex text-sm h-8 aspect-square';
            copyBtn.style.cssText = `
                position: sticky;
                top: 95px;
                right: 40px;
                float: right;
                z-index: 100;
                margin-right: 5px;
            `;

            copyBtn.innerHTML = `
                <div class="flex items-center min-w-0 font-medium gap-1.5 justify-center">
                    <div class="flex shrink-0 items-center justify-center size-4">
                        <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="copy" class="svg-inline--fa fa-copy fa-fw fa-1x" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                            <path fill="currentColor" d="M384 336l-192 0c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l140.1 0L400 115.9 400 320c0 8.8-7.2 16-16 16zM192 384l192 0c35.3 0 64-28.7 64-64l0-204.1c0-12.7-5.1-24.9-14.1-33.9L366.1 14.1c-9-9-21.2-14.1-33.9-14.1L192 0c-35.3 0-64 28.7-64 64l0 256c0 35.3 28.7 64 64 64zM64 128c-35.3 0-64 28.7-64 64L0 448c0 35.3 28.7 64 64 64l192 0c35.3 0 64-28.7 64-64l0-32-48 0 0 32c0 8.8-7.2 16-16 16L64 464c-8.8 0-16-7.2-16-16l0-256c0-8.8 7.2-16 16-16l32 0 0-48-32 0z"></path>
                        </svg>
                    </div>
                </div>
            `;

            copyBtn.addEventListener('click', () => {
                const code = block.querySelector('code').innerText;
                navigator.clipboard.writeText(code);

                // Visual feedback
                const originalHTML = copyBtn.innerHTML;
                copyBtn.innerHTML = `
                    <div class="flex items-center min-w-0 font-medium gap-1.5 justify-center">
                        <div class="flex shrink-0 items-center justify-center size-4">
                            <svg aria-hidden="true" focusable="false" data-prefix="far" data-icon="check" class="svg-inline--fa fa-check" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
                                <path fill="currentColor" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"></path>
                            </svg>
                        </div>
                    </div>
                `;

                setTimeout(() => {
                    copyBtn.innerHTML = originalHTML;
                }, 2000);
            });

            // Insert only the copy button at the beginning of the pre element
            block.insertBefore(copyBtn, block.firstChild);
        });
    }

    // Function to periodically check for new code blocks and remove arrow buttons
    function checkForCodeBlocks() {
        removeArrowButtons(); // Remove arrow buttons first
        addFloatingButtons();
    }

    // Initial setup
    function init() {
        // Set up interval for checking code blocks and removing arrow buttons
        setInterval(checkForCodeBlocks, CHECK_INTERVAL);

        // Initial check for code blocks
        setTimeout(checkForCodeBlocks, 1000);
    }

    // Initialize
    init();

    // Listen for URL changes (for single-page apps)
    let lastUrl = window.location.href;
    new MutationObserver(() => {
        if (lastUrl !== window.location.href) {
            lastUrl = window.location.href;
            setTimeout(() => {
                removeArrowButtons();
                addFloatingButtons();
            }, 1000); // Check after URL change
        }
    }).observe(document, { subtree: true, childList: true });

    // Also observe for any new buttons being added to the DOM
    new MutationObserver(() => {
        removeArrowButtons();
    }).observe(document.body, {
        childList: true,
        subtree: true
    });
})();
