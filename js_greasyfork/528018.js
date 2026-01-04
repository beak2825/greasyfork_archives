// ==UserScript==
// @name         谷歌翻译助手
// @namespace    https://translate.google.com
// @version      0.2
// @description  测试
// @author       tuite
// @match        https://translate.google.com/?sl=en&tl=zh-CN&op=images
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528018/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/528018/%E8%B0%B7%E6%AD%8C%E7%BF%BB%E8%AF%91%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    document.body.addEventListener('click', function(event) {
        // 当用户点击页面时，触发这个函数
        console.log('页面被点击了！');
        console.log('点击的位置：', event.clientX, event.clientY);
        if (Array.from(document.querySelectorAll('div[role="tooltip"]')).find(div => div.textContent.trim() === "清除图片"))
            Array.from(document.querySelectorAll('div[role="tooltip"]')).find(div => div.textContent.trim() === "清除图片").previousElementSibling.click() 
    }); 
})();

