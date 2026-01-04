// ==UserScript==
// @name         Instagram Profile Picture Opener
// @namespace    https://github.com/GooglyBlox
// @version      1.3
// @description  Adds a styled context menu option to open Instagram profile pictures in new tab
// @author       GooglyBlox
// @match        https://www.instagram.com/*
// @match        https://www.instagram.com/
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @run-at       document-start
// @inject-into  content
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525719/Instagram%20Profile%20Picture%20Opener.user.js
// @updateURL https://update.greasyfork.org/scripts/525719/Instagram%20Profile%20Picture%20Opener.meta.js
// ==/UserScript==

(function() {
    'use strict';

    GM_addStyle(`
        .ig-custom-context-menu {
            position: fixed;
            z-index: 999999;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(12px);
            border: 1px solid rgba(219, 219, 219, 0.2);
            border-radius: 12px;
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
            padding: 8px;
            min-width: 240px;
            animation: menuFadeIn 0.2s ease-out;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }

        .ig-custom-context-menu-item {
            display: flex;
            align-items: center;
            padding: 12px 16px;
            color: #262626;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            border-radius: 8px;
            transition: all 0.2s ease;
            gap: 12px;
        }

        .ig-custom-context-menu-item:hover {
            background-color: rgba(0, 0, 0, 0.05);
        }

        .ig-custom-context-menu-item svg {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        @keyframes menuFadeIn {
            from {
                opacity: 0;
                transform: scale(0.95);
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }

        .ig-custom-divider {
            height: 1px;
            background: rgba(219, 219, 219, 0.8);
            margin: 8px 4px;
        }

        @media (prefers-color-scheme: dark) {
            .ig-custom-context-menu {
                background: rgba(38, 38, 38, 0.98);
                border-color: rgba(38, 38, 38, 0.2);
            }

            .ig-custom-context-menu-item {
                color: #fafafa;
            }

            .ig-custom-context-menu-item:hover {
                background-color: rgba(255, 255, 255, 0.1);
            }

            .ig-custom-divider {
                background: rgba(38, 38, 38, 0.8);
            }
        }
    `);

    function getHDProfilePicUrl(url) {
        return url;
    }

    const icons = {
        openInNew: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
        </svg>`,
        download: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>`
    };

    function handleContextMenu(event) {
        const img = event.target;

        if (img.tagName === 'IMG' && (
            img.closest('a[href^="/"]') !== null ||
            img.closest('[role="button"]') !== null ||
            img.closest('article') !== null
        )) {
            event.stopPropagation();
            event.preventDefault();

            const existingMenu = document.querySelector('.ig-custom-context-menu');
            if (existingMenu) {
                document.body.removeChild(existingMenu);
            }

            const contextMenu = document.createElement('div');
            contextMenu.className = 'ig-custom-context-menu';

            const rect = event.target.getBoundingClientRect();
            const x = event.clientX;
            const y = event.clientY;

            const menuWidth = 240;
            const menuHeight = 120;
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            const adjustedX = Math.min(x, viewportWidth - menuWidth - 10);
            const adjustedY = Math.min(y, viewportHeight - menuHeight - 10);

            contextMenu.style.left = `${adjustedX}px`;
            contextMenu.style.top = `${adjustedY}px`;

            const openInNewTab = document.createElement('div');
            openInNewTab.className = 'ig-custom-context-menu-item';
            openInNewTab.innerHTML = `${icons.openInNew}Open Profile Picture`;

            openInNewTab.addEventListener('click', () => {
                const hdUrl = getHDProfilePicUrl(img.src);
                window.open(hdUrl, '_blank');
                document.body.removeChild(contextMenu);
            });

            const downloadImage = document.createElement('div');
            downloadImage.className = 'ig-custom-context-menu-item';
            downloadImage.innerHTML = `${icons.download}Download Profile Picture`;

            downloadImage.addEventListener('click', async () => {
                const hdUrl = getHDProfilePicUrl(img.src);
                const username = img.closest('a')?.getAttribute('href')?.replace(/\//g, '') || 'profile';

                try {
                    const response = await fetch(hdUrl);
                    const blob = await response.blob();
                    const blobUrl = window.URL.createObjectURL(blob);

                    const downloadLink = document.createElement('a');
                    downloadLink.href = blobUrl;
                    downloadLink.download = `${username}_profile_picture.jpg`;
                    downloadLink.click();

                    window.URL.revokeObjectURL(blobUrl);
                } catch (error) {
                    console.error('Failed to download image:', error);
                }

                document.body.removeChild(contextMenu);
            });

            contextMenu.appendChild(openInNewTab);
            contextMenu.appendChild(document.createElement('div')).className = 'ig-custom-divider';
            contextMenu.appendChild(downloadImage);

            document.body.appendChild(contextMenu);

            function removeContextMenu(e) {
                if (!contextMenu.contains(e.target)) {
                    document.body.removeChild(contextMenu);
                    document.removeEventListener('click', removeContextMenu);
                    document.removeEventListener('contextmenu', removeContextMenu);
                }
            }

            document.addEventListener('click', removeContextMenu);
            document.addEventListener('contextmenu', removeContextMenu);
        }
    }

    function init() {
        document.addEventListener('contextmenu', handleContextMenu, true);
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                init();
            }
        });
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            observer.observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    } else {
        init();
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
})();