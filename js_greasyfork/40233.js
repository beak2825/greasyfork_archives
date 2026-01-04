// ==UserScript==
// @name        Bilibili Cover
// @description Show Bilibili Cover
// @author       i9602097
// @include     http://www.bilibili.com/video/av*
// @include     https://www.bilibili.com/video/av*
// @version     1.6
// @grant       GM_addStyle
// @run-at		document-end
// @namespace https://greasyfork.org/users/106880
// @downloadURL https://update.greasyfork.org/scripts/40233/Bilibili%20Cover.user.js
// @updateURL https://update.greasyfork.org/scripts/40233/Bilibili%20Cover.meta.js
// ==/UserScript==
if(!document.querySelector(".r-wrapper") || !document.querySelector('meta[itemprop="image"]').content)return;
var cover_box=document.createElement("div");
cover_box.id="cover_box";
var cover_image=document.createElement("img");
cover_image.id="cover_image";
cover_image.src=document.querySelector('meta[itemprop="image"]').content.replace(/^https?\:/, location.protocol);
cover_image.onclick=function(){
	window.open(this.src,'_blank');
};
var cover_text=document.createElement("span");
cover_text.textContent="视频封面";
cover_text.id="cover_text";
cover_box.appendChild(cover_text);
cover_box.appendChild(cover_image);
document.querySelector(".r-wrapper").insertBefore(cover_box,document.querySelector(".r-wrapper").childNodes[0]);
var css=".elecrank-wrapper{padding-top:0px;}#cover_box{padding-left:10px;padding-bottom: 40px;}#cover_image{display:inline!important;width:calc(100% - 2px);height:auto;margin-top:20px;border-radius:4px;border:1px solid #e5e9ef;cursor:pointer!important;}#cover_text{font-size:16px}";
GM_addStyle(css);