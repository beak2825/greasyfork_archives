// ==UserScript==
// @name         ez metal search
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  metal go brr
// @author       wut
// @match        https://steamcommunity.com/tradeoffer/new/*
// @icon         https://www.google.com/s2/favicons?domain=steamcommunity.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/432511/ez%20metal%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/432511/ez%20metal%20search.meta.js
// ==/UserScript==


var dblclick = new MouseEvent('dblclick', {
	'view': window,
	'bubbles': true,
	'cancelable': true
});

document.querySelector('.filter_right_controls').style.marginRight = "-22px"
document.querySelector('.filter_search_box').style.width = "90px";
var refinedButton = document.createElement("button");
refinedButton.style.position = "absolute";
refinedButton.style.width = "25px";
refinedButton.style.height = "25px";
refinedButton.style.marginTop = "-26px";
refinedButton.style.marginLeft = "105px";
refinedButton.style.backgroundImage = "url('https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEbZQsUYhTkhzJWhsO1Mv6NGucF1Ygzt8ZQijJukFMiMrbhYDEwI1yRVKNfD6xorQ3qW3Jr6546DNPuou9IOVK4p4kWJaA/22fx22f')";

refinedButton.addEventListener("click", function() {
    document.querySelector('.filter_search_box').value = "Refined Metal";
    document.querySelector('.filter_search_box').click();
});

document.querySelector('.filter_ctn').appendChild(refinedButton);



var reclaimedButton = document.createElement("button");
reclaimedButton.style.position = "absolute";
reclaimedButton.style.width = "25px";
reclaimedButton.style.height = "25px";
reclaimedButton.style.marginTop = "-26px";
reclaimedButton.style.marginLeft = "133px";
reclaimedButton.style.backgroundImage = "url('https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEbZQsUYhTkhzJWhsO0Mv6NGucF1YJlscMEgDdvxVYsMLPkMmFjI1OSUvMHDPBp9lu0CnVluZQxA9Gwp-hIOVK4sMMNWF4/22fx22f')";

reclaimedButton.addEventListener("click", function() {
    document.querySelector('.filter_search_box').value = "Reclaimed Metal";
    document.querySelector('.filter_search_box').click();
});

document.querySelector('.filter_ctn').appendChild(reclaimedButton);



var scrapButton = document.createElement("button");
scrapButton.style.position = "absolute";
scrapButton.style.width = "25px";
scrapButton.style.height = "25px";
scrapButton.style.marginTop = "-26px";
scrapButton.style.marginLeft = "161px";
scrapButton.style.backgroundImage = "url('https://community.cloudflare.steamstatic.com/economy/image/fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEbZQsUYhTkhzJWhsPZAfOeD-VOn4phtsdQ32ZtxFYoN7PkYmVmIgeaUKNaX_Rjpwy8UHMz6pcxAIfnovUWJ1t9nYFqYw/22fx22f')";

scrapButton.addEventListener("click", function() {
    document.querySelector('.filter_search_box').value = "Scrap Metal";
    document.querySelector('.filter_search_box').click();
});

document.querySelector('.filter_ctn').appendChild(scrapButton);



var valueBox = document.querySelector('.filter_control_ctn').cloneNode(true);
document.querySelector('.filter_ctn').appendChild(valueBox);
valueBox.style.marginTop = "-28px";
valueBox.style.marginLeft = "192px";
document.querySelectorAll('.filter_search_box')[1].style.width = "35px";


document.addEventListener("keydown", function(event) {
	if (event.keyCode === 13) {

		function search(query) {
			document.querySelector('.filter_search_box').value = query;
			document.querySelector('.filter_search_box').click();
		};
		event.preventDefault();
		var searchVal = parseFloat(document.querySelectorAll('.filter_search_box')[1].value)

		var refCount = Math.floor(searchVal / 1);
		console.log("refCount = " + refCount);
		var counter = 1;
		var items = Array.from(document.querySelectorAll('.itemHolder'));
		search("Refined Metal");
		items.forEach(function(item) {
			console.log(item.parentElement.parentElement);
			console.log(item.parentElement.parentElement.getAttribute('style'));
			console.log(item.parentElement.parentElement.getAttribute('style') != "display: none;");
			console.log(item);
			try { if ((item.getAttribute('style') != "display: none;" && item.parentElement.parentElement.getAttribute('style') != "display: none;") && counter <= refCount && item.firstChild.childNodes[1].getAttribute('src').includes("fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEbZQsUYhTkhzJWhsO1Mv6NGucF1Ygzt8ZQijJukFMiMrbhYDEwI1yRVKNfD6xorQ3qW3Jr6546DNPuou9IOVK4p4kWJaA/")) {
				try { if (item.parentElement.parentElement.getAttribute('style').includes("display: none;") != true) {
					console.log("refc");
					item.childNodes[0].dispatchEvent(dblclick);
					counter += 1;
				};
				} catch {
					console.log();
				}
			};
			} catch {
				console.log();
			}
		});
		var countLeft = (searchVal - (counter - 1) * 1).toFixed(2);
		console.log("countLeft = " + countLeft);

		var recCount = Math.floor(countLeft / 0.33);
		console.log("recCount = " + recCount);
		counter = 1;
		search("Reclaimed Metal");
		items.forEach(function(item) {
			try { if ((item.getAttribute('style') != "display: none;" && item.parentElement.parentElement.getAttribute('style') != "display: none;") && counter <= recCount && item.firstChild.childNodes[1].getAttribute('src').includes("fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEbZQsUYhTkhzJWhsO0Mv6NGucF1YJlscMEgDdvxVYsMLPkMmFjI1OSUvMHDPBp9lu0CnVluZQxA9Gwp-hIOVK4sMMNWF4")) {
				try { if (item.parentElement.parentElement.getAttribute('style').includes("display: none;") != true) {
					console.log("recc");
					item.childNodes[0].dispatchEvent(dblclick);
					counter += 1;
				};
				} catch {
					console.log();
				}
			};
			} catch {
				console.log();
			}
		});
		countLeft = (countLeft - (counter - 1) * 0.33).toFixed(2);
		console.log("countLeft = " + countLeft);

		var scrapCount = Math.floor(countLeft / 0.11);
		console.log("scrapCount = " + scrapCount);
		counter = 1;
		search("Scrap Metal");
		items.forEach(function(item) {
			try { if ((item.getAttribute('style') != "display: none;" && item.parentElement.parentElement.getAttribute('style') != "display: none;") && counter <= scrapCount && item.firstChild.childNodes[1].getAttribute('src').includes("fWFc82js0fmoRAP-qOIPu5THSWqfSmTELLqcUywGkijVjZULUrsm1j-9xgEbZQsUYhTkhzJWhsPZAfOeD-VOn4phtsdQ32ZtxFYoN7PkYmVmIgeaUKNaX_Rjpwy8UHMz6pcxAIfnovUWJ1t9nYFqYw")) {
				try { if (item.parentElement.parentElement.getAttribute('style').includes("display: none;") != true) {
					console.log("scrc");
					item.childNodes[0].dispatchEvent(dblclick);
					counter += 1;
				};
				} catch {
					console.log();
				}
			};
			} catch {
				console.log();
			}
		});
		countLeft = (countLeft - (counter - 1) * 0.11).toFixed(2);
		console.log("countLeft = " + countLeft);

		document.querySelectorAll('.filter_search_box')[1].value = countLeft;
		search("");

	};
});

