// ==UserScript==
// @name        just some simple visuals
// @namespace   http://tampermonkey.net/
// @version     1.0
// @match       https://meedy.io/*
// @author      rei hades (miamaruuu)
// @description  visual script - blahblahblah
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/535820/just%20some%20simple%20visuals.user.js
// @updateURL https://update.greasyfork.org/scripts/535820/just%20some%20simple%20visuals.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
    .fps-display {
        position: fixed;
        top: 20px;
        left: 20px;
        background-color: rgba(0, 0, 0, 0.7);
        padding: 4px 10px;
        border-radius: 4px;
        font-family: Arial, sans-serif;
        font-size: 20px;
        font-weight: bold;
        color: #fff;
        z-index: 999999;
    }
    #controls-container {
        position: fixed;
        top: 60px;
        left: 20px;
        display: flex;
        gap: 10px;
        z-index: 999999;
    }
    .control-box {
        min-width: 50px;
        min-height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: rgba(255,255,255,0.2);
        border-radius: 8px;
        font-family: Arial, sans-serif;
        font-size: 18px;
        font-weight: bold;
        color: #fff;
        user-select: none;
        transition: background-color 0.2s, color 0.2s;
    }
    #space-box {
        min-width: 70px;
        background-color: rgba(255,255,255,0.3);
    }
    #left-advert-container,
    #middle-bottom-promotion-container,
    #changelog,
    #terms,
    #privacy,
    #links-container {
        display: none !important;
    }
    `;
    document.head.appendChild(style);

    const selectorsToHide = [
        '#left-advert-container',
        '#middle-bottom-promotion-container',
        '#changelog',
        '#terms',
        '#privacy',
        '#links-container'
    ];
    selectorsToHide.forEach(sel => {
        const el = document.querySelector(sel);
        if (el) el.style.display = 'none';
    });

    const loadingOverlay = document.createElement('div');
    Object.assign(loadingOverlay.style, {
        position: 'fixed',
        top: '0', left: '0',
        width: '100%', height: '100%',
        backgroundColor: 'rgba(0,0,0,0.8)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: '999998', color: '#fff', fontSize: '24px'
    });
    loadingOverlay.innerHTML = 'Loading...';
    document.body.appendChild(loadingOverlay);

    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingOverlay.remove();
        }, 500);
    });

    const fpsDisplay = document.createElement('div');
    fpsDisplay.className = 'fps-display';
    fpsDisplay.innerHTML = 'FPS: 0';
    document.body.appendChild(fpsDisplay);

    const controlsContainer = document.createElement('div');
    controlsContainer.id = 'controls-container';

    const keys = ['W', 'A', 'S', 'D'];
    const keyBoxes = {};
    keys.forEach(k => {
        const box = document.createElement('div');
        box.className = 'control-box';
        box.textContent = k;
        controlsContainer.appendChild(box);
        keyBoxes[k] = box;
    });

    const spaceBox = document.createElement('div');
    spaceBox.className = 'control-box';
    spaceBox.id = 'space-box';
    spaceBox.textContent = 'Space';
    controlsContainer.appendChild(spaceBox);

    document.body.appendChild(controlsContainer);

    const keyState = { 'W': false, 'A': false, 'S': false, 'D': false, 'Space': false };
    document.addEventListener('keydown', e => {
        const k = e.key.toLowerCase();
        if (k === 'w') keyState['W'] = true;
        if (k === 'a') keyState['A'] = true;
        if (k === 's') keyState['S'] = true;
        if (k === 'd') keyState['D'] = true;
        if (k === ' ') keyState['Space'] = true;
    });
    document.addEventListener('keyup', e => {
        const k = e.key.toLowerCase();
        if (k === 'w') keyState['W'] = false;
        if (k === 'a') keyState['A'] = false;
        if (k === 's') keyState['S'] = false;
        if (k === 'd') keyState['D'] = false;
        if (k === ' ') keyState['Space'] = false;
    });

    let fps = 0, fpsCount = 0, fpsTime = performance.now();

    (function animate() {
        fpsCount++;
        const now = performance.now();
        if (now - fpsTime >= 1000) {
            fps = fpsCount;
            fpsCount = 0;
            fpsTime = now;
            fpsDisplay.innerHTML = 'FPS: ' + fps;
        }
        requestAnimationFrame(animate);
    })();

    setInterval(() => {
        for (const k in keyBoxes) {
            if (keyState[k]) {
                keyBoxes[k].style.backgroundColor = 'white';
                keyBoxes[k].style.color = 'black';
            } else {
                keyBoxes[k].style.backgroundColor = 'rgba(255,255,255,0.2)';
                keyBoxes[k].style.color = 'white';
            }
        }
    }, 100);
})();

//again this is uncomplete and please read the full description if u havent