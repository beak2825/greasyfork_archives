// ==UserScript==
// @name         GW2 Skill Zh-CN 激战2 技能翻译插件 by Saber Lily
// @name:en      GW2 Skill Zh-CN GW2ARMORY Translator by Saber Lily
// @namespace    https://greasyfork.org/zh-CN/scripts/377052
// @version      2.1
// @description  把 激战2 Metabattle, Snowrows, discretize 等攻略网站上面的英文技能描述替换成中文，方便美服/欧服玩家参考。
// @description:en    Show Chinese GW2 Skill Translation which are on Metabattle, Snowrows, discretize and so on.
// @icon         https://wiki.guildwars2.com/favicon.ico
// @author       Saber Lily 莉莉哩哩 Gay哩Gay气
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/ajax-hook@2.1.3/dist/ajaxhook.min.js
// @match        https://metabattle.com/wiki/*
// @match        https://snowcrows.com/*
// @match        https://lucky-noobs.com/*
// @match        https://discretize.eu/*
// @match        https://www.godsofpvp.net/*
// @match        https://fast.farming-community.eu/*
// @match        https://guildjen.com/*
// @match        https://hardstuck.gg/*
// @grant        none
// @license      GPL-v3
// @downloadURL https://update.greasyfork.org/scripts/377052/GW2%20Skill%20Zh-CN%20%E6%BF%80%E6%88%982%20%E6%8A%80%E8%83%BD%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6%20by%20Saber%20Lily.user.js
// @updateURL https://update.greasyfork.org/scripts/377052/GW2%20Skill%20Zh-CN%20%E6%BF%80%E6%88%982%20%E6%8A%80%E8%83%BD%E7%BF%BB%E8%AF%91%E6%8F%92%E4%BB%B6%20by%20Saber%20Lily.meta.js
// ==/UserScript==

// 作者简介
// author:    https://github.com/acbetter
// 莉莉哩哩 Gay哩Gay气，一个天天划水的休闲 激战2 玩家。哔哩哔哩：可白草。
// 如果你觉得该脚本对你有所帮助，欢迎赞助我！

// 脚本原理
// 1. 通过 GW2A_EMBED_OPTIONS 选项，调整及修改 GW2ARMORY 的请求参数
// 2. 通过劫持 Metabattle, Snowrows, discretize 的 Ajax Api 请求，篡改其访问地址，使其返回中文数据。

// 版权申明
// 本脚本为 https://github.com/acbetter 原创，未经作者授权禁止转载，禁止转载范围包括但不仅限于：贴吧、NGA论坛等。

// 已知 Bug，不会修复
// 1. Metabattle 没有食物、扳手等的翻译
// 2. Metabattle 武器组、法印及部分武器技能没有翻译
// 3. 燃火 F1、F2 及 F3 后的技能没有翻译

console.log('GW2 Skill Zh-CN 激战2技能翻译插件 by Saber Lily 已启用!')

document.GW2A_EMBED_OPTIONS = {
    lang: 'zh'
};

window.onload = function() {
    document.body.addEventListener('mousedown', ev => {
        const a = event.target.closest('a');
        if (a && a.hasAttribute('href') && a.getAttribute('href').toString().includes('guildwars2.com/wiki/Special:Search/')) {
            const b = a.parentNode.parentNode.parentNode;
            if (b.hasAttribute('data-armory-ids')) {
                const c = b.getElementsByClassName('gw2a--M9jBV');
                var wikiid = 0;
                if (c.length > 1) {
                    for (let i = 0; i < c.length; i++) {
                        if (c[i].contains(a)) {
                            wikiid = b.getAttribute('data-armory-ids').toString().split(',')[i];
                            break;
                        }
                    }
                } else {
                    wikiid = b.getAttribute('data-armory-ids').toString().replace(',', '');
                }
                a.href = 'https://wiki.guildwars2.com/wiki/Special:RunQuery/Search_by_id?title=Special%3ARunQuery%2FSearch_by_id&pfRunQueryFormName=Search+by+id&Search+by+id%5Bid%5D=' + wikiid;
            };
        }
    });
}

ah.proxy({
    onRequest: (config, handler) => {
        if (config.url.startsWith('https://api.guildwars2.com/')) {
            config.url = config.url.replace('lang=en', 'lang=zh');
            console.log(config, handler);
        }
        handler.next(config);
    },
    onError: (err, handler) => {
        handler.next(err)
    },
    onResponse: (response, handler) => {
        handler.next(response)
    }
})

// some hack from https://stackoverflow.com/questions/45425169/intercept-fetch-api-requests-and-responses-in-javascript

const {fetch: origFetch} = window;

window.fetch = async (...args) => {
    if(args[0].startsWith('https://api.guildwars2.com/')){
        args[0]=args[0].replace('lang=en', 'lang=zh');
    }
    console.log("fetch called with args:", args);
    const response = await origFetch(...args);

    /* work with the cloned response in a separate promise
     chain -- could use the same chain with `await`. */
    response
        .clone()
        .json()
        .then(body => console.log("intercepted response:", body))
        .catch(err => console.error(err))
    ;

    /* the original response can be resolved unmodified: */
    return response;
};