// ==UserScript==
// @name         Grok Theme Toggle
// @namespace    nisc
// @version      2025.06.24-A
// @description  Adds a Light/Dark mode toggle at the bottom left
// @homepageURL  https://github.com/nisc/grok-userscripts/
// @author       nisc
// @match        https://grok.com/*
// @icon         https://grok.com/images/favicon-light.png
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/538662/Grok%20Theme%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/538662/Grok%20Theme%20Toggle.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const CONFIG = {
        THEME: {
            KEY: 'forcedTheme',
            MODES: {
                DARK: 'dark',
                LIGHT: 'light'
            },
            DEFAULT: 'dark',
            COLORS: {
                dark: { bg: 'var(--surface-l4, #3c3c3c)', text: 'var(--fg-primary, #fff)', border: 'var(--border-l1, #444)' },
                light: { bg: 'var(--surface-l4, #f8f8f8)', text: 'var(--fg-primary, #000)', border: 'var(--border-l1, #ddd)' }
            },
            ICONS: {
                dark: '🌕',
                light: '🌑'
            }
        },
        UI: {
            POSITION_MARGIN: 20,
            BUTTON_STYLES: {
                position: 'fixed',
                zIndex: '40',
                width: '36px',
                height: '36px',
                padding: '4px',
                border: '1px solid var(--border-color, #333)',
                borderRadius: '50%',
                cursor: 'pointer',
                fontSize: '12px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
                transition: 'all 0.15s ease',
                userSelect: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            },
            LIGHT_MODE_STYLES: `
                .light .text-xs.font-semibold {
                    color: #000 !important;
                }
            `
        }
    };

    // Track current theme state
    let currentTheme = localStorage.getItem(CONFIG.THEME.KEY) || CONFIG.THEME.DEFAULT;

    /**
     * Applies theme to document root only if it differs from current state
     * Handles both class names and color-scheme property
     */
    function applyTheme(theme) {
        const htmlElement = document.documentElement;
        const isDark = htmlElement.classList.contains(CONFIG.THEME.MODES.DARK);
        const isLight = htmlElement.classList.contains(CONFIG.THEME.MODES.LIGHT);

        if (theme === CONFIG.THEME.MODES.DARK && !isDark) {
            htmlElement.classList.add(CONFIG.THEME.MODES.DARK);
            htmlElement.classList.remove(CONFIG.THEME.MODES.LIGHT);
            htmlElement.style.setProperty('color-scheme', CONFIG.THEME.MODES.DARK, 'important');
        } else if (theme === CONFIG.THEME.MODES.LIGHT && !isLight) {
            htmlElement.classList.add(CONFIG.THEME.MODES.LIGHT);
            htmlElement.classList.remove(CONFIG.THEME.MODES.DARK);
            htmlElement.style.setProperty('color-scheme', CONFIG.THEME.MODES.LIGHT, 'important');
        }
    }

    // Create and inject custom style element
    const styleElement = document.createElement('style');
    document.head.appendChild(styleElement);

    /**
     * Updates custom styles based on current theme
     * Primarily handles special cases for light mode
     */
    function updateStyles(theme) {
        styleElement.textContent = theme === CONFIG.THEME.MODES.LIGHT ? CONFIG.UI.LIGHT_MODE_STYLES : '';
    }

    /**
     * Toggles between light and dark themes
     * Updates localStorage, applies theme, and updates UI
     */
    function toggleTheme() {
        currentTheme = currentTheme === CONFIG.THEME.MODES.DARK ?
            CONFIG.THEME.MODES.LIGHT : CONFIG.THEME.MODES.DARK;
        localStorage.setItem(CONFIG.THEME.KEY, currentTheme);
        applyTheme(currentTheme);
        updateStyles(currentTheme);
        updateButtonAppearance();
    }

    /**
     * Updates toggle button appearance based on current theme
     * Changes icon, background, text, and border colors
     */
    function updateButtonAppearance() {
        const themeColors = CONFIG.THEME.COLORS[currentTheme];
        toggleButton.textContent = CONFIG.THEME.ICONS[currentTheme];
        toggleButton.style.backgroundColor = themeColors.bg;
        toggleButton.style.color = themeColors.text;
        toggleButton.style.borderColor = themeColors.border;
    }

    // Create and configure theme toggle button
    const toggleButton = document.createElement('button');
    Object.assign(toggleButton.style, CONFIG.UI.BUTTON_STYLES);
    updateButtonAppearance();

    // Add hover effects
    toggleButton.addEventListener('mouseenter', () => {
        toggleButton.style.transform = 'scale(1.1)';
        toggleButton.style.boxShadow = '0 6px 16px rgba(0,0,0,0.4)';
    });
    toggleButton.addEventListener('mouseleave', () => {
        toggleButton.style.transform = 'scale(1)';
        toggleButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
    });

    toggleButton.addEventListener('click', toggleTheme);
    document.body.appendChild(toggleButton);

    // Function to update position based on JX button location
    function updatePositionRelativeToJX() {
        const jxButton = document.querySelector('button[id^="radix-"] span span[class*="bg-surface-l4"]')?.closest('div.absolute');
        if (jxButton) {
            const jxRect = jxButton.getBoundingClientRect();
            const jxLeft = jxRect.left;
            const jxBottom = window.innerHeight - jxRect.bottom;

            // Position our button above JX button with 10px gap
            toggleButton.style.left = `${jxLeft + 2}px`; // Center align (36px vs 40px = 2px offset)
            toggleButton.style.bottom = `${jxBottom + jxRect.height + 10}px`;
        } else {
            // Fallback position if JX button not found
            toggleButton.style.left = '8px';
            toggleButton.style.bottom = '100px';
        }
    }

    // Initial positioning
    updatePositionRelativeToJX();

    // Initialize theme
    applyTheme(currentTheme);
    updateStyles(currentTheme);

    // Watch for external theme changes and maintain chosen theme
    const themeObserver = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'attributes' &&
                (mutation.attributeName === 'class' || mutation.attributeName === 'style')) {
                applyTheme(currentTheme);
            }
        });
    });

    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['class', 'style']
    });

    // Throttle position updates to prevent infinite loops
    let positionUpdateTimeout;
    function throttledPositionUpdate() {
        if (positionUpdateTimeout) return;
        positionUpdateTimeout = setTimeout(() => {
            updatePositionRelativeToJX();
            positionUpdateTimeout = null;
        }, 16); // ~60fps for smoother following
    }

    // Watch for JX button movement and follow it
    const positionObserver = new MutationObserver((mutations) => {
        // Only update if mutations don't involve our theme button
        const shouldUpdate = mutations.some(mutation => {
            return mutation.target !== toggleButton &&
                !toggleButton.contains(mutation.target);
        });

        if (shouldUpdate) {
            throttledPositionUpdate();
        }
    });

    // Observe for JX button changes with broader scope
    positionObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    // Also update position on window events
    window.addEventListener('resize', throttledPositionUpdate);
    window.addEventListener('scroll', throttledPositionUpdate, { passive: true });
})();