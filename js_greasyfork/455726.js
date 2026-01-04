// ==UserScript==
// @name         网页去灰
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.0
// @description  去除附加在网站上的灰色滤镜
// @author       Logs404
// @match        *
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/455726/%E7%BD%91%E9%A1%B5%E5%8E%BB%E7%81%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/455726/%E7%BD%91%E9%A1%B5%E5%8E%BB%E7%81%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
        document.querySelector("html").style.filter = 'none'
        document.querySelector("html").style.webkitFilter = 'none'
})();