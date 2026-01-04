// ==UserScript==
// @name          KeepDeepSeek-Lite
// @description   Basic security and session maintenance for DeepSeek
// @version       2.1
// @author        Adapted for DeepSeek
// @match         *://chat.deepseek.com/*
// @grant         GM_xmlhttpRequest
// @grant         GM_setValue
// @grant         GM_getValue
// @grant         GM_addStyle
// @noframes
// @license       MIT
// @namespace https://greasyfork.org/users/567951
// @downloadURL https://update.greasyfork.org/scripts/524499/KeepDeepSeek-Lite.user.js
// @updateURL https://update.greasyfork.org/scripts/524499/KeepDeepSeek-Lite.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Cross-browser compatible configuration
    const config = {
        sessionCheckInterval: 55000,       // 55 seconds
        elementCheckInterval: 2000,        // 2 seconds
        maxRetries: 5,
        securityPatterns: [
            /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g,  // Credit cards
            /\b\d{3}[\s-]?\d{2}[\s-]?\d{4}\b/g,             // SSN
            /(\b|_)(password|api[_-]?key|secret)(\b|_)/gi   // Common sensitive terms
        ]
    };

    // DeepSeek-specific element selectors
    const selectors = {
        inputField: '#chat-input',
        sendButton: '[role=button].f6d670',
        chatContainer: '.f9bf7997.d7dc56a8',
        trackingElements: [
            '.tracking-pixel',
            '[class*="analytics"]',
            'img[src*="tracking"]'
        ].join(',')
    };

    // Core security functions
    const enhanceSecurity = {
        sanitizeInput: function() {
            const input = document.querySelector(selectors.inputField);
            if (input) {
                input.addEventListener('input', (e) => {
                    config.securityPatterns.forEach(pattern => {
                        if (pattern.test(e.target.value)) {
                            e.target.value = e.target.value.replace(pattern, '*****');
                            this.showWarning('Sensitive content detected!');
                        }
                    });
                });
            }
        },

        blockTracking: function() {
            const trackers = document.querySelectorAll(selectors.trackingElements);
            trackers.forEach(element => {
                element.remove();
            });
        },

        showWarning: function(message) {
            const warning = document.createElement('div');
            warning.style = 'position:fixed; top:20px; right:20px; padding:15px; background:#ff4444; color:white; z-index:9999;';
            warning.textContent = message;
            document.body.appendChild(warning);
            setTimeout(() => warning.remove(), 3000);
        }
    };

    // Session maintenance
    const maintainSession = {
        lastSuccess: 0,
        
        checkSession: function() {
            GM_xmlhttpRequest({
                method: 'GET',
                url: '/api/session',
                onload: (response) => {
                    if (response.status === 200) {
                        this.lastSuccess = Date.now();
                        try {
                            const data = JSON.parse(response.responseText);
                            this.handleSessionData(data);
                        } catch (e) {
                            console.error('Session parse error:', e);
                        }
                    }
                },
                onerror: (error) => {
                    console.error('Session check failed:', error);
                    this.retry();
                }
            });
        },

        handleSessionData: function(data) {
            if (data.expires_in) {
                const renewTime = Date.now() + (data.expires_in * 900); // 90% of TTL
                GM_setValue('sessionRenew', renewTime);
            }
        },

        retry: function() {
            if (config.maxRetries-- > 0) {
                setTimeout(() => this.checkSession(), 5000);
            }
        }
    };

    // Element observer
    const observeElements = {
        init: function() {
            this.observer = new MutationObserver(() => {
                enhanceSecurity.blockTracking();
                enhanceSecurity.sanitizeInput();
            });
            
            this.observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };

    // Initialization
    const initialize = () => {
        // Immediate element handling
        enhanceSecurity.blockTracking();
        enhanceSecurity.sanitizeInput();
        
        // Start periodic checks
        setInterval(maintainSession.checkSession.bind(maintainSession), config.sessionCheckInterval);
        setInterval(enhanceSecurity.blockTracking, config.elementCheckInterval);
        
        // Start observer
        observeElements.init();
    };

    // Start after DOM load
    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();