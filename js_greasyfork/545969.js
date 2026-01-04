// ==UserScript==
// @name         Comick.dev Native Zoom Control
// @namespace    https://github.com/GooglyBlox
// @version      1.1
// @description  Redirects browser zoom shortcuts to use comick.dev's native zoom system
// @author       GooglyBlox
// @match        https://comick.dev/*
// @grant        none
// @run-at       document-start
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/545969/Comickdev%20Native%20Zoom%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/545969/Comickdev%20Native%20Zoom%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let zoomControls = null;
    let lastControlsSearch = 0;
    const SEARCH_THROTTLE = 500;

    function findZoomControls() {
        const now = Date.now();
        if (now - lastControlsSearch < SEARCH_THROTTLE && zoomControls) {
            return zoomControls;
        }
        lastControlsSearch = now;

        const zoomContainer = document.getElementById('zoom-btn');
        if (!zoomContainer) {
            zoomControls = null;
            return null;
        }

        const buttons = zoomContainer.querySelectorAll('button');
        if (buttons.length < 2) {
            zoomControls = null;
            return null;
        }

        let zoomOut = null;
        let zoomIn = null;

        buttons.forEach(button => {
            const svg = button.querySelector('svg');
            if (svg) {
                const path = svg.querySelector('path');
                if (path) {
                    const d = path.getAttribute('d');
                    if (d === 'M5 12h14') {
                        zoomOut = button;
                    } else if (d === 'M12 4.5v15m7.5-7.5h-15') {
                        zoomIn = button;
                    }
                }
            }
        });

        if (!zoomOut && !zoomIn) {
            zoomOut = buttons[0];
            zoomIn = buttons[1];
        }

        if (zoomOut && zoomIn) {
            zoomControls = { zoomIn, zoomOut };
            return zoomControls;
        }

        zoomControls = null;
        return null;
    }

    function triggerZoomIn() {
        const controls = findZoomControls();
        if (controls && controls.zoomIn) {
            controls.zoomIn.click();
            return true;
        }
        return false;
    }

    function triggerZoomOut() {
        const controls = findZoomControls();
        if (controls && controls.zoomOut) {
            controls.zoomOut.click();
            return true;
        }
        return false;
    }

    function isZoomShortcut(event) {
        const isModifierPressed = event.ctrlKey || event.metaKey;
        if (!isModifierPressed) return null;

        if (event.code === 'Equal' || event.code === 'NumpadAdd' || event.key === '=' || event.key === '+') {
            return 'in';
        }

        if (event.code === 'Minus' || event.code === 'NumpadSubtract' || event.key === '-') {
            return 'out';
        }

        return null;
    }

    function handleKeydown(event) {
        const zoomDirection = isZoomShortcut(event);
        if (!zoomDirection) return;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (zoomDirection === 'in') {
            triggerZoomIn();
        } else if (zoomDirection === 'out') {
            triggerZoomOut();
        }
    }

    function setupEventListeners() {
        document.addEventListener('keydown', handleKeydown, { capture: true, passive: false });

        const observer = new MutationObserver(function(mutations) {
            let shouldRefresh = false;
            for (const mutation of mutations) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1) {
                            if (node.id === 'zoom-btn' || (node.querySelector && node.querySelector('#zoom-btn'))) {
                                shouldRefresh = true;
                                break;
                            }
                        }
                    }
                    if (shouldRefresh) break;
                }
            }
            if (shouldRefresh) {
                zoomControls = null;
                setTimeout(findZoomControls, 100);
            }
        });

        if (document.body) {
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                observer.observe(document.body, { childList: true, subtree: true });
            });
        }
    }

    function handleSPANavigation() {
        const originalPushState = history.pushState;
        const originalReplaceState = history.replaceState;

        history.pushState = function() {
            originalPushState.apply(history, arguments);
            setTimeout(() => {
                zoomControls = null;
                findZoomControls();
            }, 200);
        };

        history.replaceState = function() {
            originalReplaceState.apply(history, arguments);
            setTimeout(() => {
                zoomControls = null;
                findZoomControls();
            }, 200);
        };

        window.addEventListener('popstate', () => {
            setTimeout(() => {
                zoomControls = null;
                findZoomControls();
            }, 200);
        });
    }

    function init() {
        setupEventListeners();
        handleSPANavigation();
        setTimeout(findZoomControls, 1000);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();