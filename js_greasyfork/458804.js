// ==UserScript==
// @name         MooMoo.io simple autoheal
// @version      1.21
// @description  MooMoo.js autoheal
// @author       Nuro
// @match        *://*.moomoo.io/*
// @require      https://greasyfork.org/scripts/456235-moomoo-js/code/MooMoojs.js?version=1159501
// @run-at       document-end
// @namespace https://greasyfork.org/users/761829
// @downloadURL https://update.greasyfork.org/scripts/458804/MooMooio%20simple%20autoheal.user.js
// @updateURL https://update.greasyfork.org/scripts/458804/MooMooio%20simple%20autoheal.meta.js
// ==/UserScript==
/*
Support us on social media (follow and leave a star)

GitHub: https://moomooforge.github.io/MooMoo.js/
Author: https://github.com/NuroC
YouTube: https://www.youtube.com/@nuro9607
Discord: https://discord.gg/NMS3YR9Q5R
*/

const AUTOHEAL_SPEED = 100 // make lower if you clown too fast

// https://nuroc.github.io/MooMoo.js/#installing-and-getting-started
const MooMoo = (function MooMooJS_beta() {})[69]

// https://github.com/NuroC/moomoo-in-depth/tree/main/protocol/server#updatehealth
MooMoo.addEventListener("updatehealth", (data) => {
    let sid = data[0]
    let health = data[1]
    
    // https://nuroc.github.io/MooMoo.js/Player#accessing-player-data-and-information
    if (MooMoo.myPlayer.sid === sid && health < 100) {

        // https://nuroc.github.io/MooMoo.js/Player#accessing-player-data-and-information
        let food = MooMoo.myPlayer.inventory.food;

        // https://nuroc.github.io/MooMoo.js/Player#placing-items
        setTimeout(() => {
            MooMoo.MyPlayer.place(food)
        }, AUTOHEAL_SPEED)
    }
})