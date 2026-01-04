// ==UserScript==
// @name         manaba_exam_helper
// @namespace    http://tampermonkey.net/
// @version      2025-11-28
// @description  manaba の小テストのドロップダウンリストの表示に選択肢を追加します。
// @author       Not_Leonian
// @match        https://manaba.tsukuba.ac.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tsukuba.ac.jp
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/493151/manaba_exam_helper.user.js
// @updateURL https://update.greasyfork.org/scripts/493151/manaba_exam_helper.meta.js
// ==/UserScript==

(() => {
	"use strict";

	// Your code here...
	const selects = document.querySelectorAll("select");

	selects.forEach((select) => {
		const listId = select.name;
		const list = document.getElementById(listId);
		const lis = list.querySelectorAll("li");
		const options = select.querySelectorAll("option");

		options.forEach((option) => {
			if (
				option.textContent[0].charCodeAt(0) >= "a".charCodeAt(0) &&
				option.textContent[0].charCodeAt(0) <= "z".charCodeAt(0)
			) {
				const listInner =
					lis[option.textContent[0].charCodeAt(0) - "a".charCodeAt(0)];
				const contents = listInner.querySelectorAll("*");

				if (listInner.textContent) {
					option.textContent += " ";
					option.textContent += listInner.textContent
						.replace(/(\s|&nbsp;)*\\\((\s|&nbsp;)*/g, "")
						.replace(/(\s|&nbsp;)*\\\)(\s|&nbsp;)*/g, "")
						.replace(/^(\s|&nbsp;)+/gm, "")
						.replace(/(\s|&nbsp;)+$/gm, "");
				} else {
					let inserted = false;
					contents.forEach((content) => {
						if (!inserted && content.textContent) {
							option.textContent += " ";
							option.textContent += content.textContent
								.replace(/(\s|&nbsp;)*\\\((\s|&nbsp;)*/g, "")
								.replace(/(\s|&nbsp;)*\\\)(\s|&nbsp;)*/g, "")
								.replace(/^(\s|&nbsp;)+/gm, "")
								.replace(/(\s|&nbsp;)+$/gm, "");
							inserted = true;
						}
					});
				}
			}
		});
	});
})();
