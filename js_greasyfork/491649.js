// ==UserScript==
// @name         Agario Viewport Control
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Control viewport movement on agario.xingkong.tw with arrow keys, and center viewport with S key
// @author       jack9246
// @match        https://agario.xingkong.tw/*
// @grant        jack9246
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/491649/Agario%20Viewport%20Control.user.js
// @updateURL https://update.greasyfork.org/scripts/491649/Agario%20Viewport%20Control.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 監聽按鍵事件，並根據按下的按鍵來移動視窗
    window.addEventListener('keydown', function(event) {
        var X, Y;
        switch(event.keyCode) {
            case 83: // S鍵
                X = window.innerWidth / 2;
                Y = window.innerHeight / 2;
                break;
            case 38: // 上箭頭鍵
                X = window.innerWidth / 2;
                Y = -10000000;
                break;
            case 40: // 下箭頭鍵
                X = window.innerWidth / 2;
                Y = window.innerHeight * 99999;
                break;
            case 37: // 左箭頭鍵
                X = -10000000;
                Y = window.innerHeight / 2;
                break;
            case 39: // 右箭頭鍵
                X = window.innerWidth * 99999;
                Y = window.innerHeight / 2;
                break;
            default:
                return; // 如果按下的鍵不是我們感興趣的鍵，則不執行任何操作
        }

        // 觸發滑鼠移動事件以移動視窗
        $("canvas").trigger($.Event("mousemove", {clientX: X, clientY: Y}));
    });

})();
