// ==UserScript==
// @name         安徽干部教育自动学习
// @namespace    http://tampermonkey.net/
// @version      1.4.5
// @description  安徽干部教育在线自动学习脚本，支持自动选课、自动章节学习、自动换课，新增 Scorm 课件支持，优化后台运行。
// @author       Moker32
// @license      GPL-3.0-or-later
// @match        https://www.ahgbjy.gov.cn/*
// @icon         https://www.ahgbjy.gov.cn/commons/img/index/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_openInTab
// @grant        unsafeWindow
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542264/%E5%AE%89%E5%BE%BD%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/542264/%E5%AE%89%E5%BE%BD%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        ahgbjy自动学习 V1.4.3                            │
 * │                        Released: 2025-06-13                            │
 * │                        Updated: 2026-01-02                             │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * ✨ 核心特性
 * ├─ 🎯 智能选课：优先选择"学习中"状态课程，支持自动翻页
 * ├─ 📚 自动学习：完整章节学习流程，精确时间计算
 * ├─ 😴 防休眠：Wake Lock API + 多重备用机制
 * ├─ 🔄 课程切换：智能切换下一门课程，支持必修/选修
 * ├─ 🎨 简洁UI：实时状态显示，精确倒计时
 * └─ 🛡️  高稳定：统一错误处理，自动重试机制
 * 
 * 🏗️ 架构设计
 * ├─ VideoAutoplayBlocker  → 视频播放控制
 * ├─ WakeLockManager       → 防休眠系统
 * ├─ BackgroundMonitor     → 后台保活监控
 * ├─ Utils                 → 统一工具函数
 * ├─ UI                    → 用户界面管理
 * ├─ CourseHandler         → 课程处理引擎
 * └─ Router                → 页面路由控制
 * 
 * 💡 V1.4.5
 * • 彻底规避 400 错误：引入 URL Hash (#) 隔离技术，确保脚本自定义指令不发送至服务器
 * • 修复 500 错误：实现页面路径与参数的精准匹配，防止请求参数错配导致服务器崩溃
 * • 增强 Scorm 兼容性：优化弹窗拦截策略，支持手动/自动点击完成并解决窗口关闭安全限制
 * • 锁机制进化：利用 Web Worker 驱动全局播放锁续命，并实现点击瞬间主动释放锁
 *
 * 💡 V1.4.3
 * • 引入生命周期管理器：实现全自动资源回收 (Timers/Listeners/Observers)，彻底杜绝内存泄漏
 * • 智能导航监听：采用 History API Hook 技术实时捕获跳转，极大提升响应速度
 * • 高性能元素等待器：从轮询切换为 MutationObserver 驱动，显著降低后台 CPU 占用
 *
 * 💡 V1.4.2
 * • 实现全后台自动学习：所有学习过程完全在后台进行，无需人工干预
 * • 优化后台刷新机制：增强跨标签页同步，确保进度实时更新
 * • 完善错误处理：增加重试机制和异常捕获，提高脚本稳定性
 */

(function() {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    //                            ⚙️ 全局配置 (Configuration)
    // ════════════════════════════════════════════════════════════════════════
    const CONFIG = {
        TIMEOUTS: {
            DEFAULT_WAIT: 2000,
            POPUP_CHECK: 5000,
            WAKE_LOCK_FALLBACK: 30000,
            PAGE_LOAD: 5000,
            RETRY_DELAY: 1000,
            LONG_ACTIVITY_CHECK: 300000
        },
        SELECTORS: {
            VIDEO: 'video',
            POPUPS: [
                '.video-popup', '.video-ad', '.video-overlay',
                '.player-popup', '.media-popup', '.video-dialog'
            ]
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            🎥 视频控制模块
    // ════════════════════════════════════════════════════════════════════════
    const VideoAutoplayBlocker = {
        _initialized: false,
        _popupInterval: null,
        _videoObserver: null,

        init: () => {
            if (VideoAutoplayBlocker._initialized) return;
            VideoAutoplayBlocker._initialized = true;
            Utils.safeExecute(() => {
                console.log('资源节省模式：视频播放控制启动');
                VideoAutoplayBlocker.blockAutoplay();
                VideoAutoplayBlocker.blockVideoPopups();
            }, '视频控制初始化失败');
        },

        cleanup: () => {
            Utils.safeExecute(() => {
                if (VideoAutoplayBlocker._popupInterval) {
                    Utils.lifecycle.clearInterval(VideoAutoplayBlocker._popupInterval);
                    VideoAutoplayBlocker._popupInterval = null;
                }
                if (VideoAutoplayBlocker._videoObserver) {
                    try { VideoAutoplayBlocker._videoObserver.disconnect(); } catch (_) {}
                    VideoAutoplayBlocker._videoObserver = null;
                }
                VideoAutoplayBlocker._initialized = false;
            }, '视频控制清理失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    阻止播放并节省资源                            │
        // └─────────────────────────────────────────────────────────────────┘
        blockAutoplay: () => {
            Utils.safeExecute(() => {
                const processVideo = (video) => {
                    video.autoplay = false;
                    video.muted = true;
                    video.volume = 0;
                    
                    // 强行暂停视频，节省 CPU/带宽
                    video.pause();
                    
                    // 监听播放尝试并立即制止
                    video.addEventListener('play', () => {
                        console.log('🔇 监测到播放尝试，已强制暂停以节省资源');
                        video.pause();
                    }, true);

                    // 降低资源占用
                    video.style.width = '1px';
                    video.style.height = '1px';
                    video.style.opacity = '0';
                };

                // 处理现有视频
                document.querySelectorAll(CONFIG.SELECTORS.VIDEO).forEach(processVideo);
                
                // 监控动态创建的视频
                if (VideoAutoplayBlocker._videoObserver) {
                    try { VideoAutoplayBlocker._videoObserver.disconnect(); } catch (_) {}
                }
                const observer = Utils.lifecycle.addObserver(new MutationObserver(mutations => {
                    mutations.forEach(mutation => {
                        mutation.addedNodes.forEach(node => {
                            if (node.tagName === 'VIDEO') processVideo(node);
                            if (node.querySelectorAll) {
                                node.querySelectorAll(CONFIG.SELECTORS.VIDEO).forEach(processVideo);
                            }
                        });
                    });
                }));
                
                observer.observe(document.documentElement, { childList: true, subtree: true });
                VideoAutoplayBlocker._videoObserver = observer;
                console.log('✅ 极致资源节省模式已开启 (视频已静默并保持暂停)');
            }, '设置资源节省模式失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    阻止视频弹窗                                  │
        // └─────────────────────────────────────────────────────────────────┘
        blockVideoPopups: () => {
            Utils.safeExecute(() => {
                const hidePopups = () => {
                    CONFIG.SELECTORS.POPUPS.forEach(selector => {
                        const elements = document.querySelectorAll(selector);
                        elements.forEach(element => {
                            if (element) {
                                // 内联 style 不支持直接写 '!important'
                                element.style.setProperty('display', 'none', 'important');
                            }
                        });
                    });
                };
                
                hidePopups();
                // 通过生命周期管理器注册，确保可清理、可避免重复 interval
                if (VideoAutoplayBlocker._popupInterval) {
                    Utils.lifecycle.clearInterval(VideoAutoplayBlocker._popupInterval);
                }
                VideoAutoplayBlocker._popupInterval = Utils.lifecycle.setInterval(hidePopups, CONFIG.TIMEOUTS.POPUP_CHECK);
                console.log('视频弹窗阻止器已启动');
            }, '视频弹窗阻止设置失败');
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            🛠️  防休眠系统
    // ════════════════════════════════════════════════════════════════════════
    const WakeLockManager = {
        wakeLock: null,
        fallbackInterval: null,
        
        init: () => {
            Utils.safeExecute(() => {
                WakeLockManager.requestWakeLock();
                WakeLockManager.setupFallbackKeepAwake();
                WakeLockManager.handleVisibilityChange();
                console.log('防休眠系统已启动');
            }, '防休眠初始化失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    Wake Lock API                                │
        // └─────────────────────────────────────────────────────────────────┘
        requestWakeLock: async () => {
            try {
                if ('wakeLock' in navigator) {
                    WakeLockManager.wakeLock = await navigator.wakeLock.request('screen');
                    console.log('Wake Lock已激活，系统保持唤醒状态');
                    
                    WakeLockManager.wakeLock.addEventListener('release', () => {
                        console.log('Wake Lock已释放');
                    });
                } else {
                    console.log('浏览器不支持Wake Lock API，使用备用方案');
                }
            } catch (error) {
                console.log('Wake Lock请求失败，使用备用方案');
            }
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    备用防休眠机制                                │
        // └─────────────────────────────────────────────────────────────────┘
        setupFallbackKeepAwake: () => {
            Utils.safeExecute(() => {
                // 定期活动保持系统唤醒
                if (WakeLockManager.fallbackInterval) {
                    Utils.lifecycle.clearInterval(WakeLockManager.fallbackInterval);
                }
                WakeLockManager.fallbackInterval = Utils.lifecycle.setInterval(() => {
                    // 轻微的DOM活动
                    document.title = document.title;
                    
                    // 偶尔发送心跳请求
                    if (Math.random() < 0.1) {
                        fetch(window.location.href, { method: 'HEAD' }).catch(() => {});
                    }
                }, CONFIG.TIMEOUTS.WAKE_LOCK_FALLBACK);
                
                console.log('备用防休眠机制已启动');
            }, '备用防休眠设置失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    页面可见性处理                                │
        // └─────────────────────────────────────────────────────────────────┘
        _visibilityHandler: null,

        handleVisibilityChange: () => {
            if (WakeLockManager._visibilityHandler) return;
            WakeLockManager._visibilityHandler = async () => {
                if (!document.hidden && !WakeLockManager.wakeLock) {
                    await WakeLockManager.requestWakeLock();
                }
            };
            Utils.lifecycle.addEventListener(document, 'visibilitychange', WakeLockManager._visibilityHandler);
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    系统清理                                      │
        // └─────────────────────────────────────────────────────────────────┘
        cleanup: () => {
            Utils.safeExecute(() => {
                if (WakeLockManager.wakeLock) {
                    WakeLockManager.wakeLock.release();
                    WakeLockManager.wakeLock = null;
                }
                
                if (WakeLockManager.fallbackInterval) {
                    Utils.lifecycle.clearInterval(WakeLockManager.fallbackInterval);
                    WakeLockManager.fallbackInterval = null;
                }
                
                console.log('防休眠系统已清理');
            }, '防休眠清理失败');
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            📱 后台监控系统
    // ════════════════════════════════════════════════════════════════════════
    const BackgroundMonitor = {
        isVisible: !document.hidden,
        backgroundTime: 0,
        pendingActions: new Map(),
        keepAliveWorker: null,
        lastSignalTime: 0, 
        
        _initialized: false,
        _forceCheckInterval: null,
        _visibilityHandler: null,

        init: () => {
            if (BackgroundMonitor._initialized) return;
            BackgroundMonitor._initialized = true;
            Utils.safeExecute(() => {
                // 初始化信号记录：记录页面加载时的信号值
                BackgroundMonitor.lastSignalTime = GM_getValue('remote_refresh_signal', 0);
                console.log(`📡 初始化刷新信号基准: ${BackgroundMonitor.lastSignalTime}`);

                // 页面可见性监控（可清理、避免重复注册）
                BackgroundMonitor._visibilityHandler = BackgroundMonitor.handleVisibilityChange;
                Utils.lifecycle.addEventListener(document, 'visibilitychange', BackgroundMonitor._visibilityHandler);

                // 简化的定时器替换
                BackgroundMonitor.replaceTimers();

                // Web Worker保活
                BackgroundMonitor.createKeepAliveWorker();

                // 路由变化监听（History API hook）+ 低频兜底
                BackgroundMonitor.setupNavigationWatch();

                console.log('双重后台监控系统已启动');
            }, '后台监控初始化失败');
        },
        
        handleVisibilityChange: () => {
            Utils.safeExecute(() => {
                BackgroundMonitor.isVisible = !document.hidden;
                const status = BackgroundMonitor.isVisible ? '前台' : '后台';
                console.log(`页面状态切换: ${status}`);
                UI.updateBackgroundStatus(!BackgroundMonitor.isVisible);

                if (!BackgroundMonitor.isVisible) {
                    BackgroundMonitor.backgroundTime = Date.now();
                    console.log('页面进入后台');
                } else {
                    console.log('页面恢复前台，立即检查待执行动作和刷新标志');
                    BackgroundMonitor.processPendingActions();
                    BackgroundMonitor.checkPendingActions();
                }
            }, '可见性变化处理失败');
        },
        
        // 简化的Web Worker保活（降频 + 避免高频 GM 读写）
        createKeepAliveWorker: () => {
            Utils.safeExecute(() => {
                // 若重复 init，先清理旧 worker
                if (BackgroundMonitor.keepAliveWorker) {
                    try { BackgroundMonitor.keepAliveWorker.postMessage('stop'); } catch (_) {}
                    try { BackgroundMonitor.keepAliveWorker.terminate(); } catch (_) {}
                    BackgroundMonitor.keepAliveWorker = null;
                }

                const tickInterval = 5000; // 与全局锁心跳(5s)保持一致，降低消耗
                const workerScript = `
                    let interval = null;
                    let isActive = true;

                    const startKeepAlive = () => {
                        interval = setInterval(() => {
                            if (isActive) {
                                postMessage({type: 'tick', timestamp: Date.now()});
                            }
                        }, ${tickInterval});
                    };

                    startKeepAlive();

                    self.onmessage = function(e) {
                        if (e.data === 'stop') {
                            isActive = false;
                            if (interval) clearInterval(interval);
                        }
                    };
                `;

                const blob = new Blob([workerScript], { type: 'application/javascript' });
                const url = URL.createObjectURL(blob);
                const worker = new Worker(url);

                // 释放 blob url
                Utils.lifecycle.addCleanup(() => {
                    try { URL.revokeObjectURL(url); } catch (_) {}
                });

                worker.onmessage = (e) => {
                    if (e.data.type === 'tick') {
                        // 1. 锁续命 (利用 Worker 线程不受后台降频影响的特性)
                        if (typeof Utils !== 'undefined' && Utils.globalLock) {
                            Utils.globalLock.heartbeat();
                        }
                        // 2. 检查待执行动作
                        BackgroundMonitor.checkPendingActions();
                    }
                };

                BackgroundMonitor.keepAliveWorker = worker;
                console.log('Web Worker保活已启动');
            }, 'Web Worker创建失败');
        },
        
        // 简化的定时器替换（优化版本）
        replaceTimers: () => {
            Utils.safeExecute(() => {
                // 由于已有 Wake Lock API 和 Web Worker 保活机制，简化定时器替换逻辑
                console.log('定时器管理已简化，依赖Wake Lock和Web Worker保活');
            }, '定时器替换失败');
        },
        
        // 简化的后台动作调度
        scheduleBackgroundAction: (actionId, callback, delay = 0) => {
            const action = {
                id: actionId,
                callback: callback,
                scheduledTime: Date.now() + delay,
                executed: false
            };

            BackgroundMonitor.pendingActions.set(actionId, action);
            console.log(`注册后台动作: ${actionId}, 延迟: ${delay}ms`);

            // 延迟执行（可清理）
            Utils.lifecycle.setTimeout(() => {
                if (!action.executed) {
                    Utils.safeExecute(callback, `动作执行失败: ${actionId}`);
                    action.executed = true;
                    BackgroundMonitor.pendingActions.delete(actionId);
                }
            }, delay);

            return actionId;
        },
        
        // 检查待执行动作
        checkPendingActions: () => {
            Utils.safeExecute(() => {
                const currentUrl = window.location.href;

                // 1. 【核心修复】将强力刷新逻辑挂载到每秒一次的 Web Worker 心跳上
                // 这样即使页面在后台，也能每秒检查一次刷新标志位
                if (currentUrl.includes('courselist.do') || currentUrl.includes('thematicclassdetail.do') || currentUrl.includes('coursedetail.do')) {
                    const forceReload = GM_getValue('force_reload_requested', false);
                    const lastRefresh = GM_getValue('last_refresh_time', 0);
                    const now = Date.now();

                    // 手动点击触发的刷新请求不受冷却限制 (通过 remote_refresh_signal 变化判断)
                    const remoteSignal = GM_getValue('remote_refresh_signal', 0);
                    const lastCapturedSignal = parseInt(sessionStorage.getItem('last_captured_signal') || '0');
                    const isNewManualSignal = remoteSignal > lastCapturedSignal;

                    if ((forceReload === true || isNewManualSignal) && (now - lastRefresh) > 1500) {
                        console.log('📡 [Worker心跳] 捕获到刷新信号，立即执行');
                        GM_setValue('force_reload_requested', false);
                        GM_setValue('last_refresh_time', now);
                        sessionStorage.setItem('last_captured_signal', remoteSignal.toString());

                        UI.updateStatus('章节已完成，正在更新列表...', 'success');

                        // 🚀 核心修复：根据当前页面路径精准生成跳转目标，防止路径与参数错配导致 500 错误
                        const currentUrl = window.location.href;
                        let targetPage = 'courselist.do';
                        let params = '';

                        if (currentUrl.includes('courselist.do')) {
                            targetPage = 'courselist.do';
                            params = `coutype=${Utils.url.getParam('coutype') || '1'}`;
                        } else if (currentUrl.includes('coursedetail.do')) {
                            targetPage = 'coursedetail.do';
                            params = `courseid=${Utils.url.extractCourseId(currentUrl)}`;
                        } else if (currentUrl.includes('thematicclassdetail.do')) {
                            targetPage = 'thematicclassdetail.do';
                            params = `tid=${Utils.url.getParam('tid')}`;
                        }

                        const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                        const cleanUrl = `${baseUrl}${targetPage}?${params}#auto_continue=true&refresh_ts=${now}`;

                        // 添加重试机制
                        let retryCount = 0;
                        const performRefresh = () => {
                            try {
                                console.log(`执行精简刷新 (尝试 ${retryCount + 1}/3): ${cleanUrl}`);
                                window.location.replace(cleanUrl);
                            } catch (error) {
                                if (retryCount < 3) {
                                    retryCount++;
                                    console.log(`刷新失败，第${retryCount}次重试...`);
                                    Utils.lifecycle.setTimeout(performRefresh, 1000);
                                } else {
                                    console.error('页面刷新失败，已达到最大重试次数');
                                }
                            }
                        };
                        performRefresh();
                        return;
                    }
                }

                const now = Date.now();
                for (const [actionId, action] of BackgroundMonitor.pendingActions) {
                    if (!action.executed && now >= action.scheduledTime) {
                        console.log(`执行待处理动作: ${actionId}`);
                        Utils.safeExecute(action.callback, `执行动作失败: ${actionId}`);
                        action.executed = true;
                        BackgroundMonitor.pendingActions.delete(actionId);
                    }
                }
            }, '检查待执行动作失败');
        },
        
        // 处理页面恢复时的待执行动作
        processPendingActions: () => {
            Utils.safeExecute(() => {
                for (const [actionId, action] of BackgroundMonitor.pendingActions) {
                    if (!action.executed) {
                        console.log(`页面恢复，立即执行动作: ${actionId}`);
                        Utils.safeExecute(action.callback, `恢复执行动作失败: ${actionId}`);
                        action.executed = true;
                        BackgroundMonitor.pendingActions.delete(actionId);
                    }
                }
            }, '处理恢复动作失败');
        },
        
        // 路由/页面变化监听：优先使用 History API hook，保留低频兜底
        setupNavigationWatch: () => {
            Utils.safeExecute(() => {
                const notify = () => {
                    const currentUrl = window.location.href;
                    const lastUrl = sessionStorage.getItem('lastUrl') || '';
                    if (currentUrl.includes('/pc/login.do')) return;

                    if (currentUrl !== lastUrl) {
                        console.log(`检测到页面变化: ${lastUrl} -> ${currentUrl}`);
                        sessionStorage.setItem('lastUrl', currentUrl);
                        Utils.lifecycle.setTimeout(() => Router.handleCurrentPage(), CONFIG.TIMEOUTS.DEFAULT_WAIT);
                    }
                };

                // hook history
                const hookHistory = () => {
                    const rawPushState = history.pushState;
                    const rawReplaceState = history.replaceState;

                    const wrap = (fn) => function(...args) {
                        const ret = fn.apply(this, args);
                        try { notify(); } catch (_) {}
                        return ret;
                    };

                    history.pushState = wrap(rawPushState);
                    history.replaceState = wrap(rawReplaceState);

                    // restore on cleanup
                    Utils.lifecycle.addCleanup(() => {
                        history.pushState = rawPushState;
                        history.replaceState = rawReplaceState;
                    });
                };

                hookHistory();
                Utils.lifecycle.addEventListener(window, 'popstate', notify);
                Utils.lifecycle.addEventListener(window, 'hashchange', notify);

                // 低频兜底：避免站点非标准跳转无法触发 hook
                if (BackgroundMonitor._forceCheckInterval) {
                    Utils.lifecycle.clearInterval(BackgroundMonitor._forceCheckInterval);
                }
                BackgroundMonitor._forceCheckInterval = Utils.lifecycle.setInterval(() => {
                    try { notify(); } catch (_) {}

                    const currentUrl = window.location.href;
                    const lastActiveTime = sessionStorage.getItem('lastActiveTime');
                    if (lastActiveTime) {
                        const elapsed = Date.now() - parseInt(lastActiveTime);
                        if (elapsed > CONFIG.TIMEOUTS.LONG_ACTIVITY_CHECK && currentUrl.includes('coursedetail.do')) {
                            console.log('长时间无活动，强制检查课程详情页状态');
                            sessionStorage.setItem('lastActiveTime', Date.now().toString());
                            Router.handleCourseDetailPage();
                        }
                    }
                }, CONFIG.TIMEOUTS.WAKE_LOCK_FALLBACK);

                console.log('页面变化监听已启动（History hook + 低频兜底）');
            }, '页面变化监听设置失败');
        },
        
        cleanup: () => {
            Utils.safeExecute(() => {
                BackgroundMonitor.pendingActions.clear();

                if (BackgroundMonitor.keepAliveWorker) {
                    try { BackgroundMonitor.keepAliveWorker.postMessage('stop'); } catch (_) {}
                    try { BackgroundMonitor.keepAliveWorker.terminate(); } catch (_) {}
                    BackgroundMonitor.keepAliveWorker = null;
                }

                if (BackgroundMonitor._forceCheckInterval) {
                    Utils.lifecycle.clearInterval(BackgroundMonitor._forceCheckInterval);
                    BackgroundMonitor._forceCheckInterval = null;
                }

                BackgroundMonitor._initialized = false;
                console.log('后台监控已清理');
            }, '后台监控清理失败');
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            🔧 统一工具模块
    // ════════════════════════════════════════════════════════════════════════
    const Utils = {
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    生命周期/资源清理 (Lifecycle)                          │
        // └──────────────────────────────────────────────────────────────────────────┘
        lifecycle: {
            _intervals: new Set(),
            _timeouts: new Set(),
            _listeners: [],
            _observers: new Set(),
            _cleaners: [],

            addCleanup(fn) {
                if (typeof fn === 'function') this._cleaners.push(fn);
            },

            setInterval(fn, ms) {
                const id = setInterval(fn, ms);
                this._intervals.add(id);
                return id;
            },

            clearInterval(id) {
                if (id) {
                    clearInterval(id);
                    this._intervals.delete(id);
                }
            },

            setTimeout(fn, ms) {
                const id = setTimeout(() => {
                    this._timeouts.delete(id);
                    fn();
                }, ms);
                this._timeouts.add(id);
                return id;
            },

            clearTimeout(id) {
                if (id) {
                    clearTimeout(id);
                    this._timeouts.delete(id);
                }
            },

            addEventListener(target, type, handler, options) {
                if (!target || typeof target.addEventListener !== 'function') return;
                target.addEventListener(type, handler, options);
                this._listeners.push({ target, type, handler, options });
            },

            addObserver(observer) {
                if (observer) this._observers.add(observer);
                return observer;
            },

            cleanup() {
                // observers
                for (const ob of this._observers) {
                    try { ob.disconnect(); } catch (_) {}
                }
                this._observers.clear();

                // listeners
                for (const { target, type, handler, options } of this._listeners) {
                    try { target.removeEventListener(type, handler, options); } catch (_) {}
                }
                this._listeners = [];

                // timers
                for (const id of this._intervals) {
                    try { clearInterval(id); } catch (_) {}
                }
                this._intervals.clear();

                for (const id of this._timeouts) {
                    try { clearTimeout(id); } catch (_) {}
                }
                this._timeouts.clear();

                // custom cleaners
                for (const fn of this._cleaners) {
                    try { fn(); } catch (_) {}
                }
                this._cleaners = [];
            }
        },

        // ┌──────────────────────────────────────────────────────────────────────────┐
        // │                    统一错误处理                                  │
        // └─────────────────────────────────────────────────────────────────┘
        safeExecute: (func, errorMsg = '操作失败') => {
            try {
                return func();
            } catch (error) {
                console.error(`${errorMsg}: ${error.message}`);
                return null;
            }
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    智能重试机制                                  │
        // └─────────────────────────────────────────────────────────────────┘
        retry: (func, maxRetries = 3, delay = 1000, errorMsg = '重试失败') => {
            let attempts = 0;
            
            const attempt = () => {
                try {
                    const result = func();
                    if (result !== false && result !== null && result !== undefined) {
                        return result;
                    }
                } catch (error) {
                    console.error(`尝试 ${attempts + 1} 失败: ${error.message}`);
                }
                
                attempts++;
                if (attempts < maxRetries) {
                    Utils.lifecycle.setTimeout(attempt, delay);
                } else {
                    console.error(`${errorMsg}: 已达最大重试次数`);
                }
            };
            
            attempt();
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    DOM 选择器                                   │
        // └─────────────────────────────────────────────────────────────────┘
        $: (selector, context = document) => {
            return Utils.safeExecute(() => context.querySelector(selector), `查询失败: ${selector}`);
        },
        
        $$: (selector, context = document) => {
            return Utils.safeExecute(() => Array.from(context.querySelectorAll(selector)), `查询失败: ${selector}`) || [];
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    元素等待器                                    │
        // └─────────────────────────────────────────────────────────────────┘
        waitForElement: (selector, timeout = 10000) => {
            // 优先使用 MutationObserver 事件化等待，减少轮询
            return new Promise((resolve) => {
                Utils.safeExecute(() => {
                    const getNow = () => Utils.$$(selector);

                    const existing = getNow();
                    if (existing.length > 0) {
                        resolve(existing);
                        return;
                    }

                    const startTime = Date.now();
                    let done = false;

                    const finish = (elements) => {
                        if (done) return;
                        done = true;
                        try { observer.disconnect(); } catch (_) {}
                        Utils.lifecycle.clearTimeout(timeoutId);
                        resolve(elements);
                    };

                    // observer
                    const observer = Utils.lifecycle.addObserver(new MutationObserver(() => {
                        const elements = getNow();
                        if (elements.length > 0) finish(elements);
                    }));

                    observer.observe(document.documentElement, { childList: true, subtree: true });

                    // timeout 兜底
                    const timeoutId = Utils.lifecycle.setTimeout(() => {
                        const elements = getNow();
                        finish(elements);
                    }, timeout);

                    // 前台时也做一次轻量 rAF 兜底（有些站点 DOM 变化不会触发 observer 的极端情况）
                    if (!document.hidden) {
                        requestAnimationFrame(() => {
                            const elements = getNow();
                            if (elements.length > 0 && !done) finish(elements);
                        });
                    }
                }, '等待元素失败');
            });
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    页面导航器                                    │
        // └─────────────────────────────────────────────────────────────────┘
        navigateTo: (url, reason = '页面跳转') => {
            Utils.safeExecute(() => {
                console.log(`${reason}: ${url}`);
                sessionStorage.setItem('returning', 'true');
                window.location.href = url;
                
                // 单一备用机制（可清理）
                Utils.lifecycle.setTimeout(() => {
                    // 简单的URL比较可能因为末尾斜杠或参数顺序不同而失败，这里只做基本检查
                    if (!window.location.href.includes(url.split('?')[0])) {
                        console.log('备用导航触发');
                        window.location.assign(url);
                    }
                }, CONFIG.TIMEOUTS.DEFAULT_WAIT);
            }, `导航失败: ${url}`);
        },

        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    DOM 操作工具                                  │
        // └─────────────────────────────────────────────────────────────────┘
        dom: {
            // 智能点击：点击 -> 验证 -> 备用重试
            smartClick: (element, description = '点击操作') => {
                return Utils.safeExecute(() => {
                    if (!element) {
                        console.error(`${description}: 元素不存在`);
                        return false;
                    }

                    console.log(`执行: ${description}`);
                    const currentUrl = window.location.href;
                    
                    // 检查是否为新标签页链接
                    const isNewTab = element.tagName === 'A' && element.getAttribute('target') === '_blank';
                    let href = element.getAttribute('href');
                    
                    // 如果是视频播放链接，强制在后台打开
                    if (isNewTab && href && (href.includes('playvideo.do') || href.includes('playscorm.do'))) {
                        // 将相对路径转换为绝对路径
                        if (!href.startsWith('http')) {
                            href = new URL(href, window.location.href).href;
                        }
                        
                        // 添加后台模式标记
                        if (!href.includes('#bg_mode=1')) {
                            href += '#bg_mode=1';
                        }
                        
                        if (typeof GM_openInTab === 'function') {
                            console.log(`🔕 后台静默打开视频页面: ${href}`);
                            GM_openInTab(href, { active: false, insert: true });
                            return true;
                        }
                    }
                    
                    element.click();

                    // 备用重试机制 (仅对非新标签页跳转有效)
                    if (!isNewTab) {
                        Utils.lifecycle.setTimeout(() => {
                            // 如果URL没变，且元素还在文档中，尝试再次点击
                            if (window.location.href === currentUrl && document.body.contains(element)) {
                                console.log(`${description}: 页面未响应，执行备用点击`);
                                element.click();
                            }
                        }, CONFIG.TIMEOUTS.DEFAULT_WAIT);
                    } else {
                        console.log(`${description}: 新标签页打开，跳过跳转验证`);
                    }
                    
                    return true;
                }, `${description}失败`);
            }
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    时间处理工具                                  │
        // └─────────────────────────────────────────────────────────────────┘
        extractMinutes: text => {
            if (!text) return 30;
            const match = text.match(/(\d+)/);
            return match ? parseInt(match[1]) : 30;
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    安全防护设置                                  │
        // └─────────────────────────────────────────────────────────────────┘
        setupProtection: () => {
            Utils.safeExecute(() => {
                // 基础弹窗处理：将 alert 转为控制台日志，confirm 默认返回 true 以保证自动流程不中断
                unsafeWindow.alert = (msg) => console.log(`[屏蔽弹窗] alert: ${msg}`);
                unsafeWindow.confirm = (msg) => {
                    console.log(`[自动确认] confirm: ${msg}`);
                    return true;
                };
                unsafeWindow.prompt = () => {
                    console.log('[屏蔽弹窗] prompt');
                    return '';
                };
                
                // 屏蔽窗口聚焦，防止后台页面抢占焦点
                unsafeWindow.focus = () => console.log('窗口聚焦请求被屏蔽');

                // 🛡️ 拦截站点原生脚本的已知兼容性错误 (如 FlexNav 插件在 DOM 变动时的计算错误)
                window.addEventListener('error', (event) => {
                    const msg = event.message || '';
                    const file = event.filename || '';
                    if (
                        (msg.includes("'left'") || msg.includes('undefined (reading \'left\')')) && 
                        (file.includes('flexnav') || file.includes('jquery'))
                    ) {
                        event.preventDefault();
                        console.log('🛡️ 已拦截并屏蔽站点原生 FlexNav 插件的定位计算错误 (不影响脚本运行)');
                    }
                }, true);
                
                // 劫持 window.open，强制后台打开视频页面
                const originalOpen = unsafeWindow.open;
                unsafeWindow.open = (url, target, features) => {
                    if (url && typeof url === 'string' && (url.includes('playvideo.do') || url.includes('playscorm.do'))) {
                        // 将相对路径转换为绝对路径
                        let fullUrl = url;
                        if (!url.startsWith('http')) {
                            try {
                                fullUrl = new URL(url, window.location.href).href;
                            } catch (e) {
                                console.error('URL转换失败:', e);
                                fullUrl = url;
                            }
                        }

                        // 添加后台模式标记
                        if (!fullUrl.includes('#bg_mode=1')) {
                            fullUrl += '#bg_mode=1';
                        }

                        console.log(`🔕 拦截 window.open 弹窗，转为后台静默打开: ${fullUrl}`);
                        if (typeof GM_openInTab === 'function') {
                            GM_openInTab(fullUrl, { active: false, insert: true });
                            return null;
                        }
                    }
                    return originalOpen(url, target, features);
                };

                // 防止WebDriver检测
                if (window.navigator) {
                    Object.defineProperty(navigator, 'webdriver', { get: () => false });
                }
                
                console.log('基础防护设置已启用');
            }, '防护设置失败');
        },

        // ═══════════════════════════════════════════════════════════════════
        //                           💾 存储管理
        // ═══════════════════════════════════════════════════════════════════
        storage: {
            get: (key, defaultValue = '') => {
                return Utils.safeExecute(() => GM_getValue(key, defaultValue), `存储读取错误: ${key}`, defaultValue);
            },
            
            set: (key, value) => {
                Utils.safeExecute(() => GM_setValue(key, value), `存储写入错误: ${key}`);
            },
            
            getVisited: () => {
                return Utils.safeExecute(() => {
                    return GM_getValue('visitedCourses', []);
                }, '获取访问记录错误', []);
            },
            
            addVisited: courseId => {
                Utils.safeExecute(() => {
                    const visited = Utils.storage.getVisited();
                    if (!visited.includes(courseId)) {
                        visited.push(courseId);
                        GM_setValue('visitedCourses', visited);
                    }
                }, `添加访问记录错误: ${courseId}`);
            },
            
            clearVisited: () => {
                Utils.safeExecute(() => GM_setValue('visitedCourses', []), '清除访问记录错误');
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        //                           🔗 URL处理
        // ═══════════════════════════════════════════════════════════════════
        url: {
            extractCourseId: url => {
                const match = url.match(/courseid=([0-9A-F-]{36})/i) || url.match(/courseid=(\d+)/);
                return match ? match[1] : null;
            },
            
            extractChapterId: url => {
                const match = url.match(/chapterid=([0-9A-F-]{36})/i) || url.match(/chapterid=(\d+)/);
                return match ? match[1] : null;
            },
            
            getParam: name => {
                const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`);
                const results = regex.exec(window.location.href);
                return results && results[2] ? decodeURIComponent(results[2].replace(/\+/g, ' ')) : null;
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        //                           🔄 状态同步 (State Manager)
        // ═══════════════════════════════════════════════════════════════════
        stateManager: {
            stateKey: 'global_app_state',
            
            // 设置跨标签页状态
            setThematicState: (thematicClassId, learningMode = 'thematic') => {
                const state = {
                    thematicClassId,
                    learningMode,
                    timestamp: Date.now()
                };
                Utils.storage.set(Utils.stateManager.stateKey, state);
                console.log(`🔄 状态已同步 - ID: ${thematicClassId}, Mode: ${learningMode}`);
            },
            
            // 获取跨标签页状态
            getThematicState: () => {
                const state = Utils.storage.get(Utils.stateManager.stateKey, null);
                
                // 检查状态是否过期（超过30分钟）
                if (state && state.timestamp && (Date.now() - state.timestamp) > 1800000) {
                    console.log('🔄 状态已过期，清除');
                    Utils.stateManager.clearThematicState();
                    return null;
                }
                
                return state && state.thematicClassId ? state : null;
            },
            
            // 清除跨标签页状态
            clearThematicState: () => {
                Utils.storage.set(Utils.stateManager.stateKey, null);
                console.log('🔄 状态已清除');
            },

            // 监听状态变化
            listen: (callback) => {
                if (typeof GM_addValueChangeListener === 'function') {
                    GM_addValueChangeListener(Utils.stateManager.stateKey, (name, oldVal, newVal, remote) => {
                        if (remote && newVal) {
                            console.log('🔄 检测到远程状态变化', newVal);
                            callback(newVal);
                        }
                    });
                }
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        //                           🔒 全局播放锁 (Global Lock)
        // ═══════════════════════════════════════════════════════════════════
        globalLock: {
            lockKey: 'ahgbjy_play_lock',
            
            // 检查是否被锁定（有其他页面正在播放）
            isLocked: () => {
                const lockData = Utils.storage.get(Utils.globalLock.lockKey, null);
                if (!lockData) return false;
                
                // 检查心跳是否超时（超过30秒未更新视为死锁，可抢占）
                const now = Date.now();
                if (now - lockData.timestamp > 30000) {
                    console.log('🔓 全局锁已超时，视为未锁定');
                    return false;
                }
                
                console.log(`🔒 系统被锁定: ${lockData.courseId} (上次心跳: ${Math.round((now - lockData.timestamp)/1000)}秒前)`);
                return true;
            },
            
            // 续命锁（由 BackgroundMonitor 周期性调用）
            heartbeat: () => {
                if (sessionStorage.getItem('currentlyStudying') !== 'true') return;
                const courseId = sessionStorage.getItem('currentLockCourseId');
                if (!courseId) return;

                // 优化：直接写入续命，避免读取开销
                Utils.storage.set(Utils.globalLock.lockKey, {
                    courseId: courseId,
                    timestamp: Date.now()
                });
            },

            // 获取锁（开始播放时调用）
            acquire: (courseId) => {
                sessionStorage.setItem('currentlyStudying', 'true');
                sessionStorage.setItem('currentLockCourseId', courseId);
                
                // 立即执行一次心跳锁定
                Utils.globalLock.heartbeat();
                console.log(`🔒 已获取全局播放锁: ${courseId}`);
            },
            
            // 释放锁（播放结束或关闭时调用）
            release: () => {
                const currentCourseId = sessionStorage.getItem('currentLockCourseId');
                const lockData = Utils.storage.get(Utils.globalLock.lockKey, null);
                
                // 仅当锁确实属于自己时才释放，防止误释放他人的锁
                if (lockData && lockData.courseId === currentCourseId) {
                    Utils.storage.set(Utils.globalLock.lockKey, null);
                    console.log(`🔓 已释放全局播放锁: ${currentCourseId}`);
                }
                
                sessionStorage.removeItem('currentlyStudying');
                sessionStorage.removeItem('currentLockCourseId');
            }
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            🎨 用户界面模块
    // ════════════════════════════════════════════════════════════════════════
    const UI = {
        panel: null,
        stats: {
            startTime: Date.now(),
            coursesCompleted: 0,
            backgroundTime: 0
        },
        
        init: () => {
            Utils.safeExecute(() => {
                UI.createPanel();
                UI.updateStatus('脚本已启动', 'info');
                console.log('用户界面已初始化');
            }, '用户界面初始化失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    创建控制面板                                  │
        // └─────────────────────────────────────────────────────────────────┘
        createPanel: () => {
            Utils.safeExecute(() => {
                const panel = document.createElement('div');
                panel.id = 'study-assistant-panel';
                panel.innerHTML = `
                    <div style="position: fixed; top: 10px; right: 10px; width: 300px; background: #fff; border: 1px solid #ddd; border-radius: 5px; padding: 15px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); z-index: 10000; font-family: Arial, sans-serif; font-size: 12px;">
                        <div style="font-weight: bold; margin-bottom: 10px; color: #333;">安徽干部教育助手 V1.4.5</div>
                        <div id="status-display" style="padding: 8px; background: #f5f5f5; border-radius: 3px; margin-bottom: 10px; min-height: 20px;"></div>
                        <div id="background-status" style="padding: 5px; background: #e8f5e8; border-radius: 3px; font-size: 11px; text-align: center;">前台运行中</div>
                    </div>
                `;
                
                document.body.appendChild(panel);
                UI.panel = panel;
            }, 'UI面板创建失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    状态更新器                                    │
        // └─────────────────────────────────────────────────────────────────┘
        updateStatus: (message, type = 'info') => {
            Utils.safeExecute(() => {
                const statusEl = document.getElementById('status-display');
                if (statusEl) {
                    const colors = {
                        info: '#2196F3',
                        success: '#4CAF50',
                        warning: '#FF9800',
                        error: '#F44336'
                    };
                    statusEl.style.color = colors[type] || colors.info;
                    statusEl.textContent = message;
                }
            }, '状态更新失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    后台状态指示器                                │
        // └─────────────────────────────────────────────────────────────────┘
        updateBackgroundStatus: (isBackground) => {
            Utils.safeExecute(() => {
                const bgEl = document.getElementById('background-status');
                if (bgEl) {
                    if (isBackground) {
                        bgEl.textContent = '后台运行中';
                        bgEl.style.background = '#fff3cd';
                        UI.stats.backgroundTime = Date.now();
                    } else {
                        bgEl.textContent = '前台运行中';
                        bgEl.style.background = '#e8f5e8';
                    }
                }
            }, '后台状态更新失败');
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            📚 课程处理引擎
    // ════════════════════════════════════════════════════════════════════════
    const CourseHandler = {
        currentCourse: null,
        isProcessing: false,
        
        init: () => {
            Utils.safeExecute(() => {
                // 监听远程刷新信号（用于静默学习模式）
                if (typeof GM_addValueChangeListener === 'function') {
                    GM_addValueChangeListener('remote_refresh_signal', (name, oldVal, newVal, remote) => {
                        if (remote) {
                            console.log('📡 收到远程刷新信号，准备更新课程列表');
                            const currentUrl = window.location.href;
                            // 仅在课程列表页、专题班详情页或课程详情页响应
                            if (currentUrl.includes('courselist.do') || currentUrl.includes('thematicclassdetail.do') || currentUrl.includes('coursedetail.do')) {
                                UI.updateStatus('课程已完成，正在刷新列表...', 'success');
                                
                                // 强制刷新：添加时间戳防止缓存
                                const urlObj = new URL(window.location.href);
                                urlObj.searchParams.set('_t', Date.now());
                                
                                Utils.lifecycle.setTimeout(() => window.location.href = urlObj.href, 1500);
                            }
                        }
                    });
                }

                // 首先尝试从状态管理器恢复跨标签页状态
                const appState = Utils.stateManager.getThematicState();
                if (appState) {
                    console.log(`🔄 初始化时从存储恢复状态: ${JSON.stringify(appState)}`);
                    sessionStorage.setItem('currentThematicClassId', appState.thematicClassId);
                    sessionStorage.setItem('learningMode', appState.learningMode || 'thematic');
                    sessionStorage.setItem('isThematicClass', 'true');
                }
                
                // 恢复学习模式状态
                CourseHandler.recoverLearningMode();
                console.log('课程处理器已初始化');
            }, '课程处理器初始化失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    学习模式状态恢复                              │
        // └─────────────────────────────────────────────────────────────────┘
        recoverLearningMode: () => {
            Utils.safeExecute(() => {
                const currentUrl = window.location.href;
                const savedMode = sessionStorage.getItem('learningMode');
                const thematicClassId = sessionStorage.getItem('currentThematicClassId');
                const isThematicClass = sessionStorage.getItem('isThematicClass') === 'true';
                const fromThematicLearning = sessionStorage.getItem('fromThematicLearning') === 'true';
                
                console.log(`尝试恢复学习模式 - savedMode: ${savedMode}, thematicClassId: ${thematicClassId}, isThematicClass: ${isThematicClass}, fromThematicLearning: ${fromThematicLearning}`);
                
                // 优先从状态管理器获取跨标签页状态
                const appState = Utils.stateManager.getThematicState();
                if (appState) {
                    console.log(`🔄 从存储恢复状态: ${JSON.stringify(appState)}`);
                    if (!thematicClassId && appState.thematicClassId) {
                        sessionStorage.setItem('currentThematicClassId', appState.thematicClassId);
                        console.log(`🔄 从存储恢复专题班ID: ${appState.thematicClassId}`);
                    }
                    if (!savedMode && appState.learningMode) {
                        sessionStorage.setItem('learningMode', appState.learningMode);
                        console.log(`🔄 从存储恢复学习模式: ${appState.learningMode}`);
                    }
                }
                
                // 根据当前页面和保存的状态恢复学习模式
                if (currentUrl.includes('thematicclass')) {
                    // 如果在专题班相关页面，确保模式正确
                    if (savedMode !== 'thematic') {
                        sessionStorage.setItem('learningMode', 'thematic');
                        console.log('🔄 恢复专题班学习模式');
                    }
                    
                    // 如果从学习返回，确保专题班ID正确
                    if (fromThematicLearning) {
                        const tidFromUrl = Utils.url.getParam('tid') || thematicClassId;
                        if (tidFromUrl && !thematicClassId) {
                            sessionStorage.setItem('currentThematicClassId', tidFromUrl);
                            console.log(`📝 从学习返回，恢复专题班ID: ${tidFromUrl}`);
                        }
                    }
                } else if (currentUrl.includes('courselist.do') && (savedMode === 'thematic' || thematicClassId || fromThematicLearning)) {
                    // 如果处于专题班模式但回到了主课表，可能是错误返回
                    console.log('⚠️ 检测到专题班模式下返回主课表，可能需要修正');
                    
                    // 如果有关专题班ID，提供返回选项
                    if (thematicClassId) {
                        console.log(`可以返回专题班列表继续处理 - ID: ${thematicClassId}`);
                    }
                } else if (currentUrl.includes('coursedetail.do') && (savedMode === 'thematic' || isThematicClass)) {
                    // 如果在课程详情页且处于专题班模式，确保状态一致
                    console.log('📚 处于专题班模式的课程详情页');
                }
                
                // 验证并修复不一致的状态
                if ((savedMode === 'thematic' || isThematicClass || fromThematicLearning) && !thematicClassId && currentUrl.includes('thematicclassdetail.do')) {
                    // 尝试从URL提取专题班ID
                    const tidFromUrl = Utils.url.getParam('tid');
                    if (tidFromUrl) {
                        sessionStorage.setItem('currentThematicClassId', tidFromUrl);
                        console.log(`📝 从URL恢复专题班ID: ${tidFromUrl}`);
                    }
                }
            }, '学习模式状态恢复失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    智能课程打开器                                │
        // └─────────────────────────────────────────────────────────────────┘
        openCourse: (courseElement) => {
            if (!courseElement) return;
            
            // 🔒 检查全局锁
            if (Utils.globalLock.isLocked()) {
                console.log('⛔ 拦截打开操作：检测到其他页面正在播放视频');
                UI.updateStatus('其他课程学习中...', 'warning');
                return;
            }
            
            Utils.safeExecute(() => {
                CourseHandler.isProcessing = true;
                const courseTitle = courseElement.textContent?.trim().substring(0, 20) || '未知课程';
                console.log(`准备打开课程: ${courseTitle}`);
                UI.updateStatus(`正在打开: ${courseTitle}`, 'info');
                
                // 查找链接：自身 -> 子元素 -> 行内第一个有效链接
                let link = courseElement.tagName === 'A' ? courseElement : courseElement.querySelector('a');
                if (!link) {
                    const row = courseElement.closest('tr');
                    if (row) link = row.querySelector('a[href*="courseid="]');
                }

                if (link && link.href) {
                    console.log(`导航至: ${link.href}`);
                    Utils.navigateTo(link.href, '打开课程');
                } else {
                    console.log('未找到直接链接，尝试点击元素');
                    Utils.dom.smartClick(courseElement, '打开课程');
                }
                
                // 导航后通常不需要设置 isProcessing = false，因为页面会卸载
            }, '打开课程失败');
        },
        

        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    学习时间管理器 (秒级精确版)                    │
        // └─────────────────────────────────────────────────────────────────┘
        startStudyTime: (requiredSeconds, completeButton) => {
            Utils.safeExecute(() => {
                const totalMs = requiredSeconds * 1000;
                const studyStartTime = Date.now();
                
                console.log(`开始精确学习计时: ${requiredSeconds}秒`);
                
                // 显示倒计时（每秒更新）
                const updateDisplay = () => {
                    const elapsed = Date.now() - studyStartTime;
                    const remainingMs = Math.max(0, totalMs - elapsed);
                    const totalSecs = Math.ceil(remainingMs / 1000);
                    const minutes = Math.floor(totalSecs / 60);
                    const seconds = totalSecs % 60;
                    
                    if (remainingMs > 0) {
                        UI.updateStatus(`学习中，剩余: ${minutes}:${seconds.toString().padStart(2, '0')}`, 'info');
                    } else {
                        UI.updateStatus('时长已达标，正在完成...', 'success');
                        Utils.lifecycle.clearInterval(displayInterval);
                    }
                };
                
                updateDisplay();
                const displayInterval = Utils.lifecycle.setInterval(updateDisplay, 1000);
                
                Utils.lifecycle.setTimeout(() => {
                    Utils.lifecycle.clearInterval(displayInterval);
                    if (completeButton && typeof completeButton.click === 'function') {
                        console.log('🏁 倒计时结束，触发完成按钮');
                        completeButton.click();
                        Utils.lifecycle.setTimeout(() => CourseHandler.handleStudyComplete(), 3000);
                    }
                }, totalMs);
            }, '学习时间处理失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    学习完成处理器                                │
        // └─────────────────────────────────────────────────────────────────┘
        handleStudyComplete: () => {
            Utils.safeExecute(() => {
                console.log('章节学习完成，寻找下一步');

                const currentUrl = window.location.href;
                const isPlaybackPage = currentUrl.includes('playvideo.do') || currentUrl.includes('playscorm.do');
                const isBgMode = window.location.hash.includes('bg_mode=1') ||
                                 window.location.search.includes('bg_mode=1') ||
                                 sessionStorage.getItem('isBackgroundMode') === 'true';

                // 获取当前课程ID
                const currentCourseId = Utils.url.extractCourseId(currentUrl);

                // 记录完成状态（无论自动还是手动）
                if (currentCourseId) {
                    Utils.storage.addVisited(currentCourseId);
                    sessionStorage.setItem('last_completed_course', currentCourseId);
                    sessionStorage.setItem('last_completion_time', Date.now());
                    console.log(`📝 记录课程完成状态: ${currentCourseId}`);
                }

                // 如果是播放页完成，一律走统一的退出/信号逻辑
                if (isPlaybackPage || isBgMode) {
                    console.log('🏁 学习完成，准备退出并刷新主界面');
                    CourseHandler.returnToCourseList();
                    return;
                }

                // 多重检查确保正确识别学习模式 - 在页面跳转前获取状态
                const isThematicClass = sessionStorage.getItem('isThematicClass') === 'true';
                const learningMode = sessionStorage.getItem('learningMode');
                const currentThematicClassId = sessionStorage.getItem('currentThematicClassId');

                console.log(`学习完成状态检查 - isThematicClass: ${isThematicClass}, learningMode: ${learningMode}, currentThematicClassId: ${currentThematicClassId}`);

                // 统一调用 returnToCourseList，无论当前是什么页面
                console.log('🔄 统一调用返回课程列表函数');
                CourseHandler.returnToCourseList();
            }, '学习完成处理失败');
        },

        // ─────────────────────────────────────────────────────────────────────
        //                          🎯 课程选择算法
        // ─────────────────────────────────────────────────────────────────────
        selectCourse: (courseElements, visitedCourses) => {
            console.log(`开始选择课程，共 ${courseElements.length} 个课程，已访问 ${visitedCourses.length} 个`);

            // 🥇 优先级1：选择"学习中"的课程，但必须未访问过
            for (const el of courseElements) {
                const status = CourseHandler.extractCourseStatus(el);
                const courseId = CourseHandler.extractCourseId(el);
                console.log(`检查课程 - ID: ${courseId}, 状态: "${status}", 已访问: ${visitedCourses.includes(courseId)}`);

                if (status === "学习中") {
                    if (!visitedCourses.includes(courseId)) {
                        console.log('✨ 找到学习中的课程（未访问）');
                        return el;
                    } else {
                        console.log(`⚠️ 跳过已访问的"学习中"课程: ${courseId}`);
                    }
                }
            }

            // 🥈 优先级2：选择未完成且未访问的课程
            for (const el of courseElements) {
                const status = CourseHandler.extractCourseStatus(el);
                const courseId = CourseHandler.extractCourseId(el);

                // 只选择明确不是"已完成"的课程，并且未访问过
                if (status && status !== "已完成") {
                    if (!visitedCourses.includes(courseId)) {
                        console.log(`🎯 选择未完成课程: ${courseId} (状态: "${status}")`);
                        // 注意：不在选择时立即标记为已访问，而是在成功打开课程后再标记
                        return el;
                    }
                }
            }

            console.log('未找到合适的课程');
            return null;
        },

        // ─────────────────────────────────────────────────────────────────────
        //                          📄 分页处理
        // ─────────────────────────────────────────────────────────────────────
        handlePagination: async () => {
            try {
                const pagination = Utils.$('.pagination');
                if (!pagination) {
                    console.error('未找到分页元素');
                    return false;
                }
                
                const pageLinks = pagination.querySelectorAll('a[href]');
                console.log(`找到 ${pageLinks.length} 个分页链接`);
                
                // 查找下一页按钮
                for (const link of pageLinks) {
                    const linkText = link.textContent.trim();
                    // 增强识别逻辑：支持 >、»、下一页、Next
                    if (linkText === '>' || linkText === '»' || linkText.includes('下一页') || linkText.toLowerCase().includes('next')) {
                        const href = link.getAttribute('href');
                        if (href) {
                            const fullUrl = href.startsWith('/') ? `https://www.ahgbjy.gov.cn${href}` : href;
                            console.log(`找到下一页按钮 (${linkText})，跳转到: ${fullUrl}`);
                            UI.updateStatus(`跳转到下一页 (${linkText})`);
                            window.location.href = fullUrl;
                            return true;
                        }
                    }
                }
                
                console.error('未找到下一页按钮');
                return false;
            } catch (error) {
                console.error(`分页处理错误: ${error.message}`);
                return false;
            }
        },

        // ─────────────────────────────────────────────────────────────────────
        //                          🔄 课程类型切换
        // ─────────────────────────────────────────────────────────────────────
        switchCourseType: () => {
            try {
                const currentType = Utils.url.getParam('coutype') || '1';
                const otherType = currentType === '1' ? '0' : '1';
                console.log(`当前课程类型: ${currentType === '1' ? '必修' : '选修'}`);
                
                // 1. 先标记当前类型已完成
                const flagKey = currentType === '1' ? 'requiredCoursesCompleted' : 'electiveCoursesCompleted';
                Utils.storage.set(flagKey, 'true');
                sessionStorage.setItem(`verified_type_${currentType}`, 'true');

                // 2. 检查是否两种类型都已完成，且都经过本次会话验证
                const requiredCompleted = Utils.storage.get('requiredCoursesCompleted', 'false');
                const electiveCompleted = Utils.storage.get('electiveCoursesCompleted', 'false');
                const requiredVerified = sessionStorage.getItem('verified_type_1') === 'true';
                const electiveVerified = sessionStorage.getItem('verified_type_0') === 'true';
                
                if (requiredCompleted === 'true' && electiveCompleted === 'true' && requiredVerified && electiveVerified) {
                    console.log('🎉 所有课程均已通过本次会话验证并确认完成！');
                    UI.updateStatus('🎉 所有课程已完成！', 'success');
                    alert('🎉 恭喜！所有必修和选修课程均已完成！');
                    return;
                }
                
                // 3. 根据当前类型切换到另一种类型 (即使标记为完成，如果没验证过也要去看看)
                if (currentType === '1') {
                    console.log('🎉 必修页学完，准备切换到选修课程进行验证');
                    UI.updateStatus('切换到选修课程...', 'info');

                    const electiveUrl = 'https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=0';
                    Utils.lifecycle.setTimeout(() => {
                        window.location.replace(electiveUrl);
                    }, 2000);
                } else {
                    console.log('🎉 选修页学完，准备切换到必修课程进行验证');
                    UI.updateStatus('切换到必修课程...', 'info');

                    const requiredUrl = 'https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=1';
                    Utils.lifecycle.setTimeout(() => {
                        window.location.replace(requiredUrl);
                    }, 2000);
                }
            } catch (error) {
                console.error(`课程类型切换错误: ${error.message}`);
            }
        },

        // 提取课程ID
        extractCourseId: (courseElement) => {
            try {
                // 尝试从自身、子元素、或父级元素查找链接
                let link = courseElement.tagName === 'A' ? courseElement : courseElement.querySelector('a');
                if (!link) {
                    // 尝试在父级 TR 中查找任何链接
                    const row = courseElement.closest('tr');
                    if (row) link = row.querySelector('a[href*="courseid="]');
                }
                
                const href = link?.getAttribute('href') || '';
                return Utils.url.extractCourseId(href) || 'unknown';
            } catch (error) {
                console.error(`提取课程ID错误: ${error.message}`);
                return 'unknown';
            }
        },

        // 提取课程状态
        extractCourseStatus: (courseElement) => {
            try {
                // 1. 检查图片标识 (微课/常规课列表常用)
                const images = Array.from(courseElement.querySelectorAll('img'));
                for (const img of images) {
                    const src = img.src || '';
                    if (src.includes('ywc.png')) return "已完成";
                    if (src.includes('xxz.png')) return "学习中";
                }

                // 2. 检查特定类名的 span (异步注入常用)
                const spans = Array.from(courseElement.querySelectorAll('span'));
                for (const span of spans) {
                    const text = span.textContent.trim();
                    if (text.includes("已完成")) return "已完成";
                    if (text.includes("学习中")) return "学习中";
                    if (text.includes("未开始")) return "未开始";
                    
                    if (span.className.includes('green2')) return "已完成";
                    if (span.className.includes('orange')) return "学习中";
                }

                // 3. 检查自身文本
                const text = courseElement.textContent || '';
                if (text.includes("已完成")) return "已完成";
                if (text.includes("学习中")) return "学习中";
                
                return "未开始"; // 默认未开始
            } catch (error) {
                return '';
            }
        },

        // ─────────────────────────────────────────────────────────────────────
        //                          🔍 章节处理算法
        // ─────────────────────────────────────────────────────────────────────
        findAndClickIncompleteChapter: () => {
            Utils.safeExecute(() => {
                console.log('查找未完成章节');
                const playButtons = Utils.$$('.playBtn[data-chapterid]');
                
                for (let i = 0; i < playButtons.length; i++) {
                    const button = playButtons[i];
                    const row = button.closest('tr');
                    if (!row) continue;
                    
                    // 🎯 核心修复：遍历所有 td 单元格查找包含 % 的进度信息
                    let progress = 0;
                    const cells = row.querySelectorAll('td');
                    for (const cell of cells) {
                        const text = cell.textContent;
                        const match = text.match(/(\d+)%/);
                        if (match) {
                            progress = parseInt(match[1]);
                            break;
                        }
                    }
                    
                        if (progress < 100) {
                            console.log(`找到未完成章节（进度：${progress}%），准备点击`);
                            
                            // 🔒 检查全局锁
                            if (Utils.globalLock.isLocked()) {
                                console.log('⛔ 拦截章节点击：检测到其他页面正在播放视频');
                                UI.updateStatus('其他章节正在后台学习中...', 'warning');
                                return;
                            }

                            UI.updateStatus(`进入章节${i + 1}（进度：${progress}%）`, 'info');
                            
                            const chapterId = button.getAttribute('data-chapterid');
                            const courseId = Utils.url.extractCourseId(window.location.href);
                            if (chapterId && courseId) {
                                // 🚀 【精确化】在 URL 中携带当前进度
                                let playUrl = `/pc/course/playvideo.do?courseid=${courseId}&chapterid=${chapterId}&bg_mode=1&prev_progress=${progress}`;
                                playUrl = new URL(playUrl, window.location.href).href;
                                console.log(`🚀 强力后台跳转: ${playUrl}`);
                                sessionStorage.setItem('fromLearningPage', 'true');
                                if (typeof GM_openInTab === 'function') {
                                    GM_openInTab(playUrl, { active: false, insert: true });
                                } else {
                                    window.open(playUrl);
                                }
                            } else {
                                Utils.dom.smartClick(button, '进入章节');
                            }
                            return;
                        }
                }
                
                console.log('所有章节已完成，返回课程列表');
                UI.updateStatus('课程已完成，返回列表', 'success');
                Utils.lifecycle.setTimeout(() => CourseHandler.returnToCourseList(), 1000);
            }, '查找未完成章节失败');
        },

        // ─────────────────────────────────────────────────────────────────────
        //                          📊 章节信息提取
        // ─────────────────────────────────────────────────────────────────────
        extractChapterInfo: (courseId) => {
            Utils.safeExecute(() => {
                const playButtons = Utils.$$('.playBtn[data-chapterid]');
                console.log(`找到 ${playButtons.length} 个章节`);
                
                playButtons.forEach((button, index) => {
                    Utils.safeExecute(() => {
                        const chapterId = button.getAttribute('data-chapterid');
                        if (!chapterId) return;
                        
                        const row = button.closest('tr');
                        if (!row) return;
                        
                        const colMd2Cells = row.querySelectorAll('td.col-md-2');
                        let totalMinutes = 30;
                        let learnedPercent = 0;
                        
                        // 提取时长
                        if (colMd2Cells.length >= 1) {
                            const timeText = colMd2Cells[0].textContent;
                            if (timeText.includes('分钟')) {
                                totalMinutes = Utils.extractMinutes(timeText);
                                console.log(`章节${index + 1}时长: ${totalMinutes}分钟`);
                            }
                        }
                        
                        // 提取进度
                        if (colMd2Cells.length >= 2) {
                            const progressText = colMd2Cells[1].textContent;
                            const match = progressText.match(/(\d+)%/);
                            if (match) {
                                learnedPercent = parseInt(match[1]);
                                console.log(`章节${index + 1}进度: ${learnedPercent}%`);
                            }
                        }
                        
                        // 计算总时长并保存（存总时长，由播放页根据进度算剩余）
                        const key = `duration_${courseId}_${chapterId}`;
                        Utils.storage.set(key, totalMinutes.toString());
                        console.log(`章节${index + 1}总时长已记录: ${totalMinutes}分钟`);
                    }, `章节${index + 1}信息提取错误`);
                });
            }, '章节信息处理错误');
        },

        // 检查课程完成状态
        checkCourseCompletion: () => {
            return Utils.safeExecute(() => {
                const colMd2Elements = document.getElementsByClassName('col-md-2');
                if (colMd2Elements.length > 0) {
                    const lastElement = colMd2Elements[colMd2Elements.length - 1];
                    const spans = lastElement.getElementsByTagName('span');
                    return spans.length > 0 && spans[0].innerHTML === '100';
                }
                return false;
            }, '课程完成状态检查错误', false);
        },

        // 返回课程列表 - 支持专题班模式（统一自动和手动完成处理）
        returnToCourseList: () => {
            Utils.safeExecute(() => {
                const currentUrl = window.location.href;
                const isPlaybackPage = currentUrl.includes('playvideo.do') || currentUrl.includes('playscorm.do');
                const isBgMode = window.location.hash.includes('bg_mode=1') ||
                                 window.location.search.includes('bg_mode=1') ||
                                 sessionStorage.getItem('isBackgroundMode') === 'true';

                // 获取当前课程ID
                const currentCourseId = Utils.url.extractCourseId(currentUrl);
                console.log(`🏁 任务完成处理 - 课程ID: ${currentCourseId || '未知'}`);

                // 1. 【核心修正】先记录已访问黑名单，防止刷新时差导致重复进入
                if (currentCourseId) {
                    console.log(`📝 记录已完成课程黑名单: ${currentCourseId}`);
                    Utils.storage.addVisited(currentCourseId);
                    sessionStorage.setItem('last_completed_course', currentCourseId);
                }

                // 2. 【核心修正】设置刷新标志位
                GM_setValue('remote_refresh_signal', Date.now());
                GM_setValue('force_reload_requested', true);

                // 3. 【核心修正】最后释放全局播放锁
                Utils.globalLock.release();

                // 4. 记录刷新上下文
                const refreshContext = {
                    timestamp: Date.now(),
                    courseId: currentCourseId,
                    url: currentUrl,
                    learningMode: sessionStorage.getItem('learningMode')
                };
                GM_setValue('refresh_context', JSON.stringify(refreshContext));

                // 5. 执行退出/跳转操作
                if (isPlaybackPage || isBgMode) {
                    console.log('🎬 播放页：尝试关闭窗口');
                    Utils.lifecycle.setTimeout(() => {
                        window.close();
                        // 🚀 核心修复：如果 window.close 失败，强制跳转回列表页
                        Utils.lifecycle.setTimeout(() => {
                            if (!window.closed) {
                                console.log('⚠️ 窗口关闭失败，执行强制跳转返回列表');
                                const coursetype = sessionStorage.getItem('lastCoutype') || '1';
                                window.location.href = `https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=${coursetype}`;
                            }
                        }, 1000);
                    }, 500);
                } else if (currentUrl.includes('coursedetail.do')) {
                    // 🚀 【核心修复】章节页完成后，根据模式退回到正确的列表页
                    const isThematic = sessionStorage.getItem('learningMode') === 'thematic' || sessionStorage.getItem('isThematicClass') === 'true';
                    let backUrl = '';

                    if (isThematic) {
                        const tid = sessionStorage.getItem('currentThematicClassId');
                        backUrl = tid ? `/pc/thematicclass/thematicclassdetail.do?tid=${tid}` : '/pc/thematicclass/thematicclasslist.do';
                        console.log('🎯 专题班章节完成，退回到专题班列表:', backUrl);
                    } else {
                        const coursetype = sessionStorage.getItem('lastCoutype') || '1';
                        backUrl = `/pc/course/courselist.do?coutype=${coursetype}`;
                        console.log('📚 普通课程章节完成，退回到主课表:', backUrl);
                    }

                    const urlObj = new URL(backUrl, window.location.origin);
                    urlObj.searchParams.set('refresh_ts', Date.now());
                    urlObj.searchParams.set('auto_continue', 'true');
                    window.location.replace(urlObj.href);
                } else {
                    console.log('🔄 列表页/其他：强制刷新当前页');
                    const urlObj = new URL(window.location.href);
                    urlObj.searchParams.set('refresh_ts', Date.now());
                    urlObj.searchParams.set('auto_continue', 'true');
                    window.location.replace(urlObj.href);
                }
            }, '返回逻辑执行失败');
        },
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            🛣️  路由管理系统
    // ════════════════════════════════════════════════════════════════════════
    const Router = {
        routes: {
            '/': () => Router.handleHomePage(),
            '/courseList.do': () => Router.handleCourseListPage(),
            '/coursedetail.do': () => Router.handleCourseDetailPage(),
            '/playvideo.do': () => Router.handleVideoPage(),
            '/playscorm.do': () => Router.handleScormPage(),
            '/thematicclass/thematicclasslist.do': () => Router.handleThematicClassListPage(),
            '/thematicclass/thematicclassdetail.do': () => Router.handleThematicClassPage()
        },
        
        init: () => {
            Utils.safeExecute(() => {
                Router.handleCurrentPage();
                console.log('路由管理器已初始化');
            }, '路由管理器初始化失败');
        },
        
        handleCurrentPage: () => {
            Utils.safeExecute(() => {
                const path = window.location.pathname;
                const search = window.location.search;
                const url = window.location.href;

                console.log(`当前页面: ${path}${search}`);
                console.log(`完整URL: ${url}`);

                // 🚀 核心修复：支持从 Hash 读取自动继续指令 (Hash 内容不发送给服务器，规避 400)
                const autoContinue = Utils.url.getParam('auto_continue') === 'true' || 
                                     window.location.hash.includes('auto_continue=true');
                
                if (autoContinue) {
                    console.log('🔄 检测到自动继续标记，页面刷新后自动继续处理');
                    // 清理 URL 中的标记，保持纯净并防止重复触发
                    try {
                        const newUrl = url.split(/[?#]auto_continue=true/)[0].replace(/[?&]refresh_ts=\d+/, '');
                        window.history.replaceState({}, '', newUrl);
                    } catch (_) {
                        // 降级清理
                        window.location.hash = '';
                    }
                }
                
                // 首先获取当前状态 - 避免变量提升问题
                let learningMode = sessionStorage.getItem('learningMode');
                let currentThematicClassId = sessionStorage.getItem('currentThematicClassId');
                let isThematicClass = sessionStorage.getItem('isThematicClass') === 'true';
                let fromThematicLearning = sessionStorage.getItem('fromThematicLearning') === 'true';
                
                // 首先检查是否是新标签页打开的专题班课程
                const tidFromUrl = Utils.url.getParam('tid');
                const courseIdFromUrl = Utils.url.getParam('courseid');
                
                if (url.includes('coursedetail.do') && courseIdFromUrl && !learningMode && !currentThematicClassId) {
                    console.log(`🆕 检测到新标签页打开的课程详情页 - courseid: ${courseIdFromUrl}`);
                    
                    // 尝试从状态管理器恢复专题班状态
                    const appState = Utils.stateManager.getThematicState();
                    if (appState) {
                        console.log(`🔄 新标签页恢复状态: ${JSON.stringify(appState)}`);
                        sessionStorage.setItem('currentThematicClassId', appState.thematicClassId);
                        sessionStorage.setItem('learningMode', appState.learningMode || 'thematic');
                        sessionStorage.setItem('isThematicClass', 'true');
                        sessionStorage.setItem('thematicClassUrl', `/pc/thematicclass/thematicclassdetail.do?tid=${appState.thematicClassId}`);
                        
                        // 更新本地变量
                        learningMode = appState.learningMode || 'thematic';
                        currentThematicClassId = appState.thematicClassId;
                        isThematicClass = true;
                        fromThematicLearning = true;
                    }
                } else if (tidFromUrl && (url.includes('playvideo.do') || url.includes('playscorm.do'))) {
                    console.log(`🔄 检测到专题班课程在新标签页打开 - tid: ${tidFromUrl}`);
                    
                    // 尝试从状态管理器获取原标签页的状态
                    const appState = Utils.stateManager.getThematicState();
                    if (appState && appState.thematicClassId === tidFromUrl) {
                        console.log(`🔄 新标签页恢复状态: ${JSON.stringify(appState)}`);
                        sessionStorage.setItem('currentThematicClassId', appState.thematicClassId);
                        sessionStorage.setItem('learningMode', appState.learningMode || 'thematic');
                        sessionStorage.setItem('isThematicClass', 'true');
                        sessionStorage.setItem('thematicClassUrl', `/pc/thematicclass/thematicclassdetail.do?tid=${tidFromUrl}`);
                        
                        // 更新本地变量
                        learningMode = appState.learningMode || 'thematic';
                        currentThematicClassId = appState.thematicClassId;
                        isThematicClass = true;
                        fromThematicLearning = true;
                    } else {
                        // 如果没有全局状态，根据URL创建新状态
                        console.log(`📝 根据URL创建新专题班状态`);
                        sessionStorage.setItem('currentThematicClassId', tidFromUrl);
                        sessionStorage.setItem('learningMode', 'thematic');
                        sessionStorage.setItem('isThematicClass', 'true');
                        sessionStorage.setItem('thematicClassUrl', `/pc/thematicclass/thematicclassdetail.do?tid=${tidFromUrl}`);
                        
                        // 更新本地变量
                        learningMode = 'thematic';
                        currentThematicClassId = tidFromUrl;
                        isThematicClass = true;
                        fromThematicLearning = true;
                    }
                }
                
                console.log(`页面状态检查 - learningMode: ${learningMode}, currentThematicClassId: ${currentThematicClassId}, isThematicClass: ${isThematicClass}, fromThematicLearning: ${fromThematicLearning}`);
                console.log(`状态管理器: ${JSON.stringify(Utils.stateManager.getThematicState())}`);
                console.log(`sessionStorage状态: ${JSON.stringify({
                    learningMode: sessionStorage.getItem('learningMode'),
                    currentThematicClassId: sessionStorage.getItem('currentThematicClassId'),
                    isThematicClass: sessionStorage.getItem('isThematicClass'),
                    fromThematicLearning: sessionStorage.getItem('fromThematicLearning'),
                    thematicClassUrl: sessionStorage.getItem('thematicClassUrl')
                })}`);
                
                // 检查是否为登录页面，如果是则不执行任何操作
                if (url.includes('/pc/login.do')) {
                    console.log('检测到登录页面，脚本暂停工作');
                    UI.updateStatus('登录页面 - 脚本已暂停', 'info');
                    return;
                }
                
                // 保存课程类型参数
                if (url.includes('courselist.do') && /[?&]coutype=\d/.test(url)) {
                    const match = url.match(/coutype=(\d+)/);
                    if (match) {
                        sessionStorage.setItem('lastCoutype', match[1]);
                    }
                }
                
                // 检查返回状态 - 区分主课程和专题班返回
                if (sessionStorage.getItem('returning') === 'true' || autoContinue) {
                    if (sessionStorage.getItem('returning') === 'true') {
                        sessionStorage.removeItem('returning');
                    }

                    console.log(`返回状态检查 - fromThematicLearning: ${fromThematicLearning}, currentThematicClassId: ${currentThematicClassId}, url: ${url}, autoContinue: ${autoContinue}`);

                    if (url.includes('courselist.do') && (!fromThematicLearning && !currentThematicClassId || autoContinue)) {
                        console.log('检测到从主课程页面返回或自动继续');
                        Utils.lifecycle.setTimeout(() => Router.handleCourseListPage(), 2000);
                        return;
                    } else if (url.includes('thematicclassdetail.do') && (fromThematicLearning || currentThematicClassId || autoContinue)) {
                        console.log('🎯 检测到从专题班学习返回专题班课表或自动继续');
                        if (fromThematicLearning) {
                            sessionStorage.removeItem('fromThematicLearning');
                        }
                        Utils.lifecycle.setTimeout(() => Router.handleThematicClassPage(), 2000);
                        return;
                    }
                }
                
                // 根据URL模式和学习模式进行页面处理
                if (url.includes('courselist.do')) {
                    // 如果URL中明确没有tid，且我们处于专题班模式，说明用户可能想切换回普通课程
                    if (!tidFromUrl && (currentThematicClassId || learningMode === 'thematic')) {
                        console.log('检测到从专题班模式切回主课程列表，清理专题班状态');
                        sessionStorage.removeItem('currentThematicClassId');
                        sessionStorage.removeItem('learningMode');
                        sessionStorage.removeItem('isThematicClass');
                        sessionStorage.removeItem('fromThematicLearning');
                        // 同时清理全局状态，防止跨标签页再次干扰
                        Utils.stateManager.clearThematicState();
                        
                        // 重新获取状态以确保逻辑正确
                        learningMode = null;
                        currentThematicClassId = null;
                    }

                    // 检查是否应该处理为主课程列表
                    if (!fromThematicLearning && !currentThematicClassId && learningMode !== 'thematic') {
                        console.log('当前页面: 主课程列表');
                        Utils.lifecycle.setTimeout(() => Router.handleCourseListPage(), 1000);
                    } else {
                        console.log('当前页面: 主课程列表（但处于专题班模式）');
                        // 只有在明确有专题班ID的情况下才尝试返回，否则默认留在主课表
                        if (currentThematicClassId) {
                            console.log('尝试返回专题班列表继续处理');
                            const thematicListUrl = '/pc/thematicclass/thematicclasslist.do';
                            Utils.lifecycle.setTimeout(() => Utils.navigateTo(thematicListUrl, '从主课表返回专题班列表'), 2000);
                        } else {
                            Utils.lifecycle.setTimeout(() => Router.handleCourseListPage(), 1000);
                        }
                    }
                } else if (url.includes('coursedetail.do')) {
                    console.log('当前页面: 课程详情');
                    console.log(`课程详情页状态 - learningMode: ${learningMode}, currentThematicClassId: ${currentThematicClassId}, isThematicClass: ${isThematicClass}, fromThematicLearning: ${fromThematicLearning}`);
                    
                    // 检查是否是专题班模式下的课程详情页 - 使用已定义的外部变量
                    if ((learningMode === 'thematic' || currentThematicClassId || fromThematicLearning)) {
                        console.log('🎯 检测到专题班模式下的课程详情页');
                        // 确保专题班状态正确设置
                        if (!learningMode) {
                            sessionStorage.setItem('learningMode', 'thematic');
                            learningMode = 'thematic'; // 更新本地变量
                        }
                        if (!sessionStorage.getItem('isThematicClass')) {
                            sessionStorage.setItem('isThematicClass', 'true');
                            isThematicClass = true; // 更新本地变量
                        }
                    } else {
                        console.log('📚 普通课程详情页，非专题班模式');
                    }
                    
                    Utils.lifecycle.setTimeout(() => Router.handleCourseDetailPage(), 1000);
                } else if (url.includes('playvideo.do') || url.includes('playscorm.do')) {
                    console.log('当前页面: 学习页面');
                    
                    // 检查是否是新标签页打开的专题班课程 - 使用已定义的外部变量
                    if (tidFromUrl && !learningMode && !currentThematicClassId) {
                        console.log(`🆕 检测到孤立的新标签页专题班课程 - tid: ${tidFromUrl}`);
                        
// 尝试从状态管理器恢复状态到新标签页
                        const appState = Utils.stateManager.getThematicState();
                        if (appState && appState.thematicClassId === tidFromUrl) {
                            console.log(`🔄 从状态管理器恢复状态到新标签页`);
                            sessionStorage.setItem('currentThematicClassId', appState.thematicClassId);
                            sessionStorage.setItem('learningMode', appState.learningMode || 'thematic');
                            sessionStorage.setItem('isThematicClass', 'true');
                            sessionStorage.setItem('thematicClassUrl', `/pc/thematicclass/thematicclassdetail.do?tid=${tidFromUrl}`);
                            
                            // 更新本地变量
                            learningMode = appState.learningMode || 'thematic';
                            currentThematicClassId = appState.thematicClassId;
                            isThematicClass = true;
                        }
                    }
                    
                    // 在学习页面保持学习模式
                    if (learningMode === 'thematic' || currentThematicClassId) {
                        console.log('保持专题班学习模式');
                    }
                    Utils.lifecycle.setTimeout(() => Router.handleVideoPage(), 1000);
                } else if (url.includes('thematicclasslist.do')) {
                    console.log('当前页面: 专题班列表');
                    Utils.lifecycle.setTimeout(() => Router.handleThematicClassListPage(), 1000);
                } else if (url.includes('thematicclassdetail.do')) {
                    console.log('当前页面: 专题班课程列表');
                    // 确保专题班状态正确设置
                    if (learningMode !== 'thematic') {
                        sessionStorage.setItem('learningMode', 'thematic');
                        console.log('设置专题班学习模式');
                    }
                    Utils.lifecycle.setTimeout(() => Router.handleThematicClassPage(), 1000);
                } else {
                    console.log('当前页面: 首页或其他');
                    Router.handleHomePage();
                }
            }, '页面处理失败');
        },
        
        // ─────────────────────────────────────────────────────────────────────
        //                          🏠 主页处理
        // ─────────────────────────────────────────────────────────────────────
        handleHomePage: () => {
            Utils.safeExecute(() => {
                UI.updateStatus('首页已加载，请手动进入课程列表', 'info');
                console.log('首页已加载，脚本不会自动跳转到课程列表');
            }, '首页处理失败');
        },
        
        // ─────────────────────────────────────────────────────────────────────
        //                          📚 课程列表页处理
        // ─────────────────────────────────────────────────────────────────────
        handleCourseListPage: async () => {
            Utils.safeExecute(async () => {
                // 0. 前置刷新检查
                const forceReload = GM_getValue('force_reload_requested', false);
                if (forceReload === true) {
                    console.log('📡 列表页检测到挂起的刷新信号，立即执行刷新');
                    GM_setValue('force_reload_requested', false);
                    const urlObj = new URL(window.location.href);
                    urlObj.searchParams.set('refresh_ts', Date.now());
                    urlObj.searchParams.set('auto_continue', 'true');
                    window.location.replace(urlObj.href);
                    return;
                }

                // 并发保护
                if (CourseHandler.isProcessing) {
                    console.log('课程列表正在处理中，跳过本次执行');
                    return;
                }

                CourseHandler.isProcessing = true; // 加锁
                console.log('开始处理课程列表页面');

                try {
                    const currentType = Utils.url.getParam('coutype') || '1';
                    const typeName = currentType === '1' ? '必修' : '选修';

                    UI.updateStatus(`正在分析${typeName}课程列表...`, 'info');
                    
                                                    // 检查页面是否在后台
                                                    const isBackground = document.hidden;
                                                    const waitTime = isBackground ? 10000 : 6000; // 延长等待 Ajax 注入
                                                    
                                                    // 🚀 核心修复：支持表格行模式 (.lbms tr) 和磁贴模式 (.coursespan)
                                                    const selectors = ['.coursespan', '.lbms tbody tr', '.ke-box', 'tr[id*="ucheck"]'];
                                                    const targetSelector = selectors.join(', ');
                                                    
                                                    await Utils.waitForElement(targetSelector, waitTime);
                                                    
                                                    let courseElements = Utils.$$(targetSelector);                                    
                                    // 针对微课页面的特殊处理：如果通过 class 找不到，尝试直接抓取包含 courseid 的链接行
                                    if (courseElements.length === 0) {
                                        console.log('尝试兜底方案：抓取所有包含课程链接的行');
                                        courseElements = Utils.$$('tr').filter(tr => tr.querySelector('a[href*="courseid="]'));
                                    }
                    
                                    if (courseElements.length === 0) {
                                        UI.updateStatus('未找到课程元素', 'error');
                                        console.log('当前页面 HTML 结构可能已变动，请检查选择器');
                                        CourseHandler.isProcessing = false;
                                        return;
                                    }
                                    
                console.log(`找到 ${courseElements.length} 个候选课程元素`);
                
                const visitedCourses = Utils.storage.getVisited();
                const validCourseElements = [];
                const stats = { completed: 0, learning: 0, uncompleted: 0 };

                courseElements.forEach(el => {
                    const status = CourseHandler.extractCourseStatus(el);
                    const courseId = CourseHandler.extractCourseId(el);
                    
                    if (courseId && courseId !== 'unknown') {
                        validCourseElements.push(el);
                        if (status === "已完成") stats.completed++;
                        else if (status === "学习中") stats.learning++;
                        else stats.uncompleted++;
                    }
                });

                console.log(`${typeName}统计 - 有效课程: ${validCourseElements.length}, 已完成: ${stats.completed}, 学习中: ${stats.learning}`);

                // 标记当前类型的课程在本次会话中已验证
                sessionStorage.setItem(`verified_type_${currentType}`, 'true');

                // 🎯 核心修复：如果当前页发现未完成课程，重置对应的全局完成标志
                if (stats.completed < validCourseElements.length) {
                    const flagKey = currentType === '1' ? 'requiredCoursesCompleted' : 'electiveCoursesCompleted';
                    if (Utils.storage.get(flagKey) === 'true') {
                        console.log(`检测到未完成课程，重置 ${currentType === '1' ? '必修' : '选修'} 完成标志`);
                        Utils.storage.set(flagKey, 'false');
                    }
                }

                // 如果当前页所有课程已完成，尝试翻页
                if (validCourseElements.length > 0 && stats.completed === validCourseElements.length) {
                    UI.updateStatus('当前页已完成，翻页中...', 'success');
                    Utils.storage.clearVisited();
                    
                    Utils.lifecycle.setTimeout(async () => {
                        const paginated = await CourseHandler.handlePagination();
                        if (!paginated) CourseHandler.switchCourseType();
                        CourseHandler.isProcessing = false;
                    }, 2000);
                    return;
                }
                
                // 选择课程学习
                const selectedCourse = CourseHandler.selectCourse(validCourseElements, visitedCourses);
                if (selectedCourse) {
                    if (Utils.globalLock.isLocked()) {
                        UI.updateStatus('已有课程学习中...', 'warning');
                        CourseHandler.isProcessing = false;
                        return;
                    }
                    CourseHandler.openCourse(selectedCourse);
                } else {
                    console.log('未找到合适课程，重置记录重试...');
                    Utils.storage.clearVisited();
                    Utils.lifecycle.setTimeout(() => {
                        CourseHandler.isProcessing = false;
                        Router.handleCourseListPage();
                    }, 2000);
                }
                } catch (err) {
                    console.error('列表处理出错:', err);
                    CourseHandler.isProcessing = false; // 出错解锁
                }
            }, '课程列表页处理失败');
        },
        
        // ─────────────────────────────────────────────────────────────────────
        //                          📖 课程详情页处理
        // ─────────────────────────────────────────────────────────────────────
        handleCourseDetailPage: async () => {
            Utils.safeExecute(async () => {
                // 0. 前置刷新检查
                const forceReload = GM_getValue('force_reload_requested', false);
                if (forceReload === true) {
                    console.log('📡 章节页检测到挂起的刷新信号，立即刷新以同步进度');
                    GM_setValue('force_reload_requested', false);
                    
                    const now = Date.now();
                    const courseId = Utils.url.extractCourseId(window.location.href);
                    const baseUrl = window.location.origin + window.location.pathname.substring(0, window.location.pathname.lastIndexOf('/') + 1);
                    
                    // 使用 Hash 传递指令，确保不触发服务器 400 拦截，同时确保路径正确为 coursedetail.do
                    let cleanUrl = `${baseUrl}coursedetail.do?courseid=${courseId}#auto_continue=true&refresh_ts=${now}`;
                    window.location.replace(cleanUrl);
                    return;
                }

                if (CourseHandler.isProcessing) return;
                CourseHandler.isProcessing = true;

                console.log('=== 开始处理课程详情页 ===');
                UI.updateStatus('分析章节进度...', 'info');

                try {
                    const courseId = Utils.url.extractCourseId(window.location.href);
                    if (!courseId) {
                        CourseHandler.isProcessing = false;
                        return;
                    }

                    // 1. 检查是否从学习页面返回
                    const fromLearning = sessionStorage.getItem('fromLearningPage');
                    if (fromLearning === 'true') {
                        console.log('🔄 从学习页面返回，强制刷新页面以更新进度显示');
                        sessionStorage.removeItem('fromLearningPage');
                        sessionStorage.setItem('didRefreshAfterLearning', 'true');
                        window.location.reload();
                        return;
                    }

                    await Utils.waitForElement('.playBtn[data-chapterid]', 3000);
                    CourseHandler.extractChapterInfo(courseId);
                    
                    if (CourseHandler.checkCourseCompletion()) {
                        UI.updateStatus('课程已完成，准备换课...', 'success');
                        Utils.lifecycle.setTimeout(() => CourseHandler.returnToCourseList(), 1000);
                        return;
                    }

                    const currentTime = Date.now();
                    sessionStorage.setItem('lastActiveTime', currentTime.toString());
                    
                    // 3. 查找未完成章节
                    CourseHandler.findAndClickIncompleteChapter();
                    
                    // 解锁交给 findAndClickIncompleteChapter 的末尾或由页面跳转自然处理
                    Utils.lifecycle.setTimeout(() => { CourseHandler.isProcessing = false; }, 5000);
                } catch (e) {
                    CourseHandler.isProcessing = false;
                }
            }, '章节详情页处理失败');
        },
        
        // ─────────────────────────────────────────────────────────────────────
        //                          🎬 学习页面处理
        // ─────────────────────────────────────────────────────────────────────
        handleVideoPage: async () => {
            Utils.safeExecute(async () => {
                if (window.studyPageProcessingStarted) return;
                window.studyPageProcessingStarted = true;

                console.log('处理学习页面 (估值计时版)');
                UI.updateStatus('正在初始化播放...', 'info');
                
                const courseId = Utils.url.extractCourseId(window.location.href);
                const chapterId = Utils.url.extractChapterId(window.location.href);
                
                // 获取当前进度百分比（从 URL 参数获取）
                const prevProgress = parseInt(Utils.url.getParam('prev_progress') || '0');

                // 🔒 获取全局播放锁
                if (courseId) {
                    Utils.globalLock.acquire(courseId);
                    // 注册到生命周期，确保不会重复绑定
                    Utils.lifecycle.addEventListener(window, 'beforeunload', () => Utils.globalLock.release());
                }
                
                // 🔍 增强按钮检测：支持多种选择器和文本识别
                const getCompleteButton = () => {
                    // 1. 尝试配置的选择器
                    const btn = document.querySelector('.btn.btn-default:nth-child(2)');
                    if (btn) return btn;
                    
                    // 2. 遍历所有按钮查找文本特征
                    const allBtns = document.querySelectorAll('a.btn, input[type="button"], button');
                    for (const b of allBtns) {
                        const text = b.textContent || b.value || '';
                        if (text.includes('完成播放') || text.includes('确 定') || text.includes('结束学习')) {
                            return b;
                        }
                    }
                    return null;
                };

                const completeButton = getCompleteButton();

                if (!completeButton) {
                    console.warn('未找到完成按钮，等待动态加载...');
                    // 如果初始没找到，尝试等待一会儿
                    Utils.lifecycle.setTimeout(async () => {
                        const lateBtn = getCompleteButton();
                        if (lateBtn) {
                            console.log('✅ 动态补获到完成按钮');
                            bindButton(lateBtn);
                        }
                    }, 2000);
                } else {
                    bindButton(completeButton);
                }

                function bindButton(btn) {
                    // 绑定点击监听（兼容手动）
                    btn.addEventListener('click', () => {
                        console.log('🏁 检测到完成播放动作 (手动/自动)');
                        
                        // 🚀 核心修复：立即释放全局锁，防止后台详情页刷新后检测到锁占用
                        if (typeof Utils !== 'undefined' && Utils.globalLock) {
                            Utils.globalLock.release();
                        }
                        
                        if (courseId) Utils.storage.addVisited(courseId);
                        // 设置双重信号
                        GM_setValue('remote_refresh_signal', Date.now());
                        GM_setValue('force_reload_requested', true);
                        // 记录到本地存储作为备份
                        sessionStorage.setItem('manual_complete_triggered', 'true');
                    }, true);
                }
                
                // 🚀 【基于详情页估值计算】
                let totalSeconds = 1800; // 默认30分钟
                
                if (courseId && chapterId) {
                    const storedMinutes = Utils.storage.get(`duration_${courseId}_${chapterId}`);
                    if (storedMinutes) {
                        totalSeconds = parseInt(storedMinutes) * 60;
                        console.log(`✅ 使用详情页存储的时长估值: ${storedMinutes}分钟 (${totalSeconds}秒)`);
                    }
                }

                // 计算剩余所需秒数: (总长 * 剩余百分比) + 5秒余量
                const remainingPercent = Math.max(0, (100 - prevProgress) / 100);
                const waitSeconds = Math.ceil(totalSeconds * remainingPercent) + 5;
                const safeWaitSeconds = Math.max(waitSeconds, 10); // 最小不低于10秒

                console.log(`🎯 初始进度: ${prevProgress}%, 剩余比例: ${Math.round(remainingPercent*100)}%, 预计学习: ${safeWaitSeconds}秒`);
                sessionStorage.setItem('fromLearningPage', 'true');
                
                CourseHandler.startStudyTime(safeWaitSeconds, completeButton);
                
            }, '学习页处理失败');
        },
        
        handleScormPage: () => {
            // SCORM页面使用相同的处理逻辑
            Router.handleVideoPage();
        },

        // ─────────────────────────────────────────────────────────────────────
        //                          📋 专题班列表页面处理
        // ─────────────────────────────────────────────────────────────────────
        handleThematicClassListPage: async () => {
            Utils.safeExecute(async () => {
                console.log('处理专题班列表页面');
                UI.updateStatus('分析专题班列表...', 'info');

                // 等待页面加载专题班元素
                await Utils.waitForElement('.thematic-class-item, .ke-box a[href*="thematicclassdetail"]', 5000);

                // 查找专题班链接
                const thematicLinks = Utils.$$('.ke-box a[href*="thematicclassdetail"], .thematic-class-item a[href*="thematicclassdetail"]');
                if (thematicLinks.length === 0) {
                    console.error('未找到专题班元素');
                    UI.updateStatus('未找到专题班', 'error');
                    return;
                }

                console.log(`找到 ${thematicLinks.length} 个专题班`);
                UI.updateStatus(`正在分析 ${thematicLinks.length} 个专题班`, 'info');

                // 获取已访问的专题班记录
                const visitedThematicClasses = Utils.safeExecute(() => {
                    const visited = sessionStorage.getItem('visitedThematicClasses');
                    return visited ? JSON.parse(visited) : [];
                }, '获取已访问专题班记录失败', []);

                // 查找未完成的专题班
                for (const link of thematicLinks) {
                    const classBox = link.closest('.ke-box, .thematic-class-item');
                    if (classBox) {
                        // 获取专题班标题
                        const title = classBox.querySelector('.detail-ks, .title')?.textContent || '未知专题班';

                        // 获取专题班ID
                        const classId = Utils.url.getParam('tid') || Utils.url.extractCourseId(link.href) || '';

                        // 检查是否已访问过
                        const isVisited = visitedThematicClasses.includes(classId);

                        console.log(`专题班: ${title.trim()}, ID: ${classId}, 已访问: ${isVisited}`);

                        // 如果未访问过，则点击进入
                        if (!isVisited) {
                            console.log(`进入专题班: ${title.trim()}`);
                            UI.updateStatus(`进入专题班: ${title.trim()}`, 'info');

                            // 记录已访问的专题班
                            visitedThematicClasses.push(classId);
                            sessionStorage.setItem('visitedThematicClasses', JSON.stringify(visitedThematicClasses));

                            Utils.dom.smartClick(link, '进入专题班');
                            return;
                        }
                    }
                }

                // 如果所有专题班都已访问过，清除记录重新检查
                if (visitedThematicClasses.length > 0) {
                    console.log('所有专题班都已访问过，清除记录重新检查');
                    sessionStorage.removeItem('visitedThematicClasses');
                    Utils.lifecycle.setTimeout(() => Router.handleThematicClassListPage(), 2000);
                    return;
                }

                console.log('所有专题班已完成');
                UI.updateStatus('所有专题班已完成！', 'success');

            }, '专题班列表页面处理失败');
        },

        // ─────────────────────────────────────────────────────────────────────
        //                          🎯 专题班课程页面处理
        // ─────────────────────────────────────────────────────────────────────
        handleThematicClassPage: async () => {
            Utils.safeExecute(async () => {
                // 0. 前置刷新检查：如果检测到刷新信号，优先执行刷新
                const forceReload = GM_getValue('force_reload_requested', false);
                if (forceReload === true) {
                    console.log('📡 专题班页面检测到挂起的刷新信号，立即执行刷新');
                    GM_setValue('force_reload_requested', false);
                    const urlObj = new URL(window.location.href);
                    urlObj.searchParams.set('refresh_ts', Date.now());
                    urlObj.searchParams.set('auto_continue', 'true');
                    window.location.replace(urlObj.href);
                    return;
                }

                // 1. 防止重复执行和冲突检查
                if (CourseHandler.isProcessing) return;
                
                // 🔒 核心修复：检查全局播放锁，防止多开
                if (Utils.globalLock.isLocked()) {
                    console.log('⛔ 专题班：检测到其他页面正在播放，停止当前操作');
                    UI.updateStatus('其他课程学习中...', 'warning');
                    return;
                }

                CourseHandler.isProcessing = true;
                console.log('处理专题班课程页面');
                UI.updateStatus('分析专题班课程...', 'info');

                // 记录当前专题班ID
                const currentThematicClassId = Utils.url.getParam('tid') || sessionStorage.getItem('currentThematicClassId');
                if (currentThematicClassId) {
                    sessionStorage.setItem('currentThematicClassId', currentThematicClassId);
                    Utils.stateManager.setThematicState(currentThematicClassId, 'thematic');
                }

                const isBackground = document.hidden;
                const waitTime = isBackground ? 8000 : 5000;
                await Utils.waitForElement('.ke-box a[target="_blank"]', waitTime);

                const courseLinks = Utils.$$('.ke-box a[target="_blank"]');
                if (courseLinks.length === 0) {
                    UI.updateStatus('未找到专题班课程', 'error');
                    CourseHandler.isProcessing = false;
                    return;
                }

                // 🔄 核心修复：从全局存储读取已访问记录，而非 sessionStorage
                const visitedCourses = Utils.storage.getVisited();
                console.log(`找到 ${courseLinks.length} 个课程，已访问记录: ${visitedCourses.length}`);

                // 标记专题班模式
                sessionStorage.setItem('isThematicClass', 'true');
                sessionStorage.setItem('learningMode', 'thematic');
                
                // 检查是否从学习页面返回
                const fromLearning = sessionStorage.getItem('fromThematicLearning');
                if (fromLearning === 'true') {
                    console.log('🎯 从专题班学习返回，继续寻找下一门');
                    sessionStorage.removeItem('fromThematicLearning');
                    Utils.lifecycle.setTimeout(() => {
                        CourseHandler.isProcessing = false;
                        Router.handleThematicClassPage();
                    }, 3000);
                    return;
                }

                // 🔄 核心修复：引入两阶段优先选课算法
                let selectedLink = null;
                let foundIncompleteCourse = false;

                // 第一阶段：优先寻找进行中的课程 (0 < 进度 < 100)
                // 🚀 [核心修复] 对于进行中课程，忽略 visitedCourses 黑名单，只要没锁就进
                for (const link of courseLinks) {
                    const progressText = link.querySelector('p')?.textContent || '';
                    const progressMatch = progressText.match(/(\d+)%/);
                    const progress = progressMatch ? parseInt(progressMatch[1]) : 0;
                    const courseId = Utils.url.extractCourseId(link.href);

                    if (progress > 0 && progress < 100 && courseId) {
                        console.log(`✨ 发现进行中课程: ${courseId} (${progress}%)`);
                        // 额外检查：如果这个课程正被锁着，说明真的在学，才跳过
                        if (!Utils.globalLock.isLocked()) {
                            console.log('🎯 该课程未被锁定，立即优先进入');
                            selectedLink = link;
                            break;
                        } else {
                            console.log('⏳ 该课程已在其他窗口学习中，检查下一个');
                        }
                    }
                }

                // 第二阶段：如果没有进行中的，寻找未开始的课程 (进度 0 或未识别)
                if (!selectedLink) {
                    for (const link of courseLinks) {
                        const progressText = link.querySelector('p')?.textContent || '';
                        const progressMatch = progressText.match(/(\d+)%/);
                        const progress = progressMatch ? parseInt(progressMatch[1]) : 0;
                        const courseId = Utils.url.extractCourseId(link.href);

                        if ((progress === 0 || !progressMatch) && courseId && !visitedCourses.includes(courseId)) {
                            console.log(`🎯 发现未开始课程: ${courseId}`);
                            selectedLink = link;
                            break;
                        }
                    }
                }

                if (selectedLink) {
                    UI.updateStatus('发现匹配课程，准备进入...', 'info');
                    CourseHandler.openCourse(selectedLink);
                    foundIncompleteCourse = true;
                }

                if (!foundIncompleteCourse) {
                    // 检查是否真的学完了
                    const allCompleted = courseLinks.every(link => {
                        const progressText = link.querySelector('p')?.textContent || '';
                        return progressText.includes('100%');
                    });

                    if (!allCompleted && visitedCourses.length > 0) {
                        console.log('清除访问记录并重试...');
                        Utils.storage.clearVisited();
                        Utils.lifecycle.setTimeout(() => {
                            CourseHandler.isProcessing = false;
                            Router.handleThematicClassPage();
                        }, 2000);
                        return;
                    }

                    if (allCompleted) {
                        UI.updateStatus('专题班全部完成！', 'success');
                        Utils.lifecycle.setTimeout(() => {
                            const targetUrl = currentThematicClassId ? 
                                `/pc/thematicclass/thematicclassdetail.do?tid=${currentThematicClassId}` : 
                                '/pc/thematicclass/thematicclasslist.do';
                            Utils.navigateTo(targetUrl, '返回列表');
                        }, 3000);
                    }
                }

                CourseHandler.isProcessing = false;
            }, '专题班处理失败');
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            🚀 主应用程序
    // ════════════════════════════════════════════════════════════════════════
    const App = {
        init: () => {
            Utils.safeExecute(() => {
                console.log('安徽干部在线教育自动学习 V1.4.5 启动');

                // 0. 立即检查并持久化后台模式标记
                if (window.location.hash.includes('bg_mode=1') || window.location.search.includes('bg_mode=1')) {
                    console.log('🔒 检测到后台模式标记，已持久化到会话存储');
                    sessionStorage.setItem('isBackgroundMode', 'true');
                }

                // 初始化各模块
                VideoAutoplayBlocker.init();
                BackgroundMonitor.init();
                Utils.setupProtection();

                // 等待页面加载完成
                if (document.readyState === 'loading') {
                    Utils.lifecycle.addEventListener(document, 'DOMContentLoaded', App.start);
                } else {
                    App.start();
                }
            }, '应用初始化失败');
        },

        start: () => {
            Utils.safeExecute(() => {
                if (!document.body) {
                    Utils.lifecycle.setTimeout(App.start, 100);
                    return;
                }

                console.log('页面加载完成，启动主程序');

                // 初始化防休眠系统
                WakeLockManager.init();

                // 记录初始URL和活动时间
                sessionStorage.setItem('lastUrl', window.location.href);
                sessionStorage.setItem('lastActiveTime', Date.now().toString());

                // 初始化UI和路由（Router.init 会处理所有页面逻辑，包括自动继续）
                UI.init();
                CourseHandler.init();
                Router.init();

                console.log('所有模块启动完成');
            }, '应用启动失败');
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                          🧹 系统清理与启动
    // ════════════════════════════════════════════════════════════════════════
    
    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        Utils.safeExecute(() => {
            // 先停各模块，再统一清理所有登记资源
            VideoAutoplayBlocker.cleanup?.();
            WakeLockManager.cleanup();
            BackgroundMonitor.cleanup();
            Utils.lifecycle.cleanup();
            console.log('✅ 应用已安全清理');
        }, '应用清理失败');
    });

    // 🚀 启动应用程序
    App.init();

})();

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                           ✨ 脚本运行完毕 ✨                           │
 * │                                                                         │
 * │  感谢使用安徽干部在线教育自动学习脚本！                                 │
 * │  如有问题请联系开发者：Moker32                                          │
 * │                                                                         │
 * │  🎯 功能特性：自动选课 + 智能学习 + 防休眠                              │
 * │  💫 技术栈：ES11+ + WebAPI + Tampermonkey                              │
 * │  🌟 版本：1.4.5                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
