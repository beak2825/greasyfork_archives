// ==UserScript==
// @name         Auto Read (Linux.do Only)
// @namespace    http://tampermonkey.net/
// @version      2.1.0
// @description  自动刷阅读回复，仅支持Linux.do社区
// @author       XinSong(https://blog.warhut.cn)自
// @match        https://linux.do/*
// @grant        unsafeWindow
// @license      MIT
// @icon         https://www.google.com/s2/favicons?domain=linux.do
// @require      https://cdn.tailwindcss.com
// @downloadURL https://update.greasyfork.org/scripts/538431/Auto%20Read%20%28Linuxdo%20Only%29.user.js
// @updateURL https://update.greasyfork.org/scripts/538431/Auto%20Read%20%28Linuxdo%20Only%29.meta.js
// ==/UserScript==

(() => {
    'use strict';
    // 挂载全局对象（避免作用域污染）
    const { document, window } = unsafeWindow;

    // 配置中心（常量集中管理）
    const CONFIG = {
        BASE_URL: 'https://linux.do',          // 基础URL
        LIKE_LIMIT: 20,                      // 每日点赞上限
        MAX_RETRIES: 3,                      // 错误页面最大重试次数
        SCROLL_OPTIONS: {                    // 滚动配置
            speed: 50,                       // 滚动速度（像素/次）
            interval: 100,                   // 滚动间隔（毫秒）
        },
        LIKE_INTERVAL: {                     // 点赞间隔配置
            min: 2000,                       // 最小间隔（毫秒）
            max: 5000                        // 最大间隔（毫秒）
        },
        UPDATE_INTERVAL: 500                // 状态更新间隔（毫秒）
    };

    /**
     * 状态管理类
     * 负责本地存储管理和状态初始化
     */
    class StateManager {
        constructor() {
            this.initState();          // 初始化默认状态
            this.loadFromStorage();    // 从本地存储加载状态
        }

        // 初始化默认状态
        initState() {
            this.isReading = false;        // 是否正在阅读
            this.isLiking = false;         // 是否启用自动点赞
            this.errorRetries = 0;         // 错误页面重试次数
            this.unseenHrefs = [];         // 未读帖子链接列表
            this.currentTask = null;       // 当前任务（导航/滚动等）
            this.scrollTimer = null;       // 滚动定时器
        }

        // 从localStorage加载状态
        loadFromStorage() {
            // 解析存储的状态对象，默认空对象
            const state = JSON.parse(localStorage.getItem('autoReadState')) || {};
            // 合并默认状态与存储状态
            Object.assign(this, {
                isReading: !!state.isReading,        // 布尔值转换
                isLiking: state.isLiking ?? false,    // 安全默认值
                errorRetries: state.errorRetries || 0,
                unseenHrefs: state.unseenHrefs || []
            });
            this.resetLikeCounter();  // 重置每日点赞计数
        }

        // 保存状态到localStorage
        saveToStorage() {
            localStorage.setItem('autoReadState', JSON.stringify(this));
        }

        // 每日点赞计数重置（超过24小时）
        resetLikeCounter() {
            const lastUpdate = localStorage.getItem('likeTimestamp');
            if (lastUpdate && Date.now() - +lastUpdate > 86400000) { // 86400000ms = 24小时
                localStorage.setItem('likeCount', 0);       // 重置计数
                localStorage.setItem('likeTimestamp', Date.now()); // 更新时间戳
            }
        }
    }

    /**
     * 自动阅读核心类
     * 负责业务逻辑处理和用户交互
     */
    class AutoReader {
        constructor() {
            this.state = new StateManager();  // 初始化状态管理器
            this.init();                      // 初始化脚本
        }

        // 初始化入口
        init() {
            window.addEventListener('load', () => {
                this.createControlPanel();   // 创建控制面板
                this.handleRoute();          // 处理当前路由
                setInterval(() => this.updateStatus(), CONFIG.UPDATE_INTERVAL); // 定期更新状态
            });
        }

        /**
         * 路由处理
         * 根据当前页面路径执行不同逻辑
         */
        handleRoute() {
            if (window.location.pathname === '/unseen') { // 未读页面
                this.fetchUnseenLinks();  // 获取未读链接
            } else if (this.state.isReading) { // 阅读中状态
                this.processCurrentPage();  // 处理当前页面内容
            }
        }

        /**
         * 获取未读帖子链接
         */
        fetchUnseenLinks() {
            // 使用CSS选择器获取所有未读帖子链接
            const links = Array.from(document.querySelectorAll('a.title.raw-link.raw-topic-link'))
                .map(link => link.getAttribute('href'));  // 提取链接

            if (links.length) { // 存在未读链接
                this.state.unseenHrefs = links;            // 更新状态
                this.state.saveToStorage();                // 保存到本地
                this.openNextTopic();                     // 打开下一个帖子
            } else { // 无未读内容
                alert('未发现未读内容');
            }
        }

        /**
         * 打开下一个帖子
         */
        openNextTopic() {
            const nextUrl = this.state.unseenHrefs.shift(); // 取出队列中第一个链接
            if (nextUrl) { // 存在有效链接
                this.state.currentTask = 'navigating';      // 设置任务状态为导航
                this.state.saveToStorage();                // 保存状态
                window.location.href = `${CONFIG.BASE_URL}${nextUrl}`; // 跳转页面
            } else { // 链接队列已空
                this.navigateToUnseen();                    // 回到未读页面重新获取
            }
        }

        /**
         * 处理当前页面内容（阅读逻辑）
         */
        processCurrentPage() {
            if (this.isErrorPage()) return this.handleError(); // 先检查错误页面

            // 判断是不是帖子详情页，如果不是，打开第一个未读链接
            if (!document.querySelector('article[data-post-id]')) {
                this.openNextTopic();
                return;
            }
            // 判断是否存在返回上次阅读的按钮
            const backButton = document.querySelector('[title="返回上一个未读帖子"]');
            if (backButton) {
                backButton.click(); // 点击按钮返回
            }

            // 获取当前页面所有帖子
            this.state.posts = Array.from(document.querySelectorAll('article[data-post-id]'));
            this.state.currentTask = 'scrolling';             // 设置任务状态为滚动
            this.startSmoothScroll();                         // 启动平滑滚动
            if (this.state.isLiking) this.runAutoLike();       // 启用点赞则执行点赞逻辑
        }

        /**
         * 启动平滑滚动
         */
        startSmoothScroll() {
            if (this.state.scrollTimer) return; // 避免重复启动

            // 记录上一次滚动时间
            let lastScrollTime = 0;
            // 滚动速度（像素/帧）
            const scrollSpeed = CONFIG.SCROLL_OPTIONS.speed;

            // 使用requestAnimationFrame实现平滑滚动
            const scrollStep = () => {
                let timestamp = performance.now(); // 获取当前时间戳

                // 控制滚动频率，防止过快
                if (timestamp - lastScrollTime < CONFIG.SCROLL_OPTIONS.interval) {
                    this.state.scrollTimer = requestAnimationFrame(scrollStep);
                    return;
                }
                lastScrollTime = timestamp; // 更新上一次滚动时间

                window.scrollBy(0, scrollSpeed); // 执行滚动

                // 判断是否阅读完毕
                const divReplies = document.querySelector('div.timeline-replies'); // 查找底部元素
                if (divReplies) {
                    const parts = divReplies.textContent.trim().replace(/[^0-9/]/g, '').split('/');
                    // 判断是否相等（如：1/1），表示已到达底部
                    if (parts.length >= 2 && parts[0] === parts[1]) {
                        this.stopScrolling();       // 停止滚动
                        this.openNextTopic();       // 打开下一个帖子
                        return;
                    }
                }

                this.markReadPosts();           // 标记已读帖子
                this.state.scrollTimer = requestAnimationFrame(scrollStep); // 继续下一帧
            };

            // 开始滚动动画
            this.state.scrollTimer = requestAnimationFrame(scrollStep);
        }

        /**
         * 停止滚动
         */
        stopScrolling() {
            if (this.state.scrollTimer) {
                cancelAnimationFrame(this.state.scrollTimer); // 取消动画帧
                this.state.scrollTimer = null;         // 重置定时器引用
            }
            this.state.currentTask = null;         // 清除当前任务
        }

        /**
         * 标记可见帖子为已读
         */
        markReadPosts() {
            document.querySelectorAll('article[data-post-id]').forEach(post => {
                const rect = post.getBoundingClientRect(); // 获取元素位置信息
                // 元素完全在视口内时并且是已读状态，标记为已读，
                if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
                    post.classList.add('read-state'); // 添加已读类
                }
            });
        }

        /**
         * 自动点赞逻辑（递归调用实现随机间隔）
         */
        runAutoLike() {
            const likeCount = parseInt(localStorage.getItem('likeCount')) || 0; // 当前点赞数
            if (likeCount >= CONFIG.LIKE_LIMIT) return; // 达到上限则停止

            // 查找未点赞的按钮（优先使用明确的选择器）
            const likeButton = document.querySelector('.discourse-reactions-reaction-button:not(.liked)');
            if (likeButton) {
                likeButton.click(); // 模拟点击
                // 更新点赞计数和时间戳
                localStorage.setItem('likeCount', likeCount + 1);
                localStorage.setItem('likeTimestamp', Date.now());
                // 生成随机间隔（递归调用实现链式延迟）
                const randomDelay = Math.random() * (CONFIG.LIKE_INTERVAL.max - CONFIG.LIKE_INTERVAL.min) + CONFIG.LIKE_INTERVAL.min;
                setTimeout(() => this.runAutoLike(), randomDelay);
            }
        }

        /**
         * 检测是否为错误页面
         * @returns {boolean} 是否为404页面
         */
        isErrorPage() {
            return document.title.includes('找不到页面');
        }

        /**
         * 错误页面处理
         */
        handleError() {
            this.state.errorRetries++; // 重试次数加一

            if (this.state.errorRetries > CONFIG.MAX_RETRIES) { // 超过最大重试次数
                this.resetState();                             // 重置所有状态
                return;
            }
            this.openNextTopic(); // 尝试打开下一个帖子
        }

        /**
         * 重置所有状态（用于错误处理或用户重置）
         */
        resetState() {
            this.state.initState(); // 恢复初始状态
            this.state.saveToStorage(); // 保存到本地
        }

        /**
         * 创建控制面板
         */
        createControlPanel() {
            const controls = document.createElement('div'); // 容器元素
            controls.className = 'fixed bottom-4 left-4 z-50 bg-white flex flex-col gap-2'; // 样式

            // 创建阅读控制按钮
            this.createControlButton(controls, 'openRead', '开始阅读', '停止阅读', () => {
                this.state.isReading = !this.state.isReading; // 切换阅读状态
                this.state.saveToStorage();                   // 保存状态
                this.state.isReading ? this.processCurrentPage() : this.stopScrolling();// 根据状态执行相应操作
                this.updateStatus();// 更新状态
                document.getElementById('openRead').textContent = this.state.isReading ? '停止阅读' : '开始阅读';// 更新按钮文本
            });

            // 创建点赞控制按钮
            this.createControlButton(controls, 'openUP', '启用点赞', '禁用点赞', () => {
                this.state.isLiking = !this.state.isLiking; // 切换点赞状态
                this.state.saveToStorage();                 // 保存状态
                this.updateStatus(); // 更新状态
                document.getElementById('openUP').textContent = this.state.isLiking ? '禁用点赞' : '启用点赞';// 更新按钮文本
            });

            // 创建重置列表按钮
            this.createControlButton(controls, 'resetList', '重置列表', '重置列表', () => {
                if (confirm('确定要重置未读列表吗？')) { // 确认提示
                    this.resetState();                     // 重置状态
                    alert('未读列表已重置');
                }
            });

            // 创建状态显示面板
            const status = document.createElement('div'); // 状态面板
            status.id = 'auto-read-status'; // 唯一ID
            // 在按钮的上面显示，并且在左侧顶上
            status.className = 'fixed top-20 left-5 z-9999 bg-white shadow-lg rounded-lg p-2 flex flex-col gap-1';
            controls.appendChild(status); // 添加到控制面板
            this.updateStatus(); // 初始化状态显示

            document.body.appendChild(controls); // 添加到页面
        }

        /**
         * 创建通用控制按钮
         * @param {HTMLElement} parent - 父容器
         * @param {string} id - 唯一ID
         * @param {string} startText - 初始文本
         * @param {string} stopText - 激活后文本
         * @param {Function} onClick - 点击事件处理函数
         */
        createControlButton(parent, id, startText, stopText, onClick) {
            const button = document.createElement('button'); // 创建按钮元素
            // 基础样式
            button.id = id;
            button.className = 'px-4 py-2 rounded-lg shadow-lg hover:scale-105 transition-all duration-300 bg-white text-black font-bold';
            // 初始文本（根据当前状态判断）
            button.textContent = this.state.isReading && startText === '开始阅读' ? stopText : startText;
            button.addEventListener('click', onClick); // 绑定点击事件
            parent.appendChild(button); // 添加到父容器
        }

        /**
         * 更新状态显示面板
         */
        updateStatus() {
            const status = document.getElementById('auto-read-status');
            if (!status) return; // 面板不存在时返回

            const likeCount = parseInt(localStorage.getItem('likeCount')) || 0; // 获取点赞计数
            // 使用模板字符串更新面板内容
            status.innerHTML = `
                <div class="font-bold text-sm">
                    阅读状态：${this.state.isReading ? '<span class="text-green-600">运行中</span>' : '<span class="text-red-600">已停止</span>'}<br />
                    点赞状态：${this.state.isLiking ? '<span class="text-green-600">启用</span>' : '<span class="text-red-600">禁用</span>'}<br />
                    今日点赞：${likeCount}/${CONFIG.LIKE_LIMIT}<br />
                    剩余帖子：${this.state.unseenHrefs.length}<br />
                    错误重试：<span class="text-red-600">${this.state.errorRetries}/${CONFIG.MAX_RETRIES}</span>
                </div>
            `;
        }

        /**
         * 导航到未读页面
         */
        navigateToUnseen() {
            window.location.href = `${CONFIG.BASE_URL}/unseen`; // 跳转URL
        }
    }

    // 初始化脚本入口
    new AutoReader();
})();