// ==UserScript==
// @name         OJ.UZ enhancement
// @namespace    ojuzenhancement
// @version      v6
// @description  Enhances OJ.UZ
// @author       EntityPlantt
// @match        https://oj.uz/*
// @icon         http://oj.uz/favicon.ico
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/474544/OJUZ%20enhancement.user.js
// @updateURL https://update.greasyfork.org/scripts/474544/OJUZ%20enhancement.meta.js
// ==/UserScript==
addEventListener("DOMContentLoaded", () => {
	setTheme();
	var style = document.createElement("style");
	style.innerHTML = `
	html.dark, .dark img, .dark iframe, .dark object { filter: invert(1) hue-rotate(180deg) }
	footer, body { background: #e9e9e9 }
	* {
	transition: none !important;
	-webkit-transition: none !important;
	-moz-transition: none !important;
	-o-transition: none !important;
	}
	.navbar { background: #daecda }
	.progressbar {
	background: #eee;
	box-shadow: none;
	height: 30px !important;
    display: grid;
	}
    .progressbar > * {
    grid-row: 1;
    grid-column: 1;
    }
	.progressbar .text {
	color: #333;
    top: 0 !important;
    display: grid-item;
	}
	.progressbar > .bar {
    animation: progressbargradient 2s linear infinite;
    }
	#my-score canvas { animation: myscore_s 10s linear infinite, myscore_r 10s ease infinite; }
	.label {
	text-transform: uppercase;
	color: black !important;
	float: right;
	margin-left: .5em;
	}
	ul.footer-nav li a:hover { color: black !important; }
	footer p { color: #222; }
	@keyframes progressbargradient {
	from { background-position-x: 0% }
	to { background-position-x: 200% }
	}
	@keyframes myscore_s {
	from, to, 50% { scale: 1 }
	25%, 75% { scale: 1.05 }
	}
	@keyframes myscore_r {
	from, to { transform: rotate(-10deg) }
	50% { transform: rotate(10deg) }
	}
	body::-webkit-scrollbar { width: 15px; height: 15px }
	body::-webkit-scrollbar-track { background: #222 }
	body::-webkit-scrollbar-thumb { background: #444; border-radius: 7.5px }
    td { align-items: center; justify-content: space-between; }
	`;
	document.querySelector("head").appendChild(style);
	function setProgressBars() {
		document.querySelectorAll(".progressbar > .bar").forEach(elm => {
			let hue = parseFloat(elm.style.width.substring(0, elm.style.width.length - 1)) * 1.2;
			elm.style.background = `linear-gradient(90deg, hsl(${hue}, 57%, 53%), hsl(${hue}, 83%, 60%), hsl(${hue}, 57%, 53%))`;
			elm.style.backgroundSize = "200%";
		});
		requestAnimationFrame(setProgressBars);
	}
	setProgressBars();
	if (document.getElementById("my-score")) {
		var score = document.getElementById("my-score").parentElement.nextElementSibling.querySelector("td").innerText.split(" / ").map(x => parseInt(x));
		document.querySelector("#my-score canvas").style.filter = `hue-rotate(-${(1 - score[0] / score[1]) * 90}deg)`;
		document.getElementById("my-score").parentElement.style.background = `hsl(${score[0] / score[1] * 90}, 57%, 95%)`;
	}
	let li = document.createElement("li");
	li.className = "divider";
	document.querySelector(".login-bar").prepend(li);
	document.querySelector(".login-bar").prepend(document.createTextNode("\n"));
	li = document.createElement("li");
	li.innerHTML = "<a href='javascript:toggleTheme()'>Toggle theme</a>";
	document.querySelector(".login-bar").prepend(li);
	window.toggleTheme = () => void(localStorage.dark = document.body.parentElement.classList.toggle("dark"));
	addEventListener("storage", setTheme);
	if (Math.random() < .03) document.querySelector(".search-side li:last-child a").innerText = "Spanish";
	document.querySelector(".page-banner").remove();
});
function setTheme() {
	if (localStorage.dark == "true") document.body.parentElement.classList.add("dark");
	else document.body.parentElement.classList.remove("dark");
}
