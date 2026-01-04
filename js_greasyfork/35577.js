// ==UserScript==
// @name         华为P10保时捷抢购
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  通过无限计时跳转抢购页面，自动开始轮询
// @author       You
// @match        https://sale.vmall.com/mate10pd.html?mainSku=81139976&backUrl=https%3A%2F%2Fwww.vmall.com%2Fproduct%2F173840389.html%2381139976&_t=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35577/%E5%8D%8E%E4%B8%BAP10%E4%BF%9D%E6%97%B6%E6%8D%B7%E6%8A%A2%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/35577/%E5%8D%8E%E4%B8%BAP10%E4%BF%9D%E6%97%B6%E6%8D%B7%E6%8A%A2%E8%B4%AD.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var time = new Date();
	time = time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate() + " " + time.getHours() + ":" + time.getMinutes() + ":" + time.getSeconds();
	var i = 0;
	var funName = "callback" + new Date().getTime(),
		c = ec.selectedProduct.skuId,
		d = ec.account.getLoginPars(),
		url = "//ord01.vmall.com/order/pwm86t/createOrder.do?nowTime=" + time + "&callback=" + funName;
	var skus = "&skuId=" + c + "&skuIds=" + c + "&activityId=" + ec.activityId;
	url = window.location.protocol + url + skus + ec.code + d;
	console.log(url);

	function gogogo() {
		ec.getJson({
			url: url + '&t=' + new Date().getTime(),
			funName: funName,
			success: function(m) {
				i++;
				console.log(i, m);
				if (m && m.success) {
					if (ec.flowType == 2) {
						ec.reserveTimes(m, coverFlag);
					} else {
						var g = ec.url.chooseComponent + "?nowTime=" + time + skus + "&orderSign=" + m.orderSign + "&uid=" + m.uid;
						if (ec.isRequestFromVmall) {
							g = g + "&backUrl=" + encodeURIComponent(ec.paramForVmall.backUrl) + (ec.paramForVmall.giftSkus ? "&optionalGiftIds=" + ec.paramForVmall.giftSkus : "") + (ec.paramForVmall.accessoriesSkus ? "&componentIds=" + ec.paramForVmall.accessoriesSkus : "");
						}
						window.location.href = g;
					}
				} else {
					if (typeof(Worker) == "function" && !ec.calculating && m && m.calNum) {
						var j = new Date().getTime();
						ec.calculating = true;
						var l = new Worker("/js/ti6.min.js");
						var k = {
							start: m.calNum,
							end: (m.calLen ? m.calLen : 5000),
							reLength: (m.retLen ? m.retLen : 20)
						};
						if (m.A00) {
							k.A00 = m.A00;
						}
						if (m.A11) {
							k.A11 = m.A11;
						}
						if (m.A22) {
							k.A22 = m.A22;
						}
						l.postMessage(JSON.stringify(k));
						l.onmessage = function(n) {
							ec.calculateResult = n.data;
							ec.calcCostTime = new Date().getTime() - j;
						};
					}
					if (m && m.code) {
						if (m.code == 4 || m.code == 6 || m.code == 8 || m.code == 9) {
							if ((ec.retryFun || ec.oneMin) && m.code != 9) {
								clearTimeout(ec.retryFun);
								clearTimeout(ec.oneMin);
							}
							if (m.code == 4) {
								ec.showMsgSoldOut();
							} else {
								if (m.code == 6) {
									ec.showBox();
								} else {
									if (m.code == 8) {
										ec.account.change();
									} else {
										if (m.code == 9) {
											var h = ec.util.cookie.get("uid");
											if (h) {
												ec.getQualification(h);
											} else {
												if (ec.isRequestFromVmall) {
													ec.setLoginUrlForVmall();
												}
												location.href = ec.loginUrl;
											}
										}
									}
								}
							}
						}
					}
					setTimeout(gogogo, 400);
				}
			}
		});
	}
	gogogo();
})();
