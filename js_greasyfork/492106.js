// ==UserScript==
// @name         0410文档质量重启脚本老平台
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  文档质量
// @author       Nex
// @match        *://new-qishi.sm.cn/*
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/492106/0410%E6%96%87%E6%A1%A3%E8%B4%A8%E9%87%8F%E9%87%8D%E5%90%AF%E8%84%9A%E6%9C%AC%E8%80%81%E5%B9%B3%E5%8F%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/492106/0410%E6%96%87%E6%A1%A3%E8%B4%A8%E9%87%8F%E9%87%8D%E5%90%AF%E8%84%9A%E6%9C%AC%E8%80%81%E5%B9%B3%E5%8F%B0.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var url;
	var num;
	var name = "Nex";
	var dateTime;
	var remark;
	var score;


	// setTimeout(() => {
	// 	$(
	// 		"#APP-ROOT > section > main > div > div > div > form > div.ant-row.ant-form-item.radio-list-form > div > div:last"
	// 	).after(`
	// 			<button class="button_zdy"id='btn01'>按钮</button>

	// 		   	`);
	// }, 2000)


	$(".header.header-light.clearfix > img").after(`
				<button class="button zdy" id='btn01' >0模糊</button>
				<button class="button zdy" id='btn02' >0排版</button>
				<button class="button zdy" id='btn03' >0题文</button>
				<button class="button zdy" id='btn04' >0其他</button>
				<button class="button zdy" id='btn05' >0首排</button>
				<button class="button zdy" id='btn06' >0首模</button>
			
				<button class="button zdy" id='btn07' >1模糊</button>
				<button class="button zdy" id='btn08' >1排版</button>
				<button class="button zdy" id='btn09' >1题文</button>
				<button class="button zdy" id='btn10' >1其他</button>
				<button class="button zdy" id='btn11' >1首排</button>
				<button class="button zdy" id='btn12' >1首模</button>
			
				<button class="button zdy" id='btn13' >2分题</button>
				<button class="button zdy" id='btn14' >3分题</button>
				<button class="button zdy" id='btn15' >废弃</button>
				<button class="button zdy" id='btn16' >查询本题</button>
			   	`);
	$(".header.header-light.clearfix ").after(`
						<a id="daan">本题答案</a>
					   	`);


	document.getElementById("btn01").style.color = "red";
	document.getElementById("btn02").style.color = "red";
	document.getElementById("btn03").style.color = "red";
	document.getElementById("btn04").style.color = "red";
	document.getElementById("btn05").style.color = "red";
	document.getElementById("btn06").style.color = "red";
	document.getElementById("btn07").style.color = "red";
	document.getElementById("btn08").style.color = "red";
	document.getElementById("btn09").style.color = "red";
	document.getElementById("btn10").style.color = "red";
	document.getElementById("btn11").style.color = "red";
	document.getElementById("btn12").style.color = "red";
	document.getElementById("btn13").style.color = "red";
	document.getElementById("btn14").style.color = "red";
	document.getElementById("btn15").style.color = "red";
	document.getElementById("btn16").style.color = "red";

	setInterval(()=>{
		find();
	},4000)
	/**
	 * 获取基础信息
	 */
	function getBaseInfo() {
		//序号
		num = $(".task-text").eq(0).html();
		console.log("序号:" + $(".task-text").eq(0).html())
		//网址并md5加密
		url = md5($("a:contains('URL')").eq(0).attr("href"))
		console.log("网址:" + $("a:contains('URL')").eq(0).attr("href"))
		//时间
		dateTime = new Date().Format("yyyy-MM-dd HH:mm:ss");
		console.log("做题时间:" + dateTime)

	}

	/**
	 * 清除基础信息
	 */
	function clearBaseInfo() {
		//序号
		num = null;
		//网址
		url = null;
		//时间
		dateTime = null;
		//分数
		score = null;
		//备注
		remark = null;
		
		$("#daan").html('')
	}

	/**
	 * 保存
	 */
	function save() {
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9017/insert',
			nocache: true,
			data: `url=${url}&num=${num}&score=${score}&name=${name}&remark=${remark}&dateTime=${dateTime}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
		});
	}

	/**
	 * 查询
	 */
	function find() {
		console.log("查询一次")
		clearBaseInfo();
		getBaseInfo();
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9017/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				let data01 = JSON.parse(res.response.res)
				console.log(data01)
				let str = "答案:" + data01.score + ";<br>备注:<br>" + data01.remark +
					";<br>序号:" + data01.num + ";<br>做题人:" + data01.name +
					";<br>做题时间:<br>"+
				data01.dateTime;
				$("#daan").html(str)
			}
		});
	}


	$("#btn01").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 0;
		remark = "模糊";
		save();
		//点击
		$(".ant-radio-input").eq(0).click()
		// setTimeout(() => {
		// 	$("label > span:contains('模糊')").eq(0).click()
		// }, 500)
	})

	$("#btn02").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 0;
		remark = '排版质量';
		save();
		//点击
		$(".ant-radio-input").eq(0).click()
		// setTimeout(() => {
		// 	$("label > span:contains('排版质量')").eq(0).click()
		// }, 500)
	})

	$("#btn03").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 0;
		remark = '题文不符'
		save();
		//点击
		$(".ant-radio-input").eq(0).click()
		// setTimeout(() => {
		// 	$("label > span:contains('题文不符')").eq(0).click()
		// }, 500)
	})

	$("#btn04").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 0;
		remark = document.getElementById("input_1").value;
		save();
		//点击
		$(".ant-radio-input").eq(0).click()
		// setTimeout(() => {
		// 	$("label > span:contains('其他另外备注')").eq(0).click()
		// }, 500)
	})

	$("#btn05").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 0;
		remark = '排版质量出现在首页';
		save();
		//点击
		$(".ant-radio-input").eq(0).click()
		// setTimeout(() => {
		// 	$("label > span:contains('排版质量出现在首页')").eq(0).click()
		// }, 500)
	})

	$("#btn06").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 0;
		remark = '模糊问题出现在首页'
		save();
		//点击
		$(".ant-radio-input").eq(0).click()
		// setTimeout(() => {
		// 	$("label > span:contains('模糊问题出现在首页')").eq(0).click()
		// }, 500)
	})

	$("#btn07").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 1;
		remark = '模糊'
		save();
		//点击
		$(".ant-radio-input").eq(1).click()
		// setTimeout(() => {
		// 	$("label > span:contains('模糊')").eq(1).click()
		// }, 500)
	})

	$("#btn08").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 1;
		remark = '排版质量'
		save();
		//点击
		$(".ant-radio-input").eq(1).click()
		// setTimeout(() => {
		// 	$("label > span:contains('排版质量')").eq(2).click()
		// }, 500)
	})

	$("#btn09").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 1;
		remark = '题文不符'
		save();
		//点击

		$(".ant-radio-input").eq(1).click()
		// setTimeout(() => {
		// 	$("label > span:contains('题文不符')").eq(1).click()
		// }, 500)
	})

	$("#btn10").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 1;
		remark = document.getElementById("input_1").value;
		save();
		//点击

		$(".ant-radio-input").eq(1).click()
		// setTimeout(() => {
		// 	$("label > span:contains('其他另外备注')").eq(1).click()
		// }, 500)
	})

	$("#btn11").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 1;
		remark = '排版质量出现在首页'
		save();
		//点击

		$(".ant-radio-input").eq(1).click()
		// setTimeout(() => {
		// 	$("label > span:contains('排版质量出现在首页')").eq(1).click()
		// }, 500)
	})

	$("#btn12").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 1;
		remark = '模糊问题出现在首页'
		save();
		//点击

		$(".ant-radio-input").eq(1).click()
		// setTimeout(() => {
		// 	$("label > span:contains('模糊问题出现在首页')").eq(1).click()
		// }, 500)
	})

	$("#btn13").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 2;
		remark = document.getElementById("input_1").value;
		save();
		//点击

		$(".ant-radio-input").eq(2).click()

	})

	$("#btn14").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 3;
		remark = document.getElementById("input_1").value;
		save();
		//点击

		$(".ant-radio-input").eq(3).click()

	})

	$("#btn15").click(() => {
		//清除之前的信息
		clearBaseInfo();
		//获取基础信息
		getBaseInfo();
		//保存
		score = 4;
		remark = document.getElementById("input_1").value;
		save();
		//点击
		$(".ant-radio-input").eq(4).click()

	})
	
	$("#btn16").click(() => {
		find();
	})
	
	// $(".ant-btn.ant-btn-primary.ant-btn-lg").click(()=>{
	// 	// $("#daan").html("本题答案")
	// 	// setTimeout(()=>{
	// 	// 	find();
	// 	// },500)
	// 	alert("111")
	// })
	

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

})()