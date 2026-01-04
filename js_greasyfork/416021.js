// ==UserScript==
// @name         豆瓣-屏蔽哈组机器人回帖模块（可指定任意用户id
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Hide bot's reply for douban's haha group
// @author       hare
// @match        http*://www.douban.com/group/topic/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416021/%E8%B1%86%E7%93%A3-%E5%B1%8F%E8%94%BD%E5%93%88%E7%BB%84%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%9B%9E%E5%B8%96%E6%A8%A1%E5%9D%97%EF%BC%88%E5%8F%AF%E6%8C%87%E5%AE%9A%E4%BB%BB%E6%84%8F%E7%94%A8%E6%88%B7id.user.js
// @updateURL https://update.greasyfork.org/scripts/416021/%E8%B1%86%E7%93%A3-%E5%B1%8F%E8%94%BD%E5%93%88%E7%BB%84%E6%9C%BA%E5%99%A8%E4%BA%BA%E5%9B%9E%E5%B8%96%E6%A8%A1%E5%9D%97%EF%BC%88%E5%8F%AF%E6%8C%87%E5%AE%9A%E4%BB%BB%E6%84%8F%E7%94%A8%E6%88%B7id.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var cur_url = window.location.href;
    if (/^https?:\/\/www\.douban\.com\/group\/topic\/\d+/.test(cur_url)){
        var target_user_list = document.getElementsByClassName("clearfix comment-item reply-item ")
        let target_user_arr = ["2790052503","2785211694"]
        for(let i=0;i<target_user_list.length;i++){
           if(target_user_arr.indexOf(target_user_list[i].id)>-1){
               target_user_list[i].style.display="none"
           }
        }
    }
})();