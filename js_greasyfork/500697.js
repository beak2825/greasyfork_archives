// ==UserScript==
// @name        星号密码框显示明文密码
// @namespace   Violentmonkey Scripts
// @match       *://*/*
// @grant       none
// @version     2.0
// @license     MIT
// @author      youngyy
// @description 密码框显示密码，支持懒加载、动态页面中的密码框，鼠标悬浮在密码框上时显示密码
// @downloadURL https://update.greasyfork.org/scripts/500697/%E6%98%9F%E5%8F%B7%E5%AF%86%E7%A0%81%E6%A1%86%E6%98%BE%E7%A4%BA%E6%98%8E%E6%96%87%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/500697/%E6%98%9F%E5%8F%B7%E5%AF%86%E7%A0%81%E6%A1%86%E6%98%BE%E7%A4%BA%E6%98%8E%E6%96%87%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function bindPasswordEvents(input) {
        input.addEventListener('mouseenter', () => input.type = 'text');
        input.addEventListener('mouseleave', () => input.type = 'password');
    }

    const observer = new MutationObserver((mutations)=>{
      mutations.flatMap(e => [...e.addedNodes]).filter(node => node.nodeType === Node.ELEMENT_NODE).forEach(node => {
            if (node.tagName === 'INPUT' && node.type === 'password') {
                bindPasswordEvents(node);
            } else {
                node.querySelectorAll('input[type="password"]').forEach(bindPasswordEvents);
            }
        });
    });
    observer.observe(document, { childList: true, subtree: true });

    // 初始化现有密码输入框的事件绑定
    document.querySelectorAll('input[type="password"]').forEach(bindPasswordEvents);

})();