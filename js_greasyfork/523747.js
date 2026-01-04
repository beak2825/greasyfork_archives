// ==UserScript==
// @name         KML Title Updater
// @namespace    https://greasyfork.org/
// @version      1.0
// @description  Update page title for KML pages
// @author       Ethkuil
// @match        https://kml.corp.kuaishou.com/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/523747/KML%20Title%20Updater.user.js
// @updateURL https://update.greasyfork.org/scripts/523747/KML%20Title%20Updater.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function updatePageTitle() {
        const currentUrl = window.location.href;

        // 匹配#/后的第一段
        const match = currentUrl.match(/#\/([^/]+)/);

        if (!match) return;

        const firstSegment = match[1];
        if (firstSegment === 'personal' || firstSegment === 'project') {
            // 提取页面主题信息
            const pageContentElement = document.evaluate(
                '//*[@id="__kml_page_content__"]/div[1]/div/div',
                document,
                null,
                XPathResult.FIRST_ORDERED_NODE_TYPE,
                null
            ).singleNodeValue;
            const pageContentText = pageContentElement ? pageContentElement.textContent.trim() : '';

            // 自定义标题
            const newTitle = `:: ${pageContentText}`;
            document.title = newTitle;
        }

    }

    // 监听URL变化
    let lastUrl = window.location.href;

    // 创建一个观察器来检测URL变化
    const observer = new MutationObserver(() => {
        const currentUrl = window.location.href;
        if (currentUrl !== lastUrl) {
            lastUrl = currentUrl;
            // 给DOM一些时间加载
            setTimeout(updatePageTitle, 500);
        }
    });
    observer.observe(document, { subtree: true, childList: true });

    // 初始执行一次
    setTimeout(updatePageTitle, 1000);
})();