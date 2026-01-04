// ==UserScript==
// @name         1120AE模型正式脚本
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  对AE模型考试项目进行辅助标注
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/480173/1120AE%E6%A8%A1%E5%9E%8B%E6%AD%A3%E5%BC%8F%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/480173/1120AE%E6%A8%A1%E5%9E%8B%E6%AD%A3%E5%BC%8F%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
	'use strict';
	var author = "jjl";
	var url;
	var url_query;
	var url_title;
	var url_url;
	var url_body;
	var date;
	var data;
	var answer;
	var content;
	var abandon;
	var timeInterval;
	var tibao;
	var question_num;

	$('.right___HJMDt > div:last').after(`
	<div id="dd">
	<button id='btn00'>是</button>
	<button id='btn01'>否</button>
	<br>
	<button id='btn02'>抛弃-主观q</button>
	<button id='btn03'>抛弃-非问答需求</button>
	<button id='btn04'>抛弃-需求不明</button>
	<br>
	<button id='btn05'>查询一次</button>
	<button id='btn07'>测试</button>
	<br>
	</div>

	<a id="content"></a><br>
	<a id="author"></a><br>

	`);

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

	$("#dd button").width(120);
	$("#dd button").height(40);

	function getBasicInfor() {
		tibao = window.location.hash.split('/').map(e => e.trim())[4];
		url_query = document.querySelector(
			"#root > div > div > div > div > div > div.right___HJMDt > div.ant-card.ant-card-bordered > div > div:nth-child(1)"
			).innerText;
		url_title = document.querySelector(
			"#root > div > div > div > div > div > div.right___HJMDt > div.ant-card.ant-card-bordered > div > div:nth-child(2)"
			).innerText;
		url_url = document.querySelector(
			"#root > div > div > div > div > div > div.right___HJMDt > div.ant-card.ant-card-bordered > div > div:nth-child(3)"
			).innerText;
		url_body = document.querySelector(
			"#root > div > div > div > div > div > div.right___HJMDt > div.ant-card.ant-card-bordered > div > div:nth-child(4) > div"
			).innerText;
		url = author + url_query + url_title + url_url + url_body;
		console.log(url)
		url = md5(url);
		console.log(url)
		date = new Date().Format("yyyy-MM-dd HH:mm:ss");
	}

	function clearBasicInfor() {
		url = "";
		answer = null;
		content = "";
		abandon = null;
		$("#content").html("")
	}

	$("#btn07").click(() => {
		// clearBasicInfor();
		getBasicInfor();
	})

	$('.ant-radio-input').eq(0).click(() => {
		answer = 0;
		console.log(answer)
	});
	$('.ant-radio-input').eq(1).click(() => {
		answer = 1;
		console.log(answer)
	});
	$('.ant-radio-input').eq(2).click(() => {
		answer = 2;
		console.log(answer)
	});

	//是
	$("#btn00").click(() => {
		clearBasicInfor();
		getBasicInfor();
		answer = 0;
		$('.ant-radio-input').eq(answer).click();
		//获取划词内容
		for (var i = 0; i < $(".ant-select-selection__choice__content").length; i++) {
			content = content + "第" + (i + 1) + "个:" + $(".ant-select-selection__choice__content").eq(i)
				.html() + ";    ";
		}
		console.log(content)
		//发送请求
		qq();
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 400)
	})
	//查询一次
	$("#btn05").click(() => {
		clearBasicInfor();
		getBasicInfor();
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9016/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				data = res.response.res
				data = JSON.parse(data);
				console.log(data)
				if (data.answer && data.answer === "0") {
					$('.ant-radio-input').eq(0).click();
					$("#content").html(data.content)
				}
				if (data.answer && data.answer === "1") {
					$('.ant-radio-input').eq(1).click();
					if(tibao <199){
						setTimeout(() => {
							$(".ant-btn.ant-btn-primary").click();
						}, 400);
					}
				}
				if (data.answer && data.answer === "2") {
					$('.ant-radio-input').eq(2).click();
					$(".ant-select-selection__rendered").click();
					setTimeout(() => {
						$(".ant-select-dropdown-menu-item").eq(data.abandon).click();
						if(tibao <199){
							setTimeout(() => {
								$(".ant-btn.ant-btn-primary").click();
							}, 400);
						}
					}, 200)
				}
				setTimeout(() => {
					//$(".ant-btn.ant-btn-primary").click();
				}, 400);
			}
		});
	})
	//否
	$("#btn01").click(() => {
		clearBasicInfor();
		getBasicInfor();
		$('.ant-radio-input').eq(1).click();
		answer = 1;
		//发送请求
		qq();
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 400)
	})

	//抛弃-主观q
	$("#btn02").click(() => {
		clearBasicInfor();
		getBasicInfor();
		answer = 2;
		abandon = 0; //主观q
		qq();
		$('.ant-radio-input').eq(answer).click();
		$(".ant-select-selection__rendered").click();
		setTimeout(() => {
			$(".ant-select-dropdown-menu-item").eq(abandon).click();
		}, 200)
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 400)
	})

	//抛弃-非问答需求
	$("#btn03").click(() => {
		clearBasicInfor();
		getBasicInfor();
		$('.ant-radio-input').eq(2).click();
		answer = 2;
		abandon = 1; //非问答需求
		qq();
		$('.ant-radio-input').eq(answer).click();
		$(".ant-select-selection__rendered").click();
		setTimeout(() => {
			$(".ant-select-dropdown-menu-item").eq(abandon).click();
		}, 200)
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 400)
	})

	//抛弃-需求不明
	$("#btn04").click(() => {
		clearBasicInfor();
		getBasicInfor();
		$('.ant-radio-input').eq(2).click();
		answer = 2;
		abandon = 2; //需求不明
		qq();
		$('.ant-radio-input').eq(answer).click();
		$(".ant-select-selection__rendered").click();
		setTimeout(() => {
			$(".ant-select-dropdown-menu-item").eq(abandon).click();
		}, 200)
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 400)
	})

	$(".ant-btn.ant-btn-primary").click(() => {
		setTimeout(function() {
			$("#btn05").click()
		}, 1000)
	})

	function qq() {
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9016/insert',
			nocache: true,
			data: `url=${url}&answer=${answer}&content=${content}&abandon=${abandon}&date=${date}&author=${author}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
	}
})();