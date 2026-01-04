// ==UserScript==
// @name         Drawaria.online GTA San Andreas
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Transforms Drawaria.online/test with GTA-inspired visuals and sounds, including an auto-visible map.
// @author       YouTube
// @match        https://drawaria.online/*
// @grant        none
// @license      MIT
// @icon         https://www.google.com/s2/favicons?sz=64&domain=drawaria.online
// @downloadURL https://update.greasyfork.org/scripts/540074/Drawariaonline%20GTA%20San%20Andreas.user.js
// @updateURL https://update.greasyfork.org/scripts/540074/Drawariaonline%20GTA%20San%20Andreas.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- IMPORTANT NOTE REGARDING REALISM AND DETAIL ---
    // The user requested GTA-like elements, including a recognizable map, music,
    // sound effects, particles, glows, and animated areas, while strictly forbidding
    // any external assets (like .mp3, .png, or base64 data) and demanding
    // all content be generated purely by the script itself.
    //
    // This constraint means that true realism and high detail, characteristic
    // of Grand Theft Auto, are not achievable. The enhancements below are
    // symbolic and created using only native browser capabilities (CSS, SVG,
    // Canvas drawing, Web Audio API primitives). This will result in a
    // "GTA-inspired" feel rather than a realistic replica.
    // ---

    const injectCSS = (css) => {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    };

    // --- 1. GTA-inspired CSS Overlays & Animations ---
    injectCSS(`
        body {
            background: linear-gradient(to bottom, #1a1a1a, #0a0a0a) !important;
            filter: grayscale(10%) brightness(1.2); /* Slight filter for mood */
            overflow: hidden; /* Hide scrollbars if content overflows */
        }

        #main {
            background-color: rgba(0, 0, 0, 0.7) !important; /* Darker main background */
            border: 2px solid #ffcc00; /* Gold/yellow border */
            box-shadow: 0 0 20px rgba(255, 204, 0, 0.5); /* Glow effect */
            border-radius: 8px;
            overflow: hidden;
            position: relative;
            z-index: 100; /* Ensure it's above new elements */
        }

        #leftbar, #rightbar {
            background-color: rgba(20, 20, 20, 0.8) !important;
            border: 1px solid #666;
            border-radius: 5px;
        }

        /* Text color adjustments for readability */
        #main, #leftbar, #rightbar, #chatbox_messages, .bubble, .playerlist-name, .systemchatmessage {
            color: #fff !important;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
        }

        /* Buttons and interactive elements */
        .btn {
            border-radius: 3px !important;
            border: 1px solid #ffcc00 !important;
            background-color: rgba(255, 204, 0, 0.2) !important;
            color: #ffcc00 !important;
            text-shadow: 0 0 5px rgba(255,255,0,0.5);
            transition: all 0.2s ease-in-out;
        }
        .btn:hover {
            background-color: rgba(255, 204, 0, 0.4) !important;
            box-shadow: 0 0 10px rgba(255,255,0,0.7);
        }

        /* Pulsating effect for selected/active elements */
        .playerlist-drawerhighlight, .roomlist-highlight {
            animation: gta-pulse 1.5s infinite alternate;
        }
        @keyframes gta-pulse {
            from { background-color: rgba(255, 204, 0, 0.2); }
            to { background-color: rgba(255, 204, 0, 0.5); }
        }

        /* Simple "glitch" effect for certain text elements */
        .playerlist-name a, .roomlist-descr {
            position: relative;
            display: inline-block;
            overflow: hidden;
        }
        .playerlist-name a::before, .roomlist-descr::before {
            content: attr(data-text); /* Use a data attribute for text */
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            color: #00ff00; /* Green glitch color */
            animation: gta-glitch 0.8s infinite linear alternate;
            text-shadow: none;
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }
        @keyframes gta-glitch {
            0%, 10% { transform: translate(0, 0); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
            20% { transform: translate(-2px, 2px); clip-path: polygon(0 0, 100% 0, 80% 100%, 20% 100%); }
            40% { transform: translate(3px, -3px); clip-path: polygon(20% 0, 100% 0, 100% 100%, 0 100%); }
            60% { transform: translate(-1px, 1px); clip-path: polygon(0 0, 80% 0, 100% 100%, 0 100%); }
            80% { transform: translate(2px, -1px); clip-path: polygon(0 0, 100% 0, 100% 80%, 0 20%); }
            100% { transform: translate(0, 0); clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%); }
        }

        /* Small icons for GTA-style elements (Requires Font Awesome to be loaded by Drawaria) */
        .gta-icon {
            font-family: 'Font Awesome 5 Free';
            font-weight: 900;
            margin-right: 5px;
            color: #ffcc00;
        }
        .gta-icon-car::before { content: '\\f1b9'; } /* Car icon */
        .gta-icon-dollar::before { content: '\\f155'; } /* Dollar icon */
        .gta-icon-gun::before { content: '\\f2a0'; } /* Crosshairs/Target icon */
        .gta-icon-star::before { content: '\\f005'; } /* Star icon */

        /* Override specific Drawaria styles for better integration */
        .playerlist-name a {
            text-decoration: none !important; /* Remove original underline */
        }
    `);

    // Add data-text attribute for glitch effect
    document.querySelectorAll('.playerlist-name a, .roomlist-descr').forEach(el => {
        el.setAttribute('data-text', el.textContent);
    });


    // --- 2. GTA-inspired Map Overlay (Simple Canvas Drawing) ---
    const createGTAMap = () => {
        const canvas = document.createElement('canvas');
        canvas.id = 'gta-map-overlay';
        canvas.width = 200; // Internal canvas resolution
        canvas.height = 200; // Internal canvas resolution
        canvas.style.position = 'fixed';
        canvas.style.top = '10px';
        canvas.style.right = '10px';
        canvas.style.width = '200px'; // Display size
        canvas.style.height = '200px'; // Display size
        canvas.style.border = '2px solid #ffcc00';
        canvas.style.borderRadius = '5px';
        canvas.style.backgroundColor = 'rgba(0,0,0,0.8)';
        canvas.style.zIndex = '9999';
        document.body.appendChild(canvas);

        const ctx = canvas.getContext('2d');
        const size = canvas.width; // Use internal canvas width/height for drawing

        const drawMap = () => {
            ctx.clearRect(0, 0, size, size);

            // Background "street" pattern (simple lines)
            ctx.strokeStyle = '#333';
            ctx.lineWidth = 2;
            for (let i = 0; i < size; i += 20) {
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i, size);
                ctx.stroke();
                ctx.beginPath();
                ctx.moveTo(0, i);
                ctx.lineTo(size, i);
                ctx.stroke();
            }

            // "Buildings" (colored rectangles)
            ctx.fillStyle = '#4a4a4a'; // Dark grey building
            ctx.fillRect(10, 10, 80, 50);
            ctx.fillRect(120, 30, 60, 70);
            ctx.fillStyle = '#6a6a6a'; // Lighter grey building
            ctx.fillRect(30, 100, 70, 60);
            ctx.fillRect(150, 120, 40, 40);

            // "Player" indicator (pulsating red dot)
            const playerX = size / 2;
            const playerY = size / 2;
            const radius = 5 + Math.sin(Date.now() * 0.005) * 2; // Pulsating effect
            ctx.beginPath();
            ctx.arc(playerX, playerY, radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(255, 0, 0, ${0.8 + Math.sin(Date.now() * 0.003) * 0.2})`; // Red, pulsating opacity
            ctx.shadowColor = 'rgba(255,0,0,0.8)';
            ctx.shadowBlur = 10;
            ctx.fill();
            ctx.shadowBlur = 0; // Reset shadow

            // "Target" or "Mission Zone" (pulsating green square)
            const targetX = 160;
            const targetY = 160;
            const targetSize = 15 + Math.cos(Date.now() * 0.004) * 3;
            ctx.fillStyle = `rgba(0, 255, 0, ${0.7 + Math.cos(Date.now() * 0.003) * 0.2})`; // Green, pulsating opacity
            ctx.shadowColor = 'rgba(0,255,0,0.8)';
            ctx.shadowBlur = 8;
            ctx.fillRect(targetX - targetSize / 2, targetY - targetSize / 2, targetSize, targetSize);
            ctx.shadowBlur = 0;

            requestAnimationFrame(drawMap);
        };
        drawMap();
    };

    // --- 3. GTA-inspired Sound Effects & Music (Web Audio API) ---
    let audioContext;
    let musicOscillator = null;
    let musicGain = null;
    let currentTimeoutId = null; // Variable to hold the timeout for music scheduling

    const initAudioContext = () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
    };

    // Basic synthesized music (simple melody loop)
    const playGTAMusic = () => {
        if (!audioContext) initAudioContext();
        if (musicOscillator) {
            // If context was suspended, try to resume
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.log('AudioContext resumed!');
                    // Reschedule notes from current time
                    clearTimeout(currentTimeoutId);
                    scheduleSequence(); // Restart sequence from current time
                });
            }
            return; // Already playing
        }

        musicOscillator = audioContext.createOscillator();
        musicGain = audioContext.createGain();

        musicOscillator.type = 'square'; // Chiptune feel
        musicOscillator.connect(musicGain);
        musicGain.connect(audioContext.destination);
        musicGain.gain.setValueAtTime(0.05, audioContext.currentTime); // Low volume

        // Simple arpeggiated melody loop
        const notes = [
            { freq: 220, duration: 0.2 }, // A3
            { freq: 261.6, duration: 0.2 }, // C4
            { freq: 329.6, duration: 0.2 }, // E4
            { freq: 261.6, duration: 0.2 }, // C4
            { freq: 220, duration: 0.2 }, // A3
            { freq: 196, duration: 0.2 }, // G3
            { freq: 220, duration: 0.4 }  // A3
        ];

        let startTime = audioContext.currentTime;
        let currentIndex = 0;

        const scheduleSequence = () => {
            const note = notes[currentIndex];
            musicOscillator.frequency.setValueAtTime(note.freq, startTime);
            // Use linearRampToValueAtTime for smooth volume changes (attack/decay)
            musicGain.gain.linearRampToValueAtTime(0.05, startTime + 0.01); // slight attack
            musicGain.gain.linearRampToValueAtTime(0, startTime + note.duration - 0.05); // short decay

            startTime += note.duration;
            currentIndex = (currentIndex + 1) % notes.length;

            // Schedule the next note. Use setTimeout for a delay that matches the note duration.
            // Add a small buffer for the gap between notes if needed, here it's part of duration.
            currentTimeoutId = setTimeout(scheduleSequence, (startTime - audioContext.currentTime) * 1000);
        };

        musicOscillator.start();
        scheduleSequence(); // Start the sequence

        // Handle audio context suspension/resumption on user interaction
        const resumeAudio = () => {
            if (audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.log('AudioContext resumed!');
                    // Reschedule notes from current time
                    clearTimeout(currentTimeoutId); // Clear any pending old timeouts
                    startTime = audioContext.currentTime; // Reset start time to current
                    scheduleSequence(); // Restart sequence
                });
            }
            // Remove listeners once audio is active or confirmed to be active
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
        };
        // Add listeners to resume audio on first user interaction
        document.addEventListener('click', resumeAudio);
        document.addEventListener('keydown', resumeAudio);
    };

    const stopGTAMusic = () => {
        if (musicOscillator) {
            clearTimeout(currentTimeoutId); // Clear any pending scheduled notes
            musicOscillator.stop();
            musicOscillator.disconnect();
            musicGain.disconnect();
            musicOscillator = null;
            musicGain = null;
            // Remove the audio context listeners as well
            document.removeEventListener('click', resumeAudio);
            document.removeEventListener('keydown', resumeAudio);
        }
    };

    // Basic synthesized sound effect (e.g., "gunshot" for drawing action)
    const playSoundEffect = (type) => {
        if (!audioContext) initAudioContext();
        // Ensure context is running before playing
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }

        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        switch (type) {
            case 'draw': // Simple laser-like sound
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.2);
                break;
            case 'guess': // Simple "ding" for correct guess
                oscillator.type = 'triangle';
                oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(800, audioContext.currentTime + 0.05);
                gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.15);
                break;
            case 'error': // Simple "buzz" for error
                oscillator.type = 'sawtooth';
                oscillator.frequency.setValueAtTime(120, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
            case 'car_horn': // Short honk
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.linearRampToValueAtTime(250, audioContext.currentTime + 0.05);
                oscillator.frequency.linearRampToValueAtTime(200, audioContext.currentTime + 0.1);
                gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.3);
                break;
        }
    };

    // --- 4. Integrate with Drawaria's existing events (where possible) ---
    const observeGameEvents = () => {
        const chatMessagesContainer = document.getElementById('chatbox_messages');
        if (chatMessagesContainer) {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach(node => {
                            if (node.classList && node.classList.contains('chatmessage')) {
                                // Check if it's a "correct guess" message
                                if (node.textContent.includes('guessed the word!') || node.textContent.includes('угадал слово!') || node.textContent.includes('adivinó la palabra!')) {
                                    playSoundEffect('guess');
                                } else {
                                    // Other chat messages
                                    // playSoundEffect('chat'); // Could add a subtle chat sound
                                }
                            }
                        });
                    }
                });
            });
            observer.observe(chatMessagesContainer, { childList: true });
        }

        // Hook into drawing actions (conceptual, needs to intercept Drawaria's internal drawing events for precision)
        // As direct drawing events are not easily exposed, this is a simplified approximation.
        const canvasElement = document.getElementById('canvas');
        if (canvasElement) {
             canvasElement.addEventListener('mouseup', () => {
                 // Play a drawing sound effect after a mouse up (end of a stroke)
                 playSoundEffect('draw');
             });
        }
    };


    // --- Initialization on page load ---
    window.addEventListener('load', () => {
        // Delay to ensure Drawaria's scripts have loaded and elements are available
        // If the map doesn't appear, increase this delay.
        setTimeout(() => {
            createGTAMap(); // Create the map overlay
            playGTAMusic(); // Start the background music
            observeGameEvents(); // Set up event listeners for game actions

            // Add a "car horn" sound to the "Quick Play" button for interactive testing
            const quickPlayButton = document.getElementById('quickplay');
            if (quickPlayButton) {
                quickPlayButton.addEventListener('click', (e) => {
                    // Note: e.preventDefault() here would stop the original button action.
                    // If you want both, you'd need to manually trigger the original logic
                    // or attach to a later phase of the event. For this demo, just sound.
                    playSoundEffect('car_horn');
                });
            }

            // Apply GTA-style icons to loginbox stats for Score, Wins, Stars
            const loginStatsTable = document.querySelector('#login-midcol table');
            if (loginStatsTable) {
                const rows = loginStatsTable.querySelectorAll('tbody tr');
                rows.forEach(row => {
                    const labelCell = row.querySelector('td:first-child');
                    if (labelCell) {
                        let iconClass = '';
                        const text = labelCell.textContent.toLowerCase();
                        if (text.includes('score') || text.includes('очков') || text.includes('puntos')) {
                            iconClass = 'gta-icon-dollar';
                        } else if (text.includes('wins') || text.includes('матчей') || text.includes('victorias')) {
                            iconClass = 'gta-icon-star';
                        } else if (text.includes('stars') || text.includes('звезд') || text.includes('estrellas')) {
                            iconClass = 'gta-icon-star'; // Re-use star for stars
                        }
                        if (iconClass) {
                            // Insert the icon before the text
                            labelCell.innerHTML = `<i class="gta-icon ${iconClass}"></i>${labelCell.textContent}`;
                        }
                    }
                });
            }


            console.log('Drawaria.online GTA Enhancement script loaded.');
        }, 3000); // Adjust delay as needed to ensure Drawaria's elements are ready
    });

    // Optional: Stop music when navigating away from the page
    window.addEventListener('beforeunload', () => {
        stopGTAMusic();
    });

})();