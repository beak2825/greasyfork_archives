// ==UserScript==
// @name         去除网页中讨厌元素的小工具
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  通过css去掉网页中那些令人讨厌的东西，比如腾讯课堂的正在观看弹幕，简书的推荐故事等
// @author       星河
// @match        https://www.jianshu.com/*
// @match        https://ke.qq.com/*
// @match        https://www.gushiwen.cn/*
// @match        https://so.gushiwen.cn/* 
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461922/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E4%B8%AD%E8%AE%A8%E5%8E%8C%E5%85%83%E7%B4%A0%E7%9A%84%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/461922/%E5%8E%BB%E9%99%A4%E7%BD%91%E9%A1%B5%E4%B8%AD%E8%AE%A8%E5%8E%8C%E5%85%83%E7%B4%A0%E7%9A%84%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setTimeout(() => {

        const url = window.location.href;

        if (url.includes('jianshu')) { //简书去除右侧推荐故事
            const arr = document.querySelectorAll('._3Z3nHf');
            arr[1].style.cssText = 'display: none';
        }else if (url.includes('ke.qq')) { //腾讯课堂去除正在观看弹幕
            const style = document.createElement('style');
            style.appendChild(document.createTextNode('#video-container div { transform: scale(0, 0) }'));
            document.querySelector('#video-container').appendChild(style);
        }else if (url.includes('gushiwen')){ //去除古诗文网的二维码弹窗
            const style = document.createElement('style');
            style.appendChild(document.createTextNode('#threeWeixin2 { transform: scale(0, 0) }'));
            document.querySelector('.main3').appendChild(style);
        }

    }, 3000);

})();