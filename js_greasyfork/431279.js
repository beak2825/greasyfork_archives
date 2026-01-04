// ==UserScript==
// @name         简法主页功能增强
// @namespace    http://tampermonkey.net/
// @version      0.23
// @description  在简法主页上增加其他个性化设置
// @author       tutu辣么可爱
// @include      *://*.jianfast.*
// @icon         https://s3.bmp.ovh/imgs/2021/08/2a5feb8f5f886e70.png
// @grant	 GM_openInTab
// @grant        GM_info
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/431279/%E7%AE%80%E6%B3%95%E4%B8%BB%E9%A1%B5%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/431279/%E7%AE%80%E6%B3%95%E4%B8%BB%E9%A1%B5%E5%8A%9F%E8%83%BD%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
	//addLoadEvent方法用于添加window.onload方法且window.onload不会相互覆盖覆盖
	function addLoadEvent(newOnload) {
		var oldOnload = window.onload;
		if (typeof window.onload != 'function') {
			window.onload = newOnload;
		} else {
			window.onload = function() {
				oldOnload();
				newOnload();
			}
		}
	}
	//store为本地存储功能
	var store = {
		//set方法在localstorage中修改指定JSON数据
		set: function(key, val) {
			if (!val) {
				return;
			}
			try {
				var json = JSON.stringify(val);
				if (typeof JSON.parse(json) === "object") { // 验证一下是否为JSON字符串防止保存错误
					localStorage.setItem(key, json);
				}
			} catch (e) {
				return false;
			}
		},
		//get方法在localstorage中获取指定JSON数据
		get: function(key) {
			if (this.has(key)) {
				return JSON.parse(localStorage.getItem(key));
			}
		},
		//has方法在localstorage中查询指定JSON数据是否存在
		has: function(key) {
			if (localStorage.getItem(key)) {
				return true;
			} else {
				return false;
			}
		},
		//del方法在localstorage中删除指定JSON数据
		del: function(key) {
			localStorage.removeItem(key);
		}
	};
	//settings对象为设置项
	var settings = {
		settingsData: {
			searchBar: true, //true:显示搜索栏;false:隐藏搜索栏
			siteBar: true, //true:显示书签栏;false:隐藏书签栏
			searchEngine: true, //true:当前标签页打开搜索结果;false:新标签页打开搜索结果
			bookMarks: true, //true:当前标签页打开书签网页;false:新标签页打开书签网页
			settingsPurify: true, //true:开启广告拦截净化;false:关闭广告拦截净化
			hideRandBg: true, //true:开启主页随机背景入口隐藏;false:关闭主页随机背景入口隐藏
			serchForcast: true, //true:开启搜索栏联想词预测;false:关闭搜索栏联想词预测
			customJsCss: false, //true:开启自定义JS/CSS;false:关闭自定义JS/CSS
			customJsCssData: {}, //用于存储自定义JS/CSS
			bookmarksFolder: false, //true:添加入口;false:不添加入口
			bookmarksUrl: "chrome://bookmarks", //用于存储浏览器书签地址
			currentWeather: false, //true:添加天气;false:不添加天气
			weatherCity: "", //实况天气城市，若为空则自动ip定位到地级市
			weatherAppId: "", //实况天气AppId，若为空则使用默认AppId
			weatherAppSecret: "" //实况天气AppSecret，若为空则使用默认AppSecret
		},
		backupData: {}, //用于备份数据
		//get方法获取settings对象settingsData属性
		get: function(key) {
			return this.settingsData[key];
		},
		//get方法获取settings对象settingsData所有属性
		getAll: function() {
			return this.settingsData;
		},
		//getBackup方法获取settings对象backupData所有属性
		getBackup: function() {
			return this.backupData;
		},
		//set方法设置settings对象settingsData属性
		set: function(key, value) {
			if (typeof value === "boolean" || /^(customJsCssData|bookmarksUrl|weather)/i.test(key)) {
				this.settingsData[key] = value;
			} else {
				console.log("value错误");
			}
		},
		//save方法用于保存设置
		save: function() {
			store.set("settingsData", this.getAll());
		},
		//initData方法初始化settings对象属性
		initData: function() {
			this.backupData = this.settingsData;
			var localData = store.get("settingsData");
			var settingsData = this.settingsData;
			if (localData) {
				this.settingsData = {
					...settingsData,
					...localData
				};
			} else {
				store.set("settingsData", this.settingsData);
			}
		},
		//init方法初始化搜索引擎与书签的打开方式
		init: function() {
			this.initData();
			newSettingsPageFn.init();
			searchEngine.init();
			bookMarks.init();
			serchForcast.init();
			settingsPurify.init();
			hideRandBg.init();
			customJsCss.init();
			bookmarksFolder.init();
			currentWeather.init();
			console.log("简法主页功能增强:初始化完成");
		},
		//monitor方法用于检错、监控修改结果
		monitor: function() {
			var Timer = setInterval(function() {
				searchEngine.monitor();
				bookMarks.monitor();
				serchForcast.monitor();
				settingsPurify.monitor();
				hideRandBg.monitor();
				customJsCss.monitor();
				bookmarksFolder.monitor();
				currentWeather.monitor();
			}, 500);
			console.log("简法主页功能增强:检错程序启动(定时器ID:" + Timer + ")");
		},
		//on方法用于启动整个程序
		on: function() {
			if (location.hostname === 'www.jianfast.com' && (location.pathname === "/" || location
					.pathname === "/m")) {
				console.log("简法主页功能增强:主程序启动");
				this.init();
				this.monitor();
			}
		}
	}
	//newSettingsPageFn为增强设置页
	var newSettingsPageFn = {
		optData: [{
			tittle: "显示主页搜索栏",
			value: "searchBar",
			choice: [{
				t: "开启显示",
				v: true
			}, {
				t: "关闭显示",
				v: false
			}]
		}, {
			tittle: "显示主页书签栏",
			value: "siteBar",
			choice: [{
				t: "开启显示",
				v: true
			}, {
				t: "关闭显示",
				v: false
			}]
		}, {
			tittle: "搜索结果打开方式",
			value: "searchEngine",
			choice: [{
				t: "当前标签页",
				v: true
			}, {
				t: "新标签页",
				v: false
			}]
		}, {
			tittle: "主页书签打开方式",
			value: "bookMarks",
			choice: [{
				t: "当前标签页",
				v: true
			}, {
				t: "新标签页",
				v: false
			}]
		}, {
			tittle: "搜索栏联想词预测",
			value: "serchForcast",
			choice: [{
				t: "开启预测",
				v: true
			}, {
				t: "关闭预测",
				v: false
			}]
		}, {
			tittle: "广告拦截净化",
			value: "settingsPurify",
			choice: [{
				t: "开启净化",
				v: true
			}, {
				t: "关闭净化",
				v: false
			}]
		}, {
			tittle: "隐藏随机背景入口",
			value: "hideRandBg",
			choice: [{
				t: "开启隐藏",
				v: true
			}, {
				t: "关闭隐藏",
				v: false
			}]
		}, {
			tittle: "自定义JS/CSS",
			value: "customJsCss",
			choice: [{
				t: "开启自定义",
				v: true
			}, {
				t: "关闭自定义",
				v: false
			}]
		}, {
			tittle: "浏览器书签",
			value: "bookmarksFolder",
			choice: [{
				t: "添加入口",
				v: true
			}, {
				t: "关闭功能",
				v: false
			}]
		}, {
			tittle: "添加实况天气",
			value: "currentWeather",
			choice: [{
				t: "添加天气",
				v: true
			}, {
				t: "关闭功能",
				v: false
			}]
		}, {
			tittle: "关于脚本",
			type: "note",
			noteData: [{
				l: "当前版本",
				r: `<span id='versionBtn'>version${GM_info.script.version}</span>`
			}, {
				l: "版本更新",
				r: "<span id='updateBtn'>GreasyFork</span>"
			}, {
				l: "反馈建议",
				r: "<span id='contactBtn'>点此处反馈</span>"
			}, {
				l: "导入配置",
				r: "<span id='importSetBtn'>点此处导入</span>"
			}, {
				l: "导出配置",
				r: "<span id='exportSetBtn'>点此处导出</span>"
			}, {
				l: "重置配置",
				r: "<span id='recoverSetBtn'>点此处重置</span>"
			}, {
				l: "天气接口",
				r: "<span id='weatherApiBtn'>点此处前往</span>"
			}]
		}],
		//clickFn方法为设置选项按钮的点击功能
		clickFn: function(id, key) {
			var Obj = document.getElementById(id);
			var setValue = settings.get(key);
			var optValue = Obj.value;
			if (setValue !== optValue) {
				this.selectBtn(Obj, key, optValue);
				this.needSave();
			}
		},
		//selectBtn方法用于选择按钮
		selectBtn: function(target, key, value) {
			settings.set(key, value);
			var targetPar = target.parentElement.children;
			for (let i = 0; i < targetPar.length; i++) {
				if (targetPar[i].value === value) {
					targetPar[i].style.border = "1px solid #2c7bf6";
					targetPar[i].style.color = "#2c7bf6";
				} else {
					targetPar[i].style.border = "1px solid rgba(0, 0, 0, 0.1)";
					targetPar[i].style.color = "";
				}
			}
		},
		//needSave方法用于显示保存按钮
		needSave: function() {
			saveFlag = true;
			var newSaveBox = document.getElementById("new-save-box");
			if (newSaveBox && newSaveBox.style.display === "none") {
				newSaveBox.style.display = "flex";
			}
			var tittleBox = document.getElementById("console-title-box");
			if (tittleBox && tittleBox.style.display !== "none") {
				tittleBox.style.display = "none";
			}
		},
		//createTittle方法创建一个盛放设置标题的元素对象
		createTittle: function(val) {
			var Box = document.createElement("div");
			Box.setAttribute("class", "console-bigTitle");
			Box.innerText = val;
			return Box;
		},
		//createChoiceBtn方法创建一个设置选项按钮对象
		createChoiceBtn: function(choice, id) {
			var Btn = document.createElement("div");
			var BtnID = id + "-" + choice.v;
			var key = id.slice("moreSet-Opt-".length);
			Btn.style =
				"padding: 0 10px;width: 35%;margin: 5px 10px;height: 25px;box-sizing: border-box;line-height: 23px;text-align: center;border-radius: 100px;font-size: 13px;border: 1px solid rgba(0, 0, 0, 0.1);cursor: pointer;user-select: none;transition: all .3s;";
			Btn.innerText = choice.t;
			Btn.value = choice.v;
			Btn.id = BtnID;
			Btn.onclick = function() {
				newSettingsPageFn.clickFn(BtnID, key);
			};
			if (settings.get(key) === choice.v) {
				Btn.style.border = "1px solid #2c7bf6";
				Btn.style.color = "#2c7bf6";
			}
			return Btn;
		},
		//createChoice方法创建一个设置选项按钮对象的集合对象
		createChoice: function(value, choice) {
			var Box = document.createElement("div");
			var BoxID = "moreSet-Opt-" + value;
			Box.style =
				"width:100%;display:flex;justify-content:center;flex-flow:row wrap;margin-top:15px;";
			Box.id = BoxID
			var Btn;
			if (Array.isArray(choice)) {
				for (let i = 0; i < choice.length; i++) {
					Btn = this.createChoiceBtn(choice[i], BoxID);
					Box.appendChild(Btn);
				}
			} else {
				Btn = this.createChoiceBtn(choice, BoxID);
				Box.appendChild(Btn);
			}
			return Box;
		},
		//createOpt方法创建一个完整的设置项对象
		createOpt: function(tittle, value, choice) {
			var ResObj = false;
			if (tittle && value && choice) {
				ResObj = document.createElement("div");
				var newTittle = this.createTittle(tittle);
				var newChoice = this.createChoice(value, choice);
				ResObj.appendChild(newTittle);
				ResObj.appendChild(newChoice);
			}
			return ResObj;
		},
		//createNoteText方法创建一个文字性(非选项)的提示对象
		createNoteText: function(data) {
			var textObj = document.createElement("div");
			textObj.style = "width:100%;margin:5px;";
			textObj.innerHTML = "<span>" + data.l + "</span>";
			if (data.r) {
				textObj.innerHTML += "<span> : </span><span style='color:black'>" + data.r + "</span>";
			}
			return textObj;
		},
		//createNoteData方法创建一个文字性的提示对象的集合对象
		createNoteData: function(noteData) {
			var newNoteBox = document.createElement("div");
			newNoteBox.style =
				"width: 60%;margin:20%;margin-top: 20px; text-align: center; line-height: 23px;";
			var newNoteText;
			if (Array.isArray(noteData)) {
				for (let i = 0; i < noteData.length; i++) {
					newNoteText = this.createNoteText(noteData[i]);
					newNoteBox.appendChild(newNoteText);
				}
			} else {
				newNoteText = this.createNoteText(noteData);
				newNoteBox.appendChild(newNoteText);
			}
			return newNoteBox;
		},
		//createNote方法创建一个文字性的完整的提示对象
		createNote: function(tittle, noteData) {
			var ResObj = false;
			if (tittle && noteData) {
				ResObj = document.createElement("div");
				var newTittle = this.createTittle(tittle);
				var newNote = this.createNoteData(noteData);
				ResObj.appendChild(newTittle);
				ResObj.appendChild(newNote);
			}
			return ResObj;
		},
		//createPage方法创建一个增强设置页
		createPage: function(val) {
			var settingBox = document.createElement("div");
			settingBox.id = "console-moreSet-content";
			settingBox.style =
				"width: 100%;height: 100px;flex-grow: 1;overflow: auto;box-sizing: border-box;padding: 0 25px 0 0;margin: 10px 0;display: none";
			var newOpt;
			for (let i = 0; i < val.length; i++) {
				if (val[i].type) {
					if (val[i].type === "note") {
						newOpt = this.createNote(val[i].tittle, val[i].noteData);
						settingBox.appendChild(newOpt);
					}
				} else {
					newOpt = this.createOpt(val[i].tittle, val[i].value, val[i].choice);
					settingBox.appendChild(newOpt);
				}
			}
			document.getElementById("console-box").appendChild(settingBox);
		},
		//createMenu方法在设置菜单中创建增强设置功能入口
		createMenu: function() {
			var menuBtn = document.createElement("div");
			menuBtn.setAttribute("class", "console-menu-btn");
			menuBtn.id = "moreSetBtn";
			menuBtn.innerText = "增强设置";
			menuBtn.onclick = this.on;
			document.getElementById("console-menu-main").appendChild(menuBtn);
		},
		//createSaveBtn方法创建一个保存按钮对象
		createSaveBtn: function() {
			var oldSaveBox = document.getElementById("save-box");
			var newSaveBox = document.createElement("div");
			newSaveBox.style.display = "none";
			newSaveBox.id = "new-save-box";
			var newSaveBtn = document.createElement("div");
			newSaveBtn.style =
				"font-size: 14px;display: flex;justify-content: center;align-items: center;background-color: #4486f6;color: white;height: 25px;width: 120px;border-radius: 100px;margin-right: 10px;cursor: pointer;";
			var newSaveIcon = document.createElement("img");
			newSaveIcon.style = "width: 13px;height: 13px;margin-right: 5px;";
			newSaveIcon.setAttribute("src", "/static/home/images/console/saveicon.svg");
			var newSaveTittle = document.createElement("span");
			newSaveTittle.innerText = "保存并应用";
			newSaveBtn.onclick = function() {
				if (saveFlag) {
					settings.save();
					saveFlag = false;
					console.log("保存增强设置");
					setTimeout(function() {
						var msgBox = document.getElementById("msg-box");
						msgBox.style =
							"opacity:0.8;margin-top:50px;display:inline-block;";
						msgBox.innerText = "增强设置保存成功";
						setTimeout(function() {
							location.reload();
						}, 500);
					}, 300);
				}
				document.getElementById("console-close-btn").click();
			};
			newSaveBtn.appendChild(newSaveIcon);
			newSaveBtn.appendChild(newSaveTittle);
			newSaveBox.appendChild(newSaveBtn);
			oldSaveBox.parentElement.insertBefore(newSaveBox, oldSaveBox);
		},
		//on方法是增强设置页面的启动方法
		on: function() {
			var moreSetPage = document.getElementById("console-moreSet-content");
			if (moreSetPage) {
				document.getElementsByClassName("console-title-img")[0].src =
					"/static/home/images/console/set1.svg";
				document.getElementsByClassName("console-title")[0].innerText = "增强设置";
				document.getElementById("console-menu").style.display = "none";
				moreSetPage.style.display = "block";
			} else {
				console.log("增强设置页不存在");
			}
		},
		//off方法是增强设置页面的关闭/隐藏方法
		off: function() {
			var moreSetPage = document.getElementById("console-moreSet-content");
			var newSaveBox = document.getElementById("new-save-box");
			if (moreSetPage && moreSetPage.style.display !== "none") {
				moreSetPage.style.display = "none";
			}
			if (newSaveBox.style.display !== "none") {
				newSaveBox.style.display = "none";
			}
		},
		//addExtEvent方法用于增加一些额外的事件
		addExtEvent: function() {
			var target;
			//当前版本
			target = document.getElementById("versionBtn");
			if (target) {
				target.onclick = function() {
					var msg =
						`脚本名称:${GM_info.script.name}\n当前版本:${GM_info.script.version}\n本作作者:${GM_info.script.author}\n检查版本更新、使用帮助等功能，请点击"关于脚本"下方的"GreasyFork"文字`;
					console.log(msg);
					alert(msg);
				}
				target.onmouseover = function() {
					document.getElementById("versionBtn").style.color = "";
				}
				target.onmouseleave = function() {
					document.getElementById("versionBtn").style.color = "grey";
				}
				target.style.cursor = "pointer";
				target.style.color = "grey";
			}
			//版本更新
			target = document.getElementById("updateBtn");
			if (target) {
				target.onclick = function() {
					location.href = "https://greasyfork.org/zh-CN/scripts/431279";
				}
				target.onmouseover = function() {
					document.getElementById("updateBtn").style.color = "";
				}
				target.onmouseleave = function() {
					document.getElementById("updateBtn").style.color = "grey";
				}
				target.style.cursor = "pointer";
				target.style.color = "grey";
			}
			//反馈建议
			target = document.getElementById("contactBtn");
			if (target) {
				target.onclick = function() {
					location.href = "https://greasyfork.org/zh-CN/scripts/431279/feedback";
				}
				target.onmouseover = function() {
					document.getElementById("contactBtn").style.color = "";
				}
				target.onmouseleave = function() {
					document.getElementById("contactBtn").style.color = "grey";
				}
				target.style.cursor = "pointer";
				target.style.color = "grey";
			}
			//导入配置
			target = document.getElementById("importSetBtn");
			if (target) {
				target.onclick = function() {
					var data = prompt("在这粘贴需要导入的配置数据:");
					data = data.trim();
					try {
						if (data !== null && data !== "") {
							data = JSON.parse(data);
							store.set("settingsData", data.settingsData);
							alert("导入配置成功");
							location.reload();
						}
					} catch (e) {
						alert("配置数据错误，导入配置失败");
					}
				}
				target.onmouseover = function() {
					document.getElementById("importSetBtn").style.color = "";
				}
				target.onmouseleave = function() {
					document.getElementById("importSetBtn").style.color = "grey";
				}
				target.style.cursor = "pointer";
				target.style.color = "grey";
			}
			//导出配置
			target = document.getElementById("exportSetBtn");
			if (target) {
				target.onclick = function() {
					var exportBox = document.createElement("input");
					exportBox.value = "{\"settingsData\":" + JSON.stringify(settings.getAll()) + "}";
					document.body.appendChild(exportBox);
					exportBox.select();
					document.execCommand('copy');
					exportBox.remove();
					alert("配置数据已成功导出到剪贴板");
				}
				target.onmouseover = function() {
					document.getElementById("exportSetBtn").style.color = "";
				}
				target.onmouseleave = function() {
					document.getElementById("exportSetBtn").style.color = "grey";
				}
				target.style.cursor = "pointer";
				target.style.color = "grey";
			}
			//重置配置
			target = document.getElementById("recoverSetBtn");
			if (target) {
				target.onclick = function() {
					var msg = "即将重置配置数据\n点击确认开始重置";
					if (confirm(msg)) {
						var data = settings.getBackup();
						if (JSON.stringify(data).trim() !== "{}") {
							store.set("settingsData", data);
							alert("配置数据重置成功");
							location.reload();
						} else {
							msg = "重置配置功能错误,请联系脚本制作者\n点击确认前往反馈";
							if (confirm(msg)) {
								var btn = document.getElementById("contactBtn");
								if (btn) {
									btn.click();
								}
							}
						}
					}
				}
				target.onmouseover = function() {
					document.getElementById("recoverSetBtn").style.color = "";
				}
				target.onmouseleave = function() {
					document.getElementById("recoverSetBtn").style.color = "grey";
				}
				target.style.cursor = "pointer";
				target.style.color = "grey";
			}
			//天气接口
			target = document.getElementById("weatherApiBtn");
			if (target) {
				target.onclick = function() {
					alert("此API来源于网络，非本脚本开发者所有\n如有天气API方面的问题，请联系API开发者");
					open("https://yiketianqi.com/");
				}
				target.onmouseover = function() {
					this.style.color = "";
				}
				target.onmouseleave = function() {
					this.style.color = "grey";
				}
				target.style.cursor = "pointer";
				target.style.color = "grey";
			}
			//自定义JS/CSS
			target = document.getElementById("moreSet-Opt-customJsCss-true");
			if (target) {
				target.addEventListener("click", function() {
					customJsCss.clickFn();
				});
			}
			//浏览器书签
			target = document.getElementById("moreSet-Opt-bookmarksFolder-true");
			if (target) {
				target.addEventListener("click", function() {
					bookmarksFolder.clickFn();
				});
			}
			//实况天气
			target = document.getElementById("moreSet-Opt-currentWeather-true");
			if (target) {
				target.addEventListener("click", function() {
					currentWeather.clickFn();
				});
			}
		},
		//initPC方法是针对PC模式的增强设置初始化方法,是增强设置的启动方法
		initPC: function() {
			var consoleBox = document.getElementById("console-box");
			if (consoleBox) {
				var closeBtn = document.getElementById("console-close-btn");
				if (closeBtn) {
					closeBtn.addEventListener("click", newSettingsPageFn.off);
				}
				this.createMenu();
				this.createSaveBtn();
				this.createPage(this.optData);
				this.addExtEvent();
			}
		},
		//initMobile方法是针对Mobile模式的增强设置初始化方法,是增强设置的启动方法
		initMobile: function() {
			var menuWrap = document.getElementById("menu-wrap");
			if (menuWrap) {
				var menuObj = menuWrap.children[1];
				if (menuObj && menuObj.tagName === "UL") {
					var newOpt = document.createElement("li");
					newOpt.style = "cursor:pointer;"
					newOpt.innerHTML = "<img src='/static/home/images/console/set1.svg'/><span>增强设置</span>";
					newOpt.onclick = function() {
						var res = confirm("增强设置请前往电脑版操作,点击确认前往电脑版");
						if (res) {
							location.href = "https://www.jianfast.com/?pc=1";
						}
					}
					menuObj.appendChild(newOpt);
				}
				var menuNotice = document.getElementById("menu-notice");
				var newNotice = "<div>" + menuNotice.children[1].innerText +
					"</div><div>对增强设置进行修改请前往电脑版网页操作</div><div>增强设置-搜索结果打开方式仅对电脑版生效</div>";
				menuNotice.children[1].innerHTML = newNotice;
			}
		},
		//init方法调用initPC方法与initMobile方法初始化增强设置,是对外统一调用的初始化方法
		init: function() {
			this.initPC();
			this.initMobile();
		}
	};
	//searchEngine对象为搜索引擎项
	var searchEngine = {
		//change方法用于改变搜索按钮类型，从而便于覆盖搜索打开方式
		change: function() {
			var searchBtn = document.getElementById("search-btn");
			if (searchBtn) {
				searchBtn.type = "text";
			}
		},
		//click方法用于覆盖原搜索按钮点击方法
		click: function() {
			if (location.href.search("jianfast.com/m") === -1) {
				var searchBar = document.getElementById("search");
				var url = searchBar.getAttribute("data-engine-start");
				var val = searchBar.value;
				if (settings.get("searchEngine")) {
					location.href = url + val;
				} else {
					open(url + val);
				}
			}
		},
		//enter方法用于覆盖原回车搜索方法
		enter: function(event) {
			if (event.keyCode === 13) {
				searchEngine.click();
			}
		},
		//display方法用于显示或隐藏搜索栏
		display: function() {
			var searchBar = document.getElementById("search-wrap");
			if (searchBar) {
				if (settings.get("searchBar") && searchBar.style.display === "none") {
					searchBar.style.display = "flex";
				} else if (!settings.get("searchBar") && searchBar.style.display !== "none") {
					searchBar.style.display = "none";
				}
			}
		},
		//init方法用于初始化搜索引擎，覆盖新方法
		init: function() {
			searchEngine.change();
			this.display();
			var searchBtn = document.getElementById("search-btn");
			if (searchBtn) {
				searchBtn.onclick = this.click;
			}
			var searchBar = document.getElementById("search");
			if (searchBar) {
				searchBar.onkeydown = this.enter;
			}
		},
		//monitor方法用于检错、监控修改结果，若出错则调用init方法重新覆盖
		monitor: function() {
			this.display();
			var searchForm = document.getElementById("search-form");
			var searchBar = document.getElementById("search");
			var searchBtn = document.getElementById("search-btn");
			if ((searchBar && searchBar.onkeydown === null) || (searchBtn && searchBtn.type !== "text") || (
					searchBtn && searchBtn.onclick === null)) {
				this.init();
			}
		}
	}
	//bookMarks对象为主页书签项
	var bookMarks = {
		//change方法用于改变书签打开方式
		change: function(Obj) {
			if (Obj.tagName === "A") {
				if (settings.get("bookMarks") && Obj.target !== "") {
					Obj.target = "";
				} else if (!settings.get("bookMarks") && Obj.target !== "_blank") {
					Obj.target = "_blank";
				}
			}
		},
		//display方法用于显示或隐藏书签栏
		display: function() {
			var siteBar = document.getElementById("site-wrap");
			if (siteBar) {
				if (settings.get("siteBar") && siteBar.style.display === "none") {
					siteBar.style.display = "flex";
				} else if (!settings.get("siteBar") && siteBar.style.display !== "none") {
					siteBar.style.display = "none";
				}
			}
		},
		//init方法用于遍历书签并调用change方法改变打开方式
		init: function() {
			this.display();
			var siteBox, aBox, aBoxLen;
			var idArray = ["site-box", "site-wrap"];
			for (let i = 0; i < idArray.length; i++) {
				siteBox = document.getElementById(idArray[i])
				if (siteBox) {
					break;
				}
			}
			if (siteBox && siteBox.childElementCount > 0) {
				for (let i = 0; i < siteBox.childElementCount; i++) {
					this.change(siteBox.children[i]);
				}
			}
		},
		//monitor方法用于检错程序
		monitor: function() {
			this.init();
		}
	}
	//serchForcast搜索栏联想词预测相关功能
	var serchForcast = {
		display: function() {
			var keywordBox = document.getElementById("search-keyword-box");
			if (keywordBox && !settings.get("serchForcast")) {
				keywordBox.remove();
			}
		},
		//click方法用于覆盖原联想词点击方法
		click: function(target) {
			var searchBar = document.getElementById("search");
			searchBar.value = target.innerText;
			searchEngine.click();
		},
		//mouseOver方法用于覆盖原联想词鼠标事件(置于上方)方法
		mouseOver: function(target) {
			var targetPare = target.parentElement;
			if (targetPare && targetPare.childElementCount > 0) {
				for (let i = 0; i < targetPare.childElementCount; i++) {
					this.mouseLeave(targetPare.children[i]);
				}
			}
			target.style = "background-color: rgb(241, 241, 241);";
		},
		//mouseLeave方法用于覆盖原联想词鼠标事件(离开)方法
		mouseLeave: function(target) {
			target.style = "background-color: rgba(255, 255, 255, 0.3);";
		},
		//change方法用于改变搜索栏联想词相关功能
		change: function(keywordBox) {
			if (keywordBox) {
				keywordBox.innerHTML = keywordBox.innerHTML; //整体覆盖删除原方法
				var keyword = keywordBox.children;
				if (keyword.length > 0) {
					for (let i = 0; i < keyword.length; i++) { //增加新方法
						keyword[i].onmouseover = function() {
							serchForcast.mouseOver(keyword[i]);
						};
						keyword[i].onmouseleave = function() {
							serchForcast.mouseLeave(keyword[i]);
						};
						keyword[i].onclick = function() {
							serchForcast.click(keyword[i]);
						};
					}
				}
			}
		},
		//close方法用于关闭设置时若未保存重置按键值
		close: function() {
			var localData = store.get("settingsData");
			var localValue = localData.serchForcast;
			var settingValue = settings.get("serchForcast");
			if (typeof localValue === "boolean" && typeof settingValue === "boolean" && localValue !==
				settingValue) {
				var targetBtn = document.getElementById("moreSet-Opt-serchForcast-" + localValue);
				if (targetBtn) {
					targetBtn.click();
				}
				targetBtn = document.getElementById("new-save-box");
				if (targetBtn && targetBtn.style.display !== "none") {
					targetBtn.style.display = "none";
				}
			}
		},
		//init方法用于初始化相关功能
		init: function() {
			addLoadEvent(this.display);
			this.change();
			var closeBtn = document.getElementById("console-close-btn");
			if (closeBtn) {
				closeBtn.addEventListener("click", serchForcast.close);
			}
		},
		//monitor方法用于检错程序
		monitor: function() {
			var keywordBox = document.getElementById("search-keyword-box");
			if (keywordBox && keywordBox.childElementCount > 0) {
				var keywordInitFlag = false;
				var keyword = keywordBox.children;
				for (let i = 0; i < keyword.length; i++) {
					if (keyword[i].onmouseover === null || keyword[i].onmouseleave === null || keyword[i]
						.onclick === null) {
						keywordInitFlag = true;
						break;
					}
				}
				if (keywordInitFlag) {
					this.change(keywordBox);
				}
			}
		}
	};
	//settingsPurify为广告拦截净化功能
	var settingsPurify = {
		//init方法用于初始化净化广告
		init: function() {
			var adObj = document.getElementsByClassName("console-bottom-ad");
			if (adObj && adObj.length > 0) {
				for (let i = 0; i < adObj.length; i++) {
					if (settings.get("settingsPurify") && adObj[i].style.display !== "none") {
						adObj[i].style.display = "none";
					} else if (!settings.get("settingsPurify") && adObj[i].style.display === "none") {
						adObj[i].style.display = "";
					}
				}
			}
			adObj = document.getElementById("hongbao-btn");
			if (adObj) {
				if (settings.get("settingsPurify") && adObj.style.display !== "none") {
					adObj.style.display = "none";
				} else if (!settings.get("settingsPurify") && adObj.style.display === "none") {
					adObj.style.display = "";
				}
			}
			var bottomBtnBox = document.getElementById("console-bottom-btn-box");
			if (bottomBtnBox.childElementCount > 0) {
				bottomBtnBox = bottomBtnBox.children;
				var bottomBtn;
				for (let i = 0; i < bottomBtnBox.length; i++) {
					bottomBtn = bottomBtnBox[i];
					if (bottomBtn) {
						if (settings.get("settingsPurify")) {
							if (bottomBtn.innerText === "设为主页") {
								bottomBtn.innerText = "移动版";
								bottomBtn.href = "/m";
								bottomBtn.target = "";
							} else if (bottomBtn.innerText === "关于") {
								bottomBtn.innerText = "问题反馈";
								bottomBtn.href = "/contact";
								bottomBtn.target = "_blank";
							}
						} else if (!settings.get("settingsPurify")) {
							if (bottomBtn.innerText === "设为主页") {
								bottomBtn.innerText = "设为主页";
								bottomBtn.href = "/zhuye";
								bottomBtn.target = "_blank";
							} else if (bottomBtn.innerText === "关于") {
								bottomBtn.innerText = "关于";
								bottomBtn.href = "/about";
								bottomBtn.target = "_blank";
							}
						}
					}
				}
			}
		},
		//monitor方法用于检错程序
		monitor: function() {
			this.init();
		}
	}
	//hideRandBg为主页随机背景入口隐藏功能
	var hideRandBg = {
		//init方法用于初始化入口隐藏
		init: function() {
			var randBgBtn = document.getElementById("rand-bg-btn");
			if (randBgBtn) {
				if (settings.get("hideRandBg") && randBgBtn.style.display !== "none") {
					randBgBtn.style.display = "none";
				} else if (!settings.get("hideRandBg") && randBgBtn.style.display === "none") {
					randBgBtn.style.display = "";
				}
			}
		},
		//monitor方法用于检错程序
		monitor: function() {
			this.init();
		}
	}
	//自定义JS/CSS
	var customJsCss = {
		getData: function(type, originData, extraMsg) {
			var data, res;
			var msg = "请输入自定义" + type + "\n点击确定,保存自定义" + type + "; 点击取消,删除自定义" + type;
			if (extraMsg) {
				msg = msg + "\n\n" + extraMsg;
			}
			if (!originData) {
				originData = "";
			}
			data = prompt(msg, originData);
			if (typeof data === "string") {
				data = data.trim();
			}
			if (data) {
				res = data;
			} else {
				res = "";
			}
			console.log("自定义" + type + ":" + res);
			return res;
		},
		clickFn: function() {
			var data = settings.get("customJsCssData");
			data.js = this.getData("JS", data.js, "注意:extraCustomJS()为自定义JS的入口方法,请避免将方法名命名为extraCustomJS");
			data.css = this.getData("CSS", data.css);
			settings.set("customJsCssData", data);
			if (!data.js && !data.css) {
				alert("自定义JS/CSS已删除,将自动选择关闭自定义");
				var falseBtn = document.getElementById("moreSet-Opt-customJsCss-false");
				if (falseBtn) {
					falseBtn.click();
				}
			}
			newSettingsPageFn.needSave();
		},
		on: function() {
			var data = settings.get("customJsCssData");
			var eleBox = document.createElement("div");
			eleBox.id = "customJsCssBox";
			if (data.js) {
				var JSele = document.createElement("script");
				JSele.id = "customJS";
				JSele.innerHTML = "function extraCustomJS(){\r\n\ttry{\r\n\t" + data.js +
					"\r\n\t}catch(e){\r\n\tvar msg='自定义JS错误';\r\n\tconsole.log(msg);\r\n\talert(msg);\r\n\t}\r\n\t}\r\n\textraCustomJS();";
				eleBox.appendChild(JSele);
			}
			if (data.js) {
				var CSSele = document.createElement("style");
				CSSele.id = "customCSS";
				CSSele.innerHTML = data.css;
				eleBox.appendChild(CSSele);
			}
			var bodyFirstEle = document.body.children[0];
			document.body.insertBefore(eleBox, bodyFirstEle);
		},
		off: function() {
			var eleBox = document.getElementById("customJsCssBox");
			if (eleBox) {
				eleBox.remove();
			}
		},
		init: function() {
			if (settings.get("customJsCss")) {
				this.on();
			}
		},
		monitor: function() {
			var eleBox = document.getElementById("customJsCssBox");
			if (settings.get("customJsCss") && !eleBox) {
				this.on();
			} else if (!settings.get("customJsCss") && eleBox) {
				this.off();
			}
		}
	};
	//bookmarksFolder浏览器书签
	var bookmarksFolder = {
		//on方法用于启动
		on: function() {
			let bookmarksContainer = document.getElementById("site-box");
			if (bookmarksContainer && bookmarksContainer.firstElementChild) {
				let newSite = bookmarksContainer.querySelector("#open_bookmarks_folder_btn");
				if (newSite) {
					return false;
				}
				newSite = bookmarksContainer.firstElementChild.cloneNode(true);
				newSite.id = "open_bookmarks_folder_btn";
				bookmarksContainer.appendChild(newSite);
				newSite.href = "javascript:void(0);";
				console.log(bookmarksContainer.firstChild)
				newSite.getElementsByTagName("img")[0].src = "static/home/images/defaultsicon/9.png";
				newSite.getElementsByClassName("site-title")[0].innerText = "浏览器书签";
				newSite.onclick = function() {
					let url = settings.get("bookmarksUrl");
					url = url ? url : "chrome://bookmarks";
					GM_openInTab(url, false);
				}
			}
		},
		//off方法用于关闭
		off: function() {
			let target = document.getElementById("open_bookmarks_folder_btn");
			if (target) {
				target.remove();
			}
		},
		//clickFn方法为设置点击功能
		clickFn: function() {
			let url = settings.get("bookmarksUrl");
			url = url ? url : "chrome://bookmarks";
			url = prompt("请输入浏览器书签地址", url);
			if (url && typeof url === "string") {
				settings.set("bookmarksUrl", url);
				newSettingsPageFn.needSave();
			}
		},
		//init方法用于初始化添加一个书签按钮
		init: function() {
			if (settings.get("bookmarksFolder")) {
				this.on();
			}
		},
		//monitor方法用于检错程序
		monitor: function() {
			this.init();
		}
	}
	//currentWeather实况天气
	var currentWeather = {
		num: 0,
		ajax: function() {
			var id = settings.get("weatherAppId"),
				secret = settings.get("weatherAppSecret"),
				city = settings.get("weatherCity");
			id = id ? id : "23035354", secret = secret ? secret : "8YvlPNrz", city = city ?
				`&city${(/^\d+$/.test(city)?"id":"")}=${city}` : ""
			var url =
				`https://yiketianqi.com/api?unescape=1&version=v1&appid=${id}&appsecret=${secret}${city}`;
			console.log(url);
			$.ajax({
				url: url,
				type: "get",
				dataType: "json",
				success: function(res) {
					var data = res.data[0];
					var weather =
						`${res.city}-${data.wea}-${data.air_level.length>1?data.air_level:"空气"+data.air_level}-气温${data.tem}(${data.tem1}/${data.tem2})`
						.replaceAll("℃", "°C");
					var time = new Date().toLocaleString();
					$("#search").attr("placeholder", weather);
					localStorage.setItem("currentWeatherCache", JSON.stringify({
						"t": time,
						"w": weather
					}))
				}
			})
		},
		//on方法用于启动
		on: function() {
			if (this.num === 0) {
				var data = localStorage.getItem("currentWeatherCache");
				if (data) {
					data = JSON.parse(data);
					var pT = new Date(data.t),
						cT = new Date();
					var gap = cT.getTime() - pT.getTime();
					if (gap > 3 * 3600 * 1000 || cT.toLocaleDateString() !== pT.toLocaleDateString()) {
						this.ajax();
					} else if ($("#search").attr("placeholder") !== data.w) {
						$("#search").attr("placeholder", data.w);
					}
				} else {
					this.ajax();
				}
			}
			this.num = (this.num < 1200) ? (this.num + 1) : 0; //10min检查一次cache
		},
		//off方法用于关闭
		off: function() {
			$("#search").attr("placeholder", "");
		},
		// userInput方法为用户输入保存相关信息
		userInput: function(data, key, msg) {
			data = prompt(msg, data);
			if (data && typeof data === "string") {
				settings.set(key, data);
				newSettingsPageFn.needSave();
			}
		},
		//clickFn方法为设置点击功能
		clickFn: function() {
			let city = settings.get("weatherCity"),
				id = settings.get("weatherAppId"),
				secret = settings.get("weatherAppSecret"),
				msg;
			city = city ? city : "", id = id ? id : "", secret = secret ? secret : "";
			msg = "请输入实况天气城市名（可精确到区县一级，例如：浦东新区、崇明、朝阳）或城市id。若为空，则自动使用ip定位到地级市一级\n城市id请点击“关于脚本-天气接口”获取";
			this.userInput(city, "weatherCity", msg);
			msg = "请输入实况天气API的AppId。若为空，自动使用公共AppId\n个人AppId请点击“关于脚本-天气接口”获取";
			this.userInput(id, "weatherAppId", msg);
			msg = "请输入实况天气API的AppSecret。若为空，自动使用公共AppSecret\n个人AppSecret请点击“关于脚本-天气接口”获取";
			this.userInput(id, "weatherAppSecret", msg);
			localStorage.setItem("currentWeatherCache", "");
			this.num = 0;
		},
		//init方法用于初始化添加一个书签按钮
		init: function() {
			if (settings.get("currentWeather")) {
				this.on();
			}
		},
		//monitor方法用于检错程序
		monitor: function() {
			this.init();
		}
	}
	//全局变量配置
	var saveFlag = false; //saveFlag用于判断是否需要保存增强设置
	//启动主程序
	settings.on();
})();
