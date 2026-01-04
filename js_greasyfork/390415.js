// ==UserScript==
// @name         clean baidu index
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  try to take over the world!
// @author       DannyWu
// @match        https://www.baidu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390415/clean%20baidu%20index.user.js
// @updateURL https://update.greasyfork.org/scripts/390415/clean%20baidu%20index.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementById("su").value = "What's your problem?"
    //document.getElementById("s_top_wrap").remove();
    document.title = "What's your problem?"
    $('#su').css('width','180')

    //try{
    //document.getElementById("s_upfunc_menus").remove();

    //document.getElementById("u_sp").remove();}
    //catch(err){
    //var a=1;
    //}
    try{
        document.getElementById("s-top-left").remove();

    }
    catch(err){
    var b=1;
    }
    //try{
     //   document.getElementById("virus-2020").remove();

    //}
    //catch(err){
    //var c=1;
    //}
    document.getElementById("su").value = "What's your problem?"
    try{
        document.getElementById("s-usersetting-top").remove();

    }
    catch(err){
    var d=1;
    }
    document.getElementById("s_lm_wrap").remove();
    document.getElementById("su").value = "What's your problem?"
    document.getElementById("s_lg_img").remove();
    document.getElementById("s_top_wrap").remove();
    document.getElementById("bottom_layer").remove();
    document.getElementById("s-hotsearch-wrapper").remove();
    document.getElementById("s_side_wrapper").remove();


    document.getElementById("su").value = "What's your problem?"
})();