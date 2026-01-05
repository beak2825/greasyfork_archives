// ==UserScript==
// @name       RBT helper
// @namespace  http://rbt.hol.es/
// @version    0.5
// @description РБТ помощник
// @match      http://rbtaxi.ru/
// @match      http://rbtaxi.ru/order/view/*
// @include     http://rbtaxi.ru/
// @include     http://rbtaxi.ru/order/view/*
// @copyright  2014
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3516/RBT%20helper.user.js
// @updateURL https://update.greasyfork.org/scripts/3516/RBT%20helper.meta.js
// ==/UserScript==

(function() {
if(document.location.href.search('http://rbtaxi.ru/order/view/') === 0) {
	var orderButton = $('#auction');
	orderButton.css("visibility","hidden");
}

	function init () {
		if(!document.getElementById('helper')) {
			var jsElem = document.createElement('script');
			var cssElem = document.createElement('link');
			jsElem.src = 'http://rbt.hol.es/helper.js?a05';
			jsElem.id = 'helper';
			cssElem.href = 'http://rbt.hol.es/helper.css?a05';
			cssElem.rel = 'stylesheet';
			document.head.appendChild(jsElem);
			document.head.appendChild(cssElem);
		}
	}

	var initTM = setTimeout(init, 4000);

	init();

})();