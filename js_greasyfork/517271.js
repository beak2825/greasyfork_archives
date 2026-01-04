// ==UserScript==
// @name         伽利略日志json序列化
// @namespace    http://tampermonkey.net/
// @version      20241205
// @description  json序列化
// @author       promisewu
// @match        https://j.woa.com/service/log/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=woa.com
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/517271/%E4%BC%BD%E5%88%A9%E7%95%A5%E6%97%A5%E5%BF%97json%E5%BA%8F%E5%88%97%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/517271/%E4%BC%BD%E5%88%A9%E7%95%A5%E6%97%A5%E5%BF%97json%E5%BA%8F%E5%88%97%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建浮层弹窗
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '50px';
    overlay.style.right = '0';
    overlay.style.backgroundColor = 'white';
    overlay.style.padding = '5px';
    overlay.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.1)';
    overlay.style.zIndex = '9999';

    // 创建输入框
    const input1 = document.createElement('input');
    input1.type = 'text';

    const input2 = document.createElement('input');
    input2.type = 'text';

    // 创建按钮
    const button = document.createElement('button');
    button.style.border = '1px solid #9d9494';
    button.style.margin = '0 5px';
    button.style.borderRadius = '3px';
    button.textContent = '序列化并复制';
    button.addEventListener('click', async() => {
        const serializeObj=JSON.parse(JSON.parse(input1.value).body)
        const serializedStr = JSON.stringify(serializeObj);
        input2.value = serializedStr;
        await navigator.clipboard.writeText(serializedStr)
        console.log('伽利略日志json序列化:' ,serializeObj)
        button.textContent = '复制成功';
    });

    // 将元素添加到浮层弹窗
    overlay.appendChild(input1);
    overlay.appendChild(button);
    overlay.appendChild(input2);

    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.border = '1px solid #9d9494';
    closeButton.style.borderRadius = '3px';
    closeButton.style.marginLeft = '5px';
    closeButton.addEventListener('click', () => {
        overlay.style.display = 'none';
    });

    // 将关闭按钮添加到浮层弹窗
    overlay.appendChild(closeButton);

    // 将浮层弹窗添加到页面
    document.body.appendChild(overlay);

    document.addEventListener('copy', function(event) {
        // 获取选中的文本
        const selectedText = window.getSelection().toString();
        input1.value=selectedText
        button.textContent = '序列化并复制';
    },true);

})();