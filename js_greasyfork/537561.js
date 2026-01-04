// ==UserScript==
// @name         岐黄天使刷课助手在线
// @namespace    http://tampermonkey.net/
// @version      1.4.15
// @description  自动播放岐黄天使平台的课程视频，实现无人值守刷课，支持上一课/下一课切换，支持获取题目和答案，支持自动答题
// @author       AI助手
// @match        *://www.tcm512.com/*
// @match        *://tcm512.com/*
// @match        *://*.tcm512.com/*
// @license      MIT
// @require      https://cdn.jsdelivr.net/npm/jquery@3.2.1/dist/jquery.min.js
// @require      https://update.greasyfork.org/scripts/537079/1595076/styles.js?v=1.3.1&t=1748095732
// @require      https://update.greasyfork.org/scripts/537080/1595113/uimk.js?v=1.4.3&t=1748100003
// @require      https://update.greasyfork.org/scripts/537081/1594824/utilsmk.js?t=1748095732
// @require      https://update.greasyfork.org/scripts/537083/1597542/videoPlayer.js
// @require      https://update.greasyfork.org/scripts/537082/1595111/videoNavigation.js?v=1.3.1&t=1748100001
// @require      https://update.greasyfork.org/scripts/537075/1597552/courseNavigation.js
// @require      https://update.greasyfork.org/scripts/537085/1594839/questionBankDatasj.js?t=1748095732
// @require      https://update.greasyfork.org/scripts/537077/1595015/questionBank.js?t=1748095732
// @require      https://update.greasyfork.org/scripts/537074/1594810/autoAnswer.js?t=1748095732
// @require      https://update.greasyfork.org/scripts/537078/1594818/remoteSync.js?t=1748095732
// @require      https://update.greasyfork.org/scripts/537076/1595067/debug-loader.js?t=1748095732
// @require      https://update.greasyfork.org/scripts/537107/1595129/dailyLimitManager.js?v=1.0.4&t=1748100004
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/537561/%E5%B2%90%E9%BB%84%E5%A4%A9%E4%BD%BF%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%E5%9C%A8%E7%BA%BF.user.js
// @updateURL https://update.greasyfork.org/scripts/537561/%E5%B2%90%E9%BB%84%E5%A4%A9%E4%BD%BF%E5%88%B7%E8%AF%BE%E5%8A%A9%E6%89%8B%E5%9C%A8%E7%BA%BF.meta.js
// ==/UserScript==

console.log('岐黄天使刷课助手 v1.4.15 加载中...');

// 添加模块加载时间戳验证
console.log('[缓存验证] 当前模块时间戳: 1748100015');
console.log('[缓存验证] 预期强制重新加载所有 @require 模块');
console.log('[缓存验证] videoPlayer 已更新到最新版本: 1597542');
console.log('[缓存验证] courseNavigation 已更新到最新版本: 1597552');
console.log('[缓存验证] dailyLimitManager 已更新到最新版本: 1595129');
console.log('[修复完成] 三个关键问题已修复：视频检测、导航按钮、日志优化');

// 验证模块是否真正重新加载
window.moduleLoadTimestamp = 1748100015;
window.moduleLoadVerification = {
    expectedTimestamp: 1748100015,
    loadedModules: new Set(),
    verifyModule: function(moduleName, actualTimestamp) {
        console.log(`[模块验证] ${moduleName} 加载时间戳: ${actualTimestamp}, 预期: ${this.expectedTimestamp}`);
        if (actualTimestamp === this.expectedTimestamp) {
            this.loadedModules.add(moduleName);
            console.log(`[模块验证] ✅ ${moduleName} 使用了最新版本`);
        } else {
            console.warn(`[模块验证] ⚠️ ${moduleName} 可能使用了缓存版本`);
        }
    },
    showStatus: function() {
        console.log(`[模块验证] 已验证模块: ${Array.from(this.loadedModules).join(', ')}`);
    }
};

// 强制清除 Tampermonkey 相关缓存
try {
    // 清除脚本相关的存储
    if (typeof GM_listValues === 'function') {
        const values = GM_listValues();
        console.log('[缓存清除] 发现存储值:', values);

        // 清除可能影响模块加载的缓存
        values.forEach(key => {
            if (key.includes('module') || key.includes('cache') || key.includes('timestamp')) {
                GM_deleteValue(key);
                console.log(`[缓存清除] 已清除: ${key}`);
            }
        });
    }

    // 强制设置新的加载标识
    GM_setValue('qh_force_reload_timestamp', 1748100015);
    console.log('[缓存清除] 设置强制重载标识');

} catch (e) {
    console.warn('[缓存清除] 清除缓存时出错:', e);
}

(function() {
    'use strict';

    // 强化防重复执行机制
    const initFlag = GM_getValue('qh_assistant_initialized', false);
    if (initFlag) {
        console.log('检测到残留状态，正在清理后重新初始化');
        GM_deleteValue('qh_assistant_initialized');
    }

    // 页面卸载时清理状态
    window.addEventListener('beforeunload', () => {
        console.log('页面卸载，清理助手状态');
        GM_setValue('qh_current_index', window.qh.currentCourseIndex);
        window.qh = null;
        GM_deleteValue('qh_assistant_initialized');
        clearInterval(window.qh.autoPlayInterval);
        clearTimeout(window.qh.navigateTimeout);
    });

    // 初始化全局变量
    window.qh = window.qh || {};
    window.qh.panelCreated = false;
    window.qh.currentCourseIndex = GM_getValue('qh_current_index', 0);
    window.qh.courseList = [];
    window.qh.lastExtractedVideoInfo = null;
    window.qh.navigateTimeout = null;
    window.qh.autoPlayInterval = null;

    GM_setValue('qh_assistant_initialized', true);

    // 题库相关全局变量
    // window.qh.savedQuestionBank = GM_getValue('qh-question-bank', []); // 由 questionBank.js 初始化 window.qh.questionBankData
    window.qh.isAutoAnswering = false;
    window.qh.autoAnswerInterval = null;
    window.qh.humanLikeDelay = { min: 1000, max: 3000 };
    window.qh.autoSubmitDelay = { min: 5000, max: 10000 };

    // 远程题库配置 (已移除, 题库通过 @require 的 questionBankDatasj.js 加载)
    // window.qh.remoteQuestionBankConfig = GM_getValue('qh-remote-question-bank-config', {
    //     enabled: false,
    //     url: '//192.168.1.6:9999/qhtx/questionBank',
    //     autoSync: true,
    //     lastSyncTime: 0,
    //     syncInterval: 3600000,
    //     maxRetries: 3,
    //     retryDelay: 5000,
    //     uploadEnabled: true // 此配置也一并移除
    // });

    // 自动化流程配置
    window.qh.autoFlowConfig = GM_getValue('qh-auto-flow-config', {
        enabled: false,
        autoStartNextCourse: true,
        autoTakeExams: true,
        prioritizeIncomplete: true,
        learningSpeed: 'normal'
    });

    // 题库分类
    window.qh.questionCategories = GM_getValue('qh-question-categories', {});

    // 远程题库同步状态 (已移除)
    // window.qh.isSyncing = false;

    // 导航状态
    window.qh.isNavigating = false;
    window.qh.lastNavigateTime = 0;
    window.qh.videoEndedHandler = null;
    window.qh.progressIntervals = [];
    window.qh.videoObserver = null;

    // 检查是否在顶层窗口
    window.isTopWindow = function() {
        try {
            // 添加更多调试信息
            const isTop = window.self === window.top;
            console.log('[窗口检查] 当前窗口是否为顶层窗口:', isTop, {
                'window.self': window.self,
                'window.top': window.top,
                'window.parent': window.parent,
                'location': window.location.href,
                'referrer': document.referrer,
                'frameElement': window.frameElement
            });

            // 强制返回true，确保控制面板始终创建
            return true;
        } catch (e) {
            console.error('[窗口检查] 检查顶层窗口时出错:', e);
            // 出错时也返回true，确保控制面板创建
            return true;
        }
    };

    // 初始化函数
    function init() {
        console.log('[初始化] 开始初始化...');

        // 确保 qh 对象和必要属性已初始化
        if (!window.qh.questionBankData) {
            window.qh.questionBankData = [];
            console.log('[初始化] 初始化 questionBankData 为空数组');
        }

        // 样式和面板创建将由各自的模块 (styles.js, ui.js) 自行处理
        // console.log('[初始化] 准备创建控制面板');
        // try {
        //     if (typeof applyStyles === 'function') {
        //         console.log('[初始化] 调用 applyStyles()');
        //         applyStyles();
        //     } else {
        //         console.warn('[初始化] applyStyles 函数不可用，尝试备用方案');
        //         if (typeof GM_addStyle === 'function') {
        //             GM_addStyle(`
        //                 .qh-assistant-panel {
        //                     position: fixed; top: 100px; right: 10px; width: 280px;
        //                     background: linear-gradient(135deg, #00a8cc, #0062bd);
        //                     border-radius: 12px; padding: 15px; color: white; z-index: 9999;
        //                 }
        //                 .qh-assistant-btn {
        //                     background: #4CAF50; border: none; color: white; padding: 8px 12px;
        //                     width: 100%; margin: 5px 0; cursor: pointer; border-radius: 4px;
        //                 }
        //             `);
        //             console.log('[初始化] 应用了备用样式');
        //         }
        //     }
        // } catch (e) {
        //     console.error('[初始化] applyStyles 执行出错:', e);
        // }

        // try {
        //     if (typeof createPanel === 'function') {
        //         console.log('[初始化] 调用 createPanel()');
        //         createPanel(); // 面板在这里创建
        //     } else {
        //         console.warn('[初始化] createPanel 函数不可用');
        //     }
        // } catch (e) {
        //     console.error('[初始化] createPanel 执行出错:', e);
        // }

        // 初始化每日学习上限管理器
        // 确保在 ui.js 创建了面板之后执行，或者 DailyLimitManager 内部有等待机制
        if (window.qh && window.qh.DailyLimitManager) {
            // 稍微延迟 DailyLimitManager 的实例化，给 ui.js 一点时间创建面板
            setTimeout(() => {
                try {
                    window.qh.dailyLimitManager = new window.qh.DailyLimitManager({
                        limitVideos: 10, // 每日视频上限，0或负数为无限制
                        resetHour: 8,    // 每日重置时间 (24小时制，例如8代表早上8点)
                        onLimitReached: () => {
                            console.log("[Main] 回调：每日学习上限已达到。");
                            if (window.qh.autoLearnController) {
                                window.qh.autoLearnController.handleDailyLimitReached();
                            }
                            // 可以在这里添加停止自动学习等逻辑
                        },
                        onLimitReset: () => {
                            console.log("[Main] 回调：每日学习上限已重置。");
                            // 可以在这里添加达到上限后停止的自动学习逻辑的恢复
                        }
                    });
                    console.log("[Main] 每日学习上限管理器已初始化。检查UI更新。");

                    // 显式调用一次UI更新，确保初始状态显示
                    if (window.qh.dailyLimitManager && typeof window.qh.dailyLimitManager._updateUIDisplay === 'function') {
                        window.qh.dailyLimitManager._updateUIDisplay();
                    }

                    // 启动定期页面检查（可选）
                    if (window.qh.dailyLimitManager && typeof window.qh.dailyLimitManager.startPeriodicPageCheck === 'function') {
                        window.qh.dailyLimitManager.startPeriodicPageCheck(document, 300000); // 每5分钟检查一次
                    }

                } catch(e) {
                     console.error("[Main] DailyLimitManager 实例化或初始UI更新出错:", e);
                }
            }, 1000); // 延迟1秒，确保UI面板完全创建
        } else {
            console.warn("[Main] DailyLimitManager 类不可用，跳过初始化");
        }

        // 检查模块加载情况
        console.log('[初始化] 检查模块加载情况:', {
            'applyStyles': typeof applyStyles,
            'createPanel': typeof createPanel,
            'checkPageType': typeof checkPageType,
            'getQuestionList': typeof getQuestionList,
            'toggleAutoLearn': typeof toggleAutoLearn,
            'startAutoAnswer': typeof startAutoAnswer,
            'questionBankData': window.qh.questionBankData ? window.qh.questionBankData.length : 'undefined',
            'debugLoader': typeof window.debugLoader,
            'moduleStatus': typeof window.moduleStatus,
            'DailyLimitManager': typeof window.qh.DailyLimitManager,
            'dailyLimitManagerInstance': typeof window.qh.dailyLimitManager
        });

        // 验证 debug-loader 是否为最新版本
        if (window.debugLoader) {
            console.log('[初始化] ✅ debug-loader 模块已加载');
        } else {
            console.warn('[初始化] ⚠️ debug-loader 模块未检测到');
        }

        // 检查当前页面类型
        try {
            if (typeof checkPageType === 'function') {
                console.log('[初始化] 调用 checkPageType()');
                checkPageType();
            } else {
                console.warn('[初始化] checkPageType 函数不可用');
            }
        } catch (e) {
            console.error('[初始化] checkPageType 执行出错:', e);
        }

        // 初始化课程列表，确保导航按钮能正常工作
        setTimeout(() => {
            try {
                if (typeof collectCourseLinks === 'function') {
                    console.log('[初始化] 收集课程列表');
                    collectCourseLinks(document);

                    // 延迟更新导航按钮状态
                    setTimeout(() => {
                        if (typeof updateNavButtons === 'function') {
                            console.log('[初始化] 更新导航按钮状态');
                            updateNavButtons();
                        }
                    }, 500);
                } else {
                    console.warn('[初始化] collectCourseLinks 函数不可用');
                }
            } catch (e) {
                console.error('[初始化] 收集课程列表出错:', e);
            }
        }, 3000); // 延迟增加到3秒，确保页面完全加载

        // 如果在课程学习页面，自动开始或恢复状态，并初始化视频导航
        if (window.location.href.includes('courseLearn.html')) {
            const isRunning = GM_getValue('qh-is-running', false);
            if (typeof toggleAutoLearn === 'function') {
                if (isRunning) {
                    // 如果已经是运行状态 (例如页面刷新)，确保UI正确，videoPlayer.js会处理播放恢复
                    console.log('[初始化] 检测到已在运行状态，更新UI并等待videoPlayer恢复播放。');
                    if(window.qh && window.qh.updateStatus) window.qh.updateStatus('自动学习进行中...');
                    if(window.qh && window.qh.updateButtonStatus) window.qh.updateButtonStatus();
                     // 确保 autoPlayInterval 被 videoPlayer.js 正确恢复或启动
                    // videoPlayer.js 现在有逻辑在加载时检查 isRunning 状态
                } else {
                    // 如果不是运行状态，则启动自动刷课
                    console.log('[初始化] 自动点击开始刷课。');
                    toggleAutoLearn(); // 这会切换到运行状态并开始
                }
            } else {
                console.warn('[初始化] toggleAutoLearn 函数不可用，无法自动开始或恢复刷课。');
            }

            // 初始化视频特定导航功能
            if (typeof window.initVideoNavigation === 'function') {
                console.log('[初始化] 调用 initVideoNavigation() 用于视频学习页面。');
                window.initVideoNavigation();
            } else {
                console.warn('[初始化] initVideoNavigation 函数不可用。');
            }
        }

        // 如果在模拟练习页面，添加自动答题按钮
        if (window.location.href.includes('courseSimulate.html') ||
            window.location.href.includes('courseExam.html')) {
            // 自动开始答题
            if (window.qh.autoFlowConfig.enabled && typeof startAutoAnswer === 'function') {
                setTimeout(() => {
                    startAutoAnswer();
                }, 2000);
            }
        }
    }

    // 检查关键模块是否已加载
    function checkCriticalModules() {
        const criticalModules = {
            'applyStyles': typeof applyStyles === 'function',
            'createPanel': typeof createPanel === 'function',
            'checkPageType': typeof checkPageType === 'function',
            'getQuestionList': typeof getQuestionList === 'function',
            'DailyLimitManager': typeof window.qh.DailyLimitManager === 'function'
        };

        const loadedCount = Object.values(criticalModules).filter(Boolean).length;
        const totalCount = Object.keys(criticalModules).length;

        console.log(`[模块检查] 关键模块加载情况: ${loadedCount}/${totalCount}`, criticalModules);

        return loadedCount >= 4;
    }

    // 页面加载完成后初始化
    const initHandler = function() {
        console.log('[初始化处理] 开始处理初始化...');

        // 检查关键模块是否已加载
        if (checkCriticalModules()) {
            console.log('[初始化处理] 关键模块已加载，立即初始化');
            init();
        } else {
            console.log('[初始化处理] 关键模块未完全加载，延迟初始化');
            let retryCount = 0;
            const maxRetries = 10;

            const retryInit = () => {
                retryCount++;
                console.log(`[初始化处理] 第 ${retryCount} 次重试检查模块加载情况`);

                if (checkCriticalModules()) {
                    console.log('[初始化处理] 模块加载完成，开始初始化');
                    init();
                } else if (retryCount < maxRetries) {
                    setTimeout(retryInit, 500);
                } else {
                    console.warn('[初始化处理] 达到最大重试次数，强制初始化');
                    init();
                }
            };

            setTimeout(retryInit, 500);
        }

        // 添加页面卸载清理
        window.addEventListener('unload', () => {
            console.log('页面卸载，清理临时状态');
            window.qh = null;
        });
    };

    // 使用事件委托优化加载处理
    if (document.readyState === 'complete') {
        setTimeout(initHandler, 100); // 稍微延迟以确保模块加载
    } else {
        window.addEventListener('load', () => setTimeout(initHandler, 100));
        document.addEventListener('DOMContentLoaded', () => setTimeout(initHandler, 100));
    }

    // 添加页面可见性变化监听
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            console.log('页面重新激活，刷新课程列表');
            if (typeof getCourseList === 'function') getCourseList(document);
        }
    });
})();
