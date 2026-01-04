// ==UserScript==
// @name           Github Time Formatter Forked
// @namespace      Github Time Formatter Forked
// @description    Give Real Time on Github instead of approximate time
// @version        1.0.
// @include       http*://github.com/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/416901/Github%20Time%20Formatter%20Forked.user.js
// @updateURL https://update.greasyfork.org/scripts/416901/Github%20Time%20Formatter%20Forked.meta.js
// ==/UserScript==

(function(){
	'use strict';
	function format(timeElem){
		var time=timeElem.title||timeElem.datetime;
		if(time){
			timeElem.innerHTML=time;
		}
	}
	function onDOMSubtreeModifiedHandler(e){
		var target = e.target;
		// console.log(target);
		if(target.nodeType === 1 && /TIME/ig.test(target.nodeName)&&/ago/.test(target.innerHTML)) {
			format(target);
		}
	}
	(function(){
		var matches = document.querySelectorAll('time');
		for(var i = 0; i < matches.length; ++i) {
			format(matches[i]);
		}
	})();
	document.addEventListener('DOMSubtreeModified', onDOMSubtreeModifiedHandler, false);
})();