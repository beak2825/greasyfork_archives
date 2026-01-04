// ==UserScript==
// @name         广东财贸系统智能体
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  在网页右下角添加一个悬浮按钮，点击显示iframe
// @author       yyn
// @match        http://gdcmjsgc.cxbim.com/*
// @grant        none
// @license
 
// @downloadURL https://update.greasyfork.org/scripts/517077/%E5%B9%BF%E4%B8%9C%E8%B4%A2%E8%B4%B8%E7%B3%BB%E7%BB%9F%E6%99%BA%E8%83%BD%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/517077/%E5%B9%BF%E4%B8%9C%E8%B4%A2%E8%B4%B8%E7%B3%BB%E7%BB%9F%E6%99%BA%E8%83%BD%E4%BD%93.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 创建悬浮按钮
var floatingButton = document.createElement('button');
floatingButton.innerHTML = '<i class="fas fa-robot"></i> 财贸智能体';
floatingButton.className = 'floating-button';
floatingButton.style.position = 'fixed';
floatingButton.style.bottom = '60px';
floatingButton.style.right = '20px';
floatingButton.style.zIndex = '10000';
floatingButton.style.padding = '10px 20px';
floatingButton.style.border = 'none';
floatingButton.style.background = 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)'; // 更改为清新的蓝色渐变
floatingButton.style.color = 'white';
floatingButton.style.borderRadius = '25px';
floatingButton.style.cursor = 'pointer';
floatingButton.style.fontSize = '16px';
floatingButton.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
floatingButton.style.transition = 'all 0.3s ease';
 
floatingButton.onmouseenter = function() {
    this.style.transform = 'scale(1.05)';
    this.style.background = 'linear-gradient(135deg, #1c7fa3 0%, #5bc8e3 100%)'; // 悬停时稍深的颜色
    this.style.boxShadow = '0 6px 20px rgba(0,0,0,0.25)';
};
 
floatingButton.onmouseleave = function() {
    this.style.transform = 'scale(1)';
    this.style.background = 'linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%)';
    this.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
};
 
 
    // 创建模态窗口
    var modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.left = '50%';
    modal.style.top = '50%';
    modal.style.transform = 'translate(-50%, -50%)';
    modal.style.width = '800px';
    modal.style.height = '600px';
    modal.style.backgroundColor = 'white';
    modal.style.zIndex = '9999';
    modal.style.borderRadius = '8px';
    modal.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
    modal.style.opacity = '0';
    modal.style.visibility = 'hidden'; // Initially not visible
    modal.style.transition = 'opacity 0.3s, visibility 0.3s';
 
    // 创建关闭按钮
    var closeButton = document.createElement('button');
    closeButton.textContent = 'X';
    closeButton.style.position = 'absolute';
    closeButton.style.top = '10px';
    closeButton.style.right = '10px';
    closeButton.style.zIndex = '10000';
    closeButton.style.padding = '5px 10px';
    closeButton.style.border = 'none';
    closeButton.style.backgroundColor = '#f44336';
    closeButton.style.color = 'white';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.fontSize = '18px';
 
    // 创建iframe
    var iframe = document.createElement('iframe');
    iframe.src = 'http://8.138.117.71:3000/chat/share?shareId=x5w5i6e2f9pp63xzog86p6rp';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    iframe.frameBorder = '0';
 
    // 将iframe添加到模态窗口
    modal.appendChild(iframe);
 
    // 将关闭按钮添加到模态窗口
    modal.appendChild(closeButton);
 
    // 将模态窗口添加到body
    document.body.appendChild(modal);
 
    // 将悬浮按钮添加到body
    document.body.appendChild(floatingButton);
 
    // 悬浮按钮点击事件
    floatingButton.onclick = function() {
        floatingButton.style.display = 'none'; // Hide the floating button
        modal.style.display = 'flex';
        modal.style.opacity = '1';
        modal.style.visibility = 'visible';
 
        // 等待iframe加载完成
        iframe.onload = function() {
            // 访问iframe的contentDocument
            var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
 
            // 动态添加样式表来隐藏floating-button
            var styleSheet = iframeDocument.createElement('style');
            styleSheet.textContent = '.floating-button { display: none !important; }';
            iframeDocument.head.appendChild(styleSheet);
 
            // 查找iframe中的floating-button类的对象
            var buttonInIframe = iframeDocument.getElementsByClassName('floating-button')[0];
            if (buttonInIframe) {
                console.log('找到iframe内的floating-button:', buttonInIframe);
            } else {
                console.log('没有找到iframe内的floating-button');
            }
 
            // 使用MutationObserver监听iframe内容变化
            var observer = new MutationObserver(function(mutations) {
                mutations.forEach(function(mutation) {
                    if (mutation.type === 'childList') {
                        var buttonInIframe = iframeDocument.getElementsByClassName('floating-button')[0];
                        if (buttonInIframe) {
                            buttonInIframe.style.display = 'none';
                        }
                    }
                });
            });
 
            observer.observe(iframeDocument.body, { childList: true, subtree: true });
        };
    };
 
    // 关闭按钮点击事件
    closeButton.onclick = function() {
        modal.style.opacity = '0';
        modal.style.visibility = 'hidden';
        setTimeout(function() {
            modal.style.display = 'none';
            floatingButton.style.display = 'flex'; // Show the floating button again
        }, 300); // Wait for the transition to finish before setting display to none
    };
})();