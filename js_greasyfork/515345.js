// ==UserScript==
// @name         Elethor Chameleon
// @namespace    http://tampermonkey.net/
// @version      2.1
// @author       Eugene
// @description  Change colors on Elethor.com
// @match        *://elethor.com/*
// @grant        GM_addStyle
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/515345/Elethor%20Chameleon.user.js
// @updateURL https://update.greasyfork.org/scripts/515345/Elethor%20Chameleon.meta.js
// ==/UserScript==
/*
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */
(function() {
    'use strict';

    const defaultBackgroundColor = '#202c3c';
    const defaultActionBarColor = '#39444e';
    const defaultTopBarColor = '#505c6c';
    const defaultTextColor = '#ffffff';
    const defaultWarningTextColor = '#7a3c38';
    const defaultSuccessTextColor = '#52b768';
    let isColorUIOpen = false;

    const DEBUG = true;

    function debug(message) {
        if (DEBUG) {
            console.log(`[Elethor Chameleon] ${message}`);
        }
    }

    function setColors() {
        debug("Setting colors");
        const appElement = document.querySelector('#app[data-v-app]');
        if (appElement) {
            const backgroundColor = localStorage.getItem('backgroundColor') || defaultBackgroundColor;
            appElement.style.backgroundColor = backgroundColor;
            backgroundColorInput.value = backgroundColor;
            debug("Background color set");
        } else {
            debug("App element not found");
        }

        const actionBarElement = document.querySelector('#currentAction');
        if (actionBarElement) {
            const actionBarColor = localStorage.getItem('actionBarColor') || defaultActionBarColor;
            actionBarElement.style.backgroundColor = actionBarColor;
            actionBarColorInput.value = actionBarColor;
            debug("Action bar color set");
        } else {
            debug("Action bar element not found");
        }

        const topBarElement = document.querySelector('nav.navbar');
        if (topBarElement) {
            const topBarColor = localStorage.getItem('topBarColor') || defaultTopBarColor;
            topBarElement.style.backgroundColor = topBarColor;
            topBarColorInput.value = topBarColor;
            debug("Top bar color set (navbar)");
        } else {
            debug("Top bar element (navbar) not found");
        }

        const textColor = localStorage.getItem('textColor') || defaultTextColor;
        document.body.style.color = textColor;
        textColorInput.value = textColor;
        applyTextColorToAll(textColor);
        debug("Text color set");

        const warningTextColor = localStorage.getItem('warningTextColor') || defaultWarningTextColor;
        warningTextColorInput.value = warningTextColor;
        applyWarningTextColor(warningTextColor);
        debug("Warning text color set");

        const successTextColor = localStorage.getItem('successTextColor') || defaultSuccessTextColor;
        successTextColorInput.value = successTextColor;
        applySuccessTextColor(successTextColor);
        debug("Success text color set");
    }

    function saveColorsToLocalStorage() {
        debug("Saving colors to localStorage");
        const backgroundColor = backgroundColorInput.value;
        const actionBarColor = actionBarColorInput.value;
        const topBarColor = topBarColorInput.value;
        const textColor = textColorInput.value;
        const warningTextColor = warningTextColorInput.value;
        const successTextColor = successTextColorInput.value;

        localStorage.setItem('backgroundColor', backgroundColor);
        localStorage.setItem('actionBarColor', actionBarColor);
        localStorage.setItem('topBarColor', topBarColor);
        localStorage.setItem('textColor', textColor);
        localStorage.setItem('warningTextColor', warningTextColor);
        localStorage.setItem('successTextColor', successTextColor);

        debug("Colors saved to localStorage");
    }

    function applyTextColorToAll(color) {
        const elementsToColor = [
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'div', 'a', 'button'
        ];
        elementsToColor.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {

            if (el.closest('tr th') &&
                el.closest('tr')?.querySelector('th:nth-child(3)')?.textContent.includes('Experience')) {
                return;
            }

                if (!el.className ||
                    ((!el.className.includes('text-destructive') || el.className.includes('text-destructive-foreground')) &&
                     (!el.className.includes('text-success') || el.className.includes('text-success-foreground')))) {
                    el.style.color = color;
                }

                if (el.className && (el.className.includes('text-success-foreground') ||
                                     el.className.includes('text-warning-foreground') ||
                                     el.className.includes('text-destructive-foreground'))) {
                    el.style.color = color;
                }
            });
        });
    }

    function applyWarningTextColor(color) {

        const warningElements = document.querySelectorAll('[class*="text-destructive"]:not([class*="text-destructive-foreground"])');
        warningElements.forEach(el => {
            el.style.color = color;
        });
        debug(`Applied warning color ${color} to ${warningElements.length} text elements`);

        const warningBgElements = document.querySelectorAll('[class*="text-destructive-foreground"], [class*="text-warning-foreground"]');
        warningBgElements.forEach(el => {
            if (el.classList.contains('bg-destructive') || el.classList.contains('bg-warning')) {
                el.style.backgroundColor = color;
            }
        });
        debug(`Applied warning color ${color} as background to ${warningBgElements.length} elements`);
    }

    function applySuccessTextColor(color) {

        const successElements = document.querySelectorAll('[class*="text-success"]:not([class*="text-success-foreground"])');
        successElements.forEach(el => {
            el.style.color = color;
        });
        debug(`Applied success color ${color} to ${successElements.length} text elements`);

        const successBgElements = document.querySelectorAll('[class*="text-success-foreground"]');
        successBgElements.forEach(el => {
            if (el.classList.contains('bg-success')) {
                el.style.backgroundColor = color;
            }
        });
        debug(`Applied success color ${color} as background to ${successBgElements.length} elements`);
    }

    function waitForElements() {
        debug("Waiting for elements");
        const interval = setInterval(() => {
            const appElement = document.querySelector('#app[data-v-app]');
            const actionBarElement = document.querySelector('#currentAction');
            const topBarElement = document.querySelector('nav.navbar');
            const navbar = document.querySelector('.navbar');

            if (appElement) {
                debug("App element found");
            }
            if (actionBarElement) {
                debug("Action bar element found");
            }
            if (topBarElement) {
                debug("Top bar element (navbar) found");
            }
            if (navbar) {
                debug("Navbar found");
            }

            if ((appElement && actionBarElement && topBarElement) || navbar) {
                debug("Essential elements found or navbar present");
                clearInterval(interval);
                setColors();
                addOpenButton();
                positionUI();

                observePageChanges();
            }
        }, 1000);
    }

    function addOpenButton() {
        debug("Adding open button");

        let navbarItem = document.querySelector('a[href="/corporation"].navbar-item.is-skewed');

        if (!navbarItem) {
            debug("Corporation link not found, trying alternate methods");
            const allNavbarItems = document.querySelectorAll('.navbar-item');

            if (allNavbarItems.length > 0) {
                navbarItem = allNavbarItems[allNavbarItems.length - 1];
                debug("Using last navbar item as anchor");
            } else {

                const navbar = document.querySelector('.navbar');
                if (navbar) {

                    debug("No navbar items found, adding to navbar directly");

                    const openButton = createOpenButton();

                    openButton.style.position = 'relative';
                    openButton.style.marginLeft = '10px';
                    navbar.appendChild(openButton);
                    return;
                } else {
                    debug("No navbar found, creating floating button");

                    const openButton = createOpenButton();
                    openButton.style.position = 'fixed';
                    openButton.style.top = '10px';
                    openButton.style.right = '10px';
                    openButton.style.zIndex = '10001';
                    document.body.appendChild(openButton);
                    return;
                }
            }
        }

        if (navbarItem) {
            debug("Adding button next to navbar item");
            const openButton = createOpenButton();
            navbarItem.parentNode.insertBefore(openButton, navbarItem.nextSibling);
        } else {
            debug("Failed to find any suitable location for button");
        }
    }

    function createOpenButton() {
        const openButton = document.createElement('button');
        openButton.id = 'colorChangerOpenButton';
        openButton.innerHTML = '🎨';
        openButton.style.marginLeft = '10px';

        const topBarElement = document.querySelector('nav.navbar');
        const topBarColor = topBarElement ? topBarElement.style.backgroundColor : '#2596be';
        openButton.style.backgroundColor = topBarColor;
        openButton.style.color = '#fff';
        openButton.style.border = 'none';
        openButton.style.padding = '5px';
        openButton.style.borderRadius = '3px';
        openButton.style.cursor = 'pointer';

        openButton.addEventListener('click', () => {
            debug("Open button clicked");
            uiContainer.style.display = uiContainer.style.display === 'none' ? 'flex' : 'none';
            isColorUIOpen = uiContainer.style.display === 'flex';
            positionUI();
        });

        return openButton;
    }

    function positionUI() {
        debug("Positioning UI");
        const topBarElement = document.querySelector('nav.navbar');
        if (topBarElement) {
            const { height } = topBarElement.getBoundingClientRect();
            uiContainer.style.top = `${height + 5}px`;
            debug(`UI positioned at ${height + 5}px from top`);
        } else {

            uiContainer.style.top = '50px';
            debug("Using fallback UI position");
        }
    }

    const uiContainer = document.createElement('div');
    uiContainer.id = 'colorChangerUI';
    uiContainer.style.position = 'fixed';
    uiContainer.style.padding = '10px';
    uiContainer.style.backgroundColor = '#505c6c';
    uiContainer.style.border = '1px solid #ccc';
    uiContainer.style.zIndex = '10000';
    uiContainer.style.display = 'none';
    uiContainer.style.flexDirection = 'row';
    uiContainer.style.alignItems = 'center';
    uiContainer.style.whiteSpace = 'nowrap';
    uiContainer.style.color = '#ffffff';
    uiContainer.style.fontSize = '12px';
    uiContainer.style.right = '10px';
    uiContainer.style.borderRadius = '5px';
    uiContainer.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    uiContainer.style.flexWrap = 'wrap';
    uiContainer.style.maxWidth = '800px';

    const backgroundColorLabel = document.createElement('label');
    backgroundColorLabel.textContent = 'Background Color: ';
    uiContainer.appendChild(backgroundColorLabel);

    const backgroundColorInput = document.createElement('input');
    backgroundColorInput.type = 'color';
    uiContainer.appendChild(backgroundColorInput);

    const actionBarColorLabel = document.createElement('label');
    actionBarColorLabel.textContent = 'Action Bar Color: ';
    actionBarColorLabel.style.marginLeft = '10px';
    uiContainer.appendChild(actionBarColorLabel);

    const actionBarColorInput = document.createElement('input');
    actionBarColorInput.type = 'color';
    uiContainer.appendChild(actionBarColorInput);

    const topBarColorLabel = document.createElement('label');
    topBarColorLabel.textContent = 'Top Bar Color: ';
    topBarColorLabel.style.marginLeft = '10px';
    uiContainer.appendChild(topBarColorLabel);

    const topBarColorInput = document.createElement('input');
    topBarColorInput.type = 'color';
    uiContainer.appendChild(topBarColorInput);

    const textColorLabel = document.createElement('label');
    textColorLabel.textContent = 'Text Color: ';
    textColorLabel.style.marginLeft = '10px';
    uiContainer.appendChild(textColorLabel);

    const textColorInput = document.createElement('input');
    textColorInput.type = 'color';
    uiContainer.appendChild(textColorInput);

    const warningTextColorLabel = document.createElement('label');
    warningTextColorLabel.textContent = 'Warning Text: ';
    warningTextColorLabel.style.marginLeft = '10px';
    uiContainer.appendChild(warningTextColorLabel);

    const warningTextColorInput = document.createElement('input');
    warningTextColorInput.type = 'color';
    warningTextColorInput.value = defaultWarningTextColor;
    uiContainer.appendChild(warningTextColorInput);

    const successTextColorLabel = document.createElement('label');
    successTextColorLabel.textContent = 'Success Text: ';
    successTextColorLabel.style.marginLeft = '10px';
    uiContainer.appendChild(successTextColorLabel);

    const successTextColorInput = document.createElement('input');
    successTextColorInput.type = 'color';
    successTextColorInput.value = defaultSuccessTextColor;
    uiContainer.appendChild(successTextColorInput);

    const buttonContainer = document.createElement('div');
    buttonContainer.style.display = 'flex';
    buttonContainer.style.marginTop = '8px';
    buttonContainer.style.width = '100%';
    buttonContainer.style.justifyContent = 'flex-end';
    uiContainer.appendChild(buttonContainer);

    const saveButton = document.createElement('button');
    saveButton.textContent = 'Save';
    saveButton.style.marginLeft = '10px';
    saveButton.id = 'saveButton';
    buttonContainer.appendChild(saveButton);

    const resetButton = document.createElement('button');
    resetButton.textContent = 'Reset';
    resetButton.style.marginLeft = '5px';
    resetButton.id = 'resetButton';
    buttonContainer.appendChild(resetButton);

    const exportButton = document.createElement('button');
    exportButton.textContent = 'Export';
    exportButton.style.marginLeft = '5px';
    exportButton.style.backgroundColor = '#2596be';
    exportButton.id = 'exportButton';
    buttonContainer.appendChild(exportButton);

    const importButton = document.createElement('button');
    importButton.textContent = 'Import';
    importButton.style.marginLeft = '5px';
    importButton.style.backgroundColor = '#2596be';
    importButton.id = 'importButton';
    buttonContainer.appendChild(importButton);

    exportButton.addEventListener('click', () => {
        const colorScheme = {
            backgroundColor: backgroundColorInput.value,
            actionBarColor: actionBarColorInput.value,
            topBarColor: topBarColorInput.value,
            textColor: textColorInput.value,
            warningTextColor: warningTextColorInput.value,
            successTextColor: successTextColorInput.value
        };

        const colorSchemeString = JSON.stringify(colorScheme);

        navigator.clipboard.writeText(colorSchemeString)
            .then(() => {
                debug('Color scheme exported to clipboard successfully');

                exportButton.textContent = '✓ Copied!';
                setTimeout(() => {
                    exportButton.textContent = 'Export';
                }, 2000);
            })
            .catch(err => {
                debug('Failed to copy: ' + err);

                exportButton.textContent = '✗ Failed';
                setTimeout(() => {
                    exportButton.textContent = 'Export';
                }, 2000);
            });
    });

    importButton.addEventListener('click', async () => {
        try {
            const text = await navigator.clipboard.readText();
            const colorScheme = JSON.parse(text);
            debug('Importing color scheme: ' + text);

            backgroundColorInput.value = colorScheme.backgroundColor || defaultBackgroundColor;
            actionBarColorInput.value = colorScheme.actionBarColor || defaultActionBarColor;
            topBarColorInput.value = colorScheme.topBarColor || defaultTopBarColor;
            textColorInput.value = colorScheme.textColor || defaultTextColor;
            warningTextColorInput.value = colorScheme.warningTextColor || defaultWarningTextColor;
            successTextColorInput.value = colorScheme.successTextColor || defaultSuccessTextColor;

            const appElement = document.querySelector('#app[data-v-app]');
            if (appElement) {
                appElement.style.backgroundColor = backgroundColorInput.value;
            }

            const actionBarElement = document.querySelector('#currentAction');
            if (actionBarElement) {
                actionBarElement.style.backgroundColor = actionBarColorInput.value;
            }

            const topBarElement = document.querySelector('nav.navbar');
            if (topBarElement) {
                topBarElement.style.backgroundColor = topBarColorInput.value;
            }

            document.body.style.color = textColorInput.value;
            applyTextColorToAll(textColorInput.value);
            applyWarningTextColor(warningTextColorInput.value);
            applySuccessTextColor(successTextColorInput.value);

            saveColorsToLocalStorage();

            importButton.textContent = '✓ Imported & Saved!';
            setTimeout(() => {
                importButton.textContent = 'Import';
            }, 2000);

        } catch (error) {
            debug('Import error: ' + error);
            alert('Failed to import color scheme. Please ensure the clipboard has a valid format.');

            importButton.textContent = '✗ Failed';
            setTimeout(() => {
                importButton.textContent = 'Import';
            }, 2000);
        }
    });

    document.body.appendChild(uiContainer);

    backgroundColorInput.addEventListener('input', () => {
        const appElement = document.querySelector('#app[data-v-app]');
        if (appElement) {
            appElement.style.backgroundColor = backgroundColorInput.value;
        }
    });

    actionBarColorInput.addEventListener('input', () => {
        const actionBarElement = document.querySelector('#currentAction');
        if (actionBarElement) {
            actionBarElement.style.backgroundColor = actionBarColorInput.value;
        }
    });

    topBarColorInput.addEventListener('input', () => {
        const topBarElement = document.querySelector('nav.navbar');
        if (topBarElement) {
            topBarElement.style.backgroundColor = topBarColorInput.value;
        }
    });

    textColorInput.addEventListener('input', () => {
        document.body.style.color = textColorInput.value;
        applyTextColorToAll(textColorInput.value);
    });

    warningTextColorInput.addEventListener('input', () => {
        applyWarningTextColor(warningTextColorInput.value);
    });

    successTextColorInput.addEventListener('input', () => {
        applySuccessTextColor(successTextColorInput.value);
    });

    saveButton.addEventListener('click', () => {
        saveColorsToLocalStorage();

        setColors();

        saveButton.textContent = '✓ Saved!';
        setTimeout(() => {
            saveButton.textContent = 'Save';
        }, 2000);
    });

    resetButton.addEventListener('click', () => {
        localStorage.removeItem('backgroundColor');
        localStorage.removeItem('actionBarColor');
        localStorage.removeItem('topBarColor');
        localStorage.removeItem('textColor');
        localStorage.removeItem('warningTextColor');
        localStorage.removeItem('successTextColor');
        setColors();

        resetButton.textContent = '✓ Reset!';
        setTimeout(() => {
            resetButton.textContent = 'Reset';
        }, 2000);
    });

    GM_addStyle(`
        #colorChangerUI input[type="color"] {
            cursor: pointer;
            margin-left: 5px;
            border: none;
            height: 20px;
            width: 20px;
            padding: 0;
            background: none;
        }
        #colorChangerUI button {
            cursor: pointer;
            color: #fff;
            border: none;
            padding: 5px 10px;
            border-radius: 3px;
            font-size: 12px;
            transition: all 0.2s ease;
        }
        #colorChangerUI button:hover {
            opacity: 0.8;
            transform: translateY(-1px);
        }
        #colorChangerUI button:active {
            transform: translateY(1px);
        }
        #saveButton {
            background-color: #4CAF50 !important;
        }
        #resetButton {
            background-color: #f44336 !important;
        }
        #exportButton, #importButton {
            background-color: #2196F3 !important;
        }
        #colorChangerOpenButton {
            transition: transform 0.2s ease !important;
        }
        #colorChangerOpenButton:hover {
            transform: scale(1.1) !important;
        }
        #colorChangerUI label {
            margin-left: 10px;
        }
        #colorChangerUI label:first-child {
            margin-left: 0;
        }
    `);

    function observePageChanges() {
        debug("Starting page observer");
        const observer = new MutationObserver((mutations) => {
            let needsUpdate = false;
            let hasDestructiveText = false;
            let hasSuccessText = false;
            let hasForegroundClasses = false;

            mutations.forEach((mutation) => {
                if (mutation.addedNodes.length) {

                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === 1) {
                            if (node.className && node.className.includes) {
                                if (node.className.includes('text-destructive')) {
                                    hasDestructiveText = true;
                                }
                                if (node.className.includes('text-success')) {
                                    hasSuccessText = true;
                                }
                                if (node.className.includes('text-success-foreground') ||
                                    node.className.includes('text-warning-foreground') ||
                                    node.className.includes('text-destructive-foreground')) {
                                    hasForegroundClasses = true;
                                }
                            }

                            const destructiveElements = node.querySelectorAll('[class*="text-destructive"]');
                            if (destructiveElements.length > 0) {
                                hasDestructiveText = true;
                            }

                            const successElements = node.querySelectorAll('[class*="text-success"]');
                            if (successElements.length > 0) {
                                hasSuccessText = true;
                            }

                            const foregroundElements = node.querySelectorAll(
                                '[class*="text-success-foreground"], [class*="text-warning-foreground"], [class*="text-destructive-foreground"]'
                            );
                            if (foregroundElements.length > 0) {
                                hasForegroundClasses = true;
                            }
                        }
                    });

                    if (hasDestructiveText || hasForegroundClasses) {
                        debug("Found new text-destructive or foreground elements, applying warning color");
                        applyWarningTextColor(warningTextColorInput.value);
                    }

                    if (hasSuccessText || hasForegroundClasses) {
                        debug("Found new text-success or foreground elements, applying success color");
                        applySuccessTextColor(successTextColorInput.value);
                    }

                    if (hasForegroundClasses) {
                        debug("Found new foreground elements, applying text color");
                        applyTextColorToAll(textColorInput.value);
                    }

                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                debug("Page changed, reapplying colors");

    if (!isColorUIOpen) {
        setColors();
    } else {

        debug("UI is open - skipping setColors() to prevent overriding user selections");
    }

                if (!document.querySelector('#colorChangerOpenButton')) {
                    debug("Button disappeared, adding again");
                    addOpenButton();
                }
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForElements);
    } else {
        waitForElements();
    }
})();