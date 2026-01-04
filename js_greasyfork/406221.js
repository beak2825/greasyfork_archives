// ==UserScript==
// @name         跳转到bgm.tv
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  redirect URL to bgm.tv and force to the https
// @author       chitanda
// @include      http://bgm.tv/*
// @include      http*://chii.in/*
// @include      http*://bangumi.tv/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406221/%E8%B7%B3%E8%BD%AC%E5%88%B0bgmtv.user.js
// @updateURL https://update.greasyfork.org/scripts/406221/%E8%B7%B3%E8%BD%AC%E5%88%B0bgmtv.meta.js
// ==/UserScript==

(function() {
var urlList=['chii.in','bangumi.tv',"bgm.tv"];
if (urlList.indexOf(window.location.host)>=0){
	var tempUrl=window.location.href.replace(window.location.host,'bgm.tv');
	location.replace(`https:${tempUrl.substring(location.protocol.length)}`);

}

})();