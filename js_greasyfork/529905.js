// ==UserScript==
// @name         谷歌安全搜索隐藏
// @namespace    http://tampermonkey.net/
// @version      2025-03-15
// @description  隐藏谷歌安全搜索元素，管住小手
// @author       You
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/529905/%E8%B0%B7%E6%AD%8C%E5%AE%89%E5%85%A8%E6%90%9C%E7%B4%A2%E9%9A%90%E8%97%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/529905/%E8%B0%B7%E6%AD%8C%E5%AE%89%E5%85%A8%E6%90%9C%E7%B4%A2%E9%9A%90%E8%97%8F.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    let safeSearchNode = document.getElementById('taw')
    safeSearchNode.remove()
})();