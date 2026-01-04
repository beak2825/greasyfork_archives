// ==UserScript==
// @name         Discord複数アカウント管理（キャッシュ対応版）
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Discordの複垢管理ツール（ユーザー情報をトークンごとにキャッシュして冗長な再取得を防止）
// @author       Freeze
// @match        https://discord.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      You can modify as long as you credit me
// @downloadURL https://update.greasyfork.org/scripts/537944/Discord%E8%A4%87%E6%95%B0%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E7%AE%A1%E7%90%86%EF%BC%88%E3%82%AD%E3%83%A3%E3%83%83%E3%82%B7%E3%83%A5%E5%AF%BE%E5%BF%9C%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/537944/Discord%E8%A4%87%E6%95%B0%E3%82%A2%E3%82%AB%E3%82%A6%E3%83%B3%E3%83%88%E7%AE%A1%E7%90%86%EF%BC%88%E3%82%AD%E3%83%A3%E3%83%83%E3%82%B7%E3%83%A5%E5%AF%BE%E5%BF%9C%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /***—— 定数・初期値 ——————————————————————————————————————————***/
    const maxGroups = ['A', 'B', 'C'];
    let currentGroup = GM_getValue('currentGroup', 'A');
    let isBoxVisible = GM_getValue('isBoxVisible', false);

    /***—— ユーザー情報キャッシュ管理関数 ——————————————————————————***/
    // キャッシュは { "<token>": "displayString", ... } の形式で保持する
    function loadUserInfoCache() {
        const raw = GM_getValue('userInfoCache', '{}');
        try {
            return JSON.parse(raw);
        } catch {
            return {};
        }
    }
    function saveUserInfoCache(cacheObj) {
        GM_setValue('userInfoCache', JSON.stringify(cacheObj));
    }
    function getCachedUserInfo(token) {
        const cache = loadUserInfoCache();
        return cache[token] || null;
    }
    function setCachedUserInfo(token, displayString) {
        const cache = loadUserInfoCache();
        cache[token] = displayString;
        saveUserInfoCache(cache);
    }

    /***—— Discord APIからユーザー情報を取得して<span>に表示し、キャッシュも更新 ——————————***/
    function fetchAndDisplayUserInfo(token, targetSpan) {
        fetch('https://discord.com/api/v9/users/@me', {
            headers: {
                'Authorization': token
            }
        })
        .then(res => {
            if (res.ok) return res.json();
            throw new Error('Invalid token');
        })
        .then(data => {
            // discriminator廃止後 → username のみ。global_nameがあれば併記
            const usernameOnly = data.username;
            const globalName = data.global_name || '';
            const displayText = globalName
                ? `${usernameOnly}（${globalName}）`
                : usernameOnly;

            targetSpan.textContent = displayText;
            // キャッシュに保存
            setCachedUserInfo(token, displayText);
        })
        .catch(() => {
            targetSpan.textContent = '無効なトークン';
        });
    }

    /***—— トグルボタン ——————————————————————————————————————————***/
    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = 'アカウント管理';
    Object.assign(toggleBtn.style, {
        position: 'fixed',
        bottom: '160px',
        right: '20px',
        padding: '8px 12px',
        backgroundColor: '#5865f2',
        color: '#ffffff',
        border: 'none',
        borderRadius: '6px',
        fontSize: '14px',
        cursor: 'pointer',
        zIndex: '1001',
        boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
        transition: 'background-color 0.2s',
    });
    toggleBtn.addEventListener('mouseenter', () => toggleBtn.style.backgroundColor = '#4752c4');
    toggleBtn.addEventListener('mouseleave', () => toggleBtn.style.backgroundColor = '#5865f2');
    document.body.appendChild(toggleBtn);
    toggleBtn.addEventListener('click', () => {
        isBoxVisible = !isBoxVisible;
        mainContainer.style.display = isBoxVisible ? 'block' : 'none';
        GM_setValue('isBoxVisible', isBoxVisible);
    });

    /***—— メインコンテナ ——————————————————————————————————————————***/
    const container = document.createElement('div');
    container.innerHTML = `
        <div id="mainContainer"
             style="
                position: fixed;
                bottom: 200px; right: 20px;
                width: 380px;
                height: 700px;
                background-color: #2f3136;
                color: #ffffff;
                border: 1px solid #202225;
                border-radius: 8px;
                z-index: 1000;
                box-shadow: 0 2px 10px rgba(0,0,0,0.5);
                font-family: 'Segoe UI', sans-serif;
             ">
            <!-- タイトルバー -->
            <div id="titleBar" style="
                display: flex;
                justify-content: space-between;
                align-items: center;
                background-color: #202225;
                padding: 10px 14px;
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
                user-select: none;
            ">
                <span style="font-size: 16px; font-weight: 600;">Discordアカウント管理</span>
                <button id="closeButton" style="
                    background: none;
                    border: none;
                    color: #b9bbbe;
                    font-size: 18px;
                    cursor: pointer;
                ">×</button>
            </div>

            <!-- コンテンツ本体 -->
            <div id="content" style="
                display: block;
                padding: 14px;
                max-height: 632px; /* 700px - タイトルバー(≈38px) */
                overflow-y: auto;
            ">

                <!-- グループ切り替え -->
                <div id="groupButtons" style="
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 18px;
                ">
                    ${maxGroups.map(g => `
                        <button class="groupBtn" data-group="${g}"
                                style="
                                    flex: 1;
                                    margin-right: ${g !== 'C' ? '8px' : '0'};
                                    padding: 10px 0;
                                    background-color: #2f3136;
                                    color: #ffffff;
                                    border: 1px solid #36393f;
                                    border-radius: 4px;
                                    font-size: 14px;
                                    cursor: pointer;
                                    transition: background-color 0.2s, border-color 0.2s;
                                ">
                            グループ${g}
                        </button>
                    `).join('')}
                </div>

                <!-- TOKEN セクション -->
                <div id="tokenSection" style="
                    border: 1px solid #36393f;
                    border-radius: 6px;
                    margin-bottom: 18px;
                    background-color: #2f3136;
                ">
                    <div style="
                        background-color: #5865f2;
                        padding: 8px 12px;
                        border-top-left-radius: 6px;
                        border-top-right-radius: 6px;
                    ">
                        <span style="color: #ffffff; font-size: 14px; font-weight: 500;">TOKEN</span>
                    </div>

                    <div id="tokenList" style="padding: 12px;">
                        <!-- トークン行はここに JavaScript で動的に追加 -->
                    </div>

                    <div style="padding: 0 12px 12px 12px;">
                        <button id="addTokenBtn" style="
                            width: 100%;
                            padding: 10px;
                            background-color: #43b581;
                            color: #ffffff;
                            border: none;
                            border-radius: 4px;
                            font-size: 14px;
                            cursor: pointer;
                            transition: background-color 0.2s;
                        ">＋ トークン追加</button>
                    </div>
                </div>

                <!-- リダイレクト・チャンネル URL 入力 -->
                <div style="margin-bottom: 14px; display: flex; align-items: center;">
                    <input type="text" id="urlInput"
                           placeholder="リダイレクト用招待URL"
                           style="
                               flex: 1;
                               padding: 8px;
                               background-color: #202225;
                               color: #ffffff;
                               border: 1px solid #5865f2;
                               border-radius: 4px;
                               font-size: 13px;
                           ">
                    <span style="margin-left: 6px; color: #b9bbbe; font-size: 12px;">(任意)</span>
                </div>
                <div style="margin-bottom: 18px; display: flex; align-items: center;">
                    <input type="text" id="channelUrlInput"
                           placeholder="チャンネル/メッセージURL"
                           style="
                               flex: 1;
                               padding: 8px;
                               background-color: #202225;
                               color: #ffffff;
                               border: 1px solid #5865f2;
                               border-radius: 4px;
                               font-size: 13px;
                           ">
                    <span style="margin-left: 6px; color: #b9bbbe; font-size: 12px;">(任意)</span>
                </div>

                <!-- 新しいタブで開く チェックボックス -->
                <div style="display: flex; align-items: center; margin-bottom: 18px;">
                    <input type="checkbox" id="newTabCheckbox" style="width: 18px; height: 18px; margin-right: 8px;">
                    <label for="newTabCheckbox" style="color: #ffffff; font-size: 14px; cursor: pointer;">新しいタブで開く</label>
                </div>

                <!-- 警告メッセージ -->
                <div style="margin-bottom: 8px;">
                    <span style="color: #faa81a; font-size: 13px;">⚠️ ログアウトするとトークンがリセットされます</span>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const mainContainer   = document.getElementById('mainContainer');
    const content         = document.getElementById('content');
    const closeButton     = document.getElementById('closeButton');
    const addTokenBtn     = document.getElementById('addTokenBtn');
    const tokenList       = document.getElementById('tokenList');
    const urlInput        = document.getElementById('urlInput');
    const channelUrlInput = document.getElementById('channelUrlInput');
    const newTabCheckbox  = document.getElementById('newTabCheckbox');
    const groupButtons    = document.querySelectorAll('.groupBtn');

    /***—— 初期表示設定 ——————————————————————————————————————————***/
    function renderContainerState() {
        content.style.display = 'block';
    }
    renderContainerState();
    mainContainer.style.display = isBoxVisible ? 'block' : 'none';

    function updateGroupButtonStyles() {
        groupButtons.forEach(btn => {
            if (btn.dataset.group === currentGroup) {
                btn.style.backgroundColor = '#5865f2';
                btn.style.color = '#ffffff';
                btn.style.borderColor = '#5865f2';
            } else {
                btn.style.backgroundColor = '#2f3136';
                btn.style.color = '#b9bbbe';
                btn.style.borderColor = '#36393f';
                btn.addEventListener('mouseenter', () => { btn.style.backgroundColor = '#3a3c43'; });
                btn.addEventListener('mouseleave', () => { if (btn.dataset.group !== currentGroup) btn.style.backgroundColor = '#2f3136'; });
            }
        });
    }
    updateGroupButtonStyles();

    // グループごとの保存データを初期ロード
    urlInput.value         = GM_getValue(`${currentGroup}_urlInput`, '');
    channelUrlInput.value  = GM_getValue(`${currentGroup}_channelUrlInput`, '');
    newTabCheckbox.checked = GM_getValue('newTabCheckbox', false);

    closeButton.addEventListener('click', () => {
        isBoxVisible = false;
        mainContainer.style.display = 'none';
        GM_setValue('isBoxVisible', isBoxVisible);
    });

    /***—— グループ切り替えロジック ——————————————————————————***/
    groupButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            saveTokenRowsToStorage();
            currentGroup = btn.dataset.group;
            GM_setValue('currentGroup', currentGroup);

            loadTokensFromStorage();

            // グループごとの URL/ChannelURL を即時反映
            urlInput.value         = GM_getValue(`${currentGroup}_urlInput`, '');
            channelUrlInput.value  = GM_getValue(`${currentGroup}_channelUrlInput`, '');
            newTabCheckbox.checked = GM_getValue('newTabCheckbox', false);
            updateGroupButtonStyles();
        });
    });

    /***—— トークン行 を動的に管理 —————————————————————————***/
    function createTokenRow(savedToken = '') {
        // 親コンテナ：上下２段で配置
        const rowDiv = document.createElement('div');
        rowDiv.className = 'tokenRow';
        Object.assign(rowDiv.style, {
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#2f3136',
            padding: '8px',
            borderRadius: '4px',
            marginBottom: '10px',
            transition: 'background-color 0.2s',
        });
        rowDiv.addEventListener('mouseenter', () => rowDiv.style.backgroundColor = '#3a3c43');
        rowDiv.addEventListener('mouseleave', () => rowDiv.style.backgroundColor = '#2f3136');

        // —— 上段：トークン入力 + ボタン群 ——
        const topRow = document.createElement('div');
        topRow.style.display = 'flex';
        topRow.style.alignItems = 'center';

        // トークン入力フィールド
        const input = document.createElement('input');
        input.type = 'text';
        input.value = savedToken;
        input.placeholder = 'MTM1NjI0NzYwNzQ1MzEyMzQ1…';
        Object.assign(input.style, {
            flex: '1',
            padding: '6px 8px',
            marginRight: '8px',
            backgroundColor: '#202225',
            color: '#32CD32',
            border: '1px solid #32CD32',
            borderRadius: '4px',
            fontSize: '13px'
        });
        input.addEventListener('input', () => {
            // 入力が変わったらキャッシュを確認し、必要なら保存処理を呼ぶ
            saveTokenRowsToStorage();
        });

        // 「ログイン」ボタン
        const loginBtn = document.createElement('button');
        loginBtn.textContent = 'ログイン';
        Object.assign(loginBtn.style, {
            padding: '6px 10px',
            marginRight: '6px',
            backgroundColor: '#5865f2',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
        });
        loginBtn.addEventListener('mouseenter', () => loginBtn.style.backgroundColor = '#4752c4');
        loginBtn.addEventListener('mouseleave', () => loginBtn.style.backgroundColor = '#5865f2');

        // 「削除」ボタン
        const delBtn = document.createElement('button');
        delBtn.textContent = '削除';
        Object.assign(delBtn.style, {
            padding: '6px 10px',
            backgroundColor: '#ed4245',
            color: '#ffffff',
            border: 'none',
            borderRadius: '4px',
            fontSize: '13px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
        });
        delBtn.addEventListener('mouseenter', () => delBtn.style.backgroundColor = '#c23b3b');
        delBtn.addEventListener('mouseleave', () => delBtn.style.backgroundColor = '#ed4245');

        // ログインボタン押下時の動作
        loginBtn.addEventListener('click', () => {
            const token = input.value.trim();
            if (!token) {
                alert('有効なトークンを入力してください！');
                return;
            }
            doLoginWithToken(token);
            setActiveTokenRow(rowDiv);
            GM_setValue(`${currentGroup}_lastToken`, token);
            saveTokenRowsToStorage();
        });

        // 削除ボタン押下時
        delBtn.addEventListener('click', () => {
            tokenList.removeChild(rowDiv);
            saveTokenRowsToStorage();
        });

        topRow.appendChild(input);
        topRow.appendChild(loginBtn);
        topRow.appendChild(delBtn);

        // —— 下段：ユーザー情報表示用の<span> ——
        const bottomRow = document.createElement('div');
        bottomRow.style.display = 'flex';
        bottomRow.style.alignItems = 'center';
        bottomRow.style.marginTop = '6px';
        bottomRow.style.marginLeft = '4px'; // 入力欄と揃える余白

        const userInfoSpan = document.createElement('span');
        Object.assign(userInfoSpan.style, {
            fontSize: '12px',
            color: '#b9bbbe',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '260px'
        });

        // フォーカスアウト時にユーザー情報を取得 or キャッシュを反映
        input.addEventListener('blur', () => {
            const token = input.value.trim();
            if (token) {
                const cached = getCachedUserInfo(token);
                if (cached) {
                    // キャッシュがあればそれを表示
                    userInfoSpan.textContent = cached;
                } else {
                    // キャッシュがなければ API で取得してキャッシュ
                    fetchAndDisplayUserInfo(token, userInfoSpan);
                }
            } else {
                userInfoSpan.textContent = '';
            }
        });

        // 既存トークンがあれば、キャッシュをチェックして初期表示
        if (savedToken) {
            const cached = getCachedUserInfo(savedToken);
            if (cached) {
                userInfoSpan.textContent = cached;
            } else {
                fetchAndDisplayUserInfo(savedToken, userInfoSpan);
            }
        }

        bottomRow.appendChild(userInfoSpan);

        // 行を組み立てる
        rowDiv.appendChild(topRow);
        rowDiv.appendChild(bottomRow);

        return rowDiv;
    }

    function saveTokenRowsToStorage() {
        const rows = tokenList.querySelectorAll('.tokenRow');
        const tokens = [];
        rows.forEach(r => {
            const val = r.querySelector('input').value;
            tokens.push(val);
        });
        GM_setValue(`${currentGroup}_tokens`, tokens.join('\n'));
    }

    function loadTokensFromStorage() {
        tokenList.innerHTML = '';
        const raw = GM_getValue(`${currentGroup}_tokens`, '');
        if (raw !== '') {
            raw.split('\n').forEach(token => {
                const row = createTokenRow(token);
                tokenList.appendChild(row);
            });
        }
        // 最後に使ったトークンをハイライト
        const lastToken = GM_getValue(`${currentGroup}_lastToken`, '');
        if (lastToken) {
            tokenList.querySelectorAll('.tokenRow').forEach(r => {
                const txt = r.querySelector('input').value.trim();
                if (txt === lastToken) {
                    setActiveTokenRow(r);
                }
            });
        }
        // 保存が空なら空行を1つ生成
        if (!tokenList.querySelector('.tokenRow')) {
            const blank = createTokenRow('');
            tokenList.appendChild(blank);
        }
    }

    function setActiveTokenRow(rowDiv) {
        tokenList.querySelectorAll('.tokenRow button').forEach(btn => {
            if (btn.textContent === 'ログイン') btn.style.backgroundColor = '#5865f2';
        });
        const loginBtn = rowDiv.querySelector('button');
        loginBtn.style.backgroundColor = '#2f8bfd';
    }

    loadTokensFromStorage();

    addTokenBtn.addEventListener('click', () => {
        const newRow = createTokenRow('');
        tokenList.appendChild(newRow);
        saveTokenRowsToStorage();
        newRow.querySelector('input').focus();
    });

    /***—— トークンで実際にログインする関数 —————————————————————————***/
    function doLoginWithToken(token) {
        const iframe = document.createElement('iframe');
        document.body.appendChild(iframe);
        iframe.contentWindow.localStorage.token = `\"${token}\"`;
        document.body.removeChild(iframe);
        setTimeout(() => {
            const rawUrl = urlInput.value.trim();
            let redirectLink = '';
            if (rawUrl) {
                if (rawUrl.startsWith('discord.gg/')) {
                    redirectLink = `https://${rawUrl}`;
                } else if (!rawUrl.startsWith('http://') && !rawUrl.startsWith('https://')) {
                    redirectLink = `https://discord.gg/${rawUrl}`;
                } else {
                    redirectLink = rawUrl;
                }
            }
            if (!redirectLink) redirectLink = 'https://discord.com/app';
            if (newTabCheckbox.checked) {
                window.open(redirectLink, '_blank');
            } else {
                window.location.href = redirectLink;
            }
        }, 800);
    }

    // URL周りとチェックボックスは入力・クリック時に即時保存
    urlInput.addEventListener('input', () => {
        GM_setValue(`${currentGroup}_urlInput`, urlInput.value);
    });
    channelUrlInput.addEventListener('input', () => {
        GM_setValue(`${currentGroup}_channelUrlInput`, channelUrlInput.value);
    });
    newTabCheckbox.addEventListener('change', () => {
        GM_setValue('newTabCheckbox', newTabCheckbox.checked);
    });

    window.addEventListener('load', () => {
        mainContainer.style.display = isBoxVisible ? 'block' : 'none';
        renderContainerState();
        loadTokensFromStorage();
        updateGroupButtonStyles();
    });
})();
