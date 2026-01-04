// ==UserScript==
// @name         bnbminers+naticrypto
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  без тормозов
// @author       You
// @match        https://bnbminers.site/earn/*
// @match        https://naticrypto.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bnbminers.site
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/531097/bnbminers%2Bnaticrypto.user.js
// @updateURL https://update.greasyfork.org/scripts/531097/bnbminers%2Bnaticrypto.meta.js
// ==/UserScript==

(function() {
    'use strict';
		console.log(new Date().toLocaleTimeString());
    window.alert = function() {};
    window.confirm = function() {};

    //Do not execute if window is a pop up
    if(window.name){
       // return;
    }

Storage.prototype.setObj = function(key, obj) {
    this.setItem(key, JSON.stringify(obj));
};
Storage.prototype.getObj = function(key) {
    return JSON.parse(this.getItem(key));
};

class WorkerInterval {
  worker = null;
  constructor(callback, interval) {
    const blob = new Blob([`setInterval(() => postMessage(0), ${interval});`]);
    const workerScript = URL.createObjectURL(blob);
    this.worker = new Worker(workerScript);
    this.worker.onmessage = callback;
  }

  stop() {
    this.worker.terminate();
  }
}

var coin = localStorage.getObj('arr');  // Получаем сохраненный ранее массив
if(coin && coin.length==NULL){
coin = ['doge',
 'binance',
 'tron',
 'litecoin',
 'feyorra',
 'ripple',
 'ethereum',
 'bitcoin'];
 localStorage.setObj('arr', coin);
}
if(coin && coin.length==0){
coin = ['doge',
 'binance',
 'tron',
 'litecoin',
 'feyorra',
 'ripple',
 'ethereum',
 'bitcoin'];
 localStorage.setObj('arr', coin);
	window.open('https://blank.page/', '_self', '');
}
console.log(coin);
var time = 180000/coin.length;

if(document.querySelector("#clk > h4")){
    setTimeout(() => {
        if(window.location.href.includes("bnbminers")){
            window.location.href = "https://naticrypto.com/doge";
        }else{
            window.location.href = getLastPart(false);
        }
    }, 1000 * 3);
}
function getLastPart(empty) {
  const parts = window.location.href.replace(/\/$/, '').split('/');
  let res = coin.indexOf(parts.at(-1));
  let url = window.location.href.replace(coin[res], coin[(res+1) % coin.length]);
  if(empty){
	  coin.splice(res, 1);
  }
  localStorage.setObj('arr', coin);// Сохраняем его под подходящим ключом
  return url;
}
    setTimeout(() => {
        console.log(getLastPart(false));
    }, time);

	var email = document.querySelector("#address");
    var emailValue = "15qxbwbQyAKviof6npDZ5mE7YLHN7P2AXz" //yandex
	var login = document.querySelectorAll(`[type="button"]`)[3];
	var verifyCaptcha = document.querySelectorAll(`[type="submit"]`)[0]; //button Claim Now  - reload 1
	var claimLimit = document.querySelector(`[role="alert"]`);
	let confirmInterval = new WorkerInterval(() => {
		window.location.reload();
	}, 1100 * 60 * 3);
			if (claimLimit) if(claimLimit.textContent.includes('faucet does not have') || claimLimit.textContent.includes('come back soon') || claimLimit.textContent.includes('daily claim limit')) {
				confirmInterval.stop();
                window.location.href = getLastPart(true);
				console.log("Здесь пусто!!!");
			}
	if (email && email.value != emailValue) {
		email.value = emailValue;
		login.click();
	}else if (email && email.value === emailValue) {
		login.click();
	}
	var Interval = new WorkerInterval(() => {
	var dataReCaptcha = $("#g-recaptcha-response").val();
		if (dataReCaptcha != "" && dataReCaptcha != undefined) {
			console.log('recaptcha solved');
			verifyCaptcha.click();
            if(document.querySelector("#login"))document.querySelector("#login").click();
			Interval.stop()
		}
	}, 1000)
})();