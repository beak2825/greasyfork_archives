// ==UserScript==
// @name          词典切换 / Dictionary Switcher
// @namespace     http://tampermonkey.net/
// @version       0.2.1
// @description   在辞典网站左侧显示一个快速切换列表，节省「另开辞典页面」和「输入关键词」的动作及时间，提高查询效率。参考了自己撸的另一款：[搜索引擎切换器 / Search Engine Switcher](https://greasyfork.org/zh-CN/scripts/446492)。
// @icon          https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org


// @match         *://www.google.com/search?q=*
// @match         *://www.merriam-webster.com/dictionary/*
// @match         *://www.ldoceonline.com/dictionary/*
// @match         *://dictionary.cambridge.org/dictionary/english/*
// @match         *://www.vocabulary.com/dictionary/*
// @match         *://www.collinsdictionary.com/dictionary/english/*
// @match         *://www.oxfordlearnersdictionaries.com/definition/english/*
// @match         *://www.oxfordlearnersdictionaries.com/definition/american_english/*
// @match         *://www.britannica.com/dictionary/*
// @match         *://www.macmillandictionary.com/dictionary/british/*
// @match         *://www.etymonline.com/search?q=*
// @match         *://cn.bing.com/dict/search?q=*
// @match         *://www.urbandictionary.com/define.php?term=*
// @match         *://en.wikipedia.org/wiki/*
// @match         *://www.voicetube.com/definition/*
// @match         *://dict.youdao.com/w/*
// @match         *://dict.eudic.net/dicts/en/*
// @match         *://fanyi.sogou.com/text?keyword=*
// @match         *://www.jukuu.com/search.php?q=*
// @match         *://www.91dict.com/words*
// @match         *://www.zdic.net/hans/*
// @match         *://www.moedict.tw/*
// @match         *://youglish.com/pronounce/*
// @match         *://www.dictionary.com/browse/*
// @match         *://www.eigochigai.com/search?q=*
// @match         *://en.wiktionary.org/wiki/*

// @grant         unsafeWindow
// @grant         window.onload
// @grant         GM_getValue
// @grant         GM_setValue
// @run-at        document-body

// @license       MIT
// @downloadURL https://update.greasyfork.org/scripts/463882/%E8%AF%8D%E5%85%B8%E5%88%87%E6%8D%A2%20%20Dictionary%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/463882/%E8%AF%8D%E5%85%B8%E5%88%87%E6%8D%A2%20%20Dictionary%20Switcher.meta.js
// ==/UserScript==

// 辞典网址配置
const urlMapping = [
    {
		name: "Google",
		dicUrl: "https://www.google.com/search?q=",
		keyName: "q",
        testUrl: /https:\/\/www.google.com\/search.*/,
	},
    {
		name: "Oxford",
		dicUrl: "https://www.oxfordlearnersdictionaries.com/definition/english/",
		keyName: "",
		testUrl: /https:\/\/www.oxfordlearnersdictionaries.com\/definition\/english\/*/,
	},
	{
		name: "Oxford美式",
		dicUrl: "https://www.oxfordlearnersdictionaries.com/definition/american_english/",
		keyName: "",
		testUrl: /https:\/\/www.oxfordlearnersdictionaries.com\/definition\/american_english\/*/,
	},
	{
		name: "韦氏词典",
		dicUrl: "https://www.merriam-webster.com/dictionary/",
		keyName: "",
		testUrl: /https:\/\/www.merriam-webster.com\/dictionary\/*/,
	},
	{
		name: "Longman",
		dicUrl: "https://www.ldoceonline.com/dictionary/",
		keyName: "",
		testUrl: /https:\/\/www.ldoceonline.com\/dictionary\/*/,
	},
	{
		name: "Cambridge",
		dicUrl: "https://dictionary.cambridge.org/dictionary/english/",
		keyName: "",
		testUrl: /https:\/\/dictionary.cambridge.org\/dictionary\/english\/*/,
	},
	{
		name: "Macmillan",
		dicUrl: "https://www.macmillandictionary.com/dictionary/british/",
		keyName: "",
		testUrl: /https:\/\/www.macmillandictionary.com\/dictionary\/british\/*/,
	},
	{
		name: "Etymo词源",
		dicUrl: "https://www.etymonline.com/search?q=",
		keyName: "q",
		testUrl: /https:\/\/www.etymonline.com\/search.*/,
    },
	{
		name: "Vocabulary",
		dicUrl: "https://www.vocabulary.com/dictionary/",
		keyName: "",
		testUrl: /https:\/\/www.vocabulary.com\/dictionary\/*/,
	},
	{
		name: "Collins",
		dicUrl: "https://www.collinsdictionary.com/dictionary/english/",
		keyName: "",
		testUrl: /https:\/\/www.collinsdictionary.com\/dictionary\/english\/*/,
	},
	{
		name: "Britannica",
		dicUrl: "https://www.britannica.com/dictionary/",
		keyName: "",
		testUrl: /https:\/\/www.britannica.com\/dictionary\/*/,
	},
	{
		name: "YouGlish",
		dicUrl: "https://youglish.com/pronounce/",
		keyName: "",
		testUrl: /https:\/\/youglish.com\/pronounce\/*/,
	},
	{
		name: "Dictionary",
		dicUrl: "https://www.dictionary.com/browse/",
		keyName: "",
		testUrl: /https:\/\/www.dictionary.com\/browse\/*/,
	},
	{
		name: "有道词典",
		dicUrl: "https://dict.youdao.com/w/",
		keyName: "",
		testUrl: /https:\/\/dict.youdao.com\/w\/*/,
	},
	{
		name: "欧路词典",
		dicUrl: "https://dict.eudic.net/dicts/en/",
		keyName: "",
		testUrl: /https:\/\/dict.eudic.net\/dicts\/en\/*/,
	},
//	{
//		name: "Wiktionary",
//		dicUrl: "https://en.wiktionary.org/wiki/",
//		keyName: "",
//		testUrl: /https:\/\/en.wiktionary.org\/wiki\/*/,
//	},
//	{
//		name: "Bing",
//		dicUrl: "https://cn.bing.com/dict/search?q=",
//		keyName: "q",
//		testUrl: /https:\/\/cn.bing.com\/dict\/search.*/,
//	},
//	{
//		name: "Urban",
//		dicUrl: "https://www.urbandictionary.com/define.php?term=",
//		keyName: "term",
//		testUrl: /https:\/\/www.urbandictionary.com\/define.php.*/,
//	},
//	{
//		name: "Wikipedia",
//		dicUrl: "https://en.wikipedia.org/wiki/",
//		keyName: "",
//		testUrl: /https:\/\/en.wikipedia.org\/wiki\/*/,
//	},
//	{
//		name: "VoiceTube",
//		dicUrl: "https://www.voicetube.com/definition/",
//		keyName: "",
//		testUrl: /https:\/\/www.voicetube.com\/definition\/*/,
//	},
//	{
//		name: "人人词典",
//		dicUrl: "https://www.91dict.com/words?w=",
//		keyName: "w",
//		testUrl: /https:\/\/www.91dict.com\/words.*/,
//	},
//	{
//		name: "搜狗翻译",
//		dicUrl: "https://fanyi.sogou.com/text?keyword=",
//		keyName: "keyword",
//		testUrl: /https:\/\/fanyi.sogou.com\/text.*/,
//	},
//	{
//		name: "句酷",
//		dicUrl: "http://www.jukuu.com/search.php?q=",
//		keyName: "q",
//		testUrl: /http:\/\/www.jukuu.com\/search.php.*/,
//	},
//	{
//		name: "Eigochigai",
//		dicUrl: "https://www.eigochigai.com/search?q=",
//		keyName: "q",
//		testUrl: /https:\/\/www.eigochigai.com\/search.*/,
//	},
//	{
//		name: "汉典",
//		dicUrl: "https://www.zdic.net/hans/",
//		keyName: "",
//		testUrl: /https:\/\/www.zdic.net\/hans\/*/,
//	},
//	{
//		name: "国语辞典/两岸辞典",
//		dicUrl: "https://www.moedict.tw/",
//		keyName: "",
//		testUrl: /https:\/\/www.moedict.tw\/*/,
//	},
];

// JS 获取 url 参数
function getQueryVariable(variable) {
	let query = window.location.search.substring(1);
	if (query === "") {
	    return decodeURIComponent(window.location.href.split("/").pop());
	} else {
    	let pairs = query.split("&");
    	for (let pair of pairs) {
    		let [key, value] = pair.split("=");
    		if (key === variable) {
    			return decodeURIComponent(value);
    		}
    	}
	}
	return null;
}

// 从 url 中获取搜索关键词
function getKeywords() {
	let keywords = "";
	for (let item of urlMapping) {
		if (item.testUrl.test(window.location.href)) {
			keywords = getQueryVariable(item.keyName);
			break;
		}
	}
	console.log(keywords);
	return keywords;
}

// 添加节点
function addBox() {
	// 主元素
	const dics = document.createElement("div");
	dics.id = "dic-app-box";
	dics.style = `
	    position: fixed;
		top: 150px;
		left: 12px;
		width: 100px;
		background-color: hsla(200, 40%, 96%, .8);
		font-size: 12px;
		border-radius: 6px;
		z-index: 99999;`;
	document.body.insertAdjacentElement("afterbegin", dics);

	// 标题
	let title = document.createElement("span");
	title.innerText = "切换辞典";
	title.style = `
		display: block;
		color: hsla(211, 60%, 35%, .8);
		text-align: center;
		margin-top: 10px;
		margin-bottom: 5px;
		font-size： 12px;
		font-weight: bold;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select:none;`;
	dics.appendChild(title);

	// 辞典列表
	for (let index in urlMapping) {
		let item = urlMapping[index];

		// 列表样式
		let style = `
		    text-align: center;
			display: block;
			color: hsla(211, 60%, 35%, .8) !important;
			padding: 5px 5px;
			text-decoration: none;`;
		let defaultStyle = style + `
		    color: hsla(211, 60%, 35%, .8) !important;`;
		let hoverStyle = style + `
			background-color: hsla(211, 60%, 35%, .1);`;

		// 设置辞典链接
		let a = document.createElement("a");
		a.innerText = item.name;
		a.style = defaultStyle;
		a.className = "dic-a";
		a.href = item.dicUrl + getKeywords();

		// 鼠标移入&移出效果，相当于 hover
		a.onmouseenter = function() {
			this.style = hoverStyle;
		};
		a.onmouseleave = function() {
			this.style = defaultStyle;
		};
		dics.appendChild(a);
	}
}

(function() {
	"use strict";
	window.onload = addBox();
})();