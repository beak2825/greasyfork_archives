// ==UserScript==
// @name         Facebook post downloader
// @namespace    https://github.com/spartan370
// @version      3.2
// @license MIT
// @description  Press the ` key on Facebook pages to download the focused image with advanced UI, auto counter reset every 20 minutes, and robust file type detection.
// @author       Connor M (spartan370 on GitHub)
// @copyright    © 2025 Connor Morrissey. All rights reserved. Do not steal this code.
// @match        *://*.facebook.com/*
// @match        *://m.facebook.com/*
// @grant        GM_download
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526638/Facebook%20post%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/526638/Facebook%20post%20downloader.meta.js
// ==/UserScript==

(async function() {
    'use strict';
    async function getPersistent(key, defaultValue) {
        if (typeof GM_getValue === 'function') {
            return await GM_getValue(key, defaultValue);
        } else {
            const val = localStorage.getItem(key);
            return val === null ? defaultValue : JSON.parse(val);
        }
    }
    async function setPersistent(key, value) {
        if (typeof GM_setValue === 'function') {
            await GM_setValue(key, value);
        } else {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
    const counterKey = 'fbImageDownloader_counter';
    const lastResetKey = 'fbImageDownloader_lastReset';
    async function initializePersistentValues() {
        let counter = await getPersistent(counterKey, null);
        if (counter === null) {
            await setPersistent(counterKey, 1);
        }
        let lastReset = await getPersistent(lastResetKey, null);
        if (lastReset === null) {
            await setPersistent(lastResetKey, Date.now());
        }
        updateCounterDisplay();
    }
    await initializePersistentValues();
    async function resetCounter() {
        await setPersistent(counterKey, 1);
        await setPersistent(lastResetKey, Date.now());
        updateCounterDisplay();
        showNotification('Download counter has been reset to 1.');
    }
    async function getCounter() {
        return await getPersistent(counterKey, 1);
    }
    async function incrementCounter() {
        const current = await getCounter();
        await setPersistent(counterKey, current + 1);
        updateCounterDisplay();
        return current;
    }
    function scheduleAutoReset() {
        setInterval(async () => {
            const lastReset = await getPersistent(lastResetKey, Date.now());
            if (Date.now() - lastReset >= 20 * 60 * 1000) {
                await resetCounter();
            }
        }, 60000);
    }
    scheduleAutoReset();
    function createFloatingPanel() {
        const panel = document.createElement('div');
        panel.id = 'fbImageDownloaderPanel';
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.left = '20px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
        panel.style.color = '#fff';
        panel.style.padding = '10px 15px';
        panel.style.borderRadius = '8px';
        panel.style.boxShadow = '0 4px 8px rgba(0,0,0,0.3)';
        panel.style.zIndex = '10000';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.style.fontSize = '14px';
        const counterDisplay = document.createElement('span');
        counterDisplay.id = 'fbImageDownloaderCounterDisplay';
        counterDisplay.textContent = 'Next File #: 1';
        panel.appendChild(counterDisplay);
        const spacer = document.createElement('span');
        spacer.textContent = '   ';
        panel.appendChild(spacer);
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset Counter';
        resetBtn.style.padding = '4px 8px';
        resetBtn.style.fontSize = '12px';
        resetBtn.style.border = 'none';
        resetBtn.style.borderRadius = '4px';
        resetBtn.style.cursor = 'pointer';
        resetBtn.style.backgroundColor = '#007bff';
        resetBtn.style.color = '#fff';
        resetBtn.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        resetBtn.addEventListener('mouseenter', () => {
            resetBtn.style.backgroundColor = '#0056b3';
        });
        resetBtn.addEventListener('mouseleave', () => {
            resetBtn.style.backgroundColor = '#007bff';
        });
        resetBtn.addEventListener('click', async () => {
            await resetCounter();
        });
        panel.appendChild(resetBtn);
        document.body.appendChild(panel);
    }
    createFloatingPanel();
    async function updateCounterDisplay() {
        const counterDisplay = document.getElementById('fbImageDownloaderCounterDisplay');
        if (counterDisplay) {
            const cnt = await getCounter();
            counterDisplay.textContent = 'Next File #: ' + cnt;
        }
    }
    function isElementVisible(el) {
        const rect = el.getBoundingClientRect();
        return rect.width > 0 && rect.height > 0 && rect.bottom >= 0 && rect.right >= 0 && rect.top <= (window.innerHeight || document.documentElement.clientHeight) && rect.left <= (window.innerWidth || document.documentElement.clientWidth);
    }
    function getTargetImage() {
        const selectors = ['img[role="presentation"]', '.fbPhotoImageMedia', '[data-visualcompletion="media-vc-photo"]'];
        for (const sel of selectors) {
            const img = document.querySelector(sel);
            if (img && img.src && isElementVisible(img)) {
                return img;
            }
        }
        const x = window.innerWidth / 2;
        const y = window.innerHeight / 2;
        const el = document.elementFromPoint(x, y);
        if (el && el.tagName.toLowerCase() === 'img' && el.src && isElementVisible(el)) {
            return el;
        }
        return null;
    }
    function fallbackExtension(url) {
        try {
            const urlObj = new URL(url);
            const match = urlObj.pathname.match(/\.(jpe?g|png|gif|bmp|webp)(?=\?|$)/i);
            return match ? match[1] : 'jpg';
        } catch (e) {
            return 'jpg';
        }
    }
    function createProgressOverlay(label) {
        const overlay = document.createElement('div');
        overlay.id = 'fbImageDownloaderProgressOverlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '20px';
        overlay.style.right = '20px';
        overlay.style.backgroundColor = 'rgba(0,0,0,0.8)';
        overlay.style.color = '#fff';
        overlay.style.padding = '10px 15px';
        overlay.style.borderRadius = '8px';
        overlay.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        overlay.style.zIndex = '10000';
        overlay.style.fontFamily = 'Arial, sans-serif';
        overlay.style.fontSize = '14px';
        overlay.textContent = `${label}: 0%`;
        document.body.appendChild(overlay);
        return overlay;
    }
    function updateProgressOverlay(overlay, label, percent) {
        if (overlay) {
            overlay.textContent = `${label}: ${percent}%`;
        }
    }
    function removeProgressOverlay(overlay) {
        if (overlay && overlay.parentNode) {
            overlay.parentNode.removeChild(overlay);
        }
    }
    function showNotification(message, duration = 3000) {
        const notif = document.createElement('div');
        notif.style.position = 'fixed';
        notif.style.bottom = '30px';
        notif.style.right = '30px';
        notif.style.backgroundColor = 'rgba(0,0,0,0.8)';
        notif.style.color = '#fff';
        notif.style.padding = '10px 20px';
        notif.style.borderRadius = '6px';
        notif.style.fontFamily = 'Arial, sans-serif';
        notif.style.fontSize = '14px';
        notif.style.zIndex = '10000';
        notif.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
        notif.textContent = message;
        document.body.appendChild(notif);
        setTimeout(() => {
            notif.style.transition = 'opacity 0.5s';
            notif.style.opacity = '0';
            setTimeout(() => {
                if (notif && notif.parentNode) {
                    notif.parentNode.removeChild(notif);
                }
            }, 500);
        }, duration);
    }
    function showTooltip(message, duration = 4000) {
        const tooltip = document.createElement('div');
        tooltip.style.position = 'fixed';
        tooltip.style.top = '50%';
        tooltip.style.left = '50%';
        tooltip.style.transform = 'translate(-50%, -50%)';
        tooltip.style.backgroundColor = 'rgba(0,0,0,0.85)';
        tooltip.style.color = '#fff';
        tooltip.style.padding = '15px 25px';
        tooltip.style.borderRadius = '8px';
        tooltip.style.fontFamily = 'Arial, sans-serif';
        tooltip.style.fontSize = '16px';
        tooltip.style.zIndex = '10000';
        tooltip.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        tooltip.textContent = message;
        document.body.appendChild(tooltip);
        setTimeout(() => {
            tooltip.style.transition = 'opacity 0.5s';
            tooltip.style.opacity = '0';
            setTimeout(() => {
                if (tooltip && tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 500);
        }, duration);
    }
    async function downloadImage(url) {
        const fetchOverlay = createProgressOverlay('Fetching');
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            responseType: 'blob',
            onprogress: function(event) {
                if (event.lengthComputable) {
                    const percent = Math.round((event.loaded / event.total) * 100);
                    updateProgressOverlay(fetchOverlay, 'Fetching', percent);
                }
            },
            onload: async function(response) {
                removeProgressOverlay(fetchOverlay);
                const blob = response.response;
                const mime = blob.type;
                let ext = '';
                if(mime === 'image/jpeg') ext = 'jpg';
                else if(mime === 'image/png') ext = 'png';
                else if(mime === 'image/gif') ext = 'gif';
                else if(mime === 'image/webp') ext = 'webp';
                else if(mime === 'image/bmp') ext = 'bmp';
                else ext = fallbackExtension(url);
                const currentCounter = await getCounter();
                const filename = `${currentCounter}.${ext}`;
                const objectUrl = URL.createObjectURL(blob);
                if (typeof GM_download === 'function') {
                    const dlOverlay = createProgressOverlay(filename);
                    GM_download({
                        url: objectUrl,
                        name: filename,
                        onprogress: function(event) {
                            if (event.lengthComputable) {
                                const percent = Math.round((event.loaded / event.total) * 100);
                                updateProgressOverlay(dlOverlay, filename, percent);
                            }
                        },
                        onload: async function() {
                            removeProgressOverlay(dlOverlay);
                            showNotification(`Download completed: ${filename}`);
                            await incrementCounter();
                            URL.revokeObjectURL(objectUrl);
                        },
                        onerror: async function(err) {
                            removeProgressOverlay(dlOverlay);
                            showNotification(`Download error: ${filename}`);
                            console.error('GM_download error:', err);
                            URL.revokeObjectURL(objectUrl);
                        }
                    });
                } else {
                    let a = document.createElement('a');
                    a.href = objectUrl;
                    a.download = filename;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    showNotification(`Downloaded: ${filename}`);
                    await incrementCounter();
                    URL.revokeObjectURL(objectUrl);
                }
            },
            onerror: function(err) {
                removeProgressOverlay(fetchOverlay);
                showNotification('Failed to fetch image blob.', 3000);
                console.error('GM_xmlhttpRequest error:', err);
            }
        });
    }
    document.addEventListener('keydown', async function(e) {
        if (e.key === '`' && !e.repeat && !e.target.matches('input, textarea, [contenteditable]')) {
            const img = getTargetImage();
            if (img && img.src) {
                await downloadImage(img.src);
            } else {
                showNotification('No image found on screen!', 3000);
            }
        }
    });
    if (typeof GM_registerMenuCommand === 'function') {
        GM_registerMenuCommand('Reset Download Counter', async () => {
            await resetCounter();
        });
    }
    showTooltip('FB Image Downloader active. Press ` to download image.');
})();