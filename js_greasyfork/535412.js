// ==UserScript==
// @name         チャベリ オーナーツール強化
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  PRメッセージを一度設定すると永遠に自動更新するオーナーツール（最前面表示）
// @author       You
// @match        https://www.chaberi.com/room/*
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/535412/%E3%83%81%E3%83%A3%E3%83%99%E3%83%AA%20%E3%82%AA%E3%83%BC%E3%83%8A%E3%83%BC%E3%83%84%E3%83%BC%E3%83%AB%E5%BC%B7%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/535412/%E3%83%81%E3%83%A3%E3%83%99%E3%83%AA%20%E3%82%AA%E3%83%BC%E3%83%8A%E3%83%BC%E3%83%84%E3%83%BC%E3%83%AB%E5%BC%B7%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('[OwnerTool] Script started');

    // CSSスタイルの定義
    const style = document.createElement('style');
    style.textContent = `
        #ownerToolPanel {
            position: fixed;
            background: #fff;
            border: 2px solid #fdbb41;
            border-radius: 5px;
            width: 300px;
            z-index: 9999999; /* 最前面表示を保証 */
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            transition: height 0.3s ease;
        }
        #ownerToolPanel header {
            background: #fdbb41;
            color: white;
            padding: 5px;
            text-align: center;
            font-weight: bold;
            cursor: move;
            display: flex;
            justify-content: space-between;
        }
        #ownerToolPanel.minimized {
            height: 30px;
            overflow: hidden;
        }
        #ownerToolPanel .owner-content {
            padding: 10px;
            display: block;
        }
        #ownerToolPanel.minimized .owner-content {
            display: none;
        }
        #ownerToolPanel select, #ownerToolPanel input, #ownerToolPanel button {
            width: 100%;
            margin: 5px 0;
            padding: 5px;
            box-sizing: border-box;
        }
        #ownerSetPrBtn {
            background: #007bff;
            color: white;
            border: none;
            border-radius: 3px;
            cursor: pointer;
        }
        #ownerToggleBtn {
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
        }
    `;
    document.head.appendChild(style);

    // UIパネルの構築
    const panel = document.createElement('div');
    panel.id = 'ownerToolPanel';
    panel.innerHTML = `
        <header>
            <span>オーナーツール</span>
            <button id="ownerToggleBtn">▼</button>
        </header>
        <div class="owner-content">
            <select id="ownerPrSelect">
                <option value="日本語プログラム言語に興味はないか？">日本語プログラム言語に興味はないかい？</option>
                <option value="プログラミング初心者歓迎！気軽にどうぞ！">プログラミング初心者歓迎！気軽にどうぞ！</option>
                <option value="AIでプログラムを作らないか？">AIでプログラムを作らないか？</option>
                <option value="custom">カスタムメッセージ</option>
            </select>
            <input id="ownerPrInput" type="text" maxlength="20" placeholder="カスタムPR (20文字以内)" style="display: none;">
            <button id="ownerSetPrBtn">PRを設定</button>
        </div>
    `;
    document.body.appendChild(panel);

    // パネル位置と状態の復元
    let isMinimized = GM_getValue('isMinimized', true);
    let panelX = GM_getValue('panelX', 50);
    let panelY = GM_getValue('panelY', 50);
    let lastPrMessage = GM_getValue('lastPrMessage', '');

    panel.style.left = `${Math.max(0, Math.min(panelX, window.innerWidth - 300))}px`;
    panel.style.top = `${Math.max(0, Math.min(panelY, window.innerHeight - 30))}px`;
    if (isMinimized) {
        panel.classList.add('minimized');
        document.getElementById('ownerToggleBtn').textContent = '▶';
    }

    // 収納/展開機能
    const toggleBtn = document.getElementById('ownerToggleBtn');
    toggleBtn.addEventListener('click', () => {
        isMinimized = !isMinimized;
        panel.classList.toggle('minimized', isMinimized);
        toggleBtn.textContent = isMinimized ? '▶' : '▼';
        GM_setValue('isMinimized', isMinimized);
    });

    // ドラッグ機能
    const header = panel.querySelector('header');
    let isDragging = false;
    let initialX, initialY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        initialX = e.clientX - panelX;
        initialY = e.clientY - panelY;
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDragging, { once: true });
    });

    function onDrag(e) {
        if (!isDragging) return;
        panelX = e.clientX - initialX;
        panelY = e.clientY - initialY;
        panel.style.left = `${Math.max(0, Math.min(panelX, window.innerWidth - 300))}px`;
        panel.style.top = `${Math.max(0, Math.min(panelY, window.innerHeight - 30))}px`;
    }

    function stopDragging() {
        isDragging = false;
        GM_setValue('panelX', panelX);
        GM_setValue('panelY', panelY);
        document.removeEventListener('mousemove', onDrag);
    }

    // 要素待機関数
    function waitForElement(selector, callback, timeout = 10000) {
        const start = Date.now();
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                callback(element);
            } else if (Date.now() - start >= timeout) {
                clearInterval(interval);
                console.error(`[OwnerTool] Timeout: Could not find ${selector}`);
            }
        }, 500);
    }

    // PRメッセージ設定ロジック
    const prSelect = document.getElementById('ownerPrSelect');
    const prInput = document.getElementById('ownerPrInput');
    const setPrBtn = document.getElementById('ownerSetPrBtn');

    // 初期メッセージ復元
    if (lastPrMessage) {
        prSelect.value = lastPrMessage;
        if (!prSelect.value) {
            prSelect.value = 'custom';
            prInput.value = lastPrMessage;
            prInput.style.display = 'block';
        }
    }

    prSelect.addEventListener('change', () => {
        prInput.style.display = prSelect.value === 'custom' ? 'block' : 'none';
        if (prSelect.value !== 'custom') prInput.value = '';
    });

    function setPrMessage() {
        const message = prSelect.value === 'custom' ? prInput.value : prSelect.value;
        if (!message || message.length > 20) {
            console.log('[OwnerTool] Invalid PR message:', message);
            return;
        }

        waitForElement('#pr_message', (input) => {
            input.value = message;
            waitForElement('#set_pr', (button) => {
                button.click();
                console.log('[OwnerTool] PR message set:', message);
                lastPrMessage = message;
                GM_setValue('lastPrMessage', message);
                panel.classList.add('minimized');
                toggleBtn.textContent = '▶';
                isMinimized = true;
                GM_setValue('isMinimized', true);
            });
        });
    }

    setPrBtn.addEventListener('click', setPrMessage);

    // 30分ごとに自動更新
    if (lastPrMessage) setPrMessage();
    setInterval(() => {
        if (lastPrMessage) {
            console.log('[OwnerTool] Auto-updating PR:', lastPrMessage);
            setPrMessage();
        }
    }, 30 * 60 * 1000);
})();