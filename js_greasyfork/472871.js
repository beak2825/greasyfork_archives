// ==UserScript==
// @name         AC偏序0811
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  AC偏序
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      MIT
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/472871/AC%E5%81%8F%E5%BA%8F0811.user.js
// @updateURL https://update.greasyfork.org/scripts/472871/AC%E5%81%8F%E5%BA%8F0811.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var url;
	var score0;
	var score1;
	var score2;
	var score3;
	var score4;
	var score5;
	var score6;
	var score7;
	var score8;
	var score9;
	var score10;
	var content0;
	var content1;
	var content2;
	var content3;
	var content4;
	var content5;
	var content6;
	var content7;
	var content8;
	var content9;
	var content10;
	var date;
	var data;
	var name = "D8282F93C03DFB55";
	var addr = window.location.hash;
	var address = addr.split('/').map(e => e.trim());
	var tibao = address[4];
	var timer;
	$('.right___2qz72 > div:last').after(`
		<br> <button id='btn01'>查询</button>
		<br> <button id='btn02' >点击这里的保存下一题上面的不用</button><br>
		<a id="content"></a><br>
        <a id="author"></a><br>
        <a >考试脚本使用方法：每提交一个题就会刷新一次页面，刷新一次页面后1.5秒后会从数据库中查询是否存在这道题；注意：需要手动提交</a>
	`);

	$('.right___2qz72 > div').eq(6).after(`<a  class="demo"></a>`);
	$('.right___2qz72 > div').eq(7).after(`<a  class="demo"></a>`);
	$('.right___2qz72 > div').eq(8).after(`<a  class="demo"></a>`);
	$('.right___2qz72 > div').eq(9).after(`<a  class="demo"></a>`);
	$('.right___2qz72 > div').eq(10).after(`<a class="demo"></a>`);
	$('.right___2qz72 > div').eq(11).after(`<a class="demo"></a>`);
	$('.right___2qz72 > div').eq(12).after(`<a class="demo"></a>`);
	$('.right___2qz72 > div').eq(13).after(`<a class="demo"></a>`);
	$('.right___2qz72 > div').eq(14).after(`<a class="demo"></a>`);
	$('.right___2qz72 > div').eq(15).after(`<a class="demo"></a>`);
	$('.right___2qz72 > div').eq(16).after(`<a class="demo"></a><br>`);


	// $("a").eq(0).html()
	// $(".right___2qz72 > div > div").eq(2).html()
	// '恶劣-丢失核心词：'

	//日期
	Date.prototype.Format = function(fmt) {
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"H+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			"S": this.getMilliseconds() //毫秒
		};
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1
			.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[
				k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	//查询
	$("#btn01").click(() => {
		$(".demo").html("");
		url = $("a").eq(0).html();
		console.log(url);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9013/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				console.log(res.response)
				data = JSON.parse(res.response.res)
				console.log(data)
				// content0 = data.content0;
				// content1 = data.content1;
				// content2 = data.content2;
				// content3 = data.content3;
				// content4 = data.content4;
				// content5 = data.content5;
				// content6 = data.content6;
				// content7 = data.content7;
				// content8 = data.content8;
				// content9 = data.content9;
				// content10 = data.content10;
				
				$(".demo").eq(0).html(data.content0);
				$(".demo").eq(1).html(data.content1);
				$(".demo").eq(2).html(data.content2);
				$(".demo").eq(3).html(data.content3);
				$(".demo").eq(4).html(data.content4);
				$(".demo").eq(5).html(data.content5);
				$(".demo").eq(6).html(data.content6);
				$(".demo").eq(7).html(data.content7);
				$(".demo").eq(8).html(data.content8);
				$(".demo").eq(9).html(data.content9);
				$(".demo").eq(10).html(data.content10);
			}
		});
	})
	//存储
	$("#btn02").click(() => {
		score0 = $(".right___2qz72 ul").eq(0);
		content0 = score0[0].textContent;
		console.log("content0:" + content0)

		score1 = $(".right___2qz72 ul").eq(1);
		content1 = score1[0].textContent;
		console.log("content1:" + content1)

		score2 = $(".right___2qz72 ul").eq(2);
		content2 = score2[0].textContent;
		console.log("content2:" + content2)

		score3 = $(".right___2qz72 ul").eq(3);
		content3 = score3[0].textContent;
		console.log("content3:" + content3)

		score4 = $(".right___2qz72 ul").eq(4);
		content4 = score4[0].textContent;
		console.log("content4:" + content4)

		score5 = $(".right___2qz72 ul").eq(5);
		content5 = score5[0].textContent;
		console.log("content5:" + content5)

		score6 = $(".right___2qz72 ul").eq(6);
		content6 = score6[0].textContent;
		console.log("content6:" + content6)

		score7 = $(".right___2qz72 ul").eq(7);
		content7 = score7[0].textContent;
		console.log("content7:" + content7)

		score8 = $(".right___2qz72 ul").eq(8);
		content8 = score8[0].textContent;
		console.log("content8:" + content8)

		score9 = $(".right___2qz72 ul").eq(9);
		content9 = score9[0].textContent;
		console.log("content9:" + content9)

		score10 = $(".right___2qz72 ul").eq(10);
		content10 = score10[0].textContent;
		console.log("content10:" + content10)

		url = $("a").eq(0).html();
		date = new Date().Format("yyyy-MM-dd HH:mm:ss");

		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9013/insert',
			nocache: true,
			data: `url=${url}&content0=${content0}&content1=${content1}&content2=${content2}&content3=${content3}&content4=${content4}&content5=${content5}&content6=${content6}&content7=${content7}&content8=${content8}&content9=${content9}&content10=${content10}&name=${name}&date=${date}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
		
		setTimeout('$(".ant-btn.ant-btn-primary").click()', 200)
	})
	
	$(".ant-btn.ant-btn-primary").click(() => {
		$(".demo").html("");
		setTimeout('$("#btn01").click()', 1500)
	})

})();