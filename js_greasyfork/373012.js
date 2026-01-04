// ==UserScript==
// @name         Luogu Helper
// @namespace    http://tampermonkey.net/
// @version      0.26
// @description  Night Mod For Luogu
// @author       FangHao
// @match        https://www.luogu.org/problemnew/show/*
// @match        https://luogu.org/problemnew/show/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373012/Luogu%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/373012/Luogu%20Helper.meta.js
// ==/UserScript==



(function() {
    'use strict';
    var x = document.getElementsByTagName("h1");
    for(var i = 0; i < x.length; i++){
        x[i].style = "color:#ececec";
    }
    x = document.getElementsByTagName("h2");
    for(i = 0; i < x.length; i++){
        x[i].style = "color:#ececec";
    }
    x = document.getElementsByTagName("h3");
    for(i = 0; i < x.length; i++){
        x[i].style = "color:#ececec";
    }
    x = document.getElementsByTagName("h4");
    for(i = 0; i < x.length; i++){
        x[i].style = "color:#ececec";
    }
    x = document.getElementsByTagName("h5");
    for(i = 0; i < x.length; i++){
        x[i].style = "color:#ececec";
    }
    x = document.getElementsByTagName("p");
    for(i = 0; i < x.length; i++){
        x[i].style = "color:#ececec";
    }
    x = document.getElementsByTagName("li");
    for(i = 0; i < x.length; i++){
        x[i].style = "color:#ececec";
    }
    x = document.getElementsByTagName("strong");
    for(i = 0; i < x.length; i++){
        x[i].style = "color:#ececec";
    }
    x = document.getElementsByTagName("pre");
    for(i = 0; i < x.length; i++){
        x[i].style = "background-color: #777777; color: #e8e8e8;";
    }
    var root=document.getElementsByClassName("lg-article am-g")[0];
           root.style.cssText="background-color: #444444;";
    root=document.getElementsByClassName("am-panel am-panel-default lg-summary")[0];
           root.style.cssText="background-color: #444444;";
    root=document.getElementsByClassName("am-panel am-panel-default lg-summary")[1];
           root.style.cssText="background-color: #444444;";
    root=document.getElementsByClassName("am-panel am-panel-default lg-summary am-hide-sm")[0];
           root.style.cssText="background-color: #444444;";
    root=document.getElementsByClassName("lg-content")[0];
           root.style.cssText="background-color: #353535;";
    root=document.getElementsByClassName("lg-toolbar")[0];
           root.style.cssText="background-color: #353535; border: 1px solid #464646; ";
    root=document.getElementsByClassName("language-cpp line-numbers hljs")[0];
           root.style.cssText="background: #bbb;";
/*    root=document.getElementsByClassName("am-collapse am-topbar-collapse")[0];
           root.style.cssText="background-color: black;";
    root=document.getElementsByClassName("am-dropdown")[0];
           root.style.cssText="background-color: black;";
    root=document.getElementsByClassName("am-dropdown am-hide-sm-only")[0];
           root.style.cssText="background-color: black;";
    root=document.getElementsByClassName("lg-header-li lg-md-hide")[0];
           root.style.cssText="background-color: black;";
    root=document.getElementsByClassName("lg-header-li lg-md-hide")[1];
           root.style.cssText="background-color: black;";
           */
})();