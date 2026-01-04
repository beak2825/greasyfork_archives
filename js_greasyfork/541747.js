// ==UserScript==
// @name         Drawaria C00LKIDD Mod
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Your personal c00lkidd agent on Drawaria.online! Walks, jumps, talks, and reacts dynamically to you.
// @match        https://drawaria.online/*
// @license      MIT
// @icon         https://shapes.inc/api/public/avatar/c00lkidd-twp2
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/541747/Drawaria%20C00LKIDD%20Mod.user.js
// @updateURL https://update.greasyfork.org/scripts/541747/Drawaria%20C00LKIDD%20Mod.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Global Configuration (Minimal, as requested) ---
    const ENABLE_C00LKIDD_AGENT = true; // Set to false to disable the entire script
    const ENABLE_C00LKIDD_SOUNDS = true; // Master toggle for all sounds
    const C00LKIDD_AGENT_MASTER_VOLUME = 0.6; // Adjust agent's sound volume (0.0 to 1.0)
    const C00LKIDD_AGENT_RANDOM_MOVEMENT = true; // Allow c00lkidd to move to random spots
    const C00LKIDD_AGENT_DIALOGUE = true; // Enable speech/thought bubbles
    const C00LKIDD_AGENT_CLICK_INTERACTION = true; // Allow clicking the agent for reactions
    const C00LKIDD_AGENT_DRAW_TRAIL = false; // Enable particle trail when you draw (can be performance heavy)

    // --- C00LKIDD Appearance (Pure CSS Colors) ---
    const C00LKIDD_PRIMARY_COLOR = '#ff0000'; // Signature red
    const C00LKIDD_HIGHLIGHT_COLOR = '#ffff00'; // Yellow highlight/glow
    const C00LKIDD_ACCENT_COLOR = '#000000'; // Black for eyes/mouth

    // --- Internal Variables ---
    let audioContext;
    let mainGainNode;
    let currentPlayerUID = null;
    let c00lkiddAgentElement = null; // The main on-screen c00lkidd character
    let c00lkiddCurrentMood = 'normal';
    let c00lkiddMoodTimeout = null;
    let lastPlayerStatus = {};

    const C00LKIDD_PHRASES = [
        "What's up, pal?",
        "Ready to draw!",
        "Let's play!",
        "I'm here for you!",
        "Cool!",
        "Awesome!",
        "You got this!",
        "Team c00lkidd!",
        "Thinking..."
    ];

    // --- Web Audio API for Sound Generation (all programmatic, no files) ---
    function initAudioContext() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            mainGainNode = audioContext.createGain();
            mainGainNode.connect(audioContext.destination);
            mainGainNode.gain.value = C00LKIDD_AGENT_MASTER_VOLUME;
        }
    }

    function playTone(frequency, duration, type = 'sine', volume = 0.5, delay = 0) {
        if (!ENABLE_C00LKIDD_SOUNDS) return;
        if (!audioContext) initAudioContext();

        setTimeout(() => {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = type;
            oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
            gainNode.gain.setValueAtTime(volume, audioContext.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(mainGainNode);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + duration);

            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioContext.currentTime + duration);

            oscillator.onended = () => {
                oscillator.disconnect();
                gainNode.disconnect();
            };
        }, delay * 1000);
    }

    function playC00lkiddChirp() {
        playTone(880, 0.05, 'triangle', 0.7);
        playTone(987, 0.05, 'triangle', 0.7, 0.05);
    }

    function playSuccessChime() {
        playTone(783.99, 0.1, 'triangle', 0.7); // G5
        playTone(987.77, 0.1, 'triangle', 0.7, 0.05); // B5
        playTone(1174.66, 0.1, 'triangle', 0.7, 0.1); // D6
    }

    function playFailBuzz() {
        playTone(220, 0.2, 'sawtooth', 0.5); // A3
        playTone(185, 0.2, 'sawtooth', 0.5, 0.1); // F#3
    }

    function playJumpBoing() {
        playTone(400, 0.1, 'sine', 0.8);
        playTone(600, 0.1, 'sine', 0.8, 0.05);
    }

    function playSwingWhoosh() {
        playTone(1000, 0.05, 'triangle', 0.6);
        playTone(800, 0.05, 'triangle', 0.6, 0.05);
    }

    // --- Dynamic Mood System (CSS-driven) ---
    function setC00lkiddMood(mood) {
        if (!ENABLE_C00LKIDD_AGENT || !c00lkiddAgentElement) return;

        c00lkiddCurrentMood = mood;
        const head = c00lkiddAgentElement.querySelector('.c00lkidd-avatar-head');
        if (head) {
            head.classList.remove('mood-normal', 'mood-happy', 'mood-thoughtful', 'mood-sad');
            head.classList.add(`mood-${mood}`);
        }

        // Auto-revert to normal mood after a duration
        if (c00lkiddMoodTimeout) clearTimeout(c00lkiddMoodTimeout);
        if (mood !== 'normal') {
            c00lkiddMoodTimeout = setTimeout(() => setC00lkiddMood('normal'), 3000); // Revert after 3 seconds
        }
    }

    // --- Dialogue/Thought Bubble System (Pure CSS/HTML) ---
    function showC00lkiddDialogue(text, isThought = false) {
        if (!ENABLE_C00LKIDD_AGENT || !C00LKIDD_AGENT_DIALOGUE || !c00lkiddAgentElement) return;

        let bubble = c00lkiddAgentElement.querySelector('.c00lkidd-dialogue-bubble');
        if (!bubble) {
            bubble = document.createElement('div');
            bubble.className = 'c00lkidd-dialogue-bubble';
            c00lkiddAgentElement.appendChild(bubble);
        }

        bubble.innerText = text;
        bubble.classList.toggle('thought', isThought);
        bubble.style.display = 'block';

        if (bubble.timeout) clearTimeout(bubble.timeout);
        bubble.timeout = setTimeout(() => {
            bubble.style.display = 'none';
        }, 3000); // Hide after 3 seconds
    }

    // --- Pure CSS Graphics for c00lkidd Avatar and Agent ---
    GM_addStyle(`
        /* Dynamic Colors from Configuration */
        :root {
            --c00lkidd-color: ${C00LKIDD_PRIMARY_COLOR};
            --c00lkidd-highlight: ${C00LKIDD_HIGHLIGHT_COLOR};
            --c00lkidd-accent: ${C00LKIDD_ACCENT_COLOR};
        }

        /* Keyframes for c00lkidd specific animations */
        @keyframes c00lkiddGrowShrink {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); filter: drop-shadow(0 0 15px var(--c00lkidd-highlight)); }
            100% { transform: scale(1); }
        }

        @keyframes c00lkiddSwordSwing {
            0% { transform: rotateY(0deg) rotateZ(0deg) translateX(0); opacity: 1; }
            25% { transform: rotateY(30deg) rotateZ(15deg) translateX(10px); }
            50% { transform: rotateY(0deg) rotateZ(30deg) translateX(0); }
            75% { transform: rotateY(-30deg) rotateZ(15deg) translateX(-10px); }
            100% { transform: rotateY(0deg) rotateZ(0deg) translateX(0); opacity: 0; }
        }
        @keyframes c00lkiddIdleWobble {
            0%, 100% { transform: translateY(0) rotate(0); }
            25% { transform: translateY(-1px) rotate(0.5deg); }
            75% { transform: translateY(1px) rotate(-0.5deg); }
        }
        @keyframes c00lkiddJump {
            0% { transform: translateY(0); }
            50% { transform: translateY(-50px) scaleY(1.1); } /* Jump height */
            100% { transform: translateY(0); }
        }
        @keyframes c00lkiddWalk {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(5px); } /* Subtle horizontal bob */
        }

        /* Base c00lkidd avatar and agent style */
        .c00lkidd-avatar-wrapper {
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 1; /* Ensure it's above original elements */
        }
        .c00lkidd-avatar, .c00lkidd-agent {
            position: relative;
            width: 100%; height: 100%;
            overflow: hidden;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            background: transparent !important;
            transform-origin: bottom center;
        }
        /* Specific sizing for the main agent */
        .c00lkidd-agent {
            position: fixed; /* Fixed position for the companion */
            width: 80px; /* Base size for the agent */
            height: 100px;
            bottom: 20px; left: 20px; /* Default position */
            cursor: pointer;
            z-index: 5000; /* High z-index to be on top */
            transition: all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); /* Smooth movement transition */
            animation: c00lkiddIdleWobble 4s ease-in-out infinite; /* Subtle idle animation */
        }
        .c00lkidd-agent.jumping {
            animation: c00lkiddJump 0.6s ease-out;
        }
        .c00lkidd-agent.walking {
            animation: c00lkiddWalk 1.5s ease-in-out infinite;
        }


        .c00lkidd-avatar-body {
            width: 70%; height: 80%;
            background-color: var(--c00lkidd-color);
            position: relative;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
        }

        .c00lkidd-avatar-head {
            width: 60%; height: 50%;
            background-color: var(--c00lkidd-color);
            position: absolute;
            top: -20%; left: 20%;
            border-radius: 5%;
            box-shadow: inset 0 0 5px rgba(0,0,0,0.5);
            display: flex; flex-direction: column;
            justify-content: center; align-items: center;
            z-index: 10;
        }

        /* Eyes */
        .c00lkidd-avatar-head::before,
        .c00lkidd-avatar-head::after {
            content: ''; position: absolute;
            width: 15%; height: 15%;
            background-color: var(--c00lkidd-accent);
            top: 30%; border-radius: 50%;
            transition: all 0.3s ease;
        }
        .c00lkidd-avatar-head::before { left: 25%; }
        .c00lkidd-avatar-head::after { right: 25%; }

        /* Mouth (smiley) */
        .c00lkidd-avatar-head .mouth {
            position: absolute;
            width: 40%; height: 20%;
            border-radius: 0 0 50% 50% / 0 0 100% 100%;
            border: 2px solid var(--c00lkidd-accent);
            border-top: none;
            bottom: 15%;
            transition: all 0.3s ease;
        }

        /* Mood-specific facial expressions */
        .c00lkidd-avatar-head.mood-happy .mouth {
            height: 25%; border-radius: 0 0 70% 70% / 0 0 150% 150%;
            transform: scaleX(1.1);
        }
        .c00lkidd-avatar-head.mood-thoughtful .mouth {
            border-radius: 0; border-bottom: none; height: 5px; width: 30%;
        }
        .c00lkidd-avatar-head.mood-sad .mouth {
            border-radius: 50% 50% 0 0 / 100% 100% 0 0; border-bottom: 2px solid var(--c00lkidd-accent); border-top: none; bottom: 20%;
        }
        /* Eyes for thoughtful/sad */
        .c00lkidd-avatar-head.mood-thoughtful::before,
        .c00lkidd-avatar-head.mood-thoughtful::after {
            top: 35%; height: 5%;
        }
        .c00lkidd-avatar-head.mood-sad::before,
        .c00lkidd-avatar-head.mood-sad::after {
            top: 25%; transform: rotate(-15deg);
        }

        /* Arms */
        .c00lkidd-avatar-arm.left, .c00lkidd-avatar-arm.right {
            position: absolute; width: 30%; height: 60%;
            background-color: var(--c00lkidd-color); top: 10%;
            box-shadow: inset 0 0 3px rgba(0,0,0,0.4); z-index: 5;
        }
        .c00lkidd-avatar-arm.left { left: -35%; }
        .c00lkidd-avatar-arm.right { right: -35%; }

        /* Legs */
        .c00lkidd-avatar-leg.left, .c00lkidd-avatar-leg.right {
            position: absolute; width: 30%; height: 40%;
            background-color: var(--c00lkidd-color); bottom: -40%;
            box-shadow: inset 0 0 3px rgba(0,0,0,0.4); z-index: 5;
        }
        .c00lkidd-avatar-leg.left { left: 15%; }
        .c00lkidd-avatar-leg.right { right: 15%; }

        /* Sword for gestures */
        .c00lkidd-sword {
            position: absolute;
            bottom: -50%; left: 50%;
            width: 5px; height: 60px;
            background-color: #555;
            transform-origin: bottom center;
            animation: none;
            z-index: 100;
            box-shadow: 0 0 5px rgba(255,255,255,0.7);
            display: none;
        }
        .c00lkidd-sword::before {
            content: ''; position: absolute;
            bottom: -5px; left: -5px; width: 15px; height: 5px;
            background-color: #8B4513;
        }

        /* Spark effect for sword swing */
        .c00lkidd-sword-spark {
            position: absolute;
            width: 8px; height: 8px;
            background-color: var(--c00lkidd-highlight);
            border-radius: 50%;
            opacity: 0;
            animation: sparkFadeOut 0.5s ease-out forwards;
            z-index: 101;
            box-shadow: 0 0 10px var(--c00lkidd-highlight);
        }
        @keyframes sparkFadeOut {
            0% { transform: scale(0.5); opacity: 1; }
            100% { transform: scale(2); opacity: 0; }
        }

        /* Particle burst for agent interactions */
        .c00lkidd-burst-particle {
            position: absolute;
            background-color: var(--c00lkidd-highlight);
            border-radius: 50%;
            opacity: 0;
            animation: burstParticle 0.8s ease-out forwards;
            box-shadow: 0 0 5px var(--c00lkidd-highlight);
        }
        @keyframes burstParticle {
            0% { transform: scale(0) translate(0,0); opacity: 1; }
            50% { opacity: 0.8; }
            100% { transform: scale(1) translate(var(--x), var(--y)); opacity: 0; }
        }

        /* Hide ORIGINAL avatar images only for the current player's elements */
        #selfavatarimage,
        .playerlist-avatarimg[data-uid="${currentPlayerUID}"] img,
        .playerlist-avatar[data-uid="${currentPlayerUID}"] img,
        .spawnedavatar[data-uid="${currentPlayerUID}"] img {
            display: none !important;
            opacity: 0 !important;
        }

        /* Override backgrounds/borders for c00lkidd avatar containers */
        #selfavatarimage + .c00lkidd-avatar-wrapper,
        .playerlist-avatarimg[data-uid="${currentPlayerUID}"],
        .playerlist-avatar[data-uid="${currentPlayerUID}"],
        .spawnedavatar[data-uid="${currentPlayerUID}"] {
            background-color: transparent !important;
            border-radius: 0 !important;
            overflow: visible !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
        }

        /* Drawing Trail */
        .c00lkidd-trail-block {
            position: absolute;
            width: 8px; height: 8px;
            background-color: var(--c00lkidd-color);
            border: 1px solid var(--c00lkidd-highlight);
            opacity: 0.8;
            border-radius: 2px;
            pointer-events: none;
            animation: fadeOutTrail 0.5s forwards;
            z-index: 999;
        }
        @keyframes fadeOutTrail {
            0% { opacity: 0.8; transform: scale(1); }
            100% { opacity: 0; transform: scale(0.5); }
        }

        /* Dialogue Bubble */
        .c00lkidd-dialogue-bubble {
            position: absolute;
            bottom: 110%; /* Above the agent */
            left: 50%;
            transform: translateX(-50%);
            background: #fff;
            color: var(--c00lkidd-accent);
            border: 2px solid var(--c00lkidd-color);
            border-radius: 10px;
            padding: 5px 10px;
            font-family: 'Arial', sans-serif;
            font-size: 0.9em;
            white-space: nowrap;
            z-index: 102;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
            display: none;
        }
        .c00lkidd-dialogue-bubble::after { /* Tail */
            content: '';
            position: absolute;
            left: 50%;
            top: 100%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 10px solid transparent;
            border-right: 10px solid transparent;
            border-top: 10px solid var(--c00lkidd-color);
        }
        .c00lkidd-dialogue-bubble.thought {
            background: #e0e0e0;
            color: #555;
            border-style: dotted; /* Thought bubble style */
        }
        .c00lkidd-dialogue-bubble.thought::after {
            border-top: 10px solid #e0e0e0;
        }
    `);

    // --- Dynamic C00LKIDD Avatar Injection (for game's default avatar slots) ---
    function injectC00lkiddAvatar(targetElement) {
        if (!ENABLE_C00LKIDD_AGENT) return;

        // Ensure current player UID is set for specific targeting
        if (!currentPlayerUID && window.LOGUID && window.LOGUID.length > 0) {
            currentPlayerUID = window.LOGUID[0];
            document.documentElement.style.setProperty('--current-player-uid', currentPlayerUID);
        }

        if (!targetElement || targetElement.querySelector('.c00lkidd-avatar-wrapper')) {
            return;
        }

        const targetUID = targetElement.id === 'selfavatarimage' ? currentPlayerUID : targetElement.dataset.uid;
        if (!currentPlayerUID || targetUID !== currentPlayerUID) {
            return; // Not the current player's avatar slot, skip injection
        }

        const avatarWrapper = document.createElement('div');
        avatarWrapper.className = 'c00lkidd-avatar-wrapper';
        avatarWrapper.style.cssText = `
            position: absolute;
            top: 0; left: 0;
            width: 100%; height: 100%;
            display: flex; justify-content: center; align-items: center;
            pointer-events: none; /* Do not block clicks on elements behind */
        `;

        const c00lkiddHTML = `
            <div class="c00lkidd-avatar">
                <div class="c00lkidd-avatar-body">
                    <div class="c00lkidd-avatar-head"><div class="mouth"></div></div>
                    <div class="c00lkidd-avatar-arm left"></div>
                    <div class="c00lkidd-avatar-arm right"></div>
                    <div class="c00lkidd-avatar-leg left"></div>
                    <div class="c00lkidd-avatar-leg right"></div>
                </div>
                <div class="c00lkidd-sword"></div>
            </div>
        `;
        avatarWrapper.innerHTML = c00lkiddHTML;

        const originalImg = targetElement.querySelector('img') || targetElement;
        if (originalImg && originalImg.tagName === 'IMG') {
            originalImg.style.display = 'none';
        }

        if (targetElement.id === 'selfavatarimage') {
            targetElement.parentNode.appendChild(avatarWrapper);
        } else {
            targetElement.appendChild(avatarWrapper);
        }

        setC00lkiddMood(c00lkiddCurrentMood); // Set initial mood
        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const parentWidth = entry.contentRect.width;
                const parentHeight = entry.contentRect.height;
                const scale = Math.min(parentWidth / 100, parentHeight / 100);
                avatarWrapper.style.setProperty('--c00lkidd-scale', scale);
            }
        });
        resizeObserver.observe(targetElement);
    }

    // --- Main C00LKIDD Agent (The Companion) Logic ---
    function createC00lkiddAgent() {
        if (!ENABLE_C00LKIDD_AGENT) return;

        c00lkiddAgentElement = document.createElement('div');
        c00lkiddAgentElement.id = 'c00lkidd-agent';
        c00lkiddAgentElement.className = 'c00lkidd-agent';
        c00lkiddAgentElement.innerHTML = `
            <div class="c00lkidd-avatar-body">
                <div class="c00lkidd-avatar-head"><div class="mouth"></div></div>
                <div class="c00lkidd-avatar-arm left"></div>
                <div class="c00lkidd-avatar-arm right"></div>
                <div class="c00lkidd-avatar-leg left"></div>
                <div class="c00lkidd-avatar-leg right"></div>
            </div>
        `;
        document.body.appendChild(c00lkiddAgentElement);

        setC00lkiddMood(c00lkiddCurrentMood); // Set initial mood for the agent

        // Click interaction for the agent
        if (C00LKIDD_AGENT_CLICK_INTERACTION) {
            c00lkiddAgentElement.addEventListener('click', () => {
                if (c00lkiddAgentElement.classList.contains('jumping')) return; // Avoid spamming jump

                playJumpBoing();
                c00lkiddAgentElement.classList.add('jumping');
                c00lkiddAgentElement.addEventListener('animationend', () => {
                    c00lkiddAgentElement.classList.remove('jumping');
                }, { once: true });

                showC00lkiddDialogue(C00LKIDD_PHRASES[Math.floor(Math.random() * C00LKIDD_PHRASES.length)]);
                createParticleBurst(c00lkiddAgentElement, 15);
                setC00lkiddMood('happy');
            });
        }

        // Random Movement Logic
        if (C00LKIDD_AGENT_RANDOM_MOVEMENT) {
            const positions = [
                { bottom: '20px', left: '20px' }, // Bottom-left
                { bottom: '20px', right: '20px', left: 'auto' }, // Bottom-right
                { top: '150px', left: '20px', bottom: 'auto' }, // Top-left (adjust to avoid main UI)
                { top: '150px', right: '20px', bottom: 'auto', left: 'auto' }, // Top-right (adjust to avoid main UI)
                { bottom: '50%', left: '50%', transform: 'translate(-50%, 50%)' } // Center-ish
            ];
            let currentPosIndex = 0;

            function moveC00lkiddRandomly() {
                if (!ENABLE_C00LKIDD_AGENT) return;

                let newIndex;
                do {
                    newIndex = Math.floor(Math.random() * positions.length);
                } while (newIndex === currentPosIndex); // Ensure different position

                const targetPos = positions[newIndex];
                c00lkiddAgentElement.style.transition = 'all 2s cubic-bezier(0.68, -0.55, 0.265, 1.55)'; // Smoother slide
                c00lkiddAgentElement.style.bottom = targetPos.bottom || 'auto';
                c00lkiddAgentElement.style.left = targetPos.left || 'auto';
                c00lkiddAgentElement.style.right = targetPos.right || 'auto';
                c00lkiddAgentElement.style.top = targetPos.top || 'auto';
                c00lkiddAgentElement.style.transform = targetPos.transform || 'none';

                // Add a "walking" animation class during movement
                c00lkiddAgentElement.classList.add('walking');
                setTimeout(() => {
                    c00lkiddAgentElement.classList.remove('walking');
                }, 2000); // Remove walking class after transition

                currentPosIndex = newIndex;
            }
            setInterval(moveC00lkiddRandomly, 15000); // Move every 15 seconds
        }
    }

    // --- Particle Burst Effect ---
    function createParticleBurst(sourceElement, count) {
        if (!ENABLE_C00LKIDD_AGENT) return;

        const rect = sourceElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < count; i++) {
            const particle = document.createElement('div');
            particle.className = 'c00lkidd-burst-particle';
            document.body.appendChild(particle);

            const size = Math.random() * 5 + 3; // 3-8px
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${centerX}px`;
            particle.style.top = `${centerY}px`;

            const angle = Math.random() * 2 * Math.PI;
            const distance = Math.random() * 50 + 20; // 20-70px
            const translateX = distance * Math.cos(angle);
            const translateY = distance * Math.sin(angle);

            particle.style.setProperty('--x', `${translateX}px`);
            particle.style.setProperty('--y', `${translateY}px`);

            particle.addEventListener('animationend', () => particle.remove());
        }
    }


    // --- Game Event Monitoring for Moods and Sounds ---
    function monitorGameEvents() {
        // Observe chat messages for system events and player actions
        const chatMessagesObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1 && node.classList.contains('bubble')) {
                        const messageText = node.innerText.toLowerCase();
                        const isSystemMessage = node.classList.contains('systemchatmessage');

                        if (isSystemMessage) {
                            if (messageText.includes('guessed the word!') || messageText.includes('adivinó la palabra!')) {
                                if (messageText.includes(window.playername) || messageText.includes('you')) { // Check if it's YOUR guess
                                    if (ENABLE_C00LKIDD_AGENT) {
                                        playSuccessChime();
                                        setC00lkiddMood('happy');
                                        showC00lkiddDialogue("Great guess!", false);
                                        createParticleBurst(c00lkiddAgentElement, 10);
                                    }
                                } else { // Someone else guessed
                                    if (ENABLE_C00LKIDD_AGENT) {
                                        setC00lkiddMood('thoughtful');
                                        showC00lkiddDialogue("Good job!", true); // Thought bubble for others' success
                                    }
                                }
                            } else if (messageText.includes('is drawing') || messageText.includes('está dibujando')) {
                                if (messageText.includes(window.playername) || messageText.includes('you')) { // Check if it's YOUR turn
                                    if (ENABLE_C00LKIDD_AGENT) {
                                        playC00lkiddChirp();
                                        setC00lkiddMood('thoughtful');
                                        showC00lkiddDialogue("My turn! Time to create!", false);
                                    }
                                }
                            } else if (messageText.includes('turn aborted') || messageText.includes('ronda terminada')) {
                                if (ENABLE_C00LKIDD_AGENT) {
                                    playFailBuzz();
                                    setC00lkiddMood('sad');
                                    showC00lkiddDialogue("Oh no...", true);
                                }
                            }
                        }
                    }
                });
            });
        });

        const chatMessagesContainer = document.getElementById('chatbox_messages');
        if (chatMessagesContainer) {
            chatMessagesObserver.observe(chatMessagesContainer, { childList: true, subtree: true });
        } else {
             // If chat not present yet, observe body to find it
            const chatObserverFallback = new MutationObserver((mutations, obs) => {
                const foundChat = document.getElementById('chatbox_messages');
                if (foundChat) {
                    chatMessagesObserver.observe(foundChat, { childList: true, subtree: true });
                    obs.disconnect();
                }
            });
            chatObserverFallback.observe(document.body, { childList: true, subtree: true });
        }

        // Monitor player list for "my turn" indication (for mood and dialogue)
        const playerlistObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                    const myPlayerRow = document.querySelector(`.playerlist-row[data-uid="${currentPlayerUID}"]`);
                    if (myPlayerRow) {
                        const isMyTurnNow = myPlayerRow.classList.contains('active-drawer');
                        if (isMyTurnNow && !lastPlayerStatus.isMyTurn && ENABLE_C00LKIDD_AGENT) {
                            playC00lkiddChirp();
                            setC00lkiddMood('thoughtful');
                            showC00lkiddDialogue("Draw something cool!", false);
                        }
                        lastPlayerStatus.isMyTurn = isMyTurnNow;
                    }
                }
            });
        });
        const playerListContainer = document.getElementById('playerlist');
        if (playerListContainer) {
            playerlistObserver.observe(playerListContainer, { attributes: true, subtree: true });
        }
    }


    // --- Initialization and Observers ---
    function initialize() {
        if (!ENABLE_C00LKIDD_AGENT) {
            console.log("C00LKIDD Agent is disabled by configuration.");
            return;
        }

        initAudioContext();

        // Set global CSS variables for colors
        document.documentElement.style.setProperty('--c00lkidd-color', C00LKIDD_PRIMARY_COLOR);
        document.documentElement.style.setProperty('--c00lkidd-highlight', C00LKIDD_HIGHLIGHT_COLOR);
        document.documentElement.style.setProperty('--c00lkidd-accent', C00LKIDD_ACCENT_COLOR);

        // Try to get the current player's UID from the global LOGUID variable
        if (window.LOGUID && window.LOGUID.length > 0) {
            currentPlayerUID = window.LOGUID[0];
            document.documentElement.style.setProperty('--current-player-uid', currentPlayerUID);
        } else {
            const uidObserver = new MutationObserver((mutations, obs) => {
                if (window.LOGUID && window.LOGUID.length > 0) {
                    currentPlayerUID = window.LOGUID[0];
                    document.documentElement.style.setProperty('--current-player-uid', currentPlayerUID);
                    // Reload CSS to apply UID-specific rules once UID is known
                    GM_addStyle(`
                        #selfavatarimage,
                        .playerlist-avatarimg[data-uid="${currentPlayerUID}"] img,
                        .playerlist-avatar[data-uid="${currentPlayerUID}"] img,
                        .spawnedavatar[data-uid="${currentPlayerUID}"] img {
                            display: none !important;
                            opacity: 0 !important;
                        }
                    `);
                    obs.disconnect();
                }
            });
            uidObserver.observe(document.body, { childList: true, subtree: true });
        }

        // Observe body for dynamically added avatar elements for YOUR player only
        const avatarObserver = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.id === 'selfavatarimage' ||
                            (node.classList && (node.classList.contains('playerlist-avatarimg') || node.classList.contains('playerlist-avatar') || node.classList.contains('spawnedavatar')))
                        ) {
                            injectC00lkiddAvatar(node);
                        }
                    }
                });
            });
        });
        avatarObserver.observe(document.body, { childList: true, subtree: true });

        // Initial injection for already existing elements (e.g., on page load)
        const selfAvatarImg = document.getElementById('selfavatarimage');
        if (selfAvatarImg) {
            injectC00lkiddAvatar(selfAvatarImg);
        }
        document.querySelectorAll('.playerlist-avatarimg, .playerlist-avatar, .spawnedavatar').forEach(avatarDiv => {
            injectC00lkiddAvatar(avatarDiv);
        });

        // Create the main interactive c00lkidd agent
        createC00lkiddAgent();

        // Overwrite Drawaria's gesture handler to inject our animation for YOUR player
        const gestureHookInterval = setInterval(() => {
            if (window.spawnedavatar && typeof window.spawnedavatar.gesture === 'function') {
                const originalGestureHandler = window.spawnedavatar.gesture;
                window.spawnedavatar.gesture = function(player, gestureType) {
                    originalGestureHandler(player, gestureType);
                    // Only apply our custom sword animation to YOUR c00lkidd avatar
                    if (currentPlayerUID && player.uid === currentPlayerUID) {
                        const selfC00lkiddSword = document.querySelector(`.spawnedavatar[data-uid="${currentPlayerUID}"] .c00lkidd-sword`) ||
                                                  document.querySelector(`.playerlist-avatar[data-uid="${currentPlayerUID}"] .c00lkidd-sword`);
                        if (selfC00lkiddSword) {
                            selfC00lkiddSword.style.display = 'block';
                            selfC00lkiddSword.style.animation = 'c00lkiddSwordSwing 0.5s ease-out forwards';
                            playSwingWhoosh();
                            selfC00lkiddSword.addEventListener('animationend', () => {
                                selfC00lkiddSword.style.animation = '';
                                selfC00lkiddSword.style.display = 'none';
                            }, { once: true });
                        }
                    }
                };
                clearInterval(gestureHookInterval);
            }
        }, 100);

        // Drawing trail
        if (C00LKIDD_AGENT_DRAW_TRAIL) {
            const canvas = document.getElementById('canvas');
            if (canvas) {
                canvas.addEventListener('mousemove', (e) => {
                    if (e.buttons === 1 || e.buttons === 2) { // Only when mouse button is pressed (drawing)
                        handleDrawingTrail(e);
                    }
                });
            } else {
                const canvasObserver = new MutationObserver((mutations, obs) => {
                    const foundCanvas = document.getElementById('canvas');
                    if (foundCanvas) {
                        foundCanvas.addEventListener('mousemove', (e) => {
                            if (e.buttons === 1 || e.buttons === 2) {
                                handleDrawingTrail(e);
                            }
                        });
                        obs.disconnect();
                    }
                });
                canvasObserver.observe(document.body, { childList: true, subtree: true });
            }
        }

        // Initialize and monitor game events for moods and sounds
        monitorGameEvents();

        // Show welcome message once (session-based)
        if (!sessionStorage.getItem('c00lkidd_agent_welcomed')) {
            const welcomeMessage = document.createElement('div');
            welcomeMessage.className = 'c00lkidd-welcome-message';
            welcomeMessage.innerHTML = `
                <p>Hello, Player! <br>Your personal C00LKIDD Agent is here to help you dominate Drawaria!</p>
                <p style="font-size: 0.7em;">Click on me to interact!</p>
            `;
            document.body.appendChild(welcomeMessage);
            sessionStorage.setItem('c00lkidd_agent_welcomed', 'true');
        }
    }

    // Ensure DOM is fully loaded before initialization
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();