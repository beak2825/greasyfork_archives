// ==UserScript==
// @name         B站净化器
// @namespace    http://tampermonkey.net/
// @version      1.3.4
// @description  B站净化器 是一款Tampermonkey脚本，旨在为您提供更清爽、无广告的B站浏览体验。它能自动过滤广告、推广内容，并允许您根据播放量、视频时长、UP主、标题关键词和分区等多种条件自定义隐藏视频，让您的B站首页和视频页面只显示您真正感兴趣的内容。轻松配置，即刻享受纯净B站！
// @author       Kiyuiro
// @match        https://*.bilibili.com/*
// @icon         https://www.bilibili.com/favicon.ico
// @grant        none
// @license      Apache-2.0
// @downloadURL https://update.greasyfork.org/scripts/542468/B%E7%AB%99%E5%87%80%E5%8C%96%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542468/B%E7%AB%99%E5%87%80%E5%8C%96%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function findElement(selector, timeout = 5000, interval = 50) {
        return new Promise((resolve) => {
            const start = Date.now();
            function check() {
                const element = document.querySelector(selector);
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

    function findElements(selector, timeout = 5000, interval = 50) {
        return new Promise((resolve) => {
            const start = Date.now();
            function check() {
                const elements = document.querySelectorAll(selector) || [];
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

    class FetchHook {
        constructor() {
            this.originalFetch = window.fetch; // 保存原始的 fetch 函数
            this.preFns = []; // 前置处理函数数组
            this.postFns = []; // 后置处理函数数组

            this.hook = this.hook.bind(this);
            this.unhook = this.unhook.bind(this);
            this.addPreFn = this.addPreFn.bind(this);
            this.addPostFn = this.addPostFn.bind(this);
        }

        // 劫持 window.fetch
        hook() {
            if (window.fetch !== this.originalFetch) {
                console.warn('FetchHook: fetch 已经被劫持，跳过再次劫持。');
                return;
            }

            window.fetch = async (input, init) => {
                let processedInput = input;
                let processedInit = init;

                // 执行前置处理函数
                for (const fn of this.preFns) {
                    const result = fn(processedInput, processedInit);
                    if (result instanceof Promise) {
                        [processedInput, processedInit] = await result;
                    } else if (Array.isArray(result) && result.length === 2) {
                        [processedInput, processedInit] = result;
                    } else {
                        processedInput = result; // 兼容只返回 input 的情况
                    }

                    if (processedInput === null || processedInput === undefined) {
                        // console.log('FetchHook: 请求被前置函数中断。', input);
                        return Promise.resolve(new Response(null, { status: 204, statusText: 'No Content (Hooked)' }));
                    }
                }

                // 调用原生 fetch 发送请求
                let response;
                try {
                    response = await this.originalFetch.call(window, processedInput, processedInit);
                } catch (error) {
                    console.error('FetchHook: 原生 fetch 请求失败。', error);
                    throw error;
                }

                // 执行后置处理函数
                let processedResponse = response;
                for (const fn of this.postFns) {
                    const result = fn(processedResponse, processedInput, processedInit);
                    if (result instanceof Promise) {
                        processedResponse = await result;
                    } else {
                        processedResponse = result;
                    }
                }
                return processedResponse;
            };
            // console.log('FetchHook: 成功劫持 window.fetch。');
        }

        // 恢复 window.fetch 到原始状态
        unhook() {
            if (window.fetch === this.originalFetch) {
                console.warn('FetchHook: fetch 未被劫持或已恢复，跳过。');
                return;
            }
            window.fetch = this.originalFetch;
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
            throw new Error('Invalid duration format');
        }
        return hours * 3600 + minutes * 60 + seconds;
    }

    let config;
    const path = window.location.href;
    const paths = path.split('/').filter(it => it.length > 0);

    const fetchHook = new FetchHook();
    fetchHook.hook(); // 在脚本加载时立即劫持 fetch

    // 广告tips
    async function adblockClear() {
        const adblock = await findElement('.adblock-tips');
        if (adblock) {
            adblock.remove();
        }
    }

    // 扩展加载
    function increaseLoad() {
        const preloadFn = (input, init) => {
            if (typeof input === 'string'
                && input.includes('api.bilibili.com')
                && input.includes('feed/rcmd')
                && init?.method?.toUpperCase() === "GET") {
                input = input.replace("&ps=12&", "&ps=24&");
                // console.log(`FetchHook: 修改了B站推荐请求的 ps 参数为 ${24}。`);
            }
            return input;
        };
        fetchHook.addPreFn(preloadFn);
    }

    // 视频过滤
    function videoFilter() {
        config = JSON.parse(localStorage.getItem('BiliFilterConfig')) || [];
        // console.log(config);
        // 广告过滤
        const filterByAd = (it) => {
            if (!config.ad) return false;
            const el = it.querySelector('.bili-video-card__stats--text')
            return !!(el && el.innerHTML === '广告');
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
        // 时长过滤
        const filterByDuration = (it) => {
            if (!config.video?.playCount) return false;
            const el = it.querySelector('.bili-video-card__stats__duration')
            if (!el) return false;
            const configDuration = parseDuration(config.video.duration);
            const duration = parseDuration(el.innerHTML);
            return duration < configDuration;
        }
        // 推广过滤
        const filterByProm = (it) => {
            if (!config.prom) return false;
            const el = it.querySelector('.vui_icon');
            return !!el;
        }
        // UP主过滤
        const filterByUp = (it) => {
            if (!config.upList || config.upList.length === 0) return false;
            const el = it.querySelector('.bili-video-card__info--author');
            if (!el) return false;
            return config.upList.some(up => el.title.includes(up));
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
        // 分区过滤
        const filterByPart = (it) => {
            if (!it.className.includes('floor-single-card')) return false;
            if (!config.partList || config.partList.length === 0) return false;
            if (config.partList[0] === 'ALL') return true;
            const el = it.querySelector('.floor-title');
            if (!el) return false;
            return config.partList.some(part => el.title.includes(part));
        }
        // 空元素清除
        const filterByNull = (it) => {
            return it.innerHTML.length < 1;
        }
        // 过滤
        const filters = [
            filterByAd,
            filterByPlayCount,
            filterByDuration,
            filterByProm,
            filterByUp,
            filterByTitle,
            filterByPart,
            filterByNull
        ];
        const process = (items) => {
            items.forEach(it => {
                if (filters.some(filter => filter(it))) {
                    // console.log(it)
                    it.remove();
                }
            })
        }
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
                        process(items)
                    });
                }
            });
        });
        observer.observe(document.body, {childList: true, subtree: true});
        findElements('.feed-card, .bili-feed-card, .floor-single-card').then(items => {
            process(items)
        })
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
                    
                    <label for="videoPlayCount">播放量：</label>
                    <input type="text" id="videoPlayCount" placeholder="输入播放量（例如：10000）">

                    <label for="videoDuration">视频时长：</label>
                    <input type="text" id="videoDuration" placeholder="输入视频时长（例如：05:30）">
                    
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
        // 确保在 DOM 元素可用后再执行
        tailwindScript.onload = () => { // 等待 Tailwind 加载完成
            const saveConfigButton = document.getElementById('saveConfig');
            const closeConfigButton = document.getElementById('closeConfig');

            // 收集所有配置数据并返回一个对象
            const collectConfigData = () => {
                return {
                    ad: document.getElementById('adToggle').checked,
                    prom: document.getElementById('promToggle').checked,
                    upList: document.getElementById('upList').value.split('\n').filter(item => item.trim() !== ''),
                    titleList: document.getElementById('titleList').value.split('\n').filter(item => item.trim() !== ''),
                    partList: document.getElementById('partList').value.split('\n').filter(item => item.trim() !== ''),
                    video: {
                        playCount: parseInt(document.getElementById('videoPlayCount').value.trim()),
                        duration: document.getElementById('videoDuration').value.trim()
                    },
                };
            };

            // 加载配置数据到表单
            const loadConfigData = (data) => {
                if (!data) { // 如果没有数据，则初始化为空对象
                    data = {
                        ad: false,
                        prom: false,
                        upList: [],
                        titleList: [],
                        partList: [],
                        video: {playCount: '', duration: ''},
                    };
                }
                document.getElementById('adToggle').checked = data.ad;
                document.getElementById('promToggle').checked = data.prom;
                document.getElementById('upList').value = data.upList ? data.upList.join('\n') : '';
                document.getElementById('titleList').value = data.titleList ? data.titleList.join('\n') : '';
                document.getElementById('partList').value = data.partList ? data.partList.join('\n') : '';
                if (data.video) {
                    document.getElementById('videoPlayCount').value = data.video.playCount || '';
                    document.getElementById('videoDuration').value = data.video.duration || '';
                }
            };

            // 保存配置按钮点击事件
            saveConfigButton.addEventListener('click', () => {
                config = collectConfigData();
                console.log('保存的配置数据:', config);
                // 将配置数据保存到 localStorage
                localStorage.setItem('BiliFilterConfig', JSON.stringify(config));
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
            findElement('.links-item', 999999).then(links => {
                if (links) {
                    const configButton = document.createElement('div');
                    configButton.className = 'single-link-item';
                    configButton.insertAdjacentHTML('beforeend', `
                  <div class="link-title"><svg t="1752405413351" class="link-icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7688" width="18" height="18"><path d="M512 298.705455a212.014545 212.014545 0 0 0-150.900364 62.487272 212.014545 212.014545 0 0 0-62.510545 150.900364 212.014545 212.014545 0 0 0 62.510545 150.900364A212.014545 212.014545 0 0 0 512 725.504a212.014545 212.014545 0 0 0 150.900364-62.510545 212.014545 212.014545 0 0 0 62.510545-150.900364 212.014545 212.014545 0 0 0-62.510545-150.900364A212.014545 212.014545 0 0 0 512 298.705455z m0 362.58909A149.504 149.504 0 0 1 362.705455 512 149.504 149.504 0 0 1 512 362.705455 149.504 149.504 0 0 1 661.294545 512 149.504 149.504 0 0 1 512 661.294545z m448-57.297454v-183.994182l-105.099636-30.603636c-4.002909-11.194182-8.610909-22.295273-13.800728-33.093818l52.712728-96-130.094546-130.094546-95.906909 52.596364a371.432727 371.432727 0 0 0-33.303273-13.917091l-30.487272-104.890182h-184.017455l-30.487273 104.890182c-11.310545 4.119273-22.504727 8.704-33.326545 13.917091l-95.883636-52.596364-130.094546 130.094546 52.689455 96.116363a371.432727 371.432727 0 0 0-13.893819 33.28L64 419.909818v183.994182l105.192727 30.906182c4.096 11.170909 8.704 22.295273 13.800728 33.093818L130.094545 763.694545l130.094546 130.094546 96.209454-52.48c10.891636 5.189818 21.992727 9.774545 33.28 13.800727l30.324364 104.890182h183.994182l30.813091-105.006545c11.287273-4.096 22.481455-8.704 33.28-13.893819l95.604363 52.805819 130.094546-130.094546-52.596364-96.302545c5.12-10.705455 9.611636-21.713455 13.707637-32.907637l105.099636-30.603636z m-124.695273-22.993455h-20.712727l-6.493091 21.294546a311.156364 311.156364 0 0 1-22.900364 55.109818l-10.496 19.688727 15.290182 15.313455 35.304728 64.581818-68.305455 68.119273-65.792-36.305455-14.103273-14.010182-19.688727 10.496a308.596364 308.596364 0 0 1-55.109818 22.900364l-21.410909 6.516364v21.410909l-20.689455 70.586182H463.825455l-20.805819-72.215273v-19.781818l-21.410909-6.516364a308.596364 308.596364 0 0 1-55.086545-22.900364l-19.781818-10.589091-15.127273 15.290182-64.581818 35.211637-68.119273-68.096 36.305455-65.815273 14.103272-14.103273-10.496-19.688727a305.570909 305.570909 0 0 1-22.900363-55.109818l-6.516364-21.294546h-21.480727l-70.609455-20.712727v-96.372364l72.215273-20.805818h19.898182l6.493091-21.294545c5.701818-18.804364 13.498182-37.306182 22.900363-55.109818l10.496-19.712-14.708363-14.685091-35.700364-65.396364 68.119273-68.119273 65.186909 35.816728 14.615273 14.592 19.688727-10.496a301.428364 301.428364 0 0 1 55.109818-22.900364l21.410909-6.516364v-20.48l20.782546-71.400727h96.395636l20.805818 71.400727v20.48l21.410909 6.516364a305.570909 305.570909 0 0 1 55.086546 22.900364l19.898181 10.58909 14.49891-14.801454 65.093818-35.700364 68.119272 68.119273-35.816727 65.186909-14.685091 14.708364 10.472728 19.688727c9.425455 17.687273 17.128727 36.212364 22.923636 55.109818l6.516364 21.294546h20.689454l71.400727 20.805818v96.395636l-71.307636 20.805818z" fill="#61666D" p-id="7689"></path></svg><span>过滤配置</span><!----></div>
                `);
                    links.appendChild(configButton);
                    configButton.addEventListener('click', () => {
                        loadConfigData(JSON.parse(localStorage.getItem('BiliFilterConfig')));
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
        adblockClear();
        increaseLoad();
        videoFilter();
        videoPage();
        addConfigOverlay();
        additionalStyles();
    }

    _main();

})();
