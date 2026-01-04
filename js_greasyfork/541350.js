// ==UserScript==
// @name         poipiku解锁右键保存限制
// @namespace    https://greasyfork.org/zh-CN/users/325815
// @version      1.0
// @description  允许你在poipiku中右键点击图片，展开浏览器原生菜单。
// @author       monat151
// @license      none
// @match        http*://poipiku.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=poipiku.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541350/poipiku%E8%A7%A3%E9%94%81%E5%8F%B3%E9%94%AE%E4%BF%9D%E5%AD%98%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/541350/poipiku%E8%A7%A3%E9%94%81%E5%8F%B3%E9%94%AE%E4%BF%9D%E5%AD%98%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 移除图片上的 oncontextmenu 限制
    function enableImageRightClick() {
        document.querySelectorAll('img').forEach((img) => {
            img.oncontextmenu = null;
            img.removeAttribute('oncontextmenu');
            img.style.pointerEvents = 'auto';
        });
    }

    // 移除页面全局禁止右键的事件监听
    function removeGlobalContextMenuBlock() {
        document.oncontextmenu = null;
        window.oncontextmenu = null;

        // 用事件监听器移除方式（事件捕获阶段）
        document.addEventListener(
            'contextmenu',
            function (e) {
                e.stopPropagation(); // 阻止其他监听器
            },
            true
        );
    }

    // 启动处理
    function init() {
        removeGlobalContextMenuBlock();
        enableImageRightClick();
        // 监听页面变动（适用于懒加载或异步加载图片）
        const observer = new MutationObserver(() => {
            enableImageRightClick();
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    window.addEventListener('load', init);
})();