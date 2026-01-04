// ==UserScript==
// @name         知乎去标题插件
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  不想让别人看到你在看什么=。=
// @author       VincentYe
// @match        https://*.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420229/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E6%A0%87%E9%A2%98%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/420229/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E6%A0%87%E9%A2%98%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function () {
    "use strict";

    // Your code here...
    let flag = true;
    let interval = setInterval(() => {
        let title = document.getElementsByClassName("QuestionHeader-title");
        //目前页面只有两个标题
        if (title.length == 2) {
            flag = false;
        }
        if (!flag) {
            Array.prototype.forEach.call(title, function (item, index) {
                item.style.visibility = "hidden";
            });

            clearInterval(interval);
        }
    }, 1000);
})();