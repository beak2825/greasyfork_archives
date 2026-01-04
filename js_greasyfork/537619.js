// ==UserScript==
// @name         自动打开威海专技专业课购买页面
// @namespace    http://tampermonkey.net/
// @version      0.7
// @description  按序批量打开支付页并自动执行“微信支付→去支付”，当微信支付页 modal-open 后，自动关闭付款页和原支付页。
// @match        https://sdwh-zyk.yxlearning.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537619/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%A8%81%E6%B5%B7%E4%B8%93%E6%8A%80%E4%B8%93%E4%B8%9A%E8%AF%BE%E8%B4%AD%E4%B9%B0%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/537619/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80%E5%A8%81%E6%B5%B7%E4%B8%93%E6%8A%80%E4%B8%93%E4%B8%9A%E8%AF%BE%E8%B4%AD%E4%B9%B0%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // —— 延时参数（毫秒） ——
    const WX_CLICK_DELAY   = 500;
    const PAY_CLICK_DELAY  = 800;
    const POLL_INTERVAL    = 500;

    const href = location.href;

    // —— 简易日志输出 ——
    function appendLog(msg) {
        const ta = document.getElementById('tm-log-box');
        const time = new Date().toLocaleTimeString();
        const line = `[${time}] ${msg}\n`;
        if (ta) {
            ta.value += line;
            ta.scrollTop = ta.scrollHeight;
        }
        console.log(line.trim());
    }

    // —— 支付页：/order/pay?classId= 自动点击逻辑，不再自动关闭 ——
    if (/\/order\/pay\?classId=/.test(href)) {
        function waitAndClick(selector, delay, cb) {
            const el = document.querySelector(selector);
            if (el) {
                setTimeout(() => {
                    el.click();
                    appendLog(`点击 ${selector}`);
                    if (cb) cb();
                }, delay);
            } else {
                setTimeout(() => waitAndClick(selector, delay, cb), 300);
            }
        }

        // 先选中微信支付，再点击去支付
        waitAndClick('div[du-click="wxwebpay"]', WX_CLICK_DELAY, () => {
            waitAndClick('span[du-click="pay"]', PAY_CLICK_DELAY, () => {
                appendLog('已点击“去支付”，等待微信支付页面处理');
                // 不在此处关闭，等待子窗口 modal-open 后再统一关闭
            });
        });
        return;  // 不注入列表页面板
    }

    // —— 微信付款确认页：/order/pay-wechat-pay? 监控 modal-open 并关闭窗口 ——
    if (/\/order\/pay-wechat-pay\?/.test(href)) {
        appendLog('进入微信支付确认页，开始监控 body class');
        const observer = new MutationObserver(() => {
            if (document.body.classList.contains('modal-open')) {
                appendLog('检测到 modal-open，关闭当前窗口及原支付页');
                observer.disconnect();
                const openerWin = window.opener;
                window.close();  // 先关闭当前微信支付页
                if (openerWin && !openerWin.closed) {
                    openerWin.close();  // 再关闭原 /order/pay?classId= 支付页
                }
            }
        });
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return;  // 不注入列表页面板
    }

    // —— 其余页面：课程列表页按序批量打开逻辑 + 日志面板 ——
    const panel = document.createElement('div');
    Object.assign(panel.style, {
        position: 'fixed', top: '10px', right: '10px', zIndex: '9999',
        backgroundColor: '#fff', border: '1px solid #ccc',
        padding: '8px', borderRadius: '4px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)', fontFamily: 'Arial, sans-serif'
    });

    // Start / Stop 按钮
    const startBtn = document.createElement('button');
    startBtn.textContent = 'Start';
    Object.assign(startBtn.style, { marginRight: '6px', padding: '4px 8px', cursor: 'pointer' });
    const stopBtn = document.createElement('button');
    stopBtn.textContent = 'Stop';
    stopBtn.disabled = true;
    Object.assign(stopBtn.style, { padding: '4px 8px', cursor: 'pointer' });

    // 日志输出框
    const logBox = document.createElement('textarea');
    logBox.id = 'tm-log-box';
    Object.assign(logBox.style, {
        display: 'block', width: '300px', height: '150px',
        marginTop: '8px', padding: '4px', fontSize: '12px',
        fontFamily: 'monospace', backgroundColor: '#f5f5f5',
        color: '#333', border: '1px solid #ccc', resize: 'none',
        overflowY: 'auto'
    });
    logBox.readOnly = true;

    panel.appendChild(startBtn);
    panel.appendChild(stopBtn);
    panel.appendChild(logBox);
    document.body.appendChild(panel);

    let urls = [], idx = 0, running = false;
    let childWin = null, pollTimer = null;

    startBtn.addEventListener('click', () => {
        if (running) return;
        const anchors = document.querySelectorAll('div.row.dd a[du-click="btnClick"]');
        urls = Array.from(anchors).map(a =>
            `https://sdwh-zyk.yxlearning.com/order/pay?classId=${encodeURIComponent(a.id)}`
        );
        if (!urls.length) {
            alert('未找到任何可批量打开的课程支付链接。');
            return;
        }
        running = true; idx = 0;
        startBtn.disabled = true; stopBtn.disabled = false;
        logBox.value = ''; appendLog(`准备打开 ${urls.length} 个支付页`);
        openNextSequential();
    });

    stopBtn.addEventListener('click', () => {
        running = false;
        startBtn.disabled = false; stopBtn.disabled = true;
        if (pollTimer) clearInterval(pollTimer);
        appendLog('已停止批量操作');
    });

    // 按序打开，每次等待子窗口关闭后再继续
    function openNextSequential() {
        if (!running || idx >= urls.length) {
            running = false;
            startBtn.disabled = false; stopBtn.disabled = true;
            appendLog('所有支付页已处理完毕');
            return;
        }
        const url = urls[idx];
        appendLog(`第 ${idx + 1} 个：打开 ${url}`);
        childWin = window.open(url, '_blank');
        pollTimer = setInterval(() => {
            if (!childWin || childWin.closed) {
                clearInterval(pollTimer);
                appendLog(`第 ${idx + 1} 个支付页已关闭`);
                idx++;
                openNextSequential();
            }
        }, POLL_INTERVAL);
    }

})();
