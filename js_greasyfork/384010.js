// ==UserScript==
// @name         ExHentai图片保存
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  保存一般大小图片:1.保存并翻页（文件名带页码）；2.保存（文件名无页码）。并且复制作品标题到剪贴板。
// @author       LaprasC
// @match        *://exhentai.org/s/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.js
// @grant        GM_addStyle
// @grant        GM_download
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/384010/ExHentai%E5%9B%BE%E7%89%87%E4%BF%9D%E5%AD%98.user.js
// @updateURL https://update.greasyfork.org/scripts/384010/ExHentai%E5%9B%BE%E7%89%87%E4%BF%9D%E5%AD%98.meta.js
// ==/UserScript==
/*global $, confirm, console, GM_addStyle*/
(function() {
  'use strict';

     var downloader_style = [
         '.picture-downloader {',
         'position: fixed;',
         'right: 0; bottom: 0px;',
         'border: 1px solid gray;',
         'z-index:999}'
     ];
    GM_addStyle(downloader_style.join(' '));

    var btn = [
        '<div class="picture-downloader">',
        '<button type="button" class="picture-downloader-btn">下载图片</button>',
        '</div>'
    ];
    $('body').prepend(btn.join('\n'));


     var downloader_style1 = [
         '.picture-downloader1 {',
         'position: fixed;',
         'right: 0; bottom: 30px;',
         'border: 1px solid gray;',
         'z-index:999}'
     ];
    GM_addStyle(downloader_style1.join(' '));
    var btn1= [
        '<div class="picture-downloader1">',
        '<button type="button" class="picture-downloader-btn1" >下载图片（页数）</button>',
        '</div>'
    ];
    $('body').prepend(btn1.join('\n'));

    $('.picture-downloader-btn').on('click', function() {
      var link=$("#img");

          var name=$("h1");
          var page=$("#i2>.sn>div>span:eq(0)");
          var filename=name.text();
      filename=filename.split('. ').join('');
      filename=filename.split('.').join('');
        GM_setClipboard(filename);
      GM_download(link.attr("src"),filename);
    }).get();

    $('.picture-downloader-btn1').on('click', function() {
      var link=$("#img").attr("src");

          var name=$("h1");
          var page=$("#i2>.sn>div>span:eq(0)").text();
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
        //alert(filename);
        if(link.indexOf("/h/")==-1)
        {
            filename+=".jpg";
        }

      GM_download({url:link,name:filename,onerror: function() {
            window.location.reload();
        }});
         //$("#i3>a").click();

    }).get();
  
})();
