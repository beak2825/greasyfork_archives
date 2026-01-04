// ==UserScript==
// @name         Keystrokes Overlay
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Stunning keystrokes overlay with combos and effects
// @author       DogWater
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547697/Keystrokes%20Overlay.user.js
// @updateURL https://update.greasyfork.org/scripts/547697/Keystrokes%20Overlay.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const container = document.createElement("div");
    container.id = "keystroke-overlay";
    document.body.appendChild(container);

    const style = document.createElement("style");
    style.innerHTML = `
      #keystroke-overlay {
        position: fixed;
        bottom: 40px;
        left: 50%;
        transform: translateX(-50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        z-index: 999999;
        font-family: "Segoe UI", Roboto, sans-serif;
        pointer-events: none;
      }
      .keystroke {
        background: linear-gradient(135deg, rgba(0, 200, 255, 0.95), rgba(180, 0, 255, 0.95));
        color: #fff;
        border-radius: 14px;
        padding: 10px 20px;
        font-size: 20px;
        font-weight: bold;
        letter-spacing: 1px;
        box-shadow: 0 0 16px rgba(0, 255, 220, 0.9);
        opacity: 0;
        transform: translateY(25px) scale(0.9);
        animation: popIn 0.25s ease-out forwards, glowPulse 1s infinite alternate, fadeOut 2s ease-out forwards;
      }
      @keyframes popIn {
        to { opacity: 1; transform: translateY(0) scale(1); }
      }
      @keyframes fadeOut {
        to { opacity: 0; transform: translateY(-30px) scale(0.95); }
      }
      @keyframes glowPulse {
        from { box-shadow: 0 0 16px rgba(0,255,220,0.9); }
        to { box-shadow: 0 0 28px rgba(255,0,200,1); }
      }
    `;
    document.head.appendChild(style);

    let pressed = new Set();
    let lastTime = 0;

    window.addEventListener("keydown", (e) => {
        const now = Date.now();
        if (pressed.has(e.key)) return;
        pressed.add(e.key);

        let keys = Array.from(pressed).map(k => k.length === 1 ? k.toUpperCase() : k);
        let combo = keys.join(" + ");

        const keyElement = document.createElement("div");
        keyElement.className = "keystroke";
        keyElement.textContent = combo;

        if (now - lastTime < 300) {
            keyElement.style.background = "linear-gradient(135deg, rgba(255,150,0,0.95), rgba(255,0,120,0.95))";
            keyElement.style.boxShadow = "0 0 22px rgba(255,120,0,1)";
            keyElement.style.fontSize = "22px";
        }
        lastTime = now;

        container.appendChild(keyElement);

        setTimeout(() => {
            keyElement.remove();
        }, 2200);
    });

    window.addEventListener("keyup", (e) => {
        pressed.delete(e.key);
    });
})();
