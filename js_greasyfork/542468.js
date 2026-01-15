// ==UserScript==
// @name         B站小助手
// @namespace    http://tampermonkey.net/
// @version      1.4.2
// @description  B站小助手 是一款Tampermonkey脚本，旨在为您提供更清爽、无广告的B站浏览体验。它能自动过滤广告、推广内容，并允许您根据播放量、视频时长、UP主、标题关键词和分区等多种条件自定义隐藏视频，让您的B站首页和视频页面只显示您真正感兴趣的内容。轻松配置，即刻享受纯净B站！
// @author       Kiyuiro
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/542468/B%E7%AB%99%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/542468/B%E7%AB%99%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function () {
    'use strict';

    class FetchHook {
        constructor() {
            this.targetWindow = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
            this.originalFetch = this.targetWindow.fetch; // 保存原始的 fetch 函数
            this.preFns = []; // 前置处理函数数组
            this.postFns = []; // 后置处理函数数组

            this.hook = this.hook.bind(this);
            this.unhook = this.unhook.bind(this);
            this.addPreFn = this.addPreFn.bind(this);
            this.addPostFn = this.addPostFn.bind(this);
        }

        // 劫持 window.fetch
        hook() {
            if (this.targetWindow.fetch !== this.originalFetch) {
                return;
            }

            // 重新定义真实环境下的 fetch
            this.targetWindow.fetch = async (input, init) => {
                let processedInput = input;
                let processedInit = init;

                // 执行前置处理
                for (const fn of this.preFns) {
                    const result = await fn(processedInput, processedInit);
                    if (result === null || result === undefined) {
                        return Promise.resolve(new Response(null, {status: 204, statusText: 'Hooked'}));
                    }
                    if (Array.isArray(result)) {
                        [processedInput, processedInit] = result;
                    } else {
                        processedInput = result;
                    }
                }

                // 使用 .call(this.targetWindow, ...) 确保 context 正确
                let response;
                try {
                    response = await this.originalFetch.call(this.targetWindow, processedInput, processedInit);
                } catch (error) {
                    throw error;
                }

                // 执行后置处理
                let processedResponse = response;
                for (const fn of this.postFns) {
                    processedResponse = await fn(processedResponse, processedInput, processedInit);
                }
                return processedResponse;
            };
        }

        // 恢复 window.fetch 到原始状态
        unhook() {
            if (this.targetWindow.fetch === this.originalFetch) {
                console.warn('FetchHook: fetch 未被劫持或已恢复，跳过。');
                return;
            }
            this.targetWindow.fetch = this.originalFetch;
            // console.log('FetchHook: 恢复 window.fetch 到原始状态。');
        }

        /**
         * 添加一个请求发送前的处理函数
         * @param {Function} fn - 处理函数，接收 (input, init) 参数，应返回 [newInput, newInit] 或 Promise<[newInput, newInit]>
         * 如果只返回 newInput，则 init 保持不变。
         * 如果返回 null 或 undefined，则中断请求。
         */
        addPreFn(fn) {
            if (typeof fn === 'function') {
                this.preFns.push(fn);
            } else {
                console.warn('FetchHook: addPreFn 接收的参数不是函数。');
            }
        }

        /**
         * 添加一个请求响应后的处理函数
         * @param {Function} fn - 处理函数，接收 (response, input, init) 参数，应返回新的 Response 对象或 Promise<Response>
         */
        addPostFn(fn) {
            if (typeof fn === 'function') {
                this.postFns.push(fn);
            } else {
                console.warn('FetchHook: addPostFn 接收的参数不是函数。');
            }
        }

        /**
         * 移除一个前置处理函数
         * @param {Function} fn
         */
        removePreFn(fn) {
            this.preFns = this.preFns.filter(existingFn => existingFn !== fn);
        }

        /**
         * 移除一个后置处理函数
         * @param {Function} fn
         */
        removePostFn(fn) {
            this.postFns = this.postFns.filter(existingFn => existingFn !== fn);
        }
    }

    function findElement(selector, {timeout = 5000, interval = 100, host = document} = {}) {
        return new Promise((resolve) => {
            const start = Date.now();

            function check() {
                const element = host.querySelector(selector);
                if (element) {
                    resolve(element);
                } else if (Date.now() - start >= timeout) {
                    resolve(undefined);
                } else {
                    setTimeout(check, interval);
                }
            }

            check();
        });
    }

    function findElements(selector, {timeout = 5000, interval = 100, host = document} = {}) {
        return new Promise((resolve) => {
            const start = Date.now();

            function check() {
                const elements = host.querySelectorAll(selector) || [];
                if (elements.length > 0) {
                    resolve(elements);
                } else if (Date.now() - start >= timeout) {
                    resolve([]);
                } else {
                    setTimeout(check, interval);
                }
            }

            check();
        });
    }

    function parseDuration(duration) {
        const parts = duration.split(':').map(Number);
        let hours = 0, minutes = 0, seconds = 0;
        if (parts.length === 2) {
            // mm:ss 格式
            [minutes, seconds] = parts;
        } else if (parts.length === 3) {
            // hh:mm:ss 格式
            [hours, minutes, seconds] = parts;
        } else {
            throw new Error('时间格式错误');
        }
        return hours * 3600 + minutes * 60 + seconds;
    }

    let config;
    const path = window.location.href;
    const paths = path.split('/').filter(it => it.length > 0);

    const fetchHook = new FetchHook();
    fetchHook.hook(); // 在脚本加载时立即劫持 fetch

    // 加载配置
    function loadConfig() {
        config = JSON.parse(GM_getValue("BiliFilterConfig") || '{}');
        // config = JSON.parse(localStorage.getItem("BiliFilterConfig")) || {};
        const DEFAULT_CONFIG = {
            ad: true,
            prom: true,
            ip: true,
            upList: [],
            titleList: [],
            partList: [],
            video: { playCount: '',duration: '', maxDuration: '' },
        };
        config = {
            ...DEFAULT_CONFIG,
            ...(config || {}),
        };
        return config;
    }

    // 广告tips
    function adblockClear() {
        findElement('.adblock-tips').then(it => {
            if (it) {
                it.remove();
            }
        })
    }

    // 添加前置处理
    function increasePreFn() {
        const preloadFn = (input, init) => {
            if (typeof input === 'string'
                && input.includes('api.bilibili.com')
                && init?.method?.toUpperCase() === "GET") {
                input = input.replace("&ps=12&", "&ps=24&");
                // console.log(`FetchHook: 修改了B站推荐请求的 ps 参数为 ${24}。`);
            }
            return input;
        };
        fetchHook.addPreFn(preloadFn);
    }

    // 添加后置处理
    function increasePostFn() {
        const videoReqFilter = (resp, input, init) => {
            if (!(typeof input === 'string'
                && input.includes('api.bilibili.com')
                && input.includes('feed/rcmd')
                && init?.method?.toUpperCase() === "GET")) {
                return resp;
            }
            return resp.clone().json().then(data => {
                const items = data?.data?.item;
                if (!items) return;
                // 过滤条件
                const conditions = [
                    // 视频时长过滤
                    (it) => {
                        return it.duration <= parseDuration(config.video?.duration || '00:00')
                            || it.duration >= parseDuration(config.video?.maxDuration || '99:59:59');
                    },
                    // up 主过滤
                    (it) => {
                        if (!config.upList && config.upList.length === 0) return false;
                        return config.upList.some(up => (it.owner ? it.owner.name : '未知').includes(up))
                    },
                    // 播放量过滤
                    (it) => {
                        if (!config.video?.playCount) return false;
                        return (it.stat ? it.stat.view : 0) < config.video.playCount;
                    },
                ];
                // 过滤
                const [filteredItems, excludedItems] = items.reduce((acc, it) => {
                    const [filtered, excluded] = acc;
                    if (conditions.some(condition => condition(it))) {
                        excluded.push(it);
                    } else {
                        filtered.push(it);
                    }
                    return [filtered, excluded];
                }, [[], []]);
                console.log("过滤后的数据：", filteredItems.map(it => {
                    return {
                        bvid: it.bvid,
                        title: it.title,
                        duration: it.duration,
                        owner: it.owner ? it.owner.name : '未知',
                        view: it.stat.view,
                    }
                }));
                console.log("被排除的数据：", excludedItems.map(it => {
                    return {
                        bvid: it.bvid,
                        title: it.title,
                        duration: it.duration,
                        owner: it.owner ? it.owner.name : '未知',
                        view: (it.stat ? it.stat.view : 0),
                    }
                }))
                // 更新数据
                data.data.item = filteredItems;
                return new Response(JSON.stringify(data), {
                    status: resp.status,
                    statusText: resp.statusText,
                    headers: resp.headers
                });
            }).catch(err => {
                console.log(err)
                return resp
            })
        };

        const rpidSet = new Set();
        const ipLocalFetch = (resp, input, init) => {
            const isTargetApi = typeof input === 'string' &&
                input.includes('api.bilibili.com') &&
                (input.includes('reply/wbi/main') || input.includes('reply/reply'));
            if (!isTargetApi || init?.method?.toUpperCase() !== "GET") {
                return resp;
            }

            // 回复数据处理
            const processReply = (reply) => {
                if (!reply) return;
                if (rpidSet.has(reply.rpid)) return;
                const location = reply?.reply_control?.location;
                const content = reply?.content;
                if (location && content) {
                    content.message = `[${location}]${content.message || ''}`;
                }
                // 递归处理子回复
                if (Array.isArray(reply.replies)) {
                    reply.replies.forEach(processReply);
                }
                rpidSet.add(reply.rpid);
            };

            // 处理 JSON 数据
            return resp.clone().json().then(data => {
                const replies = data?.data?.replies;
                // 处理置顶回复
                if (Array.isArray(replies)) {
                    // 遍历所有一级回复
                    replies.forEach(processReply);
                }
                // 返回修改后的响应
                return new Response(JSON.stringify(data), {
                    status: resp.status,
                    statusText: resp.statusText,
                    headers: resp.headers
                });
            }).catch(err => {
                console.error('IP定位注入失败:', err);
                return resp;
            });
        };

        fetchHook.addPostFn(videoReqFilter);
        if (config.ip)
            fetchHook.addPostFn(ipLocalFetch);
    }

    // 视频过滤
    function videoFilter() {

        // 处理函数
        const process = (items, filters) => {
            items.forEach(it => {
                if (filters.some(filter => filter(it))) {
                    it.remove();
                }
            })
        }
        // 广告过滤
        const filterByAd = (it) => {
            if (!config.ad) return false;
            const el = it.querySelector('.bili-video-card__stats--text')
            return !!(el && el.innerHTML === '广告');
        }
        // 标题过滤
        const filterByTitle = (it) => {
            if (!config.titleList || config.titleList.length === 0) return false;
            const el = it.querySelector('.bili-video-card__info--tit')
            if (!el) return false;
            return config.titleList.find(pattern => {
                const text = el.title;
                const tokens = pattern.trim().split(/\s+/);
                return tokens.every(token => {
                    if (token.includes('|')) {
                        // 逻辑“或”
                        return token.split('|').some(word => text.includes(word));
                    } else if (token.startsWith('!')) {
                        // 逻辑“非”
                        const word = token.slice(1);
                        return !text.includes(word);
                    } else {
                        // 逻辑“与”
                        return text.includes(token);
                    }
                });
            });
        }
        // 时长过滤
        const filterByDuration = (it) => {
            if (!(config.video.duration || config.video.maxDuration)) return false;
            const el = it.querySelector('.bili-video-card__stats__duration')
            if (!el) return false;
            const configDuration = parseDuration(config.video.duration || "00:00");
            const configMaxDuration = parseDuration(config.video.maxDuration || "99:59:59");
            const duration = parseDuration(el.innerHTML);
            return duration < configDuration || duration > configMaxDuration;
        }
        // 播放量过滤
        const filterByPlayCount = (it) => {
            if (!config.video?.playCount) return false;
            const el = it.querySelector('.bili-video-card__stats--text')
            if (!el || el.innerHTML === '广告') return false;
            let count;
            const countText = el.innerHTML;
            if (countText.includes('万')) {
                count = parseFloat(countText.replace('万', '')) * 10000;
            } else if (countText.includes('亿')) {
                count = parseFloat(countText.replace('亿', '')) * 100000000;
            } else {
                count = parseInt(countText);
            }
            return count < config.video.playCount;
        }
        // UP主过滤
        const filterByUp = (it) => {
            if (!config.upList || config.upList.length === 0) return false;
            const el = it.querySelector('.bili-video-card__info--author');
            if (!el) return false;
            return config.upList.some(up => el.title.includes(up));
        }
        // 空元素清除
        const filterByNull = (it) => {
            return it.innerHTML.length < 1;
        }

        // 主页
        if (path === "https://www.bilibili.com/") {
            // 推广过滤
            const filterByProm = (it) => {
                if (!config.prom) return false;
                const el = it.querySelector('.vui_icon');
                return !!el;
            }
            // 分区过滤
            const filterByPart = (it) => {
                if (!it.className.includes('floor-single-card')) return false;
                if (!config.partList || config.partList.length === 0) return false;
                if (config.partList.includes("ALL")) return true;
                const el = it.querySelector('.floor-title');
                if (!el) return false;
                return config.partList.some(part => el.title.includes(part));
            }
            // 过滤
            const filters = [filterByAd, filterByProm, filterByTitle, filterByPart, filterByNull];
            // 初始化 MutationObserver
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return;
                            let items;
                            if (node.matches('.feed-card, .bili-feed-card, .floor-single-card')) {
                                items = [node];
                            } else {
                                items = Array.from(node.querySelectorAll('.feed-card, .bili-feed-card, .floor-single-card'));
                            }
                            process(items, filters)
                        });
                    }
                });
            });
            observer.observe(document.body, {childList: true, subtree: true});
            findElements('.feed-card, .bili-feed-card, .floor-single-card').then(items => {
                process(items, filters)
            })
        }

        // 搜索页
        if (paths.indexOf('search.bilibili.com') !== -1) {
            // 推广过滤
            const filterByPart = (it) => {
                if (!config.partList || config.partList.length === 0) return false;
                if (config.partList.includes("ALL") || config.partList.includes("课堂")) {
                    const el = it.querySelector('.bili-video-card__info--cheese');
                    if (el) return true;
                }
                if (config.partList.includes("ALL") || config.partList.includes("直播")) {
                    const el = it.querySelector('.bili-video-card__info--living')
                    if (el) return true;
                }
                return false;
            }
            const filters = [filterByAd, filterByTitle, filterByPart,
                filterByDuration, filterByPlayCount, filterByUp, filterByNull]
            // 初始化 MutationObserver
            const observer = new MutationObserver(mutations => {
                mutations.forEach(mutation => {
                    if (mutation.type === 'childList') {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return;
                            if (node.matches('.search-page, .video-list')) {
                                const threads = node.querySelectorAll('.video-list > *');
                                process(threads, filters);
                            }
                        });
                    }
                });
            });
            observer.observe(document.body, {childList: true, subtree: true});
            findElements('.video-list > *').then(items => {
                process(items, filters)
            })
        }
    }

    // IP属地样式优化
    async function ipStyleOptimize() {
        if (!config.ip) return;
        if (paths.indexOf('video') === -1) return;

        const processedComments = new Set(); // 记录已处理的主评论
        const processedReplies = new Set(); // 记录已处理的二级评论

        // 处理主评论
        async function processThread(thread) {
            if (processedComments.has(thread)) return;
            processedComments.add(thread);
            try {
                // 穿透 thread 的 Shadow DOM 找到 renderer
                const renderer = await findElement("bili-comment-renderer", {host: thread.shadowRoot});
                // 穿透 renderer 的 Shadow DOM 找到 rich-text
                const rich = await findElement("bili-rich-text", {host: renderer.shadowRoot});
                // 穿透 rich-text 的 Shadow DOM 找到 #contents
                const contentEl = await findElement("#contents", {host: rich.shadowRoot});
                // 穿透 renderer 的 Shadow DOM 找到 #header
                const header = await findElement("#header", {host: renderer.shadowRoot});
                const text = contentEl.innerHTML || contentEl.innerText;
                const match = text.match(/\[([^\]]+)]/);
                if (match) {
                    const ipSpan = document.createElement("span");
                    ipSpan.textContent = match[1];
                    ipSpan.style.cssText = "position:relative; bottom:10px; font-size:14px; color:#267129;";
                    header.insertAdjacentElement("afterend", ipSpan);
                    contentEl.innerHTML = text.replace(/\[([^\]]+)]/, '');
                }
                // 处理二级评论 (replies)
                const repliesRenderer = await findElement("bili-comment-replies-renderer", {host: thread.shadowRoot});
                const replyTarget = repliesRenderer.shadowRoot;
                // 为回复区域增加独立的监听器
                const replyObserver = new MutationObserver((mutations) => {
                    for (const mutation of mutations) {
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeType !== 1) return;
                            if (node.tagName === 'BILI-COMMENT-REPLY-RENDERER') {
                                processReply(node);
                            } else {
                                node.querySelectorAll('bili-comment-reply-renderer').forEach(processReply);
                            }
                        });
                    }
                });
                replyObserver.observe(replyTarget, {childList: true, subtree: true});
                // 处理已经存在的回复
                const existingReplies = await findElements("bili-comment-reply-renderer", {host: replyTarget});
                existingReplies.forEach(processReply);
            } catch (err) {
                processedComments.delete(thread);
                console.warn("解析评论错误:", err);
            }
        }

        // 处理单个二级评论
        async function processReply(replyRenderer) {
            if (processedReplies.has(replyRenderer)) return;
            processedReplies.add(replyRenderer);
            try {
                const replyRich = await findElement("bili-rich-text", {host: replyRenderer.shadowRoot});
                const replyContentEl = await findElement("#contents", {host: replyRich.shadowRoot});
                const replyText = replyContentEl.innerHTML || replyContentEl.innerText;
                const replyMatch = replyText.match(/\[([^\]]+)]/);
                if (replyMatch) {
                    const replyUserInfo = await findElement("bili-comment-user-info", {host: replyRenderer.shadowRoot});
                    const replyIpSpan = document.createElement("p");
                    replyIpSpan.textContent = replyMatch[1];
                    replyIpSpan.style.cssText = "position:relative; bottom:5px; font-size:14px; color:#267129; margin:0;";
                    replyUserInfo.insertAdjacentElement("afterend", replyIpSpan);
                    replyContentEl.innerHTML = replyText.replace(/\[([^\]]+)]/, '');
                }
            } catch (e) {
                processedReplies.delete(replyRenderer);
            }
        }

        // 监听主评论列表
        const commentApp = await findElement("bili-comments");
        const targetNode = commentApp.shadowRoot || commentApp;
        const mainObserver = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType !== 1) return;
                    if (node.tagName === 'BILI-COMMENT-THREAD-RENDERER' || node.tagName === 'BILI-COMMENT-REPLY-RENDERER') {
                        processThread(node);
                    } else {
                        const threads = node.querySelectorAll('bili-comment-thread-renderer');
                        threads.forEach(processThread);
                    }
                });
            }
        });
        mainObserver.observe(targetNode, {childList: true, subtree: true});
        // 初始化
        const initialComments = await findElements("bili-comment-thread-renderer", {host: targetNode});
        initialComments.forEach(processThread);
    }

    // 视频页
    async function videoPage() {
        if (paths.indexOf('video') === -1) {
            return
        }

        // 删除投币展示框
        setInterval(async () => {
            const toubi = await findElement('.bili-danmaku-x-guide-all');
            if (toubi) {
                toubi.remove();
            }
        }, 100)

        // 删除视频下广告
        setInterval(async () => {
            const ads = await findElements('.ad-report, #slide_ad, .activity-m-v1, .video-page-game-card-small');
            if (ads) {
                ads.forEach(ad => {
                    ad.innerHTML = "";
                    ad.style.cssText = "height:0px; display:none;"
                });
            }
        }, 100);

        // 多 p 视频列表扩展
        const list = await findElement('.video-pod__body');
        const video = await findElement('.bpx-player-video-area')
        if (list) {
            if (video) {
                setInterval(() => {
                    list.style.maxHeight = video.offsetHeight - 165 + 'px'
                }, 10)
            } else {
                list.style.maxHeight = '400px';
            }
        }
    }

    // 添加配置窗口
    function addConfigOverlay() {
        // 过滤配置
        // 定义配置窗口的 HTML、CSS 和 JavaScript
        const configHtml = `
        <div id="BiliFilterConfigOverlay" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 hidden">
            <div id="configWindow" class="config-window-container">

                <!-- 视频过滤设置 -->
                <div class="config-section">
                    <h3 class="text-xl font-semibold mb-4 text-center">视频过滤设置</h3>

                    <!-- 广告 -->
                    <div class="flex items-center mb-4">
                        <label for="adToggle" class="switch-label">广告</label>
                        <label class="switch">
                            <input type="checkbox" id="adToggle" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <!-- 推广 -->
                    <div class="flex items-center mb-4">
                        <label for="promToggle" class="switch-label">推广</label>
                        <label class="switch">
                            <input type="checkbox" id="promToggle" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>
                    
                    <!-- IP展示 -->
                    <div class="flex items-center mb-4">
                        <label for="ipToggle" class="switch-label">评论区显示IP定位</label>
                        <label class="switch">
                            <input type="checkbox" id="ipToggle" checked>
                            <span class="slider round"></span>
                        </label>
                    </div>

                    <label for="videoPlayCount">播放量：</label>
                    <input type="text" id="videoPlayCount" placeholder="输入播放量（例如：10000）">

                    <label for="videoDuration">视频时长：</label>
                    <div style="display: flex">
                        <input style="flex: 1" type="text" id="videoDuration" placeholder="视频时长（例如：5:30）">
                        <span style="margin: 8px 6px; font-size: 16px;">-</span>
                        <input style="flex: 1" type="text" id="videoMaxDuration" placeholder="视频时长（例如：5:30）">
                    </div>

                    <label for="upList">UP过滤：</label>
                    <textarea id="upList" placeholder="每行输入一个 UP 名称"></textarea>

                    <label for="titleList" style="margin-bottom: 0">标题过滤(支持下列匹配方式)：</label>
                    <span class="block" style="font-size: 12px; margin-bottom: 10px; color: rgba(0,0,0,0.5);">
                    A B：必须同时包含 A 和 B（与）<br\>
                    A|B：包含 A 或 B 其中一个即可（或）<br\>
                    !A：不能包含 A（非）
                    </span>
                    <textarea id="titleList" placeholder="每行输入一个标题"></textarea>

                    <label for="partList">分区过滤(填写ALL表示所有分区)：</label>
                    <textarea id="partList" placeholder="每行输入一个分区，例如：直播、游戏、综艺"></textarea>
                </div>

                <!-- 按钮 -->
                <button id="saveConfig" class="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600">保存配置</button>
                <button id="closeConfig" class="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600">关闭</button>
            </div>
        </div>
    `;

        const configCss = `
        .config-window-container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            width: 100%;
            max-width: 500px;
            box-sizing: border-box;
            max-height: 80vh; /* 设置最大高度为视口高度的 80% */
            overflow-y: auto; /* 启用垂直滚动 */
        }

        .config-window-container h2, .config-window-container h3 {
            text-align: center;
            color: #1f2937;
            margin-bottom: 25px;
            font-weight: 700;
        }

        .config-section {
            margin-bottom: 20px;
            padding: 20px;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            background-color: #f9fafb;
        }

        .config-section label {
            display: block;
            margin-bottom: 10px;
            font-weight: 600;
            color: #374151;
            font-size: 0.95rem;
        }

        .config-section textarea,
        .config-section input[type="text"] {
            width: 100%;
            padding: 10px;
            margin-bottom: 15px;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            box-sizing: border-box;
            min-height: 40px;
            resize: vertical;
            font-size: 0.9rem;
            color: #4b5563;
        }

        .config-section textarea {
            min-height: 80px;
        }

        .subsection {
            margin-top: 20px;
            padding-top: 15px;
            border-top: 1px dashed #d1d5db;
        }

        /* 开关样式 */
        .config-window-container .switch {
            position: relative;
            display: inline-block;
            width: 50px;
            height: 20px;
            vertical-align: middle;
        }

        .config-window-container .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .config-window-container .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #d1d5db;
            transition: .4s;
            border-radius: 28px;
        }

        .config-window-container .slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 24px;
            left: 2px;
            bottom: 2px;
            background-color: white;
            transition: .4s;
            border-radius: 28px;
        }

        .config-window-container input:checked + .slider {
            background-color: #2563eb;
        }

        .config-window-container input:focus + .slider {
            box-shadow: 0 0 1px #2563eb;
        }

        .config-window-container input:checked + .slider:before {
            transform: translateX(22px);
        }

        .switch-label {
            display: inline-block;
            vertical-align: middle;
            color: #374151;
            font-weight: 600;
            margin-right: 15px;
        }

        /* 隐藏的元素 */
        .hidden {
            display: none !important; /* 使用 !important 确保覆盖 Tailwind 的 display */
        }
    `;

        // 注入 Tailwind CSS CDN
        const tailwindScript = document.createElement('script');
        tailwindScript.src = 'https://cdn.tailwindcss.com';
        document.head.appendChild(tailwindScript);

        // 注入自定义 CSS
        const styleElement = document.createElement('style');
        styleElement.textContent = configCss;
        document.head.appendChild(styleElement);

        // 注入配置窗口 HTML
        document.body.insertAdjacentHTML('beforeend', configHtml);

        // 配置窗口的 DOM 元素
        const biliFilterConfigOverlay = document.getElementById('BiliFilterConfigOverlay');

        // 配置窗口的 JavaScript 逻辑
        tailwindScript.onload = () => { // 等待 Tailwind 加载完成
            const saveConfigButton = document.getElementById('saveConfig');
            const closeConfigButton = document.getElementById('closeConfig');

            // 收集所有配置数据并返回一个对象
            const collectConfigData = () => {
                const config = {
                    ad: document.getElementById('adToggle').checked,
                    prom: document.getElementById('promToggle').checked,
                    ip: document.getElementById('ipToggle').checked,
                    upList: document.getElementById('upList').value.split('\n').filter(item => item.trim() !== ''),
                    titleList: document.getElementById('titleList').value.split('\n').filter(item => item.trim() !== ''),
                    partList: document.getElementById('partList').value.split('\n').filter(item => item.trim() !== ''),
                    video: {
                        playCount: parseInt(document.getElementById('videoPlayCount').value.trim()),
                        duration: document.getElementById('videoDuration').value.trim(),
                        maxDuration: document.getElementById('videoMaxDuration').value.trim(),
                    },
                }
                const videoDuration = parseDuration(config.video.duration || "00:00");
                const videoMaxDuration = parseDuration(config.video.maxDuration || "99:59:59");
                if (videoDuration >= videoMaxDuration) {
                    throw new Error("最大时长必须大于最小时长");
                }
                return config
            };

            // 加载配置数据到表单
            const loadConfigData = () => {
                document.getElementById('adToggle').checked = config.ad;
                document.getElementById('promToggle').checked = config.prom;
                document.getElementById('ipToggle').checked = config.ip;
                document.getElementById('upList').value = config.upList ? config.upList.join('\n') : '';
                document.getElementById('titleList').value = config.titleList ? config.titleList.join('\n') : '';
                document.getElementById('partList').value = config.partList ? config.partList.join('\n') : '';
                if (config.video) {
                    document.getElementById('videoPlayCount').value = config.video.playCount || '';
                    document.getElementById('videoDuration').value = config.video.duration || '';
                    document.getElementById('videoMaxDuration').value = config.video.maxDuration || '';
                }
            };

            // 保存配置按钮点击事件
            saveConfigButton.addEventListener('click', () => {
                try {
                    config = collectConfigData();
                } catch (err) {
                    alert(err);
                    return;
                }
                console.log('保存的配置数据:', config);
                // 将配置数据保存到 localStorage
                // localStorage.setItem('BiliFilterConfig', JSON.stringify(config));
                GM_setValue('BiliFilterConfig', JSON.stringify(config));
                const messageBox = document.createElement('div');
                messageBox.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
                messageBox.innerHTML = `
                    <div class="bg-white p-6 rounded-lg shadow-xl text-center">
                        <p class="text-lg font-semibold mb-4">配置已保存</p>
                        <button id="messageBoxClose" class="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">确定</button>
                    </div>
                `;
                document.body.appendChild(messageBox);
                document.getElementById('messageBoxClose').addEventListener('click', () => {
                    document.body.removeChild(messageBox);
                    biliFilterConfigOverlay.classList.add('hidden'); // 隐藏配置窗口
                });
            });

            // 关闭配置窗口按钮点击事件
            closeConfigButton.addEventListener('click', () => {
                biliFilterConfigOverlay.classList.add('hidden'); // 隐藏配置窗口
            });

            // 注入配置按钮，在头像下面
            findElement('.links-item', {timeout: 999999}).then(links => {
                if (links) {
                    const configButton = document.createElement('div');
                    configButton.className = 'single-link-item';
                    configButton.insertAdjacentHTML('beforeend', `
                  <div class="link-title"><svg t="1752405413351" class="link-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7688" width="18" height="18"><path d="M512 298.705455a212.014545 212.014545 0 0 0-150.900364 62.487272 212.014545 212.014545 0 0 0-62.510545 150.900364 212.014545 212.014545 0 0 0 62.510545 150.900364A212.014545 212.014545 0 0 0 512 725.504a212.014545 212.014545 0 0 0 150.900364-62.510545 212.014545 212.014545 0 0 0 62.510545-150.900364 212.014545 212.014545 0 0 0-62.510545-150.900364A212.014545 212.014545 0 0 0 512 298.705455z m0 362.58909A149.504 149.504 0 0 1 362.705455 512 149.504 149.504 0 0 1 512 362.705455 149.504 149.504 0 0 1 661.294545 512 149.504 149.504 0 0 1 512 661.294545z m448-57.297454v-183.994182l-105.099636-30.603636c-4.002909-11.194182-8.610909-22.295273-13.800728-33.093818l52.712728-96-130.094546-130.094546-95.906909 52.596364a371.432727 371.432727 0 0 0-33.303273-13.917091l-30.487272-104.890182h-184.017455l-30.487273 104.890182c-11.310545 4.119273-22.504727 8.704-33.326545 13.917091l-95.883636-52.596364-130.094546 130.094546 52.689455 96.116363a371.432727 371.432727 0 0 0-13.893819 33.28L64 419.909818v183.994182l105.192727 30.906182c4.096 11.170909 8.704 22.295273 13.800728 33.093818L130.094545 763.694545l130.094546 130.094546 96.209454-52.48c10.891636 5.189818 21.992727 9.774545 33.28 13.800727l30.324364 104.890182h183.994182l30.813091-105.006545c11.287273-4.096 22.481455-8.704 33.28-13.893819l95.604363 52.805819 130.094546-130.094546-52.596364-96.302545c5.12-10.705455 9.611636-21.713455 13.707637-32.907637l105.099636-30.603636z m-124.695273-22.993455h-20.712727l-6.493091 21.294546a311.156364 311.156364 0 0 1-22.900364 55.109818l-10.496 19.688727 15.290182 15.313455 35.304728 64.581818-68.305455 68.119273-65.792-36.305455-14.103273-14.010182-19.688727 10.496a308.596364 308.596364 0 0 1-55.109818 22.900364l-21.410909 6.516364v21.410909l-20.689455 70.586182H463.825455l-20.805819-72.215273v-19.781818l-21.410909-6.516364a308.596364 308.596364 0 0 1-55.086545-22.900364l-19.781818-10.589091-15.127273 15.290182-64.581818 35.211637-68.119273-68.096 36.305455-65.815273 14.103272-14.103273-10.496-19.688727a305.570909 305.570909 0 0 1-22.900363-55.109818l-6.516364-21.294546h-21.480727l-70.609455-20.712727v-96.372364l72.215273-20.805818h19.898182l6.493091-21.294545c5.701818-18.804364 13.498182-37.306182 22.900363-55.109818l10.496-19.712-14.708363-14.685091-35.700364-65.396364 68.119273-68.119273 65.186909 35.816728 14.615273 14.592 19.688727-10.496a301.428364 301.428364 0 0 1 55.109818-22.900364l21.410909-6.516364v-20.48l20.782546-71.400727h96.395636l20.805818 71.400727v20.48l21.410909 6.516364a305.570909 305.570909 0 0 1 55.086546 22.900364l19.898181 10.58909 14.49891-14.801454 65.093818-35.700364 68.119272 68.119273-35.816727 65.186909-14.685091 14.708364 10.472728 19.688727c9.425455 17.687273 17.128727 36.212364 22.923636 55.109818l6.516364 21.294546h20.689454l71.400727 20.805818v96.395636l-71.307636 20.805818z" fill="#61666D" p-id="7689"></path></svg><span>过滤配置</span><!----></div>
                `);
                    links.appendChild(configButton);
                    configButton.addEventListener('click', () => {
                        // loadConfigData(JSON.parse(localStorage.getItem('BiliFilterConfig')));
                        loadConfigData();
                        biliFilterConfigOverlay.classList.remove('hidden'); // 显示配置窗口
                    });
                }
            })

        };
    }

    // 附加样式
    function additionalStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .security_content {
                box-sizing: content-box !important;
            }
            .load-more-anchor {
                position: absolute;
                bottom: 1000px;
                opacity: 0;
            }
        `;
        document.head.appendChild(style);
    }

    function _main() {
        // 读取配置
        loadConfig();
        // 请求前后置处理
        increasePreFn();
        increasePostFn();
        // 抬头广告处理
        adblockClear();
        // 视频过滤
        videoFilter();
        // IP属地样式优化
        ipStyleOptimize().then();
        // 视频页处理
        videoPage().then();
        // 添加配置窗口
        addConfigOverlay();
        // 添加全局样式(优化滚动加载)
        additionalStyles();
    }

    _main();

})();
