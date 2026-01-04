// ==UserScript==
// @name         Bahamut webBBS Add-on
// @namespace    https://greasyfork.org/zh-TW/scripts/393447
// @supportURL   https://github.com/plko/Bahamut-webBBS-Add-on
// @description  巴哈姆特webBBS版用的黑名單插件，修改自PttChrome-and-term.ptt.cc-Enhanced-Add-on
// @version      0.9b
// @license      MIT
// @author       plko
// @compatible   firefox
// @compatible   chrome (or chromium-based)
// @include      https://term.gamer.com.tw/
// @require      https://cdnjs.cloudflare.com/ajax/libs/axios/0.18.0/axios.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @require      https://greasyfork.org/scripts/372760-gm-config-lz-string/code/GM_config_lz-string.js?version=634230
// @require      https://greasyfork.org/scripts/372675-flags-css/code/Flags-CSS.js?version=632757
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/393447/Bahamut%20webBBS%20Add-on.user.js
// @updateURL https://update.greasyfork.org/scripts/393447/Bahamut%20webBBS%20Add-on.meta.js
// ==/UserScript==
"use strict";
//===================================
const isTerm = window.location.href.match(/term.gamer.com.tw/);
const isBaha = window.location.href.match(/term.gamer.com.tw/);
let configStatus = false, configBlackStatus = false;
let fields = { // Fields object
	/*'isAddFloorNum': {
		'label': '是否顯示推文樓層', // Appears next to field
		'type': 'checkbox', // Makes this setting a checkbox input
		'default': true // Default value if user doesn't change it
	},*/
	/*'isMouseBrowsingFriendly': { // (E) mouse browsing-friendly mode
		'label': '是否啟用滑鼠瀏覽友善模式', // Appears next to field
		'type': 'checkbox', // Makes this setting a checkbox input
		'default': false // Default value if user doesn't change it
	},*/
	/*'isShowDebug': {
		'label': '是否顯示DeBug紀錄', // Appears next to field
		'type': 'checkbox', // Makes this setting a checkbox input
		'default': false // Default value if user doesn't change it
	},*/
};
if (isTerm || isBaha) {
	fields = Object.assign({
        'intervalTime': {
            'label': '延遲時間(之類的)',
            'type': 'int',
            'min': 1,
            'max': 9999,
            'size': 5,
            'default': 100
        },
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
		/*'isAutoSkipInfo1': {
			'label': '是否自動跳過登入後歡迎畫面', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},
		'isAutoToFavorite': {
			'label': '是否自動進入 Favorite 我的最愛', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': false // Default value if user doesn't change it
		},*/
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
        'isAutoQuitBlackArticle':{
            'label': '黑名單自動離開文章',
            'type': 'checkbox',
            'default': false
        },
        'blackAlpha':{
            'label': '黑名單透明度(0~1)',
            'type': 'unsigned float',
            'min': 0,
            'max': 1,
            'size': 5,
            'default': 0.1
        },
		/*'isHideViewImg': {
			'label': '是否隱藏黑名單圖片預覽', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},
		'isHideViewVideo': {
			'label': '是否隱藏黑名單影片預覽', // Appears next to field
			'type': 'checkbox', // Makes this setting a checkbox input
			'default': true // Default value if user doesn't change it
		},*/
	}, fields);
}
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
	'id': 'BahamutAddOnConfig', // The id used for this instance of GM_config
	'title': 'Bahamut webBBS Add-on Settings', // Panel Title
	'fields': fields,
	'events': { // Callback functions object
		'open': function() {
			this.frame.setAttribute('style', "border: 1px solid #AAA;color: #999;background-color: #111; width: 23em; height: 35em; position: fixed; top: 2.5em; right: 0.5em; z-index: 900;");

			configStatus = true;
		},
		'close': () => { configStatus = false;},

        'save': function() {
			addBlackStyle(gmcBlack.get('blackList'));
		},
	},
	'css': `#BahamutAddOnConfig * { color: #999 !important;background-color: #111 !important; } body#BahamutAddOnConfig { background-color: #111}`,
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
	//addCssLink('opacityStyle', `${opacityStyle} {opacity: 0.1;}`);
    addCssLink('opacityStyle', `${opacityStyle} {opacity: ${gmc.get('blackAlpha')};}`);
/*
	if (gmc.get('isHideViewImg')) {
		let imgStyle = blackList.replace(/([^\n]+)/g, '.blu_$1 + div > .easyReadingImg').replace(/\n/g, ',');
		addCssLink('imgStyle', `${imgStyle} {display: none;}`);
	}
	if (gmc.get('isHideViewVideo')) {
		let videoStyle = blackList.replace(/([^\n]+)/g, '.blu_$1 + div > .easyReadingVideo').replace(/\n/g, ',');
		addCssLink('videoStyle', `${videoStyle} {display: none;}`);
	}*/
}
const gmcBlack = new ConfigLzString({
	'id': 'BahamutAddOnConfigBlack', // The id used for this instance of GM_config
	'title': 'Bahamut webBBS Add-on Black List', // Panel Title
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
	'css': `#BahamutAddOnConfigBlack * { color: #999 !important;background-color: #111 !important; } body#BahamutAddOnConfigBlack { background-color: #111} #BahamutAddOnConfigBlack_field_blackList { width:26em; height: 24em;}`
});

const ipValidation = /(\d{1,3}\.){3}\d{1,3}/,timerArray = [];

const sendInput = async (str) => {
    let inputArea = document.querySelector('#t');
    if (!inputArea) {
        await sleep(1000);
        return sendInput(str);
    }

    const pasteE = new CustomEvent('paste');
    pasteE.clipboardData = { getData: () => str };
    inputArea.dispatchEvent(pasteE);
    //console.log(str);
}

let timestamp = Math.floor(Date.now() / 1000);
const execInterval = () => {
	if (timerArray.length === 0) {
		//timerArray.push(setInterval(excute, 100));
        timerArray.push(setInterval(excute,gmc.get('intervalTime')))
	}
}
const stopInterval = () => {
	while (timerArray.length > 0) {
		clearInterval(timerArray .shift());
	}
}

const BBSTATE_OTHER = 0;
const BBSTATE_INBOARD = 1;
const BBSTATE_INREADING = 2;
const BBSTATE_PREVLOGIN = 3;
let lastBBSState = BBSTATE_PREVLOGIN;
let allQuoAuthor = [];
let newAuthor = '';
let autoLoginStep = 0;

const excute = async () => {
	//console.log("do excute");
    // NOTE: check now type. (in board || read article
    let isBoard = $("span:contains('  編號    日 期 作  者       文  章  標  題                                  ')").length != 0 ||
        $("span:contains('  編號   日 期  作  者       文  章  標  題                                   ')").length != 0;

    let isReading = $("span:contains('(PgUp)(PgDn)(0)($)移動 (/n)搜尋 (C)暫存 ←(q)結束')").length != 0 ||
        $("span:contains(' 文章選讀  (g)寫得好! ')").length != 0;;

    let allBBSLine = document.querySelectorAll('span[data-type="bbsline"]')

    // clear all remove last time data first.
    if (allBBSLine && allBBSLine.length > 0) {
        allBBSLine.forEach(element => {
            if (element.dataset.type === 'bbsline') {
                element.classList = "";
            }
        });
    }

    // auto login process.
    if (lastBBSState == BBSTATE_PREVLOGIN){
        if (gmc.get('isAutoLogin')){

            // Check step.
            if (autoLoginStep == 0){
                if($("span:contains('請輸入勇者代號：')").length != 0){
                    sendInput(`${gmc.get('autoUser')}\n${gmc.get('autoPassWord')}\n`);
                    autoLoginStep = 1;
                }
            }else if (autoLoginStep == 1){
                if (gmc.get('isEnableDeleteDupLogin') !== "N/A") {
                    if($("span:contains('您想刪除其他重複的 login')").length != 0){
                        sendInput(`${gmc.get('isEnableDeleteDupLogin')}\n`);
                        autoLoginStep = 2;
                    }
                }else{
                    autoLoginStep = 2;
                }
            }else{
                lastBBSState = BBSTATE_OTHER;
            }

        }else{
            lastBBSState = BBSTATE_OTHER;
        }
        const currentTS = Math.floor(Date.now() / 1000);

        if ((currentTS - timestamp) > 2) {
            stopInterval();
        }
        return;
    }

    if (isBoard){
        //console.log("in list")
        // find author.
        // Add class 'blu_' to identify if need to hide.
        if (allBBSLine && allBBSLine.length > 0) {
            allBBSLine = [].filter.call(allBBSLine, (element, index) => {
                if (element.dataset.type === 'bbsline') {
                    let nRow = parseInt(element.dataset.row,10);
                    if (nRow >= 3 && nRow <= 22)
                    {
                        let user = element.innerText.substring(16).split(' ')[0];
                        element.classList.add(`blu_${user}`);
                    }
                }
            });
        }
        lastBBSState = BBSTATE_INBOARD;
    }else if (isReading) {
        // check if new article.
        // 0:' 作者 ' 1:' 標題 ' 2:' 時間 '
        let isNewArticle = (allBBSLine[0].innerText.match(/ 作者 /) != null &&
            allBBSLine[1].innerText.match(/ 標題 /) != null &&
            allBBSLine[2].innerText.match(/ 時間 /) != null);

        if (isNewArticle){
            allQuoAuthor = [];

            // TODO: check if need skip this article. (use author).
            newAuthor = allBBSLine[0].innerText.substring(5).split(' ')[0];
            let blackList = gmcBlack.get('blackList');
            if (blackList && blackList.trim().length === 0){
                // no black list.
            }else{
                blackList = blackList.replace(/\n$/g, '').replace(/\n\n/g, '\n');
                blackList = blackList.split('\n');

                if (blackList.find(element =>{
                    return element == newAuthor;
                })){

                    if (gmc.get('isAutoQuitBlackArticle')) {
                        // sent 'q' until quit.
                        sendInput('q')
                    }else{
                        // hide all newAuthor text.
                        if (allBBSLine && allBBSLine.length > 0) {
                            [].filter.call(allBBSLine, (element, index) => {
                                if (element.innerText.includes('※') || element.innerText.includes(' 作者 ')){
                                    return;
                                }
                                let dep = element.innerText.match(/> /g);
                                if (dep){
                                }else{
                                    element.classList.add(`blu_${newAuthor}`);
                                }
                            });
                        }
                    }
                }
            }
        }else{
            // check if need to hide.
            let blackList = gmcBlack.get('blackList');
            if (blackList && blackList.trim().length === 0){
                // no black list.
            }else{
                blackList = blackList.replace(/\n$/g, '').replace(/\n\n/g, '\n');
                blackList = blackList.split('\n');

                if (blackList.find(element =>{
                    return element == newAuthor;
                })){

                    // impossible to enter here...
                    if (gmc.get('isAutoQuitBlackArticle')) {
                        // sent 'q' until quit.
                        sendInput('q')
                    }else{
                        // hide all newAuthor text.
                        if (allBBSLine && allBBSLine.length > 0) {
                            [].filter.call(allBBSLine, (element, index) => {
                                if (element.innerText.includes('※') || element.innerText.includes(' 作者 ')){
                                    return;
                                }
                                let dep = element.innerText.match(/> /g);
                                if (dep){
                                }else{
                                    element.classList.add(`blu_${newAuthor}`);
                                }
                            });
                        }
                    }
                }
            }
        }

        // check quotation author.
        // update quoAuthor every time. don't care the duplicate
        if (allBBSLine && allBBSLine.length > 0) {
            [].filter.call(allBBSLine,(element => {
                if (element.innerText.includes('※ 引述《')){
                    let authorPos = element.innerText.indexOf("《")+1;
                    let obj = new Object;
                    obj.user = element.innerText.substring(authorPos).split(' ')[0];
                    if(element.innerText.substr(0,authorPos).match(/> /g)){
                        obj.dep = element.innerText.substr(0,authorPos).match(/> /g).length+1;
                    }else{
                        obj.dep = 1;
                    }
                    allQuoAuthor.push(obj);
                }
            }));
        }
        if (allQuoAuthor && allQuoAuthor.length > 0)
        {
            if (allBBSLine && allBBSLine.length > 0) {
                [].filter.call(allBBSLine, (element, index) => {
                    if (element.innerText.includes('※')){
                        return;
                    }
                    let dep = element.innerText.match(/> /g);
                    if (dep)
                    {
                        dep = dep.length;
                        allQuoAuthor.find(qaEle => {
                            if (qaEle.dep == dep){
                                element.classList.add(`blu_${qaEle.user}`);
                                return true;
                            }

                        });
                    }
                });
            }
        }

        lastBBSState = BBSTATE_INREADING;
    }else {
        lastBBSState = BBSTATE_OTHER;
    }

    const currentTS = Math.floor(Date.now() / 1000);

	if ((currentTS - timestamp) > 2) {
		stopInterval();
	}
    return;

    // NOTE : old code.

	const css = (elements, styles) => {
		elements = elements.length ? elements : [elements];
		elements.forEach(element => {
			for (var property in styles) {
				element.style[property] = styles[property];
			}
		});
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

	//const currentTS = Math.floor(Date.now() / 1000);
	/*if ((currentTS - timestamp) > 2) {
		stopInterval();
	}*/

}

const CreateMutationObserver = () => {
    //console.log("Get container.");
	const container = document.querySelector('#mainContainer');
	if (!container) {
        //console.log("Container not ready, wait retry");
		setTimeout(CreateMutationObserver, 1000);
		return;
	}

    console.log("start observe");
	//if (isTerm) {
		//autoLogin(container); // TODO: move to exec
	//}
	const observer = new MutationObserver(mutations => {
		mutations.forEach(mutation => execInterval());
	})
	observer.observe(container, {childList: true,subtree: true,characterData: true});
    execInterval()
}

const writeDebugLog = (log) => {
	/*if (gmc.get('isShowDebug')) {
		queryConfigEl('#PttChromeAddOnConfigDebug', 'textarea', el => {
			el.value = `${log}\n` + el.value;
		});
	}*/
}
const sleep = msec => new Promise(resolve => setTimeout(resolve, msec));
const autoLogin = async (container) => {
    //console.log("auto login start.");
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
        //writeDebugLog("Test Auto login");
		if (container.innerText.trim().length < 10) {
			await sleep(1000);
			return autoLogin(container);
		}
		const list = [];
		if (gmc.get('autoUser') && gmc.get('autoPassWord')) {

            if (isBaha){
                list.push({regexp: /請輸入勇者代號：/, pasteKey: `${gmc.get('autoUser')}\n${gmc.get('autoPassWord')}\n`, isReCheck: true});
            }else{
                list.push({regexp: /請輸入代號，或以/, pasteKey: `${gmc.get('autoUser')}\n${gmc.get('autoPassWord')}\n`, isReCheck: true});
            }
		}

		if (gmc.get('isEnableDeleteDupLogin') !== "N/A") {

            if (isBaha){
                list.push({regexp: /您想刪除其他重複的 login/, pasteKey: `${gmc.get('isEnableDeleteDupLogin')}\n`, isReCheck: true});
            }else{
                list.push({regexp: /您有其它連線已登入此帳號/, pasteKey: `${gmc.get('isEnableDeleteDupLogin')}\n`, isReCheck: true});
            }
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
    console.log("Add listener");
    // remove this, because it load too late that can't catch 'load' event.
	//window.addEventListener("load", function(event) {
        //console.log("Loading...");
		CreateMutationObserver();
	//});
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
		/*if (gmc.get('isShowDebug') && gmcDebug){
            gmcDebug.open();
            //writeDebugLog("開啟Debug視窗");
            console.log("Debugging");
        }*/
	} else if (configStatus) {
		configStatus = false;
		if (gmc.isOpen) gmc.close();
		if (gmcDebug.isOpen) gmcDebug.close();
		if (gmcBlack.isOpen) gmcBlack.close();
	}
}
_button.style = "border: 1px solid #AAA;color: #999;background-color: #111;position: fixed; top: 0.5em; right: 0.5em; z-index: 900;cursor:pointer !important;"

document.body.appendChild(_button)

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
