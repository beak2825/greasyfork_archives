// ==UserScript==
// @name         Jellyfin 播放器增强功能 (弹幕+倍速)
// @namespace    https://lers.site
// @homepage     https://github.com/1412150209/Jellyfin-Player-Enhancements
// @version      1.5
// @description  为Jellyfin播放器添加弹幕支持和倍速播放功能。
// @author       lers梦貘
// @supportURL   https://github.com/1412150209/Jellyfin-Player-Enhancements/issues
// @include      http://*:8096/web/*
// @include      https://*:8096/web/*
// @grant        GM_xmlhttpRequest
// @require      https://cdn.jsdelivr.net/npm/danmaku@2.0.9/dist/danmaku.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544506/Jellyfin%20%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%E5%8A%9F%E8%83%BD%20%28%E5%BC%B9%E5%B9%95%2B%E5%80%8D%E9%80%9F%29.user.js
// @updateURL https://update.greasyfork.org/scripts/544506/Jellyfin%20%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA%E5%8A%9F%E8%83%BD%20%28%E5%BC%B9%E5%B9%95%2B%E5%80%8D%E9%80%9F%29.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // ================================================================
    // 全局状态管理和配置
    // ================================================================
    const DANMAKU_CONSTANTS = {
        LOG_LEVEL: "debug",
        DANMAKU_CONTAINER_ZINDEX: 999999,
        DEFAULT_CONFIG: {
            enabled: true,
            speed: 144,
            fontSize: 20,
            opacity: 0.8,
            mode: "rtl",
            color: "#ffffff",
        },
    };

    const GLOBAL_STATE = {
        danmakuInstance: null,
        configMenu: null,
        currentDanmuConfig: loadDanmuConfig(),
        currentSpeedConfig: loadSpeedConfig(),
        observers: new Set(),
        currentUrl: location.href,
        keydownListener: null,
        keyupListener: null,
        activeVideoElement: null,
        hasDanmakuData: false,
        isScriptActive: false,
    };

    const LOG_COLORS = {
        debug: "color: #666; background: transparent;",
        info: "color: #0099ff; background: transparent;",
        warn: "color: #ff9933; background: transparent;",
        error: "color: #ff3300; background: transparent; font-weight: bold;",
    };

    const logger = {
        debug: (...args) =>
        DANMAKU_CONSTANTS.LOG_LEVEL === "debug" &&
        console.debug(`%c[DMU][DEBUG] ${args[0]}`, LOG_COLORS.debug, ...args.slice(1)),
        info: (...args) =>
        ["debug", "info"].includes(DANMAKU_CONSTANTS.LOG_LEVEL) &&
        console.info(`%c[DMU][INFO] ${args[0]}`, LOG_COLORS.info, ...args.slice(1)),
        warn: (...args) =>
        ["debug", "info", "warn"].includes(DANMAKU_CONSTANTS.LOG_LEVEL) &&
        console.warn(`%c[DMU][WARN] ${args[0]}`, LOG_COLORS.warn, ...args.slice(1)),
        error: (...args) =>
        console.error(`%c[DMU][ERROR] ${args[0]}`, LOG_COLORS.error, ...args.slice(1)),
    };

    // ================================================================
    // 工具函数
    // ================================================================

    /**
     * 防抖函数
     * @param {Function} func 要执行的函数
     * @param {number} delay 延迟时间 (ms)
     * @returns {Function} 防抖后的函数
     */
    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    function loadDanmuConfig() {
        const config = localStorage.getItem("danmuConfig");
        return config ? JSON.parse(config) : DANMAKU_CONSTANTS.DEFAULT_CONFIG;
    }

    function saveDanmuConfig() {
        localStorage.setItem("danmuConfig", JSON.stringify(GLOBAL_STATE.currentDanmuConfig));
        logger.debug("弹幕配置已保存", GLOBAL_STATE.currentDanmuConfig);
    }

    function loadSpeedConfig() {
        const config = localStorage.getItem("speedConfig");
        return config ? JSON.parse(config) : { targetRate: 2, currentQuickRate: 1.0 };
    }

    function saveSpeedConfig() {
        localStorage.setItem("speedConfig", JSON.stringify(GLOBAL_STATE.currentSpeedConfig));
    }

    function request(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: location.origin + url,
                onload: resolve,
                onerror: reject,
            });
        });
    }

    function getMediaIdFromUrl(url) {
        try {
            const urlParams = new URL(url).searchParams;
            return (
                urlParams.get("mediaSourceId") ||
                url.match(/(?:mediaSourceId|MediaSources)[=/]([a-f0-9]{20,})/i)?.[1]
            );
        } catch (e) {
            throw new Error(`URL解析失败: ${e}`);
        }
    }

    function showFloatingMessage(message) {
        const styleId = 'jellyfin-floating-message-style';
        if (!document.getElementById(styleId)) {
            const style = document.createElement('style');
            style.id = styleId;
            style.textContent = `
              .jellyfin-floating-message {
                position: fixed;
                top: 10%;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                z-index: 2147483647;
                pointer-events: none;
                font-size: 1.1em;
                text-align: center;
                box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
                opacity: 0;
                transition: opacity 0.3s ease;
              }
            `;
            document.head.appendChild(style);
        }

        const existingMessages = document.querySelectorAll('.jellyfin-floating-message');
        existingMessages.forEach(el => el.remove());

        const messageEl = document.createElement('div');
        messageEl.className = 'jellyfin-floating-message';
        messageEl.textContent = message;

        const fullscreenElement = document.fullscreenElement ||
              document.webkitFullscreenElement ||
              document.mozFullScreenElement ||
              document.msFullscreenElement;

        const targetContainer = fullscreenElement || document.body;
        targetContainer.appendChild(messageEl);

        setTimeout(() => {
            messageEl.style.opacity = '1'
        }, 50);

        setTimeout(() => {
            messageEl.style.opacity = '0';
            setTimeout(() => {
                if (messageEl.parentElement) {
                    messageEl.remove();
                }
            }, 300);
        }, 2000);
    }

    function isInInputElement(event) {
        const target = event.target;
        return (
            target.tagName === 'INPUT' ||
            target.tagName === 'TEXTAREA' ||
            target.tagName === 'SELECT' ||
            target.isContentEditable ||
            target.closest('[contenteditable="true"]')
        );
    }

    // ================================================================
    // 弹幕功能核心
    // ================================================================
    async function fetchDanmakuData(mediaSourceId) {
        logger.debug(`开始获取弹幕数据，mediaSourceId: ${mediaSourceId}`);
        try {
            const apiEndpoint = `/api/danmu/${mediaSourceId}/raw`;
            logger.info(`开始请求弹幕数据，端点: ${apiEndpoint}`);

            const timeoutPromise = new Promise((_, reject) =>
                                               setTimeout(() => reject(new Error("请求超时")), 5000)
                                              );

            const response = await Promise.race([
                request(apiEndpoint),
                timeoutPromise,
            ]);

            logger.debug(`收到响应状态: ${response.status}`, {
                status: response.status,
                length: response.responseText?.length,
            });

            if (response.status !== 200) {
                throw new Error(`HTTP ${response.status} - ${response.statusText}`);
            }

            if (!response.responseText?.trim()) {
                logger.warn("收到空响应内容，可能无弹幕");
                return null;
            }

            return response.responseText;
        } catch (error) {
            logger.error("弹幕数据获取失败:", {
                error: error.message,
                mediaSourceId,
                stack: error.stack,
            });
            return null;
        }
    }

    function parseDanmakuData(xmlData) {
        logger.debug("开始解析弹幕XML数据...");
        try {
            const sanitizedXml = xmlData
            .replace(/[\x00-\x1F\x7F]/g, "")
            .replace(/&(?!(amp|lt|gt|quot|apos));/g, "&amp;");

            const parser = new DOMParser();
            const doc = parser.parseFromString(sanitizedXml, "text/xml");

            const errorNode = doc.querySelector("parsererror");
            if (errorNode) {
                throw new Error(`XML解析错误: ${errorNode.textContent.slice(0, 100)}`);
            }

            const danmuNodes = doc.getElementsByTagName("d");
            logger.info(`解析到有效弹幕节点: ${danmuNodes.length}`);
            if (danmuNodes.length === 0) return null;

            return Array.from(danmuNodes)
                .map((node, index) => {
                try {
                    const params = (node.getAttribute("p") || "").split(",").map(parseFloat);
                    const [time = 0, , , colorValue = GLOBAL_STATE.currentDanmuConfig.color] = params;

                    return {
                        text: node.textContent?.trim() || "[空弹幕内容]",
                        time: Math.max(0, time),
                        mode: GLOBAL_STATE.currentDanmuConfig.mode,
                        style: {
                            fontSize: `${GLOBAL_STATE.currentDanmuConfig.fontSize}px`,
                            color: /^#[0-9A-F]{6}$/i.test(colorValue) ? colorValue : GLOBAL_STATE.currentDanmuConfig.color,
                        },
                    };
                } catch (nodeError) {
                    logger.warn("弹幕节点解析异常，跳过处理:", {
                        error: nodeError.message,
                        rawText: node.outerHTML.slice(0, 100),
                        index,
                    });
                    return null;
                }
            })
                .filter(Boolean);
        } catch (parseError) {
            logger.error("XML解析严重错误:", {
                error: parseError.message,
                stack: parseError.stack,
                sampleData: xmlData.slice(0, 200),
            });
            return null;
        }
    }

    function createDanmakuContainer(video) {
        logger.debug("创建弹幕容器...");
        const old = video.parentNode.querySelectorAll(".danmaku-container");
        if (old.length !== 0) {
            old.forEach((container) => container.remove());
        }

        const container = document.createElement("div");
        container.className = "danmaku-container";
        container.style.cssText = `
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              z-index: ${DANMAKU_CONSTANTS.DANMAKU_CONTAINER_ZINDEX};
              pointer-events: none;
        `;

        const wrapper = video.closest(".videoPlayerContainer") || video.parentElement;
        if (!wrapper) {
            logger.error("未找到视频容器元素");
            return null;
        }

        if (window.getComputedStyle(wrapper).position === "static") {
            wrapper.style.position = "relative";
        }
        wrapper.appendChild(container);
        logger.info("弹幕容器创建成功");
        return container;
    }

    function handleResize() {
        if (GLOBAL_STATE.danmakuInstance) {
            GLOBAL_STATE.danmakuInstance.resize();
        }
    }

    function updateDanmuVisibility() {
        if (GLOBAL_STATE.danmakuInstance) {
            GLOBAL_STATE.currentDanmuConfig.enabled ? GLOBAL_STATE.danmakuInstance.show() : GLOBAL_STATE.danmakuInstance.hide();
        }
    }

    function toggleDanmaku() {
        GLOBAL_STATE.currentDanmuConfig.enabled = !GLOBAL_STATE.currentDanmuConfig.enabled;
        saveDanmuConfig();
        updateDanmuVisibility();
        showFloatingMessage(`弹幕已${GLOBAL_STATE.currentDanmuConfig.enabled ? "开启" : "关闭"}`);
    }

    function createDanmuConfigMenu() {
        logger.debug("创建弹幕设置菜单...");
        const oldBackdrop = document.querySelector(".danmu-menu-backdrop");
        const oldMenu = document.querySelector(".danmu-menu-container");
        if (oldBackdrop) oldBackdrop.remove();
        if (oldMenu) oldMenu.remove();

        const backdrop = document.createElement("div");
        backdrop.className = "danmu-menu-backdrop MuiBackdrop-root";
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 999998;
            opacity: 0;
            transition: opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            pointer-events: none;
        `;

        GLOBAL_STATE.configMenu = document.createElement("div");
        GLOBAL_STATE.configMenu.className = "MuiPaper-root MuiMenu-paper MuiPaper-elevation8 danmu-menu-container";
        GLOBAL_STATE.configMenu.style.cssText = `
            min-width: 280px;
            padding: 8px 0;
            position: fixed;
            z-index: 999999;
            opacity: 0;
            transform: translateY(-10px);
            border: 1px black solid;
            background-color: rgba(0, 0, 0, 0.9);
            transition:
                opacity 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms,
                transform 225ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
            color: #fff;
            border-radius: 4px;
        `;
        GLOBAL_STATE.configMenu.innerHTML = `
            <div class="MuiList-root MuiList-padding">
                <div class="MuiListItem-root MuiListItem-gutters" style="padding: 8px 16px;">
                    <div class="MuiTypography-root MuiTypography-subtitle1" style="flex-grow:1; display:flex; align-items:center;">
                        <i class="material-icons MuiListItemIcon-root" style="margin-right:8px; color: inherit;">tune</i>
                        弹幕设置
                    </div>
                </div>
                <hr class="MuiDivider-root" style="margin: 8px 0; border: 0; border-top: 1px solid rgba(255, 255, 255, 0.12);">
                <div class="MuiListItem-root" style="display: block; padding: 8px 16px;">
                    <div class="MuiListItemText-root">
                        <span class="MuiTypography-root MuiTypography-body2">速度 (<span id="danmuSpeedValue">${GLOBAL_STATE.currentDanmuConfig.speed}</span>)</span>
                        <div class="MuiSlider-root MuiSlider-colorPrimary" style="margin-top: 8px;">
                            <input id="danmuSpeed" type="range"
                                min="50" max="600" value="${GLOBAL_STATE.currentDanmuConfig.speed}"
                                class="MuiSlider-track MuiSlider-colorPrimary"
                                style="width: 100%; -webkit-appearance: none; height: 4px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; outline: none;">
                        </div>
                    </div>
                </div>
                <div class="MuiListItem-root" style="display: block; padding: 8px 16px;">
                    <div class="MuiListItemText-root">
                        <span class="MuiTypography-root MuiTypography-body2">字号 (<span id="danmuSizeValue">${GLOBAL_STATE.currentDanmuConfig.fontSize}</span>)</span>
                        <div class="MuiSlider-root MuiSlider-colorPrimary" style="margin-top: 8px;">
                            <input id="danmuSize" type="range"
                                min="12" max="36" value="${GLOBAL_STATE.currentDanmuConfig.fontSize}"
                                class="MuiSlider-track MuiSlider-colorPrimary"
                                style="width: 100%; -webkit-appearance: none; height: 4px; background: rgba(255, 255, 255, 0.3); border-radius: 2px; outline: none;">
                        </div>
                    </div>
                </div>
                <div class="MuiListItem-root" style="padding: 8px 16px; display:flex; align-items:center; justify-content: space-between;">
                    <span class="MuiTypography-root MuiTypography-body2">颜色</span>
                    <input id="danmuColor" type="color"
                        value="${GLOBAL_STATE.currentDanmuConfig.color}"
                        class="MuiInput-input"
                        style="height: 36px; padding: 4px; border: none; background: transparent; border-radius: 4px; cursor: pointer;">
                </div>
            </div>
        `;
        document.body.appendChild(backdrop);
        document.body.appendChild(GLOBAL_STATE.configMenu);
        logger.debug("弹幕设置菜单创建并注入到DOM");

        const applyDanmuChanges = debounce(() => {
            saveDanmuConfig();
            logger.debug("应用弹幕设置变更（防抖）", GLOBAL_STATE.currentDanmuConfig);
            if (GLOBAL_STATE.danmakuInstance) {
                // 直接更新实例属性，避免重新注入
                GLOBAL_STATE.danmakuInstance.speed = GLOBAL_STATE.currentDanmuConfig.speed;
                GLOBAL_STATE.danmakuInstance.comments.forEach(comment => {
                    comment.style.fontSize = `${GLOBAL_STATE.currentDanmuConfig.fontSize}px`;
                    comment.style.color = GLOBAL_STATE.currentDanmuConfig.color;
                });
                GLOBAL_STATE.danmakuInstance.start();
            }
        }, 200);

        backdrop.addEventListener('click', hideDanmuMenu);
        GLOBAL_STATE.configMenu.querySelector("#danmuSpeed").addEventListener("input", (e) => {
            e.preventDefault();
            GLOBAL_STATE.currentDanmuConfig.speed = parseInt(e.target.value);
            document.getElementById("danmuSpeedValue").textContent = GLOBAL_STATE.currentDanmuConfig.speed;
            applyDanmuChanges();
        });
        GLOBAL_STATE.configMenu.querySelector("#danmuSize").addEventListener("input", (e) => {
            e.preventDefault();
            GLOBAL_STATE.currentDanmuConfig.fontSize = parseInt(e.target.value);
            document.getElementById("danmuSizeValue").textContent = GLOBAL_STATE.currentDanmuConfig.fontSize;
            applyDanmuChanges();
        });
        GLOBAL_STATE.configMenu.querySelector("#danmuColor").addEventListener("input", (e) => {
            e.preventDefault();
            GLOBAL_STATE.currentDanmuConfig.color = e.target.value;
            applyDanmuChanges();
        });
        // 绑定点击事件，阻止冒泡
        GLOBAL_STATE.configMenu.addEventListener('click', (e) => e.stopPropagation());
    }

    function showDanmuMenu(button) {
        if (!GLOBAL_STATE.configMenu) {
            createDanmuConfigMenu();
        }
        const rect = button.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        let top = rect.top - GLOBAL_STATE.configMenu.offsetHeight - 10;
        if (top < 0) {
            top = rect.bottom + 10;
        }

        GLOBAL_STATE.configMenu.style.left = `${rect.left}px`;
        GLOBAL_STATE.configMenu.style.top = `${top}px`;

        setTimeout(() => {
            GLOBAL_STATE.configMenu.style.opacity = "1";
            GLOBAL_STATE.configMenu.style.transform = "translateY(0)";
            document.querySelector('.danmu-menu-backdrop').style.opacity = "1";
            document.querySelector('.danmu-menu-backdrop').style.pointerEvents = "all";
        }, 10);
        logger.debug("显示弹幕设置菜单");
    }

    function hideDanmuMenu() {
        if (GLOBAL_STATE.configMenu) {
            GLOBAL_STATE.configMenu.style.opacity = "0";
            GLOBAL_STATE.configMenu.style.transform = "translateY(-10px)";
        }
        const backdrop = document.querySelector('.danmu-menu-backdrop');
        if (backdrop) {
            backdrop.style.opacity = "0";
            backdrop.style.pointerEvents = "none";
        }
        logger.debug("隐藏弹幕设置菜单");
    }

    async function injectDanmaku(video) {
        logger.debug("开始注入弹幕...");
        if (!video) return;
        const src = video.src;
        if (!src || src === "about:blank") {
            logger.warn("无效的视频源，跳过弹幕注入");
            return;
        }

        try {
            const mediaSourceId = getMediaIdFromUrl(src);
            const danmakuData = await fetchDanmakuData(mediaSourceId);

            if (!danmakuData) {
                showFloatingMessage("暂未找到弹幕");
                GLOBAL_STATE.hasDanmakuData = false;
                logger.info("未找到弹幕数据，不注入弹幕和按钮");
                return;
            }

            const comments = parseDanmakuData(danmakuData);
            if (!comments || comments.length === 0) {
                showFloatingMessage("解析无有效弹幕");
                GLOBAL_STATE.hasDanmakuData = false;
                logger.info("解析结果为空，不注入弹幕和按钮");
                return;
            }

            GLOBAL_STATE.hasDanmakuData = true;

            if (GLOBAL_STATE.danmakuInstance) {
                window.removeEventListener("resize", handleResize);
                GLOBAL_STATE.danmakuInstance.destroy();
                GLOBAL_STATE.danmakuInstance = null;
            }

            const container = createDanmakuContainer(video);
            if (!container) {
                logger.error("弹幕容器创建失败");
                return;
            }

            GLOBAL_STATE.danmakuInstance = new Danmaku({
                container: container,
                media: video,
                comments: comments.map((comment) => ({
                    ...comment,
                    mode: GLOBAL_STATE.currentDanmuConfig.mode,
                    style: {
                        fontSize: `${GLOBAL_STATE.currentDanmuConfig.fontSize}px`,
                        color: GLOBAL_STATE.currentDanmuConfig.color,
                        textShadow: '-1px -1px #000, -1px 1px #000, 1px -1px #000, 1px 1px #000'
                    },
                })),
                engine: "DOM",
                speed: GLOBAL_STATE.currentDanmuConfig.speed,
            });

            window.addEventListener("resize", handleResize);
            updateDanmuVisibility();
            logger.info("弹幕引擎初始化完成");
        } catch (e) {
            logger.error("弹幕引擎初始化失败:", e);
            GLOBAL_STATE.hasDanmakuData = false;
        }
    }

    // ================================================================
    // 倍速功能核心
    // ================================================================
    function bindSpeedControls(video) {
        if (GLOBAL_STATE.keydownListener) {
            document.removeEventListener("keydown", GLOBAL_STATE.keydownListener, true);
        }
        if (GLOBAL_STATE.keyupListener) {
            document.removeEventListener("keyup", GLOBAL_STATE.keyupListener, true);
        }

        const key = "ArrowRight";
        const increaseKey = "Equal";
        const decreaseKey = "Minus";
        const quickIncreaseKey = "BracketRight";
        const quickDecreaseKey = "BracketLeft";
        const resetSpeedKey = "KeyP";
        let keyDownTime = 0;
        let originalRate = 1.0; // 修复：将原始速度设为初始值
        let isSpeedUp = false;

        const { targetRate, currentQuickRate } = GLOBAL_STATE.currentSpeedConfig;

        GLOBAL_STATE.keydownListener = (e) => {
            if (isInInputElement(e)) return;
            logger.debug(`键盘按下: ${e.code}`);

            if (e.code === key) {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (!keyDownTime) {
                    keyDownTime = Date.now();
                }

                if (!isSpeedUp && (Date.now() - keyDownTime) > 300) {
                    isSpeedUp = true;
                    originalRate = video.playbackRate;
                    video.playbackRate = GLOBAL_STATE.currentSpeedConfig.targetRate;
                    showFloatingMessage(`开始 ${GLOBAL_STATE.currentSpeedConfig.targetRate} 倍速播放`);
                    logger.info(`长按 "${key}" -> 切换至 ${GLOBAL_STATE.currentSpeedConfig.targetRate}x 倍速，原始速度为 ${originalRate}x`);
                }
            }
            if (e.code === quickIncreaseKey) {
                e.preventDefault();
                e.stopImmediatePropagation();
                GLOBAL_STATE.currentSpeedConfig.currentQuickRate = GLOBAL_STATE.currentSpeedConfig.currentQuickRate === 1.0 ? 1.5 : GLOBAL_STATE.currentSpeedConfig.currentQuickRate + 0.5;
                video.playbackRate = GLOBAL_STATE.currentSpeedConfig.currentQuickRate;
                showFloatingMessage(`当前播放速度：${GLOBAL_STATE.currentSpeedConfig.currentQuickRate}x`);
                saveSpeedConfig();
                logger.info(`快捷加速 "${quickIncreaseKey}" -> 当前速度 ${video.playbackRate}x`);
            }
            if (e.code === quickDecreaseKey) {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (GLOBAL_STATE.currentSpeedConfig.currentQuickRate > 0.5) {
                    GLOBAL_STATE.currentSpeedConfig.currentQuickRate -= 0.5;
                    video.playbackRate = GLOBAL_STATE.currentSpeedConfig.currentQuickRate;
                    showFloatingMessage(`当前播放速度：${GLOBAL_STATE.currentSpeedConfig.currentQuickRate}x`);
                    saveSpeedConfig();
                    logger.info(`快捷减速 "${quickDecreaseKey}" -> 当前速度 ${video.playbackRate}x`);
                }
            }
            if (e.code === resetSpeedKey) {
                e.preventDefault();
                e.stopImmediatePropagation();
                GLOBAL_STATE.currentSpeedConfig.currentQuickRate = 1.0;
                video.playbackRate = 1.0;
                showFloatingMessage("恢复正常播放速度");
                saveSpeedConfig();
                logger.info(`重置速度 "${resetSpeedKey}" -> 恢复至 1.0x`);
            }
            if (e.code === increaseKey) {
                e.preventDefault();
                e.stopImmediatePropagation();
                GLOBAL_STATE.currentSpeedConfig.targetRate += 0.5;
                showFloatingMessage(`下次倍速：${GLOBAL_STATE.currentSpeedConfig.targetRate}`);
                saveSpeedConfig();
                logger.info(`提高预设倍速 "${increaseKey}" -> 下次倍速为 ${GLOBAL_STATE.currentSpeedConfig.targetRate}x`);
            }
            if (e.code === decreaseKey) {
                e.preventDefault();
                e.stopImmediatePropagation();
                if (GLOBAL_STATE.currentSpeedConfig.targetRate > 0.5) {
                    GLOBAL_STATE.currentSpeedConfig.targetRate -= 0.5;
                    showFloatingMessage(`下次倍速：${GLOBAL_STATE.currentSpeedConfig.targetRate}`);
                    saveSpeedConfig();
                    logger.info(`降低预设倍速 "${decreaseKey}" -> 下次倍速为 ${GLOBAL_STATE.currentSpeedConfig.targetRate}x`);
                } else {
                    showFloatingMessage("倍速已达到最小值 0.5");
                    logger.warn(`降低预设倍速失败，已是最小值`);
                }
            }
        };

        GLOBAL_STATE.keyupListener = (e) => {
            if (isInInputElement(e)) return;

            if (e.code === key) {
                e.preventDefault();
                e.stopImmediatePropagation();
                const pressTime = Date.now() - keyDownTime;
                logger.debug(`键盘松开: ${e.code}, 按下时长: ${pressTime}ms`);

                if (pressTime < 300) {
                    video.currentTime += 5;
                    showFloatingMessage(`快进 5s`);
                    logger.info("短按 -> 快进 5s");
                }
                if (isSpeedUp) {
                    video.playbackRate = originalRate;
                    showFloatingMessage(`恢复 ${originalRate} 倍速播放`);
                    isSpeedUp = false;
                    logger.info(`长按松开 -> 恢复 ${originalRate}x 倍速`);
                }
                keyDownTime = 0;
            }
        };

        document.addEventListener("keydown", GLOBAL_STATE.keydownListener, true);
        document.addEventListener("keyup", GLOBAL_STATE.keyupListener, true);
        logger.info("倍速快捷键已绑定");
    }

    // ================================================================
    // 使用说明弹窗
    // ================================================================
    function showHelpDialog() {
        logger.debug("显示使用说明弹窗...");
        const existingBackdrop = document.querySelector(".jellyfin-help-dialog-backdrop");
        if (existingBackdrop) {
            existingBackdrop.remove();
        }

        const backdrop = document.createElement("div");
        backdrop.className = "jellyfin-help-dialog-backdrop";
        backdrop.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 2147483647;
            display: flex;
            align-items: center;
            justify-content: center;
        `;

        const dialog = document.createElement("div");
        dialog.className = "jellyfin-help-dialog-content";
        dialog.style.cssText = `
            background-color: #2e2e2e;
            color: #fff;
            padding: 24px;
            border-radius: 8px;
            max-width: 500px;
            width: 90%;
            max-height: 80vh;
            overflow-y: auto;
            position: relative;
            box-shadow: 0px 11px 15px -7px rgba(0,0,0,0.2), 0px 24px 38px 3px rgba(0,0,0,0.14), 0px 9px 46px 8px rgba(0,0,0,0.12);
        `;

        dialog.innerHTML = `
            <div style="padding-bottom: 16px;">
                <h2 style="margin: 0; font-size: 1.5em;">脚本使用说明</h2>
            </div>
            <div style="padding: 0;">
                <p>本脚本为 Jellyfin 播放器添加了弹幕和倍速增强功能。</p>
                <h4 style="margin-top: 16px;">弹幕功能</h4>
                <p>弹幕功能基于<a href="https://github.com/cxfksword/jellyfin-plugin-danmu" target="_blank" style="color: yellow; text-decoration: none;">jellyfin-plugin-danmu</a>插件，请先安装该插件</p>
                <ul style="list-style-type: disc; margin: 8px 0 0 20px; padding: 0;">
                    <li style="margin-bottom: 8px;color: red">如果当前视频未能成功获取到弹幕，则不会有以下按钮</li>
                    <li style="margin-bottom: 8px;">点击播放器右下角弹幕按钮 <i class="material-icons" style="font-size: 1em; vertical-align: middle;">closed_caption</i> 切换弹幕开关。</li>
                    <li style="margin-bottom: 8px;">点击设置按钮 <i class="material-icons" style="font-size: 1em; vertical-align: middle;">tune</i> 打开弹幕设置菜单。</li>
                    <li>在设置菜单中可以调整弹幕速度、字号和颜色。</li>
                </ul>
                <h4 style="margin-top: 16px;">倍速功能</h4>
                <p>倍速播放仅在键盘操作时生效，不会影响界面上的播放速度显示。</p>
                <ul style="list-style-type: disc; margin: 8px 0 0 20px; padding: 0;">
                    <li style="margin-bottom: 8px;"><kbd>→</kbd> (长按): 切换至倍速播放 (当前 ${GLOBAL_STATE.currentSpeedConfig.targetRate} 倍)。松开恢复正常。</li>
                    <li style="margin-bottom: 8px;"><kbd>→</kbd> (短按): 快进 5 秒。</li>
                    <li style="margin-bottom: 8px;"><kbd>[</kbd> : 减慢当前播放速度 0.5 倍。</li>
                    <li style="margin-bottom: 8px;"><kbd>]</kbd> : 加快当前播放速度 0.5 倍。</li>
                    <li style="margin-bottom: 8px;"><kbd>-</kbd> : 减小长按 <kbd>→</kbd> 键的预设倍速。</li>
                    <li style="margin-bottom: 8px;"><kbd>=</kbd> : 增大长按 <kbd>→</kbd> 键的预设倍速。</li>
                    <li><kbd>P</kbd> : 恢复正常播放速度。</li>
                </ul>
                <div style="padding-top: 24px; text-align: right;">
                    <button class="jellyfin-dialog-close-btn" style="background-color: #00a4dc; color: #fff; padding: 8px 20px; border: none; border-radius: 4px; cursor: pointer; font-size: 1em;">
                        关闭
                    </button>
                </div>
            </div>
        `;
        backdrop.appendChild(dialog);
        document.body.appendChild(backdrop);

        const closeButton = dialog.querySelector(".jellyfin-dialog-close-btn");
        closeButton.addEventListener("click", () => {
            logger.debug("关闭使用说明弹窗");
            backdrop.remove();
        });
        backdrop.addEventListener("click", (e) => {
            if (e.target === backdrop) {
                logger.debug("点击遮罩，关闭使用说明弹窗");
                backdrop.remove();
            }
        });
    }

    // ================================================================
    // UI 按钮注入
    // ================================================================
    function injectControls(buttonContainer) {
        logger.debug("尝试注入控制按钮...");
        const old = buttonContainer.querySelector(".jellyfin-enhancer-controls");
        if (old) {
            old.remove();
        }

        const btnGroup = document.createElement("div");
        btnGroup.className = "MuiButtonGroup-root MuiButtonGroup-textPrimary jellyfin-enhancer-controls";
        btnGroup.style.cssText = "display: flex; gap: 4px; margin-left: 8px;";
        btnGroup.style.backgroudColor = "transparent"

        // 仅在有弹幕数据时注入弹幕相关按钮
        if (GLOBAL_STATE.hasDanmakuData) {
            logger.info("已检测到弹幕数据，注入弹幕控制按钮");
            const toggleBtn = document.createElement("button");
            toggleBtn.className = `btnUserRating autoSize paper-icon-button-light jellyfin-enhancer-btn`;
            toggleBtn.title = "弹幕开关";
            toggleBtn.innerHTML = `
                <span class="MuiIcon-root material-icons" style="color: white;">${GLOBAL_STATE.currentDanmuConfig.enabled ? 'closed_caption' : 'closed_caption_off'}</span>
            `;
            toggleBtn.addEventListener("click", function() {
                toggleDanmaku();
                const icon = this.querySelector('.material-icons');
                icon.textContent = GLOBAL_STATE.currentDanmuConfig.enabled ? 'closed_caption' : 'closed_caption_off';
            });

            const configBtn = document.createElement("button");
            configBtn.className = "btnUserRating autoSize paper-icon-button-light jellyfin-enhancer-btn";
            configBtn.title = "弹幕设置";
            configBtn.innerHTML = `
                <span class="MuiIcon-root material-icons" style="color:white;">tune</span>
            `;
            configBtn.addEventListener("click", function(e) {
                e.stopPropagation();
                createDanmuConfigMenu();
                showDanmuMenu(this);
            });
            btnGroup.appendChild(toggleBtn);
            btnGroup.appendChild(configBtn);
        } else {
            logger.info("未检测到弹幕数据，跳过弹幕控制按钮注入");
        }

        const helpBtn = document.createElement("button");
        helpBtn.className = "btnUserRating autoSize paper-icon-button-light jellyfin-enhancer-btn";
        helpBtn.title = "使用说明";
        helpBtn.innerHTML = `
            <span class="MuiIcon-root material-icons" style="color:white;">help_outline</span>
        `;
        helpBtn.addEventListener("click", function(e) {
            e.stopPropagation();
            showHelpDialog();
        });
        btnGroup.appendChild(helpBtn);


        const subtitlesBtn = buttonContainer.querySelector('.btnSubtitles');
        if (subtitlesBtn) {
            subtitlesBtn.after(btnGroup);
            logger.info("控制按钮已注入在字幕按钮后");
        } else {
            const volumeButtons = buttonContainer.querySelector('.volumeButtons');
            if (volumeButtons) {
                buttonContainer.insertBefore(btnGroup, volumeButtons);
                logger.info("控制按钮已注入在音量按钮前");
            } else {
                buttonContainer.appendChild(btnGroup);
                logger.warn("未找到合适的注入位置，控制按钮已追加到按钮容器末尾。");
            }
        }
    }

    // ================================================================
    // 主入口和观察器
    // ================================================================
    function cleanup() {
        if (!GLOBAL_STATE.isScriptActive) return;
        logger.info("正在执行清理...");
        if (GLOBAL_STATE.keydownListener) {
            document.removeEventListener("keydown", GLOBAL_STATE.keydownListener, true);
            GLOBAL_STATE.keydownListener = null;
        }
        if (GLOBAL_STATE.keyupListener) {
            document.removeEventListener("keyup", GLOBAL_STATE.keyupListener, true);
            GLOBAL_STATE.keyupListener = null;
        }
        GLOBAL_STATE.observers.forEach((observer) => {
            if (observer && observer.disconnect) observer.disconnect();
        });
        GLOBAL_STATE.observers.clear();
        if (GLOBAL_STATE.danmakuInstance) {
            window.removeEventListener("resize", handleResize);
            GLOBAL_STATE.danmakuInstance.destroy();
            GLOBAL_STATE.danmakuInstance = null;
        }
        hideDanmuMenu();
        const oldControls = document.querySelector(".jellyfin-enhancer-controls");
        if (oldControls) oldControls.remove();
        GLOBAL_STATE.isScriptActive = false;
        GLOBAL_STATE.activeVideoElement = null;
        GLOBAL_STATE.hasDanmakuData = false;
        logger.info("脚本环境已清理完成");
    }

    async function init() {
        if (GLOBAL_STATE.isScriptActive) {
            logger.debug("脚本已激活，跳过初始化。");
            return;
        }

        logger.info("开始初始化脚本...");
        cleanup();

        let video = null;
        try {
            video = await new Promise((resolve, reject) => {
                const check = () => document.querySelector("video.htmlvideoplayer");
                let count = 0;
                const interval = setInterval(() => {
                    const v = check();
                    if (v && v.readyState >= 1) {
                        clearInterval(interval);
                        resolve(v);
                    } else if (count++ > 50) { // 5秒超时
                        clearInterval(interval);
                        reject(new Error("视频元素查找超时"));
                    }
                }, 100);
            });
            GLOBAL_STATE.activeVideoElement = video;
            GLOBAL_STATE.isScriptActive = true;
            logger.info("找到视频元素，准备注入增强功能:", video);
        } catch (e) {
            logger.warn("未找到视频元素，等待下一次机会:", e.message);
            return;
        }

        bindSpeedControls(video);
        await injectDanmaku(video); // 等待弹幕注入完成，以确定是否有弹幕数据

        const controlBarObserver = new MutationObserver((mutations, observer) => {
            const buttonContainer = document.querySelector(".videoOsdBottom .buttons.focuscontainer-x");
            if (buttonContainer) {
                injectControls(buttonContainer);
                observer.disconnect();
                GLOBAL_STATE.observers.delete(observer);
            }
        });
        controlBarObserver.observe(document.body, { childList: true, subtree: true });
        GLOBAL_STATE.observers.add(controlBarObserver);

        const videoSrcObserver = new MutationObserver((mutations) => {
            if (mutations.some(m => m.attributeName === "src")) {
                logger.info("视频 src 变化，重新加载弹幕");
                injectDanmaku(video);
            }
        });
        videoSrcObserver.observe(video, { attributes: true, attributeFilter: ["src"] });
        GLOBAL_STATE.observers.add(videoSrcObserver);

        const videoParent = video.parentElement;
        const videoRemovalObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                for (const removedNode of mutation.removedNodes) {
                    if (removedNode === video) {
                        logger.info("视频元素被移除，执行清理。");
                        cleanup();
                        videoRemovalObserver.disconnect();
                        GLOBAL_STATE.observers.delete(videoRemovalObserver);
                        return;
                    }
                }
            }
        });
        videoRemovalObserver.observe(videoParent, { childList: true });
        GLOBAL_STATE.observers.add(videoRemovalObserver);
    }

    function watchUrlChanges() {
        let lastUrl = location.href;
        new MutationObserver(() => {
            const url = location.href;
            if (url !== lastUrl) {
                lastUrl = url;
                logger.info("URL 变化，重新初始化。");
                cleanup();
                if (url.includes("/web/#/video")) {
                    setTimeout(init, 500);
                }
            }
        }).observe(document.body, { childList: true, subtree: true });

        if (lastUrl.includes("/web/#/video")) {
            setTimeout(init, 500);
        }
    }

    logger.info("Jellyfin 增强脚本已加载");
    watchUrlChanges();
})();