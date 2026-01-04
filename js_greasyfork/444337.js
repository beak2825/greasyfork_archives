// ==UserScript==
// @name         Tieba Purification
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @supportURL   https://github.com/LanluZ/Tieba-Purification
// @homepageURL  https://github.com/LanluZ/Tieba-Purification
// @description  百度贴吧广告净化
// @author       LanluZ
// @match        https://tieba.baidu.com/*
// @grant        unsafeWindow
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/444337/Tieba%20Purification.user.js
// @updateURL https://update.greasyfork.org/scripts/444337/Tieba%20Purification.meta.js
// ==/UserScript==

var url=window.location.href;

//主页
function index(){
    //去除广告
    document.getElementById("spage_liveshow_slide").remove();
    //右侧广告
    document.getElementById("lu-home-aside").remove();
    document.getElementById("notice_item").remove();
    //左侧我的游戏
    document.getElementById("spage_game_tab_wrapper").remove();
}

//帖子
function discuss(){

    setTimeout(() => {
        //右侧广告
        let j = 0;
        while(!document.getElementById("fc-lu-ad")){
            j++;if(j>=10000)break;//反死循环
        }document.getElementById("fc-lu-ad").remove();
        //左侧广告
        var parent = document.getElementsByClassName("label_text");
        parent = parent[0].parentNode;
        parent.remove();
        //楼层广告
        var i;
        for(i = 0;i<40;i++){
            if(document.getElementById("mediago-tb-pb-list-" + i)){
                document.getElementById("mediago-tb-pb-list-" + i).remove();
            }
        }
        for(i = 0;i<40;i++){
            if(document.getElementsByClassName("fengchao-wrap-box")[i]){
                document.getElementsByClassName("fengchao-wrap-box")[i].remove();
            }
        }
        //上端广告
        document.getElementById("banner_pb_customize").remove();
    }, 1500);

}

//吧
function bar(){
    setTimeout(() => {
        //右侧广告
        let j = 0;//反死循环
        while(!document.getElementById("fc-lu-ad")){
            j++;if(j>=10000)break;
        }document.getElementById("fc-lu-ad").remove();
        //左侧广告
        var parent = document.getElementsByClassName("label_text");
        parent = parent[0].parentNode;
        parent.remove();
        //帖子广告
        for(var i = 0;i<50;i++){
            if(document.getElementById("mediago-tb-frs-list-" + i)){
                document.getElementById("mediago-tb-frs-list-" + i).remove();
            }
        }
    }, 1500);

}

(function() {
    'use strict';

    switch(url){

        case "https://tieba.baidu.com/index.html":
            index();
        break;

        case "https://tieba.baidu.com/":
            index();
        break

        case "https://tieba.baidu.com/p/" + url.slice("https://tieba.baidu.com/p/".length):
            discuss();
        break;

        case "https://tieba.baidu.com/f?kw" + url.slice("https://tieba.baidu.com/f?kw".length):
            bar();
        break;
    }
})()