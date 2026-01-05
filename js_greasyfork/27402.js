// ==UserScript==
// @namespace   https://greasyfork.org/users/39670

// @name  b站HTTP转HTTPS
// @description 将B站的链接转换为HTTPS协议

// @author      Netplaier
// @version     1.01
// @license     LGPLv3

// @include     http://*.bilibili.com/*

// @grant       none



// @downloadURL https://update.greasyfork.org/scripts/27402/b%E7%AB%99HTTP%E8%BD%ACHTTPS.user.js
// @updateURL https://update.greasyfork.org/scripts/27402/b%E7%AB%99HTTP%E8%BD%ACHTTPS.meta.js
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