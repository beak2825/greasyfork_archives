// ==UserScript==
// @name         TinyChat Privacy Shield & Ad Remover by 420
// @namespace    https://greasyfork.org/en/users/1355681-420
// @version      0.4
// @description  Block non-essential cookies, optimize page load, remove ads, and spoof user agent on TinyChat with GUI controls
// @match        https://tinychat.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/505629/TinyChat%20Privacy%20Shield%20%20Ad%20Remover%20by%20420.user.js
// @updateURL https://update.greasyfork.org/scripts/505629/TinyChat%20Privacy%20Shield%20%20Ad%20Remover%20by%20420.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let scriptLogs = [];
    let settings = {
        blockCookies: GM_getValue('blockCookies', true),
        preventIpLeak: GM_getValue('preventIpLeak', true),
        spoofUserAgent: GM_getValue('spoofUserAgent', true),
        lazyLoadImages: GM_getValue('lazyLoadImages', true),
        deferNonCriticalJS: GM_getValue('deferNonCriticalJS', true),
        removeAdContainer: GM_getValue('removeAdContainer', true)
    };
    const cookiesToBlock = [
        { prefix: '__utm', description: 'Google Analytics tracking' },
        { prefix: '_vwo_', description: 'Visual Website Optimizer A/B testing' },
        { prefix: '_vis_opt_', description: 'Visual Website Optimizer user behavior analysis' },
        { prefix: '_gcl_au', description: 'Google AdSense user tracking' },
        { prefix: '_dlt', description: 'Unknown tracking or functionality' }
    ];
    function shouldBlockCookie(name) {
        return settings.blockCookies && cookiesToBlock.some(cookie => name.startsWith(cookie.prefix));
    }
    function getCookieDescription(name) {
        const matchedCookie = cookiesToBlock.find(cookie => name.startsWith(cookie.prefix));
        return matchedCookie ? matchedCookie.description : 'Unknown purpose';
    }
    function setupCookieBlocking() {
        if (!document.cookiePropertyModified) {
            const originalSetterDescriptor = Object.getOwnPropertyDescriptor(Document.prototype, 'cookie') ||
                                             Object.getOwnPropertyDescriptor(HTMLDocument.prototype, 'cookie');
            if (originalSetterDescriptor && originalSetterDescriptor.configurable) {
                Object.defineProperty(document, 'cookie', {
                    get: function() {
                        return originalSetterDescriptor.get.call(this);
                    },
                    set: function(val) {
                        const cookieParts = val.split('=');
                        const cookieName = cookieParts[0].trim();
                        const cookieValue = cookieParts.slice(1).join('=');
                        if (!shouldBlockCookie(cookieName)) {
                            originalSetterDescriptor.set.call(this, val);
                        } else {
                            logAction(`Blocked cookie: ${cookieName}`);
                            logAction(`Purpose: ${getCookieDescription(cookieName)}`);
                            logAction(`Attempted value: ${cookieValue}`);
                            logAction(`Domain: ${document.domain}`);
                            logAction(`Path: ${location.pathname}`);
                            logAction('---');
                        }
                    },
                    configurable: false
                });
                document.cookiePropertyModified = true;
            }
        }
    }
    function preventIpLeak() {
        if (settings.preventIpLeak) {
            const originalRTCPeerConnection = window.RTCPeerConnection;
            window.RTCPeerConnection = function(...args) {
                const pc = new originalRTCPeerConnection(...args);
                if (pc.createDataChannel) {
                    const originalCreateDataChannel = pc.createDataChannel;
                    pc.createDataChannel = function() { return null; };
                }
                return pc;
            };
            window.RTCPeerConnection.prototype = originalRTCPeerConnection.prototype;
    
            const testPc = new window.RTCPeerConnection();
            if (testPc.createDataChannel() === null) {
                logAction('WebRTC leak prevention successful');
            } else {
                logAction('Warning: WebRTC leak prevention may not be working');
            }
        }
    }
    function spoofUserAgent() {
        if (settings.spoofUserAgent && !navigator.userAgentSpoofed) {
            const randomChrome = `${Math.floor(Math.random() * (100 - 70) + 70)}.0.${Math.floor(Math.random() * 9999)}`;
            const randomOS = Math.random() > 0.5 ? 'Windows NT 10.0' : 'Macintosh; Intel Mac OS X 10_15_7';
            const spoofedUserAgent = `Mozilla/5.0 (${randomOS}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomChrome} Safari/537.36`;
    
            const spoofedProps = {
                userAgent: spoofedUserAgent,
                appVersion: `5.0 (${randomOS}; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${randomChrome} Safari/537.36`,
                platform: randomOS.includes('Windows') ? 'Win32' : 'MacIntel',
                hardwareConcurrency: Math.floor(Math.random() * 12) + 2,
                deviceMemory: Math.pow(2, Math.floor(Math.random() * 4) + 1)
            };
    
            for (let prop in spoofedProps) {
                Object.defineProperty(Object.getPrototypeOf(navigator), prop, {
                    get: () => spoofedProps[prop],
                    configurable: false,
                    enumerable: true
                });
            }
    
            navigator.userAgentSpoofed = true;
    
           
            if (Object.keys(spoofedProps).every(prop => navigator[prop] === spoofedProps[prop])) {
                logAction('User Agent spoofing successful');
                for (let prop in spoofedProps) {
                    logAction(`Spoofed ${prop}: ${navigator[prop]}`);
                }
            } else {
                logAction('Warning: User Agent spoofing may not be fully effective');
                for (let prop in spoofedProps) {
                    logAction(`Attempted to spoof ${prop}: ${navigator[prop]}`);
                }
            }
        }
    }        
    function implementLazyLoading() {
        if (settings.lazyLoadImages) {
            const images = document.getElementsByTagName('img');
            for (let i = 0; i < images.length; i++) {
                if (!images[i].hasAttribute('loading')) {
                    images[i].setAttribute('loading', 'lazy');
                    logAction(`Lazy loading applied to image: ${images[i].src}`);
                }
            }
        }
    }
    function deferNonCriticalJS() {
        if (settings.deferNonCriticalJS) {
            const scripts = document.getElementsByTagName('script');
            let deferredCount = 0;
            for (let i = 0; i < scripts.length; i++) {
                if (!scripts[i].async && !scripts[i].defer && !scripts[i].hasAttribute('defer')) {
                    scripts[i].defer = true;
                    deferredCount++;
                    logAction(`Deferred script: ${scripts[i].src || 'Inline script'}`);
                }
            }
            logAction(`Total scripts deferred: ${deferredCount}`);
        }
    }
    function addAdBlockingCSS() {
        if (settings.removeAdContainer) {
        const style = document.createElement('style');
        style.textContent = `
            #card, div[id^="card"], iframe[id^="ad_iframe"], #ad_position_box,
            div[id^="dclk-studio-creative"], ins.adsbygoogle,
            iframe[id^="aswift_"], iframe[id^="200_280_express_html_inpage"],
            div[id^="div-gpt-ad"], div[id^="google_ads_iframe"],
            div[style*="position: fixed"][style*="width: 160px"][style*="height: 600px"],
            iframe[id^="google_ads_iframe"] {
                display: none !important;
            }
        `;
        document.head.appendChild(style);
        logAction('Ad-blocking CSS rules added');
    }
}
    function removeElementsByXPath(xpath) {
        const elements = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        for (let i = 0; i < elements.snapshotLength; i++) {
            const element = elements.snapshotItem(i);
            element.remove();
            logAction(`Element removed by XPath: ${xpath}`);
        }
    }
    
        
    function removeAdContainer() {
        if (settings.removeAdContainer) {
            const adContainers = [
                document.getElementById('room-google-ads-bottom'),
                document.getElementById('card'),
                document.querySelector('div[id^="card"]'),
                document.getElementById('ad_position_box'),
                document.querySelector('div[id^="dclk-studio-creative"]'),
                document.querySelector('ins.adsbygoogle'),
                document.querySelector('div[id^="div-gpt-ad"]'),
                document.querySelector('div[id^="google_ads_iframe"]')
            ];
            adContainers.forEach(container => {
                if (container) {
                    container.remove();
                    logAction(`Ad container removed: ${container.id || container.className || 'unnamed ad container'}`);
                }
            });
            

            const adIframes = document.querySelectorAll('iframe[id^="ad_iframe"], iframe[id^="aswift_"], iframe[id^="200_280_express_html_inpage"], iframe[id^="google_ads_iframe"]');
            adIframes.forEach(iframe => {
                iframe.remove();
                logAction(`Ad iframe removed: ${iframe.id}`);
            });
    

            const stickyAdContainers = document.querySelectorAll('div[style*="position: fixed"][style*="width: 160px"][style*="height: 600px"]');
            stickyAdContainers.forEach(container => {
                container.remove();
                logAction('Sticky ad container removed');
            });
        }
    }
    
      
    function setupObserver() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach((node) => {
                        if (settings.lazyLoadImages && node.nodeName === 'IMG' && !node.hasAttribute('loading')) {
                            node.setAttribute('loading', 'lazy');
                            logAction(`Lazy loading applied to dynamically added image: ${node.src}`);
                        } else if (settings.deferNonCriticalJS && node.nodeName === 'SCRIPT' && !node.async && !node.defer && !node.hasAttribute('defer')) {
                            node.defer = true;
                            logAction(`Deferred dynamically added script: ${node.src || 'Inline script'}`);
                        }
    
                        if (settings.removeAdContainer) {
                            if (node.id && (node.id.startsWith('card') || node.id.startsWith('dclk-studio-creative') || 
                                node.id.startsWith('aswift_') || node.id.startsWith('200_280_express_html_inpage') ||
                                node.id.startsWith('div-gpt-ad') || node.id.startsWith('google_ads_iframe'))) {
                                node.remove();
                                logAction(`Dynamically added ad removed: ${node.id}`);
                            }
                            if (node.classList && node.classList.contains('adsbygoogle')) {
                                node.remove();
                                logAction('Dynamically added AdSense ad removed');
                            }
                            if (node.style && node.style.position === 'fixed' && node.style.width === '160px' && node.style.height === '600px') {
                                node.remove();
                                logAction('Dynamically added sticky ad removed');
                            }
                        }
                    });
                    if (settings.removeAdContainer) {
                        removeAdContainer();
                    }
                }
            });
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }
    
    function logAction(message) {
        const timestamp = new Date().toLocaleTimeString();
        scriptLogs.push(`[${timestamp}] ${message}`);
        console.log(`[${timestamp}] ${message}`);
    }    
    function createGUI() {
        const guiContainer = document.createElement('div');
        guiContainer.id = 'tinychat-enhanced-gui';
        guiContainer.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #fff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0,0,0,0.5);
            z-index: 9999;
            display: none;
            width: 300px;
            height: auto;
            color: #000;
            font-size: 14px;
        `;
        const title = document.createElement('h2');
        title.textContent = 'TinyChat Enhanced Settings';
        title.style.marginBottom = '15px';
        guiContainer.appendChild(title);
        const settingsInfo = {
            blockCookies: "Blocks non-essential cookies to enhance privacy.",
            preventIpLeak: "Prevents WebRTC from leaking your real IP address.",
            spoofUserAgent: "Changes your browser's user agent to enhance privacy.",
            lazyLoadImages: "Loads images only when they're visible on screen.",
            deferNonCriticalJS: "Delays loading of non-critical JavaScript for faster page load.",
            removeAdContainer: "Removes the ad container from the chat interface."
        };
        for (const [key, value] of Object.entries(settings)) {
            const wrapper = document.createElement('div');
            wrapper.style.display = 'flex';
            wrapper.style.alignItems = 'center';
            wrapper.style.marginBottom = '10px';
    
            const label = document.createElement('label');
            label.style.display = 'flex';
            label.style.alignItems = 'center';
            label.style.cursor = 'pointer';
    
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = value;
            checkbox.style.marginRight = '10px';
            checkbox.addEventListener('change', (e) => {
                settings[key] = e.target.checked;
                GM_setValue(key, e.target.checked);
                applySettings();
            });
            label.appendChild(checkbox);
            label.appendChild(document.createTextNode(key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())));
            wrapper.appendChild(label);
            const infoIcon = document.createElement('span');
            infoIcon.textContent = '?';
            infoIcon.style.cssText = `
                margin-left: 5px;
                background-color: #007bff;
                color: white;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                display: inline-flex;
                justify-content: center;
                align-items: center;
                font-size: 12px;
                cursor: help;
            `;
            infoIcon.title = settingsInfo[key];
            wrapper.appendChild(infoIcon);
            guiContainer.appendChild(wrapper);
        }
        const logButton = document.createElement('button');
        logButton.textContent = 'View Script Logs';
        logButton.style.cssText = `
            margin-top: 15px;
            padding: 5px 10px;
            cursor: pointer;
            margin-right: 10px;
        `;
        logButton.addEventListener('click', showLogModal);
        guiContainer.appendChild(logButton);
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            margin-top: 15px;
            padding: 5px 10px;
            cursor: pointer;
        `;
        closeButton.addEventListener('click', () => {
            guiContainer.style.display = 'none';
        });
        guiContainer.appendChild(closeButton);
        document.body.appendChild(guiContainer);
    }
    function showLogModal() {
        const modal = document.createElement('div');
        modal.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background-color: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            z-index: 10000;
            width: 90%;
            max-width: 800px;
            max-height: 90vh;
            overflow-y: auto;
            color: #333;
            font-family: Arial, sans-serif;
            font-size: 14px;
        `;
    
        const title = document.createElement('h3');
        title.textContent = 'TinyChat Enhanced Script Logs';
        title.style.cssText = `
            margin-bottom: 15px;
            color: #007bff;
            border-bottom: 2px solid #007bff;
            padding-bottom: 10px;
        `;
        modal.appendChild(title);
    
        const logContent = document.createElement('div');
        logContent.style.cssText = `
            background-color: #fff;
            border: 1px solid #dee2e6;
            border-radius: 4px;
            padding: 15px;
            max-height: 60vh;
            overflow-y: auto;
        `;
    
        scriptLogs.forEach((log) => {
            const logEntry = document.createElement('div');
            logEntry.style.marginBottom = '10px';
            const [timestamp, ...messageParts] = log.split('] ');
            const message = messageParts.join('] ');
    
            const timestampSpan = document.createElement('span');
            timestampSpan.textContent = timestamp + ']';
            timestampSpan.style.color = '#6c757d';
            timestampSpan.style.marginRight = '10px';
    
            const messageSpan = document.createElement('span');
            messageSpan.textContent = message;
    
            if (message.includes('Blocked cookie')) {
                messageSpan.style.color = '#dc3545';
            } else if (message.includes('Lazy loading applied')) {
                messageSpan.style.color = '#28a745';
            } else if (message.includes('Deferred script')) {
                messageSpan.style.color = '#ffc107';
            } else if (message.includes('Ad container removed')) {
                messageSpan.style.color = '#17a2b8';
            }
    
            logEntry.appendChild(timestampSpan);
            logEntry.appendChild(messageSpan);
            logContent.appendChild(logEntry);
        });
    
        modal.appendChild(logContent);
    
        const closeButton = document.createElement('button');
        closeButton.textContent = 'Close';
        closeButton.style.cssText = `
            margin-top: 15px;
            padding: 8px 16px;
            cursor: pointer;
            background-color: #007bff;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 14px;
        `;
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });
        modal.appendChild(closeButton);
    
        document.body.appendChild(modal);
    }        
    function createToggleButton() {
        const buttonId = 'tinychat-enhanced-settings-button';
        
        function createButton() {
            const button = document.createElement('a');
            button.id = buttonId;
            button.textContent = 'Enhanced Settings';
            button.href = '#';
            button.style.cssText = `
                display: inline-flex !important;
                align-items: center;
                justify-content: center;
                margin-left: 10px;
                padding: 5px 10px;
                background-color: #4CAF50;
                color: white;
                text-decoration: none;
                border-radius: 3px;
                font-size: 14px;
                width: auto;
                min-width: 120px;
                max-width: 150px;
                height: 30px;
                box-sizing: border-box;
                z-index: 9999;
                position: relative;
            `;
            button.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const gui = document.getElementById('tinychat-enhanced-gui');
                gui.style.display = gui.style.display === 'none' ? 'block' : 'none';
            });
            return button;
        }
    
        function insertButton() {
            const targetElement = document.querySelector("#content")?.shadowRoot?.querySelector("#room > tc-title")?.shadowRoot?.querySelector("#room-header-info > span:nth-child(4)");
            if (targetElement) {
                const existingButton = targetElement.querySelector(`#${buttonId}`);
                if (!existingButton) {
                    const button = createButton();
                    targetElement.appendChild(button);
                    logAction('TinyChat Enhanced Settings button added to room header info');
                }
            }
        }
    
        insertButton();
        setInterval(insertButton, 1000);
    }
    
    function addButtonStyleOverride() {
        const style = document.createElement('style');
        style.textContent = `
            #room-header-gifts-buttons {
                display: flex !important;
                flex-direction: column !important;
            }
            #tinychat-enhanced-settings-button {
                display: flex !important;
                visibility: visible !important;
                opacity: 1 !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    createToggleButton();
    addButtonStyleOverride();
    
    
    
    
    
    
    function applySettings() {
        setupCookieBlocking();
        preventIpLeak();
        spoofUserAgent();
        implementLazyLoading();
        deferNonCriticalJS();
        removeAdContainer();
    }
    function onDOMReady() {
        createGUI();
        const savedSettings = localStorage.getItem('tinychatEnhancedSettings');
        if (savedSettings) {
            settings = JSON.parse(savedSettings);
        }
        applySettings();
        setupObserver();
        addAdBlockingCSS();
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', onDOMReady);
    } else {
        onDOMReady();
    }
    window.addEventListener('load', function() {
        const loadTime = performance.now();
        logAction(`Total scripts deferred: ${document.querySelectorAll('script[defer]').length}`);
    });
})();
