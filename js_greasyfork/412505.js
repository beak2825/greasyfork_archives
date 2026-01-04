// ==UserScript==
// @name         Patreon - move likes to the likes button
// @namespace    https://greasyfork.org/ru/users/303426-титан
// @version      1.0
// @description  Moves like counter next to like icon
// @author       Титан
// @match        https://www.patreon.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/412505/Patreon%20-%20move%20likes%20to%20the%20likes%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/412505/Patreon%20-%20move%20likes%20to%20the%20likes%20button.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let update_time = 500;
	let disable_optimisation = false
	let page_loaded = true;
	let log = true;
	if (log) console.log("---PATREON: likes next to likes button----: started");


	function update() {
		if ($("div[data-tag=\"post-card\"]").length&&!$("svg[aria-label=\"loading more posts\"]").length) {
			if (!page_loaded) return;
			let postdetails = document.querySelectorAll("div[data-tag=\"post-details\"]");
			if (log) console.log("---PATREON: likes next to likes button----: updated");
			for (let postdetail of postdetails) {
				if (postdetail.getAttribute("likemoved")=="true") continue //skip if processed
				if (postdetail.firstChild.lastChild.previousSibling==null) continue;

				let likecountBlock = postdetail.firstChild.lastChild;
				let likecount = likecountBlock.firstChild.firstChild.innerHTML;
				let likebut = postdetail.firstChild.firstChild.firstChild.firstChild;
				likecount = parseInt(likecount.match(/\d+/));

				likecountBlock.firstChild.firstChild.innerHTML = likecount;
				likecountBlock.firstChild.style = "padding-top: 17px;";
				likebut.style = "width: 13px;";

				likebut.after(likecountBlock);
				postdetail.setAttribute("likemoved","true") //mark as processed
			}
			if (!disable_optimisation) page_loaded = false;
		} else { //if posts haven't been loaded yet
			if (!disable_optimisation) page_loaded = true;
			if (log) console.log("---PATREON: likes next to likes button----: waiting for load");
		}

		return;
	}


	setInterval(update, update_time);
})();