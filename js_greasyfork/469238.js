// ==UserScript==
// @name         我的世界梦想之都自动签到-玩家版
// @namespace    http://www.mxzd.games/
// @version      1.0.9
// @description  我的世界梦想之都服务器 - MC找服网签到 MC百科签到
// @author       乔木真言
// @license      Apache License 2.0
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_openInTab
// @grant        GM_deleteValue
// @run-at       document-idle
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/469238/%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E6%A2%A6%E6%83%B3%E4%B9%8B%E9%83%BD%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E7%8E%A9%E5%AE%B6%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/469238/%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E6%A2%A6%E6%83%B3%E4%B9%8B%E9%83%BD%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E7%8E%A9%E5%AE%B6%E7%89%88.meta.js
// ==/UserScript==

(function () {
	("use strict");

	// Your code here...

	// 签到网站
	const H_zfw = "https://www.fansmc.com/server/731.html";
	const H_bk = "https://play.mcmod.cn/sv20186914.html";

	var host = window.location.host;

	// 菜单按钮
	GM_registerMenuCommand("自动签到", auto, "h");

	// 进入浏览器自动执行签到
	window.onload = autoBtn();

	function auto() {
		GM.openInTab(H_zfw);
		GM.openInTab(H_bk);

		GM_setValue("click", true);
		GM.openInTab(H_MxzdHD, { active: true });
	}

	function autoBtn() {
		if (host.indexOf("fansmc") > -1) {
			// 判断登录没登陆
			var zfwSignStatus = document.getElementsByClassName("dropdown");
			var zfwSignText = zfwSignStatus[2].innerText;
			// 登录判断
			if (!(zfwSignText.indexOf("登录") > -1)) {
				const btns = document.querySelectorAll(".btn-group");
				const btna = btns[2].getElementsByTagName("a");
				btna[0].click();

				GM_setValue("Gzfw", true);
			} else {
				GM_setValue("Gzfw", false);
				// alert("找服网未登录，无法点赞，请登录");
			} //判断是不是MC百科
		} else if (host.indexOf("mcmod") > -1) {
			var bkSignText = document.querySelector(".header-user").innerText;

			// 登录判断
			if (!(bkSignText.indexOf("登录") > -1)) {
				const bkbtn = document.querySelector(".thumbup");
				const masterup = document.querySelector(".masterup");
				bkbtn.click();

				if (masterup) {
					setTimeout(() => {
						masterup.click();
					}, 2000);
				}
				GM_setValue("Gbk", true);
			} else {
				GM_setValue("Gbk", false);
				// alert("MC百科未登录，无法点赞，请登录");
			}
		}

		if (host.indexOf("mxzd.games") > -1 && GM_getValue("click")) {
			// 检查弹窗状态的函数

			// 在页面加载时调用检查弹窗状态的函数

			checkPopupStatus();
		}

		function checkPopupStatus() {
			// 获取当前日期
			const currentDate = new Date().toDateString();

			// 从本地存储中获取弹窗状态标记
			const popupStatus = localStorage.getItem("popupStatus");

			// 如果标记不存在或者标记表示上一次弹窗是在前一天
			if (!popupStatus || popupStatus !== currentDate) {
				// 显示弹窗
				displayPopup();

				// 更新本地存储中的标记为当前日期
				localStorage.setItem("popupStatus", currentDate);
			}
		}

		// 显示弹窗的函数
		function displayPopup() {
			GM_setValue("click", false);

			var now = new Date();
			var nowTime =
				now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

			if (GM_getValue("Gbk") && GM_getValue("Gzfw")) {
				alert(
					"百科，找服网，你今日已点赞 截取此弹窗发送至Q群@服主即可获得奖励,时间" +
						nowTime
				);
				//
			} else {
				alert("未能成功点赞，请检查[ 找服网 ]和[ MC百科 ]是否都已经登录");
			}
		}
	}
})();
