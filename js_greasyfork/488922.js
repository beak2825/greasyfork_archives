// ==UserScript==
// @name         Pornolab Thumbnail Enhanced
// @namespace    cdaren
// @version      0.0.2
// @description  View thumbnails of posts beforehand. 
// @author       cdaren
// @match        http://*pornolab.net/*
// @match        https://*pornolab.net/*
// @grant        GM_xmlhttpRequest
// @connect      pornolab.net
// @license			 MIT
//
// @downloadURL https://update.greasyfork.org/scripts/488922/Pornolab%20Thumbnail%20Enhanced.user.js
// @updateURL https://update.greasyfork.org/scripts/488922/Pornolab%20Thumbnail%20Enhanced.meta.js
// ==/UserScript==

// Load the image before trying to obtain the dimensions
async function loadImage(url) {
	let img = new Image();
	img.src = url.replace(/\s/g, '');
	await img.decode();
	return img;
};
// Map image url array to preloaded images array
async function fetchImages(urls) {
	if (!urls)
		return;
	// Images load asynchronously so have to await all of the urls in the array
	let unresolved = urls.map(loadImage);
	let results = await Promise.allSettled(unresolved);

	let errors = results.filter(result => result.status === 'rejected')
		.map(result => result.value);

	if (errors.length)
		console.error(errors);

	results = results.filter(result => result.status === 'fulfilled')
		.map(result => result.value);

	if (!results.length)
		return;

	//console.log(results);
	return results;
}

function xmlGet(url) {
	return new Promise((resolve, reject) => {
			GM_xmlhttpRequest({
			method: "GET",
			url: url,
			onload: (res) => {
			resolve(res.responseText);
			},
			onerror: (err) => {
				reject(err);
			}
		});
	});
}

// Image URL for if thumbnail failed
const errorURL = "https://cdn.pixabay.com/photo/2017/02/12/21/29/false-2061131_960_720.png";

// Async delay
const sleep = (min, max) => new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (max - min + 1) + min)));

(async () => {
	'use strict';
	let table = document.querySelectorAll(".forumline.forum, .forumline.tablesorter")[0];

	let forumNameHeader, topicNameHeader;
	// Second child because fix for odd table
	let tableHead = table.querySelector("tr:first-child > th:nth-child(2)");
	let screenshotHead = Object.assign(document.createElement('th'), {
		className: `{sorter: false}`,
		innerHTML: `<b class="tbs-text">Screenshot</b>`,
	});

	let torrents = Array.from(table.querySelectorAll("tbody > tr"));
	let linkSelect = ".tLink";
	let tdSelect = "td:nth-child(2)";
	// Resize table columns and other page specific things, pretty messy rn
	if (table.id === "t-seed") {
		forumNameHeader = table.querySelector("th[data-resizable-column-id='forum_name']");
		topicNameHeader = table.querySelector("th[data-resizable-column-id='topic_name']");
		forumNameHeader.style = "width: 0.01%;";
		topicNameHeader.style = "width: 30%;";
		screenshotHead.setAttribute('data-resizable-column-id', 'preview_col');
		screenshotHead.style = "width: 30%;";
	} else if (table.id === "tor-tbl") {
		forumNameHeader = table.querySelector("th[width='25%']");
		topicNameHeader = table.querySelector("th[width='75%']");
		forumNameHeader.setAttribute("width", "0.01%");
		topicNameHeader.setAttribute("width", "30%");
		screenshotHead.setAttribute("width", "40%");
	} else if (table.id === "srch-tbl") {
		linkSelect = "a.topictitle";
		forumNameHeader = table.querySelector("col[width='25%']");
		topicNameHeader = table.querySelector("col[width='75%']");
		let screenshotCol = forumNameHeader.cloneNode();

		table.querySelector("colgroup > col:first-child").after(screenshotCol);
		forumNameHeader.setAttribute("width", "0.01%");
		topicNameHeader.setAttribute("width", "30%");
		screenshotCol.setAttribute("width", "40%")
	} else {
		linkSelect = "a.torTopic";
		let tdSelect = "td:first-child";
		topicNameHeader = table.querySelector("col[width='75%']");
		let screenshotCol = topicNameHeader.previousElementSibling;
		topicNameHeader.setAttribute("width", "30%");
		screenshotCol.setAttribute("width", "40%");

		// First few aren't torrent posts
		let torSelector = "td.topic_id > img.topic_icon:not([src='//static.pornolab.net/templates/default/images/folder_announce.gif'], [src='//static.pornolab.net/templates/default/images/folder_announce_new.gif'])";
		let firstTorrent = table.querySelector(torSelector).parentNode.parentNode;
		let index = Array.prototype.indexOf.call(firstTorrent.parentNode.children, firstTorrent);
		torrents = torrents.slice(index);

		// Fixes for odd table
		tableHead = table.querySelector("tr:first-child > th:first-child");
		let emptyHead = document.createElement("th");
		tableHead.before(emptyHead);

		table.querySelectorAll("th[colspan], .topic_id[colspan]").forEach(iconCell => iconCell.removeAttribute("colspan"));
		screenshotHead = Object.assign(document.createElement("th"), {
			innerHTML: "Screenshot",
		});
	}

	tableHead.before(screenshotHead);

	for (const torrent of torrents) {
		// Post link
		let link = torrent.querySelector(linkSelect);

		if (!link)
			continue;

		// Fetch post page
		let res = await xmlGet(link.href);
		let div = document.createElement("div");
		div.innerHTML = res;

		// Table cell for image(s)
		let imgCell = document.createElement("td");

		// Get first 2 post image URLs
		let postImgs = Array.from(div.querySelectorAll("var.postImg"))
										.slice(0, 2)
										.map((postImg) => postImg.title);

		// Fetch loaded images with URLS
		let posters = await fetchImages(postImgs);

		//let posters = postImgs.filter((img) => (img.naturalHeight > 350 || img.naturalWidth > 350) && (img.naturalWidth / img.naturalHeight < 4)); // extra check for banners
		if (!posters) {
			let img = await loadImage(errorURL);
			img.style = "height: 50px;"
			imgCell.append(img);
		} else {
			// If using imgbox, we can't tell whether it's a big or thumbnail image from url,
			// though the requirements for thumbnails are they have to be under 350px on each side.
			// Given that most 'poster' images are well over this, it *seems* pretty reliable (for now).
			posters = posters.filter((img) => (img.naturalHeight > 350 || img.naturalWidth > 350) && (img.naturalWidth / img.naturalHeight < 4));

			let width;
			if (posters && posters.length === 2) {
				width = [];
				let totalWidth = posters[0].naturalWidth + posters[1].naturalWidth;
				width[0] = (100 * (posters[0].naturalWidth / totalWidth));
				width[1] = (100 * (posters[1].naturalWidth / totalWidth));
			}

			posters.forEach((img, i) => {
				if (posters.length === 2) {
					img.style = "width: 100%; border: 5px;";
					img.style = "width: " + width[i] + "%; border: 5px;";
				} else {
					img.style = "width: 100%; border: 5px;";
				}
				// Add to container
				imgCell.append(img);
			});
		}

		// Add to table
		torrent.querySelector(tdSelect).before(imgCell);

		// Slow load images so we don't get IP blocked
		await sleep(250, 400);
	}

})();