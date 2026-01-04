// ==UserScript==
// @name         Yuba Fix
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  可使处于被关闭状态的斗鱼鱼吧的大多数功能暂时恢复正常使用，需要借用状态正常的鱼吧的UI。
// @match        *://yuba.douyu.com/discussion/13062*
// @match        *://yuba.douyu.com/discussion/5496243*
// @match        *://yuba.douyu.com/editor?gid=13062*
// @match        *://yubam.douyu.com/group/13062*
// @match        *://yubam.douyu.com/group/5496243*
// @match        *://yubam.douyu.com/post/*
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/531192/Yuba%20Fix.user.js
// @updateURL https://update.greasyfork.org/scripts/531192/Yuba%20Fix.meta.js
// ==/UserScript==

(async function () {
    'use strict';

    const settingKey = 'SPAM_FILTER';
    let SPAM_FILTER = GM_getValue(settingKey, false);

    function updateMenu() {
        GM_registerMenuCommand(`过滤“时光列车”帖子【当前：${SPAM_FILTER ? '启用' : '禁用'}】`, () => {
            SPAM_FILTER = !SPAM_FILTER;
            GM_setValue(settingKey, SPAM_FILTER);
            alert(`过滤已${SPAM_FILTER ? '启用' : '禁用'}`);
            location.reload(); // 刷新
        });
    }

    updateMenu();

    const css = `
        .banner__AyafQ { background-color: #FFFFFF !important; object-fit: contain; }
        .groupname__BUzOM { color: #515151 !important; text-shadow: 0 0 0px #ffffff !important; }
        .groupdesc__b8-53 { color: #515151 !important; text-shadow: 0 0 0px #ffffff !important; }
        .OpenApp_wrapper__NNm2Z { display: none !important; }
    `;

    const OLD_GROUP_ID = '13062';
    const FAKE_GROUP_ID = '5496243';

    const FAKE_API_URL = `https://${location.host}/wbapi/web/group/head?group_id=${FAKE_GROUP_ID}`;
    const FAKE_FEED_API_URL = `https://${location.host}/wgapi/yubanc/api/feed/groupTabFeedList?group_id=${FAKE_GROUP_ID}`;
    const FAKE_API_URL_XHR = `https://${location.host}/wbapi/web/group/head?group_id=${OLD_GROUP_ID}`;
    const PUBLISH_API_URL = `https://${location.host}/wgapi/yubanc/api/feed/publish`;

    const FAKE_RESPONSE = {
        data: {
            group_id: 13062,
            group_name: "玩机器丶Machine",
            avatar: "https://apic.douyucdn.cn/upload/avatar_v3/201905/badbf01f7ab943358bf78bcd9245305f_big.jpg",
            describe: "玩机器丶Machine的个人鱼吧",
            post_num: 6657,
            fans_num: 6657,
            anchor_id: 5448527,
            unread: 0,
            is_follow: 1,
            group_level: 3,
            group_exp: 20,
            level_status: 0,
            level_medal: "https://img.douyucdn.cn/data/yuba/admin/2018/10/16/201810161200503920739346639.png?i=2326458f9353bc988e1a27c68175065282",
            level_medal_new: "https://img.douyucdn.cn/data/yuba/weibo/2018/09/20/201809201549507007262123703.png",
            next_level_exp: 30,
            banner: "https://c-yuba.douyucdn.cn/yubavod/b/peApOkzz5mdl/7ced121e3251a680dfdf402305fd349c.jpg",
            group_title: "鱼塘司机",
            is_signed: 0,
            fid: 525,
            f_name: "PC游戏",
            f_describe: "斗鱼PC游戏版块",
            f_avatar: "https://apic.douyucdn.cn/upload/avatar_v3/201905/badbf01f7ab943358bf78bcd9245305f_big.jpg",
            manager_type: 0,
            group_type: 2,
            group_new_type: 2,
            has_starwall: 0,
            rank: 137,
            has_user_rank: 1,
            has_user_rank_reward: 1,
            safe_anchor_id: "W67QgJNpzd0O",
            has_game_comment: 0,
            has_information: 0,
            digest_tags: [],
            cate2_info: { c_template: 0 },
            news_sw: 0,
            hot_sort: false,
            hor_cover: "",
            game_id: 0
        },
        message: "",
        status_code: 200
    };

    const editorRegex = new RegExp(`^/editor(?:[/?#]|$)`);
    const redirectRegexList = [
        [/^\/discussion\/5496243\/posts(?:[/?#]|$)/, `/discussion/${OLD_GROUP_ID}/posts`],
        [/^\/discussion\/5496243\/highlight(?:[/?#]|$)/, `/discussion/${OLD_GROUP_ID}/highlight`],
        [/^\/group\/5496243(?:[/?#]|$)/, `/group/${OLD_GROUP_ID}`],
    ];

    if (editorRegex.test(window.location.pathname + window.location.search)) {
    const query = window.location.search || '';
    const hash = window.location.hash || '';
    window.location.href = `/editor?gid=${FAKE_GROUP_ID}`;
    }
    for (const [regex, target] of redirectRegexList) {
        if (regex.test(location.pathname + location.search)) {
            location.href = target + (location.search || '') + (location.hash || '');
        }
    }

    function titlechange() {
        document.title = '玩机器丶Machine的鱼吧-斗鱼社区,直播爱好者的聚集地';
    }

    const originalFetch = unsafeWindow.fetch;
    unsafeWindow.fetch = async function (...args) {
        let [input, init = {}] = args;

        if (typeof input === 'string') {
            input = input.replace(`=${OLD_GROUP_ID}`, `=${FAKE_GROUP_ID}`);
            if (input.includes(FAKE_API_URL)) {
                return new Response(JSON.stringify(FAKE_RESPONSE), {
                    status: 200,
                    headers: { 'Content-Type': 'application/json' }
                });
            }
            if (SPAM_FILTER && input.includes(FAKE_FEED_API_URL)) {
                const response = await originalFetch(input, init);
                const json = await response.clone().json();
                if (json?.data?.feed_list) {
                    json.data.feed_list = json.data.feed_list.filter(item => !item.text?.includes('tm2024'));
                }
                return new Response(JSON.stringify(json), {
                    status: response.status,
                    statusText: response.statusText,
                    headers: response.headers
                });
            }

            if (input.includes(PUBLISH_API_URL) &&
                init.method?.toUpperCase() === 'POST' &&
                init.headers?.['Content-Type']?.includes('application/x-www-form-urlencoded') &&
                typeof init.body === 'string') {
                init.body = init.body.replace(`group_id=${OLD_GROUP_ID}`, `group_id=${FAKE_GROUP_ID}`);
            }

            titlechange();
        }

        return originalFetch.call(this, input, init);
    };

    const originalXHROpen = unsafeWindow.XMLHttpRequest.prototype.open;
    const originalXHRSend = unsafeWindow.XMLHttpRequest.prototype.send;

    unsafeWindow.XMLHttpRequest.prototype.open = function (method, url) {
        this._method = method;
        this._originalUrl = url;
        const fullUrl = 'https://' + location.host + url;
        this._isTarget = fullUrl.includes(FAKE_API_URL_XHR);
        const newUrl = url.replace(`=${OLD_GROUP_ID}`, `=${FAKE_GROUP_ID}`);
        return originalXHROpen.call(this, method, newUrl);
    };

    unsafeWindow.XMLHttpRequest.prototype.send = async function (body) {
        if (this._isTarget) {
            this.addEventListener('readystatechange', () => {
                if (this.readyState === 4) {
                    Object.defineProperty(this, 'responseText', {
                        get: () => JSON.stringify(FAKE_RESPONSE)
                    });
                    Object.defineProperty(this, 'response', {
                        get: () => JSON.stringify(FAKE_RESPONSE)
                    });
                }
            });

            if (this._method.toUpperCase() === 'POST' && typeof body === 'string') {
                body = body.replace(`group_id=${OLD_GROUP_ID}`, `group_id=${FAKE_GROUP_ID}`);
            }

            await new Promise(resolve => setTimeout(resolve, 0));
        }
        return originalXHRSend.call(this, body);
    };

    function loadStyle(css) {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = css;
        document.head.appendChild(style);
    }

    loadStyle(css);

})();