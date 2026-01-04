// ==UserScript==
// @name         超星自助评教
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在i.chaoxing.com子页面中点击radio按钮并提交
// @author       hustcse
// @match        https://i.chaoxing.com/*
// @grant        none
// @license      GreaysFork
// @downloadURL https://update.greasyfork.org/scripts/484243/%E8%B6%85%E6%98%9F%E8%87%AA%E5%8A%A9%E8%AF%84%E6%95%99.user.js
// @updateURL https://update.greasyfork.org/scripts/484243/%E8%B6%85%E6%98%9F%E8%87%AA%E5%8A%A9%E8%AF%84%E6%95%99.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮
    function createButton() {
        const button = document.createElement('button');
        button.innerHTML = '自动评价';
        button.style.position = 'fixed';
        button.style.top = '50%';
        button.style.right = '20px';
        button.style.zIndex = '9999';
        document.body.appendChild(button);

        // 按钮点击事件处理程序
        button.addEventListener('click', function() {
            clickRadioButtonsAndSubmitInIframe();
        });
    }

    // 在iframe中点击Radio按钮并提交
    function clickRadioButtonsAndSubmitInIframe() {
        // 获取iframe元素
        const iframe = document.getElementById('frame_content');

        // 检查iframe是否存在
        if (!iframe) {
            console.error('找不到iframe元素。');
            return;
        }

        // 切换到iframe的上下文
        const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;

        // 在iframe中查找并点击radio按钮
        const radioButtons = iframeDocument.querySelectorAll('input[type="radio"][targetoption="1"]');

        radioButtons.forEach(function(radioButton) {
            // 模拟点击操作
            radioButton.click();
        });

        // 在iframe中查找并点击提交按钮
        const submitButton = iframeDocument.querySelector('a[onclick="save(2);"]');

        if (submitButton) {
            // 模拟点击提交按钮
            submitButton.click();
        } else {
            console.error('找不到提交按钮。请检查选择器是否正确。');
        }
    }

    // 在页面加载完毕后创建按钮
    window.addEventListener('load', function() {
        createButton();
    });

})();
