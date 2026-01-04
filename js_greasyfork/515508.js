// ==UserScript==
// @name         WordsPerWinIt
// @description  Logixx
// @icon         https://www.google.com/s2/favicons?sz=64&domain=monkeytype.com
// @version      0.5
// @match        *://monkeytype.com/*
// @run-at       document-start
// @grant        none
// @license      Logixx
// @namespace https://greasyfork.org/users/1222651
// @downloadURL https://update.greasyfork.org/scripts/515508/WordsPerWinIt.user.js
// @updateURL https://update.greasyfork.org/scripts/515508/WordsPerWinIt.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Configuration
    let WORDS_PER_MINUTE = 100;
    let ACCURACY = 95; // Probability of committing an error as a percentage (0-100)
    let TOGGLE_KEY = "ArrowRight";
    let toggle = false;
    let IndexCounter = 0;
    let typingInterval = undefined;
    const log = console.log;

    // UI Container for settings
    const uiContainer = createUIContainer();
    setupUI();
    document.body.appendChild(uiContainer);

    // Key Events
    window.addEventListener("keydown", handleKeyPress);
    window.addEventListener("keydown", toggleUI);

    // Hooking into Input Events
    hookInputEvents(HTMLInputElement.prototype);

    // Functions
    function toggleUI(event) {
        if (event.key === "Tab" || event.key === ".") {
            event.preventDefault();
            uiContainer.style.display = uiContainer.style.display === 'none' ? 'block' : 'none';
        }
    }

    function createUIContainer() {
        const container = document.createElement("div");
        container.style.cssText = `
            position: fixed; top: 20px; right: 20px; width: 250px;
            padding: 15px; background: rgba(34, 34, 34, 0.9); color: white;
            border-radius: 10px; font-family: 'Arial', sans-serif; z-index: 1000;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); transition: all 0.3s;
        `;
        container.style.display = 'block'; // Start visible
        container.addEventListener('click', (event) => {
            event.stopPropagation();
        });
        return container;
    }

    function setupUI() {
        uiContainer.appendChild(createHeader());
        uiContainer.appendChild(createDelaySetting("Words Per Minute:", 1000, WORDS_PER_MINUTE, (value) => { WORDS_PER_MINUTE = value; }, "WPM"));
        uiContainer.appendChild(createDelaySetting("Accuracy Percentage:", 100, ACCURACY, (value) => { ACCURACY = value; }, "%"));
        uiContainer.appendChild(createKeybindButton());
    }

    function createHeader() {
        const header = document.createElement("h2");
        header.textContent = "Words Per WinIt Settings:";
        header.style.cssText = `
            font-size: 20px; color: #f2a900; text-align: center; margin-bottom: 15px;
            text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.8);
        `;
        return header;
    }

    function createDelaySetting(labelText, max, initialValue, onChange, unit) {
        const container = document.createElement("div");
        container.style.marginBottom = "10px";

        const label = document.createElement("label");
        label.textContent = labelText;
        label.style.cssText = "display: inline-block; margin-bottom: 5px;";

        const valueDisplay = document.createElement("span");
        valueDisplay.textContent = `${initialValue} ${unit}`;
        valueDisplay.style.cssText = "color: #00e676; font-weight: bold; display: block;";

        const input = document.createElement("input");
        input.type = "range";
        input.min = "0";
        input.max = `${max}`; // Adjust max as necessary
        input.value = initialValue;
        input.style.cssText = "width: 100%; margin-top: 5px;";

        input.addEventListener("input", () => {
            const value = parseInt(input.value, 10);
            valueDisplay.textContent = `${value} ${unit}`;
            onChange(value);
        });

        container.appendChild(label);
        container.appendChild(valueDisplay);
        container.appendChild(input);
        return container;
    }

    const BLACKLISTED_KEYS = ["Escape", "Backspace", "Enter", "Print"];
    function createKeybindButton() {
        const keybindLabel = document.createElement("label");
        keybindLabel.textContent = "Toggle Keybind:";
        keybindLabel.style.cssText = "display: block; margin-top: 10px;";

        const keybindButton = document.createElement("button");
        keybindButton.textContent = `${TOGGLE_KEY}`;
        keybindButton.style.cssText = `
            width: 100%; padding: 8px; margin-top: 4px; font-size: 14px;
            text-align: center; border: none; border-radius: 5px; background: #333; color: #fff;
            cursor: pointer; transition: background 0.3s;
        `;
        keybindButton.onmouseover = () => { keybindButton.style.background = "#444"; };
        keybindButton.onmouseout = () => { keybindButton.style.background = "#333"; };

        let listeningForKey = false;
        keybindButton.addEventListener("click", () => {
            keybindButton.textContent = "set key...";
            listeningForKey = true;
        });

        document.addEventListener("keydown", (event) => {
            if (listeningForKey) {
                if (BLACKLISTED_KEYS.includes(event.key)) {
                    keybindButton.textContent = "choose another key...";
                    return;
                }
                TOGGLE_KEY = event.code;
                keybindButton.textContent = `${event.key}`;
                listeningForKey = false;
                event.stopPropagation();
            }
        });

        return keybindButton;
    }

    function handleKeyPress(event) {
        if (event.code === TOGGLE_KEY) {
            event.preventDefault();
            if (event.repeat) return; // Prevent triggering multiple times
            toggle = !toggle;

            if (toggle) {
                IndexCounter = 0;
                log("STARTED TYPING TEST");
                startTyping();
            } else {
                log("STOPPED TYPING TEST");
            }
        }
    }

    function startTyping() {
        let CHARACTER_INTERVAL;
        let LAST_DATE = Date.now();

        typingInterval = setInterval(() => {
            if (!toggle) {
                clearInterval(typingInterval);
                clearInterval(CHARACTER_INTERVAL);
                return;
            }

            const CHARACTERS_PER_MINUTE = ((60000 / WORDS_PER_MINUTE) / 5) / (1 + ((WORDS_PER_MINUTE / 250) * .15));

            if (Date.now() - LAST_DATE >= CHARACTERS_PER_MINUTE) {

                typeCharacter();
                LAST_DATE = Date.now();
            };
        }, 1);
    }

    function canType() {
        const typingTest = document.getElementById("typingTest");
        const isHidden = typingTest && typingTest.classList.contains("hidden");
        if (isHidden) toggle = false;
        return toggle && !isHidden;
    }


    function getNextCharacter() {
        // Logixx errors
        IndexCounter++;
        if (IndexCounter === Math.round(100 / ((100 - ACCURACY) / 2))) {
            IndexCounter = 0;
            return "‍";
        };

        const currentWord = document.querySelector(".word.active");
        for (const letter of currentWord.children) {
            if (letter.className === "") return letter.textContent;
        }
        return " "; // Return space if all letters are typed
    }

    function typeCharacter() {
        if (!canType()) return clearInterval(typingInterval); // Check if we can type
        const nextChar = getNextCharacter();

        if (nextChar) {
            pressKey(nextChar);
        } else {
            log("Finished typing.");
            toggle = false; // Stop typing if finished
        }
    }

    // Intercept when JQuery attached an addEventListener to the Input element
    function HookKeyboard(element) {
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

    HookKeyboard(HTMLInputElement.prototype);

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

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function hookInputEvents(element) {
        const originalAddEventListener = element.addEventListener;

        element.addEventListener = function (type, listener, options) {
            if (type === 'input') {
                // Optionally handle input events
            }
            return originalAddEventListener.call(this, type, listener, options);
        };
    }

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