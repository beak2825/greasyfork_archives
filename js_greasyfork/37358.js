// ==UserScript==
// @namespace		ATGT
// @name			Bing Dict, Translate by selecting words, with pronunciation
// @name:zh-CN	 	必应词典，划词翻译，带英语发音
// @description		Translate selected words by Bing Dict(Dictionary support EN to CN, CN to EN), with EN pronunciation, with CN pinyin. Translation is enabled by default, click the 'Bing Dict' icon at bottom left to toggle translation. Auto play pronunciation can be enabled in menu.
// @description:zh-CN	划词翻译，使用必应词典(支持英汉、汉英)，带英语发音，带中文拼音。默认开启翻译，点击左下角的'Bing Dict'图标来开启/关闭翻译。自动发音可以通过菜单启用。
// @version		1.4.31
// @author		StrongOp
// @license     MIT
// @supportURL	https://github.com/strongop/user-scripts/issues
// @match	http://*/*
// @match	https://*/*
// -match	https://github.com/*
// @require	https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant	GM.xmlHttpRequest
// @grant	GM_xmlhttpRequest
// @grant	GM.setValue
// @grant	GM.getValue
// @grant	GM_setValue
// @grant	GM_getValue
// @grant	GM.registerMenuCommand
// @grant	GM_registerMenuCommand
// @connect	www.bing.com
// @connect	cn.bing.com
// @connect	dict.bing.com
// @icon	https://www.bing.com/favicon.ico
// @run-at	document-end
// @downloadURL https://update.greasyfork.org/scripts/37358/Bing%20Dict%2C%20Translate%20by%20selecting%20words%2C%20with%20pronunciation.user.js
// @updateURL https://update.greasyfork.org/scripts/37358/Bing%20Dict%2C%20Translate%20by%20selecting%20words%2C%20with%20pronunciation.meta.js
// ==/UserScript==

/* eslint: */
/* global GM GM_xmlhttpRequest GM_setValue GM_getValue GM_registerMenuCommand */
/* eslint curly: ["off", "multi", "consistent"] */
/* eslint no-empty: "off" */
/*
Change Log:
1.4.31:
	3 Sep 2024, Fix parsing `octave` failure.
1.4.30:
	22 Mar 2024, Fix for bing dict web chagne.
1.4.29:
	7 Dec 2023, Fix mobile browser support.
v1.4.28:
	6 Dec 2023, Fix pronunciation.
v1.4.23:
	15 Oct 2019, Fix view removed by other script, create every time. rename names realted to enableTrans.
v1.4.21:
	29 Mar 2019, Icon not show correctly if auto trans enabled and previously explicit disabled.
				CSS sucks.
v1.4.20:
	28 Mar 2019, Add menu for auto translation, tune icon style.
v1.4.15:
	16 Feb 2019, Use int max as z-index to fix overlayed in vgr.com
v1.4.13:
	13 Feb 2019, Add autoplay pronunciation menu
v1.4.5:
	2 Feb 2019, Use more reliable CSS strategy.
v1.4.4:
	2 Feb 2019, Fix click headword, fix enable/disable translate, fix translate selected on result view.
v1.4.1:
	31 Jan 2019, Refactor with class, Add pronunciation support.
v1.3.8:
	30 Jan 2019, Need user click on checkbox to enable translate.
v1.3.5:
	21 Dec 2018, Fix GM_xmlhttpRequest not def in Greasemonkey, GM not define in Tampermonkey
v1.3.4:
	28 Nov 2018, Fix GM.xmlHttpRequest not def in chrome.
v1.3.3:
	28 Jan 2018, Fix dict provider overlap with result.
				 Add test cases.
v1.3.2:
	27 Jan 2018, Add dict provider name: Bing Dict.
v1.3.1:
	19 Jan 2018, Escape suggested words.
v1.3:
	19 Jan 2018, refactor & parse search suggestion.
v1.2:
	14 Jan 2018, Escape search word and result.
v1.1:
	13 Jan 2018, Reset style for result div.
v1.0:
	12 Jan 2018, Initial version.
*/


console.log(`=== bing-dict on '${location.href}' ===`);
let dict_result_id = 'ATGT-bing-dict-result-wrapper';
const DICT_RESULT_CSS = `
	div#${dict_result_id}-reset {
		all: initial;
	}
	div#${dict_result_id}-reset * {
		all: initial;
		display: block;
		font-family: sans-serif;
		font-size: small;
		font-weight: normal;
		white-space: normal;
		margin: 0 0;
		padding: 0 0;
	}
	div#${dict_result_id}-reset audio,
	div#${dict_result_id}-reset img,
	div#${dict_result_id}-reset input,
	div#${dict_result_id}-reset label {
		display: inline-block;
	}
	div#${dict_result_id}-reset a,
	div#${dict_result_id}-reset span {
		display: inline;
	}
	div#${dict_result_id} {
		display: block;
		position: fixed;
		left: 2px;
		bottom: 2px;
		max-width: 32%;
		z-index: 2147483647;
		padding: 2px 2px;
		margin: 0px 0px;
		color: silver !important;
		background-color: rgba(255,255,255,0.9) !important;
		border-radius: 4px;
	}
	div#${dict_result_id} .margin-for-badget {
		margin-right: 20px;
	}
	div#${dict_result_id} input.dict-provider {
		display: none;
	}
	div#${dict_result_id} input.dict-provider ~ label img {
		border-radius: 3px;
		transition: all 0.2s ease-in-out;
		width: 16px;
		vertical-align: bottom;
	}
	div#${dict_result_id} input.dict-provider:not(:checked) ~ label img {
		filter: gray; /* IE */
		-webkit-filter: grayscale(1); /* Old WebKit */
		-webkit-filter: grayscale(100%); /* New WebKit */
		filter: url(resources.svg#desaturate); /* older Firefox */
		filter: grayscale(100%); /* Current draft standard */
	}
	div#${dict_result_id}[data-display-mode="Result"] input.dict-provider + label img {
		position: absolute;
		top: 2px;
		right: 2px;
	}
	div#${dict_result_id} input.dict-provider ~ label img:hover {
		width: 32px;
	}
	div#${dict_result_id} .search_suggest_area ul li * {
		font-size: x-small;
	}
	div#${dict_result_id} .error {
		color: red;
	}
	div#${dict_result_id} .headword {
		display: inline-block;
		margin-right: 20px;
	}
	div#${dict_result_id} .headword a {
		font-weight: bold;
		font-size: medium;
	}
	div#${dict_result_id} .div_title {
		font-weight: bold;
	}
	div#${dict_result_id} .suggest_word {
		margin-right: 5px;
	}
	div#${dict_result_id} .mach_trans {
		display: inline-block;
		font-style: italic;
		font-size: x-small;
	}
	/* a: link visited hover active, the order matters */
	div#${dict_result_id} a:link {
		color: #37a;
		background-color: rgba(255,255,255,0.9);
		text-decoration: none;
	}
	div#${dict_result_id} a:visited {
		color: #37a;
	}
	div#${dict_result_id} a:hover {
		color: white;
		background-color: #37a;
		cursor: pointer;
	}
	div#${dict_result_id} .pronuce {
		display: block
	}
	div#${dict_result_id} .pronuce * {
		color: gray;
	}
	div#${dict_result_id} audio {
		width: 0;
		height: 0;
	}
	div#${dict_result_id} .pronuce a:hover {
		color: white;
		background-color: rgba(255,255,255,0.9);
	}
	div#${dict_result_id} .mach_trans_result {
		color: gray;
	}
	div#${dict_result_id} ul {
		list-style-type: none;
		padding: 1px;
		margin: 0px;
	}
	div#${dict_result_id} ul li{
		margin-top: 1px;
		color: gray;
	}
	div#${dict_result_id} ul li span.def-category {
		float:left;
		color: white;
		background-color: gray;
		text-align: center;
		padding: 0 2px;
		margin-right: 3px;
		border-radius: 3px;
	}
	div#${dict_result_id} a img.audioPlayer:hover {
		opacity: 0.8;
	}
	div#${dict_result_id} img.audioPlayer {
		width: 1em;
		height: 1em;
	}
/*
	body {
		background: gray;
	}
*/
`;

class DictResultView {
	//dictResultDiv;
	constructor(prefs) {
		this.prefs = prefs;
		this.initView();
	}

	initView() {
		this.addStyleSheet();
		this.createDictResultDiv();
	}

	addStyleSheet() {
		let cssid = `${dict_result_id}-css`;
		if (document.querySelector(`#${cssid}`))
			return;
		let style = document.createElement('STYLE');
		style.type = 'text/css';
		style.id = cssid;
		style.appendChild(document.createTextNode(DICT_RESULT_CSS));
		document.head.appendChild(style);
	}

	createDictResultDiv() {
		let div_wrapper_reset = document.createElement('DIV');
		div_wrapper_reset.id = `${dict_result_id}-reset`;
		let div = document.createElement('DIV');
		div.id = `${dict_result_id}`;
		div_wrapper_reset.appendChild(div);
		document.body.appendChild(div_wrapper_reset);
		this.dictResultDiv = div;
	}

	setProvider(provider) {
		this.dictProvider = provider;
	}

	setResult(defs) {
		this.dictResultDiv.innerHTML = this.dictProvider.dictProviderDesc + defs;
		this.dictResultDiv.style.display = 'block';
		this.showEnableTransBtn();
		if (this.prefs.isTransEnabled()) {
			this.dictResultDiv.style.minWidth = '200px';
			this.dictResultDiv.style.background = 'rgba(255, 255, 255, 0.9) !important';
		} else {
			this.dictResultDiv.style.minWidth = 'unset';
			this.dictResultDiv.style.background = 'rgba(255, 255, 255, 0.6) !important';
		}
		// DO NOT DELETE, set mode to use different css rules
		this.dictResultDiv.dataset['displayMode'] = (defs.length == 0) ? 'IconOnly' : 'Result';
	}

	hideResult() {
		this.dictResultDiv.style.display = 'none';
		this.enableTransBtnVisibility = false;
		let wrapper = document.querySelector(`#${dict_result_id}-reset`);
		if (wrapper)
			wrapper.remove();
	}

	mouseEventInView(event) {
		if (!/touch|mouse/.test(event.type) && !event.clientX)
			return;

		let lastPos;
		if (/touch/.test(event.type)) {
			let touches = event.touches;
			lastPos = touches.item(touches.length - 1) || {}
			this.lastTouch = lastPos;
			this.lastTouchTime = Date.now();
		} else {
			lastPos = event;
		}

		// if Mouse is inside result element
		let divRect = this.dictResultDiv.getBoundingClientRect();
		let isInView = (lastPos.clientX >= divRect.left && lastPos.clientX <= divRect.right &&
			lastPos.clientY >= divRect.top && lastPos.clientY <= divRect.bottom);
		// console.log(`InView ${isInView} lastpos ${lastPos.clientX},${lastPos.clientY}, divRect`,  JSON.stringify(divRect));
		return isInView;
	}

	mouseEventInDictProviderBanner(event) {
		if (!/touch|mouse/.test(event.type))
			return;

		let lastPos;
		if (/touch/.test(event.type)) {
			lastPos = event.touches.item(event.touches.length - 1) || {};
		} else {
			lastPos = event;
		}

		// if Mouse is inside dict provider to enable/disable tranlation
		try {
			let divRect = this.dictResultDiv.querySelector(`.dict-provider ~ label img`).getBoundingClientRect();
			let isInView = (lastPos.clientX >= divRect.left && lastPos.clientX <= divRect.right &&
				lastPos.clientY >= divRect.top && lastPos.clientY <= divRect.bottom);
			return isInView;
		} catch (e) {
			return false;
		}
	}

	showEnableTransBtn() {
		this.enableTransBtnVisibility = true;
		let prefs = this.prefs;
		let view = this;
		function enableTransBtnHandler(event) {
			//console.log('enableTransChoiceHandler called, translate enable ', event.target.checked);
			prefs.transEnabledOnPage = event.target.checked ? TRANS_EXPLICIT_ENABLE : TRANS_EXPLICIT_DISABLE;
			prefs.updateTransEnabledList(location.host, prefs.transEnabledOnPage);
			if (prefs.isTransEnabled() && CurrentSelWord.length > 0)
				setTimeout(view.dictProvider.search.bind(view.dictProvider), 0, CurrentSelWord);
			else
				view.hideResult();
		}
		let enableCheckbox = document.querySelector(`div#${dict_result_id} input#enableTrans`);
		enableCheckbox.checked = prefs.isTransEnabled();
		enableCheckbox.onclick = enableTransBtnHandler;
	}

}

var dictCache = {};
var entityMap = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;',
	'/': '&#x2F;',
	'`': '&#x60;',
	'=': '&#x3D;'
};

function escapeHtml(string) {
	return String(string).replace(/[&<>"'`=/]/g, function (s) {
		return entityMap[s];
	});
}

class DictProvider {
	//resultView;
	constructor(prefs, resultView) {
		this.prefs = prefs;
		this.resultView = resultView;
		this.dictProviderDesc = `
				<input type="checkbox" id="enableTrans" class="dict-provider" name="enableTrans">
				<label for="enableTrans">No Dict Provider</label>
			`;
		this.resultView.setProvider(this);
	}
	search(word) {
		console.log(`base DictProvider::search ${word}`);
		return 'not implement yet.';
	}
}

class BingDictProvider extends DictProvider {
	constructor(prefs, resultView) {
		super(prefs, resultView);
		let bingIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAAzUExURQyEhCOPjzGXl0Gfn1OoqF+urm61tX++vpPJyaXS0rLY2L7e3szl5dns7OXy8vP5+f///xfq9dcAAACMSURBVDjL1dPBDgIhDARQhq3bIhbm/792D4bVROjeNM6VF0rbkNK3Ar0hBk43iQHpuADtPwDyBcj1vuewRCG97FgD6STpJlgAVD7juuhCOQTmAOoxSAnaYiA1vCFbW5dwnC9gs1kXOppkldkczvjnLN+B22zUj3Hcyzbd1lb6vPgrUknX6Hdgt5x+kQNn5Q3ayatBLQAAAABJRU5ErkJggg==';
		this.dictProviderDesc = `
			<input type="checkbox" id="enableTrans" class="dict-provider" name="enableTrans"
				title="Click to enable/disable translation with Bing Dict" ><label for="enableTrans"><img src='${bingIcon}' alt='Bing Dict' title="Click to enable/disable translation with Bing Dict"></label>
			`;
		this.resultView.setProvider(this);
		this.baseDomain = 'dict.bing.com';
		this.webDomain = 'www.bing.com';
		this.baseURL = `https://${this.baseDomain}`;
		this.dictMarketIsCN = false;
	}

	search(word) {
		//console.log(`>>> do search ${word}`);
		let self = this;

		if (!this.dictMarketIsCN) {
			let changeMarketURL = `https://www.bing.com/?mkt=zh-CN`;
			(typeof GM_xmlhttpRequest != 'undefined' && GM_xmlhttpRequest || GM.xmlHttpRequest)({
				url: changeMarketURL,
				method: 'GET',
				onload: (response) => { self.dictMarketIsCN = true; },
				onerror: (response) => { console.log('Change market failed. Change to CN what so ever!'); self.dictMarketIsCN = true; },
			});
		}

		function limitedSearchString(headword) {
			return `${headword.substring(0, 77)}${(headword.length >= 77) ? '...' : ''}`;
		}

		/*
		function playAudio(audioLink) {
			let audio = new Audio(audioLink);
			audio.play();
		}*/
		function parseVoiceLink(elem, id_prefix) {
			let voiceLink;
			let lang = id_prefix.includes('US') ? 'US' : 'UK';
			//let voiceIcon;
			try {
				let linkElem = elem.childNodes[0];
				//console.log('PronuceLink', linkElem);
				voiceLink = linkElem.dataset['mp3link'];
				//let matches = handler.match(/'(https?:\/\/[^ ']*)'\s*,\s*'([^']*)'/m);
				//console.log('matches', matches);
				//voiceLink = matches[1];
			} catch (e) {
				console.log('parseVoiceLink', e);
				return '';
			}
			let id = `${id_prefix}_${Math.random()}`;
			let speakerIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAZCAYAAAAv3j5gAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAA3XAAAN1wFCKJt4AAAAB3RJTUUH4wICACYBOBTr1QAAAvZJREFUSMed1k2IVlUYB/Dfe8dRabqS9mFiEn3ZqQxC2lQU5a6FEBE4tAhaJUqrK0HRxkWLoBNupJA2UlCuigipdtXCwCyirEsLw4omM8aak5jizNui5x1ub+/YzDxwuefc8/F//s/n7VlA+vvv0Nt9HJSctuENNDhUN+3cqDO/70vGZv8Z102r5DQ/rkYdKDnp7T6u5DRectqJ97EBD2BsIeUuXpyDFdhaclpbN+38WjUKpLNhF17BeMxvGHVmIFft+Q4ewqd4tuQ0PmBWdQE6lFeXnPZi39Bd16I3rNiQXBmK7cS2/5huwKLktB3v4fkRSm8cwagX59bG/F28hho7Sk5rYEXJqcKLuB03hS/WLGCd1SPM3C85PYVnSk731k17quR0EE/gMbyAmQrPYQ8exq2XAIHLB4wGviw5TeBJ3IhXY98JfBSstpScehW2d02wBKlKTusxi/04i0dKTtfhZ3wZ++7DWIWblwiwKgLgLnyFl/AWTsf6ZPj7+5hvGQCtWyLQxnhfj6tD4zU42mEAv+H8ICUqS5e50PjzMNEtWN8x1eZ4z+BPXIPecoDmAXEGl0XenIrvg2A6H8+ES2X5ImQlNmE6LuwNBVW/U32Wx6jk1MPdof3X+DXMB390FBnHOfSXBVQ3bR8f420crpt2OoDh23hPhFmn0V+BC4G+WPkrwKbwaDDcgHti/YNOzZvAMcxV+GmJhH4ZUUx3RahP49BQGrQDoKPL8FG3lcBhTOHpumlnSk7ronaKljFbYS9OLhJjFv1OpR/47Aju77DZgAdjfKxu2rkqqN0WBXNrZ/MoudAJ2+F2faJu2tmS0yrsiET9MJiqIoLO4WzdtF/UTTsZLXtqBNDJLlC3j3U/4fEYH6yb9vR8wtZN22186qb9BHfi+NAlZ4aBRv2j4GUcwDsLdOF/t+eS06aS05GSUz+eN0tOKxcZMFX3rmqBhNQ/sFndtD9iEq/H0jcREJeMyLhjrhudvUVqd0X8aHyGH0b45X/lb9cUC+N7uVGjAAAAAElFTkSuQmCC';
			let voiceHTML = `<audio id="${id}" src="${voiceLink}" preload="auto" ${self.prefs.autoplayPronuce[lang] ? 'autoplay' : ''}></audio>
				<a onclick="javascript: document.getElementById('${id}').play()"
					onmouseover="javascript: document.getElementById('${id}').play()">
					<img class="audioPlayer" src="${speakerIcon}"></img>
				</a>`;
			return voiceHTML;
		}

		function parsePronuce(elem) {
			let prUS = elem.querySelector('.hd_prUS');
			let prUK = elem.querySelector('.hd_pr');
			let pronText = '';
			if (prUS)
				pronText = `<span>${escapeHtml(prUS.innerText)}</span>${parseVoiceLink(prUS.nextElementSibling, 'voiceUS')}
					&emsp;<span>${escapeHtml(prUK.innerText)}</span>${parseVoiceLink(prUK.nextElementSibling, 'voiceUK')}`;
			else
				pronText = `<span>${escapeHtml(elem.innerText)}</span>`;
			return pronText;
		}

		function parseDefinition(page, url) {
			//console.log('parseDefinition');
			let qdef = page.querySelector('.qdef');
			//console.log('qdef ', qdef);
			let hd_area = qdef.childNodes[0];
			let headword = '';
			let pronuce = '';
			try {
				headword = escapeHtml(hd_area.querySelector('#headword').innerText);
				pronuce = parsePronuce(hd_area.querySelector('.hd_tf_lh'));
			} catch (e) {
				console.log('parse headword/pronunce fail', e);
			}


			headword = `<div class='headword'>
				<a href='${url}' target='_blank'>${headword ? headword : word}</a>
				</div>`;
			pronuce = `<div class='pronuce'>${pronuce}</div>`;

			let defs = '';
			try {
				let def_area = qdef.childNodes[1];
				let def_list = def_area.querySelectorAll('li');
				defs = '<ul>';
				for (let def of def_list) {
					if (def.childNodes[0].nodeName == 'I')
						def = def.childNodes[0];
					defs += `<li><span class='def-category'>${escapeHtml(def.childNodes[0].innerText)}</span>
						${escapeHtml(def.childNodes[1].innerText)}</li>`;
				}
				defs += '</ul>';
			} catch (e) {
				console.log('parse defs fail', e);
				defs = '';
			}

			return headword + pronuce + defs;
		}

		function parseDictResultDom(page, url) {
			//console.log('page ', page);
			let qdef = page.querySelector('.qdef');
			if (qdef)
				return parseDefinition(page, url);
			else
				throw new Error("No results");
		}

		const FAILURE_MSG = `<ul>Try <a href='https://${self.webDomain}/translator?mkt=zh-CN' target='_blank'>Microsoft Translator</a></ul>
							<ul>Try web search <a href='https://${self.webDomain}/search?q=${encodeURIComponent(word)}' target='_blank'>${escapeHtml(limitedSearchString(word))}</a></ul>`;

		function parseDictResult(word, response) {
			//console.log('search dict ok', response);
			let defs = '';
			let url = response.finalUrl;
			try {
				let doc = (new DOMParser()).parseFromString(response.responseText, 'text/html');
				defs = parseDictResultDom(doc, url);
				// if (!defs)
				// 	defs = FAILURE_MSG;
				dictCache[word] = defs;
			} catch (e) {
				console.log('parseDictResult failed:\n ', e, e.stack);
				defs = `No results for <a href='${url}' target='_blank'>${escapeHtml(limitedSearchString(word))}</a>, <br />
          ${FAILURE_MSG}`;
			}

			self.resultView.setResult(defs);
		}

		function searchDictFail(word, response) {
			//console.log('search dict fail ', response);
			let url = response.finalUrl;
			let status = (response.status ? response.status : '')
				+ ' ' + (response.statusText ? response.statusText : '');

			self.resultView.setResult(`<span class='error'>Error</span>
				searching <a href='${url}' target='_blank'>${escapeHtml(limitedSearchString(word))}</a>, ${status}<br />
				${FAILURE_MSG}`);
		}

		function searchBingDict(word) {
			if (word in dictCache && dictCache[word]) {
				//console.log(`cache hit '${word}'`);
				self.resultView.setResult(dictCache[word]);
				return;
			} else {
				//console.log('cache miss');
			}
			let url = `${self.baseURL}/search?q=${encodeURIComponent(word)}&mkt=zh-CN`;
			console.log('querying', url);
			self.resultView.setResult(`Searching <span class='headword'>
					<a href='${url}' target='_blank'>${escapeHtml(limitedSearchString(word))}</a>
				</span>`);

			GM.xmlHttpRequest({
				url: url,
				method: 'GET',
				onload: (response) => parseDictResult(word, response),
				onerror: (response) => searchDictFail(word, response),
			});
		}

		searchBingDict(word);
	}
}

var CurrentSelWord = '';
const TRANS_EXPLICIT_NONE = 0;
const TRANS_EXPLICIT_DISABLE = 1;
const TRANS_EXPLICIT_ENABLE = 2;

class DictPrefs {
	constructor() {
		this.transEnabledOnPage = TRANS_EXPLICIT_NONE;
		this.globallyEnableAutoTrans = true;
		this.autoplayPronuce = {
			US: false,
			UK: false
		};
		this.checkEnableTrans();
		this.checkAutoPlay();
	}

	isTransEnabled() {
		return (this.transEnabledOnPage !== TRANS_EXPLICIT_DISABLE) &&
			(this.transEnabledOnPage === TRANS_EXPLICIT_ENABLE || this.globallyEnableAutoTrans);
	}

	updateTransEnabledList(key, value) {
		GM.getValue('transEnabledList', {}).then((transEnabledList) => {
			console.log(`update ${key} => ${value} into transEnabledList`, JSON.stringify(transEnabledList));
			transEnabledList[key] = value;
			GM.setValue('transEnabledList', transEnabledList);
			//console.log(`updated ${key} => ${value} into transEnabledList`, transEnabledList);
		});
	}

	checkEnableTrans() {
		GM.getValue('globallyEnableAutoTrans', {}).then((globallyEnableAutoTrans) => {
			console.log('globallyEnableAutoTrans', JSON.stringify(globallyEnableAutoTrans));
			if (typeof globallyEnableAutoTrans === 'undefined')
				return;
			if (typeof globallyEnableAutoTrans !== 'boolean') {
				GM.setValue('globallyEnableAutoTrans', true);
				globallyEnableAutoTrans = true;
			}
			this.globallyEnableAutoTrans = globallyEnableAutoTrans;
			GM.registerMenuCommand(`Globally ${(!this.globallyEnableAutoTrans) ? 'En' : 'Dis'}able auto translation.`, () => { this.setAutoTranslate(!this.globallyEnableAutoTrans); });
		});

		GM.getValue('transEnabledList', {}).then((transEnabledList) => {
			console.log('transEnabledList', JSON.stringify(transEnabledList));
			if (typeof transEnabledList === 'undefined')
				return;
			if (typeof transEnabledList !== 'object') {
				GM.setValue('transEnabledList', {});
				transEnabledList = {};
			}
			if (location.host in transEnabledList) {
				this.transEnabledOnPage = transEnabledList[location.host];
				if (typeof this.transEnabledOnPage === 'boolean') {
					this.transEnabledOnPage = this.transEnabledOnPage === true ? TRANS_EXPLICIT_ENABLE : TRANS_EXPLICIT_DISABLE;
					this.updateTransEnabledList(location.host, this.transEnabledOnPage);
				}
			}
		});
	}

	setAutoTranslate(en) {
		this.globallyEnableAutoTrans = en;
		GM.setValue('globallyEnableAutoTrans', en);
		location.reload();
	}

	checkAutoPlay() {
		GM.getValue('autoplayPronuce', {}).then((autoplayPronuce) => {
			console.log('autoplay', JSON.stringify(autoplayPronuce));
			if (!autoplayPronuce)
				return;
			if (typeof autoplayPronuce !== 'object') {
				GM.setValue('autoplayPronuce', {});
				autoplayPronuce = {};
			}
			this.autoplayPronuce.US = autoplayPronuce.US;
			this.autoplayPronuce.UK = autoplayPronuce.UK;
			if (self == top) {
				GM.registerMenuCommand(`Globally ${(!this.autoplayPronuce.US) ? 'En' : 'Dis'}able auto US pronunce.`, () => { this.setAutoplay('US', !this.autoplayPronuce.US); });
				GM.registerMenuCommand(`Globally ${(!this.autoplayPronuce.UK) ? 'En' : 'Dis'}able auto UK pronunce.`, () => { this.setAutoplay('UK', !this.autoplayPronuce.UK); });
			}
		});
	}

	setAutoplay(lang, on) {
		console.log(`${on ? 'en' : 'dis'}able auto play of ${lang} pronunciation`);
		this.autoplayPronuce[lang] = on;
		GM.setValue('autoplayPronuce', this.autoplayPronuce);
		location.reload();
	}
}
var dictPrefs = new DictPrefs();
//dictPrefs.checkEnableTrans();

var dictResultView = new DictResultView(dictPrefs);
var bingDict = new BingDictProvider(dictPrefs, dictResultView);
var selChangeTimer;

/*
click/touch --> `Bing Icon` to toggle Enable/Disable
			--> Click page to hide `result view`
			--> Show `Bing Icon`
			--> Click/SelectWord in `result view`
			--> Do Translate
*/

function onSelectionChange(event) {
	if (event.type = 'selectionchange') {
		clearTimeout(selChangeTimer);
		let delay = Date.now() - dictResultView.lastTouchTime
		// console.log('selchange delay after touch ', delay)
		if (delay < 500) {
			event.clientX = dictResultView.lastTouch.clientX;
			event.clientY = dictResultView.lastTouch.clientY;
		}
	}
	if (!document.querySelector(`#${dict_result_id}`)) {
		dictResultView.initView();
	}
	// click on enable/disable translation Icon, return, so the checkbox handler can be called
	if (dictResultView.mouseEventInDictProviderBanner(event))
		return;

	// get selected word/sentense
	CurrentSelWord = window.getSelection().toString().replace(/^\s*|\s*$/g, '');
	console.log(`selected: '${CurrentSelWord}', length ${CurrentSelWord.length}, event ${event.type}`);

	// click on page other than result view hides the result view
	if (!dictResultView.mouseEventInView(event) && CurrentSelWord.length == 0) {
		dictResultView.hideResult();
		return;
	}

	// show enable translate option if not enabled
	if (!dictPrefs.isTransEnabled()) {
		if (!dictResultView.enableTransBtnVisibility)
			dictResultView.setResult('');
		console.log('translate not enabled.');
		return;
	}

	// return if single click on result view
	// return if click headword to open new tab
	// go on translate if word selected in page/result_view
	if (dictResultView.mouseEventInView(event) &&
		(CurrentSelWord.length == 0 || event.target.nodeName == 'A' ||
			event.target.parentNode.nodeName == 'A')) {
		return;
	}

	if (CurrentSelWord.length == 0) {
		// no word to search
		dictResultView.hideResult();
	} else if (event.type = 'selectionchange') {
		selChangeTimer = setTimeout(() => bingDict.search(CurrentSelWord), 700);
	} else if (event.type == 'mouseup') {
		bingDict.search(CurrentSelWord);
	} else {
		// 'touchend' does nothing, only hides dict result view
	}
}

function is_touch_present() {
	return ('ontouchstart' in window) || ('onmsgesturechange' in window);
}

function is_mouse_present() {
	return (('onmousedown' in window) && ('onmouseup' in window) && ('onmousemove' in window) && ('onclick' in window) && ('ondblclick' in window) && ('onmousemove' in window) && ('onmouseover' in window) && ('onmouseout' in window) && ('oncontextmenu' in window));
}

console.log("Touch Present: " + is_touch_present());
console.log("Mouse Present: " + is_mouse_present());


if (is_touch_present()) {
	document.addEventListener('selectionchange', onSelectionChange);
	document.addEventListener('touchstart', onSelectionChange);
} else {
	document.addEventListener('mouseup', onSelectionChange);
}

function dictTest() {
	let testWords = [
		'tunnel',
		'hello', // word definition
		'browsing experience', // long sentense
		'你好',
		'hello, this is world', //machine translation
		'ndalo', // ambigous
		'DNS queries', // example sentence only
		'<script>', // html escape
		'',
		'overrideMimeType', // no result
	];
	for (let i = 0; i < testWords.length; i++) {
		setTimeout(bingDict.search.bind(bingDict), (i + 1) * 3000, testWords[i]);
	}
	dictResultView.setResult(
		`<pre>
		/*TODO:
		* 1. Translation enable/disable test.
		* 2. Audio/voice test.
		*/
		</pre>`);
}
// dictTest();

console.log(`=== /bing-dict on '${location.href}' ===`);
