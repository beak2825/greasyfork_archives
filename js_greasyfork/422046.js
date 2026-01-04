// ==UserScript==
// @name         洛谷炫耀神器
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  紫名金钩
// @author       OI-Master
// @match        https://*.luogu.com.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422046/%E6%B4%9B%E8%B0%B7%E7%82%AB%E8%80%80%E7%A5%9E%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/422046/%E6%B4%9B%E8%B0%B7%E7%82%AB%E8%80%80%E7%A5%9E%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window._feInjection.currentUser.ccfLevel=10;
    window._feInjection.currentUser.color="Purple";
    window._feInjection.currentUser.followerCount=400000;
    window._feInjection.currentUser.isAdmin=true;
    window._feInjection.currentUser.ranking=1;
    window._feInjection.currentUser.unreadMessageCount=999;
    window._feInjection.currentUser.unreadNoticeCount=999;
    // Your code here...
})();