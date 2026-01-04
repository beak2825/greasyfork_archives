// ==UserScript==
// @name         赛尔号启航全屏
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Seer2FullScreen
// @include         http://s.61.com/*
// @author       Abaddon
// @match           https://s.61.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license         GPL-3.0-or-later
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481445/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%90%AF%E8%88%AA%E5%85%A8%E5%B1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/481445/%E8%B5%9B%E5%B0%94%E5%8F%B7%E5%90%AF%E8%88%AA%E5%85%A8%E5%B1%8F.meta.js
// ==/UserScript==

(function() {
    var divB = document.createElement("div");
    divB.style.position = "fixed";
    divB.style.zIndex = 999990;
    // 创建全屏按钮
    var fullscreenButton = document.createElement('button');
    fullscreenButton.innerHTML = '全屏';
    fullscreenButton.style.position = 'fixed';
    fullscreenButton.style.top = '10%';
    fullscreenButton.style.left = '3%';
    fullscreenButton.style.padding = '1px';
    fullscreenButton.style.backgroundColor = '#000';
    fullscreenButton.style.color = '#fff';
    fullscreenButton.style.cursor = 'pointer';

    // 进入全屏模式
    function enterFullscreen() {
        var element = document.documentElement;
        if (element.requestFullscreen) {
            element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) {
            element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
        }
    }

    // 为按钮添加点击事件
    fullscreenButton.addEventListener('click', enterFullscreen);
    divB.appendChild(fullscreenButton)
    setTimeout(() => {
            // 将 div 添加到页面中
            let frontPage = document.getElementsByTagName("html")[0]
            frontPage .appendChild(divB);
    }, 5000)

})();