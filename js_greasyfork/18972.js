// ==UserScript==
// @namespace   https://greasyfork.org/users/39670

// @name  百度Baidu网盘HTTP转HTTPS
// @description 将百度网盘的链接(http://pan.baidu.com/)转换为HTTPS协议(https://pan.bidu.com)，可以直接下载大文件。

// @author      Netplaier
// @version     1.01
// @license     LGPLv3

// @include     http://pan.baidu.com/*
// @include     http://yun.baidu.com/*

// @grant       none

// @icon        https://pan.baidu.com/res/static/images/favicon.ico

// @downloadURL https://update.greasyfork.org/scripts/18972/%E7%99%BE%E5%BA%A6Baidu%E7%BD%91%E7%9B%98HTTP%E8%BD%ACHTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/18972/%E7%99%BE%E5%BA%A6Baidu%E7%BD%91%E7%9B%98HTTP%E8%BD%ACHTTPS.meta.js
// ==/UserScript==


(function(){
  var debug = 0;
  var new_location = location.href.replace(/http\:/, 'https:');
  if ( debug > 0 ) {
    alert(  "Hash:     "+location.hash+
          "\nHost:     "+location.host+
          "\nHostname: "+location.hostname+
          "\nHREF:     "+location.href+
          "\nPathname: "+location.pathname+
          "\nPort:     "+location.port+
          "\nProtocol: "+location.protocol+
          "\n"+
          "\nNew Location: "+new_location);
  };
  location.href = new_location;
})();