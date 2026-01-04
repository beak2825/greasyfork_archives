// ==UserScript==
// @name         超星尔雅小公举
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  超星尔雅
// @author       kikidetermine
// @match        https://mooc1.chaoxing.com/mycourse/studentstudy?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none

// @downloadURL https://update.greasyfork.org/scripts/432984/%E8%B6%85%E6%98%9F%E5%B0%94%E9%9B%85%E5%B0%8F%E5%85%AC%E4%B8%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/432984/%E8%B6%85%E6%98%9F%E5%B0%94%E9%9B%85%E5%B0%8F%E5%85%AC%E4%B8%BE.meta.js
// ==/UserScript==

(function() {
	'use strict';

	// Your code here...

	window.onload = function() {

		setTimeout(function() {
			console.clear()
			console.log("页面加载完成！")

			//获取tg_iframe DOM
			console.log("开始获取tg_iframe DOM！......")
			var tg_iframe = document.getElementsByTagName("iframe")[0].contentDocument
			if(!tg_iframe){
				console.log("tg_iframe DOM 获取失败！......")
				return
			}
			console.log("tg_iframe DOM获取成功！")
			console.log(tg_iframe)

			//获取video_iframe DOM
			console.log("开始获取video_iframe DOM！......")
			var video_iframe = tg_iframe.getElementsByTagName("iframe")[0].contentDocument
			if(!video_iframe){
				console.log("video_iframe DOM 获取失败！......")
				return
			}
			console.log("video_iframe DOM获取成功！")
			console.log(video_iframe)

			//获取video控件 DOM
			console.log("开始获取video控件 DOM！......")
			var vvideo = video_iframe.getElementsByTagName("video")[0]
			if(!vvideo){
				console.log("video控件 DOM 获取失败！......")
				return
			}
			console.log("video控件获取成功！")
			console.log(vvideo)

			//获取当前章节DOM
			console.log("开始获取当前章节DOM ......")
			var chapter = document.getElementsByClassName("posCatalog_active")[0]
			if(!chapter){
				console.log("当前章节DOM获取失败！")
				return
			}
			console.log("当前章节DOM获取成功！")
			console.log(chapter)


			//获得下一章节DOM
			console.log("开始获取下一章节DOM ......")
			var next_chapter = chapter.parentElement.nextElementSibling
			if(typeof (next_chapter) == 'undefined'){
				console.log(next_chapter)
				console.log("下一章节DOM获取失败！")
				return
			}else if(next_chapter == null){
				next_chapter = chapter.parentElement.parentElement.parentElement.parentElement.nextElementSibling.getElementsByTagName("ul")[0].getElementsByTagName("li")[0]
				console.log(next_chapter)
			}
			console.log("下一章节DOM获取成功！")
			console.log(next_chapter)

			vvideo.muted=true
			vvideo.playbackRate = 2
			vvideo.play()

			//小测试监控
			setInterval(function () {
				var quiz = video_iframe.getElementsByClassName("ans-videoquiz")[0]
				if(quiz){
					console.log("发现小测验！！！")
					var quiz_submit = quiz.getElementsByClassName("ans-videoquiz-submit")[0],
						quiz_title = quiz.getElementsByClassName("ans-videoquiz-title")[0],
						quiz_opt = quiz.getElementsByClassName("ans-videoquiz-opt");

					var quiz_title_txt = quiz_title.innerText.trim()

					//发起ajax请求，获取答案
					var xmlhttp;
					if(window.XMLHttpRequest) {
						//  IE7+, Firefox, Chrome, Opera, Safari 浏览器执行代码
						xmlhttp = new XMLHttpRequest();
					} else {
						// IE6, IE5 浏览器执行代码
						xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
					}
					xmlhttp.open("POST", "https://hcrimi.net")
					xmlhttp.onreadystatechange = function() {
						if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {

							var answer = xmlhttp.responseText
							console.log(answer)
							for (var i = 0 ;i < quiz_opt.length; i++) {
								var opt_txt = quiz_opt[i].getElementsByTagName("label")[0].innerText
				
								if(opt_txt.indexOf(answer) >= 0 ){
									console.log("匹配选项：" + opt_txt)
									console.log(quiz_opt[i].getElementsByTagName("input")[0])
									quiz_opt[i].getElementsByTagName("input")[0].setAttribute("checked","checked")
									quiz_submit.click()
									return
								}
							}
							console.log("未找到小测验答案！！！")
						}
					}

					xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
					xmlhttp.send("course_name=科学学风与道德建设&exam_type=quiz&question="+quiz_title_txt)

//					quiz_submit.click()
				}else{

				}
			},2000)

			//视频播放完毕跳转下一节
			vvideo.onended = function () {
				next_chapter.getElementsByClassName("posCatalog_name")[0].onclick()
				setTimeout(function () {
					location.reload()
				},5000)
			}



		}, 5000)

	}
})();