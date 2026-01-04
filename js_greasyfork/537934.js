// ==UserScript==
// @name         Tagsy_ApiBridge
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Tagsy的前置模块, 用于将 GM_* API 挂载到全局作用域
// @author       Gwencutilia
// @match        *://*/*
// @icon         https://www.emojiall.com/images/60/microsoft/2728.png
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_listValues
// @grant        GM_addValueChangeListener
// @grant        GM_removeValueChangeListener
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_notification
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setClipboard
// @grant        GM_info
// @grant        GM_cookie
// @grant        GM_addStyle
// @connect      ark.cn-beijing.volces.com
// @connect      api-wanwei.myapp.com
// @connect      api.deepseek.com
// @connect      hunyuan-multimodal-1258344703.cos.ap-guangzhou.myqcloud.com
// @connect      drive.alittlesnowflake.uk
// @connect      api.ipify.org
// @connect      cloud.seatable.cn
// @license      CC
// @downloadURL https://update.greasyfork.org/scripts/537934/Tagsy_ApiBridge.user.js
// @updateURL https://update.greasyfork.org/scripts/537934/Tagsy_ApiBridge.meta.js
// ==/UserScript==

(function () {
	const gmAPIs = [
		"GM_getValue",
		"GM_setValue",
		"GM_deleteValue",
		"GM_listValues",
		"GM_addValueChangeListener",
		"GM_removeValueChangeListener",
		"GM_xmlhttpRequest",
		"GM_download",
		"GM_notification",
		"GM_openInTab",
		"GM_registerMenuCommand",
		"GM_unregisterMenuCommand",
		"GM_setClipboard",
		"GM_info",
		"GM_cookie",
		"GM_addStyle"
	];

	unsafeWindow.TAGSY_GM = unsafeWindow.TAGSY_GM || {};
	unsafeWindow.GM = unsafeWindow.GM || {};

	function toPascalCase(apiName) {
		const parts = apiName.replace(new RegExp("GM_"), '').split(new RegExp("(?=[A-Z])")); // 构造函数内使用字符串
		return parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(''); // -> GetValue
	}

	for (const api of gmAPIs) {
		if (typeof window[api] !== "undefined") {
			const pascalName = toPascalCase(api);
			unsafeWindow.TAGSY_GM[api] = window[api]; 
			unsafeWindow.GM[pascalName] = window[api]; 
		}
	}
})();