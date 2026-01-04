// ==UserScript==
// @name        Spellbee solver
// @namespace   https://greasyfork.org/scripts/505025
// @match       https://spellbee.org/*
// @grant       none
// @version     1.2
// @author      https://greasyfork.org/users/1356534
// @icon        https://i.imgur.com/5pzJjdW.png
// @license     GNU GPLv3
// @description Script to automatically find all words in the game of spellbee
// @downloadURL https://update.greasyfork.org/scripts/505025/Spellbee%20solver.user.js
// @updateURL https://update.greasyfork.org/scripts/505025/Spellbee%20solver.meta.js
// ==/UserScript==

function simulateTyping(text) {
    let element = document.querySelector('body')
    const eventOptions = { bubbles: true, cancelable: true, view: window };

    for (const char of text) {
        // Create and dispatch the 'keydown' event
        const keyDownEvent = new KeyboardEvent('keydown', {
            ...eventOptions,
            key: char,
            code: `Key${char.toUpperCase()}`,
            charCode: char.charCodeAt(0),
            keyCode: char.charCodeAt(0)
        });
        element.dispatchEvent(keyDownEvent);

        // Create and dispatch the 'keypress' event
        const keyPressEvent = new KeyboardEvent('keypress', {
            ...eventOptions,
            key: char,
            code: `Key${char.toUpperCase()}`,
            charCode: char.charCodeAt(0),
            keyCode: char.charCodeAt(0)
        });
        element.dispatchEvent(keyPressEvent);

        // Create and dispatch the 'keyup' event
        const keyUpEvent = new KeyboardEvent('keyup', {
            ...eventOptions,
            key: char,
            code: `Key${char.toUpperCase()}`,
            charCode: char.charCodeAt(0),
            keyCode: char.charCodeAt(0)
        });
        element.dispatchEvent(keyUpEvent);
    }

    btn = document.querySelector('#submit_button')
    btn.click()
}


function simulateTypingWithDelay(words, delay) {
    let delayAccumulator = 0; // Tracks accumulated delay

    words.forEach((word, index) => {
        setTimeout(() => {
            simulateTyping(word);
        }, delayAccumulator);

        delayAccumulator += delay; // Increase delay for the next word
    });
}

function getDataAndRun() {
  console.log("running")
  btn = document.querySelector('#submit_button');
  btn.click()
  words = game.gameCurrent.data.dictionary
  simulateTypingWithDelay(words, 1000)
}


container = document.querySelector(".button_container")
container.style.width = '400px'
// Create the button element
const button = document.createElement('button');
button.textContent = 'Solve';
button.classList.add('button');

container.appendChild(button);

button.addEventListener("click", () => getDataAndRun())

