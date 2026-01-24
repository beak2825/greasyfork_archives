// ==UserScript==
// @name         YouTube聊天室增強 YouTube Chat Enhancement
// @name:zh-tw   YouTube聊天室增強
// @name:en      YouTube Chat Enhancement
// @namespace    http://tampermonkey.net/
// @version      20.9.7
// @description  多色自動化著色用戶；非原生封鎖用戶；UI操作和功能選擇自由度；移除礙眼置頂；清理/標示洗版；發言次數統計；強化@體驗等
// @description:zh-tw  多色自動化著色用戶；非原生封鎖用戶；UI操作和功能選擇自由度；移除礙眼置頂；清理/標示洗版；發言次數統計；強化@體驗等
// @description:en Multi-color automated user highlighting；Non-native user blocking；Flexible UI operations and feature selection；Removal of distracting pinned messages；Spam cleanup/flagging；Message count statistics；Improved @mention experience
// @match        *://www.youtube.com/live_chat*
// @match        *://www.youtube.com/watch*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530998/YouTube%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%A2%9E%E5%BC%B7%20YouTube%20Chat%20Enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/530998/YouTube%E8%81%8A%E5%A4%A9%E5%AE%A4%E5%A2%9E%E5%BC%B7%20YouTube%20Chat%20Enhancement.meta.js
// ==/UserScript==
(function(){'use strict';
/*
更新說明:
20.6 新增基於洗版快取的用戶對話記錄存取功能，懸停用戶頭像以讀取數據，右移游標可以選取文字。
20.7.20 短暫模式(臨時模式重命名)時的封鎖功能，與高亮用戶相同不儲存數據。
20.8.12 本地儲存資料從四散的項目改為集中於featureSettings，名單仍舊獨立設置，且往後遷移設置只包含名單。暫時添加舊格式名單資料遷移、自動清理舊設定項目、更新格式通知的腳本段落。
20.8.19 新增頂部聊天室頻率統計、洗版檢測(時間限制)+快取數量統計，單擊切換功能洗版範圍(10分鐘~60分鐘和全部)，雙擊切換統計開關。(洗版相關功能不相容super fast chat，無法解決)
20.9.6 增加前置階段：於直播頁面啟動腳本；於非直播頁面檢測並啟動聊天室重播。
20.9.7 改善用戶頭像懸停對話記錄框的消失邏輯，即使用戶被ban也能正常消失。
Update note:
20.6 Added user chat history access based on spam cache; hover over user avatars to read data, and move cursor right to select text.
20.7.20 Blocking in Temporary Mode (renamed from Ephemeral Mode) no longer saves data, same as highlighting users.
20.8.12 Local storage restructured: scattered settings consolidated into featureSettings; lists remain independently configured; future migrations will only include lists. Temporary script segments added for migrating old-format lists, auto-cleaning obsolete settings, and notifying users of format updates.
20.8.19 Added top chat room frequency statistics, spam detection (time-limited) with cache count stats; single-click toggles spam detection range (10–60 minutes and All), double-click toggles statistics on/off. (Spam-related features incompatible with Super Fast Chat; issue cannot be resolved.)
20.9.6 Added pre-check phase: initialize script on live stream pages; on non-live pages, detect and click chat replay once to activate core script.
20.9.7 Improved user avatar hover chat log box disappearance logic so it disappears normally even if the user is banned.
關於按鈕：「懸停顯示說明文字」。
1.臨:切換短暫模式，對於用戶上色為臨時性/無永久記憶。
2.頂:切換移除置頂
3.亮:上色指定用戶、「左鍵雙擊」切換暱稱/對話/兩者上色。
4.封:封鎖用戶對話添加#303030深色背景，「左鍵雙擊」切換模式。
5.＠:上色用戶以@提及其它用戶時，臨時性高亮該用戶，「樣式可切換」。
6.洗:檢測到洗版消息以深色(#404040)標示。「左鍵雙擊」切換模式。
7.數:自動化統計所有用戶的發言次數。
8.☑:用來隱藏功能切換開關。
9.msgs:左上新增按鈕，用於開關聊天室消息頻率統計功能。(不支持super fast chat 無法解決)
10.除了開啟封鎖，切換和關閉封鎖時，會顯示之前被隱藏的消息。
Buttons: 'Hover to show description'.
1.Temp: Toggle ephemeral mode, highlighting users temporarily / no permanent memory.
2.Pin: Toggle removing pinned messages
3.Highlight: Highlight specified users, 'Left-click double-click' to switch between name/conversation/both.
4.Block: Add #303030 dark background to blocked user messages, 'Left-click double-click' to switch mode.
5.@: Temporarily highlight the user when @ mentioning other users, 'Style is switchable'.
6.Spam: Detect spam messages and mark them in dark (#404040). 'Left-click double-click' to switch mode.
7.Counter: Automatically count all users' message frequency.
8.☑: Used to hide function toggle switches.
9.msgs: New button in the top-left, used to toggle the chat message frequency statistics function. (Not supported by super fast chat, cannot be resolved)
10. Except for enabling blocking, when switching or disabling blocking, previously hidden messages will be shown.
系統常數設定 (單位：毫秒)
      CALLOUT_USER_EXPIRE_TIME = 30000, // 呼叫用戶資料時限
      EPHEMERAL_USER_DURATION = 600000, // 短暫用戶持續時間
      MAX_MESSAGE_CACHE_SIZE = 600,// 最大訊息快取數量
      CACHE_CLEANUP_INTERVAL = 60000,// 定時清理過期的快取 (spamCache, calloutUserCache, ephemeralUsers) 和置頂訊息
      DOUBLE_CLICK_DELAY = 350, // 雙擊判定間隔
      PIN_CHECK_INTERVAL = 60000; // 定期檢查置頂訊息
      STATS_UPDATE_INTERVAL = 10000,// 更新統計數據 (recentMessages 和 spamCache 數量) 的頻率
System Constants (Unit: milliseconds)
      CALLOUT_USER_EXPIRE_TIME = 30000, // Callout user data timeout
      EPHEMERAL_USER_DURATION = 600000, // Ephemeral user duration
      MAX_MESSAGE_CACHE_SIZE = 600,// Maximum message cache size
      CACHE_CLEANUP_INTERVAL = 60000,// Periodic cleanup of expired caches (spamCache, calloutUserCache, ephemeralUsers) and pinned messages
      DOUBLE_CLICK_DELAY = 350, // Double-click delay
      PIN_CHECK_INTERVAL = 60000; // Periodic check for pinned messages
      STATS_UPDATE_INTERVAL = 10000,// Frequency of updating statistics (recentMessages and spamCache count)
*/
const CALLOUT_USER_EXPIRE_TIME = 30000,
      EPHEMERAL_USER_DURATION = Infinity,
      MAX_MESSAGE_CACHE_SIZE = 300,
      CACHE_CLEANUP_INTERVAL = 60000,
      DOUBLE_CLICK_DELAY = 350,
      PIN_CHECK_INTERVAL = 60000,
      STATS_UPDATE_INTERVAL = 10000;
const LANG = {
  'zh-TW': {
    buttons: {'封鎖':'封鎖','編輯':'編輯','刪除':'刪除','清除':'清除'},
    tooltips: {
      ephemeral: '短暫模式: 切換至短暫用戶上色，開啟時上色不儲存',
      pin: '清除置頂: 開啟/關閉自動移除置頂訊息',
      highlight: mode => `高亮模式: ${mode} (雙擊切換模式)`,
      block: mode => `封鎖模式: ${mode} (雙擊切換模式)`,
      callout: mode => `呼叫高亮: ${mode} (雙擊切換模式)`,
      spam: mode => `洗版過濾: ${mode} (雙擊切換模式)`,
      counter: '留言計數: 顯示/隱藏用戶留言計數',
      clearConfirm: '確定清除所有設定？',
      clearButton: '確認'
    }
  },
  'en': {
    buttons: {'封鎖':'Block','編輯':'Edit','刪除':'Delete','清除':'Clear'},
    tooltips: {
      ephemeral: 'Ephemeral mode: Switch to ephemeral user coloring, colors are not saved when enabled',
      pin: 'Pin removal: Toggle auto-remove pinned messages',
      highlight: mode => `Highlight mode: ${mode} (Double-click to switch)`,
      block: mode => `Block mode: ${mode} (Double-click to switch)`,
      callout: mode => `Callout highlight: ${mode} (Double-click to switch)`,
      spam: mode => `Spam filter: ${mode} (Double-click to switch)`,
      counter: 'Message counter: Show/hide user message counts',
      clearConfirm: 'Confirm reset all settings?',
      clearButton: 'Confirm'
    }
  }
};
const currentLang = navigator.language.startsWith('zh') ? 'zh-TW' : 'en';
const COLOR_OPTIONS = {
  "淺藍":"#A5CDF3", "藍色":"#62A8EA", "深藍":"#1C76CA", "紫色":"#FF00FF",
  "淺綠":"#98FB98", "綠色":"#00FF00", "深綠":"#00B300", "青色":"#00FFFF",
  "粉紅":"#FFC0CB", "淺紅":"#F08080", "紅色":"#FF0000", "深紅":"#8B0000",
  "橙色":"#FFA500", "金色":"#FFD700", "灰色":"#BDBDBD", "深灰":"#404040"
};
const HIGHLIGHT_MODES = { BOTH:0, NAME_ONLY:1, MESSAGE_ONLY:2 },
      SPAM_MODES = { MARK:0, REMOVE:1 },
      BLOCK_MODES = { MARK:0, HIDE:1 };
const STORAGE_KEYS = {
    USER_COLOR_SETTINGS: 'ytcm_userColorSettings',
    BLOCKED_USERS: 'ytcm_blockedUsers',
    FEATURE_SETTINGS: 'ytcm_featureSettings'
};
const OLD_KEYS_TO_REMOVE = [
    'userColorSettings', 'blockedUsers', 'featureSettings', 'highlightSettings',
    'duplicateEnabled', 'mentionHighlightEnabled', 'keywordHighlightEnabled', 'scEnabled', 'flagMode',
    'toggleFrequencyDisplay', 'toggleSpamExpireTime', 'frequencyEnabled', 'spamExpireTimeIndex'
];
function migrateOldStorage() {
    let migrated = false;
    const oldUserColorData = localStorage.getItem('userColorSettings');
    if (oldUserColorData !== null) {
        localStorage.setItem(STORAGE_KEYS.USER_COLOR_SETTINGS, oldUserColorData);
        localStorage.removeItem('userColorSettings');
        migrated = true;
    }
    const oldBlockedUsersData = localStorage.getItem('blockedUsers');
    if (oldBlockedUsersData !== null) {
        localStorage.setItem(STORAGE_KEYS.BLOCKED_USERS, oldBlockedUsersData);
        localStorage.removeItem('blockedUsers');
        migrated = true;
    }
    for (const oldKey of OLD_KEYS_TO_REMOVE) {
        if (localStorage.getItem(oldKey) !== null) {
            localStorage.removeItem(oldKey);
            migrated = true;
        }
    }
    if (migrated) {
        alert(currentLang === 'zh-TW' ? "已遷移至新格式" : "Migrated to new format");
    }
}
migrateOldStorage();
let userColorSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.USER_COLOR_SETTINGS)) || {},
    blockedUsers = JSON.parse(localStorage.getItem(STORAGE_KEYS.BLOCKED_USERS)) || [],
    currentMenu = null,
    featureSettings = JSON.parse(localStorage.getItem(STORAGE_KEYS.FEATURE_SETTINGS)) || {},
    ephemeralUsers = {},
    ephemeralBlockedUsers = new Set(),
    userMessageCounts = {},
    lastClickTime = 0,
    clickCount = 0,
    recentMessages = [],
    statsBox = null,
    frequencyDisplay = null,
    spamStatsDisplay = null;
const defaultFeatureSettings = {
      pinEnabled: true,
      highlightEnabled: true,
      blockEnabled: true,
      buttonsVisible: true,
      calloutHighlightEnabled: true,
      spamFilterEnabled: true,
      counterEnabled: true,
      spamMode: SPAM_MODES.MARK,
      blockMode: BLOCK_MODES.MARK,
      ephemeralMode: false,
      defaultMode: HIGHLIGHT_MODES.BOTH,
      calloutMode: HIGHLIGHT_MODES.BOTH,
      frequencyEnabled: true,
      spamExpireTimeIndex: 0
};
for (const [key, value] of Object.entries(defaultFeatureSettings)) {
    if (featureSettings[key] === undefined) {
        featureSettings[key] = value;
    }
}
localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
let frequencyEnabled = featureSettings.frequencyEnabled;
let spamExpireTimeIndex = featureSettings.spamExpireTimeIndex;
let spamExpireTime = [600000, 1200000, 1800000, 2400000, 3000000, 3600000, Infinity][spamExpireTimeIndex];
let statsUpdaterInterval = null;
let cacheCleanupInterval = null;
let currentSpamCount = 0;
const userColorCache = new Map(),
      blockedUsersSet = new Set(blockedUsers),
      calloutUserCache = new Map(),
      styleCache = new WeakMap(),
      spamCache = new Map(),
      processedMessages = new Map();
Object.entries(userColorSettings).forEach(([user, color]) => userColorCache.set(user, color));
GM_addStyle(`
:root{--highlight-color:inherit}
.ytcm-menu{position:fixed;background-color:white;border:1px solid black;padding:5px;z-index:9999;box-shadow:2px 2px 5px rgba(0,0,0,0.2);border-radius:5px}
.ytcm-color-item{cursor:pointer;padding:0;border-radius:3px;margin:2px;border:1px solid #ddd;transition:transform 0.1s;min-width:40px;height:25px}
.ytcm-color-item:hover{transform:scale(1.1);box-shadow:0 0 5px rgba(0,0,0,0.3)}
.ytcm-list-item{cursor:pointer;padding:3px;background-color:#f0f0f0;border-radius:3px;margin:2px;font-size:12px}
.ytcm-button{cursor:pointer;padding:5px 8px;margin:5px 2px 0 2px;border-radius:3px;border:1px solid #ccc;background-color:#f8f8f8;font-size:12px}
.ytcm-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:5px}
.ytcm-button-row{display:flex;justify-content:space-between;margin-top:5px}
.ytcm-flex-wrap{display:flex;flex-wrap:wrap;gap:5px;margin-bottom:10px}
.ytcm-control-panel{position:fixed;left:0;bottom:75px;z-index:9998;display:flex;flex-direction:column;gap:8px;padding:0}
.ytcm-control-btn{padding:5px 0;cursor:pointer;text-align:left;min-width:20px;font-size:14px;font-weight:bold;color:white;-webkit-text-stroke:1px black;text-shadow:none;background:none;border:none;margin:0}
.ytcm-control-btn.active{-webkit-text-stroke:1px black}
.ytcm-control-btn.inactive{-webkit-text-stroke:1px red}
.ytcm-toggle-btn{padding:5px 0;cursor:pointer;text-align:left;min-width:20px;font-size:14px;font-weight:bold;color:white;-webkit-text-stroke:1px black;text-shadow:none;background:none;border:none;margin:0}
.ytcm-main-buttons{display:${featureSettings.buttonsVisible?'flex':'none'};flex-direction:column;gap:8px}
.ytcm-message-count{margin-left:3px;display:inline-block}
.ytcm-stats-box{position:fixed;top:0px;left:100px;z-index:9999;font-size:14px;font-weight:bold;color:white;background:rgba(0,0,0,0.7);padding:4px 8px;border-radius:4px;cursor:pointer}
.ytcm-stats-box div{margin: 2px 0;}
[data-blocked="true"][data-block-mode="mark"]{background-color:#303030 !important}
[data-blocked="true"][data-block-mode="hide"]{display:none!important}
[data-spam="true"]{display:none!important}
[data-spam="true"].spam-marked{display:flex!important;}
[data-spam="true"].spam-marked #author-name,[data-spam="true"].spam-marked #message{color:#404040!important}
[data-highlight="name"] #author-name,[data-highlight="both"] #author-name{color:var(--highlight-color)!important;font-weight:bold!important}
[data-highlight="message"] #message,[data-highlight="both"] #message{color:var(--highlight-color)!important;font-weight:bold!important}
[data-ephemeral="true"] #author-name,[data-ephemeral="true"] #message{color:var(--ephemeral-color)!important;font-weight:bold!important;opacity:var(--ephemeral-opacity,1)}
[data-callout-highlight="name"] #author-name,[data-callout-highlight="both"] #author-name{color:var(--highlight-color)!important;font-weight:bold!important}
[data-callout-highlight="message"] #message,[data-callout-highlight="both"] #message{color:var(--highlight-color)!important;font-weight:bold!important}
.ytcm-spam-tooltip{position:absolute;background-color:white;border:1px solid black;padding:5px;z-index:9999;box-shadow:2px 2px 5px rgba(0,0,0,0.2);border-radius:5px;font-size:12px;max-width:90vw;max-height:80vh;overflow-y:auto;word-wrap:break-word;white-space:normal;box-sizing:border-box}
`);
function normalizeUserName(userName) {
    return userName.startsWith('@') ? userName.substring(1) : userName;
}
function updateAllMessages(userName) {
    const normalizedUserName = normalizeUserName(userName);
    const messages = Array.from(document.querySelectorAll('yt-live-chat-text-message-renderer, .super-fast-chat-message'))
        .filter(msg => {
            const nameElement = msg.querySelector('#author-name') || msg.querySelector('.author-name');
            return nameElement
                && normalizeUserName(nameElement.textContent.trim()) === normalizedUserName
                && msg.style.display !== 'none';
        });
    messages.forEach(msg => {
        processedMessages.delete(msg);
        styleCache.delete(msg);
        processMessage(msg, true);
    });
}
function ensureStatsDisplay() {
    if (!statsBox) {
        statsBox = document.createElement('div');
        statsBox.className = 'ytcm-stats-box';
        frequencyDisplay = document.createElement('div');
        frequencyDisplay.textContent = frequencyEnabled ? 'msgs/min: 0' : 'msgs';
        spamStatsDisplay = document.createElement('div');
        const intervalLabels = ['10m', '20m', '30m', '40m', '50m', '60m', 'All'];
        spamStatsDisplay.textContent = `spam/${intervalLabels[spamExpireTimeIndex]}: ${spamCache.size}`;
        statsBox.appendChild(frequencyDisplay);
        statsBox.appendChild(spamStatsDisplay);
        document.body.appendChild(statsBox);
        let lastClickTime = 0;
        let clickCount = 0;
        statsBox.addEventListener('click', (e) => {
            e.stopPropagation();
            const now = Date.now();
            if (now - lastClickTime < DOUBLE_CLICK_DELAY) {
                clickCount++;
                if (clickCount === 2) {
                    toggleFrequencyDisplay();
                    clickCount = 0;
                }
            } else {
                clickCount = 1;
                setTimeout(() => {
                    if (clickCount === 1) {
                        toggleSpamExpireTime();
                    }
                    clickCount = 0;
                }, DOUBLE_CLICK_DELAY);
            }
            lastClickTime = now;
        });
    }
    if (!statsUpdaterInterval) {
        statsUpdaterInterval = setInterval(() => {
            if (frequencyEnabled && frequencyDisplay) {
                const now = Date.now();
                recentMessages = recentMessages.filter(time => now - time < 60000);
                const count = recentMessages.length;
                const rate = Math.round(count);
                frequencyDisplay.textContent = `msgs/min: ${rate}`;
            }
            if (spamStatsDisplay) {
                const intervalLabels = ['10m', '20m', '30m', '40m', '50m', '60m', 'All'];
                const label = intervalLabels[spamExpireTimeIndex];
                spamStatsDisplay.textContent = `spam/${label}: ${spamCache.size}`;
            }
        }, STATS_UPDATE_INTERVAL);
    }
}
function toggleFrequencyDisplay() {
    frequencyEnabled = !frequencyEnabled;
    featureSettings.frequencyEnabled = frequencyEnabled;
    localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
    if (frequencyEnabled) {
        if (!statsBox) {
            ensureStatsDisplay();
        }
        frequencyDisplay.textContent = 'msgs/min: 0';
        recentMessages = [];
    } else {
        if (statsBox) {
            frequencyDisplay.textContent = 'msgs';
        }
        if (!spamStatsDisplay || !frequencyEnabled) {
            if (statsUpdaterInterval) {
                clearInterval(statsUpdaterInterval);
                statsUpdaterInterval = null;
            }
        }
    }
}
function toggleSpamExpireTime() {
  const intervals = [600000, 1200000, 1800000, 2400000, 3000000, 3600000, Infinity];
  const intervalLabels = ['10m', '20m', '30m', '40m', '50m', '60m', 'All'];
  spamExpireTimeIndex = (spamExpireTimeIndex + 1) % intervals.length;
  featureSettings.spamExpireTimeIndex = spamExpireTimeIndex;
  spamExpireTime = intervals[spamExpireTimeIndex];
  localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
  if (spamStatsDisplay) {
    const label = intervalLabels[spamExpireTimeIndex];
    spamStatsDisplay.textContent = `spam/${label}: ${spamCache.size}`;
  }
}
function createControlPanel() {
    const panel = document.createElement('div');
    panel.className = 'ytcm-control-panel';
    const mainButtons = document.createElement('div');
    mainButtons.className = 'ytcm-main-buttons';
    const buttons = [
      {
        text: '臨',
        className: `ytcm-control-btn ${featureSettings.ephemeralMode ? 'active' : 'inactive'}`,
        title: LANG[currentLang].tooltips.ephemeral,
        onClick: () => handleButtonClick('臨', () => {
          featureSettings.ephemeralMode = !featureSettings.ephemeralMode;
          const btn = document.querySelector(`.ytcm-control-btn[data-action="臨"]`);
          if (btn) btn.className = `ytcm-control-btn ${featureSettings.ephemeralMode ? 'active' : 'inactive'}`;
          localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
        })
      },
      {
        text: '頂',
        className: `ytcm-control-btn ${featureSettings.pinEnabled ? 'inactive' : 'active'}`,
        title: LANG[currentLang].tooltips.pin,
        onClick: () => handleButtonClick('頂', () => {
          featureSettings.pinEnabled = !featureSettings.pinEnabled;
          const btn = document.querySelector(`.ytcm-control-btn[data-action="頂"]`);
          if (btn) btn.className = `ytcm-control-btn ${featureSettings.pinEnabled ? 'inactive' : 'active'}`;
          localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
          if (!featureSettings.pinEnabled) {
            const pinnedMessage = document.querySelector('yt-live-chat-banner-renderer');
            if (pinnedMessage) pinnedMessage.style.display = '';
          }
        })
      },
      {
        text: '亮',
        className: `ytcm-control-btn ${featureSettings.highlightEnabled ? 'active' : 'inactive'}`,
        title: LANG[currentLang].tooltips.highlight(
          featureSettings.defaultMode === HIGHLIGHT_MODES.BOTH ? (currentLang === 'zh-TW' ? "全部高亮" : "Both") :
          featureSettings.defaultMode === HIGHLIGHT_MODES.NAME_ONLY ? (currentLang === 'zh-TW' ? "僅暱稱" : "Name Only") :
          (currentLang === 'zh-TW' ? "僅對話" : "Message Only")
        ),
        onClick: () => handleButtonClick(
          '亮',
          () => {
            featureSettings.highlightEnabled = !featureSettings.highlightEnabled;
            const btn = document.querySelector(`.ytcm-control-btn[data-action="亮"]`);
            if (btn) btn.className = `ytcm-control-btn ${featureSettings.highlightEnabled ? 'active' : 'inactive'}`;
            if (btn) {
                btn.title = LANG[currentLang].tooltips.highlight(
                  featureSettings.defaultMode === HIGHLIGHT_MODES.BOTH ? (currentLang === 'zh-TW' ? "全部高亮" : "Both") :
                  featureSettings.defaultMode === HIGHLIGHT_MODES.NAME_ONLY ? (currentLang === 'zh-TW' ? "僅暱稱" : "Name Only") :
                  (currentLang === 'zh-TW' ? "僅對話" : "Message Only")
                );
            }
            localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
          },
          () => {
            featureSettings.defaultMode = (featureSettings.defaultMode + 1) % 3;
            const btn = document.querySelector(`.ytcm-control-btn[data-action="亮"]`);
            if (btn) {
                btn.title = LANG[currentLang].tooltips.highlight(
                  featureSettings.defaultMode === HIGHLIGHT_MODES.BOTH ? (currentLang === 'zh-TW' ? "全部高亮" : "Both") :
                  featureSettings.defaultMode === HIGHLIGHT_MODES.NAME_ONLY ? (currentLang === 'zh-TW' ? "僅暱稱" : "Name Only") :
                  (currentLang === 'zh-TW' ? "僅對話" : "Message Only")
                );
            }
            localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
          }
        )
      },
      {
        text: '封',
        className: `ytcm-control-btn ${featureSettings.blockEnabled ? 'active' : 'inactive'}`,
        title: LANG[currentLang].tooltips.block(
          featureSettings.blockMode === BLOCK_MODES.MARK
            ? (currentLang === 'zh-TW' ? '標記' : 'Mark')
            : (currentLang === 'zh-TW' ? '清除' : 'Clear')
        ),
        onClick: () => handleButtonClick(
          '封',
          () => {
            const wasEnabled = featureSettings.blockEnabled;
            const wasHideMode = featureSettings.blockMode === BLOCK_MODES.HIDE;
            featureSettings.blockEnabled = !featureSettings.blockEnabled;
            const btn = document.querySelector(`.ytcm-control-btn[data-action="封"]`);
            if (btn) btn.className = `ytcm-control-btn ${featureSettings.blockEnabled ? 'active' : 'inactive'}`;
            if (btn) {
                btn.title = LANG[currentLang].tooltips.block(
                  featureSettings.blockMode === BLOCK_MODES.MARK
                    ? (currentLang === 'zh-TW' ? '標記' : 'Mark')
                    : (currentLang === 'zh-TW' ? '清除' : 'Clear')
                );
            }
            localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
            if (wasEnabled && !featureSettings.blockEnabled) {
                if (wasHideMode) {
                    document.querySelectorAll('[data-blocked="true"][data-block-mode="hide"]').forEach(msg => {
                        msg.style.display = '';
                        msg.setAttribute('data-block-mode', 'mark');
                    });
                }
                updateAllMessages();
            } else if (!wasEnabled && featureSettings.blockEnabled) {
                updateAllMessages();
            }
          },
          () => {
            const oldMode = featureSettings.blockMode;
            featureSettings.blockMode = (featureSettings.blockMode + 1) % 2;
            const btn = document.querySelector(`.ytcm-control-btn[data-action="封"]`);
            if (btn) {
                btn.title = LANG[currentLang].tooltips.block(
                  featureSettings.blockMode === BLOCK_MODES.MARK
                    ? (currentLang === 'zh-TW' ? '標記' : 'Mark')
                    : (currentLang === 'zh-TW' ? '清除' : 'Clear')
                );
            }
            localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
            if (featureSettings.blockEnabled) {
                if (oldMode === BLOCK_MODES.MARK && featureSettings.blockMode === BLOCK_MODES.HIDE) {
                    document.querySelectorAll('[data-blocked="true"][data-block-mode="mark"]').forEach(msg => {
                        msg.setAttribute('data-block-mode', 'hide');
                    });
                } else if (oldMode === BLOCK_MODES.HIDE && featureSettings.blockMode === BLOCK_MODES.MARK) {
                    document.querySelectorAll('[data-blocked="true"][data-block-mode="hide"]').forEach(msg => {
                        msg.setAttribute('data-block-mode', 'mark');
                    });
                }
                updateAllMessages();
            }
          }
        )
      },
      {
        text: '@',
        className: `ytcm-control-btn ${featureSettings.calloutHighlightEnabled ? 'active' : 'inactive'}`,
        title: LANG[currentLang].tooltips.callout(
          featureSettings.calloutMode === HIGHLIGHT_MODES.BOTH ? (currentLang === 'zh-TW' ? "全部高亮" : "Both") :
          featureSettings.calloutMode === HIGHLIGHT_MODES.NAME_ONLY ? (currentLang === 'zh-TW' ? "僅暱稱" : "Name Only") :
          (currentLang === 'zh-TW' ? "僅對話" : "Message Only")
        ),
        onClick: () => handleButtonClick(
          '@',
          () => {
            featureSettings.calloutHighlightEnabled = !featureSettings.calloutHighlightEnabled;
            const btn = document.querySelector(`.ytcm-control-btn[data-action="@"]`);
            if (btn) btn.className = `ytcm-control-btn ${featureSettings.calloutHighlightEnabled ? 'active' : 'inactive'}`;
            if (btn) {
                btn.title = LANG[currentLang].tooltips.callout(
                  featureSettings.calloutMode === HIGHLIGHT_MODES.BOTH ? (currentLang === 'zh-TW' ? "全部高亮" : "Both") :
                  featureSettings.calloutMode === HIGHLIGHT_MODES.NAME_ONLY ? (currentLang === 'zh-TW' ? "僅暱稱" : "Name Only") :
                  (currentLang === 'zh-TW' ? "僅對話" : "Message Only")
                );
            }
            localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
            if (!featureSettings.calloutHighlightEnabled) {
              calloutUserCache.clear();
            }
          },
          () => {
            const oldMode = featureSettings.calloutMode;
            featureSettings.calloutMode = (featureSettings.calloutMode + 1) % 3;
            const btn = document.querySelector(`.ytcm-control-btn[data-action="@"]`);
            if (btn) {
                btn.title = LANG[currentLang].tooltips.callout(
                  featureSettings.calloutMode === HIGHLIGHT_MODES.BOTH ? (currentLang === 'zh-TW' ? "全部高亮" : "Both") :
                  featureSettings.calloutMode === HIGHLIGHT_MODES.NAME_ONLY ? (currentLang === 'zh-TW' ? "僅暱稱" : "Name Only") :
                  (currentLang === 'zh-TW' ? "僅對話" : "Message Only")
                );
            }
            localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
            if (featureSettings.calloutHighlightEnabled) {
                if (oldMode === HIGHLIGHT_MODES.BOTH && featureSettings.calloutMode === HIGHLIGHT_MODES.NAME_ONLY) {
                    document.querySelectorAll('[data-callout-highlight="both"]').forEach(msg => {
                        msg.setAttribute('data-callout-highlight', 'name');
                        msg.setAttribute('data-highlight', 'name');
                    });
                    document.querySelectorAll('[data-callout-highlight="message"]').forEach(msg => {
                        msg.setAttribute('data-callout-highlight', 'name');
                        msg.setAttribute('data-highlight', 'name');
                    });
                } else if (oldMode === HIGHLIGHT_MODES.NAME_ONLY && featureSettings.calloutMode === HIGHLIGHT_MODES.MESSAGE_ONLY) {
                    document.querySelectorAll('[data-callout-highlight="both"]').forEach(msg => {
                        msg.setAttribute('data-callout-highlight', 'message');
                        msg.setAttribute('data-highlight', 'message');
                    });
                    document.querySelectorAll('[data-callout-highlight="name"]').forEach(msg => {
                        msg.setAttribute('data-callout-highlight', 'message');
                        msg.setAttribute('data-highlight', 'message');
                    });
                } else if (oldMode === HIGHLIGHT_MODES.MESSAGE_ONLY && featureSettings.calloutMode === HIGHLIGHT_MODES.BOTH) {
                    document.querySelectorAll('[data-callout-highlight="name"]').forEach(msg => {
                        msg.setAttribute('data-callout-highlight', 'both');
                        msg.setAttribute('data-highlight', 'both');
                    });
                    document.querySelectorAll('[data-callout-highlight="message"]').forEach(msg => {
                        msg.setAttribute('data-callout-highlight', 'both');
                        msg.setAttribute('data-highlight', 'both');
                    });
                }
                updateAllMessages();
            }
          }
        )
      },
      {
        text: '洗',
        className: `ytcm-control-btn ${featureSettings.spamFilterEnabled ? 'active' : 'inactive'}`,
        title: LANG[currentLang].tooltips.spam(
          featureSettings.spamMode === SPAM_MODES.MARK
            ? (currentLang === 'zh-TW' ? '標記' : 'Mark')
            : (currentLang === 'zh-TW' ? '清除' : 'Clear')
        ),
        onClick: () => handleButtonClick(
          '洗',
          () => {
            const wasEnabled = featureSettings.spamFilterEnabled;
            const wasHideMode = featureSettings.spamMode === SPAM_MODES.REMOVE;
            featureSettings.spamFilterEnabled = !featureSettings.spamFilterEnabled;
            const btn = document.querySelector(`.ytcm-control-btn[data-action="洗"]`);
            if (btn) btn.className = `ytcm-control-btn ${featureSettings.spamFilterEnabled ? 'active' : 'inactive'}`;
            if (btn) {
                btn.title = LANG[currentLang].tooltips.spam(
                  featureSettings.spamMode === SPAM_MODES.MARK
                    ? (currentLang === 'zh-TW' ? '標記' : 'Mark')
                    : (currentLang === 'zh-TW' ? '清除' : 'Clear')
                );
            }
            localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
            if (wasEnabled && !featureSettings.spamFilterEnabled) {
                if (wasHideMode) {
                    document.querySelectorAll('[data-spam="true"]').forEach(msg => {
                        msg.removeAttribute('data-spam');
                    });
                } else {
                    document.querySelectorAll('[data-spam="true"]').forEach(msg => {
                        msg.removeAttribute('data-spam');
                    });
                }
                updateAllMessages();
            } else if (!wasEnabled && featureSettings.spamFilterEnabled) {
                updateAllMessages();
            }
          },
          () => {
            const oldMode = featureSettings.spamMode;
            featureSettings.spamMode = (featureSettings.spamMode + 1) % 2;
            const btn = document.querySelector(`.ytcm-control-btn[data-action="洗"]`);
            if (btn) {
                btn.title = LANG[currentLang].tooltips.spam(
                  featureSettings.spamMode === SPAM_MODES.MARK
                    ? (currentLang === 'zh-TW' ? '標記' : 'Mark')
                    : (currentLang === 'zh-TW' ? '清除' : 'Clear')
                );
            }
            localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
            if (featureSettings.spamFilterEnabled) {
                if (oldMode === SPAM_MODES.MARK && featureSettings.spamMode === SPAM_MODES.REMOVE) {
                    document.querySelectorAll('[data-spam="true"].spam-marked').forEach(msg => {
                        msg.classList.remove('spam-marked');
                        msg.setAttribute('data-spam', 'true');
                    });
                } else if (oldMode === SPAM_MODES.REMOVE && featureSettings.spamMode === SPAM_MODES.MARK) {
                    document.querySelectorAll('[data-spam="true"]').forEach(msg => {
                        msg.classList.add('spam-marked');
                        msg.setAttribute('data-spam', 'true');
                    });
                }
                updateAllMessages();
            }
          }
        )
      },
      {
        text: '數',
        className: `ytcm-control-btn ${featureSettings.counterEnabled ? 'active' : 'inactive'}`,
        title: LANG[currentLang].tooltips.counter,
        onClick: () => handleButtonClick('數', () => {
          featureSettings.counterEnabled = !featureSettings.counterEnabled;
          const btn = document.querySelector(`.ytcm-control-btn[data-action="數"]`);
          if (btn) btn.className = `ytcm-control-btn ${featureSettings.counterEnabled ? 'active' : 'inactive'}`;
          localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
          if (!featureSettings.counterEnabled) {
            document.querySelectorAll('.ytcm-message-count').forEach(el => el.remove());
          } else {
            updateAllMessages();
          }
        })
      }
    ];
    buttons.forEach(btn => {
        const button = document.createElement('div');
        button.className = btn.className;
        button.textContent = btn.text;
        button.title = btn.title;
        button.dataset.action = btn.text;
        button.addEventListener('click', btn.onClick);
        mainButtons.appendChild(button);
    });
    const toggleBtn = document.createElement('div');
    toggleBtn.className = 'ytcm-toggle-btn';
    toggleBtn.textContent = '☑';
    toggleBtn.title = currentLang === 'zh-TW' ? '顯示/隱藏控制按鈕' : 'Show/Hide Controls';
    toggleBtn.addEventListener('click', () => {
        featureSettings.buttonsVisible = !featureSettings.buttonsVisible;
        mainButtons.style.display = featureSettings.buttonsVisible ? 'flex' : 'none';
        localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
    });
    panel.appendChild(mainButtons);
    panel.appendChild(toggleBtn);
    document.body.appendChild(panel);
    return panel;
}
function handleButtonClick(btnText, toggleAction, modeAction) {
    const now = Date.now();
    if (now - lastClickTime < DOUBLE_CLICK_DELAY) {
        clickCount++;
        if (clickCount === 2 && modeAction) {
            modeAction();
            clickCount = 0;
        }
    } else {
        clickCount = 1;
        setTimeout(() => {
            if (clickCount === 1) toggleAction();
            clickCount = 0;
        }, DOUBLE_CLICK_DELAY);
    }
    lastClickTime = now;
}
function cleanupProcessedMessages() {
    const allMessages = new Set(document.querySelectorAll('yt-live-chat-text-message-renderer, .super-fast-chat-message'));
    const toDelete = [];
    processedMessages.forEach((_, msg) => {
        if (!allMessages.has(msg)) {
            toDelete.push(msg);
        }
    });
    toDelete.forEach(msg => {
        processedMessages.delete(msg);
        styleCache.delete(msg);
    });
}
function processCalloutUsers(messageText, authorName, authorColor) {
    if (!featureSettings.calloutHighlightEnabled || !authorColor) return;
    const mentionRegex = /@([^\s].*?(?=\s|$|@|[\u200b]))/g;
    let match;
    const mentionedUsers = new Set();
    while ((match = mentionRegex.exec(messageText)) !== null) {
        const mentionedUser = match[1].trim();
        if (mentionedUser) {
            mentionedUsers.add(mentionedUser);
        }
    }
    if (mentionedUsers.size !== 1) return;
    const mentionedUser = Array.from(mentionedUsers)[0];
    const allUsers = Array.from(document.querySelectorAll('#author-name, .author-name'));
    const existingUsers = allUsers.map(el => normalizeUserName(el.textContent.trim()));
    const cleanMentionedUser = normalizeUserName(mentionedUser);
    const isExistingUser = existingUsers.some(user => user.toLowerCase() === cleanMentionedUser.toLowerCase());
    if (isExistingUser && !userColorCache.has(cleanMentionedUser) && !calloutUserCache.has(cleanMentionedUser)) {
        calloutUserCache.set(cleanMentionedUser, {
            color: authorColor,
            expireTime: Date.now() + CALLOUT_USER_EXPIRE_TIME,
            highlightMode: featureSettings.calloutMode
        });
        updateAllMessages(cleanMentionedUser);
    }
}
function closeMenu() {
    if (currentMenu) {
        document.body.removeChild(currentMenu);
        currentMenu = null;
    }
}
function createColorMenu(targetElement, event) {
    closeMenu();
    const menu = document.createElement('div');
    menu.className = 'ytcm-menu';
    menu.style.top = `${event.clientY}px`;
    menu.style.left = `${event.clientX}px`;
    menu.style.width = '220px';
    const colorGrid = document.createElement('div');
    colorGrid.className = 'ytcm-grid';
    Object.entries(COLOR_OPTIONS).forEach(([colorName, colorValue]) => {
        const colorItem = document.createElement('div');
        colorItem.className = 'ytcm-color-item';
        colorItem.title = colorName;
        colorItem.style.backgroundColor = colorValue;
        colorItem.addEventListener('click', () => {
            const userName = normalizeUserName(targetElement.name);
            if (targetElement.type === 'user') {
                userColorSettings[userName] = colorValue;
                userColorCache.set(userName, colorValue);
                updateAllMessages(userName);
                localStorage.setItem(STORAGE_KEYS.USER_COLOR_SETTINGS, JSON.stringify(userColorSettings));
            }
            else if (targetElement.type === 'temp') {
                if (featureSettings.ephemeralMode) {
                    ephemeralUsers[userName] = Date.now() + EPHEMERAL_USER_DURATION;
                    calloutUserCache.set(userName, {
                        color: colorValue,
                        expireTime: Date.now() + EPHEMERAL_USER_DURATION,
                        highlightMode: featureSettings.defaultMode
                    });
                    updateAllMessages(userName);
                } else {
                    calloutUserCache.set(userName, {
                        color: colorValue,
                        expireTime: Date.now() + CALLOUT_USER_EXPIRE_TIME,
                        highlightMode: HIGHLIGHT_MODES.BOTH
                    });
                    updateAllMessages(userName);
                }
            }
            closeMenu();
        });
        colorGrid.appendChild(colorItem);
    });
    const buttonRow = document.createElement('div');
    buttonRow.className = 'ytcm-button-row';
    const buttons = [
        {
            text: LANG[currentLang].buttons.封鎖,
            className: 'ytcm-button',
            onClick: () => {
                const userName = normalizeUserName(targetElement.name);
                if (targetElement.type === 'user') {
                    blockedUsers.push(userName);
                    blockedUsersSet.add(userName);
                    localStorage.setItem(STORAGE_KEYS.BLOCKED_USERS, JSON.stringify(blockedUsers));
                    updateAllMessages(userName);
                } else if (targetElement.type === 'temp' && featureSettings.ephemeralMode) {
                    ephemeralBlockedUsers.add(userName);
                    updateAllMessages(userName);
                }
                closeMenu();
            }
        },
        {
            text: LANG[currentLang].buttons.編輯,
            className: 'ytcm-button',
            onClick: (e) => {
                e.stopPropagation();
                createEditMenu(targetElement, event);
            }
        },
        {
            text: LANG[currentLang].buttons.刪除,
            className: 'ytcm-button',
            onClick: () => {
                const userName = normalizeUserName(targetElement.name);
                let foundInList = false;
                if (userColorSettings[userName]) {
                    delete userColorSettings[userName];
                    userColorCache.delete(userName);
                    foundInList = true;
                }
                if (blockedUsersSet.has(userName)) {
                    blockedUsers = blockedUsers.filter(u => normalizeUserName(u) !== userName);
                    blockedUsersSet.delete(userName);
                    localStorage.setItem(STORAGE_KEYS.BLOCKED_USERS, JSON.stringify(blockedUsers));
                    foundInList = true;
                }
                if (calloutUserCache.has(userName)) {
                    calloutUserCache.delete(userName);
                    foundInList = true;
                }
                if (ephemeralUsers[userName]) {
                    delete ephemeralUsers[userName];
                    foundInList = true;
                }
                if (ephemeralBlockedUsers.has(userName)) {
                    ephemeralBlockedUsers.delete(userName);
                    foundInList = true;
                }
                localStorage.setItem(STORAGE_KEYS.USER_COLOR_SETTINGS, JSON.stringify(userColorSettings));
                const messages = Array.from(document.querySelectorAll('yt-live-chat-text-message-renderer, .super-fast-chat-message')).filter(msg => {
                    const nameElement = msg.querySelector('#author-name') || msg.querySelector('.author-name');
                    return nameElement && normalizeUserName(nameElement.textContent.trim()) === userName;
                });
                messages.forEach(msg => {
                    if (foundInList) {
                        msg.removeAttribute('data-highlight');
                        msg.removeAttribute('data-ephemeral');
                        msg.removeAttribute('data-blocked');
                        msg.removeAttribute('data-spam');
                        msg.classList.remove('spam-marked');
                        msg.style.removeProperty('--highlight-color');
                        msg.style.removeProperty('--ephemeral-color');
                        msg.querySelector('.ytcm-message-count')?.remove();
                    } else {
                        msg.style.display = 'none';
                    }
                });
                closeMenu();
            }
        },
        {
            text: LANG[currentLang].buttons.清除,
            className: 'ytcm-button',
            onClick: () => {
                const confirmMenu = document.createElement('div');
                confirmMenu.className = 'ytcm-menu';
                confirmMenu.style.top = `${event.clientY}px`;
                confirmMenu.style.left = `${event.clientX}px`;
                const confirmText = document.createElement('div');
                confirmText.textContent = LANG[currentLang].tooltips.clearConfirm;
                const confirmButton = document.createElement('button');
                confirmButton.className = 'ytcm-button';
                confirmButton.textContent = LANG[currentLang].tooltips.clearButton;
                confirmButton.addEventListener('click', () => {
                    localStorage.removeItem(STORAGE_KEYS.USER_COLOR_SETTINGS);
                    localStorage.removeItem(STORAGE_KEYS.BLOCKED_USERS);
                    localStorage.removeItem(STORAGE_KEYS.FEATURE_SETTINGS);
                    window.location.reload();
                });
                confirmMenu.appendChild(confirmText);
                confirmMenu.appendChild(confirmButton);
                document.body.appendChild(confirmMenu);
                setTimeout(() => {
                    if (document.body.contains(confirmMenu)) document.body.removeChild(confirmMenu);
                }, 5000);
            }
        }
    ];
    buttons.forEach(btn => {
        const button = document.createElement('button');
        button.className = btn.className;
        button.textContent = btn.text;
        button.addEventListener('click', btn.onClick);
        buttonRow.appendChild(button);
    });
    menu.appendChild(colorGrid);
    menu.appendChild(buttonRow);
    document.body.appendChild(menu);
    currentMenu = menu;
    const menuRect = menu.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    let adjustedTop = parseFloat(menu.style.top);
    if (menuRect.bottom > viewportHeight) {
        adjustedTop = adjustedTop - (menuRect.bottom - viewportHeight) - 10;
    }
    if (adjustedTop < 0) {
        adjustedTop = 10;
    }
    menu.style.top = `${adjustedTop}px`;
}
function createEditMenu(targetElement, event) {
    closeMenu();
    const menu = document.createElement('div');
    menu.className = 'ytcm-menu';
    menu.style.top = '10px';
    menu.style.left = '10px';
    menu.style.width = '90%';
    menu.style.maxHeight = '80vh';
    menu.style.overflowY = 'auto';
    const buttonRow = document.createElement('div');
    buttonRow.className = 'ytcm-button-row';
    const closeButton = document.createElement('button');
    closeButton.className = 'ytcm-button';
    closeButton.textContent = currentLang === 'zh-TW' ? '關閉' : 'Close';
    closeButton.style.width = 'auto';
    closeButton.style.marginBottom = '10px';
    closeButton.addEventListener('click', closeMenu);
    const exportButton = document.createElement('button');
    exportButton.className = 'ytcm-button';
    exportButton.textContent = currentLang === 'zh-TW' ? '匯出設定' : 'Export';
    exportButton.style.width = 'auto';
    exportButton.style.marginBottom = '10px';
    exportButton.addEventListener('click', () => {
        const data = {
            userColorSettings,
            blockedUsers
        };
        const blob = new Blob([JSON.stringify(data)], {type: 'application/json'});
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'yt_chat_settings.json';
        a.click();
        URL.revokeObjectURL(url);
    });
    const importButton = document.createElement('input');
    importButton.type = 'file';
    importButton.className = 'ytcm-button';
    importButton.accept = '.json';
    importButton.style.width = 'auto';
    importButton.style.marginBottom = '10px';
    importButton.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                const newUserColorSettings = {};
                for (const [key, value] of Object.entries(data.userColorSettings)) {
                    newUserColorSettings[normalizeUserName(key)] = value;
                }
                const newBlockedUsers = data.blockedUsers.map(normalizeUserName);
                localStorage.setItem(STORAGE_KEYS.USER_COLOR_SETTINGS, JSON.stringify(newUserColorSettings));
                localStorage.setItem(STORAGE_KEYS.BLOCKED_USERS, JSON.stringify(newBlockedUsers));
                localStorage.setItem(STORAGE_KEYS.FEATURE_SETTINGS, JSON.stringify(featureSettings));
                userColorSettings = newUserColorSettings;
                blockedUsers = newBlockedUsers;
                userColorCache.clear();
                Object.entries(userColorSettings).forEach(([user, color]) => userColorCache.set(user, color));
                blockedUsersSet.clear();
                blockedUsers.forEach(user => blockedUsersSet.add(user));
                updateAllMessages();
            } catch (err) {
                alert(currentLang === 'zh-TW' ? '檔案格式錯誤' : 'Invalid file format');
            }
        };
        reader.readAsText(file);
    });
    buttonRow.appendChild(closeButton);
    buttonRow.appendChild(exportButton);
    buttonRow.appendChild(importButton);
    menu.appendChild(buttonRow);
    const importExportRow = document.createElement('div');
    importExportRow.className = 'ytcm-button-row';
    const blockedUserList = document.createElement('div');
    blockedUserList.textContent = currentLang === 'zh-TW' ? '封鎖用戶名單：' : 'Blocked Users:';
    blockedUserList.className = 'ytcm-flex-wrap';
    blockedUsers.forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'ytcm-list-item';
        userItem.textContent = user;
        userItem.addEventListener('click', () => {
            blockedUsers = blockedUsers.filter(u => normalizeUserName(u) !== user);
            blockedUsersSet.delete(user);
            localStorage.setItem(STORAGE_KEYS.BLOCKED_USERS, JSON.stringify(blockedUsers));
            userItem.remove();
            updateAllMessages(user);
        });
        blockedUserList.appendChild(userItem);
    });
    menu.appendChild(blockedUserList);
    const coloredUserList = document.createElement('div');
    coloredUserList.textContent = currentLang === 'zh-TW' ? '被上色用戶名單：' : 'Colored Users:';
    coloredUserList.className = 'ytcm-flex-wrap';
    Object.keys(userColorSettings).forEach(user => {
        const userItem = document.createElement('div');
        userItem.className = 'ytcm-list-item';
        userItem.textContent = user;
        userItem.addEventListener('click', () => {
            delete userColorSettings[user];
            userColorCache.delete(user);
            localStorage.setItem(STORAGE_KEYS.USER_COLOR_SETTINGS, JSON.stringify(userColorSettings));
            userItem.remove();
            updateAllMessages(user);
        });
        coloredUserList.appendChild(userItem);
    });
    menu.appendChild(coloredUserList);
    document.body.appendChild(menu);
    currentMenu = menu;
}
function updateMessageCounter(msg) {
  if (!featureSettings.counterEnabled) return;
  const nameElement = msg.querySelector('#author-name') || msg.querySelector('.author-name');
  if (!nameElement) return;
  const userName = normalizeUserName(nameElement.textContent.trim());
  if (!userMessageCounts[userName]) userMessageCounts[userName] = 0;
  userMessageCounts[userName]++;
  const existingCounter = msg.querySelector('.ytcm-message-count');
  if (existingCounter) existingCounter.remove();
  const counterSpan = document.createElement('span');
  counterSpan.className = 'ytcm-message-count';
  counterSpan.textContent = userMessageCounts[userName];
  const messageElement = msg.querySelector('#message') || msg.querySelector('.message-text');
  if (messageElement) messageElement.appendChild(counterSpan);
}
function processMessage(msg, isInitialLoad = false) {
  if (styleCache.has(msg)) return;
  const authorNameElement = msg.querySelector('#author-name') || msg.querySelector('.author-name');
  const messageElement = msg.querySelector('#message') || msg.querySelector('.message-text');
  if (!authorNameElement || !messageElement) return;
  const userName = normalizeUserName(authorNameElement.textContent.trim());
  if (!isInitialLoad && featureSettings.spamFilterEnabled) {
    const isSpam = checkForSpam(msg, userName, messageElement);
    if (!isSpam) {
      msg.removeAttribute('data-spam');
      msg.classList.remove('spam-marked');
    }
  }
  const isPermanentlyBlocked = blockedUsersSet.has(userName);
  const isEphemeralBlocked = ephemeralBlockedUsers.has(userName);
  if (featureSettings.blockEnabled && (isPermanentlyBlocked || isEphemeralBlocked)) {
    msg.setAttribute('data-blocked', 'true');
    msg.setAttribute('data-block-mode', featureSettings.blockMode === BLOCK_MODES.MARK ? 'mark' : 'hide');
  }
  msg.removeAttribute('data-highlight');
  msg.removeAttribute('data-ephemeral');
  if (featureSettings.ephemeralMode && ephemeralUsers[userName]) {
    msg.setAttribute('data-ephemeral', 'true');
    if (calloutUserCache.has(userName)) {
        const tempData = calloutUserCache.get(userName);
        msg.style.setProperty('--highlight-color', tempData.color);
        msg.style.setProperty('--ephemeral-color', tempData.color);
        const mode = tempData.highlightMode;
        msg.setAttribute('data-highlight',
            mode === HIGHLIGHT_MODES.BOTH ? 'both'
            : mode === HIGHLIGHT_MODES.NAME_ONLY ? 'name'
            : 'message');
    } else {
        const color = userColorCache.get(userName) || COLOR_OPTIONS.紅色;
        msg.style.setProperty('--highlight-color', color);
        msg.style.setProperty('--ephemeral-color', color);
        msg.setAttribute('data-highlight', 'both');
    }
  } else if (featureSettings.highlightEnabled && (calloutUserCache.has(userName) || userColorCache.get(userName))) {
    const color = calloutUserCache.has(userName)
      ? calloutUserCache.get(userName).color
      : userColorCache.get(userName);
    const mode = calloutUserCache.has(userName)
      ? calloutUserCache.get(userName).highlightMode || featureSettings.defaultMode
      : featureSettings.defaultMode;
    msg.style.setProperty('--highlight-color', color);
    if (mode !== HIGHLIGHT_MODES.BOTH &&
        mode !== HIGHLIGHT_MODES.NAME_ONLY &&
        mode !== HIGHLIGHT_MODES.MESSAGE_ONLY) return;
    msg.setAttribute('data-highlight',
      mode === HIGHLIGHT_MODES.BOTH ? 'both'
      : mode === HIGHLIGHT_MODES.NAME_ONLY ? 'name'
      : 'message');
  }
  updateMessageCounter(msg);
  if (featureSettings.calloutHighlightEnabled) {
    const textNodes = Array.from(messageElement.childNodes)
      .filter(node => node.nodeType === Node.TEXT_NODE && !node.parentElement.classList.contains('emoji'));
    const messageText = textNodes
      .map(node => node.textContent.trim())
      .join(' ');
    processCalloutUsers(
      messageText,
      userName,
      calloutUserCache.has(userName) ? calloutUserCache.get(userName).color : userColorCache.get(userName)
    );
  }
  if (frequencyEnabled && !isInitialLoad) {
    recentMessages.push(Date.now());
  }
  styleCache.set(msg, true);
}
function checkForSpam(msg, userName, messageElement) {
  if (!featureSettings.spamFilterEnabled) return false;
  if (!userName || !messageElement) return false;
  const textNodes = Array.from(messageElement.childNodes)
    .filter(node => node.nodeType === Node.TEXT_NODE);
  let messageText = textNodes
    .map(node => node.textContent)
    .join(' ')
    .trim();
  if (!messageText) return false;
  messageText = messageText
    .replace(/\p{Extended_Pictographic}/gu, '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  if (!messageText) return false;
  const spamKey = `${userName}:${messageText}`;
  const now = Date.now();
  if (spamExpireTime === Infinity) {
      if (!spamCache.has(spamKey)) {
          spamCache.set(spamKey, now);
          currentSpamCount = spamCache.size;
          return false;
      }
      if (featureSettings.spamMode === SPAM_MODES.MARK) {
          msg.setAttribute('data-spam', 'true');
          msg.classList.add('spam-marked');
          if (featureSettings.blockMode === BLOCK_MODES.HIDE) {
              msg.setAttribute('data-block-mode', 'hide');
          }
      } else {
          msg.setAttribute('data-spam', 'true');
      }
      return true;
  }
  const expireThreshold = now - spamExpireTime;
  let foundInTimeWindow = false;
  for (const [key, ts] of spamCache.entries()) {
      if (key === spamKey && ts > expireThreshold) {
          foundInTimeWindow = true;
          break;
      }
  }
  if (foundInTimeWindow) {
      if (featureSettings.spamMode === SPAM_MODES.MARK) {
        msg.setAttribute('data-spam', 'true');
        msg.classList.add('spam-marked');
        if (featureSettings.blockMode === BLOCK_MODES.HIDE) {
            msg.setAttribute('data-block-mode', 'hide');
        }
      } else {
        msg.setAttribute('data-spam', 'true');
      }
      return true;
  } else {
    spamCache.set(spamKey, now);
    currentSpamCount++;
  }
  return false;
}
function highlightMessages(mutations) {
  cleanupProcessedMessages();
  const messages = [];
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.nodeType === 1 &&
          (node.matches('yt-live-chat-text-message-renderer') || node.matches('.super-fast-chat-message')) &&
          !processedMessages.has(node)) {
        messages.push(node);
        processedMessages.set(node, true);
      }
    });
  });
  if (messages.length === 0) {
    const allMessages = Array.from(document.querySelectorAll('yt-live-chat-text-message-renderer, .super-fast-chat-message'))
      .slice(-MAX_MESSAGE_CACHE_SIZE);
    allMessages.forEach(msg => {
      if (!processedMessages.has(msg)) {
        messages.push(msg);
        processedMessages.set(msg, true);
      }
    });
  }
  requestAnimationFrame(() => {
    messages.forEach(msg => processMessage(msg));
  });
}
function handleClick(event) {
    if (event.button !== 0) return;
    const msgElement = event.target.closest('yt-live-chat-text-message-renderer, .super-fast-chat-message');
    if (!msgElement) return;
    const messageElement = msgElement.querySelector('#message') || msgElement.querySelector('.message-text');
    if (messageElement) {
        const rect = messageElement.getBoundingClientRect();
        const isRightEdge = event.clientX > rect.right - 30;
        if (isRightEdge) return;
    }
    event.stopPropagation();
    event.preventDefault();
    if (currentMenu && !currentMenu.contains(event.target)) closeMenu();
    const authorName = msgElement.querySelector('#author-name') || msgElement.querySelector('.author-name');
    const authorImg = msgElement.querySelector('#author-photo img') || msgElement.querySelector('.author-photo img');
    if (authorImg && authorImg.contains(event.target)) {
        if (event.ctrlKey) {
            const URL = authorName?.parentNode?.parentNode?.parentNode?.data?.authorExternalChannelId ||
                        authorName?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.parentNode?.data?.authorExternalChannelId;
            URL && window.open("https://www.youtube.com/channel/" + URL + "/about", "_blank");
        } else {
            if (featureSettings.ephemeralMode) {
                createColorMenu({ type: 'temp', name: authorName.textContent.trim() }, event);
            } else {
                createColorMenu({ type: 'user', name: authorName.textContent.trim() }, event);
            }
        }
    }
    if (authorName && authorName.contains(event.target)) {
        const inputField = document.querySelector('yt-live-chat-text-message-renderer #text, .super-fast-chat-message #text, yt-live-chat-text-input-field-renderer [contenteditable]');
        if (inputField) {
            setTimeout(() => {
                const userName = normalizeUserName(authorName.textContent.trim());
                const currentText = inputField.textContent || inputField.innerText || '';
                if (!currentText.includes('@' + userName)) {
                    const mentionText = `@${userName}\u2009`;
                    const range = document.createRange();
                    const selection = window.getSelection();
                    range.selectNodeContents(inputField);
                    range.collapse(false);
                    selection.removeAllRanges();
                    selection.addRange(range);
                    inputField.focus();
                    document.execCommand('insertText', false, mentionText);
                    range.setStartAfter(inputField.lastChild);
                    range.collapse(true);
                    selection.removeAllRanges();
                    selection.addRange(range);
                }
            }, 200);
        }
    }
}
function handleAuthorPhotoHover(event) {
    const imgElement = event.target;
    const msgElement = imgElement.closest('yt-live-chat-text-message-renderer, .super-fast-chat-message');
    if (!msgElement) return;
    const authorNameElement = msgElement.querySelector('#author-name') || msgElement.querySelector('.author-name');
    if (!authorNameElement) return;
    const userName = normalizeUserName(authorNameElement.textContent.trim());
    const userSpamEntries = [];
    for (const [key, originalTimestamp] of spamCache.entries()) {
        if (key.startsWith(`${userName}:`)) {
            const messageText = key.substring(userName.length + 1);
            userSpamEntries.push(messageText);
        }
    }
    if (userSpamEntries.length === 0) return;
    closeMenu();
    const tooltip = document.createElement('div');
    tooltip.className = 'ytcm-spam-tooltip';
    tooltip.style.position = 'absolute';
    tooltip.style.top = `${imgElement.getBoundingClientRect().top}px`;
    tooltip.style.left = `${imgElement.getBoundingClientRect().right + 10}px`;
    const title = document.createElement('div');
    title.textContent = `${userName}:`;
    title.style.fontWeight = 'bold';
    title.style.marginBottom = '4px';
    tooltip.appendChild(title);
    const messagesDiv = document.createElement('div');
    userSpamEntries.forEach(text => {
        const msgSpan = document.createElement('div');
        msgSpan.textContent = text;
        msgSpan.style.borderBottom = '1px solid #ccc';
        msgSpan.style.paddingBottom = '2px';
        msgSpan.style.marginBottom = '2px';
        messagesDiv.appendChild(msgSpan);
    });
    tooltip.appendChild(messagesDiv);
    let isMouseOverTooltip = false;
    let isMouseOverImg = true;
    let isMouseOverExtendedArea = false;
    let tooltipTimeoutId = null;
    const resetTooltipTimeout = () => {
        clearTimeout(tooltipTimeoutId);
        tooltipTimeoutId = setTimeout(() => {
            if (!isMouseOverTooltip && !isMouseOverImg && !isMouseOverExtendedArea) {
                if (document.body.contains(tooltip)) {
                    document.body.removeChild(tooltip);
                }
            }
        }, 100);
    };
    const handleMouseOverTooltip = () => { isMouseOverTooltip = true; };
    const handleMouseOutTooltip = () => { isMouseOverTooltip = false; resetTooltipTimeout(); };
    const handleMouseOverImg = () => { isMouseOverImg = true; };
    const handleMouseOutImg = () => {
        isMouseOverImg = false;
        resetTooltipTimeout();
    };
    const handleMouseEnterExtendedArea = () => { isMouseOverExtendedArea = true; };
    const handleMouseLeaveExtendedArea = () => {
        isMouseOverExtendedArea = false;
        resetTooltipTimeout();
    };
    const removeTooltipOnBlock = () => {
        if (document.body.contains(tooltip)) {
            document.body.removeChild(tooltip);
        }
    };
    tooltip.addEventListener('mouseenter', handleMouseOverTooltip);
    tooltip.addEventListener('mouseleave', handleMouseOutTooltip);
    imgElement.addEventListener('mouseenter', handleMouseOverImg);
    imgElement.addEventListener('mouseleave', handleMouseOutImg);
    document.addEventListener('mousemove', (e) => {
        const imgRect = imgElement.getBoundingClientRect();
        const tooltipRect = tooltip.getBoundingClientRect();
        const extendedAreaLeft = imgRect.right;
        const extendedAreaRight = tooltipRect.left;
        const extendedAreaTop = Math.min(imgRect.top, tooltipRect.top);
        const extendedAreaBottom = Math.max(imgRect.bottom, tooltipRect.bottom);
        const isWithinExtendedArea = featureSettings.ephemeralMode
            && e.clientX >= extendedAreaLeft && e.clientX <= extendedAreaRight
            && e.clientY >= extendedAreaTop && e.clientY <= extendedAreaBottom;
        if (isWithinExtendedArea) {
            if (!isMouseOverExtendedArea) {
                handleMouseEnterExtendedArea();
                document.addEventListener('mouseleave', handleMouseLeaveExtendedArea, { once: true });
            }
        } else {
            if (isMouseOverExtendedArea) {
                handleMouseLeaveExtendedArea();
            }
        }
    });
    resetTooltipTimeout();
    document.body.appendChild(tooltip);
    const _ = tooltip.offsetHeight;
    const tooltipRect = tooltip.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;
    let adjustedTop = tooltipRect.top;
    let adjustedLeft = tooltipRect.left;
    if (tooltipRect.bottom > viewportHeight) {
        adjustedTop = viewportHeight - tooltipRect.height - 10;
    }
    if (adjustedTop < 0) {
        adjustedTop = 10;
    }
    if (tooltipRect.right > viewportWidth) {
        adjustedLeft = viewportWidth - tooltipRect.width - 10;
    }
    if (adjustedLeft < 0) {
        adjustedLeft = 10;
    }
    tooltip.style.top = `${adjustedTop}px`;
    tooltip.style.left = `${adjustedLeft}px`;
    const observer = new MutationObserver(() => {
        const updatedMsgElement = imgElement.closest('yt-live-chat-text-message-renderer, .super-fast-chat-message');
        if (!updatedMsgElement || updatedMsgElement.getAttribute('data-blocked') === 'true') {
            if (document.body.contains(tooltip)) {
                document.body.removeChild(tooltip);
            }
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
}
function init() {
    document.querySelectorAll('yt-live-chat-text-message-renderer, .super-fast-chat-message').forEach(msg => {
        msg.addEventListener('click', handleClick, { capture: true });
        const authorImg = msg.querySelector('#author-photo img') || msg.querySelector('.author-photo img');
        if (authorImg) {
            authorImg.addEventListener('mouseover', handleAuthorPhotoHover);
        }
    });
    const observer = new MutationObserver(mutations => {
        highlightMessages(mutations);
        document.querySelectorAll('yt-live-chat-text-message-renderer:not([data-ytcm-handled]), .super-fast-chat-message:not([data-ytcm-handled])').forEach(msg => {
            msg.setAttribute('data-ytcm-handled', 'true');
            msg.addEventListener('click', handleClick, { capture: true });
            const authorImg = msg.querySelector('#author-photo img') || msg.querySelector('.author-photo img');
            if (authorImg) {
                authorImg.addEventListener('mouseover', handleAuthorPhotoHover);
            }
            if (!processedMessages.has(msg)) {
                processedMessages.set(msg, true);
                processMessage(msg, true);
            }
        });
    });
    const chatContainer = document.querySelector('#chat');
    if (chatContainer) {
        observer.observe(chatContainer, { childList: true, subtree: true });
        const existingMessages = Array.from(chatContainer.querySelectorAll('yt-live-chat-text-message-renderer, .super-fast-chat-message'));
        existingMessages.forEach(msg => {
            msg.setAttribute('data-ytcm-handled', 'true');
            msg.addEventListener('click', handleClick, { capture: true });
            const authorImg = msg.querySelector('#author-photo img') || msg.querySelector('.author-photo img');
            if (authorImg) {
                authorImg.addEventListener('mouseover', handleAuthorPhotoHover);
            }
            if (!processedMessages.has(msg)) {
                processedMessages.set(msg, true);
                processMessage(msg, true);
            }
        });
    }
    const controlPanel = createControlPanel();
    ensureStatsDisplay();
    cacheCleanupInterval = setInterval(() => {
        const now = Date.now();
        let changed = false;
        for (const user in ephemeralUsers) {
            if (EPHEMERAL_USER_DURATION !== Infinity && ephemeralUsers[user] <= now) {
                delete ephemeralUsers[user];
                changed = true;
                updateAllMessages(user);
            }
        }
        for (const [user, data] of calloutUserCache.entries()) {
            if (data.expireTime <= now) {
                calloutUserCache.delete(user);
                updateAllMessages(user);
            }
        }
        if (spamExpireTime === Infinity) {
            currentSpamCount = spamCache.size;
        } else {
            const expireThreshold = now - spamExpireTime;
            let countRemoved = 0;
            for (const [key, originalTimestamp] of spamCache.entries()) {
                if (originalTimestamp <= expireThreshold) {
                    spamCache.delete(key);
                    countRemoved++;
                }
            }
            currentSpamCount = Math.max(0, currentSpamCount - countRemoved);
        }
        if (!featureSettings.pinEnabled) {
            requestAnimationFrame(() => {
                const pinnedMessage = document.querySelector('yt-live-chat-banner-renderer');
                if (pinnedMessage) {
                    pinnedMessage.style.display = 'none';
                }
            });
        }
    }, CACHE_CLEANUP_INTERVAL);
    return () => {
        observer.disconnect();
        if (controlPanel) controlPanel.remove();
        closeMenu();
        if (statsBox && statsBox.parentNode) {
            statsBox.parentNode.removeChild(statsBox);
        }
        if (statsUpdaterInterval) {
            clearInterval(statsUpdaterInterval);
            statsUpdaterInterval = null;
        }
        if (cacheCleanupInterval) {
            clearInterval(cacheCleanupInterval);
            cacheCleanupInterval = null;
        }
    };
}
let cleanup = null;
function checkAndClickChatReplay() {
    const selectors = ['button[aria-label="顯示聊天重播"]', 'button[aria-label="Show chat replay"]'];
    for (const selector of selectors) {
        const button = document.querySelector(selector);
        if (button) {
            button.click();
            console.log("Clicked chat replay button.");
            return true;
        }
    }
    return false;
}
function checkIfLive() {
    const isLive = document.querySelector('ytd-watch-flexy[theater] #movie_player .ytp-live-badge, ytd-watch-flexy[theater] #movie_player .ytp-iv-video-content .ytp-live-badge, ytd-watch-flexy[theater] .ytp-live-badge, ytd-watch-flexy[default] .ytp-live-badge, ytd-watch-flexy[default] #movie_player .ytp-live-badge, ytd-watch-flexy[default] #movie_player .ytp-iv-video-content .ytp-live-badge');
    return !!isLive;
}
function main() {
    if (window.location.pathname.includes('/live_chat')) {
        cleanup = init();
    } else if (window.location.pathname.includes('/watch')) {
        if (checkIfLive()) {
            cleanup = init();
        } else {
            const checkReplayInterval = setInterval(() => {
                if (checkAndClickChatReplay()) {
                    clearInterval(checkReplayInterval);
                }
            }, 1000);
            const timeoutId = setTimeout(() => {
                clearInterval(checkReplayInterval);
            }, 10000);
        }
    }
}
main();
window.addEventListener('beforeunload', () => {
    cleanup?.();
});

})();