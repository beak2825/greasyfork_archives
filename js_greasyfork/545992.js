// ==UserScript==
// @name         HHCLUB-收件箱批量已读处理
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动加载所有未读消息并标记为已读
// @author       You
// @match        https://hhanclub.top/messages.php*
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/545992/HHCLUB-%E6%94%B6%E4%BB%B6%E7%AE%B1%E6%89%B9%E9%87%8F%E5%B7%B2%E8%AF%BB%E5%A4%84%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/545992/HHCLUB-%E6%94%B6%E4%BB%B6%E7%AE%B1%E6%89%B9%E9%87%8F%E5%B7%B2%E8%AF%BB%E5%A4%84%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isProcessing = false;
    let shouldStop = false;
    const STORAGE_KEY = 'autoReadState';

    // 状态管理
    function saveState(data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({...data, time: Date.now()}));
    }

    function getSavedState() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const data = JSON.parse(saved);
            return (Date.now() - data.time < 300000) ? data : null;
        }
        return null;
    }

    function clearState() {
        localStorage.removeItem(STORAGE_KEY);
    }

    // 创建控制面板
    function createPanel() {
        const existing = document.getElementById('msgPanel');
        if (existing) existing.remove();

        const panel = document.createElement('div');
        panel.id = 'msgPanel';
        panel.innerHTML = `
            <div id="header" style="cursor:move;font-weight:bold;text-align:center;margin-bottom:10px;padding-bottom:8px;border-bottom:1px solid rgba(255,255,255,0.3)">📬 消息处理助手</div>
            <div id="count" style="margin-bottom:10px;padding:8px;background:rgba(255,255,255,0.2);border-radius:5px;text-align:center">检测中...</div>
            <div id="status" style="margin-bottom:10px;padding:6px;background:rgba(0,0,0,0.2);border-radius:5px;font-size:12px">点击开始处理</div>
            <div id="progress" style="display:none;margin-bottom:10px">
                <div id="progressText" style="font-size:11px;margin-bottom:3px">准备中...</div>
                <div style="background:rgba(255,255,255,0.3);height:6px;border-radius:3px;margin:5px 0">
                    <div id="progressBar" style="background:#4CAF50;height:100%;width:0%;border-radius:3px;transition:width 0.3s"></div>
                </div>
            </div>
            <div style="display:flex;gap:8px;margin-top:10px">
                <button id="startBtn" style="background:#4CAF50;color:white;border:none;padding:8px 12px;border-radius:5px;cursor:pointer;flex:1;font-size:12px">🚀 开始</button>
                <button id="stopBtn" style="display:none;background:#f44336;color:white;border:none;padding:8px 12px;border-radius:5px;cursor:pointer;flex:1;font-size:12px">⏹️ 停止</button>
            </div>
        `;

        panel.style.cssText = `
            position: fixed !important;
            top: 50% !important;
            right: 20px !important;
            transform: translateY(-50%) !important;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
            color: white !important;
            padding: 15px !important;
            border-radius: 10px !important;
            font-size: 13px !important;
            width: 250px !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.5) !important;
            z-index: 999999 !important;
            font-family: Arial, sans-serif !important;
            border: 2px solid rgba(255,255,255,0.3) !important;
        `;

        document.body.appendChild(panel);
        setTimeout(() => makeDraggable(panel), 100);
        return panel;
    }

    // 拖拽功能
    function makeDraggable(el) {
        let pos1=0,pos2=0,pos3=0,pos4=0;
        const header = document.getElementById('header');
        if (header) {
            header.onmousedown = (e) => {
                e.preventDefault();
                pos3 = e.clientX; pos4 = e.clientY;
                document.onmouseup = () => { document.onmouseup = document.onmousemove = null; };
                document.onmousemove = (e) => {
                    pos1 = pos3 - e.clientX; pos2 = pos4 - e.clientY; pos3 = e.clientX; pos4 = e.clientY;
                    el.style.top = Math.max(0, Math.min(window.innerHeight-el.offsetHeight, el.offsetTop-pos2)) + "px";
                    el.style.left = Math.max(0, Math.min(window.innerWidth-el.offsetWidth, el.offsetLeft-pos1)) + "px";
                    el.style.right = 'auto'; el.style.transform = 'none';
                };
            };
        }
    }

    // 更新显示函数
    function updateStatus(msg) {
        const statusEl = document.getElementById('status');
        if (statusEl) statusEl.textContent = msg;
        console.log(`[消息处理] ${msg}`);
    }

    function updateCount() {
        const el = document.querySelector('div[style="margin:auto auto;"]');
        const count = el ? parseInt(el.textContent) || 0 : 0;
        const countEl = document.getElementById('count');
        if (countEl) countEl.innerHTML = `📩 未读：<b>${count}</b> 条`;
        return count;
    }

    function updateProgress(current, total, text) {
        const container = document.getElementById('progress');
        const bar = document.getElementById('progressBar');
        const textEl = document.getElementById('progressText');

        if (container && bar && textEl) {
            if (total > 0) {
                container.style.display = 'block';
                textEl.textContent = text;
                bar.style.width = (current/total*100) + '%';
            } else {
                container.style.display = 'none';
            }
        }
    }

    // 点击未读短讯
    async function clickUnreadMessages() {
        const labels = document.querySelectorAll('label');
        for (let label of labels) {
            if (label.textContent.includes('未读短讯')) {
                updateStatus('点击未读短讯...');
                label.click();
                return true;
            }
        }
        return false;
    }

    // 点击加载更多
    async function clickLoadMore() {
        if (shouldStop) return false;

        const btn = document.querySelector('button[onclick="loadMail()"]');
        if (btn && !btn.disabled) {
            updateStatus('点击加载更多...');
            btn.click();

            return new Promise(resolve => {
                const check = setInterval(() => {
                    if (shouldStop) {
                        clearInterval(check);
                        resolve(false);
                        return;
                    }

                    const loading = document.getElementById('mail-loading');
                    if (!loading || loading.style.display === 'none') {
                        clearInterval(check);
                        setTimeout(() => resolve(true), 300);
                    }
                }, 100);
            });
        }
        return false;
    }

    // 正确的全选功能
    async function clickSelectAll() {
        if (shouldStop) return false;

        updateStatus('正在查找全选按钮...');

        // 根据提供的元素信息查找全选按钮
        const selectAllBtn = document.querySelector('input[type="button"][value="全选"][onclick*="check(form"]');

        if (!selectAllBtn) {
            updateStatus('❌ 未找到全选按钮');
            return false;
        }

        console.log('找到全选按钮:', selectAllBtn);
        updateStatus('找到全选按钮，当前文字: ' + selectAllBtn.value);

        // 检查按钮当前状态
        if (selectAllBtn.value === '全选') {
            updateStatus('点击全选按钮...');
            selectAllBtn.click();

            // 等待按钮状态改变
            await new Promise(resolve => setTimeout(resolve, 1000));

            // 检查按钮文字是否变成了"全不选"
            if (selectAllBtn.value === '全不选') {
                updateStatus('✅ 全选成功！按钮已变为: ' + selectAllBtn.value);
                return true;
            } else {
                updateStatus('❌ 全选可能失败，按钮文字仍为: ' + selectAllBtn.value);
                // 再次尝试点击
                selectAllBtn.click();
                await new Promise(resolve => setTimeout(resolve, 1000));

                if (selectAllBtn.value === '全不选') {
                    updateStatus('✅ 第二次尝试全选成功！');
                    return true;
                } else {
                    updateStatus('❌ 全选失败，按钮文字: ' + selectAllBtn.value);
                    return false;
                }
            }
        } else if (selectAllBtn.value === '全不选') {
            updateStatus('✅ 已经是全选状态 (按钮显示: 全不选)');
            return true;
        } else {
            updateStatus('❌ 未知的按钮状态: ' + selectAllBtn.value);
            return false;
        }
    }

    // 等待并显示倒计时
    async function waitWithCountdown(seconds, message) {
        for (let i = seconds; i > 0; i--) {
            if (shouldStop) return false;
            updateStatus(`${message} (${i}秒)`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        return true;
    }

    // 继续处理
    async function continueProcess(count) {
        const clickTimes = Math.ceil(count / 10);
        updateStatus(`开始处理 ${count} 条消息，需加载 ${clickTimes} 次`);

        // 加载更多消息
        for (let i = 0; i < clickTimes; i++) {
            if (shouldStop) return;
            updateProgress(i + 1, clickTimes + 2, `加载 ${i+1}/${clickTimes}`);
            const success = await clickLoadMore();
            if (!success) break;
        }

        if (shouldStop) return;

        // 等待页面稳定
        updateStatus('等待页面稳定...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        // 全选消息 - 使用正确的全选逻辑
        updateProgress(clickTimes + 1, clickTimes + 2, '全选消息');
        const selectAllSuccess = await clickSelectAll();

        if (!selectAllSuccess) {
            updateStatus('❌ 全选失败，无法继续');
            return;
        }

        // 等待3秒确保全选完全生效
        if (shouldStop) return;
        if (!(await waitWithCountdown(3, '等待全选完全生效'))) return;

        // 设为已读
        updateProgress(clickTimes + 2, clickTimes + 2, '标记已读');
        const markReadBtn = document.querySelector('input[name="markread"][value="设为已读"]');
        if (markReadBtn) {
            updateStatus('点击设为已读...');
            markReadBtn.click();
            await new Promise(resolve => setTimeout(resolve, 1000));

            clearState();
            updateStatus('✅ 处理完成！');
            setTimeout(updateCount, 2000);
        } else {
            updateStatus('❌ 未找到设为已读按钮');
        }
    }

    // 主处理函数
    async function processMessages() {
        if (isProcessing) return;
        isProcessing = true;
        shouldStop = false;

        const startBtn = document.getElementById('startBtn');
        const stopBtn = document.getElementById('stopBtn');
        if (startBtn) startBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'block';

        try {
            const count = updateCount();
            if (count === 0) {
                updateStatus('✅ 没有未读消息');
                return;
            }

            saveState({phase: 'afterUnread', count});
            updateProgress(1, 4, '点击未读短讯');

            if (await clickUnreadMessages()) {
                updateStatus('页面刷新中...');
                return;
            }

            await continueProcess(count);

        } catch(e) {
            updateStatus('❌ 错误: ' + e.message);
            console.error('处理错误:', e);
        } finally {
            resetUI();
        }
    }

    function stopProcess() {
        shouldStop = true;
        clearState();
        updateStatus('❌ 用户停止操作');
        resetUI();
    }

    function resetUI() {
        isProcessing = false;
        shouldStop = false;
        setTimeout(() => {
            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            if (startBtn) startBtn.style.display = 'block';
            if (stopBtn) stopBtn.style.display = 'none';
            updateProgress(0, 0, '');
        }, 2000);
    }

    // 初始化
    function init() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', init);
            return;
        }

        createPanel();

        const saved = getSavedState();
        if (saved && saved.phase === 'afterUnread') {
            isProcessing = true;
            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            if (startBtn) startBtn.style.display = 'none';
            if (stopBtn) stopBtn.style.display = 'block';
            updateStatus('🔄 页面刷新后继续处理...');
            setTimeout(() => continueProcess(saved.count), 2000);
        }

        setTimeout(() => {
            const startBtn = document.getElementById('startBtn');
            const stopBtn = document.getElementById('stopBtn');
            if (startBtn) startBtn.onclick = processMessages;
            if (stopBtn) stopBtn.onclick = stopProcess;
            updateCount();
            updateStatus('🎯 准备就绪');
        }, 100);
    }

    init();
})();
