// ==UserScript==
// @name         LINE Chat Biz Note Enhancement
// @namespace    http://tampermonkey.net/
// @version      1.5 // バージョンを更新
// @description  Adds a note-taking feature to LINE Chat Biz, storing data in Google Sheets, with ChatID, auto-header, caching, and icon fix.
// @author       Your Name
// @match        https://chat.line.biz/Uf378f152231ee8a49e74d2b852873c20/chat/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      script.google.com
// @connect      script.googleusercontent.com
// @downloadURL https://update.greasyfork.org/scripts/538522/LINE%20Chat%20Biz%20Note%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/538522/LINE%20Chat%20Biz%20Note%20Enhancement.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ★★★ あなたのGASウェブアプリURLに置き換えてください ★★★
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbySHDOYFuf5vb2J2MN8Zg5z5TOblsWEqgw0BO17FGdngTUyKDjMDJrR71GzX-sOa2Y/exec';
    const MAX_NOTES = 50;
    const NOTE_CONTENT_MAX_LENGTH = 3000;
    const DEBUG_PASSWORD = '1622'; // デバッグモードのパスワード
    const SHOW_DEBUG_BUTTON = false; // デバッグ設定ボタンの表示/非表示 (trueで表示, falseで非表示)

    let currentNotes = [];
    let noteContainerGlobal = null;
    let currentChatId = null; // 現在のチャットIDを保持
    let isDebugMode = false; // デバッグモードの状態

    // --- スタイル定義 ---
    GM_addStyle(`
        #custom-note-section {
            padding: 10px;
            font-family: "Hiragino Kaku Gothic ProN", "Meiryo", sans-serif;
        }
        .cn-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
            padding-bottom: 10px;
            border-bottom: 1px solid #eee;
        }
        .cn-note-count {
            font-size: 1.1em;
            font-weight: bold;
            color: #333;
        }
        .cn-add-note-btn {
            padding: 8px 15px;
            background-color: #00B900; /* LINEグリーン風 */
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9em;
            display: flex;
            align-items: center;
        }
        .cn-add-note-btn:hover {
            background-color: #00A300;
        }
        .cn-add-note-btn i.las.la-plus {
            margin-right: 5px;
            font-size: 1.1em;
        }
        .cn-settings-btn {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            font-size: 1.5em;
            margin-left: 10px;
        }
        .cn-settings-btn:hover {
            color: #333;
        }
        .cn-note-list {
            max-height: 60vh;
            overflow-y: auto;
        }
        .cn-note-item {
            background-color: #f9f9f9;
            border: 1px solid #e0e0e0;
            border-radius: 5px;
            padding: 12px;
            margin-bottom: 10px;
            box-shadow: 0 1px 3px rgba(0,0,0,0.05);
        }
        .cn-note-content {
            margin-bottom: 8px;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 0.95em;
            line-height: 1.6;
        }
        .cn-note-content a {
            color: #007bff;
            text-decoration: underline;
        }
        .cn-note-meta {
            font-size: 0.8em;
            color: #777;
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .cn-note-actions button {
            background: none;
            border: none;
            color: #555;
            cursor: pointer;
            margin-left: 10px;
            font-size: 1.2em;
            padding: 2px 4px;
        }
        .cn-note-actions button:hover {
            color: #000;
        }
        .cn-empty-notes {
            text-align: center;
            color: #888;
            padding: 20px;
            font-size: 0.9em;
        }
        .cn-modal {
            position: fixed;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        }
        .cn-modal-content {
            background-color: white;
            padding: 25px;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        .cn-modal-header {
            font-size: 1.3em;
            font-weight: bold;
            margin-bottom: 15px;
            color: #333;
        }
        .cn-modal-body textarea {
            width: calc(100% - 0px);
            min-height: 150px;
            padding: 10px;
            border: 1px solid #ccc;
            border-radius: 4px;
            font-size: 0.95em;
            margin-bottom: 10px;
            resize: vertical;
        }
        .cn-char-counter {
            font-size: 0.8em;
            color: #666;
            text-align: right;
            margin-bottom: 15px;
        }
        .cn-modal-footer {
            text-align: right;
        }
        .cn-modal-footer button {
            padding: 10px 18px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 0.9em;
            margin-left: 10px;
        }
        .cn-modal-save-btn {
            background-color: #00B900;
            color: white;
        }
        .cn-modal-save-btn:hover {
            background-color: #00A300;
        }
        .cn-modal-cancel-btn {
            background-color: #f0f0f0;
            color: #333;
        }
        .cn-modal-cancel-btn:hover {
            background-color: #e0e0e0;
        }
        /* デバッグ設定モーダルのスタイル */
        .cn-debug-modal-content {
            background-color: white;
            padding: 25px;
            border-radius: 8px;
            width: 90%;
            max-width: 400px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            gap: 10px; /* ボタン間のスペース */
            text-align: center; /* モーダル内のテキストを中央揃え */
        }
        .cn-debug-modal-content .cn-modal-header {
            text-align: center; /* ヘッダーテキストを中央揃え */
            margin-bottom: 10px; /* ヘッダー下部のマージンを調整 */
        }
        .cn-debug-modal-content .cn-modal-body p {
            margin-bottom: 15px;
            font-size: 0.9em;
            color: #555;
            text-align: center; /* 段落テキストを中央揃え */
        }
        .cn-debug-modal-content button {
            width: 100% !important; /* ボタンの幅を100%に、!importantで強制 */
            padding: 10px !important;
            border: 1px solid #ccc !important;
            border-radius: 5px !important;
            background-color: #f0f0f0 !important;
            color: #333 !important; /* デフォルトボタンの文字色を明確に設定 */
            cursor: pointer !important;
            font-size: 1em !important;
            transition: background-color 0.2s ease !important;
            box-sizing: border-box !important; /* paddingとborderをwidthに含める */
            margin-bottom: 10px !important; /* 縦マージンを強制 */
        }
        .cn-debug-modal-content button:last-child {
            margin-bottom: 0px !important; /* 最後のボタンの下マージンは不要 */
        }
        .cn-debug-modal-content button:hover {
            background-color: #e0e0e0 !important;
        }
        .cn-debug-modal-content .cn-danger-btn {
            background-color: #dc3545 !important;
            color: white !important;
            border-color: #dc3545 !important;
        }
        .cn-debug-modal-content .cn-danger-btn:hover {
            background-color: #c82333 !important;
        }
        .cn-debug-modal-content input[type="password"] {
            width: 100% !important; /* 幅を100%に設定、!importantで強制 */
            padding: 10px !important;
            margin-bottom: 15px !important;
            border: 1px solid #ccc !important;
            border-radius: 4px !important;
            box-sizing: border-box !important; /* パディングとボーダーをwidthに含める */
        }
        .cn-header-buttons {
            display: flex;
            align-items: center;
        }
        .cn-modal-footer {
            text-align: center; /* フッターボタンを中央揃え */
            margin-top: 15px; /* フッターの上部にマージンを追加 */
            display: flex; /* ボタンを横並びにするためにflexboxを使用 */
            justify-content: center; /* ボタンを中央に配置 */
            gap: 10px; /* ボタン間の間隔 */
        }
        .cn-modal-footer button {
            /* margin-left, margin-right を削除し、gap で間隔を管理 */
            width: auto !important; /* ボタンの幅を自動に */
            display: inline-block !important; /* flexアイテムとして機能させるため */
            margin-bottom: 0 !important; /* フッター内のボタンには不要なマージンを削除 */
        }
        /* ローディングスピナーのスタイル */
        .cn-loading-spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #00B900; /* LINEグリーン風 */
            border-radius: 50%;
            width: 30px;
            height: 30px;
            animation: spin 1s linear infinite;
            margin: 20px auto;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    `);

    // --- Helper Functions ---
    function showLoading(container) {
        container.innerHTML = `<div class="cn-loading-spinner"></div>`;
    }
    function linkify(text) {
        const safeText = String(text); // textが確実に文字列であることを保証する
        const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
        return safeText.replace(urlRegex, url => `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>`);
    }
    function formatDate(isoString) {
        if (!isoString) return '日付不明';
        try {
            const date = new Date(isoString);
            return date.toLocaleString('ja-JP', { year: 'numeric', month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        } catch (e) { return isoString; }
    }
    // カスタムアラート/コンファーム代替
    function showCustomAlert(message, callback = null) {
        const existingModal = document.querySelector('.cn-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'cn-modal';
        modal.innerHTML = `
            <div class="cn-modal-content">
                <div class="cn-modal-header">通知</div>
                <div class="cn-modal-body" style="white-space: pre-wrap;">${message}</div>
                <div class="cn-modal-footer">
                    <button id="cn-alert-ok-btn" class="cn-modal-save-btn">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('cn-alert-ok-btn').onclick = () => {
            modal.remove();
            if (callback) callback();
        };
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    function showCustomConfirm(message, onConfirm, onCancel = null) {
        const existingModal = document.querySelector('.cn-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'cn-modal';
        modal.innerHTML = `
            <div class="cn-modal-content">
                <div class="cn-modal-header">確認</div>
                <div class="cn-modal-body" style="white-space: pre-wrap;">${message}</div>
                <div class="cn-modal-footer">
                    <button id="cn-confirm-cancel-btn" class="cn-modal-cancel-btn">キャンセル</button>
                    <button id="cn-confirm-ok-btn" class="cn-modal-save-btn">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
        document.getElementById('cn-confirm-ok-btn').onclick = () => {
            modal.remove();
            if (onConfirm) onConfirm();
        };
        document.getElementById('cn-confirm-cancel-btn').onclick = () => {
            modal.remove();
            if (onCancel) onCancel();
        };
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }

    // --- ChatID Extractor ---
    function extractChatIdFromUrl() {
        const match = window.location.pathname.match(/\/chat\/([a-zA-Z0-9]+)/);
        if (match && match[1]) {
            return match[1];
        }
        console.warn("Note Enhancement: Could not extract ChatID from URL.", window.location.pathname);
        return null;
    }

    // --- Modal (変更なし) ---
    let currentEditingNoteId = null;
    function openNoteModal(note = null) {
        if (!currentChatId) {
            showCustomAlert("チャットIDが取得できませんでした。ページをリロードしてみてください。");
            return;
        }
        currentEditingNoteId = note ? note.id : null;
        const isEditing = !!note;

        const existingModal = document.querySelector('.cn-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'cn-modal';
        modal.innerHTML = `
            <div class="cn-modal-content">
                <div class="cn-modal-header">${isEditing ? 'ノートを編集' : 'ノートを追加'}</div>
                <div class="cn-modal-body">
                    <textarea id="cn-note-textarea" placeholder="ノート内容を入力">${isEditing ? note.content : ''}</textarea>
                    <div id="cn-char-counter" class="cn-char-counter">0/${NOTE_CONTENT_MAX_LENGTH}</div>
                </div>
                <div class="cn-modal-footer">
                    <button id="cn-modal-cancel-btn" class="cn-modal-cancel-btn">キャンセル</button>
                    <button id="cn-modal-save-btn" class="cn-modal-save-btn">保存</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const textarea = document.getElementById('cn-note-textarea');
        const charCounter = document.getElementById('cn-char-counter');
        textarea.maxLength = NOTE_CONTENT_MAX_LENGTH;

        function updateCounter() {
            charCounter.textContent = `${textarea.value.length}/${NOTE_CONTENT_MAX_LENGTH}`;
        }
        textarea.addEventListener('input', updateCounter);
        updateCounter();

        document.getElementById('cn-modal-save-btn').onclick = () => {
            const content = textarea.value.trim();
            if (!content && !isEditing) {
                showCustomAlert('ノート内容を入力してください。');
                return;
            }
            if (content.length > NOTE_CONTENT_MAX_LENGTH) {
                showCustomAlert(`ノート内容は${NOTE_CONTENT_MAX_LENGTH}文字以内で入力してください。`);
                return;
            }
            if (isEditing) {
                saveEditedNote(currentEditingNoteId, content);
            } else {
                saveNewNote(content);
            }
            closeNoteModal();
        };
        document.getElementById('cn-modal-cancel-btn').onclick = closeNoteModal;
        modal.onclick = (e) => { if (e.target === modal) closeNoteModal(); };
        textarea.focus();
    }
    function closeNoteModal() {
        const modal = document.querySelector('.cn-modal');
        if (modal) modal.remove();
        currentEditingNoteId = null;
    }

    // --- API Calls (Google Apps Script) ---
    function callGas(action, payload, callback) {
        if (!GAS_WEB_APP_URL || GAS_WEB_APP_URL === 'YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL') {
            showCustomAlert('Google Apps ScriptのウェブアプリURLが設定されていません。スクリプトを編集してください。');
            console.error('GAS_WEB_APP_URL is not set.');
            if (callback) callback({ success: false, message: 'GAS URL not set' });
            return;
        }
        // clear_all_notes 以外のアクションでは chatId が必要
        if (!currentChatId && (action !== "clear_all_notes" && action !== "force_delete_invalid_notes")) { // force_delete_invalid_notes も chatId が必要
            showCustomAlert("チャットIDが不明なため、操作を続行できません。");
            console.error("currentChatId is null for GAS call action:", action);
            if (callback) callback({ success: false, message: 'ChatID not available' });
            return;
        }

        const requestPayload = { action, chatId: currentChatId, ...payload };

        GM_xmlhttpRequest({
            method: 'POST', // doGetもPOSTでラップしてchatIdを確実に渡す or doGetのURLにchatIdを付加
            url: GAS_WEB_APP_URL,
            data: JSON.stringify(requestPayload),
            headers: { 'Content-Type': 'application/json' },
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (callback) callback(result);
                } catch (e) {
                    console.error('Error parsing GAS response:', e, response.responseText);
                    if (callback) callback({ success: false, message: 'Failed to parse response from server.' });
                }
            },
            onerror: function(response) {
                console.error('Error calling GAS:', response);
                if (callback) callback({ success: false, message: 'Network error or server error.' });
                showCustomAlert(`エラーが発生しました: ${response.statusText || 'サーバー接続失敗'}`);
            }
        });
    }

    // fetchNotes関数を修正: GASから返されたノートに無効なIDが含まれていないかチェック
    function fetchNotes() {
        if (!noteContainerGlobal) return;
        if (!currentChatId) {
            console.warn("fetchNotes called without currentChatId.");
            return;
        }
        const noteListContainer = noteContainerGlobal.querySelector('.cn-note-list');
        if (noteListContainer) showLoading(noteListContainer);

        GM_xmlhttpRequest({
            method: 'GET',
            url: `${GAS_WEB_APP_URL}?chatId=${encodeURIComponent(currentChatId)}`,
            onload: function(response) {
                try {
                    const result = JSON.parse(response.responseText);
                    if (result.success) {
                        // 無効なNote IDをフィルタリングする
                        currentNotes = (result.notes || []).filter(note => {
                            // Note IDがUUID形式（36文字）であることをざっくりチェック
                            // 正規表現でUUID形式を厳密にチェックすることも可能だが、ここでは単純な文字列長と型チェックに留める
                            const isValidId = typeof note.id === 'string' && note.id.length === 36;
                            if (!isValidId) {
                                console.warn(`Invalid Note ID found: ${note.id}. This note will be excluded from display.`);
                            }
                            return isValidId;
                        });
                        renderNotes();
                    } else {
                        showCustomAlert('ノートの読み込みに失敗しました: ' + (result.message || '不明なエラー'));
                        if (noteListContainer) noteListContainer.innerHTML = `<div class="cn-empty-notes">ノートの読み込みに失敗しました。</div>`;
                    }
                } catch (e) {
                    console.error('Error parsing notes:', e, response.responseText);
                    showCustomAlert('ノートデータの解析に失敗しました。');
                    if (noteListContainer) noteListContainer.innerHTML = `<div class="cn-empty-notes">ノートデータの形式が不正です。</div>`;
                }
            },
            onerror: function(response) {
                console.error('Error fetching notes:', response);
                showCustomAlert('ノートの読み込み中にエラーが発生しました。');
                if (noteListContainer) noteListContainer.innerHTML = `<div class="cn-empty-notes">サーバーとの通信に失敗しました。</div>`;
            }
        });
    }

    function saveNewNote(content) {
        if (currentNotes.length >= MAX_NOTES) {
            showCustomAlert(`ノートは最大${MAX_NOTES}件まで作成できます。`);
            return;
        }
        showLoading(noteContainerGlobal.querySelector('.cn-note-list'));
        callGas('add', { content }, (result) => { // chatIdはcallGas内で自動的に付加される
            if (result.success) {
                fetchNotes();
            } else {
                showCustomAlert('ノートの追加に失敗しました: ' + (result.message || '不明なエラー'));
                renderNotes();
            }
        });
    }

    function saveEditedNote(noteId, content) {
        showLoading(noteContainerGlobal.querySelector('.cn-note-list'));
        callGas('edit', { id: noteId, content }, (result) => { // chatIdはcallGas内で自動的に付加される
            if (result.success) {
                fetchNotes();
            } else {
                showCustomAlert('ノートの編集に失敗しました: ' + (result.message || '不明なエラー'));
                renderNotes();
            }
        });
    }

    function deleteNoteById(noteId) {
        showCustomConfirm('このノートを削除してもよろしいですか？', () => {
            showLoading(noteContainerGlobal.querySelector('.cn-note-list'));
            callGas('delete', { id: noteId }, (result) => { // chatIdはcallGas内で自動的に付加される
                if (result.success) {
                    fetchNotes();
                } else {
                    showCustomAlert('ノートの削除に失敗しました: ' + (result.message || '不明なエラー'));
                    renderNotes();
                }
            });
        });
    }

    // --- Rendering ---
    function renderNotes() {
        if (!noteContainerGlobal) {
            console.error("Note container not initialized for rendering.");
            return;
        }
        const noteListContainer = noteContainerGlobal.querySelector('.cn-note-list');
        const noteCountDisplay = noteContainerGlobal.querySelector('.cn-note-count');
        const addNoteButton = noteContainerGlobal.querySelector('.cn-add-note-btn');

        if (!noteListContainer || !noteCountDisplay || !addNoteButton) {
            console.error("Required UI elements for rendering notes are missing.");
            return;
        }

        noteListContainer.innerHTML = ''; // クリアして新しいノートをレンダリング

        if (currentNotes.length === 0) {
            noteListContainer.innerHTML = `<div class="cn-empty-notes">ノートはありません。<br>[+]ボタンからノートを追加できます。</div>`;
        } else {
            currentNotes.forEach(note => {
                const noteItem = document.createElement('div');
                noteItem.className = 'cn-note-item';
                noteItem.dataset.noteId = note.id;

                const contentDiv = document.createElement('div');
                contentDiv.className = 'cn-note-content';
                contentDiv.innerHTML = linkify(String(note.content));

                const metaDiv = document.createElement('div');
                metaDiv.className = 'cn-note-meta';

                const timestampSpan = document.createElement('span');
                timestampSpan.textContent = formatDate(note.timestamp);

                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'cn-note-actions';

                const editButton = document.createElement('button');
                editButton.innerHTML = '✏️';
                editButton.title = '編集';
                editButton.onclick = () => openNoteModal(note);

                const deleteButton = document.createElement('button');
                deleteButton.innerHTML = '🗑️';
                deleteButton.title = '削除';
                deleteButton.onclick = () => deleteNoteById(note.id);

                actionsDiv.appendChild(editButton);
                actionsDiv.appendChild(deleteButton);
                metaDiv.appendChild(timestampSpan);
                metaDiv.appendChild(actionsDiv);
                noteItem.appendChild(contentDiv);
                noteItem.appendChild(metaDiv);
                noteListContainer.appendChild(noteItem);
            });
        }
        noteCountDisplay.textContent = `${currentNotes.length}/${MAX_NOTES}`;
        addNoteButton.disabled = currentNotes.length >= MAX_NOTES || !currentChatId; // ChatIDがなければ追加も不可
        if (addNoteButton.disabled) {
            addNoteButton.style.opacity = "0.5";
            addNoteButton.style.cursor = "not-allowed";
            addNoteButton.title = currentChatId ? `ノートは最大${MAX_NOTES}件までです` : 'チャットが特定できません';
        } else {
            addNoteButton.style.opacity = "1";
            addNoteButton.style.cursor = "pointer";
            addNoteButton.title = '';
        }
    }

    // --- Debugging Features ---
    function openDebugSettingsModal() {
        if (!isDebugMode) {
            const passwordInput = document.createElement('input');
            passwordInput.type = 'password';
            passwordInput.placeholder = 'パスワードを入力';
            passwordInput.style.cssText = 'width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ccc; border-radius: 4px; box-sizing: border-box;';

            showCustomConfirm('デバッグモードに入るにはパスワードを入力してください:',
                () => { // On Confirm
                    const password = passwordInput.value;
                    if (password === DEBUG_PASSWORD) {
                        isDebugMode = true;
                        openDebugSettingsModalInner();
                    } else {
                        showCustomAlert('パスワードが違います。');
                    }
                },
                null, // On Cancel
                passwordInput // Pass the input element to be appended
            );
        } else {
            openDebugSettingsModalInner();
        }
    }

    function openDebugSettingsModalInner() {
        const existingModal = document.querySelector('.cn-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'cn-modal';
        modal.innerHTML = `
            <div class="cn-debug-modal-content">
                <div class="cn-modal-header">デバッグ設定 (${currentChatId || 'ChatID不明'})</div>
                <div class="cn-modal-body">
                    <p>このチャットIDのノートを管理します。</p>
                    <button id="cn-debug-reconstruct-btn">ノートを再構築 (再読み込み)</button>
                    <button id="cn-debug-clear-btn" class="cn-danger-btn">このChatIDのノートを初期化 (全削除)</button>
                    <button id="cn-debug-clear-all-btn" class="cn-danger-btn">すべてのノートを削除する (全ChatID)</button>
                    <button id="cn-force-delete-invalid-notes-btn" class="cn-danger-btn">無効なノートを強制削除</button>
                </div>
                <div class="cn-modal-footer">
                    <button id="cn-debug-close-btn" class="cn-modal-cancel-btn">閉じる</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        document.getElementById('cn-debug-reconstruct-btn').onclick = () => {
            fetchNotes(); // ノートを再読み込み
            modal.remove();
        };

        document.getElementById('cn-debug-clear-btn').onclick = () => {
            showCustomConfirm('本当にこのChatIDの全てのノートを削除してもよろしいですか？この操作は元に戻せません。', () => {
                showLoading(noteContainerGlobal.querySelector('.cn-note-list'));
                callGas('clear_notes', {}, (result) => {
                    if (result.success) {
                        showCustomAlert('ノートが初期化されました。');
                        fetchNotes();
                    } else {
                        showCustomAlert('ノートの初期化に失敗しました: ' + (result.message || '不明なエラー'));
                    }
                    modal.remove();
                });
            });
        };

        document.getElementById('cn-debug-clear-all-btn').onclick = () => {
            showCustomConfirm('本当に全てのChatIDの全てのノートを削除してもよろしいですか？この操作は元に戻せません。', () => {
                showLoading(noteContainerGlobal.querySelector('.cn-note-list')); // 全てのノートを削除する場合もローディング表示
                callGas('clear_all_notes', {chatId: null}, (result) => { // chatIdはnullで渡す
                    if (result.success) {
                        showCustomAlert('全てのノートが削除されました。');
                        fetchNotes(); // 現在のChatIDのノートを再読み込み
                    } else {
                        showCustomAlert('全てのノートの削除に失敗しました: ' + (result.message || '不明なエラー'));
                    }
                    modal.remove();
                });
            });
        };

        document.getElementById('cn-force-delete-invalid-notes-btn').onclick = () => {
            showCustomConfirm('このChatIDの無効なノート（IDが不正なもの）を強制的に削除してもよろしいですか？この操作は元に戻せません。', () => {
                showLoading(noteContainerGlobal.querySelector('.cn-note-list'));
                callGas('force_delete_invalid_notes', {}, (result) => {
                    if (result.success) {
                        showCustomAlert('無効なノートが強制削除されました。');
                        fetchNotes();
                    } else {
                        showCustomAlert('無効なノートの強制削除に失敗しました: ' + (result.message || '不明なエラー'));
                    }
                    modal.remove();
                });
            });
        };

        document.getElementById('cn-debug-close-btn').onclick = () => {
            modal.remove();
        };
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
    }
    const originalShowCustomConfirm = showCustomConfirm;
    showCustomConfirm = function(message, onConfirm, onCancel = null, inputElement = null) {
        const existingModal = document.querySelector('.cn-modal');
        if (existingModal) existingModal.remove();

        const modal = document.createElement('div');
        modal.className = 'cn-modal';
        modal.innerHTML = `
            <div class="cn-modal-content">
                <div class="cn-modal-header">確認</div>
                <div class="cn-modal-body" style="white-space: pre-wrap;">${message}</div>
                ${inputElement ? '<div id="cn-modal-input-area" class="cn-modal-input-area"></div>' : ''}
                <div class="cn-modal-footer">
                    <button id="cn-confirm-cancel-btn" class="cn-modal-cancel-btn">キャンセル</button>
                    <button id="cn-confirm-ok-btn" class="cn-modal-save-btn">OK</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        if (inputElement) {
            const inputArea = modal.querySelector('#cn-modal-input-area');
            if (inputArea) {
                inputArea.appendChild(inputElement);
            }
        }

        document.getElementById('cn-confirm-ok-btn').onclick = () => {
            modal.remove();
            if (onConfirm) onConfirm();
        };
        document.getElementById('cn-confirm-cancel-btn').onclick = () => {
            modal.remove();
            if (onCancel) onCancel();
        };
        modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
        if (inputElement) inputElement.focus();
    };

    // --- Initialization ---
    function initNoteFeature() {
        const extractedId = extractChatIdFromUrl();
        const targetContentArea = document.querySelector('#tab-note .profile-tabpanel-content');

        if (!targetContentArea) {
            console.error('Target content area for notes not found.');
            return;
        }

        const existingCustomSection = document.getElementById('custom-note-section');

        if (extractedId !== currentChatId || !existingCustomSection) {
            currentChatId = extractedId; // グローバルなChatIDを更新

            targetContentArea.innerHTML = '';
            noteContainerGlobal = document.createElement('div');
            noteContainerGlobal.id = 'custom-note-section';
            targetContentArea.appendChild(noteContainerGlobal);

            if (!currentChatId) {
                console.error("Note Enhancement: Failed to initialize, ChatID missing from URL.");
                noteContainerGlobal.innerHTML = `<div class="cn-empty-notes" style="padding-top: 50px;">チャットIDをURLから特定できないため、ノート機能を利用できません。<br>有効なチャットURLに移動してください。</div>`;
                return;
            }

            console.log("Note Enhancement: Setting up UI for ChatID:", currentChatId);
            const existingOptionPanel = document.querySelector('#tab-note .profile-tabpanel-option');
            if (existingOptionPanel) existingOptionPanel.remove();

            const headerDiv = document.createElement('div');
            headerDiv.className = 'cn-header';
            const noteCountSpan = document.createElement('span');
            noteCountSpan.className = 'cn-note-count';
            const headerButtonsDiv = document.createElement('div');
            headerButtonsDiv.className = 'cn-header-buttons';

            const addButton = document.createElement('button');
            addButton.className = 'cn-add-note-btn';
            addButton.innerHTML = '<i class="las la-plus"></i>ノートを追加';
            addButton.onclick = () => openNoteModal();

            const settingsButton = document.createElement('button');
            settingsButton.className = 'cn-settings-btn';
            settingsButton.innerHTML = '⚙️';
            settingsButton.title = 'デバッグ設定';
            settingsButton.onclick = openDebugSettingsModal;

            headerButtonsDiv.appendChild(addButton);
            if (SHOW_DEBUG_BUTTON) {
                headerButtonsDiv.appendChild(settingsButton);
            }

            headerDiv.appendChild(noteCountSpan);
            headerDiv.appendChild(headerButtonsDiv);

            const noteListDiv = document.createElement('div');
            noteListDiv.className = 'cn-note-list';
            noteContainerGlobal.appendChild(headerDiv);
            noteContainerGlobal.appendChild(noteListDiv);

            fetchNotes();
        } else {
            console.log("Note Enhancement: ChatID is same, and UI exists. Re-fetching notes without full re-initialization.", currentChatId);
            fetchNotes();
        }
    }

    // --- Main Execution Logic ---
    let lastPathname = window.location.pathname;
    let urlPathChangeIntervalId = null;

    function startUrlPathChangeDetection() {
        if (urlPathChangeIntervalId) {
            clearInterval(urlPathChangeIntervalId);
        }
        urlPathChangeIntervalId = setInterval(() => {
            const currentPathname = window.location.pathname;
            if (currentPathname !== lastPathname) {
                console.log("Note Enhancement: URL pathname changed from", lastPathname, "to", currentPathname);
                lastPathname = currentPathname;
                const newChatId = extractChatIdFromUrl();
                if (newChatId && newChatId !== currentChatId) {
                    console.log("Note Enhancement: Detected ChatID change via URL pathname. Re-initializing feature.");
                    initNoteFeature();
                }
            }
        }, 300);
    }


    function observeAndInit() {
        const tabContent = document.querySelector('.tab-content.py-3');
        if (!tabContent) {
            console.warn("Note Enhancement: tabContent not found, retrying...");
            setTimeout(observeAndInit, 1000);
            return;
        }

        const observer = new MutationObserver((mutationsList, obs) => {
            const tabNoteElement = document.getElementById('tab-note');
            if (tabNoteElement) {
                const isActive = tabNoteElement.classList.contains('active') && tabNoteElement.classList.contains('show');
                const currentUrlChatId = extractChatIdFromUrl();

                if (isActive && (!document.getElementById('custom-note-section') || currentUrlChatId !== currentChatId)) {
                    console.log("Note Enhancement: Tab active and ChatID changed or section missing. Calling initNoteFeature.");
                    initNoteFeature();
                }
            }
        });
        observer.observe(tabContent, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });

        const initialTabNote = document.querySelector('#tab-note.active.show');
        if (initialTabNote && !document.getElementById('custom-note-section')) {
            console.log("Note Enhancement: Initial #tab-note is active, initializing feature.");
            initNoteFeature();
        }
    }

    let attempts = 0;
    const maxAttempts = 30;
    const initialCheckIntervalId = setInterval(() => {
        const tabContainer = document.querySelector('.tab-content.py-3');
        const noteTabPanel = document.getElementById('tab-note');
        const currentUrlChatId = extractChatIdFromUrl();

        if (document.getElementById('custom-note-section') && currentChatId === currentUrlChatId && currentChatId !== null) {
            clearInterval(initialCheckIntervalId);
            console.log("Note Enhancement: Custom section exists and ChatID matches URL. Stopping initial interval.");
            return;
        }
        if (tabContainer && noteTabPanel) {
            clearInterval(initialCheckIntervalId);
            observeAndInit();
            startUrlPathChangeDetection();
        } else {
            attempts++;
            if (attempts > maxAttempts) {
                clearInterval(initialCheckIntervalId);
                console.warn('LINE Note Enhancement: Target elements for initialization not found after max attempts.');
            }
        }
    }, 500);
})();
