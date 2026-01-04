// ==UserScript==
// @name         cookie_clicker_game_bot
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  clicker bot for coockieclicker game
// @author       iampopovich
// @match        https://orteil.dashnet.org/cookieclicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432148/cookie_clicker_game_bot.user.js
// @updateURL https://update.greasyfork.org/scripts/432148/cookie_clicker_game_bot.meta.js
// ==/UserScript==

const DEFAULT_TIME_STRATEGY = 35000

function cookieWorker() {
	let cookie = null;
	let products = null;
	let timeStrategy = null;
	try {
		timeStrategy = parseInt(window.prompt("Enter period in sec between shop buing\n \
                                     1 sec - agressive\n \
                                     60 sec - passive"))*1000;
	} catch (e){
        console.log(e);
		timeStrategy = DEFAULT_TIME_STRATEGY;
	}
    console.log(timeStrategy);
	let searchForElements = setInterval(function() {
		cookie = document.getElementById('bigCookie');
		products = document.getElementById('products');
		if (cookie && products) {
			clearInterval(searchForElements);
			const event = new MouseEvent('mouseover', {
				'view': window,
				'bubbles': true,
				'cancelable': true
			});
			cookie.dispatchEvent(event);
		}
	}, 10000);

	setInterval(function() {
		cookie.click();
	}, 150);
	setInterval(function() {
		productBuyer(products)
	}, timeStrategy);
}

function buyCursor(chance){
    let cursor = document.getElementById("productName0");
    if(chance >= Math.random()) {
        cursor.click();
        console.log('cursor was bought');
    }
}

function buyGrandma(chance){
    let cursor = document.getElementById("productName1");
    if(chance >= Math.random()) {
        cursor.click();
        console.log('cursor was bought');
    }
}

function buyFarm(chance) {
    let cursor = document.getElementById("productName2");
    if(chance >= Math.random()) {
        cursor.click();
        console.log('cursor was bought');
    }
}

function buyMine(chance) {
    let cursor = document.getElementById("productName3");
    if(chance >= Math.random()) {
        cursor.click();
        console.log('cursor was bought');
    }
}

function buyUpgrades(upgrades) {}

function productBuyer(products) {
    buyCursor(0.15);
    buyGrandma(0.20);
    buyFarm(0.25);
    buyMine(0.30);

    let productList = products.querySelectorAll('div[class~=product]');
	for (let i = productList.length - 1; i >= 4; i--) {
		productList[i].click()
	};
}

cookieWorker();