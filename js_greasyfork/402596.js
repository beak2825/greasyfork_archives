// ==UserScript==
// @name         clean follow in weibo
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  清理微博已关注的人, 用完记得删除, 如果 match url 不对请自行修改一下.
// @author       You
// @match        https://www.weibo.com/*/follow*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402596/clean%20follow%20in%20weibo.user.js
// @updateURL https://update.greasyfork.org/scripts/402596/clean%20follow%20in%20weibo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        document.querySelector('a[action-type="cancel_follow_single"]').click()
        document.querySelector('a[action-type="ok"]').click()
    }, 500)
    setInterval(() => {
        location.reload();
    }, 10000)

})();