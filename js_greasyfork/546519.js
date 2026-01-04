// ==UserScript==
// @name         我不想看到你的脸
// @version      0.1
// @description  移除课程中老师的脸
// @author       Iko
// @license      CC BY-NC
// @namespace    https://github.com/iko233
// @match        https://www.fenbi.com/spa/webclass/class/*
// @grant        none
// @icon         https://nodestatic.fbstatic.cn/weblts_spa_online/page/assets/fenbi32.ico
// @downloadURL https://update.greasyfork.org/scripts/546519/%E6%88%91%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E4%BD%A0%E7%9A%84%E8%84%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/546519/%E6%88%91%E4%B8%8D%E6%83%B3%E7%9C%8B%E5%88%B0%E4%BD%A0%E7%9A%84%E8%84%B8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeSmallVideo() {
        let elements = document.getElementsByClassName("smallvideo");
        while (elements.length > 0) {
            elements[0].remove();
        }
    }

    // 初次运行
    removeSmallVideo();

    // 监听页面变化（动态加载内容也能删除）
    const observer = new MutationObserver(removeSmallVideo);
    observer.observe(document.body, { childList: true, subtree: true });
})();