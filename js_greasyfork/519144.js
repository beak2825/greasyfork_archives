// ==UserScript==
// @name         哔哩哔哩关注列表自动点击最常访问按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击最常访问按钮
// @author       fengmas
// @match        https://space.bilibili.com/*/relation/follow*
// @match        https://space.bilibili.com/*/relation/follow?*
// @match        https://space.bilibili.com/*/fans/follow?*
// @match        https://space.bilibili.com/*/fans/follow*
// @license       MIT

// @downloadURL https://update.greasyfork.org/scripts/519144/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%9C%80%E5%B8%B8%E8%AE%BF%E9%97%AE%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/519144/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%85%B3%E6%B3%A8%E5%88%97%E8%A1%A8%E8%87%AA%E5%8A%A8%E7%82%B9%E5%87%BB%E6%9C%80%E5%B8%B8%E8%AE%BF%E9%97%AE%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面完全加载
    window.addEventListener('load', function() {
        // 增加延迟，确保按钮已经渲染完成
        setTimeout(function() {
            // 使用选择器找到按钮
            var button = document.querySelector('.radio-filter__item:nth-child(2)');
            if (button) {
                console.log('按钮已找到，尝试点击');
                // 创建一个鼠标点击事件
                var event = new MouseEvent('click', {
                    bubbles: true,
                    cancelable: true,
                    view: window
                });
                // 触发点击事件
                button.dispatchEvent(event);
            } else {
                console.log('按钮未找到');
            }
        }, 500); // 延迟0.5秒（根据打开网页快慢可自行调节）
    }, false);
})();

