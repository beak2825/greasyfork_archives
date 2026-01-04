// ==UserScript==
// @name          iKuuu 签到
// @namespace     https://bbs.tampermonkey.net.cn/
// @version       2.2.0
// @description   启动浏览器时iKuuu机场自动签到领流量，请使用脚本猫
// @author        lan
// @icon          https://ikuuu.eu/favicon.ico
// @crontab       * * once * *
// @connect       ikuuu.org
// @match         https://ikuuu.org/
// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/540843/iKuuu%20%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/540843/iKuuu%20%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

return new Promise((resolve, reject) => {
	let i = 0;
	let j = 0;
	GM_xmlhttpRequest({
		method: "GET",
		url: "https://ikuuu.org/user",
		onload: (xhr) => {
			if (xhr.finalUrl == "https://ikuuu.org/auth/login") {
				GM_notification({
					title: "iKuuu未登录！",
					text: "请点击登陆后重新运行脚本",
					onclick: (id) => {
						GM_openInTab("https://ikuuu.org/auth/login");
						GM_closeNotification(id);
					},
					timeout: 10000,
				});
				clearInterval(scan);
				reject("未登录");
			} else if (xhr.finalUrl == "https://ikuuu.org/user") {
				//
			} else {
				clearInterval(scan);
				reject("网页跳转向了一个未知的网址");
			}
		},
	});
	function main() {
		setTimeout(() => {
			GM_xmlhttpRequest({
				method: "POST",
				url: "https://ikuuu.org/user/checkin",
				responseType: "json",
				timeout: 5000,
				onload: (xhr) => {
					let msg = xhr.response.msg;
					if (xhr.status == 200) {
						clearInterval(scan);
						resolve(msg);
					} else {
						GM_log("请求失败，再试一次。", "info");
						++i;
						main();
					}
				},
				ontimeout: () => {
					GM_log("请求超时，再试一次。", "info");
					++i;
					main();
				},
				onabort: () => {
					GM_log("请求终止，再试一次。", "info");
					++i;
					main();
				},
				onerror: () => {
					GM_log("请求错误，再试一次。", "info");
					++i;
					main();
				},
			});
		}, 1000 + Math.random() * 4000);
	}
	let scan = setInterval(() => {
		++j;
		if (i >= 7) {
			GM_notification({
				title: "出错超过七次，已退出脚本。",
				text: "请检查问题并重新运行脚本。",
			});
			clearInterval(scan);
			reject("出错超过七次，已退出脚本。");
		} else if (j >= 32) {
			reject("脚本运行超时 ");
		}
	}, 3000);
	main();
});

/*修改 更新：lan*/