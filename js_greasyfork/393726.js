// ==UserScript==
// @name         批量删除发布的微博
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Daniel
// @match        https://weibo.com/2942434691/profile?topnav=1&wvr=6&is_all=1
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393726/%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%8F%91%E5%B8%83%E7%9A%84%E5%BE%AE%E5%8D%9A.user.js
// @updateURL https://update.greasyfork.org/scripts/393726/%E6%89%B9%E9%87%8F%E5%88%A0%E9%99%A4%E5%8F%91%E5%B8%83%E7%9A%84%E5%BE%AE%E5%8D%9A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var s = document.createElement('script');
    s.setAttribute('src', 'https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js')
    s.onload = function () {
        for (var i = 0; i < 3; i++) {
            setTimeout(function () {
                $('a[action-type="fl_menu"]')[0].click();
                $('a[title="删除此条微博"]')[0].click();
                $('a[action-type="ok"]')[0].click();
            }, 1000 * i)
        }
    }
    document.head.appendChild(s);
})();