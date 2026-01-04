// ==UserScript==
// @name         河南专技在线-全自动版本
// @namespace    www.666.com/
// @version      4.0
// @description  河南专技在线-vip1刷课
// @author       666
// @match        *://*.ghlearning.com/*
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/390078/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%9C%A8%E7%BA%BF-%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/390078/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%9C%A8%E7%BA%BF-%E5%85%A8%E8%87%AA%E5%8A%A8%E7%89%88%E6%9C%AC.meta.js
// ==/UserScript==


window.onload = function(){
				let myhref = location.href;
				if(myhref.indexOf('my/play_study')!=-1){
					 location.reload();
					let course = document.getElementsByClassName('col-xs-12 col-sm-12 col-md-6 col-lg-4');
					for (let i = 0; i < course.length; i++) {
										 if(course[i].innerText.indexOf('100.0%')== -1){
											course[i].getElementsByClassName('state-jx-1')[0].click();
											break;
										 }

					}
					console.log('我是课程列表页第二次出现的')
				}else if(myhref.indexOf('learning/index?myClassId')!=-1){
					setInterval(function(){
										 if(document.getElementsByClassName('pv-ask-modal').length==1){
										 					 document.getElementsByClassName('pv-ask-modal')[0].remove();
										 					 document.getElementsByClassName('pv-video')[0].click();
										 					}
										//如果出现视频看完的提示，就点击回到课程列表
										if(document.getElementsByClassName('modal-dialog modal-sm showcontext')[0].getElementsByClassName('btn btn-primary')[0].innerText.indexOf('返回课程列表')!=-1){
											document.getElementsByClassName('modal-dialog modal-sm showcontext')[0].getElementsByClassName('btn btn-primary')[0].click();
										}

					},1000)

				}
			}

