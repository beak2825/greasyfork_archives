// ==UserScript==
// @name         南+ 預設保存到發件箱中
// @namespace    https://greasyfork.org/scripts/474393
// @version      0.2
// @description  發件時自動勾選保存到發件箱中的選項
// @author       fmnijk
// @match        *://*.east-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://north-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://blue-plus.net/*
// @match        *://*.imoutolove.me/*
// @match        *://imoutolove.me/*
// @icon         https://www.google.com/s2/favicons?domain=south-plus.net
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/474393/%E5%8D%97%2B%20%E9%A0%90%E8%A8%AD%E4%BF%9D%E5%AD%98%E5%88%B0%E7%99%BC%E4%BB%B6%E7%AE%B1%E4%B8%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/474393/%E5%8D%97%2B%20%E9%A0%90%E8%A8%AD%E4%BF%9D%E5%AD%98%E5%88%B0%E7%99%BC%E4%BB%B6%E7%AE%B1%E4%B8%AD.meta.js
// ==/UserScript==

(window.onload = function() {
	'use strict'

    if (!window.location.href.includes('message.php')){
        return false;
    }

	const $ = s => document.querySelector(s);

	function onDomChange(cb) {
		new MutationObserver(() => setTimeout(cb, 50)).observe(document.body, { childList: true });
	}
	function changeCoin() {
        $('#info_base > table > tbody > tr:nth-child(5) > td:nth-child(2) > div:nth-child(3) > input[type=checkbox]').checked = true;
	}
	onDomChange(changeCoin);
    $('#info_base > table > tbody > tr:nth-child(5) > td:nth-child(2) > div:nth-child(3) > input[type=checkbox]').checked = true;

})();
