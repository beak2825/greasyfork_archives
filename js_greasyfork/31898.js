// ==UserScript==
// @name           Бизнесмания: поиск богатых помещений
// @version        1.0
// @author         Agor71
// @description    Поиск помещений с богатством 5 и выше
// @include        http*://bizmania.ru/units/*
// @namespace https://greasyfork.org/users/10556
// @downloadURL https://update.greasyfork.org/scripts/31898/%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%D0%BC%D0%B0%D0%BD%D0%B8%D1%8F%3A%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B1%D0%BE%D0%B3%D0%B0%D1%82%D1%8B%D1%85%20%D0%BF%D0%BE%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/31898/%D0%91%D0%B8%D0%B7%D0%BD%D0%B5%D1%81%D0%BC%D0%B0%D0%BD%D0%B8%D1%8F%3A%20%D0%BF%D0%BE%D0%B8%D1%81%D0%BA%20%D0%B1%D0%BE%D0%B3%D0%B0%D1%82%D1%8B%D1%85%20%D0%BF%D0%BE%D0%BC%D0%B5%D1%89%D0%B5%D0%BD%D0%B8%D0%B9.meta.js
// ==/UserScript==

var run = function() {
    var button5 = $('<button>').append('5+').click( function() {
		$('#areas > tbody > tr > td:nth-child(6) > div > div').each(function() {
            if (this.innerHTML < 5) {
                this.parentNode.parentNode.parentNode.style.display = "none";
            }
        });
        return false;
	});

    var button4 = $('<button>').append('4 ровно').click( function() {
		$('#areas > tbody > tr > td:nth-child(6) > div > div').each(function() {
            if (this.innerHTML != 4) {
                this.parentNode.parentNode.parentNode.style.display = "none";
            }
        });
        return false;
	});
    
    var button3 = $('<button>').append('3 ровно').click( function() {
		$('#areas > tbody > tr > td:nth-child(6) > div > div').each(function() {
            if (this.innerHTML != 3) {
                this.parentNode.parentNode.parentNode.style.display = "none";
            }
        });
        return false;
	});

	$("#content > div > form > table > tbody > tr > td > b:contains('Список')").after(button5).after(button4).after(button3);
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);