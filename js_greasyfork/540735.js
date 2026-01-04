// ==UserScript==
// @name         NicoSeigaCommentNG
// @namespace    http://tampermonkey.net/
// @version      2025-06-24-5ch-integration-ui-improved
// @description  ニコニコ静画のコメント欄でNGユーザー・NGワードを設定してコメントを削除する（改良版UI）
// @author       You
// @match        https://seiga.nicovideo.jp/seiga/im*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM.getValue
// @grant        GM.setValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540735/NicoSeigaCommentNG.user.js
// @updateURL https://update.greasyfork.org/scripts/540735/NicoSeigaCommentNG.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 設定データの管理クラス
    class Storage {
        constructor(storageName) {
            this.storageName = storageName;
        }

        async GetStorageData(defaultValue = null) {
            const text = await GM.getValue(this.storageName, null);
            return text != null ? JSON.parse(decodeURIComponent(text)) : defaultValue;
        }

        async SetStorageData(data) {
            await GM.setValue(this.storageName, encodeURIComponent(JSON.stringify(data)));
        }
    }

    // ストレージインスタンス
    const configStorage = new Storage("NICOSEIGA_COMMENT_NG_CONFIG_V3");

    // 初期化済みフラグ
    let isInitialized = false;
    let initAttempts = 0;
    const MAX_INIT_ATTEMPTS = 50;
    let commentsDataCache = null; // コメントデータキャッシュ
    let deletedComments = new Set(); // 削除されたコメントのIDを追跡
    let deletedTempIds = new Set(); // 削除された仮IDを追跡

    // 5ch風コメントスクリプトが有効かどうかをチェック
    function is5chStyleScriptActive() {
        // ComeCountクラスが存在するかチェック
        return document.querySelector('.ComeCount') !== null;
    }

    // 仮IDを取得（5ch風コメントスクリプトから）
    function getTempIdFromComment(commentElement) {
        const commentsData = parseCommentsData();
        const commentId = getCommentId(commentElement);
        if (!commentId) return null;

        const commentData = commentsData.find(c => c.id === commentId);
        return commentData ? commentData.user : null;
    }

    // 同じ仮IDのコメントを全て取得
    function getCommentsByTempId(tempId) {
        if (!tempId) return [];

        const allComments = document.querySelectorAll('.comment_list_item');
        const sameIdComments = [];

        allComments.forEach(comment => {
            const commentTempId = getTempIdFromComment(comment);
            if (commentTempId === tempId) {
                sameIdComments.push(comment);
            }
        });

        return sameIdComments;
    }

    // 設定データの取得
    async function getConfig() {
        const defaultConfig = {
            ngCommentIds: [],        // NGコメントID配列
            ngWords: [],             // NGワード配列（正規表現対応）
            ngUserHashes: [],        // NGユーザーハッシュ配列（公式と同じ形式）
            enable5chStyleIntegration: true // 5ch風コメントとの連携を有効にするか
        };
        return await configStorage.GetStorageData(defaultConfig);
    }

    // 設定データの保存
    async function saveConfig(config) {
        await configStorage.SetStorageData(config);
    }

    // コメントデータの解析とキャッシュ
    function parseCommentsData() {
        if (commentsDataCache) return commentsDataCache;

        const commentSection = document.getElementById('ko_comment');
        if (commentSection) {
            const dataInit = commentSection.getAttribute('data-initialize');
            if (dataInit) {
                try {
                    commentsDataCache = JSON.parse(dataInit);
                    console.log('コメントデータをキャッシュしました:', commentsDataCache.length + '件');
                    return commentsDataCache;
                } catch (e) {
                    console.error('コメントデータの解析に失敗:', e);
                }
            }
        }
        return [];
    }

    // 公式NG設定データの読み込み（参考用）
    function getOfficialNGData() {
        const ngSection = document.getElementById('ko_commentng');
        if (ngSection) {
            const clientNg = ngSection.getAttribute('data-client_ng');
            if (clientNg) {
                try {
                    const ngData = JSON.parse(clientNg);
                    console.log('公式NG設定:', ngData);
                    return ngData;
                } catch (e) {
                    console.error('公式NG設定の解析に失敗:', e);
                }
            }
        }
        return [];
    }

    // ユーザーハッシュを取得（公式と同じ形式）
    function getUserHash(commentElement) {
        const commentId = getCommentId(commentElement);
        if (!commentId) return null;

        const commentsData = parseCommentsData();
        const commentData = commentsData.find(c => c.id === commentId);
        return commentData ? commentData.user : null;
    }

    // コメントIDを取得
    function getCommentId(commentElement) {
        const idElement = commentElement.querySelector('.id span');
        return idElement ? idElement.textContent.trim() : null;
    }

    // コメントテキストを取得
    function getCommentText(commentElement) {
        const textElement = commentElement.querySelector('.text');
        return textElement ? textElement.textContent.trim() : '';
    }

    // NGアイテム削除関数
    async function removeNGItem(type, item) {
        const config = await getConfig();
        const index = config[type].indexOf(item);
        if (index > -1) {
            config[type].splice(index, 1);
            await saveConfig(config);
            await updateNGList();

            // 削除されたコメントをリセットして再フィルタリング
            restoreAllComments();
            deletedComments.clear();
            deletedTempIds.clear();
            filterComments();
        }
    }

    // 削除されたコメントを復元
    function restoreAllComments() {
        const deletedCommentsElements = document.querySelectorAll('.comment_list_item.ng-deleted');
        deletedCommentsElements.forEach(comment => {
            comment.classList.remove('ng-deleted');
            comment.style.display = '';

            // 元の位置に戻す
            const commentList = comment.closest('.comment_list');
            if (commentList && !comment.parentNode) {
                commentList.appendChild(comment);
            }
        });
    }

    // NGリストの表示更新
    async function updateNGList() {
        const config = await getConfig();

        // コメントIDリスト
        const commentIdList = document.getElementById('ng-commentid-list');
        if (commentIdList) {
            commentIdList.innerHTML = '';
            config.ngCommentIds.forEach(id => {
                const div = createNGListItem(`No.${id}`, () => removeNGItem('ngCommentIds', id));
                commentIdList.appendChild(div);
            });
            if (config.ngCommentIds.length === 0) {
                commentIdList.innerHTML = '<div style="color: #666; font-style: italic;">NGコメントIDはありません</div>';
            }
        }

        // ワードリスト
        const wordList = document.getElementById('ng-word-list');
        if (wordList) {
            wordList.innerHTML = '';
            config.ngWords.forEach(word => {
                const div = createNGListItem(word, () => removeNGItem('ngWords', word));
                wordList.appendChild(div);
            });
            if (config.ngWords.length === 0) {
                wordList.innerHTML = '<div style="color: #666; font-style: italic;">NGワードはありません</div>';
            }
        }

        // ユーザーハッシュリスト
        const userhashList = document.getElementById('ng-userhash-list');
        if (userhashList) {
            userhashList.innerHTML = '';
            config.ngUserHashes.forEach(hash => {
                const displayText = hash.length > 20 ? `${hash.substring(0, 20)}...` : hash;
                const div = createNGListItem(displayText, () => removeNGItem('ngUserHashes', hash), hash);
                userhashList.appendChild(div);
            });
            if (config.ngUserHashes.length === 0) {
                userhashList.innerHTML = '<div style="color: #666; font-style: italic;">NGユーザーハッシュはありません</div>';
            }
        }

        // 統計情報の更新
        updateStatistics(config);
    }

    // NGリストアイテムの作成
    function createNGListItem(displayText, removeCallback, fullText = null) {
        const div = document.createElement('div');
        div.className = 'ng-item';

        const span = document.createElement('span');
        span.textContent = displayText;
        if (fullText) {
            span.title = fullText; // ツールチップで完全なテキストを表示
        }

        const button = document.createElement('button');
        button.textContent = '削除';
        button.onclick = removeCallback;

        div.appendChild(span);
        div.appendChild(button);
        return div;
    }

    // 統計情報の更新
    function updateStatistics(config) {
        const statsElement = document.getElementById('ng-statistics');
        if (statsElement) {
            const total = config.ngCommentIds.length + config.ngWords.length + config.ngUserHashes.length;
            let statsText = `合計 ${total} 件のNG設定（コメント: ${config.ngCommentIds.length}, ワード: ${config.ngWords.length}, ユーザー: ${config.ngUserHashes.length}）`;

            if (is5chStyleScriptActive()) {
                statsText += ' | 5ch風コメントスクリプト: ON';
            }

            statsElement.textContent = statsText;
        }
    }

    // 設定モーダルのHTML
    function createSettingsModal() {
        // 既存のモーダルがあれば削除
        const existingModal = document.getElementById('ng-settings-modal');
        if (existingModal) {
            existingModal.remove();
        }

        const modal = document.createElement('div');
        modal.id = 'ng-settings-modal';
        modal.style.cssText = `
            display: none;
            position: fixed;
            z-index: 10000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0,0,0,0.6);
        `;

        const modalContent = document.createElement('div');
        modalContent.style.cssText = `
            background-color: #fefefe;
            margin: 3% auto;
            padding: 25px;
            border: 1px solid #888;
            width: 700px;
            max-height: 90%;
            overflow-y: auto;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        `;

        const is5chActive = is5chStyleScriptActive();
        const integrationNote = is5chActive ?
            '<div style="background: #d4edda; border: 1px solid #c3e6cb; padding: 10px; border-radius: 5px; margin-bottom: 20px; color: #155724;"><strong>✅ 5ch風コメント連携:</strong> NGに該当する仮IDのコメントもまとめて削除されます</div>' :
            '<div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin-bottom: 20px; color: #856404;"><strong>ℹ️ 5ch風コメント連携:</strong> 5ch風コメントスクリプトが有効でないため、通常モードで動作します</div>';

        modalContent.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; border-bottom: 2px solid #f0f0f0; padding-bottom: 15px;">
                <h2 style="margin: 0; color: #333;">NGコメント設定（削除モード）</h2>
                <span id="ng-close" style="color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer; hover: color: #000;">&times;</span>
            </div>

            ${integrationNote}

            <div style="background: #fff3cd; border: 1px solid #ffeaa7; padding: 10px; border-radius: 5px; margin-bottom: 20px;">
                <strong>⚠️ 注意:</strong> NGに指定したコメントは完全に削除され、空きは詰められます。
            </div>

            <div id="ng-statistics" style="background: #e7f3ff; padding: 10px; border-radius: 5px; margin-bottom: 20px; font-weight: bold; color: #0066cc;"></div>

            <div id="ng-tabs" style="margin-bottom: 20px; border-bottom: 1px solid #ddd;">
                <button class="ng-tab-btn active" data-tab="comment-id">NGコメントID</button>
                <button class="ng-tab-btn" data-tab="word">NGワード</button>
                <button class="ng-tab-btn" data-tab="user-hash">NGユーザー</button>
                <button class="ng-tab-btn" data-tab="settings">設定</button>
            </div>

            <div id="ng-tab-content">
                <div id="tab-comment-id" class="ng-tab-panel active">
                    <h3>NGコメントID</h3>
                    <p style="color: #666; font-size: 14px;">特定のコメントを削除します。コメント番号（No.の後の数字）を指定してください。${is5chActive ? '<br><strong>※5ch風連携時: 該当コメントと同じ仮IDの全コメントが削除されます</strong>' : ''}</p>
                    <div style="margin-bottom: 15px; display: flex; gap: 10px;">
                        <input type="text" id="ng-commentid-input" placeholder="コメントID（例：47332405）" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <button id="ng-commentid-add" class="add-btn">追加</button>
                    </div>
                    <div id="ng-commentid-list" style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 10px; border-radius: 4px;"></div>
                </div>

                <div id="tab-word" class="ng-tab-panel">
                    <h3>NGワード (正規表現対応)</h3>
                    <p style="color: #666; font-size: 14px;">コメント内容に含まれる文字列で削除します。正規表現も使用できます。${is5chActive ? '<br><strong>※5ch風連携時: 該当コメントと同じ仮IDの全コメントが削除されます</strong>' : ''}</p>
                    <div style="margin-bottom: 15px; display: flex; gap: 10px;">
                        <input type="text" id="ng-word-input" placeholder="NGワード（例：スパム、^.*広告.*$）" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <button id="ng-word-add" class="add-btn">追加</button>
                    </div>
                    <div id="ng-word-list" style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 10px; border-radius: 4px;"></div>
                </div>

                <div id="tab-user-hash" class="ng-tab-panel">
                    <h3>NGユーザー</h3>
                    <p style="color: #666; font-size: 14px;">特定のユーザーの全コメントを削除します。ユーザーハッシュ（公式NG設定と同じ形式）を使用します。${is5chActive ? '<br><strong>※5ch風連携時の削除動作は通常と同じです</strong>' : ''}</p>
                    <div style="margin-bottom: 15px; display: flex; gap: 10px;">
                        <input type="text" id="ng-userhash-input" placeholder="ユーザーハッシュ（例：DwWIubQPhqlGABc...）" style="flex: 1; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
                        <button id="ng-userhash-add" class="add-btn">追加</button>
                    </div>
                    <div id="ng-userhash-list" style="max-height: 200px; overflow-y: auto; border: 1px solid #eee; padding: 10px; border-radius: 4px;"></div>
                </div>

                <div id="tab-settings" class="ng-tab-panel">
                    <h3>表示設定</h3>
                    <div style="margin-bottom: 20px;">
                        <label style="display: block; margin-bottom: 10px;">
                            <input type="checkbox" id="enable-5ch-integration" checked> 5ch風コメント連携を有効にする ${!is5chActive ? '(5ch風スクリプトが必要)' : ''}
                        </label>
                    </div>

                    <h3>公式NG設定インポート</h3>
                    <p style="color: #666; font-size: 14px;">現在のページの公式NG設定からユーザーハッシュをインポートできます。</p>
                    <button id="import-official-ng" style="background: #ff6b35; color: white; border: none; padding: 8px 16px; border-radius: 4px; cursor: pointer;">公式NG設定から取り込み</button>
                </div>
            </div>

            <div style="margin-top: 25px; padding: 15px; background: #f8f9fa; border-radius: 5px; border: 1px solid #e9ecef;">
                <h4 style="margin-top: 0;">データ管理：</h4>
                <div style="display: flex; gap: 10px; margin-top: 10px; flex-wrap: wrap;">
                    <button id="export-config" class="data-btn export">エクスポート</button>
                    <input type="file" id="import-file" accept=".json" style="display: none;">
                    <button id="import-config" class="data-btn import">インポート</button>
                    <button id="clear-all-config" class="data-btn danger">全削除</button>
                    <button id="restore-comments" class="data-btn restore">削除コメント復元</button>
                </div>
                <small style="color: #6c757d; margin-top: 8px; display: block;">
                    ※設定データはTampermonkeyの内部ストレージに保存されます（公式NG設定とは独立）
                </small>
            </div>
        `;

        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        // CSS追加（重複チェック）
        if (!document.getElementById('ng-styles')) {
            const style = document.createElement('style');
            style.id = 'ng-styles';
            style.textContent = `
                .ng-tab-btn {
                    background: #f8f9fa;
                    border: 1px solid #dee2e6;
                    padding: 10px 20px;
                    cursor: pointer;
                    margin-right: 2px;
                    border-radius: 4px 4px 0 0;
                    transition: background-color 0.2s;
                }
                .ng-tab-btn:hover {
                    background: #e9ecef;
                }
                .ng-tab-btn.active {
                    background: #fff;
                    border-bottom: 1px solid #fff;
                    font-weight: bold;
                }
                .ng-tab-panel {
                    display: none;
                    padding: 20px 0;
                }
                .ng-tab-panel.active {
                    display: block;
                }
                .ng-item {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 8px 12px;
                    border: 1px solid #e9ecef;
                    margin: 5px 0;
                    background: #fff;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }
                .ng-item:hover {
                    background: #f8f9fa;
                }
                .ng-item span {
                    flex: 1;
                    word-break: break-all;
                    margin-right: 10px;
                }
                .ng-item button {
                    background: #dc3545;
                    color: white;
                    border: none;
                    padding: 4px 12px;
                    cursor: pointer;
                    border-radius: 3px;
                    font-size: 12px;
                    transition: background-color 0.2s;
                }
                .ng-item button:hover {
                    background: #c82333;
                }
                #ng-settings-btn {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 6px 12px;
                    cursor: pointer;
                    border-radius: 4px;
                    margin-top: 5px;
                    display: block;
                    font-size: 12px;
                    transition: background-color 0.2s;
                    box-shadow: 0 1px 3px rgba(0,0,0,0.1);
                }
                #ng-settings-btn:hover {
                    background: #218838;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.15);
                }
                .ng-add-btn {
                    background: rgba(108, 117, 125, 0.8);
                    color: white;
                    border: 1px solid rgba(108, 117, 125, 0.3);
                    padding: 1px 6px;
                    cursor: pointer;
                    border-radius: 2px;
                    margin-left: 3px;
                    font-size: 10px;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, sans-serif;
                    z-index: 1002;
                    position: relative;
                    transition: all 0.2s ease;
                    opacity: 0.75;
                    text-shadow: none;
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                .ng-add-btn:hover {
                    background: rgba(108, 117, 125, 0.95);
                    border-color: rgba(108, 117, 125, 0.6);
                    opacity: 1;
                    transform: translateY(-1px);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.15);
                }
                .ng-add-btn:active {
                    transform: translateY(0);
                    box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                .ng-deleted {
                    display: none !important;
                }
                .add-btn {
                    background: #28a745;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    cursor: pointer;
                    border-radius: 4px;
                    transition: background-color 0.2s;
                }
                .add-btn:hover {
                    background: #1e7e34;
                }
                .data-btn {
                    border: none;
                    padding: 8px 16px;
                    cursor: pointer;
                    border-radius: 4px;
                    font-size: 14px;
                    transition: all 0.2s;
                }
                .data-btn.export {
                    background: #28a745;
                    color: white;
                }
                .data-btn.export:hover {
                    background: #1e7e34;
                }
                .data-btn.import {
                    background: #17a2b8;
                    color: white;
                }
                .data-btn.import:hover {
                    background: #117a8b;
                }
                .data-btn.danger {
                    background: #dc3545;
                    color: white;
                }
                .data-btn.danger:hover {
                    background: #c82333;
                }
                .data-btn.restore {
                    background: #ffc107;
                    color: black;
                }
                .data-btn.restore:hover {
                    background: #e0a800;
                }
                #ng-close:hover {
                    color: #000 !important;
                }
            `;
            document.head.appendChild(style);
        }

        setupModalEvents();
        return modal;
    }

    // コメントのフィルタリング（削除版・5ch風連携対応）- 最優先で実行
    async function filterComments() {
        const config = await getConfig();
        const comments = document.querySelectorAll('.comment_list_item');
        let deletedCount = 0;
        const tempIdsToDelete = new Set(); // 削除対象の仮ID

        // 1. NGに該当するコメントを特定し、5ch風連携が有効な場合は仮IDも記録
        const commentsToDelete = new Set();

        comments.forEach(comment => {
            // 既に公式によって非表示されたコメントはスキップ
            if (comment.classList.contains('unpublic') && !comment.classList.contains('ng-deleted')) {
                return;
            }

            let shouldDelete = false;
            let deleteReason = '';

            // コメントIDチェック
            const commentId = getCommentId(comment);
            if (commentId && config.ngCommentIds.includes(commentId)) {
                shouldDelete = true;
                deleteReason = `NG Comment ID: ${commentId}`;
            }

            // ユーザーハッシュチェック
            if (!shouldDelete) {
                const userHash = getUserHash(comment);
                if (userHash && config.ngUserHashes.includes(userHash)) {
                    shouldDelete = true;
                    deleteReason = `NG User Hash: ${userHash.substring(0, 10)}...`;
                }
            }

            // コメントテキストチェック（正規表現対応）
            if (!shouldDelete) {
                const commentText = getCommentText(comment);
                for (const ngWord of config.ngWords) {
                    try {
                        const regex = new RegExp(ngWord, 'i');
                        if (regex.test(commentText)) {
                            shouldDelete = true;
                            deleteReason = `NG Word: ${ngWord}`;
                            break;
                        }
                    } catch (e) {
                        // 正規表現エラーの場合は通常の文字列比較
                        if (commentText.toLowerCase().includes(ngWord.toLowerCase())) {
                            shouldDelete = true;
                            deleteReason = `NG Word (literal): ${ngWord}`;
                            break;
                        }
                    }
                }
            }

            if (shouldDelete) {
                commentsToDelete.add(comment);
                console.log('NG Comment identified:', deleteReason);

                // 5ch風連携が有効で、かつスクリプトが動作している場合
                if (config.enable5chStyleIntegration && is5chStyleScriptActive()) {
                    const tempId = getTempIdFromComment(comment);
                    if (tempId) {
                        tempIdsToDelete.add(tempId);
                        console.log('Temp ID marked for deletion:', tempId);
                    }
                }
            }
        });

        // 2. 5ch風連携が有効な場合、削除対象の仮IDと同じ仮IDのコメントをすべて削除対象に追加
        if (config.enable5chStyleIntegration && is5chStyleScriptActive() && tempIdsToDelete.size > 0) {
            tempIdsToDelete.forEach(tempId => {
                const sameIdComments = getCommentsByTempId(tempId);
                sameIdComments.forEach(comment => {
                    commentsToDelete.add(comment);
                });
                deletedTempIds.add(tempId);
                console.log(`Added ${sameIdComments.length} comments for temp ID: ${tempId}`);
            });
        }

        // 3. 実際にコメントを削除
        commentsToDelete.forEach(comment => {
            if (!comment.classList.contains('ng-deleted')) {
                deletedCount++;
                const commentId = getCommentId(comment);
                deletedComments.add(commentId || `unknown_${Date.now()}`);

                comment.classList.add('ng-deleted');
                comment.style.display = 'none';

                // DOMから完全に除去（空きを詰める）
                if (comment.parentNode) {
                    comment.remove();
                }
            }
        });

        // 4. NGでないコメントは表示を復元
        comments.forEach(comment => {
            if (!commentsToDelete.has(comment)) {
                comment.classList.remove('ng-deleted');
                comment.style.display = '';
            }
        });

        // フィルタリング結果をコンソールに表示
        if (deletedCount > 0) {
            let message = `${deletedCount} comments deleted by NG settings`;
            if (is5chStyleScriptActive() && tempIdsToDelete.size > 0) {
                message += ` (${tempIdsToDelete.size} temp IDs affected)`;
            }
            console.log(message);
        }
    }

    // NG追加ボタンの追加
    function addNGButtons() {
        const comments = document.querySelectorAll('.comment_list_item:not(.ng-deleted)');

        comments.forEach(comment => {
            // 既にボタンが追加されている場合はスキップ
            if (comment.querySelector('.ng-add-btn') || comment.hasAttribute('data-ng-buttons-added')) return;

            const idElement = comment.querySelector('.id');
            if (idElement) {
                const commentId = getCommentId(comment);
                const userHash = getUserHash(comment);

                // コメントID用NGボタン
                const ngCommentBtn = document.createElement('button');
                ngCommentBtn.textContent = 'Del';
                ngCommentBtn.className = 'ng-add-btn';

                let buttonTitle = `コメントID: ${commentId} を削除`;
                if (is5chStyleScriptActive()) {
                    const tempId = getTempIdFromComment(comment);
                    if (tempId) {
                        const sameIdComments = getCommentsByTempId(tempId);
                        buttonTitle += `\n同じ仮ID(${tempId.substring(0, 10)}...)の${sameIdComments.length}件のコメントも削除されます`;
                    }
                }
                ngCommentBtn.title = buttonTitle;

                ngCommentBtn.onclick = async function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (commentId) {
                        const config = await getConfig();
                        if (!config.ngCommentIds.includes(commentId)) {
                            config.ngCommentIds.push(commentId);
                            await saveConfig(config);
                            await filterComments();

                            let alertMessage = `コメントID: ${commentId} をNGリストに追加し、削除しました`;
                            if (is5chStyleScriptActive() && config.enable5chStyleIntegration) {
                                const tempId = getTempIdFromComment(comment);
                                if (tempId && deletedTempIds.has(tempId)) {
                                    const sameIdComments = getCommentsByTempId(tempId);
                                    alertMessage += `\n※同じ仮IDの${sameIdComments.length}件のコメントも削除されました`;
                                }
                            }
                            alert(alertMessage);
                        } else {
                            alert('このコメントは既にNGリストに追加されています');
                        }
                    }
                };

                // ユーザーハッシュ用NGボタン
                const ngUserBtn = document.createElement('button');
                ngUserBtn.textContent = 'User';
                ngUserBtn.className = 'ng-add-btn';
                ngUserBtn.title = userHash ? `ユーザー: ${userHash.substring(0, 10)}... のコメントを全削除` : 'ユーザー情報取得不可';

                ngUserBtn.onclick = async function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (userHash) {
                        const config = await getConfig();
                        if (!config.ngUserHashes.includes(userHash)) {
                            config.ngUserHashes.push(userHash);
                            await saveConfig(config);
                            await filterComments();
                            alert(`ユーザーをNGリストに追加し、該当コメントを削除しました\nハッシュ: ${userHash.substring(0, 20)}...`);
                        } else {
                            alert('このユーザーは既にNGリストに追加されています');
                        }
                    } else {
                        alert('ユーザー情報を取得できませんでした');
                    }
                };

                idElement.appendChild(ngCommentBtn);
                if (userHash) {
                    idElement.appendChild(ngUserBtn);
                } else {
                    ngUserBtn.disabled = true;
                    ngUserBtn.style.opacity = '0.5';
                    idElement.appendChild(ngUserBtn);
                }

                // ボタン追加済みマークを設定
                comment.setAttribute('data-ng-buttons-added', 'true');
            }
        });
    }

    // 設定ボタンの追加（UIの重なりを回避）
    function addSettingsButton() {
        const commentSection = document.getElementById('ko_comment');
        if (commentSection && !document.getElementById('ng-settings-btn')) {
            const titleBar = commentSection.querySelector('.title_bar h2');
            if (titleBar) {
                const settingsBtn = document.createElement('button');
                settingsBtn.id = 'ng-settings-btn';
                settingsBtn.textContent = 'NG設定';
                settingsBtn.title = 'NGコメント設定を開く';

                // タイトルバーの後に独立したブロック要素として追加
                const buttonContainer = document.createElement('div');
                buttonContainer.style.cssText = `
                    margin: 5px 0;
                    padding: 0;
                `;
                buttonContainer.appendChild(settingsBtn);

                // titleBarの親要素に追加
                titleBar.parentNode.insertBefore(buttonContainer, titleBar.nextSibling);

                settingsBtn.onclick = async function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const modal = document.getElementById('ng-settings-modal') || createSettingsModal();
                    modal.style.display = 'block';
                    await updateNGList();
                };
            }
        }
    }

    // 削除されたコメントの復元
    async function restoreDeletedComments() {
        if (confirm('削除されたコメントを復元しますか？（NGリストは保持されます）')) {
            alert('削除されたコメントを復元するにはページを再読み込みしてください。\n必要に応じてNG設定を調整できます。');
            location.reload();
        }
    }

    // 公式NG設定のインポート
    async function importOfficialNG() {
        const officialNGData = getOfficialNGData();
        if (officialNGData.length === 0) {
            alert('公式NG設定が見つかりません');
            return;
        }

        const config = await getConfig();
        let importedCount = 0;

        officialNGData.forEach(ngItem => {
            if (ngItem.type === "1" && ngItem.source) { // type "1" = ユーザーID
                if (!config.ngUserHashes.includes(ngItem.source)) {
                    config.ngUserHashes.push(ngItem.source);
                    importedCount++;
                }
            }
        });

        if (importedCount > 0) {
            await saveConfig(config);
            await updateNGList();
            await filterComments();
            alert(`公式NG設定から ${importedCount} 件のユーザーハッシュをインポートしました`);
        } else {
            alert('新しいユーザーハッシュは見つかりませんでした（既に登録済み）');
        }
    }

    // エクスポート機能
    async function exportConfig() {
        const config = await getConfig();
        const exportData = {
            ...config,
            exportedAt: new Date().toISOString(),
            version: "2025-06-24-5ch-integration-ui-improved"
        };

        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = `nicoseiga-comment-ng-config-ui-improved-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        alert('設定をエクスポートしました');
    }

    // インポート機能
    async function importConfig(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = async function(e) {
                try {
                    const importedConfig = JSON.parse(e.target.result);

                    // 設定の妥当性チェック
                    if (!importedConfig.ngCommentIds || !importedConfig.ngWords || !importedConfig.ngUserHashes) {
                        throw new Error('不正な設定ファイルです');
                    }

                    // 現在の設定と統合
                    const currentConfig = await getConfig();
                    const mergedConfig = {
                        ngCommentIds: [...new Set([...currentConfig.ngCommentIds, ...importedConfig.ngCommentIds])],
                        ngWords: [...new Set([...currentConfig.ngWords, ...importedConfig.ngWords])],
                        ngUserHashes: [...new Set([...currentConfig.ngUserHashes, ...importedConfig.ngUserHashes])],
                        enable5chStyleIntegration: importedConfig.enable5chStyleIntegration !== undefined ? importedConfig.enable5chStyleIntegration : currentConfig.enable5chStyleIntegration
                    };

                    await saveConfig(mergedConfig);
                    await updateNGList();
                    await filterComments();
                    alert('設定をインポートしました');
                    resolve();
                } catch (error) {
                    alert('設定ファイルの読み込みに失敗しました: ' + error.message);
                    reject(error);
                }
            };
            reader.onerror = () => {
                alert('ファイルの読み込みに失敗しました');
                reject(new Error('File read error'));
            };
            reader.readAsText(file);
        });
    }

    // 設定全削除
    async function clearAllConfig() {
        if (confirm('すべてのNG設定を削除しますか？この操作は取り消せません。')) {
            const defaultConfig = {
                ngCommentIds: [],
                ngWords: [],
                ngUserHashes: [],
                enable5chStyleIntegration: true
            };
            await saveConfig(defaultConfig);
            await updateNGList();

            // 削除されたコメントをリセット
            deletedComments.clear();
            deletedTempIds.clear();

            // ページをリロードしてコメントを復元
            if (confirm('設定をクリアしました。削除されたコメントを復元するためにページを再読み込みしますか？')) {
                location.reload();
            }
        }
    }

    // モーダルのイベント設定
    function setupModalEvents() {
        const modal = document.getElementById('ng-settings-modal');
        if (!modal) return;

        // モーダルを閉じる
        const closeBtn = document.getElementById('ng-close');
        if (closeBtn) {
            closeBtn.onclick = function() {
                modal.style.display = 'none';
            };
        }

        // 外側クリックで閉じる
        modal.onclick = function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };

        // タブ切り替え
        document.querySelectorAll('.ng-tab-btn').forEach(btn => {
            btn.onclick = function() {
                const tabId = this.dataset.tab;

                // タブボタンの状態更新
                document.querySelectorAll('.ng-tab-btn').forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // タブパネルの表示切り替え
                document.querySelectorAll('.ng-tab-panel').forEach(panel => panel.classList.remove('active'));
                const targetPanel = document.getElementById(`tab-${tabId}`);
                if (targetPanel) {
                    targetPanel.classList.add('active');
                }
            };
        });

        // 追加ボタンのイベント
        setupAddButtonEvents();

        // 設定タブのイベント
        setupSettingsTabEvents();

        // データ管理ボタンのイベント
        setupDataManagementEvents();

        // Enterキーで追加
        ['ng-commentid-input', 'ng-word-input', 'ng-userhash-input'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.onkeypress = function(e) {
                    if (e.key === 'Enter') {
                        const addBtn = this.nextElementSibling;
                        if (addBtn) addBtn.click();
                    }
                };
            }
        });
    }

    // 追加ボタンのイベント設定
    function setupAddButtonEvents() {
        const commentIdAddBtn = document.getElementById('ng-commentid-add');
        if (commentIdAddBtn) {
            commentIdAddBtn.onclick = async function() {
                const input = document.getElementById('ng-commentid-input');
                const value = input.value.trim();
                if (value) {
                    const config = await getConfig();
                    if (!config.ngCommentIds.includes(value)) {
                        config.ngCommentIds.push(value);
                        await saveConfig(config);
                        await updateNGList();
                        await filterComments();
                        input.value = '';

                        let alertMessage = `コメントID: ${value} をNGリストに追加し、該当コメントを削除しました`;
                        if (is5chStyleScriptActive() && config.enable5chStyleIntegration) {
                            alertMessage += '\n該当する仮IDのコメントをまとめて削除しました';
                        }
                        alert(alertMessage);
                    } else {
                        alert('このコメントIDは既にNGリストに追加されています');
                    }
                }
            };
        }

        const wordAddBtn = document.getElementById('ng-word-add');
        if (wordAddBtn) {
            wordAddBtn.onclick = async function() {
                const input = document.getElementById('ng-word-input');
                const value = input.value.trim();
                if (value) {
                    const config = await getConfig();
                    if (!config.ngWords.includes(value)) {
                        config.ngWords.push(value);
                        await saveConfig(config);
                        await updateNGList();
                        await filterComments();
                        input.value = '';

                        let alertMessage = `NGワード: ${value} をNGリストに追加し、該当コメントを削除しました`;
                        if (is5chStyleScriptActive() && config.enable5chStyleIntegration) {
                            alertMessage += '\n該当する仮IDのコメントをまとめて削除しました';
                        }
                        alert(alertMessage);
                    } else {
                        alert('このワードは既にNGリストに追加されています');
                    }
                }
            };
        }

        const userHashAddBtn = document.getElementById('ng-userhash-add');
        if (userHashAddBtn) {
            userHashAddBtn.onclick = async function() {
                const input = document.getElementById('ng-userhash-input');
                const value = input.value.trim();
                if (value) {
                    const config = await getConfig();
                    if (!config.ngUserHashes.includes(value)) {
                        config.ngUserHashes.push(value);
                        await saveConfig(config);
                        await updateNGList();
                        await filterComments();
                        input.value = '';
                        alert(`ユーザーハッシュをNGリストに追加し、該当コメントを削除しました`);
                    } else {
                        alert('このユーザーハッシュは既にNGリストに追加されています');
                    }
                }
            };
        }
    }

    // 設定タブのイベント設定
    async function setupSettingsTabEvents() {
        const config = await getConfig();

        // 5ch風連携の設定
        const enable5chIntegrationCheckbox = document.getElementById('enable-5ch-integration');
        if (enable5chIntegrationCheckbox) {
            enable5chIntegrationCheckbox.checked = config.enable5chStyleIntegration;
            enable5chIntegrationCheckbox.onchange = async function() {
                const newConfig = await getConfig();
                newConfig.enable5chStyleIntegration = this.checked;
                await saveConfig(newConfig);

                // 設定変更後にフィルタリングを再実行
                deletedComments.clear();
                deletedTempIds.clear();
                restoreAllComments();
                await filterComments();

                alert('5ch風連携設定を変更しました。フィルタリングを再実行しました。');
            };
        }

        // 公式NG設定インポートボタン
        const importOfficialBtn = document.getElementById('import-official-ng');
        if (importOfficialBtn) {
            importOfficialBtn.onclick = importOfficialNG;
        }
    }

    // データ管理のイベント設定
    function setupDataManagementEvents() {
        const exportBtn = document.getElementById('export-config');
        if (exportBtn) {
            exportBtn.onclick = exportConfig;
        }

        const importBtn = document.getElementById('import-config');
        const importFile = document.getElementById('import-file');
        if (importBtn && importFile) {
            importBtn.onclick = function() {
                importFile.click();
            };

            importFile.onchange = function(e) {
                const file = e.target.files[0];
                if (file) {
                    importConfig(file);
                    e.target.value = ''; // ファイル選択をリセット
                }
            };
        }

        const clearBtn = document.getElementById('clear-all-config');
        if (clearBtn) {
            clearBtn.onclick = clearAllConfig;
        }

        const restoreBtn = document.getElementById('restore-comments');
        if (restoreBtn) {
            restoreBtn.onclick = restoreDeletedComments;
        }
    }

    // 新しいコメントの監視（最優先でフィルタリングを実行）
    function observeComments() {
        const commentSection = document.getElementById('ko_comment');
        if (!commentSection) return;

        const observer = new MutationObserver(function(mutations) {
            let shouldUpdate = false;
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // コメント関連の変更があった場合
                    const hasCommentChanges = Array.from(mutation.addedNodes).some(node =>
                        node.nodeType === Node.ELEMENT_NODE &&
                        (node.classList && node.classList.contains('comment_list_item') ||
                         node.querySelector && node.querySelector('.comment_list_item'))
                    );
                    if (hasCommentChanges) {
                        shouldUpdate = true;
                    }
                }
            });

            if (shouldUpdate) {
                // フィルタリングを最優先で実行
                setTimeout(async () => {
                    await filterComments();
                    addNGButtons();
                }, 100);
            }
        });

        observer.observe(commentSection, {
            childList: true,
            subtree: true
        });

        console.log('Comment observer initialized');
    }

    // DOM変更の継続的な監視
    function observeGlobalChanges() {
        const globalObserver = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList') {
                    const addedNodes = Array.from(mutation.addedNodes);
                    const hasCommentChanges = addedNodes.some(node =>
                        node.nodeType === Node.ELEMENT_NODE &&
                        (node.querySelector && node.querySelector('.comment_list_item') ||
                         node.classList && node.classList.contains('comment_list_item'))
                    );

                    if (hasCommentChanges) {
                        setTimeout(async () => {
                            if (!document.getElementById('ng-settings-btn')) {
                                addSettingsButton();
                            }
                            await filterComments();
                            addNGButtons();
                        }, 200);
                    }
                }
            });
        });

        globalObserver.observe(document.body, {
            childList: true,
            subtree: true
        });

        console.log('Global observer initialized');
    }

    // 定期的なチェック（フォールバック）
    function startPeriodicCheck() {
        setInterval(async () => {
            // 設定ボタンの存在確認
            if (!document.getElementById('ng-settings-btn') && document.getElementById('ko_comment')) {
                console.log('Settings button missing, re-adding...');
                addSettingsButton();
            }

            // フィルタリングの再実行（最優先）
            await filterComments();

            // NGボタンの存在確認
            const comments = document.querySelectorAll('.comment_list_item:not(.ng-deleted)');
            const commentsWithButtons = document.querySelectorAll('.comment_list_item[data-ng-buttons-added]:not(.ng-deleted)');

            if (comments.length > 0 && commentsWithButtons.length < comments.length) {
                console.log('NG buttons missing, re-adding...');
                addNGButtons();
            }
        }, 3000);
    }

    // 初期化の試行
    async function attemptInitialization() {
        initAttempts++;

        const commentSection = document.getElementById('ko_comment');
        const hasComments = document.querySelectorAll('.comment_list_item').length > 0;

        if (commentSection && (hasComments || initAttempts > 20)) {
            if (!isInitialized) {
                console.log('Initializing NG Delete script with 5ch integration (attempt', initAttempts, ')');
                isInitialized = true;

                // 5ch風スクリプトの状態をチェック
                const is5chActive = is5chStyleScriptActive();
                console.log('5ch style script active:', is5chActive);

                // コメントデータのキャッシュ
                parseCommentsData();

                // 最優先でフィルタリング実行
                await filterComments();

                // UI要素の追加
                addSettingsButton();
                createSettingsModal();
                addNGButtons();

                // 監視の開始
                observeComments();
                observeGlobalChanges();
                startPeriodicCheck();

                // 公式NG設定の確認（デバッグ用）
                const officialNG = getOfficialNGData();
                if (officialNG.length > 0) {
                    console.log('公式NG設定が検出されました:', officialNG.length, '件');
                }

                console.log('NG Delete script with 5ch integration initialized successfully');
            }
        } else if (initAttempts < MAX_INIT_ATTEMPTS) {
            setTimeout(attemptInitialization, 500);
        } else {
            console.log('Failed to initialize NG Delete script after', MAX_INIT_ATTEMPTS, 'attempts');
        }
    }

    // 初期化
    function init() {
        console.log('NicoSeiga Comment NG Delete Script with 5ch integration starting...');

        // ページが完全に読み込まれるまで待機
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                setTimeout(attemptInitialization, 1000);
            });
            return;
        }

        // 即座に初期化を試行
        setTimeout(attemptInitialization, 1000);
    }

    // スクリプト開始
    init();

})();