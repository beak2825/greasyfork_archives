// ==UserScript==
// @name         新闻概括和身份证生成
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license MIT
// @description  在网页右下角生成一个图片入口，点击后显示功能选项卡
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @connect      momoyu.cc
// @downloadURL https://update.greasyfork.org/scripts/521117/%E6%96%B0%E9%97%BB%E6%A6%82%E6%8B%AC%E5%92%8C%E8%BA%AB%E4%BB%BD%E8%AF%81%E7%94%9F%E6%88%90.user.js
// @updateURL https://update.greasyfork.org/scripts/521117/%E6%96%B0%E9%97%BB%E6%A6%82%E6%8B%AC%E5%92%8C%E8%BA%AB%E4%BB%BD%E8%AF%81%E7%94%9F%E6%88%90.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    const style = document.createElement('style');
    style.textContent = `
        .modal {
            display: none;
            position: fixed;
            bottom: 70px;
            right: 10px;
            background-color: white;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            padding: 20px;
            z-index: 1000;
            transform: scale(0.7);
            opacity: 0;
            transition: all 0.3s ease-in-out;
        }

        .modal.show {
            display: block;
            transform: scale(1);
            opacity: 1;
        }

        .tab-buttons {
            display: flex;
            gap: 10px;
            margin-bottom: 15px;
        }

        .tab-button {
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            background: #f0f0f0;
            cursor: pointer;
            transition: background 0.2s;
        }

        .tab-button:hover {
            background: #e0e0e0;
        }

        .tab-button.active {
            background: #007bff;
            color: white;
        }

        .tab-content {
            min-width: 300px;
            max-height: 400px;
            overflow-y: auto;
        }
    `;
    document.head.appendChild(style);

    // 创建图片入口
    const img = document.createElement('img');
    img.src = 'https://s3plus.meituan.net/v1/mss_ed4799e20c294b609677ace14ec7982d/high-qps-bucket/playground/6172512.gif';
    img.style.position = 'fixed';
    img.style.bottom = '10px';
    img.style.right = '10px';
    img.style.width = '50px';
    img.style.height = '50px';
    img.style.cursor = 'pointer';
    img.style.zIndex = '999';
    document.body.appendChild(img);

    // 创建模态框
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="tab-buttons">
            <button class="tab-button active" data-tab="news">新闻咨询概括</button>
            <button class="tab-button" data-tab="id">身份证用例查询</button>
        </div>
        <div class="tab-content" id="newsContent">
            正在加载新闻...
        </div>
        <div class="tab-content" id="idContent" style="display:none">
            身份证查询功能开发中...
        </div>
    `;
    document.body.appendChild(modal);

    // 切换标签页
    const tabButtons = modal.querySelectorAll('.tab-button');
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // 更新按钮状态
            tabButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            // 更新内容显示
            const tabId = button.dataset.tab;
            document.getElementById('newsContent').style.display = tabId === 'news' ? 'block' : 'none';
            document.getElementById('idContent').style.display = tabId === 'id' ? 'block' : 'none';
        });
    });

    // 点击图片显示/隐藏模态框
    let isModalVisible = false;
    img.addEventListener('click', () => {
        isModalVisible = !isModalVisible;
        if(isModalVisible) {
            modal.classList.add('show');
            // 如果是显示模态框，则获取新闻
            fetchNews();
        } else {
            modal.classList.remove('show');
        }
    });

    // 点击外部关闭模态框
    document.addEventListener('click', (e) => {
        if(isModalVisible && !modal.contains(e.target) && e.target !== img) {
            isModalVisible = false;
            modal.classList.remove('show');
        }
    });

   // 获取新闻数据
function fetchNews() {
    GM_xmlhttpRequest({
        method: 'GET',
        url: 'https://momoyu.cc/api/hot/list?type=0',
        headers: {
            'Accept': 'application/json'
        },
        onload: function(response) {
            try {
                const json = JSON.parse(response.responseText);
                if (json.status === 100000 && json.data && json.data[0].data) {
                    const newsItems = json.data[0].data;

                    let newsHtml = '<ul style="list-style:none; padding:0;">';
                    newsItems.forEach(item => {
                        newsHtml += `
                            <li style="margin-bottom:15px; padding:15px; background:#f8f9fa; border-radius:8px;">
                                <a href="${item.link}" target="_blank" style="text-decoration:none; color:#333;">
                                    <div style="font-size:16px; margin-bottom:8px;">${item.title}</div>
                                    <div style="color:#666; font-size:14px;">
                                        <span style="color:#007bff;">热度: ${item.extra}</span>
                                    </div>
                                </a>
                            </li>
                        `;
                    });
                    newsHtml += '</ul>';

                    document.getElementById('newsContent').innerHTML = newsHtml;
                } else {
                    throw new Error('API返回数据格式错误');
                }
            } catch (error) {
                console.error('Error parsing news:', error);
                document.getElementById('newsContent').innerHTML = '获取新闻失败，请稍后重试';
            }
        },
        onerror: function(error) {
            console.error('Error fetching news:', error);
            document.getElementById('newsContent').innerHTML = '获取新闻失败，请稍后重试';
        }
    });
}
})();