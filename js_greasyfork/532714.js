// ==UserScript==
// @name         VocalRemover Audio Downloader2
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Adds a floating panel to download audio from VocalRemover
// @author       You
// @match        https://vocalremover.media.io/app/*
// @grant        GM_download
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532714/VocalRemover%20Audio%20Downloader2.user.js
// @updateURL https://update.greasyfork.org/scripts/532714/VocalRemover%20Audio%20Downloader2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create the floating panel
    let panel = document.createElement('div');
    panel.id = 'audio-downloader-panel';
    panel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 400px;
        height: 300px;
        background: #ffffff;
        border-radius: 12px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        z-index: 9999;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        font-family: Arial, sans-serif;
        border: 1px solid #e0e0e0;
        transition: all 0.3s ease;
    `;

    // Create the header
    let header = document.createElement('div');
    header.style.cssText = `
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        background: linear-gradient(135deg, #4285f4, #3367d6);
        color: white;
        cursor: move;
        user-select: none;
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    `;
    header.innerHTML = `
        <div style="font-weight: bold; font-size: 14px;">音频下载器</div>
        <div style="display: flex; gap: 12px;">
            <button id="minimize-panel" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; transition: background 0.2s;">−</button>
            <button id="close-panel" style="background: none; border: none; color: white; cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border-radius: 50%; transition: background 0.2s;">×</button>
        </div>
    `;
    panel.appendChild(header);

    // Add hover effects to header buttons
    document.addEventListener('DOMContentLoaded', function() {
        const buttons = header.querySelectorAll('button');
        buttons.forEach(button => {
            button.addEventListener('mouseover', function() {
                this.style.background = 'rgba(255, 255, 255, 0.2)';
            });
            button.addEventListener('mouseout', function() {
                this.style.background = 'none';
            });
        });
    });

    // Create the content area
    let contentArea = document.createElement('div');
    contentArea.style.cssText = `
        flex: 1;
        padding: 16px;
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: #ccc #f5f5f5;
    `;
    contentArea.innerHTML = `
        <div id="audio-list" style="margin-bottom: 15px;">
            <p style="color: #666; text-align: center; margin-top: 65px; font-size: 14px;">还没有检测到音频。点击"检测音频"按钮开始。</p>
        </div>
    `;
    contentArea.addEventListener('scroll', function(e) {
        e.stopPropagation();
    });
    panel.appendChild(contentArea);

    // Custom scrollbar styles
    const style = document.createElement('style');
    style.textContent = `
        #audio-downloader-panel ::-webkit-scrollbar {
            width: 6px;
        }
        #audio-downloader-panel ::-webkit-scrollbar-track {
            background: #f5f5f5;
            border-radius: 3px;
        }
        #audio-downloader-panel ::-webkit-scrollbar-thumb {
            background-color: #ccc;
            border-radius: 3px;
        }
        #audio-downloader-panel .download-button {
            transition: background-color 0.2s ease;
        }
        #audio-downloader-panel .download-button:hover {
            background-color: #3c9f40 !important;
        }
        #detect-audio {
            transition: background-color 0.2s ease, transform 0.1s ease;
        }
        #detect-audio:hover {
            background-color: #3367d6 !important;
        }
        #detect-audio:active {
            transform: scale(0.98);
        }
        .audio-item {
            transition: transform 0.1s ease;
        }
        .audio-item:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }
    `;
    document.head.appendChild(style);

    // Create the footer with the detect button
    let footer = document.createElement('div');
    footer.style.cssText = `
        padding: 12px 16px;
        border-top: 1px solid #e0e0e0;
        display: flex;
        justify-content: space-between;
        background: #f8f8f8;
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
    `;
    footer.innerHTML = `
        <button id="detect-audio" style="
            padding: 9px 18px;
            background: #4285f4;
            color: white;
            border: none;
            border-radius: 6px;
            cursor: pointer;
            font-weight: bold;
            font-size: 13px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        ">检测音频</button>
        <span id="status-message" style="color: #666; font-size: 12px; align-self: center; max-width: 220px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;"></span>
    `;
    panel.appendChild(footer);

    // Add the panel to the document
    document.body.appendChild(panel);

    // Create the minimized panel
    let minimizedPanel = document.createElement('div');
    minimizedPanel.id = 'minimized-audio-downloader';
    minimizedPanel.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #4285f4, #3367d6);
        color: white;
        padding: 10px 18px;
        border-radius: 50px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
        z-index: 9999;
        cursor: pointer;
        display: none;
        font-family: Arial, sans-serif;
        font-weight: bold;
        font-size: 13px;
        transition: all 0.3s ease;
    `;
    minimizedPanel.innerHTML = `<span>音频下载器</span>`;

    // Add hover effect to minimized panel
    minimizedPanel.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 5px 12px rgba(0, 0, 0, 0.25)';
    });
    minimizedPanel.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    });

    document.body.appendChild(minimizedPanel);

    // Status update function
    function updateStatus(message, isError = false) {
        const statusElement = document.getElementById('status-message');
        if (statusElement) {
            statusElement.textContent = message;
            statusElement.style.color = isError ? '#f44336' : '#666';
            statusElement.title = message; // Add title for longer messages
        }
    }

    // Function to format audio file names
    function formatAudioName(name) {
        if (!name) return 'audio.mp3';

        // Clean the name
        let cleanName = name.split('/').pop().split('?')[0];

        // Add extension if missing
        if (!cleanName.includes('.')) {
            cleanName += '.mp3';
        }

        // Try to make it more readable
        cleanName = cleanName
            .replace(/[_-]+/g, ' ')
            .replace(/(%20)+/g, ' ')
            .replace(/\s+/g, ' ');

        // Capitalize first letter of each word
        cleanName = cleanName.split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');

        return cleanName;
    }

    // Add detected audio to the list
    function addAudioToList(name, url) {
        const audioList = document.getElementById('audio-list');
        if (!audioList) return;

        // Check if the URL is already in the list
        const existingItems = audioList.querySelectorAll('.download-button');
        for (let item of existingItems) {
            if (item.getAttribute('data-url') === url) {
                // Already in the list, don't add duplicate
                return;
            }
        }

        // Clear the "no audio detected" message if present
        const noAudioMessage = audioList.querySelector('p');
        if (noAudioMessage) {
            audioList.innerHTML = '';
        }

        const audioItem = document.createElement('div');
        audioItem.className = 'audio-item';
        audioItem.style.cssText = `
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px;
            background: #f5f5f5;
            border-radius: 8px;
            margin-bottom: 10px;
            border: 1px solid #e8e8e8;
            transition: all 0.2s ease;
        `;

        const fileName = formatAudioName(name);

        audioItem.innerHTML = `
            <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 250px; color: #333; font-size: 13px;" title="${fileName}">${fileName}</div>
            <button class="download-button" data-url="${url}" data-filename="${fileName}" style="
                background: #4CAF50;
                color: white;
                border: none;
                border-radius: 6px;
                padding: 6px 12px;
                cursor: pointer;
                font-size: 12px;
                font-weight: bold;
                box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            ">下载</button>
        `;

        audioList.appendChild(audioItem);

        // Add event listener to the download button
        const downloadButton = audioItem.querySelector('.download-button');
        downloadButton.addEventListener('click', function(e) {
            e.preventDefault();
            const url = this.getAttribute('data-url');
            const filename = this.getAttribute('data-filename');
            triggerDownload(url, filename);
        });
    }

    // Make the panel draggable
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', function(e) {
        isDragging = true;
        offsetX = e.clientX - panel.getBoundingClientRect().left;
        offsetY = e.clientY - panel.getBoundingClientRect().top;
    });

    document.addEventListener('mousemove', function(e) {
        if (!isDragging) return;

        panel.style.left = (e.clientX - offsetX) + 'px';
        panel.style.top = (e.clientY - offsetY) + 'px';
        panel.style.right = 'auto';
        panel.style.bottom = 'auto';
    });

    document.addEventListener('mouseup', function() {
        isDragging = false;
    });

    // Panel control functions
    document.getElementById('minimize-panel').addEventListener('click', function(e) {
        e.stopPropagation();
        panel.style.display = 'none';
        minimizedPanel.style.display = 'block';
    });

    document.getElementById('close-panel').addEventListener('click', function(e) {
          // e.stopPropagation();
          // panel.style.display = 'none';
          // minimizedPanel.style.display = 'none';
    });

    minimizedPanel.addEventListener('click', function() {
        minimizedPanel.style.display = 'none';
        panel.style.display = 'flex';
    });

    // ==================== Audio Detection Logic ====================

    // Intercept XHR requests to capture audio URLs
    function setupXHRInterceptor() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url) {
            this._url = url;
            return originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function() {
            this.addEventListener('load', function() {
                // Check if response is audio
                const contentType = this.getResponseHeader('Content-Type');
                if (contentType && (
                    contentType.includes('audio') ||
                    this._url.includes('.mp3') ||
                    this._url.includes('.wav') ||
                    this._url.includes('audio')
                )) {
                    updateStatus(`检测到音频: ${formatAudioName(this._url)}`);
                    handleAudioUrl(this._url);
                }
            });
            return originalSend.apply(this, arguments);
        };

        updateStatus('已设置请求拦截器');
    }

    // Check network requests for audio files
    function checkNetworkForAudio() {
        if (!window.performance || !window.performance.getEntries) {
            updateStatus('此浏览器不支持Performance API', true);
            return;
        }

        const resources = window.performance.getEntries();
        const audioResources = resources.filter(resource => {
            return resource.name.includes('.mp3') ||
                   resource.name.includes('.wav') ||
                   resource.name.includes('audio') ||
                   (resource.initiatorType === 'xmlhttprequest' &&
                    resource.name.includes('blob'));
        });

        if (audioResources.length > 0) {
            updateStatus(`找到 ${audioResources.length} 个可能的音频资源`);
            audioResources.forEach(resource => {
                if (!resource.name.startsWith('blob:')) {
                    handleAudioUrl(resource.name);
                }
            });
            return true;
        } else {
            updateStatus('未找到网络中的音频资源');
            return false;
        }
    }

    // Handle audio URL
    function handleAudioUrl(url) {
        if (url) {
            const formattedName = formatAudioName(url);
            addAudioToList(formattedName, url);
        }
    }

    // Check audio elements on the page
    function checkAudioElements() {
        const audioElements = document.querySelectorAll('audio');
        if (audioElements.length > 0) {
            updateStatus(`找到 ${audioElements.length} 个音频元素`);
            audioElements.forEach(audio => {
                if (audio.src) {
                    if (audio.src.startsWith('blob:')) {
                        // Try to get a meaningful name from page context
                        let pageName = document.title || '';
                        pageName = pageName.replace('VocalRemover', '').trim();
                        const audioName = pageName || 'audio.mp3';
                        addAudioToList(audioName, audio.src);
                    } else {
                        handleAudioUrl(audio.src);
                    }
                }
            });
            return true;
        }
        return false;
    }

    // Check for audio in the application
    function detectAudio() {
        // Add a loading indicator to the button
        const detectButton = document.getElementById('detect-audio');
        const originalText = detectButton.textContent;
        detectButton.textContent = '正在检测...';
        detectButton.style.pointerEvents = 'none';
        detectButton.style.opacity = '0.7';

        updateStatus('正在检测音频...');

        // Use setTimeout to allow the button state to update first
        setTimeout(() => {
            // Try checking audio elements first
            const foundAudioElements = checkAudioElements();

            // Then check network requests
            const foundNetworkAudio = checkNetworkForAudio();

            // Setup interceptor for future requests
            setupXHRInterceptor();

            // Try to trigger audio playback
            const playButton = document.querySelector('.play-button');
            if (playButton) {
                updateStatus('找到播放按钮，点击以触发音频加载...');
                playButton.click();
            }

            // Check for wave elements that might contain audio data
            const waveElements = document.querySelectorAll('wave');
            if (waveElements.length > 0) {
                updateStatus('找到波形图元素，可能包含音频数据');
            }

            if (!foundAudioElements && !foundNetworkAudio) {
                // If nothing found, give feedback
                updateStatus('尚未找到音频。尝试播放页面中的音频后再次检测。');
            }

            // Reset button state
            detectButton.textContent = originalText;
            detectButton.style.pointerEvents = '';
            detectButton.style.opacity = '';
        }, 100);
    }

    // Trigger file download using GM_download if available, or fallback to regular method
    function triggerDownload(url, filename) {
        updateStatus(`准备下载: ${filename}`);

        if (typeof GM_download !== 'undefined') {
            // Use GM_download to download file directly
            GM_download({
                url: url,
                name: filename,
                onload: function() {
                    updateStatus(`成功下载: ${filename}`);
                },
                onerror: function(error) {
                    updateStatus(`下载失败: ${error}`, true);
                    // Fall back to traditional method
                    traditionalDownload(url, filename);
                }
            });
        } else {
            // Use traditional method
            traditionalDownload(url, filename);
        }
    }

    // Traditional download method
    function traditionalDownload(url, filename) {
        // For blob URLs we need to fetch them first
        if (url.startsWith('blob:')) {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    downloadWithLink(blobUrl, filename);
                    URL.revokeObjectURL(blobUrl);
                })
                .catch(error => {
                    updateStatus(`下载失败: ${error.message}`, true);
                });
        } else {
            downloadWithLink(url, filename);
        }
    }

    // Download using a temporary anchor element
    function downloadWithLink(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        a.style.display = 'none';
        a.target = '_blank'; // Add target blank to avoid opening in the current page

        document.body.appendChild(a);
        a.click();

        setTimeout(() => {
            document.body.removeChild(a);
            updateStatus(`已启动下载: ${filename}`);
        }, 100);
    }

    // Attach event listener to the detect button
    document.getElementById('detect-audio').addEventListener('click', function(e) {
        e.preventDefault(); // Prevent any default action
        e.stopPropagation(); // Stop propagation to prevent jitter
        detectAudio();
    });
})();