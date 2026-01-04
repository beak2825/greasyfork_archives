// ==UserScript==
// @name	中文转换
// @namespace	Forbidden Siren
// @version	  0.9.12
// @description 支持繁简转换、简繁转换、异体字转换和地区习惯用词转换（中国大陆、台湾、香港、日本新字体）
// @description:zh-TW 支持繁简转换、简繁转换、异体字转换和地区习惯用词转换（中国大陆、台湾、香港、日本新字体）
// @include	*
// @match	*://*
// @grant	GM_getResourceText
// @grant	GM_getResourceURL
// @grant	GM_registerMenuCommand
// @grant	GM_unregisterMenuCommand
// @run-at	document-end
//
// @require  https://greasyfork.org/scripts/413698-opencc-rust-wasm/code/opencc-rust-wasm.js?version=859508
// @resource opencc_wasm https://cdn.jsdelivr.net/gh/polyproline/opencc-wasm@main/opencc_gc.wasm
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
// @downloadURL https://update.greasyfork.org/scripts/422593/%E4%B8%AD%E6%96%87%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/422593/%E4%B8%AD%E6%96%87%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==
(function () {
	"use strict";

	const ToSimple = [["HKVariantsRevPhrases", "HKVariantsRev"], ["TWPhrasesRev", "TWVariantsRevPhrases", "TWVariantsRev"], ["TSPhrases", "TSCharacters"]];// to Simple Chinese
	const ToTraditional = [["TWVariantsRevPhrases", "TWVariantsRev"], ["HKVariantsRevPhrases", "HKVariantsRev"], ["JPShinjitaiPhrases", "JPShinjitaiCharacters", "JPVariantsRev"], ["STPhrases", "STCharacters"]];
	const ToTaiwan = [["STPhrases", "STCharacters"], "TWVariants", "TWPhrases"];
	const ToHongKong = [["STPhrases", "STCharacters"], "HKVariants"];

	const NODE_DICT = ToSimple;
	const ExcludeTag = new RegExp("SCRIPT|TEXTAREA|META|BASE|NOSCRIPT|OBJECT");
	const ExcludeType = new RegExp("text|search|hidden");
	const Base64 = new RegExp("(?<=base64,).*");

	const start = GM_registerMenuCommand("load", function () {
		GM_unregisterMenuCommand(start);
		const wasm = (function (base64String) {
			const rawData = window.atob(base64String);
			let outputArray = new Uint8Array(rawData.length);
			for (let i = 0; i < rawData.length; ++i) {
				outputArray[i] = rawData.charCodeAt(i);
			}
			return outputArray;
		})(Base64.exec(GM_getResourceURL("opencc_wasm"))[0]);
		init(wasm).then(() => {
			let build = ConverterBuild.new();
			NODE_DICT.forEach(item => {
				if (Array.isArray(item)) {
					item.forEach(function (item) {
						build.adddict(GM_getResourceText(item));
					});
				} else {
					console.assert(typeof item == "string");
					build.adddict(GM_getResourceText(item));
				}
				build.group();
			});
			const converter = build.build();
			function translate(pNode) {
				var childs;
				if (pNode) {
					childs = pNode.childNodes;
				} else {
					childs = document.documentElement.childNodes;
				}
				for (let i = 0; i < childs.length; i++) {
					let child = childs.item(i);
					if (child.tagName && ExcludeTag.test(child.tagName)) continue;
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
						translate(child);
					}
				}
			}
            translate();
			GM_registerMenuCommand("中文转换", translate);
			//setTimeout(translate,5*1000);
			const id = GM_registerMenuCommand("事件监听", function () {
				translate();
				GM_unregisterMenuCommand(id);
				const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
				let observer = new MutationObserver(function (records) {
					records.forEach(function (record) {
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
				observer.observe(document.body, option);
			});
		});
	});
})();