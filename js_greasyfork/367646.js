// ==UserScript==
// @version        2017.09.06
// @name          P2PEyeSiteLink
// @namespace     P2PEyESiteLinkNS
// @author	      fengguan.ld~gmail。com
// @description    P2PEye Directly Clink Site Link
// @include        https://*.p2peye.com/comment/
// @include        https://*.p2peye.com/*
// @grant          unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/367646/P2PEyeSiteLink.user.js
// @updateURL https://update.greasyfork.org/scripts/367646/P2PEyeSiteLink.meta.js
// ==/UserScript==
 $(function(){
  var SiteURL= $("a[class='pt_url webnamebtn website']").attr("data-href");
   $("a[class='pt_url webnamebtn website']").attr("href",SiteURL).attr("target","_blank").removeClass("webnamebtn").removeClass("website");
 });
