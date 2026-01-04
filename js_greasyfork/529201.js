// ==UserScript==
// @name         Zoom Smart Chapters Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Download Zoom Smart Chapters in JSON and Markdown formats: https://gist.github.com/aculich/491ace4a581c8707fa6cd8304d89ea79
// @author       Your name
// @match        https://*.zoom.us/rec/play/*
// @match        https://*.zoom.us/rec/share/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529201/Zoom%20Smart%20Chapters%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/529201/Zoom%20Smart%20Chapters%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Utility function to format time in HH:MM:SS
    function formatTime(seconds) {
        return new Date(seconds * 1000).toISOString().substr(11, 8);
    }

    // Parse time string (e.g. "From 00:00" or "From 01:23:45") to seconds
    function parseTimeString(timeStr) {
        const match = timeStr.match(/From (\d{2}:)?(\d{2}):(\d{2})/);
        if (!match) return 0;
        
        const hours = match[1] ? parseInt(match[1]) : 0;
        const minutes = parseInt(match[2]);
        const seconds = parseInt(match[3]);
        
        return hours * 3600 + minutes * 60 + seconds;
    }

    // Get the Unix timestamp in milliseconds for a given offset in seconds
    function getUnixTimestamp(offsetSeconds) {
        // Get the recording start time from the URL if available
        const urlParams = new URLSearchParams(window.location.search);
        const startTimeParam = urlParams.get('startTime');
        
        if (startTimeParam) {
            // If we have a startTime parameter, use it as reference
            const baseTime = parseInt(startTimeParam);
            // Remove the offset that was added to the URL
            const currentOffset = urlParams.get('t') || 0;
            return baseTime - (currentOffset * 1000) + (offsetSeconds * 1000);
        } else {
            // Fallback: Use current time minus total duration as base
            const now = Date.now();
            const videoDuration = document.querySelector('video')?.duration || 0;
            const videoCurrentTime = document.querySelector('video')?.currentTime || 0;
            const startTime = now - ((videoDuration - videoCurrentTime) * 1000);
            return startTime + (offsetSeconds * 1000);
        }
    }

    // Monitor DOM changes for dynamic content
    function setupDynamicContentMonitor() {
        const observer = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                if (mutation.type === 'childList' && mutation.addedNodes.length) {
                    mutation.addedNodes.forEach(node => {
                        if (node.nodeType === Node.ELEMENT_NODE) {
                            // Check if this is a summary or description element
                            if (node.classList?.contains('smart-chapter-summary') ||
                                node.classList?.contains('content') ||
                                node.querySelector?.('.smart-chapter-summary, .content')) {
                                console.group('Dynamic Content Added:');
                                console.log('Element:', node);
                                console.log('Class:', node.className);
                                console.log('Content:', node.textContent?.trim().substring(0, 100) + '...');
                                console.log('Full HTML:', node.outerHTML);
                                console.groupEnd();
                            }
                        }
                    });
                }
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        return observer;
    }

    // Monitor network requests for API calls
    function setupNetworkMonitor() {
        const originalFetch = window.fetch;
        window.fetch = async function(...args) {
            const url = args[0];
            if (typeof url === 'string' && url.includes('zoom.us')) {
                console.group('Zoom API Request:');
                console.log('URL:', url);
                console.log('Args:', args[1]);
                console.groupEnd();
            }
            return originalFetch.apply(this, args);
        };

        const originalXHR = window.XMLHttpRequest.prototype.open;
        window.XMLHttpRequest.prototype.open = function(...args) {
            const url = args[1];
            if (typeof url === 'string' && url.includes('zoom.us')) {
                console.group('Zoom XHR Request:');
                console.log('URL:', url);
                console.log('Method:', args[0]);
                console.groupEnd();
            }
            return originalXHR.apply(this, args);
        };
    }

    // Helper function to wait for an element
    function waitForElement(selector, timeout = 2000) {
        return new Promise((resolve) => {
            if (document.querySelector(selector)) {
                return resolve(document.querySelector(selector));
            }

            const observer = new MutationObserver(() => {
                if (document.querySelector(selector)) {
                    observer.disconnect();
                    resolve(document.querySelector(selector));
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        });
    }

    // Extract chapters from the DOM with enhanced dynamic content handling
    async function extractChapters() {
        const chapters = [];
        const chapterElements = document.querySelectorAll('.smart-chapter-card');
        
        // Get the base URL from og:url meta tag
        const ogUrlMeta = document.querySelector('meta[property="og:url"]');
        const baseUrl = ogUrlMeta ? ogUrlMeta.content : window.location.href.split('?')[0];
        
        // Get the original startTime from URL - this must remain constant across all chapter links
        // due to Zoom's URL handling limitations
        const urlParams = new URLSearchParams(window.location.search);
        const originalStartTime = urlParams.get('startTime') || '';
        
        // Note: Due to Zoom's URL handling limitations, we must:
        // 1. Keep the original startTime parameter the same across all chapter links
        // 2. Add our calculated chapter start times in a separate parameter (chapterStartTime)
        // This is because Zoom's player currently only respects the first chapter's startTime
        // and ignores subsequent chapter timings. We keep our calculated times in the URL
        // for potential future workarounds or third-party tools.
        
        console.group('Interactive Chapter Extraction:');
        
        for (let index = 0; index < chapterElements.length; index++) {
            const el = chapterElements[index];
            const timeEl = el.querySelector('.start-time');
            const titleEl = el.querySelector('.chapter-card-title');
            
            if (timeEl && titleEl) {
                console.group(`Processing Chapter ${index + 1}`);
                const timeStr = timeEl.textContent.trim();
                const title = titleEl.textContent.trim();
                console.log('Found title:', title);
                
                // Try to trigger content loading through various interactions
                console.group('Triggering Interactions:');
                
                // 1. Click the chapter card
                console.log('Clicking chapter card...');
                el.click();
                // Wait longer after clicking the card
                console.log('Waiting for UI update...');
                await new Promise(r => setTimeout(r, 1500));
                
                // 2. Try to find any clickable elements within the card
                const clickables = el.querySelectorAll('button, [role="button"], [tabindex="0"]');
                for (const clickable of clickables) {
                    console.log('Clicking element:', clickable.className);
                    clickable.click();
                    // Wait between clicking different elements
                    await new Promise(r => setTimeout(r, 800));
                }
                
                // 3. Look for Vue.js related elements
                const vueElements = el.querySelectorAll('[data-v-5eece099]');
                console.log(`Found ${vueElements.length} Vue elements`);
                vueElements.forEach(vueEl => {
                    if (vueEl.__vue__) {
                        console.log('Vue instance found:', vueEl.__vue__.$data);
                        try {
                            vueEl.__vue__.$emit('click');
                            vueEl.__vue__.$emit('select');
                        } catch (e) {
                            console.log('Vue event emission failed:', e);
                        }
                    }
                });
                
                // 4. Wait for potential dynamic content
                console.log('Waiting for description content...');
                const summaryEl = await waitForElement('.smart-chapter-summary');
                if (summaryEl) {
                    console.log('Found summary element after waiting');
                    // Add extra wait after finding summary element
                    await new Promise(r => setTimeout(r, 1000));
                }
                
                console.groupEnd();
                
                const offsetSeconds = parseTimeString(timeStr);
                const startTime = getUnixTimestamp(offsetSeconds);

                // Get description using multiple approaches
                let description = '';
                
                // Try different selectors and approaches
                const attempts = [
                    // Direct content div under summary
                    () => document.querySelector(`.smart-chapter-summary:nth-child(${index + 1}) .content > div`)?.textContent,
                    // Active/selected summary
                    () => document.querySelector('.smart-chapter-summary.active .content > div')?.textContent,
                    // Summary with matching title
                    () => Array.from(document.querySelectorAll('.smart-chapter-summary'))
                        .find(sum => sum.querySelector('.title')?.textContent.includes(title))
                        ?.querySelector('.content > div')?.textContent,
                    // Any visible summary content
                    () => document.querySelector('.smart-chapter-summary:not([style*="display: none"]) .content > div')?.textContent
                ];
                
                for (const attempt of attempts) {
                    const result = attempt();
                    if (result) {
                        description = result.trim();
                        console.log('Found description using attempt:', description.substring(0, 50) + '...');
                        break;
                    }
                    // Add small delay between attempts
                    await new Promise(r => setTimeout(r, 300));
                }

                console.log('Final description length:', description.length);
                console.groupEnd();

                chapters.push({
                    timestamp: timeStr,
                    startTime: startTime,
                    title: title,
                    description: description,
                    // Keep original startTime and add our calculated time as chapterStartTime
                    url: `${baseUrl}?${originalStartTime ? `startTime=${originalStartTime}&` : ''}chapterStartTime=${startTime}`
                });
                
                // Much longer delay (10 seconds) between processing chapters
                const nextChapter = index + 2;
                const totalChapters = chapterElements.length;
                console.log(`Waiting 1 seconds before processing chapter ${nextChapter}/${totalChapters}...`);
                await new Promise(r => setTimeout(r, 1000));
            }
        }
        
        console.groupEnd();
        return chapters;
    }

    // Convert chapters to markdown format
    function chaptersToMarkdown(chapters) {
        return chapters.map(chapter => {
            // Use the original timestamp from the HTML instead of converting Unix time
            const time = chapter.timestamp.replace('From ', '');
            return `## [${chapter.title} (${time})](${chapter.url})\n\n${chapter.description}\n`;
        }).join('\n');
    }

    // Convert chapters to JSON format
    function chaptersToJSON(chapters) {
        return JSON.stringify(chapters, null, 2);
    }

    // Download content as file
    function downloadFile(content, filename) {
        const blob = new Blob([content], { type: 'text/plain' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    }

    // Create banner with enhanced debug capabilities
    function createBanner() {
        const banner = document.createElement('div');
        banner.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            background: #2D8CFF;
            color: white;
            padding: 10px;
            z-index: 9999;
            display: flex;
            justify-content: center;
            align-items: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        `;

        const container = document.createElement('div');
        container.style.cssText = `
            display: flex;
            gap: 10px;
            align-items: center;
        `;

        const label = document.createElement('span');
        label.textContent = 'Smart Chapters:';
        label.style.fontWeight = 'bold';

        // Common button style
        const buttonStyle = `
            padding: 5px 15px;
            border-radius: 4px;
            border: none;
            background: white;
            color: #2D8CFF;
            cursor: pointer;
            font-weight: bold;
        `;

        // Common function to extract and process chapters
        async function getProcessedChapters() {
            console.group('Starting Chapter Extraction');
            const chapters = await extractChapters();
            console.log('Total chapters extracted:', chapters.length);
            return chapters;
        }

        const jsonButton = document.createElement('button');
        jsonButton.textContent = 'Download JSON';
        jsonButton.style.cssText = buttonStyle;
        jsonButton.onclick = async () => {
            const chapters = await getProcessedChapters();
            downloadFile(chaptersToJSON(chapters), `zoom-chapters-${Date.now()}.json`);
            console.groupEnd();
        };

        const mdButton = document.createElement('button');
        mdButton.textContent = 'Download Markdown';
        mdButton.style.cssText = buttonStyle;
        mdButton.onclick = async () => {
            const chapters = await getProcessedChapters();
            downloadFile(chaptersToMarkdown(chapters), `zoom-chapters-${Date.now()}.md`);
            console.groupEnd();
        };

        const debugButton = document.createElement('button');
        debugButton.textContent = '🔍 Debug Log';
        debugButton.style.cssText = buttonStyle;
        debugButton.onclick = async () => {
            const chapters = await getProcessedChapters();
            
            // Additional debug logging
            console.group('Smart Chapters Debug Info');
            
            // Check window for global variables
            console.group('Global Variables:');
            const globals = ['smartChapters', 'chapters', 'zoomChapters', 'recording'].filter(
                key => window[key] !== undefined
            );
            console.log('Found globals:', globals);
            globals.forEach(key => console.log(key + ':', window[key]));
            console.groupEnd();
            
            // Check for React/Vue devtools
            console.group('Framework Detection:');
            console.log('Vue detected:', !!window.__VUE_DEVTOOLS_GLOBAL_HOOK__);
            console.log('React detected:', !!window.__REACT_DEVTOOLS_GLOBAL_HOOK__);
            console.groupEnd();
            
            chapters.forEach((chapter, index) => {
                console.group(`Chapter ${index + 1}: ${chapter.title}`);
                console.log('Timestamp:', chapter.timestamp);
                console.log('Unix Time:', chapter.startTime);
                console.log('Title:', chapter.title);
                console.log('Description:', chapter.description || '(no description)');
                console.log('URL:', chapter.url);
                console.groupEnd();
            });
            console.groupEnd();
            console.groupEnd();
        };

        container.appendChild(label);
        container.appendChild(jsonButton);
        container.appendChild(mdButton);
        container.appendChild(debugButton);
        banner.appendChild(container);

        // Adjust page content to account for banner height
        const contentAdjuster = document.createElement('div');
        contentAdjuster.style.height = '50px';
        document.body.insertBefore(contentAdjuster, document.body.firstChild);

        // Start monitors
        setupDynamicContentMonitor();
        setupNetworkMonitor();

        return banner;
    }

    // Main function to initialize the script
    function init() {
        // Wait for the Smart Chapters container to be available
        const checkForChapters = setInterval(() => {
            const chaptersContainer = document.querySelector('.smart-chapter-container');
            if (!chaptersContainer) return;

            // Only add the banner if it doesn't exist yet
            if (!document.getElementById('smart-chapters-banner')) {
                const banner = createBanner();
                banner.id = 'smart-chapters-banner';
                document.body.insertBefore(banner, document.body.firstChild);
                clearInterval(checkForChapters);
            }
        }, 1000);

        // Clear interval after 30 seconds to prevent infinite checking
        setTimeout(() => clearInterval(checkForChapters), 30000);
    }

    // Start the script
    init();
})();
