// ==UserScript==
// @name         短答案正式标注1123
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  短答案项目脚本
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/462699/%E7%9F%AD%E7%AD%94%E6%A1%88%E6%AD%A3%E5%BC%8F%E6%A0%87%E6%B3%A81123.user.js
// @updateURL https://update.greasyfork.org/scripts/462699/%E7%9F%AD%E7%AD%94%E6%A1%88%E6%AD%A3%E5%BC%8F%E6%A0%87%E6%B3%A81123.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var query;
	var score;
	var date;
	var author = "yjq";
	var content = "";
	var addr = window.location.hash;
	var address = addr.split('/').map(e => e.trim());
	var tibao = address[4];
	var timer;
	$('.right___3CKK1 > div:last').after(`
		<br> <button id='btn01'>查询</button>
		<br> <button id='btn02' >点击这里的保存下一题上面的不用</button><br>
		<a id="content"></a><br>
        <a id="author"></a><br>
        <a >考试脚本使用方法：每提交一个题就会刷新一次页面，刷新一次页面后1.5秒后会从数据库中查询是否存在这道题；注意：需要手动提交</a>
	`);


	// $(".ant-select-selection__choice__content").length



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
	//调用
	//var time1 = new Date().Format("yyyy-MM-dd");
	//var time2 = new Date().Format("yyyy-MM-dd HH:mm:ss");

	if (author == "测试") {
		alert("修改名字")
	}
	//监控按钮
	$(".ant-radio-input").click(function() {
		console.log($(".ant-radio-input").index($(this)));
		score = $(".ant-radio-input").index($(this));
	})
	//存
	$('#btn02').click(function() {
        $("#content").html("");
		query = $("pre").eq(0).html().substr(-15)+$("pre").eq(0).html().substr(0,5);
		date = new Date().Format("yyyy-MM-dd HH:mm:ss");
		console.log(query);
		console.log(date);
		if (score == 0 || score == 2) {
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8892/insert',
				nocache: true,
				data: `query=${query}&score=${score}&author=${author}&date=${date}&content=${content}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
		} else {
			content = "";
			for (var i = 0; i < $(".ant-select-selection__choice__content").length; i++) {
				content = content + "第" + (i + 1) + "个:" + $(".ant-select-selection__choice__content").eq(i)
					.html() + ";    ";
			}
			console.log(content);

			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:8892/insert',
				nocache: true,
				data: `query=${query}&score=${score}&author=${author}&date=${date}&content=${content}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});


		}

		setTimeout('$(".ant-btn.ant-btn-primary").click()', 200)
	});

	//取
	$("#btn01").click(() => {
		$("#content").html("");
		query = $("pre").eq(0).html().substr(-15)+$("pre").eq(0).html().substr(0,5);
		console.log(query);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:8892/find',
			nocache: true,
			responseType: "json",
			data: `query=${query}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				$('.ant-radio-input').eq(res.response.score).click();
				$("#content").html(res.response.content);
				$("#author").html("做题人:" + res.response.author);
				if (res.response.score == 0 || res.response.score == 2) {
					setTimeout(() => {
						$(".ant-btn.ant-btn-primary").click();
					}, 1000)
				}
			}
		});
	})
	//下一题
	$(".ant-btn.ant-btn-primary").click(() => {
		if (tibao < 399) {
			setTimeout(() => {
				location.reload();
			}, 1000)
		}
	})

	timer = setTimeout(() => {
		$('#btn01').click()
	}, 1500)


	/*键盘事件
	 *
	 */
	$(window).keydown((event) => {
		if (event.keyCode === 49) {
			$('#btn01').click();
		}
		if (event.keyCode === 32) {
			$('#btn02').click();
		}

	})
	// $("#btn02").click(()=>{clearTimeout(timer)})
	// Your code here...
})();
