// ==UserScript==
// @name         MC-TR Reklam Engelleyici
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  MC-TR sitesi için reklam engelleyici
// @author       sheduxdev
// @match        https://www.mc-tr.com/*
// @match        https://mc-tr.com/*
// @grant        none
// @license MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/547120/MC-TR%20Reklam%20Engelleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/547120/MC-TR%20Reklam%20Engelleyici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const specificIds = [
        'rIleFXvaSwMhZ',
        'biVxWDWqzATjnb',
        'TfTyJxauibAHELPdrPqhyYn',
        'sYXWhmxnZVVmjJTgrcMYmY',
        'zYRhoplYEdjEdeJyKuSmQuW',
        'UhQeerVgVnNZIHAB',
        'TlgsiEMiHDEiIoSzyNyi'
    ];

    const adSelectors = [
        ...specificIds.map(id => `#${id}`),
        ...specificIds.map(id => `.${id}`),
        ...specificIds.map(id => `[id="${id}"]`),
        ...specificIds.map(id => `[class*="${id}"]`),
        '.advertisement',
        '.ads',
        '.adsbygoogle',
        '.ad-banner',
        '.ad-container',
        '.sponsored',
        '.promotion',
        '.popup-ad',
        '[class*="ad-"]',
        '[class*="ads-"]',
        '[id*="ad-"]',
        '[id*="ads-"]',
        'iframe[src*="googlesyndication"]',
        'iframe[src*="doubleclick"]',
        'iframe[src*="adsystem"]',
        '.modal-backdrop',
        '.popup-overlay',
        '.overlay',
        '.modal',
        '.popup'
    ];

    const hideAds = () => {
        const style = document.createElement('style');
        style.textContent = `
            ${adSelectors.join(', ')} {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                width: 0 !important;
                position: absolute !important;
                left: -9999px !important;
                top: -9999px !important;
                z-index: -9999 !important;
            }

            ${specificIds.map(id => `#${id}, .${id}, [id="${id}"], [class*="${id}"]`).join(', ')} {
                display: none !important;
                visibility: hidden !important;
                opacity: 0 !important;
                height: 0 !important;
                width: 0 !important;
                position: absolute !important;
                left: -10000px !important;
                top: -10000px !important;
                z-index: -10000 !important;
                pointer-events: none !important;
            }

            .popup, .modal, .overlay, .lightbox, .backdrop {
                display: none !important;
                visibility: hidden !important;
            }

            html, body {
                overflow: auto !important;
                overflow-x: auto !important;
                overflow-y: auto !important;
                position: static !important;
                height: auto !important;
                max-height: none !important;
            }

            body.popup-active,
            body.modal-open,
            body.no-scroll,
            body.scroll-disabled,
            html.popup-active,
            html.modal-open,
            html.no-scroll,
            html.scroll-disabled {
                overflow: auto !important;
                overflow-y: auto !important;
                position: static !important;
                height: auto !important;
                max-height: none !important;
            }

            body.popup-active, html.popup-active, .blurred, .disabled {
                filter: none !important;
                pointer-events: auto !important;
                user-select: auto !important;
            }

            div[style*="position: fixed"],
            div[style*="position:fixed"] {
                position: static !important;
            }
        `;
        
        if (document.head) {
            document.head.appendChild(style);
        } else {
            document.addEventListener('DOMContentLoaded', () => {
                if (document.head) {
                    document.head.appendChild(style);
                }
            });
        }
    };

    const safeQuerySelectorAll = (selector, parent = document) => {
        try {
            if (!parent || typeof parent.querySelectorAll !== 'function') {
                return [];
            }
            return Array.from(parent.querySelectorAll(selector) || []);
        } catch (e) {
            return [];
        }
    };

    const safeRemoveElement = (element) => {
        try {
            if (element && element.parentNode && typeof element.parentNode.removeChild === 'function') {
                element.parentNode.removeChild(element);
            }
        } catch (e) {
            try {
                if (element && typeof element.remove === 'function') {
                    element.remove();
                }
            } catch (e2) {
                // ignore
            }
        }
    };

    const removeAdElements = () => {
        if (!document.body) {
            return;
        }

        specificIds.forEach(id => {
            const selectors = [`#${id}`, `.${id}`, `[id="${id}"]`, `[class*="${id}"]`];
            selectors.forEach(selector => {
                const elements = safeQuerySelectorAll(selector);
                elements.forEach(safeRemoveElement);
            });
        });

        adSelectors.forEach(selector => {
            const elements = safeQuerySelectorAll(selector);
            elements.forEach(safeRemoveElement);
        });

        const popups = safeQuerySelectorAll('.popup, .modal, [class*="popup"], [class*="modal"], .overlay, .backdrop');
        popups.forEach(safeRemoveElement);

        enableScroll();
    };

    const safeClassListAction = (element, action, className) => {
        try {
            if (element && element.classList && typeof element.classList[action] === 'function') {
                element.classList[action](className);
            }
        } catch (e) {
            // ignore
        }
    };

    const enableScroll = () => {
        if (!document.body || !document.documentElement) {
            return;
        }

        const scrollDisablingClasses = [
            'popup-active', 'modal-open', 'no-scroll', 'scroll-disabled', 'overlay-active',
            'frozen', 'locked', 'fixed', 'noscroll', 'disable-scroll', 'scroll-lock',
            'modal-active', 'popup-open', 'overlay-open', 'dialog-open'
        ];

        scrollDisablingClasses.forEach(className => {
            safeClassListAction(document.body, 'remove', className);
            safeClassListAction(document.documentElement, 'remove', className);
        });

        const forceScrollStyles = (element) => {
            if (!element || !element.style) return;
            
            try {
                element.style.setProperty('overflow', 'auto', 'important');
                element.style.setProperty('overflow-x', 'auto', 'important');
                element.style.setProperty('overflow-y', 'auto', 'important');
                element.style.setProperty('position', 'static', 'important');
                element.style.setProperty('height', 'auto', 'important');
                element.style.setProperty('max-height', 'none', 'important');
                element.style.setProperty('touch-action', 'auto', 'important');
                element.style.setProperty('pointer-events', 'auto', 'important');
                element.style.setProperty('user-select', 'auto', 'important');
                element.style.removeProperty('filter');
                element.style.removeProperty('backdrop-filter');
            } catch (e) {
                // ignore
            }
        };

        forceScrollStyles(document.body);
        forceScrollStyles(document.documentElement);

        const fixedElements = safeQuerySelectorAll('*');
        fixedElements.forEach(el => {
            try {
                if (!el || !window.getComputedStyle) return;
                
                const computedStyle = window.getComputedStyle(el);
                if (computedStyle.position === 'fixed' &&
                    (computedStyle.zIndex > 1000 ||
                     el.style.zIndex > 1000 ||
                     el.classList.contains('overlay') ||
                     el.classList.contains('modal') ||
                     el.classList.contains('popup'))) {
                    el.style.setProperty('display', 'none', 'important');
                }
            } catch (e) {
                // ignore
            }
        });

        if (document.removeEventListener) {
            document.removeEventListener('wheel', preventDefault, { passive: false });
            document.removeEventListener('touchmove', preventDefault, { passive: false });
            document.removeEventListener('scroll', preventDefault, { passive: false });
        }

        if (window.addEventListener) {
            window.addEventListener('wheel', allowScroll, { passive: true });
            window.addEventListener('touchmove', allowScroll, { passive: true });
        }

        const scrollStyle = document.getElementById('force-scroll-style');
        if (!scrollStyle && document.head) {
            const style = document.createElement('style');
            style.id = 'force-scroll-style';
            style.textContent = `
                html, body {
                    overflow: auto !important;
                    overflow-y: scroll !important;
                    position: static !important;
                    height: auto !important;
                    max-height: none !important;
                    touch-action: auto !important;
                    pointer-events: auto !important;
                    user-select: auto !important;
                    -webkit-overflow-scrolling: touch !important;
                }

                body *, html * {
                    pointer-events: auto !important;
                    user-select: auto !important;
                }

                div[style*="position: fixed"],
                div[style*="position:fixed"],
                [style*="z-index: 9999"],
                [style*="z-index:9999"],
                [style*="z-index: 999999"],
                [class*="overlay"],
                [class*="modal"],
                [class*="popup"] {
                    display: none !important;
                    visibility: hidden !important;
                }
            `;
            document.head.appendChild(style);
        }
    };

    const preventDefault = (e) => {
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }
        return false;
    };

    const allowScroll = (e) => {
        return true;
    };

    const blockDetection = () => {
        try {
            window.adblockDetected = false;
            window.adBlockEnabled = false;

            Object.defineProperty(window, 'adblockDetected', {
                get: () => false,
                set: () => false
            });

            if (EventTarget && EventTarget.prototype && EventTarget.prototype.addEventListener) {
                const originalAddEventListener = EventTarget.prototype.addEventListener;
                EventTarget.prototype.addEventListener = function(type, listener, options) {
                    if (type === 'wheel' || type === 'touchmove' || type === 'scroll') {
                        if (typeof listener === 'function') {
                            const listenerStr = listener.toString();
                            if (listenerStr.includes('preventDefault') ||
                                listenerStr.includes('return false') ||
                                listenerStr.includes('stopPropagation')) {
                                return;
                            }
                        }
                    }
                    return originalAddEventListener.call(this, type, listener, options);
                };
            }

            window.bodyScrollLock = {
                disableBodyScroll: () => {},
                enableBodyScroll: () => {},
                clearAllBodyScrollLocks: () => {}
            };

            if (window.console) {
                const originalConsole = window.console;
                window.console = {
                    ...originalConsole,
                    warn: (...args) => {
                        const message = args.join(' ');
                        if (!message.toLowerCase().includes('adblock') &&
                            !message.toLowerCase().includes('ad block')) {
                            originalConsole.warn(...args);
                        }
                    }
                };
            }

            if (CSSStyleDeclaration && CSSStyleDeclaration.prototype && CSSStyleDeclaration.prototype.setProperty) {
                const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
                CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
                    if (property === 'overflow' && (value === 'hidden' || value === 'scroll')) {
                        if (this.parentRule && this.parentRule.selectorText &&
                            (this.parentRule.selectorText.includes('body') ||
                             this.parentRule.selectorText.includes('html'))) {
                            return originalSetProperty.call(this, property, 'auto', 'important');
                        }
                    }
                    return originalSetProperty.call(this, property, value, priority);
                };
            }
        } catch (e) {
            // ignore
        }
    };

    const observeUrlChanges = () => {
        if (!document.body || !window.MutationObserver) {
            return;
        }

        let currentUrl = location.href;
        const observer = new MutationObserver(() => {
            try {
                if (currentUrl !== location.href) {
                    currentUrl = location.href;
                    setTimeout(() => {
                        removeAdElements();
                    }, 500);
                }
            } catch (e) {
                // ignore
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    };

    const safeAddEventListener = (target, event, handler, options) => {
        try {
            if (target && typeof target.addEventListener === 'function') {
                target.addEventListener(event, handler, options);
            }
        } catch (e) {
            // ignore
        }
    };

    const init = () => {
        hideAds();
        blockDetection();

        if (document.readyState === 'loading') {
            safeAddEventListener(document, 'DOMContentLoaded', () => {
                removeAdElements();
                observeUrlChanges();
            });
        } else {
            removeAdElements();
            observeUrlChanges();
        }

        setInterval(() => {
            try {
                removeAdElements();
                enableScroll();
            } catch (e) {
                // ignore
            }
        }, 500);

        safeAddEventListener(document, 'keydown', (e) => {
            enableScroll();
            if (e && e.key === 'Escape') {
                setTimeout(() => {
                    removeAdElements();
                    enableScroll();
                }, 100);
            }
        });

        safeAddEventListener(document, 'click', () => {
            setTimeout(() => {
                removeAdElements();
                enableScroll();
            }, 100);
        });

        safeAddEventListener(window, 'scroll', enableScroll, { passive: true });
        safeAddEventListener(window, 'wheel', enableScroll, { passive: true });
        safeAddEventListener(window, 'touchmove', enableScroll, { passive: true });
        safeAddEventListener(window, 'focus', enableScroll);
        safeAddEventListener(window, 'blur', enableScroll);
    };

    init();

    if (window.MutationObserver) {
        const observer = new MutationObserver((mutations) => {
            try {
                let shouldCheck = false;
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                        shouldCheck = true;
                    }
                });

                if (shouldCheck) {
                    setTimeout(removeAdElements, 100);
                }
            } catch (e) {
                // ignore
            }
        });

        if (document.body) {
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        } else {
            safeAddEventListener(document, 'DOMContentLoaded', () => {
                if (document.body) {
                    observer.observe(document.body, {
                        childList: true,
                        subtree: true
                    });
                }
            });
        }
    }

})();