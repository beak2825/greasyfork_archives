// ==UserScript==
// @name         聚焦第一个文本输入框
// @version      0.6
// @description  Press Alt+1 to focus the first text input on all pages
// @author       hiisme
// @match        *://*/*
// @grant        none
// @namespace https://greasyfork.org/users/217852
// @downloadURL https://update.greasyfork.org/scripts/504564/%E8%81%9A%E7%84%A6%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%96%87%E6%9C%AC%E8%BE%93%E5%85%A5%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/504564/%E8%81%9A%E7%84%A6%E7%AC%AC%E4%B8%80%E4%B8%AA%E6%96%87%E6%9C%AC%E8%BE%93%E5%85%A5%E6%A1%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 监听键盘按下事件
    document.addEventListener('keydown', function(event) {
        // 检查是否按下了Alt键和1键
        if (event.altKey && event.key === '1') {
            event.preventDefault();
            focusFirstTextInput();
        }
    }, false);

    // 尝试聚焦第一个文本输入框
    function focusFirstTextInput() {
        // 扩展的选择器，尝试匹配更多类型的输入框
        var inputSelector = [
            'input[type="text"]:not([disabled]):not([readonly])',
            'input[type="email"]:not([disabled]):not([readonly])',
            'input[type="password"]:not([disabled]):not([readonly])',
            'input[type="search"]:not([disabled]):not([readonly])',
            'input[type="tel"]:not([disabled]):not([readonly])',
            'input[type="url"]:not([disabled]):not([readonly])',
            'input:not([type]):not([disabled]):not([readonly])', // 无type属性的input也默认为text
            'textarea:not([disabled]):not([readonly])',
            '[contenteditable="true"]:not([disabled]):not([readonly])', // 可编辑区域
            '[role="textbox"]:not([disabled]):not([readonly])' // 带有特定角色的元素
        ].join(',');

        // 排除不可见的元素
        var allInputs = document.querySelectorAll(inputSelector);
        var firstVisibleInput = Array.from(allInputs).find(input => {
            var style = window.getComputedStyle(input);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });

        if (firstVisibleInput) {
            firstVisibleInput.focus();
        }
    }
})();
