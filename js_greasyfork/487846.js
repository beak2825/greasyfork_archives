// ==UserScript==
// @name         GauthMath Bypass Paywall
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Bypasses GauthMath paywall to access premium and free answers.
// @author       Viruszy
// @license      MIT
// @match        https://www.gauthmath.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/487846/GauthMath%20Bypass%20Paywall.user.js
// @updateURL https://update.greasyfork.org/scripts/487846/GauthMath%20Bypass%20Paywall.meta.js
// ==/UserScript==

window.addEventListener("load", function() {
	const gauthMathAnalyzer = new URL("https://gauthmath.com/demo/gauthmathdemo.html").searchParams.get("analyze");
	const isGauthMathAnalyzer = gauthMathAnalyzer === 'analyze';
	const gauthMathUrl = isGauthMathAnalyzer ? window.location.href.replace("demo", "") : "https://www.gauthmath.com/demo/index.html";

	const gauthMathPlusUrl = "https://www.gauthmath.com/download/gauthmath.zip";

	const answerButton = document.createElement("button");
	answerButton.innerText = "Get Answer!";
	answerButton.addEventListener("click", function() {
		const gauthmathInput = document.createElement("input");
		gauthmathInput.type = "hidden";
		gauthmathInput.setAttribute("name", "calculation");
		gauthmathInput.value = "2+2";
		document.body.appendChild(gauthmathInput);

		const url = new URL(location.href);
		url.searchParams.set("calculate", "true");
		url.href = url.href + "?" + url.searchParams.toString().replace("calculate=%22true%22", "");
	});
	document.body.appendChild(answerButton);
});