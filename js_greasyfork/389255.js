// ==UserScript==
// @name         Curseforge QOL Fixes
// @version      0.27
// @description  Various Quality of Life improvements to the Curseforge website
// @author       comp500
// @namespace    https://infra.link/
// @match        https://www.curseforge.com/*
// @match        https://legacy.curseforge.com/*
// @homepageURL  https://github.com/comp500/Curseforge-Userscripts/
// @supportURL   https://github.com/comp500/Curseforge-Userscripts/issues/
// @source       https://github.com/comp500/Curseforge-Userscripts/
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389255/Curseforge%20QOL%20Fixes.user.js
// @updateURL https://update.greasyfork.org/scripts/389255/Curseforge%20QOL%20Fixes.meta.js
// ==/UserScript==

(function () {
	"use strict";

	// Add a search box
	let searchBoxContainer = document.createElement("div");
	searchBoxContainer.className = "flex mr-4 items-center";
	// Get the current assets path
	let styleSheet = Array.from(document.styleSheets).find((s) => /\/Content\/([\d\-]+)\//.test(s.href));
	let assetsPath = styleSheet == null ? "2-0-7179-35052" : /\/Content\/([\d\-]+)\//.exec(styleSheet.href)[1];
	searchBoxContainer.innerHTML = `<form action="/minecraft/mc-mods/search" method="get" novalidate="novalidate" autocomplete="false" style="width:100%">
	<div class="flex flex-col h-full justify-between">
		 <div class="input input--icon" style="color: #000">
			<i class="search textgray-900 flex items-center justify-center">
				<svg class="icon" viewBox="0 0 20 20" width="16" height="16"><use xlink:href="/Content/${assetsPath}/Skins/CurseForge/images/twitch/Object/Search.svg#Object/Search"></use></svg>
			</i>
			<input type="text" name="search" id="cfqolTopbarSearch" placeholder="Search Mods">
		</div>
	</div></form>`;
	let insertLocation = document.querySelector(".curseforge-header .ml-auto > div");
	if (insertLocation != null && insertLocation.firstChild != null) {
		// @Inject(method = "the navbar", at = @At("HEAD"))
		insertLocation.insertBefore(searchBoxContainer, insertLocation.firstChild);

		// Make the search box magically grow
		let searchBox = searchBoxContainer.querySelector("#cfqolTopbarSearch");
		if (searchBox != null) {
			// Fix stupid flexboxes - set to flex-grow 1 flex-shrink 0
			searchBoxContainer.style.flex = "1 0";
			searchBoxContainer.parentNode.parentNode.style.flex = "1 0";

			let navLinksContainer = document.querySelector(".top-nav__nav-link").parentNode;
			navLinksContainer.style.transition = "opacity 0.4s, max-width 0.3s";
			searchBox.addEventListener("focus", (e) => {
				navLinksContainer.style.opacity = 0;
				navLinksContainer.style.maxWidth = "0";
			});
			searchBox.addEventListener("blur", (e) => {
				navLinksContainer.style.opacity = 1;
				navLinksContainer.style.maxWidth = "2000px";
			});
			// Make the search icon focus the search box
			let searchIcon = searchBoxContainer.querySelector(".search");
			if (searchIcon != null) {
				searchIcon.addEventListener("click", (e) => {
					searchBox.focus();
				});
			}
		}
	}

	// Add an "All Files" tab for all curseforge projects
	let projectPathMatches = /^\/([\w-]+)\/([\w-]+)\/([a-z][\da-z-_]{0,127})/.exec(document.location.pathname);
	let filesTab = document.getElementById("nav-files");
	if (projectPathMatches != null && projectPathMatches.length == 4 && filesTab != null) {
		let gameName = projectPathMatches[1];
		let projectCategory = projectPathMatches[2];
		let projectSlug = projectPathMatches[3];

		let projectAllFiles = document.createElement("li");
		let isAllFilesPage = /\/files\/all$/.test(document.location.pathname);
		if (isAllFilesPage) {
			projectAllFiles.className =
				"border-b-2 border-primary-500 b-list-item p-nav-item px-2 pb-1/10 -mb-1/10 text-gray-500";
			filesTab.className = "b-list-item p-nav-item px-2 pb-1/10 -mb-1/10 text-gray-500";
			filesTab.getElementsByTagName("a")[0].className = "text-gray-500 hover:no-underline";
		} else {
			projectAllFiles.className = "b-list-item p-nav-item px-2 pb-1/10 -mb-1/10 text-gray-500";
		}
		projectAllFiles.innerHTML = `<a href="/${gameName}/${projectCategory}/${projectSlug}/files/all" class="text-${
			isAllFilesPage ? "primary" : "gray"
		}-500 hover:no-underline">
			<span class="b-list-label">
				All Files
			</span>
		</a>`;
		filesTab.parentNode.insertBefore(projectAllFiles, filesTab.nextSibling);
	}

	// Add pagination to the bottom of the page in dependency lists
	let dependenciesPage = document.querySelector(".project-dependencies-page > div");
	if (dependenciesPage != null) {
		let paginationTop = document.querySelector(".project-dependencies-page > div .pagination-top");
		if (paginationTop != null) {
			dependenciesPage.appendChild(paginationTop.parentNode.cloneNode(true)).classList.remove("mb-4");
		}
	}

	// Skip download countdowns
	let downloadScript = Array.from(document.scripts).find(
		(s) => s.innerText != null && s.innerText.includes("PublicProjectDownload.countdown")
	);
	if (downloadScript != null && downloadScript.innerText != null) {
		let matches = downloadScript.innerText.match(/countdown\("(.+)"\)/);
		if (matches != null && matches[1] != null) {
			// Break the existing script
			let countdownEl = document.querySelector("span[data-countdown-seconds]");
			if (countdownEl != null) {
				// UNSAFE if grant != none! For some reason jQuery stores data in itself rather than attrs?!
				jQuery.removeData(countdownEl, "countdown-seconds");
			}

			let downloadText = document.querySelector("p[data-countdown-timer]");
			if (downloadText != null) {
				downloadText.innerText = "Downloading now...";
			}

			window.location.href = matches[1];
		}
	}
	
	/**
	 * Link redirections
	 */

	const linkList = Array.from(document.getElementsByTagName("a"));
	const regexDownloadLink = /^https:\/\/(www|legacy).curseforge.com\/.*\/download\/\d+$/;

	const redirections = [
		// Better method for skipping, if links contain file ID already
		[regexDownloadLink, a => {
			a.href = a.href + "/file";
		}],
		// Change the default Minecraft tab (from other links) to /minecraft/mc-mods
		[/^http:\/\/bit.ly\/2Lzpfsl|https:\/\/(www|legacy).curseforge.com\/minecraft\/?$/, a => {
			a.path = "/minecraft/mc-mods";
		}],
		// Change the default member tab to projects
		[/^https:\/\/(www|legacy).curseforge.com\/members\/[^\/]+\/?$/, a => {
			a.href = a.href + (a.href.endsWith("/") ? "" : "/") + "projects";
		}],
		// Redirect linkout URLs
		[/^https:\/\/(www|legacy).curseforge.com\/linkout/, a => {
			let url = new URL(a.href);
			a.href = decodeURIComponent(url.searchParams.get("remoteUrl"));
		}],
		// Change the default dependency type to "Include" for Minecraft modpacks
		[/^https:\/\/(www|legacy).curseforge.com\/minecraft\/modpacks\/([a-z][\da-z-_]{0,127})\/relations\/dependencies\/?$/, a => {
			a.href = a.href + "?filter-related-dependencies=6";
		}],
		// Change the default dependency type to "Required Dependency"
		[/^https:\/\/(www|legacy).curseforge.com\/([\w-]+)\/([\w-]+)\/([a-z][\da-z-_]{0,127})\/relations\/dependencies\/?$/, a => {
			a.href = a.href + "?filter-related-dependencies=3";
		}],
		// Change the default dependent type to "Required Dependency"
		[/^https:\/\/(www|legacy).curseforge.com\/([\w-]+)\/([\w-]+)\/([a-z][\da-z-_]{0,127})\/relations\/dependents\/?$/, a => {
			a.href = a.href + "?filter-related-dependents=3";
		}]
	];
	
	for (let link of linkList) {
		for (let redir of redirections) {
			if (redir[0].test(link.href)) {
				redir[1](link);
				break;
			}
		}
	}

	/**
	 * Readd download buttons for modpacks
	 */

	// All Files list
	Array.from(document.querySelectorAll("table.listing a.button"))
		.filter(l => l.pathname.startsWith("/minecraft/modpacks") && l.href.endsWith("?client=y"))
		.map(link => {
			let newHref = link.href.slice(0, -9);
			if (regexDownloadLink.test(newHref)) {
				newHref = newHref + "/file";
			}

			let newLink = link.cloneNode(true);
			newLink.href = newHref;
			newLink.classList.add("button--icon-only");
			newLink.classList.add("mr-2");

			newLink.innerHTML = `<span class="button__text">
				<svg class="icon icon-fixed-width icon-margin" viewBox="0 0 20 20" width="18" height="18">
					<use xlink:href="/Content/${assetsPath}/Skins/CurseForge/images/twitch/Action/Download.svg#Action/Download"></use>
				</svg>
			</span>`;

			if (link.parentNode != null) {
				link.parentNode.insertBefore(newLink, link);
			}
		});
	
	// Main File button, Page header button
	Array.from(document.querySelectorAll("article a.button, header a.button"))
		.filter((l) => l.pathname.startsWith("/minecraft/modpacks") && l.href.endsWith("?client=y"))
		.map((link) => {
			let newHref = link.href.slice(0, -9);
			if (regexDownloadLink.test(newHref)) {
				newHref = newHref + "/file";
			}

			if (link.parentNode.parentNode.childElementCount >= 2) {
				// For some reason, direct file pages now have it, but not the main files page?
				return;
			}

			let newButton = link.parentNode.cloneNode(true);
			newButton.classList.remove("ml-2");
			let newLink = newButton.querySelector("a.button");
			newLink.classList.add("button--hollow");
			newLink.href = newHref;

			newLink.innerHTML = `<span class="button__text">
				<svg class="icon icon-margin" viewBox="0 0 20 20" width="18" height="18">
					<use xlink:href="/Content/${assetsPath}/Skins/CurseForge/images/twitch/Action/Download.svg#Action/Download"></use>
				</svg> Download
			</span>`;
			link.parentNode.parentNode.insertBefore(newButton, link.parentNode);
		});

	// Minecraft version-specific files list
	Array.from(document.querySelectorAll(".cf-recentfiles-credits-wrapper"))
		.filter((w) => w.firstChild == null || (w.childNodes.length == 1 && w.firstChild.nodeType != Node.ELEMENT_NODE))
		.forEach((wrapper) => {
			let link = wrapper.parentNode.querySelector("a");

			if (link != null) {
				let newHref = link.href.replace("files", "download");
				if (regexDownloadLink.test(newHref)) {
					newHref = newHref + "/file";
				}
				wrapper.innerHTML = `<a href="${newHref}" class="button button--icon-only button--sidebar">
				<span class="button__text">
					<svg class="icon icon-fixed-width icon-margin" viewBox="0 0 20 20" width="16" height="16"><use xlink:href="/Content/${assetsPath}/Skins/CurseForge/images/twitch/Action/Download.svg#Action/Download"></use></svg>
				</span>
			</a>`;
			}
		});
	
	// Sort file dependency lists
	let sortNodeList = (list, sortBy) => {
		let pairs = Array.from(list).map(el => [el, el.parentNode]);
		pairs.sort((a, b) => sortBy(a[0], b[0]));
		pairs.forEach(pair => pair[1].removeChild(pair[0]));
		pairs.forEach(pair => pair[1].appendChild(pair[0]));
	};

	let relatedProjectsHeading = Array.from(document.querySelectorAll("section > h3")).find(heading => heading.innerText == "Related Projects");
	if (relatedProjectsHeading != undefined) {
		sortNodeList(relatedProjectsHeading.parentNode.querySelectorAll("section > div.flex > div"), (a, b) =>
			a.querySelector("p.font-bold > a").innerText.localeCompare(b.querySelector("p.font-bold > a").innerText));
	}
})();
