// ==UserScript==
// @name              Web Test Bypass Copy&Paste
// @name:en           Web Test Bypass Copy&Paste
// @name:ja           webテストコピペバイパス

// @namespace         https://educational-tools.example.com
// @version           2.0.1-universal
// @description       Universal script to enable copy/paste on any webpage and local files
// @description:en    Universal script to enable copy/paste on any webpage and local files
// @description:zh    通用脚本，可在任何网页和本地文件上启用复制/粘贴
// @description:ja    あらゆるウェブページとローカルファイルでコピー/ペーストを有効にする汎用スクリプト

// @author            Educational Tools
// @license           MIT

// @match             *://*/*
// @match             file://*/*
// @include           *
// @include           file://*

// @grant             GM_addStyle
// @grant             unsafeWindow
// @run-at            document-start

// @downloadURL https://update.greasyfork.org/scripts/540646/Web%20Test%20Bypass%20CopyPaste.user.js
// @updateURL https://update.greasyfork.org/scripts/540646/Web%20Test%20Bypass%20CopyPaste.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const config = {
        debug: false,
        aggressive: true,
        includeFrames: true,
        continuousMode: true
    };

    // Log function for debugging
    function log(...args) {
        if (config.debug) {
            console.log('[Universal Copy Enable]', ...args);
        }
    }

    // Main initialization
    function initialize() {
        log('Initializing Universal Copy Enable');
        
        // Apply to main window
        applyToContext(window);
        
        // Apply to unsafeWindow if available (for Greasemonkey/Tampermonkey compatibility)
        if (typeof unsafeWindow !== 'undefined' && unsafeWindow !== window) {
            applyToContext(unsafeWindow);
        }
        
        // Set up continuous monitoring
        if (config.continuousMode) {
            setInterval(() => {
                removeAllRestrictions();
                if (config.includeFrames) {
                    processFrames();
                }
            }, 3000);
        }
        
        // Apply CSS globally
        injectGlobalCSS();
        
        // Set up mutation observer
        setupMutationObserver();
        
        // Handle special cases
        handleSpecialCases();
    }

    // Apply copy-enabling to a specific context (window/frame)
    function applyToContext(ctx) {
        try {
            // Override restrictive functions
            overrideRestrictiveFunctions(ctx);
            
            // Enable event handlers
            enableEventHandlers(ctx);
            
            // Clear existing restrictions
            clearContextRestrictions(ctx);
            
            log('Applied to context:', ctx);
        } catch (e) {
            log('Error applying to context:', e);
        }
    }

    // Override functions that might prevent copying
    function overrideRestrictiveFunctions(ctx) {
        // Save original functions
        const originals = {
            addEventListener: ctx.EventTarget?.prototype?.addEventListener,
            preventDefault: ctx.Event?.prototype?.preventDefault,
            stopPropagation: ctx.Event?.prototype?.stopPropagation
        };
        
        // List of events to intercept
        const restrictedEvents = [
            'copy', 'cut', 'paste', 'select', 'selectstart',
            'contextmenu', 'dragstart', 'dragend', 'drag',
            'beforecopy', 'beforecut', 'beforepaste'
        ];
        
        // Override addEventListener
        if (ctx.EventTarget?.prototype) {
            ctx.EventTarget.prototype.addEventListener = function(type, listener, options) {
                if (restrictedEvents.includes(type)) {
                    log('Blocked addEventListener for:', type);
                    return;
                }
                return originals.addEventListener?.call(this, type, listener, options);
            };
        }
        
        // Override preventDefault for specific events
        if (ctx.Event?.prototype) {
            ctx.Event.prototype.preventDefault = function() {
                if (restrictedEvents.includes(this.type)) {
                    log('Blocked preventDefault for:', this.type);
                    return;
                }
                return originals.preventDefault?.call(this);
            };
            
            ctx.Event.prototype.stopPropagation = function() {
                if (restrictedEvents.includes(this.type)) {
                    log('Blocked stopPropagation for:', this.type);
                    return;
                }
                return originals.stopPropagation?.call(this);
            };
        }
        
        // Override document.write protection
        if (ctx.document) {
            const originalWrite = ctx.document.write;
            ctx.document.write = function(...args) {
                log('document.write intercepted');
                return originalWrite.apply(this, args);
            };
        }
    }

    // Enable copy/paste event handlers
    function enableEventHandlers(ctx) {
        const doc = ctx.document;
        if (!doc) return;
        
        // Event handler that allows the event
        const allowEvent = (e) => {
            e.stopImmediatePropagation();
            return true;
        };
        
        // Events to enable
        const events = [
            'copy', 'cut', 'paste', 'select', 'selectstart',
            'contextmenu', 'dragstart', 'beforecopy', 'beforecut'
        ];
        
        // Add listeners with maximum priority
        events.forEach(eventName => {
            doc.addEventListener(eventName, allowEvent, true);
            ctx.addEventListener(eventName, allowEvent, true);
        });
        
        // Special handling for keyboard shortcuts
        doc.addEventListener('keydown', (e) => {
            // Allow all Ctrl/Cmd combinations
            if (e.ctrlKey || e.metaKey) {
                const key = e.key.toLowerCase();
                if (['a', 'c', 'x', 'v'].includes(key)) {
                    e.stopImmediatePropagation();
                    return true;
                }
            }
        }, true);
    }

    // Clear restrictions from context
    function clearContextRestrictions(ctx) {
        const doc = ctx.document;
        if (!doc) return;
        
        // Events to clear
        const events = [
            'copy', 'cut', 'paste', 'select', 'selectstart',
            'contextmenu', 'mousedown', 'mouseup', 'selectend',
            'dragstart', 'dragend', 'drag', 'beforecopy',
            'beforecut', 'beforepaste', 'keydown', 'keyup'
        ];
        
        // Clear document and window handlers
        events.forEach(evt => {
            doc['on' + evt] = null;
            ctx['on' + evt] = null;
            
            // Remove attributes
            if (doc.documentElement?.removeAttribute) {
                doc.documentElement.removeAttribute('on' + evt);
            }
            if (doc.body?.removeAttribute) {
                doc.body.removeAttribute('on' + evt);
            }
        });
        
        // Process all elements
        const elements = doc.querySelectorAll('*');
        elements.forEach(el => {
            events.forEach(evt => {
                el['on' + evt] = null;
                if (el.removeAttribute) {
                    el.removeAttribute('on' + evt);
                }
            });
            
            // Force selection styles
            if (el.style) {
                el.style.userSelect = 'text';
                el.style.webkitUserSelect = 'text';
                el.style.MozUserSelect = 'text';
                el.style.msUserSelect = 'text';
                el.style.KhtmlUserSelect = 'text';
                el.style.pointerEvents = 'auto';
            }
        });
    }

    // Inject global CSS
    function injectGlobalCSS() {
        const css = `
            /* Universal text selection enabler */
            *, *::before, *::after {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
                -webkit-user-drag: auto !important;
                -webkit-touch-callout: default !important;
            }
            
            /* Specific elements that often have selection disabled */
            body, div, span, p, a, h1, h2, h3, h4, h5, h6,
            pre, code, blockquote, em, strong, i, b, u,
            table, tr, td, th, tbody, thead, tfoot,
            ul, ol, li, dl, dt, dd,
            article, section, nav, aside, header, footer, main,
            form, input, textarea, select, option, label, button,
            img, video, audio, canvas, svg {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                -ms-user-select: text !important;
                user-select: text !important;
            }
            
            /* Selection highlighting */
            ::selection {
                background-color: #338FFF !important;
                color: white !important;
            }
            
            ::-moz-selection {
                background-color: #338FFF !important;
                color: white !important;
            }
            
            /* Override inline styles */
            [style*="user-select: none" i],
            [style*="user-select:none" i] {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                user-select: text !important;
            }
            
            /* Ensure pointer events */
            [style*="pointer-events: none" i],
            [style*="pointer-events:none" i] {
                pointer-events: auto !important;
            }
            
            /* Remove overlays that might block selection */
            [class*="overlay" i]:not(input):not(textarea),
            [id*="overlay" i]:not(input):not(textarea),
            [class*="modal-backdrop" i],
            [class*="cover" i]:not(input):not(textarea) {
                pointer-events: none !important;
            }
            
            /* Special handling for code blocks */
            pre, code, .hljs, [class*="highlight" i] {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                user-select: text !important;
            }
            
            /* Disable any custom cursors that might interfere */
            * {
                cursor: auto !important;
            }
            
            *:hover {
                cursor: auto !important;
            }
            
            /* For view-source pages */
            .line-number, .source-line {
                -webkit-user-select: text !important;
                -moz-user-select: text !important;
                user-select: text !important;
            }
        `;
        
        if (GM_addStyle) {
            GM_addStyle(css);
        } else {
            const style = document.createElement('style');
            style.textContent = css;
            (document.head || document.documentElement).appendChild(style);
        }
    }

    // Remove all restrictions (called periodically)
    function removeAllRestrictions() {
        applyToContext(window);
        clearContextRestrictions(window);
    }

    // Process iframes
    function processFrames() {
        try {
            const frames = document.querySelectorAll('iframe, frame');
            frames.forEach(frame => {
                try {
                    if (frame.contentWindow) {
                        applyToContext(frame.contentWindow);
                    }
                } catch (e) {
                    // Cross-origin frame, skip
                }
            });
        } catch (e) {
            log('Error processing frames:', e);
        }
    }

    // Set up mutation observer
    function setupMutationObserver() {
        if (!window.MutationObserver) return;
        
        const observer = new MutationObserver((mutations) => {
            let shouldReapply = false;
            
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    shouldReapply = true;
                }
                if (mutation.type === 'attributes' && 
                    (mutation.attributeName === 'style' || 
                     mutation.attributeName?.startsWith('on'))) {
                    shouldReapply = true;
                }
            });
            
            if (shouldReapply) {
                removeAllRestrictions();
            }
        });
        
        const startObserving = () => {
            const target = document.body || document.documentElement;
            if (target) {
                observer.observe(target, {
                    childList: true,
                    subtree: true,
                    attributes: true,
                    attributeFilter: ['style', 'oncontextmenu', 'onselectstart', 'oncopy']
                });
            } else {
                setTimeout(startObserving, 100);
            }
        };
        
        startObserving();
    }

    // Handle special cases for specific types of pages
    function handleSpecialCases() {
        // For view-source pages
        if (window.location.href.startsWith('view-source:')) {
            document.addEventListener('DOMContentLoaded', () => {
                const preElements = document.querySelectorAll('pre');
                preElements.forEach(pre => {
                    pre.style.userSelect = 'text';
                    pre.style.webkitUserSelect = 'text';
                });
            });
        }
        
        // For PDF viewers
        if (document.querySelector('embed[type="application/pdf"]')) {
            log('PDF detected, applying special handling');
        }
        
        // For code highlighting libraries
        setTimeout(() => {
            const codeBlocks = document.querySelectorAll('pre code, .hljs, .highlight');
            codeBlocks.forEach(block => {
                block.style.userSelect = 'text';
                block.style.webkitUserSelect = 'text';
            });
        }, 1000);
    }

    // Initialize immediately and on various load events
    initialize();
    
    // Reinitialize on different load stages
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    }
    window.addEventListener('load', initialize);
    
    // For single-page applications
    let lastUrl = location.href;
    new MutationObserver(() => {
        const url = location.href;
        if (url !== lastUrl) {
            lastUrl = url;
            setTimeout(initialize, 100);
        }
    }).observe(document, {subtree: true, childList: true});

    log('Universal Copy Enable loaded successfully');
})();