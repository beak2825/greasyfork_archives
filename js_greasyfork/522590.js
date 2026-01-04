// ==UserScript==
// @name         期刊论文查询助手
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  集成期刊查询和论文跳转功能的助手
// @author       Your name
// @match        *://*/*
// @match        https://www.ablesci.com/assist/create
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/522590/%E6%9C%9F%E5%88%8A%E8%AE%BA%E6%96%87%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/522590/%E6%9C%9F%E5%88%8A%E8%AE%BA%E6%96%87%E6%9F%A5%E8%AF%A2%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加样式
    GM_addStyle(`
        #paper-helper-ball {
            position: fixed;
            right: 20px;
            bottom: 20px;
            width: 50px;
            height: 50px;
            background: #4CAF50;
            border-radius: 50%;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            z-index: 10000;
            transition: transform 0.3s;
        }
        #paper-helper-ball:hover {
            transform: scale(1.1);
        }
        #paper-helper-modal {
            display: none;
            position: fixed;
            right: 80px;
            bottom: 80px;
            width: 300px;
            background: white;
            border-radius: 8px;
            padding: 15px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            z-index: 10000;
        }
        .tab-buttons {
            display: flex;
            margin-bottom: 10px;
            gap: 5px;
        }
        .tab-button {
            flex: 1;
            padding: 8px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            background: #f0f0f0;
        }
        .tab-button.active {
            background: #4CAF50;
            color: white;
        }
        .tab-content {
            display: none;
        }
        .tab-content.active {
            display: block;
        }
        #paper-helper-modal input {
            width: 100%;
            padding: 8px;
            margin-bottom: 10px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        #paper-helper-modal button {
            background: #4CAF50;
            color: white;
            border: none;
            padding: 8px 15px;
            border-radius: 4px;
            cursor: pointer;
            width: 100%;
        }
        #paper-helper-modal button:hover {
            background: #45a049;
        }
        #query-results {
            margin-top: 10px;
            padding: 10px;
            background: #f5f5f5;
            border-radius: 4px;
            display: none;
        }
        .loading {
            text-align: center;
            margin: 10px 0;
            display: none;
        }
        .error-message {
            color: red;
            margin-top: 10px;
            display: none;
        }
    `);

    // 检查当前是否在目标网站
    const isTargetSite = window.location.href.includes('ablesci.com/assist/create');

    if (isTargetSite) {
        // 在目标网站自动填充
        const paperTitle = GM_getValue('paperTitle', '');
        if (paperTitle) {
            // 等待页面加载完成
            window.addEventListener('load', () => {
                setTimeout(() => {
                    const input = document.getElementById('onekey');
                    if (input) {
                        input.value = paperTitle;
                        // 触发事件
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        input.dispatchEvent(new Event('change', { bubbles: true }));
                        // 清除存储的标题
                        GM_setValue('paperTitle', '');
                        // 点击搜索按钮
                        const searchButton = document.querySelector('.onekey-search');
                        if (searchButton) {
                            searchButton.click();
                        }
                    }
                }, 500); // 稍微延迟以确保元素已加载
            });
        }
    } else {
        // 在其他网站显示浮动球和模态框
        const ball = document.createElement('div');
        ball.id = 'paper-helper-ball';
        ball.innerHTML = '📚';
        document.body.appendChild(ball);

        const modal = document.createElement('div');
        modal.id = 'paper-helper-modal';
        modal.innerHTML = `
            <div class="tab-buttons">
                <button class="tab-button active" data-tab="journal">期刊查询</button>
                <button class="tab-button" data-tab="paper">论文跳转</button>
            </div>
            <div class="tab-content active" id="journal-tab">
                <input type="text" id="journal-name" placeholder="请输入期刊名称">
                <button id="query-button">查询期刊</button>
                <div class="loading">查询中...</div>
                <div class="error-message"></div>
                <div id="query-results"></div>
            </div>
            <div class="tab-content" id="paper-tab">
                <input type="text" id="paper-title" placeholder="请输入论文标题">
                <button id="search-button">跳转查询</button>
            </div>
        `;
        document.body.appendChild(modal);

        // 点击球显示/隐藏模态框
        let isModalVisible = false;
        ball.addEventListener('click', () => {
            isModalVisible = !isModalVisible;
            modal.style.display = isModalVisible ? 'block' : 'none';
        });

        // 标签切换功能
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                tabButtons.forEach(btn => btn.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
                button.classList.add('active');
                const tabId = button.getAttribute('data-tab') + '-tab';
                document.getElementById(tabId).classList.add('active');
            });
        });

        // 期刊查询函数
        async function queryJournalRank(journalName) {
            const apiKey = '69e5dfcf9f6b45b7947e6c8606ef4509';
            const baseUrl = 'https://www.easyscholar.cc/open/getPublicationRank';
            const encodedName = encodeURIComponent(journalName);
            const url = `${baseUrl}?secretKey=${apiKey}&publicationName={encodedName}`;

            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            if (data.code === 200) {
                                const officialRank = data.data.officialRank;
                                const rankData = officialRank.select || officialRank.all || {};
                                
                                const result = {};
                                const indicators = {
                                    "CCF\text{等级}": "ccf",
                                    "SCI\text{五年影响因子}": "sciif5",
                                    "SCI\text{分区}": "sci",
                                    "SCI\text{影响因子}": "sciif"
                                };

                                let foundAny = false;
                                for (const [displayName, key] of Object.entries(indicators)) {
                                    if (rankData[key]) {
                                        result[displayName] = rankData[key];
                                        foundAny = true;
                                    }
                                }

                                if (!foundAny) {
                                    reject('\text{未找到指定的期刊等级信息}');
                                } else {
                                    resolve(result);
                                }
                            } else {
                                reject(data.msg || '\text{查询失败}');
                            }
                        } catch (error) {
                            reject('\text{数据解析错误}');
                        }
                    },
                    onerror: function(error) {
                        reject('\text{网络请求失败}');
                    }
                });
            });
        }

        // \text{期刊查询按钮点击事件}
        document.getElementById('query-button').addEventListener('click', async () => {
            const journalName = document.getElementById('journal-name').value.trim();
            if (!journalName) {
                showError('\text{请输入期刊名称}');
                return;
            }

            const loading = document.querySelector('.loading');
            const results = document.getElementById('query-results');
            const errorMessage = document.querySelector('.error-message');

            loading.style.display = 'block';
            results.style.display = 'none';
            errorMessage.style.display = 'none';

            try {
                const data = await queryJournalRank(journalName);
                let resultHtml = '<h4>\text{查询结果}:</h4>';
                for (const [indicator, value] of Object.entries(data)) {
                    resultHtml += `<p><strong>{indicator}:</strong> ${value}</p>`;
                }
                results.innerHTML = resultHtml;
                results.style.display = 'block';
            } catch (error) {
                showError(error);
            } finally {
                loading.style.display = 'none';
            }
        });

        // 论文跳转按钮点击事件
        document.getElementById('search-button').addEventListener('click', () => {
            const paperTitle = document.getElementById('paper-title').value.trim();
            if (paperTitle) {
                // 保存标题到存储
                GM_setValue('paperTitle', paperTitle);
                // 打开新窗口
                window.open('https://www.ablesci.com/assist/create', '_blank');
            }
        });

        // 点击其他地方关闭模态框
        document.addEventListener('click', (event) => {
            if (isModalVisible && 
                !modal.contains(event.target) && 
                !ball.contains(event.target)) {
                isModalVisible = false;
                modal.style.display = 'none';
            }
        });
    }
})();

function showError(message) {
    const errorMessage = document.querySelector('.error-message');
    errorMessage.textContent = message;
    errorMessage.style.display = 'block';
}
