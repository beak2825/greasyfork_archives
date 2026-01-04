// ==UserScript==
// @name            Myspace Exhausteur
// @namespace       https://myspace.windows93.net/?id=184
// @author          Zeeslag
// @description     enhance your myspace
// @version         0.0.2
// @icon            https://myspace.windows93.net/favicon.png
// @match           https://myspace.windows93.net/*
// @run-at          document-end
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/404958/Myspace%20Exhausteur.user.js
// @updateURL https://update.greasyfork.org/scripts/404958/Myspace%20Exhausteur.meta.js
// ==/UserScript==

if (document.getElementById("hSub")) {
	const header = document.getElementById("hSub")
	header.innerHTML = header.innerHTML + " | <span id='epicactivator' style='color:yellow;cursor:pointer;'>Myspace Exhausteur</span>"
	const epicactivator = document.getElementById("epicactivator");
	epicactivator.addEventListener('click', function() {
		loadthatshit()
		epicactivator.style.display = 'none';
	}, false);
}

function loadthatshit() {
	const url = "https://gist.githubusercontent.com/Z33SL4G/8965fcb18f5ff0ff801d0861b580dba6/raw/exhausteur.js";
	let con = new XMLHttpRequest();
	con.onreadystatechange = function() {
		if (con.readyState === 4) {
			const response = con.response;
			eval(this.response);
		}
	}
	con.onerror = function () {
		console.error("wtf github");
	}
	con.open("GET", url, true);
	con.send(null);
}