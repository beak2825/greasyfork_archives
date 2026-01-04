// ==UserScript==
// @name        逛丢
// @namespace   https://greasyfork.org/zh-CN/users/821
// @author      gfork
// @description 逛丢加入方向键访问上一页和下一页
// @include     https://guangdiu.com/*
// @exclude     https://guangdiu.com/rank.php*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/32753/%E9%80%9B%E4%B8%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/32753/%E9%80%9B%E4%B8%A2.meta.js
// ==/UserScript==

var bfurl,aturl;
var url = window.location.href;
var num = url.match(/\?p=(\d+)/);
if (num !== null) {
    var before = parseInt(num[1])-1;
    var after = parseInt(num[1])+1;
    if(before===0)
    {
        bfurl = null;
        aturl = url.replace(/\?p=(\d+)/, "?p="+after);}
    else
    {
        bfurl = url.replace(/\?p=(\d+)/, "?p="+before);
        aturl = url.replace(/\?p=(\d+)/, "?p="+after);
    }
}
else
{
    bfurl = null;
    aturl = url.replace(/\?/, "?p=2&");
}
if (url == "https://guangdiu.com/")
{
    bfurl = null;
    aturl = "https://guangdiu.com/index.php?p=2";
}
if (url == "https://guangdiu.com/cheaps.php")
{
    bfurl = null;
    aturl = "https://guangdiu.com/cheaps.php?p=2";
}
if (url == "https://guangdiu.com/hots.php")
{
    bfurl = null;
    aturl = "https://guangdiu.com/hots.php?p=2";
}

var handle = {
    hotKey: function (e) {
        //默认退出键为ESC。需要修改为其他快捷键的请搜索"keycode"，修改为按键对应的数字。
        if (e.keyCode == 37 && bfurl !== null) {
            window.location.href = bfurl;
        }
        if (e.keyCode == 39 ) {
            window.location.href = aturl;
        }


    }
};
document.addEventListener('keydown', handle.hotKey, false);