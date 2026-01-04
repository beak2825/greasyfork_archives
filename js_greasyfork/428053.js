/*
 * @Description: autoSetting
 * @Version: 1.0.1
 * @Author: lax
 * @Date: 2021-06-15 10:50:14
 * @LastEditors: lax
 * @LastEditTime: 2021-06-17 22:48:48
 * @FilePath: \autoSetting\src\index.js
 */
// ==UserScript==
// @name         autoSetting
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  try to take over the world!
// @author       lax
// @match        http://*.world-of-dungeons.org/wod/spiel/hero/skillconf_nojs.php*
// @match        http://*.world-of-dungeons.org/wod/spiel/hero/skillconfig.php*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428053/autoSetting.user.js
// @updateURL https://update.greasyfork.org/scripts/428053/autoSetting.meta.js
// ==/UserScript==

(function() {
	"use strict";

	// 挑战 key
	const CHALLENGE = "wod_plugin_challenge";

	// buff key
	const BUFF = "wod_plugin_buff";

	// xml loader
	const xml = new DOMParser();

	// storage
	const lib = window.localStorage;

	// 设置 地城\决斗\一般\说明
	const settingType = document.querySelectorAll("#wod-orders > div");

	// 地城
	const dungeon = settingType[0];

	// 设置名称
	const SETTING_NAME = document.querySelector("#wod-orders h1").innerHTML;

	// 保存按钮集合
	const SAVE_BUTTON = Array.from(
		document.querySelectorAll("input[value=保存]")
	);

	// 重置此页面上的设置
	const reloadSetting = dungeon.querySelector(
		"input[value=重置此页面上的设置]"
	);

	// 设置数据form对象
	const form = document.querySelector(
		"form[action='/wod/spiel/hero/skillconfig.php']"
	);

	SAVE_BUTTON.map(bt => {
		bt.addEventListener("click", () => {
			if (SETTING_NAME.includes("挑战层")) saveSetting(CHALLENGE);
			if (SETTING_NAME.includes("buff层")) saveSetting(BUFF);
		});
	});

	generateSaveButton("挑战", CHALLENGE);
	generateSaveButton("buff", BUFF);

	function saveSetting(name) {
		const config = getSettingConfig();
		lib.setItem(name, config.data);
	}

	function getSettingConfig() {
		const WOD_CFG = window.WOD_CFG;
		const xs = new XmlSerializer();
		WOD_CFG.serialize(xs);
		return xs;
	}

	function generateSaveButton(name, key) {
		const bt = createButton(name);
		bt.addEventListener("click", () => {
			const item = lib.getItem(key);
			if (!item) alert(`无法读取，请先创建或保存${name}设置！`);

			const source = xml.parseFromString(item, "text/xml");
			// 读取挑战层设置的默认设置，该设置将被视为挑战层的设置
			const template = source.getElementsByTagName("level")[0];

			// 当前设置的层数
			const LEVEL = document.querySelector(
				"#wod-orders div .wod-tabs li[class=selected]"
			).innerHTML;
			const level = LEVEL === "默认" ? 0 : Number(LEVEL);

			// 读取当前层数设置
			const setting = xml.parseFromString(getSettingConfig().data, "text/xml");
			const oldLevel = setting.getElementsByTagName("level")[level];

			let parentNode;
			if (LEVEL === "默认") {
				parentNode = setting.getElementsByTagName("standard")[0];
			} else {
				parentNode = setting.getElementsByTagName("levels")[0];
				template.setAttribute("overwrite_standard", "true");
			}
			parentNode.replaceChild(template, oldLevel);

			const xmlString = new XMLSerializer().serializeToString(setting);

			post({ data: xmlString, level });
		});
	}

	function post({ data, level }) {
		form.querySelector("input[name=data]").value = base64_encode(data);
		form.querySelector("input[name=action]").value = "save";
		form.querySelector("input[name=profile]").value = getProfileId();
		form.querySelector("input[name=SELECTED_TAB]").value =
			"wod-orders-tab-dungeon";
		form.querySelector("input[name=SELECTED_LVL]").value = level;
		form.querySelector("input[name=SELECTED_DUEL]").value = "hero";

		form.submit();
	}

	function getProfileId() {
		const WOD_CFG = window.WOD_CFG;
		return WOD_CFG.ui_orders.profileDropdown.getSelectedProfile().id;
	}

	function createButton(name) {
		const bt = document.createElement("input");
		bt.type = "button";
		bt.value = name;
		reloadSetting.parentNode.insertBefore(bt, reloadSetting);
		return bt;
	}

	/**
	 * 设置拖拽
	 */

	// 设置区域
	const settingBox = Array.from(
		document.querySelectorAll(".wod-list .wod-list-items")
	);

	const before = settingBox[1];
	const around = settingBox[3];
	console.log(before);
	console.log(around);

	addChangeListener(before);
	addChangeListener(around);

	document
		.querySelector("#wod-orders div .wod-tabs li[class=selected]")
		.click();

	function addChangeListener(el) {
		// 允许其中元素可以拖拽
		el.style.position = "relative";
		const callback = function(mutationsList) {
			mutationsList.map(mutation => {
				if (mutation.type === "childList" && mutation.addedNodes.length) {
					listenerDrag(mutation.addedNodes);
				}
			});
		};

		const observer = new MutationObserver(callback);
		const config = { childList: true };

		observer.observe(el, config);
	}

	let ing = null;

	function listenerDrag(el) {
		const items = Array.from(el);

		items.map(each => {
			if (!each.parentNode) return;
			const down = each.parentNode.parentNode.querySelector("img[title=向下]");

			const up = each.parentNode.parentNode.querySelector("img[title=向上]");

			each.setAttribute("draggable", "true");

			each.addEventListener("dragstart", e => {
				ing = e;
			});
			each.addEventListener("dragover", e => {
				e.preventDefault();
				const target = e.target;
				if (
					target.nodeName === "DIV" &&
					target.classList.contains("wod-list-item") &&
					target !== ing.target
				) {
					if (target.previousSibling === ing.target) {
						down.click();
					} else if (target.nextSibling === ing.target) {
						up.click();
					}
				}
			});
		});
	}
})();