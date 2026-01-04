// ==UserScript==
// @name         Shell Shockers Keyboard Overlay (Draggable)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Visual keyboard overlay that reacts to key presses and can be dragged around
// @author       paradox_2048
// @match        https://shellshock.io/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541914/Shell%20Shockers%20Keyboard%20Overlay%20%28Draggable%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541914/Shell%20Shockers%20Keyboard%20Overlay%20%28Draggable%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  function insertOverlay() {
    if (!document.body) return setTimeout(insertOverlay, 100);

    let settings = { x: 10, y: 10 };
    const stored = JSON.parse(localStorage.getItem("SSKO"));
    if (stored) {
      settings = stored;
    } else {
      localStorage.setItem("SSKO", JSON.stringify(settings));
    }

    const keyboardHTML = `
      <div class="keyboard-overlay" id="keyboard" style="top:${settings.y}px; left:${settings.x}px;">
        <div class="row">
          <div class="key" data-key="q">Q</div>
          <div class="key" data-key="w">W</div>
          <div class="key" data-key="e">E</div>
          <div class="key" data-key="r">R</div>
        </div>
        <div class="row">
          <div class="key" data-key="a">A</div>
          <div class="key" data-key="s">S</div>
          <div class="key" data-key="d">D</div>
          <div class="key" data-key="f">F</div>
        </div>
        <div class="row">
          <div class="key2" data-key="shift">LS</div>
          <div class="key2" data-key=" ">SPACE</div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', keyboardHTML);

    const style = document.createElement('style');
    style.textContent = `
      .keyboard-overlay {
        position: fixed;
        z-index: 999999;
        background: rgba(0, 0, 0, 0.3);
        padding: 8px;
        border-radius: 6px;
        display: flex;
        flex-direction: column;
        gap: 6px;
        pointer-events: auto;
        cursor: move;
      }
      .row { display: flex; gap: 6px; }
      .key, .key2 {
        background: #333;
        color: #fff;
        padding: 12px 16px;
        border-radius: 5px;
        font-family: monospace;
        text-align: center;
        border: 1px solid #555;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        user-select: none;
        transition: all 0.1s ease;
      }
      .key { aspect-ratio: 1 / 1; }
      .key2 { min-width: 80px; }
      .pressed {
        background: gold !important;
        color: black !important;
        transform: scale(0.95);
      }
    `;
    document.head.appendChild(style);

    document.addEventListener("keydown", (e) => {
      const key = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
      if (key) key.classList.add("pressed");
    });

    document.addEventListener("keyup", (e) => {
      const key = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
      if (key) key.classList.remove("pressed");
    });

    // Drag logic
    const overlay = document.getElementById("keyboard");
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    overlay.addEventListener("mousedown", (e) => {
      isDragging = true;
      offsetX = e.clientX - overlay.offsetLeft;
      offsetY = e.clientY - overlay.offsetTop;
    });

    document.addEventListener("mousemove", (e) => {
      if (isDragging) {
        overlay.style.left = `${e.clientX - offsetX}px`;
        overlay.style.top = `${e.clientY - offsetY}px`;
      }
    });

    document.addEventListener("mouseup", () => {
      if (isDragging) {
        isDragging = false;
        localStorage.setItem("SSKO", JSON.stringify({
          x: overlay.offsetLeft,
          y: overlay.offsetTop
        }));
      }
    });
  }

  window.addEventListener('load', insertOverlay);
})();
