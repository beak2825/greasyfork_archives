// ==UserScript==
// @name         Platesmania → Google Lens
// @namespace    https://greasyfork.org/users/976031
// @version      1.1.3
// @description  Adds a button to search an image on Google Lens in Platesmania.
// @author       You
// @match        https://platesmania.com/*/add*
// @match        https://www.google.com/*
// @match        https://www.google.*/*
// @grant        GM.setValue
// @grant        GM.getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/535713/Platesmania%20%E2%86%92%20Google%20Lens.user.js
// @updateURL https://update.greasyfork.org/scripts/535713/Platesmania%20%E2%86%92%20Google%20Lens.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ---------- Utils ----------
    const q = (sel, root = document) => root.querySelector(sel);

    // Detect our special Google page via query params (so we don't run on every Google page).
    function isOurGooglePage() {
        try {
            const url = new URL(window.location.href);
            return url.hostname.startsWith('www.google')
            && url.searchParams.has('olud')
            && url.searchParams.get('src') === 'pm';
        } catch {
            return false;
        }
    }

    // ---------- Platesmania integration ----------
    function handlePlatesmania() {
        // Create the button
        const button = document.createElement('button');
        button.style.cssText =
            'margin-bottom:10px;width:100%;height:23px;display:flex;align-items:center;justify-content:center;gap:5px;background-color:#3498db;color:#fff;border:0;cursor:pointer;border-radius:4px;font-weight:400;';

        // Add icon
        const icon = document.createElement('img');
        icon.src = 'https://i.imgur.com/yQsWnZq.png';
        icon.style.cssText = 'max-height:21px;object-fit:contain;';

        // Add text
        const text = document.createElement('span');
        text.textContent = 'Google Lens';

        button.appendChild(icon);
        button.appendChild(text);

        const targetContainer = q('#zoomimgid');

        if (targetContainer) {
            const existingContainer = targetContainer.previousElementSibling;
            if (existingContainer && existingContainer.style.width === '260px') {
                existingContainer.appendChild(button);
            } else {
                const container = document.createElement('div');
                container.style.cssText = 'margin-left:0;width:260px;display:inline-block;';
                container.appendChild(button);
                targetContainer.parentNode.insertBefore(container, targetContainer);
            }
        }

        // Save the image URL once and whenever it changes (no tight polling).
        const img = q('#zoomimg');
        if (img) {
            const save = () => GM.setValue('platesmaniaImage', img.src || '');
            save();
            new MutationObserver(save).observe(img, {
                attributes: true,
                attributeFilter: ['src'],
            });
        }

        // Open Google page with marker params so our other handler knows to run.
        button.addEventListener('click', () => {
            window.open('https://www.google.com/?olud&src=pm', '_blank');
        });
    }

    // ---------- Google page automation (locale-agnostic) ----------
    function handleGoogleImages() {
        let searchAttempted = false;
        let tries = 0;
        const MAX_TRIES = 120; // ~18s at 150ms

        async function attemptSearch() {
            if (searchAttempted) return;

            try {
                const imageData = await GM.getValue('platesmaniaImage', '');
                if (!imageData) return;

                let inputField =
                    q('input[jsname="W7hAGe"]') ||
                    q('input.cB9M7') ||
                    q('input[type="text"]');

                let searchButton =
                    q('div[role="button"][jsname="ZtOxCb"]') ||
                    q('button[type="submit"]') ||
                    q('button,div[role="button"]');

                if (!inputField || !searchButton) return;

                inputField.focus();
                inputField.value = imageData;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                inputField.dispatchEvent(new Event('change', { bubbles: true }));

                searchButton.click();

                setTimeout(() => {
                    if (!searchAttempted) {
                        const ev = new KeyboardEvent('keydown', {
                            bubbles: true,
                            cancelable: true,
                            key: 'Enter',
                            code: 'Enter',
                            which: 13,
                            keyCode: 13,
                        });
                        inputField.dispatchEvent(ev);
                    }
                }, 400);

                searchAttempted = true;
            } catch (error) {
                console.error('Error handling Google Images:', error);
            }
        }

        const searchInterval = setInterval(() => {
            if (searchAttempted || tries++ > MAX_TRIES) {
                clearInterval(searchInterval);
            } else {
                attemptSearch();
            }
        }, 150);

        if (document.readyState !== 'loading') {
            attemptSearch();
        } else {
            document.addEventListener('DOMContentLoaded', attemptSearch, { once: true });
        }
    }

    // ---------- Router ----------
    const href = window.location.href;
    if (/https?:\/\/(?:www\.)?platesmania\.com\//.test(href)) {
        handlePlatesmania();
    } else if (isOurGooglePage()) {
        handleGoogleImages();
    }
})();
