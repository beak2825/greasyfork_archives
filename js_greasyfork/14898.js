// ==UserScript==
// @name 微博按时间排序
// @description 微博个人主页显示全部微博
// @version 2.0
// @include http://weibo.com/*
// @include http://www.weibo.com/*
// @grant none
// @run-at document-start
// @namespace https://greasyfork.org/users/23185
// @downloadURL https://update.greasyfork.org/scripts/14898/%E5%BE%AE%E5%8D%9A%E6%8C%89%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/14898/%E5%BE%AE%E5%8D%9A%E6%8C%89%E6%97%B6%E9%97%B4%E6%8E%92%E5%BA%8F.meta.js
// ==/UserScript==

;(function(href,arg){
    (href.indexOf(arg) !== -1) || 
    (location.href = href + ((href.indexOf("?") === -1 ? "?" : "&") + arg))
})(location.href,"is_all=1");