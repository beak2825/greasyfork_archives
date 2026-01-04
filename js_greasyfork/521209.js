// ==UserScript==
// @name         获取慕课全部选择题
// @version      1.0
// @description  从页面中提取所有选择题及其答案
// @license MIT
// @author       BaiLu
// @match        https://www.icourse163.org/*
// @grant        none
// @namespace https://greasyfork.org/users/1411786
// @downloadURL https://update.greasyfork.org/scripts/521209/%E8%8E%B7%E5%8F%96%E6%85%95%E8%AF%BE%E5%85%A8%E9%83%A8%E9%80%89%E6%8B%A9%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/521209/%E8%8E%B7%E5%8F%96%E6%85%95%E8%AF%BE%E5%85%A8%E9%83%A8%E9%80%89%E6%8B%A9%E9%A2%98.meta.js
// ==/UserScript==

(function () {
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
        let a = document.querySelectorAll(".m-choiceQuestion.u-questionItem")
        let b = ""
        a.forEach(i => {
            let e = i.querySelectorAll(".checked")
            b += i.querySelector(".j-title").innerText.trim()
            e.forEach(e1 => {
                b += e1.innerText.trim() + " "
            })
            b += "\n"
        })

        // 复制提取到的文本到剪贴板
        copyTextToClipboard(b);
    }

    // 定义复制文本到剪贴板的函数
    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function () {
                console.log('Text copied to clipboard');
            }, function (err) {
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
        button.textContent = '慕课选择答案';
        button.addEventListener('click', function () {
            extractQuestions()
        });
        document.body.appendChild(button);
    }

    addButton();

})();