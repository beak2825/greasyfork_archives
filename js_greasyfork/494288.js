// ==UserScript==
// @name         哔哩哔哩去除复制多余内容
// @icon         https://www.bilibili.com
// @namespace    http://www.bilibili.com/
// @version      0.0.1
// @description  去除哔哩哔哩复制的时候的多余的尾巴
// @author       everstu
// @include      *www.bilibili.com/*
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/494288/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E5%A4%9A%E4%BD%99%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/494288/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E5%8E%BB%E9%99%A4%E5%A4%8D%E5%88%B6%E5%A4%9A%E4%BD%99%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==

(function () {
  document.addEventListener('copy', function(e) {
    // 取消默认的复制行为
    e.preventDefault();

    // 获取复制的文本内容
    var selection = window.getSelection();
    var selectedText = selection.toString();
    alert(selectedText);
    // 去掉最后两行
    var newText = selectedText.split('\n').slice(0, -2).join('\n');

    // 将新的文本内容复制到剪贴板
    e.clipboardData.setData('text/plain', newText);
  });

}
)();