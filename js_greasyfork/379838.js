// ==UserScript==
// @name        ハーメルンで自動的にしおりを挟む
// @include https://syosetu.org/novel/*/*
// @namespace https://mypage.syosetu.com/348820/
// @description ページ最下部までスクロールすると、自動的にしおりを挟みます。
// @author hikoyuki
// @version 1.0
// @downloadURL https://update.greasyfork.org/scripts/379838/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%81%A7%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E3%81%97%E3%81%8A%E3%82%8A%E3%82%92%E6%8C%9F%E3%82%80.user.js
// @updateURL https://update.greasyfork.org/scripts/379838/%E3%83%8F%E3%83%BC%E3%83%A1%E3%83%AB%E3%83%B3%E3%81%A7%E8%87%AA%E5%8B%95%E7%9A%84%E3%81%AB%E3%81%97%E3%81%8A%E3%82%8A%E3%82%92%E6%8C%9F%E3%82%80.meta.js
// ==/UserScript==
var url = location.href;
var mh = url.match(/^\D+(\d+)\D+(\d+)\D+$/);
$(window).scroll(function(){
var top = $("#footer").offset().top;
var position = top - $(window).height();
if($(window).scrollTop() > position){
location.href="https://syosetu.org/?mode=siori2_input&nid="+mh[1]+"&volume="+mh[2];
}else{}
})