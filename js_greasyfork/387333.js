// ==UserScript==
// @name         mebook pandownload
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  直接下载百度云/微软云盘资源
// @author       You
// @match        http://mebook.cc/*.html
// @grant        none
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/387333/mebook%20pandownload.user.js
// @updateURL https://update.greasyfork.org/scripts/387333/mebook%20pandownload.meta.js
// ==/UserScript==

(function() {
  'use strict';
  var iframe = document.createElement('iframe');
  iframe.src = $('.downlink .downbtn').attr('href');
  iframe.id = 'downloadPage';
  iframe.name = 'downloadPage';
  iframe.style.display = "none"

  $('.xydown_down_link').append(iframe);

  iframe.onload = function() {
    var $frame = $(window.frames['downloadPage'].document);
    var surl = $($frame.find('.list a'))
      .attr('href')
      .replace('https://pan.baidu.com/s/', '');
    var pwd = $($frame.find('.desc')).text();
    var pwdExec = /百度网盘密码：([a-zA-Z0-9]{4})/.exec(pwd);
    var downloadUrl = 'https://www.baiduwp.com/s/?pwd=' + pwdExec[1] + '&surl=' + surl;
    $('.xydown_down_link .downlink').append(
      '<a  class="downbtn" target="_blank" href="' + downloadUrl + '">百度云下载</a>'
    );

    var oneDrive = Array.prototype.slice.call($frame.find('.list a')).find(function(item) {
      return $(item).text() === '微软云盘';
    });
    oneDrive &&
      $('.xydown_down_link .downlink').append(
        '<a  class="downbtn" target="_blank" href="' +
          $(oneDrive).attr('href') +
          '">微软云盘下载</a>'
      );
  };
})();
