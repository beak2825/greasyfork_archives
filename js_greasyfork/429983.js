// ==UserScript==
// @name         Diep with Shadows
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  diep.io shader
// @author       x
// @match        https://diep.io
// @match        http://diep.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429983/Diep%20with%20Shadows.user.js
// @updateURL https://update.greasyfork.org/scripts/429983/Diep%20with%20Shadows.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.on = window.addEventListener; // nodejs ftw
    var toggle = true;

    var c = document.getElementById('canvas');
    var ctx = c.getContext("2d");
    var c2 = document.createElement('canvas');
    var ctx2 = c2.getContext('2d');
    var c3 = document.createElement('canvas');
    var ctx3 = c3.getContext('2d');
    var c4 = document.createElement('canvas');
    var ctx4 = c4.getContext('2d');

    var shadowRes = 2
    c2.width = 1920 / shadowRes;
    c2.height = 1080 / shadowRes;
    c3.width = 1920 / shadowRes;
    c3.height = 1080 / shadowRes;
    c4.width = 1920 / shadowRes;
    c4.height = 1080 / shadowRes;
    document.getElementsByTagName('body')[0].appendChild(c2);
    document.getElementsByTagName('body')[0].appendChild(c3);
    document.getElementsByTagName('body')[0].appendChild(c4);

    c2.style.position = "absolute";
    c2.style.top = "0px";
    c2.style.left = "0px";
    c2.style.zIndex = -2;

    c3.style.position = "absolute";
    c3.style.top = "0px";
    c3.style.left = "0px";
    c3.style.zIndex = -3;

    c4.style.position = "absolute";
    c4.style.top = "0px";
    c4.style.left = "0px";
    c4.style.zIndex = -1;

    c4.style.filter = "blur(8px) saturate(90%)";
    c2.style.filter = "blur(5px) contrast(0%) saturate(0%) brightness(20%)";
    c2.style.width = "100%";
    c2.style.height = "100%";
    c3.style.width = "100%";
    c3.style.height = "100%";
    c4.style.width = "100%";
    c4.style.height = "100%";

    var mP = { x: 0, y: 0 };
    window.on("mousemove", function(e) {
        mP = { x: e.clientX, y: e.clientY };
    }, false);
    c.style.opacity = 0.6;
    var i = 0;
    var shaderButton = document.createElement('button');
    document.getElementsByTagName('body')[0].appendChild(shaderButton);
    shaderButton.style = "position:absolute; top:10px; left:10px;";
    shaderButton.innerHTML = "Turn on the shader or something lol";
    shaderButton.style.display = 'none';
    shaderButton.onclick = function() {input.set_convar('ren_background', false);}
    var grd = ctx3.createRadialGradient(c3.width / 2, c3.height / 2, 20 / 2, c3.width / 2, c3.height / 2, Math.sqrt(Math.pow(c3.width / 2, 2) + Math.pow(c3.height / 2, 2)));
    grd.addColorStop(0, "#FFFFFF");
    grd.addColorStop(1, "#000000");
    function loop1() {
        i++;
        ctx3.fillStyle = grd;
        ctx3.fillRect(0, 0, 1920 / shadowRes, 1080 / shadowRes);
        ctx2.clearRect(0, 0, 1920 / shadowRes, 1080 / shadowRes);
        ctx2.drawImage(c, -40 / shadowRes, -40 / shadowRes, 1920 / shadowRes + 80 / shadowRes, 1080 / shadowRes + 80 / shadowRes);
        ctx4.clearRect(0, 0, c4.width, c4.height);
        ctx4.drawImage(c, 0, 0, 1920 / shadowRes, 1080 / shadowRes);
        requestAnimationFrame(loop1);
    }
    loop1();
})();