// ==UserScript==
// @name           rocket-league: открываем элементы
// @version        1.00
// @namespace      rocket-league_bez_govna
// @description    Открываем элементы
// @include        http*://rocket-league.com/*
// @require https://code.jquery.com/jquery-3.2.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/37178/rocket-league%3A%20%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC%20%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D1%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/37178/rocket-league%3A%20%D0%BE%D1%82%D0%BA%D1%80%D1%8B%D0%B2%D0%B0%D0%B5%D0%BC%20%D1%8D%D0%BB%D0%B5%D0%BC%D0%B5%D0%BD%D1%82%D1%8B.meta.js
// ==/UserScript==

var run = function() {
	var i = 0;
	
	function display() {
		console.log('display');
		console.log ($('select[style="display: none;"]').length);
		$('select[style="display: none;"]').each(function() {
			$(this).attr('style', '');
			i += 1;
		});
		wait();
	}
	
	function wait() {
		console.log('wait');
		setTimeout(function () {
			if (i === 0) {
				display();
			}
		}, 1000);
	}
	
	wait();
};

// Хак, что бы получить полноценный доступ к DOM >:]
var script = document.createElement("script");
script.textContent = '(' + run.toString() + ')();';
document.documentElement.appendChild(script);