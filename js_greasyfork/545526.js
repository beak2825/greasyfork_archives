// ==UserScript==
// @name         WordPress Video Player Injector (改善版)
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  動画処理とシネマモードを提供するユーザースクリプト（iframe方式）
// @author       You
// @match        https://jikahatsuvideo.wordpress.com/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/545526/WordPress%20Video%20Player%20Injector%20%28%E6%94%B9%E5%96%84%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/545526/WordPress%20Video%20Player%20Injector%20%28%E6%94%B9%E5%96%84%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===== 設定とグローバル変数 =====
    const MAX_CONCURRENT_PROCESSING = 3;
    const TIMEOUT_DURATION = 30000;
    const PASSWORD = 'dP1$c4^#Zz6d';

    let processedSourceUrls = [];
    let processedUrlLocations = {};
    let totalSourceUrls = 0;
    let processingLogs = [];
    let currentProgress = { current: 0, total: 0, percentage: 0 };
    let isProcessingActive = false;
    let processingQueue = [];
    let processingCount = 0;

    // シネマモードの状態管理
    let cinemaModeState = {
        isActive: false,
        isLightMode: false,
        currentVideo: null,
        originalParent: null,
        originalNextSibling: null
    };

    // ===== CSS スタイルの追加 =====
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .injected-video-player,
            .injected-video-iframe {
                width: 100% !important;
                max-width: 1280px !important;
                min-width: 320px !important;
                display: block !important;
                margin: 10px 0 !important;
                height: auto !important;
                aspect-ratio: 16/9;
                border: none;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            }
            
            .video-container-wrapper {
                position: relative;
                display: block;
                margin: 10px 0;
                max-width: 1280px;
            }
            
            .video-processor-popup {
                position: fixed;
                top: 20px;
                right: 20px;
                background-color: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 5px;
                z-index: 9999;
                font-family: Arial, sans-serif;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }
            
            .video-retry-button {
                background-color: #007cba;
                color: white;
                border: none;
                padding: 8px 12px;
                border-radius: 4px;
                cursor: pointer;
                font-size: 12px;
                margin-top: 5px;
                transition: background-color 0.3s;
            }
            
            .video-retry-button:hover {
                background-color: #005a87;
            }
            
            .video-status-indicator {
                position: absolute;
                top: 10px;
                right: 10px;
                background: rgba(0,0,0,0.7);
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                z-index: 1000;
            }
            
            .video-status-loading {
                background: rgba(255, 193, 7, 0.9);
                color: black;
            }
            
            .video-status-error {
                background: rgba(220, 53, 69, 0.9);
            }
            
            .video-status-success {
                background: rgba(40, 167, 69, 0.9);
            }
            
            /* シネマモード用スタイル */
            .cinema-mode-overlay {
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                width: 100vw;
                height: 100vh;
                background-color: rgba(0, 0, 0, 0.98);
                z-index: 999999;
                display: flex;
                justify-content: center;
                align-items: center;
                opacity: 0;
                visibility: hidden;
                transition: opacity 0.4s ease, visibility 0.4s ease;
                backdrop-filter: blur(10px);
            }
            
            .cinema-mode-overlay.active {
                opacity: 1;
                visibility: visible;
            }
            
            .cinema-mode-container {
                position: relative;
                width: 90vw;
                height: auto;
                max-width: none;
                max-height: 90vh;
                display: flex;
                justify-content: center;
                align-items: center;
                aspect-ratio: 16/9;
            }
            
            .cinema-mode-video,
            .cinema-mode-iframe {
                width: 100%;
                height: 100%;
                max-width: none;
                max-height: none;
                display: block;
                border-radius: 12px;
                box-shadow: 0 25px 80px rgba(0, 0, 0, 0.6);
                object-fit: cover;
                background: #000;
                border: none;
            }
            
            .cinema-controls {
                position: fixed;
                top: 30px;
                right: 30px;
                display: flex;
                gap: 15px;
                z-index: 1000000;
            }
            
            .cinema-control-btn {
                width: 50px;
                height: 50px;
                background-color: rgba(0, 0, 0, 0.8);
                border: none;
                border-radius: 50%;
                color: white;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 20px;
                transition: all 0.3s ease;
            }
            
            .video-cinema-button {
                position: absolute;
                top: 22px;
                right: 15px;
                width: 40px;
                height: 40px;
                background-color: rgba(0, 0, 0, 0.8);
                border: none;
                border-radius: 8px;
                color: white;
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 18px;
                z-index: 1000;
                opacity: 0;
                transition: all 0.3s ease;
            }
            
            .video-container {
                position: relative;
                display: inline-block;
            }
            
            .video-container:hover .video-cinema-button {
                opacity: 1;
            }
            
            body.cinema-mode-active {
                overflow: hidden;
                height: 100vh;
            }

            /* WordPress.comマーケティングバーを削除 */
            #marketingbar,
            .marketing-bar {
                display: none !important;
                visibility: hidden !important;
                height: 0 !important;
                overflow: hidden !important;
            }
        `;
        document.head.appendChild(style);
    }

    // ===== パスワード自動入力 =====
    function handlePasswordAuthentication() {
        if (!window.location.hostname.includes('jikahatsuvideo.wordpress.com')) {
            return;
        }
        
        const passwordField = document.querySelector('input[type="password"][name="post_password"]');
        const submitButton = document.querySelector('input[type="submit"][value="確定"]') || 
                            document.querySelector('input[type="submit"][name="Submit"]') ||
                            document.querySelector('button[type="submit"]') ||
                            document.querySelector('input[type="submit"]');
        
        if (passwordField && submitButton) {
            console.log('[パスワード認証] 自動入力を実行します');
            passwordField.value = PASSWORD;
            
            const inputEvent = new Event('input', { bubbles: true });
            passwordField.dispatchEvent(inputEvent);
            
            const changeEvent = new Event('change', { bubbles: true });
            passwordField.dispatchEvent(changeEvent);
            
            setTimeout(() => {
                console.log('[パスワード認証] 確定ボタンをクリックします');
                submitButton.click();
            }, 100);
        }
    }

    // ===== 動画URL検出 =====
    function detectSourceUrls() {
        const sourceUrls = [];
        const links = document.querySelectorAll('a[href*="os5.wdcloud.jp/action/share/"]');
        
        links.forEach(link => {
            if (!sourceUrls.includes(link.href)) {
                sourceUrls.push(link.href);
            }
        });
        
        // テキスト内のURLを検出
        const textNodes = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        const urlRegex = /https:\/\/os5\.wdcloud\.jp\/action\/share\/[a-zA-Z0-9-]+/g;
        let node;
        
        while (node = textNodes.nextNode()) {
            const matches = node.textContent.match(urlRegex);
            if (matches) {
                matches.forEach(url => {
                    if (!sourceUrls.includes(url)) {
                        sourceUrls.push(url);
                    }
                });
            }
        }
        
        return sourceUrls;
    }

    // ===== 改善された動画抽出方法（iframe使用） =====
    function createVideoIframe(sourceUrl) {
        return new Promise((resolve, reject) => {
            console.log(`[iframe方式] ${sourceUrl} の処理を開始`);
            
            // iframeを作成
            const iframe = document.createElement('iframe');
            iframe.src = sourceUrl;
            iframe.style.position = 'absolute';
            iframe.style.left = '-9999px';
            iframe.style.width = '1px';
            iframe.style.height = '1px';
            iframe.style.border = 'none';
            iframe.style.visibility = 'hidden';
            
            let resolved = false;
            let timeoutId;
            
            // タイムアウト設定
            timeoutId = setTimeout(() => {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    console.log(`[iframe方式] タイムアウト: ${sourceUrl}`);
                    reject(new Error('タイムアウト'));
                }
            }, TIMEOUT_DURATION);
            
            // クリーンアップ関数
            function cleanup() {
                if (timeoutId) clearTimeout(timeoutId);
                if (iframe.parentNode) {
                    iframe.parentNode.removeChild(iframe);
                }
            }
            
            // iframe読み込み完了時の処理
            iframe.onload = function() {
                console.log(`[iframe方式] 読み込み完了: ${sourceUrl}`);
                
                try {
                    // 同一オリジンの場合は直接アクセスを試行
                    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                    if (iframeDoc) {
                        setTimeout(() => {
                            try {
                                const video = iframeDoc.querySelector('video');
                                if (video && (video.src || video.currentSrc)) {
                                    if (!resolved) {
                                        resolved = true;
                                        cleanup();
                                        const videoUrl = video.currentSrc || video.src;
                                        console.log(`[iframe方式] 成功: ${videoUrl}`);
                                        resolve(videoUrl);
                                    }
                                    return;
                                }
                            } catch (e) {
                                console.log('[iframe方式] クロスオリジン制限により直接アクセス不可');
                            }
                            
                            // 直接アクセスできない場合はiframe自体を返す
                            if (!resolved) {
                                resolved = true;
                                console.log(`[iframe方式] iframe埋め込み: ${sourceUrl}`);
                                resolve({ type: 'iframe', src: sourceUrl });
                            }
                        }, 2000);
                    } else {
                        // iframe自体を返す
                        if (!resolved) {
                            resolved = true;
                            console.log(`[iframe方式] iframe埋め込み: ${sourceUrl}`);
                            resolve({ type: 'iframe', src: sourceUrl });
                        }
                    }
                } catch (error) {
                    console.log(`[iframe方式] iframe埋め込み: ${sourceUrl}`);
                    if (!resolved) {
                        resolved = true;
                        resolve({ type: 'iframe', src: sourceUrl });
                    }
                }
            };
            
            iframe.onerror = function() {
                if (!resolved) {
                    resolved = true;
                    cleanup();
                    reject(new Error('iframe読み込みエラー'));
                }
            };
            
            // DOMに追加
            document.body.appendChild(iframe);
        });
    }

    // ===== 動画処理キュー =====
    function processVideoQueue() {
        while (processingCount < MAX_CONCURRENT_PROCESSING && processingQueue.length > 0) {
            processingCount++;
            const task = processingQueue.shift();
            processVideoUrl(task);
        }
    }

    async function processVideoUrl(task) {
        try {
            showProgress(`動画読み込み中... (${processedSourceUrls.length + processingCount}/${totalSourceUrls})`);
            
            // iframe方式で動画URLまたはiframe情報を取得
            const result = await createVideoIframe(task.sourceUrl);
            
            if (result) {
                injectVideoPlayer(task.sourceUrl, result);
                processedSourceUrls.push(task.sourceUrl);
                
                // 統計更新
                const processedCount = GM_getValue('processedCount', 0) + 1;
                GM_setValue('processedCount', processedCount);
                
                console.log(`✅ 成功: ${task.sourceUrl}`);
            } else {
                throw new Error('動画URLまたはiframe情報が取得できませんでした');
            }
        } catch (error) {
            console.error(`❌ エラー: ${task.sourceUrl}`, error);
            
            // エラー統計更新
            const errorCount = GM_getValue('errorCount', 0) + 1;
            GM_setValue('errorCount', errorCount);
            
            if (task.retryCount < 1) {
                task.retryCount++;
                processingQueue.unshift(task);
                console.log(`🔄 再試行: ${task.sourceUrl}`);
            } else {
                // 最終的にリトライボタン付きのプレースホルダーを挿入
                injectRetryPlaceholder(task.sourceUrl);
            }
        } finally {
            processingCount--;
            
            // 進捗更新
            const currentCount = processedSourceUrls.length;
            showProgress(`動画読み込み中... (${currentCount}/${totalSourceUrls})`);
            
            if (processingCount === 0 && processingQueue.length === 0) {
                showComplete(processedSourceUrls.length);
                isProcessingActive = false;
            } else {
                processVideoQueue();
            }
        }
    }

    // ===== リトライプレースホルダー挿入 =====
    function injectRetryPlaceholder(sourceUrl) {
        const placeholder = document.createElement('div');
        placeholder.className = 'video-container-wrapper';
        placeholder.innerHTML = `
            <div style="
                border: 2px dashed #ccc;
                border-radius: 8px;
                padding: 20px;
                text-align: center;
                background: #f9f9f9;
                min-height: 200px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            ">
                <p style="margin: 0 0 10px 0; color: #666;">動画の読み込みに失敗しました</p>
                <button class="video-retry-button" onclick="window.retryVideoLoad('${sourceUrl}')">
                    再試行
                </button>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #999;">
                    <a href="${sourceUrl}" target="_blank">元のページを開く</a>
                </p>
            </div>
        `;
        
        // リトライ関数をグローバルに登録
        if (!window.retryVideoLoad) {
            window.retryVideoLoad = function(url) {
                // プレースホルダーを削除
                const existingPlaceholders = document.querySelectorAll(`[data-source-url="${url}"]`);
                existingPlaceholders.forEach(p => p.remove());
                
                // 再処理を開始
                processingQueue.push({ sourceUrl: url, retryCount: 0 });
                processingCount = 0;
                processVideoQueue();
            };
        }
        
        placeholder.setAttribute('data-source-url', sourceUrl);
        
        // 挿入位置を特定して挿入
        insertElementAtSourceLocation(sourceUrl, placeholder);
    }

    // ===== 動画プレイヤー挿入 =====
    function injectVideoPlayer(sourceUrl, videoData) {
        if (!videoData || processedUrlLocations[sourceUrl]) {
            return;
        }
        
        console.log(`[挿入開始] ${sourceUrl} の動画プレイヤーを挿入します`);
        
        processedUrlLocations[sourceUrl] = true;
        
        let playerElement;
        
        if (typeof videoData === 'string') {
            // 直接の動画URL
            playerElement = document.createElement('video');
            playerElement.src = videoData;
            playerElement.controls = true;
            playerElement.classList.add('injected-video-player');
        } else if (videoData.type === 'iframe') {
            // iframe埋め込み
            playerElement = document.createElement('iframe');
            playerElement.src = videoData.src;
            playerElement.classList.add('injected-video-iframe');
            playerElement.setAttribute('allowfullscreen', 'true');
            playerElement.setAttribute('webkitallowfullscreen', 'true');
            playerElement.setAttribute('mozallowfullscreen', 'true');
        }
        
        if (!playerElement) return;
        
        // 共通スタイル設定
        playerElement.setAttribute('width', '100%');
        playerElement.style.width = '100%';
        playerElement.style.maxWidth = '1280px';
        playerElement.style.display = 'block';
        playerElement.style.margin = '10px 0';
        
        // 挿入位置を特定して挿入
        insertElementAtSourceLocation(sourceUrl, playerElement);
        
        // シネマモードボタンを追加（videoの場合のみ）
        if (playerElement.tagName === 'VIDEO') {
            addCinemaModeButton(playerElement);
        }
    }

    // ===== 要素挿入の汎用関数 =====
    function insertElementAtSourceLocation(sourceUrl, element) {
        // リンク要素への挿入
        const links = document.querySelectorAll(`a[href="${sourceUrl}"]`);
        let inserted = false;
        
        links.forEach(link => {
            const elementClone = element.cloneNode(true);
            link.parentNode.insertBefore(elementClone, link);
            link.parentNode.removeChild(link);
            inserted = true;
        });
        
        // テキストノード内のURL置換
        if (!inserted) {
            insertElementToTextNodes(sourceUrl, element);
        }
    }

    function insertElementToTextNodes(sourceUrl, elementTemplate) {
        const textNodes = document.createTreeWalker(
            document.body,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let node;
        let inserted = false;
        
        while ((node = textNodes.nextNode()) && !inserted) {
            if (node.textContent.includes(sourceUrl)) {
                const parent = node.parentNode;
                const beforeText = node.textContent.substring(0, node.textContent.indexOf(sourceUrl));
                const afterText = node.textContent.substring(node.textContent.indexOf(sourceUrl) + sourceUrl.length);
                
                if (beforeText) {
                    const beforeNode = document.createTextNode(beforeText);
                    parent.insertBefore(beforeNode, node);
                }
                
                const elementClone = elementTemplate.cloneNode(true);
                parent.insertBefore(elementClone, node);
                
                if (afterText) {
                    const afterNode = document.createTextNode(afterText);
                    parent.insertBefore(afterNode, node);
                }
                
                parent.removeChild(node);
                inserted = true;
                break;
            }
        }
    }

    // ===== シネマモード機能（既存のコードをそのまま維持） =====
    function addCinemaModeButton(videoElement) {
        if (videoElement.parentElement.querySelector('.video-cinema-button')) {
            return;
        }
        
        if (!videoElement.parentElement.classList.contains('video-container')) {
            const container = document.createElement('div');
            container.classList.add('video-container');
            
            const parent = videoElement.parentElement;
            parent.insertBefore(container, videoElement);
            container.appendChild(videoElement);
        }
        
        const container = videoElement.parentElement;
        const cinemaBtn = document.createElement('button');
        cinemaBtn.classList.add('video-cinema-button');
        cinemaBtn.innerHTML = '⛶';
        cinemaBtn.title = 'シネマモードで表示';
        
        cinemaBtn.onclick = (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            if (cinemaModeState.isActive) {
                exitCinemaMode();
            } else {
                enterCinemaMode(videoElement);
            }
        };
        
        container.appendChild(cinemaBtn);
    }

    function createCinemaModeOverlay() {
        const overlay = document.createElement('div');
        overlay.id = 'cinema-mode-overlay';
        overlay.classList.add('cinema-mode-overlay');
        
        const container = document.createElement('div');
        container.classList.add('cinema-mode-container');
        
        const controls = document.createElement('div');
        controls.classList.add('cinema-controls');
        
        // 閉じるボタン
        const closeBtn = document.createElement('button');
        closeBtn.classList.add('cinema-control-btn');
        closeBtn.innerHTML = '✕';
        closeBtn.title = 'シネマモードを終了 (ESC)';
        closeBtn.onclick = exitCinemaMode;
        
        controls.appendChild(closeBtn);
        overlay.appendChild(container);
        overlay.appendChild(controls);
        
        // オーバーレイクリックで終了
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                exitCinemaMode();
            }
        });
        
        document.body.appendChild(overlay);
        return overlay;
    }

    function enterCinemaMode(videoElement) {
        if (cinemaModeState.isActive) return;
        
        let overlay = document.getElementById('cinema-mode-overlay');
        if (!overlay) {
            overlay = createCinemaModeOverlay();
        }
        
        const container = overlay.querySelector('.cinema-mode-container');
        
        cinemaModeState.originalParent = videoElement.parentElement;
        cinemaModeState.originalNextSibling = videoElement.nextSibling;
        cinemaModeState.currentVideo = videoElement;
        cinemaModeState.isActive = true;
        
        const wasPlaying = !videoElement.paused;
        const currentTime = videoElement.currentTime;
        const volume = videoElement.volume;
        const muted = videoElement.muted;
        
        const clonedVideo = videoElement.cloneNode(true);
        clonedVideo.classList.add('cinema-mode-video');
        clonedVideo.removeAttribute('id');
        
        clonedVideo.currentTime = currentTime;
        clonedVideo.volume = volume;
        clonedVideo.muted = muted;
        
        videoElement.pause();
        videoElement.style.opacity = '0.5';
        
        container.appendChild(clonedVideo);
        document.body.classList.add('cinema-mode-active');
        overlay.classList.add('active');
        
        if (wasPlaying) {
            clonedVideo.play().catch(error => {
                console.log('自動再生に失敗:', error);
            });
        }
    }

    function exitCinemaMode() {
        if (!cinemaModeState.isActive) return;
        
        const overlay = document.getElementById('cinema-mode-overlay');
        const container = overlay.querySelector('.cinema-mode-container');
        const cinemaVideo = container.querySelector('.cinema-mode-video');
        
        if (cinemaVideo && cinemaModeState.currentVideo) {
            const wasPlaying = !cinemaVideo.paused;
            const currentTime = cinemaVideo.currentTime;
            const volume = cinemaVideo.volume;
            const muted = cinemaVideo.muted;
            
            cinemaModeState.currentVideo.currentTime = currentTime;
            cinemaModeState.currentVideo.volume = volume;
            cinemaModeState.currentVideo.muted = muted;
            cinemaModeState.currentVideo.style.opacity = '';
            
            if (wasPlaying) {
                cinemaModeState.currentVideo.play().catch(console.log);
            }
            
            cinemaVideo.remove();
        }
        
        overlay.classList.remove('active');
        document.body.classList.remove('cinema-mode-active');
        
        cinemaModeState.isActive = false;
        cinemaModeState.currentVideo = null;
        cinemaModeState.originalParent = null;
        cinemaModeState.originalNextSibling = null;
    }

    // ===== UI表示機能 =====
    function createProgressPopup() {
        const popup = document.createElement('div');
        popup.id = 'video-processor-popup';
        popup.classList.add('video-processor-popup');
        
        const message = document.createElement('p');
        message.id = 'video-processor-message';
        
        popup.appendChild(message);
        document.body.appendChild(popup);
    }

    function showProgress(text) {
        const message = document.getElementById('video-processor-message');
        if (message) {
            message.textContent = text;
        }
    }

    function showComplete(count) {
        const message = document.getElementById('video-processor-message');
        if (message) {
            message.textContent = `完了: ${count}個の動画を処理しました`;
            
            setTimeout(() => {
                const popup = document.getElementById('video-processor-popup');
                if (popup) {
                    popup.style.display = 'none';
                }
            }, 5000);
        }
    }

    // ===== マーケティングバー削除 =====
    function removeMarketingBar() {
        const marketingBars = document.querySelectorAll('#marketingbar, .marketing-bar');
        marketingBars.forEach(bar => {
            if (bar) {
                bar.remove();
            }
        });
    }

    // ===== メイン処理開始 =====
    function startVideoProcessing(sourceUrls) {
        totalSourceUrls = sourceUrls.length;
        isProcessingActive = true;
        
        console.log(`[動画処理] ${sourceUrls.length}個の動画URLを処理開始`);
        
        createProgressPopup();
        showProgress("動画URLを検出中...");
        
        processedSourceUrls = [];
        processedUrlLocations = {};
        processingQueue = sourceUrls.map(url => ({ sourceUrl: url, retryCount: 0 }));
        
        // 検出統計更新
        const detectedCount = GM_getValue('detectedCount', 0) + sourceUrls.length;
        GM_setValue('detectedCount', detectedCount);
        
        processVideoQueue();
    }

    // ===== キーボードイベント =====
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && cinemaModeState.isActive) {
            e.preventDefault();
            exitCinemaMode();
        }
    });

    // ===== 初期化 =====
    function init() {
        console.log('[動画処理] スクリプト初期化開始');
        
        // スタイルを追加
        addStyles();
        
        // マーケティングバーを削除
        removeMarketingBar();
        
        // 動画URL検出
        const sourceUrls = detectSourceUrls();
        
        if (sourceUrls.length > 0) {
            startVideoProcessing(sourceUrls);
        } else {
            // パスワード認証を試行
            console.log('[動画処理] 動画URLが見つからないため、パスワード認証を確認');
            handlePasswordAuthentication();
            
            // パスワード認証後の再チェック
            setTimeout(() => {
                const retryUrls = detectSourceUrls();
                if (retryUrls.length > 0) {
                    startVideoProcessing(retryUrls);
                }
            }, 2000);
        }
    }

    // DOMContentLoaded後に初期化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // ページ完全読み込み後の再チェック
    window.addEventListener('load', () => {
        setTimeout(() => {
            const videos = document.querySelectorAll('.injected-video-player');
            videos.forEach(video => {
                if (!video.parentElement.querySelector('.video-cinema-button')) {
                    addCinemaModeButton(video);
                }
            });
        }, 1000);
    });

    // ページ離脱時のクリーンアップ
    window.addEventListener('beforeunload', () => {
        if (cinemaModeState.isActive) {
            exitCinemaMode();
        }
    });

    console.log('[動画処理] Tampermonkey スクリプト読み込み完了');
})();