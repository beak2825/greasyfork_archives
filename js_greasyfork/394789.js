// ==UserScript==
// @name         91wii 去广告
// @version      1.2
// @description  去除91wii页面广告包含顶端及左右两侧广告
// @author       wxjerry
// @match        *://www.91tvg.com/*
// @run-at       document-end
// @namespace https://greasyfork.org/users/433254
// @downloadURL https://update.greasyfork.org/scripts/394789/91wii%20%E5%8E%BB%E5%B9%BF%E5%91%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/394789/91wii%20%E5%8E%BB%E5%B9%BF%E5%91%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var res = [];
    var res1 = [];
    var i = 0;
    var m = 0;
    res=document.getElementsByTagName("div");
    for(; i < res.length; i++){
        if(res[i].className.substr(0, 4) == "__zy"){
            //console.log(res[i]);
            res[i].style.display="none";}
        if(res[i].id.indexOf("cscpvrich") !=-1){
            //console.log(res[i]);
            res[i].style.display="none";}
        if(res[i].className == "a_cn"){
            i = i + 1;
            //console.log(res[i]);
            res[i].style.display="none";
            i=i-1;}

    }
    if(document.getElementsByClassName("a_mu").length == 1){
        //console.log(document.getElementsByClassName("a_mu"));
        document.getElementsByClassName("a_mu")[0].style.display="none";
    }
    if(document.getElementsByClassName("a_fl").length == 1){
        //console.log(document.getElementsByClassName("a_fl"));
        document.getElementsByClassName("a_fl")[0].style.display="none";
    }
    if(document.getElementsByClassName("a_cn").length == 1){
        //console.log(document.getElementsByClassName("a_cn"));
        document.getElementsByClassName("a_cn")[0].style.display="none";
    }
    if(document.getElementsByName("__main_iframe__").length == 1){
        //console.log(document.getElementsByName("__main_iframe__"));
        document.getElementsByName("__main_iframe__")[0].style.display="none";
    }
    if(document.getElementById("note")){
        //console.log(document.getElementById("note"));
        document.getElementById("note").style.display="none";}
    res1=document.getElementsByTagName("img");
    for(; m < res1.length; m++){
        if(res1[m].src.indexOf("tianjiunion") !=-1){
            //console.log(res1[m].parentNode.remove());
            }
    }
})();