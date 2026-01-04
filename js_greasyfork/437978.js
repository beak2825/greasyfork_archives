// ==UserScript==
// @name          arras 
// @namespace     https://tampermonkey.net/
// @version       1.0.2
// @description   Force the use of AMC(Arras.io Modified client)
// @license       MIT
// @icon          https://arras.io/favicon/128x128.png
// @author        PonyoLab
// @match         *://arras.io/*
// @match         *://arras.netlify.app/*
// @grant         GM_info
// @run-at        document-load
// ==/UserScript==

(async () => {

	// 変数宣言
	const SCRIPT = {
		...GM_info.script,
		"name": "AMC"
	};

	// AMC管理クラス
	class ArrasModifiedClientManager extends EventTarget {

		// 初期処理
		constructor() {
			super();
		}

		// スクリプト
		get script() {
			return SCRIPT;
		}

		// 準備完了
		_ready() {
			this.dispatchEvent(new CustomEvent("ready"));
		}

	}
	const amc = new ArrasModifiedClientManager();
	if (unsafeWindow.amc) {
		return;
	}
	unsafeWindow.amc = amc;

	// ページの変更
	async function modifyPage() {
		console.log(`[${SCRIPT.name}]`, "Modifying page...");
		const response = await fetch("https://arras.io");
		const html = (await response.text())
			.replace(/<script src=\"\/bundle.js?.*\"><\/script>/, "");
		window.document.open();
		window.document.write(html);
		window.document.close();
	}

	// クライアントコードの注入
	async function injectClient() {
		console.log(`[${SCRIPT.name}]`, "Injecting client code...");
		const response = await fetch("https://raw.githubusercontent.com/CantRunRiver/Arras-Patched/main/bundle_patched.js");
		const js = await response.text();
		return new Function(js)();
	}

	// 実行
	await modifyPage();
	await injectClient();

	// イベントの発火
	console.log(`[${SCRIPT.name}]`, "Succeeded!");
	amc._ready();

})();