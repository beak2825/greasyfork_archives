// ==UserScript==
// @name         Pegaxy Rent Bot
// @namespace    https://greasyfork.org/pt-BR/scripts/439451-pegaxy-rent-bot
// @version      0.152
// @description  Bot para tentar alugar cavalos
// @author       LuqDragon
// @match        https://play.pegaxy.io/renting?tab=share-profit
// @icon         https://www.google.com/s2/favicons?domain=pegaxy.io
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/439451/Pegaxy%20Rent%20Bot.user.js
// @updateURL https://update.greasyfork.org/scripts/439451/Pegaxy%20Rent%20Bot.meta.js
// ==/UserScript==

document.porcentagem = 20;
document.tipoEscolha = 20;

var achados = [];
var camposHabilitados = false;
var temModal = false;
var rented = false;
var intervaloMain = setInterval(Main, 200);
var intervaloCampos = setInterval(AdicionarCampos, 200);

function AdicionarCampos() {
	if(document.getElementsByClassName("header-view").length > 0){
		AdicionarHTML();
		AdicionarTriggers();
		PegarValoresDosCookies();
		camposHabilitados = true;
		clearInterval(intervaloCampos);
	}
}

function PegarValoresDosCookies() {
	document.getElementById("porcentagem").value = document.porcentagem =
		parseInt(GM_getValue("porcentagem"));
	document.getElementById("tipoEscolha").value = document.tipoEscolha =
		parseInt(GM_getValue("tipoEscolha"));
}

function AdicionarHTML() {
	var element = document.createElement("template");
	element.innerHTML =
		'<div class="list-filter">' +
		'<button type="button" id="pauseButton" class="btn btn-link">⏸︎</button>' +
		'<span class="check-title">Porcentagem mínima para alugar: </span>' +
		'<input type="text" size="1" id="porcentagem" value="' +
		document.porcentagem +
		'" name="porcentagem">' +
		'<label for="tipoEscolha">Tipo de escolha: </label>' +
		'<select name="tipoEscolha" id="tipoEscolha">' +
		'<option value="-1">Primeiro</option>' +
		'<option value="0">Último</option>' +
		'<option value="1">Aleatório</option>' +
		'<option value="2">Maior porcentagem</option>' +
		"</select>";
	("</div>");
	var header = document.getElementsByClassName("header-view")[0];
	for (let i = element.content.children.length; i > 0; --i)
		header.append(element.content.children[0]);
}

function AdicionarTriggers() {
	document.getElementById("pauseButton").onclick = function () {
		if (this.innerText == "⏸︎") {
			this.innerText = "⏵︎";
			clearInterval(intervaloMain);
		} else {
			this.innerText = "⏸︎";
			intervaloMain = setInterval(Main, 200);
		}
	};
	document.getElementById("porcentagem").onchange = function () {
		GM_setValue("porcentagem", this.value);
		document.porcentagem = parseInt(
			document.getElementById("porcentagem").value
		);
	};
	document.getElementById("tipoEscolha").onchange = function () {
		GM_setValue("tipoEscolha", this.value);
		document.tipoEscolha = parseInt(
			document.getElementById("tipoEscolha").value
		);
	};
}

function IdPorEscolha(escolha, cavalos) {
	switch (escolha) {
		case 0:
			return cavalos.length - 1;
		case 1:
			return NumeroAleatorio(0, cavalos.length - 1);
		case 2:
			GetIdMaiorPorcentagem(cavalos);
		default:
			return 0;
	}
}

function GetIdMaiorPorcentagem(cavalos) {
	var maior = 0;
	var current = 0;
	var id = 0;
	for (var i = 0; i < cavalos.length - 1; ++i) {
		current = parseInt(cavalos[i].innerText.split("%")[0]);
		if (current > maior) {
			maior = current;
			id = i;
		}
	}
	return id;
}

function NumeroAleatorio(min, max) {
	return Math.random() * (max - min) + min;
}

function PegarIdCavalo(cavalo) {
	return cavalo.parentElement.parentElement.parentElement.parentElement.innerText
		.split(" ")[0]
		.substring(1);
}

function ExisteModal() {
	return (
		document.getElementsByClassName(
			"modal-dialog modal-xl modal-dialog-centered"
		).length > 0
	);
}

function Main() {
	temModal = ExisteModal();
	if (!temModal && camposHabilitados) {
        rented = false;
		var resultados = document.getElementsByClassName("button-game primary");
		var filtrados = [];
		for (var i = 0; i < resultados.length; i++)
			if (
				parseInt(resultados[i].innerText.split("%")[0]) >=
				document.porcentagem
			) {
				var id = PegarIdCavalo(resultados[i]);
				if (!achados.includes(id)) {
					filtrados.push(resultados[i]);
					achados.push(id);
				}
			}

		if (filtrados.length > 0)
			filtrados[IdPorEscolha(document.tipoEscolha, filtrados)].click();

		temModal = ExisteModal();
		if (
			!temModal &&
			document.getElementsByClassName("list-check").length > 0
		) {
			var checkboxes =
				document.getElementsByClassName("list-check")[0].children;
			checkboxes[1].click();
			checkboxes[0].click();
		}
	} else if (temModal) {
		if (!rented && document.getElementsByClassName("button-game disabled").length == 0){
			document.getElementsByClassName("alert-button")[0].firstChild.firstChild.click();
            rented = true;
        }

		var modal = document.getElementsByClassName("viewAlert");
		if (modal.length > 0)
			if (modal[0].children[3].style.color != "")
				document.getElementsByClassName("btn-close-modal")[0].click();
	}
}