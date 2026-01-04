// ==UserScript==
// @name 返回BiliBili原直播间界面
// @version 0.0.1
// @author ZyFortis
// @description 返回BiliBili原直播间界面，显示B站原本的直播间界面而不是活动界面的直播间
// @match *://live.bilibili.com/*
// @noframes
// @namespace https://greasyfork.org/users/769089
// @downloadURL https://update.greasyfork.org/scripts/426037/%E8%BF%94%E5%9B%9EBiliBili%E5%8E%9F%E7%9B%B4%E6%92%AD%E9%97%B4%E7%95%8C%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/426037/%E8%BF%94%E5%9B%9EBiliBili%E5%8E%9F%E7%9B%B4%E6%92%AD%E9%97%B4%E7%95%8C%E9%9D%A2.meta.js
// ==/UserScript==

var oldUrlPath = window.location.pathname;
var oldURL = window.location.href;
if (oldURL.includes('blanc'))
{
    return;
}
var x = document.getElementsByTagName("title");
if (x[0].innerHTML == 'VR二周年二次创作大赛')
{
    var newURL = 'https://live.bilibili.com/'.concat('blanc',oldUrlPath);
    window.location.replace(newURL)
}