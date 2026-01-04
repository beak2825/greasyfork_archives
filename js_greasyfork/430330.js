// ==UserScript==
// @name         知乎去图
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  打酱油看知乎，开张大图全员围观，还是去掉吧！
// @author       shining77
// @match        *://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/430330/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%9B%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/430330/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E5%9B%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const sleep = (second = 1) => new Promise(resolve => {
        const timeOut = setTimeout(() => {
            resolve();
            clearTimeout(timeOut);
        }, second * 1000);
    })

    const hiddenFuckPic = async () => {
        await sleep(1);
        const TitleImage = document.querySelector('.TitleImage');
        TitleImage?.setAttribute?.('data-src', TitleImage.getAttribute('src'));
        TitleImage?.setAttribute?.('src', '');

        const images = document.querySelectorAll('.RichText img');
        images?.forEach?.(item => {
            item.style.width = '20px';
            item.style.height = '20px';
        });
    }

    hiddenFuckPic();
})();