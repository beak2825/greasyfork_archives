// ==UserScript==
// @name         模之屋投幣1元
// @namespace    https://greasyfork.org/scripts/458281
// @version      1.0
// @description  模之屋投幣從2元改成1元
// @author       fmnijk
// @match        https://www.aplaybox.com/*
// @icon         https://www.google.com/s2/favicons?domain=aplaybox.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/458281/%E6%A8%A1%E4%B9%8B%E5%B1%8B%E6%8A%95%E5%B9%A31%E5%85%83.user.js
// @updateURL https://update.greasyfork.org/scripts/458281/%E6%A8%A1%E4%B9%8B%E5%B1%8B%E6%8A%95%E5%B9%A31%E5%85%83.meta.js
// ==/UserScript==

;(function() {
	'use strict'
	const $ = s => document.querySelector(s)
	const $$ = s => [...document.querySelectorAll(s)]
	function onDomChange(cb) {
		new MutationObserver(() => setTimeout(cb, 50)).observe(document.body, { childList: true })
	}
	function changeCoin() {
		$('#p_main > div > div.el-dialog__wrapper.p_dialog_mds.p_font_md > div > div.el-dialog__body > div > div').click();
	}
	onDomChange(changeCoin)
})()
