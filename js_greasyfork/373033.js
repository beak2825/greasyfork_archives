// ==UserScript==
// @name        bt之家附件直下
// @author      LZY0699
// @create      2018-10-09
// @namespace   39599410@qq.com
// @description 单击附件直接下载,不再需要跳转到下载页面
// @include     http://btbtt.me/thread-index*
// @include     https://btbtt.me/thread-index*
// @include     http://www.btbtt.me/thread-index*
// @include     https://www.btbtt.me/thread-index*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/373033/bt%E4%B9%8B%E5%AE%B6%E9%99%84%E4%BB%B6%E7%9B%B4%E4%B8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/373033/bt%E4%B9%8B%E5%AE%B6%E9%99%84%E4%BB%B6%E7%9B%B4%E4%B8%8B.meta.js
// ==/UserScript==

(function (){
  var nodes = document.querySelectorAll("a[href^='attach-dialog-']");
//   alert(nodes.length.toString());
  for(var i=0;i<nodes.length;i++){
    var url=nodes[i].href.replace(/attach-dialog-/,"attach-download-");
    nodes[i].href = url;
  }
})();