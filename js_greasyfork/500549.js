// ==UserScript==
// @name         屏蔽 B 站赛事内容
// @namespace    http://tampermonkey.net/
// @version      2024-07-08
// @description  屏蔽 B 站 PC 端个人主页、赛事主页等页面部分比赛内容，比如屏蔽 LOL 所有赛事，也可自定义关键词，让眼睛不再受到污染
// @author       GurifYuanin
// @match        https://t.bilibili.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500549/%E5%B1%8F%E8%94%BD%20B%20%E7%AB%99%E8%B5%9B%E4%BA%8B%E5%86%85%E5%AE%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/500549/%E5%B1%8F%E8%94%BD%20B%20%E7%AB%99%E8%B5%9B%E4%BA%8B%E5%86%85%E5%AE%B9.meta.js
// ==/UserScript==


(function() {
    'use strict';
    // 关键字
    const lolKeywords = [
        'Doinb', 'Rookie', 'TheShy', 'Faker', 'Chovy', 'Ruler',
        'Bin', 'Knight', 'Xun', 'Elk', 'JackyLove', 'Tian', 'Meiko', '369',
        'T1', 'GenG', 'DK', 'KT',
        'BLG', 'TES', 'JDG', 'LNG', 'WBG', 'FPX', 'IG', 'EDG', 'RNG',
        'LOL', 'LPL', 'LCK', '英雄联盟'
    ].map(keyword => new RegExp(keyword, 'i'));

    function set(obj, path, value) {
        const paths = path.split('.');
        let src = obj;
        for (let i = 0; i < paths.length; i++) {
            const key = paths[i];
            if (i === paths.length - 1) {
                src[key] = value;
            } else {
                src = src[key];
            }
        }
    }

    function get(obj, path) {
        const paths = path.split('.');
        let src = obj;
        for (let i = 0; i < paths.length; i++) {
            const key = paths[i];
            if (i === paths.length - 1) {
                return src[key];
            } else {
                src = src[key];
            }
        }
    }

    function updateResponse({
        json,
        path,
        key
    }) {
        set(
            json,
            path,
            get(json, path)?.filter(item => !lolKeywords.some(keyword => keyword.test(get(item, key))))
        );
    }
    async function updateResponseByFetch({
        reqUrl,
        matchUrl,
        resp,
        path,
        key
    }) {
        if (reqUrl.includes(matchUrl)) {
            const json = await resp.json();
            updateResponse({ json, path, key });
            resp.json = () => Promise.resolve(json);
        }
    }

    const FETCH_CONFIGS = [
        // 个人主页右侧话题接口
        {
            matchUrl: '/x/topic/web/dynamic/rcmd',
            path: 'data.topic_items',
            key: 'name'
        },
        // 搜索栏热搜
        {
            matchUrl: '/x/web-interface/wbi/search/square',
            path: 'data.trending.list',
            key: 'show_name'
        },
    ];
    const XML_CONFIGS = [
        // 赛事页面赛程日历
        {
            matchUrl: '/x/esports/component/contests/link',
            path: ['data.history', 'data.future'],
            key: ['season.title', 'season.title']
        },
        // 赛事页面推荐栏
        {
            matchUrl: '/x/esports/season/recommend',
            path: 'data',
            key: 'game.title'
        },
        // 赛事页面头部封面
        {
            matchUrl: '/x/web-show/res/locs',
            path: 'data.4941',
            key: 'name'
        }
    ];

    // 拦截 fetch
    const _fetch = fetch;
    window.fetch = async (url, ...args) => {
        const resp = await _fetch(url, ...args);
        for (const config of FETCH_CONFIGS) {
            await updateResponseByFetch({
                resp,
                reqUrl: url,
                ...config,
            });
        }
        return resp;
    }

    // 拦截 XMLHttpRequest
    const originalOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url, async) {
        this.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                for (const config of XML_CONFIGS) {
                    if (url.includes(config.matchUrl)) {
                        const json = JSON.parse(this.responseText);
                        Object.defineProperty(this, 'responseText', {
                            get() {
                                if (Array.isArray(config.path)) {
                                    for (let i = 0; i < config.path.length; i++) {
                                        updateResponse({ json, path: config.path[i], key: config.key[i] });
                                    }
                                } else {
                                    updateResponse({ json, path: config.path, key: config.key });
                                }
                                return json;
                            }
                        });
                    }
                }
            }
        }, false);
        originalOpen.apply(this, arguments);
    }
})();