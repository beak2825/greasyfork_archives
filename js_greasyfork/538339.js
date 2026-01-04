// ==UserScript==
// @name         调试版b站 | bilibili | 哔哩哔哩 | 一键三连健康探针（BiliHealth Scan）
// @namespace    http://tampermonkey.net/
// @version      1.7.3
// @description  一键三连健康探针（BiliHealth Scan）显示b站 | bilibili | 哔哩哔哩 点赞率、投币率、收藏率及Steam综合评级
// @license      MIT
// @author       向也
// @website      https://www.bilibili.com/opus/880791333061525569
// @match        http*://www.bilibili.com/
// @match        http*://www.bilibili.com/?*
// @match        http*://www.bilibili.com/video/*
// @match        http*://www.bilibili.com/list/watchlater*
// @match        http*://www.bilibili.com/c/*
// @match        http*://search.bilibili.com/all?*
// @match        http*://space.bilibili.com/*
// @match        http*://www.bilibili.com/history*

// @grant        GM.addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/538339/%E8%B0%83%E8%AF%95%E7%89%88b%E7%AB%99%20%7C%20bilibili%20%7C%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%7C%20%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E%E5%81%A5%E5%BA%B7%E6%8E%A2%E9%92%88%EF%BC%88BiliHealth%20Scan%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/538339/%E8%B0%83%E8%AF%95%E7%89%88b%E7%AB%99%20%7C%20bilibili%20%7C%20%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%20%7C%20%E4%B8%80%E9%94%AE%E4%B8%89%E8%BF%9E%E5%81%A5%E5%BA%B7%E6%8E%A2%E9%92%88%EF%BC%88BiliHealth%20Scan%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    // ====== 常量与配置区 ======
    // 权重配置
    const INTERACTION_WEIGHTS = {
        like: 1,      // 点赞权重
        coin: 8,      // 投币权重
        favorite: 4,  // 收藏权重
        share: 6,     // 转发权重
    };

    // 评级颜色配置
    const RATING_COLORS = {
        rainbow: 'rainbow-text',
        red: 'red-text',
        gold: 'gold-text',
        orange: 'orange-text',
        orangered: 'orangered-text',
        limegreen: 'limegreen-text',
        yellowgreen: 'yellowgreen-text',
    };

    // 评级文本配置
    const RATING_TEXTS = [
        { min: 100, text: '满分神作', color: RATING_COLORS.rainbow },
        { min: 95, text: '好评如潮', color: RATING_COLORS.red },
        { min: 80, text: '非常好评', color: RATING_COLORS.gold },
        { min: 70, text: '多半好评', color: RATING_COLORS.orange },
        { min: 40, text: '褒贬不一', color: RATING_COLORS.orangered },
        { min: 20, text: '多半差评', color: RATING_COLORS.limegreen },
        { min: 0, text: '差评如潮', color: RATING_COLORS.yellowgreen },
    ];
    // ====== 常量与配置区结束 ======

    // 添加样式
    GM.addStyle(`
        /* 添加评级文本颜色 */
        .rainbow-text {
            background: linear-gradient(45deg, #ff0000, #ff9900, #ffff00, #00ff00, #00ffff, #0000ff, #9900ff);
            background-size: 600% 600%;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            animation: rainbow 3s ease infinite;
        }
        .gold-text {
            color: #FFD700 !important; /* 金色 */
        }
        .limegreen-text {
            color: #32CD32 !important; /* 柠檬绿 */
        }
        .yellowgreen-text {
            color: #9ACD32 !important; /* 黄绿色 */
        }
        .orange-text {
            color: #FFA500 !important; /* 橙色 */
        }
        .orangered-text {
            color: #FF4500 !important; /* 橙红色 */
        }
        .red-text {
            color: #FF0000 !important; /* 红色 */
        }
        @keyframes rainbow {
            0%{background-position:0% 50%}
            50%{background-position:100% 50%}
            100%{background-position:0% 50%}
        }

        /* ====== 卡片统计信息自适应样式 ====== */
        /* 主页和搜索页卡片统计信息容器 */
        .bili-video-card__stats--left {
             /* 移除 Flexbox 样式 */
        }
        /* 分区页卡片统计信息容器 */
        .bili-cover-card__stats {
             /* 移除 Flexbox 样式 */
        }
        /* 确保统计项自身也能在flex容器中正确排列 */
        .bili-video-card__stats--left > span,
        .bili-cover-card__stats > span {
             /* 移除 Flexbox 和 Margin 样式 */
        }

        /* 调整图标和文本间距 */
        .bili-video-card__stats--icon,
        .bili-cover-card__stats svg {
             /* 移除 Margin 样式 */
        }
        /* ====== 卡片统计信息自适应样式结束 ====== */
    `);

    // ====== 页面类型判断区 ======
    function getCurrentPageType() {
        if (location.pathname === '/') {
            return 'mainPage';
        } else if (location.pathname.match(/\/video\/.*\//)) {
            return 'videoPage';
        } else if (location.pathname.match(/list\/watchlater.*/)) {
            return 'videoPageWatchList';
        } else if (location.pathname === '/all') {
            return 'searchPage';
        } else if (location.pathname.startsWith('/c/')) {
            return 'region';
        } else if (location.hostname === 'space.bilibili.com') {
            if (location.pathname.match(/\/\d+\/favlist/)) {
                return 'spaceFavlistPage';
            } else {
                return 'spacePage';
            }
        } else if (location.pathname.startsWith('/history')) {
            return 'historyPage';
        }
        return 'unknown';
    }
    // ====== 页面类型判断区结束 ======

    // ====== 综合评级配置 ======
    const RATING_CONFIG = [
        [100, '满分神作', '#FF0000'],    // ≥100%， -> 动画渐变，用于满分神作
        [95, '好评如潮', '#FF0000'],     // 95%-99.99%，红色表示高等级好评
        [80, '非常好评', '#FFD700'],     // 80%-94.99%，金色表示较好的评价
        [70, '多半好评', '#FFA500'],     // 70%-79.99%，橙色表示中等偏上的好评
        [40, '褒贬不一', '#FF4500'],     // 40%-69.99%，橙红色表示评价有好有坏
        [20, '多半差评', '#32CD32'],     // 20%-39.99%，柠檬绿表示多数负面评价
        [0, '差评如潮', '#9ACD32'],      // 0%-19.99%，黄绿色表示最低等级
    ];
    // ====== 综合评级配置结束 ======

    // ====== videoData 类 ======
    class videoData {
        videoStat = {
            view: 0,
            like: 0,
            coin: 0,
            favorite: 0,
            share: 0
        };

        constructor() {
            this.initVideoStat();
        }

        initVideoStat() {
            try {
                if (unsafeWindow?.__INITIAL_STATE__?.videoData?.stat) {
                    for (let key in this.videoStat) {
                        this.videoStat[key] = unsafeWindow.__INITIAL_STATE__.videoData.stat[key];
                    }
                }
            } catch (error) {
                console.error('初始化视频统计数据失败:', error);
            }
        }

        // 计算加权互动播放比
        getWeightedRatio() {
            return BiliRating.calculateWeightedRatio(this.videoStat);
        }

        // 获取显示用的好评率（对高互动视频进行评级提升）
        getDisplayRatio() {
            return BiliRating.getDisplayRatio(this.videoStat);
        }

        // 获取评级
        getRating() {
            const ratio = this.getDisplayRatio();
            return BiliRating.getRating(ratio);
        }

        // 获取纯文本评级（用于复制）
        getPlainRating() {
            const ratio = this.getDisplayRatio();
            const rating = this.getRating();
            return BiliRating.getPlainText(ratio, rating.text);
        }
    }
    // ====== videoData 类结束 ======

    // ====== 评级辅助函数 ======
    function getRating(ratio) {
        // 如果是特殊文本格式，直接返回满分神作评级
        if (ratio === "小破站必刷" || ratio === "刷到必看") {
            return { text: '满分神作', className: 'rainbow-text' };
        }

        // 否则按照数值进行判断
        const ratioNum = parseFloat(ratio);
        if (ratioNum >= 100) return { text: '满分神作', className: 'rainbow-text' };
        if (ratioNum >= 95) return { text: '好评如潮', className: 'red-text' };
        if (ratioNum >= 80) return { text: '非常好评', className: 'gold-text' };
        if (ratioNum >= 70) return { text: '多半好评', className: 'orange-text' };
        if (ratioNum >= 40) return { text: '褒贬不一', className: 'orangered-text' };
        if (ratioNum >= 20) return { text: '多半差评', className: 'limegreen-text' };
        return { text: '差评如潮', className: 'yellowgreen-text' };
    }
    // ====== 评级辅助函数结束 ======

    // ====== API数据处理函数 ======
    function processURIAndStat(uri, stat, urlToDataMap) {
        if (uri != null && uri !== '' && stat != null) {
            // 标准化数据
            const normalizedData = BiliRating.normalizeData(stat);

            // 只处理有效数据
            if (normalizedData.view > 0 &&
                (normalizedData.like > 0 ||
                 normalizedData.coin > 0 ||
                 normalizedData.favorite > 0 ||
                 normalizedData.share > 0)) {
                // 添加到map
                urlToDataMap.set(uri, normalizedData);
            }
        }
    }

    // ====== UI 渲染区 ======
    const BiliRatingUI = {
        // 主页卡片渲染
        addLikeRateToCard(node, urlToDataMap, key) {
            const stat = urlToDataMap.get(key);
            urlToDataMap.delete(key);
            // 检查统计信息容器，看是否已存在好评率元素
            const statsContainer = node.querySelector('div.bili-video-card__stats--left');
            if (!statsContainer) return; // 容器不存在则退出
            // 查找是否已存在带有特定类名或内容的元素
            if (statsContainer.querySelector('.bili-health-rating-span')) {
                return; // 如果找到了，说明已渲染过，退出
            }

            if (stat != null) {
                const span = node.querySelector('div.bili-video-card__stats--left').firstElementChild.cloneNode(false);
                // 使用完整的评级计算逻辑
                const ratingInfo = BiliRating.getFullRatingInfo(stat);
                const { displayRatio, rating } = ratingInfo;

                span.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="18"
                        height="18" fill="#ffffff" class="bili-video-card__stats--icon" style="margin-right:2px;">
                        <path d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z"
                        fill="currentColor"></path>
                    </svg>
                    <span class="bili-video-card__stats--text">
                        <span id="rating-value" class="${rating.className}">${displayRatio}${displayRatio === "小破站必刷" || displayRatio === "刷到必看" ? "" : "%"}</span>
                    </span>
                `;

                const ratingText = span.querySelector('#rating-value');
                ratingText.classList.add(rating.className);

                if (displayRatio === "小破站必刷" || displayRatio === "刷到必看") {
                    ratingText.textContent = displayRatio;
                } else {
                    ratingText.textContent = displayRatio + "%";
                }

                statsContainer.appendChild(span);
            }
        },
        // 分区页卡片渲染
        addLikeRateToCardForRegion(node, urlToDataMap, key) {
            const stat = urlToDataMap.get(key);
            urlToDataMap.delete(key);
            // 检查统计信息容器，看是否已存在好评率元素
            const statsContainer = node.querySelector('div.bili-cover-card__stats');
            if (!statsContainer) return; // 容器不存在则退出
            // 查找是否已存在带有特定类名或内容的元素
            if (statsContainer.querySelector('.bili-health-rating-span')) {
                return; // 如果找到了，说明已渲染过，退出
            }

            if (stat != null) {
                const span = node.querySelector('div.bili-cover-card__stats').firstElementChild.cloneNode(false);
                // 使用完整的评级计算逻辑
                const ratingInfo = BiliRating.getFullRatingInfo(stat);
                const { displayRatio, rating } = ratingInfo;

                span.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="18"
                        height="18" fill="#ffffff" style="margin-right:2px;">
                        <path d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z"
                        fill="currentColor"></path>
                    </svg>
                    <span>
                        <span id="rating-value" class="${rating.className}">${displayRatio}${displayRatio === "小破站必刷" || displayRatio === "刷到必看" ? "" : "%"}</span>
                    </span>
                `;

                const ratingText = span.querySelector('#rating-value');
                ratingText.classList.add(rating.className);

                if (displayRatio === "小破站必刷" || displayRatio === "刷到必看") {
                    ratingText.textContent = displayRatio;
                } else {
                    ratingText.textContent = displayRatio + "%";
                }

                statsContainer.appendChild(span);
            }
        },
        // 视频页渲染
        initVideoPageLogic() {
            if (!(unsafeWindow?.__INITIAL_STATE__?.videoData?.stat?.view)) {
                return;
            }
            GM.addStyle(`
                .video-toolbar-left-item{ width:auto !important; }
                .toolbar-left-item-wrap{ display:flex !important; margin-right: 12px !important; }
                .video-share-info{ width:auto !important; max-width:90px; }
                .video-share-info-text{ position: relative !important; }
                .comprehensive-rating { display: flex; align-items: center; font-weight: bold; margin-left: 12px; }
                .good-rate { display: flex; align-items: center; font-weight: bold; margin-left: 12px; color: #000000; }
                .copy-rating { display: flex; align-items: center; margin-left: 12px; cursor: pointer; color: #00aeec; font-weight: bold; }
                .copy-rating:hover { color: #ff6699; }
                .video-toolbar-item-icon { margin-right:6px !important; }
                .toolbar-right-note{ margin-right:5px !important; }
                .toolbar-right-ai{ margin-right:12px !important; }
            `);
            const videoStatData = unsafeWindow.__INITIAL_STATE__.videoData.stat;
            const ratingInfo = BiliRating.getFullRatingInfo(videoStatData);
            const div = { like: {}, coin: {}, favorite: {}, share: {} };
            for (let e in div) {
                div[e] = document.createElement('div');
                div[e].style.setProperty('display', 'flex');
                div[e].style.setProperty('align-items', 'center');
                const ratio = ratingInfo[e + 'Ratio'];
                div[e].innerHTML = `
                    <span style="margin-left: 5px;margin-right: 3px;font-size:medium;">≈</span>
                    <span id="data" style="font-family: math;font-size: initial;color:${ratio.color};">${ratio.rate}</span>
                    <span style="font-family: math;margin-left: 2px;"> %</span>
                `;
            }
            const comprehensiveRating = document.createElement('div');
            comprehensiveRating.className = 'comprehensive-rating';
            comprehensiveRating.innerHTML = `<span id="comprehensive-rating-text" class="${ratingInfo.rating.className}">${ratingInfo.rating.text}</span>`;
            const goodRate = document.createElement('div');
            goodRate.className = 'good-rate';
            if (ratingInfo.displayRatio === "小破站必刷" || ratingInfo.displayRatio === "刷到必看") {
                goodRate.innerHTML = `好评率：<span id="good-rate-text" class="${ratingInfo.rating.className}">${ratingInfo.displayRatio}</span>`;
            } else {
                goodRate.innerHTML = `好评率：<span id="good-rate-text" class="${ratingInfo.rating.className}">${ratingInfo.displayRatio}</span>%`;
            }
            const copyButton = document.createElement('div');
            copyButton.className = 'copy-rating';
            copyButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                    <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>
                <span>复制评级</span>
            `;
            function updateRatingDisplay() {
                const newStatData = unsafeWindow.__INITIAL_STATE__.videoData.stat;
                const newRatingInfo = BiliRating.getFullRatingInfo(newStatData);
                for (let e in div) {
                    let data = div[e].querySelector('#data');
                    const ratio = newRatingInfo[e + 'Ratio'];
                    data.style.color = ratio.color;
                    data.textContent = ratio.rate;
                }
                const goodRateText = goodRate.querySelector('#good-rate-text');
                goodRateText.className = newRatingInfo.rating.className;
                if (newRatingInfo.displayRatio === "小破站必刷" || newRatingInfo.displayRatio === "刷到必看") {
                    goodRate.innerHTML = `好评率：<span id="good-rate-text" class="${newRatingInfo.rating.className}">${newRatingInfo.displayRatio}</span>`;
                } else {
                    goodRate.innerHTML = `好评率：<span id="good-rate-text" class="${newRatingInfo.rating.className}">${newRatingInfo.displayRatio}</span>%`;
                }
                const ratingText = comprehensiveRating.querySelector('#comprehensive-rating-text');
                ratingText.textContent = newRatingInfo.rating.text;
                ratingText.className = newRatingInfo.rating.className;
            }
            let addElementObserver = new MutationObserver(function (mutationsList) {
                for (let mutation of mutationsList) {
                    if (mutation.target.classList != null && mutation.target.classList.contains('video-toolbar-right')) {
                        addElementObserver.disconnect();
                        document.querySelector('.video-like').parentNode.appendChild(div.like);
                        document.querySelector('.video-coin').parentNode.appendChild(div.coin);
                        document.querySelector('.video-fav').parentNode.appendChild(div.favorite);
                        document.querySelector('.video-share-wrap').parentNode.appendChild(div.share);
                        const toolbarLeft = document.querySelector('.video-toolbar-left');
                        toolbarLeft.appendChild(comprehensiveRating);
                        toolbarLeft.appendChild(goodRate);
                        toolbarLeft.appendChild(copyButton);
                        copyButton.addEventListener('click', () => {
                            const currentStatData = unsafeWindow.__INITIAL_STATE__.videoData.stat;
                            const currentRatingInfo = BiliRating.getFullRatingInfo(currentStatData);
                            navigator.clipboard.writeText(currentRatingInfo.plainText).then(() => {
                                const originalText = copyButton.querySelector('span').textContent;
                                copyButton.querySelector('span').textContent = '已复制!';
                                setTimeout(() => {
                                    copyButton.querySelector('span').textContent = originalText;
                                }, 2000);
                            });
                        });
                        break;
                    }
                }
            });
            addElementObserver.observe(document.querySelector('div.video-toolbar-right'), {
                childList: true,
                subtree: true,
                attributes: true
            });
            let currentBvid = unsafeWindow.__INITIAL_STATE__.videoData.bvid;
            new MutationObserver(function () {
                const newBvid = unsafeWindow.__INITIAL_STATE__.videoData.bvid;
                if (newBvid !== currentBvid) {
                    updateRatingDisplay();
                    currentBvid = newBvid;
                }
            }).observe(document.body, {
                childList: true,
                subtree: true
            });
        }
    };
    // ====== UI 渲染区结束 ======

    // ====== 各页面主逻辑区 ======
    function mainPageLogic() {
        // 等待DOM加载完成再执行卡片处理
        document.addEventListener('DOMContentLoaded', function() {
            // 主页卡片处理，每批10个bvid，3秒分批请求
            function handleCards() {
                // 匹配主页卡片并过滤已处理的
                const cardsToProcess = Array.from(document.querySelectorAll('div.feed-card')).filter(card => !card.dataset.biliRatingProcessed);

                // 给需要处理的卡片添加bvid属性，并标记为已处理中
                cardsToProcess.forEach(card => {
                    const linkElement = card.querySelector('.bili-video-card__image--link');
                    const link = linkElement?.href;
                    const match = link && /bv\w{10}/i.exec(link);
                    if (match) {
                        card.dataset.bvid = match[0]; // 存储bvid到卡片元素上
                        // 不在这里立即标记已处理，等到渲染成功再标记
                    } else {
                        // 如果没有bvid，标记为已处理，避免重复查找
                        card.dataset.biliRatingProcessed = 'true';
                    }
                });

                // 过滤掉没有bvid的卡片
                const validCardsToProcess = cardsToProcess.filter(card => card.dataset.bvid);

                // 分批请求并渲染
                fetchStatsInBatches(validCardsToProcess, 10, (card, bvid, stat) => {
                     const ratingInfo = BiliRating.getFullRatingInfo(stat);
                     BiliRatingUI.addLikeRateToCard(card, new Map([[bvid, stat]]), bvid);
                     // 渲染成功后标记卡片为已处理
                     card.dataset.biliRatingProcessed = 'true';
                });
            }
            // 初始处理
            handleCards();
            // 监听新卡片
            new MutationObserver(() => handleCards()).observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    function videoPageLogic() {
        document.addEventListener('DOMContentLoaded', function () {
            BiliRatingUI.initVideoPageLogic();
        });
    }
    function searchPageLogic() {
        // 等待DOM加载完成再执行卡片处理
        document.addEventListener('DOMContentLoaded', function() {
            function handleCards() {
                console.log('Search Page: handleCards called');
                const cards = Array.from(document.querySelectorAll('div.bili-video-card'));
                console.log(`Search Page: Found ${cards.length} total cards.`);

                const cardsToProcess = [];

                cards.forEach(card => {
                    const bvid = getCardIdentifier(card);
                    if (!bvid) {
                        // 没有bvid的卡片，标记为已处理，避免重复查找
                        card.dataset.biliRatingProcessed = 'true';
                        // console.log('Search Page: Card without bvid found, marking as processed.');
                        return;
                    }

                    // 如果卡片已经在处理中或已处理，跳过
                    if (card.dataset.biliRatingProcessed) {
                        // console.log(`Search Page: Card already processed or processing, skipping: ${bvid}`);
                        return;
                    }

                    // 如果卡片已经在 Map 中且已处理，跳过 (双重检查)
                    if (cardDataMap.has(bvid) && cardDataMap.get(bvid).processed) {
                         // console.log(`Search Page: Card in Map and processed, skipping: ${bvid}`);
                         card.dataset.biliRatingProcessed = 'true'; // 确保DOM元素上也有标记
                         return;
                    }

                    // 将卡片添加到待处理列表，并立即标记为处理中
                    cardsToProcess.push(card);
                    card.dataset.biliRatingProcessed = 'processing'; // 临时标记
                    card.dataset.bvid = bvid; // 存储bvid到卡片元素上，方便后续使用

                    // 如果卡片不在 Map 中，记录卡片位置和数据
                    if (!cardDataMap.has(bvid)) {
                         cardDataMap.set(bvid, {
                             element: card,
                             processed: false // Map中的processed标记会在渲染后更新
                         });
                    }
                     console.log(`Search Page: Added card ${bvid} to process queue.`);
                });

                console.log(`Search Page: ${cardsToProcess.length} cards to process in this batch.`);
                if (cardsToProcess.length === 0) return; // 没有需要处理的卡片，退出

                // 分批请求并渲染
                fetchStatsInBatches(cardsToProcess, 18, (card, bvid, stat) => {
                    console.log(`Search Page: Received stat for ${bvid}`);
                    // 渲染好评率
                    BiliRatingUI.addLikeRateToCard(card, new Map([[bvid, stat]]), bvid);

                    // 渲染成功后，更新 Map 中的标记为已处理
                    if (cardDataMap.has(bvid)) {
                         cardDataMap.get(bvid).processed = true;
                         console.log(`Search Page: Marked card ${bvid} in Map as processed.`);
                    }
                     // DOM元素上的标记在 fetchStatsInBatches 内部回调的末尾更新为 'true'
                     console.log(`Search Page: Rendered rating for ${bvid}.`);
                }, 1000);
            }

            // 初始处理
            handleCards();

            // 监听新卡片
            // 尝试更精确的监听目标
            const observerTarget = document.querySelector('.search-content .flow-module, .search-result'); // 示例选择器，可能需要调整
            if (observerTarget) {
                 console.log('Search Page: Observing a more specific target for mutations.');
                 new MutationObserver(() => handleCards()).observe(observerTarget, {
                     childList: true,
                     subtree: true
                 });
             } else {
                 console.log('Search Page: Specific mutation observer target not found, observing body.');
                 // 如果找不到更精确的目标，继续监听body
                 new MutationObserver(() => handleCards()).observe(document.body, {
                     childList: true,
                     subtree: true
                 });
             }
        });
    }
    function regionPageLogic() {
        // 等待DOM加载完成再执行卡片处理
        document.addEventListener('DOMContentLoaded', function() {
            // 分区页卡片处理，每批14个bvid，3秒分批请求
            function handleCards() {
                // 匹配分区页卡片并过滤已处理的
                const cardsToProcess = Array.from(document.querySelectorAll('div.bili-cover-card')).filter(card => !card.dataset.biliRatingProcessed);

                // 给需要处理的卡片添加bvid属性，并标记为已处理中
                cardsToProcess.forEach(card => {
                    const linkElement = card.querySelector('a');
                    const link = linkElement?.href;
                    const match = link && /bv\w{10}/i.exec(link);
                    if (match) {
                        card.dataset.bvid = match[0]; // 存储bvid到卡片元素上
                         // 不在这里立即标记已处理，等到渲染成功再标记
                    } else {
                         // 如果没有bvid，标记为已处理，避免重复查找
                        card.dataset.biliRatingProcessed = 'true';
                    }
                });

                // 过滤掉没有bvid的卡片
                const validCardsToProcess = cardsToProcess.filter(card => card.dataset.bvid);

                // 分批请求并渲染
                fetchStatsInBatches(validCardsToProcess, 14, (card, bvid, stat) => {
                     const ratingInfo = BiliRating.getFullRatingInfo(stat);
                     BiliRatingUI.addLikeRateToCardForRegion(card, new Map([[bvid, stat]]), bvid);
                     // 渲染成功后标记卡片为已处理
                     card.dataset.biliRatingProcessed = 'true';
                });
            }
            handleCards();
            new MutationObserver(() => handleCards()).observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    }
    function spaceOrHistoryPageLogic() {
        // 空间/历史页功能已移除
        console.log('空间页面功能已移除');
    }
    // ====== 各页面主逻辑区结束 ======

    // ====== 入口分发区 ======
    const pageType = getCurrentPageType();
    const pageLogicMap = {
        mainPage: mainPageLogic,
        videoPage: videoPageLogic,
        videoPageWatchList: videoPageLogic,
        searchPage: searchPageLogic,
        region: regionPageLogic,
        spacePage: spaceOrHistoryPageLogic,
        spaceFavlistPage: spaceOrHistoryPageLogic,
        historyPage: spaceOrHistoryPageLogic,
        unknown: () => {}
    };
    if (pageLogicMap[pageType]) {
        pageLogicMap[pageType]();
    }
    // ====== 入口分发区结束 ======
})();

// Add data cache and ongoing fetch tracking
const fullStatsCache = new Map();
const fetchingStats = new Map();

// Function to fetch full stats for a given BVid using the official API
async function fetchFullStats(bvid) {
    // Check if stats are already cached
    if (fullStatsCache.has(bvid)) {
        return fullStatsCache.get(bvid);
    }

    // Check if stats are already being fetched for this BVid
    if (fetchingStats.has(bvid)) {
        return fetchingStats.get(bvid);
    }

    // If not cached or fetching, start fetching
    const fetchPromise = new Promise(async (resolve, reject) => {
        // Use the confirmed API endpoint
        const apiUrl = `https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`;
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            // Check if the response is successful and contains the stat data
            if (data && data.code === 0 && data.data && data.data.stat) {
                const stat = data.data.stat;
                // Cache the fetched stats using BVid as the key
                fullStatsCache.set(bvid, stat);
                resolve(stat);
            } else {
                // Log a warning if data structure is unexpected
                console.warn(`Failed to get stat data for BVid ${bvid} from ${apiUrl}. Response data:`, data);
                reject(new Error(`Failed to get stat data for ${bvid}`));
            }
        } catch (error) {
            console.error(`Error fetching full stats for BVid ${bvid}:`, error);
            reject(error);
        } finally {
            // Remove the promise from tracking once done
            fetchingStats.delete(bvid);
        }
    });

    // Track the ongoing fetch promise
    fetchingStats.set(bvid, fetchPromise);

    return fetchPromise;
}

// ====== 统一数据处理模块 ======
const BiliRating = {
    // 权重配置
    WEIGHTS: {
        like: 1,      // 点赞权重
        coin: 8,      // 投币权重
        favorite: 4,  // 收藏权重
        share: 6,     // 转发权重
    },

    // 评级颜色配置
    RATING_COLORS: {
        rainbowText: 'rainbow-text',
        redText: 'red-text',
        goldText: 'gold-text',
        orangeText: 'orange-text',
        orangeredText: 'orangered-text',
        limegreenText: 'limegreen-text',
        yellowgreenText: 'yellowgreen-text'
    },

    // 标准化视频数据
    normalizeData(rawData) {
        return {
            view: parseInt(rawData.view) || 0,
            like: parseInt(rawData.like) || 0,
            coin: parseInt(rawData.coin) || 0,
            favorite: parseInt(rawData.favorite) || 0,
            share: parseInt(rawData.share) || 0
        };
    },

    // 计算加权互动比
    calculateWeightedRatio(data) {
        // 确保播放量足够
        if (data.view < 1000) return 0;

        // 计算加权互动总和
        const weightedInteractions =
            (data.like * this.WEIGHTS.like) +
            (data.coin * this.WEIGHTS.coin) +
            (data.favorite * this.WEIGHTS.favorite) +
            (data.share * this.WEIGHTS.share);

        // 返回加权比率 (乘以3是原始公式的一部分)
        return ((weightedInteractions / data.view) * 100 * 3).toFixed(2);
    },

    // 获取显示用好评率
    getDisplayRatio(data) {
        const ratio = parseFloat(this.calculateWeightedRatio(data));

        // 播放量大于2000万，直接返回"小破站必刷"
        if (data.view >= 20000000) {
            return "小破站必刷";
        }

        // 如果比率小于70，直接返回原值
        if (ratio < 70) return ratio.toFixed(2);

        // 应用特殊计算公式，提升高质量视频的评分
        const calculatedRatio = (90 + (ratio - 50) * (10 / (200 - 150))).toFixed(2);

        // 如果好评率超过100%，检查是否满足特定条件
        if (parseFloat(calculatedRatio) > 100) {
            // 检查四个条件
            let conditionsMet = 0;

            // 条件1：播放量大于300万
            if (data.view > 3000000) conditionsMet++;

            // 条件2：点赞率大于4%
            if ((data.like / data.view) * 100 > 4) conditionsMet++;

            // 条件3：收藏率大于14%
            if ((data.favorite / data.view) * 100 > 14) conditionsMet++;

            // 条件4：投币率大于15%
            if ((data.coin / data.view) * 100 > 15) conditionsMet++;

            // 检查是否满足小破站必刷的特殊条件
            const isSpecialCondition = (
                // 条件: 500万 <= 播放量 <= 1000万 且 (收藏率>=20% 或 投币率>=20% 或 转发率>=20%)
                (data.view >= 5000000 && data.view <= 10000000 &&
                ((data.favorite / data.view) * 100 >= 20 ||
                (data.coin / data.view) * 100 >= 20 ||
                (data.share / data.view) * 100 >= 20))
            );

            // 返回特定文本，根据满足条件的数量
            if (conditionsMet >= 3 || isSpecialCondition) {
                return "小破站必刷";
            } else if (conditionsMet >= 2) {
                return "刷到必看";
            } else {
                // 不满足足够条件，返回100%
                return "100.00";
            }
        }

        // 如果计算值超过100%但不满足上述条件，则返回100%
        return parseFloat(calculatedRatio) > 100 ? "100.00" : calculatedRatio;
    },

    // 获取评级
    getRating(displayRatio) {
        // 如果是特殊文本格式，直接返回满分神作评级
        if (displayRatio === "小破站必刷" || displayRatio === "刷到必看") {
            return { text: '满分神作', className: this.RATING_COLORS.rainbowText };
        }

        // 否则按照数值进行判断
        const ratioNum = parseFloat(displayRatio);
        if (ratioNum >= 100) return { text: '满分神作', className: this.RATING_COLORS.rainbowText };
        if (ratioNum >= 95) return { text: '好评如潮', className: this.RATING_COLORS.redText };
        if (ratioNum >= 80) return { text: '非常好评', className: this.RATING_COLORS.goldText };
        if (ratioNum >= 70) return { text: '多半好评', className: this.RATING_COLORS.orangeText };
        if (ratioNum >= 40) return { text: '褒贬不一', className: this.RATING_COLORS.orangeredText };
        if (ratioNum >= 20) return { text: '多半差评', className: this.RATING_COLORS.limegreenText };
        return { text: '差评如潮', className: this.RATING_COLORS.yellowgreenText };
    },

    // 计算各项比率
    calculateRatio(data, type, weight = 1) {
        if (!data.view || data.view <= 0 || !data[type] || data[type] <= 0) {
            return { rate: "0.00", color: "inherit" };
        }

        const rate = ((data[type] * weight) * 100 / data.view).toFixed(2);

        // 颜色分级逻辑
        let color = 'inherit';
        const num = data.view / (data[type] * weight);

        if (num <= 25) {
            color = 'Red'; // 红色（极高质量）
        } else if (num <= 35) {
            color = 'Orange'; // 橙色（高质量）
        } else if (num <= 45) {
            color = 'Green'; // 绿色（中质量）
        } else {
            color = 'Silver'; // 银色（极低质量）
        }

        return { rate, color };
    },

    // 获取视频的完整评级信息
    getFullRatingInfo(data) {
        const normalizedData = this.normalizeData(data);
        const displayRatio = this.getDisplayRatio(normalizedData);
        const rating = this.getRating(displayRatio);

        // 计算各项比率
        const likeRatio = this.calculateRatio(normalizedData, 'like', this.WEIGHTS.like);
        const coinRatio = this.calculateRatio(normalizedData, 'coin', this.WEIGHTS.coin);
        const favoriteRatio = this.calculateRatio(normalizedData, 'favorite', this.WEIGHTS.favorite);
        const shareRatio = this.calculateRatio(normalizedData, 'share', this.WEIGHTS.share);

        return {
            data: normalizedData,
            displayRatio,
            rating,
            likeRatio,
            coinRatio,
            favoriteRatio,
            shareRatio,
            // 用于复制功能
            plainText: this.getPlainText(displayRatio, rating.text)
        };
    },

    // 获取纯文本评级(用于复制)
    getPlainText(displayRatio, ratingText) {
        // 检查是否为特殊文本
        if (displayRatio === "小破站必刷" || displayRatio === "刷到必看") {
            return `该作品好评率: ${displayRatio} | 评级: ${ratingText}`;
        } else {
            return `该作品好评率: ${displayRatio}% | 评级: ${ratingText}`;
        }
    }
};

// ====== 卡片好评率数据获取通用基础模块 ======
// stat缓存
const statCache = new Map();

/**
 * 批量请求bvid的stat数据，分批调度
 * @param {string[]} bvids - 需要请求的bvid数组
 * @param {number} batchSize - 每批请求数量
 * @param {function} onStat - 拿到stat后回调(bvid, stat)
 */
async function fetchStatsInBatches(cardsToProcess, batchSize, onStat, delay) {
    let index = 0;
    function nextBatch() {
        const batch = cardsToProcess.slice(index, index + batchSize);
        if (batch.length === 0) return;
        Promise.all(batch.map(async card => {
            const bvid = card.dataset.bvid; // 从卡片元素上获取bvid
            if (statCache.has(bvid)) return;
            try {
                const res = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
                const data = await res.json();
                if (data.code === 0 && data.data && data.data.stat) {
                    statCache.set(bvid, data.data.stat);
                    onStat(card, bvid, data.data.stat); // 将卡片元素也传回回调
                }
            } catch (e) {
                console.error(`Error fetching or processing stat for ${bvid}:`, e);
            }
        })).then(() => {
            index += batchSize;
            if (index < cardsToProcess.length) setTimeout(nextBatch, delay);
        });
    }
    nextBatch();
}

// 页面类型自动判断并执行
(function(){
    const pageType = getCurrentPageType();
    if (pageType === 'mainPage') {
        processMainPageCards();
    } else if (pageType === 'searchPage' || pageType === 'region') {
        processOtherPageCards();
    }
})();
// ====== 自动批量请求渲染结束 ======

// ====== 卡片位置与数据缓存 ======
const cardDataMap = new Map(); // 存储卡片位置和数据的映射

// 生成卡片的唯一标识
function getCardIdentifier(card) {
    const linkElement = card.querySelector('a, .bili-video-card__image--link');
    const link = linkElement?.href;
    const match = link && /bv\w{10}/i.exec(link);
    return match ? match[0] : null;
}

// 主页卡片处理
function processMainPageCards() {
    document.addEventListener('DOMContentLoaded', function() {
        function handleCards() {
            const cards = Array.from(document.querySelectorAll('div.feed-card'));

            cards.forEach(card => {
                const bvid = getCardIdentifier(card);
                if (!bvid) return;

                // 如果卡片已经在处理中，跳过
                if (cardDataMap.has(bvid)) return;

                // 记录卡片位置和数据
                cardDataMap.set(bvid, {
                    element: card,
                    processed: false
                });

                // 获取统计数据
                fetchFullStats(bvid).then(stat => {
                    if (!stat) return;

                    const cardData = cardDataMap.get(bvid);
                    if (!cardData || cardData.processed) return;

                    // 标记为已处理
                    cardData.processed = true;
                    cardDataMap.set(bvid, cardData);

                    // 添加好评率
                    const ratingInfo = BiliRating.getFullRatingInfo(stat);
                    BiliRatingUI.addLikeRateToCard(card, new Map([[bvid, stat]]), bvid);
                });
            });
        }

        // 初始处理
        handleCards();

        // 监听新卡片
        new MutationObserver(() => handleCards()).observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// 搜索页卡片处理
function searchPageLogic() {
    document.addEventListener('DOMContentLoaded', function() {
        function handleCards() {
            const cards = Array.from(document.querySelectorAll('div.bili-video-card'));

            cards.forEach(card => {
                const bvid = getCardIdentifier(card);
                if (!bvid) return;

                // 如果卡片已经在处理中，跳过
                if (cardDataMap.has(bvid)) return;

                // 记录卡片位置和数据
                cardDataMap.set(bvid, {
                    element: card,
                    processed: false
                });

                // 获取统计数据
                fetchFullStats(bvid).then(stat => {
                    if (!stat) return;

                    const cardData = cardDataMap.get(bvid);
                    if (!cardData || cardData.processed) return;

                    // 标记为已处理
                    cardData.processed = true;
                    cardDataMap.set(bvid, cardData);

                    // 添加好评率
                    const ratingInfo = BiliRating.getFullRatingInfo(stat);
                    BiliRatingUI.addLikeRateToCard(card, new Map([[bvid, stat]]), bvid);
                });
            });
        }

        handleCards();

        new MutationObserver(() => handleCards()).observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}

// 分区页卡片处理
function regionPageLogic() {
    document.addEventListener('DOMContentLoaded', function() {
        function handleCards() {
            const cards = Array.from(document.querySelectorAll('div.bili-cover-card'));

            cards.forEach(card => {
                const bvid = getCardIdentifier(card);
                if (!bvid) return;

                // 如果卡片已经在处理中，跳过
                if (cardDataMap.has(bvid)) return;

                // 记录卡片位置和数据
                cardDataMap.set(bvid, {
                    element: card,
                    processed: false
                });

                // 获取统计数据
                fetchFullStats(bvid).then(stat => {
                    if (!stat) return;

                    const cardData = cardDataMap.get(bvid);
                    if (!cardData || cardData.processed) return;

                    // 标记为已处理
                    cardData.processed = true;
                    cardDataMap.set(bvid, cardData);

                    // 添加好评率
                    const ratingInfo = BiliRating.getFullRatingInfo(stat);
                    BiliRatingUI.addLikeRateToCardForRegion(card, new Map([[bvid, stat]]), bvid);
                });
            });
        }

        handleCards();

        new MutationObserver(() => handleCards()).observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
// ====== 自动批量请求渲染结束 ======