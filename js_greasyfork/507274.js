// ==UserScript==
// @name         黄金左右键
// @description  按住"→"键倍速播放，按住"←"键减速播放，松开恢复原来的倍速，轻松追剧，看视频更灵活，还能快进/跳过大部分网站的广告！~ 支持用户单独配置倍速和秒数，并可根据根域名启用或禁用脚本
// @icon         https://image.suysker.xyz/i/2023/10/09/artworks-QOnSW1HR08BDMoe9-GJTeew-t500x500.webp
// @namespace    http://tampermonkey.net/
// @version      1.0.9
// @author       Suysker
// @match        http://*/*
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @homepage     https://github.com/Suysker/Golden-Left-Right
// @supportURL   https://github.com/Suysker/Golden-Left-Right
// @downloadURL https://update.greasyfork.org/scripts/507274/%E9%BB%84%E9%87%91%E5%B7%A6%E5%8F%B3%E9%94%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/507274/%E9%BB%84%E9%87%91%E5%B7%A6%E5%8F%B3%E9%94%AE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // -------------------- Configuration Constants --------------------
    const DEFAULT_RATE = 2;                // 默认倍速
    const DEFAULT_TIME = 5;                // 默认秒数
    const DEFAULT_RL_TIME = 180;           // 左右同时按下秒数
    const DOMAIN_BLOCK_LIST_KEY = "blockedDomains"; // 存储禁用的根域名列表的键名

    // -------------------- State Variables --------------------
    let keyboardEventsRegistered = false;  // 确保键盘事件只注册一次
    const debug = false;                   // 控制日志的输出，正式环境关闭
    let cachedVideos = [];                 // 缓存视频列表

    const state = {
        playbackRate: DEFAULT_RATE,        // 播放倍速
        changeTime: DEFAULT_TIME,          // 快进/回退秒数
        pageVideo: null,
        lastPlayedVideo: null,             // 记录上一个播放过的视频（通过 play 事件更新）
        originalPlaybackRate: 1,           // 存储原来的播放速度
        rightKeyDownCount: 0,              // 追踪右键按下次数
        leftKeyDownCount: 0                // 追踪左键按下次数
    };

    // -------------------- Utility Functions --------------------

    /**
     * Logs messages to the console if debugging is enabled.
     * @param  {...any} args - The messages or objects to log.
     */
    const log = (...args) => {
        if (debug) {
            console.log('[黄金左右键]', ...args);
        }
    };

    /**
     * Loads a setting from GM storage with a default value.
     * @param {string} key - The key of the setting.
     * @param {*} defaultValue - The default value if the setting is not found.
     * @returns {Promise<*>} - The loaded value.
     */
    const loadSetting = async (key, defaultValue) => {
        const value = await GM_getValue(key, defaultValue);
        return value !== undefined ? value : defaultValue;
    };

    /**
     * Saves a setting to GM storage.
     * @param {string} key - The key of the setting.
     * @param {*} value - The value to save.
     */
    const saveSetting = async (key, value) => {
        await GM_setValue(key, value);
    };

    /**
     * Retrieves the root domain of the current website.
     * @returns {string} - The root domain (e.g., example.com).
     */
    const getRootDomain = () => {
        const hostname = location.hostname;
        const domainParts = hostname.split('.');

        // Handle special cases like localhost or IP addresses
        if (domainParts.length <= 1) {
            return hostname;
        }

        // If the last part is a country code top-level domain (ccTLD), consider three parts
        const ccTLDs = ['uk', 'jp', 'cn', 'au', 'nz', 'br', 'fr', 'de', 'kr', 'in', 'ru'];
        const lastPart = domainParts[domainParts.length - 1];
        const secondLastPart = domainParts[domainParts.length - 2];

        if (ccTLDs.includes(lastPart) && domainParts.length >= 3) {
            return domainParts.slice(-3).join('.');
        } else {
            return domainParts.slice(-2).join('.');
        }
    };

    /**
     * Checks if the current domain is blocked.
     * @returns {Promise<boolean>} - True if blocked, else false.
     */
    const isDomainBlocked = async () => {
        const blockedDomains = await loadSetting(DOMAIN_BLOCK_LIST_KEY, []);
        const currentDomain = getRootDomain();
        return blockedDomains.includes(currentDomain);
    };

    /**
     * Toggles the current domain's blocked status.
     */
    const toggleCurrentDomain = async () => {
        const blockedDomains = await loadSetting(DOMAIN_BLOCK_LIST_KEY, []);
        const currentDomain = getRootDomain();
        const index = blockedDomains.indexOf(currentDomain);
        let isNowBlocked = false;

        if (index === -1) {
            blockedDomains.push(currentDomain);
            await saveSetting(DOMAIN_BLOCK_LIST_KEY, blockedDomains);
            alert(`已禁用黄金左右键脚本在此网站 (${currentDomain})`);
            isNowBlocked = true;
        } else {
            blockedDomains.splice(index, 1);
            await saveSetting(DOMAIN_BLOCK_LIST_KEY, blockedDomains);
            alert(`已启用黄金左右键脚本在此网站 (${currentDomain})`);
            isNowBlocked = false;
        }

        handleKeyboardEvents(!isNowBlocked); // 根据新状态立即启用/禁用键盘事件
    };

    /**
     * Checks if any input-related element (除了 <input type="range">) is currently focused.
     * @returns {boolean} - True if an input is focused, else false.
     */
    const isInputFocused = () => {
        const activeElement = document.activeElement;
        // 如果当前激活的元素是 <input type="range"> 则忽略（不阻止脚本响应）
        if (activeElement && activeElement.tagName.toLowerCase() === 'input' && activeElement.type === 'range') {
            return false;
        }
        const inputTypes = ['input', 'textarea', 'select', 'button'];
        const isContentEditable = activeElement && activeElement.isContentEditable;
        const isInputElement = activeElement && inputTypes.includes(activeElement.tagName.toLowerCase());
        return isContentEditable || isInputElement;
    };

    /**
     * Determines if a video element is visible within the viewport.
     * @param {HTMLVideoElement} video - The video element to check.
     * @returns {boolean} - True if visible, else false.
     */
    const isVideoVisible = (video) => {
        const rect = video.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    };

    /**
     * Determines if a video is currently playing.
     * @param {HTMLVideoElement} video - The video element to check.
     * @returns {boolean} - True if playing, else false.
     */
    const isVideoPlaying = (video) => {
        return video && !video.paused && video.currentTime > 0;
    };

    /**
     * Adds event listeners to a video element to track playback.
     * @param {HTMLVideoElement} video - The video element.
     */
    const addPlayEventListeners = (video) => {
        video.addEventListener('play', () => {
            state.lastPlayedVideo = video; // 仅在视频播放时更新
            log('更新 lastPlayedVideo: 当前播放的视频', video);
        });

        video.addEventListener('remove', () => {
            removeFromCache([video]);
        });
    };

    /**
     * Initializes event listeners for a list of video elements.
     * @param {HTMLVideoElement[]} videos - Array of video elements.
     */
    const initVideoListeners = (videos) => {
        videos.forEach(video => {
            if (!cachedVideos.includes(video)) {  // 避免重复添加
                cachedVideos.push(video);         // 缓存新视频
                addPlayEventListeners(video);       // 为每个新视频添加监听
            }
        });
    };

    /**
     * Removes video elements from the cache.
     * @param {HTMLVideoElement[]} removedVideos - Array of video elements to remove.
     */
    const removeFromCache = (removedVideos) => {
        cachedVideos = cachedVideos.filter(video => !removedVideos.includes(video));
        log('从缓存中移除视频:', removedVideos);
    };

    /**
     * Finds all video elements within a given node.
     * @param {Node} node - The root node to search within.
     * @returns {HTMLVideoElement[]} - Array of found video elements.
     */
    const findVideosRecursively = (node) => {
        if (node.nodeType !== Node.ELEMENT_NODE) return [];
        const videos = [];
        if (node.tagName.toLowerCase() === 'video') {
            videos.push(node);
        }
        videos.push(...node.querySelectorAll('video'));
        return videos;
    };

    /**
     * Caches all video elements currently present on the page.
     */
    const cacheAllVideos = () => {
        const allVideos = Array.from(document.getElementsByTagName('video'));
        initVideoListeners(allVideos);
        log('缓存所有视频:', allVideos);
    };

    /**
     * Determines the optimal video element to control.
     * @returns {Promise<HTMLVideoElement|null>} - The selected video element or null.
     */
    const getOptimalPageVideo = async () => {
        // 检查 lastPlayedVideo 是否存在且可见，不检查是否正在播放
        if (state.lastPlayedVideo && isVideoVisible(state.lastPlayedVideo)) {
            log('lastPlayedVideo 存在且可见');
            return state.lastPlayedVideo;
        }

        // 如果 lastPlayedVideo 不存在或不可见，检查是否有其他视频正在播放
        const allVideos = Array.from(document.getElementsByTagName('video'));
        const playingVideo = allVideos.find(isVideoPlaying);
        if (playingVideo) {
            log('找到其他正在播放的视频:', playingVideo);
            return playingVideo;
        }

        // 如果没有合适的视频，返回 null 并记录状态
        log('未找到合适的视频');
        return null;
    };

    /**
     * Checks and updates the current page video.
     * @returns {Promise<boolean>} - True if a video is found, else false.
     */
    const checkPageVideo = async () => {
        state.pageVideo = await getOptimalPageVideo();
        if (!state.pageVideo) {
            log('未找到符合条件的视频');
            return false;
        }
        return true;
    };

    /**
     * Sets the tabIndex of all progress bars to control focus behavior.
     */
    function configureProgressBars() {
        const configureProgressBar = (progressBar) => {
            // 定义一个内部函数，为传入的元素添加 focus 事件处理
            const disableFocus = (el) => {
                el.addEventListener('focus', () => {
                    if (checkPageVideo()) {
                        el.blur();
                    }
                });
            };

            // 对当前进度条元素及其所有后代元素都进行配置
            disableFocus(progressBar);
            progressBar.querySelectorAll('*').forEach(disableFocus);

            console.debug('已配置进度条:', progressBar);
        };

        // 初始配置页面上已有的进度条
        const progressBars = document.querySelectorAll(
            'input[type="range"][class*="slider"], input[type="range"][class*="progress"], input[type="range"][role="slider"], .yzmplayer-controller'
        );
        progressBars.forEach(configureProgressBar);

        // 监听 DOM 变化，处理新添加的进度条
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const nodes = node.matches('input[type="range"], .yzmplayer-controller')
                            ? [node]
                            : node.querySelectorAll('input[type="range"][class*="slider"], input[type="range"][class*="progress"], input[type="range"][role="slider"], .yzmplayer-controller');
                        nodes.forEach(configureProgressBar);
                    }
                });
            });
        });

        observer.observe(document.body, { childList: true, subtree: true });
    }

    // -------------------- Keyboard Event Handlers --------------------

    /**
     * Registers or unregisters keyboard event listeners.
     * @param {boolean} enable - True to register, false to unregister.
     */
    const handleKeyboardEvents = async (enable) => {
        if (enable && !keyboardEventsRegistered) {
            // 将事件监听器绑定到 document 对象，使用 capture 模式，确保优先级更高
            document.addEventListener('keydown', onRightKeyDown, { capture: true });
            document.addEventListener('keydown', onLeftKeyDown, { capture: true });
            document.addEventListener('keyup', onRightKeyUp, { capture: true });
            document.addEventListener('keyup', onLeftKeyUp, { capture: true });
            keyboardEventsRegistered = true;
            log('键盘事件已注册');
        } else if (!enable && keyboardEventsRegistered) {
            document.removeEventListener('keydown', onRightKeyDown, { capture: true });
            document.removeEventListener('keydown', onLeftKeyDown, { capture: true });
            document.removeEventListener('keyup', onRightKeyUp, { capture: true });
            document.removeEventListener('keyup', onLeftKeyUp, { capture: true });
            keyboardEventsRegistered = false;
            log('键盘事件已注销');
        }
    };

    /**
     * Checks if both left and right keys are pressed.
     * @returns {Promise<boolean>} - True if both are pressed and action is taken.
     */
    const checkBothKeysPressed = async () => {
        if (state.rightKeyDownCount === 1 && state.leftKeyDownCount === 1 && await checkPageVideo()) {
            state.pageVideo.currentTime += DEFAULT_RL_TIME;
            log(`同时按下左右键，快进 ${DEFAULT_RL_TIME} 秒`);
            // Reset counts to prevent repeated triggering
            state.rightKeyDownCount = 0;
            state.leftKeyDownCount = 0;
            return true; // 表示已处理
        }
        return false;
    };

    /**
     * Handles the right arrow key down event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onRightKeyDown = async (e) => {
        if (e.code !== 'ArrowRight' || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();
        state.rightKeyDownCount++;

        // 检查是否同时按下左右键
        if (await checkBothKeysPressed()) return;

        if (state.rightKeyDownCount === 2 && await checkPageVideo() && isVideoPlaying(state.pageVideo)) {
            state.originalPlaybackRate = state.pageVideo.playbackRate;
            state.pageVideo.playbackRate = state.playbackRate;
            log('加速播放中, 倍速: ' + state.playbackRate);
        }
    };

    /**
     * Handles the right arrow key up event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onRightKeyUp = async (e) => {
        if (e.code !== 'ArrowRight' || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();

        if (state.rightKeyDownCount === 1 && await checkPageVideo()) {
            state.pageVideo.currentTime += state.changeTime;
            log('前进 ' + state.changeTime + ' 秒');
        }

        // 恢复原来的倍速
        if (state.pageVideo && state.pageVideo.playbackRate !== state.originalPlaybackRate) {
            state.pageVideo.playbackRate = state.originalPlaybackRate;
            log('恢复原来的倍速: ' + state.originalPlaybackRate);
        }

        state.rightKeyDownCount = 0;
    };

    /**
     * Handles the left arrow key down event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onLeftKeyDown = async (e) => {
        if (e.code !== 'ArrowLeft' || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();
        state.leftKeyDownCount++;

        // 检查是否同时按下左右键
        if (await checkBothKeysPressed()) return;

        if (state.leftKeyDownCount === 2 && await checkPageVideo() && isVideoPlaying(state.pageVideo)) {
            state.originalPlaybackRate = state.pageVideo.playbackRate;
            state.pageVideo.playbackRate = 1 / state.playbackRate;
            log('减速播放中, 倍速: ' + state.pageVideo.playbackRate);
        }
    };

    /**
     * Handles the left arrow key up event.
     * @param {KeyboardEvent} e - The keyboard event.
     */
    const onLeftKeyUp = async (e) => {
        if (e.code !== 'ArrowLeft' || isInputFocused()) return;
        e.preventDefault();
        e.stopPropagation();

        if (state.leftKeyDownCount === 1 && await checkPageVideo()) {
            state.pageVideo.currentTime -= state.changeTime;
            log('回退 ' + state.changeTime + ' 秒');
        }

        // 恢复原来的倍速
        if (state.pageVideo && state.pageVideo.playbackRate !== state.originalPlaybackRate) {
            state.pageVideo.playbackRate = state.originalPlaybackRate;
            log('恢复原来的倍速: ' + state.originalPlaybackRate);
        }

        state.leftKeyDownCount = 0;
    };

    // -------------------- Configuration Functions --------------------

    /**
     * Prompts the user to set a new playback rate.
     */
    const configurePlaybackRate = async () => {
        const newRate = prompt('请输入新的播放倍速 (当前: ' + state.playbackRate + ')', state.playbackRate);
        if (newRate !== null) {
            const parsedRate = parseFloat(newRate);
            if (!isNaN(parsedRate) && parsedRate > 0) {
                state.playbackRate = parsedRate;
                await saveSetting('playbackRate', state.playbackRate);
                log('播放倍速设置为: ' + state.playbackRate);
            } else {
                alert('请输入一个有效的倍速数字。');
            }
        }
    };

    /**
     * Prompts the user to set a new change time for fast-forward/rewind.
     */
    const configureChangeTime = async () => {
        const newTime = prompt('请输入新的快进/回退秒数 (当前: ' + state.changeTime + ')', state.changeTime);
        if (newTime !== null) {
            const parsedTime = parseFloat(newTime);
            if (!isNaN(parsedTime) && parsedTime > 0) {
                state.changeTime = parsedTime;
                await saveSetting('changeTime', state.changeTime);
                log('快进/回退秒数设置为: ' + state.changeTime);
            } else {
                alert('请输入一个有效的秒数。');
            }
        }
    };

    // -------------------- Initialization --------------------

    /**
     * Initializes the userscript by setting up event listeners and observers.
     */
    const init = async () => {
        try {
            state.playbackRate = await loadSetting('playbackRate', DEFAULT_RATE);
            state.changeTime = await loadSetting('changeTime', DEFAULT_TIME);
            
            const isBlocked = await isDomainBlocked();
            handleKeyboardEvents(!isBlocked);

            // Register menu commands
            GM_registerMenuCommand('启用/禁用黄金左右键', toggleCurrentDomain);
            GM_registerMenuCommand('设置播放倍速', configurePlaybackRate);
            GM_registerMenuCommand('设置快进/回退秒数', configureChangeTime);

            // Cache existing videos and set up listeners
            cacheAllVideos();

            // Observe DOM mutations to handle dynamically added or removed videos
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    const addedNodes = Array.from(mutation.addedNodes);
                    addedNodes.forEach(node => {
                        const addedVideos = findVideosRecursively(node); // 查找新增节点中的 video
                        if (addedVideos.length > 0) {
                            initVideoListeners(addedVideos); // 初始化新增视频
                            log('添加新视频:', addedVideos);
                        }
                    });

                    const removedNodes = Array.from(mutation.removedNodes);
                    removedNodes.forEach(node => {
                        const removedVideos = findVideosRecursively(node); // 查找移除节点中的 video
                        if (removedVideos.length > 0) {
                            removeFromCache(removedVideos); // 移除缓存中的视频
                        }
                    });
                });
            });

            observer.observe(document.body, { childList: true, subtree: true });
            log('MutationObserver 已启动');

            // 配置进度条的焦点行为
            configureProgressBars();
        } catch (error) {
            console.error('初始化脚本时发生错误:', error);
        }
    };

    // Execute the initialization
    init();
})();
