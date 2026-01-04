// ==UserScript==
// @name         Diep.io Prerequisite [X-15]
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Preset themes & builds; net predict movement button & anti-afk | Keybind: [x] Toggles visibility of buttons.
// @author       x15diep
// @match        https://diep.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/504963/Diepio%20Prerequisite%20%5BX-15%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/504963/Diepio%20Prerequisite%20%5BX-15%5D.meta.js
// ==/UserScript==

//idkHowtocode
    (function() {
    'use strict';
    function applySettings() {
    input.execute('ren_fps true');
    input.execute('ren_raw_health_values true');
    }
    function waitForGame() {
    if (window.input && input.execute) {
    applySettings();
    } else {
    setTimeout(waitForGame, 100);
    }
    }
    waitForGame();
    function createElement(tag, id, style, innerHTML) {
    const element = document.createElement(tag);
    element.id = id;
    Object.assign(element.style, style);
    element.innerHTML = innerHTML;
    return element;
    }
    const menuStyle = {
    position: 'fixed',
    left: '20px',
    top: '50%',
    transform: 'translateY(-50%)',
    width: '175px',
    height: '400px',
    backgroundColor: 'rgba(0, 0, 0, 0.73)',
    color: 'white',
    padding: '25px',
    zIndex: '1000',
    borderRadius: '15px',
    display: 'none',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'flex-start'
    };
    const menuDiv = createElement('div', 'popupMenu', menuStyle, `
    <p id="closeX15" style="font-size: 30px; cursor: pointer;">[X-15] Menu</p>
    <p id="x15" style="cursor: pointer; color: lightblue;">[X-15] Build</p>
    <p id="kitsune" style="cursor: pointer; color: red;">Kitsune Build</p>
    <p id="glass" style="cursor: pointer; color: pink;">Glass Build</p>
    <p id="neonGlass" style="cursor: pointer; color: purple;">Neon Theme</p>
    <p id="dark" style="cursor: pointer; color: grey;">Dark Theme</p>
    <p id="DefaultTheme" style="cursor: pointer; color: yellow;">Default Theme</p>
    `);
    document.body.appendChild(menuDiv);
    function createButton(id, text, left) {
    const button = createElement('button', id, {
    position: 'fixed',
    left: left,
    top: '20px',
    zIndex: '1001'
    }, text);
    document.body.appendChild(button);
    return button;
    }
    const toggleButton = createButton('menuButton', 'Open Menu', '20px');
    const movementButton = createButton('movementButton', 'Net Predict is False', '140px');
    const trollButton = createButton('trollButton', 'Enable Anti-AFK', '300px');
    function createTooltip(text, element) {
    const tooltip = createElement('div', '', {
    position: 'absolute',
    backgroundColor: '#333',
    color: '#fff',
    padding: '5px',
    borderRadius: '3px',
    fontSize: '12px',
    whiteSpace: 'nowrap',
    display: 'none',
    zIndex: '1001'
    });
    tooltip.textContent = text;
    document.body.appendChild(tooltip);
    element.addEventListener('mouseover', () => {
    tooltip.style.display = 'block';
    const rect = element.getBoundingClientRect();
    tooltip.style.left = `${rect.left}px`;
    tooltip.style.top = `${rect.bottom + 5}px`;
    });
    element.addEventListener('mouseout', () => {
    tooltip.style.display = 'none';
    });
    } 
    const menuItems = [
    { id: 'closeX15', text: 'Close Menu' },
    { id: 'x15', text: '0/0/0/5/7/7/7/7' },
    { id: 'kitsune', text: '1/0/2/2/7/7/7/7' },
    { id: 'glass', text: '0/0/0/7/7/7/7/5' },
    { id: 'neonGlass', text: 'A Dark Neon Theme' },
    { id: 'dark', text: 'A Grayed Out Theme' },
    { id: 'DefaultTheme', text: 'Most likely the Default Theme' }
    ]; 
    menuItems.forEach(item => {
    const element = document.getElementById(item.id);
    if (element) {
    createTooltip(item.text, element);
    }
    });
    function toggleMenuVisibility() {
    if (menuDiv.style.display === 'none' || menuDiv.style.display === '') {
    menuDiv.style.display = 'flex';
    toggleButton.textContent = 'Close Menu';
    } else {
    menuDiv.style.display = 'none';
    toggleButton.textContent = 'Open Menu';
    }
    }
    toggleButton.addEventListener('click', toggleMenuVisibility);
    document.addEventListener('keydown', function(event) {

    if (event.key === 'x' || event.key === 'X') {
    const isHidden = toggleButton.style.display === 'none' || toggleButton.style.display === '';
    toggleButton.style.display = isHidden ? 'block' : 'none';
    movementButton.style.display = isHidden ? 'block' : 'none';
    trollButton.style.display = isHidden ? 'block' : 'none';
    if (menuDiv.style.display === 'flex') {
    menuDiv.style.display = 'none';
    toggleButton.textContent = 'Open Menu';
    }
    }
    });
    let isMovement = false;
    movementButton.addEventListener('click', function() {
    if (isMovement) {
    input.execute('net_predict_movement false');
    movementButton.textContent = 'Net Predict Is False';
    } else {
    input.execute('net_predict_movement true');
    movementButton.textContent = 'Net Predict Is True';
    }
    isMovement = !isMovement;
    });
    function simulateKeyPress(keyCode) {
    const event = new KeyboardEvent('keydown', { keyCode: keyCode, which: keyCode });
    document.dispatchEvent(event);
    }
    function simulateKeyRelease(keyCode) {
    const event = new KeyboardEvent('keyup', { keyCode: keyCode, which: keyCode });
    document.dispatchEvent(event);
    }
    function simulateSpinning() {
    const keys = [87, 65, 83, 68]; // W, A, S, D key codes
    let currentIndex = 0;
    function spin() {
    simulateKeyPress(keys[currentIndex]);
    setTimeout(() => {
    simulateKeyRelease(keys[currentIndex]);
    currentIndex = (currentIndex + 1) % keys.length;
    setTimeout(spin, 100); // Adjust delay to control speed
    }, 100); // Adjust delay to control press duration
    }
    spin();
    }
    let intervalId = null;
    trollButton.addEventListener('click', function() {
    if (intervalId === null) {
    intervalId = setInterval(simulateSpinning, 10000); // Adjust interval for frequency
    trollButton.textContent = 'Disable Anti-AFK';
    } else {
    clearInterval(intervalId);
    intervalId = null;
    trollButton.textContent = 'Enable Anti-AFK';
    }
    });
    const closeX15 = document.getElementById('closeX15');
    closeX15.addEventListener('click', toggleMenuVisibility);  
    const x15 = document.getElementById('x15');
    x15.addEventListener('click', () => input.execute('game_stats_build 656567778556645885656447878784784'));  //lazy 2 fix but works
    const kitsune = document.getElementById('kitsune');
    kitsune.addEventListener('click', () => input.execute('game_stats_build 656567778556645885656347878783781')); //lazy 2 fix but works
    const glass = document.getElementById('glass');
    glass.addEventListener('click', () => input.execute('game_stats_build 656567778556645845656447878784744'));  //lazy 2 fix but works 
    const neonGlass = document.getElementById('neonGlass');
    neonGlass.addEventListener('click', function() {
    input.execute('ui_replace_colors 0x43FFF9 0x82FF43 0xFF4343 0xFFDE43 0x437FFF 0x8543ff 0xF943FF 0xFCAD76');
    input.execute('ren_grid_base_alpha 0'); // No Grid
    input.execute('ren_stroke_soft_color_intensity 1'); // Black Outlines
    input.execute('ren_stroke_solid_color 0'); // Black Outlines
    input.execute('ren_background_color 0'); // Black Background
    input.execute('net_replace_color 1 0x999999'); // BarrelColor
    input.execute('net_replace_color 3 0x00FFFF'); // Neon Cyan Team
    input.execute('net_replace_color 4 0xFF3131'); // Neon Red Team
    input.execute('net_replace_color 8 0xCFFF04'); // Neon Yellow Square
    input.execute('net_replace_color 9 0xff073a'); // Neon Red Triangle
    input.execute('net_replace_color 10 0xFF00FF'); // Neon Pink Pentagon
    });
    const dark = document.getElementById('dark');
    dark.addEventListener('click', function() {
    input.execute('ui_replace_colors 0x252525 0x252525 0x252525 0x252525 0x252525 0x252525 0x252525 0x252525');
    input.set_convar("ren_background_color", "0x696969");
    input.set_convar("ren_grid_base_alpha", "0");
    input.execute("ren_stroke_soft_color_intensity", "-100");
    input.execute("ren_stroke_solid_color", "true");
    input.execute('net_replace_color 0 0xFFFFFF');
    input.execute('net_replace_color 1 0x111111');
    input.execute('net_replace_color 2 0x00AAFF');
    input.execute('net_replace_color 3 0x00AAFF');
    input.execute('net_replace_color 4 0xEF4609');
    input.execute('net_replace_color 5 0x00FFAA');
    input.execute('net_replace_color 6 0xFF00AA');
    input.execute('net_replace_color 7 0x111111');
    input.execute('net_replace_color 8 0x111111');
    input.execute('net_replace_color 9 0x111111');
    input.execute('net_replace_color 10 0x111111');
    input.execute('net_replace_color 11 0x111111');
    input.execute('net_replace_color 12 0x111111');
    input.execute('net_replace_color 13 0x111111');
    input.execute('net_replace_color 14 0x111111');
    input.execute('net_replace_color 15 0xFFAA00');
    input.execute('net_replace_color 16 0x111111');
    input.execute('net_replace_color 17 0x111111');
    input.execute('net_replace_color 18 0x111111');
    input.execute("ren_health_color", "0xFFFFFF");
    });
    const defaultTheme = document.getElementById('DefaultTheme');
    defaultTheme.addEventListener('click', function() {
    input.execute('net_replace_colors 0x555555 0x999999 0x00B2E1 0x00B2E1 0xF14E54 0xBF7FF5 0x00E16E 0x8AFF69 0xFFE869 0xFC7677 0x768DFC 0xF177DD 0xFFE869 0x43FF91 0xBBBBBB 0xF14E54 0xFCC376 0xC0C0C0');
    input.execute('ui_replace_colors 0x43FFF9 0x82FF43 0xFF4343 0xFFDE43 0x437FFF 0x8543ff 0xF943FF 0xFCAD76');
    input.execute('ren_grid_base_alpha 0.2'); // Light grid
    input.execute('ren_stroke_soft_color_intensity 0.2'); // Light outlines
    input.execute('ren_stroke_solid_color 0'); // Light outlines
    input.execute('ren_background_color 0xCCCCCC');
    });
    })();