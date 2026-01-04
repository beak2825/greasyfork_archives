// ==UserScript==
// @name         test
// @namespace    http://tampermonkey.net/
// @version      69.69
// @description  press enter to activate
// @author       astral#0069
// @match        ://diep.io/*
// @downloadURL https://update.greasyfork.org/scripts/410138/test.user.js
// @updateURL https://update.greasyfork.org/scripts/410138/test.meta.js
// ==/UserScript==
// copy and paste this into console
(function() {
// ======================= WIREFRAME CODE =======================
// # if you wanted you could get just the wireframe by copying this part of the script

// gain access to the ingame canvas
let c = document.getElementById("canvas");
let ctx = c.getContext("2d");

// remove all fill values (tank bodies, barrels/shapes fill, etc.)
ctx.fillCopy = ctx.fill;
ctx.fill = function () { }


ctx.strokeCopy = ctx.stroke;
ctx.stroke = function () {
    ctx.strokeCopy();
}

// draw the new tank body
ctx.arcCopy = ctx.arc;
ctx.arc = function (x, y, r) {
    ctx.beginPath();
    ctx.arcCopy(x, y, r, 0, Math.PI * 2);
    ctx.strokeStyle = ctx.fillStyle;

    ctx.lineWidth = ctx.lineWidth / 20;
    ctx.strokeCopy();
    ctx.closePath();
    input.set_convar('ren_stroke_soft_color_intensity', 0);
}
// ==============================================================

// remove the main canvas background
input.set_convar('ren_background', false);
input.set_convar('ren_health_background_color', "0x000000");
input.set_convar('ren_border_color', "0xffffff");
input.set_convar('ren_border_color_alpha', 0.02);

// ~~~~~~~~~~~~ C2 ~~~~~~~~~~~~
// create another layer
let c2 = document.createElement("canvas");
let ctx2 = c2.getContext("2d");

c2.width = c.width;
c2.height = c.height;
document.getElementsByTagName('body')[0].appendChild(c2);

// define styles for the c2 element
c2.style.position = "absolute";
c2.style.top = "0px";
c2.style.left = "0px";
c2.style.zIndex = -2;
c2.style.filter = "opacity(85%) blur(7.75px) brightness(150%)";
c2.style.width = "100%";
c2.style.height = "100%";


c.style.filter = "brightness(125%) contrast(100%) saturation(150%)";
// ~~~~~~~~~~~~ C3 ~~~~~~~~~~~~
let c3 = document.createElement("canvas");
let ctx3 = c3.getContext("2d");

c3.width = c.width;
c3.height = c.height;
document.getElementsByTagName('body')[0].appendChild(c3);

c3.style.position = "absolute";
c3.style.top = "0px";
c3.style.left = "0px";
c3.style.zIndex = -3;

c3.style.width = "100%";
c3.style.height = "100%";
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~

// modify background color
let bgColor = "#050505";
ctx3.fillStyle = bgColor;
ctx3.fillRect(0, 0, c3.width, c3.height);

// loop function (duh)
function loop() {
    ctx2.clearRect(0, 0, c2.width, c2.height);
    ctx2.drawImage(c, 0, 0, c2.width, c2.height);

    requestAnimationFrame(loop);
}
loop();
})();