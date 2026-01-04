// ==UserScript==
// @name         Picture Downloader|Image Downloader|图片下载器
// @namespace    https://tankywoo.com
// @version      0.1.3
// @description  在页面右下角插入图片域名筛选框和下载按钮，根据关键词匹配图片URL并批量下载。默认针对所有站点开启，所以建议不需要时先禁用脚本，需要时再开启。
// @author       Tanky Woo
// @include      http*://*/*
// @require      https://cdn.bootcss.com/jquery/3.2.1/jquery.js
// @grant        GM_addStyle
// @run-at       document-idle
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/31880/Picture%20Downloader%7CImage%20Downloader%7C%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/31880/Picture%20Downloader%7CImage%20Downloader%7C%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==
/*global $, confirm, console, GM_addStyle*/
(function() {
  'use strict';
  // 说明：
  // - 现在很多网站的图片是延迟加载，需要手动看一遍加载后再点击下载

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
    '<input type="text" class="picture-downloader-input" />',
    '<button type="button" class="picture-downloader-btn">下载图片</button>',
    '</div>'
  ];
  $('body').prepend(btn.join('\n'));
  $('.picture-downloader-btn').on('click', function() {
    var match_url = $('.picture-downloader-input').val();
    var images = $('img').map(function() {
      var img_src = $(this).attr('src');
      if (img_src.indexOf(match_url) !== -1) {
        console.log(img_src);
        return img_src;
      }
    }).get();

    // show all images
    $(images).each(function() {
      console.log(this);
    });

    var ans = confirm('将要下载以下图片：\n' + images.join('\n'));

    if (ans) {
      $(images).each(function() {
        var a = $('<a>')
          .attr('href', this)
          .attr('download', '')
          .appendTo('body');
        a[0].click();
      });
    }
  });
})();
