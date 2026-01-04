// ==UserScript==
// @name         ChatGPT开启不限次数的GPT4-Mobile
// @namespace    https://chat.openai.com/
// @description  GPT4-Mobile已和GPT4共享3小时25次限制，意味着此脚本已没有意义！！！取自iOS客户端的GPT4模型, 和GPT4一样仅限Plus会员使用
// @version      0.5
// @match        https://chat.openai.com/*
// @author       braumye
// @grant        unsafeWindow
// @license      GPL-2.0-only
// @downloadURL https://update.greasyfork.org/scripts/467317/ChatGPT%E5%BC%80%E5%90%AF%E4%B8%8D%E9%99%90%E6%AC%A1%E6%95%B0%E7%9A%84GPT4-Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/467317/ChatGPT%E5%BC%80%E5%90%AF%E4%B8%8D%E9%99%90%E6%AC%A1%E6%95%B0%E7%9A%84GPT4-Mobile.meta.js
// ==/UserScript==

(function () {
    const originFetch = fetch;
    window.unsafeWindow.fetch = (url, options) => {
        return originFetch(url, options).then(async (response) => {
            if (url.indexOf('/backend-api/models') === -1) {
                return response;
            }
            const responseClone = response.clone();
            let res = await responseClone.json();
            res.models = res.models.map(m => {
                if (m.slug === 'gpt-4-mobile') {
                    m.tags = m.tags.filter(t => {
                        return t !== 'mobile';
                    });
                    res.categories.push({
                        browsing_model: null,
                        category: "gpt_4",
                        code_interpreter_model: null,
                        default_model: "gpt-4-mobile",
                        human_category_name: "GPT-4-Mobile",
                        plugins_model: null,
                        subscription_level: "plus",
                    });
                }
                return m;
            });

            return new Response(JSON.stringify(res), response);
        });
    };
})();