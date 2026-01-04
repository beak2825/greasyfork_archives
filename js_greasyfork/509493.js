// ==UserScript==
// @name         妖火网彩色文字生成器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  在妖火网页面创建一个彩虹色文字生成器
// @author       
// @license      AGPL-3.0-or-later
// @match        *://yaohuo.me/bbs*
// @match        *://www.yaohuo.me/bbs*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/509493/%E5%A6%96%E7%81%AB%E7%BD%91%E5%BD%A9%E8%89%B2%E6%96%87%E5%AD%97%E7%94%9F%E6%88%90%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/509493/%E5%A6%96%E7%81%AB%E7%BD%91%E5%BD%A9%E8%89%B2%E6%96%87%E5%AD%97%E7%94%9F%E6%88%90%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    
    const styles = `
        #rainbow-generator {
            display: none;
            position: fixed;
            bottom: 70px;
            right: 20px;
            width: 350px; 
            max-height: 400px;
            overflow-y: auto;
            padding: 20px;
            background-color: #ffffff;
            border-radius: 10px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
            z-index: 9999;
            font-family: 'Arial', sans-serif;
        }
        #rainbow-generator label {
            display: block;
            margin-bottom: 8px;
            font-weight: bold;
            font-size: 1em;
            color: #004d40;
        }
        #rainbow-generator input[type="text"],
        #rainbow-generator textarea {
            width: calc(100% - 22px); 
            padding: 12px; 
            border: 2px solid #009688;
            border-radius: 5px;
            margin-bottom: 15px;
            font-size: 1em;
            background-color: #f9fbe7;
            transition: border-color 0.3s;
        }
        #rainbow-generator input[type="text"]:focus,
        #rainbow-generator textarea:focus {
            border-color: #00796b; 
            outline: none; 
        }
        #rainbow-generator textarea {
            height: 80px; 
            resize: none; 
        }
        #rainbow-generator input[type="text"] {
            height: 40px; 
        }
        #rainbow-generator button {
            width: 100%;
            padding: 12px;
            background-color: #00796b;
            border: none;
            border-radius: 5px;
            color: white;
            font-size: 16px;
            cursor: pointer;
            transition: background-color 0.3s;
        }
        #rainbow-generator button:hover {
            background-color: #004d40; 
        }
        #preview {
            margin-top: 5px;
            padding: 5px;
            border-radius: 5px;
            font-size: 1em;
        }
        #floating-button {
            position: fixed;
            bottom: 20px;
            top: calc(25% + 20px); 
            right: 20px;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background-color: #00796b;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            cursor: pointer;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            transition: background-color 0.3s; 
        }
        #floating-button:hover {
            background-color: #004d40;
        }
    `;

    
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    
    const button = document.createElement('div');
    button.id = 'floating-button';
    button.innerText = '🌈';

    const generatorDiv = document.createElement('div');
    generatorDiv.id = 'rainbow-generator';
    generatorDiv.innerHTML = `
        <center><h1 style="margin: 0; font-size: 1.5em; color: #004d40;">彩虹色文字生成器</h1></center>
        <label for="inputText">请输入文本：</label>
        <input type="text" id="inputText" placeholder="输入你的文字..." aria-required="true">
        <button id="generateButton">生成预览</button>
        <input type="text" id="output" readonly style="display: none;">
        <label for="inputText">预览效果：</label>
        <div id="preview"></div>
        <div id="copyMessage" style="color: green; margin-top: 10px; display: none;"></div>
        <button id="copyButton">一键复制</button>
    `;

    document.body.appendChild(generatorDiv);
    document.body.appendChild(button);

    
    button.addEventListener('click', function () {
        const generator = document.getElementById('rainbow-generator');
        if (generator.style.display === 'none' || generator.style.display === '') {
            generator.style.display = 'block';
        } else {
            generator.style.display = 'none';
        }
    });

    
    function getRandomColor() {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }

    
    function generateRainbow() {
        const inputText = document.getElementById('inputText').value;
        let ubbText = '';
        let previewHtml = '';

        for (let i = 0; i < inputText.length; i++) {
            const color = getRandomColor(); 
            ubbText += `[forecolor=${color}]${inputText[i]}[/forecolor]`;
            previewHtml += `<span style="color: ${color}">${inputText[i]}</span>`;
        }

        document.getElementById('output').value = ubbText; 
        document.getElementById('preview').innerHTML = previewHtml; 
    }

    
    function copyToClipboard() {
    const output = document.getElementById('output');
    const copyMessage = document.getElementById('copyMessage');
    
    output.style.display = 'block';
    output.select();
    document.execCommand('copy');
    
    copyMessage.innerText = '已复制到剪贴板！';
    copyMessage.style.display = 'block'; 
    
    output.style.display = 'none';
    
    
    setTimeout(() => {
        copyMessage.style.display = 'none'; 
    }, 2000);
}

    
    document.getElementById('generateButton').addEventListener('click', generateRainbow);
    document.getElementById('copyButton').addEventListener('click', copyToClipboard);
})();