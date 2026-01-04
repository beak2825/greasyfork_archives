// ==UserScript==
// @name         即刻自动滚动,定时刷新
// @namespace    http://tampermonkey.net/
// @version      0.12
// @description  即刻关注页,发现页的自动滚动.滚动到一定程度会重新刷新页面
// @author       515235972@qq.com
// @match        https://web.okjike.com/
// @icon         https://www.google.com/s2/favicons?domain=okjike.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439001/%E5%8D%B3%E5%88%BB%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%2C%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/439001/%E5%8D%B3%E5%88%BB%E8%87%AA%E5%8A%A8%E6%BB%9A%E5%8A%A8%2C%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0.meta.js
// ==/UserScript==

// 页面滚动参考了https://blog.csdn.net/weixin_44869002/article/details/104577738的实现

(function() {
    'use strict';

    // -- Scroller

    function Scroller() {

    }

    Scroller.prototype = {
        busy: false,
        scrollWithOffset: function(offset) {
            if (this.busy) return;
            this.busy = true;

            let scrollTop =
                document.documentElement.scrollTop || document.body.scrollTop;
            const targetPosition = scrollTop + offset;
            // 滚动step方法

            var self = this;
            const step = function() {
                // 距离目标滚动距离
                let distance = targetPosition - scrollTop;
                // 目标滚动位置
                scrollTop = scrollTop + distance / 5;
                if (Math.abs(distance) < 1) {
                    window.scrollTo(0, targetPosition);
                    self.busy = false;
                } else
                {
                    window.scrollTo(0, scrollTop);
                    setTimeout(step, 20);
                }
            };
            step();
            return targetPosition;
        },
    };

    // --

    function keys(dict) {
        var keyList = [];
        for (var key in dict) {
            keyList.push(key);
        }
        return keyList;
    }

    function findNewPostNotiElement() {
        const candidates = document.querySelectorAll("#__next > div > div > div > div > div");
        for (var candidateIndex in candidates) {
            const candidate = candidates[candidateIndex];
            if (candidate.className.includes("NewMessageNoti__NotiWrap")) {
                return candidate;
            }
        }
        return null;
    }

    const fetchNewPostFuncs = {
        "https://web.okjike.com/recommend": function() {
            location.reload();
        },
        "https://web.okjike.com/": function() {
            scroller.scrollWithOffset(0);

            const notiElement = findNewPostNotiElement();
            if (notiElement == null) {
                return;
            }

            const refreshButton = notiElement.querySelector("button");
            if (refreshButton == null) {
                return;
            }

            refreshButton.click();
            console.log("refresh button clicked")
        }
    };
    const locations = keys(fetchNewPostFuncs);

    const location = window.location.href;
    if (locations.includes(location)) {
        const offset = 400;
        const howManyScrollBeforeRefreshPage = 30;
        var currentPosition = 0;
        var scroller = new Scroller();

        var interval = setInterval(function() {
            if (currentPosition > howManyScrollBeforeRefreshPage * offset) {
                // refresh page
                fetchNewPostFuncs[location]();
            }
            currentPosition = scroller.scrollWithOffset(offset);
        }, 10*1000)
    }
})();
