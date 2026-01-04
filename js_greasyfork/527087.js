// ==UserScript==
// @name         Google Docs Shortcuts
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  Adds shortcuts for text, highlight, and cell color, for opening Borders and Shading, for opening table border selector, for opening current tab outline, for switching to last open tab, for restoring scroll position of previous session.
// @match        https://docs.google.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/527087/Google%20Docs%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/527087/Google%20Docs%20Shortcuts.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ------------------------------
    // 1. Enlarge Table Border Menu
    // ------------------------------
    const borderMenuStyle = document.createElement('style');
    borderMenuStyle.textContent = `
        .goog-menu.goog-menu-vertical.docs-material[aria-label="Table border selection menu"] {
            transform: scale(2.5) !important;
            transform-origin: top left !important;
        }
    `;
    document.head.appendChild(borderMenuStyle);

    // ------------------------------
    // 2. Color Shortcut Definitions
    // ------------------------------
    // Text Color shortcuts (Alt+1-4)
    const TEXT_COLOR_SHORTCUTS = {
        '4': { rgb: 'rgb(255, 51, 51)', hex: '#ff3333' },
        '3': { rgb: 'rgb(0, 96, 87)', hex: '#006057' },
        '2': { rgb: 'rgb(0, 167, 151)', hex: '#00a797' },
        '1': { rgb: 'rgb(0, 0, 0)', hex: '#000000' }
    };

    // Highlight Color shortcuts (to be triggered with Alt+K and Alt+M using keyCodes)
    const HIGHLIGHT_COLOR_SHORTCUTS = {
        'k': { rgb: 'rgb(243, 243, 243)', hex: '#f3f3f3' },
        'm': { rgb: 'rgb(235, 242, 232)', hex: '#ebf2e8' }
    };

    // Cell (Background) Color shortcut (to be triggered with Alt+P using keyCode)
    const CELL_COLOR_SHORTCUTS = {
        'p': { rgb: 'rgb(245, 146, 142)', hex: '#f5928e' }
    };

    // ------------------------------
    // 3. Other Shortcut Constants
    // ------------------------------
    const TAB_SHORTCUT_KEY = '5'; // Alt+5
    const COLOR_SHORTCUT_KEY = '7'; // Alt+7 (opens text color menu)
    const SCROLL_SHORTCUT_KEY = '8'; // Alt+8
    const TAB_SWITCH_KEY_CODE = 87; // Alt+W
    const BORDER_SHADING_KEY_CODE = 71; // Alt+G
    const BORDER_SELECTION_KEY_CODE = 82; // Alt+R

    const TAB_SWITCH_REFACTORY_PERIOD = 500;
    let lastSelectedTab = null;
    let currentSelectedTab = null;
    let isTabSwitchInProgress = false;
    let lastSelectedTabInterval = null; // For our interval

    // ------------------------------
    // 4. Key Event Handlers
    // ------------------------------
    function handleKeydown(event) {
        if (event.altKey && !event.ctrlKey) {
            const key = event.key.toLowerCase();
            switch (key) {
                case TAB_SHORTCUT_KEY:
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    clickSelectedTab();
                    break;
                case COLOR_SHORTCUT_KEY:
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    clickTextColorButton();
                    break;
                case SCROLL_SHORTCUT_KEY:
                    event.preventDefault();
                    event.stopImmediatePropagation();
                    restoreScrollPosition();
                    break;
                case '4':
                case '3':
                case '2':
                case '1': {
                    event.preventDefault();
                    event.stopPropagation();
                    event.stopImmediatePropagation();
                    const { rgb, hex } = TEXT_COLOR_SHORTCUTS[key];
                    clickColor(rgb, hex);
                    break;
                }
                    // Removed cases for 'k', 'm', and 'p' so that these will be handled via keyCode-based handlers.
            }
        }
    }

    function handleAltWKey(event) {
        if (event.altKey && event.keyCode === TAB_SWITCH_KEY_CODE) {
            event.preventDefault();
            event.stopImmediatePropagation();
            clickLastSelectedTab();
        }
    }

    function handleAltGKey(event) {
        if (event.altKey && event.keyCode === BORDER_SHADING_KEY_CODE) {
            event.preventDefault();
            event.stopImmediatePropagation();
            clickBordersAndShading();
        }
    }

    function handleAltRKey(event) {
        if (event.altKey && event.keyCode === BORDER_SELECTION_KEY_CODE) {
            event.preventDefault();
            event.stopImmediatePropagation();
            clickBordersSelectionButton();
        }
    }

    // New handlers based on keyCode for Alt+K, Alt+M, and Alt+P
    function handleAltKKey(event) {
        if (event.altKey && event.keyCode === 75) { // K key
            event.preventDefault();
            event.stopImmediatePropagation();
            const { rgb, hex } = HIGHLIGHT_COLOR_SHORTCUTS['k'];
            clickColorForMenu('highlight', 'div[aria-label="Highlight color"]', rgb, hex);
        }
    }

    function handleAltMKey(event) {
        if (event.altKey && event.keyCode === 77) { // M key
            event.preventDefault();
            event.stopImmediatePropagation();
            const { rgb, hex } = HIGHLIGHT_COLOR_SHORTCUTS['m'];
            clickColorForMenu('highlight', 'div[aria-label="Highlight color"]', rgb, hex);
        }
    }

    function handleAltPKey(event) {
        if (event.altKey && event.keyCode === 80) { // P key
            event.preventDefault();
            event.stopImmediatePropagation();
            const { rgb, hex } = CELL_COLOR_SHORTCUTS['p'];
            clickColorForMenu('cell', 'div[aria-label="Background color"]', rgb, hex);
        }
    }

    function attachKeyListener() {
        const iframe = document.querySelector('iframe.docs-texteventtarget-iframe');
        if (iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.addEventListener('keydown', handleKeydown, true);
            iframeDoc.addEventListener('keydown', handleAltWKey, true);
            iframeDoc.addEventListener('keydown', handleAltGKey, true);
            iframeDoc.addEventListener('keydown', handleAltRKey, true);
            iframeDoc.addEventListener('keydown', handleAltKKey, true);
            iframeDoc.addEventListener('keydown', handleAltMKey, true);
            iframeDoc.addEventListener('keydown', handleAltPKey, true);
            console.log('Key listener attached to iframe.');
        } else {
            console.log('Iframe not found. Retrying...');
            setTimeout(attachKeyListener, 1000);
        }
        window.addEventListener('keydown', handleKeydown, true);
        window.addEventListener('keydown', handleAltWKey, true);
        window.addEventListener('keydown', handleAltGKey, true);
        window.addEventListener('keydown', handleAltRKey, true);
        window.addEventListener('keydown', handleAltKKey, true);
        window.addEventListener('keydown', handleAltMKey, true);
        window.addEventListener('keydown', handleAltPKey, true);
        console.log('Key listener attached to top window.');
    }

    // ------------------------------
    // 5. Element Interaction Functions
    // ------------------------------
    function clickElement(element) {
        const mouseDown = new MouseEvent('mousedown', { bubbles: true, cancelable: true, view: window });
        const mouseUp = new MouseEvent('mouseup', { bubbles: true, cancelable: true, view: window });
        const clickEvt = new MouseEvent('click', { bubbles: true, cancelable: true, view: window });
        element.dispatchEvent(mouseDown);
        element.dispatchEvent(mouseUp);
        element.dispatchEvent(clickEvt);
        console.log('Simulated click on', element);
    }

    function clickSelectedTab() {
        const tabElement = document.querySelector('.chapter-item-label-and-buttons-container[aria-selected="true"]');
        if (tabElement) {
            clickElement(tabElement);
            console.log('Tab clicked');
        } else {
            console.log('Tab element not found.');
        }
    }

    // Click the Text Color button to load the text palette (if not already loaded)
    function clickTextColorButton() {
        const textColorButton = document.querySelector('div[aria-label="Text color"]');
        if (textColorButton) {
            clickElement(textColorButton);
            console.log('Text color button clicked');
        } else {
            console.log('Text color button not found.');
        }
    }

    // ------------------------------
    // 6. Color Menu Functions
    // ------------------------------
    // Returns the menu element based on its inner text:
    // 'text': does NOT include "None" or "Transparent"
    // 'cell': includes "Transparent"
    // 'highlight': includes "None"
    function getColorMenu(menuType) {
        const menus = document.querySelectorAll('div.goog-menu.goog-menu-vertical.docs-colormenuitems.docs-material');
        for (const menu of menus) {
            const menuText = menu.textContent;
            if (menuType === 'text' && !menuText.includes('None') && !menuText.includes('Transparent')) {
                return menu;
            } else if (menuType === 'cell' && menuText.includes('Transparent')) {
                return menu;
            } else if (menuType === 'highlight' && menuText.includes('None')) {
                return menu;
            }
        }
        return null;
    }

    // Text Color selection function
    function clickColor(rgb, hex) {
        let container = getColorMenu('text');
        if (!container) {
            console.log('Text menu not found; forcing open text menu...');
            clickTextColorButton();
            setTimeout(() => {
                container = getColorMenu('text');
                if (!container) {
                    console.log('Text menu still not found.');
                    return;
                }
                forceShowAndClick(container);
            }, 150);
        } else {
            forceShowAndClick(container);
        }

        function forceShowAndClick(container) {
            const originalDisplay = container.style.display;
            if (getComputedStyle(container).display === 'none') {
                container.style.display = 'block';
            }
            const palettes = container.querySelectorAll('.docs-material-colorpalette');
            let colorElement = null;
            const normalizedRgb = rgb.replace(/\s/g, '');
            for (const palette of palettes) {
                const candidates = palette.querySelectorAll('.docs-material-colorpalette-colorswatch, .docs-material-colorpalette-colorswatch-color');
                for (const candidate of candidates) {
                    const styleAttr = candidate.getAttribute('style') || '';
                    if (styleAttr.replace(/\s/g, '').includes(normalizedRgb)) {
                        colorElement = candidate;
                        break;
                    }
                }
                if (colorElement) break;
            }
            if (colorElement) {
                clickElement(colorElement);
                console.log(`Simulated click on color ${hex} in text menu.`);
                container.style.display = 'none';
            } else {
                console.log(`Color element for ${hex} not found in text menu using normalized RGB: ${normalizedRgb}`);
                container.style.display = originalDisplay;
            }
        }
    }

    // Generic function for highlight and cell color selection
    // menuType: 'highlight' or 'cell'
    // buttonSelector: selector for the button that opens the menu
    function clickColorForMenu(menuType, buttonSelector, rgb, hex) {
        let container = getColorMenu(menuType);
        if (!container) {
            console.log(`${menuType} menu not found; forcing open menu using button ${buttonSelector}...`);
            const button = document.querySelector(buttonSelector);
            if (button) {
                clickElement(button);
                console.log(`Button for ${menuType} menu clicked.`);
            } else {
                console.log(`Button for ${menuType} menu not found.`);
                return;
            }
            setTimeout(() => {
                container = getColorMenu(menuType);
                if (!container) {
                    console.log(`${menuType} menu still not found.`);
                    return;
                }
                forceShowAndClick(container);
            }, 150);
        } else {
            forceShowAndClick(container);
        }

        function forceShowAndClick(container) {
            const originalDisplay = container.style.display;
            if (getComputedStyle(container).display === 'none') {
                container.style.display = 'block';
            }
            const palettes = container.querySelectorAll('.docs-material-colorpalette');
            let colorElement = null;
            const normalizedRgb = rgb.replace(/\s/g, '');
            for (const palette of palettes) {
                const candidates = palette.querySelectorAll('.docs-material-colorpalette-colorswatch, .docs-material-colorpalette-colorswatch-color');
                for (const candidate of candidates) {
                    const styleAttr = candidate.getAttribute('style') || '';
                    if (styleAttr.replace(/\s/g, '').includes(normalizedRgb)) {
                        colorElement = candidate;
                        break;
                    }
                }
                if (colorElement) break;
            }
            if (colorElement) {
                clickElement(colorElement);
                console.log(`Simulated click on color ${hex} in ${menuType} menu.`);
                container.style.display = 'none';
            } else {
                console.log(`Color element for ${hex} not found in ${menuType} menu using normalized RGB: ${normalizedRgb}`);
                container.style.display = originalDisplay;
            }
        }
    }

    // ------------------------------
    // 7. Wait-for-Element-Gone Helper
    // ------------------------------
    // Polls until an element matching the selector is no longer present, then calls callback.
    function waitForElementGone(selector, callback) {
        const checkGone = () => {
            if (!document.querySelector(selector)) {
                callback();
            } else {
                setTimeout(checkGone, 300);
            }
        };
        checkGone();
    }

    // ------------------------------
    // 8. Modified Borders and Shading Function
    // ------------------------------
    function clickBordersAndShading() {
        // Try direct click first
        let bordersAndShadingButton = document.querySelector('span[aria-label^="Borders and shading"]');
        if (bordersAndShadingButton) {
            clickElement(bordersAndShadingButton);
            console.log('Borders and shading menu clicked directly.');
            return;
        }

        console.log('Direct Borders and shading menu not found, attempting Paragraph styles fallback.');

        // Fallback: Click Paragraph styles button to load Borders and shading
        const paragraphStylesButton = document.querySelector('span[aria-label="Paragraph styles p"]');
        if (paragraphStylesButton) {
            clickElement(paragraphStylesButton);
            console.log('Paragraph styles button clicked.');

            // Wait for Borders and shading button to appear
            waitForElement('span[aria-label^="Borders and shading"]', function (bordersBtn) {
                clickElement(bordersBtn);
                console.log('Borders and shading button clicked from Paragraph styles menu.');

                // Close Paragraph styles menu explicitly after clicking Borders and shading
                closeMenusExcept([]);
            });
            return;
        }

        // Additional fallback: Try Insert menu → Paragraph styles
        const insertMenu = document.querySelector('div#docs-insert-menu');
        if (insertMenu) {
            clickElement(insertMenu);
            console.log('Insert menu clicked.');

            waitForElement('span[aria-label="Paragraph styles p"]', function (psButton) {
                clickElement(psButton);
                console.log('Paragraph styles button clicked from Insert menu.');

                waitForElement('span[aria-label^="Borders and shading"]', function (bordersBtn) {
                    clickElement(bordersBtn);
                    console.log('Borders and shading button clicked after Insert → Paragraph styles.');

                    // Close Insert menu explicitly after clicking Borders and shading
                    closeMenusExcept([]);
                });
            });
            return;
        }

        console.log('All fallbacks failed: Borders and shading button not found.');
    }

    // Helper to close unwanted menus after fallback actions
    function closeMenusExcept(exceptionsSelectors = []) {
        const allMenus = document.querySelectorAll('div.goog-menu.goog-menu-vertical.docs-material.shell-menu.goog-menu-noaccel, div.goog-menu.goog-menu-vertical.docs-material');

        allMenus.forEach(menu => {
            if (!exceptionsSelectors.some(selector => menu.matches(selector))) {
                menu.style.display = 'none';
                console.log('Closed unwanted menu:', menu);
            }
        });

        // Additionally, click on document body to remove any residual menu overlays
        document.body.click();
    }

    // ------------------------------
    // 9. Utility Functions
    // ------------------------------
    function getDocumentId() {
        const url = new URL(window.location.href);
        url.hash = '';
        return url.toString();
    }

    function saveScrollPosition() {
        const documentId = getDocumentId();
        const scrollableElement = document.querySelector('.kix-appview-editor');
        if (scrollableElement) {
            const scrollPosition = scrollableElement.scrollTop;
            const scrollData = JSON.parse(localStorage.getItem('googleDocsScrollData') || '{}');
            scrollData[documentId] = scrollPosition;
            localStorage.setItem('googleDocsScrollData', JSON.stringify(scrollData));
            console.log('Scroll position saved for document:', documentId, scrollPosition);
        }
    }

    function restoreScrollPosition() {
        const documentId = getDocumentId();
        const scrollData = JSON.parse(localStorage.getItem('googleDocsScrollData') || '{}');
        const scrollPosition = scrollData[documentId];
        const scrollableElement = document.querySelector('.kix-appview-editor');
        if (scrollableElement && scrollPosition !== undefined) {
            scrollableElement.scrollTo(0, parseInt(scrollPosition, 10));
            console.log('Scroll position restored for document:', documentId, scrollPosition);
        } else {
            console.log('No scroll position saved for this document.');
        }
    }

    function clickBordersSelectionButton() {
        const bordersSelectionButton = document.querySelector('div.goog-inline-block.docs-border-selection-button-normal.docs-ui-unprintable[title="Click to select borders"]');
        if (bordersSelectionButton) {
            clickElement(bordersSelectionButton);
            console.log('Borders selection button clicked');
        } else {
            console.log('Borders selection button not found.');
        }
    }

    function getTabsAndSubtabs() {
        const treeItems = document.querySelectorAll('[role="treeitem"]');
        return Array.from(treeItems).filter(item => {
            const ariaLabel = item.getAttribute('aria-label');
            return ariaLabel && !ariaLabel.toLowerCase().includes('level');
        });
    }

    function getLastSelectedTab() {
        const selectedTab = document.querySelector('.chapter-item-label-and-buttons-container[aria-selected="true"]');
        if (selectedTab) {
            if (currentSelectedTab !== selectedTab) {
                lastSelectedTab = currentSelectedTab;
            }
            currentSelectedTab = selectedTab;
            console.log('Current selected tab:', selectedTab.getAttribute('aria-label'));
        } else {
            console.log('No tab is currently selected.');
        }
    }

    function clickLastSelectedTab() {
        if (isTabSwitchInProgress) return;
        if (lastSelectedTab && lastSelectedTab !== currentSelectedTab) {
            console.log('Clicking on last selected tab:', lastSelectedTab.getAttribute('aria-label'));
            isTabSwitchInProgress = true;
            clickElement(lastSelectedTab);
            const iframe = document.querySelector('iframe.docs-texteventtarget-iframe');
            if (iframe) {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                iframe.focus();
                iframeDoc.body.click();
                console.log('Focus set inside the document and caret activated!');
            }
            setTimeout(() => {
                isTabSwitchInProgress = false;
            }, TAB_SWITCH_REFACTORY_PERIOD);
        } else {
            console.log('No valid last selected tab found.');
        }
    }

    // ------------------------------
    // 10. Initialization and Refresh
    // ------------------------------
    function initialize() {
        console.log('Userscript initialized. Ready to detect shortcuts.');
        lastSelectedTabInterval = setInterval(getLastSelectedTab, 1000);
        attachKeyListener();
    }

    window.addEventListener('beforeunload', saveScrollPosition);
    window.addEventListener('load', initialize);

    function removeKeyListeners() {
        window.removeEventListener('keydown', handleKeydown, true);
        window.removeEventListener('keydown', handleAltWKey, true);
        window.removeEventListener('keydown', handleAltGKey, true);
        window.removeEventListener('keydown', handleAltRKey, true);
        window.removeEventListener('keydown', handleAltKKey, true);
        window.removeEventListener('keydown', handleAltMKey, true);
        window.removeEventListener('keydown', handleAltPKey, true);
        const iframe = document.querySelector('iframe.docs-texteventtarget-iframe');
        if (iframe) {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.removeEventListener('keydown', handleKeydown, true);
            iframeDoc.removeEventListener('keydown', handleAltWKey, true);
            iframeDoc.removeEventListener('keydown', handleAltGKey, true);
            iframeDoc.removeEventListener('keydown', handleAltRKey, true);
            iframeDoc.removeEventListener('keydown', handleAltKKey, true);
            iframeDoc.removeEventListener('keydown', handleAltMKey, true);
            iframeDoc.removeEventListener('keydown', handleAltPKey, true);
        }
    }

    function refreshScript() {
        if (lastSelectedTabInterval) {
            clearInterval(lastSelectedTabInterval);
            lastSelectedTabInterval = null;
        }
        removeKeyListeners();
        lastSelectedTab = null;
        currentSelectedTab = null;
        isTabSwitchInProgress = false;
        initialize();
        console.log('Docs Shortcuts script reinitialized.');
    }

    function waitForElement(selector, callback) {
        const element = document.querySelector(selector);
        if (element) {
            callback(element);
        } else {
            setTimeout(() => waitForElement(selector, callback), 300);
        }
    }

    function loadGoogleMaterialSymbols() {
        if (!document.querySelector('link[href*="fonts.googleapis.com/css2?family=Material+Symbols+Outlined"]')) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200';
            document.head.appendChild(link);
        }
    }

    function createRefreshButton() {
        const button = document.createElement('div');
        button.setAttribute('role', 'button');
        button.id = 'refresh-button';
        button.className = "goog-inline-block jfk-button jfk-button-standard docs-appbar-circle-button docs-titlebar-button";
        button.setAttribute('aria-disabled', 'false');
        button.setAttribute('aria-label', 'Refresh Docs Shortcuts');
        button.tabIndex = 0;
        button.setAttribute('data-tooltip', 'Refresh Docs Shortcuts');
        button.style.userSelect = 'none';
        button.style.marginRight = "8px";

        const iconWrapper = document.createElement('div');
        iconWrapper.className = "docs-icon goog-inline-block";

        const icon = document.createElement('span');
        icon.className = "material-symbols-outlined";
        icon.textContent = "refresh";

        iconWrapper.appendChild(icon);
        button.appendChild(iconWrapper);

        return button;
    }

    function injectRefreshButtonStyles() {
        const style = document.createElement('style');
        style.textContent = `
          #refresh-button {
            display: flex;
            align-items: center;
            justify-content: center;
          }
          #refresh-button .docs-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
          }
          #refresh-button .material-symbols-outlined {
            font-size: 26px;
            color: #444746;
            transition: color 0.2s ease, font-variation-settings 0.2s ease;
            font-variation-settings: 'FILL' 0;
          }
          #refresh-button.active .material-symbols-outlined {
            color: #50A387;
            font-variation-settings: 'FILL' 1;
          }
          #refresh-button.jfk-button-hover .material-symbols-outlined {
            color: #333;
          }
          #refresh-button.active.jfk-button-hover .material-symbols-outlined {
            color: #50A387;
            font-variation-settings: 'FILL' 1;
          }
        `;
        document.head.appendChild(style);
    }

    loadGoogleMaterialSymbols();
    waitForElement('.docs-revisions-appbarbutton-container', (revisionsContainer) => {
        // Wait for the Material Symbols font to load before injecting the button
        const fontLoadPromise = document.fonts
        ? document.fonts.load('1em "Material Symbols Outlined"')
        : Promise.resolve();

        fontLoadPromise.then(() => {
            injectRefreshButtonStyles();
            const refreshButton = createRefreshButton();
            revisionsContainer.parentNode.insertBefore(refreshButton, revisionsContainer);

            refreshButton.addEventListener('mouseenter', () => {
                refreshButton.classList.add('jfk-button-hover');
            });
            refreshButton.addEventListener('mouseleave', () => {
                refreshButton.classList.remove('jfk-button-hover');
                refreshButton.blur();
            });
            refreshButton.addEventListener('focus', () => {
                refreshButton.classList.remove('jfk-button-hover');
            });
            refreshButton.addEventListener('click', () => {
                console.log('Refresh button clicked. Reinitializing userscript...');
                refreshScript();
            });
        }).catch(err => {
            // If font-loading fails or API unsupported, inject button immediately
            console.warn('Material Symbols font failed to load or Font Loading API unavailable:', err);
            injectRefreshButtonStyles();
            revisionsContainer.parentNode.insertBefore(createRefreshButton(), revisionsContainer);
        });
    });
})();
