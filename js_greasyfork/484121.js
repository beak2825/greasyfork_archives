// ==UserScript==
// @name TurboType for Monkeytype 🤖
// @author HiraganaDev
// @description This script automates typing tests on Monkeytype by simulating character input at random intervals when the "CtrlLeft" key is pressed. Keyboard events are intercepted and transmitted to the input field, providing a configurable automated typing test experience. The test can be started or stopped through a menu accessible with the "CtrlLeft" key.
// @icon https://avatars.githubusercontent.com/u/104658077?s=280&v=4
// @version 2.0
// @match *://monkeytype.com/*
// @run-at document-start
// @grant none
// @namespace https://greasyfork.org/users/1239133
// @downloadURL https://update.greasyfork.org/scripts/484121/TurboType%20for%20Monkeytype%20%F0%9F%A4%96.user.js
// @updateURL https://update.greasyfork.org/scripts/484121/TurboType%20for%20Monkeytype%20%F0%9F%A4%96.meta.js
// ==/UserScript==
/* jshint esversion:6 */

(function() {
    'use strict';

    // Minimum and maximum delay (ms)
    let currentDelay = 10;
    const MIN_DELAY = 5;
    const MAX_DELAY = 50;
    const TOGGLE_KEY = "Slash";
    const MENU_KEY = "ControlLeft"; // Change to "ControlRight" if needed
    const log = console.log;

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let toggle = true;
    let isMenuOpen = false;
    let menu = null;

    function canType() {
        const typingTest = document.getElementById("typingTest");
        const isHidden = typingTest.classList.contains("hidden");
        if (isHidden) toggle = false;
        return toggle && !isHidden;
    }

    function getNextCharacter() {
        const currentWord = document.querySelector(".word.active");
        for (const letter of currentWord.children) {
            if (letter.className === "") return letter.textContent;
        }
        return " ";
    }

    const InputEvents = {};
    function pressKey(key) {
        const wordsInput = document.getElementById("wordsInput");
        const KeyboardEvent = Object.assign({}, DEFAULT_INPUT_OPTIONS, { target: wordsInput, data: key });
        const InputEvent = Object.assign({}, DEFAULT_KEY_OPTIONS, { target: wordsInput, key: key });

        wordsInput.value += key;
        InputEvents.beforeinput(InputEvent);
        InputEvents.input(InputEvent);
        InputEvents.keyup(KeyboardEvent);
    }

    function typeCharacter() {
        if (!canType()) {
            log("STOPPED TYPING TEST");
            return;
        }

        pressKey(getNextCharacter());
        setTimeout(typeCharacter, random(currentDelay, currentDelay + 10));
    }

    function createMenu() {
        if (!isMenuOpen) {
            menu = document.createElement('div');
            menu.id = 'autoBotMenu';
            menu.innerHTML = `
            <div class="menu-container">
                <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 10px;">Monkeytype Speeder</h2>
                <p style="color: #aaa; font-size: 14px; margin-bottom: 15px;">Type faster with the Monkeytype Speeder script. Customize your typing speed and toggle auto-typing bot with ease.</p>
                <button id="autoBotBtn" class="menu-btn" style="cursor: pointer;">AutoBot</button>
                <div style="margin-top: 10px;">
                    <button id="increaseSpeedBtn" class="menu-btn" style="margin-right: 5px; cursor: pointer;">+</button>
                    <button id="decreaseSpeedBtn" class="menu-btn" style="cursor: pointer;">-</button>
                </div>
                <p id="speedText" style="color: #ffffff; font-size: 14px; margin-top: 10px;">Current Speed: ${currentDelay}</p>
                <button id="creditsBtn" class="menu-btn" style="margin-top: 15px; cursor: pointer;">Credits</button>
                <p style="color: #aaa; font-size: 14px; margin-top: 15px;">Tips:</p>
                <ul style="list-style: none; padding: 0; color: #aaa; font-size: 14px;">
                    <li>&#8226; Use the Ctrl shortcut to open the menu.</li>
                    <li>&#8226; Press / to activate or deactivate the AutoBot.</li>
                    <li>&#8226; Use the +/- buttons to adjust the speed.</li>
                    <li>&#8226; Enjoy an enhanced typing experience!</li>
                </ul>
            </div>
        `;

            menu.style.position = 'fixed';
            menu.style.top = '50%';
            menu.style.left = '50%';
            menu.style.transform = 'translate(-50%, -50%)';
            menu.style.backgroundColor = '#333'; // Gris foncé
            menu.style.padding = '20px';
            menu.style.zIndex = '1000';
            menu.style.borderRadius = '10px';
            menu.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
            menu.style.opacity = '0';
            menu.style.transition = 'opacity 0.3s ease, transform 0.3s ease';

            document.body.appendChild(menu);

            setTimeout(() => {
                menu.style.opacity = '1';
                menu.style.transform = 'translate(-50%, -50%) scale(1)';
            }, 10);

            const autoBotBtn = document.getElementById('autoBotBtn');
            autoBotBtn.addEventListener('click', toggleAutoBot);
            autoBotBtn.addEventListener('mouseover', () => autoBotBtn.style.backgroundColor = '#2980b9');
            autoBotBtn.addEventListener('mouseout', () => autoBotBtn.style.backgroundColor = '#3498db');

            const increaseSpeedBtn = document.getElementById('increaseSpeedBtn');
            increaseSpeedBtn.addEventListener('click', increaseSpeed);
            increaseSpeedBtn.addEventListener('mouseover', () => increaseSpeedBtn.style.backgroundColor = '#218c54');
            increaseSpeedBtn.addEventListener('mouseout', () => increaseSpeedBtn.style.backgroundColor = '#27ae60');

            const decreaseSpeedBtn = document.getElementById('decreaseSpeedBtn');
            decreaseSpeedBtn.addEventListener('click', decreaseSpeed);
            decreaseSpeedBtn.addEventListener('mouseover', () => decreaseSpeedBtn.style.backgroundColor = '#c0392b');
            decreaseSpeedBtn.addEventListener('mouseout', () => decreaseSpeedBtn.style.backgroundColor = '#e74c3c');

            const creditsBtn = document.getElementById('creditsBtn');
            creditsBtn.addEventListener('click', showCredits);
            creditsBtn.addEventListener('mouseover', () => creditsBtn.style.backgroundColor = '#34495e');
            creditsBtn.addEventListener('mouseout', () => creditsBtn.style.backgroundColor = '#333');

            isMenuOpen = true;
        } else {
            closeMenu();
        }
    }

    function showCredits() {
        const creditsModal = document.createElement('div');
        creditsModal.id = 'creditsModal';
        creditsModal.innerHTML = `
            <div style="background-color: rgba(0, 0, 0, 0.8); position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 1100; display: flex; justify-content: center; align-items: center;">
                <div style="background-color: #fff; border-radius: 15px; max-width: 600px; padding: 20px; text-align: center; box-shadow: 0 0 20px rgba(0, 0, 0, 0.8);">
                    <h2 style="color: #333; font-size: 24px; margin-bottom: 10px;">Crédits</h2>
                    <p style="color: #555; font-size: 16px;">Script created by HiraganaDev</p>
                    <p style="color: #555; font-size: 16px;">Version 2.0</p>
                    <button id="closeCreditsBtn" style="margin-top: 20px; padding: 10px 20px; font-size: 16px; background-color: #3498db; color: #ffffff; border: none; border-radius: 5px; cursor: pointer;">Fermer</button>
                </div>
            </div>
        `;

        document.body.appendChild(creditsModal);

        const closeCreditsBtn = document.getElementById('closeCreditsBtn');
        closeCreditsBtn.addEventListener('click', () => creditsModal.remove());
    }

    function closeMenu() {
        if (isMenuOpen) {
            menu.style.opacity = '0';
            menu.style.transform = 'translate(-50%, -50%) scale(0.9)';
            setTimeout(() => {
                if (menu) {
                    menu.remove();
                }
            }, 300);
            isMenuOpen = false;
        }
    }

    function toggleAutoBot() {
        toggle = !toggle;
        if (toggle) {
            log("STARTED TYPING TEST");
            typeCharacter();
        }
        closeMenu();
    }

    function increaseSpeed() {
        currentDelay = Math.max(currentDelay - 5, MIN_DELAY);
        updateSpeedText();
        log("Increased Speed:", currentDelay);
    }

    function decreaseSpeed() {
        currentDelay = Math.min(currentDelay + 5, MAX_DELAY);
        updateSpeedText();
        log("Decreased Speed:", currentDelay);
    }

    function updateSpeedText() {
        const speedText = document.getElementById('speedText');
        if (speedText) {
            speedText.textContent = `Current Speed: ${currentDelay}`;
        }
    }

    window.addEventListener("keydown", function(event) {
        if (event.code === TOGGLE_KEY) {
            event.preventDefault();
            if (event.repeat) return;
            toggle = !toggle;
            if (toggle) {
                log("STARTED TYPING TEST");
                typeCharacter();
            }
        } else if (event.code === MENU_KEY) {
            event.preventDefault();
            createMenu();
        }
    });

    function hook(element) {
        element.addEventListener = new Proxy(element.addEventListener, {
            apply(target, _this, args) {
                const [type, listener, ...options] = args;
                if (_this.id === "wordsInput") {
                    InputEvents[type] = listener;
                }
                return target.apply(_this, args);
            }
        });
    }

    hook(HTMLInputElement.prototype);

    const DEFAULT_KEY_OPTIONS = {
        key: "", code: "", keyCode: 0, which: 0, isTrusted: true, ctrlKey: false,
        bubbles: true, cancelBubble: false, cancelable: true, charCode: 0,
        composed: true, metaKey: false, shiftKey: false, altKey: false,
        currentTarget: null, defaultPrevented: false,
        detail: 0, eventPhase: 0, isComposing: false, location: 0,
        path: null, repeat: false, returnValue: true, srcElement: null,
        target: null, timeStamp: 6338.5, type: "", view: window,
    };

    const DEFAULT_INPUT_OPTIONS = {
        isTrusted: true, bubbles: true, cancelBubble: false, cancelable: false,
        composed: true, data: "", dataTransfer: null, defaultPrevented: false,
        detail: 0, eventPhase: 0, inputType: "insertText", isComposing: false,
        path: null, returnValue: true, sourceCapabilities: null, srcElement: null,
        target: null, currentTarget: null, timeStamp: 11543, type: "input",
        view: null, which: 0
    };
})();
