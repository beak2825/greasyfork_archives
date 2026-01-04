// ==UserScript==
// @name         bilibili 批量取消关注
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       杨磊
// @match       https://space.bilibili.com/*/fans/*
// @grant        none
// @require    http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/410557/bilibili%20%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/410557/bilibili%20%E6%89%B9%E9%87%8F%E5%8F%96%E6%B6%88%E5%85%B3%E6%B3%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    // TODO 取消 b站的所有关注
    // https://space.bilibili.com/*/fans/*


    var intervalID = window.setInterval(getNum,10000);

    function getNum(){
        $(".be-dropdown-item:contains('取消关注')").click();
        // $(".be-pager-next").click();
        //  window.location="https://space.bilibili.com/52704344/fans/follow?tagid=-1";
        location.reload();
    }


    function stopTextColor() {
        clearInterval(intervalID);
    }
})();