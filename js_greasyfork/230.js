// ==UserScript==
// @author         shyangs
// @name           光輝之街
// @description    使光輝之街圖片正確顯示
// @namespace      http://wiki.moztw.org/index.php/User:Shyangs
// @version        0.1
// @include        http://cmi.star-kids.info/sellman/drago/*
// @license        MIT License; http://opensource.org/licenses/mit-license.php
// @downloadURL https://update.greasyfork.org/scripts/230/%E5%85%89%E8%BC%9D%E4%B9%8B%E8%A1%97.user.js
// @updateURL https://update.greasyfork.org/scripts/230/%E5%85%89%E8%BC%9D%E4%B9%8B%E8%A1%97.meta.js
// ==/UserScript==
(function() {
	var pStr="http://i271.photobucket.com/albums/jj139/shyangs_album/ACGN/GAME/dragonoma/";
	var regex=/http:\/\/cmi\.star\-kids\.info\/sellman\/drago\/image\/item\-no\-\d{1,3}\.png/;
	var a=document.images;
	var n=a.length;//圖片計數
	for(var i=0;i<n;i++)
	{
	    //GM_log(a[i].src)
	   //如果圖片連結匹配，置換圖片連結
	   if(regex.test(a[i].src))
	   {
	       a[i].src=a[i].src.replace("http://cmi.star-kids.info/sellman/drago/image/",pStr);
	    }
	}
})();