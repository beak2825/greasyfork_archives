// ==UserScript==
// @name         阿里云盘会员青春版
// @author       hmjz100、涛之雨
// @namespace    github.com/hmjz100
// @version      1.0.0
// @description  《也许同类型中最好用？》系列 - 显示阿里云盘身份信息为会员，支持使用视频倍速、修改视频画质、修改头像、修改用户名等功能，自定义程度超高！需要修改头部代码来配置显示内容（非常简单！）
// @icon         data:image/png;base64,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
// @license      MIT
// @match        *://*.aliyundrive.com/*
// @match        *://*.alipan.com/*
// @run-at       document-start
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/519078/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E4%BC%9A%E5%91%98%E9%9D%92%E6%98%A5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/519078/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E4%BC%9A%E5%91%98%E9%9D%92%E6%98%A5%E7%89%88.meta.js
// ==/UserScript==

(function () {
	var user = {
		// 以下设置项中，常规项目（就是以//开头注释的项目）除非特殊说明，否则一般 0 为关闭，1 为开启
		vip: 1, // 开启超级会员修改（总开关）

		// 以下是自定义项目（以/*开头注释的项目），修改也非常简单
		/*
		自定义用户名与头像还有邮箱、手机号，留空则使用已登录账号数据
		*/
		name: "百见不如一试",
		photo: "https://cdn.auth0.com/avatars/bj.png",
		mail: "", // 最好不改，我怕影响支付
		phone: "", // 最好不改，我怕影响支付
		/*
		会员过期时间 格式为Unix时间戳，可留空为""
		1596211200 - 2020-08-01 00:00:00 (阿里云盘上线时)
		2147483648 - 2038-01-19 11:14:08 (2038问题时)
		253402185600 - 9999-12-31 00:00:00 (终极时)
		*/
		endtime: 253402185600,

		// 以下的常规项目（就是以//开头注释的项目）均为独立功能，不受总开关控制
		analytics: 0, // 允许阿里云盘网页分析浏览信息，建议 0，分析原理是以 new Image 或 navigator.sendBeacon 的形式让浏览器访问特殊的图片来给服务器传递信息
		debug: 1, // 显示本脚本的调试信息到 JavaScript 控制台中，建议 0，另外，1 显示所有
	}

	var originalOpen = XMLHttpRequest.prototype.open;
	var originalSendBeacon = navigator.sendBeacon;

	unsafeWindow.XMLHttpRequest.prototype.open = function (method, url) {
		url = new URL(url, location.origin).href;
		this.url = url
		if (url.includes('v2/user/get')) {
			// 用户信息
			user.vip ? this.addEventListener('readystatechange', function () {
				if (this.readyState === 4 && this.status === 200) {
					let res, oriRes
					try {
						res = JSON.parse(this.responseText), oriRes = JSON.parse(this.responseText)
					} catch (e) {
						res = this.response, oriRes = this.response
					}

					user.name ? res.nick_name = res.display_name = user.name : ""
					user.photo ? res.avatar = user.photo : ""
					user.mail ? res.email = user.mail : ""
					user.phone ? res.phone = user.phone : ""
					user.vip ? res.vip_identity = "svip" : ""

					if (user.debug === 1) console.log("【阿里云盘会员青春版】Hook XHR", "\n请求地址:", url, "\n原始回复:", oriRes, "\n修改回复:", res)

					Object.defineProperty(this, "responseText", {
						writable: true,
					});
					Object.defineProperty(this, "response", {
						writable: true,
					});
					this.response = JSON.stringify(res)
					this.responseText = JSON.stringify(res)
				}
			}) : ""
		} else if (url.includes('vip/info')) {
			// 会员信息
			user.vip ? this.addEventListener('readystatechange', function () {
				if (this.readyState === 4 && this.status === 200) {
					let res, oriRes
					try {
						res = JSON.parse(this.responseText), oriRes = JSON.parse(this.responseText)
					} catch (e) {
						res = this.response, oriRes = this.response
					}

					res.identity = "svip";
					res.icon = "https://gw.alicdn.com/imgextra/i1/O1CN01Tk0oGw1xZoemH3Wyb_!!6000000006458-2-tps-72-72.png"
					res.vipList = [
						{
							"name": "超级会员",
							"code": "svip",
							"promotedAt": 0,
							"expire": user.endtime ? user.endtime : 9705273204
						}
					];

					if (user.debug === 1) console.log("【阿里云盘会员青春版】Hook XHR", "\n请求地址:", url, "\n原始回复:", oriRes, "\n修改回复:", res)

					Object.defineProperty(this, "responseText", {
						writable: true,
					});
					Object.defineProperty(this, "response", {
						writable: true,
					});
					this.response = JSON.stringify(res)
					this.responseText = JSON.stringify(res)
				}
			}) : ""
		} else if (url.includes('feature/list')) {
			// 功能信息
			user.vip ? this.addEventListener('readystatechange', function () {
				if (this.readyState === 4 && this.status === 200) {
					let res, oriRes
					try {
						res = JSON.parse(this.responseText), oriRes = JSON.parse(this.responseText)
					} catch (e) {
						res = this.response, oriRes = this.response
					}

					res.identity = 'svip';
					/*function setInterceptFalse(feature) {
						feature.intercept = false;
						if (feature.features) {
							feature.features = feature.features.map(subFeature => {
								return setInterceptFalse(subFeature);
							});
						}
						return feature;
					}
					res.features = res.features.map(feature => setInterceptFalse(feature));*/
					res.features = [];

					if (user.debug === 1) console.log("【阿里云盘会员青春版】Hook XHR", "\n请求地址:", url, "\n原始回复:", oriRes, "\n修改回复:", res)

					Object.defineProperty(this, "responseText", {
						writable: true,
					});
					Object.defineProperty(this, "response", {
						writable: true,
					});
					this.response = JSON.stringify(res)
					this.responseText = JSON.stringify(res)
				}
			}) : ""
		}
		return originalOpen.apply(this, arguments);
	};

	if (user.analytics === 0) unsafeWindow.Image = function () {
		const img = new Image();
		return new Proxy(img, {
			set(target, prop, value) {
				if (prop === 'src' && value.includes('web.action')) {
					let url = new URL(value, location.origin);
					if (user.debug === 1) console.warn("【阿里云盘会员青春版】unAnalytics", '\n类型：new Image\n禁止网页分析信息:', url.href);
					return true; // 阻止设置
				}
				target[prop] = value; // 设置其他属性
				return true;
			},
			get(target, prop) {
				return target[prop]; // 获取属性值
			}
		});
	};

	if (user.analytics === 0) unsafeWindow.navigator.sendBeacon = function (src, data) {
		let url = new URL(src, location.origin);
		if (url.includes('jssdk/upload')) {
			if (user.debug === 1) console.warn("【阿里云盘会员青春版】unAnalytics", '\n类型：navigator.sendBeacon\n禁止网页分析信息:', url.href)
			return true;
		}
		return originalSendBeacon.apply(this, arguments);
	};
})();