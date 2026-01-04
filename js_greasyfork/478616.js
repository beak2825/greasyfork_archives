// ==UserScript==
// @name         1030query维度考试脚本
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  对query纬度项目进行辅助标注
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/478616/1030query%E7%BB%B4%E5%BA%A6%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/478616/1030query%E7%BB%B4%E5%BA%A6%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==


(function() {
	'use strict';
	var name = "zh";
	var url = md5($(".ant-descriptions-item-content div").eq(0).html())
	var date;
	var data;
	var authority;
	var contentization;
	var timeInterval;
	var addr = window.location.hash;
	var address = addr.split('/').map(e => e.trim());
	var package1 = address[3];
	var question_num;
	var sign = "0F4DBE309348718E246F4566BBB766021"

	$('.right___2NQhQ > div:last').after(`
	<div id="dd">
	<button id='btn01'>7</button>
	<button id='btn02'>4</button>
	<button id='btn03'>1</button>
	<button id='btn04'>0</button>
	<br>
	<button id='btn05'>2</button>
	<button id='btn06'>1</button>
	<button id='btn07'>0</button>
	<button id='btn10'>🐶</button>
	<br>
	<button id='btn21'>7+0</button>
	<button id='btn22'>4+2</button>
	<button id='btn23'>0+0</button>
	<button id='btn24'>1+1</button>
	<button id='btn29'>7+1</button>
	<button id='btn31'>4+0</button>
	<br>
	<button id='btn25'>1+2</button>
	<button id='btn26'>0+1</button>
	<button id='btn27'>0+2</button>
	<button id='btn28'>4+1</button>
	<button id='btn30'>7+2</button>
	<button id='btn32'>1+0</button>
	</div>
	<br> <button id='btn08' class="gnbtn">查询一次</button>
	<button id='btn09' class="gnbtn">保存下一题</button><br>
	<button id='btn11' class="gnbtn">开始查询</button>
	<button id='btn12' class="gnbtn">结束查询</button><br>
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

	$("#dd button").width(50);
	$("#dd button").height(40);


	$(".gnbtn").width(120);
	$(".gnbtn").height(60);


	$("#btn01").click(() => {
		authority = 0;
		$('.ant-radio-input').eq(authority).click();
	})

	$("#btn02").click(() => {
		authority = 1;
		$('.ant-radio-input').eq(authority).click();
	})

	$("#btn03").click(() => {
		authority = 2;
		$('.ant-radio-input').eq(authority).click();
	})

	$("#btn04").click(() => {
		authority = 3;
		$('.ant-radio-input').eq(authority).click();
	})

	$("#btn05").click(() => {
		contentization = 4;
		$('.ant-radio-input').eq(contentization).click();
	})

	$("#btn06").click(() => {
		contentization = 5;
		$('.ant-radio-input').eq(contentization).click();
	})

	$("#btn07").click(() => {
		contentization = 6;
		$('.ant-radio-input').eq(contentization).click();
	})


	// 保存
	$("#btn09").click(() => {
		url = md5($(".ant-descriptions-item-content div").eq(0).html())
		console.log(url);
		console.log(name);
		date = new Date().Format("yyyy-MM-dd HH:mm:ss");
		console.log(date);
		//验证
		if (authority >= 0 && authority <= 3 && contentization >= 4 && contentization <= 6) {
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:9011/insert',
				nocache: true,
				data: `url=${url}&authority=${authority}&contentization=${contentization}&date=${date}&package=${package1}&name=${name}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
			setTimeout(() => {
				$(".ant-btn.ant-btn-primary").click();
			}, 400);
		} else {
			alert("刷新页面重做这道题。")
		}
	})
	// 下一题
	$(".ant-btn.ant-btn-primary").click(() => {
		authority = undefined;
		contentization = undefined;
		setTimeout(function(){
			$("#btn08").click()
		},1000)
	})
	// 查询一次
	$("#btn08").click(()=>{
		url = md5($(".ant-descriptions-item-content div").eq(0).html())
		console.log("本次查询的url:    " + url);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9011/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				data = res.response.res
				data =  JSON.parse(data);
				console.log(data)

				authority = data.authority;
				contentization = data.contentization;
				$('.ant-radio-input').eq(authority).click();
				$('.ant-radio-input').eq(contentization).click();
				setTimeout(() => {
					//$(".ant-btn.ant-btn-primary").click();
				}, 400);
			}
		});
	})

	$("#btn10").click(()=>{
		url = md5($(".ant-descriptions-item-content div").eq(0).html())
		console.log("本次查询的url:    " + url);
		addr = window.location.hash;
		address = addr.split('/').map(e => e.trim());
		question_num = address[4];
		console.log(question_num);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9011/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				data = res.response.res
				data =  JSON.parse(data);
				console.log(data)


					authority = data.authority;
					contentization = data.contentization;
					$('.ant-radio-input').eq(authority).click();
					$('.ant-radio-input').eq(contentization).click();

					if(question_num < 398){
						setTimeout(() => {
							$(".ant-btn.ant-btn-primary").click();
						}, 400);
					}else{
						clearInterval(timeInterval);
						console.log("题号超过98")
					}



			}
		});
	})

	$("#btn21").click(()=>{
		$("#btn01").click();
		$("#btn07").click();
		//保存
		$("#btn09").click();
	})

	$("#btn22").click(()=>{
		$("#btn02").click();
		$("#btn05").click();
		//保存
		$("#btn09").click();
	})

	$("#btn23").click(()=>{
		$("#btn04").click();
		$("#btn07").click();
		//保存
		$("#btn09").click();
	})

	$("#btn24").click(()=>{
		$("#btn03").click();
		$("#btn06").click();
		//保存
		$("#btn09").click();
	})

	$("#btn25").click(()=>{
		$("#btn03").click();
		$("#btn05").click();
		//保存
		$("#btn09").click();
	})

	$("#btn26").click(()=>{
		$("#btn04").click();
		$("#btn06").click();
		//保存
		$("#btn09").click();
	})

	$("#btn27").click(()=>{
		$("#btn04").click();
		$("#btn05").click();
		//保存
		$("#btn09").click();
	})

	$("#btn28").click(()=>{
		$("#btn02").click();
		$("#btn06").click();
		//保存
		$("#btn09").click();
	})

	$("#btn29").click(()=>{
		$("#btn01").click();
		$("#btn06").click();
		//保存
		$("#btn09").click();
	})

	$("#btn30").click(()=>{
		$("#btn01").click();
		$("#btn05").click();
		//保存
		$("#btn09").click();
	})

	$("#btn31").click(()=>{
		$("#btn02").click();
		$("#btn07").click();
		//保存
		$("#btn09").click();
	})

	$("#btn32").click(()=>{
		$("#btn03").click();
		$("#btn07").click();
		//保存
		$("#btn09").click();
	})
	//开始查询
	$("#btn11").click(()=>{
		clearInterval(timeInterval);
		timeInterval = setInterval(()=>{
			$("#btn10").click()
		},4000)
	})
	//结束查询
	$("#btn12").click(()=>{
		clearInterval(timeInterval);
	})


})();