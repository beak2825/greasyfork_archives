// ==UserScript==
// @name					排骨翻译捷径
// @namespace			http://tampermonkey.net/
// @version				0.1
// @description		选择文本 右键翻译, 目前支持 google, bing
// @author				cuteribs
// @include				*
// @grant					GM.openInTab
// @grant					GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/435478/%E6%8E%92%E9%AA%A8%E7%BF%BB%E8%AF%91%E6%8D%B7%E5%BE%84.user.js
// @updateURL https://update.greasyfork.org/scripts/435478/%E6%8E%92%E9%AA%A8%E7%BF%BB%E8%AF%91%E6%8D%B7%E5%BE%84.meta.js
// ==/UserScript==

// 请自行修改下述配置
const translators = [
	{
		name: 'bing 翻译',
		url: 'https://cn.bing.com/translator?&fromLang={srcLang}&to={tgtLang}&text={text}',
		srcLang: 'en', //'auto-detect',
		tgtLang: 'zh-Hans'
	},
	{
		name: 'google 翻译',
		url: 'https://translate.google.cn/?sl={srcLang}&tl={tgtLang}&text={text}',
		srcLang: 'en', //'auto',
		tgtLang: 'zh-CN'
	}
	// {
	// 	name: '自己添加其它 翻译',
	// 	url: '',
	// 	srcLang: '',
	// 	tgtLang: ''
	// }
];

// 实现代码
(function () {
	'use strict';

	async function translate(translator) {
		const text = document.getSelection().toString().trim();

		if(!text) return;

		const url = translator.url
			.replace('{srcLang}', translator.srcLang)
			.replace('{tgtLang}', translator.tgtLang)
			.replace('{text}', encodeURIComponent(text));
		window.open(url, 'translator');
		//GM.openInTab(url);
	}

	for (const t of translators) {
		GM.registerMenuCommand('🀄 ' + t.name, () => translate(t));
	}
})();
