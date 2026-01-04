// ==UserScript==
// @name         Cryzen.io No spread
// @license      MIT
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  No spread (recoil still presists) TRY SHOTGUN, LOL! (for cryzen)
// @author       Enth
// @match        https://cryzen.io/*
// @icon         https://media.discordapp.net/attachments/921558341791129671/1172893104139931658/image.png
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/479531/Cryzenio%20No%20spread.user.js
// @updateURL https://update.greasyfork.org/scripts/479531/Cryzenio%20No%20spread.meta.js
// ==/UserScript==

let random = Math.random;
Object.defineProperty(Math, 'random', {
    set(value) {
        random = value;
    },
    get() {
        try {
            throw new Error();
        } catch (error) {
            const stack = error.stack;
            if (stack.includes('shoot')) {
                return _=>.5;
            }
        }
        return random;
    }
});
