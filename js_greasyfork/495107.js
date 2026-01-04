// ==UserScript==
// @name         Digit77 Helper
// @namespace    cn.XYZliang.digit77Helper
// @version      2.4.6
// @description  自动复制提取码，跳过ouo.io的三秒等待时间！
// @require      https://code.jquery.com/jquery-3.7.1.min.js
// @license      GNU General Public License v3.0
// @author       XYZliang
// @homepage     https://greasyfork.org/zh-CN/scripts/495107-digit77-helper
// @match        *://www.digit77.com/*
// @match        *://ouo.io/*
// @match        *://ouo.press/*
// @match        *://cloaking.link/*
// @match        *://*.sharepoint.com/*
// @match        *://www.aliyundrive.com/*
// @match        *://pan.quark.cn/*
// @icon         https://www.digit77.com/_nuxt/logo-s.BqVYlxIi.png
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @grant        GM_getClipboard
// @run-at       document-end
// @connect      *
// @downloadURL https://update.greasyfork.org/scripts/495107/Digit77%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/495107/Digit77%20Helper.meta.js
// ==/UserScript==
/* globals jQuery, $ */
'use strict';

// 用户设置
let settings = GM_getValue('settings', {
	autofill: true,
	ouo: true,
	cloaking: true,
	quark: true,
	baidu: true,
	onedrive: true,
	aliyun: true,
	error: true,
});

// Clean up
cleanupStorage();

let url = location.host;
// Main logic goes here ---------------------------------------------------------
if (url.includes('digit77.com')) {
	handleDigit77();
} else if (url.includes('ouo')) {
	handleOuo();
} else if (url.includes('cloaking')) {
	handleCloaking();
} else if (url.includes('pan.quark.cn')) {
	hanndleQuark();
} else if (url.includes('sharepoint.com')) {
	if (settings.onedrive)
		doFillAction('#txtPassword', '#btnSubmitPassword', 'digit77');
} else {
	console.log('Unknown url! (' + url + ')');
	return;
}

// Function definitions ---------------------------------------------------------
function handleCloakingGo(pw) {
	GM_xmlhttpRequest({
		method: 'POST',
		url: `${location.origin}/links/go`,
		data: $('#go-link').serialize(),
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
		onload: function (response) {
			console.log('Onload response:', response.responseText);
			if (response.status === 200) {
				try {
					var data = JSON.parse(response.responseText);
					if (data.status !== 'error') {
						let realLink = data.url;
						let finalUrlWithPwd = addGetParameter(
							realLink,
							'Digit77HelperPwd',
							//GM_getValue(pw),
							getPasscode(pw),
						);
						setTimeout(() => {
							window.location.href = finalUrlWithPwd;
						}, 1000);
					} else {
						console.error('Error from server:', data);
					}
				} catch (e) {
					console.error('Failed to parse response:', e);
				}
			} else {
				console.error('Failed to get the real link', response.status);
			}
		},
		onerror: function (response) {
			console.error(
				'Request failed:',
				response.status,
				response.statusText,
			);
		},
	});
}

// Function definitions ---------------------------------------------------------
function handleCloaking() {
	if (!settings.cloaking) return;
	console.group(`[Digital77 Helper] -- ${location.origin}`);
	consoleLog('正在跳过Cloaking');
	// Directly set text using .text() for better consistency and compatibility.
	$('h1').text('Digit77 Helper正在跳过等待!');
	$('#form-continue > button').text('欢迎使用Digit77 Helper');
	let pathSegments = location.pathname.split('/')[1];

	if (settings.error) consoleLog('path segments: ' + pathSegments);
	// set cloaking status to 0 for the first time
	GM_setValue('cloaking', 0);
	// if the cloaking status is 0, then set the cloaking status to 1
	if (GM_getValue('cloaking') === 0) {
		GM_setValue('cloaking', 1);
		// click the continue button
		$('#form-continue > button').click();

		//request url from cloaking is https://cloaking.link/links/go
		setTimeout(() => {
			handleCloakingGo(pathSegments);
		}, 1000);
	}
	// if find element body > div.container > div > div > div > div:nth-child(5) > a, then extract the link form it
	if (
		$('body > div.container > div > div > div > div:nth-child(5) > a')
			.length > 0
	) {
		WaitForLink();
	}
	console.groupEnd();
}

function WaitForLink() {
	// focuse on the link
	$(
		'body > div.container > div > div > div > section.link-tab-body.mb-5 > div > div > div:nth-child(2) > div > fieldset > div > div.col-md-3.g-link-body > div > div > a',
	).focus();
	// wait for 5 seconds to get the link
	setTimeout(() => {
		let link = $(
			'body > div.container > div > div > div > section.link-tab-body.mb-5 > div > div > div:nth-child(2) > div > fieldset > div > div.col-md-3.g-link-body > div > div > a',
		).attr('href');
		if (link.includes('javascript')) WaitForLink();
		let pw = location.pathname.split('/')[1];
		let passcode = getPasscode(pw)
		if (settings.error)
			consoleLog('Cloaking link: ' + pw + ' pwd: ' + passcode);
		let finalUrl = addGetParameter(
			link,
			'Digit77HelperPwd',
			//GM_getValue(pw),
			passcode,
		);
		window.location.href = finalUrl;
	}, 2800);
}

function hanndleQuark() {
	if (!settings.quark) return;
	// get the password from parameter
	const urlObj = new URL(window.location.href);

	// if the url contains the parameter Digit77HelperPwd, then fill the password

	if (!urlObj.search.includes('Digit77HelperPwd')) {
		return;
	}

	const queryParams = new URLSearchParams(urlObj.search);
	const digit77HelperPwd = queryParams.get('Digit77HelperPwd');
	if (settings.error) {
		console.log('Debugging <夸克网盘>: ');
		console.log('href: ', window.location.href);
		console.log('code: ', digit77HelperPwd);
	}
	if (digit77HelperPwd !== undefined) {
		doFillAction(
			'#ice-container > div.ShareReceivePC--wrapcontainer--3OAJUiU.share-container-cls-name-for-get-dom > div.ShareReceivePC--wrapcontent--2fA9pbO > div > div.ShareReceivePC--content--3zjCAuj > div.ShareReceivePC--input-wrap--2FUw27N > input',
			'#ice-container > div.ShareReceivePC--wrapcontainer--3OAJUiU.share-container-cls-name-for-get-dom > div.ShareReceivePC--wrapcontent--2fA9pbO > div > div.ShareReceivePC--content--3zjCAuj > div:nth-child(5) > button',
			digit77HelperPwd,
		);
	} else alert('请手动粘贴提取码:', GM_getClipboard());
}

function handleOuo() {
	if (!settings.ouo) return;

	console.group(`[Digital77 Helper] -- ${location.href}`);
	consoleLog('正在跳过ouo');

	// Use .ready() to ensure the DOM is fully loaded before attempting to modify elements.
	$(document).ready(function () {
		// Directly set text using .text() for better consistency and compatibility.
		$('h4').text('Digit77 Helper正在跳过等待!');
		$('.btn-main').text('欢迎使用Digit77 Helper');

		let pathSegments = location.pathname.split('/');
		let passcode = getPasscode(pathSegments[2]);
		if (settings.error)
			consoleLog(
				'path segments: ' +
					pathSegments +
					' pwd key: ' +
					pathSegments[2] +
					' pwd: ' +
					//GM_getValue(pathSegments[2]),
					passcode,
			);
		// Check if the path contains 'go' and proceed with the specific logic for those pages.
		if (pathSegments[1] === 'go') {
			let reallyUrlGetter = `${location.origin}/xreallcygo/${pathSegments[2]}`;
			let reallyUrlData = $('#form-go').serialize();

			// Use GM_xmlhttpRequest for cross-origin requests.
			GM_xmlhttpRequest({
				method: 'POST',
				url: reallyUrlGetter,
				data: reallyUrlData,
				headers: {
					'Content-Type':
						'application/x-www-form-urlencoded;charset=UTF-8',
				},
				onload: function (response) {
					// Construct the final URL with the password parameter if the request was successful.
					let finalUrl = addGetParameter(
						response.finalUrl,
						'Digit77HelperPwd',
						passcode,
					);
					if (response.status === 200) {
						// Redirect after a slight delay to enhance ad revenue potentially.
						setTimeout(
							() => (window.location.href = finalUrl),
							1000,
						);
					} else {
						failedToGetJumpAddress(getPasscode(pathSegments[2]));
					}
				},
				onerror: function () {
					failedToGetJumpAddress(getPasscode(pathSegments[2]));
				},
			});
		} else {
			// For non-'go' pages, wait before clicking the main button to pass through ads.
			setTimeout(() => $('.btn-main').click(), 1500);
		}
	});

	console.groupEnd();
}

// Main logic for Digit77 ---------------------------------------------------------
function handleDigit77() {
	$(document).ready(function () {
		// Create settings form directly
		const settingsFormHtml = `
		<details style="margin-top: 20px;">
			<summary style="background-color: crimson;border-radius: 5px;color:white">Digit77 Helper设置</summary>
			<div class="table-wrapper" style="padding-right: 10px;overflow-x: hidden;">
				<div id="settingsForm" class="settings-form"></div>
			</div>
		</details>`;

		console.group(`[Digital77 Helper] -- ${location.href}`);

		console.log('Digit77 Helper 加载成功！');

		// Options for the observer (which mutations to observe)
		const config = { childList: true, subtree: true };

		// Callback function to execute when mutations are observed
		const callback = function (mutationsList, observer) {
			for (let mutation of mutationsList) {
				if (mutation.type === 'childList') {
					let table = document.querySelector('table > tbody');
					if (
						table &&
						table.querySelectorAll('tr > td > div > button')
							.length > 0
					) {
						observer.disconnect(); // Stop observing
						handleLinks();

						// Select description part from the page
						let description = $(
							'#__nuxt > div > section > section > main > div.page_single > div.single_content > div.post_content',
						);
						if (description.length) {
							description.empty();
							description.append(settingsFormHtml);
							populateSettingsForm();
						}

						$(
							'#__nuxt > div > section > section > main > div.page_single > div.single_content > div.AdBox > div > div > div.el-table__inner-wrapper > div.el-table__body-wrapper > div > div.el-scrollbar__wrap.el-scrollbar__wrap--hidden-default > div > table > thead > tr > th.el-table_1_column_4.is-center.is-leaf.el-table__cell > div',
						).text('下载链接 (已成功加载Digit77 Helper)');

						break;
					}
				}
			}
		};

		// Create an instance of MutationObserver
		const observer = new MutationObserver(callback);

		// Select the node that will be observed for mutations
		const targetNode = document.querySelector('#__nuxt');

		// Start observing the target node for configured mutations
		observer.observe(targetNode, config);

		console.groupEnd();
	});
}

function handleLinks() {
	const nuxtDataElement = document.querySelector('#__NUXT_DATA__');

	// Early exit if no Nuxt data found
	if (!nuxtDataElement) {
		console.error('Failed to get #__NUXT_DATA__');
		return;
	}

	try {
		// Parse the JSON data directly from the innerHTML
		const data = JSON.parse(nuxtDataElement.innerHTML);

		// Validate parsed data and slice from 21 to 42
		if (!Array.isArray(data)) {
			throw new Error('Parsed data is not an array');
		}
		const relevantData = data.slice(21, 42);

		// Process each relevant data element
		relevantData.forEach((item, i) => {
			if (
				typeof item === 'string' &&
				(item.includes('cloaking.link') || item.includes('ouo.io'))
			) {
				const nextItem = relevantData[i + 1];
				if (
					nextItem &&
					typeof nextItem === 'string' &&
					nextItem.length < 5 &&
					settings.cloaking &&
					!nextItem.includes('盘') &&
					!nextItem.includes('drive')
				) {
					const key = item.split('/')[3];
					const pwd = nextItem;
					if (settings.error)
						console.log('Key:', key, 'Password:', pwd);
					if (settings.autofill) setPasscode(key, pwd);
				}
			}
		});
	} catch (e) {
		console.error('Failed to parse #__NUXT_DATA__:', e);
	}

	if (settings.error) GM_ShowAllValues();
}

// Helper functions ---------------------------------------------------------
function failedToGetJumpAddress(pwd) {
	if (!settings.error) {
		return;
	}
	GM_notification(
		'获取ouo跳转链接失败！这导致无法自动填写提取码，请手动粘贴提取码！',
		'Digit77 helper错误',
	);
	GM_setClipboard(pwd);
}

function getToday() {
	let date = new Date();
	let day = date.getDate();
	let month = date.getMonth() + 1;
	let year = date.getFullYear();
	let dateKey = `${day}-${month}-${year}`;
	return dateKey;
}

function setPasscode(key, pwd) {
	// append the password to the list of passcodes in the GM storage
	let passcodes = GM_getValue('passcodes', {});
	// store the passwords by the day-month-year
	let dateKey = getToday();
	if (!passcodes[dateKey]) passcodes[dateKey] = {};
	passcodes[dateKey][key] = pwd;
	GM_setValue('passcodes', passcodes);
}

function getPasscode(key) {
	let passcodes = GM_getValue('passcodes', {});
	let dateKey = getToday();
	if (passcodes[dateKey] && passcodes[dateKey][key]) {
		return passcodes[dateKey][key];
	}
	return null;
}

function addGetParameter(url, name, value) {
	url += (url.split('?')[1] ? '&' : '?') + name + '=' + value;
	return url;
}

//  以下代码修改自 网盘智能识别助手
let util = {
	parseQuery(name) {
		let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
		let r = location.search.substr(1).match(reg);
		if (r != null) return r[2];
		return null;
	},

	sleep(time) {
		return new Promise((resolve) => setTimeout(resolve, time));
	},

	addStyle(id, tag, css) {
		tag = tag || 'style';
		let doc = document,
			styleDom = doc.getElementById(id);
		if (styleDom) return;
		let style = doc.createElement(tag);
		style.rel = 'stylesheet';
		style.id = id;
		tag === 'style' ? (style.innerHTML = css) : (style.href = css);
		document.head.appendChild(style);
	},

	isHidden(el) {
		try {
			return el.offsetParent === null;
		} catch (e) {
			return false;
		}
	},

	query(selector) {
		if (Array.isArray(selector)) {
			let obj = null;
			for (let i = 0; i < selector.length; i++) {
				let o = document.querySelector(selector[i]);
				if (o) {
					obj = o;
					break;
				}
			}
			return obj;
		}
		return document.querySelector(selector);
	},
};

function doFillAction(inputSelector, buttonSelector, pwd) {
	let maxTime = 10;
	let ins = setInterval(async () => {
		maxTime--;
		let input = util.query(inputSelector);
		let button = util.query(buttonSelector);
		if (input && !util.isHidden(input)) {
			clearInterval(ins);
			let lastValue = input.value;
			input.value = pwd;
			//Vue & React 触发 input 事件
			let event = new Event('input', {
				bubbles: true,
			});
			let tracker = input._valueTracker;
			if (tracker) {
				tracker.setValue(lastValue);
			}
			input.dispatchEvent(event);
			await util.sleep(500); //1秒后点击按钮
			button.click();
		} else {
			maxTime === 0 && clearInterval(ins);
		}
	}, 333);
}

function populateSettingsForm() {
	const setting_template = [
		{
			id: 'autofill',
			text: '开启自动填写提取码',
			checked: settings.autofill,
		},
		{
			id: 'cloaking',
			text: '跳过cloaking广告页面的等待时间',
			checked: settings.cloaking,
		},
		{ id: 'ouo', text: '跳过ouo广告页面的等待时间', checked: settings.ouo },
		{ id: 'quark', text: '开启夸克网盘自动提取', checked: settings.quark },
		{ id: 'baidu', text: '开启百度网盘自动提取', checked: settings.baidu },
		{
			id: 'onedrive',
			text: '开启OneDrive自动提取',
			checked: settings.onedrive,
		},
		{ id: 'error', text: 'Debug 模式', checked: settings.error },
		// Continue with other settings as needed...
	];

	const formContainer = $('#settingsForm');
	formContainer.empty(); // Clear previous contents if any

	// Dynamically create and append settings controls
	setting_template.forEach((setting) => {
		const settingControlHtml = `
            <div class="custom-switch custom-control">
                <input class="custom-control-input" type="checkbox" ${
					setting.checked ? 'checked="checked"' : ''
				} id="${setting.id}" name="${setting.id}" />
                <label class="custom-control-label" for="${setting.id}">
                    ${setting.text}
                </label>
            </div>`;
		formContainer.append(settingControlHtml);
	});

	// Append action buttons
	const actionButtonsHtml = `
        <a class="btn btn-rd btn-block btn-lg btn-coral-pink" id="save">保存设置</a>
        <a class="btn btn-rd btn-block btn-lg btn-coral-pink" id="clean">清除缓存</a>
        <a href="https://github.com/lgcyaxi" target="_blank">关于插件<span class="icon-md fab fa-github linklogo"></span></a>`;
	formContainer.append(actionButtonsHtml);

	// Attach event listeners for buttons
	$('#save').on('click', function () {
		let updatedSettings = {};
		$('#settingsForm .custom-control-input').each(function () {
			let settingId = $(this).attr('id');
			let isChecked = $(this).is(':checked');
			updatedSettings[settingId] = isChecked;
		});

		// Save the updated settings object directly
		GM_setValue('settings', updatedSettings);
		alert('Settings have been saved successfully.');
		if (settings.error) {
			console.log('Debugging: ', GM_getValue('settings'));
		}
	});

	$('#clean').on('click', function () {
		let allValues = GM_listValues();
		allValues.forEach((value) => {
			if (value !== 'settings') GM_deleteValue(value);
		});
		alert('Cache cleared, except for settings.');
	});
}

function consoleLog(info, ...args) {
	if (typeof info === 'object') {
		let output = '';
		let styles = [];

		Object.entries(info).forEach(([key, value]) => {
			output += `%c${key}: %c${value}\n`;
			styles.push('color: #007BFF; font-weight: bold;', 'color: black;');
		});

		console.log(output, ...styles, ...args);
	} else {
		console.log(
			`%cDetails:\n%c${info}`,
			'color: #007BFF; font-weight: bold;',
			'color: black;',
			...args,
		);
	}
}

function GM_ShowAllValues() {
	let output = '';
	let styles = [];

	function processValue(value, indent = '') {
		if (typeof value === 'object' && value !== null) {
			Object.entries(value).forEach(([key, val]) => {
				output += `${indent}%c${key}: %c${val}\n`;
				styles.push('color: green;', 'color: black;');
				if (typeof val === 'object' && val !== null) {
					processValue(val, indent + '    ');
				}
			});
		} else {
			output += `${indent}%c${value}: %c${GM_getValue(value)}\n`;
			styles.push('color: green;', 'color: black;');
		}
	}

	GM_listValues().forEach((value) => {
		const val = GM_getValue(value);
		processValue({ [value]: val });
	});

	consoleLog(output, ...styles);
}

function cleanupStorage() {
	let values = GM_listValues();
	let todayKey = getToday();
	values.forEach((value) => {
		if (value !== 'passcodes' && value !== 'settings') {
			GM_deleteValue(value);
		} else if (value === 'passcodes') {
			let passcodes = GM_getValue('passcodes', {});
			Object.keys(passcodes).forEach((dateKey) => {
				if (dateKey !== todayKey) {
					delete passcodes[dateKey];
				}
			});
			GM_setValue('passcodes', passcodes);
		}
	});
	consoleLog('已自动清除缓存！');
}
