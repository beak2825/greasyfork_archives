// ==UserScript==
// @name         Pegaxy Rent URL
// @namespace    https://greasyfork.org/users/871230-linkzera
// @version      0.1
// @description  Bot para tentar alugar cavalos
// @author       Linkzera
// @match        https://play.pegaxy.io/renting/listing/*
// @icon         https://www.google.com/s2/favicons?domain=pegaxy.io
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439938/Pegaxy%20Rent%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/439938/Pegaxy%20Rent%20URL.meta.js
// ==/UserScript==
 
var numBase = 0;
var porcentagemMinima = 10;
 
function ProximaPagina() {
	window.location.href =
		"https://play.pegaxy.io/renting/listing/" + (numBase + 5);
}
 
window.onload = async function () {
	if (document.readyState == "complete") {
		await sleep(500);
		Main();
	}
};
 
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const $ = (elem) => {
	return document.querySelector(elem);
};
 
async function Main() {
	var entrou = false;
	var rented = false;
	while (true) {
		var url = window.location.href.split("/");
		numBase = parseInt(url[url.length - 1]);
		var xpath = "//*[contains(text(),'Loading')]";
		if (
			document.evaluate(
				xpath,
				document,
				null,
				XPathResult.FIRST_ORDERED_NODE_TYPE,
				null
			).singleNodeValue == null
		) {
			if ($(".viewInfo-bid")) {
				var price = $(".item-bid-info").innerText;
				if (
					price.includes("PGX") ||
					parseInt(price.slice(0, -1)) < porcentagemMinima
				) {
					ProximaPagina();
					break;
				} else {
					if (!entrou && $(".button-game.pinks") && $(".nav-item.link-my-assets") != null) {
						$(".button-game.pinks").click();
						entrou = true;
						$(".btn-close-modal").onclick = function () {
							ProximaPagina();
						};
					}
					if (entrou && $(".modal-body")) {
						var botaoRent =
							$(".alert-button").firstChild.firstChild;
						if (
							!rented &&
							botaoRent.className == "button-game primary"
						) {
							rented = true;
							botaoRent.click();
						}
 
						var modal = $(".viewAlert");
						if (modal && modal.children[3].style.color != "") {
							ProximaPagina();
							break;
						}
					}
					if (!entrou) {
						ProximaPagina();
						break;
					}
				}
			} else {
				window.location.reload();
				break;
			}
		}
		await sleep(200);
	}
}