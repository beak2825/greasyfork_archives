// ==UserScript==
// @name           Virtonomica: кнопка слияния
// @version        1.00
// @namespace      virtonomica_slyanie
// @description    Добавляет кнопку "Слияния" подразделений в старый дизайн
// @include        http*://*virtonomic*.*/*/main/unit/view/*
// @exclude        http*://*virtonomic*.*/*/main/unit/view/*/*
// @downloadURL https://update.greasyfork.org/scripts/40733/Virtonomica%3A%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D1%81%D0%BB%D0%B8%D1%8F%D0%BD%D0%B8%D1%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/40733/Virtonomica%3A%20%D0%BA%D0%BD%D0%BE%D0%BF%D0%BA%D0%B0%20%D1%81%D0%BB%D0%B8%D1%8F%D0%BD%D0%B8%D1%8F.meta.js
// ==/UserScript==

var run = function() {
	var url = location.href;
	url = url.replace('main','window');
	$('.infoblock > tbody > tr > td.control > table > tbody').append('<tr><td><a href="' + url + '/consolidation" onclick="return doWindow(this, 1000, 500);" class="popup">Слияние</a></td></tr>')
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);