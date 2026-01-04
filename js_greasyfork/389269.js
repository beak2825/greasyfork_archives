// ==UserScript==
// @name         定时刷新助手
// @namespace    http://tampermonkey.net/
// @version      2.0.4
// @description  定期ajax刷新你的网页，防止你被session过期掉线。
// @author       You
// @match        *://ucenter.yjsds.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389269/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/389269/%E5%AE%9A%E6%97%B6%E5%88%B7%E6%96%B0%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var url = location.href;
    console.log("[LoginOnlinePlugin "+curentTime()+"] "+url+" 已启用定时刷新");

    function get(url){
        console.log("[LoginOnlinePlugin "+curentTime()+"] request url="+url);
        var xmlHttpReq = null;
        if (window.ActiveXObject){
            xmlHttpReq = new ActiveXObject("Microsoft.XMLHTTP");
        }else if (window.XMLHttpRequest){
            xmlHttpReq = new XMLHttpRequest();
        }
        xmlHttpReq.open("GET", url, true);
        xmlHttpReq.onreadystatechange = function(){
            if (xmlHttpReq.readyState == 4)
            {
                if (xmlHttpReq.status == 200)
                {
                    var result = xmlHttpReq.responseText;
                    console.log("[LoginOnlinePlugin "+curentTime()+"] 刷新成功")
                }
            }
        };
        xmlHttpReq.send(null);
    }
    //对global的污染会造成奇怪的问题，因此千万不要随意为global的prototype增删方法
    //作为辅助插件，更要有这样的职业操守。
    function curentTime()
    {
        return new Date().toLocaleString();
    }
    var interval = 1000 * 60 * 20; //刷新间隔
    var req = function(){get(url);}
    setInterval(req, interval);
})();