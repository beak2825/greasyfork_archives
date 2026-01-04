// ==UserScript==
// @name         深圳大学体育场馆自动抢票
// @namespace    http://tampermonkey.net/
// @version      1.2.1
// @description  深圳大学体育场馆自动预约脚本 - iOS、安卓、移动端、桌面端完全兼容
// @author       zskfree
// @match        https://ehall.szu.edu.cn/qljfwapp/sys/lwSzuCgyy/*
// @match        https://ehall-443.webvpn.szu.edu.cn/qljfwapp/sys/lwSzuCgyy/*
// @icon         🎾
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      qyapi.weixin.qq.com
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537386/%E6%B7%B1%E5%9C%B3%E5%A4%A7%E5%AD%A6%E4%BD%93%E8%82%B2%E5%9C%BA%E9%A6%86%E8%87%AA%E5%8A%A8%E6%8A%A2%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/537386/%E6%B7%B1%E5%9C%B3%E5%A4%A7%E5%AD%A6%E4%BD%93%E8%82%B2%E5%9C%BA%E9%A6%86%E8%87%AA%E5%8A%A8%E6%8A%A2%E7%A5%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // ==================== 设备检测模块 ====================
    const Device = (() => {
        const ua = navigator.userAgent;
        const platform = navigator.platform;
        const maxTouch = navigator.maxTouchPoints;

        return {
            isMobile: /iPhone|iPad|iPod|Android|Mobile/i.test(ua),
            isIOS: /iPhone|iPad|iPod/i.test(ua),
            isIPad: /iPad/i.test(ua) || (platform === 'MacIntel' && maxTouch > 1),
            hasPointer: !!window.PointerEvent,
            get isTouch() {
                return this.isMobile || this.isIPad || (maxTouch > 0 && /Android|Mobile/i.test(ua));
            }
        };
    })();

    // ==================== 样式管理器 ====================
    const Styles = {
        getSize: (desktop, mobile, iPad) => Device.isIPad ? iPad : (Device.isMobile ? mobile : desktop),

        get input() {
            const padding = this.getSize('8px', '12px', '14px');
            const fontSize = this.getSize('14px', '16px', '18px');
            return `width:100%;padding:${padding};border:none;border-radius:6px;background:rgba(255,255,255,0.95);color:#333;font-size:${fontSize};box-sizing:border-box;-webkit-appearance:none;appearance:none;outline:none;`;
        },

        get button() {
            const padding = this.getSize('12px', '15px', '18px');
            const fontSize = this.getSize('16px', '18px', '20px');
            return `width:100%;padding:${padding};border:none;border-radius:8px;cursor:pointer;font-size:${fontSize};font-weight:bold;transition:all 0.3s;text-shadow:1px 1px 2px rgba(0,0,0,0.3);-webkit-appearance:none;appearance:none;outline:none;-webkit-tap-highlight-color:transparent;`;
        }
    };

    // ==================== 存储管理器 ====================
    const Storage = {
        prefix: 'szu_sports_',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        version: '1.2.1',

        set(key, value) {
            const data = { value, timestamp: Date.now(), version: this.version };
            const fullKey = this.prefix + key;

            try {
                localStorage.setItem(fullKey, JSON.stringify(data));
                return true;
            } catch {
                try {
                    sessionStorage.setItem(fullKey, JSON.stringify(data));
                    return true;
                } catch {
                    if (!window.memoryStorage) window.memoryStorage = new Map();
                    window.memoryStorage.set(fullKey, data);
                    return true;
                }
            }
        },

        get(key, defaultValue = null) {
            const fullKey = this.prefix + key;
            const now = Date.now();

            const tryParse = (item) => {
                if (!item) return null;
                try {
                    const data = JSON.parse(item);
                    if (data.version !== this.version || (data.timestamp && now - data.timestamp > this.maxAge)) {
                        this.remove(key);
                        return null;
                    }
                    return data.value !== undefined ? data.value : data;
                } catch {
                    this.remove(key);
                    return null;
                }
            };

            // 尝试 localStorage
            const localItem = tryParse(localStorage.getItem(fullKey));
            if (localItem !== null) return localItem;

            // 尝试 sessionStorage
            const sessionItem = tryParse(sessionStorage.getItem(fullKey));
            if (sessionItem !== null) return sessionItem;

            // 尝试内存存储
            if (window.memoryStorage?.has(fullKey)) {
                const data = window.memoryStorage.get(fullKey);
                return data.value !== undefined ? data.value : data;
            }

            return defaultValue;
        },

        remove(key) {
            const fullKey = this.prefix + key;
            try { localStorage.removeItem(fullKey); } catch { }
            try { sessionStorage.removeItem(fullKey); } catch { }
            window.memoryStorage?.delete(fullKey);
        },

        cleanup() {
            const now = Date.now();
            let count = 0;

            [localStorage, sessionStorage].forEach(storage => {
                try {
                    for (let i = storage.length - 1; i >= 0; i--) {
                        const key = storage.key(i);
                        if (key?.startsWith(this.prefix)) {
                            try {
                                const data = JSON.parse(storage.getItem(key));
                                if (data.timestamp && now - data.timestamp > this.maxAge) {
                                    storage.removeItem(key);
                                    count++;
                                }
                            } catch {
                                storage.removeItem(key);
                                count++;
                            }
                        }
                    }
                } catch { }
            });

            return count;
        }
    };

    // ==================== 网络错误处理器 ====================
    const NetworkErrorHandler = {
        categorize(error, response = null) {
            if (response) {
                if (response.status === 429) return 'rate_limit';
                if (response.status >= 500) return 'server_error';
                if (response.status === 401 || response.status === 403) return 'auth_error';
                if (response.status >= 400) return 'client_error';
            }
            if (error.name === 'AbortError' || error.message.includes('超时')) return 'timeout';
            if (error.message.includes('网络')) return 'network_error';
            return 'unknown_error';
        },

        shouldRetry(errorType, retryCount = 0) {
            const maxRetries = { rate_limit: 3, server_error: 5, network_error: 3, timeout: 3, unknown_error: 2 };
            const noRetry = ['auth_error', 'client_error'];
            return !noRetry.includes(errorType) && retryCount < (maxRetries[errorType] || 1);
        },

        getRetryDelay(errorType, retryCount = 0) {
            const baseDelays = { rate_limit: 5000, server_error: 3000, network_error: 2000, timeout: 1000, unknown_error: 2000 };
            return Math.min((baseDelays[errorType] || 2000) * Math.pow(1.5, retryCount), 30000);
        },

        async handle(error, response = null, retryCount = 0) {
            const errorType = this.categorize(error, response);
            const errorMsg = response ? `HTTP ${response.status}` : error.message;

            addLog(`❌ 请求失败: ${errorMsg}`, 'error');

            if (errorType === 'auth_error') {
                addLog(`🔐 认证失败，请检查登录状态`, 'error');
                if (isRunning) stopBooking();
                return { shouldStop: true, shouldRetry: false };
            }

            return {
                shouldStop: false,
                shouldRetry: this.shouldRetry(errorType, retryCount),
                retryDelay: this.shouldRetry(errorType, retryCount) ? this.getRetryDelay(errorType, retryCount) : 0,
                errorType
            };
        }
    };

    // ==================== 请求频率控制器 ====================
    const RequestThrottler = {
        requests: [],
        maxPerSecond: 2,
        maxConcurrent: 3,
        current: 0,

        cleanup() {
            const now = Date.now();
            this.requests = this.requests.filter(time => now - time < 1000);
        },

        canRequest() {
            this.cleanup();
            return this.requests.length < this.maxPerSecond && this.current < this.maxConcurrent;
        },

        async wait() {
            while (!this.canRequest()) {
                const waitTime = this.current >= this.maxConcurrent ? 1000 :
                    (this.requests.length >= this.maxPerSecond ? Math.max(0, 1000 - (Date.now() - Math.min(...this.requests))) : 0);
                if (waitTime > 0) await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        },

        onStart() {
            this.requests.push(Date.now());
            this.current++;
        },

        onEnd() {
            this.current = Math.max(0, this.current - 1);
        },

        reset() {
            this.requests = [];
            this.current = 0;
            addLog(`🔄 请求频率已重置`, 'info');
        }
    };

    // ==================== 智能重试机制 ====================
    const SmartRetry = {
        failures: 0,
        lastSuccess: Date.now(),

        reset() {
            this.failures = 0;
            this.lastSuccess = Date.now();
        },

        onSuccess() {
            if (this.failures > 0) addLog(`✅ 恢复正常`, 'success');
            this.reset();
        },

        onFailure() {
            this.failures++;
            if (this.failures >= 15) addLog(`⚠️ 连续失败${this.failures}次`, 'warning');
        }
    };

    // ==================== 移动端优化 ====================
    const MobileOptimization = {
        wakeLock: null,

        async init() {
            if (!Device.isMobile) return;
            addLog(`📱 启用移动端优化`, 'info');

            await this.requestWakeLock();
            this.setupVisibility();
            this.optimizeScrolling();
        },

        async requestWakeLock() {
            if ('wakeLock' in navigator) {
                try {
                    this.wakeLock = await navigator.wakeLock.request('screen');
                    addLog(`🔆 屏幕保持唤醒`, 'success');
                } catch { }
            }
        },

        setupVisibility() {
            document.addEventListener('visibilitychange', () => {
                if (!document.hidden && isRunning) this.requestWakeLock();
            });
        },

        optimizeScrolling() {
            const style = document.createElement('style');
            style.textContent = `
                #status-area { -webkit-overflow-scrolling: touch; overscroll-behavior: contain; }
                * { touch-action: manipulation; }
                #auto-booking-panel { -webkit-user-select: none; user-select: none; -webkit-tap-highlight-color: transparent; }
                #auto-booking-panel input, #auto-booking-panel select { -webkit-user-select: auto; user-select: auto; }
            `;
            document.head.appendChild(style);
        },

        cleanup() {
            this.wakeLock?.release();
            this.wakeLock = null;
        }
    };

    // ==================== 企业微信推送 ====================
    const WeChatNotifier = {
        url: 'https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=4a1965fb-7559-4229-95ab-cc5a34066b6b',
        enabled: true,

        async sendSuccess(info) {
            if (!this.enabled || typeof GM_xmlhttpRequest === 'undefined') return false;

            const message = `🎉 深大体育场馆预约成功！

👤 ${info.userName} (${info.userId})
📅 ${info.date} | 🏟️ ${info.sport} | 🏫 ${info.campus}
📍 ${info.venueName} | ⏰ ${info.timeSlot}
📋 ${info.dhid}`;

            return new Promise(resolve => {
                GM_xmlhttpRequest({
                    method: 'POST',
                    url: this.url,
                    headers: { 'Content-Type': 'application/json' },
                    data: JSON.stringify({ msgtype: 'text', text: { content: message } }),
                    timeout: 10000,
                    onload: (res) => resolve(res.status === 200),
                    onerror: () => resolve(false),
                    ontimeout: () => resolve(false)
                });
            });
        }
    };

    // ==================== 常量定义 ====================
    const SPORT_CODES = {
        "羽毛球": "001",
        "排球": "003",
        "网球": "004",
        "篮球": "005",
        "乒乓球": "013",
        "桌球": "016"
    };
    const CAMPUS_CODES = { "粤海": "1", "丽湖": "2" };
    const TIME_SLOTS = ["08:00-09:00", "09:00-10:00", "10:00-11:00", "11:00-12:00", "12:00-13:00", "13:00-14:00", "14:00-15:00", "15:00-16:00", "16:00-17:00", "17:00-18:00", "18:00-19:00", "19:00-20:00", "20:00-21:00", "21:00-22:00"];

    // ==================== 配置管理 ====================

    // 新增: 模块化场馆配置
    const VENUE_CONFIG = {
        "羽毛球": {
            "丽湖": {
                options: [
                    { value: '至畅', label: '🏆 至畅体育馆' },
                    { value: '至快', label: '⚡ 至快体育馆' },
                ],
                filter: (fullName, preferredVenue) => {
                    if (preferredVenue === "至畅") return fullName.includes("至畅");
                    if (preferredVenue === "至快") return fullName.includes("至快");
                    return false;
                }
            },
            "粤海": {
                options: [
                    { value: '运动广场东馆羽毛球场', label: '🏸 运动广场东馆羽毛球场' },
                ],
                filter: (fullName, preferredVenue) => {
                    if (preferredVenue === "运动广场东馆羽毛球场") return fullName.includes("东馆") || fullName.includes("运动广场");
                    return false;
                }
            }
        },
        "网球": {
            "粤海": {
                options: [
                    { value: '运动广场海边网球场', label: '🌊 运动广场海边网球场' },
                    { value: '北区网球场', label: '🎾 北区网球场' },
                ],
                filter: (fullName, preferredVenue) => {
                    if (preferredVenue === "运动广场海边网球场") return fullName.includes("海边") || fullName.includes("运动广场");
                    if (preferredVenue === "北区网球场") return fullName.includes("北区");
                    return false;
                }
            },
            "丽湖": {
                options: [
                    { value: '北区体育场网球场', label: '🏟️ 北区体育场网球场' },
                    { value: '南区室外网球场', label: '🌳 南区室外网球场' },
                ],
                filter: (fullName, preferredVenue) => {
                    if (preferredVenue === "北区体育场网球场") return fullName.includes("北区体育场");
                    if (preferredVenue === "南区室外网球场") return fullName.includes("南区室外");
                    return false;
                }
            }
        },
        "排球": {
            "粤海": {
                options: [
                    { value: '西馆排球场(包场)', label: '🏐 西馆排球场(包场)' },
                ],
                filter: (fullName, preferredVenue) => {
                    if (preferredVenue === "西馆排球场(包场)") return fullName.includes("西馆") || fullName.includes("排球场");
                    return false;
                }
            },
            "丽湖": {
                options: [
                    { value: '风雨操场排球场', label: '☔ 风雨操场排球场' },
                ],
                filter: (fullName, preferredVenue) => {
                    if (preferredVenue === "风雨操场排球场") return fullName.includes("风雨操场");
                    return false;
                }
            }
        },
        "篮球": {
            "粤海": {
                options: [
                    { value: '运动广场天台篮球场', label: '🏙️ 运动广场天台篮球场' },
                    { value: '运动广场东馆室内篮球场', label: '🏀 运动广场东馆室内篮球场' },
                ],
                filter: (fullName, preferredVenue) => {
                    if (preferredVenue === "运动广场天台篮球场") return fullName.includes("天台") || fullName.includes("运动广场");
                    if (preferredVenue === "运动广场东馆室内篮球场") return fullName.includes("东馆") || fullName.includes("室内篮球场");
                    return false;
                }
            },
            "丽湖": {
                options: [
                    { value: '风雨操场篮球场', label: '🏀 风雨操场篮球场' },
                ],
                filter: (fullName, preferredVenue) => {
                    if (preferredVenue === "风雨操场篮球场") return fullName.includes("风雨操场");
                    return false;
                }
            }
        },
        "乒乓球": {
            "粤海": {
                options: [
                    { value: '北区乒乓球馆', label: '🏓 北区乒乓球馆' },
                ],
                filter: (fullName, preferredVenue) => {
                    if (preferredVenue === "北区乒乓球馆") return fullName.includes("北区");
                    return false;
                }
            },
            "丽湖": {
                options: [
                    { value: '体育馆乒乓球室', label: '🏓 体育馆乒乓球室' },
                ],
                filter: (fullName, preferredVenue) => {
                    if (preferredVenue === "体育馆乒乓球室") return fullName.includes("体育馆");
                    return false;
                }
            }
        },
    };

    function getTomorrowDate() {
        const d = new Date();
        d.setDate(d.getDate() + 1);
        return d.toISOString().split('T')[0];
    }

    // 根据运动项目和校区获取正确的YYLX
    function getYYLX(sport, campus) {
        // 粤海篮球需要使用团体预约模式
        if (sport === "篮球" && campus === "粤海") {
            return "2.0";
        }
        // 其他情况使用单人散场模式
        return "1.0";
    }

    // 判断是否显示场馆选择
    function shouldShowVenueSelection(sport, campus) {
        return !!(VENUE_CONFIG[sport] && VENUE_CONFIG[sport][campus]);
    }

    // 获取场馆选项
    function getVenueOptions(sport, campus) {
        const baseOptions = VENUE_CONFIG[sport]?.[campus]?.options || [];
        return [
            ...baseOptions,
            { value: '全部', label: '🔄 全部场馆' }
        ];
    }

    const DEFAULT_CONFIG = {
        USER_INFO: { YYRGH: "2300123999", YYRXM: "张三" },
        TARGET_DATE: getTomorrowDate(),
        SPORT: "羽毛球",
        CAMPUS: "丽湖",
        PREFERRED_VENUE: "至畅",
        PREFERRED_TIMES: ["20:00-21:00", "21:00-22:00"],
        RETRY_INTERVAL: 1,
        MAX_RETRY_TIMES: 20000,
        REQUEST_TIMEOUT: 10,
        YYLX: "1.0"
    };

    function loadConfig() {
        const saved = Storage.get('bookingConfig', null);
        const config = saved ? { ...DEFAULT_CONFIG, ...saved } : DEFAULT_CONFIG;

        // 只在没有保存配置时才设置为明天
        if (!saved) {
            config.TARGET_DATE = getTomorrowDate();
        }

        // 根据当前配置更新YYLX
        config.YYLX = getYYLX(config.SPORT, config.CAMPUS);
        // 确保场馆配置有效
        if (!shouldShowVenueSelection(config.SPORT, config.CAMPUS)) {
            config.PREFERRED_VENUE = '全部';
        }
        return config;
    }

    // ==================== 定时任务管理器 ====================
    const ScheduledTask = {
        timerId: null,
        targetTime: null,

        set(targetTime) {
            this.clear();

            const now = Date.now();
            const delay = targetTime - now;

            if (delay <= 0) {
                addLog(`❌ 定时时间必须晚于当前时间`, 'error');
                return false;
            }

            this.targetTime = targetTime;
            Storage.set('scheduledTime', targetTime);

            this.timerId = setTimeout(() => {
                addLog(`⏰ 定时任务触发，开始抢票！`, 'success');
                if (!isRunning) {
                    updateConfigFromUI();
                    if (validateConfig()) startBooking();
                }
                this.clear();
            }, delay);

            const targetDate = new Date(targetTime);
            addLog(`⏰ 已设置定时任务: ${targetDate.toLocaleString('zh-CN')}`, 'success');
            addLog(`⏱️ 距离开始还有: ${this.formatRemaining()}`, 'info');
            return true;
        },

        clear() {
            if (this.timerId) {
                clearTimeout(this.timerId);
                this.timerId = null;
            }
            this.targetTime = null;
            Storage.remove('scheduledTime');
        },

        getRemaining() {
            if (!this.targetTime) return null;
            const remaining = Math.max(0, this.targetTime - Date.now());
            return remaining > 0 ? remaining : null;
        },

        formatRemaining() {
            const remaining = this.getRemaining();
            if (!remaining) return '未设置';

            const hours = Math.floor(remaining / 3600000);
            const minutes = Math.floor((remaining % 3600000) / 60000);
            const seconds = Math.floor((remaining % 60000) / 1000);

            if (hours > 0) return `${hours}时${minutes}分${seconds}秒`;
            if (minutes > 0) return `${minutes}分${seconds}秒`;
            return `${seconds}秒`;
        },

        restore() {
            const savedTime = Storage.get('scheduledTime');
            if (savedTime && savedTime > Date.now()) {
                return this.set(savedTime);
            } else if (savedTime) {
                // 清理过期的定时任务
                Storage.remove('scheduledTime');
            }
            return false;
        },

        checkRefresh() {
            // 检查是否需要在30秒前刷新页面以保持会话活跃
            const remaining = this.getRemaining();
            // 使用2秒的窗口（28-30秒）确保能可靠触发刷新
            if (remaining !== null && remaining <= 30000 && remaining > 28000) {
                // 标记需要刷新并执行刷新，记录刷新时间戳
                Storage.set('needRefresh', { triggered: true, timestamp: Date.now() });
                addLog('🔄 即将刷新页面以保持会话活跃...', 'info');
                setTimeout(() => {
                    window.location.reload();
                }, 500);
                return true;
            }
            return false;
        }
    };

    // ==================== 全局变量 ====================
    let CONFIG = loadConfig();
    let isRunning = false;
    let retryCount = 0;
    let startTime = null;
    let successfulBookings = [];
    let controlPanel = null;
    let floatingButton = null;
    let isPanelVisible = Storage.get('panelVisible', true);
    let countdownInterval = null; // 倒计时更新定时器

    function getMaxBookings() {
        return Math.min(CONFIG.PREFERRED_TIMES.length, 2);
    }

    // ==================== 交互处理器 ====================
    const Interaction = {
        bind(el, handler) {
            if (!Device.isTouch) {
                el.addEventListener('click', handler);
                return;
            }

            let pressed = false, startTime = 0;

            if (Device.hasPointer) {
                el.addEventListener('pointerdown', (e) => {
                    if (!e.isPrimary) return;
                    pressed = true;
                    startTime = Date.now();
                });
                el.addEventListener('pointerup', (e) => {
                    if (!pressed || !e.isPrimary) return;
                    if (Date.now() - startTime < 800) {
                        e.preventDefault();
                        handler();
                    }
                    pressed = false;
                });
            } else {
                el.addEventListener('touchstart', () => {
                    pressed = true;
                    startTime = Date.now();
                }, { passive: true });
                el.addEventListener('touchend', (e) => {
                    if (!pressed) return;
                    if (Date.now() - startTime < 800) {
                        e.preventDefault();
                        handler();
                    }
                    pressed = false;
                });
            }
        }
    };

    // ==================== UI 创建 ====================
    function createFloatingButton() {
        const btn = document.createElement('div');
        btn.id = 'floating-toggle-btn';

        const size = Styles.getSize('60px', '70px', '80px');
        const fontSize = Styles.getSize('24px', '28px', '32px');

        btn.style.cssText = `position:fixed;top:20px;right:20px;width:${size};height:${size};background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:10001;box-shadow:0 4px 15px rgba(0,0,0,0.3);transition:all 0.3s;border:3px solid rgba(255,255,255,0.2);font-size:${fontSize};user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation;`;

        btn.innerHTML = '🎾';
        btn.title = '显示/隐藏抢票面板';

        Interaction.bind(btn, togglePanel);

        if (!Device.isTouch) {
            btn.addEventListener('mouseenter', () => btn.style.transform = 'scale(1.1)');
            btn.addEventListener('mouseleave', () => btn.style.transform = 'scale(1)');
        }

        document.body.appendChild(btn);
        return btn;
    }

    function createControlPanel() {
        const panel = document.createElement('div');
        panel.id = 'auto-booking-panel';

        const mobileStyles = Device.isMobile ?
            `width:calc(100vw - 30px);max-width:${Device.isIPad ? '500px' : '380px'};top:${Device.isIPad ? '120px' : '100px'};left:50%;font-size:${Device.isIPad ? '18px' : '16px'};max-height:calc(100vh - 150px);` :
            `width:400px;top:20px;right:90px;max-height:90vh;`;

        panel.style.cssText = `position:fixed;${mobileStyles}background:linear-gradient(135deg,#667eea 0%,#764ba2 100%);border-radius:15px;padding:20px;box-shadow:0 10px 30px rgba(0,0,0,0.3);z-index:10000;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','PingFang SC','Hiragino Sans GB','Microsoft YaHei',sans-serif;color:white;border:2px solid rgba(255,255,255,0.2);overflow-y:auto;transition:opacity 0.3s ease,transform 0.3s ease;-webkit-user-select:none;user-select:none;-webkit-tap-highlight-color:transparent;`;

        const getTodayDate = () => {
            const d = new Date();
            return d.toISOString().split('T')[0];
        };

        panel.innerHTML = `
        <div style="margin-bottom:15px;text-align:center;position:relative;">
            <h3 style="margin:0;font-size:${Device.isMobile ? '20px' : '18px'};text-shadow:2px 2px 4px rgba(0,0,0,0.5);">🎾 自动抢票助手 v1.2.1</h3>
            <button id="close-panel" style="position:absolute;top:-5px;right:-5px;background:rgba(255,255,255,0.2);border:none;color:white;width:${Device.isMobile ? '35px' : '30px'};height:${Device.isMobile ? '35px' : '30px'};border-radius:50%;cursor:pointer;font-size:${Device.isMobile ? '20px' : '16px'};display:flex;align-items:center;justify-content:center;touch-action:manipulation;" title="隐藏面板">×</button>
            <button id="toggle-config" style="background:rgba(255,255,255,0.2);border:1px solid rgba(255,255,255,0.3);color:white;padding:${Device.isMobile ? '8px 12px' : '5px 10px'};border-radius:5px;cursor:pointer;margin-top:5px;font-size:${Device.isMobile ? '14px' : '12px'};touch-action:manipulation;">⚙️ 配置设置</button>
        </div>
    
        <div id="config-area" style="background:rgba(255,255,255,0.1);padding:15px;border-radius:8px;margin-bottom:15px;display:none;">
            <div style="margin-bottom:12px;">
                <label style="font-size:${Device.isMobile ? '14px' : '12px'};display:block;margin-bottom:3px;">👤 学号/工号:</label>
                <input id="user-id" type="text" value="${CONFIG.USER_INFO.YYRGH}" style="${Styles.input}">
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:${Device.isMobile ? '14px' : '12px'};display:block;margin-bottom:3px;">📝 姓名:</label>
                <input id="user-name" type="text" value="${CONFIG.USER_INFO.YYRXM}" style="${Styles.input}">
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:${Device.isMobile ? '14px' : '12px'};display:block;margin-bottom:3px;">📅 预约日期:</label>
                <input id="target-date" type="date" value="${CONFIG.TARGET_DATE}" style="${Styles.input}">
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:${Device.isMobile ? '14px' : '12px'};display:block;margin-bottom:3px;">🏟️ 运动项目:</label>
                <select id="sport-type" style="${Styles.input}">
                    ${Object.keys(SPORT_CODES).map(s => `<option value="${s}" ${s === CONFIG.SPORT ? 'selected' : ''}>${s}</option>`).join('')}
                </select>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:${Device.isMobile ? '14px' : '12px'};display:block;margin-bottom:3px;">🏫 校区:</label>
                <select id="campus" style="${Styles.input}">
                    ${Object.keys(CAMPUS_CODES).map(c => `<option value="${c}" ${c === CONFIG.CAMPUS ? 'selected' : ''}>${c}</option>`).join('')}
                </select>
            </div>
            <div id="venue-selection" style="margin-bottom:12px;display:${shouldShowVenueSelection(CONFIG.SPORT, CONFIG.CAMPUS) ? 'block' : 'none'};">
                <label style="font-size:${Device.isMobile ? '14px' : '12px'};display:block;margin-bottom:3px;">🏟️ 优先场馆:</label>
                <select id="preferred-venue" style="${Styles.input}">
                    ${getVenueOptions(CONFIG.SPORT, CONFIG.CAMPUS).map(opt =>
            `<option value="${opt.value}" ${CONFIG.PREFERRED_VENUE === opt.value ? 'selected' : ''}>${opt.label}</option>`
        ).join('')}
                </select>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:${Device.isMobile ? '14px' : '12px'};display:block;margin-bottom:8px;">⏰ 优先时间段:</label>
                <div id="time-slots-container" style="background:rgba(255,255,255,0.1);border-radius:4px;padding:8px;display:grid;grid-template-columns:repeat(${Device.isMobile ? '2' : '2'},1fr);gap:${Device.isMobile ? '6px' : '4px'};">
                    ${TIME_SLOTS.map(slot => `<label style="display:flex;align-items:center;font-size:${Device.isMobile ? '13px' : '11px'};cursor:pointer;padding:${Device.isMobile ? '4px' : '2px'};"><input type="checkbox" value="${slot}" ${CONFIG.PREFERRED_TIMES.includes(slot) ? 'checked' : ''} style="margin-right:5px;transform:${Device.isMobile ? 'scale(1.2)' : 'scale(1)'};flex-shrink:0;"><span style="white-space:nowrap;">${slot}</span></label>`).join('')}
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px;">
                <div>
                    <label style="font-size:${Device.isMobile ? '14px' : '12px'};display:block;margin-bottom:3px;">⏱️ 查询间隔(秒):</label>
                    <input id="retry-interval" type="number" min="1" max="60" value="${CONFIG.RETRY_INTERVAL}" style="${Styles.input}">
                </div>
                <div>
                    <label style="font-size:${Device.isMobile ? '14px' : '12px'};display:block;margin-bottom:3px;">🔄 最大重试:</label>
                    <input id="max-retry" type="number" min="10" max="9999" value="${CONFIG.MAX_RETRY_TIMES}" style="${Styles.input}">
                </div>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:${Device.isMobile ? '14px' : '12px'};display:block;margin-bottom:3px;">⏰ 请求超时(秒):</label>
                <input id="request-timeout" type="number" min="5" max="60" value="${CONFIG.REQUEST_TIMEOUT}" style="${Styles.input}">
            </div>
            <button id="save-config" style="${Styles.button}background:linear-gradient(45deg,#4caf50,#45a049);color:white;font-size:${Device.isMobile ? '16px' : '14px'};margin-bottom:10px;">💾 保存配置</button>
        </div>
    
        <div style="background:rgba(255,255,255,0.1);padding:12px;border-radius:8px;margin-bottom:15px;">
            <div style="font-size:${Device.isMobile ? '15px' : '13px'};margin-bottom:5px;">👤 <span id="display-user">${CONFIG.USER_INFO.YYRXM} (${CONFIG.USER_INFO.YYRGH})</span></div>
            <div style="font-size:${Device.isMobile ? '15px' : '13px'};margin-bottom:5px;">📅 <span id="display-date">${CONFIG.TARGET_DATE}</span> | 🏟️ <span id="display-sport">${CONFIG.SPORT}</span> | 🏫 <span id="display-campus">${CONFIG.CAMPUS}</span></div>
            <div id="venue-display" style="font-size:${Device.isMobile ? '15px' : '13px'};margin-bottom:5px;display:${shouldShowVenueSelection(CONFIG.SPORT, CONFIG.CAMPUS) ? 'block' : 'none'};">🏟️ 优先场馆: <span id="display-venue">${CONFIG.PREFERRED_VENUE}</span></div>
            <div style="font-size:${Device.isMobile ? '15px' : '13px'};margin-bottom:5px;">⏰ <span id="display-times">${CONFIG.PREFERRED_TIMES.join(', ')}</span></div>
            <div style="font-size:${Device.isMobile ? '15px' : '13px'};">⚙️ 间隔:<span id="display-interval">${CONFIG.RETRY_INTERVAL}</span>s | 重试:<span id="display-retry">${CONFIG.MAX_RETRY_TIMES}</span> | 超时:<span id="display-timeout">${CONFIG.REQUEST_TIMEOUT}</span>s</div>
            <div style="font-size:${Device.isMobile ? '15px' : '13px'};margin-top:5px;">🎯 进度: <span id="booking-progress">0/${getMaxBookings()} 个时段</span></div>
        </div>
    
        <div style="background:rgba(255,255,255,0.15);padding:12px;border-radius:8px;margin-bottom:15px;">
            <div style="font-size:${Device.isMobile ? '15px' : '13px'};margin-bottom:8px;font-weight:bold;">⏰ 定时抢票</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px;">
                <div>
                    <label style="font-size:${Device.isMobile ? '13px' : '11px'};display:block;margin-bottom:3px;">日期:</label>
                    <input id="scheduled-date" type="date" value="${getTodayDate()}" style="${Styles.input}font-size:${Device.isMobile ? '14px' : '12px'};padding:${Device.isMobile ? '8px' : '6px'};">
                </div>
                <div>
                    <label style="font-size:${Device.isMobile ? '13px' : '11px'};display:block;margin-bottom:3px;">时间:</label>
                    <input id="scheduled-time" type="time" value="12:30" style="${Styles.input}font-size:${Device.isMobile ? '14px' : '12px'};padding:${Device.isMobile ? '8px' : '6px'};">
                </div>
            </div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                <button id="set-schedule-btn" style="${Styles.button}background:linear-gradient(45deg,#ff9800,#f57c00);color:white;font-size:${Device.isMobile ? '14px' : '12px'};padding:${Device.isMobile ? '10px' : '8px'};">⏰ 设置定时</button>
                <button id="cancel-schedule-btn" style="${Styles.button}background:linear-gradient(45deg,#9e9e9e,#757575);color:white;font-size:${Device.isMobile ? '14px' : '12px'};padding:${Device.isMobile ? '10px' : '8px'};">❌ 取消定时</button>
            </div>
            <div id="countdown-display" style="font-size:${Device.isMobile ? '14px' : '12px'};margin-top:8px;text-align:center;color:#ffd700;font-weight:bold;">未设置定时任务</div>
        </div>
    
        <div style="margin-bottom:15px;">
            <button id="start-btn" style="${Styles.button}background:linear-gradient(45deg,#ff6b6b,#ee5a52);color:white;">🚀 开始抢票</button>
        </div>
    
        <div id="status-area" style="background:rgba(0,0,0,0.2);padding:10px;border-radius:8px;font-size:${Device.isMobile ? '14px' : '12px'};max-height:${Device.isMobile ? '250px' : '200px'};overflow-y:auto;border:1px solid rgba(255,255,255,0.1);">
            <div style="color:#ffd700;">🔧 等待开始...</div>
        </div>
    
        <div style="margin-top:15px;text-align:center;font-size:${Device.isMobile ? '13px' : '11px'};opacity:0.8;">${Device.isMobile ? '📱 触摸优化版本' : '⚡ 快捷键: Ctrl+Shift+S 开始/停止'}</div>
        `;

        document.body.appendChild(panel);

        const transforms = Device.isMobile ?
            { visible: 'translateX(-50%) translateY(0)', hidden: 'translateX(-50%) translateY(-30px)' } :
            { visible: 'translateX(0)', hidden: 'translateX(100%)' };

        if (isPanelVisible) {
            panel.style.display = 'block';
            panel.style.opacity = '1';
            panel.style.transform = transforms.visible;
        } else {
            panel.style.display = 'none';
            panel.style.opacity = '0';
            panel.style.transform = transforms.hidden;
        }

        bindEvents(panel);
        return panel;
    }

    function togglePanel() {
        isPanelVisible = !isPanelVisible;
        Storage.set('panelVisible', isPanelVisible);

        const transforms = Device.isMobile ?
            { visible: 'translateX(-50%) translateY(0)', hidden: 'translateX(-50%) translateY(-30px)' } :
            { visible: 'translateX(0)', hidden: 'translateX(100%)' };

        if (isPanelVisible) {
            controlPanel.style.display = 'block';
            controlPanel.style.transform = transforms.hidden;
            controlPanel.style.opacity = '0';
            setTimeout(() => {
                controlPanel.style.opacity = '1';
                controlPanel.style.transform = transforms.visible;
            }, 10);
        } else {
            controlPanel.style.opacity = '0';
            controlPanel.style.transform = transforms.hidden;
            setTimeout(() => {
                if (!isPanelVisible) controlPanel.style.display = 'none';
            }, 300);
        }

        if (floatingButton) {
            floatingButton.style.background = isPanelVisible ?
                'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' :
                'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)';
            floatingButton.innerHTML = isPanelVisible ? '🎾' : '📱';
        }
    }

    function bindEvents(panel) {
        Interaction.bind(panel.querySelector('#close-panel'), togglePanel);

        Interaction.bind(panel.querySelector('#toggle-config'), () => {
            const area = panel.querySelector('#config-area');
            const btn = panel.querySelector('#toggle-config');
            if (area.style.display === 'none') {
                area.style.display = 'block';
                btn.textContent = '⚙️ 隐藏配置';
            } else {
                area.style.display = 'none';
                btn.textContent = '⚙️ 显示配置';
            }
        });

        const updateVenueDisplay = () => {
            const sport = panel.querySelector('#sport-type').value;
            const campus = panel.querySelector('#campus').value;
            const venueSelection = panel.querySelector('#venue-selection');
            const venueDisplay = panel.querySelector('#venue-display');
            const preferredVenueSelect = panel.querySelector('#preferred-venue');

            const show = shouldShowVenueSelection(sport, campus);

            if (venueSelection) venueSelection.style.display = show ? 'block' : 'none';
            if (venueDisplay) venueDisplay.style.display = show ? 'block' : 'none';

            // 更新场馆选项
            if (preferredVenueSelect && show) {
                const options = getVenueOptions(sport, campus);
                preferredVenueSelect.innerHTML = options.map(opt =>
                    `<option value="${opt.value}">${opt.label}</option>`
                ).join('');
            }
        };

        panel.querySelector('#sport-type').addEventListener('change', updateVenueDisplay);
        panel.querySelector('#campus').addEventListener('change', updateVenueDisplay);


        Interaction.bind(panel.querySelector('#save-config'), () => {
            updateConfigFromUI();
            updateDisplayConfig();
            addLog('💾 配置已保存', 'success');

            const area = panel.querySelector('#config-area');
            const btn = panel.querySelector('#toggle-config');
            if (area && btn) {
                area.style.display = 'none';
                btn.textContent = '⚙️ 配置设置';
            }
        });

        Interaction.bind(panel.querySelector('#start-btn'), () => {
            if (isRunning) {
                // 停止抢票
                addLog(`⏹️ 正在停止抢票...`, 'info');
                stopBooking();
            } else {
                // 开始抢票前先更新配置
                updateConfigFromUI();

                // 验证配置
                if (!validateConfig()) {
                    addLog(`❌ 配置验证失败，请检查配置`, 'error');
                    return;
                }

                // 二次确认（可选）
                const confirmMsg = `确认开始抢票？\n日期: ${formatDateDisplay(CONFIG.TARGET_DATE)}\n项目: ${CONFIG.SPORT}\n校区: ${CONFIG.CAMPUS}\n时段: ${CONFIG.PREFERRED_TIMES.join(', ')}`;

                if (Device.isMobile || confirm(confirmMsg)) {
                    startBooking();
                }
            }
        });

        Interaction.bind(panel.querySelector('#set-schedule-btn'), () => {
            const dateInput = panel.querySelector('#scheduled-date').value;
            const timeInput = panel.querySelector('#scheduled-time').value;

            if (!dateInput || !timeInput) {
                addLog('❌ 请选择定时日期和时间', 'error');
                return;
            }

            // 构建完整的日期时间字符串
            const dateTimeString = `${dateInput}T${timeInput}:00`;
            const targetTime = new Date(dateTimeString).getTime();

            // 验证日期有效性
            if (isNaN(targetTime)) {
                addLog('❌ 日期时间格式无效', 'error');
                return;
            }

            // 检查是否是未来时间
            const now = Date.now();
            if (targetTime <= now) {
                addLog('❌ 定时时间必须晚于当前时间', 'error');
                addLog(`ℹ️ 当前时间: ${new Date(now).toLocaleString('zh-CN')}`, 'info');
                addLog(`ℹ️ 设置时间: ${new Date(targetTime).toLocaleString('zh-CN')}`, 'info');
                return;
            }

            if (ScheduledTask.set(targetTime)) {
                startCountdown();
            }
        });

        Interaction.bind(panel.querySelector('#cancel-schedule-btn'), () => {
            ScheduledTask.clear();
            stopCountdown();
            updateCountdownDisplay('未设置定时任务');
            addLog('❌ 已取消定时任务', 'info');
        });

        if (!Device.isMobile) {
            document.addEventListener('keydown', (e) => {
                if (e.ctrlKey && e.shiftKey && e.key === 'S') {
                    e.preventDefault();
                    panel.querySelector('#start-btn').click();
                } else if (e.ctrlKey && e.shiftKey && e.key === 'H') {
                    e.preventDefault();
                    togglePanel();
                }
            });
        }
    }

    function updateCountdownDisplay(text) {
        const display = document.getElementById('countdown-display');
        if (display) display.textContent = text;
    }

    function startCountdown() {
        stopCountdown();

        const updateDisplay = () => {
            const remaining = ScheduledTask.getRemaining();
            if (remaining === null) {
                stopCountdown();
                updateCountdownDisplay('未设置定时任务');
                return false;
            }

            // 检查是否需要刷新页面
            if (ScheduledTask.checkRefresh()) {
                return false; // 即将刷新，停止倒计时更新
            }

            const formatted = ScheduledTask.formatRemaining();
            const remainingSeconds = Math.floor(remaining / 1000);

            // 根据剩余时间显示不同的提示
            if (remainingSeconds <= 60 && remainingSeconds > 30) {
                updateCountdownDisplay(`⏰ 倒计时: ${formatted} (将在30秒时刷新页面)`);
            } else if (remainingSeconds <= 30) {
                updateCountdownDisplay(`⏰ 倒计时: ${formatted} (即将开始抢票)`);
            } else {
                updateCountdownDisplay(`⏰ 倒计时: ${formatted}`);
            }
            return true;
        };

        // 立即更新一次
        if (!updateDisplay()) return;

        // 每秒更新一次
        countdownInterval = setInterval(() => {
            if (!updateDisplay()) {
                stopCountdown();
            }
        }, 1000);
    }

    function stopCountdown() {
        if (countdownInterval) {
            clearInterval(countdownInterval);
            countdownInterval = null;
        }
    }

    // ==================== 配置和日志 ====================
    function updateConfigFromUI() {
        const selectedTimes = Array.from(document.querySelectorAll('#time-slots-container input:checked')).map(cb => cb.value);
        const campus = document.getElementById('campus').value;
        const sport = document.getElementById('sport-type').value;

        let venue = '全部';
        if (shouldShowVenueSelection(sport, campus)) {
            venue = document.getElementById('preferred-venue')?.value || '全部';
        }

        CONFIG = {
            USER_INFO: {
                YYRGH: document.getElementById('user-id').value.trim(),
                YYRXM: document.getElementById('user-name').value.trim()
            },
            TARGET_DATE: document.getElementById('target-date').value,
            SPORT: sport,
            CAMPUS: campus,
            PREFERRED_VENUE: venue,
            PREFERRED_TIMES: selectedTimes,
            RETRY_INTERVAL: parseInt(document.getElementById('retry-interval').value),
            MAX_RETRY_TIMES: parseInt(document.getElementById('max-retry').value),
            REQUEST_TIMEOUT: parseInt(document.getElementById('request-timeout').value),
            YYLX: getYYLX(sport, campus)
        };

        Storage.set('bookingConfig', CONFIG);
        updateProgress();

        addLog(`⚙️ 预约模式: ${CONFIG.YYLX === "2.0" ? "团体预约" : "单人散场"}`, 'info');

        if (shouldShowVenueSelection(sport, campus) && venue !== '全部') {
            addLog(`🏟️ 优先场馆: ${venue}`, 'info');
        }
    }

    function updateDisplayConfig() {
        document.getElementById('display-user').textContent = `${CONFIG.USER_INFO.YYRXM} (${CONFIG.USER_INFO.YYRGH})`;

        // 格式化日期为 年/月/日
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        };

        document.getElementById('display-date').textContent = formatDate(CONFIG.TARGET_DATE);
        document.getElementById('display-sport').textContent = CONFIG.SPORT;
        document.getElementById('display-campus').textContent = CONFIG.CAMPUS;
        document.getElementById('display-venue').textContent = CONFIG.PREFERRED_VENUE;
        document.getElementById('display-times').textContent = CONFIG.PREFERRED_TIMES.join(', ');
        document.getElementById('display-interval').textContent = CONFIG.RETRY_INTERVAL;
        document.getElementById('display-retry').textContent = CONFIG.MAX_RETRY_TIMES;
        document.getElementById('display-timeout').textContent = CONFIG.REQUEST_TIMEOUT;
    }

    function validateConfig() {
        const errors = [];

        if (!CONFIG.USER_INFO.YYRGH || !CONFIG.USER_INFO.YYRXM) errors.push('请填写用户信息');
        if (!/^\d{3,12}$/.test(CONFIG.USER_INFO.YYRGH)) errors.push('学号格式不正确');
        if (!/^[\u4e00-\u9fa5]{2,20}$/.test(CONFIG.USER_INFO.YYRXM)) errors.push('姓名格式不正确');
        if (!CONFIG.TARGET_DATE) errors.push('请选择日期');
        if (!CONFIG.PREFERRED_TIMES.length) errors.push('请选择时间段');

        errors.forEach(e => addLog(`❌ ${e}`, 'error'));
        if (!errors.length) addLog(`✅ 配置验证通过`, 'success');
        return !errors.length;
    }

    function addLog(msg, type = 'info') {
        const area = document.getElementById('status-area');
        if (!area) return;

        const colors = { info: '#e3f2fd', success: '#c8e6c9', warning: '#fff3e0', error: '#ffcdd2' };
        const entry = document.createElement('div');
        entry.style.cssText = `color:${colors[type]};margin-bottom:3px;border-left:3px solid ${colors[type]};padding-left:8px;`;
        entry.innerHTML = `[${new Date().toLocaleTimeString()}] ${msg}`;

        area.appendChild(entry);
        area.scrollTop = area.scrollHeight;

        while (area.children.length > 50) area.removeChild(area.firstChild);
    }

    function updateProgress() {
        const el = document.getElementById('booking-progress');
        if (el) el.textContent = `${successfulBookings.length}/${getMaxBookings()} 个时段`;
    }

    // ==================== 网络请求 ====================
    function getBaseUrl() {
        return window.location.href.includes('webvpn') ?
            'https://ehall-443.webvpn.szu.edu.cn' :
            'https://ehall.szu.edu.cn';
    }

    async function fetchWithTimeout(url, options, timeout = CONFIG.REQUEST_TIMEOUT * 1000) {
        const startTime = Date.now();
        let retry = 0;

        while (retry <= 3) {
            await RequestThrottler.wait();

            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);

            try {
                RequestThrottler.onStart();
                const response = await fetch(url, { ...options, signal: controller.signal, credentials: 'same-origin', mode: 'cors', cache: 'no-cache' });
                clearTimeout(timeoutId);
                RequestThrottler.onEnd();

                if (!response.ok) {
                    const result = await NetworkErrorHandler.handle(new Error(`HTTP ${response.status}`), response, retry);
                    if (result.shouldStop) throw new Error('请求终止');
                    if (result.shouldRetry && retry < 3) {
                        retry++;
                        await new Promise(r => setTimeout(r, result.retryDelay));
                        continue;
                    }
                    throw new Error(`HTTP ${response.status}`);
                }

                return response;
            } catch (error) {
                clearTimeout(timeoutId);
                RequestThrottler.onEnd();

                if (retry >= 3) throw error;

                const result = await NetworkErrorHandler.handle(error, null, retry);
                if (result.shouldStop || !result.shouldRetry) throw error;

                retry++;
                await new Promise(r => setTimeout(r, result.retryDelay));
            }
        }
    }

    async function getAvailableSlots() {
        try {
            const slots = [];
            const baseUrl = getBaseUrl();
            const remaining = CONFIG.PREFERRED_TIMES.filter(t => !successfulBookings.some(b => b.timeSlot === t));

            if (!remaining.length) return [];

            for (const timeSlot of remaining) {
                const [start, end] = timeSlot.split("-");
                const payload = new URLSearchParams({
                    XMDM: SPORT_CODES[CONFIG.SPORT],
                    YYRQ: CONFIG.TARGET_DATE,
                    YYLX: CONFIG.YYLX,
                    KSSJ: start,
                    JSSJ: end,
                    XQDM: CAMPUS_CODES[CONFIG.CAMPUS]
                });

                const res = await fetchWithTimeout(`${baseUrl}/qljfwapp/sys/lwSzuCgyy/modules/sportVenue/getOpeningRoom.do`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                    body: payload
                });

                const data = await res.json();
                if (data.code !== "0") {
                    addLog(`⚠️ ${timeSlot} 查询失败: ${data.msg || '未知错误'}`, 'warning');
                    continue;
                }

                const rooms = data.datas?.getOpeningRoom?.rows || [];

                rooms.forEach(room => {
                    let isAvailable = false;

                    if (room.disabled === true || room.disabled === "true") {
                        return;
                    }

                    const textValue = String(room.text || '').trim();

                    if (textValue === "可预约") {
                        isAvailable = true;
                    } else if (/^\d+\/\d+$/.test(textValue)) {
                        const [remaining, total] = textValue.split('/').map(n => parseInt(n.trim()));
                        isAvailable = remaining > 0 && remaining <= total;
                    }

                    if (!isAvailable) return;

                    const fullName = room.CGBM_DISPLAY || room.CDMC || '';

                    // 模块化场馆过滤逻辑
                    if (shouldShowVenueSelection(CONFIG.SPORT, CONFIG.CAMPUS) && CONFIG.PREFERRED_VENUE !== "全部") {
                        const venueFilter = VENUE_CONFIG[CONFIG.SPORT]?.[CONFIG.CAMPUS]?.filter;
                        if (venueFilter && !venueFilter(fullName, CONFIG.PREFERRED_VENUE)) {
                            return; // 如果不匹配优先场馆，则跳过
                        }
                    }

                    let venuePriority = 2, courtPriority = 0;

                    if (CONFIG.CAMPUS === "丽湖") {
                        if (CONFIG.SPORT === "羽毛球") {
                            if (fullName.includes("至畅")) {
                                venuePriority = 0;
                                const name = room.CDMC || '';
                                if (name.includes("5号场") || name.includes("五号场")) courtPriority = -2;
                                else if (name.includes("10号场") || name.includes("十号场")) courtPriority = -1;
                                else if (name.match(/[^0-9]1号场|^1号场|一号场/) || name.includes("6号场") || name.includes("六号场")) courtPriority = 2;
                            } else if (fullName.includes("至快")) {
                                venuePriority = 1;
                            }
                        }
                    } else if (CONFIG.CAMPUS === "粤海") {
                        if (CONFIG.SPORT === "篮球") {
                            venuePriority = 0;
                            courtPriority = 0;
                        } else if (CONFIG.SPORT === "网球") {
                            if (fullName.includes("海边")) {
                                venuePriority = 0;
                            } else if (fullName.includes("北区")) {
                                venuePriority = 1;
                            }
                        }
                    }

                    let availableCount = null;
                    if (/^\d+\/\d+$/.test(textValue)) {
                        const [remaining, total] = textValue.split('/').map(n => parseInt(n.trim()));
                        availableCount = remaining;
                    }

                    slots.push({
                        wid: room.WID,
                        timeSlot,
                        startTime: start,
                        endTime: end,
                        venueName: room.CDMC || '',
                        venueFullName: fullName,
                        venueCode: room.CGBM || '',
                        priority: CONFIG.PREFERRED_TIMES.indexOf(timeSlot),
                        venuePriority,
                        courtPriority,
                        availableCount
                    });
                });
            }

            slots.sort((a, b) => a.courtPriority - b.courtPriority || a.venuePriority - b.venuePriority || a.priority - b.priority);
            return slots;
        } catch (error) {
            addLog(`🔥 获取场地失败: ${error.message}`, 'error');
            return [];
        }
    }

    async function bookSlot(slot) {
        try {
            const { wid, timeSlot, startTime, endTime, venueName, venueCode, venueFullName } = slot;

            if (!timeSlot || !venueCode) {
                addLog(`❌ 预约参数缺失`, 'error');
                return false;
            }

            const payload = new URLSearchParams({
                DHID: "",
                YYRGH: CONFIG.USER_INFO.YYRGH,
                CYRS: "",
                YYRXM: CONFIG.USER_INFO.YYRXM,
                CGDM: venueCode,
                CDWID: wid,
                XMDM: SPORT_CODES[CONFIG.SPORT],
                XQWID: CAMPUS_CODES[CONFIG.CAMPUS],
                KYYSJD: timeSlot,
                YYRQ: CONFIG.TARGET_DATE,
                YYLX: CONFIG.YYLX,
                YYKS: `${CONFIG.TARGET_DATE} ${startTime}`,
                YYJS: `${CONFIG.TARGET_DATE} ${endTime}`,
                PC_OR_PHONE: "pc"
            });

            const res = await fetchWithTimeout(`${getBaseUrl()}/qljfwapp/sys/lwSzuCgyy/sportVenue/insertVenueBookingInfo.do`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
                body: payload
            });

            const contentType = res.headers.get('content-type') || '';

            if (contentType.includes('text/html')) {
                const html = await res.text();
                const errorMatch = html.match(/<h4>出错信息：<\/h4>[\s\S]*?<div class="bh-text-caption bh-color-caption">\s*(.*?)\s*<\/div>/);
                const errorMsg = errorMatch ? errorMatch[1].trim() : '系统异常';

                addLog(`⚠️ ${errorMsg}`, 'warning');

                if (errorMsg.includes('已预约该场地的相同时间段') || errorMsg.includes('已预约')) {
                    addLog(`📌 ${timeSlot} 已预约过，跳过`, 'info');
                    successfulBookings.push({
                        timeSlot,
                        venueName: '已预约',
                        dhid: 'duplicate',
                        slotName: `${timeSlot} (重复)`
                    });
                    updateProgress();
                    return 'already_booked';
                }

                return false;
            }

            const result = await res.json();

            if (result.code === "0" && result.msg === "成功") {
                const dhid = result.data?.DHID || "Unknown";
                const displayName = venueFullName ? `${venueFullName}-${venueName}` : venueName;

                addLog(`🎉 预约成功！场地：${displayName}`, 'success');
                addLog(`📋 预约单号：${dhid}`, 'success');

                successfulBookings.push({ timeSlot, venueName: displayName, dhid, slotName: displayName });
                updateProgress();

                WeChatNotifier.sendSuccess({
                    userName: CONFIG.USER_INFO.YYRXM,
                    userId: CONFIG.USER_INFO.YYRGH,
                    date: CONFIG.TARGET_DATE,
                    sport: CONFIG.SPORT,
                    campus: CONFIG.CAMPUS,
                    venueName: displayName,
                    timeSlot,
                    dhid
                });

                return true;
            } else {
                addLog(`❌ 预约失败：${result.msg}`, 'error');
                if (result.msg?.includes("只能预订2次") || result.msg?.includes("超过限制")) {
                    addLog(`🎊 已达预约上限`, 'success');
                    return 'limit_reached';
                }
                return false;
            }
        } catch (error) {
            if (error.message.includes('JSON') || error.message.includes('Unexpected token')) {
                addLog(`⚠️ 服务器返回异常格式`, 'warning');
                return false;
            }
            addLog(`💥 预约异常: ${error.message}`, 'error');
            return false;
        }
    }

    // ==================== 主流程 ====================
    async function startBooking() {
        if (isRunning) {
            addLog(`⚠️ 正在抢票中，请勿重复点击`, 'warning');
            return;
        }

        // 重置状态 - 关键修复
        isRunning = true;
        retryCount = 0;
        successfulBookings = []; // 清空之前的预约记录
        startTime = new Date();
        const max = getMaxBookings();

        SmartRetry.reset();
        RequestThrottler.reset(); // 重置请求频率控制器

        const btn = document.getElementById('start-btn');
        if (btn) {
            btn.textContent = '⏹️ 停止抢票';
            btn.style.background = 'linear-gradient(45deg, #f44336, #d32f2f)';
        }

        // 更新进度显示
        updateProgress();

        // 格式化日期显示
        const formatDate = (dateStr) => {
            const date = new Date(dateStr);
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            return `${year}/${month}/${day}`;
        };

        addLog(`🚀 开始抢票！`, 'success');
        addLog(`📊 ${CONFIG.SPORT} | ${CONFIG.CAMPUS} | ${formatDate(CONFIG.TARGET_DATE)}`, 'info');
        addLog(`⏰ 目标时段: ${CONFIG.PREFERRED_TIMES.join(', ')}`, 'info');

        if (shouldShowVenueSelection(CONFIG.SPORT, CONFIG.CAMPUS) && CONFIG.PREFERRED_VENUE !== "全部") {
            addLog(`🏟️ 优先场馆: ${CONFIG.PREFERRED_VENUE}`, 'info');
        }

        try {
            while (isRunning && retryCount < CONFIG.MAX_RETRY_TIMES) {
                if (successfulBookings.length >= max) {
                    addLog(`🎊 成功预约 ${max} 个时段，已达上限`, 'success');
                    break;
                }

                retryCount++;
                if (retryCount === 1 || retryCount % 10 === 0) {
                    addLog(`🔍 第 ${retryCount} 次查询 (${successfulBookings.length}/${max})`);
                }

                try {
                    const slots = await getAvailableSlots();

                    if (slots.length) {
                        SmartRetry.onSuccess();
                        addLog(`🎉 找到 ${slots.length} 个可预约场地`, 'success');

                        const groups = {};
                        slots.forEach(s => {
                            if (!groups[s.timeSlot]) groups[s.timeSlot] = [];
                            groups[s.timeSlot].push(s);
                        });

                        for (const time of CONFIG.PREFERRED_TIMES) {
                            if (successfulBookings.length >= max) break;
                            if (successfulBookings.some(b => b.timeSlot === time)) continue;

                            if (groups[time]) {
                                groups[time].sort((a, b) => a.courtPriority - b.courtPriority || a.venuePriority - b.venuePriority);
                                const result = await bookSlot(groups[time][0]);

                                if (result === 'limit_reached') {
                                    addLog(`🏁 已达预约上限，停止抢票`, 'success');
                                    break;
                                }
                                if (result === 'already_booked') {
                                    continue;
                                }
                                if (result === true) {
                                    addLog(`✅ ${time} 预约成功 (${successfulBookings.length}/${max})`, 'success');
                                }

                                await new Promise(r => setTimeout(r, 500));
                            }
                        }
                    } else {
                        SmartRetry.onFailure();
                        if (retryCount <= 3 || retryCount % 20 === 0) {
                            addLog(`🔍 暂无可预约场地，继续查询...`, 'warning');
                        }
                    }
                } catch (error) {
                    SmartRetry.onFailure();
                    if (NetworkErrorHandler.categorize(error) === 'auth_error') {
                        addLog(`🔐 认证错误，请重新登录`, 'error');
                        break;
                    }
                }

                if (successfulBookings.length < max && isRunning) {
                    const interval = CONFIG.RETRY_INTERVAL * 1000 + (Math.random() * 200 - 100);
                    await new Promise(r => setTimeout(r, Math.max(100, interval)));
                }
            }
        } finally {
            stopBooking();
        }
    }

    function stopBooking() {
        if (!isRunning) return;

        isRunning = false;

        if (Device.isMobile) MobileOptimization.cleanup();

        const btn = document.getElementById('start-btn');
        if (btn) {
            btn.textContent = '🚀 开始抢票';
            btn.style.background = 'linear-gradient(45deg, #ff6b6b, #ee5a52)';
        }

        const max = getMaxBookings();
        const realBookings = successfulBookings.filter(b => b.dhid !== 'duplicate');

        if (realBookings.length) {
            addLog(`🎉 成功预约 ${realBookings.length}/${max} 个时段`, 'success');
            realBookings.forEach((b, i) => addLog(`${i + 1}. ${b.slotName} (${b.dhid})`, 'success'));
        } else {
            addLog(`😢 未成功预约任何场地`, 'warning');
        }

        const elapsed = startTime ? Math.round((new Date() - startTime) / 1000) : 0;
        addLog(`📊 运行 ${elapsed} 秒，查询 ${retryCount} 次`, 'info');
        addLog(`✅ 抢票已停止，可重新配置并开始`, 'info');
    }

    // ==================== 初始化 ====================
    function init() {
        const url = window.location.href;
        if (!url.includes('ehall.szu.edu.cn/qljfwapp/sys/lwSzuCgyy') &&
            !url.includes('ehall-443.webvpn.szu.edu.cn/qljfwapp/sys/lwSzuCgyy')) return;

        const cleaned = Storage.cleanup();
        if (cleaned) addLog(`🧹 清理 ${cleaned} 个过期项`, 'info');

        const getTodayDateTime = () => {
            const d = new Date();
            const date = d.toISOString().split('T')[0];
            const hours = String(d.getHours()).padStart(2, '0');
            const minutes = String(d.getMinutes()).padStart(2, '0');
            return { date, time: `${hours}:${minutes}` };
        };

        // 设置默认定时时间为当前时间的下一个小时
        const defaultDateTime = getTodayDateTime();

        if (Device.isMobile) MobileOptimization.init();
        SmartRetry.reset();

        // 删除这行，不要自动更新日期
        // CONFIG.TARGET_DATE = getTomorrowDate();

        floatingButton = createFloatingButton();
        controlPanel = createControlPanel();
        updateDisplayConfig();

        // 删除这行，使用配置中的日期
        // document.getElementById('target-date').value = getTomorrowDate();

        // 确保UI显示当前配置的日期
        document.getElementById('target-date').value = CONFIG.TARGET_DATE;

        const scheduledDateInput = document.getElementById('scheduled-date');
        const scheduledTimeInput = document.getElementById('scheduled-time');

        if (scheduledDateInput && scheduledTimeInput) {
            scheduledDateInput.value = defaultDateTime.date;
            // 默认设置为下一个整点
            const nextHour = new Date();
            nextHour.setHours(nextHour.getHours() + 1, 0, 0, 0);
            scheduledTimeInput.value = `${String(nextHour.getHours()).padStart(2, '0')}:00`;
        }

        // 检查是否是预约前刷新恢复的状态
        const refreshData = Storage.get('needRefresh', null);
        // 检查刷新标记是否有效（5分钟内触发的刷新）
        const isValidRefresh = refreshData &&
            refreshData.triggered &&
            refreshData.timestamp &&
            (Date.now() - refreshData.timestamp < 5 * 60 * 1000);

        if (refreshData) {
            Storage.remove('needRefresh');
            if (isValidRefresh) {
                addLog('✅ 页面已刷新，会话保持活跃', 'success');
                addLog(`📅 预约日期: ${formatDateDisplay(CONFIG.TARGET_DATE)}`, 'info');
                addLog(`🏟️ ${CONFIG.SPORT} | ${CONFIG.CAMPUS}`, 'info');
            }
        }

        // 恢复定时任务
        if (ScheduledTask.restore()) {
            startCountdown();
            if (isValidRefresh) {
                addLog(`🔄 定时任务已恢复，继续倒计时`, 'success');
            } else {
                addLog(`🔄 已恢复定时任务`, 'success');
            }
        }

        addLog(`🎮 抢票助手已就绪 (${Device.isIPad ? 'iPad' : (Device.isMobile ? '移动端' : '桌面端')})`, 'success');
    }

    // 添加一个格式化日期显示的辅助函数
    function formatDateDisplay(dateStr) {
        const date = new Date(dateStr);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}/${month}/${day}`;
    }


    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 100);
    }
})();