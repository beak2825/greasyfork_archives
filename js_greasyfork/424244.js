// ==UserScript==
// @name         即刻重定向
// @namespace    https://lbjheiheihei.xyz/
// @version      0.1
// @description  即刻重定向，m.okjike.com --> web.okjike.com
// @author       君子(即刻@君子)
// @include      *m.okjike.com*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/424244/%E5%8D%B3%E5%88%BB%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/424244/%E5%8D%B3%E5%88%BB%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentURL=window.location; //获取当前页面链接
    console.info(currentURL.href); //输出当前页面链接
    // 进行链接替换
    // 适配了 动态、话题、转发、用户主页
    var new_href = currentURL.href.replace("m.okjike.com/originalPosts/","web.okjike.com/originalPost/")
    new_href = new_href.replace("m.okjike.com/topics/","web.okjike.com/topic/")
    new_href = new_href.replace("m.okjike.com/reposts/","web.okjike.com/repost/")
    new_href = new_href.replace("m.okjike.com/users/","web.okjike.com/u/")
    // 去掉没有必要的参数
    new_href = new_href.replace(currentURL.search,"")

    // 输出替换之后的链接
    console.info(new_href);
    // 替换链接，使用的是可以返回前一页的方式，而不是 window.location.replace(new_href);
    window.location.href = new_href;
})();