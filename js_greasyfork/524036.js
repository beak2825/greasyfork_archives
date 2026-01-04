// ==UserScript==
// @name         LZTVidoPlayer
// @namespace    http://tampermonkey.net/
// @version      v1
// @description  Полностью кастомный видеоплеер для форума
// @author       HashBrute
// @match        https://lolz.live/*
// @match        https://zelenka.guru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=lolz.live
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524036/LZTVidoPlayer.user.js
// @updateURL https://update.greasyfork.org/scripts/524036/LZTVidoPlayer.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const customStyles = `
        .custom-video-container {
            position: relative;
            width: 400px;
            margin: 10px auto;
            background: #000;
            border-radius: 8px;
            overflow: hidden;
        }

        .custom-video-container video {
            width: 100%;
            height: auto;
            display: block;
            background: transparent;
        }

        /* Стилизация стандартных контролов */
        .custom-video-container video::-webkit-media-controls-panel {
            background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 50%, transparent 100%);
            border-radius: 0;
        }

        .custom-video-container video::-webkit-media-controls-play-button,
        .custom-video-container video::-webkit-media-controls-timeline-container,
        .custom-video-container video::-webkit-media-controls-current-time-display,
        .custom-video-container video::-webkit-media-controls-time-remaining-display,
        .custom-video-container video::-webkit-media-controls-mute-button,
        .custom-video-container video::-webkit-media-controls-toggle-closed-captions-button,
        .custom-video-container video::-webkit-media-controls-volume-slider,
        .custom-video-container video::-webkit-media-controls-fullscreen-button {
            color: white;
        }

        .custom-video-container video::-webkit-media-controls-timeline {
            background: rgba(255,255,255,0.2);
            border-radius: 2px;
            height: 3px;
        }

        /* Фикс для мобильных устройств */
        @media (max-width: 768px) {
            .custom-video-container {
                width: 100%;
                max-width: 400px;
            }
        }
    `;

    function createCustomPlayer(video) {
        if (!(video instanceof HTMLVideoElement)) return;
        if (video.hasAttribute('data-custom')) return;

        if (!document.getElementById('custom-video-styles')) {
            const styleSheet = document.createElement('style');
            styleSheet.id = 'custom-video-styles';
            styleSheet.textContent = customStyles;
            document.head.appendChild(styleSheet);
        }

        const container = document.createElement('div');
        container.className = 'custom-video-container';

        const originalControls = video.controls;
        const originalSrc = video.src;
        const originalType = video.getAttribute('type') || '';

        const newVideo = document.createElement('video');
        newVideo.src = originalSrc;
        newVideo.controls = originalControls;
        if (originalType) newVideo.setAttribute('type', originalType);

        newVideo.setAttribute('data-custom', 'true');
        newVideo.setAttribute('playsinline', '');
        newVideo.setAttribute('webkit-playsinline', '');

        container.appendChild(newVideo);
        video.parentNode.replaceChild(container, video);

        newVideo.addEventListener('loadedmetadata', () => {
            newVideo.style.height = 'auto';
        });
    }

    function findAndCustomizeVideos() {
        const videos = document.querySelectorAll('video[src*="nztcdn.com"]:not([data-custom])');
        videos.forEach(createCustomPlayer);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', findAndCustomizeVideos);
    } else {
        findAndCustomizeVideos();
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                findAndCustomizeVideos();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();