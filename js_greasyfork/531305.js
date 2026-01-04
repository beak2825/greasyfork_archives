// ==UserScript==
// @name         X 推文搜索器
// @namespace    http://tampermonkey.net/
// @version      4
// @description  支持悬浮球、自动滚动、关键词搜索。优化书签提取逻辑，默认滚动速度更快。
// @author       喂你吃药
// @match        https://x.com/*
// @match        https://twitter.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/531305/X%20%E6%8E%A8%E6%96%87%E6%90%9C%E7%B4%A2%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531305/X%20%E6%8E%A8%E6%96%87%E6%90%9C%E7%B4%A2%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // --- 核心配置 ---
    // 修改点1：默认滚动像素调整为 3000
    let scrollStep = 3000;

    let stopRequested = false;
    let processedTweets = new Set();

    // ---------------------------------------------------------
    // 🕵️‍♂️ 第一部分：特工逻辑 (只在书签页触发)
    // ---------------------------------------------------------
    if (window.location.href.includes('ts_action=sync_bookmarks')) {

        // 创建遮罩
        const mask = document.createElement('div');
        mask.style = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#000;color:#00ba7c;display:flex;flex-direction:column;align-items:center;justify-content:center;z-index:99999;font-size:20px;font-weight:bold;font-family:sans-serif;';
        mask.innerHTML = '<div>🔄 正在提取最新书签关键词...</div><div style="font-size:14px;color:#666;margin-top:10px;">(提取到纯文本后将自动关闭)</div>';
        document.body.appendChild(mask);

        const checkTimer = setInterval(() => {
            const tweetTextNode = document.querySelector('[data-testid="tweetText"]');
            if (tweetTextNode) {
                clearInterval(checkTimer);

                let rawText = tweetTextNode.innerText;

                // 修改点2：纯净提取逻辑
                // 正则说明：以换行(\n)、标点(\p{P})、符号(\p{S})为界进行分割，只取第一部分
                // \p{P} 包含逗号、句号、引号等所有标点
                // \p{S} 包含Emoji、货币符号、数学符号等
                let cleanText = rawText.split(/[\n\r\p{P}\p{S}]/u)[0].trim();

                // 如果第一句实在太短（比如只有一个字），为了防止误判，稍微放宽一点点（可选，目前严格按你要求执行）
                if (cleanText.length === 0) {
                     // 如果第一位就是符号，split后可能为空，尝试直接取前10个字符保底
                     cleanText = rawText.replace(/[\n\r]/g, '').slice(0, 15);
                }

                // 截取适度长度，防止过长
                cleanText = cleanText.slice(0, 40);

                // 发送数据
                localStorage.setItem('ts_sync_result', JSON.stringify({
                    text: cleanText,
                    timestamp: new Date().getTime()
                }));

                mask.innerHTML = `<div style="color:#fff">✅ 提取成功：</div><div style="color:#1d9bf0;margin:10px 0;">"${cleanText}"</div><div>正在关闭...</div>`;

                setTimeout(() => {
                    window.close();
                }, 500); // 稍微展示一下提取结果再关闭
            }
        }, 500);

        setTimeout(() => {
            mask.innerText = '❌ 超时未找到推文，请检查网络。';
        }, 10000);

        return;
    }

    // ---------------------------------------------------------
    // 🎮 第二部分：主界面逻辑
    // ---------------------------------------------------------

    // --- 样式表 ---
    const styles = `
        #ts-floater { position: fixed; z-index: 9999; font-family: -apple-system, BlinkMacSystemFont, sans-serif; user-select: none; }
        .ts-mini-ball {
            width: 40px; height: 40px; background: rgba(29, 155, 240, 0.6);
            border-radius: 50%; box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: pointer;
            display: flex; align-items: center; justify-content: center; color: white; font-size: 20px;
            backdrop-filter: blur(4px); transition: transform 0.2s, background 0.3s;
        }
        .ts-mini-ball:hover { background: rgba(29, 155, 240, 1); transform: scale(1.1); }
        .ts-panel {
            width: 320px; background: rgba(0, 0, 0, 0.85); backdrop-filter: blur(10px);
            border: 1px solid #333; border-radius: 16px; padding: 16px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.5); color: #fff; display: none; flex-direction: column; gap: 12px;
        }
        .ts-header { display: flex; justify-content: space-between; align-items: center; cursor: move; border-bottom: 1px solid #333; padding-bottom: 8px; }
        .ts-title { font-weight: 700; font-size: 14px; color: #eff3f4; }
        .ts-btn-icon { background: none; border: none; color: #71767b; cursor: pointer; font-size: 16px; }
        input.ts-input { background: #202327; border: 1px solid #333; color: #eff3f4; padding: 8px 12px; border-radius: 20px; outline: none; width: 100%; box-sizing: border-box; }
        input.ts-input:focus { border-color: #1d9bf0; }
        .ts-row { display: flex; gap: 10px; align-items: center; }
        .ts-btn { flex: 1; padding: 8px; border-radius: 20px; border: none; font-weight: bold; cursor: pointer; font-size: 13px; transition: opacity 0.2s; }
        .ts-btn-primary { background: #1d9bf0; color: white; }
        .ts-btn-success { background: #00ba7c; color: white; }
        .ts-btn-danger { background: #f4212e; color: white; }
        .ts-btn:disabled { background: #555; cursor: not-allowed; }
        .ts-status { font-size: 12px; color: #71767b; text-align: center; min-height: 1.2em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .ts-highlight { border: 2px solid #1d9bf0 !important; background: rgba(29, 155, 240, 0.1) !important; box-shadow: 0 0 15px rgba(29, 155, 240, 0.3); transition: all 0.5s; }
    `;

    const styleEl = document.createElement('style');
    styleEl.innerHTML = styles;
    document.head.appendChild(styleEl);

    function createUI() {
        const container = document.createElement('div');
        container.id = 'ts-floater';
        const savedPos = JSON.parse(localStorage.getItem('ts_pos') || '{"top":"100px","left":"20px"}');
        container.style.top = savedPos.top;
        container.style.left = savedPos.left;

        container.innerHTML = `
            <div class="ts-mini-ball" id="ts-ball" title="点击展开">🔍</div>
            <div class="ts-panel" id="ts-panel">
                <div class="ts-header" id="ts-header">
                    <span class="ts-title">X 进度同步器 (V5.1)</span>
                    <button class="ts-btn-icon" id="ts-minimize">_</button>
                </div>

                <input type="text" class="ts-input" id="ts-keyword" placeholder="输入关键词或等待同步...">

                <button class="ts-btn ts-btn-success" id="ts-sync-btn" style="width: 100%;">
                    📥 获取最新书签
                </button>

                <div class="ts-row">
                    <input type="number" class="ts-input" id="ts-speed" value="${scrollStep}" style="width: 80px;" placeholder="速度">
                    <button class="ts-btn ts-btn-primary" id="ts-start">开始搜索</button>
                    <button class="ts-btn ts-btn-danger" id="ts-stop" disabled>停止</button>
                </div>

                <div class="ts-status" id="ts-status">准备就绪</div>
            </div>
        `;

        document.body.appendChild(container);

        const ball = document.getElementById('ts-ball');
        const panel = document.getElementById('ts-panel');
        const minimizeBtn = document.getElementById('ts-minimize');
        const startBtn = document.getElementById('ts-start');
        const stopBtn = document.getElementById('ts-stop');
        const syncBtn = document.getElementById('ts-sync-btn');
        const statusText = document.getElementById('ts-status');
        const keywordInput = document.getElementById('ts-keyword');
        const speedInput = document.getElementById('ts-speed');
        const header = document.getElementById('ts-header');

        function toggleMode(showPanel) {
            panel.style.display = showPanel ? 'flex' : 'none';
            ball.style.display = showPanel ? 'none' : 'flex';
        }
        ball.addEventListener('click', () => toggleMode(true));
        minimizeBtn.addEventListener('click', () => toggleMode(false));

        let isDragging = false, startX, startY, initialLeft, initialTop;
        function startDrag(e) {
            if (['INPUT', 'BUTTON'].includes(e.target.tagName)) return;
            isDragging = true; startX = e.clientX; startY = e.clientY;
            const rect = container.getBoundingClientRect();
            initialLeft = rect.left; initialTop = rect.top;
            container.style.opacity = '0.8';
        }
        function onDrag(e) {
            if (!isDragging) return;
            e.preventDefault();
            container.style.left = (initialLeft + e.clientX - startX) + 'px';
            container.style.top = (initialTop + e.clientY - startY) + 'px';
        }
        function stopDrag() {
            if (isDragging) {
                isDragging = false; container.style.opacity = '1';
                localStorage.setItem('ts_pos', JSON.stringify({top: container.style.top, left: container.style.left}));
            }
        }
        ball.addEventListener('mousedown', startDrag);
        header.addEventListener('mousedown', startDrag);
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);

        // 监听同步结果
        window.addEventListener('storage', (e) => {
            if (e.key === 'ts_sync_result') {
                try {
                    const data = JSON.parse(e.newValue);
                    if (new Date().getTime() - data.timestamp < 5000) {
                        keywordInput.value = data.text;
                        statusText.textContent = "✅ 同步成功: " + data.text;
                        keywordInput.style.borderColor = '#00ba7c';
                        setTimeout(() => keywordInput.style.borderColor = '#333', 1500);
                    }
                } catch (err) {}
            }
        });

        syncBtn.addEventListener('click', () => {
            statusText.textContent = "正在提取...";
            window.open('https://x.com/i/bookmarks?ts_action=sync_bookmarks', '_blank');
        });

        const delay = ms => new Promise(r => setTimeout(r, ms));

        startBtn.addEventListener('click', () => {
            const keyword = keywordInput.value.trim();
            scrollStep = parseInt(speedInput.value) || 3000; // 允许面板动态修改

            if (!keyword) { statusText.textContent = "关键词为空"; return; }

            stopRequested = false; processedTweets.clear();
            statusText.textContent = `搜索中...`;
            startBtn.disabled = true; stopBtn.disabled = false;

            startScrolling(keyword);
        });

        stopBtn.addEventListener('click', () => {
            stopRequested = true; statusText.textContent = "已停止";
            startBtn.disabled = false; stopBtn.disabled = true;
        });

        async function startScrolling(keyword) {
            let sameHeightCount = 0;
            let lastHeight = 0;

            while (!stopRequested) {
                const tweets = document.querySelectorAll('[data-testid="tweet"]');
                let found = false;

                for (let tweet of tweets) {
                    const textBlock = tweet.querySelector('[data-testid="tweetText"]');
                    const tweetText = textBlock ? textBlock.innerText : '';
                    const id = tweetText.slice(0, 50);

                    if (processedTweets.has(id)) continue;
                    processedTweets.add(id);

                    if (tweetText.includes(keyword)) {
                        found = true;
                        tweet.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        tweet.classList.add('ts-highlight');
                        stopRequested = true;
                        statusText.textContent = "🎉 找到位置！";
                        startBtn.disabled = false; stopBtn.disabled = true;
                        return;
                    }
                }

                if (!found) {
                    window.scrollBy({ top: scrollStep, behavior: 'smooth' });
                    await delay(800);

                    let newHeight = document.body.scrollHeight;
                    if (newHeight === lastHeight) {
                        sameHeightCount++;
                        if (sameHeightCount > 8) { // 增加容错次数
                            statusText.textContent = "到底了或未找到";
                            stopRequested = true;
                            startBtn.disabled = false; stopBtn.disabled = true;
                        }
                    } else {
                        sameHeightCount = 0;
                        lastHeight = newHeight;
                    }
                }
            }
        }
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', createUI);
    else createUI();

})();