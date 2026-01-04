// ==UserScript==
// @author owl
// @name 谷歌搜索智能链接
// @description 只让搜索结果在新窗口打开，使得谷歌搜索更符合使用逻辑
// @match *://www.google.com/*
// @grant none
// @version 1.3
// @namespace https://greasyfork.org/users/295606
// @downloadURL https://update.greasyfork.org/scripts/382259/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E6%99%BA%E8%83%BD%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/382259/%E8%B0%B7%E6%AD%8C%E6%90%9C%E7%B4%A2%E6%99%BA%E8%83%BD%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
var a = document.getElementsByTagName('a');
for (i=0; i<a.length; i++) {
  if(a[i].className=='fl'||a[i].className=='pn'||a[i].className=='q qs') {
    if(a[i].hasAttribute('aria-label')||a[i].hasAttribute('id')) {
      a[i].setAttribute('target','_self');
    }
    else
      a[i].setAttribute('target','_blank');
  }
  else
      a[i].setAttribute('target','_blank');
}