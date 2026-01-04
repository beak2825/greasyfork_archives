// ==UserScript==
// @name         Codeforces Friends Online Status
// @namespace    https://github.com/ItsTHEAvro
// @version      0.2
// @description  Show the online status of friends in the friends table
// @author       ItsTHEAvro
// @license      MIT
// @supportURL   https://github.com/ItsTHEAvro/GreasyForkScripts/CodeforcesFriendsOnlineStatus
// @match        https://codeforces.com/friends
// @grant        GM_xmlhttpRequest
// @connect     codeforces.com
// @downloadURL https://update.greasyfork.org/scripts/457325/Codeforces%20Friends%20Online%20Status.user.js
// @updateURL https://update.greasyfork.org/scripts/457325/Codeforces%20Friends%20Online%20Status.meta.js
// ==/UserScript==

// Get the list of friend usernames from the table
let friendsTable = document.querySelectorAll('table')[5];
let headerRow = friendsTable.rows[0];
let friends = [];
for (let row of friendsTable.rows) {
	if (row === headerRow) continue;
	let friend = row.cells[1].innerText; // Get the username from the 6th column of the table
	friends.push(friend);
	let newCell = row.insertCell(-1); // Insert a new cell at the end of the row
	let previousCell = row.cells[row.cells.length - 2];
	let computedStyle = getComputedStyle(previousCell);
	for (let property of computedStyle) {
		newCell.style.setProperty(property, computedStyle.getPropertyValue(property), computedStyle.getPropertyPriority(property));
	}
	newCell.style.borderLeft = '1px solid #e1e1e1';
}

let newHeaderCell = headerRow.insertCell(-1);
newHeaderCell.innerText = 'Last Online';

let previousHeaderCell = headerRow.cells[headerRow.cells.length - 2];
let computedHeaderStyle = getComputedStyle(previousHeaderCell);
for (let property of computedHeaderStyle) {
	newHeaderCell.style.setProperty(property, computedHeaderStyle.getPropertyValue(property), computedHeaderStyle.getPropertyPriority(property));
}
newHeaderCell.style.borderLeft = '1px solid #e1e1e1';

friends.forEach((friend, index) => {
	setTimeout(() => {
		GM_xmlhttpRequest({
			method: 'GET',
			url: `https://codeforces.com/api/user.info?handles=${friend}`,
			onload: function(response) {
				let data;
				try {
					data = JSON.parse(response.responseText);
				} catch (error) {
					console.error('Error parsing JSON data:');
					return;
				}
				let lastOnlineSeconds = data.result[0].lastOnlineTimeSeconds;
				let currentTimeSeconds = Math.floor(Date.now() / 1000);
				let elapsedTimeSeconds = currentTimeSeconds - lastOnlineSeconds;
				let years = Math.floor(elapsedTimeSeconds / 31536000);
				let months = Math.floor((elapsedTimeSeconds % 31536000) / 2592000);
				let weeks = Math.floor((elapsedTimeSeconds % 2592000) / 604800);
				let days = Math.floor((elapsedTimeSeconds % 604800) / 86400);
				let hours = Math.floor((elapsedTimeSeconds % 86400) / 3600);
				let minutes = Math.floor((elapsedTimeSeconds % 3600) / 60);
				let onlineStatus;
				if (years > 0) {
					let yearsText = years === 1 ? 'year' : 'years';
					onlineStatus = `${years} ${yearsText} ago `;
				} else if (months > 0) {
					let monthsText = months === 1 ? 'month' : 'months';
					onlineStatus = `${months} ${monthsText} ago `;
				} else if (weeks > 0) {
					let weeksText = weeks === 1 ? 'week' : 'weeks';
					onlineStatus = `${weeks} ${weeksText} ago `;
				} else if (days > 0) {
					let daysText = days === 1 ? 'day' : 'days';
					onlineStatus = `${days} ${daysText} ago `;
				} else if (hours > 0) {
					let hoursText = hours === 1 ? 'hour' : 'hours';
					let minutesText = minutes === 1 ? 'minute' : 'minutes';
					onlineStatus = `${hours} ${hoursText} and ${minutes} ${minutesText} ago `;
				} else {
					let minutesText = minutes === 1 ? 'minute' : 'minutes';
					onlineStatus = `${minutes} ${minutesText} ago `;
				}

				let row = friendsTable.rows[index + 1];
				let newCell = row.cells[row.cells.length - 1];

				newCell.innerText = onlineStatus;
			}
		});
	}, 1000 * index);
});