// ==UserScript==
// @name         notice of web error
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  take over the world!
// @author       akuvox
// @match        *://*/*
// @match        https://cbcloud.uat.akubela.com/*.html*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=akubela.com
// @grant        none
// @license      none
// @downloadURL https://update.greasyfork.org/scripts/472824/notice%20of%20web%20error.user.js
// @updateURL https://update.greasyfork.org/scripts/472824/notice%20of%20web%20error.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onerror = function(message, source, lineno, colno, error) {
        // 将错误信息显示为弹窗提示
        alert(message);
    };
})();