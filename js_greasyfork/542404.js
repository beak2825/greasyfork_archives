// ==UserScript==
// @name         AtCoder Standings Enhancer (v4)
// @name:ja      AtCoder 順位表 強化スクリプト (v4)
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  Adds favorite user functionality to AtCoder standings, allowing you to mark, filter, and hide users.
// @description:ja AtCoderの順位表にお気に入り機能を追加し、ユーザーに印をつけたり、非表示にしたりできます。
// @author       sounansya
// @match        https://atcoder.jp/contests/*/standings*
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/542404/AtCoder%20Standings%20Enhancer%20%28v4%29.user.js
// @updateURL https://update.greasyfork.org/scripts/542404/AtCoder%20Standings%20Enhancer%20%28v4%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const FAVORITE_USERS_KEY = 'atcoder_favorite_users_list_v4';

    // --- データ管理 ---
    const loadFavorites = () => new Set(JSON.parse(GM_getValue(FAVORITE_USERS_KEY, '[]')));
    const saveFavorites = (favorites) => GM_setValue(FAVORITE_USERS_KEY, JSON.stringify(Array.from(favorites)));

    const favoriteUsers = loadFavorites();

    /**
     * UI（フィルターコントロール）を作成・表示する関数
     */
    const createFilterUI = () => {
        if (document.getElementById('custom-filter-container')) return; // 既に存在すれば何もしない

        // AtCoderのVueアプリのコンテナを探す
        const vueContainer = document.getElementById('vue-standings');
        if (!vueContainer) return; // コンテナがなければ中断

        const controlDiv = document.createElement('div');
        controlDiv.id = 'custom-filter-container';
        controlDiv.style.cssText = `
            padding: 10px; margin-bottom: 15px; border: 1px solid #ddd;
            background-color: #f8f9fa; border-radius: 5px; display: flex;
            gap: 20px; align-items: center; flex-wrap: wrap;
        `;

        controlDiv.innerHTML = `
            <div style="display: flex; align-items: center;">
                <input type="checkbox" id="exclude-favorites-checkbox" style="margin-right: 8px; cursor: pointer;">
                <label for="exclude-favorites-checkbox" style="font-weight: normal; cursor: pointer; user-select: none;">印のついたユーザーを**除外**</label>
            </div>
            <div style="display: flex; align-items: center;">
                <input type="checkbox" id="show-only-favorites-checkbox" style="margin-right: 8px; cursor: pointer;">
                <label for="show-only-favorites-checkbox" style="font-weight: normal; cursor: pointer; user-select: none;">印のついたユーザー**のみ表示**</label>
            </div>
        `;

        // 順位表本体の前にUIを挿入
        vueContainer.parentNode.insertBefore(controlDiv, vueContainer);

        const excludeCheckbox = document.getElementById('exclude-favorites-checkbox');
        const showOnlyCheckbox = document.getElementById('show-only-favorites-checkbox');

        // 片方をチェックしたら、もう片方は外す（排他制御）
        excludeCheckbox.addEventListener('change', () => {
            if (excludeCheckbox.checked) showOnlyCheckbox.checked = false;
            applyFilters();
        });

        showOnlyCheckbox.addEventListener('change', () => {
            if (showOnlyCheckbox.checked) excludeCheckbox.checked = false;
            applyFilters();
        });
    };

    /**
     * 順位表の各行を処理して、★ボタンを追加・更新する関数
     */
    const processStandingsRows = () => {
        const standingsBody = document.querySelector('#vue-standings table.table tbody');
        if (!standingsBody) return;

        for (const row of standingsBody.rows) {
            const userLink = row.querySelector('td:nth-child(2) a.username');
            if (!userLink) continue;
            const userId = userLink.textContent;

            // ボタンがなければ作成
            if (!row.querySelector('.favorite-btn')) {
                const rankCell = row.cells[0];
                if (!rankCell) continue;

                const button = document.createElement('button');
                button.className = 'favorite-btn';
                button.style.cssText = `
                    margin-right: 6px; border: 1px solid #ccc; background: transparent;
                    border-radius: 50%; cursor: pointer; width: 24px; height: 24px;
                    line-height: 22px; padding: 0; font-size: 14px; transition: all 0.2s;
                    vertical-align: middle;
                `;
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    if (favoriteUsers.has(userId)) {
                        favoriteUsers.delete(userId);
                    } else {
                        favoriteUsers.add(userId);
                    }
                    saveFavorites(favoriteUsers);
                    updateRowState(row, userId); // クリックされた行の状態だけ即時更新
                    applyFilters(); // 全体のフィルターを再適用
                });
                rankCell.prepend(button);
            }
            // 各行の状態を更新
            updateRowState(row, userId);
        }
        applyFilters();
    };

    /**
     * 特定の行の★ボタンとデータ属性を更新する関数
     */
    const updateRowState = (row, userId) => {
        const button = row.querySelector('.favorite-btn');
        if (!button) return;

        const isFavorite = favoriteUsers.has(userId);
        row.dataset.isFavorite = isFavorite; // フィルター用の属性を設定

        if (isFavorite) {
            button.textContent = '★';
            button.style.color = 'gold';
            button.style.borderColor = 'orange';
        } else {
            button.textContent = '☆';
            button.style.color = '#ccc';
            button.style.borderColor = '#ccc';
        }
    };

    /**
     * 現在のフィルター設定に基づいて、順位表の表示を更新する関数
     */
    const applyFilters = () => {
        const standingsBody = document.querySelector('#vue-standings table.table tbody');
        if (!standingsBody) return;

        const excludeChecked = document.getElementById('exclude-favorites-checkbox')?.checked || false;
        const showOnlyChecked = document.getElementById('show-only-favorites-checkbox')?.checked || false;

        for (const row of standingsBody.rows) {
            const isFavorite = row.dataset.isFavorite === 'true';
            let shouldShow = true;

            if (excludeChecked && isFavorite) shouldShow = false;
            if (showOnlyChecked && !isFavorite) shouldShow = false;

            // AtCoder側のフィルター（例: Friends）による非表示を上書きしないように配慮
            if (row.style.display === 'none' && !shouldShow) {
                // 既に非表示で、かつスクリプトでも非表示にすべき場合は何もしない
            } else {
                row.style.display = shouldShow ? '' : 'none';
            }
        }
    };

    /**
     * メインの初期化処理
     */
    const initialize = () => {
        createFilterUI();
        processStandingsRows();

        // 順位表のtbodyが変更されたら（例: 自動更新）、再度行を処理する
        const standingsBody = document.querySelector('#vue-standings table.table tbody');
        if (standingsBody) {
            const observer = new MutationObserver(processStandingsRows);
            observer.observe(standingsBody, { childList: true });
        }
    };

    // AtCoderのVueアプリが順位表を描画するのを待つための処理
    const timer = setInterval(() => {
        // 順位表のテーブル本体が出現したら、初期化処理を実行
        if (document.querySelector('#vue-standings table.table tbody')) {
            clearInterval(timer); // タイマーを停止
            initialize();
        }
    }, 200); // 200ミリ秒ごとにチェック

})();