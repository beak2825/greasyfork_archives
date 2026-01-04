// ==UserScript==
// @name         定位到伙伴网下单输入框中并修改CSS
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Focus on a specific textarea when Ctrl+I is pressed on pfg.officemate.cn and modify CSS height
// @author       You
// @match        *://*.pfg.officemate.cn/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/499721/%E5%AE%9A%E4%BD%8D%E5%88%B0%E4%BC%99%E4%BC%B4%E7%BD%91%E4%B8%8B%E5%8D%95%E8%BE%93%E5%85%A5%E6%A1%86%E4%B8%AD%E5%B9%B6%E4%BF%AE%E6%94%B9CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/499721/%E5%AE%9A%E4%BD%8D%E5%88%B0%E4%BC%99%E4%BC%B4%E7%BD%91%E4%B8%8B%E5%8D%95%E8%BE%93%E5%85%A5%E6%A1%86%E4%B8%AD%E5%B9%B6%E4%BF%AE%E6%94%B9CSS.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加自定义CSS规则以覆盖原有样式  /////**** 去结算行高度修改为height的高度 ****/////
    GM_addStyle(`
        .fixed-active .table-action-group {
            height: 50px !important;
        }
    `);

    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        // 检查是否按下了Ctrl+I
        if (event.ctrlKey && event.key === 'i') {
            // 阻止默认的浏览器行为（如果有的话）
            event.preventDefault();

            // 查找指定的textarea元素，使用新的选择器 .beizhu__input
            var textarea = document.querySelector('textarea.beizhu__input');

            // 检查元素是否存在
            if (textarea) {
                // 将光标定位到textarea中
                textarea.focus();
            }
        }
    }, false);
})();