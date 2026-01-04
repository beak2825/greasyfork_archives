// ==UserScript==
// @name        某东,某喜-收取电力
// @namespace   Violentmonkey Scripts
// @match       https://wqs.jd.com/pingou/dream_factory/*.html
// @match       https://wqs.jd.com/pingou/dream_factory/*.html?*
// @match       https://wqs.jd.com/pingou/dream_factory/market.html
// @match       https://wqs.jd.com/pingou/dream_factory/market.html?*
// @grant       none
// @version     1.4
// @author      zhangdaren(375890534@qq.com)
// @update      smilewind(385071602@qq.com)
// @description 2020/3/28 下午4:51:41
// @downloadURL https://update.greasyfork.org/scripts/398978/%E6%9F%90%E4%B8%9C%2C%E6%9F%90%E5%96%9C-%E6%94%B6%E5%8F%96%E7%94%B5%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/398978/%E6%9F%90%E4%B8%9C%2C%E6%9F%90%E5%96%9C-%E6%94%B6%E5%8F%96%E7%94%B5%E5%8A%9B.meta.js
// ==/UserScript==

(function() {
	console.log('奥利给！！！京喜工厂自动收取双倍电力，开干~');
	setTimeout(function(){
			lifecycle();
	}, 2000);
})();

function lifecycle() {
	let timeid = setInterval(function() {
		if (document.querySelector(".alternator-num-n")) {
			var num = document.querySelector(".alternator-num-n").innerText;
			console.log("监测电力值 ->> " + num);
			num = parseFloat(num);
			if (num >= 300) {
				console.log("电力值到300啦")
				document.getElementById("alternator").click();
				document.getElementsByClassName('simple_dialog_txt_btn_txt')[0].click();
                document.getElementsByClassName('close')[0].click();
				//clearInterval(timeid);
				//setTimeout(function() {
					//document.querySelector(".simple_dialog_btn").click();
					//lifecycle();
				//}, 1000)
			}
		} else if (document.querySelector(".floating_title")) {
			var secStr = document.querySelector(".floating_title").innerText;
			console.log("监测倒计时 ->> " + secStr);			
			if (secStr === "已完成") {
				console.log("完成啦")
				document.querySelector(".floating_title").click();
				clearInterval(timeid);
				setTimeout(function() {
					lifecycle();
				}, 2000)
			} else if (secStr === "30s") {
				console.log("滑动页面")
				document.querySelector(".scroll-view").scrollTo(0, 800);
			}
		}
	}, 1000);
}
