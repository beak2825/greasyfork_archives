// ==UserScript==
// @name         晋江背景色
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  修改晋江论坛的背景颜色，顺便移除了广告
// @author       You
// @include      https://bbs.jjwxc.net/showmsg.php?*
// @include      https://bbs.jjwxc.net/board.php?*
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/425725/%E6%99%8B%E6%B1%9F%E8%83%8C%E6%99%AF%E8%89%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/425725/%E6%99%8B%E6%B1%9F%E8%83%8C%E6%99%AF%E8%89%B2.meta.js
// ==/UserScript==

'use strict';

function changeMainPage(choosedColor){
    //首页
    //改整体颜色
    document.body.bgColor=choosedColor;
    //隐藏顶部广告
    //document.querySelector("body > table.width_800 > tbody > tr:nth-child(2)").remove();
    //document.querySelector("body > table.width_800 > tbody > tr:nth-child(2)").remove();
    //document.querySelector("body > table.width_800 > tbody > tr:nth-child(2)").remove();
    document.querySelector("body > table.width_800 > tbody").remove();
    //修改帖子标题背景颜色
    var obj = document.querySelector("#msglist > tbody").getElementsByClassName('boardlist');
    for(var i=0;i<obj.length;i++){
        obj.item(i).bgColor=choosedColor;
    }
    //移除底部
    document.querySelector("#footer").remove();
}

function changePost(choosedColor){
    //帖子
    //隐藏顶端广告
    document.getElementsByClassName('ad360_box')[0].remove();
    //隐藏底部广告
    document.querySelector("#imgurl").remove();
    //隐藏回帖广告
    var obj = document.getElementsByClassName('textbook');
    for(var i=0;i<obj.length;i++){
        obj.item(i).style.display = 'none';
    }
    //改整体颜色
    document.body.bgColor=choosedColor;
    //修改按钮颜色
    document.querySelector("#showmore_button").style.backgroundColor=choosedColor;
    //隐藏头像
    /*var obj2 = document.getElementsByClassName('image1');
    for(i=0;i<obj2.length;i++){
        obj2.item(i).style.display = 'none';
    }*/
    document.querySelector("#selecthead > td:nth-child(1)").style.backgroundColor=choosedColor;
    //document.querySelector("#selecthead").style.display = 'none';
    //移除底部
    document.querySelector("#footer").remove();
}

function changeColor(choosedColor){
    if(window.location.pathname=="/board.php"){
        changeMainPage(choosedColor);
    }
    if(window.location.pathname=="/showmsg.php"){
        changePost(choosedColor);
    }
}

let yellow = "#F6F4EC";
let green = "#CCE8CF";
let grey = "#F2F2F2";
let olive = "#E1E6D7";

//修改颜色入口
changeColor(green);
