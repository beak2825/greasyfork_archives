// ==UserScript==
			// @name         河南省专业技术人员继续教育网络学院全自动
			// @namespace    www.777.com/
			// @version      2.0
			// @description  河南专技在线-vip1刷课
			// @author       666
			// @match        *://*.haacee.org.cn/*
			// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/393503/%E6%B2%B3%E5%8D%97%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%85%A8%E8%87%AA%E5%8A%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/393503/%E6%B2%B3%E5%8D%97%E7%9C%81%E4%B8%93%E4%B8%9A%E6%8A%80%E6%9C%AF%E4%BA%BA%E5%91%98%E7%BB%A7%E7%BB%AD%E6%95%99%E8%82%B2%E7%BD%91%E7%BB%9C%E5%AD%A6%E9%99%A2%E5%85%A8%E8%87%AA%E5%8A%A8.meta.js
			// ==/UserScript==
window.onload = function(){
									var href = location.href;
								    var course = document.getElementsByClassName("rightnav cursor-p")[0];
								    var list = course.getElementsByTagName("li");
								    var i;
									//找到课程列表页的所有课程
									var alldiv = document.querySelectorAll('.class-lines');

									if(href.indexOf('user.haacee.org.cn/index')!=-1){
										for (let i = 0; i < alldiv.length; i++) {
											if(alldiv[i].innerText.indexOf('100.0%')== -1){
												alldiv[i].getElementsByClassName('text-f666 f14 btnborder tolearning-ch')[0].click();
											}
										}

									}
									if(href.indexOf('user.haacee.org.cn/learning/')!=-1){
								    setInterval(function(){
								        for (i = 0; i < list.length; i++){
								            if (list[i].className == "active" && list[i].innerText.indexOf("目录") == -1){
								                console.log(list[i].innerText)
								                var current_course = i
								                }
								        }
								        //当前课程播放完成
								        if (list[current_course].innerText.indexOf("100%") != -1){
								            if(list[current_course+1].innerText.indexOf("%") == -1){
								                list[current_course+2].click()
								            }else{
								                list[current_course+1].click()
								            }
								            location.reload();
								        }
								        window.s2j_onVideoPlay()
								    },1000)
									}

				}