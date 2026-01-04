// ==UserScript==
// @name         点击时显示文字
// @namespace    https://gitee.com/codyme/
// @version      2.1
// @description  用于在每次点击鼠标时漂浮文字，原名《社会主义核心价值观 - 点击时提醒》
// @author       Cody
// @include      http://*
// @include      https://*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_addValueChangeListener
// @grant        GM_registerMenuCommand
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/371892/%E7%82%B9%E5%87%BB%E6%97%B6%E6%98%BE%E7%A4%BA%E6%96%87%E5%AD%97.user.js
// @updateURL https://update.greasyfork.org/scripts/371892/%E7%82%B9%E5%87%BB%E6%97%B6%E6%98%BE%E7%A4%BA%E6%96%87%E5%AD%97.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 默认词典
    // 富强, 民主, 文明, 和谐, 自由, 平等, 公正, 法治, 爱国, 敬业, 诚信, 友善
    var DEFAULT_WORDS = ["\u5bcc\u5f3a", "\u6c11\u4e3b", "\u6587\u660e", "\u548c\u8c10", "\u81ea\u7531", "\u5e73\u7b49", "\u516c\u6b63", "\u6cd5\u6cbb", "\u7231\u56fd", "\u656c\u4e1a", "\u8bda\u4fe1", "\u53cb\u5584"];

    // 获取自定义的词典
    function updateWords() {
        try {
            var wordsStr = GM_getValue('words');
            if (!wordsStr) { } else {
                var temp = JSON.parse(wordsStr);
                if (Array.isArray(temp) && temp.length > 0) {
                    words = temp;
                }
            }
        } catch (error) {
            // 当解析失败时删除当前存储的词典
            GM_deleteValue('words');
        }
    }

    function openSettings() {
        var wordsText = window.prompt("\u8bf7\u8f93\u5165\u65b0\u7684\u8bcd\u5e93\uff1a\uff08\u5355\u8bcd\u95f4\u4f7f\u7528\u82f1\u6587\u9017\u53f7\u5206\u9694\uff09", words.join(","));
        // 输入内容为空时，还原默认词典
        if (!wordsText) {
            window.alert("\u8f93\u5165\u5185\u5bb9\u4e3a\u7a7a\uff0c\u5df2\u8fd8\u539f\u9ed8\u8ba4\u8bcd\u5178");
            words = DEFAULT_WORDS;
            // 因为 delete 方法不会触发 change 事件，需要额外调用一次set方法
            GM_setValue('words', null);
            GM_deleteValue('words');
            return;
        }
        var temp = wordsText.split(/\s*,\s*/);
        // 移除为空的单词
        for (var i = temp.length - 1; i >= 0; i--) {
            if (!temp[i]) {
                temp.splice(i, 1);
            }
        }
        // 没有有效的单词时，不做任何修改
        if (temp.length <= 0) {
            window.alert("\u5fc5\u987b\u5305\u542b\u81f3\u5c11\u4e00\u4e2a\u5355\u8bcd\uff0c\u8bf7\u91cd\u8bd5");
            return;
        }
        words = temp;
        // 保存新的词典
        GM_setValue('words', JSON.stringify(temp));
    }

    var words = DEFAULT_WORDS,
        index = Math.floor(Math.random() * words.length);

    updateWords();

    document.body.addEventListener('click', function (e) {
        // 点击对象是链接时跳过
        if (e.target.tagName == 'A') {
            return;
        }
        var x = e.pageX,
            y = e.pageY,
            span = document.createElement('span');
        span.textContent = words[index];
        index = (index + 1) % words.length;
        // 文字初始样式
        span.style.cssText =
            `z-index: 9999999;
            position: absolute;
            font-size: 14px;
            font-weight: bold;
            color: #dd2222;
            top: ${y - 20}px;
            left: ${x}px;
            transition: all 1.5s linear;
            pointer-events: none;'`;
        document.body.appendChild(span);
        setTimeout(function () {
            // 动画结束时样式
            span.style.top = y - 200 + 'px';
            span.style.opacity = 0;
            // 倒计时 1.5 秒后移除文字
            setTimeout(function () {
                span.parentNode.removeChild(span);
            }, 1500);
        }, 0);
    });

    GM_addValueChangeListener('words', function (name, old_value, new_value, remote) {
        // 来自当前标签页的 change 事件已经被 settings 方法处理了，这里只需要处理来自其他标签页的 change 事件
        if (remote) {
            words = DEFAULT_WORDS;
            updateWords();
        }
    });

    // 添加设置菜单项
    GM_registerMenuCommand("\u81ea\u5b9a\u4e49\u8bcd\u5178", openSettings, 'W');
})();