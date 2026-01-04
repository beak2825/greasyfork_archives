// ==UserScript==
// @name        twitter - auto-show hidden
// @description Automatically shows hidden content
// @version     1.0
// @namespace   oltodosel
// @match       https://twitter.com/*
// @match       https://x.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546099/twitter%20-%20auto-show%20hidden.user.js
// @updateURL https://update.greasyfork.org/scripts/546099/twitter%20-%20auto-show%20hidden.meta.js
// ==/UserScript==

var cc = 0;
let isRunning = false;

function mainfunc() {
    if (isRunning) return;
    isRunning = true;
    // console.log('count_:' + (cc += 1));

    let first_entrance = document.querySelectorAll("span");
    if (first_entrance.length !== 0) {
        for (let i = 0; i < first_entrance.length; ++i) {
            if (first_entrance[i].textContent == 'Yes, view profile') {
                first_entrance[i].click();
                // console.log(i);
            }
        }
    }

    let reveal_buttons = document.querySelectorAll('button');
    // console.log(reveal_buttons.length);
    if (reveal_buttons.length !== 0) {
        for (let i = 0; i < reveal_buttons.length; ++i) {
            if (reveal_buttons[i].textContent == 'View' || reveal_buttons[i].textContent == 'Show') {
                reveal_buttons[i].click();
                // console.log(i);
            }
        }
    }
    setTimeout(() => {
        isRunning = false;
    }, 50);
}

const observer = new MutationObserver(mainfunc);
observer.observe(document.body, { childList: true, subtree: true });