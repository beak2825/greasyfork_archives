// ==UserScript==
// @name         FOFA Ollama Result Extractor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  提取 FOFA 搜索结果数据（IP、端口、协议等）
// @author       YourName
// @connect      test.cityfun.com.cn
// @match        https://fofa.info/result*
// @grant        GM_xmlhttpRequest
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/527530/FOFA%20Ollama%20Result%20Extractor.user.js
// @updateURL https://update.greasyfork.org/scripts/527530/FOFA%20Ollama%20Result%20Extractor.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待页面加载完成（含动态内容）
    const waitForResults = () => {
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const results = document.querySelectorAll('div.hsxa-meta-data-item');
                if (results.length > 0) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 500);
        });
    };

    // 提取数据
    const extractData = () => {
        const data = {};
        document.querySelectorAll('div.hsxa-meta-data-item').forEach(item => {
            data[item.querySelector('span.hsxa-host > a')?.href.trim() || ''] = item.querySelector('div.hsxa-meta-data-list-main-left')?.innerText.trim() || '';
        });
        return data;
    };

    // 在页面顶部显示结果
    const displayResults = (data) => {
        const resultBox = document.createElement('div');
        resultBox.style = 'padding: 20px; background: #f0f0f0; border: 1px solid #ddd; margin: 10px;';
        resultBox.innerHTML = `<h3>提取到 ${data.length} 条结果：</h3>
            <pre>${JSON.stringify(data, null, 2)}</pre>`;
        document.body.prepend(resultBox);
    };

    const push = data => {
        GM_xmlhttpRequest({
            method: 'POST',
            url: 'https://test.cityfun.com.cn/wxser/o',
            data: JSON.stringify(data),
            headers: {"Content-Type": "application/json"},
            onload: response => console.log(`推送数据：${response.responseText}`)
        });
    };

    // 主流程
    const main = async () => {
        await waitForResults();
        const results = extractData();
        console.log('FOFA 提取结果：', results);
        // displayResults(results);
        push(results);
    };

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('qbase64')) {
        try {
            if (atob(urlParams.get('qbase64'))?.trim().toLowerCase().includes('ollama')) {
                main();
            }
        } catch (error) {
            console.error('Base64 解码失败:', error);
        }
    }
    if (!urlParams.has('page_size')) {
        urlParams.set('page_size', '30');
        window.location.href = `${window.location.pathname}?${urlParams.toString()}`;
    }
})();