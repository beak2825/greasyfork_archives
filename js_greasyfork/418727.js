// ==UserScript==
// @name         北邮人BT趣味盒高度调整
// @namespace    http://tampermonkey.net/
// @description  北邮人BT首页趣味盒高度调整+首页poster悬停放大
// @version      1.13
// @author       wangcr
// @match        https://bt.byr.cn/index.php
// @match        https://bt.byr.cn/
// @match        https://byr.pt/index.php
// @match        https://byr.pt/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418727/%E5%8C%97%E9%82%AE%E4%BA%BABT%E8%B6%A3%E5%91%B3%E7%9B%92%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/418727/%E5%8C%97%E9%82%AE%E4%BA%BABT%E8%B6%A3%E5%91%B3%E7%9B%92%E9%AB%98%E5%BA%A6%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.changeFunboxHeight = function(){
        $("iframe[src='fun.php?action=view']").attr("height", $("#funbox_height").attr("value"));
        localStorage.funbox_height = $("#funbox_height").attr("value");
    }
    window.changeShoutboxHeight = function(){
        $("iframe[src='shoutbox.php?type=shoutbox']").attr("height", $("#shoutbox_height").attr("value"));
        localStorage.shoutbox_height = $("#shoutbox_height").attr("value");
    }
    var funbox_height;
    if(localStorage.funbox_height == undefined || localStorage.funbox_height == null){funbox_height = "300";}else{funbox_height = localStorage.funbox_height;}
    $("iframe[src='fun.php?action=view']").attr("height", funbox_height);

    var shoutbox_height;
    if(localStorage.shoutbox_height == undefined || localStorage.shoutbox_height == null){shoutbox_height = "300";}else{shoutbox_height = localStorage.shoutbox_height;}
    $("iframe[src='shoutbox.php?type=shoutbox']").attr("height", shoutbox_height);

    var funbox_element = document.createElement('span');
    funbox_element.className = "small";
    funbox_element.innerHTML = '<span calss="small"> - | <input id="funbox_height" type="range" value=' + funbox_height + ' min="180" max="1000" step="10" onchange="changeFunboxHeight()" style="height: 7pt;vertical-align: text-bottom;">| </span>';
    $(funbox_element).insertAfter($($("h2:contains('趣味盒')").children("font").get(0)));

    var shoutbox_element = document.createElement('span');
    shoutbox_element.className = "small";
    shoutbox_element.innerHTML = '<span calss="small"> - | <input id="shoutbox_height" type="range" value=' + shoutbox_height + ' min="180" max="1000" step="10" onchange="changeShoutboxHeight()" style="height: 7pt;vertical-align: text-bottom;">| </span>';
    $(shoutbox_element).insertAfter($($("h2:contains('群聊区')").children("font").get(0)));

    var img_list = document.getElementsByTagName("img");
    for (var ind = 0; ind < img_list.length; ++ind) {
        if (img_list[ind].getAttribute("alt") == "poster" && img_list[ind].parentNode.tagName.toUpperCase() == "A"){
            img_list[ind].style["transition-duration"]="0.1s";
            img_list[ind].style["-moz-transition-duration"]="0.1s";
            img_list[ind].style["-webkit-transition-duration"]="0.1s";
            img_list[ind].style["-o-transition-duration"]="0.1s";
            img_list[ind].onmouseover=function(){
                this.style["transform"]="scale(1.12)";
            }
            img_list[ind].onmouseout=function(){
                this.style["transform"]="";
            }
        }
    }

})();