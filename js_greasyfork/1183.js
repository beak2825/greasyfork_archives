// ==UserScript==
// @name           from iTunes app store to web store
// @namespace      http://efcl.info/
// @description    Redirect iTunes app store to web store
// @include        http://itunes.apple.com/WebObjects/*
// @version 0.0.1.20140518104305
// @downloadURL https://update.greasyfork.org/scripts/1183/from%20iTunes%20app%20store%20to%20web%20store.user.js
// @updateURL https://update.greasyfork.org/scripts/1183/from%20iTunes%20app%20store%20to%20web%20store.meta.js
// ==/UserScript==
(function(){
	var URL = location.href;
	var urls_def = /itms%253A%252F%252Fitunes\.apple\.com.*?id%253D(\d+)/i;
	var m = (URL.match(urls_def)||[])[1];
	if(m){
		location.href = "http://app-store.appspot.com/?url=viewSoftware?id=" + m;
	}else{
	  return
	}
})();

