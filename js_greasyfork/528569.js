// ==UserScript==
// @name         過去のID記録
// @namespace    過去のID記録
// @version      2.3
// @description  過去のIDを記録。
// @match        https://hayabusa.open2ch.net/test/read.cgi/livejupiter/*
// @match        https://hayabusa.open2ch.net/test/history.cgi*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/528569/%E9%81%8E%E5%8E%BB%E3%81%AEID%E8%A8%98%E9%8C%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/528569/%E9%81%8E%E5%8E%BB%E3%81%AEID%E8%A8%98%E9%8C%B2.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* ---------------------------
       定数・ヘルパー関数
    ---------------------------- */
    const STORAGE_KEY = 'myIDs';
    const DISABLE_KEY = 'myIDs_disabled';

    function getStoredIDs() {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    function storeMyID(dateStr, idStr) {
        let records = getStoredIDs();
        if (records.find(r => r.date === dateStr)) return; 
        records.push({ date: dateStr, id: idStr });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }

    function clearStoredIDs() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function deleteRecord(targetDate, targetID) {
        let records = getStoredIDs();
        records = records.filter(r => !(r.date === targetDate && r.id === targetID));
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    }

    function isFunctionDisabled() {
        return localStorage.getItem(DISABLE_KEY) === 'true';
    }

    function setFunctionDisabled(flag) {
        localStorage.setItem(DISABLE_KEY, flag ? 'true' : 'false');
    }

    function getTodayISO() {
        const now = new Date();
        const y = now.getFullYear();
        const m = ('0' + (now.getMonth()+1)).slice(-2);
        const d = ('0' + now.getDate()).slice(-2);
        return `${y}-${m}-${d}`;
    }

    function formatDisplayDate(isoDateStr) {
        const [year, month, day] = isoDateStr.split('-');
        const yy = year.slice(-2);
        const dateObj = new Date(isoDateStr);
        const wd = dateObj.getDay();
        const wdStr = ['日','月','火','水','木','金','土'][wd];
        return `${yy}/${month}/${day}(${wdStr})`.replace(/^・+/, '');
    }

    const todayISO = getTodayISO();
    const todayDisplay = formatDisplayDate(todayISO);

    function isTodayRecorded() {
        const records = getStoredIDs();
        return records.some(r => r.date === todayISO);
    }

    /* ---------------------------
       スレページ内処理
    ---------------------------- */
    function initThreadPage() {
        function processPosts(root = document) {
            if (isFunctionDisabled()) return;  // 機能OFF中は何もしない
            const posts = root.querySelectorAll('li[val]');
            posts.forEach(post => {
                const dt = post.querySelector('dt');
                if (!dt) return;
                const text = dt.textContent;
                const dateMatch = text.match(/(\d{2}\/\d{2}\/\d{2}\([^)]*\))/);
                if (!dateMatch) return;
                const postDateDisplay = dateMatch[1];
                if (postDateDisplay !== todayDisplay) return;
                if (isTodayRecorded()) return;
                if (post.querySelector('.meButton')) return;
                const idSpan = dt.querySelector('span._id');
                if (!idSpan) return;
                const idStr = idSpan.textContent.trim();
                if (!idStr) return;
                const meBtn = document.createElement('button');
                meBtn.textContent = 'Me';
                meBtn.className = 'meButton';
                meBtn.style.marginLeft = '5px';
                meBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    storeMyID(todayISO, idStr);
                    removeAllMeButtons();
                });
                const searchBtn = dt.querySelector('button.searchButton');
                if (searchBtn) {
                    searchBtn.insertAdjacentElement('afterend', meBtn);
                } else {
                    dt.appendChild(meBtn);
                }
            });
        }

        function removeAllMeButtons() {
            document.querySelectorAll('.meButton').forEach(btn => btn.remove());
        }

        processPosts();

        const postBtn = document.getElementById('resSubmit');
        if (postBtn) {
            postBtn.addEventListener('click', function() {
                setTimeout(() => {
                    processPosts();
                }, 500);
            });
        }

        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        processPosts(node);
                    }
                });
            });
        });
        observer.observe(document.body, {childList: true, subtree: true});
    }

    /* ---------------------------
       履歴ページ内処理
    ---------------------------- */
    function initHistoryPage() {
        const menuDiv = document.querySelector('div.menu');
        if (!menuDiv) return;
        // 重複追加防止
        if (menuDiv.querySelector('a.historyButton')) return;
        const historyBtn = document.createElement('a');
        historyBtn.href = "#";
        historyBtn.textContent = '過去ID';
        historyBtn.style.marginLeft = '10px';
        historyBtn.className = 'historyButton';
        historyBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleHistoryBox(false);  // 通常モードで表示
        });
        menuDiv.appendChild(historyBtn);
    }

    // deleteMode が true のときは各レコードに削除用のバツボタンを表示
    function toggleHistoryBox(deleteMode = false) {
        const existing = document.getElementById('idHistoryBox');
        if (existing) {
            existing.remove();
            return;
        }
        showHistoryBox(deleteMode);
    }

    function showHistoryBox(deleteMode = false) {
        const records = getStoredIDs();
        records.sort((a, b) => (a.date < b.date ? 1 : -1));
        const box = document.createElement('div');
        box.id = 'idHistoryBox';
        box.style.position = 'fixed';
        box.style.top = '20%';
        box.style.left = '40%';
        box.style.transform = 'translateX(-50%)';
        box.style.background = 'rgba(0, 0, 0, 0.8)';
        box.style.color = 'white';
        box.style.borderRadius = '10px';
        box.style.padding = '10px';
        box.style.zIndex = '10000';
        box.style.maxHeight = '70%';
        box.style.overflowY = 'auto';
        box.style.minWidth = '200px';

        // ヘッダー：タイトルと右横の「設定」ボタンをflexで配置
        const headerDiv = document.createElement('div');
        headerDiv.style.display = 'flex';
        headerDiv.style.justifyContent = 'space-between';
        headerDiv.style.alignItems = 'center';
        // タイトル
        const title = document.createElement('h3');
        title.textContent = '過去ID';
        title.style.textAlign = 'center';
        title.style.margin = '0';
        headerDiv.appendChild(title);
        // 設定ボタン
        const settingsBtn = document.createElement('button');
        settingsBtn.textContent = '設定';
        settingsBtn.style.marginLeft = '10px';
        settingsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            showSettingsPopup();
        });
        headerDiv.appendChild(settingsBtn);
        box.appendChild(headerDiv);

        // レコードリスト
        records.forEach((rec, index) => {
            const recDiv = document.createElement('div');
            recDiv.style.textAlign = 'left';
            recDiv.style.display = 'flex';
            recDiv.style.alignItems = 'center';
            recDiv.style.justifyContent = 'flex-start';
            if (index !== 0) {
                recDiv.style.borderTop = '1px solid rgba(255,255,255,0.3)';
                recDiv.style.paddingTop = '5px';
                recDiv.style.marginTop = '5px';
            }
            // 削除モードの場合、左側に白いバツボタンを配置
            if (deleteMode) {
                const delBtn = document.createElement('button');
                delBtn.textContent = 'Ｘ';
                delBtn.style.color = 'red';
                delBtn.style.fontSize = '16px';
                delBtn.style.fontWeight = 'bold';
                delBtn.style.background = 'transparent';
                delBtn.style.border = 'none';
                delBtn.style.cursor = 'pointer';
                delBtn.style.marginRight = '1ch';
                delBtn.addEventListener('click', function(e) {
                    e.preventDefault();
                    if (confirm(`「${formatDisplayDate(rec.date)}：${rec.id}」を削除しますか？`)) {
                        deleteRecord(rec.date, rec.id);
                        alert('該当の記録を削除しました。');
                        // 再描画
                        box.remove();
                        showHistoryBox(true);
                    }
                });
                recDiv.appendChild(delBtn);
            }
            // 日付部分
            const dateSpan = document.createElement('span');
            dateSpan.textContent = formatDisplayDate(rec.date) + '：';
            recDiv.appendChild(dateSpan);
            // IDリンク部分
            const idLink = document.createElement('a');
            idLink.textContent = rec.id;
            idLink.href = 'https://find.open2ch.net/?bbs=livejupiter&t=f&q=' + encodeURIComponent(rec.id);
            idLink.style.color = 'white';
            idLink.style.textDecoration = 'none';
            idLink.style.borderBottom = '1px solid white';
            idLink.style.marginLeft = '5px';
            idLink.addEventListener('mouseover', () => {
                idLink.style.borderBottomWidth = '2px';
            });
            idLink.addEventListener('mouseout', () => {
                idLink.style.borderBottomWidth = '1px';
            });
            recDiv.appendChild(idLink);
            // 新規マーク（当日の場合）はIDの右横に1ch分のスペースを空けて配置（削除モードでも表示）
            if (rec.date === todayISO) {
                const newMark = document.createElement('span');
                newMark.textContent = '🆕';
                newMark.style.marginLeft = '1ch';
                recDiv.appendChild(newMark);
            }
            box.appendChild(recDiv);
        });

        document.body.appendChild(box);
    }

    /* ---------------------------
       設定画面
    ---------------------------- */
    function showSettingsPopup() {
        // すでに存在していれば削除
        const existing = document.getElementById('idSettingsBox');
        if (existing) { existing.remove(); return; }
        const settingsBox = document.createElement('div');
        settingsBox.id = 'idSettingsBox';
        settingsBox.style.position = 'fixed';
        settingsBox.style.top = '20%';
        settingsBox.style.left = '85%';
        settingsBox.style.transform = 'translateX(-50%)';
        settingsBox.style.background = 'rgba(0, 0, 0, 0.8)';
        settingsBox.style.color = 'white';
        settingsBox.style.borderRadius = '10px';
        settingsBox.style.padding = '15px';
        settingsBox.style.zIndex = '11000';
        settingsBox.style.minWidth = '70px';

        // CSV出力ボタン
        const csvBtn = document.createElement('button');
        csvBtn.textContent = 'CSV出力';
        csvBtn.style.display = 'block';
        csvBtn.style.margin = '5px auto';
        csvBtn.addEventListener('click', function() {
            exportCSV();
        });
        settingsBox.appendChild(csvBtn);

        // ID記録削除ボタン（確認付き）
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'ID全削除';
        deleteBtn.style.display = 'block';
        deleteBtn.style.margin = '5px auto';
        deleteBtn.addEventListener('click', function() {
            if (confirm('すべてのID記録を削除しますか？')) {
                clearStoredIDs();
                alert('ID記録を削除しました。');
            }
        });
        settingsBox.appendChild(deleteBtn);

        // 「選択して削除」ボタン
        const selectDeleteBtn = document.createElement('button');
        selectDeleteBtn.textContent = '選択して削除';
        selectDeleteBtn.style.display = 'block';
        selectDeleteBtn.style.margin = '5px auto';
        selectDeleteBtn.addEventListener('click', function() {
            // 設定画面を閉じ、削除モードで過去IDボックスを再表示
            settingsBox.remove();
            toggleHistoryBox(); // 既に開いている場合は閉じる
            setTimeout(() => { toggleHistoryBox(true); }, 100);
        });
        settingsBox.appendChild(selectDeleteBtn);

        // 機能ON/OFFボタン（状態表示：「現在:ON」または「現在:OFF」）
        const toggleBtn = document.createElement('button');
        updateToggleButtonText(toggleBtn);
        toggleBtn.style.display = 'block';
        toggleBtn.style.margin = '5px auto';
        toggleBtn.addEventListener('click', function() {
            const disabled = isFunctionDisabled();
            setFunctionDisabled(!disabled);
            updateToggleButtonText(toggleBtn);
            // 機能OFFになった場合は既存のMeボタンを削除
            if (isFunctionDisabled()) {
                document.querySelectorAll('.meButton').forEach(btn => btn.remove());
            }
        });
        settingsBox.appendChild(toggleBtn);

        // 設定終了ボタン
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '設定終了';
        closeBtn.style.display = 'block';
        closeBtn.style.margin = '5px auto';
        closeBtn.addEventListener('click', function() {
            settingsBox.remove();
        });
        settingsBox.appendChild(closeBtn);

        document.body.appendChild(settingsBox);
    }

    function updateToggleButtonText(btn) {
        // 現在の状態を「現在:ON」または「現在:OFF」と表示する
        if (isFunctionDisabled()) {
            btn.textContent = '現在:OFF';
        } else {
            btn.textContent = '現在:ON';
        }
    }

    function exportCSV() {
        const records = getStoredIDs();
        let csvContent = '日付,ID\n';
        records.forEach(rec => {
            csvContent += `${formatDisplayDate(rec.date)},${rec.id}\n`;
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'id_records.csv';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    /* ---------------------------
       初期処理：URLに応じた処理分岐
    ---------------------------- */
    const url = window.location.href;
    if (url.includes('/read.cgi/livejupiter/')) {
        initThreadPage();
    } else if (url.includes('/history.cgi')) {
        initHistoryPage();
    }
})();