// ==UserScript==
// @name         获取学习通全部选择题
// @namespace    从页面中提取所有选择题及其答案
// @version      1.1
// @description  从页面中提取所有选择题及其答案
// @author       BaiLu
// @license MIT
// @match        https://i.chaoxing.com/*
// @match        https://mooc1.chaoxing.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521004/%E8%8E%B7%E5%8F%96%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%85%A8%E9%83%A8%E9%80%89%E6%8B%A9%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/521004/%E8%8E%B7%E5%8F%96%E5%AD%A6%E4%B9%A0%E9%80%9A%E5%85%A8%E9%83%A8%E9%80%89%E6%8B%A9%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式以美化按钮
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #extractButton {
            position: fixed;
            bottom: 10px;
            right: 10px;
            z-index: 9999;
            padding: 10px 20px;
            font-size: 16px;
            color: #fff;
            background-color: #28a745;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            outline: none;
            box-shadow: 0 4px 8px rgba(0,0,0,0.2);
            transition: background-color 0.3s, transform 0.1s;
        }
        #extractButton:hover {
            background-color: #218838;
            transform: translateY(-2px);
        }
        #extractButton:active {
            background-color: #1e7e34;
            transform: translateY(0);
        }
    `;
    document.head.appendChild(style);

    // 主函数，用于执行提取操作
    function extractQuestions() {
        var a = ""; // 用于收集所有问题的字符串

        // 获取所有具有 'whiteDiv' 类的元素
        var whiteDivs = document.querySelectorAll('.whiteDiv');

        // 遍历每个 'whiteDiv' 元素
        whiteDivs.forEach(function(whiteDiv) {
            // 获取当前 'whiteDiv' 内所有的 'stem_answer' 元素
            var stemAnswers = whiteDiv.querySelectorAll('.stem_answer');
            var problems = whiteDiv.querySelectorAll(".mark_name.colorDeep");
            var title = whiteDiv.querySelector(".type_tit");

            // 创建一个数组来收集所有 'aria-checked="true"' 子元素的文本
            var checkedTexts = [];
            var f = false;

            // 遍历每个 'stem_answer' 元素
            for (var i = 0; i < stemAnswers.length; i++) {
                var stemAnswer = stemAnswers[i];

                // 获取所有 'aria-checked="true"' 的子元素
                var checkedElements = stemAnswer.querySelectorAll('[aria-checked="true"]');
                if (checkedElements.length == 0) {
                    checkedElements = stemAnswer.querySelectorAll('.check_answer');
                    f = true;
                }
                if (checkedElements.length == 0) {
                    checkedElements = stemAnswer.querySelectorAll(".check_answer_dx");
                    f = true;
                }

                checkedTexts.push(problems[i].innerText.replace(/\n/g, ''));

                // 使用索引遍历每个 'aria-checked="true"' 的子元素并收集它们的文本
                for (var j = 0; j < checkedElements.length; j++) {
                    var checkedElement = checkedElements[j];
                    if (f) checkedElement = checkedElement.parentElement;
                    var textWithoutNewLines = checkedElement.innerText.replace(/\n/g, '');
                    checkedTexts.push(textWithoutNewLines);
                }
                checkedTexts.push("\n");
            }

            // 将收集到的文本用空格连接起来，并输出
            a += title.innerText + checkedTexts.join(' ') + "\n";
        });

        // 复制提取到的文本到剪贴板
        copyTextToClipboard(a);
    }

    // 定义复制文本到剪贴板的函数
    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                console.log('Text copied to clipboard');
            }, function(err) {
                console.error('Could not copy text: ', err);
            });
        } else {
            // 创建一个临时的textarea元素用于复制
            var textArea = document.createElement("textarea");
            textArea.value = text;
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                var successful = document.execCommand('copy');
                var msg = successful ? 'successful' : 'unsuccessful';
                console.log('Fallback: Copying text command was ' + msg);
            } catch (err) {
                console.error('Fallback: Oops, unable to copy', err);
            }
            document.body.removeChild(textArea);
        }
    }

    // 添加一个按钮到页面，用于触发提取操作
    function addButton() {
        var button = document.createElement('button');
        button.id = 'extractButton';
        button.textContent = '学习通选择答案';
        button.addEventListener('click', function() {
            extractQuestions()
        });
        document.body.appendChild(button);
    }

    addButton();

})();
