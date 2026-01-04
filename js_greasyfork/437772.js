// ==UserScript==
// @name        Saldırı Hatırlatıcı
// @author      ScriptAdam
// @namespace   ScriptAdam
// @version     0.3
// @description Saldırı varışına 1dk kala uyarı sesi çalar
// @include     https://tr68.klanlar.org/game.php?*&screen=overview_villages&mode=incomings&subtype=attacks
// @icon        https://img.icons8.com/cotton/64/000000/sport-stopwatch.png
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/437772/Sald%C4%B1r%C4%B1%20Hat%C4%B1rlat%C4%B1c%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/437772/Sald%C4%B1r%C4%B1%20Hat%C4%B1rlat%C4%B1c%C4%B1.meta.js
// ==/UserScript==

let bell = `<img src="https://img.icons8.com/cotton/18/000000/sport-stopwatch.png" id="alarm">`;

document.querySelector("#incomings_table > tbody > tr > th:nth-of-type(7)").insertAdjacentHTML("beforeend", bell);
document.getElementById("alarm").addEventListener("click", alarm);

async function alarm() {
	const timer = (ms) => new Promise((res) => setTimeout(res, ms));

	let audio = document.createElement("audio");
	audio.src = "https://soundbible.com/mp3/dixie-horn_daniel-simion.mp3";
	audio.preload = "auto";

	let village = document
		.querySelector("#incomings_table > tbody > tr:nth-of-type(2) > td:nth-of-type(2)")
		.innerHTML.match(/(village=\d+)/)[0];

	let commandUrl = "https://tr68.klanlar.org/game.php?" + village + "&screen=place";

	let command = `<td><a href="${commandUrl}" class="btn" target="_blank" rel="noopener noreferrer">Kaç</a></td>`;

	document.querySelector("#incomings_table > tbody > tr:nth-of-type(2)").insertAdjacentHTML("beforeend", command);

	let cd = document
		.querySelector("#incomings_table > tbody > tr:nth-of-type(2) > td:nth-of-type(7)")
		.innerText.split(":");
	let mm = parseInt(cd[1] - 1);
	let ss = parseInt(cd[2]) + mm * 60;

	await timer(1000 * ss);
	audio.play();
}