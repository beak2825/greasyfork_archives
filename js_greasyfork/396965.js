// ==UserScript==
// @name         雨课堂追帧
// @version      0.1.4
// @description  雨课堂直播追帧：保持延迟在 3s 内
// @author       panda2134
// @match        *://*.yuketang.cn/*
// @run-at       document-idle
// @grant        none
// @namespace https://greasyfork.org/users/379925
// @downloadURL https://update.greasyfork.org/scripts/396965/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%BF%BD%E5%B8%A7.user.js
// @updateURL https://update.greasyfork.org/scripts/396965/%E9%9B%A8%E8%AF%BE%E5%A0%82%E8%BF%BD%E5%B8%A7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var player, intv;
    function checkLatency() {
        var latency = player.buffered.end(0) - player.currentTime;
        var MAX_LATENCY = 3.00;

        document.getElementById('latency').innerText = '延迟：' + latency.toFixed(2);

        if (latency > MAX_LATENCY) {
            console.log('追帧');
            player.playbackRate = 1.1;
            player.ontimeupdate = function() {
                if(player.buffered.end(0) - player.currentTime < 1) {
                    player.playbackRate = 1.00;
                }
            };
        }
    }
    setTimeout(function() {
        player = document.getElementById('player');
        if(!player) return;
        if (!(document.getElementById('latency'))) {
            var div = document.createElement('div'), controls = document.getElementsByClassName('video__controls')[0],
                cr = document.getElementsByClassName('controls__right')[0];
            div.style = 'font-size: 14px;';
            div.id = 'latency';
            controls.insertBefore(div, cr)
        }

        player.onplaying = function() {
            intv = setInterval(checkLatency, 500);
        };
        player.onwaiting = function() { clearInterval(intv) };
        player.onpaused = function() { clearInterval(intv) };
    }, 1000)
})();