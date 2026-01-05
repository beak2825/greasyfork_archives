// ==UserScript==
// @name         清爽的控制台
// @version      1.01
// @description  自动清理控制台！
// @author       过去终究是个回忆
// @namespace    https://greasyfork.org/users/49622
// @homepage     http://nopast.51vip.biz:10001/
// @match        http://*/*
// @match        https://*/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/23826/%E6%B8%85%E7%88%BD%E7%9A%84%E6%8E%A7%E5%88%B6%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/23826/%E6%B8%85%E7%88%BD%E7%9A%84%E6%8E%A7%E5%88%B6%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
    setTimeout(function () {
            console.clear();
        }, 1000);
})();