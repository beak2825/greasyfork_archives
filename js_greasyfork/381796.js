// ==UserScript==
// @name     atcoder new contest pager
// @description display new contest page at page top
// @include https://*.contest.atcoder.jp/*
// @version  1
// @namespace https://twitter.com/root_T2
// @grant    none
// @downloadURL https://update.greasyfork.org/scripts/381796/atcoder%20new%20contest%20pager.user.js
// @updateURL https://update.greasyfork.org/scripts/381796/atcoder%20new%20contest%20pager.meta.js
// ==/UserScript==
var host = location.host;
if ( host.match(".contest.atcoder.jp")) {
  var contest_name = host.split(".contest.atcoder.jp")[0];
  var new_url = "https://atcoder.jp/contests/" + contest_name;
  var a = document.createElement('a');
	a.textContent = '新しいコンテストページ';
  a.setAttribute('href', new_url);
  a.setAttribute('style', "font-size: 30pt;");
  
  var div = document.createElement("div");
  div.setAttribute("style", "text-align:center;margin-bottom:15px;margin-top:20px;");
  div.appendChild(a);
  
  var header = document.getElementsByClassName('navbar navbar-fixed-top')[0];
  header.parentNode.insertBefore(div, header.nextSibling); 
  
}