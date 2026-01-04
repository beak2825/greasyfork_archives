// ==UserScript==
// @name         SampleFocus Direct API Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Download samples from SampleFocus without using credits by accessing the API directly
// @author       You
// @match        https://samplefocus.com/samples/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/529825/SampleFocus%20Direct%20API%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/529825/SampleFocus%20Direct%20API%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add custom CSS for our download button
    GM_addStyle(`
        .api-download-btn {
            background-color: #4CAF50;
            color: white;
            padding: 10px 15px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-weight: bold;
            margin-right: 10px;
            display: inline-block;
        }
        .api-download-btn:hover {
            background-color: #45a049;
        }
        #download-status {
            margin-top: 10px;
            padding: 10px;
            border-radius: 4px;
            display: none;
        }
        .status-success {
            background-color: #dff0d8;
            color: #3c763d;
        }
        .status-error {
            background-color: #f2dede;
            color: #a94442;
        }
        .status-info {
            background-color: #d9edf7;
            color: #31708f;
        }
        #debug-info {
            margin-top: 10px;
            padding: 10px;
            background-color: #f5f5f5;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-family: monospace;
            font-size: 12px;
            white-space: pre-wrap;
            display: none;
        }
    `);

    // Function to extract sample ID from URL
    function getSampleIdFromURL() {
        const path = window.location.pathname;
        const match = path.match(/\/samples\/([^\/]+)/);
        return match ? match[1] : null;
    }

    // Function to extract sample name from URL
    function getSampleNameFromURL() {
        const path = window.location.pathname;
        const parts = path.split('/');
        const sampleName = parts[parts.length - 1] || 'sample';
        return sampleName.replace(/-/g, '_');
    }

    // Function to create a status message element
    function createStatusElement() {
        const statusElement = document.createElement('div');
        statusElement.id = 'download-status';
        return statusElement;
    }

    // Function to create a debug info element
    function createDebugElement() {
        const debugElement = document.createElement('div');
        debugElement.id = 'debug-info';
        return debugElement;
    }

    // Function to show status message
    function showStatus(message, type = 'success') {
        const statusElement = document.getElementById('download-status') || createStatusElement();
        statusElement.textContent = message;

        // Remove all status classes
        statusElement.classList.remove('status-success', 'status-error', 'status-info');

        // Add appropriate class
        switch(type) {
            case 'error':
                statusElement.classList.add('status-error');
                break;
            case 'info':
                statusElement.classList.add('status-info');
                break;
            default:
                statusElement.classList.add('status-success');
        }

        statusElement.style.display = 'block';

        // If not already in the DOM, add it
        if (!document.getElementById('download-status')) {
            const downloadButton = document.querySelector('.api-download-btn');
            if (downloadButton && downloadButton.parentNode) {
                downloadButton.parentNode.appendChild(statusElement);
            }
        }
    }

    // Function to show debug info
    function showDebugInfo(info) {
        let debugElement = document.getElementById('debug-info');
        if (!debugElement) {
            debugElement = createDebugElement();
            const statusElement = document.getElementById('download-status');
            if (statusElement && statusElement.parentNode) {
                statusElement.parentNode.appendChild(debugElement);
            }
        }

        debugElement.textContent = typeof info === 'object' ? JSON.stringify(info, null, 2) : info;
        debugElement.style.display = 'block';
    }

    // Function to extract audio source from the page
    function extractAudioSource() {
        // Try to get the audio source from the audio element
        const audioElement = document.querySelector('audio');
        if (audioElement && audioElement.src) {
            return audioElement.src;
        }

        // Try to find it in the page's HTML
        const pageHtml = document.documentElement.outerHTML;

        // Look for audio URLs in script tags (often contains player configuration)
        const scriptTags = document.querySelectorAll('script');
        for (const script of scriptTags) {
            if (script.textContent) {
                const urlMatch = script.textContent.match(/"(https?:\/\/[^"]+\.(mp3|wav|ogg))"/i);
                if (urlMatch && urlMatch[1]) {
                    return urlMatch[1];
                }
            }
        }

        // Look for audio URLs in the page HTML
        const audioUrlMatch = pageHtml.match(/(https?:\/\/[^"']+\.(mp3|wav|ogg))/i);
        if (audioUrlMatch && audioUrlMatch[1]) {
            return audioUrlMatch[1];
        }

        return null;
    }

    // Function to get the download URL directly from the API
    function getDownloadUrlFromAPI() {
        const sampleId = getSampleIdFromURL();
        if (!sampleId) {
            showStatus('Could not determine the sample ID from the URL.', 'error');
            return Promise.reject('No sample ID found');
        }

        showStatus('Fetching download URL from API...', 'info');

        // Construct the API URL
        const apiUrl = `https://samplefocus.com/api/samples/${sampleId}/play`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: apiUrl,
                headers: {
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                onload: function(response) {
                    try {
                        if (response.status === 200) {
                            const data = JSON.parse(response.responseText);
                            showDebugInfo(data);

                            if (data && data.url) {
                                resolve(data.url);
                            } else {
                                showStatus('API response did not contain a download URL.', 'error');
                                reject('No URL in API response');
                            }
                        } else {
                            showStatus(`API request failed with status: ${response.status}`, 'error');
                            reject(`API request failed: ${response.statusText}`);
                        }
                    } catch (error) {
                        showStatus(`Error parsing API response: ${error.message}`, 'error');
                        reject(`Parse error: ${error.message}`);
                    }
                },
                onerror: function(error) {
                    showStatus('Error making API request.', 'error');
                    reject(`API request error: ${error.error}`);
                }
            });
        });
    }

    // Function to download audio using GM_xmlhttpRequest
    function downloadAudio(url) {
        showStatus(`Downloading audio from: ${url}`, 'info');

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            headers: {
                'Referer': 'https://samplefocus.com/',
                'Origin': 'https://samplefocus.com'
            },
            onload: function(response) {
                if (response.status === 200) {
                    // Create a blob URL from the response
                    const blob = response.response;
                    const blobUrl = URL.createObjectURL(blob);

                    // Determine file extension from MIME type or URL
                    let fileExtension = 'mp3';
                    if (blob.type.includes('wav')) {
                        fileExtension = 'wav';
                    } else if (blob.type.includes('ogg')) {
                        fileExtension = 'ogg';
                    }

                    // Create a download link
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = getSampleNameFromURL() + '.' + fileExtension;
                    document.body.appendChild(a);
                    a.click();

                    // Clean up
                    setTimeout(() => {
                        document.body.removeChild(a);
                        URL.revokeObjectURL(blobUrl);
                    }, 100);

                    showStatus('Download completed! Check your downloads folder.');
                } else {
                    showStatus(`Failed to download audio: ${response.status} ${response.statusText}`, 'error');
                    showDebugInfo({
                        status: response.status,
                        statusText: response.statusText,
                        headers: response.responseHeaders,
                        url: url
                    });
                }
            },
            onerror: function(error) {
                showStatus(`Error downloading audio: ${error.error || 'Unknown error'}`, 'error');
                showDebugInfo(error);
            }
        });
    }

    // Function to handle the download button click
    async function handleDownloadClick() {
        try {
            // First try to get the download URL from the API
            const downloadUrl = await getDownloadUrlFromAPI();
            if (downloadUrl) {
                downloadAudio(downloadUrl);
                return;
            }
        } catch (apiError) {
            console.error('API method failed:', apiError);
            showStatus('API method failed, trying alternative methods...', 'info');
        }

        // If API method fails, try to extract the audio source from the page
        const audioSrc = extractAudioSource();
        if (audioSrc) {
            downloadAudio(audioSrc);
        } else {
            showStatus('Could not find any audio source. Try playing the audio first.', 'error');

            // Try playing the audio to make its source available
            const audioElement = document.querySelector('audio');
            if (audioElement) {
                audioElement.play();

                // Check again after a short delay
                setTimeout(() => {
                    const newAudioSrc = extractAudioSource();
                    if (newAudioSrc) {
                        downloadAudio(newAudioSrc);
                    } else {
                        showStatus('Still could not find the audio source. Please try again later.', 'error');
                    }
                }, 2000);
            } else {
                showStatus('Could not find the audio player.', 'error');
            }
        }
    }

    // Function to create our custom download button
    function createDownloadButton() {
        // Find the original download button to place our button next to it
        const originalDownloadButton = document.querySelector('a[href$="/download"]');

        if (!originalDownloadButton) {
            console.error('Original download button not found');
            return;
        }

        // Create our custom button
        const downloadBtn = document.createElement('a');
        downloadBtn.className = 'api-download-btn';
        downloadBtn.textContent = 'Download Without Credits';
        downloadBtn.href = '#';
        downloadBtn.addEventListener('click', function(e) {
            e.preventDefault();
            handleDownloadClick();
        });

        // Insert our button before the original download button
        originalDownloadButton.parentNode.insertBefore(downloadBtn, originalDownloadButton);

        // Create the status element
        const statusElement = createStatusElement();
        originalDownloadButton.parentNode.appendChild(statusElement);
    }

    // Initialize the script
    function initialize() {
        console.log('SampleFocus Direct API Downloader initializing...');

        // Create the download button
        createDownloadButton();

        console.log('SampleFocus Direct API Downloader initialized');
    }

    // Wait for the page to fully load before initializing
    window.addEventListener('load', function() {
        // Give a little extra time for any dynamic content to load
        setTimeout(initialize, 2000);
    });

})();
