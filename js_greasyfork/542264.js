// ==UserScript==
// @name         安徽干部教育自动学习
// @namespace    http://tampermonkey.net/
// @version      1.5.0
// @description  安徽干部教育在线自动学习脚本，支持自动选课、自动章节学习、自动换课，新增 Scorm 课件支持，优化后台运行。
// @author       Moker32
// @license      GPL-3.0-or-later
// @match        https://www.ahgbjy.gov.cn/*
// @icon         https://www.ahgbjy.gov.cn/commons/img/index/favicon.ico
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        unsafeWindow
// @noframes
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/542264/%E5%AE%89%E5%BE%BD%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/542264/%E5%AE%89%E5%BE%BD%E5%B9%B2%E9%83%A8%E6%95%99%E8%82%B2%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                        ahgbjy自动学习 V1.5.0                            │
 * │                        Released: 2025-06-13                            │
 * │                        Updated: 2026-01-03                             │
 * └─────────────────────────────────────────────────────────────────────────┘
 * 
 * [核心特性]
 * ├─ [智能选课]：优先选择"学习中"状态课程，支持自动翻页
 * ├─ [自动学习]：完整章节学习流程，精确时间计算
 * ├─ [防休眠]：Wake Lock API + 多重备用机制
 * ├─ [课程切换]：智能切换下一门课程，支持必修/选修
 * ├─ [简洁UI]：实时状态显示，精确倒计时
 * └─ [高稳定]：统一错误处理，自动重试机制
 * 
 * [架构设计]
 * ├─ VideoAutoplayBlocker  → 视频播放控制
 * ├─ WakeLockManager       → 防休眠系统
 * ├─ BackgroundMonitor     → 后台保活监控
 * ├─ Utils                 → 统一工具函数
 * ├─ UI                    → 用户界面管理
 * ├─ CourseHandler         → 课程处理引擎
 * └─ Router                → 页面路由控制
 * 
 * [说明] V1.5.0
 * • 通知系统：集成浏览器原生通知，在课程启动、单门完成及全部学完节点提供实时反馈
 * • 性能深度优化：实现存储脏检查与心跳分频机制，大幅降低磁盘 I/O 和 CPU 唤醒频率
 * • 代码质量重构：建立标准化分级日志系统与全局配置中心，增强运行时错误上下文捕获
 *
 * [说明] V1.4.6
 * • 故障自愈系统：引入基于全局心跳表的 Tab 管理机制，支持播放页崩溃/意外关闭后的自动恢复
 * • 架构极致精简：重构了状态同步、ID 提取及课程判定算法，大幅精简冗余代码，提升执行效率
 * • 交互反馈增强：实现跨页面任务完成提醒，在专题班列表页提供明确的学习进度反馈
 *
 * [说明] V1.4.5
 * • 彻底规避 400 错误：引入 URL Hash (#) 隔离技术，确保脚本自定义指令不发送至服务器
 * • 修复 500 错误：重构 URL 生成逻辑，实现页面路径与参数的精准匹配
 * • 增强 Scorm 兼容性：优化弹窗拦截策略，支持 Scorm 课件的手动/自动点击及窗口自动关闭
 *
 * [说明] V1.4.3
 * • 引入生命周期管理器：实现全自动资源回收 (Timers/Listeners/Observers)，彻底杜绝内存泄漏
 * • 智能导航监听：采用 History API Hook 技术实时捕获跳转，极大提升响应速度
 */

(function() {
    'use strict';

    // ════════════════════════════════════════════════════════════════════════
    //                            全局配置 (Configuration)
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
            ],
            COURSE_LIST: {
                CONTAINERS: ['.coursespan', '.lbms tbody tr', '.ke-box', 'tr[id*="ucheck"]'],
                CHAPTER_LINKS: 'a[href*="courseid="]'
            }
        },
        STORAGE_KEYS: {
            VISITED_COURSES: 'visitedCourses',
            GLOBAL_APP_STATE: 'global_app_state',
            PLAY_LOCK: 'ahgbjy_play_lock',
            TAB_TABLE: 'ahgbjy_tab_table',
            REMOTE_REFRESH: 'remote_refresh_signal',
            FORCE_RELOAD: 'force_reload_requested',
            LAST_REFRESH: 'last_refresh_time',
            REFRESH_CONTEXT: 'refresh_context'
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            视频控制模块
    // ════════════════════════════════════════════════════════════════════════
    const VideoAutoplayBlocker = {
        _initialized: false,
        _popupInterval: null,
        _videoObserver: null,

        init: () => {
            if (VideoAutoplayBlocker._initialized) return;
            VideoAutoplayBlocker._initialized = true;
            Utils.safeExecute(() => {
                Utils.logger.info('资源节省模式：视频播放控制启动');
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
                        console.log(' 监测到播放尝试，已强制暂停以节省资源');
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
                console.log(' 极致资源节省模式已开启 (视频已静默并保持暂停)');
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
    //                            防休眠系统
    // ════════════════════════════════════════════════════════════════════════
    const WakeLockManager = {
        wakeLock: null,
        fallbackInterval: null,
        
        init: () => {
            Utils.safeExecute(() => {
                WakeLockManager.requestWakeLock();
                WakeLockManager.setupFallbackKeepAwake();
                WakeLockManager.handleVisibilityChange();
                Utils.logger.info('防休眠系统已启动');
            }, '防休眠初始化失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    Wake Lock API                                │
        // └─────────────────────────────────────────────────────────────────┘
        requestWakeLock: async () => {
            try {
                if ('wakeLock' in navigator) {
                    WakeLockManager.wakeLock = await navigator.wakeLock.request('screen');
                    Utils.logger.info('Wake Lock已激活，系统保持唤醒状态');
                    
                    WakeLockManager.wakeLock.addEventListener('release', () => {
                        Utils.logger.info('Wake Lock已释放');
                    });
                } else {
                    Utils.logger.warn('浏览器不支持Wake Lock API，使用备用方案');
                }
            } catch (error) {
                Utils.logger.warn('Wake Lock请求失败，使用备用方案');
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
                
                Utils.logger.info('备用防休眠机制已启动');
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
    //                            后台监控系统
    // ════════════════════════════════════════════════════════════════════════
    class BackgroundMonitor {
        static isVisible = !document.hidden;
        static backgroundTime = 0;
        static keepAliveWorker = null;
        static lastSignalTime = 0; 
        
        static _initialized = false;
        static _forceCheckInterval = null;
        static _visibilityHandler = null;

        static init() {
            if (BackgroundMonitor._initialized) return;
            BackgroundMonitor._initialized = true;
            Utils.safeExecute(() => {
                // 初始化信号记录
                BackgroundMonitor.lastSignalTime = GM_getValue(CONFIG.STORAGE_KEYS.REMOTE_REFRESH, 0);
                Utils.logger.info(` 初始化刷新信号基准: ${BackgroundMonitor.lastSignalTime}`);

                // 页面可见性监控
                BackgroundMonitor._visibilityHandler = BackgroundMonitor.handleVisibilityChange;
                Utils.lifecycle.addEventListener(document, 'visibilitychange', BackgroundMonitor._visibilityHandler);

                // Web Worker保活
                BackgroundMonitor.createKeepAliveWorker();

                // 路由变化监听
                BackgroundMonitor.setupNavigationWatch();

                Utils.logger.info('双重后台监控系统已启动');
            }, '后台监控初始化失败');
        }
        
        static handleVisibilityChange() {
            Utils.safeExecute(() => {
                BackgroundMonitor.isVisible = !document.hidden;
                UI.updateBackgroundStatus(!BackgroundMonitor.isVisible);

                if (!BackgroundMonitor.isVisible) {
                    BackgroundMonitor.backgroundTime = Date.now();
                } else {
                    Utils.logger.info('页面恢复前台，检查刷新信号');
                    BackgroundMonitor.checkPendingActions();
                }
            }, '可见性变化处理失败');
        }
        
        // 简化的Web Worker保活（降频 + 避免高频 GM 读写）
        static createKeepAliveWorker() {
            Utils.safeExecute(() => {
                // 若重复 init，先清理旧 worker
                if (BackgroundMonitor.keepAliveWorker) {
                    try { BackgroundMonitor.keepAliveWorker.postMessage('stop'); } catch (_) {}
                    try { BackgroundMonitor.keepAliveWorker.terminate(); } catch (_) {}
                    BackgroundMonitor.keepAliveWorker = null;
                }

                const tickInterval = 2000; // 降低主心跳频率至 2s
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

                let tickCount = 0;
                worker.onmessage = (e) => {
                    if (e.data.type === 'tick') {
                        tickCount++;
                        const isLowFreqTick = (tickCount % 5 === 0); // 每 10 秒一次 (2s * 5)

                        // 1. 锁续命 (低频：10s/次)
                        if (isLowFreqTick && typeof Utils !== 'undefined' && Utils.globalLock) {
                            Utils.globalLock.heartbeat();
                        }
                        // 2. Tab 心跳续命 (低频：10s/次)
                        if (isLowFreqTick && typeof Utils !== 'undefined' && Utils.tabManager) {
                            Utils.tabManager.heartbeat();
                        }
                        // 3. 检查待执行动作 (中频：2s/次，确保刷新响应)
                        BackgroundMonitor.checkPendingActions();
                    }
                };

                BackgroundMonitor.keepAliveWorker = worker;
                Utils.logger.info('Web Worker保活已启动');
            }, 'Web Worker创建失败');
        }
        
        // 检查待执行动作
        static checkPendingActions() {
            Utils.safeExecute(() => {
                const currentUrl = window.location.href;

                // 1. 【核心修复】将强力刷新逻辑挂载到每秒一次的 Web Worker 心跳上
                // 这样即使页面在后台，也能每秒检查一次刷新标志位
                if (currentUrl.includes('courselist.do') || currentUrl.includes('thematicclassdetail.do') || currentUrl.includes('coursedetail.do')) {
                    const forceReload = GM_getValue(CONFIG.STORAGE_KEYS.FORCE_RELOAD, false);
                    const lastRefresh = GM_getValue(CONFIG.STORAGE_KEYS.LAST_REFRESH, 0);
                    const now = Date.now();

                    //  核心修复：死锁/崩溃自愈检查
                    // 如果系统检测到有课程锁定，但 Tab 表中没有对应的活着的播放页，判定为播放页崩溃
                    const lockData = GM_getValue(CONFIG.STORAGE_KEYS.PLAY_LOCK, null);
                    if (lockData && lockData.courseId && (now - lockData.timestamp < 30000)) {
                        const hasAlivePlayer = Utils.tabManager.hasActivePlayer(lockData.courseId);
                        if (!hasAlivePlayer) {
                            Utils.logger.warn(`检测到播放页异常消失: ${lockData.courseId}，触发自愈重试`);
                            //  核心修复：使用强制释放，绕过权限检查
                            Utils.globalLock.forceRelease();
                            CourseHandler.isProcessing = false;
                            
                            // 延迟一秒刷新，确保存储同步
                            Utils.lifecycle.setTimeout(() => window.location.reload(), 1000);
                            return;
                        }
                    }

                    // 手动点击触发的刷新请求不受冷却限制 (通过 remote_refresh_signal 变化判断)
                    const remoteSignal = GM_getValue(CONFIG.STORAGE_KEYS.REMOTE_REFRESH, 0);
                    const lastCapturedSignal = parseInt(sessionStorage.getItem('last_captured_signal') || '0');
                    const isNewManualSignal = remoteSignal > lastCapturedSignal;

                    if ((forceReload === true || isNewManualSignal) && (now - lastRefresh) > 1500) {
                        Utils.logger.info(' [Worker心跳] 捕获到刷新信号，立即执行');
                        GM_setValue(CONFIG.STORAGE_KEYS.FORCE_RELOAD, false);
                        GM_setValue(CONFIG.STORAGE_KEYS.LAST_REFRESH, now);
                        sessionStorage.setItem('last_captured_signal', remoteSignal.toString());

                        UI.updateStatus('章节已完成，正在更新列表...', 'success');

                        //  核心修复：根据当前页面路径精准生成跳转目标，防止路径与参数错配导致 500 错误
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
                                Utils.logger.info(`执行精简刷新 (尝试 ${retryCount + 1}/3): ${cleanUrl}`);
                                window.location.replace(cleanUrl);
                            } catch (error) {
                                if (retryCount < 3) {
                                    retryCount++;
                                    Utils.logger.warn(`刷新失败，第${retryCount}次重试...`);
                                    Utils.lifecycle.setTimeout(performRefresh, 1000);
                                } else {
                                    Utils.logger.error('页面刷新失败，已达到最大重试次数');
                                }
                            }
                        };
                        performRefresh();
                        return;
                    }
                }
            }, '检查待执行动作失败');
        }
        
        // 路由/页面变化监听：优先使用 History API hook，保留低频兜底
        static setupNavigationWatch() {
            Utils.safeExecute(() => {
                const notify = () => {
                    const currentUrl = window.location.href;
                    const lastUrl = sessionStorage.getItem('lastUrl') || '';
                    if (currentUrl.includes('/pc/login.do')) return;

                    if (currentUrl !== lastUrl) {
                        Utils.logger.info(`检测到页面变化: ${lastUrl} -> ${currentUrl}`);
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
        }
        
        static cleanup() {
            Utils.safeExecute(() => {
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
    }

    // ════════════════════════════════════════════════════════════════════════
    //                            统一工具模块
    // ════════════════════════════════════════════════════════════════════════
    const Utils = {
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    日志管理 (Logger)                            │
        // └─────────────────────────────────────────────────────────────────┘
        logger: {
            prefix: '[安徽干部教育助手]',
            
            _format: (level, msg) => {
                const time = new Date().toLocaleTimeString();
                return `${Utils.logger.prefix} [${time}] [${level.toUpperCase()}] ${msg}`;
            },

            info: (msg, updateUI = false) => {
                console.log(Utils.logger._format('info', msg));
                if (updateUI && typeof UI !== 'undefined') UI.updateStatus(msg, 'info');
            },

            success: (msg, updateUI = true) => {
                console.log('%c' + Utils.logger._format('success', msg), 'color: green; font-weight: bold;');
                if (updateUI && typeof UI !== 'undefined') UI.updateStatus(msg, 'success');
            },

            warn: (msg, updateUI = true) => {
                console.warn(Utils.logger._format('warn', msg));
                if (updateUI && typeof UI !== 'undefined') UI.updateStatus(msg, 'warning');
            },

            error: (msg, errorObj = null) => {
                const fullMsg = errorObj ? `${msg} | Error: ${errorObj.message}` : msg;
                console.error(Utils.logger._format('error', fullMsg));
                if (errorObj) console.debug(errorObj);
                if (typeof UI !== 'undefined') UI.updateStatus(msg, 'error');
            }
        },

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

        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    通知管理 (Notification)                      │
        // └─────────────────────────────────────────────────────────────────┘
        notificationManager: {
            title: '安徽干部教育自动学习',
            
            /**
             * 发送通知 (兼容 GM_notification 和原生 Notification)
             * @param {string} text 通知内容
             * @param {Object} options 其他选项
             */
            send(text, options = {}) {
                const title = this.title;
                const icon = 'https://www.ahgbjy.gov.cn/commons/img/index/favicon.ico';
                
                // 1. 优先使用 GM_notification (ScriptCat/Tampermonkey 推荐)
                if (typeof GM_notification === 'function') {
                    Utils.safeExecute(() => {
                        GM_notification({
                            text,
                            title,
                            image: icon,
                            highlight: true,
                            silent: false,
                            timeout: 10000,
                            onclick: () => {
                                window.focus();
                            },
                            ...options
                        });
                    }, 'GM_notification 发送失败');
                    return;
                }

                // 2. 降级使用原生 Notification API
                if ('Notification' in window && Notification.permission === 'granted') {
                    Utils.safeExecute(() => {
                        const n = new Notification(title, {
                            body: text,
                            icon,
                            ...options
                        });
                        n.onclick = () => {
                            window.focus();
                            n.close();
                        };
                    }, '原生 Notification 发送失败');
                }
            }
        },

        /**
         * 统一错误处理包装器
         * @param {Function} func 待执行函数
         * @param {string} [context] 错误发生的上下文描述
         * @returns {*} 函数执行结果或 null
         */
        safeExecute: (func, context = '未知操作') => {
            try {
                return func();
            } catch (error) {
                //  增强：收集更多上下文
                const errorData = {
                    context,
                    url: window.location.href,
                    timestamp: new Date().toISOString(),
                    stack: error.stack
                };
                Utils.logger.error(`[运行时异常] 在 ${context} 发生错误: ${error.message}`, error);
                
                // 可以在此处扩展将错误数据上报或存储的逻辑
                return null;
            }
        },
        
        /**
         * 智能重试执行
         * @param {Function} func 返回非 false/null/undefined 视为成功
         * @param {number} [maxRetries] 最大重试次数
         * @param {number} [delay] 重试延迟 (ms)
         * @param {string} [errorMsg] 最终失败提示
         */
        retry: (func, maxRetries = 3, delay = 1000, errorMsg = '重试失败') => {
            let attempts = 0;
            
            const attempt = () => {
                try {
                    const result = func();
                    if (result !== false && result !== null && result !== undefined) {
                        return result;
                    }
                } catch (error) {
                    Utils.logger.error(`尝试 ${attempts + 1} 失败`, error);
                }
                
                attempts++;
                if (attempts < maxRetries) {
                    Utils.lifecycle.setTimeout(attempt, delay);
                } else {
                    Utils.logger.error(`${errorMsg}: 已达最大重试次数`);
                }
            };
            
            attempt();
        },
        
        /**
         * 快捷 DOM 查询 (单元素)
         * @param {string} selector CSS 选择器
         * @param {HTMLElement|Document} [context] 查询上下文
         * @returns {HTMLElement|null}
         */
        $: (selector, context = document) => {
            return Utils.safeExecute(() => context.querySelector(selector), `查询失败: ${selector}`);
        },
        
        /**
         * 快捷 DOM 查询 (多元素)
         * @param {string} selector CSS 选择器
         * @param {HTMLElement|Document} [context] 查询上下文
         * @returns {HTMLElement[]}
         */
        $$: (selector, context = document) => {
            return Utils.safeExecute(() => Array.from(context.querySelectorAll(selector)), `查询失败: ${selector}`) || [];
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    元素等待器                                    │
        // └─────────────────────────────────────────────────────────────────┘
        /**
         * 异步等待元素出现 (优先使用 MutationObserver)
         * @param {string} selector CSS 选择器
         * @param {number} [timeout] 超时时间 (ms)
         * @returns {Promise<HTMLElement[]>} 匹配的元素数组
         */
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
        /**
         * 安全页面跳转
         * @param {string} url 目标 URL
         * @param {string} [reason] 跳转原因描述
         */
        navigateTo: (url, reason = '页面跳转') => {
            Utils.safeExecute(() => {
                Utils.logger.info(`${reason}: ${url}`);
                sessionStorage.setItem('returning', 'true');
                window.location.href = url;
                
                // 单一备用机制（可清理）
                Utils.lifecycle.setTimeout(() => {
                    // 简单的URL比较可能因为末尾斜杠或参数顺序不同而失败，这里只做基本检查
                    if (!window.location.href.includes(url.split('?')[0])) {
                        Utils.logger.info('备用导航触发');
                        window.location.assign(url);
                    }
                }, CONFIG.TIMEOUTS.DEFAULT_WAIT);
            }, `导航失败: ${url}`);
        },

        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    DOM 操作工具                                  │
        // └─────────────────────────────────────────────────────────────────┘
        dom: {
            /**
             * 智能点击：执行点击并验证跳转，支持自动后台打开视频
             * @param {HTMLElement} element 目标元素
             * @param {string} [description] 日志描述
             * @returns {boolean} 是否成功触发
             */
            smartClick: (element, description = '点击操作') => {
                return Utils.safeExecute(() => {
                    if (!element) {
                        Utils.logger.error(`${description}: 元素不存在`);
                        return false;
                    }

                    Utils.logger.info(`执行: ${description}`);
                    const currentUrl = window.location.href;
                    
                    // 检查是否为新标签页链接
                    const isNewTab = element.tagName === 'A' && element.getAttribute('target') === '_blank';
                    let href = element.getAttribute('href');
                    
                    // 如果是视频播放链接，强制在后台打开
                    if (isNewTab && href && (href.includes('playvideo.do') || href.includes('playscorm.do'))) {
                        Utils.logger.info(` 后台静默打开视频页面: ${href}`);
                        GM_openInTab(href, { active: false, insert: true, setParent: true });
                        return true;
                    }

                    element.click();
                    
                    // 验证跳转是否成功（针对非新标签页）
                    if (!isNewTab) {
                        Utils.lifecycle.setTimeout(() => {
                            if (window.location.href === currentUrl) {
                                Utils.logger.info(`${description}: 页面未响应，执行备用点击`);
                                element.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
                            }
                        }, 2000);
                    } else {
                        Utils.logger.info(`${description}: 新标签页打开，跳过跳转验证`);
                    }
                    return true;
                }, `点击失败: ${description}`) || false;
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

                // ️ 拦截站点原生脚本的已知兼容性错误 (如 FlexNav 插件在 DOM 变动时的计算错误)
                window.addEventListener('error', (event) => {
                    const msg = event.message || '';
                    const file = event.filename || '';
                    if (
                        (msg.includes("'left'") || msg.includes('undefined (reading \'left\')')) && 
                        (file.includes('flexnav') || file.includes('jquery'))
                    ) {
                        event.preventDefault();
                        console.log('️ 已拦截并屏蔽站点原生 FlexNav 插件的定位计算错误 (不影响脚本运行)');
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

                        console.log(` 拦截 window.open 弹窗，转为后台静默打开: ${fullUrl}`);
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
        //                            存储管理
        // ═══════════════════════════════════════════════════════════════════
        storage: {
            _writeCache: {}, // 仅用于拦截重复写入

            get: (key, defaultValue = '') => {
                //  核心修复：移除内存读取缓存，确保跨标签页同步
                return Utils.safeExecute(() => {
                    const val = GM_getValue(key, defaultValue);
                    return val;
                }, `存储读取错误: ${key}`, defaultValue);
            },
            
            set: (key, value) => {
                const stringifiedValue = JSON.stringify(value);
                // 仅当新值与本页最后一次写入的值不同时，才触发 GM_setValue
                if (Utils.storage._writeCache[key] === stringifiedValue) {
                    return;
                }
                
                Utils.safeExecute(() => {
                    GM_setValue(key, value);
                    Utils.storage._writeCache[key] = stringifiedValue;
                }, `存储写入错误: ${key}`);
            },
            
            getVisited: () => {
                return Utils.safeExecute(() => {
                    return GM_getValue(CONFIG.STORAGE_KEYS.VISITED_COURSES, []);
                }, '获取访问记录错误', []);
            },
            
            addVisited: courseId => {
                Utils.safeExecute(() => {
                    const visited = Utils.storage.getVisited();
                    if (!visited.includes(courseId)) {
                        visited.push(courseId);
                        Utils.storage.set(CONFIG.STORAGE_KEYS.VISITED_COURSES, visited);
                    }
                }, `添加访问记录错误: ${courseId}`);
            },
            
            clearVisited: () => {
                Utils.storage.set(CONFIG.STORAGE_KEYS.VISITED_COURSES, []);
            }
        },

        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    全局 Tab 管理器 (静默重试同步)                │
        // └─────────────────────────────────────────────────────────────────┘
        tabManager: {
            tableKey: CONFIG.STORAGE_KEYS.TAB_TABLE,
            currentTabId: Date.now() + '_' + Math.floor(Math.random() * 1000),
            
            // 注册当前标签页
            register: () => {
                const table = GM_getValue(Utils.tabManager.tableKey, {});
                const type = window.location.href.includes('playvideo.do') || window.location.href.includes('playscorm.do') ? 'player' : 'manager';
                
                table[Utils.tabManager.currentTabId] = {
                    type: type,
                    url: window.location.href,
                    courseId: Utils.url.extractCourseId(window.location.href),
                    timestamp: Date.now()
                };
                GM_setValue(Utils.tabManager.tableKey, table);
                Utils.logger.info(` Tab 注册成功: ${Utils.tabManager.currentTabId} (${type})`);
            },
            
            // 更新心跳 (由 Worker 触发)
            heartbeat: () => {
                const table = GM_getValue(Utils.tabManager.tableKey, {});
                if (table[Utils.tabManager.currentTabId]) {
                    //  性能优化：降低时间戳精度到 10 秒
                    const lowPrecisionTimestamp = Math.floor(Date.now() / 10000) * 10000;
                    
                    if (table[Utils.tabManager.currentTabId].timestamp === lowPrecisionTimestamp) return;
                    
                    table[Utils.tabManager.currentTabId].timestamp = lowPrecisionTimestamp;
                    GM_setValue(Utils.tabManager.tableKey, table);
                } else {
                    Utils.tabManager.register(); // 意外丢失则重新注册
                }
            },
            
            // 检查是否有活着的播放页
            hasActivePlayer: (courseId) => {
                const table = GM_getValue(Utils.tabManager.tableKey, {});
                const now = Date.now();
                return Object.values(table).some(tab => 
                    tab.type === 'player' && 
                    (!courseId || tab.courseId === courseId) && 
                    (now - tab.timestamp < 15000) // 15秒内有心跳视为存活
                );
            },
            
            // 清理过期 Tab
            cleanup: () => {
                const table = GM_getValue(Utils.tabManager.tableKey, {});
                const now = Date.now();
                let changed = false;
                
                for (const id in table) {
                    if (now - table[id].timestamp > 60000 || id === Utils.tabManager.currentTabId) {
                        delete table[id];
                        changed = true;
                    }
                }
                if (changed) GM_setValue(Utils.tabManager.tableKey, table);
            },
            
            // 页面卸载时注销
            unregister: () => {
                const table = GM_getValue(Utils.tabManager.tableKey, {});
                delete table[Utils.tabManager.currentTabId];
                GM_setValue(Utils.tabManager.tableKey, table);
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        //                            URL处理
        // ═══════════════════════════════════════════════════════════════════
        url: {
            extractCourseId: input => {
                const str = typeof input === 'string' ? input : (input?.href || input?.querySelector('a')?.href || '');
                const match = str.match(/courseid=([0-9A-F-]{36})/i) || str.match(/courseid=(\d+)/);
                return match ? match[1] : null;
            },
            
            extractChapterId: url => {
                const match = url.match(/chapterid=([0-9A-F-]{36})/i) || url.match(/chapterid=(\d+)/);
                return match ? match[1] : null;
            },
            
            getParam: (name, url = window.location.href) => {
                const regex = new RegExp(`[?&#]${name}=([^&#]*)`);
                const match = url.match(regex);
                return match ? decodeURIComponent(match[1].replace(/\+/g, ' ')) : null;
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        //                            状态同步 (State Manager)
        // ═══════════════════════════════════════════════════════════════════
        stateManager: {
            stateKey: CONFIG.STORAGE_KEYS.GLOBAL_APP_STATE,
            _lastSync: 0,
            
            // 自动同步本地与全局状态 (增加节流：1秒内仅同步一次)
            sync: () => {
                const now = Date.now();
                if (now - Utils.stateManager._lastSync < 1000) {
                    return {
                        learningMode: sessionStorage.getItem('learningMode'),
                        thematicClassId: sessionStorage.getItem('currentThematicClassId'),
                        isThematicClass: sessionStorage.getItem('isThematicClass') === 'true'
                    };
                }
                Utils.stateManager._lastSync = now;

                const appState = Utils.storage.get(Utils.stateManager.stateKey, null);
                // 检查状态是否过期（超过30分钟）
                if (appState && (now - appState.timestamp > 1800000)) {
                    Utils.stateManager.clear();
                    return {};
                }

                if (appState) {
                    const keys = ['thematicClassId', 'learningMode'];
                    keys.forEach(k => {
                        if (appState[k]) {
                            const sessionKey = k === 'thematicClassId' ? 'currentThematicClassId' : k;
                            sessionStorage.setItem(sessionKey, appState[k]);
                        }
                    });
                    sessionStorage.setItem('isThematicClass', 'true');
                }
                
                return {
                    learningMode: sessionStorage.getItem('learningMode'),
                    thematicClassId: sessionStorage.getItem('currentThematicClassId'),
                    isThematicClass: sessionStorage.getItem('isThematicClass') === 'true'
                };
            },

            setThematicState: (thematicClassId, learningMode = 'thematic') => {
                Utils.storage.set(Utils.stateManager.stateKey, {
                    thematicClassId, learningMode, timestamp: Date.now()
                });
                Utils.stateManager.sync();
            },
            
            getThematicState: () => Utils.storage.get(Utils.stateManager.stateKey, null),
            
            clear: () => {
                Utils.storage.set(Utils.stateManager.stateKey, null);
                ['currentThematicClassId', 'learningMode', 'isThematicClass', 'fromThematicLearning'].forEach(k => sessionStorage.removeItem(k));
            }
        },

        // ═══════════════════════════════════════════════════════════════════
        //                            全局播放锁 (Global Lock)
        // ═══════════════════════════════════════════════════════════════════
        globalLock: {
            lockKey: CONFIG.STORAGE_KEYS.PLAY_LOCK,
            
            // 检查是否被锁定（有其他页面正在播放）
            isLocked: () => {
                const lockData = Utils.storage.get(Utils.globalLock.lockKey, null);
                if (!lockData) return false;
                
                // 1. 检查心跳是否超时（超过30秒未更新视为死锁）
                const now = Date.now();
                if (now - lockData.timestamp > 30000) {
                    Utils.logger.info(' 全局锁已超时');
                    return false;
                }

                // 2.  核心自愈：检查 Tab 表中是否有对应的活跃播放页
                // 如果锁在有效期内，但对应的 Tab 已经没有心跳了，判定为崩溃，允许抢占
                if (typeof Utils !== 'undefined' && Utils.tabManager) {
                    const hasAlivePlayer = Utils.tabManager.hasActivePlayer(lockData.courseId);
                    if (!hasAlivePlayer) {
                        Utils.logger.warn(`️ 检测到孤儿锁 (Course: ${lockData.courseId})，播放页已无心跳，判定为未锁定`);
                        return false;
                    }
                }
                
                Utils.logger.info(` 系统被锁定: ${lockData.courseId} (上次心跳: ${Math.round((now - lockData.timestamp)/1000)}秒前)`);
                return true;
            },
            
            // 续命锁（由 BackgroundMonitor 周期性调用）
            heartbeat: () => {
                if (sessionStorage.getItem('currentlyStudying') !== 'true') return;
                const courseId = sessionStorage.getItem('currentLockCourseId');
                if (!courseId) return;

                //  性能优化：将时间戳精度降低到 10 秒，结合 storage.set 的脏检查，
                // 这样在 10 秒内多次调用只会触发一次物理写入。
                const lowPrecisionTimestamp = Math.floor(Date.now() / 10000) * 10000;

                Utils.storage.set(Utils.globalLock.lockKey, {
                    courseId: courseId,
                    timestamp: lowPrecisionTimestamp
                });
            },

            // 获取锁
            acquire: (courseId) => {
                sessionStorage.setItem('currentlyStudying', 'true');
                sessionStorage.setItem('currentLockCourseId', courseId);
                Utils.globalLock.heartbeat();
                Utils.logger.info(` 已获取全局播放锁: ${courseId}`);
            },
            
            // 释放锁
            release: () => {
                const currentCourseId = sessionStorage.getItem('currentLockCourseId');
                const lockData = Utils.storage.get(Utils.globalLock.lockKey, null);
                
                if (lockData && lockData.courseId === currentCourseId) {
                    Utils.globalLock.forceRelease();
                }
                
                sessionStorage.removeItem('currentlyStudying');
                sessionStorage.removeItem('currentLockCourseId');
            },

            // 强力释放（不受归属检查限制，用于自愈）
            forceRelease: () => {
                Utils.storage.set(Utils.globalLock.lockKey, null);
                console.log(' 已强制释放全局播放锁');
            }
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            用户界面模块
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
                        <div style="font-weight: bold; margin-bottom: 10px; color: #333;">安徽干部教育助手 V1.5.0</div>
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
    //                            课程处理引擎
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
                            Utils.logger.info(' 收到远程刷新信号，准备更新课程列表');
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
                    Utils.logger.info(` 初始化时从存储恢复状态: ${JSON.stringify(appState)}`);
                    sessionStorage.setItem('currentThematicClassId', appState.thematicClassId);
                    sessionStorage.setItem('learningMode', appState.learningMode || 'thematic');
                    sessionStorage.setItem('isThematicClass', 'true');
                }
                
                // 恢复学习模式状态
                Utils.stateManager.sync();
                Utils.logger.info('课程处理器已初始化');
            }, '课程处理器初始化失败');
        },
        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    智能课程打开器                                │
        // └─────────────────────────────────────────────────────────────────┘
        openCourse: (courseElement) => {
            if (!courseElement) return;
            
            //  检查全局锁
            if (Utils.globalLock.isLocked()) {
                Utils.logger.warn(' 拦截打开操作：检测到其他页面正在播放视频');
                UI.updateStatus('其他课程学习中...', 'warning');
                return;
            }
            
            Utils.safeExecute(() => {
                CourseHandler.isProcessing = true;
                const courseTitle = courseElement.textContent?.trim().substring(0, 20) || '未知课程';
                Utils.logger.info(`准备打开课程: ${courseTitle}`);
                UI.updateStatus(`正在打开: ${courseTitle}`, 'info');
                
                // 发送学习启动通知
                Utils.notificationManager.send(`开始学习：${courseTitle}`);
                
                //  使用增强后的 Utils.url.extractCourseId
                const courseId = Utils.url.extractCourseId(courseElement);
                if (courseId) {
                    const playUrl = `https://www.ahgbjy.gov.cn/pc/course/coursedetail.do?courseid=${courseId}`;
                    Utils.logger.info(`导航至: ${playUrl}`);
                    Utils.navigateTo(playUrl, '打开课程');
                } else {
                    Utils.logger.info('未找到直接链接，尝试点击元素');
                    Utils.dom.smartClick(courseElement, '打开课程');
                }
            }, '打开课程失败');
        },
        

        
        // ┌─────────────────────────────────────────────────────────────────┐
        // │                    学习时间管理器 (秒级精确版)                    │
        // └─────────────────────────────────────────────────────────────────┘
        startStudyTime: (requiredSeconds, completeButton) => {
            Utils.safeExecute(() => {
                const totalMs = requiredSeconds * 1000;
                const studyStartTime = Date.now();
                
                Utils.logger.info(`开始精确学习计时: ${requiredSeconds}秒`);
                
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
                        Utils.logger.info(' 倒计时结束，触发完成按钮');
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
                Utils.logger.info('章节学习完成，寻找下一步');

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
                    console.log(` 记录课程完成状态: ${currentCourseId}`);
                }

                // 如果是播放页完成，一律走统一的退出/信号逻辑
                if (isPlaybackPage || isBgMode) {
                    console.log(' 学习完成，准备退出并刷新主界面');
                    CourseHandler.returnToCourseList();
                    return;
                }

                // 多重检查确保正确识别学习模式 - 在页面跳转前获取状态
                const isThematicClass = sessionStorage.getItem('isThematicClass') === 'true';
                const learningMode = sessionStorage.getItem('learningMode');
                const currentThematicClassId = sessionStorage.getItem('currentThematicClassId');

                console.log(`学习完成状态检查 - isThematicClass: ${isThematicClass}, learningMode: ${learningMode}, currentThematicClassId: ${currentThematicClassId}`);

                // 统一调用 returnToCourseList，无论当前是什么页面
                console.log(' 统一调用返回课程列表函数');
                CourseHandler.returnToCourseList();
            }, '学习完成处理失败');
        },

        // ─────────────────────────────────────────────────────────────────────
        //                           课程选择算法
        // ─────────────────────────────────────────────────────────────────────
        selectCourse: (courseElements, visitedCourses) => {
            console.log(`开始选择课程，共 ${courseElements.length} 个课程，已访问 ${visitedCourses.length} 个`);

            //  优先级1：选择"学习中"的课程，但必须未访问过
            for (const el of courseElements) {
                const status = CourseHandler.extractCourseStatus(el);
                const courseId = Utils.url.extractCourseId(el);
                console.log(`检查课程 - ID: ${courseId}, 状态: "${status}", 已访问: ${visitedCourses.includes(courseId)}`);

                if (status === "学习中") {
                    if (!visitedCourses.includes(courseId)) {
                        console.log(' 找到学习中的课程（未访问）');
                        return el;
                    } else {
                        console.log(`️ 跳过已访问的"学习中"课程: ${courseId}`);
                    }
                }
            }

            //  优先级2：选择未完成且未访问的课程
            for (const el of courseElements) {
                const status = CourseHandler.extractCourseStatus(el);
                const courseId = Utils.url.extractCourseId(el);

                // 只选择明确不是"已完成"的课程，并且未访问过
                if (status && status !== "已完成") {
                    if (!visitedCourses.includes(courseId)) {
                        console.log(` 选择未完成课程: ${courseId} (状态: "${status}")`);
                        // 注意：不在选择时立即标记为已访问，而是在成功打开课程后再标记
                        return el;
                    }
                }
            }

            console.log('未找到合适的课程');
            return null;
        },

        // ─────────────────────────────────────────────────────────────────────
        //                           分页处理
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
        //                           课程类型切换
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
                    console.log(' 所有课程均已通过本次会话验证并确认完成！');
                    UI.updateStatus(' 所有课程已完成！', 'success');
                    
                    // 发送所有任务完成通知
                    Utils.notificationManager.send('恭喜！所有必修和选修课程均已完成！');
                    
                    alert(' 恭喜！所有必修和选修课程均已完成！');
                    return;
                }
                
                // 3. 根据当前类型切换到另一种类型 (即使标记为完成，如果没验证过也要去看看)
                if (currentType === '1') {
                    console.log(' 必修页学完，准备切换到选修课程进行验证');
                    UI.updateStatus('切换到选修课程...', 'info');

                    const electiveUrl = 'https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=0';
                    Utils.lifecycle.setTimeout(() => {
                        window.location.replace(electiveUrl);
                    }, 2000);
                } else {
                    console.log(' 选修页学完，准备切换到必修课程进行验证');
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

        // 提取课程状态
        extractCourseStatus: (el) => {
            if (el.querySelector("img[src*='ywc.png'], span.green2") || el.textContent.includes("已完成")) return "已完成";
            if (el.querySelector("img[src*='xxz.png'], span.orange") || el.textContent.includes("学习中")) return "学习中";
            return "未开始";
        },

        // ─────────────────────────────────────────────────────────────────────
        //                           章节处理算法
        // ─────────────────────────────────────────────────────────────────────
        findAndClickIncompleteChapter: () => {
            Utils.safeExecute(() => {
                console.log('查找未完成章节');
                const playButtons = Utils.$$('.playBtn[data-chapterid]');
                
                for (let i = 0; i < playButtons.length; i++) {
                    const button = playButtons[i];
                    const row = button.closest('tr');
                    if (!row) continue;
                    
                    //  核心修复：遍历所有 td 单元格查找包含 % 的进度信息
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
                            
                            //  检查全局锁
                            if (Utils.globalLock.isLocked()) {
                                console.log(' 拦截章节点击：检测到其他页面正在播放视频');
                                UI.updateStatus('其他章节正在后台学习中...', 'warning');
                                return;
                            }

                            UI.updateStatus(`进入章节${i + 1}（进度：${progress}%）`, 'info');
                            
                            const chapterId = button.getAttribute('data-chapterid');
                            const courseId = Utils.url.extractCourseId(window.location.href);
                            if (chapterId && courseId) {
                                //  【精确化】在 URL 中携带当前进度
                                let playUrl = `/pc/course/playvideo.do?courseid=${courseId}&chapterid=${chapterId}&bg_mode=1&prev_progress=${progress}`;
                                playUrl = new URL(playUrl, window.location.href).href;
                                console.log(` 强力后台跳转: ${playUrl}`);
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
        //                           章节信息提取
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
                console.log(` 任务完成处理 - 课程ID: ${currentCourseId || '未知'}`);

                // 1. 【核心修正】先记录已访问黑名单，防止刷新时差导致重复进入
                if (currentCourseId) {
                    console.log(` 记录已完成课程黑名单: ${currentCourseId}`);
                    Utils.storage.addVisited(currentCourseId);
                    sessionStorage.setItem('last_completed_course', currentCourseId);
                }

                // 2. 【核心修正】设置刷新标志位
                GM_setValue('remote_refresh_signal', Date.now());
                GM_setValue('force_reload_requested', true);

                // 3. 【核心修正】最后释放全局播放锁
                Utils.globalLock.release();

                // 发送课程完成通知
                Utils.notificationManager.send('课程学习已完成，准备进入下一门。');

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
                    console.log(' 播放页：尝试关闭窗口');
                    Utils.lifecycle.setTimeout(() => {
                        window.close();
                        //  核心修复：如果 window.close 失败，强制跳转回列表页
                        Utils.lifecycle.setTimeout(() => {
                            if (!window.closed) {
                                console.log('️ 窗口关闭失败，执行强制跳转返回列表');
                                const coursetype = sessionStorage.getItem('lastCoutype') || '1';
                                window.location.href = `https://www.ahgbjy.gov.cn/pc/course/courselist.do?coutype=${coursetype}`;
                            }
                        }, 1000);
                    }, 500);
                } else if (currentUrl.includes('coursedetail.do')) {
                    //  【核心修复】章节页完成后，根据模式退回到正确的列表页
                    const isThematic = sessionStorage.getItem('learningMode') === 'thematic' || sessionStorage.getItem('isThematicClass') === 'true';
                    let backUrl = '';

                    if (isThematic) {
                        const tid = sessionStorage.getItem('currentThematicClassId');
                        backUrl = tid ? `/pc/thematicclass/thematicclassdetail.do?tid=${tid}` : '/pc/thematicclass/thematicclasslist.do';
                        console.log(' 专题班章节完成，退回到专题班列表:', backUrl);
                    } else {
                        const coursetype = sessionStorage.getItem('lastCoutype') || '1';
                        backUrl = `/pc/course/courselist.do?coutype=${coursetype}`;
                        console.log(' 普通课程章节完成，退回到主课表:', backUrl);
                    }

                    const urlObj = new URL(backUrl, window.location.origin);
                    urlObj.searchParams.set('refresh_ts', Date.now());
                    urlObj.searchParams.set('auto_continue', 'true');
                    window.location.replace(urlObj.href);
                } else {
                    console.log(' 列表页/其他：强制刷新当前页');
                    const urlObj = new URL(window.location.href);
                    urlObj.searchParams.set('refresh_ts', Date.now());
                    urlObj.searchParams.set('auto_continue', 'true');
                    window.location.replace(urlObj.href);
                }
            }, '返回逻辑执行失败');
        },
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            路由管理系统
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
                const url = window.location.href;

                //  核心修复：支持从 Hash 读取自动继续指令 (Hash 内容不发送给服务器，规避 400)
                const autoContinue = Utils.url.getParam('auto_continue') === 'true' || 
                                     window.location.hash.includes('auto_continue=true');
                
                if (autoContinue) {
                    console.log(' 检测到自动继续标记，清理 URL 痕迹');
                    try {
                        const newUrl = url.split(/[?#]auto_continue=true/)[0].replace(/[?&]refresh_ts=\d+/, '');
                        window.history.replaceState({}, '', newUrl);
                    } catch (_) {
                        window.location.hash = '';
                    }
                }
                
                //  精简：统一同步跨标签页状态
                const state = Utils.stateManager.sync();
                const tidFromUrl = Utils.url.getParam('tid');
                const fromThematicLearning = sessionStorage.getItem('fromThematicLearning') === 'true';
                
                // 登录页直接跳过
                if (url.includes('/pc/login.do')) {
                    UI.updateStatus('登录页面 - 脚本已暂停', 'info');
                    return;
                }
                
                // 保存课程类型参数 (coutype)
                if (url.includes('courselist.do')) {
                    const ct = Utils.url.getParam('coutype');
                    if (ct) sessionStorage.setItem('lastCoutype', ct);
                }
                
                // 检查返回/继续状态
                if (sessionStorage.getItem('returning') === 'true' || autoContinue) {
                    sessionStorage.removeItem('returning');
                    if (url.includes('courselist.do') && (!state.isThematicClass || autoContinue)) {
                        Utils.lifecycle.setTimeout(() => Router.handleCourseListPage(), 2000);
                        return;
                    } else if (url.includes('thematicclassdetail.do')) {
                        Utils.lifecycle.setTimeout(() => Router.handleThematicClassPage(), 2000);
                        return;
                    }
                }
                
                // 根据URL模式和学习模式进行页面处理
                if (url.includes('courselist.do')) {
                    if (!tidFromUrl && (state.thematicClassId || state.learningMode === 'thematic')) {
                        console.log('检测到从专题班模式切回主课程列表，清理专题班状态');
                        Utils.stateManager.clear();
                    }

                    if (!state.thematicClassId && state.learningMode !== 'thematic') {
                        Utils.lifecycle.setTimeout(() => Router.handleCourseListPage(), 1000);
                    } else {
                        if (state.thematicClassId) {
                            Utils.lifecycle.setTimeout(() => Utils.navigateTo('/pc/thematicclass/thematicclasslist.do', '从主课表返回专题班列表'), 2000);
                        } else {
                            Utils.lifecycle.setTimeout(() => Router.handleCourseListPage(), 1000);
                        }
                    }
                } else if (url.includes('coursedetail.do')) {
                    if (state.learningMode === 'thematic' || state.thematicClassId || fromThematicLearning) {
                        if (!state.learningMode) sessionStorage.setItem('learningMode', 'thematic');
                        if (!sessionStorage.getItem('isThematicClass')) sessionStorage.setItem('isThematicClass', 'true');
                    }
                    Utils.lifecycle.setTimeout(() => Router.handleCourseDetailPage(), 1000);
                } else if (url.includes('playvideo.do') || url.includes('playscorm.do')) {
                    Utils.lifecycle.setTimeout(() => Router.handleVideoPage(), 1000);
                } else if (url.includes('thematicclasslist.do')) {
                    Utils.lifecycle.setTimeout(() => Router.handleThematicClassListPage(), 1000);
                } else if (url.includes('thematicclassdetail.do')) {
                    if (state.learningMode !== 'thematic') sessionStorage.setItem('learningMode', 'thematic');
                    Utils.lifecycle.setTimeout(() => Router.handleThematicClassPage(), 1000);
                } else {
                    Router.handleHomePage();
                }

            }, '页面处理失败');
        },
        
        // ─────────────────────────────────────────────────────────────────────
        //                           主页处理
        // ─────────────────────────────────────────────────────────────────────
        handleHomePage: () => {
            Utils.safeExecute(() => {
                UI.updateStatus('首页已加载，请手动进入课程列表', 'info');
                console.log('首页已加载，脚本不会自动跳转到课程列表');
            }, '首页处理失败');
        },
        
        // ─────────────────────────────────────────────────────────────────────
        //                           课程列表页处理
        // ─────────────────────────────────────────────────────────────────────
        handleCourseListPage: async () => {
            Utils.safeExecute(async () => {
                // 并发保护
                if (CourseHandler.isProcessing) return;
                CourseHandler.isProcessing = true;

                console.log('开始处理课程列表页面');

                try {
                    const currentType = Utils.url.getParam('coutype') || '1';
                    const typeName = currentType === '1' ? '必修' : '选修';

                    UI.updateStatus(`正在分析${typeName}课程列表...`, 'info');
                    
                                                    // 检查页面是否在后台
                                                    const isBackground = document.hidden;
                                                    const waitTime = isBackground ? 10000 : 6000; // 延长等待 Ajax 注入
                                                    
                                                    //  核心修复：支持表格行模式 (.lbms tr) 和磁贴模式 (.coursespan)
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
                    const courseId = Utils.url.extractCourseId(el);
                    
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

                //  核心修复：如果当前页发现未完成课程，重置对应的全局完成标志
                if (stats.completed < validCourseElements.length) {
                    const flagKey = currentType === '1' ? 'requiredCoursesCompleted' : 'electiveCoursesCompleted';
                    if (Utils.storage.get(flagKey) === 'true') {
                        console.log(`检测到未完成课程，重置 ${currentType === '1' ? '必修' : '选修'} 完成标志`);
                        Utils.storage.set(flagKey, 'false');
                    }
                }

                // 如果当前页所有课程已完成，尝试翻页
                if (validCourseElements.length > 0 && stats.completed === validCourseElements.length) {
                    UI.updateStatus(' 当前页已学完，准备翻页或切换类型...', 'success');
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
        //                           课程详情页处理
        // ─────────────────────────────────────────────────────────────────────
        handleCourseDetailPage: async () => {
            Utils.safeExecute(async () => {
                if (CourseHandler.isProcessing) return;
                CourseHandler.isProcessing = true;

                Utils.logger.info('=== 开始处理课程详情页 ===');
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
                        Utils.logger.info(' 从学习页面返回，强制刷新页面以更新进度显示');
                        sessionStorage.removeItem('fromLearningPage');
                        sessionStorage.setItem('didRefreshAfterLearning', 'true');
                        window.location.reload();
                        return;
                    }

                    await Utils.waitForElement('.playBtn[data-chapterid]', 3000);
                    CourseHandler.extractChapterInfo(courseId);
                    
                    if (CourseHandler.checkCourseCompletion()) {
                        UI.updateStatus(' 课程已学完！准备寻找新任务...', 'success');
                        Utils.lifecycle.setTimeout(() => CourseHandler.returnToCourseList(), 1500);
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
        //                           学习页面处理
        // ─────────────────────────────────────────────────────────────────────
        handleVideoPage: async () => {
            Utils.safeExecute(async () => {
                if (window.studyPageProcessingStarted) return;
                window.studyPageProcessingStarted = true;

                Utils.logger.info('处理学习页面 (估值计时版)');
                UI.updateStatus('正在初始化播放...', 'info');
                
                const courseId = Utils.url.extractCourseId(window.location.href);
                const chapterId = Utils.url.extractChapterId(window.location.href);
                
                // 获取当前进度百分比（从 URL 参数获取）
                const prevProgress = parseInt(Utils.url.getParam('prev_progress') || '0');

                //  获取全局播放锁
                if (courseId) {
                    Utils.globalLock.acquire(courseId);
                    // 注册到生命周期，确保不会重复绑定
                    Utils.lifecycle.addEventListener(window, 'beforeunload', () => Utils.globalLock.release());
                }
                
                //  增强按钮检测：支持多种选择器和文本识别
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
                            console.log(' 动态补获到完成按钮');
                            bindButton(lateBtn);
                        }
                    }, 2000);
                } else {
                    bindButton(completeButton);
                }

                function bindButton(btn) {
                    // 绑定点击监听（兼容手动）
                    btn.addEventListener('click', () => {
                        console.log(' 检测到完成播放动作 (手动/自动)');
                        
                        //  核心修复：立即释放全局锁，防止后台详情页刷新后检测到锁占用
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
                
                //  【基于详情页估值计算】
                let totalSeconds = 1800; // 默认30分钟
                
                if (courseId && chapterId) {
                    const storedMinutes = Utils.storage.get(`duration_${courseId}_${chapterId}`);
                    if (storedMinutes) {
                        totalSeconds = parseInt(storedMinutes) * 60;
                        console.log(` 使用详情页存储的时长估值: ${storedMinutes}分钟 (${totalSeconds}秒)`);
                    }
                }

                // 计算剩余所需秒数: (总长 * 剩余百分比) + 5秒余量
                const remainingPercent = Math.max(0, (100 - prevProgress) / 100);
                const waitSeconds = Math.ceil(totalSeconds * remainingPercent) + 5;
                const safeWaitSeconds = Math.max(waitSeconds, 10); // 最小不低于10秒

                console.log(` 初始进度: ${prevProgress}%, 剩余比例: ${Math.round(remainingPercent*100)}%, 预计学习: ${safeWaitSeconds}秒`);
                sessionStorage.setItem('fromLearningPage', 'true');
                
                CourseHandler.startStudyTime(safeWaitSeconds, completeButton);
                
            }, '学习页处理失败');
        },
        
        handleScormPage: () => {
            // SCORM页面使用相同的处理逻辑
            Router.handleVideoPage();
        },

        // ─────────────────────────────────────────────────────────────────────
        //                           专题班列表页面处理
        // ─────────────────────────────────────────────────────────────────────
        handleThematicClassListPage: async () => {
            Utils.safeExecute(async () => {
                console.log('处理专题班列表页面');
                
                //  检查是否有刚完成的反馈需要展示
                const justFinished = sessionStorage.getItem('just_finished_thematic_class');
                if (justFinished) {
                    UI.updateStatus(` 已完成: ${justFinished}，正在扫描新任务...`, 'success');
                    sessionStorage.removeItem('just_finished_thematic_class');
                    
                    // 停留一会儿让用户看清，然后继续执行
                    Utils.lifecycle.setTimeout(() => {
                        handleListCore();
                    }, 3000);
                    return;
                }

                handleListCore();

                async function handleListCore() {
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

                    // 获取已访问的专题班记录 (持久化存储)
                    const visitedThematicClasses = GM_getValue('visitedThematicClasses', []);

                    // 查找未完成的专题班
                    for (const link of thematicLinks) {
                        const classBox = link.closest('.ke-box, .thematic-class-item');
                        if (classBox) {
                            // 获取专题班标题
                            const title = classBox.querySelector('.detail-ks, .title')?.textContent || '未知专题班';

                            // 获取专题班ID
                            const classId = Utils.url.getParam('tid', link.href) || Utils.url.extractCourseId(link.href) || '';

                            // 检查是否已访问过
                            const isVisited = visitedThematicClasses.includes(classId);

                            console.log(`专题班: ${title.trim()}, ID: ${classId}, 已访问: ${isVisited}`);

                            // 如果未访问过，则点击进入
                            if (!isVisited && classId) {
                                console.log(`进入专题班: ${title.trim()}`);
                                UI.updateStatus(`进入专题班: ${title.trim()}`, 'info');

                                // 记录已访问的专题班
                                visitedThematicClasses.push(classId);
                                GM_setValue('visitedThematicClasses', visitedThematicClasses);

                                Utils.dom.smartClick(link, '进入专题班');
                                return;
                            }
                        }
                    }

                    // 如果所有专题班都已访问过，清除记录重新检查
                    if (visitedThematicClasses.length > 0) {
                        console.log('所有专题班都已访问过，清除记录重新检查');
                        GM_setValue('visitedThematicClasses', []);
                        Utils.lifecycle.setTimeout(() => Router.handleThematicClassListPage(), 2000);
                        return;
                    }

                    console.log('所有专题班已完成');
                    UI.updateStatus('所有专题班已完成！', 'success');
                }

            }, '专题班列表页面处理失败');
        },

        // ─────────────────────────────────────────────────────────────────────
        //                           专题班课程页面处理
        // ─────────────────────────────────────────────────────────────────────
        handleThematicClassPage: async () => {
            Utils.safeExecute(async () => {
                // 1. 防止重复执行和冲突检查
                if (CourseHandler.isProcessing) return;
                
                //  核心修复：检查全局播放锁，防止多开
                if (Utils.globalLock.isLocked()) {
                    console.log(' 专题班：检测到其他页面正在播放，停止当前操作');
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

                //  核心修复：从全局存储读取已访问记录，而非 sessionStorage
                const visitedCourses = Utils.storage.getVisited();
                console.log(`找到 ${courseLinks.length} 个课程，已访问记录: ${visitedCourses.length}`);

                // 标记专题班模式
                sessionStorage.setItem('isThematicClass', 'true');
                sessionStorage.setItem('learningMode', 'thematic');
                
                // 检查是否从学习页面返回
                const fromLearning = sessionStorage.getItem('fromThematicLearning');
                if (fromLearning === 'true') {
                    console.log(' 从专题班学习返回，继续寻找下一门');
                    sessionStorage.removeItem('fromThematicLearning');
                    Utils.lifecycle.setTimeout(() => {
                        CourseHandler.isProcessing = false;
                        Router.handleThematicClassPage();
                    }, 3000);
                    return;
                }

                //  核心修复：引入两阶段优先选课算法
                let selectedLink = null;
                let foundIncompleteCourse = false;

                // 第一阶段：优先寻找进行中的课程 (0 < 进度 < 100)
                //  [核心修复] 对于进行中课程，忽略 visitedCourses 黑名单，只要没锁就进
                for (const link of courseLinks) {
                    const progressText = link.querySelector('p')?.textContent || '';
                    const progressMatch = progressText.match(/(\d+)%/);
                    const progress = progressMatch ? parseInt(progressMatch[1]) : 0;
                    const courseId = Utils.url.extractCourseId(link.href);

                    if (progress > 0 && progress < 100 && courseId) {
                        console.log(` 发现进行中课程: ${courseId} (${progress}%)`);
                        // 额外检查：如果这个课程正被锁着，说明真的在学，才跳过
                        if (!Utils.globalLock.isLocked()) {
                            console.log(' 该课程未被锁定，立即优先进入');
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
                            console.log(` 发现未开始课程: ${courseId}`);
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
                        const currentTid = sessionStorage.getItem('currentThematicClassId');
                        const className = document.querySelector('.breadcrumb .active, .title')?.textContent?.trim() || '专题班';
                        
                        UI.updateStatus(` ${className} 全部完成！准备寻找新任务...`, 'success');
                        sessionStorage.setItem('just_finished_thematic_class', className);
                        
                        if (currentTid) {
                            const visited = GM_getValue('visitedThematicClasses', []);
                            if (!visited.includes(currentTid)) {
                                visited.push(currentTid);
                                GM_setValue('visitedThematicClasses', visited);
                            }
                        }
                        
                        sessionStorage.removeItem('currentThematicClassId');
                        sessionStorage.removeItem('learningMode');
                        sessionStorage.removeItem('isThematicClass');
                        sessionStorage.removeItem('fromThematicLearning');
                        Utils.stateManager.clear();

                        Utils.lifecycle.setTimeout(() => {
                            Utils.navigateTo('/pc/thematicclass/thematicclasslist.do', '返回专题班列表');
                        }, 3000);
                        return;
                    }
                }

                CourseHandler.isProcessing = false;
            }, '专题班处理失败');
        }
    };

    // ════════════════════════════════════════════════════════════════════════
    //                            主应用程序
    // ════════════════════════════════════════════════════════════════════════
    const App = {
        init: () => {
            Utils.safeExecute(() => {
                console.log('安徽干部在线教育自动学习 V1.5.0 启动');

                // 0. 立即检查并持久化后台模式标记
                if (window.location.hash.includes('bg_mode=1') || window.location.search.includes('bg_mode=1')) {
                    console.log(' 检测到后台模式标记，已持久化到会话存储');
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

                // 注册 Tab 标识并开启心跳 (用于静默重试同步)
                Utils.tabManager.register();
                Utils.lifecycle.addEventListener(window, 'beforeunload', () => Utils.tabManager.unregister());

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
    //                           系统清理与启动
    // ════════════════════════════════════════════════════════════════════════
    
    // 页面卸载时清理资源
    window.addEventListener('beforeunload', () => {
        Utils.safeExecute(() => {
            // 先停各模块，再统一清理所有登记资源
            VideoAutoplayBlocker.cleanup?.();
            WakeLockManager.cleanup();
            BackgroundMonitor.cleanup();
            Utils.lifecycle.cleanup();
            console.log(' 应用已安全清理');
        }, '应用清理失败');
    });

    //  启动应用程序
    App.init();

})();

/**
 * ┌─────────────────────────────────────────────────────────────────────────┐
 * │                            脚本运行完毕                            │
 * │                                                                         │
 * │  感谢使用安徽干部在线教育自动学习脚本！                                 │
 * │  如有问题请联系开发者：Moker32                                          │
 * │                                                                         │
 * │   功能特性：自动选课 + 智能学习 + 防休眠                              │
 * │   技术栈：ES11+ + WebAPI + Tampermonkey                              │
 * │   版本：1.5.0                                                         │
 * └─────────────────────────────────────────────────────────────────────────┘
 */
