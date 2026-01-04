// ==UserScript==
// @name        Yahoo!ニュース自動推移
// @namespace   http://webfile.blog.jp/
// @description Yahoo!ニュースのリンクを自動で推移します。
// @match       http://news.yahoo.co.jp/pickup*
// @match       https://news.yahoo.co.jp/pickup*
// @version  1.0.4
// @license	http://creativecommons.org/licenses/by-nc/3.0/
// @grant       none
// @run-at document-end
// @describe    Yahoo!ニュースのリンクを自動で推移します。
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/35120/Yahoo%21%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E8%87%AA%E5%8B%95%E6%8E%A8%E7%A7%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/35120/Yahoo%21%E3%83%8B%E3%83%A5%E3%83%BC%E3%82%B9%E8%87%AA%E5%8B%95%E6%8E%A8%E7%A7%BB.meta.js
// ==/UserScript==
 
 
//var obj = document.querySelector(".tpcNews_detailLink > a");
//var obj = document.querySelector(".tpcNews_detailLink>a,.pickupMain_detailLink>a");
var obj = document.querySelector("a[data-ual-gotocontent]");
console.log("obj="+obj);
var link = obj.getAttribute("href");
 
console.log("link="+link);
location.href = link;
 
//--End Script--

