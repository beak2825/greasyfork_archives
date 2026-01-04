// ==UserScript==
// @name         No Trending on BiliSearch | 关闭Bilibili搜索推荐
// @namespace    none
// @version      0.5
// @description  关闭Bilibili搜索页热搜
// @author       CDN
// @match        https://search.bilibili.com
// @match        https://search.bilibili.com/*
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @icon         https://static.hdslb.com/images/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/437955/No%20Trending%20on%20BiliSearch%20%7C%20%E5%85%B3%E9%97%ADBilibili%E6%90%9C%E7%B4%A2%E6%8E%A8%E8%8D%90.user.js
// @updateURL https://update.greasyfork.org/scripts/437955/No%20Trending%20on%20BiliSearch%20%7C%20%E5%85%B3%E9%97%ADBilibili%E6%90%9C%E7%B4%A2%E6%8E%A8%E8%8D%90.meta.js
// ==/UserScript==

'use strict';
var fn = function(){
         var trending_homepage = document.getElementsByClassName("suggest-wrap");
         //var trending_homepage = document.getElementsByClassName("trending");
         Array.prototype.forEach.call(trending_homepage, function (element) {
         element.outerHTML = '';
         });
         setTimeout(fn, 100)
    }
fn();