// ==UserScript==
// @name         亚马逊后台在新标签页中打开
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  在亚马逊管理后台时，所有点击的网页都在新标签页中打开
// @author       祀尘
// @match        https://sellercentral.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/500915/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%90%8E%E5%8F%B0%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/500915/%E4%BA%9A%E9%A9%AC%E9%80%8A%E5%90%8E%E5%8F%B0%E5%9C%A8%E6%96%B0%E6%A0%87%E7%AD%BE%E9%A1%B5%E4%B8%AD%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截左键单击事件并阻止其默认行为，并模拟鼠标中键点击打开链接，但不包括类名为 nav-button 或 backdrop backdrop-visible 的元素
    document.addEventListener('click', function(event) {
        if (event.button === 0) { // 0 代表鼠标左键
            let anchor = event.target.closest('a');
            if (anchor && !anchor.classList.contains('nav-button') && !anchor.classList.contains('backdrop')) {
                event.preventDefault(); // 阻止默认左键点击行为
                event.stopPropagation(); // 阻止事件传播

                // 打开链接的方式可以根据需要调整，这里使用 window.open 打开新标签页
                window.open(anchor.href, '_blank');
            }
        }
    }, true);

})();
