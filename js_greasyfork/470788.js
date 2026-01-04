// ==UserScript==
// @name        酷安链接重定向
// @version     1.0
// @description 跳转酷安链接到实际地址
// @author      ChatGPT
// @match       https://www.coolapk.com/link?url=*
// @run-at      document-start
// @grant       none
// @namespace https://greasyfork.org/users/452911
// @downloadURL https://update.greasyfork.org/scripts/470788/%E9%85%B7%E5%AE%89%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/470788/%E9%85%B7%E5%AE%89%E9%93%BE%E6%8E%A5%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

(function() { 
  var url = window.location.href;
  var match = url.match(/url=(.*)/);
  if (match) {
    var realUrl = decodeURIComponent(match[1]); 
    window.location.href = realUrl;
  }
})();