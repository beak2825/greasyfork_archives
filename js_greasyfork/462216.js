// ==UserScript==
// @name         去除B站全屏直播礼物栏
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  去除观看B站全屏直播下方的礼物栏
// @author       You
// @match        https://live.bilibili.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/462216/%E5%8E%BB%E9%99%A4B%E7%AB%99%E5%85%A8%E5%B1%8F%E7%9B%B4%E6%92%AD%E7%A4%BC%E7%89%A9%E6%A0%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/462216/%E5%8E%BB%E9%99%A4B%E7%AB%99%E5%85%A8%E5%B1%8F%E7%9B%B4%E6%92%AD%E7%A4%BC%E7%89%A9%E6%A0%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 定义一个函数，用于根据id移除元素
    function removeElement(id) {
        // 根据id获取元素
        var element = document.getElementById(id);

        // 如果元素存在，就从其父节点中移除它
        if (element) {
            element.parentNode.removeChild(element);
        }
    }

    // 调用函数，移除id为gift-control-vm的元素
    removeElement("gift-control-vm");

    // 创建一个变动观察者对象，用于监视文档体中的节点变化
    var observer = new MutationObserver(function(mutations) {
        // 对于变动列表中的每一条变动记录
        for (var mutation of mutations) {
            // 如果变动类型是childList，意味着有节点被添加或移除了
            if (mutation.type === "childList") {
                // 再次调用函数，移除id为gift-control-vm的元素
                removeElement("gift-control-vm");
            }
        }
    });

    // 开始观察文档体，设置childList选项为true
    observer.observe(document.body, {childList: true});
})();