// ==UserScript==
// @name         Эмулятор обмена 1С - РМС
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Эмулятор
// @author          Grizon
// @copyright       2022, Grizon
// @match        https://rossmed.ru/bitrix/admin/*
// @icon         https://rossmed.ru/favicon.ico?1638514752
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459231/%D0%AD%D0%BC%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D0%BE%D0%B1%D0%BC%D0%B5%D0%BD%D0%B0%201%D0%A1%20-%20%D0%A0%D0%9C%D0%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/459231/%D0%AD%D0%BC%D1%83%D0%BB%D1%8F%D1%82%D0%BE%D1%80%20%D0%BE%D0%B1%D0%BC%D0%B5%D0%BD%D0%B0%201%D0%A1%20-%20%D0%A0%D0%9C%D0%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
	if (document.querySelector("body").innerText.includes("progress")) {
    	setTimeout(function() {
        	location.reload (true);
    	}, 2000);
	}

	if (document.querySelector("body").innerText.includes("success") && window.location.href.includes('import1.xml')) {
    	setTimeout(function() {
			window.location.href = "https://rossmed.ru/bitrix/admin/1c_exchange.php?type=catalog&mode=import&filename=import2.xml";
    	}, 4000);
	}
	if (document.querySelector("body").innerText.includes("success") && window.location.href.includes('import2.xml')) {
    	setTimeout(function() {
			window.location.href = "https://rossmed.ru/bitrix/admin/1c_exchange.php?type=catalog&mode=import&filename=offers1.xml";
    	}, 4000);
	}
    if (document.querySelector("body").innerText.includes("success") && window.location.href.includes('offers1.xml')) {
    	setTimeout(function() {
			window.location.href = "https://rossmed.ru/bitrix/admin/1c_exchange.php?type=catalog&mode=import&filename=offers2.xml";
    	}, 4000);
	}
    if (document.querySelector("body").innerText.includes("success") && window.location.href.includes('offers2.xml')) {
    	setTimeout(function() {
			//document.querySelector("body").innerHTML = 555;
            document.write('<div style="padding: 1rem;border: 1px solid red;max-width: 30%;font-size: large;">Обмен завершен <b style="color: green;">Успешно<b>');
    	}, 4000);
	}
})();