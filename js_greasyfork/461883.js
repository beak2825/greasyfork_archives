// ==UserScript==
// @name         上移知乎文章发表日期到标题
// @namespace    https://github.com/goocheez/GreasyFork/move_zhihu_timestamp/zhihu_timestamp_to_the_top.user.js
// @version      0.1.1
// @description  将知乎专栏的文章发表日期移动到标题下方
// @author       Goocheez
// @match        https://zhuanlan.zhihu.com/*
// @icon         https://static.zhihu.com/heifetz/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461883/%E4%B8%8A%E7%A7%BB%E7%9F%A5%E4%B9%8E%E6%96%87%E7%AB%A0%E5%8F%91%E8%A1%A8%E6%97%A5%E6%9C%9F%E5%88%B0%E6%A0%87%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/461883/%E4%B8%8A%E7%A7%BB%E7%9F%A5%E4%B9%8E%E6%96%87%E7%AB%A0%E5%8F%91%E8%A1%A8%E6%97%A5%E6%9C%9F%E5%88%B0%E6%A0%87%E9%A2%98.meta.js
// ==/UserScript==

function move_zhihu_timestamp_to_the_top(){
    var title = document.getElementsByClassName('Post-Header');
    var time_stamp = document.getElementsByClassName('ContentItem-time');
    if(title.length>0 && time_stamp.length>0){ // 添加条件语句，避免 js 出错
        title[0].appendChild(time_stamp[0]);
    }
}

(function() {
    'use strict';
    move_zhihu_timestamp_to_the_top();
})();