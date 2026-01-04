// ==UserScript==
// @name         大麦抢票初版
// @namespace    http://99887766554433221100.cn/
// @version      6.8
// @description  大麦脚本--目前只能抢网页版的支持网页版的票都可以抢(bp/app除外)
// @author       香香 
// @match        https://m.damai.cn/shows/*
// @match        https://m.damai.cn/app/*
// @match        https://m.damai.cn/damai/*
// @license MIT
// @icon         data:image/png;base64,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
// @downloadURL https://update.greasyfork.org/scripts/472677/%E5%A4%A7%E9%BA%A6%E6%8A%A2%E7%A5%A8%E5%88%9D%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/472677/%E5%A4%A7%E9%BA%A6%E6%8A%A2%E7%A5%A8%E5%88%9D%E7%89%88.meta.js
// ==/UserScript==
 
(function() {
    'use strict';


var title = document.getElementsByTagName("title")[0].innerText;
		console.log(title);
		console.log("by:南香香    持续为你导航");

		if (title == "商品详情") {
			//alert("配置好时间，座位了，观影人，停留这个页面即可别最小化页面，切记手动提交订单")
			var myDate = new Date;
			var myVar = setInterval(function() {
				myDate = new Date;
				var now = myDate.getHours() + ":" + myDate.getMinutes() + ":" + myDate.getSeconds();
				var dateString = now.toString();
				console.log(now);
				if (dateString != "11:59:58") {
					//console.log(1111)
					var div=document.querySelector("#root > div > div.content > div.bui-dm-service-explain > div > div.service-container-left > div.notice-overflow");
					if(div!=null){
						div.innerHTML="配置好时间，座位了，观影人，停留这个页面即可别最小化页面";
						div.style.color="red";
						document.getElementsByClassName("buy__button")[0].innerHTML="等哈切记手动提交订单"
					}
				} else {
					clearInterval(myVar);
					var xx = setInterval(function() {
						document.getElementsByClassName("buy__button")[0].click();
						//选择位置按钮看台等位置
						//第一个位置为0开始以此类推
						var xuanding = document.getElementsByClassName("bui-dm-sku-card-item item-normal theme-normal")[2];
						if (xuanding == null) {
							console.log("慢了")
						} else {
							//
							xuanding.click();
							clearInterval(xx);


							//多张
							var renshu_fun = setInterval(function() {
								var renshu = document.querySelector(
									"body > div.bui-modal > div:nth-child(2) > div > div > div > div > div.bui-dm-sku-footer.theme-normal > div.bui-dm-sku-counter > div.number-edit > div:nth-child(3)"
								);
								var renshu_value = document.querySelector(
									"body > div.bui-modal > div:nth-child(2) > div > div > div > div > div.bui-dm-sku-footer.theme-normal > div.bui-dm-sku-counter > div.number-edit > div.number-info > div"
								);
								if (renshu_value.innerHTML.charAt(0) <= 1) {
									renshu.click();
								} else {
									clearInterval(renshu_fun);
									//确定按钮
									var queding_fun = setInterval(function() {
										var queding = document.querySelector(
											"body > div.bui-modal > div:nth-child(2) > div > div > div > div > div.bui-dm-sku-footer.theme-normal > div.sku-footer-bottom > div.bui-btn.bui-btn-contained.bui-btn-medium.sku-footer-buy-button.half-width.normal.sku-footer-buy-button"
										);
										if (queding == null) {
											console.log("确定失败");
										} else {
											window.location.replace("https://kdocs.cn/l/caFdUbDv3Pgx");
											clearInterval(queding_fun);
										}
									}, 100);
								}
							}, 100);


						}
					}, 100);
				}
			}, 100);
		} else if (title == "订单确认页") {
			var gouxuan_btn = setInterval(function() {
				var gouxuan = document.getElementsByClassName("iconfont icondanxuan-weixuan_");
				var i = 0;
				while (i < 6) {
					if (gouxuan[i] == null) {
						console.log("火爆等原因");
					} else {
						console.log("123");
						gouxuan[i].click();


						//预留空间  所以为半自动  必须要自己点提交订单
						var url = window.location.href;
						var span_color = document.querySelector(
							"#dmOrderSubmitBlock_DmOrderSubmitBlock > div:nth-child(1) > div > div:nth-child(2) > div > div > span"
						);
						span_color.style.color = "red"
						span_color.innerHTML = "请手动点击右下角的提交订单 by:南香香"

						var xiaonan = document.querySelector(
							"#dmOrderSubmitBlock_DmOrderSubmitBlock > div:nth-child(2) > div > div:nth-child(2) > div:nth-child(3) > div:nth-child(2)"
						);
						xiaonan.addEventListener("click", function() {
							xiaonan.style.color = "black";
							xiaonan.innerHTML = "继续点击"
						});

						//检测页面
						var shuaxin = setInterval(function() {
							var xiaonan = document.querySelector("#baxia-punish > div.wrapper > div > div.bannar > div");
							if (xiaonan==null) {
								console.log("页面不能继续点了  频繁或者滑块");
								//window.location.href = url;
							} else {
								console.log("1111-》"+xiaonan);
								window.location.href = "https://m.damai.cn/app/dmfe/h5-ultron-buy/index.html?buyParam=721896436229_2_5242073551649&buyNow=true&exParams=%257B%2522damai%2522%253A%25221%2522%252C%2522channel%2522%253A%2522damai_app%2522%252C%2522umpChannel%2522%253A%2522100031004%2522%252C%2522subChannel%2522%253A%2522damai%2540damaih5_h5%2522%252C%2522atomSplit%2522%253A1%252C%2522signKey%2522%253A%2522clh%252Ba3RUWA9iR1p8TFthenFSdmh1Xl8KYU1OfU9BZHl3Wn5ocVxdD3A7IxMqMBMEBjUcCgA5PGs%253D%2522%257D&sqm=dianying.h5.unknown.value&from=def&spm=a2o71.project.0.bottom";
							}
						}, 1000);


					}
					i++;
				}
			}, 100);
		} else if (title == "大麦") {
			alert("欢迎使用")
		} else if (title == "支付宝付款") {
			alert("抢购成功 赶快去订单里面支付 只有几分钟哟")
		} else {

		}
		
		



    // Your code here...
})();