// ==UserScript==
// @name         打字音效
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  打字音效，可以换成你自己要的音频文件。
// @author       Techwb.cn
// @match        https://*/*
// @match        http://*/*
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/460470/%E6%89%93%E5%AD%97%E9%9F%B3%E6%95%88.user.js
// @updateURL https://update.greasyfork.org/scripts/460470/%E6%89%93%E5%AD%97%E9%9F%B3%E6%95%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var audio = new Audio("https://www.soundjay.com/buttons/button-16.mp3"); // 更改此 URL 以使用您自己的音频文件
    document.addEventListener("keydown", function(event) {
        audio.currentTime = 0; // 重置音频以确保每次按键都会播放完整的声音
        audio.play();
    });
})();
