// ==UserScript==
// @name         繁体转简体(使用繁化姬API)
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  使用繁化姬API自动将网页繁体中文转换为简体中文
// @author       Claude
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      api.zhconvert.org
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529096/%E7%B9%81%E4%BD%93%E8%BD%AC%E7%AE%80%E4%BD%93%28%E4%BD%BF%E7%94%A8%E7%B9%81%E5%8C%96%E5%A7%ACAPI%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529096/%E7%B9%81%E4%BD%93%E8%BD%AC%E7%AE%80%E4%BD%93%28%E4%BD%BF%E7%94%A8%E7%B9%81%E5%8C%96%E5%A7%ACAPI%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 声明使用繁化姬API的提示信息
    console.log("本程序使用了繁化姬的API服务 - 繁化姬商用必须付费 - https://zhconvert.org");

    // 创建一个按钮，用于控制转换功能
    const createControlButton = () => {
        const controlButton = document.createElement('div');
        controlButton.style.position = 'fixed';
        controlButton.style.bottom = '20px';
        controlButton.style.right = '20px';
        controlButton.style.padding = '10px';
        controlButton.style.backgroundColor = '#f0f0f0';
        controlButton.style.border = '1px solid #ccc';
        controlButton.style.borderRadius = '5px';
        controlButton.style.cursor = 'pointer';
        controlButton.style.zIndex = '9999';
        controlButton.style.fontSize = '14px';
        controlButton.style.fontFamily = 'Arial, sans-serif';
        controlButton.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        controlButton.innerHTML = '繁→简 <small>by 繁化姬</small>';
        controlButton.title = "本程序使用了繁化姬的API服务 - 繁化姬商用必须付费";
        
        // 添加繁化姬链接
        controlButton.addEventListener('click', function() {
            convertPage();
            controlButton.style.backgroundColor = '#e0e0e0';
            setTimeout(() => {
                controlButton.style.backgroundColor = '#f0f0f0';
            }, 300);
        });
        
        // 添加繁化姬官网链接
        const linkElement = document.createElement('a');
        linkElement.href = 'https://zhconvert.org';
        linkElement.target = '_blank';
        linkElement.style.position = 'fixed';
        linkElement.style.bottom = '10px';
        linkElement.style.right = '20px';
        linkElement.style.fontSize = '10px';
        linkElement.style.color = '#999';
        linkElement.style.textDecoration = 'none';
        linkElement.style.zIndex = '9999';
        linkElement.textContent = '繁化姬官网';
        
        document.body.appendChild(controlButton);
        document.body.appendChild(linkElement);
        
        return controlButton;
    };

    // 使用繁化姬API转换文本
    const convertTextViaAPI = (text, callback) => {
        if (!text || text.trim() === '') {
            callback('');
            return;
        }
        
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://api.zhconvert.org/convert',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: 'text=' + encodeURIComponent(text) + '&converter=Simplified',
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.code === 0) {
                        callback(result.data.text);
                    } else {
                        console.error('繁化姬API错误:', result.msg);
                        callback(text);
                    }
                } catch (e) {
                    console.error('解析API响应出错:', e);
                    callback(text);
                }
            },
            onerror: function(error) {
                console.error('API请求失败:', error);
                callback(text);
            }
        });
    };

    // 获取页面所有文本内容
    const getPageText = () => {
        // 获取body中的所有文本节点内容
        const walker = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            {
                acceptNode: function(node) {
                    // 排除script和style标签中的内容
                    if (node.parentNode.tagName === 'SCRIPT' || 
                        node.parentNode.tagName === 'STYLE' || 
                        node.parentNode.tagName === 'NOSCRIPT') {
                        return NodeFilter.FILTER_REJECT;
                    }
                    // 如果节点内容不为空，接受该节点
                    if (node.nodeValue.trim() !== '') {
                        return NodeFilter.FILTER_ACCEPT;
                    }
                    return NodeFilter.FILTER_SKIP;
                }
            }
        );

        const textNodes = [];
        let currentNode;
        
        while (currentNode = walker.nextNode()) {
            textNodes.push(currentNode);
        }
        
        return textNodes;
    };

    // 批量处理文本节点以减少API调用次数
    const processTextNodesInBatches = (textNodes, batchSize = 20) => {
        if (textNodes.length === 0) return;
        
        // 将文本节点分组
        for (let i = 0; i < textNodes.length; i += batchSize) {
            const batch = textNodes.slice(i, i + batchSize);
            
            // 合并批次中的文本内容，使用特殊分隔符
            const separator = '|||||';
            const combinedText = batch.map(node => node.nodeValue).join(separator);
            
            // 调用API转换组合文本
            convertTextViaAPI(combinedText, (convertedText) => {
                // 分割转换后的文本
                const convertedParts = convertedText.split(separator);
                
                // 更新各个节点的文本内容
                for (let j = 0; j < batch.length && j < convertedParts.length; j++) {
                    batch[j].nodeValue = convertedParts[j];
                }
            });
        }
    };

    // 转换页面内容
    const convertPage = () => {
        const textNodes = getPageText();
        processTextNodesInBatches(textNodes);
    };

    // 初始化
    const init = () => {
        createControlButton();
    };

    // 当页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();