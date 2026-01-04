// ==UserScript==
// @name         QQ链接跳转
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  干掉从QQ打开链接时提示“当前网页非官方页面”与“已停止访问该网页”
// @author       Apophis3158
// @match        *://c.pc.qq.com/ios.html?*
// @match        *://c.pc.qq.com/middlem.html?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @grant        none
// @license      MIT
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/477114/QQ%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/477114/QQ%E9%93%BE%E6%8E%A5%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var src = window.location.href;
    var url = src.match(/(?<=(url=)).*?(?=&)/g);
    var dst = decodeURIComponent(url);

    window.location.replace(dst);
})();
