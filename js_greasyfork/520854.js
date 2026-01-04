 // ==UserScript==
    // @name         万能小说下载
    // @namespace    http://tampermonkey.net/
    // @version      0.2
    // @description  保姆级教程！导出指定XPath的文本并以标题命名
    // @author       御清弦
    // @match        *://*/*
    // @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520854/%E4%B8%87%E8%83%BD%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/520854/%E4%B8%87%E8%83%BD%E5%B0%8F%E8%AF%B4%E4%B8%8B%E8%BD%BD.meta.js
    // ==/UserScript==
 
    (function() {
        'use strict';
        function createExportButton() {
            const titleXPathInput = document.createElement('input');
            titleXPathInput.placeholder = '输入标题的XPath';
            titleXPathInput.style.position = 'fixed';
            titleXPathInput.style.top = '50px';
            titleXPathInput.style.right = '10px';
            titleXPathInput.style.padding = '8px';
            titleXPathInput.style.borderRadius = '4px';
            titleXPathInput.style.border = '1px solid #ddd';
            titleXPathInput.style.width = '200px';
            titleXPathInput.style.transition = 'border-color 0.3s ease';
            
            // 从本地存储中恢复上次输入的标题XPath
            titleXPathInput.value = localStorage.getItem('titleXPath') || '';
            
            titleXPathInput.addEventListener('input', (e) => {
                // 保存标题XPath到本地存储
                localStorage.setItem('titleXPath', e.target.value);
            });
            
            titleXPathInput.addEventListener('focus', (e) => {
                e.target.style.borderColor = '#4CAF50';
                e.target.style.outline = 'none';
            });
            titleXPathInput.addEventListener('blur', (e) => {
                e.target.style.borderColor = '#ddd';
            });
            document.body.appendChild(titleXPathInput);
            
            const contentXPathInput = document.createElement('input');
            contentXPathInput.placeholder = '输入文章内容的XPath';
            contentXPathInput.style.position = 'fixed';
            contentXPathInput.style.top = '90px';
            contentXPathInput.style.right = '10px';
            contentXPathInput.style.padding = '8px';
            contentXPathInput.style.borderRadius = '4px';
            contentXPathInput.style.border = '1px solid #ddd';
            contentXPathInput.style.width = '200px';
            contentXPathInput.style.transition = 'border-color 0.3s ease';
            
            // 从本地存储中恢复上次输入的内容XPath
            contentXPathInput.value = localStorage.getItem('contentXPath') || '';
            
            contentXPathInput.addEventListener('input', (e) => {
                // 保存内容XPath到本地存储
                localStorage.setItem('contentXPath', e.target.value);
            });
            
            contentXPathInput.addEventListener('focus', (e) => {
                e.target.style.borderColor = '#4CAF50';
                e.target.style.outline = 'none';
            });
            contentXPathInput.addEventListener('blur', (e) => {
                e.target.style.borderColor = '#ddd';
            });
            document.body.appendChild(contentXPathInput);
            
            const button = document.createElement('button');
            button.textContent = '导出文章';
            button.style.position = 'fixed';
            button.style.top = '130px';
            button.style.right = '10px';
            button.style.zIndex = '9999';
            button.style.backgroundColor = '#FA897B';
            button.style.color = 'white';
            button.style.border = 'none';
            button.style.padding = '10px 20px';
            button.style.borderRadius = '5px';
            button.style.cursor = 'pointer';
            button.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            button.addEventListener('click', exportArticle);
            document.body.appendChild(button);
        }
        function exportArticle() {
            const titleXPath = document.querySelector('input[placeholder="输入标题的XPath"]').value;
            const contentXPath = document.querySelector('input[placeholder="输入文章内容的XPath"]').value;
            const titleElement = document.evaluate(titleXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            const title = titleElement ? titleElement.textContent.trim() : '未知标题';
            const articleElement = document.evaluate(contentXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (articleElement) {
                const paragraphs = articleElement.getElementsByTagName('p');
                const text = Array.from(paragraphs)
                    .map(p => p.innerText.trim())
                    .filter(text => text.length > 0)
                    .join('\r\n\r\n');
                const blob = new Blob([text], {type: 'text/plain;charset=utf-8'});
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = `${title}.txt`;
                link.click();
            } else {
                alert('未找到文章内容');
            }
        }
        window.addEventListener('load', createExportButton);
    })();