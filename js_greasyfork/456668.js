// ==UserScript==
// @name Monkeytype Speeder
// @author Maevings
// @description Allows to type really FAST!!! Press "Slash key" to toggle auto-typing bot, customize your typing speed, works in any mode and language.
// @icon https://i.imgur.com/fUjylt3.png
// @version 1
// @match *://monkeytype.com/*
// @run-at document-start
// @grant none
// @license MIT
// @namespace https://greasyfork.org/users/919633
// @downloadURL https://update.greasyfork.org/scripts/456668/Monkeytype%20Speeder.user.js
// @updateURL https://update.greasyfork.org/scripts/456668/Monkeytype%20Speeder.meta.js
// ==/UserScript==
/* jshint esversion:6 */


(function() {
    "use strict";

    // Minimum and maximum delay (ms)
    const MIN_DELAY = 60;
    const MAX_DELAY = 60;
    const TOGGLE_KEY = "Slash" ;
    const log = console.log;

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    let toggle = true;
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
