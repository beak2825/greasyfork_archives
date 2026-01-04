// ==UserScript==
// @name         删除斗鱼广告自用
// @namespace    https://github.com/machenme/
// @version      0.2
// @description  删除斗鱼广告
// @author       zsjng
// @license      MIT
// @match			*://*.douyu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douyu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/459072/%E5%88%A0%E9%99%A4%E6%96%97%E9%B1%BC%E5%B9%BF%E5%91%8A%E8%87%AA%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/459072/%E5%88%A0%E9%99%A4%E6%96%97%E9%B1%BC%E5%B9%BF%E5%91%8A%E8%87%AA%E7%94%A8.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 等待10秒后执行删除广告的函数
    setTimeout(function() {
        var removalbes = ["js-room-activity", "js-bottom"];
        for (var i = 0; i < removalbes.length; i++) {
            var element = document.getElementById(removalbes[i]);
            if (element) {
                element.parentNode.removeChild(element);
            }
        }
    }, 10000); // 10000毫秒 = 10秒
})();