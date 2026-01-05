// ==UserScript==
// @name TitleChanger for NCJP
// @version 1.0
// @namespace tag:Marbles,2015-08-09:TitleChanger for NCJP
// @description Change Titles on NPJP Profile Pages.
// @include http://www.ncsoft.jp/profile/*
// @downloadURL https://update.greasyfork.org/scripts/11726/TitleChanger%20for%20NCJP.user.js
// @updateURL https://update.greasyfork.org/scripts/11726/TitleChanger%20for%20NCJP.meta.js
// ==/UserScript==

/**************************************************
  TitleChanger for NCJP
  Copyright (c) 2015  Marbles
  Released under the GPL Version 3 license.
  License : http://www.gnu.org/licenses/gpl-3.0.html

  For details, see the web site:
                https://twitter.com/MLB_MBL/
**************************************************/

var loc = location.href;

var newtitle_Node = document.getElementById("nickNameStr").textContent;
var title_Node=document.getElementsByTagName("title")[0].childNodes[0];

if ( /profile/.test(loc) ) {
	title_Node.nodeValue='[プロフィール] '+newtitle_Node;
}