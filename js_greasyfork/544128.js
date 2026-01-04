// ==UserScript==
// @name         ULTRA SKIBIDI WEB TRANSFORMER 3000
// @license MIT
// @namespace    http://skibidi.rizz.glizzy
// @version      69.420
// @description  SKIBIDI YOUR FACE OFF, RIZZLER! THIS SCRIPT IS GOATED BEYOND BELIEF!
// @author       kylereee, Skibidi Operations Department
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/544128/ULTRA%20SKIBIDI%20WEB%20TRANSFORMER%203000.user.js
// @updateURL https://update.greasyfork.org/scripts/544128/ULTRA%20SKIBIDI%20WEB%20TRANSFORMER%203000.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add our GOATED cursor and styles
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
        * {
            cursor: none !important;
        }

        #skibidiCursor {
            width: 32px;
            height: 32px;
            position: fixed;
            pointer-events: none;
            z-index: 999999;
            font-size: 32px;
            transform: translate(-50%, -50%);
            user-select: none;
        }
    `;
    document.head.appendChild(styleElement);

    // Create our custom toilet cursor
    const cursor = document.createElement('div');
    cursor.id = 'skibidiCursor';
    cursor.innerHTML = '🚽';
    document.body.appendChild(cursor);

    // Make the cursor follow the mouse
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Skibidi sound effects array
    const skibidiSounds = [
        'https://www.myinstants.com/media/sounds/skibidi-toilet.mp3',
        'https://www.myinstants.com/media/sounds/skibidi-dop-dop-yes-yes-yes.mp3',
        'https://www.myinstants.com/media/sounds/vine-boom.mp3'
    ];

    // Create audio elements pool
    const audioPool = skibidiSounds.map(src => {
        const audio = new Audio(src);
        audio.volume = 0.5;
        return audio;
    });

    let lastPlayTime = 0;
    const COOLDOWN = 100; // Cooldown in milliseconds

    // Play random skibidi sound on click
    document.addEventListener('click', () => {
        const now = Date.now();
        if (now - lastPlayTime >= COOLDOWN) {
            const randomAudio = audioPool[Math.floor(Math.random() * audioPool.length)];
            randomAudio.currentTime = 0;
            randomAudio.play();
            lastPlayTime = now;

            // Create click effect
            const clickEffect = document.createElement('div');
            clickEffect.innerHTML = '💥';
            clickEffect.style.position = 'fixed';
            clickEffect.style.left = cursor.style.left;
            clickEffect.style.top = cursor.style.top;
            clickEffect.style.fontSize = '24px';
            clickEffect.style.zIndex = '999998';
            clickEffect.style.pointerEvents = 'none';
            document.body.appendChild(clickEffect);

            // Animate and remove the effect
            setTimeout(() => document.body.removeChild(clickEffect), 500);
        }
    });

    const SKIBIDI_WORDS = [
        'skibidi', 'rizz', 'goated', 'frfr', 'no cap', 'ong', 'glizzy', 'rizzler', 'yerrr',
        'bussin', 'sus', 'sheesh', 'drip', 'slaps', 'cap', 'bet', 'vibe check', 'lowkey',
        'highkey', 'bruh', 'finna', 'lit', 'yeet', 'flex', 'salty', 'extra', 'boujee',
        'skibidi toilet', 'glizzymaxer', 'cameraman', 'titan', 'speaker', 'gyatt', 'GYATT'
    ];

    function skibidifyText(text) {
        return text.replace(/\b\w+\b/g, () => SKIBIDI_WORDS[Math.floor(Math.random() * SKIBIDI_WORDS.length)]);
    }

    function skibidifyElement(element) {
        if (element.childNodes.length === 0) {
            if (element.nodeType === Node.TEXT_NODE) {
                element.textContent = skibidifyText(element.textContent);
            }
        } else {
            element.childNodes.forEach(skibidifyElement);
        }

        if (element.style) {
            const neonColors = ['#ff00ff', '#00ff00', '#00ffff', '#ff00ff', '#ffff00'];
            element.style.color = neonColors[Math.floor(Math.random() * neonColors.length)];
        }
    }

    // Initial skibidification
    skibidifyElement(document.body);

    // Skibidify new content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    skibidifyElement(node);
                }
            });
        });
    });

    observer.observe(document.body, { childList: true, subtree: true });

    // Add floating Skibidi toilets
    function addFloatingToilets() {
        const toilet = document.createElement('div');
        toilet.innerHTML = '🚽';
        toilet.style.position = 'fixed';
        toilet.style.fontSize = '50px';
        toilet.style.left = Math.random() * window.innerWidth + 'px';
        toilet.style.top = Math.random() * window.innerHeight + 'px';
        toilet.style.zIndex = '9999';
        document.body.appendChild(toilet);

        setInterval(() => {
            toilet.style.left = Math.random() * window.innerWidth + 'px';
            toilet.style.top = Math.random() * window.innerHeight + 'px';
        }, 2000);
    }

    // Add some GOATED toilets, frfr
    for (let i = 0; i < 10; i++) {
        addFloatingToilets();
    }
})();