// ==UserScript==
// @name Sreality - cena za metr
// @description Přidá k výpisům na srealitách cenu za metr
// @author tkafka
// @version 0.0.18
// @date 2016-05-19
// @namespace cenazametr.sreality.seznam.tomaskafka.com
// @include http://www.sreality.cz/*
// @include https://www.sreality.cz/*
// @match http://www.sreality.cz/*
// @match https://www.sreality.cz/*
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @license MIT License
// @downloadURL https://update.greasyfork.org/scripts/19549/Sreality%20-%20cena%20za%20metr.user.js
// @updateURL https://update.greasyfork.org/scripts/19549/Sreality%20-%20cena%20za%20metr.meta.js
// ==/UserScript==


/*
List:
.dir-property-list
	.property

Detail:
.property-detail
*/

(function (document) {
	var debug = false;
	var addPricesDebounced = debounce(addPrices, 250);

	// https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
	var $layout = document.querySelector('#page-layout');
	addPricesDebounced($layout);

	// create an observer instance
	var observer = new MutationObserver(function (mutations) {
		addPricesDebounced($layout);
	});


	// pass in the target node, as well as the observer options
	observer.observe($layout, {
		// characterData: true,
		// attributes: true, 
		childList: true,
		subtree: true
	});

	// later, you can stop observing
	// observer.disconnect();

	function addPrices($layout) {
		if (window.location.pathname.match(/\/(hledani|detail)\/?/)) {
			var $properties = document.querySelectorAll('.property, .property-detail');
			if ($properties.length > 0) {
				Array.prototype.forEach.call($properties, function ($property, i) {
					addPricesToProperty($property);
				});
			}
		}
	}

	function addPricesToProperty($property) {
		debug && console.log('Computing price for ' + i, $property);

		var $price = $property.querySelector('.price');

		var $pricePerM = $price.querySelector('.price-per-meter');
		var $altPrice = $price.querySelector('.alt-price');
		if ($pricePerM || $altPrice) {
			// already there
			return;
		}

		var nameValueRaw = $property.querySelector('h2 .name, h1 .name').textContent;
		var nameValueNoNbsp = nameValueRaw.trim().replace(/&nbsp;/g, ' ');
		var nameMatches = nameValueNoNbsp.match(/(\s(\d+)\s)?(\d+)\sm²/);
		if (!nameMatches) {
			return;
		}
		var areaThousands = parseInt(nameMatches[2], 10);
		var areaMeters = parseInt(nameMatches[3], 10);
		if (!isNaN(areaThousands)) { areaMeters += 1000 * areaThousands; }

		var $normPrice = $price.querySelector('.norm-price');
		var normPriceValueRaw = $normPrice.textContent;
		var normPriceValue = parseInt(normPriceValueRaw.trim().replace(/(&nbsp;|\s)+/g, ''), 10);

		if (areaMeters === 0 || isNaN(normPriceValue)) { return; }
		var pricePerMeterValue = normPriceValue / areaMeters;
		var pricePerMeterValueStr = ' · ' + formatThousands(roundToMax3ValidNumbers(pricePerMeterValue)) + ' Kč za m²';

		debug && console.log('Price is ', pricePerMeterValueStr);

		// add element
		$pricePerM = document.createElement('span');
		$pricePerM.classList.add('alt-price');
		$pricePerM.classList.add('price-per-meter');
		// pricePerM.style.margin = '0 0 0 1em';
		$pricePerM.style.fontStyle = 'italic';
		var $text = document.createTextNode(pricePerMeterValueStr);
		$pricePerM.appendChild($text);
		$price.appendChild($pricePerM);	
	}

	// https://davidwalsh.name/javascript-debounce-function
	function debounce(func, wait, immediate) {
		var timeout;
		return function () {
			var context = this, args = arguments;
			var later = function () {
				timeout = null;
				if (!immediate) func.apply(context, args);
			};
			var callNow = immediate && !timeout;
			clearTimeout(timeout);
			timeout = setTimeout(later, wait);
			if (callNow) func.apply(context, args);
		};
	}

	function roundToMax3ValidNumbers(n) {
		var roundUnit = Math.pow(10, Math.floor(Math.log10(n)) - 2);
		if (roundUnit < 1) roundUnit = 1;

		return Math.round(n / roundUnit) * roundUnit;
	}

	function formatThousands(n) {
		var rx = /(\d+)(\d{3})/;
		return String(n).replace(/^\d+/, function (w) {
			while (rx.test(w)) {
				w = w.replace(rx, '$1 $2');
			}
			return w;
		});
	}

})(document);
