// ==UserScript==
// @name       Looong title for neeqask
// @namespace   bluefountain@sina.com
// @include     http://*.neeqask.com/
// @include     http://*.neeqask.com/
// @version     1.0
// @grant       none
// @description 喵了个咪的，就不能把标题整长点吗

function addGlobalStyle(css) {
  var head,
  style;
  head = document.getElementsByTagName('head') [0];
  if (!head) {
    return;
  }
addGlobalStyle('.list .h2mun1{width:1%;height:18px}');
addGlobalStyle('.list .h2mun2{width:10%}');
addGlobalStyle('.list .h2mun3{width:76%;white-space:nowrap;text-overflow:ellipsis;-o-text-overflow:ellipsis;overflow:hidden;font-size:14px}');
addGlobalStyle('.list .h2mun4{width:13%;margin-left:0}');
addGlobalStyle('.sort{width:200px;height:380px;position:absolute;top:14px;right:0;border-left:1px solid #999;padding:10px;-webkit-box-sizing:border-box;-moz-box-sizing:border-box;box-sizing:border-box;padding-top:0;display:none}');
}

// @downloadURL https://update.greasyfork.org/scripts/370053/Looong%20title%20for%20neeqask.user.js
// @updateURL https://update.greasyfork.org/scripts/370053/Looong%20title%20for%20neeqask.meta.js
// ==/UserScript==
