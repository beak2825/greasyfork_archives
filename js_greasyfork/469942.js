// ==UserScript==
// @name        Youtube Shorts 新增跳轉連結
// @author      John
// @match       *://www.youtube.com/*
// @match       *://www.youtube.com/shorts/*
// @description 在Youtube Shorts 新增跳轉連結
// @version     0.2
// @license     MIT
// @namespace https://greasyfork.org/users/814278
// @downloadURL https://update.greasyfork.org/scripts/469942/Youtube%20Shorts%20%E6%96%B0%E5%A2%9E%E8%B7%B3%E8%BD%89%E9%80%A3%E7%B5%90.user.js
// @updateURL https://update.greasyfork.org/scripts/469942/Youtube%20Shorts%20%E6%96%B0%E5%A2%9E%E8%B7%B3%E8%BD%89%E9%80%A3%E7%B5%90.meta.js
// ==/UserScript==


function addRedirectLink(){
	try{
		let o = document.querySelector('#voice-search-button');
		if(o != null){
			let url = window.location.href;
			url = url.replace('shorts/', 'watch?v=');

			// add link tag
			let linkId = 'redirect-shorts-watch';
			let linkObj = document.querySelector('#'+linkId);
			if(linkObj == null){
				linkObj = document.createElement('a');
				linkObj.setAttribute('target', '_blank');
				linkObj.setAttribute('id', linkId);
				linkObj.appendChild(document.createTextNode("Open YT Watch"));
				o.after(linkObj);
			}
			linkObj.setAttribute('href', url);
		}
	}catch(e){
		console.log(e);
	}
}

(function() {
	'use strict';

	var currentUrl = null;
	setInterval(function() {
	  if (window.location.href !== currentUrl) { // URL發生變化
		currentUrl = window.location.href;
		addRedirectLink();
	  }
	}, 1000);
})();