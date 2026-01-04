// ==UserScript==
// @name         Redirect Baidu Tieba Link
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  重定向百度贴吧移动版链接为 PC 版本
// @author       AI
// @match        https://tieba.baidu.com/mo/q/posts*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467458/Redirect%20Baidu%20Tieba%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/467458/Redirect%20Baidu%20Tieba%20Link.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const url = new URL(window.location.href);
    const tid = url.searchParams.get("tid");

    if (tid) {
        window.location.href = `https://tieba.baidu.com/p/${tid}`;
    }
})();