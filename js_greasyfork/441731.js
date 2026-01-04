// ==UserScript==
// @name         🔥持续更新中🔥 【原创】CSDN免登录复制、宽屏化，各大网站去广告，网页美化！！！
// @namespace    醉_Code
// @version      1.5
// @description  【原创】CSDN免登录复制、宽屏化，CSDN、简书去广告，网页美化！！！
// @author       醉_Code
// @include      *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        GM_registerMenuCommand
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @license      MIT
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.5.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@10.15.5/dist/sweetalert2.all.min.js
// @resource     customCSS https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css
// @downloadURL https://update.greasyfork.org/scripts/441731/%F0%9F%94%A5%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD%F0%9F%94%A5%20%E3%80%90%E5%8E%9F%E5%88%9B%E3%80%91CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E3%80%81%E5%AE%BD%E5%B1%8F%E5%8C%96%EF%BC%8C%E5%90%84%E5%A4%A7%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96%EF%BC%81%EF%BC%81%EF%BC%81.user.js
// @updateURL https://update.greasyfork.org/scripts/441731/%F0%9F%94%A5%E6%8C%81%E7%BB%AD%E6%9B%B4%E6%96%B0%E4%B8%AD%F0%9F%94%A5%20%E3%80%90%E5%8E%9F%E5%88%9B%E3%80%91CSDN%E5%85%8D%E7%99%BB%E5%BD%95%E5%A4%8D%E5%88%B6%E3%80%81%E5%AE%BD%E5%B1%8F%E5%8C%96%EF%BC%8C%E5%90%84%E5%A4%A7%E7%BD%91%E7%AB%99%E5%8E%BB%E5%B9%BF%E5%91%8A%EF%BC%8C%E7%BD%91%E9%A1%B5%E7%BE%8E%E5%8C%96%EF%BC%81%EF%BC%81%EF%BC%81.meta.js
// ==/UserScript==
//var $,jQuery;
(function() {
    'use strict';
    //// @run-at       document-idle
    //$("head").append($(`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css">`));
    function setting1() {
        //document.getElementsByTagName("body")[0].style = "overflow: hidden; filter: blur(3px); pointer-events: none;";
        if(GM_getValue("去广告")){
            GM_setValue("去广告",0);
        }
        else{
            GM_setValue("去广告",1);
        }
        if(GM_getValue("去广告")==null){
            GM_setValue("去广告",0);
        }
        location.reload();
        return;
    }
    if(GM_getValue("去广告")==1){
        GM_registerMenuCommand("✔ 去广告", setting1, "h");
    }
    else{
        if(GM_getValue("去广告")==null){
            GM_registerMenuCommand("✔ 去广告", setting1, "h");
        }
        else{
            GM_registerMenuCommand("× 去广告", setting1, "h");
        }
    }
    function setting2() {
        //document.getElementsByTagName("body")[0].style = "overflow: hidden; filter: blur(3px); pointer-events: none;";
        if(GM_getValue("复制")){
            GM_setValue("复制",0);
        }
        else{
            GM_setValue("复制",1);
        }
        if(GM_getValue("复制")==null){
            GM_setValue("复制",0);
        }
        location.reload();
        return;
    }
    if(GM_getValue("复制")){
        GM_registerMenuCommand("✔ CSDN免登录复制", setting2, "h");
    }
    else{
        if(GM_getValue("复制")==null){
            GM_registerMenuCommand("✔ CSDN免登录复制", setting2, "h");
        }
        else{
            GM_registerMenuCommand("× CSDN免登录复制", setting2, "h");
        }
    }
    function setting3() {
        //document.getElementsByTagName("body")[0].style = "overflow: hidden; filter: blur(3px); pointer-events: none;";
        if(GM_getValue("宽屏化")){
            GM_setValue("宽屏化",0);
        }
        else{
            GM_setValue("宽屏化",1);
        }
        if(GM_getValue("宽屏化")==null){
            GM_setValue("宽屏化",0);
        }
        location.reload();
        return;
    }
    if(GM_getValue("宽屏化")){
        GM_registerMenuCommand("✔ CSDN宽屏化", setting3, "h");
    }
    else{
        if(GM_getValue("宽屏化")==null){
            GM_registerMenuCommand("✔ CSDN宽屏化", setting3, "h");
        }
        else{
            GM_registerMenuCommand("× CSDN宽屏化", setting3, "h");
        }
    }
    var url = window.location.host;
    var x;
    if(GM_getValue("去广告")){
        x = ["blog_container_aside",
             "passport-container passport-container-mini",
             "csdn-side-toolbar ",
             "left-toolbox",
             "toolbar-btn toolbar-btn-vip csdn-toolbar-fl",
             "login-box",
             "col-xs-7 col-xs-offset-1 aside",
             "commonclass",
             "_3Qa4dn5YlokOkxn6RsnEsL_0",
             "-umr26",
             "_2OwGUo",
             "app",
             "_1F7CTF",
             "main clearfix c-wrapper c-wrapper-l ",
             "s-isindex-wrap s-hotsearch-wrapper",
             "share-center",
             "_8m8a62j fc-9bdbba6e00035823 _8m8a62j EC_result new-pmd c-container",
             "_2z1q32z",
             "result c-container new-pmd",
             "j_sidercontrol"
            ];
    }
    if(url=="blog.csdn.net"){
        try{
            if(GM_getValue("复制")){
                document.getElementById("content_views").id = 'text'; //免登录复制
            }
            if(GM_getValue("宽屏化")){
                    document.getElementsByClassName("main_father clearfix d-flex justify-content-center")[0].style = "height:100%;";
                document.getElementsByTagName("main")[0].style = "width: 100%;"; //宽屏化
            }
        }
        catch(err){}
    }
    else if(url == "www.baidu.com" && GM_getValue("去广告")){
        if(window.location.search.length < 7){
            GM_addStyle('#head{min-height:auto !important}');
            GM_addStyle('html{overflow-y:hidden !important}');
            GM_addStyle('#head_wrapper{height:70% !important}');
            GM_addStyle('#lg{margin-bottom: 40px; !important}');
            x = [];
        }
        else{
            x = [];
            var d = document.getElementsByClassName("f13 c-gap-top-xsmall se_st_footer");
            for(var t1 = 0,len1 = d.length; t1 < len1; t++) {
                try{
                    d[t].remove();
                }
                catch(err){
                }
            }
        }
    }
    x.append("");
    if(GM_getValue("去广告")){
        for(var i = 0, len = x.length; i < len; i++) {
            try{
                var s = document.getElementsByClassName(x[i]);
                //alert(s.length);
                for(var t = 0, lenb = s.length; t < lenb; t++) {
                    s[t].remove();
                }
            }
            catch(err){
            }
        }
    }
})();