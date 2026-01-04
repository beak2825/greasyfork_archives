// ==UserScript==
// @name         知乎重定向
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  跳过知乎安全中心
// @author       share121
// @match        https://link.zhihu.com/?*target=*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/457275/%E7%9F%A5%E4%B9%8E%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/457275/%E7%9F%A5%E4%B9%8E%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function () {
    "use strict";
    if (/target=([^&]+)/.test(location.search)) {
        location.href = decodeURIComponent(
            location.search.match(/target=([^&]+)/)[1]
        );
    }
})();
