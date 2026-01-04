// ==UserScript==
// @license MIT
// @name         智慧树Plugin
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  智慧树脚本
// @author       You
// @match        https://hike.zhihuishu.com/aidedteaching/sourceLearning/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436107/%E6%99%BA%E6%85%A7%E6%A0%91Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/436107/%E6%99%BA%E6%85%A7%E6%A0%91Plugin.meta.js
// ==/UserScript==

(function() {
var regx = /(?<=fileId=)\d+/;
var url = window.location.href
var id = parseInt(url.match(regx));

var cirl = function() {
	var eleId = 'file_'+id;
	var ele = document.getElementById(eleId);
	//console.log(id);
	if (ele.innerHTML.indexOf('icon-finish')!=-1) {
		var index = id+1;
		var baseUrl = url.replace(regx,index);
		window.location.href=baseUrl;
	}

};
setInterval(cirl,500);
setTimeout(function(){
document.getElementById("playButton").click();
document.getElementsByClassName("speedTab15")[0].click();
//document.getElementsByClassName("line1bq")[0].click();
document.getElementsByClassName("volumeIcon")[0].click();
},2000)

})();