// ==UserScript==
// @name         抖音视频下载插件
// @namespace    https://space.bilibili.com/1552375363
// @version      2.14
// @description  修改网页以使其出现一个按钮供用户点击下载抖音、快手视频
// @author       Xbodw
// @match        https://www.douyin.com/*
// @match        https://*.douyin.com
// @match        http://*
// @match        ftp://*
// @match        *://*/*
// @icon         data:image/jpeg;base64,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
// @require https://cdn.staticfile.org/jquery/2.1.4/jquery.min.js
// @grant        unsafeWindow
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceText
// @grant        GM_setClipboard
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_openInTab
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-start
// @license      MIT
// @source       https://greasyfork.org/scripts/457343-%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6/code/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.user.js
// @downloadURL https://update.greasyfork.org/scripts/457343/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/457343/%E6%8A%96%E9%9F%B3%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(window.onload = function() {
    'use strict';
    var ButtonElement2 = null;
    var button;
    var button1;
    var button2;
    var sleep = function(time) {
    var timeOut = new Date().getTime() + parseInt(time, 10);
    while(new Date().getTime() <= timeOut) {}
    };

     let id = GM_registerMenuCommand("设置", function(){
        document.querySelector('html').remove();
        document.writeln("<html>");
        document.writeln("    <head>");
        document.writeln("<style type=\"text/css\">");
        document.writeln(" body {background-color: white} ");
        document.writeln("</style>");
        document.writeln("<title>抖音视频下载插件 - 设置</title>");
        document.writeln("    </head>");
        document.writeln("<body>");
        document.writeln("<p>设置<p>");
        document.writeln("</body>");
        document.writeln("</html>");
        document.title = "抖音视频下载插件 - 设置";
    });

    function Viewer(TabType,ViewString,HasString) {
      return document.querySelector('' + TabType + '[' + ViewString + '*="' + HasString + '"]').getAttribute(ViewString);
    }
    // 按钮input元素部分
    if(window.location.host == "www.douyin.com") {
     button = document.createElement("input");
     button.setAttribute("type", "button");
     button.setAttribute("value", "下载");
     button.style.width = "40px";
     button.style.height = "30px";
     button.style.align = "center";
     button.style.background = "#000000";
     button.style.color = "white";
     button.style.visibility = 'visible';
     button.style.border="1px solid red";
        //视频解析部分
     button.onclick = function() {
         if(window.location.host == "www.douyin.com") {}
         else {
             alert("网站可能不是抖音!");
             return;
         }
        var link = document.querySelector('source[src*="&aid="]').getAttribute('src');
     var part = document.querySelector('source[src*="&aid="]').parentElement.getAttribute('mediatype');
     if(part == "video") {
      //var link=document.querySelector('source[src*="id="][src*="v3-web"]').getAttribute('src');
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      var filename="视频_" + year + month + day + hour + minute + second + ".mp4";
      console.log("视频正在合成，完成后将自动保存.");fetch(link).then(res => res.blob()).then(blob => {
      const a = document.createElement('a');
      document.body.appendChild(a)
      a.style.display = 'none'
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url);
      });
     } else {
         alert("获取视频下载链接失败，可能是接口在维护或脚本版本过低!");
     }
    }
        //抖音下载按钮判断部分，请勿删除
        if(window.location.href == "https://www.douyin.com/") {
         //var getdiv = document.querySelector('div[class="iViO9oMI"]');
         //getdiv.remove();
         //getdiv = document.querySelector('div[class="HQwsRJFy"]');
         //getdiv.appendChild(button);
         var getdiv9 = document.querySelector('div[class="l9GtwryL"]');
         var getdiv10 = getdiv9.parentNode;
         var getdiv11 = getdiv10.parentNode;
         getdiv10.remove();
         getdiv11.appendChild(button);
        }
        if(window.location.href.indexOf("https://www.douyin.com/video/") !== -1) {
         //var dylogo = document.querySelector('a[href="//www.douyin.com/"]');
         //dylogo.remove();
         //var getdiv7 = document.querySelector('div[class="iViO9oMI"]');
         //getdiv7.remove();
         //var getdiv8 = document.querySelector('div[class="HQwsRJFy"]');
         //getdiv8.appendChild(button);
         var getdiv7 = document.querySelector('div[class="l9GtwryL"]');
         var getdiv8 = getdiv7.parentNode;
         var getdiv2 = getdiv8.parentNode;
         getdiv8.remove();
         getdiv2.appendChild(button);
        }
        if(window.location.href.indexOf("https://www.douyin.com/search/") !== -1) {
         //var dylogo = document.querySelector('a[href="//www.douyin.com/"]');
         //dylogo.remove();
         //var getdiv1 = document.querySelector('div[class="iViO9oMI"]');
         //getdiv1.remove();
         //var getdiv6 = document.querySelector('div[class="HQwsRJFy Bo1o4KGi"]');
         //getdiv6.appendChild(button);
         var getdiv1 = document.querySelector('div[class="l9GtwryL"]');
         var getdiv6 = getdiv1.parentNode;
         var getdiv5 = getdiv6.parentNode;
         getdiv6.remove();
         getdiv5.appendChild(button);
        }
        if(window.location.href.indexOf("modal_id=") !== -1) {
         var getdiv3 = document.querySelector('div[class="btn"]');
         var getdiv4 = getdiv3.parentNode;
         getdiv3.remove();
         getdiv4.appendChild(button);
        }
    }
    if(window.location.host == "www.kuaishou.com") {
     button1 = document.createElement("input");
     button1.setAttribute("type", "button");
     button1.setAttribute("value", "下载");
     button1.style.width = "40px";
     button1.style.height = "30px";
     button1.style.align = "center";
     button1.style.background = "#000000";
     button1.style.color = "white";
     button1.style.visibility = 'visible';
     button1.style.border="1px solid red";
        //视频解析部分
     button1.onclick = function() {
         if(window.location.host == "www.kuaishou.com") {}
         else {
             alert("网站可能不是快手!");
             return;
         }
        var link = document.querySelector('video[src*="ss=vp"]').getAttribute('src');
     var part = document.querySelector('video[src*="ss=vp"]').getAttribute('class');
     if(part == "player-video") {
      //var link=document.querySelector('source[src*="id="][src*="v3-web"]').getAttribute('src');
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      var filename="视频_" + year + month + day + hour + minute + second + ".mp4";
      console.log("视频正在合成，完成后将自动保存.");fetch(link).then(res => res.blob()).then(blob => {
      const a = document.createElement('a');
      document.body.appendChild(a)
      a.style.display = 'none'
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url);
      });
     } else {
         alert("获取视频下载链接失败，可能是接口在维护或脚本版本过低!");
     }
    }
    if(window.location.href == "https://www.kuaishou.com/new-reco"||window.location.href == "https://www.kuaishou.com/") {
    var AppedButton = document.querySelector('a[href="/ott"]');
    var ButtonElement = document.querySelector('a[href="/ott"]').parentNode;
        ButtonElement.appendChild(button1);
    }
    if(window.location.href.indexOf("https://www.kuaishou.com/search/video?searchKey=") !== -1) {
    var AppedButton1 = document.querySelector('a[href="/ott"]');
    var ButtonElement1 = document.querySelector('a[href="/ott"]').parentNode;
        ButtonElement1.appendChild(button1);
    }
    if(window.location.href.indexOf("https://www.kuaishou.com/short-video/") !== -1||window.location.href.indexOf("https://www.kuaishou.com/profile/") !== -1) {
    ButtonElement2 = document.querySelector('span[class="item-text"]');
    var IsHasButton = document.querySelector('input[type="button"],[value="下载"]');
        ButtonElement2.appendChild(button1);
    }
    }

    if(window.location.host == "www.pearvideo.com") {
     button2 = document.createElement("input");
     button2.setAttribute("type", "button");
     button2.setAttribute("value", "下载");
     button2.style.width = "40px";
     button2.style.height = "30px";
     button2.style.align = "center";
     button2.style.background = "#000000";
     button2.style.color = "white";
     button2.style.visibility = 'visible';
     button2.style.border="1px solid red";
        //视频解析部分
     button2.onclick = function() {
         if(window.location.host == "www.pearvideo.com") {}
         else {
             alert("网站可能不是梨视频!");
             return;
         }
        var link = document.querySelector('video[src*=".mp4"]').getAttribute('src');
     var part = document.querySelector('video[src*=".mp4"]').getAttribute('autoplay');
     if(part == "autoplay") {
      //var link=document.querySelector('source[src*="id="][src*="v3-web"]').getAttribute('src');
      var date = new Date();
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var day = date.getDate();
      var hour = date.getHours();
      var minute = date.getMinutes();
      var second = date.getSeconds();
      var filename="视频_" + year + month + day + hour + minute + second + ".mp4";
      console.log("视频正在合成，完成后将自动保存.");fetch(link).then(res => res.blob()).then(blob => {
      const a = document.createElement('a');
      document.body.appendChild(a)
      a.style.display = 'none'
      const url = window.URL.createObjectURL(blob);
      a.href = url;
      a.download = filename;
      a.click();
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url);
      });
     } else {
         alert("获取视频下载链接失败，可能是接口在维护或脚本版本过低!");
     }
    }
        var lispButtons = document.querySelector('a[id="actApp"]');
         var Adder = lispButtons.parentNode;
         lispButtons.remove();
         Adder.appendChild(button2);
    }
})();