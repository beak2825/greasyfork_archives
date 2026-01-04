// ==UserScript==
// @name         h5魔塔钥匙修改
// @namespace    your-namespace
// @version      1.0
// @description  h5魔塔钥匙修改，录像不可用。
// @AuThor       a
// @match        *://h5mota.com/games/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/486013/h5%E9%AD%94%E5%A1%94%E9%92%A5%E5%8C%99%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/486013/h5%E9%AD%94%E5%A1%94%E9%92%A5%E5%8C%99%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // 创建悬浮球
    const floatingButton = document.createElement('div');
    floatingButton.className = 'floating-button';
    floatingButton.style.position = 'fixed';
    floatingButton.style.bottom = '50px';
    floatingButton.style.right = '20px';
    floatingButton.style.width = '45px';
    floatingButton.style.height = '45px';
    floatingButton.style.borderRadius = '50%';
    floatingButton.style.backgroundColor = '#FF6666';
    floatingButton.style.display = 'flex';
    floatingButton.style.justifyContent = 'center';
    floatingButton.style.alignItems = 'center';
    floatingButton.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
    floatingButton.style.cursor = 'pointer';
    floatingButton.style.transition = 'background-color 0.3s ease, box-shadow 0.3s ease'; // 修改过渡效果
    // 添加特效样式
    floatingButton.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)'; // 修改阴影大小
 
    // 创建文本节点
    const buttonText = document.createTextNode('cheat');
 
    // 创建 span 元素并设置样式
    const buttonSpan = document.createElement('span');
    buttonSpan.style.color = '#FFFFFF';
    buttonSpan.appendChild(buttonText);
 
    // 将 span 元素添加至悬浮球中
    floatingButton.appendChild(buttonSpan);
 
    // 将悬浮球添加至文档中
    document.body.appendChild(floatingButton);
 
    // 鼠标移入时添加特效
    floatingButton.addEventListener('mouseenter', function() {
        floatingButton.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.3)'; // 修改阴影大小
    });
 
    // 鼠标移出时取消特效
    floatingButton.addEventListener('mouseleave', function() {
        floatingButton.style.boxShadow = '0 0 5px rgba(0, 0, 0, 0.1)'; // 修改阴影大小
    });
 
    // 给悬浮按钮绑定点击事件
    floatingButton.addEventListener('click', function() {
    core.addItem('yellowKey',100);core.addItem('blueKey',100);core.addItem('redKey',100);core.addItem('greenKey',100)
 });
})();