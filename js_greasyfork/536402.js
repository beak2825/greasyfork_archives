// ==UserScript==
// @name         滾動音量Dx版 Scroll Volume Dx Edition
// @name:zh-CN   滚动音量Dx版
// @name:en      Scroll Volume Dx Edition
// @namespace    http://tampermonkey.net/
// @version      9.14
// @description  改善Web Fullscreen容器定位。新增YouTube全螢幕模式選項與Web全螢幕點擊播放控制。新增自訂修飾鍵微調音量功能。滾輪、013速度、28音量、46+-5sec、5(空白鍵)播放暫停、enter全螢幕切換、小鍵盤＋－增減10%進度。完整支援：YouTube、B站、Steam。B站直播(局部)
// @description:zh-CN 改善Web Fullscreen容器定位。新增YouTube全萤幕模式选项与Web全萤幕点击播放控制。新增自定义修饰键微调音量功能。滚轮、013速度、28音量、46+-5sec、5(空白键)播放暂停、enter全萤幕切换、小键盘＋－增减10%进度。完整支援：YouTube、B站、Steam。B站直播(局部)
// @description:en  Improved Web Fullscreen container positioning. Added YouTube fullscreen mode option and Web fullscreen click-to-play control. Added custom modifier key for fine volume adjustment. wheel scroll for volume. NumpadKey：013 for speed, 28 for volume, 46 for 5sec、5(space) for play/pause, enter for fullscreen, numpad+- for 5sec. Fully supports: YouTube, Bilibili, Steam. Bilibili live (partial)
// @match        *://*/*
// @match        *://www.youtube.com/*
// @match        *://www.youtube-nocookie.com/*
// @match        *://www.bilibili.com/*
// @match        *://live.bilibili.com/*
// @match        *://www.twitch.tv/*
// @match        *://store.steampowered.com/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/536402/%E6%BB%BE%E5%8B%95%E9%9F%B3%E9%87%8FDx%E7%89%88%20Scroll%20Volume%20Dx%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/536402/%E6%BB%BE%E5%8B%95%E9%9F%B3%E9%87%8FDx%E7%89%88%20Scroll%20Volume%20Dx%20Edition.meta.js
// ==/UserScript==
(function() {
    'use strict';
    const LANG = /^zh-(cn|tw|hk|mo|sg)/i.test(navigator.language) ? 'zh' : 'en'; // 語言檢測 / Language detection
    const i18n = { // 國際化文本 / Internationalization text
        zh: {
            menuStep: '⚙️ 設定步進',
            menuLongStep: '⏱️ 設定長步進',
            menuVolumeStep: '🔊 設定音量步進',
            menuModifier: '🎚️ 設定修飾鍵微調',
            menuKeyFunc: '🎛️ 設定按鍵7/9功能',
            menuFullscreenMode: '📺 設定YouTube全螢幕模式',
            promptStep: '設定快進/快退 (秒)',
            promptLongStep: '設定長跳轉 (秒)',
            promptVolume: '設定音量幅度 (%)',
            modifierOptions: {
                1: '1. Alt 鍵',
                2: '2. Ctrl 鍵',
                3: '3. Shift 鍵',
                4: '4. Meta 鍵 (⌘)',
                5: '5. 關閉此功能'
            },
            keyFuncOptions: {
                1: '1. 長步進',
                2: '2. 上一頁/下一頁',
                3: '3. 上/下一個影片',
                4: '4. 平台原生功能'
            },
            fullscreenModeOptions: {
                1: '1. 原生最大化 (點擊 .ytp-fullscreen-button)',
                2: '2. 原生API最大化 (toggleNativeFullscreen)',
                3: '3. 網頁全螢幕 (Web Fullscreen)'
            },
            saveAlert: '設定已保存，需重新整理頁面後生效',
            promptModifier: '選擇音量微調修飾鍵:',
            promptKey7: '選擇按鍵7功能:',
            promptKey9: '選擇按鍵9功能:',
            promptFullscreen: '選擇YouTube全螢幕模式:'
        },
        en: {
            menuStep: '⚙️ Set Step',
            menuLongStep: '⏱️ Set Long Step',
            menuVolumeStep: '🔊 Set Volume Step',
            menuModifier: '🎚️ Set Modifier Key',
            menuKeyFunc: '🎛️ Set Key 7/9 Function',
            menuFullscreenMode: '📺 Set YouTube Fullscreen Mode',
            promptStep: 'Set step time (seconds)',
            promptLongStep: 'Set long jump time (seconds)',
            promptVolume: 'Set volume step (%)',
            modifierOptions: {
                1: '1. Alt key',
                2: '2. Ctrl key',
                3: '3. Shift key',
                4: '4. Meta key (⌘)',
                5: '5. Disable feature'
            },
            keyFuncOptions: {
                1: '1. Long step',
                2: '2. Browser navigation',
                3: '3. Previous/Next video',
                4: '4. Platform native'
            },
            fullscreenModeOptions: {
                1: '1. Native maximization (click .ytp-fullscreen-button)',
                2: '2. Native API maximization (toggleNativeFullscreen)',
                3: '3. Web Fullscreen'
            },
            saveAlert: 'Settings saved. Refresh page to apply',
            promptModifier: 'Select modifier key:',
            promptKey7: 'Select key 7 function:',
            promptKey9: 'Select key 9 function:',
            promptFullscreen: 'Select YouTube fullscreen mode:'
        }
    };
    const registerMenuCommands = () => { // 註冊設定選單 / Register settings menu
        const t = i18n[LANG];
        GM_registerMenuCommand(t.menuStep, () => handleConfigPrompt(t.promptStep, 'stepTime'));
        GM_registerMenuCommand(t.menuLongStep, () => handleConfigPrompt(t.promptLongStep, 'stepTimeLong'));
        GM_registerMenuCommand(t.menuVolumeStep, () => handleConfigPrompt(t.promptVolume, 'stepVolume'));
        GM_registerMenuCommand(t.menuModifier, handleModifierSetting);
        GM_registerMenuCommand(t.menuKeyFunc, handleKeyFunctionSetting);
        if (PLATFORM === 'YOUTUBE') GM_registerMenuCommand(t.menuFullscreenMode, handleFullscreenModeSetting);
    };
    const handleConfigPrompt = (promptText, configKey) => { // 處理數值設定提示 / Handle numeric setting prompt
        const newVal = prompt(promptText, CONFIG[configKey]);
        if (newVal && !isNaN(newVal)) {
            CONFIG[configKey] = parseFloat(newVal);
            saveConfig(CONFIG);
        }
    };
    const handleModifierSetting = () => { // 處理修飾鍵設定提示 / Handle modifier key setting prompt
        const t = i18n[LANG];
        const options = t.modifierOptions;
        const choice = prompt(`${t.promptModifier}${Object.values(options).join('')}`,
            CONFIG.modifierKey
        );
        if (choice && options[choice]) {
            CONFIG.modifierKey = parseInt(choice);
            saveConfig(CONFIG);
            alert(t.saveAlert);
        }
    };
    const handleKeyFunctionSetting = () => { // 處理按鍵7/9功能設定提示 / Handle key 7/9 function setting prompt
        const t = i18n[LANG];
        const baseOptions = {...t.keyFuncOptions};
        if (!['YOUTUBE', 'BILIBILI'].includes(PLATFORM)) delete baseOptions[4];
        const getChoice = (msgKey, currentVal) => {
            const message = `${msgKey === 'key7' ? t.promptKey7 : t.promptKey9}${Object.values(baseOptions).join('')}`;
            return prompt(message, currentVal);
        };
        const choice7 = getChoice('key7', CONFIG.key7Function);
        if (choice7 && baseOptions[choice7]) CONFIG.key7Function = parseInt(choice7);
        const choice9 = getChoice('key9', CONFIG.key9Function);
        if (choice9 && baseOptions[choice9]) CONFIG.key9Function = parseInt(choice9);
        saveConfig(CONFIG);
    };
    const handleFullscreenModeSetting = () => { // 處理YouTube全螢幕模式設定提示 / Handle YouTube fullscreen mode setting prompt
        const t = i18n[LANG];
        const options = t.fullscreenModeOptions;
        const choice = prompt(`${t.promptFullscreen}${Object.values(options).join('')}`,
            CONFIG.youtubeFullscreenMode
        );
        if (choice && options[choice]) {
            CONFIG.youtubeFullscreenMode = parseInt(choice);
            saveConfig(CONFIG);
            alert(t.saveAlert);
        }
    };
    const getDomainId = () => { // 獲取標準化域名標識 / Get standardized domain ID
        const hostParts = location.hostname.split('.');
        return hostParts.length > 2 ? hostParts.slice(-2).join('_') : hostParts.join('_');
    };
    const PLATFORM = (() => { // 平台檢測 / Platform detection
        const host = location.hostname;
        if (/youtube\.com|youtu\.be|youtube-nocookie\.com/.test(host)) return "YOUTUBE"; // 修改平台檢測，包含 youtube-nocookie.com / Modified platform detection to include youtube-nocookie.com
        if (/www.bilibili\.com/.test(host)) return "BILIBILI";
        if (/twitch\.tv/.test(host)) return "TWITCH";
        if (/steam(community|powered)\.com/.test(host)) return "STEAM";
        return "GENERIC";
    })();
    const CONFIG_STORAGE_KEY = 'ScrollVolumeDxConfig'; // 配置存儲鍵名 / Configuration storage key name
    const DEFAULT_CONFIG = { // 預設配置 / Default configuration
        stepTime: 5,
        stepTimeLong: 30,
        stepVolume: 10,
        key7Function: ['YOUTUBE', 'BILIBILI'].includes(PLATFORM) ? 4 : 1,
        key9Function: ['YOUTUBE', 'BILIBILI'].includes(PLATFORM) ? 4 : 1,
        modifierKey: 5, // 1=Alt 2=Ctrl 3=Shift 4=Meta 5=None
        fineVolumeStep: 1, // 微調音量步進值 / Fine volume adjustment step value
        youtubeFullscreenMode: 2 // YouTube全螢幕模式預設值改為2 (1=原生按鈕, 2=原生API, 3=網頁全螢幕) / YouTube fullscreen mode default value changed to 2
    };
    const getConfig = () => { // 獲取配置 / Get configuration
        const savedConfig = GM_getValue(CONFIG_STORAGE_KEY, {});
        const domainId = getDomainId();
        return {
            ...DEFAULT_CONFIG,
            ...(savedConfig[domainId] || {})
        };
    };
    const saveConfig = (config) => { // 保存配置 / Save configuration
        const savedConfig = GM_getValue(CONFIG_STORAGE_KEY, {});
        const domainId = getDomainId();
        const currentConfig = { ...config };
        const isDefault = Object.keys(DEFAULT_CONFIG).every(key =>
            currentConfig[key] === DEFAULT_CONFIG[key]
        );
        if (isDefault) {
            if (savedConfig[domainId]) {
                delete savedConfig[domainId];
                GM_setValue(CONFIG_STORAGE_KEY, savedConfig);
            }
            return;
        }
        const diffConfig = {};
        Object.keys(currentConfig).forEach(key => {
            if (currentConfig[key] !== DEFAULT_CONFIG[key]) {
                diffConfig[key] = currentConfig[key];
            }
        });
        savedConfig[domainId] = diffConfig;
        GM_setValue(CONFIG_STORAGE_KEY, savedConfig);
    };
    const CONFIG = (() => { // 初始化配置 / Initialize configuration
        const config = getConfig();
        saveConfig(config);
        return config;
    })();
    registerMenuCommands(); // 初始化選單 / Initialize menu
    let cachedVideo = null; // 緩存視頻元素 / Cache video element
    let lastVideoCheck = 0; // 最後檢查時間 / Last check time
    let videoElements = []; // 視頻元素列表 / Video element list
    let currentVideoIndex = 0; // 當前視頻索引 / Current video index
    let activeVideoId = null; // 激活視頻ID / Active video ID
    let videoDoubleClickHandler = null; // 用於存儲 YouTube 模式2和3的雙擊處理函數 / Used to store the double-click handler for YouTube mode 2 and 3
    const videoStateMap = new WeakMap(); // 視頻狀態映射 / Video state map
    function getVideoState(video) { // 獲取視頻狀態 / Get video state
        if (!videoStateMap.has(video)) {
            videoStateMap.set(video, {
                lastCustomRate: 1.0,
                isDefaultRate: true
            });
        }
        return videoStateMap.get(video);
    }
    const generateVideoId = (video) => // 生成視頻唯一ID / Generate unique video ID
        `${video.src}_${video.clientWidth}x${video.clientHeight}`;
    function getVideoElement() { // 獲取視頻元素 (防抖改進) / Get video element (debounce improvement)
        if (activeVideoId) {
            const activeVideo = videoElements.find(v => generateVideoId(v) === activeVideoId);
            if (activeVideo && document.contains(activeVideo)) {
                cachedVideo = activeVideo;
                return cachedVideo;
            }
        }
        if (cachedVideo && document.contains(cachedVideo) && (Date.now() - lastVideoCheck < 300)) { // 常規檢測邏輯
            return cachedVideo;
        }
        const handler = PLATFORM_HANDLERS[PLATFORM] || PLATFORM_HANDLERS.GENERIC;
        cachedVideo = handler.getVideo();
        lastVideoCheck = Date.now();
        updateVideoElements(); // 更新視頻元素列表和當前索引
        if (cachedVideo && videoElements.length > 0) {
            currentVideoIndex = videoElements.indexOf(cachedVideo);
            if (currentVideoIndex === -1) currentVideoIndex = 0;
            activeVideoId = generateVideoId(cachedVideo);
        }
        return cachedVideo;
    }
    function updateVideoElements() { // 更新視頻元素列表 / Update video element list
        videoElements = Array.from(document.querySelectorAll('video'))
            .filter(v => v.offsetParent !== null && v.readyState > 0);
    }
    function switchToNextVideo() { // 切換到下一個視頻 / Switch to next video
        if (videoElements.length < 2) return null;
        currentVideoIndex = (currentVideoIndex + 1) % videoElements.length;
        cachedVideo = videoElements[currentVideoIndex];
        activeVideoId = generateVideoId(cachedVideo);
        lastVideoCheck = Date.now();
        return cachedVideo;
    }
    function switchToPrevVideo() { // 切換到上一個視頻 / Switch to previous video
        if (videoElements.length < 2) return null;
        currentVideoIndex = (currentVideoIndex - 1 + videoElements.length) % videoElements.length;
        cachedVideo = videoElements[currentVideoIndex];
        activeVideoId = generateVideoId(cachedVideo);
        lastVideoCheck = Date.now();
        return cachedVideo;
    }
    function commonAdjustVolume(video, delta) { // 通用音量調整 / Common volume adjustment
        const isFineAdjust = Math.abs(delta) === CONFIG.fineVolumeStep;
        const actualDelta = isFineAdjust ? delta : (delta > 0 ? CONFIG.stepVolume : -CONFIG.stepVolume);
        const newVolume = clampVolume((video.volume * 100) + actualDelta);
        video.volume = newVolume / 100;
        showVolume(newVolume);
        return newVolume;
    }
    function clampVolume(vol) { // 音量限制 / Volume clamping
        return Math.round(Math.max(0, Math.min(100, vol)) * 100) / 100;
    }
    let isWebFullscreened = false; // Web全螢幕狀態標記 / Web fullscreen state flag
    let originalVideoParent = null; // 儲存原始父元素 / Store original parent element
    let originalVideoStyles = {}; // 儲存原始視頻樣式 / Store original video styles
    let originalParentStyles = {}; // 儲存原始父元素樣式 / Store original parent styles
    let webFullscreenContainer = null; // Web全螢幕容器 / Web fullscreen container
    function toggleWebFullscreen(video) { // Web全螢幕切換 / Web fullscreen toggle
        if (!video) return;
        if (isWebFullscreened) {
            if (webFullscreenContainer && webFullscreenContainer.contains(video)) { webFullscreenContainer.removeChild(video); } // 1. 從容器中移除視頻 / Remove video from container
            if (webFullscreenContainer && document.body.contains(webFullscreenContainer)) { document.body.removeChild(webFullscreenContainer); webFullscreenContainer = null; } // 2. 移除容器 / Remove container
            if (originalVideoParent && !originalVideoParent.contains(video)) { originalVideoParent.appendChild(video); } // 3. 將視頻移回原始父元素 / Move video back to original parent
            Object.assign(video.style, originalVideoStyles); // 4. 恢復原始視頻樣式 / Restore original video styles
            if (originalVideoParent) { Object.assign(originalVideoParent.style, originalParentStyles); } // 5. 恢復原始父元素樣式 / Restore original parent styles
            isWebFullscreened = false; // 6. 重置狀態標記 / Reset state flag
            originalVideoParent = null;
        } else {
            originalVideoParent = video.parentElement; // 儲存原始狀態 / Store original state
            if (!originalVideoParent) return; // 如果沒有父元素，無法操作 / If no parent element, cannot operate
            originalVideoStyles = {
                position: video.style.position,
                top: video.style.top,
                left: video.style.left,
                width: video.style.width,
                height: video.style.height,
                zIndex: video.style.zIndex,
                objectFit: video.style.objectFit,
                objectPosition: video.style.objectPosition
            };
            originalParentStyles = {
                position: originalVideoParent.style.position,
                overflow: originalVideoParent.style.overflow
            };
            if (!webFullscreenContainer) { // 創建容器 / Create container
                webFullscreenContainer = document.createElement('div');
                webFullscreenContainer.id = 'web-fullscreen-container';
                Object.assign(webFullscreenContainer.style, {
                    position: 'relative', // 修正：使用 relative 而非 fixed，使其在正常文件流中 / Fixed: Use relative instead of fixed to place it in normal document flow
                    zIndex: '2147483645', // 略低於顯示層，確保按鍵事件正常 / Slightly below display layer to ensure key events work
                    backgroundColor: 'black', // 黑色背景 / Black background
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto', // 置中容器 / Center container
                    maxWidth: '100%', // 限制最大寬度 / Limit max width
                    maxHeight: '100vh' // 限制最大高度為視窗高度 / Limit max height to viewport height
                });
                webFullscreenContainer.addEventListener('click', () => { // 為容器添加點擊事件以切換播放/暫停 / Add click event to container to toggle play/pause
                    if (video && !video.paused) {
                        video.pause();
                    } else if (video) {
                        video.play().catch(() => {}); // 捕獲可能的錯誤 / Catch potential errors
                    }
                });
            }
            Object.assign(originalVideoParent.style, { // 應用父元素樣式 / Apply parent element styles
                position: 'static', // 重置父元素定位，避免干擾 / Reset parent element positioning to avoid interference
                overflow: 'visible'
            });
            originalVideoParent.removeChild(video); // 將視頻移入容器 / Move video into container
            webFullscreenContainer.appendChild(video);
            document.body.insertBefore(webFullscreenContainer, document.body.firstChild);
            video.style.position = '';
            video.style.top = '';
            video.style.left = '';
            video.style.width = '100%';
            video.style.height = 'auto'; // 高度自適應 / Height auto-adjust
            video.style.maxHeight = '100vh';
            video.style.zIndex = '';
            video.style.objectFit = 'contain'; // 保持比例 / Maintain aspect ratio
            video.style.objectPosition = 'center'; // 置中 / Center
            isWebFullscreened = true;
        }
    } // --- 結束 Web Fullscreen 相關函數 / End Web Fullscreen related functions ---
    const PLATFORM_HANDLERS = { // 平台處理器 / Platform handlers
        YOUTUBE: {
            getVideo: () => document.querySelector('video, ytd-player video') || findVideoInIframes(),
            adjustVolume: (video, delta) => {
                const ytPlayer = document.querySelector('#movie_player');
                if (ytPlayer?.getVolume) {
                    const currentVol = ytPlayer.getVolume();
                    const newVol = clampVolume(currentVol + delta);
                    ytPlayer.setVolume(newVol);
                    video.volume = newVol / 100;
                    showVolume(newVol);
                } else {
                    commonAdjustVolume(video, delta);
                }
            },
            toggleFullscreen: (video) => { // 根據設定切換模式 / Switch mode based on setting
                switch(CONFIG.youtubeFullscreenMode) {
                    case 1: // 原生最大化 / Native maximization
                        document.querySelector('.ytp-fullscreen-button')?.click();
                        break;
                    case 2: // 原生API最大化 / Native API maximization
                        toggleNativeFullscreen(video);
                        break;
                    case 3: // 網頁全螢幕 / Web fullscreen
                        toggleWebFullscreen(video);
                        break;
                }
            },
            setupVideoEventOverrides: (video) => { // 設置視頻事件覆蓋 / Set up video event overrides
                if (videoDoubleClickHandler) {
                    video.removeEventListener('dblclick', videoDoubleClickHandler);
                }
                if (CONFIG.youtubeFullscreenMode === 3) {
                    videoDoubleClickHandler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleWebFullscreen(video);
                    };
                } else if (CONFIG.youtubeFullscreenMode === 2) {
                    videoDoubleClickHandler = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleNativeFullscreen(video);
                    };
                } else {
                    videoDoubleClickHandler = null; // 其他模式不處理雙擊 / Do not handle double-click for other modes
                    return; // 如果不處理，則不添加監聽器 / If not handling, do not add listener
                }
                video.addEventListener('dblclick', videoDoubleClickHandler);
            },
            specialKeys: {
                'Space': () => {},
                'Numpad7': () => document.querySelector('.ytp-prev-button')?.click(),
                'Numpad9': () => document.querySelector('.ytp-next-button')?.click()
            }
        },
        BILIBILI: {
            getVideo: () => document.querySelector('.bpx-player-video-wrap video') || findVideoInIframes(),
            adjustVolume: commonAdjustVolume,
            toggleFullscreen: () => document.querySelector('.bpx-player-ctrl-full')?.click(),
            specialKeys: {
                'Space': () => {},
                'Numpad2': () => {},
                'Numpad8': () => {},
                'Numpad4': () => {},
                'Numpad6': () => {},
                'Numpad7': () => document.querySelector('.bpx-player-ctrl-prev')?.click(),
                'Numpad9': () => document.querySelector('.bpx-player-ctrl-next')?.click()
            }
        },
        TWITCH: {
            getVideo: () => document.querySelector('.video-ref video') || findVideoInIframes(),
            adjustVolume: commonAdjustVolume,
            toggleFullscreen: () => document.querySelector('[data-a-target="player-fullscreen-button"]')?.click(),
            specialKeys: {
                'Numpad7': () => simulateKeyPress('ArrowLeft'),
                'Numpad9': () => simulateKeyPress('ArrowRight')
            }
        },
        STEAM: {
            getVideo: () => {
                const videos = Array.from(document.querySelectorAll('video'));
                const playingVideo = videos.find(v => v.offsetParent !== null && !v.paused);
                if (playingVideo) return playingVideo;
                const visibleVideo = videos.find(v => v.offsetParent !== null);
                if (visibleVideo) return visibleVideo;
                return findVideoInIframes();
            },
            adjustVolume: commonAdjustVolume,
            toggleFullscreen: (video) => {
                if (!video) return;
                const container = video.closest('.game_hover_activated') || video.parentElement;
                if (container && !document.fullscreenElement) {
                    container.requestFullscreen?.().catch(() => video.requestFullscreen?.());
                } else {
                    document.exitFullscreen?.();
                }
            },
            handleWheel: function(e) {
                if (isInputElement(e.target)) return;
                const video = this.getVideo();
                if (!video) return;
                const rect = video.getBoundingClientRect();
                const inVideoArea =
                      e.clientX >= rect.left - 50 && e.clientX <= rect.right + 50 &&
                      e.clientY >= rect.top - 30 && e.clientY <= rect.bottom + 30;
                if (inVideoArea) {
                    e.preventDefault();
                    e.stopPropagation();
                    const delta = -Math.sign(e.deltaY);
                    this.adjustVolume(video, delta * CONFIG.stepVolume);
                    showVolume(video.volume * 100);
                }
            }
        },
        GENERIC: {
            getVideo: () => {
                return document.querySelector('video.player') ||
                       findVideoInIframes() ||
                       document.querySelector('video, .video-player video, .video-js video, .player-container video');
            },
            adjustVolume: commonAdjustVolume,
            toggleFullscreen: (video) => toggleNativeFullscreen(video),
        }
    };
    function findVideoInIframes() { // 在iframe中尋找視頻 / Find video in iframes
        const iframes = document.querySelectorAll('iframe');
        for (const iframe of iframes) {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
                return iframeDoc?.querySelector('video');
            } catch {}
        }
        return null;
    }
    function toggleNativeFullscreen(video) { // 原生全螢幕切換 / Native fullscreen toggle
        if (!video) return;
        try {
            if (document.fullscreenElement) {
                document.exitFullscreen();
            } else {
                let elementToFullscreen = video;
                for (let i = 0; i < 2; i++) {
                    elementToFullscreen = elementToFullscreen.parentElement || elementToFullscreen;
                }
                elementToFullscreen.requestFullscreen?.() ||
                elementToFullscreen.webkitRequestFullscreen?.() ||
                elementToFullscreen.msRequestFullscreen?.() ||
                video.requestFullscreen?.() ||
                video.webkitRequestFullscreen?.() ||
                video.msRequestFullscreen?.();
            }
        } catch (e) {
            console.error('Fullscreen error:', e);
        }
    }
    function simulateKeyPress(key) { // 模擬按鍵 / Simulate key press
        document.dispatchEvent(new KeyboardEvent('keydown', {key, bubbles: true}));
    }
    function isInputElement(target) { // 檢查是否為輸入元素 / Check if target is an input element
        return /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName) || target.isContentEditable;
    }
    function adjustRate(video, changeValue) { // 調整播放速率 / Adjust playback rate
        const state = getVideoState(video);
        const newRate = Math.max(0.1, Math.min(16, video.playbackRate + changeValue));
        video.playbackRate = parseFloat(newRate.toFixed(1));
        state.lastCustomRate = video.playbackRate;
        state.isDefaultRate = (video.playbackRate === 1.0);
        showVolume(video.playbackRate * 100);
    }
    function togglePlaybackRate(video) { // 切換播放速率 / Toggle playback rate
        const state = getVideoState(video);
        if (state.isDefaultRate) {
            video.playbackRate = state.lastCustomRate;
            state.isDefaultRate = false;
        } else {
            state.lastCustomRate = video.playbackRate;
            video.playbackRate = 1.0;
            state.isDefaultRate = true;
        }
        showVolume(video.playbackRate * 100);
    }
    function showVolume(vol) { // 顯示音量 / Show volume
        const display = document.getElementById('dynamic-volume-display') || createVolumeDisplay();
        display.textContent = `${Math.round(vol)}%`;
        display.style.opacity = '1';
        setTimeout(() => display.style.opacity = '0', 1000);
    }
    function createVolumeDisplay() { // 創建音量顯示 / Create volume display
        const display = document.createElement('div');
        display.id = 'dynamic-volume-display';
        Object.assign(display.style, {
            position: 'fixed',
            zIndex: 2147483647,
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            padding: '10px 20px',
            borderRadius: '8px',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: '#fff',
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            opacity: '0',
            transition: 'opacity 1s',
            pointerEvents: 'none'
        });
        document.body.appendChild(display);
        return display;
    }
    function handleVideoWheel(e) { // 處理視頻滾輪事件 / Handle video wheel event
        e.preventDefault();
        e.stopPropagation();
        const video = e.target;
        const normalizedDelta = -Math.sign(e.deltaY);
        PLATFORM_HANDLERS[PLATFORM].adjustVolume(video, normalizedDelta * CONFIG.stepVolume);
    }
function handleTwitchWheel(e) { // 處理Twitch滾輪事件 / Handle Twitch wheel event
    if (isInputElement(e.target)) return;
    const video = getVideoElement();
    if (!video) return;
    const rect = video.getBoundingClientRect();
    const inVideoArea =
        e.clientX >= rect.left - 50 && e.clientX <= rect.right + 50 &&
        e.clientY >= rect.top - 30 && e.clientY <= rect.bottom + 30;
    if (inVideoArea) {
        e.preventDefault();
        e.stopPropagation();
        const delta = -Math.sign(e.deltaY);
        const volumeChange = delta * CONFIG.stepVolume;
        PLATFORM_HANDLERS.TWITCH.adjustVolume(video, volumeChange);
        showVolume(video.volume * 100);
    }
}
    function handleKeyEvent(e) { // 處理鍵盤事件 / Handle keyboard event
        if (isInputElement(e.target)) return;
        const video = getVideoElement();
        const handler = PLATFORM_HANDLERS[PLATFORM];
        const isCustomModifier = (() => {
            if (CONFIG.modifierKey === 5) return false;
            const requiredModifier = {
                1: 'altKey',
                2: 'ctrlKey',
                3: 'shiftKey',
                4: 'metaKey'
            }[CONFIG.modifierKey];
            const otherModifiers = ['altKey','ctrlKey','shiftKey','metaKey']
            .filter(k => k !== requiredModifier)
            .some(k => e[k]);
            return e[requiredModifier] && !otherModifiers;
        })();
        const hasOtherModifiers = e.altKey || e.ctrlKey || e.shiftKey || e.metaKey;
        if (!isCustomModifier && hasOtherModifiers) {
            return;
        }
        if (isCustomModifier) {
            const volumeActions = {
                'Numpad8': () => handler.adjustVolume(video, CONFIG.fineVolumeStep),
                'Numpad2': () => handler.adjustVolume(video, -CONFIG.fineVolumeStep)
            };
            if (volumeActions[e.code]) {
                volumeActions[e.code]();
                e.preventDefault();
                return;
            }
            return;
        }
        if (e.code === 'Numpad7') {
            switch (CONFIG.key7Function) {
                case 1:
                    video && (video.currentTime -= CONFIG.stepTimeLong);
                    break;
                case 2:
                    history.back();
                    break;
                case 3:
                    switchToPrevVideo()?.play().catch(() => {});
                    break;
                case 4:
                    if (handler.specialKeys?.Numpad7) {
                        handler.specialKeys.Numpad7();
                    }
                    break;
            }
            e.preventDefault();
            return;
        }
        if (e.code === 'Numpad9') {
            switch (CONFIG.key9Function) {
                case 1:
                    video && (video.currentTime += CONFIG.stepTimeLong);
                    break;
                case 2:
                    history.forward();
                    break;
                case 3:
                    switchToNextVideo()?.play().catch(() => {});
                    break;
                case 4:
                    if (handler.specialKeys?.Numpad9) {
                        handler.specialKeys.Numpad9();
                    }
                    break;
            }
            e.preventDefault();
            return;
        }
        if (handler.specialKeys?.[e.code]) {
            handler.specialKeys[e.code]();
            e.preventDefault();
            return;
        }
        const actions = {
            'Space': () => video && video[video.paused ? 'play' : 'pause'](),
            'Numpad5': () => video && video[video.paused ? 'play' : 'pause'](),
            'NumpadEnter': () => handler.toggleFullscreen(video), // 使用平台特定的切換函數 / Use platform-specific toggle function
            'NumpadAdd': () => video && (video.currentTime += video.duration * 0.1),
            'NumpadSubtract': () => video && (video.currentTime -= video.duration * 0.1),
            'Numpad0': () => video && togglePlaybackRate(video),
            'Numpad1': () => video && adjustRate(video, -0.1),
            'Numpad3': () => video && adjustRate(video, 0.1),
            'Numpad8': () => video && handler.adjustVolume(video, CONFIG.stepVolume),
            'Numpad2': () => video && handler.adjustVolume(video, -CONFIG.stepVolume),
            'Numpad4': () => video && (video.currentTime -= CONFIG.stepTime),
            'Numpad6': () => video && (video.currentTime += CONFIG.stepTime)
        };
        if (actions[e.code]) {
            actions[e.code]();
            e.preventDefault();
        }
    }
    function bindVideoEvents() { // 綁定視頻事件 / Bind video events
        if (PLATFORM === 'TWITCH' || PLATFORM === 'STEAM') return;
        document.querySelectorAll('video').forEach(video => {
            if (!video.dataset.volumeBound) {
                video.addEventListener('wheel', handleVideoWheel, { passive: false });
                video.dataset.volumeBound = 'true';
            }
            // 為 YouTube 模式2和3設置雙擊覆蓋 / Set up double-click override for YouTube mode 2 and 3
            if (PLATFORM === 'YOUTUBE') {
                PLATFORM_HANDLERS.YOUTUBE.setupVideoEventOverrides(video);
            }
        });
    }
    function init() { // 初始化 / Initialization
        bindVideoEvents();
        document.addEventListener('keydown', handleKeyEvent, true);
        if (PLATFORM === 'STEAM') {
            document.addEventListener('wheel',
           PLATFORM_HANDLERS.STEAM.handleWheel.bind(PLATFORM_HANDLERS.STEAM),
           { capture: true, passive: false }
        );
        }
        if (PLATFORM === 'TWITCH') {
            document.addEventListener('wheel', handleTwitchWheel, { capture: true, passive: false });
        }
        updateVideoElements();
        new MutationObserver(() => { // 監聽DOM變化 / Listen for DOM changes
            bindVideoEvents();
            updateVideoElements();
            if (activeVideoId && !videoElements.some(v => generateVideoId(v) === activeVideoId)) {
                activeVideoId = null;
            }
        }).observe(document.body, { childList: true, subtree: true });
    }
    if (document.readyState !== 'loading') init();
    else document.addEventListener('DOMContentLoaded', init);
})();