// ==UserScript==
// @name         慕课网自动下一节视频
// @namespace    http://tampermonkey.net/
// @version      0.3
// @author       User_Bx
// @match        *://www.imooc.com/video/*
// @grant        none
// @description  慕课网自动放视频
// @icon         https://www.imooc.com/static/img/common/touch-icon-ipad.png
// @downloadURL https://update.greasyfork.org/scripts/387039/%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/387039/%E6%85%95%E8%AF%BE%E7%BD%91%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E8%8A%82%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
(function() {
    'use strict';
    window.onload=function(){
        var next=document.getElementsByTagName("div");
       var min_start,min_all,s_start,s_all,ms_start,ms_all,href_hea,href_sum;
        var href=window.location.href;
        setTimeout(function(){
            setInterval(function(){
                min_start=parseInt(next[37].firstChild.data.slice(0,1));
                s_start=parseInt(next[37].firstChild.data.slice(2,3));
                ms_start=parseInt(next[37].firstChild.data.slice(3,4));

                min_all=parseInt(next[37].firstChild.data.slice(7,8));
                s_all=parseInt(next[37].firstChild.data.slice(-2,-1));
                ms_all=parseInt(next[37].firstChild.data.slice(-1));

                var href_hea=href.slice(0,28);
                var a=parseInt(href.slice(28,33))+1
                var href_sum=a.toString()
                if(min_start==min_all&&s_start==s_all&&ms_start==ms_all){
                    window.location.href=href_hea+href_sum;
                }
            },500);
        },3000)
    }

})();