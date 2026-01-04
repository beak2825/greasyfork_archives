// ==UserScript==
// @name         YouTube Matrix Theme & Code Raining Background (Underlay Only)
// @namespace    https://perplexity.ai/
// @version      1.3
// @description  Matrix rain as page background for YouTube - NOT over video or text. Includes Matrix green themed CSS styling.
// @author       TheTechStoner
// @license      MIT
// @match        https://www.youtube.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/543061/YouTube%20Matrix%20Theme%20%20Code%20Raining%20Background%20%28Underlay%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543061/YouTube%20Matrix%20Theme%20%20Code%20Raining%20Background%20%28Underlay%20Only%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Inject CSS ---
    const css = `
    /* Matrix Rain Canvas Overlay: Background Only */
    #matrix-rain-bg {
    position: fixed !important;
    top: 0 !important; left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 0 !important;
    pointer-events: none !important;
    background: transparent !important;
    opacity: 1 !important;
    display: block !important;
    }

    html, body {
    background: transparent !important;
    color: #00ff41 !important;
    }

    body, #page-manager, ytd-app, #app {
    background: #020c06 !important;
    color: #00ff41 !important;
    }

    /* Navbar, Masthead, Sidebar, Menus */
    #masthead, ytd-masthead, #background,
    #guide-content, ytd-guide-entry-renderer, ytd-mini-guide-entry-renderer,
    ytd-guide-section-renderer, ytd-masthead, ytd-popup-container {
    background: #000 !important;
    color: #00ff41 !important;
    }

    /* Video player background */
    #player, #movie_player, .html5-video-player {
    background: #000 !important;
    }

    h1, h2, h3, h4, h5, h6,
    #info-strings, .ytd-video-primary-info-renderer, .ytd-video-secondary-info-renderer,
    .yt-simple-endpoint, .yt-formatted-string, .ytd-channel-name, .ytd-metadata-row-renderer {
    color: #00ff41 !important;
    text-shadow: 0 0 4px #008f11, 0 0 8px #012d13;
    }

    .yt-spec-button-shape-next,
    .yt-spec-button-shape-next--mono,
    .yt-spec-button-shape-next--tonal,
    .yt-spec-button-shape-next--filled {
    background: #012d13 !important;
    color: #00ff41 !important;
    border: 1px solid #00ff41 !important;
    box-shadow: 0 0 6px #0f0;
    }
    .yt-spec-button-shape-next:hover {
    background: #00ff41 !important;
    color: #000 !important;
    }

    a, .yt-simple-endpoint, .yt-simple-endpoint:visited {
    color: #00ff41 !important;
    text-shadow: 0 0 6px #0f0;
    }
    a:hover {
    color: #9effa9 !important;
    }
    ::-webkit-scrollbar {
    background: #000 !important; width: 12px;
    }
    ::-webkit-scrollbar-thumb {
    background: #003d1a !important;
    border-radius: 6px; box-shadow: 0 0 8px #00ff41;
    }

    input, textarea, .ytd-searchbox, .yt-spec-input {
    background: #002913 !important;
    color: #00ff41 !important;
    border: 1px solid #00ff41 !important;
    }
    input::placeholder, textarea::placeholder {
    color: #00ff41cc !important;
    }

    #comments, ytd-comments, ytd-comment-renderer {
    background: #000 !important;
    color: #00ff41 !important;
    border: none !important;
    }

    ytd-compact-video-renderer, ytd-video-renderer {
    background: #010 !important;
    color: #00ff41 !important;
    border-bottom: 1px solid #083a24 !important;
    }

    @keyframes matrix-glow {
    0%, 100% { text-shadow: 0 0 4px #00ff41, 0 0 8px #008f11; }
    50% { text-shadow: 0 0 6px #0f0, 0 0 12px #00ff41, 0 0 24px #00ff41; }
    }
    h1, h2, h3, h4, h5, h6 {
    animation: matrix-glow 3s infinite alternate;
    }
    `;

    function injectCSS(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }
    injectCSS(css);

    // --- Matrix Rain Canvas Logic (unchanged) ---
    function getMainContainer() {
        return document.getElementById('page-manager') ||
               document.querySelector('ytd-app') ||
               document.body;
    }

    function ensureCanvas() {
        let canvas = document.getElementById('matrix-rain-bg');
        if (!canvas) {
            canvas = document.createElement('canvas');
            canvas.id = 'matrix-rain-bg';
            const parent = getMainContainer();
            if (parent.firstChild) {
                parent.insertBefore(canvas, parent.firstChild);
            } else {
                parent.appendChild(canvas);
            }
        }
        return canvas;
    }

    function resizeCanvas(canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    // The matrix code
    let canvas = ensureCanvas();
    resizeCanvas(canvas);
    window.addEventListener('resize', () => resizeCanvas(canvas));
    window.addEventListener('orientationchange', () => resizeCanvas(canvas));

    // Matrix rain vars
    const ctx = canvas.getContext('2d');
    const fontSize = 18;
    let columns = Math.floor(window.innerWidth / fontSize);
    let drops = Array.from({length: columns}, () => Math.random() * window.innerHeight / fontSize);
    const matrixChars = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズヅブプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&*';
    const chars = matrixChars.split('');

    function draw() {
        ctx.fillStyle = 'rgba(2,12,6, 0.19)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.font = fontSize + 'px monospace';
        ctx.textAlign = 'center';
        for (let i = 0; i < columns; i++) {
            let char = chars[Math.floor(Math.random() * chars.length)];
            ctx.shadowColor = '#08ff15';
            ctx.shadowBlur = 8;
            ctx.fillStyle = '#00ff41';
            ctx.fillText(char, i * fontSize + fontSize / 2, drops[i] * fontSize);
            if (drops[i] * fontSize > canvas.height && Math.random() > 0.975)
                drops[i] = 0;
            else
                drops[i]++;
        }
        ctx.shadowBlur = 0;
    }
    setInterval(draw, 50);

    // Update columns when window size changes
    function updateDrops() {
        columns = Math.floor(window.innerWidth / fontSize);
        drops = Array.from({length: columns}, () =>
            Math.random() * window.innerHeight / fontSize
        );
    }
    window.addEventListener('resize', updateDrops);
    window.addEventListener('orientationchange', updateDrops);

    // Mutations: keep canvas as first child of main container if YouTube changes DOM
    setInterval(function() {
        const parent = getMainContainer();
        let canvas = document.getElementById('matrix-rain-bg');
        if (!canvas || canvas.parentNode !== parent || parent.firstChild !== canvas) {
            if (canvas) canvas.remove();
            canvas = document.createElement('canvas');
            canvas.id = 'matrix-rain-bg';
            if (parent.firstChild) {
                parent.insertBefore(canvas, parent.firstChild);
            } else {
                parent.appendChild(canvas);
            }
            resizeCanvas(canvas); // reset canvas!
        }
    }, 3000);
})();
