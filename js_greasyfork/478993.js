// ==UserScript==
// @name         获取快手网站源代码中的class="top-count"的数据
// @namespace    http://your-website.com
// @version      1.0
// @description  从快手网站 (https://v.kuaishou.com/dCDGOr) 的源代码中提取class="top-count"的数据并显示在页面上
// @author       Your Name
// @match        https://v.kuaishou.com/dCDGOr
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/478993/%E8%8E%B7%E5%8F%96%E5%BF%AB%E6%89%8B%E7%BD%91%E7%AB%99%E6%BA%90%E4%BB%A3%E7%A0%81%E4%B8%AD%E7%9A%84class%3D%22top-count%22%E7%9A%84%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/478993/%E8%8E%B7%E5%8F%96%E5%BF%AB%E6%89%8B%E7%BD%91%E7%AB%99%E6%BA%90%E4%BB%A3%E7%A0%81%E4%B8%AD%E7%9A%84class%3D%22top-count%22%E7%9A%84%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用fetch获取页面内容
    fetch(window.location.href)
        .then(response => response.text())
        .then(data => {
            // 创建一个虚拟DOM元素
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = data;

            // 查找带有 "top-count" 类名的元素
            const topCountElement = tempDiv.querySelector('.top-count');

            if (topCountElement) {
                const count = topCountElement.textContent.trim();
                console.log('class="top-count" 数据:', count);

                // 创建一个DOM元素来显示数据
                const countElement = document.createElement('div');
                countElement.textContent = 'class="top-count" 数据: ' + count;
                document.body.appendChild(countElement);
            } else {
                console.log('未找到带有 "top-count" 类名的数据');
            }
        })
        .catch(error => {
            console.error('获取源代码时出错:', error);
        });
})();
