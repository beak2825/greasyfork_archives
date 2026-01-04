// ==UserScript==
// @name         Alice 抽奖脚本
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Alice 抽奖脚本，API直连高速抽奖，并新增“一键全梭哈”功能。
// @author       Gemini
// @match        *://*/lottery/pool*
// @grant        GM_addStyle
// @run-at       document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/541793/Alice%20%E6%8A%BD%E5%A5%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/541793/Alice%20%E6%8A%BD%E5%A5%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ================= 全局常量与状态变量 =================
    const COST_PER_DRAW = 20; // 单次抽奖成本
    let isAutoDrawing = false; // 脚本是否正在执行
    let targetDraws = 0;       // 目标抽奖次数
    let drawCount = 0;         // 当前已抽奖次数
    let successfulDraws = 0;   // 成功抽奖次数
    let failedDraws = 0;       // 失败抽奖次数

    // ================= 核心抽奖逻辑 (API直连) =================

    async function apiCall(url) {
        try {
            const response = await fetch(url, {
                headers: { 'X-Requested-With': 'XMLHttpRequest' },
            });
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            return { code: -1, message: error.message };
        }
    }

    async function performApiDraw(poolId) {
        const apiUrl = `/api/lottery/lot?action=draw&pool_id=${poolId}`;
        const response = await apiCall(apiUrl);
        drawCount++;

        if (response && (response.code === 1 || response.code === '1')) {
            successfulDraws++;
            const prizeInfo = response.data.is_winner ? `🎉 抽中: ${response.data.prize.name}` : '... 未中奖';
            console.log(`第 ${drawCount}/${targetDraws} 次尝试成功。${prizeInfo}`);
            updateStatus(`高速抽奖中... [成功: ${successfulDraws} / 失败: ${failedDraws}] (${drawCount}/${targetDraws})`);
            return true;
        } else {
            failedDraws++;
            const errorMessage = response.message || '未知错误';
            console.error(`第 ${drawCount}/${targetDraws} 次尝试失败: ${errorMessage}`);
            updateStatus(`高速抽奖中... [成功: ${successfulDraws} / 失败: ${failedDraws}] (${drawCount}/${targetDraws})`);
            if (errorMessage.includes('point') || errorMessage.includes('积分')) {
                return false;
            }
            return true;
        }
    }

    // ================= 控制函数 =================
    async function startAutoDraw() {
        if (isAutoDrawing) return;

        const limitInput = document.getElementById('custom-draw-input');
        const delayInput = document.getElementById('request-delay-input');
        targetDraws = parseInt(limitInput.value, 10);
        const delay = parseInt(delayInput.value, 10);

        if (isNaN(targetDraws) || targetDraws <= 0) {
            updateStatus('错误：请输入有效的抽奖次数！');
            return;
        }
        if (isNaN(delay) || delay < 100) {
            updateStatus('错误：延迟需大于等于100ms！');
            return;
        }

        const availableDrawButton = document.querySelector('.draw-button:not(:disabled)');
        if (!availableDrawButton) {
            updateStatus('错误：找不到可抽奖的奖池！');
            return;
        }
        const onclickAttr = availableDrawButton.getAttribute('onclick');
        const poolIdMatch = onclickAttr.match(/drawLottery\((\d+)\)/);
        if (!poolIdMatch || !poolIdMatch[1]) {
            updateStatus('错误：无法解析抽奖池ID！');
            return;
        }
        const poolId = poolIdMatch[1];
        console.log(`锁定抽奖池ID: ${poolId}`);

        isAutoDrawing = true;
        drawCount = 0;
        successfulDraws = 0;
        failedDraws = 0;
        toggleControls(true);
        updateStatus(`任务开始，目标: ${targetDraws}次，延迟: ${delay}ms`);
        console.log(`自动抽奖任务开始，目标次数: ${targetDraws}, 请求延迟: ${delay}ms`);

        for (let i = 0; i < targetDraws; i++) {
            if (!isAutoDrawing) {
                console.log('任务被手动停止。');
                break;
            }
            const continueTask = await performApiDraw(poolId);
            if (!continueTask) {
                console.log('检测到严重错误（可能积分不足），任务提前终止。');
                break;
            }
            await new Promise(resolve => setTimeout(resolve, delay));
        }

        console.log('抽奖任务执行完毕。');
        stopAutoDraw(true);
    }

    function stopAutoDraw(autoFinished = false) {
        isAutoDrawing = false;
        toggleControls(false);

        if (autoFinished) {
            updateStatus(`任务完成！[成功: ${successfulDraws} / 失败: ${failedDraws}] 总计: ${drawCount}次。正在刷新积分...`);
        } else {
            updateStatus(`任务已手动停止于第 ${drawCount} 次。正在刷新积分...`);
        }
        console.log('正在刷新页面积分和记录...');
        if (typeof loadUserInfo === 'function') loadUserInfo();
        if (typeof loadRecords === 'function') loadRecords();
    }

    function toggleControls(isDrawing) {
        document.getElementById('custom-draw-input').disabled = isDrawing;
        document.getElementById('request-delay-input').disabled = isDrawing;
        document.getElementById('start-draw').disabled = isDrawing;
        document.getElementById('stop-draw').disabled = !isDrawing;
        document.getElementById('draw-all-btn').disabled = isDrawing; // [新增] 禁用全梭哈按钮
    }

    /**
     * [新增] 计算并显示最大可抽奖次数
     * @returns {number} - 返回计算出的最大次数
     */
    function calculateAndDisplayMaxDraws() {
        const maxDrawsInfoEl = document.getElementById('max-draws-info');
        const pointsEl = document.getElementById('user-points');
        if (!pointsEl) {
            maxDrawsInfoEl.textContent = '无法找到您的积分信息。';
            return 0;
        }

        const pointsText = pointsEl.textContent.replace(/,/g, ''); // 移除逗号
        const currentPoints = parseInt(pointsText, 10);

        if (isNaN(currentPoints)) {
            maxDrawsInfoEl.textContent = '无法解析您的积分数值。';
            return 0;
        }

        const maxDraws = Math.floor(currentPoints / COST_PER_DRAW);
        maxDrawsInfoEl.textContent = `根据您当前的 ${currentPoints.toLocaleString()} 积分，最多可抽奖 ${maxDraws} 次。`;
        return maxDraws;
    }

    /**
     * [新增] 处理“一键全梭哈”按钮点击事件
     */
    function handleDrawAll() {
        const maxDraws = calculateAndDisplayMaxDraws();
        if (maxDraws > 0) {
            document.getElementById('custom-draw-input').value = maxDraws;
            document.getElementById('start-draw').click();
        } else {
            updateStatus('积分不足，无法执行“一键全梭哈”。');
        }
    }


    // ================= UI 创建和注入 (版本 4.1) =================
    function setupUI() {
        const container = document.createElement('div');
        container.id = 'auto-draw-controller';
        container.innerHTML = `
            <div class="controller-title">抽奖控制器 v4.1 (高速版)</div>
            <div class="input-grid">
                <div class="input-item">
                    <label for="custom-draw-input">抽奖次数</label>
                    <input type="number" id="custom-draw-input" class="controller-input" placeholder="例如: 100" min="1">
                </div>
                <div class="input-item">
                    <label for="request-delay-input">请求延迟(ms)</label>
                    <input type="number" id="request-delay-input" class="controller-input" value="300" min="100">
                </div>
            </div>
            <div class="max-draws-info" id="max-draws-info">正在计算最大可抽奖次数...</div>
            <div class="button-group">
                <button id="draw-all-btn" class="controller-btn all-in">💰 一键全梭哈</button>
                <button id="start-draw" class="controller-btn start">🚀 开始抽奖</button>
                <button id="stop-draw" class="controller-btn stop" disabled>🛑 停止</button>
            </div>
            <div id="controller-status" class="controller-status">待命中...</div>
        `;

        const targetElement = document.querySelector('.points-card');
        if (targetElement) {
            targetElement.insertAdjacentElement('afterend', container);
            document.getElementById('start-draw').addEventListener('click', startAutoDraw);
            document.getElementById('stop-draw').addEventListener('click', () => stopAutoDraw(false));
            document.getElementById('draw-all-btn').addEventListener('click', handleDrawAll); // [新增] 绑定事件

            calculateAndDisplayMaxDraws(); // [新增] 页面加载后立即计算并显示
        }
    }

    function updateStatus(message) {
        const statusEl = document.getElementById('controller-status');
        if (statusEl) {
            statusEl.textContent = message;
        }
    }

    // 添加一些CSS样式 (版本 4.1)
    GM_addStyle(`
        #auto-draw-controller { background-color: #f8f9fa; border: 1px solid #dee2e6; border-radius: 16px; padding: 20px; margin-bottom: 24px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif; }
        .controller-title { font-size: 1.2rem; font-weight: 700; color: #0d47a1; margin-bottom: 16px; text-align: center; }
        .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 10px; }
        .input-item { display: flex; flex-direction: column; }
        .input-item label { color: #546e7a; font-size: 0.8rem; font-weight: 600; margin-bottom: 5px; }
        .controller-input { border: 1px solid #ced4da; padding: 10px 14px; border-radius: 10px; font-size: 1rem; text-align: center; width: 100%; transition: border-color 0.2s ease-in-out, box-shadow 0.2s ease-in-out; }
        .controller-input:focus { border-color: #1e88e5; outline: none; box-shadow: 0 0 0 3px rgba(30, 136, 229, 0.25); }
        .max-draws-info { text-align: center; font-size: 0.85rem; color: #1976d2; margin-bottom: 16px; padding: 8px; background-color: #e3f2fd; border-radius: 8px; }
        .button-group { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .controller-btn { border: none; padding: 12px; border-radius: 12px; font-size: 0.9rem; font-weight: 700; cursor: pointer; transition: all 0.2s ease-in-out; }
        .controller-btn.start { background: linear-gradient(135deg, #28a745 0%, #218838 100%); color: white; }
        .controller-btn.all-in { background: linear-gradient(135deg, #ffc107 0%, #ffa000 100%); color: #212529; }
        .controller-btn.stop { background: linear-gradient(135deg, #d32f2f 0%, #f44336 100%); color: white; }
        .controller-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
        .controller-btn:disabled, .controller-input:disabled { background: #e0e0e0; color: #9e9e9e; cursor: not-allowed; transform: none; box-shadow: none; opacity: 0.7; }
        .controller-status { text-align: center; margin-top: 16px; font-size: 0.95rem; color: #546e7a; font-weight: 500; background: #e3f2fd; padding: 8px; border-radius: 8px; }
    `);

    window.addEventListener('load', setupUI);

})();