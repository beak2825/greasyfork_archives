// ==UserScript==
// @name         超星Mooc脚本 一键复制视频字幕 ChatGPT助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  增加一键复制视频字幕按钮
// @author       Athena
// @match        https://mooc1.chaoxing.com/mycourse/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chaoxing.com
// @grant        GM_xmlhttpRequest
// @copyright    2023 TennousuAthena
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479364/%E8%B6%85%E6%98%9FMooc%E8%84%9A%E6%9C%AC%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%20ChatGPT%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/479364/%E8%B6%85%E6%98%9FMooc%E8%84%9A%E6%9C%AC%20%E4%B8%80%E9%94%AE%E5%A4%8D%E5%88%B6%E8%A7%86%E9%A2%91%E5%AD%97%E5%B9%95%20ChatGPT%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const srtToTxt = (srtContent) => {
        // 将SRT内容拆分为段落
        const srtParagraphs = srtContent.trim().split('\n\n');

        // 提取文本部分并忽略时间
        const txtContent = srtParagraphs.map((paragraph) => {
            const lines = paragraph.split('\n');
            const textLines = lines.slice(2); // 忽略前两行（序号和时间）
            return textLines.join(' '); // 合并文本行
        }).join('\n'); // 将段落文本合并为一个文本

        return txtContent;
    }

    function openNewWindow(text) {
        // 创建一个新窗口
        var newWindow = window.open("", "_blank", "width=400,height=200");

        // 在新窗口中写入HTML内容
        newWindow.document.write(`
    <html>
    <head>
        <meta charset="utf-8">
        <title>由此复制文本</title>
        <script>
            function copyText() {
                // 创建一个隐藏的textarea元素
                var textarea = document.createElement('textarea');

                // 设置textarea的值为要复制的文本
                textarea.value = '`+ text +`';

                // 将textarea添加到body中
                document.body.appendChild(textarea);

                // 选择textarea的文本
                textarea.select();

                // 使用execCommand复制文本
                document.execCommand('copy');

                // 删除textarea元素
                document.body.removeChild(textarea);

                window.close();
            }
        </script>
    </head>
    <body>
        <p>点击文本进行复制：</p>
        <p onclick="copyText()">`+ text.replace('\n', '<br />') +`</p>
    </body>
    </html>
  `);

        // 关闭新窗口时执行的操作
        newWindow.onbeforeunload = function() {
            // 在这里添加需要执行的操作
        };
    }

    function handle(){

        let currentMid = document.querySelector("#iframe").contentWindow.document.querySelector('iframe').getAttribute('mid');
        console.log('Mid信息已获取', currentMid)
        fetch(`https://mooc1.chaoxing.com/mooc-ans/richvideo/allsubtitle?mid=` + currentMid)
            .then(response => response.json())
            .then(data => {let srtUrl = data[0].url;
                           GM_xmlhttpRequest({
                               method: 'GET',
                               url: srtUrl,
                               onload: function(response) {
                                   const result = srtToTxt(response.responseText);
                                   navigator.clipboard.writeText(result);
                                   console.log(result, '剪切板已注入');
                                   //openNewWindow(result);
                               },
                               onerror: function(response) {
                                   console.error(response.statusText);
                               }
                           });
                          })
            .catch(error => console.error(error));
    }

    window.onload = ()=>{
        // 创建按钮元素
        var button = document.createElement('button');

        // 设置按钮的文本内容
        button.innerText = '复制字幕';

        button.style.backgroundColor = "#2196F3";
        button.style.color = "white";
        button.style.padding = "12px 24px";
        button.style.border = "none";
        button.style.borderRadius = "4px";
        button.style.cursor = "pointer";

        // 设置按钮的样式
        button.style.position = 'fixed';
        button.style.top = '60px';
        button.style.left = '20px';
        button.style.zIndex = 9999999;

        document.body.appendChild(button);
        button.addEventListener("click", function() {
            handle();
            alert('复制完毕');
        });

    }
})();