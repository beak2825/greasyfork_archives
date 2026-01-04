// ==UserScript==
// @name Monkeytype helper
// @author Murka
// @description Allows to type really FAST!!! Press "Right Arrow" to toggle auto-typing bot, customize your typing speed, works in any mode and language
// @icon https://i.imgur.com/fUjylt3.png
// @version 0.3
// @match *://monkeytype.com/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/447071/Monkeytype%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/447071/Monkeytype%20helper.meta.js
// ==/UserScript==
/* jshint esversion:6 */

/*
    Author: Murka
    Github: https://github.com/Murka007
    Discord: https://discord.gg/cPRFdcZkeD
    Greasyfork: https://greasyfork.org/en/users/919633

    READ BEFORE USING:
    - It will not save statistics to your account
    - Log out of your account before using this script and reload the page
    - This script is intended to show vulnerabilities and maximum typing speed that can be achieved by using additional software
    - Press `Arrow Right` to enable/disable a script
    
    More info:
    - Modify `MIN_DELAY` and `MAX_DELAY` variables in the code to change your typing speed
    - Works in any mode and language
*/

(function() {
    "use strict";

    // Minimum and maximum delay (ms)
    const MIN_DELAY = 0;
    const MAX_DELAY = 10;
    const TOGGLE_KEY = "ArrowRight";
    const log = console.log;

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let toggle = false;
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
        setTimeout(typeCharacter, random(MIN_DELAY, MAX_DELAY));
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
        }
    })

    // Intercept when JQuery attached an addEventListener to the Input element
    function hook(element) {
        element.addEventListener = new Proxy(element.addEventListener, {
            apply(target, _this, args) {
                const [type, listener, ...options] = args;
                if (_this.id === "wordsInput") {
                    InputEvents[type] = listener;
                }
                return target.apply(_this, args);
            }
        })
    }
    hook(HTMLInputElement.prototype);

    const DEFAULT_KEY_OPTIONS = {
        key: "", code: "", keyCode: 0, which: 0, isTrusted: true, altKey: false,
        bubbles: true, cancelBubble: false, cancelable: true, charCode: 0,
        composed: true, ctrlKey: false, currentTarget: null, defaultPrevented: false,
        detail: 0, eventPhase: 0, isComposing: false, location: 0, metaKey: false,
        path: null, repeat: false, returnValue: true, shiftKey: false, srcElement: null,
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