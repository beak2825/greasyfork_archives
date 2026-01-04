// ==UserScript==
// @name         Dark Mode + Simple Glow
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  epic glow theme
// @author       astral#0069
// @match        https://diep.io/
// @match        http://diep.io/
// @downloadURL https://update.greasyfork.org/scripts/407639/Dark%20Mode%20%2B%20Simple%20Glow.user.js
// @updateURL https://update.greasyfork.org/scripts/407639/Dark%20Mode%20%2B%20Simple%20Glow.meta.js
// ==/UserScript==

input.set_convar('ren_background', false);
input.set_convar('ren_health_background_color', 0x000000);
input.set_convar('ren_border_color', 0xffffff);
input.set_convar('ren_stroke_soft_color_intensity', 0);
input.set_convar('ren_border_color_alpha', 0.1);

(function() {
    let h = document.getElementById("canvas");
    let nigr = h.getContext("2d");
    nigr.strokeCopy = (nigr.stroke);
    nigr.stroke = function () {
        nigr.strokeCopy();
    }
    let h2 = document.createElement("canvas");
    let nigr2 = h2.getContext("2d");

    h2.width = h.width;
    h2.height = h.height;
    document.getElementsByTagName('body')[0].appendChild(h2);
    h2.style.position = "absolute";
    h2.style.top = "0px";
    h2.style.left = "0px";
    h2.style.zIndex = -2;
    h2.style.filter = "opacity(85%) blur(5px) brightness(140%)";
    h2.style.width = "100%";
    h2.style.height = "100%";
    h.style.filter = "brightness(125%) contrast(100%) saturation(140%)";

    let h3 = document.createElement("canvas");
    let nigr3 = h3.getContext("2d");

    h3.width = h.width;
    h3.height = h.height;
    document.getElementsByTagName('body')[0].appendChild(h3);
    h3.style.position = "absolute";
    h3.style.top = "0px";
    h3.style.left = "0px";
    h3.style.zIndex = -3;
    h3.style.width = "100%";
    h3.style.height = "100%";
    function loop() {
        nigr2.clearRect(0, 0, h2.width, h2.height);
        nigr2.drawImage(h, 0, 0, h2.width, h2.height);

        requestAnimationFrame(loop);
    }
    loop();
})();