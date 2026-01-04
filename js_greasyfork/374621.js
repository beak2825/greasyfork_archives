// ==UserScript==
// @name         未知核弹已经升空
// @namespace    http://www.acfun.cn/
// @version      0.1
// @description  try to take over the world!
// @author       ztcaoll222
// @match        http://*.acfun.cn/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374621/%E6%9C%AA%E7%9F%A5%E6%A0%B8%E5%BC%B9%E5%B7%B2%E7%BB%8F%E5%8D%87%E7%A9%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/374621/%E6%9C%AA%E7%9F%A5%E6%A0%B8%E5%BC%B9%E5%B7%B2%E7%BB%8F%E5%8D%87%E7%A9%BA.meta.js
// ==/UserScript==

(function() {
    setInterval(function(){
        $(".footer-avatar-ac").click();
    }, 10);
})();