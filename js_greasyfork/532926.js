// ==UserScript==
// @name         YouTube Screenshot Frame
// @namespace    https://github.com/dpi0/scripts/blob/main/greasyfork/youtube-screenshot-frame.js
// @version      1.0
// @description  Capture YouTube screenshots with a hotkey (default is key = 'b'). Filename includes title, timestamp, and capture time.
// @author       dpi0
// @match        https://www.youtube.com/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @homepageURL https://github.com/dpi0/scripts/blob/main/greasyfork/youtube-screenshot-frame.js
// @originalhomepageURL https://greasyfork.org/en/scripts/532893-youtube-screenshot-helper/code
// @supportURL  https://github.com/dpi0/scripts/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/532926/YouTube%20Screenshot%20Frame.user.js
// @updateURL https://update.greasyfork.org/scripts/532926/YouTube%20Screenshot%20Frame.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const defaultHotkey = 'b';
    let screenshotKey = GM_getValue('screenshotKey', defaultHotkey);

    function getVideoElement() {
        return document.querySelector('video');
    }

    function getVideoTitle() {
        const selectors = [
            'h1.title.ytd-video-primary-info-renderer',
            'h1.title.style-scope.ytd-video-primary-info-renderer',
            'ytd-watch-metadata h1',
            'meta[name="title"]'
        ];
        for (const sel of selectors) {
            const el = document.querySelector(sel);
            let rawTitle = el?.textContent || el?.content;
            if (rawTitle) {
                return rawTitle
                    .trim()
                    .replace(/[\\/:*?"<>|]/g, '_')   // illegal chars
                    .replace(/\s+/g, '-')            // spaces to dashes
                    .toLowerCase();
            }
        }
        return 'unknown-title';
    }

    function formatTimestamp(date) {
        const pad = (n) => n.toString().padStart(2, '0');
        return `${pad(date.getDate())}-${date.toLocaleString('default', { month: 'short' })}-${date.getFullYear()}_${pad(date.getHours())}-${pad(date.getMinutes())}-${pad(date.getSeconds())}`;
    }

    function formatFrameTime(seconds) {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(Math.floor(seconds % 60)).padStart(2, '0');
        return `${h}-${m}-${s}`;
    }

    function takeScreenshot() {
        const video = getVideoElement();
        if (!video) return;

        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        const now = new Date();
        const title = getVideoTitle();
        const timestamp = formatTimestamp(now);
        const frameTime = formatFrameTime(video.currentTime);

        const filename = `YS_${title}_${frameTime}_${timestamp}.png`;
        const link = document.createElement('a');
        link.download = filename;
        link.href = canvas.toDataURL('image/png');
        link.click();
    }

    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === screenshotKey && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
            takeScreenshot();
        }
    });

    GM_registerMenuCommand(`Set Screenshot Key (Current: ${screenshotKey.toUpperCase()})`, () => {
        const input = prompt('Enter new hotkey (a-z):', screenshotKey);
        if (input && /^[a-zA-Z]$/.test(input)) {
            GM_setValue('screenshotKey', input.toLowerCase());
            location.reload();
        }
    });
})();
