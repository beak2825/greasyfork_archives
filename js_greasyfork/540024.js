// ==UserScript==
// @name         Drawaria Play Ocarina of Zelda
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Play highly detailed Ocarina of Time melodies with dynamic visual and audio effects in Drawaria.online! No external assets used.
// @author       YouTubeDrawaria
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/540024/Drawaria%20Play%20Ocarina%20of%20Zelda.user.js
// @updateURL https://update.greasyfork.org/scripts/540024/Drawaria%20Play%20Ocarina%20of%20Zelda.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Core Configuration & Constants ---
    const OC_KEY_MAP = {
        'a': { note: 'A_BUTTON', frequency: 440.00, color: '#00BFFF' }, // A4
        'w': { note: 'C_UP',     frequency: 523.25, color: '#FFFF00' }, // C5
        's': { note: 'C_DOWN',   frequency: 392.00, color: '#FF0000' }, // G4
        'q': { note: 'C_LEFT',   frequency: 349.23, color: '#8A2BE2' }, // F4
        'e': { note: 'C_RIGHT',  frequency: 659.25, color: '#00FF00' }, // E5
    };

    const MELODIES = {
        'song_of_storms': {
            name: "Song of Storms",
            sequence: ['A_BUTTON', 'C_UP', 'A_BUTTON', 'C_UP', 'C_DOWN', 'C_UP', 'A_BUTTON', 'C_DOWN', 'C_UP', 'A_BUTTON'],
            effect: {
                message: 'The sky darkens... a storm is brewing!',
                visual: 'storm'
            }
        },
        'sarias_song': {
            name: "Saria's Song",
            sequence: ['C_DOWN', 'C_RIGHT', 'C_LEFT', 'C_DOWN', 'C_RIGHT', 'C_LEFT'],
            effect: {
                message: 'You feel a connection with nature. Friends are near!',
                visual: 'saria'
            }
        },
        'minuet_of_forest': {
            name: "Minuet of Forest",
            sequence: ['C_UP', 'A_BUTTON', 'C_LEFT', 'C_UP', 'A_BUTTON', 'C_LEFT'], // Adjusted slightly for common OOT Minuet
            effect: {
                message: 'The world blurs for a moment... (teleport simulated)',
                visual: 'teleport'
            }
        }
    };

    const MELODY_MAX_GAP_MS = 600; // Max time between notes to count as part of a melody
    const NOTE_DURATION = 0.2; // seconds for audio tone
    const FADE_OUT_DURATION = 0.15; // seconds for audio fade out

    let audioContext = null;
    let recordedNotes = [];
    let lastNoteTime = 0;
    let notificationElement = null;
    let ocarinaElement = null;
    let ocarinaHoles = {}; // Map note to hole element
    let stormCanvas = null;
    let stormCtx = null;
    let sariaCanvas = null;
    let sariaCtx = null;
    let currentEffect = null;
    let animationFrames = [];

    // --- Web Audio API Functions ---
    function getAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            // Try to resume context if it's suspended (common in some browsers until user interaction)
            if (audioContext.state === 'suspended') {
                const resumeContext = () => {
                    audioContext.resume().then(() => {
                        document.removeEventListener('keydown', resumeContext);
                        document.removeEventListener('click', resumeContext);
                    });
                };
                document.addEventListener('keydown', resumeContext);
                document.addEventListener('click', resumeContext);
            }
        }
        return audioContext;
    }

    function playOcarinaTone(frequency, delay = 0) {
        const ctx = getAudioContext();
        const now = ctx.currentTime;

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);

        oscillator.type = 'sine'; // Pure sine wave for Ocarina tone
        oscillator.frequency.setValueAtTime(frequency, now + delay);

        gainNode.gain.setValueAtTime(0, now + delay); // Start at 0 volume
        gainNode.gain.linearRampToValueAtTime(0.3, now + delay + 0.02); // Quick attack
        gainNode.gain.exponentialRampToValueAtTime(0.0001, now + delay + NOTE_DURATION + FADE_OUT_DURATION); // Exponential decay

        oscillator.start(now + delay);
        oscillator.stop(now + delay + NOTE_DURATION + FADE_OUT_DURATION);
    }

    function playMelodySequence(noteSequence, noteMap) {
        let currentDelay = 0;
        noteSequence.forEach(noteName => {
            const noteInfo = Object.values(noteMap).find(info => info.note === noteName);
            if (noteInfo) {
                playOcarinaTone(noteInfo.frequency, currentDelay);
                currentDelay += NOTE_DURATION + 0.1; // Add small gap between notes
            }
        });
    }

    // --- UI/Visual Functions ---
    function createNotificationElement() {
        notificationElement = document.createElement('div');
        Object.assign(notificationElement.style, {
            position: 'fixed',
            top: '20px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            padding: '10px 20px',
            borderRadius: '5px',
            zIndex: '10000',
            opacity: '0',
            transition: 'opacity 0.5s ease-in-out',
            pointerEvents: 'none',
            textAlign: 'center',
            fontSize: '18px',
            fontFamily: 'monospace, sans-serif' // A simple, clear font
        });
        document.body.appendChild(notificationElement);
    }

    function showNotification(message, duration = 3000) {
        if (!notificationElement) createNotificationElement();
        notificationElement.textContent = message;
        notificationElement.style.opacity = '1';
        clearTimeout(notificationElement.hideTimer);
        notificationElement.hideTimer = setTimeout(() => {
            notificationElement.style.opacity = '0';
        }, duration);
    }

    function createOcarinaElement() {
        ocarinaElement = document.createElement('div');
        Object.assign(ocarinaElement.style, {
            position: 'fixed',
            bottom: '20px',
            left: '20px',
            width: '150px',
            height: '100px',
            borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%', // Ocarina shape
            background: 'radial-gradient(circle at 60% 50%, #A0522D, #8B4513)', // Brown, natural tone
            boxShadow: '0 0 15px rgba(0,0,0,0.5)',
            zIndex: '9999',
            border: '2px solid #5A2A0C',
            transition: 'transform 0.1s ease-out, box-shadow 0.2s ease-in-out',
            display: 'flex',
            justifyContent: 'space-around',
            alignItems: 'center',
            padding: '10px',
            boxSizing: 'border-box',
            animation: 'ocarinaPulse 2s infinite alternate', // Subtle pulsing
            cursor: 'grab' // Indicate it can be dragged
        });
        document.body.appendChild(ocarinaElement);

        // Make ocarina draggable
        let isDragging = false;
        let offset = { x: 0, y: 0 };
        ocarinaElement.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset.x = e.clientX - ocarinaElement.getBoundingClientRect().left;
            offset.y = e.clientY - ocarinaElement.getBoundingClientRect().top;
            ocarinaElement.style.cursor = 'grabbing';
            ocarinaElement.style.transition = 'none'; // Disable transition while dragging
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            ocarinaElement.style.left = `${e.clientX - offset.x}px`;
            ocarinaElement.style.top = `${e.clientY - offset.y}px`;
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            ocarinaElement.style.cursor = 'grab';
            ocarinaElement.style.transition = 'transform 0.1s ease-out, box-shadow 0.2s ease-in-out'; // Re-enable transition
        });

        // CSS Keyframes for ocarina pulse animation
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText = `
            @keyframes ocarinaPulse {
                0% { transform: scale(1); box-shadow: 0 0 15px rgba(0,0,0,0.5); }
                100% { transform: scale(1.02); box-shadow: 0 0 25px rgba(0,0,0,0.8); }
            }
            @keyframes holeGlow {
                0% { box-shadow: 0 0 0px var(--hole-color), 0 0 0px var(--hole-color); }
                50% { box-shadow: 0 0 15px 5px var(--hole-color), 0 0 30px 10px var(--hole-color); }
                100% { box-shadow: 0 0 0px var(--hole-color), 0 0 0px var(--hole-color); }
            }
        `;
        document.head.appendChild(styleSheet);


        // Create holes for each note
        const holePositions = {
            'A_BUTTON': { top: '30%', left: '10%' },
            'C_UP': { top: '10%', left: '40%' },
            'C_DOWN': { top: '50%', left: '40%' },
            'C_LEFT': { top: '30%', left: '70%' },
            'C_RIGHT': { top: '50%', left: '70%' },
        };

        for (const key in OC_KEY_MAP) {
            const noteInfo = OC_KEY_MAP[key];
            const holeDiv = document.createElement('div');
            holeDiv.id = `ocarina-hole-${noteInfo.note}`;
            Object.assign(holeDiv.style, {
                position: 'absolute',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                backgroundColor: '#333',
                border: '1px solid #111',
                cursor: 'pointer',
                transition: 'box-shadow 0.3s ease-out',
                '--hole-color': noteInfo.color // Custom property for glow color
            });
            Object.assign(holeDiv.style, holePositions[noteInfo.note]);
            ocarinaElement.appendChild(holeDiv);
            ocarinaHoles[noteInfo.note] = holeDiv;

            // Add basic click functionality for testing notes
            holeDiv.addEventListener('click', () => {
                handleNotePress(key);
            });
        }
    }

    function flashHole(noteType) {
        const hole = ocarinaHoles[noteType];
        if (hole) {
            hole.style.animation = 'holeGlow 0.6s ease-out forwards';
            // Reset animation by re-setting the property to trigger it again
            hole.addEventListener('animationend', () => {
                hole.style.animation = 'none';
            }, { once: true });
        }
    }

    function createParticle(noteColor, originElement) {
        const particle = document.createElement('div');
        Object.assign(particle.style, {
            position: 'absolute',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            backgroundColor: noteColor,
            opacity: '1',
            transform: 'scale(0)',
            transition: 'opacity 1s ease-out, transform 1s ease-out',
            pointerEvents: 'none',
            zIndex: '10001'
        });

        // Position particle at the center of the ocarina element relative to its current position
        const rect = originElement.getBoundingClientRect();
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top + rect.height / 2}px`;
        document.body.appendChild(particle);

        // Animate particle
        const angle = Math.random() * Math.PI * 2;
        const distance = Math.random() * 50 + 50; // Between 50 and 100px
        const translateX = Math.cos(angle) * distance;
        const translateY = Math.sin(angle) * distance;

        // Force reflow for transform transition
        void particle.offsetWidth;

        particle.style.transform = `translate(${translateX}px, ${translateY}px) scale(1)`;
        particle.style.opacity = '0';

        setTimeout(() => {
            particle.remove();
        }, 1000);
    }

    // --- Global Effect Functions (Canvas based) ---
    function stopCurrentEffect() {
        if (currentEffect) {
            cancelAnimationFrame(animationFrames[0]); // Stop any ongoing animation
            animationFrames = [];
            if (stormCanvas) stormCanvas.remove();
            if (sariaCanvas) sariaCanvas.remove();
            stormCanvas = null;
            sariaCanvas = null;
            document.body.style.backgroundColor = ''; // Reset background color
            document.body.style.filter = ''; // Reset any filter
            const overlay = document.getElementById('global-effect-overlay');
            if (overlay) overlay.remove();
            const playerAvatarGlows = document.querySelectorAll('.player-avatar-glow');
            playerAvatarGlows.forEach(el => el.remove());
        }
        currentEffect = null;
    }

    function startStormEffect() {
        stopCurrentEffect();
        currentEffect = 'storm';

        stormCanvas = document.createElement('canvas');
        Object.assign(stormCanvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '9990',
            pointerEvents: 'none',
            opacity: '0.8'
        });
        stormCanvas.width = window.innerWidth;
        stormCanvas.height = window.innerHeight;
        document.body.appendChild(stormCanvas);
        stormCtx = stormCanvas.getContext('2d');

        const drops = [];
        for (let i = 0; i < 200; i++) {
            drops.push({
                x: Math.random() * stormCanvas.width,
                y: Math.random() * stormCanvas.height,
                length: Math.random() * 20 + 10,
                speed: Math.random() * 5 + 2
            });
        }

        let lightningFlash = false;
        let lightningOpacity = 0;
        let lastLightning = Date.now();
        const lightningOverlay = document.createElement('div');
        lightningOverlay.id = 'global-effect-overlay';
        Object.assign(lightningOverlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            opacity: '0',
            zIndex: '9991',
            pointerEvents: 'none',
            transition: 'opacity 0.1s ease-out'
        });
        document.body.appendChild(lightningOverlay);

        function drawStorm() {
            stormCtx.clearRect(0, 0, stormCanvas.width, stormCanvas.height);
            stormCtx.strokeStyle = 'rgba(173, 216, 230, 0.7)'; // Light blue for rain
            stormCtx.lineWidth = 1.5;

            drops.forEach(drop => {
                stormCtx.beginPath();
                stormCtx.moveTo(drop.x, drop.y);
                stormCtx.lineTo(drop.x, drop.y + drop.length);
                stormCtx.stroke();
                drop.y += drop.speed;
                if (drop.y > stormCanvas.height) {
                    drop.y = -drop.length;
                    drop.x = Math.random() * stormCanvas.width;
                }
            });

            // Handle lightning
            if (Date.now() - lastLightning > 5000 + Math.random() * 10000) { // Random interval for lightning
                lightningFlash = true;
                lightningOpacity = 1;
                lightningOverlay.style.opacity = '1';
                lastLightning = Date.now();
            }

            if (lightningFlash) {
                lightningOpacity -= 0.05;
                if (lightningOpacity <= 0) {
                    lightningFlash = false;
                    lightningOpacity = 0;
                }
                lightningOverlay.style.opacity = lightningOpacity;
            }

            animationFrames[0] = requestAnimationFrame(drawStorm);
        }
        document.body.style.backgroundColor = '#2c3e50'; // Dark blue-grey for stormy sky
        drawStorm();
    }

    function startSariaEffect() {
        stopCurrentEffect();
        currentEffect = 'saria';

        sariaCanvas = document.createElement('canvas');
        Object.assign(sariaCanvas.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            zIndex: '9990',
            pointerEvents: 'none',
            opacity: '0.8'
        });
        sariaCanvas.width = window.innerWidth;
        sariaCanvas.height = window.innerHeight;
        document.body.appendChild(sariaCanvas);
        sariaCtx = sariaCanvas.getContext('2d');

        const leaves = [];
        for (let i = 0; i < 50; i++) {
            leaves.push({
                x: Math.random() * sariaCanvas.width,
                y: Math.random() * sariaCanvas.height,
                size: Math.random() * 5 + 3,
                speed: Math.random() * 1 + 0.5,
                rotation: Math.random() * Math.PI * 2,
                rotationSpeed: Math.random() * 0.1 - 0.05 // Spin left or right
            });
        }

        // Add glow to player avatars (simple CSS effect)
        const playerAvatars = document.querySelectorAll('.playerlist-avatar');
        playerAvatars.forEach(avatar => {
            const glowDiv = document.createElement('div');
            Object.assign(glowDiv.style, {
                position: 'absolute',
                width: '100%',
                height: '100%',
                borderRadius: '50%',
                boxShadow: '0 0 10px 5px #00FF00, 0 0 20px 10px #00FF00 inset', // Green glow
                pointerEvents: 'none',
                zIndex: '1',
                animation: 'sariaGlowPulse 1.5s infinite alternate'
            });
            glowDiv.classList.add('player-avatar-glow');
            avatar.style.position = 'relative'; // Ensure avatar is positioned for absolute glow
            avatar.appendChild(glowDiv);
        });

        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerText += `
            @keyframes sariaGlowPulse {
                0% { transform: scale(1); opacity: 0.7; }
                100% { transform: scale(1.1); opacity: 1; }
            }
        `;
        document.head.appendChild(styleSheet);


        function drawSaria() {
            sariaCtx.clearRect(0, 0, sariaCanvas.width, sariaCanvas.height);
            leaves.forEach(leaf => {
                sariaCtx.save();
                sariaCtx.translate(leaf.x, leaf.y);
                sariaCtx.rotate(leaf.rotation);
                sariaCtx.fillStyle = 'rgba(50, 205, 50, 0.7)'; // LimeGreen

                // Draw a simple leaf shape
                sariaCtx.beginPath();
                sariaCtx.arc(0, 0, leaf.size, 0, Math.PI * 2);
                sariaCtx.fill();

                sariaCtx.restore();

                leaf.y -= leaf.speed;
                leaf.x += Math.sin(leaf.y / 50) * 0.5; // Swaying motion
                leaf.rotation += leaf.rotationSpeed;

                if (leaf.y < -leaf.size) {
                    leaf.y = sariaCanvas.height + leaf.size;
                    leaf.x = Math.random() * sariaCanvas.width;
                }
            });
            animationFrames[0] = requestAnimationFrame(drawSaria);
        }
        drawSaria();
    }

    function startTeleportEffect() {
        stopCurrentEffect();
        currentEffect = 'teleport';

        const overlay = document.createElement('div');
        overlay.id = 'global-effect-overlay';
        Object.assign(overlay.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: 'black',
            opacity: '0',
            zIndex: '9991',
            pointerEvents: 'none',
            transition: 'opacity 0.3s ease-in'
        });
        document.body.appendChild(overlay);

        // Simple fade to black, then back to normal
        overlay.style.opacity = '1';
        setTimeout(() => {
            overlay.style.opacity = '0';
        }, 500); // Hold black for 0.5 seconds
        setTimeout(() => {
            stopCurrentEffect(); // Remove overlay after effect
        }, 800); // Total effect duration
    }

    function triggerGlobalEffect(effectType) {
        switch (effectType) {
            case 'storm':
                startStormEffect();
                break;
            case 'saria':
                startSariaEffect();
                break;
            case 'teleport':
                startTeleportEffect();
                break;
            default:
                stopCurrentEffect();
        }
    }


    // --- Melody Detection Logic ---
    function checkMelody() {
        const currentNoteTypes = recordedNotes.map(n => n.note);

        for (const melodyKey in MELODIES) {
            const melody = MELODIES[melodyKey];
            const seq = melody.sequence;

            if (currentNoteTypes.length >= seq.length) {
                const potentialMatch = currentNoteTypes.slice(currentNoteTypes.length - seq.length);
                let match = true;
                for (let i = 0; i < seq.length; i++) {
                    if (potentialMatch[i] !== seq[i]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    showNotification(`🎶 ${melody.name}: ${melody.effect.message}`, 5000);
                    triggerGlobalEffect(melody.effect.visual);
                    playMelodySequence(seq, OC_KEY_MAP); // Play the melody audibly
                    recordedNotes = []; // Reset after a successful melody match
                    return true;
                }
            }
        }
        return false;
    }

    function handleNotePress(key) {
        const noteInfo = OC_KEY_MAP[key];
        if (!noteInfo) return;

        // Play the single note tone
        playOcarinaTone(noteInfo.frequency);
        flashHole(noteInfo.note);
        createParticle(noteInfo.color, ocarinaElement);

        const currentTime = Date.now();

        // If a long gap, reset sequence
        if (currentTime - lastNoteTime > MELODY_MAX_GAP_MS) {
            recordedNotes = [];
        }

        recordedNotes.push({ note: noteInfo.note, time: currentTime });
        lastNoteTime = currentTime;

        // Trim recorded notes to prevent excessive length (max melody length * 2 for buffer)
        const longestMelodyLength = Math.max(...Object.values(MELODIES).map(m => m.sequence.length));
        if (recordedNotes.length > longestMelodyLength * 2) {
            recordedNotes.shift();
        }

        checkMelody();
    }

    // --- Event Listener Setup ---
    function setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            // Do not interfere if the user is typing in a text input or textarea
            const activeElement = document.activeElement;
            if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
                return;
            }

            const pressedKey = event.key.toLowerCase();
            if (OC_KEY_MAP[pressedKey]) {
                event.preventDefault(); // Prevent default browser actions (e.g., scrolling)
                event.stopPropagation(); // Stop propagation to prevent game from handling
                handleNotePress(pressedKey);
            } else if (event.key === 'Escape' && currentEffect) {
                 // Allow user to escape effects
                showNotification("Global effect stopped.", 2000);
                stopCurrentEffect();
            }
        });
    }

    // --- Script Initialization ---
    function initialize() {
        createOcarinaElement();
        showNotification("Drawaria Ocarina: Loaded! Play with A, W, S, Q, E. Press ESC to stop effects.", 10000);
        setupEventListeners();
        // Pre-create AudioContext on user interaction to avoid suspension issues
        document.body.addEventListener('click', getAudioContext, { once: true });
        document.body.addEventListener('keydown', getAudioContext, { once: true });
    }

    // Run initialization when the document is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

})();