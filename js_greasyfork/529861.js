// ==UserScript==
// @name         AV01 Enhancer
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  增強AV01網頁的腳本
// @license      MIT
// @author       scbmark
// @match        https://www.av01.media/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529861/AV01%20Enhancer.user.js
// @updateURL https://update.greasyfork.org/scripts/529861/AV01%20Enhancer.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function addLinkOnHomePage() {
        let elements = document.querySelectorAll('div.flex.items-center.text-gray-400.text-xs.gap-1');

        if (elements.length === 0) return;

        elements.forEach(el => {
            try {
                let ele = el.getElementsByTagName("span")[0];

                let text = ele.textContent.trim();
                if (text.includes("lada")) return;

                let link = document.createElement("a");
                link.textContent = text;
                link.href = `https://sukebei.nyaa.si/?f=0&c=0_0&q=${encodeURIComponent(text)}`;
                link.target = "_blank";

                ele.replaceWith(link);
            } catch (e) {
                console.error("❌ 處理元素錯誤", e);
            }
        });
    }

    const observer = new MutationObserver(() => {
        addLinkOnHomePage();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    addLinkOnHomePage();
})();