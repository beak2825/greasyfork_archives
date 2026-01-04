// ==UserScript==
// @name         盘友社区自动回复
// @namespace    https://greasyfork.org/zh-CN/scripts/463677-%E7%9B%98%E5%8F%8B%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D
// @version      0.3
// @description  盘友社区自动回复。
// @author       Blazing
// @match      https://panyoubbs.xyz/thread/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=panyoubbs.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463677/%E7%9B%98%E5%8F%8B%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/463677/%E7%9B%98%E5%8F%8B%E7%A4%BE%E5%8C%BA%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==

(function() {

    window.addEventListener('load', function() {

        setTimeout(function() {
            var linkText = "[点击回复]";
            var elements = document.querySelectorAll('.jm a');
            for (var i = 0; i < elements.length; i++) {
                if (elements[i].textContent === linkText) {
                    var textarea = document.getElementById('content');
                    var messages = ["感谢盘主无私分享", "楼主发贴辛苦了，谢谢楼主的精彩分享！", "这不正是我苦苦寻找的资源吗！", "好人一生平安", "感谢盘主无私分享", "这么好的资源都没人回复，还有王法吗？", "好资源啊，先收藏起来，以后细细观看…"];
                    var index = Math.floor(Math.random() * messages.length);
                    textarea.value = messages[index];
                    var button = document.querySelector('[lay-filter="thread-post"]');
                    button.click();
                }
            }
        }, 1000);
    });


})();