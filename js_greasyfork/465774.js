// ==UserScript==
// @name				网页屏蔽器
// @name:en				Website Blocker
// @version				1.3.8
// @description			屏蔽整个网站
// @description:en		Block the whole site
// @namespace			PPPScript
// @license				MIT
// @author				PPPxcy
// @include				*
// @noframes			false
// @grant				GM_setValue
// @grant				GM_getValue
// @grant				GM_registerMenuCommand
// @grant				GM_unregisterMenuCommand
// @run-at				document-start
// @supportURL			xvchongyv@foxmail.com
// @downloadURL https://update.greasyfork.org/scripts/465774/%E7%BD%91%E9%A1%B5%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/465774/%E7%BD%91%E9%A1%B5%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

document.createElementWithHTML = (tagName, HTML) => {
	let a = document.createElement(tagName);
	return a.innerHTML = HTML, a;
}, document.createElementWithHTMLTo = (tagName, HTML, where) => where.appendChild(document.createElementWithHTML(tagName, HTML));

var getValue = (name, defaultValue, isValid) => {
	if(!isValid)
		isValid = val => (val !== null && val !== undefined);
	let orig = GM_getValue(name);
	if(!isValid(orig))
		GM_setValue(name, orig = defaultValue);
	return orig;
}, toTable = thing => {
	let res = [];
	for(let i in thing)
		res.push(i);
	return res;
}, isHexColor = color => (color = String(color), color.length == 7 && color.charAt(0) == '#' && /^[0-9a-fA-F]{6}$/.test(color.substr(1))), isObject = val => typeof val == 'object', doOperator = (arr, val, oper) => {
	if(arr.length == 0)
		return null;
	let res = val(arr[0]);
	for(let i = 1; i < arr.length; i++)
		res = oper(res, val(arr[i]));
	return res;
}, languagePackage = {
	'zh': [
		() => '简体中文', () => '设置', () => 'PPPxcy 创作的 网页屏蔽器', () => languagePackage.zh[2]() + ' 屏蔽名单：',
		() => languagePackage.zh[2]() + ' 白名单：', () => '此网站已被屏蔽', () => '取消屏蔽',
		() => '来自 <a href="https://github.com/PPPxcy" target="_blank">PPPxcy</a> 创作的 网页屏蔽器。',
		() => '来自 ' + languagePackage.zh[2]() + '。', () => languagePackage.zh[2]() + '已自动屏蔽该网站：',

		() => languagePackage.zh[2]() + ' 已开启。', r => '你屏蔽了它：' + r + '，对吧？',
		r => '请确认你的其他脚本没有问题。对抗次数已经达到 ' + r + ' 次。',
		r => '您确定要取消屏蔽该网站吗？（' + r + '）', () => '拖拽以移动按钮', () => '屏蔽该网站', () => '隐藏',
		r => '您确定要屏蔽该网站吗？（' + r + '）', r => '您确定要隐藏此按钮吗？（在 ' + r + '）', () => '要永久隐藏吗？（否则本次会话会隐藏）',

		() => '你确定要进入设置页面吗？（这会导致该网页刷新！）', () => 'PPPxcy 创作的 网页屏蔽器 设置', () => '点击刷新以查看结果',
		() => '语言：', () => '主颜色：', () => '暗主色：', () => '亮主色：', () => '前景色：', () => '背景色：', () => ''
	], 'en': [
		() => 'English', () => 'Settings', () => 'The \x1B[3mWebsite Blocker\x1B[23m written by PPPxcy',
		() => 'The blocked-list of ' + languagePackage.en[2]() + ': ', () => 'The white-list of ' + languagePackage.en[2]() + ': ',
		() => 'The website is blocked. ', () => 'Unblock',
		() => 'From the <i>Website Blocker</i>&nbsp;written by <a href="https://github.com/PPPxcy" target="_blank">PPPxcy</a>. ',
		() => 'From ' + 'the Website Blocker written by PPPxcy' + '. ', () => languagePackage.en[2]() + ' automatically blocked this site: ',

		() => languagePackage.en[2]() + ' is opened. ', r => 'You banned the site: ' + r + ', currect? ',
		r => 'Please check your other scripts. The confrontations\' of other scripts count is at ' + r + ' . ',
		r => 'Are you sure to unblock this site? (' + r + ')', () => 'Drag to move the buttons. ', () => 'Block the site', () => 'Hide',
		r => 'Are you sure to block this site? (' + r + ')', r => 'Are you sure to hide the buttons? (At ' + r + ')',
		() => 'Are you sure to hide these buttons forever? (If you press "No", the buttons will be hiden until you reload this page.)',

		() => 'Are you sure to settings page? (It will reload this tab!)', () => 'Settings of the <i>Website Blocker</i>&nbsp;written by PPPxcy',
		() => 'Click it to reload to display the settings', () => 'Language:&nbsp;', () => 'Main color:&nbsp;', () => 'Darker main color:&nbsp;',
		() => 'Lighter main color:&nbsp;', () => 'Foreground color:&nbsp;', () => 'Background color:&nbsp;', () => ''
	]
}, PPPbanner = Object.assign(PPPbanner || {}, {top: 0, left: 0, listener: null, selectl: null, optionl: null});

let currentLang = getValue("PPP_banner_currentlanguage", 'zh', val => languagePackage.hasOwnProperty(val)), langPkg = languagePackage[currentLang], hre = window.location.origin, menu_command_id = GM_registerMenuCommand(langPkg[1](), () => {
//	TODO:	Things of settings...
	if(!confirm(langPkg[20]()))
		return;
	let options = document.createElementWithHTML('PPP-mask', `<PPP-banner-setter><PPP-inline-group>${langPkg[21]()}<span>×</span></PPP-inline-group><PPP-group><PPP-group-row><PPP-inline-group><PPP-label>${langPkg[23]()}</PPP-label><PPP-select forvalue="PPP_banner_currentlanguage" tabindex="0">${doOperator(toTable(languagePackage), item => (`<PPP-option value="${item}"${item == currentLang ? 'chosen' : ''}>${languagePackage[item][0]()}</PPP-option>`), (a, b) => (a + b))}</PPP-select></PPP-inline-group><PPP-group-row></PPP-group><PPP-group><PPP-group-row><PPP-inline-group><PPP-label>${langPkg[24]()}</PPP-label><PPP-color-chooser forvalue="PPP_banner_settingsmaincolor"><input type="color"/></PPP-color-chooser></PPP-inline-group><PPP-inline-group><PPP-label>${langPkg[25]()}</PPP-label><PPP-color-chooser forvalue="PPP_banner_settingsmaincolordark"><input type="color"/></PPP-color-chooser></PPP-inline-group><PPP-inline-group><PPP-label>${langPkg[26]()}</PPP-label><PPP-color-chooser forvalue="PPP_banner_settingsmaincolorlight"><input type="color"/></PPP-color-chooser></PPP-inline-group></PPP-group-row><PPP-group-row><PPP-inline-group unusing></PPP-inline-group><PPP-inline-group><PPP-label>${langPkg[27]()}</PPP-label><PPP-color-chooser forvalue="PPP_banner_settingsforegroundcolor"><input type="color"/></PPP-color-chooser></PPP-inline-group><PPP-inline-group><PPP-label>${langPkg[28]()}</PPP-label><PPP-color-chooser forvalue="PPP_banner_settingsbackgroundcolor"><input type="color"/></PPP-color-chooser></PPP-group-row></PPP-inline-group></PPP-group></PPP-banner-setter>`);
//	Here is one line because there were spaces in the string I do not want.

	GM_unregisterMenuCommand(menu_command_id), menu_command_id = GM_registerMenuCommand(langPkg[22](), () => window.location.reload()), document.documentElement.appendChild(document.createElement('body')), document.createElementWithHTMLTo('style', `	body {
		overflow: clip;
	}
	PPP-span {
		display: inline-block;
	}
	PPP-inline-group[unusing] {
		display: inline-block;
	}
	PPP-inline-group {
		display: inline-block;
	}
	PPP-label {
		display: inline-block;
	}
	PPP-group-row {
		display: block;
		margin: 0.25em 0;
		white-space: nowrap;
	}${doOperator([1, 2, 3, 4, 5, 6, 7, 8], val => `
	PPP-group-row:has(:nth-child(n + ${val})):not(PPP-group-row:has(:nth-child(n + ${val + 1}))) > PPP-inline-group {
		margin: 0;
		width: calc(100% / ${val});
	}`, (a, b) => (a + b))}
	PPP-group {
		display: block;
		text-align: left;
	}
	PPP-mask {
		all: initial;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		display: flex;
		position: fixed;
		font-size: 16px;
		z-index: 998244353;
		justify-content: center;
		background-color: #000A;
		-webkit-user-select: none;
		-moz-user-select: none;
		user-select: none;
	}
	PPP-mask * {
		line-height: 1.5em;
		box-sizing: content-box;
		font-family: sans-serif;
		vertical-align: initial;
	}
	PPP-banner-setter {
		--bgc: ${getValue("PPP_banner_settingsbackgroundcolor", '#FFFFFF', isHexColor)};
		--fgc: ${getValue("PPP_banner_settingsforegroundcolor", '#000000', isHexColor)};
		--cdk: ${getValue("PPP_banner_settingsmaincolordark", '#114466', isHexColor)};
		--clt: ${getValue("PPP_banner_settingsmaincolorlight", '#99EEFF', isHexColor)};
		--cmn: ${getValue("PPP_banner_settingsmaincolor", '#22CCFF', isHexColor)};
		color: var(--fgc);
		margin: 1.5625em 0;
		overflow-x: hidden;
		border-radius: 2.5em;
		padding-bottom: 1.75em;
		background-color: var(--bgc);
	}
	PPP-banner-setter > :first-child {
		display: block;
		color: var(--cdk);
		font-size: 1.5em;
		position: relative;
		text-align: center;
		line-height: 1.5em;
		white-space: nowrap;
		padding: 0.25em 1.75em;
		background-color: var(--clt);
	}
	PPP-banner-setter > :first-child > :last-child {
		width: 1.5em;
		height: 1.5em;
		color: var(--bgc);
		text-align: center;
		margin-left: 0.5em;
		line-height: 1.5em;
		margin-right: -1em;
		display: inline-block;
		border-radius: 0.75em;
		background-color: var(--cdk);
		box-shadow: inset 0.0234375em 0.0234375em 0 0.0625em var(--cmn);
	}
	PPP-banner-setter > :first-child > :last-child:hover {
		filter: brightness(0.875);
		backdrop-filter: brightness(0.875);
		box-shadow: inset -0.0234375em -0.0234375em 0 0.0625em var(--fgc);
	}
	PPP-banner-setter > :not(PPP-banner-setter > :first-child, PPP-banner-setter > :last-child) {
		border-bottom: 1px solid var(--fgc);
	}
	PPP-banner-setter > :not(PPP-banner-setter > :first-child) {
		padding: 0.625em;
		margin: 0 1.5625em;
	}
	PPP-banner-setter PPP-select {
		color: var(--cdk);
		height: 1.75em;
		min-width: 3.5em;
		overflow-x: clip;
		display: inline-block;
		border-radius: 0.25em;
		vertical-align: middle;
		border: 1px solid var(--cdk);
		background-color: var(--bgc);
	}
	PPP-banner-setter PPP-select > PPP-option {
		width: 100%;
		height: 1.75em;
		padding: 0 0.125em;
		line-height: 1.75em;
		white-space: nowrap;
	}
	PPP-banner-setter PPP-select[expanded] {
		overflow-y: auto;
		border-width: 2px;
		z-index: 998244353;
		position: relative;
		height: calc(var(--things-count) * 1.75em);
		margin: -1px -1px calc(var(--things-count) * -1.75em + 1.75em - 1px) -1px;
	}
	PPP-banner-setter PPP-select > PPP-option:hover {
		filter: brightness(0.875);
		backdrop-filter: brightness(0.875);
	}
	PPP-banner-setter PPP-select[expanded] > PPP-option {
		width: 100%;
		display: block;
		text-align: left;
	}
	PPP-banner-setter PPP-select:focus > PPP-option[chosen] {
		color: var(--bgc);
		background-color: var(--cmn);
	}
	PPP-banner-setter PPP-select > PPP-option[chosen] {
		display: inline-block;
	}
	PPP-banner-setter PPP-select:not(PPP-banner-setter PPP-select[expanded], PPP-banner-setter PPP-select:has(PPP-option[chosen])):hover {
		filter: brightness(0.875);
		backdrop-filter: brightness(0.875);
	}
	PPP-banner-setter PPP-select:not(PPP-banner-setter PPP-select[expanded]) > PPP-option:not(PPP-banner-setter PPP-select > PPP-option[chosen]) {
		display: none;
	}
	PPP-color-chooser > input[type=color]:hover {
		cursor: pointer;
		filter: brightness(0.875);
		backdrop-filter: brightness(0.875);
	}
	PPP-color-chooser {
		--width: 1.5em;
		--height: 1.5em;
		margin: 0;
		padding: 0;
		overflow: clip;
		font-size: inherit;
		width: var(--width);
		pointer-events: none;
		height: var(--height);
		display: inline-block;
		vertical-align: middle;
		border: 1px solid var(--cdk);
	}
	PPP-color-chooser > input[type=color] {
		padding: 0;
		border: none;
		margin: -7px -5px;
		font-size: inherit;
		pointer-events: auto;
		background-color: transparent;
		width: calc(var(--width) + 10px);
		height: calc(var(--height) + 14px);
	}`, document.documentElement.lastChild), document.documentElement.lastChild.appendChild(options),

	options.querySelector('PPP-banner-setter > :first-child > :last-child').title = `${langPkg[22]()}`,
	options.querySelector('PPP-banner-setter > :first-child > :last-child').onclick = () => (window.location.reload()), [...options.querySelectorAll('PPP-select')].forEach(sel => (
		sel.onclick = () => {
			sel.focus(), sel.setAttribute('expanded', '');
			if(!PPPbanner.optionl) {
				PPPbanner.optionl = [];
				let opts = [...sel.querySelectorAll('PPP-option')];
				for(let i = 0; i < opts.length; i++)
					opts[i].addEventListener('click', PPPbanner.optionl[i] = event => {
						if(sel.querySelector('PPP-option[chosen]'))
							sel.querySelector('PPP-option[chosen]').removeAttribute('chosen');
						event.stopPropagation(), event.preventDefault(), opts[i].setAttribute('chosen', ''), GM_setValue(sel.getAttribute('forvalue'), opts[i].getAttribute('value'));
						if(PPPbanner.optionl) {
							for(let i = 0; i < opts.length; i++)
								opts[i].removeEventListener('click', PPPbanner.optionl[i]);
							PPPbanner.optionl = null, sel.removeAttribute('expanded');
						}
					});
			}
		}, sel.onfocus = () => {
			if(!PPPbanner.selectl)
				document.addEventListener('keydown', PPPbanner.selectl = event => {
					event.stopPropagation(), event.preventDefault();
					switch(event.keyCode) {
						case 38: {
							let lastChosen = sel.querySelector('PPP-option[chosen]');
							if(!lastChosen)
								lastChosen = sel.firstChild;
							if(lastChosen.previousElementSibling || lastChosen.previousSibling) {
								let then = (lastChosen.previousElementSibling || lastChosen.previousSibling);
								lastChosen.removeAttribute('chosen'), then.setAttribute('chosen', ''), GM_setValue(sel.getAttribute('forvalue'), then.getAttribute('value')), then.scrollIntoView({block: 'nearest', behavior: 'smooth'});
							}
							break;
						} case 40: {
							let lastChosen = sel.querySelector('PPP-option[chosen]');
							if(!lastChosen)
								lastChosen = sel.firstChild;
							if(lastChosen.nextElementSibling || lastChosen.nextSibling) {
								let then = (lastChosen.nextElementSibling || lastChosen.nextSibling);
								lastChosen.removeAttribute('chosen'), then.setAttribute('chosen', ''), GM_setValue(sel.getAttribute('forvalue'), then.getAttribute('value')), then.scrollIntoView({block: 'nearest', behavior: 'smooth'});
							}
							break;
						}
					}
				});
		}, sel.onblur = () => {
			if(PPPbanner.selectl)
				document.removeEventListener('keydown', PPPbanner.selectl), PPPbanner.selectl = null;
			if(PPPbanner.optionl) {
				let opts = [...sel.querySelectorAll('PPP-option')];
				for(let i = 0; i < opts.length; i++)
					opts[i].removeEventListener('click', PPPbanner.optionl[i]);
				PPPbanner.optionl = null, sel.removeAttribute('expanded');
			}
		}, sel.style = `--things-count: ${Math.min(sel.querySelectorAll('PPP-option').length, 5)};`
	)), [...options.querySelectorAll('PPP-color-chooser')].forEach(csr => (
		csr.firstChild.value = getValue(csr.getAttribute('forvalue'), '#000000', isHexColor), csr.firstChild.addEventListener("input", event => GM_setValue(csr.getAttribute('forvalue'), csr.firstChild.value))
	));
}), hreobj = {};


{
	hreobj[hre] = null;
	let orig = getValue("PPP_banner_bannedlist", {}, isObject), orih = getValue("PPP_banner_whitelist", {}, isObject);
	if(localStorage.PPP_banned_sign == 'true')
		GM_setValue("PPP_banner_bannedlist", Object.assign(orig, hreobj));
	if(localStorage.PPP_unbanned_sign == 'true')
		GM_setValue("PPP_banner_whitelist", Object.assign(orih, hreobj));
	console.log(langPkg[3]() + '%O', [...toTable(orig)]), console.log(langPkg[4]() + '%O', [...toTable(orih)]);
}

if(localStorage.PPP_unbanned_sign != 'true')
	if(localStorage.PPP_banned_sign == 'true') {
		let headinn = `<title>${langPkg[5]()}</title><link rel="icon" href="https://what" type="image/png">`, bodyinn = `<style>
			html {
				font-size: 16px;
			}
			PPP-banner {
				--bgc: ${getValue("PPP_banner_settingsbackgroundcolor", '#FFFFFF', isHexColor)};
				--fgc: ${getValue("PPP_banner_settingsforegroundcolor", '#000000', isHexColor)};
				--cdk: ${getValue("PPP_banner_settingsmaincolordark", '#114466', isHexColor)};
				--clt: ${getValue("PPP_banner_settingsmaincolorlight", '#99EEFF', isHexColor)};
				--cmn: ${getValue("PPP_banner_settingsmaincolor", '#22CCFF', isHexColor)};
				all: initial;
				top: 1em;
				left: 1em;
				color: var(--fgc);
				display: block;
				position: fixed;
				white-space: nowrap;
				-webkit-user-select: none;
				-moz-user-select: none;
				user-select: none;
			}
			PPP-banner-button:hover {
				filter: brightness(87.5%);
			}
			PPP-banner-button {
				all: initial;
				cursor: pointer;
				border-radius: 0.5em;
				padding: 0.25em 0.5em;
				display: inline-block;
				background-color: var(--bgc);
				border: 1px solid var(--cdk);
			}
			hr {
				border: 0;
				height: 1px;
				background-image: linear-gradient(to right, #AAAF, #AAA0);
			}
			a:link {
				text-decoration: none;
			}
			a:active {
				text-decoration: none;
			}
			a:visited {
				text-decoration: none;
			}
			a:hover {
				text-decoration: none;
			}
		</style><PPP-banner><PPP-banner-button>${langPkg[6]()}</PPP-banner-button></PPP-banner><div style="margin-top: 25px; margin-left: 25px;"><p style="font-size: 3em;">${langPkg[5]()}</p><hr/><p style="font-size: 1.5em; color: gray; margin-top: -5px;">${langPkg[7]()}</p></div>`,
	//	Here is the same as above.
		last = 1, now, iself, countChange = -1, first = true, dangerLevels = [1000000, 100000, 10000, 3000, 1250, 500, 200, 100, 50, 25, 10, 5, 2, 1];

		for(let i = now = setInterval(Q => 0, 9); i > last; i--)
			clearInterval(i), clearTimeout(i);
		console.log(`${langPkg[9]()}${window.location.origin}`), last = now, iself = setInterval(() => {
			if(document.head && document.body && (document.head.innerHTML != headinn || document.body.innerHTML != bodyinn)) {
				for(let i = now = setInterval(Q => 0, 9); i > last; i--)
					if(i != iself)
						clearInterval(i), clearTimeout(i);
				last = now, countChange++, document.head.innerHTML = headinn, document.body.innerHTML = bodyinn;
				if(countChange >= dangerLevels[dangerLevels.length - 1])
					console.error(langPkg[12](dangerLevels.pop()));
				document.querySelector('PPP-banner > PPP-banner-button:last-child').onclick = () => {
					if(confirm(langPkg[13](hre))) {
						let orig = getValue("PPP_banner_bannedlist", {}, isObject);
						delete orig[hre], GM_setValue("PPP_banner_bannedlist", orig),
						delete localStorage.PPP_banned_sign, window.location.reload();
					}
				};
				if(first)
					headinn = document.head.innerHTML, bodyinn = document.body.innerHTML, first = false;
			}
		}, 16);
	} else {
		let innerHtml = `	<style>
		PPP-banner {
			--bgc: ${getValue("PPP_banner_settingsbackgroundcolor", '#FFFFFF', isHexColor)};
			--fgc: ${getValue("PPP_banner_settingsforegroundcolor", '#000000', isHexColor)};
			--cdk: ${getValue("PPP_banner_settingsmaincolordark", '#114466', isHexColor)};
			--clt: ${getValue("PPP_banner_settingsmaincolorlight", '#99EEFF', isHexColor)};
			--cmn: ${getValue("PPP_banner_settingsmaincolor", '#22CCFF', isHexColor)};
			all: initial;
			top: ${localStorage.PPP_banner_lasttop === undefined ? (localStorage.PPP_banner_lasttop = 16) : localStorage.PPP_banner_lasttop}px;
			left: ${localStorage.PPP_banner_lastleft === undefined ? (localStorage.PPP_banner_lastleft = 16) : localStorage.PPP_banner_lastleft}px;
			color: var(--fgc);
			display: block;
			position: fixed;
			font-size: 16px;
			z-index: 998244353;
			white-space: nowrap;
			pointer-events: none;
			-webkit-user-select: none;
			-moz-user-select: none;
			user-select: none;
		}
		PPP-banner-dragger:hover, PPP-banner-button:hover {
			filter: brightness(87.5%);
		}
		PPP-banner-dragger {
			width: 2em;
			height: 2em;
			z-index: 998244353;
			position: relative;
			border-radius: 0.5em;
			pointer-events: auto;
			display: inline-block;
			vertical-align: middle;
			background-color: var(--fgc);
		}
		PPP-banner-dragger:hover {
			cursor: grab;
		}
		PPP-banner-dragger::before {
			width: 2em;
			padding: 0;
			height: 2em;
			overflow: hidden;
			content: "\\FEFF";
			border-radius: 1em;
			display: inline-block;
			background-image: radial-gradient(var(--bgc), var(--clt) 12.5%, var(--cmn) 35.5%, var(--cdk) 65%, var(--fgc));
		}
		PPP-banner-button {
			all: initial;
			color: var(--fgc);
			cursor: pointer;
			z-index: 998244353;
			position: relative;
			border-radius: 0.5em;
			pointer-events: auto;
			display: inline-block;
			padding: 0.25em 0.5em;
			vertical-align: middle;
			background-color: var(--bgc);
			border: 1px solid var(--fgc);
		}
	</style><PPP-banner><PPP-banner-dragger title="${langPkg[14]()}"></PPP-banner-dragger><PPP-banner-button>${langPkg[15]()}</PPP-banner-button><PPP-banner-button>${langPkg[16]()}</PPP-banner-button></PPP-banner>`;
	//	Here is same as above too.
		console.log(`${langPkg[10]()}`), setInterval(() => {
			if(document.body && document.querySelector('PPP-banner') == null) {
				let banner = document.createElementWithHTMLTo('PPP-banner', innerHtml, document.body).querySelector('PPP-banner');
				banner.querySelector('PPP-banner-dragger').onmousedown = event => (PPPbanner.listener === null ? (
					banner.querySelector('PPP-banner-dragger').focus(),
					PPPbanner.top = event.clientY - banner.style.top.substr(0, banner.style.top.length - 2),
					PPPbanner.left = event.clientX - banner.style.left.substr(0, banner.style.left.length - 2),
					banner.style.willChange = "top, left", document.addEventListener('mousemove', PPPbanner.listener = event => (
						banner.style.opacity = '0.75',
						banner.style.top = Math.max(0, Math.min(localStorage.PPP_banner_lasttop = event.clientY - PPPbanner.top, window.innerHeight - banner.getBoundingClientRect().height)) + 'px',
						banner.style.left = Math.max(0, Math.min(localStorage.PPP_banner_lastleft = event.clientX - PPPbanner.left, window.innerWidth - banner.getBoundingClientRect().width)) + 'px'
					)), document.addEventListener('mouseup', event => (
						document.removeEventListener('mousemove', PPPbanner.listener),
						banner.style.opacity = document.querySelector('PPP-banner').style.willChange = PPPbanner.listener = window.onmouseup = null
					))
				) : null), document.querySelector('PPP-banner > PPP-banner-button:not(PPP-banner > PPP-banner-button:last-child)').onclick = event => {
					if(confirm(langPkg[17](hre)))
						localStorage.PPP_banned_sign = 'true', GM_setValue("PPP_banner_bannedlist", Object.assign(getValue("PPP_banner_bannedlist", {}, isObject), hreobj)), window.location.reload();
				}, document.querySelector('PPP-banner > PPP-banner-button:last-child').onclick = event => {
					if(confirm(langPkg[18](hre))) {
						if(confirm(`${langPkg[19]()}`))
							localStorage.PPP_unbanned_sign = 'true', GM_setValue("PPP_banner_whitelist", Object.assign(getValue("PPP_banner_whitelist", {}, isObject), hreobj));
						banner.style.display = 'none';
					}
				}, setInterval(() => {
					if(!PPPbanner.listener)
						banner.style.top = Math.max(0, Math.min(localStorage.PPP_banner_lasttop, window.innerHeight - banner.getBoundingClientRect().height)) + 'px',
						banner.style.left = Math.max(0, Math.min(localStorage.PPP_banner_lastleft, window.innerWidth - banner.getBoundingClientRect().width)) + 'px'
				}, 16);
			}
		}, 16);
	}
if(!(localStorage.PPP_unbanned_sign != 'true' && localStorage.PPP_banned_sign == 'true'))
	document.head.appendChild(document.createElementWithHTML('style', `a[href][PPP-blocked] { filter: brightness(0.5) sepia(1); backdrop-filter: brightness(0.5) sepia(1); border: 1px solid brown; }`)), setInterval(() => {
		for(let orig = getValue('PPP_banner_bannedlist', {}, isObject), alist = [...document.querySelectorAll('a[href]:not(a[href][PPP-checked], a[PPP-blocked])')], i = 0; i < alist.length; i++)
			try {
				if(orig.hasOwnProperty(new URL(alist[i].getAttribute('href'), window.location.href).origin))
					alist[i].setAttribute('PPP-blocked', ''), alist[i].setAttribute('title', `${langPkg[11](new URL(alist[i].getAttribute('href'), window.location.href).origin)}\n${langPkg[8]()}`);
				else
					alist[i].setAttribute('PPP-checked', '');
			} catch(error) {
				alist[i].setAttribute('PPP-checked', '');
			}
	}, 16);
