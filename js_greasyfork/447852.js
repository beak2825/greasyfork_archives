// ==UserScript==
// @name         Gats.io - Antiaim(not hack rly)
// @namespace    http://tampermonkey.net/
// @version      1.01
// @description  To use with NoCameraMovement. Shitty AA, it should have actually to just move gun model, not gun itself, but i dont care
// @author       hustly
// @match        https://gats.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=gats.io
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/447852/Gatsio%20-%20Antiaim%28not%20hack%20rly%29.user.js
// @updateURL https://update.greasyfork.org/scripts/447852/Gatsio%20-%20Antiaim%28not%20hack%20rly%29.meta.js
// ==/UserScript==
(function() {
var antiaim = true;

document.addEventListener("mousedown", function(e) {
    if (e.button == 0 && antiaim) {
        antiaim = false;
    }
});
document.addEventListener("mouseup", function(e) {
    if (e.button == 0) {
        antiaim = true;
    }
});

setInterval(function() {
    if(antiaim){
        if(RD.pool[c3].invincible == '0'){
            let aaX = Math.random() * 1224;
            let aaY = Math.random() * 768;
            a57({clientX: aaX, clientY: aaY});
        }
    }
}, 300);
})();