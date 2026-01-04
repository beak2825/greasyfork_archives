// ==UserScript==
// @name         设置vnc的滚动条
// @description  设置vnc的滚动条上下以及左右都隐藏
// @match        https://ecs.console.aliyun.com/vnc/index.htm?*
// @license      GPL-3.0 License
// @version 0.0.1.20240923084800
// @namespace https://greasyfork.org/users/1256247
// @downloadURL https://update.greasyfork.org/scripts/509777/%E8%AE%BE%E7%BD%AEvnc%E7%9A%84%E6%BB%9A%E5%8A%A8%E6%9D%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/509777/%E8%AE%BE%E7%BD%AEvnc%E7%9A%84%E6%BB%9A%E5%8A%A8%E6%9D%A1.meta.js
// ==/UserScript==

(function () {
    'use strict';

    window.onload = function () {
        let st = setInterval(function () {
            let ebHtml = document.getElementsByTagName('html')[0];
            if (!!ebHtml) {
                ebHtml.style.overflow = 'hidden';
                clearInterval(st);
            }
        }, 1000);
    }
})();