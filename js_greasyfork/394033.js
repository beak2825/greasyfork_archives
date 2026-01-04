// ==UserScript==
// @name         页面打开后向下滚动一段距离
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       none
// @include        http*
// @include        ftp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394033/%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%E5%90%8E%E5%90%91%E4%B8%8B%E6%BB%9A%E5%8A%A8%E4%B8%80%E6%AE%B5%E8%B7%9D%E7%A6%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/394033/%E9%A1%B5%E9%9D%A2%E6%89%93%E5%BC%80%E5%90%8E%E5%90%91%E4%B8%8B%E6%BB%9A%E5%8A%A8%E4%B8%80%E6%AE%B5%E8%B7%9D%E7%A6%BB.meta.js
// ==/UserScript==

(function() {
    document.documentElement.scrollTop += 300;
    // Your code here...
})();