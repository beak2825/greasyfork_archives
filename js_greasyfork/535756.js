// ==UserScript==
// @name         チャベリ時刻送信とTTS（入室時時刻送信・時間帯挨拶・見える新コメントのみ・全員入室挨拶・発言文字列除外・今何時対応）
// @namespace    http://tampermonkey.net/
// @version      3.0.0
// @description  15分ごとに正確な時刻を送信（30分ごとに高精度NTP同期、遅延補正あり）、ユーザーの入室時に時刻と時間帯に応じた挨拶（おはよう:4:00-11:59/こんにちは:12:00-17:59/こんばんは:18:00-3:59）を送信、表示された新コメントのみを読み上げ（クズ、ゴミ、カス等除外）、『今何時』で現在の時刻を送信。コンパクトな音声オン/オフボタンと音量スライダーを右上に表示（間隔を近く）、ドラッグ移動可、位置記憶。
// @author       You
// @match        https://www.chaberi.com/room/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535756/%E3%83%81%E3%83%A3%E3%83%99%E3%83%AA%E6%99%82%E5%88%BB%E9%80%81%E4%BF%A1%E3%81%A8TTS%EF%BC%88%E5%85%A5%E5%AE%A4%E6%99%82%E6%99%82%E5%88%BB%E9%80%81%E4%BF%A1%E3%83%BB%E6%99%82%E9%96%93%E5%B8%AF%E6%8C%A8%E6%8B%B6%E3%83%BB%E8%A6%8B%E3%81%88%E3%82%8B%E6%96%B0%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E3%81%BF%E3%83%BB%E5%85%A8%E5%93%A1%E5%85%A5%E5%AE%A4%E6%8C%A8%E6%8B%B6%E3%83%BB%E7%99%BA%E8%A8%80%E6%96%87%E5%AD%97%E5%88%97%E9%99%A4%E5%A4%96%E3%83%BB%E4%BB%8A%E4%BD%95%E6%99%82%E5%AF%BE%E5%BF%9C%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/535756/%E3%83%81%E3%83%A3%E3%83%99%E3%83%AA%E6%99%82%E5%88%BB%E9%80%81%E4%BF%A1%E3%81%A8TTS%EF%BC%88%E5%85%A5%E5%AE%A4%E6%99%82%E6%99%82%E5%88%BB%E9%80%81%E4%BF%A1%E3%83%BB%E6%99%82%E9%96%93%E5%B8%AF%E6%8C%A8%E6%8B%B6%E3%83%BB%E8%A6%8B%E3%81%88%E3%82%8B%E6%96%B0%E3%82%B3%E3%83%A1%E3%83%B3%E3%83%88%E3%81%AE%E3%81%BF%E3%83%BB%E5%85%A8%E5%93%A1%E5%85%A5%E5%AE%A4%E6%8C%A8%E6%8B%B6%E3%83%BB%E7%99%BA%E8%A8%80%E6%96%87%E5%AD%97%E5%88%97%E9%99%A4%E5%A4%96%E3%83%BB%E4%BB%8A%E4%BD%95%E6%99%82%E5%AF%BE%E5%BF%9C%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 音声の有効/無効フラグ
    let isTtsEnabled = localStorage.getItem('ttsEnabled') !== 'false';

    // 時刻送信関連
    let lastSentTime = null;
    let timeOffset = parseInt(localStorage.getItem('lastTimeOffset') || '0'); // 前回のtimeOffsetを初期値に

    // NTPサーバーから正確な時刻を取得（遅延補正付き）
    async function fetchNtpTime() {
        const servers = [
            'https://time.google.com/',
            'https://time.windows.com/',
            'http://ntp.nict.jp/',
            'http://worldtimeapi.org/api/timezone/Asia/Tokyo'
        ];
        let attempts = 0;
        const maxAttempts = servers.length;

        while (attempts < maxAttempts) {
            try {
                const server = servers[attempts];
                const start = Date.now();
                const response = await fetch(server, { cache: 'no-store' });
                const end = Date.now();
                const rtt = end - start;
                let serverTime;

                if (server.includes('worldtimeapi.org')) {
                    const data = await response.json();
                    serverTime = new Date(data.utc_datetime);
                } else {
                    serverTime = new Date(response.headers.get('date'));
                }

                if (!serverTime || isNaN(serverTime.getTime())) {
                    throw new Error('無効なサーバー時刻');
                }

                const localTime = new Date(start + rtt / 2);
                timeOffset = serverTime.getTime() - localTime.getTime();
                localStorage.setItem('lastTimeOffset', timeOffset);
                console.log(`NTP同期成功 (${server}): 誤差=${timeOffset}ms, RTT=${rtt}ms, サーバー時刻=${serverTime.toISOString()}`);
                return serverTime;
            } catch (error) {
                console.error(`NTP同期失敗 (${servers[attempts]}):`, error);
                attempts++;
            }
        }

        console.warn('全NTPサーバー同期失敗、前回のオフセットまたはローカル時刻を使用');
        timeOffset = parseInt(localStorage.getItem('lastTimeOffset') || '0');
        return new Date(Date.now() + timeOffset);
    }

    // 30分ごとにNTP同期をスケジュール
    function scheduleNtpSync() {
        fetchNtpTime();
        setInterval(fetchNtpTime, 30 * 60 * 1000);
        console.log('NTP同期を30分ごとにスケジュール');
    }

    function sendTimeMessage() {
        const now = new Date(Date.now() + timeOffset);
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
            console.warn('時刻送信失敗: 入力欄または送信ボタンが無効または見つかりません', {
                messageInput: !!messageInput,
                sendButton: !!sendButton,
                inputDisabled: messageInput?.disabled,
                buttonDisabled: sendButton?.disabled
            });
        }
    }

    function scheduleNextSend() {
        setInterval(() => {
            const now = new Date(Date.now() + timeOffset);
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            if ([0, 15, 30, 45].includes(minutes) && seconds >= 0 && seconds <= 2 && (!lastSentTime || (now.getTime() - lastSentTime) > 60 * 1000)) {
                console.log(`時報送信条件一致: ${minutes}:${seconds}`);
                sendTimeMessage();
            }
        }, 1000);
    }

    // テキスト読み上げ関連
    const spokenMessages = new Set();
    const speechQueue = [];
    let isSpeaking = false;

    const ttsSettings = {
        lang: 'ja-JP',
        volume: parseFloat(localStorage.getItem('ttsVolume') || '1.0'),
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

    function getTimeBasedGreeting() {
        const now = new Date(Date.now() + timeOffset);
        const hours = now.getHours();
        if (hours >= 4 && hours < 12) {
            return 'おはよう';
        } else if (hours >= 12 && hours < 18) {
            return 'こんにちは';
        } else {
            return 'こんばんは';
        }
    }

    function sendGreeting() {
        const messageInput = document.getElementById('message');
        const sendButton = document.getElementById('send');

        if (messageInput && sendButton && !messageInput.disabled && !sendButton.disabled) {
            const timeGreeting = getTimeBasedGreeting();
            messageInput.value = `🤖${timeGreeting}、いらっしゃい！`;
            sendButton.click();
            console.log('挨拶を送信しました:', messageInput.value);
        } else {
            console.warn('挨拶送信失敗: 入力欄または送信ボタンが無効または見つかりません', {
                messageInput: !!messageInput,
                sendButton: !!sendButton,
                inputDisabled: messageInput?.disabled,
                buttonDisabled: sendButton?.disabled
            });
        }
    }

    function createTtsToggleButton() {
        console.log('createTtsToggleButton: コントロール作成開始');

        const existingControls = document.getElementById('tts-controls');
        if (existingControls) {
            existingControls.remove();
            console.log('既存のコントロールを削除');
        }

        const container = document.createElement('div');
        container.id = 'tts-controls';
        container.style.position = 'fixed';
        container.style.zIndex = '9999';
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.gap = '2px';
        container.style.cursor = 'move';
        container.style.userSelect = 'none';

        const button = document.createElement('button');
        button.id = 'tts-toggle-button';
        button.textContent = isTtsEnabled ? '🔊 オン' : '🔇 オフ';
        button.style.padding = '5px 10px';
        button.style.backgroundColor = isTtsEnabled ? '#4CAF50' : '#F44336';
        button.style.color = 'white';
        button.style.border = '1px solid #333';
        button.style.borderRadius = '4px';
        button.style.fontSize = '12px';
        button.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
        button.style.display = 'block';
        button.style.opacity = '1';

        const slider = document.createElement('input');
        slider.id = 'tts-volume-slider';
        slider.type = 'range';
        slider.min = '0';
        slider.max = '100';
        slider.value = ttsSettings.volume * 100;
        slider.style.width = '80px';
        slider.style.padding = '2px';
        slider.style.background = '#f0f0f0';
        slider.style.border = '1px solid #333';
        slider.style.borderRadius = '4px';
        slider.style.opacity = '1';

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

        slider.addEventListener('input', (e) => {
            ttsSettings.volume = e.target.value / 100;
            localStorage.setItem('ttsVolume', ttsSettings.volume);
            console.log('音量変更:', ttsSettings.volume);
        });

        container.appendChild(button);
        container.appendChild(slider);

        let position = { x: window.innerWidth - 80, y: 10 };
        try {
            const savedPosition = JSON.parse(localStorage.getItem('ttsButtonPosition'));
            if (savedPosition && typeof savedPosition.x === 'number' && typeof savedPosition.y === 'number') {
                if (savedPosition.x >= 0 && savedPosition.x <= window.innerWidth - 80 &&
                    savedPosition.y >= 0 && savedPosition.y <= window.innerHeight - 75) {
                    position = savedPosition;
                } else {
                    console.warn('保存された位置が画面外、右上にリセット');
                }
            }
        } catch (e) {
            console.error('位置データの解析エラー、デフォルト位置を使用:', e);
        }

        container.style.right = `${window.innerWidth - position.x - 80}px`;
        container.style.top = `${position.y}px`;

        let isDragging = false;
        let currentX = position.x;
        let currentY = position.y;
        let initialX, initialY;

        container.addEventListener('mousedown', (e) => {
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
                currentY = Math.max(0, Math.min(currentY, window.innerHeight - 75));
                container.style.right = `${window.innerWidth - currentX - 80}px`;
                container.style.top = `${currentY}px`;
            }
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('ttsButtonPosition', JSON.stringify({ x: currentX, y: currentY }));
                console.log('ボタン位置保存:', { x: currentX, y: currentY });
            }
        });

        container.addEventListener('touchstart', (e) => {
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
                currentY = Math.max(0, Math.min(currentY, window.innerHeight - 75));
                container.style.right = `${window.innerWidth - currentX - 80}px`;
                container.style.top = `${currentY}px`;
            }
        });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                localStorage.setItem('ttsButtonPosition', JSON.stringify({ x: currentX, y: currentY }));
                console.log('タッチドラッグ終了、位置保存:', { x: currentX, y: currentY });
            }
        });

        document.body.appendChild(container);
        console.log('createTtsToggleButton: コントロールをDOMに追加', container);

        setTimeout(() => {
            if (document.getElementById('tts-controls') && document.getElementById('tts-toggle-button') && document.getElementById('tts-volume-slider')) {
                console.log('コントロールが正常に表示されています');
            } else {
                console.error('コントロールがDOMに存在しません、追加に失敗');
            }
        }, 1000);
    }

    function setupTextToSpeechAndGreeting() {
        const chatArea = document.getElementById('main');
        if (!chatArea) {
            console.error('チャットエリア（#main）が見つかりません');
            return;
        }

        const excludeWords = ['クズ', 'ゴミ', 'カス'];

        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE && isElementVisible(node)) {
                        const rawText = node.textContent.trim();
                        if (rawText && rawText !== '') {
                            const messageContent = extractMessageBody(rawText);

                            if (messageContent.match(/いま\s*なにじ|今\s*何時/i)) {
                                if (!lastSentTime || (Date.now() + timeOffset - lastSentTime) > 60 * 1000) {
                                    console.log('「今何時」検出、時刻を送信');
                                    sendTimeMessage();
                                } else {
                                    console.log('「今何時」検出、直近で時刻送信済み、送信スキップ');
                                }
                                return;
                            }

                            if (rawText.includes('が入室しました')) {
                                sendGreeting();
                                if (!lastSentTime || (Date.now() + timeOffset - lastSentTime) > 60 * 1000) {
                                    console.log('入室検出、時刻を送信');
                                    sendTimeMessage();
                                } else {
                                    console.log('直近で時刻送信済み、入室時の送信スキップ');
                                }
                                return;
                            }

                            const hasExcludedWord = excludeWords.some(word =>
                                messageContent.toLowerCase().includes(word.toLowerCase())
                            );
                            if (hasExcludedWord) {
                                console.log(`除外単語[${excludeWords.find(word =>
                                    messageContent.toLowerCase().includes(word.toLowerCase())
                                )}]検出、読み上げスキップ:`, messageContent);
                                return;
                            }

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

    function initializeScript() {
        console.log('initializeScript: 初期化開始');
        const maxWaitTime = 10000;
        let elapsed = 0;
        const waitForEnable = setInterval(() => {
            const messageInput = document.getElementById('message');
            const sendButton = document.getElementById('send');
            const chatArea = document.getElementById('main');
            if (messageInput && sendButton && !messageInput.disabled && !sendButton.disabled && chatArea && document.body) {
                clearInterval(waitForEnable);
                scheduleNtpSync();
                scheduleNextSend();
                createTtsToggleButton();
                setupTextToSpeechAndGreeting();
                console.log('スクリプトが正常に初期化されました');
                window.addEventListener('resize', debounce(() => {
                    const container = document.getElementById('tts-controls');
                    if (container) {
                        let position = JSON.parse(localStorage.getItem('ttsButtonPosition') || '{}');
                        position.x = Math.min(position.x || window.innerWidth - 80, window.innerWidth - 80);
                        position.y = Math.min(position.y || 10, window.innerHeight - 75);
                        container.style.right = `${window.innerWidth - position.x - 80}px`;
                        container.style.top = `${position.y}px`;
                        localStorage.setItem('ttsButtonPosition', JSON.stringify(position));
                        console.log('ウィンドウリサイズでコントロール位置調整:', position);
                    }
                }, 200));
            } else {
                elapsed += 500;
                console.log('initializeScript: 必要な要素が準備できていません', {
                    messageInput: !!messageInput,
                    sendButton: !!sendButton,
                    inputDisabled: messageInput?.disabled,
                    buttonDisabled: sendButton?.disabled,
                    chatArea: !!chatArea,
                    body: !!document.body,
                    elapsed: `${elapsed}ms`
                });
                if (elapsed >= maxWaitTime) {
                    clearInterval(waitForEnable);
                    console.error('初期化タイムアウト: 必要な要素が見つかりません');
                }
            }
        }, 500);

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