// ==UserScript==
// @name         厅雨 助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  调小音量，并且监听全局的空格键使得播放暂停音乐更加方便
// @author       Blithe-Chiang
// @match        http://tingyu.pro/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421093/%E5%8E%85%E9%9B%A8%20%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/421093/%E5%8E%85%E9%9B%A8%20%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    window.onload = function() {
        // 设置音量，小一点
        const volumnRain = document.getElementById("volumn_rain");
        const volumnMusic = document.getElementById("volumn_music");
        volumnRain.value = 0.16
        volumnMusic.value = 0.16
        setVolume(1)
        setVolume(2)
        document.onkeyup = function (event) {
            // 如果是播放按钮发出的事件的话，不理他
            if (event.target == playBtn) {
                return
            }

            // 监听空格键
            if (event.code == 'Space') {
               playAudio()
           }
        }
    }
})();