// ==UserScript==
// @name         0603权威性考试脚本
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  对权威性项目进行辅助标注
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/467877/0603%E6%9D%83%E5%A8%81%E6%80%A7%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/467877/0603%E6%9D%83%E5%A8%81%E6%80%A7%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
	'use strict';
	//发送数据的数组
	let data = [];
	//	let url;
	var interval01;
	let name = "唐艳"
	var date;
	var score;
	var count;
	$('.right___3qm0g > div:last').after(`
	<br>
	<div id="dd">
	<button id='btn01'>-1(站点突兀)</button>
	<button id='btn02'>-0.5(多领域小站)</button>
	<button id='btn03'>0(多领域大站)</button>
	<button id='btn04'>0(作者领域无关)</button>
	<br>
    <button id='btn05'>0(作者粉丝或历史作品太少)</button>
	<button id='btn06'>0(作者领域较泛)</button>
	<button id='btn07'>0(站点领域无法判断)</button>
	<br>
	<button id='btn08'>0(作者领域无法判断)</button>
	<button id='btn09'>0.5(垂直类小站)</button>
	<button id='btn10'>0.5(作者领域相关)</button>
	<button id='btn11'>1(站点权威)</button>
	<br>
	<button id='btn12'>1(作者权威)</button>
	<button id='btn13'>1(领域相关大站)</button>
	<button id='btn14'>死链</button>
	<button id='btn15'>抛弃</button>
	</div>
	<br>
	<button id='_save'>保存下一题</button>
	<button id='find_zh' >查询一次</button>
	<button id='start_auto_find' >开始自动查询</button>
	<button id='end_auto_find' >结束自动查询</button>
	<br>
	<br>
	<br>
	<br>
	<br>
	<br>
	<br>
	<button id='btn99'></button>
	<button id='btn98'></button>
	`)


	Date.prototype.Format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"H+": this.getHours(), //小4时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 -
			RegExp.$1
			.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1
				.length == 1) ? (o[
				k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	// $("button").width(50)
	$("button").height(50)


	$("#btn99").click(() => {
		let url = name + $("a").eq(0).html();
		date = new Date().Format("yyyy-MM-dd HH:mm:ss");
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9010/insert',
			nocache: true,
			responseType: "json",
			data: `url=${url}&score=${score}&data=${data}&date=${date}&name=${name}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});

		new Promise((resolve, reject) => {
			$('.ant-radio-input').eq(score).click();
			resolve();
		}).then(() => {
			$(".ant-select-selection__rendered").click()
		}).then(() => {
			// setTimeout(() => {
			// 	$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root.ant-select-dropdown-menu-vertical > li:contains("'+ data +'")')
			// 		.click();
			// }, 500)

			$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root.ant-select-dropdown-menu-vertical > li:contains("' +
					data + '")')
				.click();
		}).then(() => {
			// setTimeout(() => {
			// 	$(".ant-btn-primary").click();
			// 	console.log("提交成功");
			// }, 800)
			$(".ant-btn-primary").click();
		})
	})
	
	
	$("#btn98").click(() => {
		let url = name + $("a").eq(0).html();
		date = new Date().Format("yyyy-MM-dd HH:mm:ss");
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9010/insert',
			nocache: true,
			responseType: "json",
			data: `url=${url}&score=${score}&data=${data}&date=${date}&name=${name}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			}
		});
	
		new Promise((resolve, reject) => {
			$('.ant-radio-input').eq(score).click();
			resolve();
		}).then(() => {
			$(".ant-select-selection__rendered").click()
		}).then(() => {
			// setTimeout(() => {
			// 	$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root.ant-select-dropdown-menu-vertical > li:contains("'+ data +'")')
			// 		.click();
			// }, 500)
	
			$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root.ant-select-dropdown-menu-vertical > li:contains("' +
					data + '")')
				.click();
		}).then(() => {
			// setTimeout(() => {
			// 	$(".ant-btn-primary").click();
			// 	console.log("提交成功");
			// }, 800)
			//$(".ant-btn-primary").click();
		})
	})

	//查询一次
	$("#find_zh").click(() => {
		let url = "zh" + $("a").eq(0).html();
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9010/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				console.log(res.response.res)
				if (res.response.res == undefined) {
					$('#end_auto_find').click();
				}
				data = JSON.parse(res.response.res)
				if (data) {
					new Promise((resolve, reject) => {
						$('.ant-radio-input').eq(data.score).click();
						resolve();
					}).then(() => {
						$(".ant-select-selection__rendered").click()
					}).then(() => {
						// setTimeout(() => {
						// 	$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root.ant-select-dropdown-menu-vertical > li:contains("'+ data +'")')
						// 		.click();
						// }, 500)

						$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root.ant-select-dropdown-menu-vertical > li:contains("' +
								data.data + '")')
							.click();
					}).then(() => {
						// setTimeout(() => {
						// 	$(".ant-btn-primary").click();
						// 	console.log("提交成功");
						// }, 800)
						$(".ant-btn-primary").click();
					})
				}
			}
		});
	})


	setInterval(()=>{
		//$("#find_zh").click();
	},5000)

	//下一题
	$(".ant-btn-primary").click(() => {
		data = "";
	});
	
		
	$("#start_auto_find").click(()=>{
		clearInterval(interval01)
		interval01 = setInterval(()=>{
			$("#btn99").click()
		},4000)
	})
	
	$("#end_auto_find").click(()=>{
		clearInterval(interval01)
	})
	

	// <button id='btn01'>-1(站点突兀)</button>
	$("#btn01").click(() => {
		new Promise((resolve, reject) => {
			score = 0;
			console.log(score);
			data = "站点突兀";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})

	// <button id='btn02'>-0.5(多领域小站)</button>
	$("#btn02").click(() => {
		new Promise((resolve, reject) => {
			score = 1;
			console.log(score);
			data = "多领域小站";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn03'>0(多领域大站)</button>
	$("#btn03").click(() => {
		new Promise((resolve, reject) => {
			score = 2;
			console.log(score);
			data = "多领域大站";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn04'>0(作者领域无关)</button>
	$("#btn04").click(() => {
		new Promise((resolve, reject) => {
			score = 2;
			console.log(score);
			data = "作者领域无关";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})


	// <button id='btn05'>0(作者粉丝或历史作品太少)</button>
	$("#btn05").click(() => {
		new Promise((resolve, reject) => {
			score = 2;
			console.log(score);
			data = "作者粉丝或历史作品太少";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn06'>0(作者领域较泛)</button>
	$("#btn06").click(() => {
		new Promise((resolve, reject) => {
			score = 2;
			console.log(score);
			data = "作者领域较泛";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn07'>0(站点领域无法判断)</button>
	$("#btn07").click(() => {
		new Promise((resolve, reject) => {
			score = 2;
			console.log(score);
			data = "站点领域无法判断";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn08'>0(作者领域无法判断)</button>
	$("#btn08").click(() => {
		new Promise((resolve, reject) => {
			score = 2;
			console.log(score);
			data = "作者领域无法判断";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn09'>0.5(垂直类小站)</button>
	$("#btn09").click(() => {
		new Promise((resolve, reject) => {
			score = 3;
			console.log(score);
			data = "垂直类小站";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn10'>0.5(作者领域相关)</button>
	$("#btn10").click(() => {
		new Promise((resolve, reject) => {
			score = 3;
			console.log(score);
			data = "作者领域相关";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn11'>1(站点权威)</button>
	$("#btn11").click(() => {
		new Promise((resolve, reject) => {
			score = 4;
			console.log(score);
			data = "站点权威";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn12'>1(作者权威)</button>
	$("#btn12").click(() => {
		new Promise((resolve, reject) => {
			score = 4;
			console.log(score);
			data = "作者权威";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn13'>1(领域相关大站)</button>
	$("#btn13").click(() => {
		new Promise((resolve, reject) => {
			score = 4;
			console.log(score);
			data = "领域相关大站";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn14'>死链</button>
	$("#btn14").click(() => {
		new Promise((resolve, reject) => {
			score = 5;
			console.log(score);
			data = "死链";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})
	// <button id='btn15'>抛弃</button>
	$("#btn15").click(() => {
		new Promise((resolve, reject) => {
			score = 6;
			console.log(score);
			data = "抛弃";
			resolve();
		}).then(() => {
			console.log(data);
			$("#btn99").click();
		})
	})


})();
