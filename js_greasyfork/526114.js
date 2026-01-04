// ==UserScript==
// @name         Bilibili-Gender
// @namespace    http://tampermonkey.net/
// @version      0.4.0
// @description  在B站评论区添加性别符号
// @author       pycv
// @icon         https://www.bilibili.com/favicon.ico
// @match        https://www.bilibili.com/video/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/526114/Bilibili-Gender.user.js
// @updateURL https://update.greasyfork.org/scripts/526114/Bilibili-Gender.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // ==================== 全局变量定义 ====================
    
    // 已处理评论ID集合，用于去重
    const processedComments = new Set();
    
    // MutationObserver实例，用于监听DOM变化
    let observer = null;
    
    // 清理定时器，用于定期清理已处理记录
    let cleanupTimer = null;
    
    // 初始化重试计数器
    let initRetryCount = 0;
    
    // 最大重试次数
    const MAX_RETRIES = 20;
    
    // 脚本命名空间，用于避免样式冲突
    const NAMESPACE = 'bili-gender-script';
    
    // 样式ID，使用命名空间确保唯一性
    const STYLE_ID = `${NAMESPACE}-style`;
    
    // 性别元素类名，使用命名空间避免冲突
    const GENDER_CLASS = `${NAMESPACE}-gender`;

    // ==================== 工具函数 ====================

    /**
     * 向Shadow DOM注入CSS样式
     * @param {ShadowRoot} shadowRoot - 目标Shadow DOM根节点
     * @description 该函数会检查样式是否已存在，避免重复注入
     */
    function injectStyle(shadowRoot) {
        if (!shadowRoot) {
            console.warn(`[${NAMESPACE}] injectStyle: shadowRoot为空`);
            return false;
        }
        
        // 检查样式是否已存在
        const existingStyle = shadowRoot.querySelector(`#${STYLE_ID}`);
        if (existingStyle) {
            // 验证样式内容是否正确
            if (existingStyle.textContent.includes(GENDER_CLASS)) {
                return true;
            }
            // 样式内容不正确，移除旧样式
            existingStyle.remove();
        }
        
        // 创建新的样式元素
        const style = document.createElement('style');
        style.id = STYLE_ID;
        style.innerHTML = `
            .${GENDER_CLASS} {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 14px;
                height: 14px;
                border-radius: 50%;
                font-size: 10px;
                color: white;
                margin-right: 5px;
                font-weight: bold;
                padding: 1px;
                box-sizing: border-box;
                transform: rotate(45deg);
                font-family: "Alibaba PuHuiTi 3.0", "PingFang SC", HarmonyOS_Regular, "Helvetica Neue", "Microsoft YaHei", sans-serif;
            }
            .${GENDER_CLASS}.male { background-color: #00AEEC; }
            .${GENDER_CLASS}.female { background-color: #ff6699; }
        `;
        shadowRoot.appendChild(style);
        return true;
    }

    /**
     * 防抖函数，用于优化性能
     * @param {Function} func - 需要防抖的函数
     * @param {number} delay - 延迟时间（毫秒）
     * @returns {Function} 防抖后的函数
     * @description 该函数会在延迟时间内只执行一次，避免频繁触发
     */
    function debounce(func, delay) {
        let timer = null;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => func(...args), delay);
        };
    }

    /**
     * 从评论元素中提取rpid
     * @param {Element} comment - 评论DOM元素
     * @returns {string|null} 评论ID
     */
    function getCommentId(comment) {
        try {
            return comment.__data?.rpid || null;
        } catch (error) {
            console.error(`[${NAMESPACE}] 获取评论ID失败:`, error);
            return null;
        }
    }

    /**
     * 从用户信息中提取性别
     * @param {Element} userInfo - 用户信息DOM元素
     * @returns {string|null} 性别（'男'、'女'或null）
     */
    function getUserGender(userInfo) {
        try {
            const gender = userInfo.__data?.member?.sex;
            
            // 记录性别判断结果，便于调试
            if (!gender) {
                console.debug(`[${NAMESPACE}] 用户未设置性别`);
            } else if (gender !== '男' && gender !== '女') {
                console.debug(`[${NAMESPACE}] 未知性别值: ${gender}`);
            }
            
            return gender === '男' || gender === '女' ? gender : null;
        } catch (error) {
            console.error(`[${NAMESPACE}] 获取用户性别失败:`, error);
            return null;
        }
    }

    // ==================== 核心功能函数 ====================

    /**
     * 处理单个评论，添加性别符号
     * @param {Element} comment - 评论DOM元素
     * @returns {boolean} 是否成功处理
     * @description 该函数会提取评论的性别信息，并在用户名旁添加性别符号
     */
    function processComment(comment) {
        try {
            // 获取评论ID
            const rpid = getCommentId(comment);
            if (!rpid) {
                console.debug(`[${NAMESPACE}] 无法获取评论ID`);
                return false;
            }
            
            // 检查是否已处理
            if (processedComments.has(rpid)) {
                return false;
            }
            
            // 获取用户信息组件
            const userInfo = comment.shadowRoot?.querySelector('#comment')?.shadowRoot?.querySelector('#header > bili-comment-user-info');
            if (!userInfo) {
                console.debug(`[${NAMESPACE}] 无法找到用户信息组件 (rpid: ${rpid})`);
                return false;
            }
            
            // 获取用户性别
            const gender = getUserGender(userInfo);
            if (!gender) {
                console.debug(`[${NAMESPACE}] 用户性别无效 (rpid: ${rpid})`);
                return false;
            }
            
            // 获取信息元素
            const infoElement = userInfo.shadowRoot?.querySelector('#info');
            if (!infoElement) {
                console.debug(`[${NAMESPACE}] 无法找到信息元素 (rpid: ${rpid})`);
                return false;
            }
            
            // 检查是否已添加性别符号
            if (infoElement.querySelector(`.${GENDER_CLASS}`)) {
                console.debug(`[${NAMESPACE}] 已存在性别符号 (rpid: ${rpid})`);
                return false;
            }
            
            // 注入样式
            if (!injectStyle(userInfo.shadowRoot)) {
                console.warn(`[${NAMESPACE}] 样式注入失败 (rpid: ${rpid})`);
                return false;
            }
            
            // 创建性别元素
            const genderElement = document.createElement('span');
            genderElement.className = `${GENDER_CLASS} ${gender === '男' ? 'male' : 'female'}`;
            genderElement.textContent = gender === '男' ? '♂' : '♀';
            genderElement.title = `性别: ${gender}`;
            // 添加脚本标识，避免与其他脚本冲突
            genderElement.dataset.script = NAMESPACE;
            
            // 添加到DOM
            infoElement.appendChild(genderElement);
            
            // 只有成功处理后才添加到已处理列表
            processedComments.add(rpid);
            console.log(`[${NAMESPACE}] 成功添加性别符号 (rpid: ${rpid}, 性别: ${gender})`);
            return true;
        } catch (error) {
            const rpid = getCommentId(comment);
            console.error(`[${NAMESPACE}] 处理评论出错 (rpid: ${rpid}):`, error);
            return false;
        }
    }

    /**
     * 批量处理评论
     * @description 该函数会遍历所有评论并添加性别符号，包含重试机制
     */
    function addGenderSymbols() {
        const commentsContainer = document.querySelector('#commentapp > bili-comments');
        
        // 检查评论区是否存在
        if (!commentsContainer?.shadowRoot) {
            if (initRetryCount < MAX_RETRIES) {
                initRetryCount++;
                console.log(`[${NAMESPACE}] 评论区未加载，${1000}ms后重试 (${initRetryCount}/${MAX_RETRIES})`);
                setTimeout(addGenderSymbols, 1000);
            } else {
                console.warn(`[${NAMESPACE}] 超过最大重试次数，停止尝试`);
            }
            return;
        }
        
        // 获取评论列表
        const commentThreads = commentsContainer.shadowRoot.querySelector('#feed')?.querySelectorAll('bili-comment-thread-renderer');
        if (!commentThreads?.length) {
            if (initRetryCount < MAX_RETRIES) {
                initRetryCount++;
                console.log(`[${NAMESPACE}] 评论列表为空，${500}ms后重试 (${initRetryCount}/${MAX_RETRIES})`);
                setTimeout(addGenderSymbols, 500);
            }
            return;
        }
        
        // 重置重试计数器
        initRetryCount = 0;
        
        // 批量处理评论
        let count = 0;
        commentThreads.forEach(comment => {
            if (processComment(comment)) count++;
        });
        
        if (count > 0) {
            console.log(`[${NAMESPACE}] 处理了 ${count} 条新评论`);
        }
    }

    /**
     * 设置MutationObserver监听器
     * @description 该函数会监听评论区DOM变化，自动为新评论添加性别符号
     */
    function setupObserver() {
        const commentsContainer = document.querySelector('#commentapp > bili-comments');
        
        // 检查评论区是否存在
        if (!commentsContainer?.shadowRoot) {
            if (initRetryCount < MAX_RETRIES) {
                initRetryCount++;
                console.log(`[${NAMESPACE}] 评论区未加载，${1000}ms后重试监听器设置 (${initRetryCount}/${MAX_RETRIES})`);
                setTimeout(setupObserver, 1000);
            } else {
                console.warn(`[${NAMESPACE}] 无法找到评论区，停止尝试`);
            }
            return;
        }
        
        // 断开旧的监听器
        if (observer) {
            observer.disconnect();
        }
        
        // 创建防抖处理函数
        const debouncedProcess = debounce(addGenderSymbols, 300);
        
        // 获取评论列表容器
        const feedElement = commentsContainer.shadowRoot.querySelector('#feed');
        if (!feedElement) {
            console.warn(`[${NAMESPACE}] 无法找到评论列表容器`);
            return;
        }
        
        // 创建MutationObserver
        observer = new MutationObserver((mutations) => {
            const hasNewComments = mutations.some(mutation => 
                mutation.type === 'childList' && 
                Array.from(mutation.addedNodes).some(node => 
                    node.nodeType === 1 && 
                    (node.tagName === 'BILI-COMMENT-THREAD-RENDERER' || node.querySelector?.('bili-comment-thread-renderer'))
                )
            );
            
            if (hasNewComments) {
                debouncedProcess();
            }
        });
        
        // 只监听#feed元素，缩小监听范围
        observer.observe(feedElement, { childList: true, subtree: true });
        console.log(`[${NAMESPACE}] 监听器已启动`);
    }

    /**
     * 清理资源
     * @description 该函数会清理所有资源，包括监听器、定时器和已处理记录
     */
    function cleanup() {
        // 断开监听器
        if (observer) {
            observer.disconnect();
            observer = null;
            console.log(`[${NAMESPACE}] 监听器已断开`);
        }
        
        // 清除定时器
        if (cleanupTimer) {
            clearInterval(cleanupTimer);
            cleanupTimer = null;
            console.log(`[${NAMESPACE}] 清理定时器已停止`);
        }
        
        // 清理已处理记录（保留最近100条，避免快速切换页面时重复处理）
        if (processedComments.size > 0) {
            const items = Array.from(processedComments);
            processedComments.clear();
            items.slice(-100).forEach(id => processedComments.add(id));
            console.log(`[${NAMESPACE}] 已清理已处理记录，保留 ${processedComments.size} 条`);
        }
        
        console.log(`[${NAMESPACE}] 资源已清理`);
    }

    /**
     * 定期清理过多的已处理记录
     * @description 该函数会定期检查并清理过多的已处理记录，保留最近500条
     */
    function periodicCleanup() {
        if (processedComments.size > 1000) {
            const items = Array.from(processedComments);
            processedComments.clear();
            items.slice(-500).forEach(id => processedComments.add(id));
            console.log(`[${NAMESPACE}] 已清理过多的已处理记录，保留 ${processedComments.size} 条`);
        }
    }

    // ==================== 初始化函数 ====================

    /**
     * 初始化脚本
     * @description 该函数会初始化所有功能，包括处理现有评论、设置监听器、启动清理定时器
     */
    async function init() {
        console.log(`[${NAMESPACE}] 初始化开始`);
        
        // 先处理现有评论
        addGenderSymbols();
        
        // 等待评论区加载完成后再设置监听器
        await new Promise(resolve => {
            const checkInterval = setInterval(() => {
                const commentsContainer = document.querySelector('#commentapp > bili-comments');
                if (commentsContainer?.shadowRoot?.querySelector('#feed')) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 100);
        });
        
        // 设置监听器
        setupObserver();
        
        // 启动定期清理定时器（每分钟执行一次）
        cleanupTimer = setInterval(periodicCleanup, 60000);
        console.log(`[${NAMESPACE}] 清理定时器已启动`);
        
        // 监听页面卸载，清理资源
        window.addEventListener('beforeunload', cleanup);
        window.addEventListener('pagehide', cleanup);
        
        console.log(`[${NAMESPACE}] 初始化完成`);
    }

    // ==================== 脚本启动 ====================

    console.log(`[${NAMESPACE}] 脚本已启动 (v0.4.0)`);
    
    // 根据文档加载状态选择启动时机
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
