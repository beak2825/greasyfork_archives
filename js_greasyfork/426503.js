// ==UserScript==
// @name        JAVLib tag助手
// @namespace   JAVLib tag助手
// @description 鼠标悬停在javLibrary图片上时显示该视频类型。
 
// @include     http*://www.p26y.com/*
// @include     http*://www.k25m.com/*
// @include     http*://www.javlibrary.com/*
// @include     http*://www.k25m.com/*
 
 
// @version     0.4
// @run-at      document-end
// @grant       GM_xmlhttpRequest
// @grant       GM_setClipboard
// @grant       GM_setValue
// @grant       GM_getValue
// @grant       GM_addStyle
// @grant       GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/426503/JAVLib%20tag%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/426503/JAVLib%20tag%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
 
"use strict";
let videos = document.querySelector(".videos");
let video = videos
 
var get_tags = function(element, url){
    GM_xmlhttpRequest({
            method: "GET",
            url: url,
            responseType: "document",
            onload: function (result) {
                let string = "";
                let video_page = result.response;
                let genres = video_page.querySelector("#video_genres").getElementsByClassName("genre")
                for (let i=0;i<genres.length;i++){
                    string += genres[i].innerText
                    string += ", "
                }
                element.setAttribute("data-toggle", "tooltip")
                element.setAttribute("title", string)
                element.getElementsByTagName("img")[0].setAttribute("data-toggle", "tooltip")
                element.getElementsByTagName("img")[0].setAttribute("title", string)
            },
            onerror: function (e) {
                console.error(e);
                throw "search error";
            }
        });
}
 
$(".video").each(function(){
    var url = "http://www.k25m.com/cn" + this.getElementsByTagName("a")[0].getAttribute('href').slice(1,);
    get_tags(this, url);
});