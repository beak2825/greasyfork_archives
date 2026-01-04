// ==UserScript==
// @name         video.msj1.com自动下一集
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  video.msj1.com网站自动下一集
// @author       You
// @match        *://video.msj1.com/play/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.11.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/370907/videomsj1com%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.user.js
// @updateURL https://update.greasyfork.org/scripts/370907/videomsj1com%E8%87%AA%E5%8A%A8%E4%B8%8B%E4%B8%80%E9%9B%86.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("start!");
    setTimeout("window.MainPageHandle()", 1000)
})();


window.MainPageHandle = function()
{
    console.log("find ckplayer_cms_player");
    var a = CKobject.getObjectById('ckplayer_cms_player');
    if (a)
    {
        console.log("finded ckplayer_cms_player");
        a.addListener('ended','window.autoNext');

        $("body").css("background","#000");
        $(".navbar-inverse").css("display","none");
        $(".page-header").css("display","none");
        $(".col-md-4").css("display","none");
        $(".col-md-8").css("width","100%");
        $(".col-md-8").css("padding","0px");
        $(".container").css("width","1310px");
    }
    else
    {
        setTimeout("window.MainPageHandle()", 1000)
    }
}

window.autoNext = function(){
    $("#ff-next")[0].click();
}


