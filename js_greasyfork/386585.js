// ==UserScript==
// @name         改善楓林網影片大小修正版
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  這是一個無聊人在無聊時寫出來的小插件，歡迎留言提出建議
// @author       Adam
// @match        http://fenglin.to/*
// @match        http://video.fenglin.to/*
// @match        http://maple.bilibili.to/*
// @match        http://video.bilibili.to/*
// @include      /8maple.ru*
// @grant        none
// @require     https://code.jquery.com/jquery-latest.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.1/iframeResizer.contentWindow.min.js
// @require     https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/3.6.1/iframeResizer.min.js
// @downloadURL https://update.greasyfork.org/scripts/386585/%E6%94%B9%E5%96%84%E6%A5%93%E6%9E%97%E7%B6%B2%E5%BD%B1%E7%89%87%E5%A4%A7%E5%B0%8F%E4%BF%AE%E6%AD%A3%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/386585/%E6%94%B9%E5%96%84%E6%A5%93%E6%9E%97%E7%B6%B2%E5%BD%B1%E7%89%87%E5%A4%A7%E5%B0%8F%E4%BF%AE%E6%AD%A3%E7%89%88.meta.js
// ==/UserScript==
(function() {
var text = '插件版本：0.2&emsp;&emsp;<a href="https://www.goo.gl/gtqgpj" target="_blank" rel="noopener noreferrer">插件網站</a>'
var web = $(location).attr('hostname');
    'use strict';
    // Your code here...
    if(web=="maple.bilibili.to"&&$("div").hasClass("video")){
//Adjust Frame
    $("#main").find(".wrap").css("width","950px");
    $("#main").find(".wrap").find(".entry-header").addClass("wrap")
    $("#content").css("width","100%");
    $("#video iframe").attr("id","videoFrame");
    $('#videoFrame').removeAttr('width height');
    $("#videoFrame").css({"width":"100%","margin":"auto"});
    iFrameResize({log:true}, '#videoFrame')
//Create Button
    $("#video").parent().find('p:first').attr('id','button');
    $("#button").css("margin","0 0 0px")
        //Adding button from right to left
    $('#button').after("&emsp;");
    createSizeButton("100%","#button",function(){$("#main").find(".wrap").css("width","100%")});
    createSizeButton(" 90%","#button",function(){$("#main").find(".wrap").css("width","90%")});
    createSizeButton(" 80%","#button",function(){$("#main").find(".wrap").css("width","80%")});
    createSizeButton("854px","#button",function(){$("#main").find(".wrap").css("width","854px")});
//Remove image above
    $('img').each(function(){
        if ($(this).attr('src') == 'http://8maple.ru/comic.jpg' ){
            $(this).remove();
        }
    });
        //Add Space between button and video
    var Space = document.createElement("P");
    Space.style.margin = "0px";
    Space.id = "version"
    Space.style.opacity = "0";
    $('#video').before(Space);
    $("#version").mouseover(function(){Space.style.opacity="1"});
    $("#version").mouseout(function(){Space.style.opacity="0"});
    $("#version").html(text);
    }
    if(web=="video.bilibili.to"){
//remove ad
     $(".baiduyytf").remove();
     $("#ad_bar1").remove();
     $("#ad_bar7").remove();
     $("#yytf").find("br").remove();
//Adjust Frame
     $("style").html("a{cursor: pointer;text-decoration: none;outline: none;} .dplayer-wrap {width:100%;height:100%;padding-top:56.25%} #jwplayer {height:100%!important;position:absolute;top:0;}");
     $("#yytf").attr("width","100%");
//Play instantly
     $("#djs").html("0");
    }
})();
function createSizeButton(size,path,action) {
    var x = document.createElement("BUTTON");
    var t = document.createTextNode(size);
    x.appendChild(t);
    x.type = "button"
    x.onclick = action;
    $(path).after(x);
    $(path).after("&emsp;");
}