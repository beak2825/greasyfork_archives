// ==UserScript==
// @name mtgbrr - Monkeytype Speeder 2025
// @author natsukitheslashuser 
// @description just press slash and start typing.
// @icon https://i.imgur.com/fUjylt3.png
// @version 42.01
// @match *://monkeytype.com/*
// @run-at document-start
// @grant none
// @license idk
// @namespace natsuki
// @downloadURL https://update.greasyfork.org/scripts/531599/mtgbrr%20-%20Monkeytype%20Speeder%202025.user.js
// @updateURL https://update.greasyfork.org/scripts/531599/mtgbrr%20-%20Monkeytype%20Speeder%202025.meta.js
// ==/UserScript==
/* jshint esversion:6 */

(function() {
    "use strict";

    // Configuration
    const MIN_DELAY = 0;
    const MAX_DELAY = 0;
    const TOGGLE_KEY = "Slash";
    const MISTAKES_PER_MINUTE = 5; // Target mistakes per minute
    const STOP_DELAY = 1; // Ultra-fast 1ms stop delay
    const log = console.log;

    // State variables
    let toggle = false;
    let typingTimeout = null;
    let stopCheckInterval = null;
    let lastKeyPressTime = 0;
    let realKeypressCount = 0;
    let autoKeypressCount = 0;
    let mistakeCount = 0;
    let startTime = 0;
    let isTyping = false;

    function random(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function canType() {
        const typingTest = document.getElementById("typingTest");
        if (!typingTest) return false;
        
        const isHidden = typingTest.classList.contains("hidden");
        if (isHidden) toggle = false;
        
        // Only allow typing if toggle is on, test is visible AND we're in active typing state
        return toggle && !isHidden && isTyping;
    }

    function getNextCharacter() {
        const currentWord = document.querySelector(".word.active");
        if (!currentWord) return "";
        
        for (const letter of currentWord.children) {
            if (letter.className === "") return letter.textContent;
        }
        return " ";
    }

    function shouldMakeMistake() {
        // Calculate dynamic mistake chance based on elapsed time to meet target mistakes per minute
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        const elapsedMinutes = elapsedSeconds / 60;
        const targetMistakes = elapsedMinutes * MISTAKES_PER_MINUTE;
        
        // If we've made fewer mistakes than target, increase the chance
        if (mistakeCount < targetMistakes) {
            const remainingTime = 60 - (elapsedSeconds % 60);
            const remainingMistakes = Math.ceil(MISTAKES_PER_MINUTE - mistakeCount % MISTAKES_PER_MINUTE);
            
            // Higher chance as we approach the end of the minute with fewer mistakes
            return Math.random() < (remainingMistakes / (remainingTime * 2));
        }
        
        return false;
    }
    
    function getRandomWrongCharacter(correctChar) {
        const nearbyKeys = {
            'a': ['s', 'q', 'z', 'w'],
            'b': ['v', 'n', 'g', 'h'],
            'c': ['x', 'v', 'd', 'f'],
            'd': ['s', 'f', 'e', 'r'],
            'e': ['w', 'r', 'd', 'f'],
            'f': ['d', 'g', 'r', 't'],
            'g': ['f', 'h', 't', 'y'],
            'h': ['g', 'j', 'y', 'u'],
            'i': ['u', 'o', 'k', 'l'],
            'j': ['h', 'k', 'u', 'i'],
            'k': ['j', 'l', 'i', 'o'],
            'l': ['k', ';', 'o', 'p'],
            'm': ['n', ',', 'j', 'k'],
            'n': ['b', 'm', 'h', 'j'],
            'o': ['i', 'p', 'k', 'l'],
            'p': ['o', '[', 'l', ';'],
            'q': ['w', 'a', '1', '2'],
            'r': ['e', 't', 'd', 'f'],
            's': ['a', 'd', 'w', 'e'],
            't': ['r', 'y', 'f', 'g'],
            'u': ['y', 'i', 'h', 'j'],
            'v': ['c', 'b', 'f', 'g'],
            'w': ['q', 'e', 'a', 's'],
            'x': ['z', 'c', 's', 'd'],
            'y': ['t', 'u', 'g', 'h'],
            'z': ['a', 'x', 's', 'd'],
            ' ': ['n', 'm', 'b', 'v']
        };
        
        if (correctChar in nearbyKeys) {
            const possibleMistakes = nearbyKeys[correctChar];
            return possibleMistakes[Math.floor(Math.random() * possibleMistakes.length)];
        }
        
        // Fallback for characters not in the map
        return String.fromCharCode(correctChar.charCodeAt(0) + (Math.random() > 0.5 ? 1 : -1));
    }

    const InputEvents = {};
    function pressKey(key) {
        const wordsInput = document.getElementById("wordsInput");
        if (!wordsInput) return;
        
        const KeyboardEvent = Object.assign({}, DEFAULT_INPUT_OPTIONS, { target: wordsInput, data: key });
        const InputEvent = Object.assign({}, DEFAULT_KEY_OPTIONS, { target: wordsInput, key: key });

        wordsInput.value += key;
        
        if (InputEvents.beforeinput) InputEvents.beforeinput(InputEvent);
        if (InputEvents.input) InputEvents.input(InputEvent);
        if (InputEvents.keyup) InputEvents.keyup(KeyboardEvent);
        
        autoKeypressCount++;
        
        // Log status occasionally
        if (autoKeypressCount % 10 === 0) {
            log(`Auto: ${autoKeypressCount}, Real: ${realKeypressCount}, Mistakes: ${mistakeCount}`);
        }
    }

    // Ultra-fast continuous stop check
    function setupStopCheck() {
        if (stopCheckInterval) {
            clearInterval(stopCheckInterval);
        }
        
        // Check every 1ms if we should be typing
        stopCheckInterval = setInterval(() => {
            const now = Date.now();
            const idleTime = now - lastKeyPressTime;
            
            // If we haven't had a keypress in STOP_DELAY ms, immediately stop typing
            if (idleTime > STOP_DELAY && isTyping) {
                isTyping = false;
                
                // Clear typing timeout to stop immediately
                if (typingTimeout) {
                    clearTimeout(typingTimeout);
                    typingTimeout = null;
                }
            }
        }, 1); // Check every 1ms for optimal responsiveness
    }

    function typeCharacter() {
        // Clear any existing timeout
        if (typingTimeout) {
            clearTimeout(typingTimeout);
            typingTimeout = null;
        }
        
        // Check if we can type
        if (!canType()) {
            return; // Don't schedule another character if conditions aren't met
        }

        // Get the correct next character
        const nextChar = getNextCharacter();
        
        if (nextChar) {
            // Decide if we should make a mistake
            if (shouldMakeMistake()) {
                const wrongChar = getRandomWrongCharacter(nextChar);
                pressKey(wrongChar);
                mistakeCount++;
                log(`Made mistake: typed '${wrongChar}' instead of '${nextChar}'. Total mistakes: ${mistakeCount}`);
            } else {
                pressKey(nextChar);
            }
            
            // Schedule the next character if still active
            if (canType()) {
                typingTimeout = setTimeout(typeCharacter, random(MIN_DELAY, MAX_DELAY));
            }
        }
    }

    // Handle keydown events
    window.addEventListener("keydown", function(event) {
        if (event.code === TOGGLE_KEY) {
            event.preventDefault();
            if (event.repeat) return;
            
            toggle = !toggle;
            if (toggle) {
                // Reset counters and timers when starting
                realKeypressCount = 0;
                autoKeypressCount = 0;
                mistakeCount = 0;
                startTime = Date.now();
                log("TYPING BOT ENABLED - Press keys to activate typing");
                
                // Set up the ultra-fast stop check interval
                setupStopCheck();
            } else {
                log("TYPING BOT DISABLED");
                
                // Clear all timers
                if (typingTimeout) {
                    clearTimeout(typingTimeout);
                    typingTimeout = null;
                }
                
                if (stopCheckInterval) {
                    clearInterval(stopCheckInterval);
                    stopCheckInterval = null;
                }
                
                isTyping = false;
            }
        } else if (toggle) {
            // Count real keypresses for regular keys
            if (!["Control", "Alt", "Shift", "Meta", "CapsLock", "Tab", "Escape"].includes(event.key)) {
                realKeypressCount++;
                
                // Update the last key press time to keep typing active
                lastKeyPressTime = Date.now();
                
                // Set typing state to active
                isTyping = true;
                
                // Start typing if not already typing
                if (!typingTimeout) {
                    typeCharacter();
                }
                
                // Prevent the keypress from affecting the typing
                event.preventDefault();
            }
        }
    }, true);

    // Clean up when page unloads
    window.addEventListener("beforeunload", function() {
        if (typingTimeout) clearTimeout(typingTimeout);
        if (stopCheckInterval) clearInterval(stopCheckInterval);
    });

    // Intercept event listeners
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
        key: "", code: "", keyCode: 0, which: 0, isTrusted: true, altKey: false,
        bubbles: true, cancelBubble: false, cancelable: true, charCode: 0,
        composed: true, ctrlKey: false, currentTarget: null, defaultPrevented: false,
        detail: 0, eventPhase: 0, isComposing: false, location: 0, metaKey: false,
        path: null, repeat: false, returnValue: true, shiftKey: false, srcElement: null,
        target: null, timeStamp: Date.now(), type: "", view: window,
    };

    const DEFAULT_INPUT_OPTIONS = {
        isTrusted: true, bubbles: true, cancelBubble: false, cancelable: false,
        composed: true, data: "", dataTransfer: null, defaultPrevented: false,
        detail: 0, eventPhase: 0, inputType: "insertText", isComposing: false,
        path: null, returnValue: true, sourceCapabilities: null, srcElement: null,
        target: null, currentTarget: null, timeStamp: Date.now(), type: "input",
        view: null, which: 0
    };
    
    log("MonkeyType Script loaded - Press / to toggle, then type to activate");
})();