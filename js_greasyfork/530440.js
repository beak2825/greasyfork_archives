// ==UserScript==
// @name         YAKITORY 控制面板 - iLearn 影音平台自動播放、自動靜音
// @namespace    https://github.com/poterpan/tampermonkey-scripts/yakitory-helper
// @version      2.2
// @description  自動點擊YAKITORY影音平台上的確認按鈕，結束時通知，自動播放下一部影片，自動靜音，以及提供控制面板
// @author       PoterPan
// @match        *://ilearn.fcu.edu.tw/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @grant        GM_addStyle
// @homepageURL  https://github.com/poterpan/tampermonkey-scripts
// @supportURL   https://github.com/poterpan/tampermonkey-scripts/issues
// @downloadURL https://update.greasyfork.org/scripts/530440/YAKITORY%20%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%20-%20iLearn%20%E5%BD%B1%E9%9F%B3%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8B%95%E9%9D%9C%E9%9F%B3.user.js
// @updateURL https://update.greasyfork.org/scripts/530440/YAKITORY%20%E6%8E%A7%E5%88%B6%E9%9D%A2%E6%9D%BF%20-%20iLearn%20%E5%BD%B1%E9%9F%B3%E5%B9%B3%E5%8F%B0%E8%87%AA%E5%8B%95%E6%92%AD%E6%94%BE%E3%80%81%E8%87%AA%E5%8B%95%E9%9D%9C%E9%9F%B3.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ===================== 配置選項 =====================
    // 設定檢查間隔（毫秒）
    const checkInterval = 2000; // 每2秒檢查一次

    // 影片接近結束的閾值（百分比）
    const endThreshold = 95; // 當影片播放進度達到95%時發出通知

    // 影片完全結束的閾值（百分比）
    const completeThreshold = 99; // 當影片播放進度達到99%時視為已完成

    // 通知聲音URL (公開可訪問的音效文件)
    const notificationSound = 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_a29a673ef4.mp3?filename=decidemp3-14575.mp3'; // 替換為您喜歡的音效

    // 自動播放檢查的時間間隔（毫秒）
    const autoPlayCheckInterval = 2000; // 跳轉到新頁面後，自動播放檢查的時間間隔

    // ===================== 全局變量 =====================
    // 狀態控制
    let notificationSent = false;
    let videoCompleted = false;
    let lastVideoInfo = GM_getValue('lastVideoInfo', {
        title: '無記錄',
        progress: '0%',
        timestamp: 0
    });

    // 功能開關
    let autoClickerEnabled = GM_getValue('autoClickerEnabled', true);
    let autoNextEnabled = GM_getValue('autoNextEnabled', false);
    let soundEnabled = GM_getValue('soundEnabled', true);
    let autoMuteEnabled = GM_getValue('autoMuteEnabled', false); // 自動靜音功能默認關閉
    let isPanelExpanded = GM_getValue('isPanelExpanded', true);

    // 當前影片信息
    let currentVideoInfo = {
        title: '未檢測到影片',
        progress: '0%'
    };

    // ===================== 控制面板 =====================
    // 添加自訂CSS樣式
    GM_addStyle(`
        #yakitory-control-panel {
            transition: all 0.3s ease;
            font-family: Arial, sans-serif;
        }
        #yakitory-control-panel.collapsed {
            width: 40px !important;
            height: 40px !important;
            overflow: hidden;
            border-radius: 50%;
        }
        #yakitory-control-panel.collapsed #yakitory-panel-content {
            display: none;
        }
        #yakitory-toggle-panel {
            font-size: 16px;
            font-weight: bold;
        }
        #yakitory-status-icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            border-radius: 50%;
            margin-right: 5px;
        }
        .yakitory-controls {
            margin-bottom: 8px;
        }
        .yakitory-slider {
            width: 100%;
            margin-top: 5px;
        }
    `);

    // 創建控制面板
    function createControlPanel() {
        const panelDiv = document.createElement('div');
        panelDiv.id = 'yakitory-control-panel';
        panelDiv.classList.add(isPanelExpanded ? 'expanded' : 'collapsed');
        panelDiv.style.position = 'fixed';
        panelDiv.style.top = '100px';
        panelDiv.style.right = '20px';
        panelDiv.style.zIndex = '9999';
        panelDiv.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        panelDiv.style.border = '1px solid #ccc';
        panelDiv.style.borderRadius = '5px';
        panelDiv.style.padding = '10px';
        panelDiv.style.width = '250px';
        panelDiv.style.boxShadow = '0 0 10px rgba(0,0,0,0.2)';

        panelDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
                <strong style="white-space: nowrap; overflow: hidden;">YAKITORY 控制</strong>
                <button id="yakitory-toggle-panel" style="background: none; border: none; cursor: pointer;">${isPanelExpanded ? '_' : '+'}</button>
            </div>
            <div id="yakitory-panel-content" style="${isPanelExpanded ? '' : 'display: none;'}">
                <div class="yakitory-controls">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="yakitory-autoclicker-enabled" ${autoClickerEnabled ? 'checked' : ''}>
                        <span style="margin-left: 5px;">自動點擊確認</span>
                    </label>
                </div>
                <div class="yakitory-controls">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="yakitory-autonext-enabled" ${autoNextEnabled ? 'checked' : ''}>
                        <span style="margin-left: 5px;">自動播放下一部</span>
                    </label>
                </div>
                <div class="yakitory-controls">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="yakitory-sound-enabled" ${soundEnabled ? 'checked' : ''}>
                        <span style="margin-left: 5px;">結束通知聲音</span>
                    </label>
                </div>
                <div class="yakitory-controls">
                    <label style="display: flex; align-items: center;">
                        <input type="checkbox" id="yakitory-automute-enabled" ${autoMuteEnabled ? 'checked' : ''}>
                        <span style="margin-left: 5px;">自動靜音影片</span>
                    </label>
                </div>
                <div style="margin-top: 10px; font-size: 12px;">
                    <strong>當前影片:</strong><br><span id="yakitory-current-video" style="word-break: break-all;">-</span><br>
                    <strong>播放進度:</strong> <span id="yakitory-progress">-</span>
                </div>
                <div style="margin-top: 10px; font-size: 12px;">
                    <strong>上次完成:</strong><br><span id="yakitory-last-video" style="word-break: break-all;">${lastVideoInfo.title || '-'}</span>
                    <br><span id="yakitory-last-time">${formatTimestamp(lastVideoInfo.timestamp)}</span>
                </div>
                <div style="margin-top: 10px; text-align: center;">
                    <span id="yakitory-status-icon" style="background-color: green;"></span>
                    <span id="yakitory-status" style="font-size: 12px;">運行中</span>
                </div>
                <div style="margin-top: 6px; text-align: center;">
                    <button id="yakitory-test-play" style="font-size: 11px; padding: 2px 6px; background-color: #f0f0f0; border: 1px solid #ccc; border-radius: 3px; cursor: pointer;">測試自動播放</button>
                </div>
            </div>
        `;

        document.body.appendChild(panelDiv);

        // 添加控制面板拖曳功能
        makeDraggable(panelDiv);

        // 綁定事件
        document.getElementById('yakitory-toggle-panel').addEventListener('click', togglePanel);
        document.getElementById('yakitory-autoclicker-enabled').addEventListener('change', function(e) {
            autoClickerEnabled = e.target.checked;
            GM_setValue('autoClickerEnabled', autoClickerEnabled);
            updateStatusDisplay();
        });
        document.getElementById('yakitory-autonext-enabled').addEventListener('change', function(e) {
            autoNextEnabled = e.target.checked;
            GM_setValue('autoNextEnabled', autoNextEnabled);
            updateStatusDisplay();
        });
        document.getElementById('yakitory-sound-enabled').addEventListener('change', function(e) {
            soundEnabled = e.target.checked;
            GM_setValue('soundEnabled', soundEnabled);
        });

        document.getElementById('yakitory-automute-enabled').addEventListener('change', function(e) {
            autoMuteEnabled = e.target.checked;
            GM_setValue('autoMuteEnabled', autoMuteEnabled);

            // 如果開啟了自動靜音，立即對當前影片進行靜音處理
            if (autoMuteEnabled) {
                muteCurrentVideo();
            }
        });

        // 測試自動播放按鈕
        document.getElementById('yakitory-test-play').addEventListener('click', function() {
            const played = autoPlayVideo();
            if (!played) {
                alert('未找到可播放的影片或播放失敗，請手動點擊播放按鈕');
            } else {
                this.textContent = '播放成功!';
                setTimeout(() => {
                    this.textContent = '測試自動播放';
                }, 2000);
            }
        });

        // 如果啟用了自動靜音，立即嘗試靜音當前影片
        if (autoMuteEnabled) {
            setTimeout(muteCurrentVideo, 1000);
        }

        // 初始顯示
        updateVideoInfoDisplay();
        updateStatusDisplay();
    }

    // 使控制面板可拖曳
    function makeDraggable(elem) {
        let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

        elem.style.cursor = 'move';

        elem.onmousedown = dragMouseDown;

        function dragMouseDown(e) {
            e = e || window.event;
            e.preventDefault();
            // 獲取滑鼠位置
            pos3 = e.clientX;
            pos4 = e.clientY;
            document.onmouseup = closeDragElement;
            // 當滑鼠移動時調用elementDrag函數
            document.onmousemove = elementDrag;
        }

        function elementDrag(e) {
            e = e || window.event;
            e.preventDefault();
            // 計算新位置
            pos1 = pos3 - e.clientX;
            pos2 = pos4 - e.clientY;
            pos3 = e.clientX;
            pos4 = e.clientY;
            // 設置元素的新位置
            elem.style.top = (elem.offsetTop - pos2) + "px";
            elem.style.right = (parseInt(elem.style.right) + pos1) + "px";
        }

        function closeDragElement() {
            // 停止移動
            document.onmouseup = null;
            document.onmousemove = null;
        }
    }

    // 切換控制面板展開/收起狀態
    function togglePanel() {
        const panel = document.getElementById('yakitory-control-panel');
        const content = document.getElementById('yakitory-panel-content');
        const toggleBtn = document.getElementById('yakitory-toggle-panel');

        isPanelExpanded = !isPanelExpanded;
        GM_setValue('isPanelExpanded', isPanelExpanded);

        if (isPanelExpanded) {
            panel.classList.remove('collapsed');
            panel.classList.add('expanded');
            content.style.display = '';
            toggleBtn.textContent = '_';
        } else {
            panel.classList.remove('expanded');
            panel.classList.add('collapsed');
            content.style.display = 'none';
            toggleBtn.textContent = '+';
        }
    }

    // 更新狀態顯示
    function updateStatusDisplay() {
        const statusIcon = document.getElementById('yakitory-status-icon');
        const statusText = document.getElementById('yakitory-status');

        if (autoClickerEnabled || autoNextEnabled || autoMuteEnabled) {
            statusIcon.style.backgroundColor = 'green';
            statusText.textContent = '運行中';
            statusText.style.color = 'green';
        } else {
            statusIcon.style.backgroundColor = 'gray';
            statusText.textContent = '已暫停';
            statusText.style.color = 'gray';
        }
    }

    // 更新影片信息顯示
    function updateVideoInfoDisplay() {
        const currentVideoElem = document.getElementById('yakitory-current-video');
        const progressElem = document.getElementById('yakitory-progress');
        const lastVideoElem = document.getElementById('yakitory-last-video');
        const lastTimeElem = document.getElementById('yakitory-last-time');

        if (currentVideoElem) currentVideoElem.textContent = currentVideoInfo.title || '-';
        if (progressElem) progressElem.textContent = currentVideoInfo.progress || '-';
        if (lastVideoElem) lastVideoElem.textContent = lastVideoInfo.title || '-';
        if (lastTimeElem) lastTimeElem.textContent = formatTimestamp(lastVideoInfo.timestamp);
    }

    // 格式化時間戳
    function formatTimestamp(timestamp) {
        if (!timestamp) return '-';
        const date = new Date(timestamp);
        return `${date.getMonth()+1}/${date.getDate()} ${padZero(date.getHours())}:${padZero(date.getMinutes())}`;
    }

    // 數字前綴補零
    function padZero(num) {
        return num < 10 ? '0' + num : num;
    }

    // ===================== 影片播放相關函數 =====================
    // 檢測目前頁面的影片標題
    function detectVideoTitle() {
        // 嘗試多種可能的標題選擇器
        const titleSelectors = [
            '.page-header-headings h1',                // 頁面標題
            '.activityname',                          // 活動名稱
            '.modvideos_videojs .video-js',           // 影片容器
            'h1.h2',                                  // 標題元素
            'title'                                   // 頁面標題
        ];

        let title = '';
        for (const selector of titleSelectors) {
            const element = document.querySelector(selector);
            if (element) {
                title = element.textContent.trim();
                if (title) break;
            }
        }

        return title || '未知影片';
    }

    // 播放聲音
    function playNotificationSound() {
        if (!soundEnabled) return;

        const audio = new Audio(notificationSound);
        audio.volume = 0.8; // 音量 (0.0 到 1.0)

        // 嘗試播放
        audio.play().catch(error => {
            console.log('無法播放通知聲音:', error);
        });
    }

    // 監控影片進度並在接近結束時通知
    function checkVideoProgress() {
        const progressControl = document.querySelector('.vjs-progress-control');
        if (!progressControl) return;

        const progressHolder = progressControl.querySelector('.vjs-progress-holder');
        if (!progressHolder || !progressHolder.hasAttribute('aria-valuenow')) return;

        const progress = parseFloat(progressHolder.getAttribute('aria-valuenow'));
        const totalTime = progressHolder.getAttribute('aria-valuetext') || '';

        // 更新當前影片信息
        currentVideoInfo.title = detectVideoTitle();
        currentVideoInfo.progress = `${progress.toFixed(1)}%`;
        updateVideoInfoDisplay();

        // 檢查影片是否接近結束且尚未發送過通知
        if (progress >= endThreshold && !notificationSent) {
            // 發送通知
            GM_notification({
                title: '影片即將結束',
                text: `影片已播放 ${progress.toFixed(1)}%，${totalTime}`,
                timeout: 10000 // 通知顯示10秒
            });

            // 播放聲音提示
            playNotificationSound();

            // 在頁面上顯示一個通知
            const notificationDiv = document.createElement('div');
            notificationDiv.style.position = 'fixed';
            notificationDiv.style.top = '20px';
            notificationDiv.style.right = '20px';
            notificationDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
            notificationDiv.style.color = 'white';
            notificationDiv.style.padding = '10px 20px';
            notificationDiv.style.borderRadius = '5px';
            notificationDiv.style.zIndex = '9999';
            notificationDiv.style.fontWeight = 'bold';
            notificationDiv.textContent = `影片即將結束: ${progress.toFixed(1)}%, ${totalTime}`;
            document.body.appendChild(notificationDiv);

            // 5秒後自動移除頁面通知
            setTimeout(() => {
                if (document.body.contains(notificationDiv)) {
                    document.body.removeChild(notificationDiv);
                }
            }, 5000);

            // 標記已發送通知以避免重複
            notificationSent = true;
        }

        // 檢查影片是否已完成且需要自動跳到下一個
        if (progress >= completeThreshold && !videoCompleted && autoNextEnabled) {
            videoCompleted = true;

            // 保存最後完成的影片信息
            lastVideoInfo = {
                title: currentVideoInfo.title,
                progress: `${progress.toFixed(1)}%`,
                timestamp: Date.now()
            };
            GM_setValue('lastVideoInfo', lastVideoInfo);
            updateVideoInfoDisplay();

            // 設置跳轉標記 (為下一頁做準備)
            GM_setValue('pendingAutoPlay', true);
            GM_setValue('lastJumpTime', Date.now());

            // 延遲1秒再點擊下一個影片按鈕，給影片一些緩衝時間
            setTimeout(goToNextVideo, 1000);
        }

        // 如果影片已重新開始或新影片，重設通知狀態
        if (progress < 50) {
            notificationSent = false;
            videoCompleted = false;
        }
    }

    // 檢查影片元素狀態並自動播放
    function autoPlayVideo() {
        console.log("嘗試自動播放影片...");

        // 首先嘗試找到影片元素
        const videoElements = document.querySelectorAll('.video-js');

        if (videoElements.length === 0) {
            console.log("未找到影片元素");
            return false;
        }

        let played = false;

        videoElements.forEach(videoElement => {
            // 檢查影片是否處於暫停或未播放狀態
            if (videoElement.classList.contains('vjs-paused') ||
                !videoElement.classList.contains('vjs-playing')) {

                console.log("找到需要播放的影片元素:", videoElement.id);

                // 如果啟用了自動靜音，先將影片靜音
                if (autoMuteEnabled) {
                    muteVideo(videoElement);
                }

                // 嘗試方法1: 點擊大的播放按鈕
                const bigPlayButton = videoElement.querySelector('.vjs-big-play-button');
                if (bigPlayButton && window.getComputedStyle(bigPlayButton).display !== 'none') {
                    console.log("點擊大播放按鈕");
                    bigPlayButton.click();
                    played = true;
                    return;
                }

                // 嘗試方法2: 點擊控制欄中的播放按鈕
                const playControl = videoElement.querySelector('.vjs-play-control');
                if (playControl && playControl.classList.contains('vjs-paused')) {
                    console.log("點擊控制欄播放按鈕");
                    playControl.click();
                    played = true;
                    return;
                }

                // 嘗試方法3: 使用videojs API (如果可用)
                if (window.videojs && videoElement.id) {
                    try {
                        const player = videojs(videoElement.id);
                        if (player && typeof player.play === 'function') {
                            console.log("使用videojs API播放");
                            player.play();
                            played = true;
                            return;
                        }
                    } catch (e) {
                        console.log("videojs API調用失敗:", e);
                    }
                }
            } else {
                console.log("影片已經在播放中:", videoElement.id);

                // 如果影片正在播放且啟用了自動靜音，確保其處於靜音狀態
                if (autoMuteEnabled) {
                    muteVideo(videoElement);
                }

                played = true;
            }
        });

        return played;
    }

    // 將影片靜音
    function muteVideo(videoElement) {
        if (!videoElement) return;

        console.log("嘗試將影片靜音:", videoElement.id);

        // 方法1: 使用volumePanel中的靜音按鈕
        const muteButton = videoElement.querySelector('.vjs-mute-control');
        if (muteButton && !muteButton.classList.contains('vjs-vol-0')) {
            console.log("點擊靜音按鈕");
            muteButton.click();
            return true;
        }

        // 方法2: 使用videojs API
        if (window.videojs && videoElement.id) {
            try {
                const player = videojs(videoElement.id);
                if (player && typeof player.muted === 'function') {
                    console.log("使用videojs API靜音");
                    player.muted(true);
                    return true;
                }
            } catch (e) {
                console.log("videojs API調用失敗:", e);
            }
        }

        return false;
    }

    // 靜音當前頁面上的所有影片
    function muteCurrentVideo() {
        const videoElements = document.querySelectorAll('.video-js');
        let success = false;

        videoElements.forEach(videoElement => {
            if (muteVideo(videoElement)) {
                success = true;
            }
        });

        return success;
    }

    // 檢查頁面上的影片狀態和播放情況
    function checkAndPlayVideo() {
        // 如果自動下一步功能開啟
        if (autoNextEnabled) {
            // 檢查是否剛剛跳轉到新頁面或需要自動播放
            const currentTime = Date.now();
            const timeSinceLastJump = currentTime - lastJumpTime;

            // 如果是最近跳轉的頁面或標記為待自動播放
            if (pendingAutoPlay || timeSinceLastJump < 10000) {
                console.log("檢測到頁面跳轉或需要自動播放");

                // 重置自動播放標記
                pendingAutoPlay = false;
                GM_setValue('pendingAutoPlay', false);

                // 影片自動播放 (延遲2秒等待頁面完全加載)
                setTimeout(() => {
                    if (!autoPlayVideo()) {
                        // 如果第一次未成功，再嘗試一次
                        setTimeout(autoPlayVideo, 2000);
                    }
                }, 2000);
            }
        } else if (autoMuteEnabled) {
            // 如果僅啟用了自動靜音但未啟用自動播放，確保影片處於靜音狀態
            setTimeout(() => {
                muteCurrentVideo();
            }, 2000);
        }
    }

    // 自動點擊下一個影片按鈕
    function goToNextVideo() {
        if (!autoNextEnabled) return;

        console.log('嘗試尋找並點擊下一個活動按鈕...');

        // 嘗試找到"下一個活動"按鈕並點擊
        const nextActivityButton = document.querySelector('#next-activity-link');
        if (nextActivityButton) {
            console.log('找到下一個活動按鈕，自動點擊');
            // 滾動到按鈕位置
            nextActivityButton.scrollIntoView({ behavior: 'smooth' });

            // 延遲500ms後點擊，確保滾動完成
            setTimeout(() => {
                nextActivityButton.click();
                console.log('已點擊下一個活動按鈕');
            }, 500);
            return;
        }

        console.log('未找到下一個活動按鈕');
    }

    // 自動點擊"是的, 請繼續"按鈕
    function checkAfkDialog() {
        if (!autoClickerEnabled) return;

        // 查找不帶hidden類的vjs-afk-container
        const dialogBox = document.querySelector('.vjs-afk-container:not(.hidden)');

        if (dialogBox) {
            // 在對話框中查找"是的, 請繼續"按鈕
            const confirmButton = dialogBox.querySelector('.vjs-afk-button:nth-child(2), button.vjs-afk-button:first-of-type');

            if (confirmButton && confirmButton.textContent.includes('是的, 請繼續')) {
                console.log('找到繼續觀看按鈕，自動點擊');
                confirmButton.click();
            }
        }
    }

    // 設置DOM變化監聽器
    function setupObserver() {
        const observer = new MutationObserver(function(mutations) {
            let shouldCheckPlay = false;

            mutations.forEach(function(mutation) {
                // 檢查新增節點
                if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                    Array.from(mutation.addedNodes).forEach(node => {
                        // 監控影片確認對話框
                        if (node.nodeType === 1 && node.classList && node.classList.contains('vjs-afk-container')) {
                            if (autoClickerEnabled) {
                                const confirmButton = node.querySelector('button.vjs-afk-button:first-of-type');
                                if (confirmButton && confirmButton.textContent.includes('是的, 請繼續')) {
                                    console.log('發現新增對話框，立即點擊');
                                    confirmButton.click();
                                }
                            }
                        }

                        // 監控影片播放器元素加載
                        if (node.nodeType === 1 &&
                            (node.classList && node.classList.contains('video-js') ||
                             node.querySelector && node.querySelector('.video-js'))) {
                            shouldCheckPlay = true;
                        }
                    });
                }

                // 檢查屬性變化（hidden class被移除的情況）
                if (mutation.type === 'attributes' &&
                    mutation.attributeName === 'class' &&
                    mutation.target.classList) {

                    // 影片確認對話框
                    if (mutation.target.classList.contains('vjs-afk-container') &&
                        !mutation.target.classList.contains('hidden')) {

                        if (autoClickerEnabled) {
                            const confirmButton = mutation.target.querySelector('button.vjs-afk-button:first-of-type');
                            if (confirmButton && confirmButton.textContent.includes('是的, 請繼續')) {
                                console.log('對話框顯示狀態變化，立即點擊');
                                confirmButton.click();
                            }
                        }
                    }

                    // 影片播放狀態變化
                    if (mutation.target.classList.contains('video-js')) {
                        if (autoMuteEnabled && !mutation.target.classList.contains('vjs-muted')) {
                            muteVideo(mutation.target);
                        }
                        shouldCheckPlay = true;
                    }
                }
            });

            // 檢測到影片相關變化時檢查自動播放和靜音
            if (shouldCheckPlay) {
                if (autoNextEnabled || autoMuteEnabled) {
                    setTimeout(() => {
                        if (autoNextEnabled) autoPlayVideo();
                        if (autoMuteEnabled) muteCurrentVideo();
                    }, 500);
                }
            }
        });

        // 開始觀察頁面變化，特別關注class屬性的變化
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class']
        });

        console.log('DOM變化監聽器已設置');
    }

    // ===================== 初始化 =====================
    // 等待頁面加載完成
    function init() {
        console.log('YAKITORY增強腳本初始化中...');

        // 創建控制面板
        createControlPanel();

        // 設定定期檢查
        setInterval(checkVideoProgress, checkInterval); // 檢查影片進度
        setInterval(checkAfkDialog, checkInterval); // 檢查確認對話框

        // 檢查當前頁面狀態
        checkCurrentPage();

        // 設置DOM變化監聽器
        setupObserver();

        // 檢查是否需要自動播放影片
        setTimeout(checkAndPlayVideo, 2000);

        // 添加頁面可見性變化檢測（用於處理頁面切換和跳轉）
        document.addEventListener('visibilitychange', function() {
            if (document.visibilityState === 'visible') {
                checkAndPlayVideo();
            }
        });

        // 頁面加載完成後再次檢查
        window.addEventListener('load', function() {
            setTimeout(checkAndPlayVideo, 1000);
        });

        console.log('YAKITORY增強腳本已啟動');
    }

    // 檢查當前頁面的狀況
    function checkCurrentPage() {
        // 檢查當前URL是否包含影片頁面特徵
        const isVideoPage = window.location.href.includes('/mod/videos/view.php');

        // 檢查是否有影片元素
        const hasVideoElement = document.querySelector('.video-js') !== null;

        // 檢查是否來自跳轉
        const pendingAutoPlay = GM_getValue('pendingAutoPlay', false);
        const lastJumpTime = GM_getValue('lastJumpTime', 0);
        const timeSinceJump = Date.now() - lastJumpTime;

        console.log(`當前頁面狀況: 影片頁面=${isVideoPage}, 有影片元素=${hasVideoElement}, 待自動播放=${pendingAutoPlay}, 跳轉時間=${timeSinceJump}ms前`);

        // 重置一些狀態
        if (isVideoPage && hasVideoElement) {
            notificationSent = false;
            videoCompleted = false;
        }
    }

    // 當DOM加載完成後初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();