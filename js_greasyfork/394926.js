// ==UserScript==
// @name           V2EX打开新帖跳到第一页
// @description    V2EX打开新帖跳到第一页；翻页在当前页面打开
// @author         ss
// @include        https://*.v2ex.com/*
// @include        https://v2ex.com/*
// @version        2021.11.30
// @grant        none
// @namespace https://greasyfork.org/users/314878
// @downloadURL https://update.greasyfork.org/scripts/394926/V2EX%E6%89%93%E5%BC%80%E6%96%B0%E5%B8%96%E8%B7%B3%E5%88%B0%E7%AC%AC%E4%B8%80%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/394926/V2EX%E6%89%93%E5%BC%80%E6%96%B0%E5%B8%96%E8%B7%B3%E5%88%B0%E7%AC%AC%E4%B8%80%E9%A1%B5.meta.js
// ==/UserScript==

(function(){
    var topicLinks = document.getElementsByClassName('topic-link');
    var linksHot = document.querySelectorAll(".item_hot_topic_title a")
    if (topicLinks.length) {
        for (var i=0; i<topicLinks.length; i++) {
            topicLinks[i].href = topicLinks[i].href.split('#')[0] + '?p=1';
        }
    }
    if (linksHot.length) {
        for (var i=0; i<linksHot.length; i++) {
            linksHot[i].href = linksHot[i].href.split('#')[0] + '?p=1';
        }
    }
    const pages = document.getElementsByClassName('page_normal')
    for (let i = 0; i < pages.length; i++) {
        pages[i].target = "_self"
    }
})()