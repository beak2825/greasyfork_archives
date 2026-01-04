// ==UserScript==
// @name        JP*G翻页
// @namespace   https://greasyfork.org/zh-CN/users/821
// @author      gfork
// @description 图片加入方向键访问上一页和下一页
// @match       *://*/*.png
// @match       *://*/*.jp*g
// @match       *://*/*.gif
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/417702/JP%2AG%E7%BF%BB%E9%A1%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/417702/JP%2AG%E7%BF%BB%E9%A1%B5.meta.js
// ==/UserScript==

var bfurl,aturl;
var url = window.location.href;
var num = url.match(/(\d+).jpg/);
if (num !== null) {
    var before = parseInt(num[1])-1;
    var after = parseInt(num[1])+1;
    if(before===0)
    {
        bfurl = null;
        aturl = url.replace(/(\d+).jpg/, after+".jpg");}
    else
    {
        bfurl = url.replace(/(\d+).jpg/, before+".jpg");
        aturl = url.replace(/(\d+).jpg/, after+".jpg");
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