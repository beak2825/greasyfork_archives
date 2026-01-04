// ==UserScript==
// @name         知乎去视频
// @namespace    ZhihuVideoFucker
// @version      1.2
// @description  去掉知乎的营销视频
// @author       nu11ptr
// @match        *://www.zhihu.com/*
// @downloadURL https://update.greasyfork.org/scripts/412782/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/412782/%E7%9F%A5%E4%B9%8E%E5%8E%BB%E8%A7%86%E9%A2%91.meta.js
// ==/UserScript==
function Work(){
	var list = document.getElementsByClassName("Card TopstoryItem TopstoryItem--old TopstoryItem-isRecommend");
	for(var i=0;i<list.length;i++){
		if(list[i].getElementsByClassName("ZVideoItem-player").length || list[i].getElementsByClassName("VideoAnswerPlayer").length){
			list[i].parentNode.removeChild(list[i]);
		}
	}
}
(function() {
	'use strict';
	setInterval(Work,1000);
})();