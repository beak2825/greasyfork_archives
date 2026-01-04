// ==UserScript==
// @name         BLOBLE.İO-Rotating Circle
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Circle
// @author       İbrahim
// @match        http://bloble.io/
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429653/BLOBLE%C4%B0O-Rotating%20Circle.user.js
// @updateURL https://update.greasyfork.org/scripts/429653/BLOBLE%C4%B0O-Rotating%20Circle.meta.js
// ==/UserScript==

addEventListener("keydown", function(a) {
    if (document.activeElement == mainCanvas && selUnits.length) {
        if (a.keyCode == 77) {
            circlex()
        }
    }
});
var rot = 0.1;

function circlex() {
    var radius = 300;
    var x = player.x + targetDst * MathCOS(targetDir) + camX;
    var y = player.y + targetDst * MathSIN(targetDir) + camY;
    var interval = (Math.PI * 2) / selUnits.length;
    rot += 0.1;
    for (let i = 0; i < selUnits.length; i++) {
        socket.emit("5", x + (Math.cos(interval * i + rot) * radius), y + (Math.sin(interval * i + rot) * radius), [selUnits[i].id], 0, 0)
    }
};
addEventListener("keydown", function(a) {
    if (document.activeElement == mainCanvas && selUnits.length) {
        if (a.keyCode == 78) {
            circlea()
        }
    }
});
var rota = 0.1;

function circlea() {
    var radius = 300;
    var x = player.x + targetDst * MathCOS(targetDir) + camX;
    var y = player.y + targetDst * MathSIN(targetDir) + camY;
    var interval = (Math.PI * 2) / selUnits.length;
    rota += 100.1;
    for (let i = 0; i < selUnits.length; i++) {
        socket.emit("5", x + (Math.cos(interval * i + rota) * radius), y + (Math.sin(interval * i + rota) * radius), [selUnits[i].id], 0, 0)
    }
};