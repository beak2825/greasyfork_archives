// ==UserScript==
// @name         Trello - change bg set cookie
// @name:zh-CN   Trello - 修改背景
// @namespace    null
// @homepageurl  null
// @version      1.1.5
// @description  修改trello背景
// @description:zh-CN 修改trello背景图片
// @author       will
// @match        http*://*trello.com/b/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25721/Trello%20-%20change%20bg%20set%20cookie.user.js
// @updateURL https://update.greasyfork.org/scripts/25721/Trello%20-%20change%20bg%20set%20cookie.meta.js
// ==/UserScript==
var setCookie = function (name, value) {
    if(localStorage){
        localStorage.setItem(name, value);
    }else{
        var days = 30;
        var exp = new Date();
        exp.setTime(exp.getTime() + days * 24 * 60 * 60 * 1000);
        document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
    }
};
var getCookie = function(name) {
    var ret = "";
    if(localStorage){
        ret = localStorage.getItem(name);
    }else{
        var reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
        var arr = document.cookie.match(reg);
        if (arr) {
            ret = unescape(arr[2]);
        }
    }
    return ret;
};
var addbg = function(){
    if($("body").css("background-image") == 'none'){
        var bg = getCookie('background-image') || "http://lorempixel.com/1920/1080";
        $("body").css("background-image","url("+bg+")");
    }
};

var addbgBtn = function(){
    var flag = $('#changeBg20161216').html();
    if(!flag){
        var changeBg = $('<a class="board-header-btn board-header-btn-org-name board-header-btn-without-icon"><span class="board-header-btn-text" id="changeBg20161216">修改背景</span></a>');
        $('div.board-header').append(changeBg); // 添加按钮
        changeBg.click(function(){
            var bg = getCookie('background-image') || "http://lorempixel.com/1920/1080";
            var bg_val = prompt("请输入背景地址",bg);
            if(bg_val){
                setCookie('background-image',bg_val);
                $("body").css("background-image","url("+bg_val+")");
            }
        });
    }
};
var addID = function(){
    var cardLabelCss = "<style type=\"text/css\">\n    .list-card-labels .card-label {\n        font-weight: normal;\n        font-size: 10px;\n        height: 12px !important;\n        line-height: 10px !important;\n        padding: 0 3px;\n        margin: 0 3px 0 0;\n        text-shadow: none;\n        width: auto;\n        max-width: 50px;\n    }\n    .card-short-id {\n        display: inline;\n        font-weight: bold;\n    }\n    .card-short-id:after {\n        content:\" \";\n    }\n</style>";
    $('head').append(cardLabelCss);
    $('p.list-header-num-cards').show();
};
var init = function() {
    addID();
    setInterval(function(){
        addbgBtn();
        addbg();
    },1000);
};

$(function(){
    init();
});