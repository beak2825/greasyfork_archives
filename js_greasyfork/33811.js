// ==UserScript==
// @name         csgoexclusive自动押注
// @match        https://www.csgoexclusive.com/
// @grant        none
// @version      0.4
// @description	 zzzkky的挂机薅羊毛脚本系列，仅限测试币(Test Coin)，开启即开始自动押注，请在获取正式币后{将start的值改回false/油猴关掉/删除脚本}，否则无法停止自动押注，如果因为个人操作原因导致忘记关闭正式币押注，从而损失正式币，本人概不负责。
// @namespace	 https://greasyfork.org/
// @downloadURL https://update.greasyfork.org/scripts/33811/csgoexclusive%E8%87%AA%E5%8A%A8%E6%8A%BC%E6%B3%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/33811/csgoexclusive%E8%87%AA%E5%8A%A8%E6%8A%BC%E6%B3%A8.meta.js
// ==/UserScript==

(function() {
	var start = true;	//需要关闭请改为false
	var amount = 100;	//单次押注数量，默认100
	var interval = 15*1000; //15秒
	var mode = 1; // 1=100压黑(*2)，2=100压黑(*2)并且100压红(*3)，推荐默认的1模式
	var threshold1 = 1500;	//目标数额停止下限，可以自行更改为1k或者2k来设定停止数额
	var threshold2 = 10000;	//目标数额停止上限，可以自行更改来设定停止数额(一般并无卵用)

	setInterval(function(){
		if (start){
			var coins = document.getElementById("balance-total").innerHTML;
			coins = coins.replace(/,/g,'');
			coins = parseInt(coins);
			if (coins > threshold1 && coins < threshold2){
				if (mode == 1){
					document.getElementById("balance-input").value = amount;
					document.getElementById("bet-button-grey").click();
				} else if (mode == 2){
					document.getElementById("balance-input").value = amount;
					document.getElementById("bet-button-grey").click();
					document.getElementById("balance-input").value = amount;
					document.getElementById("bet-button-red").click();
				}
			}
		}
	}, interval);
})();