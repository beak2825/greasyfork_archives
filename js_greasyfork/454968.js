// ==UserScript==
// @name         MouseHunt - Journal Historian
// @namespace    https://greasyfork.org/en/users/900615-personalpalimpsest
// @version      1.3.8
// @license      GNU GPLv3
// @description  Saves journal entries and offers more viewing options
// @author       asterios
// @match        http://www.mousehuntgame.com/*
// @match        https://www.mousehuntgame.com/*
// @icon         https://www.mousehuntgame.com/images/mice/thumb/de5de32f7ece2076dc405016d0c53302.gif?cv=2
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery-toast-plugin/1.3.2/jquery.toast.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.4.4/lz-string.min.js
// @downloadURL https://update.greasyfork.org/scripts/454968/MouseHunt%20-%20Journal%20Historian.user.js
// @updateURL https://update.greasyfork.org/scripts/454968/MouseHunt%20-%20Journal%20Historian.meta.js
// ==/UserScript==

(function () {
	const debug = true;
	const filterDebug = false;
	const saveDebug = false;
	const mutationDebug = false;
	const classifierDebug = false;

	// Observers to run the save and display functions as required
	const observer = new MutationObserver(function (mutations) {
		if (debug) console.log('mutated');
		if (mutationDebug) {
			for (const mutation of mutations) {
				console.log({mutation});
				console.log(mutation.target);
			}
		}
		// Only save if something was added.
		if (mutations.some(v => v.type === 'childList' && v.addedNodes.length > 0 && v.target.className !== 'journaldate')) {
			saveEntries();
			filterOnLoad();
		}
	});

	function activateMutationObserver() {
		let observerTarget = document.querySelector(`#journalContainer .content`);
		observer.observe(observerTarget, {
			childList: true,
			subtree: true
		});
	}

	const xhrObserver = XMLHttpRequest.prototype.open;
	XMLHttpRequest.prototype.open = function () {
		this.addEventListener('load', function () {
			if (this.responseURL == `https://www.mousehuntgame.com/managers/ajax/turns/activeturn.php`) {
				if (debug) console.log('horn detected');
				saveEntries();
				filterOnLoad();
			} else if (this.responseURL == `https://www.mousehuntgame.com/managers/ajax/pages/page.php`) {
				if (debug) console.log('Page load detected');
				classifyPage();
				filterOnLoad();
				renderBtns();

				activateMutationObserver();
			}
		})
		xhrObserver.apply(this, arguments);
	}

	// Save functions section
	function saveEntries() {
		if (debug) console.log('Checking entries and saving new entries');
		const entries = document.querySelectorAll('.entry');
		const savedEntries = getSavedEntriesFromStorage();
		const ownJournal = document.querySelector(`#journalEntries${user.user_id}`);

		if (!ownJournal) {
			console.log(`Other hunters' profile detected`);
			return;
		}

		gapDetector();

		for (const entry of entries) {
			const entryId = entry.dataset.entryId

			if (!entryId) return;

			if (savedEntries[entryId]) {
				// if (saveDebug) console.log(`Entry ${entryId} already stored`);
			}
			else {
				if (saveDebug) console.log(`Stored new entry ${entryId}`);
				$.toast({
					text: `Stored new entry ${entryId}`
					,stack: 25
					,hideAfter: 6900
				});
				classifier(entry);
				entryStripper(entry);
				savedEntries[entry.dataset.entryId] = entry.outerHTML;
			}
		}
		setSavedEntriesToStorage(savedEntries);
	}

	// Classifying journal entries
	function classifier(entry) {
		if (classifierDebug) console.log('Running classifier');
		const id = entry.dataset.entryId;
		if (classifierDebug) console.log({id});
		const cssClass = entry.className;

		if (cssClass.search(/(catchfailure|catchsuccess|attractionfailure|stuck_snowball_catch)/) !== -1) {
			if (classifierDebug) console.log('Hunts');
			if (classifierDebug) console.log({cssClass});
			entry.classList.add('jhHunts');
		}
		else if (cssClass.search(/(relicHunter_catch|relicHunter_failure|prizemouse)/) !== -1) {
			if (classifierDebug) console.log('Bonus Hunts');
			if (classifierDebug) console.log({cssClass});
			entry.classList.add('jhHunts');
		}
		else if (cssClass.search(/(relicHunter_start|relicHunter_complete)/) !== -1) {
			if (classifierDebug) console.log('Mapping');
			if (classifierDebug) console.log({cssClass});
			entry.classList.add('jhMapping');
		}
		else if (cssClass.search(/(marketplace)/) !== -1) {
			if (classifierDebug) console.log('Marketplace');
			if (classifierDebug) console.log({cssClass});
			entry.classList.add('jhMarketplace');
		}
		else if (cssClass.search(/(supplytransferitem)/) !== -1) {
			if (classifierDebug) console.log('Trading');
			if (classifierDebug) console.log({cssClass});
			entry.classList.add('jhTrading');
		}
		else if (cssClass.search(/(convertible_open)/) !== -1) {
			if (classifierDebug) console.log('Convertible');
			if (classifierDebug) console.log({cssClass});
			entry.classList.add('jhConvertible');
		}
		else {
			if (classifierDebug) console.log('Misc');
			if (classifierDebug) console.log({cssClass});
			entry.classList.add('jhMisc');
		}
	}

	function classifyPage() {
		if (debug) console.log('classifying page');
		const initialEntries = document.querySelectorAll('.entry');
		for (const entry of initialEntries) {
			classifier(entry);
		}
	}

	// Saving helper functions
	function getSavedEntriesFromStorage() {
		const compressed = localStorage.getItem('mh-journal-historian');
		const decompressed = LZString.decompressFromUTF16(compressed);

		var savedEntries;
		try {
			savedEntries = JSON.parse(decompressed);
		} catch {
			savedEntries = {};
		}
		return savedEntries;
	}

	function setSavedEntriesToStorage(entries) {
		const savedEntries = JSON.stringify(entries);
		const compressed = LZString.compressToUTF16(savedEntries);
		localStorage.setItem('mh-journal-historian', compressed);
	}

	function entryStripper(entry) {
		if (entry.classList.contains('animated')) {
			entry.classList.remove('animated');
		}
		if (entry.classList.contains('newEntry')) {
			entry.classList.remove('newEntry');
		}
		entry.style = null;
	}

	function gapDetector() {
		const latestEntry = document.querySelector('.entry');
		const latestEntryId = parseInt(latestEntry.dataset.entryId);
		const savedEntries = getSavedEntriesFromStorage();
		const newestSavedEntryId = parseInt(Object.keys(savedEntries)[Object.keys(savedEntries).length-1]);
		if (saveDebug) console.log({latestEntryId});
		if (saveDebug) console.log({newestSavedEntryId});

		if (latestEntryId - newestSavedEntryId > 12) {
			$.toast({
				icon: 'error',
				text: `${latestEntryId - newestSavedEntryId - 12} unsaved entries, make sure to open older pages to save them to your history!`,
				hideAfter: false,
				stack: 25
			});
		}
	}

	// Display functions section
	function renderSavedEntries() {
		const savedEntries = getSavedEntriesFromStorage();
		const journal = document.querySelector(`#journalEntries${user.user_id}`);
		const existingEntries = journal.querySelectorAll('.entry');

		if (debug) console.log({existingEntries});
		for (const entry of existingEntries) {entry.remove();}

		for (const [id, entry] of Object.entries(savedEntries)) {
			if (entry) {
				const frag = document.createRange().createContextualFragment(entry);
				journal.prepend(frag);
			}
		}
	}

	const toggleTypes = JSON.parse(localStorage.getItem('mh-journal-historian-toggles')) || {};

	function entryFilterToggle(filterType) {
		if (filterDebug) console.log(`Filtering ${filterType} entries`);
		const typeEntries = document.querySelectorAll(`.entry.jh${filterType}`);
		const type = filterType;

		if (filterDebug) console.log(toggleTypes[`${type}`]);
		for (const e of typeEntries) {
			toggleTypes[`${type}`] ? e.style.display = 'none' : e.style.display = 'block';
		}
		toggleTypes[`${type}`] = !toggleTypes[`${type}`];
		localStorage.setItem('mh-journal-historian-toggles',JSON.stringify(toggleTypes));
	}

	function filterOnLoad() {
		if (debug) console.log('Filtering on load');
		for (const type in toggleTypes) {
			toggleTypes[`${type}`] = !toggleTypes[`${type}`];
			if (filterDebug) console.log(toggleTypes[`${type}`]);
			entryFilterToggle(type);
			if (filterDebug) console.log(toggleTypes[`${type}`]);
		}
	}

	function btnToggleColour(btn,type) {
		if (toggleTypes[`${type}`]) {btn.style.background = '#7d7';} // light green
		else {btn.style.background = '#eaa';} // light red
	}

	function renderBtns() {
		const jhButton = document.querySelector('#jhButton');
		if (jhButton) return;
		if (debug) console.log('Rendering buttons');
		const hoverBtn = document.querySelector('.journalContainer-selectTheme');
		const hoverDiv = hoverBtn.parentElement;
		hoverDiv.style.display = 'flex';
		hoverDiv.style.flexDirection = 'row';
		hoverDiv.style.alignItems = 'center';
		hoverBtn.style.position = 'initial';
		hoverBtn.style.transform = 'none';
		hoverBtn.style.flex = 'auto';
		hoverBtn.style.height = '20px';

		const filterType = ['Hunts','Marketplace','Mapping','Trading','Convertible','Misc'];
		if (!Object.keys(toggleTypes).length) {
			for (const type of filterType) {
				toggleTypes[`${type}`] = true;
			}
		}

		for (let i = 0; i < 6; i++) {
			const clone = hoverBtn.cloneNode(true);
			const type = filterType[i];
			let cloneToggle = toggleTypes[`${type}`];

			if (cloneToggle) {clone.style.background = '#7d7';} // light green
			else {clone.style.background = '#eaa';} // light red
			clone.id = 'jhButton';
			clone.innerHTML = type;
			clone.style.backgroundImage = 'none';
			clone.style.padding = '0 0 0 5px';
			clone.onclick = (()=>{
				entryFilterToggle(`${type}`);
				btnToggleColour(clone,type);
			})
			hoverDiv.insertBefore(clone,hoverBtn);
		}

		const lastBtn = document.querySelector('.pagerView-lastPageLink.pagerView-link');
		const infiniteBtn = lastBtn.cloneNode(true);
		let infiniteToggle = true;
		if (filterDebug) console.log({infiniteToggle});

		infiniteBtn.innerHTML = 'Infinite.';
		infiniteBtn.onclick = (()=>{
			if (infiniteToggle) {
				infiniteToggle = false;
				renderSavedEntries();
				filterOnLoad();
			}
			else {
				infiniteToggle = true;
				const allEntries = document.querySelectorAll('.entry');
				for (let entry = 12; entry < allEntries.length; entry++) {
					allEntries[entry].remove();
				}
			}
		});
		lastBtn.after(infiniteBtn);
		for (const btn of document.querySelectorAll('.pagerView-link')) {
			btn.style.margin = "0 2px";
			btn.style.padding = "3px";
		}
	}

	// Initial classify on load so filterOnLoad will work
	activateMutationObserver();
	classifyPage();
	// saveEntries(); // not required as renderBtns triggers mutation observer which triggers save/filter
	// filterOnLoad();
	renderBtns();
})();
