// ==UserScript==
// @name         Nexusmods Allow archive downloads
// @namespace    https://greasyfork.org/ru/users/303426-титан
// @version      1.0.1
// @description  Adds downloads buttons to the mod archive page if they're disabled
// @author       Титан
// @match        https://www.nexusmods.com/*/mods/*?tab=files&category=archived
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nexusmods.com
// @grant        none
// @require      https://greasyfork.org/scripts/21927-arrive-js/code/arrivejs.js?version=198809
// @license      CC BY-NC-SA
// @downloadURL https://update.greasyfork.org/scripts/479389/Nexusmods%20Allow%20archive%20downloads.user.js
// @updateURL https://update.greasyfork.org/scripts/479389/Nexusmods%20Allow%20archive%20downloads.meta.js
// ==/UserScript==

(function() {
	'use strict';

	let options = {
		fireOnAttributesModification: false,
		onceOnly: true,
		existing: true
	}
	document.arrive(".accordionitems", options, function(fileList) {
		let gameId, dataId;
		//let endorsmentLink = document.querySelector("a[title=\"See who endorsed this mod\"]").href;
		gameId = window.current_game_id;
		console.log(gameId);
		for(let data of fileList.querySelectorAll("dt")) {
			dataId = data.getAttribute("data-id");
			data.nextElementSibling.appendChild(CreateDownloadBttons(dataId, gameId));
		}
	});

	function CreateDownloadBttons(dataId, gameId) {
		let donwloadButtons = `
<ul class="accordion-downloads clearfix">
	<li>
		<a class="btn inline-flex popup-btn-ajax" href="/Core/Libs/Common/Widgets/ModRequirementsPopUp?id=${dataId}&amp;game_id=${gameId}&amp;nmm=1">
			<svg title="" class="icon icon-nmm">
				<use xlink:href="https://www.nexusmods.com/assets/images/icons/icons.svg#icon-nmm"></use>
			</svg> <span class="flex-label">Mod manager download</span> </a>
	</li>
	<li> </li>
	<li>
		<a class="btn inline-flex popup-btn-ajax" href="/Core/Libs/Common/Widgets/ModRequirementsPopUp?id=${dataId}&amp;game_id=${gameId}">
			<svg title="" class="icon icon-manual">
				<use xlink:href="https://www.nexusmods.com/assets/images/icons/icons.svg#icon-manual"></use>
			</svg> <span class="flex-label">Manual download</span> </a>
	</li>
</ul>
		`
		let downloadButtonsElement = document.createElement("div");
		downloadButtonsElement.innerHTML = donwloadButtons;
		downloadButtonsElement.classList.add("allow-archive-downloads-wrapper","tabbed-block")
		return downloadButtonsElement;
	}
})();