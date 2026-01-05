// ==UserScript==
// @name           Victory: аукционы
// @version        1.02
// @namespace      Victory
// @description    Аукционы
// @include        http*://*virtonomic*.*/*/main/auction/view/*
// @downloadURL https://update.greasyfork.org/scripts/29754/Victory%3A%20%D0%B0%D1%83%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/29754/Victory%3A%20%D0%B0%D1%83%D0%BA%D1%86%D0%B8%D0%BE%D0%BD%D1%8B.meta.js
// ==/UserScript==

var run = function() {
    var btnauc = document.createElement('li');
    btnauc.innerHTML = '<a>Нагнуть всех!</a>';
	btnauc.onclick = function() {
			var price = parseInt($('#mainContent > table > tbody > tr > td:nth-child(2) > form > fieldset > table > tbody > tr:nth-child(1) > td:nth-child(2)')[0].childNodes[1].defaultValue);
            var priceMax = 25000000000000;
            if (price < priceMax) {
$("#accept_conditions").prop("checked", true);
                $("input[name*='doit']").click();
                return false;
            }
            else { return false; }
		};
    $("#wrapper > ul > li:nth-child(3)").after(btnauc);
};
			
// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);