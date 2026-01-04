// ==UserScript==
// @name         チャベリ時刻送信とTTS（見える新コメントのみ・全員入室挨拶・発言文字列除外）
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  15分ごとに時刻を送信し、表示された新コメントのみを読み上げ、全員の入室時に挨拶を送信。コンパクトな音声オン/オフボタンを右上に表示、ドラッグ移動可、位置記憶。
// @author       You
// @match        https://www.chaberi.com/room/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535429/%E3%83%81%E3%83%A3%E3%83%99%E3%83%AA%E6%99%82%E5%88%BB%E9%80%81%E4%BF%A1%E3%81%A8TTS%EF%BC%88%E8%A6%8B%E3%81%88%E3%82%8B%E6%96%B0%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E3%81%BF%E3%83%BB%E5%85%A8%E5%93%A1%E5%85%A5%E5%AE%A4%E6%8C%A8%E6%8B%B6%E3%83%BB%E7%99%BA%E8%A8%80%E6%96%87%E5%AD%97%E5%88%97%E9%99%A4%E5%A4%96%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/535429/%E3%83%81%E3%83%A3%E3%83%99%E3%83%AA%E6%99%82%E5%88%BB%E9%80%81%E4%BF%A1%E3%81%A8TTS%EF%BC%88%E8%A6%8B%E3%81%88%E3%82%8B%E6%96%B0%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E3%81%BF%E3%83%BB%E5%85%A8%E5%93%A1%E5%85%A5%E5%AE%A4%E6%8C%A8%E6%8B%B6%E3%83%BB%E7%99%BA%E8%A8%80%E6%96%87%E5%AD%97%E5%88%97%E9%99%A4%E5%A4%96%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 音声の有効/無効フラグ
    let isTtsEnabled = localStorage.getItem('ttsEnabled') !== 'false'; // デフォルトはオン

    // 時刻送信関連
    let lastSentTime = null;

    function sendTimeMessage() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
        const weekday = weekdays[now.getDay()];
        const timeMessage = `${year}年${month}月${day}日 (${weekday}) 現在の時刻は${hours}:${minutes}です`;

        const messageInput = document.getElementById('message');
        const sendButton = document.getElementById('send');

        if (messageInput && sendButton && !messageInput.disabled && !sendButton.disabled) {
            messageInput.value = timeMessage;
            sendButton.click();
            lastSentTime = now.getTime();
            console.log('時刻を送信:', timeMessage);
        } else {
            console.warn('時刻送信失敗: 入力欄または送信ボタンが無効または見つかりません');
        }
    }

    function scheduleNextSend() {
        setInterval(() => {
            const now = new Date();
            const minutes = now.getMinutes();
            if ([0, 15, 30, 45].includes(minutes) && (!lastSentTime || (now.getTime() - lastSentTime) > 60 * 1000)) {
                sendTimeMessage();
            }
        }, 60000); // 毎分チェック
    }

    // テキスト読み上げ関連
    const spokenMessages = new Set();
    const speechQueue = [];
    let isSpeaking = false;

    const ttsSettings = {
        lang: 'ja-JP',
        volume: 1.0,
        rate: 1.1,
        pitch: 1.0,
        maxQueueSize: 10,
        maxSpokenMessages: 1000
    };

    function speakText(text) {
        return new Promise((resolve, reject) => {
            if (!window.speechSynthesis) {
                console.error('音声合成がサポートされていません');
                reject(new Error('音声合成非対応'));
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = ttsSettings.lang;
            utterance.volume = ttsSettings.volume;
            utterance.rate = ttsSettings.rate;
            utterance.pitch = ttsSettings.pitch;

            utterance.onend = () => resolve();
            utterance.onerror = (e) => {
                console.error('音声読み上げエラー:', e);
                reject(e);
            };

            window.speechSynthesis.speak(utterance);
        });
    }

    async function processSpeechQueue() {
        if (isSpeaking || speechQueue.length === 0 || !isTtsEnabled) return;

        isSpeaking = true;
        const text = speechQueue.shift();

        try {
            await speakText(text);
            console.log('読み上げ完了:', text);
        } catch (error) {
            console.error('読み上げ失敗:', text, error);
        }

        isSpeaking = false;
        processSpeechQueue();
    }

    function addToSpeechQueue(text) {
        if (!isTtsEnabled) {
            console.log('音声オフのためスキップ:', text);
            return;
        }
        if (speechQueue.length >= ttsSettings.maxQueueSize) {
            console.log('キュー満杯のためスキップ:', text);
            return;
        }
        speechQueue.push(text);
        console.log('読み上げキューに追加:', text);
        processSpeechQueue();
    }

    function isElementVisible(element) {
        const style = window.getComputedStyle(element);
        return style.display !== 'none' && style.visibility !== 'hidden' && style.opacity !== '0';
    }

    function extractMessageBody(rawText) {
        console.log('受信テキスト:', rawText);

        if (rawText.includes('現在の時刻は') || rawText.includes('が入室しました')) {
            return rawText;
        }

        let content = rawText.replace(/\[\d{2}:\d{2}\]/g, '')
                            .replace(/\d{2}:\d{2}/g, '')
                            .replace(/^[^:]+:\s*/, '')
                            .replace(/[\u200B-\u200F\u202A-\u202E\u2060-\u206F]/g, '')
                            .trim();

        console.log('抽出された内容:', content);
        return content;
    }

    function hasRepeatedCharacters(text) {
        const repeatPattern = /(.)\1{2,}/;
        return repeatPattern.test(text);
    }

    // 入室挨拶関連
    function sendGreeting() {
        const messageInput = document.getElementById('message');
        const sendButton = document.getElementById('send');

        if (messageInput && sendButton && !messageInput.disabled && !sendButton.disabled) {
            messageInput.value = '🤖いらっしゃい！誹謗中傷はサーバーに残るよ？ なでしこ日本語プログラム言語に興味ありますか? https://nadesiko.ho-zuki.com/';
            sendButton.click();
            console.log('挨拶を送信しました');
        } else {
            console.warn('挨拶送信失敗: 入力欄または送信ボタンが無効または見つかりません');
        }
    }

    // コンパクトな音声オン/オフボタンの作成
    function createTtsToggleButton() {
        console.log('createTtsToggleButton: ボタン作成開始');

        // 既存のボタンがあれば削除
        const existingButton = document.getElementById('tts-toggle-button');
        if (existingButton) {
            existingButton.remove();
            console.log('既存のボタンを削除');
        }

        const button = document.createElement('button');
        button.id = 'tts-toggle-button';
        button.textContent = isTtsEnabled ? '🔊 オン' : '🔇 オフ'; // テキストを短縮
        button.style.position = 'fixed';
        button.style.zIndex = '9999';
        button.style.padding = '5px 10px'; // コンパクトなパディング
        button.style.backgroundColor = isTtsEnabled ? '#4CAF50' : '#F44336';
        button.style.color = 'white';
        button.style.border = '1px solid #333'; // 細いボーダー
        button.style.borderRadius = '4px'; // 控えめな角丸
        button.style.cursor = 'move';
        button.style.fontSize = '12px'; // 小さなフォント
        button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)'; // 控えめな影
        button.style.display = 'block';
        button.style.opacity = '1';
        button.style.userSelect = 'none';

        // 位置の設定（右上にデフォルト）
        let position = { x: window.innerWidth - 80, y: 10 }; // 幅80pxを考慮
        try {
            const savedPosition = JSON.parse(localStorage.getItem('ttsButtonPosition'));
            if (savedPosition && typeof savedPosition.x === 'number' && typeof savedPosition.y === 'number') {
                if (savedPosition.x >= 0 && savedPosition.x <= window.innerWidth - 80 &&
                    savedPosition.y >= 0 && savedPosition.y <= window.innerHeight - 40) {
                    position = savedPosition;
                } else {
                    console.warn('保存された位置が画面外、右上にリセット');
                }
            }
        } catch (e) {
            console.error('位置データの解析エラー、デフォルト位置を使用:', e);
        }

        button.style.right = `${window.innerWidth - position.x - 80}px`;
        button.style.top = `${position.y}px`;

        // ボタンのクリックで音声オン/オフ
        button.addEventListener('click', () => {
            isTtsEnabled = !isTtsEnabled;
            localStorage.setItem('ttsEnabled', isTtsEnabled);
            button.textContent = isTtsEnabled ? '🔊 オン' : '🔇 オフ';
            button.style.backgroundColor = isTtsEnabled ? '#4CAF50' : '#F44336';
            if (!isTtsEnabled) {
                window.speechSynthesis.cancel();
                speechQueue.length = 0;
            }
            console.log(`音声 ${isTtsEnabled ? 'オン' : 'オフ'}`);
        });

        // ドラッグ移動
        let isDragging = false;
        let currentX = position.x;
        let currentY = position.y;
        let initialX, initialY;

        button.addEventListener('mousedown', (e) => {
            initialX = e.clientX - currentX;
            initialY = e.clientY - currentY;
            isDragging = true;
            console.log('ドラッグ開始');
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;
                currentX = Math.max(0, Math.min(currentX, window.innerWidth - 80));
                currentY = Math.max(0, Math.min(currentY, window.innerHeight - 40));
                button.style.right = `${window.innerWidth - currentX - 80}px`;
                button.style.top = `${currentY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('ttsButtonPosition', JSON.stringify({ x: currentX, y: currentY }));
                console.log('ボタン位置保存:', { x: currentX, y: currentY });
            }
        });

        // タッチ対応（モバイル用）
        button.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            initialX = touch.clientX - currentX;
            initialY = touch.clientY - currentY;
            isDragging = true;
            console.log('タッチドラッグ開始');
        });

        document.addEventListener('touchmove', (e) => {
            if (isDragging) {
                e.preventDefault();
                const touch = e.touches[0];
                currentX = touch.clientX - initialX;
                currentY = touch.clientY - initialY;
                currentX = Math.max(0, Math.min(currentX, window.innerWidth - 80));
                currentY = Math.max(0, Math.min(currentY, window.innerHeight - 40));
                button.style.right = `${window.innerWidth - currentX - 80}px`;
                button.style.top = `${currentY}px`;
            }
        });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('ttsButtonPosition', JSON.stringify({ x: currentX, y: currentY }));
                console.log('タッチドラッグ終了、位置保存:', { x: currentX, y: currentY });
            }
        });

        // ボタンをbodyに追加
        document.body.appendChild(button);
        console.log('createTtsToggleButton: ボタンをDOMに追加', button);

        // 追加確認
        setTimeout(() => {
            if (document.getElementById('tts-toggle-button')) {
                console.log('ボタンが正常に表示されています');
            } else {
                console.error('ボタンがDOMに存在しません、追加に失敗');
            }
        }, 1000);
    }

    function setupTextToSpeechAndGreeting() {
        const chatArea = document.getElementById('main');
        if (!chatArea) {
            console.error('チャットエリア（#main）が見つかりません');
            return;
        }

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && isElementVisible(node)) {
                        const rawText = node.textContent.trim();
                        if (rawText && rawText !== '') {
                            if (rawText.includes('が入室しました')) {
                                sendGreeting();
                            }

                            const messageContent = extractMessageBody(rawText);
                            if (!messageContent.includes('現在') &&
                                !messageContent.includes('入室') &&
                                messageContent &&
                                !messageContent.match(/https?:\/\//) &&
                                !messageContent.includes('//') &&
                                !messageContent.includes('変更') &&
                                !messageContent.includes('@') &&
                                !messageContent.includes('なこった') &&
                                !messageContent.includes('🤖') &&
                                !messageContent.includes('退室') &&
                                !messageContent.includes('外出中') &&
                                !hasRepeatedCharacters(messageContent)) {
                                if (!spokenMessages.has(messageContent)) {
                                    spokenMessages.add(messageContent);
                                    addToSpeechQueue(messageContent);

                                    if (spokenMessages.size > ttsSettings.maxSpokenMessages) {
                                        const oldestMessage = spokenMessages.values().next().value;
                                        spokenMessages.delete(oldestMessage);
                                    }
                                } else {
                                    console.log('既読のためスキップ:', messageContent);
                                }
                            } else {
                                console.log('条件に合わずスキップ:', rawText);
                                if (hasRepeatedCharacters(messageContent)) {
                                    console.log('連続文字検出、読み上げオフ:', messageContent);
                                }
                            }
                        }
                    }
                });
            });
        });

        observer.observe(chatArea, { childList: true, subtree: true });
        console.log('テキスト読み上げと挨拶の監視を開始');
    }

    // 初期化
    function initializeScript() {
        console.log('initializeScript: 初期化開始');
        const waitForEnable = setInterval(() => {
            const messageInput = document.getElementById('message');
            const sendButton = document.getElementById('send');
            const chatArea = document.getElementById('main');
            if (messageInput && sendButton && !messageInput.disabled && !sendButton.disabled && chatArea && document.body) {
                clearInterval(waitForEnable);
                scheduleNextSend();
                createTtsToggleButton();
                setupTextToSpeechAndGreeting();
                console.log('スクリプトが正常に初期化されました');
                // ウィンドウリサイズ時にボタン位置を調整
                window.addEventListener('resize', debounce(() => {
                    const button = document.getElementById('tts-toggle-button');
                    if (button) {
                        let position = JSON.parse(localStorage.getItem('ttsButtonPosition') || '{}');
                        position.x = Math.min(position.x || window.innerWidth - 80, window.innerWidth - 80);
                        position.y = Math.min(position.y || 10, window.innerHeight - 40);
                        button.style.right = `${window.innerWidth - position.x - 80}px`;
                        button.style.top = `${position.y}px`;
                        localStorage.setItem('ttsButtonPosition', JSON.stringify(position));
                        console.log('ウィンドウリサイズでボタン位置調整:', position);
                    }
                }, 200));
            } else {
                console.log('initializeScript: 必要な要素が準備できていません', {
                    messageInput: !!messageInput,
                    sendButton: !!sendButton,
                    chatArea: !!chatArea,
                    body: !!document.body
                });
            }
        }, 500);

        // デバウンス関数
        function debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        }
    }

    // ページ読み込み完了後に初期化
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        console.log('DOMが準備完了、即時初期化');
        initializeScript();
    } else {
        window.addEventListener('DOMContentLoaded', () => {
            console.log('DOMContentLoadedで初期化');
            initializeScript();
        });
    }
})();