// ==UserScript==
// @name         淘宝商品详情图src复制到剪贴板
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  跳过最后一个图片元素，提取所有图片的 src，点击按钮将其复制到剪贴板
// @author       You
// @match        https://item.taobao.com/*
// @grant        none
// @license   MIT
// @downloadURL https://update.greasyfork.org/scripts/518359/%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E5%9B%BEsrc%E5%A4%8D%E5%88%B6%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/518359/%E6%B7%98%E5%AE%9D%E5%95%86%E5%93%81%E8%AF%A6%E6%83%85%E5%9B%BEsrc%E5%A4%8D%E5%88%B6%E5%88%B0%E5%89%AA%E8%B4%B4%E6%9D%BF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建提取按钮
    const button = document.createElement('button');
    button.textContent = '提取图片 src';
    button.style.position = 'fixed';
    button.style.top = '100px';
    button.style.left = '10px';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // 给按钮添加点击事件
    button.addEventListener('click', () => {
        const imgSrcArray = [];

        // 获取所有图片的 src，跳过最后一个元素
        const imgList = document.querySelectorAll("#content > div > div > img");
        for (let i = 0; i < imgList.length - 1; i++) {  // 跳过最后一个元素
            imgSrcArray.push(imgList[i].src);
        }

        // 将数组格式化为 JS 数组的风格，并且每个元素换行
        const srcText = '[' + imgSrcArray.map(src => `"${src}"`).join(',\n') + ']';

        // 将 src 数组换行后的内容复制到剪贴板
        navigator.clipboard.writeText(srcText)
            .then(() => {
                // 显示复制成功的提示文本
                const originalText = button.textContent;
                button.textContent = '复制成功！';

                // 1秒后恢复原始文本
                setTimeout(() => {
                    button.textContent = originalText;
                }, 1000);
            })
            .catch(err => {
                console.error('复制到剪贴板失败: ', err);
            });
    });
})();
