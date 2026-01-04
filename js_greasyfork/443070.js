// ==UserScript==
// @name         zhihu_killer
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  知乎自动关闭登录框 智能识别登录状态
// @author       wuuconix
// @match        https://*.zhihu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443070/zhihu_killer.user.js
// @updateURL https://update.greasyfork.org/scripts/443070/zhihu_killer.meta.js
// ==/UserScript==

(function() {
    'use strict'

    const observer = new MutationObserver(() => {
        let avaterButton = document.querySelector(".Button.AppHeader-profileEntry.Button--plain")
        let closeButton = document.querySelector(".Button.Modal-closeButton.Button--plain")
        if (avaterButton) { //用户已经登录
            console.log("检测到你已登录，observer将自动关闭")
            observer.disconnect()
        } else if (closeButton) { //检查到弹出框
            closeButton.click()
            console.log("检测到登录框 已经为你自动关闭")
            observer.disconnect()
        }
    });

    observer.observe(document.body, { childList: true, });
})();