// ==UserScript==
// @name         遨游4 3DM论坛图片显示
// @version      1.0.0
// @author       xiaoshizu
// @description  仅用于遨游4 3DM论坛图片显示
// @icon         https://www.3dmgame.com/favicon.ico
// @match        *://bbs.3dmgame.com/*
// @license      GPL-3.0 License
// @run-at       document-start
// @namespace https://greasyfork.org/users/998199
// @downloadURL https://update.greasyfork.org/scripts/456633/%E9%81%A8%E6%B8%B84%203DM%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/456633/%E9%81%A8%E6%B8%B84%203DM%E8%AE%BA%E5%9D%9B%E5%9B%BE%E7%89%87%E6%98%BE%E7%A4%BA.meta.js
// ==/UserScript==


function show_img(){
	var imgs=document.getElementsByTagName("img");
	for ( var i=0;i<imgs.length;i++ ) {
		imgs[i].style.width="auto";
    imgs[i].style.height="auto";
	}
}

(function() {
  'use strict'
  setTimeout(show_img,1000);
  setTimeout(show_img,3000);
  setTimeout(show_img,5000);
})();