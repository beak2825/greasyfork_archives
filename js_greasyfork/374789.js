// ==UserScript==
// @name       Fullscreen Google Keep
// @name:zh-CN       Google Keep 全屏编辑
// @namespace http://tampermonkey.net/
// @description	  Edit Google Keep in fullscreen and hide the dashboard
// @description:zh-CN	  全屏编辑Google Keep，隐藏dashboard
// @author        John Ren
// @match       http*://keep.google.com/*
// @run-at        document-start
// @version       1.05
// @downloadURL https://update.greasyfork.org/scripts/374789/Fullscreen%20Google%20Keep.user.js
// @updateURL https://update.greasyfork.org/scripts/374789/Fullscreen%20Google%20Keep.meta.js
// ==/UserScript==

(function() {
// Hide dashboard and focus input
if (!window.location.hash) {
document.documentElement.style.opacity=0;
document.documentElement.style.transition="all 200ms";
    window.addEventListener("load", function() {
        document.querySelector(".IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd").click();
        document.querySelector(".IZ65Hb-YPqjbf.h1U9Be-YPqjbf.LwH6nd").focus();
    });
    document.documentElement.style.opacity=1;
}
/*  $(".notes-container").animate(
  {
    opacity: 1
  },
    400,()=>{$(".notes-container").css("pointer-events", "auto");}
  ); */

// Inject style
var css = `/* Full-screen for new note */
/* Main */
 .h1U9Be-xhiy4>.IZ65Hb-n0tgWb.IZ65Hb-QQhtn>.IZ65Hb-TBnied {
	width: 100vw !important;
	height: 100vh !important;
	position: fixed !important;
	left: 0 !important;
	top: 0 !important;
	z-index: 999 !important;
	border-radius: 0px;
}
/* Title */
.IZ65Hb-QQhtn .r4nke-YPqjbf{
	font-size: 1.4rem !important;
	font-weight: 400 !important;
	line-height: 1.75rem !important;
	padding-bottom: 12px !important;
	padding-top: 16px !important;
}
/* Scroll */
body::-webkit-scrollbar {
	width:0px !important;
}

.IZ65Hb-s2gQvd {
	    max-height: calc(100vh - 45px) !important;
}
/* Content */
.IZ65Hb-QQhtn .h1U9Be-YPqjbf{
	padding:2vw 4vw!important;
	font-size: 1.2rem !important;
	line-height: 2rem !important;
	min-height:calc(100vh - 100px) !important;
}
/* Tools
.IZ65Hb-fbudBf .IZ65Hb-yePe5c{
	position:absolute!important;
	bottom:0px!important;
	left:0px !important;
	right:0px 60vh !important;
}*/
.IZ65Hb-jfdpUb.xFQqWe {
    position: fixed;
    right: 0px;
    bottom: 65px;
}
/* Full-screen for editing note */

/* Main */
 .IZ65Hb-n0tgWb.IZ65Hb-QQhtn.oT9UPb {
	width: 100vw !important;
	height: 100vh !important;
	position: fixed !important;
	left: 0 !important;
	top: 0 !important;
	z-index: 999 !important;
	border-radius: 0px;
}
.VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd>.IZ65Hb-n0tgWb.IZ65Hb-QQhtn.oT9UPb>.IZ65Hb-TBnied {
	width:100% !important;
	height:100% !important;
	border-radius: 0px;
}
/* Title */
 .VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd>.IZ65Hb-n0tgWb.IZ65Hb-QQhtn.oT9UPb>.IZ65Hb-TBnied>.IZ65Hb-s2gQvd>.IZ65Hb-YPqjbf.r4nke-YPqjbf {
	font-size: 1.4rem !important;
}
/* Scroll */
 .VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd>.IZ65Hb-n0tgWb.IZ65Hb-QQhtn.oT9UPb>.IZ65Hb-TBnied>.IZ65Hb-s2gQvd {
	max-height: calc(100% - 40px) !important;
}
/* Content */
 .VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd>.IZ65Hb-n0tgWb.IZ65Hb-QQhtn.oT9UPb>.IZ65Hb-TBnied>.IZ65Hb-s2gQvd>.IZ65Hb-YPqjbf.h1U9Be-YPqjbf {
	width: calc(92vw - 11px) !important;
	margin:2vw 4vw!important;
	font-size: 1.1rem !important;
	line-height: 2rem !important;
}
.XKSfm-L9AdLc .h1U9Be-YPqjbf, .zJtgdf-swAEc-bN97Pc .h1U9Be-YPqjbf, body.dkl3Ye .h1U9Be-YPqjbf {
	padding-top: 12px;
}
/* Tools */
 .VIpgJd-TUo6Hb.XKSfm-L9AdLc.eo9XGd>.IZ65Hb-n0tgWb.IZ65Hb-QQhtn.oT9UPb>.IZ65Hb-TBnied>.IZ65Hb-yePe5c {
	width:100% !important;
	position:absolute !important;
	bottom:0 !important;
	left:0 !important;
}
/* Info */
 .IZ65Hb-jfdpUb {
	padding:0px 15px !important
}
/* Fixed font size on dashboard */
/* No scroll bar on dashboard */
 body::-webkit-scrollbar {
	width: 0px;
}
/* Fix Scroll bar in editor */
 .IZ65Hb-s2gQvd.r4nke-bJ69tf-ma6Yeb::-webkit-scrollbar {
	width:10px !important;
}
.IZ65Hb-s2gQvd::-webkit-scrollbar {
	width:0px !important;
}
  `
if (typeof GM_addStyle != "undefined") {
GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
addStyle(css);
} else {
var node = document.createElement("style");
node.type = "text/css";
node.appendChild(document.createTextNode(css));
var heads = document.getElementsByTagName("head");
if (heads.length > 0) {
  heads[0].insertAdjacentElement("afterBegin",node);
} else {
  // no head yet, stick it whereever
  document.documentElement.insertAdjacentElement("afterBegin",node);
}
}
})();