// ==UserScript==
// @name         pc_landingpage考试脚本0822
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  pc_landingpage
// @author       Nex
// @match        http://discover.sm.cn/2/
// @require      https://libs.baidu.com/jquery/2.1.4/jquery.min.js
// @grant        GM_xmlhttpRequest
// @license      Nex
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/474022/pc_landingpage%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC0822.user.js
// @updateURL https://update.greasyfork.org/scripts/474022/pc_landingpage%E8%80%83%E8%AF%95%E8%84%9A%E6%9C%AC0822.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var url;
	var name = "zh";
	var date;
	var score;
	var abandonReason;
	var remark;
	var pageType = null;
	var leval1Page = "";
	var leval2Page;
	var pageType2 = null;

	$('.right___128Wr > div:last').after(`
		<br> <button id='find'>查询本题</button>
		<br> <button id='_save' >点击这里的保存下一题上面的不用</button><br>
		<br> <button id='dddd' >点点点</button><br>
	   	`);

	$('.right___128Wr > div:last').after(`
		<button class="button_zdy"id='pcPage'>PC页</button>
		<button class="button_zdy"id='mobliePage'>mobile页</button><br>
	   	`);


	// $(".button_zdy").width(80)
	// $(".button_zdy").height(40)

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
		url = $("a").eq(0).html().substr(-20)
		date = new Date().Format("yyyy-MM-dd HH:mm:ss");
		console.log("url:" + url)
		console.log("date:" + date)
	}

	function clearBasicInfor() {
		url = "";
		date = "";
		score = null;
		abandonReason = null;
		remark = null;
		pageType = null;
		pageType2 = null;
		leval1Page = "";
		leval2Page = null;
	}


	//下一题
	$(".ant-btn.ant-btn-primary").click(() => {
		clearBasicInfor();
		// setTimeout(() => {
		// 	$("#find").click();
		// }, 1000)
	})
	//上一题
	$(".ant-btn").eq(0).click(()=>{
		clearBasicInfor();
	})

	$("#btn01").click(() => {
		getAbanDonReason();
		getRemark();
		getLevalPageContent()
	})

	//打分情况
	//0
	$('.ant-radio-input').eq(0).click(() => {
		score = 0;
		console.log(score);
	})
	//1
	$('.ant-radio-input').eq(1).click(() => {
		score = 1;
		console.log(score);
	})
	//2
	$('.ant-radio-input').eq(2).click(() => {
		score = 2;
		console.log(score);
	})
	//3
	$('.ant-radio-input').eq(3).click(() => {
		score = 3;
		console.log(score);
	})
	//4
	$('.ant-radio-input').eq(4).click(() => {
		score = 4;
		console.log(score);
	})
	//抛弃
	$('.ant-radio-input').eq(5).click(() => {
		score = 5;
		console.log(score);
	})
	//页面类型
	//pc页

	$('#pcPage').click(() => {
		$('.ant-radio-input').eq(6).click();
		pageType = 6;
		pageType2 = 6;
		console.log("pageType:" + pageType);
		console.log("pageType2:" + pageType2);
	})
	//mobile页
	$('#mobliePage').click(() => {
		$('.ant-radio-input').eq(7).click();
		pageType = 7;
		pageType2 = 7;
		console.log("pageType:" + pageType);
		console.log("pageType2:" + pageType2);
	})

	function getAbanDonReason() {
		abandonReason = "";
		abandonReason = $(".ant-select-selection-selected-value").eq(0).html();
		console.log("abandonReason:" + abandonReason)
	}

	function getRemark() {
		remark = "";
		if (score && score === 5) {
			remark = $(".ant-select-selection-selected-value").eq(1).html();
		} else {
			remark = $(".ant-select-selection-selected-value").eq(0).html();
		}
		console.log("remark:" + remark)
	}

	function getLevalPageContent() {
		leval1Page = "";
		var j = $(".ant-select-selection__choice__content").length
		var index = 0;
		for (; index < j; index++) {
			leval1Page = leval1Page + "," + $(".ant-select-selection__choice__content").eq(index).html()
		}
		// console.log(leval1Page)
		leval1Page = leval1Page.substr(1);
		console.log(leval1Page)
	}


	$("#_save").click(() => {
		getBasicInfor();
		getRemark();
		console.log("score:" + score);
		console.log("pageType:" + pageType);
		if (score === 5) {
			console.log("进入了抛弃情况")
			getAbanDonReason()
			leval1Page = "";
			leval2Page = "";
			pageType = null;
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:9015/insert',
				nocache: true,
				data: `url=${url}&score=${score}&abandonReason=${abandonReason}&remark=${remark}&pageType=${pageType}&leval1Page=${leval1Page}&leval2Page=${leval2Page}&date=${date}&name=${name}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
		} else {
			console.log("进入了非抛弃情况")
			console.log("pageType2:" + pageType2)
			getLevalPageContent();
			GM_xmlhttpRequest({
				method: "post",
				url: 'http://121.41.113.195:9015/insert',
				nocache: true,
				data: `url=${url}&score=${score}&abandonReason=${abandonReason}&remark=${remark}&pageType=${pageType2}&leval1Page=${leval1Page}&leval2Page=${leval2Page}&date=${date}&name=${name}`,
				headers: {
					"Content-Type": "application/x-www-form-urlencoded"
				},
			});
		}
		setTimeout(()=>{
			$(".ant-btn.ant-btn-primary").click();
		},1000)
	})

	function handleLevalPageData(data) {
		var arr = data.split(",")
		return arr;
	}

	//取
	$("#find").click(() => {
		getBasicInfor();
		GM_xmlhttpRequest({
			method: "post",
			url: 'http://121.41.113.195:9015/find',
			nocache: true,
			responseType: "json",
			data: `url=${url}`,
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			onload: function(res) {
				let data01 = JSON.parse(res.response.res)
				console.log(data01.remark)
				if (data01.score === 5) {
					//抛弃情况
					$('.ant-radio-input').eq(5).click();
					//备注
					setTimeout(() => {
						$(".ant-select-selection__rendered").eq(1).click()
						$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root li:contains("' +
							data01.remark + '")').click()
					}, 200)
					//抛弃原因
					setTimeout(() => {
						$(".ant-select-selection__rendered").eq(0).click()
						$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root li:contains("' +
							data01.abandonReason + '")').click()
					}, 400)
				} else {
					//非抛弃情况
					$('.ant-radio-input').eq(data01.score).click();
					setTimeout(()=>{
						$('.ant-radio-input').eq(data01.pageType).click();
					},100)
					
					//备注
					setTimeout(() => {
						$(".ant-select-selection__rendered").eq(0).click()
						$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root li:contains("' +
							data01.remark + '")').click()
					}, 200)
					var dd = handleLevalPageData(data01.leval1Page);
					console.log(dd)
					//一级页面
					setTimeout(() => {
						$(".ant-select-selection__rendered").eq(1).click()
						setTimeout(()=>{
							$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root li:contains("' +
								dd[0] + '")').click()
							$("#ddd").click();
							
							//二级页面
							setTimeout(() => {
								// for (let i = 1; i < dd.length; i++) {
									$(".ant-select-selection__rendered").eq(2).click()
									// for(let a = 0;a<6;a++){
									// 	$(".anticon.anticon-close.ant-select-remove-icon").eq(1).click()
									// }
									$(".anticon.anticon-close.ant-select-remove-icon").eq(1).click()
									$(".anticon.anticon-close.ant-select-remove-icon").eq(2).click()
									$(".anticon.anticon-close.ant-select-remove-icon").eq(3).click()
									$(".anticon.anticon-close.ant-select-remove-icon").eq(4).click()
									$(".anticon.anticon-close.ant-select-remove-icon").eq(5).click()
									$(".anticon.anticon-close.ant-select-remove-icon").eq(6).click()
									setTimeout(()=>{
										$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root li:contains("' +
											dd[1] + '")').click()
											console.log("dd:"+dd[1])
									},1000)
								
								// }
							}, 1000)
						},200)
						
					}, 300)
					
				
					// //二级页面
					// setTimeout(() => {
					// 	// for (let i = 1; i < dd.length; i++) {
					// 		$(".ant-select-selection__rendered").eq(2).click()
					// 		setTimeout(()=>{
					// 			$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root li:contains("' +
					// 				dd[1] + '")').click()
					// 				console.log("dd:"+dd[1])
					// 				$("#ddd").click();
					// 				//一级页面
					// 				setTimeout(() => {
					// 					$(".ant-select-selection__rendered").eq(1).click()
					// 					setTimeout(()=>{
					// 						$('.ant-select-dropdown-menu.ant-select-dropdown-menu-root li:contains("' +
					// 							dd[0] + '")').click()
					// 						$("#ddd").click();
										
					// 					},200)
										
					// 				}, 300)
					// 		},200)
						
					// 	// }
					// }, 300)
				}
			}
		});
	})
})()