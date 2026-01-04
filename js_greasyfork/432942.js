// ==UserScript==
// @name VIRTA::Materials Select Help
// @description Доп. стата при заказе товара
// @namespace virtonomica
// @author SAQOT
// @version 1.0
// @include https://virtonomica.ru/vera/main/unit/view/*/supply*
// @run-at document-idle
// @downloadURL https://update.greasyfork.org/scripts/432942/VIRTA%3A%3AMaterials%20Select%20Help.user.js
// @updateURL https://update.greasyfork.org/scripts/432942/VIRTA%3A%3AMaterials%20Select%20Help.meta.js
// ==/UserScript==

/* global $, unsafeWindow, UnitCreateWizard */

let run = function () {
	let win = (typeof (unsafeWindow) != 'undefined' ? unsafeWindow : top.window);
	$ = win.$;
	
	console.log ('Materials Select Help');
	
	function waitForElement(callback) {
		let time = 0;
		let poops = setInterval(function () {
			
			let el = document.getElementById('materials-modal');
			if (el) {
				if ($(el).is(':visible') === true) {
					clearInterval(poops);
					callback(el);
				}
				
			}
			time += 100;
		}, 100);
	}
	
	waitForElement(initRun);
	
	function initRun(el) {
		const $modal = $(el);
		const urlDataLoaded =  el.getAttribute('data-loaded')
		const m = urlDataLoaded.match(/product_id=(\d+)/);
		const productID = m[1];
		if (!productID) {
			console.error('productID не определен');
			return;
		}
		
		const matches = window.location.href.match(/\/(\w+)\/main\/unit\/view\/(\d+)\/supply/);
		const unitID = matches[2];
		if (!unitID) {
			console.error('unitID не определен');
			return;
		}
		console.log(`unitID ${unitID}`);
		
		// отслеживаем закрытие окна, что бы запустить мониторинг открытия
		$modal.on('click', function (e) {
			//e.preventDefault();
			setTimeout(function () {
				if (!$modal.is(':visible')) {
					waitForElement(initRun);
				}
			}, 1000);
		});
		
		// получить в запросе city_id
		function getCityId(unitID, callback){
			$.ajax({
				async      : true,
				type       : 'GET',
				url        : `https://virtonomica.ru/api/vera/main/unit/view?format=json&id=${unitID}`,
				crossDomain: true,
				xhrFields  : {
					withCredentials: true,
				},
				global     : false,
				dataType   : "json",
				success    : function (res) {
					callback(res['city_id']);
				},
				error      : function (a, b, c) {
					console.error(a, b, c);
				},
			});
		}
		
		// получить в запросе local_market_size (объем рынка)
		function getMarketSize(productID, cityId, callback){
			$.ajax({
				async      : true,
				type       : 'GET',
				url        : `https://virtonomica.ru/api/vera/main/marketing/report/retail/metrics?format=json&product_id=${productID}&geo=0/0/${cityId}`,
				crossDomain: true,
				xhrFields  : {
					withCredentials: true,
				},
				global     : false,
				dataType   : "json",
				success    : function (res) {
					callback(res['local_market_size']);
				},
				error      : function (a, b, c) {
					console.error(a, b, c);
				},
			});
		}
		const $tbody = $(el).find('table tbody');
		
		if (!$tbody.hasClass('modifed-my')) {
			$tbody.addClass('modifed-my');
			
			getCityId(unitID, function( cityId ){
				getMarketSize(productID, cityId, function( marketSize ){
					$tbody.append(`<tr>
						<td><strong>Объем рынка</strong></td>
						<td colspan="3">${marketSize.toLocaleString('ru')}</td>
					</tr>`);
				});
			});
		}

		
	}
	
}

if (window.top === window) {
	let script = document.createElement("script");
	script.textContent = '(' + run.toString() + ')();';
	document.documentElement.appendChild(script);
}