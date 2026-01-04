// ==UserScript==
// @name         键盘邦邦
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  嘤嘤嘤
// @author       flaribbit
// @match        https://bangplayer.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419486/%E9%94%AE%E7%9B%98%E9%82%A6%E9%82%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/419486/%E9%94%AE%E7%9B%98%E9%82%A6%E9%82%A6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var skeys = "zxcvbnm";
    var keys = {};
    var keydown = {};
    for (var i = 0; i < 7; i++) {
        keys[skeys[i]] = i - 3;
        keydown[skeys[i]] = false;
    }

    function getKeyPos(key) {
        var gamecanvas = document.querySelector("#game");
        var keyposy = 0;
        var width = gamecanvas.height * 16 / 9;
        if (width > gamecanvas.width) {
            //太高了
            width = gamecanvas.width;
            keyposy = 0.5 * gamecanvas.height + 0.38 * width * 9 / 16;
        } else {
            //太宽了
            keyposy = gamecanvas.height * 0.88;
        }
        width /= 8.4;
        return { clientX: Math.round(gamecanvas.width / 2 + width * keys[key]), clientY: keyposy }
    }
    document.onkeydown = function (e) {
        if (e.key in keys) {
            if (keydown[e.key] == false) {
                document.querySelector("#game").dispatchEvent(new PointerEvent("pointerdown", getKeyPos(e.key)));
                console.log("按下", e.key);
            }
            keydown[e.key] = true;
        }
    }
    document.onkeyup = function (e) {
        if (e.key in keys) {
            document.querySelector("#game").dispatchEvent(new PointerEvent("pointerup", getKeyPos(e.key)));
            console.log("松开", e.key);
            keydown[e.key] = false;
        }
    }
})();
