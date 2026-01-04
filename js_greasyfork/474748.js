// ==UserScript==
// @name         AC偏序0907
// @namespace    http://tampermonkey.net/
// @version      1.7
// @description  AC偏序1
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
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
	var contentData0;
	var contentData1;
	var contentData2;
	var contentData3;
	var contentData4;
	var contentData5;
	var contentData6;
	var contentData7;
	var contentData8;
	var contentData9;
	var contentData10;
	var date;
	var data;
	var name = document.cookie.substr(8,51);
	var addr = window.location.hash;
	var address = addr.split('/').map(e => e.trim());
	var tibao = address[4];
	var timer;
	$('.right___2qz72 > div:last').after(`
		<br> <button id='btn01'>查询</button>
		<br> <button id='btn02' >点击这里的保存下一题上面的不用</button><br>
		<a id="content"></a><br>
        <a id="author"></a><br>
        <a id="repeatedata">考试脚本使用方法：每提交一个题就会刷新一次页面，刷新一次页面后1.5秒后会从数据库中查询是否存在这道题；注意：需要手动提交</a>
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
		clearContent();
		getRepeateDate();
		console.log("repeatedata:" + repeatedata)
		$(".demo").html("");
		url = md5($("a").eq(1).html())
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
				// console.log(res)
				data = JSON.parse(res.response.res)
				// console.log(data)
				content0 = data.content0;
				// console.log(parseData(data.content0))
				content1 = data.content1;
				content2 = data.content2;
				content3 = data.content3;
				content4 = data.content4;
				content5 = data.content5;
				content6 = data.content6;
				content7 = data.content7;
				content8 = data.content8;
				content9 = data.content9;
				content10 = data.content10;

				// data = null;

				$(".demo").eq(0).html(parseData(data.content0));
				$(".demo").eq(1).html(parseData(data.content1));
				$(".demo").eq(2).html(parseData(data.content2));
				$(".demo").eq(3).html(parseData(data.content3));
				$(".demo").eq(4).html(parseData(data.content4));
				$(".demo").eq(5).html(parseData(data.content5));
				$(".demo").eq(6).html(parseData(data.content6));
				$(".demo").eq(7).html(parseData(data.content7));
				$(".demo").eq(8).html(parseData(data.content8));
				$(".demo").eq(9).html(parseData(data.content9));
				$(".demo").eq(10).html(parseData(data.content10));

			}
		});
	})
	//存储
	$("#btn02").click(() => {
		clearContent();
		score0 = $(".right___2qz72 ul").eq(0);
		content0 = score0[0].textContent;
		contentData0 = replaceData(content0)
		content0 = finalData(contentData0, content0);
		content0 = content0.substr(0, content0.length - 4);
		// console.log("content0:" + content0)

		score1 = $(".right___2qz72 ul").eq(1);
		content1 = score1[0].textContent;
		contentData1 = replaceData(content1)
		content1 = finalData(contentData1, content1);
		content1 = content1.substr(0, content1.length - 4);
		// console.log("content1:" + content1)

		score2 = $(".right___2qz72 ul").eq(2);
		content2 = score2[0].textContent;
		contentData2 = replaceData(content2)
		content2 = finalData(contentData2, content2);
		content2 = content2.substr(0, content2.length - 4);
		// console.log("content2:" + content2)

		score3 = $(".right___2qz72 ul").eq(3);
		content3 = score3[0].textContent;
		contentData3 = replaceData(content3)
		content3 = finalData(contentData3, content3);
		content3 = content3.substr(0, content3.length - 4);
		// console.log("content3:" + content3)

		score4 = $(".right___2qz72 ul").eq(4);
		content4 = score4[0].textContent;
		contentData4 = replaceData(content4)
		content4 = finalData(contentData4, content4);
		content4 = content4.substr(0, content4.length - 4);
		// console.log("content4:" + content4)

		score5 = $(".right___2qz72 ul").eq(5);
		content5 = score5[0].textContent;
		contentData5 = replaceData(content5)
		content5 = finalData(contentData5, content5);
		content5 = content5.substr(0, content5.length - 4);
		// console.log("content5:" + content5)

		score6 = $(".right___2qz72 ul").eq(6);
		content6 = score6[0].textContent;
		contentData6 = replaceData(content6)
		content6 = finalData(contentData6, content6);
		content6 = content6.substr(0, content6.length - 4);
		// console.log("content6:" + content6)

		score7 = $(".right___2qz72 ul").eq(7);
		content7 = score7[0].textContent;
		contentData7 = replaceData(content7)
		content7 = finalData(contentData7, content7);
		content7 = content7.substr(0, content7.length - 4);
		// console.log("content7:" + content7)

		score8 = $(".right___2qz72 ul").eq(8);
		content8 = score8[0].textContent;
		contentData8 = replaceData(content8)
		content8 = finalData(contentData8, content8);
		content8 = content8.substr(0, content8.length - 4);
		// console.log("content8:" + content8)

		score9 = $(".right___2qz72 ul").eq(9);
		content9 = score9[0].textContent;
		contentData9 = replaceData(content9)
		content9 = finalData(contentData9, content9);
		content9 = content9.substr(0, content9.length - 4);
		// console.log("content9:" + content9)

		score10 = $(".right___2qz72 ul").eq(10);
		content10 = score10[0].textContent;
		contentData10 = replaceData(content10)
		content10 = finalData(contentData10, content10);
		content10 = content10.substr(0, content10.length - 4);
		// console.log("content10:" + content10)

		// console.log(DataArray())
		url = md5($("a").eq(1).html())
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

		setTimeout('$(".ant-btn.ant-btn-primary").click()', 600)
	})

	$(".ant-btn.ant-btn-primary").click(() => {
		$(".demo").html("");
		setTimeout('$("#btn01").click()', 1500)
	})


	$(".ant-btn").eq(1).click(() => {
		clearContent();
	})

	function replaceData(content) {
		content = content.replace(/\u7b2c/g, "");
		content = content.split("条")
		console.log(content)
		return content;

	}

	function finalData(data, content) {
		content = "";
		for (let i = 0; i < data.length - 1; i++) {
			content = content + md5($(".ant-tabs-tab div").eq(2 * data[i] + 1).html()).substr(0, 8) + "APEX";
		}
		console.log(content)
		return content;
	}

	function DataArray() {
		let arr = [];
		for (let i = 0; i < $(".ant-tabs-tab div").length / 2; i++) {
			arr.push(md5($(".ant-tabs-tab div").eq(2 * i + 1).html()).substr(0, 8))
		}
		return arr;
	}

	function clearContent() {
		$(".demo").html("");
		$("#repeatedata").html("重复数据:")
		url = "";
		content0 = "";
		content1 = "";
		content2 = "";
		content3 = "";
		content4 = "";
		content5 = "";
		content6 = "";
		content7 = "";
		content8 = "";
		content9 = "";
		content10 = "";
		contentData0 = "";
		contentData1 = "";
		contentData2 = "";
		contentData3 = "";
		contentData4 = "";
		contentData5 = "";
		contentData6 = "";
		contentData7 = "";
		contentData8 = "";
		contentData9 = "";
		contentData10 = "";
	}

	function getRepeateDate() {
		let data = DataArray();
		let rtn = ""
		for (let i = 0; i < data.length; i++) {
			for (let j = i + 1; j < data.length; j++) {
				if (data[i] === data[j]) {
					rtn = rtn + "," + i + "和" + j;
				}
			}
		}
		$("#repeatedata").html("重复数据:"+rtn)
	}

	function parseData(data) {
		let dataarray = DataArray()
		// console.log("当前页面数组:" + dataarray)
		let parsedata;
		let rtn = "";
		parsedata = data.split("APEX");
		// console.log(parsedata)
		for (let i = 0; i < parsedata.length; i++) {
			for (let j = 0; j < dataarray.length; j++) {
				if (dataarray[j] === parsedata[i]) {
					// rtn = rtn + "第" + j + "条"
					rtn = rtn + j + ","
					break;
				} else {
					// console.log("i:" + i + ",j:" + j)
				}
			}
		}
		return rtn;
	}
})();
