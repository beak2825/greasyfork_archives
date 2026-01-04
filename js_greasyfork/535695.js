// ==UserScript==
// @name         Bilibili Video No New Tab
// @name:zh-CN   哔哩哔哩视频不开启新标签页
// @name:zh-TW   哔哩哔哩影片不開啟新分頁
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  Open Bilibili video links in the same tab instead of a new tab
// @description:zh-CN  在同一标签页中打开哔哩哔哩链接，而不是新标签页
// @description:zh-TW  在同一分頁中打開哔哩哔哩連結，而不是新分頁
// @author       ArcherWn
// @match        https://www.bilibili.com/
// @icon         https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo-small.png
// @icon64       https://raw.githubusercontent.com/the1812/Bilibili-Evolved/preview/images/logo.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535695/Bilibili%20Video%20No%20New%20Tab.user.js
// @updateURL https://update.greasyfork.org/scripts/535695/Bilibili%20Video%20No%20New%20Tab.meta.js
// ==/UserScript==


(function() {
    'use strict';

    const removeLinksTarget = (root = document) => {
        const links = root.querySelectorAll('a[href*="/video/"]');
        links.forEach(link => {
            link.removeAttribute('target');
            link.removeAttribute('rel');
        });
    }

    // first run
    removeLinksTarget();

    const targetDOM = document.querySelector('div.container');

    const config = {
        childList: true,
        subtree: true
    };

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type !== 'childList') return;

            mutation.addedNodes.forEach((node) => {
                if (node.nodeType !== Node.ELEMENT_NODE) return;
                removeLinksTarget(node);
            });
        });
    });

    observer.observe(targetDOM, config);
})();