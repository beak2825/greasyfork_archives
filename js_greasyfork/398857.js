// ==UserScript==
// @name        京喜工厂-自动收取双倍电力
// @namespace   Violentmonkey Scripts
// @match       https://wqs.jd.com/pingou/dream_factory/*.html
// @grant       none
// @version     1.6
// @author      zhangdaren(375890534@qq.com)
// @description 2020/3/28 下午4:51:41
// @downloadURL https://update.greasyfork.org/scripts/398857/%E4%BA%AC%E5%96%9C%E5%B7%A5%E5%8E%82-%E8%87%AA%E5%8A%A8%E6%94%B6%E5%8F%96%E5%8F%8C%E5%80%8D%E7%94%B5%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/398857/%E4%BA%AC%E5%96%9C%E5%B7%A5%E5%8E%82-%E8%87%AA%E5%8A%A8%E6%94%B6%E5%8F%96%E5%8F%8C%E5%80%8D%E7%94%B5%E5%8A%9B.meta.js
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
			if (num >= 290) {
				console.log("电力值到290啦")
				let alternatorBtn = document.querySelector("#alternator");
				alternatorBtn && alternatorBtn.click();
			}
		}
	}, 1000);
}
