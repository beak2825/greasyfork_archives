// ==UserScript==
// @name         煎蛋树洞过滤XX多于OO的
// @namespace    StarTrackEx
// @version      0.1
// @description  用于煎蛋树洞过滤XX多于OO的内容
// @author       StartTrackEx
// @match        http://jandan.net/treehole/*
// @grant        jandaner
// @downloadURL https://update.greasyfork.org/scripts/398750/%E7%85%8E%E8%9B%8B%E6%A0%91%E6%B4%9E%E8%BF%87%E6%BB%A4XX%E5%A4%9A%E4%BA%8EOO%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/398750/%E7%85%8E%E8%9B%8B%E6%A0%91%E6%B4%9E%E8%BF%87%E6%BB%A4XX%E5%A4%9A%E4%BA%8EOO%E7%9A%84.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let local_url = location.href;
    if(local_url.indexOf('jandan.net/treehole')!=-1){
        var comments_list=$("li[id^='comment-']");
        $(comments_list).each(function(i,o){
            let likes=$(this).find('.tucao-like-container').find('span').text();
            let unlikes=$(this).find('.tucao-unlike-container').find('span').text();
            if(parseInt(unlikes)>parseInt(likes)){
                $(this).css('display','none');
               }
        });
       }
})();