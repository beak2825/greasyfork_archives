// ==UserScript==
// @name         Universal Dark Mode
// @namespace    https://github.com/colorBanded
// @version      1.0
// @description  An incredibly crappy implementation of universal dark mode
// @author       Sam Padilla
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/540081/Universal%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/540081/Universal%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const config = {
        // preserve
        preserveColors: [
            'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'pink',
            '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffa500', '#800080', '#ffc0cb'
        ],
        
        // exclude from dark mode
        excludeSelectors: [
            'img', 'video', 'canvas', 'svg', 'iframe',
            '.preserve-colors', '[data-preserve-colors]'
        ],
        
        // Background color
        backgroundColor: '#000000',
        
        // Default text color
        textColor: '#ffffff',
        
        // Border color for elements
        borderColor: '#333333'
    };
    
    // Utility functions
    function isColorPreserved(color) {
        if (!color || color === 'inherit' || color === 'transparent') return false;
        
        // Convert rgb/rgba to hex for comparison
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
            const hex = '#' + [rgbMatch[1], rgbMatch[2], rgbMatch[3]]
                .map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
            color = hex;
        }
        
        return config.preserveColors.some(preservedColor => 
            color.toLowerCase().includes(preservedColor.toLowerCase())
        );
    }
    
    function shouldExcludeElement(element) {
        return config.excludeSelectors.some(selector => {
            try {
                return element.matches && element.matches(selector);
            } catch (e) {
                return false;
            }
        });
    }
    
    function getComputedStyleProperty(element, property) {
        try {
            return window.getComputedStyle(element).getPropertyValue(property);
        } catch (e) {
            return '';
        }
    }
    
    // Main dark mode application function
    function applyDarkMode(element = document.documentElement) {
        // Apply to the element itself
        if (element.nodeType === Node.ELEMENT_NODE && !shouldExcludeElement(element)) {
            const computedStyle = window.getComputedStyle(element);
            
            // Handle background
            const bgColor = computedStyle.backgroundColor;
            if (bgColor && bgColor !== 'rgba(0, 0, 0, 0)' && bgColor !== 'transparent') {
                if (!isColorPreserved(bgColor)) {
                    element.style.backgroundColor = config.backgroundColor;
                }
            }
            
            // Handle text color
            const textColor = computedStyle.color;
            if (textColor && !isColorPreserved(textColor)) {
                element.style.color = config.textColor;
            }
            
            // borders restaurant and cafe
            ['border-color', 'border-top-color', 'border-right-color', 
             'border-bottom-color', 'border-left-color'].forEach(prop => {
                const borderColor = computedStyle.getPropertyValue(prop);
                if (borderColor && borderColor !== 'rgba(0, 0, 0, 0)' && 
                    borderColor !== 'transparent' && !isColorPreserved(borderColor)) {
                    element.style.setProperty(prop, config.borderColor);
                }
            });
        }
        
        // Recursively apply to children
        // "how to kill a child (process)"
        if (element.children) {
            Array.from(element.children).forEach(child => {
                applyDarkMode(child);
            });
        }
    }
    
    // not mysql injection (CSS Injection)
    function injectGlobalCSS() {
        const style = document.createElement('style');
        style.id = 'dark-mode-userscript';
        style.textContent = `
            /* Global dark mode styles */
            html, body {
                background-color: ${config.backgroundColor} !important;
                color: ${config.textColor} !important;
            }
            
            /* Common elements */
            div, span, p, h1, h2, h3, h4, h5, h6, li, td, th, 
            article, section, header, footer, nav, aside {
                background-color: ${config.backgroundColor} !important;
                color: ${config.textColor} !important;
                border-color: ${config.borderColor} !important;
            }
            
            /* Form elements */
            input, textarea, select, button {
                background-color: #222222 !important;
                color: ${config.textColor} !important;
                border-color: ${config.borderColor} !important;
            }
            
            /* Links */
            a {
                color: #66b3ff !important;
            }
            
            a:visited {
                color: #cc99ff !important;
            }
            
            /* Preserve specific colors */
            ${config.preserveColors.map(color => `
                [style*="color: ${color}"],
                [style*="color:${color}"],
                [style*="background-color: ${color}"],
                [style*="background-color:${color}"] {
                    color: ${color} !important;
                }
            `).join('')}
            
            /* Exclude preserved elements */
            ${config.excludeSelectors.join(', ')} {
                filter: none !important;
            }
        `;
        
        // Insert at the beginning of head to allow overrides
        if (document.head) {
            document.head.insertBefore(style, document.head.firstChild);
        } else {
            document.documentElement.appendChild(style);
        }
    }
    
    // Observer for dynamically added content
    function setupMutationObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        applyDarkMode(node);
                    }
                });
            });
        });
        
        observer.observe(document.body || document.documentElement, {
            childList: true,
            subtree: true
        });
        
        return observer;
    }
    
    // Initialize dark mode :yippee:
    function initDarkMode() {
        // Inject global CSS immediately
        injectGlobalCSS();
        
        // Apply dark mode to existing elements
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                applyDarkMode();
                setupMutationObserver();
            });
        } else {
        applyDarkMode();
        setupMutationObserver();
        }
        
        // Handle dynamically loaded content
        window.addEventListener('load', () => {
            setTimeout(() => applyDarkMode(), 1000);
        });
    }
    
    // Public API for customization
    window.DarkModeUserscript = {
        config: config,
        applyDarkMode: applyDarkMode,
        addPreservedColor: (color) => {
            config.preserveColors.push(color);
        },
        removePreservedColor: (color) => {
            const index = config.preserveColors.indexOf(color);
            if (index > -1) config.preserveColors.splice(index, 1);
        },
        addExcludeSelector: (selector) => {
            config.excludeSelectors.push(selector);
        },
        refresh: () => {
            document.getElementById('dark-mode-userscript')?.remove();
            initDarkMode();
        }
    };
    
    // Start the script
    initDarkMode();
    
    // Console info
    console.log('Velkommen to the Dark Side. Access customization via window.DarkModeUserscript');
    
})();