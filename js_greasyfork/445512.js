// ==UserScript==
// @name         Twitch Chat Filter
// @namespace    TwitchChatFilterScript
// @version      0.9.5
// @description  Twitchのチャット欄にNG機能を追加します。Chat Filter for Twitch chat
// @author       bd
// @match        https://www.twitch.tv/*
// @icon         https://www.google.com/s2/favicons?domain=twitch.tv
// @license      MIT
// @noframes
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/445512/Twitch%20Chat%20Filter.user.js
// @updateURL https://update.greasyfork.org/scripts/445512/Twitch%20Chat%20Filter.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const SCRIPT_PREFIX = 'TCF'; // スクリプト接頭辞（ログやID用）
    const log = (...args) => console.log(`[${SCRIPT_PREFIX}]`, ...args);
    const error = (...args) => console.error(`[${SCRIPT_PREFIX}]`, ...args);

    // GMストレージのキー
    const STORAGE_KEYS = {
        BANNED_WORDS: `${SCRIPT_PREFIX}_BannedWords`,
        BANNED_USERS: `${SCRIPT_PREFIX}_BannedUsers`,
        AUTO_BAN: `${SCRIPT_PREFIX}_AutoBan`,
        SHOW_BAN_BUTTON: `${SCRIPT_PREFIX}_ShowBanButton`,
    };

    // --- 設定管理 ---
    const config = {
        bannedWordPatterns: [], // 正規表現オブジェクトの配列
        bannedUserIds: new Set(), // 高速検索のためのSet
        rawBannedWords: "",       // 生のNGワード文字列（テキストエリア用）
        rawBannedUsers: "",       // 生のNGユーザー文字列（テキストエリア用）
        autoBanEnabled: false,    // NGワード発言者の自動BANが有効か
        showBanButton: true,     // チャットにNGボタンを表示するか

        // 設定をストレージから読み込む
        load() {
            this.rawBannedWords = GM_getValue(STORAGE_KEYS.BANNED_WORDS, "");
            this.rawBannedUsers = GM_getValue(STORAGE_KEYS.BANNED_USERS, "");
            this.autoBanEnabled = GM_getValue(STORAGE_KEYS.AUTO_BAN, false);
            this.showBanButton = GM_getValue(STORAGE_KEYS.SHOW_BAN_BUTTON, true);
            this.parseLists(); // 読み込んだ文字列を内部形式（RegExp[], Set）に変換
            log("設定を読み込みました。");
        },

        // 設定をストレージに保存する
        save() {
            // Setを改行区切りの文字列に戻す
            this.rawBannedUsers = Array.from(this.bannedUserIds).join('\n');

            GM_setValue(STORAGE_KEYS.BANNED_WORDS, this.rawBannedWords);
            GM_setValue(STORAGE_KEYS.BANNED_USERS, this.rawBannedUsers);
            GM_setValue(STORAGE_KEYS.AUTO_BAN, this.autoBanEnabled);
            GM_setValue(STORAGE_KEYS.SHOW_BAN_BUTTON, this.showBanButton);
            log("設定を保存しました。");
            this.parseLists(); // 保存後、内部状態も最新に保つために再パース
            ui.updatePanelValues(); // 保存後にパネルの表示も更新
        },

        // 生の文字列リストを内部形式（RegExp[], Set）にパースする
        parseLists() {
            // NGワードを正規表現オブジェクトの配列に変換
            this.bannedWordPatterns = this.rawBannedWords
                .split(/\r?\n/) // 改行で分割
                .map(word => word.trim()) // 前後の空白を削除
                .filter(word => word !== "") // 空行を除去
                .map(word => {
                try {
                    // '*' や '.*' だけのような広すぎるパターンを基本的なチェックで除外
                    if (word === '*' || word === '.*') return null;
                    // 大文字小文字を区別しない正規表現を作成
                    return new RegExp(word, 'i');
                } catch (e) {
                    // 無効な正規表現はスキップしてエラーログを出力
                    error(`無効な正規表現パターンをスキップしました: "${word}"`, e);
                    return null;
                }
            })
                .filter(pattern => pattern !== null); // null（無効/スキップされたパターン）を除去

            // NGユーザーをSetに変換
            this.bannedUserIds = new Set(
                this.rawBannedUsers
                .split(/\r?\n/) // 改行で分割
                .map(id => id.trim()) // 前後の空白を削除
                .filter(id => id !== "") // 空行を除去
            );
        },

        // NGワードを追加する（内部リストへの直接追加、保存は別途必要）
        addBannedWord(word) {
            word = word.trim();
            // 単語が存在し、かつ現在のリストに含まれていない場合に追加
            if (word && !this.rawBannedWords.split(/\r?\n/).includes(word)) {
                this.rawBannedWords = (this.rawBannedWords ? this.rawBannedWords + "\n" : "") + word;
            }
        },

        // NGユーザーを追加する（内部リストへの直接追加、保存は別途必要）
        addBannedUser(userId) {
            userId = userId.trim();
            // ユーザーIDが存在し、かつSetに含まれていない場合に追加
            if (userId && !this.bannedUserIds.has(userId)) {
                this.bannedUserIds.add(userId);
            }
        }
    };

    // --- UI管理 ---
    const ui = {
        panelElement: null,            // 設定パネルの要素
        bannedWordsTextarea: null,     // NGワード入力欄
        bannedUsersTextarea: null,     // NGユーザー入力欄
        usersCountSpan: null,          // NGユーザー数の表示欄
        bannedCountSpan: null,         // 非表示にしたチャット数の表示欄
        saveButton: null,              // 保存ボタン
        toggleButton: null,            // パネル表示切り替えボタン（フィルターアイコン）
        autoBanCheckbox: null,         // 自動BANチェックボックス
        showBanButtonCheckbox: null,   // NGボタン表示チェックボックス
        isPanelVisible: false,         // パネルが表示されているか
        bannedMessageCount: 0,         // 非表示にしたメッセージのカウント

        // CSSスタイルをページに注入する
        injectStyles() {
            GM_addStyle(`
            /* フィルターボタンとそのパネルを含むコンテナ */
            #${SCRIPT_PREFIX}-panel-container {
                position: relative; /* パネルの絶対配置の基準点 */
                display: inline-flex; /* 他の要素とインラインで並び、内部要素をflexで配置 */
                vertical-align: middle; /* 隣接要素と垂直方向中央揃え */
                margin-right: 5px; /* 右隣の要素（設定ボタン）との間にスペース */
            }
            /* フィルターアイコンのボタン自体 */
            #${SCRIPT_PREFIX}-panel-toggle-button {
                /* Twitchのクラスで高さやパディングが制御されることが多い。必要ならここで調整 */
                /* height: 3rem; */
                /* padding: 0 5px; */
            }
            /* 設定パネル本体 */
            #${SCRIPT_PREFIX}-panel {
                position: absolute; /* 絶対配置 */
                bottom: calc(100% + 5px); /* ボタンの真上、5pxの間隔をあける */
                /* *** MODIFIED: left: 0 から right: 0 に変更 *** */
                right: 0; /* コンテナの右端を基準に配置 */
                width: 300px; /* パネル幅 */
                max-width: 90vw; /* 最大幅はビューポートの90% */
                background-color: rgba(24, 24, 27, 0.95); /* 背景色（Twitchダークテーマ風） */
                border: 1px solid var(--color-border-base); /* 境界線 */
                border-radius: var(--border-radius-medium); /* 角丸 */
                z-index: 1000; /* 他の要素より手前に表示 */
                display: none; /* デフォルトでは非表示 */
                padding: 15px; /* 内側余白 */
                color: var(--color-text-base); /* テキスト色 */
                font-size: 1.3rem; /* フォントサイズ */
                flex-direction: column; /* 内部要素を縦に並べる */
                gap: 12px; /* 内部要素間の間隔 */
            }
            #${SCRIPT_PREFIX}-panel.visible {
                display: flex; /* パネルを表示 */
            }
            /* パネル内部の要素 */
            #${SCRIPT_PREFIX}-panel textarea {
                width: 100%; /* 幅いっぱい */
                box-sizing: border-box; /* borderを含めて幅計算 */
                min-height: 120px; /* 最小高さ */
                background-color: var(--color-background-input); /* 背景色 */
                color: var(--color-text-input); /* テキスト色 */
                border: 1px solid var(--color-border-input); /* 境界線 */
                border-radius: var(--border-radius-small); /* 角丸 */
                font-family: inherit; /* 親要素のフォントを継承 */
                font-size: 1.2rem; /* フォントサイズ */
            }
             #${SCRIPT_PREFIX}-panel label {
                display: flex; /* チェックボックスとテキストを横並び */
                align-items: center; /* 垂直方向中央揃え */
                gap: 8px; /* 要素間の間隔 */
                font-size: 1.2rem; /* フォントサイズ */
                cursor: pointer; /* クリック可能なカーソル */
            }
             #${SCRIPT_PREFIX}-panel input[type="checkbox"] {
                 cursor: pointer; /* クリック可能なカーソル */
             }
             #${SCRIPT_PREFIX}-panel span[id$="-count"] { /* "-count"で終わるIDを持つspan要素（ユーザー数、非表示数） */
                 font-size: 1rem; /* フォントサイズ */
                 color: var(--color-text-alt-2); /* テキスト色（少し薄め） */
             }
            /* チャットメッセージに追加するNGボタン */
            .${SCRIPT_PREFIX}-ban-button {
                background: none; border: none; padding: 0; /* ボタンのデフォルトスタイルを解除 */
                margin-left: 5px; /* 左側の要素との間隔 */
                cursor: pointer; /* クリック可能なカーソル */
                color: var(--color-text-alt-2); /* デフォルトの色（薄め） */
                vertical-align: middle; /* 垂直方向中央揃え */
                display: inline-flex; /* アイコンが正しく配置されるように */
                opacity: 0.6; /* デフォルトでは少し透明 */
            }
            .${SCRIPT_PREFIX}-ban-button:hover {
                color: var(--color-text-error); /* ホバー時に赤色に */
                opacity: 1; /* ホバー時に不透明に */
            }
            .${SCRIPT_PREFIX}-ban-button svg {
                width: 14px; height: 14px; /* アイコンサイズ */
                fill: currentColor; /* アイコンの色をテキスト色に合わせる */
            }
            /* チャットメッセージにホバーしたときにNGボタンを表示 */
            .chat-line__message:hover .${SCRIPT_PREFIX}-ban-button,
            [data-test-selector="video-chat-message-list-item"]:hover .${SCRIPT_PREFIX}-ban-button {
                opacity: 1;
            }
            /* パネル内の保存ボタン */
            .${SCRIPT_PREFIX}-save-button {
                padding: 5px 15px; /* 内側余白 */
                background-color: var(--color-background-button-primary-default); /* 背景色 */
                color: var(--color-text-button-primary); /* テキスト色 */
                border: none; /* 境界線なし */
                border-radius: var(--border-radius-medium); /* 角丸 */
                cursor: pointer; /* クリック可能なカーソル */
                align-self: flex-end; /* パネル内で右端に配置 */
            }
             .${SCRIPT_PREFIX}-save-button:hover {
                 background-color: var(--color-background-button-primary-hover); /* ホバー時の背景色 */
             }
        `);
    },

    // パネルを作成し、指定された要素（設定ボタン）の *前* にフィルターボタンを挿入する
    createPanel(settingsButtonElement) {
        // settingsButtonElement が見つからないか、既にパネルが存在する場合は何もしない
        if (!settingsButtonElement || document.getElementById(`${SCRIPT_PREFIX}-panel-container`)) {
            if(!settingsButtonElement) error("位置指定のためのチャット設定ボタンが見つかりませんでした。");
            return;
        }

        this.injectStyles(); // CSSを注入

        // フィルターボタンとパネル全体を囲むコンテナを作成
        const panelContainer = document.createElement('div');
        panelContainer.id = `${SCRIPT_PREFIX}-panel-container`;

        // フィルターアイコンボタンのHTML
        const toggleButtonHTML = `
            <button class="ScCoreButton-sc-1qn4ixc-0 jGqsfG ScButtonIcon-sc-o7ndmn-0 fNzXyu" id="${SCRIPT_PREFIX}-panel-toggle-button" aria-label="チャットフィルター設定を開く">
                 <div class="ScIconLayout-sc-1bgeryd-0 dxXcWw tw-icon" style="display: flex; align-items: center; justify-content: center;">
                    <svg width="20px" height="20px" viewBox="0 0 20 20" fill="currentColor">
                       <path d="M3 3h14l-5 7v5l-4 2v-7L3 3z" />
                    </svg>
                 </div>
            </button>`;

        // 設定パネルのHTML（簡略化版）
        const panelHTML = `
            <div id="${SCRIPT_PREFIX}-panel">
                <span>NGワード <small>(正規表現)</small></span>
                <textarea id="${SCRIPT_PREFIX}-banned-words" rows="7"></textarea>

                <span>NGユーザー <small>(ID)</small></span>
                <span id="${SCRIPT_PREFIX}-users-count">0人</span>
                <textarea id="${SCRIPT_PREFIX}-banned-users" rows="7"></textarea>

                <label>
                    <input type="checkbox" id="${SCRIPT_PREFIX}-show-ban-button-checkbox"> NGボタン表示
                </label>
                <label>
                    <input type="checkbox" id="${SCRIPT_PREFIX}-auto-ban-checkbox"> NGワード発言者を自動NG
                </label>

                <span id="${SCRIPT_PREFIX}-banned-count">0件のチャットを非表示</span>

                <button class="${SCRIPT_PREFIX}-save-button" id="${SCRIPT_PREFIX}-save-button">保存</button>
            </div>`;

        panelContainer.innerHTML = toggleButtonHTML + panelHTML;

        // フィルターボタンのコンテナを、指定された設定ボタン要素の *前* に挿入
        settingsButtonElement.before(panelContainer);
        log("フィルターボタンコンテナを設定ボタンの前に挿入しました。");

        // パネル内の各要素への参照を取得（innerHTMLを設定した後でないと取得できない）
        this.panelElement = document.getElementById(`${SCRIPT_PREFIX}-panel`);
        this.bannedWordsTextarea = document.getElementById(`${SCRIPT_PREFIX}-banned-words`);
        this.bannedUsersTextarea = document.getElementById(`${SCRIPT_PREFIX}-banned-users`);
        this.usersCountSpan = document.getElementById(`${SCRIPT_PREFIX}-users-count`);
        this.bannedCountSpan = document.getElementById(`${SCRIPT_PREFIX}-banned-count`);
        this.saveButton = document.getElementById(`${SCRIPT_PREFIX}-save-button`);
        this.toggleButton = document.getElementById(`${SCRIPT_PREFIX}-panel-toggle-button`);
        this.autoBanCheckbox = document.getElementById(`${SCRIPT_PREFIX}-auto-ban-checkbox`);
        this.showBanButtonCheckbox = document.getElementById(`${SCRIPT_PREFIX}-show-ban-button-checkbox`);

        this.attachPanelEvents(); // イベントリスナーを設定
        this.updatePanelValues(); // 初期値をパネルに表示
        log("設定パネルが作成され、ボタンが追加されました。");
    },

    // パネルの表示値を現在の設定に合わせて更新する
    updatePanelValues() {
        if (!this.panelElement) return; // パネルが存在しない場合は何もしない
        this.bannedWordsTextarea.value = config.rawBannedWords;
        this.bannedUsersTextarea.value = Array.from(config.bannedUserIds).join('\n'); // Setから文字列に戻す
        this.usersCountSpan.textContent = `${config.bannedUserIds.size}人`;
        this.autoBanCheckbox.checked = config.autoBanEnabled;
        this.showBanButtonCheckbox.checked = config.showBanButton;
        this.updateBannedCountDisplay(); // 非表示カウント表示も更新
    },

    // パネル関連のイベントリスナーを設定する
    attachPanelEvents() {
        // フィルターボタンクリック時の動作
        this.toggleButton.addEventListener('click', (e) => {
            e.stopPropagation(); // 親要素へのイベント伝播を停止
            this.togglePanelVisibility(); // パネル表示切り替え
        });
        // 保存ボタンクリック時の動作
        this.saveButton.addEventListener('click', () => this.savePanelSettings());
        // 自動BANチェックボックス変更時の動作
        this.autoBanCheckbox.addEventListener('change', (e) => {
            config.autoBanEnabled = e.target.checked;
            config.save(); // 変更を即時保存
        });
        // NGボタン表示チェックボックス変更時の動作
        this.showBanButtonCheckbox.addEventListener('change', (e) => {
            config.showBanButton = e.target.checked;
            config.save(); // 変更を即時保存
        });
        // パネル外クリック時にパネルを閉じる動作
        document.addEventListener('click', (e) => {
            // パネルが表示されていて、クリックがパネル内でもフィルターボタンでもない場合
            if (this.isPanelVisible && this.panelElement && this.toggleButton && !this.panelElement.contains(e.target) && !this.toggleButton.contains(e.target)) {
                this.togglePanelVisibility(); // パネルを閉じる
            }
        }, true); // キャプチャフェーズでイベントを捕捉（他の要素のクリックイベントより先に処理するため）
    },

    // パネルの表示/非表示を切り替える
    togglePanelVisibility() {
        this.isPanelVisible = !this.isPanelVisible;
        if (this.panelElement) {
            // 'visible' クラスの付け外しで表示を制御 (CSSで display: flex/none を切り替え)
            this.panelElement.classList.toggle('visible', this.isPanelVisible);
        }
    },

    // パネルの内容を設定に保存する
    savePanelSettings() {
        config.rawBannedWords = this.bannedWordsTextarea.value; // NGワードを読み取り
        // NGユーザーを読み取り、Setに変換
        const usersFromTextarea = this.bannedUsersTextarea.value
        .split(/\r?\n/)
        .map(id => id.trim())
        .filter(id => id !== "");
        config.bannedUserIds = new Set(usersFromTextarea);
        config.save(); // 設定オブジェクトのsaveメソッドを呼び出す（内部でストレージ保存、再パース、パネル更新が行われる）
        log("パネル設定を保存しました。");
        // 保存後もパネルは開いたままにする（ユーザーが手動で閉じる）
    },

    // 非表示にしたチャット数の表示を更新する
    updateBannedCountDisplay() {
        if(this.bannedCountSpan) {
            this.bannedCountSpan.textContent = `${this.bannedMessageCount}件のチャットを非表示`;
        }
    },

    // 非表示にしたチャット数を1増やす
    incrementBannedCount() {
        this.bannedMessageCount++;
        this.updateBannedCountDisplay(); // 表示を更新
    },

    // チャットメッセージにNGボタンを追加する
    addBanButton(containerElement, userId) {
        // 設定で非表示、または既にボタンが存在する場合は追加しない
        if (!config.showBanButton || containerElement.querySelector(`.${SCRIPT_PREFIX}-ban-button`)) return;

        const button = document.createElement('button');
        button.className = `${SCRIPT_PREFIX}-ban-button`;
        button.setAttribute('aria-label', `ユーザー「${userId}」をNGに追加`);
        button.dataset.userId = userId; // クリックハンドラ用にユーザーIDを保持
        // ボタンアイコンのSVG
        button.innerHTML = `<svg viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z" clip-rule="evenodd"></path></svg>`;

        // ボタンクリック時の動作
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // チャットメッセージ自体のクリックイベントを発火させない
            const userIdToBan = e.currentTarget.dataset.userId; // 保持しておいたIDを取得
            log(`手動でユーザーをNGに追加: ${userIdToBan}`);
            config.addBannedUser(userIdToBan); // 設定に追加
            config.save(); // 設定を保存（内部でパネルのユーザー数も更新される）

            // 親のチャット要素を見つけて非表示にする
            const chatElement = e.currentTarget.closest(selectors.chatMessageWrapperSelector);
            if(chatElement) {
                this.hideElement(chatElement);
            }
        });

        // メッセージ本文要素を探す
        const messageBody = containerElement.querySelector(selectors.textContainerSelector);
        if (messageBody) {
            // メッセージ本文の末尾（通常は最後のspanやテキストノード）の後ろにボタンを挿入
            if (messageBody.lastChild && messageBody.lastChild.nodeType === Node.ELEMENT_NODE) {
                messageBody.lastChild.after(button);
            } else {
                messageBody.appendChild(button); // 末尾が要素でない場合のフォールバック
            }
        } else {
            // メッセージ本文が見つからない場合のフォールバック（コンテナの末尾に追加、位置はずれる可能性あり）
            containerElement.appendChild(button);
        }
    },

    // 要素を非表示にする
    hideElement(element) {
        element.style.display = 'none';
        // スクリプトによって非表示にされたことを示す属性を付与（再処理防止用）
        element.dataset.tcfHidden = 'true';
    },
};

    // --- セレクター定義 ---
    let selectors = {}; // ページの種類に応じて設定されるセレクターを格納するオブジェクト
    // ページの種類（ライブ配信かVOD/Clipか）に基づいてセレクターを設定する
    const setSelectors = (streaming) => {
        if (streaming) { // ライブ配信の場合
            selectors = {
                chatScrollableArea: '.chat-scrollable-area__message-container', // チャットメッセージが表示されるコンテナ
                chatMessageWrapperSelector: '.chat-line__message', // 個々のチャットメッセージ全体を囲む要素
                textContainerSelector: '[data-a-target="chat-line-message-body"]', // メッセージ本文（テキストやエモート）を含む要素
                displayNameSelector: '.chat-author__display-name', // ユーザー表示名
                // chatButtonsContainer: '.chat-input__buttons-container div:last-child', // 参考：ボタン群を含むコンテナ（現在は直接使用せず）
                chatSettingsButton: '[data-a-target="chat-settings"]', // フィルターボタンの配置基準となるチャット設定ボタン
            };
        } else { // VOD/Clipの場合
            selectors = {
                chatScrollableArea: '.video-chat__message-list-wrapper > div[role="list"]',
                chatMessageWrapperSelector: '[data-test-selector="video-chat-message-list-item"]',
                textContainerSelector: '[data-a-target="chat-message-text"]',
                displayNameSelector: '[data-a-target="chat-message-username"]',
                // chatButtonsContainer: '.video-chat__input .video-chat__input-buttons-container', // 参考：VODのボタンコンテナ
                chatSettingsButton: '[data-a-target="chat-settings"]', // VODのチャット設定ボタン
            };
        }
        log(`セレクターをモードに合わせて設定: ${streaming ? 'ライブ配信' : 'VOD/Clip'}`);
    };

    // --- コアロジック ---
    // 指定されたセレクターに一致する最初の要素を取得するヘルパー関数
    const getElement = (selector, parent = document) => parent.querySelector(selector);
    // 指定されたセレクターに一致するすべての要素を取得するヘルパー関数
    const getElements = (selector, parent = document) => parent.querySelectorAll(selector);

    // チャット要素からユーザー情報を抽出する
    function getUserInfo(chatElement) {
        const nameElement = getElement(selectors.displayNameSelector, chatElement);
        if (!nameElement) return null; // 名前要素が見つからなければnull
        const name = nameElement.textContent?.trim() || ''; // 名前のテキストを取得
        // ユーザーIDは名前要素自身か、その親の data-a-user 属性にあることが多い
        const idElement = nameElement.closest('[data-a-user]') || nameElement;
        const id = idElement.getAttribute('data-a-user') || name; // IDがなければ名前をフォールバックとして使用
        return { name, id };
    }

    // チャット要素からメッセージ本文（エモートのaltテキスト含む）を抽出する
    function getMessageText(chatElement) {
        const textContainer = getElement(selectors.textContainerSelector, chatElement);
        if (!textContainer) return ''; // テキストコンテナが見つからなければ空文字
        let text = '';
        // 子ノードを走査してテキストとエモートのaltテキストを結合
        textContainer.childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) { // テキストノードの場合
                text += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE && node.tagName === 'IMG') { // IMG要素（エモート）の場合
                text += node.alt; // alt属性値を使用
            } else if (node.nodeType === Node.ELEMENT_NODE) { // その他の要素（spanなど）の場合
                // ネストされたテキストも取得
                text += node.textContent;
            }
        });
        return text.trim(); // 前後の空白を削除
    }

    // メッセージがブロック対象かどうかを判定する
    function isBlocked(userId, messageText) {
        // NGユーザーリストに含まれているかチェック（高速）
        if (config.bannedUserIds.has(userId)) {
            return { blocked: true, reason: 'User' };
        }
        // NGワードの正規表現パターンに一致するかチェック
        for (const pattern of config.bannedWordPatterns) {
            // 空メッセージに対する複雑な正規表現チェックは避ける（必要なら調整）
            if (messageText || pattern.source !== '.*') {
                if (pattern.test(messageText)) { // test()で一致判定
                    return { blocked: true, reason: 'Word', pattern: pattern.source }; // 一致したらブロック対象
                }
            }
        }
        // どちらにも一致しなければブロックしない
        return { blocked: false };
    }

    // 個々のチャットメッセージ要素を処理する
    function processChatMessage(chatElement) {
        // スクリプトで既に非表示にされているか、正しいチャット要素でない場合はスキップ
        if (chatElement.dataset?.tcfHidden || !chatElement.matches(selectors.chatMessageWrapperSelector)) {
            return;
        }
        try {
            const userInfo = getUserInfo(chatElement); // ユーザー情報取得
            if (!userInfo) return; // ユーザー情報が取れなければ中断
            const messageText = getMessageText(chatElement); // メッセージ本文取得
            const blockCheck = isBlocked(userInfo.id, messageText); // ブロック対象か判定

            if (blockCheck.blocked) { // ブロック対象の場合
                ui.hideElement(chatElement); // 要素を非表示
                ui.incrementBannedCount(); // 非表示カウントを増やす
                //log(`メッセージをブロック: ${userInfo.id} (理由: ${blockCheck.reason}${blockCheck.pattern ? ` - "${blockCheck.pattern}"` : ''})`);

                // 自動BANロジック
                if (blockCheck.reason === 'Word' && config.autoBanEnabled && !config.bannedUserIds.has(userInfo.id)) {
                    log(`ユーザーを自動NGに追加: ${userInfo.id} (原因ワード: "${blockCheck.pattern}")`);
                    config.addBannedUser(userInfo.id); // ユーザーをNGリストに追加
                    config.save(); // 設定を即時保存（内部でUIも更新）
                }
            } else if(config.showBanButton) { // ブロック対象外で、NGボタン表示が有効な場合
                ui.addBanButton(chatElement, userInfo.id); // NGボタンを追加
            }
        } catch (e) {
            error("チャットメッセージ処理中にエラー:", e, chatElement);
        }
    }

    // --- DOM監視 (Observers) ---
    let chatObserver = null; // チャット欄の変更を監視するオブザーバー
    let initObserver = null; // 初期化に必要な要素の出現を監視するオブザーバー

    // チャットコンテナ内の新しいメッセージを監視する
    function observeChat(chatContainer) {
        if (chatObserver) chatObserver.disconnect(); // 既存のオブザーバーがあれば停止

        // 新しいノードが追加されたときに発火するMutationObserverを作成
        chatObserver = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => { // 追加された各ノードについて処理
                    if (node.nodeType === Node.ELEMENT_NODE) { // 要素ノードのみ対象
                        // 追加されたノード自体がチャットメッセージの場合
                        if (node.matches(selectors.chatMessageWrapperSelector)) {
                            processChatMessage(node);
                        }
                        // 追加されたノードの子孫にチャットメッセージが含まれる場合（ネストされている場合など）
                        getElements(selectors.chatMessageWrapperSelector, node).forEach(processChatMessage);
                    }
                });
            });
        });

        // 監視を開始（子リストの変更と、サブツリーの変更を監視）
        chatObserver.observe(chatContainer, { childList: true, subtree: true });
        log("チャット監視を開始しました。");

        // 既に表示されているメッセージも処理する
        log("既存メッセージを処理中...");
        getElements(selectors.chatMessageWrapperSelector, chatContainer).forEach(processChatMessage);
    }

    // 初期化に必要な要素（チャット欄、設定ボタン）が表示されるのを待つ
    function waitForElements() {
        // 現在のページがライブ配信か、VOD/Clipかを判定
        const isStreaming = !location.pathname.startsWith('/videos/') && !location.pathname.includes('/clip/');
        setSelectors(isStreaming); // ページ種別に応じてセレクターを設定

        // DOMの変更を監視するMutationObserverを作成
        initObserver = new MutationObserver((mutations, observer) => {
            const chatContainer = getElement(selectors.chatScrollableArea); // チャット欄
            const chatSettingsBtn = getElement(selectors.chatSettingsButton); // 配置基準となる設定ボタン

            // チャット欄と設定ボタンの両方が見つかったら初期化処理へ
            if (chatContainer && chatSettingsBtn) {
                // 既に初期化済みでないかチェック（複数回発火することがあるため）
                if (!document.getElementById(`${SCRIPT_PREFIX}-panel-container`)) {
                    log("チャットコンテナと設定ボタンが見つかりました。");
                    initialize(chatContainer, chatSettingsBtn); // 初期化関数を呼び出す
                }
                // 必要な要素が見つかったら、このオブザーバーは停止する
                observer.disconnect();
                log("初期化監視を停止しました。");
            }
        });

        // body要素全体の変更（子要素の追加・削除、サブツリーの変更）を監視開始
        initObserver.observe(document.body, { childList: true, subtree: true });
        log("チャットコンテナとチャット設定ボタンを待機中...");
    }

    // --- 初期化処理 ---
    // スクリプトのメイン処理を開始する
    function initialize(chatContainer, settingsButtonElement) {
        // 二重初期化防止
        if (document.getElementById(`${SCRIPT_PREFIX}-panel-container`)) {
            log("初期化スキップ: 既に初期化済みです。");
            return;
        }
        log("Twitchチャットフィルターを初期化中...");
        config.load(); // 設定読み込み
        ui.createPanel(settingsButtonElement); // UI（フィルターボタンとパネル）を作成・配置
        observeChat(chatContainer); // チャット監視を開始
        log("初期化完了。");
    }

    // --- スクリプト開始 ---
    // ページの読み込み状態に応じてwaitForElementsを呼び出す
    // Tampermonkey 4.0以降のより信頼性の高い方法
    if (typeof GM_info === 'object' && GM_info.scriptHandler === 'Tampermonkey' && GM_info.version >= "4.0") {
        // 既にページが読み込み完了またはインタラクティブ状態なら即時実行
        if(document.readyState === 'complete' || document.readyState === 'interactive') {
            waitForElements();
        } else {
            // DOMContentLoadedイベントを待って実行（一度だけ実行）
            window.addEventListener('DOMContentLoaded', waitForElements, { once: true });
        }
    } else {
        // 古い環境や他のスクリプトマネージャー用のフォールバック
        if (document.readyState === 'loading') { // まだ読み込み中の場合
            document.addEventListener('DOMContentLoaded', waitForElements); // DOMContentLoadedを待つ
        } else { // 既に読み込み完了している場合
            waitForElements(); // 即時実行
        }
    }
})();