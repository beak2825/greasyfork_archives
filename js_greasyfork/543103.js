// ==UserScript==
// @name         Responsive On-Screen Keyboard (with Shift, Symbols, Hide/Show)
// @namespace    http://tampermonkey.net/
// @version      1.925
// @description  On-screen keyboard with Shift, ESC, TAB, CTRL, symbol toggle, responsive layout, hide/show buttons, and 0.2 opacity — mobile-style behavior and working key injection.
// @author
// @match        https://crawl.nemelex.cards/*
// @match        https://terminal.nemelex.cards/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/543103/Responsive%20On-Screen%20Keyboard%20%28with%20Shift%2C%20Symbols%2C%20HideShow%29.user.js
// @updateURL https://update.greasyfork.org/scripts/543103/Responsive%20On-Screen%20Keyboard%20%28with%20Shift%2C%20Symbols%2C%20HideShow%29.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let shiftOn = false;
    let symbolsOn = false;

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

    const style = document.createElement("style");
    style.innerHTML = `
        // Modifying popup for mobile because of width being too big

        .ui-popup-overlay {
            // max-width: 100vw !important; /* Full viewport width */
        }

        .ui-popup-inner {
            min-width: 100vw !important; /* Full viewport width */
            font-size: 0.6em !important;
            overflow-x: auto !important; /* Allow horizontal scrolling */
        }

        // #onScreenKeyboard {
        //     position: fixed;
        //     bottom: 0;
        //     left: 0;
        //     width: 100%;
        //     opacity: 0.2;
        //     z-index: 10001;
        //     display: flex;
        //     flex-wrap: wrap;
        //     justify-content: center;
        //     background-color: #000;
        //     color: white;
        //     font-family: sans-serif;
        //     pointer-events: auto;
        // }

        // #onScreenKeyboard button {
        //     margin: 3px;
        //     padding: 10px 12px;
        //     font-size: 14px;
        //     background-color: #444;
        //     color: white;
        //     border: none;
        //     border-radius: 4px;
        //     min-width: 40px;
        //     pointer-events: auto;
        // }

        #onScreenKeyboardOverlay {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;      /* Full viewport width */
            background: rgba(0, 0, 0, 0); /* Transparent background */
            z-index: 10000;   /* Just below the keyboard */
            pointer-events: auto; /* Allow pointer events */
        }

        #onScreenKeyboard {
            position: fixed;
            left: 0;
            width: 100%;      /* Always full viewport width */
            opacity: 0.2;
            z-index: 10001;
            display: flex;
            flex-direction: column;
            justify-content: center;
            background-color: #000;
            color: white;
            font-family: sans-serif;
            pointer-events: auto;
        }

        #onScreenKeyboard > div {
            display: flex;
            flex: 1 1 0;
            justify-content: stretch;
            width: 100%;
        }

        #onScreenKeyboard button {
            margin: 3px;
            flex: 1 1 0;
            padding: 0.5em 0;
            font-size: 2em;     /* Responsive font size */
            background-color: #444;
            color: white;
            border: none;
            border-radius: 4px;
            min-width: 0;          /* Allow buttons to shrink */
            // min-height: 6vh;       /* Responsive min height */
            pointer-events: auto;
        }
        #onScreenKeyboard button.active {
            background-color: #888;
        }

        #hideKeyboardBtn, #showKeyboardBtn {
            position: fixed;
            right: 10px;
            // bottom: 10px; /* Adjusted to be above the keyboard */
            // bottom: calc(25vh + 100px + 20px); 
            top: 100px;
            z-index: 10000;
            padding: 5px 10px;
            background-color: #333;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            opacity: 0.7;
        }

        #hideKeyboardBtn {
          //  bottom: calc(100px + 10px);
        }

        #showKeyboardBtn {
            //bottom: 20px;
            display: none;
        }

        #onScreenKeyboard {
            flex-direction: column;
            align-items: center;
        }
        @media (orientation: portrait) {
            #onScreenKeyboard {
                // flex-direction: column;
                // align-items: center;
                bottom: 100px;

            }
        }

        @media (orientation: landscape) {
            #onScreenKeyboard {
                // flex-direction: row;
                // flex-wrap: wrap;
                bottom: 0px;

            }

            #onScreenKeyboard button {
                font-size: 1em;

            }
        }
    `;
    document.head.appendChild(style);

    const layoutDefault = [
        ['ESC', 'TAB', 'CTRL', 'BSP', 'ENTER'],
        ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
        ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
        ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
        ['SYM', 'SPACE', 'SHIFT']
    ];

    const layoutSymbols = [
        ['ESC', 'TAB', 'CTRL', 'BSP', 'ENTER'],
        ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
        ['@', '#', '$', '&', '*', '(', ')', '-', '_'],
        ['!', '?', ':', ';', '"', '\'', '/', '.', ','],
        ['ABC', 'SPACE', 'SHIFT']
    ];

    const keyboardOverlay = document.createElement('div');
    keyboardOverlay.id = 'onScreenKeyboardOverlay';

    const keyboard = document.createElement('div');
    keyboard.id = 'onScreenKeyboard';

    document.body.appendChild(keyboardOverlay);


    // keyboard.style.touchAction = 'manipulation';

    // keyboard.addEventListener('touchstart', function(e) {
    //     if (e.target.tagName === 'BUTTON') e.preventDefault();
    // }, { passive: false });

    // keyboard.addEventListener('touchend', function(e) {
    //     if (e.target.tagName === 'BUTTON') e.preventDefault();
    // }, { passive: false });

    const hideBtn = document.createElement('button');
    hideBtn.id = 'hideKeyboardBtn';
    hideBtn.textContent = 'Hide Keyboard';
    hideBtn.onclick = () => {
        keyboard.style.display = 'none';
        hideBtn.style.display = 'none';
        showBtn.style.display = 'block';
    };

    const showBtn = document.createElement('button');
    showBtn.id = 'showKeyboardBtn';
    showBtn.textContent = 'Show Keyboard';
    showBtn.onclick = () => {
        keyboard.style.display = 'flex';
        hideBtn.style.display = 'block';
        showBtn.style.display = 'none';
    };

    document.body.appendChild(keyboard);
    document.body.appendChild(hideBtn);
    document.body.appendChild(showBtn);

    function renderKeyboard() {
        keyboard.innerHTML = ''; // Clear
        const layout = symbolsOn ? layoutSymbols : layoutDefault;

        layout.forEach(row => {
            const rowDiv = document.createElement('div');
            row.forEach(key => {
                const btn = document.createElement('button');
                btn.textContent = shiftOn && key.length === 1 ? key.toUpperCase() : key;
                btn.dataset.key = key;
                if ((key === 'SHIFT' && shiftOn) || ((key === 'SYM' && symbolsOn) || (key === 'ABC' && !symbolsOn))) {
                    btn.classList.add('active');
                }
                btn.onclick = () => handleKeyPress(key);
                rowDiv.appendChild(btn);
            });
            keyboard.appendChild(rowDiv);
        });
    }

    function handleKeyPress(key) {
        if (key === 'SHIFT') {
            shiftOn = !shiftOn;
            renderKeyboard();
            return;
        }

        if (key === 'SYM' || key === 'ABC') {
            symbolsOn = key === 'SYM';
            shiftOn = false;
            renderKeyboard();
            return;
        }

        simulateKey(key);
        if (shiftOn && key.length === 1) {
            shiftOn = false;
            renderKeyboard();
        }
    }

function simulateKey(key) {

    const target = document.querySelector('.xterm-helper-textarea, .terminal, .xterm, #terminal, canvas, body');
    if (!target) {
        console.warn('No suitable target to send keyboard input');
        return;
        }
    let finalKey;
    let keyCode;
    let which;
    let code; // For the 'code' property

    switch (key) {
        case 'SPACE':
            finalKey = ' ';
            keyCode = 32; // Spacebar
            which = 32;
            code = 'Space';
            break;
        case 'ENTER':
            finalKey = 'Enter';
            keyCode = 13; // Enter key
            which = 13;
            code = 'Enter';
            break;
        case 'TAB':
            finalKey = 'Tab';
            keyCode = 9; // Tab key
            which = 9;
            code = 'Tab';
            break;
        case 'BACKSPACE':
            finalKey = 'Backspace';
            keyCode = 8; // Backspace key
            which = 8;
            code = 'Backspace';
            break;
        case 'ESC':
            finalKey = 'Escape';
            keyCode = 27; // Escape key
            which = 27;
            code = 'Escape'; // The 'code' property for Escape
            break;
        case 'CTRL':
            // If you are only handling 'CTRL' as a modifier, you might just 'return;'
            // If you want to dispatch a Ctrl key press event, you'd need its specific keycode too.
            // For 'keydown' of Ctrl itself:
            finalKey = 'Control'; keyCode = 17; which = 17; code = 'ControlLeft';
            return;
        default:
            finalKey = shiftOn ? key.toUpperCase() : key;
            keyCode = finalKey.charCodeAt(0);
            which = finalKey.charCodeAt(0);
            code = finalKey.length === 1 && finalKey.match(/[a-zA-Z0-9]/) ? 'Key' + finalKey.toUpperCase() : finalKey;
    }

    const eventOptions = {
        bubbles: true,
        cancelable: true,
        key: finalKey,
        code: code,
        keyCode: keyCode,
        which: which
    };

    ['keydown', 'keypress', 'keyup'].forEach(type => {
        const evt = new KeyboardEvent(type, eventOptions);
        target.dispatchEvent(evt);
    });
}

    renderKeyboard();
})();
