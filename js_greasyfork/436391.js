// ==UserScript==
// @name         myHeroes
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!myHeroes
// @author       You
// @match        https://www.tampermonkey.net/scripts.php
// @include    *://play.bnbheroes.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/436391/myHeroes.user.js
// @updateURL https://update.greasyfork.org/scripts/436391/myHeroes.meta.js
// ==/UserScript==

(function() {
	function loginWallet() {
		return new Promise((resolve, reject) => {
			try {
				document
					.querySelector(".sc-eCApGN.cjAFRf.web3modal-provider-wrapper")
					.click();
				resolve("小狐狸选择成功");
			} catch (error) {
				reject(error);
			}
		});
	}

	loginWallet()
		.then(res => {
			try {
				console.log(res);
				document.querySelector(".float-end")
					.click();
				// 延时执行
				setTimeout(startFight, 10000);
			} catch (error) {
				console.log(error);
			}
		})
		.catch(err => {
			console.log(err);
		});

	function startFight() {
		//获取当前英雄血量
		let HP = document
			.querySelector(".hp-progress-detail")
			.getInnerHTML()
			.split(" ")[1]
			.split("/")[0];
		if (HP >= 200) {
			//右侧驼背
			let myHeroDom = document.querySelectorAll(
				".general-enemy.d-flex.flex-column.align-items-center.justify-content-center.p-2"
			)[1];
			//向右切换怪物箭头
			let rightArrow = myHeroDom.querySelector(".right-arrow");
			//切换到弓箭手方法
			function getArcher() {
				//获取怪兽名称
				let myHeroName = myHeroDom
					.querySelector(".text-white.fs-3.p-1")
					.getInnerHTML();
				if (myHeroName == "Red Skull Archer") {
					console.log("切换到弓箭手,开始战斗。。。");
					archerFight();
					return true;
				} else {
					rightArrow.click();
					getArcher();
				}
			}
			//弓箭手开始战斗的按钮组
			function archerFight() {
				let fightBtn = myHeroDom.querySelector(
					".btn.btn-yellow.pt-2.pb-3.ps-5.pe-5.w-auto"
				);
				console.log("战斗中...");
				fightBtn.click();
			}
			getArcher();
		} else {
			console.log(`当前英雄HP为${HP}不足200，准备切换英雄。。。`);
			//向右切换下一个英雄 （注意 获取的第一个后面不可以这样用）
			document.querySelector(".right-arrow")
				.click();
			console.log("已切换");
		}
	}

	setTimeout(loginWallet, 2000);
	//100s刷新页面获取最新HP
	setTimeout(() => {
		window.location.reload();
	}, 100000);
})();