// ==UserScript==
// @name         chat01.ai 历史链接内容抓取搜索
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  抓取历史页面的标题和内容
// @author       你的名字
// @match        https://chat01.ai/zh/history
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      chat01.ai
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541602/chat01ai%20%E5%8E%86%E5%8F%B2%E9%93%BE%E6%8E%A5%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/541602/chat01ai%20%E5%8E%86%E5%8F%B2%E9%93%BE%E6%8E%A5%E5%86%85%E5%AE%B9%E6%8A%93%E5%8F%96%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 等待main元素加载
    function waitForMain(callback) {
        const main = document.querySelector('main.flex-grow.container.mx-auto.px-4.py-8');
        if (main) {
            callback(main);
        } else {
            setTimeout(() => waitForMain(callback), 500);
        }
    }

    // 获取页面内容
    function fetchPage(url, callback) {
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            onload: function(response) {
                const parser = new DOMParser();
                const doc = parser.parseFromString(response.responseText, "text/html");
                const title = doc.querySelector('title') ? doc.querySelector('title').innerText : '';
                // const bodyText = doc.body ? doc.body.innerText : '';
                const bodyText = doc.querySelector("body > div > main").innerText; // doc
                callback({url, title, bodyText});
            }
        });
    }

    // 3秒后再执行waitForMain
    setTimeout(() => {
        waitForMain(async main => {
            const links = Array.from(main.querySelectorAll('a[href]'));
            let results = await GM_getValue('chat01_results', '[]');
            try {
                results = JSON.parse(results);
            } catch (e) {
                results = [];
            }
            let count = 0;
            //debugger

            function next() {
                if (count >= links.length) {
                    // 全部抓取完毕
                    GM_setValue('chat01_results', JSON.stringify(results));
                    console.log('所有页面内容：', results);
                    return;
                }
                const href = links[count].href;
                if (results.some(item => item.url === href)) {
                    // 已有缓存，直接跳过
                    count++;
                    next();
                } else {
                    console.log('抓取页面：', href);
                    fetchPage(href, data => {
                        results.push(data);
                        count++;
                        next();
                    });
                }
            }

            next();
        });
    }, 3000);

    // 添加Alt+M快捷键监听器，弹出搜索对话框
    document.addEventListener('keydown', function(e) {
        if (e.altKey && e.key.toLowerCase() === 'm') {
            showSearchDialog();
        }
    });

    function showSearchDialog() {
        // 避免重复弹窗
        if (document.getElementById('chat01_search_dialog')) return;
        const dialog = document.createElement('div');
        dialog.id = 'chat01_search_dialog';
        dialog.style.position = 'fixed';
        dialog.style.top = '20%';
        dialog.style.left = '50%';
        dialog.style.transform = 'translate(-50%, 0)';
        dialog.style.background = '#fff';
        dialog.style.border = '1px solid #ccc';
        dialog.style.zIndex = 9999;
        dialog.style.padding = '20px';
        dialog.style.boxShadow = '0 2px 12px rgba(0,0,0,0.2)';
        dialog.innerHTML = `
            <div style="margin-bottom:10px;">关键词：<input id="chat01_search_input" type="text" style="width:200px;" /></div>
            <button id="chat01_search_btn">搜索</button>
            <button id="chat01_search_clear">清空缓存</button>
            <button id="chat01_search_close">关闭</button>
            <div id="chat01_search_result" style="margin-top:15px;max-height:300px;overflow:auto;"></div>
        `;
        document.body.appendChild(dialog);
        document.getElementById('chat01_search_input').focus();
        document.getElementById('chat01_search_close').onclick = function() {
            dialog.remove();
        };
        document.getElementById('chat01_search_btn').onclick = function() {
            doSearch();
        };
        document.getElementById('chat01_search_input').addEventListener('keydown', function(e) {
            if (e.key === 'Enter') doSearch();
        });
        document.getElementById('chat01_search_clear').onclick = async function() {
            await GM_setValue('chat01_results', '[]');
            document.getElementById('chat01_search_result').innerHTML = '<span style="color:green;">缓存已清空</span>';
        };

        async function doSearch() {
            let results = await GM_getValue('chat01_results', '[]');
            try { results = JSON.parse(results); } catch (e) { results = []; }
            const keyword = document.getElementById('chat01_search_input').value.trim();
            const resultDiv = document.getElementById('chat01_search_result');
            resultDiv.innerHTML = '';
            if (!keyword) {
                resultDiv.innerHTML = '<span style="color:red;">请输入关键词</span>';
                return;
            }
            let found = false;
            for (const item of results) {
                if (!item.bodyText) continue;
                let idx = item.bodyText.indexOf(keyword);
                while (idx !== -1) {
                    found = true;
                    // 获取上下文
                    const contextLen = 30;
                    const start = Math.max(0, idx - contextLen);
                    const end = Math.min(item.bodyText.length, idx + keyword.length + contextLen);
                    const context = item.bodyText.substring(start, end).replaceAll(keyword, `<span style='color:red;font-weight:bold;'>${keyword}</span>`);
                    resultDiv.innerHTML += `<div style='margin-bottom:15px;'><b>${item.title}</b><br><div style='color:#333;background:#f6f6f6;padding:5px 8px;border-radius:4px;'>...${context}...</div></div>`;
                    // 继续查找下一个出现位置
                    idx = item.bodyText.indexOf(keyword, idx + 1);
                }
            }
            if (!found) {
                resultDiv.innerHTML = '<span style="color:gray;">未找到匹配内容</span>';
            }
        }
    }

})();
