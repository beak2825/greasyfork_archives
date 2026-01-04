// ==UserScript==
// @name         Tab Renamer
// @namespace    https://mkps.app
// @version      1.0.2
// @description  Allows you to rename tabs
// @tag          utilities
// @author       MK
// @license      MIT
// @match        *://*/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAFWSURBVHgBzZeBkYIwEEWXmyvgSqCEuw6wgrMDr4MrAVKCFagViBWoHVjClmAH+DNGBmOQhCzRP7MTJgn8l2QDgejFymgiVVWVo1ghvk1VjVCo58kBjPkekVtNjJh1IcQBnpg7IUQBPMy7ED/of/6g1yhHVPpCBECPHDE30zqj6wiHtBAB6Ez7Vim1CISIA7DXvGmadQBEHQXQl3CeELpO6YtRu8An27Ms+yvLcuPoyxSzDQO2mguCKOZFFGLeA0GjX8VjzG0IV5tXEsaYQ4zEPPY1Ds5ArDlZax4EMLX5U4AU5r0AqcydACnNHwBSm2vZ27BMae4CmFO4eKz5HQAeUKD4ojBxjPkdAJkTSkpzG6Agf7GEeQtgsj/3vIelzFsAfCx8k48lzVsAfC5/B/qdEUtpc61PUxaONkbs6Hp4POmfCJpANwA9un/EAcuxw4zU0iN9W10AY6HDaH6/FlEAAAAASUVORK5CYII=
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/526580/Tab%20Renamer.user.js
// @updateURL https://update.greasyfork.org/scripts/526580/Tab%20Renamer.meta.js
// ==/UserScript==

(() => {
	"use strict";

	let trueName = null;
	let userSetName = null;
	let skipEventCount = 0;

	function main() {
		GM_registerMenuCommand("Rename tab", renameTab);

		new MutationObserver(() => {
			if (skipEventCount > 0) {
				skipEventCount--;
			} else {
				pageChangedTitle();
			}
		}).observe(
			document.querySelector("title"),
			{subtree: true, characterData: true, childList: true}
		);
	}

	function renameTab() {
		let newName = prompt("Rename this tab", userSetName ?? "");
		resetTabName();
		if (newName) {
			trueName = document.title;
			userSetName = newName;
			changePageTitle(newName);
		}
	}

	function resetTabName() {
		if (trueName) {
			changePageTitle(trueName);
			trueName = null;
			userSetName = null;
		}
	}

	function pageChangedTitle() {
		if (trueName != null) {
			trueName = document.title;
			changePageTitle(userSetName);
		}
	}

	function changePageTitle(title) {
		skipEventCount++;
		document.title = title;
	}

	main();
})();
