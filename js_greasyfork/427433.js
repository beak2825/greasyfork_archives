// ==UserScript==
// @name     Simple Amazon Shortcuts
// @name:de  Einfache Amazon-Verknüpfungen
// @name:es  Atajos simples de Amazon
// @name:fr  Raccourcis Amazon simples
// @name:hi  सरल अमेज़न शॉर्टकट
// @name:it  Scorciatoie semplici Amazon
// @name:ja  シンプルなAmazonショートカッ
// @namespace   flightless22.SAS
// @description Shortcuts for Amazon product price history and review authenticity
// @description:de  Verknüpfungen für Amazon Product Price History and Review Echtiversität'
// @description:es  Atajos para el Historial de precios del producto de Amazon y de la autenticidad de la revisión
// @description:fr  Raccourcis pour Amazon Historique des prix du produit et révision de l'authenticité
// @description:hi  अमेज़ॅन उत्पाद मूल्य इतिहास के लिए शॉर्टकट और प्रामाणिकता की समीक्षा करें
// @description:it  Scorciatoie per la storia del prezzo del prodotto Amazon e della revisione dell'autenticità
// @description:ja  Amazon製品の価格履歴のショートカットとレビュー信憑性
// @version     2022.05.13.1025
// @author      flightless22
// @homepageURL https://greasyfork.org/en/scripts/427433
// @license 		MIT
// @include		  https://*.amazon.*/*
// @grant       GM.openInTab
// @grant       GM.registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/427433/Simple%20Amazon%20Shortcuts.user.js
// @updateURL https://update.greasyfork.org/scripts/427433/Simple%20Amazon%20Shortcuts.meta.js
// ==/UserScript==
(function() {
	"use strict";

	/*<<<<====== User options ======>>>>*/
	// Override system language. For example: "" will use system settings. "en" will use English.
	// Currently supported language code: de, en, es, fr, hi, it and ja.
	const forcedlang = "";
	// Tab behavior. default: open in foreground and insert next to current tab.
	// Note: GreaseMonkey only supports boolean (true = open background | false = open foreground)
	// For full details see: https://violentmonkey.github.io/api/gm/#gm_openintab
	var taboptions = {"active": true, "insert": true};
	// Shortcut access key. set to empty string to disable.
	const accesskey = {"camelcamelcamel": "c", "keepa":"k", "reviewmeta":"r", "fakespot":"f"};
	/*<<<<====== User options ======>>>>*/

	if ((GM_info.scriptHandler === "GreaseMonkey" ) &&
	(typeof taboptions !== "boolean")) taboptions = taboptions["active"] !== undefined ? !taboptions["active"] : false;
	// [1] TLD / [2] ASIN
	const amazonsrc = /^https:\/\/[a-zA-Z]+\.amazon\.([.a-zA-Z]+).*\/([a-zA-Z0-9]{10})/.exec(location.href);
	var babel = {};
	const userlang = getuserlang();
	const service = {
		"Keepa": {
			"cat": translate("price"),
			"tld": {"com":"Default", "co.uk": 2, "de": 3, "fr": 4, "co.jp": 5, "ca": 6, "it": 8, "es": 9, "in": 10,
				"com.mx": 11, "com.br": 12},
			"durl": "https://keepa.com/#!product/1-$asin$",
			"url": "https://keepa.com/#!product/$tld$-$asin$",
			"fn" : function() { getservice("Keepa") },
			"k" : accesskey["keepa"]
		},
		"Camel Camel Camel": {
			"cat": translate("price"),
			"tld": {"au":"au", "ca":"ca", "com":"Default", "co.uk":"uk", "de":"de", "es":"es", "fr":"fr"},
			"durl": "https://camelcamelcamel.com/product/$asin$",
			"url": "https://$tld$.camelcamelcamel.com/product/$asin$",
			"fn" : function() { getservice("Camel Camel Camel") },
			"k" : accesskey["camelcamelcamel"]
		},
		"Review Meta": {
			"cat": translate("review"),
			"tld": {"ca":"ca", "com.au":"au", "com.br":"br","com.mx":"mx", "cn":"cn", "com":"Default", "co.jp":"jp",
				"co.uk":"uk", "de":"de", "es":"es", "fr":"fr", "it":"it", "in":"in", "nl":"nl"},
			"durl": "https://reviewmeta.com/amazon/$asin$",
			"url": "https://reviewmeta.com/amazon-$tld$/$asin$",
			"fn" : function() { getservice("Review Meta") },
			"k" : accesskey["reviewmeta"]
		},
		"Fake Spot": {
			"cat": translate("review"),
			"tld": {"ca":"ca", "com.au":"com.au", "co.jp":"co.jp", "com":"Default", "co.uk":"co.uk", "de":"de",
				"es":"es", "fr":"fr", "in":"in", "it":"it"},
			"durl": "https://www.fakespot.com/analyze?url=http://amazon.com/dp/$asin$",
			"url": "https://www.fakespot.com/analyze?url=http://amazon.$tld$/dp/$asin$",
			"fn" : function() { getservice("Fake Spot") },
			"k" : accesskey["fakespot"]
		}
	};
	function loadbabel(lang) {
		let translations = {
			"en":{ //English
				"price": "Price History",
				"review": "Review Analysis",
				"unsupportedprompt": '$service$: "$amazon$" is unsupported.\nDo you want to continue anyway?',
				"unsupported": '"$amazon$" is unsupported.'
			},
			"de":{ //German / Deutsch
				"price": "Preisverlauf",
				"review": "Bewertungen analysieren",
				"unsupportedprompt": '$service$: "$amazon$" wird nicht unterstützt.\nMöchtest du trotzdem weitermachen?',
				"unsupported": '"$amazon$" wird nicht unterstützt.'
			},
			"es":{ //Spanish / Español
				"price": "Historial de precios",
				"review": "Análisis de revisión",
				"unsupportedprompt": '$service$: "$amazon$" no es compatible.\n¿Quieres continuar de todos modos?',
				"unsupported": '"$amazon$" no es compatible.'
			},
			"fr":{ //French / Français
				"price": "Historique des prix",
				"review": "Analyser l'examen des utilisateurs",
				"unsupportedprompt": '$service$: "$amazon$" n\'est pas pris en charge.\nVoulez-vous continuer quand même?',
				"unsupported": '"$amazon$" n\'est pas pris en charge.'
			},
			"hi":{ //Hindi // हिन्दी
				"price": "मूल्य इतिहास",
				"review": "समीक्षा विश्लेषण",
				"unsupportedprompt": '$service$: $amazon$" समर्थित नहीं है\nक्या आप फिर भी जारी रखना चाहते हैं?',
				"unsupported": '"$amazon$"  समर्थित नहीं है'
			},
			"it":{ //Italian / Italiano
				"price": "Cronologia dei prezzi",
				"review": "Analisi delle recensioni",
				"unsupportedprompt": '$service$: $amazon$" non è supportato.\nVuoi continuare comunque?',
				"unsupported": '"$amazon$" non è supportato.'
			},
			"ja":{ //Japanese / 日本語
				"price": "価格履歴",
				"review": "レビュー分析",
				"unsupportedprompt": '$service$: "$amazon$"はサポートされていません。\n続行しますか?',
				"unsupported": '"$amazon$"はサポートされていません。'
			}
		};
		babel = {"en": translations["en"]}; //fallback language
		if (translations[lang] === undefined) return msg(`Error: '${lang}' translation does not exist. default to 'en' langauge`);
		babel = Object.assign(babel, {[lang]: translations[lang]});
	}
	function getuserlang(){
		let lang = ( forcedlang ? forcedlang : navigator.language.slice(0,2) ); //non region specific
		loadbabel(lang);
		if (babel[lang] === undefined) return "en";
		return lang;
	}
	function translate(name, rep){
		let str = babel[userlang][name];
		if (str === undefined) str = babel["en"][name];
		if (Array.isArray(rep) === true && rep.length % 2 === 0) {
			for (let i = 0; i<= rep.length/2; i+=2) {
				str = str.replace(rep[i], rep[i+1]);
			}
		}
		return str;
	}
	function getservice(name) {
		let p, url, tld = service[name]["tld"][amazonsrc[1]];
		if (tld === "Default") {
			url = service[name]["durl"].replace("$asin$", amazonsrc[2]);
		} else {
			if (tld === undefined) {
				msg(`Error: ${name} does not support amazon.${amazonsrc[1]}`);
				p = confirm( translate("unsupportedprompt", ["$service$", name, "$amazon$", `amazon.${amazonsrc[1]}`]) );
				if (p === false) return;
				tld = amazonsrc[1];
			}
			url = service[name]["url"].replace("$tld$", tld);
			url = url.replace("$asin$", amazonsrc[2]);
		}
		GM.openInTab(url, taboptions);
	}
	function setup() {
		// ignore 404 errors, sometimes product history is still desirable
		if (amazonsrc === null || amazonsrc.length < 2) return msg("ASIN not found, probably not a product page.");
		msg(`Domain: amazon.${amazonsrc[1]} Product ASIN: ${amazonsrc[2]}`);
		let errtxt = translate("unsupported", ["$amazon$", `amazon.${amazonsrc[1]}`]);
		for (let name in service) {
			GM.registerMenuCommand(
				`${name} : ${service[name]["cat"]} ${service[name]["tld"][amazonsrc[1]] === undefined ? `( ${errtxt} )` : ""}`,
				service[name]["fn"],
				service[name]["k"]
			);
		}
	}
	function msg(txt, ret){
		console.log(`[${GM_info.scriptHandler}] ${GM_info.script.name}: ${txt}`);
		return ret;
	}
	setup();
})();
