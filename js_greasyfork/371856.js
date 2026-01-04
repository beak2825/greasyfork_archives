// ==UserScript==
// @name        AniDB add-episode button
// @namespace   AquaWolfGuy
// @description Adds a button next to MyList entries and episodes for adding a new episode.
// @icon        https://static.anidb.net/css/icons/touch/apple-touch-icon.png
// @author      AquaWolfGuy
// @copyright   2018, AquaWolfGuy
// @license     GPL-3.0-only
// @match       *://anidb.net/*
// @version     1.0.6
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/371856/AniDB%20add-episode%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/371856/AniDB%20add-episode%20button.meta.js
// ==/UserScript==


/////////////////
// Style sheet //
/////////////////

const style = document.createElement("style");
style.innerHTML = `
	#layout-main div.mylist_all table.animelist > tbody > tr > td.action {
		min-width: 8.5em;
	}
	@media screen and (min-width: 1640px) {
		#layout-main div.mylist_all table.animelist > tbody > tr > td.action {
			min-width: 14.5em;
		}
	}
	#layout-main div.anime_all div.episodes table.eplist td.action.episode {
		min-width: 13.5em;
	}
	.i_file_add::after {
		content: "\\f319";
		font-weight: normal;
	}
`;
document.head.appendChild(style);


////////////
// MyList //
////////////

const animelist = document.getElementById("animelist");
if (animelist !== null && document.body.classList.contains("mylist")) {

	new MutationObserver(preserveMyListButton).observe(animelist.tBodies[0], {childList: true});

	for (const row of animelist.querySelectorAll("#animelist>tbody>tr")) {
		addButtonToMyListEntry(row);
	}

	function addButtonToMyListEntry(row) {
		const aid = row.dataset.anidbAid;
		if (aid === undefined) {
			return;
		}
		const epsCell = row.getElementsByClassName("eps")[0];
		if (epsCell !== undefined) {
			const epsText = epsCell.textContent.trim();
			const epsParsed = /([0-9]+)\/([0-9]+)/.exec(epsText);
			if (epsParsed !== null && epsParsed[1] === epsParsed[2]) {
				return;
			}
		}
		const action = row.getElementsByClassName("action")[0];
		const button = document.createElement("a");
		button.className = "i_icon i_file_add";
		button.title = "add a file for the next episode";
		button.innerHTML = "<span>add file</span>";
		button.addEventListener("click", addFileByAid.bind(null, aid));
		button.addEventListener("auxclick", addFileByAid.bind(null, aid));
		button.addEventListener("mousedown", preventAutoScroll);
		action.appendChild(button);
	}

	function preserveMyListButton(mutationRecords, _mutationObserver) {
		for (const mutationRecord of mutationRecords) {
			for (const node of mutationRecord.addedNodes) {
				if (node instanceof Element && node.tagName === "TR") {
					addButtonToMyListEntry(node);
				}
			}
		}
	}

	function addFileByAid(aid, event) {
		if (!(event.button === 0 || event.button === 1)) {
			return;
		}
		const newTab = event.button === 1 || event.ctrlKey || event.shiftKey;

		const xhr = new XMLHttpRequest();
		xhr.responseType = "document";
		xhr.open("GET", "https://anidb.net/anime/" + aid);
		xhr.addEventListener("load", addFileXhrCallback.bind(null, xhr, newTab));
		xhr.addEventListener("error", xhrErrorCallback.bind(null, xhr));
		xhr.send();

		let loading = document.getElementById("loading");
		if (loading === null) {
			loading = document.createElement("div");
			loading.id = "loading";
			document.body.appendChild(loading);
		}
		loading.classList.add("active");

		event.preventDefault();
	}

	function addFileXhrCallback(xhr, newTab, _event) {
		const loading = document.getElementById("loading");
		if (loading !== null) {
			document.body.removeChild(loading);
		}

		if (xhr.status !== 200) {
			window.alert("Received \u201C" + xhr.status + " " + xhr.statusText + "\u201D response when loading episode list.");
			return;
		}

		let hasEps = false;
		let nextEpRow = null;
		for (const row of [...xhr.response.querySelectorAll("#eplist>tbody>tr")].reverse()) {
			const epNumber = row.getElementsByClassName("eid")[0].textContent.trim();
			if (!("0" <= epNumber[0] && epNumber[0] <= "9")) {
				 continue;
			}
			hasEps = true;
			const isAdded = row.getElementsByClassName("i_general_add").length === 0;
			if (isAdded) {
				break;
			}
			nextEpRow = row;
		}
		if (!hasEps) {
			window.alert("The anime entry does not have any normal episodes.");
			return;
		}
		if (nextEpRow === null) {
			window.alert("The last episode is in your MyList.");
			return;
		}
		const eid = nextEpRow.dataset.anidbEid;
		const uri = "https://anidb.net/file/add/?eid=" + eid;
		if (!newTab || window.open(uri) === null) {
			location.assign(uri);
		}
	}

	function xhrErrorCallback() {
		const loading = document.getElementById("loading");
		if (loading !== null) {
			document.body.removeChild(loading);
		}
		alert("Failed to load episodes list.");
	}

	function preventAutoScroll(event) {
		if (event.button === 1) {
			event.preventDefault();
		}
	}

}


////////////////
// Anime page //
////////////////

const eplist = document.getElementById("eplist");
if (eplist !== null) {

	for (const row of eplist.querySelectorAll("tbody>tr")) {
		addButtonToEpisodeEntry(row);
	}

	function addButtonToEpisodeEntry(row) {
		const eid = row.dataset.anidbEid;
		const action = row.querySelector(".action.episode");
		const button = document.createElement("a");
		button.className = "i_icon i_file_add";
		button.title = "add a new file";
		button.innerHTML = "<span>add new file</span>";
		button.href = "https://anidb.net/file/add/?eid=" + eid;
		action.insertBefore(button, action.firstElementChild);

		new MutationObserver(preserveEpisodeButton.bind(null, row)).observe(action, {childList: true});
	}

	function preserveEpisodeButton(row, mutationRecords, mutationObserver) {
		for (const mutationRecord of mutationRecords) {
			for (const node of mutationRecord.removedNodes) {
				if (node instanceof Element && node.classList.contains("i_file_add")) {
					mutationObserver.disconnect();
					addButtonToEpisodeEntry(row);
					return;
				}
			}
		}
	}

}
