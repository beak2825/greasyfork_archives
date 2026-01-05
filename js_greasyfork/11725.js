// ==UserScript==
// @name TitleChanger for BNS
// @version 3.0
// @namespace tag:Marbles@MLB_MBL,2015-07-31:TitleChanger for BNS
// @description Change Titles on BNS Forums.
// @include http://www.ncsoft.jp/bns/community/*
// @include http://www.ncsoft.jp/bns/news/notice/*
// @downloadURL https://update.greasyfork.org/scripts/11725/TitleChanger%20for%20BNS.user.js
// @updateURL https://update.greasyfork.org/scripts/11725/TitleChanger%20for%20BNS.meta.js
// ==/UserScript==

/**************************************************
  TitleChanger for BNS 3.0
  Copyright (c) 2015  Marbles
  Released under the GPL Version 3 license.
  License : http://www.gnu.org/licenses/gpl-3.0.html

  For details, see the web site:
                https://twitter.com/MLB_MBL/
**************************************************/

var loc = location.href;

var newtitle_Node = document.getElementsByClassName("title");
var title_Node=document.getElementsByTagName("title")[0].childNodes[0];
if ( /exchangeBoard/.test(loc) ) {
	title_Node.nodeValue='[交流掲示板] '+newtitle_Node[0].innerHTML;
}
if ( /captureBoard/.test(loc) ) {
	title_Node.nodeValue='[攻略掲示板] '+newtitle_Node[0].innerHTML;
}
if ( /imageBoard/.test(loc) ) {
	title_Node.nodeValue='[イメージ掲示板] '+newtitle_Node[0].innerHTML;
}
if ( /notice/.test(loc) ) {
	title_Node.nodeValue='[お知らせ] '+newtitle_Node[0].innerHTML;
}