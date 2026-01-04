// ==UserScript==
// @name         RedGifs Copy Video Embed Link & Download
// @namespace    http://tampermonkey.net/
// @version      5.7
// @description  Content-aware copy button with video change detection, visual feedback, robust homepage support, enhanced download UI with beautiful hover menu, niches support, and search page support
// @author       monk3xx3
// @match        https://redgifs.com/*
// @match        https://www.redgifs.com/*
// @grant        GM_xmlhttpRequest
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539573/RedGifs%20Copy%20Video%20Embed%20Link%20%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/539573/RedGifs%20Copy%20Video%20Embed%20Link%20%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let copyButton = null;
    let downloadButton = null;
    let downloadDropdown = null;
    let isProcessing = false;
    let isDownloading = false;
    let currentVideoId = null;
    let bearerToken = null;
    let tokenExpiry = null;
    let activeVideoElement = null;
    let videoObserver = null;
    let highlightTimeout = null;
    let dropdownTimeout = null;
    let isDropdownVisible = false;

    // Enhanced video waiting with retry logic
    function waitForVideosOnHomepage(maxAttempts = 10, delay = 500) {
        return new Promise((resolve) => {
            let attempts = 0;
            
            function checkForVideos() {
                attempts++;
                const videos = document.querySelectorAll('video');
                const hasVideos = videos.length > 0;
                
                // Check if we're on homepage, niches, search, or other video pages
                const isValidVideoPage = window.location.pathname === '/' || 
                                        window.location.pathname === '' ||
                                        window.location.pathname === '/home' ||
                                        window.location.pathname.startsWith('/niches/') ||
                                        window.location.pathname.startsWith('/search/') ||
                                        (window.location.hostname.includes('redgifs.com') && 
                                         window.location.pathname.length <= 1);
                
                if (hasVideos || attempts >= maxAttempts) {
                    console.log(`Videos found: ${hasVideos}, Attempts: ${attempts}`);
                    resolve(hasVideos);
                    return;
                }
                
                // If no videos yet and we're on a valid page, keep trying
                if (isValidVideoPage) {
                    console.log(`Waiting for videos... Attempt ${attempts}/${maxAttempts}`);
                    setTimeout(checkForVideos, delay);
                } else {
                    resolve(false);
                }
            }
            
            checkForVideos();
        });
    }

    // Enhanced page detection including niches and search pages
    function isValidPageWithContent() {
        const path = window.location.pathname;
        const isValidPage = path === '/' || 
                           path === '' || 
                           path === '/home' ||
                           path.startsWith('/niches/') ||
                           path.startsWith('/users/') ||
                           path.startsWith('/watch/') ||
                           path.startsWith('/search/');
        
        const hasVideoContent = document.querySelector('video') || 
                               document.querySelector('[class*="video"]') ||
                               document.querySelector('[class*="gif"]') ||
                               document.querySelector('[data-testid*="video"]') ||
                               document.querySelector('[class*="post"]') ||
                               document.querySelector('[class*="content"]') ||
                               document.querySelector('[class*="search"]');
        
        return isValidPage && hasVideoContent;
    }

    // Enhanced video detection focused on content, not URL
    function detectCurrentVideo() {
        try {
            const videos = document.querySelectorAll('video');
            let bestVideo = null;
            let bestScore = 0;

            for (const video of videos) {
                const rect = video.getBoundingClientRect();
                const viewportHeight = window.innerHeight;
                const viewportWidth = window.innerWidth;

                // Calculate visibility score
                const visibleHeight = Math.min(rect.bottom, viewportHeight) - Math.max(rect.top, 0);
                const visibleWidth = Math.min(rect.right, viewportWidth) - Math.max(rect.left, 0);
                const visibleArea = Math.max(0, visibleHeight) * Math.max(0, visibleWidth);
                const totalArea = rect.width * rect.height;

                if (totalArea === 0) continue;

                const visibilityRatio = visibleArea / totalArea;
                const sizeScore = Math.min(rect.width / 100, 10) + Math.min(rect.height / 100, 10);
                const centerDistance = Math.abs(rect.top + rect.height/2 - viewportHeight/2);
                const centerScore = Math.max(0, 10 - centerDistance / 100);

                // Enhanced scoring for niches, user pages, and search pages
                const score = visibilityRatio * 20 + sizeScore + centerScore +
                             (video.readyState >= 3 ? 5 : 0) +
                             (!video.paused ? 10 : 0);

                if (score > bestScore && visibilityRatio > 0.2 && rect.width > 150) {
                    bestScore = score;
                    bestVideo = video;
                }
            }

            return bestVideo;

        } catch (error) {
            console.error('Error detecting current video:', error);
            return null;
        }
    }

    // Detect available video qualities with estimated file sizes
    function detectAvailableQualities(videoElement) {
        const qualities = { 
            sd: { available: false, size: '~2-5 MB', label: 'Standard' }, 
            hd: { available: false, size: '~8-15 MB', label: 'High Quality' } 
        };
        
        if (!videoElement) return qualities;
        
        try {
            // Check video dimensions
            const width = videoElement.videoWidth || videoElement.clientWidth;
            const height = videoElement.videoHeight || videoElement.clientHeight;
            
            // Always assume SD is available
            qualities.sd.available = true;
            
            // Check if HD is available based on dimensions
            if (width >= 1280 || height >= 720) {
                qualities.hd.available = true;
            }
            
            // Check video source URL for quality indicators
            const src = videoElement.src || videoElement.currentSrc;
            if (src && src.includes('hd')) {
                qualities.hd.available = true;
            }
            
            // Estimate file sizes based on duration if available
            if (videoElement.duration && !isNaN(videoElement.duration)) {
                const duration = videoElement.duration;
                qualities.sd.size = `~${Math.round(duration * 0.3)} MB`;
                qualities.hd.size = `~${Math.round(duration * 1.2)} MB`;
            }
            
        } catch (error) {
            console.error('Error detecting video qualities:', error);
            qualities.sd.available = true; // fallback
        }
        
        return qualities;
    }

    // Extract video ID from the active video element and surrounding context
    function extractVideoIdFromContent(videoElement) {
        if (!videoElement) return null;

        try {
            // Method 1: Check video source URLs
            const sources = [videoElement.src, videoElement.currentSrc];
            sources.push(...Array.from(videoElement.querySelectorAll('source')).map(s => s.src));

            for (const src of sources) {
                if (src && !src.startsWith('blob:')) {
                    const match = src.match(/\/([a-zA-Z0-9]{15,})(?:-silent)?\.(?:mp4|webm)/i);
                    if (match) return match[1];
                }
            }

            // Method 2: Check data attributes on video and parent elements
            let element = videoElement;
            let depth = 0;

            while (element && depth < 10) {
                // Check all data attributes
                for (const attr of element.attributes || []) {
                    if (attr.name.includes('id') || attr.name.includes('video') || attr.name.includes('gif')) {
                        const match = attr.value.match(/([a-zA-Z0-9]{15,})/);
                        if (match && match[1].length >= 15) return match[1];
                    }
                }

                // Check class names for video IDs
                if (element.className) {
                    const match = element.className.match(/([a-zA-Z0-9]{15,})/);
                    if (match && match[1].length >= 15) return match[1];
                }

                element = element.parentElement;
                depth++;
            }

            // Method 3: Look for links and video info in the container
            const container = videoElement.closest('[class*="video"], [class*="post"], [class*="content"], [class*="item"], [class*="card"]') ||
                             videoElement.parentElement;

            if (container) {
                // Find watch links
                const links = container.querySelectorAll('a[href*="watch"], a[href*="/watch/"]');
                for (const link of links) {
                    const match = link.href.match(/\/watch\/([a-zA-Z0-9]+)/);
                    if (match) return match[1];
                }

                // Find any elements with video ID patterns
                const allElements = container.querySelectorAll('*');
                for (const el of allElements) {
                    for (const attr of el.attributes || []) {
                        if (attr.value.match(/^[a-zA-Z0-9]{15,}$/)) {
                            return attr.value;
                        }
                    }
                }
            }

            // Method 4: Parse nearby script content for video data
            const nearbyScripts = document.querySelectorAll('script:not([src])');

            for (const script of nearbyScripts) {
                const content = script.textContent;

                // Look for video IDs in various JSON structures
                const patterns = [
                    /"id":\s*"([a-zA-Z0-9]{15,})"/g,
                    /"video":\s*{[^}]*"id":\s*"([^"]{15,})"/g,
                    /"gif":\s*{[^}]*"id":\s*"([^"]{15,})"/g,
                    /([a-zA-Z0-9]{15,})(?:-silent)?\.mp4/g
                ];

                for (const pattern of patterns) {
                    const matches = [...content.matchAll(pattern)];
                    if (matches.length > 0) {
                        // Return the most recent match (likely the current video)
                        return matches[matches.length - 1][1];
                    }
                }
            }

        } catch (error) {
            console.error('Error extracting video ID:', error);
        }

        return null;
    }

    // Get current video ID with enhanced detection
    function getCurrentVideoId() {
        const activeVideo = detectCurrentVideo();
        if (activeVideo !== activeVideoElement) {
            // Video changed, trigger highlight
            if (activeVideoElement !== null) {
                highlightButtonChange();
            }
            activeVideoElement = activeVideo;
        }

        if (!activeVideo) return null;

        const videoId = extractVideoIdFromContent(activeVideo);

        // Fallback: try URL-based detection only if content detection fails
        if (!videoId) {
            const urlMatch = window.location.pathname.match(/\/watch\/([^\/\?#]+)/);
            if (urlMatch) return urlMatch[1];
        }

        return videoId;
    }

    // Highlight button when video changes
    function highlightButtonChange() {
        if (!copyButton || isProcessing) return;

        clearTimeout(highlightTimeout);

        // Add highlight effect
        copyButton.style.background = 'rgba(59, 130, 246, 0.9)';
        copyButton.style.borderColor = 'rgba(59, 130, 246, 0.8)';
        copyButton.style.transform = 'translateY(-2px) scale(1.05)';
        copyButton.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';

        // Update text to show video detected
        const span = copyButton.querySelector('span');
        if (span) {
            const originalText = span.textContent;
            span.textContent = 'Video Detected';

            highlightTimeout = setTimeout(() => {
                copyButton.style.background = 'rgba(0, 0, 0, 0.85)';
                copyButton.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                copyButton.style.transform = 'translateY(0) scale(1)';
                copyButton.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
                span.textContent = originalText;
            }, 1500);
        }
    }

    // Extract bearer token from network requests
    function extractBearerToken() {
        return new Promise((resolve) => {
            const originalFetch = window.fetch;
            let captured = false;

            window.fetch = function(...args) {
                const result = originalFetch.apply(this, args);

                if (args[1] && args[1].headers && args[1].headers.Authorization) {
                    const token = args[1].headers.Authorization.replace('Bearer ', '');
                    if (token && !captured) {
                        bearerToken = token;
                        captured = true;
                        try {
                            const payload = JSON.parse(atob(token.split('.')[1]));
                            tokenExpiry = payload.exp * 1000;
                        } catch (e) {
                            tokenExpiry = Date.now() + (24 * 60 * 60 * 1000);
                        }
                        console.log('Bearer token captured via fetch');
                        resolve(token);
                    }
                }

                return result;
            };

            // Also monitor XHR requests
            const originalXHR = XMLHttpRequest.prototype.setRequestHeader;
            XMLHttpRequest.prototype.setRequestHeader = function(name, value) {
                if (name.toLowerCase() === 'authorization' && value.startsWith('Bearer ') && !captured) {
                    const token = value.replace('Bearer ', '');
                    bearerToken = token;
                    captured = true;
                    try {
                        const payload = JSON.parse(atob(token.split('.')[1]));
                        tokenExpiry = payload.exp * 1000;
                    } catch (e) {
                        tokenExpiry = Date.now() + (24 * 60 * 60 * 1000);
                    }
                    console.log('Bearer token captured via XHR');
                    resolve(token);
                }
                return originalXHR.call(this, name, value);
            };

            // Timeout after 5 seconds
            setTimeout(() => {
                if (!captured) {
                    console.log('No token captured, attempting page interaction...');
                    // Try to trigger network requests
                    const videos = document.querySelectorAll('video');
                    if (videos.length > 0) {
                        videos[0].currentTime = videos[0].currentTime; // Trigger a tiny seek
                    }

                    setTimeout(() => resolve(bearerToken), 2000);
                }
            }, 5000);
        });
    }

    // Get signed URLs from RedGifs API
    async function getSignedUrls(videoId) {
        if (!bearerToken || Date.now() > tokenExpiry) {
            await extractBearerToken();
            if (!bearerToken) {
                throw new Error('Authentication failed - no bearer token');
            }
        }

        try {
            const response = await fetch(`https://api.redgifs.com/v2/gifs/${videoId}?views=yes&users=yes`, {
                headers: {
                    'Authorization': `Bearer ${bearerToken}`,
                    'User-Agent': navigator.userAgent,
                    'Accept': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const urls = data.gif?.urls;

            if (!urls) {
                throw new Error('No video URLs in API response');
            }

            return urls;

        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Download video to internal storage using GM_xmlhttpRequest
    function downloadVideoFile(url, filename) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                responseType: 'blob',
                headers: {
                    'User-Agent': navigator.userAgent,
                    'Referer': 'https://redgifs.com/'
                },
                onload: function(response) {
                    try {
                        // Create blob from response
                        const blob = new Blob([response.response], { type: 'video/mp4' });
                        
                        // Create download link
                        const downloadUrl = URL.createObjectURL(blob);
                        const link = document.createElement('a');
                        link.href = downloadUrl;
                        link.download = filename;
                        link.style.display = 'none';
                        
                        // Trigger download
                        document.body.appendChild(link);
                        link.click();
                        document.body.removeChild(link);
                        
                        // Clean up
                        setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
                        
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(new Error('Download failed: ' + error.statusText));
                },
                onprogress: function(progress) {
                    if (progress.lengthComputable) {
                        const percent = Math.round((progress.loaded / progress.total) * 100);
                        console.log(`Download progress: ${percent}%`);
                    }
                }
            });
        });
    }

    // Create beautiful download dropdown menu with enhanced UI
    function createDownloadDropdown() {
        if (downloadDropdown) return downloadDropdown;

        downloadDropdown = document.createElement('div');
        downloadDropdown.id = 'redgifs-download-dropdown';
        
        // Create dropdown content with better structure
        downloadDropdown.innerHTML = `
            <div class="dropdown-header">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 12.793L5.646 10.44a.5.5 0 01.708-.708L7.5 10.879V1.5a.5.5 0 011 0v9.379l1.146-1.147a.5.5 0 01.708.708L8 12.793z"/>
                    <path d="M2 14.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"/>
                </svg>
                <span>Download Options</span>
            </div>
            <div class="dropdown-separator"></div>
            <div class="dropdown-item recommended" data-quality="sd">
                <div class="item-icon">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        <path d="M2.002 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2h-12zm12 1a1 1 0 0 1 1 1v6.5l-3.777-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3a1 1 0 0 1 1-1h12z"/>
                    </svg>
                </div>
                <div class="item-content">
                    <div class="item-title">Standard Quality</div>
                    <div class="item-subtitle">Discord friendly • Fast download</div>
                    <div class="item-size">~2-5 MB</div>
                </div>
                <div class="item-badge">Recommended</div>
            </div>
            <div class="dropdown-item" data-quality="hd">
                <div class="item-icon">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M6.002 5.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
                        <path d="M1.5 2A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h13a1.5 1.5 0 0 0 1.5-1.5v-9A1.5 1.5 0 0 0 14.5 2h-13zm13 1a.5.5 0 0 1 .5.5v6l-3.775-1.947a.5.5 0 0 0-.577.093l-3.71 3.71-2.66-1.772a.5.5 0 0 0-.63.062L1.002 12V3.5a.5.5 0 0 1 .5-.5h13z"/>
                        <circle cx="10.5" cy="8.5" r="1.5" fill="currentColor"/>
                    </svg>
                </div>
                <div class="item-content">
                    <div class="item-title">High Quality</div>
                    <div class="item-subtitle">Best resolution • Larger file</div>
                    <div class="item-size">~8-15 MB</div>
                </div>
            </div>
        `;

        downloadDropdown.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 62px;
            z-index: 10001;
            background: rgba(15, 15, 15, 0.98);
            border: 1px solid rgba(255, 255, 255, 0.12);
            border-radius: 12px;
            backdrop-filter: blur(16px);
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.6), 0 2px 8px rgba(0, 0, 0, 0.4);
            display: none;
            flex-direction: column;
            min-width: 240px;
            max-width: 280px;
            overflow: hidden;
            transform: translateY(10px) scale(0.95);
            opacity: 0;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        `;

        // Enhanced CSS styles for dropdown
        if (!document.getElementById('redgifs-dropdown-styles')) {
            const style = document.createElement('style');
            style.id = 'redgifs-dropdown-styles';
            style.textContent = `
                /* Dropdown Header */
                #redgifs-download-dropdown .dropdown-header {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 16px 8px 16px;
                    color: rgba(255, 255, 255, 0.9);
                    font-size: 13px;
                    font-weight: 600;
                    letter-spacing: -0.01em;
                }
                
                /* Separator */
                #redgifs-download-dropdown .dropdown-separator {
                    height: 1px;
                    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.08), transparent);
                    margin: 0 12px 8px 12px;
                }
                
                /* Dropdown Items */
                #redgifs-download-dropdown .dropdown-item {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
                    user-select: none;
                    border: none;
                    background: none;
                    width: 100%;
                    text-align: left;
                    position: relative;
                    margin: 2px 8px;
                    border-radius: 8px;
                }
                
                #redgifs-download-dropdown .dropdown-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                    transform: translateX(2px);
                }
                
                #redgifs-download-dropdown .dropdown-item.recommended {
                    background: linear-gradient(135deg, rgba(34, 197, 94, 0.12), rgba(34, 197, 94, 0.08));
                    border: 1px solid rgba(34, 197, 94, 0.2);
                }
                
                #redgifs-download-dropdown .dropdown-item.recommended:hover {
                    background: linear-gradient(135deg, rgba(34, 197, 94, 0.18), rgba(34, 197, 94, 0.12));
                    border-color: rgba(34, 197, 94, 0.3);
                    transform: translateX(2px);
                }
                
                /* Item Icons */
                #redgifs-download-dropdown .item-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: rgba(255, 255, 255, 0.08);
                    border-radius: 8px;
                    color: rgba(255, 255, 255, 0.8);
                    flex-shrink: 0;
                    transition: all 0.2s ease;
                }
                
                #redgifs-download-dropdown .dropdown-item:hover .item-icon {
                    background: rgba(255, 255, 255, 0.12);
                    color: rgba(255, 255, 255, 0.95);
                    transform: scale(1.05);
                }
                
                #redgifs-download-dropdown .dropdown-item.recommended .item-icon {
                    background: rgba(34, 197, 94, 0.15);
                    color: rgba(34, 197, 94, 0.9);
                }
                
                #redgifs-download-dropdown .dropdown-item.recommended:hover .item-icon {
                    background: rgba(34, 197, 94, 0.25);
                    color: rgb(34, 197, 94);
                }
                
                /* Item Content */
                #redgifs-download-dropdown .item-content {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }
                
                #redgifs-download-dropdown .item-title {
                    font-size: 14px;
                    font-weight: 600;
                    color: rgba(255, 255, 255, 0.95);
                    line-height: 1.2;
                    letter-spacing: -0.01em;
                }
                
                #redgifs-download-dropdown .item-subtitle {
                    font-size: 12px;
                    font-weight: 400;
                    color: rgba(255, 255, 255, 0.65);
                    line-height: 1.3;
                }
                
                #redgifs-download-dropdown .item-size {
                    font-size: 11px;
                    font-weight: 500;
                    color: rgba(255, 255, 255, 0.5);
                    margin-top: 2px;
                    font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
                }
                
                /* Recommended Badge */
                #redgifs-download-dropdown .item-badge {
                    font-size: 10px;
                    font-weight: 600;
                    color: rgb(34, 197, 94);
                    background: rgba(34, 197, 94, 0.15);
                    padding: 3px 8px;
                    border-radius: 12px;
                    letter-spacing: 0.5px;
                    text-transform: uppercase;
                    border: 1px solid rgba(34, 197, 94, 0.2);
                    flex-shrink: 0;
                }
                
                /* Disabled State */
                #redgifs-download-dropdown .dropdown-item[disabled] {
                    opacity: 0.4;
                    cursor: not-allowed;
                    pointer-events: none;
                }
                
                /* Show Animation */
                #redgifs-download-dropdown.show {
                    transform: translateY(0) scale(1);
                    opacity: 1;
                }
                
                /* Responsive Adjustments */
                @media (max-width: 768px) {
                    #redgifs-download-dropdown {
                        min-width: 220px;
                        max-width: 260px;
                        border-radius: 10px;
                    }
                    
                    #redgifs-download-dropdown .dropdown-item {
                        padding: 10px 14px;
                    }
                    
                    #redgifs-download-dropdown .item-title {
                        font-size: 13px;
                    }
                    
                    #redgifs-download-dropdown .item-subtitle {
                        font-size: 11px;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        // Add click handlers
        downloadDropdown.addEventListener('click', handleDropdownClick);
        
        return downloadDropdown;
    }

    // Handle dropdown item clicks
    async function handleDropdownClick(event) {
        const item = event.target.closest('.dropdown-item');
        if (!item || isDownloading || item.hasAttribute('disabled')) return;
        
        const quality = item.dataset.quality;
        hideDropdown();
        await performDownload(quality);
    }

    // Show dropdown with enhanced animations and better UX
    function showDropdown() {
        if (!downloadDropdown || isDownloading || isDropdownVisible) return;
        
        clearTimeout(dropdownTimeout);
        isDropdownVisible = true;
        
        // Update dropdown based on available qualities
        const activeVideo = detectCurrentVideo();
        const qualities = detectAvailableQualities(activeVideo);
        
        const sdItem = downloadDropdown.querySelector('[data-quality="sd"]');
        const hdItem = downloadDropdown.querySelector('[data-quality="hd"]');
        
        // Update file size information
        if (sdItem) {
            const sizeSpan = sdItem.querySelector('.item-size');
            if (sizeSpan) sizeSpan.textContent = qualities.sd.size;
            sdItem.style.display = qualities.sd.available ? 'flex' : 'none';
        }
        
        if (hdItem) {
            const sizeSpan = hdItem.querySelector('.item-size');
            if (sizeSpan) sizeSpan.textContent = qualities.hd.size;
            hdItem.style.display = qualities.hd.available ? 'flex' : 'none';
            
            if (!qualities.hd.available) {
                hdItem.setAttribute('disabled', 'true');
            } else {
                hdItem.removeAttribute('disabled');
            }
        }
        
        // Responsive positioning
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        if (mediaQuery.matches) {
            downloadDropdown.style.bottom = '60px';
            downloadDropdown.style.right = '47px';
        } else {
            downloadDropdown.style.bottom = '70px';
            downloadDropdown.style.right = '62px';
        }
        
        // Show with animation
        downloadDropdown.style.display = 'flex';
        requestAnimationFrame(() => {
            downloadDropdown.classList.add('show');
        });
    }

    // Hide dropdown with smooth animation
    function hideDropdown() {
        if (!downloadDropdown || !isDropdownVisible) return;
        
        dropdownTimeout = setTimeout(() => {
            downloadDropdown.classList.remove('show');
            isDropdownVisible = false;
            
            setTimeout(() => {
                if (!isDropdownVisible) {
                    downloadDropdown.style.display = 'none';
                }
            }, 250);
        }, 150);
    }

    // Create fixed download button without conflicting elements
    function createDownloadButton() {
        if (downloadButton) return downloadButton;

        downloadButton = document.createElement('button');
        downloadButton.id = 'redgifs-download-btn';
        
        // Create icon container separately to avoid innerHTML conflicts
        const iconContainer = document.createElement('div');
        iconContainer.id = 'download-icon-container';
        iconContainer.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 12.793L5.646 10.44a.5.5 0 01.708-.708L7.5 10.879V1.5a.5.5 0 011 0v9.379l1.146-1.147a.5.5 0 01.708.708L8 12.793z"/>
                <path d="M2 14.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"/>
            </svg>
        `;
        
        downloadButton.appendChild(iconContainer);

        downloadButton.style.cssText = `
            position: fixed;
            bottom: 70px;
            right: 20px;
            z-index: 10000;
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.85));
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 10px;
            padding: 10px;
            font-size: 12px;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(12px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2);
            user-select: none;
            outline: none;
            width: 36px;
            height: 36px;
            min-width: 36px;
            min-height: 36px;
        `;

        // Enhanced hover effects and dropdown handling
        downloadButton.addEventListener('mouseenter', () => {
            if (!isDownloading) {
                downloadButton.style.transform = 'translateY(-2px) scale(1.05)';
                downloadButton.style.background = 'linear-gradient(135deg, rgba(20, 20, 20, 0.95), rgba(40, 40, 40, 0.9))';
                downloadButton.style.borderColor = 'rgba(255, 255, 255, 0.25)';
                downloadButton.style.boxShadow = '0 8px 24px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3)';
                
                clearTimeout(dropdownTimeout);
                setTimeout(showDropdown, 300);
            }
        });

        downloadButton.addEventListener('mouseleave', () => {
            if (!isDownloading) {
                downloadButton.style.transform = 'translateY(0) scale(1)';
                downloadButton.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.85))';
                downloadButton.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                downloadButton.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)';
                
                hideDropdown();
            }
        });

        // Handle click for default SD download
        downloadButton.addEventListener('click', () => performDownload('sd'));
        
        return downloadButton;
    }

    // Update icon content during download states
    function updateDownloadButtonIcon(content) {
        const iconContainer = downloadButton?.querySelector('#download-icon-container');
        if (iconContainer) {
            iconContainer.innerHTML = content;
        }
    }

    // Enhanced download functionality with better visual feedback
    async function performDownload(quality = 'sd') {
        if (isDownloading) return;

        isDownloading = true;

        try {
            // Enhanced loading animation
            updateDownloadButtonIcon(`
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="3" fill="currentColor">
                        <animate attributeName="r" values="3;6;3" dur="1s" repeatCount="indefinite"/>
                        <animate attributeName="opacity" values="1;0.3;1" dur="1s" repeatCount="indefinite"/>
                    </circle>
                    <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" stroke-width="2" opacity="0.3">
                        <animate attributeName="stroke-dasharray" values="0 50;25 25;0 50" dur="1.5s" repeatCount="indefinite"/>
                        <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="2s" repeatCount="indefinite"/>
                    </circle>
                </svg>
            `);
            downloadButton.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.9), rgba(79, 70, 229, 0.8))';
            downloadButton.style.borderColor = 'rgba(59, 130, 246, 0.6)';

            const videoId = getCurrentVideoId();
            if (!videoId) {
                throw new Error('Could not detect current video');
            }

            console.log(`Downloading video ${videoId} in ${quality.toUpperCase()} quality`);

            const urls = await getSignedUrls(videoId);
            if (!urls) {
                throw new Error('Could not get video URLs from API');
            }

            // Choose URL based on requested quality with SD fallback
            let downloadUrl;
            if (quality === 'hd' && urls.hd) {
                downloadUrl = urls.hd;
            } else if (urls.sd) {
                downloadUrl = urls.sd;
            } else {
                downloadUrl = urls.hd || urls.thumbnail;
            }

            if (!downloadUrl) {
                throw new Error('No suitable video URL found');
            }

            // Generate filename
            const filename = `redgifs_${videoId}_${quality}.mp4`;
            
            // Download video to internal storage
            await downloadVideoFile(downloadUrl, filename);

            // Enhanced success feedback
            updateDownloadButtonIcon(`
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                </svg>
            `);
            downloadButton.style.background = 'linear-gradient(135deg, rgba(34, 197, 94, 0.9), rgba(21, 128, 61, 0.8))';
            downloadButton.style.borderColor = 'rgba(34, 197, 94, 0.6)';
            downloadButton.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.3), 0 2px 8px rgba(34, 197, 94, 0.2)';

            setTimeout(() => {
                updateDownloadButtonIcon(`
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 12.793L5.646 10.44a.5.5 0 01.708-.708L7.5 10.879V1.5a.5.5 0 011 0v9.379l1.146-1.147a.5.5 0 01.708.708L8 12.793z"/>
                        <path d="M2 14.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"/>
                    </svg>
                `);
                downloadButton.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.85))';
                downloadButton.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                downloadButton.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)';
                isDownloading = false;
            }, 2500);

        } catch (error) {
            console.error('Download failed:', error);

            // Enhanced error feedback
            updateDownloadButtonIcon(`
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            `);
            downloadButton.style.background = 'linear-gradient(135deg, rgba(239, 68, 68, 0.9), rgba(185, 28, 28, 0.8))';
            downloadButton.style.borderColor = 'rgba(239, 68, 68, 0.6)';
            downloadButton.style.boxShadow = '0 8px 24px rgba(239, 68, 68, 0.3), 0 2px 8px rgba(239, 68, 68, 0.2)';

            setTimeout(() => {
                updateDownloadButtonIcon(`
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M8 12.793L5.646 10.44a.5.5 0 01.708-.708L7.5 10.879V1.5a.5.5 0 011 0v9.379l1.146-1.147a.5.5 0 01.708.708L8 12.793z"/>
                        <path d="M2 14.5a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 01-.5-.5z"/>
                    </svg>
                `);
                downloadButton.style.background = 'linear-gradient(135deg, rgba(0, 0, 0, 0.9), rgba(20, 20, 20, 0.85))';
                downloadButton.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                downloadButton.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3), 0 1px 4px rgba(0, 0, 0, 0.2)';
                isDownloading = false;
            }, 3500);
        }
    }

    // Create enhanced copy button
    function createCopyButton() {
        if (copyButton) return copyButton;

        copyButton = document.createElement('button');
        copyButton.id = 'redgifs-content-copy-btn';
        copyButton.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
            </svg>
            <span>Copy Video</span>
        `;

        copyButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 10000;
            background: rgba(0, 0, 0, 0.85);
            color: white;
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            padding: 10px 14px;
            font-size: 13px;
            font-weight: 500;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 6px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            backdrop-filter: blur(8px);
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
            user-select: none;
            outline: none;
            min-width: 110px;
            justify-content: center;
        `;

        // Responsive design for copy button only
        const mediaQuery = window.matchMedia('(max-width: 768px)');
        function applyResponsiveStyles() {
            if (mediaQuery.matches) {
                copyButton.style.bottom = '15px';
                copyButton.style.right = '15px';
                copyButton.style.padding = '8px 12px';
                copyButton.style.fontSize = '12px';
                copyButton.style.minWidth = '90px';
                // Adjust download button position on mobile
                if (downloadButton) {
                    downloadButton.style.bottom = '60px';
                    downloadButton.style.right = '15px';
                }
            } else {
                copyButton.style.bottom = '20px';
                copyButton.style.right = '20px';
                copyButton.style.padding = '10px 14px';
                copyButton.style.fontSize = '13px';
                copyButton.style.minWidth = '110px';
                // Adjust download button position on desktop
                if (downloadButton) {
                    downloadButton.style.bottom = '70px';
                    downloadButton.style.right = '20px';
                }
            }
        }
        applyResponsiveStyles();
        mediaQuery.addListener(applyResponsiveStyles);

        // Enhanced hover effects
        copyButton.addEventListener('mouseenter', () => {
            if (!isProcessing) {
                copyButton.style.background = 'rgba(0, 0, 0, 0.95)';
                copyButton.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                copyButton.style.transform = 'translateY(-2px)';
                copyButton.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.4)';
            }
        });

        copyButton.addEventListener('mouseleave', () => {
            if (!isProcessing) {
                copyButton.style.background = 'rgba(0, 0, 0, 0.85)';
                copyButton.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                copyButton.style.transform = 'translateY(0)';
                copyButton.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
            }
        });

        copyButton.addEventListener('click', handleCopyClick);
        return copyButton;
    }

    // Enhanced copy handler
    async function handleCopyClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if (isProcessing) return;

        isProcessing = true;
        const originalContent = copyButton.innerHTML;

        try {
            copyButton.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" stroke-width="2"/>
                    <path d="M12 2 A10 10 0 0 1 22 12" stroke="currentColor" stroke-width="2" fill="none">
                        <animateTransform attributeName="transform" type="rotate" values="0 12 12;360 12 12" dur="1s" repeatCount="indefinite"/>
                    </path>
                </svg>
                <span>Getting URL...</span>
            `;
            copyButton.style.background = 'rgba(64, 64, 64, 0.9)';

            const videoId = getCurrentVideoId();
            if (!videoId) {
                throw new Error('Could not detect current video');
            }

            if (videoId === currentVideoId) {
                console.log('Same video detected:', videoId);
            } else {
                console.log('New video detected:', videoId);
                currentVideoId = videoId;
            }

            const urls = await getSignedUrls(videoId);
            if (!urls) {
                throw new Error('Could not get signed URLs from API');
            }

            const signedUrl = urls.hd || urls.sd || urls.thumbnail || null;
            if (!signedUrl) {
                throw new Error('No valid signed URL found');
            }

            // Copy to clipboard
            let copySuccess = false;

            if (navigator.clipboard && window.isSecureContext) {
                try {
                    await navigator.clipboard.writeText(signedUrl);
                    copySuccess = true;
                } catch (clipboardError) {
                    console.warn('Clipboard API failed, using fallback');
                }
            }

            if (!copySuccess) {
                const textArea = document.createElement('textarea');
                textArea.value = signedUrl;
                textArea.style.cssText = 'position:fixed;top:-999px;opacity:0;pointer-events:none;';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                copySuccess = document.execCommand('copy');
                document.body.removeChild(textArea);
            }

            if (copySuccess) {
                copyButton.innerHTML = `
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                        <path d="M13.854 3.646a.5.5 0 0 1 0 .708l-7 7a.5.5 0 0 1-.708 0l-3.5-3.5a.5.5 0 1 1 .708-.708L6.5 10.293l6.646-6.647a.5.5 0 0 1 .708 0z"/>
                    </svg>
                    <span>Copied! (1h)</span>
                `;
                copyButton.style.background = 'rgba(34, 197, 94, 0.9)';
                copyButton.style.borderColor = 'rgba(34, 197, 94, 0.6)';

                setTimeout(() => {
                    copyButton.innerHTML = originalContent;
                    copyButton.style.background = 'rgba(0, 0, 0, 0.85)';
                    copyButton.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    isProcessing = false;
                }, 3000);
            } else {
                throw new Error('Copy to clipboard failed');
            }

        } catch (error) {
            console.error('Copy operation failed:', error);

            copyButton.innerHTML = `
                <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
                <span>Failed</span>
            `;
            copyButton.style.background = 'rgba(239, 68, 68, 0.9)';
            copyButton.style.borderColor = 'rgba(239, 68, 68, 0.6)';

            setTimeout(() => {
                copyButton.innerHTML = originalContent;
                copyButton.style.background = 'rgba(0, 0, 0, 0.85)';
                copyButton.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                isProcessing = false;
            }, 4000);
        }
    }

    // Setup comprehensive video monitoring
    function setupVideoMonitoring() {
        // Intersection observer for video visibility changes
        if (videoObserver) {
            videoObserver.disconnect();
        }

        videoObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
                    // Video became prominently visible
                    setTimeout(() => {
                        const newVideoId = getCurrentVideoId();
                        if (newVideoId && newVideoId !== currentVideoId) {
                            currentVideoId = newVideoId;
                            console.log('Video changed via intersection:', newVideoId);
                        }
                    }, 100);
                }
            });
        }, {
            threshold: [0.3, 0.5, 0.7],
            rootMargin: '0px'
        });

        // Observe all videos
        document.querySelectorAll('video').forEach(video => {
            videoObserver.observe(video);
        });

        // Scroll monitoring with throttling
        let scrollTimeout;
        const scrollHandler = () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const newVideoId = getCurrentVideoId();
                if (newVideoId && newVideoId !== currentVideoId) {
                    currentVideoId = newVideoId;
                    console.log('Video changed via scroll:', newVideoId);
                }
            }, 150);
        };

        window.addEventListener('scroll', scrollHandler, { passive: true });

        // Monitor for new videos being added
        const domObserver = new MutationObserver((mutations) => {
            let hasNewVideos = false;

            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'VIDEO' || node.querySelector?.('video')) {
                            hasNewVideos = true;
                            if (node.tagName === 'VIDEO') {
                                videoObserver.observe(node);
                            } else {
                                node.querySelectorAll('video').forEach(v => videoObserver.observe(v));
                            }
                        }
                    }
                });
            });

            if (hasNewVideos) {
                setTimeout(() => {
                    const newVideoId = getCurrentVideoId();
                    if (newVideoId && newVideoId !== currentVideoId) {
                        currentVideoId = newVideoId;
                        console.log('Video changed via DOM update:', newVideoId);
                    }
                }, 300);
            }
        });

        domObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Enhanced button state management with niches and search support
    async function updateButtonState() {
        console.log('Updating button state...', window.location.pathname);
        
        // Enhanced page detection including niches and search pages
        const isValidPage = window.location.pathname.startsWith('/users/') ||
                           window.location.pathname.startsWith('/watch/') ||
                           window.location.pathname.startsWith('/niches/') ||
                           window.location.pathname.startsWith('/search/') ||
                           window.location.pathname === '/' ||
                           window.location.pathname === '' ||
                           window.location.pathname === '/home' ||
                           isValidPageWithContent();
        
        if (isValidPage) {
            // Wait for videos to load
            const hasVideos = await waitForVideosOnHomepage();
            
            if (hasVideos) {
                // Create and add both buttons and dropdown
                if (!copyButton || !document.body.contains(copyButton)) {
                    const copyBtn = createCopyButton();
                    document.body.appendChild(copyBtn);
                    console.log('Copy button created and added to page');
                }
                
                if (!downloadButton || !document.body.contains(downloadButton)) {
                    const downloadBtn = createDownloadButton();
                    document.body.appendChild(downloadBtn);
                    console.log('Download button created and added to page');
                }
                
                if (!downloadDropdown || !document.body.contains(downloadDropdown)) {
                    const dropdown = createDownloadDropdown();
                    document.body.appendChild(dropdown);
                    
                    // Setup dropdown hover handling
                    dropdown.addEventListener('mouseenter', () => {
                        clearTimeout(dropdownTimeout);
                        isDropdownVisible = true;
                    });
                    dropdown.addEventListener('mouseleave', hideDropdown);
                    
                    console.log('Download dropdown created and added to page');
                }
                
                copyButton.style.display = 'flex';
                downloadButton.style.display = 'flex';
                
                // Initialize video monitoring
                setupVideoMonitoring();
                
                // Get initial video ID with delay to ensure content is ready
                setTimeout(() => {
                    const initialVideoId = getCurrentVideoId();
                    if (initialVideoId) {
                        currentVideoId = initialVideoId;
                        console.log('Initial video detected:', initialVideoId);
                    } else {
                        console.log('No initial video detected, will monitor for changes');
                    }
                }, 1000);
                
            } else {
                console.log('No videos found after waiting period');
                if (copyButton) {
                    copyButton.style.display = 'none';
                }
                if (downloadButton) {
                    downloadButton.style.display = 'none';
                }
                if (downloadDropdown) {
                    downloadDropdown.style.display = 'none';
                }
            }
        } else {
            if (copyButton) {
                copyButton.style.display = 'none';
            }
            if (downloadButton) {
                downloadButton.style.display = 'none';
            }
            if (downloadDropdown) {
                downloadDropdown.style.display = 'none';
            }
        }
    }

    // Enhanced initialization with multiple attempts
    async function initialize() {
        console.log('RedGifs Content-Aware Copy Button & Download initializing...');
        
        // Extract token early with more aggressive retry
        setTimeout(extractBearerToken, 500);
        
        // Initial button state update
        await updateButtonState();
        
        // Monitor URL changes for SPA navigation with faster polling
        let currentUrl = window.location.href;
        const urlCheckInterval = setInterval(async () => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                console.log('URL changed, updating button state');
                setTimeout(async () => await updateButtonState(), 300);
            }
        }, 250); // Faster polling for better responsiveness
        
        // Handle page visibility changes
        document.addEventListener('visibilitychange', async () => {
            if (!document.hidden) {
                setTimeout(async () => await updateButtonState(), 200);
            }
        });
        
        // Add additional MutationObserver for content changes
        const contentObserver = new MutationObserver(async (mutations) => {
            let hasNewContent = false;
            
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        if (node.tagName === 'VIDEO' || 
                            node.querySelector?.('video') ||
                            node.className?.includes('video') ||
                            node.className?.includes('gif')) {
                            hasNewContent = true;
                        }
                    }
                });
            });
            
            if (hasNewContent && (!copyButton || copyButton.style.display !== 'flex')) {
                console.log('New video content detected, updating button state');
                setTimeout(async () => await updateButtonState(), 500);
            }
        });
        
        contentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
        
        console.log('RedGifs Content-Aware Copy Button & Download initialized');
    }

    // Enhanced startup sequence with multiple initialization attempts
    function startScript() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initialize);
        } else {
            initialize();
        }
        
        // Additional safety net - retry initialization after page load
        window.addEventListener('load', () => {
            setTimeout(async () => {
                if (!downloadButton || !document.body.contains(downloadButton)) {
                    console.log('Safety net: Re-initializing download button after page load');
                    await updateButtonState();
                }
            }, 1000);
        });
        
        // Final fallback for stubborn pages
        setTimeout(async () => {
            if (!downloadButton || !document.body.contains(downloadButton)) {
                console.log('Final fallback: Force download button creation');
                await updateButtonState();
            }
        }, 3000);
    }

    // Start the script with enhanced initialization
    startScript();
})();
