// ==UserScript==
// @name         YouTube Mass Select
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  A simple userscript that adds checkboxes to every YouTube thumbnail. This lets you collect multiple video links at once and either export them as a TXT file.
// @author       bundie
// @match        https://www.youtube.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/498738/YouTube%20Mass%20Select.user.js
// @updateURL https://update.greasyfork.org/scripts/498738/YouTube%20Mass%20Select.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let links = [];
let textBoxShown = false;

const linksTextBoxContainer = document.createElement("div");
const linksTextBoxHandle = document.createElement("div");
const linksTextBox = document.createElement("textarea");
const downloadButton = document.createElement("button");
const getThumbnails = () => Array.from(document.querySelectorAll("div#thumbnail")).concat(Array.from(document.querySelectorAll("ytd-compact-video-renderer"))).concat(Array.from(document.querySelectorAll("ytd-thumbnail")));

// Style for the container
linksTextBoxContainer.style.position = 'fixed';
linksTextBoxContainer.style.bottom = '0';
linksTextBoxContainer.style.right = '0';
linksTextBoxContainer.style.width = '500px';
linksTextBoxContainer.style.height = '700px';
linksTextBoxContainer.style.transition = 'bottom 0.3s';
linksTextBoxContainer.style.zIndex = 4000;
linksTextBoxContainer.style.bottom = '-650px';  // Hide the textbox


// Style for the handle
linksTextBoxHandle.style.padding = '10px';
linksTextBoxHandle.style.backgroundColor = '#007bff';
linksTextBoxHandle.style.color = 'white';
linksTextBoxHandle.style.cursor = 'pointer';
linksTextBoxHandle.style.fontSize = '15px';
linksTextBoxHandle.style.textAlign = 'center';
linksTextBoxHandle.innerText = 'Expand';

// Style for the textarea
linksTextBox.style.width = 'inherit';
linksTextBox.style.height = 'inherit';
linksTextBox.style.display = 'block';

// Style for the download button
downloadButton.innerText = 'Download as Text File';
downloadButton.style.display = 'block';
downloadButton.style.padding = '10px';
downloadButton.style.margin = '10px 0px 10px 0px';
downloadButton.style.width = '100%';

// Render a checkbox on each thumbnail
function renderCheckbox(thumbnail) {
	if (thumbnail.querySelector('input[type="checkbox"]')) return;
	const checkbox = document.createElement("input");
	checkbox.className += 'yt-check';
	checkbox.type = "checkbox";
	checkbox.style.position = 'absolute';
	checkbox.style.zIndex = 300;
	checkbox.style.scale = 2;
	checkbox.onclick = () => { 
		const link = thumbnail.querySelector("a#thumbnail").href;
		if (!checkbox.checked) links = links.filter(x => x !== link);
		else links.push(link);
		linksTextBox.value = links.join("\n");
	};
	thumbnail.insertBefore(checkbox, thumbnail.firstChild);
}

function toggleTextBox() {
	if (textBoxShown) {
		linksTextBoxContainer.style.bottom = '-650px';  // Hide the textbox
		linksTextBoxHandle.innerText = 'Expand';
	} else {
		linksTextBoxContainer.style.bottom = '0';  // Show the textbox
		linksTextBoxHandle.innerText = 'Collapse';
	}
	textBoxShown = !textBoxShown;
}

function downloadTextFile() {
	const text = linksTextBox.value;
	const blob = new Blob([text], { type: 'text/plain' });
	const url = URL.createObjectURL(blob);
	const a = document.createElement('a');
	a.href = url;
	a.download = `links-${new Date().toLocaleString()}.txt`;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}


// Synchronize the links in the textbox with the checked videos
linksTextBox.oninput = () => {
	const links = linksTextBox.value.split("\n");
	// remove checkboxes or add
	getThumbnails().forEach(thumbnail => {
		const href = thumbnail.querySelector("a#thumbnail").href;
		if (!links.includes(href)) thumbnail.querySelector(".yt-check").checked = false;
		if (links.includes(href)) thumbnail.querySelector(".yt-check").checked = true;
	})
}
// Set up the event listener for the handle and download button
linksTextBoxHandle.onclick = toggleTextBox;
downloadButton.onclick = downloadTextFile;

// Append the handle, textarea, and download button to the container
linksTextBoxContainer.append(linksTextBoxHandle, downloadButton, linksTextBox);

// Append the container to the body
document.body.appendChild(linksTextBoxContainer);

// Render checkboxes on all thumbnails
setInterval(() => {
	getThumbnails().forEach(thumbnail => renderCheckbox(thumbnail));
},200)

})();