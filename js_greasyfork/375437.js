// ==UserScript==
// @name           机核网 GADIO 时间轴操作优化
// @namespace  http://zhangbohun.github.io/
// @version        0.2
// @description  增加时间轴鼠标滚轮控制（新版web页面时间轴文字说明官方已经支持选中复制了）
// @author         zhangbohun
// @match         *://www.gcores.com/*
// @grant          none
// @run-at 	     document-end
// @downloadURL https://update.greasyfork.org/scripts/375437/%E6%9C%BA%E6%A0%B8%E7%BD%91%20GADIO%20%E6%97%B6%E9%97%B4%E8%BD%B4%E6%93%8D%E4%BD%9C%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/375437/%E6%9C%BA%E6%A0%B8%E7%BD%91%20GADIO%20%E6%97%B6%E9%97%B4%E8%BD%B4%E6%93%8D%E4%BD%9C%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
'use strict';

window.onload = function () {
    //增加时间轴鼠标滚轮控制
	document.onmousewheel=function(event){//由于节点会重新挂载，所以使用委托实现
	//console.log(event.target)
	if (document.querySelector(".gpf_body")&&document.querySelector(".gpf_body").contains(event.target)) {
		if (event.wheelDelta > 0) {
			if(document.querySelector(".gpf_playingTimeline_l a")){
				document.querySelector(".gpf_playingTimeline_l a").click();
			}
		}
		else {
			if(document.querySelector(".gpf_playingTimeline_r a")){
				document.querySelector(".gpf_playingTimeline_r a").click();
			}
		}
		event.preventDefault();//阻止页面滚动
		}
	}
};