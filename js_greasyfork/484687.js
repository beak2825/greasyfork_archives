// ==UserScript==
// @name         ecosia强制刷新
// @version      2024-01-13-4
// @namespace    me.mm.ecosia
// @description  阻止ecosia重定向到bing!
// @license      MIT
// @author       木木
// @match        https://www.ecosia.org/*
// @match        https://*.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tencent.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484687/ecosia%E5%BC%BA%E5%88%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/484687/ecosia%E5%BC%BA%E5%88%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //写一个方法，选择可以传入参数，在网页中心展示一个对话框，有标题，有内容，有确定按钮，有取消按钮，有关闭按钮，可以传入回调函数
    function showResponsiveMsgBox(title, content, ok, cancel) {
        var msgBox = document.createElement('div');
        msgBox.style.position = 'fixed';
        msgBox.style.top = '50%';
        msgBox.style.left = '50%';
        msgBox.style.transform = 'translate(-50%, -50%)';
        msgBox.style.width = '80%'; // Adjust the width as needed
        msgBox.style.maxWidth = '400px'; // Maximum width for better readability on larger screens
        msgBox.style.backgroundColor = '#fff';
        msgBox.style.borderRadius = '10px';
        msgBox.style.boxShadow = '0 0 10px #000';
        msgBox.style.zIndex = '999';
    
        // Dialog title
        var titleBar = document.createElement('div');
        titleBar.style.width = '100%';
        titleBar.style.height = '30px';
        titleBar.style.lineHeight = '30px';
        titleBar.style.backgroundColor = '#000';
        titleBar.style.color = '#fff';
        titleBar.style.textAlign = 'center';
        titleBar.style.borderRadius = '10px 10px 0 0';
        titleBar.textContent = title;
        msgBox.appendChild(titleBar);
    
        // Dialog content
        var contentDiv = document.createElement('div');
        contentDiv.style.width = '100%';
        contentDiv.style.maxHeight = '140px'; // Limit the height for smaller screens
        contentDiv.style.overflowY = 'auto'; // Add scroll if content is too long
        contentDiv.style.padding = '10px';
        contentDiv.style.boxSizing = 'border-box';
        contentDiv.textContent = content;
        msgBox.appendChild(contentDiv);
    
        // Buttons container
        var buttonsDiv = document.createElement('div');
        buttonsDiv.style.width = '100%';
        buttonsDiv.style.height = '30px';
        buttonsDiv.style.lineHeight = '30px';
        buttonsDiv.style.backgroundColor = '#000';
        buttonsDiv.style.color = '#fff';
        buttonsDiv.style.textAlign = 'center';
        buttonsDiv.style.borderRadius = '0 0 10px 10px';
    
        // OK button
        var okBtn = document.createElement('button');
        okBtn.style.width = '45%';
        okBtn.style.height = '100%';
        okBtn.style.margin = '0 5%';
        okBtn.style.borderRadius = '5px';
        okBtn.style.backgroundColor = '#fff';
        okBtn.style.border = '1px solid #000';
        okBtn.textContent = '确定';
        okBtn.onclick = function () {
            document.body.removeChild(msgBox);
            ok();
        };
        buttonsDiv.appendChild(okBtn);
    
        // Cancel button
        var cancelBtn = document.createElement('button');
        cancelBtn.style.width = '45%';
        cancelBtn.style.height = '100%';
        cancelBtn.style.margin = '0 5%';
        cancelBtn.style.borderRadius = '5px';
        cancelBtn.style.backgroundColor = '#fff';
        cancelBtn.style.border = '1px solid #000';
        cancelBtn.textContent = '取消';
        cancelBtn.onclick = function () {
            document.body.removeChild(msgBox);
            cancel();
        };
        buttonsDiv.appendChild(cancelBtn);
    
        msgBox.appendChild(buttonsDiv);
    
        // Append dialog box to the body
        document.body.appendChild(msgBox);
    }
    
    // Example usage:
    // showResponsiveMsgBox('Dialog Title', 'This is the dialog content. It can be a long text that will scroll on smaller screens.', function() {
    //     console.log('OK button clicked');
    // }, function() {
    //     console.log('Cancel button clicked');
    // });
    
    if (window.location.href.indexOf('bing') != -1) {
        const ok = function() {
            const timestamp = new Date().getTime();
            window.location.replace('https://www.ecosia.org?nocache=' + timestamp);
        };
        const cancel = function() {
            
        };
        showResponsiveMsgBox('尊敬的今朝大人', '是否清除缓存并跳转到ecosia，请在连接梯子情况下点击确认', ok, cancel);
    }

    // Your code here...
})();