// ==UserScript==
// @name         flomoapp hide memos
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  try to take over the world!
// @author       You
// @match        https://flomoapp.com/*
// @resource     customCSS https://cdn.jsdelivr.net/npm/bootstrap@4.4.1/dist/css/bootstrap.min.css
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.slim.min.js
// @require      https://cdn.jsdelivr.net/npm/vue
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/422913/flomoapp%20hide%20memos.user.js
// @updateURL https://update.greasyfork.org/scripts/422913/flomoapp%20hide%20memos.meta.js
// ==/UserScript==

(function() {
    'use strict';

	function init() {
		$(".memos").hide();
		var a = '<input type="checkbox" id="phc" class="" name="time_end_clear_name">';
		$('.nickname').after(a);

		$("#phc").click(function() {
			$(".memos").toggle();
			//  alert("Hello World!");
		});
	}
	init();
	//可以延迟执行，如果执行有问题的话
	//setTimeout(()=>{
	//   init()
	//}, 1000);
    // Your code here...
})();