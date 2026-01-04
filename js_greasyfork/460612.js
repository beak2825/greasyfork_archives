// ==UserScript==
// @name         微博weibo添加下载视频功能
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  添加微博视频的下载按钮
// @author       Iceivan
// @include        *weibo.com*
// @exclude        *service*.weibo.com/*
// @exclude        *api.weibo.com*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=weibo.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/460612/%E5%BE%AE%E5%8D%9Aweibo%E6%B7%BB%E5%8A%A0%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/460612/%E5%BE%AE%E5%8D%9Aweibo%E6%B7%BB%E5%8A%A0%E4%B8%8B%E8%BD%BD%E8%A7%86%E9%A2%91%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var timer0 = setInterval(addBtn ,5000 );
})();

function addBtn(){
    var vnodes = document.querySelectorAll('div.Feed_body_3R0rO:not(.DownFlag)');
    vnodes.forEach((ele)=>{
        try {
            if (ele.querySelector('video.wbpv-tech') != null){
                if (ele.querySelector('a.gotVideo') == null){
                    let videoUrl = ele.querySelector('video.wbpv-tech').getAttribute('src');
                    var aObj = document.createElement("span");
                    aObj.innerHTML = '<a class="gotVideo" href="' + videoUrl + '" target="_blank" style="font-size:14px;" >下载视频</a>';
                    ele.lastElementChild.appendChild(aObj);
                }
            }
        }
        catch(err){
            console.log(err);
        }
    });
}
