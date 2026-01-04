// ==UserScript==
// @name         洛谷假装禁言
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在洛谷，想体验加强版学术之禁言？试试用油猴假装禁言
// @author       xiaolan16
// @match        https://www.luogu.com.cn/
// @match        https://www.luogu.com.cn/discuss/lists?forumname=*
// @match        https://www.luogu.com.cn/discuss/show/*
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/411605/%E6%B4%9B%E8%B0%B7%E5%81%87%E8%A3%85%E7%A6%81%E8%A8%80.user.js
// @updateURL https://update.greasyfork.org/scripts/411605/%E6%B4%9B%E8%B0%B7%E5%81%87%E8%A3%85%E7%A6%81%E8%A8%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var jinyan_benben=0;
    function whatever1(){
        $(this).addClass("am-disabled");
        show_alert("好像哪里有点问题", "已被禁言");
    }
    function whatever2(){
        $(this).addClass("am-disabled");
        show_alert("好像哪里有点问题", "您已被禁言");
    }
    if(window.location.href=="https://www.luogu.com.cn/"&&jinyan_benben){
        $('#feed-submit').unbind();
        for(let i=0;i<=10;i++){
            if(document.getElementsByClassName("am-btn am-btn-danger am-btn-sm")[i].id=='feed-submit'){
                document.getElementsByClassName("am-btn am-btn-danger am-btn-sm")[i].onclick=function(){whatever1();};
            }
        }
    }
    if(window.location.href=="https://www.luogu.com.cn/discuss/lists"||window.location.href.startsWith("https://www.luogu.com.cn/discuss/lists?forumname=")){
        $('#submitpost').unbind();
        for(let i=0;i<=10;i++){
            if(document.getElementsByClassName("am-btn am-btn-danger")[i].id=='submitpost'){
                document.getElementsByClassName("am-btn am-btn-danger")[i].onclick=function(){whatever2();};
            }
        }
    }
    if(window.location.href.startsWith("https://www.luogu.com.cn/discuss/show/")){
        $('#submit-reply').unbind();
        for(let i=0;i<=10;i++){
            if(document.getElementsByClassName("am-btn am-btn-danger")[i].id=='submit-reply'){
                document.getElementsByClassName("am-btn am-btn-danger")[i].onclick=function(){whatever2();};
            }
        }
    }
})();