// ==UserScript==
// @name         New's Hitbox.io Key Display
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Show ↑ ↓ ← → C X Z V with rainbow border, fill on press, and WASD triggers arrows on hitbox.io top-left overlay 🎮🌈🔥💻✨
// @author       NewPla_yer
// @match        *://hitbox.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/536386/New%27s%20Hitboxio%20Key%20Display.user.js
// @updateURL https://update.greasyfork.org/scripts/536386/New%27s%20Hitboxio%20Key%20Display.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const keys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'c', 'x', 'z', 'v'];
    const keyLabels = {
        'ArrowUp': '↑',
        'ArrowDown': '↓',
        'ArrowLeft': '←',
        'ArrowRight': '→',
        'c': 'C',
        'x': 'X',
        'z': 'Z',
        'v': 'V'
    };

    // WASD remap table
    const remap = {
        'w': 'arrowup',
        'a': 'arrowleft',
        's': 'arrowdown',
        'd': 'arrowright'
    };

    const rainbowColors = [
        '#FF4C4C', '#FF9900', '#FFD700', '#33CC33',
        '#3399FF', '#6633CC', '#FF33CC', '#00FFFF'
    ];

    const style = document.createElement('style');
    style.textContent = `
        #keyDisplayOverlay {
            position: fixed;
            top: 20px;
            left: 20px;
            display: grid;
            grid-template-columns: repeat(4, 40px);
            gap: 10px;
            background: rgba(0, 0, 0, 0.3);
            padding: 12px;
            border-radius: 10px;
            z-index: 9999;
        }

        .keyDisplay {
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 3px solid;
            border-radius: 6px;
            font-size: 18px;
            font-weight: bold;
            color: white;
            background-color: transparent;
            transition: background-color 0.15s, transform 0.15s, box-shadow 0.15s;
        }

        .keyDisplay.pressed {
            transform: scale(1.1);
            box-shadow: 0 0 10px white;
        }
    `;
    document.head.appendChild(style);

    const container = document.createElement('div');
    container.id = 'keyDisplayOverlay';
    document.body.appendChild(container);

    const keyElements = {};

    keys.forEach((key, index) => {
        const el = document.createElement('div');
        el.className = 'keyDisplay';
        el.textContent = keyLabels[key];
        el.style.borderColor = rainbowColors[index];
        container.appendChild(el);
        keyElements[key.toLowerCase()] = { el, color: rainbowColors[index] };
    });

    function handleKey(action, key) {
        const mapped = remap[key] || key;
        if (keyElements[mapped]) {
            const { el, color } = keyElements[mapped];
            if (action === 'down') {
                el.classList.add('pressed');
                el.style.backgroundColor = color;
            } else {
                el.classList.remove('pressed');
                el.style.backgroundColor = 'transparent';
            }
        }
    }

    window.addEventListener('keydown', (e) => {
        handleKey('down', e.key.toLowerCase());
    });

    window.addEventListener('keyup', (e) => {
        handleKey('up', e.key.toLowerCase());
    });
})();
