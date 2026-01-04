// ==UserScript==
// @name         学科网智能组题重排打印
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  提取并重新排版指定的HTML源码段落，以便打印。
// @author       Copilot
// @match        https://zujuan.xkw.com/gzsx/zhineng/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493034/%E5%AD%A6%E7%A7%91%E7%BD%91%E6%99%BA%E8%83%BD%E7%BB%84%E9%A2%98%E9%87%8D%E6%8E%92%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/493034/%E5%AD%A6%E7%A7%91%E7%BD%91%E6%99%BA%E8%83%BD%E7%BB%84%E9%A2%98%E9%87%8D%E6%8E%92%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 应用CSS样式
    var style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = `
        #copilot-reformatted-content {
            background: white;
        }
        .copilot-question {
            margin-bottom: 10px;
            padding: 10px;
            /* border: 1px solid #ddd;
            background: #f9f9f9; */
        }
        .copilot-question .left-msg {
            margin-bottom: 5px;
            font-size: 0.8em;
            color: #666;
        }
    `;
    document.head.appendChild(style);

    // 创建悬浮按钮
    var floatButton = document.createElement('button');
    floatButton.textContent = '下载';
    floatButton.style.position = 'fixed';
    floatButton.style.bottom = '20px';
    floatButton.style.right = '20px';
    floatButton.style.zIndex = '9999';
    floatButton.style.padding = '10px 20px';
    floatButton.style.fontSize = '16px';
    floatButton.style.color = '#fff';
    floatButton.style.background = '#007bff';
    floatButton.style.border = 'none';
    floatButton.style.borderRadius = '5px';
    floatButton.style.cursor = 'pointer';
    document.body.appendChild(floatButton);


    function getNewBody() {
        // 创建一个新的div元素来存放重排版的内容
        var newPageBody = document.createElement('div');
        newPageBody.id = 'copilot-reformatted-content';

        // 获取所有的题目元素
        var questions = document.querySelectorAll('.tk-quest-item.quesroot');

        // 遍历每个题目元素
        questions.forEach(function(question) {
            // 创建一个新的题目容器
            var newQuestionDiv = document.createElement('div');
            newQuestionDiv.className = 'copilot-question';

            // 获取难度信息
            var difficultySpan = question.querySelector('.left-msg');
            if (difficultySpan) {
                newQuestionDiv.appendChild(difficultySpan.cloneNode(true));
            }

            // 获取题目内容
            var questionContentDiv = question.querySelector('.wrapper.quesdiv');
            if (questionContentDiv) {
                newQuestionDiv.appendChild(questionContentDiv.cloneNode(true));
            }

            // 将新的题目容器添加到新页面内容中
            newPageBody.appendChild(newQuestionDiv);
        });

        return newPageBody;
    }



    // 按钮点击事件
    floatButton.addEventListener('click',function(){
        var newPageBody = getNewBody();

        // 1. 将html保存下载

        // 将新页面内容转换为HTML字符串
        var htmlContent = document.head.outerHTML + newPageBody.outerHTML;

        // 创建一个Blob对象
        var blob = new Blob([htmlContent], {type: 'text/html'});

        // 创建一个下载链接
        var downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'reformatted-content.html';

        // 触发下载
        downloadLink.click();

    });

    // 监听键盘事件--debug用
    document.addEventListener('keydown', function(e) {
        // 检查是否按下了Esc
        if (e.code === "Escape") {
            // 2. 清空原页面内容并添加新内容
            var newPageBody = getNewBody();
            document.body.innerHTML = '';
            document.body.appendChild(newPageBody);
        }
    });
})();

