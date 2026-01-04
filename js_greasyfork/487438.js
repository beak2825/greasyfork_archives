// ==UserScript==
// @name         bilibili原标签页覆盖打开
// @namespace    http://tampermonkey.net/
// @version      0.2
// @author       You
// @match        https://*.bilibili.com/*
// @license MIT
// @grant        none
// @description Youtube新标签页打开.
// @downloadURL https://update.greasyfork.org/scripts/487438/bilibili%E5%8E%9F%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%A6%86%E7%9B%96%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/487438/bilibili%E5%8E%9F%E6%A0%87%E7%AD%BE%E9%A1%B5%E8%A6%86%E7%9B%96%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 在页面完全加载后执行操作
    window.onload = function() {
        // 添加点击事件监听器
        document.addEventListener('click', function(e) {
            // 寻找点击的元素或其父元素是否为链接，一直向上遍历直到找到链接元素
            var targetLink = e.target;
            while (targetLink && targetLink.tagName !== 'A') {
                targetLink = targetLink.parentNode;
            }

            // 如果找到了链接元素，并且链接的 target 属性为 "_blank"，则修改为 "_self"
            if (targetLink && targetLink.target === '_blank') {
                targetLink.target = '_self';
            }
        });
    };
})();