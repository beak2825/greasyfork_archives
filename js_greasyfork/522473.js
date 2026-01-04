// ==UserScript==
// @name         Claude Chat Data Capture
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Captures Claude chat conversation data and saves to local storage
// @author       nickm8
// @match        https://claude.ai/chat/*
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522473/Claude%20Chat%20Data%20Capture.user.js
// @updateURL https://update.greasyfork.org/scripts/522473/Claude%20Chat%20Data%20Capture.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Debug logging
    const DEBUG = true;
    const log = {
        debug: (...args) => DEBUG && console.log('🔍 CAPTURE:', ...args),
        error: (...args) => console.error('❌ CAPTURE:', ...args),
        info: (...args) => console.log('ℹ️ CAPTURE:', ...args)
    };

    // Configuration
    const CONFIG = {
        urlPattern: 'chat_conversations/',
        ignorePatterns: ['chat_message_warning', 'latest'],
        storageKey: 'captured_chat_data',
        saveInterval: 1000,
        isEnabled: true
    };

    // Create toggle button
    function createToggleButton() {
        const button = document.createElement('button');
        button.innerHTML = '✔️';
        button.title = 'Toggle Chat Capture (Currently Active)';
        button.style.cssText = `
            position: fixed;
            right: 20px;
            bottom: 10px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            border: none;
            background: transparent;
            cursor: pointer;
            z-index: 9999;
            padding: 0;
            opacity: 0.5;
            transition: opacity 0.3s;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        button.addEventListener('mouseover', () => {
            button.style.opacity = '1';
        });

        button.addEventListener('mouseout', () => {
            button.style.opacity = '0.5';
        });

        button.addEventListener('click', () => {
            CONFIG.isEnabled = !CONFIG.isEnabled;
            button.innerHTML = CONFIG.isEnabled ? '✔️' : '❌';
            button.title = `Toggle Chat Capture (Currently ${CONFIG.isEnabled ? 'Active' : 'Inactive'})`;
            log.info(`Capture ${CONFIG.isEnabled ? 'enabled' : 'disabled'}`);
        });

        document.body.appendChild(button);
    }

    // State
    let capturedData = [];

    // Safe URL checker
    function extractUrl(request) {
        if (typeof request === 'string') return request;
        if (request instanceof URL) return request.href;
        if (request instanceof Request) return request.url;
        if (typeof request === 'object' && request.url) return request.url;
        return null;
    }

    function shouldCaptureUrl(request) {
        // Check if capturing is enabled
        if (!CONFIG.isEnabled) return false;
        
        try {
            const url = extractUrl(request);
            if (!url) {
                log.debug('Invalid URL format:', request);
                return false;
            }

            const shouldCapture = url.includes(CONFIG.urlPattern) && 
                                !CONFIG.ignorePatterns.some(pattern => url.includes(pattern));
            
            log.debug(`URL: ${url}, Should capture: ${shouldCapture}`);
            return shouldCapture;
        } catch (error) {
            log.error('Error in shouldCaptureUrl:', error);
            return false;
        }
    }

    // Storage management
    function saveToStorage() {
        if (capturedData.length === 0) return;

        try {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(capturedData));
            log.info(`Saved ${capturedData.length} items to storage`);
            capturedData = [];
        } catch (error) {
            log.error('Storage save failed:', error);
        }
    }

    // Response processing
    async function processResponse(response, url) {
        try {
            const contentType = response.headers.get('content-type');
            if (!contentType?.toLowerCase().includes('application/json')) {
                log.debug('Not JSON content:', contentType);
                return;
            }

            const json = await response.json();
            capturedData.push({
                timestamp: new Date().toISOString(),
                url,
                data: json
            });

            log.debug('Captured new data:', url);
        } catch (error) {
            log.error('Error processing response:', error);
        }
    }

    // Fetch interceptor
    const originalFetch = window.fetch;
    window.fetch = async function(...args) {
        const response = await originalFetch.apply(this, args);
        
        try {
            if (shouldCaptureUrl(args[0])) {
                const url = extractUrl(args[0]);
                await processResponse(response.clone(), url);
            }
        } catch (error) {
            log.error('Fetch intercept error:', error);
        }

        return response;
    };

    // XHR interceptor
    const originalXHROpen = XMLHttpRequest.prototype.open;
    const originalXHRSend = XMLHttpRequest.prototype.send;

    XMLHttpRequest.prototype.open = function(...args) {
        this._url = args[1];
        return originalXHROpen.apply(this, args);
    };

    XMLHttpRequest.prototype.send = function(...args) {
        if (shouldCaptureUrl(this._url)) {
            this.addEventListener('load', function() {
                try {
                    const contentType = this.getResponseHeader('content-type');
                    if (contentType?.toLowerCase().includes('application/json')) {
                        const json = JSON.parse(this.responseText);
                        capturedData.push({
                            timestamp: new Date().toISOString(),
                            url: this._url,
                            data: json
                        });
                        log.debug('Captured XHR data:', this._url);
                    }
                } catch (error) {
                    log.error('XHR process error:', error);
                }
            });
        }
        return originalXHRSend.apply(this, args);
    };

    // Save timer
    setInterval(saveToStorage, CONFIG.saveInterval);

    // Save on page unload
    window.addEventListener('beforeunload', saveToStorage);

    // Initialize
    log.info('Chat data capture initialized');
    
    // Wait for DOM to be ready before adding button
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createToggleButton);
    } else {
        createToggleButton();
    }
    
    // Expose debug helper
    window.getChatCaptures = () => {
        const data = localStorage.getItem(CONFIG.storageKey);
        return data ? JSON.parse(data) : [];
    };
})();