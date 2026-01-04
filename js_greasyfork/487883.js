
// ==UserScript==
// @name        微信读书 宽度自适应
// @namespace   Weread Width Adaptation
// @match       *://weread.qq.com/web/reader/*
// @grant       none
// @version     2024.09.03.01
// @author      James Wood
// @description 2024/2/18 17:08:40
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/487883/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%20%E5%AE%BD%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94.user.js
// @updateURL https://update.greasyfork.org/scripts/487883/%E5%BE%AE%E4%BF%A1%E8%AF%BB%E4%B9%A6%20%E5%AE%BD%E5%BA%A6%E8%87%AA%E9%80%82%E5%BA%94.meta.js
// ==/UserScript==




(function () {
    'use strict';

    // 基础方法
    function getCurrentMaxWidth(element) {
        let currentValue = window.getComputedStyle(element).maxWidth;
        currentValue = currentValue.substring(0, currentValue.indexOf('px'));
        currentValue = parseInt(currentValue);
        return currentValue;
    }

    function changeWidth() {
        const items = document.querySelectorAll(".readerContent .app_content, .readerTopBar");
        const targetValue = window.innerWidth * 0.9;
        items.forEach(item => {
            const currentValue = getCurrentMaxWidth(item);
            if (currentValue !== targetValue) {
                item.style['max-width'] = targetValue + 'px';
            }
        });
        const myEvent = new Event('resize');
        window.dispatchEvent(myEvent)
    }

    // 调整宽度
    changeWidth();

    // 将.readerControls元素距离右边10%
    const readerControls = document.querySelector('.readerControls');
    readerControls.style.right = '6%';
    readerControls.style.left = 'unset';
    readerControls.style.marginLeft = 'unset';
})();
