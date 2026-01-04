// ==UserScript==
// @name              无剑Mud辅助
// @description       无剑Mud辅修，由在线版移植而来，順便《略改》
// @namespace         http://tampermonkey.net/
// @version           9.9.9
// @license           MIT
// @author            燕飞、东方鸣、懒人、九
// @match             http://121.40.177.24:8001/*
// @match             http://110.42.64.223:8021/*
// @match             http://121.40.177.24:8041/*
// @match             http://121.40.177.24:8061/*
// @match             http://110.42.64.223:8081/*
// @match             http://121.40.177.24:8101/*
// @match             http://121.40.177.24:8102/*
// @match             http://swordman-s1.btmud.com/*
// @match             http://swordman-inter.btmud.com/*
// @grant             unsafeWindow
// @grant             GM_info
// @grant             GM_setClipboard
// @connect           greasyfork.org
// @connect           update.greasyfork.org
// @license           LGPL-3.0
// @grant             GM_xmlhttpRequest
// @grant             GM.xmlHttpRequest
// @grant             GM_openInTab
// @grant             GM.openInTab
// @run-at            document-end
// @compatible        Chrome >= 80
// @compatible        Edge >= 80
// @compatible        Firefox PC >= 74
// @compatible        Opera >= 67
// @compatible        Safari MacOS >= 13.1
// @compatible        Firefox Android >= 79
// @compatible        Opera Android >= 57
// @compatible        Safari iOS >= 13.4
// @compatible        WebView Android >= 80
// @downloadURL https://update.greasyfork.org/scripts/483659/%E6%97%A0%E5%89%91Mud%E8%BE%85%E5%8A%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/483659/%E6%97%A0%E5%89%91Mud%E8%BE%85%E5%8A%A9.meta.js
// ==/UserScript==
 
class GreasyFork {
	constructor() {
		if(location.hostname === 'greasyfork.org' || location.hostname === 'sleazyfork.org') {
			this.host = location.host
			return
		}
 
		throw new Error('Invalid instance initialization location, host is not valid.')
	}
 
	static get __xmlHttpRequest() {
		return GM_xmlhttpRequest || GM.xmlHttpRequest
	}
 
	static get __openInTab() {
		return GM_openInTab || GM.openInTab
	}
 
	static get INVALID_ARGUMENT_ERROR() {
		return 'Argument "{0}" is not valid'
	}
 
	static get PARSING_ERROR() {
		return 'Unexpected parsing error, "{0}"'
	}
 
	static get INVALID_PAGE_ERROR() {
		return 'Current page is not valid'
	}
 
	static __format(str, ...args) {
		let result = str
 
		for (let i = 0; i < args.length; i++) {
			const arg = args[i]
 
			result = result.replace(new RegExp(`\\{${i}\\}`, 'g'), arg)
		}
 
		return result
	}
 
	static __isId(id) {
		return typeof id === 'string' && /^\d+$/.test(id)
	}
 
	static get languages() {
		return [
			'ar', 'bg', 'cs', 'da', 'de', 'el', 'en', 'eo', 'es', 'fi', 'fr', 'fr-CA', 'he', 'hu', 'id', 'it', 'ja', 'ka', 'ko', 'nb', 'nl', 'pl', 'pt-BR', 'ro', 'ru', 'sk', 'sr', 'sv', 'th', 'tr', 'uk', 'ug', 'vi', 'zh-CN', 'zh-TW'
		]
	}
 
	static get version() {
		return '2.0.1'
	}
 
	static parseScriptNode(node) {
		if (!(node instanceof HTMLElement) || !node.dataset.scriptId) {
			throw new Error(GreasyFork.__format(GreasyFork.INVALID_ARGUMENT_ERROR, 'node'))
		}
 
		const {
			scriptId,
			scriptName,
			scriptAuthors,
			scriptDailyInstalls,
			scriptTotalInstalls,
			scriptRatingScore,
			scriptCreatedDate,
			scriptUpdatedDate,
			scriptType,
			scriptVersion,
			sensitive,
			scriptLanguage,
			cssAvailableAsJs
		} = node.dataset
 
		const ratingsNode = node.querySelector('dd.script-list-ratings')
		let ratings = {}
 
		if(ratingsNode) {
			const ratingsGood = Number(ratingsNode.querySelector('.good-rating-count').textContent)
			const ratingsOk = Number(ratingsNode.querySelector('.ok-rating-count').textContent)
			const ratingsBad = Number(ratingsNode.querySelector('.bad-rating-count').textContent)
 
			ratings = {
				ratingsGood,
				ratingsOk,
				ratingsBad
			}
		}
 
		return Object.assign({
			scriptId,
			scriptName,
			scriptAuthors: JSON.parse(scriptAuthors),
			scriptDailyInstalls: Number(scriptDailyInstalls),
			scriptTotalInstalls: Number(scriptTotalInstalls),
			scriptRatingScore: Number(scriptRatingScore),
			scriptCreatedDate,
			scriptUpdatedDate,
			scriptType,
			scriptVersion,
			sensitive: sensitive === 'true',
			scriptLanguage,
			cssAvailableAsJs: cssAvailableAsJs === 'true',
			node
		}, ratings)
	}
 
	static getScriptData(id) {
		if (!GreasyFork.__isId(id)) {
			throw new Error(GreasyFork.__format(GreasyFork.INVALID_ARGUMENT_ERROR, 'id'))
		}
 
		return new Promise((res, rej) => {
			GreasyFork.__xmlHttpRequest({
				url: `https://greasyfork.org/scripts/${id}.json`,
				onload: response => {
					const data = JSON.parse(response.responseText)
 
					return res(data)
				},
				onerror: err => {
					return rej(err)
				}
			})
		})
	}
 
	static getScriptCode(url, isLibrary = false) {
 
		return new Promise((res, rej) => {
			GreasyFork.__xmlHttpRequest({
				url,
				onload: response => {
					const code = response.responseText
 
					return res(code)
				},
				onerror: err => {
					return rej(err)
				}
			})
		})
	}
 
}
 
(function () {
  "use strict";
  if (location.host == "orchin.cn") {
    var params = new URLSearchParams(location.href.split("?")[1]);
    var host = params.get("ws_host");
    if (!host) return;
    params["delete"]("ws_host");
    location.replace("http://" + host + "?" + params.toString());
  }
 
  GreasyFork.getScriptData("491806").then(data => {
    GreasyFork.getScriptCode(data.code_url).then(code => {
      eval("(function (){" + code + "})()");
    });
  });
 
  
})();