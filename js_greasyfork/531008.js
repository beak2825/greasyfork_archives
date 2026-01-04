// ==UserScript==
// @name         Gジェネエターナル事前ガチャMSリストソート & 表示切り替え
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  ul.msList 内で data-title が同じ li について、r/sr/ssr の内容を r not/sr not/ssr not にコピーし、元の r/sr/ssr を削除。表示切替ボタンも表示。
// @author       Kebity
// @match        https://pre-gasha-gget.ggame.jp/cards*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531008/G%E3%82%B8%E3%82%A7%E3%83%8D%E3%82%A8%E3%82%BF%E3%83%BC%E3%83%8A%E3%83%AB%E4%BA%8B%E5%89%8D%E3%82%AC%E3%83%81%E3%83%A3MS%E3%83%AA%E3%82%B9%E3%83%88%E3%82%BD%E3%83%BC%E3%83%88%20%20%E8%A1%A8%E7%A4%BA%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.user.js
// @updateURL https://update.greasyfork.org/scripts/531008/G%E3%82%B8%E3%82%A7%E3%83%8D%E3%82%A8%E3%82%BF%E3%83%BC%E3%83%8A%E3%83%AB%E4%BA%8B%E5%89%8D%E3%82%AC%E3%83%81%E3%83%A3MS%E3%83%AA%E3%82%B9%E3%83%88%E3%82%BD%E3%83%BC%E3%83%88%20%20%E8%A1%A8%E7%A4%BA%E5%88%87%E3%82%8A%E6%9B%BF%E3%81%88.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // --- 設定 ---
    const BUTTON_TEXT_SHOW = '全部表示';
    const BUTTON_TEXT_HIDE = '元に戻す';
    const DEBOUNCE_DELAY = 200; // 変更検出から処理実行までの待機時間(ms)
    // -------------

    // --- 並び替え処理本体 (変更なし) ---
    function sortMsList() {
        const msList = document.querySelector('ul.msList');
        if (!msList) { /* console.warn('ソート処理: ul.msList が見つかりません。'); */ return; }
        // console.log('ソート処理: 開始...');
        const allItems = Array.from(msList.children);
        const dataItems = allItems.filter(li => li.dataset.title);
        const otherItems = allItems.filter(li => !li.dataset.title);
        if (dataItems.length === 0) { /* console.log('ソート処理: ソート対象なし。'); */ return; }
        const titleOrderMap = new Map();
        let currentTitleIndex = 0;
        allItems.forEach(li => {
             if (li.dataset.title && !titleOrderMap.has(li.dataset.title)) {
                titleOrderMap.set(li.dataset.title, currentTitleIndex++);
             }
        });
        const rarityOrder = { 'r': 0, 'r not': 1, 'sr': 2, 'sr not': 3, 'ssr': 4, 'ssr not': 5 };
        const MAX_RARITY_ORDER = 99;
        function getRarityClass(li) {
            for (const cls of ['ssr not', 'ssr', 'sr not', 'sr', 'r not', 'r']) {
                if (li.classList.contains(cls)) return cls;
            } return null;
        }
        dataItems.sort((a, b) => {
            const titleA = a.dataset.title, titleB = b.dataset.title;
            const rarityClassA = getRarityClass(a), rarityClassB = getRarityClass(b);
            const titleOrderA = titleOrderMap.get(titleA) ?? 0, titleOrderB = titleOrderMap.get(titleB) ?? 0;
            const rarityOrderAVal = (rarityClassA && rarityClassA in rarityOrder) ? rarityOrder[rarityClassA] : MAX_RARITY_ORDER;
            const rarityOrderBVal = (rarityClassB && rarityClassB in rarityOrder) ? rarityOrder[rarityClassB] : MAX_RARITY_ORDER;
            if (titleOrderA !== titleOrderB) return titleOrderA - titleOrderB;
            return rarityOrderAVal - rarityOrderBVal;
        });
        const notesSetItem = otherItems.find(li => li.classList.contains('notesSet'));
        const notesItem = otherItems.find(li => li.classList.contains('notes') && !li.classList.contains('notesSet'));
        allItems.forEach(li => li.remove());
        if (notesSetItem) msList.appendChild(notesSetItem);
        dataItems.forEach(li => msList.appendChild(li));
        if (notesItem) msList.appendChild(notesItem);
        otherItems.forEach(li => { if (li !== notesSetItem && li !== notesItem) msList.appendChild(li); });
        console.log('ソート処理: MSリストをソートしました。'); //完了ログ
    }

    // --- ボタン追加処理 (変更なし、IDチェック追加) ---
    function setupShowAllButton() {
        const section = document.querySelector('section#msCol');
        const label = section?.querySelector('label.boxSelect');
        const heading = section?.querySelector('h2.titL3.title');
        if (!section || !label || !heading) { /* console.warn('表示ボタン: 挿入位置要素なし。'); */ return; }
        const msListForButton = document.querySelector('ul.msList');
        if (!msListForButton) { /* console.warn('表示ボタン: ul.msList なし。'); */ return; }
        if (document.getElementById('toggleMsListVisibilityButton')) return; // 既にボタンがあれば何もしない
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggleMsListVisibilityButton';
        toggleButton.textContent = BUTTON_TEXT_SHOW;
        toggleButton.dataset.state = 'hidden';
        // --- Style button ---
        toggleButton.style.display = 'block'; toggleButton.style.width = '100%'; toggleButton.style.padding = '10px 5px';
        toggleButton.style.marginTop = '10px'; toggleButton.style.marginBottom = '10px'; toggleButton.style.backgroundColor = '#a0c4e4';
        toggleButton.style.color = '#333'; toggleButton.style.border = '1px solid #88aacc'; toggleButton.style.borderRadius = '4px';
        toggleButton.style.textAlign = 'center'; toggleButton.style.fontSize = '1em'; toggleButton.style.fontWeight = 'bold';
        toggleButton.style.cursor = 'pointer'; toggleButton.style.boxSizing = 'border-box';
        // --- Insert button ---
        section.insertBefore(toggleButton, heading);
        heading.style.display = 'none';

        console.log('表示ボタン: ボタンを追加しました。');
        // --- Add listener ---
        toggleButton.addEventListener('click', function() {
             const currentListItems = msListForButton.querySelectorAll('li');
             const notesSetLi = msListForButton.querySelector('li.notesSet');
             if (toggleButton.dataset.state === 'hidden') {
                 currentListItems.forEach((li) => { if (!li.classList.contains('notesSet')) li.style.display = 'list-item'; });
                 if (notesSetLi) notesSetLi.style.display = 'none';
                 toggleButton.textContent = BUTTON_TEXT_HIDE; toggleButton.dataset.state = 'shown';
             } else {
                 currentListItems.forEach(li => { if (!li.classList.contains('notesSet')) li.style.display = 'none'; });
                 if (notesSetLi) notesSetLi.style.display = 'none';
                 toggleButton.textContent = BUTTON_TEXT_SHOW; toggleButton.dataset.state = 'hidden';
             }
         });
    }

    // --- MutationObserver 設定 ---
    const targetList = document.querySelector('ul.msList');

    if (targetList) {
        let debounceTimer = null;

        // 監視設定 (関数外で定義)
        const config = { childList: true, subtree: false };

        // コールバック関数: 変更検出時に debounce 処理を開始
        const observerCallback = (mutationsList, observer) => { // observer自身を引数で受け取る
            let listStructureChanged = false;
            for (const mutation of mutationsList) {
                if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                    listStructureChanged = true;
                    break;
                }
            }

            if (listStructureChanged) {
                clearTimeout(debounceTimer); // 既存のタイマーをクリア
                debounceTimer = setTimeout(() => {
                    console.log(`MutationObserver: ${DEBOUNCE_DELAY}ms 待機後処理実行`);
                    // --- ここで監視を一時停止 ---
                    observer.disconnect();
                    console.log("MutationObserver: 監視を一時停止");

                    try {
                        // --- DOM操作を実行 ---
                        sortMsList();
                        setupShowAllButton(); // ボタンの状態も確認・更新
                    } catch (error) {
                        console.error("ソート/ボタン設定中にエラー:", error);
                    } finally {
                        // --- ここで監視を再開 ---
                        // targetListがまだDOMに存在するか確認してから再開
                        if (document.body.contains(targetList)) {
                             observer.observe(targetList, config); // 同じ設定で監視を再開
                             console.log("MutationObserver: 監視を再開");
                        } else {
                             console.warn("MutationObserver: 監視対象リストがDOMから削除されたため、監視を再開できません。");
                        }
                    }
                }, DEBOUNCE_DELAY);
            }
        };

        // オブザーバーインスタンスを作成
        const observer = new MutationObserver(observerCallback);

        // 初回実行 (監視開始前、または監視開始直後に行う)
        // 初回も同様に disconnect/reconnect パターンを使うとより安全
        console.log('初回処理: 実行中...');
        try {
            // 初回実行前にdisconnectは不要だが、念のため実行しても害はない
            // observer.disconnect(); // まだobserveしてないので不要
            sortMsList();
            setupShowAllButton();
        } catch(e) {
             console.error("初回処理中にエラー:", e);
        } finally {
             // 初回処理後、監視を開始
             observer.observe(targetList, config);
             console.log('MutationObserver: ul.msList の監視を開始しました。');
        }

    } else {
        console.warn('初期化: 監視対象の ul.msList が見つかりませんでした。');
    }

})();