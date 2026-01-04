// ==UserScript==
// @name         icampuses.cn课程视频自动播放
// @namespace    http://tampermonkey.net/
// @version      2024-11-16
// @description  自动播放icampuses.cn课程视频, 播放完成后切换下一个
// @author       You
// @license MIT
// @match        https://*.icampuses.cn/mod/hvp/view.php*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=icampuses.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/518928/icampusescn%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/518928/icampusescn%E8%AF%BE%E7%A8%8B%E8%A7%86%E9%A2%91%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function waitForElement(context, selector, callback) {
        const interval = setInterval(() => {
            const element = context.getElementsByClassName(selector);
            if (element[0]) {
                clearInterval(interval);
                callback(element[0]);
            }
        }, 100);
    }

    window.addEventListener('load', () => {
        const playerContext = document.getElementsByClassName("h5p-iframe-wrapper")[0].childNodes[0].contentDocument
        waitForElement(playerContext, "h5p-splash-title", (element) => {
            element.click();
        });
        setInterval(() => {
            let curTime = playerContext.getElementsByClassName("h5p-current")[0].childNodes[1].innerHTML;
            let fullTime = playerContext.getElementsByClassName("h5p-total")[0].childNodes[1].innerHTML;
            curTime = curTime.replace("Current time: ", "");
            fullTime = fullTime.replace("Total time: ", "");
            if (curTime === fullTime) {
                const navs = document.getElementsByClassName("courseindex-item");
                const navsPure = [];
                let curIdx = -1;
                for (let i = 0; i < navs.length; i++) {
                    if (!navs[i].classList.contains("courseindex-section-title")) {
                        navsPure.push(navs[i]);
                    }
                }
                for (let i = 0; i < navsPure.length; i++) {
                    if (navsPure[i].classList.contains("pageitem")) {
                        curIdx = i;
                        break;
                    }
                }
                navsPure[curIdx + 1].children[1].click();
            }
        }, 1000)
    });
})();