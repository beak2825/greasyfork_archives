// ==UserScript==
// @name         Mepgk Downloader|环保清单批量下载器
// @namespace    //https://tankywoo.com
// @version      0.0.1 
// @description  默认自动下载，并默认下载位置
// @author       修改//Tanky Woo
// @include      http*://*/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.js
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/391957/Mepgk%20Downloader%7C%E7%8E%AF%E4%BF%9D%E6%B8%85%E5%8D%95%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/391957/Mepgk%20Downloader%7C%E7%8E%AF%E4%BF%9D%E6%B8%85%E5%8D%95%E6%89%B9%E9%87%8F%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==
/*global $, confirm, console, GM_addStyle*/
(function() {
  'use strict';
  // 说明：

  var downloader_style = [
    '.picture-downloader {',
    'position: fixed;',
    'right: 0; bottom: 0;',
    'border: 1px solid gray;',
    'z-index:999}'
  ];
  GM_addStyle(downloader_style.join(' '));
  var btn = [
    '<div class="picture-downloader">',
    '<button type="button" class="picture-downloader-btn5">批量下载国五DOC</button>',
    '<button type="button" class="picture-downloader-btn6">批量下载国六DOC</button>',
    '</div>'
  ];
  $('body').prepend(btn.join('\n'));
    //国五批量下载
  $('.picture-downloader-btn5').on('click', function() {
    var match_url = '/file/download/xxgkh?';
    var images = $("a.icon-download[title='下载清单模版']").map(function() {
      var img_src = $(this).attr('href');
      if (img_src.indexOf(match_url) !== -1) {
        console.log(img_src);
        return img_src;
      }
    }).get();

    // show all images
      var i=0;
    $(images).each(function() {
      console.log(this);
        i++;
    });

    var ans = confirm('将要下载以下国五DOC['+i+']个：\n' + images.join('\n'));

    if (ans) {
      $(images).each(function() {
        var a = $('<a>')
          .attr('href', this)
          .attr('download', '')
          .appendTo('body');
        a[0].click();
          sleep(500);
      });
    }
  });
  //国六批量下载
  $('.picture-downloader-btn').on('click', function() {
    var match_url = '/file/download/xxgkh?';
    var images = $("a.icon-download[title='下载清单模版反面']").map(function() {
      var img_src = $(this).attr('href');
      if (img_src.indexOf(match_url) !== -1) {
        console.log(img_src);
        return img_src;
      }
    }).get();

    // show all images
    var i=0;
    $(images).each(function() {
      console.log(this);
        i++;
    });

    var ans = confirm('将要下载以下国六DOC['+i+']个：\n' + images.join('\n'));

    if (ans) {
      $(images).each(function() {
        var a = $('<a>')
          .attr('href', this)
          .attr('download', '')
          .appendTo('body');
        a[0].click();
          sleep(500);
      });
    }
  });

    function sleep(d){
        for(var t = Date.now();Date.now() - t <= d;);
    }
})();
