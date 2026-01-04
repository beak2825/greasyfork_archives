// ==UserScript==
// @name         暑期教师研修(2024.07)|无人值守自动学习
// @namespace    http://tampermonkey.net/
// @version      24.07.21.14
// @description  建议先登录后再安装此脚本，国家中小学智慧教育平台登录网址：https://basic.smartedu.cn/training/2024sqpx
// @author       ZSCZGYG CP
// @match        https://www.smartedu.cn/*
// @match        https://basic.smartedu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.10.4/dist/sweetalert2.all.min.js
// @resource     css https://cdn.jsdelivr.net/npm/sweetalert2@11.10.4/dist/sweetalert2.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486368/%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%28202407%29%7C%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.user.js
// @updateURL https://update.greasyfork.org/scripts/486368/%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%28202407%29%7C%E6%97%A0%E4%BA%BA%E5%80%BC%E5%AE%88%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A0.meta.js
// ==/UserScript==
 
(function () {
	'use strict';
 
	// Your code here...
	// 引入第三方库https://github.com/sweetalert2/sweetalert2/
	GM_addStyle(GM_getResourceText("css"));
	// 弹窗函数
	function msg(txt, ms = 3000) {
		Swal.fire({
			title: txt,
			position: "center",
			icon: "success",
			showConfirmButton: false,
			timer: ms,
			timerProgressBar: true,
		})
	}
	var log = console.log;
	// 课程
	var course_name = "2024年暑期教师研修（中小学版）";
	var home = "https://basic.smartedu.cn/training/2024sqpx";
	var course_url = [
		// 大力弘扬教育家精神
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0de67197-af6f-43ab-8d89-59a75aab289e&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
		// 强化国家安全与文化自信
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=4eb65b2f-0b53-4d3f-8027-81d69dca7f18&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
		// 数字素养与技能提升
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c6ac438b-9c68-45ee-aa1f-a3754cdd5c89&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
                // 科学素养提升
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=bc6232ef-1a1c-4da6-b53e-a929f9427e8a&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
                // 心理健康教育能力提升
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=0bbcd4e7-f227-47f8-b4f2-2fb339ac1edc&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
                // 综合育人能力提升
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=f78d68fb-0386-4a26-aeb9-d0835b35bde2&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
                // 幼儿社会情感学习
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=fa649a38-6284-4ee4-b4de-b9a77c5e5faa&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
                // 2022年版义务教育课程方案和课程标准国家级示范培训
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=6add8346-d463-4ee9-8aae-e8d84bc0b43b&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
                // 高中作业设计与研究
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=c83105a9-e6ea-48bc-bb6a-622416577fee&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
                // 中小学实验教学基本目录理念与实践培训
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=7815d28d-eeca-42f8-84e8-8f080b92c902&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
                // 特殊教育拓展融合
		"https://basic.smartedu.cn/teacherTraining/courseDetail?courseId=12010fd9-8eea-473a-afcd-3c8a932e7553&tag=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98&channelId=&libraryId=bb042e69-9a11-49a1-af22-0c3fab2e92b9&breadcrumb=2024%E5%B9%B4%E2%80%9C%E6%9A%91%E6%9C%9F%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E2%80%9D%E4%B8%93%E9%A2%98",
		]
	// 上述配置的课程，分别学习多少课时（看多少个视频），因为认定学时有限，每个课程不用刷完！！！
	// 配置-1为学完当前课程的所有视频
	var lessons = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
 
 
	function next() {
		var href = window.location.href;
		var index = course_url.indexOf(href);
		if (index > -1) {
			if (index + 1 < course_url.length) {
				window.location.href = course_url[index + 1];
			} else {
				window.location.href = home;
			}
		} else {
			window.location.href = course_url[0];
		}
	}
 
 
	function click(auto_next = true) {
		// 判读是否满足学时要求
		if (lessons) {
			var href = window.location.href;
			var index = course_url.indexOf(href);
			var lesson = lessons[index];
			if (lesson != undefined && lesson != -1) {
				let headers = document.getElementsByClassName("fish-collapse-header");
				for (let i = 0; i < headers.length; i++) {
					let header = headers[i];
					header.click();
				}
				let finish = document.getElementsByClassName("iconfont icon_checkbox_fill");
				log(`当前页面已经学完【${finish.length}】个视频，学时要求为【${lesson}】个视频，是否达标：${finish.length >= lesson}`);
				if (finish.length >= lesson) {
					next();
				}
			}
		}
		var icon = null;
		function find_icon() {
			// 进行中
			icon = document.getElementsByClassName("iconfont icon_processing_fill")[0];
			// 未开始
			if (!icon) {
				icon = document.getElementsByClassName("iconfont icon_checkbox_linear")[0];
			}
		}
		// 查找默认列表
		find_icon();
		// 展开其他列表
		if (!icon) {
			let headers = document.getElementsByClassName("fish-collapse-header");
			for (let i = 0; i < headers.length; i++) {
				let header = headers[i];
				header.click();
				find_icon();
				if (icon) {
					break;
				}
			}
		}
		// 有没学完的
		if (icon) {
			icon.click();
		} else {
			if (auto_next) {
				next();
			} else {
				Swal.fire("当前页面所有视频已经播放完！", "", "success");
			}
		}
	}
 
 
	function play(v = null) {
		if (!v) {
			v = document.getElementsByTagName("video")[0];
		}
		if (v) {
		        v.dispatchEvent(new Event("ended"));	
                        v.muted = true;
			v.playbackRate = 1;
			v.play();
			//v.currentTime = v.duration;
		}
	}
 
	var pageNumber = null;
	var pageCount = null;
	function read() {
		log(`PDF文档阅读: pageNumber==>${pageNumber}, pageCount==>${pageCount}`);
		if (pageCount) {
			var pc = pageCount;
			// 最后一页
			log("PDF文档跳到最后一页:", pc);
			window.postMessage({
				type: "pdfPlayerPageChangeing",
				data: {
					pageNumber: pc,
					pageCount: pc,
				}
			}, "*");
			// 第一页
			setTimeout(function () {
				log("PDF文档调到第一页...");
				window.postMessage({
					type: "pdfPlayerPageChangeing",
					data: {
						pageNumber: 1,
						pageCount: pc,
					}
				}, "*");
			}, 1000);
			// 重置
			pageCount = null;
		}
	}
 
 
	// 答题
	function answer() {
		let count = 0;
		const intervalId = setInterval(() => {
			log("自动答题检测...");
			// 选A
			var a = document.getElementsByClassName("nqti-check")[0];
			if (a) {
				a.click();
				// 下一题、确定
				for (let i = 0; i < 2; i++) {
					var btn = document.querySelector("div.index-module_footer_3r1Yy > button");
					if (btn) {
						btn.click();
					}
				}
			}
			count++;
			if (count === 3) {
				clearInterval(intervalId);
			}
		}, 1000);
	}
 
 
	function main() {
		log("main...");
		// 实际刷视频时比学时要求的多1~2个，避免网络等各种原因造成出错
		if (lessons) {
			lessons.forEach(function (item, index, array) {
				if (item > 0) {
					item += 2;
				}
				array[index] = item;
			});
		}
		// 等待页面加载，延时开始
		var delay = 1000 * 10
		var href = window.location.href;
		if (course_url.includes(href)) {
			msg(`等待网页资源加载, 约【${delay / 1000}】秒后开始自动播放视频`, delay);
			setInterval(function () {
				click();
				play();
				read();
				answer();
			}, delay);
		} else {
			Swal.fire({
				//background: "#url(https://baotangguo.cn:8081/)",
				icon: "warning",
				title: "开始放飞自我（自动刷视频）？",
				text: "good good study,day day up！",
				showDenyButton: true,
				showCancelButton: true,
				confirmButtonColor: "green",
				confirmButtonText: `<div style="width: 450px;">刷脚本配置的课程，当前为：<br><b>${course_name}</b></div>`,
				denyButtonColor: "blue",
				denyButtonText: '<div style="width: 450px;">我先小试一下（只刷当前页的视频）</div>',
				cancelButtonColor: "red",
				cancelButtonText: '<div style="width: 450px;">我想自己努力！（退出）</div>',
			}).then((result) => {
				/* Read more about isConfirmed, isDenied below */
				if (result.isConfirmed) {
					msg("走你~");
					next();
				} else if (result.isDenied) {
					msg(`【${delay / 1000}】秒后开始自动播放视频`, delay);
					setInterval(function () {
						click(false);
						play();
						read();
						answer();
					}, delay);
				}
			})
		}
	}
 
 
	if (document.readyState === "complete") {
		// DOM 已经加载完成
		main();
	} else {
		// DOM 还未加载完成
		window.onload = main;
	}
	document.addEventListener("keydown", function (event) {
		log("keydown", event.code);
		if (event.code === "KeyG") {
			main();
		}
	});
	window.addEventListener("message", function (event) {
		var data = event.data;
		log("message from PDF================>", data);
		if (data.type === "pdfPlayerInitPage") {
			pageNumber = data.data.pageNumber;
			pageCount = data.data.pageCount;
			log(`PDF文档初始化: pageNumber==>${pageNumber}, pageCount==>${pageCount}`);
		}
	});
})();