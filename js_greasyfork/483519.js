// ==UserScript==
// @name         记录和恢复浏览进度
// @namespace    https://需要恢复的网页链接
// @version      0.1
// @description  记录退出时的滚动位置，并在下次进入时自动恢复
// @author       WZLN
// @match        https://需要恢复的网页链接/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483519/%E8%AE%B0%E5%BD%95%E5%92%8C%E6%81%A2%E5%A4%8D%E6%B5%8F%E8%A7%88%E8%BF%9B%E5%BA%A6.user.js
// @updateURL https://update.greasyfork.org/scripts/483519/%E8%AE%B0%E5%BD%95%E5%92%8C%E6%81%A2%E5%A4%8D%E6%B5%8F%E8%A7%88%E8%BF%9B%E5%BA%A6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在页面卸载前保存滚动位置
    window.addEventListener('beforeunload', function() {
        GM_setValue('scrollPosition', window.scrollY / (document.body.scrollHeight - window.innerHeight));
    });

    // 在页面加载时恢复滚动位置
    window.addEventListener('load', function() {
        var savedScrollPosition = GM_getValue('scrollPosition', 0);
        window.scrollTo(0, savedScrollPosition * (document.body.scrollHeight - window.innerHeight));
    });
})();
