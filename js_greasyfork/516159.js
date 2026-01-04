// ==UserScript==
// @name         腾讯文档跳过链接提示
// @namespace    http://tampermonkey.net/
// @version      0.1.0
// @description  跳过腾讯文档链接跳转提示
// @author       比奇堡唯一的真Ikun
// @match        https://docs.qq.com/scenario/link.html?*
// @icon         https://docs.gtimg.com/desktop/favicon2.ico
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516159/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E8%B7%B3%E8%BF%87%E9%93%BE%E6%8E%A5%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/516159/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E8%B7%B3%E8%BF%87%E9%93%BE%E6%8E%A5%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    "use strict";
    if (/url=([^&]+)/.test(location.search)) {
        location.href = decodeURIComponent(
            location.search.match(/url=([^&]+)/)[1]
        );
    }
})();