// ==UserScript==
// @name         YouTube ShortsKeys
// @namespace    YouTubeShortsKeys
// @version      2.0.1
// @description  Adds ArrowRight and ArrowLeft keys to YouTube Shorts same as ArrowUp and ArrowDown!
// @author       Runterya
// @homepage     https://github.com/Runteryaa
// @match        *://*.youtube.com/shorts/*
// @match        *://*.youtube-nocookie.com/shorts/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license      MIT
// @compatible   chrome
// @compatible   edge
// @compatible   firefox
// @compatible   opera
// @compatible   safari
// @downloadURL https://update.greasyfork.org/scripts/460989/YouTube%20ShortsKeys.user.js
// @updateURL https://update.greasyfork.org/scripts/460989/YouTube%20ShortsKeys.meta.js
// ==/UserScript==

console.log("YouTube ShortsKeys");

document.addEventListener('keydown', function(event) {
    console.log("Keydown event detected:", event.key);
    if (event.key === 'ArrowRight') {
        console.log("Right arrow key pressed. UP!");

        const upArrowEvent = new KeyboardEvent('keydown', {
            key: 'ArrowUp',
            code: 'ArrowUp',
            keyCode: 38,
            which: 38,
            bubbles: true,
            cancelable: true,
            composed: true
        });

        console.log("Simulating up arrow key press.");
        document.dispatchEvent(upArrowEvent);

        console.log("Up arrow key event dispatched.");
    }
});

document.addEventListener('keydown', function(event) {
    console.log("Keydown event detected:", event.key);
    if (event.key === 'ArrowLeft') {
        console.log("Left arrow key pressed. DOWN!");

        const downArrowEvent = new KeyboardEvent('keydown', {
            key: 'ArrowDown',
            code: 'ArrowDown',
            keyCode: 40,
            which: 40,
            bubbles: true,
            cancelable: true,
            composed: true
        });

        console.log("Simulating down arrow key press.");
        document.dispatchEvent(downArrowEvent);

        console.log("Down arrow key event dispatched.");
    }
});

document.addEventListener('keydown', function(event) {
    console.log("Captured event:", event.key);
});
