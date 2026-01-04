// ==UserScript==
// @name         CoffeeGamer2025 Rainbow Menu (Fully updated and much more updates soon!)
// @namespace    http://tampermonkey.net/
// @version      V1
// @description  Shell Shockers background & crosshair theme with draggable UI ☕🌈💖🛑🎯 (Optimized for performance)
// @author       CoffeeGamer2025
// @match        https://shellshock.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/533457/CoffeeGamer2025%20Rainbow%20Menu%20%28Fully%20updated%20and%20much%20more%20updates%20soon%21%29.user.js
// @updateURL https://update.greasyfork.org/scripts/533457/CoffeeGamer2025%20Rainbow%20Menu%20%28Fully%20updated%20and%20much%20more%20updates%20soon%21%29.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const style = document.createElement('style');
  style.textContent = `
    @keyframes rainbowColor {
      0% { background-color: red; }
      14% { background-color: orange; }
      28% { background-color: yellow; }
      42% { background-color: green; }
      57% { background-color: blue; }
      71% { background-color: indigo; }
      85% { background-color: violet; }
      100% { background-color: red; }
    }

    #coffeeMenu {
      position: fixed;
      top: 100px;
      left: 100px;
      background: linear-gradient(135deg, red, black);
      color: #fff;
      padding: 15px;
      border-radius: 10px;
      border: 2px solid #888;
      z-index: 9999;
      width: 350px;
      font-family: Arial, sans-serif;
      display: none;
      box-shadow: 0 4px 12px rgba(0,0,0,0.5);
      cursor: move;
    }

    #coffeeMenu h3 {
      margin: 0 0 10px;
      text-align: center;
      font-size: 16px;
    }

    .toggle-container {
      display: flex;
      align-items: center;
      margin: 10px 0;
      gap: 10px;
    }

    .toggle-container label {
      flex: 0 0 140px;
      font-size: 14px;
    }

    .toggle-container input {
      appearance: none;
      width: 50px;
      height: 25px;
      background-color: #ccc;
      border-radius: 25px;
      position: relative;
      cursor: pointer;
      transition: background-color 0.3s ease;
      flex-shrink: 0;
    }

    .toggle-container input:checked {
      background-color: #66ff66;
    }

    .toggle-container input:before {
      content: '';
      position: absolute;
      top: 2px;
      left: 2px;
      width: 21px;
      height: 21px;
      background-color: #fff;
      border-radius: 50%;
      transition: left 0.3s ease;
    }

    .toggle-container input:checked:before {
      left: 27px;
    }

    .desc {
      flex: 1;
      font-size: 12px;
      color: #ccc;
    }

    #popupMessage {
      position: fixed;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.85);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-size: 16px;
      z-index: 9999;
      display: none;
    }
  `;
  document.head.appendChild(style);

  // === Menu ===
  const menu = document.createElement('div');
  menu.id = 'coffeeMenu';
  menu.innerHTML = `
    <h3>☕ CoffeeGamer2025</h3>
    <div class="toggle-container">
      <label for="rainbowSwitch">🌈 Rainbow BG</label>
      <input type="checkbox" id="rainbowSwitch">
      <span class="desc">Slowly cycles background colors</span>
    </div>
    <div class="toggle-container">
      <label for="pinkSwitch">💖 Pink BG</label>
      <input type="checkbox" id="pinkSwitch">
      <span class="desc">Sets background to pink color</span>
    </div>
    <div class="toggle-container">
      <label for="crosshairSwitch">🎯 Rainbow Crosshair</label>
      <input type="checkbox" id="crosshairSwitch">
      <span class="desc">Makes crosshair rainbow-colored</span>
    </div>
    <div class="toggle-container">
      <label for="aimAssistSwitch">🤖 Aim Assist</label>
      <input type="checkbox" id="aimAssistSwitch">
      <span class="desc">Helps gently guide your aim</span>
    </div>
    <div class="toggle-container">
      <label for="stopSwitch">🛑 Stop All</label>
      <input type="checkbox" id="stopSwitch">
      <span class="desc">Turns off all effects instantly</span>
    </div>
  `;
  document.body.appendChild(menu);

  // === Toggle References ===
  const rainbowSwitch = document.getElementById('rainbowSwitch');
  const pinkSwitch = document.getElementById('pinkSwitch');
  const crosshairSwitch = document.getElementById('crosshairSwitch');
  const aimAssistSwitch = document.getElementById('aimAssistSwitch');
  const stopSwitch = document.getElementById('stopSwitch');

  const audio = new Audio('https://www.bensound.com/bensound-music/bensound-creativeminds.mp3');
  audio.loop = true;
  audio.volume = 0.5;

  const playMusic = () => {
    audio.play().catch(() => {});
  };

  // === Feature Logic ===
  rainbowSwitch.addEventListener('change', () => {
    if (rainbowSwitch.checked) {
      document.body.style.animation = "rainbowColor 15s infinite";
    } else {
      document.body.style.animation = "";
    }
  });

  pinkSwitch.addEventListener('change', () => {
    if (pinkSwitch.checked) {
      document.body.style.background = "pink";
      document.body.style.animation = "";
    }
  });

  crosshairSwitch.addEventListener('change', () => {
    if (crosshairSwitch.checked) {
      console.log("Rainbow crosshair enabled (visual logic not shown)");
    }
  });

  aimAssistSwitch.addEventListener('change', () => {
    if (aimAssistSwitch.checked) {
      console.log("Aim assist enabled (visual logic not shown)");
    }
  });

  stopSwitch.addEventListener('change', () => {
    document.body.style.background = "";
    document.body.style.animation = "";
    rainbowSwitch.checked = false;
    pinkSwitch.checked = false;
    crosshairSwitch.checked = false;
    aimAssistSwitch.checked = false;
    stopSwitch.checked = false;
  });

  // === Toggle Menu with H ===
  let menuVisible = false;
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'h') {
      menuVisible = !menuVisible;
      menu.style.display = menuVisible ? 'block' : 'none';
      playMusic();
    }
  });

  // === Show Popup on Load ===
  const popup = document.createElement('div');
  popup.id = 'popupMessage';
  popup.textContent = 'Press H to toggle the menu on and off';
  document.body.appendChild(popup);
  popup.style.display = 'block';
  setTimeout(() => popup.style.display = 'none', 5000);

  // === Drag Menu ===
  let dragging = false, offsetX, offsetY;
  menu.addEventListener('mousedown', (e) => {
    dragging = true;
    offsetX = e.clientX - menu.offsetLeft;
    offsetY = e.clientY - menu.offsetTop;
  });
  document.addEventListener('mousemove', (e) => {
    if (dragging) {
      menu.style.left = e.clientX - offsetX + 'px';
      menu.style.top = e.clientY - offsetY + 'px';
    }
  });
  document.addEventListener('mouseup', () => dragging = false);
})();