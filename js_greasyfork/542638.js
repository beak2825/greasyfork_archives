// ==UserScript==
// @name         洛谷主页广告替换
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  移除洛谷轮播图并替换为指定图片
// @author       LLDQ
// @match        *://www.luogu.com.cn/
// @icon         https://www.luogu.com.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/542638/%E6%B4%9B%E8%B0%B7%E4%B8%BB%E9%A1%B5%E5%B9%BF%E5%91%8A%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/542638/%E6%B4%9B%E8%B0%B7%E4%B8%BB%E9%A1%B5%E5%B9%BF%E5%91%8A%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 检查目标元素是否存在的函数
    function checkElement() {
        const targetDiv = document.querySelector('div.am-u-md-8');

        if (targetDiv) {
            // 创建新图片元素
            const newImg = document.createElement('img');
            //将下面改为你想更换的图片的URL
            newImg.src = 'https://api.imlazy.ink/img';
            newImg.style.width = '100%';
            newImg.style.display = 'block';
            newImg.alt = '替换图片';

            // 替换整个目标区域
            targetDiv.innerHTML = '';
            targetDiv.appendChild(newImg);

            // 停止检查
            clearInterval(checkInterval);
        }
    }

    // 每100毫秒检查一次目标元素
    const checkInterval = setInterval(checkElement, 100);
})();