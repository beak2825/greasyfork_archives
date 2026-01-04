// ==UserScript==
// @name         open
// @namespace    http://tampermonkey.net/
// @version      0.16
// @description  计算机视觉
// @author       Me
// @include      https://uaa.sinoiov.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/424157/open.user.js
// @updateURL https://update.greasyfork.org/scripts/424157/open.meta.js
// ==/UserScript==
 
+function() {
    'use strict';
	
	
	function _justdo() {
		// 创建观察者对象
		var observer = new window.MutationObserver(function(mutations) {
			if (mutations[0].addedNodes) {
					// console.log("--------addedNodes---------");
					setTimeout(function() {
						_rmRuleList();
					}, 200);
			}
		});
		observer.observe(document, {
			childList: true,
			subtree: true
		});
	}
	
	function _rmRuleList(){
		var obj = document.getElementsByClassName('btn-readmore')[0];
		if(obj){
			obj.style.height = '1500px';
		}
	}
	
}();