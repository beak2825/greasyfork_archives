// ==UserScript==
// @name         Snapchat Image & Video Downloader
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Double-click on an image or video to download it instantly without the user noticing.
// @author       Me
// @match        https://www.snapchat.com/*
// @license MIT
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/531940/Snapchat%20Image%20%20Video%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/531940/Snapchat%20Image%20%20Video%20Downloader.meta.js
// ==/UserScript==

(function () {
    'use strict';

    document.addEventListener('dblclick', (e) => {
        const el = e.target;

        if (!(el instanceof HTMLImageElement || el instanceof HTMLVideoElement)) return;

        const src = el.currentSrc || el.src;

        if (!src || !src.startsWith('blob:')) {
            return;
        }

        const type = el instanceof HTMLVideoElement ? 'video' : 'image';
        const extension = type === 'video' ? 'mp4' : 'png';
        const now = new Date();
        const filename = `snapblob_${now.toISOString().replace(/[:.]/g, '-')}.${extension}`;

        console.log(`[SnapDL] Downloading ${type}...`, src);

        GM_download({
            url: src,
            name: filename,
            saveAs: true,
            onload: () => console.log('[SnapDL] ✅ Success:', filename),
            onerror: err => console.error('[SnapDL] ❌ Failed:', err)
        });
    });
})();
