// ==UserScript==
// @name         Fetch Download Links on FreeSound.org
// @namespace    Violentmonkey Scripts
// @version      1.0.1
// @description  Adds download links on freesound.org. Works with a button press, or automatically.
// @author       Jupiter Liar
// @license      CC BY
// @match        https://freesound.org/*
// @description  4/23/2024, 10:30:00 AM
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/493239/Fetch%20Download%20Links%20on%20FreeSoundorg.user.js
// @updateURL https://update.greasyfork.org/scripts/493239/Fetch%20Download%20Links%20on%20FreeSoundorg.meta.js
// ==/UserScript==

// Function to handle grabbing HTML from linked page and replacing Grab button
function grabHtmlAndReplaceButton(button) {
	button.textContent = "Fetching...";
	// Find the parent search result element
	const searchResult = button.closest('.bw-search__result');

	// Find the first <a> element within the search result if available
	var link;
	if (searchResult) {
		link = searchResult.querySelector('a');
	} else {
		// If searchResult is not found, traverse up the DOM tree until we find an ancestor containing .bw-player
		var ancestor = button.parentElement;
		while (ancestor && !(ancestor.querySelector('.bw-player') && ancestor.querySelector('a'))) {
			ancestor = ancestor.parentElement;
		}
		// Once we find the ancestor containing .bw-player, find the first <a> element within it
		if (ancestor) {
			link = ancestor.querySelector('a');
		}
	}

	// Check if a link is found
	if (link) {
		// Fetch the linked page
		fetch(link.href)
			.then(response => response.text())
			.then(html => {
				// Create a temporary element to hold the fetched HTML
				const tempElement = document.createElement('div');
				tempElement.innerHTML = html;
				// Find the element with class "sound-download-button"
				const soundDownloadButton = tempElement.querySelector('.sound-download-button');
				const sidebarDownloadButton = tempElement.querySelector('.bw-sound__sidebar .btn-primary');
				// Replace the Grab button with the sound-download-button element
				if (soundDownloadButton) {
					// Replace the Grab button with the sound-download-button element
					button.parentNode.replaceChild(soundDownloadButton, button);
				} else if (sidebarDownloadButton) {
					button.parentNode.replaceChild(sidebarDownloadButton, button);
				} else {
					console.log('No download button found on the linked page');
					// Update the button text content if no download button is found
					button.innerText = "No button found";
				}
			})
			.catch(error => {
				console.error('Error fetching linked page:', error);
				button.textContent = "Error fetching page";
			});
	} else {
		console.log('No link found in search result');
	}
}

// Function to create and append grab buttons
function createGrabButtons(parentElement, grabMode, additionalClass) {
	// If grabMode is true, insert grab buttons
	if (grabMode) {
		const grabberDiv = document.createElement('div');
		grabberDiv.classList.add('grabber');
		if (additionalClass) {
			grabberDiv.classList.add(additionalClass); // Add additional class if it exists
		}
		// grabberDiv.classList.add('in-row'); // Add in-row class
		// Create the Grab button
		const grabButton = document.createElement('button');
		grabButton.classList.add('grab-button');
		grabButton.textContent = 'Get download button';

		// Add event listener to the Grab button
		grabButton.addEventListener('click', function () {
			grabHtmlAndReplaceButton(this);
		});

		// Append the Grab button to the grabber div
		grabberDiv.appendChild(grabButton);

		// Append the grabber div to the parent element
		if (parentElement.classList.contains('bw-search__result')) {
			// If parentElement has class bw-search__result, append the grabberDiv as the second to last element
			const lastChild = parentElement.lastElementChild;
			parentElement.insertBefore(grabberDiv, lastChild);
		} else {
			// Else, appendChild normally
			parentElement.appendChild(grabberDiv);
		}
	}
}

function createInsertAllButton(topLevelElement) {
	// Create the container for "Insert all download buttons" button
	const insertAllContainer = document.createElement('div');
	insertAllContainer.classList.add('show-all-download-buttons');

	// Create the "Insert all download buttons" button
	const insertAllButton = document.createElement('button');
	insertAllButton.classList.add('btn-primary', 'w-100', 'insert-all-download-buttons');
	insertAllButton.textContent = 'Insert all download buttons';

	// Add event listener to the "Insert all download buttons" button
	insertAllButton.addEventListener('click', function () {
		clickAllGrabButtons();
	});

	// Append the button to the container
	insertAllContainer.appendChild(insertAllButton);

	// Insert the container before the very first search result
	topLevelElement.parentNode.insertBefore(insertAllContainer, topLevelElement);

	// Create the div for auto-insert option
	const autoInsertDiv = document.createElement('div');
	autoInsertDiv.classList.add('auto-insert-div');

	// Create the checkbox for auto-insert option
	const autoInsertCheckbox = document.createElement('input');
	autoInsertCheckbox.type = 'checkbox';
	autoInsertCheckbox.checked = localStorage.getItem('autoInsertCheckbox') === 'true'; // Check local storage for value

	// Add event listener to the auto-insert checkbox
	autoInsertCheckbox.addEventListener('change', handleAutoInsertChange);

	// Create the span for auto-insert option
	const autoInsertSpan = document.createElement('span');
	autoInsertSpan.textContent = 'Do this automatically';

	// Append checkbox and span to auto-insert div
	autoInsertDiv.appendChild(autoInsertCheckbox);
	autoInsertDiv.appendChild(autoInsertSpan);

	// Append auto-insert div to show-all-download-buttons container
	insertAllContainer.appendChild(autoInsertDiv);

	// Check if the checkbox is checked
	if (autoInsertCheckbox.checked) {
		clickAllGrabButtons();
	}
}


// Check if the current URL includes freesound.org/search
if (window.location.href.includes("freesound.org/search")) {
	console.log('URL matched: freesound.org/search');

	// Find all instances of '.bw-search__result' within the 'main' element
	const searchResults = document.querySelectorAll('main .bw-search__result');

	// Loop through each search result
	searchResults.forEach(result => {
		// Find the first <a> element within the search result
		const firstLink = result.querySelector('a');

		// Check if a <a> element is found
		if (firstLink) {
			// Print the href attribute of the first <a> element to the console
			console.log('First link href:', firstLink.href);

			// If grabMode is true, insert a new div at the end of the search result
			createGrabButtons(result, true, '');
		} else {
			console.log('No link found in search result');
		}
	});

	// Find the very first search result element
	const firstSearchResult = document.querySelector('main .bw-search__result:first-child');

	// Check if the first search result element is found
	if (firstSearchResult) {
		createInsertAllButton(firstSearchResult);
	} else {
		console.log('No search results found');
	}
} else {
	console.log('URL did not match: freesound.org/search');

	// Check if the page includes one or more instances of .bw-player
	const bwPlayers = document.querySelectorAll('.bw-player');
	if (bwPlayers.length >= 1) {
		console.log('One or more instances of .bw-player were found:', bwPlayers.length);

		// Initialize an array to store common ancestors
		var commonAncestors = [];

		// Loop through each .bw-player instance
		bwPlayers.forEach(player => {
			// Initialize an array to store ancestors of the current .bw-player instance
			var ancestors = [];

			// Find the parent element of the .bw-player instance
			const parentElement = player.parentNode;
			// Create and append grab buttons
			createGrabButtons(parentElement, true, 'in-row');

			// Traverse up the DOM tree and store ancestors until reaching the document body
			var ancestor = player.parentNode;
			while (ancestor !== document.body) {
				ancestors.push(ancestor);
				ancestor = ancestor.parentNode;
			}

			// Add ancestors of the current .bw-player instance to the common ancestors array
			commonAncestors = commonAncestors.length === 0 ? ancestors : commonAncestors.filter(ancestor => ancestors.includes(ancestor));
		});

		// Find the lowest-level common ancestor
		console.log("commonAncestors: ");
		commonAncestors.forEach(ancestor => {
			console.log(ancestor);
		});

		function findLowestLevelCommonAncestor(commonAncestors) {
			var lowestCommonAncestor = commonAncestors[0]; // Initialize with the first element

			// Iterate through the common ancestors array
			for (let i = 1; i < commonAncestors.length; i++) {
				const currentAncestor = commonAncestors[i];
				// Check if the current ancestor is deeper in the hierarchy than the current lowest common ancestor
				if (lowestCommonAncestor.contains(currentAncestor)) {
					lowestCommonAncestor = currentAncestor;
				}
			}

			return lowestCommonAncestor;
		}

		const lowestCommonAncestor = findLowestLevelCommonAncestor(commonAncestors);
		console.log('Lowest level common ancestor:', lowestCommonAncestor);

		// Pass the lowest-level common ancestor to the createInsertAllButton function
		createInsertAllButton(lowestCommonAncestor);
	} else {
		console.log('No instances of .bw-player were found');
	}
}

// Function to handle auto-insert checkbox change
function handleAutoInsertChange() {
	// Get the auto-insert checkbox
	const autoInsertCheckbox = document.querySelector('.auto-insert-div input[type="checkbox"]');

	// Update the local storage value
	localStorage.setItem('autoInsertCheckbox', autoInsertCheckbox.checked);

	// Check if the checkbox is checked
	if (autoInsertCheckbox.checked) {
		clickAllGrabButtons();
	}
}

// Function to click all grab buttons
function clickAllGrabButtons() {
	const grabButtons = document.querySelectorAll('.grab-button');
	grabButtons.forEach(button => {
		grabHtmlAndReplaceButton(button);
	});
}

// Add stylesheet to the page head
const style = document.createElement('style');
style.id = 'new-script-css';
style.innerHTML = `
    .grabber {
        width: 100%;
        margin: 0 0 12px;
        text-align: center;
    }

    .grabber .grab-button {
        background: #CCC;
        padding: 4px 8px;
        border: 1px solid black;
        border-radius: 1em;
    }

    .grabber.in-row {
        margin-top: 12px;
    }

    .grabber.in-row .grab-button {
        font-size: .75em;
    }

    .grabber.in-row .btn-primary {
      padding: 9px 21px;
    }

    .show-all-download-buttons {
        margin-bottom: 32px;
        text-align: center;
        --sadb-border-style: 1px solid hsla(0, 0%, 0%, .5);
        border-bottom: var(--sadb-border-style);
        border-top: var(--sadb-border-style);
    }

    .insert-all-download-buttons {
        margin: 12px 0 6px;
    }

    .auto-insert-div {
        margin-bottom: 12px;
        justify-content: center;
        align-items: center;
        display: flex;
    }

    .auto-insert-div * {
        margin: 0 .35em;
    }
`;
document.head.appendChild(style);
