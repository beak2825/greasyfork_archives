// ==UserScript==
// @name         Change the contrast and brightness script for Vectaria.io
// @description  Upgrade your game
// @version      1.5.2
// @author       x_Rediex
// @match        *://vectaria.io/*
// @license      MIT
// @grant        none
// @namespace http://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/543511/Change%20the%20contrast%20and%20brightness%20script%20for%20Vectariaio.user.js
// @updateURL https://update.greasyfork.org/scripts/543511/Change%20the%20contrast%20and%20brightness%20script%20for%20Vectariaio.meta.js
// ==/UserScript==

(function () {
  'use strict';

  const createMenu = () => {
    const menu = document.createElement('div');
    menu.id = 'Change the contrast and brightness';
    menu.style = `
      position: fixed;
      top: 100px;
      right: 20px;
      width: 240px;
      background: black;
      border: 2px solid white;
      color: white;
      font-family: sans-serif;
      padding: 10px 15px 15px 15px;
      border-radius: 8px;
      z-index: 999999;
      cursor: grab;
      user-select: none;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
    `;

    const titleBar = document.createElement('div');
    titleBar.style = 'font-size: 18px; font-weight: bold; margin-bottom: 10px; width: 100%;';

    // Dragging logic
    let isDragging = false;
    let offsetX, offsetY;
    titleBar.addEventListener('mousedown', (e) => {
      isDragging = true;
      offsetX = e.clientX - menu.getBoundingClientRect().right;
      offsetY = e.clientY - menu.offsetTop;
      menu.style.cursor = 'grabbing';
      e.preventDefault();
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      menu.style.cursor = 'grab';
    });
    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        const newRight = window.innerWidth - e.clientX - offsetX;
        menu.style.right = `${newRight}px`;
        menu.style.top = `${e.clientY - offsetY}px`;
      }
    });

    // Minimize button
    const minimizeBtn = document.createElement('button');
    minimizeBtn.textContent = '-';
    minimizeBtn.style = `
      position: absolute;
      top: 6px;
      right: 8px;
      background: transparent;
      color: white;
      border: 1px solid white;
      width: 20px;
      height: 20px;
      font-size: 14px;
      line-height: 14px;
      padding: 0;
      border-radius: 4px;
      cursor: pointer;
      user-select: none;
    `;

    // Mod circle button (początkowo ukryty)
    const modBtn = document.createElement('button');
    modBtn.textContent = 'MOD';
    modBtn.style = `
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 50px;
      height: 50px;
      background: black;
      border: 2px solid white;
      border-radius: 50%;
      color: white;
      font-weight: bold;
      font-family: sans-serif;
      font-size: 16px;
      cursor: pointer;
      z-index: 999999;
      display: none;
      user-select: none;
      box-shadow: 0 0 8px white;
    `;

    // Nick display inside menu - zawsze widoczny
    const nickDisplay = document.createElement('div');
    nickDisplay.style = `
      margin-top: 15px;
      font-size: 14px;
      font-weight: 600;
      user-select: none;
      width: 100%;
      text-align: center;
    `;

    // Create sliders + labels + value displays helper
    const createSliderControl = (labelText, min, max, initialValue) => {
      const wrapper = document.createElement('div');

      const label = document.createElement('label');
      label.textContent = labelText;
      label.className = 'slider-label';

      const slider = document.createElement('input');
      slider.type = 'range';
      slider.min = min;
      slider.max = max;
      slider.value = initialValue;
      slider.classList.add('custom-slider');

      const valueDisplay = document.createElement('div');
      valueDisplay.className = 'slider-value';
      valueDisplay.textContent = slider.value;

      wrapper.appendChild(label);
      wrapper.appendChild(slider);
      wrapper.appendChild(valueDisplay);

      return { wrapper, slider, valueDisplay };
    };

    // Style for sliders and labels
    const style = document.createElement('style');
    style.textContent = `
      input[type="range"].custom-slider {
        width: 100%;
        appearance: none;
        background: black;
        border: 1px solid white;
        height: 8px;
        outline: none;
        margin-top: 6px;
        cursor: pointer;
      }
      input[type="range"].custom-slider::-webkit-slider-thumb {
        appearance: none;
        height: 14px;
        width: 14px;
        background: black;
        border: 2px solid white;
      }
      input[type="range"].custom-slider::-moz-range-thumb {
        height: 14px;
        width: 14px;
        background: black;
        border: 2px solid white;
      }
      .slider-label {
        margin-top: 12px;
        font-size: 14px;
        font-weight: 600;
      }
      .slider-value {
        font-size: 13px;
        margin-top: 2px;
        color: #ccc;
        text-align: right;
      }
    `;

    // Create brightness and contrast sliders
    const brightnessControl = createSliderControl('Brightness (%)', 0, 200, 100);
    const contrastControl = createSliderControl('Contrast (%)', 0, 200, 100);

    // Container for sliders (to toggle display)
    const slidersContainer = document.createElement('div');
    slidersContainer.appendChild(brightnessControl.wrapper);
    slidersContainer.appendChild(contrastControl.wrapper);

    // Apply filters on body live when sliders change
    const applyFilters = () => {
      const brightness = brightnessControl.slider.value;
      const contrast = contrastControl.slider.value;
      document.body.style.filter = `brightness(${brightness}%) contrast(${contrast}%)`;
    };

    brightnessControl.slider.addEventListener('input', () => {
      brightnessControl.valueDisplay.textContent = brightnessControl.slider.value;
      applyFilters();
    });
    contrastControl.slider.addEventListener('input', () => {
      contrastControl.valueDisplay.textContent = contrastControl.slider.value;
      applyFilters();
    });

    // Set initial filter
    applyFilters();

    // Nick detection and refresh every 2 seconds if not found
    const nickDisplayText = () => {
      const nicknameDiv = document.querySelector('.nickname');
      const foundNick = nicknameDiv?.childNodes?.[0]?.textContent?.trim();
      if (foundNick) {
        nickDisplay.textContent = 'Nick: ' + foundNick;
        clearInterval(nickInterval);
      } else {
        nickDisplay.textContent = 'Nick: Nie znaleziono nicku';
      }
    };

    let nickInterval = setInterval(nickDisplayText, 2000);
    nickDisplayText(); // pierwsze sprawdzenie od razu

    // Minimize button action
    minimizeBtn.onclick = () => {
      if (slidersContainer.style.display !== 'none') {
        // minimalizuj - chowamy suwaki, zwężamy menu, pokazujemy modBtn
        slidersContainer.style.display = 'none';
        minimizeBtn.textContent = '+';
        menu.style.width = '70px';
        menu.style.height = 'auto'; // aby nick był widoczny
        modBtn.style.display = 'block';
      } else {
        // otwórz
        slidersContainer.style.display = 'block';
        minimizeBtn.textContent = '-';
        menu.style.width = '240px';
        menu.style.height = 'auto';
        modBtn.style.display = 'none';
      }
    };

    // Mod button przywracający menu
    modBtn.onclick = () => {
      slidersContainer.style.display = 'block';
      minimizeBtn.textContent = '-';
      menu.style.width = '240px';
      menu.style.height = 'auto';
      modBtn.style.display = 'none';
    };

    // Dodaj elementy do menu
    menu.appendChild(titleBar);
    menu.appendChild(minimizeBtn);
    menu.appendChild(slidersContainer);
    menu.appendChild(nickDisplay);

    document.head.appendChild(style);
    document.body.appendChild(menu);
    document.body.appendChild(modBtn);
  };

  window.addEventListener('load', () => {
    setTimeout(createMenu, 500);
  });
})();
