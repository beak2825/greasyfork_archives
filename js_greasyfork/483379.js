// ==UserScript==
// @name         B站显示点赞率、投币率、收藏率
// @namespace    http://tampermonkey.net/
// @version      1.1.4
// @description  显示b站 | bilibili | 哔哩哔哩 点赞率、投币率、收藏率
// @license      MIT
// @author       魂hp
// @website      https://www.bilibili.com/opus/880791333061525569
// @match        http*://www.bilibili.com/
// @match        http*://www.bilibili.com/?*
// @match        http*://www.bilibili.com/video/*
// @match        http*://www.bilibili.com/list/watchlater*
// @match        http*://www.bilibili.com/c/*
// @match        http*://search.bilibili.com/all?*
// @icon         data:image/jpeg;base64,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
// @grant        GM.addStyle
// @grant        unsafeWindow
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue


// @downloadURL https://update.greasyfork.org/scripts/483379/B%E7%AB%99%E6%98%BE%E7%A4%BA%E7%82%B9%E8%B5%9E%E7%8E%87%E3%80%81%E6%8A%95%E5%B8%81%E7%8E%87%E3%80%81%E6%94%B6%E8%97%8F%E7%8E%87.user.js
// @updateURL https://update.greasyfork.org/scripts/483379/B%E7%AB%99%E6%98%BE%E7%A4%BA%E7%82%B9%E8%B5%9E%E7%8E%87%E3%80%81%E6%8A%95%E5%B8%81%E7%8E%87%E3%80%81%E6%94%B6%E8%97%8F%E7%8E%87.meta.js
// ==/UserScript==

(function () {
    // representation字段表示比率的表示形式，该字段为 fractions 时表示为分数，该字段为 percentage 时表示为百分比
    let representation = GM_getValue('representation');
    if (representation == null) {
        GM_setValue('representation', 'percentage');
        representation = 'percentage';
    }
    const isFractions = representation === 'fractions';

    // 注册脚本菜单以实现两种表示方式的相互转换
    GM_registerMenuCommand(
        '切换比率的表示方式（百分比和分数）',
        function () {
            representation = representation === 'fractions' ? 'percentage' : 'fractions';
            GM_setValue('representation', representation);
            location.reload();
        }
    );
    // 判断当前页面
    let currentPage = 'unknown';
    if (location.pathname === '/') {
        currentPage = 'mainPage';
    } else if (location.pathname.match(/\/video\/.*\//)) {
        currentPage = 'videoPage';
    } else if (location.pathname.match(/list\/watchlater.*/)) {
        currentPage = 'videoPageWatchList';
    } else if (location.pathname === '/all') {
        currentPage = 'searchPage';
    } else if (location.pathname.startsWith('/c/')) {
        currentPage = 'region';
    }
    // 工具函数：根据播放量和对应的数据算出比率并获取对应的颜色
    function getRateAndColor(view, oneOfVideoStat) {
        let res = {
            rate: 0,
            color: 'inherit'
        };
        let num = view / oneOfVideoStat;
        if (num === Infinity) {
            return res;
        }
        // 当比率大于十分之一设置为橘色，大于二十五分之一设置为紫色，其他则设置为黑色（如果需要添加其他的范围对应的颜色或修改颜色可以改这部分）
        if (num <= 10) {
            if (isFractions) {
                res.rate = num.toFixed(2);
            } else {
                res.rate = (oneOfVideoStat * 100 / view).toFixed(2);
            }
            res.color = 'DarkOrange';
        } else if (num <= 25) {
            if (isFractions) {
                res.rate = num.toFixed(1);
            } else {
                res.rate = (oneOfVideoStat * 100 / view).toFixed(2);
            }
            res.color = 'violet';
        } else {
            if (isFractions) {
                res.rate = num.toFixed(0);
            } else {
                res.rate = (oneOfVideoStat * 100 / view).toFixed(2);
            }
        }
        return res;
    }
    // 工具函数，用于对uri和stat进行加工，并添加到 urlToDataMap 中
    function processURIAndStat(uri, stat, urlToDataMap) {
        if (uri != null && uri !== '' && stat != null) {
            const rateAndColor = getRateAndColor(stat.view, stat.like);
            stat.rate = rateAndColor.rate;
            stat.color = rateAndColor.color;
            urlToDataMap.set(uri, stat);
        }
    }
    // 工具函数，用于将对应格式的点赞路添加到视频卡片上
    function addLikeRateToCard(node, urlToDataMap, key) {
        const stat = urlToDataMap.get(key);
        // 下面的这一行代码会导致浏览器尺寸发生变化时部分视频卡片上的点赞率消失，如果你很介意这一点可以将下面这一行代码删掉或注释掉（就是代码前面加上//），但是注释掉或者删掉会导致脚本占用更多的空间（不会太多）
        urlToDataMap.delete(key);
        if (stat != null) {
            const span = node.querySelector('div.bili-video-card__stats--left').firstElementChild.cloneNode(false);
            if (isFractions) {
                span.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="18"
                                        height="18" fill="#ffffff" class="bili-video-card__stats--icon" style="margin-right:2px;">
                                        <path
                                            d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z"
                                            fill="currentColor"></path>
                                    </svg><span class="bili-video-card__stats--text">1/<span class="bili-video-card__stats--text" id="data"></span></span>
                                `;

            } else {
                span.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="18"
                                        height="18" fill="#ffffff" class="bili-video-card__stats--icon" style="margin-right:2px;">
                                        <path
                                            d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z"
                                            fill="currentColor"></path>
                                    </svg><span class="bili-video-card__stats--text"><span class="bili-video-card__stats--text" id="data"></span>%</span>
                                `;
            }
            let data = span.querySelector('#data');
            data.style.color = stat.color;
            data.textContent = stat.rate;
            node.querySelector('.bili-video-card__stats--left').appendChild(span);
        }
    }

    // 工具函数，用于将对应格式的点赞路添加到视频卡片上(针对分区)
    function addLikeRateToCardForRegion(node, urlToDataMap, key) {
        const stat = urlToDataMap.get(key);
        urlToDataMap.delete(key);
        if (stat != null) {
            const span = node.querySelector('div.bili-cover-card__stats').firstElementChild.cloneNode(false);
            if (isFractions) {
                span.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="18"
                                        height="18" fill="#ffffff" style="margin-right:2px;">
                                        <path
                                            d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z"
                                            fill="currentColor">
                                        </path>
                                    </svg>
                                    <span>1/<span id="data"></span></span>
                                `;

            } else {
                span.innerHTML = `
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" width="18"
                                        height="18" fill="#ffffff" style="margin-right:2px;">
                                        <path
                                            d="M594.176 151.168a34.048 34.048 0 0 0-29.184 10.816c-11.264 13.184-15.872 24.064-21.504 40.064l-1.92 5.632c-5.632 16.128-12.8 36.864-27.648 63.232-25.408 44.928-50.304 74.432-86.208 97.024-23.04 14.528-43.648 26.368-65.024 32.576v419.648a4569.408 4569.408 0 0 0 339.072-4.672c38.72-2.048 72-21.12 88.96-52.032 21.504-39.36 47.168-95.744 63.552-163.008a782.72 782.72 0 0 0 22.528-163.008c0.448-16.832-13.44-32.256-35.328-32.256h-197.312a32 32 0 0 1-28.608-46.336l0.192-0.32 0.64-1.344 2.56-5.504c2.112-4.8 5.12-11.776 8.32-20.16 6.592-17.088 13.568-39.04 16.768-60.416 4.992-33.344 3.776-60.16-9.344-84.992-14.08-26.688-30.016-33.728-40.512-34.944zM691.84 341.12h149.568c52.736 0 100.864 40.192 99.328 98.048a845.888 845.888 0 0 1-24.32 176.384 742.336 742.336 0 0 1-69.632 178.56c-29.184 53.44-84.48 82.304-141.76 85.248-55.68 2.88-138.304 5.952-235.712 5.952-96 0-183.552-3.008-244.672-5.76-66.432-3.136-123.392-51.392-131.008-119.872a1380.672 1380.672 0 0 1-0.768-296.704c7.68-72.768 70.4-121.792 140.032-121.792h97.728c13.76 0 28.16-5.504 62.976-27.456 24.064-15.104 42.432-35.2 64.512-74.24 11.904-21.184 17.408-36.928 22.912-52.8l2.048-5.888c6.656-18.88 14.4-38.4 33.28-60.416a97.984 97.984 0 0 1 85.12-32.768c35.264 4.096 67.776 26.88 89.792 68.608 22.208 42.176 21.888 84.864 16 124.352a342.464 342.464 0 0 1-15.424 60.544z m-393.216 477.248V405.184H232.96c-40.448 0-72.448 27.712-76.352 64.512a1318.912 1318.912 0 0 0 0.64 282.88c3.904 34.752 32.96 61.248 70.4 62.976 20.8 0.96 44.8 1.92 71.04 2.816z"
                                            fill="currentColor">
                                        </path>
                                    </svg>
                                    <span><span id="data"></span>%</span>
                                `;
            }
            let data = span.querySelector('#data');
            data.style.color = stat.color;
            data.textContent = stat.rate;
            const statNode = node.querySelector('.bili-cover-card__stats');
            const lastChild = statNode.lastChild;
            if (lastChild) {
                statNode.insertBefore(span, lastChild);
            } else {
                statNode.appendChild(span);
            }
        }
    }

    // 根据 currentPage 执行不同的逻辑
    if (currentPage === 'mainPage') {
        const originFetch = unsafeWindow.fetch;
        const recommendUrlRegex = /^(?:http:|https:)?\/\/api.bilibili.com\/.*?\/rcmd\?.*$/;
        const urlToDataMap = new Map(); // 一个map，键是视频uri，值为该视频的各项数据（播放、点赞、弹幕）
        // 劫持b站的 fetch 请求，判断该 fetch 请求是不是包含视频数据，如果包含则将视频数据加入 map
        // 参考自 https://juejin.cn/post/7135590843544502308
        window.unsafeWindow.fetch = (url, options) => {
            return originFetch(url, options).then(async (response) => {
                if (recommendUrlRegex.test(url)) {
                    const responseClone = response.clone();
                    let res = await responseClone.json();
                    for (let tmp of res.data.item) {
                        processURIAndStat(tmp.uri, tmp.stat, urlToDataMap);
                    }
                }
                return response;
            });
        };
        // 当 DOMContentLoaded 事件发生后，将不是动态加载的那些视频的数据加入到 map 中
        document.addEventListener('DOMContentLoaded', function () {
            for (let tmp of unsafeWindow.__pinia.feed.data.recommend.item) {
                processURIAndStat(tmp.uri, tmp.stat, urlToDataMap);
            }
            const cards = document.querySelectorAll('div.feed-card');
            for (let card of cards) {
                addLikeRateToCard(card, urlToDataMap, card.querySelector('.bili-video-card__image--link')?.href);
            }
            // 创建MutationObserver，监控新插入的视频卡片
            new MutationObserver((mutationsList) => {
                // 遍历每一个发生变化的mutation
                for (let mutation of mutationsList) {
                    // 检查每个添加的子节点
                    if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                        // 遍历每个添加的子节点
                        mutation.addedNodes.forEach(node => {
                            if (node.nodeName === 'DIV' && (node.classList.contains('bili-feed-card') || node.classList.contains('feed-card')) ) {
                                addLikeRateToCard(node, urlToDataMap, node.querySelector('.bili-video-card__image--link')?.href);
                            }
                        });
                    }
                }
            }).observe(document, {
                childList: true,
                subtree: true
            });
        });
    } else if (currentPage === 'videoPage' || currentPage === 'videoPageWatchList') {
        document.addEventListener('DOMContentLoaded', function () {
            if (!(unsafeWindow?.__INITIAL_STATE__?.videoData?.stat?.view)) {
                return;
            }
            // 修改样式
            GM.addStyle(`
                .video-toolbar-left-item{
                    width:auto !important;
                }
                .toolbar-left-item-wrap{
                    display:flex !important;
                    margin-right: 12px !important;
                }
                .video-share-info{
                    width:auto !important;
                    max-width:90px;
                }
                .video-share-info-text{
                    position: relative !important;
                }
            `);
            // 百分比形式会占用更大的空间，需要额外添加样式
            if (!isFractions) {
                GM.addStyle(`
                    .video-toolbar-item-icon {
                        margin-right:6px !important;
                    }
                    .toolbar-right-note{
                        margin-right:5px !important;
                    }
                    .toolbar-right-ai{
                        margin-right:12px !important;
                    }
                `);
            }

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
                    for (let key in this.videoStat) {
                        this.videoStat[key] = unsafeWindow.__INITIAL_STATE__.videoData.stat[key];
                    }
                }
                // 计算点赞率、投币率、收藏率、转发率，并获取对应的颜色
                getRateAndColorByNameStr(nameStr) {
                    return getRateAndColor(this.videoStat.view, this.videoStat[nameStr]);
                }
            }

            const vData = new videoData();
            //添加元素
            const div = {
                like: {},
                coin: {},
                favorite: {},
                share: {}
            };
            for (let e in div) {
                div[e] = document.createElement('div');
                div[e].style.setProperty('display', 'flex')
                div[e].style.setProperty('align-items', 'center')
                div[e].style.setProperty('color', 'var(--text2)')
                if (isFractions) {
                    div[e].innerHTML = `
                        <span style="margin-left: 5px;margin-right: 3px;font-size:medium;">≈</span>
                        <math xmlns="http://www.w3.org/1998/Math/MathML" style="font-size: 23px;">
                            <mfrac>
                                <mrow>
                                    <mn>1</mn>
                                    </mrow><mrow>
                                    <mi id="data"></mi>
                                </mrow>
                            </mfrac>
                        </math>
			        `;
                } else {
                    div[e].innerHTML = `
                        <span style="margin-left: 5px;margin-right: 3px;font-size:medium;">≈</span>
                        <span id="data" style="font-family: math;font-size: initial;"></span><span style="font-family: math;margin-left: 2px;"> %</span>
			        `;
                }
            }
            // 更新数据
            function updateRate() {
                for (let e in div) {
                    let data = div[e].querySelector('#data');
                    let rateAndColor = vData.getRateAndColorByNameStr(e);
                    data.style.setProperty('color', rateAndColor.color);
                    data.textContent = rateAndColor.rate;
                }
            }
            updateRate();

            let addElementObserver = new MutationObserver(function (mutationsList) {
                for (let mutation of mutationsList) {
                    if (mutation.target.classList != null && mutation.target.classList.contains('video-toolbar-right')) {
                        addElementObserver.disconnect();
                        document
                            .querySelector('.video-like')
                            .parentNode.appendChild(div.like);
                        document
                            .querySelector('.video-coin')
                            .parentNode.appendChild(div.coin);
                        document
                            .querySelector('.video-fav')
                            .parentNode.appendChild(div.favorite);
                        document
                            .querySelector('.video-share-wrap')
                            .parentNode.appendChild(div.share);
                        break;
                    }
                }
            });
            addElementObserver.observe(document.querySelector('div.video-toolbar-right'), {
                childList: true,
                subtree: true,
                attributes: true
            });

            // 当 bvid 发生改变时更新数据
            let currentBvid = unsafeWindow.__INITIAL_STATE__.videoData.bvid;
            new MutationObserver(function () {
                const newBvid = unsafeWindow.__INITIAL_STATE__.videoData.bvid;
                if (newBvid !== currentBvid) {
                    vData.initVideoStat();
                    updateRate();
                    currentBvid = newBvid;
                }
            }).observe(document.body, {
                childList: true,
                subtree: true
            });
        });
    } else if (currentPage === 'searchPage') {
        // 修改样式
        GM.addStyle(`
            .bili-video-card__stats--left{
                flex-wrap: wrap;
                align-self: flex-end;
            }
        `);
        const bvToDataMap = new Map(); // 一个map，键是视频bv号，值为该视频的各项数据（播放、点赞）

        // 劫持 fetch 请求
        const originFetch = unsafeWindow.fetch;
        window.unsafeWindow.fetch = (url, options) => {
            return originFetch(url, options).then(async (response) => {
                if (/^(?:http:|https:)?\/\/api\.bilibili\.com\/x\/web-interface\/wbi\/search\/type/.test(url)) {
                    const responseClone = response.clone();
                    let res = await responseClone.json();
                    res['data']['result']
                        .filter(data => data.type === 'video')
                        .forEach(data => processURIAndStat(data.bvid, { view: data.play, like: data.like }, bvToDataMap));
                    // console.log(bvToDataMap);
                } else if (/^(?:http:|https:)?\/\/api\.bilibili\.com\/x\/web-interface\/wbi\/search\/all\/v2/.test(url)) {
                    const responseClone = response.clone();
                    let res = await responseClone.json();
                    res['data']['result'][11]['data']
                        .filter(data => data.type === 'video')
                        .forEach(data => processURIAndStat(data.bvid, { view: data.play, like: data.like }, bvToDataMap));
                    // console.log(bvToDataMap);
                }
                return response;
            });
        };

        // 调试代码，暂时留着
        // window.addEventListener('load', function () {
        //     new MutationObserver((mutationsList) => {
        //         // 遍历每一个发生变化的mutation
        //         for (let mutation of mutationsList) {
        //             if (mutation.target.nodeName !== 'svg' && !['feed-card-body', 'bili-video-card__image--wrap'].some(str => mutation.target.classList.contains(str))) {
        //                 console.log(mutation)
        //             }
        //         }
        //     }).observe(document.querySelector('div.search-content'), {
        //         childList: true,
        //         subtree: true
        //     });
        // });


        // 当 DOMContentLoaded 事件发生后，将不是动态加载的那些视频的数据加入到 map 中
        document.addEventListener('DOMContentLoaded', function () {
            // debugger;
            let data = unsafeWindow.__pinia.searchTypeResponse?.searchTypeResponse?.result;
            if (data === undefined) {
                data = unsafeWindow.__pinia.searchResponse.searchAllResponse.result[11].data;
            }
            data.filter(data => data.type === 'video')
                .forEach(data => processURIAndStat(data.bvid, { view: data.play, like: data.like }, bvToDataMap));
            document.querySelectorAll('div.video.search-all-list div.bili-video-card').values()
                .filter(card => card.querySelector('a') != null && /bv\w{10}/i.exec(card.querySelector('a').href) != null)
                .forEach(card => addLikeRateToCard(card, bvToDataMap, /bv\w{10}/i.exec(card.querySelector('a').href)[0]));
        });

        // 创建MutationObserver，监控新插入的视频卡片
        new MutationObserver((mutationsList) => {
            mutationsList
                .filter(mutation => mutation.type === 'childList' && mutation.addedNodes.length > 0)
                .forEach(
                    mutation => mutation.addedNodes
                        .forEach(node => {
                            if (node.nodeName === 'DIV' && node.classList.contains('search-page') && mutation.target.classList.contains('search-page-wrapper')) {
                                node.querySelectorAll('div.bili-video-card').values()
                                    .filter(card => card.querySelector('a') != null && /bv\w{10}/i.exec(card.querySelector('a').href) != null)
                                    .forEach(card => addLikeRateToCard(card, bvToDataMap, /bv\w{10}/i.exec(card.querySelector('a').href)[0]));
                            } else if (node.nodeName === 'DIV' && ['video', 'search-all-list'].every(str => node.classList.contains(str))) {
                                // 从其他页返回第一页时
                                node.querySelectorAll('div.video.search-all-list div.bili-video-card').values()
                                    .filter(card => card.querySelector('a') != null && /bv\w{10}/i.exec(card.querySelector('a').href) != null)
                                    .forEach(card => addLikeRateToCard(card, bvToDataMap, /bv\w{10}/i.exec(card.querySelector('a').href)[0]));
                            }
                        })
                );
        }).observe(document, {
            childList: true,
            subtree: true
        });
    } else if (currentPage === 'region') {
        const originFetch = unsafeWindow.fetch;
        const bvidToDataMap = new Map(); // 一个map，键是视频bv号，值为该视频的各项数据（播放、点赞、弹幕）
        // 劫持b站的 fetch 请求，判断该 fetch 请求是不是包含视频数据，如果包含则将视频数据加入 map
        window.unsafeWindow.fetch = (url, options) => {
            return originFetch(url, options).then(async (response) => {
                if (/^(?:http:|https:)?\/\/api.bilibili.com\/.*?\/rcmd\?.*$/.test(url)) {
                    const responseClone = response.clone();
                    let res = await responseClone.json();
                    for (let tmp of res.data.archives) {
                        processURIAndStat(tmp.bvid, tmp.stat, bvidToDataMap);
                    }
                }
                return response;
            });
        };

        // 创建 MutationObserver，监控新加入的 videoCard 并对其进行处理
        new MutationObserver((mutationsList) => {
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    mutation.addedNodes.values()
                        .filter(node => node.nodeName === 'DIV')
                        .forEach(node => {
                            if (node.classList.contains('channel-page__body')) {
                                node.querySelectorAll('div.feed-card.head-card').values().forEach(
                                    card => addLikeRateToCardForRegion(card, bvidToDataMap, /bv\w{10}/i.exec(card.querySelector('a').href)[0])
                                );
                            } else if (node.classList.contains('feed-cards')) {
                                for (const card of node.children) {
                                    addLikeRateToCardForRegion(card, bvidToDataMap, /bv\w{10}/i.exec(card.querySelector('a').href)[0]);
                                }
                            } else if (node.classList.contains('feed-card')) {
                                addLikeRateToCardForRegion(node, bvidToDataMap, /bv\w{10}/i.exec(node.querySelector('a').href)[0]);
                            }
                        });
                }
            }
        }).observe(document, {
            childList: true,
            subtree: true
        });
    }
})();