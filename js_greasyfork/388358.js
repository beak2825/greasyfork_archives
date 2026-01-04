// ==UserScript==
// @name         YouTube - Seek 1 sec by Ctrl+Arrow key
// @namespace    https://twitter.com/4chouyou
// @version      0.0.2
// @description  Ctrl+矢印キーで1秒づつシークします 小数点以下を丸めてシークするのでタイムスタンプの作成に便利です
// @author       mufuuuu
// @match        https://www.youtube.com/*
// @grant        none
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/388358/YouTube%20-%20Seek%201%20sec%20by%20Ctrl%2BArrow%20key.user.js
// @updateURL https://update.greasyfork.org/scripts/388358/YouTube%20-%20Seek%201%20sec%20by%20Ctrl%2BArrow%20key.meta.js
// ==/UserScript==
/* jshint esversion: 6 */

(function() {
    window.addEventListener('keydown', e => {
        let keyCode = e.keyCode;
        if(e.ctrlKey) { // Ctrlキーが押下されている
            if(!document.activeElement.classList.contains('ytp-volume-panel')) { // 音量調節にフォーカスがない
                if(!isInputElement(document.activeElement)) { // 文字入力中ではない
                    if(e.shiftKey) {
                        if(keyCode === 37) { // Left arrow key
                            e.stopImmediatePropagation();
                            seekVideo(-30); // 30sec戻る
                        }
                        if(keyCode === 39) { // Right arrow key
                            e.stopImmediatePropagation();
                            seekVideo(30); // 30sec進む
                        }
                    }else {
                        if(keyCode === 37) { // Left arrow key
                            e.stopImmediatePropagation();
                            seekVideo(-1); // 1sec戻る
                        }
                        if(keyCode === 39) { // Right arrow key
                            e.stopImmediatePropagation();
                            seekVideo(1); // 1sec進む
                        }
                    }
                }
            }
        }
    }, true);

    function seekVideo(sec) {
        let video = document.querySelector('.html5-video-container > video');
        if(video) {
            let targetTime = Math.max(0, video.currentTime + sec);
            targetTime = (sec > 0 || !video.paused) ? Math.floor(targetTime) : Math.ceil(targetTime);
            video.currentTime = targetTime;
        }
    }

    function isInputElement(target) {
        let element = target;
        if(element.nodeType == 3) element = element.parentNode;
        return (element.tagName == 'INPUT' || element.tagName == 'TEXTAREA' || element.getAttribute('contenteditable') == 'true');
    }
})();