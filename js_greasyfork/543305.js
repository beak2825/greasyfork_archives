// ==UserScript==
// @name         ChatGPT Timestamp Injector
// @namespace    https://kuds.win/
// @version      1.0
// @description  Displays the timestamp at the end of each ChatGPT message.
// @author       KUDs
// @match        https://chatgpt.com/*
// @icon         https://chatgpt.com/favicon.ico
// @grant        none
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543305/ChatGPT%20Timestamp%20Injector.user.js
// @updateURL https://update.greasyfork.org/scripts/543305/ChatGPT%20Timestamp%20Injector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /** フォーマット済み日時文字列を取得する関数 */
    function formatTimestamp(date) {
        // 各数値を2桁ゼロ埋め（年以外）
        const pad = (n) => n.toString().padStart(2, '0');
        const YYYY = date.getFullYear();
        const M = date.getMonth() + 1;
        const D = date.getDate();
        const HH = pad(date.getHours());
        const mm = pad(date.getMinutes());
        const ss = pad(date.getSeconds());
        return `${YYYY}/${M}/${D} ${HH}:${mm}:${ss}`;
    }

    /** チャットIDをURLから取得する関数 */
    function getCurrentChatId() {
        // パス形式: /c/<chat-id> または /g/<team-id>/c/<chat-id> （また、/share/<share-id>は今回は除外）
        const match = location.pathname.match(/^\/(?:c|g\/[^\/]+\/c)\/([^\/]+)/);
        return match ? match[1] : null;
    }

    let accessToken = null;
    /** アクセストークンを取得（既に取得済みなら再利用） */
    async function getAccessToken() {
        if (accessToken) return accessToken;
        try {
            const res = await fetch('/api/auth/session');
            if (!res.ok) throw new Error(res.statusText);
            const data = await res.json();
            accessToken = data.accessToken;
            return accessToken;
        } catch (err) {
            console.error('Failed to get access token:', err);
            return null;
        }
    }

    /** 会話データを取得する関数 */
    async function fetchConversationData(chatId) {
        const token = await getAccessToken();
        if (!token) return null;
        try {
            const res = await fetch(`/backend-api/conversation/${chatId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'X-Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error(res.statusText);
            return await res.json();
        } catch (err) {
            console.error('Failed to fetch conversation data:', err);
            return null;
        }
    }

    /** メッセージ要素にタイムスタンプを付与する関数 */
    function appendTimestampElement(messageElem, timestamp) {
        // **重複防止**：すでに挿入済みならスキップ
        if (messageElem.querySelector('time.chatgpt-timestamp')) return;

        // 時刻をフォーマットし<time>要素を生成
        const date = new Date(timestamp * 1000);
        const timeText = formatTimestamp(date);
        const timeEl = document.createElement('time');
        timeEl.className = 'chatgpt-timestamp w-full';
        timeEl.dateTime = date.toISOString();
        timeEl.title = date.toLocaleString();
        timeEl.textContent = timeText;

        // 役割に応じて左右寄せを切り替え
        const role = messageElem.getAttribute('data-message-author-role');
        Object.assign(timeEl.style, {
            fontStyle: 'italic',
            opacity: '0.6',
            fontSize: '0.875rem',
            display: 'block',
            textAlign: role === 'user' ? 'right' : 'left'
        });
        messageElem.appendChild(timeEl);
    }

    // 挿入済みメッセージIDのセット（重複防止）
    const processedIds = new Set();

    // MutationObserverの設定（新しいメッセージの追加を監視）
    const mainElem = document.querySelector('main');
    let suppressObserver = false;
    let suppressedQueue = [];
    const observer = new MutationObserver((mutations) => {
        for (const mut of mutations) {
            for (const node of mut.addedNodes) {
                if (!(node instanceof HTMLElement)) continue;
                // 追加されたノード（またはその子孫）にメッセージ要素があるか確認
                let messageElements = [];
                if (node.hasAttribute && node.hasAttribute('data-message-id')) {
                    messageElements.push(node);
                } else {
                    messageElements = Array.from(node.querySelectorAll?.('[data-message-id]') || []);
                }
                for (const msgElem of messageElements) {
                    const msgId = msgElem.getAttribute('data-message-id');
                    if (!msgId || processedIds.has(msgId)) continue;
                    if (suppressObserver) {
                        // 一時抑制中はキューに溜めるだけ
                        suppressedQueue.push(msgId);
                    } else {
                        // 新規メッセージに対しタイムスタンプを取得・表示
                        updateMessageTimestamp(msgElem, msgId);
                    }
                }
            }
        }
    });
    if (mainElem) {
        observer.observe(mainElem, { childList: true, subtree: true });
    }

    /** 特定のメッセージIDに対してタイムスタンプを取得し挿入する関数 */
    async function updateMessageTimestamp(messageElem, messageId, retryCount = 0) {
        const chatId = getCurrentChatId();
        if (!chatId) return;
        const convo = await fetchConversationData(chatId);
        if (!convo || !convo.mapping) return;
        const node = convo.mapping[messageId];
        if (!node || !node.message || node.message.create_time === undefined) {
            // 該当メッセージが会話データに無い（※生成中の可能性）場合、一定回数リトライ
            if (retryCount < 10) {
                setTimeout(() => updateMessageTimestamp(messageElem, messageId, retryCount + 1), 1000);
            } else {
                console.warn(`Timestamp not found for message ${messageId}`);
            }
        } else {
            // タイムスタンプ挿入
            appendTimestampElement(messageElem, node.message.create_time);
            processedIds.add(messageId);
        }
    }

    /** 現在の会話内の全メッセージにタイムスタンプを付与 */
    async function processAllMessagesInConversation() {
        const chatId = getCurrentChatId();
        if (!chatId) return;
        const convo = await fetchConversationData(chatId);
        if (!convo) return;
        // 会話データから順序通りメッセージのリストを取得
        const mapping = convo.mapping || {};
        const startNodeId = convo.current_node || Object.values(mapping).find(n => !n.children || n.children.length === 0)?.id;
        if (!startNodeId) {
            console.warn('No valid start node for conversation');
            return;
        }
        // 末尾（最新）から親をたどって最初のメッセージまでリスト化
        const nodes = [];
        let nodeId = startNodeId;
        while (nodeId) {
            const node = mapping[nodeId];
            if (!node) break;
            // ルートに到達
            if (node.parent === undefined) break;
            // systemや非表示のメタメッセージをスキップ
            const msg = node.message;
            if (msg && msg.author.role !== 'system' &&
                msg.content?.content_type !== 'model_editable_context' &&
                msg.content?.content_type !== 'user_editable_context') {
                nodes.unshift(node);
            }
            nodeId = node.parent;
        }
        // DOM上の各メッセージ要素に対応するタイムスタンプを付与
        for (const node of nodes) {
            const msg = node.message;
            if (!msg || msg.id === undefined || msg.create_time === undefined) continue;
            const msgId = msg.id;
            const elem = document.querySelector(`[data-message-id="${msgId}"]`);
            if (elem && !processedIds.has(msgId)) {
                appendTimestampElement(elem, msg.create_time);
                processedIds.add(msgId);
            }
        }
    }

    // チャットの切り替えや初期読み込みを監視し、適宜タイムスタンプを挿入
    let currentChatId = null;
    setInterval(() => {
        const chatId = getCurrentChatId();
        if (chatId && chatId !== currentChatId) {
            // チャットが新規に開かれた/切り替わった
            currentChatId = chatId;
            processedIds.clear();
            suppressObserver = true;
            suppressedQueue = [];
            // 少し待ってから過去メッセージにまとめてタイムスタンプを付与
            setTimeout(async () => {
                await processAllMessagesInConversation();
                // 抑制中に溜まった新規メッセージも処理する
                for (const newId of suppressedQueue) {
                    const elem = document.querySelector(`[data-message-id="${newId}"]`);
                    if (elem && !processedIds.has(newId)) {
                        updateMessageTimestamp(elem, newId);
                    }
                }
                suppressedQueue = [];
                suppressObserver = false;
            }, 500);
        }
    }, 1000);
})();
