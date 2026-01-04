// ==UserScript==
// @name         Sandbox fast feeding
// @version      2.3
// @author       Shädam
// @match        *://diep.io/*
// @grant        none
// @namespace https://greasyfork.org/users/176941
// @description none
// @downloadURL https://update.greasyfork.org/scripts/375673/Sandbox%20fast%20feeding.user.js
// @updateURL https://update.greasyfork.org/scripts/375673/Sandbox%20fast%20feeding.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var a;
    var ww, wh;
    function mouseClick(x, y) {
        input.mouse(x, y);
        canvas.dispatchEvent(new MouseEvent('mousedown', { 'clientX': x, 'clientY': y, 'button': 0, 'mozPressure' : 1.0 }));
        canvas.dispatchEvent(new MouseEvent('mouseup', { 'clientX': x, 'clientY': y, 'button': 0, 'mozPressure' : 1.0 }));
    }
    function bot() {
        if(flag === 1) {
            flag = 0;
            input.keyDown(75);
            setTimeout(() => input.keyUp(75), 2000);
            input.set_convar('game_stats_build','77777778888888');
            setTimeout(() => {
                mouseClick(ww / 8, wh / 4);
                setTimeout(() => {
                    mouseClick(ww / 20, wh / 10);
                    setTimeout(() => {
                        mouseClick(ww / 20, wh / 10);
                        setTimeout(() => {
                            input.mouse(9999, 9999);
                            input.keyDown(68);
                            input.keyDown(83);
                            input.keyDown(69);
                        }, 500);
                    }, 750);
                }, 750);
            }, 1000);
        }
    }
    var flag = 1;
    setInterval(function() {
        ww = window.innerWidth;
        wh = window.innerHeight;
        a = document.getElementById("a").style.display;
        if((a === "block" || a === "") && a !== null) {
            input.keyUp(68);
            input.keyUp(83);
            input.keyUp(69);
            input.keyDown(13);
            setTimeout(() => input.keyUp(13), 500);
            flag = 1;
        } else {
            bot();
        }
    }, 2000);
})();