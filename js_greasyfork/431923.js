// ==UserScript==
// @name         隐藏有道翻译开屏广告
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  隐藏有道在线翻译网页开屏广告
// @author       Cynhard_yuyu
// @match        https://fanyi.youdao.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431923/%E9%9A%90%E8%97%8F%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/431923/%E9%9A%90%E8%97%8F%E6%9C%89%E9%81%93%E7%BF%BB%E8%AF%91%E5%BC%80%E5%B1%8F%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
document.querySelector(".dict-download-guide").style.display="none";
    // Your code here...
})();