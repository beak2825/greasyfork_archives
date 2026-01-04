// ==UserScript==
// @name         CCTV加强
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  为CCTV直播增加一些快捷键
// @author       xujinkai
// @license      MIT
// @match        https://tv.cctv.com/live/*
// @icon         http://tv.cctv.com/favicon.ico
// @homepage     https://greasyfork.org/zh-CN/scripts/502926-cctv%E5%8A%A0%E5%BC%BA
// @downloadURL https://update.greasyfork.org/scripts/502926/CCTV%E5%8A%A0%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/502926/CCTV%E5%8A%A0%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getDomPlayer() {
        return document.getElementById("h5player_player");
    }

    function AddKeyListen() {
        var player = getDomPlayer();
        player.addEventListener('mousedown', function (e) {
            if (e.button === 1) { // Middle mouse button
                document.getElementById('player_pagefullscreen_player').click();
                e.preventDefault();
            }
        });
        document.body.addEventListener('keydown', function (e) {
            var keycode = e.keyCode;
            const TimeStepBig = 10;
            const TimeStepSmall = 3;
            switch (keycode) {
                case 37: // Left arrow
                    if (e.ctrlKey){
                        if (player.currentTime > TimeStepBig) player.currentTime -= TimeStepBig;
                        else player.currentTime = 0;
                    } else {
                        if (player.currentTime > TimeStepSmall) player.currentTime -= TimeStepSmall;
                        else player.currentTime = 0;
                    }
                    e.preventDefault();
                    break;
                case 39: // Right arrow
                    var cached = player.buffered.end(0);
                    if (e.ctrlKey){
                        if (player.currentTime < cached - TimeStepBig) player.currentTime += TimeStepBig;
                        else player.currentTime = cached;
                    } else {
                        if (player.currentTime < cached - TimeStepSmall) player.currentTime += TimeStepSmall;
                        else player.currentTime = cached;
                    }
                    e.preventDefault();
                    break;
                case 38: // Up arrow
                    player.volume = Math.min(player.volume + 0.1, 1);
                    e.preventDefault();
                    break;
                case 40: // Down arrow
                    player.volume = Math.max(player.volume - 0.1, 0);
                    e.preventDefault();
                    break;
                case 13: // Enter
                    if (e.ctrlKey) {
                        document.getElementById('player_fullscreen_player').click();
                    } else {
                        document.getElementById('player_pagefullscreen_player').click();
                    }
                    e.preventDefault();
                    break;
                default:
                    // Do nothing for other keys
            }
        });
    }

    function addTitleToProgramListItems() {
        var listItems = document.querySelectorAll("#jiemu.program_list li");
        listItems.forEach(function(li) {
            var firstAnchor = li.querySelector("a");
            if (firstAnchor) {
                li.title = firstAnchor.textContent;
            }
        });
    }

    window.onload = function() {
        AddKeyListen();
        addTitleToProgramListItems();
    };
})();