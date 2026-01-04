// ==UserScript==
// @name         simple Autofire & Autospin Detector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  balls
// @author       8_no
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/453844/simple%20Autofire%20%20Autospin%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/453844/simple%20Autofire%20%20Autospin%20Detector.meta.js
// ==/UserScript==

var died=true;
var autofire=false;
var autospin=false;

function s() {
    if(input.should_prevent_unload()) {
        if (died) {
            died=false;
//alive
              };
         }else{
//dead
                  died=true;
             autofire=false;
             autospin=false;
         }
}

setInterval(s, 100);

//activation
document.addEventListener("keydown", (kc) => {
            if (kc.keyCode === 69) {
           autofire = !autofire;
        }
            if (kc.keyCode === 67) {
           autospin = !autospin;
        }
});

//gui
const ctx = canvas.getContext("2d");
setTimeout(() => {
    let gui = () => {
        ctx.fillStyle = "yellow";
        ctx.lineWidth = 8;
        ctx.font = 3 + "em Ubuntu";
        ctx.strokeStyle = "orange";
        ctx.strokeText(`Autofire: ${autofire}`, 50, 1000);
        ctx.fillText(`Autofire: ${autofire}`, 50, 1000);
        ctx.fillStyle = "lime";
        ctx.lineWidth = 8;
        ctx.font = 3 + "em Ubuntu";
        ctx.strokeStyle = "darkgreen";
        ctx.strokeText(`Autospin: ${autospin}`, 50, 1050);
        ctx.fillText(`Autospin: ${autospin}`, 50, 1050);
        window.requestAnimationFrame(gui);
    }
    gui();
    setTimeout(() => {
        gui();
    },5000);
}, 1000);