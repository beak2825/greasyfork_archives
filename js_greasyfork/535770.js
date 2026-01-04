// ==UserScript==
// @name         SLITHER.IO MOD MENU - DSC.GG/143X - DAMNBRUH ZOOM (FIXING) 11/9
// @namespace    http://tampermonkey.net/
// @version      X24 - GreasyFork - DB Zoom (FIX)
// @description  Ultimate Slither.io Mod Menu with Chat & Custom UI - Fixed chat toggle and simplify - Enhanced Visuals
// @author       GITHUB.COM/DXXTHLY - HTTPS://DSC.GG/143X by: dxxthly. & waynesg on Discord
// @icon         https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQUNcRl2Rh40pZLhgffYGFDRLbYJ4qfMNwddQ&s.png
// @match        http://slither.io/
// @match        https://slither.io/
// @match        http://slither.com/io
// @match        https://slither.com/io
// @match        https://www.damnbruh.com
// @match        https://www.damnbruh.com/*
// @match        http://www.damnbruh.com/*
// @match        *//www.damnbruh.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535770/SLITHERIO%20MOD%20MENU%20-%20DSCGG143X%20-%20DAMNBRUH%20ZOOM%20%28FIXING%29%20119.user.js
// @updateURL https://update.greasyfork.org/scripts/535770/SLITHERIO%20MOD%20MENU%20-%20DSCGG143X%20-%20DAMNBRUH%20ZOOM%20%28FIXING%29%20119.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const isDamnBruh = window.location.hostname.includes('damnbruh.com');

    // --- NEW: THE UNBREAKABLE GUARDIAN ---
    // This injects a high-priority stylesheet to override any malicious CSS.
    (function createGuardianStylesheet() {
        const guardianStyle = document.createElement('style');
        guardianStyle.id = 'mod-guardian-styles';
        // The '!important' flag ensures these rules win against any injected styles.
        guardianStyle.textContent = `
            html {
                filter: none !important;
                transform: none !important;
            }
            body {
                transform: none !important;
            }
        `;
        (document.head || document.documentElement).appendChild(guardianStyle);
        console.log('Guardian Stylesheet is active.');
    })();


    (function() {
        if (isDamnBruh) {
            document.addEventListener("wheel", e => {
                // If the user is holding Ctrl, stop the event from reaching the game's blocking listener.
                if (e.ctrlKey) {
                    e.stopImmediatePropagation();
                }
            }, true); // The 'true' is critical - it makes this run first.
            console.log('DamnBruh browser zoom fix is active.');
        }
    })();



    function sanitizeInput(str) {
        if (typeof str !== 'string') return '';
        // This regular expression finds and removes any '<' or '>' characters.
        return str.replace(/[<>]/g, '');
    }

    // === NEW HELPER FUNCTION for color manipulation ===
    function adjustColor(hex, percent) {
        let r = parseInt(hex.slice(1, 3), 16),
            g = parseInt(hex.slice(3, 5), 16),
            b = parseInt(hex.slice(5, 7), 16);

        r = Math.min(255, Math.max(0, r + (r * percent / 100)));
        g = Math.min(255, Math.max(0, g + (g * percent / 100)));
        b = Math.min(255, Math.max(0, b + (b * percent / 100)));

        return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g).toString(16).padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`;
    }

    // === DAMNBRUH.COM SPECIFIC FEATURES ===
    function initializeDamnBruhZoom() {
        console.log('DamnBruh Zoom Feature: Initializing...');

        // Configuration is now part of the function
        const ZOOM_SPEED = 0.1;
        const MIN_ZOOM = 0.25;
        const MAX_ZOOM = 2.5;

        let gameCanvas = null;
        let localZoomFactor = 1.0; // Use a local variable to not conflict with slither's zoom

        // 1. Mouse Wheel Listener
        document.addEventListener('wheel', function(event) {
            // Only run if the feature is enabled in the menu and we're on the right site
            if (!state.features.damnbruhZoom || !gameCanvas) return;

            event.preventDefault();

            if (event.deltaY < 0) {
                localZoomFactor += ZOOM_SPEED;
            } else {
                localZoomFactor -= ZOOM_SPEED;
            }
            localZoomFactor = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, localZoomFactor));

        }, { passive: false });

        // 2. The Render Loop to apply zoom
        function applyZoom() {
            if (gameCanvas && state.features.damnbruhZoom) {
                gameCanvas.style.transformOrigin = 'center center';
                gameCanvas.style.transform = `scale(${localZoomFactor})`;
            } else if (gameCanvas && !state.features.damnbruhZoom) {
                // If the feature is toggled off, reset the zoom
                gameCanvas.style.transform = 'scale(1.0)';
            }
            requestAnimationFrame(applyZoom);
        }

        // 3. The Observer to find the canvas
        const observer = new MutationObserver((mutations) => {
            if (gameCanvas) {
                observer.disconnect();
                return;
            }
            for (const mutation of mutations) {
                for (const node of mutation.addedNodes) {
                    if (node.nodeType === 1) {
                        let found = (node.tagName === 'CANVAS') ? node : node.querySelector('canvas');
                        if (found) {
                            console.log('DamnBruh Zoom Feature: Game Canvas FOUND!');
                            gameCanvas = found;
                            gameCanvas.style.position = 'absolute'; // Ensure positioning is correct
                            observer.disconnect();
                            return;
                        }
                    }
                }
            }
        });

        // 4. Start the observer and the loop
        observer.observe(document.body, { childList: true, subtree: true });
        applyZoom();
    }


    // === CONFIG ===
    const config = {
        currentVersion: 'BETA 6.0.2 - VX24',
        menuPosition: 'right',
        defaultCircleRadius: 150,
        circleRadiusStep: 20,
        minCircleRadius: 50,
        maxCircleRadius: 300,
        // --- NEW: GIPHY API Key for GIF feature ---
        giphyApiKey: 'xWBhUx8jBtCxxjPHvtUzHLZlPGYBUTFq', // This is a public key from GIPHY's examples
        deathSoundURL: 'https://audio.jukehost.co.uk/WwASzZ0a1wJDKubIcoZzin8J7kycCt5l.mp3',
        godModeVideoURL: 'https://youtu.be/ghAap5IWu1Y',
        defaultMenuName: 'DSC.GG/143X',
        defaultMenuColor: '#4CAF50', // Main accent color
        chatMaxMessages: 50,
        chatMaxMessageLength: 100,
        chatProfanityFilter: true,
        chatProfanityList: ['fuck', 'shit', 'asshole', 'bitch', 'cunt', 'nigger', 'fag', 'retard'],


        repMilestones: {
            0: { name: 'Unranked', icon: '🌱' },
            100: { name: 'Bronze Slither', icon: '🥉' },
            500: { name: 'Silver Snake', icon: '🥈' },
            1000: { name: 'Gold Serpent', icon: '🥇' },
            2500: { name: 'Platinum Python', icon: '💠' },
            5000: { name: 'Diamond Drake', icon: '💎' },
            10000: { name: 'Master Mamba', icon: '🏆' },
            25000: { name: 'Grandmaster Naga', icon: '⚜️' },
            50000: { name: 'Apex Anaconda', icon: '🐍' },
            100000: { name: 'Mythic Ouroboros', icon: '🌀' },
            500000: { name: 'Slither Titan', icon: '☄️' },
            1000000: { name: 'Slither God', icon: '👑' }
        }
    };

    // --- CHALLENGE CONFIGURATION ---
    const WEEKLY_RESET_MS = 7 * 24 * 60 * 60 * 1000; // 7 Days in milliseconds
    let completedChallenges = new Set();

    // --- CHALLENGE CONFIGURATION (BOOSTED REWARDS) ---
    const challengeList = [
        { id: 'score_1000',  name: 'Worm',        desc: 'Reach 1,000 Mass',        reqType: 'score', reqVal: 1000,  reward: 100 },
        { id: 'score_5000',  name: 'Python',      desc: 'Reach 5,000 Mass',        reqType: 'score', reqVal: 5000,  reward: 500 },
        { id: 'score_10000', name: 'Anaconda',    desc: 'Reach 10,000 Mass',       reqType: 'score', reqVal: 10000, reward: 1500 },
        { id: 'score_25000', name: 'Titan',       desc: 'Reach 25,000 Mass',       reqType: 'score', reqVal: 25000, reward: 3200 },
        { id: 'score_50000', name: 'Demi-God',    desc: 'Reach 50,000 Mass',       reqType: 'score', reqVal: 50000, reward: 7500 },
        { id: 'kill_10',     name: 'Assassin',    desc: 'Kill 10 Snakes (1 life)', reqType: 'kill',  reqVal: 10,    reward: 250 },
        { id: 'kill_50',     name: 'Terminator',  desc: 'Kill 50 Snakes (1 life)', reqType: 'kill',  reqVal: 50,    reward: 2500 }
    ];

    // === STATE ===
    const state = {
        versionStatus: 'Checking...',
        showEnemyStats: true,
        keybinds: JSON.parse(localStorage.getItem('modKeybinds')) || {
            savedBgUrl: localStorage.getItem('modCustomBgUrl') || '',
            toggleMenu: 'm',
            toggleKeybinds: '-',
            circleRestriction: 'k',
            circleSmaller: 'j',
            circleLarger: 'l',
            autoCircle: 'a',
            autoBoost: 'b',
            toggleEsp: 'h',
            fpsDisplay: 'f',
            autoRespawn: 's',
            neonLine: 'e',
            foodBot: 'x',
            deathSound: 'v',
            showServer: 't',
            chatEnabled: '/',
            zoomIn: 'z',
            zoomOut: 'x',
            zoomReset: 'c',
            screenshot: 'p',
            github: 'g',
            discord: 'd',
            godMode: 'y',
            reddit: 'r',
            spotify: 'n'
        },

        features: {
            visualMode: 'none',
            circleRestriction: false,
            autoCircle: false,
            performanceMode: 1,
            deathSound: true,
            esp: false,
            snakeTrail: false,
            snakeTrailColor: '#FFD700',
            fpsDisplay: false,
            autoBoost: false,
            neonLine: false,
            neonLineColor: '#00ffff',
            foodBot: false,
            chatFocus: false,
            showServer: false,
            autoRespawn: false,
            chatVisible: true,
            chatEnabled: true,
            chatProfanityFilter: config.chatProfanityFilter,
            keybindsEnabled: true,
            blackBg: false,
            damnbruhZoom: false,
            discoSkin: false,
            fakeSize: false,
            tacticalRadar: false, // The Raycast
            boostMonitor: false,  // The Boost Detector
            preyPredictor: false, // The Food Predictor
            // --- NEW REAL MODS ---
            predatorESP: false, // High visibility ESP
            spinBot: false      // Aggressive movement hack
        },
        menuVisible: true,
        zoomFactor: 1.0,
        circleRadius: config.defaultCircleRadius,
        fps: 0,
        fpsFrames: 0,
        fpsLastCheck: Date.now(),
        deathSound: new Audio(config.deathSoundURL),
        isInGame: false,
        boosting: false,
        autoCircleAngle: 0,
        ping: 0,
        server: '',
        lastSnakeAlive: true,
        boostingInterval: null,
        menuName: localStorage.getItem('modMenuName') || config.defaultMenuName,
        menuColor: localStorage.getItem('modMenuColor') || config.defaultMenuColor,
        showCustomization: sessionStorage.getItem('showCustomization') === 'false' ? false : true,
        simplified: sessionStorage.getItem('modMenuSimplified') === 'true',
        showMovement: false,
        showZoom: false,
        showUtilities: false,
        showVisuals: false,
        showLinks: false,
        showStatus: false,
        showChallenges: false,
        showExtraMods: false,
        chatMessages: [],
        uiLayout: JSON.parse(localStorage.getItem('modMenuUILayout')) || {
            menu: { x: null, y: null, width: null, height: null }, // Width/Height for menu might not be needed if content dictates it
            chat: { x: 20, y: 100, width: 320, height: 250 }, // Adjusted default chat size
            minimap: { x: null, y: null, width: null, height: null }
        },
        draggingElement: null,
        resizingElement: null,
        dragStartX: 0,
        dragStartY: 0,
        elementStartX: 0,
        elementStartY: 0,
        elementStartWidth: 0,
        elementStartHeight: 0,
        uiScale: parseFloat(localStorage.getItem('modMenuUIScale')) || 1.0, // <<< ADD THIS LINE
        browserZoom: 1.0
    };

    // Ensure all default keybinds are present in state.keybinds
    const defaultKeybinds = {
        toggleMenu: 'm',
        toggleKeybinds: '-',
        circleRestriction: 'k',
        circleSmaller: 'j',
        circleLarger: 'l',
        autoCircle: 'a',
        autoBoost: 'b',
        neonLine: "e",
        fpsDisplay: 'f',
        autoRespawn: 's',
        deathSound: 'v',
        showServer: 't',
        chatEnabled: 'enter', // Changed from / to enter to align with original user expectation. Can be rebound.
        zoomIn: 'z',
        zoomOut: 'x',
        zoomReset: 'c',
        screenshot: 'p',
        github: 'g',
        discord: 'd',
        godMode: 'y',
        reddit: 'r',
        dreamwave: 'n'

    };
    Object.entries(defaultKeybinds).forEach(([action, key]) => {
        if (!state.keybinds.hasOwnProperty(action)) {
            state.keybinds[action] = key;
        }
    });

    function buttonStyle(bgColor = state.menuColor, textColor = '#fff') {
        return `padding:8px 15px; border-radius:6px; border:none; color:${textColor}; font-size:14px; font-weight:500; cursor:pointer; transition:background-color 0.2s, box-shadow 0.2s; background-color:${bgColor};`;
    }
    function buttonHoverStyle(bgColor = state.menuColor) {
        return `this.style.backgroundColor='${adjustColor(bgColor, -15)}'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15)';`;
    }
    function buttonLeaveStyle(bgColor = state.menuColor) {
        return `this.style.backgroundColor='${bgColor}'; this.style.boxShadow='none';`;
    }


    let waitingForKeybind = false;
    let currentKeybindAction = null;

    function openKeybindModal(action) {
        const overlay = document.getElementById('keybind-modal-overlay');
        const actionLabel = document.getElementById('keybind-modal-action');
        if (!overlay || !actionLabel) return;
        overlay.style.display = 'flex';
        actionLabel.textContent = `Action: ${action.replace(/([A-Z])/g, ' $1')}`;
        waitingForKeybind = true;
        currentKeybindAction = action;
    }

    function closeKeybindModal() {
        const overlay = document.getElementById('keybind-modal-overlay');
        if (overlay) overlay.style.display = 'none';
        waitingForKeybind = false;
        currentKeybindAction = null;
    }


    document.addEventListener('keydown', function(e) {
        if (!waitingForKeybind) return;
        e.preventDefault();
        e.stopPropagation();
        if (e.key === "Escape" || e.key === "Enter") {
            closeKeybindModal();
            return;
        }
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        state.keybinds[currentKeybindAction] = key;
        localStorage.setItem('modKeybinds', JSON.stringify(state.keybinds));
        closeKeybindModal();
        if (typeof updateMenu === "function") updateMenu();
    });

    document.addEventListener('wheel', function(e) {
        if (!waitingForKeybind) return;
        e.preventDefault();
        e.stopPropagation();
        let key;
        if (e.deltaY < 0) key = "wheelup";
        else if (e.deltaY > 0) key = "wheeldown";
        else return;
        state.keybinds[currentKeybindAction] = key;
        localStorage.setItem('modKeybinds', JSON.stringify(state.keybinds));
        closeKeybindModal();
        if (typeof updateMenu === "function") updateMenu();
    }, { passive: false });

    // --- 1. FAKE SIZE (SECURED) ---
    function toggleFakeSize() {
        if (!window.slither) return;

        if (state.features.fakeSize) {
            // Flag to block challenges
            window.__fakeSizeActive = true;

            // Save real values
            window.realScore = window.slither.sct;
            window.realScale = window.slither.sc;

            // Apply Huge Visuals
            window.slither.sct = 2500;
            window.slither.sc = 6.0;
            window.gsc = 0.4;

            const scoreContainer = document.getElementById('lastscore');
            if(scoreContainer) scoreContainer.innerHTML = "Mass: 100,000 (Fake)";
        } else {
            window.__fakeSizeActive = false;

            // Restore
            if(window.realScore) window.slither.sct = window.realScore;
            if(window.realScale) window.slither.sc = window.realScale;
        }
    }


        function startChallengeWatcher() {
        // Prevent double injection
        if (document.getElementById('challenge-watcher-script')) return;

        const script = document.createElement('script');
        script.id = 'challenge-watcher-script';
        script.textContent = `
        (function() {
            console.log("Challenge Watcher Started...");
            setInterval(() => {
                // 1. Check if player exists and is alive
                if (!window.slither || window.slither.dead) return;

                // --- FIX: SECURITY CHECK ---
                // If Fake Size is active, report score as 0 to prevent exploits
                if (window.__fakeSizeActive) {
                    window.postMessage({
                        type: "143X_CHALLENGE_UPDATE",
                        score: 0, // Force score to 0 so challenges don't complete
                        kills: 0
                    }, "*");
                    return;
                }
                // --- END FIX ---

                // 2. Calculate Real Score based on game.js math
                let currentScore = 0;
                if (window.fpsls && window.fmlts) {
                    const sct = window.slither.sct;
                    const fam = window.slither.fam;
                    // Ensure sct is within bounds
                    if(sct >= 0 && sct < window.fpsls.length) {
                        currentScore = Math.floor((fpsls[sct] + fam / fmlts[sct] - 1) * 15 - 5) / 1;
                    }
                } else {
                    currentScore = Math.floor(window.slither.sct * 15);
                }

                // 3. Get Kill Count
                let currentKills = window.slither.kill_count || 0;

                // 4. Send Data to Content Script
                window.postMessage({
                    type: "143X_CHALLENGE_UPDATE",
                    score: currentScore,
                    kills: currentKills
                }, "*");

            }, 1000); // Check every 1 second
        })();
        `;
        document.body.appendChild(script);
    }

    // --- NEW: TACTICAL RAYCAST (Safety Radar) ---
    function renderSafetyRadar(ctx) {
        // Check ONLY for the radar flag
        if (!state.features.tacticalRadar || !state.isInGame || !window.slither) return;

        const sectors = 24;
        const rayLength = 600;
        const myHeadX = window.slither.xx + (window.slither.fx || 0);
        const myHeadY = window.slither.yy + (window.slither.fy || 0);

        const viewX = window.view_xx !== undefined ? window.view_xx : window.slither.xx;
        const viewY = window.view_yy !== undefined ? window.view_yy : window.slither.yy;
        const zoom = window.gsc || 1.0;
        const cx = ctx.canvas.width / 2;
        const cy = ctx.canvas.height / 2;

        ctx.save();
        ctx.lineWidth = 2;

        for (let i = 0; i < sectors; i++) {
            let angle = (i / sectors) * Math.PI * 2;
            let safe = true;
            let hitDist = rayLength;

            // Only check if enemies exist
            if (window.slithers) {
                for (let s of window.slithers) {
                    if (s === window.slither || s.dead) continue;
                    if (Math.hypot(s.xx - myHeadX, s.yy - myHeadY) > rayLength + 200) continue;

                    for (let pt of s.pts) {
                        let dist = Math.hypot(pt.xx - myHeadX, pt.yy - myHeadY);
                        if (dist < hitDist) {
                            let angToPt = Math.atan2(pt.yy - myHeadY, pt.xx - myHeadX);
                            let diff = Math.abs(angToPt - angle);
                            if (diff > Math.PI) diff = 2 * Math.PI - diff;
                            if (diff < 0.15) { hitDist = dist; safe = false; }
                        }
                    }
                }
            }

            let screenStartX = cx + (myHeadX - viewX) * zoom;
            let screenStartY = cy + (myHeadY - viewY) * zoom;
            let screenEndX = cx + ((myHeadX + Math.cos(angle) * hitDist) - viewX) * zoom;
            let screenEndY = cy + ((myHeadY + Math.sin(angle) * hitDist) - viewY) * zoom;

            ctx.strokeStyle = safe ? "rgba(0, 255, 0, 0.15)" : "rgba(255, 0, 0, 0.5)";
            ctx.beginPath();
            ctx.moveTo(screenStartX, screenStartY);
            ctx.lineTo(screenEndX, screenEndY);
            ctx.stroke();
        }
        ctx.restore();
    }

    // --- NEW: PREY PREDICTOR (Trajectory) ---
    function renderPreyPredictor(ctx) {
        // Check ONLY for the prey flag
        if (!state.features.preyPredictor || !window.preys || !state.isInGame) return;

        const viewX = window.view_xx !== undefined ? window.view_xx : window.slither.xx;
        const viewY = window.view_yy !== undefined ? window.view_yy : window.slither.yy;
        const zoom = window.gsc || 1.0;
        const cx = ctx.canvas.width / 2;
        const cy = ctx.canvas.height / 2;

        ctx.save();
        for (let p of window.preys) {
            if (!p || p.eaten) continue;

            let sx = cx + (p.xx - viewX) * zoom;
            let sy = cy + (p.yy - viewY) * zoom;

            // Predict movement (approx 15 frames ahead)
            const speed = (p.sp || 5) * 15;
            const angle = p.ang;

            let futureX = p.xx + Math.cos(angle) * speed;
            let futureY = p.yy + Math.sin(angle) * speed;

            let fx = cx + (futureX - viewX) * zoom;
            let fy = cy + (futureY - viewY) * zoom;

            // Only draw if on screen
            if (sx < -50 || sx > ctx.canvas.width + 50 || sy < -50 || sy > ctx.canvas.height + 50) continue;

            ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
            ctx.lineWidth = 1.5;
            ctx.setLineDash([4, 4]);
            ctx.beginPath();
            ctx.moveTo(sx, sy);
            ctx.lineTo(fx, fy);
            ctx.stroke();

            ctx.fillStyle = "rgba(0, 255, 255, 0.5)";
            ctx.beginPath();
            ctx.arc(fx, fy, 4 * zoom, 0, 2 * Math.PI);
            ctx.fill();
        }
        ctx.restore();
    }

// --- 3. MASTER VISUAL RENDER LOOP (Handles ESP, Radar, Boost, Prey) ---
    let espCanvas = null;
    let espCtx = null;

    function renderPredatorESP() {
        requestAnimationFrame(renderPredatorESP);

        // 1. Check if ANY visual feature is enabled. If all are off, clear and exit.
        if ((!state.features.predatorESP &&
             !state.features.tacticalRadar &&
             !state.features.boostMonitor &&
             !state.features.preyPredictor) ||
             !state.isInGame) {

            if (espCtx && espCanvas) espCtx.clearRect(0, 0, espCanvas.width, espCanvas.height);
            return;
        }

        // 2. Setup Canvas
        if (!espCanvas) {
            espCanvas = document.createElement('canvas');
            espCanvas.id = 'predator-esp-canvas';
            espCanvas.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 999999; pointer-events: none;';
            document.body.appendChild(espCanvas);
            espCtx = espCanvas.getContext('2d');
        }

        // 3. Sync Size
        const referenceWidth = window.mc ? window.mc.width : window.innerWidth;
        const referenceHeight = window.mc ? window.mc.height : window.innerHeight;

        if (espCanvas.width !== referenceWidth || espCanvas.height !== referenceHeight) {
            espCanvas.width = referenceWidth;
            espCanvas.height = referenceHeight;
            espCanvas.style.width = "100%";
            espCanvas.style.height = "100%";
        }

        const ctx = espCtx;
        const w = espCanvas.width;
        const h = espCanvas.height;
        const cx = w / 2;
        const cy = h / 2;

        // 4. Clear Canvas
        ctx.clearRect(0, 0, w, h);

        // 5. Render Independent Layers (Radar & Prey)
        // These don't rely on the snake loop below
        renderSafetyRadar(ctx);
        renderPreyPredictor(ctx);

        // 6. Snake Loop (Shared by ESP and Boost Monitor)
        // Only run if either ESP or Boost Monitor is ON
        if ((state.features.predatorESP || state.features.boostMonitor) && window.slithers && window.slither) {

            const viewX = window.view_xx !== undefined ? window.view_xx : window.slither.xx;
            const viewY = window.view_yy !== undefined ? window.view_yy : window.slither.yy;
            const zoom = window.gsc || 1.0;

            ctx.save();

            for (let i = 0; i < window.slithers.length; i++) {
                const s = window.slithers[i];
                if (!s || s === window.slither || s.dead) continue;

                // Coordinate Math
                const rx = s.xx + (s.fx || 0);
                const ry = s.yy + (s.fy || 0);

                const screenX = cx + (rx - viewX) * zoom;
                const screenY = cy + (ry - viewY) * zoom;

                // Optimization: Don't draw if far off screen
                if (screenX < -100 || screenX > w + 100 || screenY < -100 || screenY > h + 100) continue;

                // Calculate Radius
                const radius = (13 + (s.sc * 8)) * zoom;

                // --- A. PREDATOR ESP DRAWING ---
                if (state.features.predatorESP) {
                    // Tracer Line
                    ctx.strokeStyle = "rgba(255, 0, 0, 0.8)";
                    ctx.lineWidth = 2.5;
                    ctx.beginPath();
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(screenX, screenY);
                    ctx.stroke();

                    // Head Hitbox
                    ctx.strokeStyle = "#FFFF00";
                    ctx.lineWidth = 2;
                    ctx.fillStyle = "rgba(255, 255, 0, 0.15)";
                    ctx.beginPath();
                    ctx.arc(screenX, screenY, radius, 0, 2 * Math.PI);
                    ctx.fill();
                    ctx.stroke();

                    // Mass Text
                    const mass = Math.floor(15 * s.sct);
                    ctx.fillStyle = "#FFF";
                    ctx.font = "bold 12px Arial";
                    ctx.textAlign = "center";
                    ctx.shadowColor = "#000";
                    ctx.shadowBlur = 4;
                    ctx.fillText(mass, screenX, screenY - radius - 10);
                }

                // --- B. BOOST MONITOR DRAWING ---
                if (state.features.boostMonitor) {
                    // Logic: s.sp is current speed. 5.5 is roughly the threshold where normal speed ends and boost begins.
                    // Or if available, use (s.ssp + 0.1)
                    let threshold = 5.5;
                    if(s.ssp) threshold = s.ssp + 0.1;

                    if (s.sp > threshold) {
                        ctx.font = "900 18px Arial"; // Made thicker
                        ctx.fillStyle = "#00FFFF";   // Cyan for better visibility
                        ctx.shadowColor = "#000";
                        ctx.shadowBlur = 4;
                        ctx.textAlign = "center";

                        // Draw Icon slightly higher than mass text
                        ctx.fillText("⚡ BOOST", screenX, screenY - radius - 25);

                        // Pulse Effect Ring
                        ctx.strokeStyle = "#00FFFF";
                        ctx.lineWidth = 3;
                        ctx.beginPath();
                        ctx.arc(screenX, screenY, radius + 5, 0, 2 * Math.PI);
                        ctx.stroke();
                    }
                }
            }
            ctx.restore();
        }
    }
    // Start ESP loop
    renderPredatorESP();

    // --- 4. SPINBOT (Aggressive Movement Hack) ---
    let spinAngle = 0;
    setInterval(() => {
        if (state.features.spinBot && state.isInGame) {
            // Increase angle rapidly
            spinAngle += 0.8;

            // Force the mouse coordinates to orbit the center
            // game.js reads xm/ym to determine snake direction
            window.xm = Math.cos(spinAngle) * 500;
            window.ym = Math.sin(spinAngle) * 500;

            // Optional: Auto-boost while spinning for maximum effect
            if(window.setAcceleration) window.setAcceleration(1);
        }
    }, 20); // Extremely fast update rate (50 times per second)

    function loadSavedServers() {
        try {
            return JSON.parse(localStorage.getItem('customServerList') || '[]');
        } catch {
            return [];
        }
    }
    function saveServers(list) {
        localStorage.setItem('customServerList', JSON.stringify(list));
    }
    function updateServerDropdown() {
        const selectSrv = document.getElementById('select-srv');
        if (!selectSrv) return;
        selectSrv.innerHTML = '<option value="">Select a Server</option>';
        const servers = loadSavedServers();
        servers.forEach((ip, i) => {
            const opt = document.createElement('option');
            opt.value = ip;
            opt.text = `${i+1}. ${ip}`;
            selectSrv.appendChild(opt);
        });
    }

    (function(){
        // This bridge ensures ALL ArrowLeft/ArrowRight KeyboardEvents set window.l/window.r, even if preventDefault is called elsewhere
        window.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowLeft') window.l = true;
            if (e.key === 'ArrowRight') window.r = true;
        }, true); // Use capture phase to run before other handlers

        window.addEventListener('keyup', function(e) {
            if (e.key === 'ArrowLeft') window.l = false;
            if (e.key === 'ArrowRight') window.r = false;
        }, true);
    })();



    // update server ip loop wayne
    function updateServerIpLoop() {
        let ip = null, port = null;
        if (window.bso && window.bso.ip && window.bso.po) {
            ip = window.bso.ip;
            port = window.bso.po;
        }
        if (ip && port) {
            state.server = `${ip}:${port}`;
        } else {
            state.server = '';
        }
        setTimeout(updateServerIpLoop, 1000); // Check every second
    }
    updateServerIpLoop();



if (!document.getElementById('rep-help-modal')) {
    const helpModal = document.createElement('div');
    helpModal.id = 'rep-help-modal';
    helpModal.style.cssText = `
        display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
        z-index: 10015; background: rgba(0,0,0,0.75);
        align-items: center; justify-content: center; font-family: 'Segoe UI', Arial, sans-serif;
    `;

    // Dynamically generate the rank list from the config object
    const rankListHTML = Object.entries(config.repMilestones).map(([rep, rank]) =>
        `<li><span style="font-size: 1.2em; width: 25px; display: inline-block;">${rank.icon}</span> <b>${rank.name}:</b> ${parseInt(rep).toLocaleString()} REP</li>`
    ).join('');

    helpModal.innerHTML = `
        <div style="background: #23232a; border-radius: 12px; padding: 25px 35px; min-width: 450px; max-width: 90%; max-height: 80vh; display: flex; flex-direction: column; box-shadow:0 6px 25px rgba(0,0,0,0.4); border: 1px solid var(--menu-color, #4CAF50); position:relative;">
            <button id="rep-help-close" style="position:absolute; top:10px; right:10px; font-size:1.5em; background:none; border:none; color:#aaa; cursor:pointer; line-height:1;">×</button>
            <h2 style="color:var(--menu-color, #4CAF50); margin-top:0; text-align:center; padding-bottom: 10px; border-bottom: 1px solid #444;">REP & Ranking System</h2>
            <div style="margin-top:15px; overflow-y: auto; padding-right: 15px; color: #ccc; line-height: 1.6;">
                <h3 style="color: #FFD700; margin-top: 5px;">How to Gain REP</h3>
                <ul style="margin-left: 20px; padding-left: 0;">
                    <li><b>Stay Active:</b> Earn 1 REP for every 15 minutes of gameplay.</li>
                    <li><b>Be Social:</b> Earn 1 REP every 5 minutes you send a message in chat.</li>
                </ul>
                <h3 style="color: #FFD700;">Ranks & Milestones</h3>
                <p>Ranks are automatically awarded as you reach REP milestones.</p>
                <ul style="margin-left: 20px; padding-left: 0; list-style-type: none;">
                    ${rankListHTML}
                </ul>
            </div>
        </div>
    `;
    document.body.appendChild(helpModal);

    // Attach listeners for the modal
    document.getElementById('rep-help-close').onclick = () => {
        helpModal.style.display = 'none';
    };
    helpModal.onclick = (e) => {
        if (e.target.id === 'rep-help-modal') {
            helpModal.style.display = 'none';
        }
    };
}


    // === VIP MEMBERS // DISCORD ===
    const vipMembers = [
        { uid: "crcOY9hoRrfayStCxMVm7Zdx2W92", name: "stevao" },
        { uid: "DhGhICAZwkRa7wuMsyquM9a5uO92", name: "LUANBLAYNER" },
        { uid: "EWhWsb2veZPzvSyBq4xM5f4r5Ng2", name: "stevao" },
        { uid: "CiOpgh1RLBg3l5oXn0SAho66Po93", name: "dxxthly"}, // DXXTHLY VIP
        { uid: "P75eMwh756Rb6h1W6iqQfHN2Dm92", name: "wayne"},   // WAYNE VIP
        { uid: "VIP_UID_4", name: "Another2VIP" },
        { uid: "VIP_UID_5", name: "Another3VIP" },
    ];

    const devList = [
        { uid: "CiOpgh1RLBg3l5oXn0SAho66Po93", name: "dxxthly" },
        { uid: "hTinUwrewTYNcXujW1hUaXrScGW2", name: "dxxthly" },
        { uid: "tC1VW4WkXEOfK7rCpwGvFcv7MJo1", name: "dev" },
        { uid: "oRK253Z1UWfyZ6Ms3hxCxHGAgCp2", name: "dxxthly" }, //
        { uid: "P75eMwh756Rb6h1W6iqQfHN2Dm92", name: "wayne" }
    ];


    function isVip(uid, name) {
        return vipMembers.some(vip =>
            vip.uid === uid && vip.name.toLowerCase() === (name || '').toLowerCase()
        );
    }

    // --- THIS IS THE NEW, CORRECTED FUNCTION ---
    function isDev(uid) {
        return devList.some(dev => dev.uid === uid);
    }


    function isValidHexColor(color) {
        if (!color || typeof color !== 'string') return false;
        const hexRegex = /^#([0-9a-fA-F]{3}){1,2}$/;
        return hexRegex.test(color);
    }

    function vipGlowStyle(name, color) {
        const vipColor = color || state.menuColor; // Fallback to menu color if specific VIP color not provided
        return `<span style="
            color:#fff;
            font-weight:bold;
            text-shadow:0 0 5px #fff, 0 0 10px ${vipColor}, 0 0 15px ${vipColor};
        ">${name}</span>`;
    }


    function isVip(uid, name) {
        return vipMembers.some(vip =>
            vip.uid === uid && vip.name.toLowerCase() === (name || '').toLowerCase()
        );
    }

    function isDev(uid) {
        return devList.some(dev => dev.uid === uid);
    }

    function vipGlowStyle(name, color) {
        const vipColor = color || state.menuColor;
        return `<span style="color:#fff;font-weight:bold;text-shadow:0 0 5px #fff, 0 0 10px ${vipColor}, 0 0 15px ${vipColor};">${name}</span>`;
    }

    const adminMembers = [
        // { uid: "ADMIN_UID_1", name: "AdminName1" },
    ];

    const supporterMembers = [
        // { uid: "SUPPORTER_UID_1", name: "SupporterName1" },
    ];

    function isAdmin(uid) {
        return adminMembers.some(admin => admin.uid === uid);
    }

    function isSupporter(uid) {
        return supporterMembers.some(supporter => supporter.uid === uid);
    }

    function isSystemAccount(uid) {
        return systemAccounts.includes(uid);
    }

    function isValidHexColor(color) {
        if (!color || typeof color !== 'string') return false;
        const hexRegex = /^#([0-9a-fA-F]{3}){1,2}$/;
        return hexRegex.test(color);
    }

    const systemAccounts = [
        "system",
        "discord_bot"
    ];

    // List of UIDs to hide from leaderboards (e.g., bots)
    // List of UIDs to hide from leaderboards (e.g., bots)
    const leaderboardBlockedUIDs = [
        "discord_bot",
        "n4P6uCFzhFO11xsUYge1nQQSpcL2", // Add first UID to block
        "pk4p3FkLFVShqX8pD3dBtb4CJbB3"  // Add second UID to block
    ];

    function isBlockedFromLeaderboard(uid) {
        return leaderboardBlockedUIDs.includes(uid);
    }



    let chatMessagesArray = [];
    let forcedServer = null;
    let chatHistory = [];
    let autoCircleRAF = null;

    let autoRespawnDead = false;
    let autoRespawnSpam = null;
    let deathCheckInterval = null;
    let afkInterval = null;
    let realMouseX = window.innerWidth / 2;
    let realMouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', function(e) {
        realMouseX = e.clientX;
        realMouseY = e.clientY;
    });

    function syncServerBoxWithMenu() {
        const box = document.getElementById('custom-server-box');
        const nameSpan = document.getElementById('custom-server-box-name');
        const serverListBtn = document.getElementById('server-list-btn');
        const connectBtn = document.getElementById('connect-btn');
        const saveIpBtn = document.getElementById('save-ip-btn');

        if (!box || !nameSpan) return;

        const menuColor = state.menuColor;
        const hoverColor = adjustColor(menuColor, -15); // Darker for hover

        nameSpan.textContent = state.menuName;
        nameSpan.style.color = menuColor;
        nameSpan.style.textShadow = `0 0 6px ${menuColor}, 0 0 12px ${menuColor}`;
        box.style.borderColor = menuColor;
        box.style.boxShadow = `0 0 12px ${hexToRgba(menuColor, 0.4)}`;


        [connectBtn, saveIpBtn, serverListBtn].forEach(btn => {
            if (btn) {
                btn.style.background = menuColor;
                btn.style.boxShadow = `0 0 8px ${hexToRgba(menuColor, 0.4)}`;
                // Add hover effect directly if not using CSS classes
                btn.onmouseenter = () => btn.style.background = hoverColor;
                btn.onmouseleave = () => btn.style.background = menuColor;
            }
        });
         const serverIpInput = document.getElementById('server-ip');
         const selectSrv = document.getElementById('select-srv');
         if(serverIpInput) {
            serverIpInput.onfocus = () => { serverIpInput.style.borderColor = menuColor; serverIpInput.style.boxShadow = `0 0 5px ${hexToRgba(menuColor, 0.5)}`;};
            serverIpInput.onblur = () => { serverIpInput.style.borderColor = '#555'; serverIpInput.style.boxShadow = 'none';};
         }
         if(selectSrv) {
            selectSrv.onfocus = () => { selectSrv.style.borderColor = menuColor; selectSrv.style.boxShadow = `0 0 5px ${hexToRgba(menuColor, 0.5)}`;};
            selectSrv.onblur = () => { selectSrv.style.borderColor = '#555'; selectSrv.style.boxShadow = 'none';};
         }

    }


    const zoomSteps = [
        0.1, 0.125, 0.15, 0.175, 0.2, 0.225, 0.25, 0.275, 0.3, 0.325, 0.35, 0.375, 0.4, 0.425, 0.45, 0.475,
        0.5, 0.525, 0.55, 0.575, 0.6, 0.625, 0.65, 0.675, 0.7, 0.725, 0.75, 0.775, 0.8, 0.825, 0.85, 0.875,
        0.9, 0.925, 0.95, 0.975, 1.0, 1.025, 1.05, 1.075, 1.1, 1.125, 1.15, 1.175, 1.2, 1.225, 1.25, 1.275,
        1.3, 1.325, 1.35, 1.375, 1.4, 1.425, 1.45, 1.475, 1.5, 1.525, 1.55, 1.575, 1.6, 1.625, 1.65, 1.675,
        1.7, 1.725, 1.75, 1.775, 1.8, 1.825, 1.85, 1.875, 1.9, 1.925, 1.95, 1.975, 2.0, 2.25, 2.5, 2.75, 3.0,
        3.25, 3.5, 3.75, 4.0, 4.25, 4.5, 4.75, 5.0
    ]; // Reduced max zoom for sanity


    function addServerBox() {
        const check = setInterval(() => {
            const login = document.getElementById('login');
            const nickInput = document.getElementById('nick');
            if (login && nickInput) {
                clearInterval(check);

                if (document.getElementById('custom-server-box')) return;

                const box = document.createElement('div');
                box.id = 'custom-server-box';
                // --- ENHANCED SERVER BOX STYLES ---
                box.style.cssText = `
                    margin: 28px auto 0 auto;
                    max-width: 380px;
                    background: rgba(46, 46, 52, 0.97); /* Matches new menu style */
                    border: 1px solid ${state.menuColor};
                    border-radius: 12px;
                    box-shadow: 0 6px 25px ${hexToRgba(state.menuColor, 0.2)};
                    padding: 24px;
                    font-family: 'Segoe UI', Arial, sans-serif;
                    color: #e0e0e0;
                    transition: border-color 0.3s, box-shadow 0.3s;
                `;

                // --- ENHANCED SERVER BOX INNER HTML ---
                box.innerHTML = `
                    <div style="margin-bottom:12px;">
                        <span id="custom-server-box-name"
                            style="
                                color:${state.menuColor};
                                font-size:1.6em; /* Larger title */
                                font-family: 'Segoe UI', 'Arial', sans-serif; /* Title font */
                                text-shadow:0 0 6px ${state.menuColor}, 0 0 12px ${state.menuColor};
                                font-weight:600; /* Bolder */
                                letter-spacing:0.5px;
                                transition:color 0.3s, text-shadow 0.3s;
                            ">
                            ${state.menuName}
                        </span>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:12px; margin-bottom:15px;">
                        <input id="server-ip" type="text" placeholder="Server Address (IP:Port)"
                               style="width:100%; padding:10px 12px; background:rgba(255,255,255,0.05); color:#e0e0ff; border:1px solid #555; border-radius:6px; outline:none; font-size:1em; box-sizing:border-box; transition: border-color 0.2s, box-shadow 0.2s;">
                        <div style="display:flex; gap:10px;">
                            <input id="save-ip-btn" type="button" value="Save"
                                   style="flex:1; height:40px; border-radius:6px; color:#FFF; background: ${state.menuColor}; border:none; outline:none; cursor:pointer; font-weight:bold; font-size: 0.95em; transition: background-color 0.2s;">
                            <input id="connect-btn" type="button" value="Play"
                                   style="flex:2; height:40px; border-radius:6px; color:#FFF; background: ${state.menuColor}; border:none; outline:none; cursor:pointer; font-weight:bold; font-size: 1.05em; transition: background-color 0.2s;">
                        </div>
                    </div>
                    <select id="select-srv"
                            style="display:block; margin:0 auto 15px auto; width:100%; background:rgba(255,255,255,0.05); border:1px solid #555; border-radius:6px; padding:10px 12px; font-size:1em; color: #e0e0e0; text-align:center; box-sizing:border-box; transition: border-color 0.2s, box-shadow 0.2s;">
                        <option value="">Select a Saved Server</option>
                    </select>
                    <a
                        id="server-list-btn"
                        href="https://ntl-slither.com/ss/?reg=na"
                        target="_blank"
                        style="
                            display: block;
                            width: 100%;
                            background: ${state.menuColor};
                            color: #fff;
                            border: none;
                            border-radius: 6px;
                            padding: 12px 0;
                            font-size: 1.1em;
                            font-family: inherit;
                            font-weight: bold;
                            cursor: pointer;
                            box-shadow: 0 2px 5px ${hexToRgba(state.menuColor, 0.3)};
                            text-align: center;
                            text-decoration: none;
                            transition: background-color 0.2s, box-shadow 0.2s;
                            box-sizing:border-box;
                        "
                    >
                        Browse Server List
                    </a>
                `;

                let parent = nickInput.parentElement;
                if (parent && parent.nextSibling) {
                    parent.parentNode.insertBefore(box, parent.nextSibling.nextSibling);
                } else {
                    login.appendChild(box);
                }

                updateServerDropdown();
                syncServerBoxWithMenu(); // Apply dynamic styles

                const selectSrv = document.getElementById('select-srv');
                selectSrv.onchange = function() {
                    document.getElementById('server-ip').value = this.value;
                };

                document.getElementById('save-ip-btn').onclick = function() {
                    const ipInput = document.getElementById('server-ip');
                    if (!ipInput || !ipInput.value.trim()) return;
                    const ip = ipInput.value.trim();
                    if (!ip.includes(':') || ip.split(':')[0].trim() === '' || ip.split(':')[1].trim() === '') {
                        alert("Please enter a valid IP:Port (e.g., 15.204.212.200:444 or server.domain.com:444)");
                        return;
                    }
                    let servers = loadSavedServers();
                    const normalized = ip.toLowerCase().replace(/\s+/g, '');
                    const isDuplicate = servers.some(s => s.toLowerCase().replace(/\s+/g, '') === normalized);
                    if (!isDuplicate) {
                        servers.push(ip);
                        saveServers(servers);
                        updateServerDropdown();
                        if (selectSrv) selectSrv.value = ip;
                    } else {
                        alert("This server is already in your list!");
                    }
                };

                document.getElementById('connect-btn').onclick = function() {
                    const ipInput = document.getElementById('server-ip');
                    if (!ipInput || !ipInput.value.trim()) return;
                    const ip = ipInput.value.trim();
                    const parts = ip.split(':');
                    const ipPart = parts[0];
                    const portPart = parts[1] || "444";

                    forcedServer = { ip: ipPart, port: portPart };
                    localStorage.setItem('forcedServer', JSON.stringify(forcedServer));

                    if (typeof window.forceServer === "function") {
                        window.forceServer(ipPart, portPart);
                    }

                    window.forcing = true;
                    if (!window.bso) window.bso = {};
                    window.bso.ip = ipPart;
                    window.bso.po = portPart;

                    if (typeof window.connect === "function") {
                        window.connect();
                    }

                    const playBtn = document.getElementById('playh') || document.querySelector('.btn.btn-primary.btn-play-guest');
                    if (playBtn) playBtn.click();

                    if (typeof connectionStatus === "function") setTimeout(connectionStatus, 1000);
                };

            }
        }, 100);
    }
    addServerBox();

    let retry = 0;
    function connectionStatus() {
        if (!window.connecting || retry == 10) {
            window.forcing = false;
            retry = 0;
            return;
        }
        retry++;
        setTimeout(connectionStatus, 1000);
    }



    function awardTimeBasedRep() {
        const uid = firebase.auth().currentUser?.uid;
        if (!uid) return; // Not logged in yet.

        const userRef = firebase.database().ref(`playerData/${uid}`);
        const now = Date.now();
        const TEN_MINUTES = 15 * 60 * 1000; // <-- CHANGED FROM 30

        userRef.once('value', async (snapshot) => {
            if (!snapshot.exists()) return; // Data not created yet.

            const data = snapshot.val();
            const lastAwardTime = data.lastRepAwardTime || 0;

            if (now - lastAwardTime > TEN_MINUTES) { // <-- USES THE NEW VALUE
                await userRef.child('rep').transaction(currentRep => (currentRep || 0) + 1);
                await userRef.child('lastRepAwardTime').set(now);
                console.log("Awarded 1 REP for 10 minutes of activity."); // <-- Updated log
            }
        });
    }

    function processEndOfGame(score) {
        // This is a placeholder for now. You can add point logic here later.
        // For the REP system, we only care about awarding for time and chat.
    }



    function autoRespawnCheck() {
        if (!state.features.autoRespawn) {
            autoRespawnDead = false;
            stopAutoRespawnSpam();
            return;
        }
        const isDead = (
            (window.snake && !window.snake.alive) ||
            (window.dead_mtm !== undefined && window.dead_mtm !== -1) ||
            (document.getElementById('died')?.style.display !== 'none') ||
            (document.querySelector('.playagain')?.offsetParent !== null)
        );
        if (isDead && !autoRespawnDead) {
        autoRespawnDead = true;

        startAutoRespawnSpam();
    } else if (!isDead && autoRespawnDead) {
            autoRespawnDead = false;
            stopAutoRespawnSpam();
        }
    }

    function startAutoRespawnSpam() {
        if (autoRespawnSpam) return;
        attemptAutoRespawn();
        autoRespawnSpam = setInterval(attemptAutoRespawn, 50);
    }

    function attemptAutoRespawn() {
        if (!autoRespawnDead || !state.features.autoRespawn) {
            stopAutoRespawnSpam();
            return;
        }
        const nickInput = document.getElementById('nick');
        if (nickInput && !nickInput.value.trim()) {
            nickInput.value = localStorage.getItem("nickname") || "Anon";
            nickInput.dispatchEvent(new Event('input', { bubbles: true }));
        }
        if (nickInput) nickInput.focus();
        document.dispatchEvent(new KeyboardEvent('keydown', {
            key: 'Enter', code: 'Enter', keyCode: 13, which: 13, bubbles: true
        }));
    }

    function stopAutoRespawnSpam() {
        if (autoRespawnSpam) {
            clearInterval(autoRespawnSpam);
            autoRespawnSpam = null;
        }
    }

    function enableAutoRespawn() {
        if (!deathCheckInterval) {
            deathCheckInterval = setInterval(autoRespawnCheck, 100);
        }
    }

    function disableAutoRespawn() {
        if (deathCheckInterval) {
            clearInterval(deathCheckInterval);
            deathCheckInterval = null;
        }
        autoRespawnDead = false;
        stopAutoRespawnSpam();
    }

    if (state.features.autoRespawn) enableAutoRespawn();

    const primeAudio = () => {
        state.deathSound.volume = 0.01;
        state.deathSound.play().then(() => {
            state.deathSound.pause();
            state.deathSound.currentTime = 0;
            state.deathSound.volume = 1;
        }).catch(console.error);
        document.removeEventListener('click', primeAudio);
        document.removeEventListener('keydown', primeAudio);
    };
    document.addEventListener('click', primeAudio);
    document.addEventListener('keydown', primeAudio);

    // --- ENHANCED GLOBAL STYLES ---
    const style = document.createElement('style');
    style.textContent = `
    /* Using CSS variables for easier theme management */
    :root {
        --menu-bg: #2E2E34;
        --menu-bg-lighter: #38383E;
        --content-bg: rgba(20, 20, 24, 0.9);
        --border-color: rgba(255, 255, 255, 0.1);
        --text-color: #e0e0e0;
        --text-color-muted: #aaa;
        --font-family: 'Segoe UI', 'Arial', sans-serif;
    }

    /* --- Profile Popup --- */
    .profile-popup {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) scale(1);
        min-width: 300px;
        background: linear-gradient(145deg, var(--menu-bg-lighter), var(--menu-bg));
        color: var(--text-color);
        border-radius: 12px;
        border: 1px solid var(--menu-color-transparent, rgba(76, 175, 80, 0.5));
        box-shadow: 0 8px 32px rgba(0,0,0,0.35);
        padding: 24px 30px 20px 30px;
        z-index: 10001;
        font-family: var(--font-family);
        font-size: 1.05em;
        animation: fadeInProfile 0.25s cubic-bezier(.17,.67,.6,1.04);
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    @keyframes fadeInProfile {
        from { opacity: 0; transform: translate(-50%, -55%) scale(0.92);}
        to   { opacity: 1; transform: translate(-50%, -50%) scale(1);}
    }
    .profile-popup .close-btn {
        position: absolute; top: 12px; right: 12px; background: none; border: none;
        color: var(--text-color-muted); font-size: 1.6em; line-height: 1; cursor: pointer;
        opacity: 0.7; transition: opacity 0.2s, color 0.2s;
    }
    .profile-popup .close-btn:hover { opacity: 1; color: #fff; }
    .profile-popup .avatar {
        width: 72px; height: 72px; border-radius: 50%; margin-bottom: 16px; object-fit: cover;
        border: 3px solid var(--menu-color, #4CAF50); box-shadow: 0 0 10px rgba(0,0,0,0.2);
    }

    /* --- General UI Elements --- */
    .mod-menu-button {
        padding: 8px 15px; border-radius: 6px; border: none; color: #fff;
        font-size: 14px; font-weight: 500; cursor: pointer;
        transition: background-color 0.2s, box-shadow 0.2s;
        background-color: var(--menu-color, #4CAF50);
    }
    .mod-menu-button:hover {
        background-color: var(--menu-color-darker, #3e8e41);
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
    }
    .mod-menu-input {
        padding: 8px 10px; border-radius: 5px; border: 1px solid #454548;
        background-color: #2c2c30; color: var(--text-color); font-size: 14px;
        transition: border-color 0.2s, box-shadow 0.2s; box-sizing: border-box;
    }
    .mod-menu-input:focus {
        outline: none; border-color: var(--menu-color, #4CAF50);
        box-shadow: 0 0 0 2px var(--menu-color-transparent, rgba(76, 175, 80, 0.3));
    }

    /* --- Keybind Modal --- */
    #keybind-modal-overlay { z-index: 10002; background: rgba(0,0,0,0.75); }
    #keybind-modal {
        background: var(--menu-bg) !important; border-radius: 10px !important;
        padding: 30px 35px !important; box-shadow: 0 6px 25px rgba(0,0,0,0.4) !important;
        border: 1px solid var(--border-color);
    }

    /* --- Leaderboard --- */

            /* Custom Scrollbar for Leaderboard Content */
        #rep-leaderboard-content::-webkit-scrollbar,
        #recent-players-content::-webkit-scrollbar {
            width: 8px;
        }
        #rep-leaderboard-content::-webkit-scrollbar-track,
        #recent-players-content::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
            border-radius: 4px;
        }
        #rep-leaderboard-content::-webkit-scrollbar-thumb,
        #recent-players-content::-webkit-scrollbar-thumb {
            background: var(--menu-color, #4CAF50);
            border-radius: 4px;
        }
        #rep-leaderboard-content::-webkit-scrollbar-thumb:hover,
        #recent-players-content::-webkit-scrollbar-thumb:hover {
            background: var(--menu-color-darker, #3e8e41);
        }
        .leaderboard-tab {
        flex: 1;
        padding: 10px 15px;
        border: none;
        background: transparent;
        color: #aaa;
        font-size: 1em;
        font-weight: bold;
        cursor: pointer;
        border-bottom: 3px solid transparent;
        transition: all 0.2s;
    }
    .leaderboard-tab:hover {
        background: rgba(255,255,255,0.05);
        color: #fff;
    }
    .leaderboard-tab.active {
        color: var(--menu-color, #4CAF50);
        border-bottom-color: var(--menu-color, #4CAF50);
    }
    .leaderboard-row {
        display: flex; align-items: center; border-radius: 8px; padding: 10px;
        transition: all 0.2s ease-in-out; cursor: pointer;
    }
    .leaderboard-row:hover { transform: scale(1.02); box-shadow: 0 4px 20px rgba(0,0,0,0.25); }
    .leaderboard-rank { font-size: 1.4em; font-weight: 700; width: 40px; text-align: center; margin-right: 15px; }
    .leaderboard-avatar { width: 48px; height: 48px; border-radius: 50%; object-fit: cover; margin-right: 15px; border: 2px solid #555; }
    .leaderboard-info { flex-grow: 1; }
    .leaderboard-name { font-weight: bold; font-size: 1.1em; color: #fff; }
    .leaderboard-rep { color: var(--text-color-muted); font-size: 0.95em; }

    /* --- Chat UI --- */
    .chat-action-btn {
        padding: 0 12px; height: 100%; background: transparent; border: none;
        border-left: 1px solid var(--border-color); color: var(--text-color-muted);
        font-size: 16px; cursor: pointer; transition: color 0.2s, background-color 0.2s;
    }
    .chat-action-btn:hover { color: #fff; background-color: rgba(255,255,255,0.1); }
    .emoji-picker, .gif-picker-modal {
        display: none; position: absolute; bottom: 50px; right: 10px;
        background: var(--menu-bg); border: 1px solid var(--menu-color, #4CAF50);
        border-radius: 8px; box-shadow: 0 5px 20px rgba(0,0,0,0.4); z-index: 10001;
    }
    .gif-picker-modal {
        display: none;
        position: absolute;
        bottom: 50px; /* Position above the input bar */
        right: 10px;
        background: var(--menu-bg, #2E2E34);
        border: 1px solid var(--menu-color, #4CAF50);
        border-radius: 8px;
        box-shadow: 0 5px 20px rgba(0,0,0,0.4);
        z-index: 10001;
        width: 320px; /* Slightly wider */
        height: 350px; /* A bit taller */
        flex-direction: column;
        overflow: hidden;
    }
    .gif-picker-header {
        display: flex;
        padding: 8px;
        border-bottom: 1px solid var(--border-color, #444);
        background: rgba(0,0,0,0.2);
    }
    #gif-search-input {
        flex-grow: 1;
        background: #222;
        border: 1px solid #555;
        color: var(--text-color, #eee);
        border-radius: 4px;
        padding: 6px 10px;
        outline: none;
        font-family: var(--font-family);
    }
    #gif-search-input:focus {
        border-color: var(--menu-color, #4CAF50);
    }
    .gif-results-container {
        flex-grow: 1;
        overflow-y: auto;
        padding: 8px;
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 8px;
    }
    .gif-results-container img {
        width: 100%;
        height: 120px;
        object-fit: cover;
        cursor: pointer;
        border-radius: 4px;
        border: 2px solid transparent;
        transition: border-color 0.2s;
    }
    .gif-results-container img:hover {
        border-color: var(--menu-color, #4CAF50);
    }
    /* This new rule fixes how images look IN the chat */
    .chat-image-preview {
        max-width: 100%; /* Ensures the image never overflows its container */
        height: auto;    /* Maintains aspect ratio */
        border-radius: 6px;
        margin-top: 8px;
        cursor: pointer;
        border: 1px solid #555;
    }
        /* --- START OF BONUS THEME ANIMATION --- */
    /* --- START OF NEW ANIMATED THEMES --- */
    @keyframes animated-fire {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes animated-ocean {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes animated-forest {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    @keyframes animated-galaxy {
        0% { background-position: 0% 0%; }
        100% { background-position: -200% -200%; }
    }
    @keyframes animated-gold {
        0% { background-position: 200% 50%; }
        100% { background-position: -200% 50%; }
    }
    /* --- END OF NEW ANIMATED THEMES --- */
    `;
    document.head.appendChild(style);
    // Function to update --menu-color CSS variable for profile popup border etc.
    function updateCSSVariables() {
        document.documentElement.style.setProperty('--menu-color', state.menuColor);
        document.documentElement.style.setProperty('--menu-color-transparent', hexToRgba(state.menuColor, 0.5));
        document.documentElement.style.setProperty('--menu-color-darker', adjustColor(state.menuColor, -15));
    }
    updateCSSVariables(); // Initial call


    function hexToRgba(hex, alpha = 1) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c[0]+c[0]+c[1]+c[1]+c[2]+c[2];
        const num = parseInt(c, 16);
        return `rgba(${(num>>16)&255},${(num>>8)&255},${num&255},${alpha})`;
    }

    let lastChatMessageTime = 0;
    const chatCooldown = 10000;

    function filterProfanity(text) {
    if (!state.features.chatProfanityFilter || !text) return text;

    const profanityBases = ['nigger', 'niger', 'faggot', 'retard', 'fuck', 'shit', 'asshole', 'bitch', 'cunt'];

    const createProfanityRegex = (base) => {
        const pattern = base.split('').join('[\\s\\W_]*'); // Allows spaces and symbols between letters
        return new RegExp(pattern, 'ig'); // 'i' for case-insensitive, 'g' for global match
    };

    let filteredText = text;

    // Leetspeak replacements: 1 for i, 3 for e, @ for a, etc.
    const leetMap = { '1': 'i', '!': 'i', '3': 'e', '4': 'a', '@': 'a', '5': 's', '0': 'o' };
    const normalizedText = text.toLowerCase().replace(/[1!34@50]/g, m => leetMap[m]);

    profanityBases.forEach(base => {
        const regex = createProfanityRegex(base);
        if (regex.test(normalizedText)) {
            // If a match is found, we replace the entire original text with asterisks
            // This is a simple but effective way to handle it without complex replacement logic.
            filteredText = '*'.repeat(text.length);
        }
    });

    return filteredText;
}

    function replaceLinksWithDiscord(text) {
        const urlRegex = /https?:\/\/[^\s]+|www\.[^\s]+/gi;
        return text.replace(urlRegex, 'https://dsc.gg/143X');
    }

    document.addEventListener('pointerdown', function primeDeathSoundOnce() {
        state.deathSound.volume = 0.01; // Very low volume
        state.deathSound.play().then(() => {
            state.deathSound.pause();
            state.deathSound.currentTime = 0;
            state.deathSound.volume = 1; // Reset to full volume
        }).catch(()=>{/* User hasn't interacted yet */});
        document.removeEventListener('pointerdown', primeDeathSoundOnce);
        document.removeEventListener('keydown', primeDeathSoundOnce); // Also remove keydown listener
    });
    // Add keydown listener as well for priming
    document.addEventListener('keydown', function primeDeathSoundOnceKey() {
        // This is the same function as above, effectively.
        // It ensures that either click or keydown will prime the audio.
        // The removeEventListener calls will handle removing both.
        state.deathSound.volume = 0.01;
        state.deathSound.play().then(() => {
            state.deathSound.pause();
            state.deathSound.currentTime = 0;
            state.deathSound.volume = 1;
        }).catch(()=>{});
        document.removeEventListener('pointerdown', primeDeathSoundOnce); // Remove the click listener
        document.removeEventListener('keydown', primeDeathSoundOnceKey); // Remove this keydown listener
    });


    function createChatSystem() {
        const chatContainer = document.createElement('div');
        chatContainer.id = 'mod-menu-chat-container';
        // --- ENHANCED CHAT CONTAINER STYLES ---
        chatContainer.style.cssText = `
            position: fixed;
            left: ${state.uiLayout.chat.x}px;
            top: ${state.uiLayout.chat.y}px;
            width: ${state.uiLayout.chat.width}px;
            height: ${state.uiLayout.chat.height}px;
            z-index: 9999;
            display: ${state.features.chatVisible ? 'flex' : 'none'};
            flex-direction: column;
            background: rgba(46, 46, 52, 0.95); /* New background */
            border: 1px solid ${hexToRgba(state.menuColor, 0.5)};
            border-radius: 10px; /* Slightly softer radius */
            box-shadow: 0 5px 25px rgba(0,0,0,0.3);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            overflow: hidden; /* Important for border-radius */
            user-select: none;
            font-family: 'Segoe UI', Arial, sans-serif;
        `;

        // --- ENHANCED CHAT TABS ---
        const chatTabs = document.createElement('div');
        chatTabs.style.display = 'flex';
        chatTabs.style.borderBottom = `1px solid ${hexToRgba(state.menuColor, 0.3)}`;
        chatTabs.style.background = `rgba(0,0,0,0.1)`; // Subtle background for tab bar

        const chatTab = document.createElement('div');
        chatTab.textContent = '143X Chat';
        chatTab.id = 'chat-tab-main';
        chatTab.style.cssText = `
            flex: 1; padding: 10px 12px; text-align: center; cursor: pointer;
            font-weight: 500; color: #fff;
            background: ${hexToRgba(state.menuColor, 0.25)}; /* Active by default */
            transition: background 0.2s, color 0.2s;
            border-right: 1px solid ${hexToRgba(state.menuColor, 0.2)};
        `;

        const usersTab = document.createElement('div');
        usersTab.textContent = 'Online Users';
        usersTab.id = 'chat-tab-users';
        usersTab.style.cssText = `
            flex: 1; padding: 10px 12px; text-align: center; cursor: pointer;
            font-weight: 500; color: #ccc;
            background: transparent;
            transition: background 0.2s, color 0.2s;
        `;

        chatTab.onclick = () => {
            document.getElementById('mod-menu-chat-body').style.display = 'flex';
            document.getElementById('mod-menu-online-users').style.display = 'none';
            chatTab.style.background = hexToRgba(state.menuColor, 0.25);
            chatTab.style.color = '#fff';
            usersTab.style.background = 'transparent';
            usersTab.style.color = '#ccc';
        };
        usersTab.onclick = () => {
            document.getElementById('mod-menu-chat-body').style.display = 'none';
            document.getElementById('mod-menu-online-users').style.display = 'flex';
            chatTab.style.background = 'transparent';
            chatTab.style.color = '#ccc';
            usersTab.style.background = hexToRgba(state.menuColor, 0.25);
            usersTab.style.color = '#fff';
        };

        chatTabs.appendChild(chatTab);
        chatTabs.appendChild(usersTab);
        // chatContainer.appendChild(chatTabs); // Tabs will be part of header now

        // --- ENHANCED CHAT HEADER (for dragging and close button) ---
        const chatHeader = document.createElement('div');
        chatHeader.style.cssText = `
            /* height: 38px; Combined with tabs */
            /* padding: 0 12px; */ /* Padding will be within tabs */
            background: rgba(0,0,0,0.1); /* Match tabs bar */
            display: flex;
            /* justify-content: space-between; */ /* Tabs handle this */
            align-items: center;
            cursor: move; /* Draggable handle */
            border-bottom: 1px solid ${hexToRgba(state.menuColor, 0.3)};
        `;
        chatHeader.dataset.draggable = 'true';
        chatHeader.appendChild(chatTabs); // Tabs are inside header

        const chatToggle = document.createElement('div');
        chatToggle.innerHTML = '&times;'; // HTML entity for X
        chatToggle.style.cssText = `
            cursor: pointer; font-size: 22px; padding: 0 15px; color: #aaa;
            line-height: 1; transition: color 0.2s;
            position: absolute; right: 0; top: 0; height: 38px; /* Align with tab height */
            display: flex; align-items: center;
        `;
        chatToggle.title = state.features.chatVisible ? 'Hide chat' : 'Show chat';
        chatToggle.onclick = (e) => { e.stopPropagation(); toggleChatVisible(); };
        chatToggle.onmouseenter = () => chatToggle.style.color = '#fff';
        chatToggle.onmouseleave = () => chatToggle.style.color = '#aaa';

        chatHeader.appendChild(chatToggle); // Add close button to the header
        chatContainer.appendChild(chatHeader);


        // --- ENHANCED CHAT AREA (messages and input) ---
        const chatArea = document.createElement('div');
        chatArea.style.cssText = `
            flex: 1; display: flex; flex-direction: column;
            overflow: hidden; /* For child elements */
            background: rgba(20,20,24,0.9); /* Slightly different dark for content */
            /* Border is now on main chatContainer */
        `;

        const chatBody = document.createElement('div');
        chatBody.id = 'mod-menu-chat-body';
        chatBody.style.cssText = `
            flex: 1; padding: 10px 15px; overflow-y: auto; display: flex; flex-direction: column;
            scrollbar-width: thin; scrollbar-color: ${state.menuColor} rgba(0,0,0,0.2);
        `; // Added scrollbar styling

        const onlineUsers = document.createElement('div');
        onlineUsers.id = 'mod-menu-online-users';
        onlineUsers.style.cssText = chatBody.style.cssText; // Same styling as chatBody
        onlineUsers.style.display = 'none'; // Hidden by default
        onlineUsers.innerHTML = '<div style="text-align:center;color:#888;margin-top:10px;">Loading users...</div>';
        chatArea.appendChild(chatBody);
        chatArea.appendChild(onlineUsers);

        // --- MODIFIED: Create a container for the input and new buttons ---
        const chatInputContainer = document.createElement('div');
        chatInputContainer.style.cssText = `
            display: flex;
            align-items: center;
            border-top: 1px solid ${hexToRgba(state.menuColor, 0.3)};
            background: rgba(0,0,0,0.25);
        `;

        const slowModeIndicator = document.createElement('span');
        slowModeIndicator.id = 'slow-mode-indicator';
        slowModeIndicator.style.cssText = `
            display: none; /* Hidden by default */
            position: absolute;
            left: 15px; /* Aligns with input padding */
            top: 50%;
            transform: translateY(-50%);
            color: #ffc107; /* A nice warning yellow */
            font-size: 13px;
            font-weight: bold;
            pointer-events: none; /* Allows you to click through it */
            text-shadow: 1px 1px 2px rgba(0,0,0,0.5);
        `;

        const chatInput = document.createElement('input');
        chatInput.id = 'mod-menu-chat-input';
        chatInput.type = 'text';
        chatInput.placeholder = `Press '${state.keybinds.chatEnabled.toUpperCase()}' to type...`;
        chatInput.style.cssText = `
            flex-grow: 1; /* Allow input to take up most space */
            padding: 12px 15px;
            border: none;
            background: transparent; /* Make background transparent */
            color: #e0e0e0; outline: none; font-size: 14px; box-sizing: border-box;
        `;

        // --- NEW: Create the GIF and Emoji buttons ---
        const gifBtn = document.createElement('button');
        gifBtn.id = 'gif-btn';
        gifBtn.textContent = 'GIF';
        gifBtn.title = 'Send a GIF';
        gifBtn.className = 'chat-action-btn'; // We will style this class later

        const emojiBtn = document.createElement('button');
        emojiBtn.id = 'emoji-btn';
        emojiBtn.textContent = '🙂';
        emojiBtn.title = 'Send an Emoji';
        emojiBtn.className = 'chat-action-btn';

        // Add elements to the container
        chatInputContainer.appendChild(chatInput);
        chatInputContainer.appendChild(slowModeIndicator);
        chatInputContainer.appendChild(gifBtn);
        chatInputContainer.appendChild(emojiBtn);

        // Add the new container to the chat area
        chatArea.appendChild(chatInputContainer);
        chatContainer.appendChild(chatArea);

        // --- ENHANCED RESIZE HANDLE ---
        const resizeHandle = document.createElement('div');
        resizeHandle.style.cssText = `
            position: absolute; right: 0; bottom: 0; width: 15px; height: 15px;
            cursor: nwse-resize;
            background-color: ${hexToRgba(state.menuColor, 0.4)}; /* Subtler handle */
            opacity: 0.7; transition: opacity 0.2s, background-color 0.2s;
            border-top-left-radius: 5px; /* Rounded corner for handle */
        `;
        resizeHandle.dataset.resizable = 'true';
        resizeHandle.onmouseenter = () => { resizeHandle.style.opacity = '1'; resizeHandle.style.backgroundColor = hexToRgba(state.menuColor, 0.6); };
        resizeHandle.onmouseleave = () => { resizeHandle.style.opacity = '0.7'; resizeHandle.style.backgroundColor = hexToRgba(state.menuColor, 0.4); };
        chatContainer.appendChild(resizeHandle);
        // --- NEW: Add the pop-up modal HTML to the page ---
        const popupsHTML = `
            <div id="emoji-picker" class="emoji-picker"></div>
            <div id="gif-picker-modal" class="gif-picker-modal">
                <div class="gif-picker-header">
                    <input type="text" id="gif-search-input" placeholder="Search GIPHY...">
                </div>
                <div id="gif-results-container" class="gif-results-container"></div>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = popupsHTML;
        while(tempDiv.firstChild) {
            chatContainer.appendChild(tempDiv.firstChild);
        }

        // --- NEW: Event listeners for the new chat buttons and pickers ---
        // We get the buttons we created earlier in this function
        const emojiBtnEl = emojiBtn;
        const gifBtnEl = gifBtn;
        const emojiPicker = chatContainer.querySelector('#emoji-picker');
        const gifPicker = chatContainer.querySelector('#gif-picker-modal');

        // Emoji Picker Logic
        const emojis = "😀 😂 😊 😍 😎 😭 👍 👎 ❤️ 🔥 💀 👑 🏆 🎉 🙏 GG L".split(' ');
        emojiPicker.innerHTML = emojis.map(e => `<span>${e}</span>`).join('');
        emojiBtnEl.onclick = (e) => {
            e.stopPropagation();
            gifPicker.style.display = 'none';
            emojiPicker.style.display = emojiPicker.style.display === 'block' ? 'none' : 'block';
        };
        emojiPicker.addEventListener('click', (e) => {
            if (e.target.tagName === 'SPAN') {
                document.getElementById('mod-menu-chat-input').value += e.target.textContent;
                document.getElementById('mod-menu-chat-input').focus();
            }
        });

        // GIF Picker Logic
        gifBtnEl.onclick = (e) => {
            e.stopPropagation();
            emojiPicker.style.display = 'none';
            // Note the change to 'flex' display for the GIF picker
            if (gifPicker.style.display === 'flex') {
                gifPicker.style.display = 'none';
            } else {
                openGifPicker();
            }
        };
        chatContainer.querySelector('#gif-search-input').addEventListener('keydown', (e) => {
            if (e.key === 'Enter') { e.preventDefault(); searchGifs(); }
        });
        chatContainer.querySelector('#gif-results-container').addEventListener('click', (e) => {
            if (e.target.tagName === 'IMG' && e.target.dataset.directUrl) {
                sendGifToChat(e.target.dataset.directUrl);
            }
        });

        // Universal 'click outside' to close popups
        document.addEventListener('click', (e) => {
            if (emojiPicker.style.display === 'block' && !emojiBtnEl.contains(e.target) && !emojiPicker.contains(e.target)) {
                emojiPicker.style.display = 'none';
            }
            if (gifPicker.style.display === 'flex' && !gifBtnEl.contains(e.target) && !gifPicker.contains(e.target)) {
                gifPicker.style.display = 'none';
            }
        });

        document.body.appendChild(chatContainer);

        makeDraggable(chatContainer, chatHeader);
        makeResizable(chatContainer, resizeHandle);




    }


    function syncChatBoxWithMenu() {
        const chatContainer = document.getElementById('mod-menu-chat-container');
        if (!chatContainer) return;

        const menuColor = state.menuColor;
        const lighterMenuColor = hexToRgba(menuColor, 0.25);
        const borderColor = hexToRgba(menuColor, 0.5);
        const borderTopColor = hexToRgba(menuColor, 0.3);

        chatContainer.style.border = `1px solid ${borderColor}`;

        const chatHeader = chatContainer.querySelector('div[style*="cursor: move"]'); // The draggable header
        if (chatHeader) {
            chatHeader.style.borderBottom = `1px solid ${borderTopColor}`;
        }

        const chatTabMain = document.getElementById('chat-tab-main');
        const chatTabUsers = document.getElementById('chat-tab-users');

        if (chatTabMain && chatTabUsers) {
            // Determine which tab is active to reapply styles correctly
            const chatBodyVisible = document.getElementById('mod-menu-chat-body')?.style.display !== 'none';
            if (chatBodyVisible) {
                chatTabMain.style.background = lighterMenuColor;
                chatTabMain.style.color = '#fff';
                chatTabUsers.style.background = 'transparent';
                chatTabUsers.style.color = '#ccc';
            } else {
                chatTabMain.style.background = 'transparent';
                chatTabMain.style.color = '#ccc';
                chatTabUsers.style.background = lighterMenuColor;
                chatTabUsers.style.color = '#fff';
            }
             chatTabMain.style.borderRight = `1px solid ${hexToRgba(menuColor, 0.2)}`;
        }


        const chatInput = document.getElementById('mod-menu-chat-input');
        if (chatInput) {
            chatInput.style.borderTop = `1px solid ${borderTopColor}`;
            chatInput.placeholder = `Press '${state.keybinds.chatEnabled.toUpperCase()}' to type...`; // Update placeholder if keybind changes
        }

        const resizeHandle = chatContainer.querySelector('div[style*="cursor: nwse-resize"]');
        if (resizeHandle) {
            const baseHandleColor = hexToRgba(menuColor, 0.4);
            const hoverHandleColor = hexToRgba(menuColor, 0.6);
            resizeHandle.style.backgroundColor = baseHandleColor;
            resizeHandle.onmouseenter = () => { resizeHandle.style.opacity = '1'; resizeHandle.style.backgroundColor = hoverHandleColor; };
            resizeHandle.onmouseleave = () => { resizeHandle.style.opacity = '0.7'; resizeHandle.style.backgroundColor = baseHandleColor; };
        }

        const chatBody = document.getElementById('mod-menu-chat-body');
        if (chatBody) {
            chatBody.style.scrollbarColor = `${menuColor} rgba(0,0,0,0.2)`;
        }
        const onlineUsers = document.getElementById('mod-menu-online-users');
        if (onlineUsers) {
            onlineUsers.style.scrollbarColor = `${menuColor} rgba(0,0,0,0.2)`;
        }
    }


    function rainbowTextStyle(name) {
    // This new version uses a CSS animation to create a smooth, flickering rainbow effect
    // on the entire name at once, rather than coloring each letter individually.

    // First, we need to make sure the animation style is added to the page.
    // We check if it already exists to avoid adding it multiple times.
    if (!document.getElementById('rainbow-text-animation')) {
        const style = document.createElement('style');
        style.id = 'rainbow-text-animation';
        style.textContent = `
            @keyframes rainbow-flicker {
                0%   { color: #ff0000; text-shadow: 0 0 5px #ff0000; }
                15%  { color: #ff7f00; text-shadow: 0 0 5px #ff7f00; }
                30%  { color: #ffff00; text-shadow: 0 0 5px #ffff00; }
                45%  { color: #00ff00; text-shadow: 0 0 5px #00ff00; }
                60%  { color: #0000ff; text-shadow: 0 0 5px #0000ff; }
                75%  { color: #4b0082; text-shadow: 0 0 5px #4b0082; }
                90%  { color: #9400d3; text-shadow: 0 0 5px #9400d3; }
                100% { color: #ff0000; text-shadow: 0 0 5px #ff0000; }
            }
            .rainbow-name {
                font-weight: bold;
                animation: rainbow-flicker 4s linear infinite;
            }
        `;
        document.head.appendChild(style);
    }

    // Now, we simply wrap the developer's name in a span with the "rainbow-name" class.
    return `<span class="rainbow-name">${name}</span>`;
}

    // --- NEW: GIPHY and Emoji System Functions ---

// Function to open the GIF picker and load trending GIFs
async function openGifPicker() {
    const gifPicker = document.getElementById('gif-picker-modal');
    const resultsContainer = document.getElementById('gif-results-container');
    if (!gifPicker || !resultsContainer) return;

    gifPicker.style.display = 'flex';
    resultsContainer.innerHTML = '<div style="color:#888; text-align:center; grid-column: 1 / -1;">Loading trending GIFs...</div>';

    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/trending?api_key=${config.giphyApiKey}&limit=20&rating=pg-13`);
        const json = await response.json();
        displayGifs(json.data);
    } catch (error) {
        resultsContainer.innerHTML = '<div style="color:#f77; text-align:center; grid-column: 1 / -1;">Could not load GIFs.</div>';
        console.error("Giphy Trending Error:", error);
    }
}

// Function to search GIPHY
async function searchGifs() {
    const searchInput = document.getElementById('gif-search-input');
    const resultsContainer = document.getElementById('gif-results-container');
    const query = searchInput.value.trim();

    if (!query) return;
    resultsContainer.innerHTML = `<div style="color:#888; text-align:center; grid-column: 1 / -1;">Searching for "${escapeHTML(query)}"...</div>`;

    try {
        const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${config.giphyApiKey}&q=${encodeURIComponent(query)}&limit=30&rating=pg-13`);
        const json = await response.json();
        displayGifs(json.data);
    } catch (error) {
        resultsContainer.innerHTML = '<div style="color:#f77; text-align:center; grid-column: 1 / -1;">Search failed.</div>';
        console.error("Giphy Search Error:", error);
    }
}

// Function to display the GIFs in the picker
function displayGifs(gifData) {
    const resultsContainer = document.getElementById('gif-results-container');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (!gifData || gifData.length === 0) {
        resultsContainer.innerHTML = '<div style="color:#888; text-align:center; grid-column: 1 / -1;">No results found.</div>';
        return;
    }

    gifData.forEach(gif => {
        const img = document.createElement('img');
        img.src = gif.images.fixed_height_small.url;
        img.dataset.directUrl = gif.images.original.url;
        img.alt = gif.title;
        resultsContainer.appendChild(img);
    });
}

// Function to send a chosen GIF to the chat
function sendGifToChat(gifUrl) {
    const auth = firebase.auth();
    const currentUser = auth.currentUser;
    if (!currentUser || !gifUrl) return;

    const messagePayload = {
        uid: currentUser.uid,
        name: localStorage.getItem("nickname") || "Anon",
        text: gifUrl, // The message is just the URL
        time: firebase.database.ServerValue.TIMESTAMP,
        chatNameColor: localStorage.getItem("chatNameColor") || "#FFD700"
    };

    firebase.database().ref("slitherChat").push(messagePayload);
    firebase.database().ref("discordBridge").push(messagePayload);

    document.getElementById('gif-picker-modal').style.display = 'none';
    lastChatMessageTime = Date.now(); // Reset slow mode timer after sending a GIF
}


    // --- NEW: Helper function to escape HTML characters for security ---
    function escapeHTML(str) {
        const p = document.createElement('p');
        p.appendChild(document.createTextNode(str));
        return p.innerHTML;
    }


// --- REPLACEMENT: Corrected Firebase Chat Loading and Rendering System ---
function loadFirebaseChat() {
    const script1 = document.createElement('script');
    script1.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js';
    script1.onload = () => {
        const script2 = document.createElement('script');
        script2.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-database.js';
        script2.onload = () => {
            const script3 = document.createElement('script');
            script3.src = 'https://www.gstatic.com/firebasejs/8.10.0/firebase-auth.js';
            script3.onload = () => {
                const firebaseConfig = { // KEEP YOUR CONFIG PRIVATE
                    apiKey: "AIzaSyCtTloqGNdhmI3Xt0ta11vF0MQJHiKpO7Q",
                    authDomain: "chatforslither.firebaseapp.com",
                    databaseURL: "https://chatforslither-default-rtdb.firebaseio.com",
                    projectId: "chatforslither",
                    storageBucket: "chatforslither.appspot.com",
                    messagingSenderId: "1045559625491",
                    appId: "1:1045559625491:web:79eb8200eb87edac00bce6"
                };
                if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

                firebase.database().ref('/modInfo/latestVersion').once('value')
                .then(snapshot => {
                    if (snapshot.exists()) {
                        const latestVersion = snapshot.val();
                        state.versionStatus = (latestVersion === config.currentVersion) ? 'Current' : `Outdated! (v${latestVersion} is available)`;
                    } else { state.versionStatus = 'Unknown'; }
                }).catch(error => {
                    console.error("Firebase version check failed:", error);
                    state.versionStatus = 'Check Failed';
                }).finally(() => { if (typeof updateMenu === "function") updateMenu(); });

                const auth = firebase.auth();
                auth.signInAnonymously().then(async (userCredential) => {
                    const uid = userCredential.user.uid;
                    const playerDataRef = firebase.database().ref(`playerData/${uid}`);
                    playerDataRef.once('value', (snapshot) => {
                        if (!snapshot.exists()) {
                            playerDataRef.set({ rep: 0, lastRepAwardTime: 0, lastChatRepTime: 0, });
                        }
                    });
                    const nickname = localStorage.getItem("nickname") || "Anon";
                    const userRef = firebase.database().ref("onlineUsers/" + uid);
                    let snapshot;
                    try {
                        snapshot = await userRef.once('value');
                    } catch (err) { console.error("Failed to fetch profile from Firebase:", err); snapshot = null; }
                    if (snapshot && snapshot.exists()) {
                        const cloudData = snapshot.val();
                        if (cloudData.profileAvatar) localStorage.setItem("profileAvatar", cloudData.profileAvatar);
                        if (cloudData.profileMotto) localStorage.setItem("profileMotto", cloudData.profileMotto);
                    }
                    const localAvatar = localStorage.getItem("profileAvatar");
                    const localMotto = localStorage.getItem("profileMotto");
                    let needsUpdate = false;
                    const updates = {};
                    if (localAvatar && (!snapshot?.val()?.profileAvatar || snapshot.val().profileAvatar !== localAvatar)) {
                        updates.profileAvatar = localAvatar;
                        needsUpdate = true;
                    }
                    if (localMotto && (!snapshot?.val()?.profileMotto || snapshot.val().profileMotto !== localMotto)) {
                        updates.profileMotto = localMotto;
                        needsUpdate = true;
                    }
                    if (needsUpdate) await userRef.update(updates);
                    userRef.onDisconnect().remove();
                    let chatColor = localStorage.getItem("chatNameColor") || "#FFD700";
                    // This regex ensures the color is a valid 3 or 6-digit hex code.
                    if (!/^#([0-9a-fA-F]{3}){1,2}$/.test(chatColor)) {
                        chatColor = "#FFD700"; // If it's invalid, reset to default.
                        localStorage.setItem("chatNameColor", chatColor); // Correct the bad value in storage.
                    }
                    await userRef.update({ name: nickname, uid: uid, lastActive: Date.now(), chatNameColor: chatColor, modVersion: config.currentVersion });
                    setInterval(() => { userRef.update({ lastActive: Date.now() }); }, 30000);
                    loadUserChallenges(uid);
                }).catch(err => { console.error("Firebase sign-in error:", err); });

                firebase.database().ref("onlineUsers").on("value", snapshot => {
                    const users = snapshot.val() || {};
                    const onlineUsersEl = document.getElementById('mod-menu-online-users');
                    if (onlineUsersEl) {
                        const now = Date.now();
                        const usersList = Object.entries(users)
                        .filter(([_, user]) => now - (user.lastActive || 0) < 300000)
                        // SECURED CODE
                        .map(([userUid, user]) => {
                            let displayName = escapeHTML(filterProfanity(user.name || 'Anon'));
                            let nameColor = user.chatNameColor || '#FFD700';

                            // --- THIS VALIDATION IS CRITICAL ---
                            // It ensures only a valid hex color code can be used.
                            if (!/^#([0-9a-fA-F]{3}){1,2}$/.test(nameColor)) {
                                nameColor = '#FFD700'; // If it's malicious, force it to be the default yellow.
                            }
                            // --- END OF CRITICAL VALIDATION ---

                            let userIdentifier = (auth.currentUser && userUid === auth.currentUser.uid) ? ' <span style="color: #8f8; font-size:0.9em;">(You)</span>' : '';
                            if (isDev(user.uid, user.name)) displayName = rainbowTextStyle(displayName);
                            else if (isVip(user.uid, user.name)) displayName = vipGlowStyle(displayName, nameColor);
                            return `<div style="padding: 5px 2px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center;"><span style="width: 10px; height: 10px; border-radius: 50%; background-color: lime; margin-right: 8px;"></span><span class="online-username" data-uid="${user.uid}" style="color:${nameColor};font-weight:bold; flex-grow: 1; cursor:pointer;text-decoration:underline dotted;">${displayName}</span>${userIdentifier}</div>`;
                        }).join('');
                        onlineUsersEl.innerHTML = usersList || '<div style="text-align:center;color:#888;margin-top:10px;">No other users online.</div>';
                    }
                });

                // --- START OF FIXED CHAT LOADING LOGIC ---
                let chatMessagesArray = [];
                window.chatMessagesArray = chatMessagesArray;
                let latestTimeLoaded = 0;
                const chatBody = document.getElementById('mod-menu-chat-body');

                // Step 1: Load initial messages
                firebase.database().ref("slitherChat").orderByChild("time").limitToLast(config.chatMaxMessages).once("value", async (snapshot) => {
                    if (!snapshot.exists()) return;

                    snapshot.forEach(child => {
                        chatMessagesArray.push({ key: child.key, ...child.val() });
                    });

                    chatMessagesArray.sort((a, b) => a.time - b.time);
                    if (chatMessagesArray.length > 0) {
                        latestTimeLoaded = chatMessagesArray[chatMessagesArray.length - 1].time;
                    }

                    if (chatBody) {
                        chatBody.innerHTML = '';
                        for (const msg of chatMessagesArray) { await renderChatMessage(msg, chatBody, auth.currentUser?.uid); }
                        chatBody.scrollTop = chatBody.scrollHeight;
                    }

                    // Step 2: Listen for ONLY new messages from now on
                    firebase.database().ref("slitherChat").orderByChild("time").startAt(latestTimeLoaded + 1).on("child_added", async (newSnapshot) => {
                        const newMsg = { key: newSnapshot.key, ...newSnapshot.val() };
                        if (chatMessagesArray.some(m => m.key === newMsg.key)) return;

                        chatMessagesArray.push(newMsg);
                        if (chatMessagesArray.length > config.chatMaxMessages) chatMessagesArray.shift();

                        if (chatBody) {
                            while (chatBody.children.length >= config.chatMaxMessages) { chatBody.removeChild(chatBody.firstChild); }
                            await renderChatMessage(newMsg, chatBody, auth.currentUser?.uid, true);
                        }
                    });
                });
                // --- END OF FIXED CHAT LOADING LOGIC ---

                const chatInput = document.getElementById('mod-menu-chat-input');
                chatInput.addEventListener('keydown', async function (e) {
                    if (e.key === 'Enter') {
                        const now = Date.now();
                        const timeSinceLastMessage = now - lastChatMessageTime;

                        // NEW: Enforce slow mode with a better alert
                        if (timeSinceLastMessage < chatCooldown) {
                            const timeLeft = Math.ceil((chatCooldown - timeSinceLastMessage) / 1000);
                            alert(`Slow mode is active. Please wait ${timeLeft} more second(s).`);
                            e.preventDefault();
                            return;
                        }

                        e.preventDefault(); e.stopPropagation();
                        const currentUID = auth.currentUser.uid;

                        try {
                            const punishSnap = await firebase.database().ref(`chatPunishments/${currentUID}`).once('value');
                            if (punishSnap.exists()) {
                                const punishment = punishSnap.val();
                                if (punishment.type === "timeout" && Date.now() < punishment.until) {
                                    let mins = Math.ceil((punishment.until - Date.now()) / 60000);
                                    alert(`You are timed out from chat for ${mins} more minute(s).`);
                                    chatInput.value = ''; chatInput.blur(); return;
                                }
                            }
                        } catch (err) { console.error("Error checking punishment:", err); }

                        if (chatInput.value.trim()) {
                            const nickname = localStorage.getItem("nickname") || "Anon";
                            let chatColor = localStorage.getItem("chatNameColor") || "#FFD700";
                            // This regex ensures the color is a valid 3 or 6-digit hex code.
                            if (!/^#([0-9a-fA-F]{3}){1,2}$/.test(chatColor)) {
                                chatColor = "#FFD700"; // If it's invalid, reset to default.
                            }
                            const messagePayload = {
                                uid: currentUID, name: nickname, text: chatInput.value.trim(),
                                time: firebase.database.ServerValue.TIMESTAMP, // Use server time for accuracy
                                chatNameColor: chatColor // Use the validated color
                            };

                            firebase.database().ref("slitherChat").push(messagePayload);
                            firebase.database().ref("discordBridge").push(messagePayload);

                            lastChatMessageTime = Date.now();
                            chatInput.value = '';

                            // NEW: Start the visual countdown timer loop
                            if (slowModeInterval) clearInterval(slowModeInterval);
                            slowModeInterval = setInterval(updateSlowModeIndicator, 250);
                            updateSlowModeIndicator(); // Run once immediately to hide it
                        }
                        chatInput.blur();

                        const userRef = firebase.database().ref(`playerData/${currentUID}`);
                        const CHAT_REP_COOLDOWN = 5 * 60 * 1000;
                        const snapshot = await userRef.once('value');
                        if (snapshot.exists()) {
                            const lastChatTime = snapshot.val().lastChatRepTime || 0;
                            if (now - lastChatTime > CHAT_REP_COOLDOWN) {
                                await userRef.child('rep').transaction(currentRep => (currentRep || 0) + 1);
                                await userRef.child('lastChatRepTime').set(now);
                                console.log("Awarded 1 REP for chatting.");
                            }
                        }
                    }
                }); // This is the closing of the keydown listener

                // --- CHALLENGE STATE MANAGEMENT ---
                let completedChallenges = new Set(); // Stores IDs of challenges done THIS session/lifetime

                // Load completed challenges from Firebase on startup
                // --- MODIFIED: Load Challenges & Handle Weekly Reset ---
                function loadUserChallenges(uid) {
                    const userChallengesRef = firebase.database().ref(`playerData/${uid}/challenges`);

                    userChallengesRef.once('value').then(snapshot => {
                        if (!snapshot.exists()) {
                            startChallengeWatcher(); // No data, just start watching
                            return;
                        }

                        const data = snapshot.val();
                        const now = Date.now();
                        const updates = {};
                        let hasUpdates = false;

                        Object.keys(data).forEach(challengeId => {
                            const completionTime = data[challengeId];

                            // If completionTime is true (old version) or older than 7 days
                            // We mark it for deletion (resetting the challenge)
                            if (completionTime === true || (now - completionTime > WEEKLY_RESET_MS)) {
                                updates[challengeId] = null; // Null deletes the key from Firebase
                                hasUpdates = true;
                                console.log(`Resetting weekly challenge: ${challengeId}`);
                            } else {
                                // It's still valid for this week
                                completedChallenges.add(challengeId);
                            }
                        });

                        // Apply resets if needed
                        if (hasUpdates) {
                            userChallengesRef.update(updates);
                        }

                        // Update the UI to show checkmarks
                        if (typeof updateMenu === "function") updateMenu();

                        // Start watching game loop
                        startChallengeWatcher();
                    });
                }

                // --- SECURED CHALLENGE LISTENER ---
                let lastChallengeClaimTime = 0; // Prevent spamming

                window.addEventListener("message", async (e) => {
                    if (e.data.type !== "143X_CHALLENGE_UPDATE") return;

                    // 1. SECURITY: Anti-Spam Check
                    const now = Date.now();
                    if (now - lastChallengeClaimTime < 2000) return; // Cannot claim more than once every 2 seconds

                    const { score, kills } = e.data;
                    const uid = firebase.auth().currentUser?.uid;
                    if (!uid) return;

                    // 2. SECURITY: Double check against the window state (Sanity Check)
                    // If the message says "Score 50000" but the game var says "Score 10", it's a fake signal.
                    let engineScore = 0;
                    try {
                         // Calculate score directly from game engine formula to verify
                         if (window.slither && window.fpsls && window.slither.sct) {
                            const sct = window.slither.sct;
                            const fam = window.slither.fam || 0;
                            if(sct < window.fpsls.length) {
                                engineScore = Math.floor((window.fpsls[sct] + fam / window.fmlts[sct] - 1) * 15 - 5);
                            }
                         }
                    } catch(err) {}

                    // Allow a small margin of error for lag, but reject obvious fakes
                    // If the event score is drastically higher than actual game score, ignore it.
                    if (score > (engineScore + 500)) {
                        console.warn("Security: Score mismatch detected. Challenge ignored.");
                        return;
                    }

                    // Loop through config and check requirements
                    for (const c of challengeList) {
                        // Skip if already done
                        if (completedChallenges.has(c.id)) continue;

                        let achieved = false;
                        if (c.reqType === 'score' && score >= c.reqVal) achieved = true;
                        if (c.reqType === 'kill' && kills >= c.reqVal) achieved = true;

                        if (achieved) {
                            lastChallengeClaimTime = now; // Set Cooldown

                            // 1. Mark as locally complete immediately
                            completedChallenges.add(c.id);

                            // 2. Send REP transaction
                            const userRef = firebase.database().ref(`playerData/${uid}`);

                            try {
                                await userRef.child('rep').transaction(rep => {
                                    return (rep || 0) + c.reward;
                                });

                                // 3. Save challenge completion to DB (permanent record)
                                await userRef.child('challenges').update({ [c.id]: firebase.database.ServerValue.TIMESTAMP });

                                // 4. Show Notification
                                showChallengeNotification(c);

                                // 5. Announce in Chat
                                const nickname = localStorage.getItem("nickname") || "Anon";
                                firebase.database().ref("slitherChat").push({
                                    uid: "system",
                                    name: "System",
                                    text: `🏆 ${nickname} unlocked: ${c.name} (+${c.reward} REP)`,
                                    time: firebase.database.ServerValue.TIMESTAMP,
                                    chatNameColor: "#FFD700"
                                });

                                // F. Update Menu to show checkmark immediately
                                if (typeof updateMenu === "function") updateMenu();
                            } catch (err) {
                                console.error("Security: Transaction failed (Possible cheat attempt or network error).");
                            }
                        }
                    }
                });

                // --- VISUAL NOTIFICATION FUNCTION ---
                function showChallengeNotification(challenge) {
                    const div = document.createElement('div');
                    div.style.cssText = `
                        position: fixed; top: 20%; left: 50%; transform: translate(-50%, -50%);
                        background: linear-gradient(90deg, #FFD700, #FFA500);
                        padding: 2px; border-radius: 8px; z-index: 10000;
                        box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
                        animation: slideDownFade 4s forwards; pointer-events: none;
                    `;

                    div.innerHTML = `
                        <div style="background: #222; padding: 15px 25px; border-radius: 6px; text-align: center;">
                            <div style="color: #FFD700; font-weight: 900; font-size: 1.4em; text-transform: uppercase; margin-bottom: 5px;">
                                Challenge Complete!
                            </div>
                            <div style="color: #fff; font-size: 1.1em; font-weight: bold;">
                                ${challenge.name}
                            </div>
                            <div style="color: #ccc; font-size: 0.9em; margin-bottom: 8px;">
                                ${challenge.desc}
                            </div>
                            <div style="background: rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 4px; display: inline-block;">
                                <span style="font-size: 1.2em;">💎</span> +${challenge.reward} REP
                            </div>
                        </div>
                    `;

                    // Add animation style if not exists
                    if (!document.getElementById('challenge-anim-style')) {
                        const style = document.createElement('style');
                        style.id = 'challenge-anim-style';
                        style.textContent = `
                            @keyframes slideDownFade {
                                0% { opacity: 0; transform: translate(-50%, -80%); }
                                15% { opacity: 1; transform: translate(-50%, -50%); }
                                85% { opacity: 1; transform: translate(-50%, -50%); }
                                100% { opacity: 0; transform: translate(-50%, -20%); }
                            }
                        `;
                        document.head.appendChild(style);
                    }

                    document.body.appendChild(div);
                    setTimeout(() => div.remove(), 4000);
                }


                chatInput.addEventListener('input', function() {
                    // When the user types, check if a cooldown is active
                    if (Date.now() - lastChatMessageTime < chatCooldown) {
                        // If it is, and the timer isn't already running, start it
                        if (!slowModeInterval) {
                            slowModeInterval = setInterval(updateSlowModeIndicator, 250);
                        }
                    }
                    // Always run the update function on input to correctly show/hide the timer
                    updateSlowModeIndicator();
                });
                // ^^^ END OF NEW LISTENER ^^^
            };
            document.head.appendChild(script3);
        };
        document.head.appendChild(script2);
    };
    document.head.appendChild(script1);
}

    // --- THIS IS THE FINAL, WORKING CHAT RENDERING FUNCTION ---
async function renderChatMessage(msg, chatBodyElement, currentUid, shouldScroll = false) {
    if (!msg || !msg.uid) return;

    // Helper function to validate hex color
    const isValidHexColor = (color) => /^#([0-9a-fA-F]{3}){1,2}$/.test(color);
    let userColor = msg.chatNameColor || '#FFD700';
    if (!isValidHexColor(userColor)) {
        userColor = '#FFD700';
    }

    let nameHtml;
    let roleTagHTML = '';
    let displayName;

    const isSystemMessage = systemAccounts.includes(msg.uid);
    const isDiscordBot = msg.uid === 'discord_bot';

    // 1. Determine the display name
    if (isDiscordBot) {
        const nameMatch = msg.name.match(/^Discord\((.*)\)$/);
        displayName = nameMatch && nameMatch[1] ? escapeHTML(nameMatch[1]) : 'Discord User';
    } else {
        displayName = escapeHTML(msg.name || 'Anon');
    }

    // 2. Build the name HTML with styles and roles
    if (isDiscordBot) {
        nameHtml = `<span style="color:${userColor};font-weight:bold;">${displayName}</span>`;
        roleTagHTML = ` <span style="background: #7289DA; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; font-weight: 700; vertical-align:middle;">DISCORD</span>`;
    } else if (isDev(msg.uid)) {
        nameHtml = `<span class="chat-username" data-uid="${msg.uid}" style="cursor:pointer;">${rainbowTextStyle(displayName)}</span>`;
        roleTagHTML = ` <span style="background: #E91E63; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; font-weight: 700; vertical-align:middle;">DEV</span>`;
    } else if (isVip(msg.uid, msg.name)) {
        nameHtml = `<span class="chat-username" data-uid="${msg.uid}" style="cursor:pointer;">${vipGlowStyle(displayName, userColor)}</span>`;
        roleTagHTML = ` <span style="background: #9C27B0; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; font-weight: 700; vertical-align:middle;">VIP</span>`;
    } else if (isSystemMessage) {
        displayName = 'System';
        nameHtml = `<span style="color:${userColor};font-weight:bold;">${displayName}</span>`;
        roleTagHTML = ` <span style="background: #e74c3c; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; font-weight: 700; vertical-align:middle;">SYSTEM</span>`;
    } else {
        nameHtml = `<span class="chat-username" data-uid="${msg.uid}" style="color:${userColor};font-weight:bold;cursor:pointer;">${displayName}</span>`;
    }

    // 3. Handle message text, links, and images
    let finalMessage = '';
    const imageRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp))/i;
    const imageMatch = msg.text.match(imageRegex);

    if (imageMatch) {
        // Priority #1: If it's a direct image link, embed it.
        finalMessage = `<br><img src="${imageMatch[0]}" class="chat-image-preview" onclick="window.open('${imageMatch[0]}', '_blank')">`;
    } else if (isDev(msg.uid) || isSystemMessage || isDiscordBot) {
        // Priority #2: If the user is a Dev/Admin, System, or Bot, auto-linkify their text.
        // This also allows them to use other HTML like <b> tags.
        finalMessage = linkifyForDevs(msg.text);
    } else {
        // For everyone else: Sanitize everything, escape HTML, and replace links with the Discord invite.
        finalMessage = escapeHTML(filterProfanity(replaceLinksWithDiscord(msg.text)));
    }

    // 4. Assemble and render
    const el = document.createElement('div');
    const borderColor = (msg.uid === currentUid) ? state.menuColor : userColor;
    const bgColor = (msg.uid === currentUid) ? hexToRgba(state.menuColor, 0.12) : 'rgba(255,255,255,0.04)';
    el.style.cssText = `margin-bottom: 8px; word-break: break-word; background: ${bgColor}; padding: 8px 12px; border-radius: 6px; color: #ddd; font-family: inherit; font-size: 14px; line-height: 1.5; border-left: 3px solid ${borderColor};`;

    const timestamp = new Date(msg.time).toLocaleTimeString([], { hour12: true, hour: '2-digit', minute: '2-digit' });
    el.innerHTML = `<span style="color:#888; font-size:0.9em; margin-right:5px;">${timestamp}</span> <b>${nameHtml}${roleTagHTML}:</b> ${finalMessage}`;

    chatBodyElement.appendChild(el);

    if (shouldScroll || chatBodyElement.scrollTop >= chatBodyElement.scrollHeight - chatBodyElement.clientHeight - 150) {
        chatBodyElement.scrollTop = chatBodyElement.scrollHeight;
    }
}

    // --- HELPER FUNCTION -
        function linkifyForDevs(inputText) {
            // This function finds URLs and wraps them in <a> tags. It does NOT escape other HTML.
            const urlPattern = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
            return inputText.replace(urlPattern, '<a href="$1" target="_blank" style="color:#87CEEB;text-decoration:underline;">$1</a>');
        }

    function createTrailOverlayCanvas() {
        let overlay = document.getElementById('snake-trail-overlay');
        if (overlay) {
            overlay.style.display = 'block'; // <-- Always show overlay when trail is ON
            return overlay;
        }
        const gameCanvas = document.querySelector('canvas');
        if (!gameCanvas) return null;

        overlay = document.createElement('canvas');
        overlay.id = 'snake-trail-overlay';
        overlay.style.position = 'fixed';
        overlay.style.left = gameCanvas.style.left || '0px';
        overlay.style.top = gameCanvas.style.top || '0px';
        overlay.style.pointerEvents = 'none';
        overlay.style.zIndex = '9000';
        overlay.width = window.innerWidth; // Match window size as per your original
        overlay.height = window.innerHeight; // Match window size
        overlay.style.display = 'block'; // <-- Make sure it's visible when created
        document.body.appendChild(overlay);

        // Adjust overlay size on resize
        window.addEventListener('resize', () => {
            if (overlay) { // Check if overlay still exists
                overlay.width = window.innerWidth;
                overlay.height = window.innerHeight;
            }
        });

        return overlay;
    }

    function toggleChatVisible() {
        state.features.chatVisible = !state.features.chatVisible;
        const chatContainer = document.getElementById('mod-menu-chat-container');
        if (chatContainer) {
            chatContainer.style.display = state.features.chatVisible ? 'flex' : 'none';
        }
        if (typeof updateMenu === "function") updateMenu(); // Ensure updateMenu is called
    }

    function addChatMessage(messageContent, isSystemMessage = false) {
       // This function is largely for local messages if ever needed.
       // Firebase handles the main chat display.
       console.log("Local addChatMessage called (primarily for debug/local system messages):", messageContent);
       // If you want to display these in the chat UI, you would add DOM manipulation here
       // similar to renderChatMessage but without Firebase specific data.
    }

    function updateChatDisplay() {
        // This function is effectively replaced by the real-time updates
        // from Firebase handled by renderChatMessage.
        // console.log("updateChatDisplay called (mostly deprecated).");
    }


    function makeDraggable(element, handle) {
        handle.addEventListener('mousedown', function(e) {
            // Check if the event target is the handle itself or a child that shouldn't prevent dragging (e.g. text in header)
            // And ensure it's a left-click
            if ((e.target.dataset.draggable === 'true' || handle.contains(e.target)) && e.button === 0) {
                 // Prevent dragging if mousedown on an interactive element within the handle (e.g., a button in chat header)
                if (e.target.tagName === 'BUTTON' || e.target.tagName === 'INPUT' || e.target.tagName === 'A' || e.target.closest('button, input, a')) {
                    return;
                }

                e.preventDefault(); // Prevent text selection
                state.draggingElement = element;
                state.dragStartX = e.clientX;
                state.dragStartY = e.clientY;
                state.elementStartX = parseInt(element.style.left, 10) || 0; // Use current position
                state.elementStartY = parseInt(element.style.top, 10) || 0;
            }
        });
    }

    function makeResizable(element, handle) {
        handle.addEventListener('mousedown', function(e) {
            if (e.target.dataset.resizable === 'true' && e.button === 0) {
                e.preventDefault();
                state.resizingElement = element;
                state.dragStartX = e.clientX;
                state.dragStartY = e.clientY;
                state.elementStartWidth = parseInt(element.style.width, 10) || 300;
                state.elementStartHeight = parseInt(element.style.height, 10) || 200;
            }
        });
    }

    // --- START: Slow Mode Indicator Logic ---
    let slowModeInterval = null; // This will hold our timer

    function updateSlowModeIndicator() {
        const indicator = document.getElementById('slow-mode-indicator');
        const chatInput = document.getElementById('mod-menu-chat-input');
        if (!indicator || !chatInput) return; // Exit if elements don't exist

        const now = Date.now();
        const timeSinceLastMessage = now - lastChatMessageTime;

        if (timeSinceLastMessage < chatCooldown && chatInput.value.length > 0) {
            // If in cooldown and user is typing, show the timer
            const timeLeft = Math.ceil((chatCooldown - timeSinceLastMessage) / 1000);
            indicator.textContent = `Slow Mode: ${timeLeft}s`;
            indicator.style.display = 'block';
            chatInput.style.textIndent = '115px'; // Push the typed text to the right
        } else {
            // Otherwise, hide the timer
            indicator.style.display = 'none';
            chatInput.style.textIndent = '0px'; // Reset text position
            if (slowModeInterval) {
                clearInterval(slowModeInterval); // Stop the timer loop
                slowModeInterval = null;
            }
        }
    }
    // --- END: Slow Mode Indicator Logic ---

    // === NEW CENTRAL SCALING FUNCTION ===
    function updateCombinedScale() {
        const menu = document.getElementById('mod-menu');
        const chat = document.getElementById('mod-menu-chat-container');
        // Calculate the final scale needed to counteract browser zoom
        const finalScale = state.uiScale / state.browserZoom;

        if (menu) {
            menu.style.transformOrigin = (menu.style.right && menu.style.right !== 'auto') ? 'top right' : 'top left';
            menu.style.transform = `scale(${finalScale})`;
        }
        if (chat) {
            chat.style.transformOrigin = 'top left';
            chat.style.transform = `scale(${finalScale})`;
        }
    }



    function applyUIScale() {
        // This function now only calls the central handler.
        updateCombinedScale();

        // We still need to scale the server box separately as it's not a fixed element.
        const serverBox = document.getElementById('custom-server-box');
        if (serverBox) {
            serverBox.style.transformOrigin = 'center top';
            serverBox.style.transform = `scale(${state.uiScale})`;
        }


        // Apply scaling to the main menu
        if (menu) {
            if (menu.style.right && menu.style.right !== 'auto') {
                menu.style.transformOrigin = 'top right';
            } else {
                menu.style.transformOrigin = 'top left';
            }
            menu.style.transform = `scale(${scaleValue})`;
        }
        // Apply scaling to the chat window
        if (chat) {
            chat.style.transformOrigin = 'top left';
            chat.style.transform = `scale(${scaleValue})`;
        }
        // Apply scaling to the server IP box
        if (serverBox) {
            serverBox.style.transformOrigin = 'center top'; // Scales from the top center
            serverBox.style.transform = `scale(${scaleValue})`;
        }
    }

    document.addEventListener('mousemove', function(e) {
        if (state.draggingElement) {
            const dx = e.clientX - state.dragStartX;
            const dy = e.clientY - state.dragStartY;
            let newX = state.elementStartX + dx;
            let newY = state.elementStartY + dy;

            // Boundary checks (optional, but good for usability)
            const eleRect = state.draggingElement.getBoundingClientRect();
            newX = Math.max(0, Math.min(newX, window.innerWidth - eleRect.width));
            newY = Math.max(0, Math.min(newY, window.innerHeight - eleRect.height));


            state.draggingElement.style.left = `${newX}px`;
            state.draggingElement.style.top = `${newY}px`;

            const id = state.draggingElement.id;
            if (id === 'mod-menu') { state.uiLayout.menu.x = newX; state.uiLayout.menu.y = newY; }
            else if (id === 'mod-menu-chat-container') { state.uiLayout.chat.x = newX; state.uiLayout.chat.y = newY; }
        }

        if (state.resizingElement) {
            const dx = e.clientX - state.dragStartX;
            const dy = e.clientY - state.dragStartY;
            const newWidth = Math.max(250, state.elementStartWidth + dx); // Min width
            const newHeight = Math.max(200, state.elementStartHeight + dy); // Min height

            state.resizingElement.style.width = `${newWidth}px`;
            state.resizingElement.style.height = `${newHeight}px`;

            const id = state.resizingElement.id;
            if (id === 'mod-menu') { state.uiLayout.menu.width = newWidth; state.uiLayout.menu.height = newHeight; }
            else if (id === 'mod-menu-chat-container') { state.uiLayout.chat.width = newWidth; state.uiLayout.chat.height = newHeight; }
        }
    });

    document.addEventListener('mouseup', function() {
        if (state.draggingElement || state.resizingElement) {
            localStorage.setItem('modMenuUILayout', JSON.stringify(state.uiLayout));
        }
        state.draggingElement = null;
        state.resizingElement = null;
    });

    // === MENU CREATION (Structural Change) ===
    const menu = document.createElement('div');
    menu.id = 'mod-menu';
    menu.style.position = 'fixed';
    menu.style.top = state.uiLayout.menu.y !== null ? `${state.uiLayout.menu.y}px` : '50px';
    menu.style.left = state.uiLayout.menu.x !== null ? `${state.uiLayout.menu.x}px` :
                      (config.menuPosition === 'left' ? '50px' :
                      (config.menuPosition === 'center' ? '50%' : 'auto'));
    if (config.menuPosition === 'center' && state.uiLayout.menu.x === null) {
        menu.style.transform = 'translateX(-50%)';
    }
    menu.style.right = state.uiLayout.menu.x !== null ? 'auto' :
                      (config.menuPosition === 'right' ? '50px' : 'auto');

    // --- ENHANCED MENU STYLES ---
    menu.style.background = 'rgba(46, 46, 52, 0.95)'; // --menu-bg with opacity
    menu.style.border = `1px solid ${hexToRgba(state.menuColor, 0.5)}`;
    menu.style.borderRadius = '12px';
    menu.style.zIndex = '9999';
    menu.style.color = '#e0e0e0'; // --text-color
    menu.style.fontFamily = "'Segoe UI', Arial, sans-serif"; // --font-family
    menu.style.fontSize = '14px';
    menu.style.boxShadow = '0 8px 32px rgba(0,0,0,0.35)'; // Softer, larger shadow
    menu.style.backdropFilter = 'blur(10px)';
    menu.style.webkitBackdropFilter = 'blur(10px)'; // For Safari
    menu.style.transition = 'border-color 0.3s, box-shadow 0.3s';
    menu.style.userSelect = "none";
    menu.style.overflow = 'hidden';
    document.body.appendChild(menu);

    // Persistent Draggable Header for Main Menu
    const menuDraggableHeader = document.createElement('div');
    menuDraggableHeader.id = 'mod-menu-draggable-header';
    menuDraggableHeader.dataset.draggable = 'true'; // For makeDraggable
    // Styles for this header will be set in updateMenu to react to state.menuColor and state.menuName
    menu.appendChild(menuDraggableHeader);

    // Persistent Content Area for Main Menu
    const menuContentArea = document.createElement('div');
    menuContentArea.id = 'mod-menu-content-area';
    menuContentArea.style.padding = '0 20px 15px 20px'; // Padding for content below header
    menuContentArea.style.maxHeight = 'calc(90vh - 80px)'; // Max height with some margin
    menuContentArea.style.overflowY = 'auto'; // Scrollable content
    menuContentArea.style.overflowX = 'hidden';
    // Custom scrollbar for content area
    menuContentArea.style.scrollbarWidth = 'thin';
    menuContentArea.style.scrollbarColor = `${state.menuColor} rgba(0,0,0,0.2)`;
    menu.appendChild(menuContentArea);

    makeDraggable(menu, menuDraggableHeader); // Initialize dragging

    // --- START: Add Resize Handle for Main Menu ---
    const menuResizeHandle = document.createElement('div');
    menuResizeHandle.id = 'mod-menu-resize-handle';
    menuResizeHandle.style.cssText = `
        position: absolute;
        right: 0;
        bottom: 0;
        width: 18px; /* A good size for grabbing */
        height: 18px;
        cursor: nwse-resize; /* The diagonal resize cursor */
        z-index: 10000; /* Ensures it's on top of menu content */
        opacity: 0.6;
        transition: opacity 0.2s, border-color 0.3s;
    `;
    menuResizeHandle.dataset.resizable = 'true';
    menuResizeHandle.onmouseenter = () => { menuResizeHandle.style.opacity = '1'; };
    menuResizeHandle.onmouseleave = () => { menuResizeHandle.style.opacity = '0.6'; };
    menu.appendChild(menuResizeHandle);

    // Now, connect the handle to the resizing logic function
    makeResizable(menu, menuResizeHandle);
    // --- END: Add Resize Handle ---

    // (modal injection):
// REPLACE the old block with this NEW, FIXED block
// (modal injection):
if (!document.getElementById('keybind-modal-overlay')) {
    const modalHTML = `
    <div id="keybind-modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:10002; background:rgba(0,0,0,0.75); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;">
        <div id="keybind-modal" style="background:#2E2E34; border-radius:10px; padding:30px 35px; box-shadow:0 6px 25px rgba(0,0,0,0.4); display:flex; flex-direction:column; align-items:center; min-width:320px; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color:#fff; font-size:1.4em; font-weight:600; margin-bottom:12px;">Rebind Key</div>
            <div id="keybind-modal-action" style="color:#b0b0b0; font-size:1.15em; margin-bottom:18px;">Action: Placeholder</div>
            <div style="color:#fff; font-size:1.1em; margin-bottom:24px;">Press a key to assign... <br><small>(Or scroll mouse wheel)</small></div>
            <button id="keybind-modal-cancel" style="background:#555; color:#fff; border:none; padding:9px 25px; border-radius:5px; font-size:0.95em; cursor:pointer; transition: background-color 0.2s;">Cancel</button>
        </div>
    </div>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = modalHTML;
    document.body.appendChild(tempDiv.firstElementChild);

    // Attach the click listener for the cancel button RIGHT HERE <<< FIX
    // This guarantees the button exists before we try to find it.
    const cancelBtn = document.getElementById('keybind-modal-cancel');
    if (cancelBtn) {
        // We can reuse the existing `closeKeybindModal` function. <<< FIX
        // It already does everything we need (hides the modal and resets the state).
        cancelBtn.onclick = closeKeybindModal;
    }
}



    // --- NEW: Edit Profile Modal ---
    if (!document.getElementById('edit-profile-modal-overlay')) {
        const profileModalStyle = document.createElement('style');
        profileModalStyle.textContent = `
            #edit-profile-modal-overlay {
                display: none; position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                z-index: 10003; background: rgba(0,0,0,0.75);
                align-items: center; justify-content: center; font-family: 'Segoe UI', Arial, sans-serif;
            }
            #edit-profile-modal {
                background: #2E2E34; border-radius: 10px; padding: 25px 30px;
                box-shadow: 0 6px 25px rgba(0,0,0,0.4); display:flex; flex-direction:column;
                min-width: 400px; border: 1px solid rgba(255,255,255,0.1);
            }
            .profile-modal-title {
                color: #fff; font-size: 1.4em; font-weight: 600; margin-bottom: 20px; text-align: center;
            }
            .profile-modal-label {
                color: #bbb; font-size: 0.9em; margin-bottom: 5px;
            }
            .profile-modal-input {
                width: 100%; padding: 10px; margin-bottom: 15px; background: #222;
                border: 1px solid #555; border-radius: 5px; color: #eee; font-size: 1em;
                box-sizing: border-box; transition: border-color 0.2s;
            }
            .profile-modal-input:focus {
                outline: none; border-color: ${state.menuColor};
            }
            .profile-modal-buttons {
                display: flex; justify-content: flex-end; gap: 10px; margin-top: 10px;
            }
            #profile-modal-save { background: ${state.menuColor}; color: #fff; }
            #profile-modal-cancel { background: #555; color: #fff; }
            .profile-modal-button {
                border: none; padding: 9px 20px; border-radius: 5px;
                font-size: 0.95em; cursor: pointer; transition: background-color 0.2s;
            }
            #profile-modal-save:hover { background: ${adjustColor(state.menuColor, -15)}; }
            #profile-modal-cancel:hover { background: #666; }
        `;
        document.head.appendChild(profileModalStyle);

        const profileModalHTML = `
        <div id="edit-profile-modal-overlay">
            <div id="edit-profile-modal">
                <div class="profile-modal-title">Edit Your Profile</div>

                <label for="profile-avatar-input" class="profile-modal-label">Avatar URL (.png, .jpg, .gif)</label>
                <input id="profile-avatar-input" type="text" class="profile-modal-input" placeholder="https://i.imgur.com/example.png">

                <label for="profile-motto-input" class="profile-modal-label">Motto / Status</label>
                <input id="profile-motto-input" type="text" class="profile-modal-input" placeholder="The best slither player!" maxlength="60">

                <div id="profile-modal-status" style="color: #ffc107; text-align: center; height: 18px; margin-top: 5px; font-size: 0.9em;"></div>

                    <div class="profile-modal-buttons">
                    <button id="profile-themes-btn" class="profile-modal-button" style="background: #673AB7; margin-right: auto;">🎨 Themes</button> <!-- NEW BUTTON -->
                    <button id="profile-modal-cancel" class="profile-modal-button">Cancel</button>
                    <button id="profile-modal-save" class="profile-modal-button">Save</button>
                </div>
            </div>
        </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = profileModalHTML;
        document.body.appendChild(tempDiv.firstElementChild);

        // Attach listeners for the modal's buttons RIGHT AWAY
        // Attach listeners for the modal's buttons RIGHT AWAY
        document.getElementById('profile-modal-cancel').onclick = () => {
            const editModal = document.getElementById('edit-profile-modal-overlay');
            if (editModal) {
                editModal.style.display = 'none';
                delete editModal.dataset.targetUid; // Add this line to clear the target
            }
        };
        // The 'Save' button logic will be handled later.
    }


    // --- NEW: PROFILE THEMES MODAL ---
    if (!document.getElementById('themes-modal-overlay')) {
        const themesModalStyle = document.createElement('style');
        themesModalStyle.textContent = `
            .themes-modal-overlay {
                display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%;
                background: rgba(0,0,0,0.7); z-index: 10004; align-items: center; justify-content: center;
            }
            .themes-modal-content {
                background: #2E2E34; border: 1px solid var(--menu-color, #4CAF50); border-radius: 10px;
                padding: 20px; width: 500px; max-height: 70vh; display: flex; flex-direction: column;
            }
            .themes-grid {
                display: grid; grid-template-columns: 1fr 1fr; gap: 15px; overflow-y: auto; padding: 10px;
            }
            .theme-preview {
                border: 2px solid #555; border-radius: 8px; padding: 15px; cursor: pointer;
                transition: all 0.2s ease; text-align: center;
            }
            .theme-preview:hover {
                border-color: var(--menu-color, #4CAF50);
                transform: translateY(-3px);
            }
            .theme-preview.selected {
                border-color: #FFD700;
                box-shadow: 0 0 10px #FFD700;
            }
        `;
        document.head.appendChild(themesModalStyle);

        const themesModalHTML = `
            <div id="themes-modal-overlay" class="themes-modal-overlay">
                <div class="themes-modal-content">
                    <h2 style="text-align:center; color:var(--menu-color, #4CAF50); margin-top:0;">Select a Profile Theme</h2>
                    <div class="themes-grid">
                        <!-- Theme options will be added here by the script -->
                    </div>
                    <button id="close-themes-modal" style="margin-top: 20px; padding: 10px; border-radius: 5px; border: none; background: #555; color: #fff; cursor: pointer;">Close</button>
                </div>
            </div>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = themesModalHTML;
        document.body.appendChild(tempDiv.firstElementChild);
    }

    // --- NEW: Send REP Modal ---
    if (!document.getElementById('send-rep-modal-overlay')) {
        const repModal = document.createElement('div');
        repModal.id = 'send-rep-modal-overlay';
        repModal.style = `
            display:none; position:fixed; top:0; left:0; width:100vw; height:100vh;
            z-index:10006; background:rgba(0,0,0,0.7); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;`;
        repModal.innerHTML = `
        <div style="background:#2E2E34;padding:28px 33px;border-radius:10px;box-shadow:0 6px 25px rgba(0,0,0,0.4);min-width:320px;display:flex;flex-direction:column;align-items:center; border: 1px solid rgba(255,255,255,0.1);">
            <div id="send-rep-title" style="color:#fff;font-size:1.3em;font-weight:600;margin-bottom:20px;">Send REP to Player</div>
            <div style="margin-bottom:15px; display:flex; align-items:center; gap: 8px;">
                <input id="send-rep-amount" type="number" min="1" value="1" style="width:100px;padding:8px 10px;border-radius:5px;border:1px solid #555;background:#222;color:#eee;font-size:1.1em;text-align:center;">
                <span style="color:#fff; font-size:1.1em; font-weight:bold;">REP</span>
            </div>
            <div id="send-rep-status" style="color:#ffc107; height: 20px; margin-bottom: 10px;"></div>
            <div style="display:flex;gap:10px; margin-top:10px;">
                <button id="send-rep-cancel-btn" style="padding:9px 20px;border-radius:5px;background:#555;color:#fff;border:none;cursor:pointer; font-size: 0.95em; transition: background 0.2s;">Cancel</button>
                <button id="send-rep-confirm-btn" style="padding:9px 20px;border-radius:5px;background:#4CAF50;color:#fff;border:none;cursor:pointer; font-size: 0.95em; transition: background 0.2s;">Confirm & Send</button>
            </div>
        </div>
        `;
        document.body.appendChild(repModal);
    }

    // --- NEW: Timeout Modal ---
    if (!document.getElementById('timeout-modal-overlay')) {
        const timeoutModal = document.createElement('div');
        timeoutModal.id = 'timeout-modal-overlay';
        timeoutModal.style = `
            display:none; position:fixed; top:0; left:0; width:100vw; height:100vh;
            z-index:10005; background:rgba(0,0,0,0.7); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;`;
        timeoutModal.innerHTML = `
        <div style="background:#2E2E34;padding:28px 33px;border-radius:10px;box-shadow:0 6px 25px rgba(0,0,0,0.4);min-width:320px;display:flex;flex-direction:column;align-items:center; border: 1px solid rgba(255,255,255,0.1);">
            <div style="color:#fff;font-size:1.3em;font-weight:600;margin-bottom:20px;">Timeout User</div>
            <div style="margin-bottom:15px; display:flex; align-items:center; gap: 8px;">
            <input id="timeout-value" type="number" min="1" max="9999" value="5" style="width:70px;padding:8px 10px;border-radius:5px;border:1px solid #555;background:#222;color:#eee;font-size:1em;text-align:center;">
            <select id="timeout-unit" style="padding:8px 10px;border-radius:5px;border:1px solid #555;background:#222;color:#eee;font-size:1em;">
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
            </select>
            </div>
            <div style="display:flex;gap:10px; margin-top:10px;">
            <button id="timeout-cancel-btn" style="padding:9px 20px;border-radius:5px;background:#555;color:#fff;border:none;cursor:pointer; font-size: 0.95em; transition: background 0.2s;">Cancel</button>
            <button id="timeout-confirm-btn" style="padding:9px 20px;border-radius:5px;background:#c9302c;color:#fff;border:none;cursor:pointer; font-size: 0.95em; transition: background 0.2s;">Confirm Timeout</button>
            </div>
        </div>
        `;
        document.body.appendChild(timeoutModal);

        // --- Add Listeners for the Timeout Modal ---
        document.getElementById('timeout-cancel-btn').onclick = () => {
            document.getElementById('timeout-modal-overlay').style.display = 'none';
        };

        document.getElementById('timeout-confirm-btn').onclick = async () => {
            const overlay = document.getElementById('timeout-modal-overlay');
            const uid = overlay.dataset.targetUid;
            const username = overlay.dataset.targetName;
            const value = parseInt(document.getElementById('timeout-value').value, 10);
            const unit = document.getElementById('timeout-unit').value;

            if (!uid || !username || !value || value < 1) {
                alert("Invalid timeout value.");
                return;
            }

            let mins = value;
            if (unit === 'hours') mins *= 60;
            if (unit === 'days') mins *= 1440; // 60 * 24

            const until = Date.now() + mins * 60 * 1000;

            try {
                await firebase.database().ref(`chatPunishments/${uid}`).set({
                    type: "timeout",
                    until,
                    by: firebase.auth().currentUser.uid,
                    name: username
                });

                await firebase.database().ref("slitherChat").push({
                    uid: "system",
                    name: "System",
                    text: `${username} was timed out from chat for ${value} ${unit}.`,
                    time: Date.now(),
                    chatNameColor: "#e91e63"
                });

                alert(`${username} timed out successfully.`);
                overlay.style.display = 'none';
                document.getElementById('profile-popup')?.remove();
            } catch(err) {
                alert(`Failed to timeout user: ${err.message}`);
            }
        };
    }

    // --- START: FINAL GAME SUITE MODAL (with Blackjack) ---
if (!document.getElementById('game-modal-overlay')) {
    const gameModalHTML = `
        <div id="game-modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:10010; background:rgba(0,0,0,0.85); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;">
            <div id="game-modal-content" style="background:#23232a; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.5); display:flex; flex-direction:column; min-width:600px; max-width: 90vw; border: 1px solid var(--menu-color, #4CAF50); overflow:hidden;">
                <!-- Game Tabs -->
                <div id="game-tabs" style="display:flex; background:rgba(0,0,0,0.2);">
                    <button class="game-tab-btn active" data-gametab="spinner">💎 Daily Spinner</button>
                    <button class="game-tab-btn" data-gametab="slots">🎰 Slot Machine</button>
                    <button class="game-tab-btn" data-gametab="roulette">🎲 Roulette</button>
                    <button class="game-tab-btn" data-gametab="blackjack">🃏 Blackjack</button>
                </div>
                <div id="game-content-area" style="padding:25px 35px; max-height: 80vh; overflow-y: auto;">
                    <div id="player-rep-display" style="color: #ddd; margin-bottom: 20px; font-size: 1.2em; text-align:center; font-weight:bold; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px;">Your REP: Loading...</div>

                    <!-- Spinner Game -->
                    <div id="game-spinner" class="game-container" style="display:flex; flex-direction:column; align-items:center;"></div>
                    <!-- Slot Machine Game -->
                    <div id="game-slots" class="game-container" style="display:none; flex-direction:column; align-items:center;"></div>
                    <!-- Roulette Game -->
                    <div id="game-roulette" class="game-container" style="display:none; flex-direction:column; align-items:center;"></div>

                    <!-- Blackjack Game -->
                    <div id="game-blackjack" class="game-container" style="display:none; flex-direction:column; align-items:center; width:100%;">
                        <h2 style="color:var(--menu-color, #4CAF50); margin:0 0 15px 0;">Blackjack</h2>
                        <div id="blackjack-table" style="width:100%;">
                            <!-- Dealer's Hand -->
                            <div class="blackjack-hand-area">
                                <h3 class="blackjack-hand-title">Dealer's Hand (<span id="blackjack-dealer-score">0</span>)</h3>
                                <div id="blackjack-dealer-cards" class="blackjack-cards"></div>
                            </div>
                            <!-- Player's Hand -->
                            <div class="blackjack-hand-area">
                                <h3 class="blackjack-hand-title">Your Hand (<span id="blackjack-player-score">0</span>)</h3>
                                <div id="blackjack-player-cards" class="blackjack-cards"></div>
                            </div>
                        </div>
                        <div id="blackjack-result" class="game-result-text" style="font-size:1.5em;"></div>
                        <!-- Bet Controls -->
                        <div id="blackjack-bet-controls" style="margin:15px 0; display:flex; flex-direction:column; align-items:center; gap:10px;">
                            <div>
                                <label for="blackjack-bet-amount" style="color:#ccc; margin-right:10px; font-weight:bold;">BET AMOUNT:</label>
                                <input id="blackjack-bet-amount" type="number" min="1" value="10" style="width:100px; text-align:center; font-size:1.1em; padding: 8px; border-radius:5px; border:1px solid #555; background:#222; color:#eee;">
                            </div>
                            <button id="blackjack-deal-btn" class="mod-menu-button" style="font-size: 1.1em; padding: 10px 20px; background-color: #27ae60;">Deal Cards</button>
                        </div>
                        <!-- Action Controls -->
                        <div id="blackjack-action-controls" style="display:none; gap: 15px; margin-top:15px;">
                            <button id="blackjack-hit-btn" class="mod-menu-button" style="font-size: 1.1em; padding: 10px 20px;">Hit</button>
                            <button id="blackjack-stand-btn" class="mod-menu-button" style="font-size: 1.1em; padding: 10px 20px; background-color:#c0392b;">Stand</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = gameModalHTML;
    document.body.appendChild(tempDiv.firstElementChild);

    // Copy original game content into the new structure
    document.getElementById('game-spinner').innerHTML = `<h2 style="color:var(--menu-color, #4CAF50); margin:0 0 20px 0;">Daily REP Spinner</h2><div id="spinner-display" style="font-size: 4em; font-weight: bold; color: #fff; background: #111; padding: 20px 40px; border-radius: 10px; margin-bottom: 20px; min-width: 150px; text-align: center;">0</div><div id="spinner-result" class="game-result-text"></div><button id="spin-button" class="mod-menu-button" style="font-size: 1.2em; padding: 12px 25px;">Spin for REP!</button><div id="spin-timer" style="color: #aaa; margin-top: 15px;"></div>`;
    // ** NEW 3x3 SLOT MACHINE HTML **
    document.getElementById('game-slots').innerHTML = `
        <h2 style="color:var(--menu-color, #4CAF50); margin:0 0 20px 0;">3x3 REP Slot Machine</h2>
        <div id="slot-reels" style="display:grid; grid-template-columns: repeat(3, 1fr); gap:15px; background:#111; padding: 20px; border-radius:10px; margin-bottom:20px; border: 2px solid #555;">
            <div class="slot-reel">💎</div><div class="slot-reel">💎</div><div class="slot-reel">💎</div>
            <div class="slot-reel">7️⃣</div><div class="slot-reel">7️⃣</div><div class="slot-reel">7️⃣</div>
            <div class="slot-reel">🍋</div><div class="slot-reel">🍋</div><div class="slot-reel">🍋</div>
        </div>
        <div id="slot-result" class="game-result-text"></div>
        <div style="display:flex; flex-direction:column; align-items:center; gap:10px;">
            <div>
                <label for="slot-bet-amount" style="color:#ccc; margin-right:10px; font-weight:bold;">BET AMOUNT:</label>
                <input id="slot-bet-amount" type="number" min="1" value="5" style="width:100px; text-align:center; font-size:1.1em; padding: 8px; border-radius:5px; border:1px solid #555; background:#222; color:#eee;">
            </div>
            <button id="slot-spin-btn" class="mod-menu-button" style="font-size: 1.2em; padding: 12px 25px;">Spin!</button>
        </div>
    `;
    document.getElementById('game-roulette').innerHTML = `<h2 style="color:var(--menu-color, #4CAF50); margin:0 0 15px 0;">REP Roulette</h2><div id="roulette-wheel-container" style="position:relative; width:200px; height:200px; margin-bottom:15px;"><div id="roulette-wheel"></div><div id="roulette-ball-marker" style="position: absolute; top: -5px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 15px solid white;"></div></div><div id="roulette-result" class="game-result-text"></div><div id="roulette-bet-controls" style="width:100%; text-align:center;"><div style="margin-bottom:15px;"><label for="roulette-bet-amount" style="color:#ccc; margin-right:10px; font-weight:bold;">BET AMOUNT:</label><input id="roulette-bet-amount" type="number" min="1" value="10" style="width:100px; text-align:center; font-size:1.1em; padding: 8px; border-radius:5px; border:1px solid #555; background:#222; color:#eee;"></div><div id="roulette-bets"><button class="roulette-bet-btn" data-bet="red" style="background:#c0392b; color:white;">Red (2x)</button><button class="roulette-bet-btn" data-bet="black" style="background:#2c3e50; color:white;">Black (2x)</button><button class="roulette-bet-btn" data-bet="green" style="background:#27ae60; color:white;">Green (14x)</button></div></div>`;

    const style = document.createElement('style');
    style.textContent = `
        .slot-reel.win-line {
            background-color: #28a745; /* Green background for winning reels */
            box-shadow: 0 0 15px #28a745;
            transform: scale(1.1);
            transition: all 0.2s ease-in-out;
        }
        .game-tab-btn { flex: 1; background: transparent; border: none; color: #aaa; font-size: 1.1em; padding: 15px; cursor: pointer; transition: all 0.2s; border-bottom: 3px solid transparent; }
        .game-tab-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .game-tab-btn.active { color: var(--menu-color, #4CAF50); border-bottom-color: var(--menu-color, #4CAF50); }
        .game-result-text { color: #FFD700; font-size: 1.2em; height: 25px; margin: 15px 0; font-weight: bold; text-align:center; }
        .slot-reel { font-size: 4em; width: 80px; height: 100px; line-height: 100px; text-align:center; background: #2a2a2e; color: #fff; border-radius: 8px; text-shadow: 0 0 5px #000; }
        #roulette-wheel { width: 200px; height: 200px; border-radius: 50%; background-image: conic-gradient(green 0 9.7deg, red 9.7deg 19.4deg, black 19.4deg 29.1deg, red 29.1deg 38.8deg, black 38.8deg 48.5deg, red 48.5deg 58.2deg, black 58.2deg 67.9deg, red 67.9deg 77.6deg, black 77.6deg 87.3deg, red 87.3deg 97deg, black 97deg 106.7deg, red 106.7deg 116.4deg, black 116.4deg 126.1deg, red 126.1deg 135.8deg, black 135.8deg 145.5deg, red 145.5deg 155.2deg, black 155.2deg 164.9deg, red 164.9deg 174.6deg, black 174.6deg 184.3deg, red 184.3deg 194deg, black 194deg 203.7deg, red 203.7deg 213.4deg, black 213.4deg 223.1deg, red 223.1deg 232.8deg, black 232.8deg 242.5deg, red 242.5deg 252.2deg, black 252.2deg 261.9deg, red 261.9deg 271.6deg, black 271.6deg 281.3deg, red 281.3deg 291deg, black 291deg 300.7deg, red 300.7deg 310.4deg, black 310.4deg 320.1deg, red 320.1deg 329.8deg, black 329.8deg 339.5deg, red 339.5deg 349.2deg, black 349.2deg 360deg); border: 5px solid #8c6432; transition: transform 4s cubic-bezier(0.2, 0.8, 0.7, 1); }
        .roulette-bet-btn { padding: 10px 15px; font-size: 1em; margin: 0 5px; cursor: pointer; border: 2px solid #555; color: #fff; border-radius: 5px; font-weight: bold; }
        .roulette-bet-btn.selected { border-color: #FFD700; box-shadow: 0 0 10px #FFD700; transform: scale(1.05); }
        .blackjack-hand-area { margin-bottom: 20px; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 15px; }
        .blackjack-hand-title { margin: 0 0 10px 0; color: #ccc; border-bottom: 1px solid #444; padding-bottom: 8px; }
        .blackjack-cards { display: flex; gap: 10px; min-height: 105px; }
        .blackjack-card { width: 70px; height: 100px; border: 2px solid #999; border-radius: 8px; background: white; color: black; display: flex; flex-direction: column; justify-content: space-between; padding: 5px; font-size: 1.5em; font-weight: bold; }
        .blackjack-card.red { color: #c0392b; }
        .blackjack-card-hidden { background: repeating-linear-gradient(45deg, #555, #555 10px, #444 10px, #444 20px); }
    `;
    document.head.appendChild(style);
}
// --- END: FINAL GAME SUITE MODAL ---

    // --- NEW: REP Leaderboard Modal ---
    if (!document.getElementById('rep-leaderboard-modal')) {
        const leaderboardModal = document.createElement('div');
        leaderboardModal.id = 'rep-leaderboard-modal';
        // We set the border color here using a CSS variable that our other code already updates
        leaderboardModal.style = `
            display:none; position:fixed; top:0; left:0; width:100vw; height:100vh;
            z-index:10010; background:rgba(0,0,0,0.75); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;`;
        leaderboardModal.innerHTML = `
            <div style="background:#23232a; border-radius:12px; padding:20px; width:450px; max-height: 80vh; display: flex; flex-direction: column; box-shadow:0 6px 25px rgba(0,0,0,0.4); border: 1px solid var(--menu-color, #4CAF50); position:relative;">
            <button id="rep-leaderboard-close" style="position:absolute;top:10px;right:10px;font-size:1.5em;background:none;border:none;color:#aaa;cursor:pointer;line-height:1;">×</button>
            <h2 style="color:var(--menu-color, #4CAF50); margin-top:0; margin-bottom: 15px; text-align:center; padding-bottom: 10px; border-bottom: 1px solid #444;">Leaderboard</h2>

            <!-- NEW TAB BUTTONS -->
            <div style="display: flex; border-bottom: 1px solid #444; margin-bottom: 10px;">
                <button id="tab-btn-rep" class="leaderboard-tab active">🏆 Top 100 REP</button>
                <button id="tab-btn-recent" class="leaderboard-tab">🕓 Recent Players</button>
            </div>

            <!-- Content Area for REP leaderboard -->
            <div id="rep-leaderboard-content" style="display:block; overflow-y: auto; padding-right: 10px;"></div>

            <!-- NEW Content Area for Recent Players -->
            <div id="recent-players-content" style="display:none; overflow-y: auto; padding-right: 10px;"></div>
        </div>
        `;
        document.body.appendChild(leaderboardModal);

        // Attach the listener to the close button right away
        document.getElementById('rep-leaderboard-close').onclick = () => {
            leaderboardModal.style.display = 'none';
        };
    }

    // --- NEW: Cleanup for Expired Punishments ---
    // This runs in the background to remove old timeouts from the database.
    setInterval(async () => {
        try {
            const punishRef = firebase.database().ref("chatPunishments");
            const snap = await punishRef.orderByChild('until').endAt(Date.now()).once('value');
            if (snap.exists()) {
                const updates = {};
                snap.forEach(child => {
                    updates[child.key] = null; // Mark for deletion
                });
                punishRef.update(updates);
                console.log('Cleaned up expired punishments.');
            }
        } catch (err) {
            console.error('Error during punishment cleanup:', err);
        }
    }, 5 * 60 * 1000); // Check every 5 minutes


    // --- ENHANCED FPS/PING DISPLAYS ---
    const fpsDisplay = document.createElement('div');
    fpsDisplay.id = 'fps-display';
    fpsDisplay.style.cssText = `
        position: fixed; bottom: 10px; right: 10px; color: #e0e0e0;
        font-family: 'Segoe UI', Arial, sans-serif; font-size: 13px; z-index: 10000;
        display: ${state.features.fpsDisplay ? 'block' : 'none'};
        background: rgba(15,15,18,0.85); padding: 5px 10px; border-radius: 5px;
        border: 1px solid rgba(255,255,255,0.1); backdrop-filter: blur(4px);
        box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    `;
    document.body.appendChild(fpsDisplay);

    // Ping display removed from here, integrated into simplified menu if needed, or can be added back similarly
    // const pingDisplay = document.createElement('div'); ...

    // --- ENHANCED CIRCLE VISUAL ---
    const circleVisual = document.createElement('div');
    circleVisual.id = 'circle-visual';
    circleVisual.style.cssText = `
        position: fixed; border: 2px dashed ${hexToRgba(state.menuColor, 0.7)};
        border-radius: 50%; pointer-events: none; transform: translate(-50%, -50%);
        z-index: 9998; display: none; transition: all 0.2s ease;
        box-shadow: 0 0 12px ${hexToRgba(state.menuColor, 0.3)}, inset 0 0 8px ${hexToRgba(state.menuColor, 0.2)};
    `;
    document.body.appendChild(circleVisual);

    // Chat overlay (for updates/maintenance) - style slightly enhanced
    const chatOverlay = document.createElement('div');
    chatOverlay.id = 'mod-menu-chat-overlay';
    chatOverlay.style.cssText = `
        position: fixed; left: 50%; top: 50%; transform: translate(-50%, -50%);
        background: rgba(20,20,24,0.95); border: 1px solid ${state.menuColor};
        border-radius: 8px; padding: 25px 30px; z-index: 10000; color: #e0e0e0;
        font-family: 'Segoe UI', Arial, sans-serif; font-size: 18px; text-align: center;
        display: none; box-shadow: 0 5px 20px rgba(0,0,0,0.4);
    `;
    chatOverlay.textContent = 'Chat feature is currently under maintenance.';
    document.body.appendChild(chatOverlay);


    async function promptForUniqueNickname() {
        let nickname;
        let isValidNickname = false;

        while (!isValidNickname) {
            nickname = prompt("Enter a nickname for chat (1-20 chars, letters, numbers, and underscores_ only):");

            if (nickname === null) {
                nickname = "Anon";
                isValidNickname = true;
                break;
            }

            nickname = nickname.trim();

            if (nickname === "") {
                nickname = "Anon";
                isValidNickname = true;
                break;
            }

            if (nickname.length < 1 || nickname.length > 20) {
                alert("Nickname must be between 1 and 20 characters long.");
                continue;
            }

            if (!/^[a-zA-Z0-9_]+$/.test(nickname)) {
                alert("Nickname can only contain letters, numbers, and underscores (_).");
                continue;
            }

            if (nickname.toLowerCase() === "anon") {
                 isValidNickname = true;
                 break;
            }

            let exists = false;
            if (typeof firebase !== "undefined" && firebase.database) {
                try {
                    const snapshot = await firebase.database().ref("onlineUsers")
                                         .orderByChild("name_lowercase")
                                         .equalTo(nickname.toLowerCase())
                                         .once('value');
                    exists = snapshot.exists();
                } catch (e) {
                    console.warn("Firebase nickname uniqueness check failed during prompt:", e);
                    exists = false;
                }
            } else {
                console.warn("promptForUniqueNickname: Firebase not available to check uniqueness.");
            }

            if (exists) {
                alert("That nickname is already in use. Please choose another.");
            } else {
                isValidNickname = true;
            }
        }

        localStorage.setItem("mod_chat_username", nickname); // Save to safe slot
        localStorage.setItem("nickname", nickname); // Also save to game as backup
        if (firebase && firebase.auth && firebase.auth().currentUser) {
            const userRef = firebase.database().ref(`onlineUsers/${firebase.auth().currentUser.uid}`);
            userRef.update({ name: nickname, name_lowercase: nickname.toLowerCase() })
                .catch(err => console.error("Error updating nickname in Firebase during prompt:", err));
        }
        return nickname;
    }

    (async function ensureUniqueNickname() {
        if (!localStorage.getItem("nickname")) {
            await promptForUniqueNickname();
        } else {
            const nickname = localStorage.getItem("nickname");
            // Basic check if Firebase is likely loaded - more robust checks are in loadFirebaseChat
            if (typeof firebase !== "undefined" && firebase.database) {
                 try {
                    const snapshot = await firebase.database().ref("onlineUsers").once('value');
                    const users = snapshot.val() || {};
                    const currentUserUid = firebase.auth().currentUser ? firebase.auth().currentUser.uid : null;
                    // If someone else (not current user) is using this nickname, prompt again
                    const isTakenByOther = Object.entries(users).some(([uid, user]) =>
                        uid !== currentUserUid && user.name && user.name.toLowerCase() === nickname.toLowerCase()
                    );
                    if (isTakenByOther) {
                        alert("That nickname is already in use by another player. Please choose another.");
                        await promptForUniqueNickname();
                    }
                } catch (e) {
                    console.warn("Firebase check for nickname failed, proceeding:", e);
                }
            }
        }
        createChatSystem();
        loadFirebaseChat();
        syncChatBoxWithMenu(); // Initial sync after creation
    })();

    // === NEW BROWSER ZOOM DETECTOR ===
    function detectBrowserZoom() {
        // window.devicePixelRatio is the most reliable way to track browser zoom.
        state.browserZoom = window.devicePixelRatio;
        // Now, update the elements' scale to counteract the new browser zoom level.
        updateCombinedScale();
    }

    // --- FIX 2: SMOOTH DISCO SKIN (Local Only) ---
    let discoInterval = null;
    function toggleDiscoSkin() {
        if (state.features.discoSkin) {
            // Prevent multiple intervals
            if (discoInterval) clearInterval(discoInterval);

            discoInterval = setInterval(() => {
                if (window.slither && window.setSkin) {
                    // Cycle skins locally
                    const randomSkin = Math.floor(Math.random() * 65);
                    // Use the game's native setSkin function safely
                    // Passing 'null' as the 3rd argument is crucial based on game.js analysis
                    window.setSkin(window.slither, randomSkin, null);
                }
            }, 300); // Increased to 300ms to reduce lag spikes
        } else {
            if (discoInterval) {
                clearInterval(discoInterval);
                discoInterval = null;
            }
            // Restore default skin if possible (or just leave it on the last random one)
            if (window.slither && window.setSkin) {
                // Try to restore original skin ID if we saved it, otherwise default to 0
                let originalSkin = localStorage.getItem('snakercv');
                originalSkin = originalSkin ? parseInt(originalSkin) : 0;
                window.setSkin(window.slither, originalSkin, null);
            }
        }
    }

        // =========================================================
    // === UNIVERSAL BACKGROUND FIX (Home + In-Game) ===
    // =========================================================

    // 1. CSS INJECTION: Forces the canvas element to be see-through
    (function() {
        const cssId = 'transparency-style-fix';
        if (!document.getElementById(cssId)) {
            const style = document.createElement('style');
            style.id = cssId;
            style.innerHTML = `
                canvas {
                    background: transparent !important;
                    background-color: transparent !important;
                }
            `;
            document.head.appendChild(style);
        }
    })();

    // 2. SETUP FUNCTION: Runs when you click "Set"
    window.setCustomBackground = function(url) {
        // Save state
        state.savedBgUrl = url;
        if (url) localStorage.setItem('modCustomBgUrl', url);
        else localStorage.removeItem('modCustomBgUrl');

        const hasUrl = (url && url.trim() !== '');

        if (hasUrl) {
            // Apply to the HTML Body (Home Screen)
            document.body.style.backgroundImage = `url(${url})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center center';
            document.body.style.backgroundRepeat = 'no-repeat';
            document.body.style.backgroundAttachment = 'fixed';

            // Disable "Black BG" mod to prevent conflict
            state.features.blackBg = false;
        } else {
            document.body.style.backgroundImage = '';
        }

        // Force a resize to update the renderer
        if (window.resize) window.resize();
    };

    // 3. THE IN-GAME LOOP: Forces the game engine to be transparent
    function forceGameTransparency() {
        requestAnimationFrame(forceGameTransparency);

        const hasUrl = (state.savedBgUrl && state.savedBgUrl.trim() !== '');

        // Only run if the Game Engine (PIXI/WebGL) is active
        if (window.app && window.app.renderer) {

            if (hasUrl) {
                // A. Force Renderer Transparency (The "Dark Grey" Void)
                if (window.app.renderer.background) {
                    window.app.renderer.background.alpha = 0;
                }

                // B. Force WebGL Clear Color (Deepest Layer)
                if (window.app.renderer.gl) {
                    window.app.renderer.gl.clearColor(0, 0, 0, 0);
                }

                // C. Hide the "Blurry Tiles" (The 'bgees' variable from game.js)
                if (window.bgees && Array.isArray(window.bgees)) {
                    for (let i = 0; i < window.bgees.length; i++) {
                        if (window.bgees[i].bgee) {
                            window.bgees[i].bgee.visible = false;
                        }
                    }
                }
            } else {
                // Restore defaults if image is removed
                if (window.app.renderer.background) {
                    window.app.renderer.background.alpha = 1;
                }
                if (window.bgees) {
                    for (let i = 0; i < window.bgees.length; i++) {
                        if (window.bgees[i].bgee) {
                            window.bgees[i].bgee.visible = true;
                        }
                    }
                }
            }
        }
    }

    // Start the loop immediately
    forceGameTransparency();

    // Apply saved background on startup
    if (state.savedBgUrl) {
        window.setCustomBackground(state.savedBgUrl);
    }




   // --- THOROUGHLY REVAMPED updateMenu FUNCTION ---
    function updateMenu() {
        const menuColor = state.menuColor;
        const menuDraggableHeader = document.getElementById('mod-menu-draggable-header');
        const menuContentArea = document.getElementById('mod-menu-content-area');

        // --- VERSION CHECKER LOGIC ADDED HERE ---
        let versionColor = '#FFD700'; // Default Yellow (Checking...)
        if (state.versionStatus === 'Current') {
            versionColor = '#90EE90'; // Green
        } else if (state.versionStatus.startsWith('Outdated')) {
            versionColor = '#FF7F7F'; // Red
        } else if (state.versionStatus === 'Unknown' || state.versionStatus === 'Check Failed') {
            versionColor = '#aaa'; // Gray
        }

        // Update persistent draggable header styles
        if (menuDraggableHeader) {
            menuDraggableHeader.style.cssText = `
                padding: 12px 20px; /* Consistent padding */
                margin-bottom: 10px; /* Space before content */
                background: linear-gradient(to bottom, ${hexToRgba(menuColor, 0.3)}, ${hexToRgba(menuColor, 0.2)});
                border-bottom: 1px solid ${hexToRgba(menuColor, 0.4)};
                cursor: move;
                display: flex;
                justify-content: space-between;
                align-items: center;
                user-select: none;
            `;

            // --- UPDATED HEADER HTML TO SHOW VERSION STATUS ---
            menuDraggableHeader.innerHTML = `
                <div>
                    <h2 id="mod-menu-title" style="margin:0; color:#fff; font-size:1.4em; font-weight:600; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                        ${state.menuName}
                    </h2>
                    <!-- This line displays the status (Current/Outdated) in the correct color -->
                    <div style="color:${versionColor}; font-size:0.85em; font-weight:bold; margin-top:2px;">
                        ${state.versionStatus}
                    </div>
                </div>
                <div style="color:#ccc; font-size:0.9em; text-align:right;">
                    <div>${config.currentVersion}</div>
                </div>
            `;
        }

        // Update main menu border and shadow
        menu.style.border = `1px solid ${hexToRgba(menuColor, 0.6)}`;
        menu.style.boxShadow = `0 6px 25px ${hexToRgba(menuColor, 0.15)}`;
        circleVisual.style.border = `2px dashed ${hexToRgba(menuColor, 0.7)}`;
        circleVisual.style.boxShadow = `0 0 12px ${hexToRgba(menuColor, 0.3)}, inset 0 0 8px ${hexToRgba(menuColor, 0.2)}`;


        // --- START: Update Menu Resize Handle Style ---
        const menuResizeHandle = document.getElementById('mod-menu-resize-handle');
        if (menuResizeHandle) {
            // Creates a visual triangle in the corner using borders
            menuResizeHandle.style.borderRight = `2px solid ${hexToRgba(menuColor, 0.8)}`;
            menuResizeHandle.style.borderBottom = `2px solid ${hexToRgba(menuColor, 0.8)}`;
        }
        // --- END: Update Menu Resize Handle Style ---

        // Update scrollbar color for content area
        if (menuContentArea) {
            menuContentArea.style.scrollbarColor = `${menuColor} rgba(0,0,0,0.2)`;
        }


        const arrow = state.showCustomization ? '▼' : '▶';
        const inputStyle = `padding:8px 10px; border-radius:5px; border:1px solid #454548; background-color:#2c2c30; color:#e0e0e0; font-size:14px; box-sizing:border-box; transition: border-color 0.2s, box-shadow 0.2s;`;
        const focusStyle = `this.style.borderColor='${menuColor}'; this.style.boxShadow='0 0 0 2px ${hexToRgba(menuColor, 0.3)}';`;
        const blurStyle = `this.style.borderColor='#454548'; this.style.boxShadow='none';`;

        const buttonStyle = (bgColor = menuColor, textColor = '#fff') =>
            `padding:8px 15px; border-radius:6px; border:none; color:${textColor}; font-size:14px; font-weight:500; cursor:pointer; transition:background-color 0.2s, box-shadow 0.2s; background-color:${bgColor};`;
        const buttonHoverStyle = (bgColor = menuColor) => `this.style.backgroundColor='${adjustColor(bgColor, -15)}'; this.style.boxShadow='0 2px 8px rgba(0,0,0,0.15)';`;
        const buttonLeaveStyle = (bgColor = menuColor) => `this.style.backgroundColor='${bgColor}'; this.style.boxShadow='none';`;


        if (state.simplified) {
            menu.style.width = state.uiLayout.menu.width !== null ? `${state.uiLayout.menu.width}px` : '340px'; // Slightly wider simplified menu
            menuContentArea.innerHTML = `
                <div style="display:flex; justify-content:flex-end; margin-bottom:10px;">
                     <button id="default-menu-btn" title="Expand menu" style="${buttonStyle(menuColor)}; padding: 6px 12px; font-size: 13px;"
                        onmouseover="${buttonHoverStyle(menuColor)}" onmouseout="${buttonLeaveStyle(menuColor)}">
                        Full Menu
                    </button>
                </div>
                <div style="background:${hexToRgba(menuColor,0.08)}; padding:12px 15px; border-radius:8px; margin-bottom:15px; border: 1px solid ${hexToRgba(menuColor,0.2)};">
                    <div style="font-size:1.1em; margin-bottom:10px; color:${menuColor}; font-weight:600; text-align:center; padding-bottom:8px; border-bottom: 1px solid ${hexToRgba(menuColor,0.2)};">
                        Quick Status
                    </div>
                    <div style="display: grid; grid-template-columns: auto 1fr; gap: 8px 15px; font-size:14px; line-height:1.8;">
                        <span><b>Perf Mode:</b></span> <span style="color:#87CEEB; text-align:right;">Low (Optimized)</span>
                        <span><b>Zoom:</b></span> <span style="text-align:right;">${Math.round(100 / state.zoomFactor)}%</span>
                        <span><b>FPS:</b></span> <span style="color:#90EE90; text-align:right;">${state.fps}</span>
                        <span><b>Server:</b></span> <span style="color:#FFD700; text-align:right;">${state.features.showServer ? (state.server || 'N/A') : 'Hidden'}</span>
                        <span><b>Chat:</b></span> <span style="color:${state.features.chatVisible ? '#90EE90' : '#FF7F7F'}; text-align:right;">${state.features.chatVisible ? 'ON' : 'OFF'}</span>
                        <span><b>Keybinds:</b></span> <span style="color:${state.features.keybindsEnabled ? '#90EE90' : '#FF7F7F'}; text-align:right;">${state.features.keybindsEnabled ? 'ON' : 'OFF'}</span>
                        <span><b>Ping:</b></span> <span id="ping-value-simplified" style="color:#FFD700; text-align:right;">${state.ping} ms</span>
                    </div>
                </div>
                 <div style="text-align:center; font-size:12px; color:#888; margin-top:15px; padding-top:10px; border-top:1px solid #444; line-height:1.6;">
                    Press <strong>${state.keybinds.toggleMenu.toUpperCase()}</strong> to toggle menu
                </div>
            `;
            // Logic for simplified menu button
            setTimeout(() => {
                const btn = document.getElementById('default-menu-btn');
                if (btn) {
                    btn.onclick = () => {
                        state.simplified = false;
                        sessionStorage.setItem('modMenuSimplified', 'false');
                        state.features.performanceMode = parseInt(localStorage.getItem('prevPerformanceMode')) || 2; // Restore
                        applyPerformanceMode();
                        updateMenu();
                    };
                }
                 // Update ping display in simplified menu
                const pingValueDisplay = document.getElementById("ping-value-simplified");
                if (pingValueDisplay) pingValueDisplay.textContent = `${state.ping} ms`;
            }, 0);

             if (state.features.performanceMode !== 1) {
                state.features.performanceMode = 1;
                applyPerformanceMode();
            }
            return; // End simplified menu update
        }




           // --- ENHANCED CHALLENGE HTML GENERATOR (PREMIUM BATTLE PASS LOOK) ---
        let challengeRowsHTML = '';
        try {
            if (typeof challengeList !== 'undefined' && typeof completedChallenges !== 'undefined') {
                challengeRowsHTML = challengeList.map(c => {
                    const isDone = completedChallenges.has(c.id);

                    // Dynamic Styles
                    const bgStyle = isDone
                        ? 'background: linear-gradient(90deg, rgba(76, 175, 80, 0.15), rgba(76, 175, 80, 0.05)); border-left: 3px solid #4CAF50;'
                        : 'background: rgba(255, 255, 255, 0.03); border-left: 3px solid #555;';

                    const titleColor = isDone ? '#fff' : '#aaa';
                    const descColor = isDone ? '#888' : '#666';
                    // Auto-select icon based on type
                    const icon = isDone ? '✅' : (c.reqType === 'kill' ? '💀' : '🧬');
                    const rewardColor = isDone ? '#FFD700' : '#887000';
                    const glow = isDone ? 'text-shadow: 0 0 8px rgba(255, 215, 0, 0.6);' : '';
                    const opacity = isDone ? '1' : '0.7';

                    return `
                    <div style="display:flex; align-items:center; margin-bottom: 8px; padding: 8px 12px; border-radius: 4px; transition: all 0.2s; ${bgStyle} opacity: ${opacity};">

                        <!-- Icon -->
                        <div style="font-size: 1.4em; margin-right: 12px; min-width: 25px; text-align:center;">
                            ${icon}
                        </div>

                        <!-- Info -->
                        <div style="flex: 1;">
                            <div style="font-weight: 700; color: ${titleColor}; font-size: 0.95em; letter-spacing: 0.5px;">${c.name.toUpperCase()}</div>
                            <div style="font-size: 0.8em; color: ${descColor}; font-style: italic;">${c.desc}</div>
                        </div>

                        <!-- Reward -->
                        <div style="text-align: right; min-width: 70px;">
                            <div style="color: ${rewardColor}; font-weight: 900; font-size: 1em; ${glow}">
                                +${c.reward.toLocaleString()}
                            </div>
                            <div style="font-size: 0.7em; color: ${isDone ? '#4CAF50' : '#555'}; font-weight:bold; text-transform:uppercase;">
                                ${isDone ? 'CLAIMED' : 'REP'}
                            </div>
                        </div>
                    </div>`;
                }).join('');
            }
        } catch (e) {
            console.error("Challenge HTML Error", e);
            challengeRowsHTML = "<div style='color:#f55; padding:10px; text-align:center;'>Error loading challenges</div>";
        }

       // Full Menu
        menu.style.width = state.uiLayout.menu.width !== null ? `${state.uiLayout.menu.width}px` : '480px'; // Wider full menu

        let menuHtml = `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <div>
                <span id="customization-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; font-weight:bold; font-size:1.05em;">
                    ${arrow} Menu Customization
                </span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
                <button id="simplify-menu-btn" title="Simplify menu" style="${buttonStyle('#5a5a5e')}; padding: 6px 12px; font-size: 13px;"
                    onmouseover="${buttonHoverStyle('#5a5a5e')}" onmouseout="${buttonLeaveStyle('#5a5a5e')}">Simplify</button>
                <button id="open-keybinds-menu-btn" style="${buttonStyle()}; padding: 6px 12px; font-size: 13px;"
                     onmouseover="${buttonHoverStyle()}" onmouseout="${buttonLeaveStyle()}">Keybinds</button>
                <button id="open-games-menu-btn" style="${buttonStyle('#4a4a4e')}; padding: 6px 12px; font-size: 13px;"
                    onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">Mini Games</button>
            </div>
        </div>

        <div id="customization-section" style="display:${state.showCustomization ? 'block' : 'none'}; background:${hexToRgba(menuColor,0.08)}; padding:15px; border-radius:8px; margin-bottom:20px; border: 1px solid ${hexToRgba(menuColor,0.2)};">
            <div style="display:grid; grid-template-columns: 1fr auto; gap:10px; align-items:center; margin-bottom:12px;">
                <input id="mod-menu-name-input" type="text" placeholder="Menu Name..." value="${state.menuName.replace(/"/g,'&quot;')}" style="${inputStyle} width:100%;" onfocus="${focusStyle}" onblur="${blurStyle}">
                <button id="mod-menu-name-btn" style="${buttonStyle(menuColor)}; padding: 8px 12px;" onmouseover="${buttonHoverStyle()}" onmouseout="${buttonLeaveStyle()}">Set Name</button>
            </div>
            <div style="display:flex; gap:15px; align-items:center; justify-content:start;">
                <div style="display:flex; align-items:center; gap:5px;">
                     <label for="mod-menu-color-input" style="color:${menuColor}; font-size:14px; cursor:pointer;">Theme:</label>
                     <input id="mod-menu-color-input" type="color" value="${state.menuColor}" style="width:28px; height:28px; border:none; outline:2px solid ${menuColor}; border-radius:5px; cursor:pointer; background:transparent;">
                </div>
                <div style="display:flex; align-items:center; gap:5px;">
                    <label for="chat-name-color-input" style="color:${menuColor}; font-size:14px; cursor:pointer;">Chat Name:</label>
                    <input id="chat-name-color-input" type="color" value="${localStorage.getItem("chatNameColor") || "#FFD700"}" style="width:28px; height:28px; border:none; outline:2px solid ${localStorage.getItem("chatNameColor") || "#FFD700"}; border-radius:5px; cursor:pointer; background:transparent;">
                </div>
            </div>
        </div>
        `;

        menuHtml += `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom:20px">
            <!-- LEFT COLUMN -->
            <div>
                <!-- MOVEMENT SECTION -->
                <div id="movement-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-top:0; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showMovement ? '▼' : '▶'} Movement
                </div>
                <div id="movement-section" style="display:${state.showMovement ? 'block' : 'none'}; margin-bottom:15px;">
                    <p><strong>${state.keybinds.circleRestriction.toUpperCase()}: Circle Restrict:</strong> <span style="color:${state.features.circleRestriction ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.circleRestriction ? 'ON' : 'OFF'}</span></p>
                    <p><strong>${state.keybinds.circleSmaller.toUpperCase()}/${state.keybinds.circleLarger.toUpperCase()}: Circle Size:</strong> <span style="float:right;">${state.circleRadius}px</span></p>
                    <p><strong>${state.keybinds.autoCircle.toUpperCase()}: Bot Movement:</strong> <span style="color:${state.features.autoCircle ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.autoCircle ? 'ON' : 'OFF'}</span></p>
                    <p><strong>${state.keybinds.autoBoost.toUpperCase()}: Auto Boost:</strong> <span style="color:${state.features.autoBoost ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.autoBoost ? 'ON' : 'OFF'}</span></p>
                    <p id="food-bot-toggle" style="cursor:pointer; margin:0;"><strong>${(state.keybinds.foodBot || 'X').toUpperCase()}: Food Bot:</strong> <span style="color:${state.features.foodBot ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.foodBot ? 'ON' : 'OFF'}</span></p>
                </div>

                <!-- ZOOM SECTION -->
                <div id="zoom-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showZoom ? '▼' : '▶'} Zoom
                </div>
                <div id="zoom-section" style="display:${state.showZoom ? 'block' : 'none'}; margin-bottom:15px;">
                    ${!isDamnBruh ? `
                        <p><strong>${state.keybinds.zoomIn.toUpperCase()}: Zoom In</strong></p>
                        <p><strong>${state.keybinds.zoomOut.toUpperCase()}: Zoom Out</strong></p>
                        <p><strong>${state.keybinds.zoomReset.toUpperCase()}: Reset Zoom</strong></p>
                    ` : `
                        <p id="damnbruh-zoom-toggle" style="cursor:pointer; margin:0;">
                            <strong>Canvas Zoom (Scroll):</strong>
                            <span style="color:${state.features.damnbruhZoom ? '#90EE90' : '#FF7F7F'}; float:right;">
                                ${state.features.damnbruhZoom ? 'ON' : 'OFF'}
                            </span>
                        </p>
                        <div style="font-size: 12px; color: #aaa; margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.1);">
                            <strong>Tip:</strong> For better page zoom, hold <strong>Ctrl</strong> and use your <strong>Mouse Wheel</strong>.
                        </div>
                    `}
                </div>

                <!-- UTILITIES SECTION -->
                <div id="utilities-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showUtilities ? '▼' : '▶'} Utilities
                </div>
                <div id="utilities-section" style="display:${state.showUtilities ? 'block' : 'none'}; margin-bottom:15px;">
                    <p><strong>${(state.keybinds.autoRespawn || 'S').toUpperCase()}: Auto Respawn:</strong> <span style="color:${state.features.autoRespawn ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.autoRespawn ? 'ON' : 'OFF'}</span></p>
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px;">
                        <span><strong>${(state.keybinds.neonLine || 'E').toUpperCase()}: Neon Line:</strong></span>
                        <div style="display:flex; gap:8px; align-items:center;">
                            <span style="color:${state.features.neonLine ? '#90EE90' : '#FF7F7F'};">${state.features.neonLine ? 'ON' : 'OFF'}</span>
                            <input id="neon-line-color-input" type="color" value="${state.features.neonLineColor}" style="width:24px;height:24px;border:none;outline:2px solid ${state.features.neonLineColor};border-radius:4px;cursor:pointer;background:transparent;">
                        </div>
                    </div>

                    <!-- CHALLENGES SECTION -->
                    <div id="challenges-toggle" style="cursor:pointer; user-select:none; background: linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent); border-left: 3px solid #FFD700; padding: 8px 10px; margin-top: 15px; margin-bottom: 5px; font-weight: bold; color: #fff; display: flex; justify-content: space-between; align-items: center; border-radius: 4px; transition: background 0.2s;"
                        onmouseover="this.style.background='linear-gradient(90deg, rgba(255, 215, 0, 0.2), transparent)'"
                        onmouseout="this.style.background='linear-gradient(90deg, rgba(255, 215, 0, 0.1), transparent)'">
                        <span>Weekly Pass</span>
                        <span style="font-size: 0.8em; opacity: 0.8;">${state.showChallenges ? '▼' : '▶'}</span>
                    </div>

                    <div id="challenges-section" style="display:${state.showChallenges ? 'block' : 'none'}; margin-top:5px; padding: 8px; background: rgba(0,0,0,0.2); border-radius: 6px; margin-bottom:15px;">
                        <div style="font-size: 11px; color: #aaa; margin-bottom: 8px; text-align: center; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 5px;">
                            Complete tasks to earn <b style="color:#FFD700">REP</b>. Resets every 7 days.
                        </div>
                        <div style="max-height: 250px; overflow-y: auto; scrollbar-width: thin; padding-right: 4px;">
                            ${challengeRowsHTML}
                        </div>
                    </div>

                    <button id="help-info-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-bottom:8px; padding: 7px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        Level Info
                    </button>
                    <button id="rep-leaderboard-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-bottom:8px; padding: 7px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">Rep Leaderboard</button>
                    <button id="games-leaderboard-btn" style="${buttonStyle('#673AB7')}; width:100%; padding: 7px 0;"
                        onmouseover="${buttonHoverStyle('#673AB7')}" onmouseout="${buttonLeaveStyle('#673AB7')}">Games Leaderboard</button>
                </div>

                <!-- LINKS SECTION -->
                <div id="links-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-top:20px; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showLinks ? '▼' : '▶'} Links
                </div>
                <div id="links-section" style="display:${state.showLinks ? 'block' : 'none'};">
                    <p><strong>${state.keybinds.github.toUpperCase()}: Dev GitHub</strong> <span style="float:right; opacity:0.7;">🔗</span></p>
                    <p><strong>${state.keybinds.discord.toUpperCase()}: 143X Discord</strong> <span style="float:right; opacity:0.7;">🔗</span></p>
                    <p><strong>${state.keybinds.godMode.toUpperCase()}: GodMode</strong> <span style="float:right; opacity:0.7;">🔗</span></p>
                    <p><strong>${(state.keybinds.reddit || 'R').toUpperCase()}: Soul Collector</strong> <span style="float:right; opacity:0.7;">🔗</span></p>
                    <p><strong>${(state.keybinds.spotify || 'n').toUpperCase()}: DXXTHLY Spotify</strong> <span style="float:right; opacity:0.7;">🔗</span></p>
                </div>
            </div>

            <!-- RIGHT COLUMN -->
            <div>
                <!-- VISUALS & AUDIO SECTION -->
                <div id="visuals-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-top:0; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showVisuals ? '▼' : '▶'} Visuals & Audio
                </div>
                <div id="visuals-section" style="display:${state.showVisuals ? 'block' : 'none'}; margin-bottom:15px;">
                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:12px;">
                        <strong>Visual Filter:</strong>
                        <select id="visual-mode-select" style="padding: 6px; border-radius: 5px; background: #2c2c30; color: #e0e0e0; border: 1px solid #454548; max-width:120px;">
                            <option value="none">None</option>
                            <option value="invert">Invert</option>
                            <option value="contrast">High Contrast</option>
                            <option value="grayscale">Grayscale</option>
                            <option value="sepia">Sepia</option>
                        </select>
                    </div>

                    <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:8px; background:rgba(0,0,0,0.2); padding:5px; border-radius:4px;">
                        <span><strong>Show Enemy Stats:</strong></span>
                        <label class="switch">
                            <input id="show-stats-toggle" type="checkbox" ${state.showEnemyStats ? 'checked' : ''}>
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <div style="margin-bottom:10px; padding:8px; background:rgba(0,0,0,0.2); border-radius:5px;">
                        <div style="font-size:12px; color:#aaa; margin-bottom:6px; text-align:center; font-weight:600;">ESP & Bot Colors</div>
                        <div style="display:flex; justify-content:space-around; gap:8px;">
                            <div style="text-align:center;">
                                <input id="esp-head-color" type="color" value="#FF0000" style="width:30px; height:30px; cursor:pointer; border:none; border-radius:4px;">
                                <div style="font-size:10px; margin-top:4px;">Head</div>
                            </div>
                            <div style="text-align:center;">
                                <input id="esp-body-color" type="color" value="#FF0000" style="width:30px; height:30px; cursor:pointer; border:none; border-radius:4px;">
                                <div style="font-size:10px; margin-top:4px;">Body</div>
                            </div>
                            <div style="text-align:center;">
                                <input id="esp-food-color" type="color" value="#FFFFFF" style="width:30px; height:30px; cursor:pointer; border:none; border-radius:4px;">
                                <div style="font-size:10px; margin-top:4px;">Food</div>
                            </div>
                        </div>
                    </div>

                    <p><strong>1-3: Performance:</strong> <span style="color:${['#90EE90','#87CEEB','#FFA07A'][state.features.performanceMode-1] || '#aaa'}; float:right;">${['Low','Medium','High'][state.features.performanceMode-1] || 'N/A'}</span></p>
                    <p><strong>${state.keybinds.fpsDisplay.toUpperCase()}: FPS Display:</strong> <span style="color:${state.features.fpsDisplay ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.fpsDisplay ? 'ON' : 'OFF'}</span></p>
                    <p id="esp-toggle-btn" style="cursor:pointer; margin:8px 0;"><strong>${(state.keybinds.toggleEsp || 'L').toUpperCase()}: ESP Visuals:</strong> <span style="color:${state.features.esp ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.esp ? 'ON' : 'OFF'}</span></p>
                    <p><strong>${state.keybinds.showServer.toUpperCase()}: Show Server IP:</strong> <span style="color:${state.features.showServer ? '#90EE90' : '#FF7F7F'}; float:right;">${state.features.showServer ? 'ON' : 'OFF'}</span></p>

                    <div style="display:flex; align-items:center; justify-content:space-between; margin:10px 0; gap:8px;">
                        <button id="trail-toggle-btn" style="${buttonStyle('#4a4a4e')}; flex-grow:1;"
                            onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                            Trail: <span style="color:${state.features.snakeTrail ? '#90EE90' : '#FF7F7F'};">${state.features.snakeTrail ? 'ON' : 'OFF'}</span>
                        </button>
                        <input id="trail-color-input" type="color" value="${state.features.snakeTrailColor}" style="width:28px;height:28px;border:none;outline:2px solid ${state.features.snakeTrailColor};border-radius:5px;cursor:pointer;background:transparent;">
                    </div>

                    <div style="display:flex; gap:8px; margin-bottom:15px;">
                        <button id="ui-scale-down-btn" style="${buttonStyle('#4a4a4e')}; flex:1; padding:7px 0;"
                            onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                            UI -
                        </button>
                        <button id="ui-scale-up-btn" style="${buttonStyle('#4a4a4e')}; flex:1; padding:7px 0;"
                            onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                            UI +
                        </button>
                    </div>


                </div>

                <!-- EXTRA MODS SECTION -->
                <div id="extra-mods-toggle" style="cursor:pointer; user-select:none; color:${menuColor}; border-bottom:1px solid ${hexToRgba(menuColor,0.3)}; padding-bottom:6px; margin-bottom:12px; font-size:1.15em; font-weight:600;">
                    ${state.showExtraMods ? '▼' : '▶'} Extra Mods
                </div>
                <div id="extra-mods-section" style="display:${state.showExtraMods ? 'block' : 'none'}; margin-bottom:15px;">
                    <button id="disco-skin-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-bottom:8px; padding:8px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        Disco Skin: <span style="color:${state.features.discoSkin ? '#90EE90' : '#FF7F7F'}; font-weight:bold;">${state.features.discoSkin ? 'ON' : 'OFF'}</span>
                    </button>

                    <button id="predator-esp-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-bottom:8px; padding:8px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        Predator ESP: <span style="color:${state.features.predatorESP ? '#90EE90' : '#FF7F7F'}; font-weight:bold;">${state.features.predatorESP ? 'ON' : 'OFF'}</span>
                    </button>

                    <button id="spinbot-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-bottom:8px; padding:8px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        SpinBot: <span style="color:${state.features.spinBot ? '#90EE90' : '#FF7F7F'}; font-weight:bold;">${state.features.spinBot ? 'ON' : 'OFF'}</span>
                    </button>

                    <button id="fake-size-btn" style="${buttonStyle('#4a4a4e')}; width:100%; padding:8px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        Fake Size: <span style="color:${state.features.fakeSize ? '#90EE90' : '#FF7F7F'}; font-weight:bold;">${state.features.fakeSize ? 'ON' : 'OFF'}</span>
                    </button>

                    <button id="tactical-radar-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-top:8px; padding:8px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        Safety Radar: <span style="color:${state.features.tacticalRadar ? '#90EE90' : '#FF7F7F'}; font-weight:bold;">${state.features.tacticalRadar ? 'ON' : 'OFF'}</span>
                    </button>

                    <button id="boost-monitor-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-top:8px; padding:8px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        Boost Monitor: <span style="color:${state.features.boostMonitor ? '#90EE90' : '#FF7F7F'}; font-weight:bold;">${state.features.boostMonitor ? 'ON' : 'OFF'}</span>
                    </button>

                    <button id="prey-pred-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-top:8px; padding:8px 0;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        Food Trajectory: <span style="color:${state.features.preyPredictor ? '#90EE90' : '#FF7F7F'}; font-weight:bold;">${state.features.preyPredictor ? 'ON' : 'OFF'}</span>
                    </button>
                </div>



            </div>
        </div>

        <!-- STATUS & EXTRAS SECTION - BOTTOM -->
        <div id="status-toggle" style="background:${hexToRgba(menuColor,0.08)}; color:${menuColor}; font-weight:bold; cursor:pointer; user-select:none; padding:10px 15px; border-radius:8px; margin-bottom:0px; border: 1px solid ${hexToRgba(menuColor,0.2)};">
            ${state.showStatus ? '▼' : '▶'} Status & Extras
        </div>
        <div id="status-section" style="display:${state.showStatus ? 'block' : 'none'}; background:${hexToRgba(menuColor,0.08)}; padding:15px; border-radius:0 0 8px 8px; border: 1px solid ${hexToRgba(menuColor,0.2)}; border-top:none;">
            <div style="display:grid; grid-template-columns:1fr 1fr; gap:15px;">
                <div>
                    <h3 style="color:${menuColor}; margin:0 0 8px 0; font-size:1em; font-weight:600;">Status</h3>
                    <p style="margin:4px 0;"><strong>Game State:</strong> <span style="float:right;">${state.isInGame ? 'In Game' : 'Menu'}</span></p>
                    <p style="margin:4px 0;"><strong>Zoom:</strong> <span style="float:right;">${Math.round(100 / state.zoomFactor)}%</span></p>
                    <p style="margin:4px 0;"><strong>FPS:</strong> <span style="float:right;">${state.fps}</span></p>
                    <p style="margin:4px 0;"><strong>Server:</strong> <span style="color:#FFD700; float:right;">${state.features.showServer ? (state.server || 'N/A') : 'Hidden'}</span></p>
                </div>
                <div>
                    <h3 style="color:${menuColor}; margin:0 0 8px 0; font-size:1em; font-weight:600;">Extras</h3>

                    <button id="chat-toggle-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-bottom:6px; text-align:left; padding:8px 15px;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">
                        Chat: <span id="chat-toggle-status" style="color:${state.features.chatVisible ? '#90EE90' : '#FF7F7F'}; font-weight:bold; float:right;">${state.features.chatVisible ? 'ON' : 'OFF'}</span>
                    </button>

                    <!-- BUTTON: Opens your Profile Card -->
                    <button id="view-own-profile-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-bottom:6px; padding:8px 15px;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">My Profile</button>

                    <button id="change-nickname-btn" style="${buttonStyle('#4a4a4e')}; width:100%; margin-bottom:6px; padding:8px 15px;"
                        onmouseover="${buttonHoverStyle('#4a4a4e')}" onmouseout="${buttonLeaveStyle('#4a4a4e')}">Change Nickname</button>

                    <button id="donate-btn" style="${buttonStyle(menuColor)}; width:100%; padding:8px 15px;"
                        onmouseover="${buttonHoverStyle(menuColor)}" onmouseout="${buttonLeaveStyle(menuColor)}">Donate</button>
                </div>
            </div>
        </div>

        <div style="text-align:center; font-size:12px; color:#888; margin-top:15px; padding-top:10px; border-top:1px solid #444; line-height:1.6;">
            <span style="color:#ff6b6b; font-weight:bold;">(Developers will NEVER ask for money in chat. Beware of Scammers.)</span><br>
            Press <strong>${state.keybinds.toggleMenu.toUpperCase()}</strong> to toggle | <b>DSC.GG/143X</b> | <strong>${state.keybinds.screenshot.toUpperCase()}</strong> Screenshot<br>
            Made by: <b>dxxthly.</b> & <b>waynesg</b>
        </div>
        `;

        if (menuContentArea) menuContentArea.innerHTML = menuHtml;


        // Event listeners for newly created elements
        setTimeout(() => {
            // Customization Toggle
            const custToggle = document.getElementById('customization-toggle');
            if (custToggle) {
                custToggle.onclick = () => {
                    state.showCustomization = !state.showCustomization;
                    sessionStorage.setItem('showCustomization', state.showCustomization.toString());
                    updateMenu();
                };
            }

            // Toggle for Challenges
            const challengesToggle = document.getElementById('challenges-toggle');
            if (challengesToggle) {
                challengesToggle.onclick = () => {
                    state.showChallenges = !state.showChallenges;
                    updateMenu();
                };
            }

            // Ensure this is in your updateMenu function's setTimeout block
            const foodBotBtn = document.getElementById('food-bot-toggle');
            if (foodBotBtn) {
                foodBotBtn.onclick = () => {
                    state.features.foodBot = !state.features.foodBot;

                    if (state.features.foodBot) {
                        state.features.neonLine = false; // Turn off manual line
                        runFoodBot();
                    } else {
                        // Send stop command
                        window.postMessage({ type: "143X_BOT_STOP" }, "*");
                    }
                    updateMenu();
                };
            }


            // 1. Toggle for the new Menu Section
            const extraModsToggle = document.getElementById('extra-mods-toggle');
            if (extraModsToggle) {
                extraModsToggle.onclick = () => {
                    // IMPORTANT: Make sure showExtraMods is in your "const state = { ... }" at the top!
                    state.showExtraMods = !state.showExtraMods;
                    updateMenu();
                };
            }

            // 2. Disco Skin Button
            const discoBtn = document.getElementById('disco-skin-btn');
            if (discoBtn) {
                discoBtn.onclick = () => {
                    state.features.discoSkin = !state.features.discoSkin;
                    toggleDiscoSkin();
                    updateMenu();
                };
            }

            // Matrix HUD Button
            const matrixBtn = document.getElementById('matrix-hud-btn');
            if (matrixBtn) {
                matrixBtn.onclick = () => {
                    state.features.matrixHUD = !state.features.matrixHUD;
                    updateMenu();
                };
            }

            // The Glitcher Button
            const glitchBtn = document.getElementById('glitcher-mode-btn');
            if (glitchBtn) {
                glitchBtn.onclick = () => {
                    state.features.glitcherMode = !state.features.glitcherMode;
                    updateMenu();
                };
            }

            // 4. Fake Size Button
            const fakeBtn = document.getElementById('fake-size-btn');
            if (fakeBtn) {
                fakeBtn.onclick = () => {
                    state.features.fakeSize = !state.features.fakeSize;
                    toggleFakeSize();
                    updateMenu();
                };
                // New Feature Listeners
            const radarBtn = document.getElementById('tactical-radar-btn');
            if (radarBtn) {
                radarBtn.onclick = () => {
                    state.features.tacticalRadar = !state.features.tacticalRadar;
                    updateMenu();
                };
            }

            const boostMonBtn = document.getElementById('boost-monitor-btn');
            if (boostMonBtn) {
                boostMonBtn.onclick = () => {
                    state.features.boostMonitor = !state.features.boostMonitor;
                    updateMenu();
                };
            }

            const preyPredBtn = document.getElementById('prey-pred-btn');
            if (preyPredBtn) {
                preyPredBtn.onclick = () => {
                    state.features.preyPredictor = !state.features.preyPredictor;
                    updateMenu();
                };
            }
            }
            // --- GAMES LEADERBOARD LOGIC ---
            const gamesLbBtn = document.getElementById('games-leaderboard-btn');
            if (gamesLbBtn) {
                gamesLbBtn.onclick = () => {
                    // 1. Create Modal if missing
                    if (!document.getElementById('games-leaderboard-modal')) {
                        const modal = document.createElement('div');
                        modal.id = 'games-leaderboard-modal';
                        modal.style = `display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:10015; background:rgba(0,0,0,0.85); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;`;

                        modal.innerHTML = `
                            <div style="background:#23232a; border-radius:12px; padding:20px; width:450px; max-height:80vh; display:flex; flex-direction:column; box-shadow:0 6px 25px rgba(0,0,0,0.5); border: 1px solid #673AB7; position:relative;">
                                <button id="games-lb-close" style="position:absolute;top:10px;right:10px;font-size:1.5em;background:none;border:none;color:#aaa;cursor:pointer;">×</button>
                                <h2 style="color:#673AB7; margin:0 0 15px 0; text-align:center; border-bottom:1px solid #444; padding-bottom:10px;">Casino Highscores</h2>

                                <div style="display:flex; gap:5px; margin-bottom:15px;">
                                    <button class="games-lb-tab active" data-game="blackjack" style="flex:1; padding:10px; border:none; background:#673AB7; color:white; border-radius:4px; cursor:pointer; font-weight:bold;">Blackjack</button>
                                    <button class="games-lb-tab" data-game="slots" style="flex:1; padding:10px; border:none; background:#333; color:#ccc; border-radius:4px; cursor:pointer; font-weight:bold;">Slots</button>
                                    <button class="games-lb-tab" data-game="roulette" style="flex:1; padding:10px; border:none; background:#333; color:#ccc; border-radius:4px; cursor:pointer; font-weight:bold;">Roulette</button>
                                </div>

                                <div id="games-lb-header" style="display:flex; color:#888; padding:0 10px 5px 10px; font-size:0.9em;">
                                    <span style="width:40px; text-align:center;">#</span>
                                    <span style="flex:1;">Player</span>
                                    <span style="text-align:right;">Score</span>
                                </div>
                                <div id="games-lb-content" style="flex:1; overflow-y:auto; min-height:300px; padding-right:5px;">
                                    <div style="text-align:center; color:#aaa; margin-top:20px;">Loading...</div>
                                </div>
                            </div>
                        `;
                        document.body.appendChild(modal);

                        // Close Logic
                        document.getElementById('games-lb-close').onclick = () => modal.style.display = 'none';
                        modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };

                        // Tab Switching Logic
                        const tabs = modal.querySelectorAll('.games-lb-tab');
                        tabs.forEach(tab => {
                            tab.onclick = () => {
                                tabs.forEach(t => { t.style.background = '#333'; t.style.color = '#ccc'; });
                                tab.style.background = '#673AB7'; tab.style.color = 'white';
                                loadGameStats(tab.dataset.game);
                            };
                        });
                    }

                    // 2. Show Modal & Load Default
                    document.getElementById('games-leaderboard-modal').style.display = 'flex';
                    loadGameStats('blackjack');
                };
            }

            // Replace your existing loadGameStats function with this one:
async function loadGameStats(gameType) {
    const content = document.getElementById('games-lb-content');
    content.innerHTML = '<div style="text-align:center; color:#aaa; margin-top:20px;">Fetching Data...</div>';

    try {
        // 1. Fetch Highscores
        const snap = await firebase.database().ref(`minigameHighscores/${gameType}`)
            .orderByChild('score')
            .limitToLast(50)
            .once('value');

        if (!snap.exists()) {
            content.innerHTML = '<div style="text-align:center; color:#aaa; margin-top:20px;">No records yet. Be the first!</div>';
            return;
        }

        let players = [];
        // 2. Process data into a temporary list
        snap.forEach(child => {
            const val = child.val();
            // Handle if data is just a number (Legacy) or object (New)
            const score = (typeof val === 'object' && val.score) ? val.score : (typeof val === 'number' ? val : 0);
            const storedName = (typeof val === 'object' && val.name) ? val.name : null;
            players.push({ uid: child.key, score: score, name: storedName });
        });

        // 3. Sort High to Low
        players.sort((a, b) => b.score - a.score);

        // 4. Fetch Names for "Unknown" players from Online Users
        // We run a lookup for every player to get the most up-to-date name
        const namePromises = players.map(async (p) => {
            // If we already have a saved name, use it, but check online status to get color/vip status if possible
            const userSnap = await firebase.database().ref(`onlineUsers/${p.uid}`).once('value');
            if (userSnap.exists()) {
                const userData = userSnap.val();
                p.name = userData.name || p.name || "Unknown"; // Update name from live profile
                p.color = userData.chatNameColor || '#fff'; // Get their chat color
                p.isOnline = true;
            } else {
                p.name = p.name || "Offline User"; // Fallback if no stored name and not online
                p.color = '#aaa';
                p.isOnline = false;
            }
            return p;
        });

        await Promise.all(namePromises);

        // 5. Render HTML
        let html = '';
        players.forEach((p, i) => {
            const rank = i + 1;
            let rankColor = '#ddd';
            let bg = 'rgba(255,255,255,0.05)';
            let icon = '';

            if (rank === 1) { rankColor = '#FFD700'; bg = 'linear-gradient(90deg, rgba(255, 215, 0, 0.15), transparent)'; icon = '👑 '; }
            else if (rank === 2) { rankColor = '#C0C0C0'; icon = '🥈 '; }
            else if (rank === 3) { rankColor = '#CD7F32'; icon = '🥉 '; }

            // Sanitize name to prevent HTML injection
            const cleanName = p.name.replace(/[<>]/g, '');

            let scoreSuffix = ' Wins';
            if (gameType === 'slots' || gameType === 'roulette') scoreSuffix = ' REP';

            html += `
                <div style="display:flex; align-items:center; background:${bg}; padding:12px 10px; margin-bottom:6px; border-radius:6px; border-left:3px solid ${rankColor};">
                    <div style="font-weight:900; font-size:1.1em; width:40px; text-align:center; color:${rankColor};">${rank}</div>
                    <div style="flex:1; font-weight:600; color:${p.color}; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; text-shadow: 0 0 1px rgba(0,0,0,0.5);">
                        ${icon}${cleanName} ${p.isOnline ? '<span style="font-size:0.6em; color:#0f0;">●</span>' : ''}
                    </div>
                    <div style="text-align:right;">
                        <span style="color:#fff; font-weight:bold; font-family:monospace; font-size:1.1em;">${p.score.toLocaleString()}</span>
                        <span style="font-size:0.8em; color:#888;">${scoreSuffix}</span>
                    </div>
                </div>
            `;
        });
        content.innerHTML = html;

    } catch (e) {
        console.error("LB Error:", e);
        content.innerHTML = '<div style="text-align:center; color:#f55; margin-top:20px;">Failed to load leaderboard.</div>';
    }
}


            // STATS TOGGLE LISTENER
            const statsBtn = document.getElementById('show-stats-toggle');
            if(statsBtn) {
                statsBtn.onclick = () => {
                    state.showEnemyStats = statsBtn.checked;
                    // Send update to bot immediately
                    window.postMessage({ type: "143X_UPDATE_CONFIG", showStats: state.showEnemyStats }, "*");
                };
            }

            // --- FIXED COLOR LISTENERS ---
            ['esp-head-color', 'esp-body-color', 'esp-food-color'].forEach(id => {
                const el = document.getElementById(id);
                if(el) {
                    // 1. Restore saved color
                    const saved = localStorage.getItem(id);
                    if(saved) el.value = saved;

                    // 2. Add Listener
                    el.oninput = function() {
                        localStorage.setItem(id, this.value);

                        // 3. Grab all current values
                        const headC = document.getElementById('esp-head-color').value;
                        const bodyC = document.getElementById('esp-body-color').value;
                        const foodC = document.getElementById('esp-food-color').value;

                        // 4. Send to Bot
                        window.postMessage({
                            colors: {
                                head: headC,
                                body: bodyC,
                                food: foodC,
                                me: '#00FF00' // Fixed self color
                            }
                        }, "*");
                    };
                }
            });


            // ESP Color Listeners
            ['esp-head-color', 'esp-body-color', 'esp-food-color'].forEach(id => {
                const el = document.getElementById(id);
                if(el) {
                    // Load saved color if exists
                    const saved = localStorage.getItem(id);
                    if(saved) el.value = saved;

                    el.oninput = () => {
                        localStorage.setItem(id, el.value);
                        // Send update to bot immediately
                        window.postMessage({
                            colors: {
                                head: document.getElementById('esp-head-color').value,
                                body: document.getElementById('esp-body-color').value,
                                food: document.getElementById('esp-food-color').value
                            }
                        }, "*");
                    };
                }
            });



            // --- Our New Click Handlers ---
            const movementToggle = document.getElementById('movement-toggle');
            if (movementToggle) {
                movementToggle.onclick = () => {
                    state.showMovement = !state.showMovement;
                    updateMenu();
                };
            }

            const zoomToggle = document.getElementById('zoom-toggle');
            if (zoomToggle) {
                zoomToggle.onclick = () => {
                    state.showZoom = !state.showZoom;
                    updateMenu();
                };
            }

            const utilitiesToggle = document.getElementById('utilities-toggle');
            if (utilitiesToggle) {
                utilitiesToggle.onclick = () => {
                    state.showUtilities = !state.showUtilities;
                    updateMenu();
                };
            }

            const visualsToggle = document.getElementById('visuals-toggle');
            if (visualsToggle) {
                visualsToggle.onclick = () => {
                    state.showVisuals = !state.showVisuals;
                    updateMenu();
                };
            }

            // Predator ESP Button
            const espBtn = document.getElementById('predator-esp-btn');
            if (espBtn) {
                espBtn.onclick = () => {
                    state.features.predatorESP = !state.features.predatorESP;
                    updateMenu();
                };
            }

            // SpinBot Button
            const spinBtn = document.getElementById('spinbot-btn');
            if (spinBtn) {
                spinBtn.onclick = () => {
                    state.features.spinBot = !state.features.spinBot;
                    updateMenu();
                };
            }

            const linksToggle = document.getElementById('links-toggle');
            if (linksToggle) {
                linksToggle.onclick = () => {
                    state.showLinks = !state.showLinks;
                    updateMenu();
                };
            }

            const statusToggle = document.getElementById('status-toggle');
            if (statusToggle) {
                statusToggle.onclick = () => {
                    state.showStatus = !state.showStatus;
                    updateMenu();
                };
            }

            // Simplify Button
            const simplifyBtn = document.getElementById('simplify-menu-btn');
            if (simplifyBtn) {
                simplifyBtn.onclick = () => {
                    localStorage.setItem('prevPerformanceMode', state.features.performanceMode.toString());
                    state.simplified = true;
                    state.features.performanceMode = 1;
                    applyPerformanceMode();
                    sessionStorage.setItem('modMenuSimplified', 'true');
                    updateMenu();
                };
            }
            // Keybinds Button
            const keybindsBtn = document.getElementById('open-keybinds-menu-btn');
            if (keybindsBtn) keybindsBtn.onclick = showKeybindsMenu;

            // Menu Name and Color Inputs
            const nameInput = document.getElementById('mod-menu-name-input');
            const nameBtn = document.getElementById('mod-menu-name-btn');
            const colorIn = document.getElementById('mod-menu-color-input');
            if (nameBtn && nameInput) {
                nameBtn.onclick = () => {
                    const val = nameInput.value.trim();
                    if (val.length > 0) {
                        state.menuName = val;
                        localStorage.setItem('modMenuName', val);
                        updateMenu(); // Update menu title in draggable header
                        syncServerBoxWithMenu(); // Update server box title
                    }
                };
                nameInput.onkeydown = (e) => { if (e.key === 'Enter') nameBtn.click(); };
            }
            if (colorIn) {
                colorIn.oninput = () => {
                    state.menuColor = colorIn.value;
                    localStorage.setItem('modMenuColor', state.menuColor);
                    updateCSSVariables(); // Update global CSS vars
                    updateMenu(); // Re-style elements based on new color
                    syncServerBoxWithMenu();
                    syncChatBoxWithMenu();
                };
                colorIn.style.outlineColor = state.menuColor; // Sync outline with current color
            }
            const chatNameColorIn = document.getElementById('chat-name-color-input');
            if (chatNameColorIn) {
                chatNameColorIn.oninput = () => {
                    localStorage.setItem('chatNameColor', chatNameColorIn.value);
                    // No full updateMenu needed, but if there's a live preview, update it.
                    // For now, color picker outline updates itself.
                    chatNameColorIn.style.outlineColor = chatNameColorIn.value;
                };
                chatNameColorIn.style.outlineColor = localStorage.getItem("chatNameColor") || "#FFD700";
            }


            // Neon Line Color Input
            const neonLineColorInput = document.getElementById('neon-line-color-input');
            if (neonLineColorInput) {
                neonLineColorInput.value = state.features.neonLineColor;
                neonLineColorInput.oninput = () => {
                    state.features.neonLineColor = neonLineColorInput.value;
                    neonLineColor = neonLineColorInput.value; // Assuming global var for drawing
                    if (neonCtx) neonCtx.shadowColor = neonLineColor;
                    neonLineColorInput.style.outlineColor = state.features.neonLineColor;
                };
                neonLineColorInput.style.outlineColor = state.features.neonLineColor;
            }

                       // --- NEW: Visual Filter Dropdown Logic ---
            const visualModeSelect = document.getElementById('visual-mode-select');
            if (visualModeSelect) {
                // Set the dropdown to show the currently selected mode
                visualModeSelect.value = state.features.visualMode;

                // When the user changes the dropdown...
                visualModeSelect.onchange = () => {
                    // ...update the state...
                    state.features.visualMode = visualModeSelect.value;
                    // ...and apply the new filter.
                    applyVisualFilter();
                };
            }


            // UI Scale Buttons
            const uiScaleDownBtn = document.getElementById('ui-scale-down-btn');
            const uiScaleUpBtn = document.getElementById('ui-scale-up-btn');
            const scaleStep = 0.05;

            if (uiScaleDownBtn) {
                uiScaleDownBtn.onclick = () => {
                    state.uiScale = Math.max(0.6, state.uiScale - scaleStep); // Min 60%
                    localStorage.setItem('modMenuUIScale', state.uiScale.toString());
                    applyUIScale();
                };
            }
            if (uiScaleUpBtn) {
                uiScaleUpBtn.onclick = () => {
                    state.uiScale = Math.min(1.5, state.uiScale + scaleStep); // Max 150%
                    localStorage.setItem('modMenuUIScale', state.uiScale.toString());
                    applyUIScale();
                };
            }


            // Toggle Background Button
            const helpInfoBtn = document.getElementById('help-info-btn');
            if (helpInfoBtn) {
                helpInfoBtn.onclick = () => {
                    const helpModal = document.getElementById('rep-help-modal');
                    if (helpModal) {
                        helpModal.style.display = 'flex';
                    }
                };
            }

            // Leaderboard for Rep
            const repLeaderboardBtn = document.getElementById('rep-leaderboard-btn');
            if (repLeaderboardBtn) {

            repLeaderboardBtn.onclick = () => {
            const modal = document.getElementById('rep-leaderboard-modal');
            if (!modal) return;
            modal.style.display = 'flex';

            const repContent = document.getElementById('rep-leaderboard-content');
            const recentContent = document.getElementById('recent-players-content');
            const tabRep = document.getElementById('tab-btn-rep');
            const tabRecent = document.getElementById('tab-btn-recent');

            // --- NEW HELPER FUNCTION: Format Time Ago ---
            function formatTimeAgo(timestamp) {
                const now = Date.now();
                const seconds = Math.floor((now - timestamp) / 1000);
                if (seconds < 60) return `<span style="color:#90EE90; font-weight:bold;">Active now</span>`;
                const minutes = Math.floor(seconds / 60);
                if (minutes < 60) return `Last seen: ${minutes} min${minutes > 1 ? 's' : ''} ago`;
                const hours = Math.floor(minutes / 60);
                if (hours < 24) return `Last seen: ${hours} hour${hours > 1 ? 's' : ''} ago`;
                const days = Math.floor(hours / 24);
                return `Last seen: ${days} day${days > 1 ? 's' : ''} ago`;
            }

            // --- Helper Function to Render Player Lists (NOW with 'isRecent' flag) ---
            const renderPlayerList = async (playerDataArray, isRecent = false) => {
                const userPromises = playerDataArray.map(player => firebase.database().ref(`onlineUsers/${player.uid}`).once('value'));
                const userSnapshots = await Promise.all(userPromises);

                return playerDataArray.map((player, i) => {
                    const userProfile = userSnapshots[i].exists() ? userSnapshots[i].val() : { name: 'Offline User', profileAvatar: null };
                    const rank = i + 1;
                    let rankStyle = 'color: #ddd;';
                    let rowStyle = 'background: rgba(255, 255, 255, 0.04); border-left: 4px solid #555;';
                    if (rank === 1 && !isRecent) { rankStyle = 'color: #FFD700; text-shadow: 0 0 5px #FFD700;'; rowStyle = 'background: linear-gradient(90deg, rgba(255,215,0,0.15) 0%, rgba(255,215,0,0) 60%); border-left: 4px solid #FFD700;'; }
                    else if (rank === 2 && !isRecent) { rankStyle = 'color: #C0C0C0; text-shadow: 0 0 5px #C0C0C0;'; rowStyle = 'background: linear-gradient(90deg, rgba(192,192,192,0.1) 0%, rgba(192,192,192,0) 60%); border-left: 4px solid #C0C0C0;'; }
                    else if (rank === 3 && !isRecent) { rankStyle = 'color: #CD7F32; text-shadow: 0 0 5px #CD7F32;'; rowStyle = 'background: linear-gradient(90deg, rgba(205,127,50,0.1) 0%, rgba(205,127,50,0) 60%); border-left: 4px solid #CD7F32;'; }

                    let displayName = escapeHTML(filterProfanity(userProfile.name || 'Offline User'));
                    if (userProfile.name === 'Offline User') { displayName = `<i style="color:#999;">${displayName}</i>`; }
                    if (isDev(player.uid)) { displayName = rainbowTextStyle(displayName); }
                    else if (isVip(player.uid, userProfile.name)) { displayName = vipGlowStyle(displayName, '#FFD700'); }

                    // --- NEW: Display either REP or Last Seen status ---
                    const subtext = isRecent
                        ? formatTimeAgo(player.lastActive)
                        : `<b style="color:var(--menu-color, #4CAF50); font-weight:900;">${player.rep.toLocaleString()}</b> REP`;

                    return `<div class="leaderboard-row leaderboard-clickable-row" data-uid="${player.uid}" style="${rowStyle}">
                                <div class="leaderboard-rank" style="${rankStyle}">${isRecent ? '' : '#'}${rank}</div>
                                <img class="leaderboard-avatar" src="${userProfile.profileAvatar || `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(player.uid)}`}" onerror="this.src='https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(player.uid)}';">
                                <div class="leaderboard-info">
                                    <div class="leaderboard-name">${displayName}</div>
                                    <div class="leaderboard-rep">${subtext}</div>
                                </div>
                            </div>`;
                }).join('');
            };

            // --- Function to Load Top 100 REP (Unchanged) ---
            const loadRepLeaderboard = async () => {
                repContent.innerHTML = '<div style="color:#aaa;text-align:center;">Loading Top 100...</div>';
                try {
                    const repSnapshot = await firebase.database().ref('playerData').orderByChild('rep').limitToLast(100).once('value');
                    if (!repSnapshot.exists()) {
                        repContent.innerHTML = '<div style="color:#aaa;text-align:center;">No players with REP found.</div>';
                        return;
                    }
                    const players = [];
                    repSnapshot.forEach(child => {
                        players.push({ uid: child.key, rep: child.val().rep || 0 });
                    });
                    players.sort((a, b) => b.rep - a.rep);
                    const filteredPlayers = players.filter(p => !isDev(p.uid) && !isSystemAccount(p.uid));
                    repContent.innerHTML = await renderPlayerList(filteredPlayers, false);
                } catch (err) {
                    console.error("Error loading rep leaderboard:", err);
                    repContent.innerHTML = `<div style="color:#f77;text-align:center;">Error loading leaderboard.</div>`;
                }
            };

            // --- Function to Load Recent Players (NOW passes 'true' to renderer) ---
            const loadRecentPlayers = async () => {
                recentContent.innerHTML = '<div style="color:#aaa;text-align:center;">Loading recent players...</div>';
                try {
                    const recentSnapshot = await firebase.database().ref('onlineUsers').orderByChild('lastActive').limitToLast(100).once('value');
                     if (!recentSnapshot.exists()) {
                        recentContent.innerHTML = '<div style="color:#aaa;text-align:center;">No recent players found.</div>';
                        return;
                    }
                    const players = [];
                    recentSnapshot.forEach(child => {
                        players.push({ uid: child.key, rep: 0, lastActive: child.val().lastActive || 0 });
                    });
                    players.sort((a, b) => b.lastActive - a.lastActive);
                    const filteredPlayers = players.filter(p => !isSystemAccount(p.uid));
                    recentContent.innerHTML = await renderPlayerList(filteredPlayers, true); // Pass 'true' here
                } catch (err) {
                    console.error("Error loading recent players:", err);
                    recentContent.innerHTML = `<div style="color:#f77;text-align:center;">Error loading recent players.</div>`;
                }
            };

            // --- Tab Switching Logic (Unchanged) ---
            tabRep.onclick = () => {
                tabRep.classList.add('active');
                tabRecent.classList.remove('active');
                repContent.style.display = 'block';
                recentContent.style.display = 'none';
                loadRepLeaderboard();
            };
            tabRecent.onclick = () => {
                tabRecent.classList.add('active');
                tabRep.classList.remove('active');
                recentContent.style.display = 'block';
                repContent.style.display = 'none';
                loadRecentPlayers();
            };

            // Load the default tab (Top 100 REP) when the modal opens
            tabRep.click();
        };
            }

            // Trail Toggle and Color
            const trailToggleBtn = document.getElementById('trail-toggle-btn');
            if (trailToggleBtn) {
                trailToggleBtn.onclick = () => {
                    state.features.snakeTrail = !state.features.snakeTrail;
                    if (!state.features.snakeTrail) {
                        state.snakeTrailPoints = [];
                        clearTrailOverlay();
                    }
                    updateMenu();
                };
            }
            const trailColorInput = document.getElementById('trail-color-input');
            if (trailColorInput) {
                trailColorInput.oninput = () => {
                    state.features.snakeTrailColor = trailColorInput.value;
                    trailColorInput.style.outlineColor = state.features.snakeTrailColor;
                    // No full updateMenu needed unless other elements depend on this color live.
                };
                trailColorInput.style.outlineColor = state.features.snakeTrailColor;
            }

            // Chat Toggle Button (in main menu)
            const chatToggleBtn = document.getElementById('chat-toggle-btn');
            if (chatToggleBtn) chatToggleBtn.onclick = toggleChatVisible;

            // My Profile Button (Extras Menu)
            const viewOwnProfileBtn = document.getElementById('view-own-profile-btn');
            if (viewOwnProfileBtn) {
                viewOwnProfileBtn.onclick = () => {
                    // Check if connected to chat/firebase
                    const currentUser = firebase.auth().currentUser;
                    if (currentUser) {
                        // This opens the "Public View" of your profile
                        // The script automatically adds the "Edit" button inside this popup because it knows it's you.
                        showUserProfile(currentUser.uid);
                    } else {
                        alert("Chat system is connecting... please wait a moment.");
                    }
                };
            }

            // Change Nickname Button
            const changeNickBtn = document.getElementById('change-nickname-btn');
            if (changeNickBtn) {
                changeNickBtn.onclick = async () => {
                    localStorage.removeItem("nickname"); // Clear old one
                    await promptForUniqueNickname(); // Prompt for new
                    // Consider re-initializing chat or parts of it if needed, or simply reload
                    window.location.reload();
                };
            }

            // Donate Button
            const donateBtn = document.getElementById('donate-btn');
            if (donateBtn) {
                donateBtn.onclick = () => window.open("https://www.paypal.com/donate/?business=SC3RFTW5QDZJ4&no_recurring=0&currency_code=USD", "_blank", "toolbar=no,scrollbars=yes,resizable=yes,top=200,left=200,width=520,height=700");
            }

            if (isDamnBruh) {
                const dbZoomToggle = document.getElementById('damnbruh-zoom-toggle');
                if (dbZoomToggle) {
                    dbZoomToggle.onclick = () => {
                        state.features.damnbruhZoom = !state.features.damnbruhZoom;
                        updateMenu();
                    };
                }
            }

            // ... inside the setTimeout in updateMenu ...

// Games Leaderboard Listener
const gamesLeaderboardBtn = document.getElementById('games-leaderboard-btn');
if (gamesLeaderboardBtn) {
    gamesLeaderboardBtn.onclick = () => {
        // 1. Create Modal if it doesn't exist
        if (!document.getElementById('games-leaderboard-modal')) {
            const modal = document.createElement('div');
            modal.id = 'games-leaderboard-modal';
            modal.style = `display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:10015; background:rgba(0,0,0,0.8); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;`;

            modal.innerHTML = `
                <div style="background:#23232a; border-radius:12px; padding:20px; width:500px; max-height:80vh; display:flex; flex-direction:column; box-shadow:0 6px 25px rgba(0,0,0,0.5); border: 1px solid #673AB7; position:relative;">
                    <button id="games-lb-close" style="position:absolute;top:10px;right:10px;font-size:1.5em;background:none;border:none;color:#aaa;cursor:pointer;">×</button>
                    <h2 style="color:#673AB7; margin:0 0 15px 0; text-align:center; border-bottom:1px solid #444; padding-bottom:10px;">Casino Highscores</h2>

                    <div style="display:flex; gap:5px; margin-bottom:15px;">
                        <button class="games-lb-tab active" data-game="blackjack" style="flex:1; padding:8px; border:none; background:#673AB7; color:white; border-radius:4px; cursor:pointer;">Blackjack (Wins)</button>
                        <button class="games-lb-tab" data-game="slots" style="flex:1; padding:8px; border:none; background:#333; color:#ccc; border-radius:4px; cursor:pointer;">Slots (Max)</button>
                        <button class="games-lb-tab" data-game="roulette" style="flex:1; padding:8px; border:none; background:#333; color:#ccc; border-radius:4px; cursor:pointer;">Roulette (Best)</button>
                    </div>

                    <div id="games-lb-content" style="flex:1; overflow-y:auto; min-height:300px; padding-right:5px;">
                        <div style="text-align:center; color:#aaa; margin-top:20px;">Loading...</div>
                    </div>
                </div>
            `;
            document.body.appendChild(modal);

            // Close logic
            document.getElementById('games-lb-close').onclick = () => modal.style.display = 'none';
            modal.onclick = (e) => { if(e.target === modal) modal.style.display = 'none'; };

            // Tab logic
            const tabs = modal.querySelectorAll('.games-lb-tab');
            tabs.forEach(tab => {
                tab.onclick = () => {
                    tabs.forEach(t => { t.style.background = '#333'; t.style.color = '#ccc'; });
                    tab.style.background = '#673AB7'; tab.style.color = 'white';
                    loadGameStats(tab.dataset.game);
                };
            });
        }

        // 2. Show Modal
        document.getElementById('games-leaderboard-modal').style.display = 'flex';

        // 3. Load initial tab
        loadGameStats('blackjack');
    };
}

// Helper Function to Load Stats
async function loadGameStats(gameType) {
    const content = document.getElementById('games-lb-content');
    content.innerHTML = '<div style="text-align:center; color:#aaa; margin-top:20px;">Loading data...</div>';

    try {
        // Fetch Top 50 for the selected game
        const snap = await firebase.database().ref(`minigameHighscores/${gameType}`)
            .orderByChild('score')
            .limitToLast(50)
            .once('value');

        if (!snap.exists()) {
            content.innerHTML = '<div style="text-align:center; color:#aaa; margin-top:20px;">No records found yet. Play to be the first!</div>';
            return;
        }

        let players = [];
        snap.forEach(child => {
            const val = child.val();
            // Handle both object format {name, score} and simple format if legacy
            const score = typeof val === 'object' ? val.score : val;
            const name = typeof val === 'object' ? val.name : 'Unknown';
            const uid = child.key;
            players.push({ uid, name, score });
        });

        // Sort descending (High to Low)
        players.sort((a, b) => b.score - a.score);

        let html = '';
        players.forEach((p, i) => {
            const rank = i + 1;
            let color = '#ddd';
            let bg = 'rgba(255,255,255,0.05)';
            if (rank === 1) { color = '#FFD700'; bg = 'rgba(255, 215, 0, 0.1)'; }
            else if (rank === 2) { color = '#C0C0C0'; }
            else if (rank === 3) { color = '#CD7F32'; }

            let scoreLabel = 'Wins';
            if (gameType === 'slots') scoreLabel = 'REP';
            if (gameType === 'roulette') scoreLabel = 'REP';

            html += `
                <div style="display:flex; align-items:center; background:${bg}; padding:10px; margin-bottom:5px; border-radius:5px; border-left:3px solid ${color};">
                    <div style="font-weight:bold; font-size:1.2em; width:40px; text-align:center; color:${color};">#${rank}</div>
                    <div style="flex:1; font-weight:bold; color:#fff;">${escapeHTML(p.name)}</div>
                    <div style="text-align:right;">
                        <div style="color:${color}; font-weight:bold; font-size:1.1em;">${p.score.toLocaleString()}</div>
                        <div style="font-size:0.8em; color:#888;">${scoreLabel}</div>
                    </div>
                </div>
            `;
        });
        content.innerHTML = html;

    } catch (e) {
        console.error(e);
        content.innerHTML = '<div style="text-align:center; color:#f55; margin-top:20px;">Error loading leaderboard.</div>';
    }
}

        }, 0); // End setTimeout for event listeners

        syncServerBoxWithMenu();
        syncChatBoxWithMenu();
        updateCSSVariables(); // Ensure CSS variables are current
    }



    let lastWheelTime = 0;
    document.addEventListener('wheel', function(e) {
        const now = Date.now();
        if (now - lastWheelTime < 100) return;
        lastWheelTime = now;

        if (!state.features.keybindsEnabled) return;

        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable || state.features.chatFocus)) {
            return;
        }

        if (!state.isInGame) return;

        const binds = state.keybinds;
        let currentZoomIdx = zoomSteps.findIndex(z => Math.abs(z - state.zoomFactor) < 1e-5);
        if (currentZoomIdx === -1) {
            currentZoomIdx = zoomSteps.reduce((bestIdx, currentStep, idx) =>
                Math.abs(currentStep - state.zoomFactor) < Math.abs(zoomSteps[bestIdx] - state.zoomFactor) ? idx : bestIdx, 0);
        }

        let actionTaken = false;
        if (e.deltaY < 0 && binds.zoomIn === "wheelup") {
            if (currentZoomIdx > 0) {
                state.zoomFactor = zoomSteps[--currentZoomIdx];
                actionTaken = true;
            }
        } else if (e.deltaY > 0 && binds.zoomOut === "wheeldown") {
            if (currentZoomIdx < zoomSteps.length - 1) {
                state.zoomFactor = zoomSteps[++currentZoomIdx];
                actionTaken = true;
            }
        }

        if (actionTaken) {
            if (typeof updateMenu === "function") updateMenu();
            e.preventDefault();
        }
    }, { passive: false });

    function displayKey(key) {
        if (!key) return 'N/A';
        if (key.toLowerCase() === " ") return "SPACE";
        if (key.toLowerCase() === "wheelup") return "Wheel Up";
        if (key.toLowerCase() === "wheeldown") return "Wheel Down";
        return key.toUpperCase();
    }

    // The IIFE for Keybind Modal Logic is already defined within the
    // `if (!document.getElementById('keybind-modal-overlay'))` block.
    // No need to repeat it here if you followed SECTION 4 instructions.
    // If you didn't, ensure the IIFE from SECTION 4 is correctly placed.


    function showKeybindsMenu() {
        const menuColor = state.menuColor;
        const menuContentArea = document.getElementById('mod-menu-content-area');
        if (!menuContentArea) return;

        // Update draggable header for keybinds menu
        const menuDraggableHeader = document.getElementById('mod-menu-draggable-header');
        if (menuDraggableHeader) {
             menuDraggableHeader.innerHTML = `
                <h2 style="margin:0; color:#fff; font-size:1.4em; font-weight:600; text-shadow: 1px 1px 2px rgba(0,0,0,0.3);">
                    Keybind Settings
                </h2>
                <button id="back-to-main-menu-btn" style="${buttonStyle(menuColor)}; padding: 6px 12px; font-size: 13px;"
                    onmouseover="${buttonHoverStyle(menuColor)}" onmouseout="${buttonLeaveStyle(menuColor)}">
                    Back
                </button>
            `;
            // Attach listener for the new back button
             setTimeout(() => {
                const backBtn = document.getElementById('back-to-main-menu-btn');
                if (backBtn) backBtn.onclick = updateMenu;
            },0);
        }


        menuContentArea.innerHTML = `
          <table style="width:100%; font-size:14px; margin-top:5px; border-collapse:collapse; background:rgba(0,0,0,0.1); border-radius:8px; overflow:hidden;">
            <thead>
                <tr>
                  <th style="text-align:left; color:${menuColor}; padding:10px 12px; border-bottom: 1px solid ${hexToRgba(menuColor, 0.4)}; font-weight:600;">Action</th>
                  <th style="text-align:left; color:${menuColor}; padding:10px 12px; border-bottom: 1px solid ${hexToRgba(menuColor, 0.4)}; font-weight:600;">Key</th>
                  <th style="text-align:right; padding:10px 12px; border-bottom: 1px solid ${hexToRgba(menuColor, 0.4)};"></th>
                </tr>
            </thead>
            <tbody>
            ${Object.entries(state.keybinds).map(([action, key], index, arr) => `
                <tr style="${index === arr.length - 1 ? '' : 'border-bottom: 1px solid rgba(255,255,255,0.08);'}">
                  <td style="color:#ccc; padding:9px 12px; text-transform: capitalize;">${action.replace(/([A-Z])/g, ' $1')}</td>
                  <td style="color:#FFD700; font-weight:bold; padding:9px 12px;">${displayKey(key)}</td>
                  <td style="text-align:right; padding:9px 12px;">
                    <button data-action="${action}" class="set-keybind-btn"
                            style="${buttonStyle(menuColor)};"
                            onmouseover="${buttonHoverStyle(menuColor)}"
                            onmouseout="${buttonLeaveStyle(menuColor)}">Set</button>
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div style="font-size:12px; color:#999; margin-top:15px; text-align:center;">
            Click "Set" to rebind. Press <strong>${(state.keybinds.toggleKeybinds || '-').toUpperCase()}</strong> to toggle all mod keybinds.
          </div>
        `;

        setTimeout(() => {
            // Back button listener is set when header is created above
            document.querySelectorAll('.set-keybind-btn').forEach(btn => {
                btn.onclick = () => openKeybindModal(btn.dataset.action);
            });
        }, 0);
    }

    function applyBackground() {
        const defaultBgUrl = 'https://slither.io/s2/bg54.jpg';
        const blackBgDataUrl = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=';

        // LOGIC FIX: Check Black BG first, then Custom URL, then Default
        if (state.features.blackBg) {
            window.__customBgUrlCurrent = blackBgDataUrl;
        } else if (state.savedBgUrl && state.savedBgUrl.trim() !== '') {
            window.__customBgUrlCurrent = state.savedBgUrl;
        } else {
            window.__customBgUrlCurrent = defaultBgUrl;
        }

        // Force game to redraw background immediately
        if (window.resize) {
             window.resize();
        }
    }


    // === GAME STATE DETECTION ===
    // === GAME STATE DETECTION ===
    function checkGameState() {
        const gameCanvas = document.querySelector('canvas');
        const loginForm = document.getElementById('login');
        state.isInGame = !!(gameCanvas && gameCanvas.style.display !== 'none' && (!loginForm || loginForm.style.display === 'none'));
        setTimeout(checkGameState, 1000);
    }


    // === CIRCLE RESTRICTION VISUAL ===
    // === CIRCLE RESTRICTION VISUAL ===
    function drawCircleRestriction() {
        if (state.features.circleRestriction && state.isInGame) {
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            // Ensure circleVisual is defined and accessible (it's created globally in your script)
            if (circleVisual) {
                circleVisual.style.left = `${centerX}px`;
                circleVisual.style.top = `${centerY}px`;
                circleVisual.style.width = `${state.circleRadius * 2}px`;
                circleVisual.style.height = `${state.circleRadius * 2}px`;
                circleVisual.style.display = 'block';
            }
        } else {
            if (circleVisual) {
                circleVisual.style.display = 'none';
            }
        }
        requestAnimationFrame(drawCircleRestriction);
    }
    // REMOVE the standalone drawCircleRestriction(); call from here if it exists. It will be called once at the end.

    document.addEventListener('keydown', function (e) {
        const activeEl = document.activeElement;

        // --- THIS IS THE FIX ---
        // Check if the user is currently focused on ANY input, textarea,
        // or if the keybind rebinding modal is active.
        if ( (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.isContentEditable)) || waitingForKeybind ) {
            // If they are typing, we do nothing and let the browser handle the key press.
            // We only make an exception for the 'Escape' key to allow blurring the input.
            if (e.key === 'Escape' && activeEl) {
                activeEl.blur();
            }
            return; // This is the most important part: it stops the function right here.
        }
        // --- END OF FIX ---

        // If we get past the check above, it means the user is NOT typing in an input box,
        // so we can now safely process our mod's keybinds.

        // Handle arrow keys first (for AFK mode)
        if (e.key === 'ArrowLeft') window.l = true;
        if (e.key === 'ArrowRight') window.r = true;

        const key = e.key.toLowerCase() === " " ? "space" : e.key.toLowerCase();
        const binds = state.keybinds;

        // Universal toggles (these should work even if other keybinds are off)
        if (key === binds.toggleMenu) {
            state.menuVisible = !state.menuVisible;
            menu.style.display = state.menuVisible ? 'block' : 'none';
            if (state.menuVisible && typeof updateMenu === "function") updateMenu();
            e.preventDefault();
            return;
        }
        if (key === binds.toggleKeybinds) {
            state.features.keybindsEnabled = !state.features.keybindsEnabled;
            if (typeof updateMenu === "function") updateMenu();
            e.preventDefault();
            return;
        }

        if (!state.features.keybindsEnabled) return;

        if (key === binds.chatEnabled && state.features.chatVisible) {
            const chatInput = document.getElementById('mod-menu-chat-input');
            if (chatInput) {
                chatInput.focus();
                e.preventDefault();
            }
            return;
        }

        let actionTaken = false;

        switch (key) {
            case '=':
                state.features.blackBg = !state.features.blackBg; // This toggles the switch ON/OFF
                applyBackground(); // This tells the game to update the background
                actionTaken = true;
                break;

            case binds.toggleEsp:
                state.features.esp = !state.features.esp;
                // Send signal to the brain
                window.postMessage({ type: "143X_ESP_TOGGLE", val: state.features.esp }, "*");
                if (typeof updateMenu === "function") updateMenu();
                actionTaken = true;
                break;

            case binds.circleRestriction:
                state.features.circleRestriction = !state.features.circleRestriction;
                actionTaken = true;
                break;
            case binds.circleSmaller:
                state.circleRadius = Math.max(config.minCircleRadius, state.circleRadius - config.circleRadiusStep);
                actionTaken = true;
                break;
            case binds.circleLarger:
                state.circleRadius = Math.min(config.maxCircleRadius, state.circleRadius + config.circleRadiusStep);
                actionTaken = true;
                break;
            case binds.autoCircle:
                state.features.autoCircle = !state.features.autoCircle;
                if (state.features.autoCircle && !autoCircleRAF) {
                    autoCircleRAF = requestAnimationFrame(autoCircle);
                } else if (autoCircleRAF) {
                    cancelAnimationFrame(autoCircleRAF);
                    autoCircleRAF = null;
                }
                if (typeof updateMenu === "function") updateMenu();
                break;
            case binds.autoBoost:
                state.features.autoBoost = !state.features.autoBoost;
                if (typeof updateMenu === "function") updateMenu();
                break;
            case binds.fpsDisplay:
                state.features.fpsDisplay = !state.features.fpsDisplay;
                if (fpsDisplay) fpsDisplay.style.display = state.features.fpsDisplay ? 'block' : 'none';
                actionTaken = true;
                break;
            case binds.deathSound:
                state.features.deathSound = !state.features.deathSound;
                actionTaken = true;
                break;
            case binds.showServer:
                state.features.showServer = !state.features.showServer;
                actionTaken = true;
                break;
            case binds.neonLine:
                state.features.neonLine = !state.features.neonLine;
                if (state.features.neonLine) {
                    neonLineActive = true; createNeonLineCanvas(); window.addEventListener('mousemove', neonLineDraw);
                } else {
                    neonLineActive = false; if (neonCtx && neonCanvas) neonCtx.clearRect(0,0,neonCanvas.width, neonCanvas.height); window.removeEventListener('mousemove', neonLineDraw);
                }
                actionTaken = true;
                break;
            case binds.foodBot:
                state.features.foodBot = !state.features.foodBot;

                if (state.features.foodBot) {
                    // IMPORTANT: Turn off manual neon line to avoid conflict
                    state.features.neonLine = false;
                    if(neonCanvas) neonCanvas.style.display = 'none'; // Hide manual canvas

                    runFoodBot(); // Start the injected bot
                } else {
                    // Show manual canvas again if needed
                    if(neonCanvas) neonCanvas.style.display = 'block';
                    runFoodBot(); // This will send the STOP signal
                }

                if (typeof updateMenu === "function") updateMenu();
                actionTaken = true;
                break;
            case binds.zoomIn:
            case binds.zoomOut:
                if (state.isInGame) {
                    let idx = zoomSteps.findIndex(z => Math.abs(z - state.zoomFactor) < 1e-5);
                    if (idx === -1) idx = zoomSteps.reduce((best, z_1, i) => Math.abs(z_1 - state.zoomFactor) < Math.abs(zoomSteps[best] - state.zoomFactor) ? i : best, 0);
                    if (key === binds.zoomIn && idx > 0) idx--;
                    else if (key === binds.zoomOut && idx < zoomSteps.length - 1) idx++;
                    state.zoomFactor = zoomSteps[idx];
                    actionTaken = true;
                }
                break;
            case binds.zoomReset:
                if (state.isInGame) {
                    state.zoomFactor = 1.0;
                    actionTaken = true;
                }
                break;
            case binds.autoRespawn:
                state.features.autoRespawn = !state.features.autoRespawn;
                if (state.features.autoRespawn) enableAutoRespawn(); else disableAutoRespawn();
                actionTaken = true;
                break;
            case binds.screenshot:
                if (state.isInGame) {
                    try {
                        const canvas = document.querySelector('canvas');
                        if (canvas) {
                            const dataURL = canvas.toDataURL();
                            const link = document.createElement('a');
                            link.href = dataURL;
                            link.download = `slither_screenshot_${Date.now()}.png`;
                            document.body.appendChild(link); link.click(); document.body.removeChild(link);
                        }
                    } catch (err) { alert('Screenshot failed: ' + err); }
                }
                actionTaken = true;
                break;
            case binds.spotify:
            window.open("https://spti.fi/dxxthly", "_blank");
            actionTaken = true;
            break;
            case binds.github: window.open('https://github.com/dxxthly', '_blank'); actionTaken = true; break;
            case binds.discord: window.open('https://dsc.gg/143x', '_blank'); actionTaken = true; break;
            case binds.godMode: window.open(config.godModeVideoURL, '_blank'); actionTaken = true; break;
            case binds.reddit: if (binds.reddit) window.open('https://dxxthly.itch.io/abyssal-ascension', '_blank'); actionTaken = true; break;
            case '1': case '2': case '3':
                state.features.performanceMode = parseInt(key);
                applyPerformanceMode();
                actionTaken = true;
                break;
        }

        if (actionTaken) {
            if (typeof updateMenu === "function") {
                updateMenu();
            }
            e.preventDefault();
        }
    });


    document.addEventListener('keyup', function(e) {
        if (e.key === 'ArrowLeft') window.l = false;
        if (e.key === 'ArrowRight') window.r = false;
    });


        // === FORCED SERVER LOGIC ===
    function applyForcedServer() {
        try {
            const savedForcedServer = localStorage.getItem('forcedServer');
            if (!savedForcedServer) return;
            const serverDetails = JSON.parse(savedForcedServer);
            if (!serverDetails.ip || !serverDetails.port) { localStorage.removeItem('forcedServer'); return; }
            window.forcing = true;
            if (!window.bso) window.bso = {};
            window.bso.ip = serverDetails.ip;
            window.bso.po = parseInt(serverDetails.port, 10);
        } catch (e) { console.error("Error applying forced server:", e); localStorage.removeItem('forcedServer'); }
    }

    function patchPlayButtons() {
        const mainPlayBtn = document.getElementById('playh') || document.querySelector('.btn-play-guest') || document.querySelector('form .btn.btn-primary');
        if (mainPlayBtn && !mainPlayBtn._patchedForceServer) { mainPlayBtn._patchedForceServer = true; mainPlayBtn.addEventListener('click', () => { setTimeout(applyForcedServer, 0); }, true); }
        document.querySelectorAll('.btn-play-again, #play-again, .play_btn').forEach(playAgainBtn => { if (playAgainBtn && !playAgainBtn._patchedForceServer) { playAgainBtn._patchedForceServer = true; playAgainBtn.addEventListener('click', () => { setTimeout(applyForcedServer, 0); }, true); } });
    }
    // These calls below this function are important for its operation:
    setInterval(patchPlayButtons, 1000);
    applyForcedServer(); // Apply on load


    // === AUTO CIRCLE (Bot Movement) ===
    // autoCircleRAF is already declared globally
        // autoCircleRAF is declared in the global-like scope of your IIFE
    // === AUTO CIRCLE ===
    function autoCircle() {
        if (!state.features.autoCircle || !state.isInGame) { // Check isInGame from your state
            if (autoCircleRAF) { // Ensure autoCircleRAF is declared in the script's scope
                cancelAnimationFrame(autoCircleRAF);
                autoCircleRAF = null;
            }
            // If the feature is ON in UI but conditions not met, update UI
            if (state.features.autoCircle) {
                state.features.autoCircle = false; // Correct the state
                if (typeof updateMenu === "function") updateMenu();
            }
            return;
        }

        try {
            state.autoCircleAngle += 0.025; // Your original speed
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            const radius = state.circleRadius; // Your original radius logic

            const moveX = centerX + Math.cos(state.autoCircleAngle) * radius;
            const moveY = centerY + Math.sin(state.autoCircleAngle) * radius;

            const canvas = document.querySelector('canvas');
            if (canvas) {
                const event = new MouseEvent('mousemove', {
                    clientX: moveX,
                    clientY: moveY,
                    bubbles: true
                });
                canvas.dispatchEvent(event);
            }
        } catch (err) {
            console.error("Auto Circle error:", err); // Good to keep error logging
        }

        if (state.features.autoCircle) { // Keep requesting frame if feature is still on
            autoCircleRAF = requestAnimationFrame(autoCircle);
        } else { // Explicitly clear if toggled off elsewhere
            if (autoCircleRAF) {
                cancelAnimationFrame(autoCircleRAF);
                autoCircleRAF = null;
            }
        }
    }

    // === SNAKE TRAIL DRAWING ===
    function drawSnakeTrail() {
        if (!state.features.snakeTrail || !state.snakeTrailPoints || !state.snakeTrailPoints.length) { // Removed isInGame check here, trail can be drawn if points exist
             if (typeof clearTrailOverlay === "function") clearTrailOverlay(); // Call your clear function
             return;
        }
        const overlay = createTrailOverlayCanvas(); // Use your (now updated) createTrailOverlayCanvas
        if (!overlay) return;
        const ctx = overlay.getContext('2d');
        ctx.clearRect(0, 0, overlay.width, overlay.height);

        const TRAIL_MAX_AGE = 1500;
        const now = Date.now();

        const viewX = window.snake ? window.snake.xx || 0 : 0;
        const viewY = window.snake ? window.snake.yy || 0 : 0;
        const viewZoom = window.gsc || 1;
        // Use overlay center if trail is aligned to game canvas, else window center
        const screenCenterX = overlay.width / 2;
        const screenCenterY = overlay.height / 2;

        ctx.save();
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 8; // Your original lineWidth
        ctx.shadowBlur = 12; // Your original shadowBlur
        ctx.shadowColor = state.features.snakeTrailColor;

        for (let i = 1; i < state.snakeTrailPoints.length; i++) {
            const p1 = state.snakeTrailPoints[i-1];
            const p2 = state.snakeTrailPoints[i];
            const age = now - ((p1.time + p2.time) / 2);
            const alpha = Math.max(0, 1 - age / TRAIL_MAX_AGE);

            if (alpha <= 0) continue;

            const deltaX1 = p1.x - viewX;
            const deltaY1 = p1.y - viewY;
            const screenX1 = screenCenterX + deltaX1 * viewZoom;
            const screenY1 = screenCenterY + deltaY1 * viewZoom;

            const deltaX2 = p2.x - viewX;
            const deltaY2 = p2.y - viewY;
            const screenX2 = screenCenterX + deltaX2 * viewZoom;
            const screenY2 = screenCenterY + deltaY2 * viewZoom;

            ctx.strokeStyle = hexToRgba(state.features.snakeTrailColor, alpha * 0.7);
            ctx.beginPath();
            ctx.moveTo(screenX1, screenY1);
            ctx.lineTo(screenX2, screenY2);
            ctx.stroke();
        }
        ctx.restore();
    }

   // === FOOD BOT V29: "APEX PREDATOR" (Aggressive Cut-offs + Feasting + Tactical ESP) ===
    function runFoodBot() {
        // 1. Sync State
        if (document.getElementById('bot-brain-script')) {
             const settings = {
                 type: state.features.foodBot ? "143X_BOT_START" : "143X_BOT_STOP",
                 colors: {
                     head: document.getElementById('esp-head-color')?.value || '#FF0000',
                     body: document.getElementById('esp-body-color')?.value || '#FF0000',
                     food: document.getElementById('esp-food-color')?.value || '#FFFFFF',
                     me: '#00FF00'
                 },
                 showStats: document.getElementById('show-stats-toggle')?.checked || false
             };
             window.postMessage(settings, "*");
             return;
        }

        // 2. Inject The Apex Brain
        const script = document.createElement('script');
        script.id = 'bot-brain-script';
        script.textContent = `
            (function() {
                console.log("143X Brain: V29 APEX Loaded");

                // --- CONFIG ---
                let espEnabled = false;
                let botEnabled = false;
                let showStats = true;
                let colors = { head: '#FF0000', body: '#FF0000', food: '#FFFFFF', me: '#00FF00' };

                // --- VISUAL STATE ---
                let tick = 0;
                let graphData = new Array(60).fill(0);
                const canvas = document.createElement('canvas');
                Object.assign(canvas.style, { position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', zIndex: '9000', pointerEvents: 'none' });
                document.body.appendChild(canvas);
                const ctx = canvas.getContext('2d');

                // --- LOGIC STATE ---
                let currentTargetId = null;
                let state = "IDLE";

                function resize() { canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
                window.addEventListener('resize', resize);
                resize();

                // --- COMM ---
                window.addEventListener("message", e => {
                    if(!e.data) return;
                    if(e.data.type === "143X_BOT_START") botEnabled = true;
                    if(e.data.type === "143X_BOT_STOP") { botEnabled = false; if(window.setAcceleration) window.setAcceleration(0); if(!espEnabled) ctx.clearRect(0,0,canvas.width,canvas.height); }
                    if(e.data.type === "143X_ESP_TOGGLE") { espEnabled = e.data.val; if(!espEnabled && !botEnabled) ctx.clearRect(0,0,canvas.width,canvas.height); }
                    if(e.data.type === "143X_UPDATE_CONFIG") { if(e.data.showStats !== undefined) showStats = e.data.showStats; }
                    if(e.data.colors) colors = e.data.colors;
                });

                // --- ALIGNMENT MATH ---
                function toScreen(x, y) {
                    if(!window.mc) return {x:-9999, y:-9999};
                    let rect = window.mc.getBoundingClientRect();
                    let gsc = window.gsc || 1;
                    let gX = (window.mww2 || 0) + gsc * (x - (window.view_xx || 0));
                    let gY = (window.mhh2 || 0) + gsc * (y - (window.view_yy || 0));
                    return {
                        x: rect.left + (gX * (rect.width / window.mc.width)),
                        y: rect.top + (gY * (rect.height / window.mc.height))
                    };
                }
                function dist(x1, y1, x2, y2) { return Math.hypot(x2-x1, y2-y1); }

                // --- VISUAL HELPERS ---
                function drawBar(x, y, w, h, pct, color) {
                    ctx.fillStyle = "rgba(10,15,20,0.8)"; ctx.fillRect(x, y, w, h);
                    ctx.fillStyle = color; ctx.fillRect(x+1, y+1, (w-2)*Math.min(1, pct), h-2);
                }

                function drawReticle(x, y, rad, color, label) {
                    ctx.save();
                    ctx.translate(x, y);
                    ctx.rotate(tick * 0.05);
                    ctx.strokeStyle = color; ctx.lineWidth = 2;
                    ctx.shadowBlur = 10; ctx.shadowColor = color;

                    // Tech Circle
                    ctx.setLineDash([5, 10]);
                    ctx.beginPath(); ctx.arc(0, 0, rad, 0, Math.PI*2); ctx.stroke();
                    ctx.setLineDash([]);

                    // Brackets
                    ctx.rotate(-tick * 0.1);
                    ctx.beginPath();
                    ctx.moveTo(-rad, -10); ctx.lineTo(-rad, 10);
                    ctx.moveTo(rad, -10); ctx.lineTo(rad, 10);
                    ctx.moveTo(-10, -rad); ctx.lineTo(10, -rad);
                    ctx.moveTo(-10, rad); ctx.lineTo(10, rad);
                    ctx.stroke();

                    if(label) {
                        ctx.rotate(0);
                        ctx.fillStyle = "#FFF"; ctx.font = "10px monospace"; ctx.textAlign = "center";
                        ctx.fillText(label, 0, rad + 15);
                    }
                    ctx.restore();
                }

                function drawTechBox(x, y, w, h, title) {
                    ctx.fillStyle = "rgba(12, 16, 24, 0.9)";
                    ctx.strokeStyle = "rgba(0, 255, 255, 0.5)";
                    ctx.lineWidth = 1;
                    ctx.fillRect(x, y, w, h);
                    ctx.strokeRect(x, y, w, h);

                    ctx.fillStyle = "rgba(0, 255, 255, 0.1)";
                    ctx.fillRect(x, y, w, 20); // Header

                    ctx.fillStyle = "#00FFFF";
                    ctx.font = "bold 11px monospace";
                    ctx.fillText(title, x + 10, y + 14);
                }

                function drawGraph(x, y, w, h, data) {
                    ctx.beginPath(); ctx.strokeStyle = "#00FF00"; ctx.lineWidth = 1;
                    let max = Math.max(...data, 100);
                    for(let i=0; i<data.length; i++) {
                        let px = x + (i/(data.length-1))*w;
                        let py = y + h - (data[i]/max)*h;
                        if(i===0) ctx.moveTo(px,py); else ctx.lineTo(px,py);
                    }
                    ctx.stroke();
                }

                // --- MAIN LOOP ---
                setInterval(function() {
                    if ((!botEnabled && !espEnabled) || !window.slither || !window.slithers) return;
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    tick++;

                    const me = window.slither;
                    if (!me || me.dead) return;

                    const myHeadX = me.xx + (me.fx||0);
                    const myHeadY = me.yy + (me.fy||0);
                    const myScreen = toScreen(myHeadX, myHeadY);
                    const myAngle = me.ang;
                    const mySize = me.sc || 1;
                    const myScore = Math.floor(15 * (me.sct + (me.fam||0)) - 5);

                    // --- LOGIC VARIABLES ---
                    let moveX = Math.cos(myAngle);
                    let moveY = Math.sin(myAngle);
                    let avoidX = 0, avoidY = 0;
                    let forceX = 0, forceY = 0;
                    let shouldBoost = false;
                    state = "WANDERING"; // Default
                    let dangerDetected = false;
                    let huntTarget = null;

                    // Update Graph
                    if(tick % 10 === 0) { graphData.shift(); graphData.push(myScore); }

                    // --- 1. SCAN ENEMIES (ESP + AVOIDANCE + HUNTING) ---
                    for (let s of window.slithers) {
                        if (s.id === me.id || s.dead) continue;

                        let ex = s.xx + (s.fx||0);
                        let ey = s.yy + (s.fy||0);
                        let eScreen = toScreen(ex, ey);
                        let distToHead = dist(myHeadX, myHeadY, ex, ey);
                        let sSize = s.sc || 1;

                        // ESP Visuals
                        if(espEnabled || botEnabled) {
                            let isThreat = distToHead < (300 + mySize*50);
                            let color = isThreat ? "#FF0044" : "#00FFFF";

                            if(showStats && eScreen.x > -50 && eScreen.x < canvas.width+50) {
                                // Health Bar
                                let sScore = Math.floor(15 * (s.sct + (s.fam||0)));
                                drawBar(eScreen.x - 20, eScreen.y - 35, 40, 4, Math.min(1, sSize/8), color);
                                // Name
                                ctx.fillStyle = "#FFF"; ctx.font = "bold 10px Arial"; ctx.textAlign = "center";
                                ctx.fillText((s.nk || "Anon") + " [" + sScore + "]", eScreen.x, eScreen.y - 40);
                                // Head Dot
                                ctx.beginPath(); ctx.fillStyle = color; ctx.arc(eScreen.x, eScreen.y, 5*sSize, 0, Math.PI*2); ctx.fill();
                                // Skeleton
                                if(isThreat) {
                                    ctx.strokeStyle = color; ctx.lineWidth = 1;
                                    ctx.beginPath();
                                    let pts = s.pts;
                                    for(let i=pts.length-1; i>=0; i-=5) {
                                        let p = pts[i]; if(p.dying) continue;
                                        let pPos = toScreen(p.xx, p.yy);
                                        if(i===pts.length-1) ctx.moveTo(pPos.x, pPos.y); else ctx.lineTo(pPos.x, pPos.y);
                                    }
                                    ctx.stroke();
                                }
                            }
                        }

                        // BOT LOGIC: Collision Avoidance
                        if(botEnabled) {
                            let pts = s.pts;
                            for(let i=0; i<pts.length; i+=2) {
                                let p = pts[i];
                                if(p.dying) continue;
                                let dSq = (p.xx - myHeadX)**2 + (p.yy - myHeadY)**2;
                                let d = Math.sqrt(dSq);
                                let safeDist = 100 + (mySize * 40); // Safety Bubble

                                if(d < safeDist) {
                                    dangerDetected = true;
                                    // Strong Repulsion
                                    let force = (safeDist - d) / safeDist;
                                    force = Math.pow(force, 3) * 500; // Cubic push for emergency
                                    avoidX -= (p.xx - myHeadX) * force;
                                    avoidY -= (p.yy - myHeadY) * force;

                                    // Draw Threat Line
                                    if(espEnabled) {
                                        let pPos = toScreen(p.xx, p.yy);
                                        ctx.strokeStyle = "rgba(255, 0, 0, 0.8)"; ctx.lineWidth = 3;
                                        ctx.beginPath(); ctx.moveTo(myScreen.x, myScreen.y); ctx.lineTo(pPos.x, pPos.y); ctx.stroke();
                                    }
                                }
                            }

                            // BOT LOGIC: Cut-off Hunting
                            // Conditions: Close, No immediate danger, moving roughly parallel
                            if (!dangerDetected && distToHead < 500 && distToHead > 100) {
                                let eAng = s.ang;
                                // Check if we are generally moving in similar direction (dot product > 0)
                                let dot = Math.cos(myAngle) * Math.cos(eAng) + Math.sin(myAngle) * Math.sin(eAng);

                                if(dot > 0.3) {
                                    // Calculate Intercept Point (Where their head will be)
                                    let leadDist = 200 + (mySize * 50);
                                    let intX = ex + Math.cos(eAng) * leadDist;
                                    let intY = ey + Math.sin(eAng) * leadDist;

                                    // Check if intercept point is closer to me than them (advantage)
                                    let distMe = Math.hypot(intX - myHeadX, intY - myHeadY);
                                    let distThem = Math.hypot(intX - ex, intY - ey);

                                    if(distMe < distThem * 0.8) {
                                        huntTarget = { x: intX, y: intY, snake: s };
                                    }
                                }
                            }
                        }
                    }

                    // --- 2. DECISION ENGINE ---
                    if(botEnabled) {
                        let bestFood = null;
                        let maxScore = -Infinity;

                        // Find Food
                        if(window.foods) {
                            for(let f of window.foods) {
                                if(!f || !f.xx) continue;
                                let d = dist(myHeadX, myHeadY, f.xx, f.yy);
                                // Value size heavily, penalize distance
                                let score = (f.sz ** 3) / (d + 1);
                                if(score > maxScore) { maxScore = score; bestFood = f; }
                            }
                        }

                        // PRIORITY 1: SURVIVAL (Evasion)
                        if(dangerDetected) {
                            state = "EVADING";
                            forceX = avoidX;
                            forceY = avoidY;
                            shouldBoost = false; // Don't boost into walls
                        }
                        // PRIORITY 2: FEASTING (Dead Snake)
                        else if(bestFood && bestFood.sz > 12 && maxScore > 50) {
                            state = "FEASTING";
                            let dirX = bestFood.xx - myHeadX;
                            let dirY = bestFood.yy - myHeadY;
                            let mag = Math.hypot(dirX, dirY);

                            forceX = (dirX/mag) * 1000; // Strong pull
                            forceY = (dirY/mag) * 1000;
                            shouldBoost = mag > 100; // Boost to eat

                            let fPos = toScreen(bestFood.xx, bestFood.yy);
                            drawReticle(fPos.x, fPos.y, 30, "#FFA500", "FEAST");
                        }
                        // PRIORITY 3: HUNTING (Cut-off)
                        else if(huntTarget) {
                            state = "CUTTING OFF";
                            let dirX = huntTarget.x - myHeadX;
                            let dirY = huntTarget.y - myHeadY;
                            let mag = Math.hypot(dirX, dirY);

                            forceX = (dirX/mag) * 800;
                            forceY = (dirY/mag) * 800;
                            shouldBoost = true; // Aggressive

                            let tPos = toScreen(huntTarget.x, huntTarget.y);
                            drawReticle(tPos.x, tPos.y, 20, "#FF00FF", "KILL");
                            ctx.strokeStyle = "#FF00FF"; ctx.beginPath(); ctx.moveTo(myScreen.x, myScreen.y); ctx.lineTo(tPos.x, tPos.y); ctx.stroke();
                        }
                        // PRIORITY 4: FORAGING (Standard Food)
                        else if(bestFood) {
                            state = "FORAGING";
                            let dirX = bestFood.xx - myHeadX;
                            let dirY = bestFood.yy - myHeadY;
                            let mag = Math.hypot(dirX, dirY);

                            forceX = (dirX/mag) * 200;
                            forceY = (dirY/mag) * 200;

                            let fPos = toScreen(bestFood.xx, bestFood.yy);
                            ctx.strokeStyle = "rgba(0, 255, 0, 0.3)"; ctx.beginPath(); ctx.moveTo(myScreen.x, myScreen.y); ctx.lineTo(fPos.x, fPos.y); ctx.stroke();
                        }
                        // PRIORITY 5: WANDER
                        else {
                            forceX = Math.cos(me.ang) * 100;
                            forceY = Math.sin(me.ang) * 100;
                        }

                        // Execute Movement
                        let finalX = myHeadX + forceX;
                        let finalY = myHeadY + forceY;
                        let sTarget = toScreen(finalX, finalY);

                        window.xm = sTarget.x - canvas.width/2;
                        window.ym = sTarget.y - canvas.height/2;

                        if(window.setAcceleration) window.setAcceleration(shouldBoost ? 1 : 0);
                    }

                    // --- 3. HUD RENDER ---
                    if(botEnabled || espEnabled) {
                        let hudW = 240; let hudH = 160;
                        let hudX = canvas.width - hudW - 20;
                        let hudY = 100;

                        drawTechBox(hudX, hudY, hudW, hudH, "APEX SYSTEM V29");

                        ctx.fillStyle = "#FFF"; ctx.font = "12px monospace"; ctx.textAlign = "left";
                        ctx.fillText("MODE   : " + (botEnabled ? "AUTOPILOT" : "MANUAL"), hudX + 15, hudY + 40);

                        ctx.fillStyle = state === "EVADING" ? "#FF0044" : (state === "FEASTING" ? "#FFA500" : (state === "CUTTING OFF" ? "#FF00FF" : "#00FF00"));
                        ctx.fillText("ACTION : " + state, hudX + 15, hudY + 55);

                        ctx.fillStyle = "#888";
                        ctx.fillText("GROWTH VELOCITY", hudX + 15, hudY + 80);
                        drawGraph(hudX + 15, hudY + 90, hudW - 30, 50, graphData);
                    }

                }, 40);
            })();
        `;
        document.body.appendChild(script);

        // Init Config
        setTimeout(() => {
             const headC = document.getElementById('esp-head-color')?.value || '#FF0000';
             const bodyC = document.getElementById('esp-body-color')?.value || '#FF0000';
             const foodC = document.getElementById('esp-food-color')?.value || '#FFFFFF';
             const showStats = document.getElementById('show-stats-toggle')?.checked;
             window.postMessage({
                 colors: { head: headC, body: bodyC, food: foodC, me: '#00FF00' },
                 showStats: showStats
             }, "*");
             if(state.features.foodBot) window.postMessage({type: "143X_BOT_START"}, "*");
        }, 500);
    }

        // === AUTO BOOST ===
        function autoBoost() {
            if (!state.features.autoBoost || !state.isInGame) {
                if (state.boosting) {
                    state.boosting = false;
                    if (typeof window.setAcceleration === 'function') window.setAcceleration(0);
                    document.dispatchEvent(new KeyboardEvent('keyup', { key: ' ' }));
                }
                return;
            }
            if (!state.boosting) {
                state.boosting = true;
                if (typeof window.setAcceleration === 'function') window.setAcceleration(1);
                document.dispatchEvent(new KeyboardEvent('keydown', { key: ' ' }));
            }
        }
        function autoBoostLoop() {
            autoBoost();
            setTimeout(autoBoostLoop, 100);
        }
        autoBoostLoop();

    function fpsCounter() {
        state.fpsFrames++;
        const now = Date.now();
        if (now - state.fpsLastCheck >= 1000) {
            state.fps = state.fpsFrames;
            state.fpsFrames = 0;
            state.fpsLastCheck = now;
            if (state.features.fpsDisplay && fpsDisplay) { // Check if fpsDisplay exists
                fpsDisplay.textContent = `FPS: ${state.fps}`;
            }
            // Update ping in simplified menu status if visible
            if (state.simplified && state.menuVisible) {
                const pingValueDisplay = document.getElementById("ping-value-simplified");
                if (pingValueDisplay) pingValueDisplay.textContent = `${state.ping} ms`;
            }

        }
        requestAnimationFrame(fpsCounter);
    }
    fpsCounter();


    // === NEW: VISUAL FILTERS LOGIC (Corrected to target the whole screen) ===
    function applyVisualFilter() {
        // Instead of targeting just the canvas, we will target the entire page body.
        const targetElement = document.body;

        let filterValue = '';
        switch (state.features.visualMode) {
            case 'invert':
                filterValue = 'invert(1)';
                break;
            case 'contrast':
                filterValue = 'contrast(1.75)';
                break;
            case 'grayscale':
                filterValue = 'grayscale(1)';
                break;
            case 'sepia':
                filterValue = 'sepia(1)';
                break;
            case 'none':
            default:
                filterValue = 'none';
                break;
        }
        // Apply the filter to the entire body element.
        targetElement.style.filter = filterValue;
    }


        function deathSoundObserver() { /* ... unchanged ... */ }
        state.deathSound.preload = 'auto';
        state.deathSound.load();
        state.deathSound.addEventListener('ended', () => { state.deathSound.currentTime = 0; });
        deathSoundObserver();

        function applyPerformanceMode() {
            if (typeof window !== "undefined") {
                switch (state.features.performanceMode) {
                    case 1: window.want_quality = 0; window.high_quality = false; window.render_mode = 1; break;
                    case 2: window.want_quality = 1; window.high_quality = false; window.render_mode = 2; break;
                    case 3: window.want_quality = 2; window.high_quality = true; window.render_mode = 2; break;
                }
            }
            updateMenu(); // Update menu to reflect change
        }
        applyPerformanceMode(); // Initial call

        // === ZOOM LOCK ===
        // === ZOOM LOCK ===
        function zoomLockLoop() {
            // Stop this from running on Damnbruh.com
            if (isDamnBruh) return;

            if (typeof window.gsc !== 'undefined' && state.isInGame) { // Check isInGame // Check isInGame
                if (Math.abs(window.gsc - state.zoomFactor) > 0.001) { // Avoid tiny floating point updates
                    window.gsc = state.zoomFactor;
                }
            }
            requestAnimationFrame(zoomLockLoop);
        }
        // REMOVE the standalone zoomLockLoop(); call from here. It will be called once at the end.

        function pingLoop() { // Simplified ping display, mainly for simplified menu status
            let currentPing = 0;
            if (window.lagging && typeof window.lagging === "number") currentPing = Math.round(window.lagging);
            else if (window.lag && typeof window.lag === "number") currentPing = Math.round(window.lag);
            state.ping = currentPing;

            // Ping display element outside menu is removed, rely on status in menu
            // If you want it back, recreate it and update here:
            // const pingDisplayEl = document.getElementById('ping-display');
            // if (pingDisplayEl) pingDisplayEl.textContent = `Ping: ${currentPing} ms`;

            // This is now handled in fpsCounter to reduce DOM updates
            // if (state.simplified && state.menuVisible) {
            //    const pingValueDisplay = document.getElementById("ping-value-simplified");
            //    if (pingValueDisplay) pingValueDisplay.textContent = `${currentPing} ms`;
            // }
            setTimeout(pingLoop, 500);
        }
        pingLoop();

        function clearTrailOverlay() {
            const overlay = document.getElementById('snake-trail-overlay');
            if (overlay) {
                const ctx = overlay.getContext('2d');
                ctx.clearRect(0, 0, overlay.width, overlay.height);
                overlay.style.display = 'none'; // <--- Hide the overlay when trail is off
            }
        }

        menu.style.display = state.menuVisible ? 'block' : 'none';
        if (fpsDisplay) fpsDisplay.style.display = state.features.fpsDisplay ? 'block' : 'none'; // Check fpsDisplay existence
        if (circleVisual) circleVisual.style.border = `2px dashed ${hexToRgba(state.menuColor, 0.7)}`; // Check existence

        function snakeTrailAnimationLoop() {
            requestAnimationFrame(snakeTrailAnimationLoop);
            drawSnakeTrail();
        }
        setInterval(() => {
            if (!state.features.snakeTrail) {
                state.snakeTrailPoints = [];
                return;
            }

        // Get mouse screen position
        const mouseX = realMouseX;
        const mouseY = realMouseY;


            // Convert screen position to world (game) coordinates
            const viewX = window.snake ? window.snake.xx || 0 : 0;
            const viewY = window.snake ? window.snake.yy || 0 : 0;
            const viewZoom = window.gsc || 1;
            const screenCenterX = window.innerWidth / 2;
            const screenCenterY = window.innerHeight / 2;

            // This formula converts screen (mouse) to world coordinates
            const worldX = viewX + (mouseX - screenCenterX) / viewZoom;
            const worldY = viewY + (mouseY - screenCenterY) / viewZoom;

            if (
                state.snakeTrailPoints.length === 0 ||
                Math.abs(state.snakeTrailPoints[state.snakeTrailPoints.length-1].x - worldX) > 1 ||
                Math.abs(state.snakeTrailPoints[state.snakeTrailPoints.length-1].y - worldY) > 1
            ) {
                state.snakeTrailPoints.push({
                    x: worldX,
                    y: worldY,
                    time: Date.now()
                });

                // Limit trail length
                if (state.snakeTrailPoints.length > 100) state.snakeTrailPoints.shift();
            }

        }, 30);




        // --- START: PARTICLE ENGINE ---
    function startParticleAnimation(theme, canvas) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let particles = [];
        let animationFrameId;

        // This function makes sure the particle area is the same size as the profile card
        function resizeCanvas() {
            const parent = canvas.parentElement;
            if (parent) {
                canvas.width = parent.offsetWidth;
                canvas.height = parent.offsetHeight;
            }
        }

        // This function creates the particles with random positions and speeds
        function createParticles(config) {
            particles = [];
            const area = canvas.width * canvas.height;
            const count = Math.min(config.maxCount, Math.floor(area / (config.density || 5000))); // Ensure not too many particles

            for (let i = 0; i < count; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() * (config.vx.max - config.vx.min) + config.vx.min) * (Math.random() < 0.5 ? -1 : 1),
                    vy: (Math.random() * (config.vy.max - config.vy.min) + config.vy.min),
                    radius: Math.random() * (config.radius.max - config.radius.min) + config.radius.min,
                    alpha: Math.random() * (config.alpha.max - config.alpha.min) + config.alpha.min,
                    alphaChange: config.alphaChange || 0,
                    color: config.colors[Math.floor(Math.random() * config.colors.length)]
                });
            }
        }

        // The main animation loop that draws everything
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach((p, index) => {
                p.x += p.vx;
                p.y += p.vy;
                p.alpha -= p.alphaChange;

                // Reset particle if it goes off-screen or fades out
                if (p.y > canvas.height || p.y < 0 || p.x < 0 || p.x > canvas.width || p.alpha <= 0) {
                    particles.splice(index, 1); // Remove old particle
                    // Add a new one to replace it
                    const config = themeConfigs[theme];
                    particles.push({
                        x: Math.random() * canvas.width,
                        y: canvas.height, // Start from the bottom for rising effects
                        vx: (Math.random() * (config.vx.max - config.vx.min) + config.vx.min) * (Math.random() < 0.5 ? -1 : 1),
                        vy: (Math.random() * (config.vy.max - config.vy.min) + config.vy.min),
                        radius: Math.random() * (config.radius.max - config.radius.min) + config.radius.min,
                        alpha: Math.random() * (config.alpha.max - config.alpha.min) + config.alpha.min,
                        alphaChange: config.alphaChange || 0,
                        color: config.colors[Math.floor(Math.random() * config.colors.length)]
                    });
                }

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;
                ctx.fill();
            });

            animationFrameId = requestAnimationFrame(animate);
        }

        // --- Particle Configurations for Each Theme ---
        const themeConfigs = {
            fire: {
                maxCount: 70, density: 4000,
                vx: { min: -0.3, max: 0.3 }, vy: { min: -0.8, max: -0.2 }, // Moves upwards
                radius: { min: 1, max: 4 }, alpha: { min: 0.4, max: 0.9 },
                alphaChange: 0.005, // Fades out
                colors: ['255,87,34', '255,152,0', '244,67,54']
            },
            ocean: {
                maxCount: 50, density: 6000,
                vx: { min: -0.2, max: 0.2 }, vy: { min: -0.6, max: -0.1 }, // Moves upwards slowly
                radius: { min: 1, max: 5 }, alpha: { min: 0.1, max: 0.5 },
                alphaChange: 0.002,
                colors: ['255,255,255', '173,216,230']
            },
            forest: {
                maxCount: 100, density: 3000,
                vx: { min: -0.1, max: 0.1 }, vy: { min: -0.4, max: -0.05 }, // Barely moves
                radius: { min: 0.5, max: 2 }, alpha: { min: 0.3, max: 0.8 },
                alphaChange: 0.001,
                colors: ['200,255,200', '255,255,255'] // Spores/fireflies
            },
            matrix: {
                maxCount: 150, density: 2000,
                vx: { min: 0, max: 0 }, vy: { min: 0.5, max: 1.5 }, // Moves downwards only
                radius: { min: 2, max: 4 }, alpha: { min: 0.8, max: 1.0 },
                alphaChange: 0.01,
                colors: ['0,255,0']
            }
        };

        if (themeConfigs[theme]) {
            resizeCanvas();
            createParticles(themeConfigs[theme]);
            // Small delay to ensure canvas is ready
            setTimeout(() => {
                if (animationFrameId) cancelAnimationFrame(animationFrameId); // Clear any previous animation
                animate();
            }, 10);
        }

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }
    // --- END: PARTICLE ENGINE ---
// --- START: FINAL GAME SUITE LOGIC (with Blackjack) ---
function showGameMenu() {
    const gameModal = document.getElementById('game-modal-overlay');
    if (!gameModal) return;
    gameModal.style.display = 'flex';

    const repDisplay = document.getElementById('player-rep-display');
    const user = firebase.auth().currentUser;
    if(user) {
        const userRepRef = firebase.database().ref(`playerData/${user.uid}/rep`);
        userRepRef.on('value', (snapshot) => {
            const playerRep = snapshot.val() || 0;
            repDisplay.textContent = `Your REP: ${playerRep.toLocaleString()}`;
        });
    } else {
        repDisplay.textContent = 'Log in to play!';
    }

    const tabButtons = gameModal.querySelectorAll('.game-tab-btn');
    const gameContainers = gameModal.querySelectorAll('.game-container');
    tabButtons.forEach(button => {
        button.onclick = () => {
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            gameContainers.forEach(container => container.style.display = 'none');
            document.getElementById('game-' + button.dataset.gametab).style.display = 'flex';
            if(window.spinTimerInterval) clearInterval(window.spinTimerInterval);

            if (button.dataset.gametab === 'spinner') startSpinnerGame();
            if (button.dataset.gametab === 'slots') startSlotMachineGame();
            if (button.dataset.gametab === 'roulette') startRouletteGame();
            if (button.dataset.gametab === 'blackjack') startBlackjackGame();
        };
    });

    gameModal.onclick = (e) => {
        if (e.target.id === 'game-modal-overlay') {
            gameModal.style.display = 'none';
            if (window.spinTimerInterval) clearInterval(window.spinTimerInterval);
        }
    };
    // Reset to default tab on open
    tabButtons.forEach(btn => btn.classList.remove('active'));
    gameContainers.forEach(c => c.style.display = 'none');
    tabButtons[0].classList.add('active');
    gameContainers[0].style.display = 'flex';
    startSpinnerGame();
}

function startSpinnerGame() {
    const spinButton = document.getElementById('spin-button');
    const spinnerDisplay = document.getElementById('spinner-display');
    const spinnerResult = document.getElementById('spinner-result');
    const spinTimer = document.getElementById('spin-timer');
    const COOLDOWN_HOURS = 24;
    let lastSpin = parseInt(localStorage.getItem('lastRepSpinTime') || '0', 10);
    const cooldownMillis = COOLDOWN_HOURS * 3600000;
    function updateTimer() {
        const remainingTime = (lastSpin + cooldownMillis) - Date.now();
        if (remainingTime <= 0) {
            spinTimer.textContent = 'You can spin now!';
            spinButton.disabled = false; spinButton.style.opacity = '1';
            if (window.spinTimerInterval) clearInterval(window.spinTimerInterval);
            return;
        }
        const h = Math.floor(remainingTime / 3600000);
        const m = Math.floor((remainingTime % 3600000) / 60000);
        const s = Math.floor((remainingTime % 60000) / 1000);
        spinTimer.textContent = `Next spin in: ${h}h ${m}m ${s}s`;
        spinButton.disabled = true; spinButton.style.opacity = '0.5';
    }
    updateTimer();
    if (Date.now() - lastSpin < cooldownMillis) {
        window.spinTimerInterval = setInterval(updateTimer, 1000);
    }
    spinButton.onclick = () => {
        if (Date.now() - (parseInt(localStorage.getItem('lastRepSpinTime') || '0', 10)) < cooldownMillis) return;
        spinButton.disabled = true;
        spinnerResult.textContent = '';
        const prizes = [1, 5, 5, 10, 10, 10, 25, 25, 50, 100];
        const prize = prizes[Math.floor(Math.random() * prizes.length)];
        let spinAnim = setInterval(() => spinnerDisplay.textContent = Math.floor(Math.random() * 100) + 1, 50);
        setTimeout(() => {
            clearInterval(spinAnim);
            spinnerDisplay.textContent = prize;
            spinnerResult.textContent = `You won ${prize} REP!`;
            lastSpin = Date.now();
            localStorage.setItem('lastRepSpinTime', lastSpin.toString());
            const user = firebase.auth().currentUser;
            if (user) { firebase.database().ref(`playerData/${user.uid}/rep`).transaction(rep => (rep || 0) + prize); }
            updateTimer();
            window.spinTimerInterval = setInterval(updateTimer, 1000);
        }, 2000);
    };
}

function startSlotMachineGame() {
    const user = firebase.auth().currentUser;
    if (!user) return;

    const spinBtn = document.getElementById('slot-spin-btn');
    const reels = document.querySelectorAll('.slot-reel');
    const resultDisplay = document.getElementById('slot-result');
    const betAmountInput = document.getElementById('slot-bet-amount');
    const userRepRef = firebase.database().ref(`playerData/${user.uid}/rep`);

    const BASE_BET = 5; // The original bet amount for payout scaling
    const SYMBOLS = ['🍋', '🍒', '🍊', '🍉', '💎', '7️⃣'];
    // Payouts are now per-symbol for a 3-in-a-row line
    const PAYOUTS = { '🍋': 10, '🍒': 15, '🍊': 20, '🍉': 25, '💎': 50, '7️⃣': 100 };

    // Define the 8 winning paylines by their grid indices (0-8)
    const paylines = [
        [0, 1, 2], // Top row
        [3, 4, 5], // Middle row
        [6, 7, 8], // Bottom row
        [0, 3, 6], // Left column
        [1, 4, 7], // Middle column
        [2, 5, 8], // Right column
        [0, 4, 8], // Diagonal top-left to bottom-right
        [2, 4, 6]  // Diagonal top-right to bottom-left
    ];

    let isSpinning = false;

    // Function to check all paylines for wins
    function checkWin(finalReels) {
        let totalPayout = 0;
        const winningLineIndices = new Set();

        paylines.forEach(line => {
            const [a, b, c] = line; // Get the indices for this line
            // Check if the symbols at these indices are the same
            if (finalReels[a] === finalReels[b] && finalReels[b] === finalReels[c]) {
                const winningSymbol = finalReels[a];
                totalPayout += PAYOUTS[winningSymbol];
                // Add the indices of the winning line to a set to highlight them
                line.forEach(index => winningLineIndices.add(index));
            }
        });

        return { totalPayout, winningLineIndices };
    }

    spinBtn.onclick = async () => {
        if (isSpinning) return;

        const betAmount = parseInt(betAmountInput.value);
        if (isNaN(betAmount) || betAmount < 1) {
            resultDisplay.textContent = "Invalid bet amount!";
            return;
        }

        const snapshot = await userRepRef.once('value');
        if (snapshot.val() < betAmount) {
            resultDisplay.textContent = "Not enough REP to play!";
            return;
        }

        isSpinning = true;
        spinBtn.disabled = true;
        spinBtn.style.opacity = '0.5';
        resultDisplay.textContent = '';
        reels.forEach(reel => reel.classList.remove('win-line')); // Clear previous win highlights

        await userRepRef.transaction(rep => (rep || 0) - betAmount);

        let spinCount = 0;
        const spinInterval = setInterval(() => {
            reels.forEach(reel => reel.textContent = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
            spinCount++;
            if (spinCount > 20) {
                clearInterval(spinInterval);
                finishSpin(betAmount);
            }
        }, 100);
    };

    function finishSpin(betAmount) {
        // Generate the final state for all 9 reels
        const finalReels = Array.from({ length: 9 }, () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);

        // Update the UI with the final symbols
        reels.forEach((reel, i) => reel.textContent = finalReels[i]);

        const { totalPayout, winningLineIndices } = checkWin(finalReels);

        if (totalPayout > 0) {
        const payoutMultiplier = betAmount / BASE_BET;
        const finalWinnings = Math.floor(totalPayout * payoutMultiplier);

        resultDisplay.textContent = `WINNER! You won ${finalWinnings.toLocaleString()} REP!`;
        userRepRef.transaction(rep => (rep || 0) + finalWinnings);

        // FIX: Grab name directly from local storage
        const currentName = localStorage.getItem("nickname") || "Anon";

        firebase.database().ref(`minigameHighscores/slots/${user.uid}`).transaction(currentData => {
            const currentScore = (currentData && currentData.score) ? currentData.score : 0;
            if (finalWinnings > currentScore) {
                // Save BOTH name and score
                return { name: currentName, score: finalWinnings };
            }
            return currentData;
        });
        // --- END NEW ---
        } else {
            resultDisplay.textContent = "Try again!";
        }

        isSpinning = false;
        spinBtn.disabled = false;
        spinBtn.style.opacity = '1';
    }
}

function startRouletteGame() {
    const user = firebase.auth().currentUser; if (!user) return;
    const wheel = document.getElementById('roulette-wheel');
    const resultDisplay = document.getElementById('roulette-result');
    const betAmountInput = document.getElementById('roulette-bet-amount');
    const betButtons = document.querySelectorAll('.roulette-bet-btn');
    const userRepRef = firebase.database().ref(`playerData/${user.uid}/rep`);
    let isSpinning = false, selectedBet = null, currentRotation = 0;
    const numbers = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const numberColors = {};
    [0].forEach(n => numberColors[n] = 'green');
    [1,3,5,7,9,12,14,16,18,19,21,23,25,27,30,32,34,36].forEach(n => numberColors[n] = 'red');
    [2,4,6,8,10,11,13,15,17,20,22,24,26,28,29,31,33,35].forEach(n => numberColors[n] = 'black');

    const spinWheel = async () => {
        if (isSpinning || !selectedBet) { resultDisplay.textContent = "Select a color to bet on!"; return; }
        const betAmount = parseInt(betAmountInput.value);
        if (isNaN(betAmount) || betAmount <= 0) { resultDisplay.textContent = "Invalid bet amount!"; return; }
        const snapshot = await userRepRef.once('value');
        if (snapshot.val() < betAmount) { resultDisplay.textContent = "Not enough REP!"; return; }
        isSpinning = true;
        betButtons.forEach(b => { b.disabled = true; b.style.opacity = 0.5; });
        resultDisplay.textContent = 'Spinning...';
        await userRepRef.transaction(rep => (rep || 0) - betAmount);
        const randomIndex = Math.floor(Math.random() * numbers.length);
        const winningNumber = numbers[randomIndex];
        const anglePerNumber = 360 / numbers.length;
        const randomOffset = (Math.random() - 0.5) * anglePerNumber * 0.8;
        const targetRotation = (360 * 5) + (anglePerNumber * (numbers.length - 1 - randomIndex)) + randomOffset;
        currentRotation += targetRotation;
        wheel.style.transform = `rotate(${currentRotation}deg)`;
        setTimeout(() => {
            const winningColor = numberColors[winningNumber];
            resultDisplay.innerHTML = `Landed on <span style="font-weight:bold; color:${winningColor}; text-shadow: 0 0 5px ${winningColor};">${winningNumber}</span>!`;
            const payout = (selectedBet === winningColor) ? betAmount * (winningColor === 'green' ? 14 : 2) : 0;
            if (payout > 0) {
            resultDisplay.innerHTML += ` You won ${payout.toLocaleString()} REP!`;
            userRepRef.transaction(rep => (rep || 0) + payout);

                const currentName = localStorage.getItem("nickname") || "Anon";

                firebase.database().ref(`minigameHighscores/roulette/${user.uid}`).transaction(currentData => {
                    const currentScore = (currentData && currentData.score) ? currentData.score : 0;
                    if (payout > currentScore) {
                        return { name: currentName, score: payout };
                    }
                    return currentData;
                });
            } else {
                resultDisplay.innerHTML += ` You lost your bet.`;
            }
            isSpinning = false;
            betButtons.forEach(b => { b.disabled = false; b.style.opacity = 1; });
            selectedBet = null;
            betButtons.forEach(btn => btn.classList.remove('selected'));
        }, 4100);
    };

    betButtons.forEach(button => button.onclick = () => {
        if (isSpinning) return;
        betButtons.forEach(btn => btn.classList.remove('selected'));
        button.classList.add('selected');
        selectedBet = button.dataset.bet;
        spinWheel();
    });
}

function startBlackjackGame() {
    const user = firebase.auth().currentUser; if (!user) return;
    const userRepRef = firebase.database().ref(`playerData/${user.uid}/rep`);
    const dealBtn = document.getElementById('blackjack-deal-btn'), hitBtn = document.getElementById('blackjack-hit-btn'), standBtn = document.getElementById('blackjack-stand-btn'),
          betControls = document.getElementById('blackjack-bet-controls'), actionControls = document.getElementById('blackjack-action-controls'),
          betInput = document.getElementById('blackjack-bet-amount'), resultEl = document.getElementById('blackjack-result');
    let deck = [], playerHand = [], dealerHand = [], bet = 0;
    const createDeck = () => {
        deck = []; const suits = ['♥', '♦', '♣', '♠'], values = ['2','3','4','5','6','7','8','9','10','J','Q','K','A'];
        for(let suit of suits) { for(let value of values) { deck.push({suit, value}); } }
    };
    const shuffleDeck = () => { for (let i = deck.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [deck[i], deck[j]] = [deck[j], deck[i]]; } };
    const getCardValue = (card) => { if (['J', 'Q', 'K'].includes(card.value)) return 10; if (card.value === 'A') return 11; return parseInt(card.value); };
    const getHandScore = (hand) => {
        let score = hand.reduce((sum, card) => sum + getCardValue(card), 0);
        let aceCount = hand.filter(card => card.value === 'A').length;
        while(score > 21 && aceCount > 0) { score -= 10; aceCount--; }
        return score;
    };
    const renderHand = (hand, elementId, scoreId, hideFirstCard = false) => {
        const handEl = document.getElementById(elementId); handEl.innerHTML = '';
        hand.forEach((card, index) => {
            const cardEl = document.createElement('div'); cardEl.className = 'blackjack-card';
            if (['♥', '♦'].includes(card.suit)) cardEl.classList.add('red');
            if (hideFirstCard && index === 0) { cardEl.classList.add('blackjack-card-hidden'); } else { cardEl.innerHTML = `<span style="align-self: flex-start; font-size: 0.8em;">${card.value}${card.suit}</span><span style="font-size: 1.5em;">${card.suit}</span><span style="align-self: flex-end; transform: rotate(180deg); font-size: 0.8em;">${card.value}${card.suit}</span>`; }
            handEl.appendChild(cardEl);
        });
        document.getElementById(scoreId).textContent = hideFirstCard ? getCardValue(hand[1]) : getHandScore(hand);
    };
        const endRound = (message, payoutMultiplier) => {
        renderHand(dealerHand, 'blackjack-dealer-cards', 'blackjack-dealer-score', false);
        resultEl.textContent = message;
        if (payoutMultiplier > 0) {
            userRepRef.transaction(rep => (rep || 0) + Math.floor(bet * payoutMultiplier));

            // Only count actual wins (multiplier > 1), ignore ties/pushes (multiplier == 1)
            if (payoutMultiplier > 1) {
                // --- UPDATED SAVE LOGIC ---
                const userName = localStorage.getItem("nickname") || "Anon";

                firebase.database().ref(`minigameHighscores/blackjack/${user.uid}`).transaction(currentData => {
                    const currentWins = (currentData && currentData.score) ? currentData.score : 0;
                    // Increment total wins by 1
                    return { name: userName, score: currentWins + 1 };
                });
                    }
            // --- END NEW ---
        }
        betControls.style.display = 'flex'; actionControls.style.display = 'none';
    };
    dealBtn.onclick = async () => {
        bet = parseInt(betInput.value);
        if (isNaN(bet) || bet <= 0) { resultEl.textContent = "Invalid bet!"; return; }
        const snapshot = await userRepRef.once('value');
        if (snapshot.val() < bet) { resultEl.textContent = "Not enough REP!"; return; }
        await userRepRef.transaction(rep => (rep || 0) - bet);
        createDeck(); shuffleDeck(); playerHand = [deck.pop(), deck.pop()]; dealerHand = [deck.pop(), deck.pop()];
        resultEl.textContent = ''; betControls.style.display = 'none'; actionControls.style.display = 'flex';
        renderHand(playerHand, 'blackjack-player-cards', 'blackjack-player-score');
        renderHand(dealerHand, 'blackjack-dealer-cards', 'blackjack-dealer-score', true);
        if (getHandScore(playerHand) === 21) {
            if (getHandScore(dealerHand) === 21) { endRound("Push! It's a tie.", 1); }
            else { endRound("Blackjack! You win!", 2.5); }
        }
    };
    hitBtn.onclick = () => {
        playerHand.push(deck.pop()); renderHand(playerHand, 'blackjack-player-cards', 'blackjack-player-score');
        if (getHandScore(playerHand) > 21) { endRound("Bust! You lose.", 0); }
    };
    standBtn.onclick = () => {
        actionControls.style.display = 'none'; renderHand(dealerHand, 'blackjack-dealer-cards', 'blackjack-dealer-score', false);
        const dealerTurn = setInterval(() => {
            const dealerScore = getHandScore(dealerHand);
            if (dealerScore < 17) { dealerHand.push(deck.pop()); renderHand(dealerHand, 'blackjack-dealer-cards', 'blackjack-dealer-score'); }
            else {
                clearInterval(dealerTurn); const playerScore = getHandScore(playerHand);
                if (dealerScore > 21 || playerScore > dealerScore) { endRound("You win!", 2); }
                else if (playerScore < dealerScore) { endRound("Dealer wins.", 0); }
                else { endRound("Push! It's a tie.", 1); }
            }
        }, 800);
    };
    // Initial state reset
    betControls.style.display = 'flex'; actionControls.style.display = 'none'; resultEl.textContent = '';
    renderHand([], 'blackjack-player-cards', 'blackjack-player-score');
    renderHand([], 'blackjack-dealer-cards', 'blackjack-dealer-score');
}
// --- END: FINAL GAME SUITE LOGIC ---

// --- START: FINAL GAME SUITE MODAL (with Blackjack) ---
if (!document.getElementById('game-modal-overlay')) {
    const gameModalHTML = `
        <div id="game-modal-overlay" style="display:none; position:fixed; top:0; left:0; width:100vw; height:100vh; z-index:10010; background:rgba(0,0,0,0.85); align-items:center; justify-content:center; font-family: 'Segoe UI', Arial, sans-serif;">
            <div id="game-modal-content" style="background:#23232a; border-radius:12px; box-shadow:0 8px 30px rgba(0,0,0,0.5); display:flex; flex-direction:column; min-width:600px; max-width: 90vw; border: 1px solid var(--menu-color, #4CAF50); overflow:hidden;">
                <!-- Game Tabs -->
                <div id="game-tabs" style="display:flex; background:rgba(0,0,0,0.2);">
                    <button class="game-tab-btn active" data-gametab="spinner">💎 Daily Spinner</button>
                    <button class="game-tab-btn" data-gametab="slots">🎰 Slot Machine</button>
                    <button class="game-tab-btn" data-gametab="roulette">🎲 Roulette</button>
                    <button class="game-tab-btn" data-gametab="blackjack">🃏 Blackjack</button>
                </div>
                <div id="game-content-area" style="padding:25px 35px; max-height: 80vh; overflow-y: auto;">
                    <div id="player-rep-display" style="color: #ddd; margin-bottom: 20px; font-size: 1.2em; text-align:center; font-weight:bold; background: rgba(0,0,0,0.2); padding: 8px; border-radius: 6px;">Your REP: Loading...</div>

                    <!-- Spinner Game -->
                    <div id="game-spinner" class="game-container" style="display:flex; flex-direction:column; align-items:center;"></div>
                    <!-- Slot Machine Game -->
                    <div id="game-slots" class="game-container" style="display:none; flex-direction:column; align-items:center;"></div>
                    <!-- Roulette Game -->
                    <div id="game-roulette" class="game-container" style="display:none; flex-direction:column; align-items:center;"></div>

                    <!-- Blackjack Game -->
                    <div id="game-blackjack" class="game-container" style="display:none; flex-direction:column; align-items:center; width:100%;">
                        <h2 style="color:var(--menu-color, #4CAF50); margin:0 0 15px 0;">Blackjack</h2>
                        <div id="blackjack-table" style="width:100%;">
                            <!-- Dealer's Hand -->
                            <div class="blackjack-hand-area">
                                <h3 class="blackjack-hand-title">Dealer's Hand (<span id="blackjack-dealer-score">0</span>)</h3>
                                <div id="blackjack-dealer-cards" class="blackjack-cards"></div>
                            </div>
                            <!-- Player's Hand -->
                            <div class="blackjack-hand-area">
                                <h3 class="blackjack-hand-title">Your Hand (<span id="blackjack-player-score">0</span>)</h3>
                                <div id="blackjack-player-cards" class="blackjack-cards"></div>
                            </div>
                        </div>
                        <div id="blackjack-result" class="game-result-text" style="font-size:1.5em;"></div>
                        <!-- Bet Controls -->
                        <div id="blackjack-bet-controls" style="margin:15px 0; display:flex; flex-direction:column; align-items:center; gap:10px;">
                            <div>
                                <label for="blackjack-bet-amount" style="color:#ccc; margin-right:10px; font-weight:bold;">BET AMOUNT:</label>
                                <input id="blackjack-bet-amount" type="number" min="1" value="10" style="width:100px; text-align:center; font-size:1.1em; padding: 8px; border-radius:5px; border:1px solid #555; background:#222; color:#eee;">
                            </div>
                            <button id="blackjack-deal-btn" class="mod-menu-button" style="font-size: 1.1em; padding: 10px 20px; background-color: #27ae60;">Deal Cards</button>
                        </div>
                        <!-- Action Controls -->
                        <div id="blackjack-action-controls" style="display:none; gap: 15px; margin-top:15px;">
                            <button id="blackjack-hit-btn" class="mod-menu-button" style="font-size: 1.1em; padding: 10px 20px;">Hit</button>
                            <button id="blackjack-stand-btn" class="mod-menu-button" style="font-size: 1.1em; padding: 10px 20px; background-color:#c0392b;">Stand</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = gameModalHTML;
    document.body.appendChild(tempDiv.firstElementChild);

    // Copy original game content into the new structure
    document.getElementById('game-spinner').innerHTML = `<h2 style="color:var(--menu-color, #4CAF50); margin:0 0 20px 0;">Daily REP Spinner</h2><div id="spinner-display" style="font-size: 4em; font-weight: bold; color: #fff; background: #111; padding: 20px 40px; border-radius: 10px; margin-bottom: 20px; min-width: 150px; text-align: center;">0</div><div id="spinner-result" class="game-result-text"></div><button id="spin-button" class="mod-menu-button" style="font-size: 1.2em; padding: 12px 25px;">Spin for REP!</button><div id="spin-timer" style="color: #aaa; margin-top: 15px;"></div>`;
    document.getElementById('game-slots').innerHTML = `<h2 style="color:var(--menu-color, #4CAF50); margin:0 0 20px 0;">REP Slot Machine</h2><div id="slot-reels" style="display:flex; gap:15px; background:#111; padding: 20px; border-radius:10px; margin-bottom:20px; border: 2px solid #555;"><div class="slot-reel">💎</div><div class="slot-reel">💎</div><div class="slot-reel">💎</div></div><div id="slot-result" class="game-result-text"></div><button id="slot-spin-btn" class="mod-menu-button" style="font-size: 1.2em; padding: 12px 25px;">Spin! (Cost: 5 REP)</button>`;
    document.getElementById('game-roulette').innerHTML = `<h2 style="color:var(--menu-color, #4CAF50); margin:0 0 15px 0;">REP Roulette</h2><div id="roulette-wheel-container" style="position:relative; width:200px; height:200px; margin-bottom:15px;"><div id="roulette-wheel"></div><div id="roulette-ball-marker" style="position: absolute; top: -5px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 15px solid white;"></div></div><div id="roulette-result" class="game-result-text"></div><div id="roulette-bet-controls" style="width:100%; text-align:center;"><div style="margin-bottom:15px;"><label for="roulette-bet-amount" style="color:#ccc; margin-right:10px; font-weight:bold;">BET AMOUNT:</label><input id="roulette-bet-amount" type="number" min="1" value="10" style="width:100px; text-align:center; font-size:1.1em; padding: 8px; border-radius:5px; border:1px solid #555; background:#222; color:#eee;"></div><div id="roulette-bets"><button class="roulette-bet-btn" data-bet="red" style="background:#c0392b; color:white;">Red (2x)</button><button class="roulette-bet-btn" data-bet="black" style="background:#2c3e50; color:white;">Black (2x)</button><button class="roulette-bet-btn" data-bet="green" style="background:#27ae60; color:white;">Green (14x)</button></div></div>`;

    const style = document.createElement('style');
    style.textContent = `
        .game-tab-btn { flex: 1; background: transparent; border: none; color: #aaa; font-size: 1.1em; padding: 15px; cursor: pointer; transition: all 0.2s; border-bottom: 3px solid transparent; }
        .game-tab-btn:hover { background: rgba(255,255,255,0.05); color: #fff; }
        .game-tab-btn.active { color: var(--menu-color, #4CAF50); border-bottom-color: var(--menu-color, #4CAF50); }
        .game-result-text { color: #FFD700; font-size: 1.2em; height: 25px; margin: 15px 0; font-weight: bold; text-align:center; }
        .slot-reel { font-size: 4em; width: 80px; height: 100px; line-height: 100px; text-align:center; background: #2a2a2e; color: #fff; border-radius: 8px; text-shadow: 0 0 5px #000; }
        #roulette-wheel { width: 200px; height: 200px; border-radius: 50%; background-image: conic-gradient(green 0 9.7deg, red 9.7deg 19.4deg, black 19.4deg 29.1deg, red 29.1deg 38.8deg, black 38.8deg 48.5deg, red 48.5deg 58.2deg, black 58.2deg 67.9deg, red 67.9deg 77.6deg, black 77.6deg 87.3deg, red 87.3deg 97deg, black 97deg 106.7deg, red 106.7deg 116.4deg, black 116.4deg 126.1deg, red 126.1deg 135.8deg, black 135.8deg 145.5deg, red 145.5deg 155.2deg, black 155.2deg 164.9deg, red 164.9deg 174.6deg, black 174.6deg 184.3deg, red 184.3deg 194deg, black 194deg 203.7deg, red 203.7deg 213.4deg, black 213.4deg 223.1deg, red 223.1deg 232.8deg, black 232.8deg 242.5deg, red 242.5deg 252.2deg, black 252.2deg 261.9deg, red 261.9deg 271.6deg, black 271.6deg 281.3deg, red 281.3deg 291deg, black 291deg 300.7deg, red 300.7deg 310.4deg, black 310.4deg 320.1deg, red 320.1deg 329.8deg, black 329.8deg 339.5deg, red 339.5deg 349.2deg, black 349.2deg 360deg); border: 5px solid #8c6432; transition: transform 4s cubic-bezier(0.2, 0.8, 0.7, 1); }
        .roulette-bet-btn { padding: 10px 15px; font-size: 1em; margin: 0 5px; cursor: pointer; border: 2px solid #555; color: #fff; border-radius: 5px; font-weight: bold; }
        .roulette-bet-btn.selected { border-color: #FFD700; box-shadow: 0 0 10px #FFD700; transform: scale(1.05); }
        .blackjack-hand-area { margin-bottom: 20px; background: rgba(0,0,0,0.2); border-radius: 8px; padding: 15px; }
        .blackjack-hand-title { margin: 0 0 10px 0; color: #ccc; border-bottom: 1px solid #444; padding-bottom: 8px; }
        .blackjack-cards { display: flex; gap: 10px; min-height: 105px; }
        .blackjack-card { width: 70px; height: 100px; border: 2px solid #999; border-radius: 8px; background: white; color: black; display: flex; flex-direction: column; justify-content: space-between; padding: 5px; font-size: 1.5em; font-weight: bold; }
        .blackjack-card.red { color: #c0392b; }
        .blackjack-card-hidden { background: repeating-linear-gradient(45deg, #555, #555 10px, #444 10px, #444 20px); }
    `;
    document.head.appendChild(style);
}
// --- END: FINAL GAME SUITE MODAL ---


// === START: FINAL ADMIN PROFILE/MODERATION CLICK HANDLING SYSTEM ===
// ====================================================XXX===============

// This function handles opening the "Edit Profile" modal FOR YOURSELF
function openEditProfileModal() {
    document.getElementById('profile-avatar-input').value = localStorage.getItem("profileAvatar") || '';
    document.getElementById('profile-motto-input').value = localStorage.getItem("profileMotto") || '';
    const editModal = document.getElementById('edit-profile-modal-overlay');
    if (editModal) { editModal.style.display = 'flex'; }
    const statusEl = document.getElementById('profile-modal-status');
    if (statusEl) { statusEl.textContent = ''; }
}
// ==========XXX=========================================================
// === START: COMBINED PROFILE & MODERATION SYSTEM (FINAL FIX) =====
// ================================================XXX===================



// This function handles saving profile data for YOURSELF or for OTHERS (if you're an admin).
// This is the SECURED version of the function
async function saveProfile() {
    const statusEl = document.getElementById('profile-modal-status');
    const saveButton = document.getElementById('profile-modal-save');
    const editModal = document.getElementById('edit-profile-modal-overlay');

    const targetUid = editModal.dataset.targetUid;
    const currentUser = firebase.auth().currentUser;
    const uidToSave = targetUid || currentUser?.uid;

    if (!uidToSave) {
        if (statusEl) statusEl.textContent = 'Error: No user to save for!';
        return;
    }

    if (saveButton) saveButton.disabled = true;
    if (statusEl) statusEl.textContent = 'Saving...';

    // --- FIX IS HERE: We now use sanitizeInput() on both fields ---
    const newAvatarUrl = sanitizeInput(document.getElementById('profile-avatar-input').value.trim());
    const newMotto = sanitizeInput(document.getElementById('profile-motto-input').value.trim());
    // --- END OF FIX ---

    try {
        // --- CORRECTED LINE ---
        const userRef = firebase.database().ref(`playerData/${uidToSave}`);
        await userRef.update({ profileAvatar: newAvatarUrl, profileMotto: newMotto });

        // Update localStorage only if it's your own profile
        if (uidToSave === currentUser?.uid) {
            localStorage.setItem("profileAvatar", newAvatarUrl);
            localStorage.setItem("profileMotto", newMotto);
        }

        if (statusEl) statusEl.textContent = 'Saved Successfully!';
        setTimeout(() => {
            editModal.style.display = 'none';
            delete editModal.dataset.targetUid;
            document.getElementById('profile-popup')?.remove();
        }, 1200);

    } catch (error) {
        console.error("Error saving profile:", error);
        if (statusEl) statusEl.textContent = 'Error: Could not save to cloud.';
    } finally {
        if (saveButton) saveButton.disabled = false;
    }
}

// ===========X===========================================X=============
// === START: COMBINED PROFILE & MODERATION SYSTEM (FINAL FIX) =====
// ===================XX================================================



// --- START OF FINAL PROFILE & THEME REPLACEMENT ---
async function showUserProfile(uid, overrideTheme = null) {
    if (!uid) return;

    // Clean up any previous profile and its animations
    const oldPopup = document.getElementById('profile-popup');
    if (oldPopup && typeof oldPopup.cleanup === 'function') {
        oldPopup.cleanup();
    }
    oldPopup?.remove();

    let avatarUrl = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(uid)}`,
        motto = '<i>No motto set.</i>', isOnline = false, userChatColor = '#FFD700',
        username = 'Anon', playerRep = 0, unlockedBadges = {}, modVersion = 'Unknown',
        profileTheme = 'default';

    const currentUser = firebase.auth()?.currentUser;

    try {
        const userSnap = await firebase.database().ref("onlineUsers/" + uid).once('value');
        const playerDataSnap = await firebase.database().ref("playerData/" + uid).once('value');

        if (userSnap.exists()) {
            const userData = userSnap.val();
            username = escapeHTML(filterProfanity(userData.name || 'Anon'));
            isOnline = (Date.now() - (userData.lastActive || 0) < 300000);
            userChatColor = userData.chatNameColor || '#FFD700';
            if (userData.modVersion) modVersion = userData.modVersion;
        }

        if (playerDataSnap.exists()) {
            const pData = playerDataSnap.val();
            playerRep = pData.rep || 0;
            unlockedBadges = pData.badges || {};
            if (pData.profileAvatar) avatarUrl = pData.profileAvatar;
            if (pData.profileMotto) motto = escapeHTML(filterProfanity(pData.profileMotto));
            if (pData.profileTheme) profileTheme = pData.profileTheme;
        }

        if (!motto.trim() || motto === '<i></i>') motto = '<i>No motto set.</i>';
    } catch (err) { console.error(`Failed to fetch profile for UID ${uid}:`, err); }

    if (currentUser && uid === currentUser.uid) {
        profileTheme = localStorage.getItem('profileTheme') || profileTheme;
    }
    if (overrideTheme) {
        profileTheme = overrideTheme;
    }

    const popup = document.createElement('div');
    popup.className = 'profile-popup';
    popup.id = 'profile-popup';
    popup.dataset.targetUid = uid;
    popup.dataset.targetName = username;

    // --- START: UPGRADED THEMES WITH VISIBLE TEXT ---
    const themes = {
        'default': { name: 'Default', style: 'color: #ccc; font-weight: bold;' },
        'fire': { name: 'Ember', style: 'color: #fff; text-shadow: 1px 1px 4px #000; font-weight: bold; background: linear-gradient(135deg, #4a0b0b, #9d2a07, #210404); border-color: #ff4b2b;', particles: 'fire' },
        'ocean': { name: 'Abyss', style: 'color: #fff; text-shadow: 1px 1px 4px #000; font-weight: bold; background: linear-gradient(260deg, #02112d, #062a6c, #0d3b8e); border-color: #4e54c8;', particles: 'ocean' },
        'forest': { name: 'Mystic Forest', style: 'color: #fff; text-shadow: 1px 1px 4px #000; font-weight: bold; background: linear-gradient(135deg, #09300d, #145c1a, #031c05); border-color: #71B280;', particles: 'forest' },
        'matrix': { name: 'Matrix', style: 'color: #00ff00; text-shadow: 0 0 5px #00ff00, 0 0 2px #fff; font-weight: bold; background-color: #000000; border-color: #00ff00;', particles: 'matrix' },
        'galaxy': { name: 'Starfield', style: `color: #fff; text-shadow: 1px 1px 4px #000; font-weight: bold; background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px), radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px), radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px), radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px); background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px; background-position: 0 0, 40px 60px, 130px 270px, 70px 100px; background-color: #0d1024; animation: animated-galaxy 200s linear infinite;` },
        'gold': { name: 'Liquid Gold', style: 'color: #000; text-shadow: 1px 1px 2px rgba(255,255,255,0.4); font-weight: bold; background: linear-gradient(100deg, #b29f00, #ffdf33, #b29f00, #ffbf00); background-size: 400% 400%; animation: animated-gold 6s linear infinite; border-color: #ffbf00;', particles: null },
        'ice': { name: 'Glacier', style: 'color: #002233; text-shadow: 1px 1px 2px rgba(255,255,255,0.5); font-weight: bold; background: linear-gradient(135deg, #d4f2ff, #83c6e2, #a7d9ed); border-color: #a7d9ed;', particles: null }
    };
    // --- END: UPGRADED THEMES WITH VISIBLE TEXT ---

    if (themes[profileTheme]) {
        popup.style.cssText += themes[profileTheme].style;
    } else {
        popup.style.setProperty('--menu-color', state.menuColor);
    }

    let highestRank = { name: 'Unranked', icon: '🌱', level: 0 };
    if (config.repMilestones) {
        for (const level in config.repMilestones) {
            const repNeeded = parseInt(level);
            if (playerRep >= repNeeded && repNeeded >= highestRank.level) {
                highestRank = { ...config.repMilestones[level], level: repNeeded };
            }
        }
    }

    const sortedBadgeKeys = Object.keys(unlockedBadges).sort((a, b) => parseInt(a) - parseInt(b));
    const badgesHTML = `<div style="margin-top: 5px; margin-bottom: 8px; display: flex; gap: 8px; flex-wrap: wrap; justify-content: center; max-width: 220px;">
        ${sortedBadgeKeys.map(level => {
            const badge = unlockedBadges[level];
            return `<span title="${badge.name} (Unlocked at ${level} REP)" style="font-size: 1.5em; cursor: help;">${badge.icon}</span>`;
        }).join('')}
    </div>`;

    let nameDisplay, devTagHTML = '', selfEditButtonHTML = '', adminButtonsHTML = '', sendRepButtonHTML = '';
    const isDeveloper = isDev(uid);

    if (isDeveloper) { nameDisplay = rainbowTextStyle(username); devTagHTML = `<span style="background: #e91e63; color: #fff; padding: 2px 7px; border-radius: 4px; font-size: 0.8em; margin-left: 8px; font-weight: 700; vertical-align:middle;">DEV</span>`; }
    else if (isVip(uid, username)) { nameDisplay = vipGlowStyle(username, userChatColor); }
    else { nameDisplay = username; }

    if (currentUser && isDev(currentUser.uid) && uid !== currentUser.uid) { adminButtonsHTML = `<div style="margin-top:10px; display:flex; gap: 8px;"><button id="admin-edit-profile-btn" class="mod-menu-button" style="background-color:${state.menuColor};">🛠️ Edit Profile</button><button id="admin-rename-btn" class="mod-menu-button" style="background-color:#ff9800;">✏️ Change Name</button><button id="timeout-chat-btn" class="mod-menu-button" style="background-color:#c9302c;">⏰ Timeout</button></div>`; }
    if (currentUser && uid !== currentUser.uid) {
        sendRepButtonHTML = `<button id="send-rep-btn" class="mod-menu-button" style="background-color:#E91E63; font-size: 1em; padding: 10px 18px; margin-top: 15px;">💖 Send REP</button>`;
    }
    if (currentUser && uid === currentUser.uid) {
        selfEditButtonHTML = `<div style="margin-top:15px;"><button id="profile-edit-btn" class="mod-menu-button" style="background-color:#007bff; font-size: 1em; padding: 10px 18px;">✏️ Edit My Profile</button></div>`;
    }

    const defaultAvatar = `https://i.imgur.com/M6NYjjO.jpeg`;

    // The canvas is now added here if a particle theme is selected
    const particleCanvasHTML = themes[profileTheme] && themes[profileTheme].particles ? `<canvas id="profile-particle-canvas" style="position:absolute; top:0; left:0; width:100%; height:100%; z-index:0;"></canvas>` : '';

    // All content is now wrapped in a container to appear above the canvas
    popup.innerHTML = `
        ${particleCanvasHTML}
        <div style="position:relative; z-index:1; display:flex; flex-direction:column; align-items:center; width:100%;">
            <button class="close-btn" title="Close" onclick="this.closest('.profile-popup').remove();">×</button>
            <img class="avatar" src="${avatarUrl}" alt="Avatar" style="border-color:${userChatColor};" onerror="this.src='${defaultAvatar}';">
            <div style="font-size:1.23em;font-weight:bold;margin-bottom:2px;">${nameDisplay} ${devTagHTML}</div>
            <div title="${highestRank.name} - Unlocked at ${highestRank.level} REP" style="color: #ccc; cursor: help; margin-bottom: 8px;">
                <span style="font-size: 1.2em; vertical-align: middle;">${highestRank.icon}</span> ${highestRank.name}
            </div>
            <div style="margin-bottom:10px;"><span class="status-dot" style="background:${isOnline ? '#0f0':'#888'}"></span><span style="font-size:1.04em;">${isOnline ? 'Online':'Offline'}</span></div>
            ${badgesHTML}
            <div style="width: 90%; text-align: left; margin-bottom: 15px;">
                <div style="font-size: 0.9em; color: #ccc; margin-bottom: 4px; display: flex; justify-content: space-between;">
                    <span>REP Level: ${Math.floor(playerRep/100)}</span><span style="font-weight: bold;">${playerRep.toLocaleString()}</span>
                </div>
                <div style="background: #222; border-radius: 5px; height: 12px; border: 1px solid #444; padding: 1px;">
                    <div style="width: ${playerRep%100}%; height: 100%; background: linear-gradient(to right, #4CAF50, #8BC34A); border-radius: 3px;"></div>
                </div>
            </div>
            <div style="margin:8px 0 0 0; color:#ccc; font-style: italic; background: rgba(0,0,0,0.2); padding: 8px 12px; border-radius: 6px; text-align: center; word-break: break-word;">
                ${motto}
            </div>
            ${selfEditButtonHTML}
            ${adminButtonsHTML}
            ${sendRepButtonHTML}
            <div style="margin-top: 15px; font-size: 0.8em; color: #aaa; font-family: 'Courier New', monospace; text-align: left; width: 90%;">
                <div style="word-break: break-all;">UID: <span style="color: #fff; user-select: text; cursor: text;">${uid}</span></div>
                <div>Version: <span style="color: #fff;">${modVersion}</span></div>
            </div>
        </div>
    `;

    document.body.appendChild(popup);

    const particleCanvas = document.getElementById('profile-particle-canvas');
    if (particleCanvas && themes[profileTheme] && themes[profileTheme].particles) {
        popup.cleanup = startParticleAnimation(themes[profileTheme].particles, particleCanvas);
    }
}

document.addEventListener('click', async function(e) {
    if (e.target.closest('.profile-popup .close-btn')) {
        const popup = e.target.closest('.profile-popup');
        if (popup && typeof popup.cleanup === 'function') {
            popup.cleanup();
        }
        popup?.remove();
        return;
    }

    if (e.target.id === 'profile-modal-save') { saveProfile(); return; }
    // ... (admin buttons logic remains unchanged)

    if (e.target.id === 'profile-edit-btn') { openEditProfileModal(); return; }

    if (e.target.id === 'profile-themes-btn') {
        const overlay = document.getElementById('themes-modal-overlay');
        const grid = overlay.querySelector('.themes-grid');
        const editModal = document.getElementById('edit-profile-modal-overlay');
        const targetUid = editModal.dataset.targetUid;
        const currentUser = firebase.auth()?.currentUser;
        const uidToSaveFor = targetUid || currentUser?.uid;
        let selectedThemeId = null;

        grid.innerHTML = '';
        const closeButton = document.getElementById('close-themes-modal');
        closeButton.textContent = 'Apply & Close';
        closeButton.style.background = '#4CAF50';

        const themes = {
            'default': { name: 'Default', style: '' },
            'fire': { name: 'Ember', style: 'background: linear-gradient(135deg, #4a0b0b, #9d2a07, #210404); border-color: #ff4b2b;', particles: 'fire' },
            'ocean': { name: 'Abyss', style: 'background: linear-gradient(260deg, #02112d, #062a6c, #0d3b8e); border-color: #4e54c8;', particles: 'ocean' },
            'forest': { name: 'Mystic Forest', style: 'background: linear-gradient(135deg, #09300d, #145c1a, #031c05); border-color: #71B280;', particles: 'forest' },
            'matrix': { name: 'Matrix', style: 'background-color: #000000; border-color: #00ff00;', particles: 'matrix' },
            'galaxy': { name: 'Starfield', style: `background-image: radial-gradient(white, rgba(255,255,255,.2) 2px, transparent 40px), radial-gradient(white, rgba(255,255,255,.15) 1px, transparent 30px), radial-gradient(white, rgba(255,255,255,.1) 2px, transparent 40px), radial-gradient(rgba(255,255,255,.4), rgba(255,255,255,.1) 2px, transparent 30px); background-size: 550px 550px, 350px 350px, 250px 250px, 150px 150px; background-position: 0 0, 40px 60px, 130px 270px, 70px 100px; background-color: #0d1024; color: #fff; border-color: #888; animation: animated-galaxy 200s linear infinite;` },
            'gold': { name: 'Liquid Gold', style: 'background: linear-gradient(100deg, #b29f00, #ffdf33, #b29f00, #ffbf00); background-size: 400% 400%; animation: animated-gold 6s linear infinite; border-color: #ffbf00; color: #000; font-weight: bold;' },
            'ice': { name: 'Glacier', style: 'background: linear-gradient(135deg, #d4f2ff, #83c6e2, #a7d9ed); border-color: #a7d9ed; color: #002233;'}
        };

        const currentTheme = targetUid ? '' : (localStorage.getItem('profileTheme') || 'default');
        selectedThemeId = currentTheme;

        for (const [id, theme] of Object.entries(themes)) {
            const preview = document.createElement('div');
            preview.className = 'theme-preview';
            preview.textContent = theme.name;
            preview.style.cssText += theme.style;
            if (id === currentTheme) {
                preview.classList.add('selected');
            }
            preview.onclick = () => {
                selectedThemeId = id;
                document.querySelectorAll('.theme-preview').forEach(p => p.classList.remove('selected'));
                preview.classList.add('selected');
            };
            grid.appendChild(preview);
        }

        closeButton.onclick = async () => {
            if (uidToSaveFor && selectedThemeId) {
                await firebase.database().ref(`playerData/${uidToSaveFor}`).update({ profileTheme: selectedThemeId });
                if (!targetUid) {
                    localStorage.setItem('profileTheme', selectedThemeId);
                    showUserProfile(uidToSaveFor, selectedThemeId);
                } else {
                    alert(`Theme for user has been set to "${themes[selectedThemeId].name}".`);
                    document.getElementById('profile-popup')?.remove();
                }
            }
            overlay.style.display = 'none';
        };

        overlay.style.display = 'flex';
        return;
    }

    if (e.target.id === 'close-themes-modal' || e.target.id === 'themes-modal-overlay') {
        document.getElementById('themes-modal-overlay').style.display = 'none';
        return;
    }

    // --- START: RESTORED ADMIN & SAVE BUTTON LOGIC ---
if (e.target.id === 'profile-modal-save') {
    saveProfile();
    return;
}

if (e.target.id === 'admin-edit-profile-btn') {
    const profilePopup = e.target.closest('.profile-popup');
    const editModal = document.getElementById('edit-profile-modal-overlay');
    const currentUser = firebase.auth()?.currentUser;
    if (!profilePopup || !editModal || !currentUser || !isDev(currentUser.uid)) return;

    const targetUid = profilePopup.dataset.targetUid;
    const playerDataRef = firebase.database().ref("playerData/" + targetUid);

    playerDataRef.once('value', (snapshot) => {
        const userData = snapshot.val() || {};
        document.getElementById('profile-avatar-input').value = userData.profileAvatar || '';
        document.getElementById('profile-motto-input').value = userData.profileMotto || '';
        editModal.dataset.targetUid = targetUid;
        editModal.style.display = 'flex';
    });
    return;
}

if (e.target.id === 'timeout-chat-btn') {
    const profilePopup = e.target.closest('.profile-popup');
    const timeoutModal = document.getElementById('timeout-modal-overlay');
    const currentUser = firebase.auth()?.currentUser;
    if (!profilePopup || !timeoutModal || !currentUser || !isDev(currentUser.uid)) return;
    timeoutModal.dataset.targetUid = profilePopup.dataset.targetUid;
    timeoutModal.dataset.targetName = profilePopup.dataset.targetName;
    timeoutModal.style.display = 'flex';
    return;
}

if (e.target.id === 'admin-rename-btn') {
    const profilePopup = e.target.closest('.profile-popup');
    const currentUser = firebase.auth()?.currentUser;
    if (!profilePopup || !currentUser || !isDev(currentUser.uid)) return;

    const targetUid = profilePopup.dataset.targetUid;
    const oldName = profilePopup.dataset.targetName;
    const newName = prompt(`Enter the new name for "${oldName}":`);

    if (!newName || newName.trim().length === 0 || newName.length > 20) {
        alert("Invalid name. Name cannot be empty or longer than 20 characters.");
        return;
    }

    const sanitizedName = newName.trim();

    firebase.database().ref(`onlineUsers/${targetUid}`).update({ name: sanitizedName })
        .then(() => {
            firebase.database().ref("slitherChat").push({
                uid: "system", name: "System",
                text: `An admin changed "${oldName}"'s name to "${sanitizedName}".`,
                time: firebase.database.ServerValue.TIMESTAMP, chatNameColor: "#f44336"
            });
            alert(`Successfully changed name to "${sanitizedName}"!`);

            const currentPopup = document.getElementById('profile-popup');
            if (currentPopup && typeof currentPopup.cleanup === 'function') {
                currentPopup.cleanup();
            }
            currentPopup?.remove();

        }).catch((error) => {
            alert("Failed to change name. See console for details.");
            console.error("Admin rename error:", error);
        });
    return;
}
// --- END: RESTORED ADMIN & SAVE BUTTON LOGIC ---

    // --- START: MINI-GAME BUTTON CLICK HANDLER ---
    if (e.target.id === 'open-games-menu-btn') {
        showGameMenu();
        return;
    }
    // --- END: MINI-GAME BUTTON CLICK HANDLER ---

    // --- START: SEND REP CLICK HANDLER ---
if (e.target.id === 'send-rep-btn') {
    const profilePopup = e.target.closest('.profile-popup');
    const repModal = document.getElementById('send-rep-modal-overlay');
    if (!profilePopup || !repModal) return;

    const targetUid = profilePopup.dataset.targetUid;
    const targetName = profilePopup.dataset.targetName;

    repModal.dataset.targetUid = targetUid;
    repModal.dataset.targetName = targetName;
    repModal.querySelector('#send-rep-title').textContent = `Send REP to ${targetName}`;
    repModal.querySelector('#send-rep-status').textContent = '';
    repModal.querySelector('#send-rep-amount').value = '1';
    repModal.style.display = 'flex';
    return;
}

if (e.target.id === 'send-rep-cancel-btn') {
    const repModal = e.target.closest('#send-rep-modal-overlay');
    if (repModal) repModal.style.display = 'none';
    return;
}

if (e.target.id === 'send-rep-confirm-btn') {
    const repModal = e.target.closest('#send-rep-modal-overlay');
    const statusEl = repModal.querySelector('#send-rep-status');
    const confirmBtn = e.target;

    const amountToSend = parseInt(repModal.querySelector('#send-rep-amount').value, 10);
    const recipientUid = repModal.dataset.targetUid;
    const sender = firebase.auth().currentUser;

    if (!sender || !recipientUid) {
        statusEl.textContent = 'Error: Users not found.';
        return;
    }
    if (isNaN(amountToSend) || amountToSend <= 0) {
        statusEl.textContent = 'Invalid amount.';
        return;
    }

    confirmBtn.disabled = true;
    statusEl.textContent = 'Processing...';

    const senderRef = firebase.database().ref(`playerData/${sender.uid}`);
    const recipientRef = firebase.database().ref(`playerData/${recipientUid}`);

    try {
        const senderSnapshot = await senderRef.once('value');
        const senderData = senderSnapshot.val();

        if (!senderData || (senderData.rep || 0) < amountToSend) {
            statusEl.textContent = 'Not enough REP!';
            confirmBtn.disabled = false;
            return;
        }

        // Perform transaction
        await senderRef.child('rep').transaction(rep => (rep || 0) - amountToSend);
        await recipientRef.child('rep').transaction(rep => (rep || 0) + amountToSend);

        statusEl.style.color = '#90EE90';
        statusEl.textContent = 'REP sent successfully!';
        // --- START: New Chat Announcement Code ---
        const senderName = localStorage.getItem("nickname") || "Anon";
        const recipientName = repModal.dataset.targetName;

        if (senderName && recipientName) {
            const chatMessage = {
                uid: "system",
                name: "System",
                text: `💖 ${senderName} sent ${amountToSend.toLocaleString()} REP to ${recipientName}!`,
                time: firebase.database.ServerValue.TIMESTAMP,
                chatNameColor: "#E91E63" // Pink system message
            };
            firebase.database().ref("slitherChat").push(chatMessage);
        }
        // --- END: New Chat Announcement Code ---

        setTimeout(() => {
            repModal.style.display = 'none';
            statusEl.style.color = '#ffc107'; // Reset color
            confirmBtn.disabled = false;
        }, 1500);

    } catch (error) {
        console.error("REP Sending Error:", error);
        statusEl.textContent = 'An error occurred.';
        confirmBtn.disabled = false;
    }
    return;
}
// --- END: SEND REP CLICK HANDLER ---

    const userSpan = e.target.closest('.chat-username, .online-username');
    if (userSpan) { showUserProfile(userSpan.dataset.uid); return; }

    const leaderboardRow = e.target.closest('.leaderboard-clickable-row');
    if (leaderboardRow) {
        document.getElementById('rep-leaderboard-modal').style.display = 'none';
        showUserProfile(leaderboardRow.dataset.uid);
        return;
    }
});

// =========================================================XX==========
// === END: COMBINED PROFILE & MODERATION SYSTEM (FINAL FIX) =====
// ======XX=============================================================


    let neonCanvas = null; /* ... (neon line logic largely unchanged, ensure colors update) ... */
    let neonCtx = null;
    let neonLineActive = false;
    let neonLineColor = state.features.neonLineColor || '#00ffff'; // Initialized from state

    function createNeonLineCanvas() {
        if (neonCanvas) { // If canvas exists, just update size and clear if needed
            neonCanvas.width = window.innerWidth;
            neonCanvas.height = window.innerHeight;
            if (neonCtx) neonCtx.clearRect(0,0,neonCanvas.width, neonCanvas.height); // Clear on resize/re-enable
            return;
        }
        neonCanvas = document.createElement('canvas');
        neonCanvas.width = window.innerWidth;
        neonCanvas.height = window.innerHeight;
        neonCanvas.style.cssText = `
            position: fixed; top: 0; left: 0; z-index: 9990; /* Below menu but above game */
            pointer-events: none; background: transparent;
        `;
        neonCanvas.id = 'neon-line-canvas';
        document.body.appendChild(neonCanvas);
        neonCtx = neonCanvas.getContext('2d');

        window.addEventListener('resize', () => {
            if (neonCanvas) {
                neonCanvas.width = window.innerWidth;
                neonCanvas.height = window.innerHeight;
                // No need to re-set context properties if they don't change on resize
            }
        });
    }

    function removeNeonLineCanvas() { // Optional: if you want to fully remove it
        if (neonCanvas) {
            neonCanvas.remove();
            neonCanvas = null;
            neonCtx = null;
        }
    }

    // --- FIX 1: ENEMY LINES (Overlay) ---
    let visualHacksCanvas = null;
    let visualHacksCtx = null;

    function renderVisualHacks() {
        requestAnimationFrame(renderVisualHacks);

        // 1. Basic checks
        if (!state.features.enemyLines || !state.isInGame || !window.slithers || !window.slither) {
            if (visualHacksCtx) visualHacksCtx.clearRect(0, 0, visualHacksCanvas.width, visualHacksCanvas.height);
            return;
        }

        // 2. Create Canvas if missing
        if (!visualHacksCanvas) {
            visualHacksCanvas = document.createElement('canvas');
            visualHacksCanvas.style.cssText = 'position: fixed; top: 0; left: 0; z-index: 2147483647; pointer-events: none;';
            visualHacksCanvas.width = window.innerWidth;
            visualHacksCanvas.height = window.innerHeight;
            document.body.appendChild(visualHacksCanvas);
            visualHacksCtx = visualHacksCanvas.getContext('2d');

            window.addEventListener('resize', () => {
                visualHacksCanvas.width = window.innerWidth;
                visualHacksCanvas.height = window.innerHeight;
            });
        }

        const ctx = visualHacksCtx;
        const w = visualHacksCanvas.width;
        const h = visualHacksCanvas.height;
        ctx.clearRect(0, 0, w, h);

        // 3. Get Coordinates safely
        const viewX = window.view_xx || window.slither.xx;
        const viewY = window.view_yy || window.slither.yy;
        const zoom = window.gsc || 1.0;
        const cx = w / 2;
        const cy = h / 2;

        ctx.save();
        ctx.lineWidth = 2;

        // 4. Loop through enemies
        for (let i = 0; i < window.slithers.length; i++) {
            const s = window.slithers[i];
            // Skip self and dead snakes
            if (!s || s === window.slither || s.dead) continue;

            // Calculate screen position
            const rx = s.xx + (s.fx || 0);
            const ry = s.yy + (s.fy || 0);
            const screenX = (rx - viewX) * zoom + cx;
            const screenY = (ry - viewY) * zoom + cy;

            // Only draw if relatively close to screen to save performance
            if (screenX > -500 && screenX < w + 500 && screenY > -500 && screenY < h + 500) {

                // Draw Direction Line
                const len = 300 * zoom;
                const ex = screenX + Math.cos(s.ang) * len;
                const ey = screenY + Math.sin(s.ang) * len;

                ctx.strokeStyle = "rgba(255, 0, 0, 0.8)"; // Red Line
                ctx.beginPath();
                ctx.moveTo(screenX, screenY);
                ctx.lineTo(ex, ey);
                ctx.stroke();

                // Draw Head Circle
                ctx.fillStyle = "rgba(255, 0, 0, 0.4)";
                ctx.beginPath();
                ctx.arc(screenX, screenY, 10 * zoom, 0, 2 * Math.PI);
                ctx.fill();
            }
        }
        ctx.restore();
    }


    function neonLineDraw(event) {
        if (!neonCanvas || !neonCtx || !neonLineActive) return;

        // Update context properties based on current state (e.g., color)
        neonCtx.lineWidth = 2.5; // Slightly thicker
        neonCtx.lineCap = 'round';
        neonCtx.shadowBlur = 12; // Main line glow
        neonCtx.shadowColor = state.features.neonLineColor; // Use current color from state
        neonCtx.strokeStyle = state.features.neonLineColor;

        neonCtx.clearRect(0, 0, neonCanvas.width, neonCanvas.height);
        const centerX = neonCanvas.width / 2;
        const centerY = neonCanvas.height / 2;
        const mouseX = event.clientX;
        const mouseY = event.clientY;

        // Draw line
        neonCtx.beginPath();
        neonCtx.moveTo(centerX, centerY);
        neonCtx.lineTo(mouseX, mouseY);
        neonCtx.stroke();

        // Draw glowing dot at mouse cursor
        neonCtx.beginPath();
        neonCtx.arc(mouseX, mouseY, 6, 0, 2 * Math.PI);
        neonCtx.fillStyle = state.features.neonLineColor;
        neonCtx.shadowBlur = 20; // Larger glow for the dot
        neonCtx.shadowColor = hexToRgba(state.features.neonLineColor, 0.7); // slightly transparent shadow for dot for better effect
        neonCtx.fill();
    }




    // Initial actions
    updateMenu(); // Call to build the menu structure and apply styles
    syncServerBoxWithMenu(); // Sync server box styles
    updateCSSVariables(); // Set CSS variables based on initial state.menuColor

        // --- INITIALIZATION ---
        updateServerIpLoop();
        // === GAME NAME RANDOMIZER ONLY ===
        // This puts a Promo Code in the game box, but DOES NOT touch your Chat Name.
        setTimeout(() => {
            const nickInput = document.getElementById('nick');
            if (nickInput) {
                const promos = [
                    "DSC.GG/143X 4 MODS",
                    "DSC.GG/143X 4 MODMENU",
                    "DSC.GG/143X 4 AIMBOT",
                    "DSC.GG/143X 4 ESP",
                    "143X ON TOP",
                    "DSC.GG/143X FREE VIP",
                    "DSC.GG/143X ON TOP",
                    "IM A CHEATER"
                ];

                // 1. Set the GAME name to a random promo
                nickInput.value = promos[Math.floor(Math.random() * promos.length)];

                // 2. Trigger the game to see the text
                nickInput.dispatchEvent(new Event('input', { bubbles: true }));

                // Note: We do NOT update 'mod_chat_username' here, so your chat identity stays safe.
            }
        }, 1500);

        // Apply every time we die (so it changes for the next round)
        setInterval(() => {
            const nickInput = document.getElementById('nick');
            // If the input is empty or just 'Anon', refill it
            if(nickInput && (nickInput.value === '' || nickInput.value === 'Anon')) {
                applyRandomNickname();
            }
        }, 2000);

         if (isDamnBruh) {
            initializeDamnBruhZoom();
        } else {
            // These are for Slither.io
            updateServerIpLoop();
            if (state.features.autoRespawn) enableAutoRespawn();
            addServerBox();
            patchPlayButtons();
            zoomLockLoop(); // Slither's zoom loop
        }

        // These run on both sites
        document.addEventListener('click', primeAudio);
        document.addEventListener('keydown', primeAudio);

        // Start continuous loops that are safe for both
        autoBoostLoop();
        checkGameState();
        drawCircleRestriction();
        fpsCounter();
        deathSoundObserver();
        snakeTrailAnimationLoop();

        if (state.features.autoRespawn) enableAutoRespawn();

        document.addEventListener('click', primeAudio);
        document.addEventListener('keydown', primeAudio);

        addServerBox();
        patchPlayButtons();
        // applyForcedServer(); // Called by patchPlayButtons setup

        // Start continuous loops
        zoomLockLoop();
        autoBoostLoop();
        checkGameState();
        drawCircleRestriction();
        fpsCounter();
        deathSoundObserver();
        snakeTrailAnimationLoop();
        // The setInterval for snakeTrailPoints is already defined globally where its logic is.

        // Initial UI setup calls
        applyPerformanceMode();
        pingLoop();

        updateMenu();
        syncServerBoxWithMenu();
        syncChatBoxWithMenu();
        updateCSSVariables();
        applyUIScale();
        applyBackground();

        window.addEventListener('resize', detectBrowserZoom);
        detectBrowserZoom(); // Run it once on load

        // --- NEW: BACKGROUND ENFORCER LOOP ---
        // Keeps the game background hidden if a custom image is set
        setInterval(() => {
            if (state.savedBgUrl && state.savedBgUrl.trim() !== '') {
                setCustomBackground(state.savedBgUrl);
            }
        }, 500); // Checks every 0.5 seconds

        menu.style.display = state.menuVisible ? 'block' : 'none';
        if (fpsDisplay) fpsDisplay.style.display = state.features.fpsDisplay ? 'block' : 'none';
        setInterval(awardTimeBasedRep, 5 * 60 * 1000); // Check for time-based REP every 5 minutes


        // --- NEW: One-Time Informational Popup ---
(function showOneTimePopup() {
    const popupVersion = 'betaPopup_v1'; // Change this to 'v2', 'v3' etc. to re-show the popup after an update
    const hasSeenPopup = localStorage.getItem(popupVersion);

    if (!hasSeenPopup) {
        // Create the popup elements
        const popupOverlay = document.createElement('div');
        popupOverlay.className = 'info-popup-overlay';

        const popupContent = document.createElement('div');
        popupContent.className = 'info-popup-content';

        popupContent.innerHTML = `
            <h2>Get the Latest Updates!</h2>
            <p>
                If you would like the newest, most updated BETA extension before it eventually releases, please join our Discord!
            </p>
            <p>
                <a href="https://dsc.gg/143X" target="_blank">DSC.GG/143X</a>
            </p>
            <button id="info-popup-ok-btn" class="info-popup-button">OK</button>
        `;

        popupOverlay.appendChild(popupContent);
        document.body.appendChild(popupOverlay);

        // Make it visible
        popupOverlay.style.display = 'flex';

        // Add the event listener for the OK button
        document.getElementById('info-popup-ok-btn').addEventListener('click', () => {
            popupOverlay.style.display = 'none';
            localStorage.setItem(popupVersion, 'true'); // Mark as seen
            popupOverlay.remove(); // Clean up the element from the page
        });
    }








})();
// --- END: One-Time Informational Popup ---
    })(); // End of the main IIFE