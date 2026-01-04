// ==UserScript==
// @name         Disney+ Arabic Subtitle Auto Downloader
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Automatically download Arabic subtitles from Disney+ once they're detected
// @author       @Daghriry 
// @match        https://www.apps.disneyplus.com/*
// @match        https://apps.disneyplus.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @require      https://cdn.jsdelivr.net/npm/file-saver@2.0.2/dist/FileSaver.min.js
// @downloadURL https://update.greasyfork.org/scripts/529441/Disney%2B%20Arabic%20Subtitle%20Auto%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/529441/Disney%2B%20Arabic%20Subtitle%20Auto%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const Config = {
        DEBUG: false,           // Set to false to reduce console logs
        CHECK_INTERVAL: 1500,   // Check interval for subtitle detection
        AUTO_DOWNLOAD: true     // Always auto-download when subtitle is found
    };

    // State tracking
    const State = {
        subtitleFound: false,         
        lastUrl: window.location.href,
        vttUrls: [],                   
        uiAdded: false,
        currentShowInfo: {}
    };

    // Simple logging utility
    const log = (message, data) => {
        if (Config.DEBUG) {
            console.log(`[Disney+ Subtitle Downloader] ${message}`, data || '');
        }
    };
    
    const error = (message, err) => {
        console.error(`[Disney+ Subtitle Downloader] ${message}`, err || '');
    };

    // Extract episode info from URL and page content
    const extractEpisodeInfo = () => {
        const url = window.location.href;
        const urlObj = new URL(url);
        const pathParts = urlObj.pathname.split('/');
        const queryParams = new URLSearchParams(urlObj.search);

        // Extract episode info
        let info = {
            showName: '',
            episodeNumber: parseInt(queryParams.get('episodeNumber') || '0'),
            seasonId: queryParams.get('seasonId') || '',
            episodeTitle: ''
        };

        // Extract from path
        for (let i = 0; i < pathParts.length; i++) {
            if (pathParts[i] === 'shows' && i+1 < pathParts.length) {
                info.showName = pathParts[i+1];
            }
        }

        // Try to get title information from the page elements
        try {
            const titleElement = document.querySelector('.title-field');
            if (titleElement) {
                info.showTitle = titleElement.innerText || info.showName;
            }

            const subtitleElement = document.querySelector('.subtitle-field, .subtitle-text');
            if (subtitleElement) {
                info.episodeTitle = subtitleElement.innerText;
            }
        } catch (e) {
            error('Error getting title info from DOM', e);
        }

        State.currentShowInfo = info;
        return info;
    };

    // Resolve relative URLs to absolute URLs
    const resolveUrl = (base, relative) => {
        if (relative.startsWith('http')) {
            return relative;
        }

        if (relative.startsWith('/')) {
            const urlObj = new URL(base);
            return `${urlObj.protocol}//${urlObj.host}${relative}`;
        }

        // Handle relative paths
        const baseParts = base.split('/');
        baseParts.pop();
        return `${baseParts.join('/')}/${relative}`;
    };

    // Convert VTT format to SRT format
    const convertVttToSrt = (vtt) => {
        // Remove the VTT header
        let content = vtt.replace(/WEBVTT\r?\n/, '');
        content = content.replace(/NOTE.*\r?\n/g, '');

        const lines = content.split(/\r\n|\r|\n/);
        let srtLines = [];
        let subtitleCount = 0;
        let inSubtitle = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Check if this is a timestamp line
            if (line.includes('-->')) {
                subtitleCount++;
                srtLines.push(subtitleCount.toString()); // Add subtitle number

                // Convert timestamp format from VTT to SRT
                const timestamps = line.match(/(\d{2}:\d{2}:\d{2}.\d{3}) --> (\d{2}:\d{2}:\d{2}.\d{3})/);
                if (timestamps) {
                    const startTime = timestamps[1].replace('.', ',');
                    const endTime = timestamps[2].replace('.', ',');
                    srtLines.push(`${startTime} --> ${endTime}`);
                } else {
                    srtLines.push(line.replace(/\./g, ','));
                }

                inSubtitle = true;
            }
            // If we're in a subtitle block and it's not a blank line
            else if (inSubtitle && line.trim() !== '') {
                // Clean up formatting tags
                let cleanLine = line.replace(/<\/?[^>]+(>|$)/g, '');
                cleanLine = cleanLine.replace(/&amp;/g, '&');
                srtLines.push(cleanLine);
            }
            // If we're in a subtitle block and hit a blank line, add a blank line to separate subtitles
            else if (inSubtitle && line.trim() === '') {
                srtLines.push('');
                inSubtitle = false;
            }
        }

        return srtLines.join('\r\n');
    };

    // Save subtitle to a file
    const saveSubtitle = (content) => {
        const info = State.currentShowInfo;
        let filename = info.showName || info.showTitle || 'Disney_Show';

        if (info.episodeTitle) {
            filename += ` - ${info.episodeTitle.replace(/[:|/\\?*"<>]/g, '')}`;
        } else if (info.episodeNumber > 0) {
            filename += ` - Episode ${info.episodeNumber}`;
        }

        filename += '.ar.srt';
        log('Saving subtitle as', filename);

        // Create a Blob with the content
        const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
        saveAs(blob, filename);
        showNotification(`✓ Arabic subtitle downloaded: ${filename}`);
        updateStatus('Subtitle downloaded successfully');
    };

    // Process and download a subtitle URL
    const processSubtitleUrl = (url) => {
        if (State.subtitleFound || State.vttUrls.includes(url)) {
            return;
        }

        State.vttUrls.push(url);
        log('Processing subtitle URL', url);
        updateStatus('Found subtitle, downloading...');

        // Fetch the VTT content
        fetch(url)
            .then(response => response.text())
            .then(vttContent => {
                if (vttContent && vttContent.includes('-->')) {
                    State.subtitleFound = true;
                    log('VTT content retrieved, length:', vttContent.length);

                    // Convert VTT to SRT and save
                    const srtContent = convertVttToSrt(vttContent);
                    saveSubtitle(srtContent);
                } else {
                    log('Invalid VTT content');
                    updateStatus('Invalid subtitle data');
                }
            })
            .catch(err => {
                error('Error fetching subtitle', err);
                updateStatus('Error downloading subtitle');
            });
    };

    // Parse M3U8 manifest for subtitle URLs
    const parseM3U8ForSubtitles = (content, baseUrl) => {
        const lines = content.split('\n');
        let subtitleSection = false;

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Look for Arabic subtitle tracks
            if (line.includes('TYPE=SUBTITLES') && 
                (line.includes('LANGUAGE="ar"') || line.includes('LANGUAGE="ara"') || line.includes('LANGUAGE="arb"'))) {
                subtitleSection = true;
                log('Arabic subtitle track found in M3U8');
            }

            // If we're in a subtitle section and find a URI
            if (subtitleSection && line.includes('URI="')) {
                // Extract the URI
                const uriMatch = line.match(/URI="([^"]+)"/);
                if (uriMatch && uriMatch[1]) {
                    const subtitleManifestUrl = resolveUrl(baseUrl, uriMatch[1]);
                    log('Subtitle manifest URL', subtitleManifestUrl);

                    // Fetch the subtitle manifest
                    fetchSubtitleManifest(subtitleManifestUrl);
                }

                subtitleSection = false;
            }
        }
    };

    // Fetch subtitle manifest file to find VTT URLs
    const fetchSubtitleManifest = (url) => {
        fetch(url)
            .then(response => response.text())
            .then(content => {
                // Parse the manifest for VTT URLs
                const lines = content.split('\n');
                let baseUrl = url.substring(0, url.lastIndexOf('/') + 1);

                for (let i = 0; i < lines.length; i++) {
                    const line = lines[i];
                    if (line.endsWith('.vtt')) {
                        const vttUrl = resolveUrl(baseUrl, line);
                        log('VTT URL found', vttUrl);
                        processSubtitleUrl(vttUrl);
                    }
                }
            })
            .catch(err => error('Error fetching subtitle manifest', err));
    };

    // Check for subtitle URLs in network resources
    const checkForSubtitles = () => {
        if (State.subtitleFound) return; // Already found for this episode
        
        updateStatus('Scanning for Arabic subtitles...');
        
        // Get current show info for proper filename
        extractEpisodeInfo();
        
        // Check performance entries for subtitle URLs
        const entries = performance.getEntriesByType('resource');
        let found = false;

        // Look through all network resources
        for (const entry of entries) {
            if (entry.name &&
                typeof entry.name === 'string' &&
                entry.name.includes('subtitle.vtt')) {
                log('Found subtitle in performance entries', entry.name);

                if (entry.name.includes('/ara/') ||
                    entry.name.includes('/arb/') ||
                    entry.name.includes('arabic') ||
                    entry.name.includes('am_normal')) {
                    log('Arabic subtitle found in performance entries', entry.name);
                    processSubtitleUrl(entry.name);
                    found = true;
                    break;
                }
            }
        }

        if (!found) {
            // Try alternative method - look for subtitle URLs in the HTML
            const pageContent = document.documentElement.outerHTML;
            const subtitleUrlRegex = /https:\/\/[^"'\s]+subtitle\.vtt[^"'\s]*/g;
            const matches = pageContent.match(subtitleUrlRegex);

            if (matches && matches.length > 0) {
                for (const url of matches) {
                    if (url.includes('/ara/') ||
                        url.includes('/arb/') ||
                        url.includes('arabic') ||
                        url.includes('am_normal')) {
                        log('Arabic subtitle found in HTML', url);
                        processSubtitleUrl(url);
                        found = true;
                        break;
                    }
                }
            }

            // If still not found, look for any VTT file that might be Arabic
            if (!found) {
                for (const entry of entries) {
                    if (entry.name &&
                        typeof entry.name === 'string' &&
                        entry.name.includes('.vtt')) {
                        log('Trying potential subtitle', entry.name);

                        // Try to fetch and see if it contains Arabic
                        fetch(entry.name)
                            .then(response => response.text())
                            .then(content => {
                                // Look for Arabic script in the content
                                if (content.match(/[\u0600-\u06FF]/)) {
                                    log('Found Arabic content in', entry.name);
                                    processSubtitleUrl(entry.name);
                                }
                            })
                            .catch(err => error('Error checking VTT file', err));
                    }
                }
            }
        }

        if (!found) {
            updateStatus('Waiting for Arabic subtitles...');
        }

        return found;
    };

    // Show a notification message
    const showNotification = (message) => {
        log('Showing notification', message);

        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '20px';
        notification.style.left = '50%';
        notification.style.transform = 'translateX(-50%)';
        notification.style.backgroundColor = '#0063e5';
        notification.style.color = 'white';
        notification.style.padding = '10px 20px';
        notification.style.borderRadius = '5px';
        notification.style.zIndex = '10000';
        notification.style.fontFamily = 'Arial, sans-serif';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 1s';
            setTimeout(() => {
                if (notification.parentNode) {
                    document.body.removeChild(notification);
                }
            }, 1000);
        }, 5000);
    };

    // Update status message
    const updateStatus = (message) => {
        const statusDiv = document.getElementById('subtitle-downloader-status');
        if (statusDiv) {
            statusDiv.textContent = 'Status: ' + message;
        }
    };

    // XHR Interceptor to detect subtitle requests
    const initNetworkInterceptor = () => {
        log("Initializing network interceptor");

        // Store original XHR open and send methods
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        // Override open method to store URL
        XMLHttpRequest.prototype.open = function(method, url, ...args) {
            this._url = url;
            return originalOpen.apply(this, [method, url, ...args]);
        };

        // Override send method to intercept responses
        XMLHttpRequest.prototype.send = function(...args) {
            const xhr = this;

            this.addEventListener('load', function() {
                try {
                    if (!xhr._url || typeof xhr._url !== 'string') return;

                    // Look for subtitle VTT files
                    if (xhr._url.includes('subtitle.vtt')) {
                        log('Subtitle URL detected', xhr._url);

                        // Check if Arabic subtitle
                        if (xhr._url.includes('/ara/') ||
                            xhr._url.includes('/arb/') ||
                            xhr._url.includes('arabic') ||
                            xhr._url.includes('am_normal')) {

                            log('Arabic subtitle found', xhr._url);
                            processSubtitleUrl(xhr._url);
                        }
                    }
                    // Check for M3U8 manifests that may contain subtitle info
                    else if (xhr._url.includes('.m3u8') && xhr.responseText) {
                        if (xhr.responseText.includes('TYPE=SUBTITLES')) {
                            log('Subtitle tracks found in M3U8');
                            parseM3U8ForSubtitles(xhr.responseText, xhr._url);
                        }
                    }
                } catch (e) {
                    error('Error in XHR intercept', e);
                }
            });

            return originalSend.apply(this, args);
        };
    };

    // Add minimal floating UI control
    const addUserInterface = () => {
        if (State.uiAdded) return;

        log('Adding user interface');

        // Create main container for the UI
        const container = document.createElement('div');
        container.id = 'disney-subtitle-downloader-ui';
        container.style.position = 'fixed';
        container.style.bottom = '20px';
        container.style.right = '20px';
        container.style.zIndex = '10000';

        // Create floating button
        const floatingButton = document.createElement('div');
        floatingButton.id = 'disney-subtitle-toggle-button';
        floatingButton.style.width = '44px';
        floatingButton.style.height = '44px';
        floatingButton.style.borderRadius = '50%';
        floatingButton.style.backgroundColor = '#0063e5';
        floatingButton.style.color = 'white';
        floatingButton.style.textAlign = 'center';
        floatingButton.style.lineHeight = '44px';
        floatingButton.style.fontSize = '20px';
        floatingButton.style.cursor = 'pointer';
        floatingButton.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
        floatingButton.innerHTML = 'ع'; // Arabic letter for Arabic subtitles
        floatingButton.title = 'Disney+ Arabic Subtitle Downloader';

        // Create status panel
        const panel = document.createElement('div');
        panel.id = 'disney-subtitle-control-panel';
        panel.style.position = 'absolute';
        panel.style.bottom = '54px';
        panel.style.right = '0';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        panel.style.padding = '12px';
        panel.style.borderRadius = '8px';
        panel.style.color = 'white';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.display = 'none';
        panel.style.flexDirection = 'column';
        panel.style.width = '180px';

        // Title for the panel
        const title = document.createElement('div');
        title.textContent = 'Arabic Subtitle Downloader';
        title.style.fontWeight = 'bold';
        title.style.textAlign = 'center';
        title.style.marginBottom = '8px';
        panel.appendChild(title);

        // Status display
        const statusDiv = document.createElement('div');
        statusDiv.id = 'subtitle-downloader-status';
        statusDiv.textContent = 'Status: Looking for subtitles...';
        statusDiv.style.fontSize = '12px';
        statusDiv.style.marginBottom = '8px';
        panel.appendChild(statusDiv);
        
        // Manual scan button
        const scanButton = document.createElement('button');
        scanButton.textContent = 'Scan for Subtitles';
        scanButton.style.backgroundColor = '#0063e5';
        scanButton.style.color = 'white';
        scanButton.style.border = 'none';
        scanButton.style.padding = '8px';
        scanButton.style.borderRadius = '4px';
        scanButton.style.cursor = 'pointer';
        scanButton.style.width = '100%';

        scanButton.addEventListener('click', function() {
            checkForSubtitles();
        });

        panel.appendChild(scanButton);

        // Toggle panel visibility when clicking the floating button
        floatingButton.addEventListener('click', function(e) {
            e.stopPropagation();

            if (panel.style.display === 'none') {
                panel.style.display = 'flex';
                floatingButton.innerHTML = '×'; // Close icon
            } else {
                panel.style.display = 'none';
                floatingButton.innerHTML = 'ع'; // Arabic letter
            }
        });

        // Close panel when clicking outside
        document.addEventListener('click', function(e) {
            if (panel.style.display === 'flex' &&
                !panel.contains(e.target) &&
                e.target !== floatingButton) {
                panel.style.display = 'none';
                floatingButton.innerHTML = 'ع';
            }
        });

        // Add elements to the container
        container.appendChild(panel);
        container.appendChild(floatingButton);

        // Add container to the body
        document.body.appendChild(container);

        State.uiAdded = true;
    };

    // Monitor URL changes to detect new episodes
    const monitorUrlChanges = () => {
        if (State.lastUrl !== window.location.href) {
            log('URL changed, resetting subtitle state');
            State.lastUrl = window.location.href;
            State.subtitleFound = false;
            State.vttUrls = [];

            // Update status
            updateStatus('New episode detected, looking for subtitles...');
            
            // Scan for subtitles after episode change
            setTimeout(checkForSubtitles, 2000);
        }

        // Make sure UI is added
        if (!State.uiAdded && document.body) {
            addUserInterface();
        }
        
        // Regularly check for subtitles if not found yet
        if (!State.subtitleFound && Config.AUTO_DOWNLOAD) {
            checkForSubtitles();
        }
    };

    // Initialize the application
    const initialize = () => {
        log('Initializing Disney+ Arabic Subtitle Auto Downloader');

        // Initialize network interceptor
        initNetworkInterceptor();

        // Set up periodic URL monitoring and subtitle checking
        setInterval(monitorUrlChanges, Config.CHECK_INTERVAL);

        // Add UI as soon as document is ready
        if (document.body) {
            addUserInterface();
        }

        // Show notification that script is running
        setTimeout(() => {
            if (document.body) {
                showNotification('Disney+ Arabic Subtitle Downloader Active');
                // Initial scan
                checkForSubtitles();
            }
        }, 2000);
    };

    // Start the application
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        initialize();
    } else {
        // Wait for document to load
        window.addEventListener('DOMContentLoaded', initialize);
    }

    // Ensure we run on document load
    window.addEventListener('load', function() {
        if (!State.uiAdded && document.body) {
            addUserInterface();
            checkForSubtitles();
        }
    });
})();
