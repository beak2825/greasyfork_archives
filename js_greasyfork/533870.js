// ==UserScript==
// @name         Sniffies Auto Send Photos
// @version      1.1
// @description  Use Ctrl+Space to select saved photos, and Ctrl+Alt to auto-send them one by one on Sniffies.
// @author       LiveCamShow
// @match        *://sniffies.com/*
// @icon         https://sniffies.com/favicon.ico
// @grant        none
// @homepageURL  https://gitlab.com/livecamshow/UserScripts
// @namespace    LiveCamShow.scripts
// @license MIT
// @inject-into  page
// @downloadURL https://update.greasyfork.org/scripts/533870/Sniffies%20Auto%20Send%20Photos.user.js
// @updateURL https://update.greasyfork.org/scripts/533870/Sniffies%20Auto%20Send%20Photos.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const STORAGE_KEY = 'sniffies_selected_images';
    let isSelectionMode = false;
    let selectedImages = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

    const waitFor = (selectorFn, condition = el => el.offsetParent !== null, timeout = 10000) => new Promise((resolve, reject) => {
        const start = Date.now();
        const interval = setInterval(() => {
            const el = typeof selectorFn === 'function' ? selectorFn() : document.querySelector(selectorFn);
            if (el && condition(el)) {
                clearInterval(interval);
                resolve(el);
            } else if (Date.now() - start > timeout) {
                clearInterval(interval);
                reject(new Error(`Timeout waiting for ${selectorFn}`));
            }
        }, 200);
    });

    const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

    const createOverlay = () => {
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;background:rgba(128,128,128,0.5);z-index:10';
        overlay.innerHTML = `<span style="position:absolute;top:5px;right:5px;color:green;font-size:24px;">✅</span>`;
        return overlay;
    };

    const toggleSelectionMode = () => {
        isSelectionMode = !isSelectionMode;

        if (isSelectionMode) {
            const indicator = document.createElement('div');
            indicator.id = 'selection-mode-indicator';
            indicator.textContent = 'Selection Mode: Active';
            indicator.style.cssText = 'position:absolute;top:0;left:50%;transform:translateX(-50%);background:#333;color:#fff;padding:5px 10px;border-radius:5px;z-index:9999';
            document.body.appendChild(indicator);

            document.querySelectorAll('.saved-image-container[aria-label="Select This Photo"]').forEach(container => {
                container.removeEventListener('click', handleImageClick, true);
                container.addEventListener('click', handleImageClick, true);

                const src = container.querySelector('.hidden-img')?.getAttribute('src');
                if (src && selectedImages.includes(src)) {
                    container.appendChild(createOverlay());
                }
            });

        } else {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedImages));
            document.getElementById('selection-mode-indicator')?.remove();
            document.querySelectorAll('.saved-image-container .overlay').forEach(el => el.remove());
        }
    };

    const handleImageClick = e => {
        if (!isSelectionMode) return;
        e.preventDefault();
        e.stopPropagation();

        const container = e.currentTarget;
        const src = container.querySelector('.hidden-img')?.getAttribute('src');
        if (!src) return;

        const index = selectedImages.indexOf(src);
        if (index !== -1) {
            selectedImages.splice(index, 1);
            container.querySelector('.overlay')?.remove();
        } else {
            selectedImages.push(src);
            container.appendChild(createOverlay());
        }
    };

    const clickThroughSelectedImages = async () => {
        for (const src of selectedImages) {
            try {
                (await waitFor('i.fa.fa-plus')).click();

                const image = await waitFor(() =>
                    [...document.querySelectorAll('.hidden-img')]
                        .find(img => img.getAttribute('src') === src)?.closest('.saved-image-container')
                );
                image.click();

                await delay(500);

                const sendBtn = await waitFor(() => {
                    const btn = document.getElementById('chat-input-send-text-or-saved-photo');
                    return btn?.offsetParent !== null ? btn : null;
                });
                sendBtn.click();

            } catch (err) {
                console.error(`Error sending ${src}:`, err);
            }
        }
    };

    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === ' ') toggleSelectionMode();
        if (e.ctrlKey && e.altKey && !e.repeat) clickThroughSelectedImages();
    });
})();
