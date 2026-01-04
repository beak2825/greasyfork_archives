// ==UserScript==
// @name         Snay.io Split/Feed Macro
// @namespace    http://tampermonkey.net/
// @version      3.4
// @description  Adjustable key macro for split/feed with customizable keys that save & load automatically, including Big Split Macro (Space → Quad order). Prevents activation while typing.
// @author       GravityG
// @match        https://www.snay.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529031/Snayio%20SplitFeed%20Macro.user.js
// @updateURL https://update.greasyfork.org/scripts/529031/Snayio%20SplitFeed%20Macro.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let gameKeys = {};
    let intervalId = null;
    let inputFocused = false; // Track if user is typing

    // Load saved settings or set defaults
    let macroSpeed = localStorage.getItem('macroSpeed') ? parseInt(localStorage.getItem('macroSpeed')) : 1000;
    let macroDelay = localStorage.getItem('macroDelay') ? parseInt(localStorage.getItem('macroDelay')) : 20;

    function getStoredKey(key, defaultKey) {
        return localStorage.getItem(key) || defaultKey;
    }

    function getUpdatedKeys() {
        return {
            macroKey: getStoredKey('macroKey', 'F'),
            macroActionKey: getStoredKey('macroActionKey', 'E'),
            quadSplitKey: getStoredKey('quadSplitKey', 'R'),
            secondaryMacroKey: getStoredKey('secondaryMacroKey', 'G'),
            bigSplitKey: getStoredKey('bigSplitKey', 'S')
        };
    }

    let keys = getUpdatedKeys();

    function triggerMacro() {
        if (inputFocused) return; // Prevent activation while typing

        let macroEventDown = new KeyboardEvent('keydown', { key: keys.macroActionKey, code: `Key${keys.macroActionKey}` });
        let quadEventDown = new KeyboardEvent('keydown', { key: keys.quadSplitKey, code: `Key${keys.quadSplitKey}` });

        let macroEventUp = new KeyboardEvent('keyup', { key: keys.macroActionKey, code: `Key${keys.macroActionKey}` });
        let quadEventUp = new KeyboardEvent('keyup', { key: keys.quadSplitKey, code: `Key${keys.quadSplitKey}` });

        window.dispatchEvent(macroEventDown);
        window.dispatchEvent(quadEventDown);

        setTimeout(() => {
            window.dispatchEvent(macroEventUp);
            window.dispatchEvent(quadEventUp);
        }, 50);
    }

    function triggerSecondaryMacro() {
        if (inputFocused) return; // Prevent activation while typing

        let spaceDown = new KeyboardEvent('keydown', { key: " ", code: "Space" });
        let spaceUp = new KeyboardEvent('keyup', { key: " ", code: "Space" });

        window.dispatchEvent(spaceDown);
        setTimeout(() => {
            window.dispatchEvent(spaceUp);
            setTimeout(triggerMacro, macroDelay);
        }, 20);
    }

    function triggerBigSplitMacro() {
        if (inputFocused) return; // Prevent activation while typing

        let spaceDown = new KeyboardEvent('keydown', { key: " ", code: "Space" });
        let spaceUp = new KeyboardEvent('keyup', { key: " ", code: "Space" });

        let quadDown = new KeyboardEvent('keydown', { key: keys.quadSplitKey, code: `Key${keys.quadSplitKey}` });
        let quadUp = new KeyboardEvent('keyup', { key: keys.quadSplitKey, code: `Key${keys.quadSplitKey}` });

        // Press Space Bar first
        window.dispatchEvent(spaceDown);
        setTimeout(() => {
            window.dispatchEvent(spaceUp);

            // After 20ms, press Quad Split
            setTimeout(() => {
                window.dispatchEvent(quadDown);
                setTimeout(() => window.dispatchEvent(quadUp), 50);
            }, 20);
        }, 50);
    }

    // Prevent macros while typing
    function preventMacroOnTyping() {
        document.addEventListener("focusin", (event) => {
            if (event.target.tagName === "INPUT" || event.target.tagName === "TEXTAREA") {
                inputFocused = true; // User is typing, disable macros
                console.log("Macros paused while typing.");
            }
        });

        document.addEventListener("focusout", () => {
            inputFocused = false; // User finished typing, re-enable macros
            console.log("Macros reactivated.");
        });
    }

    window.addEventListener('keydown', function(event) {
        keys = getUpdatedKeys();
        if (inputFocused) return; // Prevent activation while typing

        if (event.key.toUpperCase() === keys.macroKey && !gameKeys[keys.macroKey]) {
            gameKeys[keys.macroKey] = true;
            event.preventDefault();

            triggerMacro();
            intervalId = setInterval(triggerMacro, macroSpeed);
        }

        if (event.key.toUpperCase() === keys.secondaryMacroKey) {
            event.preventDefault();
            triggerSecondaryMacro();
        }

        if (event.key.toUpperCase() === keys.bigSplitKey) {
            event.preventDefault();
            triggerBigSplitMacro();
        }
    });

    window.addEventListener('keyup', function(event) {
        keys = getUpdatedKeys();
        if (event.key.toUpperCase() === keys.macroKey) {
            gameKeys[keys.macroKey] = false;
            clearInterval(intervalId);
            intervalId = null;
        }
    });

    function waitForModMenu() {
        const modMenu = document.getElementById('modmenu');
        if (modMenu) {
            createQuickSettings(modMenu);
        } else {
            setTimeout(waitForModMenu, 500);
        }
    }

    function createQuickSettings(modMenu) {
        let settingsContainer = document.createElement('div');
        settingsContainer.style.border = "0.1vw solid yellowgreen";
        settingsContainer.style.width = "100%";
        settingsContainer.innerHTML = `
            <li style="display: flex; align-items: center;">
                <span style="font-size: 1.5vw; color: white;">Split Macro</span>
            </li>
            <li style="display: flex; align-items: center; width: 90%;">
                <input type="range" min="0" max="600" value="${macroSpeed}" class="slider" id="feedsplitmacro">
                <output id="feedsplitmacroValue">${macroSpeed}</output>
            </li>
            <li style="display: flex; align-items: center; margin-top: 10px;">
                <span style="font-size: 1.5vw; color: white;">In Split Macro</span>
            </li>
            <li style="display: flex; align-items: center; width: 90%;">
                <input type="range" min="0" max="300" value="${macroDelay}" class="slider" id="macroDelaySlider">
                <output id="macroDelaySliderValue">${macroDelay}</output>
            </li>
            ${createKeyButton("Split/Macro Key:", "macroKeyButton", keys.macroKey)}
            ${createKeyButton("In Split Key:", "secondaryMacroKeyButton", keys.secondaryMacroKey)}
            ${createKeyButton("Big Split Key:", "bigSplitKeyButton", keys.bigSplitKey)}
            ${createKeyButton("Macro Action Key:", "macroActionKeyButton", keys.macroActionKey)}
            ${createKeyButton("Quad Action Key:", "quadSplitKeyButton", keys.quadSplitKey)}
        `;

        modMenu.appendChild(settingsContainer);

        document.getElementById('feedsplitmacro').addEventListener('input', function() {
            macroSpeed = parseInt(this.value);
            document.getElementById('feedsplitmacroValue').textContent = macroSpeed;
            localStorage.setItem('macroSpeed', macroSpeed);
        });

        document.getElementById('macroDelaySlider').addEventListener('input', function() {
            macroDelay = parseInt(this.value);
            document.getElementById('macroDelaySliderValue').textContent = macroDelay;
            localStorage.setItem('macroDelay', macroDelay);
        });

        setupKeybinds();
    }

    function createKeyButton(label, id, key) {
        return `
            <li style="display: flex; align-items: center; width: 90%; margin-top: 10px;">
                <span style="font-size: 1.2vw; color: white;">${label}</span>
                <button id="${id}" style="margin-left: 0.5vw; padding: 0.8vw; font-size: 1.2vw; background: limegreen; color: white; border: none; cursor: pointer; border-radius: 5px;">${key}</button>
            </li>
        `;
    }

    function setupKeybinds() {
        ['macroKey', 'macroActionKey', 'quadSplitKey', 'secondaryMacroKey', 'bigSplitKey'].forEach(key => {
            setupKeyChange(`${key}Button`, key);
        });
    }

    function setupKeyChange(buttonId, storageKey) {
        document.getElementById(buttonId).addEventListener('click', function() {
            this.textContent = "Press a key...";
            document.addEventListener('keydown', function setKey(event) {
                localStorage.setItem(storageKey, event.key.toUpperCase());
                document.getElementById(buttonId).textContent = event.key.toUpperCase();
                keys = getUpdatedKeys();
                document.removeEventListener('keydown', setKey);
            });
        });
    }

    preventMacroOnTyping(); // Call function to prevent macros while typing
    waitForModMenu();
})();
