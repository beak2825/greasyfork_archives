// ==UserScript==
// @name         隐藏篱笆社区用户头像等信息
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  自动隐藏篱笆社区帖子中的所有用户头像等信息
// @author       gfsc
// @match        https://www.libaclub.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/526884/%E9%9A%90%E8%97%8F%E7%AF%B1%E7%AC%86%E7%A4%BE%E5%8C%BA%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F%E7%AD%89%E4%BF%A1%E6%81%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/526884/%E9%9A%90%E8%97%8F%E7%AF%B1%E7%AC%86%E7%A4%BE%E5%8C%BA%E7%94%A8%E6%88%B7%E5%A4%B4%E5%83%8F%E7%AD%89%E4%BF%A1%E6%81%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 隐藏所有用户头像
    const avatars = document.querySelectorAll('img[src*="avatars.liba.com"]');
    avatars.forEach(avatar => {
        avatar.style.display = 'none';
    });

    // 隐藏来自 iPhone/Android 或 手机版的信息
    const topicUpdatedDivs = document.querySelectorAll('.ui-topic-updated .from-iphone, .ui-topic-updated .from-android');
    topicUpdatedDivs.forEach(div => {
        div.style.display = 'none';
    });

    // 隐藏所有广告链接（class="merchant-link"）
    const ads = document.querySelectorAll('.merchant-link');
    ads.forEach(ad => {
        ad.style.display = 'none';
    });

    // 隐藏带有“发送悄悄话”文本的链接
    const messageLinks = document.querySelectorAll('a.fn-link');
    messageLinks.forEach(link => {
        if (link.textContent.includes("发送悄悄话")) {
            link.style.display = 'none';
        }
    });
})();