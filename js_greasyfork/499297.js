// ==UserScript==
// @name         YouTube Video Selector and Hider
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Quickly select and hide multiple YouTube videos on the subscriptions page using drag to select.
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/499297/YouTube%20Video%20Selector%20and%20Hider.user.js
// @updateURL https://update.greasyfork.org/scripts/499297/YouTube%20Video%20Selector%20and%20Hider.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const MENU_DELAY = 200;
    let isSelecting = false;
    let startX, startY;
    const selectedVideos = new Set();

    // Create hide button
    const hideButton = document.createElement('button');
    hideButton.textContent = 'Hide Selected (0)';
    Object.assign(hideButton.style, {
        position: 'fixed',
        top: '10px',
        right: '10px',
        zIndex: '9999',
        display: 'none',
        padding: '10px',
        backgroundColor: '#ff0000',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
    });
    document.body.appendChild(hideButton);

    // Event listeners
    document.addEventListener('keydown', e => {
        if (e.key.toLowerCase() === 'x' && !isSelecting) {
            isSelecting = true;
            document.body.style.userSelect = 'none';
        }
    });

    document.addEventListener('keyup', e => {
        if (e.key.toLowerCase() === 'x') {
            isSelecting = false;
            document.body.style.userSelect = '';
            removeSelectionBox();
        }
    });

    document.addEventListener('mousedown', e => {
        if (!isSelecting) return;
        startX = e.clientX;
        startY = e.clientY;
        createSelectionBox(startX, startY);
    });

    document.addEventListener('mousemove', e => {
        if (!isSelecting) return;
        const box = document.getElementById('selection-box');
        if (!box) return;

        const width = e.clientX - startX;
        const height = e.clientY - startY;
        Object.assign(box.style, {
            width: Math.abs(width) + 'px',
            height: Math.abs(height) + 'px',
            left: (width < 0 ? e.clientX : startX) + 'px',
            top: (height < 0 ? e.clientY : startY) + 'px'
        });
    });

    document.addEventListener('mouseup', () => {
        if (!isSelecting) return;
        const box = document.getElementById('selection-box');
        if (box) {
            selectVideos(box);
            removeSelectionBox();
        }
    });

    hideButton.addEventListener('click', hideSelectedVideos);

    function createSelectionBox(x, y) {
        removeSelectionBox();
        const box = document.createElement('div');
        box.id = 'selection-box';
        Object.assign(box.style, {
            position: 'fixed',
            border: '2px solid blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            left: x + 'px',
            top: y + 'px',
            zIndex: '9998'
        });
        document.body.appendChild(box);
    }

    function removeSelectionBox() {
        document.getElementById('selection-box')?.remove();
    }

    function selectVideos(box) {
        const boxRect = box.getBoundingClientRect();
        const videos = document.querySelectorAll('ytd-rich-item-renderer');

        videos.forEach(video => {
            const vRect = video.getBoundingClientRect();
            const intersects = !(vRect.right < boxRect.left || vRect.left > boxRect.right ||
                                vRect.bottom < boxRect.top || vRect.top > boxRect.bottom);

            if (intersects) {
                if (selectedVideos.has(video)) {
                    selectedVideos.delete(video);
                    video.style.outline = '';
                } else {
                    selectedVideos.add(video);
                    video.style.outline = '2px solid red';
                }
            }
        });

        hideButton.textContent = `Hide Selected (${selectedVideos.size})`;
        hideButton.style.display = selectedVideos.size > 0 ? 'block' : 'none';
    }

    async function hideSelectedVideos() {
        const total = selectedVideos.size;
        let hidden = 0;

        hideButton.disabled = true;
        hideButton.style.backgroundColor = '#888';

        for (const video of selectedVideos) {
            await hideVideo(video);
            video.style.outline = '';
            hideButton.textContent = `Hiding... (${++hidden}/${total})`;
        }

        selectedVideos.clear();
        hideButton.textContent = `Hidden ${hidden} videos`;
        hideButton.disabled = false;
        hideButton.style.backgroundColor = '#ff0000';

        setTimeout(() => hideButton.style.display = 'none', 2000);
    }

    function hideVideo(video) {
        return new Promise(resolve => {
            const menuButton = video.querySelector('button[aria-label*="åtgärder"], button[aria-label*="actions"], button[aria-label*="More"], button[aria-label*="Fler"], .yt-lockup-metadata-view-model__menu-button button');

            if (!menuButton) {
                resolve();
                return;
            }

            menuButton.click();

            setTimeout(() => {
                const menuItems = document.querySelectorAll('yt-list-item-view-model[role="menuitem"], ytd-menu-service-item-renderer');
                const hideKeywords = ['dölj', 'hide', 'not interested', 'masquer', 'ocultar', 'nascondere', 'скрыть', '隐藏', '非表示'];

                // First try text-based matching
                let hideOption = Array.from(menuItems).find(item => {
                    const text = item.textContent.toLowerCase().trim();
                    return hideKeywords.some(keyword => text.includes(keyword));
                });

                // Fallback: Find by SVG icon (the "not interested" circle with slash)
                if (!hideOption) {
                    hideOption = Array.from(menuItems).find(item => {
                        const svg = item.querySelector('svg');
                        if (!svg) return false;
                        
                        // Check for the specific path that represents the "not interested" icon
                        const path = svg.querySelector('path[d*="M12 2c5.52 0 10 4.48"]');
                        return path !== null;
                    });
                }

                if (hideOption) {
                    hideOption.click();
                } else {
                    document.body.click(); // Close menu
                }

                setTimeout(resolve, 200);
            }, MENU_DELAY);
        });
    }
})();