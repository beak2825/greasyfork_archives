// ==UserScript==
// @name         ChatGPT Session Token Extractor
// @namespace    https://greasyfork.org/en/users/866731-sharmanhall
// @version      1.0.1
// @description  Extract ChatGPT session token for iOS 15 legacy app with one-click floating button
// @author       sharmanhall
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544018/ChatGPT%20Session%20Token%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/544018/ChatGPT%20Session%20Token%20Extractor.meta.js
// ==/UserScript==

/*
MIT License

Copyright (c) 2025 sharmanhall

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

(function() {
    'use strict';

    const SCRIPT_NAME = 'ChatGPT Session Token Extractor';
    const VERSION = '1.0.0';
    
    // Verbose logging function
    function log(level, message, data = null) {
        const timestamp = new Date().toISOString();
        const prefix = `[${SCRIPT_NAME} v${VERSION}] [${level.toUpperCase()}] ${timestamp}:`;
        
        if (data) {
            console[level](prefix, message, data);
        } else {
            console[level](prefix, message);
        }
    }

    // Function to get the session token
    function getSessionToken() {
        log('info', 'Starting session token extraction...');
        
        // Method 1: Try document.cookie (may not work for __Secure cookies)
        const cookies = document.cookie.split(';');
        log('debug', `Found ${cookies.length} cookies in document.cookie`);
        
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            log('debug', `Examining cookie: ${name}`);
            
            if (name === '__Secure-next-auth.session-token') {
                log('info', `Session token found via document.cookie! Length: ${value ? value.length : 0} characters`);
                log('debug', `Token preview: ${value ? value.substring(0, 10) + '...' : 'null'}`);
                return value;
            }
        }
        
        // Method 2: Try alternative cookie access methods
        log('info', 'Session token not found in document.cookie, trying alternative methods...');
        
        // Check if we can access via a different approach
        try {
            // Try to get all cookies and parse them more thoroughly
            const allCookies = document.cookie;
            log('debug', `All cookies string: ${allCookies.substring(0, 200)}...`);
            
            // Look for the token in the raw cookie string
            const tokenMatch = allCookies.match(/__Secure-next-auth\.session-token=([^;]+)/);
            if (tokenMatch && tokenMatch[1]) {
                const token = tokenMatch[1];
                log('info', `Session token found via regex! Length: ${token.length} characters`);
                log('debug', `Token preview: ${token.substring(0, 10)}...`);
                return token;
            }
        } catch (error) {
            log('error', 'Error in alternative cookie parsing:', error);
        }
        
        // Method 3: Manual instruction fallback
        log('warn', 'Session token not found automatically. This may be due to browser security restrictions on __Secure cookies.');
        log('info', 'Manual extraction instructions will be provided to user.');
        
        return null;
    }

    // Function to copy text to clipboard
    async function copyToClipboard(text) {
        log('info', 'Attempting to copy text to clipboard...');
        
        try {
            await navigator.clipboard.writeText(text);
            log('info', 'Successfully copied to clipboard using Clipboard API');
            return true;
        } catch (err) {
            log('warn', 'Clipboard API failed, trying fallback method', err);
            
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.opacity = '0';
            document.body.appendChild(textArea);
            textArea.select();
            textArea.setSelectionRange(0, 99999);
            
            const success = document.execCommand('copy');
            document.body.removeChild(textArea);
            
            if (success) {
                log('info', 'Successfully copied to clipboard using fallback method');
            } else {
                log('error', 'Failed to copy to clipboard with fallback method');
            }
            
            return success;
        }
    }

    // Function to show notification
    function showNotification(message, isSuccess = true) {
        log('info', `Showing ${isSuccess ? 'success' : 'error'} notification: ${message.replace(/\n/g, ' ')}`);
        
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 20px;
            background: ${isSuccess ? '#4CAF50' : '#f44336'};
            color: white;
            border-radius: 8px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            z-index: 10000;
            max-width: 350px;
            white-space: pre-line;
            word-wrap: break-word;
            animation: slideIn 0.3s ease-out;
            line-height: 1.4;
        `;
        
        // Add CSS animation
        if (!document.getElementById('token-extractor-styles')) {
            const style = document.createElement('style');
            style.id = 'token-extractor-styles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        log('debug', 'Notification element created and added to DOM');
        
        // Longer timeout for manual instructions
        const timeout = message.includes('Manual Steps') ? 10000 : 4000;
        
        setTimeout(() => {
            notification.remove();
            log('debug', 'Notification removed from DOM');
        }, timeout);
    }

    // Create the floating button
    function createTokenButton() {
        log('info', 'Creating floating token extraction button...');
        
        const button = document.createElement('button');
        button.innerHTML = '🔑';
        button.title = 'Copy ChatGPT Session Token for iOS 15';
        button.id = 'chatgpt-token-extractor-btn';
        button.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: none;
            color: white;
            font-size: 24px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            z-index: 9999;
            transition: all 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        // Hover effects
        button.addEventListener('mouseenter', () => {
            log('debug', 'Button hover started');
            button.style.transform = 'scale(1.1)';
            button.style.boxShadow = '0 6px 25px rgba(102, 126, 234, 0.6)';
        });

        button.addEventListener('mouseleave', () => {
            log('debug', 'Button hover ended');
            button.style.transform = 'scale(1)';
            button.style.boxShadow = '0 4px 20px rgba(102, 126, 234, 0.4)';
        });

        // Click handler
        button.addEventListener('click', async (event) => {
            log('info', 'Token extraction button clicked');
            event.preventDefault();
            
            const token = getSessionToken();
            
            if (token) {
                log('info', 'Token found, attempting to copy to clipboard...');
                const success = await copyToClipboard(token);
                
                if (success) {
                    log('info', 'Token successfully copied to clipboard');
                    showNotification(`✅ Session token copied!\nLength: ${token.length} chars\nReady to paste in ChatGPTWebV15!`);
                    
                    // Visual feedback
                    button.style.background = '#4CAF50';
                    button.innerHTML = '✅';
                    log('debug', 'Button visual feedback applied');
                    
                    setTimeout(() => {
                        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                        button.innerHTML = '🔑';
                        log('debug', 'Button visual feedback reset');
                    }, 2000);
                } else {
                    log('error', 'Failed to copy token to clipboard');
                    showNotification('❌ Failed to copy token to clipboard', false);
                }
            } else {
                log('warn', 'No session token found when button clicked');
                showNotification(`❌ Session token not accessible via script.\n\n📋 Manual Steps:\n1. Open DevTools (F12)\n2. Go to Application → Storage → Cookies → chatgpt.com\n3. Find "__Secure-next-auth.session-token"\n4. Copy its Value\n5. Paste in ChatGPTWebV15`, false);
                
                // Change button to indicate manual mode
                button.style.background = '#FF9800';
                button.innerHTML = '📋';
                button.title = 'Manual extraction needed - see notification for steps';
                
                setTimeout(() => {
                    button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
                    button.innerHTML = '🔑';
                    button.title = 'Copy ChatGPT Session Token for iOS 15';
                }, 5000);
            }
        });

        log('info', 'Token extraction button created successfully');
        return button;
    }

    // Wait for page to load and create button
    function init() {
        log('info', `Initializing ${SCRIPT_NAME} v${VERSION}...`);
        log('debug', `Page readyState: ${document.readyState}`);
        log('debug', `Current URL: ${window.location.href}`);
        
        if (document.readyState === 'loading') {
            log('info', 'Page still loading, waiting for DOMContentLoaded...');
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        // Check if we're on the right page
        const isValidDomain = window.location.hostname.includes('chatgpt.com') || 
                             window.location.hostname.includes('chat.openai.com');
        
        log('debug', `Valid domain check: ${isValidDomain} (hostname: ${window.location.hostname})`);
        
        if (!isValidDomain) {
            log('warn', 'Script loaded on non-ChatGPT domain, exiting');
            return;
        }

        // Check if button already exists (prevent duplicates)
        if (document.getElementById('chatgpt-token-extractor-btn')) {
            log('warn', 'Token extractor button already exists, skipping creation');
            return;
        }

        // Create and add the button
        const tokenButton = createTokenButton();
        document.body.appendChild(tokenButton);
        log('info', 'Token extractor button added to page');

        // Show initial notification
        setTimeout(() => {
            log('info', 'Showing welcome notification');
            showNotification(`🔑 ${SCRIPT_NAME} loaded!\nClick the key button to copy your session token.`);
        }, 2000);
        
        log('info', 'Initialization complete');
    }

    // Start the script
    log('info', `Starting ${SCRIPT_NAME} v${VERSION}...`);
    init();
})();