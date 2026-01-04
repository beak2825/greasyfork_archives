// ==UserScript==
// @name         FuckJianShuMobile
// @namespace    https://greasyfork.org/users/439775
// @version      0.1
// @description  简书移动页面去除虚假广告图标，自动展开
// @author       EricSong
// @match        http*://www.jianshu.com/p/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/395845/FuckJianShuMobile.user.js
// @updateURL https://update.greasyfork.org/scripts/395845/FuckJianShuMobile.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelector(".close-collapse-btn").click();
    document.querySelector('div[class^="ad-container"]').remove();
    window.fuckIconInterval = setInterval(function() {
        var fuckIcon = document.querySelector(".fubiao-dialog");
        if (fuckIcon) {
            fuckIcon.remove();
            clearInterval(window.fuckIconInterval);
        }
    }, 10);
})();