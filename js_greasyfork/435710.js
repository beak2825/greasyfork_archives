// ==UserScript==
// @name         Sky Keyboard Enter
// @namespace    https://github.com/Silverfeelin/
// @version      0.1
// @description  Allows you to send messages by hitting Enter.
// @author       Silverfeelin
// @license      MIT
// @match        https://keyboard.sky.thatgame.co/keyboard/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435710/Sky%20Keyboard%20Enter.user.js
// @updateURL https://update.greasyfork.org/scripts/435710/Sky%20Keyboard%20Enter.meta.js
// ==/UserScript==

let bound = false;
let textarea;
let interval = setInterval(function() {
    const textarea = document.querySelector('textarea[placeholder="Your message here!"]');
    if (!textarea) { return; }
    clearInterval(interval);
    console.log('Sky Keyboard Enter: Bound!');

    textarea.addEventListener('keydown', function(e) {
        if (e.code === 'Enter' && !e.shiftKey) {
            const button = document.querySelector('button[type="submit"][aria-label="submit message"]');
            if (!button) { return; }

            button.click();
            e.preventDefault();
            e.stopPropagation();
        }
    });
}, 500);