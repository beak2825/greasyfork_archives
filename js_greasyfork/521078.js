// ==UserScript==
// @name         提取易班优课问题和答案
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  提取页面中的问题和被选中的答案
// @author       BaiLu
// @license MIT
// @match        https://www.yooc.me/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/521078/%E6%8F%90%E5%8F%96%E6%98%93%E7%8F%AD%E4%BC%98%E8%AF%BE%E9%97%AE%E9%A2%98%E5%92%8C%E7%AD%94%E6%A1%88.user.js
// @updateURL https://update.greasyfork.org/scripts/521078/%E6%8F%90%E5%8F%96%E6%98%93%E7%8F%AD%E4%BC%98%E8%AF%BE%E9%97%AE%E9%A2%98%E5%92%8C%E7%AD%94%E6%A1%88.meta.js
// ==/UserScript==

(function() {
    'use strict';


    // 主函数，用于执行提取操作
    function extractQuestionsAndAnswers() {
        let a = ""; // 初始化变量a

        // 获取所有.question-board元素
        let qs = document.querySelectorAll(".question-board");

        // 遍历每个.question-board元素
        qs.forEach(board => {
            // 获取.q-cnt元素并追加其innerText到a
            let qCnts = board.querySelectorAll(".q-cnt");

            // 遍历每个.q-cnt元素
            qCnts.forEach(qCnt => {
                // 追加.q-cnt的innerText到a
                a += qCnt.innerText + "\n"; // 添加换行符以分隔每个.q-cnt的内容
            });

            // 获取当前.question-board内的所有ol元素
            let ols = board.querySelectorAll("ol");

            // 遍历每个ol元素
            ols.forEach(ol => {
                // 获取ol内的所有li元素
                let lis = ol.querySelectorAll("li");

                // 遍历每个li元素
                lis.forEach(li => {
                    // 检查li内的input是否被选中
                    let input = li.querySelector("input[type='radio']");
                    if (input && input.checked) {
                        // 如果被选中，获取对应的label并追加其innerText到a
                        let label = li.querySelector("label[for='" + input.id + "']");
                        if (label) {
                            a += label.innerText + "\n";
                        }
                    }
                    let inputs = li.querySelectorAll("input[type='checkbox']");
                    inputs.forEach(inp => {
                        if (inp && inp.checked) {
                            // 如果被选中，获取对应的label并追加其innerText到a
                            let label = li.querySelector("label[for='" + inp.id + "']");
                            if (label) {
                                a += label.innerText + "\n";
                            }
                        }
                    });
                });
            });
        });

        // 复制提取到的文本到剪贴板
        copyTextToClipboard(a);
    }

    // 定义复制文本到剪贴板的函数
    function copyTextToClipboard(text) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                console.log('问题和答案已复制到剪贴板');
            }, function(err) {
                console.error('无法复制文本: ', err);
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
                var msg = successful ? '成功' : '失败';
                console.log('使用传统方法复制文本命令 ' + msg);
            } catch (err) {
                console.error('无法复制文本', err);
            }
            document.body.removeChild(textArea);
        }
    }

    // 添加一个按钮到页面，用于触发提取操作
    function addButton() {
        var button = document.createElement('button');
        button.textContent = '提取问题和答案';
        button.style.position = 'fixed';
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '10px 20px';
        button.style.border = 'none';
        button.style.outline = 'none';
        button.style.backgroundColor = '#007bff';
        button.style.color = 'white';
        button.style.borderRadius = '5px';
        button.style.cursor = 'pointer';
        button.style.fontFamily = 'Arial, sans-serif';
        button.style.fontSize = '16px';
        button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        button.onclick = extractQuestionsAndAnswers;
        document.body.appendChild(button);
    }

    addButton();
})();
