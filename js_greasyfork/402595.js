// ==UserScript==
// @name         clean fans in weibo
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  清理微博粉丝, 用完记得删除, 如果 match url 不对请自行修改一下.
// @author       You
// @match        https://www.weibo.com/*/fans*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402595/clean%20fans%20in%20weibo.user.js
// @updateURL https://update.greasyfork.org/scripts/402595/clean%20fans%20in%20weibo.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        document.querySelector('a[action-type="removeFan"]').click()
        document.querySelector('a[action-type="ok"]').click()
    }, 500)
    setInterval(() => {
        location.reload();
    }, 10000)
})();