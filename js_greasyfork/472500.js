// ==/UserScript==
// ==UserScript==
// @version             1
// @license             MIT
// @name                gpt后台刷新（军刀个人用）
// @description         gpt后台刷新（个人用）
// @match               https://chat.openai.com/*
// @grant               none
// @namespace ess
// @downloadURL https://update.greasyfork.org/scripts/472500/gpt%E5%90%8E%E5%8F%B0%E5%88%B7%E6%96%B0%EF%BC%88%E5%86%9B%E5%88%80%E4%B8%AA%E4%BA%BA%E7%94%A8%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/472500/gpt%E5%90%8E%E5%8F%B0%E5%88%B7%E6%96%B0%EF%BC%88%E5%86%9B%E5%88%80%E4%B8%AA%E4%BA%BA%E7%94%A8%EF%BC%89.meta.js
// ==/UserScript==
 
(async () => {
    const config = {
        refreshInterval: 30
    };
 
    await chatgpt.isLoaded();
 
    chatgpt.autoRefresh.activate(config.refreshInterval);
})()