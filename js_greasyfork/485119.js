// ==UserScript==
// @name         Toutiao Customizer
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Remove specific elements and resize images on Toutiao
// @author       YourName
// @match        https://www.toutiao.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/485119/Toutiao%20Customizer.user.js
// @updateURL https://update.greasyfork.org/scripts/485119/Toutiao%20Customizer.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 删除指定class名的元素
    const removeClasses = ['fix-header', 'ttp-sticky-container','right-sidebar'];
    removeClasses.forEach((className) => {
        let elements = document.getElementsByClassName(className);
        while (elements.length > 0) {
            elements[0].parentNode.removeChild(elements[0]);
        }
    });

    // 设置pgc-img类里面的img标签宽度为100px，高度自适应
    const pgcImages = document.querySelectorAll('.pgc-img img');
    pgcImages.forEach((img) => {
        img.style.width = '100px';
        img.style.height = 'auto';
    });

    // 将.article-detail-container下的.main类的容器宽度设置为自动
    const mainContainers = document.querySelectorAll('.article-detail-container .main');
    mainContainers.forEach((container) => {
        container.style.width = 'auto';
    });
})();
