// ==UserScript==
// @name         精简链接复制按钮
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在淘宝、天猫和京东网页添加一个按钮，点击后复制当前精简后的网页链接，并显示提示信息，但不会修改地址栏链接
// @author       KaidQiao
// @match        *://*.taobao.com/*
// @match        *://*.tmall.com/*
// @match        *://*.jd.com/*
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/510243/%E7%B2%BE%E7%AE%80%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/510243/%E7%B2%BE%E7%AE%80%E9%93%BE%E6%8E%A5%E5%A4%8D%E5%88%B6%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    let button = document.createElement('button');
    button.innerText = '复制精简链接';
    button.style.position = 'fixed';
    button.style.bottom = '20px';
    button.style.right = '20px';
    button.style.zIndex = '1000';
    button.style.padding = '10px';
    button.style.backgroundColor = 'rgba(169, 169, 169, 0.6)';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.backdropFilter = 'blur(10px)';
    button.style.transition = 'background-color 0.3s';

    // 鼠标经过效果
    button.addEventListener('mouseover', function() {
        button.style.backgroundColor = 'rgba(9, 187, 7, 0.8)';
    });

    // 鼠标离开效果
    button.addEventListener('mouseout', function() {
        button.style.backgroundColor = 'rgba(169, 169, 169, 0.6)';
    });

    // 获取精简链接的函数
    function getCleanUrl() {
        var site = window.location.href.match(/^http(s)?:\/\/[^?]*/);
        var params = ['id', 'wd', 'q', 'skuId'];  // 保留 id, wd, q, 和 skuId
        var newUrl = site[0];
        var queryString = '';

        params.forEach(function(param) {
            var value = new URLSearchParams(window.location.search).get(param);
            if (value) {
                queryString += (queryString ? '&' : '?') + param + '=' + value;
            }
        });

        return newUrl + queryString;
    }

    // 按钮点击事件
    button.onclick = function() {
        let cleanUrl = getCleanUrl();
        GM_setClipboard(cleanUrl, 'text');  // 将精简后的链接复制到剪贴板

        // 显示提示信息
        let tooltip = document.createElement('div');
        tooltip.innerText = '精简链接已复制';
        tooltip.style.position = 'fixed';
        tooltip.style.bottom = '60px';
        tooltip.style.right = '20px';
        tooltip.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        tooltip.style.color = 'white';
        tooltip.style.padding = '5px 10px';
        tooltip.style.borderRadius = '3px';
        tooltip.style.zIndex = '1001';
        document.body.appendChild(tooltip);

        // 3秒后移除提示信息
        setTimeout(function() {
            tooltip.remove();
        }, 3000);
    };

    // 将按钮添加到页面
    document.body.appendChild(button);
})();
