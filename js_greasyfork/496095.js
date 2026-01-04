// ==UserScript==
// @name         Blooket Answer Button Clicker with dat.GUI
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  Simulates a click on Blooket answer buttons using configurable keys.
// @author       Kaz
// @match        *://*.blooket.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/dat-gui/0.7.7/dat.gui.min.js
// @license      apache
// @downloadURL https://update.greasyfork.org/scripts/496095/Blooket%20Answer%20Button%20Clicker%20with%20datGUI.user.js
// @updateURL https://update.greasyfork.org/scripts/496095/Blooket%20Answer%20Button%20Clicker%20with%20datGUI.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Default keybindings
    let keyBindings = {
        answer0: '1',
        answer1: '2',
        answer2: '3',
        answer3: '4'
    };

    // Function to simulate a click event
    function simulateClick(element) {
        if (element) {
            element.click();
            console.log(`Clicked: ${element.id}`);
        }
    }

    // Event listener for keydown events
    document.addEventListener('keydown', function(event) {
        console.log(`Key pressed: ${event.key}`);
        switch (event.key) {
            case keyBindings.answer0:
                simulateClick(document.getElementById('answer0'));
                break;
            case keyBindings.answer1:
                simulateClick(document.getElementById('answer1'));
                break;
            case keyBindings.answer2:
                simulateClick(document.getElementById('answer2'));
                break;
            case keyBindings.answer3:
                simulateClick(document.getElementById('answer3'));
                break;
            default:
                break;
        }
    });

    // Setup dat.GUI
    const gui = new dat.GUI({ name: "Kaz's Keybinds For Blooket v1.0.1" });
    gui.domElement.style.userSelect = 'none'; // Prevent text selection on the GUI

    const keybindsFolder = gui.addFolder('Keybinds');
    keybindsFolder.add(keyBindings, 'answer0').name('Yellow/Top Left').onChange(function(value) {
        keyBindings.answer0 = value;
        console.log(`Keybind changed: answer0 -> ${value}`);
    });
    keybindsFolder.add(keyBindings, 'answer1').name('Blue/Top Right').onChange(function(value) {
        keyBindings.answer1 = value;
        console.log(`Keybind changed: answer1 -> ${value}`);
    });
    keybindsFolder.add(keyBindings, 'answer2').name('Green/Bottom Left').onChange(function(value) {
        keyBindings.answer2 = value;
        console.log(`Keybind changed: answer2 -> ${value}`);
    });
    keybindsFolder.add(keyBindings, 'answer3').name('Red/Bottom Right').onChange(function(value) {
        keyBindings.answer3 = value;
        console.log(`Keybind changed: answer3 -> ${value}`);
    });
    keybindsFolder.open();

    console.log('dat.GUI setup complete');
})();
