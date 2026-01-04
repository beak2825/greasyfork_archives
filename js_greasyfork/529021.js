// ==UserScript==
// @name         Android Anti-App Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Prevents automatic redirection to apps on Android browsers
// @author       You
// @match        *://*/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/529021/Android%20Anti-App%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/529021/Android%20Anti-App%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Configuration
    const DEBUG = false; // Set to true to enable console logging
    const PROMPT_TIMEOUT = 5000; // How long to show the prompt (ms)
    
    // Helper function for logging
    function log(message) {
        if (DEBUG) {
            console.log(`[Anti-App Redirect] ${message}`);
        }
    }
    
    // Check if running on Android
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (!isAndroid) {
        log("Not running on Android, script disabled");
        return;
    }
    
    log("Anti-App Redirect script active on Android");
    
    // Create UI elements for the prompt
    function createPromptUI() {
        const container = document.createElement('div');
        container.id = 'app-redirect-prompt';
        container.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background-color: #333;
            color: white;
            padding: 15px;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
            z-index: 999999;
            font-family: Arial, sans-serif;
            max-width: 90%;
            display: none;
            text-align: center;
        `;
        
        const message = document.createElement('div');
        message.style.cssText = 'margin-bottom: 10px;';
        message.textContent = 'App redirect blocked. What would you like to do?';
        container.appendChild(message);
        
        const buttonContainer = document.createElement('div');
        buttonContainer.style.cssText = 'display: flex; justify-content: space-around;';
        
        const stayButton = document.createElement('button');
        stayButton.textContent = 'Stay in Browser';
        stayButton.style.cssText = `
            background-color: #4CAF50;
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin-right: 5px;
        `;
        
        const redirectButton = document.createElement('button');
        redirectButton.textContent = 'Open App';
        redirectButton.style.cssText = `
            background-color: #757575;
            border: none;
            color: white;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
            margin-left: 5px;
        `;
        
        buttonContainer.appendChild(stayButton);
        buttonContainer.appendChild(redirectButton);
        container.appendChild(buttonContainer);
        
        document.body.appendChild(container);
        
        return {
            container,
            stayButton,
            redirectButton
        };
    }
    
    // Store original functions to prevent infinite recursion
    const originalWindowOpen = window.open;
    const originalLocationAssign = window.location.assign;
    const originalLocationReplace = window.location.replace;
    const originalSetAttribute = Element.prototype.setAttribute;
    
    // Blocked schemes that typically trigger app redirects
    const blockedSchemes = [
        'intent:',
        'market:',
        'googlechrome:',
        'reddit:',
        'twitter:',
        'fb:',
        'tg:',
        'whatsapp:',
        'viber:',
        'spotify:',
        'youtube:',
        'vnd.youtube:',
        'instagram:',
        'snapchat:'
    ];
    
    // Variable to store the redirect URL if user chooses to continue
    let pendingRedirect = null;
    let activePrompt = null;
    let promptTimeout = null;
    
    // Function to show the redirect prompt
    function showRedirectPrompt(url) {
        // Don't show multiple prompts
        if (activePrompt) {
            clearTimeout(promptTimeout);
            document.body.removeChild(activePrompt.container);
        }
        
        pendingRedirect = url;
        log(`Blocked redirect to: ${url}`);
        
        // Wait for document body to be available
        if (!document.body) {
            document.addEventListener('DOMContentLoaded', () => showRedirectPrompt(url));
            return;
        }
        
        const ui = createPromptUI();
        activePrompt = ui;
        
        ui.stayButton.addEventListener('click', () => {
            pendingRedirect = null;
            document.body.removeChild(ui.container);
            activePrompt = null;
            clearTimeout(promptTimeout);
        });
        
        ui.redirectButton.addEventListener('click', () => {
            if (pendingRedirect) {
                log(`User allowed redirect to: ${pendingRedirect}`);
                document.body.removeChild(ui.container);
                activePrompt = null;
                clearTimeout(promptTimeout);
                
                // Use the original function to perform the redirect
                originalWindowOpen.call(window, pendingRedirect, '_self');
            }
        });
        
        // Show the prompt
        ui.container.style.display = 'block';
        
        // Auto-hide after timeout
        promptTimeout = setTimeout(() => {
            if (activePrompt === ui && ui.container.parentNode) {
                document.body.removeChild(ui.container);
                activePrompt = null;
                pendingRedirect = null;
            }
        }, PROMPT_TIMEOUT);
    }
    
    // Helper function to check if a URL should be blocked
    function shouldBlockUrl(url) {
        if (!url || typeof url !== 'string') return false;
        
        // Check for app schemes
        return blockedSchemes.some(scheme => url.toLowerCase().startsWith(scheme));
    }
    
    // Override window.open
    window.open = function(url, target, features) {
        if (shouldBlockUrl(url)) {
            showRedirectPrompt(url);
            return null;
        }
        return originalWindowOpen.call(this, url, target, features);
    };
    
    // Override location.assign
    window.location.assign = function(url) {
        if (shouldBlockUrl(url)) {
            showRedirectPrompt(url);
            return;
        }
        return originalLocationAssign.call(this, url);
    };
    
    // Override location.replace
    window.location.replace = function(url) {
        if (shouldBlockUrl(url)) {
            showRedirectPrompt(url);
            return;
        }
        return originalLocationReplace.call(this, url);
    };
    
    // Override direct location changes
    Object.defineProperty(window, 'location', {
        set: function(url) {
            if (shouldBlockUrl(url)) {
                showRedirectPrompt(url);
                return;
            }
            window.location.href = url;
        },
        get: function() {
            return document.location;
        }
    });
    
    // Intercept intent:// links
    Element.prototype.setAttribute = function(name, value) {
        if (name === 'href' && shouldBlockUrl(value)) {
            // Store the original URL
            const originalUrl = value;
            
            // Replace it with a javascript: URL that will trigger our handler
            originalSetAttribute.call(this, 'href', 'javascript:void(0)');
            originalSetAttribute.call(this, 'data-original-url', originalUrl);
            
            // Add click handler
            this.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                showRedirectPrompt(originalUrl);
                return false;
            });
            
            return;
        }
        return originalSetAttribute.call(this, name, value);
    };
    
    // Handle click events on links that might have been added before our script ran
    document.addEventListener('click', function(e) {
        const target = e.target.closest('a');
        if (!target) return;
        
        const href = target.getAttribute('href');
        if (shouldBlockUrl(href)) {
            e.preventDefault();
            e.stopPropagation();
            showRedirectPrompt(href);
            return false;
        }
    }, true); // Use capture phase to intercept events before they reach the link
    
    // MutationObserver to watch for dynamically added links
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && 
                mutation.attributeName === 'href' && 
                mutation.target.tagName === 'A') {
                
                const href = mutation.target.getAttribute('href');
                if (shouldBlockUrl(href)) {
                    log(`Found dynamic app link: ${href}`);
                    
                    // Replace with safe version
                    const originalUrl = href;
                    mutation.target.setAttribute('href', 'javascript:void(0)');
                    mutation.target.setAttribute('data-original-url', originalUrl);
                    
                    mutation.target.addEventListener('click', function(e) {
                        e.preventDefault();
                        e.stopPropagation();
                        showRedirectPrompt(originalUrl);
                        return false;
                    });
                }
            }
        });
    });
    
    // Start observing when the DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        observer.observe(document.body, {
            attributes: true,
            attributeFilter: ['href'],
            subtree: true
        });
        
        log("MutationObserver started");
    });
    
    // Add additional schemes to block
    function addBlockedScheme(scheme) {
        if (!scheme.endsWith(':')) {
            scheme += ':';
        }
        if (!blockedSchemes.includes(scheme)) {
            blockedSchemes.push(scheme);
            log(`Added scheme to blocklist: ${scheme}`);
        }
    }
    
    // Expose function to add schemes (can be called from console)
    window.addAppRedirectScheme = addBlockedScheme;
    
    log("Anti-App Redirect initialized successfully");
})();