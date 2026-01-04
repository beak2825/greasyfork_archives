// ==UserScript==
// @name         Twitch OCR for img
// @namespace    http://github.com/uzuky
// @version      30.3.1
// @description  Twitchの画面からスレ番号っぽいものを抽出します。視聴者数の左に各種ボタン、結果はチャット欄に表示されます。誤認識することもそれなりにあります。また、実行するたびに共有ウィンドウで画面を選択する必要があります。
// @author       uzuky
// @license      MIT
// @match        https://www.twitch.tv/*
// @require      https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @downloadURL https://update.greasyfork.org/scripts/540314/Twitch%20OCR%20for%20img.user.js
// @updateURL https://update.greasyfork.org/scripts/540314/Twitch%20OCR%20for%20img.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- グローバル定数 ---
    const TARGET_WIDTH_PX = 3000;    // OCR精度向上のため、キャプチャ画像をこの幅にリサイズする
    const INITIAL_THRESHOLD = 200;   // 画像を二値化する際の初期の閾値（0-255）
    const STORAGE_KEY = 'twitch_ocr_thresholds_v2'; // localStorageに保存するときのキー
    const THRESHOLD_EXPIRATION_DAYS = 90; // 設定の有効期限（日）
    const CUSTOM_TOOLTIP_ID = 'ocr-custom-tooltip';

    // --- ストレージ関連ヘルパー関数 ---

    /**
     * 現在のURLからTwitchのチャンネル名を取得する。
     * @returns {string|null} チャンネル名。取得できない場合はnullを返する。
     */
    function getChannelName() {
        const match = window.location.pathname.match(/^\/([a-zA-Z0-9_]+)/);
        if (match && match[1] && !['directory', 'downloads', 'settings', 'p'].includes(match[1])) {
            return match[1];
        }
        return null;
    }

    /**
     * すべてのチャンネルの閾値設定をlocalStorageから読み込み。
     * @returns {object} 保存されているすべての設定オブジェクト。
     */
    function loadAllSettings() {
        try {
            const stored = localStorage.getItem(STORAGE_KEY);
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('[OCR Script] 設定の読み込みに失敗しました。', e);
            return {};
        }
    }

    /**
     * すべてのチャンネルの閾値設定をlocalStorageに保存する。
     * @param {object} settings 保存するすべての設定オブジェクト。
     */
    function saveAllSettings(settings) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
        } catch (e) {
            console.error('[OCR Script] 設定の保存に失敗しました。', e);
        }
    }

    /**
     * localStorageに保存されている設定のうち、古いものやデフォルト値のものを削除（クリーンアップ）する。
     * スクリプト読み込み時に一度だけ実行する。
     */
    function cleanupStoredSettings() {
        const allSettings = loadAllSettings();
        const now = new Date().getTime();
        const expirationMs = THRESHOLD_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;
        const cleanedSettings = {};
        for (const channel in allSettings) {
            const setting = allSettings[channel];
            // タイムスタンプがあり、有効期限内で、かつ閾値が初期値(200)でないものだけを残する。
            if (setting && setting.timestamp && (now - setting.timestamp < expirationMs) && setting.threshold !== INITIAL_THRESHOLD) {
                cleanedSettings[channel] = setting;
            }
        }
        saveAllSettings(cleanedSettings);
    }

    // --- UI・メイン処理関連関数 ---

    /**
     * ページ全体をスムーズに一番上までスクロールする
     * TwitchのUI構造 (SimpleBarライブラリ) に対応。
     */
    function scrollToPageTop() {
        const SCROLL_TARGET_SELECTOR = '[data-a-target="root-scroller"] .simplebar-scroll-content';
        const scrollableElement = document.querySelector(SCROLL_TARGET_SELECTOR);

        if (scrollableElement) {
            scrollableElement.scrollTo({ top: 0, behavior: 'auto' });
        } else {
            // 見つからない場合のフォールバックとしてwindowをスクロール
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    }

    /**
     * OCRツール（ボタンやスライダー）のUIを作成し、ページに配置する
     * @param {HTMLElement} parent - UIを追加する親要素。
     */
    function setupUI(parent) {
        if (document.querySelector('#ocr-tool-container')) return;

        const channelName = getChannelName();
        let currentThreshold = INITIAL_THRESHOLD;

        // チャンネルに対応する保存設定があれば読み込み、タイムスタンプを更新する
        if (channelName) {
            const allSettings = loadAllSettings();
            const channelSetting = allSettings[channelName];
            if (channelSetting && typeof channelSetting.threshold === 'number') {
                currentThreshold = channelSetting.threshold;
                allSettings[channelName].timestamp = new Date().getTime();
                saveAllSettings(allSettings);
            }
        }

        // --- UI要素の動的作成 ---
        const mainContainer = document.createElement('div');
        mainContainer.id = 'ocr-tool-container';
        mainContainer.style.cssText = 'display: inline-flex; flex-direction: row; align-items: center; gap: 4px; margin-right: 1rem;';
        const sliderContainer = document.createElement('div');
        sliderContainer.style.cssText = 'display:flex; align-items:center; background-color:rgba(255,255,255,0.1); padding:2px 5px; border-radius:4px;';
        const label = document.createElement('label');
        label.textContent = '閾値:';
        label.style.cssText = 'font-size:10px; margin-right:4px; color:var(--color-text-base); cursor:default;';
        const slider = document.createElement('input');
        slider.type = 'range'; slider.id = 'threshold-slider'; slider.min = 0; slider.max = 255; slider.step = 1;
        slider.value = currentThreshold;
        slider.style.width = '60px';
        const valueDisplay = document.createElement('span');
        valueDisplay.id = 'threshold-value';
        valueDisplay.textContent = currentThreshold;
        valueDisplay.style.cssText = 'font-size:10px; min-width:22px; text-align:right; margin-left:4px; color:var(--color-text-base);';
        slider.oninput = () => { valueDisplay.textContent = slider.value; };
        sliderContainer.append(label, slider, valueDisplay);
        const minusButton = document.createElement('button');
        minusButton.textContent = '-';
        minusButton.style.cssText = 'width: 24px; height: 24px; padding: 0; background-color: #5C5C5E; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; display: flex; justify-content: center; align-items: center; font-size: 16px; line-height: 1;';
        minusButton.onclick = () => {
            slider.value = Math.max(0, Number(slider.value) - 1);
            slider.dispatchEvent(new Event('input'));
        };
        const plusButton = document.createElement('button');
        plusButton.textContent = '+';
        plusButton.style.cssText = 'width: 24px; height: 24px; padding: 0; background-color: #5C5C5E; color: white; border: none; border-radius: 4px; cursor: pointer; font-weight: bold; display: flex; justify-content: center; align-items: center; font-size: 16px; line-height: 1;';
        plusButton.onclick = () => {
            slider.value = Math.min(255, Number(slider.value) + 1);
            slider.dispatchEvent(new Event('input'));
        };
        const ocrButton = document.createElement('button');
        ocrButton.id = 'ocr-button';
        ocrButton.textContent = '認識';
        ocrButton.style.cssText = 'padding:0 10px; height:24px; background-color:#FF7F50; color:white; border:none; border-radius:4px; cursor:pointer; font-size:11px; font-weight:bold; line-height: 24px; white-space: nowrap;';
        ocrButton.onclick = captureAndOcr;
        mainContainer.append(sliderContainer, minusButton, plusButton, ocrButton);
        parent.prepend(mainContainer);
    }

    /**
     * 「認識」ボタンが押されたときに実行されるメインの処理フロー
     */
    async function captureAndOcr() {
        scrollToPageTop();

        const captureTimestamp = getJSTTimestamp();
        const thresholdValue = parseInt(document.querySelector('#threshold-slider').value, 10);
        const ocrButton = document.querySelector('#ocr-button');
        const originalText = ocrButton.textContent;
        ocrButton.disabled = true;

        let progressMessage = displayMessageInChat('処理中...');
        if (!progressMessage) {
            console.error('[OCR Script] チャットコンテナが見つかりません。');
            ocrButton.disabled = false;
            return;
        }

        let dotCount = 1;
        const animationInterval = setInterval(() => {
            dotCount = (dotCount % 3) + 1;
            progressMessage.textContent = '処理中' + '.'.repeat(dotCount);
        }, 333);

        try {
            // 通常画像でOCRを実行する。
            const canvas1 = await getProcessedCanvas();
            const result1 = await Tesseract.recognize(canvas1, 'eng', { tessedit_char_whitelist: '0123456789' });
            let finalMatches = findMatchesInText(result1.data.text);

            if (finalMatches.length > 0) {
                handleOcrResult(canvas1, result1, null, null, finalMatches, progressMessage, captureTimestamp, thresholdValue);
                return;
            }

            // 見つからなければ、色を反転させた画像で再実行する。
            const canvas2 = getInvertedCanvas(canvas1);
            const result2 = await Tesseract.recognize(canvas2, 'eng', { tessedit_char_whitelist: '0123456789' });
            finalMatches = findMatchesInText(result2.data.text);
            handleOcrResult(canvas1, result1, canvas2, result2, finalMatches, progressMessage, captureTimestamp, thresholdValue);

        } catch (error) {
            console.error('[OCR Script] 処理中にエラーが発生しました。', error);
            if (error.message && error.message.toLowerCase().includes('user closed')) {
                 progressMessage.textContent = `画面共有がキャンセルされました。`;
            } else {
                 progressMessage.textContent = `エラー: ${error.message}`;
            }
        } finally {
            clearInterval(animationInterval);
            ocrButton.textContent = originalText;
            ocrButton.disabled = false;
        }
    }

    // --- OCR・画像処理関連関数 ---

    /**
     * 画面をキャプチャし、二値化などの前処理を施したCanvas要素を生成する。
     * @returns {Promise<HTMLCanvasElement>} 処理済みのCanvas要素。
     */
    async function getProcessedCanvas() {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: { mediaSource: "screen", cursor: "never" }, audio: false });
        await new Promise(resolve => setTimeout(resolve, 500)); // 共有メニューが写り込まないように待機
        const tempVideo = document.createElement('video');
        await new Promise((resolve, reject) => {
            tempVideo.onloadedmetadata = () => { tempVideo.play(); resolve(); };
            tempVideo.onerror = (e) => reject(new Error("ビデオ要素の読み込みに失敗しました。"));
            tempVideo.srcObject = stream;
        });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const aspectRatio = tempVideo.videoHeight / tempVideo.videoWidth;
        canvas.width = TARGET_WIDTH_PX;
        canvas.height = TARGET_WIDTH_PX * aspectRatio;
        context.drawImage(tempVideo, 0, 0, canvas.width, canvas.height);
        stream.getTracks().forEach(track => track.stop());

        // 二値化処理
        const threshold = document.querySelector('#threshold-slider').value;
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const brightness = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            let value = brightness > threshold ? 255 : 0;
            data[i] = data[i + 1] = data[i + 2] = value;
        }
        context.putImageData(imageData, 0, 0);
        return canvas;
    }

    /**
     * 指定されたCanvasの白黒を反転させた新しいCanvasを生成する。
     * @param {HTMLCanvasElement} sourceCanvas - 元となるCanvas要素。
     * @returns {HTMLCanvasElement} 色反転した新しいCanvas要素。
     */
    function getInvertedCanvas(sourceCanvas) {
        const canvas = document.createElement('canvas');
        canvas.width = sourceCanvas.width; canvas.height = sourceCanvas.height;
        const context = canvas.getContext('2d');
        const imageData = sourceCanvas.getContext('2d').getImageData(0, 0, sourceCanvas.width, sourceCanvas.height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            data[i] = 255 - data[i]; data[i + 1] = 255 - data[i + 1]; data[i + 2] = 255 - data[i + 2];
        }
        context.putImageData(imageData, 0, 0);
        return canvas;
    }

    /**
     * OCR結果のテキスト全体から、10桁の数字（スレ番号）を抽出する。
     * @param {string} text - Tesseract.jsが認識したテキスト。
     * @returns {string[]} 見つかった10桁の数字の配列。
     */
    function findMatchesInText(text) {
        const potentialMatches = text.match(/[\d\s]+/g) || [];
        const matches = [];
        potentialMatches.forEach(candidate => {
            const cleaned = candidate.replace(/\s/g, '');
            const spaceCount = candidate.length - cleaned.length;
            if (cleaned.length === 10 && /^\d{10}$/.test(cleaned) && spaceCount <= 2) {
                matches.push(cleaned);
            }
        });
        return matches;
    }

    // --- 結果表示・デバッグ関連関数 ---

    /**
     * OCRの実行結果を処理し、チャット欄に表示する。
     * 認識成功時には、閾値の保存もここで行う。
     */
    function handleOcrResult(canvas1, result1, canvas2, result2, matches, progressMessage, timestamp, threshold) {
        progressMessage.innerHTML = '';
        const uniqueMatches = [...new Set(matches)];

        if (uniqueMatches.length > 0) {
            const channelName = getChannelName();
            if (channelName) {
                const allSettings = loadAllSettings();
                if (threshold !== INITIAL_THRESHOLD) {
                    allSettings[channelName] = { threshold: threshold, timestamp: new Date().getTime() };
                    saveAllSettings(allSettings);
                } else if (allSettings[channelName]) {
                    delete allSettings[channelName];
                    saveAllSettings(allSettings);
                }
            }

            // 成功結果をチャットに表示する。
            uniqueMatches.forEach(match => {
                const fileName = match + '.htm';
                const url = `https://img.2chan.net/b/res/${fileName}`;
                const link = document.createElement('a');
                link.href = url;
                link.textContent = 'スレに飛ぶ';
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                link.style.cssText = 'color:#a970ff; text-decoration:underline;';
                // マウスがリンクに乗った時の処理
                link.addEventListener('mouseenter', (e) => {
                    // 既存のツールチップがあれば念のため削除
                    const existingTooltip = document.getElementById(CUSTOM_TOOLTIP_ID);
                    if (existingTooltip) existingTooltip.remove();

                    // ツールチップ要素を動的に作成
                    const tooltip = document.createElement('div');
                    tooltip.id = CUSTOM_TOOLTIP_ID;
                    tooltip.textContent = fileName;


                    Object.assign(tooltip.style, {
                        position: 'fixed',
                        left: `${e.clientX + 15}px`,
                        top: `${e.clientY + 15}px`,
                        backgroundColor: 'rgba(20, 20, 20, 0.9)',
                        color: 'white',
                        padding: '5px 10px',
                        borderRadius: '4px',
                        fontSize: '13px',
                        zIndex: '10000',
                        pointerEvents: 'none',
                        fontFamily: 'sans-serif',
                        border: '1px solid #555'
                    });

                    document.body.appendChild(tooltip);
                });

                // マウスがリンクから離れた時の処理
                link.addEventListener('mouseleave', () => {
                    const tooltip = document.getElementById(CUSTOM_TOOLTIP_ID);
                    if (tooltip) tooltip.remove();
                });

                const thresholdInfo = document.createElement('span');
                thresholdInfo.textContent = ` [閾値:${threshold}]`;
                thresholdInfo.style.cssText = 'font-size: 11px; color: var(--color-text-alt-2); margin-left: 4px;';
                const copyButton = document.createElement('button');
                copyButton.textContent = 'コピー';
                copyButton.style.cssText = 'margin-left: 8px; padding: 2px 6px; font-size: 11px; background-color: #5C5C5E; color: white; border: none; border-radius: 3px; cursor: pointer;';
                copyButton.onclick = () => {
                    navigator.clipboard.writeText(url).then(() => {
                        copyButton.textContent = 'OK!'; copyButton.style.backgroundColor = '#00AD80';
                        setTimeout(() => { copyButton.textContent = 'コピー'; copyButton.style.backgroundColor = '#5C5C5E'; }, 2000);
                    });
                };
                const contentContainer = document.createElement('span');
                const debugButton1 = createDebugButton('認識結果', canvas1, result1.data.words, timestamp, threshold);
                contentContainer.append(link, thresholdInfo, copyButton, debugButton1);
                if (canvas2 && result2) {
                    const debugButton2 = createDebugButton('認識結果(反転後)', canvas2, result2.data.words, timestamp, threshold);
                    contentContainer.append(debugButton2);
                }
                progressMessage.appendChild(contentContainer);
            });
        } else {
            // 失敗結果をチャットに表示する
            const messageContainer = document.createElement('span');
            messageContainer.textContent = `10桁の数字は見つかりませんでした。(閾値: ${threshold}) 例えば数字も背景も暗い場合は閾値を下げてみてください。`;
            messageContainer.append(createDebugButton('認識結果', canvas1, result1.data.words, timestamp, threshold));
            if (canvas2 && result2) {
                messageContainer.append(createDebugButton('認識結果(反転後)', canvas2, result2.data.words, timestamp, threshold));
            }
            progressMessage.appendChild(messageContainer);
        }
    }

    /**
     * Twitchのチャット欄にメッセージを表示するためのDOM要素を作成・追加する。
     * @param {string|HTMLElement} content - 表示するテキストまたはHTML要素。
     * @returns {HTMLElement} メッセージ内容を格納するコンテナ要素。
     */
    function displayMessageInChat(content) {
        const chatContainer = document.querySelector('.chat-scrollable-area__message-container');
        if (!chatContainer) return;
        const chatLine = document.createElement('div');
        chatLine.classList.add('chat-line__message');
        chatLine.style.cssText = 'padding: 4px 20px; display: flex; align-items: center; flex-wrap: wrap;';
        const prefix = document.createElement('span');
        prefix.textContent = '[OCR] ';
        prefix.style.cssText = 'color: #ff7f50; font-weight: bold; flex-shrink: 0; margin-right: 4px;';
        const messageContainer = document.createElement('span');
        messageContainer.style.display = 'flex'; messageContainer.style.alignItems = 'center'; messageContainer.style.flexWrap = 'wrap';
        if (typeof content === 'string') {
            messageContainer.textContent = content;
        } else {
            messageContainer.appendChild(content);
        }
        chatLine.append(prefix, messageContainer);
        chatContainer.appendChild(chatLine);

        return messageContainer;
    }

    /**
     * JST（日本標準時）のタイムスタンプ文字列を生成する。
     */
    function getJSTTimestamp() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
    }

    /**
     * 認識過程の画像を確認・ダウンロードするためのボタンを作成する。
     */
    function createDebugButton(label, canvas, words, timestamp, threshold) {
        const button = document.createElement('button');
        button.textContent = label;
        button.style.cssText = 'margin-left: 8px; padding: 2px 6px; font-size: 11px; background-color: #464649; color: white; border: none; border-radius: 3px; cursor: pointer;';
        button.onclick = () => drawAndDownloadDebugImage(canvas, words, timestamp, threshold);
        return button;
    }

    /**
     * ボタンが押されたときに、認識結果を重ね描きした画像をダウンロードする。
     */
    function drawAndDownloadDebugImage(canvas, words, timestamp, threshold) {
        if (!words) return;
        const debugCanvas = document.createElement('canvas');
        debugCanvas.width = canvas.width; debugCanvas.height = canvas.height;
        const context = debugCanvas.getContext('2d');
        context.drawImage(canvas, 0, 0);
        context.strokeStyle = 'red';
        context.lineWidth = 1;
        context.fillStyle = 'lime';
        const fontSize = 16;
        context.font = `bold ${fontSize}px sans-serif`;
        words.forEach(word => {
            const bbox = word.bbox;
            let textY;
            if (bbox.y0 < fontSize + 2) {
                context.textBaseline = 'top'; textY = bbox.y1 + 2;
            } else {
                context.textBaseline = 'bottom'; textY = bbox.y0 - 2;
            }
            context.fillText(word.text, bbox.x0, textY);
            context.strokeRect(bbox.x0, bbox.y0, bbox.x1 - bbox.x0, bbox.y1 - bbox.y0);
        });
        const dataUrl = debugCanvas.toDataURL("image/png");
        const link = document.createElement('a');
        link.download = `ocr-th-${threshold}_${timestamp}.png`;
        link.href = dataUrl;
        link.click();
    }


    // --- スクリプト実行開始点 ---

    // 1. 古い設定をクリーンアップする。
    cleanupStoredSettings();

    // 2. UIを配置するターゲット要素が表示されるまで監視し、表示されたらUIをセットアップする。
    const interval = setInterval(() => {
        const targetContainer = document.querySelector('.channel-info-content .dglNpm');
        if (targetContainer && !document.querySelector('#ocr-tool-container')) {
            setupUI(targetContainer);
        }
    }, 2000);

})();