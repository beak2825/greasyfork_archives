// ==UserScript==
// @name         哔哩哔哩专栏去除复制尾巴
// @namespace    https://github.com/ZakiuC
// @version      0.1
// @description  监听按键操作，尝试捕获和修改复制操作(只有在使用快捷键复制时才有效)
// @author       zakiu
// @match        https://www.bilibili.com/*
// @match        http://*.bilibili.com/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/492912/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E5%B0%BE%E5%B7%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/492912/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%93%E6%A0%8F%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E5%B0%BE%E5%B7%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('哔哩哔哩去除复制尾巴脚本已加载，开始监听按键');

    document.addEventListener('keydown', function(event) {
        // 检查是否按下了Ctrl+C或Cmd+C
        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
            console.log('检测到复制按键操作');
            setTimeout(processCopyOperation, 100);// 延迟处理，以确保选中的文本是最新的
        }
    });

    function processCopyOperation() {
        let selection = document.getSelection().toString();
        if (!selection) {
            console.log('未检测到选中的文本');
            return;
        }
        console.log('选中的原始文本：', selection);
        let modifiedText = selection.replace(/ 作者：[^]+出处：bilibili$/, '');
        console.log('处理后的文本：', modifiedText);

        // 为了修改剪贴板内容，我们需要一种方法将文本再次放回剪贴板
        // 下面的方法可能需要用户权限来执行
        navigator.clipboard.writeText(modifiedText).then(() => {
            console.log('剪贴板已更新');
        }).catch(err => {
            console.log('无法写入剪贴板：', err);
        });
    }
})();
