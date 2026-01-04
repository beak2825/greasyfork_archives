// ==UserScript==
// @name         Peacock字幕保存器 (Peacock Subtitle Saver)
// @namespace    https://129899.xyz
// @version      1.0
// @description  Peacock字幕保存器是一款专为Peacock TV设计的用户脚本，可自动记录视频播放中的字幕并保存为.txt文件，方便后续使用。| Peacock Subtitle Saver is a user script for Peacock TV that automatically records subtitles during playback and saves them as .txt files for future use.
// @author       aka1298
// @match        https://www.peacocktv.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/528126/Peacock%E5%AD%97%E5%B9%95%E4%BF%9D%E5%AD%98%E5%99%A8%20%28Peacock%20Subtitle%20Saver%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528126/Peacock%E5%AD%97%E5%B9%95%E4%BF%9D%E5%AD%98%E5%99%A8%20%28Peacock%20Subtitle%20Saver%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Global instance to prevent multiple initializations
    let subtitleSaverInstance = null;

    class SubtitleSaver {
        constructor() {
            // Core state variables
            this.savedSubtitles = [];
            this.recordStatus = false;
            this.lastSavedSubtitle = '';
            this.autoScrollStatus = true;
            this.startTime = null;
            this.lastSubtitleTime = null;

            // UI elements
            this.buttonGroup = null;
            this.startButton = null;
            this.autoScrollButton = null;
            this.previewPanel = null;

            // Bind methods to maintain 'this' context
            this.downloadSubtitles = this.downloadSubtitles.bind(this);
            this.toggleRecording = this.toggleRecording.bind(this);
            this.clearSubtitles = this.clearSubtitles.bind(this);
            this.subtitleObserverCallback = this.subtitleObserverCallback.bind(this);
            this.toggleAutoScroll = this.toggleAutoScroll.bind(this);
            this.updatePreviewPanel = this.updatePreviewPanel.bind(this);

            // Initialize UI and observers
            this.createUI();
            this.createPreviewPanel();
            this.initializeObserver();

            console.log('Peacock字幕保存器已初始化');
        }

        // Static styles for consistent UI
        static get BUTTON_STYLE() {
            return `
                padding: 8px 16px;
                font-size: 14px;
                font-weight: bold;
                color: white;
                border: none;
                border-radius: 5px;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                cursor: pointer;
                transition: all 0.2s ease-in-out;
                margin-right: 5px;
            `;
        }

        static get PREVIEW_PANEL_STYLE() {
            return `
                position: fixed;
                top: 5%;
                right: 20px;
                width: 300px;
                max-height: 400px;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 15px;
                border-radius: 8px;
                overflow-y: auto;
                z-index: 10000;
                font-size: 14px;
                line-height: 1.5;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
            `;
        }

        createButton(text, baseColor, hoverColor, clickHandler) {
            const button = document.createElement('button');
            button.textContent = text;
            button.style.cssText = SubtitleSaver.BUTTON_STYLE + `background-color: ${baseColor};`;

            button.onmouseover = () => {
                button.style.backgroundColor = hoverColor;
                button.style.transform = 'scale(1.05)';
            };

            button.onmouseout = () => {
                button.style.backgroundColor = baseColor;
                button.style.transform = 'scale(1)';
            };

            button.onclick = clickHandler;
            return button;
        }

        createPreviewPanel() {
            this.previewPanel = document.createElement('div');
            this.previewPanel.style.cssText = SubtitleSaver.PREVIEW_PANEL_STYLE;
            this.previewPanel.style.display = 'none';
            document.body.appendChild(this.previewPanel);
        }

        updatePreviewPanel() {
            if (!this.autoScrollStatus) {
                this.previewPanel.style.display = 'none';
                return;
            }

            this.previewPanel.style.display = 'block';
            const lastSubtitles = this.savedSubtitles.slice(-5);

            this.previewPanel.innerHTML = `
                <div style="margin-bottom: 10px; border-bottom: 1px solid #555; padding-bottom: 5px;">
                    已记录 ${this.savedSubtitles.length} 条字幕
                </div>
                ${lastSubtitles.map(subtitle => `<div style="margin-bottom: 8px;">${subtitle}</div>`).join('')}
            `;

            // Only auto-scroll when enabled
            if (this.autoScrollStatus) {
                requestAnimationFrame(() => {
                    this.previewPanel.scrollTop = this.previewPanel.scrollHeight;
                });
            }
        }

        createUI() {
            this.buttonGroup = document.createElement('div');
            Object.assign(this.buttonGroup.style, {
                position: 'fixed',
                top: '5%',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: '10000',
                display: 'flex',
                gap: '10px',
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                padding: '8px',
                borderRadius: '8px'
            });

            this.startButton = this.createButton(
                '开始记录',
                '#4CAF50',
                '#367c39',
                this.toggleRecording
            );

            const clearButton = this.createButton(
                '停止并清除',
                '#ff9800',
                '#cc7a00',
                this.clearSubtitles
            );

            const downloadButton = this.createButton(
                '下载',
                '#f44336',
                '#c8352e',
                this.downloadSubtitles
            );

            this.autoScrollButton = this.createButton(
                '自动滚动: 开',
                '#2196F3',
                '#1976D2',
                this.toggleAutoScroll
            );

            this.buttonGroup.append(this.startButton, clearButton, downloadButton, this.autoScrollButton);
            document.body.appendChild(this.buttonGroup);
        }

        toggleAutoScroll() {
            this.autoScrollStatus = !this.autoScrollStatus;
            this.autoScrollButton.textContent = `自动滚动: ${this.autoScrollStatus ? '开' : '关'}`;
            this.previewPanel.style.display = this.autoScrollStatus ? 'block' : 'none';
        }

        toggleRecording() {
            this.recordStatus = !this.recordStatus;

            if (this.recordStatus) {
                this.startTime = new Date();
                this.startButton.textContent = '暂停';
                this.startButton.style.backgroundColor = '#ff4444';
            } else {
                this.startTime = null;
                this.startButton.textContent = '开始记录';
                this.startButton.style.backgroundColor = '#4CAF50';
            }

            this.updatePreviewPanel();
        }

        clearSubtitles() {
            this.recordStatus = false;
            this.startButton.textContent = '开始记录';
            this.startButton.style.backgroundColor = '#4CAF50';
            this.savedSubtitles = [];
            this.lastSavedSubtitle = '';
            this.startTime = null;
            this.lastSubtitleTime = null;
            this.updatePreviewPanel();
            console.log('已清除保存的字幕并重置变量。');
        }

        downloadSubtitles() {
            if (this.savedSubtitles.length === 0) {
                alert('没有可下载的字幕！');
                return;
            }

            const timestamp = new Date().toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            }).replace(/[/:]/g, '-');

            // Get video title if available
            let videoTitle = '';
            try {
                const titleElement = document.querySelector('.video-player__title');
                if (titleElement) {
                    videoTitle = titleElement.textContent.trim();
                }
            } catch (e) {
                console.log('无法获取视频标题:', e);
            }

            const filename = videoTitle
                ? `peacock_${videoTitle.replace(/[^\w\s]/gi, '')}_${timestamp}.txt`
                : `peacock_subtitles_${timestamp}.txt`;

            const metadata = [
                '==================',
                `记录时间: ${timestamp}`,
                videoTitle ? `视频标题: ${videoTitle}` : '',
                `字幕数量: ${this.savedSubtitles.length}`,
                '==================\n'
            ].filter(Boolean); // Remove empty lines

            const content = [...metadata, ...this.savedSubtitles];
            const blob = new Blob([content.join('\n')], {
                type: 'text/plain;charset=utf-8'
            });

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
        }

        subtitleObserverCallback(mutationsList) {
            if (!this.recordStatus) return;

            try {
                // Look for Peacock subtitle containers
                const subtitleContainer = document.querySelector('[data-t-subtitles="true"]');
                if (!subtitleContainer || subtitleContainer.style.display === 'none') return;

                // Target ALL line elements from the Peacock subtitle structure
                const subtitleLines = subtitleContainer.querySelectorAll('.video-player__subtitles__line');
                if (!subtitleLines || subtitleLines.length === 0) return;

                // Combine all subtitle lines into a single text
                const subtitleText = Array.from(subtitleLines)
                    .map(line => line.innerText.trim())
                    .filter(Boolean)
                    .join(' ');

                if (!subtitleText || subtitleText === this.lastSavedSubtitle) return;

                // Add timestamp if available
                const currentTime = document.querySelector('video')?.currentTime;
                let formattedSubtitle = subtitleText;

                if (false) {
                    const minutes = Math.floor(currentTime / 60);
                    const seconds = Math.floor(currentTime % 60);
                    const timeStamp = `[${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}]`;
                    formattedSubtitle = `${timeStamp} ${subtitleText}`;
                }

                this.lastSavedSubtitle = subtitleText;
                this.savedSubtitles.push(formattedSubtitle);
                this.updatePreviewPanel();
            } catch (error) {
                console.error('字幕处理错误:', error);
            }
        }

        initializeObserver() {
            const observerConfig = {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['style', 'class']
            };

            const subtitleObserver = new MutationObserver(this.subtitleObserverCallback);

            // Function to initialize observer on player and subtitle elements
            const initializePlayerObserver = () => {
                // Find Peacock player element
                const videoPlayer = document.querySelector('.video-player') ||
                                   document.querySelector('[data-t-subtitles="true"]');

                if (videoPlayer) {
                    subtitleObserver.observe(videoPlayer, observerConfig);

                    // Also observe body for dynamic changes
                    subtitleObserver.observe(document.body, observerConfig);
                    console.log('Peacock字幕观察器已启动');
                    return true;
                }
                return false;
            };

            // Try to initialize immediately
            if (!initializePlayerObserver()) {
                // If player not found, observe body until it appears
                console.log('等待Peacock播放器加载...');

                const bodyObserver = new MutationObserver((mutations, observer) => {
                    if (initializePlayerObserver()) {
                        observer.disconnect();
                    }
                });

                bodyObserver.observe(document.body, observerConfig);

                // Fallback: retry after a delay
                setTimeout(() => {
                    if (!document.querySelector('.video-player') &&
                        !document.querySelector('[data-t-subtitles="true"]')) {
                        console.log('尝试重新初始化字幕观察器...');
                        initializePlayerObserver();
                    }
                }, 5000);
            }
        }

        // Clean up method to remove UI elements
        cleanup() {
            if (this.buttonGroup) {
                this.buttonGroup.remove();
            }
            if (this.previewPanel) {
                this.previewPanel.remove();
            }
        }
    }

    // URL change detection for SPA
    function checkForPlaybackPage() {
        const isPlaybackPage = window.location.href.includes('/watch/playback');

        // If we're on a playback page and no instance exists, create one
        if (isPlaybackPage && !subtitleSaverInstance) {
            console.log('检测到播放页面，初始化字幕保存器...');
            subtitleSaverInstance = new SubtitleSaver();
        }
        // If we're not on a playback page but instance exists, clean up
        else if (!isPlaybackPage && subtitleSaverInstance) {
            console.log('离开播放页面，清理字幕保存器...');
            subtitleSaverInstance.cleanup();
            subtitleSaverInstance = null;
        }
    }

    // Initial check
    checkForPlaybackPage();

    // Set up URL change detection for SPA navigation
    let lastUrl = location.href;

    // Create a new observer to watch for URL changes
    const urlObserver = new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            console.log('检测到URL变化:', lastUrl);

            // Give the page a moment to load before checking
            setTimeout(checkForPlaybackPage, 1000);
        }
    });

    // Start observing
    urlObserver.observe(document, { subtree: true, childList: true });

    // Also check periodically as a fallback
    setInterval(checkForPlaybackPage, 5000);
})();