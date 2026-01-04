// ==UserScript==
// @name        add_GoogleScholar
// @namespace   jp.gr.java_conf.kyu49.add_GoogleScholar
// @description Google検索の上部バーにScholarを追加する
// @include     https://www.google.co*/search?*
// @include     https://www.google.co*/?gfe_rd*
// @version     2
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/464407/add_GoogleScholar.user.js
// @updateURL https://update.greasyfork.org/scripts/464407/add_GoogleScholar.meta.js
// ==/UserScript==
var func = function(){
  var links=document.getElementsByTagName("a");
  for(var i=0; i<links.length; i++){
      if(links[i] && (links[i].innerHTML.includes("Shopping") || links[i].innerHTML.includes("ショッピング")) ){
          links[i].href="http://scholar.google.co.jp/scholar?"+window.location.href.match(/q=.+?(&|$)/i)[0];
          links[i].innerHTML="<span class='gs_ico' style='display: inline-block;background: no-repeat url(/intl/ja/scholar/images/1x/sprite_20161020.png);background-position: -44.52px -161.25px;opacity: .55;background-size: 109px;width: 13.55px;height: 15.55px;'></span>Scholar";
          clearInterval(timer);
      }
  }
}
var timer = setInterval(func, 50);
