// ==UserScript==
// @name         YouTube Embed Adblock
// @namespace    https://github.com/Sillylittleguy1/Youtube-embed-adblock
// @version      2.4
// @description  Block ads with identical embed player
// @license      MIT
// @match        https://www.youtube.com/watch?*
// @icon         https://github.com/Sillylittleguy1/Youtube-embed-adblock/blob/main/Firefox/icon128.png?raw=true
// @grant        none
// @run-at       document-idle
// @author       Cave johnson
// @supportURL   https://github.com/Sillylittleguy1/Youtube-embed-adblock/issues/new
// @downloadURL https://update.greasyfork.org/scripts/539369/YouTube%20Embed%20Adblock.user.js
// @updateURL https://update.greasyfork.org/scripts/539369/YouTube%20Embed%20Adblock.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("[YT-Embed] Script Loaded");

    const config = {
        playerId: 'player',
        embedClass: 'custom-youtube-embed',
        defaultHeight: '390px',
        aspectRatio: 16 / 9,
        maxHeightOffset: 120,
        autoplay: true,
        bevelSize: '12px'
    };

    function createEmbedPlayer(videoId) {
        const container = document.createElement('div');
        container.className = config.embedClass;

        container.style.cssText = `
            min-height: ${config.defaultHeight};
            height: calc(100vw * ${1 / config.aspectRatio});
            max-height: calc(100vh - ${config.maxHeightOffset}px);
            width: 100%;
            position: relative;
            background-color: #000;
            border-radius: ${config.bevelSize};
            overflow: hidden;
            box-shadow: inset 0 0 ${config.bevelSize} rgba(255, 255, 255, 0.1);
        `;

        const embedUrl = `https://www.youtube.com/embed/${videoId}?${
            config.autoplay ? 'autoplay=1&' : ''
        }rel=0&modestbranding=1&iv_load_policy=3&disablekb=1`;

        const shellHtml = `
            <!DOCTYPE html>
            <html>
            <body style="margin:0;background:#000;">
                <iframe src="${embedUrl}" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" style="border:none;width:100vw;height:100vh;"></iframe>
            </body>
            </html>
        `;

        const blob = new Blob([shellHtml], { type: 'text/html' });
        const blobUrl = URL.createObjectURL(blob);

        const iframe = document.createElement('iframe');
        iframe.src = blobUrl;
        iframe.style.cssText = `
            width: 100%;
            height: 100%;
            border: none;
            display: block;
        `;
        iframe.allowFullscreen = true;

        container.appendChild(iframe);
        return container;
    }

    function stopNativeYouTubePlayer() {
        const moviePlayer = document.getElementById('movie_player');
        if (moviePlayer) {
            try {
                moviePlayer.pauseVideo?.();
                moviePlayer.stopVideo?.();
                moviePlayer.destroy?.();
                moviePlayer.innerHTML = ''; // blank out video tag if needed
            } catch (e) {
                console.warn('[YT-Embed] Failed to destroy movie_player:', e);
            }
        }

        // Also stop any <video> elements that got injected early
        document.querySelectorAll('video').forEach(video => {
            try {
                video.pause();
                video.src = '';
                video.load();
            } catch {}
        });
    }

    function replacePlayer() {
        const videoId = new URLSearchParams(window.location.search).get('v');
        if (!videoId) return;

        const player = document.getElementById(config.playerId);
        if (!player) return;

        if (player.firstChild && player.firstChild.classList?.contains(config.embedClass)) return;

        player.innerHTML = '';
        const embedPlayer = createEmbedPlayer(videoId);
        player.appendChild(embedPlayer);

        // 👇 Kill native player
        stopNativeYouTubePlayer();

        // 👇 Block future re-initialization
        blockYouTubePlayerAPI();
    }

    function muteMainPageAudio() {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return;

        const OriginalAudioContext = AudioCtx;
        function SilentAudioContext(...args) {
            const ctx = new OriginalAudioContext(...args);
            ctx.suspend?.().catch(() => {});
            return ctx;
        }

        SilentAudioContext.prototype = OriginalAudioContext.prototype;
        window.AudioContext = SilentAudioContext;
        window.webkitAudioContext = SilentAudioContext;

        AudioCtx.prototype.resume = () => Promise.resolve();
        AudioCtx.prototype.createGain = () => ({
            gain: { value: 0, setValueAtTime() {}, linearRampToValueAtTime() {} }
        });
    }

    function init() {
        muteMainPageAudio();
        replacePlayer();
        stopNativeYouTubePlayer();

        // Watch for YouTube re-initializing the player
        const observer = new MutationObserver(() => {
            replacePlayer();
        });
        observer.observe(document.body, { childList: true, subtree: true });

        // Also hook into navigation
        const originalPushState = history.pushState;
        history.pushState = function () {
            originalPushState.apply(this, arguments);
            setTimeout(replacePlayer, 500);
        };
        window.addEventListener('popstate', () => setTimeout(replacePlayer, 500));

        // As extra safety: retry for a few seconds after load
        let tries = 0;
        const interval = setInterval(() => {
            if (tries++ > 40) clearInterval(interval); // stop after ~12s
            replacePlayer();
        }, 300);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 300);
    }
})();