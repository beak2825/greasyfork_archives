// ==UserScript==
// @name 微博视频取消自动播放下一个视频
// @namespace http://tampermonkey.net/
// @version 0.1.1
// @description 微博视频取消自动播放
// @author 王泥巴
// @grant none
// @icon https://weibo.com/favicon.ico
// @include https://weibo.com/*

// @downloadURL https://update.greasyfork.org/scripts/397280/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E5%8F%96%E6%B6%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/397280/%E5%BE%AE%E5%8D%9A%E8%A7%86%E9%A2%91%E5%8F%96%E6%B6%88%E8%87%AA%E5%8A%A8%E6%92%AD%E6%94%BE%E4%B8%8B%E4%B8%80%E4%B8%AA%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==


setInterval(function () {
var next_close = document.querySelector('a[action-type="next_close"]')
if (next_close){
next_close.click();
}
    var video_box_more = document.querySelector('div.video_box_more')
    if (video_box_more){
        video_box_more.remove();
    }
}, 1000);