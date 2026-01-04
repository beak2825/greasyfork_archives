// ==UserScript==
// @name         百度新闻链接处理
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  处理百度新闻链接
// @author       beifengfeng
// @license      MIT
// @match        *://*.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523622/%E7%99%BE%E5%BA%A6%E6%96%B0%E9%97%BB%E9%93%BE%E6%8E%A5%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/523622/%E7%99%BE%E5%BA%A6%E6%96%B0%E9%97%BB%E9%93%BE%E6%8E%A5%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function processUrl(url) {
        var match = url.match(/news_(\d+)/);
        if (match && match[1]) {
            var newsId = match[1];
            return 'https://mbd.baidu.com/newspage/data/paysubscriptionshare?nid=news_' + newsId;
        }
        return null;
    }

    // 创建按钮
    function createButton() {
        var button = document.createElement('button');
        button.textContent = '处理当前链接';
        button.style.position = 'fixed';
        button.style.top = '150px';
        button.style.right = '10px';
        button.style.zIndex = '9999';
        button.style.padding = '8px';
        button.style.backgroundColor = '#4CAF50';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';

        button.addEventListener('click', function() {
            var currentUrl = window.location.href;
            var newUrl = processUrl(currentUrl);
            
            if (newUrl) {
                // 创建结果显示框
                var resultDiv = document.createElement('div');
                resultDiv.style.position = 'fixed';
                resultDiv.style.top = '300px';
                resultDiv.style.right = '10px';
                resultDiv.style.padding = '10px';
                resultDiv.style.backgroundColor = 'white';
                resultDiv.style.border = '1px solid #ccc';
                resultDiv.style.borderRadius = '4px';
                resultDiv.style.zIndex = '9999';
                resultDiv.style.display = 'flex';
                resultDiv.style.flexDirection = 'column';
                resultDiv.style.gap = '10px';
                
                var resultText = document.createElement('div');
                resultText.textContent = '处理后的链接：';
                
                var resultLink = document.createElement('a');
                resultLink.href = newUrl;
                resultLink.textContent = newUrl;
                resultLink.target = '_blank';
                
                var jumpButton = document.createElement('button');
                jumpButton.textContent = '立即查看';
                jumpButton.style.backgroundColor = '#4CAF50';
                jumpButton.style.color = 'white';
                jumpButton.style.border = 'none';
                jumpButton.style.borderRadius = '4px';
                jumpButton.style.padding = '5px 10px';
                jumpButton.style.cursor = 'pointer';
                jumpButton.addEventListener('click', function() {
                    window.open(newUrl, '_blank');
                });
                
                resultDiv.appendChild(resultText);
                resultDiv.appendChild(resultLink);
                resultDiv.appendChild(jumpButton);
                document.body.appendChild(resultDiv);
                
                // 5秒后自动移除结果显示框
                setTimeout(function() {
                    if (resultDiv && resultDiv.parentNode) {
                        resultDiv.parentNode.removeChild(resultDiv);
                    }
                }, 5000);
            } else {
                alert('未能提取到 news_id');
            }
        });

        document.body.appendChild(button);
    }

    // 页面加载完成后创建按钮
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', createButton);
    } else {
        createButton();
    }
})(); 