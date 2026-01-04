// ==UserScript==
// @name	     简繁转换（中国大陆、台湾、香港、日本新字体）
// @namespace	 Forbidden Siren
// @version	     0.9.21
// @description  调用 opencc-rust-wasm 转换中文
// @match	  *
// @match     *://*/*
// @grant  	  GM_getResourceText
// @grant	  GM_getResourceURL
// @grant	  GM_registerMenuCommand
// @grant	  GM_unregisterMenuCommand
// @grant	  GM_getValue
// @grant	  GM_setValue
// @grant     GM_xmlhttpRequest
// @license   MIT
// @connect   self
// @require   https://greasyfork.org/scripts/448529-opencc-rust-lib/code/opencc-rust-lib.js?version=1074680
// @require   https://greasyfork.org/scripts/448197-elementgetter/code/ElementGetter.js?version=1126009
// @resource  opencc_wasm https://cdn.jsdelivr.net/gh/polyproline/opencc-wasm@main/opencc_gc.wasm
// @resource  HKVariants	https://cdn.jsdelivr.net/npm/opencc-data/data/HKVariants.txt
// @resource  HKVariantsRev	https://cdn.jsdelivr.net/npm/opencc-data/data/HKVariantsRev.txt
// @resource  HKVariantsRevPhrases	https://cdn.jsdelivr.net/npm/opencc-data/data/HKVariantsRevPhrases.txt
// @resource  JPShinjitaiCharacters	https://cdn.jsdelivr.net/npm/opencc-data/data/JPShinjitaiCharacters.txt
// @resource  JPShinjitaiPhrases	https://cdn.jsdelivr.net/npm/opencc-data/data/JPShinjitaiPhrases.txt
// @resource  JPVariants	https://cdn.jsdelivr.net/npm/opencc-data/data/JPVariants.txt
// @resource  JPVariantsRev	https://cdn.jsdelivr.net/npm/opencc-data/data/JPVariantsRev.txt
// @resource  STCharacters	https://cdn.jsdelivr.net/npm/opencc-data/data/STCharacters.txt
// @resource  STPhrases	https://cdn.jsdelivr.net/npm/opencc-data/data/STPhrases.txt
// @resource  TSCharacters	https://cdn.jsdelivr.net/npm/opencc-data/data/TSCharacters.txt
// @resource  TSPhrases	https://cdn.jsdelivr.net/npm/opencc-data/data/TSPhrases.txt
// @resource  TWPhrasesIT	https://cdn.jsdelivr.net/npm/opencc-data/data/TWPhrasesIT.txt
// @resource  TWPhrasesName	https://cdn.jsdelivr.net/npm/opencc-data/data/TWPhrasesName.txt
// @resource  TWPhrasesOther	https://cdn.jsdelivr.net/npm/opencc-data/data/TWPhrasesOther.txt
// @resource  TWPhrasesRev	https://cdn.jsdelivr.net/npm/opencc-data/data/TWPhrasesRev.txt
// @resource  TWVariants	https://cdn.jsdelivr.net/npm/opencc-data/data/TWVariants.txt
// @resource  TWVariantsRev	https://cdn.jsdelivr.net/npm/opencc-data/data/TWVariantsRev.txt
// @resource  TWVariantsRevPhrases	https://cdn.jsdelivr.net/npm/opencc-data/data/TWVariantsRevPhrases.txt
// @downloadURL https://update.greasyfork.org/scripts/446750/%E7%AE%80%E7%B9%81%E8%BD%AC%E6%8D%A2%EF%BC%88%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E3%80%81%E5%8F%B0%E6%B9%BE%E3%80%81%E9%A6%99%E6%B8%AF%E3%80%81%E6%97%A5%E6%9C%AC%E6%96%B0%E5%AD%97%E4%BD%93%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/446750/%E7%AE%80%E7%B9%81%E8%BD%AC%E6%8D%A2%EF%BC%88%E4%B8%AD%E5%9B%BD%E5%A4%A7%E9%99%86%E3%80%81%E5%8F%B0%E6%B9%BE%E3%80%81%E9%A6%99%E6%B8%AF%E3%80%81%E6%97%A5%E6%9C%AC%E6%96%B0%E5%AD%97%E4%BD%93%EF%BC%89.meta.js
// ==/UserScript==

"use strict";

const ToSimple = [["HKVariantsRevPhrases", "HKVariantsRev"], ["TWPhrasesRev", "TWVariantsRevPhrases", "TWVariantsRev"], ["TSPhrases", "TSCharacters"]];// to Simple Chinese
const ToTraditional = [["TWVariantsRevPhrases", "TWVariantsRev"], ["HKVariantsRevPhrases", "HKVariantsRev"], ["JPShinjitaiPhrases", "JPShinjitaiCharacters", "JPVariantsRev"], ["STPhrases", "STCharacters"]];
const ToTaiwan = [["STPhrases", "STCharacters"], "TWVariants", "TWPhrases"];
const ToHongKong = [["STPhrases", "STCharacters"], "HKVariants"];
const ExcludeTag = new RegExp("SCRIPT|TEXTAREA|META|BASE|NOSCRIPT|OBJECT");
const ExcludeType = new RegExp("text|search|hidden");
const Base64 = new RegExp("(?<=base64,).*");
const NODE_DICT = ToSimple;

let AutoTranslate = GM_getValue("AutoTranslate", false);
let ListenEvent = GM_getValue("ListenEvent", false);
let auto_translate = GM_registerMenuCommand((AutoTranslate ? "Disable" : "Enable") + " Auto Translate", set_auto_translate);

if (AutoTranslate) {
	load_func();
} else {
	let loadid = GM_registerMenuCommand("Start translate", () => {
		GM_unregisterMenuCommand(loadid);
		load_func();
	});
}
function set_auto_translate() {
	GM_unregisterMenuCommand(auto_translate);
	AutoTranslate = !AutoTranslate;
	GM_setValue("AutoTranslate", AutoTranslate);
	auto_translate = GM_registerMenuCommand((AutoTranslate ? "Disable" : "Enable") + " Auto Translate", set_auto_translate);
}

function load_func() {
	const url = GM_getResourceURL("opencc_wasm", false );
	const detail = {
		url:url,
		method:"GET",
		responseType:"arraybuffer",
		onload:res=>{
			if(res.status == 200){
				let arr = res.response;
				arr = new Uint8Array(arr);
				init(arr).then(init_wasm);
			}
		}
	};
	GM_xmlhttpRequest(detail);
}
function init_wasm() {
	const elmGetter = new ElementGetter();
	let build = ConverterBuild.new();
	NODE_DICT.forEach(item => {
		if (Array.isArray(item)) {
			item.forEach(function (item) {
				console.assert(typeof item == "string");
				build.adddict(GM_getResourceText(item));
			});
		} else {
			console.assert(typeof item == "string");
			build.adddict(GM_getResourceText(item));
		}
		build.group();
	});
	const converter = build.build();

	const translate_body = () => { elmGetter.get("body").then(translate); };
	const translate_head = () => { elmGetter.get("head").then(translate); };
	const translate_all = () => { translate_head(); translate_body(); };
	translate_all();
	GM_registerMenuCommand("Translate", translate_all);
	{
		const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
		let observer = new MutationObserver(records =>{
			records.forEach(record => {
				switch (record.type) {
					case 'childList':
						record.addedNodes.forEach(translate)
						break;
					case 'characterData':
						if (record.target.data) {
							converter.convert(record.target.data).then(text => {
								if (text != record.target.data) {
									record.target.data = text;
								}
							});
						}
						break;
				}
			})
		});
		const option = {
			"childList": true,
			"subtree": true,
			"characterData": true
		};
		let id = GM_registerMenuCommand("Listen event", listen_event);
		function listen_event() {
			GM_unregisterMenuCommand(id);
			translate_body();
			elmGetter.get("body").then(body => {
				observer.observe(document.body, option);
				id = GM_registerMenuCommand("Unlisten event", unlisten_event);
			});
		}
		function unlisten_event() {
			GM_unregisterMenuCommand(id);
			observer.disconnect();
			id = GM_registerMenuCommand("Listen event", listen_event);
		}
	}

	function translate(pNode) {
		let stack = [];
		do {
			pNode.childNodes.forEach(child => {
				if (child.tagName && ExcludeTag.test(child.tagName))
					return;
				if (child.title) {
					converter.convert(child.title).then(text => {
						if (child.title != text) {
							child.title = text;
						}
					});
				}
				if (child.alt) {
					converter.convert(child.alt).then(text => {
						if (child.alt != text) {
							child.alt = text;
						}
					});
				}
				if (child.tagName == "INPUT" && !ExcludeType.test(child.type)) {
					if (child.value) {
						converter.convert(child.value).then(text => {
							if (child.value != text) {
								child.value = text;
							}
						});
					}
					if (child.placeholder) {
						converter.convert(child.placeholder).then(text => {
							if (child.placeholder != text) {
								child.placeholder = text;
							}
						});
					}
				} else if (child.nodeType == 3) {
					if (child.data) {
						converter.convert(child.data).then(text => {
							if (child.data != text) {
								child.data = text;
							}
						});
					}
				}
				if (child.nodeType == 1) {
					stack.push(child);
				}
			});
		} while (pNode = stack.pop());
	}
};