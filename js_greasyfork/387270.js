// ==UserScript==
// @name         知乎可关注
// @namespace    https://greasyfork.org/zh-CN/users/208194-lz0211
// @version      0.1
// @description  解除网页端知乎无法关注用户和问题的限制
// @author       You
// @match        https://www.zhihu.com/*
// @include      https://www.zhihu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387270/%E7%9F%A5%E4%B9%8E%E5%8F%AF%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/387270/%E7%9F%A5%E4%B9%8E%E5%8F%AF%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var btns = document.querySelectorAll('.FollowButton');
    for(var i=0;i<btns.length;i++){
        var name = btns[i].className;
        btns[i].className = name.replace(/\s+FollowButton\s+/,' ');
    }
    // Your code here...
})();