// ==UserScript==
// @name         Twitch VOD 自動匯出助手 By Minidoracat
// @namespace    https://github.com/Minidoracat
// @version      0.9.5
// @description  輔助將 Twitch VOD 匯出到 YouTube，自動填寫日期和遊戲標題（保留原有描述），追蹤已處理影片（可設快取時效），並支援自動化順序匯出、多頁處理、清理快取、單獨清除影片快取及拖動控制面板。新增可客製化的 YouTube 匯出資訊模板及描述附加選項。根據 URL 控制面板顯隱，使用 JS 過濾改進卡片選擇器。
// @author       Minidoracat
// @homepageURL  https://github.com/Minidoracat/twitch-vod-auto-exporter
// @supportURL   https://github.com/Minidoracat/twitch-vod-auto-exporter/issues
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitch.tv
// @match        https://dashboard.twitch.tv/u/*
// @grant        GM.setValue
// @grant        GM.getValue
// @grant        GM.addStyle
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/535600/Twitch%20VOD%20%E8%87%AA%E5%8B%95%E5%8C%AF%E5%87%BA%E5%8A%A9%E6%89%8B%20By%20Minidoracat.user.js
// @updateURL https://update.greasyfork.org/scripts/535600/Twitch%20VOD%20%E8%87%AA%E5%8B%95%E5%8C%AF%E5%87%BA%E5%8A%A9%E6%89%8B%20By%20Minidoracat.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('Twitch VOD 自動匯出助手腳本已載入！ (v0.9.5)');

    // --- 使用者可配置參數 ---
    const CACHE_EXPIRY_HOURS = 0;  // 快取過期時間（小時），0 表示永不過期
    const DEBOUNCE_SCAN_DELAY = 500; // DOM 掃描延遲（毫秒），用於延遲處理頻繁的 DOM 變動事件
    const INITIAL_SCRIPT_DELAY = 2000; // 腳本整體初始化延遲（毫秒），等待頁面初步加載完成
    const SCAN_RETRY_COUNT = 10;      // 初始掃描影片卡片的重試次數
    const SCAN_RETRY_DELAY = 1000;    // 每次重試掃描影片卡片的間隔（毫秒）

    // YouTube 匯出資訊客製化模板
    // 可用變數:
    // {originalTitle} - Twitch 影片的原始標題
    // {videoDate}     - 影片發布日期 (格式 YYYY-MM-DD)
    // {videoRawDate}  - 影片發布日期 (Twitch 原始格式，例如 "2025年4月25日")
    // {gameName}      - 影片的遊戲/分類名稱
    // {gameNameNoSpace} - 影片的遊戲/分類名稱 (無空格)
    // {existingDescription} - YouTube 描述欄位中已有的內容 (如果 YOUTUBE_APPEND_TO_EXISTING_DESCRIPTION 為 true 且原有描述存在)
    const YOUTUBE_TITLE_TEMPLATE = "{originalTitle} [{videoDate}]"; // YouTube 影片標題模板
    const YOUTUBE_DESCRIPTION_PREPEND_TEXT = ""; // 加在 YouTube 原有描述之前的文字 (僅當 YOUTUBE_APPEND_TO_EXISTING_DESCRIPTION 為 true 且原有描述存在時有效)
    const YOUTUBE_DESCRIPTION_APPEND_TEMPLATE = "剪輯日期：{videoRawDate}\n#{gameName}\n#{gameNameNoSpace}\n"; // 要附加到 YouTube 描述的內容模板，或當不附加時作為完整描述
    const YOUTUBE_TAGS_TEMPLATE = "{gameName}"; // YouTube 影片標籤模板
    const YOUTUBE_VISIBILITY = "private"; // YouTube 影片能見度，可選 "private" (私人) 或 "public" (公開)
    const YOUTUBE_APPEND_TO_EXISTING_DESCRIPTION = true; // 是否將生成的描述附加到 YouTube 現有描述之後 (true)，或完全覆蓋 (false)

    const PROCESSED_VIDEOS_STORAGE_KEY = 'twitch_youtube_exporter_processed_videos_v3';
    let isAutoExporting = false;
    let autoExportQueue = [];
    let currentExportPromise = null;

    const controlPanel = document.createElement('div');
    controlPanel.id = 'auto-exporter-control-panel';
    controlPanel.style.display = 'none';

    const dragHandle = document.createElement('div');
    dragHandle.id = 'auto-exporter-drag-handle';
    dragHandle.textContent = '匯出控制面板 (可拖動)';

    const startButton = document.createElement('button');
    startButton.id = 'start-auto-export-button';
    startButton.textContent = '開始自動匯出';
    const stopButton = document.createElement('button');
    stopButton.id = 'stop-auto-export-button';
    stopButton.textContent = '停止自動匯出';
    stopButton.disabled = true;
    const clearCacheButton = document.createElement('button');
    clearCacheButton.id = 'clear-cache-button';
    clearCacheButton.textContent = '清理已處理快取';
    const statusDisplay = document.createElement('div');
    statusDisplay.id = 'auto-exporter-status';
    statusDisplay.textContent = '狀態：待命中';

    controlPanel.appendChild(dragHandle);
    controlPanel.appendChild(startButton);
    controlPanel.appendChild(stopButton);
    controlPanel.appendChild(clearCacheButton);
    controlPanel.appendChild(statusDisplay);

    const videoProducerRegex = /^https:\/\/dashboard\.twitch\.tv\/u\/[^\/]+\/content\/video-producer/;
    let panelInitialized = false;
    let initialScanComplete = false;

    function getVideoCardElements() {
        const allLinks = Array.from(document.querySelectorAll('a'));
        return allLinks.filter(link => link.href && link.href.includes('/content/video-producer/edit/'));
    }

    function tryScanWithRetries(maxRetries = SCAN_RETRY_COUNT, delayBetweenRetries = SCAN_RETRY_DELAY) {
        let attempt = 0;
        console.log(`tryScanWithRetries: 準備開始嘗試掃描，最多 ${maxRetries} 次，間隔 ${delayBetweenRetries}ms。`);
        function scan() {
            attempt++;
            const currentTime = new Date().toLocaleTimeString();
            console.log(`tryScanWithRetries: 第 ${attempt}/${maxRetries} 次嘗試掃描 (${currentTime})。`);
            if (typeof initialScanAndAttachListeners === 'function') {
                initialScanAndAttachListeners(true, (foundCards) => {
                    if (foundCards > 0) {
                        console.log(`tryScanWithRetries: 第 ${attempt} 次嘗試成功找到 ${foundCards} 個卡片，停止重試。`);
                        initialScanComplete = true; return;
                    } else {
                        console.log(`tryScanWithRetries: 第 ${attempt} 次嘗試未找到卡片。`);
                        if (attempt < maxRetries) {
                            console.log(`tryScanWithRetries: ${delayBetweenRetries}ms 後進行下一次嘗試。`);
                            setTimeout(scan, delayBetweenRetries);
                        } else {
                            console.warn(`tryScanWithRetries: 已達到最大嘗試次數 ${maxRetries}，仍未找到影片卡片。`);
                            initialScanComplete = true;
                        }
                    }
                });
            } else {
                 console.error("tryScanWithRetries: initialScanAndAttachListeners 函數未定義!");
                 if (attempt < maxRetries) setTimeout(scan, delayBetweenRetries); else initialScanComplete = true;
            }
        }
        scan();
    }

    function checkUrlAndTogglePanel() {
        if (!panelInitialized || !controlPanel || (document.body && !document.body.contains(controlPanel))) { return; }
        const currentUrl = window.location.href;
        const isOnVideoProducerPage = videoProducerRegex.test(currentUrl);
        if (isOnVideoProducerPage) {
            if (controlPanel.style.display === 'none') {
                console.log("URL 符合 video-producer 且面板隱藏，顯示面板並準備掃描。");
                controlPanel.style.display = 'flex'; initialScanComplete = false; tryScanWithRetries();
            } else if (!initialScanComplete) {
                console.log("URL 符合 video-producer，面板已顯示，但初始掃描未完成，嘗試再次掃描。"); tryScanWithRetries();
            }
        } else {
            if (controlPanel.style.display !== 'none') {
                console.log("URL 不符合 video-producer 且面板顯示，隱藏面板。"); controlPanel.style.display = 'none';
            }
            initialScanComplete = false;
        }
    }

    const originalPushState = history.pushState;
    history.pushState = function(...args) { const r = originalPushState.apply(this, args); setTimeout(checkUrlAndTogglePanel, 50); return r; };
    const originalReplaceState = history.replaceState;
    history.replaceState = function(...args) { const r = originalReplaceState.apply(this, args); setTimeout(checkUrlAndTogglePanel, 50); return r; };
    window.addEventListener('popstate', () => { setTimeout(checkUrlAndTogglePanel, 50); });

    function initializeControlPanelDOM() {
        if (document.body && !document.body.contains(controlPanel)) {
            document.body.appendChild(controlPanel); panelInitialized = true; checkUrlAndTogglePanel();
        } else if (document.body && document.body.contains(controlPanel)) {
            panelInitialized = true; checkUrlAndTogglePanel();
        }
    }

    GM.addStyle(`
        #auto-exporter-control-panel { position: fixed; bottom: 20px; right: 20px; background-color: #2c2c2e; flex-direction: column; padding: 0; border-radius: 8px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 9999; border: 1px solid #444; }
        #auto-exporter-drag-handle { padding: 8px 15px; background-color: #3a3a3d; color: #f0f0f0; cursor: move; text-align: center; font-size: 13px; border-top-left-radius: 7px; border-top-right-radius: 7px; border-bottom: 1px solid #444; user-select: none; }
        #auto-exporter-control-panel button { background-color: #772ce8; color: white; border: none; padding: 10px 15px; border-radius: 5px; cursor: pointer; font-size: 14px; transition: background-color 0.2s ease; margin: 8px 15px 0px 15px; }
        #auto-exporter-control-panel button#clear-cache-button { background-color: #e91e63; }
        #auto-exporter-control-panel button#clear-cache-button:hover { background-color: #c2185b; }
        #auto-exporter-control-panel button:hover { background-color: #5c1f99; }
        #auto-exporter-control-panel button:disabled { background-color: #555; cursor: not-allowed; }
        #auto-exporter-status { color: #e0e0e0; font-size: 12px; text-align: center; padding: 10px 15px 12px 15px; }
        .video-status-label-minidoracat { position: absolute !important; top: 8px !important; right: 8px !important; padding: 2px 6px !important; font-size: 10px !important; font-weight: bold !important; border-radius: 3px !important; z-index: 1001 !important; color: white; text-shadow: 0 0 2px rgba(0,0,0,0.7); }
        .clear-single-cache-button-minidoracat { position: absolute !important; top: 8px !important; right: 65px !important; padding: 1px 5px !important; font-size: 10px !important; font-weight: bold !important; line-height: 1.2 !important; border-radius: 3px !important; z-index: 1002 !important; background-color: #e74c3c; color: white; border: none; cursor: pointer; box-shadow: 0 1px 2px rgba(0,0,0,0.2); display: none; }
        .clear-single-cache-button-minidoracat:hover { background-color: #c0392b; }
        a[href*="/content/video-producer/edit/"] div[data-target="video-card"] { position: relative !important; }
    `);

    let isDragging = false; let initialMouseX, initialMouseY, initialPanelLeft, initialPanelTop;
    dragHandle.addEventListener('mousedown', (e) => { if (e.button !== 0) return; isDragging = true; initialMouseX = e.clientX; initialMouseY = e.clientY; const rect = controlPanel.getBoundingClientRect(); controlPanel.style.left = `${rect.left}px`; controlPanel.style.top = `${rect.top}px`; controlPanel.style.right = 'auto'; controlPanel.style.bottom = 'auto'; initialPanelLeft = controlPanel.offsetLeft; initialPanelTop = controlPanel.offsetTop; dragHandle.style.cursor = 'grabbing'; document.body.style.userSelect = 'none'; document.addEventListener('mousemove', onMouseMove); document.addEventListener('mouseup', onMouseUp); e.preventDefault(); });
    function onMouseMove(e) { if (!isDragging) return; e.preventDefault(); const dx = e.clientX - initialMouseX; const dy = e.clientY - initialMouseY; let newLeft = initialPanelLeft + dx; let newTop = initialPanelTop + dy; if (newLeft < 0) newLeft = 0; if (newTop < 0) newTop = 0; if (newLeft + controlPanel.offsetWidth > window.innerWidth) newLeft = window.innerWidth - controlPanel.offsetWidth; if (newTop + controlPanel.offsetHeight > window.innerHeight) newTop = window.innerHeight - controlPanel.offsetHeight; controlPanel.style.left = `${newLeft}px`; controlPanel.style.top = `${newTop}px`; }
    function onMouseUp() { if (!isDragging) return; isDragging = false; dragHandle.style.cursor = 'move'; document.body.style.userSelect = ''; document.removeEventListener('mousemove', onMouseMove); document.removeEventListener('mouseup', onMouseUp); }

    function debounce(func, delay) { let timeout; return function (...args) { const context = this; clearTimeout(timeout); timeout = setTimeout(() => func.apply(context, args), delay); }; }
    async function getProcessedVideosWithExpiryCheck() { const d = await GM.getValue(PROCESSED_VIDEOS_STORAGE_KEY, '{}'); let pd; try { pd = JSON.parse(d); } catch (e) { return {}; } if (CACHE_EXPIRY_HOURS <= 0) { const v = {}; for (const k in pd) if (pd[k] === true || typeof pd[k] === 'number') v[k] = pd[k]; return v; } const n = Date.now(), exp = CACHE_EXPIRY_HOURS * 3600000, vv = {}; for (const k in pd) { const t = pd[k]; if (typeof t === 'number' && (n - t < exp)) vv[k] = t; else if (pd[k] === true && CACHE_EXPIRY_HOURS <= 0) vv[k] = true; } return vv; }
    async function saveProcessedVideo(videoId) { let p = await getProcessedVideosWithExpiryCheck(); p[videoId] = Date.now(); await GM.setValue(PROCESSED_VIDEOS_STORAGE_KEY, JSON.stringify(p)); console.log(`影片 ${videoId} 已標記處理。`); }
    async function clearProcessedVideoCache() { if (confirm("確定清除所有已處理影片的快取嗎？")) { await GM.setValue(PROCESSED_VIDEOS_STORAGE_KEY, '{}'); statusDisplay.textContent = '狀態：快取已清除。'; if (typeof initialScanAndAttachListeners === 'function') await initialScanAndAttachListeners(true, ()=>{}); alert("快取已清除！"); } }
    clearCacheButton.addEventListener('click', clearProcessedVideoCache);
    function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)); }
    function isElementVisible(el) { if (!el) return false; const s = window.getComputedStyle(el); return s.display !== 'none' && s.visibility !== 'hidden' && s.opacity !== '0' && (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0); }
    function waitForElement(selector, timeout = 10000, parent = document) { return new Promise((resolve, reject) => { const iT = 100; let eT = 0; const i = setInterval(() => { const el = parent.querySelector(selector); if (el && isElementVisible(el)) { clearInterval(i); resolve(el); } else if (eT >= timeout) { clearInterval(i); reject(new Error(`E ${selector} not found`)); } eT += iT; }, iT); }); }
    function dispatchEventOnElement(element, eventName) { if (element) { try { element.dispatchEvent(new Event(eventName, { bubbles: true, cancelable: true })); } catch (e) {} } }
    function setNativeValue(element, value) { const vs = Object.getOwnPropertyDescriptor(element, 'value')?.set; const p = Object.getPrototypeOf(element); const pvs = Object.getOwnPropertyDescriptor(p, 'value')?.set; if (vs && vs !== pvs) pvs.call(element, value); else element.value = value; }

    async function clearSingleVideoCache(videoId, videoCardElement) { let p = await getProcessedVideosWithExpiryCheck(); if (p.hasOwnProperty(videoId)) { delete p[videoId]; await GM.setValue(PROCESSED_VIDEOS_STORAGE_KEY, JSON.stringify(p)); statusDisplay.textContent = `狀態：影片 ${videoId} 快取已清除。`; if (videoCardElement && typeof addStatusLabel === 'function') addStatusLabel(videoCardElement, videoId, false); } }
    function addStatusLabel(videoCardElement, videoId, isProcessed) { const iCD = videoCardElement.querySelector('div[data-target="video-card"]'); if (!iCD) return; let sL = iCD.querySelector('.video-status-label-minidoracat'); if (!sL) { sL = document.createElement('div'); sL.classList.add('video-status-label-minidoracat'); iCD.appendChild(sL); } sL.textContent = isProcessed ? '已處理' : '未處理'; sL.style.backgroundColor = isProcessed ? 'green' : 'orange'; sL.style.color = isProcessed ? 'white' : 'black'; let cB = iCD.querySelector(`.clear-single-cache-button-minidoracat[data-videoid="${videoId}"]`); if (!cB) { cB = document.createElement('button'); cB.classList.add('clear-single-cache-button-minidoracat'); cB.dataset.videoid = videoId; cB.title = `清除影片 ${videoId} 快取`; cB.textContent = '✕'; iCD.appendChild(cB); cB.addEventListener('click', async (e) => { e.preventDefault(); e.stopPropagation(); if (confirm(`確定清除影片 ${videoId} 快取？`)) await clearSingleVideoCache(videoId, videoCardElement); }); } cB.style.display = isProcessed ? 'inline-block' : 'none'; }

    async function processSingleVideoForAutoExport(videoCardElement) { if (!isAutoExporting) return Promise.reject("Auto export stopped"); const vIdEl = videoCardElement.querySelector('div[data-video-id]'); const vId = vIdEl?.dataset.videoId; if (!vId) return; statusDisplay.textContent = `狀態：處理影片 ${vId}...`; const oTitle = videoCardElement.querySelector('h5.CoreText-sc-1txzju1-0.crZNHn')?.textContent.trim() || '無標題'; const rDate = videoCardElement.querySelector('div[data-test-selector="video-card-publish-date-selector"]')?.textContent.trim() || '未知日期'; const gName = videoCardElement.querySelector('p.CoreText-sc-1txzju1-0.hufCyP > a > span')?.textContent.trim() || '未知遊戲'; try { const cT = videoCardElement.querySelector('div[data-a-target="video-card-container"]') || videoCardElement; if (!cT) return; cT.click(); await delay(2500); const eMSel = 'div.edit-video-properties-modal__content'; const eM = await waitForElement(eMSel, 8000); const exBtnEM = await waitForElement('button[data-test-selector="export-selector"]', 3500, eM); exBtnEM.click(); await delay(2200); const yM = await waitForElement('div.export-youtube-modal', 8000); const tI = yM.querySelector('input#ye-title'); const dA = yM.querySelector('textarea#ye-description'); const tagsI = yM.querySelector('input#ye-tags'); const sExBtn = yM.querySelector('button[data-test-selector="save"]'); if (!tI || !dA || !tagsI || !sExBtn) { yM.querySelector('button[aria-label="關閉強制回應"]')?.click(); document.querySelector(`${eMSel} button[data-test-selector="CANCEL_TEST_SELECTOR"], ${eMSel} button[aria-label*="關閉"]`)?.click(); return; } let fVD = ''; if (rDate !== '未知日期') { const dM = rDate.match(/(\d{4})年(\d{1,2})月(\d{1,2})日/); if (dM) fVD = `${dM[1]}-${dM[2].padStart(2, '0')}-${dM[3].padStart(2, '0')}`; } const dD = fVD || rDate; const tVs = { originalTitle: oTitle, videoDate: dD, videoRawDate: rDate, gameName: gName, gameNameNoSpace: gName.replace(/\s+/g, '') }; const fT = YOUTUBE_TITLE_TEMPLATE.replace(/{originalTitle}/g, tVs.originalTitle).replace(/{videoDate}/g, tVs.videoDate).replace(/{videoRawDate}/g, tVs.videoRawDate); let nDC = YOUTUBE_DESCRIPTION_APPEND_TEMPLATE.replace(/{videoRawDate}/g, tVs.videoRawDate).replace(/{gameName}/g, tVs.gameName).replace(/{gameNameNoSpace}/g, tVs.gameNameNoSpace); let fD; const eD = dA.value.trim(); if (YOUTUBE_APPEND_TO_EXISTING_DESCRIPTION) { fD = YOUTUBE_DESCRIPTION_PREPEND_TEXT; if (eD) fD += eD + "\n" + nDC; else fD += nDC; } else fD = nDC; const fTags = YOUTUBE_TAGS_TEMPLATE.replace(/{gameName}/g, tVs.gameName).replace(/{gameNameNoSpace}/g, tVs.gameNameNoSpace); const fs = [{ el: tI, v: fT, n: "標題" }, { el: dA, v: fD, n: "描述" }, { el: tagsI, v: fTags, n: "標籤" }]; for (const f of fs) { if (f.el) { f.el.focus(); await delay(100); setNativeValue(f.el, f.v); dispatchEventOnElement(f.el, 'input'); await delay(100); dispatchEventOnElement(f.el, 'change'); await delay(100); f.el.blur(); await delay(100); } } const tRV = YOUTUBE_VISIBILITY === "private" ? "true" : "false"; const vR = yM.querySelector(`input[type="radio"][value="${tRV}"]`); if (vR && !vR.checked) { vR.click(); await delay(500); } sExBtn.click(); await saveProcessedVideo(vId); if (typeof addStatusLabel === 'function') addStatusLabel(videoCardElement, vId, true); await delay(1200); yM.querySelector('button[aria-label="關閉強制回應"]')?.click(); await delay(200); document.querySelector(`${eMSel} button[data-test-selector="CANCEL_TEST_SELECTOR"], ${eMSel} button[aria-label*="關閉"]`)?.click(); await delay(200); } catch (error) { statusDisplay.textContent = `狀態：處理影片 ${vId} 失敗。`; document.querySelector('div.export-youtube-modal button[aria-label="關閉強制回應"]')?.click(); await delay(200); document.querySelector(`div.edit-video-properties-modal__content button[data-test-selector="CANCEL_TEST_SELECTOR"]`)?.click(); } }

    async function startAutoExport() { if (isAutoExporting) return; isAutoExporting = true; startButton.disabled = true; stopButton.disabled = false; statusDisplay.textContent = '狀態：開始自動匯出多頁...'; let cP = 1; let hNP = true; do { if (!isAutoExporting) break; statusDisplay.textContent = `狀態：掃描第 ${cP} 頁...`; await delay(1500); let foundOnPage = 0; await new Promise(resolve => initialScanAndAttachListeners(true, (count) => { foundOnPage = count; resolve(); })); const pVids = await getProcessedVideosWithExpiryCheck(); const cards = getVideoCardElements(); const toProc = cards.filter(c => { const id = c.querySelector('div[data-video-id]')?.dataset.videoId; return id && !pVids[id]; }); if (toProc.length === 0) { statusDisplay.textContent = `狀態：第 ${cP} 頁無未處理影片。`; } else { statusDisplay.textContent = `狀態：第 ${cP} 頁找到 ${toProc.length} 個影片。`; for (let i = 0; i < toProc.length; i++) { if (!isAutoExporting) break; const card = toProc[i]; const id = card.querySelector('div[data-video-id]')?.dataset.videoId || '未知ID'; try { currentExportPromise = processSingleVideoForAutoExport(card); await currentExportPromise; currentExportPromise = null; if (isAutoExporting) await delay(4500 + Math.random() * 2000); } catch (e) { if (String(e).includes("Auto export stopped")) break; } } if (!isAutoExporting) break; } const nPB = document.querySelector('button[aria-label="下一頁"]:not([disabled])'); if (nPB && isAutoExporting) { statusDisplay.textContent = `狀態：第 ${cP} 頁處理完畢，前往下一頁...`; nPB.click(); cP++; hNP = true; await delay(5000); } else { hNP = false; if (isAutoExporting) statusDisplay.textContent = '狀態：已到達最後一頁或下一頁按鈕不可用。'; } } while (isAutoExporting && hNP); if (isAutoExporting) statusDisplay.textContent = '狀態：所有頁面影片已處理完畢！'; stopAutoExport(false); }
    function stopAutoExport(manual = true) { isAutoExporting = false; startButton.disabled = false; stopButton.disabled = true; if (manual) statusDisplay.textContent = '狀態：自動匯出已停止。'; else if (statusDisplay.textContent !== '狀態：所有頁面影片已處理完畢！') statusDisplay.textContent = '狀態：自動匯出已完成或停止。'; if (currentExportPromise) {} autoExportQueue = []; }
    startButton.addEventListener('click', startAutoExport); stopButton.addEventListener('click', () => stopAutoExport(true));

    async function initialScanAndAttachListeners(forceUpdate = false, callback = () => {}) {
        if (controlPanel.style.display === 'none' && !forceUpdate) {
            callback(0); return;
        }
        const processedVideos = await getProcessedVideosWithExpiryCheck();
        const allVideoCardElements = getVideoCardElements(); // 使用新的 JS 過濾方法
        console.log(`initialScanAndAttachListeners: 使用 JS 過濾找到 ${allVideoCardElements.length} 個影片卡片元素。`);

        if (allVideoCardElements.length === 0 && videoProducerRegex.test(window.location.href)) {
            console.warn("initialScanAndAttachListeners: 在 video-producer 頁面未找到任何影片卡片 (即使使用 JS 過濾)。開始詳細調試...");
            const allLinks = document.querySelectorAll('a');
            let foundMatchByHrefIncludes = 0;
            allLinks.forEach(link => { if(link.href && link.href.includes('/content/video-producer/edit/')) foundMatchByHrefIncludes++; });
            console.log(`initialScanAndAttachListeners (調試): 頁面中所有 <a> 標籤數量: ${allLinks.length}`);
            console.log(`initialScanAndAttachListeners (調試): 透過 href.includes('/content/video-producer/edit/') 找到 ${foundMatchByHrefIncludes} 個 <a> 標籤。`);
            const allDivsWithVideoId = document.querySelectorAll('div[data-video-id]');
            console.log(`initialScanAndAttachListeners (調試): 頁面中所有 div[data-video-id] 數量: ${allDivsWithVideoId.length}`);
            const currentUsername = window.location.pathname.split('/u/')[1]?.split('/')[0];
            if (currentUsername) {
                const specificUserLinkSelector = `a[href*="/u/${currentUsername}/content/video-producer/edit/"]`;
                const specificUserLinks = document.querySelectorAll(specificUserLinkSelector);
                console.log(`initialScanAndAttachListeners (調試): 使用特定用戶名 CSS 選擇器 '${specificUserLinkSelector}' 找到 ${specificUserLinks.length} 個元素。`);
            } else {
                console.log(`initialScanAndAttachListeners (調試): 未能從 URL (${window.location.pathname}) 提取用戶名。`);
            }
        }

        allVideoCardElements.forEach((cardElement) => {
            const videoId = cardElement.querySelector('div[data-video-id]')?.dataset.videoId;
            if (videoId) {
                if (forceUpdate || !cardElement.dataset.scriptProcessed) {
                    if (typeof addStatusLabel === 'function') addStatusLabel(cardElement, videoId, !!processedVideos[videoId]);
                }
            }
            cardElement.dataset.scriptProcessed = 'true';
        });
        callback(allVideoCardElements.length);
    }

    const debouncedScan = debounce(async () => {
        if (controlPanel.style.display !== 'none') {
            if (typeof initialScanAndAttachListeners === 'function') await initialScanAndAttachListeners(true, ()=>{});
        }
    }, DEBOUNCE_SCAN_DELAY);

    const observer = new MutationObserver(async (mutationsList) => {
        if (controlPanel.style.display === 'none') return;
        let significantChange = false;
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList' && (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0)) {
                const nodes = [...mutation.addedNodes, ...mutation.removedNodes];
                if (nodes.some(node => {
                    if (node.nodeType !== Node.ELEMENT_NODE) return false;
                    // 直接檢查節點本身是否是我們感興趣的連結
                    if (node.matches && node.matches('a') && node.href && node.href.includes('/content/video-producer/edit/')) return true;
                    // 或者檢查節點內部是否包含我們感興趣的連結 (針對容器節點被添加/移除的情況)
                    if (node.querySelector && node.querySelector('a[href*="/content/video-producer/edit/"]')) return true;
                    return false;
                })) {
                    significantChange = true; break;
                }
            }
        }
        if (significantChange && !isAutoExporting) debouncedScan();
    });

    function initializeObserverAndScan() {
        let targetNodeForObserver;
        const mainContentArea = document.querySelector('main div[class*="video-producer-page"], main div[class*="producer-content-wrapper"]');
        const mainElement = document.querySelector('main');
        if (mainContentArea) targetNodeForObserver = mainContentArea;
        else if (mainElement) targetNodeForObserver = mainElement;
        else { targetNodeForObserver = document.body; console.warn("initializeObserverAndScan: 未找到 mainContentArea 或 main 元素，MutationObserver 將觀察 document.body。"); }
        console.log('initializeObserverAndScan: 最終觀察器目標:', targetNodeForObserver.id || targetNodeForObserver.className || targetNodeForObserver.tagName);
        observer.observe(targetNodeForObserver, { childList: true, subtree: true });
    }

    function initializeScript() {
        console.log("initializeScript: 開始初始化腳本...");
        initializeControlPanelDOM();
        initializeObserverAndScan();
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(initializeScript, INITIAL_SCRIPT_DELAY);
    } else {
        window.addEventListener('load', () => {
            setTimeout(initializeScript, INITIAL_SCRIPT_DELAY);
        });
    }
})();