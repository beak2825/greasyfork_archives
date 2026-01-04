// ==UserScript==
// @name         H-Flash Downloader
// @name:zh-CN   H-Flash 下载器
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description:en  Create download link for flash games on h-flash.com
// @description:zh-cn  添加h-flash.com中游戏的下载链接
// @author       sini
// @match        https://h-flash.com/*
// @icon         
// @grant        GM.xmlHttpRequest
// @license      GPLv3
// @description Create swf download link on the info bar
// @downloadURL https://update.greasyfork.org/scripts/442879/H-Flash%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/442879/H-Flash%20Downloader.meta.js
// ==/UserScript==

function create_dl(downpath,downname){
    var dl=document.createElement('A');
    var dlText=document.createTextNode("⬇️Download");
    dl.href=downpath;
    dl.download=downname;
    dl.appendChild(dlText);
    dl.className="Download Link"
    dl.onmouseout=function(ev){
        ev.target.style.color="#000000";
    }
    dl.onmouseover=function(ev){
        ev.target.style.color="#FF00FF";
    }
    return dl;
}
function add_dl(downpath,downname,parentE){
    var dl=create_dl(downpath,downname);
    var span0=parentE.getElementsByTagName("span")[0];
    parentE.insertBefore(dl,span0);
}
function add_dl_by_url(urlt,parentE){
    GM.xmlHttpRequest({
        method: "GET",
        url: urlt,
        onload: function(response) {
            var t=response.responseText;
            var sBegin=t.search("var downpath");
            var sEnd=t.search("var downallow")
            t=t.substring(sBegin,sEnd);
            eval(t);
            add_dl(downpath,downname,parentE);
        }
    });
}
var last=0;
function add_lite_dl(){
    var e=document.getElementsByClassName("gamebox");
    var e_dl=e[0].getElementsByClassName("Download Link");
    if(e_dl.length==0){
        last=0;
    }
    while(last<e.length){
        add_dl_by_url(e[last].href,e[last]);
        last++;
    }
}

(function() {
    'use strict';

    // Your code here...
    if(typeof(downpath)!='undefined'){
        var e=document.getElementsByClassName("rankinfo");
        add_dl(downpath,downname,e[0]);
    }
    setInterval(add_lite_dl,1000);
})();