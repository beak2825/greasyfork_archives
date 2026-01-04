// ==UserScript==
// @name         巨龙pmp直播回放助手
// @namespace    https://xiaoeknow.com
// @version      1.3
// @description  巨龙pmp直播回放助手.
// @author       tuite
// @match        https://**.xiaoeknow.com/**
// @grant        none
// @license
// @downloadURL https://update.greasyfork.org/scripts/445470/%E5%B7%A8%E9%BE%99pmp%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/445470/%E5%B7%A8%E9%BE%99pmp%E7%9B%B4%E6%92%AD%E5%9B%9E%E6%94%BE%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';
    var plays = document.createElement('span');
    plays.style.cssText = 'position: absolute;\n' +
        '        top: 0;\n' +
        '        right: 0;\n' +
        '        font-size: 50px;\n' +
        '        flood-color: #73f6e2;\n' +
        '        z-index: 999999999999999;';
    plays.innerText = '加速';
    plays.onclick = function () {
        document.getElementsByTagName('video')[0].playbackRate = 2.3;
        plays.innerText = 2.3;
    }
    document.body.appendChild(plays);

    window.addEventListener("keypress", function (e) {
        var video = document.getElementsByTagName('video')[0];
        var pr = video.playbackRate;
        if (e.code == "Space") {
            var isp = video.paused;
            if (isp) {
                video.play()
            } else {
                video.pause()
            }
            setTimeout(function () {
                video.playbackRate = pr;
            }, 500);
            return;
        }
        if (e.key == "+") {
            var newpr = pr + 0.1;
            video.playbackRate = newpr;
            plays.innerText = newpr.toFixed(1);
            return;
        }
        if (e.key == "-") {
            var newpr = pr - 0.1;
            video.playbackRate = newpr;
            plays.innerText = newpr.toFixed(1);
            return;
        }
    });


})();
