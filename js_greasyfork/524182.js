// ==UserScript==
// @name         卡饭自动签到
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动点击签到按钮
// @author       KomeijiReimu
// @match        *://bbs.kafan.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524182/%E5%8D%A1%E9%A5%AD%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/524182/%E5%8D%A1%E9%A5%AD%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function () {
    function autoClick() {
        const imageElement = document.querySelector('#pper_a img');

        // 检查图片的src属性是否是 dk.png
        if (imageElement && imageElement.src === 'https://a.kafan.cn/plugin/dsu_amupper/images/dk.png') {
            // 获取父链接元素
            const linkElement = imageElement.closest('a');

            // 如果符合条件，模拟点击
            if (linkElement) {
                console.log('签');
                linkElement.click();
            }
        } else {
            console.log('无需签到');
        }
    }

    window.addEventListener('load', () => {
        autoClick();
    });

})();
