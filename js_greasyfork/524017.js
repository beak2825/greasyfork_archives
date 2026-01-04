// ==UserScript==
// @name         linuxdo保活
// @namespace    http://tampermonkey.net/
// @version      0.1.10
// @description  linuxdo自动浏览帖子，自动点赞
// @author       zhcf1ess
// @match        https://linux.do/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @icon         https://linux.do/uploads/default/original/3X/9/d/9dd49731091ce8656e94433a26a3ef36062b3994.png
// @namespace    https://github.com/zhsama/linuxdo
// @supportURL   https://github.com/zhsama/linuxdo
// @homepageURL  https://github.com/zhsama/linuxdo
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/524017/linuxdo%E4%BF%9D%E6%B4%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/524017/linuxdo%E4%BF%9D%E6%B4%BB.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 配置对象
    const config = {
        scrollInterval: 1500, // 滚动间隔(毫秒)
        scrollStep: 800, // 每次滚动的像素
        viewCountThreshold: 500, // 浏览量阈值，超过此值才会点赞
        scrollDuration: 30, // 滚动持续时间（秒）
        maxTopics: 100, // 总浏览帖子数量，达到即停
        maxRunTime: 30, // 总运行时间（分钟），达到即停
        urls: {
            base: 'https://linux.do',
            new: 'https://linux.do/new',
            connect: 'https://connect.linux.do'
        },
        // iframe 相关配置
        iframe: {
            width: '325px',  // iframe 宽度
            height: '500px', // iframe 高度
            top: '64px',     // 距离顶部距离
            left: '1px',     // 距离左侧距离
            position: 'fixed',
            zIndex: '9999'
        },
        // 日志配置
        logging: {
            enabled: true, // 是否启用日志
            level: {
                error: true,
                info: true,
                debug: false
            }
        }
    };

    // 添加日志工具
    const logger = {
        error: (...args) => {
            if (config.logging.enabled && config.logging.level.error) {
                console.error(...args);
            }
        },
        info: (...args) => {
            if (config.logging.enabled && config.logging.level.info) {
                console.log(...args);
            }
        },
        debug: (...args) => {
            if (config.logging.enabled && config.logging.level.debug) {
                console.debug(...args);
            }
        }
    };

    // 统计对象
    const stats = {
        totalViews: 0,        // 总浏览数
        totalLikes: 0,        // 总点赞数
        sessionViews: 0,      // 本次会话浏览数
        sessionLikes: 0,      // 本次会话点赞数
        startTime: Date.now() // 会话开始时间
    };

    // 加载保存的统计数据
    function loadStats() {
        const savedStats = GM_getValue('linuxdoStats', null);
        if (savedStats) {
            stats.totalViews = savedStats.totalViews || 0;
            stats.totalLikes = savedStats.totalLikes || 0;
        }
        logger.info('📊 加载历史统计数据：');
        logger.info(`📈 总浏览数：${stats.totalViews}`);
        logger.info(`💖 总点赞数：${stats.totalLikes}`);
    }

    // 保存统计数据
    function saveStats() {
        GM_setValue('linuxdoStats', {
            totalViews: stats.totalViews,
            totalLikes: stats.totalLikes
        });
    }

    // 打印统计信息
    function printStats() {
        const runTime = Math.floor((Date.now() - stats.startTime) / 1000);
        const hours = Math.floor(runTime / 3600);
        const minutes = Math.floor((runTime % 3600) / 60);
        const seconds = runTime % 60;

        logger.info('\n📊 统计信息');
        logger.info('-------------------');
        logger.info(`🕒 运行时间：${hours}时${minutes}分${seconds}秒`);
        logger.info(`👀 本次浏览：${stats.sessionViews}帖`);
        logger.info(`❤️ 本次点赞：${stats.sessionLikes}次`);
        logger.info(`📈 总浏览数：${stats.totalViews}帖`);
        logger.info(`💖 总点赞数：${stats.totalLikes}次`);
        logger.info('-------------------\n');
    }


    // 开关状态管理
    function getSwitchState() {
        return GM_getValue('linuxdoHelperEnabled', false);
    }

    function toggleSwitch() {
        const currentState = getSwitchState();
        GM_setValue('linuxdoHelperEnabled', !currentState);

        if (!currentState) {
            window.location.href = config.urls.base
        }
        logger.info(`Linuxdo助手已${!currentState ? '启用' : '禁用'}`);
    }

    // 创建开关图标
    function createSwitchIcon() {
        const iconLi = document.createElement('li');
        iconLi.className = 'header-dropdown-toggle';
        const iconLink = document.createElement('a');
        iconLink.href = 'javascript:void(0)';
        iconLink.className = 'btn no-text icon btn-flat';
        iconLink.title = getSwitchState() ? '停止Linuxdo助手' : '启动Linuxdo助手';
        iconLink.tabIndex = 0;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('class', 'fa d-icon d-icon-rocket svg-icon prefix-icon svg-string');
        svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        const use = document.createElementNS('http://www.w3.org/2000/svg', 'use');
        use.setAttribute('href', getSwitchState() ? '#pause' : '#play');
        svg.appendChild(use);
        iconLink.appendChild(svg);
        iconLi.appendChild(iconLink);

        // 点击事件
        iconLink.addEventListener('click', () => {
            toggleSwitch();
            const currentState = getSwitchState();
            use.setAttribute('href', currentState ? '#pause' : '#play');
            iconLink.title = currentState ? '停止Linuxdo助手' : '启动Linuxdo助手';
            iconLink.classList.toggle('active', currentState);
        });

        // 找到聊天图标并插入
        const chatIconLi = document.getElementById('search-button').parentElement;
        if (chatIconLi) {
            chatIconLi.parentNode.insertBefore(iconLi, chatIconLi.nextSibling);
        } else {
            logger.error("【错误】未找到按钮！")
        }
    }

    // 检查并执行点赞
    async function checkAndLike(targetWindow = window) {
        try {
            // 获取浏览量
            const viewsElement = targetWindow.document.querySelector('.list-view-count');
            if (!viewsElement) return;

            const viewCount = parseInt(viewsElement.textContent.replace(/,/g, ''));
            if (viewCount <= config.viewCountThreshold) return;

            // 查找点赞按钮
            const likeButton = targetWindow.document.querySelector('button.btn-toggle-reaction-like');
            if (!likeButton) {
                logger.info('未找到点赞按钮');
                return;
            }

            // 检查是否已经点赞
            if (likeButton.title.includes('删除此 heart 回应')) {
                logger.info('该帖子已点赞，跳过点赞操作。');
                return;
            }

            // 执行点赞
            likeButton.click();
            logger.info('点赞帖子成功');

            // 更新统计
            stats.sessionLikes++;
            stats.totalLikes++;
            saveStats();

        } catch (error) {
            logger.error('点赞操作失败:', error);
        }
    }

    // 获取帖子列表
    async function getTopicsList() {
        const topics = document.querySelectorAll('#list-area .title');
        logger.info(`共找到 ${topics.length} 个帖子`);

        const topicsList = [];
        for (let i = 0; i < topics.length; i++) {
            const topic = topics[i];
            const parentElement = topic.closest('tr');

            // 检查是否是置顶帖
            const isPinned = parentElement.querySelector('.topic-statuses .pinned');
            if (isPinned) {
                logger.debug(`跳过置顶的帖子：${topic.textContent.trim()}`);
                continue;
            }

            // 获取浏览量
            const viewsElement = parentElement.querySelector('.num.views .number');
            const viewsTitle = viewsElement.getAttribute('title');
            const viewsCount = parseInt(viewsTitle.split('此话题已被浏览 ')[1].split(' 次')[0].replace(/,/g, ''));

            topicsList.push({
                title: topic.textContent.trim(),
                url: topic.href,
                views: viewsCount
            });
        }
        return topicsList;
    }

    // 浏览单个帖子
    async function browseTopic(topic) {
        logger.info(`打开帖子：${topic.title}`);

        // 更新统计
        stats.sessionViews++;
        stats.totalViews++;
        saveStats();

        // 创建一个隐藏的 iframe 来加载帖子
        const iframe = document.createElement('iframe');
        Object.assign(iframe.style, config.iframe);

        // 添加事件监听器来阻止iframe中的history变化影响主页面
        window.addEventListener('popstate', function (event) {
            event.stopPropagation();
        }, true);

        // 直接设置src，但使用随机参数来避免历史记录重复
        iframe.src = `${topic.url}?_t=${Date.now()}`;
        document.body.appendChild(iframe);

        // 等待 iframe 加载完成
        await new Promise(resolve => {
            iframe.onload = resolve;
        });

        // 如果浏览量超过阈值，执行点赞
        if (topic.views > config.viewCountThreshold) {
            logger.info(`📈 当前帖子浏览量为${topic.views}`);
            logger.info(`🥳 当前帖子浏览量大于设定值${config.viewCountThreshold}，开始进行点赞操作`);
            await checkAndLike(iframe.contentWindow);
        }

        // 滚动浏览帖子内容
        await new Promise((resolve) => {
            const startTime = Date.now();
            const scrollInterval = setInterval(() => {
                if (Date.now() - startTime >= config.scrollDuration * 1000) {
                    clearInterval(scrollInterval);
                    // 移除 iframe
                    document.body.removeChild(iframe);
                    // 打印统计信息
                    printStats();
                    resolve();
                    return;
                }
                iframe.contentWindow.scrollBy(0, config.scrollStep);
            }, config.scrollInterval);
        });

        // 等待一段时间确保清理完成
        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // 检查是否需要停止脚本
    function shouldStopScript() {
        // 检查浏览数量
        if (stats.sessionViews >= config.maxTopics) {
            logger.info(`\n🛑 已达到最大浏览数量 ${config.maxTopics} 篇，停止脚本运行`);
            return true;
        }

        // 检查运行时间
        const runTime = (Date.now() - stats.startTime) / 1000;
        if (runTime >= config.maxRunTime * 60) {
            const hours = Math.floor(runTime / 3600);
            const minutes = Math.floor((runTime % 3600) / 60);
            logger.info(`\n🛑 已达到最大运行时间 ${hours}时${minutes}分，停止脚本运行`);
            return true;
        }

        return false;
    }

    // 停止脚本运行
    function stopScript() {
        GM_setValue('linuxdoHelperEnabled', false);
        printStats();
        logger.info('\n✨ 脚本已自动停止运行');
        window.location.href = config.urls.connect;
    }

    // 主要浏览逻辑
    async function browseTopics() {
        try {
            // 获取帖子列表
            const topics = await getTopicsList();

            // 遍历浏览帖子
            if (topics.length > 0) {
                // 随机打乱帖子列表顺序
                const shuffledTopics = topics.sort(() => Math.random() - 0.5);

                // 逐个浏览帖子
                for (const topic of shuffledTopics) {
                    // 检查是否需要停止脚本
                    if (shouldStopScript()) {
                        stopScript();
                        return;
                    }

                    if (!getSwitchState()) {
                        logger.info('脚本已停止');
                        return;
                    }

                    await browseTopic(topic);

                    // 在浏览下一个帖子前等待一段随机时间
                    const waitTime = Math.floor(Math.random() * 3000) + 2000; // 2-5秒
                    await new Promise(resolve => setTimeout(resolve, waitTime));
                }
            }

        } catch (error) {
            logger.error('浏览帖子时出错:', error);
        }
    }

    // 主执行函数
    async function main() {
        createSwitchIcon();
        if (!getSwitchState()) return;

        try {
            // 加载统计数据
            loadStats();

            // 如果在最新帖子页面，开始浏览帖子
            if (window.location.href.includes(config.urls.base)) {
                // 检查是否需要停止脚本
                if (shouldStopScript()) {
                    stopScript();
                    return;
                }
                await browseTopics();
            }
        } catch (error) {
            logger.error('脚本执行出错:', error);
        }
    }

    // 页面加载完成后执行
    if (document.readyState === 'complete') {
        main();
    } else {
        window.addEventListener('load', main);
    }
})();