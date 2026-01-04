// ==UserScript==
// @name               f-droid.org - Supplemental!
// @namespace          a-pav
// @description        Adds more helpful links, such as link to Google Play store and etc. inside the app's page. Adds required Android OS version and last update date of the app to top of its page. Press ' / ' to focus search. And more..
// @match              *://f-droid.org/*
// @version            1.0
// @run-at             document-end
// @author             a-pav
// @grant              none
// @icon               https://f-droid.org/assets/favicon-32x32.png
// @downloadURL https://update.greasyfork.org/scripts/437769/f-droidorg%20-%20Supplemental%21.user.js
// @updateURL https://update.greasyfork.org/scripts/437769/f-droidorg%20-%20Supplemental%21.meta.js
// ==/UserScript==

// Set search input shortcut key
function setSearchShortcut() {
	var searchInput = document.querySelector("div.search-input-wrp>input");
	if (!searchInput) {
		return
	}

	searchInput.setAttribute("title", " press key  /  to search ");
	searchInput.setAttribute("placeholder", " / ");

	window.addEventListener('keyup', function(e) {
		if (e.key === "/") { // or e.which: 191
			searchInput.focus();
		} else if (e.key === "Escape") { // or e.which: 27
			searchInput.blur();
		}
	});
}

// Set Info-Title (i.e. Required OS version, last pakckage update date)
function setInfoTitle() {
	const infoTitleID = "info-title-summary";
	var requiredOS = document.getElementsByClassName("package-version-requirement")[0].innerText.replace(/.*requires /, "");
	var lastUpdated = document.getElementsByClassName("package-version-header")[0].innerText.replace(/.*Added on /, "");

	var style = `
		padding: 10px 0 0px 7px;
		border-left-style: groove;
		font-family: 'Roboto';
		font-weight: bolder;
		cursor: pointer;
	`;
	document.querySelector("div.package-title").innerHTML += `
	  <div id="${infoTitleID}" title="Go to Downloads" class="package-summary" style="${style}">
		// ${requiredOS}
		<br>
		// Update: ${lastUpdated}
	  </div>
	`;

	document.getElementById(infoTitleID).addEventListener('click', function() {
		document.getElementById("latest").scrollIntoView({behavior: "smooth"});
	});
}

// Set additional links
function setAdditionalLinks() {
	var packageID = window.location.pathname.replace(/.*\/packages\//, "").split("/")[0];

	document.querySelector('ul.package-links').innerHTML += `
		<li class="package-link">
		  <a style="font-weight: bold;" href="https://apt.izzysoft.de/fdroid/index/apk/${packageID}?repo=archive">
			Archive
		  </a>
		</li>
		<li class="package-link">
		  <a style="font-weight: bold;" href="https://apt.izzysoft.de/fdroid/index/apk/${packageID}">
			Izzy Repo
		  </a>
		</li>
		<li class="package-link">
		  <a style="font-weight: bold;" href="https://play.google.com/store/apps/details?id=${packageID}">
			Google Play
		  </a>
		</li>
	`;
}

// Colapse permissions summary initially
function collapsePerms() {
	document.getElementById("latest").querySelector(".package-version-permissions>details").removeAttribute("open");
}

(function () {
	setSearchShortcut();
	if (window.location.pathname.includes("/packages/")) {
		// visiting package page, then:
		setInfoTitle();
		setAdditionalLinks();
		collapsePerms();
	}
}());