// ==UserScript==
// @name         Stream To Android Player
// @namespace    https://github.com/faisalbhuiyan
// @version      1.2
// @description  Detect streaming videos and open them in external Android apps or copy to clipboard on desktop
// @author       Faisal Bhuiyan
// @match        *://*/*
// @grant        none
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/524104/Stream%20To%20Android%20Player.user.js
// @updateURL https://update.greasyfork.org/scripts/524104/Stream%20To%20Android%20Player.meta.js
// ==/UserScript==
 
(function () {
    'use strict';
 
    let streams = [];
    let originalXHROpen = XMLHttpRequest.prototype.open;
    let originalFetchOpen = window.fetch;
    let isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
 
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = `
        #video-handler-button {
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 48px;
            height: 48px;
            background: none;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            z-index: 999999;
            font-size: 24px;
            transition: opacity 0.3s;
        }
 
        #video-handler-button:hover {
            opacity: 1;
        }
 
        #video-handler-menu {
            position: fixed;
            bottom: 80px;
            right: 20px;
            background: rgba(0, 0, 0, 0.9);
            border-radius: 8px;
            padding: 8px;
            z-index: 999998;
            max-height: 300px;
            overflow-y: auto;
            color: white;
            max-width: 300px;
            width: auto;
        }
 
        .stream-item {
            padding: 8px 16px;
            cursor: pointer;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
 
        .stream-item:last-child {
            border-bottom: none;
        }
 
        .stream-item:hover {
            background: rgba(255, 255, 255, 0.1);
        }
        
        .copy-notification {
            position: fixed;
            bottom: 120px;
            right: 20px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            z-index: 999999;
            transition: opacity 0.3s;
        }
    `;
    document.head.appendChild(style);
 
    // Clear streams when page unloads
    window.addEventListener('beforeunload', () => {
        streams = [];
        const menu = document.getElementById('video-handler-menu');
        const button = document.getElementById('video-handler-button');
        if (menu) menu.remove();
        if (button) button.remove();
    });
 
    function createStreamMenu() {
        const menu = document.createElement('div');
        menu.id = 'video-handler-menu';
        menu.style.display = 'none';
        document.body.appendChild(menu);
        return menu;
    }
 
    function shareUrl(url) {
        if (isMobile && navigator.share) {
            navigator.share({
                url: url
            }).catch(console.error);
        } else {
            // Desktop: Copy to clipboard
            navigator.clipboard.writeText(url)
                .then(() => showNotification('Link copied to clipboard!'))
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    // Fallback method for clipboard
                    const textarea = document.createElement('textarea');
                    textarea.value = url;
                    textarea.style.position = 'fixed';
                    textarea.style.opacity = '0';
                    document.body.appendChild(textarea);
                    textarea.focus();
                    textarea.select();
                    
                    try {
                        document.execCommand('copy');
                        showNotification('Link copied to clipboard!');
                    } catch (e) {
                        showNotification('Failed to copy link. Please copy it manually.');
                        console.error('Fallback copy failed:', e);
                    }
                    
                    document.body.removeChild(textarea);
                });
        }
    }
    
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'copy-notification';
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 2000);
    }
 
    function updateMenu() {
        const menu = document.getElementById('video-handler-menu') || createStreamMenu();
        menu.innerHTML = streams.map(stream => `
            <div class="stream-item" data-url="${stream.url}" title="${stream.name}">
                ${stream.name}
            </div>
        `).join('');
 
        menu.querySelectorAll('.stream-item').forEach(item => {
            item.onclick = () => {
                shareUrl(item.dataset.url);
            };
        });
    }
 
    function createFloatingButton() {
        const button = document.createElement('div');
        button.id = 'video-handler-button';
        button.innerHTML = '▶️';
        button.style.display = 'none';
        document.body.appendChild(button);
 
        button.onclick = () => {
            const menu = document.getElementById('video-handler-menu');
            menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
        };
 
        return button;
    }
 
    // Helper functions for stream detection
    function isStreamUrl(url) {
        const videoPatterns = [
            '.mp4', '.m3u8', '.m3u', 'urlset',
            '/video/', '/media/', '/stream/',
            'manifest', 'playlist', 'master.json'
        ];
        return videoPatterns.some(pattern => url.toLowerCase().includes(pattern));
    }
 
    function isStreamContent(contentType) {
        const streamTypes = [
            'video/',
            'application/x-mpegurl',
            'application/vnd.apple.mpegurl',
            'application/octet-stream'
        ];
        return streamTypes.some(type => contentType?.toLowerCase().includes(type));
    }
 
    // Enhanced stream detection function
    function handleStreamDetection(url, contentType, content) {
        // Skip if already detected
        if (streams.some(s => s.url === url)) return;
 
        const fileName = url.split('/').pop().split('?')[0];
        let shouldAdd = false;
        let type = 'video';
 
        // Check URL patterns
        if (isStreamUrl(url)) {
            shouldAdd = true;
            if (url.includes('.m3u8')) type = 'm3u8';
        }
 
        // Check content type
        if (isStreamContent(contentType)) {
            shouldAdd = true;
            if (contentType?.includes('mpegurl')) type = 'm3u8';
        }
 
        // Check for M3U8 content
        if (content?.trim().startsWith('#EXTM3U')) {
            shouldAdd = true;
            type = 'm3u8';
        }
 
        if (shouldAdd) {
            streams.push({ url, name: fileName, type });
            const button = document.getElementById('video-handler-button') || createFloatingButton();
            button.style.display = 'block';
            updateMenu();
        }
    }
 
    // Extract video sources from the page
    function extractVideoSources() {
        // Check video elements
        document.querySelectorAll('video').forEach(video => {
            if (video.src) {
                handleStreamDetection(video.src);
            }
 
            // Check source elements within video
            video.querySelectorAll('source').forEach(source => {
                if (source.src) {
                    handleStreamDetection(source.src, source.type);
                }
            });
        });
 
        // Check data-source attributes
        document.querySelectorAll('[data-source]').forEach(el => {
            const source = el.getAttribute('data-source');
            if (source) {
                handleStreamDetection(source);
            }
        });
    }
 
    // Monitor XHR requests with enhanced detection
    XMLHttpRequest.prototype.open = function () {
        this.addEventListener('load', function () {
            try {
                const contentType = this.getResponseHeader('content-type');
                handleStreamDetection(
                    this.responseURL,
                    contentType,
                    this.responseText
                );
            } catch (e) {
                handleStreamDetection(this.responseURL);
            }
        });
        originalXHROpen.apply(this, arguments);
    };
 
    // Monitor fetch requests with enhanced detection
    window.fetch = async function () {
        const url = arguments[0]?.url || arguments[0];
        const response = await originalFetchOpen.apply(this, arguments);
 
        try {
            const contentType = response.headers.get('content-type');
            const clonedResponse = response.clone();
            const content = await clonedResponse.text();
            handleStreamDetection(url, contentType, content);
        } catch (e) {
            handleStreamDetection(url);
        }
 
        return response;
    };
 
    // Periodic scanning for dynamically added videos
    setInterval(extractVideoSources, 5000);
 
    // Monitor DOM changes for new video elements
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName === 'VIDEO' || node.nodeName === 'AUDIO') {
                    handleStreamDetection(node.src);
                }
                // Check for video elements within added nodes
                if (node.querySelectorAll) {
                    extractVideoSources();
                }
            });
        });
    });
 
    // Start observing once DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            observer.observe(document.documentElement, {
                childList: true,
                subtree: true
            });
            extractVideoSources();
        });
    } else {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
        extractVideoSources();
    }
})();