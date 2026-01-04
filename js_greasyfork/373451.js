// ==UserScript==
// @name         清爽直播
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  去除直播页下方礼物面板等
// @author       greasyblade
// @match        *://live.bilibili.com/*
// @match        *://www.douyu.com/*
// @match        *://www.quanmin.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373451/%E6%B8%85%E7%88%BD%E7%9B%B4%E6%92%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/373451/%E6%B8%85%E7%88%BD%E7%9B%B4%E6%92%AD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // live.bilibili.com/*
    if (location.hostname === 'live.bilibili.com') {
        window.onload = () => {
            if (document.getElementById("gift-control-vm")) {
                document.getElementById("gift-control-vm").remove();
            }
            if (document.getElementById("rank-list-vm")) {
                document.getElementById("rank-list-vm").remove();
            }
        };
    }

    // douyu.com/*
    if (location.hostname === 'www.douyu.com') {
        window.onload = () => {
            if (document.getElementById("js-player-toolbar")) {
                document.getElementById("js-player-toolbar").remove();
            }
            if (document.getElementsByClassName("layout-Player-video")[0]) {
                document.getElementsByClassName("layout-Player-video")[0].setAttribute("style","bottom: 0px;");
            }
        };
        let auto1 = setInterval(() => {
            if (document.getElementsByClassName("layout-Player-rankAll").length > 0) {
                document.getElementsByClassName("layout-Player-rankAll")[0].remove();
            }
        }, 500);

        let auto2 = setInterval(() => {
            if (document.getElementsByClassName("layout-Player-rank").length > 0) {
                document.getElementsByClassName("layout-Player-rank")[0].remove();
            }
        }, 500);
        let auto3 = setInterval(() => {
            if (document.getElementsByClassName("Bottom-ad")[0]) {
                document.getElementsByClassName("Bottom-ad")[0].remove();
                clearInterval(auto3);
            }
        }, 50);
        let auto4 = setInterval(() => {
            if (document.getElementById("js-player-barrage")) {
                document.getElementById("js-player-barrage").setAttribute("style","top: 0px;");
            }
        }, 500);
    }

    // quanmin.tv/*
    if (location.hostname === 'www.quanmin.tv') {
        window.onload = () => {
            if (document.getElementsByClassName("room_w-giftbar").length > 0) {
                document.getElementsByClassName("room_w-giftbar")[0].remove();
            }
            if (document.getElementsByClassName("guide-login-wrap").length > 0) {
                document.getElementsByClassName("guide-login-wrap")[0].remove();
            }
            //热门推广
            if (document.getElementsByClassName('room_w-tabs_header-item').length > 1) {
                document.getElementsByClassName('room_w-tabs_header-item')[1].remove();
            }
            if (document.getElementsByClassName('room_p-room_rank').length > 0) {
                document.getElementsByClassName('room_p-room_rank')[0].remove();
            }
        };
    }
})();