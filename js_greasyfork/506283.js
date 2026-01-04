// ==UserScript==
// @name         Typing Club Cheats
// @namespace    https://greasyfork.org/en/scripts/506283-typing-club-cheats
// @version      2024/09/01 - 6:17 PM
// @description  typing club cheats
// @author       https://github.com/bruh1555
// @match        https://*.edclub.com/sportal/program-*/*.play
// @icon         https://static.typingclub.com/m/favicon.png
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/506283/Typing%20Club%20Cheats.user.js
// @updateURL https://update.greasyfork.org/scripts/506283/Typing%20Club%20Cheats.meta.js
// ==/UserScript==

const enabled = true; // Set to true or false to enable or disable cheats

(function() {
    'use strict';
    if (!enabled) return;
    const delay = 5000;
    setTimeout(() => {
        if (typeof core === 'undefined' || typeof core.bound_keypress_handler === 'undefined') {
            alert("Script couldn't run because Typing Club's core object isn't available.");
            return;
        }
        const wpm = parseInt(prompt("How many WPM do you want the bot to type?"), 10);
        if (isNaN(wpm)) {
            alert("You didn't enter a valid number. Please try again.");
            return;
        }
        if (wpm > 150 && !confirm("You could lag or be detected for cheating if your WPM is higher than 150. Are you sure you'd like to continue?")) {
            alert("Exiting script.");
            return;
        }
        if (wpm <= 0) {
            alert("WPM cannot be zero or negative.");
            return;
        }
        const interval = 12000 / wpm;
        let lastIndex = -1;
        let i = 0;
        const cheatInterval = setInterval(() => {
            if (lastIndex !== core.cur_char_index) {
                i++;
                lastIndex = core.cur_char_index;
            }
            if (i >= core.text.length) {
                clearInterval(cheatInterval);
                return;
            }
            core.bound_keypress_handler({ key: core.cur_char.chr });
        }, interval);
    }, delay);
})();
