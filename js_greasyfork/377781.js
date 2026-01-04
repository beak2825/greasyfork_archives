// ==UserScript==
// @name         PttChrome and term.ptt.cc Enhanced Add-on
// @namespace    https://greasyfork.org/zh-TW/scripts/377781-pttchrome-and-term-ptt-cc-enhanced-add-on
// @supportURL   https://github.com/alan23273850/PttChrome-and-term.ptt.cc-Enhanced-Add-on
// @description  將 PttChrome Long Change 融入 PttChrome+term.ptt.cc Add-on 之中，以實作出有效率地計算推、噓、箭頭、總樓數之 PC 版腳本，它同時擁有兩支腳本的功能，而且可在 PttChrome 或 term.ptt.cc 執行。
// @version      1.2.3
// @license      MIT
// @author       alan23273850
// @compatible   firefox
// @compatible   chrome (or chromium-based)
// @include      https://iamchucky.github.io/PttChrome/*
// @include      https://term.ptt.cc/
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tippy.js/2.5.4/tippy.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://greasyfork.org/scripts/372760-gm-config-lz-string/code/GM_config_lz-string.js?version=634230
// @require      https://greasyfork.org/scripts/372675-flags-css/code/Flags-CSS.js?version=632757
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/377781/PttChrome%20and%20termpttcc%20Enhanced%20Add-on.user.js
// @updateURL https://update.greasyfork.org/scripts/377781/PttChrome%20and%20termpttcc%20Enhanced%20Add-on.meta.js
// ==/UserScript==
"use strict";
//===================================
const isTerm = window.location.href.match(/term.ptt.cc/);
let configStatus = false, configBlackStatus = false, flagMap = {};
let fields = { // Fields object
	'isAddFloorNum': {
		'label': '是否顯示推文樓層', // Appears next to field
		'type': 'checkbox', // Makes this setting a checkbox input
		'default': true // Default value if user doesn't change it
	},
	'isMouseBrowsingFriendly': { // (E) mouse browsing-friendly mode
		'label': '是否啟用滑鼠瀏覽友善模式', // Appears next to field
		'type': 'checkbox', // Makes this setting a checkbox input
		'default': false // Default value if user doesn't change it
	},
	'isShowFlags': {
		'label': '看板內若有IP(ex.Gossiping)，是否依IP顯示國旗', // Appears next to field
		'type': 'checkbox', // Makes this setting a checkbox input
		'default': true // Default value if user doesn't change it
	},
	'whenShowFlagsIgnoreSpecificCountrys': {
		'label': '指定國家不顯示 ex.「tw;jp」(ISO 3166-1 alpha-2)', // Appears next to field
		'type': 'text', // Makes this setting a text input
		'size': 35, // Limit length of input (default is 25)
		'default': '' // Default value if user doesn't change it
	},
	'isShowDebug': {
		'label': '是否顯示DeBug紀錄', // Appears next to field
		'type': 'checkbox', // Makes this setting a checkbox input
		'default': false // Default value if user doesn't change it
	},
};
if (isTerm) {
	fields = Object.assign({
		'isAutoLogin': {
			'label': '是否自動登入', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'autoUser': {
			'label': '帳號', // Appears next to field
			'type': 'text', // Makes this setting a text input
			'size': 25, // Limit length of input (default is 25)
			'default': '' // Default value if user doesn't change it
		},
		'autoPassWord': {
			'label': '密碼', // Appears next to field
			'type': 'password', // Makes this setting a text input
			'size': 25, // Limit length of input (default is 25)
			'default': '' // Default value if user doesn't change it
		},
		'isAutoSkipInfo1': {
			'label': '是否自動跳過登入後歡迎畫面', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'isAutoToFavorite': {
			'label': '是否自動進入 Favorite 我的最愛', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'isEnableDeleteDupLogin': {
			'label': '當被問到是否刪除其他重複登入的連線，回答:', // Appears next to field
			'type': 'select', // Makes this setting a dropdown
			'options': ['N/A', 'Y', 'N'], // Possible choices
			'default': 'N/A' // Default value if user doesn't change it
		},
		'Button': {
			'label': '編輯黑名單', // Appears on the button
			'type': 'button', // Makes this setting a button input
			'size': 100, // Control the size of the button (default is 25)
			'click': function() { // Function to call when button is clicked
				if (configBlackStatus) gmcBlack.close();
				else if (!configBlackStatus) gmcBlack.open();
			}
		},
		'isHideViewImg': {
			'label': '是否隱藏黑名單圖片預覽', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'isHideViewVideo': {
			'label': '是否隱藏黑名單影片預覽', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		/*
		'isHideAll': {
			'label': '是否隱藏黑名單推文', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'whenHideAllShowInfo': {
			'label': '當隱藏黑名單推文顯示提示訊息', // Appears next to field
			'type': 'text', // Makes this setting a text input
			'size': 35, // Limit length of input (default is 25)
			'default': '<本文作者已被列黑名單>' // Default value if user doesn't change it
		},
		'whenHideAllShowInfoColor': {
			'label': '上述提示訊息之顏色', // Appears next to field
			'type': 'text', // Makes this setting a text input
			'class':'jscolor',
			'data-jscolor': '{hash:true}',
			'size': 10, // Limit length of input (default is 25)
			'default': '#c0c0c0' // Default value if user doesn't change it
		},
		'isReduceHeight': {
			'label': '是否調降黑名單推文高度', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'reduceHeight': {
			'label': '設定高度值(單位em)', // Appears next to field
			'type': 'float', // Makes this setting a text input
			'min': 0, // Optional lower range limit
			'max': 10, // Optional upper range limit
			'size': 10, // Limit length of input (default is 25)
			'default': 0.4 // Default value if user doesn't change it
		},
		'isReduceOpacity': {
			'label': '是否調降黑名單推文透明值', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'reduceOpacity': {
			'label': '設定透明值', // Appears next to field
			'type': 'float', // Makes this setting a text input
			'min': 0, // Optional lower range limit
			'max': 1, // Optional upper range limit
			'size': 10, // Limit length of input (default is 25)
			'default': 0.05 // Default value if user doesn't change it
		},
		'isDisableClosePrompt': {
			'label': '是否停用關閉頁面提示', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		*/
	}, fields);
} else {
	fields = Object.assign({
		'isHideAll': {
			'label': '是否隱藏黑名單推文', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'whenHideAllShowInfo': {
			'label': '當隱藏黑名單推文顯示提示訊息', // Appears next to field
			'type': 'text', // Makes this setting a text input
			'size': 35, // Limit length of input (default is 25)
			'default': '<本文作者已被列黑名單>' // Default value if user doesn't change it
		},
		'whenHideAllShowInfoColor': {
			'label': '上述提示訊息之顏色', // Appears next to field
			'type': 'text', // Makes this setting a text input
			'class':'jscolor',
			'data-jscolor': '{hash:true}',
			'size': 10, // Limit length of input (default is 25)
			'default': '#c0c0c0' // Default value if user doesn't change it
		},
		'isHideViewImg': {
			'label': '是否隱藏黑名單圖片預覽', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'isHideViewVideo': {
			'label': '是否隱藏黑名單影片預覽', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'isReduceHeight': {
			'label': '是否調降黑名單推文高度', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'reduceHeight': {
			'label': '設定高度值(單位em)', // Appears next to field
			'type': 'float', // Makes this setting a text input
			'min': 0, // Optional lower range limit
			'max': 10, // Optional upper range limit
			'size': 10, // Limit length of input (default is 25)
			'default': 0.4 // Default value if user doesn't change it
		},
		'isReduceOpacity': {
			'label': '是否調降黑名單推文透明值', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'reduceOpacity': {
			'label': '設定透明值', // Appears next to field
			'type': 'float', // Makes this setting a text input
			'min': 0, // Optional lower range limit
			'max': 1, // Optional upper range limit
			'size': 10, // Limit length of input (default is 25)
			'default': 0.05 // Default value if user doesn't change it
		},
	}, fields);
};
const queryConfigEl = (configSelectors, selectors, callback) => {
	let configEl = document.querySelector(configSelectors);
	if (!configEl) {
		setTimeout(queryConfigEl.bind(null, configSelectors, selectors, callback), 1000);
		return;
	}
	configEl = configEl.contentWindow.document.querySelector(selectors);
	if (!configEl) {
		setTimeout(queryConfigEl.bind(null, configSelectors, selectors, callback), 1000);
		return;
	}
	callback(configEl);
};

const addCssLink = (id, cssStr) => {
	let checkEl = document.querySelector(`#${id}`);
	if (checkEl) {
		checkEl.remove();
	}
	const cssLinkEl = document.createElement('link');
	cssLinkEl.setAttribute('rel', 'stylesheet');
	cssLinkEl.setAttribute('id', id);
	cssLinkEl.setAttribute('type', 'text/css');
	cssLinkEl.setAttribute('href', 'data:text/css;charset=UTF-8,' + encodeURIComponent(cssStr));
	document.head.appendChild(cssLinkEl);
};
const gmc = new ConfigLzString({
	'id': 'PttChromeAddOnConfig', // The id used for this instance of GM_config
	'title': 'PttChrome Add-on Settings', // Panel Title
	'fields': fields,
	'events': { // Callback functions object
		'open': function() {
			this.frame.setAttribute('style', "border: 1px solid #AAA;color: #999;background-color: #111; width: 23em; height: 35em; position: fixed; top: 2.5em; right: 0.5em; z-index: 900;");

			configStatus = true;
		},
		'close': () => { configStatus = false;},
	},
	'css': `#PttChromeAddOnConfig * { color: #999 !important;background-color: #111 !important; } body#PttChromeAddOnConfig { background-color: #111}`,
	'src':`https://cdnjs.cloudflare.com/ajax/libs/jscolor/2.0.4/jscolor.js`,
});
const gmcDebug = new ConfigLzString({
	'id': 'PttChromeAddOnConfigDebug', // The id used for this instance of GM_config
	'title': 'PttChrome Add-on DeBugLog', // Panel Title
	'fields': { // Fields object
		'showLog': {
			'label': 'Show log of debug text',
			'type': 'textarea',
			'default': ''
		},
	},
	'events': { // Callback functions object
		'open': () => {
			gmcDebug.frame.setAttribute('style', "border: 1px solid #AAA;color: #999;background-color: #111; width: 26em; height: 35em; position: fixed; top: 2.5em; left: 0.5em; z-index: 900;");
		},
	},
	'css': `#PttChromeAddOnConfigDebug * { color: #999 !important;background-color: #111 !important; } body#PttChromeAddOnConfigDebug { background-color: #111} #PttChromeAddOnConfigDebug_field_showLog { width:26em; height: 24em;}`
});
const addBlackStyle = (blackList) => {
	if (blackList && blackList.trim().length === 0) return;
	blackList = blackList.replace(/\n$/g, '').replace(/\n\n/g, '\n');

	let opacityStyle = blackList.replace(/([^\n]+)/g, '.blu_$1').replace(/\n/g, ',');
	addCssLink('opacityStyle', `${opacityStyle} {opacity: 0.2;}`);

	if (gmc.get('isHideViewImg')) {
		let imgStyle = blackList.replace(/([^\n]+)/g, '.blu_$1 + div > .easyReadingImg').replace(/\n/g, ',');
		addCssLink('imgStyle', `${imgStyle} {display: none;}`);
	}
	if (gmc.get('isHideViewVideo')) {
		let videoStyle = blackList.replace(/([^\n]+)/g, '.blu_$1 + div > .easyReadingVideo').replace(/\n/g, ',');
		addCssLink('videoStyle', `${videoStyle} {display: none;}`);
	}
}
const gmcBlack = new ConfigLzString({
	'id': 'PttChromeAddOnConfigBlack', // The id used for this instance of GM_config
	'title': 'PttChrome Add-on Black List', // Panel Title
	'fields': { // Fields object
		'blackList': {
			'label': 'Black List',
			'type': 'textarea',
			'default': ''
		},
	},
	'events': { // Callback functions object
		'init': function() {
			addBlackStyle(this.get('blackList'));
		},
		'open': function() {
			gmcBlack.frame.setAttribute('style', "border: 1px solid #AAA;color: #999;background-color: #111; width: 26em; height: 35em; position: fixed; top: 2.5em; left: 0.5em; z-index: 900;");
			configBlackStatus = true;
		},
		'save': function() {
			addBlackStyle(this.get('blackList'));
		},
		'close': function() { configBlackStatus = false;},
	},
	'css': `#PttChromeAddOnConfigBlack * { color: #999 !important;background-color: #111 !important; } body#PttChromeAddOnConfigBlack { background-color: #111} #PttChromeAddOnConfigBlack_field_blackList { width:26em; height: 24em;}`
});
const HOST = 'https://osk2.me:9977',
	  ipValidation = /(\d{1,3}\.){3}\d{1,3}/,
	  timerArray = [];

let timestamp = Math.floor(Date.now() / 1000);
const execInterval = () => {
	if (timerArray.length === 0) {
		timerArray.push(setInterval(excute, 1000));
	}
}
const stopInterval = () => {
	while (timerArray.length > 0) {
		clearInterval(timerArray .shift());
	}
}
let currentNum, currentPage, pageData,
currentPush, currentShu, currentArrow, // (A)
authorName, // (B)
currentPusher, // (C)
board, // (D)
mouseDownTimer // (E)
= {};
const excute = async () => {
	//console.log("do excute");
	authorName = $("span:contains('作者')").first().text().trim().split(' ')[2]; // (D)
	board = $("span:contains('看板')").first().text().trim().split(" ").pop(); // (D)
	const css = (elements, styles) => {
		elements = elements.length ? elements : [elements];
		elements.forEach(element => {
			for (var property in styles) {
				element.style[property] = styles[property];
			}
		});
	}
	const findAll = (elements, selectors) => {
		let rtnElements = [];
		elements = elements.length ? elements : [elements];
		elements.forEach(element => rtnElements.push.apply(rtnElements, element.querySelectorAll(selectors)));
		return rtnElements;
	}
	const innerHTMLAll = (elements) => {
		let rtn = "";
		elements = elements.length ? elements : [elements];
		elements.forEach(element => {element.innerHTML ? rtn += element.innerHTML : ""});
		return rtn;
	}
	const show = (elements, specifiedDisplay = 'block') => {
		elements = elements.length ? elements : [elements];
		elements.forEach(element => {
			if (!element.style) return;
			element.style.display = specifiedDisplay;
		});
	}
	const hide = (elements) => {
		elements = elements.length ? elements : [elements];
		elements.forEach(element => {
			if (!element.style) return;
			element.style.display = 'none';
		});
	}
	const generateImageHTML = (ip, flag) => {
		if (!flag) return;
		flag.countryCode = flag.countryCode ? flag.countryCode : "unknown";
		const ignoreCountrys = gmc.get('whenShowFlagsIgnoreSpecificCountrys').match(new RegExp(flag.countryCode, 'i'));
		if (ignoreCountrys && ignoreCountrys.length > 0) return;
		const imageTitile = `${flag.locationName || 'N/A'}<br><a href='https://www.google.com/search?q=${ip}' target='_blank'>${ip}</a>`;

		return `<div data-flag title="${imageTitile}" class="flag-${flag.countryCode}" style="background-repeat:no-repeat;background-position:left;float:right;height:0.8em;width:0.8em;cursor:pointer !important;"></div>`;
	}
	const chkBlackSpan = (isListPage) => {
		if (isTerm && isListPage) {
			let allNode = document.querySelectorAll('span[data-type="bbsline"]');
			if (allNode && allNode.length > 0) {
				allNode = [].filter.call(allNode, (element, index) => {
					if (element.dataset.type === 'bbsline') { //for term.ptt.cc
						let user = element.querySelectorAll('span[class^="q7"]')
						if (user && user.length > 1 && user[1].innerHTML.length > 10) {
							user = user[1].innerHTML.replace(/ +/g, ' ').split(' ');
							user = user && user.length > 3 ? user[1].toLowerCase() : "";
							user && user.match(/^[^\d][^ ]+$/) ? element.classList.add(`blu_${user}`) : null;
						}
						user = element.querySelector('span[class^="q15"]')
						if (user && user.innerHTML.trim().match(/^[^\d][^ ]+$/)) {
							user = user ? user.innerText.trim().toLowerCase() : "";
							user ? element.classList.add(`blu_${user}`) : null;
						}
					}
				});
			}
		}
		let blackSpan = document.querySelectorAll('span[style="opacity:0.2"]');
		let whenHideAllShowInfoCss = document.querySelector('#whenHideAllShowInfo');
		if (blackSpan.length > 0) {
			writeDebugLog(`黑名單筆數：${blackSpan.length}`);
			if (whenHideAllShowInfoCss) whenHideAllShowInfoCss.remove();
			gmc.get('isHideViewImg') && hide(findAll(blackSpan, 'img:not([style*="display: none"])'));
			gmc.get('isHideViewVideo') && hide(findAll(blackSpan, '.easyReadingVideo:not([style*="display: none"])'));
			if (gmc.get('isHideAll')) {
				if (gmc.get('whenHideAllShowInfo').length > 0 || isListPage) {
					addCssLink('whenHideAllShowInfo', `
span[type="bbsrow"][style="opacity:0.2"] {opacity:1 !important;visibility: hidden;}
span[type="bbsrow"][style="opacity:0.2"]:before {
visibility: visible;color: ${gmc.get('whenHideAllShowInfoColor')};
content: '                 -            ${gmc.get('whenHideAllShowInfo')}';
}`);
				} else {
					hide(blackSpan);
				}
			} else {
				!isListPage && gmc.get('isReduceHeight') && css(blackSpan, {
					'height': gmc.get('reduceHeight') + 'em',
					'font-size': (gmc.get('reduceHeight')/2) + 'em',
					'line-height': gmc.get('reduceHeight') + 'em'
				});
				gmc.get('isReduceOpacity') && css(blackSpan, {'opacity': gmc.get('reduceOpacity')});
			}
		}
	}
	const findPrevious = (element, selectors) => {
		if (!element) return;
		if (element.dataset.type === 'bbsline') { //for term.ptt.cc
			element = element.closest('span[type="bbsrow"]');
			element = element.parentElement;
		}
		element = element.previousElementSibling;
		if (!element) return;
		let rtnElement = element.querySelectorAll(selectors)
		if (rtnElement && rtnElement.length > 0) {
			return rtnElement;
		} else {
			return findPrevious(element, selectors);
		}
	}
	const firstEl = (element) => {
		if (!element) return;
		if (element.dataset.type === 'bbsline') { //for term.ptt.cc
			element = element.closest('span[type="bbsrow"]');
			element = element.parentElement;
		}
		element = element.nextElementSibling;
		if (!element) return;
		let e = element.querySelector('span[data-type="bbsline"]');
		let user = e ? e.querySelector('span[class^="q11"]') : null;
		let name = user ? user.innerHTML.match(/^([^ ]+)[ ]*$/) : null;
		if (name && name.length > 0) { //for term.ptt.cc
			return e;
		} else if (element.classList.toString().match(/blu_[^ ]+/)) {
			return element;
		} else {
			return firstEl(element);
		}
	}
	const queryPage = (node) => {
		let rtnPage;
		if (node && node.length > 0) {
			rtnPage = node[node.length -1].querySelector('span');
			if (!rtnPage) return;
			rtnPage = rtnPage.innerText.match(/瀏覽[^\d]+(\d+)\/(\d+)/);
			if (rtnPage && rtnPage.length === 3) {
				rtnPage = rtnPage[1];
				writeDebugLog(`警告：未啟用文章好讀模式，結果會不正確`);
				return rtnPage;
			}
		}
	}
	const currentTS = Math.floor(Date.now() / 1000);

	if ((currentTS - timestamp) > 2) {
		stopInterval();
	}

	//const checkNode = document.querySelector('span.q2');
	const checkNodes = document.querySelectorAll('span.q2');
	let allShort = true;
	for (let i in checkNodes) {
		if (checkNodes[i].innerHTML.length > 10) {
			allShort = false;
			break;
		}
	}
	// if (!checkNode || (checkNode && checkNode.innerHTML.length <= 10)) {
	if (!checkNodes || (checkNodes && allShort)) {
		chkBlackSpan(true);
		return;
		/* I don't know whether this return statement is related to the blacklist or not... */
	} else {
		chkBlackSpan();
	}

	let firstNode, isHasFirst, allNode = document.querySelectorAll('span[type="bbsrow"]'), bbsline = document.querySelectorAll('span[data-type="bbsline"]');
	bbsline && bbsline.length > 0 ? allNode = bbsline : null;

	currentPage = queryPage(allNode);

	let count = {author:0, comment:0, authorCnt:0, commentCnt:0, authorIp:0, commentIp:0, completed: 0};
	allNode = [].filter.call(allNode, (element, index) => {
		if (element.dataset.type === 'bbsline') { //for term.ptt.cc
			let user = element.querySelector('span[class^="q11"]'); //ex.1.<span class="q11 b0">USERNAME</span> 2.<span class="q11 b0">USERNAME   </span>
			if (user && user.previousSibling && (user.previousSibling.innerHTML=='推 '||user.previousSibling.innerHTML=='噓 '||user.previousSibling.innerHTML=='→ ')) {
				let name = user ? user.innerHTML.match(/^([^ ]+)[ ]*$/) : "";
				name && name.length > 0 ? element.classList.add(`blu_${name[1]}`) : null;
			}
		}
		let node = element.innerHTML.match('※ 文章網址:');
		node = node && node.length > 0 ? node : element.innerHTML.match('※ 發信站:'); // (A)(B)
		if (node && node.length > 0) {
			isHasFirst = true;
			firstNode = firstEl(element);
			if (firstNode && !firstNode.innerHTML.match(/data-floor/)) {
				pageData = [];
				currentNum = -1;
				currentPush = 0; // (A)
				currentShu = 0; // (A)
				currentArrow = 0; // (A)
			}
		}
		if (innerHTMLAll(findAll(element, "span.q2")).match(ipValidation)) {
			count.author++;
			return true;
		}
		if (element.classList && element.classList.toString().match(/blu_[^ ]+/)) {
			count.comment++;
			return true;
		}
	});
	writeDebugLog(`偵測 作者筆數：${count.author}、留言筆數：${count.comment}`);
	let allIpList = allNode.map(c => {
		const ip = c.innerHTML.match(ipValidation);
		if (ip && !flagMap[ip[0]]) return ip[0];
	});
	allIpList = new Set(allIpList);
	allIpList.delete(undefined);
	allIpList.delete(null);
	allIpList = Array.from(allIpList);
	if (allIpList && allIpList.length > 0 && allIpList[0]) {
		try {
			const flagsResponse = await axios.post(`${HOST}/ip`, { ip: allIpList}, {headers: {'Content-Type': 'application/json',}}),
				  flags = flagsResponse.data;
			if (flags && flags.length > 0) {
				flags.forEach((flag, index) => {
					const ip = allIpList[index];
					if (!flag) {
						flag = [];
					} else if (flag.imagePath) {
						flag.countryCode = flag.imagePath.toLowerCase().replace('assets/','').replace('.png','');;
					}
					flag.ip = ip;
					flagMap[ip] = flag;
				});
			}
		} catch (ex) {
			writeDebugLog(`查詢IP失敗...${ex}`);
			console.log(ex);
		}
	}

	allNode.some((comment, index) => {
		const test = comment.innerHTML.match(/^[ \t]*\d+/);
		if (test && test.length > 0) return true;

		if (gmc.get('isAddFloorNum') && comment.classList && comment.classList.toString().match(/blu_[^ ]+/) && !comment.innerHTML.match(/data-floor/)) {
			let upstairs = null;
			if (currentNum > 0) {
				upstairs = findPrevious(allNode[index], 'div[data-floor]');
				if (upstairs && upstairs.length > 0) {
					let upstairsNum = Number(upstairs[0].innerHTML);
					if (upstairsNum) {
						currentNum = Number(upstairs[0].innerHTML) + 1;
						/***************** (A)(B) Floor Counting and Author's Highlighting *****************/
						let pushNode = upstairs[0].nextSibling;
						if (isTerm) pushNode = pushNode.firstChild; // format modification for term.ptt.cc
						performFloorCountingAndAuthorHighlighting (pushNode, false);

						// deal with the currently last floor
						if (isTerm) pushNode = pushNode.parentElement.parentElement.parentElement.parentElement; // format modification for term.ptt.cc
						let lastNode = fromPushNodeToLastNode (pushNode);
						if (lastNode) {
							pushNode = lastNode.firstChild;
							if (isTerm) pushNode = pushNode.firstChild.firstChild.firstChild.firstChild; // format modification for term.ptt.cc
							performFloorCountingAndAuthorHighlighting (pushNode, true);
						}
						/***********************************************************************************/
					}
				} else if (currentPage) { //非好讀模式才有頁數
					if (!pageData[currentPage]) pageData[currentPage] = currentNum;
					currentNum = pageData[currentPage];
				} else {
					currentNum = 1;
				}
			} else if (isHasFirst && comment === firstNode) {
				currentNum = 1;
				/***************** (A)(B) Floor Counting and Author's Highlighting *****************/
				let pushNode = comment.firstChild;
				if (isTerm) pushNode = pushNode.firstChild; // format modification for term.ptt.cc
				performFloorCountingAndAuthorHighlighting (pushNode, true);
				/***********************************************************************************/
			} else if (!isHasFirst) {
				currentNum = 1;
			}
			if (currentNum > 0) {
				count.commentCnt++
				const divCnt = `<div data-floor style="float:left;margin-left: 2.2%;height: 0em;width: 1.5em;font-size: 0.4em;font-weight:bold;text-align: right;">${currentNum}</div>`;
				comment.innerHTML = divCnt + comment.innerHTML.trim();
			} else {
				const divCnt = `<div data-floor></div>`;
				comment.innerHTML = divCnt + comment.innerHTML.trim();
			}
		} else if ((gmc.get('isAddFloorNum') && comment.classList && !comment.querySelector('.q2') && !comment.classList.toString().match(/blu_[^ ]+/))) {
			writeDebugLog(`警告 推文資料格式錯誤：${comment.innerHTML}`);
		} else if (comment.innerHTML.match(/data-floor/)) {
			count.completed++;
		}

		if (!gmc.get('isShowFlags')) return;

		const ip = comment.innerHTML.match(ipValidation);

		if (!ip) return;
		if (comment.innerHTML.match(/data-flag/)) return;
		const imageHTML = generateImageHTML(ip[0], flagMap[ip[0]]);
		if (!imageHTML) return;

		const authorNode = comment.querySelector("span.q2");
		if (authorNode) {
			count.authorIp++;
			authorNode.innerHTML = imageHTML + authorNode.innerHTML.trim()
		} else {
			count.commentIp++;
			comment.innerHTML = imageHTML + comment.innerHTML.trim();
		}
		timestamp = Math.floor(Date.now() / 1000);
	});

	if (count.comment !== count.completed) {
		writeDebugLog(`寫入 作者IP數：${count.authorIp}、留言樓層：${count.commentCnt}、留言IP數：${count.commentIp}`);
	}

	tippy('[data-flag]', {
		arrow: true,
		size: 'large',
		placement: 'left',
		interactive: true
	});
}
const chkBeforeunloadEvents = () => {
	if (gmc.get('isDisableClosePrompt')) {
		window.addEventListener("beforeunload", function f() {
			window.removeEventListener("beforeunload", f, true);
		}, true);
		unsafeWindow.addEventListener("beforeunload", function beforeunload() {
			unsafeWindow.removeEventListener("beforeunload", beforeunload, true);
		}, true);
 		if (window.getEventListeners) {
			window.getEventListeners(window).beforeunload.forEach((e) => {
				window.removeEventListener('beforeunload', e.listener, true);
			})
		} else if (unsafeWindow.getEventListeners) {
			unsafeWindow.getEventListeners(unsafeWindow).beforeunload.forEach((e) => {
				unsafeWindow.removeEventListener('beforeunload', e.listener, true);
			})
		} else {
			setTimeout(chkBeforeunloadEvents, 2000);
		}
	}
}

const CreateMutationObserver = () => {
	const container = document.querySelector('#mainContainer');
	if (!container) {
		setTimeout(CreateMutationObserver, 2000);
		return;
	}

	if (isTerm) {
		autoLogin(container);
		const reactAlert = document.querySelector('#reactAlert');
		const observerTerm = new MutationObserver(mutations => {
			mutations.forEach(mutation => {
				if (reactAlert.querySelector('p button')) {
					reactAlert.querySelector('p button').addEventListener("click", function(event) {
						autoLogin(container);
					});
				}
			});
		})
		observerTerm.observe(reactAlert, {childList: true,});
	}
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => execInterval());
	})
	observer.observe(container, {childList: true,});

	//chkBeforeunloadEvents();
}

const writeDebugLog = (log) => {
	if (gmc.get('isShowDebug')) {
		queryConfigEl('#PttChromeAddOnConfigDebug', 'textarea', el => {
			el.value = `${log}\n` + el.value;
		});
	}
}
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
const autoLogin = async (container) => {
	const checkAndWait = async (container, keyword) => {
		if (container && container.innerText.match(keyword)) {
			await sleep(1000);
			return checkAndWait(container, keyword);
		}
	}
	const pasteInputArea = async (str) => {
		let inputArea = document.querySelector('#t');
		if (!inputArea) {
			await sleep(1000);
			return pasteInputArea(str);
		}

		const pasteE = new CustomEvent('paste');
		pasteE.clipboardData = { getData: () => str };
		inputArea.dispatchEvent(pasteE);
	}
	const autoSkip = async (node, regexp, pasteKey, isReCheck) => {
		if (node.innerText.match(regexp)) {
			await pasteInputArea(pasteKey);
			await checkAndWait(node, regexp);
		} else if (isReCheck) {
			await sleep(1000);
			return autoSkip(node, regexp, pasteKey, isReCheck)
		}
	}
	if (gmc.get('isAutoLogin')) {
		if (container.innerText.trim().length < 10) {
			await sleep(1000);
			return autoLogin(container);
		}
		const list = [];
		if (gmc.get('autoUser') && gmc.get('autoPassWord')) {
			list.push({regexp: /請輸入代號，或以/, pasteKey: `${gmc.get('autoUser')}\n${gmc.get('autoPassWord')}\n`, isReCheck: true});
		}

		if (gmc.get('isEnableDeleteDupLogin') !== "N/A") {
			list.push({regexp: /您有其它連線已登入此帳號/, pasteKey: `${gmc.get('isEnableDeleteDupLogin')}\n`, isReCheck: true});
		}

		if (gmc.get('isAutoSkipInfo1')) {
			list.push(
				{regexp: /正在更新與同步線上使用者及好友名單，系統負荷量大時會需時較久.../, pasteKey: '\n'},
				{regexp: /歡迎您再度拜訪，上次您是從/, pasteKey: '\n'},
				{regexp: /─+名次─+範本─+次數/, pasteKey: 'q'},
				{regexp: /發表次數排行榜/, pasteKey: 'q'},
				{regexp: /大富翁 排行榜/, pasteKey: 'q'},
				{regexp: /本日十大熱門話題/, pasteKey: 'q'},
				{regexp: /本週五十大熱門話題/, pasteKey: 'q'},
				{regexp: /每小時上站人次統計/, pasteKey: 'qq'},
				{regexp: /程式開始啟用/, pasteKey: 'q'},
				{regexp: /排名 +看 *板 +目錄數/, pasteKey: 'q'},
			);

		}
		if (gmc.get('isAutoToFavorite')) {
			list.push({regexp: /【主功能表】 +批踢踢實業坊/, pasteKey: `f\n`, isReCheck: true});
		}
		let isMatch = false;
		for (let idx=0;idx < list.length; idx++) {
			if (container.innerText.match(list[idx].regexp)) {
				isMatch = true;
				await autoSkip(container, list[idx].regexp, list[idx].pasteKey, list[idx].isReCheck);
			}
			if (idx == list.length-1 && !isMatch) {
				idx = 0;
				await sleep(1000);
			}
		}
	}
}

try {
	window.addEventListener("load", function(event) {
		CreateMutationObserver();
	});
} catch (ex) {
	writeDebugLog(`出現錯誤...${ex}`);
	console.error(ex);
}

const _button = document.createElement("div");
_button.innerHTML = 'Settings';
_button.onclick = event => {
	event.preventDefault();
	event.stopPropagation();
	if (!configStatus) {
		configStatus = true;
		if (gmc) gmc.open();
		if (gmc.get('isShowDebug') && gmcDebug) gmcDebug.open();
	} else if (configStatus) {
		configStatus = false;
		if (gmc.isOpen) gmc.close();
		if (gmcDebug.isOpen) gmcDebug.close();
		if (gmcBlack.isOpen) gmcBlack.close();
	}
}
_button.style = "border: 1px solid #AAA;color: #999;background-color: #111;position: fixed; top: 0.5em; right: 0.5em; z-index: 900;cursor:pointer !important;"

document.body.appendChild(_button)

const el = document.createElement('link');
el.rel = 'stylesheet';
el.type = 'text/css';
el.href = "https://cdnjs.cloudflare.com/ajax/libs/tippy.js/2.5.4/tippy.css";
document.head.appendChild(el);

/***************** (A)(B) Floor Counting and Author's Highlighting *****************/
document.addEventListener("mouseover", function(event) {
	exchangePusherLabel (event.target);
});
document.addEventListener("mouseout", function(event) {
	exchangePusherLabel (event.target);
});
function exchangePusherLabel (pushNode) {
	if ((isTerm && pushNode.parentNode && pushNode.parentNode.previousSibling && pushNode.parentNode.previousSibling.hasAttribute('data-floor') && pushNode.parentNode.firstChild===pushNode
		|| !isTerm && pushNode.previousSibling && pushNode.previousSibling.hasAttribute('data-floor'))
		&& pushNode.dataset.label) {
		let temp = pushNode.innerHTML;
		pushNode.innerHTML = pushNode.dataset.label;
		pushNode.dataset.label = temp;
	}
}
function fromPushNodeToLastNode (pushNode) {
	let lastNode = null;
	let traversalNode = pushNode.parentElement.nextSibling;
	while (traversalNode) {
		if (isTerm && traversalNode.firstChild.firstChild.firstChild.className.startsWith('blu_') || !isTerm && traversalNode.className.startsWith('blu_')) {
			if (lastNode) {
				lastNode = null;
				break;
			}
			else
				lastNode = traversalNode;
		}
		traversalNode = traversalNode.nextSibling;
	}
	return lastNode;
}
function performFloorCountingAndAuthorHighlighting (pushNode, special) {
	// if (special) currentNum++;
	if (pushNode.innerHTML == '推 ') {
		currentPush++;
		pushNode.dataset.label = `${String(currentPush).padStart(2,0)} 推 `;
		if (special) currentPush--;
	} else if (pushNode.innerHTML == '噓 ') {
		currentShu++;
		pushNode.dataset.label = `${String(currentShu).padStart(2,0)} 噓 `;
		if (special) currentShu--;
	} else if (pushNode.innerHTML == '→ ') {
		currentArrow++;
		pushNode.dataset.label = `${String(currentArrow).padStart(2,0)} → `;
		if (special) currentArrow--;
	} // Otherwise it is not a pushing floor and no label is produced.
	// if (special) currentNum--;
	if (pushNode.nextSibling.innerHTML.trim() == authorName) // author's highlighting
		pushNode.nextSibling.style.backgroundColor = "blue";
}
/***********************************************************************************/

document.addEventListener("mousedown", function(event) {
	if (isInPost()) { // (C) restrict the event listeners to work only in posts
		// (E) Start the timer for the mouse browsing-friendly mode.
		mouseDownTimer = new Date();

		// (C) Mouse click may have been disabled due to stop propagation from mouse browsing.
		// So we must close the menu manually in the onclick event before.
		// After that, the menu still must be re-shown if the user right click on the screen.
		if (event.which == 3) {
			if (isTerm) {
				document.getElementsByClassName("dropdown-menu DropdownMenu--reset")[0].style.top = event.clientY.toString() + 'px'; // for firefox's lag response
				document.getElementsByClassName("dropdown-menu DropdownMenu--reset")[0].style.left = event.clientX.toString() + 'px'; // for firefox's lag response
				document.getElementsByClassName("dropdown-menu DropdownMenu--reset")[0].parentNode.parentNode.style.display = '';
			} else
				document.getElementsByClassName("dropdown-menu")[0].style.display = 'block';
		}
	}
});
document.addEventListener("click", function(event) {
	if (isInPost() && event.which==1) { // (C) restrict the event listeners to work only in posts
		// please note we must specify only left click due to Firefox's special mechanism
		let someMechanismInvoked = false; // define variable

		// (E) Compute how long the mouse is clicked for the mouse browsing-friendly mode.
		mouseDownTimer = new Date() - mouseDownTimer;

		/******************************* (D) Dropdown Menu *******************************/
		let hasMenuBefore = false;
		let correctElementToEnableMenu = isPusherId(event.target) || event.target.previousSibling.innerHTML==' 作者 ';
		let isClickingMenu = event.target.parentNode.id == 'dropdownMenu';
		if (correctElementToEnableMenu) {
			hasMenuBefore = event.target.parentNode.lastChild.id == 'dropdownMenu';
			someMechanismInvoked = hasMenuBefore;
		}
		if (!isClickingMenu) {
			let dropdownMenu = document.getElementById("dropdownMenu");
			if (dropdownMenu) {
				dropdownMenu.parentNode.removeChild(dropdownMenu);
				// someMechanismInvoked = true;
			}
		}
		if (correctElementToEnableMenu) {
			if (!hasMenuBefore) {
				someMechanismInvoked = true;
				if (!gmc.get('isMouseBrowsingFriendly')) // (E)
					openDropdownMenuFromGivenElement(event.target);
				else if (mouseDownTimer > 150) // (E)
					openDropdownMenuFromGivenElement(event.target);
			}
		}
		/*********************************************************************************/

		/******************************* (C) Pusher Highlighting *******************************/
		let hasHighlightBefore = false;
		if ((!gmc.get('isMouseBrowsingFriendly') && find_blu_className(event.target) && !isPusherId(event.target)
			|| gmc.get('isMouseBrowsingFriendly') && isPusherId(event.target)) // (E)
			&& find_bbsrow_root(event.target).style.backgroundColor == "navy") {
				hasHighlightBefore = true;
				someMechanismInvoked = true;
			}
		if (currentPusher) {
			// someMechanismInvoked = true;
			let x = document.getElementsByClassName(currentPusher);
			for (let i = 0; i < x.length; i++)
				find_bbsrow_root(x[i]).style.backgroundColor = "black";
			currentPusher = null;
		}
		if ((!gmc.get('isMouseBrowsingFriendly') && find_blu_className(event.target) && !isPusherId(event.target) && !isClickingMenu
			|| gmc.get('isMouseBrowsingFriendly') && isPusherId(event.target) && mouseDownTimer<=150) // (E)
			&& !hasHighlightBefore) {
				someMechanismInvoked = true;
				highlightAllFloorsFromGivenElement(event.target);
			}
		/***************************************************************************************/

		// (C) If there is some mechanism invoked, temporarily disable the mouse browsing first.
		if (someMechanismInvoked)
			event.stopPropagation();
		
		// (C) we must enforce the menu to be closed due to our stopPropagation().
		if (isTerm)
			document.getElementsByClassName("dropdown-menu DropdownMenu--reset")[0].parentNode.parentNode.style.display = 'none';
		else
			document.getElementsByClassName("dropdown-menu")[0].style.display = 'none';
	}
}, true); // (C) Because this is the global listener, we must set the mode to "true" (capture mode).
// Otherwise the "stop propagation" will occur "after" the click detected by BBSWindow and therefore is useless.

function isInPost() { // (C) just a helper to check if a user is reading articles
	if (isTerm) {
		return document.getElementById('mainContainer').children[0].firstChild.firstChild.firstChild.firstChild.firstChild.innerHTML==' 作者 '
			&& document.getElementById('mainContainer').children[1].firstChild.firstChild.firstChild.firstChild.firstChild.innerHTML==' 標題 '
			&& document.getElementById('mainContainer').children[2].firstChild.firstChild.firstChild.firstChild.firstChild.innerHTML==' 時間 ';
	} else {
		return document.getElementById('mainContainer').children[0].firstChild.innerHTML==' 作者 '
		&& document.getElementById('mainContainer').children[1].firstChild.innerHTML==' 標題 '
		&& document.getElementById('mainContainer').children[2].firstChild.innerHTML==' 時間 ';
	}
}

/******************************* (C) Pusher Highlighting *******************************/
function highlightAllFloorsFromGivenElement(element) {
	let x = document.getElementsByClassName(find_blu_className(element));
	for (let i = 0; i < x.length; i++)
		find_bbsrow_root(x[i]).style.backgroundColor = "navy";
	currentPusher = find_blu_className(element);
}
/***************************************************************************************/

/******************************* (D) Dropdown Menu *******************************/
function openDropdownMenuFromGivenElement(element) {
	let pusherName = element.innerHTML.trim().split(" ", 1);
	let tmp = document.createElement("div");
	tmp.id = "dropdownMenu";
	tmp.className = "dropdown-content";
		let tmp1 = document.createElement("a");
		tmp1.id = "dropdownMenu1";
		tmp1.target =  "_blank";
		tmp1.href = "https://www.ptt.cc/bbs/" + board + "/search?q=author:" + pusherName;
		tmp1.innerHTML = "Search 此板 " + pusherName + " 的文章";
		let tmp2 = document.createElement("a");
		tmp2.id = "dropdownMenu2";
		tmp2.target =  "_blank";
		tmp2.href = "https://www.ptt.cc/bbs/ALLPOST/search?q=author:" + pusherName;
		tmp2.innerHTML = "Search ALLPOST 板 " + pusherName + " 的文章";
		let tmp3 = document.createElement("a");
		tmp3.id = "dropdownMenu3";
		tmp3.target =  "_blank";
		tmp3.href = "https://www.google.com/search?q=site%3Aptt.cc%20" + pusherName;
		tmp3.innerHTML = "Google PTT " + pusherName;
		let tmp4 = document.createElement("a");
		tmp4.id = "dropdownMenu4";
		tmp4.target =  "_blank";
		tmp4.href = "https://www.google.com/search?q=" + pusherName;
		tmp4.innerHTML = "Google " + pusherName;
	tmp.appendChild(tmp1);
	tmp.appendChild(document.createElement("br"));
	tmp.appendChild(tmp2);
	tmp.appendChild(document.createElement("br"));
	tmp.appendChild(tmp3);
	tmp.appendChild(document.createElement("br"));
	tmp.appendChild(tmp4);
	element.parentNode.appendChild(tmp);
	// console.log(floorNode.getBoundingClientRect().bottom);
	// console.log(tmp.getBoundingClientRect().height);
	// console.log(document.getElementById("mainContainer").parentNode.getBoundingClientRect().bottom);
	// console.log(tmp1.getBoundingClientRect().height);
	if (isTerm) {
		let floorNode = element;
		if (floorNode.getBoundingClientRect().bottom + tmp.getBoundingClientRect().height > document.getElementById("mainContainer").parentNode.getBoundingClientRect().bottom - tmp1.getBoundingClientRect().height)
			document.getElementById("mainContainer").parentNode.scrollTop += floorNode.getBoundingClientRect().bottom + tmp.getBoundingClientRect().height + tmp1.getBoundingClientRect().height - document.getElementById("mainContainer").parentNode.getBoundingClientRect().bottom; // manually scroll down because in the last floor case the webpage doesn't do so.
	} else {
		let floorNode = element.parentNode;
		if (floorNode.getBoundingClientRect().bottom + tmp.getBoundingClientRect().height > document.getElementById("mainContainer").parentNode.getBoundingClientRect().bottom + 3 * tmp1.getBoundingClientRect().height)
			document.getElementById("mainContainer").parentNode.scrollTop += floorNode.getBoundingClientRect().bottom + tmp.getBoundingClientRect().height - 3 * tmp1.getBoundingClientRect().height - document.getElementById("mainContainer").parentNode.getBoundingClientRect().bottom; // manually scroll down because in the last floor case the webpage doesn't do so.
	}
}
/*********************************************************************************/

function find_blu_className (element) { // (C) for showing which pusher's floor is highlighted
	while(element && !(element.className&&element.className.startsWith('blu_')))
		element = element.parentNode;
	return element ? element.className : null;
}

function find_bbsrow_root (element) { // (C) find the element used for highlighting all the same pushers
	while(element && !(element.getAttribute('type')=='bbsrow'&&element.parentNode&&element.parentNode.id=='mainContainer'))
		element = element.parentNode;
	return element;
}

function isPusherId (element) { // (C)(D) to check if a user clicks the user id
	return find_blu_className(element) && element.className.startsWith("q11 b");
}