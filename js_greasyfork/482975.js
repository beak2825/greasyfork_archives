// ==UserScript==
// @name         CAUjxDownload
// @namespace    www.fooood.life
// @version      23.12.24
// @description  A tool to download PDF file in CAU mooc
// @author       Sine
// @match        https://jx.cau.edu.cn/meol/common/script/preview/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482975/CAUjxDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/482975/CAUjxDownload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取指定元素
    var targetElement = document.querySelector('#dowload-preview > div > h1 > p > span');

    // 检查元素是否存在
    if (targetElement) {
        // 修改元素的文本内容
        var originalText = targetElement.textContent;
        var modifiedText = originalText + '.pdf';
        targetElement.textContent = modifiedText;

        // 输出信息到控制台
        console.log('Modified element text:', modifiedText);
    } else {
        console.error('Target element not found.');
    }


    // 添加样式，创建一个悬浮按钮
    GM_addStyle(`
        #myFloatingButton {
            position: fixed;
            top: 10px;
            right: 10px;
            padding: 10px;
            background-color: #007bff;
            color: #fff;
            cursor: pointer;
            border: none;
            border-radius: 5px;
        }
    `);

    // 创建悬浮按钮
    var floatingButton = document.createElement('button');
    floatingButton.id = 'myFloatingButton';
    floatingButton.textContent = 'Click to download';

    // 将悬浮按钮添加到页面
    document.body.appendChild(floatingButton);

    // 等待页面完全加载
    window.addEventListener('load', function() {
        // 获取到iframe元素
        var iframe = document.getElementById('pdfIframe');

        // 检查iframe是否存在
        if (iframe) {
            // 获取到内嵌网页的document对象
            var iframeDoc = iframe.contentWindow.document;

            // 获取按钮元素
            var button = iframeDoc.getElementById('download');

            // 检查按钮是否存在
            if (button) {
                // 创建并初始化一个点击事件
                var clickEvent = new Event('click', {
                    bubbles: true,
                    cancelable: true
                });

                // 添加悬浮按钮点击事件
                floatingButton.addEventListener('click', function() {
                    // 在按钮上触发点击事件
                    button.dispatchEvent(clickEvent);
                });
            } else {
                console.error('Button not found in the iframe.');
            }
        } else {
            console.error('iframe not found.');
        }
    });


})();
