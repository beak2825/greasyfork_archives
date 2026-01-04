// ==UserScript==
// @name         leetcode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://leetcode-cn.com/problemset/all/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394766/leetcode.user.js
// @updateURL https://update.greasyfork.org/scripts/394766/leetcode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if(window.top != window.self){
		return;
	}
	var window_url = window.location.href;
    var website_host = window.location.host;
    //直接跳转到目标网页
    if(window_url == "https://leetcode-cn.com/problemset/all/"){
        location.href = "https://leetcode-cn.com/problemset/algorithms/";
	}
    // Your code here...
})();