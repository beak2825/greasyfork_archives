// ==UserScript==
// @name         网页端酷狗音乐打开可下载音频连接
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  位于酷狗音乐的“网页端”播放界面时，按下快捷键K，自动打开这首歌的可下载链接（目前仅支持MP3格式，因为这个页面的链接指向的只有相应歌曲的MP3）
// @author       与歌一生
// @match        https://www.kugou.com/*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/525116/%E7%BD%91%E9%A1%B5%E7%AB%AF%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%E6%89%93%E5%BC%80%E5%8F%AF%E4%B8%8B%E8%BD%BD%E9%9F%B3%E9%A2%91%E8%BF%9E%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/525116/%E7%BD%91%E9%A1%B5%E7%AB%AF%E9%85%B7%E7%8B%97%E9%9F%B3%E4%B9%90%E6%89%93%E5%BC%80%E5%8F%AF%E4%B8%8B%E8%BD%BD%E9%9F%B3%E9%A2%91%E8%BF%9E%E6%8E%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function handleKeyPress(event) {
        if (event.key === 'k' || event.key === 'K') {
            const audioElement = document.getElementById('myAudio');
            if (audioElement) {
                const audioSrc = audioElement.getAttribute('src');
                window.open(audioSrc, '_blank');
            }
        }
    }

    window.addEventListener('keydown', handleKeyPress);

})();