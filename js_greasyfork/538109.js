// ==UserScript==
// @name         简单网页翻译工具
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  选中文本后点击翻译按钮翻译成中文
// @author       Your name
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      api.microsofttranslator.com
// @connect      edge.microsoft.com
// @connect      *
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538109/%E7%AE%80%E5%8D%95%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/538109/%E7%AE%80%E5%8D%95%E7%BD%91%E9%A1%B5%E7%BF%BB%E8%AF%91%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // 添加样式
    GM_addStyle(`
        #translationButton {
            position: fixed;
            display: none;
            z-index: 9999999;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 5px 10px;
            cursor: pointer;
            font-size: 13px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
        }
        #translationButton:hover {
            background: #f0f0f0;
        }
        #translationResult {
            position: fixed;
            display: none;
            z-index: 9999999;
            background: white;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 10px;
            max-width: 300px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            font-family: Arial, sans-serif;
            font-size: 14px;
            line-height: 1.4;
        }
        #translationResult .close-btn {
            position: absolute;
            right: 5px;
            top: 5px;
            cursor: pointer;
            color: #666;
            font-size: 14px;
            padding: 0 5px;
        }
        #translationResult .close-btn:hover {
            color: #333;
        }
    `);

    // 创建翻译按钮
    const button = document.createElement('div');
    button.id = 'translationButton';
    button.textContent = '翻译';
    document.body.appendChild(button);

    // 创建翻译结果显示框
    const resultDiv = document.createElement('div');
    resultDiv.id = 'translationResult';
    const closeBtn = document.createElement('span');
    closeBtn.className = 'close-btn';
    closeBtn.textContent = '×';
    closeBtn.onclick = () => {
        resultDiv.style.display = 'none';
    };
    resultDiv.appendChild(closeBtn);
    document.body.appendChild(resultDiv);

    // 监听选中文本事件
    document.addEventListener('mouseup', function(e) {
        const selection = window.getSelection();
        const selectedText = selection.toString().trim();
        
        if (selectedText) {
            // 显示翻译按钮在鼠标附近
            button.style.left = (e.pageX + 5) + 'px';
            button.style.top = (e.pageY + 5) + 'px';
            button.style.display = 'block';
        } else {
            button.style.display = 'none';
        }
    });

    // 点击页面其他地方时隐藏按钮
    document.addEventListener('mousedown', function(e) {
        if (e.target !== button && !resultDiv.contains(e.target)) {
            button.style.display = 'none';
        }
    });

    // 翻译按钮点击事件
    button.addEventListener('click', function() {
        const text = window.getSelection().toString().trim();
        if (text) {
            translateText(text);
            button.style.display = 'none';
        }
    });

    // 获取Bing翻译token
    async function getBingToken() {
        try {
            const response = await fetch('https://edge.microsoft.com/translate/auth', {
                method: 'GET'
            });
            return await response.text();
        } catch (error) {
            console.error('获取token失败:', error);
            return null;
        }
    }

    // 翻译函数
    async function translateText(text) {
        showResult('正在翻译...');
        
        try {
            // 获取token
            const token = await getBingToken();
            if (!token) {
                showResult('翻译服务初始化失败，请重试');
                return;
            }

            // 构建请求URL
            const url = 'https://api.microsofttranslator.com/v2/Http.svc/Translate';
            const params = new URLSearchParams({
                'appId': `Bearer ${token}`,
                'text': text,
                'from': '',
                'to': 'zh-CN'
            });

            // 发送翻译请求
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${url}?${params.toString()}`,
                headers: {
                    'Accept': 'application/xml',
                    'Content-Type': 'text/plain'
                },
                onload: function(response) {
                    if (response.status === 200) {
                        // 解析XML响应
                        const parser = new DOMParser();
                        const xmlDoc = parser.parseFromString(response.responseText, "text/xml");
                        const translatedText = xmlDoc.documentElement.textContent;
                        showResult(translatedText);
                    } else {
                        console.error('翻译请求失败:', response);
                        showResult('翻译失败，请重试');
                    }
                },
                onerror: function(error) {
                    console.error('请求错误:', error);
                    showResult('网络错误，请重试');
                }
            });
        } catch (error) {
            console.error('翻译错误:', error);
            showResult('翻译出错，请重试');
        }
    }

    // 显示翻译结果
    function showResult(text) {
        const content = document.createElement('div');
        content.style.marginRight = '20px';
        content.textContent = text;
        
        // 清空之前的内容
        while (resultDiv.children.length > 1) {
            resultDiv.removeChild(resultDiv.lastChild);
        }
        
        resultDiv.appendChild(content);
        
        // 设置位置（在按钮下方）
        const buttonRect = button.getBoundingClientRect();
        resultDiv.style.left = buttonRect.left + 'px';
        resultDiv.style.top = (buttonRect.bottom + 5) + 'px';
        resultDiv.style.display = 'block';
        
        // 检查是否超出屏幕
        const resultRect = resultDiv.getBoundingClientRect();
        if (resultRect.right > window.innerWidth) {
            resultDiv.style.left = (window.innerWidth - resultRect.width - 10) + 'px';
        }
        if (resultRect.bottom > window.innerHeight) {
            resultDiv.style.top = (buttonRect.top - resultRect.height - 5) + 'px';
        }
    }
})(); 