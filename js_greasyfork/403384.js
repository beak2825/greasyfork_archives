// ==UserScript==
// @name         YT播放速度修改器
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  播放速度透過+/-改變
// @author       Zoosewu
// @match        https://www.youtube.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/403384/YT%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E4%BF%AE%E6%94%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/403384/YT%E6%92%AD%E6%94%BE%E9%80%9F%E5%BA%A6%E4%BF%AE%E6%94%B9%E5%99%A8.meta.js
// ==/UserScript==
var player = document.getElementsByTagName("video")[0];

(function() {
    document.onkeydown=function(e){//對整個頁面文件監聽
        var keyNum=window.event ? e.keyCode :e.which;//獲取被按下的鍵值
        //判斷如果使用者按下了回車鍵（keycody=13）

        if(keyNum==107){
            console.log('按下了+');
            player.playbackRate = player.playbackRate + 0.25;
        }
        //判斷如果使用者按下了空格鍵(keycode=32)，
        if(keyNum==109){
            console.log('按下了-');
            player.playbackRate = player.playbackRate - 0.25;
        }
    }
})();

