// ==UserScript==
// @name         阿里云盘搜索
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  在阿里云盘（web端）集成一个资源搜索面板
// @author       tutu辣么可爱
// @match        *://*.aliyundrive.com/drive*
// @icon         https://gw.alicdn.com/imgextra/i3/O1CN01aj9rdD1GS0E8io11t_!!6000000000620-73-tps-16-16.ico
// @require      https://greasyfork.org/scripts/444155-js-storedata/code/js-storeData.js?version=1045094
// @require      https://greasyfork.org/scripts/444044-js-domextend/code/js-domExtend.js?version=1054592
// @license      MIT License
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @note         1.0版本:发布首个版本
// @note         1.1版本:(1)新增几个搜索引擎和资源论坛;(2)样式优化;(3)增加一个脚本logo
// @note         1.2版本:(1)新增搜索设置面板;(2)优化快捷键;(3)样式优化
// @note         1.3版本:(1)大盘搜更换域名地址;(2)新增搜索引擎“毕方铺”聚合引擎;(3)修复重置bug并新增默认搜索引擎记忆功能
// @note         1.4版本:(1)修复侧栏“资源搜索”按钮不可见问题
// @downloadURL https://update.greasyfork.org/scripts/444043/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/444043/%E9%98%BF%E9%87%8C%E4%BA%91%E7%9B%98%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==
(function() {
	$domExtendJS();
	var searchBase = new storeDataJS("AliyundriveSearchJS-searchBase", {
		"UP云搜": `https://www.upyunso.com/search.html?keyword={k}`,
		"喵狸盘搜": `https://www.alipansou.com/search?k={k}`,
		"鸡盒盘": "https://jihepan.com/search.php?q={k}",
		"大盘搜": `https://dapanso.com/search?keyword={k}`,
		"找资源": `https://zhaoziyuan.me/so?filename={k}`,
		"毕方铺(聚合)": `https://www.iizhi.cn/resource/search/{k}`,
		"susu分享": "https://susuifa.com/?s={k}",
		"yunpan1": "https://yunpan1.com/?q={k}",
		"盘友社区": `https://www.panyoubbs.com/search.html?q={k}`,
		"阿里云盘搜": `https://aliyunpanso.cn/?type=forum&s={k}`,
		"云盘资源导航": `https://aliyun.panpanr.com`
	})
	var settingBase = new storeDataJS("AliyundriveSearchJS-settingBase", {
		"defaultEngine": "UP云搜",
		"hotKeyEnable": true
	})

	function createBox() {
		var box = $ele(
			`<div id="aliyunpan-searchTool" class="aliyunpan-searchTool-box" style="position: fixed; width: 100vw; height: 60vh; top: 0px; left: 0px; right: 0px; margin: auto; background: transparent; display: none"><div class="aliyunpan-searchTool-panel" style="border-radius: 10px; background: var(--background_tertiary); color: var(--context_primary); font-size: 14px; line-height: 1.5; font-weight: 500; width: 620px; height: 5em; max-width: 80vw; max-height: 80vh; position: absolute; inset: 0px; margin: auto; box-shadow: 0 0 1px 1px rgb(0 0 0 / 5%), 0 2px 8px rgb(28 28 32 / 6%), 0 16px 48px rgb(28 28 32 / 20%); border: 1px solid var(--divider_secondary); overflow: auto"><div class="aliyunpan-searchTool-bar" style="width: calc(100% - 2em); height: 2em; position: absolute; inset: 0px; margin: auto"></div></div></div>`
		)
		box.onclick = function(evt) {
			if (evt.target.id === "aliyunpan-searchTool") {
				this.attr("tool-mode") === "setting" ? switchSetting() : switchSearch();
			}
		}
		$ele("body").insert(box)
	}

	function createSearch() {
		var html =
			`<select style="background: var(--background_tertiary); font-size: 14px; line-height: 1.5; font-weight: 500; width: 8em; height: 100%; border: 0px; outline: 0px; text-align: center; cursor: pointer;">`;
		for (let i in searchBase.get()) {
			html += `<option>${i}</option>`;
		}
		html +=
			`</select><input type="text" placeholder="搜索内容" style="background: var(--background_tertiary); font-size: 14px; line-height: 1.5; font-weight: 500; width: calc(100% - 12em); height: 100%; border: 0px; outline: 0px; padding: 0px 1.2em"/><button style="background: var(--background_tertiary); font-size: 14px; line-height: 1.5; font-weight: 500; width: 4em; height: 100%; border: 0px; text-align: center; cursor: pointer">关闭</button>`;
		$ele("#aliyunpan-searchTool").attr("tool-mode", "search");
		$ele("#aliyunpan-searchTool .aliyunpan-searchTool-panel").css("height", "5em");
		$ele("#aliyunpan-searchTool .aliyunpan-searchTool-bar").css("height", "2em").eleHTML(html);
		$ele("#aliyunpan-searchTool select").eleVal(settingBase.get("defaultEngine")).onchange = function() {
			var k = this.value;
			if (k && typeof k === "string") {
				settingBase.set("defaultEngine", k, true);
			}
		}
		$ele("#aliyunpan-searchTool input").onkeyup = function(evt) {
			var button = $ele("button", this.parentElement);
			button.eleText(this.value ? "搜索" : "关闭");
			if (evt.key === "Enter") {
				button.click();
			}
		};
		$ele("#aliyunpan-searchTool button").onclick = function() {
			if (this.eleText() === "关闭") {
				switchSearch();
			} else {
				var url = searchBase.get($ele("#aliyunpan-searchTool select").value);
				open(url.replace("{k}", $ele("#aliyunpan-searchTool input").value));
			}
		}
	}

	function createSetting() {
		function createItem(k, v) {
			var item = $ele(
				`<div class="aliyunpan-searchTool-item" style="height:2em;width:100%;margin:0.5em 0"><input type="text" item-fn="key" readonly placeholder="${k}" style="background: var(--background_tertiary); font-size: 14px; line-height: 1.5; font-weight: 500; width: 8em; height: 100%; border: 1px solid; outline: 0px; padding: 0px 1.2em; border-radius: 1em 0px 0px 1em; cursor: not-allowed"/><input type="text" item-fn="val" readonly placeholder="${v}" style="background: var(--background_tertiary); font-size: 14px; line-height: 1.5; font-weight: 500; width: calc(100% - 12em); height: 100%; border: 1px solid; outline: 0px; padding: 0px 1.2em; cursor: not-allowed"/><button style="background: var(--background_tertiary); font-size: 14px; line-height: 1.5; font-weight: 500; width: 4em; height: 100%; border: 1px solid; text-align: center; cursor: pointer; border-radius: 0px 1em 1em 0px">修改</button></div>`
			)
			$ele("button", item).onclick = function() {
				if (this.eleText() === "修改") {
					saveFlag = true;
					this.eleText("确认")
					$ele("input", this.parentElement).attr("readonly", "").css("cursor", "");
				} else {
					this.eleText("修改")
					$ele("input", this.parentElement).forEach((e, i) => {
						e.attr("readonly", "readonly");
						e.css("cursor", "not-allowed");
						if (e.value) {
							e.attr("placeholder", e.value)
						}
						e.value = "";
					});
				}
			}
			return item
		}
		var item = [],
			base = searchBase.get();
		for (let i in base) {
			item.push(createItem(i, base[i]));
		}
		if (Object.keys(base).length < 15) {
			for (let i = 0; i < (15 - Object.keys(base).length); i++) {
				item.push(createItem("", ""));
			}
		}
		$ele("#aliyunpan-searchTool").attr("tool-mode", "setting");
		$ele("#aliyunpan-searchTool .aliyunpan-searchTool-bar").css("height", "100%").eleHTML("").insert(item);
		$ele("#aliyunpan-searchTool .aliyunpan-searchTool-panel").css("height", "13em");
	}

	function switchSearch() {
		var ele = $ele("#aliyunpan-searchTool");
		if (ele.attr("tool-mode") === "search") {
			ele.css("display") === "none" ? ele.show() : ele.hide();
		} else {
			createSearch();
			ele.show();
		}
	}

	function switchSetting() {
		var ele = $ele("#aliyunpan-searchTool");
		if (ele.attr("tool-mode") === "setting") {
			if (ele.css("display") === "none") {
				ele.show();
			} else {
				if (saveFlag) {
					saveFlag = false;
					var base = {};
					$ele(".aliyunpan-searchTool-item", ele).forEach((e, i) => {
						let k = $ele("input[item-fn=key]", e).attr("placeholder").trim();
						let v = $ele("input[item-fn=val]", e).attr("placeholder").trim();
						if (k, v) {
							base[k] = v;
						}
					})
					console.log(base);
					var save = confirm("是否保存数据到本地？\n若不保存到本地，已修改内容刷新页面后失效");
					searchBase.set(base, null, save);
				}
				ele.hide();
			}
		} else {
			createSetting();
			ele.show();
		}
	}
	function switchHotKey(){
		let old = settingBase.get("hotKeyEnable");
		settingBase.set("hotKeyEnable", !old);
		GM_unregisterMenuCommand(hotKeyRMC);
		hotKeyRMC=GM_registerMenuCommand(`⌨️${old?"启用":"禁用"}快捷热键`, switchHotKey, "h");
		alert(`快捷键已${old?"禁用":"启用"}`);
	}
	var saveFlag = false;
	createBox();
	$ele("body").onkeyup = function(evt) {
		if (!/input|textarea/i.test(evt.target.tagName) && settingBase.get("hotKeyEnable")) {
			if (evt.shiftKey && /f/i.test(evt.key)) {
				switchSearch();
			} else if (evt.shiftKey && /s/i.test(evt.key)) {
				switchSetting();
			} else if (/escape/i.test(evt.key) && $ele("#aliyunpan-searchTool") && $ele("#aliyunpan-searchTool")
				.css("display") !== "none") {
				$ele("#aliyunpan-searchTool").click();
			}
		}
	};
	$eleFn("ul.nav-menu--Lm1q6").ready(() => {
		var btn = $ele("ul.nav-menu--Lm1q6 li")[0].cloneNode(true).attr("class", "nav-menu-item--Jz5IC");
		$ele("use", btn).setAttribute("xlink:href", "#PDSSearch");
		$ele("ul.nav-menu--Lm1q6").insert(btn);
		btn.findNode("#text").nodeValue = "资源搜索";
		btn.onclick = function() {
			switchSearch();
		}
	})
	GM_registerMenuCommand("🔍资源搜索面板", switchSearch, "f");
	GM_registerMenuCommand("⚙️搜索设置面板", switchSetting, "s");
	GM_registerMenuCommand("🛠️️还原脚本数据", function() {
		if (confirm("是否初始化脚本，还原脚本数据？\n⚠️此操作不可逆，将删除此脚本所有用户数据！")) {
			searchBase.reset(true);
			settingBase.reset(true);
			$ele("#aliyunpan-searchTool").hide().attr("tool-mode", "")
			alert("初始化脚本成功！\n还原脚本数据成功！\n请重新打开“资源搜索/搜索设置面板”")
		}
	}, "r");
	var hotKeyRMC=GM_registerMenuCommand(`⌨️${settingBase.get("hotKeyEnable")?"禁用":"启用"}快捷热键`, switchHotKey, "h");
})();
