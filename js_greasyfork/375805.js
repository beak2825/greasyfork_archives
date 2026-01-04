// ==UserScript==
// @name         GameFAQs - date reformatter
// @version      0.3
// @namespace    gamefaqs
// @description  Changes the format of the timestamp in the message boards
// @include      https://gamefaqs.gamespot.com/boards/*
// @require      https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.22.2/moment.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/375805/GameFAQs%20-%20date%20reformatter.user.js
// @updateURL https://update.greasyfork.org/scripts/375805/GameFAQs%20-%20date%20reformatter.meta.js
// ==/UserScript==

const existingFormat = "MM/DD/YYYY hh:mm:ss A";
const newFormat = "DD/MM/YYYY HH:mm:ss";

function formatTimes() {
	const dateNodes = document.getElementsByClassName('post_time');	
	for (node of dateNodes) {
		const formattedDate = moment(node.textContent, existingFormat).format(newFormat);
		
		node.textContent = formattedDate;
	}
}

formatTimes();