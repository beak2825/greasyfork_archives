// ==UserScript==
// @name         Mammouth.ai Floating Scroll Buttons
// @name:en      Mammouth.ai Floating Scroll Buttons
// @name:es      Botones flotantes de desplazamiento para Mammouth.ai
// @namespace    http://violentmonkey.github.io/
// @version      4.0.0
// @description  Ajoute des boutons flottants pour défiler vers le bas du chat et activer/désactiver l'auto-scroll.
// @description:en Adds floating buttons to scroll to the bottom of the chat and toggle auto-scroll.
// @description:es Añade botones flotantes para desplazarse al final del chat y activar/desactivar el auto-scroll.
// @author       AI Script Assistant
// @match        https://mammouth.ai/app/*
// @match        https://mammouth.ai/*
// @grant        none
// @license      MIT
// @compatible   firefox Violentmonkey
// @compatible   chrome Violentmonkey
// @downloadURL https://update.greasyfork.org/scripts/530166/Mammouthai%20Floating%20Scroll%20Buttons.user.js
// @updateURL https://update.greasyfork.org/scripts/530166/Mammouthai%20Floating%20Scroll%20Buttons.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * Localization dictionary for UI strings.
     * Provides translations for button tooltips in multiple languages.
     * @type {Object}
     */
    const locales = {
        en: {
            scrollButton: "Scroll to bottom",
            autoScrollButton: "Toggle auto-scroll",
        },
        fr: {
            scrollButton: "Défiler vers le bas",
            autoScrollButton: "Activer/désactiver le suivi automatique",
        },
        es: {
            scrollButton: "Desplazarse al final",
            autoScrollButton: "Activar/desactivar auto-scroll",
        },
    };

    // Detect user's browser language and fallback to English.
    const userLang = (navigator.language || navigator.userLanguage || "en")
        .toLowerCase()
        .slice(0, 2);
    const messages = locales[userLang] || locales["en"];

    // State variables to track scroll behavior and elements
    let autoScrollActive = true;                // Auto-scroll is enabled by default
    let scrollableElement = null;               // Reference to the scrollable container
    let scrollInterval = null;                  // Interval for checking new content
    let lastScrollHeight = 0;                   // Track content height changes

    /**
     * Creates and injects CSS styles for the floating buttons.
     * Styles are designed to ensure buttons are visible and accessible.
     */
    function injectStyles() {
        // Check if styles are already injected
        if (document.getElementById('mammouth-scroll-styles')) {
            return;
        }

        const style = document.createElement('style');
        style.id = 'mammouth-scroll-styles';
        style.textContent = `
            /* Container for floating buttons */
            #mammouth-floating-buttons {
                position: fixed;
                bottom: 20px;
                right: 20px;
                display: flex;
                flex-direction: column;
                gap: 10px;
                z-index: 9999;
            }
            
            /* Individual button styling */
            .mammouth-floating-button {
                width: 42px;
                height: 42px;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.9);
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
                border: none;
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                transition: transform 0.2s, background-color 0.2s;
            }
            
            /* Hover effect */
            .mammouth-floating-button:hover {
                transform: scale(1.1);
            }
            
            /* Icon styling */
            .mammouth-floating-button svg {
                width: 24px;
                height: 24px;
                color: #555;
            }
            
            /* Active state for auto-scroll button */
            #auto-scroll-button.active {
                background-color: #2eae66;
            }
            
            #auto-scroll-button.active svg {
                color: white;
            }
        `;
        document.head.appendChild(style);
        console.log('[Mammouth Scroll] Styles injected');
    }

    /**
     * Creates the floating buttons and adds them to the document.
     * Buttons are positioned in the bottom-right corner of the viewport.
     */
    function createFloatingButtons() {
        // Check if buttons already exist to avoid duplicates
        if (document.getElementById('mammouth-floating-buttons')) {
            return;
        }

        // Create container for floating buttons
        const container = document.createElement('div');
        container.id = 'mammouth-floating-buttons';

        // Create scroll down button
        const scrollButton = document.createElement('button');
        scrollButton.className = 'mammouth-floating-button';
        scrollButton.id = 'scroll-button';
        scrollButton.title = messages.scrollButton;
        scrollButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
        `;
        scrollButton.addEventListener('click', scrollToBottom);

        // Create auto-scroll toggle button
        const autoScrollButton = document.createElement('button');
        autoScrollButton.className = 'mammouth-floating-button';
        autoScrollButton.id = 'auto-scroll-button';
        autoScrollButton.title = messages.autoScrollButton;
        autoScrollButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"></path>
            </svg>
        `;
        autoScrollButton.addEventListener('click', toggleAutoScroll);
        
        // Set initial active state
        if (autoScrollActive) {
            autoScrollButton.classList.add('active');
        }

        // Add buttons to container
        container.appendChild(autoScrollButton);
        container.appendChild(scrollButton);

        // Add container to document body
        document.body.appendChild(container);
        
        console.log('[Mammouth Scroll] Floating buttons created');
    }

    /**
     * Finds the scrollable element containing the chat messages.
     * Uses multiple strategies to identify the correct element.
     * @returns {Element|null} - The scrollable element or null if not found
     */
    function findScrollableElement() {
        console.log('[Mammouth Scroll] Searching for scrollable element...');
        
        // Strategy 1: Find all visible scrollable elements
        const allElements = document.querySelectorAll('*');
        const candidates = [];
        
        for (const element of allElements) {
            const style = window.getComputedStyle(element);
            // Look for elements that are scrollable and tall enough to be a chat container
            if ((style.overflowY === 'auto' || style.overflowY === 'scroll') && 
                element.scrollHeight > element.clientHeight &&
                element.clientHeight > 200) {
                candidates.push({
                    element,
                    height: element.clientHeight,
                    scrollHeight: element.scrollHeight
                });
            }
        }
        
        // Sort candidates by scroll height (largest first)
        candidates.sort((a, b) => b.scrollHeight - a.scrollHeight);
        
        if (candidates.length > 0) {
            console.log('[Mammouth Scroll] Found scrollable candidates:', candidates);
            return candidates[0].element;
        }
        
        // Strategy 2: Try specific selectors that might match the chat container
        const specificSelectors = [
            'main .overflow-y-auto',
            '.conversation-container',
            '[role="log"]',
            '.messages-container',
            '.overflow-y-auto',
            '.scrollable'
        ];
        
        for (const selector of specificSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                console.log(`[Mammouth Scroll] Found element with selector "${selector}":`, element);
                return element;
            }
        }
        
        console.log('[Mammouth Scroll] No scrollable element found');
        return null;
    }

    /**
     * Scrolls the chat element to the bottom.
     */
    function scrollToBottom() {
        if (scrollableElement) {
            scrollableElement.scrollTop = scrollableElement.scrollHeight;
            console.log('[Mammouth Scroll] Scrolled to bottom');
        } else {
            console.log('[Mammouth Scroll] Cannot scroll: no scrollable element found');
        }
    }

    /**
     * Toggles auto-scroll on and off.
     * Updates button appearance to reflect current state.
     */
    function toggleAutoScroll() {
        autoScrollActive = !autoScrollActive;
        const button = document.getElementById('auto-scroll-button');
        
        if (button) {
            if (autoScrollActive) {
                button.classList.add('active');
                scrollToBottom(); // Scroll immediately when enabling
                console.log('[Mammouth Scroll] Auto-scroll enabled');
            } else {
                button.classList.remove('active');
                console.log('[Mammouth Scroll] Auto-scroll disabled');
            }
        }
    }

    /**
     * Checks for new content and scrolls to the bottom if appropriate.
     * Called periodically to handle new messages.
     */
    function checkScrolling() {
        if (!scrollableElement) {
            // Try to find the scrollable element if we don't have one
            scrollableElement = findScrollableElement();
            return;
        }
        
        const currentScrollHeight = scrollableElement.scrollHeight;
        
        // If content height increased and auto-scroll is active, scroll to bottom
        if (currentScrollHeight > lastScrollHeight && autoScrollActive) {
            scrollToBottom();
        }
        
        lastScrollHeight = currentScrollHeight;
    }

    /**
     * Handles manual scrolling by the user.
     * Disables auto-scroll if user scrolls away from the bottom.
     */
    function handleManualScroll() {
        if (!scrollableElement) return;
        
        // Check if we're near the bottom of the scroll area
        const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
        
        // If user scrolled away from bottom and auto-scroll was active, disable it
        if (!isNearBottom && autoScrollActive) {
            autoScrollActive = false;
            const button = document.getElementById('auto-scroll-button');
            if (button) {
                button.classList.remove('active');
            }
            console.log('[Mammouth Scroll] Auto-scroll disabled due to manual scrolling');
        }
    }

    /**
     * Main initialization function.
     * Sets up the UI elements and event listeners.
     */
    function initialize() {
        console.log('[Mammouth Scroll] Initializing...');
        injectStyles();
        createFloatingButtons();
        
        // Find the scrollable element
        scrollableElement = findScrollableElement();
        
        if (scrollableElement) {
            lastScrollHeight = scrollableElement.scrollHeight;
            // Add event listener for manual scrolling
            scrollableElement.addEventListener('scroll', handleManualScroll);
            console.log('[Mammouth Scroll] Scrollable element initialized:', scrollableElement);
        }
        
        // Set up interval for checking content and scroll state
        if (scrollInterval) clearInterval(scrollInterval);
        scrollInterval = setInterval(checkScrolling, 500);
        
        // Initial scroll to bottom if auto-scroll is enabled
        if (autoScrollActive) {
            setTimeout(scrollToBottom, 1000);
        }
    }

    /**
     * Sets up an observer to watch for DOM changes.
     * Ensures buttons are recreated if removed and handles UI changes.
     */
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            // Check if our buttons were removed
            if (!document.getElementById('mammouth-floating-buttons')) {
                createFloatingButtons();
            }
            
            // Check if the scrollable element has changed
            const newScrollable = findScrollableElement();
            if (newScrollable !== scrollableElement) {
                console.log('[Mammouth Scroll] Scrollable element changed, reinitializing...');
                initialize();
            }
        });
        
        // Monitor the body for structural changes
        observer.observe(document.body, { 
            childList: true, 
            subtree: true,
            attributes: false,
            characterData: false
        });
    }

    // Start the script when the page is ready
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
        setupObserver();
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            initialize();
            setupObserver();
        });
    }

    // Also run after a short delay to ensure dynamic content has loaded
    setTimeout(() => {
        initialize();
        setupObserver();
    }, 2000);
})();
