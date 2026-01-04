// ==UserScript==
// @name         discord 自動點表情符號by ㄐㄐ人
// @namespace    http://tampermonkey.net/
// @version      1.0.4
// @description  會自己點表情符號 修正超級反應
// @author       ㄐㄐ人
// @match        *://*.discord.com/channels/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=discord.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/463577/discord%20%E8%87%AA%E5%8B%95%E9%BB%9E%E8%A1%A8%E6%83%85%E7%AC%A6%E8%99%9Fby%20%E3%84%90%E3%84%90%E4%BA%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/463577/discord%20%E8%87%AA%E5%8B%95%E9%BB%9E%E8%A1%A8%E6%83%85%E7%AC%A6%E8%99%9Fby%20%E3%84%90%E3%84%90%E4%BA%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function autoClick() {
        // 尋找所有反應按鈕
        const reactions = document.querySelectorAll('[class*="reaction"]');

        for (const reaction of reactions) {
            // 檢查是否未被點擊且不是超級反應
            if (
                reaction.getAttribute('aria-pressed') === 'false' &&
                !reaction.getAttribute('aria-label')?.includes('超級反應')
            ) {
                reaction.click();
                console.log("已點擊反應");
                break;
            }
        }
    }

    setInterval(autoClick, 1000);
})();