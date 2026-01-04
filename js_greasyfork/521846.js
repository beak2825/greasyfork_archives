// ==UserScript==
// @name         选择自动复制-解除复制限制
// @namespace    http://tampermonkey.net/
// @version      2024-12-26
// @description   Auoto Copy Select Text.
// @author       M&W
// @match        *://*/*
// @include *
// @icon         https://www.google.com/s2/favicons?sz=64&domain=51cto.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/521846/%E9%80%89%E6%8B%A9%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6-%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/521846/%E9%80%89%E6%8B%A9%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6-%E8%A7%A3%E9%99%A4%E5%A4%8D%E5%88%B6%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
// 复制文本到剪贴板的函数
function copyToClipboard(text, e) {
    var textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'absolute';
    textarea.style.left = '-9999px';
    textarea.style.top = '-9999px';
    document.body.appendChild(textarea);
    textarea.select();
    try {
        var successful = document.execCommand('copy');
        console.log(successful ? 'Text copied to clipboard' : 'Failed to copy text');
    } catch (err) {
        console.error('Failed to copy text: ', err);
    }
    document.body.removeChild(textarea);
    showCopyMessage(e)
}
var copyMessage = undefined;
function showCopyMessage(e) {
    // 创建提示信息
    if(copyMessage == undefined){
        copyMessage = document.createElement('div');
    }
    copyMessage.textContent = '已复制';
    copyMessage.style.position = 'absolute';
    copyMessage.style.backgroundColor = '#fff';
    copyMessage.style.color = 'black';
    copyMessage.style.borderRadius = '4px';
    copyMessage.style.padding = '5px 10px';
    copyMessage.style.fontSize = '14px';
    copyMessage.style.fontWeight = 'bold';
    copyMessage.style.zIndex = '10000';
    document.body.appendChild(copyMessage);

    // 定位提示信息到按钮下方
    copyMessage.style.left = `${e.pageX + 15}px`;
    copyMessage.style.top = `${e.pageY + 15}px`;

    // 2秒后移除提示信息
    setTimeout(function () {
        copyMessage.remove();
    }, 1000);
}
// 鼠标释放事件，检查是否有文本被选中
document.addEventListener('mouseup', function (e) {
    var selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        copyToClipboard(selectedText, e);
    }
});
})();