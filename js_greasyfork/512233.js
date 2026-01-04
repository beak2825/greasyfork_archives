// ==UserScript==
// @name         高级感仿MOS风格标签页界面
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在新标签页中展示高级感的仿MOS风格界面，注重简洁与用户体验
// @author       你的名字
// @license      MIT
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512233/%E9%AB%98%E7%BA%A7%E6%84%9F%E4%BB%BFMOS%E9%A3%8E%E6%A0%BC%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/512233/%E9%AB%98%E7%BA%A7%E6%84%9F%E4%BB%BFMOS%E9%A3%8E%E6%A0%BC%E6%A0%87%E7%AD%BE%E9%A1%B5%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自定义的MOS风格HTML界面
    const customPageHTML = `
    <!DOCTYPE html>
    <html lang="zh">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>高级感界面</title>
        <style>
            body {
                font-family: 'Helvetica Neue', 'Arial', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #f0f0f0, #e6e6e6);
            }
            .container {
                padding: 40px;
                background-color: white;
                border-radius: 20px;
                box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
                text-align: center;
                max-width: 400px;
                width: 100%;
                transition: all 0.3s ease;
            }
            .container:hover {
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            }
            h1 {
                font-size: 28px;
                color: #333;
                margin-bottom: 25px;
                font-weight: 500;
            }
            input {
                border: none;
                border-bottom: 2px solid #ccc;
                padding: 12px;
                width: 100%;
                margin-bottom: 20px;
                font-size: 18px;
                background-color: #f9f9f9;
                border-radius: 10px;
                outline: none;
                transition: border-color 0.3s ease;
            }
            input:focus {
                border-color: #007BFF;
                background-color: #fff;
            }
            button {
                padding: 14px 0;
                background-color: #007BFF;
                border: none;
                color: white;
                font-size: 18px;
                border-radius: 12px;
                cursor: pointer;
                width: 100%;
                transition: background-color 0.3s ease, transform 0.2s;
            }
            button:hover {
                background-color: #0056b3;
                transform: translateY(-2px);
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>高级感界面</h1>
            <input type="text" id="inputText" placeholder="输入您的内容">
            <button id="submitButton">提交</button>
        </div>

        <script>
            document.getElementById('submitButton').addEventListener('click', function() {
                const userInput = document.getElementById('inputText').value;
                if(userInput.trim() === "") {
                    alert("请输入内容");
                } else {
                    alert('您输入的内容是: ' + userInput);
                }
            });
        </script>
    </body>
    </html>
    `;

    // 打开一个新标签页并写入自定义HTML
    let newTab = window.open('about:blank', '_blank');
    newTab.document.write(customPageHTML);
    newTab.document.close();
})();