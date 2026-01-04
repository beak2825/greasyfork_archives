// ==UserScript==
// @name         JanitorAI CSS Toggle
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Toggles JanitorAI custom CSS
// @author       IWasTheSyntaxError
// @match        https://janitorai.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533891/JanitorAI%20CSS%20Toggle.user.js
// @updateURL https://update.greasyfork.org/scripts/533891/JanitorAI%20CSS%20Toggle.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let alreadyReloaded = true;
    let alreadyReloadedContrast = true;
    let isMenuVisible = false;
    let isCustomCssDisabled = localStorage.getItem('janitorAICustomCssDisabled') === 'true';
    let isHighTextContrast = localStorage.getItem('janitorAIHighContrast') === 'true';

    let controlPanel = null;
    let controlsContainer = null;

    const isAllowedPage = () => {
        const path = window.location.pathname;
        return path.startsWith('/characters') || path === '/my_characters' || path.startsWith('/profiles/');
    };

    const isChatsPage = () => window.location.pathname.startsWith('/chats');

    const toggleMenu = () => {
        isMenuVisible = !isMenuVisible;
        updateElementsVisibility();
        updateControlText();
    };

    const toggleCustomCss = () => {
        isCustomCssDisabled = !isCustomCssDisabled;
        localStorage.setItem('janitorAICustomCssDisabled', isCustomCssDisabled);
        applyCustomCssToggle();
        updateControlText();
    };

    const toggleCustomContrast = () => {
        isHighTextContrast = !isHighTextContrast;
        localStorage.setItem('janitorAIHighContrast', isHighTextContrast);
        applyHighContrastText();
        updateControlText();
    };

    const applyHighContrastText = () => {
        if (isHighTextContrast){
            alreadyReloadedContrast = false;
            const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5');

            elements.forEach(element => {
                element.style.color = 'white';
                element.style.backgroundColor = 'black';
            });

            const allElements = document.querySelectorAll('*');

            allElements.forEach(element => {
                if (element.childNodes.length > 0) {
                    element.childNodes.forEach(node => {
                        if (node.nodeType === Node.TEXT_NODE && node.nodeValue.trim() !== "") {
                            node.parentNode.style.color = 'white';
                            node.parentNode.style.backgroundColor = 'black';
                        }
                    });
                }
            });
        } else {
            if(!alreadyReloadedContrast){
                location.reload();
                alreadyReloadedContrast = true;
            }
        }
    }

    const applyCustomCssToggle = () => {
        if (isCustomCssDisabled) {
            alreadyReloaded = false;
            removeCustomStyles();
            const parentElement = document.querySelector('.css-1bn1yyx');
            if(parentElement){
                const childElements = parentElement.querySelectorAll('*');
                for (let i = 0; i < childElements.length; i++) {
                    if (childElements[i].nodeName === "STYLE") {
                        childElements[i].parentNode.removeChild(childElements[i]);
                    }
                }
                const background = document.querySelector(".css-14l6kwv").firstChild;background.style.background = "none";
            }const char = document.querySelector(".css-fu9q4m");
            if(!char){
                const main = document.querySelector(".css-lo240v");
                const elementsWithStyle = main.querySelectorAll('[style]');elementsWithStyle.forEach(element => {
                    element.removeAttribute('style');
                });
            } else {
                const elementsWithStyle = char.querySelectorAll('[style]');elementsWithStyle.forEach(element => {
                    element.removeAttribute('style');
                });
            };
        } else {
            if(!alreadyReloaded){
                location.reload();
                alreadyReloaded = true;
            }
        }
    };

    const removeCustomStyles = () => {
        const styles = document.querySelectorAll('body style');
        styles.forEach(style => style.remove());
    };

    const updateControlText = () => {
        const cssToggleText = document.getElementById('css-toggle-text');
        const cssToggleContrast = document.getElementById('css-toggle-contrast');
        if (cssToggleText) {
            cssToggleText.textContent = `Custom CSS: ${isCustomCssDisabled ? 'OFF' : 'ON'}`;
            cssToggleText.style.color = isCustomCssDisabled ? '#ccc' : '#fff';
        }
        if (cssToggleContrast) {
            cssToggleContrast.textContent = `High Contrast Text: ${isHighTextContrast ? 'ON' : 'OFF'}`;
            cssToggleContrast.style.color = isHighTextContrast ? '#fff' : '#ccc';
        }
    };

    const createControlPanel = () => {
        if (controlPanel) return;

        controlPanel = document.createElement('div');
        controlPanel.id = 'janitor-control-panel';
        Object.assign(controlPanel.style, {
            position: 'fixed',
            top: '75px',
            left: '10px',
            zIndex: '100000',
            display: 'flex',
            flexDirection: 'column',
            gap: '5px',
            alignItems: 'flex-start'
        });

        const settingsButton = document.createElement('button');
        settingsButton.id = 'token-filter-toggle';
        settingsButton.textContent = '⚙️';
        Object.assign(settingsButton.style, {
            width: '30px',
            height: '30px',
            padding: '0',
            backgroundColor: 'rgba(74, 74, 74, 0.7)',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '16px',
            transition: 'background-color 0.2s'
        });
        settingsButton.addEventListener('click', toggleMenu);

        controlsContainer = document.createElement('div');
        controlsContainer.id = 'controls-container';
        Object.assign(controlsContainer.style, {
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            backgroundColor: 'rgba(74, 74, 74, 0.7)',
            padding: '5px',
            borderRadius: '5px',
            zIndex: '100001'
        });

        const cssToggleContrast = document.createElement('span');
        cssToggleContrast.id = 'css-toggle-contrast';
        cssToggleContrast.style.cursor = 'pointer';
        cssToggleContrast.style.fontSize = '12px';
        cssToggleContrast.addEventListener('click', toggleCustomContrast);

        const cssToggleText = document.createElement('span');
        cssToggleText.id = 'css-toggle-text';
        cssToggleText.style.cursor = 'pointer';
        cssToggleText.style.fontSize = '12px';
        cssToggleText.addEventListener('click', toggleCustomCss);

        controlsContainer.appendChild(cssToggleContrast);
        controlsContainer.appendChild(cssToggleText);
        controlPanel.appendChild(settingsButton);
        controlPanel.appendChild(controlsContainer);
        document.body.appendChild(controlPanel);
        updateControlText();
    };

    const updateElementsVisibility = () => {
        const shouldShow = isAllowedPage() && !isChatsPage();
        if (controlPanel) controlPanel.style.display = shouldShow ? 'flex' : 'none';
        if (controlsContainer) controlsContainer.style.display = shouldShow && isMenuVisible ? 'flex' : 'none';
    };

    const initialize = () => {
        createControlPanel();
        updateElementsVisibility();

        if (isAllowedPage() && !isChatsPage()) {
            applyCustomCssToggle();

            new MutationObserver(() => {
                applyCustomCssToggle();
            }).observe(document.body, { childList: true, subtree: true });

            const originalAppendChild = Element.prototype.appendChild;
            Element.prototype.appendChild = function(node) {
                if (isCustomCssDisabled && node.tagName === 'STYLE' && this.tagName === 'HEAD') {
                    return node;
                }
                return originalAppendChild.call(this, node);
            };
        }
    };

    const tryInitialize = () => {
        if (document.body) {
            initialize();
            let lastPath = window.location.pathname;
            setInterval(() => {
                if (lastPath !== window.location.pathname) {
                    lastPath = window.location.pathname;
                    updateElementsVisibility();
                    if (isAllowedPage() && !isChatsPage()) {
                        applyCustomCssToggle();
                    }
                }
            }, 500);
        } else {
            setTimeout(tryInitialize, 1000);
        }
    };

    tryInitialize();
})();