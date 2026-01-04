// ==UserScript==
// @name         Keystroke Overlay (Customizable)
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  WASD HUD for SmashKarts.io
// @author       Raiyan
// @match        https://smashkarts.io/*
// @icon         https://raw.githubusercontent.com/elitegamersk/elitegamersk/main/exe.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/546851/Keystroke%20Overlay%20%28Customizable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/546851/Keystroke%20Overlay%20%28Customizable%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // default configuration
    const defaultConfig = {
        hud: {
            backgroundColor: 'rgba(0,0,0,0.6)', // HUD panel background color & opacity
            textColor: 'white', // default key text color
            borderColor: 'white', // key box border color
            borderRadius: '5px', // key box corner roundness
            padding: '10px 15px', // key box padding (size)
            spacebarWidth: '120px', // width of the Spacebar key box
            scale: 1 // default HUD scale
        },
        keyPress: {
            background: 'rgba(255,255,255,0.9)', // background when key is pressed
            textColor: 'black', // text color when key is pressed
            glow: '0 0 8px rgba(255,255,255,0.8)' // glow effect when pressed
        },
        keys: { // default labels
            w: 'W', // labels w
            a: 'A', // labels a
            s: 'S', // labels s
            d: 'D', // labels d
            space: 'Space' // labels Spacebar
        },
        position: { // saved position and scale
            x: 20,
            y: 140,
            scale: 1
        }
    };

    // load saved settings from localStorage
    const savedConfig = JSON.parse(localStorage.getItem("keystrokeOverlayConfig") || "{}");
    const config = mergeDeep(defaultConfig, savedConfig);

    // HUD setup
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = config.position.y + 'px';
    overlay.style.left = config.position.x + 'px';
    overlay.style.background = config.hud.backgroundColor;
    overlay.style.color = config.hud.textColor;
    overlay.style.padding = config.hud.padding;
    overlay.style.borderRadius = config.hud.borderRadius;
    overlay.style.zIndex = 999999;
    overlay.style.userSelect = 'none';
    overlay.style.cursor = 'grab';
    overlay.style.fontFamily = 'Arial, sans-serif';
    overlay.style.textAlign = 'center';
    overlay.style.transform = `scale(${config.position.scale})`;

    const row1 = document.createElement('div'); // W row
    const row2 = document.createElement('div'); // A S D row
    const row3 = document.createElement('div'); // Space row
    overlay.appendChild(row1);
    overlay.appendChild(row2);
    overlay.appendChild(row3);

    const keys = {
        w: {label: config.keys.w, row: row1, linked:['w','arrowup']},
        a: {label: config.keys.a, row: row2, linked:['a','arrowleft']},
        s: {label: config.keys.s, row: row2, linked:['s','arrowdown']},
        d: {label: config.keys.d, row: row2, linked:['d','arrowright']},
        space: {label: config.keys.space, row: row3, linked:[' ']}
    };

    const keyElems = {};
    Object.keys(keys).forEach(k => {
        const el = document.createElement('div');
        el.innerText = keys[k].label;
        el.style.display = 'inline-block';
        el.style.margin = '3px';
        el.style.padding = config.hud.padding;
        el.style.border = `2px solid ${config.hud.borderColor}`;
        el.style.borderRadius = config.hud.borderRadius;
        el.style.transition = 'all 0.1s ease';

        if (k === 'space') {
            el.style.minWidth = config.hud.spacebarWidth;
            el.style.textAlign = 'center';
        }

        keys[k].row.appendChild(el);
        keyElems[k] = el;
    });

    document.body.appendChild(overlay);

    // key tracking and glow
    const pressed = new Set();
    document.addEventListener('keydown', e => pressed.add(e.key.toLowerCase()));
    document.addEventListener('keyup', e => pressed.delete(e.key.toLowerCase()));

    function updateKeys() {
        Object.keys(keys).forEach(k => {
            const active = keys[k].linked.some(code => pressed.has(code));
            if (active) {
                keyElems[k].style.background = config.keyPress.background;
                keyElems[k].style.color = config.keyPress.textColor;
                keyElems[k].style.boxShadow = config.keyPress.glow;
            } else {
                keyElems[k].style.background = 'transparent';
                keyElems[k].style.color = config.hud.textColor;
                keyElems[k].style.boxShadow = 'none';
            }
        });
        requestAnimationFrame(updateKeys);
    }
    updateKeys();

    // dragging and saving position
    let isDragging = false, offsetX = 0, offsetY = 0;
    overlay.addEventListener('mousedown', e => {
        isDragging = true;
        overlay.style.cursor = 'grabbing';
        offsetX = e.clientX - overlay.getBoundingClientRect().left;
        offsetY = e.clientY - overlay.getBoundingClientRect().top;
    });
    document.addEventListener('mousemove', e => {
        if(isDragging){
            const newX = e.clientX - offsetX;
            const newY = e.clientY - offsetY;
            overlay.style.left = newX + 'px';
            overlay.style.top = newY + 'px';
            saveSettings(newX, newY, getScale()); // save on drag
        }
    });
    document.addEventListener('mouseup', () => {
        isDragging = false;
        overlay.style.cursor = 'grab';
    });

    // resize with wheel and save
    overlay.addEventListener('wheel', e => {
        e.preventDefault();
        let newScale = getScale() + (e.deltaY < 0 ? 0.1 : -0.1);
        newScale = Math.min(Math.max(newScale, 0.5), 3);
        overlay.style.transform = `scale(${newScale})`;
        const rect = overlay.getBoundingClientRect();
        saveSettings(rect.left, rect.top, newScale);
    });

    // helpers
    function getScale() {
        return parseFloat(overlay.style.transform.replace(/scale\((.*)\)/,'$1')) || 1;
    }

    function saveSettings(x, y, scale) {
        const saved = JSON.parse(localStorage.getItem("keystrokeOverlayConfig") || "{}");
        saved.position = {x, y, scale};
        localStorage.setItem("keystrokeOverlayConfig", JSON.stringify(saved));
    }

    // deep merge for defaults and saved settings
    function mergeDeep(target, source) {
        const output = {...target};
        if (isObject(target) && isObject(source)) {
            Object.keys(source).forEach(key => {
                if (isObject(source[key])) {
                    if (!(key in target)) Object.assign(output, {[key]: source[key]});
                    else output[key] = mergeDeep(target[key], source[key]);
                } else {
                    output[key] = source[key];
                }
            });
        }
        return output;
    }

    function isObject(item) {
        return (item && typeof item === 'object' && !Array.isArray(item));
    }

})();
