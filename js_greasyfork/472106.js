// ==UserScript==
// @name         凡音@zhuxiangyu1024
// @namespace randnfslfjwerwef123
// @version 0.01
// @license MIT
// @description 曲谱
// @match  *://*.gzfanyin.com/*
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/472106/%E5%87%A1%E9%9F%B3%40zhuxiangyu1024.user.js
// @updateURL https://update.greasyfork.org/scripts/472106/%E5%87%A1%E9%9F%B3%40zhuxiangyu1024.meta.js
// ==/UserScript==

(function() {
	var originalSetItem = localStorage.setItem;
	localStorage.setItem = function(key, value) {
        if(key=='vuex') value=value.replace('"vipGrade":0','"vipGrade":9')
        else if(key=='vipGrade') value=9
        originalSetItem.call(this,key,value)
	};
})();