// ==UserScript==
// @name         BTCSpinner
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Writen for https://btcspinner.io/invite/749290
// @description  This script will collect your spins each hour and then open a seperate tab and use the spins
// @description  after which it will close the spinner tab and wait for the next refill of spins.
// @description  Donations accepted at
// @description  999Dice.com/?347474487 UserID 347474487
// @description  BTC - 184exgPfRfRXGpkN5qvbt5gdGRZVGwn1TC
// @description  DOGE - D931Dc7QCQqFXxL7M8xWEuGEkBtMzUK57m
// @description  LTC - LPirKgKrQHkhNxeTBztAgJa6sp3P3Bq8Pn
// @description  ETH - 0x04918968b2ee90d5f44b58754328b1fe733a9eaf
// @description  Or sign up at https://crypto.com/app/rcjpdjqdc7 and we both get $25 USD
// @author       Salagrie
// @match        https://btcspinner.io/*
// @icon         https://www.google.com/s2/favicons?domain=btcspinner.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/425836/BTCSpinner.user.js
// @updateURL https://update.greasyfork.org/scripts/425836/BTCSpinner.meta.js
// ==/UserScript==

(function() {
    var looper = 0;
	var spins = parseInt(document.querySelector("#app > main > div > div:nth-child(1) > div > div > div.col-auto.m-0.p-3.text-left.text-info > a > h4").innerText);
	
    function start() {
        if (document.querySelector("#faucet")) {
            document.querySelector("#faucet").click();

        }
        setTimeout(function(){
            start();
        },1000);
    }

    
    function spinner() {
        spins = parseInt(document.querySelector("#app > main > div > div:nth-child(1) > div > div > div.col-auto.m-0.p-3.text-left.text-info > a > h4").innerText);

        if (spins == 0 && window.location.href == "https://btcspinner.io/spinner") {
            setTimeout(function(){
                window.close();
            },20000);
        }
		looper = looper + 1;
		
        if (spins > 0) {
            if (!document.querySelector("#app > main > div > div:nth-child(3) > div.col-lg-6.py-4 > div.game-container.mb-5 > div.row.justify-content-center.text-center.pt-4 > div > button").disabled) {
                document.querySelector("#app > main > div > div:nth-child(3) > div.col-lg-6.py-4 > div.game-container.mb-5 > div.row.justify-content-center.text-center.pt-4 > div > button").click();
				looper = 0;
            }

            if (document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled")) {
                document.querySelector("body > div.swal2-container.swal2-center.swal2-backdrop-show > div > div.swal2-actions > button.swal2-confirm.swal2-styled").click();
				looper = 0;
            }

            if (document.querySelector("#buttons > div > button")) {
                document.querySelector("#buttons > div > button").click();
				looper = 0;
            }

            if (document.querySelector("#swal2-content > div.row.pt-2 > div:nth-child(2) > button")) {
                document.querySelector("#swal2-content > div.row.pt-2 > div:nth-child(2) > button").click();
				looper = 0;
            }
        }

		if (looper > 40 && window.location.href == "https://btcspinner.io/spinner") {
               setTimeout(function() {
                location.reload();
            }, 1000);
            }
        setTimeout(function(){
            spinner();
        },3000);
    }

    if (window.location.href != "https://btcspinner.io/spinner") {
        setTimeout(function(){
            window.open("https://btcspinner.io/spinner");
        },10000);
    }
    setTimeout(function(){
        start();
    },1000);

    setTimeout(function(){
        spinner();
    },10000);

})();