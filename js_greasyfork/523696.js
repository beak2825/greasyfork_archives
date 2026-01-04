// ==UserScript==
// @name          YouTube Smart Subtitle Downloader
// @namespace     http://tampermonkey.net/
// @version       1.1
// @description   Enhanced YouTube subtitle downloader with smart selection and improved code structure
// @author        anassk
// @match         https://www.youtube.com/*
// @grant         GM_xmlhttpRequest
// @grant         GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/523696/YouTube%20Smart%20Subtitle%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/523696/YouTube%20Smart%20Subtitle%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Core configuration
    const CONFIG = {
        MESSAGES: {
            NO_SUBTITLE: 'No Subtitles Available',
            HAVE_SUBTITLE: 'Available Subtitles',
            LOADING: 'Loading Subtitles...',
            COPY_SUCCESS: '✓ Copied!',
            ERROR: {
                COPY: 'Failed to copy to clipboard',
                FETCH: 'Failed to fetch subtitles',
                NO_VIDEO: 'No video found'
            }
        },
        FORMATS: {
            SRT: 'srt',
            TEXT: 'txt'
        },
        TIMINGS: {
            DOWNLOAD_DELAY: 500,
        },
        SELECTORS: {
            VIDEO_ELEMENTS: [
                'ytd-playlist-panel-video-renderer',
                'ytd-playlist-video-renderer',
                'yt-lockup-view-model',
                'ytd-rich-item-renderer',
                'ytd-video-renderer',
                'ytd-compact-video-renderer',
                'ytd-grid-video-renderer'
            ].join(','),
            TITLE_SELECTORS: [
                '#video-title',
                'a#video-title',
                'span#video-title',
                '[title]'
            ]
        },
        STYLES: {
            CHECKBOX_WRAPPER: `
                position: absolute;
                left: 5px;
                top: 0;
                bottom: 0;
                width: 20px;
                display: flex;
                align-items: center;
                z-index: 1;
            `,
            CHECKBOX: `
                width: 16px;
                height: 16px;
                cursor: pointer;
                margin: 0;
            `,
            DIALOG: `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 9999;
            `,
            DIALOG_CONTENT: `
                background: white;
                padding: 20px;
                border-radius: 8px;
                min-width: 300px;
                max-width: 600px;
                max-height: 80vh;
                overflow-y: auto;
                color: black;
            `
        }
    };

    // Utility functions
    const Utils = {
        createError: (message, code, originalError = null) => {
            const error = new Error(message);
            error.code = code;
            error.originalError = originalError;
            return error;
        },

        safeJSONParse: (str, fallback = null) => {
            try {
                return JSON.parse(str);
            } catch (e) {
                console.error('JSON Parse Error:', e);
                return fallback;
            }
        },

        sanitizeFileName: (name) => {
            return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').substring(0, 100);
        },

        delay: (ms) => new Promise(resolve => setTimeout(resolve, ms))
    };

    // Subtitle Service - New centralized service for subtitle operations
    class SubtitleService {
        static async fetchSubtitleTracks(videoId) {
            try {
                const response = await fetch(`https://www.youtube.com/watch?v=${videoId}`);
                const html = await response.text();

                const playerDataMatch = html.match(/ytInitialPlayerResponse\s*=\s*({.+?});/);
                if (!playerDataMatch) return null;

                const playerData = Utils.safeJSONParse(playerDataMatch[1]);
                const captionTracks = playerData?.captions?.playerCaptionsTracklistRenderer?.captionTracks;

                if (!captionTracks?.length) return null;

                return captionTracks.map(track => ({
                    languageCode: track.languageCode,
                    languageName: track.name.simpleText,
                    baseUrl: track.baseUrl
                }));
            } catch (error) {
                throw Utils.createError('Failed to fetch subtitles', 'SUBTITLE_FETCH_ERROR', error);
            }
        }

        static async getSubtitleContent(track, format = CONFIG.FORMATS.SRT) {
            try {
                const response = await fetch(track.baseUrl);
                const xml = await response.text();
                return format === CONFIG.FORMATS.SRT ?
                    this.convertToSRT(xml) :
                    this.convertToText(xml);
            } catch (error) {
                throw Utils.createError('Failed to fetch subtitle content', 'CONTENT_FETCH_ERROR', error);
            }
        }

        static convertToSRT(xml) {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xml, "text/xml");
                const textNodes = doc.getElementsByTagName('text');
                let srt = '';

                Array.from(textNodes).forEach((node, index) => {
                    const start = parseFloat(node.getAttribute('start'));
                    const duration = parseFloat(node.getAttribute('dur') || '0');
                    const end = start + duration;

                    srt += `${index + 1}\n`;
                    srt += `${this.formatTime(start)} --> ${this.formatTime(end)}\n`;
                    srt += `${node.textContent}\n\n`;
                });

                return srt;
            } catch (error) {
                throw Utils.createError('Failed to convert to SRT', 'SRT_CONVERSION_ERROR', error);
            }
        }

        static convertToText(xml) {
            try {
                const parser = new DOMParser();
                const doc = parser.parseFromString(xml, "text/xml");
                const textNodes = doc.getElementsByTagName('text');

                return Array.from(textNodes)
                    .map(node => node.textContent.trim())
                    .filter(text => text)
                    .join('\n');
            } catch (error) {
                throw Utils.createError('Failed to convert to text', 'TEXT_CONVERSION_ERROR', error);
            }
        }

        static formatTime(seconds) {
            const pad = num => String(num).padStart(2, '0');
            const ms = String(Math.floor((seconds % 1) * 1000)).padStart(3, '0');

            seconds = Math.floor(seconds);
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            const secs = seconds % 60;

            return `${pad(hours)}:${pad(minutes)}:${pad(secs)},${ms}`;
        }

        static async downloadSubtitles(tracks, format) {
            const loading = UIComponents.showLoading('Downloading subtitles...');

            try {
                for (const track of tracks) {
                    const content = await this.getSubtitleContent(track, format);
                    const filename = `${Utils.sanitizeFileName(track.videoTitle)}_${track.languageCode}.${format}`;

                    const blob = new Blob(['\ufeff' + content], { type: 'text/plain;charset=utf-8' });
                    const url = URL.createObjectURL(blob);
                    const link = document.createElement('a');

                    link.href = url;
                    link.download = filename;
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    URL.revokeObjectURL(url);

                    await Utils.delay(CONFIG.TIMINGS.DOWNLOAD_DELAY);
                }
            } catch (error) {
                throw Utils.createError('Failed to download subtitles', 'DOWNLOAD_ERROR', error);
            } finally {
                loading.remove();
            }
        }

        static async copySubtitles(tracks, format, videoTitle = '') {
            const loading = UIComponents.showLoading('Copying subtitles...');

            try {
                let content = '';
                for (const track of tracks) {
                    const subtitleContent = await this.getSubtitleContent(track, format);
                    const title = videoTitle ? `${videoTitle} - ` : '';
                    content += `=== ${title}${track.languageName} ===\n${subtitleContent}\n\n`;
                }

                await navigator.clipboard.writeText(content);
                UIComponents.showToast(CONFIG.MESSAGES.COPY_SUCCESS);
            } catch (error) {
                throw Utils.createError('Failed to copy subtitles', 'COPY_ERROR', error);
            } finally {
                loading.remove();
            }
        }
    }

    // UI Components
    class UIComponents {
        static showDialog(title, content, onClose) {
            const dialog = document.createElement('div');
            dialog.style.cssText = CONFIG.STYLES.DIALOG;

            const dialogContent = document.createElement('div');
            dialogContent.style.cssText = CONFIG.STYLES.DIALOG_CONTENT;

            const header = document.createElement('div');
            header.style.cssText = `
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 15px;
            `;

            const titleElem = document.createElement('h2');
            titleElem.style.margin = '0';
            titleElem.textContent = title;

            const closeButton = document.createElement('button');
            closeButton.textContent = '×';
            closeButton.style.cssText = `
                background: none;
                border: none;
                font-size: 24px;
                cursor: pointer;
                padding: 0 5px;
            `;
            closeButton.onclick = () => {
                dialog.remove();
                if (onClose) onClose();
            };

            header.appendChild(titleElem);
            header.appendChild(closeButton);
            dialogContent.appendChild(header);
            dialogContent.appendChild(content);
            dialog.appendChild(dialogContent);

            document.body.appendChild(dialog);
            return dialog;
        }

        static showToast(message, duration = 3000) {
            const toast = document.createElement('div');
            toast.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 10001;
            `;
            toast.textContent = message;
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), duration);
        }

        static showLoading(message = CONFIG.MESSAGES.LOADING) {
            const overlay = document.createElement('div');
            overlay.style.cssText = CONFIG.STYLES.DIALOG;

            const content = document.createElement('div');
            content.style.textAlign = 'center';
            content.style.color = 'white';

            const spinner = document.createElement('div');
            spinner.style.cssText = `
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                margin: 0 auto 10px;
                animation: spin 1s linear infinite;
            `;

            if (!document.getElementById('spinner-style')) {
                const style = document.createElement('style');
                style.id = 'spinner-style';
                style.textContent = '@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }';
                document.head.appendChild(style);
            }

            content.appendChild(spinner);
            content.appendChild(document.createTextNode(message));
            overlay.appendChild(content);
            document.body.appendChild(overlay);

            return overlay;
        }

        static createSubtitleDialog(tracks, format = CONFIG.FORMATS.SRT, onDownload, onCopy) {
            const content = document.createElement('div');

            // Format selector
            const formatDiv = document.createElement('div');
            formatDiv.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <label style="margin-right: 10px;">
                        <input type="radio" name="format" value="srt" ${format === 'srt' ? 'checked' : ''}> SRT
                    </label>
                    <label>
                        <input type="radio" name="format" value="txt" ${format === 'txt' ? 'checked' : ''}> Plain Text
                    </label>
                </div>
            `;
            content.appendChild(formatDiv);
            //batch select
            if (tracks.length > 0) {
                const selectAllDiv = document.createElement('div');
                selectAllDiv.style.marginBottom = '15px';
                const selectAllBtn = document.createElement('button');
                selectAllBtn.textContent = 'Select All Subtitles';
                selectAllBtn.style.cssText = 'background: #065fd4; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;';
                selectAllBtn.onclick = () => {
                    const checkboxes = content.querySelectorAll('input[type="checkbox"][data-lang]');
                    checkboxes.forEach(checkbox => {
                        checkbox.checked = true;
                    });
                };
                selectAllDiv.appendChild(selectAllBtn);
                content.appendChild(selectAllDiv);
            }

            // Tracks list
            if (tracks.length > 0) {
                tracks.forEach(track => {
                    const trackDiv = document.createElement('div');
                    trackDiv.style.margin = '5px 0';
                    trackDiv.innerHTML = `
                        <label>
                            <input type="checkbox" data-lang="${track.languageCode}">
                            ${track.languageName}
                        </label>
                    `;
                    content.appendChild(trackDiv);
                });
            } else {
                const noSubs = document.createElement('p');
                noSubs.style.color = '#c00';
                noSubs.textContent = CONFIG.MESSAGES.NO_SUBTITLE;
                content.appendChild(noSubs);
            }

            // Action buttons
            const actions = document.createElement('div');
            actions.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;';

            if (tracks.length > 0) {
                const downloadBtn = document.createElement('button');
                downloadBtn.textContent = 'Download Selected';
                downloadBtn.onclick = onDownload;
                actions.appendChild(downloadBtn);

                const copyBtn = document.createElement('button');
                copyBtn.textContent = 'Copy Selected';
                copyBtn.onclick = onCopy;
                actions.appendChild(copyBtn);
            }

            content.appendChild(actions);
            return content;
        }
    }

    // Video Selector with improved structure
    class VideoSelector {
        constructor() {
            this.selectedVideos = new Map();
            this.selectionActive = false;
        }

        toggleVideoSelection() {
            if (!this.selectionActive) {
                this.activateSelection();
            } else {
                this.deactivateSelection();
            }
        }

        activateSelection() {
            this.selectionActive = true;
            this.selectedVideos.clear();
            this.addSpacingStyle();

            const videos = document.querySelectorAll(CONFIG.SELECTORS.VIDEO_ELEMENTS);
            videos.forEach(video => {
                // Skip shorts
                if (video.closest('ytd-reel-shelf-renderer') ||
                    video.closest('ytd-shorts') ||
                    video.closest('ytm-shorts-lockup-view-model')) {
                    return;
                }

                video.classList.add('yt-sub-video-padding');
                this.addCheckbox(video);
            });

            this.addSelectionUI();
        }

        addSpacingStyle() {
            if (!document.getElementById('yt-sub-styles')) {
                const style = document.createElement('style');
                style.id = 'yt-sub-styles';
                style.textContent = `
                    .yt-sub-video-padding {
                        padding-left: 30px !important;
                        position: relative !important;
                    }
                `;
                document.head.appendChild(style);
            }
        }

        addCheckbox(videoElement) {
            if (videoElement.querySelector('.yt-sub-checkbox-wrapper')) return;

            const wrapper = document.createElement('div');
            wrapper.className = 'yt-sub-checkbox-wrapper';
            wrapper.style.cssText = CONFIG.STYLES.CHECKBOX_WRAPPER;

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'yt-sub-checkbox';
            checkbox.style.cssText = CONFIG.STYLES.CHECKBOX;

            wrapper.appendChild(checkbox);
            videoElement.insertBefore(wrapper, videoElement.firstChild);

            checkbox.addEventListener('change', (e) => {
                const videoId = this.extractVideoId(videoElement);
                const title = this.extractTitle(videoElement);

                if (videoId && title) {
                    if (e.target.checked) {
                        this.selectedVideos.set(videoId, { title });
                    } else {
                        this.selectedVideos.delete(videoId);
                    }
                    this.updateSelectionCount();
                }
            });
        }

        extractVideoId(video) {
            const thumbnail = video.querySelector('a#thumbnail[href*="/watch?v="]');
            if (thumbnail?.href) {
                const url = new URL(thumbnail.href);
                return url.searchParams.get('v');
            }

            const links = video.querySelectorAll('a[href*="/watch?v="]');
            for (const link of links) {
                try {
                    const url = new URL(link.href);
                    const videoId = url.searchParams.get('v');
                    if (videoId) return videoId;
                } catch {
                    continue;
                }
            }
            return null;
        }

        extractTitle(video) {
            for (const selector of CONFIG.SELECTORS.TITLE_SELECTORS) {
                const element = video.querySelector(selector);
                if (element) {
                    const title = element.textContent?.trim() ||
                                element.getAttribute('title')?.trim();
                    if (title) return title;
                }
            }

            const videoId = this.extractVideoId(video);
            return videoId ? `Video_${videoId}` : 'Untitled Video';
        }

        addSelectionUI() {
            const ui = document.createElement('div');
            ui.id = 'yt-sub-selection-ui';
            ui.style.cssText = `
                position: fixed;
                top: 10px;
                right: 10px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 20px;
                border-radius: 4px;
                z-index: 9999;
                font-size: 14px;
            `;

            ui.innerHTML = `
    <div style="margin-bottom: 10px;">
        Selected: <span id="yt-sub-count">0</span> videos
    </div>
    <div style="display: flex; gap: 10px; margin-bottom: 10px;">
        <button id="yt-sub-select-all" style="background: #065fd4; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Select All</button>
        <button id="yt-sub-select-x" style="background: #065fd4; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Select First X</button>
    </div>
    <div style="display: flex; gap: 10px;">
        <button id="yt-sub-download" style="background: #065fd4; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Download</button>
        <button id="yt-sub-cancel" style="background: #909090; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;">Cancel</button>
    </div>
`;

            document.body.appendChild(ui);

            document.getElementById('yt-sub-download').onclick = () => {
                if (this.selectedVideos.size > 0) {
                    this.processSelectedVideos();
                } else {
                    UIComponents.showToast('Please select at least one video');
                }
            };

            document.getElementById('yt-sub-cancel').onclick = () => {
                this.deactivateSelection();
            };


            document.getElementById('yt-sub-select-all').onclick = () => {
                const checkboxes = document.querySelectorAll('.yt-sub-checkbox');
                checkboxes.forEach(checkbox => {
                    if (!checkbox.checked) {
                        checkbox.click();
                    }
                });
            };

            document.getElementById('yt-sub-select-x').onclick = () => {
                const input = prompt('How many videos would you like to select?');
                const number = parseInt(input);

                if (!isNaN(number) && number > 0) {
                    const checkboxes = document.querySelectorAll('.yt-sub-checkbox');
                    checkboxes.forEach((checkbox, index) => {
                        if (index < number) {
                            if (!checkbox.checked) {
                                checkbox.click();
                            }
                        } else if (checkbox.checked) {
                            checkbox.click();
                        }
                    });
                } else if (input !== null) {
                    UIComponents.showToast('Please enter a valid number');
                }
            };


        }

        updateSelectionCount() {
            const countElement = document.getElementById('yt-sub-count');
            if (countElement) {
                countElement.textContent = this.selectedVideos.size.toString();
            }
        }

        deactivateSelection() {
            this.selectionActive = false;
            this.selectedVideos.clear();

            document.querySelectorAll('.yt-sub-video-padding').forEach(video => {
                video.classList.remove('yt-sub-video-padding');
            });

            document.querySelectorAll('.yt-sub-checkbox-wrapper').forEach(cb => cb.remove());
            document.getElementById('yt-sub-selection-ui')?.remove();
            document.getElementById('yt-sub-styles')?.remove();
        }

        async processSelectedVideos() {
            if (this.selectedVideos.size === 0) {
                UIComponents.showToast('Please select at least one video');
                return;
            }

            const loading = UIComponents.showLoading('Fetching subtitles...');

            try {
                const videos = Array.from(this.selectedVideos.entries());
                const results = await Promise.all(
                    videos.map(async ([videoId, data]) => {
                        try {
                            const tracks = await SubtitleService.fetchSubtitleTracks(videoId);
                            return { ...data, videoId, subtitles: tracks || [] };
                        } catch (error) {
                            console.error(`Failed to fetch subtitles for ${videoId}:`, error);
                            return { ...data, videoId, subtitles: [] };
                        }
                    })
                );

                this.showSubtitleDialog(results);
            } catch (error) {
                UIComponents.showToast(CONFIG.MESSAGES.ERROR.FETCH);
                console.error('Failed to process videos:', error);
            } finally {
                loading.remove();
            }
        }

        showSubtitleDialog(videos) {
            const getSelectedTracks = () => {
                return Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => {
                        const videoId = cb.dataset.videoId;
                        const langCode = cb.dataset.lang;
                        const video = videos.find(v => v.videoId === videoId);
                        const track = video?.subtitles.find(t => t.languageCode === langCode);
                        return track ? { ...track, videoTitle: video.title } : null;
                    })
                    .filter(Boolean);
            };

            const content = document.createElement('div');

            // Format selector
            const formatDiv = document.createElement('div');
            formatDiv.innerHTML = `
                <div style="margin-bottom: 15px;">
                    <label style="margin-right: 10px;">
                        <input type="radio" name="format" value="srt" checked> SRT
                    </label>
                    <label>
                        <input type="radio" name="format" value="txt"> Plain Text
                    </label>
                </div>
            `;
            content.appendChild(formatDiv);
            //batch Select
            const selectAllDiv = document.createElement('div');
            selectAllDiv.style.marginBottom = '15px';
            const selectAllBtn = document.createElement('button');
            selectAllBtn.textContent = 'Select All Subtitles';
            selectAllBtn.style.cssText = 'background: #065fd4; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer;';
            selectAllBtn.onclick = () => {
                const checkboxes = content.querySelectorAll('input[type="checkbox"][data-video-id]');
                checkboxes.forEach(checkbox => {
                    checkbox.checked = true;
                });
            };
            selectAllDiv.appendChild(selectAllBtn);
            content.appendChild(selectAllDiv);



            // Videos and their subtitles
            videos.forEach(video => {
                const videoDiv = document.createElement('div');
                videoDiv.style.cssText = 'margin-bottom: 20px; padding: 10px; border: 1px solid #ddd; border-radius: 4px;';

                const title = document.createElement('h3');
                title.style.margin = '0 0 10px 0';
                title.textContent = video.title;
                videoDiv.appendChild(title);

                if (video.subtitles.length > 0) {
                    video.subtitles.forEach(track => {
                        const trackDiv = document.createElement('div');
                        trackDiv.style.margin = '5px 0';
                        trackDiv.innerHTML = `
                            <label>
                                <input type="checkbox"
                                       data-video-id="${video.videoId}"
                                       data-lang="${track.languageCode}">
                                ${track.languageName}
                            </label>
                        `;
                        videoDiv.appendChild(trackDiv);
                    });
                } else {
                    const noSubs = document.createElement('p');
                    noSubs.style.color = '#c00';
                    noSubs.textContent = CONFIG.MESSAGES.NO_SUBTITLE;
                    videoDiv.appendChild(noSubs);
                }

                content.appendChild(videoDiv);
            });

            // Action buttons
            const actions = document.createElement('div');
            actions.style.cssText = 'display: flex; justify-content: flex-end; gap: 10px; margin-top: 20px;';

            const downloadBtn = document.createElement('button');
            downloadBtn.textContent = 'Download Selected';
            downloadBtn.onclick = async () => {
                const tracks = getSelectedTracks();
                const format = document.querySelector('input[name="format"]:checked').value;

                if (tracks.length === 0) {
                    UIComponents.showToast('Please select at least one subtitle');
                    return;
                }

                try {
                    const selectedTracks = tracks.map(track => ({
                        ...track,
                        baseUrl: track.baseUrl
                    }));
                    await SubtitleService.downloadSubtitles(selectedTracks, format);
                    UIComponents.showToast('Download complete!');
                } catch (error) {
                    UIComponents.showToast(CONFIG.MESSAGES.ERROR.FETCH);
                    console.error('Download error:', error);
                }
            };
            actions.appendChild(downloadBtn);

            const copyBtn = document.createElement('button');
            copyBtn.textContent = 'Copy Selected';
            copyBtn.onclick = async () => {
                const tracks = getSelectedTracks();
                const format = document.querySelector('input[name="format"]:checked').value;

                if (tracks.length === 0) {
                    UIComponents.showToast('Please select at least one subtitle');
                    return;
                }

                try {
                    await SubtitleService.copySubtitles(tracks, format);
                } catch (error) {
                    UIComponents.showToast(CONFIG.MESSAGES.ERROR.COPY);
                    console.error('Copy error:', error);
                }
            };
            actions.appendChild(copyBtn);

            content.appendChild(actions);

            UIComponents.showDialog('Select Subtitles to Download', content, () => {
                this.deactivateSelection();
            });
        }
    }

    // Single Video Downloader
    class SingleVideoDownloader {
        async downloadCurrentVideo() {
            const videoId = this.getCurrentVideoId();
            if (!videoId) {
                UIComponents.showToast(CONFIG.MESSAGES.ERROR.NO_VIDEO);
                return;
            }

            const loading = UIComponents.showLoading();

            try {
                const tracks = await SubtitleService.fetchSubtitleTracks(videoId);
                if (!tracks?.length) {
                    UIComponents.showToast(CONFIG.MESSAGES.NO_SUBTITLE);
                    return;
                }

                const videoTitle = document.title.split(' - YouTube')[0] || `Video_${videoId}`;
                this.showSubtitleDialog(tracks, videoTitle);
            } catch (error) {
                UIComponents.showToast(CONFIG.MESSAGES.ERROR.FETCH);
                console.error('Failed to fetch subtitles:', error);
            } finally {
                loading.remove();
            }
        }

        getCurrentVideoId() {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get('v');
        }

        showSubtitleDialog(tracks, videoTitle) {
            const getSelectedTracks = () => {
                return Array.from(document.querySelectorAll('input[type="checkbox"]:checked'))
                    .map(cb => {
                        const track = tracks.find(t => t.languageCode === cb.dataset.lang);
                        return track ? { ...track, videoTitle } : null;
                    })
                    .filter(Boolean);
            };

            const content = UIComponents.createSubtitleDialog(
                tracks,
                CONFIG.FORMATS.SRT,
                async () => {
                    const selectedTracks = getSelectedTracks();
                    const format = document.querySelector('input[name="format"]:checked').value;

                    if (selectedTracks.length === 0) {
                        UIComponents.showToast('Please select at least one subtitle');
                        return;
                    }

                    try {
                        const tracksWithTitle = selectedTracks.map(track => ({
                            ...track,
                            videoTitle
                        }));
                        await SubtitleService.downloadSubtitles(tracksWithTitle, format);
                        UIComponents.showToast('Download complete!');
                    } catch (error) {
                        UIComponents.showToast(CONFIG.MESSAGES.ERROR.FETCH);
                        console.error('Download error:', error);
                    }
                },
                async () => {
                    const selectedTracks = getSelectedTracks();
                    const format = document.querySelector('input[name="format"]:checked').value;

                    if (selectedTracks.length === 0) {
                        UIComponents.showToast('Please select at least one subtitle');
                        return;
                    }

                    try {
                        await SubtitleService.copySubtitles(selectedTracks, format, videoTitle);
                    } catch (error) {
                        UIComponents.showToast(CONFIG.MESSAGES.ERROR.COPY);
                        console.error('Copy error:', error);
                    }
                }
            );

            UIComponents.showDialog('Select Subtitles to Download', content);
        }
    }

    // Main manager class
    class YouTubeSubtitleManager {
        constructor() {
            this.singleMode = new SingleVideoDownloader();
            this.bulkMode = new VideoSelector();
            this.registerCommands();
            this.setupNavigationHandler();
        }

        registerCommands() {
            GM_registerMenuCommand('Download Current Video Subtitles',
                () => this.singleMode.downloadCurrentVideo());
            GM_registerMenuCommand('Select Videos for Subtitles',
                () => this.bulkMode.toggleVideoSelection());
        }

        setupNavigationHandler() {
            document.addEventListener('yt-navigate-finish', () => {
                if (this.bulkMode.selectionActive) {
                    this.bulkMode.deactivateSelection();
                    this.bulkMode.activateSelection();
                }
            });
        }
    }

    // Initialize the manager
    new YouTubeSubtitleManager();

})();