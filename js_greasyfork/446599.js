// ==UserScript==
// @name           qq视频
// @description    qq视频在当前页面打开
// @author         ss
// @include        https://v.qq.com/*
// @version        2022.06.17
// @grant        none
// @license      MIT
// @namespace https://greasyfork.org/users/314878
// @downloadURL https://update.greasyfork.org/scripts/446599/qq%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/446599/qq%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
 
(function(){
    var links = document.getElementsByTagName('a');
    if (links.length) {
        for (var i = 0; i < links.length; i++) {
            links[i].target = "_self"
        }
    }
})()