// ==UserScript==
// @name         Bloxd.io Mod Menu Example
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds a floating mod menu for Bloxd.io with toggles for Flight and God Mode
// @author       Example
// @match        *://bloxd.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534352/Bloxdio%20Mod%20Menu%20Example.user.js
// @updateURL https://update.greasyfork.org/scripts/534352/Bloxdio%20Mod%20Menu%20Example.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- Menu Styles ---
    const style = document.createElement('style');
    style.textContent = `
    #modMenuToggle {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 10000;
        padding: 8px 16px;
        background: #222;
        color: #fff;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 16px;
    }
    #modMenu {
        display: none;
        position: fixed;
        top: 60px;
        right: 20px;
        width: 220px;
        background: rgba(30,30,30,0.98);
        color: #fff;
        border-radius: 10px;
        box-shadow: 0 2px 12px rgba(0,0,0,0.3);
        z-index: 10001;
        padding: 18px 16px 12px 16px;
        font-family: sans-serif;
    }
    #modMenu h2 {
        margin: 0 0 12px 0;
        font-size: 20px;
        text-align: center;
        color: #ffeb3b;
    }
    .modMenuOption {
        margin-bottom: 12px;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }
    .modMenuOption label {
        font-size: 16px;
        cursor: pointer;
    }
    .modMenuOption input[type="checkbox"] {
        transform: scale(1.3);
        cursor: pointer;
    }
    `;
    document.head.appendChild(style);

    // --- Menu HTML ---
    const menuToggleBtn = document.createElement('button');
    menuToggleBtn.id = 'modMenuToggle';
    menuToggleBtn.textContent = 'Mod Menu';
    document.body.appendChild(menuToggleBtn);

    const menuDiv = document.createElement('div');
    menuDiv.id = 'modMenu';
    menuDiv.innerHTML = `
      <h2>Bloxd.io Mods</h2>
      <div class="modMenuOption">
        <label for="flightToggle">Flight</label>
        <input type="checkbox" id="flightToggle">
      </div>
      <div class="modMenuOption">
        <label for="godToggle">God Mode</label>
        <input type="checkbox" id="godToggle">
      </div>
    `;
    document.body.appendChild(menuDiv);

    // --- Menu Toggle Logic ---
    menuToggleBtn.onclick = () => {
        menuDiv.style.display = (menuDiv.style.display === 'block') ? 'none' : 'block';
    };

    // --- Mod Feature Variables ---
    let flightEnabled = false;
    let godEnabled = false;

    // --- Menu Option Logic ---
    document.getElementById('flightToggle').addEventListener('change', function() {
        flightEnabled = this.checked;
        // Insert your flight logic here
        alert('Flight ' + (flightEnabled ? 'enabled' : 'disabled'));
    });

    document.getElementById('godToggle').addEventListener('change', function() {
        godEnabled = this.checked;
        // Insert your god mode logic here
        alert('God Mode ' + (godEnabled ? 'enabled' : 'disabled'));
    });

    // --- Example: Hook into game logic here ---
    // You would need to implement the actual functionality for flight/god mode
    // This menu simply toggles the variables and shows alerts for demonstration

})();
