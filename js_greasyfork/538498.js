// ==UserScript==
// @name         Blacket Neon Theme Switcher
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Movable button to cycle through neon color themes on Blacket.org full page styling
// @author       monkxy#0001
// @match        https://blacket.org/*
// @match        https://*.blacket.org/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/538498/Blacket%20Neon%20Theme%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/538498/Blacket%20Neon%20Theme%20Switcher.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const neonThemes = [
        {
            name: "Neon Red",
            css: `
              body,
              #app,
              .styles__background___2J-JA-camelCase,
              .styles__app___bM8h5-camelCase,
              .styles__sidebar___1XqWi-camelCase,
              .styles__header___22Ne2-camelCase,
              .styles__toastContainer___o4pCa-camelCase,
              .styles__chatCurrentRoom___MCaV4-camelCase,
              .styles__chatRoomsListContainer___Gk4Av-camelCase,
              .styles__chatRooms___o5ASb-camelCase,
              .styles__container___1BPm9-camelCase,
              .styles__profileContainer___CSuIE-camelCase,
              .styles__statContainer___QKuOF-camelCase,
              .styles__friendContainer___3wVox-camelCase,
              .styles__bazaarItem___Meg69-camelCase,
              .styles__topStatsContainer___dWfN7-camelCase,
              .styles__statsContainer___1r5je-camelCase,
              .styles__bottomStatsContainer___1O6MJ-camelCase,
              .styles__statsContainer___QnrRB-camelCase {
                background-color: #ff073a !important;
                color: white !important;
                box-shadow: 0 0 15px #ff073a, 0 0 30px #ff073a !important;
              }
            `
        },
        {
            name: "Neon Orange",
            css: `
              body,
              #app,
              .styles__background___2J-JA-camelCase,
              .styles__app___bM8h5-camelCase,
              .styles__sidebar___1XqWi-camelCase,
              .styles__header___22Ne2-camelCase,
              .styles__toastContainer___o4pCa-camelCase,
              .styles__chatCurrentRoom___MCaV4-camelCase,
              .styles__chatRoomsListContainer___Gk4Av-camelCase,
              .styles__chatRooms___o5ASb-camelCase,
              .styles__container___1BPm9-camelCase,
              .styles__profileContainer___CSuIE-camelCase,
              .styles__statContainer___QKuOF-camelCase,
              .styles__friendContainer___3wVox-camelCase,
              .styles__bazaarItem___Meg69-camelCase,
              .styles__topStatsContainer___dWfN7-camelCase,
              .styles__statsContainer___1r5je-camelCase,
              .styles__bottomStatsContainer___1O6MJ-camelCase,
              .styles__statsContainer___QnrRB-camelCase {
                background-color: #ff6a00 !important;
                color: white !important;
                box-shadow: 0 0 15px #ff6a00, 0 0 30px #ff6a00 !important;
              }
            `
        },
        {
            name: "Neon Yellow",
            css: `
              body,
              #app,
              .styles__background___2J-JA-camelCase,
              .styles__app___bM8h5-camelCase,
              .styles__sidebar___1XqWi-camelCase,
              .styles__header___22Ne2-camelCase,
              .styles__toastContainer___o4pCa-camelCase,
              .styles__chatCurrentRoom___MCaV4-camelCase,
              .styles__chatRoomsListContainer___Gk4Av-camelCase,
              .styles__chatRooms___o5ASb-camelCase,
              .styles__container___1BPm9-camelCase,
              .styles__profileContainer___CSuIE-camelCase,
              .styles__statContainer___QKuOF-camelCase,
              .styles__friendContainer___3wVox-camelCase,
              .styles__bazaarItem___Meg69-camelCase,
              .styles__topStatsContainer___dWfN7-camelCase,
              .styles__statsContainer___1r5je-camelCase,
              .styles__bottomStatsContainer___1O6MJ-camelCase,
              .styles__statsContainer___QnrRB-camelCase {
                background-color: #fff100 !important;
                color: black !important;
                box-shadow: 0 0 15px #fff100, 0 0 30px #fff100 !important;
              }
            `
        },
        {
            name: "Neon Green",
            css: `
              body,
              #app,
              .styles__background___2J-JA-camelCase,
              .styles__app___bM8h5-camelCase,
              .styles__sidebar___1XqWi-camelCase,
              .styles__header___22Ne2-camelCase,
              .styles__toastContainer___o4pCa-camelCase,
              .styles__chatCurrentRoom___MCaV4-camelCase,
              .styles__chatRoomsListContainer___Gk4Av-camelCase,
              .styles__chatRooms___o5ASb-camelCase,
              .styles__container___1BPm9-camelCase,
              .styles__profileContainer___CSuIE-camelCase,
              .styles__statContainer___QKuOF-camelCase,
              .styles__friendContainer___3wVox-camelCase,
              .styles__bazaarItem___Meg69-camelCase,
              .styles__topStatsContainer___dWfN7-camelCase,
              .styles__statsContainer___1r5je-camelCase,
              .styles__bottomStatsContainer___1O6MJ-camelCase,
              .styles__statsContainer___QnrRB-camelCase {
                background-color: #39ff14 !important;
                color: black !important;
                box-shadow: 0 0 15px #39ff14, 0 0 30px #39ff14 !important;
              }
            `
        },
        {
            name: "Neon Blue",
            css: `
              body,
              #app,
              .styles__background___2J-JA-camelCase,
              .styles__app___bM8h5-camelCase,
              .styles__sidebar___1XqWi-camelCase,
              .styles__header___22Ne2-camelCase,
              .styles__toastContainer___o4pCa-camelCase,
              .styles__chatCurrentRoom___MCaV4-camelCase,
              .styles__chatRoomsListContainer___Gk4Av-camelCase,
              .styles__chatRooms___o5ASb-camelCase,
              .styles__container___1BPm9-camelCase,
              .styles__profileContainer___CSuIE-camelCase,
              .styles__statContainer___QKuOF-camelCase,
              .styles__friendContainer___3wVox-camelCase,
              .styles__bazaarItem___Meg69-camelCase,
              .styles__topStatsContainer___dWfN7-camelCase,
              .styles__statsContainer___1r5je-camelCase,
              .styles__bottomStatsContainer___1O6MJ-camelCase,
              .styles__statsContainer___QnrRB-camelCase {
                background-color: #1f51ff !important;
                color: white !important;
                box-shadow: 0 0 15px #1f51ff, 0 0 30px #1f51ff !important;
              }
            `
        },
        {
            name: "Neon Purple",
            css: `
              body,
              #app,
              .styles__background___2J-JA-camelCase,
              .styles__app___bM8h5-camelCase,
              .styles__sidebar___1XqWi-camelCase,
              .styles__header___22Ne2-camelCase,
              .styles__toastContainer___o4pCa-camelCase,
              .styles__chatCurrentRoom___MCaV4-camelCase,
              .styles__chatRoomsListContainer___Gk4Av-camelCase,
              .styles__chatRooms___o5ASb-camelCase,
              .styles__container___1BPm9-camelCase,
              .styles__profileContainer___CSuIE-camelCase,
              .styles__statContainer___QKuOF-camelCase,
              .styles__friendContainer___3wVox-camelCase,
              .styles__bazaarItem___Meg69-camelCase,
              .styles__topStatsContainer___dWfN7-camelCase,
              .styles__statsContainer___1r5je-camelCase,
              .styles__bottomStatsContainer___1O6MJ-camelCase,
              .styles__statsContainer___QnrRB-camelCase {
                background-color: #b800ff !important;
                color: white !important;
                box-shadow: 0 0 15px #b800ff, 0 0 30px #b800ff !important;
              }
            `
        },
        {
            name: "Neon Pink",
            css: `
              body,
              #app,
              .styles__background___2J-JA-camelCase,
              .styles__app___bM8h5-camelCase,
              .styles__sidebar___1XqWi-camelCase,
              .styles__header___22Ne2-camelCase,
              .styles__toastContainer___o4pCa-camelCase,
              .styles__chatCurrentRoom___MCaV4-camelCase,
              .styles__chatRoomsListContainer___Gk4Av-camelCase,
              .styles__chatRooms___o5ASb-camelCase,
              .styles__container___1BPm9-camelCase,
              .styles__profileContainer___CSuIE-camelCase,
              .styles__statContainer___QKuOF-camelCase,
              .styles__friendContainer___3wVox-camelCase,
              .styles__bazaarItem___Meg69-camelCase,
              .styles__topStatsContainer___dWfN7-camelCase,
              .styles__statsContainer___1r5je-camelCase,
              .styles__bottomStatsContainer___1O6MJ-camelCase,
              .styles__statsContainer___QnrRB-camelCase {
                background-color: #ff00d0 !important;
                color: white !important;
                box-shadow: 0 0 15px #ff00d0, 0 0 30px #ff00d0 !important;
              }
            `
        },
        {
            name: "Neon White",
            css: `
              body,
              #app,
              .styles__background___2J-JA-camelCase,
              .styles__app___bM8h5-camelCase,
              .styles__sidebar___1XqWi-camelCase,
              .styles__header___22Ne2-camelCase,
              .styles__toastContainer___o4pCa-camelCase,
              .styles__chatCurrentRoom___MCaV4-camelCase,
              .styles__chatRoomsListContainer___Gk4Av-camelCase,
              .styles__chatRooms___o5ASb-camelCase,
              .styles__container___1BPm9-camelCase,
              .styles__profileContainer___CSuIE-camelCase,
              .styles__statContainer___QKuOF-camelCase,
              .styles__friendContainer___3wVox-camelCase,
              .styles__bazaarItem___Meg69-camelCase,
              .styles__topStatsContainer___dWfN7-camelCase,
              .styles__statsContainer___1r5je-camelCase,
              .styles__bottomStatsContainer___1O6MJ-camelCase,
              .styles__statsContainer___QnrRB-camelCase {
                background-color: #e6e6e6 !important;
                color: black !important;
                box-shadow: 0 0 15px #ffffff, 0 0 30px #ffffff !important;
              }
            `
        },
    ];

    // Create style element to hold theme CSS
    let styleEl = document.createElement('style');
    document.head.appendChild(styleEl);

    let currentThemeIndex = -1;

    // Create movable button
    const btn = document.createElement('button');
    btn.textContent = 'Change Theme';
    btn.style.position = 'fixed';
    btn.style.top = '20px';
    btn.style.left = '20px';
    btn.style.zIndex = 999999;
    btn.style.padding = '8px 12px';
    btn.style.backgroundColor = '#222';
    btn.style.color = 'white';
    btn.style.border = 'none';
    btn.style.borderRadius = '6px';
    btn.style.cursor = 'pointer';
    btn.style.userSelect = 'none';
    btn.style.boxShadow = '0 0 8px rgba(0,0,0,0.7)';
    btn.style.fontWeight = 'bold';

    document.body.appendChild(btn);

    // Dragging functionality for button
    let isDragging = false;
    let dragOffsetX, dragOffsetY;

    btn.addEventListener('mousedown', e => {
        isDragging = true;
        dragOffsetX = e.clientX - btn.offsetLeft;
        dragOffsetY = e.clientY - btn.offsetTop;
        btn.style.transition = 'none'; // disable transition during drag
    });

    document.addEventListener('mouseup', e => {
        isDragging = false;
        btn.style.transition = ''; // re-enable transition
    });

    document.addEventListener('mousemove', e => {
        if (isDragging) {
            let x = e.clientX - dragOffsetX;
            let y = e.clientY - dragOffsetY;
            // Clamp position inside viewport
            x = Math.min(window.innerWidth - btn.offsetWidth, Math.max(0, x));
            y = Math.min(window.innerHeight - btn.offsetHeight, Math.max(0, y));
            btn.style.left = x + 'px';
            btn.style.top = y + 'px';
        }
    });

    function applyTheme(index) {
        if(index < 0 || index >= neonThemes.length) return;
        styleEl.textContent = neonThemes[index].css;
        btn.textContent = `Theme: ${neonThemes[index].name}`;
    }

    // Cycle themes on button click
    btn.addEventListener('click', () => {
        currentThemeIndex = (currentThemeIndex + 1) % neonThemes.length;
        applyTheme(currentThemeIndex);
    });

    // Optionally apply the first theme on load
    currentThemeIndex = 0;
    applyTheme(currentThemeIndex);

})();
