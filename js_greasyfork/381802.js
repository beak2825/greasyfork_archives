// ==UserScript==
// @name         吾爱破解论坛自动签到
// @namespace    https://www.52pojie.cn/thread-747305-1-1.html
// @version      0.1
// @description  吾爱破解论坛自动签到，打开页面时自动检测签到的图片，如果是“打卡签到”则自动打开一个 iframe 用于签到，1 秒之后关闭 iframe，并且将图片换成“签到完毕”
// @author       Ganlv
// @match        https://www.52pojie.cn/*
// @icon         https://www.52pojie.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/381802/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/381802/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var img = document.querySelector('img[src="https://www.52pojie.cn/static/image/common/qds.png"]');
    if (img) {
        var href = img.parentElement.href;

        var div = document.createElement('div');
        div.style.display = 'none';
        div.style.position = 'fixed';
        div.style.top = '112px';
        div.style.right = '12px';
        div.style.width = '626px';
        div.style.height = '98px';
        div.style.overflow = 'hidden';
        div.style.zIndex = '9999';
        div.style.boxShadow = '0 3px 6px #999';
        div.onscroll = function () {
            div.scrollLeft = 0;
            div.scrollTop = 0;
        };

        let iframe = document.createElement('iframe');
        iframe.style.border = 'none';
        iframe.width = '1280';
        iframe.height = '5000';
        iframe.onload = function () {
            iframe.style.position = 'absolute';
            iframe.style.left = '-328px';
            iframe.style.top = '-264px';
            img.src = 'https://www.52pojie.cn/static/image/common/wbs.png';
            div.style.display = '';
            setTimeout(function () {
                div.remove();
            }, 1000);
        };
        div.appendChild(iframe);

        var wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.left = '0';
        wrapper.style.top = '0';
        wrapper.style.width = '1280px';
        wrapper.style.height = '5000px';
        wrapper.style.zIndex = '10000';
        wrapper.onclick = function () {
            div.remove();
        };
        div.appendChild(wrapper);

        document.body.appendChild(div);

        iframe.src = href;
    }
})();