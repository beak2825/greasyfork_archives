// ==UserScript==
// @name         Perplexity Scroll Buttons (AFU IT)
// @namespace    PerplexityTools
// @version      1.2
// @description  Jumps between Q&A blocks with visual feedback, context-awareness, and easy configuration.
// @author       AFU IT
// @match        https://*.perplexity.ai/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535202/Perplexity%20Scroll%20Buttons%20%28AFU%20IT%29.user.js
// @updateURL https://update.greasyfork.org/scripts/535202/Perplexity%20Scroll%20Buttons%20%28AFU%20IT%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =================================================================================
    // ---
    // --- CONFIGURATION DASHBOARD ---
    // ---
    // =================================================================================
    const config = {
        // --- Colors ---
        colors: {
            active: '#20b8cd', // Main button color
            holding: '#147a8a', // Color when a button is being held down
            disabled: '#777777', // Color for a disabled button (e.g., at top/bottom of page)
        },

        // --- Timings ---
        holdDuration: 300, // Time in ms to distinguish a "click" from a "hold"
        scrollCheckThrottle: 150, // How often (in ms) to check scroll position for context-awareness

        // --- Positions ---
        positions: {
            down: '120px', // Distance from the bottom for the down-arrow button
            up: '162px', // Distance from the bottom for the up-arrow button
            auto: '204px', // Distance from the bottom for the auto-scroll button
            right: '20px', // Distance from the right for all buttons
        },

        // --- Selectors ---
        selectors: {
            scrollContainer: '.scrollable-container.scrollbar-subtle',
            messageBlock: 'div[data-cplx-component="message-block"]', // The target for jumping
        },
    };
    // =================================================================================


    // --- Global State ---
    let autoScrollInterval = null;
    let isAutoScrollEnabled = true;
    let pressTimer = null;


    // --- Core Functions ---

    /**
     * Finds the next/previous message block and scrolls to it.
     * @param {string} direction - 'up' or 'down'.
     * @returns {boolean} - True if a target was found, otherwise false.
     */
    function scrollToBlock(direction) {
        const scrollContainer = document.querySelector(config.selectors.scrollContainer);
        if (!scrollContainer) return false;

        const blocks = Array.from(document.querySelectorAll(config.selectors.messageBlock));
        if (blocks.length === 0) return false;

        const currentScrollTop = scrollContainer.scrollTop;
        let targetBlock = null;

        if (direction === 'down') {
            targetBlock = blocks.find(block => block.offsetTop > currentScrollTop + 10);
        } else {
            targetBlock = blocks.slice().reverse().find(block => block.offsetTop < currentScrollTop - 10);
        }

        if (targetBlock) {
            scrollContainer.scrollTo({ top: targetBlock.offsetTop, behavior: 'smooth' });
            return true;
        }
        return false;
    }

    /**
     * Checks scroll position and enables/disables buttons accordingly.
     */
    function updateButtonStates() {
        const sc = document.querySelector(config.selectors.scrollContainer);
        const topBtn = document.getElementById('scroll-top-btn');
        const bottomBtn = document.getElementById('scroll-bottom-btn');

        if (!sc || !topBtn || !bottomBtn) return;

        const atTop = sc.scrollTop < 10;
        const atBottom = sc.scrollHeight - sc.scrollTop - sc.clientHeight < 10;

        // --- Update Top Button ---
        if (atTop) {
            topBtn.style.backgroundColor = config.colors.disabled;
            topBtn.style.opacity = '0.5';
            topBtn.style.pointerEvents = 'none';
        } else {
            topBtn.style.backgroundColor = config.colors.active;
            topBtn.style.opacity = '1';
            topBtn.style.pointerEvents = 'auto';
        }

        // --- Update Bottom Button ---
        if (atBottom) {
            bottomBtn.style.backgroundColor = config.colors.disabled;
            bottomBtn.style.opacity = '0.5';
            bottomBtn.style.pointerEvents = 'none';
        } else {
            bottomBtn.style.backgroundColor = config.colors.active;
            bottomBtn.style.opacity = '1';
            bottomBtn.style.pointerEvents = 'auto';
        }
    }

    /**
     * Utility to limit how often a function can run.
     */
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }


    /**
     * Creates and adds all the buttons to the page.
     */
    function addScrollButtons() {
        document.getElementById('scroll-bottom-btn')?.remove();
        document.getElementById('scroll-top-btn')?.remove();
        document.getElementById('auto-scroll-btn')?.remove();

        const commonStyle = `position: fixed; right: ${config.positions.right}; width: 32px; height: 32px; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; z-index: 99999; box-shadow: 0 2px 5px rgba(0,0,0,0.2); transition: all 0.2s; user-select: none;`;

        // --- Bottom "Down" Button ---
        const bottomButton = document.createElement('div');
        bottomButton.id = 'scroll-bottom-btn';
        bottomButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M19 12l-7 7-7-7"></path></svg>';
        bottomButton.title = 'Click: Next Question | Hold: Scroll to Bottom';
        bottomButton.style.cssText = `${commonStyle} bottom: ${config.positions.down}; background: ${config.colors.active};`;

        bottomButton.addEventListener('mousedown', function() {
            this.style.backgroundColor = config.colors.holding; // Visual feedback for hold
            pressTimer = setTimeout(() => {
                const sc = document.querySelector(config.selectors.scrollContainer);
                if (sc) sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' });
                pressTimer = null;
            }, config.holdDuration);
        });
        bottomButton.addEventListener('mouseup', function() {
            this.style.backgroundColor = config.colors.active;
            if (pressTimer) {
                clearTimeout(pressTimer);
                if (!scrollToBlock('down')) { // Fallback if no block found
                    const sc = document.querySelector(config.selectors.scrollContainer);
                    if (sc) sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' });
                }
            }
        });
        bottomButton.addEventListener('mouseleave', function() { this.style.backgroundColor = config.colors.active; clearTimeout(pressTimer); });

        // --- Top "Up" Button ---
        const topButton = document.createElement('div');
        topButton.id = 'scroll-top-btn';
        topButton.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"></path></svg>';
        topButton.title = 'Click: Previous Question | Hold: Scroll to Top';
        topButton.style.cssText = `${commonStyle} bottom: ${config.positions.up}; background: ${config.colors.active};`;

        topButton.addEventListener('mousedown', function() {
            this.style.backgroundColor = config.colors.holding;
            pressTimer = setTimeout(() => {
                const sc = document.querySelector(config.selectors.scrollContainer);
                if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
                pressTimer = null;
            }, config.holdDuration);
        });
        topButton.addEventListener('mouseup', function() {
            this.style.backgroundColor = config.colors.active;
            if (pressTimer) {
                clearTimeout(pressTimer);
                if (!scrollToBlock('up')) { // Fallback if no block found
                    const sc = document.querySelector(config.selectors.scrollContainer);
                    if (sc) sc.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }
        });
        topButton.addEventListener('mouseleave', function() { this.style.backgroundColor = config.colors.active; clearTimeout(pressTimer); });

        // --- Auto-Scroll Toggle Button ---
        const autoButton = document.createElement('div');
        autoButton.id = 'auto-scroll-btn';
        autoButton.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="3" width="12" height="18" rx="6" ry="6"></rect><line x1="12" y1="7" x2="12" y2="11"></line></svg>';
        autoButton.title = 'Toggle auto-scroll';
        autoButton.style.cssText = `${commonStyle} bottom: ${config.positions.auto}; background: ${isAutoScrollEnabled ? config.colors.active : config.colors.disabled};`;
        autoButton.addEventListener('click', function() {
            toggleAutoScroll();
            this.style.backgroundColor = isAutoScrollEnabled ? config.colors.active : config.colors.disabled;
        });

        document.body.appendChild(bottomButton);
        document.body.appendChild(topButton);
        document.body.appendChild(autoButton);

        // Set the initial state of the buttons
        updateButtonStates();
    }

    // --- Auto-Scroll & Initialization ---
    function isGenerating() { return !!document.querySelector('button[aria-label="Stop generating response"]'); }
    function autoScrollToBottom() {
        const sc = document.querySelector(config.selectors.scrollContainer);
        if (sc) sc.scrollTo({ top: sc.scrollHeight, behavior: 'smooth' });
    }
    function toggleAutoScroll() {
        isAutoScrollEnabled = !isAutoScrollEnabled;
        isAutoScrollEnabled ? startAutoScroll() : stopAutoScroll();
    }
    function startAutoScroll() {
        if (!autoScrollInterval) autoScrollInterval = setInterval(() => { if (isGenerating()) autoScrollToBottom(); }, 300);
    }
    function stopAutoScroll() {
        if (autoScrollInterval) { clearInterval(autoScrollInterval); autoScrollInterval = null; }
    }
    function initialize() {
        addScrollButtons();
        if (isAutoScrollEnabled) startAutoScroll();

        // Add context-aware scroll listener
        const scrollContainer = document.querySelector(config.selectors.scrollContainer);
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', throttle(updateButtonStates, config.scrollCheckThrottle));
        }

        const observer = new MutationObserver(() => {
            if (!document.getElementById('auto-scroll-btn')) {
                setTimeout(() => {
                    initialize(); // Re-run the whole setup if buttons disappear
                }, 1000);
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // --- Start ---
    if (document.readyState === 'complete') {
        initialize();
    } else {
        window.addEventListener('load', initialize);
    }
})();