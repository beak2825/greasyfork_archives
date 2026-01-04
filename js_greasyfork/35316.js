// ==UserScript==
// @name         FIFA 2018 LIVE Tickets Notifier
// @namespace    http://tampermonkey.net/
// @version      1.022
// @description  Этот скрипт работает на странице https://tickets.fifa.com/productList и пока эта страница открыта, при появлении в наличии билетов на любом стадионе, создаёт новую вкладку на YouTube, тем самым оповещая Вас о доступности билетов в продаже.
// @author       bOok1
// @match        https://tickets.fifa.com/*
// @match        https://tickets.fifa.com/productList
// @includes	 https://tickets.fifa.com/productList
// @excludes	 https://tickets.fifa.com/*&lang*
// @run-at 		 document-idle
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35316/FIFA%202018%20LIVE%20Tickets%20Notifier.user.js
// @updateURL https://update.greasyfork.org/scripts/35316/FIFA%202018%20LIVE%20Tickets%20Notifier.meta.js
// ==/UserScript==

var OpenedYTFifa2014sounds = 0;
var NoAlertsYT = 0;
var StaduimPlace = " ";
function myCallbackFIFAtikets() {
		$('div.productBox div.panel-footer').each(function(){
			var bookvar = $(this).attr("class");
			bookvar = bookvar.replace('panel-footer', "");
			bookvar = bookvar.replace(' ', "");
			if((bookvar != 'zeroAvailability') && (NoAlertsYT != 1)){
				
				if (OpenedYTFifa2014sounds != 1) { OpenedYTFifa2014sounds = 1; var YoutubeWinFIFA2014 = window.open('https://www.youtube.com/watch?v=aWaWBGOt2B4', '_blank'); if (YoutubeWinFIFA2014) { YoutubeWinFIFA2018.focus(); } else { alert('Разрешите вспылвающие окна для открытия ссылок Youtube и оповещения тем самым о доступности билетов на матчи.'); OpenedYTFifa2014sounds = 1; } }
				switch(bookvar) {
					case 'lowAvailability':
						console.log('Доступно мало мест'); alert('Доступно мало мест');
					break;
					case 'yellowAvailability':
						console.log('Доступно среднее кол-во мест'); alert('Доступно среднее кол-во мест');
					break;
					case 'greenAvailability':
						console.log('Доступно большое количество мест! Песни пляски УРА!'); alert('Доступно большое количество мест! Песни пляски УРА!');
					break;
				NoAlertsYT = 1;
			   }
			}		// if   div.panel-footer NOT zeroAvailability
		});			// each div.panel-footer
}

var intervalID = window.setInterval(myCallbackFIFAtikets, 5000);