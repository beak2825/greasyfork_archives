// ==UserScript==
// @name         QQ音乐付费音乐流畅版本下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  再收费歌曲听歌页面有个纯净下载
// @author       海绵宝宝
// @match        https://y.qq.com/portal/player.html
// @require       http://cdn.bootcss.com/jquery/1.11.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/28082/QQ%E9%9F%B3%E4%B9%90%E4%BB%98%E8%B4%B9%E9%9F%B3%E4%B9%90%E6%B5%81%E7%95%85%E7%89%88%E6%9C%AC%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/28082/QQ%E9%9F%B3%E4%B9%90%E4%BB%98%E8%B4%B9%E9%9F%B3%E4%B9%90%E6%B5%81%E7%95%85%E7%89%88%E6%9C%AC%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var k={};
    function p()
    {
        var url=$("source").attr("src");
        $("div[class='mod_songlist_toolbar']").append('<a href="'+url+'" class="mod_btn" download="门票p"><i class="mod_btn_green__icon_down"></i>纯净下载<span class="mod_btn__border"></span></a>');
    }
    k=function()
    {
        var y=$("#h5audio_media").text();
        if(!y)
        {
            var t=document.getElementsByTagName("a");//.click();
            for(var h=0; h<t.length;h++)
            {
                if(t[h].getAttribute("id")=="btnplay")
                {
                    t[h].click();
                }
            }
            setTimeout(p,3000);
        }
        else
        {alert(y);}
    };
    setTimeout(k,2000);
    // Your code here...
})();