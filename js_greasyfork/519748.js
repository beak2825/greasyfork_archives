// ==UserScript==
// @name         POPcat 2.0自動點擊外掛
// @namespace    http://tampermonkey.net/
// @version      2024-12-04
// @description  hacker!!
// @author       jay13345
// @match        https://popcat.click/
// @icon         https://static.styletc.com/images/cover/63/133863/md-031371399cc86f8161da0aac85365301.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519748/POPcat%2020%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%A4%96%E6%8E%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/519748/POPcat%2020%E8%87%AA%E5%8B%95%E9%BB%9E%E6%93%8A%E5%A4%96%E6%8E%9B.meta.js
// ==/UserScript==
(function () {
    'use strict';

    // 创建 KeyboardEvent
    var event = new KeyboardEvent('keydown', {
        key: 'g',
        ctrlKey: true
    });

    // 定时触发事件
    setInterval(function () {
        document.dispatchEvent(event);
    }, 0.1);
})();