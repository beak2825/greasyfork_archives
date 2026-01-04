// ==UserScript==
// @name         微信书架滚动
// @namespace    http://tampermonkey.net/
// @version      0.11
// @description  自动滚动微信书架
// @author       515235972@qq.com
// @match        https://weread.qq.com/web/shelf
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438163/%E5%BE%AE%E4%BF%A1%E4%B9%A6%E6%9E%B6%E6%BB%9A%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/438163/%E5%BE%AE%E4%BF%A1%E4%B9%A6%E6%9E%B6%E6%BB%9A%E5%8A%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var interval;
    var oldTop;
    var busy = false;

    if (window.location.href == "https://weread.qq.com/web/shelf") {
        interval = setInterval(function() {
            if (busy) return;
            busy = true;

            if (oldTop == document.documentElement.scrollTop) {
                document.documentElement.scrollTop = 0;
            }

            oldTop = document.documentElement.scrollTop;
            document.documentElement.scrollTop++;

            busy = false;
        }, 20)
    }
})();