// ==UserScript==
// @name         H5移动视频播放器增强
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  使视频元素支持长按倍速、上/下滑调节音量、左/右滑调节进度
// @author       tutu辣么可爱(greasyfork)/IcedWatermelonJuice(github)
// @run-at       document-start
// @match        *://*/*
// @require      https://greasyfork.org/scripts/455704-js-extensions-touchjs/code/js-Extensions-touchJS.js?version=1123827
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_setClipboard
// @grant        GM_notification
// @grant        GM_registerMenuCommand
// @grant        GM_info
// @icon         https://icedwatermelonjuice.github.io/Tools-Hub/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/455715/H5%E7%A7%BB%E5%8A%A8%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/455715/H5%E7%A7%BB%E5%8A%A8%E8%A7%86%E9%A2%91%E6%92%AD%E6%94%BE%E5%99%A8%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
	'use strict';
	const dataKey = "h5VideoMPlayerExtend";
	const scriptName = GM_info.script.name;
	var config = Object.assign({
		darkList: [],
	}, GM_getValue(dataKey) ? JSON.parse(GM_getValue(dataKey)) : {})
	var enable = true;
	var tempClose=false;
	var timer = -1;
	
	function vControl(target, v0, v1, cb) {
		var t = target,
			r = undefined;
		if (!target || typeof target !== "object" || !/video/i.test(t.tagName)) {
			return false
		}
		switch (v0) {
			case "p+":
				t.play();
				setTimeout(() => {
					t.play();
				}, 100);
				r = true;
				break;
			case "p-":
				t.pause();
				setTimeout(() => {
					t.pause();
				}, 100)
				r = false;
				break;
			case "p":
				r = !t.paused;
				break;
			case "v+":
				v1 = v1 ? parseFloat(v1) : 0.1;
				t.volume = (t.volume + v1).toFixed(2) <= 1 ? (t.volume + v1).toFixed(2) : 1;
				r = t.volume;
				break;
			case "v-":
				v1 = v1 ? parseFloat(v1) : 0.1;
				t.volume = (t.volume - v1).toFixed(2) >= 0 ? (t.volume - v1).toFixed(2) : 0;
				r = t.volume;
				break;
			case "v":
				if (parseFloat(v1)) {
					t.volume = v1;
				}
				r = t.volume;
				break;
			case "t+":
				v1 = parseFloat(v1) ? parseFloat(v1) : 0.1;
				t.currentTime = (t.currentTime + v1) <= t.duration ? (t.currentTime + v1) : t.duration;
				r = t.currentTime;
				break;
			case "t-":
				v1 = parseFloat(v1) ? parseFloat(v1) : 0.1;
				t.currentTime = (t.currentTime - v1) >= 0 ? (t.currentTime - v1) : 0;
				r = t.currentTime;
				break;
			case "t":
				if (parseFloat(v1)) {
					t.currentTime = v1;
				}
				r = t.currentTime;
				break;
			case "f+":
				t.webkitEnterFullScreen();
				r = true;
				break;
			case "f-":
				t.webkitExitFullScreen();
				r = false;
				break;
			case "f":
				r = (document.fullscreenElement === t);
				break;
			case "r":
				t.playbackRate = parseFloat(v1) ? parseFloat(v1) : 1;
				r = t.playbackRate;
				break;
			default:
				console.log(t);
				r = t;
				break;
		}
		typeof cb === "function" && cb(r)
		return r;
	}

	function videoExtend(target) {
		var longPressTimer = -1;
		target.setAttribute("mplayer-extended", "");
		touchJS.bind(target, "left", () => {
			enable && vControl(target, "t-");
		})
		touchJS.bind(target, "right", () => {
			enable && vControl(target, "t+");
		})
		touchJS.bind(target, "up", () => {
			enable && vControl(target, "v+");
		})
		touchJS.bind(target, "down", () => {
			enable && vControl(target, "v-");
		})
		touchJS.bind(target, "longPress", () => {
			longPressTimer = setInterval(() => {
				enable && vControl(target, "r", 3);
			}, 200)
		})
		touchJS.bind(target, "longPressCancel", () => {
			longPressTimer !== -1 && clearInterval(longPressTimer)
			longPressTimer = -1;
			enable && vControl(target, "r");
		})
	}

	try {
		if(config.darkList){
			config.darkList.forEach((url) => {
				if (location.href.search(url) !== -1) {
					throw Error()
				}
			})
		}
	} catch (e) {
		enable = false;
	}
	GM_registerMenuCommand('临时关闭功能', function() {
		if(enable){
			enable=false;
			tempClose=true;
			GM_notification(`临时关闭脚本功能,刷新网页恢复`, scriptName);
		}else{
			alert("此域名已经在黑名单内");
		}
	});
	GM_registerMenuCommand('添加到黑名单', function() {
		enable = false;
		tempClose=false;
		config.darkList.push(location.hostname);
		GM_setValue(dataKey, JSON.stringify(config));
		GM_notification(`已添加 ${location.hostname} 到黑名单,脚本功能关闭`, scriptName);
	});
	GM_registerMenuCommand('清空已有黑名单', function() {
		config.darkList = [];
		GM_setValue(dataKey, JSON.stringify(config));
		GM_notification(`清空域名黑名单成功,请刷新网页以应用新配置`, scriptName);
	});
	GM_registerMenuCommand('导出配置信息', function() {
		GM_setClipboard(JSON.stringify(config), "text");
		GM_notification(`导出配置信息成功`, scriptName);
	});
	GM_registerMenuCommand('导入配置信息', function() {
		let data = prompt("请粘贴配置信息");
		if (data && data.trim()) {
			try {
				data = JSON.parse(data);
				config = Object.assign(config, data);
				GM_setValue(dataKey, JSON.stringify(config));
			} catch (e) {
				GM_notification(`导入配置信息失败`, scriptName);
				return false
			}
			GM_notification(`导入配置信息成功`, scriptName);
		}
	});
	GM_registerMenuCommand('重置脚本配置', function() {
		config={}
		GM_setClipboard(JSON.stringify(config), "text");
		GM_notification(`重置脚本配置成功`, scriptName);
	});
	GM_registerMenuCommand('脚本相关信息', function() {
		let data=`脚本相关信息：\n名称:${scriptName}\n作者:${GM_info.script.author}\n版本:${GM_info.script.version}\n状态:${enable?"正常启用":(tempClose?"临时关闭":"黑名单")}`
		alert(data)
	});
	timer = setInterval(() => {
		let v = document.querySelectorAll("video:not([mplayer-extended])");
		v.forEach((e) => {
			videoExtend(e);
		})
	}, 500)
	console.log(`${scriptName} 主程序500ms定时器ID:${timer}`)
})();
