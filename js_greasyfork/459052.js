// ==UserScript==
// @name                mo (LDH) 图片解锁器
// @namespace           https://1mether.me/
// @version             0.6
// @description         解锁mo页面图片右键功能
// @author              乙醚(@locoda)
// @match               http*://m.tribe-m.jp/*
// @match               http*://m.ex-m.jp/*
// @match               http*://m.ldh-m.jp/*
// @match               http*://m.ldhgirls-m.jp/*
// @icon                https://www.google.com/s2/favicons?sz=64&domain=ldh.co.jp
// @source              https://github.com/locoda/mo-downloader
// @grant               none
// @license             MIT
// @downloadURL https://update.greasyfork.org/scripts/459052/mo%20%28LDH%29%20%E5%9B%BE%E7%89%87%E8%A7%A3%E9%94%81%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/459052/mo%20%28LDH%29%20%E5%9B%BE%E7%89%87%E8%A7%A3%E9%94%81%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    "use strict";
    // 移除右键限制
    document.oncontextmenu = function () {
        return true;
    };
    // 移除protectimg限制
    document
        .querySelectorAll(".protectimg")
        .forEach((node) => node.classList.remove("protectimg"));
    // 监控 DOM 变化
    var observer = new MutationObserver(function (mutations, observer) {
        console.log(mutations)
        // 如果有变化再移除protectimg限制
        document
            .querySelectorAll(".protectimg")
            .forEach((node) => node.classList.remove("protectimg"));
    });
    observer.observe(document, {
        subtree: true,
        childList: true,
    });
})();
