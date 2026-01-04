// ==UserScript==
// @name        AskerKaçırıcı
// @author      ScriptAdam
// @namespace   ScriptAdam
// @version     0.5
// @description Dodge attacks
// @include     https://tr*.klanlar.org/game.php?*mode=incomings*subtype=attacks*
// @include     https://tr*.klanlar.org/game.php?*screen=place*
// @include     https://tr*.klanlar.org/game.php?*mode=confirm*
// @icon        https://img.icons8.com/cotton/64/000000/marine-radio.png
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/439685/AskerKa%C3%A7%C4%B1r%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/439685/AskerKa%C3%A7%C4%B1r%C4%B1c%C4%B1.meta.js
// ==/UserScript==

(() => {
	let screen = new URLSearchParams(window.location.search).get("screen");
	let mode = new URLSearchParams(window.location.search).get("mode");
	let confirm = new URLSearchParams(window.location.search).get("try");

	if (mode == "incomings") {
		let dodgeCoord = localStorage.dodgeCoord || "550|524";
		let bar = `
    <span style="float: right">
      <input
        type="text"
        id="dodgeCoord"
        value="${dodgeCoord}"
        style="width: 40px" />
      <a class="btn" id="dodge">${localStorage.dodge == 1 ? dodgeCoord : "Kaçır?"}</a>
    </span>`;
		document.getElementById("incomings_form").insertAdjacentHTML("beforebegin", bar);
		document.getElementById("dodge").addEventListener("click", () => {
			if (localStorage.dodge == 1) {
				localStorage.dodge = 0;
				document.getElementById("dodge").innerText = "Kaçır?";
			}
			else {
				localStorage.dodge = 1;
				localStorage.dodgeStep = 1;
				dodgeCoord = document.getElementById("dodgeCoord").value;
				localStorage.dodgeCoord = dodgeCoord;
				document.getElementById("dodge").innerText = dodgeCoord;
				dIncoming();
			}
		});
		dIncoming();
		function dIncoming() {
			if (localStorage.dodge == 1 && localStorage.dodgeStep == 1) {
				const village = document
					.querySelector("#incomings_table > tbody > tr:nth-of-type(2) > td:nth-of-type(2)")
					.innerHTML.match(/(village=\d+)/)[0];

				const command =
					"https://tr68.klanlar.org/game.php?" +
					village +
					"&screen=place&x=" +
					dodgeCoord.split("|")[0] +
					"&y=" +
					dodgeCoord.split("|")[1];

				const cd = document
					.querySelector("#incomings_table > tbody > tr:nth-of-type(2) > td:nth-of-type(7)")
					.innerText.split(":");
				const mm = parseInt(cd[1]);
				const ss = parseInt(cd[2]) + mm * 60 - 10;
				setTimeout(() => {
					location.replace(command);
				}, 1000 * ss);
			}
		}
	}
	else if (screen == "place" && localStorage.dodge == 1 && localStorage.dodgeStep == 1) {
		localStorage.dodgeStep = 2;
		setTimeout(() => {
			document.getElementById("selectAllUnits").click();
			document.getElementById("target_support").click();
		}, 500);
	}
	else if (confirm == "confirm" && localStorage.dodge == 1 && localStorage.dodgeStep == 2) {
		localStorage.dodgeStep = 3;
		setTimeout(() => {
			document.getElementById("troop_confirm_submit").click();
		}, 500);
	}
	else if (screen == "place" && localStorage.dodge == 1 && localStorage.dodgeStep == 3) {
		setTimeout(() => {
			document.querySelector("tr[class='command-row'] a[class='command-cancel'] img").click();
			localStorage.dodgeStep = 1;
			setTimeout(() => {
				document.querySelector("#incomings_cell > a").click();
			}, 500);
		}, 1000 * 9);
	}
})();
