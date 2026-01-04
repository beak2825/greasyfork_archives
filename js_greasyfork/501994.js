// ==UserScript==
// @name         必应获取 Cookie 值
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在bing搜索网页上添加获取 Cookie 按钮，复制到剪切板
// @author       Sak
// @match        https://cn.bing.com/*
// @match        https://bing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501994/%E5%BF%85%E5%BA%94%E8%8E%B7%E5%8F%96%20Cookie%20%E5%80%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/501994/%E5%BF%85%E5%BA%94%E8%8E%B7%E5%8F%96%20Cookie%20%E5%80%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建获取 cookie 的按钮
    var button = document.createElement('button');
    button.innerText = '获取 Cookie';
    button.style.position = 'fixed';
    button.style.top = '10px';
    button.style.left = '10px';
    button.style.zIndex = '9999';
    button.style.padding = '10px';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';

    document.body.appendChild(button);

    let allCookies = '';

    // 监听网络请求
    const originalXHROpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        // 检查请求是否为 lsp.aspx
        if (url.includes('lsp.aspx') && method === 'POST') {
            this.addEventListener('load', function() {
                // 获取所有 cookie 值
                allCookies = document.cookie;
            });
        }
        return originalXHROpen.apply(this, arguments);
    };

    // 点击按钮事件
    button.addEventListener('click', function() {
        if (allCookies) {
            navigator.clipboard.writeText(allCookies).then(function() {
                alert('Cookie 已复制到剪贴板: ' + allCookies);
            }, function(err) {
                alert('复制失败: ', err);
            });
        } else {
            alert('未获取到 Cookie！请等待页面加载30-60秒后再次点击此按钮，如果还是没用就是失效了！');
        }
    });
})();
