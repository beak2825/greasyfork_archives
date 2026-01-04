// ==UserScript==
// @name         スレ別ID別書き込み数表示
// @namespace    スレ別ID別書き込み数表示
// @version      6.5
// @description  おんJでIDごとの書き込み数を表示。
// @author       
// @match        *://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528545/%E3%82%B9%E3%83%AC%E5%88%A5ID%E5%88%A5%E6%9B%B8%E3%81%8D%E8%BE%BC%E3%81%BF%E6%95%B0%E8%A1%A8%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/528545/%E3%82%B9%E3%83%AC%E5%88%A5ID%E5%88%A5%E6%9B%B8%E3%81%8D%E8%BE%BC%E3%81%BF%E6%95%B0%E8%A1%A8%E7%A4%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // IDごとの書き込み数を取得する関数
    const countIDs = () => {
        const idCountMap = new Map();
        document.querySelectorAll('._id').forEach(el => {
            const id = el.getAttribute('val');
            idCountMap.set(id, (idCountMap.get(id) || 0) + 1);
        });
        return [...idCountMap.entries()].sort((a, b) => b[1] - a[1]);
    };

    // スレ主のIDを取得する関数
    const getThreadOwnerID = () => {
        const firstPost = document.querySelector('._id');
        return firstPost ? firstPost.getAttribute('val') : null;
    };

    // 要素作成ヘルパー
    const createElement = (tag, props = {}, styles = {}) => {
        const el = document.createElement(tag);
        Object.assign(el, props);
        Object.assign(el.style, styles);
        return el;
    };

    // 「書き込み数」ボタン（左側に固定）
    const button = createElement('button', { id: 'idCountButton', textContent: '📊 書き込み数' }, {
        position: 'fixed', top: '90px', left: '10px', padding: '8px 12px',
        background: '#007BFF', color: 'white', border: 'none', borderRadius: '5px',
        cursor: 'pointer', fontSize: '14px', zIndex: '1000'
    });

    // 書き込み数ボックス
    const box = createElement('div', { id: 'idCountBox' }, {
        position: 'fixed', top: '90px', left: '10px', width: '160px', maxHeight: '60vh',
        overflowY: 'auto', background: 'rgba(0, 0, 0, 0.8)', color: 'white',
        padding: '8px', borderRadius: '5px', fontSize: '12px', zIndex: '1000',
        display: 'none'
    });

    // ヘッダー部分（縮小ボタン付き）
    const header = createElement('div', {}, {
        position: 'sticky', top: '0', display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', background: 'rgba(0, 0, 0, 0.9)', padding: '5px',
        borderRadius: '5px 5px 0 0', zIndex: '1001'
    });
    const title = createElement('div', { textContent: '💬 書き込み数' }, { fontWeight: 'bold' });
    const shrinkButton = createElement('button', { textContent: '縮小' }, {
        padding: '5px 15px', background: '#ccc', color: '#007BFF', border: 'none',
        borderRadius: '20px', cursor: 'pointer', fontSize: '12px'
    });
    header.appendChild(title);
    header.appendChild(shrinkButton);
    box.appendChild(header);

    // リスト部分を別コンテナとして追加
    const listContainer = createElement('div', { id: 'listContainer' });
    box.appendChild(listContainer);

    document.body.append(button, box);

    // 書き込み数を更新する関数（リスト部分のみ innerHTML で一括更新）
    const updateIDList = () => {
        const counts = countIDs();
        const threadOwnerID = getThreadOwnerID(); // スレ主のIDを取得
        let html = '';
        counts.forEach(([id, count]) => {
            // スレ主のIDに「主」を薄い赤文字で追加
            const ownerLabel = id === threadOwnerID ? '<span style="color: #ff6666; font-weight: bold;">主</span>' : '';
            html += `<div style="border-bottom: 1px solid rgba(255,255,255,0.3); padding: 2px 0; display: flex; justify-content: space-between;">
                        <div>${id}: ${count}回 ${ownerLabel}</div>
                    </div>`;
        });
        listContainer.innerHTML = html;
    };

    // 更新処理をデバウンスして軽量化
    let debounceTimeout;
    const scheduleUpdateIDList = () => {
        if (debounceTimeout) clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            updateIDList();
            debounceTimeout = null;
        }, 100);
    };

    // 「書き込み数」ボタン押下で一覧表示
    button.addEventListener('click', () => {
        updateIDList();
        box.style.display = 'block';
        button.style.display = 'none';
    });

    // 縮小ボタンで閉じる
    shrinkButton.addEventListener('click', () => {
        box.style.display = 'none';
        button.style.display = 'block';
    });

    // レス部分のみ監視（軽量化のためデバウンスを使用）
    const observer = new MutationObserver(scheduleUpdateIDList);
    const resContainer = document.getElementById('res');
    if (resContainer) observer.observe(resContainer, { childList: true });
})();