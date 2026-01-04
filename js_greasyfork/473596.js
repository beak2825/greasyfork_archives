// ==UserScript==
// @name         智能摘要01正式脚本1014
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  智能摘要
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/473596/%E6%99%BA%E8%83%BD%E6%91%98%E8%A6%8101%E6%AD%A3%E5%BC%8F%E8%84%9A%E6%9C%AC1014.user.js
// @updateURL https://update.greasyfork.org/scripts/473596/%E6%99%BA%E8%83%BD%E6%91%98%E8%A6%8101%E6%AD%A3%E5%BC%8F%E8%84%9A%E6%9C%AC1014.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var url;
	var name = "ty";
	var date;
	var isThereAnAnswer;
	var isCorrect;
	$('.right___1CWTU > div:last').after(`
		<button class="button_zdy"id='btn01'>0</button>
		<button class="button_zdy"id='btn02'>-1</button>
		<button class="button_zdy"id='btn03'>-0.5</button>
		<button class="button_zdy"id='btn04'>列表</button><br>
		<button class="button_zdy"id='btn05'>长答案</button>
		<button class="button_zdy"id='btn06'>否</button>
		<button class="button_zdy"id='btn07'>不确定</button>
		<br> <button class="button_zdy" id='find'>查询本题</button>
		 <button class="button_zdy" id='_save' >保存下一题</button><br>
		<a id="content"></a><br>
	    <a id="author"></a><br>
	   	`);


	$(".button_zdy").width(80)
	$(".button_zdy").height(40)

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

	function getBasicInfor() {
		url = $("td").eq(0).html().substr(0, 5) + $("a").eq(0).html() + document.querySelector(
			"#root > div > div > div > div > div > div.right___1CWTU > div:nth-child(1) > div.ant-descriptions.ant-descriptions-small.ant-descriptions-bordered > div > table > tbody > tr:nth-child(4) > td"
			).innerHTML;
		console.log(url)
		url = md5(url);
		console.log(url)
		date = new Date().Format("yyyy-MM-dd HH:mm:ss");
		console.log("url:" + url)
		console.log("date:" + date)
	}


	function clearBasicInfor() {
		url = "";
		date = "";
		isThereAnAnswer = null;
		isCorrect = null;
	}

	//0
	$("#btn01").click(() => {
		getBasicInfor();
		isThereAnAnswer = 0;
		isCorrect = 3;
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9014/insert',
			nocache: true,
			data: `url=${url}&isThereAnAnswer=${isThereAnAnswer}&isCorrect=${isCorrect}&name=${name}&date=${date}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		$('.ant-radio-input').eq(0).click();
		$('.ant-radio-input').eq(3).click();
		clearBasicInfor()
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 500)
	})

	//-1
	$("#btn02").click(() => {
		getBasicInfor();
		isThereAnAnswer = 0;
		isCorrect = 4;
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9014/insert',
			nocache: true,
			data: `url=${url}&isThereAnAnswer=${isThereAnAnswer}&isCorrect=${isCorrect}&name=${name}&date=${date}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		$('.ant-radio-input').eq(0).click();
		$('.ant-radio-input').eq(4).click();
		clearBasicInfor();
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 500)
	})

	//-0.5
	$("#btn03").click(() => {
		getBasicInfor();
		isThereAnAnswer = 0;
		isCorrect = 5;
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9014/insert',
			nocache: true,
			data: `url=${url}&isThereAnAnswer=${isThereAnAnswer}&isCorrect=${isCorrect}&name=${name}&date=${date}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		$('.ant-radio-input').eq(0).click();
		$('.ant-radio-input').eq(5).click();
		clearBasicInfor();
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 500)
	})

	//列表
	$("#btn04").click(() => {
		getBasicInfor();
		isThereAnAnswer = 0;
		isCorrect = 6;
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9014/insert',
			nocache: true,
			data: `url=${url}&isThereAnAnswer=${isThereAnAnswer}&isCorrect=${isCorrect}&name=${name}&date=${date}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		$('.ant-radio-input').eq(0).click();
		$('.ant-radio-input').eq(6).click();
		clearBasicInfor();
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 500)
	})

	//长答案
	$("#btn05").click(() => {
		getBasicInfor();
		isThereAnAnswer = 0;
		isCorrect = 7;
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9014/insert',
			nocache: true,
			data: `url=${url}&isThereAnAnswer=${isThereAnAnswer}&isCorrect=${isCorrect}&name=${name}&date=${date}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		$('.ant-radio-input').eq(0).click();
		$('.ant-radio-input').eq(7).click();
		clearBasicInfor();
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 500)
	})

	//否
	$("#btn06").click(() => {
		getBasicInfor();
		isThereAnAnswer = 1;
		isCorrect = null;
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9014/insert',
			nocache: true,
			data: `url=${url}&isThereAnAnswer=${isThereAnAnswer}&isCorrect=${isCorrect}&name=${name}&date=${date}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		$('.ant-radio-input').eq(1).click();
		clearBasicInfor();
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 500)
	})

	//不确定
	$("#btn07").click(() => {
		getBasicInfor();
		isThereAnAnswer = 2;
		isCorrect = null;
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9014/insert',
			nocache: true,
			data: `url=${url}&isThereAnAnswer=${isThereAnAnswer}&isCorrect=${isCorrect}&name=${name}&date=${date}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		$('.ant-radio-input').eq(2).click();
		clearBasicInfor();
		setTimeout(() => {
			$(".ant-btn.ant-btn-primary").click();
		}, 500)
	})

	//查询本题
	$("#find").click(() => {
		getBasicInfor();
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9014/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				let data01 = JSON.parse(res.response.res)
				console.log(data01)
				if (data01.isThereAnAnswer === "0") {
					$('.ant-radio-input').eq(0).click();
					$('.ant-radio-input').eq(data01.isCorrect).click();
				} else {
					$('.ant-radio-input').eq(data01.isThereAnAnswer).click();
				}
				setTimeout(() => {
					$(".ant-btn.ant-btn-primary").click();
				}, 1000)
			}
		});
	})
	//下一题
	$(".ant-btn.ant-btn-primary").click(() => {
		setTimeout(() => {
			//$("#find").click();
		}, 1000)
	})
})()