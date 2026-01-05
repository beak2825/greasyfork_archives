// ==UserScript==
// @name        Gaia Image Patch
// @namespace   http://userscripts.org/users/62850
// @description Lets Images load directly without using gaia's image cache server (The cache server exist to prevent password protected images from prompting for password)
// @include     http://www.gaiaonline.com/*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/1628/Gaia%20Image%20Patch.user.js
// @updateURL https://update.greasyfork.org/scripts/1628/Gaia%20Image%20Patch.meta.js
// ==/UserScript==
var imgs=document.evaluate("//img[starts-with(@src,'http://img-cache.cdn.gaiaonline.com/')]",document,null,6,null),img,url;
for(var i=imgs.snapshotLength-1;i>-1;i--){
	img=imgs.snapshotItem(i);
	url=img.src;
	url=url.substr(url.lastIndexOf('/http')+1);
	img.src=url;
}