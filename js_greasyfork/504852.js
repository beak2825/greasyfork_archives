// ==UserScript==
// @name         简易维基人协助审核
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  在bgm维基人页面左下角显示非维基人协助编辑申请
// @author       墨云
// @match        https://bangumi.tv/wiki
// @match        https://bgm.tv/wiki
// @match        https://chii.in/wiki
// @license      MIT
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/504852/%E7%AE%80%E6%98%93%E7%BB%B4%E5%9F%BA%E4%BA%BA%E5%8D%8F%E5%8A%A9%E5%AE%A1%E6%A0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/504852/%E7%AE%80%E6%98%93%E7%BB%B4%E5%9F%BA%E4%BA%BA%E5%8D%8F%E5%8A%A9%E5%AE%A1%E6%A0%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮窗
    const floatWindow = document.createElement('div');
    floatWindow.id = 'floatWindow';
    floatWindow.style.position = 'fixed';
    floatWindow.style.bottom = '10px';
    floatWindow.style.left = '10px';
    floatWindow.style.backgroundColor = 'white';
    floatWindow.style.border = '1px solid black';
    floatWindow.style.padding = '10px';
    floatWindow.style.zIndex = '10000';
    document.body.appendChild(floatWindow);

    // 添加样式
    GM_addStyle(`
        #floatWindow {
            box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.5);
        }
        .myButton {
            margin-top: 10px;
            padding: 5px 10px;
            background-color: #4CAF50;
            color: white;
            border: none;
            cursor: pointer;
        }
        .myButton:hover {
            background-color: #45a049;
        }
        .loading {
            text-align: center;
            padding: 10px;
            font-size: 14px;
            color: #999;
        }
    `);

    // 目标网页URL
    const targetUrl1 = 'https://patch.bgm38.tv/?type=subject';
    const targetUrl2 = 'https://patch.bgm38.tv/?type=episode';

    // 发送请求获取目标网页源代码
    function fetchData(url, targetString, callback) {
        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function(response) {
                const sourceCode = response.responseText;
                const count = (sourceCode.match(new RegExp(targetString, 'g')) || []).length;
                callback(count);
            }
        });
    }

    // 显示数据
    function displayData() {
        floatWindow.innerHTML = '<div class="loading">加载中...</div>';
        fetchData(targetUrl1, 'badge bg-primary', function(count) {
            floatWindow.innerHTML = `有 ${count} 个 "待审核" 条目`;
            addButton('前往审核', targetUrl1);
        });

        fetchData(targetUrl2, 'badge bg-primary', function(count) {
            floatWindow.innerHTML += `<br>有 ${count} 个 "待审核" 章节`;
            addButton('前往审核', targetUrl2);
        });
    }

    // 添加按钮
    function addButton(text, url) {
        const button = document.createElement('button');
        button.className = 'myButton';
        button.innerText = text;
        button.addEventListener('click', function() {
            window.open(url, '_blank');
        });
        floatWindow.appendChild(button);
    }

    // 初始加载数据
    displayData();

    // 每20秒刷新一次数据
    setInterval(displayData, 20000);
})();

