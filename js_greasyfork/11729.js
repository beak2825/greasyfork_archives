// ==UserScript==
// @name NewTab for NCJP TEST
// @version 1.0
// @namespace tag:Marbles,2015-08-11:NewTab for NCJP TEST
// @description Can open links on profile pages in new tabs.
// @include http://www.ncsoft.jp/profile/*
// @downloadURL https://update.greasyfork.org/scripts/11729/NewTab%20for%20NCJP%20TEST.user.js
// @updateURL https://update.greasyfork.org/scripts/11729/NewTab%20for%20NCJP%20TEST.meta.js
// ==/UserScript==

/**************************************************
  NewTab for NCJP
  Copyright (c) 2015  Marbles
  Released under the GPL Version 3 license.
  License : http://www.gnu.org/licenses/gpl-3.0.html

  For details, see the web site:
                https://twitter.com/MLB_MBL/
**************************************************/

var Links = document.getElementsByClassName("title");
for (var i=0; i<Links.length; i++) {

	var Link_part1 = Links[i];
	
	var Link_part1_String=Link_part1.innerHTML;
	var IDnNOs=Link_part1_String.match(/\'\d+?\'/g);
	
	var UserID=IDnNOs[0].replace(/'/g,"");
	var ArticleNO=IDnNOs[1].replace(/'/g,"");
	var BbsNO=IDnNOs[2].replace(/'/g,"");
	
	var Link_01="http://www.ncsoft.jp/bns/community/";
	var WhichBoard;
	if (BbsNO==5405) {WhichBoard="exchangeBoard";}
	if (BbsNO==5406) {WhichBoard="imageBoard";}
	if (BbsNO==5407) {WhichBoard="captureBoard";}
	var Link_02=WhichBoard+'/view?';
	var Link_03='articleNo='+ArticleNO;
	var Link_04='&uid='+UserID;
	var NewLink=Link_01+Link_02+Link_03+Link_04;
	
	var Title=document.getElementsByClassName("title")[i];
	var element_a = document.createElement('a');
	element_a.href = NewLink;
	element_a.innerHTML = "【 BnS 掲示板の記事を別のタブに開く 】"; 
	Title.appendChild(element_a);
	
	var Link_A2=Link_part1.getElementsByTagName('a')[1];
	Link_A2.setAttribute('target', '_blank');
	
}