// ==UserScript==
// @name         平桥专业课
// @namespace    http://123.com/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        http://*.iknei.com/course/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410118/%E5%B9%B3%E6%A1%A5%E4%B8%93%E4%B8%9A%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/410118/%E5%B9%B3%E6%A1%A5%E4%B8%93%E4%B8%9A%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

	setInterval(function(){if(document.getElementsByClassName('btn btn-primary finish-btn btn-success').length==1){
			document.getElementsByClassName('btn btn-primary nav-btn next-lesson-btn')[0].click()
	}},5000)

})();