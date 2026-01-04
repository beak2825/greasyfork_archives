// ==UserScript==
// @name        qq空间自动点赞
// @author       gpyuce
// @version      2020.11.16
// @description  qq空间自动点赞 点赞好友说说
// @match        https://user.qzone.qq.com/*
// @namespace https://greasyfork.org/users/704269
// @downloadURL https://update.greasyfork.org/scripts/415985/qq%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.user.js
// @updateURL https://update.greasyfork.org/scripts/415985/qq%E7%A9%BA%E9%97%B4%E8%87%AA%E5%8A%A8%E7%82%B9%E8%B5%9E.meta.js
// ==/UserScript==
function dianZan()
{
    var list=document.getElementsByClassName("item qz_like_btn_v3 ");
    var i=0
    for(i=0;i<list.length;i++)
    {
        if(list[i].attributes[6].value=='like')
        {
            list[i].click();
        }
    }
}


function doAll()
{
    dianZan();
    window.scrollBy(0,600);
}

var time=prompt("请输入点赞间隔时间，默认两秒",'2')*1000;
window.setInterval(doAll,time);






(function () {
    'use strict';
    console.log("function ()函数启用");

})();