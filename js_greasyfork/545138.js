// ==UserScript==
// @name         Discord NawaRaider - Complete Edition
// @namespace    https://discord.com/
// @version      2.0.0
// @description  Complete Discord raid tool with all features integrated into Discord web interface
// @author       NawaRaider
// @license      Proprietary - All Rights Reserved
// @copyright    2024 NawaRaider. All rights reserved.
// @match        https://discord.com/*
// @match        https://canary.discord.com/*
// @match        https://ptb.discord.com/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545138/Discord%20NawaRaider%20-%20Complete%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/545138/Discord%20NawaRaider%20-%20Complete%20Edition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Discord トークン自動取得
    function getDiscordToken() {
        try {
            const token = JSON.parse(localStorage.getItem('token'));
            return token ? `"${token}"` : null;
        } catch {
            try {
                return Object.values(webpackChunkdiscord_app.push([
                    [''], {}, e => e
                ]).c).find(e => e?.exports?.default?.getToken !== void 0).exports.default.getToken();
            } catch {
                return null;
            }
        }
    }

    // 現在のサーバーIDとチャンネルID取得
    function getCurrentIds() {
        const url = window.location.pathname;
        const match = url.match(/\/channels\/(\d+)\/(\d+)/);
        return match ? { serverId: match[1], channelId: match[2] } : { serverId: null, channelId: null };
    }

    let nawaRaiderUI = null;
    let intervalIds = [];
    let isRunning = false;
    let isMinimized = false;

    const STORAGE_KEY = 'nawaraider_complete_data';

    // ユーティリティ関数
    const parseList = (input) => [...new Set(input.split(/[\s,\n]+/).map(item => item.trim()).filter(Boolean))];
    const shuffleArray = (array) => { 
        for (let i = array.length - 1; i > 0; i--) { 
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; 
        } 
        return array; 
    };

    function generateRandomString(length) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    // UIの作成
    function createUI() {
        if (nawaRaiderUI) return;

        const style = document.createElement('style');
        style.textContent = `
            .nawa-raider-ui {
                position: fixed; top: 20px; right: 20px; width: 450px; max-height: 85vh;
                background: linear-gradient(145deg, #0f071a 0%, #2a1a4a 100%);
                border: 3px solid transparent; border-radius: 20px; padding: 25px;
                font-family: 'Whitney', 'Helvetica Neue', Helvetica, Arial, sans-serif;
                color: #f3e8ff; font-size: 13px; z-index: 99999;
                overflow-y: auto; box-shadow: 0 15px 40px rgba(0,0,0,0.6);
                backdrop-filter: blur(15px);
                background-clip: padding-box;
            }
            .nawa-raider-ui::before {
                content: ''; position: absolute; top: -3px; left: -3px;
                width: calc(100% + 6px); height: calc(100% + 6px);
                background: linear-gradient(60deg, #f79533, #f37055, #ef4e7b, #a166ab, #5073b8, #1098ad, #07b39b, #6fba82);
                background-size: 300% 300%; border-radius: 20px;
                animation: rainbow-border 4s linear infinite; z-index: -1;
            }
            @keyframes rainbow-border {
                0%{background-position:0% 50%}
                50%{background-position:100% 50%}
                100%{background-position:0% 50%}
            }
            .nawa-raider-ui.minimized {
                height: 60px; overflow: hidden;
            }
            .nawa-raider-ui h3 {
                color: #a855f7; text-align: center; margin-bottom: 20px; font-size: 24px;
                background: linear-gradient(90deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3);
                background-size: 400% 400%; -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                animation: rainbow-text 10s ease infinite; cursor: pointer;
            }
            @keyframes rainbow-text {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
            }
            .nawa-content { display: block; }
            .nawa-content.hidden { display: none; }
            .nawa-field { margin-bottom: 15px; }
            .nawa-label { 
                display: block; margin-bottom: 8px; font-weight: 600; 
                color: #a855f7; font-size: 12px; letter-spacing: 0.5px;
            }
            .nawa-input, .nawa-textarea {
                width: 100%; padding: 10px; background: rgba(255, 255, 255, 0.1); 
                border: 1px solid rgba(168, 85, 247, 0.3); border-radius: 8px; 
                color: #f3e8ff; font-size: 12px; transition: all 0.3s ease;
            }
            .nawa-input:focus, .nawa-textarea:focus {
                outline: none; border-color: #a855f7; 
                box-shadow: 0 0 0 3px rgba(168,85,247,0.3);
            }
            .nawa-textarea { resize: vertical; min-height: 50px; font-family: monospace; }
            .nawa-btn {
                padding: 10px 15px; border: none; border-radius: 8px; cursor: pointer;
                font-weight: 600; font-size: 11px; margin: 3px; transition: all 0.3s ease;
                text-transform: uppercase; letter-spacing: 0.5px;
            }
            .nawa-btn-primary { background: linear-gradient(45deg, #a855f7, #d8b4fe); color: #0f071a; }
            .nawa-btn-danger { background: linear-gradient(45deg, #ef4444, #f87171); color: white; }
            .nawa-btn-warning { background: linear-gradient(45deg, #f59e0b, #fbbf24); color: #0f071a; }
            .nawa-btn-success { background: linear-gradient(45deg, #10b981, #34d399); color: white; }
            .nawa-btn-info { background: linear-gradient(45deg, #3b82f6, #60a5fa); color: white; }
            .nawa-btn:disabled { background: #4b5563; color: #9ca3af; cursor: not-allowed; }
            .nawa-btn:hover:not(:disabled) { transform: translateY(-2px); }
            .nawa-flex { display: flex; gap: 8px; flex-wrap: wrap; }
            .nawa-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .nawa-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
            .nawa-switch-container { 
                display: flex; justify-content: space-between; align-items: center;
                padding: 8px; background: rgba(0,0,0,0.2); border-radius: 8px;
            }
            .nawa-switch {
                position: relative; width: 45px; height: 24px; background: #4b5563;
                border-radius: 24px; cursor: pointer; transition: 0.3s;
            }
            .nawa-switch.active { background: #a855f7; }
            .nawa-switch::after {
                content: ''; position: absolute; width: 20px; height: 20px;
                border-radius: 50%; background: white; top: 2px; left: 2px;
                transition: 0.3s; box-shadow: 0 2px 4px rgba(0,0,0,0.2);
            }
            .nawa-switch.active::after { transform: translateX(21px); }
            .nawa-logs {
                height: 150px; background: rgba(0, 0, 0, 0.4); 
                border: 1px solid rgba(168, 85, 247, 0.2); border-radius: 8px; 
                padding: 10px; overflow-y: auto; font-size: 11px;
                font-family: 'Consolas', monospace;
            }
            .nawa-log-error { color: #f87171; }
            .nawa-log-success { color: #10b981; }
            .nawa-log-info { color: #60a5fa; }
            .nawa-log-warning { color: #fbbf24; }
            .nawa-toggle-btn {
                position: fixed; top: 20px; right: 480px; z-index: 100000;
                background: linear-gradient(45deg, #a855f7, #d8b4fe); color: #0f071a; 
                border: none; border-radius: 15px; padding: 12px 20px; 
                cursor: pointer; font-weight: 600; font-size: 12px;
                box-shadow: 0 4px 15px rgba(168, 85, 247, 0.4);
            }
            .nawa-status {
                position: fixed; bottom: 20px; right: 20px; padding: 10px 20px;
                background: rgba(15, 7, 26, 0.95); border-radius: 20px; font-size: 12px;
                border: 2px solid #a855f7; color: #f3e8ff; z-index: 99998;
                backdrop-filter: blur(10px);
            }
            .nawa-status.active {
                border-color: #10b981; background: rgba(16, 185, 129, 0.2);
                animation: pulse 2s infinite;
            }
            @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.7; } }
            .nawa-section {
                margin-bottom: 20px; padding: 15px; 
                background: rgba(0,0,0,0.2); border-radius: 10px;
                border-left: 4px solid #a855f7;
            }
            .nawa-section-title {
                font-size: 14px; font-weight: 700; color: #d8b4fe; 
                margin-bottom: 15px; text-transform: uppercase; 
                letter-spacing: 1px;
            }
            .nawa-note {
                font-size: 10px; color: #d8b4fe; margin-top: 5px; 
                font-style: italic; opacity: 0.8;
            }
            .nawa-hidden { display: none !important; }
            
            /* スクロールバー */
            .nawa-raider-ui::-webkit-scrollbar, .nawa-logs::-webkit-scrollbar { width: 8px; }
            .nawa-raider-ui::-webkit-scrollbar-track, .nawa-logs::-webkit-scrollbar-track { 
                background: rgba(0, 0, 0, 0.2); border-radius: 4px; 
            }
            .nawa-raider-ui::-webkit-scrollbar-thumb, .nawa-logs::-webkit-scrollbar-thumb { 
                background: #a855f7; border-radius: 4px; 
            }
        `;
        document.head.appendChild(style);

        // トグルボタン
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'nawa-toggle-btn';
        toggleBtn.innerHTML = '🔥 NawaRaider';
        toggleBtn.onclick = () => {
            if (nawaRaiderUI.style.display === 'none') {
                nawaRaiderUI.style.display = 'block';
                toggleBtn.innerHTML = '❌ Hide';
            } else {
                nawaRaiderUI.style.display = 'none';
                toggleBtn.innerHTML = '🔥 NawaRaider';
            }
        };
        document.body.appendChild(toggleBtn);

        // メインUI
        nawaRaiderUI = document.createElement('div');
        nawaRaiderUI.className = 'nawa-raider-ui';
        nawaRaiderUI.innerHTML = `
            <h3 id="nawa-title">🔥 Nawa Raider 🔥</h3>
            
            <div class="nawa-content" id="nawa-content">
                <div class="nawa-section">
                    <div class="nawa-section-title">📡 接続設定</div>
                    
                    <div class="nawa-field">
                        <label class="nawa-label">🎫 トークン (複数可):</label>
                        <textarea class="nawa-textarea" id="nawa-tokens" rows="3" placeholder="1行に1つずつ入力"></textarea>
                        <div class="nawa-note">自動取得済み。複数アカウントを使う場合は追加してください。</div>
                    </div>

                    <div class="nawa-grid">
                        <div class="nawa-field">
                            <label class="nawa-label">🏠 サーバーID:</label>
                            <input class="nawa-input" type="text" id="nawa-server-id">
                        </div>
                        <div class="nawa-field">
                            <label class="nawa-label">📋 チャンネルID:</label>
                            <input class="nawa-input" type="text" id="nawa-channel-id">
                        </div>
                    </div>

                    <div class="nawa-field">
                        <label class="nawa-label">📝 チャンネルID一覧 (複数可):</label>
                        <textarea class="nawa-textarea" id="nawa-channel-list" rows="3" placeholder="1行に1つずつ入力。チャンネル別間隔の場合は 'ID,間隔ms' で入力"></textarea>
                        <div class="nawa-note" id="channel-interval-note" style="display:none;">形式: チャンネルID,送信間隔(ms)</div>
                    </div>

                    <div class="nawa-flex">
                        <button class="nawa-btn nawa-btn-info" id="nawa-fetch-channels">📋 CH取得</button>
                        <button class="nawa-btn nawa-btn-info" id="nawa-fetch-users">👥 User取得</button>
                        <button class="nawa-btn nawa-btn-warning" id="nawa-leave-server">🚪 サーバー退出</button>
                    </div>
                </div>

                <div class="nawa-section">
                    <div class="nawa-section-title">👥 メンション設定</div>
                    
                    <div class="nawa-field">
                        <label class="nawa-label">🎯 メンション対象ユーザーID:</label>
                        <textarea class="nawa-textarea" id="nawa-user-ids" rows="3" placeholder="1行に1つずつ入力"></textarea>
                    </div>

                    <div class="nawa-field">
                        <label class="nawa-label">🔢 メンション人数:</label>
                        <input class="nawa-input" type="number" id="nawa-mention-count" min="0" value="0">
                    </div>
                </div>

                <div class="nawa-section">
                    <div class="nawa-section-title">⚙️ 送信設定</div>
                    
                    <div class="nawa-grid">
                        <div class="nawa-field">
                            <label class="nawa-label">⏰ 送信間隔 (ms):</label>
                            <input class="nawa-input" type="number" id="nawa-interval" value="2000" min="100">
                        </div>
                        <div class="nawa-field" id="repeat-count-group">
                            <label class="nawa-label">🔄 繰り返し回数 (0=無限):</label>
                            <input class="nawa-input" type="number" id="nawa-repeat" value="0" min="0">
                        </div>
                    </div>

                    <div class="nawa-field" id="random-chars-group" style="display:none;">
                        <label class="nawa-label">🎲 ランダム文字数:</label>
                        <input class="nawa-input" type="number" id="nawa-random-length" value="5" min="1" max="50">
                    </div>

                    <div class="nawa-grid-3">
                        <div class="nawa-switch-container">
                            <span class="nawa-label">🔄 繰り返し</span>
                            <div class="nawa-switch" id="nawa-repeat-toggle"></div>
                        </div>
                        <div class="nawa-switch-container">
                            <span class="nawa-label">🎲 ランダム文字</span>
                            <div class="nawa-switch" id="nawa-random-toggle"></div>
                        </div>
                        <div class="nawa-switch-container">
                            <span class="nawa-label">⏱️ チャンネル別間隔</span>
                            <div class="nawa-switch" id="nawa-channel-interval-toggle"></div>
                        </div>
                    </div>

                    <div class="nawa-switch-container">
                        <span class="nawa-label">🗳️ 投票機能</span>
                        <div class="nawa-switch" id="nawa-poll-toggle"></div>
                    </div>
                </div>

                <div class="nawa-section" id="poll-section" style="display:none;">
                    <div class="nawa-section-title">🗳️ 投票設定</div>
                    
                    <div class="nawa-field">
                        <label class="nawa-label">❓ 投票の質問:</label>
                        <input class="nawa-input" type="text" id="nawa-poll-question" placeholder="投票の質問を入力">
                    </div>

                    <div class="nawa-field">
                        <label class="nawa-label">📝 選択肢 (1行に1つ, 最大20):</label>
                        <textarea class="nawa-textarea" id="nawa-poll-options" rows="4" placeholder="選択肢1\n選択肢2\n選択肢3"></textarea>
                    </div>
                </div>

                <div class="nawa-section" id="message-section">
                    <div class="nawa-section-title">💬 メッセージ設定</div>
                    
                    <div class="nawa-field">
                        <label class="nawa-label">📝 送信メッセージ:</label>
                        <textarea class="nawa-textarea" id="nawa-message" rows="4" placeholder="送信するメッセージ。{mention} でメンション位置を指定可能"></textarea>
                        <div class="nawa-note">ヒント: {mention} を使うとその位置にメンションが挿入されます</div>
                    </div>
                </div>

                <div class="nawa-section">
                    <div class="nawa-section-title">🎮 操作</div>
                    
                    <div class="nawa-flex">
                        <button class="nawa-btn nawa-btn-primary" id="nawa-start">🚀 発射開始</button>
                        <button class="nawa-btn nawa-btn-danger" id="nawa-stop" disabled>⏹️ 緊急停止</button>
                        <button class="nawa-btn nawa-btn-success" id="nawa-clear-logs">🗑️ ログクリア</button>
                        <button class="nawa-btn nawa-btn-warning" id="nawa-clear-data">💾 データクリア</button>
                    </div>
                </div>

                <div class="nawa-section">
                    <div class="nawa-section-title">📊 ログ</div>
                    <div class="nawa-logs" id="nawa-logs"></div>
                </div>
            </div>
        `;
        document.body.appendChild(nawaRaiderUI);

        // ステータス表示
        const status = document.createElement('div');
        status.className = 'nawa-status';
        status.id = 'nawa-status';
        status.textContent = 'バックグラウンド: 停止';
        document.body.appendChild(status);

        initializeUI();
    }

    // UI初期化
    function initializeUI() {
        const elements = {
            tokens: document.getElementById('nawa-tokens'),
            serverId: document.getElementById('nawa-server-id'),
            channelId: document.getElementById('nawa-channel-id'),
            channelList: document.getElementById('nawa-channel-list'),
            userIds: document.getElementById('nawa-user-ids'),
            mentionCount: document.getElementById('nawa-mention-count'),
            interval: document.getElementById('nawa-interval'),
            repeat: document.getElementById('nawa-repeat'),
            randomLength: document.getElementById('nawa-random-length'),
            pollQuestion: document.getElementById('nawa-poll-question'),
            pollOptions: document.getElementById('nawa-poll-options'),
            message: document.getElementById('nawa-message'),
            
            // トグル
            repeatToggle: document.getElementById('nawa-repeat-toggle'),
            randomToggle: document.getElementById('nawa-random-toggle'),
            channelIntervalToggle: document.getElementById('nawa-channel-interval-toggle'),
            pollToggle: document.getElementById('nawa-poll-toggle'),
            
            // ボタン
            startBtn: document.getElementById('nawa-start'),
            stopBtn: document.getElementById('nawa-stop'),
            fetchChannelsBtn: document.getElementById('nawa-fetch-channels'),
            fetchUsersBtn: document.getElementById('nawa-fetch-users'),
            leaveServerBtn: document.getElementById('nawa-leave-server'),
            clearLogsBtn: document.getElementById('nawa-clear-logs'),
            clearDataBtn: document.getElementById('nawa-clear-data'),
            
            // その他
            logs: document.getElementById('nawa-logs'),
            status: document.getElementById('nawa-status'),
            title: document.getElementById('nawa-title'),
            content: document.getElementById('nawa-content'),
            
            // セクション
            pollSection: document.getElementById('poll-section'),
            messageSection: document.getElementById('message-section'),
            repeatCountGroup: document.getElementById('repeat-count-group'),
            randomCharsGroup: document.getElementById('random-chars-group'),
            channelIntervalNote: document.getElementById('channel-interval-note')
        };

        // 自動でトークンとIDを設定
        const token = getDiscordToken();
        if (token) elements.tokens.value = token;
        
        updateCurrentIds();

        // ログ出力関数
        function log(msg, type = 'info') {
            const time = new Date().toLocaleTimeString('ja-JP');
            const div = document.createElement('div');
            div.className = `nawa-log-${type}`;
            div.textContent = `[${time}] ${msg}`;
            elements.logs.appendChild(div);
            elements.logs.scrollTop = elements.logs.scrollHeight;
        }

        // 現在のIDを更新
        function updateCurrentIds() {
            const ids = getCurrentIds();
            if (ids.serverId && elements.serverId) elements.serverId.value = ids.serverId;
            if (ids.channelId && elements.channelId) elements.channelId.value = ids.channelId;
        }

        // ミニマイズ機能
        elements.title.onclick = () => {
            isMinimized = !isMinimized;
            nawaRaiderUI.classList.toggle('minimized', isMinimized);
            elements.content.classList.toggle('nawa-hidden', isMinimized);
        };

        // トグル機能の設定
        const toggleStates = {
            repeat: false,
            random: false,
            channelInterval: false,
            poll: false
        };

        function setupToggle(toggleElement, stateName, callback) {
            toggleElement.onclick = () => {
                toggleStates[stateName] = !toggleStates[stateName];
                toggleElement.classList.toggle('active', toggleStates[stateName]);
                if (callback) callback(toggleStates[stateName]);
                saveData();
            };
        }

        setupToggle(elements.repeatToggle, 'repeat', (enabled) => {
            elements.repeatCountGroup.style.display = enabled ? 'block' : 'none';
        });

        setupToggle(elements.randomToggle, 'random', (enabled) => {
            elements.randomCharsGroup.style.display = enabled ? 'block' : 'none';
        });

        setupToggle(elements.channelIntervalToggle, 'channelInterval', (enabled) => {
            elements.channelIntervalNote.style.display = enabled ? 'block' : 'none';
            document.getElementById('repeat-count-group').style.display = enabled ? 'none' : (toggleStates.repeat ? 'block' : 'none');
            if (enabled) {
                toggleStates.repeat = false;
                elements.repeatToggle.classList.remove('active');
            }
        });

        setupToggle(elements.pollToggle, 'poll', (enabled) => {
            elements.pollSection.style.display = enabled ? 'block' : 'none';
            elements.messageSection.style.display = enabled ? 'none' : 'block';
        });

        // API送信関数
        async function sendApiRequest(token, channelId, payload) {
            if (!isRunning) return;
            
            try {
                const response = await fetch(`https://discord.com/api/v10/channels/${channelId}/messages`, {
                    method: 'POST',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                const data = await response.json();
                
                if (response.ok) {
                    log(`送信成功: ch=${channelId}`, 'success');
                } else if (response.status === 429) {
                    const waitTime = (data.retry_after * 1000 || 1000) + 200;
                    log(`レート制限: ${waitTime / 1000}秒待機中...`, 'warning');
                    await new Promise(r => setTimeout(r, waitTime));
                    if (isRunning) await sendApiRequest(token, channelId, payload);
                } else {
                    log(`送信エラー: ch=${channelId} status=${response.status} ${JSON.stringify(data.message || data.errors)}`, 'error');
                }
            } catch (err) {
                log(`送信例外: ${err.message}`, 'error');
            }
        }

        // チャンネル取得
        elements.fetchChannelsBtn.onclick = async () => {
            const token = parseList(elements.tokens.value)[0];
            const serverId = elements.serverId.value.trim();
            
            if (!token || !serverId) {
                log('トークンとサーバーIDが必要です', 'error');
                return;
            }

            log('チャンネルIDを取得中...', 'info');
            
            try {
                const response = await fetch(`https://discord.com/api/v10/guilds/${serverId}/channels`, {
                    headers: { 'Authorization': token }
                });

                if (response.ok) {
                    const channels = await response.json();
                    const textChannels = channels.filter(c => c.type === 0);
                    const channelIds = textChannels.map(c => c.id);
                    
                    elements.channelList.value = channelIds.join('\n');
                    log(`${textChannels.length}件のテキストチャンネルIDを取得`, 'success');
                } else {
                    log(`チャンネル取得エラー: ${response.status}`, 'error');
                }
            } catch (err) {
                log(`チャンネル取得例外: ${err.message}`, 'error');
            }
        };

        // ユーザー取得（WebSocket版）
        async function fetchUsers(serverId, token, channelIds) {
            log('ユーザーID取得を開始します (WebSocket)...', 'info');
            try {
                const ws = new WebSocket('wss://gateway.discord.gg/?v=9&encoding=json');
                
                ws.onopen = () => {
                    ws.send(JSON.stringify({
                        op: 2,
                        d: {
                            token: token,
                            properties: {
                                os: 'Windows',
                                browser: 'Discord',
                                device: 'pc'
                            },
                            intents: 1 << 12
                        }
                    }));
                };
                
                ws.onmessage = (event) => {
                    const data = JSON.parse(event.data);
                    if (data.t === 'READY') {
                        ws.send(JSON.stringify({
                            op: 14,
                            d: {
                                guild_id: serverId,
                                typing: false,
                                activities: false,
                                threads: true,
                                channels: { [channelIds[0]]: [[0, 0]] }
                            }
                        }));
                    }
                    if (data.t === 'GUILD_MEMBER_LIST_UPDATE') {
                        const userIds = data.d.ops[0].items
                            .filter(item => item.member)
                            .map(item => item.member.user.id);
                        
                        if (userIds.length) {
                            const existingIds = new Set(parseList(elements.userIds.value));
                            userIds.forEach(id => existingIds.add(id));
                            elements.userIds.value = [...existingIds].join('\n');
                            log(`ユーザーIDを${userIds.length}件追加しました。合計: ${existingIds.size}件`, 'success');
                        }
                        ws.close();
                    }
                };
                
                ws.onerror = () => {
                    log('WebSocketエラー: トークンが無効かサーバーにアクセスできません', 'error');
                    ws.close();
                };
                
                ws.onclose = () => {
                    log('WebSocket接続を閉じました', 'info');
                };
            } catch (err) {
                log(`ユーザー取得エラー: ${err.message}`, 'error');
            }
        }

        elements.fetchUsersBtn.onclick = () => {
            const serverId = elements.serverId.value.trim();
            const token = parseList(elements.tokens.value)[0];
            const channelIds = parseList(elements.channelList.value);
            
            if (!serverId || !token || !channelIds.length) {
                log('サーバーID、トークン、チャンネルIDが必要です', 'error');
                return;
            }
            
            fetchUsers(serverId, token, channelIds);
        };

        // サーバー退出機能
        elements.leaveServerBtn.onclick = async () => {
            const serverId = elements.serverId.value.trim();
            const tokens = parseList(elements.tokens.value);
            
            if (!serverId || !tokens.length) {
                log('サーバーIDとトークンが必要です', 'error');
                return;
            }
            
            if (!confirm('全てのトークンでサーバーから退出しますか？この操作は取り消せません。')) return;
            
            log('サーバー退出を開始します...', 'warning');
            
            for (const token of tokens) {
                try {
                    const response = await fetch(`https://discord.com/api/v10/users/@me/guilds/${serverId}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': token }
                    });
                    
                    if (response.ok) {
                        log(`サーバー退出成功: ${token.slice(0, 20)}...`, 'success');
                    } else if (response.status === 404) {
                        log(`既にサーバーにいないか存在しません: ${token.slice(0, 20)}...`, 'warning');
                    } else {
                        const data = await response.json();
                        log(`サーバー退出エラー: ${token.slice(0, 20)}... status=${response.status}`, 'error');
                    }
                } catch (err) {
                    log(`サーバー退出例外: ${token.slice(0, 20)}... ${err.message}`, 'error');
                }
                
                await new Promise(r => setTimeout(r, 500));
            }
            
            log('サーバー退出処理が完了しました', 'info');
        };

        // メイン送信処理
        function getFinalPayload() {
            let basePayload = {};
            
            if (toggleStates.poll) {
                const question = elements.pollQuestion.value.trim();
                const options = elements.pollOptions.value.split('\n')
                    .map(o => o.trim()).filter(Boolean);
                
                if (!question || options.length < 2) {
                    log('投票には質問と少なくとも2つの選択肢が必要です', 'error');
                    return null;
                }
                
                basePayload.poll = {
                    question: { text: question },
                    answers: options.slice(0, 20).map(opt => ({
                        poll_media: { text: opt }
                    })),
                    duration: 1,
                    allow_multiselect: false
                };
            } else {
                let content = elements.message.value.trim();
                
                // メンション処理
                const userIds = parseList(elements.userIds.value);
                const mentionCount = parseInt(elements.mentionCount.value) || 0;
                
                if (userIds.length > 0 && mentionCount > 0) {
                    const mentions = shuffleArray([...userIds])
                        .slice(0, mentionCount)
                        .map(id => `<@${id}>`)
                        .join(' ');
                    
                    if (content.includes('{mention}')) {
                        content = content.replace('{mention}', mentions);
                    } else {
                        content = `${mentions} ${content}`.trim();
                    }
                }
                
                // ランダム文字追加
                if (toggleStates.random) {
                    const randomLength = parseInt(elements.randomLength.value) || 5;
                    const randomString = generateRandomString(randomLength);
                    content = `${content} ${randomString}`.trim();
                }
                
                if (!content && mentionCount === 0) {
                    log('メッセージかメンションを設定してください', 'error');
                    return null;
                }
                
                basePayload.content = content;
            }
            
            return basePayload;
        }

        // 停止処理
        function stopExecution() {
            isRunning = false;
            intervalIds.forEach(clearInterval);
            intervalIds = [];
            elements.startBtn.disabled = false;
            elements.stopBtn.disabled = true;
            elements.startBtn.textContent = '🚀 発射開始';
            elements.status.textContent = 'バックグラウンド: 停止';
            elements.status.classList.remove('active');
            log('全てのタスクを停止しました', 'success');
        }

        // 開始ボタン
        elements.startBtn.onclick = () => {
            const tokens = parseList(elements.tokens.value);
            
            if (!tokens.length) {
                log('トークンを入力してください', 'error');
                return;
            }
            
            const payload = getFinalPayload();
            if (!payload) return;

            isRunning = true;
            elements.startBtn.disabled = true;
            elements.stopBtn.disabled = false;
            elements.startBtn.textContent = '🔥 実行中...';
            elements.status.textContent = 'バックグラウンド: 実行中';
            elements.status.classList.add('active');

            const intervalMs = parseInt(elements.interval.value) || 2000;

            if (toggleStates.channelInterval) {
                // チャンネル別間隔送信
                const channelsWithIntervals = elements.channelList.value.split('\n')
                    .map(line => line.trim().split(','))
                    .filter(parts => parts.length === 2 && parts[0] && !isNaN(parseInt(parts[1])));
                
                if (!channelsWithIntervals.length) {
                    log('チャンネル別間隔の形式が正しくありません', 'error');
                    stopExecution();
                    return;
                }
                
                log(`${channelsWithIntervals.length}チャンネルで個別間隔送信を開始...`, 'info');
                
                channelsWithIntervals.forEach(([channelId, interval]) => {
                    const intervalId = setInterval(() => {
                        if (!isRunning) return;
                        const currentPayload = getFinalPayload();
                        if (currentPayload) {
                            tokens.forEach(token => 
                                sendApiRequest(token, channelId, currentPayload)
                            );
                        }
                    }, Math.max(100, parseInt(interval)));
                    intervalIds.push(intervalId);
                });
            } else {
                // 通常送信
                const channelIds = parseList(elements.channelList.value);
                if (!channelIds.length) {
                    const singleChannelId = elements.channelId.value.trim();
                    if (singleChannelId) {
                        channelIds.push(singleChannelId);
                    } else {
                        log('チャンネルIDを入力してください', 'error');
                        stopExecution();
                        return;
                    }
                }

                const sendBatch = () => {
                    if (!isRunning) return;
                    const currentPayload = getFinalPayload();
                    if (currentPayload) {
                        tokens.forEach(token => 
                            channelIds.forEach(channelId => 
                                sendApiRequest(token, channelId, currentPayload)
                            )
                        );
                    }
                };

                if (toggleStates.repeat) {
                    let execCount = 0;
                    const repeatCount = parseInt(elements.repeat.value) || 0;
                    
                    const execute = () => {
                        if (!isRunning) return;
                        if (repeatCount > 0 && execCount >= repeatCount) {
                            log(`${repeatCount}回の送信が完了しました`, 'success');
                            stopExecution();
                            return;
                        }
                        execCount++;
                        sendBatch();
                    };

                    log(`繰り返し送信を開始... (間隔: ${intervalMs}ms, 回数: ${repeatCount > 0 ? `${repeatCount}回` : '無限'})`, 'info');
                    execute();
                    
                    const intervalId = setInterval(execute, intervalMs);
                    intervalIds.push(intervalId);
                } else {
                    log('1回送信を実行します...', 'info');
                    sendBatch();
                    setTimeout(() => {
                        if (isRunning) stopExecution();
                    }, 1500);
                }
            }
        };

        elements.stopBtn.onclick = stopExecution;

        // ログクリア
        elements.clearLogsBtn.onclick = () => {
            elements.logs.innerHTML = '';
            log('ログをクリアしました', 'info');
        };

        // データ保存と読み込み
        const saveData = () => {
            const data = {
                message: elements.message.value,
                channelList: elements.channelList.value,
                userIds: elements.userIds.value,
                mentionCount: elements.mentionCount.value,
                interval: elements.interval.value,
                repeat: elements.repeat.value,
                randomLength: elements.randomLength.value,
                pollQuestion: elements.pollQuestion.value,
                pollOptions: elements.pollOptions.value,
                toggleStates: toggleStates
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        };

        const loadData = () => {
            try {
                const data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
                
                if (data.message) elements.message.value = data.message;
                if (data.channelList) elements.channelList.value = data.channelList;
                if (data.userIds) elements.userIds.value = data.userIds;
                if (data.mentionCount) elements.mentionCount.value = data.mentionCount;
                if (data.interval) elements.interval.value = data.interval;
                if (data.repeat) elements.repeat.value = data.repeat;
                if (data.randomLength) elements.randomLength.value = data.randomLength;
                if (data.pollQuestion) elements.pollQuestion.value = data.pollQuestion;
                if (data.pollOptions) elements.pollOptions.value = data.pollOptions;
                
                if (data.toggleStates) {
                    Object.keys(data.toggleStates).forEach(key => {
                        if (data.toggleStates[key]) {
                            toggleStates[key] = true;
                            const toggleElement = elements[key + 'Toggle'];
                            if (toggleElement) {
                                toggleElement.classList.add('active');
                                toggleElement.click(); // トリガーしてUI更新
                            }
                        }
                    });
                }
                
                log('保存されたデータを読み込みました', 'success');
            } catch (e) {
                log('データ読み込みエラー', 'warning');
            }
        };

        // データクリア
        elements.clearDataBtn.onclick = () => {
            if (confirm('保存されているすべてのデータをクリアしますか？')) {
                localStorage.removeItem(STORAGE_KEY);
                log('保存データをクリアしました。ページをリロードします', 'success');
                setTimeout(() => location.reload(), 1500);
            }
        };

        // 自動保存設定
        const autoSaveElements = [
            elements.message, elements.channelList, elements.userIds,
            elements.mentionCount, elements.interval, elements.repeat,
            elements.randomLength, elements.pollQuestion, elements.pollOptions
        ];

        autoSaveElements.forEach(element => {
            if (element) {
                element.addEventListener('input', saveData);
                element.addEventListener('change', saveData);
            }
        });

        // 初期化完了
        loadData();
        log('🔥 NawaRaider Complete Edition が初期化されました', 'success');
        log('全機能が利用可能です！', 'info');
    }

    // URL変更監視（Discord SPA対応）
    let currentPath = location.pathname;
    const checkForUpdates = () => {
        if (location.pathname !== currentPath) {
            currentPath = location.pathname;
            
            if (nawaRaiderUI) {
                const ids = getCurrentIds();
                const serverIdInput = document.getElementById('nawa-server-id');
                const channelIdInput = document.getElementById('nawa-channel-id');
                
                if (serverIdInput && ids.serverId) {
                    serverIdInput.value = ids.serverId;
                }
                if (channelIdInput && ids.channelId) {
                    channelIdInput.value = ids.channelId;
                }
            }
        }
    };

    // ページを閉じる前の警告
    window.addEventListener('beforeunload', (e) => {
        if (isRunning) {
            e.preventDefault();
            e.returnValue = '送信処理が実行中です。ページを閉じてもよろしいですか？';
            return e.returnValue;
        }
    });

    // 初期化
    const init = () => {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createUI);
        } else {
            setTimeout(createUI, 1000); // Discordの読み込み完了を待つ
        }
        
        // URL監視開始
        setInterval(checkForUpdates, 1000);
    };

    init();

})();