// ==UserScript==
// @name         通用视频搜索
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  视频匹配搜索：爱优腾、B站、芒果TV、搜狐、乐视、1905、PPTV、西瓜
// @author       tutu辣么可爱
// @include      *://*.iqiyi.com/*
// @include      *://*.iq.com/*
// @include      *://*.youku.com/*
// @include      *://*v.qq.com/*
// @include      *://*.bilibili.com/*
// @include      *://*.acfun.cn/*
// @include      *://*.mgtv.com/*
// @include      *://*tv.sohu.com/*
// @include      *://*.le.com/*
// @include      *://*.1905.com/*
// @include      *://*.pptv.com/*
// @include      *://*.ixigua.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438536/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/438536/%E9%80%9A%E7%94%A8%E8%A7%86%E9%A2%91%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
	/*
	1.manipulate用于点击/长按事件的设置
	2.set用于创建设置页、获取/修改/保存/应用设置数据。data保存设置数据，并通过localstorage的vipParseSettingsData长期保存，保存形式为JSON字符串。backupData保存初始设置数据用于恢复默认。set->createBody->setMenu保存设置页选项数据
	3.check用于检查浏览器UA，或通过list检查是否是可生效的网站。list保存脚本可生效的网站ID、名称、域名
	4.vip用于创建新播放器，指向解析线路。map保存不同网站不同ua情况下的播放器ID或类名
	5.btn用于创建主题按钮。interface保存解析接口，backupInterfa保存初始解析接口数据用于恢复默认
	*/
	var manipulate = {
		data: {
			"flag": false,
			"wait": false,
			"timeStart": 0,
			"timeEnd": 0
		},
		get: function(key) {
			if (key === "time") {
				return new Date().getTime();
			} else {
				return this.data[key];
			}
		},
		set: function(key, value) {
			this.data[key] = value;
		},
		start: function(clickEvent, longPressEvent) {
			if (!this.get("flag") && !this.get("wait")) {
				this.set("flag", true);
				this.set("wait", true);
				this.set("timeStart", this.get("time"));
				setTimeout(function() {
					manipulate.end(clickEvent, longPressEvent);
					manipulate.set("wait", false);
				}, 310);
			}
		},
		end: function(clickEvent, longPressEvent) {
			if (this.get("flag")) {
				this.set("flag", false);
				this.set("timeEnd", this.get("time"));
				var timeSpan = this.get("timeEnd") - this.get("timeStart");
				if (timeSpan < 300) {
					clickEvent();
				} else {
					longPressEvent();
				}
			}
		},
		on: function(target, clickEvent, longPressEvent) {
			target.addEventListener("mousedown", function() {
				manipulate.start(clickEvent, longPressEvent);
			});
			target.addEventListener("touchstart", function() {
				manipulate.start(clickEvent, longPressEvent);
			});
			target.addEventListener("mouseup", function() {
				manipulate.end(clickEvent, longPressEvent);
			});
			target.addEventListener("touchend", function() {
				manipulate.end(clickEvent, longPressEvent);
			});
		}
	};
	var set = {
		data: {
			"box-top": "100px",
			"box-right": "2px",
			"main-height": "30px",
			"main-width": "50px",
			"main-border-radius": "20px",
			"menu-height": "310px",
			"menu-width": "120px",
			"menu-border-radius": "20px",
			"item-font-size": "18px",
			"item-color": "white",
			"background": "rgb(217, 6, 9)",
			"user-interface": []
		},
		backupData: {},
		init: function() {
			this.backupData = this.data;
			var localData = JSON.parse(localStorage.getItem("vipParseSettingsData"));
			if (localData) {
				var newData = {
					...this.data,
					...localData
				};
				this.data = newData;
			}
			btn.backup();
			btn.init();
			this.store();
		},
		get: function(key) {
			return this.data[key];
		},
		edit: function(key, value) {
			if (key.search("user-interface") !== -1) {
				key = parseInt(key.replace(/[^0-9]/ig, ""));
				this.data["user-interface"][key] = value;
			}
			this.data[key] = value;
		},
		store: function() {
			localStorage.setItem("vipParseSettingsData", JSON.stringify(this.data));
		},
		save: function() {
			var setPage = document.getElementById("vipParseBtnSetting");
			var inputBox = setPage.getElementsByTagName("input");
			for (let i = 0; i < inputBox.length; i++) {
				this.edit(inputBox[i].name, inputBox[i].value);
			}
			btn.init();
		},
		apply: function() {
			var flag = false;
			if (document.getElementById("vipParseBtnMenu").style.display !== "none") {
				flag = true;
			}
			document.getElementById("vipParseBtnBox").remove();
			btn.create();
			if (flag) {
				btn.clickMain();
			}
			document.getElementById("vipParseBtnSetting").style.background = this.get("background");
		},
		revert: function() {
			var setPage = document.getElementById("vipParseBtnSetting-StyleSet");
			if (setPage.style.display === "none") {
				setPage = document.getElementById("vipParseBtnSetting-ParseSet");
			}
			var inputBox = setPage.getElementsByTagName("input");
			var interfaceBackup = btn.get("backup");
			for (let i in inputBox) {
				let key = inputBox[i].name;
				if (key.search("user-interface") !== -1) {
					key = parseInt(key.replace(/[^0-9]/ig, ""));
					inputBox[i].value = interfaceBackup[key];
				} else {
					inputBox[i].value = this.backupData[key];
				}
			}
		},
		switch: function() {
			var setTitle = document.getElementById("vipParseBtnSetting-head").children[0];
			var styleSet = document.getElementById("vipParseBtnSetting-StyleSet");
			var parseSet = document.getElementById("vipParseBtnSetting-ParseSet");
			if (styleSet.style.display === "none") {
				styleSet.style.display = "";
				parseSet.style.display = "none";
				setTitle.innerText = "脚本样式设置";
			} else {
				styleSet.style.display = "none";
				parseSet.style.display = "";
				setTitle.innerText = "脚本解析设置";
			}
		},
		create: function() {
			var setting = document.createElement("div");
			var wid = 400;
			var hei = 260;
			var screenW = document.documentElement.clientWidth;
			var screenH = document.documentElement.clientHeight;
			if ((wid + 10) > screenW) {
				wid = screenW - 10;
			}
			var settingH = (screenH - hei) / 2;
			var settingW = (screenW - wid) / 2;
			setting.style =
				"display:none;width:" + wid + "px;height:" + hei +
				"px;overflow:hidden;position:fixed;top:" + settingH + "px;right:" + settingW +
				"px;border-radius:15px;padding:20px;background:" + this.get("background") +
				";color:white;font-size:12px;overflow-y:auto;z-index: 99999;";
			setting.id = "vipParseBtnSetting";
			setting.appendChild(this.createHead());
			setting.appendChild(this.createBody());
			setting.appendChild(this.createFoot());
			document.body.insertBefore(setting, document.body.firstChild);
		},
		createHead: function() {
			var head = document.createElement("div");
			var title = document.createElement("span");
			var subtitle = document.createElement("span");
			head.id = "vipParseBtnSetting-head";
			head.style = "width:100%;height:30px;text-align:center;margin-bottom:20px;";
			title.style = "font-size:20px;";
			title.innerText = "脚本样式设置";
			subtitle.style = "font-size:12px;";
			subtitle.innerText = "(仅对" + (check.ua() === "pc" ? "桌面端" : "移动端") + check.site("name") + "生效)";
			head.appendChild(title);
			head.appendChild(subtitle);
			return head;
		},
		createBody: function() {
			var body = document.createElement("div");
			body.style = "width:115%;height:calc(100% - 80px);overflow: hidden scroll;";
			body.id = "vipParseBtnSetting-body";
			body.appendChild(this.createStyle());
			body.appendChild(this.createParse());
			return body;
		},
		createFoot: function() {
			var foot = document.createElement("div");
			foot.style = "width:100%;height:30px;position:absolute;bottom:10px;";
			foot.id = "vipParseBtnSetting-foot";
			foot.appendChild(this.createBtn("revert"));
			foot.appendChild(this.createBtn("save"));
			foot.appendChild(this.createBtn("close"));
			foot.appendChild(this.createBtn("switch"));
			return foot;
		},
		createOpt: function(data, titleWidth, inputWidth) {
			var optBox = document.createElement("div");
			var titleBox = document.createElement("span");
			var textBox = document.createElement("input");
			var textBoxMaxWidth = document.documentElement.clientWidth - 20 - titleWidth;
			optBox.style = "height:30px;float:left;"
			titleBox.innerText = data.name;
			titleBox.style = "width:" + titleWidth + "px;float:left;margin-bottom:8px;";
			textBox.name = data.key;
			textBox.style = "width:" + inputWidth +
				"px;max-width:" + textBoxMaxWidth +
				"px;float:left;color:black;margin-bottom:8px;margin-right:10px;";
			if (data.value) {
				textBox.value = data.value;
			} else {
				textBox.value = set.get(data.key);
			}
			optBox.appendChild(titleBox);
			optBox.appendChild(textBox);
			return optBox;
		},
		createStyle: function() {
			var page = document.createElement("div");
			page.style = "width:100%;height:100%;";
			page.id = "vipParseBtnSetting-StyleSet";
			var setMenu = [{
				"name": "按钮距离顶部",
				"key": "box-top"
			}, {
				"name": "按钮距离右侧",
				"key": "box-right"
			}, {
				"name": "按钮高度",
				"key": "main-height"
			}, {
				"name": "按钮宽度",
				"key": "main-width"
			}, {
				"name": "按钮圆角",
				"key": "main-border-radius"
			}, {
				"name": "菜单圆角",
				"key": "menu-border-radius"
			}, {
				"name": "菜单高度",
				"key": "menu-height"
			}, {
				"name": "菜单宽度",
				"key": "menu-width"
			}, {
				"name": "菜单字体大小",
				"key": "item-font-size"
			}, {
				"name": "菜单字体颜色",
				"key": "item-color"
			}, {
				"name": "主题背景色调",
				"key": "background"
			}];
			for (let i in setMenu) {
				page.appendChild(this.createOpt(setMenu[i], 90, 90));
			}
			return page;
		},
		createParse: function() {
			var page = document.createElement("div");
			page.style = "display:none;width:100%;height:100%;";
			page.id = "vipParseBtnSetting-ParseSet";
			for (let i = 0; i < btn.get("length"); i++) {
				var setdata = {
					"name": "播放线路" + ((i + 1) < 10 ? "0" : "") + (i + 1),
					"key": "user-interface-" + i,
					"value": btn.get(i)
				};
				page.appendChild(this.createOpt(setdata, 90, 180));
			}
			return page;
		},
		createBtn: function(name) {
			var btnBox = document.createElement("span");
			var btnObj = document.createElement("div");
			var text, func, id;
			btnObj.style =
				"margin-right:12px;padding:0 10px;cursor:pointer;border:white thin solid;border-radius:10px;float:left";
			switch (name) {
				case "revert":
					text = "重置";
					id = "vipParseBtnSetting-" + name + "Btn";
					func = function() {
						set.revert()
					}
					break;
				case "save":
					text = "保存并应用";
					id = "vipParseBtnSetting-" + name + "Btn";
					func = function() {
						if (confirm("是否确认保存并应用新设置?")) {
							set.save();
							set.store();
							set.apply();
						}
					}
					break;
				case "close":
					text = "关闭设置";
					id = "vipParseBtnSetting-" + name + "Btn";
					func = function() {
						var setting = document.getElementById("vipParseBtnSetting");
						setting.style.display = "none";
					}
					break;
				case "switch":
					text = "切换设置项";
					id = "vipParseBtnSetting-" + name + "Btn";
					func = function() {
						set.switch();
					}
					break;
				default:
					break;
			}
			btnObj.innerText = text;
			btnObj.id = id;
			btnObj.onclick = func;
			btnBox.appendChild(btnObj);
			return btnBox;
		}
	};
	var check = {
		list: {
			0: {
				"id": "iqiyi",
				"name": "爱奇艺",
				"host": "iqiyi.com|iq.com"
			},
			1: {
				"id": "youku",
				"name": "优酷",
				"host": "youku.com"
			},
			2: {
				"id": "tencentvideo",
				"name": "腾讯视频",
				"host": "v.qq.com"
			},
			3: {
				"id": "bilibili",
				"name": "B站",
				"host": "bilibili.com"
			},
			4: {
				"id": "acfun",
				"name": "A站",
				"host": "acfun.cn"
			},
			5: {
				"id": "mgtv",
				"name": "芒果TV",
				"host": "mgtv.com"
			},
			6: {
				"id": "sohu",
				"name": "搜狐视频",
				"host": "tv.sohu.com"
			},
			7: {
				"id": "le",
				"name": "乐视视频",
				"host": "le.com"
			},
			8: {
				"id": "1905",
				"name": "1905电影网",
				"host": "1905.com"
			},
			9: {
				"id": "pptv",
				"name": "PP视频",
				"host": "pptv.com"
			},
			10: {
				"id": "xigua",
				"name": "西瓜视频",
				"host": "ixigua.com"
			}
		},
		ua: function() {
			var uaStr = "pc";
			if (/Android|webOS|HarmonyOS|iPhone|iPod|BlackBerry|mobile/i.test(navigator.userAgent)) {
				uaStr = "mobile";
			}
			return uaStr;
		},
		site: function(type) {
			var site = "unknow";
			var host = location.hostname;
			for (let i in this.list) {
				if (host.match(new RegExp(this.list[i].host))) {
					site = this.list[i][type];
				}
			}
			return site;
		},
		url: function(urlStr) {
			var res = false;
			urlStr = urlStr.replace(/\s+/g, "");
			if (/^((http|https):\/\/)?(([A-Za-z0-9]+-[A-Za-z0-9]+|[A-Za-z0-9]+)\.)+([A-Za-z]+)[/\?\:]?.*$/i
				.test(urlStr)) {
				res = urlStr;
			}
			return res;
		}
	}
	var vip = {
		map: {
			"iqiyi": {
				"pc": "flashbox",
				"mobile": "m-box"
			},
			"youku": {
				"pc": "ykPlayer",
				"mobile": "h5-detail-player"
			},
			"tencentvideo": {
				"pc": "mod_player",
				"mobile": "mod_player"
			},
			"bilibili": {
				"pc": "bilibili-player-video-wrap|player-limit-mask",
				"mobile": "bilibiliPlayer|player-wrapper"
			},
			"acfun": {
				"pc": "ACPlayer",
				"mobile": "#ACPlayer"
			},
			"mgtv": {
				"pc": "mgtv-player-wrap",
				"mobile": "video-area"
			},
			"sohu": {
				"pc": "x-player",
				"mobile": "player-view"
			},
			"le": {
				"pc": "fla_box",
				"mobile": "playB"
			},
			"1905": {
				"pc": "player",
				"mobile": "player"
			},
			"pptv": {
				"pc": "pplive-player",
				"mobile": "pp-details-video"
			},
			"xigua": {
				"pc": "teleplayPage__playerSection__left",
				"mobile": "xigua-detailvideo-video-inner"
			}
		},
		get: function(site, ua) {
			var res = false;
			if (site && ua) {
				var key = this.map[site][ua];
				if (key) {
					key = key.split("|");
					for (let i = 0; i < key.length; i++) {
						res = this.search(key[i]);
						if (res) {
							break;
						}
					}
				}
			}
			return res;
		},
		search: function(key) {
			var player = document.getElementById(key);
			if (player) {
				return player;
			}
			player = document.getElementsByClassName(key)[0];
			if (player) {
				return player;
			}
			player = false;
			return player;
		},
		on: function() {
			var site = check.site("id");
			if (site !== "unknow") {
				set.init();
				set.create();
				btn.create();
			}
		}
	}
	var btn = {
		interface: ["https://z1.m1907.cn/?eps=0&jx=", "https://vip.parwix.com:4433/player/?url=",
			"https://vip.bljiex.com/?v=", "https://lecurl.cn/?url=", "https://jx.m3u8.tv/jiexi/?url=",
			"https://api.leduotv.com/wp-api/ifr.php?isDp=1&vid=", "https://okjx.cc/?url=",
			"https://m2090.com/?url=", "http://51wujin.net/?url=", "https://vip.2ktvb.com/player/?url=",
			"https://660e.com/?url=", "https://api.sigujx.com/?url=", "https://jiexi.janan.net/jiexi/?url=",
			"https://jx.618g.com/?url=", "https://jx.ergan.top/?url=", "https://api.147g.cc/m3u8.php?url=",
			"http://17kyun.com/api.php?url=", "", "", ""
		],
		backupInterface: [],
		get: function(key) {
			var res;
			if (/^\d+$/.test(key)) {
				res = this.interface[key];
			} else if (key === "length") {
				res = this.interface.length;
			} else if (key === "backup") {
				res = this.backupInterface;
			} else {
				res = this.interface;
			}
			return res;
		},
		edit: function(key, value) {
			if (/^\d+$/.test(key)) {
				this.interface[key] = value;
			}
		},
		backup: function() {
			for (let i in this.interface) {
				this.backupInterface[i] = this.interface[i];
			}
		},
		init: function() {
			var interfaceData = set.get("user-interface");
			for (let i in interfaceData) {
				if (this.get(i) === interfaceData[i]) {
					delete interfaceData[i];
				} else if (interfaceData[i]) {
					this.edit(i, interfaceData[i]);
				}
			}
			set.edit("user-interface", interfaceData);
		},
		create: function() {
			var box = document.createElement("div");
			box.style = "cursor: pointer; position: fixed; top: " + set.get("box-top") + ";right: " + set
				.get("box-right") + ";z-index: 99999;";
			box.id = "vipParseBtnBox";
			var main = this.createMain();
			var menu = this.createMenu();
			box.appendChild(main);
			box.appendChild(menu);
			document.body.insertBefore(box, document.body.firstChild);
		},
		createMain: function() {
			var main = document.createElement("div");
			var pH = set.get("main-height");
			pH = (pH.slice(0, pH.search("px")) - 30) / 2;
			var pW = set.get("main-width");
			pW = (pW.slice(0, pW.search("px")) - 50) / 2;
			main.style =
				"height:" + set.get("main-height") + ";width:" + set.get("main-width") + ";background:" +
				set.get("background") + ";border-radius:" + set.get("main-border-radius") +
				";box-sizing:border-box;padding:" + pH + "px " + pW + "px;";
			main.id = "vipParseBtnMain";
			main.innerHTML =
				"<svg height='30' width='50'><polygon points='20,6 35,15 20,24' style='fill:white;'/></svg>";
			manipulate.on(main, btn.clickMain, btn.longPressMain);
			return main;
		},
		createMenu: function() {
			var menu = document.createElement("div");
			var posTop = set.get("main-height");
			posTop = posTop.slice(0, posTop.search("px"));
			posTop = parseFloat(posTop) + 5;
			menu.style =
				"display:none;width:" + set.get("menu-width") + ";height:" + set.get("menu-height") +
				";overflow:hidden;position:absolute;top:" + posTop + "px;right:0px;border-radius:" + set
				.get(
					"menu-border-radius") + ";transition: all 0.2s";
			menu.id = "vipParseBtnMenu";
			var innerMenu = document.createElement("div");
			innerMenu.style = "width:115%;height:100%;overflow-y:scroll;overflow-x:hidden;";
			for (let i = 0; i < this.get("length"); i++) {
				innerMenu.appendChild(this.createItem(i, this.get(i)));
			}
			menu.appendChild(innerMenu);
			return menu;
		},
		createItem: function(i, url) {
			var item = document.createElement("span");
			item.style =
				"color:" + set.get("item-color") + ";font-size:" + set.get("item-font-size") +
				";display:block;padding:10px 6px 6px 10px;width:calc(100% + 30px);background:" + set.get(
					"background") + ";border-bottom:white solid;"
			item.setAttribute("url", url);
			item.innerText = "播放线路 " + ((i + 1) < 10 ? "0" : "") + (i + 1);
			item.onclick = function() {
				url = check.url(url);
				if (url) {
					btn.clickItem(url);
					console.log("当前解析接口:" + url);
				} else {
					var msg = "当前解析接口为空，或接口URL错误";
					console.log(msg);
					alert(msg);
				}
			}
			item.onmouseover = function() {
				this.style.background = set.get("item-color");
				this.style.color = set.get("background");
			}
			item.onmouseleave = function() {
				this.style.background = set.get("background");
				this.style.color = set.get("item-color");
			}
			return item;
		},
		clickMain: function() {
			var menu = document.getElementById("vipParseBtnMenu");
			if (menu.style.display !== "none") {
				menu.style.display = "none";
			} else {
				menu.style.display = "block";
			}
		},
		longPressMain: function() {
			var setting = document.getElementById("vipParseBtnSetting");
			if (setting.style.display !== "none") {
				setting.style.display = "none";
			} else {
				setting.style.display = "block";
			}
		},
		clickItem: function(url) {
			var newPlayer = document.createElement("iframe");
			newPlayer.frameBorder = "no";
			newPlayer.width = "100%";
			newPlayer.height = "100%";
			newPlayer.allowFullscreen = "true";
			newPlayer.allowTransparency = "true";
			newPlayer.scrolling = "no";
			newPlayer.id = "newPlayerParseIframe";
			newPlayer.src = url + location.href;
			var player = vip.get(check.site("id"), check.ua());
			if (player) {
				var originHeight = player.clientHeight;
				player.innerHTML = "";
				player.style.height = originHeight + "px";
				player.appendChild(newPlayer);
			}
		}
	}
	vip.on();
})();
