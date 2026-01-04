// ==UserScript==
// @name         Voxiom.io Key and Mouse Tracker // For Lives
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Keyboard Tracker
// @author       Whoami
// @match        *://voxiom.io/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/506317/Voxiomio%20Key%20and%20Mouse%20Tracker%20%20For%20Lives.user.js
// @updateURL https://update.greasyfork.org/scripts/506317/Voxiomio%20Key%20and%20Mouse%20Tracker%20%20For%20Lives.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // CSS styles
    const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap');
    body {
        margin: 0;
        padding: 0;
    }
    #initialScreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
    }
    #initialScreenText {
        font-family: 'Montserrat', sans-serif;
        font-size: 48px;
        color: white;
        cursor: pointer;
    }
    #keyMouseMenu {
        position: fixed;
        top: 50%;
        left: 0;
        transform: translateY(-50%);
        font-family: 'Montserrat', sans-serif;
        font-size: 18px;
        color: white;
        background-color: rgba(0, 0, 0, 0.8);
        padding: 20px;
        border-radius: 10px;
        display: none;
        z-index: 1000;
    }
    #keyboard {
        display: grid;
        grid-template-columns: repeat(14, 30px);
        gap: 5px;
        justify-content: center;
        margin-top: 20px;
    }
    .key {
        width: 30px;
        height: 30px;
        background-color: white;
        color: black;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 5px;
        font-size: 12px;
        text-align: center;
    }
    .key.pressed {
        background-color: red;
    }
    `;

    // Add styles to the document
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Create initial screen
    const initialScreen = document.createElement('div');
    initialScreen.id = 'initialScreen';
    const initialScreenText = document.createElement('div');
    initialScreenText.id = 'initialScreenText';
    initialScreenText.innerText = '[L] To Show/Hide Keyboard';
    initialScreen.appendChild(initialScreenText);
    document.body.appendChild(initialScreen);

    // Create key and mouse menu
    const keyMouseMenu = document.createElement('div');
    keyMouseMenu.id = 'keyMouseMenu';
    keyMouseMenu.innerHTML = '<div id="keyboard"></div>';
    document.body.appendChild(keyMouseMenu);

    // List of keys
    const keys = ['ESC', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'PRTSC',
                  '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'BACKSPACE',
                  'TAB', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', '[', ']', '\\',
                  'CAPSLOCK', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', ';', '\'', 'ENTER',
                  'SHIFT', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', ',', '.', '/', 'SHIFT',
                  'CTRL', 'WIN', 'ALT', 'SPACE', 'ALT', 'WIN', 'MENU', 'CTRL'];

    // Add keys to keyboard
    const keyboard = document.getElementById('keyboard');
    keys.forEach(key => {
        const keyDiv = document.createElement('div');
        keyDiv.className = 'key';
        keyDiv.innerText = key;
        keyDiv.dataset.key = key;
        keyboard.appendChild(keyDiv);
    });

    // Function to handle key presses
    function handleKeyPress(event) {
        const key = event.key.toUpperCase();
        const keyDiv = [...document.querySelectorAll('.key')].find(k => k.dataset.key === key);
        if (keyDiv) keyDiv.classList.add('pressed');
    }

    // Function to handle key releases
    function handleKeyRelease(event) {
        const key = event.key.toUpperCase();
        const keyDiv = [...document.querySelectorAll('.key')].find(k => k.dataset.key === key);
        if (keyDiv) keyDiv.classList.remove('pressed');
    }

    // Toggle menu visibility
    function toggleMenu() {
        if (keyMouseMenu.style.display === 'none') {
            keyMouseMenu.style.display = 'block';
            anime({
                targets: '#keyMouseMenu',
                opacity: [0, 1],
                duration: 500,
                easing: 'easeInOutQuad'
            });
        } else {
            anime({
                targets: '#keyMouseMenu',
                opacity: [1, 0],
                duration: 500,
                easing: 'easeInOutQuad',
                complete: function() {
                    keyMouseMenu.style.display = 'none';
                }
            });
        }
    }

    // Add event listeners
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyRelease);
    document.addEventListener('keydown', (event) => {
        if (event.key.toUpperCase() === 'L') toggleMenu();
    });

    // Initial screen animation
    initialScreenText.addEventListener('mouseover', () => {
        anime({
            targets: '#initialScreen',
            opacity: [1, 0],
            duration: 6000,
            easing: 'easeInOutQuad',
            complete: function() {
                initialScreen.style.display = 'none';
            }
        });
    });

})();
