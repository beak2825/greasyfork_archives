// ==UserScript==
// @name         代码分支环境自动绑定
// @namespace    http://tampermonkey.net/
// @version      2.4
// @description  自动记录和恢复代码分支与环境的绑定关系
// @author       gaotu/chenzheqi
// @match        https://qingzhou.baijia.com/*
// @grant        gaotu
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/539265/%E4%BB%A3%E7%A0%81%E5%88%86%E6%94%AF%E7%8E%AF%E5%A2%83%E8%87%AA%E5%8A%A8%E7%BB%91%E5%AE%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/539265/%E4%BB%A3%E7%A0%81%E5%88%86%E6%94%AF%E7%8E%AF%E5%A2%83%E8%87%AA%E5%8A%A8%E7%BB%91%E5%AE%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 调试开关 - 默认关闭，不持久化
    let debugEnabled = false;

    // 调试日志函数
    function debugLog(...args) {
        if (debugEnabled) {
            console.debug('[分支环境绑定]', ...args);
        }
    }

    // 错误日志（始终显示）
    function errorLog(...args) {
        console.error('[分支环境绑定]', ...args);
    }

    // 缓存键名前缀
    const CACHE_KEY_PREFIX = 'branch_env_binding_';
    const LAST_BUILD_BRANCH_KEY_PREFIX = 'last_build_branch_';

    // 全局状态管理
    let isInitialized = false;
    let lastUrl = location.href;
    let observers = [];
    let lastHandledBranch = null; // 防止重复处理
    let lastHandleTime = 0; // 防抖时间戳
    let currentAppNid = null; // 当前应用标识
    let isAutoSelecting = false; // 标记是否正在自动选择中
    let autoSelectInProgress = false; // 防止自动选择重复执行
    let hasAutoSelectedBranch = false; // 标记是否已经自动选择过分支
    let lastSelectedEnv = null; // 上次选择的环境，防止重复选择
    let isInitializing = false; // 防止init函数并发执行

    function debounce(fn, delay) {
        let timeoutId = null;
        return function(...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    }

    // 在window上暴露调试控制接口
    window.enableBranchEnvDebug = () => {
        debugEnabled = true;
        console.log('[分支环境绑定] 调试模式已开启');
    };""
    window.disableBranchEnvDebug = () => {
        debugEnabled = false;
        console.log('[分支环境绑定] 调试模式已关闭');
    };

    // 注入CSS样式
    function injectStyles() {
        if (document.getElementById('branch-env-binding-styles')) {
            return; // 已经注入过了
        }

        const style = document.createElement('style');
        style.id = 'branch-env-binding-styles';
        style.textContent = `
            .branch-env-matched {
                position: relative;
                overflow: visible !important;
            }

            .branch-env-matched::after {
                content: '';
                position: absolute;
                top: -2px;
                left: -2px;
                right: -2px;
                bottom: -2px;
                background: linear-gradient(45deg,
                    #ff6b6b 0%,
                    #4ecdc4 14%,
                    #45b7d1 28%,
                    #96ceb4 42%,
                    #ffeaa7 56%,
                    #dda0dd 70%,
                    #ff9ff3 84%,
                    #ff6b6b 100%
                );
                border-radius: 8px;
                z-index: 9999;
                opacity: 0;
                animation: branch-env-fade-in-out 1000ms ease-in-out;
                pointer-events: none;
            }

            .branch-env-matched > * {
                position: relative;
                z-index: 10000;
                background: white;
                border-radius: 4px;
            }

            @keyframes branch-env-fade-in-out {
                0% {
                    opacity: 0;
                    transform: scale(0.95);
                }
                50% {
                    opacity: 1;
                    transform: scale(1.02);
                }
                100% {
                    opacity: 0;
                    transform: scale(1);
                }
            }

            .run-button-hint {
                color: #409eff;
                font-weight: bold;
                font-size: 16px;
                margin-left: 10px;
                white-space: nowrap;
                transition: opacity 0.3s ease;
                opacity: 0;
                pointer-events: none;
            }
        `;
        document.head.appendChild(style);
        debugLog('已注入CSS样式');
    }

    // 添加匹配成功的视觉反馈
    function showMatchedAnimation(element) {
        if (!element) return;

        // 移除可能存在的旧动画类
        element.classList.remove('branch-env-matched');

        // 强制重排，确保动画能重新触发
        element.offsetHeight;

        // 添加动画类
        element.classList.add('branch-env-matched');

        // 1秒后移除动画类
        setTimeout(() => {
            element.classList.remove('branch-env-matched');
        }, 1000);

        debugLog('显示匹配成功动画');
    }

    // 从URL中提取appNid参数
    function getAppNidFromUrl(url = location.href) {
        try {
            const urlObj = new URL(url);
            const hashParams = new URLSearchParams(urlObj.hash.split('?')[1] || '');
            return hashParams.get('appNid');
        } catch (e) {
            debugLog('提取appNid失败:', e);
            return null;
        }
    }

    // 获取当前应用的缓存键
    function getCacheKey() {
        if (!currentAppNid) {
            debugLog('警告: appNid为空，使用默认缓存键');
            return CACHE_KEY_PREFIX + 'default';
        }
        return CACHE_KEY_PREFIX + currentAppNid;
    }

    // 获取最新构建分支的缓存键
    function getLastBuildBranchKey() {
        if (!currentAppNid) {
            debugLog('警告: appNid为空，使用默认最新构建分支键');
            return LAST_BUILD_BRANCH_KEY_PREFIX + 'default';
        }
        return LAST_BUILD_BRANCH_KEY_PREFIX + currentAppNid;
    }

    // 获取缓存的绑定关系
    function getBindingCache() {
        try {
            const cacheKey = getCacheKey();
            const cache = localStorage.getItem(cacheKey);
            debugLog('读取缓存，key:', cacheKey);
            return cache ? JSON.parse(cache) : {};
        } catch (e) {
            errorLog('获取缓存失败:', e);
            return {};
        }
    }

    // 保存绑定关系到缓存
    function saveBindingCache(branch, envInfoId) {
        try {
            const cacheKey = getCacheKey();
            const cache = getBindingCache();
            cache[branch] = envInfoId;
            localStorage.setItem(cacheKey, JSON.stringify(cache));
            debugLog(`已保存绑定关系到 ${cacheKey}: ${branch} -> ${envInfoId}`);
        } catch (e) {
            errorLog('保存缓存失败:', e);
        }
    }

    // 保存最新构建分支
    function saveLastBuildBranch(branch) {
        try {
            const lastBuildBranchKey = getLastBuildBranchKey();
            localStorage.setItem(lastBuildBranchKey, branch);
            debugLog(`已保存最新构建分支到 ${lastBuildBranchKey}: ${branch}`);
        } catch (e) {
            errorLog('保存最新构建分支失败:', e);
        }
    }

    // 获取最新构建分支
    function getLastBuildBranch() {
        try {
            const lastBuildBranchKey = getLastBuildBranchKey();
            const lastBranch = localStorage.getItem(lastBuildBranchKey);
            debugLog(`读取最新构建分支，key: ${lastBuildBranchKey}, value: ${lastBranch}`);
            return lastBranch;
        } catch (e) {
            errorLog('获取最新构建分支失败:', e);
            return null;
        }
    }

    // 获取当前可用分支列表
    function getCurrentAvailableBranches(branchSelectVue) {
        try {
            if (!branchSelectVue || !branchSelectVue.options) {
                debugLog('无法获取分支选择器options');
                return [];
            }
            
            const branches = branchSelectVue.options.map(option => option.value).filter(value => value);
            debugLog('当前可用分支列表:', branches);
            return branches;
        } catch (e) {
            errorLog('获取当前可用分支列表失败:', e);
            return [];
        }
    }

    // 等待分支选项加载完成
    function waitForBranchOptionsLoaded(branchSelectVue, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            
            function check() {
                const branchOptions = branchSelectVue.options || [];
                if (branchOptions.length > 0) {
                    debugLog(`分支选项已加载，共 ${branchOptions.length} 个选项`);
                    resolve(branchOptions);
                } else if (Date.now() - startTime > timeout) {
                    debugLog('等待分支选项加载超时');
                    reject(new Error('等待分支选项加载超时'));
                } else {
                    setTimeout(check, 200);
                }
            }
            
            check();
        });
    }

    // 显示自动选择分支的提示消息
    function showAutoSelectMessage(container) {
        if (!container) return;

        // 移除可能存在的旧消息
        const oldMessage = container.querySelector('.auto-select-message');
        if (oldMessage) {
            oldMessage.remove();
        }

        const message = document.createElement('div');
        message.className = 'auto-select-message';
        message.textContent = '已自动选择最新分支';
        Object.assign(message.style, {
            position: 'absolute',
            top: '30px', // 使用固定像素值，更精确地定位在输入框下方
            left: '0',
            color: '#409eff',
            fontSize: '12px',
            transition: 'opacity 0.5s ease-in-out',
            opacity: '1',
            pointerEvents: 'none', // 避免遮挡下方元素
            whiteSpace: 'nowrap',
            zIndex: '10' // 确保消息显示在其他元素之上
        });

        // 确保容器有相对定位
        if (getComputedStyle(container).position === 'static') {
            container.style.position = 'relative';
        }

        container.appendChild(message);

        setTimeout(() => {
            message.style.opacity = '0';
            setTimeout(() => {
                if(message.parentElement) {
                    message.remove();
                }
            }, 500); // 等待动画结束再移除DOM
        }, 2000); // 持续2秒
    }

    // 检查并自动选择最新构建分支（异步版本）
    async function autoSelectLastBuildBranch(branchSelectVue) {
        try {
            // 防止重复执行
            if (autoSelectInProgress || hasAutoSelectedBranch) {
                debugLog('自动选择已完成或正在进行中，跳过');
                return;
            }

            const lastBuildBranch = getLastBuildBranch();
            if (!lastBuildBranch) {
                debugLog('没有最新构建分支记录');
                return;
            }

            debugLog(`开始等待分支选项加载，目标分支: ${lastBuildBranch}`);
            
            // 等待分支选项加载完成
            let branchOptions;
            try {
                branchOptions = await waitForBranchOptionsLoaded(branchSelectVue);
            } catch (error) {
                debugLog('分支选项加载失败或超时:', error);
                return;
            }

            // 检查目标分支是否存在于选项中
            const targetOption = branchOptions.find(option => option.value === lastBuildBranch);
            if (!targetOption) {
                debugLog(`目标分支 ${lastBuildBranch} 不存在于当前选项中`);
                return;
            }

            debugLog(`找到目标分支 ${lastBuildBranch}，准备自动选择`);
            
            // 标记自动选择进行中
            autoSelectInProgress = true;
            isAutoSelecting = true;
            hasAutoSelectedBranch = true;
            
            // 自动选择这个分支
            setTimeout(() => {
                try {
                    // 设置分支选择器的值
                    branchSelectVue.$emit('input', targetOption.value);
                    if (branchSelectVue.value !== undefined) {
                        branchSelectVue.value = targetOption.value;
                    }
                    branchSelectVue.$emit('change', targetOption.value);

                    // 获取分支选择器的DOM元素并显示动画
                    const branchSelectInput = document.querySelector('input[placeholder*="请选择代码分支"]');
                    const branchSelectContainer = branchSelectInput ? branchSelectInput.closest('.el-select') : null;
                    if (branchSelectContainer) {
                        showMatchedAnimation(branchSelectContainer);
                        showAutoSelectMessage(branchSelectContainer);
                    }

                    debugLog(`已自动选择分支: ${targetOption.value}`);

                    // 延迟触发分支变化处理，避免与$watch冲突
                    setTimeout(() => {
                        handleBranchChange(targetOption.value, 'auto-select-last-build');
                        // 重置自动选择状态
                        isAutoSelecting = false;
                        autoSelectInProgress = false;
                    }, 100);
                } catch (error) {
                    errorLog('自动选择分支过程中出错:', error);
                    isAutoSelecting = false;
                    autoSelectInProgress = false;
                }
            }, 200);
        } catch (e) {
            errorLog('自动选择最新构建分支失败:', e);
            isAutoSelecting = false;
            autoSelectInProgress = false;
        }
    }

    // 带重试机制的分支自动选择
    async function autoSelectLastBuildBranchWithRetry(branchSelectVue, maxRetries = 3) {
        let retryCount = 0;
        
        while (retryCount < maxRetries) {
            try {
                debugLog(`第 ${retryCount + 1} 次尝试自动选择分支`);
                await autoSelectLastBuildBranch(branchSelectVue);
                
                // 检查是否成功选择了分支
                if (hasAutoSelectedBranch) {
                    debugLog('分支自动选择成功');
                    return;
                }
                
                // 如果没有成功选择且还有重试次数，等待一段时间后重试
                if (retryCount < maxRetries - 1) {
                    debugLog(`第 ${retryCount + 1} 次尝试未成功，等待 ${1000 * (retryCount + 1)}ms 后重试`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * (retryCount + 1)));
                }
                
                retryCount++;
            } catch (error) {
                errorLog(`第 ${retryCount + 1} 次尝试自动选择分支失败:`, error);
                retryCount++;
                
                // 如果还有重试次数，等待一段时间后重试
                if (retryCount < maxRetries) {
                    debugLog(`等待 ${1000 * retryCount}ms 后重试`);
                    await new Promise(resolve => setTimeout(resolve, 1000 * retryCount));
                }
            }
        }
        
        debugLog(`所有重试尝试都失败了，停止自动选择分支`);
    }

    // 清理无效的缓存分支
    function cleanInvalidCacheBranches(branchSelectVue) {
        try {
            const availableBranches = getCurrentAvailableBranches(branchSelectVue);
            if (availableBranches.length === 0) {
                debugLog('当前可用分支列表为空，跳过缓存清理');
                return;
            }

            const cacheKey = getCacheKey();
            const cache = getBindingCache();
            const cacheKeys = Object.keys(cache);
            
            if (cacheKeys.length === 0) {
                debugLog('缓存为空，无需清理');
                return;
            }

            debugLog('开始清理缓存，当前缓存分支:', cacheKeys);
            debugLog('当前可用分支:', availableBranches);

            let cleanedCount = 0;
            const newCache = {};

            // 只保留仍然存在的分支
            cacheKeys.forEach(cachedBranch => {
                if (availableBranches.includes(cachedBranch)) {
                    newCache[cachedBranch] = cache[cachedBranch];
                } else {
                    cleanedCount++;
                    debugLog(`清理无效分支缓存: ${cachedBranch} -> ${cache[cachedBranch]}`);
                }
            });

            if (cleanedCount > 0) {
                localStorage.setItem(cacheKey, JSON.stringify(newCache));
                debugLog(`缓存清理完成，共清理 ${cleanedCount} 个无效分支`);
            } else {
                debugLog('无需清理，所有缓存分支仍然有效');
            }

            // 同时清理最新构建分支记录，如果它不在当前可用分支列表中
            const lastBuildBranch = getLastBuildBranch();
            if (lastBuildBranch && !availableBranches.includes(lastBuildBranch)) {
                const lastBuildBranchKey = getLastBuildBranchKey();
                localStorage.removeItem(lastBuildBranchKey);
                debugLog(`清理无效的最新构建分支记录: ${lastBuildBranch}`);
            }
        } catch (e) {
            errorLog('清理缓存失败:', e);
        }
    }

    // 查找包含特定文本的元素
    function findElementByText(text, selectors = ['button', '.el-button']) {
        for (let selector of selectors) {
            const elements = document.querySelectorAll(selector);
            for (let element of elements) {
                if (element.textContent && element.textContent.trim().includes(text)) {
                    return element;
                }
            }
        }
        return null;
    }

    // 等待元素出现
    function waitForElement(selector, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                const element = document.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`元素未找到: ${selector}`));
                } else {
                    setTimeout(check, 100);
                }
            }

            check();
        });
    }

    // 等待包含特定文本的元素出现
    function waitForElementByText(text, selectors, timeout = 10000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                const element = findElementByText(text, selectors);
                if (element) {
                    resolve(element);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error(`包含文本"${text}"的元素未找到`));
                } else {
                    setTimeout(check, 100);
                }
            }

            check();
        });
    }

    // 等待Vue组件加载
    function waitForVueComponent(element, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();

            function check() {
                if (element && element.__vue__) {
                    resolve(element.__vue__);
                } else if (Date.now() - startTime > timeout) {
                    reject(new Error('Vue组件未加载'));
                } else {
                    setTimeout(check, 100);
                }
            }

            check();
        });
    }

    // 为运行按钮添加聚焦提示
    function addRunButtonFocusHint(runButton) {
        if (!runButton || runButton.dataset.hintAdded) {
            return;
        }
        runButton.dataset.hintAdded = 'true';

        const hintId = 'run-button-hint-span';
        let hintElement = document.getElementById(hintId);

        if (!hintElement) {
            hintElement = document.createElement('span');
            hintElement.id = hintId;
            hintElement.className = 'run-button-hint';
            hintElement.textContent = '使用回车/Enter可直接构建';
            runButton.parentNode.insertBefore(hintElement, runButton.nextSibling);
        }

        const showHint = () => {
            hintElement.style.opacity = '1';
        };

        const hideHint = () => {
            hintElement.style.opacity = '0';
        };

        runButton.addEventListener('focus', showHint);
        runButton.addEventListener('blur', hideHint);

        observers.push({
            disconnect: () => {
                runButton.removeEventListener('focus', showHint);
                runButton.removeEventListener('blur', hideHint);
                if (hintElement && hintElement.parentElement) {
                    hintElement.remove();
                }
                if (runButton) {
                    delete runButton.dataset.hintAdded;
                }
            }
        });

        debugLog('已为运行按钮添加聚焦提示');
    }

    // 检查是否需要自动聚焦运行按钮
    function checkAndFocusRunButton() {
        try {
            // 延迟检查，确保选择值已经设置
            setTimeout(() => {
                const branchSelectInput = document.querySelector('input[placeholder*="请选择代码分支"]');
                const envSelectInput = document.querySelector('input[placeholder*="请选择环境"]');
                
                if (branchSelectInput && envSelectInput) {
                    const branchSelectContainer = branchSelectInput.closest('.el-select');
                    const envSelectContainer = envSelectInput.closest('.el-select');
                    
                    if (branchSelectContainer && envSelectContainer) {
                        const branchSelectVue = branchSelectContainer.__vue__;
                        const envSelectVue = envSelectContainer.__vue__;
                        
                        // 检查是否都已选择
                        if (branchSelectVue && envSelectVue && branchSelectVue.value && envSelectVue.value) {
                            const runButton = findElementByText('运行', ['button', '.el-button']);
                            if (runButton) {
                                runButton.focus();
                                debugLog('自动聚焦运行按钮');
                            }
                        }
                    }
                }
            }, 300);
        } catch (error) {
            errorLog('检查并聚焦运行按钮失败:', error);
        }
    }

    // 自动选择环境
    function autoSelectEnvironment(envSelectVue, envId) {
        try {
            // 防止重复选择相同环境
            if (lastSelectedEnv === envId) {
                debugLog(`环境 ${envId} 已经选择过，跳过重复选择`);
                return;
            }

            // 检查环境选项是否存在
            const envOptions = envSelectVue.options || [];
            const envExists = envOptions.some(option => option.value === envId);

            if (envExists) {
                // 记录本次选择的环境
                lastSelectedEnv = envId;
                
                // 获取环境选择器的DOM元素
                const envSelectInput = document.querySelector('input[placeholder*="请选择环境"]');
                const envSelectContainer = envSelectInput ? envSelectInput.closest('.el-select') : null;

                // 使用多种方式尝试设置值
                setTimeout(() => {
                    // 方式1: 直接设置value并触发事件
                    envSelectVue.$emit('input', envId);

                    // 方式2: 如果有setValue方法
                    if (typeof envSelectVue.setValue === 'function') {
                        envSelectVue.setValue(envId);
                    }

                    // 方式3: 直接修改绑定的数据
                    if (envSelectVue.value !== undefined) {
                        envSelectVue.value = envId;
                    }

                    // 方式4: 触发change事件
                    envSelectVue.$emit('change', envId);

                    debugLog(`自动选择环境: ${envId}`);

                    // 显示匹配成功动画
                    if (envSelectContainer) {
                        showMatchedAnimation(envSelectContainer);
                    }

                    // 检查是否需要自动聚焦运行按钮
                    checkAndFocusRunButton();
                }, 200);
            } else {
                debugLog('缓存的环境ID不存在于当前选项中:', envId);
            }
        } catch (error) {
            errorLog('自动选择环境失败:', error);
        }
    }

    // 处理分支变化的统一函数（带防重复逻辑）
    function handleBranchChange(branchValue, source = 'unknown') {
        const now = Date.now();

        // 如果是自动选择触发的，且来源是$watch，则忽略
        if (isAutoSelecting && source === '$watch') {
            debugLog(`忽略自动选择期间的$watch触发:`, branchValue);
            return;
        }

        // 防重复和防抖：相同分支且时间间隔小于1500ms则忽略
        if (lastHandledBranch === branchValue && now - lastHandleTime < 1500) {
            debugLog(`忽略重复的分支变化 (${source}):`, branchValue);
            return;
        }

        // 如果是自动选择触发的，使用更短的防抖时间
        const debounceTime = isAutoSelecting ? 500 : 1500;
        if (lastHandledBranch === branchValue && now - lastHandleTime < debounceTime) {
            debugLog(`忽略重复的分支变化 (${source}):`, branchValue);
            return;
        }

        lastHandledBranch = branchValue;
        lastHandleTime = now;

        debugLog(`分支选择变化 (${source}):`, branchValue);

        const cache = getBindingCache();
        const cachedEnvId = cache[branchValue];

        if (cachedEnvId) {
            debugLog(`找到缓存的环境ID: ${cachedEnvId}`);
            // 延迟获取envSelectVue，确保在当前执行上下文中获取
            setTimeout(() => {
                const envSelectInput = document.querySelector('input[placeholder*="请选择环境"]');
                if (envSelectInput) {
                    const envSelectContainer = envSelectInput.closest('.el-select');
                    if (envSelectContainer && envSelectContainer.__vue__) {
                        autoSelectEnvironment(envSelectContainer.__vue__, cachedEnvId);
                    }
                }
            }, 100);
        } else {
            debugLog(`没有找到分支 ${branchValue} 的缓存环境`);
            // 即使没有缓存的环境，也要检查是否需要聚焦运行按钮
            checkAndFocusRunButton();
        }
    }

    // 清理函数
    function cleanup() {
        // 清理所有观察者
        observers.forEach(observer => {
            if (observer.disconnect) {
                observer.disconnect();
            }
        });
        observers = [];

        // 重置状态
        lastHandledBranch = null;
        lastHandleTime = 0;
        isInitialized = false;
        isAutoSelecting = false;
        autoSelectInProgress = false;
        hasAutoSelectedBranch = false;
        lastSelectedEnv = null;
        debugLog('已清理脚本资源和状态');
    }

    // 检查是否为目标页面
    function isTargetPage() {
        // 检查URL路径是否匹配
        const url = location.href;
        const isCorrectPath = url.includes('#/myApp/buildPublish/rd');
        const hasAppNid = getAppNidFromUrl(url) !== null;
        const hasTargetElements = document.querySelector('input[placeholder*="请选择代码分支"]') !== null;

        debugLog('页面检查:', {
            url,
            isCorrectPath,
            hasAppNid,
            hasTargetElements,
            appNid: getAppNidFromUrl(url)
        });

        return isCorrectPath && hasAppNid && hasTargetElements;
    }

    // 主要逻辑
    async function init() {
        // 如果正在初始化，则直接返回，防止并发执行
        if (isInitializing) {
            debugLog('正在初始化中，跳过本次触发');
            return;
        }
        isInitializing = true;

        try {
            // 更新当前appNid
            currentAppNid = getAppNidFromUrl();

            // 如果已经初始化过，先清理
            if (isInitialized) {
                cleanup();
            }

            // 检查是否为目标页面
            if (!isTargetPage()) {
                debugLog('不是目标页面，跳过初始化');
                return;
            }

            debugLog(`开始初始化油猴脚本，当前appNid: ${currentAppNid}`);

            // 注入CSS样式
            injectStyles();

            // 等待页面元素加载
            const branchSelectInput = await waitForElement('input[placeholder*="请选择代码分支"]');
            const envSelectInput = await waitForElement('input[placeholder*="请选择环境"]');
            const runButton = await waitForElementByText('运行', ['button', '.el-button']);

            // 为运行按钮添加聚焦提示
            addRunButtonFocusHint(runButton);

            debugLog('页面元素已找到');

            // 获取选择器的容器元素
            const branchSelectContainer = branchSelectInput.closest('.el-select');
            const envSelectContainer = envSelectInput.closest('.el-select');

            if (!branchSelectContainer || !envSelectContainer) {
                throw new Error('无法找到选择器容器');
            }

            // 获取Vue组件实例
            const branchSelectVue = await waitForVueComponent(branchSelectContainer);
            const envSelectVue = await waitForVueComponent(envSelectContainer);

            debugLog('Vue组件实例已获取');
            debugLog('分支选择器Vue实例:', branchSelectVue);
            debugLog('环境选择器Vue实例:', envSelectVue);

            // 清理无效的缓存分支
            cleanInvalidCacheBranches(branchSelectVue);

            // 检查并自动选择最新构建分支（带重试机制）
            autoSelectLastBuildBranchWithRetry(branchSelectVue);

            // 使用Vue的$watch监听数据变化
            if (branchSelectVue.$watch) {
                const unwatch = branchSelectVue.$watch('value', function(newValue, oldValue) {
                    if (newValue && newValue !== oldValue) {
                        handleBranchChange(newValue, '$watch');
                    }
                });
                observers.push({ disconnect: unwatch });
            }

            // 监听环境选择变化，用于自动聚焦运行按钮
            if (envSelectVue.$watch) {
                const unwatchEnv = envSelectVue.$watch('value', function(newValue, oldValue) {
                    if (newValue && newValue !== oldValue) {
                        debugLog(`环境选择变化: ${newValue}`);
                        // 检查是否需要自动聚焦运行按钮
                        checkAndFocusRunButton();
                    }
                });
                observers.push({ disconnect: unwatchEnv });
            }

            // 监听运行按钮点击
            const runButtonClickHandler = function() {
                debugLog('运行按钮被点击');

                // 延迟获取当前选择的值，确保请求发送前获取
                setTimeout(() => {
                    const currentBranch = branchSelectVue.value;
                    const currentEnvId = envSelectVue.value;

                    debugLog('当前选择:', { branch: currentBranch, envId: currentEnvId, appNid: currentAppNid });

                    if (currentBranch && currentEnvId) {
                        // 保存新的绑定关系
                        saveBindingCache(currentBranch, currentEnvId);
                        // 保存最新构建分支
                        saveLastBuildBranch(currentBranch);
                    } else {
                        debugLog('当前分支或环境未选择:', { branch: currentBranch, envId: currentEnvId });
                    }
                }, 500);
            };

            runButton.addEventListener('click', runButtonClickHandler);
            observers.push({
                disconnect: () => runButton.removeEventListener('click', runButtonClickHandler)
            });

            isInitialized = true;
            debugLog(`脚本初始化完成，应用: ${currentAppNid}`);

        } catch (error) {
            errorLog('油猴脚本初始化失败:', error);
            cleanup(); // 失败时也应该清理
        } finally {
            isInitializing = false; // 确保在最后释放锁
            debugLog('初始化流程结束');
        }
    }

    // 创建一个防抖版的init函数
    const debouncedInit = debounce(init, 300);

    // 监听路由变化
    function setupRouteListener() {
        const handleRouteChange = () => {
            // 使用setTimeout确保在URL完全更新后再执行
            setTimeout(() => {
                if (location.href !== lastUrl) {
                    lastUrl = location.href;
                    debugLog('检测到URL变化:', lastUrl);
                    debouncedInit();
                }
            }, 100);
        };

        // 监听popstate事件（浏览器前进后退）
        window.addEventListener('popstate', handleRouteChange);

        // 监听hashchange事件
        window.addEventListener('hashchange', handleRouteChange);

        // 拦截pushState和replaceState
        const originalPushState = history.pushState;
        history.pushState = function() {
            const result = originalPushState.apply(this, arguments);
            handleRouteChange();
            return result;
        };

        const originalReplaceState = history.replaceState;
        history.replaceState = function() {
            const result = originalReplaceState.apply(this, arguments);
            handleRouteChange();
            return result;
        };

        // 使用MutationObserver监听DOM变化
        const observer = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                if (mutation.type === 'childList') {
                    for (const node of mutation.addedNodes) {
                        if (node.nodeType === 1 && node.querySelector('input[placeholder*="请选择代码分支"]')) {
                            debugLog('检测到目标元素出现，准备初始化');
                            debouncedInit();
                            return; // 找到后即可返回
                        }
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 页面卸载时清理
        window.addEventListener('beforeunload', cleanup);
    }

    // 启动脚本
    function start() {
        debugLog('脚本启动中...');

        // 设置路由监听
        setupRouteListener();

        // 首次加载时尝试初始化
        debouncedInit();
    }

    // 启动脚本
    start();
})();
