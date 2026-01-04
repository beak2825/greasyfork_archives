// ==UserScript==
// @name         Taming.io Keystrokes
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  A simple  smooth, draggable, scalable, and customizable script to display keystrokes and CPS (stylish for recording, streaming, etc).
// @author       Triton
// @match        https://taming.io/
// @icon         https://taming.io/img/item/amber-spear.png
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/466231/Tamingio%20Keystrokes.user.js
// @updateURL https://update.greasyfork.org/scripts/466231/Tamingio%20Keystrokes.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //CONFIGURATION (customizable)
    const config = {
        //Keybinds
        upKey: "w", leftKey: "a", downKey: "s", rightKey: "d", spaceKey: " ", //Keybinding

        //Display Text
        upText: "W", leftText: "A", downText: "S", rightText: "D", //Displayed keys

        //Colors
        idleColor: "rgba(34, 34, 34, 0.9)",      //Default key color
        pressColor: "rgba(255, 255, 255, 0.25)", //On press color

        //Style & Position
        opacity: 0.9,
        defaultPositionX: "20px",
        defaultPositionY: "20px",

        // Scaling
        defaultScale: 1.0,  //Initial scale (1.0 = 100%)
        minScale: 0.5,      //Minimum scale (0.5 = 50%)
        maxScale: 2.0,      //Maximum scale (2.0 = 200%)
        scaleStep: 0.05,    //How much to scale with each +/- key press
    };

    //Actual script
    let lmbClicks = 0, rmbClicks = 0;
    let currentScale;
    const keyElements = {};
    const keyMap = {
        [config.upKey]: 'up', [config.leftKey]: 'left', [config.downKey]: 'down',
        [config.rightKey]: 'right', [config.spaceKey]: 'space'
    };

    const css = `
        @keyframes rainbow{0%{color:#ff0000}10%{color:#fc7b03}20%{color:#fcf803}30%{color:#98fc03}40%{color:#03fc28}50%{color:#03fccf}60%{color:#03c2fc}70%{color:#033dfc}80%{color:#6b03fc}90%{color:#e803fc}100%{color:#fc031c}}
        .keystrokes-container{position:fixed;width:240px;height:240px;font-family:"Lato",sans-serif;user-select:none;z-index:9999;opacity:${config.opacity};animation:rainbow 10s infinite;cursor:grab;transform-origin:top left;transition:transform 0.1s ease;}
        .keystrokes-container.dragging{cursor:grabbing;}
        .key-element{position:absolute;text-align:center;vertical-align:middle;background:${config.idleColor};border-radius:5px;transition:background-color 0.1s ease;font-weight:700;pointer-events:none;}
        .wasd{width:58px;height:58px;line-height:58px;font-size:20px;}
        .mouse{font-size:14px;line-height:40px;}
        .key-up{top:15px;left:100px;} .key-left{top:80px;left:35px;} .key-down{top:80px;left:100px;} .key-right{top:80px;left:165px;}
        .key-lmb{width:89.5px;height:40px;top:145px;left:34.5px;} .key-rmb{width:89.5px;height:40px;top:145px;left:132.5px;}
        .key-space{width:187px;height:40px;top:193px;left:35px;}
        .space-svg{width:32px;height:32px;margin-top:4px;fill:currentColor;}
    `;

    const html = `
        <div class="key-element wasd key-up">${config.upText}</div> <div class="key-element wasd key-left">${config.leftText}</div>
        <div class="key-element wasd key-down">${config.downText}</div> <div class="key-element wasd key-right">${config.rightText}</div>
        <div class="key-element mouse key-lmb">LMB: 0</div> <div class="key-element mouse key-rmb">RMB: 0</div>
        <div class="key-element key-space"><svg class="space-svg" viewBox="0 0 512 512"><polygon points="40 288 40 416 464 416 464 288 432 288 432 384 72 384 72 288 40 288"/></svg></div>
    `;

    function init() {
        const styleSheet = document.createElement("style");
        styleSheet.innerText = css;
        document.head.appendChild(styleSheet);

        const container = document.createElement("div");
        container.className = "keystrokes-container";
        container.innerHTML = html;

        container.style.left = localStorage.getItem('keystrokes_X') || config.defaultPositionX;
        container.style.top = localStorage.getItem('keystrokes_Y') || config.defaultPositionY;
        currentScale = parseFloat(localStorage.getItem('keystrokes_scale')) || config.defaultScale;
        container.style.transform = `scale(${currentScale})`;

        document.body.appendChild(container);

        Object.assign(keyElements, {
            up: container.querySelector('.key-up'), left: container.querySelector('.key-left'),
            down: container.querySelector('.key-down'), right: container.querySelector('.key-right'),
            lmb: container.querySelector('.key-lmb'), rmb: container.querySelector('.key-rmb'),
            space: container.querySelector('.key-space')
        });

        const handleKeyDown = e => {
            if (e.key === '-' || e.key === '_') {
                e.preventDefault();
                currentScale = Math.max(config.minScale, currentScale - config.scaleStep);
            } else if (e.key === '+' || e.key === '=') {
                e.preventDefault();
                currentScale = Math.min(config.maxScale, currentScale + config.scaleStep);
            } else {
                const keyName = keyMap[e.key.toLowerCase()];
                if (keyName) keyElements[keyName].style.backgroundColor = config.pressColor;
                return;
            }
            container.style.transform = `scale(${currentScale})`;
            localStorage.setItem('keystrokes_scale', currentScale);
        };
        const handleKeyUp = e => { const keyName = keyMap[e.key.toLowerCase()]; if (keyName) keyElements[keyName].style.backgroundColor = config.idleColor; };
        const handleMouseDown = e => { if (e.button === 0) { lmbClicks++; keyElements.lmb.style.backgroundColor = config.pressColor; } else if (e.button === 2) { rmbClicks++; keyElements.rmb.style.backgroundColor = config.pressColor; } };
        const handleMouseUp = e => { if (e.button === 0) keyElements.lmb.style.backgroundColor = config.idleColor; else if (e.button === 2) keyElements.rmb.style.backgroundColor = config.idleColor; };

        function makeDraggable(element) {
            let initialX, initialY, initialLeft, initialTop;
            const move = e => {
                const dx = e.clientX - initialX;
                const dy = e.clientY - initialY;
                element.style.left = `${initialLeft + dx}px`;
                element.style.top = `${initialTop + dy}px`;
            };
            const endDrag = () => {
                document.removeEventListener('mousemove', move);
                document.removeEventListener('mouseup', endDrag);
                element.classList.remove('dragging');
                localStorage.setItem('keystrokes_X', element.style.left);
                localStorage.setItem('keystrokes_Y', element.style.top);
            };
            element.addEventListener('mousedown', e => {
                if (e.button !== 0) return;
                e.preventDefault();
                initialX = e.clientX; initialY = e.clientY;
                initialLeft = element.offsetLeft; initialTop = element.offsetTop;
                element.classList.add('dragging');
                document.addEventListener('mousemove', move);
                document.addEventListener('mouseup', endDrag);
            });
        }

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        window.addEventListener("mousedown", handleMouseDown);
        window.addEventListener("mouseup", handleMouseUp);
        window.addEventListener("contextmenu", e => e.preventDefault());
        makeDraggable(container);
        setInterval(() => {
            keyElements.lmb.textContent = `LMB: ${lmbClicks}`;
            keyElements.rmb.textContent = `RMB: ${rmbClicks}`;
            lmbClicks = 0; rmbClicks = 0;
        }, 1000);
    }

    init();
})();