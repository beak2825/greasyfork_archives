// ==UserScript==
// @name         B站屏蔽合集推荐
// @description  屏蔽播放页合集推荐 | 防止自动连播跳转
// @version      1.1.0
// @license      WTFPL
// @author       Joseph Chris <joseph@josephcz.xyz>
// @icon         https://www.bilibili.com/favicon.ico
// @namespace    https://github.com/baobao1270/util-scripts/blob/main/tampermonkey/bilibili-no-medialist
// @homepageURL  https://github.com/baobao1270/util-scripts/blob/main/tampermonkey/bilibili-no-medialist
// @supportURL   mailto:tampermonkey-support@josephcz.xyz
// @compatible   firefox
// @compatible   safari
// @compatible   chrome
// @compatible   edge
// @match        https://www.bilibili.com/video/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496036/B%E7%AB%99%E5%B1%8F%E8%94%BD%E5%90%88%E9%9B%86%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/496036/B%E7%AB%99%E5%B1%8F%E8%94%BD%E5%90%88%E9%9B%86%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.querySelectorAll(".video-page-special-card").forEach((x) => {
        console.warn("[B站屏蔽视频推荐中的合集] Hidden", x)
        x.hidden = true;
    });
})();
