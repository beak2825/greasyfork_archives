// ==UserScript==
// @name         B站顶部直播跳转替换
// @namespace    https://github.com/ssoda01
// @version      1.0
// @description  Bilibili Nav Live Link replace
// @author       sodakoo
// @match        https://*.bilibili.com/*
// @license      GPL-3.0-only
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541226/B%E7%AB%99%E9%A1%B6%E9%83%A8%E7%9B%B4%E6%92%AD%E8%B7%B3%E8%BD%AC%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/541226/B%E7%AB%99%E9%A1%B6%E9%83%A8%E7%9B%B4%E6%92%AD%E8%B7%B3%E8%BD%AC%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let follow_link = 'https://link.bilibili.com/p/center/index?visit_id=#/user-center/follow/1';

    const tabsSelector = [
        "#left-part > div > div > div.flex-block > div > div > div > a.live",
        "#i_cecream > div.bili-feed4 > div.bili-header.large-header > div.bili-header__bar > ul.left-entry > li:nth-child(3) > a",
        "#biliMainHeader > div > div > ul.left-entry > li:nth-child(3) > a",
        "#left-part > div > div > div.flex-block > div > div > div > a.live",
        "#left-part > div > div > div.flex-block > a.entry_logo"
    ];

    function updateTabs() {
        const tabs = tabsSelector.map(selector => document.querySelector(selector));
        for (const tab of tabs) {
            if (tab && tab.href) {
                tab.href = follow_link;
                if (tab.childNodes[0] && tab.childNodes[0].getAttribute('role') != 'img') {
                    tab.childNodes[0].innerText = '💖直播💖';
                }
            }
        }
    }

    const observer = new MutationObserver(updateTabs);
    const config = { childList: true, subtree: false };

    observer.observe(document.body, config);
})();