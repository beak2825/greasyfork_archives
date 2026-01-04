// ==UserScript==
// @name         绯月图片直接显示
// @namespace    railguns
// @version      0.1
// @description  将"请手动点击打开本图片"链接的图片直接显示在论坛帖子中
// @author       railguns
// @match        https://bbs.kfpromax.com/read*
// @match        https://kfmax.com/read*
// @match        https://bbs.kfmax.com/read*
// @match        https://bbs.9dkf.com/read*
// @match        https://bbs.365gal.com/read*
// @match        https://bbs.365galgame.com/read*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482173/%E7%BB%AF%E6%9C%88%E5%9B%BE%E7%89%87%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/482173/%E7%BB%AF%E6%9C%88%E5%9B%BE%E7%89%87%E7%9B%B4%E6%8E%A5%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 替换下面的文本内容为实际的提示文本
    var searchText = "请手动点击打开本图片";

    // 获取所有包含指定文本的链接元素
    var elements = document.body.querySelectorAll('a');

    // 遍历元素并替换为图片
    elements.forEach(function(element) {
        // 检查链接的文本内容是否包含指定文本
        if (element.innerText.includes(searchText)) {
            // 获取链接的打开链接
            var openLink = element.getAttribute('href');

            // 使用正则表达式检查链接是否以 http 或 https 开头
            if (openLink && /^https?:/.test(openLink)) {
                // 创建图片元素
                var img = document.createElement('img');
                img.src = openLink;

                // 设置图片样式，确保不超过页面宽度
                img.style.maxWidth = '100%';
                img.style.height = 'auto';

                // 替换文本链接为图片
                element.parentNode.replaceChild(img, element);
            }
        }
    });
})();
