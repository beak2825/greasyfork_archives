// ==UserScript==
// @name         HumanizeAI Bypass
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Bypass character limits, enable disabled features, and quickly remove unwanted elements on HumanizeAI
// @author       nxvvvv(github.com/nxvvvv)
// @license      agpl-3.0
// @match        https://www.humanizeai.io/*
// @match        https://humanizeai.io/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/537886/HumanizeAI%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/537886/HumanizeAI%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Elements to remove based on CTRE export + additional elements
    const elementsToRemove = [
        '.w3-top',
        'div:nth-child(3) > div > div:nth-child(3)',
        '.offer-bar',
        '.w3-row > div > .w3-hide-small',
        '.h1',
        'div:nth-child(1) > .w3-center:nth-child(2)',
        '.header',
        '.details > p',
        '.hero-container:nth-child(1)',
        '.center-section',
        '.w3-white:nth-child(3)',
        '.w3-black:nth-child(4)',
        '.w3-container:nth-child(5)',
        '.w3-black:nth-child(6)',
        '.w3-light-gray:nth-child(4)',
        '.w3-blue',
        '.w3-center:nth-child(4)',
        '.w3-center:nth-child(8)',
        '.w3-padding-16',
        '.w3-padding-8 .w3-text-black',
        // Additional selectors for missed elements
        '.w3-center h2.heading_h22',
        '.w3-center .w3-tag.w3-white.w3-round-xxlarge',
        '.w3-center h2:contains("Humanize AI Text")',
        'h2[class*="heading_h22"]'
    ];

    // CSS to hide elements immediately
    const hideElementsCSS = `
        <style id="humanizeai-hide">
            .w3-top,
            div:nth-child(3) > div > div:nth-child(3),
            .offer-bar,
            .w3-row > div > .w3-hide-small,
            .h1,
            div:nth-child(1) > .w3-center:nth-child(2),
            .header,
            .details > p,
            .hero-container:nth-child(1),
            .center-section,
            .w3-white:nth-child(3),
            .w3-black:nth-child(4),
            .w3-container:nth-child(5),
            .w3-black:nth-child(6),
            .w3-light-gray:nth-child(4),
            .w3-blue,
            .w3-center:nth-child(4),
            .w3-center:nth-child(8),
            .w3-padding-16,
            .w3-padding-8 .w3-text-black,
            .w3-center h2.heading_h22,
            .w3-center .w3-tag.w3-white.w3-round-xxlarge,
            h2[class*="heading_h22"],
            div[style*="margin-bottom: 42px"] {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
            }
        </style>
    `;

    // Inject CSS immediately to hide elements
    function injectHideCSS() {
        if (!document.getElementById('humanizeai-hide')) {
            document.head.insertAdjacentHTML('beforeend', hideElementsCSS);
            console.log('HumanizeAI Bypass: CSS injected to hide elements');
        }
    }

    // Inject CSS as early as possible
    if (document.head) {
        injectHideCSS();
    } else {
        const headObserver = new MutationObserver((mutations, observer) => {
            if (document.head) {
                injectHideCSS();
                observer.disconnect();
            }
        });
        headObserver.observe(document.documentElement, { childList: true, subtree: true });
    }

    // Function to set cookie safely
    function setCookie(name, value, days = 365) {
        try {
            const expires = new Date();
            expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
            const cookieString = `${name}=${value};expires=${expires.toUTCString()};path=/`;
            document.cookie = cookieString;
            console.log(`HumanizeAI Bypass: Set ${name} cookie`);
        } catch (e) {
            console.log('HumanizeAI Bypass: Cookie setting failed');
        }
    }

    // Function to remove lock emojis from text
    function removeLockEmojis(text) {
        if (!text) return text;
        return text.replace(/🔒/g, '').trim();
    }

    // Function to remove unwanted elements (fast version)
    function removeUnwantedElements() {
        try {
            let removedCount = 0;

            // Remove elements based on CTRE selectors
            elementsToRemove.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element && element.parentNode) {
                        element.remove();
                        removedCount++;
                    }
                });
            });

            // Remove elements containing specific text
            const textBasedSelectors = [
                'h2:contains("Humanize AI Text")',
                'h2:contains("#1 AI Humanizer")'
            ];

            // Since CSS :contains() doesn't work in querySelectorAll, check manually
            const allH2s = document.querySelectorAll('h2');
            allH2s.forEach(h2 => {
                if (h2.textContent.includes('Humanize AI Text') ||
                    h2.textContent.includes('#1 AI Humanizer') ||
                    h2.classList.contains('heading_h22')) {
                    h2.closest('.w3-center')?.remove() || h2.remove();
                    removedCount++;
                }
            });

            // Remove specific div with margin-bottom: 42px and &nbsp;
            const spacerDivs = document.querySelectorAll('div[style*="margin-bottom"]');
            spacerDivs.forEach(div => {
                if (div.innerHTML.includes('&nbsp;') || div.textContent.trim() === '') {
                    div.remove();
                    removedCount++;
                }
            });

            // Remove any divs that only contain &nbsp;
            const nbspDivs = document.querySelectorAll('div');
            nbspDivs.forEach(div => {
                if ((div.innerHTML.trim() === '&nbsp;' || div.innerHTML.trim() === '') &&
                    div.children.length === 0) {
                    div.remove();
                    removedCount++;
                }
            });

            if (removedCount > 0) {
                console.log(`HumanizeAI Bypass: Removed ${removedCount} unwanted elements`);
            }

        } catch (e) {
            console.log('HumanizeAI Bypass: Element removal failed:', e);
        }
    }

    // Set the clickCount cookie immediately
    setCookie('clickCount', '-1000');

    // Function to enable features safely
    function enableFeatures() {
        try {
            // Remove disabled attributes from buttons
            const disabledButtons = document.querySelectorAll('button[disabled]');
            disabledButtons.forEach(button => {
                button.removeAttribute('disabled');
                button.style.opacity = '1';
                button.style.cursor = 'pointer';

                // Remove lock emojis from button text
                if (button.textContent) {
                    button.innerHTML = removeLockEmojis(button.innerHTML);
                }
            });

            // Remove disabled attributes from select options
            const disabledOptions = document.querySelectorAll('select option[disabled]');
            disabledOptions.forEach(option => {
                option.removeAttribute('disabled');

                // Remove lock emojis from option text
                if (option.textContent) {
                    option.textContent = removeLockEmojis(option.textContent);
                }
            });

            // Remove disabled attributes from inputs
            const disabledInputs = document.querySelectorAll('input[disabled]');
            disabledInputs.forEach(input => {
                input.removeAttribute('disabled');
            });

            // Update character count display
            const charCountElement = document.getElementById('charCount');
            if (charCountElement) {
                charCountElement.textContent = '0/999999 CHARS ~ 0/999999 WORDS';
            }

            // Increase maxlength on textareas
            const textareas = document.querySelectorAll('textarea[maxlength]');
            textareas.forEach(textarea => {
                textarea.setAttribute('maxlength', '999999');
            });

            // Remove lock emojis from all text content
            const elementsWithLocks = document.querySelectorAll('*');
            elementsWithLocks.forEach(element => {
                if (element.children.length === 0 && element.textContent && element.textContent.includes('🔒')) {
                    element.textContent = removeLockEmojis(element.textContent);
                }
            });

            // Remove lock emojis from tooltips
            const tooltips = document.querySelectorAll('.tooltip-text');
            tooltips.forEach(tooltip => {
                if (tooltip.innerHTML) {
                    tooltip.innerHTML = removeLockEmojis(tooltip.innerHTML);
                }
            });

            // Remove unwanted elements
            removeUnwantedElements();

        } catch (e) {
            console.log('HumanizeAI Bypass: Feature enabling failed:', e);
        }
    }

    // Function to override character counting
    function overrideFunctions() {
        try {
            // Override character count function if it exists
            if (window.updateCharWordCount) {
                window.updateCharWordCount = function() {
                    const inputText = document.getElementById('inputText');
                    const charCount = document.getElementById('charCount');
                    if (inputText && charCount) {
                        const text = inputText.value;
                        const charLength = text.length;
                        const wordLength = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
                        charCount.textContent = `${charLength}/999999 CHARS ~ ${wordLength}/999999 WORDS`;
                    }
                };
            }

            // Override selectOption function if it exists
            if (window.selectOption) {
                const originalSelectOption = window.selectOption;
                window.selectOption = function(button) {
                    // Remove active class from all buttons
                    const buttons = document.querySelectorAll('.option-button');
                    buttons.forEach(btn => btn.classList.remove('active'));
                    // Add active class to clicked button
                    button.classList.add('active');

                    // Call original function if it exists
                    if (typeof originalSelectOption === 'function') {
                        try {
                            originalSelectOption.call(this, button);
                        } catch (e) {
                            console.log('Original selectOption failed, using bypass');
                        }
                    }
                };
            }
        } catch (e) {
            console.log('HumanizeAI Bypass: Function override failed:', e);
        }
    }

    // Fast initialization
    function fastInit() {
        removeUnwantedElements();
        enableFeatures();
        overrideFunctions();
    }

    // Multiple initialization attempts for speed
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', fastInit);
        // Also try earlier
        setTimeout(fastInit, 100);
        setTimeout(fastInit, 300);
    } else {
        fastInit();
    }

    // Set up mutation observer for dynamic content (optimized)
    let observerTimeout;
    const observer = new MutationObserver(function(mutations) {
        clearTimeout(observerTimeout);
        observerTimeout = setTimeout(() => {
            let shouldUpdate = false;
            let shouldRemoveElements = false;

            mutations.forEach(function(mutation) {
                if (mutation.addedNodes.length > 0) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) { // Element node
                            // Check for elements that need bypass
                            if (node.querySelector && (
                                node.querySelector('button[disabled]') ||
                                node.querySelector('option[disabled]') ||
                                node.querySelector('input[disabled]') ||
                                node.textContent.includes('🔒')
                            )) {
                                shouldUpdate = true;
                            }

                            // Check for unwanted elements (faster check)
                            if (node.classList && (
                                node.classList.contains('w3-top') ||
                                node.classList.contains('offer-bar') ||
                                node.classList.contains('hero-container') ||
                                node.classList.contains('center-section') ||
                                node.classList.contains('heading_h22') ||
                                (node.tagName === 'H2' && node.textContent.includes('Humanize AI'))
                            )) {
                                shouldRemoveElements = true;
                            }
                        }
                    });
                }
            });

            if (shouldUpdate) {
                enableFeatures();
            }

            if (shouldRemoveElements) {
                removeUnwantedElements();
            }
        }, 50); // Faster response time
    });

    // Start observing when DOM is ready
    setTimeout(() => {
        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    }, 100);

    // Aggressive cleanup for first few seconds
    const aggressiveCleanup = setInterval(() => {
        removeUnwantedElements();
        setCookie('clickCount', '-1000');
    }, 1000);

    // Stop aggressive cleanup after 10 seconds
    setTimeout(() => {
        clearInterval(aggressiveCleanup);
    }, 10000);

    // Regular maintenance (less frequent)
    setInterval(() => {
        setCookie('clickCount', '-1000');

        // Only check critical elements
        const charCount = document.getElementById('charCount');
        if (charCount && charCount.textContent.includes('1500')) {
            charCount.textContent = charCount.textContent.replace('1500', '999999').replace('250', '999999');
        }

        // Light cleanup
        removeUnwantedElements();
    }, 15000);

    // Clean up on page unload
    window.addEventListener('beforeunload', () => {
        if (observer) {
            observer.disconnect();
        }
    });

    console.log('HumanizeAI Bypass: Fast removal script loaded successfully');
})();