// ==UserScript==
// @name         心理价位自动出价增强版
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  京东拍拍自动根据心理价位出价，自动最高价出价+美化界面+一键启停
// @author       你的名字
// @match        https://paipai.jd.com/auction-detail/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534255/%E5%BF%83%E7%90%86%E4%BB%B7%E4%BD%8D%E8%87%AA%E5%8A%A8%E5%87%BA%E4%BB%B7%E5%A2%9E%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/534255/%E5%BF%83%E7%90%86%E4%BB%B7%E4%BD%8D%E8%87%AA%E5%8A%A8%E5%87%BA%E4%BB%B7%E5%A2%9E%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    /*** 全局变量区 ***/
    let isRunning = true; // 脚本开关
    let autoMaxBid = true; // 是否自动最高价
    let quickAddOne = true; // 是否自动加1
    let preSeconds = 1; // 提前几秒出价
    let refreshTimer = null;

    /*** UI区 ***/
    const panel = createElement('div', {
        position: 'fixed',
        top: '10px',
        right: '10px',
        background: '#fff',
        padding: '15px',
        borderRadius: '10px',
        boxShadow: '0 2px 12px rgba(0,0,0,0.2)',
        fontSize: '14px',
        zIndex: 9999,
        width: '260px',
        color: '#333',
        fontFamily: 'Arial, sans-serif'
    });

    panel.innerHTML = `
        <div style="margin-bottom:10px;">心理价位：<input id="maxPriceInput" type="number" style="width:80px;" /> <button id="setMaxPrice">设置</button></div>
        <div style="margin-bottom:10px;">刷新间隔(秒)：<input id="refreshInput" type="number" style="width:50px;" /> <button id="setRefresh">设置</button> <button id="cancelRefresh">取消</button></div>
        <div style="margin-bottom:10px;">
            <label><input id="quickAdd" type="checkbox" checked /> 快速加价</label><br/>
            <label><input id="maxBid" type="checkbox" checked /> 自动最高出价</label>
        </div>
        <div style="margin-bottom:10px;">提前<input id="preSeconds" type="number" style="width:40px;" value="1"/>秒出价</div>
        <div style="margin-bottom:10px;">状态：<span id="statusText" style="color:green;">运行中</span></div>
        <button id="toggleRun" style="width:100%;background:#007BFF;color:#fff;border:none;padding:5px;border-radius:5px;">暂停脚本</button>
    `;

    document.body.appendChild(panel);

    /*** 初始化已保存的数据 ***/
    const maxPriceInput = panel.querySelector('#maxPriceInput');
    const refreshInput = panel.querySelector('#refreshInput');
    const preSecondsInput = panel.querySelector('#preSeconds');

    maxPriceInput.value = localStorage.getItem('maxPrice') || '';
    refreshInput.value = (parseInt(localStorage.getItem('refreshInterval')) || 60 * 1000) / 1000;
    preSecondsInput.value = localStorage.getItem('preSeconds') || 1;

    /*** 绑定UI按钮事件 ***/
    panel.querySelector('#setMaxPrice').onclick = () => {
        localStorage.setItem('maxPrice', parseFloat(maxPriceInput.value));
        showMessage('心理价位设置成功');
    };

    panel.querySelector('#setRefresh').onclick = () => {
        const interval = parseInt(refreshInput.value) * 1000;
        if (refreshTimer) clearInterval(refreshTimer);
        refreshTimer = setInterval(() => location.reload(), interval);
        localStorage.setItem('refreshInterval', interval);
        showMessage(`刷新时间设置为${refreshInput.value}秒`);
    };

    panel.querySelector('#cancelRefresh').onclick = () => {
        if (refreshTimer) clearInterval(refreshTimer);
        localStorage.removeItem('refreshInterval');
        showMessage('刷新取消');
    };

    panel.querySelector('#quickAdd').onchange = (e) => {
        quickAddOne = e.target.checked;
    };

    panel.querySelector('#maxBid').onchange = (e) => {
        autoMaxBid = e.target.checked;
    };

    panel.querySelector('#toggleRun').onclick = () => {
        isRunning = !isRunning;
        panel.querySelector('#toggleRun').innerText = isRunning ? '暂停脚本' : '启动脚本';
        panel.querySelector('#statusText').innerText = isRunning ? '运行中' : '已暂停';
        panel.querySelector('#statusText').style.color = isRunning ? 'green' : 'red';
    };

    preSecondsInput.onchange = (e) => {
        localStorage.setItem('preSeconds', e.target.value);
        preSeconds = parseInt(e.target.value);
    };

    /*** 出价逻辑区 ***/
    observeElement('#J-count-down', (countdownEl) => {
        const observer = new MutationObserver(() => {
            const countdown = getCountdownTime();
            if (!countdown) return;
            if (countdown <= preSeconds && isRunning) {
                tryAutoBid();
            }
        });
        observer.observe(countdownEl, { childList: true, subtree: true, characterData: true });
    });

    /*** 价格监控区 ***/
    checkPriceLoop();
    function checkPriceLoop() {
        setInterval(() => {
            if (!isRunning) return;
            const price = getCurrentPrice();
            const maxPrice = parseFloat(localStorage.getItem('maxPrice'));
            if (price && maxPrice && price > maxPrice) {
                showMessage(`当前价${price}超出心理价${maxPrice}`, true);
            }
        }, 3000);
    }

    /*** 核心出价动作 ***/
    function tryAutoBid() {
        const bidInput = document.querySelector('.el-input .el-input__inner');
        const bidButton = document.querySelector('.choose-btns.clearfix .btn-special6.btn-lg');
        if (!bidInput || !bidButton) return;

        const currentPrice = getCurrentPrice();
        const maxPrice = parseFloat(localStorage.getItem('maxPrice'));

        if (isNaN(currentPrice) || isNaN(maxPrice)) return;

        if (currentPrice >= maxPrice) {
            showMessage('当前价格已超心理价', true);
            return;
        }

        let newBid = currentPrice + 1;
        if (autoMaxBid) {
            newBid = maxPrice;
        }

        bidInput.value = newBid.toFixed(2);
        bidButton.click();
        showMessage(`自动出价：￥${newBid}`);
    }

    /*** 辅助函数区 ***/
    function createElement(tag, styleObj = {}) {
        const el = document.createElement(tag);
        Object.assign(el.style, styleObj);
        return el;
    }

    function showMessage(text, warning = false) {
        const msg = createElement('div', {
            position: 'fixed',
            top: '70px',
            right: '10px',
            background: warning ? '#ff4d4f' : '#4CAF50',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '5px',
            fontSize: '14px',
            zIndex: 10000,
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.5s'
        });
        msg.textContent = text;
        document.body.appendChild(msg);
        setTimeout(() => { msg.remove(); }, 3000);
    }

    function getCountdownTime() {
        const iTags = document.querySelectorAll('#J-count-down i');
        if (!iTags.length) return null;
        const timeStr = [...iTags].map(i => i.textContent.trim()).join(':');
        const [h, m, s] = timeStr.split(':').map(Number);
        return h * 3600 + m * 60 + s;
    }

    function getCurrentPrice() {
        const priceEl = document.querySelector('.p-price .price');
        if (!priceEl) return NaN;
        const price = parseFloat(priceEl.textContent.replace(/[^\d.]/g, ''));
        return price;
    }

    function observeElement(selector, callback) {
        const observer = new MutationObserver(() => {
            const el = document.querySelector(selector);
            if (el) {
                callback(el);
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    /*** 初始化刷新定时器 ***/
    const intervalFromStorage = localStorage.getItem('refreshInterval');
    if (intervalFromStorage) {
        refreshTimer = setInterval(() => location.reload(), parseInt(intervalFromStorage));
    }
})();
