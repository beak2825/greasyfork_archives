// ==UserScript==
// @name         SauceNAO 永遠顯示搜尋結果
// @namespace    https://greasyfork.org/scripts/489460
// @version      1.0
// @description  SauceNAO 永遠顯示搜尋結果 不管相似度如何
// @author       fmnijk
// @match        https://saucenao.com/*
// @icon         https://www.google.com/s2/favicons?domain=saucenao.com
// @grant        none
// @run-at       document-end
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/489460/SauceNAO%20%E6%B0%B8%E9%81%A0%E9%A1%AF%E7%A4%BA%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/489460/SauceNAO%20%E6%B0%B8%E9%81%A0%E9%A1%AF%E7%A4%BA%E6%90%9C%E5%B0%8B%E7%B5%90%E6%9E%9C.meta.js
// ==/UserScript==

(window.onload = function() {
	'use strict'

    if (window.location.href === 'https://saucenao.com/'){
        return false;
    }

	const $ = s => document.querySelector(s);

	function onDomChange(cb) {
		new MutationObserver(() => setTimeout(cb, 50)).observe(document.body, { childList: true });
	}
	function changeCoin() {
        $('#result-hidden-notification').click();
	}
	onDomChange(changeCoin);
    $('#result-hidden-notification').click();

})();
