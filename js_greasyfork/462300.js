// ==UserScript==
// @name         0323网页内容质量考试脚本通用最新1.6
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  对网页内容质量项目进行辅助标注
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @require      https://cdn.bootcss.com/blueimp-md5/2.12.0/js/md5.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/462300/0323%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E8%B4%A8%E9%87%8F%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC%E9%80%9A%E7%94%A8%E6%9C%80%E6%96%B016.user.js
// @updateURL https://update.greasyfork.org/scripts/462300/0323%E7%BD%91%E9%A1%B5%E5%86%85%E5%AE%B9%E8%B4%A8%E9%87%8F%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC%E9%80%9A%E7%94%A8%E6%9C%80%E6%96%B016.meta.js
// ==/UserScript==


(function() {
	'use strict';
	var name = "测试";
	var url = $("img").eq(0).attr("src");
	var date;
	var data;
	var sign = "0F4DBE309348718E246F4566BBB766021"

	var article_title_fluent;
	//article_title是否通顺
	$(".ant-descriptions-item-content").eq(3).append(`
		<button id='btn01' class="btn">通顺</button>
		<button id='btn02' class="btn">不通顺</button>
		<button id='btn03' class="btn">空白</button>
		<button id='btn04' class="btn">乱码</button>
		<button id='default' >默认有图片情况</button>
		<button id='default_no_pic' >默认无图片情况</button>
	`);
	var content_relevant;
	//content是否包含无关内容
	$(".ant-descriptions-item-content").eq(4).append(`
		<button id='btn05' class="btn">content包含无关内容</button>
		<button id='btn06' class="btn">content不包含无关内容</button>
		<button id='btn07' class="btn">空白</button>
		<button id='btn08' class="btn">乱码</button>
	`);
	var article_title_content;
	//article_title和content是否相关
	$(".ant-descriptions-item-content").eq(5).append(`
		<button id='btn09' class="btn">article_title和content相关</button>
		<button id='btn10' class="btn">article_title和content不相关</button>
		<button id='btn11' class="btn">空白</button>
		<button id='btn12' class="btn">乱码</button>
	`);
	var include_picture;
	//文章主体内容是否包含图片
	$(".ant-descriptions-item-content").eq(6).append(`
		<button id='btn13' class="btn">包含图片</button>
		<button id='btn14' class="btn">不包含图片</button>
		<button id='shuo' >-1 + 抛弃情况</button>
	`);
	var content_picture_relevant;
	//文章中图文是否相关
	$(".ant-descriptions-item-content").eq(7).append(`
		<button id='btn15' class="btn">图文相关</button>
		<button id='btn16' class="btn">图文不相关</button>
		<button id='btn17' class="btn">无图</button>
		<button id='btn18' class="btn">图片失效</button>
	`);
	var bread_crumb_relevant;
	//bread_crumb与文章主体内容是否相关
	$(".ant-descriptions-item-content").eq(8).append(`
		<button id='btn19' class="btn">面包屑与快照主体内容相关</button>
		<button id='btn20' class="btn">面包屑与快照主体内容不相关</button>
		<button id='btn21' class="btn">空白</button>
		<button id='btn22' class="btn">乱码</button>
	`);
	var content_and_main_content;
	//content和文章主体内容是否一致
	$(".ant-descriptions-item-content").eq(9).append(`
		<button id='btn23' class="btn">content与快照主体内容一致</button>
		<button id='btn24' class="btn">content与快照主体内容不一致</button>
		<button id='btn25' class="btn">空白</button>
		<button id='btn26' class="btn">乱码</button>
	`);
	var quality_score;
	//quality_score
	$(".ant-descriptions-item-content").eq(10).append(`
		<button id='btn27' class="btn">-1</button>
		<button id='btn28' class="btn">0 </button>
		<button id='btn29' class="btn">1 </button>
		<button id='btn30' class="btn">2 </button>
		<button id='btn31' class="btn">3 </button>
		<button id='findzh' >张恒查询</button>
        <button id='findyw' >杨文查询</button>
        <button id='findhrx' >黄荣祥查询</button>
        <button id='findhwh' >黄伟浩查询</button>
        
	`);
	var abandon;
	//抛弃
	$(".ant-descriptions-item-content").eq(11).append(`
		<button id='btn32' class="btn">抛弃</button>
		<button id='btn33' class="btn">不抛弃</button>
		<button id='btn34'>保存下一题：这个按键会保存数据到数据库，自带的下一题按钮不会</button>
	`);
	//默认有图片情况
	$("#default").click(() => {
		setTimeout(() => {
			// <button id='btn01'>通顺</button>
			$('.ant-radio-input').eq(1 - 1).click();
			// <button id='btn06'>否</button>
			$('.ant-radio-input').eq(6 - 1).click();
			// <button id='btn09'>是</button>
			$('.ant-radio-input').eq(9 - 1).click();
			// <button id='btn13'>是</button>
			$('.ant-radio-input').eq(13 - 1).click();
			// <button id='btn15'>是</button>
			$('.ant-radio-input').eq(15 - 1).click();
			// <button id='btn19'>是</button>
			$('.ant-radio-input').eq(19 - 1).click();
			// <button id='btn23'>是 </button>
			$('.ant-radio-input').eq(23 - 1).click();
			// <button id='btn29'>1 </button>
			$('.ant-radio-input').eq(29 - 1).click();
			// <button id='btn33'>否</button>
			$('.ant-radio-input').eq(33 - 1).click();
			
			article_title_fluent = 1;
			content_relevant = 6;
			article_title_content = 9;
			include_picture = 13;
			content_picture_relevant = 15;
			bread_crumb_relevant = 19;
			content_and_main_content = 23;
			quality_score = 29;
			abandon = 33;
		}, 400)
	})
	
	//-1+抛弃情况
	$("#shuo").click(()=>{
		// <button id='btn29'>1 </button>
		$('.ant-radio-input').eq(27 - 1).click();
		// <button id='btn33'>否</button>
		$('.ant-radio-input').eq(32 - 1).click();
		quality_score = 27;
		abandon = 32;
	})
	
	//默认无图片情况
	$("#default_no_pic").click(() => {
		setTimeout(() => {
			// <button id='btn01'>通顺</button>
			$('.ant-radio-input').eq(1 - 1).click();
			// <button id='btn06'>否</button>
			$('.ant-radio-input').eq(6 - 1).click();
			// <button id='btn09'>是</button>
			$('.ant-radio-input').eq(9 - 1).click();
			// <button id='btn13'>是</button>
			$('.ant-radio-input').eq(14 - 1).click();
			// <button id='btn15'>是</button>
			$('.ant-radio-input').eq(17 - 1).click();
			// <button id='btn19'>是</button>
			$('.ant-radio-input').eq(19 - 1).click();
			// <button id='btn23'>是 </button>
			$('.ant-radio-input').eq(23 - 1).click();
			// <button id='btn29'>1 </button>
			$('.ant-radio-input').eq(29 - 1).click();
			// <button id='btn33'>否</button>
			$('.ant-radio-input').eq(33 - 1).click();
			
			article_title_fluent = 1;
			content_relevant = 6;
			article_title_content = 9;
			include_picture = 14;
			content_picture_relevant = 17;
			bread_crumb_relevant = 19;
			content_and_main_content = 23;
			quality_score = 29;
			abandon = 33;
		}, 400)
	})
	
	
	if(name == "测试"){
		alert("需要修改姓名")
	}
	setInterval(()=>{
		// $('#findzh').click()
	},3000)

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
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 -
			RegExp.$1
			.length));
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1
				.length == 1) ? (o[
				k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		return fmt;
	}

	console.log(md5("zh"));

	// 保存下一题
	$("#btn34").click(() => {
		url = name + $("img").eq(0).attr("src");
		console.log(url);
		console.log(name);
		date = new Date().Format("yyyy-MM-dd HH:mm:ss");
		console.log(date);
		//验证
		if (url) {
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:9999/insert',
				nocache: true,
				data: `url=${url}&name=${name}&article_title_fluent=${article_title_fluent}&content_relevant=${content_relevant}&article_title_content=${article_title_content}&include_picture=${include_picture}&content_picture_relevant=${content_picture_relevant}&bread_crumb_relevant=${bread_crumb_relevant}&content_and_main_content=${content_and_main_content}&quality_score=${quality_score}&abandon=${abandon}&date=${date}`,
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
	//下一题
	$(".ant-btn.ant-btn-primary").click(()=>{
		article_title_fluent = undefined;
		content_relevant = undefined;
		article_title_content = undefined;
		include_picture = undefined;
		content_picture_relevant = undefined;
		bread_crumb_relevant = undefined;
		content_and_main_content = undefined;
		quality_score = undefined;
		abandon = undefined;
	});
	//上一题
	$(".ant-btn").eq(0).click(()=>{
		article_title_fluent = undefined;
		content_relevant = undefined;
		article_title_content = undefined;
		include_picture = undefined;
		content_picture_relevant = undefined;
		bread_crumb_relevant = undefined;
		content_and_main_content = undefined;
		quality_score = undefined;
		abandon = undefined;
		alert("狗日的黄荣祥提醒你，一定要把所有按钮都点击一遍")
	});
	
	
	
	$(".btn").click(function() {
		var num = $(".btn").index(this)
			++num;
		console.log("num: " + num)

		if (num && num >= 1 && num <= 4) {
			article_title_fluent = num;
			console.log("article_title_fluent: " + article_title_fluent)
			$('.ant-radio-input').eq(num - 1).click();
			num = -1;
		}
		if (num && num >= 5 && num <= 8) {
			content_relevant = num;
			console.log("content_relevant: " + content_relevant)
			$('.ant-radio-input').eq(num - 1).click();
			num = -1;
		}
		if (num && num >= 9 && num <= 12) {
			article_title_content = num;
			console.log("article_title_content: " + article_title_content)
			$('.ant-radio-input').eq(num - 1).click();
			num = -1;
		}
		if (num && num >= 13 && num <= 14) {
			include_picture = num;
			console.log("include_picture: " + include_picture)
			$('.ant-radio-input').eq(num - 1).click();
			num = -1;
		}
		if (num && num >= 15 && num <= 18) {
			content_picture_relevant = num;
			console.log("content_picture_relevant: " + content_picture_relevant)
			$('.ant-radio-input').eq(num - 1).click();
			num = -1;
		}
		if (num && num >= 19 && num <= 22) {
			bread_crumb_relevant = num;
			console.log("bread_crumb_relevant: " + bread_crumb_relevant)
			$('.ant-radio-input').eq(num - 1).click();
			num = -1;
		}
		if (num && num >= 23 && num <= 26) {
			content_and_main_content = num;
			console.log("content_and_main_content: " + content_and_main_content)
			$('.ant-radio-input').eq(num - 1).click();
			num = -1;
		}
		if (num && num >= 27 && num <= 31) {
			quality_score = num;
			console.log("quality_score: " + quality_score)
			$('.ant-radio-input').eq(num - 1).click();
			num = -1;
		}
		if (num && num >= 32 && num <= 33) {
			abandon = num;
			console.log("abandon: " + abandon)
			$('.ant-radio-input').eq(num - 1).click();
			num = -1;
		}
	})


	//张恒查询
	$('#findzh').click(() => {
		//$("#caozuoren").html("");
		url = "zh" + $("img").eq(0).attr("src");
		console.log(url);
		console.log(name);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9999/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				console.log(res.response.res)
				if (res.response.res == undefined) {
					$("#caozuoren").html("没有查到");
					$('#endFind').click();
				}
				data = JSON.parse(res.response.res)
				if (data) {
					if (data.abandon == 32) {
						$('.ant-radio-input').eq(data.quality_score - 1).click();
						quality_score = data.quality_score;
						$('.ant-radio-input').eq(32 - 1).click();
						abandon = data.abandon;
					} else {
						article_title_fluent = data.article_title_fluent;
						$('.ant-radio-input').eq(data.article_title_fluent - 1).click();
						content_relevant = data.content_relevant;
						$('.ant-radio-input').eq(data.content_relevant - 1).click();
						article_title_content = data.article_title_content;
						$('.ant-radio-input').eq(data.article_title_content - 1).click();
						include_picture = data.include_picture;
						$('.ant-radio-input').eq(data.include_picture - 1).click();
						content_picture_relevant = data.content_picture_relevant;
						$('.ant-radio-input').eq(data.content_picture_relevant - 1).click();
						bread_crumb_relevant = data.bread_crumb_relevant;
						$('.ant-radio-input').eq(data.bread_crumb_relevant - 1).click();
						content_and_main_content = data.content_and_main_content;
						$('.ant-radio-input').eq(data.content_and_main_content - 1).click();
						quality_score = data.quality_score;
						$('.ant-radio-input').eq(data.quality_score - 1).click();
						abandon = data.abandon;
						$('.ant-radio-input').eq(data.abandon - 1).click();
					}
					setTimeout(() => {
						$(".ant-btn.ant-btn-primary").click();
					}, 200)
				}
			}
		});
	})

	//杨文查询
	$('#findyw').click(() => {
		//$("#caozuoren").html("");
		url = "yw" + $("img").eq(0).attr("src");
		console.log(url);
		console.log(name);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9999/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				console.log(res.response.res)
				if (res.response.res == undefined) {
					$("#caozuoren").html("没有查到");
					$('#endFind').click();
				}
				data = JSON.parse(res.response.res)
				if (data) {
					if (data.abandon == 32) {
						$('.ant-radio-input').eq(data.quality_score - 1).click();
						quality_score = data.quality_score;
						$('.ant-radio-input').eq(32 - 1).click();
						abandon = data.abandon;
					} else {
						article_title_fluent = data.article_title_fluent;
						$('.ant-radio-input').eq(data.article_title_fluent - 1).click();
						content_relevant = data.content_relevant;
						$('.ant-radio-input').eq(data.content_relevant - 1).click();
						article_title_content = data.article_title_content;
						$('.ant-radio-input').eq(data.article_title_content - 1).click();
						include_picture = data.include_picture;
						$('.ant-radio-input').eq(data.include_picture - 1).click();
						content_picture_relevant = data.content_picture_relevant;
						$('.ant-radio-input').eq(data.content_picture_relevant - 1).click();
						bread_crumb_relevant = data.bread_crumb_relevant;
						$('.ant-radio-input').eq(data.bread_crumb_relevant - 1).click();
						content_and_main_content = data.content_and_main_content;
						$('.ant-radio-input').eq(data.content_and_main_content - 1).click();
						quality_score = data.quality_score;
						$('.ant-radio-input').eq(data.quality_score - 1).click();
						abandon = data.abandon;
						$('.ant-radio-input').eq(data.abandon - 1).click();
					}
					setTimeout(() => {
						//$(".ant-btn.ant-btn-primary").click();
					}, 200)
				}
			}
		});
	})

	//黄荣祥查询
	$('#findhrx').click(() => {
		//$("#caozuoren").html("");
		url = "hrx" + $("img").eq(0).attr("src");
		console.log(url);
		console.log(name);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9999/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				console.log(res.response.res)
				if (res.response.res == undefined) {
					$("#caozuoren").html("没有查到");
					$('#endFind').click();
				}
				data = JSON.parse(res.response.res)
				if (data) {
					if (data.abandon == 32) {
						$('.ant-radio-input').eq(data.quality_score - 1).click();
						quality_score = data.quality_score;
						$('.ant-radio-input').eq(32 - 1).click();
						abandon = data.abandon;
					} else {
						article_title_fluent = data.article_title_fluent;
						$('.ant-radio-input').eq(data.article_title_fluent - 1).click();
						content_relevant = data.content_relevant;
						$('.ant-radio-input').eq(data.content_relevant - 1).click();
						article_title_content = data.article_title_content;
						$('.ant-radio-input').eq(data.article_title_content - 1).click();
						include_picture = data.include_picture;
						$('.ant-radio-input').eq(data.include_picture - 1).click();
						content_picture_relevant = data.content_picture_relevant;
						$('.ant-radio-input').eq(data.content_picture_relevant - 1).click();
						bread_crumb_relevant = data.bread_crumb_relevant;
						$('.ant-radio-input').eq(data.bread_crumb_relevant - 1).click();
						content_and_main_content = data.content_and_main_content;
						$('.ant-radio-input').eq(data.content_and_main_content - 1).click();
						quality_score = data.quality_score;
						$('.ant-radio-input').eq(data.quality_score - 1).click();
						abandon = data.abandon;
						$('.ant-radio-input').eq(data.abandon - 1).click();
					}
					setTimeout(() => {
						//$(".ant-btn.ant-btn-primary").click();
					}, 200)
				}
			}
		});
	})

	//黄伟浩查询
	$('#findhwh').click(() => {
		//$("#caozuoren").html("");
		url = "hwh" + $("img").eq(0).attr("src");
		console.log(url);
		console.log(name);
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9999/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				console.log(res.response.res)
				if (res.response.res == undefined) {
					$("#caozuoren").html("没有查到");
					$('#endFind').click();
				}
				data = JSON.parse(res.response.res)
				if (data) {
					if (data.abandon == 32) {
						$('.ant-radio-input').eq(data.quality_score - 1).click();
						quality_score = data.quality_score;
						$('.ant-radio-input').eq(32 - 1).click();
						abandon = data.abandon;
					} else {
						article_title_fluent = data.article_title_fluent;
						$('.ant-radio-input').eq(data.article_title_fluent - 1).click();
						content_relevant = data.content_relevant;
						$('.ant-radio-input').eq(data.content_relevant - 1).click();
						article_title_content = data.article_title_content;
						$('.ant-radio-input').eq(data.article_title_content - 1).click();
						include_picture = data.include_picture;
						$('.ant-radio-input').eq(data.include_picture - 1).click();
						content_picture_relevant = data.content_picture_relevant;
						$('.ant-radio-input').eq(data.content_picture_relevant - 1).click();
						bread_crumb_relevant = data.bread_crumb_relevant;
						$('.ant-radio-input').eq(data.bread_crumb_relevant - 1).click();
						content_and_main_content = data.content_and_main_content;
						$('.ant-radio-input').eq(data.content_and_main_content - 1).click();
						quality_score = data.quality_score;
						$('.ant-radio-input').eq(data.quality_score - 1).click();
						abandon = data.abandon;
						$('.ant-radio-input').eq(data.abandon - 1).click();
					}
					setTimeout(() => {
						//$(".ant-btn.ant-btn-primary").click();
					}, 200)
				}
			}
		});
	})

})();
