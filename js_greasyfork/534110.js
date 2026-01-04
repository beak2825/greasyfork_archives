// ==UserScript==
// @name         Grok.com Theme Switcher
// @namespace    http://violentmonkey.github.io/
// @version      1.2
// @description  Adds a theme switcher to grok.com with dark, cyberpunk, light, blood red, midnight, deep ocean, celestial, and divine modes, foldable picker with animations, draggable, and script editor compatibility. Enhanced query-bar opacity fix to 75% with broader selectors and debug logging.
// @author       virtualdmns
// @license      MIT
// @match        https://grok.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534110/Grokcom%20Theme%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/534110/Grokcom%20Theme%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('Grok Theme Switcher: Script loaded.');

    // Define theme styles
    const themes = {
        dark: {
            background: '#1a1a1a',
            text: '#e0e0e0',
            accent: '#00ff88',
            buttonBg: '#333',
            buttonText: '#fff'
        },
        cyberpunk: {
            background: '#0d0221',
            text: '#ff00ff',
            accent: '#00f7ff',
            buttonBg: '#2a0a3b',
            buttonText: '#ff00ff'
        },
        light: {
            background: '#f5f5f5',
            text: '#333',
            accent: '#007bff',
            buttonBg: '#ddd',
            buttonText: '#000'
        },
        bloodred: {
            background: '#2e0000',
            text: '#ff6666',
            accent: '#800000',
            buttonBg: '#4a0000',
            buttonText: '#ff9999'
        },
        midnight: {
            background: '#0a0a1c',
            text: '#c0c0d9',
            accent: '#4b4bff',
            buttonBg: '#1c1c2e',
            buttonText: '#e6e6ff'
        },
        deepocean: {
            background: '#0a2424',
            text: '#66cccc',
            accent: '#00b7eb',
            buttonBg: '#1a3c3c',
            buttonText: '#99e6e6'
        },
        celestial: {
            background: '#1b0a3b',
            text: '#ffd700',
            accent: '#b266ff',
            buttonBg: '#2e1a5c',
            buttonText: '#ffeb99'
        },
        divine: {
            background: '#f5f6f5',
            text: '#4682b4',
            accent: '#c0c0c0',
            buttonBg: '#e6e6fa',
            buttonText: '#191970'
        }
    };

    // Debug function to check query-bar opacity
    function debugQueryBarOpacity() {
        const queryBar = document.querySelector('div[class*="query-bar"]');
        if (queryBar) {
            const computedStyle = window.getComputedStyle(queryBar);
            console.log(`Grok Theme Switcher: Query bar opacity is ${computedStyle.opacity}`);
        } else {
            console.log('Grok Theme Switcher: Query bar not found in DOM.');
        }
    }

    // Inject CSS to avoid CSP issues
    function injectStyles(themeName) {
        console.log(`Grok Theme Switcher: Injecting styles for theme - ${themeName}`);
        const theme = themes[themeName];
        let styleTag = document.getElementById('theme-styles');
        if (!styleTag) {
            styleTag = document.createElement('style');
            styleTag.id = 'theme-styles';
            document.head.appendChild(styleTag);
        }

        styleTag.textContent = `
            @keyframes fade-slide {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            @keyframes scale-pop {
                from { transform: scale(0.5); opacity: 0; }
                to { transform: scale(1); opacity: 1; }
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.1); }
                100% { transform: scale(1); }
            }
            body {
                background-color: ${theme.background} !important;
                color: ${theme.text} !important;
                animation: fade-slide 0.5s ease !important;
            }
            p, span, div:not([class*="editor"]), h1, h2, h3, h4, h5, h6, li, a:not([class*="button"]), img {
                color: ${theme.text} !important;
                background-color: transparent !important;
                border: none !important;
                animation: fade-slide 0.5s ease !important;
            }
            button:not([class*="editor"]), input[type="button"], input[type="submit"], [role="button"]:not([class*="editor"]) {
                background-color: ${theme.buttonBg} !important;
                color: ${theme.buttonText} !important;
                border: none !important;
                transition: all 0.3s ease !important;
                animation: fade-slide 0.5s ease !important;
            }
            div[class*="query-bar"] {
                opacity: 0.75 !important;
                transition: opacity 0.3s ease !important;
                background-color: ${theme.background} !important;
            }
            div[class*="query-bar"] textarea, div[class*="query-bar"] button, div[class*="query-bar"] div {
                background-color: ${theme.background} !important;
                opacity: 1 !important;
            }
            #theme-switcher {
                position: fixed !important;
                z-index: 9999 !important;
                background-color: rgba(0, 0, 0, 0.7) !important;
                padding: 10px !important;
                border-radius: 8px !important;
                cursor: move !important;
                animation: scale-pop 0.3s ease !important;
                display: block !important;
            }
            #theme-switcher.hidden {
                display: none !important;
            }
            #themeSelect {
                padding: 8px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                background: #fff !important;
                color: #000 !important;
            }
            #theme-toggle-btn {
                position: fixed !important;
                z-index: 9999 !important;
                background-color: rgba(0, 0, 0, 0.7) !important;
                color: #fff !important;
                padding: 8px 12px !important;
                border-radius: 4px !important;
                cursor: pointer !important;
                font-size: 14px !important;
                animation: pulse 2s infinite ease !important;
                display: none !important;
            }
            #theme-toggle-btn.visible {
                display: block !important;
            }
        `;
        console.log('Grok Theme Switcher: Applied opacity 0.75 to query-bar');
        setTimeout(debugQueryBarOpacity, 500); // Check opacity after styles apply
    }

    // Force toggle state
    function forceToggleState(switcher, toggleBtn, isFolded) {
        console.log(`Grok Theme Switcher: Forcing toggle state - folded: ${isFolded}`);
        switcher.classList.toggle('hidden', isFolded);
        toggleBtn.classList.toggle('visible', isFolded);
        localStorage.setItem('themePickerFolded', isFolded.toString());
    }

    // Create floating theme switcher UI
    function createSwitcher() {
        console.log('Grok Theme Switcher: Creating switcher UI.');
        if (document.getElementById('theme-switcher') || document.getElementById('theme-toggle-btn')) {
            console.log('Grok Theme Switcher: Switcher or toggle already exists, skipping.');
            return;
        }

        // Create toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.id = 'theme-toggle-btn';
        toggleBtn.textContent = 'Theme';
        document.body.appendChild(toggleBtn);

        // Create theme switcher
        const switcher = document.createElement('div');
        switcher.id = 'theme-switcher';
        switcher.innerHTML = `
            <select id="themeSelect">
                <option value="dark">Dark</option>
                <option value="cyberpunk">Cyberpunk</option>
                <option value="light">Light</option>
                <option value="bloodred">Blood Red</option>
                <option value="midnight">Midnight</option>
                <option value="deepocean">Deep Ocean</option>
                <option value="celestial">Celestial</option>
                <option value="divine">Divine</option>
            </select>
        `;

        // Load saved position or default
        let savedPos = JSON.parse(localStorage.getItem('themePickerPos'));
        if (!savedPos || !savedPos.left || !savedPos.top) {
            savedPos = { top: 'auto', bottom: '20px', left: 'auto', right: '20px' };
        }
        Object.assign(switcher.style, savedPos);
        Object.assign(toggleBtn.style, savedPos);

        // Load folded state
        const isFolded = localStorage.getItem('themePickerFolded') === 'true';
        document.body.appendChild(switcher);
        forceToggleState(switcher, toggleBtn, isFolded);

        // Event listener for theme change
        const themeSelect = document.getElementById('themeSelect');
        themeSelect.addEventListener('change', (e) => {
            console.log(`Grok Theme Switcher: Theme selected - ${e.target.value}`);
            injectStyles(e.target.value);
            localStorage.setItem('grokTheme', e.target.value);
        });

        // Event listener for toggle button
        toggleBtn.addEventListener('click', () => {
            console.log('Grok Theme Switcher: Toggle clicked.');
            const isCurrentlyFolded = switcher.classList.contains('hidden');
            forceToggleState(switcher, toggleBtn, !isCurrentlyFolded);
        });

        // Draggable functionality for both switcher and button
        function makeDraggable(element, isButton) {
            let isDragging = false;
            let offsetX, offsetY;

            element.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.offsetX;
                offsetY = e.offsetY;
                console.log(`Grok Theme Switcher: Starting drag on ${isButton ? 'button' : 'switcher'}.`);
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    let newLeft = e.clientX - offsetX;
                    let newTop = e.clientY - offsetY;

                    // Keep within viewport
                    const rect = element.getBoundingClientRect();
                    newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - rect.width));
                    newTop = Math.max(0, Math.min(newTop, window.innerHeight - rect.height));

                    element.style.left = `${newLeft}px`;
                    element.style.top = `${newTop}px`;
                    element.style.right = 'auto';
                    element.style.bottom = 'auto';

                    // Sync other element
                    const otherElement = isButton ? switcher : toggleBtn;
                    otherElement.style.left = `${newLeft}px`;
                    otherElement.style.top = `${newTop}px`;
                    otherElement.style.right = 'auto';
                    otherElement.style.bottom = 'auto';
                }
            });

            document.addEventListener('mouseup', () => {
                if (isDragging) {
                    isDragging = false;
                    const pos = {
                        top: element.style.top,
                        bottom: element.style.bottom,
                        left: element.style.left,
                        right: element.style.right
                    };
                    localStorage.setItem('themePickerPos', JSON.stringify(pos));
                    console.log(`Grok Theme Switcher: Position saved.`, pos);
                }
            });
        }

        makeDraggable(switcher, false);
        makeDraggable(toggleBtn, true);

        const savedTheme = localStorage.getItem('grokTheme') || 'bloodred';
        themeSelect.value = savedTheme;
        injectStyles(savedTheme);
    }

    // Mutation observer for dynamic content
    function observeDOM() {
        console.log('Grok Theme Switcher: Setting up DOM observer.');
        const observer = new MutationObserver(() => {
            console.log('Grok Theme Switcher: DOM changed, reapplying theme.');
            const savedTheme = localStorage.getItem('grokTheme') || 'bloodred';
            injectStyles(savedTheme);
            debugQueryBarOpacity();
            const switcher = document.getElementById('theme-switcher');
            const toggleBtn = document.getElementById('theme-toggle-btn');
            if (switcher && toggleBtn) {
                const isFolded = localStorage.getItem('themePickerFolded') === 'true';
                forceToggleState(switcher, toggleBtn, isFolded);
            } else if (!switcher && !toggleBtn) {
                console.log('Grok Theme Switcher: Switcher missing, recreating.');
                createSwitcher();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'style']
        });
    }

    // Wait for DOM to be ready
    function waitForBody() {
        if (document.body) {
            initialize();
        } else {
            console.log('Grok Theme Switcher: Body not ready, polling...');
            setTimeout(waitForBody, 100);
        }
    }

    // Start when DOM is ready or poll if not
    function initialize() {
        console.log('Grok Theme Switcher: Initializing.');
        createSwitcher();
        observeDOM();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForBody);
    } else {
        waitForBody();
    }
})();