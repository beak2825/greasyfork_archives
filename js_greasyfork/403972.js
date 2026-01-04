// ==UserScript==
// @name         河南专技在线-全自动版本
// @namespace    www.666.com/
// @version      1.0
// @description  河南专技在线-vip1刷课
// @author       666
// @match        *://*.ghlearning.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/403972/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%9C%A8%E7%BA%BF-%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/403972/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%9C%A8%E7%BA%BF-%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
  var href = location.href;
			var i;
			//看视屏页面移除问题
			if(href.indexOf('learning/index?myClassId')!=-1){
				 setInterval(function(){
					 if(document.getElementsByClassName('pv-ask-modal').length==1){
					 					 document.getElementsByClassName('pv-ask-modal')[0].remove();
					 					 document.getElementsByClassName('pv-video')[0].click();
					 					};
					//如果出现视频看完的提示，就点击回到课程列表
					if(document.getElementsByClassName('modal-dialog modal-sm showcontext')[0].getElementsByClassName('btn btn-primary')[0].innerText.indexOf('返回课程列表')!=-1){
						document.getElementsByClassName('modal-dialog modal-sm showcontext')[0].getElementsByClassName('btn btn-primary')[0].click();	
					};
					 
				 },2000)
			};
			if(href.indexOf('my/play_study')!=-1){
				var course = document.getElementsByClassName('col-xs-12 col-sm-12 col-md-6 col-lg-4');
				for (i = 0; i < course.length; i++) {
									 if(course[i].innerText.indexOf('100.0%')== -1){
									course[i].getElementsByClassName('play_bg')[0].click();	 
									 }
					
				}	 
				
			}
			
})();