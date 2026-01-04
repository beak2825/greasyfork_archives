// ==UserScript==
// @name         Passei Direto Bypass
// @name:pt-BR   Passei Direto Bypass
// @namespace    https://gitlab.com/Dwyriel
// @version      1.4.4
// @description  Changes a few things to remove the paywall card and unblur the answers.
// @description:pt-BR Faz algumas modificações no site para remover a limitação e tirar o borrão do texto.
// @author       Dwyriel
// @license      MIT
// @match        *://*.passeidireto.com/*
// @grant        none
// @run-at       document-idle
// @homepageURL  https://gitlab.com/Dwyriel/Greasyfork-Scripts
// @downloadURL https://update.greasyfork.org/scripts/480840/Passei%20Direto%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/480840/Passei%20Direto%20Bypass.meta.js
// ==/UserScript==

(function () {
	'use strict';
	function importMathJaxLib() {
		var MathJaxScript = document.createElement("script");
		MathJaxScript.setAttribute("type", "text/javascript");
		MathJaxScript.setAttribute("src", "https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js?config=TeX-AMS_CHTML");
		document.getElementsByTagName("head")[0].appendChild(MathJaxScript);
	}
	function perguntaPageFix() {
		for (let freeTrialOverlay of document.querySelectorAll(`[class*="card-paywall"]`))
			freeTrialOverlay.remove();
		let answers = document.querySelectorAll('[data-testid="answer-card"]');
		for (let answer of answers) {
			for (let contentContainer of answer.querySelectorAll('[class*="AnswerCard_answer-content-container"]')) {
				let clonedNode = contentContainer.children[0].cloneNode(true);
				for (let blurredElement of clonedNode.querySelectorAll("[style*='filter: blur']"))
					blurredElement.style = "filter: blur(0px);";
				contentContainer.children[0].after(clonedNode);
				contentContainer.children[0].remove();
			}
		}
		if (document.querySelector(".math-tex") != null)
			importMathJaxLib();
	}
	let handleSmallPage1 = null;
	let handleSmallPage2 = null;
	let handleBigPage1 = null;
	let smallPageRemoveBlurFunc = null;
	function arquivoPageFix() {
		function removeBlur(element) {
			let nodes = element.querySelectorAll("[style*='filter: blur(10px)']");
			for (let node of nodes) {
				let clonedNode = node.cloneNode(true);
				clonedNode.classList.remove("paywall");
				clonedNode.style = "filter: blur(0px)";
				node.after(clonedNode);
				node.remove();
			}
		}
		function arquivoPageFixSmallWidth() {
			smallPageRemoveBlurFunc = () => removeBlur(document);
			removeBlur(document);
			handleSmallPage1 = setTimeout(smallPageRemoveBlurFunc, 100);
			handleSmallPage2 = setTimeout(smallPageRemoveBlurFunc, 1000);
			addEventListener("scroll", smallPageRemoveBlurFunc);
		}
		function arquivoPageFixBigWidth() {
			for (let fileElement of document.querySelectorAll("div[class*='paywall FileContainerHtmlPreviewPage']")) {
				let clonedNode = fileElement.cloneNode(true);
				clonedNode.classList.remove("paywall");
				fileElement.after(clonedNode);
				fileElement.remove();
				removeBlur(clonedNode);
			}
			handleBigPage1 = setTimeout(arquivoPageFixBigWidth, 200);
		}
		if (handleSmallPage1 != null) {
			clearTimeout(handleSmallPage1)
			handleSmallPage1 = null;
		}
		if (handleSmallPage2 != null) {
			clearTimeout(handleSmallPage2)
			handleSmallPage2 = null;
		}
		if (handleBigPage1 != null) {
			clearTimeout(handleBigPage1)
			handleBigPage1 = null;
		}
		if (smallPageRemoveBlurFunc != null) {
			removeEventListener("scroll", smallPageRemoveBlurFunc);
			smallPageRemoveBlurFunc = null;
		}
		document.querySelectorAll("[class*='BannerSelector_banner-container']").forEach(ele => ele.remove());
		if (window.innerWidth <= 1280)
			arquivoPageFixSmallWidth();
		else
			arquivoPageFixBigWidth();
	}
	setTimeout(() => {
		if (window.location.pathname.includes("pergunta"))
			perguntaPageFix();
		if (window.location.pathname.includes("arquivo")) {
			arquivoPageFix();
			addEventListener('resize', arquivoPageFix);
		}
	}, 500);
})();
