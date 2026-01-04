// ==UserScript==
// @name         闲管家商品图片预览插件
// @namespace    xianguanjia
// @version      1.0
// @description  在指定网址启用商品图片预览功能
// @author       骄阳
// @match        https://goofish.pro/sale/product/*
// @match        https://www.goofish.pro/sale/product/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477486/%E9%97%B2%E7%AE%A1%E5%AE%B6%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/477486/%E9%97%B2%E7%AE%A1%E5%AE%B6%E5%95%86%E5%93%81%E5%9B%BE%E7%89%87%E9%A2%84%E8%A7%88%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建用于显示放大图片的 div
    const previewDiv = document.createElement('div');
    previewDiv.style.position = 'fixed';
    previewDiv.style.display = 'none';
    previewDiv.style.background = 'white';
    previewDiv.style.border = '1px solid #ccc';
    previewDiv.style.padding = '5px';
    previewDiv.style.zIndex = '9999';
    previewDiv.style.width = '500px';  // 设置图片宽度
    //previewDiv.style.height = '500px'; // 设置图片高度
    previewDiv.style.top = '30px';     // 设置距离页面顶部的位置

    // 将 div 添加到页面
    document.body.appendChild(previewDiv);

    let currentImage = null;

    // 监听鼠标移动事件
    document.addEventListener('mousemove', (event) => {
        const target = event.target;

        // 检查是否鼠标移动到了指定的图片元素上
        if (target.matches('td.el-table__cell > div.cell > div.goods-pic > img')) {
            // 获取图片的 URL
            const imgUrl = target.getAttribute('src');

            if (currentImage !== imgUrl) {
                // 设置放大图片的内容
                previewDiv.innerHTML = `<img src="${imgUrl}" style="max-width: 100%; max-height: 100%;">`;
                currentImage = imgUrl;
            }

            // 设置放大图片的位置
            previewDiv.style.left = event.clientX+100 + 'px';
            previewDiv.style.top = 30 + 'px'; // 考虑30px的偏移

            // 显示放大图片
            previewDiv.style.display = 'block';
        } else {
            // 鼠标未在指定图片上，隐藏放大图片
            previewDiv.style.display = 'none';
            currentImage = null;
        }
    });
})();
