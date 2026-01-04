// ==UserScript==
// @name         Drawaria.online Ultimate Matrix Theme (Final)
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  Transforms Drawaria.online with realistic Matrix code rain, glowing UI, auto-scrolling chat, and a master toggle button.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541639/Drawariaonline%20Ultimate%20Matrix%20Theme%20%28Final%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541639/Drawariaonline%20Ultimate%20Matrix%20Theme%20%28Final%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global variables to hold theme elements for easy removal ---
    let matrixCanvas = null;
    let matrixStyleElement = null;
    let musicToggleButton = null;
    let chatObserver = null; // Variable to hold the chat observer
    let isThemeActive = false;

    // --- 1. THEME ACTIVATION FUNCTION ---
    function activateTheme() {
        if (isThemeActive) return; // Prevent re-activation

        // A. Setup Canvas Rain
        setupMatrixRain();

        // B. Inject CSS Styles
        matrixStyleElement = GM_addStyle(`
            /* Base Body and HTML */
            html, body {
                height: 100%;
                overflow: hidden;
                background: transparent !important; /* Changed from #000 to transparent */
            }
            body::before, body::after { content: none !important; }

            /* Global Text Color and Shadow for Matrix Glow */
            body, #main, #leftbar, #rightbar, .loginbox, .btn, .playerlist-row, .roomlist-item,
            .chatbox_messages, .bubble, .modal-content, .form-control, .input-group-text,
            h1, h2, h3, h4, h5, h6, span, a, div, td {
                color: #0F0 !important;
                text-shadow: 0 0 5px rgba(0, 255, 0, 0.7), 0 0 10px rgba(0, 255, 0, 0.5);
                font-family: 'Consolas', 'Monaco', 'Lucida Console', monospace !important;
            }

            /* --- NEW: Specific Drawaria Color Overrides --- */
            .playerlist-drawerhighlight {
                background-color: rgba(0, 255, 0, 0.4) !important;
                box-shadow: 0 0 25px rgba(0, 255, 0, 1), inset 0 0 15px rgba(150, 255, 150, 0.7) !important;
            }
            .playerchatmessage-highlightable:hover, .playerchatmessage-highlighted,
            .customvotingbox-highlighted, #roomlist .roomlist-highlight {
                background-color: rgba(0, 255, 0, 0.2) !important;
            }
            .playerlist-name-self a, .playerlist-name-self a:hover { color: #5eff5e !important; text-shadow: 0 0 10px #5eff5e !important; }
            .playerlist-rank-first { color: #9dff9d !important; }
            .systemchatmessage1, .systemchatmessage2, .systemchatmessage3, .systemchatmessage4, .systemchatmessage5,
            .systemchatmessage6, .systemchatmessage7, .systemchatmessage8, .systemchatmessage9 {
                background: none !important;
                color: #9dff9d !important;
                font-style: italic;
            }
            #continueautosaved-run, #continueautosaved-clear, .discordlink {
                background-color: rgba(0, 100, 0, 0.7) !important;
            }
            #continueautosaved-run:hover, #continueautosaved-clear:hover, .discordlink:hover {
                background-color: rgba(0, 150, 0, 0.9) !important;
            }
            /* --- End of Specific Overrides --- */

            /* Interface Enhancements & Animations */
            .modal-content, .card-body { background-color: rgba(0, 0, 0, 0.95) !important; }
            .modal-header, .modal-footer { background-color: rgba(0, 50, 0, 0.5) !important; border-color: rgba(0, 255, 0, 0.3) !important; box-shadow: none !important; }
            #leftbar, #rightbar, .loginbox, .roomlist-item, .modal-dialog .modal-content,
            .topbox-content, .accountbox-coins, .playerlist-infobox-notlogged, .chatbox_messages,
            .playerlist-medal, .playerlist-star, .tokenicon, .drawcontrols-colorpicker,
            #customvotingbox, .accountbox-exp-progress-bg, .accountbox-exp-progress-bar,
            .accountbox-itemscontainer-slot, .inventorydlg-groupview, .inventorydlg-shoplist,
            .inventorydlg-addcoinsview, .musictracks-newtrackbox, .playerlist-turnscore {
                background-color: rgba(0, 50, 0, 0.4) !important;
                border: 1px solid #0F0 !important;
                box-shadow: 0 0 10px rgba(0, 255, 0, 0.5), inset 0 0 5px rgba(0, 255, 0, 0.3) !important;
                border-radius: 8px !important;
                transition: all 0.3s ease-in-out;
            }
            #leftbar, #rightbar, .loginbox { background-color: rgba(0, 50, 0, 0.6) !important; }
            #roomlist, #roomlist .roomlist-header { background: rgba(0, 0, 0, 0.9) !important; border-color: #0F0 !important; box-shadow: 0 0 10px rgba(0, 255, 0, 0.5) !important; }
            .btn, button, input[type="submit"] { background-color: rgba(0, 100, 0, 0.7) !important; border-color: #0F0 !important; color: #0F0 !important; text-shadow: 0 0 5px rgba(0, 255, 0, 0.8) !important; box-shadow: 0 0 8px rgba(0, 255, 0, 0.6) !important; transition: all 0.3s ease-in-out; }
            .btn:hover, button:hover, input[type="submit"]:hover { background-color: rgba(0, 150, 0, 0.9) !important; box-shadow: 0 0 15px rgba(0, 255, 0, 0.9), inset 0 0 7px rgba(0, 255, 0, 0.5) !important; transform: translateY(-2px); }
            .btn:active, button:active, input[type="submit"]:active { background-color: rgba(0, 200, 0, 1) !important; box-shadow: 0 0 20px rgba(0, 255, 0, 1), inset 0 0 10px rgba(0, 255, 0, 0.7) !important; transform: translateY(0); }
            input[type="text"], textarea, select { background-color: rgba(0, 20, 0, 0.8) !important; border: 1px solid #0F0 !important; color: #0F0 !important; text-shadow: 0 0 3px rgba(0, 255, 0, 0.7); box-shadow: inset 0 0 5px rgba(0, 255, 0, 0.5); transition: all 0.3s ease-in-out; }
            input[type="text"]:focus, textarea:focus, select:focus { outline: none !important; box-shadow: inset 0 0 10px rgba(0, 255, 0, 0.9), 0 0 15px rgba(0, 255, 0, 0.7); }
.sitelogo img {
  /* Usado para mantener consistencia, ajusta hue-rotate según necesites */
  filter: brightness(1) hue-rotate(100deg) saturate(2);
  transition: filter 0.5s ease-in-out;
}
.sitelogo img:hover {
  /* Ajusta hue-rotate para verde más puro, sube saturate si necesitas más intensidad */
  filter: brightness(1) hue-rotate(120deg) saturate(2);
}

            /* Hide original backgrounds that conflict */
            body[style*="background:url(/img/pattern.png)"], [style*="background:#f1f9f5"], [style*="background:#0087ff"], [style*="background:#00b7ff"], [style*="background:rgba(0,183,255,.3)"], [style*="background:#e1e1e1"], [style*="background:rgba(255,255,255,0.2)"], [style*="background:beige"], [style*="background:#ffffe5"], [style*="background:#ffeb3b"] { background: none !important; background-color: transparent !important; box-shadow: none !important; border-color: transparent !important; }

            /* Particles for a subtle glow effect */
            .matrix-particle { position: absolute; background: rgba(0, 255, 0, 0.7); border-radius: 50%; opacity: 0; pointer-events: none; box-shadow: 0 0 10px rgba(0, 255, 0, 0.9); animation: particleFade 2s forwards infinite; width: 5px; height: 5px; transform: translate(-50%, -50%); }
            @keyframes particleFade { 0% { transform: scale(0.1); opacity: 0; } 50% { transform: scale(1); opacity: 0.7; } 100% { transform: scale(0.1); opacity: 0; } }
        `);

        // C. Add Particles to UI Elements
        addParticles();

        // D. Create and show the Music Toggle Button
        createMusicButton();

        // E. Activate Chat Auto-Scroller
        activateChatScroller();

        isThemeActive = true;
    }

    // --- 2. THEME DEACTIVATION FUNCTION ---
    function deactivateTheme() {
        if (!isThemeActive) return;

        // A. Remove Canvas
        if (matrixCanvas) { matrixCanvas.remove(); matrixCanvas = null; }

        // B. Remove Injected Stylesheet
        if (matrixStyleElement) { matrixStyleElement.remove(); matrixStyleElement = null; }

        // C. Remove all added particles
        document.querySelectorAll('.matrix-particle').forEach(p => p.remove());

        // D. Remove Music Toggle Button
        if (musicToggleButton) { musicToggleButton.remove(); musicToggleButton = null; }

        // E. Deactivate Chat Scroller
        if (chatObserver) { chatObserver.disconnect(); chatObserver = null; }

        // F. Stop music if playing
        if (audio.backgroundMusic) { audio.backgroundMusic.pause(); }

        isThemeActive = false;
    }

    // --- 3. HELPER FUNCTIONS ---

    // Matrix Rain Logic (no changes needed)
    function setupMatrixRain() {
        matrixCanvas = document.createElement('canvas');
        matrixCanvas.id = 'matrixBackgroundCanvas';
        matrixCanvas.style.cssText = 'position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; z-index: -100;';
        document.body.appendChild(matrixCanvas);

        const ctx = matrixCanvas.getContext('2d');
        let W, H;
        let streams = [];
        const fontSize = 16;
        const characters = '0123456789';

        class Stream {
            constructor(x) { this.x = x; this.y = Math.random() * -H; this.speed = Math.random() * 5 + 2; this.length = Math.floor(Math.random() * 20) + 10; this.symbols = []; }
            generateSymbols() { this.symbols = []; for (let i = 0; i < this.length; i++) { this.symbols.push(characters.charAt(Math.floor(Math.random() * characters.length))); } }
            draw() {
                this.symbols.forEach((symbol, index) => {
                    if (index === 0) { ctx.fillStyle = '#cfffc1'; ctx.shadowBlur = 10; ctx.shadowColor = 'rgba(200, 255, 200, 0.9)'; }
                    else { const opacity = 1 - (index / this.length) * 0.9; ctx.fillStyle = `rgba(0, 255, 0, ${opacity})`; ctx.shadowBlur = 5; ctx.shadowColor = `rgba(0, 255, 0, ${opacity * 0.7})`; }
                    ctx.fillText(symbol, this.x, this.y - index * fontSize);
                });
                ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; this.update();
            }
            update() { this.y += this.speed; if (this.y - this.length * fontSize > H) { this.y = Math.random() * -H * 0.5; this.speed = Math.random() * 5 + 2; this.length = Math.floor(Math.random() * 20) + 10; this.generateSymbols(); } }
        }

        function initialize() {
            W = matrixCanvas.width = window.innerWidth; H = matrixCanvas.height = window.innerHeight;
            let columns = Math.floor(W / fontSize); streams = [];
            for (let i = 0; i < columns; i++) { const stream = new Stream(i * fontSize); stream.generateSymbols(); streams.push(stream); }
            ctx.font = `${fontSize}px monospace`;
        }
        window.addEventListener('resize', initialize); initialize();
        function animate() {
            if (!matrixCanvas) return; // Stop animation if canvas is removed
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)'; ctx.fillRect(0, 0, W, H);
            streams.forEach(stream => stream.draw()); requestAnimationFrame(animate);
        }
        animate();
    }

    // Particle creation logic
    function addParticles() {
        // Added 'body' to the list of elements for glow
        const elementsForGlow = document.querySelectorAll('body, #quickplay, #createroom, #joinplayground, .btn, #login-midcol, #login-rightcol, #leftbar, #rightbar, .roomlist-item, .playerlist-row');
        elementsForGlow.forEach(el => {
            if (window.getComputedStyle(el).position === 'static') { el.style.position = 'relative'; }
            el.style.overflow = 'hidden';
            for (let i = 0; i < 3; i++) {
                const particle = document.createElement('div');
                particle.className = 'matrix-particle';
                particle.style.left = `${Math.random() * 100}%`;
                particle.style.top = `${Math.random() * 100}%`;
                particle.style.animationDelay = `${Math.random() * 2}s`;
                el.appendChild(particle);
            }
        });
    }

    // Music button creation
    function createMusicButton() {
        musicToggleButton = document.createElement('button');
        musicToggleButton.innerHTML = 'Toggle Matrix Music';
        musicToggleButton.style.cssText = `position: fixed; bottom: 20px; left: 20px; z-index: 10000; background-color: rgba(0, 100, 0, 0.8) !important; color: #0F0 !important; border: 1px solid #0F0 !important; padding: 10px; border-radius: 5px; cursor: pointer; text-shadow: 0 0 5px rgba(0, 255, 0, 0.7);`;
        document.body.appendChild(musicToggleButton);

        musicToggleButton.addEventListener('click', () => {
            if (audio.backgroundMusic) {
                if (!audio.backgroundMusic.paused) {
                    audio.backgroundMusic.pause(); musicToggleButton.textContent = 'Play Matrix Music';
                } else {
                    playMusic(); musicToggleButton.textContent = 'Pause Matrix Music';
                }
            }
        });
        // Update button text after initial load
        setTimeout(() => {
            if (audio.backgroundMusic && !audio.backgroundMusic.paused) { musicToggleButton.textContent = 'Pause Matrix Music'; }
        }, 500);
    }

    // NEW: Chat Auto-Scroller function
    function activateChatScroller() {
        const chatBox = document.getElementById('chatbox_messages');
        if (!chatBox) return;

        // Function to scroll to the bottom
        const scrollToBottom = () => {
            chatBox.scrollTop = chatBox.scrollHeight;
        };

        // Initial scroll to bottom
        scrollToBottom();

        // Create an observer to watch for new messages
        chatObserver = new MutationObserver(scrollToBottom);

        // Start observing the chat box for new child elements (messages)
        chatObserver.observe(chatBox, { childList: true });
    }

    // --- 4. Music and Sound Effects Framework ---
    const audio = { backgroundMusic: null, soundEffect: null };
    function loadAudio() {
        audio.backgroundMusic = new Audio('https://www.myinstants.com/media/sounds/matrix-new.mp3');
        audio.backgroundMusic.loop = true; audio.backgroundMusic.volume = 0.2;
        audio.soundEffect = new Audio('https://freesound.org/data/previews/387/387222_3879201-lq.mp3');
        audio.soundEffect.volume = 0.5;
    }
    function playMusic() { if (audio.backgroundMusic && audio.backgroundMusic.paused) { audio.backgroundMusic.play().catch(e => console.log("Music play failed:", e)); } }
    function playSound() { if (audio.soundEffect) { audio.soundEffect.currentTime = 0; audio.soundEffect.play().catch(e => console.log("Sound effect play failed:", e)); } }

    // --- 5. INITIALIZATION ---
    window.addEventListener('load', () => {
        // Create the master toggle button
        const masterToggleButton = document.createElement('button');
        masterToggleButton.id = 'theme-toggle-button';
        masterToggleButton.style.cssText = `position: fixed; bottom: 20px; right: 20px; z-index: 10001; background-color: #000 !important; color: #0F0 !important; border: 2px solid #0F0 !important; padding: 12px; border-radius: 8px; cursor: pointer; font-family: monospace; font-weight: bold; text-shadow: 0 0 8px #0F0;`;
        document.body.appendChild(masterToggleButton);

        masterToggleButton.addEventListener('click', () => {
            if (isThemeActive) {
                deactivateTheme();
                masterToggleButton.textContent = 'Activate Matrix Theme';
            } else {
                activateTheme();
                masterToggleButton.textContent = 'Deactivate Matrix Theme';
            }
        });

        // Load audio assets
        loadAudio();
        // Try to play music on first interaction AFTER theme is active
        document.body.addEventListener('click', () => { if(isThemeActive) playMusic() }, { once: true });
        document.body.addEventListener('keypress', () => { if(isThemeActive) playMusic() }, { once: true });

        // Initial state: Activate the theme by default
        activateTheme();
        masterToggleButton.textContent = 'Deactivate Matrix Theme';

        console.log('Drawaria.online Ultimate Matrix Theme v2.2 (Final) Activated!');
    });
})();