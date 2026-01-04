// ==UserScript==
// @name         Chat box exec
// @version      1.0
// @description  Executes apl code inside a chat box textarea!
// @namespace    http://tampermonkey.net/
// @grant        GM_xmlhttpRequest
// @grant        GM_listValues
// @match        https://chat.stackexchange.com/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/419379/Chat%20box%20exec.user.js
// @updateURL https://update.greasyfork.org/scripts/419379/Chat%20box%20exec.meta.js
// ==/UserScript==

window.addEventListener('DOMContentLoaded', (event) => {
	let bContainer = document.getElementById("chat-buttons");
	let tmp = document.createElement("div");
	tmp.innerHTML = "<button id=\"apl-execute\" class=\"button\" accesskey=\"x\">⍎</button>";
	bContainer.appendChild(tmp.firstChild);
	let exButton = document.getElementById("apl-execute");
	exButton.addEventListener('click', function (e) {
		exButton.classList.add("disabled");
		let field = document.getElementById("input");
		let code = field.value.split("\n")[0].trim();
		let output;
		console.log(code);
		let request = new XMLHttpRequest();
		request.open("POST", "https://tryapl.org/Exec", true);
		request.setRequestHeader("Content-Type", "application/json; charset=utf-8")
		request.send(JSON.stringify(["", 0, "", code]));
		request.onreadystatechange = function () {
			if (request.readyState === 4) {
				if (request.status === 200) {
					let result = JSON.parse(request.responseText)[3];
					result.unshift("      " + code);
					field.value = result.map(x => "    " + x).join("\n");
					field.focus();
					exButton.classList.remove("disabled");
				}
			}
		}
	});
});