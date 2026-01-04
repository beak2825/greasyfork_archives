// ==UserScript==
// @name         CC98图片尺寸限制
// @namespace    https://i.jself.top/
// @description  将CC98论坛中尺寸过大的图片进行缩放
// @version      1.1
// @icon         https://www.cc98.org/static/98icon.ico
// @author       jself
// @match        https://www.cc98.org/topic/*
// @match        https://www-cc98-org-s.webvpn.zju.edu.cn:8001/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/504608/CC98%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8%E9%99%90%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/504608/CC98%E5%9B%BE%E7%89%87%E5%B0%BA%E5%AF%B8%E9%99%90%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function resizeImages() {
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            const cssWidth = window.getComputedStyle(img).width;
            const widthInPixels = parseFloat(cssWidth);
            const cssHeight = window.getComputedStyle(img).height;
            const heightInPixels = parseFloat(cssHeight);
            const editTimes = 0;

            //在这里自定义尺寸限制
            const maxWidth = 750;
            const maxHeight = 300;

            if (widthInPixels > maxWidth) {
                const newHeight = (maxWidth / widthInPixels) * heightInPixels;
                img.style.width = `${maxWidth}px`;
                img.style.height = `${newHeight}px`;
                editTimes = 1;
            }

            if (heightInPixels > maxHeight) {
                const newWidth = (maxHeight / heightInPixels) * widthInPixels;
                if (editTimes > 0) {
                    const newWidth = (maxHeight / img.style.height) * img.style.width;
                }
                img.style.height =`${maxHeight}px`;
                img.style.width = `${newWidth}px`;
            }
        });
    }

    const observer = new MutationObserver(() => {
        resizeImages();
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener('load', resizeImages);
})();
