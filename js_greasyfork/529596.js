// ==UserScript==
// @name         屏蔽腾讯元宝下载元素
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽腾讯元宝网站上的下载软件元素
// @author       Jerry_Chiang
// @match        https://yuanbao.tencent.com/*
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529596/%E5%B1%8F%E8%94%BD%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E4%B8%8B%E8%BD%BD%E5%85%83%E7%B4%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/529596/%E5%B1%8F%E8%94%BD%E8%85%BE%E8%AE%AF%E5%85%83%E5%AE%9D%E4%B8%8B%E8%BD%BD%E5%85%83%E7%B4%A0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 使用 CSS 隐藏元素
    GM_addStyle(`
        #app > div > div.yb-layout__content.agent-layout__content > div > div > div.agent-dialogue__content > div > div.agent-dialogue__tool,
        #hunyuan-bot > div:nth-child(4) > div > div > div.t-drawer__footer > div > div.index_pc_download__IjaBf {
            display: none !important;
        }
    `);

    function hideElement(selector) {
        const element = document.querySelector(selector);
        if (element) {
            element.style.display = 'none';
        }
    }

    // 在 DOMContentLoaded 事件触发后立即隐藏元素
    document.addEventListener('DOMContentLoaded', () => {
        hideElement('#app > div > div.yb-layout__content.agent-layout__content > div > div > div.agent-dialogue__content > div > div.agent-dialogue__tool');
        hideElement('#hunyuan-bot > div:nth-child(4) > div > div > div.t-drawer__footer > div > div.index_pc_download__IjaBf');
    });

    // 定期检查并屏蔽，以应对动态加载的元素
    setInterval(() => {
        hideElement('#app > div > div.yb-layout__content.agent-layout__content > div > div > div.agent-dialogue__content > div > div.agent-dialogue__tool');
        hideElement('#hunyuan-bot > div:nth-child(4) > div > div > div.t-drawer__footer > div > div.index_pc_download__IjaBf');
    }, 1000); // 每秒检查一次
})();