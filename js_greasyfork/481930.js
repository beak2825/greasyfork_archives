// ==UserScript==
// @name         复制提交信息
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  自动生成提交信息
// @author       DengLong
// @match        http://nycs-redmine.shangyoo.cn/issues/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=shangyoo.cn
// @grant        none
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/481930/%E5%A4%8D%E5%88%B6%E6%8F%90%E4%BA%A4%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/481930/%E5%A4%8D%E5%88%B6%E6%8F%90%E4%BA%A4%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮元素
    var button = document.createElement('button');
    button.innerText = '复制提交描述';
    button.style.position = 'fixed';
    button.style.right = '410px';
    button.style.top = '110px';
    button.style.zIndex = '9999';

    // 将按钮添加到页面中
    document.body.appendChild(button);

    // 点击按钮时的事件处理函数
    button.addEventListener('click', function() {
        // 获取 xpath 路径对应的元素
        var element = document.evaluate('/html/body/div[1]/div[2]/div[1]/div[3]/div[2]/h2', document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;


        if (element) {
            // 获取第一个 class="showValue" 的标签的内容
            var showValueElement = document.querySelector('.showValue');
            var showValueContent = showValueElement ? showValueElement.textContent : '';
            var parentValueContent = '';

            // 获取 class="subject" 元素
            var subject = document.querySelector('.subject');
            if (subject) {
                // 获取第一个 div/p/a 元素的 content
                var allChildren = subject.querySelector('div, p, a');
                if (allChildren.childElementCount > 1) {
                    parentValueContent = allChildren.firstChild.textContent.split(' ')[1].replace(':', '');
                }
                showValueContent = allChildren.lastChild.outerText.substr(allChildren.lastChild.outerText.lastIndexOf("\n")+1);
            }

            // 拼接内容
            var contentToCopy = parentValueContent + element.textContent.split(' ')[1] + ' ' + showValueContent;

            // 创建一个临时文本输入框
            var tempInput = document.createElement('textarea');
            tempInput.style.position = 'fixed';
            tempInput.style.opacity = 0;
            tempInput.value = contentToCopy;

            // 将临时输入框添加到页面中
            document.body.appendChild(tempInput);

            // 选中临时输入框的内容
            tempInput.select();
            tempInput.setSelectionRange(0, 99999); // 兼容移动设备

            // 复制文本到剪贴板
            document.execCommand('copy');

            // 移除临时输入框
            document.body.removeChild(tempInput);
        }
    });
})();