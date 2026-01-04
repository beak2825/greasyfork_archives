// ==UserScript==
// @name        Skills - SMMO
// @namespace   Violentmonkey Scripts
// @match       https://web.simple-mmo.com/crafting/material/gather/*
// @grant       none
// @version     1.0
// @author      ama
// @description 27/12/2023, 7:28:27 am
// @downloadURL https://update.greasyfork.org/scripts/483409/Skills%20-%20SMMO.user.js
// @updateURL https://update.greasyfork.org/scripts/483409/Skills%20-%20SMMO.meta.js
// ==/UserScript==

let personButtonClicked = false;
let personButtonClickTime = 0;
const delayBeforeReset = 60 * 1000;

function clickElementByText(text) {
    var elements = document.querySelectorAll('button, a');
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].textContent.includes(text)) {
            elements[i].click();
            return true;
        }
    }
    return false;
}

function resetPersonButtonFlag() {
    const currentTime = new Date().getTime();
    if (personButtonClicked && currentTime - personButtonClickTime > delayBeforeReset) {
        personButtonClicked = false;
    }
}

function simulateSpacebarPress() {
    var event = new KeyboardEvent('keydown', {
        code: 'Space',
        key: 'Space',
        charCode: 0,
        keyCode: 32,
        view: window,
        bubbles: true
    });
    document.dispatchEvent(event);
}

let spacebarInterval = setInterval(() => {
    simulateSpacebarPress();
}, 2000);

document.addEventListener('keydown', function(event) {
    resetPersonButtonFlag();
    if (event.code === 'Space') {
        if (!personButtonClicked && clickElementByText("I'm a person! Promise!")) {
            personButtonClicked = true;
            personButtonClickTime = new Date().getTime();
        } else {
            if (!clickElementByText('Gather')) {
                if (!clickElementByText('Press here to gather')) {
                    clickElementByText('Press here to close');
                }
            }
        }
    }
});