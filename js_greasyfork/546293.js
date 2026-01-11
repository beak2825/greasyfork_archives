// ==UserScript==
// @name         订单批量回调 + VIP计算工具 v3.2（by：测试组@Steven）
// @namespace    http://tampermonkey.net/
// @version      3.2
// @description  折叠面板、ShowID记忆、批量回调、VIP计算、删除订单/用户订单
// @author       Steven
// @match        https://mock.insicilis.com:18860/*
// @match        https://mock.nuvankerder.com:18860/*
// @match        https://mock-stg.nuvankerder.com:18860/*
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/546293/%E8%AE%A2%E5%8D%95%E6%89%B9%E9%87%8F%E5%9B%9E%E8%B0%83%20%2B%20VIP%E8%AE%A1%E7%AE%97%E5%B7%A5%E5%85%B7%20v32%EF%BC%88by%EF%BC%9A%E6%B5%8B%E8%AF%95%E7%BB%84%40Steven%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/546293/%E8%AE%A2%E5%8D%95%E6%89%B9%E9%87%8F%E5%9B%9E%E8%B0%83%20%2B%20VIP%E8%AE%A1%E7%AE%97%E5%B7%A5%E5%85%B7%20v32%EF%BC%88by%EF%BC%9A%E6%B5%8B%E8%AF%95%E7%BB%84%40Steven%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let abortFlag = false;

    /* ---------- 初始化记忆值 ---------- */
    const STORAGE_KEY = 'orderTool_showId';
    let rememberedShowId = localStorage.getItem(STORAGE_KEY) || '';

    /* ---------- 创建折叠按钮 ---------- */
    const toggleBtn = document.createElement('div');
    toggleBtn.id = 'toggleBtn';
    toggleBtn.textContent = 'VIP';
    toggleBtn.style.cssText = `
        position: fixed; top: 10px; right: 10px; z-index: 10000;
        width: 40px; height: 40px; border-radius: 50%; background: red;
        color: #fff; font-weight: bold; display: flex; align-items: center;
        justify-content: center; cursor: pointer; box-shadow: 0 2px 6px rgba(0,0,0,.3);
        user-select: none;
    `;
    document.body.appendChild(toggleBtn);

    /* ---------- 创建主面板 ---------- */
    const panel = document.createElement('div');
    panel.id = 'orderPanel';
    panel.style.cssText = `
        position: fixed; top: 55px; right: 10px; z-index: 9999; width: 420px;
        background: #fff; border: 1px solid #ccc; border-radius: 6px;
        font-family: sans-serif; font-size: 13px; box-shadow: 0 0 10px rgba(0,0,0,.2);
        display: none;
    `;
    panel.innerHTML = `
        <div id="panelHeader" style="cursor: move; background: green; padding: 6px; border-bottom: 1px solid #ccc;">
            <strong style="color: white;">订单充值批量回调工具 by@Steven&nbsp;v3.2</strong>
        </div>
        <div style="padding: 10px;">
            ShowID：<input type="text" id="showIdInput" placeholder="如：117302843" style="width: 99px;" value="${rememberedShowId}">
            <button id="loadBtn">加载订单(可为空)</button>
            <button id="startBtn" disabled>开始回调</button>
            <button id="stopBtn" disabled>停止</button>
            <button id="vipRealtimeBtn">VIP实时计算</button>
            <button id="vipMonthlyBtn">VIP月度计算</button>

            <!-- 新增删除功能 -->
            <div style="margin-top: 8px;">
                <input type="text" id="delOrderInput" placeholder="订单号删除" style="width: 120px;">
                <button id="delOrderBtn">删除订单</button>
            </div>
            <div style="margin-top: 5px;">
                <input type="text" id="delUuidInput" placeholder="用户UUID删除" style="width: 120px;">
                <button id="delUuidBtn">删除用户订单</button>
            </div>

            <div style="margin-top:5px;">
                <label><input type="checkbox" id="selectAll">全选</label>
            </div>
            <div style="max-height: 250px; overflow-y: auto; margin-top:5px;">
                <table style="width: 100%; border-collapse: collapse;" id="orderTable">
                    <thead style="position: sticky; top: 0; background: #eee;">
                        <tr>
                            <th><input type="checkbox" id="selectAllTop"></th>
                            <th>订单号</th><th>状态</th><th>用户</th><th>金额</th><th>钻石</th>
                        </tr>
                    </thead>
                    <tbody id="orderTbody"></tbody>
                </table>
            </div>
            <div id="log" style="max-height: 150px; overflow-y: auto; margin-top:5px; font-size: 12px; color:#333;"></div>
        </div>
    `;
    document.body.appendChild(panel);

    /* ---------- 折叠/展开 ---------- */
    toggleBtn.addEventListener('click', () => {
        const visible = panel.style.display !== 'none';
        panel.style.display = visible ? 'none' : 'block';
    });

    /* ---------- 记忆 ShowID ---------- */
    const showInput = document.getElementById('showIdInput');
    showInput.addEventListener('input', () => {
        localStorage.setItem(STORAGE_KEY, showInput.value.trim());
    });

    /* ---------- 拖动功能 ---------- */
    makeDraggable(panel, document.getElementById('panelHeader'));

    /* ---------- DOM 引用 ---------- */
    const loadBtn = document.getElementById('loadBtn');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const vipRealtimeBtn = document.getElementById('vipRealtimeBtn');
    const vipMonthlyBtn = document.getElementById('vipMonthlyBtn');
    const selectAll = document.getElementById('selectAll');
    const selectAllTop = document.getElementById('selectAllTop');
    const orderTbody = document.getElementById('orderTbody');
    const logDiv = document.getElementById('log');

    /* ---------- 删除订单/用户订单 ---------- */
    const delOrderBtn   = document.getElementById('delOrderBtn');
    const delUuidBtn    = document.getElementById('delUuidBtn');
    const delOrderInput = document.getElementById('delOrderInput');
    const delUuidInput  = document.getElementById('delUuidInput');

    let orders = [];

    const log = (msg) => {
        logDiv.innerHTML += `<div>${new Date().toLocaleTimeString()} - ${msg}</div>`;
        logDiv.scrollTop = logDiv.scrollHeight;
    };

    /* ---------- 加载订单 ---------- */
    loadBtn.addEventListener('click', async () => {
        const showId = showInput.value.trim();
        loadBtn.disabled = true;
        orderTbody.innerHTML = '';
        log('正在加载订单...');
        try {
            const html = await fetchPage(`/orders?tradeNo=&showId=${showId}&status=`);
            const doc = new DOMParser().parseFromString(html, 'text/html');
            const rows = Array.from(doc.querySelectorAll('tbody tr'));
            orders = [];
            rows.forEach(row => {
                const status = row.querySelector('.status-badge')?.textContent.trim();
                const orderId = row.querySelector('.fw-semibold')?.textContent.trim();
                const user = row.querySelector('td:nth-child(2)')?.textContent.trim();
                const amount = row.querySelector('.amount-cell')?.textContent.trim();
                const diamond = row.querySelector('td:nth-child(4)')?.textContent.trim();
                if (status === '未支付' && orderId) {
                    orders.push({ orderId, status, user, amount, diamond });
                }
            });
            renderOrderTable(orders);
            startBtn.disabled = false;
            log(`已加载 ${orders.length} 个未支付订单`);
        } catch (e) {
            log('加载失败：' + e.message);
        } finally {
            loadBtn.disabled = false;
        }
    });

    function renderOrderTable(data) {
        orderTbody.innerHTML = '';
        data.forEach((o, idx) => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td><input type="checkbox" class="orderCheck" data-idx="${idx}"></td>
                <td>${o.orderId}</td><td>${o.status}</td><td>${o.user}</td><td>${o.amount}</td><td>${o.diamond}</td>
            `;
            orderTbody.appendChild(tr);
        });
    }

    [selectAll, selectAllTop].forEach(box => {
        box.addEventListener('change', () => {
            const checked = box.checked;
            document.querySelectorAll('.orderCheck').forEach(cb => cb.checked = checked);
        });
    });

    /* ---------- 开始/停止回调 ---------- */
    startBtn.addEventListener('click', async () => {
        const selected = Array.from(document.querySelectorAll('.orderCheck:checked'))
                              .map(cb => orders[cb.dataset.idx].orderId);
        if (selected.length === 0) return alert('请先勾选订单');

        abortFlag = false;
        startBtn.disabled = true;
        stopBtn.disabled = false;
        for (const orderId of selected) {
            if (abortFlag) { log('已停止回调'); break; }
            log(`正在回调 ${orderId}...`);
            try {
                await postOrder(orderId);
                log(`✅ ${orderId} 回调成功`);
            } catch (e) {
                log(`❌ ${orderId} 回调失败：${e.message}`);
            }
            await delay(1000);
        }
        startBtn.disabled = false;
        stopBtn.disabled = true;
        log('回调完成');
    });

    stopBtn.addEventListener('click', () => { abortFlag = true; });

    /* ---------- VIP 计算 ---------- */
    vipRealtimeBtn.addEventListener('click', async () => {
        try { await postForm('vip_realtime', {}); log('✅ VIP实时计算已触发'); } catch { log('VIP实时计算失败'); }
    });
    vipMonthlyBtn.addEventListener('click', async () => {
        try { await postForm('vip_monthly', {}); log('✅ VIP月度计算已触发'); } catch { log('VIP月度计算失败'); }
    });

    /* ---------- 删除订单 ---------- */
    delOrderBtn.addEventListener('click', async () => {
        const orderId = delOrderInput.value.trim();
        if (!orderId) return showFloatTip('请输入订单号', '#ff9800');
        try {
            await postForm('del_order', orderId);
            log(`✅ 订单 ${orderId} 已删除`);
            delOrderInput.value = '';
        } catch (e) {
            log(`❌ 删除订单失败：${e.message}`);
        }
    });

    /* ---------- 删除用户订单 ---------- */
    delUuidBtn.addEventListener('click', async () => {
        const uuid = delUuidInput.value.trim();
        if (!uuid) return showFloatTip('请输入用户UUID', '#ff9800');
        try {
            await postForm('del_order_uuid', uuid);
            log(`✅ 用户 ${uuid} 的全部订单已删除`);
            delUuidInput.value = '';
        } catch (e) {
            log(`❌ 删除用户订单失败：${e.message}`);
        }
    });

    /* ---------- 工具函数 ---------- */
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }

    function fetchPage(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: location.origin + url,
                onload: res => res.status === 200 ? resolve(res.responseText) : reject(new Error(`HTTP ${res.status}`)),
                onerror: () => reject(new Error('网络错误'))
            });
        });
    }

    function postOrder(orderId) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: location.origin + '/orders/confirm',
                headers: { 'Content-Type': 'application/json' },
                data: JSON.stringify({ orderId }),
                onload: res => res.status === 200 ? resolve() : reject(new Error(`HTTP ${res.status}`)),
                onerror: () => reject(new Error('网络错误'))
            });
        });
    }

    function postForm(key, value) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: location.origin + '/submit',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                data: `key=${key}&value=${encodeURIComponent(typeof value === 'string' ? value : JSON.stringify(value))}`,
                onload: res => res.status === 200 ? resolve() : reject(new Error(`HTTP ${res.status}`)),
                onerror: () => reject(new Error('网络错误'))
            });
        });
    }

    /* ---------- 通用飘窗 ---------- */
    function showFloatTip(text, bg = 'linear-gradient(to right, #98fb98, #32cd32)') {
        const tip = document.createElement('div');
        tip.innerText = text;
        tip.style.cssText = `
            position:fixed; top:30%; left:50%; transform:translate(-50%,-50%);
            padding:8px 16px; background:${bg}; color:#fff; border:none;
            border-radius:6px; font-size:18px; font-weight:bold; min-width:240px;
            text-align:center; z-index:99999; box-shadow:0 4px 12px rgba(0,0,0,.25);
            transition:opacity .3s;
        `;
        document.body.appendChild(tip);
        setTimeout(() => { tip.style.opacity = 0; setTimeout(() => tip.remove(), 300); }, 4000);
    }

    /* ---------- 拖动 ---------- */
    function makeDraggable(element, header) {
        let offsetX = 0, offsetY = 0, dragging = false;
        header.addEventListener('mousedown', e => {
            dragging = true;
            offsetX = e.clientX - element.offsetLeft;
            offsetY = e.clientY - element.offsetTop;
        });
        document.addEventListener('mousemove', e => {
            if (!dragging) return;
            element.style.left = (e.clientX - offsetX) + 'px';
            element.style.top  = (e.clientY - offsetY) + 'px';
            element.style.right = 'auto';
        });
        document.addEventListener('mouseup', () => dragging = false);
    }
})();