// ==UserScript==
// @name         YTS RealDebrid M3U Generator
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Generate M3U file with RealDebrid links from YTS movie page
// @author       You
// @match        https://yts.mx/movies/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @connect      api.real-debrid.com
// @connect      real-debrid.com
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/545089/YTS%20RealDebrid%20M3U%20Generator.user.js
// @updateURL https://update.greasyfork.org/scripts/545089/YTS%20RealDebrid%20M3U%20Generator.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const DEBUG_PREFIX = '[YTS-RD]';
    const log = (...args) => console.log(DEBUG_PREFIX, ...args);
    const warn = (...args) => console.warn(DEBUG_PREFIX, ...args);
    const errorLog = (...args) => console.error(DEBUG_PREFIX, ...args);

    log('Userscript loaded', { version: (typeof GM_info !== 'undefined' && GM_info.script && GM_info.script.version) ? GM_info.script.version : 'unknown' });
    log('Environment check', {
        hasGM_getValue: typeof GM_getValue !== 'undefined',
        hasGM_setValue: typeof GM_setValue !== 'undefined',
        hasGM_xmlhttpRequest: typeof GM_xmlhttpRequest !== 'undefined',
        hasGM_download: typeof GM_download !== 'undefined',
        hasGM_registerMenuCommand: typeof GM_registerMenuCommand !== 'undefined'
    });

    // Capture global errors to ensure site scripts don't hide our failures
    window.addEventListener('error', (ev) => {
        errorLog('Global error captured:', ev.message, ev.error);
    });
    window.addEventListener('unhandledrejection', (ev) => {
        errorLog('Unhandled promise rejection:', ev.reason);
    });

    // ========================================
    // API Key Management with Tampermonkey Storage
    // ========================================
    const getApiKey = async () => {
        try {
            // Try to get API key from Tampermonkey storage
            let apiKey = GM_getValue('realdebrid_api_key', '');

            if (!apiKey) {
                // Prompt user for API key if not stored
                apiKey = prompt(
                    'Please enter your RealDebrid API key:\n\n' +
                    'You can find your API key at:\n' +
                    'https://real-debrid.com/apitoken\n\n' +
                    'Your API key will be securely stored for future use.'
                );

                if (!apiKey) {
                    throw new Error('RealDebrid API key is required');
                }

                // Validate API key format (basic check)
                if (apiKey.length < 20) {
                    throw new Error('Invalid API key format. Please check your API key.');
                }

                // Store the API key
                GM_setValue('realdebrid_api_key', apiKey);
                console.log('✅ API key saved to Tampermonkey storage');
            }

            return apiKey;
        } catch (error) {
            errorLog('❌ Error getting API key:', error);
            throw error;
        }
    };

    // Function to reset stored API key (for testing or if key changes)
    const resetApiKey = () => {
        GM_setValue('realdebrid_api_key', '');
        log('🔄 API key cleared from storage');
    };

    // Expose reset function to console for debugging
    window.resetRealDebridApiKey = resetApiKey;

    // Minimal diagnostics panel to make script activity visible
    const createDiagnosticsPanel = () => {
        try {
            if (document.getElementById('yts-rd-diag')) return;

            const panel = document.createElement('div');
            panel.id = 'yts-rd-diag';
            panel.style.cssText = 'position:fixed; bottom:12px; right:12px; background:rgba(0,0,0,0.8); color:#fff; font:12px/1.3 -apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica,Arial,sans-serif; padding:10px; border-radius:6px; z-index:2147483647; box-shadow:0 2px 8px rgba(0,0,0,0.35); max-width:280px;';

            const header = document.createElement('div');
            header.textContent = 'YTS-RD Active';
            header.style.cssText = 'font-weight:600; margin-bottom:6px;';

            const status = document.createElement('div');
            status.style.cssText = 'margin-bottom:8px; opacity:0.9;';

            const btnRow = document.createElement('div');
            btnRow.style.cssText = 'display:flex; gap:6px;';

            const setBtn = document.createElement('button');
            setBtn.textContent = 'Set Key';
            setBtn.style.cssText = 'flex:1; padding:6px; background:#0066cc; color:#fff; border:none; border-radius:4px; cursor:pointer;';
            setBtn.addEventListener('click', async () => {
                try {
                    const key = await getApiKey();
                    if (key) {
                        alert('RealDebrid API key saved.');
                        updateStatus();
                    }
                } catch (e) {
                    alert(`Failed to set API key: ${e.message}`);
                }
            });

            const resetBtn = document.createElement('button');
            resetBtn.textContent = 'Reset Key';
            resetBtn.style.cssText = 'flex:1; padding:6px; background:#444; color:#fff; border:none; border-radius:4px; cursor:pointer;';
            resetBtn.addEventListener('click', () => {
                resetApiKey();
                alert('API key cleared. Click Set Key to enter it again.');
                updateStatus();
            });

            const refreshBtn = document.createElement('button');
            refreshBtn.textContent = 'Refresh';
            refreshBtn.style.cssText = 'flex:1; padding:6px; background:#2d8a34; color:#fff; border:none; border-radius:4px; cursor:pointer;';
            refreshBtn.addEventListener('click', () => updateStatus(true));

            btnRow.appendChild(setBtn);
            btnRow.appendChild(resetBtn);
            btnRow.appendChild(refreshBtn);

            panel.appendChild(header);
            panel.appendChild(status);
            panel.appendChild(btnRow);

            const updateStatus = (scanDom) => {
                try {
                    const key = GM_getValue('realdebrid_api_key', '');
                    let domStats = '';
                    if (scanDom) {
                        const torrents = document.querySelectorAll('a[href*="/torrent/download/"]').length;
                        const h1s = document.querySelectorAll('h1').length;
                        const modal = !!document.querySelector('.modal-download');
                        domStats = ` | links:${torrents} h1:${h1s} modal:${modal ? 'y' : 'n'}`;
                    }
                    status.textContent = `readyState:${document.readyState} | moviePage:${window.location.href.includes('/movies/')} | key:${key ? (key.substring(0,6)+'…') : 'none'}${domStats}`;
                } catch (e) {
                    status.textContent = `status err: ${e.message}`;
                }
            };

            updateStatus();
            document.body.appendChild(panel);

            // Hotkeys
            document.addEventListener('keydown', (ev) => {
                if (ev.shiftKey && ev.key.toLowerCase() === 'k') {
                    ev.preventDefault();
                    setBtn.click();
                }
                if (ev.shiftKey && ev.key.toLowerCase() === 'r') {
                    ev.preventDefault();
                    resetBtn.click();
                }
                if (ev.shiftKey && ev.key.toLowerCase() === 's') {
                    ev.preventDefault();
                    panel.style.display = (panel.style.display === 'none') ? '' : 'none';
                }
            });

            log('Diagnostics panel created. Hotkeys: Shift+K set key, Shift+R reset, Shift+S toggle panel');
        } catch (e) {
            warn('Failed to create diagnostics panel:', e);
        }
    };

    // Register Tampermonkey menu commands for easier key management
    if (typeof GM_registerMenuCommand !== 'undefined') {
        try {
            GM_registerMenuCommand('Set RealDebrid API Key', async () => {
                try {
                    GM_setValue('realdebrid_api_key', '');
                    const key = await getApiKey();
                    if (key) {
                        alert('RealDebrid API key saved.');
                    }
                } catch (e) {
                    alert(`Failed to set API key: ${e.message}`);
                }
            });
            GM_registerMenuCommand('Reset RealDebrid API Key', () => {
                resetApiKey();
                alert('RealDebrid API key cleared. Use "Set RealDebrid API Key" to enter a new one.');
            });
        } catch (e) {
            warn('Menu command registration failed:', e);
        }
    }

    const generateM3uContent = (title, links) => {
        let content = '#EXTM3U\n';
        content += '#EXT-X-VERSION:3\n';

        links.forEach(({quality, url}) => {
            // Add proper M3U8 headers for better compatibility
            content += `#EXTINF:-1 tvg-name="${title} (${quality})" tvg-logo="" group-title="Movies",${title} (${quality})\n`;
            content += `${url}\n`;
        });
        return content;
    };

    const downloadTextFile = (fileName, textContent, mimeType) => {
        try {
            const blob = new Blob([textContent], { type: mimeType || 'text/plain;charset=utf-8' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            log('Triggered download via anchor for', fileName);
            return true;
        } catch (e) {
            errorLog('Anchor download failed:', e);
            return false;
        }
    };

    const getRealDebridLink = async (linkOrMagnet, apiKey) => {
        try {
            console.log('🔄 Processing with RealDebrid...');
            console.log('📎 Link type:', linkOrMagnet.startsWith('magnet:') ? 'MAGNET' : 'TORRENT URL');
            console.log('🔗 Link preview:', linkOrMagnet.substring(0, 150) + '...');
            console.log('🔑 API key preview:', apiKey.substring(0, 10) + '...');

            // Determine if it's a magnet link or torrent URL
            const isMagnet = linkOrMagnet.startsWith('magnet:');
            const endpoint = isMagnet ?
                'https://api.real-debrid.com/rest/1.0/torrents/addMagnet' :
                'https://api.real-debrid.com/rest/1.0/torrents/addTorrent';
            const dataParam = isMagnet ? 'magnet' : 'torrent';

            console.log('🎯 Using endpoint:', endpoint);
            console.log('📝 Data parameter:', dataParam);

            // Step 1: Add magnet/torrent to RealDebrid
            let addResponse;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                console.log('📡 Using GM_xmlhttpRequest...');
                addResponse = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: endpoint,
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: `${dataParam}=${encodeURIComponent(linkOrMagnet)}`,
                        timeout: 30000,
                        onload: resolve,
                        onerror: (e) => {
                            try {
                                if (e && (e.status === 0 || e.readyState === 4) && String(e.error || e.responseText || '').includes('URL is not permitted')) {
                                    alert('Tampermonkey blocked the API request to api.real-debrid.com.\n\nFix:\n1) Open Tampermonkey Dashboard → this script → Permissions.\n2) Allow @connect for api.real-debrid.com (or "Allow all domains").\n3) Save and reload the page.');
                                }
                            } catch {}
                            reject(e);
                        }
                    });
                });
            } else {
                console.log('📡 Using fetch as fallback...');
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `${dataParam}=${encodeURIComponent(linkOrMagnet)}`
                });
                addResponse = {
                    status: response.status,
                    responseText: await response.text()
                };
            }

            console.log('📥 Add response status:', addResponse.status);
            console.log('📥 Add response text:', addResponse.responseText);

            if (addResponse.status !== 200 && addResponse.status !== 201) {
                throw new Error(`RealDebrid API error: ${addResponse.status} - ${addResponse.responseText}`);
            }

            const torrentData = JSON.parse(addResponse.responseText);
            console.log('🔍 Parsed torrent data:', torrentData);

            if (!torrentData.id) {
                throw new Error('No torrent ID returned from RealDebrid: ' + JSON.stringify(torrentData));
            }

            const torrentId = torrentData.id;
            console.log('🆔 Torrent ID:', torrentId);

            // Step 2: Select all files from the torrent
            console.log('🔄 Selecting all files...');
            let selectResponse;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                selectResponse = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: `https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`,
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: 'files=all',
                        timeout: 30000,
                        onload: resolve,
                        onerror: (e) => {
                            try {
                                if (e && (e.status === 0 || e.readyState === 4) && String(e.error || e.responseText || '').includes('URL is not permitted')) {
                                    alert('Tampermonkey blocked the API request to api.real-debrid.com.\n\nFix:\n1) Open Tampermonkey Dashboard → this script → Permissions.\n2) Allow @connect for api.real-debrid.com (or "Allow all domains").\n3) Save and reload the page.');
                                }
                            } catch {}
                            reject(e);
                        }
                    });
                });
            } else {
                const response = await fetch(`https://api.real-debrid.com/rest/1.0/torrents/selectFiles/${torrentId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: 'files=all'
                });
                selectResponse = {
                    status: response.status,
                    responseText: await response.text()
                };
            }

            console.log('📂 Select files response status:', selectResponse.status);
            console.log('📂 Select files response:', selectResponse.responseText);

            // Step 3: Get torrent info to find download links
            console.log('🔄 Getting torrent info...');
            let infoResponse;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                infoResponse = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'GET',
                        url: `https://api.real-debrid.com/rest/1.0/torrents/info/${torrentId}`,
                        headers: {
                            'Authorization': `Bearer ${apiKey}`
                        },
                        timeout: 30000,
                        onload: resolve,
                        onerror: (e) => {
                            try {
                                if (e && (e.status === 0 || e.readyState === 4) && String(e.error || e.responseText || '').includes('URL is not permitted')) {
                                    alert('Tampermonkey blocked the API request to api.real-debrid.com.\n\nFix:\n1) Open Tampermonkey Dashboard → this script → Permissions.\n2) Allow @connect for api.real-debrid.com (or "Allow all domains").\n3) Save and reload the page.');
                                }
                            } catch {}
                            reject(e);
                        }
                    });
                });
            } else {
                const response = await fetch(`https://api.real-debrid.com/rest/1.0/torrents/info/${torrentId}`, {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`
                    }
                });
                infoResponse = {
                    status: response.status,
                    responseText: await response.text()
                };
            }

            console.log('ℹ️ Info response status:', infoResponse.status);
            console.log('ℹ️ Info response text:', infoResponse.responseText);

            if (infoResponse.status !== 200) {
                throw new Error(`Failed to get torrent info: ${infoResponse.status} - ${infoResponse.responseText}`);
            }

            const torrentInfo = JSON.parse(infoResponse.responseText);
            console.log('📋 Torrent info:', torrentInfo);

            if (!torrentInfo.files || torrentInfo.files.length === 0) {
                throw new Error('No files found in torrent info: ' + JSON.stringify(torrentInfo));
            }

            console.log('📁 Available files:', torrentInfo.files.length);
            torrentInfo.files.forEach((file, index) => {
                console.log(`  File ${index}: ${file.path} (${file.bytes} bytes) - Link: ${file.link ? 'YES' : 'NO'}`);
            });

            // Check if there are direct links available in the links array
            if (torrentInfo.links && torrentInfo.links.length > 0) {
                console.log('🔗 Found direct links:', torrentInfo.links.length);
                const directLink = torrentInfo.links[0];
                console.log('🔗 Raw RealDebrid link:', directLink);

                // Get the actual streaming URL from RealDebrid
                const streamingUrl = await getStreamingUrl(directLink, apiKey);
                if (streamingUrl) {
                    console.log('✅ Using streaming URL:', streamingUrl);
                    return streamingUrl;
                }

                console.log('⚠️ Could not get streaming URL, using direct link');
                return directLink;
            }

            // Find the largest video file (typically the main movie file)
            const videoFiles = torrentInfo.files
                .filter(file => /\.(mp4|mkv|avi|mov|wmv|flv|webm)$/i.test(file.path));

            console.log('🎬 Video files found:', videoFiles.length);

            if (videoFiles.length === 0) {
                console.log('⚠️ No video files found, using largest file...');
                const largestFile = torrentInfo.files.sort((a, b) => b.bytes - a.bytes)[0];
                if (largestFile && largestFile.link) {
                    console.log('✅ Using largest file:', largestFile.path);
                    return largestFile.link;
                }
            } else {
                const videoFile = videoFiles.sort((a, b) => b.bytes - a.bytes)[0];
                if (videoFile && videoFile.link) {
                    console.log('✅ Using video file:', videoFile.path);
                    return videoFile.link;
                }
            }

            // If no direct links available, check torrent status
            console.log('📊 Torrent status:', torrentInfo.status);
            if (torrentInfo.status === 'waiting_files_selection') {
                throw new Error('⏳ RealDebrid is preparing the torrent files. Please wait a moment and try again.');
            } else if (torrentInfo.status === 'queued') {
                throw new Error('⏳ RealDebrid has queued this torrent for download. This usually takes 1-2 minutes. Please wait and try again shortly.');
            } else if (torrentInfo.status === 'downloading') {
                throw new Error('⬇️ RealDebrid is currently downloading this torrent. Please wait a few minutes and try again.');
            }

            throw new Error('❌ No downloadable video file found in torrent');
        } catch (error) {
            console.error('❌ RealDebrid API error:', error);
            return null;
        }
    };

    const getStreamingUrl = async (realDebridLink, apiKey) => {
        try {
            console.log('🔄 Getting streaming URL from RealDebrid link...');

            let response;
            if (typeof GM_xmlhttpRequest !== 'undefined') {
                response = await new Promise((resolve, reject) => {
                    GM_xmlhttpRequest({
                        method: 'POST',
                        url: 'https://api.real-debrid.com/rest/1.0/unrestrict/link',
                        headers: {
                            'Authorization': `Bearer ${apiKey}`,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        data: `link=${encodeURIComponent(realDebridLink)}`,
                        timeout: 30000,
                        onload: resolve,
                        onerror: (e) => {
                            try {
                                if (e && (e.status === 0 || e.readyState === 4) && String(e.error || e.responseText || '').includes('URL is not permitted')) {
                                    alert('Tampermonkey blocked the API request to api.real-debrid.com.\n\nFix:\n1) Open Tampermonkey Dashboard → this script → Permissions.\n2) Allow @connect for api.real-debrid.com (or "Allow all domains").\n3) Save and reload the page.');
                                }
                            } catch {}
                            reject(e);
                        }
                    });
                });
            } else {
                const fetchResponse = await fetch('https://api.real-debrid.com/rest/1.0/unrestrict/link', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${apiKey}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: `link=${encodeURIComponent(realDebridLink)}`
                });
                response = {
                    status: fetchResponse.status,
                    responseText: await fetchResponse.text()
                };
            }

            console.log('🔗 Unrestrict response status:', response.status);
            console.log('🔗 Unrestrict response text:', response.responseText);

            if (response.status === 200) {
                const data = JSON.parse(response.responseText);
                if (data.download) {
                    console.log('✅ Got streaming URL:', data.download);
                    return data.download;
                }
            }

            console.log('⚠️ Could not unrestrict RealDebrid link');
            return null;
        } catch (error) {
            console.error('❌ Error getting streaming URL:', error);
            return null;
        }
    };

    const replaceDownloadLinksWithM3U = () => {
        log('Replacing download links with M3U generators...');

        // Find all torrent download links and replace them with M3U generators
        const torrentLinks = Array.from(document.querySelectorAll('a[href*="/torrent/download/"]'));
        log('Found torrent download links:', torrentLinks.length);

        torrentLinks.forEach((link, index) => {
            const originalText = link.textContent.trim();
            const title = link.title || originalText;

            // Extract quality info from the link text/title for internal processing
            const qualityMatch = originalText.match(/(720p|1080p|2160p|4K)/i);
            const formatMatch = originalText.match(/(BluRay|WEB|WEB-DL|DUBBED)/i);

            const quality = qualityMatch ? qualityMatch[1] : '';
            const format = formatMatch ? formatMatch[1] : '';

            // Preserve the full display text including x265 tags and other formatting
            let displayText = originalText;

            // Check if link contains x265 information and preserve it
            const x265Check = link.querySelector('small font[color="#00A800"]');
            if (x265Check && x265Check.textContent.includes('x265')) {
                // Keep the original text which includes x265
                displayText = originalText;
            } else {
                // For links without x265, use the cleaned format
                displayText = `${quality}.${format}`.replace(/^\.|\.$/, '') || originalText;
            }

            // Create container for both buttons
            const buttonContainer = document.createElement('span');
            buttonContainer.style.cssText = 'display: inline-block;';

            // Create M3U generation link
            const m3uLink = document.createElement('a');
            m3uLink.href = 'javascript:void(0);';
            m3uLink.className = link.className;
            m3uLink.style.cssText = link.style.cssText + '; margin-right: 5px;';
            m3uLink.title = `Generate M3U8 for ${displayText}`;

            // Preserve the icon and x265 styling if they exist
            const iconSpan = link.querySelector('.icon-in, span');
            const x265Styling = link.querySelector('small font[color="#00A800"]');

            let m3uText = displayText + ' M3U8';
            if (x265Styling && x265Styling.textContent.includes('x265')) {
                // Preserve x265 styling in the button text
                m3uText = displayText.replace('.x265', '<small><font color="#00A800">.x265</font></small>') + ' M3U8';
            }

            if (iconSpan) {
                m3uLink.innerHTML = `<span class="icon-in"></span>${m3uText}`;
            } else {
                m3uLink.innerHTML = m3uText;
            }

            // Add click handler for M3U generation
            m3uLink.addEventListener('click', async (e) => {
                e.preventDefault();
            log(`Generating M3U8 for ${displayText}...`);

                // Get the corresponding magnet link from the modal
                await generateM3UFromModalMagnet(displayText, quality);
            });

            // Create direct download link
            const downloadLink = document.createElement('a');
            downloadLink.href = 'javascript:void(0);';
            downloadLink.className = link.className;
            downloadLink.style.cssText = link.style.cssText + '; background-color: #0066cc; margin-left: 5px;';
            downloadLink.title = `Direct download ${displayText} from RealDebrid`;

            let dlText = `📥 ${displayText} DL`;
            if (x265Styling && x265Styling.textContent.includes('x265')) {
                // Preserve x265 styling in the download button text
                dlText = `📥 ${displayText.replace('.x265', '<small><font color="#00A800">.x265</font></small>')} DL`;
            }
            downloadLink.innerHTML = dlText;

            // Add click handler for direct download
            downloadLink.addEventListener('click', async (e) => {
                e.preventDefault();
                log(`Getting direct download for ${displayText}...`);

                // Get the corresponding magnet link from the modal and create direct download
                await generateDirectDownload(displayText, quality);
            });

            // Add both links to container
            buttonContainer.appendChild(m3uLink);
            buttonContainer.appendChild(downloadLink);

            // Replace the original link
            link.parentNode.replaceChild(buttonContainer, link);
            log(`Replaced torrent link ${index + 1} with M3U generator`);
        });
    };

    const generateM3UFromModalMagnet = async (displayText, quality) => {
        log(`Looking for magnet link for ${quality}...`);

        // First, make sure the modal is loaded with magnet links
        await ensureModalIsLoaded();

        // Check if modal has magnet links
        const modal = document.querySelector('.modal-download');
        const magnetLinks = modal ? modal.querySelectorAll('a[href^="magnet:"]') : [];

        if (magnetLinks.length === 0) {
            log('No magnet links found in modal, trying to trigger modal...');

            // Try to find and click a download button to open the modal
            const downloadButton = document.querySelector('a.torrent-modal-download');
            if (downloadButton) {
                downloadButton.click();
                // Wait for modal to appear and load content
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }

        // Now extract the magnet link for this specific quality
        const magnetLink = await findMagnetLinkForQuality(quality);

        if (!magnetLink) {
            console.log('⚠️ Could not find magnet link, but let\'s test API key functionality...');

            // Test API key prompt even if no magnet link found
            try {
                const apiKey = await getApiKey();
                console.log('✅ API key retrieved successfully:', apiKey.substring(0, 10) + '...');
                alert(`API key test successful! However, could not find magnet link for ${displayText}. Please ensure the download modal is properly loaded.`);
            } catch (error) {
                console.error('❌ API key error:', error);
                alert(`API Key Error: ${error.message}`);
            }
            return;
        }

        log(`Found magnet link for ${quality}:`, magnetLink.substring(0, 100) + '...');

        // Generate M3U with RealDebrid
        const movieTitle = document.querySelector('h1')?.textContent?.trim() || 'Unknown Movie';

        try {
            // Get RealDebrid API key from storage
            const apiKey = await getApiKey();

            log(`Processing ${displayText} through RealDebrid...`);
            const rdLink = await getRealDebridLink(magnetLink, apiKey);

            if (!rdLink) {
                alert(`Failed to get RealDebrid link for ${displayText}`);
                return;
            }

            // Generate M3U content for this single quality
            const m3uContent = generateM3uContent(movieTitle, [{
                quality: displayText,
                url: rdLink
            }]);

            // Download the M3U8 file (use anchor method for reliability)
            const fileName = `${movieTitle.replace(/[^a-z0-9]/gi, '_')}_${displayText.replace(/[^a-z0-9]/gi, '_')}.m3u8`;
            downloadTextFile(fileName, m3uContent, 'application/vnd.apple.mpegurl');
            console.log(`Successfully generated M3U for ${displayText}`);

        } catch (error) {
            console.error(`Error generating M3U for ${displayText}:`, error);

            // Show user-friendly error messages
            let userMessage = `Error generating M3U for ${displayText}:\n\n`;

            if (error.message.includes('RealDebrid API key is required')) {
                userMessage += '🔑 RealDebrid API key is required.\n\n' +
                              'Please get your API key from:\n' +
                              'https://real-debrid.com/apitoken\n\n' +
                              'You will be prompted to enter it when you try again.';
            } else if (error.message.includes('queued')) {
                userMessage += '⏳ RealDebrid is processing this torrent in the background.\n\n' +
                              'This usually takes 1-2 minutes for popular torrents.\n' +
                              'Please wait a moment and try clicking this quality again.';
            } else if (error.message.includes('downloading')) {
                userMessage += '⬇️ RealDebrid is currently downloading this torrent.\n\n' +
                              'This can take a few minutes depending on the file size.\n' +
                              'Please wait and try again shortly.';
            } else if (error.message.includes('waiting_files_selection')) {
                userMessage += '⏳ RealDebrid is preparing the torrent files.\n\n' +
                              'Please wait a moment and try again.';
            } else {
                userMessage += error.message;
            }

            alert(userMessage);
        }
    };

    const generateDirectDownload = async (displayText, quality) => {
        log(`Getting direct download for ${quality}...`);

        // First, make sure the modal is loaded with magnet links
        await ensureModalIsLoaded();

        // Now extract the magnet link for this specific quality
        const magnetLink = await findMagnetLinkForQuality(quality);

        if (!magnetLink) {
            alert(`Could not find magnet link for ${displayText}`);
            return;
        }

        log(`Found magnet link for ${quality}:`, magnetLink.substring(0, 100) + '...');

        try {
            // Get RealDebrid API key from storage
            const apiKey = await getApiKey();

            log(`Processing ${displayText} through RealDebrid for direct download...`);
            const rdLink = await getRealDebridLink(magnetLink, apiKey);

            if (!rdLink) {
                alert(`Failed to get RealDebrid link for ${displayText}`);
                return;
            }

            log(`Got RealDebrid streaming URL: ${rdLink}`);

            // Open the direct download link in a new tab
            const downloadWindow = window.open(rdLink, '_blank');
            if (!downloadWindow) {
                // If popup was blocked, create a download link
                const link = document.createElement('a');
                link.href = rdLink;
                link.target = '_blank';
                link.download = ''; // Let the browser handle the filename
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }

            log(`Successfully opened direct download for ${displayText}`);

        } catch (error) {
            console.error(`Error getting direct download for ${displayText}:`, error);

            // Show user-friendly error messages
            let userMessage = `Error getting direct download for ${displayText}:\n\n`;

            if (error.message.includes('RealDebrid API key is required')) {
                userMessage += '🔑 RealDebrid API key is required.\n\n' +
                              'Please get your API key from:\n' +
                              'https://real-debrid.com/apitoken\n\n' +
                              'You will be prompted to enter it when you try again.';
            } else if (error.message.includes('queued')) {
                userMessage += '⏳ RealDebrid is processing this torrent in the background.\n\n' +
                              'This usually takes 1-2 minutes for popular torrents.\n' +
                              'Please wait a moment and try clicking this download link again.';
            } else if (error.message.includes('downloading')) {
                userMessage += '⬇️ RealDebrid is currently downloading this torrent.\n\n' +
                              'This can take a few minutes depending on the file size.\n' +
                              'Please wait and try again shortly.';
            } else if (error.message.includes('waiting_files_selection')) {
                userMessage += '⏳ RealDebrid is preparing the torrent files.\n\n' +
                              'Please wait a moment and try again.';
            } else {
                userMessage += error.message;
            }

            alert(userMessage);
        }
    };

    const ensureModalIsLoaded = async () => {
        // Check if modal exists and has content
        const modal = document.querySelector('.modal-download');
        if (modal) {
            const modalTorrents = modal.querySelectorAll('.modal-torrent');
            log(`Modal found with ${modalTorrents.length} torrent sections`);

            // If modal exists but has no content, it might not be fully loaded
            if (modalTorrents.length === 0) {
                log('Modal exists but has no content, triggering load...');
                const downloadButton = document.querySelector('a.torrent-modal-download');
                if (downloadButton) {
                    downloadButton.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            }
        } else {
            log('Modal not found, triggering load...');
            const downloadButton = document.querySelector('a.torrent-modal-download');
            if (downloadButton) {
                downloadButton.click();
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
        }
    };

    const findMagnetLinkForQuality = async (quality) => {
        log(`Searching for magnet link for quality: ${quality}`);

        // Look in the modal for magnet links
        const modal = document.querySelector('.modal-download');
        if (!modal) {
            log('❌ Modal not found - the download modal may not be loaded');
            return null;
        }

        // Find all modal-torrent sections
        const modalTorrents = modal.querySelectorAll('.modal-torrent');
        log(`Found ${modalTorrents.length} modal-torrent sections`);

        if (modalTorrents.length === 0) {
            log('❌ No modal-torrent sections found - the modal content may not be loaded');
            return null;
        }

        for (const modalTorrent of modalTorrents) {
            // Check the quality in this section
            const qualitySpan = modalTorrent.querySelector('.modal-quality span');
            if (qualitySpan) {
                const modalQuality = qualitySpan.textContent.trim();
                log(`Checking modal section with quality: ${modalQuality}`);

                if (modalQuality.toLowerCase().includes(quality.toLowerCase())) {
                    // Find the magnet link in this section
                    const magnetLink = modalTorrent.querySelector('a[href^="magnet:"]');
                    if (magnetLink) {
                        log(`✅ Found matching magnet link for ${quality}`);
                        return magnetLink.href;
                    } else {
                        log(`❌ No magnet link found in section for ${quality}`);
                    }
                }
            } else {
                log('❌ No quality span found in modal section');
            }
        }

        log(`❌ No magnet link found for quality: ${quality}`);
        return null;
    };

    const openModalAndExtractMagnets = async () => {
        log('Opening modal to extract magnet links...');

        // First, try to find existing magnet links on the page
        let magnetLinks = Array.from(document.querySelectorAll('a[href^="magnet:"]'));

        if (magnetLinks.length > 0) {
            log('Found existing magnet links on page:', magnetLinks.length);
            createM3UFromMagnets(magnetLinks);
            return;
        }

        // If no magnet links found, try to trigger the modal
        log('No magnet links found, attempting to trigger modal...');

        // Look for alternative download triggers
        const modalTriggers = [
            document.querySelector('[data-toggle="modal"]'),
            document.querySelector('[onclick*="modal"]'),
            document.querySelector('.torrent-modal-download')
        ].filter(Boolean);

        if (modalTriggers.length > 0) {
            log('Found modal trigger, attempting to open...');
            modalTriggers[0].click();

            // Wait for modal to load and then extract
            setTimeout(() => {
                extractMagnetLinksFromModal();
            }, 1000);
        } else {
            // Fallback: try to use the torrent download URLs directly
            log('No modal triggers found, trying torrent URLs...');
            await convertTorrentUrlsToMagnets();
        }
    };

    const convertTorrentUrlsToMagnets = async () => {
        log('Converting torrent URLs to magnet approach...');

        const movieTitle = document.querySelector('h1')?.textContent?.trim() || 'Unknown Movie';
        const torrentLinks = Array.from(document.querySelectorAll('a[href*="/torrent/download/"]'));

        if (torrentLinks.length === 0) {
            alert('No torrent links found on this page');
            return;
        }

        try {
            // Get RealDebrid API key from storage
            const apiKey = await getApiKey();

            const rdLinks = [];
            for (let i = 0; i < torrentLinks.length; i++) {
                const link = torrentLinks[i];
                const text = link.textContent.trim();

                console.log(`Processing torrent ${i + 1}/${torrentLinks.length}: ${text}`);

                try {
                    // Try to use the torrent URL directly (though magnet would be better)
                    const rdLink = await getRealDebridLink(link.href, apiKey);
                    if (rdLink) {
                        rdLinks.push({
                            quality: text,
                            url: rdLink
                        });
                    }
                } catch (error) {
                    console.error(`Error processing torrent ${i + 1}:`, error);
                }
            }

            if (rdLinks.length > 0) {
                const m3uContent = generateM3uContent(movieTitle, rdLinks);
                const fileName = `${movieTitle.replace(/[^a-z0-9]/gi, '_')}.m3u8`;
                downloadTextFile(fileName, m3uContent, 'application/x-mpegurl');
            } else {
                alert('Failed to generate any RealDebrid links');
            }
        } catch (error) {
            errorLog('Error in convertTorrentUrlsToMagnets:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const extractMagnetLinksFromModal = () => {
        log('Extracting magnet links from modal...');

        // Look for the modal content
        const modal = document.querySelector('.modal-torrent') ||
                     document.querySelector('[class*="modal"]') ||
                     document.querySelector('[id*="modal"]');

        if (!modal) {
            log('Modal not found, trying alternative approach...');
            // Try to find magnet links anywhere on the page
            const magnetLinks = Array.from(document.querySelectorAll('a[href^="magnet:"]'));
            log('Found magnet links on page:', magnetLinks.length);

            if (magnetLinks.length > 0) {
                createM3UFromMagnets(magnetLinks);
            } else {
                alert('No magnet links found. Please try opening the download modal first.');
            }
            return;
        }

        log('Modal found:', modal);

        // Extract magnet links from the modal
        const magnetLinks = Array.from(modal.querySelectorAll('a[href^="magnet:"]'));
        log('Found magnet links in modal:', magnetLinks.length);

        if (magnetLinks.length === 0) {
            // Try alternative selectors
            const allLinks = Array.from(modal.querySelectorAll('a'));
            log('All links in modal:', allLinks.length);
            allLinks.forEach((link, index) => {
                log(`Modal link ${index}:`, {
                    href: link.href.substring(0, 100) + '...',
                    text: link.textContent.trim()
                });
            });

            alert('No magnet links found in modal. Check console for debugging info.');
            return;
        }

        createM3UFromMagnets(magnetLinks);
    };

    const createM3UFromMagnets = async (magnetLinks) => {
        log('Creating M3U from magnet links...');

        const movieTitle = document.querySelector('h1')?.textContent?.trim() || 'Unknown Movie';

        try {
            // Get RealDebrid API key from storage
            const apiKey = await getApiKey();

            const magnetData = magnetLinks.map(link => {
                const href = link.href;
                const text = link.textContent.trim();

                // Extract quality info from the link text
                const qualityMatch = text.match(/(720p|1080p|2160p|4K)/i);
                const formatMatch = text.match(/(BluRay|WEB|WEB-DL|DUBBED)/i);

                const quality = qualityMatch ? qualityMatch[1] : '';
                const format = formatMatch ? formatMatch[1] : '';
                const displayText = `${quality} ${format}`.trim() || text;

                return {
                    magnet: href,
                    quality: displayText,
                    originalText: text
                };
            });

            console.log('Processed magnet data:', magnetData);

            // Process each magnet link through RealDebrid
            const rdLinks = [];
            for (let i = 0; i < magnetData.length; i++) {
                const magnet = magnetData[i];
                console.log(`Processing magnet ${i + 1}/${magnetData.length}: ${magnet.quality}`);

                try {
                    const rdLink = await getRealDebridLink(magnet.magnet, apiKey);
                    if (rdLink) {
                        rdLinks.push({
                            quality: magnet.quality,
                            url: rdLink
                        });
                    }
                } catch (error) {
                    console.error(`Error processing magnet ${i + 1}:`, error);
                }
            }

            if (rdLinks.length === 0) {
                alert('Failed to get any RealDebrid links');
                return;
            }

            // Generate and download M3U file
            const m3uContent = generateM3uContent(movieTitle, rdLinks);
            const fileName = `${movieTitle.replace(/[^a-z0-9]/gi, '_')}.m3u`;
            downloadTextFile(fileName, m3uContent, 'application/x-mpegurl');
            console.log('M3U file generated successfully');
        } catch (error) {
            errorLog('Error in createM3UFromMagnets:', error);
            alert(`Error: ${error.message}`);
        }
    };

    const generateIndividualM3U = async (movieTitle, torrent, quality) => {
        log(`Generating M3U for ${quality}...`);

        try {
            // Get RealDebrid API key from storage
            const apiKey = await getApiKey();

            // Show loading state
            const loadingMessage = `Processing ${quality}...`;
            log(loadingMessage);

            // Get RealDebrid link for this specific torrent
            const rdLink = await getRealDebridLink(torrent.href, apiKey);

            if (!rdLink) {
                alert(`Failed to get RealDebrid link for ${quality}`);
                return;
            }

            // Generate M3U content for this single quality
            const m3uContent = generateM3uContent(movieTitle, [{
                quality: quality,
                url: rdLink
            }]);

            // Create and download the M3U file
            const fileName = `${movieTitle.replace(/[^a-z0-9]/gi, '_')}_${quality.replace(/[^a-z0-9]/gi, '_')}.m3u`;
            downloadTextFile(fileName, m3uContent, 'application/x-mpegurl');
            console.log(`Successfully generated M3U for ${quality}`);

        } catch (error) {
            errorLog('Error generating M3U:', error);
            alert(`Error generating M3U for ${quality}: ${error.message}`);
        }
    };

    const createDownloadButton = () => {
        log('Creating download button...');

        // Debug: Check what elements are available on the page
        log('Available elements check:');
        log('h1 elements:', document.querySelectorAll('h1').length);
        log('All torrent download links:', document.querySelectorAll('a[href*="/torrent/download/"]').length);
        log('Hidden-xs hidden-sm paragraphs:', document.querySelectorAll('p.hidden-xs.hidden-sm').length);

        // Log the actual HTML content of potential torrent sections
        const hiddenParagraphs = document.querySelectorAll('p.hidden-xs.hidden-sm');
        hiddenParagraphs.forEach((p, index) => {
            log(`Hidden paragraph ${index}:`, p.innerHTML);
        });

                const button = document.createElement('a');
        button.className = 'torrent-modal-download button-green-download2-big';
        button.href = 'javascript:void(0);';
        button.innerHTML = '<span class="icon-in"></span>Generate M3U';
        button.style.cssText = 'margin: 10px; padding: 10px; background: #6ac045; color: white; text-decoration: none; border-radius: 5px; display: inline-block;';

        // Add a test button to check for any torrent links
        const testButton = document.createElement('a');
        testButton.href = 'javascript:void(0);';
        testButton.innerHTML = 'Test Links';
        testButton.style.cssText = 'margin: 10px; padding: 5px; background: #ff6600; color: white; text-decoration: none; border-radius: 3px; display: inline-block; font-size: 12px;';
        testButton.addEventListener('click', () => {
            const allLinks = document.querySelectorAll('a[href*="/torrent/download/"]');
            log('=== LINK TEST RESULTS ===');
            log('Total links found:', allLinks.length);
            allLinks.forEach((link, i) => {
                log(`Link ${i}:`, {
                    href: link.href,
                    text: link.textContent.trim(),
                    title: link.title,
                    innerHTML: link.innerHTML,
                    parentElement: link.parentElement.outerHTML.substring(0, 200) + '...'
                });
            });
            alert(`Found ${allLinks.length} torrent links. Check console for details.`);
        });

        button.addEventListener('click', async (event) => {
            log('Button clicked!');

            try {
                // Get RealDebrid API key from storage
                const apiKey = await getApiKey();

                const movieTitle = document.querySelector('h1')?.textContent?.trim() || 'Unknown Movie';
                log('Movie title:', movieTitle);

                // Debug: Show all torrent download links found
                const allTorrentLinks = document.querySelectorAll('a[href*="/torrent/download/"]');
                log('All torrent download links found:', allTorrentLinks.length);
                allTorrentLinks.forEach((link, index) => {
                    log(`Link ${index}:`, {
                        href: link.href,
                        text: link.textContent.trim(),
                        title: link.title,
                        parent: link.parentElement.tagName,
                        parentClass: link.parentElement.className
                    });
                });

                // Extract torrent links from the available torrents section
                const torrentLinks = Array.from(document.querySelectorAll('a[href*="/torrent/download/"]'))
                    .filter(link => {
                        const isInHiddenSection = link.closest('p.hidden-xs.hidden-sm');
                         log('Link filter check:', link.href, 'In hidden section:', !!isInHiddenSection);
                        return isInHiddenSection;
                    })
                    .map(linkEl => {
                        const href = linkEl.href;
                        const title = linkEl.title || linkEl.textContent.trim();

                        // Extract quality from title or text
                        const qualityMatch = title.match(/(720p|1080p|2160p|4K).*?(BluRay|WEB|WEB-DL|DUBBED)/i);
                        const quality = qualityMatch ? `${qualityMatch[1]} ${qualityMatch[2]}` : title;

                        log('Found torrent link:', { quality, href, title });

                        return {
                            quality: quality,
                            torrentUrl: href
                        };
                    });

                log('Total torrent links found:', torrentLinks.length);

                if (torrentLinks.length === 0) {
                    log('No torrent links found - trying alternative selectors...');

                    // Try alternative approach - look for any links in the page content
                    const alternativeLinks = Array.from(document.querySelectorAll('a[href*="/torrent/download/"]'));
                    log('Alternative search found:', alternativeLinks.length, 'links');

                    if (alternativeLinks.length === 0) {
                        alert('No torrent links found on this page. Make sure you are on a movie details page.');
                        return;
                    } else {
                        alert(`Found ${alternativeLinks.length} torrent links, but they may not be in the expected location. Check console for details.`);
                        return;
                    }
                }

                const rdLinks = [];
                const button = event.target;
                const originalText = button.innerHTML;

                for (let i = 0; i < torrentLinks.length; i++) {
                    const link = torrentLinks[i];
                    button.innerHTML = `<span class="icon-in"></span>Processing ${i + 1}/${torrentLinks.length}...`;

                    const rdLink = await getRealDebridLink(link.torrentUrl, apiKey);
                    if (rdLink) {
                    rdLinks.push({
                        quality: link.quality,
                        url: rdLink
                    });
                    }
                }

                button.innerHTML = originalText;

                if (rdLinks.length === 0) {
                    alert('Failed to get any RealDebrid links');
                    return;
                }

                const m3uContent = generateM3uContent(movieTitle, rdLinks);
                const fileName = `${movieTitle.replace(/[^a-z0-9]/gi, '_')}.m3u8`;
                const ok = downloadTextFile(fileName, m3uContent, 'application/x-mpegurl');
                if (!ok) {
                    try {
                        if (typeof GM_download !== 'undefined') {
                            const blob = new Blob([m3uContent], {type: 'application/x-mpegurl'});
                            const url = URL.createObjectURL(blob);
                            GM_download({ url, name: fileName, saveAs: true });
                            URL.revokeObjectURL(url);
                            log('Fallback GM_download succeeded for', fileName);
                        }
                    } catch (e) {
                        errorLog('GM_download fallback failed:', e);
                    }
                }
            } catch (error) {
                errorLog('Error in download button click:', error);
                alert(`Error: ${error.message}`);
            }
        });

        // Try to find the download section, if not found, add to a suitable location
        const downloadSection = document.querySelector('.modal-download') ||
                               document.querySelector('.hidden-xs.hidden-sm') ||
                               document.querySelector('#movie-tech-specs') ||
                               document.querySelector('#movie-info');

        if (downloadSection) {
            log('Adding button to:', downloadSection);
            downloadSection.appendChild(button);
            downloadSection.appendChild(testButton);
        } else {
            // Fallback: add to the end of the body with a wrapper
            log('Adding button to body as fallback');
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'position: fixed; top: 10px; right: 10px; z-index: 9999;';
            wrapper.appendChild(button);
            wrapper.appendChild(testButton);
            document.body.appendChild(wrapper);
        }
    };

    // Add button when page loads
    const initScript = () => {
        log('DOM loaded, initializing script...');
        log('Current URL:', window.location.href);
        log('Page title:', document.title);

        // Debug: Check if we're on the right type of page
        const isMoviePage = window.location.href.includes('/movies/');
        log('Is movie page:', isMoviePage);

        if (!isMoviePage) {
            warn('Not on a movie page, script may not work correctly');
        }

        // If no API key is stored, provide a small floating button to set it
        try {
            const existingKey = GM_getValue('realdebrid_api_key', '');
            if (!existingKey) {
                const keyBtnWrapper = document.createElement('div');
                keyBtnWrapper.style.cssText = 'position: fixed; top: 10px; left: 10px; z-index: 10000;';
                const keyBtn = document.createElement('button');
                keyBtn.textContent = 'Set RealDebrid API Key';
                keyBtn.style.cssText = 'padding: 6px 10px; background:#0066cc; color:#fff; border:none; border-radius:4px; cursor:pointer;';
                keyBtn.addEventListener('click', async () => {
                    try {
                        const key = await getApiKey();
                        if (key) {
                            alert('RealDebrid API key saved.');
                            keyBtnWrapper.remove();
                        }
                    } catch (e) {
                        alert(`Failed to set API key: ${e.message}`);
                    }
                });
                keyBtnWrapper.appendChild(keyBtn);
                document.body.appendChild(keyBtnWrapper);
                log('Showing "Set RealDebrid API Key" helper button.');
            }
        } catch (e) {
            warn('API key helper button setup failed:', e);
        }

        // Create diagnostics panel
        createDiagnosticsPanel();

        // Wait a bit for dynamic content to load
        setTimeout(() => {
            replaceDownloadLinksWithM3U();
            createDownloadButton();
        }, 2000);
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initScript);
    } else {
        initScript();
    }
})();
