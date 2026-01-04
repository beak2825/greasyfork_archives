// ==UserScript==
// @name        Weibo_Remove_FeedFollow
// @namespace   Weibo_Remove_FeedFollow
// @description 去除微博首页信息流中的推荐关注
// @homepageURL https://greasyfork.org/zh-CN/scripts/457686-weibo-remove-feedfollow
// @match       https://weibo.com/*
// @match       https://www.weibo.com/*
// @version     0.0.2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/457686/Weibo_Remove_FeedFollow.user.js
// @updateURL https://update.greasyfork.org/scripts/457686/Weibo_Remove_FeedFollow.meta.js
// ==/UserScript==
//
var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
        var FeedFollow = document.querySelector("[node-type='feedfollow']").parentNode.parentNode.parentNode.parentNode;
        //如无新的好友微博展示则会显示“正在加载中”一段时间;
        //console.log(FeedFollow);
        FeedFollow.parentNode.removeChild(FeedFollow);
    })
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});