// ==UserScript==
// @name         我的世界梦想之都自动签到-管理员版
// @namespace    http://www.mxzd.games/
// @version      1.0.5
// @description  我的世界梦想之都服务器 - MC找服网签到 MC百科签到 百度贴吧签到/回复  MineBBS回复 苦力怕论坛回复/签到
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
// @downloadURL https://update.greasyfork.org/scripts/472698/%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E6%A2%A6%E6%83%B3%E4%B9%8B%E9%83%BD%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E7%AE%A1%E7%90%86%E5%91%98%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/472698/%E6%88%91%E7%9A%84%E4%B8%96%E7%95%8C%E6%A2%A6%E6%83%B3%E4%B9%8B%E9%83%BD%E8%87%AA%E5%8A%A8%E7%AD%BE%E5%88%B0-%E7%AE%A1%E7%90%86%E5%91%98%E7%89%88.meta.js
// ==/UserScript==

(function () {
	("use strict");

	// Your code here...

	// 签到网站
	const H_zfw = "https://www.mczfw.cn/server/731.html";
	const H_bk = "https://play.mcmod.cn/sv20186914.html";
	const H_klpqd = "https://klpbbs.com/k_misign-sign.html";
	const H_klphf =
		"https://klpbbs.com/forum.php?mod=viewthread&tid=67975&extra=page%3D1&page=1";

	const H_MxzdHD = "http://www.mxzd.games/activity.html";
	const H_bdtb1 =
		"https://tieba.baidu.com/p/8555061442?pid=148364690565&cid=0#148364690565";
	const H_bdtb2 =
		"https://tieba.baidu.com/p/8097349579?pid=145881545031&cid=0#145881545031";
	const H_MineBBS = "https://www.minebbs.com/threads/3-mc.20195/";
	// 获取浏览器地址进行判断
	var host = window.location.host;
	var href = window.location.href;

	// 菜单按钮
	GM_registerMenuCommand("自动签到", auto, "h");

	// 进入浏览器自动执行签到
	window.onload = autoBtn();

	function auto() {
		GM.openInTab(H_zfw);
		GM.openInTab(H_bk);
		GM.openInTab(H_klpqd);
		GM.openInTab(H_klphf);
		GM.openInTab(H_MineBBS);
		GM.openInTab(H_bdtb1, { active: true });

		// GM.openInTab(H_bdtb2, { active: true });

		GM_setValue("click", true);
		// GM.openInTab(H_MxzdHD, { active: true });
	}

	function autoBtn() {
		if (host.indexOf("mczfw") > -1) {
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
		} else if (href.indexOf(8555061442) > -1) {
			var signBtn = $(".sign_btn_bright")[0];
			if (signBtn) {
				signBtn.click();
			}

			//百度贴吧1
			setTimeout(() => {
				window.scrollTo(0, 853);
			}, 3000);

			setTimeout(() => {
				var btnSub = $(".btn-sub")[4];

				btnSub.click();
				var textRp = $(".edui-editor-body .edui-body-container p")[0];
				textRp.innerHTML = "一起来玩吧";
				var submit = $(".lzl_panel_submit")[0];
				submit.click();
				if (signBtn) {
					signBtn.click();
				}
				GM.openInTab(H_bdtb2, { active: true });
			}, 5000);
		} else if (href.indexOf(8097349579) > -1) {
			//百度贴吧2
			var signBtn = $(".sign_btn_bright")[0];
			if (signBtn) {
				signBtn.click();
			}

			setTimeout(() => {
				window.scrollTo(0, 3138);
			}, 3000);

			setTimeout(() => {
				var btnSub = $(".btn-sub")[5];

				btnSub.click();
				var textRp = $(".edui-editor-body .edui-body-container p")[0];
				textRp.innerHTML = "一起来玩吧";
				var submit = $(".lzl_panel_submit")[0];
				submit.click();
				if (signBtn) {
					signBtn.click();
				}
				GM.openInTab(H_MxzdHD, { active: true });
			}, 5000);
		} else if (host.indexOf("klpbbs.com") > -1) {
			//苦力怕回帖
			if (href.indexOf(67975) > -1) {
				const text = document.getElementById("fastpostmessage");
				const textBtn = document.getElementById("fastpostsubmit");
				if (text) {
					text.value = "一起来玩吧，欢迎大家";
					textBtn.click();
				}
			}

			// 苦力怕签到
			const klpqd = document.querySelector(".lineB .qdleft .btn");
			if (klpqd) {
				klpqd.click();
			}
		} else if (host.indexOf("minebbs.com") > -1) {
			// 等待标签异步加载成功
			jQuery.fn.wait = function (selector, func, times, interval) {
				var _times = times || -1, //100次
					_interval = interval || 20, //20毫秒每次
					_self = this,
					_selector = selector, //选择器
					_iIntervalID; //定时器id
				if (this.length) {
					//如果已经获取到了，就直接执行函数
					func && func.call(this);
				} else {
					_iIntervalID = setInterval(function () {
						if (!_times) {
							//是0就退出
							clearInterval(_iIntervalID);
						}
						_times <= 0 || _times--; //如果是正数就 --

						_self = $(_selector); //再次选择
						if (_self.length) {
							//判断是否取到
							func && func.call(_self);
							clearInterval(_iIntervalID);
						}
					}, _interval);
				}
				return this;
			};

			// MineBBS 回复
			if (href.indexOf(20195) > -1) {
				const MineBBSTextBtn = document.querySelectorAll(
					".button.button--primary"
				)[4];

				// 异步加载
				$(".fr-box .fr-element").wait(".fr-box .fr-element", function () {
					this[0].innerText = "一起来玩吧，欢迎大家";
					if (MineBBSTextBtn) {
						MineBBSTextBtn.click();
						// console.log("成功");
					}
				});
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
			// 签到成功提示

			// var bkqdVal = ;
			// var zfwqdVal = ;

			// 在这里编写显示弹窗的逻辑，可以是通过修改 DOM 元素显示弹窗，或者调用自定义的弹窗组件等
			var now = new Date();
			var nowTime =
				now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate();

			if (GM_getValue("Gbk") && GM_getValue("Gzfw")) {
				// GM_setValue("Gbk", false);
				// GM_setValue("Gzfw", false);

				alert(
					"百科，找服网，你今日已点赞 截取此弹窗发送至Q群@服主即可获得奖励,时间" +
						nowTime
				);
				//
			} else {
				// GM_setValue("Gbk", false);
				// GM_setValue("Gzfw", false);

				alert("未能成功点赞，请检查[ 找服网 ]和[ MC百科 ]是否都已经登录");
			}
		}
	}
})();
