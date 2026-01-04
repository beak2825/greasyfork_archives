// ==UserScript==
// @name         ExHentai自动保存图片
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  一直保存到最后一张，不用时务必关掉！！！
// @author       LaprasC
// @match        *://exhentai.org/s/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/384006/ExHentai%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/384006/ExHentai%E8%87%AA%E5%8A%A8%E4%BF%9D%E5%AD%98%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==
/*global $, confirm, console, GM_addStyle*/

(function() {
    'use strict';


    var link=$("#img").attr("src");
    var err=0;
    //link=$("#i7>a").attr("href");
          var name=$("h1");
          var page=$("#i2>.sn>div>span:eq(0)").text();
    var max=$("#i2>.sn>div>span:eq(1)").text();
          var filename=name.text();
  filename=filename.split('. ').join('');
      filename=filename.split('.').join('');
        GM_setClipboard(filename);
        if(page.length==1)
    {
        page="00"+page;
    }
        if(page.length==2)
    {
        page="0"+page;
    }
      filename+=' - '+page;
     if(link.indexOf("/h/")==-1)
        {
            filename+=".jpg";
        }
      GM_download({url:link,name:filename,onerror: function() {
          err=1;
          $("#loadfail").click().get();
           window.location.reload();
        },onload:function(){
            if(Number(page)<Number(max)){
                $("#i3>a").click().get();
                window.location.reload();
            }
        }});
})();