// ==UserScript==
// @name         YouTube MP3 & MP4 Downloader with Dynamic Positioning
// @namespace    http://tampermonkey.net/
// @version      2.6
// @description  Adds buttons to download MP3 and MP4 of the currently playing video on YouTube. Dynamically shows available resolutions.
// @author       ig:Fobiksw and chatgpt
// @license      MIT
// @match        *://*.youtube.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/512276/YouTube%20MP3%20%20MP4%20Downloader%20with%20Dynamic%20Positioning.user.js
// @updateURL https://update.greasyfork.org/scripts/512276/YouTube%20MP3%20%20MP4%20Downloader%20with%20Dynamic%20Positioning.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const removeReelShelf = () => {
        const reelShelf = document.querySelector('ytd-reel-shelf-renderer.ytd-item-section-renderer.style-scope,.ytp-gradient-bottom');
        if (reelShelf) {
            reelShelf.remove();
        }
    };

    // Run function on page load
    window.addEventListener('load', () => {
        removeReelShelf();
        addDownloadButtons();
    });

    // Observe DOM changes to remove reel shelf and add download buttons
    const observer = new MutationObserver(() => {
        removeReelShelf();
        addDownloadButtons();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    function addDownloadButtons() {
        if (document.querySelector("#mp3-download-btn") || document.querySelector("#mp4-download-btn")) return;

        const controlsContainer = document.querySelector('.ytp-right-controls');
        const timeDisplay = document.querySelector('.ytp-time-display');
        const volumeControl = document.querySelector('.ytp-volume-panel');

        if (!controlsContainer || !timeDisplay || !volumeControl) return;

        // Create buttons
        const mp3Button = createButton(
            'mp3-download-btn',
            'https://store-images.s-microsoft.com/image/apps.56277.14205055896346606.c235e3d6-fbce-45bb-9051-4be6c2ecba8f.e2bf2002-8688-47f3-9312-10b48d2e2644',
            'Download MP3',
            handleMP3Click
        );

        const mp4Button = createButton(
            'mp4-download-btn',
            'https://store-images.s-microsoft.com/image/apps.12208.14054090797401890.56e8ff18-3f10-4d1c-9cfb-5e3e1d33e078.f867d3db-3747-444a-90fc-21832327ada1?h=210',
            'Download MP4',
            handleMP4Click
        );

        // Position buttons and adjust dynamically
        timeDisplay.style.position = 'relative';
        timeDisplay.appendChild(mp3Button);
        timeDisplay.appendChild(mp4Button);

        adjustButtonPositions(mp3Button, mp4Button, volumeControl);

        // Observe volume control to dynamically adjust button positions
        const volumeObserver = new MutationObserver(() => {
            adjustButtonPositions(mp3Button, mp4Button, volumeControl);
        });

        volumeObserver.observe(volumeControl, { attributes: true, attributeFilter: ['aria-expanded'] });

    }

    function createButton(id, iconUrl, tooltip, clickHandler) {
        const button = document.createElement('button');
        button.id = id;
        button.style.position = 'absolute';
        button.style.padding = '0';
        button.style.border = 'none';
        button.style.cursor = 'pointer';
        button.style.background = `url('${iconUrl}') no-repeat center center`;
        button.style.backgroundSize = 'contain';
        button.style.width = '30px';
        button.style.height = '30px';
        button.style.opacity = '0'; // Start fully invisible
        button.style.transition = 'opacity 3s'; // Slow fade-out effect only
        button.title = tooltip;

        // Hover effect to make button fully visible instantly
        button.onmouseover = () => {
            button.style.transition = ''; // Remove transition for instant visibility
            button.style.opacity = '1';
        };

        // 5-second fade-out effect after mouseout
        button.onmouseout = () => {
            button.style.transition = 'opacity 3s'; // Apply slow 5-second fade-out
            button.style.opacity = '0';
        };

        button.onclick = clickHandler;
        return button;
    }


    function adjustButtonPositions(mp3Button, mp4Button, volumeControl) {
        const isVolumeExpanded = volumeControl.getAttribute('aria-expanded') === 'true';
        const volumeControlWidth = isVolumeExpanded ? 150 : 0; // Adjust based on expanded or collapsed state

        // Position buttons to the right of the time display, behind the time label
        mp3Button.style.left = `${volumeControlWidth + 80}px`; // Adjust to position MP3 button right after the time
        mp4Button.style.left = `${volumeControlWidth + 118}px`; // Adjust MP4 button further right with a 40px gap
        mp3Button.style.top = '50%';
        mp3Button.style.transform = 'translateY(-50%)';
        mp4Button.style.top = '50%';
        mp4Button.style.transform = 'translateY(-50%)';
    }

    function handleMP3Click() {
        const videoUrl = window.location.href;
        showDownloadWidget();
        GM_xmlhttpRequest({
            method: 'POST',
            url: `http://localhost:8000/download`,
            data: JSON.stringify({ video_url: videoUrl, format: 'mp3', options: '--no-playlist' }),
            headers: { 'Content-Type': 'application/json' },
            onload: function() {
                updateProgressText('MP3 download complete');
                hideDownloadWidget();
            },
            onerror: function() {
                hideDownloadWidget();
            }
        });
    }

    function handleMP4Click() {
        showResolutionSelector();
    }
function showResolutionSelector() {
    if (document.querySelector("#resolution-selector")) return;

    // Show loading spinner immediately while fetching resolutions
    const loadingSpinner = document.createElement('div');
    loadingSpinner.id = 'loading-spinner';
    loadingSpinner.style.position = 'fixed';
    loadingSpinner.style.top = '50%';
    loadingSpinner.style.left = '50%';
    loadingSpinner.style.transform = 'translate(-50%, -50%)';
    loadingSpinner.style.backgroundColor = 'rgba(30, 30, 30, 0.8)';
    loadingSpinner.style.color = 'white';
    loadingSpinner.style.padding = '20px';
    loadingSpinner.style.borderRadius = '8px';
    loadingSpinner.style.zIndex = '9999';
    loadingSpinner.textContent = 'Fetching available resolutions...';
    document.body.appendChild(loadingSpinner);

    const videoUrl = window.location.href;
    GM_xmlhttpRequest({
        method: 'POST',
        url: `http://localhost:8000/get_resolutions`,
        data: JSON.stringify({ video_url: videoUrl }),
        headers: { 'Content-Type': 'application/json' },
        onload: function(response) {
            let availableResolutions = JSON.parse(response.responseText);

            const validResolutions = ['8K', '4K', '1440p', '1080p', '720p', '480p', '360p', '240p', '144p'];
            availableResolutions = availableResolutions.filter(res => validResolutions.includes(res));

            if (!availableResolutions || availableResolutions.length === 0) {
                alert('No available resolutions for this video.');
                loadingSpinner.remove();
                return;
            }

            // Sort from highest to lowest
            availableResolutions.sort((a, b) => validResolutions.indexOf(a) - validResolutions.indexOf(b));

            // Create resolution selector UI after resolutions are fetched
            const selector = document.createElement('div');
            selector.id = 'resolution-selector';
            selector.style.position = 'fixed';
            selector.style.top = '50%';
            selector.style.left = '50%';
            selector.style.transform = 'translate(-50%, -50%)';
            selector.style.backgroundColor = '#1e1e1e';
            selector.style.color = 'white';
            selector.style.padding = '20px';
            selector.style.borderRadius = '8px';
            selector.style.zIndex = '9999';
            selector.style.display = 'flex';
            selector.style.flexDirection = 'column';
            selector.style.alignItems = 'center';
            selector.style.gap = '15px';
            selector.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
            selector.style.animation = 'fadeIn 0.5s ease-in-out';

            const resolutionLabel = document.createElement('label');
            resolutionLabel.textContent = 'Select Resolution:';
            resolutionLabel.style.fontSize = '16px';
            resolutionLabel.style.color = 'white';

            const resolutionDropdown = document.createElement('select');
            resolutionDropdown.style.padding = '8px';
            resolutionDropdown.style.fontSize = '14px';
            resolutionDropdown.style.borderRadius = '4px';
            resolutionDropdown.style.border = '1px solid #ccc';
            resolutionDropdown.style.color = '#333';

            availableResolutions.forEach((res) => {
                const option = document.createElement('option');
                option.value = res;
                option.textContent = res;
                resolutionDropdown.appendChild(option);
            });

            const downloadButton = document.createElement('button');
            downloadButton.textContent = 'Download MP4';
            downloadButton.style.padding = '10px 15px';
            downloadButton.style.cursor = 'pointer';
            downloadButton.style.border = 'none';
            downloadButton.style.backgroundColor = '#4285f4';
            downloadButton.style.color = 'white';
            downloadButton.style.borderRadius = '4px';

            downloadButton.onclick = function() {
                const selectedResolution = resolutionDropdown.value;
                showDownloadWidget();

                GM_xmlhttpRequest({
                    method: 'POST',
                    url: `http://localhost:8000/download`,
                    data: JSON.stringify({ video_url: videoUrl, format: 'mp4', resolution: selectedResolution, options: '--no-playlist' }),
                    headers: { 'Content-Type': 'application/json' },
                    onload: function() {
                        updateProgressText('MP4 download complete');
                        hideDownloadWidget();
                    },
                    onerror: function() {
                        hideDownloadWidget();
                    }
                });

                fadeOut(selector);
            };

            // Close Button
            const closeButton = document.createElement('button');
            closeButton.textContent = 'Close';
            closeButton.style.padding = '8px 12px';
            closeButton.style.cursor = 'pointer';
            closeButton.style.border = 'none';
            closeButton.style.backgroundColor = '#d9534f';
            closeButton.style.color = 'white';
            closeButton.style.borderRadius = '4px';
            closeButton.onclick = function() {
                fadeOut(selector);
            };

            selector.appendChild(resolutionLabel);
            selector.appendChild(resolutionDropdown);
            selector.appendChild(downloadButton);
            selector.appendChild(closeButton);

            // Remove the loading spinner and show the selector
            loadingSpinner.remove();
            document.body.appendChild(selector);
        },
        onerror: function() {
            alert('Failed to fetch available resolutions.');
            loadingSpinner.remove();
        }
    });
}

    function fadeOut(element) {
        element.style.animation = 'fadeOut 0.5s ease-in-out';
        setTimeout(() => element.remove(), 500);
    }

    function showDownloadWidget() {
        if (document.querySelector("#download-widget")) return;

        const widget = document.createElement('div');
        widget.id = 'download-widget';
        widget.style.position = 'fixed';
        widget.style.top = '50%';
        widget.style.left = '50%';
        widget.style.transform = 'translate(-50%, -50%)';
        widget.style.backgroundColor = 'rgba(0, 0, 0, 0.85)';
        widget.style.color = 'white';
        widget.style.padding = '15px';
        widget.style.borderRadius = '8px';
        widget.style.zIndex = '9999';
        widget.style.display = 'flex';
        widget.style.flexDirection = 'column';
        widget.style.alignItems = 'center';
        widget.style.gap = '15px';
        const spinner = document.createElement('div');
        spinner.style.border = '4px solid rgba(255, 255, 255, 0.3)';
        spinner.style.borderRadius = '50%';
        spinner.style.borderTop = '4px solid white';
        spinner.style.width = '24px';
        spinner.style.height = '24px';
        spinner.style.animation = 'spin 1s linear infinite';

        const progress = document.createElement('div');
        progress.id = 'download-progress';
        progress.textContent = 'Downloading...';

        widget.appendChild(spinner);
        widget.appendChild(progress);
        document.body.appendChild(widget);

        const style = document.createElement('style');
        style.textContent = `
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            @keyframes fadeOut {
                from { opacity: 1; }
                to { opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }

    function updateProgressText(text) {
        const progress = document.querySelector("#download-progress");
        if (progress) progress.textContent = text;
    }

    function hideDownloadWidget() {
        const widget = document.querySelector("#download-widget");
        if (widget) fadeOut(widget);
    }

    window.addEventListener('yt-page-data-updated', addDownloadButtons);
})();