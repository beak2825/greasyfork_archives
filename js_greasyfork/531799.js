// ==UserScript==
// @name         小黑盒评论区抽奖
// @namespace    https://blog.nasakura.com/
// @version      1.1
// @icon         https://blog.nasakura.com/static/sakura.png
// @description  抓取评论区用户信息及评论内容，支持智能抽奖
// @author       月面着陸計画
// @match        https://www.xiaoheihe.cn/*
// @grant        GM_setClipboard
// @grant        GM_notification
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531799/%E5%B0%8F%E9%BB%91%E7%9B%92%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/531799/%E5%B0%8F%E9%BB%91%E7%9B%92%E8%AF%84%E8%AE%BA%E5%8C%BA%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建悬浮按钮样式
    const style = document.createElement('style');
    style.textContent = `
        #dataCaptureBtn {
            position: fixed;
            bottom: 20px;
            right: 20px;
            z-index: 9999;
            padding: 10px 20px;
            background: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            box-shadow: 0 2px 5px rgba(0,0,0,0.3);
        }
        #dataCaptureBtn:hover {
            background: #0056b3;
        }
        #resultWindow {
            position: fixed;
            bottom: 70px;
            right: 20px;
            width: 400px;
            height: 300px;
            background: white;
            border: 1px solid #ccc;
            padding: 10px;
            overflow: auto;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
            z-index: 9998;
        }
        .lottery-result-item {
            margin: 15px 0;
            padding: 10px;
            border: 1px solid #eee;
            border-radius: 4px;
        }
    `;
    document.head.appendChild(style);

    // 创建主按钮
    const mainButton = document.createElement('button');
    mainButton.id = 'dataCaptureBtn';
    mainButton.textContent = '抓取评论数据';
    document.body.appendChild(mainButton);

    // 数据抓取核心逻辑
    function captureComments() {
        const commentItems = document.querySelectorAll('.link-comment__comment-item');
        const userMap = new Map();

        commentItems.forEach(item => {
            try {
                const userLink = item.querySelector('.info-box__username');
                const content = item.querySelector('.comment-item__content');

                if (userLink && content) {
                    const profileUrl = userLink.href;
                    const commentText = content.innerText.trim();

                    if (userMap.has(profileUrl)) {
                        userMap.get(profileUrl).comments.push(commentText);
                    } else {
                        userMap.set(profileUrl, {
                            username: userLink.textContent.trim(),
                            profile: profileUrl,
                            comments: [commentText]
                        });
                    }
                }
            } catch (error) {
                console.error('数据解析错误:', error);
            }
        });

        return Array.from(userMap.values());
    }

    // 创建抽奖界面
    function createLotteryUI(users) {
        const container = document.createElement('div');
        container.style.marginTop = '20px';
        container.innerHTML = `
            <h4 style="margin-bottom: 15px; color: #2c3e50;">月面抽奖</h4>
            <div style="display: flex; gap: 10px; margin-bottom: 20px;">
                <input type="number"
                       id="lotteryCountInput"
                       placeholder="输入抽取人数"
                       min="1"
                       max="${users.length}"
                       style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                <button id="startLotteryBtn"
                        style="padding: 8px 20px; background: #27ae60; color: white;
                               border: none; border-radius: 4px; cursor: pointer;">
                    开始抽奖
                </button>
            </div>
            <div id="lotteryResultsContainer"></div>
        `;

        // 事件委托处理点击
        container.addEventListener('click', (event) => {
            const target = event.target;

            if (target.id === 'startLotteryBtn') {
                handleLotteryStart(users);
            }
            else if (target.id === 'copyResultsBtn') {
                handleCopyResults();
            }
        });

        return container;
    }

    // 处理抽奖逻辑
    function handleLotteryStart(users) {
        const input = document.getElementById('lotteryCountInput');
        const resultContainer = document.getElementById('lotteryResultsContainer');
        const count = parseInt(input.value);
        const maxCount = users.length;

        // 输入验证
        if (isNaN(count) || count < 1 || count > maxCount) {
            showAlert(`请输入1到${maxCount}之间的有效数字`);
            return;
        }

        // 执行公平抽奖
        const winners = getRandomWinners(users, count);
        displayWinners(winners);
    }

    // 随机选择算法（Fisher-Yates改进版）
    function getRandomWinners(users, count) {
        const shuffled = [...users];
        let currentIndex = shuffled.length;

        while (currentIndex > 0) {
            const randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex--;
            [shuffled[currentIndex], shuffled[randomIndex]] =
                [shuffled[randomIndex], shuffled[currentIndex]];
        }

        return shuffled.slice(0, count);
    }

    // 显示中奖结果
    function displayWinners(winners) {
        const container = document.getElementById('lotteryResultsContainer');
        container.innerHTML = '';

        let html = `
            <div style="background: #f8f9fa; padding: 15px; border-radius: 6px;">
                <h5 style="margin: 0 0 15px; color: #e74c3c;">
                    🎉 中奖用户（共 ${winners.length} 位）
                </h5>
        `;

        winners.forEach((user, index) => {
            html += `
                <div class="lottery-result-item">
                    <div style="color: #2980b9; margin-bottom: 8px;">
                        🏅 第 ${index + 1} 位中奖者
                    </div>
                    <div><strong>用户名：</strong>${user.username}</div>
                    <div><strong>资料链接：</strong>
                        <a href="${user.profile}" target="_blank" style="color: #3498db;">
                            ${user.profile}
                        </a>
                    </div>
                    <div style="margin-top: 10px;">
                        <details>
                            <summary style="color: #95a5a6; cursor: pointer;">
                                查看全部评论（${user.comments.length}条）
                            </summary>
                            <ul style="margin: 8px 0 0 20px; color: #7f8c8d;">
                                ${user.comments.map(c => `<li>${c}</li>`).join('')}
                            </ul>
                        </details>
                    </div>
                </div>
            `;
        });

        html += `
            <button id="copyResultsBtn"
                    style="margin-top: 15px; padding: 8px 20px; background: #3498db;
                           color: white; border: none; border-radius: 4px; cursor: pointer;">
                复制中奖结果
            </button>
            </div>
        `;

        container.innerHTML = html;
    }

    // 处理结果复制
    function handleCopyResults() {
        const winners = Array.from(document.querySelectorAll('.lottery-result-item'));
        const text = winners.map(item => {
            const username = item.querySelector('div:nth-child(2)').textContent.replace('用户名：', '');
            const profile = item.querySelector('a').href;
            const comments = Array.from(item.querySelectorAll('li')).map(li => li.textContent);

            return `中奖用户：${username}
资料链接：${profile}
评论数量：${comments.length}条
全部评论：
${comments.join('\n')}
-------------------------`;
        }).join('\n\n');

        GM_setClipboard(text, 'text').then(() => {
            showAlert('中奖结果已复制到剪贴板！');
        });
    }

    // 显示结果窗口
    function showResults(users) {
        // 移除旧窗口
        const existingWindow = document.getElementById('resultWindow');
        if (existingWindow) existingWindow.remove();

        // 创建新窗口
        const resultWindow = document.createElement('div');
        resultWindow.id = 'resultWindow';

        // 构建基础信息
        let html = `
            <h3 style="margin-top: 0; color: #34495e;">
                抓取结果（共 ${users.length} 位用户）
            </h3>
        `;

        users.forEach((user, index) => {
            html += `
                <div style="margin-bottom: 15px; padding-bottom: 10px; border-bottom: 1px solid #ecf0f1;">
                    <div style="color: #2c3e50; margin-bottom: 5px;">
                        #${index + 1} ${user.username}
                    </div>
                    <div style="font-size: 0.9em; color: #95a5a6;">
                        评论数量：${user.comments.length}条
                    </div>
                </div>
            `;
        });

        // 添加抽奖界面
        resultWindow.innerHTML = html;
        resultWindow.appendChild(createLotteryUI(users));
        document.body.appendChild(resultWindow);
    }

    // 通用提示功能
    function showAlert(message) {
        GM_notification({
            text: message,
            timeout: 2000,
            title: '系统提示'
        });
    }

    // 主按钮点击事件
    mainButton.addEventListener('click', () => {
        const users = captureComments();

        if (users.length > 0) {
            showResults(users);
            showAlert(`成功抓取 ${users.length} 位用户数据`);
        } else {
            showAlert('未找到评论数据，请确认页面加载完成');
        }
    });
})();