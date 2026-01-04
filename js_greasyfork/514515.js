// ==UserScript==
// @name         OSRS Wiki Auto-Navbox with UI, Adaptive Speed, Duplicate Checker (Slow Version)
// @namespace    typpi.online
// @version      5.3
// @description  Adds listed pages to a Navbox upon request with UI, CSRF token, adaptive speed, duplicate checker, and highlighted links option.
// @author       Nick2bad4u
// @match        https://oldschool.runescape.wiki/*
// @match        https://runescape.wiki/*
// @match        https://*.runescape.wiki/*
// @match        https://api.runescape.wiki/*
// @match        https://classic.runescape.wiki/*
// @match        *://*.runescape.wiki/*
// @grant        GM_xmlhttpRequest
// @icon         https://www.google.com/s2/favicons?sz=64&domain=oldschool.runescape.wiki
// @license      UnLicense
// @downloadURL https://update.greasyfork.org/scripts/514515/OSRS%20Wiki%20Auto-Navbox%20with%20UI%2C%20Adaptive%20Speed%2C%20Duplicate%20Checker%20%28Slow%20Version%29.user.js
// @updateURL https://update.greasyfork.org/scripts/514515/OSRS%20Wiki%20Auto-Navbox%20with%20UI%2C%20Adaptive%20Speed%2C%20Duplicate%20Checker%20%28Slow%20Version%29.meta.js
// ==/UserScript==

(function () {
	'use strict';
	const versionNumber = '5.1';
	let navboxName = '';
	let pageLinks = [];
	let selectedLinks = [];
	let currentIndex = 0;
	let csrfToken = '';
	let isCancelled = false;
	let isRunning = false;
	let requestInterval = 10000;
	const maxInterval = 20000;
	const excludedPrefixes = [
		'Template:',
		'File:',
		'Navbox:',
		'Module:',
		'RuneScape:',
		'Update:',
		'Exchange:',
		'RuneScape:',
		'User:',
		'Help:',
	];
	let actionLog = []; // Track actions for summary

	function addButtonAndProgressBar() {
		console.log(
			'Adding button and progress bar to the UI.',
		);
		const container =
			document.createElement('div');
		container.id = 'Navbox-ui';
		container.style = `position: fixed; bottom: 20px; right: 20px; z-index: 1000;
            background-color: #2b2b2b; color: #ffffff; padding: 12px;
            border: 1px solid #595959; border-radius: 8px; font-family: Arial, sans-serif; width: 250px;`;

		const startButton =
			document.createElement('button');
		startButton.textContent =
			'Start Categorizing';
		startButton.style = `background-color: #4caf50; color: #fff; border: none;
            padding: 6px 12px; border-radius: 5px; cursor: pointer;`;
		startButton.onclick = promptnavboxName;
		container.appendChild(startButton);

		const cancelButton =
			document.createElement('button');
		cancelButton.textContent = 'Cancel';
		cancelButton.style = `background-color: #d9534f; color: #fff; border: none;
            padding: 6px 12px; border-radius: 5px; cursor: pointer; margin-left: 10px;`;
		cancelButton.onclick = cancelNavbox;
		container.appendChild(cancelButton);

		const progressBarContainer =
			document.createElement('div');
		progressBarContainer.style = `width: 100%; margin-top: 10px; background-color: #3d3d3d;
            height: 20px; border-radius: 5px; position: relative;`;
		progressBarContainer.id =
			'progress-bar-container';

		const progressBar =
			document.createElement('div');
		progressBar.style = `width: 0%; height: 100%; background-color: #4caf50; border-radius: 5px;`;
		progressBar.id = 'progress-bar';
		progressBarContainer.appendChild(progressBar);

		const progressText =
			document.createElement('span');
		progressText.id = 'progress-text';
		progressText.style = `position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%);
            font-size: 12px; color: #ffffff; white-space: nowrap; overflow: visible; text-align: center;`;
		progressBarContainer.appendChild(
			progressText,
		);

		container.appendChild(progressBarContainer);
		document.body.appendChild(container);
	}

	function promptnavboxName() {
		navboxName = prompt(
			"Enter the Navbox name you'd like to add:",
		);
		console.log(
			'Navbox name entered:',
			navboxName,
		);
		if (!navboxName) {
			alert('Navbox name is required.');
			return;
		}

		getPageLinks();
		if (pageLinks.length === 0) {
			alert('No pages found to Navbox.');
			console.log(
				'No pages found after filtering.',
			);
			return;
		}

		displayPageSelectionPopup();
	}

	// Function to check for highlighted text
	function getHighlightedText() {
		const selection = globalThis.getSelection();
		if (selection.rangeCount > 0) {
			const container =
				document.createElement('div');
			for (
				let i = 0;
				i < selection.rangeCount;
				i++
			) {
				container.appendChild(
					selection.getRangeAt(i).cloneContents(),
				);
			}
			return container.innerHTML;
		}
		return '';
	}

	// Modify getPageLinks to consider highlighted text
	function getPageLinks() {
		let contextElement = document.querySelector(
			'#mw-content-text',
		);
		const highlightedText = getHighlightedText();

		if (highlightedText) {
			// Create a temporary container to process the highlighted text
			const tempContainer =
				document.createElement('div');
			tempContainer.innerHTML = highlightedText;
			contextElement = tempContainer;
		}

		pageLinks = Array.from(
			new Set(
				Array.from(
					contextElement.querySelectorAll('a'),
				)
					.map((link) =>
						link.getAttribute('href'),
					)
					.filter(
						(href) =>
							href && href.startsWith('/w/'),
					)
					.map((href) =>
						decodeURIComponent(
							href.replace('/w/', ''),
						),
					)
					.filter(
						(page) =>
							!excludedPrefixes.some((prefix) =>
								page.startsWith(prefix),
							) &&
							!page.includes('?') &&
							!page.includes('/') &&
							!page.includes('#'),
					),
			),
		);

		console.log(
			'Filtered unique page links:',
			pageLinks,
		);
	}

	function displayPageSelectionPopup() {
		console.log(
			'Displaying page selection popup.',
		);
		const popup = document.createElement('div');
		popup.style = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
    z-index: 1001; background-color: #2b2b2b; padding: 15px; color: white;
    border-radius: 8px; max-height: 80vh; overflow-y: auto; border: 1px solid #595959;`;

		const title = document.createElement('h3');
		title.textContent = 'Select Pages to Navbox';
		title.style = `margin: 0 0 10px; font-family: Arial, sans-serif;`;
		popup.appendChild(title);

		const listContainer =
			document.createElement('div');
		listContainer.style = `max-height: 300px; overflow-y: auto;`;

		// Declare lastChecked outside the event listener to keep track of the last clicked checkbox
		let lastChecked = null;

		pageLinks.forEach((link) => {
			const listItem =
				document.createElement('div');
			const checkbox =
				document.createElement('input');
			checkbox.type = 'checkbox';
			checkbox.checked = true;
			checkbox.value = link;
			listItem.appendChild(checkbox);
			listItem.appendChild(
				document.createTextNode(` ${link}`),
			);
			listContainer.appendChild(listItem);

			checkbox.addEventListener(
				'click',
				function (e) {
					if (e.shiftKey && lastChecked) {
						let inBetween = false;
						listContainer
							.querySelectorAll(
								'input[type="checkbox"]',
							)
							.forEach((checkbox) => {
								if (
									checkbox === this ||
									checkbox === lastChecked
								) {
									inBetween = !inBetween;
								}
								if (inBetween) {
									checkbox.checked = this.checked;
								}
							});
					}
					lastChecked = this;
				},
			);
		});
		popup.appendChild(listContainer);

		const buttonContainer =
			document.createElement('div');
		buttonContainer.style = `margin-top: 10px; display: flex; justify-content: space-between;`;

		let allSelected = true;
		const selectAllButton =
			document.createElement('button');
		selectAllButton.textContent = 'Select All';
		selectAllButton.style = `padding: 5px 10px; background-color: #5bc0de; border: none;
        color: white; cursor: pointer; border-radius: 5px;`;
		selectAllButton.onclick = () => {
			listContainer
				.querySelectorAll(
					'input[type="checkbox"]',
				)
				.forEach((checkbox) => {
					checkbox.checked = allSelected;
				});
			selectAllButton.textContent = allSelected
				? 'Deselect All'
				: 'Select All';
			allSelected = !allSelected;
			console.log(
				allSelected
					? 'Select All clicked: all checkboxes selected.'
					: 'Deselect All clicked: all checkboxes deselected.',
			);
		};
		buttonContainer.appendChild(selectAllButton);

		const confirmButton =
			document.createElement('button');
		confirmButton.textContent =
			'Confirm Selection';
		confirmButton.style = `padding: 5px 10px; background-color: #4caf50;
            border: none; color: white; cursor: pointer; border-radius: 5px;`;
		confirmButton.onclick = () => {
			selectedLinks = Array.from(
				listContainer.querySelectorAll(
					'input:checked',
				),
			).map((input) => input.value);
			console.log(
				'Confirmed selected links:',
				selectedLinks,
			);
			document.body.removeChild(popup);
			if (selectedLinks.length > 0) {
				startNavbox();
			} else {
				alert('No pages selected.');
			}
		};

		const cancelPopupButton =
			document.createElement('button');
		cancelPopupButton.textContent = 'Cancel';
		cancelPopupButton.style = `padding: 5px 10px; background-color: #d9534f;
            border: none; color: white; cursor: pointer; border-radius: 5px;`;
		cancelPopupButton.onclick = () => {
			console.log('Popup canceled.');
			document.body.removeChild(popup);
		};

		buttonContainer.appendChild(confirmButton);
		buttonContainer.appendChild(
			cancelPopupButton,
		);
		popup.appendChild(buttonContainer);

		document.body.appendChild(popup);
	}

	function startNavbox() {
		console.log('Starting Navbox process.');
		isCancelled = false;
		isRunning = true;
		currentIndex = 0;
		document.getElementById(
			'progress-bar-container',
		).style.display = 'block';
		fetchCsrfToken(() => processNextPage());
	}

	function processNextPage() {
		if (
			isCancelled ||
			currentIndex >= selectedLinks.length
		) {
			console.log(
				'Navbox ended. Reason:',
				isCancelled ? 'Cancelled' : 'Completed',
			);
			isRunning = false;
			if (!isCancelled) {
				displayCompletionSummary(); // Show summary popup
			}
			resetUI();
			return;
		}

		const pageTitle = selectedLinks[currentIndex];
		updateProgressBar(`Processing: ${pageTitle}`);
		console.log(`Processing page: ${pageTitle}`);
		addNavboxToPage(pageTitle, () => {
			currentIndex++;
			updateProgressBar(
				`Processed: ${pageTitle}`,
			);
			setTimeout(
				processNextPage,
				requestInterval,
			);
		});
	}

	function addNavboxToPage(pageTitle, callback) {
		const navboxTemplate = `{{${navboxName}}}`;

		// Fetch page content to check for duplicate
		const apiUrl = `https://oldschool.runescape.wiki/api.php?action=query&prop=revisions&titles=${encodeURIComponent(pageTitle)}&rvprop=content&format=json`;

		GM_xmlhttpRequest({
			method: 'GET',
			url: apiUrl,
			onload(response) {
				const responseJson = JSON.parse(
					response.responseText,
				);
				const pageId = Object.keys(
					responseJson.query.pages,
				)[0];
				const page =
					responseJson.query.pages[pageId];

				// If page content is undefined, skip processing this page
				if (
					!page.revisions ||
					!page.revisions[0]
				) {
					console.log(
						`Page content not found for '${pageTitle}', skipping.`,
					);
					actionLog.push(
						`Skipped: '${pageTitle}' - page content not found.`,
					);
					callback();
					return;
				}

				const pageContent =
					page.revisions[0]['*'];

				// Check if the navbox already exists in the content
				if (
					pageContent.includes(navboxTemplate)
				) {
					console.log(
						`Page '${pageTitle}' already contains the navbox '${navboxName}', skipping.`,
					);
					actionLog.push(
						`Skipped: '${pageTitle}' already contains '${navboxName}'`,
					);
					callback();
					return;
				}

				// Find the index of the first category
				const firstCategoryIndex =
					pageContent.indexOf('[[Category:');

				// Add the navbox above the first category, or append if no categories
				const newContent =
					firstCategoryIndex === -1
						? pageContent + '\n' + navboxTemplate // Append if no categories
						: pageContent.slice(
								0,
								firstCategoryIndex,
							) +
							navboxTemplate +
							'\n' +
							pageContent.slice(
								firstCategoryIndex,
							);

				const editUrl =
					'https://oldschool.runescape.wiki/api.php';
				const formData = new URLSearchParams();
				formData.append('action', 'edit');
				formData.append('title', pageTitle);
				formData.append('text', newContent);
				formData.append('token', csrfToken);
				formData.append('format', 'json');

				GM_xmlhttpRequest({
					method: 'POST',
					url: editUrl,
					headers: {
						'Content-Type':
							'application/x-www-form-urlencoded',
					},
					data: formData.toString(),
					onload(editResponse) {
						if (editResponse.status === 200) {
							actionLog.push(
								`Added: '${pageTitle}' to '${navboxName}'`,
							);
							console.log(
								`Successfully added '${pageTitle}' to Navbox '${navboxName}'.`,
							);
							callback();
						} else {
							console.log(
								`Failed to add '${pageTitle}' to Navbox.`,
							);
							callback();
						}
					},
				});
			},
		});
	}

	function fetchCsrfToken(callback) {
		const apiUrl =
			'https://oldschool.runescape.wiki/api.php?action=query&meta=tokens&type=csrf&format=json';
		GM_xmlhttpRequest({
			method: 'GET',
			url: apiUrl,
			onload(response) {
				const responseJson = JSON.parse(
					response.responseText,
				);
				csrfToken =
					responseJson.query.tokens.csrftoken;
				console.log(
					'CSRF token fetched:',
					csrfToken,
				);
				callback();
			},
		});
	}

	function updateProgressBar(status) {
		const progressBar = document.getElementById(
			'progress-bar',
		);
		const progressText = document.getElementById(
			'progress-text',
		);
		const progress =
			(currentIndex / selectedLinks.length) * 100;
		progressBar.style.width = `${progress}%`;
		progressText.textContent = `${Math.round(progress)}% - ${status}`;
	}

	function displayCompletionSummary() {
		console.log('Displaying completion summary.');
		const summaryPopup =
			document.createElement('div');
		summaryPopup.style = `position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%);
        z-index: 1001; background-color: #2b2b2b; padding: 15px; color: white;
        border-radius: 8px; max-height: 80vh; overflow-y: auto; border: 1px solid #595959;`;

		const title = document.createElement('h3');
		title.textContent = 'Navbox Summary';
		title.style = `margin: 0 0 10px; font-family: Arial, sans-serif;`;
		summaryPopup.appendChild(title);

		const logList = document.createElement('ul');
		logList.style =
			'max-height: 300px; overflow-y: auto;';

		actionLog.forEach((entry) => {
			const listItem =
				document.createElement('li');
			listItem.textContent = entry;
			logList.appendChild(listItem);
		});

		summaryPopup.appendChild(logList);

		const closeButton =
			document.createElement('button');
		closeButton.textContent = 'Close';
		closeButton.style = `margin-top: 10px; padding: 5px 10px; background-color: #4caf50;
            border: none; color: white; cursor: pointer; border-radius: 5px;`;
		closeButton.onclick = () => {
			document.body.removeChild(summaryPopup);
			actionLog = [];
		};

		summaryPopup.appendChild(closeButton);
		document.body.appendChild(summaryPopup);
	}

	function resetUI() {
		document.getElementById(
			'progress-bar',
		).style.width = '0%';
		document.getElementById(
			'progress-text',
		).textContent = '';
		document.getElementById(
			'progress-bar-container',
		).style.display = 'none';
		isRunning = false;
	}

	function cancelNavbox() {
		console.log('Navbox cancelled by user.');
		isCancelled = true;
	}

	addButtonAndProgressBar();
})();
