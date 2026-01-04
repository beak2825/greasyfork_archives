// ==UserScript==
// @name        TypingClub 隐藏键盘（原vip功能）
// @namespace   https://github.com/nelvko/script/blob/master/youhou/hidden-keyboard.js
// @match        *://*.edclub.com/sportal/*
// @match        *://*.typingclub.com/sportal/*
// @grant       none
// @version     1.1
// @author      nelvko
// @license MIT
// @description 闯关时隐藏下面的键盘
// @icon https://static.typingclub.com/m/favicon.png
// @downloadURL https://update.greasyfork.org/scripts/513014/TypingClub%20%E9%9A%90%E8%97%8F%E9%94%AE%E7%9B%98%EF%BC%88%E5%8E%9Fvip%E5%8A%9F%E8%83%BD%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/513014/TypingClub%20%E9%9A%90%E8%97%8F%E9%94%AE%E7%9B%98%EF%BC%88%E5%8E%9Fvip%E5%8A%9F%E8%83%BD%EF%BC%89.meta.js
// ==/UserScript==
(function () {
    'use strict';
    const observer = new MutationObserver((mutations, observer) => {
        const keyboard = document.getElementsByClassName("keyboard-plugin");
        const ad = document.getElementById("adslot_video")
        // console.log("keyboard", keyboard);
        // console.log("ad", ad);

        if (keyboard && keyboard[0]) {
            keyboard[0].style.setProperty('visibility', 'hidden', 'important');
        }
        if (ad) {
            ad.style.setProperty('visibility', 'hidden', 'important');
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
})();
