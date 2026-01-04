// ==UserScript==
// @name         OP.GG搜索增强
// @namespace    http://tampermonkey.net/
// @version      1.0.3
// @description  优化OP.GG页面的英雄搜索功能，支持使用中文诙谐名
// @author       s-opgg
// @match        https://www.op.gg/modes/*
// @icon         https://opgg-static.akamaized.net/meta/images/lol/latest/champion/Jinx.png?image=e_upscale,c_crop,h_103,w_103,x_9,y_9/q_auto:good,f_webp,w_160,h_160
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect      www.op.gg
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/525633/OPGG%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/525633/OPGG%E6%90%9C%E7%B4%A2%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const HERO_LIST_KEY = 'HeroList';
    const HERO_LIST_VERSION_KEY = "HeroListVersion";
    const LAST_UPDATE_TIME_KEY = "LastUpdateTime";
    const ONE_DAY_IN_MILLIS = 24 * 60 * 60 * 1000; // 1天的毫秒数
    let heroListData = [];
    let currentUrl = window.location.href;

    // 在页面加载时检查并更新英雄列表
    checkAndUpdateHeroList();

    // 添加手动更新菜单命令
    GM_registerMenuCommand('手动更新英雄搜索映射表', updateHeroList);

    // 监听 URL 变化，spa跳转时，重新执行run
    observeUrlChange();

    // 主逻辑
    run();

    // 主逻辑
    async function run() {
        console.log("[TamOPGG]run")

        // 初始化英雄列表数据
        heroListData = GM_getValue(HERO_LIST_KEY, []);
        await performDOMReplacement();
        // 隐藏广告、无关内容
        hiddenAd();

        try {
            const searchInput = await waitForElement("#cloneSearchInput")
            searchInput.addEventListener('input', debounce(handleInput, 500));
        } catch (e) {
            console.error("[TamOPGG]run", e)
        }
    };

    // 监听 URL 变化
    function observeUrlChange() {
        const observer = new MutationObserver(() => {
            const newUrl = window.location.href;
            if (newUrl !== currentUrl) {
                console.log("[TamOPGG] URL 发生变化，重新执行 run 函数");
                currentUrl = newUrl;
                run();
            }
        });

        // 监听 body 的变化（包括 URL 变化）
        observer.observe(document.body, { childList: true, subtree: true });
    }

    function handleInput() {
        // const championRankingMap = getChampionRankingMap();
        const inputValue = this.value.toLowerCase();
        // 根据输入的内容过滤匹配的英雄
        console.log("[TamOPGG]inputValue: ", inputValue)

        // 英雄选项卡
        const trList = document.querySelectorAll("#content-container aside table tbody tr")
        // 点击排行(强度 or 胜率)的时候，会改变index。
        // 直接每次都从img.src获取位置
        const imgList = document.querySelectorAll("#content-container aside table tbody tr img.bg-image")
        const matchAlias = [];
        heroListData.filter(({ keywords, alias }) => {
            const isMatchHero = keywords?.includes(inputValue);
            if (isMatchHero) {
                matchAlias.push(alias.toLowerCase())
            }
        });
        console.log("[TamOPGG]matchAlias: ", matchAlias)


        imgList.forEach((el, i) => {
            const curHeroDom = trList[i];
            const isMatchHero = matchAlias.includes(getAlisaByImgSrc(el.src));

            if (isMatchHero) {
                curHeroDom.style.display = "table-row"
            } else {
                curHeroDom.style.display = "none";
            }
        })
    }

    // 获取img.src上面的alias
    function getAlisaByImgSrc(url) {
        const regex = /\/([^\/]+)\.png/;
        const match = url.match(regex);
        return match[1].toLowerCase();
    }

    // 替换原来的input
    async function performDOMReplacement() {
        // 获取 search 输入框
        console.log("[TamOPGG]performDOMReplacement")

        try {
            const searchInput = await waitForElement('#filterChampionInput');
            // console.log('[TamOPGG]Element found:', searchInput);
            // 克隆输入框
            const clonedInput = searchInput.cloneNode(true);
            clonedInput.id = "cloneSearchInput";
            // 替换原输入框
            searchInput.parentNode.replaceChild(clonedInput, searchInput);
            // 在这里添加你要执行的操作
        } catch (error) {
            console.error(error);
        }
    }

    // 隐藏无关内容、广告
    function hiddenAd() {
        console.log("[TamOPGG]关闭广告");
        try {
            const adSelector = [".page-title", "#opgg-kit-house-image-banner", "#banner-container"];
            adSelector.forEach(selector => {
                waitForElements(selector).then(els => {
                    els.forEach(el => {
                        el.style.display = "none";
                    })
                })
            })
        } catch (e) {
            console.error("[TamOPGG]关闭广告", e)
        }
    }

    // 检查并更新英雄列表
    function checkAndUpdateHeroList() {
        const lastUpdateTime = GM_getValue(LAST_UPDATE_TIME_KEY, 0);
        const currentTime = Date.now();
        const localVersion = GM_getValue(HERO_LIST_VERSION_KEY, '');

        if (currentTime - lastUpdateTime > ONE_DAY_IN_MILLIS || !localVersion) {
            updateHeroList();
        } else {
            console.log('[TamOPGG] 英雄列表1天内已更新过，跳过（如需更新请手动）。');
        }
    }

    // 更新英雄列表
    function updateHeroList() {
        const url = 'https://game.gtimg.cn/images/lol/act/img/js/heroList/hero_list.js';

        GM_xmlhttpRequest({
            method: 'GET',
            url: url,
            onload: function (response) {
                if (response.status === 200) {
                    const {hero, version} = JSON.parse(response.responseText);
                    const lastVersion = GM_getValue(HERO_LIST_VERSION_KEY);
                    if(lastVersion === version) {
                        console.log('[TamOPGG] 英雄列表已是最新，版本号:', version);
                        return;
                    };

                    const heroList = hero.map(({ alias, keywords, name }) => ({
                        name,
                        alias,
                        keywords
                    }))
                    GM_setValue(HERO_LIST_KEY, heroList);
                    GM_setValue(HERO_LIST_VERSION_KEY, version);
                    GM_setValue(LAST_UPDATE_TIME_KEY, Date.now());
                    console.log(`[TamOPGG] 英雄列表更新成功，版本号: ${version}`);
                    console.log('[TamOPGG] 更新后的英雄列表:', heroList);
                } else {
                    console.error('[TamOPGG] 获取英雄列表失败:', response.statusText);
                }
            },
            onerror: function (error) {
                console.error('[TamOPGG] 请求出错:', error);
            },
        });
    }

    function waitForElement(selector, { timeout = 5000, single = true } = {}) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        let result;
                        result = single ? document.querySelector(selector) : document.querySelectorAll(selector);

                        if ((single && result) || (!single && result.length > 0)) {
                            observer.disconnect();
                            resolve(result);
                            return;
                        }
                    }
                }
                if (Date.now() - startTime > timeout) {
                    observer.disconnect();
                    reject(new Error(`[enhancer]waitForElement: 元素"${selector}"没找到，within ${timeout}ms.`));
                }
            });

            const config = { childList: true, subtree: true };
            observer.observe(document.documentElement, config);
        });
    }

    function waitForElements(selector, { timeout = 5000 } = {}) {
        return waitForElement(selector, { timeout, single: false })
    }

    // 防抖：多次触发只执行最后一次
    function debounce(cb, delay) {
        let timer = null;

        return function (...args) {
            timer && clearTimeout(timer);
            timer = setTimeout(() => {
                cb.apply(this, args);
            }, delay)
        }
    }
})();