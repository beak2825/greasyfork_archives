// ==UserScript==
// @name         NovelCrow Parallel Downloader
// @namespace https://greasyfork.org/users/1462126
// @version      3.0
// @description  Scrolls and downloads all images reliably with parallel downloads and retries
// @author       B14ckwxd
// @match        https://novelcrow.com/comic/*/*
// @grant        GM_addStyle
// @noframes
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/533980/NovelCrow%20Parallel%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/533980/NovelCrow%20Parallel%20Downloader.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        #ncp-btn {
            position: fixed; right: 20px; bottom: 20px; z-index: 999999;
            background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none;
            padding: 14px 20px; border-radius: 12px; font-weight: 700; font-size: 14px; cursor: pointer;
            box-shadow: 0 6px 20px rgba(0,0,0,0.3); transition: all 0.3s ease;
        }
        #ncp-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        #ncp-progress {
            position: fixed; right: 20px; bottom: 70px; z-index: 999999;
            background: rgba(255,255,255,0.98); padding: 12px; border-radius: 12px;
            font-family: sans-serif; display: none; width: 350px; max-width: calc(100vw - 40px);
            box-shadow: 0 8px 24px rgba(0,0,0,0.2);
        }
        #ncp-status { font-size: 14px; font-weight: bold; margin-bottom: 6px; color: #333; }
        #ncp-bar { width: 100%; height: 8px; background: #e0e0e0; border-radius: 6px; overflow: hidden; margin-bottom: 6px; }
        #ncp-fill { width: 0%; height: 100%; background: linear-gradient(90deg, #667eea, #764ba2); transition: width 0.3s ease; }
        #ncp-count { font-size: 12px; color: #555; text-align: right; }
    `);

    function createUI() {
        const btn = document.createElement('button');
        btn.id = 'ncp-btn';
        btn.textContent = '⬇ Download All Images';
        btn.addEventListener('click', startDownload);
        document.body.appendChild(btn);

        const progress = document.createElement('div');
        progress.id = 'ncp-progress';
        progress.innerHTML = `
            <div id="ncp-status">Ready</div>
            <div id="ncp-bar"><div id="ncp-fill"></div></div>
            <div id="ncp-count"></div>
        `;
        document.body.appendChild(progress);
    }

    function updateProgress(status, percent = 0, countText = '') {
        const progress = document.getElementById('ncp-progress');
        const fill = document.getElementById('ncp-fill');
        const statusEl = document.getElementById('ncp-status');
        const countEl = document.getElementById('ncp-count');

        if (!progress) return;
        progress.style.display = 'block';
        statusEl.textContent = status;
        fill.style.width = Math.min(100, Math.max(0, percent)) + '%';
        countEl.textContent = countText;
    }

    async function scrollAndLoadAllImages(timeout = 120000, interval = 500) {
        const startTime = Date.now();
        let lastCount = 0;
        let stableCounter = 0;
        const stableMax = 5;

        while ((Date.now() - startTime) < timeout) {
            const imgs = Array.from(document.querySelectorAll('img.wp-manga-chapter-img'));
            window.scrollBy(0, 800);
            await new Promise(r => setTimeout(r, interval));

            const loaded = imgs.filter(img => img.naturalHeight > 0).length;
            if (loaded === lastCount) stableCounter++; else stableCounter = 0;
            lastCount = loaded;

            if (stableCounter >= stableMax && loaded > 0) break;
        }

        return Array.from(document.querySelectorAll('img.wp-manga-chapter-img'));
    }

    async function waitForImage(img, retries = 5, delay = 600) {
        for (let i = 0; i < retries; i++) {
            if (!img.src && img.hasAttribute('data-src')) img.src = img.getAttribute('data-src');
            await new Promise(r => setTimeout(r, delay));
            if (img.complete && img.naturalHeight > 0) return true;
        }
        return false;
    }

    async function downloadImage(img, index) {
        const loaded = await waitForImage(img);
        if (!loaded) throw new Error('Image failed to load');
        const ext = img.src.split('.').pop().split('?')[0];
        const filename = `page_${String(index + 1).padStart(3,'0')}.${ext}`;
        const a = document.createElement('a');
        a.href = img.src;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    async function parallelDownload(images, concurrency = 5) {
        let index = 0;
        const total = images.length;

        async function worker() {
            while (index < total) {
                const i = index++;
                try {
                    await downloadImage(images[i], i);
                } catch (err) {
                    console.warn(`Retrying image ${i+1}`);
                    await downloadImage(images[i], i); // retry once
                }
                updateProgress(`Downloading...`, ((i+1)/total)*100, `${i+1}/${total}`);
            }
        }

        const workers = Array.from({length: Math.min(concurrency, total)}, () => worker());
        await Promise.all(workers);
    }

    async function startDownload() {
        const btn = document.getElementById('ncp-btn');
        if (!btn || btn.disabled) return;
        btn.disabled = true;
        btn.textContent = '⏳ Loading images...';

        try {
            const images = await scrollAndLoadAllImages();
            if (images.length === 0) throw new Error('No images found');

            await parallelDownload(images, 6);
            updateProgress(`✅ Download complete!`, 100, `${images.length} images`);

        } catch (err) {
            console.error(err);
            updateProgress(`❌ Error: ${err.message}`, 0);
        } finally {
            setTimeout(() => {
                if (btn) {
                    btn.disabled = false;
                    btn.textContent = '⬇ Download All Images';
                }
            }, 5000);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createUI);
    } else {
        createUI();
    }

})();
