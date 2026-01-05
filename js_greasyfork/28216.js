// ==UserScript==
// @name        cnBeta_Remove_MusicNews
// @namespace   cnBeta_Remove_MusicNews
// @description 去除cnBeta首页信息流中所有音乐分类的新闻
// @homepageURL https://greasyfork.org/zh-CN/scripts/28216-cnbeta-remove-musicnews
// @author      Special-Denise
// @include     http://www.cnbeta.com/
// @version     0.0.3
// @lastupdate  2017-03-17
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/28216/cnBeta_Remove_MusicNews.user.js
// @updateURL https://update.greasyfork.org/scripts/28216/cnBeta_Remove_MusicNews.meta.js
// ==/UserScript==
//
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        var MusicNews = document.querySelector('label.music a').parentNode.parentNode.parentNode;
        //var MusicNews = document.querySelector('label.music').parentNode.parentNode;
        MusicNews.parentNode.removeChild(MusicNews);
    })
});
observer.observe(document.body, {
    childList: true,
    subtree: true,
});