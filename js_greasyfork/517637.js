// ==UserScript==
// @license MIT
// @description 屏蔽B站的隐藏广告adblock的提示adblock-tips
// @name         closeAdblock
// @namespace    http://tampermonkey.net/by_Yanming
// @version      0.1
// @description  try to take over the world!
// @author       Yanming
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/517637/closeAdblock.user.js
// @updateURL https://update.greasyfork.org/scripts/517637/closeAdblock.meta.js
// ==/UserScript==

(function () {
    'use strict';
    console.log("Tampermonkey script is running");
    function hideAdblockTips() {
        const adblockTips = document.querySelector(".adblock-tips");
        if (adblockTips) {
            console.log("Adblock tips found:", adblockTips);
            adblockTips.style.display = "none";
            return true;
        }
        console.log("Adblock tips not found");
        return false;
    }
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        if (hideAdblockTips()) {
            observer.disconnect(); // 找到后停止观察
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    hideAdblockTips();
    console.log("MutationObserver and interval are set up");
})();
// ==UserScript==
// @name         closeAdblock
// @namespace    http://tampermonkey.net/by_Yanming
// @version      0.1
// @description  try to take over the world!
// @author       Yanming
// @match        https://www.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @run-at document-end
// ==/UserScript==

(function () {
    'use strict';
    console.log("Tampermonkey script is running");
    function hideAdblockTips() {
        const adblockTips = document.querySelector(".adblock-tips");
        if (adblockTips) {
            console.log("Adblock tips found:", adblockTips);
            adblockTips.style.display = "none";
            return true;
        }
        console.log("Adblock tips not found");
        return false;
    }
    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver(() => {
        if (hideAdblockTips()) {
            observer.disconnect(); // 找到后停止观察
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
    hideAdblockTips();
    console.log("MutationObserver and interval are set up");
})();
