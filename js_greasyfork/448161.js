// ==UserScript==
// @name         beibei.js
// @namespace    https://github.com/iibeibei
// @version      0.0.7
// @description  IMPORTANT: This function requires your script to have loaded jQuery.
// @author       Beibei
// @license      GPLv3
// @match        *://*/*
// ==/UserScript==

/**
 * @description: 一个实用程序函数，用于 Greasemonkey 脚本, 检测和处理 AJAXed 内容
 * @param {*} selector_txt 元素选择器
 * @param {*} active_host 激活的域名
 * @param {*} active_url 激活的页面URL
 * @param {*} b_wait_once 是否只扫描一次
 * @param {*} iframe_selector 是否扫描Frame框架
 * @param {*} action_function 找到元素时运行的方法，传送 node, selector_txt, active_host, active_url 四个变量
 */
function waitForKeyElements(selector_txt, active_host, active_url, b_wait_once, iframe_selector, js_code, action_function) {
	if (active_host != '*' && document.domain.split('.').slice(-2).join('.') != active_host) return;

	var active_url_type = false;
	if (typeof active_url == 'object') {
		for (let index = 0; index < active_url.length; index++) {
			if (window.location.href.indexOf(active_url[index]) > -1) {
				active_url_type = true;
				break;
			}
		}
	} else if (typeof active_url == 'string') {
		if (window.location.href.indexOf(active_url) > -1) active_url_type = true;
	}

	if (active_url_type) {
		var target_nodes, b_targets_found;
		if (iframe_selector) {
			target_nodes = $(iframe_selector).contents().find(selector_txt);
		} else {
			target_nodes = $(selector_txt);
		}

		if (target_nodes && target_nodes.length > 0) {
			b_targets_found = true;
			target_nodes.each(function () {
				var j_this = $(this);
				var already_found = j_this.data('alreadyFound') || false;

				if (!already_found) {
					logPrint(`selector_txt > ${selector_txt} active_host > ${active_host} active_url > ${active_url} b_wait_once > ${b_wait_once} iframe_selector > ${iframe_selector}`);
					console.log(j_this);

					var cancel_found = false;
					if (typeof action_function == 'object') {
						action_function.forEach((element) => {
							cancel_found = element(j_this, selector_txt, active_host, active_url, js_code);
						});
					} else if (typeof action_function == 'function') {
						cancel_found = action_function(j_this, selector_txt, active_host, active_url, js_code);
					}

					if (cancel_found) {
						b_targets_found = false;
					} else {
						j_this.data('alreadyFound', true);
					}
				}
			});
		} else {
			b_targets_found = false;
		}

		var control_obj = waitForKeyElements.control_obj || {};
		var control_key = selector_txt.replace(/[^\w]/g, '_');
		var time_control = control_obj[control_key];

		if (b_targets_found && b_wait_once && time_control) {
			clearInterval(time_control);
			delete control_obj[control_key];
		} else {
			if (!time_control) {
				time_control = setInterval(function () {
					waitForKeyElements(selector_txt, active_host, active_url, b_wait_once, iframe_selector, js_code, action_function);
				}, 300);
				control_obj[control_key] = time_control;
			}
		}
		waitForKeyElements.control_obj = control_obj;
	}
}
function makeGetRequest(url, method = 'GET', data = null) {
	logPrint(`${method} -> ${url}`);
	return new Promise((resolve, reject) => {
		GM_xmlhttpRequest({
			url: url,
			method: method,
			data: data,
			onload: function (response) {
				resolve(response);
			},
			onerror: function (error) {
				reject(error);
			},
		});
	});
}
function logPrint(params) {
	var date_time = $.trim(new Date(new Date().setHours(new Date().getHours() + 8)).toISOString().replace('Z', ' ').replace('T', ' '));
	var function_name = new Error().stack.split('\n')[2].trim().split(' ')[1];
	console.log(`[${date_time}][DEBUG] ${function_name} - ${params}`);
}
function sleep(interval) {
	return new Promise((resolve) => {
		setTimeout(resolve, interval);
	});
}
function loadMenu(menu_ALL, version_url) {
	var menu_ID = [];

	// 如果读取到的值为 null 就写入默认值
	for (let i = 0; i < menu_ALL.length; i++) {
		if (GM_getValue(menu_ALL[i][0]) == null) {
			GM_setValue(menu_ALL[i][0], menu_ALL[i][3]);
		}
	}

	registerMenuCommand();

	// 注册脚本菜单
	function registerMenuCommand() {
		// 如果菜单ID数组多于菜单数组，说明不是首次添加菜单，需要卸载所有脚本菜单
		if (menu_ID.length > menu_ALL.length) {
			for (let i = 0; i < menu_ID.length; i++) {
				GM_unregisterMenuCommand(menu_ID[i]);
			}
		}

		// 循环注册脚本菜单
		for (let i = 0; i < menu_ALL.length; i++) {
			menu_ALL[i][3] = GM_getValue(menu_ALL[i][0]);
			menu_ID[i] = GM_registerMenuCommand(`${menu_ALL[i][3] ? '✅' : '❌'} ${menu_ALL[i][2]}`, function () {
				menu_switch(`${menu_ALL[i][0]}`, `${menu_ALL[i][1]}`, `${menu_ALL[i][2]}`, `${menu_ALL[i][3]}`);
			});
		}

		// 加入版本信息
		menu_ID[menu_ID.length] = GM_registerMenuCommand(`🏁 当前版本 ${GM_info['script']['version']}`, function () {
			window.GM_openInTab(version_url, { active: true, insert: true, setParent: true });
		});
	}

	//切换选项
	function menu_switch(name, ename, cname, value) {
		if (value == 'false') {
			// 重新注册脚本菜单，刷新网页
			GM_setValue(`${name}`, true);
			registerMenuCommand();
			location.reload();
			GM_notification({ text: `「${cname}」已开启\n`, timeout: 3500 });
		} else {
			// 重新注册脚本菜单，刷新网页
			GM_setValue(`${name}`, false);
			registerMenuCommand();
			location.reload();
			GM_notification({ text: `「${cname}」已关闭\n`, timeout: 3500 });
		}
		// 重新注册脚本菜单
		registerMenuCommand();
	}
}
/**
 * 获取指定的cookie
 * @param {String} key cookie的key
 * @returns {String}
 */
function get_cookie(key) {
	const cookie = document.cookie.split(';');
	for (let i = 0, len = cookie.length; i < len; i++) {
		const cur = cookie[i].split('=');
		if (key === cur[0]) {
			return cur[1];
		}
	}

	return '';
}
function initializationScript() {
	var $ = window.$;
	var VueCDN = 'https://lib.baomitu.com/vue/3.2.36/vue.global.prod.min.js';
	var ElementPlusCDN = 'https://lib.baomitu.com/element-plus/2.2.2/index.full.min.js';
	GM_addStyle(GM_getResourceText('element-plus'));
	$.getScript(VueCDN, function () {
		console.log('[' + VueCDN + '] Vue 加载成功');
		$.getScript(ElementPlusCDN, function () {
			console.log('[' + ElementPlusCDN + '] ElementPlus 加载成功');
			var ElementPlus = unsafeWindow.ElementPlus;
			var Vue = unsafeWindow.Vue;
		});
	});
}
