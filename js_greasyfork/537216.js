// ==UserScript==
// @name         Drawaria Drawbot Elemental Animations
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  High-quality elemental animations (Ocean, Magma, Poison, PurpleGoo) with solid bases, outlines, and thematic particles for Drawaria.online
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/537216/Drawaria%20Drawbot%20Elemental%20Animations.user.js
// @updateURL https://update.greasyfork.org/scripts/537216/Drawaria%20Drawbot%20Elemental%20Animations.meta.js
// ==/UserScript==

(() => {
    'use_strict';

    const EL = (sel) => document.querySelector(sel);
    const ELL = (sel) => document.querySelectorAll(sel);

    let drawing_active = false;
    let originalCanvas = null;
    let cw = 0;
    let ch = 0;

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function getRandomFloat(min, max) {
        return Math.random() * (max - min) + min;
    }

    function sendDrawCmd(socket, start, end, color, thickness, isEraser = false, algo = 0) {
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.warn("Bot socket not open.");
            return false;
        }
        const p1x = Math.max(0, Math.min(1, start[0])), p1y = Math.max(0, Math.min(1, start[1]));
        const p2x = Math.max(0, Math.min(1, end[0])), p2y = Math.max(0, Math.min(1, end[1]));
        let numThickness = parseFloat(thickness);
        if (isNaN(numThickness)) {
            console.warn("Invalid thickness provided, defaulting to 10:", thickness);
            numThickness = 10;
        }
        const gT = isEraser ? numThickness : 0 - numThickness;
        socket.send(`42["drawcmd",0,[${p1x},${p1y},${p2x},${p2y},${isEraser},${gT},"${color}",0,0,{"2":${algo},"3":0.5,"4":0.5}]]`);
        return true;
    }

    async function animateElementalWave(type) {
        if (!window.___BOT || !window.___BOT.conn || !window.___BOT.conn.socket || window.___BOT.conn.socket.readyState !== WebSocket.OPEN) {
            alert("Bot not connected.");
            return;
        }
        if (drawing_active) {
            console.log("Animation already in progress.");
            alert("An animation is already running. Please wait for it to finish or clear the canvas.");
            return;
        }
        drawing_active = true;
        const socket = window.___BOT.conn.socket;
        console.log(`Starting ${type} Animation...`);

        let config;
        switch (type) {
            case 'Ocean':
                config = {
                    baseFillColor: '#00008B',
                    waveColors: ['#1E90FF', '#4682B4'],
                    outlineColor: '#AFEEEE',
                    particleColor: '#00FFFF',
                    particleType: 'blob',
                    particleChance: 0.15,
                    particleSizeMin: 0.01,
                    particleSizeMax: 0.03,
                    particleThickness: 8,
                    startHeight: 0.88,
                    waveAmplitude: 0.06,
                    waveFrequency: 2.5,
                    waveSpeed: 0.02,
                    outlineOffset: 0.005,
                    outlineThicknessReduction: 3,
                    mainThickness: 30,
                    waveStyle: 'smooth',
                    frames: 100,
                    frameDelay: 50
                };
                break;
            case 'Magma':
                config = {
                    baseFillColor: '#660000',
                    waveColors: ['#FF2400', '#CC5500'],
                    outlineColor: '#282828',
                    particleColor: '#FFA500',
                    particleType: 'ember',
                    particleChance: 0.2,
                    particleSizeMin: 0.008,
                    particleSizeMax: 0.02,
                    particleThickness: 4,
                    startHeight: 0.86,
                    waveAmplitude: 0.04,
                    waveFrequency: 2,
                    waveSpeed: 0.01,
                    outlineOffset: 0.01,
                    outlineThicknessReduction: 1,
                    mainThickness: 28,
                    waveStyle: 'jagged',
                    frames: 100,
                    frameDelay: 70
                };
                break;
            case 'Poison':
                config = {
                    baseFillColor: '#556B2F',
                    waveColors: ['#6B8E23', '#808000'],
                    outlineColor: '#ADFF2F',
                    particleColor: '#7FFF00',
                    particleType: 'blob',
                    particleChance: 0.25,
                    particleSizeMin: 0.015,
                    particleSizeMax: 0.035,
                    particleThickness: 10,
                    startHeight: 0.87,
                    waveAmplitude: 0.055,
                    waveFrequency: 1.8,
                    waveSpeed: 0.018,
                    outlineOffset: 0.006,
                    outlineThicknessReduction: 2,
                    mainThickness: 26,
                    waveStyle: 'gloopy',
                    frames: 100,
                    frameDelay: 65
                };
                break;
             case 'PurpleGoo':
                config = {
                    baseFillColor: '#4B0082',
                    waveColors: ['#800080', '#9932CC'],
                    outlineColor: '#FF00FF',
                    particleColor: '#DA70D6',
                    particleType: 'blob',
                    particleChance: 0.2,
                    particleSizeMin: 0.01,
                    particleSizeMax: 0.03,
                    particleThickness: 9,
                    startHeight: 0.88,
                    waveAmplitude: 0.05,
                    waveFrequency: 2.2,
                    waveSpeed: 0.022,
                    outlineOffset: 0.007,
                    outlineThicknessReduction: 2,
                    mainThickness: 27,
                    waveStyle: 'jagged',
                    frames: 100,
                    frameDelay: 55
                };
                break;
            default:
                drawing_active = false;
                console.warn(`Unknown animation type: ${type}`);
                return;
        }

        await botClearCanvas();

        const segments = 30;
        const segmentWidth = 1 / segments;

        // --- Draw Solid Base Fill (Alternative approach) ---
        const fillToY = config.startHeight + config.waveAmplitude; // Lowest point of waves
        let currentYFill = 0.99; // Start near the bottom
        const fillStep = 0.05; // How much to move up for each fill line
        const fillThickness = 150; // Drawaria thickness for fill lines

        while (currentYFill > fillToY && drawing_active) {
            if (!sendDrawCmd(socket, [0, currentYFill], [1, currentYFill], config.baseFillColor, fillThickness)) {
                 drawing_active = false; console.error("Failed to draw base segment."); break;
            }
            currentYFill -= fillStep;
            if (config.frameDelay > 0 && fillStep < 0.1) await delay(5); // Small delay only if steps are small
        }
        if (!drawing_active) { console.log("Animation stopped during base fill."); return; }
        await delay(50);


        for (let frame = 0; frame < config.frames && drawing_active; frame++) {
            let wavePoints = [];
            for (let i = 0; i <= segments; i++) {
                const x = i * segmentWidth;
                let yOffset = Math.sin((x * config.waveFrequency * Math.PI) + (frame * config.waveSpeed)) * config.waveAmplitude;

                if (config.waveStyle === 'gloopy') {
                    yOffset += (Math.sin((x * config.waveFrequency * 1.7 * Math.PI) + (frame * config.waveSpeed * 1.3) + 0.5) * config.waveAmplitude * 0.4) * Math.sin(x * Math.PI);
                } else if (config.waveStyle === 'jagged') {
                    yOffset += (Math.random() - 0.5) * config.waveAmplitude * 0.3;
                }
                const y = config.startHeight - yOffset;
                wavePoints.push([x, y]);
            }

            for (let i = 0; i < wavePoints.length - 1 && drawing_active; i++) {
                const p1 = wavePoints[i];
                const p2 = wavePoints[i + 1];
                const waveColor = config.waveColors[i % config.waveColors.length];

                if (!sendDrawCmd(socket, p1, p2, waveColor, config.mainThickness)) {
                    drawing_active = false; break;
                }

                const p1_outline = [p1[0], p1[1] - config.outlineOffset];
                const p2_outline = [p2[0], p2[1] - config.outlineOffset];
                const outlineThickness = Math.max(1, config.mainThickness - config.outlineThicknessReduction);
                if (!sendDrawCmd(socket, p1_outline, p2_outline, config.outlineColor, outlineThickness)) {
                    drawing_active = false; break;
                }

                if (Math.random() < config.particleChance) {
                    const particleX = (p1[0] + p2[0]) / 2 + (Math.random() - 0.5) * 0.05;
                    const particleY = Math.min(p1[1], p2[1]) - 0.02 - Math.random() * 0.08;
                    const particleSize = getRandomFloat(config.particleSizeMin, config.particleSizeMax);

                    if (config.particleType === 'dot') {
                        if (!sendDrawCmd(socket, [particleX, particleY], [particleX + 0.001, particleY + 0.001], config.particleColor, config.particleThickness * (particleSize / config.particleSizeMin))) {
                            drawing_active = false; break;
                        }
                    } else if (config.particleType === 'blob') {
                        let blobPx = particleX;
                        let blobPy = particleY;
                        const blobSegments = getRandomInt(3, 5);
                        for (let k = 0; k < blobSegments && drawing_active; k++) {
                            const nextBlobPx = blobPx + (Math.random() - 0.5) * particleSize;
                            const nextBlobPy = blobPy + (Math.random() - 0.5) * particleSize;
                            if (!sendDrawCmd(socket, [blobPx, blobPy], [nextBlobPx, nextBlobPy], config.particleColor, config.particleThickness)) {
                                drawing_active = false; break;
                            }
                            blobPx = nextBlobPx;
                            blobPy = nextBlobPy;
                        }
                         if (!drawing_active) break;
                        if (blobSegments > 0 && Math.random() < 0.5 && drawing_active) {
                             if (!sendDrawCmd(socket, [blobPx, blobPy], [particleX, particleY], config.particleColor, config.particleThickness)) {
                                drawing_active = false; break;
                            }
                        }
                    } else if (config.particleType === 'ember') {
                        const emberEndX = particleX + (Math.random() - 0.5) * particleSize * 0.5;
                        const emberEndY = particleY - particleSize;
                         if (!sendDrawCmd(socket, [particleX, particleY], [emberEndX, emberEndY], config.particleColor, config.particleThickness)) {
                            drawing_active = false; break;
                        }
                    }
                }
                 if (!drawing_active) break;
            }
             if (!drawing_active) break;

            if (config.frameDelay > 0) await delay(config.frameDelay);
        }

        drawing_active = false;
        console.log(`${type} Animation finished.`);
    }

    async function botClearCanvas() {
        if (!window.___BOT || !window.___BOT.conn || !window.___BOT.conn.socket || window.___BOT.conn.socket.readyState !== WebSocket.OPEN) {
            alert("Bot not connected.");
            return;
        }
        sendDrawCmd(window.___BOT.conn.socket, [0.001, 0.5], [0.999, 0.5], "#FFFFFF", 2000, false);
        console.log("Canvas clear (whiteout) attempted.");
        await delay(200);
    }

    function addBoxIcons() {
        if (document.querySelector('link[href*="boxicons"]')) return;
        let b = document.createElement('link');
        b.href = 'https://unpkg.com/boxicons@2.1.2/css/boxicons.min.css';
        b.rel = 'stylesheet';
        document.head.appendChild(b);
    }

    function createStylesheet() {
        if (document.getElementById('drawaria-elemental-style')) return;
        let s = document.createElement('style');
        s.id = 'drawaria-elemental-style';
        s.innerHTML = `
            #elemental-menu{position:fixed;top:70px;left:10px;width:360px;background-color:#333A44;color:#E0E0E0;border:1px solid #555E69;border-radius:8px;box-shadow:0 5px 15px rgba(0,0,0,0.3);z-index:10001;font-family:'Arial',sans-serif;font-size:14px;display:none}
            #elemental-menu-header{padding:10px 15px;background-color:#4A525E;color:#FFF;cursor:move;border-top-left-radius:7px;border-top-right-radius:7px;display:flex;justify-content:space-between;align-items:center}
            #elemental-menu-header h3{margin:0;font-size:16px;font-weight:bold}
            #elemental-menu-close{background:none;border:none;color:#FFF;font-size:24px;cursor:pointer;padding:0 5px;}
            #elemental-menu-body{padding:15px;max-height:calc(90vh - 50px);overflow-y:auto;background-color:#39414C}
            .elemental-section{margin-bottom:18px;padding-bottom:12px;border-bottom:1px solid #4A525E}
            .elemental-section:last-child{border-bottom:none;margin-bottom:0;}
            .elemental-section h4{margin-top:0;margin-bottom:10px;color:#A0D2EB;font-size:15px;border-bottom:1px solid #4A525E;padding-bottom:5px;}
            .elemental-button-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px}
            .elemental-button{padding:10px 12px;background-color:#4CAF50;color:white;border:none;border-radius:5px;cursor:pointer;text-align:center;font-size:14px;transition:background-color .2s ease, transform .1s ease; display:flex; align-items:center; justify-content:center;}
            .elemental-button i{margin-right:8px; font-size: 1.2em;}
            .elemental-button:hover{background-color:#45a049; transform: translateY(-1px);}
            .elemental-button:active{transform: translateY(0px);}
            .elemental-button.ocean{background-color:#1E90FF;} .elemental-button.ocean:hover{background-color:#187CDA;}
            .elemental-button.magma{background-color:#8B0000;} .elemental-button.magma:hover{background-color:#7A0000;} /* Magma icon is bxs-volcano */
            .elemental-button.poison{background-color:#6B8E23;} .elemental-button.poison:hover{background-color:#5A7D13;}
            .elemental-button.purplegoo{background-color:#800080;} .elemental-button.purplegoo:hover{background-color:#700070;}
            #elemental-toggle-button{margin-left:5px; background-color: #6c757d; color:white;}
            #elemental-toggle-button.active{background-color: #5a6268; box-shadow: inset 0 1px 3px rgba(0,0,0,.2);}
            .elemental-clear-button{padding:10px 12px;background-color:#ff9800;color:white;border:none;border-radius:5px;cursor:pointer;text-align:center;font-size:14px;transition:background-color .2s ease, transform .1s ease;width:100%;margin-top:12px;display:flex; align-items:center; justify-content:center;}
            .elemental-clear-button i{margin-right:8px; font-size: 1.2em;}
            .elemental-clear-button:hover{background-color:#f57c00;transform: translateY(-1px);}
            .elemental-clear-button:active{transform: translateY(0px);}`;
        document.head.appendChild(s);
    }

    function makeDraggable(m, h) {
        let oX, oY, d = false;
        h.onmousedown = e => {
            if (e.target.closest('button,input,select,a')) return;
            d = true;
            oX = e.clientX - m.getBoundingClientRect().left;
            oY = e.clientY - m.getBoundingClientRect().top;
            m.style.userSelect = 'none';
            document.body.style.cursor = 'grabbing';
        };
        document.onmousemove = e => {
            if (!d) return;
            m.style.left = `${e.clientX - oX}px`;
            m.style.top = `${e.clientY - oY}px`;
        };
        document.onmouseup = () => {
            if (d) {
                d = false;
                m.style.userSelect = '';
                document.body.style.cursor = '';
            }
        };
        h.style.cursor = 'move';
    }

    function buildMenu() {
        addBoxIcons();
        createStylesheet();
        const M = document.createElement('div');
        M.id = 'elemental-menu';
        const H = document.createElement('div');
        H.id = 'elemental-menu-header';
        H.innerHTML = `<h3><i class='bx bxs-color-fill' style="margin-right:8px;"></i>Elemental Animations</h3><button id="elemental-menu-close" title="Close Menu"><i class='bx bx-x'></i></button>`;
        M.appendChild(H);
        const B = document.createElement('div');
        B.id = 'elemental-menu-body';
        B.innerHTML = `
            <div class="elemental-section">
                <h4><i class='bx bxs-magic-wand'></i> Animations</h4>
                <div class="elemental-button-grid">
                    <button id="effect-ocean" class="elemental-button ocean" title="Dynamic ocean waves with foamy crests."><i class='bx bxs-droplet'></i> Ocean</button>
                    <button id="effect-magma" class="elemental-button magma" title="Thick, crusty magma flow with embers."><i class='bx bxs-volcano'></i> Magma</button>
                    <button id="effect-poison" class="elemental-button poison" title="Gloopy toxic poison with bubbling blobs."><i class='bx bxs-skull'></i> Poison</button>
                    <button id="effect-purplegoo" class="elemental-button purplegoo" title="Viscous purple goo with magenta highlights."><i class='bx bxs-vial'></i> Purple Goo</button>
                </div>
            </div>
             <div class="elemental-section">
                <h4><i class='bx bx-eraser'></i> Utilities</h4>
                <button id="bot-clear-canvas" class="elemental-clear-button"><i class='bx bxs-eraser'></i> Bot Clear (Whiteout)</button>
            </div>`;
        M.appendChild(B);
        document.body.appendChild(M);
        makeDraggable(M, H);

        EL('#elemental-menu-close').onclick = () => M.style.display = 'none';
        EL('#effect-ocean').onclick = () => animateElementalWave('Ocean');
        EL('#effect-magma').onclick = () => animateElementalWave('Magma');
        EL('#effect-poison').onclick = () => animateElementalWave('Poison');
        EL('#effect-purplegoo').onclick = () => animateElementalWave('PurpleGoo');
        EL('#bot-clear-canvas').onclick = botClearCanvas;

        const chatInputContainer = EL('#chatbox_textinput')?.parentElement;
        if (chatInputContainer && !EL('#elemental-toggle-button')) {
            let tB = document.createElement('button');
            tB.id = 'elemental-toggle-button';
            tB.className = 'btn btn-sm';
            tB.innerHTML = `<i class='bx bx-palette bx-sm'></i>`;
            tB.title = "Toggle Elemental Animations Menu";
            tB.style.marginLeft = "5px";
            tB.onclick = e => {
                e.preventDefault();
                const menu = EL('#elemental-menu');
                menu.style.display = (menu.style.display === 'none' || menu.style.display === '') ? 'block' : 'none';
                tB.classList.toggle('active', menu.style.display === 'block');
            };

            const sendButton = EL('#chatbox_form button[type="submit"], #chatbox_form button:not([id])'); // Try to find the send button
            if (sendButton && sendButton.parentElement) {
                 sendButton.parentElement.insertBefore(tB, sendButton.nextSibling); // Insert after send button
            } else if (chatInputContainer.querySelector('.input-group-append')) {
                 chatInputContainer.querySelector('.input-group-append').appendChild(tB);
            }
            else {
                chatInputContainer.appendChild(tB);
            }
        }
    }

    function initializeWhenReady() {
        originalCanvas = document.getElementById('canvas');
        const cI = document.getElementById('chatbox_textinput');
        if (!originalCanvas || !cI) {
            setTimeout(initializeWhenReady, 500);
            return;
        }
        if (originalCanvas) {
            cw = originalCanvas.width;
            ch = originalCanvas.height;
            console.log(`Canvas dimensions captured: ${cw}x${ch}`);
        }
        console.log("Drawaria Elemental Animations Enhanced V1.6 init...");
        window['___ENGINE'] = { animateElementalWave, botClearCanvas };
        buildMenu();
        console.log("Drawaria Elemental Animations Enhanced V1.6 Loaded!");
    }

    if (document.readyState === "complete" || document.readyState === "interactive") {
        initializeWhenReady();
    } else {
        window.addEventListener('load', initializeWhenReady);
    }
})();