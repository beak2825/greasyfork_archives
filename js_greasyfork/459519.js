// ==UserScript==
// @name         精简常见文章网站｜CSDN｜简书｜掘金｜知乎｜百家号｜搜狐｜腾讯新闻｜微信公众号｜网易｜更多...｜ 方便您的阅读📖
// @namespace    https://github.com/CandyTek
// @license      GPL-3.0
// @version      1.12
// @description  优化阅读体验【文章宽度一致】【统一标题】【使用阴影】【适配半屏窗口】【无感知加载】【可选 去除顶栏】｜CSDN、简书、掘金、知乎专栏、阿里云、腾讯云、华为云开发者联盟、蒲公英、百家号、脚本之家、51cto博客、爱码网、ITEYE、bbsmax论坛、第一PHP社区、代码先锋网、码农教程、术之多、搜狐、腾讯新闻、微信公众号、网易、灰信网、B站文、百度知道、百度经验、爱问知识人、CSDN问题 文章页面
// @author       CandyTek
// @homepageURL  https://greasyfork.org/zh-CN/scripts/459519
// @supportURL   https://greasyfork.org/zh-CN/scripts/459519/feedback
// @match        *://*.blog.csdn.net/*
// @match        *://blog.csdn.net/*
// @match        *://huaweicloud.csdn.net/*
// @match        *://www.jianshu.com/p/*
// @match        *://events.jianshu.io/p/*
// @match        *://www.jb51.net/article/*
// @match        *://www.jb51.net/softjc/*
// @match        *://www.jb51.net/news/*
// @match        *://www.jb51.net/shouji/*
// @match        *://www.jb51.net/program/*
// @match        *://www.jb51.net/css/*
// @match        *://www.jb51.net/os/*
// @match        *://www.jb51.net/jiaoben/*
// @match        *://www.jb51.net/hardware/*
// @match        *://www.jb51.net/network/*
// @match        *://www.jb51.net/javascript/*
// @match        *://www.jb51.net/aspnet/*
// @match        *://www.jb51.net/database/*
// @match        *://www.jb51.net/server/*
// @match        *://www.jb51.net/web/*
// @match        *://www.jb51.net/html5/*
// @match        *://www.jb51.net/Dreamweaver/*
// @match        *://www.jb51.net/python/*
// @match        *://jingyan.baidu.com/article/*
// @match        *://www.jb51.net/frontpage/*
// @match        *://www.jb51.net/xml/*
// @match        *://www.jb51.net/LINUXjishu/*
// @match        *://www.jb51.net/diannaojichu/*
// @match        *://www.jb51.net/flash/*
// @match        *://*.dandelioncloud.cn/article/*
// @match        *://wenku.csdn.net/answer/*
// @match        *://www.bilibili.com/read/*
// @match        *://zhuanlan.zhihu.com/p/*
// @match        *://baijiahao.baidu.com/s*
// @match        *://iask.sina.com.cn/b/*
// @match        *://mbd.baidu.com/newspage/data/landingsuper*
// @match        *://mbd.baidu.com/newspage/data/dtlandingsuper*
// @match        *://www.likecs.com/*
// @match        *://www.iteye.com/blog/*
// @match        *://new.qq.com/rain/*
// @match        *://www.bbsmax.com/*
// @match        *://mp.weixin.qq.com/*
// @match        *://zhidao.baidu.com/*
// @match        *://www.360doc.com/*
// @match        *://sohu.com/a/*
// @match        *://*.sohu.com/a/*
// @match        *://*.sohu.com/na/*
// @match        *://www.shuzhiduo.com/A/*
// @match        *://developer.aliyun.com/article/*
// @match        *://cloud.tencent.cn/developer/article/*
// @match        *://cloud.tencent.cn/developer/information/*
// @match        *://cloud.tencent.cn/developer/news/*
// @match        *://cloud.tencent.cn/developer/ask/*
// @match        *://cloud.tencent.com/developer/article/*
// @match        *://cloud.tencent.com/developer/information/*
// @match        *://cloud.tencent.com/developer/news/*
// @match        *://cloud.tencent.com/developer/ask/*
// @match        *://cloud.tencent.com.cn/developer/article/*
// @match        *://cloud.tencent.com.cn/developer/information/*
// @match        *://cloud.tencent.com.cn/developer/news/*
// @match        *://cloud.tencent.com.cn/developer/ask/*
// @match        *://blog.51cto.com/*
// @match        *://www.163.com/*/article/*
// @match        *://juejin.cn/post/*
// @match        *://juejin.cn/s/*
// @match        *://article.juejin.cn/post/*
// @match        *://www.freesion.com/article/*
// @match        *://www.php1.cn/detail/*
// @match        *://codeleading.com/article/*
// @match        *://*.codeleading.com/article/*
// @match        *://wuyaogexing.com/*
// @match        *://www.manongjc.com/detail/*
// @match        *://www.zhihu.com/question/*
// @icon         data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2NCIgaGVpZ2h0PSI2NCIgY2xhc3M9Imljb24iIHZpZXdCb3g9IjAgMCAxMDI0IDEwMjQiPjxwYXRoIGZpbGw9IiMyYzJjMmMiIGQ9Ik02NDAgMTI4YTQzIDQzIDAgMCAxIDQzIDQzaDE3MGE4NSA4NSAwIDAgMSA4NiA4NXY1MTJhODUgODUgMCAwIDEtODYgODVIMTcxYTg1IDg1IDAgMCAxLTg2LTg1VjI1NmE4NSA4NSAwIDAgMSA4Ni04NWgxNzBhNDMgNDMgMCAwIDEgNDMtNDNoMjU2ek0yOTkgNDI3SDE3MXYzNDFoNjgyVjQyN0g3MjV2NDJINTU1di00MmgtODZ2NDJIMjk5di00MnptNTU0LTE3MUgxNzF2ODVoNjgydi04NXoiLz48L3N2Zz4=
// @grant        GM_addStyle
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/459519/%E7%B2%BE%E7%AE%80%E5%B8%B8%E8%A7%81%E6%96%87%E7%AB%A0%E7%BD%91%E7%AB%99%EF%BD%9CCSDN%EF%BD%9C%E7%AE%80%E4%B9%A6%EF%BD%9C%E6%8E%98%E9%87%91%EF%BD%9C%E7%9F%A5%E4%B9%8E%EF%BD%9C%E7%99%BE%E5%AE%B6%E5%8F%B7%EF%BD%9C%E6%90%9C%E7%8B%90%EF%BD%9C%E8%85%BE%E8%AE%AF%E6%96%B0%E9%97%BB%EF%BD%9C%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%EF%BD%9C%E7%BD%91%E6%98%93%EF%BD%9C%E6%9B%B4%E5%A4%9A%EF%BD%9C%20%E6%96%B9%E4%BE%BF%E6%82%A8%E7%9A%84%E9%98%85%E8%AF%BB%F0%9F%93%96.user.js
// @updateURL https://update.greasyfork.org/scripts/459519/%E7%B2%BE%E7%AE%80%E5%B8%B8%E8%A7%81%E6%96%87%E7%AB%A0%E7%BD%91%E7%AB%99%EF%BD%9CCSDN%EF%BD%9C%E7%AE%80%E4%B9%A6%EF%BD%9C%E6%8E%98%E9%87%91%EF%BD%9C%E7%9F%A5%E4%B9%8E%EF%BD%9C%E7%99%BE%E5%AE%B6%E5%8F%B7%EF%BD%9C%E6%90%9C%E7%8B%90%EF%BD%9C%E8%85%BE%E8%AE%AF%E6%96%B0%E9%97%BB%EF%BD%9C%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%EF%BD%9C%E7%BD%91%E6%98%93%EF%BD%9C%E6%9B%B4%E5%A4%9A%EF%BD%9C%20%E6%96%B9%E4%BE%BF%E6%82%A8%E7%9A%84%E9%98%85%E8%AF%BB%F0%9F%93%96.meta.js
// ==/UserScript==
// ██ 注意 注意 ██：在本脚本 设置>通用>运行时期 里选择 document-start 以获得无感知脚本加载体验
// ██ 注意 注意 ██：在本脚本 设置>通用>运行时期 里选择 document-start 以获得无感知脚本加载体验

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
			width: fit-content;
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

/** 设置项 */
const myPreferenceList = [
	{
		type: "number",
		tooltip: true,
		tooltipText: "设置为 0 时，使用默认值",
		text: "宽度",
		preference: "article_width",
		defaultValue: 0,
	},
	{
		type: "number",
		tooltip: false,
		text: "阴影大小",
		preference: "article_shadow_size",
		defaultValue: 45,
	},
	{
		type: "number",
		tooltip: false,
		text: "标题字体大小",
		preference: "article_title_fontsize",
		defaultValue: 28,
	},

	{
		type: "checkbox",
		tooltip: false,
		text: "标题使用粗体",
		preference: "article_title_bold",
		defaultValue: true,
	},
	{
		type: "checkbox",
		tooltip: false,
		text: "隐藏网页顶栏",
		preference: "article_hide_topbar",
		defaultValue: false,
	},
	{
		type: "number",
		tooltip: false,
		text: "文章内边距大小",
		preference: "article_padding_size",
		defaultValue: 40,
	},
	{
		type: "color",
		tooltip: true,
		tooltipText: "设置为 0 时不生效",
		text: "文章背景颜色",
		preference: "article_bg_color",
		defaultValue: "0",
	},
	{
		type: "color",
		tooltip: true,
		tooltipText: "设置为 0 时不生效",
		text: "网页背景颜色",
		preference: "webpage_bg_color",
		defaultValue: "0",
	},
	{
		type: "textarea",
		tooltip: false,
		text: "自定义 CSS",
		preference: "page_custom_css",
		defaultValue: "",
	},

];

(() => {
	const p = new CandyTekPreferenceUtil(myPreferenceList);
	// 添加设置菜单
	GM_registerMenuCommand("布局设置", () => {
		p.show();
	});

	// 匹配域名
	const hostname = window.location.hostname;
	if (hostname.includes("huaweicloud")) {
		huaweicloud();
	} else if (hostname.includes("wenku.csdn")) {
		wenkucsdn();
	} else if (hostname.includes("iask.sina")) {
		iasksina();
	} else if (hostname.includes("jingyan.baidu")) {
		jingyan();
	} else if (hostname.includes("csdn")) {
		csdn();
	} else if (hostname.includes("jianshu")) {
		jianshu();
	} else if (hostname.includes("jb51")) {
		jiaoben();
	} else if (hostname.includes("dandelioncloud")) {
		pugongying();
	} else if (window.location.href.includes("zhihu.com/question")) {
		zhihuQuestion();
	} else if (hostname.includes("zhihu")) {
		zhihu();
	} else if (hostname.includes("baijiahao")) {
		baijiahao();
	} else if (hostname.includes("mbd")) {
		if (window.location.href.includes("dtlandingsuper")) {
			// mbd();
		} else {
			baijiahao();
		}
	} else if (hostname.includes("likecs")) {
		likecs();
	} else if (hostname.includes("iteye")) {
		iteye();
	} else if (hostname.includes("bbsmax")) {
		bbsmax();
	} else if (hostname.includes("shuzhiduo")) {
		bbsmax();
	} else if (hostname.includes("wuyaogexing")) {
		bbsmax();
	} else if (hostname.includes("weixin")) {
		weixin();
	} else if (hostname.includes("sohu")) {
		sohu();
	} else if (hostname.includes("aliyun")) {
		aliyun();
	} else if (hostname.includes("51cto")) {
		blog51cto();
	} else if (hostname.includes("163")) {
		wangyi163();
	} else if (window.location.href.includes("juejin.cn/s")) {
		juejin2();
	} else if (hostname.includes("juejin")) {
		juejin();
	} else if (hostname.includes("freesion")) {
		freesion();
	} else if (hostname.includes("php1")) {
		php1();
	} else if (hostname.includes("codeleading")) {
		codeleading();
	} else if (hostname.includes("manongjc")) {
		manongjc();
	} else if (hostname.includes("bilibili")) {
		bilibili();
	} else if (hostname.includes("new.qq")) {
		newqq();
	} else if (hostname.includes("zhidao")) {
		zhidao();
	} else if (hostname.includes("360doc")) {
		doc360();
	} else if (hostname.includes("tencent")) {
		if (window.location.href.includes("developer/article/") || window.location.href.includes("developer/ask/")) {
			newtengxunyun();
		} else {
			tengxunyunInformation();
		}
	}

	/** 是否移除顶栏 */
	function isRemoveTopbar(defaultValue) {
		return p.get("article_hide_topbar") ? defaultValue : "";
	}
	/** 是否移除顶栏，已弃用 */
	function shouldRemoveTopbar() {
		return p.get("article_hide_topbar");
	}
	/**  */
	function cssShadow() {
		const tempSize = p.get("article_shadow_size");
		return tempSize == 0 ? "" : `box-shadow: 0 ${tempSize / 2}px ${tempSize}px rgb(0 0 0 / 15%) !important;`;
	}
	/**  */
	function cssWidth(defaultValue) {
		const temp = p.get("article_width");
		return temp == 0 ? defaultValue : temp;
	}
	/**  */
	function cssTitleBold() {
		return p.get("article_title_bold") ? "font-weight: 700 !important;" : "";
	}
	/**  */
	function cssPagePadd() {
		return p.get("article_padding_size");
	}
	/**  */
	function cssCustom() {
		return p.get("page_custom_css");
	}
	/**  */
	function cssArticleBg() {
		const temp = p.get("article_bg_color");
		return temp == 0 ? "" : `background:${temp} !important;`;
	}
	/**  */
	function cssPageBg() {
		const temp = p.get("webpage_bg_color");
		return temp == 0 ? "" : `background:${temp} !important;`;
	}
	/**  */
	function cssTitleFontSize() {
		return `font-size:${p.get("article_title_fontsize")}px !important;`;
	}
	/**  */
	function cssTitleFontSize2() {
		return `font-size:${p.get("article_title_fontsize")}px !important;line-height:${p.get("article_title_fontsize") + 12}px !important;`;
	}

	function huaweicloud() {
		// https://huaweicloud.csdn.net/64e5c3da6ffa5020257601d1.html
		const css1 = `
		/* 右侧栏无关元素 */
		.page-home-right > div:nth-child(n+2){display:none !important;}
		/* 右侧栏不参与居中 */
		.page-home-right > div:nth-child(1){width:300px !important;}
		/* 右侧栏不参与居中 */
		.page-home-right {max-width:0px !important;}
		/* 右下悬浮按钮 */
		.siderbar-box{display:none !important;}
		/* 左侧栏去掉悬浮 */
		ul.user-action{position: absolute !important;}
		/* 更改文章主体宽度，阴影 */
		div.article-detail{
			${cssArticleBg()}
			${cssShadow()}
			padding: 16px ${cssPagePadd()}px 16px !important;
			max-width: unset !important;
		}
		/* 更改文章主体宽度 */
		div.page-home-wrapper{max-width: ${cssWidth(1000)}px !important;}
		/* 更改标题大小 */
		h1.title {${cssTitleFontSize()}${cssTitleBold()}}
		/* 华为云开发者任务挑战活动 */
		h1.none-hide {display:none !important;}
		#app{${cssPageBg()}}
		${isRemoveTopbar(`header.org-header{display:none !important;}`)}
        .page-home-wrapper .page-home-middle {overflow: unset!important;}
		${cssCustom()}
		`;
		GM_addStyle(css1);

		// 去掉背景
		const css2 = `body{background-image: none !important;}`;
		window.addEventListener('load', () => {
			GM_addStyle(css2);
		});
	}

	function csdn() {
		// https://blog.csdn.net/code2481632/article/details/130226878
		const css1 = `
		/* 主体文章，添加阴影，增加padd */
		.blog-content-box{
			${cssShadow()}
			${cssArticleBg()}
			padding: 16px ${cssPagePadd()}px 16px !important;
		}
		/* 鼠标悬浮弹出分享框，二维码 */
		#tool-QRcode{display:none !important;}
		/* 主体文章，更改宽度 */
		#mainBox > main{width:100% !important;}
		/* 主体文章，更改宽度 */
		#mainBox{width:${cssWidth(980)}px !important;max-width:97vw;}
		/* 更改父布局限制宽度 */
		body{min-width:$fit-content !important;}
		/* 更改右侧栏宽度 */
		div#rightAside{width: 1px !important;}
		/* 去掉左边栏 */
		.blog_container_aside{display:none !important;}
		/* 顶栏去掉悬浮 */
		div#csdn-toolbar{position: relative !important;}
		.programmer1Box{display:none !important;}
		.recommendAdBox{display:none !important;}
		#recommendAdBox{display:none !important;}
		#recommendNps{display:none !important;}
		#asideArchive{display:none !important;}
		.hot-brand{display:none !important;}
		.top-banner{display:none !important;}
		.pudn-recommend{display:none !important;}
		#wrapper{display:none !important;}
		#mys-wrapper{display:none !important;}
		.csdn-side-toolbar{display:none !important;}
		.aside-box.kind_person.d-flex.flex-column{display:none !important;}
		.content-list{box-shadow: 0 16px 16px rgb(0 0 0 / 3%) !important;}
		.left-toolbox{
			padding-top: 0px !important;
			padding-bottom: 0px !important;
			height: 32px !important;
		}
		body{background-image: none !important;}
		.hide-article-box.hide-article-pos.text-center{display:none !important;}
		/* 去掉悬浮，去创作 */
		div.write-guide-buttom-box{display:none !important;}
		/* 文章有的时候展示不全 */
		div#article_content{height:auto !important;}
		/* 登录弹框 */
		div.passport-login-container{display:none !important;}
		/* 推广弹窗，流量 */
		/* 文章标题，更改字号 */
		.title-article{${cssTitleFontSize()}${cssTitleBold()}}
		body{${cssPageBg()}min-width: unset !important;}
		${isRemoveTopbar(`div#toolbarBox{display:none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);

		// 去掉背景
		const css2 = `body{background-image: none !important;}`;
		window.addEventListener('load', () => {
			GM_addStyle(css2);
		});
	}

	function jianshu() {
		// 简书需要延迟一点时间，再加载脚本
		document.addEventListener("DOMContentLoaded", () => { jianshu2(); });
	}
	function jianshu2() {
		// https://www.jianshu.com/p/80c0cd588773?login=from_csdn
		const css1 = `
		/* 嵌入式广告 */
		iframe{display:none !important;}
		/* 去掉顶栏悬浮 */
		header > div:nth-child(1){position:static !important;}
		/* 去掉顶栏的子元素，这个不知道是啥 */
		header > div:nth-child(1) > div:nth-child(2){display:none !important;}
		/* 去掉副顶栏，即页面滑动的时候顶栏会变出来的元素 */
		header > div:nth-child(2){display:none !important;}
		/* 广告 */
		.-umr26{display:none !important;}
		/* 底下文章推荐间广告 */
		ins{display:none !important;}
		/* 底下文章推荐间广告 */
		#mv_ad_render{display:none !important;}
		/* 右侧栏文章推荐 */
		aside > div{display:none !important;width:260px !important;}
		/* 使右侧栏不参与居中对齐 */
		aside > section{width:260px !important;}
		aside{width:0px !important;}
		/* 左边三个悬浮按钮 */
		._1pUUKr{display:none}
		/* 主体文章，增加宽度，增加阴影 */
		._gp-ck{
			max-width: 100vw !important;
			width:${cssWidth(1000)}px !important;
			${cssShadow()}
		}
		section.ouvJEz{${cssArticleBg()}}
		/* 主体文章，更改padd */
		._gp-ck > section:nth-child(1){padding: 24px ${cssPagePadd()}px !important;}
		/* 底边栏，点赞评论栏，更改padd */
		._1Jdfvb{padding:0 0 0 0 !important;}
		/* 文章底部赞赏 div */
		._13lIbp{display:none !important;}
		/* 文章适配半屏窗口,去掉父布局的宽度设置 */
		div._3VRLsv{width: unset !important;}
		/* 一些小窗 */
		/* body > div:nth-child(13), body > div:nth-child(11), body > div:nth-child(14),body > div:nth-child(12){display:none !important;} */
		div#note{display:none !important;}
		/* 屏蔽安装简书客户端 */
		div._23ISFX-mask,div._23ISFX-wrap{display:none !important;}
		/* 去掉标题顶部的空白 */
		h1._1RuRku{margin-top:unset !important;}
		body{overflow: unset !important;}
		._3kbg6I{${cssPageBg()}}
		/* 文章标题，更改字号 */
		h1._1RuRku{${cssTitleFontSize()}${cssTitleBold()}}
		${isRemoveTopbar(`header{display:none !important;}`)}
		${cssCustom()}
	`;
		GM_addStyle(css1);
	}

	function jiaoben() {
		// https://www.jb51.net/server/299297pcq.htm
		const css1 = `
		/* 头部 */
		#header{display: none !important;}
		/* 头部菜单 */
		#submenu{display: none !important;}
		/* 头部 标签广告 */
		.pt10.clearfix{display: none !important;}
		/* 三个mys 没用，因为广告是重新document嵌入的 */
		.mys-wrapper{display: none !important;}
		/* 三个mys 没用，因为广告是重新document嵌入的 */
		#mys-wrapper{display: none !important;}
		/* 三个mys 没用，因为广告是重新document嵌入的 */
		#mys-content{display: none !important;}
		/* 右侧栏 */
		.main-right{display: none !important;}
		/* 左边正文更改宽度 */
		.main-left{
			width: ${cssWidth(970)}px !important;
			max-width:96vw !important;
			padding-right: unset !important;
		}
		/* 正文父布局更改宽度 */
		#container{width: fit-content !important;}
		/* 左边的分享、一键回顶 悬浮栏 */
		#right-share{display: none !important;}
		/* 文章主体，顶部的嵌入广告 */
		.lbd.clearfix{display: none !important;}
		/* 文章主体，底部的嵌入广告 */
		.lbd_bot.clearfix{display: none !important;}
		/* 搜索栏 */
		.search{display: none !important;}
		/* 底部 更多文章推荐 */
		.xgcomm.clearfix{display: none !important;}
		/* 关注脚本之家 */
		#ewm{display: none !important;}
		/* 您的位置 */
		.breadcrumb{display: none !important;}
		/* 文章嵌入gg广告 */
		.adsbygoogle{display: none !important;}
		/* 文章嵌入gg广告 */
		#aswift_1_host{display: none !important;}
		/* 文章嵌入gg广告 */
		#aswift_1{display: none !important;}
		/* 文章嵌入gg广告 */
		#aswift_2_host{display: none !important;}
		/* 文章嵌入gg广告 */
		#aswift_2{display: none !important;}
		/* 文章主体框添加阴影，更改padd */
		#article{
			${cssArticleBg()}
			${cssShadow()}
			padding: 15px ${cssPagePadd()}px 0 !important;
		}
		#wrapper{${cssPageBg()}}
		/* 文章标题，更改字号 */
		h1.title{${cssTitleFontSize2()}${cssTitleBold()}}
		${isRemoveTopbar(`#topbar{display: none !important;} #nav{display: none !important;}`)}
		${cssCustom()}
	`
		GM_addStyle(css1);
	}

	function pugongying() {
		// https://dandelioncloud.cn/article/details/1537400855221616642
		const css1 = `
		/* 主体文章，更改宽度 */
		.main.fl{width: 100% !important;padding-left: 0px !important;}
		/* 主体文章，更改宽度，添加阴影 */
		.main-content.container.clearfix{
			max-width: ${cssWidth(970)}px !important;
			${cssShadow()}
		}
		/* 去掉广告 */
		.adsbygoogle{display: none !important;}
		/* 顶栏去掉悬浮 */
		.top-bar.fixed-nav.fixed-appear{position: static !important;}
		/* 标题栏更改字号，更改粗体 */
		.single-title > h1{font-size: 28px !important;font-weight: 700 !important;}
		/* 主体文章，更改padd，更改背景为白色 */
		.single.box-show{
			padding: 0px ${cssPagePadd()}px !important;
			${cssArticleBg()}
		}
		/* 去掉原来box 的样式：阴影，圆角 */
		.box-show{
			border-radius: 0px !important;
			-webkit-box-shadow: none !important;
			box-shadow: none !important;
		}
		/* 去掉右侧栏 */
		#menu-aside{display: none !important;}
		/* 更改页面背景 */
		.home.home-index{
			background-image: none !important;
			${cssPageBg()}
		}
		/* 文章标题 */
		header.single-title > h1{${cssTitleFontSize()}${cssTitleBold()}}
		${isRemoveTopbar(`div.menu-top{display: none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function zhihuQuestion() {
		// https://www.zhihu.com/question/544176885/answer/3381371216
		const css1 = `
		/* 去掉页脚，去掉邀请下面用户 */
		footer,.Card.QuestionInvitation{display: none !important; }
		/* 文章主体添加阴影 */
		div.AnswersNavWrapper,div.AnswerCard ,div.MoreAnswers{
			${cssShadow()}
			${cssArticleBg()}
		}
		/* 使右侧栏不参与居中，右侧栏去掉悬浮 */
		div.Question-sideColumn > div:nth-child(3){
			width:290px !important;
			margin-left:24px !important;
			position: unset !important;
		}
		/* 使右侧栏不参与居中 */
		div.Question-sideColumn{width:0px !important;}
		/* 更改文章主体宽度 */
		div.QuestionHeader{min-width:unset !important;}
		div.QuestionHeader-footer-inner,div.Question-main{width:${cssWidth(910)}px !important;}
		div.QuestionHeader-main{width:${cssWidth(910)}px !important;}
		div.QuestionHeader-side{width:0px !important;}
		div.QuestionHeader-side > div{width:217px !important;}
		div.QuestionHeader-content{
			margin:auto !important;
			width:${cssWidth(910)}px !important;
			padding-left:unset !important;
		}
		h1.QuestionHeader-title{${cssTitleFontSize2()}${cssTitleBold()}}
		/* 更改文章主体宽度，适配半屏 */
		div.Question-mainColumn{width:100% !important;max-width:92vw !important;}
		div.AuthorInfo{width:100% !important;max-width:100% !important;}
		div.ListShortcut{width:100%;}
		body{${cssPageBg()}}
		${isRemoveTopbar(`.Sticky.ColumnPageHeader,header.AppHeader{display: none !important;}`)}
		${cssCustom()}
		`
		// 如果加上去掉顶栏悬浮的话，页面滑动会抖动一下，实力有限解决不了，就不加了
		GM_addStyle(css1);
		window.addEventListener('load', () => {
			// 更改顶栏logo元素高度
			document.querySelector("div.ColumnPageHeader-content > a > svg").setAttribute('height', 24);
		});
	}
	function zhihu() {
		// https://zhuanlan.zhihu.com/p/662421567
		const css1 = `
		/* 更改文章主体 宽度 */
		  .Post-Row-Content,.Post-NormalMain > header{
			width:${cssWidth(860)}px !important;
			max-width:92vw !important;
		}
        .Post-Row-Content{
			display: flex !important;
		}
		/* 给文章主体添加阴影，与padding */
		.Post-Row-Content-left{
			${cssArticleBg()}
			${cssShadow()}
            width:100% !important;
			padding: 20px ${cssPagePadd()}px !important;
		}
		@media screen and (max-width: ${cssWidth(860)}px){
			.Post-Row-Content-left{padding: 20px 4px !important;}
		}

        .Post-Row-Content-right{
			max-width: unset !important;
			margin-right: -380px !important;
			width: 350px !important;
			margin-left: 28px !important;
		}
		/* 更改评论区的宽度 */
		.Post-NormalSub > div{width:${cssWidth(860)}px !important;}
		/* 更改标题关注按钮的距离 */
		div.AuthorInfo{max-width: ${cssWidth(860)}px !important;}
		/* 去掉右边悬浮按钮，点赞分享 */
		.Post-SideActions{display: none !important;}
		/* 更改顶栏高度 */
		div.ColumnPageHeader-content{height:30px !important;}
		/* 更改顶栏高度 */
		.Sticky.is-fixed {height:30px !important;}
		/* 更改顶栏高度 */
		div.ColumnPageHeader{height:30px !important;}
		/* 更改顶栏元素高度 */
		div.ColumnPageHeader-content > a > svg {height:30 !important;}
		/* 更改顶栏元素高度 */
		button.ColumnPageHeader-WriteButton {line-height: 28px !important;}
		/* 左侧栏，左移一些 */
		div.css-376mun > div.css-l44lgl{left:${-1 * cssPagePadd() -300}px !important;}
		/* 更改标题大小 */
		h1.Post-Title{${cssTitleFontSize()}${cssTitleBold()}}
		div.Post-content{${cssPageBg()}min-width:unset !important;}
		${isRemoveTopbar(`.Sticky.ColumnPageHeader{display: none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
		// 如果加上去掉顶栏悬浮的话，页面滑动会抖动一下，实力有限解决不了，就不加了
		window.addEventListener('load', () => {
			// 更改顶栏logo元素高度
			document.querySelector("div.ColumnPageHeader-content > a > svg").setAttribute('height', 24);
		});
	}
	function baijiahao() {
		// https://baijiahao.baidu.com/s?id=1706337201709858987&wfr=spider&for=pc
		const css1 = `
		/* 去掉右边栏 */
		#ssr-content > div:nth-child(2) > div:nth-child(1) > div:nth-child(2){display: none !important;}
		/* 标题更改字号 */
		#header> div:nth-child(1){
			${cssTitleFontSize()}
			${cssTitleBold()}
		}
		/* 文章主题更改宽度，添加阴影 */
		#ssr-content > div:nth-child(2) > div:nth-child(1) ,#ssr-content > div:nth-child(2){width:min-content !important;}
		#ssr-content > div:nth-child(2) > div:nth-child(2) {margin-left:-60px !important;}
		#ssr-content > div:nth-child(2) > div:nth-child(1) > div:nth-child(1){
			width:${cssWidth(890)}px !important;
			max-width:96vw !important;
			padding: 0px ${cssPagePadd()}px !important;
			${cssArticleBg()}
			${cssShadow()}
			margin-right:unset !important;
		}
		@media screen and (max-width: ${cssWidth(890)}px){
			#ssr-content > div:nth-child(2) > div:nth-child(1) > div:nth-child(1){padding: 0px 4px !important;}
		}
		/* 左侧栏去掉悬浮 */
		div._3PLyv {position: absolute !important;}
		body{${cssPageBg()}}
		${isRemoveTopbar(`#ssr-content > div:nth-child(1){display: none !important;}#ssr-content > div:nth-child(2){padding-top: 0px !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
		//#ssr-content > div:nth-child(1){height:36px !important;position: static !important;}
		//#ssr-content > div:nth-child(1) > div:nth-child(1) > div{height:36px !important;}
		//#ssr-content > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > form{display: none !important;}
	}

	function likecs() {
		// https://www.likecs.com/show-308626808.html
		const css1 = `
		/* 右边栏 */
		div.rigthbox{display: none !important;}
		/* 主体文章，更改padd */
		article.tag-webview{padding: 0px 0px !important;}
		/* 标题去掉居中，更改padd */
		h1.page-title{text-align:left !important;padding-top: 10px !important;}
		/* 标题字体，更改为粗体，更改字体颜色 */
		h1.page-title > a{
			${cssTitleFontSize2()}${cssTitleBold()}
			color: #000 !important;
		}
		/* 顶栏，更改背景颜色 */
		.main-nav.clearfix{padding: 8px 0 !important;background: #FFF !important;}
		/* 更改顶部标题的背景颜色 */
		div.site-wrapper > header {background: #FFF !important;}
		/* 文章主体右边虚拟位置 */
		main.content > div.clearfix {display: none !important;}
		/* footer */
		div.site-wrapper > footer{display: none !important;}
		/* 更改背景颜色为白色 */
		body{${cssPageBg()}}
		div.site-wrapper{background:unset !important;}
		/* 文章主体添加阴影，并适配父布局的宽度 */
		div.leftbox {
			${cssShadow()}
			width: 100%;
		}
		section.post-content{
			padding: 16px ${cssPagePadd()}px 16px !important;
			${cssArticleBg()}
		}
		/* 设置文章主体的宽度 */
		main.content{max-width: ${cssWidth(1000)}px !important;}
		/* 文章顶部的广告 */
		.post-content > div.contentbef{display: none !important;}
		/* 顶部弹出广告 */
		.adsbygoogle{display: none !important;}
		/* 顶部弹出广告 */
		.adsbygoogle-noablate{display: none !important;}
		${isRemoveTopbar(`.main-nav.clearfix{display: none !important;`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function iteye() {
		// https://www.iteye.com/blog/ucstudio-1395721
		const css1 = `
		/* 主体，去掉margin */
		div#page{margin: 0 !important;}
		/* 标题，更改字号，更改为粗体 */
		div.blog_title > h3{${cssTitleFontSize()}${cssTitleBold()}}
		/* 文章正文宽度 */
		div#content{width: ${cssWidth(820)}px !important;max-width:97vw !important;}
		/* 文章正文去掉边框，更改padd，添加阴影，宽度匹配父布局 */
		div#main{
			border: none !important;
			padding: 16px ${cssPagePadd()}px !important;
			${cssShadow()}
			${cssArticleBg()}
			width: 100% !important;
		}
		div.blog_main{${cssArticleBg()}}
		div.blog_main{padding:unset !important;}
		/* 去掉右下角悬浮框礼盒 */
		div#main > div.csdn-side-toolbar{display: none !important;}
		/* 右边栏放在文章底部 */
		div.blog-sidebar{width: 100% !important;}
		/* 右边栏更改宽度 */
		div.recommend-right{width: 100% !important;padding: 5px 24px !important;}
		/* 去掉左边栏 */
		div#local{display: none !important;}
		/* 去掉原本底部假的文章推荐（其实它可以直接抢钱的） */
		div.comments{display: none !important;}
		div#page{${cssPageBg()}}
		${isRemoveTopbar(`div#header{display: none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}
	function bbsmax() {
		// 好像倒闭了
		const css1 = `
		/* 文章正文上面未知空白 */
		div.post-title > div:nth-child(1){display: none !important;}
		/* 文章正文上面未知空白 */
		div.post-title > div.post-content > div:nth-child(1){display: none !important;}
		/* 出售独享账号，广告 */
		div.post-title > div.post-content > span{display: none !important;}
		/* 主体文章更改宽度 */
		div.container{max-width: 980px !important;}
		/* 主体文章更改padd，添加阴影 */
		div.post{padding: 35px 40px !important;box-shadow: 0 16px 45px rgb(0 0 0 / 15%) !important;}
		/* 顶栏更改高度 */
		div#header{padding: 0px 0px !important;}
		/* 主体文章向上面移一点 */
		div#page-content{padding: 80px 0 50px 0 !important;}
		/* 更改标题字体为粗体，调大字号 */
		h1.title{font-weight: 700 !important;font-size: 28px !important;}
		/* 把顶栏logo 调暗一些，不要这么跳脱 */
		h1.logo{opacity: 0.4 !important;}
		/* 文章顶部推广 */
		ins.adsbygoogle{display:none !important;}
		`;
		const topBar = `div#header{display: none !important;} div#page-content{padding: 12px 0 !important;}`
		GM_addStyle(shouldRemoveTopbar() ? css1 + topBar : css1);

		// 移除推广
		window.addEventListener('load', () => {
			const adDivs = document.querySelectorAll('.adsbygoogle');
			// 遍历这些 div 元素的父元素并移除它们
			adDivs.forEach((adDiv) => {
				const parentElement = adDiv.parentElement;
				if (parentElement) {
					parentElement.remove();
				}
			});
		});
	}
	function weixin() {
		// https://mp.weixin.qq.com/s?__biz=MzI2OTE0ODY5Mw==&mid=2247521842&idx=1&sn=39fd8d11166dea17cba369fec23b516c&chksm=eae66148dd91e85ec9a855140034f0458ff03b222132b39e3a93d3d71979995efc0b425a9662&scene=27
		const css1 = `
		/* 文章正文宽度，阴影，修改padd */
		div.rich_media_area_primary_inner{
			max-width:94vw !important;
			width: ${cssWidth(780)}px !important;
			${cssShadow()}
			${cssArticleBg()}
			padding: 0 ${cssPagePadd()}px !important;
		}
		@media screen and (max-width: ${cssWidth(780)}px){
			div.rich_media_area_primary_inner{padding: 0 4px !important;}
		}
		/* 右边二维码移到文章底部 */
		div#js_pc_qr_code{position: static !important;}
		/* 更改标题字体大小 */
		h1#activity-name{
			${cssTitleFontSize()}${cssTitleBold()}
			padding-top:12px !important;
		}
		div#page-content{
			${cssPageBg()}
			padding:unset !important;
		}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}
	function sohu() {
		// https://www.sohu.com/a/492900285_121174061
		const css1 = `
		/* 左侧分享按钮 */
		div#article-do{display: none !important;}
		/* 右侧栏 */
		div#right-side-bar{display: none !important;}
		/* 悬浮按钮，回顶，反馈 */
		div#float-btn{display: none !important;}
		/* 去掉顶栏悬浮 */
		header#main-header{position: static !important;}
		/* 主体文章父布局，更改宽度 */
		div#article-container{width:min-content !important;}
		/* 主体文章，更改宽度，添加阴影，更改padd */
		.left.main{
			max-width:94vw !important;
			width:${cssWidth(850)}px !important;
			${cssShadow()}
			${cssArticleBg()}
			padding: 24px ${cssPagePadd()}px !important;
			margin-left: unset !important;
		}
		@media screen and (max-width: ${cssWidth(850)}px){
			.left.main{padding: 24px 5px !important;}
		}
		/* 左侧栏移到右边，适配半屏窗口 */
		.column.left{
			width: 0px !important;
			position: absolute !important;
			right: -16px !important;
		}
		/* 更改去悬浮后，多出来的东西 */
		div.location-without-nav{margin-top:0px !important;}
		/* 左下角广告 */
		div#left-bottom-god{display: none !important;}
		/* 文章下面广告 */
		div.pc-ad-common{display: none !important;}
		/* 文章下面广告 */
		div.god-bigpic{display: none !important;}
		/* 文章中间时不时弹出的广告 */
		div.left-bottom-float-fullScreenSleepContainer{display: none !important;}
		div.text-title > h1{${cssTitleFontSize2()}${cssTitleBold()}}
		body{${cssPageBg()}}
		${isRemoveTopbar(`header#main-header{display: none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function aliyun() {
		// https://developer.aliyun.com/article/931210
		const css1 = `
		/* 去掉顶栏悬浮 */
		div#global-community-nav-pc > div:nth-child(1){position: static !important;}
		/* 右下角悬浮反馈 */
		div.feed-back-wrapper{display:none !important;}
		/* 去掉正文父布局宽度限制 */
		div.article-detail{min-width:unset !important;}
		/* 右侧推广电子书 */
		.right-item-box.ebook-box{display: none !important;}
		/* 去掉左侧按钮栏悬浮 */
		div#action-btns{position: absolute !important;}
		/* 多余的地址导航栏（开发者社区 > 作者 > 正文） */
		div.developer-nav{display: none !important;}
		/* 正文父布局宽度,适配半屏 */
		div.article-wrapper{width: ${cssWidth(924)}px !important;margin: auto !important;max-width:100vw !important;}
		/* 正文匹配父布局宽度 */
		div.left-content{width: 100% !important;}
		/* 正文更改padd，添加阴影 */
		div.content-wrapper{
			${cssArticleBg()}
			${cssShadow()}
			padding: 12px ${cssPagePadd()}px !important;
		}
		/* 使侧栏不参与居中 */
		div#right-box{width: 0px !important;margin-left: 24px !important;}
		/* 恢复侧栏应有宽度 */
		div.right-item-box{width: 320px !important;padding-right:12px !important;}
		/* 作者栏点赞栏去掉悬浮 */
		div.aigc-fixed{position: static !important;width:auto !important;}
		h1.article-title{${cssTitleFontSize2()}${cssTitleBold()}}
		div.article-detail{${cssPageBg()}}
		${isRemoveTopbar(`header,nav.ace-developer-new-global-community-nav{display:none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function newtengxunyun() {
		let css1 = `
		/* 去掉左侧点赞悬浮 */
		div.cdc-suspend-pill{position:absolute !important;}
		/* 浏览文章一半时，去掉出现的悬浮顶栏 */
		.cdc-sticky-header.mod-sticky-header{display: none !important;}
		/* 右侧栏推广 */
		div.cdc-commercial-swiper{display: none !important;}
		/* 右侧栏，扫码 */
		div.cdc-group-qr-card{display: none !important;}
		/* 更改右侧栏，目录栏宽度 */
		div.cdc-directory__inner{width: 335px !important;}
		/* 去掉右下悬浮按钮，回到顶部、二维码 */
		div.cdc-widget-global{display: none !important;}
		/* 右侧栏，更改宽度，使正文居中 */
		div.cdc-layout__side{width:0px !important;padding-left: 12px;}
		/* 更改无关的padd，使正文居中 */
		div.cdc-global__main{padding-left: unset !important;padding-right: unset !important;}
		/* 文章主体，添加阴影 */
		div.mod-article-content{
			${cssArticleBg()}
			${cssShadow()}
			padding: 24px ${cssPagePadd()}px !important;
		}
		/* 更改文章宽度 */
		div.cdc-global__main{max-width:${cssWidth(980)}px  !important;}
		/* 有奖创作，这篇文章有价值 */
		div#tea-overlay-root{display:none !important;}
		body{${cssPageBg()}}
		${isRemoveTopbar(`div.cdc-header{display: none !important;} div.layout-side{top: 20px !important;}`)}
		${cssCustom()}
		`;

		// ask 单独适配
		// https://cloud.tencent.com/developer/information/%E5%AE%89%E5%8D%93selectableItemBackgroundBorderless-ask
		if (window.location.href.includes("developer/ask")) {
			css1 += `
			/* 更改标题字体大小 */
			h1.mod-head-title-text{${cssTitleFontSize2()}${cssTitleBold()}}
			/* 文章主体，添加阴影 */
			div.cdc-layout__main{
				${cssShadow()}
				${cssArticleBg()}
				padding: 24px ${cssPagePadd()}px !important;
			}
			/* 更改父布局宽度 */
			div.cdc-answer-stack-detail__main{width:${cssWidth(980)}px !important;max-width:98vw !important;}
			/* 相关产品 */
			div.cdc-mod-product2{display:none !important;}
			/* 更改父布局宽度 */
			div.cdc-answer-stack-detail{min-width:0px !important;}
			/* 交流群 */
			div.cdc-group-qr-card2{display:none !important;}
			/* 适配半屏 */
			@media screen and (max-width: ${cssWidth(980)}px){
				div.cdc-layout__main {padding: 20px 5px !important;}
			}
		`;
		}
		// article 单独适配
		// https://cloud.tencent.com/developer/article/1645814
		if (window.location.href.includes("developer/article/")) {
			css1 += `
			div.cdc-article-page{${cssPageBg()}}
			/* 相关产品 */
			div.cdc-mod-product2{display:none !important;}
			div#content-product-container{display:none !important;}
			div.cdc-commercial-card{display:none !important;}
			div.cdc-suspend-pill {left: calc(50% - ${cssWidth(980) / 1.7}px);}
			/* 更改标题字体大小 */
			.title-text{${cssTitleFontSize2()}${cssTitleBold()}}
			`;
		}
		window.addEventListener('DOMContentLoaded', function() {
			GM_addStyle(css1);
		});
	}

	function tengxunyunInformation() {
		// https://cloud.tencent.com/developer/news/907332
		// https://cloud.tencent.com/developer/information/%E5%AE%89%E5%8D%93selectableItemBackgroundBorderless-ask
		let css1 = `
		/* 文章主体，添加阴影 */
		div.layout-main{
			padding: 24px ${cssPagePadd()}px !important;
			width:100% !important;
			${cssArticleBg()}
			${cssShadow()}
		}
		/* 适配半屏 */
		@media screen and (max-width: ${cssWidth(950)}px){
			div.layout-main {padding: 20px 5px !important;}
		}
		/* 文章父布局，更改宽度 */
		body{min-width:0px !important;}
		/* 右侧栏，扫码、活动 */
		div.info-side-public,section.info-side-activity{display: none !important;}
		/* 右侧栏，产品、资讯、标签 */
		section.info-side-product,section.info-side-news,section.info-side-tags{display: none !important;}
		/* 右侧栏，不参与居中对齐 */
		div.layout-side{display:block !important;margin-left: 30px;}
		/* 文章父布局，更改宽度 */
		div.com-body{min-width:0px !important;width:${cssWidth(950)}px !important;max-width:98vw !important;}
		/* 移除右下悬浮栏 */
		div.com-widget-global{display:none !important;}
		/* 文章父布局，更改宽度，news的单独适配 */
		div.news-body{width:min-content !important;}
		/* 去掉左侧栏悬浮，news的单独适配 */
		div.com-widget-operations{position: absolute !important;}
		/* 有奖创作，这篇文章有价值 */
		div#tea-overlay-root{display:none !important;}
		/* 更改标题字体大小 */
		h1.pg-info-title{${cssTitleFontSize2()}${cssTitleBold()}}
		html,body{${cssPageBg()}}
		${isRemoveTopbar(`div.cdc-header{display: none !important;} div.layout-side{top: 20px !important;}`)}
		${cssCustom()}
		`;
		// news 单独适配
		if (window.location.href.includes("developer/news/")) {
			css1 += `
			/* 更改标题字体大小 */
			h1.col-article-title{${cssTitleFontSize2()}${cssTitleBold()}}
			`;
		}
		GM_addStyle(css1);
	}

	function blog51cto() {
		// https://blog.51cto.com/u_15127674/4283123
		const css1 = `
		/* 去掉顶栏悬浮 */
		div.ace-developer-common-nav > div:nth-child(1){position: static !important;}
		/* 去掉顶栏悬浮 */
		div.Header {position: absolute !important;}
		/* 去掉左按钮栏悬浮，干脆不要了，文章底部都有 */
		.action-aside.action-aside-left{position: absolute !important;display: none !important;}
		/* 右侧栏，近期文章 */
		aside.detail-content-right > section:nth-child(4){display: none !important;}
		/* 右侧栏，新人活动 */
		aside.detail-content-right > section > a:nth-child(1) {display: none !important;}
		aside.detail-content-right > div {display: none !important;}
		/* 右下角悬浮栏 */
		aside.minmenu {display: none !important;}
		/* 右侧栏，不参与居中对齐 */
		aside.detail-content-right {margin-right:-302px !important;}
		/* 去掉顶栏悬浮 */
		.Content.detail-content-new > div.fixtitle {display: none !important;}
		/* 文章主体，更改宽度 */
		article.detail-content-left{width:${cssWidth(980)}px !important;max-width:97vw;}
		/* 文章父布局，更改宽度 */
		div#page_center{width:1020px !important;}
		/* 文章主体，更改padd、添加阴影 */
		.common-section.common-spacing.mb30.article-detail{
			padding:15px ${cssPagePadd()}px !important;
			${cssArticleBg()}
			${cssShadow()}
		}
		/* 更改标题大小 */
		div.title>h1{${cssTitleFontSize2()}${cssTitleBold()}}
		/* 左侧栏悬浮按钮，去掉半屏时展开成横条状 */
		/* div.inner{width:0px !important;} */
		/* 左侧栏悬浮按钮，离文章近一点 */
		/* aside.action-aside{left:58% !important;} */
		/* 投骰子 */
		div.right-fixadv{display:none !important;}
		/* 悬停球不要悬停 */
		.hover-ball{position: absolute !important;}
		div.detail-content-new{${cssPageBg()}}
		${isRemoveTopbar(`div.Header{display: none !important;} header.home-top{display: none !important;} div.detail-content-new{padding: 20px 0 !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function wangyi163() {
		// https://www.163.com/dy/article/IHKTIFQ40514AHGG.html
		const css1 = `
		/* 右侧栏 */
		div.post_side{display: none !important;}
		/* 文章主体，添加阴影、更改padd */
		div.post_body{
			${cssArticleBg()}
			${cssShadow()}
			padding:20px ${cssPagePadd()}px !important;
		}
		/* 右下角，二维码 */
		a.newsapp-qrcode{display: none !important;}
		/* 右下角，回到顶部 */
		a.ns-side-totop{display: none !important;}
		/* 文章左侧悬浮按钮，去掉悬浮 */
		div.post_top_fixed{display: none !important;}
		/* 右下角弹窗登录 */
		.login-guide-wrap.login-guide-popup{display: none !important;}
		/* 左侧悬浮按钮，放到右边 */
		div.post_top{
			right:0 !important;
			left:auto !important;
			margin-right:-150px !important;
			background:none !important;
		}
		/* 文章主体父布局，去掉padd */
		div#content{padding:0 !important;}
		/* 文章主体，更改距离顶部的marg */
		div.post_crumb{margin: 16px 0 26px !important;}
		/* 文章主体，匹配父布局的宽度 */
		div.post_main{width:100% !important;}
		/* 更改父布局的宽度，适配半屏 */
		div.wrapper{width:${cssWidth(1000)}px !important;max-width:96vw;}
		/* 适配半屏 */
		@media screen and (max-width: ${cssWidth(1000)}px){
			div.post_body {padding: 20px 5px !important;}
		}
		body{min-width:0px !important;}
		/* 底部文章推荐，更改padd */
		.post_recommends.js-tab-mod{padding-left:0px !important;}
		h1.post_title{${cssTitleFontSize2()}${cssTitleBold()}}
		body{${cssPageBg()}}
		${isRemoveTopbar(`div#js_N_NTES_wrap{display: none !important;}div.post_crumb{display: none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function juejin() {
		// https://article.juejin.cn/post/7156157715230752782
		const css1 = `
		/* 右侧栏，推广 */
		div.sidebar > li{display: none !important;}
		/* 右侧栏，推广 */
		div.sidebar > a{display: none !important;}
		/* 去掉顶栏悬浮 */
		// header.main-header{position:absolute !important;}
		/* 左侧栏，去掉悬浮 */
		.article-suspended-panel.dynamic-data-ready{position:absolute !important;}
		/* 文章下面，小册推广 */
		div.category-course-recommend{display: none !important;}
		/* 右侧栏悬浮按钮，觉得还不错，一键收藏 */
		div.guide-collect-popover{display: none !important;}
		/* 文章主体，匹配父布局宽度 */
		.main-area.article-area{width:100% !important;}
		/* 文章父布局，更改宽度，适配半屏窗口 */
		main.main-container{max-width: ${cssWidth(960)}px !important;margin: 0 auto !important;}
		/* 右侧栏悬浮按钮，不参与居中对齐 */
		div.sidebar{margin-right: calc(-25rem - 32px) !important;}
		/* 文章主体，添加阴影 */
		article.article{
			${cssArticleBg()}
			${cssShadow()}
			padding: 20px ${cssPagePadd()}px !important;
		}
		/* 底部文章推荐，匹配父布局宽度 */
		.main-area.recommended-area.shadow{width:100% !important;}
		/* 右下角悬浮按钮 */
		.suspension-panel.suspension-panel{display: none !important;}
		/* 登录界面 */
		.login-guide-wrap.login-guide-popup{display: none !important;}
		/* 登录领礼包 */
		div.bottom-login-guide{display:none !important;}
		/* 右侧栏搜索建议 */
		div.jj-search-suggest{display:none !important;}
		/* 右侧栏加群 */
		div.ad-container{display:none !important;}
		/* 右下角悬浮推广，一起。。 */
		div.global-float-banner{display:none !important;}
		h1.article-title{${cssTitleFontSize()}${cssTitleBold()}}
		body{${cssPageBg()}}
		${isRemoveTopbar(`div.main-header-box{display: none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function juejin2() {
		// s 的网页访问不了了
		const css1 = `
		/* 右下角悬浮推广，一起。。 */
		main.main-container{
			box-shadow: 0 16px 45px rgb(0 0 0 / 15%) !important;
			padding: 16px 40px !important;
			background-color:#fefefe !important;
		}
		/* 登录界面 */
		.login-guide-wrap.login-guide-popup{display: none !important;}
		/* 登录领礼包 */
		div.bottom-login-guide{display:none !important;}
		`;
		const topBar = `div.main-header-box{display: none !important;}`
		GM_addStyle(shouldRemoveTopbar() ? css1 + topBar : css1);
	}

	function freesion() {
		// https://www.freesion.com/article/43281281735/
		const css1 = `
		/* 文章父布局，更改宽度，更改padd */
		div#wrapper{padding: 0px !important;width: ${cssWidth(960)}px !important;}
		/* 右侧大窗 */
		section#intro{display: none !important;}
		/* 推广 */
		#setupad_750_200_ads{display: none !important;}
		/* 左侧栏，改到右边，不参与居中对齐 */
		section#sidebar{
			float: right !important;
			position: absolute !important;
			width: 0px !important;
			margin-right: -350px !important;
			top: unset !important;
		}
		/* 文章主体，添加阴影，更改padd，更改宽度，更改背景 */
		div#article_content{
			${cssShadow()}
			padding: 24px ${cssPagePadd()}px !important;
			max-width: 96vw !important;
			${cssArticleBg()}
		}
		#main > h2 > span{${cssTitleFontSize()}${cssTitleBold()}}
		body{${cssPageBg()}}
		${isRemoveTopbar(`header#header{display: none !important;} body{padding-top: 10px !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function php1() {
		// https://www.php1.cn/detail/Python_ShuJuKeSh_eb129037.html
		const css1 = `
		/* 第二顶栏更改高度 */
		div.top-bar-full-nav{height: 48px !important;}
		/* 第二顶栏内容 */
		div.nav{margin: 7px 0 0 30px !important;}
		/* 顶栏搜索栏 */
		div.nav-rsear{margin-top: 10px !important;}
		/* 右侧栏，热门标签 */
		div.tools{display: none !important;}
		/* 右侧栏，热门文章 */
		div.rank{display: none !important;}
		/* 顶栏logo */
		div.logo{margin-top: 2px !important;}
		/* 文章父布局，调整宽度 */
		div.article_main{
			max-width:${cssWidth(860)}px  !important;
			margin-top: 0px !important;
		}
		/* 顶栏logo，缩小尺寸 */
		div.logo > a > img{width: 114px !important;height: 44px !important;}
		/* 使右侧栏，不参与居中 */
		div.article_right{width: 0px !important;margin-right: -30px !important;}
		/* 文章主体，更改宽度，更改padd，添加阴影 */
		div.article_box{
			width:100% !important;
			padding: 0px ${cssPagePadd()}px !important;
			${cssArticleBg()}
			${cssShadow()}
			border:unset !important;
		}
		@media screen and (max-width: ${cssWidth(860)}px){
			div.article_box{padding: 0px 4px !important;}
		}
		/* 主体内容，更改宽度，更改marg */
		div.article_title,div.article_info,div.article_intro,div.article_content{margin:0 !important;width: 100% !important;}
		div.article_title > h1{${cssTitleFontSize2()}${cssTitleBold()}}
		body{${cssPageBg()}}
		${isRemoveTopbar(`div.top-bar-head,div.top-bar-full-nav{display: none !important;}`)}
		${cssCustom()}

		`;
		GM_addStyle(css1);
	}

	function codeleading() {
		// https://codeleading.com/article/36425823550/
		const css1 = `
		/* 右侧栏推广 */
		.columns.sidebar > div{display:none !important;}
		/* 使右侧栏，不参与居中 */
		.columns.sidebar{width: 280px !important;margin-right: ${-1 * cssPagePadd() -330}px !important;}
		/* 右侧栏，热门文章 */
		.columns.sidebar ul:nth-of-type(2){display:none !important;}
		.columns.sidebar ul:nth-of-type(3){display:none !important;}
		/* 右侧栏，推荐文章 */
		.columns.sidebar h3:nth-of-type(2){display:none !important;}
		.columns.sidebar h3:nth-of-type(3){display:none !important;}
		/* 顶栏推广 */
		div.outterWrapper > .columns > div:nth-child(n+4){display:none !important;}
		/* 底部推广 */
		#footerads{display:none !important;}
		/* 文章推广 */
		#g-before-content-ads{display:none !important;}
		#g-after-content-ads{display:none !important;}
		#below_desc_ads{display:none !important;}
		#g-between-recom-ads{display:none !important;}
		#g-native-ads{display:none !important;}
		#topads{display:none !important;}
		#g-top-ads{display:none !important;}
		#below_title_ads{display:none !important;}
		/* 顶栏标题，更改字号，更改marg */
		div.header-inner > h1{
			font-size:15px !important;
			margin-bottom: 2px !important;
			margin-top: 2px !important;
		}
		/* 主体父布局，更改宽度 */
		.row.outterWrapper{max-width: ${cssWidth(940)}px !important;}
		/* 文章主体，更改宽度 */
		div.content-inner > div.row > div:nth-child(1){width: 100% !important;}
		/* 文章标题，使用粗体 */
		div.content-inner > div.row > div:nth-child(1) > h2:nth-child(1){
			${cssTitleFontSize()}${cssTitleBold()}
		}
		/* 第二顶栏，调整高度 */
		ul.sf-menu{line-height: 0.5 !important;}
		.top-menu.top-nav{border-bottom: none !important;}
		/* 搜索栏，调整高度 */
		div.content-title-inner{padding: 0 !important;}
		#searchForm > div > input{height: 25px !important;}
		/* 搜索栏，与上面的合并，居右 */
		div.content-title-inner > div.row > div{
			margin-top: -28px !important;
			float: right !important;
			width:auto !important;
			padding-right: 48px !important;
		}
		div.outterWrapper{
			${cssArticleBg()}
			${cssShadow()}
		}
		#article_content{max-width:unset !important;}
		/* 文章父布局，调整padd */
		div.content-inner{padding:20px ${cssPagePadd()}px !important;}
		body{${cssPageBg()}}
		${isRemoveTopbar(`div.outterWrapper > div:nth-child(1){display: none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}
	function manongjc() {
		// 挂掉了
		const css1 = `
		/* 网页背景更改为灰色 */
		body{background:#F5F6F7 !important;}
		/* 页面推广 */
		#article_right_top{display:none !important;}
		#outer-ad-right-sticky-article{display:none !important;}
		#ads_under_title{display:none !important;}
		#article_left_top_banner{display:none !important;}
		#article_left_bottom_banner{display:none !important;}
		.header-ads{display:none !important;}
		/* 页面推广通用匹配 */
		.adsbygoogle , .common_ad_class{display:none !important;}
		/* 本站教程列表 */
		#outer_float_course{display:none !important;}
		/* 随机文章，知识点必读 */
		div.left > div.common{display:none !important;}
		/* 随机文章 */
		div.hot_article{display:none !important;}
		/* 知识点必读 */
		ul.article-tutorial-list{display:none !important;}
		/* 更改顶栏搜索框高度 */
		div.search{height: 48px !important;}
		/* 更改顶栏logo高度 */
		div.logo > a{margin-top: 8px !important;height: 48px !important;}
		/* 更改标题字体大小 */
		div.article-title > h1{font-size: 30px !important;}
		/* 正文匹配父布局宽度 */
		div.left{width: 100% !important;}
		/* 使右侧栏不参与居中 */
		div.right{
			float: none !important;
			margin-left: auto !important;
			margin-right: -308px;
			width:288px !important;
		}
		/* 使正文父布局，可以水平排列子元素 */
		div.main-content{
			overflow: visible !important;
			display: inline-block !important;
			width: 100% !important;
		}
		/* 正文父布局添加阴影，更改宽度，适配更窄窗口 */
		div.page-content{
			width: 965px !important;
			box-shadow: 0 16px 45px rgb(0 0 0 / 15%) !important;
			max-width: 100vw !important;
		}
		/* 顶部导航条，更改宽度 */
		div.menu{width: 965px !important;}
		/* 更改正文的padd */
		div.article-content{padding: 12px 40px !important;}
		/* 更改语言导航栏的按钮间距 */
		div.menu > ul > li > a > b {padding: 0px 3px 0 0 !important;}
		/* 更改顶栏的padd */
		div.header {padding-top: 0 !important;}
		/* 去掉正文的边框样式 */
		div.first-left {border:none !important;}
		`;
		const topBar = `div.header,div.menu{display: none !important;}`
		GM_addStyle(shouldRemoveTopbar() ? css1 + topBar : css1);
	}

	function newqq() {
		// https://new.qq.com/rain/a/20240527A0ABJX00
		const css1 = `
		/* 右侧栏不参与正文居中 */
		div#RIGHT{width:0px !important;}
		div#RIGHT > div{width:300px !important;margin-left: ${cssPagePadd() + 30}px !important;}
		/* 右侧栏去掉悬浮 */
		.right-sticky{position:absolute !important;}
		/* 更改正文父布局宽度 */
		div.LEFT{width:100% !important;}
		/* 更改正文宽度 */
		div.content-article{width:100% !important;}
		/* 更改正文宽度，添加阴影，适配半屏，更改padd */
		.qq_conent.clearfix{
			width:${cssWidth(960)}px !important;
			max-width:85vw !important;
			${cssArticleBg()}
			${cssShadow()}
			padding:0px ${cssPagePadd()}px !important;
		}
		/* 去掉左侧栏悬浮 */
		div#LeftTool{position: absolute !important;margin-left: ${-1 * cssPagePadd() -90}px;}
		/* 去掉右侧栏悬浮 */
		div.sticky{position: static !important;}
		div.content-article > h1{${cssTitleFontSize2()}${cssTitleBold()}}
		body{${cssPageBg()}}
		${isRemoveTopbar(`div#TopNav{display:none !important;}body{padding-top:16px !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function bilibili() {
		// https://www.bilibili.com/read/cv25383802/?from=search
		const css1 = `
		/* 正文添加阴影 */
		div.article-container{
			${cssArticleBg()}
			${cssShadow()}
			max-width:95vw !important;
		}
		div.article-detail{width: ${cssWidth(900)}px !important;}
		/* 右下栏去掉悬浮 */
		div.right-side-bar{position: absolute !important;bottom: unset !important;top:50px !important;}
		/* 去掉多余padd */
		div#article-content{padding:0 ${cssPagePadd()}px !important;}
		div.article-container{padding:0 !important;}
		h1.title{
			padding-top:12px;
			${cssTitleFontSize()}
			${cssTitleBold()}
		}
		body,html{${cssPageBg()}}
		div.right-side-bar{margin-left:-80px !important;}
		${isRemoveTopbar(`div.z-top-container,div.fixed-top-header{display:none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
		//img.normal-img{height:unset !important;width:unset !important;}
	}

	function zhidao() {
		// https://zhidao.baidu.com/question/943240055513013812.html
		const css1 = `
		/* 正文 */
		article{
			width:100% !important;
			min-width:0px !important;
			padding:0px 0px !important;
			border-right:unset !important;
		}
		/* 更改标题字体大小 */
		span.ask-title{
			${cssTitleFontSize2()}${cssTitleBold()}
		}
		/* 更改正文父布局宽度，适配半屏，添加阴影 */
		div.layout-wrap{
			max-width:94vw !important;
			width:${cssWidth(800)}px !important;
			${cssArticleBg()}
			${cssShadow()}
			padding:0px ${cssPagePadd()}px !important;
		}
		@media screen and (max-width: ${cssWidth(800)}px){
			div.layout-wrap{padding:0px 4px !important;}
		}
		div.wgt-answers{${cssArticleBg()}}
		/* 更改正文父布局宽度 */
		#body{width: auto !important;}
		/* 免费咨询律师 */
		#wgt-lvlin-bottom{display:none !important;}
		body,html{${cssPageBg()}}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function doc360() {
		// http://www.360doc.com/content/23/0406/09/22873936_1075294456.shtml
		const css1 = `
		/* 正文添加阴影 */
		div#bgchange{
			${cssArticleBg()}
			${cssShadow()}
			padding:20px ${cssPagePadd()}px !important;
			width:${cssWidth(960) - cssPagePadd() * 2}px !important;
			max-width:95vw !important;
		}
		/* 使右侧栏不参与居中 */
		.a_right{width:0px !important;}
		#rightfixed{
		margin-left:24px !important;
			width:300px !important;}
		@media screen and (max-width: ${cssWidth(960)}px){
			div#bgchange{padding:20px 4px !important;}
		}
		/* 屏蔽登录窗口、左侧二维码、右下悬浮栏 */
		iframe#registerOrLoginLayer,.floatqrcode,#goTop2,#goTop{display:none !important;}
		.vipact,#divad,#divad2,#divad3,#divad4,#divad5,#divad6{display:none !important;}
		/* 更改正文宽度，适配半屏 */
		div.a_left{
			margin-left:unset !important;
			margin-right:unset !important;
			width:100% !important;
		}
		div.doc360article_content{
			width:${cssWidth(960)}px !important;
			max-width:95vw !important;
		}
		#artContent > div:nth-child(1){width: unset !important;}
		img,#artContent{
			min-width:unset !important;
			max-width:100% !important;
		}
		#articlecontent > table{
			width:100% !important;
		}
		#GLTitile{${cssTitleFontSize2()}${cssTitleBold()}}
		body{${cssPageBg()}}
		${isRemoveTopbar(`div.atfixednav,div.header{display:none !important;}div#bgchange{margin-top: -66px;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	function wenkucsdn() {
		// https://wenku.csdn.net/answer/b650e75d4cd2432298ff235fe1c9d072
		const css1 = `
		/* 正文添加阴影 */
		div.layout-center > div.main{
			${cssArticleBg()}
			${cssShadow()}
		}
		/* 更改正文宽度 */
		div.layout-center{max-width:98vw !important;}
		.layout-center{width:${cssWidth(1030)}px !important;}
		div.article-box{padding: 00px ${cssPagePadd()}px !important;}
		/* 使右侧栏不参与居中 */
		div.layout-right{width:0px !important;}
		/* 更改标题字体大小 */
		h1.title{${cssTitleFontSize()}${cssTitleBold()}}
		body, html {min-width: 0px !important;}
		/* 正文居中，适配半屏 */
		div#chatgpt-article-detail{display:-webkit-box !important;}
		/* 顶栏广告 */
		div.top-bar{display:none !important;}
		#chatgpt-article-detail{${cssPageBg()}}
		${isRemoveTopbar(`div#csdn-toolbar{display:none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}
	function jingyan() {
		// https://jingyan.baidu.com/article/3c343ff713fcf24c377963a6.html
		const css1 = `
		/* 右下角栏调整位置 */
		#wgt-exp-share,#wgt-barrier-free{margin-right: -100px;}
		/* 红包任务、通知消息数去掉悬浮 */
		.task-panel-list,.task-panel-entrance,.msg-container{position: absolute !important;}
		/* 更改正文父布局宽度 */
		div.content-container{width:${cssWidth(800)}px !important;max-width: 93vw;}
		/* 正文添加阴影，更改正文宽度 */
		div.main-content{
			${cssArticleBg()}
			${cssShadow()}
			padding: 0px ${cssPagePadd()}px 0px !important;
			width:100% !important;
		}
		/* 适配半屏 */
		@media screen and (max-width: ${cssWidth(800) + 100}px){
			div.main-content{padding: 0px 5px 0px !important;}
		}
		/* 更改标题字体大小 */
		span.title-text{${cssTitleFontSize()}${cssTitleBold()}}
		/* 适配半屏 */
		body {min-width: 0px !important;}
		/* 设置点赞栏离正文远一点，并去掉悬浮 */
		div.wgt-like{margin-left:-70px;position: absolute;}
		body{${cssPageBg()}}
		${isRemoveTopbar(`header,nav.nav,div.breadcrumb{display:none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}
	function iasksina() {
		// https://iask.sina.com.cn/b/iRgaLddSbxjB.html
		const css1 = `
		/* 右侧栏没啥用，隐藏 */
		div#detail_right_xf{display:none !important;}
		/* 右侧栏去掉悬浮 */
		div.addfix{position: absolute !important;}
		/* 更改正文父布局宽度 */
		div.w680 {width:100% !important;}
		/* 更改正文父布局宽度 */
		div.pw {width:${cssWidth(860)}px !important;max-width:93vw;}
		/* 正文添加阴影，更改正文宽度 */
		div.iask-detail-curt{
			${cssArticleBg()}
			${cssShadow()}
			padding: 0px !important;
			width:100% !important;
		}
		.detail-answer-item{${cssArticleBg()}}
		/* 答案卡片添加padd */
		ul.detail-answer-list {padding: 0 40px;}
		/* 适配半屏 */
		@media screen and (max-width: 850px){
			ul.detail-answer-list {padding: 0 5px;}
		}
		/* 更改标题字体大小 */
		p.problem-title-text{${cssTitleFontSize2()}${cssTitleBold()}}
		/* 适配半屏 */
		body {min-width: 0px !important;}
		/* 右下栏去掉悬浮 */
		div.iask-mui-right{position: absolute;}
		body{${cssPageBg()}}
		${isRemoveTopbar(`div.crumb,div.detail-header,div.top-bar{display:none !important;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}
	function mbd() {
		// https://mbd.baidu.com/newspage/data/dtlandingsuper?nid=dt_3188205064148630303
		const css1 = `
		/* 增加正文行高 */
		span.index-module_forwardWrapper_10-LF{
			line-height: 28px;
			font-size: 18px;
		}
		/* 右侧栏不参与居中 */
		div.app-module_rightSection_bgA0C{margin-right: -390px;}
		/* 更改正文父布局宽度，去掉padd */
		div.app-module_leftSection_2GBVu{
			width:100% !important;
			padding-left:unset !important;
			padding-right:unset !important;
		}
		/* 更改正文父布局宽度，适配半屏 */
		div.app-module_articleWrapper_32Vny{width:${cssWidth(860)}px !important;max-width:93vw;}
		/* 正文添加阴影，更改padd */
		div.index-module_articleContainer_32gOp{
			${cssArticleBg()}
			${cssShadow()}
			padding: 0px ${cssPagePadd()}px !important;
			margin-bottom:40px;
		}
		/* 适配半屏 */
		@media screen and (max-width: ${cssWidth(860) - 160}px){
			div.index-module_articleContainer_32gOp {padding: 0 5px !important;}
		}
		body{${cssPageBg()}}
		${isRemoveTopbar(`div.app-module_topbarWrapper_2A357{display:none !important;}div.app-module_contentWrapper_12u0y{padding-top: 0px;}`)}
		${cssCustom()}
		`;
		GM_addStyle(css1);
	}

	/** 把 br 标签换成 hr 标签，增加段落间距离 */
	function replaceBrWithHr(element) {
		// 获取目标元素内的所有 <br> 标签
		const brs = element.getElementsByTagName("br");

		// 使用 while 循环从后往前遍历替换 <br> 标签，避免顺序替换产生错误
		while (brs.length > 0) {
			// 创建 <hr> 标签
			const hr = document.createElement("hr");
			hr.style.border = "none";
			hr.style.height = "5px";
			// 替换 <br> 为 <hr>
			brs[0].parentNode.replaceChild(hr, brs[0]);
		}
	}
})();
