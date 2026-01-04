// ==UserScript==
// @name         PanDownload网页版跳转按钮
// @namespace https://greasyfork.org/users/30563
// @version      0.0.1
// @description  百度网盘分享链接页面加个按钮，点击可跳转到 PanDownload 网页版去下载
// @author       申杰
// @match        *://pan.baidu.com/s/*
// @match        *://pan.baidu.com/share/*
// @match        *://yun.baidu.com/s/*
// @downloadURL https://update.greasyfork.org/scripts/383388/PanDownload%E7%BD%91%E9%A1%B5%E7%89%88%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/383388/PanDownload%E7%BD%91%E9%A1%B5%E7%89%88%E8%B7%B3%E8%BD%AC%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function addDiv(){
        var div = document.createElement("div");
        div.innerHTML = "PanDownload网页版";
        div.title="点我可以跳转到PanDownload网页版下载\n有问题QQ联系我：970852638\n                           申杰制作";
        var css = "position:fixed;top:63px;left:3px;z-index:999999999;width:193px;height:30px;line-height:30px;text-align:center;font-size:18px;font-family:Verdana, Arial, '宋体';font-weight:700;color:#f00;user-select:none;padding:0px;white-space:nowrap;border:3px solid #f00;cursor:pointer;";
        div.style.cssText = css;
        if(window.self === window.top){ document.body.appendChild(div);}
        div.addEventListener("click",function(){
            let url = window.location.href;
            url = url.replace('baidu.com','baiduwp.com');
            window.open(url, "_blank");});
   }
   addDiv();
})();

