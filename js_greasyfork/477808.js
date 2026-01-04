// ==UserScript==
// @name         Github - Open with VSCode
// @namespace    V@no
// @description  Adds "Open with VSCode" button
// @match        https://github.com/*
// @version      25.6.24-000643
// @license      MIT
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477808/Github%20-%20Open%20with%20VSCode.user.js
// @updateURL https://update.greasyfork.org/scripts/477808/Github%20-%20Open%20with%20VSCode.meta.js
// ==/UserScript==

(() =>
{
	"use strict";
	const fixLink = () =>
	{
		if (document.getElementById("vscode"))
			return;

		const elUL = document.querySelector(`#__primerPortalRoot__ > div > div > div.react-overview-code-button-action-list > div > ul`);
		if (!elUL)
			return true;

		const elLi_DownloadZip = elUL.querySelector(`li:last-child`);
		const elLi_VSCode = elLi_DownloadZip.cloneNode(true);
		elLi_VSCode.id = "vscode";
		elLi_VSCode.classList.add("vscode");
		const elA_VSCode = elLi_VSCode.querySelector("a");
		elA_VSCode.lastChild.firstChild.textContent = "Open with VSCode";
		const elImg_Vscode = document.createElement("img");
		elImg_Vscode.classList.add("icon");
		elImg_Vscode.src = "https://raw.githubusercontent.com/vanowm/userscript_github-open_with_vscode/master/media/vscode.svg";
		const elSvg = elA_VSCode.querySelector("svg");
		elSvg.parentNode.replaceChild(elImg_Vscode, elSvg);

		const cloneURL = (elUL.parentNode.querySelector(`input`) || {}).value
						|| location.origin + location.pathname + ".git";
		elA_VSCode.href = "vscode://vscode.git/clone?url=" + encodeURI(cloneURL);

		elLi_DownloadZip.parentNode.insertBefore(elLi_VSCode, elLi_DownloadZip);

		/* ---------------------------- Visual Studio ---------------------------- */
		const elLiVStudio = elUL.querySelector(`li.${elLi_VSCode.classList.item(0)}:nth-child(2)>button`);
		if (elLiVStudio)
		{
			const elImg_Vstudio = document.createElement("img");
			elImg_Vstudio.classList.add("icon");
			elImg_Vstudio.src = "https://raw.githubusercontent.com/vanowm/userscript_github-open_with_vscode/master/media/vstudio.svg";
			elLiVStudio.prepend(elImg_Vstudio);
		}
	};

	const observer = new MutationObserver(fixLink);
	observer.observe(document, {childList: true, subtree: true});
	fixLink();
})();