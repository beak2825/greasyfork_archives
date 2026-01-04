// ==UserScript==
// @name         天猫自动捡漏
// @namespace    http://tampermonkey.net/
// @require  http://ajax.aspnetcdn.com/ajax/jQuery/jquery-3.2.1.min.js
// @version      1.2
// @description  天猫自动捡漏,可开启停止
// @author       三胖

// @match        https://buy.taobao.com/order/confirm_order.htm?*
// @match        https://buy.tmall.com/order/confirm_order.htm?*
// @match        https://buy.tmall.com/auction/order/TmallConfirmOrderError.htm*
// @match        https://www.tmall.com/home/wait.php?id=c&wait_time=5&http_referer=https://www.tmall.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/434207/%E5%A4%A9%E7%8C%AB%E8%87%AA%E5%8A%A8%E6%8D%A1%E6%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/434207/%E5%A4%A9%E7%8C%AB%E8%87%AA%E5%8A%A8%E6%8D%A1%E6%BC%8F.meta.js
// ==/UserScript==

(function() {
	'use strict';

    function tijiao(){
                   if (document.getElementsByClassName("go-btn").length > 0) {
			sessionStorage.removeItem('tm_jl_ur');
			sessionStorage.removeItem('fresh');
			(function(S) {
				let DOM = S.DOM,
					Event = S.Event;
				Event.fire('.go-btn', 'click')
			})(KISSY);
		}}

	function afterText() {
		$(".sn-quick-menu").prepend('<li style="margin-right:10px"><button id="fresh" style="background:#f10;color:#fff;border:none;padding:0 5px;cursor:pointer " title="自动捡漏">自动捡漏</button></li><li><button id="nofresh" style="cursor:pointer;background:#3385ff;color:#fff;border:none;padding:0 5px" title="停止捡漏">停止捡漏</button></li>'); // 在图片后添加文本

		$("#fresh").bind("click", function() {
            sessionStorage.setItem("fresh", "fresh");
            tijiao();
			myrefresh()
            window.location.reload();
		})
		$("#nofresh").bind("click", function() {
			sessionStorage.removeItem('fresh');
		})
	}

	function sleep(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	}
	let defaulturl = window.location.href;
	let fresh = sessionStorage.getItem("fresh");
	console.log(fresh)
	if (fresh !== null) {
		myrefresh();
	}
	sessionStorage.setItem("tm_jl_url", defaulturl);
	afterText()


	function myrefresh() {
		let host = window.location.host;
		let url = window.location.href;
		if (host == "market.m.taobao.com") {
			window.history.go(-1);
		}
		if (host == "www.tmall.com") {
			sessionStorage.removeItem('tm_jl_ur');
			sessionStorage.removeItem('fresh');
			alert("请从商品页重新提交订单");
		}
		if (document.getElementsByClassName("sub-title").value == "购买数量超过了限购数。可能是库存不足，也可能是人为限制。") {
			window.history.go(-1);
		}

		tijiao()

		sleep(3000).then(() => {
			window.location.reload();
		})
	}
})();