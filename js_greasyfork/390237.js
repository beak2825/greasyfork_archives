// ==UserScript==
// @name         屏蔽开源中国加灰动弹
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  try to take over the world!
// @author       You
// @match        https://*.oschina.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390237/%E5%B1%8F%E8%94%BD%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E5%8A%A0%E7%81%B0%E5%8A%A8%E5%BC%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/390237/%E5%B1%8F%E8%94%BD%E5%BC%80%E6%BA%90%E4%B8%AD%E5%9B%BD%E5%8A%A0%E7%81%B0%E5%8A%A8%E5%BC%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {
        removeBlockedTweet();
        removeBlockedComment();

        setInterval(removeBlockedTweet, 10000);
    }

    function removeBlockedTweet() {
        var lists = document.querySelectorAll('.tweet-item.blocked');
        for (var i = 0, j = lists.length; i < j; i++) {
            lists[i].parentNode.removeChild(lists[i])
        }
    }
    function removeBlockedComment() {
        var lists = document.querySelectorAll('.comment-item.blocked');
        for (var i = 0, j = lists.length; i < j; i++) {
            lists[i].parentNode.removeChild(lists[i])
        }
    } 
})();