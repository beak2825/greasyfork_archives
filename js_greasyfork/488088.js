// ==UserScript==
// @name         (高等教育教师学习)2024年寒假教师研修|国家智慧教育公共服务平台|自动刷视频
// @namespace    http://tampermonkey.net/
// @version      2024.02.12
// @description  国家智慧教育公共服务平台（国家中小学智慧教育平台）自动刷视频！
// @author       yygdz1921 LynnZixing
// @match        https://*.smartedu.cn/*
// @match        https://basic.smartedu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.10.4/dist/sweetalert2.all.min.js
// @resource     css https://cdn.jsdelivr.net/npm/sweetalert2@11.10.4/dist/sweetalert2.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/488088/%28%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%AD%A6%E4%B9%A0%292024%E5%B9%B4%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.user.js
// @updateURL https://update.greasyfork.org/scripts/488088/%28%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%AD%A6%E4%B9%A0%292024%E5%B9%B4%E5%AF%92%E5%81%87%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%7C%E5%9B%BD%E5%AE%B6%E6%99%BA%E6%85%A7%E6%95%99%E8%82%B2%E5%85%AC%E5%85%B1%E6%9C%8D%E5%8A%A1%E5%B9%B3%E5%8F%B0%7C%E8%87%AA%E5%8A%A8%E5%88%B7%E8%A7%86%E9%A2%91.meta.js
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
	var course_name = "2024年寒假教师研修（高等教育版）";
	var home = "teacher.higher.smartedu.cn/h/subject/winter2024/";
	var course_url = [
		// 弘扬教育家精神 勇担强国建设使命
		"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_810687237054750720?itemId=810693235301191680&type=1&segId=810693039712407552&projectId=809940368202608640&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fwinter2024%2F&lessonId=815428064368738304",
		// 关爱教师 提升从教幸福感
		"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_810687237037973504?itemId=810693385514692608&type=1&segId=810693315022721024&projectId=809940368202608640&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fwinter2024%2F&lessonId=811878824826601473",
		// 综合育人能力提升
		"https://core.teacher.vocational.smartedu.cn/p/course/vocational/v_810687237017001984?itemId=810693621030752256&type=1&segId=810693577279967232&projectId=809940368202608640&orgId=608196190709395456&originP=1&service=https%3A%2F%2Fteacher.higher.smartedu.cn%2Fh%2Fsubject%2Fwinter2024%2F&lessonId=811876048882094081",
		]
	// 上述配置的课程，分别学习多少课时（看多少个视频），因为认定学时有限，每个课程不用刷完！！！
	// 配置-1为学完当前课程的所有视频
	var lessons = [-1, -1, -1];


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
			icon = document.getElementsByClassName("video-title  clearfix");
            var filteredElements = [];

            // 遍历获取的元素
            for (var i = 0; i < icon.length; i++) {
                // 检查元素内是否包含 span 元素且其 class 为 "four"，以及 test 属性值为 "100"
                var spans = icon[i].getElementsByTagName("span");
                if (spans[3].innerText != "100%") {
                    // 如果符合条件，则将元素添加到 filteredElements 数组中
                    filteredElements.push(icon[i]);
                    // 可选：如果只需要找到一个符合条件的元素，可以在这里添加 break;
                    // break;
                }
            }
            icon = filteredElements[0];
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
				title: "开始刷视频？",
				text: "好好学习，天天向上！",
				showDenyButton: true,
				showCancelButton: true,
				confirmButtonColor: "green",
				confirmButtonText: `<div style="width: 450px;">刷脚本配置的课程，当前为：<br><b>${course_name}</b></div>`,
				denyButtonColor: "blue",
				denyButtonText: '<div style="width: 450px;">只刷当前页的视频</div>',
				cancelButtonColor: "red",
				cancelButtonText: '<div style="width: 450px;">退出</div>',
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
