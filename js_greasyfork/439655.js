// ==UserScript==
// @name         Pegaxy Rent Bot 3
// @namespace    https://greasyfork.org/pt-BR/scripts/439451-pegaxy-rent-bot-3
// @version      0.42
// @description  Bot para tentar alugar cavalos
// @author       LuqDragon
// @match        https://play.pegaxy.io/renting/listing/*
// @icon         https://www.google.com/s2/favicons?domain=pegaxy.io
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439655/Pegaxy%20Rent%20Bot%203.user.js
// @updateURL https://update.greasyfork.org/scripts/439655/Pegaxy%20Rent%20Bot%203.meta.js
// ==/UserScript==

var numBase = 0;
var porcentagemMinima = 1;

function ProximaPagina() {
	window.location.href =
		"https://play.pegaxy.io/renting/listing/" + (numBase + 3);
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
					parseInt(price.slice(0, -1)) < porcentagemMinima ||
					GM_getValue("numBase") != numBase
				) {
					ProximaPagina();
					break;
				} else {
					if (
						!entrou &&
						$(".button-game.pinks") &&
						$(".nav-item.link-my-assets") != null
					) {
						$(".button-game.pinks").click();
						entrou = true;
						$(".btn-close-modal").onclick = function () {
							GM_setValue("numBase", 0);
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
							GM_setValue("numBase", 0);
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
				GM_setValue("numBase", numBase);
				window.location.reload();
				break;
			}
		}
		await sleep(200);
	}
}
