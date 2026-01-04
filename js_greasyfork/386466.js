// ==UserScript==
// @name         kill rules
// @namespace    http://tampermonkey.net/
// @version      0.14
// @description  kill you
// @author       Me
// @include      http://crm3.sc.ctc.com/*
// @include      http://portal.crmtest.sc.ctc.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/386466/kill%20rules.user.js
// @updateURL https://update.greasyfork.org/scripts/386466/kill%20rules.meta.js
// ==/UserScript==

+function() {
    'use strict';
	_justdo();
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
		var ruleList = document.getElementById('ruleList');
		if(ruleList != null && typeof ruleList != 'undefined'){
		   ruleList.parentNode.removeChild(ruleList);
           document.getElementById('confirm').click();
		}
	}
}();