// ==UserScript==
// @name         Fuck QQ\知乎非官方网页提示、逼站的奇怪页面
// @namespace    http://huoyiming.cf:2005/
// @version      6.1
// @description  自动跳过QQ\知乎链接提醒、逼站的奇怪页面
// @author       Lucien2714
// @match        https://c.pc.qq.com/middlem.html?*
// @match        https://link.zhihu.com/?target=*
// @match        https://www.bilibili.com/s/video/*
// @icon         https://i.loli.net/2021/08/04/WtCjarZQqPwBlzI.png
// @grant        none
// @license      GPL-3.0
// @downloadURL https://update.greasyfork.org/scripts/430342/Fuck%20QQ%5C%E7%9F%A5%E4%B9%8E%E9%9D%9E%E5%AE%98%E6%96%B9%E7%BD%91%E9%A1%B5%E6%8F%90%E7%A4%BA%E3%80%81%E9%80%BC%E7%AB%99%E7%9A%84%E5%A5%87%E6%80%AA%E9%A1%B5%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/430342/Fuck%20QQ%5C%E7%9F%A5%E4%B9%8E%E9%9D%9E%E5%AE%98%E6%96%B9%E7%BD%91%E9%A1%B5%E6%8F%90%E7%A4%BA%E3%80%81%E9%80%BC%E7%AB%99%E7%9A%84%E5%A5%87%E6%80%AA%E9%A1%B5%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url=location.href;
    if(url.indexOf("https://c.pc.qq.com/middlem.html?")!==-1){
        var qstr=url.substring(url.indexOf("=")+1,url.indexOf("&"));
        var qprefix="";
        if(!qstr.includes("http")){
            qprefix="https://";
        }
        location.href=qprefix+decodeURIComponent(qstr);
    }
    else if(url.indexOf("https://link.zhihu.com/?target=")!==-1){
        var zstr=url.substring(url.indexOf("=")+1,url.length);
        var zprefix="";
        if(!zstr.includes("http")){
            zprefix="https://";
        }
        location.href=zprefix+decodeURIComponent(zstr);
    }
    else if(url.indexOf("https://www.bilibili.com/s/video/")!==-1){
        var bstr=document.URL.replace("/s","");
        var bprefix="";
        if(bstr.includes("http")){
            bprefix="https://";
        }
        location.href=bprefix+decodeURIComponent(bstr);
    }
})();
