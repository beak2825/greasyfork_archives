// ==UserScript==
// @name               No Tiexue Post2
// @name:zh-CN         替换铁血post2
// @namespace          daizp
// @version            0.2.5
// @description        铁血论坛链接替换'post2'为‘post’，不用再为满屏广告烦恼，直接跳转查看原帖
// @author             daizp
// @include            http://www.tiexue.net/*
// @include            http://bbs.tiexue.net/*
// @grant              none
// @downloadURL https://update.greasyfork.org/scripts/25620/No%20Tiexue%20Post2.user.js
// @updateURL https://update.greasyfork.org/scripts/25620/No%20Tiexue%20Post2.meta.js
// ==/UserScript==

(function () {
    'use strict';
    switch (location.host) {
        case "www.tiexue.net":
            no_www_post2();
            break;
        case "bbs.tiexue.net":
            no_bbs_post2();
            no_bbs_ad();
            break;
    }
    //替换主页post2为post
    function no_www_post2(){
        var i=0;
        var pic_obj = document.getElementById("pics"+i.toString());
        while(pic_obj){
            pic_obj.innerHTML = pic_obj.innerHTML.replace(/post2/g,"post");
            pic_obj = document.getElementById("pics"+(i++).toString());
        }
    }
    //替换论坛post2为post
    function no_bbs_post2(){
        var pathname = location.pathname;
        if(pathname.substr(0,6) == "/post2"){
            window.location = "post" + pathname.substr(6);
        }
    }
    //删除bbs广告
    function no_bbs_ad(){
        //删除左边广告
        var left_ad = document.getElementById("Baidu_BBSPostNormalV3ContentLeftAD1");
        if(left_ad){
            left_ad.remove();
        }
    }
})();