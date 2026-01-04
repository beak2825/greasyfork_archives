// ==UserScript==
// @name         KIPSutian-autoplay
// @namespace    aiuanyu
// @version      4.53b
// @description  自動開啟查詢結果表格/列表中每個詞目連結於 Modal iframe (表格) 或直接播放音檔 (列表)，依序播放音檔(自動偵測時長)，主表格/列表自動滾動高亮(播放時持續綠色，暫停時僅閃爍，表格頁同步高亮)，處理完畢後自動跳轉下一頁繼續播放，可即時暫停/停止/點擊背景暫停(表格)/點擊表格/列表列播放，並根據亮暗模式高亮按鈕。新增：儲存/載入最近10筆播放進度(使用絕對索引與完整URL，下拉選單顯示頁面編號)、進度連結。區分按鈕暫停(不關Modal)與遮罩暫停(關Modal)行為，調整下拉選單邊距。控制區動態定位。齒盤 global hotkey（燒齒）。
// @author       Aiuanyu 愛灣語 + Gemini
// @match        http*://sutian.moe.edu.tw/*
// @match        http*://sutian.moe.edu.tw/und-hani/tshiau/*
// @match        http*://sutian.moe.edu.tw/und-hani/hunlui/*
// @match        http*://sutian.moe.edu.tw/und-hani/siannuntiau/*
// @match        http*://sutian.moe.edu.tw/und-hani/poosiu/poosiu/*/*
// @match        http*://sutian.moe.edu.tw/und-hani/tsongpitueh/*
// @match        http*://sutian.moe.edu.tw/und-hani/huliok/*
// @match        http*://sutian.moe.edu.tw/zh-hant/tshiau/*
// @match        http*://sutian.moe.edu.tw/zh-hant/hunlui/*
// @match        http*://sutian.moe.edu.tw/zh-hant/siannuntiau/*
// @match        http*://sutian.moe.edu.tw/zh-hant/poosiu/poosiu/*/*
// @match        http*://sutian.moe.edu.tw/zh-hant/tsongpitueh/*
// @match        http*://sutian.moe.edu.tw/zh-hant/huliok/*
// @exclude      http*://sutian.moe.edu.tw/und-hani/tsongpitueh/
// @exclude      http*://sutian.moe.edu.tw/und-hani/tsongpitueh/?ueh=*
// @exclude      http*://sutian.moe.edu.tw/zh-hant/tsongpitueh/
// @exclude      http*://sutian.moe.edu.tw/zh-hant/tsongpitueh/?ueh=*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      sutian.moe.edu.tw
// @run-at       document-idle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/531767/KIPSutian-autoplay.user.js
// @updateURL https://update.greasyfork.org/scripts/531767/KIPSutian-autoplay.meta.js
// ==/UserScript==

(function () {
  ('use strict');

  // --- 修改：更精確地檢查是否為腳本自身創建的 iframe ---
  try {
    // 只有當：1. 我們在 iframe 中 (window.top !== window.self)
    //         且 2. 這個 iframe 和頂層視窗是同一個來源 (origin)
    //         才判斷為腳本自身創建的 iframe，並退出執行。
    if (
      window.top !== window.self &&
      window.top.location.origin === window.self.location.origin
    ) {
      console.log(
        '[KIPSutian-autoplay] 偵測著是佇仝一个 domain 內底的 iframe (可能是跤本家己開的)，莫佇遮執行。Detected running inside a same-origin iframe, likely created by the script. Exiting.'
      );
      return; // 提前終止腳本在同源 iframe 中的執行
    }
    // 若是頂層視窗，或是在不同來源的 iframe 中 (例如整個 sutian 被外部嵌入)，則繼續執行腳本。
    console.log(
      '[KIPSutian-autoplay] 是佇頂層窗仔／無仝源 iframe 咧行，著繼續。Running in top-level window or cross-origin iframe. Proceeding.'
    );
  } catch (e) {
    // 如果嘗試存取 window.top.location.origin 時發生錯誤 (通常是因為跨來源安全性限制)，
    // 這也表示我們正處於一個被不同來源嵌入的 iframe 中。
    // 在這種情況下，我們也希望腳本繼續執行。
    console.log(
      '[KIPSutian-autoplay] 偵測著無仝源 iframe 環境（提袂著），著繼續。Detected cross-origin iframe context (access error). Proceeding.'
    );
    // 不執行 return，腳本會繼續往下跑
  }
  // --- 檢查結束 ---

  // --- 配置 ---
  const MODAL_WIDTH = '80vw';
  const MODAL_HEIGHT = '70vh';
  const FALLBACK_DELAY_MS = 3000;
  const DELAY_BUFFER_MS = 500;
  const DELAY_BETWEEN_CLICKS_MS = 200; // iframe 內音檔間隔 (表格頁)
  const DELAY_BETWEEN_ITEMS_MS = 500; // 主頁面項目間隔 (表格/列表頁)
  const HIGHLIGHT_CLASS = 'userscript-audio-playing'; // iframe 內按鈕高亮 (表格頁)
  const ROW_HIGHLIGHT_CLASS_MAIN = 'userscript-row-highlight'; // 主頁面項目高亮 (表格/列表頁)
  const ROW_PAUSED_HIGHLIGHT_CLASS = 'userscript-row-paused-highlight'; // 主頁面項目暫停高亮 (表格/列表頁)
  const OVERLAY_ID = 'userscript-modal-overlay'; // iframe 背景遮罩 (表格頁)
  const MOBILE_INTERACTION_BOX_ID = 'userscript-mobile-interaction-box';
  const MOBILE_BG_OVERLAY_ID = 'userscript-mobile-bg-overlay';
  const CONTROLS_CONTAINER_ID = 'auto-play-controls-container';
  const ROW_HIGHLIGHT_COLOR = 'rgba(0, 255, 0, 0.1)';
  const FONT_AWESOME_URL =
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css';
  const FONT_AWESOME_INTEGRITY =
    'sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==';
  const AUTOPLAY_PARAM = 'autoplay';
  const LOAD_PROGRESS_PARAM = 'load_progress'; // 載入進度參數 (值為 originalIndex)
  const PAGINATION_PARAMS = ['iahbe', 'pitsoo']; // 需要從 key 中移除的分頁參數
  const DEFAULT_PITSOO = 20; // 預設每頁筆數
  const AUTO_START_MAX_WAIT_MS = 10000;
  const AUTO_START_CHECK_INTERVAL_MS = 500;
  const CONTAINER_SELECTOR =
    'main.container-fluid div.mt-1.mb-5, main.container-fluid div.mt-1.mb-4, main.container-fluid div.mb-5, main.container-fluid div.mt-1';
  const ALL_TABLES_SELECTOR = CONTAINER_SELECTOR.split(',')
    .map((s) => `${s.trim()} > table`)
    .join(', ');
  const LIST_CONTAINER_SELECTOR = CONTAINER_SELECTOR.split(',')
    .map((s) => `${s.trim()} > ol`)
    .join(', '); // 列表容器選擇器
  const LIST_ITEM_SELECTOR = 'li.list-pos-in'; // 列表項目選擇器
  const RELEVANT_ROW_MARKER_SELECTOR = 'td:first-of-type span.fw-normal'; // 表格頁用
  const WIDE_TABLE_SELECTOR = 'table.d-none.d-md-table';
  const NARROW_TABLE_SELECTOR = 'table.d-md-none';
  const RESIZE_DEBOUNCE_MS = 300;
  const AUDIO_INDICATOR_SELECTOR = 'button.imtong-liua'; // 通用音檔按鈕選擇器
  const MOBILE_BOX_BG_COLOR = '#aa96b7'; /* ImazinGrace 紫 */
  const MOBILE_BOX_TEXT_COLOR = '#d9e2a9'; /* ImazinGrace 綠 */
  const MOBILE_BOX_BG_COLOR_DARK = '#4a4a8a';
  const MOBILE_BOX_TEXT_COLOR_DARK = '#EEEEEE';
  const MOBILE_BG_OVERLAY_COLOR = 'rgba(0, 0, 0, 0.6)';
  const LOCAL_STORAGE_KEY = 'KIP_AUTOPLAY_PROGRESS'; // localStorage 鍵名
  const MAX_PROGRESS_ENTRIES = 10; // 最大儲存筆數
  const PROGRESS_DROPDOWN_ID = 'userscript-progress-dropdown'; // 下拉選單 ID

  // --- 適應亮暗模式的高亮樣式 ---
  const CSS_IFRAME_HIGHLIGHT = `
        .${HIGHLIGHT_CLASS} {
            background-color: #FFF352 !important;
            color: black !important;
            outline: 2px solid #FFB800 !important;
            box-shadow: 0 0 10px #FFF352;
            transition: all 0.2s ease-in-out;
        }
        @media (prefers-color-scheme: dark) {
            .${HIGHLIGHT_CLASS} {
                background-color: #66b3ff !important;
                color: black !important;
                outline: 2px solid #87CEFA !important;
                box-shadow: 0 0 10px #66b3ff;
            }
        }
  `;
  const CSS_PAUSE_HIGHLIGHT = `
        @keyframes userscriptPulseHighlight {
            0% { background-color: rgba(255, 193, 7, 0.2); }
            50% { background-color: rgba(255, 193, 7, 0.4); }
            100% { background-color: rgba(255, 193, 7, 0.2); }
        }
        @media (prefers-color-scheme: dark) {
            @keyframes userscriptPulseHighlight {
                0% { background-color: rgba(102, 179, 255, 0.3); }
                50% { background-color: rgba(102, 179, 255, 0.6); }
                100% { background-color: rgba(102, 179, 255, 0.3); }
            }
        }
        .${ROW_PAUSED_HIGHLIGHT_CLASS} {
            animation: userscriptPulseHighlight 1.5s ease-in-out infinite; /* 使用者修改 */
        }
  `;
  const CSS_MOBILE_OVERLAY = `
        #${MOBILE_BG_OVERLAY_ID} {
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background-color: ${MOBILE_BG_OVERLAY_COLOR}; z-index: 10004; cursor: pointer;
        }
        #${MOBILE_INTERACTION_BOX_ID} {
            position: fixed; background-color: ${MOBILE_BOX_BG_COLOR}; color: ${MOBILE_BOX_TEXT_COLOR};
            display: flex; justify-content: center; align-items: center;
            font-size: 7vw; font-weight: bold; text-align: center; z-index: 10005;
            cursor: pointer; padding: 20px; box-sizing: border-box; border-radius: 8px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3);
        }
        /* --- 新增：使用媒體查詢調整寬螢幕字體大小 --- */
        @media (min-width: 768px) { /* 768px 是一個常用的斷點，您可以調整 */
            #${MOBILE_INTERACTION_BOX_ID} {
                font-size: 5vw;
            }
        }
        @media (prefers-color-scheme: dark) {
            #${MOBILE_INTERACTION_BOX_ID} {
                background-color: ${MOBILE_BOX_BG_COLOR_DARK}; color: ${MOBILE_BOX_TEXT_COLOR_DARK};
            }
        }
  `;
  const CSS_CONTROLS_BUTTONS = `
        #${CONTROLS_CONTAINER_ID} button:disabled {
            opacity: 0.65; cursor: not-allowed;
        }
        #auto-play-pause-button:hover:not(:disabled) {
            background-color: #e0a800 !important;
        }
        #auto-play-stop-button:hover:not(:disabled) {
            background-color: #c82333 !important;
        }
        #${PROGRESS_DROPDOWN_ID} {
            /* ** 修改：調整 margin ** */
            margin: 5px;
            padding: 4px 8px; font-size: 12px;
            vertical-align: middle; border-radius: 4px; border: 1px solid #ccc;
            background-color: white; color: black; cursor: pointer; width: 7em;
        }
        @media (prefers-color-scheme: dark) {
            #${PROGRESS_DROPDOWN_ID} {
                background-color: #333; color: white; border: 1px solid #555;
            }
        }
  `;
  // --- 配置結束 ---

  // --- 全局狀態變數 ---
  let isProcessing = false;
  let isPaused = false;
  let currentItemIndex = 0; // 當前在 itemsToProcess 中的索引
  let totalItems = 0; // itemsToProcess 的總數
  let currentSleepController = null;
  let currentIframe = null;
  let itemsToProcess = []; // 當前頁面過濾後待處理的項目列表 { element?, audioButton?, url?, anchorElement?, originalIndex }
  let resizeDebounceTimeout = null;
  let lastHighlightTargets = { wide: null, narrow: null, list: null };
  let isMobile = false;
  let isDesktopChromiumBased = false; // 新增：是否為桌面 Chrome 系瀏覽器
  let isInternalAutoNext = false; // 新增：是否為腳本內部自動跳頁觸發
  let isListPage = false;
  let progressDropdown = null; // 下拉選單引用

  // --- UI 元素引用 ---
  let breakBeforePauseButton = null;
  let pauseButton = null;
  let stopButton = null;
  let breakBeforeStatusDisplay = null;
  let statusDisplay = null;
  let overlayElement = null;

  // --- Helper 函數 ---

  function interruptibleSleep(ms) {
    if (currentSleepController) {
      currentSleepController.cancel('overridden');
    }
    let timeoutId;
    let rejectFn;
    let resolved = false;
    let rejected = false;
    const promise = new Promise((resolve, reject) => {
      rejectFn = reject;
      timeoutId = setTimeout(() => {
        if (!rejected) {
          resolved = true;
          currentSleepController = null;
          resolve();
        }
      }, ms);
    });
    const controller = {
      promise: promise,
      cancel: (reason = 'cancelled') => {
        if (!resolved && !rejected) {
          rejected = true;
          clearTimeout(timeoutId);
          currentSleepController = null;
          const error = new Error(reason);
          error.isCancellation = true;
          error.reason = reason;
          rejectFn(error);
        }
      },
    };
    currentSleepController = controller;
    return controller;
  }

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function getAudioDuration(audioButton) {
    let audioUrl = null;
    if (audioButton && audioButton.dataset.src) {
      const srcString = audioButton.dataset.src;
      let audioPath = null;
      try {
        const d = JSON.parse(srcString.replace(/&quot;/g, '"'));
        if (Array.isArray(d) && d.length > 0 && typeof d[0] === 'string') {
          audioPath = d[0];
        }
      } catch (e) {
        if (typeof srcString === 'string' && srcString.trim().startsWith('/')) {
          audioPath = srcString.trim();
        }
      }
      if (audioPath) {
        try {
          audioUrl = new URL(audioPath, window.location.href).href;
        } catch (urlError) {
          console.error(
            `[自動播放] 解析音檔路徑時出錯 (${audioPath}):`,
            urlError
          );
          audioUrl = null;
        }
      }
    }
    console.log(`[自動播放] 嘗試獲取音檔時長: ${audioUrl || '未知 URL'}`);
    return new Promise((resolve) => {
      if (!audioUrl) {
        console.warn('[自動播放] 無法確定有效的音檔 URL，使用後備延遲。');
        resolve(FALLBACK_DELAY_MS);
        return;
      }
      const audio = new Audio();
      audio.preload = 'metadata';
      const timer = setTimeout(() => {
        console.warn(
          `[自動播放] 獲取音檔 ${audioUrl} 元數據超時 (5秒)，使用後備延遲。`
        );
        cleanupAudio();
        resolve(FALLBACK_DELAY_MS);
      }, 5000);
      const cleanupAudio = () => {
        clearTimeout(timer);
        audio.removeEventListener('loadedmetadata', onLoadedMetadata);
        audio.removeEventListener('error', onError);
        audio.src = '';
      };
      const onLoadedMetadata = () => {
        if (audio.duration && isFinite(audio.duration)) {
          const durationMs = Math.ceil(audio.duration * 1000) + DELAY_BUFFER_MS;
          console.log(
            `[自動播放] 獲取到音檔時長: ${audio.duration.toFixed(
              2
            )}s, 使用延遲: ${durationMs}ms`
          );
          cleanupAudio();
          resolve(durationMs);
        } else {
          console.warn(
            `[自動播放] 無法從元數據獲取有效時長 (${audio.duration})，使用後備延遲。`
          );
          cleanupAudio();
          resolve(FALLBACK_DELAY_MS);
        }
      };
      const onError = (e) => {
        console.error(`[自動播放] 加載音檔 ${audioUrl} 元數據時出錯:`, e);
        cleanupAudio();
        resolve(FALLBACK_DELAY_MS);
      };
      audio.addEventListener('loadedmetadata', onLoadedMetadata);
      audio.addEventListener('error', onError);
      try {
        audio.src = audioUrl;
      } catch (e) {
        console.error(`[自動播放] 設置音檔 src 時發生錯誤 (${audioUrl}):`, e);
        cleanupAudio();
        resolve(FALLBACK_DELAY_MS);
      }
    });
  }

  function isElementVisible(element) {
    if (!element || !document.body.contains(element)) {
      return false;
    }
    const rect = element.getBoundingClientRect();
    const visible =
      element.offsetParent !== null && rect.width > 0 && rect.height > 0;
    return visible;
  }

  // --- 進度儲存/讀取相關函數 ---

  function getProgressKey(urlString) {
    try {
      const url = new URL(urlString);
      const paramsToRemove = [
        ...PAGINATION_PARAMS,
        AUTOPLAY_PARAM,
        LOAD_PROGRESS_PARAM,
      ];
      paramsToRemove.forEach((param) => url.searchParams.delete(param));
      const search = url.search.length > 1 ? url.search : '';
      return url.pathname + search;
    } catch (e) {
      console.error('[自動播放][進度] 無法解析 URL:', urlString, e);
      try {
        const tempUrl = new URL(urlString);
        return tempUrl.pathname;
      } catch {
        return urlString;
      }
    }
  }

  function cleanTitle(title) {
    if (!title) {
      return '未知頁面';
    }
    return title.replace(/ ?- ?教育部臺灣(?:臺|台)語常用詞辭典/, '').trim();
  }

  function loadProgress() {
    try {
      const storedProgress = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedProgress) {
        const progressData = JSON.parse(storedProgress);
        if (Array.isArray(progressData)) {
          progressData.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
          return progressData;
        }
      }
    } catch (e) {
      console.error('[自動播放][進度] 載入進度時發生錯誤:', e);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    }
    return [];
  }

  /**
   * **修改：獲取頁面上顯示的絕對編號**
   */
  function getDisplayedNumber(originalIndex) {
    if (originalIndex < 0) {
      return null;
    }

    if (isListPage) {
      // ** 列表頁：計算絕對編號 **
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const iahbe = parseInt(urlParams.get('iahbe') || '1', 10); // 當前頁碼，預設 1
        const pitsooStr = urlParams.get('pitsoo');
        let pitsoo = DEFAULT_PITSOO; // 預設每頁筆數
        if (pitsooStr) {
          const parsedPitsoo = parseInt(pitsooStr, 10);
          if (!isNaN(parsedPitsoo) && parsedPitsoo > 0) {
            pitsoo = parsedPitsoo;
          } else {
            console.warn(
              `[自動播放][進度] URL 中的 pitsoo 參數無效 (${pitsooStr})，使用預設值 ${DEFAULT_PITSOO}`
            );
          }
        } else {
          // ** 修改：如果 URL 沒 pitsoo，不再警告，直接用預設值 **
          // console.warn(`[自動播放][進度] URL 中缺少 pitsoo 參數，使用預設值 ${DEFAULT_PITSOO}`);
        }

        if (isNaN(iahbe) || iahbe < 1) {
          console.warn(
            `[自動播放][進度] URL 中的 iahbe 參數無效 (${urlParams.get(
              'iahbe'
            )})，假設為 1`
          );
          iahbe = 1;
        }

        const absoluteNumber = (iahbe - 1) * pitsoo + originalIndex + 1;
        console.log(
          `[自動播放][進度][列表] 計算編號: (iahbe:${iahbe} - 1) * pitsoo:${pitsoo} + originalIndex:${originalIndex} + 1 = ${absoluteNumber}`
        );
        return absoluteNumber;
      } catch (e) {
        console.error('[自動播放][進度][列表] 計算絕對編號時出錯:', e);
        return originalIndex + 1; // 出錯時回退到頁內索引+1
      }
    } else {
      // ** 表格頁：查找 span.fw-normal **
      const rowPlayButton = document.querySelector(
        `.userscript-row-play-button[data-row-index="${originalIndex}"]`
      );
      if (rowPlayButton) {
        const rowElement = rowPlayButton.closest('tr');
        if (rowElement) {
          const firstTd = rowElement.querySelector('td:first-of-type');
          if (firstTd) {
            const numberSpan = firstTd.querySelector('span.fw-normal');
            if (numberSpan && numberSpan.textContent) {
              const numText = numberSpan.textContent.trim();
              const num = parseInt(numText, 10);
              console.log(`[自動播放][進度][表格] 找到編號 span: ${numText}`);
              return isNaN(num) ? numText : num;
            } else {
              console.warn(
                `[自動播放][進度][表格] 在索引 ${originalIndex} 的第一個 td 中找不到 span.fw-normal`
              );
            }
          } else {
            console.warn(
              `[自動播放][進度][表格] 在索引 ${originalIndex} 找不到第一個 td`
            );
          }
        } else {
          console.warn(
            `[自動播放][進度][表格] 在索引 ${originalIndex} 找不到父層 tr`
          );
        }
      } else {
        console.warn(
          `[自動播放][進度][表格] 找不到索引 ${originalIndex} 的播放按鈕`
        );
      }
      return null; // 找不到則返回 null
    }
  }

  /**
   * 儲存當前播放進度 (包含顯示編號)
   */
  function saveCurrentProgress() {
    console.log(
      `[自動播放][進度][除錯] saveCurrentProgress called. isProcessing=${isProcessing}, isPaused=${isPaused}, itemsToProcess.length=${itemsToProcess.length}, currentItemIndex=${currentItemIndex}`
    );

    if (itemsToProcess.length === 0 && !(isPaused && currentItemIndex === 0)) {
      console.log(
        '[自動播放][進度] itemsToProcess 為空或狀態不符，不儲存進度。'
      );
      return;
    }

    let nextOriginalIndex = -1;
    if (currentItemIndex < totalItems && itemsToProcess[currentItemIndex]) {
      nextOriginalIndex = itemsToProcess[currentItemIndex].originalIndex;
    } else if (currentItemIndex === totalItems && totalItems > 0) {
      console.log('[自動播放][進度] 已處理完畢，儲存完成狀態 (-1)。');
      nextOriginalIndex = -1;
    } else if (currentItemIndex === 0 && isPaused && itemsToProcess[0]) {
      nextOriginalIndex = itemsToProcess[0].originalIndex;
      console.log('[自動播放][進度] 在第一個項目暫停，儲存該項目索引。');
    } else {
      console.warn(
        '[自動播放][進度] 索引無效，不儲存進度:',
        currentItemIndex,
        totalItems
      );
      return;
    }

    const displayedNumber = getDisplayedNumber(nextOriginalIndex);
    const currentFullUrl = window.location.href;
    const progressKey = getProgressKey(currentFullUrl);
    const pageTitle = cleanTitle(document.title);
    const timestamp = Date.now();

    console.log(
      `[自動播放][進度] 準備儲存進度: Key=${progressKey}, Title=${pageTitle}, nextOriginalIndex=${nextOriginalIndex}, DisplayNo=${displayedNumber}, FullURL=${currentFullUrl}`
    );

    let allProgress = loadProgress();
    const existingIndex = allProgress.findIndex((p) => p.key === progressKey);

    const newEntry = {
      key: progressKey,
      title: pageTitle,
      nextIndex: nextOriginalIndex,
      displayNumber: displayedNumber,
      timestamp: timestamp,
      url: currentFullUrl,
    };

    if (existingIndex > -1) {
      allProgress[existingIndex] = newEntry;
      console.log('[自動播放][進度] 更新現有記錄:', progressKey);
    } else {
      allProgress.unshift(newEntry);
      console.log('[自動播放][進度] 新增記錄:', progressKey);
    }

    allProgress.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    if (allProgress.length > MAX_PROGRESS_ENTRIES) {
      allProgress = allProgress.slice(0, MAX_PROGRESS_ENTRIES);
    }

    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(allProgress));
      console.log(`[自動播放][進度] 已儲存 ${allProgress.length} 筆進度。`);
      populateProgressDropdown();
    } catch (e) {
      console.error('[自動播放][進度] 儲存進度時發生錯誤:', e);
    }
  }

  // --- iframe 相關函數 (僅表格頁使用) ---
  // ... (略) ...
  function addStyleToIframe(iframeDoc, css) {
    try {
      const styleElement = iframeDoc.createElement('style');
      styleElement.textContent = css;
      iframeDoc.head.appendChild(styleElement);
      console.log('[自動播放][表格頁] 已在 iframe 中添加高亮樣式。');
    } catch (e) {
      console.error('[自動播放][表格頁] 無法在 iframe 中添加樣式:', e);
    }
  }

  /**
   * 處理遮罩點擊事件：
   * - 播放中點擊：暫停並關閉 Modal (表格頁)
   * - 暫停中點擊：僅關閉 Modal (表格頁)
   */
  function handleOverlayClick(event) {
    // 確保點擊的是遮罩本身，而不是 Modal 內部
    if (event.target !== overlayElement) {
      return;
    }

    if (isProcessing && !isPaused) {
      // --- 原本的邏輯：播放中點擊 ---
      console.log(
        '[自動播放][表格頁] 點擊背景遮罩 (播放中)，觸發暫停並關閉 Modal。'
      );
      pausePlayback(); // 設為暫停狀態

      // 只有表格頁需要關閉 Modal
      if (!isListPage) {
        closeModal();
      }
    } else if (isProcessing && isPaused) {
      // --- 新增的邏輯：暫停中點擊 ---
      console.log('[自動播放][表格頁] 點擊背景遮罩 (已暫停)，僅關閉 Modal。');

      // 只有表格頁需要關閉 Modal
      if (!isListPage) {
        closeModal(); // 直接關閉 Modal，不改變 isPaused 狀態
      }
    }
    // 如果 isProcessing 為 false (已停止)，點擊遮罩不做任何事
  }

  function showModal(iframe) {
    overlayElement = document.getElementById(OVERLAY_ID);
    if (!overlayElement) {
      overlayElement = document.createElement('div');
      overlayElement.id = OVERLAY_ID;
      Object.assign(overlayElement.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        backgroundColor: MOBILE_BG_OVERLAY_COLOR,
        zIndex: '9998',
        cursor: 'pointer',
      });
      document.body.appendChild(overlayElement);
    }
    overlayElement.removeEventListener('click', handleOverlayClick);
    overlayElement.addEventListener('click', handleOverlayClick);
    Object.assign(iframe.style, {
      position: 'fixed',
      width: MODAL_WIDTH,
      height: MODAL_HEIGHT,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      border: '1px solid #ccc',
      borderRadius: '8px',
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.3)',
      backgroundColor: 'white',
      zIndex: '9999',
      opacity: '1',
      pointerEvents: 'auto',
    });
    document.body.appendChild(iframe);
    currentIframe = iframe;
    console.log(
      `[自動播放][表格頁] 已顯示 Modal iframe, id: ${currentIframe.id}`
    );
  }
  function closeModal() {
    console.log('[自動播放] closeModal called.');
    // *** 新增：在設為 null 前，先從 DOM 移除 iframe ***
    if (currentIframe && currentIframe.parentNode) {
      console.log(`[自動播放] Removing iframe ${currentIframe.id} from DOM.`);
      currentIframe.parentNode.removeChild(currentIframe);
    }
    // *** 修改結束 ***
    currentIframe = null; // 在移除後才設為 null
    if (overlayElement) {
      overlayElement.removeEventListener('click', handleOverlayClick);
      if (overlayElement.parentNode) {
        overlayElement.remove();
      }
      overlayElement = null;
    }
    // --- 恢復這段邏輯 ---
    if (currentSleepController && !isListPage) {
      // 當 Modal 關閉時，也取消可能正在進行的 iframe 內部延遲
      // (例如 handleIframeContent 中的音檔間隔或播放等待)
      console.log(
        '[自動播放][closeModal] 偵測到關閉 Modal，取消當前的 sleep controller。'
      );
      currentSleepController.cancel('modal_closed');
      currentSleepController = null; // 清理引用
    }
    // --- 修改結束 ---
  }
  async function handleIframeContent(iframe, url) {
    // *** 新增：防止 handleIframeContent 重複執行 ***
    if (iframe._processingStarted) {
      console.warn(
        `[自動播放][表格頁] handleIframeContent for ${iframe.id} 被重複呼叫，已忽略。 URL: ${url}`
      );
      return; // 如果已經開始處理，直接返回
    }
    iframe._processingStarted = true; // 標記為已開始處理
    // *** 修改結束 ***

    let iframeDoc;
    try {
      await sleep(150); // 等待 iframe 內容可能存在的延遲載入
      iframeDoc = iframe.contentWindow.document;
      addStyleToIframe(iframeDoc, CSS_IFRAME_HIGHLIGHT);
      const audioButtons = iframeDoc.querySelectorAll(AUDIO_INDICATOR_SELECTOR);
      console.log(
        `[自動播放][表格頁] 在 iframe (${iframe.id}) 中找到 ${audioButtons.length} 個播放按鈕`
      );
      if (audioButtons.length > 0) {
        for (let i = 0; i < audioButtons.length; i++) {
          if (!isProcessing) {
            console.log('[自動播放][表格頁] 播放音檔前檢測到停止');
            break;
          }
          while (isPaused && isProcessing) {
            await sleep(500);
            if (!isProcessing) break;
          }
          // --- 移除這段可能導致問題的檢查 ---
          // if (!isProcessing || isPaused) {
          //   i--;
          //   continue;
          // }
          // --- 修改結束 ---
          const button = audioButtons[i];
          if (!button || !iframeDoc.body.contains(button)) {
            console.warn(`[自動播放][表格頁] 按鈕 ${i + 1} 失效，跳過。`);
            continue;
          }
          console.log(
            `[自動播放][表格頁] 準備播放 iframe 中的第 ${i + 1} 個音檔`
          );
          let actualDelayMs = await getAudioDuration(button);
          let scrollTargetElement = button;
          const flexContainer = button.closest(
              'div.d-flex.flex-row.align-items-baseline'
            ),
            fs6Container = button.closest('div.mb-0.fs-6');
          if (flexContainer) {
            const h = iframeDoc.querySelector('h1#main');
            if (h) scrollTargetElement = h;
          } else if (fs6Container) {
            const p = fs6Container.previousElementSibling;
            if (p && p.matches('span.mb-0')) scrollTargetElement = p;
          }
          if (
            scrollTargetElement &&
            iframeDoc.body.contains(scrollTargetElement)
          ) {
            scrollTargetElement.scrollIntoView({
              behavior: 'smooth',
              block: 'center',
            });
          }
          await sleep(300);
          button.classList.add(HIGHLIGHT_CLASS);
          button.click();
          console.log(
            `[自動播放][表格頁] 已點擊按鈕 ${i + 1}，等待 ${actualDelayMs}ms`
          );
          try {
            await interruptibleSleep(actualDelayMs).promise;
          } catch (error) {
            if (error.isCancellation) {
              // --- MODIFICATION: Reset _processingStarted if paused/stopped/row_clicked ---
              if (error.reason === 'paused' || error.reason === 'stopped' || error.reason === 'row_clicked_interrupt') {
                iframe._processingStarted = false;
                console.log(`[自動播放][表格頁] 音檔播放等待被 '${error.reason}' 中斷，重設 _processingStarted 予 ${iframe.id}`);
              }
              if (iframeDoc.body.contains(button)) {
                button.classList.remove(HIGHLIGHT_CLASS);
              }
              break; // Break from audio button loop
            } else {
              throw error;
            }
          } finally {
            currentSleepController = null;
          }
          if (iframeDoc.body.contains(button)) {
            button.classList.remove(HIGHLIGHT_CLASS);
          }
          if (!isProcessing) break;
          if (i < audioButtons.length - 1) {
            try {
              await interruptibleSleep(DELAY_BETWEEN_CLICKS_MS).promise;
            } catch (error) {
              if (error.isCancellation) {
                // --- MODIFICATION: Reset _processingStarted if paused/stopped/row_clicked ---
                if (error.reason === 'paused' || error.reason === 'stopped' || error.reason === 'row_clicked_interrupt') {
                  iframe._processingStarted = false;
                  console.log(`[自動播放][表格頁] 音檔間等待被 '${error.reason}' 中斷，重設 _processingStarted 予 ${iframe.id}`);
                }
                break; // Break from audio button loop
              } else { throw error; }
            } finally {
              currentSleepController = null;
            }
          }
          if (!isProcessing) break;
        }
      } else {
        console.log(`[自動播放][表格頁] Iframe ${url} 中未找到播放按鈕`);
        await sleep(1000);
      }
    } catch (error) {
      console.error(
        `[自動播放][表格頁] 處理 iframe 內容時出錯 (${url}):`,
        error
      );
    } finally {
      // 移除這段，因為 interruptibleSleep 內部會處理 currentSleepController = null
      // 而且外部的取消操作 (pause/stop/row_click) 也會處理取消。
      /*
      if (currentSleepController) {
        currentSleepController.cancel('content_handled_exit');
        currentSleepController = null;
      }
      */
      console.log(`[自動播放][表格頁] handleIframeContent 執行完畢 (${url})`);
    }
  }

  // --- 表格頁專用函數 ---

  async function processSingleLink(url) {
    console.log(
      `[自動播放][表格頁] processSingleLink 開始 - ${url}. isProcessing: ${isProcessing}, isPaused: ${isPaused}`
    );
    const iframeId = `auto-play-iframe-${Date.now()}`;
    let iframe = document.createElement('iframe');
    iframe.id = iframeId;
    return new Promise(async (resolve) => {
      if (!isProcessing) {
        resolve();
        return;
      }
      let isUsingExistingIframe = false;
      if (
        currentIframe &&
        currentIframe.contentWindow &&
        currentIframe.contentWindow.location.href === url
      ) {
        iframe = currentIframe;
        isUsingExistingIframe = true;
      } else {
        if (currentIframe) {
          closeModal();
          await sleep(50);
          if (!isProcessing) {
            resolve();
            return;
          }
        }
        showModal(iframe);
      }
      if (isUsingExistingIframe) {
        await handleIframeContent(iframe, url);
        resolve();
      } else {
        iframe.onload = async () => {
          if (!isProcessing) {
            closeModal();
            resolve();
            return;
          }
          if (currentIframe !== iframe) {
            resolve();
            return;
          }
          await handleIframeContent(iframe, url);
          resolve();
        };
        iframe.onerror = (error) => {
          console.error(`[自動播放][表格頁] Iframe 載入失敗 (${url}):`, error);
          closeModal();
          resolve();
        };
        iframe.src = url;
      }
    });
  }

  // --- 查找元素相關 ---

  function findHighlightTargetsForItem(item) {
    let targets = { wide: null, narrow: null, list: null };
    if (isListPage) {
      if (item && item.element) {
        targets.list = item.element;
      }
    } else {
      if (item && item.url) {
        const targetUrl = item.url;
        const linkSelector = getLinkSelector();
        const allTables = document.querySelectorAll(ALL_TABLES_SELECTOR);
        let foundWide = false;
        let foundNarrow = false;
        for (const table of allTables) {
          const isWideTable = table.matches(WIDE_TABLE_SELECTOR);
          const isNarrowTable = table.matches(NARROW_TABLE_SELECTOR);
          const rows = table.querySelectorAll('tbody tr');
          if (isWideTable && !foundWide) {
            for (const row of rows) {
              const firstTd = row.querySelector('td:first-of-type');
              if (
                firstTd &&
                firstTd.querySelector(RELEVANT_ROW_MARKER_SELECTOR)
              ) {
                const linkElement = row.querySelector(linkSelector);
                if (linkElement) {
                  try {
                    const linkHref = new URL(
                      linkElement.getAttribute('href'),
                      window.location.origin
                    ).href;
                    if (linkHref === targetUrl) {
                      targets.wide = row;
                      foundWide = true;
                      break;
                    }
                  } catch (e) {
                    console.error(
                      `[自動播放][查找目標][寬] 處理連結 URL 時出錯:`,
                      e,
                      linkElement
                    );
                  }
                }
              }
            }
          } else if (isNarrowTable && !foundNarrow) {
            if (rows.length >= 2) {
              const firstRowTd = rows[0].querySelector('td:first-of-type');
              const secondRowTd = rows[1].querySelector('td:first-of-type');
              if (
                firstRowTd &&
                firstRowTd.querySelector(RELEVANT_ROW_MARKER_SELECTOR) &&
                secondRowTd
              ) {
                const linkElement = secondRowTd.querySelector(linkSelector);
                if (linkElement) {
                  try {
                    const linkHref = new URL(
                      linkElement.getAttribute('href'),
                      window.location.origin
                    ).href;
                    if (linkHref === targetUrl) {
                      targets.narrow = rows[0];
                      foundNarrow = true;
                    }
                  } catch (e) {
                    console.error(
                      `[自動播放][查找目標][窄] 處理連結 URL 時出錯:`,
                      e,
                      linkElement
                    );
                  }
                }
              }
            }
          }
          if (foundWide && foundNarrow) break;
        }
        if (!targets.wide && !targets.narrow) {
          console.warn(
            `[自動播放][查找目標] 未能找到 URL 對應的寬或窄表格元素: ${targetUrl}`
          );
        } else {
          console.log(
            `[自動播放][查找目標] 找到高亮目標: wide=${!!targets.wide}, narrow=${!!targets.narrow}`
          );
        }
      }
    }
    return targets;
  }
  function applyAndPersistHighlight(currentTargets) {
    const elementsToClear = [
      lastHighlightTargets.wide,
      lastHighlightTargets.narrow,
      lastHighlightTargets.list,
    ];
    elementsToClear.forEach((el) => {
      if (
        el &&
        el !== currentTargets.wide &&
        el !== currentTargets.narrow &&
        el !== currentTargets.list
      ) {
        el.classList.remove(
          ROW_HIGHLIGHT_CLASS_MAIN,
          ROW_PAUSED_HIGHLIGHT_CLASS
        );
        el.style.backgroundColor = '';
        el.style.transition = '';
        el.style.animation = '';
        console.log('[自動播放][高亮] 移除上一個高亮:', el);
      }
    });
    const elementsToHighlight = [
      currentTargets.wide,
      currentTargets.narrow,
      currentTargets.list,
    ];
    elementsToHighlight.forEach((el) => {
      if (el) {
        el.classList.remove(ROW_PAUSED_HIGHLIGHT_CLASS);
        el.style.animation = '';
        el.classList.add(ROW_HIGHLIGHT_CLASS_MAIN);
        el.style.backgroundColor = ROW_HIGHLIGHT_COLOR;
        el.style.transition = 'background-color 0.5s ease-out';
        console.log('[自動播放][高亮] 應用持續主高亮:', el);
      }
    });
    lastHighlightTargets = {
      wide: currentTargets.wide || null,
      narrow: currentTargets.narrow || null,
      list: currentTargets.list || null,
    };
  }

  // --- 核心處理邏輯 ---

  async function processItemsSequentially() {
    console.log('[自動播放] processItemsSequentially 開始');
    let hasLoggedPauseMessage = false; // <--- 新增標記

    while (currentItemIndex < totalItems && isProcessing) {
      while (isPaused && isProcessing) {
        // --- 修改：檢查標記 ---
        if (!hasLoggedPauseMessage) {
          console.log(
            `[自動播放] 主流程已暫停 (索引 ${currentItemIndex})，等待繼續...`
          );
          // *** 新增：在這裡呼叫一次 updateStatusDisplay ***
          updateStatusDisplay();
          // *** 新增結束 ***
          hasLoggedPauseMessage = true; // 設定標記
        }
        // --- 修改結束 ---
        // *** 移除：不再於迴圈內重複呼叫 updateStatusDisplay ***
        // updateStatusDisplay(); // <--- 刪除或註解掉這一行
        // *** 移除結束 ***
        await sleep(500);
        if (!isProcessing) break;
      }
      if (!isProcessing) break;

      // --- 新增：重設標記 ---
      if (isProcessing) {
        // 確保不是因為停止才跳出迴圈
        hasLoggedPauseMessage = false;
      }
      // --- 新增結束 ---

      // *** 保持：恢復播放後呼叫一次 updateStatusDisplay ***
      updateStatusDisplay();
      const currentItem = itemsToProcess[currentItemIndex];
      console.log(
        `[自動播放] 準備處理項目 ${
          currentItemIndex + 1
        }/${totalItems} (全局索引 ${currentItem.originalIndex})`
      );
      const currentTargets = findHighlightTargetsForItem(currentItem);
      let targetElementForScroll = null;
      try {
        if (currentTargets.list) {
          targetElementForScroll = currentTargets.list;
        } else if (
          currentTargets.wide &&
          isElementVisible(currentTargets.wide)
        ) {
          targetElementForScroll =
            currentTargets.wide.querySelector('td:first-of-type');
        } else if (
          currentTargets.narrow &&
          isElementVisible(currentTargets.narrow)
        ) {
          targetElementForScroll =
            currentTargets.narrow.querySelector('td:first-of-type');
        } else {
          const fallbackWideTarget = currentTargets.wide
            ? currentTargets.wide.querySelector('td:first-of-type')
            : null;
          const fallbackNarrowTarget = currentTargets.narrow
            ? currentTargets.narrow.querySelector('td:first-of-type')
            : null;
          targetElementForScroll =
            currentTargets.list || fallbackWideTarget || fallbackNarrowTarget;
          if (targetElementForScroll)
            console.warn(
              '[自動播放][捲動] 寬窄表格/列表皆不可見，使用後備捲動目標:',
              targetElementForScroll
            );
        }
      } catch (e) {
        console.error(
          '[自動播放][捲動] 檢查元素可見性或設置捲動目標時出錯:',
          e,
          currentTargets
        );
        const fallbackWideTarget = currentTargets.wide
          ? currentTargets.wide.querySelector('td:first-of-type')
          : null;
        const fallbackNarrowTarget = currentTargets.narrow
          ? currentTargets.narrow.querySelector('td:first-of-type')
          : null;
        targetElementForScroll =
          currentTargets.list || fallbackWideTarget || fallbackNarrowTarget;
      }
      console.log(`[自動播放][捲動] 決定捲動目標:`, targetElementForScroll);
      if (
        targetElementForScroll &&
        (currentTargets.wide || currentTargets.narrow || currentTargets.list)
      ) {
        if (document.body.contains(targetElementForScroll)) {
          targetElementForScroll.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
          await sleep(300);
        } else {
          console.warn(
            '[自動播放][捲動] 捲動目標不在 DOM 中:',
            targetElementForScroll
          );
        }
        applyAndPersistHighlight(currentTargets);
      } else {
        console.warn(
          `[自動播放][主頁捲動/高亮] 未能找到或確定項目 ${
            currentItem.originalIndex + 1
          } 的元素。跳過此項目。`
        );
        currentItemIndex++;
        continue;
      }
      await sleep(200);
      if (!isProcessing || isPaused) continue;
      if (isListPage) {
        const audioButton = currentItem.audioButton;
        if (audioButton && document.body.contains(audioButton)) {
          const actualDelayMs = await getAudioDuration(audioButton);
          console.log(
            `[自動播放][列表頁] 準備點擊音檔按鈕，等待 ${actualDelayMs}ms`
          );
          audioButton.click();
          try {
            await interruptibleSleep(actualDelayMs).promise;
          } catch (error) {
            if (error.isCancellation)
              console.log(
                `[自動播放][列表頁] 音檔播放等待被 '${error.reason}' 中斷。`
              );
            else throw error;
          } finally {
            currentSleepController = null;
          }
        } else {
          console.warn(
            `[自動播放][列表頁] 項目 ${
              currentItem.originalIndex + 1
            } 的音檔按鈕無效或不存在，跳過播放。`
          );
          await sleep(500);
        }
      } else {
        await processSingleLink(currentItem.url);
      }
      if (!isProcessing) break;
      if (!isListPage && !isPaused) {
        closeModal();
      }

      if (!isPaused) {
        // 只有在非暫停狀態下才增加索引
        currentItemIndex++;
        console.log(
          `[自動播放][進度] 項目處理完畢，索引遞增至 ${currentItemIndex}。`
        );

        // *** 在這裡儲存進度 ***
        // 因為 currentItemIndex 已經指向下一個項目，符合 saveCurrentProgress 的預期
        console.log(
          `[自動播放][進度] 儲存下一個項目 (${currentItemIndex}) 的進度。`
        );
        saveCurrentProgress(); // <--- 合併到這裡
      } else {
        // 如果是暫停狀態，索引保持不變
        console.log(
          `[自動播放][偵錯] 處於暫停狀態，索引保持在 ${currentItemIndex}。`
        );
        // 暫停時的儲存由 pausePlayback 函數處理，這裡不需要重複儲存
      }

      if (currentItemIndex < totalItems && isProcessing && !isPaused) {
        try {
          await interruptibleSleep(DELAY_BETWEEN_ITEMS_MS).promise;
        } catch (error) {
          if (error.isCancellation)
            console.log(`[自動播放] 項目間等待被 '${error.reason}' 中斷。`);
          else throw error;
        } finally {
          currentSleepController = null;
        }
      }
      if (!isProcessing) break;
    }
    console.log(
      `[自動播放][偵錯] processItemsSequentially 循環結束。 isProcessing: ${isProcessing}, isPaused: ${isPaused}`
    );
    if (isProcessing && !isPaused) {
      let foundNextPage = false;
      const paginationNav = document.querySelector(
        'nav[aria-label="頁碼"] ul.pagination'
      );
      if (paginationNav) {
        const nextPageLink = paginationNav.querySelector('li:last-child > a');
        if (
          nextPageLink &&
          (nextPageLink.textContent.includes('後一頁') ||
            nextPageLink.textContent.includes('下一頁')) &&
          !nextPageLink.closest('li.disabled')
        ) {
          const nextPageHref = nextPageLink.getAttribute('href');
          if (nextPageHref && nextPageHref !== '#') {
            try {
              const currentParams = new URLSearchParams(window.location.search);
              const nextPageUrlTemp = new URL(
                nextPageHref,
                window.location.origin
              );
              const nextPageParams = nextPageUrlTemp.searchParams;
              const finalParams = new URLSearchParams(currentParams.toString());
              PAGINATION_PARAMS.forEach((param) => {
                if (nextPageParams.has(param))
                  finalParams.set(param, nextPageParams.get(param));
              });
              finalParams.set(AUTOPLAY_PARAM, 'true');
              const finalNextPageUrl = `${
                window.location.pathname
              }?${finalParams.toString()}`;
              console.log(
                `[自動播放] 組合完成，準備跳轉至: ${finalNextPageUrl}`
              );
              foundNextPage = true;
              await sleep(1000);
              window.location.href = finalNextPageUrl;
            } catch (e) {
              console.error('[自動播放] 處理下一頁 URL 時出錯:', e);
            }
          }
        }
      }
      if (!foundNextPage) {
        alert('所有項目攏處理完畢！');
        resetTriggerButton();
      }
    } else {
      resetTriggerButton();
    }
  }

  // --- 控制按鈕事件處理 ---

  function getVisibleTables() {
    if (isListPage) return [];
    const allTables = document.querySelectorAll(ALL_TABLES_SELECTOR);
    return Array.from(allTables).filter((table) => {
      try {
        const style = window.getComputedStyle(table);
        return style.display !== 'none' && style.visibility !== 'hidden';
      } catch (e) {
        console.error('[自動播放] 檢查表格可見性時出錯:', e, table);
        return false;
      }
    });
  }
  function startPlayback(requestedOriginalIndex = 0) {
    console.log(
      `[自動播放] startPlayback 調用。 requestedOriginalIndex: ${requestedOriginalIndex}, isProcessing: ${isProcessing}, isPaused: ${isPaused}, isListPage: ${isListPage}`
    );
    if (isProcessing && !isPaused) {
      console.warn(
        '[自動播放][偵錯] 開始/繼續 按鈕被點擊，但 isProcessing 為 true 且 isPaused 為 false，不執行任何操作。'
      );
      return;
    }
    if (isProcessing && isPaused) {
      isPaused = false;
      pauseButton.textContent = '暫停';
      const elementsToResume = [
        lastHighlightTargets.wide,
        lastHighlightTargets.narrow,
        lastHighlightTargets.list,
      ];
      elementsToResume.forEach((el) => {
        if (el) {
          el.classList.remove(ROW_PAUSED_HIGHLIGHT_CLASS);
          el.style.animation = '';
          el.classList.add(ROW_HIGHLIGHT_CLASS_MAIN);
          el.style.backgroundColor = ROW_HIGHLIGHT_COLOR;
          console.log('[自動播放][高亮] 恢復播放，重新應用主高亮:', el);
        }
      });
      updateStatusDisplay();
      console.log('[自動播放] 從暫停狀態繼續。');
      return;
    }
    console.log(`[自動播放] 使用音檔指示符選擇器: ${AUDIO_INDICATOR_SELECTOR}`);
    const allItems = [];
    let globalRowIndex = 0;
    let skippedCount = 0;
    if (isListPage) {
      const listContainer = document.querySelector(LIST_CONTAINER_SELECTOR);
      if (!listContainer) {
        alert('頁面上揣無結果列表！');
        return;
      }
      const listItems = listContainer.querySelectorAll(LIST_ITEM_SELECTOR);
      console.log(`[自動播放][列表頁] 找到 ${listItems.length} 個列表項目。`);
      listItems.forEach((li) => {
        const audioButton = li.querySelector(AUDIO_INDICATOR_SELECTOR);
        if (audioButton) {
          allItems.push({
            element: li,
            audioButton: audioButton,
            originalIndex: globalRowIndex,
          });
        } else {
          console.log(
            `[自動播放][過濾][列表] 項目 ${
              globalRowIndex + 1
            } 無音檔按鈕，跳過。`
          );
          skippedCount++;
        }
        globalRowIndex++;
      });
    } else {
      const linkSelector = getLinkSelector();
      console.log(`[自動播放][表格頁] 使用連結選擇器: ${linkSelector}`);
      const visibleTables = getVisibleTables();
      if (visibleTables.length === 0) {
        alert('頁面上揣無目前顯示的結果表格！');
        return;
      }
      visibleTables.forEach((table) => {
        const isWideTable = table.matches(WIDE_TABLE_SELECTOR);
        const isNarrowTable = table.matches(NARROW_TABLE_SELECTOR);
        const rows = table.querySelectorAll('tbody tr');
        if (isWideTable) {
          rows.forEach((row) => {
            const firstTd = row.querySelector('td:first-of-type');
            if (
              firstTd &&
              firstTd.querySelector(RELEVANT_ROW_MARKER_SELECTOR)
            ) {
              const linkElement = row.querySelector(linkSelector);
              const thirdTd = row.querySelector('td:nth-of-type(3)');
              const hasAudioIndicator =
                thirdTd && thirdTd.querySelector(AUDIO_INDICATOR_SELECTOR);
              if (linkElement && hasAudioIndicator) {
                try {
                  allItems.push({
                    url: new URL(
                      linkElement.getAttribute('href'),
                      window.location.origin
                    ).href,
                    anchorElement: linkElement,
                    originalIndex: globalRowIndex,
                  });
                } catch (e) {
                  console.error(
                    `[自動播放][連結][寬] 處理連結 URL 時出錯:`,
                    e,
                    linkElement
                  );
                }
              } else {
                if (linkElement && !hasAudioIndicator) {
                  console.log(
                    `[自動播放][過濾][寬] 行 ${
                      globalRowIndex + 1
                    } 有連結但無音檔按鈕(在第3td)，跳過。`
                  );
                  skippedCount++;
                }
              }
              globalRowIndex++;
            }
          });
        } else if (isNarrowTable && rows.length >= 1) {
          const firstRow = rows[0];
          const firstRowTd = firstRow.querySelector('td:first-of-type');
          if (
            firstRowTd &&
            firstRowTd.querySelector(RELEVANT_ROW_MARKER_SELECTOR)
          ) {
            let linkElement = null;
            if (rows.length >= 2) {
              const secondRowTd = rows[1].querySelector('td:first-of-type');
              if (secondRowTd)
                linkElement = secondRowTd.querySelector(linkSelector);
            }
            if (linkElement) {
              const thirdTr = table.querySelector('tbody tr:nth-of-type(3)');
              const hasAudioIndicator =
                thirdTr && thirdTr.querySelector(AUDIO_INDICATOR_SELECTOR);
              if (hasAudioIndicator) {
                try {
                  allItems.push({
                    url: new URL(
                      linkElement.getAttribute('href'),
                      window.location.origin
                    ).href,
                    anchorElement: linkElement,
                    originalIndex: globalRowIndex,
                  });
                } catch (e) {
                  console.error(
                    `[自動播放][連結][窄] 處理連結 URL 時出錯:`,
                    e,
                    linkElement
                  );
                }
              } else {
                console.log(
                  `[自動播放][過濾][窄] 項目 ${
                    globalRowIndex + 1
                  } 有連結但無音檔按鈕(在第3tr)，跳過。`
                );
                skippedCount++;
              }
            }
            globalRowIndex++;
          }
        } else {
          console.warn('[自動播放][連結] 發現未知類型的可見表格:', table);
        }
      });
    }
    console.log(
      `[自動播放] 找到 ${allItems.length} 個包含音檔按鈕的項目 (已跳過 ${skippedCount} 個無音檔按鈕的項目)。`
    );
    if (allItems.length === 0) {
      alert(
        `目前顯示的${isListPage ? '列表' : '表格'}內揣無有音檔播放按鈕的詞目！`
      );
      resetTriggerButton();
      return;
    }
    let actualStartIndex = allItems.findIndex(
      (item) => item.originalIndex === requestedOriginalIndex
    );
    if (actualStartIndex === -1) {
      console.warn(
        `[自動播放] 無法在過濾後列表中找到 originalIndex ${requestedOriginalIndex}，將從頭開始。`
      );
      actualStartIndex = 0;
    }
    itemsToProcess = allItems.slice(actualStartIndex);
    totalItems = itemsToProcess.length;
    currentItemIndex = 0;
    isProcessing = true;
    isPaused = false;
    console.log(
      `[自動播放] 開始新的播放流程，從原始索引 ${requestedOriginalIndex} (對應過濾後索引 ${actualStartIndex}) 開始，共 ${totalItems} 項。`
    );
    ensureControlsContainer();
    pauseButton.style.display = 'inline-block';
    pauseButton.textContent = '暫停';
    stopButton.style.display = 'inline-block';
    statusDisplay.style.display = 'inline-block';
    updateStatusDisplay();
    processItemsSequentially();
  }

  /**
   * **修改：暫停播放 (按鈕觸發不關閉 Modal)**
   */
  function pausePlayback() {
    console.log(
      `[自動播放] 暫停/繼續 按鈕點擊。 isProcessing: ${isProcessing}, isPaused: ${isPaused}`
    );
    if (!isProcessing) return;
    if (!isPaused) {
      isPaused = true;
      pauseButton.textContent = '繼續';
      updateStatusDisplay();
      console.log('[自動播放] 執行暫停。');
      if (currentSleepController) {
        currentSleepController.cancel('paused');
      }
      const elementsToPause = [
        lastHighlightTargets.wide,
        lastHighlightTargets.narrow,
        lastHighlightTargets.list,
      ];
      elementsToPause.forEach((el) => {
        if (el) {
          el.classList.remove(ROW_HIGHLIGHT_CLASS_MAIN);
          el.style.backgroundColor = '';
          el.classList.add(ROW_PAUSED_HIGHLIGHT_CLASS);
          console.log('[自動播放][高亮] 暫停，應用閃爍高亮:', el);
        }
      });
      if (elementsToPause.every((el) => el === null)) {
        console.warn('[自動播放] 按鈕暫停，但找不到當前高亮目標元素。');
      }
      saveCurrentProgress();
      // ** 移除：按鈕觸發的暫停不關閉 Modal **
      // if (!isListPage) { closeModal(); }
    } else {
      startPlayback(); // 從暫停恢復
    }
  }

  /**
   * **修改：停止播放 (先儲存再改狀態)**
   */
  function stopPlayback() {
    console.log(
      `[自動播放] 停止 按鈕點擊。 isProcessing: ${isProcessing}, isPaused: ${isPaused}`
    );
    if (!isProcessing && !isPaused) return;

    const wasProcessing = isProcessing;
    // ** 修改：先儲存進度 **
    if (wasProcessing || isPaused) {
      // 即使是暫停狀態停止也要儲存
      saveCurrentProgress();
    }

    isProcessing = false; // 然後才改變狀態
    isPaused = false;
    if (currentSleepController) {
      currentSleepController.cancel('stopped');
    }
    if (!isListPage) {
      closeModal();
    }
    resetTriggerButton();
    updateStatusDisplay();
  }

  /**
   * 更新狀態顯示，包含項目編號連結，並根據儲存進度決定是否持續顯示
   */
  function updateStatusDisplay() {
    if (!statusDisplay) return; // 如果狀態顯示元素不存在，直接返回

    const allProgress = loadProgress();
    // ** 修改：直接找最新的記錄，不再管當前頁面 **
    const latestEntry = allProgress.length > 0 ? allProgress[0] : null;

    let displayText = '';
    let indexForLink = -1;
    let displayNum = null;
    let statusPrefix = '';
    let showStatus = false;
    let baseUrlForLink = ''; // ** 修改：基礎 URL 從最新記錄獲取 **

    if (latestEntry) {
      // --- 情況：有儲存的全局最新進度 ---
      indexForLink = latestEntry.nextIndex;
      displayNum = latestEntry.displayNumber; // 直接使用儲存的顯示編號
      // ** 修改：狀態文字統一為 "上次進度" 或 "已完成" **
      statusPrefix = indexForLink === -1 ? '已完成' : '分享進度連結：';
      showStatus = true;
      baseUrlForLink = latestEntry.url; // ** 使用最新記錄的 URL **

      if (indexForLink === -1) {
        // 如果最新紀錄是已完成
        displayText = '已完成';
        statusDisplay.innerHTML = displayText;
        statusDisplay.style.display = 'inline-block';
        return; // 完成處理，直接返回
      }
    }
    // else: --- 情況：沒有任何儲存紀錄 --- -> showStatus 維持 false

    // --- 根據情況產生最終顯示內容 ---
    if (
      showStatus &&
      indexForLink >= 0 &&
      displayNum !== null &&
      displayNum !== undefined &&
      baseUrlForLink // 確保有基礎 URL
    ) {
      // 準備建立連結
      try {
        const baseUrl = new URL(baseUrlForLink); // ** 使用最新記錄的基礎 URL **
        // 移除可能存在的舊參數 (以防萬一)
        baseUrl.searchParams.delete(LOAD_PROGRESS_PARAM);
        baseUrl.searchParams.delete(AUTOPLAY_PARAM);
        // 添加新的參數
        baseUrl.searchParams.set(LOAD_PROGRESS_PARAM, indexForLink);

        const targetUrl = baseUrl.toString();
        const linkHtml = `<a href="${targetUrl}" title="跳至上次進度 (#${displayNum})">#${displayNum}</a>`; // ** 修改 title **
        displayText = `${statusPrefix}${linkHtml}`;
      } catch (e) {
        console.error('[自動播放][狀態] 建立全局狀態連結時出錯:', e);
        // 出錯時，顯示不帶連結的文字
        displayText = `${statusPrefix}#${displayNum}`;
      }
      statusDisplay.innerHTML = displayText;
      statusDisplay.style.display = 'inline-block';
    } else if (showStatus && indexForLink === -1) {
      // 處理上面已完成的情況 (雖然理論上已 return，加個保險)
      statusDisplay.innerHTML = '已完成';
      statusDisplay.style.display = 'inline-block';
    } else {
      // 情況：不顯示狀態 (沒有任何紀錄)
      statusDisplay.innerHTML = '';
      statusDisplay.style.display = 'none';
    }
  }

  /**
   * **修改：重置按鈕狀態，但不移除容器**
   */
  function resetTriggerButton() {
    console.log('[自動播放] 重置按鈕狀態。');
    isProcessing = false;
    isPaused = false;
    currentItemIndex = 0;
    totalItems = 0;
    itemsToProcess = [];

    if (breakBeforePauseButton) breakBeforePauseButton.style.display = 'none';
    if (pauseButton) pauseButton.style.display = 'none';
    if (stopButton) stopButton.style.display = 'none';
    if (breakBeforeStatusDisplay)
      breakBeforeStatusDisplay.style.display = 'none';
    // if (statusDisplay) statusDisplay.style.display = 'none';
    if (progressDropdown) {
      progressDropdown.style.display = 'inline-block';
      populateProgressDropdown();
      progressDropdown.selectedIndex = 0;
    }

    const elementsToClear = [
      lastHighlightTargets.wide,
      lastHighlightTargets.narrow,
      lastHighlightTargets.list,
    ];
    elementsToClear.forEach((el) => {
      if (el) {
        el.classList.remove(
          ROW_HIGHLIGHT_CLASS_MAIN,
          ROW_PAUSED_HIGHLIGHT_CLASS
        );
        el.style.backgroundColor = '';
        el.style.transition = '';
        el.style.animation = '';
      }
    });
    lastHighlightTargets = { wide: null, narrow: null, list: null };
    if (!isListPage) {
      closeModal();
    }
    updateStatusDisplay();
  }

  async function handleRowPlayButtonClick(event) {
    const button = event.currentTarget;
    const rowIndex = parseInt(button.dataset.rowIndex, 10);
    if (isNaN(rowIndex)) {
      console.error('[自動播放] 無法獲取有效的列索引。');
      return;
    }
    if (isProcessing && !isPaused) {
      // **修改：播放中點擊其他行按鈕 -> 停止當前，立即開始新的**
      console.log(
        `[自動播放] 播放中點擊第 ${
          rowIndex + 1
        } 行按鈕，停止當前並從該行開始...`
      );
      // 1. 停止當前播放的核心邏輯 (不完全重置 UI)
      isProcessing = false;
      isPaused = false;
      if (currentSleepController) {
        currentSleepController.cancel('row_clicked_interrupt');
      }
      if (!isListPage) {
        closeModal(); // 關閉 iframe (如果是表格頁)
      }
      // 清除舊高亮
      const elementsToClear = [
        lastHighlightTargets.wide,
        lastHighlightTargets.narrow,
        lastHighlightTargets.list,
      ];
      elementsToClear.forEach((el) => {
        if (el) {
          el.classList.remove(
            ROW_HIGHLIGHT_CLASS_MAIN,
            ROW_PAUSED_HIGHLIGHT_CLASS
          );
          el.style.backgroundColor = '';
          el.style.transition = '';
          el.style.animation = '';
        }
      });
      lastHighlightTargets = { wide: null, narrow: null, list: null };

      // 2. 短暫延遲確保狀態更新
      await sleep(100); // 給予一點時間處理狀態變化

      // 3. 從新點擊的行開始播放
      startPlayback(rowIndex);
      return; // 完成處理，直接返回
    }
    if (isProcessing && isPaused) {
      // **修改：暫停中點擊其他行按鈕 -> 執行完整的停止，再開始新的**
      console.log(
        `[自動播放] 暫停中點擊第 ${
          rowIndex + 1
        } 行按鈕，執行完整停止後從該行開始...`
      );
      // 1. 執行完整的停止函數
      stopPlayback(); // <--- 改為呼叫完整的 stopPlayback

      // 2. 短暫延遲確保狀態更新和清理完成
      // *** 增加延遲，給瀏覽器更多時間處理 modal 關閉和 DOM 清理 ***
      await sleep(500); // Increased delay from 100ms to 500ms

      // 3. 從新點擊的行開始播放
      startPlayback(rowIndex);
      return; // 完成處理，直接返回
    }
    // **保持：非播放/非暫停狀態下點擊 -> 直接開始**
    startPlayback(rowIndex);
  }
  function ensureFontAwesome() {
    if (!document.getElementById('userscript-fontawesome-css')) {
      const link = document.createElement('link');
      link.id = 'userscript-fontawesome-css';
      link.rel = 'stylesheet';
      link.href = FONT_AWESOME_URL;
      link.integrity = FONT_AWESOME_INTEGRITY;
      link.crossOrigin = 'anonymous';
      link.referrerPolicy = 'no-referrer';
      document.head.appendChild(link);
      console.log('[自動播放] Font Awesome CSS 已注入。');
    }
  }
  function injectOrUpdateButton(
    targetElement,
    insertLocation,
    rowIndex,
    hasAudio
  ) {
    const buttonClass = 'userscript-row-play-button';
    let button = insertLocation.querySelector(`:scope > .${buttonClass}`);
    if (!insertLocation) {
      console.error(
        `[自動播放][按鈕注入] 錯誤：目標插入位置 (項目 ${rowIndex + 1}) 無效！`,
        targetElement
      );
      return;
    }
    if (!hasAudio) {
      if (button) {
        console.log(
          `[自動播放][按鈕注入] 項目 ${rowIndex + 1} 無音檔指示符，移除按鈕。`
        );
        button.remove();
      }
      return;
    }
    const playButtonBaseStyle = ` background-color: #28a745; color: white; border: none; border-radius: 4px; padding: 2px 6px; margin: 0 4px; cursor: pointer; font-size: 12px; line-height: 1; vertical-align: middle; transition: background-color 0.2s ease; display: inline-block; `;
    const buttonTitle = `從此列開始播放 (第 ${rowIndex + 1} 項)`;
    if (button) {
      if (button.dataset.rowIndex !== String(rowIndex)) {
        button.dataset.rowIndex = rowIndex;
        button.title = buttonTitle;
      }
      if (isListPage) {
        if (
          button.parentElement !== insertLocation ||
          insertLocation.firstChild !== button
        )
          insertLocation.insertBefore(button, insertLocation.firstChild);
      } else {
        const numberSpan = insertLocation.querySelector('span.fw-normal');
        if (numberSpan && button.previousSibling !== numberSpan)
          insertLocation.insertBefore(button, numberSpan.nextSibling);
        else if (!numberSpan && insertLocation.firstChild !== button)
          insertLocation.insertBefore(button, insertLocation.firstChild);
      }
    } else {
      button = document.createElement('button');
      button.className = buttonClass;
      button.style.cssText = playButtonBaseStyle;
      button.innerHTML = '<i class="fas fa-play"></i>';
      button.dataset.rowIndex = rowIndex;
      button.title = buttonTitle;
      button.addEventListener('click', handleRowPlayButtonClick);
      if (isListPage) {
        insertLocation.insertBefore(button, insertLocation.firstChild);
      } else {
        const numberSpan = insertLocation.querySelector('span.fw-normal');
        if (numberSpan && numberSpan.nextSibling)
          insertLocation.insertBefore(button, numberSpan.nextSibling);
        else if (numberSpan) insertLocation.appendChild(button);
        else insertLocation.insertBefore(button, insertLocation.firstChild);
      }
    }
  }
  function injectRowPlayButtons() {
    if (!checkPageType()) {
      console.log(
        '[自動播放][injectRowPlayButtons] 無法確定頁面類型或找不到容器，無法注入按鈕。'
      );
      return;
    }
    const playButtonHoverStyle = `.userscript-row-play-button:hover { background-color: #218838 !important; }`;
    GM_addStyle(playButtonHoverStyle);
    const buttonClass = 'userscript-row-play-button';
    const oldButtonsSelector = CONTAINER_SELECTOR.split(',')
      .map((s) => `${s.trim()} .${buttonClass}`)
      .join(', ');
    const buttonsToRemove = document.querySelectorAll(oldButtonsSelector);
    buttonsToRemove.forEach((btn) => btn.remove());
    console.log(
      `[自動播放][injectRowPlayButtons] 已移除 ${buttonsToRemove.length} 個舊的行播放按鈕 (使用選擇器: ${oldButtonsSelector})。`
    );
    let globalRowIndex = 0;
    let injectedCount = 0;
    if (isListPage) {
      const listContainer = document.querySelector(LIST_CONTAINER_SELECTOR);
      if (listContainer) {
        const listItems = listContainer.querySelectorAll(LIST_ITEM_SELECTOR);
        listItems.forEach((li) => {
          const audioButton = li.querySelector(AUDIO_INDICATOR_SELECTOR);
          const h2 = li.querySelector('h2.h5');
          if (h2) {
            injectOrUpdateButton(li, h2, globalRowIndex, !!audioButton);
            if (audioButton) injectedCount++;
          } else {
            console.warn(
              `[自動播放][按鈕注入][列表] 項目 ${
                globalRowIndex + 1
              } 缺少 h2 元素，無法注入按鈕。`
            );
          }
          globalRowIndex++;
        });
      } else {
        console.warn('[自動播放][按鈕注入][列表] 未找到列表容器。');
      }
    } else {
      const visibleTables = getVisibleTables();
      visibleTables.forEach((table, tableIndex) => {
        const isWideTable = table.matches(WIDE_TABLE_SELECTOR);
        const isNarrowTable = table.matches(NARROW_TABLE_SELECTOR);
        const rows = table.querySelectorAll('tbody tr');
        if (isWideTable) {
          rows.forEach((row) => {
            const firstTd = row.querySelector('td:first-of-type');
            if (
              firstTd &&
              firstTd.querySelector(RELEVANT_ROW_MARKER_SELECTOR)
            ) {
              const thirdTd = row.querySelector('td:nth-of-type(3)');
              const hasAudio =
                thirdTd && thirdTd.querySelector(AUDIO_INDICATOR_SELECTOR);
              injectOrUpdateButton(row, firstTd, globalRowIndex, hasAudio);
              if (hasAudio) injectedCount++;
              globalRowIndex++;
            }
          });
        } else if (isNarrowTable && rows.length >= 1) {
          const firstRow = rows[0];
          const firstRowTd = firstRow.querySelector('td:first-of-type');
          const hasMarker =
            firstRowTd &&
            firstRowTd.querySelector(RELEVANT_ROW_MARKER_SELECTOR);
          if (hasMarker) {
            let hasLink = false;
            if (rows.length >= 2) {
              const secondRowTd = rows[1].querySelector('td:first-of-type');
              if (secondRowTd && secondRowTd.querySelector(getLinkSelector()))
                hasLink = true;
            }
            const thirdTr = table.querySelector('tbody tr:nth-of-type(3)');
            const hasAudio =
              thirdTr && thirdTr.querySelector(AUDIO_INDICATOR_SELECTOR);
            if (hasLink) {
              injectOrUpdateButton(
                firstRow,
                firstRowTd,
                globalRowIndex,
                hasAudio
              );
              if (hasAudio) injectedCount++;
            }
            globalRowIndex++;
          }
        } else {
          console.warn(
            `[自動播放][按鈕注入][表格] 表格 ${
              tableIndex + 1
            } 類型未知，跳過按鈕注入。`
          );
        }
      });
    }
    console.log(
      `[自動播放][injectRowPlayButtons] 已處理 ${globalRowIndex} 個項目，為其中 ${injectedCount} 個有音檔指示符的項目注入或更新了播放按鈕。`
    );
  }

  /**
   * **修改：填充進度下拉選單 (更新顯示文字)**
   */
  function populateProgressDropdown() {
    if (!progressDropdown) return;
    const progressData = loadProgress();
    while (progressDropdown.options.length > 1) {
      progressDropdown.remove(1);
    }
    if (progressData.length === 0) {
      progressDropdown.disabled = true;
      progressDropdown.options[0].textContent = '無紀錄';
      return;
    }
    progressDropdown.disabled = false;
    progressDropdown.options[0].textContent = '進度紀錄';
    progressData.forEach((entry) => {
      const option = document.createElement('option');
      const urlToLoad =
        entry.nextIndex !== undefined &&
        entry.nextIndex !== null &&
        entry.nextIndex >= 0
          ? `${entry.url}${
              entry.url.includes('?') ? '&' : '?'
            }${LOAD_PROGRESS_PARAM}=${entry.nextIndex}`
          : entry.url;
      option.value = urlToLoad;
      let progressText = '';
      if (entry.nextIndex === -1) {
        progressText = '(已完成)';
      } else if (
        entry.displayNumber !== null &&
        entry.displayNumber !== undefined
      ) {
        progressText = `(#${entry.displayNumber})`;
      } else if (entry.nextIndex >= 0) {
        progressText = `(項目 ${entry.nextIndex + 1})`;
      }
      option.textContent = `${entry.title} ${progressText}`;
      progressDropdown.appendChild(option);
    });
    progressDropdown.selectedIndex = 0;
  }

  /**
   * **修改：創建控制按鈕和進度下拉選單 (修改預設文字)**
   */
  function createControlButtons() {
    const buttonStyle = `padding: 6px 12px; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; margin-right: 5px; transition: background-color 0.2s ease;`;
    pauseButton = document.createElement('button');
    pauseButton.id = 'auto-play-pause-button';
    pauseButton.textContent = '暫停';
    Object.assign(pauseButton.style, {
      cssText: buttonStyle,
      backgroundColor: '#ffc107',
      color: 'black',
      display: 'none',
    });
    pauseButton.addEventListener('click', pausePlayback);
    stopButton = document.createElement('button');
    stopButton.id = 'auto-play-stop-button';
    stopButton.textContent = '停止';
    Object.assign(stopButton.style, {
      cssText: buttonStyle,
      backgroundColor: '#dc3545',
      color: 'white',
      display: 'none',
    });
    stopButton.addEventListener('click', stopPlayback);
    statusDisplay = document.createElement('span');
    statusDisplay.id = 'auto-play-status';
    Object.assign(statusDisplay.style, {
      display: 'none',
      // marginLeft: '10px',
      fontSize: '14px',
      verticalAlign: 'middle',
    });
    progressDropdown = document.createElement('select');
    progressDropdown.id = PROGRESS_DROPDOWN_ID;
    progressDropdown.style.display = 'inline-block';
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.textContent = '進度紀錄';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    progressDropdown.appendChild(defaultOption);
    progressDropdown.addEventListener('change', (event) => {
      const selectedUrl = event.target.value;
      if (selectedUrl) {
        console.log(`[自動播放][進度] 選擇了進度，跳轉至: ${selectedUrl}`);
        saveCurrentProgress();
        window.location.href = selectedUrl;
      }
    });

    breakBeforePauseButton = document.createElement('br');
    breakBeforeStatusDisplay = document.createElement('br');
    Object.assign(breakBeforePauseButton.style, {
      display: 'none',
    });
    Object.assign(breakBeforeStatusDisplay.style, {
      display: 'none',
    });
  }

  /**
   * 根據捲動位置更新控制按鈕容器的頂部位置，並控制內部 br 的顯示
   */
  function updateControlsPosition() {
    // 從您的常數定義中獲取 ID
    const CONTROLS_CONTAINER_ID = 'auto-play-controls-container';
    const controlsContainer = document.getElementById(CONTROLS_CONTAINER_ID);
    const header = document.querySelector('header#header'); // 或者您用來獲取 header 的選擇器

    // 如果容器還沒創建好，就先不做事
    if (!controlsContainer) {
      return;
    }

    let newTop = '10px'; // 預設值：捲動超過 header 或找不到 header 時
    let showBreaks = false; // 預設不顯示 <br>

    if (header) {
      try {
        const headerHeight = header.offsetHeight;
        // 檢查捲動位置是否在 header 高度內
        if (window.scrollY <= headerHeight) {
          newTop = `${headerHeight + 10}px`; // 在 header 下方
          // 只有在播放中且捲動在頂部時才需要顯示 <br>
          if (isProcessing) {
            showBreaks = true;
          }
        }
        // else: 維持預設值 newTop = '10px' 且 showBreaks = false
      } catch (e) {
        console.error('[自動播放][定位] 計算 Header 高度或捲動位置時出錯:', e);
        // 出錯時也使用預設值
      }
    } else {
      // console.warn('[自動播放][定位] Header 元素未找到，使用預設 top: 10px');
      // 找不到 header 也視為捲動超過，不顯示 <br>
      showBreaks = false;
    }

    // 更新容器的 top 樣式
    controlsContainer.style.top = newTop;

    // 更新 <br> 元素的顯示狀態
    // 確保全域變數 breakBeforePauseButton 和 breakBeforeStatusDisplay 存在
    if (breakBeforePauseButton && breakBeforeStatusDisplay) {
      // 只有在 isProcessing 為 true 時才根據 showBreaks 決定，否則一律隱藏
      const displayValue = isProcessing && showBreaks ? 'initial' : 'none';
      breakBeforePauseButton.style.display = displayValue;
      breakBeforeStatusDisplay.style.display = displayValue;
    } else {
      // console.warn('[自動播放][定位] 無法找到 br 元素');
    }
  }

  /**
   * **修改：確保控制按鈕容器存在，並添加下拉選單 (下拉選單持續顯示)**
   */
  function ensureControlsContainer() {
    let buttonContainer = document.getElementById(CONTROLS_CONTAINER_ID);
    if (!buttonContainer) {
      console.log('[自動播放] 創建控制按鈕容器...');
      buttonContainer = document.createElement('div');
      buttonContainer.id = CONTROLS_CONTAINER_ID;

      // --- 設定樣式 (動態加上 header height 作為 top) ---
      try {
        const headerElement = document.querySelector('header#header');
        let fixedTopOffset = 10; // 預設值 (如果找不到 header)
        let positionType = 'fixed'; // 預設值

        if (headerElement) {
          const headerHeight = headerElement.offsetHeight;
          fixedTopOffset = headerHeight + 10;
          positionType = 'fixed';
          console.log(
            `[自動播放] 設定 top: ${fixedTopOffset}px (Header height: ${headerHeight}px)`
          );
        } else {
          console.warn(
            '[自動播放] 找不到 Header 元素，無法計算位於 header 下的 fixed top，將使用角落定位。'
          );
        }

        Object.assign(buttonContainer.style, {
          position: positionType,
          top: fixedTopOffset + 'px',
          right: '10px',
          zIndex: '10001',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '5px 10px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
          transition: 'top 0.3s ease-in-out',
        });
      } catch (e) {
        console.error('[自動播放] 計算 fixed top 或設定樣式時發生錯誤:', e);
        // 出錯時的後備樣式
        Object.assign(buttonContainer.style, {
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: '10001',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          padding: '5px 10px',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          textAlign: 'center',
        });
      }
      // --- 設定樣式結束 ---

      if (progressDropdown) buttonContainer.appendChild(progressDropdown);
      if (pauseButton) {
        buttonContainer.appendChild(pauseButton);
        buttonContainer.insertBefore(breakBeforePauseButton, pauseButton);
      }
      if (stopButton) buttonContainer.appendChild(stopButton);
      if (statusDisplay) {
        buttonContainer.appendChild(statusDisplay);
        // updateStatusDisplay(); // **修改：移除初始狀態顯示，避免載入時就顯示"上次進度"**
        buttonContainer.insertBefore(breakBeforeStatusDisplay, statusDisplay);
      }

      document.body.appendChild(buttonContainer);
      GM_addStyle(CSS_CONTROLS_BUTTONS);
      populateProgressDropdown();
    } else {
      if (progressDropdown && !buttonContainer.contains(progressDropdown)) {
        if (pauseButton && buttonContainer.contains(pauseButton)) {
          buttonContainer.insertBefore(progressDropdown, pauseButton);
        } else {
          buttonContainer.appendChild(progressDropdown);
        }
        populateProgressDropdown();
      }
      if (progressDropdown) {
        progressDropdown.style.display = 'inline-block';
      }
    }
    return buttonContainer;
  }

  function getLinkSelector() {
    return window.location.href.includes('/zh-hant/')
      ? 'a[href^="/zh-hant/su/"]'
      : 'a[href^="/und-hani/su/"]';
  }
  function showInteractionPromptOverlay(callback) {
    if (
      document.getElementById(MOBILE_INTERACTION_BOX_ID) ||
      document.getElementById(MOBILE_BG_OVERLAY_ID)
    ) {
      return;
    }
    const bgOverlay = document.createElement('div');
    bgOverlay.id = MOBILE_BG_OVERLAY_ID;
    document.body.appendChild(bgOverlay);
    const interactionBox = document.createElement('div');
    interactionBox.id = MOBILE_INTERACTION_BOX_ID;
    interactionBox.innerHTML =
      '若欲繼續放送進度，請點一下畫面<br>Nā beh kè-sio̍k hòng-sàng tsìn-tōo, tshiánn tiám tsit-ê uē-bīn';
    Object.assign(interactionBox.style, {
      position: 'fixed',
      width: MODAL_WIDTH,
      height: MODAL_HEIGHT,
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
    });
    document.body.appendChild(interactionBox);
    const clickHandler = () => {
      const box = document.getElementById(MOBILE_INTERACTION_BOX_ID);
      const bg = document.getElementById(MOBILE_BG_OVERLAY_ID);
      if (box) box.remove();
      if (bg) bg.remove();
      if (typeof callback === 'function') callback();
    };
    interactionBox.addEventListener('click', clickHandler, { once: true });
    bgOverlay.addEventListener('click', clickHandler, { once: true });
    console.log('[自動播放] 已顯示行動裝置互動提示遮罩和提示框。');
  }
  function initiateAutoPlayback(startIndex = 0) {
    console.log(`[自動播放] initiateAutoPlayback - startIndex: ${startIndex}`);
    console.log('[自動播放] 重新注入/更新行內播放按鈕以確保索引正確...');
    injectRowPlayButtons();
    setTimeout(() => {
      console.log('[自動播放] 自動啟動播放流程...');
      startPlayback(startIndex);
    }, 300);
  }
  function checkPageType() {
    const listContainer = document.querySelector(LIST_CONTAINER_SELECTOR);
    if (listContainer && listContainer.querySelector(LIST_ITEM_SELECTOR)) {
      isListPage = true;
      console.log('[自動播放] 偵測到列表頁面類型。');
      return true;
    }
    const tableContainer = document.querySelector(CONTAINER_SELECTOR);
    if (tableContainer && tableContainer.querySelector('table')) {
      isListPage = false;
      console.log('[自動播放] 偵測到表格頁面類型。');
      return true;
    }
    console.warn('[自動播放] 無法確定頁面類型（未找到列表或表格容器）。');
    return false;
  }

  // --- 全域快捷鍵處理 ---
  function handleGlobalHotkeys(event) {
    const activeEl = document.activeElement;
    const interactiveTags = ['INPUT', 'TEXTAREA', 'SELECT', 'BUTTON', 'A']; // A 標籤也算，避免點擊連結時觸發
    const isInteractiveFocused = activeEl &&
                                 (interactiveTags.includes(activeEl.tagName) ||
                                  activeEl.isContentEditable ||
                                  activeEl.getAttribute('role') === 'button' ||
                                  activeEl.getAttribute('role') === 'link' ||
                                  (progressDropdown && activeEl.id === PROGRESS_DROPDOWN_ID)); // 下拉選單也算

    if (event.key === ' ') { // Space 鍵
      if (isInteractiveFocused) {
        console.log('[自動播放][Hotkey] Space 鍵：Focus 佇互動元素，無處理。');
        return; // 若 focus 佇輸入框等，就莫處理
      }
      event.preventDefault(); // 避免頁面滾動

      if (!isProcessing && !isPaused) { // 狀況1：閒置中
        console.log('[自動播放][Hotkey] Space 鍵：閒置中，嘗試開始/載入進度。');
        const allProgress = loadProgress();
        if (allProgress.length > 0) {
          const latestProgress = allProgress[0];
          if (latestProgress.nextIndex === -1) { // 上次已完成
            console.log('[自動播放][Hotkey] Space 鍵：上次已完成，對目前頁面頭開始。');
            startPlayback(0);
          } else {
            let urlToLoad = latestProgress.url;
            // 確保 nextIndex 有效才加入 LOAD_PROGRESS_PARAM
            if (latestProgress.nextIndex !== undefined && latestProgress.nextIndex !== null && latestProgress.nextIndex >= 0) {
              try {
                const tempUrl = new URL(urlToLoad);
                tempUrl.searchParams.delete(AUTOPLAY_PARAM); // 清掉舊的 autoplay
                tempUrl.searchParams.set(LOAD_PROGRESS_PARAM, latestProgress.nextIndex);
                urlToLoad = tempUrl.toString();
                console.log(`[自動播放][Hotkey] Space 鍵：載入最新進度並開始: ${urlToLoad}`);
                window.location.href = urlToLoad;
              } catch (e) {
                console.error('[自動播放][Hotkey] Space 鍵：處理最新進度 URL 時出錯，改對目前頁面頭開始。', e);
                startPlayback(0);
              }
            } else { // nextIndex 無效，可能代表是舊格式的 "已完成" 或其他問題
              console.log('[自動播放][Hotkey] Space 鍵：最新進度 nextIndex 無效，對目前頁面頭開始。');
              startPlayback(0);
            }
          }
        } else { // 無任何進度紀錄
          console.log('[自動播放][Hotkey] Space 鍵：無進度紀錄，對目前頁面頭開始。');
          startPlayback(0);
        }
      } else if (isProcessing && !isPaused) { // 狀況2：播放中
        console.log('[自動播放][Hotkey] Space 鍵：播放中，執行暫停。');
        pausePlayback();
      } else if (isProcessing && isPaused) { // 狀況3：暫停中
        console.log('[自動播放][Hotkey] Space 鍵：暫停中，執行繼續。');
        startPlayback(); // 會自動處理繼續播放
      }
    } else if (event.key === 'Escape') { // Esc 鍵
      if (isInteractiveFocused) {
        console.log('[自動播放][Hotkey] Esc 鍵：Focus 佇互動元素，執行 blur。');
        activeEl.blur();
        event.preventDefault(); // 可能也需要避免其他 Esc 的預設行為
      } else {
        if (isProcessing || isPaused) { // 無 focus 互動元素，且播放中或暫停中
          console.log('[自動播放][Hotkey] Esc 鍵：無 Focus 且播放/暫停中，執行停止。');
          stopPlayback();
          event.preventDefault();
        }
      }
    }
  }

  function initialize() {
    if (window.autoPlayerInitialized) {
      return;
    }
    window.autoPlayerInitialized = true;
    isMobile = navigator.userAgent.toLowerCase().includes('mobile');
    // --- 新增：偵測是否為桌面 Chrome 系瀏覽器 ---
    if (!isMobile) {
      // 只有桌面才需要判斷
      const userAgent = navigator.userAgent;
      // 檢查是否包含 Chrome，但不包含 Edge (Edg/)
      // 注意：這可能也會包含其他 Chromium 核心瀏覽器，但通常行為類似
      if (userAgent.includes('Chrome')) {
        // 只要包含 Chrome 字樣就視為需要互動 (包含 Edge)
        isDesktopChromiumBased = true;
      }
    }
    console.log(
      `[自動播放] 初始化腳本 v4.43b ... isMobile: ${isMobile}, isDesktopChromiumBased: ${isDesktopChromiumBased}`
    );
    GM_addStyle(
      CSS_IFRAME_HIGHLIGHT +
        CSS_PAUSE_HIGHLIGHT +
        CSS_MOBILE_OVERLAY +
        CSS_CONTROLS_BUTTONS
    );
    ensureFontAwesome();
    checkPageType();
    createControlButtons();
    ensureControlsContainer(); // 確保容器和下拉選單顯示
    setTimeout(injectRowPlayButtons, 1000);

    // --- ResizeObserver 邏輯 ---
    try {
      const resizeObserver = new ResizeObserver(async (entries) => {
        clearTimeout(resizeDebounceTimeout);
        resizeDebounceTimeout = setTimeout(async () => {
          console.log(
            '[自動播放][ResizeObserver][除錯] Debounced callback executing...'
          );
          checkPageType();
          injectRowPlayButtons();
          if (isProcessing && currentItemIndex < itemsToProcess.length) {
            const currentItem = itemsToProcess[currentItemIndex];
            console.log('[自動播放][ResizeObserver] 重新查找捲動目標...');
            const currentTargetsAfterResize =
              findHighlightTargetsForItem(currentItem);
            console.debug(
              '[自動播放][ResizeObserver][除錯] 找到的目標:',
              currentTargetsAfterResize
            );
            let elementToScroll = null;
            try {
              console.debug(
                '[自動播放][ResizeObserver][除錯] 開始檢查可見性 (使用 isElementVisible)...'
              );
              let isWideVisible = isElementVisible(
                currentTargetsAfterResize.wide
              );
              let isNarrowVisible = isElementVisible(
                currentTargetsAfterResize.narrow
              );
              let isListVisible = isElementVisible(
                currentTargetsAfterResize.list
              );
              console.debug(
                `[自動播放][ResizeObserver][除錯] 可見性: wide=${isWideVisible}, narrow=${isNarrowVisible}, list=${isListVisible}`
              );
              if (isListVisible) {
                elementToScroll = currentTargetsAfterResize.list;
              } else if (isWideVisible) {
                elementToScroll =
                  currentTargetsAfterResize.wide.querySelector(
                    'td:first-of-type'
                  );
              } else if (isNarrowVisible) {
                elementToScroll =
                  currentTargetsAfterResize.narrow.querySelector(
                    'td:first-of-type'
                  );
              } else {
                const fallbackWideTarget = currentTargetsAfterResize.wide
                  ? currentTargetsAfterResize.wide.querySelector(
                      'td:first-of-type'
                    )
                  : null;
                const fallbackNarrowTarget = currentTargetsAfterResize.narrow
                  ? currentTargetsAfterResize.narrow.querySelector(
                      'td:first-of-type'
                    )
                  : null;
                elementToScroll =
                  currentTargetsAfterResize.list ||
                  fallbackWideTarget ||
                  fallbackNarrowTarget;
                if (elementToScroll)
                  console.warn(
                    '[自動播放][ResizeObserver] 無法確定可見捲動目標，使用後備目標:',
                    elementToScroll
                  );
                else
                  console.error(
                    '[自動播放][ResizeObserver] 找不到任何後備捲動目標!'
                  );
              }
              console.debug(
                '[自動播放][ResizeObserver][除錯] 最終決定捲動目標:',
                elementToScroll
              );
              if (elementToScroll && document.body.contains(elementToScroll)) {
                console.log(
                  '[自動播放][ResizeObserver] 準備重新捲動到目標:',
                  elementToScroll
                );
                await sleep(50);
                elementToScroll.scrollIntoView({
                  behavior: 'smooth',
                  block: 'center',
                });
                console.log('[自動播放][ResizeObserver] scrollIntoView 已呼叫');
              } else {
                console.warn(
                  '[自動播放][ResizeObserver] 未找到、無效或不在 DOM 中的捲動目標:',
                  elementToScroll,
                  currentItem
                );
              }
            } catch (e) {
              console.error(
                '[自動播放][ResizeObserver] 捲動或檢查可見性時出錯:',
                e
              );
            }
            const elementsToUpdate = [
              lastHighlightTargets.wide,
              lastHighlightTargets.narrow,
              lastHighlightTargets.list,
            ];
            elementsToUpdate.forEach((el) => {
              if (el && document.body.contains(el)) {
                if (!isPaused) {
                  el.classList.remove(ROW_PAUSED_HIGHLIGHT_CLASS);
                  el.style.animation = '';
                  el.classList.add(ROW_HIGHLIGHT_CLASS_MAIN);
                  el.style.backgroundColor = ROW_HIGHLIGHT_COLOR;
                } else {
                  el.classList.remove(ROW_HIGHLIGHT_CLASS_MAIN);
                  el.style.backgroundColor = '';
                  el.classList.add(ROW_PAUSED_HIGHLIGHT_CLASS);
                }
              }
            });
            console.log('[自動播放][ResizeObserver] 已重新應用高亮樣式。');
          }
        }, RESIZE_DEBOUNCE_MS);
      });
      resizeObserver.observe(document.body);
    } catch (e) {
      console.error('[自動播放] 無法啟動 ResizeObserver:', e);
    }

    // --- 自動啟動與進度載入邏輯 ---
    const urlParams = new URLSearchParams(window.location.search);
    let startIndexFromUrl = 0; // 存的是 originalIndex
    let loadFromProgress = false;
    isInternalAutoNext = false; // ** 初始值設為 false **

    if (urlParams.has(LOAD_PROGRESS_PARAM)) {
      const progressIndex = parseInt(urlParams.get(LOAD_PROGRESS_PARAM), 10);
      if (!isNaN(progressIndex) && progressIndex >= 0) {
        // 允許 0
        startIndexFromUrl = progressIndex;
        loadFromProgress = true; // ** 設為 true，表示外部觸發 **
        isInternalAutoNext = false; // ** 確保設為 false **
        console.log(
          `[自動播放] 偵測到 ${LOAD_PROGRESS_PARAM} 參數 (外部觸發)，請求起始 originalIndex: ${startIndexFromUrl}`
        );
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete(LOAD_PROGRESS_PARAM);
        history.replaceState(null, '', newUrl.toString());
      } else {
        console.warn(
          `[自動播放] 無效的 ${LOAD_PROGRESS_PARAM} 參數值: ${urlParams.get(
            LOAD_PROGRESS_PARAM
          )}`
        );
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.delete(LOAD_PROGRESS_PARAM);
        history.replaceState(null, '', newUrl.toString());
      }
    } else if (urlParams.has(AUTOPLAY_PARAM)) {
      console.log(
        `[自動播放] 偵測到 ${AUTOPLAY_PARAM} 參數 (內部自動跳頁)，準備自動啟動...`
      );
      startIndexFromUrl = 0; // 內部跳頁總是從頭開始
      loadFromProgress = false; // ** 設為 false，非外部觸發 **
      isInternalAutoNext = true; // ** 設為 true **
      const newUrl = new URL(window.location.href);
      newUrl.searchParams.delete(AUTOPLAY_PARAM);
      history.replaceState(null, '', newUrl.toString());
    }

    // --- if (loadFromProgress || isInternalAutoNext) ---
    // ** 修改判斷條件，只要有任一觸發就繼續 **
    if (loadFromProgress || isInternalAutoNext) {
      let elapsedTime = 0;
      const waitForContentAndStart = () => {
        console.log('[自動播放][等待] 檢查內容是否存在...');
        let contentExists = false;
        if (isListPage) {
          const listContainer = document.querySelector(LIST_CONTAINER_SELECTOR);
          contentExists =
            listContainer &&
            listContainer.querySelector(
              LIST_ITEM_SELECTOR + ' ' + AUDIO_INDICATOR_SELECTOR
            );
        } else {
          const visibleTables = getVisibleTables();
          contentExists = visibleTables.some((table) =>
            table.querySelector('tbody tr ' + AUDIO_INDICATOR_SELECTOR)
          );
        }
        if (contentExists) {
          console.log('[自動播放][等待] 內容已找到。');

          // --- 修改：根據新的條件判斷是否需要互動 ---
          // 條件：是手機，或者 (是桌面 Chromium 系瀏覽器 且 是由外部 URL 參數觸發的)
          const requiresInteraction =
            isMobile || (isDesktopChromiumBased && loadFromProgress); // ** 使用 loadFromProgress **

          if (requiresInteraction) {
            // ** 修改日誌訊息，更清晰 **
            console.log(
              `[自動播放] 需要使用者互動以啟動播放 (isMobile: ${isMobile}, isDesktopChromiumBased: ${isDesktopChromiumBased}, triggeredByURL: ${loadFromProgress})，顯示提示。`
            );
            const interactionCallback = () =>
              initiateAutoPlayback(startIndexFromUrl);
            showInteractionPromptOverlay(interactionCallback);
          } else {
            // 不需要互動的情況 (例如：桌面 Firefox，或桌面 Chrome 但非外部 URL 觸發，或內部自動跳頁)
            // ** 修改日誌訊息，更清晰 **
            console.log(
              `[自動播放] 不需要使用者互動 (isMobile: ${isMobile}, isDesktopChromiumBased: ${isDesktopChromiumBased}, triggeredByURL: ${loadFromProgress}, isInternalAutoNext: ${isInternalAutoNext})，直接啟動播放。`
            );
            initiateAutoPlayback(startIndexFromUrl);
          }
        } else {
          elapsedTime += AUTO_START_CHECK_INTERVAL_MS;
          if (elapsedTime >= AUTO_START_MAX_WAIT_MS) {
            console.error('[自動播放][等待] 等待內容超時。');
            alert('自動播放失敗：等待內容載入超時。');
          } else {
            setTimeout(waitForContentAndStart, AUTO_START_CHECK_INTERVAL_MS);
          }
        }
      };
      if (checkPageType()) {
        setTimeout(waitForContentAndStart, 500);
      } else {
        setTimeout(() => {
          if (checkPageType()) {
            setTimeout(waitForContentAndStart, 500);
          } else {
            console.error(
              '[自動播放][等待] 無法確定頁面類型，無法啟動自動播放。'
            );
            alert('自動播放失敗：無法識別頁面內容結構。');
          }
        }, 1000);
      }
    }

    // --- 添加 beforeunload 事件監聽器 ---
    window.addEventListener('beforeunload', (event) => {
      if (isProcessing || isPaused) {
        // 暫停時也要儲存
        console.log('[自動播放][進度] beforeunload 事件觸發，儲存進度...');
        saveCurrentProgress();
      }
    });

    // 添加捲動事件監聽器，使用 passive: true 提升效能
    window.addEventListener('scroll', updateControlsPosition, {
      passive: true,
    });
    // 在添加監聽器後，延遲一點點時間呼叫一次，以設定初始位置
    setTimeout(updateControlsPosition, 150); // 延遲 150 毫秒
  }
  
  // --- 初始化時加入全域快捷鍵監聽 ---
  document.addEventListener('keydown', handleGlobalHotkeys);
  console.log('[KIPSutian-autoplay] 全域快捷鍵監聽器已設定。');

  // --- 確保 DOM 加載完成後執行 ---
  if (
    document.readyState === 'complete' ||
    document.readyState === 'interactive'
  ) {
    setTimeout(initialize, 0);
  } else {
    document.addEventListener('DOMContentLoaded', initialize);
  }

  
})();
