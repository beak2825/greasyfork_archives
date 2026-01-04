// ==UserScript==
// @name        Solar Assistant add last year totals
// @namespace   Violentmonkey Scripts
// @match       https://*.solar-assistant.io/totals
// @grant       none
// @version     1.0
// @author      tippfehlr
// @license     0BSD
// @description apparently needs a reload
// @downloadURL https://update.greasyfork.org/scripts/539432/Solar%20Assistant%20add%20last%20year%20totals.user.js
// @updateURL https://update.greasyfork.org/scripts/539432/Solar%20Assistant%20add%20last%20year%20totals.meta.js
// ==/UserScript==


function waitForElm(condition, callback, interval = 100) {
	const checkExist = setInterval(() => {
		if (condition()) {
			clearInterval(checkExist);
			callback();
		}
	}, interval);
}


waitForElm(() => document.querySelectorAll('table tbody')[1].children.length === 12, () => {
	table = document.querySelectorAll('table tbody')[1];
	data = [0, 0, 0, 0, 0, 0]

	for (e of table.children) {
		for (let i = 0; i < 6; i++) {
			data[i] += parseFloat(e.children[i + 1].innerText.split(' ')[0]);

		}
	}

	for (let i = 0; i < 6; i++) {
		data[i] = Math.round(data[i])

	}

	table.insertAdjacentHTML("beforeend", `<tr>
		<td class="bold">Total</td>
		<td class="bold">${data[0]} kWh</td>
		<td class="bold">${data[1]} kWh</td>
		<td class="bold">${data[2]} kWh</td>
		<td class="bold">${data[3]} kWh</td>
		<td class="bold">${data[4]} kWh</td>
		<td class="bold">${data[5]} kWh</td>
	</tr>`)
});