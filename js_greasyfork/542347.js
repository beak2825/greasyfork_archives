// ==UserScript==
// @name         RedGIFs Download Button
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Adds polished download buttons on RedGIFs watch pages and batch buttons on user profiles. Loading indicator, custom filename, dark mode, accessibility included.
// @author       Slagger122
// @match        https://www.redgifs.com/watch/*
// @match        https://www.redgifs.com/users/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542347/RedGIFs%20Download%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/542347/RedGIFs%20Download%20Button.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Icons (SVG alternatives recommended later)
    const ICON_SOUND_ON = '🔊';
    const ICON_SOUND_OFF = '🔇';
    const ICON_DOWNLOAD = '⬇';

    // Utility: Create styled button element
    function createButton(text, title, id, disabled = false) {
        const btn = document.createElement('button');
        btn.id = id;
        btn.type = 'button';
        btn.disabled = disabled;
        btn.setAttribute('aria-label', title);
        btn.title = title;
        btn.tabIndex = 0;
        btn.style.cssText = `
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 8px 14px;
            background: var(--btn-bg, #e50914);
            color: var(--btn-color, white);
            font-weight: 600;
            border: none;
            border-radius: 8px;
            font-family: Arial, sans-serif;
            font-size: 14px;
            cursor: ${disabled ? 'not-allowed' : 'pointer'};
            user-select: none;
            box-shadow: 0 0 8px rgba(0,0,0,0.3);
            transition: background 0.3s ease;
            outline-offset: 2px;
        `;

        btn.addEventListener('mouseenter', () => {
            if (!disabled) btn.style.background = 'var(--btn-bg-hover, #b0060f)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'var(--btn-bg, #e50914)';
        });

        btn.innerHTML = text;
        return btn;
    }

    // Detect dark mode and set CSS variables accordingly
    function applyDarkModeStyles() {
        const dark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (dark) {
            document.documentElement.style.setProperty('--btn-bg', '#bb2525');
            document.documentElement.style.setProperty('--btn-bg-hover', '#7f1b1b');
            document.documentElement.style.setProperty('--btn-color', '#fff');
        }
    }

    // Get video ID from URL path (watch pages)
    function getVideoId() {
        const m = window.location.pathname.match(/^\/watch\/([^/#?]+)/);
        return m ? m[1] : null;
    }

    // Get meta video URL from og:video tag
    function getMetaVideoUrl() {
        const meta = document.querySelector('meta[property="og:video"]');
        return meta ? meta.content : null;
    }

    // Test if a URL exists by HEAD request
    function testUrl(url, cb) {
        fetch(url, { method: 'HEAD' })
            .then(res => cb(res.ok ? url : null))
            .catch(() => cb(null));
    }

    // Auto-download helper
    function triggerDownload(url, filename) {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename || '';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // Insert the main page download button
    function insertMainDownloadButton(videoId, url, hasAudio) {
        if (document.getElementById('redgifs-download-btn')) return;

        const fileName = `${videoId}.mp4`;
        const icon = hasAudio ? ICON_SOUND_ON : ICON_SOUND_OFF;
        const tooltip = hasAudio
            ? 'Click to download video with audio'
            : 'Silent video — audio not available';

        const btn = createButton(`${icon} Download MP4`, tooltip, 'redgifs-download-btn', !hasAudio);
        btn.style.position = 'fixed';
        btn.style.top = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = 9999;
        btn.style.fontSize = '16px';

        if (hasAudio) {
            btn.addEventListener('click', () => triggerDownload(url, fileName));
        }

        document.body.appendChild(btn);
    }

    // Show loading indicator button
    function insertLoadingButton() {
        if (document.getElementById('redgifs-download-btn')) return;

        const btn = createButton('⏳ Checking audio...', 'Loading video info', 'redgifs-download-btn', true);
        btn.style.position = 'fixed';
        btn.style.top = '20px';
        btn.style.right = '20px';
        btn.style.zIndex = 9999;
        btn.style.fontSize = '16px';
        document.body.appendChild(btn);
    }

    // Main logic for watch page
    function handleWatchPage() {
        const videoId = getVideoId();
        if (!videoId) return;

        const originalUrl = getMetaVideoUrl();
        if (!originalUrl) {
            console.warn('[RedGIFs Downloader] No meta video URL found.');
            return;
        }

        insertLoadingButton();

        if (originalUrl.endsWith('-silent.mp4')) {
            const modifiedUrl = originalUrl.replace('-silent.mp4', '.mp4');
            testUrl(modifiedUrl, (validUrl) => {
                const btn = document.getElementById('redgifs-download-btn');
                if (btn) btn.remove();

                if (validUrl) {
                    insertMainDownloadButton(videoId, validUrl, true);
                    console.log(`[RedGIFs Downloader] ✅ Using audio URL: ${validUrl}`);
                } else {
                    insertMainDownloadButton(videoId, originalUrl, false);
                    console.log(`[RedGIFs Downloader] 🔇 Silent only available: ${originalUrl}`);
                }
            });
        } else {
            const btn = document.getElementById('redgifs-download-btn');
            if (btn) btn.remove();
            insertMainDownloadButton(videoId, originalUrl, true);
            console.log(`[RedGIFs Downloader] ✅ Using provided URL: ${originalUrl}`);
        }
    }

    // Batch download buttons for user profiles
    function handleUserProfilePage() {
        // Container for batch buttons - if needed for "Download All"
        // For now, we just add individual download buttons per video thumbnail.

        const containerSelector = '.gif-grid .gif-grid-item a[href^="/watch/"]';
        const links = document.querySelectorAll(containerSelector);
        if (!links.length) return;

        // Add a style for small batch buttons
        const style = document.createElement('style');
        style.textContent = `
          .batch-download-btn {
            position: absolute;
            top: 5px;
            right: 5px;
            background: rgba(229, 9, 20, 0.85);
            border-radius: 4px;
            padding: 4px 7px;
            font-size: 12px;
            color: white;
            font-weight: bold;
            cursor: pointer;
            user-select: none;
            z-index: 100;
            text-shadow: 0 0 2px black;
            transition: background 0.3s ease;
          }
          .batch-download-btn:hover {
            background: rgba(176, 0, 15, 0.85);
          }
          .gif-grid-item {
            position: relative;
          }
        `;
        document.head.appendChild(style);

        links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href) return;

            const videoIdMatch = href.match(/\/watch\/([^/#?]+)/);
            if (!videoIdMatch) return;
            const videoId = videoIdMatch[1];

            // Skip if button already added
            if (link.parentElement.querySelector('.batch-download-btn')) return;

            const btn = document.createElement('div');
            btn.className = 'batch-download-btn';
            btn.title = 'Download MP4';
            btn.textContent = ICON_DOWNLOAD;

            btn.addEventListener('click', async (e) => {
                e.stopPropagation();
                e.preventDefault();

                // Fetch the meta tag for this video by fetching its page HTML
                try {
                    const response = await fetch(`https://www.redgifs.com/watch/${videoId}`);
                    if (!response.ok) throw new Error('Failed to fetch video page');

                    const text = await response.text();

                    // Parse meta tag content from the fetched HTML text
                    const metaMatch = text.match(/<meta property="og:video" content="([^"]+)"/);
                    if (!metaMatch) throw new Error('Meta video tag not found');

                    let videoUrl = metaMatch[1];
                    if (videoUrl.endsWith('-silent.mp4')) {
                        // try removing -silent for audio version
                        const audioUrl = videoUrl.replace('-silent.mp4', '.mp4');

                        // test if audio URL exists by HEAD
                        const testResp = await fetch(audioUrl, { method: 'HEAD' });
                        if (testResp.ok) videoUrl = audioUrl;
                    }

                    triggerDownload(videoUrl, `${videoId}.mp4`);
                } catch (err) {
                    alert('Download failed: ' + err.message);
                    console.error('Batch download error:', err);
                }
            });

            // Append the button inside the gif-grid-item parent
            link.parentElement.style.position = 'relative';
            link.parentElement.appendChild(btn);
        });
    }

    // Entry point
    function init() {
        applyDarkModeStyles();

        if (window.location.pathname.startsWith('/watch/')) {
            handleWatchPage();
        } else if (window.location.pathname.startsWith('/users/')) {
            handleUserProfilePage();
        }
    }

    if (document.readyState === 'loading') {
        window.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();

