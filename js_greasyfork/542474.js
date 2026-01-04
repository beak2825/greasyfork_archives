// ==UserScript==
// @name         ユーザーID取得ツール
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  Discord のアバターからユーザーIDを抽出
// @author       Freeze
// @match        https://discord.com/*
// @grant        none
// @license      クレジットを残せば改変・再配布可 ©Freeze
// @downloadURL https://update.greasyfork.org/scripts/542474/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BCID%E5%8F%96%E5%BE%97%E3%83%84%E3%83%BC%E3%83%AB.user.js
// @updateURL https://update.greasyfork.org/scripts/542474/%E3%83%A6%E3%83%BC%E3%82%B6%E3%83%BCID%E5%8F%96%E5%BE%97%E3%83%84%E3%83%BC%E3%83%AB.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let observer = null;
    let isBoxVisible = false;
    let copyFormat = 'newline';

    // スタイルシートを追加
    const style = document.createElement('style');
    style.textContent = `
        .uid-container {
            position: fixed;
            top: 100px;
            left: 80px;
            width: 260px;
            max-height: 80vh;
            background: rgba(20, 20, 20, 0.95);
            color: #eee;
            padding: 12px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.6);
            font-family: 'Segoe UI', Tahoma, sans-serif;
            user-select: none;
            display: none;
            z-index: 10000;
        }
        .uid-container header {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .uid-container header .title {
            font-size: 16px;
            font-weight: 600;
        }
        .uid-container header .close-btn {
            background: transparent;
            border: none;
            color: #aaa;
            font-size: 16px;
            cursor: pointer;
            transition: color 0.2s;
        }
        .uid-container header .close-btn:hover {
            color: #fff;
        }
        .uid-count {
            margin: 8px 0;
            font-size: 13px;
            text-align: right;
            color: #bbb;
        }
        .uid-list {
            list-style: none;
            margin: 8px 0;
            padding: 4px;
            background: rgba(0,0,0,0.2);
            border-radius: 6px;
            font-size: 13px;
            height: 240px;
            overflow-y: auto;
        }
        .uid-list li {
            padding: 4px 6px;
            margin: 2px 0;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            word-break: break-all;
        }
        .uid-btn {
            display: inline-block;
            margin: 4px 2px;
            padding: 6px 12px;
            font-size: 13px;
            background: #2f3136;
            color: #ddd;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background 0.2s, transform 0.1s;
        }
        .uid-btn:hover {
            background: #40444b;
            transform: translateY(-1px);
        }
        .uid-btn:active {
            transform: translateY(1px);
        }
        .uid-scrollbar::-webkit-scrollbar {
            width: 6px;
        }
        .uid-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.3);
            border-radius: 3px;
        }
    `;
    document.head.appendChild(style);

    // コンテナ作成
    const container = document.createElement('div');
    container.className = 'uid-container';
    document.body.appendChild(container);

    // ドラッグ機能
    (function(el) {
        el.onmousedown = function(e) {
            e.preventDefault();
            const ox = e.clientX - el.offsetLeft;
            const oy = e.clientY - el.offsetTop;
            function move(ev) {
                el.style.left = (ev.clientX - ox) + 'px';
                el.style.top  = (ev.clientY - oy) + 'px';
            }
            document.addEventListener('mousemove', move);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', move);
            }, { once: true });
        };
        el.ondragstart = () => false;
    })(container);

    // ヘッダー
    container.innerHTML = `
        <header>
            <div class="title">取得したユーザーID</div>
            <button class="close-btn">✕</button>
        </header>
        <div class="uid-count">UID数: 0</div>
        <button id="formatBtn" class="uid-btn">表示形式: 改行</button>
        <ul id="listArea" class="uid-list uid-scrollbar"></ul>
        <div style="text-align:center; margin-top:8px;">
            <button id="startBtn" class="uid-btn">開始</button>
            <button id="stopBtn" class="uid-btn">停止</button>
            <button id="resetBtn" class="uid-btn">リセット</button>
            <button id="copyBtn" class="uid-btn">コピー</button>
            <button id="saveBtn" class="uid-btn">保存</button>
        </div>
    `;

    // 要素参照
    const closeBtn = container.querySelector('.close-btn');
    const countDisplay = container.querySelector('.uid-count');
    const formatBtn = container.querySelector('#formatBtn');
    const listArea = container.querySelector('#listArea');
    const startBtn = container.querySelector('#startBtn');
    const stopBtn = container.querySelector('#stopBtn');
    const resetBtn = container.querySelector('#resetBtn');
    const copyBtn = container.querySelector('#copyBtn');
    const saveBtn = container.querySelector('#saveBtn');

    // ボタン動作
    closeBtn.onclick = () => { container.style.display = 'none'; isBoxVisible = false; };
    formatBtn.onclick = () => {
        copyFormat = (copyFormat === 'newline' ? 'comma' : 'newline');
        formatBtn.textContent = copyFormat === 'newline' ? '表示形式: 改行' : '表示形式: カンマ';
    };
    startBtn.onclick = () => {
        if (observer) observer.disconnect();
        updateList();
        observer = new MutationObserver(() => setTimeout(updateList, 300));
        observer.observe(document.body, { childList: true, subtree: true });
    };
    stopBtn.onclick = () => {
        if (observer) { observer.disconnect(); observer = null; }
    };
    resetBtn.onclick = () => {
        listArea.innerHTML = '';
        countDisplay.textContent = 'UID数: 0';
        if (observer) observer.disconnect();
    };
    copyBtn.onclick = () => {
        const items = [...listArea.children].map(li => li.textContent);
        const txt = (copyFormat === 'comma' ? items.join(',') : items.join('\n'));
        navigator.clipboard.writeText(txt);
    };
    saveBtn.onclick = () => {
        const items = [...listArea.children].map(li => li.textContent);
        const txt = (copyFormat === 'comma' ? items.join(',') : items.join('\n'));
        const blob = new Blob([txt], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = 'uids.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    // UID抽出／更新
    function extractUIDs() {
        const imgs = document.querySelectorAll('img[src*="cdn.discordapp.com/avatars/"]');
        const set = new Set();
        imgs.forEach(img => {
            const m = img.src.match(/avatars\/(\d+)\//);
            if (m) set.add(m[1]);
        });
        return [...set];
    }
    function updateList() {
        const uids = extractUIDs();
        uids.forEach(id => {
            if (![...listArea.children].some(li => li.textContent === id)) {
                const li = document.createElement('li');
                li.textContent = id;
                listArea.appendChild(li);
            }
        });
        countDisplay.textContent = 'UID数: ' + listArea.children.length;
    }

    // トグルボタン
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'uid-btn';
    toggleBtn.style.position = 'fixed';
    toggleBtn.style.bottom = '20px';
    toggleBtn.style.left = '20px';
    toggleBtn.style.zIndex = '10001';
    toggleBtn.textContent = 'UID取得';
    toggleBtn.onclick = () => {
        isBoxVisible = !isBoxVisible;
        container.style.display = isBoxVisible ? 'block' : 'none';
    };
    document.body.appendChild(toggleBtn);
})();