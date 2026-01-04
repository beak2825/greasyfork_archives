// ==UserScript==
// @name         Diep Custom Background
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Custom backgrounds for diep.io.
// @author       Adasba
// @license      MIT
// @match        http://*diep.io/*
// @match        https://*diep.io/*
// @match        *://diep.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445564/Diep%20Custom%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/445564/Diep%20Custom%20Background.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var img = document.createElement('img');
    img.style = "z-index:-1;position:fixed;top:0px;left:0px";
    document.getElementsByTagName('body')[0].appendChild(img);



    var shaderButton = document.createElement('button');
    document.getElementsByTagName('body')[0].appendChild(shaderButton);
    var bg = true;
    shaderButton.style = "position:absolute; top:0px; left:0px;";
    shaderButton.innerHTML = "BG on/off";
    shaderButton.onclick = function() {
        bg = !bg;
        input.set_convar('ren_background', bg);
    }
    
    function loop1() {
        img.src = "https://upload.wikimedia.org/wikipedia/commons/8/80/Backgorund.gif";
    }
    setInterval(loop1, 1000);
})();