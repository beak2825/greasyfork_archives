// ==UserScript==
// @name         语言切换快捷键｜适配大部分在线翻译网站
// @namespace    https://github.com/CandyTek
// @version      1.1
// @license      MIT
// @description  语言切换快捷键 Ctrl + Shift + S
// @author       CandyTek
// @match        *://translate.yandex.com/?*
// @match        *://zh.pons.com/*
// @match        *://fanyi.so.com/*
// @match        *://fanyi.xfyun.cn/console/trans/*
// @match        *://translate.volcengine.com/*
// @match        *://translation.imtranslator.net/*
// @match        *://www.iciba.com/translate*
// @match        *://fanyi.baidu.com/*
// @match        *://dictionary.cambridge.org/*
// @match        *://www.baidu.com/s?*
// @match        *://fanyi.youdao.com/*
// @match        *://www.deepl.com/*
// @match        *://translation2.paralink.com/*
// @match        *://cn.bing.com/search?*
// @match        *://cn.bing.com/translator?*
// @match        *://fanyi.sogou.com/text?*
// @match        *://www.amz123.com/tools-translate/sougou
// @match        *://fanyi.caiyunapp.com/*
// @match        *://niutrans.com/trans?*
// @match        *://translate.alibaba.com/*
// @match        *://dict.eudic.net/home/translation
// @match        *://www.fanyi1234.com/lang/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjRweCIgdmlld0JveD0iMCAwIDI0IDI0IiB3aWR0aD0iMjRweCIgZmlsbD0iIzAwMDAwMCI+PHBhdGggZD0iTTAgMGgyNHYyNEgweiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik02Ljk5IDExTDMgMTVsMy45OSA0di0zSDE0di0ySDYuOTl2LTN6TTIxIDlsLTMuOTktNHYzSDEwdjJoNy4wMXYzTDIxIDl6Ii8+PC9zdmc+
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/452326/%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BD%9C%E9%80%82%E9%85%8D%E5%A4%A7%E9%83%A8%E5%88%86%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91%E7%BD%91%E7%AB%99.user.js
// @updateURL https://update.greasyfork.org/scripts/452326/%E8%AF%AD%E8%A8%80%E5%88%87%E6%8D%A2%E5%BF%AB%E6%8D%B7%E9%94%AE%EF%BD%9C%E9%80%82%E9%85%8D%E5%A4%A7%E9%83%A8%E5%88%86%E5%9C%A8%E7%BA%BF%E7%BF%BB%E8%AF%91%E7%BD%91%E7%AB%99.meta.js
// ==/UserScript==

// 网站规则列表
const myMatchWebsites = [
	{
		// https://translate.yandex.com/?source_lang=en&target_lang=zh
		match: ["*://translate.yandex.com/?*"],
		button:"[aria-label=\"Switch direction\"]",
	},
	{
		// https://zh.pons.com/%E7%BF%BB%E8%AF%91/
		match: ["*://zh.pons.com/*"],
		button:"[data-e2e=\"switch-language\"]",
	},
	{
		// https://fanyi.so.com/#
		match: ["*://fanyi.so.com/*"],
		button:".exchange",
	},
	{
		// https://fanyi.xfyun.cn/console/trans/text
		match: ["*://fanyi.xfyun.cn/console/trans/*"],
		button:".anticon-swap",
	},
	{
		// https://translate.volcengine.com/
		match: ["*://translate.volcengine.com/*"],
		button:".reverse-img",
	},
	{
		// https://translation.imtranslator.net/
		match: ["*://translation.imtranslator.net/*"],
		button:"[title=\"Change translation direction of a selected language pair\"]",
	},
	{
		// https://www.iciba.com/translate
		match: ["*://www.iciba.com/translate*"],
		button:".select_exchange__AfzH4",
	},
	{
		// fanyi.baidu.com
		match: ["*://fanyi.baidu.com/*"],
		button:"svg.mg3bUrpQ",
	},
	{
		// https://dictionary.cambridge.org/zhs/%E8%AF%8D%E5%85%B8/%E8%8B%B1%E8%AF%AD-%E6%B1%89%E8%AF%AD-%E7%B9%81%E4%BD%93/exchange
		match: ["*://dictionary.cambridge.org/*"],
		button:".i-exchange",
	},
	{
		// https://www.baidu.com/s?tn=68018901_3_dg&ie=UTF-8&wd=%E7%BF%BB%E8%AF%91%E7%BD%91%E7%AB%99
		match: ["*://www.baidu.com/s?*"],
		button:".op_translation_exchange_img",
	},
	{
		// https://fanyi.youdao.com/#/
		match: ["*://fanyi.youdao.com/*"],
		button:".ic_language_exchange",
	},
	{
		// https://fanyi.sogou.com/text?keyword=&transfrom=en&transto=zh-CHS&model=general&exchange=true
		match: ["*://fanyi.sogou.com/*"],
		button:".btn-switch",
	},
	{
		// https://www.deepl.com/zh/translator
		match: ["*://www.deepl.com/*"],
		button:"[data-testid=\"lmt_language_switch\"]",
	},
	{
		// https://translation2.paralink.com/
		match: ["*://translation2.paralink.com/*"],
		button:"#switch",
	},
	{
		// https://cn.bing.com/search?q=%E4%BD%A0%E5%A5%BD%20%E8%8B%B1%E8%AF%AD%E7%BF%BB%E8%AF%91
		match: ["*://cn.bing.com/search?*","*://cn.bing.com/translator?*"],
		button:"#tta_revIcon",
	},
	// {
	// 	// https://www.amz123.com/tools-translate/sougou
	// 	match: ["*://www.amz123.com/tools-translate/sougou"],
	// 	button:".btn-switch",
	// 	iframe:"#translate",
	// },
	{
		// https://fanyi.caiyunapp.com/
		match: ["*://fanyi.caiyunapp.com/*"],
		button:".changeImg",
	},
	{
		// https://niutrans.com/trans?type=text
		match: ["*://niutrans.com/trans?*"],
		button:".nt-icon-qiehuan",
	},
	{
		// https://translate.alibaba.com/
		match: ["*://translate.alibaba.com/*"],
		button:".anticon-swap",
	},
	{
		// https://dict.eudic.net/home/translation
		match: ["*://dict.eudic.net/home/translation"],
		button:".switchBtn",
	},
	{
		// https://www.fanyi1234.com/lang/
		match: ["*://www.fanyi1234.com/lang/*"],
		button:"[alt=\"转换\"]",
	},

];

/** 设置工具类 */
class CandyTekPreferenceUtil {
	/** 是否已向网页添加过设置面板了 */
	isAlreadyAddSettingPanel = false;
	/** 设置面板根元素 */
	rootShadow = null;
	/** 存放设置值的地方。获取 prefValues[key] */
	prefValues;
	/** 源 pref 配置数组 */
	preferenceList;

	constructor(preferenceList) {
		this.preferenceList = preferenceList;
		this.refreshPrefValues();
	}

	/** 刷新设置值 */
	refreshPrefValues() {
		this.prefValues = this.preferenceList.reduce((list, curr) => {
			list[curr.preference] = GM_getValue(curr.preference, curr.defaultValue);
			return list;
		}, {});
	}

	/** 获取设置值 */
	get(key) {
		return this.prefValues.hasOwnProperty(key) ? this.prefValues[key] : GM_getValue(key, "");
	}

	/** 写入设置值，未适配 boolean */
	set(key, value) {
		GM_setValue(key, value);
		this.prefValues[key] = value;
	}

	/** 显示设置面板在网页右上角 */
	show() {
		if (this.isAlreadyAddSettingPanel) {
			this.rootShadow.querySelector(".setting_panel").style.display = "block";
			return;
		}

		if (!document.body.createShadowRoot) {
			console.warn("可能不能创建 ShadowRoot");
			//return;
		}
		// 创建设置面板
		const host = document.createElement('div');
		host.id = "simplify_article_settings_panel";
		document.body.appendChild(host);

		const root = host.attachShadow({ mode: 'open' });
		this.rootShadow = root;
		this.isAlreadyAddSettingPanel = true;
		root.innerHTML = `
	<style>
		.preference_title {
			width: fit-content;
			height: 40px;
			font-size: 20px;
			margin: 0px;
			line-height: 40px;
			padding-left: 16px;
			font-weight: bold;
		}

		.preference_item {
			display: flex;
			padding: 12px 8px;
		}

		.preference_item_title {
			padding: 0px 0px 0px 10px;
			margin: 0px;
			font-size: 15px;
			line-height: 40px;
			letter-spacing: 2px;
			height: 40px;
			width: 140px;
		}

		.preference_item_edittext {
			font-size: 14px;
			margin-left: auto;
			line-height: 36px;
			height: 36px;
			padding: 0px;
			border: 2px solid #c4c7ce;
			border-radius: 6px;
			text-align: center;
			width: 138px;
		}
		.preference_item_textarea {
			text-align: unset;
			line-height: 20px;
		}

		.preference_item_edittext_color {
			width: 100px;
			border-radius: 6px 0px 0px 6px;
			border-right: 0;
		}

		.hoverbutton {
			background: none;
		}

		.hoverbutton:hover {
			background: #CCC;
			background-size: 80% 80%;
			border-radius: 4px;
		}

		.input_select_color {
			width: 40px;
			height: 40px;
			margin: 0px;
			padding:0px 2px 0px 4px;
			box-sizing: border-box;
			background-color:#ffffff;
			border-width: 2px;
			border-radius: 0px 6px 6px 0px;
			border-left: 0px;
			border-color: #c4c7ce;
		}

		.checkbox_input {
			width: 24px;
			height: 40px;
			margin: 0px 0px 0px auto;
		}


		.setting_panel {
			position: fixed;
			right: 20px;
			top: 20px;
			width: fit-content;
			height: fit-content;
			border-radius: 8px;
			background: #FFFFFF;
			padding: 8px;
			box-shadow: 0 10px 20px rgb(0 0 0 / 15%);
			z-index:9999;
		}

		.container {
			background: #F0F0F0;
			border-radius: 8px;
			margin-top: 0px;
			padding-top: 8px;
			padding-right: 8px;
		}
	</style>

	<div class="setting_panel">
		<div class="preference_item" style="padding-top: 0px;">
			<button id="close" title="关闭并保存" class="hoverbutton" type="submit"
				style="width: 40px;height: 40px;display: flex;align-items: center; justify-content: center; border: unset;">
				<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="#5f6368"
					viewBox="0 -960 960 960">
					<path
						d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
				</svg>
			</button>
			<p class="preference_title">设置</p>
		</div>
		<div class="container" id="container">

		</div>
	</div>
	`;

		const container = root.querySelector("#container");
		// 动态创建设置项
		for (const index in this.preferenceList) {
			const item = this.preferenceList[index];
			const itemDiv = document.createElement("div");
			itemDiv.className = "preference_item";

			const itemTitle = document.createElement("p");
			itemTitle.className = "preference_item_title";
			itemTitle.innerText = item.text;
			itemDiv.appendChild(itemTitle);

			if (item.type == "number") {
				const input = document.createElement("input");
				input.type = "number";
				input.className = "preference_item_edittext";
				input.id = item.preference;
				input.value = GM_getValue(item.preference, item.defaultValue);
				itemDiv.appendChild(input);
			} else if (item.type == "color") {
				const inputText = document.createElement("input");
				inputText.type = "text";
				inputText.className = "preference_item_edittext preference_item_edittext_color";
				inputText.id = item.preference;
				inputText.value = GM_getValue(item.preference, item.defaultValue);
				inputText.maxLength = 50;
				itemDiv.appendChild(inputText);

				const inputColor = document.createElement("input");
				inputColor.type = "color";
				inputColor.className = "input_select_color";
				if (this.isValidHexColor(inputText.value)) {
					inputColor.value = inputText.value;
				}
				itemDiv.appendChild(inputColor);

				inputText.addEventListener('input', () => this.inputTextAndChangeDisplayColor(inputText, inputColor));
				inputColor.addEventListener('input', () => this.selectColorAndChangeText(inputText, inputColor));
			} else if (item.type == "checkbox") {
				const input = document.createElement("input");
				input.type = "checkbox";
				input.id = item.preference;
				const checkValue = GM_getValue(item.preference, item.defaultValue);
				input.checked = checkValue;
				input.className = "checkbox_input";
				itemDiv.appendChild(input);
			} else if (item.type == "textarea") {
				const input = document.createElement("textarea");
				input.id = item.preference;
				input.value = GM_getValue(item.preference, item.defaultValue);
				input.className = "preference_item_edittext preference_item_textarea";
				itemDiv.appendChild(input);
			}
			container.appendChild(itemDiv);
		}

		root.querySelector("#close").onclick = () => {
			root.querySelector(".setting_panel").style.display = "none";
			// 动态创建设置项
			for (const index in this.preferenceList) {
				const item = this.preferenceList[index];

				if (item.type == "color" || item.type == "textarea") {
					try {
						GM_setValue(item.preference, root.querySelector(`#${item.preference}`).value);
					} catch (error) {
						console.error(`保存配置失败：${item.preference}`);
					}
				} else if (item.type == "number") {
					try {
						GM_setValue(item.preference, parseFloat(root.querySelector(`#${item.preference}`).value));
					} catch (error) {
						console.error(`保存配置失败：${item.preference}`);
					}
				} else if (item.type == "checkbox") {
					try {
						GM_setValue(item.preference, root.querySelector(`#${item.preference}`).checked);
					} catch (error) {
						console.error(`保存配置失败：${item.preference}`);
					}
				}
			}
			this.refreshPrefValues();
		};
	}

	/** input 颜色选择器更改颜色时，同时更改文本框 */
	selectColorAndChangeText(inputText, inputColor) {
		inputText.value = inputColor.value;
	};
	/** 文本框更改值时，同时更改颜色显示 */
	inputTextAndChangeDisplayColor(inputText, inputColor) {
		const color = inputText.value;
		if (this.isValidHexColor(color)) {
			inputColor.value = color;
		}
	};

	/** 用于校验 6 位的十六进制颜色值 */
	isValidHexColor(hex) {
		try {
			const hexPattern = /^#?([a-fA-F0-9]{6})$/;
			return hexPattern.test(hex);
		} catch (error) {
			return false;
		}
	}

}

(() => {
	let p;
	// 开始匹配网站
	for (const website of myMatchWebsites) {
		let hit = false;
		hit = Array.isArray(website.match) ? website.match.some((s) => matchRule(window.location.href, s)) : matchRule(window.location.href, website.match);

		if (hit) {
			//p = new CandyTekPreferenceUtil(myPreferenceList);
			// 添加设置菜单
			// GM_registerMenuCommand("快捷键设置", () => {
			// p.show();
			// });
			// 添加语音调转快捷键
			document.addEventListener("keydown", function(event) {
				if (event.ctrlKey && event.shiftKey && !event.altKey && event.key === "S") {
					let el = document.querySelector(website.button);
					if(website.iframe){
						const iframe = document.querySelector(website.iframe);
						const iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
						el=iframeDocument.querySelector(website.button);
					}
					customClick(el);
					if(website.secondButton){
						let el2 = document.querySelector(website.secondButton);
						customClick(el2);
					}
				}
			});

			console.info(`匹配成功 ${website.match}`);
			break;
		}
	};

	function customClick(el){
		if(el){
			try{
				el.click();
			}catch{
				el.dispatchEvent(new MouseEvent('click', {bubbles: true,cancelable: true,}));
			}
		}
	}

	/** match匹配方法 */
	function matchRule(str, rule) {
		const escapeRegex = (str) => str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		return new RegExp(`^${rule.split("*").map(escapeRegex).join(".*")}$`).test(str);
	}


	// todo:https://www.reverso.net/text-translation
	// todo:google
	// node:http://www.sowang.com/sogou/fanyi.htm
	// todo:https://www.amz123.com/tools-translate/tenxunjiaohu
	// todo:https://fanyi.pdf365.cn/free
	// todo:https://www.fanyi1234.com/
	// todo:https://dict.cnki.net/
	// todo:https://www.ichacha.net/
	// todo:https://www.tangpafanyi.com/text.html
	// todo:https://tran.httpcn.com/FanyiWeb/
	// todo:https://fanyi.zou.la/
	// todo:https://fanyi.dict.cn/
	// todo:https://www.99yee.cn/
	// todo:https://transmart.qq.com/zh-CN/index
	// todo:https://fanyi.atman360.com/index
	// todo:https://fanyi.qq.com/
	// todo:https://www.medsci.cn/sci/translation.do
	// todo:https://www.worldlingo.com/en/products/text_translator.html

})();

