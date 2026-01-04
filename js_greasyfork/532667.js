// ==UserScript==
// @name         Akari (明かり) - Minimal UI for Bloxd.io
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Clean PvP HUD for Bloxd.io - by MinimalKash
// @match        *://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/532667/Akari%20%28%E6%98%8E%E3%81%8B%E3%82%8A%29%20-%20Minimal%20UI%20for%20Bloxdio.user.js
// @updateURL https://update.greasyfork.org/scripts/532667/Akari%20%28%E6%98%8E%E3%81%8B%E3%82%8A%29%20-%20Minimal%20UI%20for%20Bloxdio.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==== IMAGE ON LOAD ====
    const splash = document.createElement('img');
    splash.src = 'https://media-hosting.imagekit.io/560f8d23922748a3/ChatGPT%20Image%20Apr%2012,%202025,%2005_39_02%20PM.png?Expires=1839113276&Key-Pair-Id=K2ZIVPTIP2VGHC&Signature=jUUtljM5m-QJjVNh4L2fgMclMafnbHShyOzcRnUWdiQFRc4Nq0vW~mU1j34edEc3l1Ar4~iCYAmfK9fsuuoXDPVcEESguWvkUuEq~vnBI6cKFv9R0nt5LbZDwhYAiebpzJv5cVaamUNGd26v79JzHOuVVkObQ1oevJIyhb~3VTQaK9bLaAYCF5-d9uxD6ywCA5Vk4pwYcl1eriTZxX43sw~XAbA0gXwHpz8quAryS~bGxBGXm6QAyElfKgH9ZvnjG8ZrPXfyCqmaBAQDr4YCmQ-ZxfTRXb-FlM-1kDyghIVUQcZqqkD4El09-wUzQAKJzriV7hKD4oJVeqO2q~8K9A__';
    splash.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        max-width: 300px;
        opacity: 0;
        transition: opacity 1s ease-in-out;
        z-index: 99999;
    `;
    document.body.appendChild(splash);
    setTimeout(() => splash.style.opacity = 1, 100);
    setTimeout(() => splash.style.opacity = 0, 3100);
    setTimeout(() => splash.remove(), 4500);

    // ==== STYLES ====
    const style = document.createElement('style');
    style.textContent = `
        #akariToggle {
            position: fixed;
            top: 15px;
            left: 15px;
            background: #fff;
            color: #d63384;
            border: 2px solid #d63384;
            padding: 5px 10px;
            border-radius: 8px;
            font-weight: bold;
            font-family: 'Arial', sans-serif;
            cursor: pointer;
            z-index: 9999;
        }
        #akariMenu {
            position: fixed;
            top: 60px;
            left: 15px;
            background: #ffffff;
            border: 2px solid #d63384;
            border-radius: 12px;
            padding: 15px;
            font-family: 'Arial', sans-serif;
            font-weight: bold;
            color: #333;
            z-index: 9999;
            min-width: 200px;
        }
        #akariMenu label {
            display: block;
            margin-bottom: 10px;
        }
        .hudContainer {
            position: fixed;
            bottom: 110px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            gap: 10px;
            z-index: 9999;
        }
        .hudKey {
            background: #fff;
            color: #d63384;
            border: 2px solid #d63384;
            border-radius: 6px;
            padding: 5px 10px;
            font-weight: bold;
            font-family: Arial;
            text-align: center;
            min-width: 40px;
        }
        .cpsDisplay {
            position: fixed;
            top: 15px;
            right: 15px;
            background: #fff;
            color: #d63384;
            border: 2px solid #d63384;
            border-radius: 8px;
            padding: 5px 10px;
            font-weight: bold;
            font-family: Arial;
            z-index: 9999;
        }
    `;
    document.head.appendChild(style);

    // ==== TOGGLE BUTTON & MENU ====
    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'akariToggle';
    toggleBtn.innerText = 'Akari (明かり)';
    document.body.appendChild(toggleBtn);

    const menu = document.createElement('div');
    menu.id = 'akariMenu';
    menu.style.display = 'none';
    menu.innerHTML = `
        <label><input type="checkbox" id="akariSprint"> Auto Sprint</label>
        <label><input type="checkbox" id="akariJump"> Auto Jump</label>
        <label><input type="checkbox" id="akariWalk"> Auto Walk</label>
        <label><input type="checkbox" id="akariHUD"> Show HUD (LMB/RMB/Space)</label>
        <label><input type="checkbox" id="akariCPS"> Show CPS</label>
    `;
    document.body.appendChild(menu);

    toggleBtn.onclick = () => {
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    };

    // ==== STATE ====
    let keys = {};
    let mouseDownLeft = false;
    let mouseDownRight = false;
    let clicks = 0;

    document.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
    document.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);
    document.addEventListener('mousedown', e => {
        if (e.button === 0) {
            mouseDownLeft = true;
            clicks++;
        }
        if (e.button === 2) mouseDownRight = true;
    });
    document.addEventListener('mouseup', e => {
        if (e.button === 0) mouseDownLeft = false;
        if (e.button === 2) mouseDownRight = false;
    });

    // ==== AUTO SPRINT ====
    setInterval(() => {
        if (document.getElementById('akariSprint').checked && keys['w']) {
            const shiftDown = new KeyboardEvent('keydown', { key: 'Shift', code: 'ShiftLeft', bubbles: true });
            document.dispatchEvent(shiftDown);
        }
    }, 5);

    // ==== AUTO JUMP ====
    setInterval(() => {
        if (document.getElementById('akariJump').checked) {
            const spaceDown = new KeyboardEvent('keydown', { key: ' ', code: 'Space', bubbles: true });
            document.dispatchEvent(spaceDown);
        }
    }, 250);

    // ==== AUTO WALK ====
    setInterval(() => {
        if (document.getElementById('akariWalk').checked) {
            const wDown = new KeyboardEvent('keydown', { key: 'w', code: 'KeyW', bubbles: true });
            document.dispatchEvent(wDown);
        }
    }, 300);

    // ==== HUD ====
    const hudKeys = ['LMB', 'RMB', 'SPACE'];
    const hudContainer = document.createElement('div');
    hudContainer.className = 'hudContainer';
    document.body.appendChild(hudContainer);

    const hudElements = {};
    hudKeys.forEach(key => {
        const el = document.createElement('div');
        el.className = 'hudKey';
        el.innerText = key;
        hudContainer.appendChild(el);
        hudElements[key] = el;
    });

    // ==== CPS ====
    const cpsDisplay = document.createElement('div');
    cpsDisplay.className = 'cpsDisplay';
    cpsDisplay.style.display = 'none';
    document.body.appendChild(cpsDisplay);

    setInterval(() => {
        if (document.getElementById('akariCPS').checked) {
            cpsDisplay.innerText = `CPS: ${clicks}`;
            cpsDisplay.style.display = 'block';
        } else {
            cpsDisplay.style.display = 'none';
        }
        clicks = 0;
    }, 1000);

    // ==== HUD UPDATE ====
    function updateHUD() {
        const active = document.getElementById('akariHUD').checked;
        hudContainer.style.display = active ? 'flex' : 'none';
        if (!active) return;
        hudElements['SPACE'].style.opacity = keys[' '] ? '1' : '0.2';
        hudElements['LMB'].style.opacity = mouseDownLeft ? '1' : '0.2';
        hudElements['RMB'].style.opacity = mouseDownRight ? '1' : '0.2';
    }

    setInterval(updateHUD, 50);
})();