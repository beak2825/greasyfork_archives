// ==UserScript==
// @name         获取安全微伴数据
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  获取安全微伴数据，便于python一键刷课
// @author       kalicyh
// @license      MIT
// @match        https://weiban.mycourse.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479799/%E8%8E%B7%E5%8F%96%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E6%95%B0%E6%8D%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/479799/%E8%8E%B7%E5%8F%96%E5%AE%89%E5%85%A8%E5%BE%AE%E4%BC%B4%E6%95%B0%E6%8D%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let originalOpen = XMLHttpRequest.prototype.open;
    let originalSend = XMLHttpRequest.prototype.send;
    let originalSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

    let capturedToken = null; // Variable to store the captured X-Token

    // 替换open方法以捕获请求的URL和方法
    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;  // 保存请求方法
        this._url = url;        // 保存请求URL
        originalOpen.apply(this, arguments);
    };

    // 替换setRequestHeader以捕获X-Token
    XMLHttpRequest.prototype.setRequestHeader = function(header, value) {
        if (header === 'X-Token') {
            capturedToken = value;
            console.log("Captured X-Token:", value);
        }
        originalSetRequestHeader.apply(this, arguments);
    };

    // 替换send方法，以便在发送请求时捕获负载数据
    XMLHttpRequest.prototype.send = function(data) {
        if (this._method && this._method.toLowerCase() === 'post') {
            this.addEventListener('load', function() {
                if (this._url && this._url.indexOf('listCategory.do?timestamp') !== -1) {
                    var message = 'Captured X-Token: ' + (capturedToken || 'None') + '\n' + 'POST Payload Data:\n' + data;

                    // 创建文本区域并设置文本
                    var textArea = document.createElement('textarea');
                    textArea.style.width = '100%';
                    textArea.style.height = '100px';
                    textArea.value = message;

                    // 创建弹窗容器
                    var popupContainer = document.createElement('div');
                    popupContainer.appendChild(textArea);

                    // 创建弹窗
                    var popup = window.open('', '_blank', 'width=400,height=300');
                    popup.document.body.appendChild(popupContainer);
                }
            }, false);
        }
        originalSend.apply(this, arguments);
    };
})();
