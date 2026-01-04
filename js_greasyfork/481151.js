// ==UserScript==
// @name        HideImages
// @name:zh-CN  摸鱼助手-隐藏网页图片
// @description hide web images
// @description:zh-CN   增加一个快捷按钮，一键隐藏/显示网页图片
// @namespace   https://github.com/
// @license     MIT
// @author      北极有鱼
// @match        *://*/*
// @run-at document-end
// @version     1.0.1
// @downloadURL https://update.greasyfork.org/scripts/481151/HideImages.user.js
// @updateURL https://update.greasyfork.org/scripts/481151/HideImages.meta.js
// ==/UserScript==

(function() {
    'use strict';
    console.log('HideImages is running...')  // 控制台输出运行状态
    // 插入到页面中
    let btnDom = document.createElement('div');  // 生成待插入的元素
    btnDom.className = 'hi-btn';
    btnDom.textContent = '隐'; // 添加文字内容
    document.body.appendChild(btnDom);
    // 再添加样式
    let style = `
      .hi-btn {
        position: fixed;
        right: 20px;
        bottom: 100px;
        z-index: 9999;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #ff6f3c;
        border-radius: 10px;
        transition: all 0.5s;
        cursor: pointer;
        font-size: 20px;
        color: #ffffff;
      }
    `

    let styleDom = document.createElement('style');
    styleDom.innerHTML = style;
    document.head.appendChild(styleDom);

    // 处理事件
    btnDom.addEventListener('click', function() {
        const images = document.querySelectorAll('img, image, photo, thumbnail, picture, gallery, icon, avatar, video, art-player-wrapper, imgbox-border, img-wrapper, goods');
        // 遍历所有的图片元素，并设置它们的 display 样式为 none 或者 block
        images.forEach(function(element) {
            if (element.style.display === 'none') {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
        // 针对小红书处理
        const redImages = document.querySelectorAll('.cover.ld.mask');
        redImages.forEach(function(element) {
            if (element.style.display === 'none') {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
        // 小红书点击后的内容隐藏
        const redImagesIn = document.querySelectorAll('.media-container');
        redImagesIn.forEach(function(element) {
            if (element.style.display === 'none') {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        });
        // 切换按钮文本内容
        if (btnDom.textContent === '隐') {
            btnDom.textContent = "显";
            btnDom.style.borderRadius = '20px';
            btnDom.style.backgroundColor = '#17b978';
        } else {
            btnDom.textContent = "隐";
            btnDom.style.borderRadius = '10px';
            btnDom.style.backgroundColor = '#ff6f3c';
        }
    })
// 打完收功
})();





