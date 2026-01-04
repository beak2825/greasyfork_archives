// ==UserScript==
// @name         替换百度首页LOGO
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  将百度首页的LOGO替换为自定义图片
// @include       *://*baidu.com*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544870/%E6%9B%BF%E6%8D%A2%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5LOGO.user.js
// @updateURL https://update.greasyfork.org/scripts/544870/%E6%9B%BF%E6%8D%A2%E7%99%BE%E5%BA%A6%E9%A6%96%E9%A1%B5LOGO.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.addEventListener('load', function () {
        const logoImg = document.querySelector('#logo a img');
        if (logoImg) {
            // 替换为你自己的 logo 图片链接
            logoImg.src = 'https://app.sisukj.cn/icons/baidu_xiu.png';
            logoImg.srcset = ''; // 防止 srcset 自动加载替代图
            logoImg.style.width = '200px';
            logoImg.style.height = 'auto';
            logoImg.style.objectFit = 'contain';
        }
    });
})();
