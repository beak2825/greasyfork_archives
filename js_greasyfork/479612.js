// ==UserScript==
// @name         cloud wife
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  control the web video.
// @author       You
// @match        https://yunlaopo.com/*
// @match        https://doure.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=doure.net
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.7.28/dist/sweetalert2.all.min.js
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479612/cloud%20wife.user.js
// @updateURL https://update.greasyfork.org/scripts/479612/cloud%20wife.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Your code here...
    GM_addStyle("https://cdn.jsdelivr.net/npm/sweetalert2@11.7.28/dist/sweetalert2.min.css");
    var log = console.log;
    function main() {
        log("main...")
        var myPlayer = player;
        if (myPlayer) {
            myPlayer.off("timeupdate");
            var txt = "已经移除试看【60秒】限制！";
            Swal.fire({
                icon: "success",
                title: txt,
                showConfirmButton: false,
                timer: 1500
            })
        } else {
            var txt2 = "player is null";
            Swal.fire({
                icon: "error",
                title: txt2,
                showConfirmButton: true,
            })
        }
    }

    // 页面加载监听
    if (document.readyState === "complete") {
        // DOM 已经加载完成
        main();
    } else {
        // DOM 还未加载完成
        // document.addEventListener("DOMContentLoaded", main);
        window.onload = main;
    }

    // 按键监听
    document.addEventListener("keydown", function (event) {
        log("keydown", event.code);
        var myPlayer = player;
        if (!myPlayer) {
            log("player is null");
            return;
        }
        // 暂停or播放视频
        if (event.code === "Space") {
            event.preventDefault();
            if (myPlayer.paused()) {
                myPlayer.play();
            } else {
                myPlayer.pause();
            }
            // 快进or快退视频
        } else if (event.code === "ArrowLeft" || event.code === "ArrowRight") {
            event.preventDefault();
            var offset_time = 10;
            // 左箭头键
            if (event.code === "ArrowLeft") {
                myPlayer.currentTime(myPlayer.currentTime() - offset_time);
                // 右箭头键
            } else if (event.code === "ArrowRight") {
                myPlayer.currentTime(myPlayer.currentTime() + offset_time);
            }
            // 调整音量
        } else if (event.code === "ArrowUp" || event.code === "ArrowDown") {
            event.preventDefault();
            var offset_volume = 0.1
            // 上箭头键
            if (event.code === "ArrowUp") {
                myPlayer.volume(myPlayer.volume() + offset_volume);
                // 下箭头键
            } else if (event.code === "ArrowDown") {
                myPlayer.volume(myPlayer.volume() - offset_volume);
            }
            // 切换全屏模式
        } else if (event.code === "KeyF" || event.code === "Enter") {
            event.preventDefault();
            if (!myPlayer.isFullscreen()) {
                myPlayer.requestFullscreen();
            } else {
                myPlayer.exitFullscreen();
            }
        }
    });
})();
