// ==UserScript==
// @name         suicide bot
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  r!psAw
// @author       You
// @match        https://diep.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license     MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450977/suicide%20bot.user.js
// @updateURL https://update.greasyfork.org/scripts/450977/suicide%20bot.meta.js
// ==/UserScript==

var respawn = true;

function script() {
    if (respawn) {
        input.execute('game_spawn leave noob');
        input.keyUp(75);
        input.keyDown(75);
        input.keyUp(220);
        input.keyDown(220);
        input.keyUp(79);
        input.keyDown(79);
    }
}

document.addEventListener("keydown", (kc) => {
    if (kc.keyCode===88) respawn=!respawn;
});

setInterval(script, 100)