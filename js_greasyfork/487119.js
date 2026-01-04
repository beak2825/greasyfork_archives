// ==UserScript==
// @name         Plex downloader
// @description  Adds a download button to the Plex desktop interface. Works on episodes, movies, whole seasons, and entire shows.
// @author       Mow
// @version      1.5.12
// @license      MIT
// @grant        none
// @match        https://app.plex.tv/desktop/
// @include      https://*.*.plex.direct:32400/web/index.html*
// @run-at       document-start
// @namespace    https://greasyfork.org/users/1260133
// @downloadURL https://update.greasyfork.org/scripts/487119/Plex%20downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/487119/Plex%20downloader.meta.js
// ==/UserScript==


// Bookmarklet version:
/*
javascript:(d=>{if(!window._PLDLR){let s;window._PLDLR=s=d.createElement`script`;s.src='https://update.greasyfork.org/scripts/487119/Plex%20downloader.user.js';d.head.append(s)}})(document)
*/

// This code is a heavy modification of the existing PlxDwnld project
// https://sharedriches.com/plex-scripts/piplongrun/

(function() {
	"use strict";
	
	function randToken() {
		return Math.random().toString(36).slice(2);
	}
	
	const logPrefix = "[USERJS Plex Downloader]";
	const domPrefix = `USERJSINJECTED-${randToken()}_`.toLowerCase();
	
	// Settings of what element to clone, where to inject it, and any additional CSS to use
	const injectionElement    = "button[data-testid=preplay-play]"; // Play button
	const injectPosition      = "after";
	const domElementStyle     = "";
	const domElementInnerHTML = "<svg style='height:1.5rem; width:1.5rem; margin:0 4px 0 0;'><g><path d='M3,12.3v7a2,2,0,0,0,2,2H19a2,2,0,0,0,2-2v-7' fill='none' stroke='currentcolor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2'></path><g><polyline fill='none' stroke='currentcolor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' points='7.9 12.3 12 16.3 16.1 12.3'></polyline><line fill='none' stroke='currentcolor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' x1='12' x2='12' y1='2.7' y2='14.2'></line></g></g></svg>Download";
	
	
	
	// Should not be visible in normal operation
	const errorLog = [];
	function errorHandle(msg) {
		errorLog.push(msg);
		console.log(`${logPrefix} ${msg.toString()}`);
	}
	
	
	// Redact potentially sensitive information from a URL so it can be safely used for error reports
	const ipAddrRegex       = /^\d{1,3}-\d{1,3}-\d{1,3}-\d{1,3}$/;
	const ipAddrReplace     = "1-1-1-1";
	const hexStartRegex     = /^[0-9a-f]{16}/;
	const hexStartReplace   = "XXXXXXXXXXXXXXXX";
	const XPlexTokenReplace = "REDACTED";
	function redactUrl(unsafeUrl) {
		let url;
		try {
			url = new URL(unsafeUrl);
		} catch {
			// A totally malformed URL throws exceptions
			return "?";
		}
		
		let domains = url.hostname.split(".");
		for (let i = 0; i < domains.length; i++) {
			domains[i] = domains[i].replace(ipAddrRegex,   ipAddrReplace);
			domains[i] = domains[i].replace(hexStartRegex, hexStartReplace);
		}
		
		url.hostname = domains.join(".");
		
		if (url.searchParams.has("X-Plex-Token")) {
			url.searchParams.set("X-Plex-Token", XPlexTokenReplace);
		}
		
		return url.href;
	}
	
	
	// Turn a number of bytes to a more friendly size display
	const fsUnits = [ "B", "KB", "MB", "GB", "TB" ];
	function makeFilesize(numbytes) {
		let ui = 0;
		
		numbytes = parseInt(numbytes);
		if (isNaN(numbytes) || numbytes < 0) {
			return "?";
		}
		
		// I don't care what hard drive manufacturers say, there are 1024 bytes in a kilobyte
		while (numbytes >= 1024 && ui < fsUnits.length - 1) {
			numbytes /= 1024;
			ui++;
		}
		
		if (ui !== 0) {
			return `${numbytes.toFixed(2)} ${fsUnits[ui]}`;
		} else {
			return `${numbytes} ${fsUnits[ui]}`;
		}
	}
	
	
	// Turn a number of milliseconds to a more friendly HH:MM:SS display
	function makeDuration(ms) {
		ms = parseInt(ms);
		if (isNaN(ms) || ms < 0) {
			return "?";
		}
		
		let h = Math.floor(ms/3600000);
		let m = Math.floor((ms%3600000)/60000);
		let s = Math.floor((ms%60000)/1000);
		
		let ret = [ h, m, s ];
		
		// If no hours, omit them. Leave minutes and seconds even if they're zero
		if (ret[0] === 0) {
			ret.shift();
		}
		
		// Except for first unit, make sure all are two digits by prepending zero
		// EG: 0:07 for 7s, 2:01:04 for 2h 1m 4s
		for (let i = 1; i < ret.length; i++) {
			ret[i] = ret[i].toString().padStart(2, '0');
		}
		
		// Add separator
		return ret.join(":")
	}
	
	
	
	// The modal is the popup that prompts you for a selection of a group media item like a whole season of a TV show
	const modal = {};
	
	// Must use DocumentFragment to access getElementById
	modal.documentFragment = document.createDocumentFragment();
	modal.container = document.createElement(`${domPrefix}element`);
	modal.documentFragment.append(modal.container);
	
	modal.container.id = `${domPrefix}modal_container`;
	
	// Styling and element tree as careful as possible to not interfere or be interfered with by Plex
	modal.stylesheet = `
		${domPrefix}element {
			display: block; /* Important to explicitly declare! */
			color: #eee;
		}
		
		#${domPrefix}modal_container {
			width: 0;
			height: 0;
			pointer-events: none;
			transition: opacity 0.2s;
			opacity: 0;
		}
		
		#${domPrefix}modal_container.${domPrefix}open {
			pointer-events: auto;
			opacity: 1;
		}
		
		#${domPrefix}modal_overlay {
			width: 100%;
			height: 100%;
			position: fixed;
			top: 0;
			left: 0;
			z-index: 99990;
			display: flex;
			align-items: center;
			justify-content: center;
			background: #0007;
		}
		
		#${domPrefix}modal_popup {
			min-width: 33%;
			max-width: 90%;
			min-height: 40%;
			max-height: min(80%, 650px);
			display: flex;
			flex-direction: column;
			gap: 1em;
			padding: 1em 1.3em;
			border-radius: 14px;
			background: #3f3f42;
			text-align: center;
			box-shadow: 0 0 10px 1px black;
			position: relative;
			transition: top 0.2s ease-out;
			top: -15%;
		}
		
		#${domPrefix}modal_container.${domPrefix}open #${domPrefix}modal_popup {
			top: -2%;
		}
		
		#${domPrefix}modal_title {
			font-size: 16pt;
		}
		
		#${domPrefix}modal_scrollbox {
			width: 100%;
			overflow-y: scroll;
			scrollbar-color: #fff8 #fff1;
			scrollbar-width: thin;
			background: #0005;
			border-radius: 6px;
			box-shadow: 0 0 4px 1px #0003 inset;
			border-left: 2px solid #222;
			flex: 1;
		}
		
		#${domPrefix}modal_container input[type="button"] {
			transition: color 0.15s, background 0.15s, opacity 0.15s;
		}
		
		#${domPrefix}modal_topx {
			position: absolute;
			top: 1em;
			right: 1em;
			cursor: pointer;
			height: 1.5em;
			width: 1.5em;
			border-radius: 3px;
			font-size: 14pt;
			color: #fff8;
			background: transparent;
			border: none;
		}
		
		#${domPrefix}modal_topx:hover {
			background: #fff2;
			color: #000c;
		}
		
		#${domPrefix}modal_topx:hover:active {
			background: #fff7;
		}
		
		#${domPrefix}modal_downloadbutton {
			display: inline;
			background: #0008;
			padding: 0.2em 0.5em;
			border-radius: 4px;
			cursor: pointer;
			color: #eee;
			border: 1px solid #5555;
			font-size: 14pt;
		}
		
		#${domPrefix}modal_downloadbutton:not([disabled]):hover {
			background: #14161a78;
		}
		
		#${domPrefix}modal_downloadbutton[disabled] {
			opacity: 0.5;
			cursor: default;
		}
		
		#${domPrefix}modal_container .${domPrefix}modal_table_header {
			display: table-row;
			font-weight: 600;
			position: sticky;
			top: 0;
			background: #222;
			box-shadow: 0 0 4px #000a;
		}
		
		#${domPrefix}modal_container .${domPrefix}modal_table_header > *:not(:first-child) {
			border-left: 1px solid #bcf1;
		}
		
		#${domPrefix}modal_container .${domPrefix}modal_table_header > *:not(:last-child) {
			border-right: 1px solid #bcf1;
		}
		
		#${domPrefix}modal_container .${domPrefix}modal_table_cell {
			padding: 8px;
			display: table-cell;
			vertical-align: middle;
			text-align: center;
		}
		
		#${domPrefix}modal_table_rowcontainer > *:nth-child(2n) {
			background: #7781;
		}
		
		#${domPrefix}modal_container label {
			cursor: pointer;
		}
		
		#${domPrefix}modal_container label:hover {
			background: #bdf2;
		}
		
		#${domPrefix}modal_container label:hover:active {
			background: #b5d3ff28;
		}
		
		#${domPrefix}modal_container label:has(input:not(:checked)) .${domPrefix}modal_table_cell {
			color: #eee6;
		}
		
		#${domPrefix}modal_container input[type="checkbox"] {
			margin: 0 0.8em;
			height: 1rem;
			width: 1rem;
			cursor: pointer;
			accent-color: #1394e1;
		}
		
		#${domPrefix}modal_container *:focus-visible {
			outline: 2px solid #408cffbf;
			outline-offset: 2px;
		}
	`;
	
	modal.container.innerHTML = `
		<style>${modal.stylesheet}</style>
		
		<${domPrefix}element id="${domPrefix}modal_overlay">
			<${domPrefix}element id="${domPrefix}modal_popup" role="dialog" aria-modal="true" aria-labelledby="${domPrefix}modal_title" aria-describedby="${domPrefix}modal_downloaddescription">
				<${domPrefix}element id="${domPrefix}modal_title">Download</${domPrefix}element>
				<input type="button" id="${domPrefix}modal_topx" value="&#x2715;" aria-label="close" title="Close" tabindex="0"/>
				
				<input type="hidden" id="${domPrefix}modal_clientid" tabindex="-1"/>
				<input type="hidden" id="${domPrefix}modal_parentid" tabindex="-1"/>
				
				<${domPrefix}element id="${domPrefix}modal_scrollbox" aria-label="List of files that may be downloaded">
					
					<${domPrefix}element style="display:table; width:100%">
						<${domPrefix}element style="display:table-header-group">
							<${domPrefix}element class="${domPrefix}modal_table_header">
								<label for="${domPrefix}modal_checkall" class="${domPrefix}modal_table_cell" title="Select all">
									<input type="checkbox" id="${domPrefix}modal_checkall" checked tabindex="0"/>
								</label>
								<${domPrefix}element class="${domPrefix}modal_table_cell" style="width:100%">File</${domPrefix}element>
								<${domPrefix}element class="${domPrefix}modal_table_cell">Watched</${domPrefix}element>
								<${domPrefix}element class="${domPrefix}modal_table_cell">Runtime</${domPrefix}element>
								<${domPrefix}element class="${domPrefix}modal_table_cell">Resolution</${domPrefix}element>
								<${domPrefix}element class="${domPrefix}modal_table_cell">Type</${domPrefix}element>
								<${domPrefix}element class="${domPrefix}modal_table_cell">Size</${domPrefix}element>
							</${domPrefix}element>
						</${domPrefix}element>
						
						<${domPrefix}element style="display:table-row-group" id="${domPrefix}modal_table_rowcontainer">
							<!-- Items inserted here -->
						</${domPrefix}element>
						
					</${domPrefix}element>
				</${domPrefix}element>
				
				<${domPrefix}element id="${domPrefix}modal_downloaddescription"></${domPrefix}element>
				
				<${domPrefix}element>
					<input type="button" id="${domPrefix}modal_downloadbutton" value="Download" tabindex="0"/>
				</${domPrefix}element>
			</${domPrefix}element>
		</${domPrefix}element>
		
		<template id="${domPrefix}modal_item_template">
			<label style="display:table-row" data-${domPrefix}template-id="modal_item_label">
				<${domPrefix}element class="${domPrefix}modal_table_cell">
					<input type="checkbox" checked data-${domPrefix}template-id="modal_item_checkbox" class="${domPrefix}modal_item_checkbox" tabindex="0"/>
				</${domPrefix}element>
				
				<${domPrefix}element class="${domPrefix}modal_table_cell" data-${domPrefix}template-id="modal_item_title"      style="text-align:left"></${domPrefix}element>
				<${domPrefix}element class="${domPrefix}modal_table_cell" data-${domPrefix}template-id="modal_item_watched"    style="white-space:nowrap"></${domPrefix}element>
				<${domPrefix}element class="${domPrefix}modal_table_cell" data-${domPrefix}template-id="modal_item_runtime"    style="white-space:nowrap"></${domPrefix}element>
				<${domPrefix}element class="${domPrefix}modal_table_cell" data-${domPrefix}template-id="modal_item_resolution" style="white-space:nowrap"></${domPrefix}element>
				<${domPrefix}element class="${domPrefix}modal_table_cell" data-${domPrefix}template-id="modal_item_filetype"   style="white-space:nowrap"></${domPrefix}element>
				<${domPrefix}element class="${domPrefix}modal_table_cell" data-${domPrefix}template-id="modal_item_filesize"   style="white-space:nowrap"></${domPrefix}element>
			</label>
		</template>
	`;
	
	modal.getElementByIdSuffix = function(idSuffix) {
		return modal.documentFragment.getElementById(`${domPrefix}${idSuffix}`);
	};
	
	modal.overlay             = modal.getElementByIdSuffix("modal_overlay");
	modal.popup               = modal.getElementByIdSuffix("modal_popup");
	modal.title               = modal.getElementByIdSuffix("modal_title");
	modal.itemContainer       = modal.getElementByIdSuffix("modal_table_rowcontainer");
	modal.topX                = modal.getElementByIdSuffix("modal_topx");
	modal.downloadButton      = modal.getElementByIdSuffix("modal_downloadbutton");
	modal.checkAll            = modal.getElementByIdSuffix("modal_checkall");
	modal.clientId            = modal.getElementByIdSuffix("modal_clientid");
	modal.parentId            = modal.getElementByIdSuffix("modal_parentid");
	modal.downloadDescription = modal.getElementByIdSuffix("modal_downloaddescription");
	modal.itemTemplate        = modal.getElementByIdSuffix("modal_item_template");
	
	// Live updating collection of items
	modal.itemCheckboxes = modal.itemContainer.getElementsByClassName(`${domPrefix}modal_item_checkbox`);
	
	modal.firstTab = modal.topX;
	modal.lastTab  = modal.downloadButton;
	
	// Allow Tab/Enter/Space to correctly interact with the modal
	modal.captureKeyPress = function(event) {
		// Do nothing is modal is not open
		if (!modal.container.classList.contains(`${domPrefix}open`)) {
			return;
		}
		
		// No keypresses are allowed to interact with any lower event listeners
		event.stopImmediatePropagation();
		
		switch (event.key) {
			case "Tab":
				// Move focus into the modal if it somehow isn't already
				if (!modal.container.contains(document.activeElement)) {
					event.preventDefault();
					modal.firstTab.focus();
					break;
				}
				
				// Clamp tabbing to the next element to the selectable elements within the modal
				// Shift key reverses the direction
				if (event.shiftKey) {
					if (document.activeElement === modal.firstTab) {
						event.preventDefault();
						modal.lastTab.focus();
					}
				} else {
					if (document.activeElement === modal.lastTab) {
						event.preventDefault();
						modal.firstTab.focus();
					}
				}
				
				break;
			
			case "Escape":
				event.preventDefault();
				modal.close();
				break;
			
			case "Enter":
				// The enter key interacting with checkboxes can be unreliable
				event.preventDefault();
				if (modal.container.contains(document.activeElement)) {
					document.activeElement.click();
				}
				break;
		}
	};
	
	modal.keyUpDetectEscape = function(event) {
		if (event.key === "Escape") {
			modal.close();
		}
	};
	
	// Set up this listener immediately, and decide whether to fire it or not inside the callback
	// This is required so no other event listener fires before it, by being attached after it
	window.addEventListener("keydown", modal.captureKeyPress, { capturing : true });
	
	// Modal removes itself from the DOM once its CSS transition is over
	modal.container.addEventListener("transitionend", function(event) {
		// Ignore any transitionend events fired by child elements
		if (event.target !== modal.container) {
			return;
		}
		
		// Look to remove the modal from the DOM
		if (!modal.container.classList.contains(`${domPrefix}open`)) {
			modal.documentFragment.append(modal.container);
		}
	});
	
	// Show the modal on screen
	modal.open = function(clientId, metadataId) {
		modal.populate(clientId, metadataId);
		
		// Reset all checkboxes
		for (let checkbox of modal.itemCheckboxes) {
			checkbox.checked = true;
		}
		
		modal.checkAll.checked = true;
		modal.checkBoxChange();
		
		// Add modal to DOM
		document.body.append(modal.container);
		
		// Listen to page navigation to close the modal
		window.addEventListener("popstate", modal.close);
		
		// BUG: in some circumstances, the Escape key will not fire a keydown keyboard event
		// I believe this is Plex's fault. If you execute:
		//     window.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}));
		// then the event dispatches normally. However, if you instead do:
		//     document.body.dispatchEvent(new KeyboardEvent('keydown', {'key': 'Escape'}));
		// then the event handler for document.body sometimes, somehow, stops the event, even
		// if an earlier event handler is supposed to get the event first.
		// The only fix for this I found is to also listen for keyup to detect Escape
		window.addEventListener("keyup", modal.keyUpDetectEscape);
		
		// Focus on the download button, such that "Enter" immediately will start download
		modal.lastTab.focus();
		
		// CSS animation entrance
		modal.container.classList.add(`${domPrefix}open`);
	};
	
	// Close modal
	modal.close = function() {
		// Stop listening to popstate
		window.removeEventListener("popstate", modal.close);
		
		window.removeEventListener("keyup", modal.keyUpDetectEscape);
		
		// CSS animation exit, triggers the removal from the DOM on the transitionend event
		modal.container.classList.remove(`${domPrefix}open`);
	};
	
	// Hook functionality for modal
	modal.overlay.addEventListener("click", modal.close);
	modal.popup.addEventListener("click", function(event) { event.stopPropagation() });
	modal.topX.addEventListener("click", modal.close);
	
	modal.checkAll.addEventListener("change", function() {
		for (let checkbox of modal.itemCheckboxes) {
			checkbox.checked = modal.checkAll.checked;
		}
		
		modal.checkBoxChange();
	});
	
	modal.downloadChecked = function() {
		let clientId = modal.clientId.value;
		for (let checkbox of modal.itemCheckboxes) {
			if (checkbox.checked) {
				download.fromMedia(clientId, checkbox.value);
			}
		}
		modal.close();
	};
	
	modal.downloadButton.addEventListener("click", modal.downloadChecked);
	
	// Process a change to checkboxes inside the modal
	modal.checkBoxChange = function() {
		// Add up total filesize
		let totalFilesize = 0;
		let selectedItems = 0;
		for (let checkbox of modal.itemCheckboxes) {
			if (checkbox.checked) {
				totalFilesize += serverData.servers[modal.clientId.value].mediaData[checkbox.value].filesize;
				selectedItems++;
			}
		}
		
		let description = `${selectedItems} file(s) selected. Total size: ${makeFilesize(totalFilesize)}`;
		modal.downloadDescription.textContent = description;
		modal.downloadButton.disabled = (totalFilesize === 0); // Can't download nothing
	};
	
	// Clone the item template and gather references to its important child nodes
	modal.getItemTemplateClone = function() {
		let clone = modal.itemTemplate.content.cloneNode(/*deep=*/true);
		let idMap = {};
		
		for (let node of clone.querySelectorAll(`[data-${domPrefix}template-id]`)) {
			let id = node.getAttribute(`data-${domPrefix}template-id`);
			idMap[id] = node;
		}
		
		return {
			documentFragment : clone,
			elementId        : idMap
		};
	};
	
	// Fill the modal with information for a specific group media item
	modal.populate = function(clientId, metadataId) {
		if (
			modal.clientId.value === clientId &&
			modal.parentId.value === metadataId
		) {
			// Ignore double trigger
			return;
		}
		
		// Clear out container contents
		while (modal.itemContainer.hasChildNodes()) {
			modal.itemContainer.firstChild.remove();
		} 
		
		// Recursively follow children and add all of their media to the container
		(function recurseMediaChildren(metadataId, titles) {
			titles.push(serverData.servers[clientId].mediaData[metadataId].title);
			
			if (Object.hasOwn(serverData.servers[clientId].mediaData[metadataId], "children")) {
				// Must sort the children by index here so they appear in the proper order
				serverData.servers[clientId].mediaData[metadataId].children.sort((a, b) => {
					let mediaA = serverData.servers[clientId].mediaData[a];
					let mediaB = serverData.servers[clientId].mediaData[b];
					return mediaA.index - mediaB.index;
				});
				
				for (let childId of serverData.servers[clientId].mediaData[metadataId].children) {
					recurseMediaChildren(childId, titles);
				}
			} else {
				let mediaData = serverData.servers[clientId].mediaData[metadataId];
				let item = modal.getItemTemplateClone();
				
				// Set up functionality of checkbox and label
				let checkbox = item.elementId["modal_item_checkbox"];
				checkbox.id = `${domPrefix}item_checkbox_${metadataId}`;
				checkbox.value = metadataId;
				checkbox.addEventListener("change", modal.checkBoxChange);
				
				item.elementId["modal_item_label"].htmlFor = checkbox.id;
				
				// Ignore the first title, which is the modal title instead
				let itemTitle = titles.slice(1).join(", "); 
				
				// Set hover title
				item.elementId["modal_item_label"].title = `Download ${itemTitle}`;
				
				// Fill fields in table cells
				item.elementId["modal_item_title"].textContent = itemTitle;
				
				item.elementId["modal_item_watched"].textContent = mediaData.viewed ? "\u2713" : "";  // U+2713 is a checkmark symbol
				item.elementId["modal_item_watched"].title = mediaData.viewed ? "Watched" : "Unwatched"; 
				
				item.elementId["modal_item_runtime"].textContent = makeDuration(mediaData.runtimeMS);
				
				item.elementId["modal_item_resolution"].textContent = mediaData.resolution;
				
				item.elementId["modal_item_filetype"].textContent = mediaData.filetype.toUpperCase();
				item.elementId["modal_item_filesize"].textContent = makeFilesize(mediaData.filesize);
				
				modal.itemContainer.append(item.documentFragment);
			}
			
			titles.pop();
		})(metadataId, []);
		
		// Set the modal title
		modal.title.textContent = `Download from ${serverData.servers[clientId].mediaData[metadataId].title}`;
		
		// Hidden values required for the button to work
		// Also help detect if we don't need to repopulate the modal
		modal.clientId.value = clientId;
		modal.parentId.value = metadataId;
		
		// Refresh the item count/total filesize
		modal.checkBoxChange();
	};
	
	
	
	// The observer object that waits for page to be right to inject new functionality
	const DOMObserver = {};
	
	// Check to see if we need to modify the DOM, do so if yes
	DOMObserver.callback = async function() {
		// Detect the presence of the injection point first
		const injectionPoint = document.querySelector(injectionElement);  
		if (!injectionPoint) {
			return;
		}
		
		// We can always stop observing when we have found the injection point
		// Note: This relies on the fact that the page does not mutate without also
		//       triggering hashchange. This is currently true (most of the time) but
		//       may change in future plex desktop updates
		DOMObserver.stop();
		
		// Should be on the right URL if we're observing the DOM and the injection point is found
		const urlIds = parseUrl();
		if (!urlIds) {
			return;
		}
		
		// Make sure we don't ever double trigger for any reason
		if (document.getElementById(`${domPrefix}DownloadButton`)) {
			return;
		}
		
		// Inject new button and await the data to add functionality
		const domElement = modifyDom(injectionPoint);
		let success = await domCallback(domElement, urlIds.clientId, urlIds.metadataId);
		if (success) {
			domElement.disabled = false;
			domElement.style.opacity = 1;
		} else {
			domElement.style.opacity = 0.25;
		}
	};
	
	DOMObserver.mo = new MutationObserver(DOMObserver.callback);
	
	DOMObserver.observe = function() {
		DOMObserver.mo.observe(document.body, { childList : true, subtree : true });
	};
	
	DOMObserver.stop = function() {
		DOMObserver.mo.disconnect();
	};
	
	
	
	// Server identifiers and their respective data (loaded over API request)
	const serverData = {
		servers : {
			// Example data
			/*
			"fd174cfae71eba992435d781704afe857609471b" : {
				"baseUri"     : "https://1-1-1-1.e38c3319c1a4a0f67c5cc173d314d74cb19e862b.plex.direct:13100",
				"accessToken" : "fH5dn-HgT7Ihb3S-p9-k",
				"mediaData"   : {}
			}
			*/
		},
		
		// Promise for loading server data, ensure it is loaded before we try to pull media data
		promise : null,
	};
	
	// Wrapper to make an API call to a specific Plex server
	serverData.apiCall = async function(clientId, apiPath) {
		const baseUri     = serverData.servers[clientId].baseUri;
		const accessToken = serverData.servers[clientId].accessToken;
		
		const apiUrl = new URL(`${baseUri}${apiPath}`);
		apiUrl.searchParams.set("X-Plex-Token", accessToken);
		
		try {
			// Headers here are required for Plex API to respond in JSON
			let response = await fetch(apiUrl.href, { headers : { accept : "application/json" } });
			if (!response.ok) {
				// If the server responds with non-OK, then there is a non-network related issue
				// Perhaps on a bad page with invalid URL?
				errorHandle(`Could not retrieve API data at ${redactUrl(apiUrl.href)} : received response code ${response.status}`);
				return false;
			}
			
			// Parse JSON body, may fail with SyntaxError
			let responseJSON = await response.json();
			
			return responseJSON;
			
		} catch (exception) {
			switch (exception.name) {
				case "TypeError":
					// Network failure, try the fallback URI for this server
					if (serverData.servers[clientId].fallbackUri) {
						serverData.servers[clientId].baseUri = serverData.servers[clientId].fallbackUri;
						serverData.servers[clientId].fallbackUri = false;
						
						// Run again from the top
						return await serverData.apiCall(clientId, apiPath);
					} else {
						errorHandle(`Could not establish connection to server at ${redactUrl(apiUrl.href)} : ${exception.message}`);
					}
					
					break;
				
				case "SyntaxError":
					// Did not parse JSON, malformed response in some way
					errorHandle(`Could not parse API JSON at ${redactUrl(apiUrl.href)} : ${exception.message}`);
					break;
				
				default:
					errorHandle(`Could not retrieve API data at ${redactUrl(apiUrl.href)} : ${exception.message}`);
					break;
			}
			
			return false;
		}
	};
	
	// Merge new data object into serverData
	serverData.update = function(newData, serverDataScope) {
		serverDataScope = serverDataScope || serverData;
		
		for (let key in newData) {
			if (!Object.hasOwn(serverDataScope, key) || typeof newData[key] !== "object") {
				// Write directly if key doesn't exist or key contains POD
				serverDataScope[key] = newData[key];
			} else {
				// Merge objects if needed instead
				serverData.update(newData[key], serverDataScope[key]);
			}
		}
	};
	
	// Make sure a server is online and allows downloads
	serverData.checkServer = async function(clientId) {
		const apiPath = "/media/providers/";
		
		let responseJSON = await serverData.apiCall(clientId, apiPath);
		if (responseJSON === false) {
			return false;
		}
		
		serverData.servers[clientId].allowsDl = responseJSON.MediaContainer.allowSync;
		
		// True here just meaning this request succeeded, nothing about the allowsDl field
		return true;
	};
	
	// Load server information for this user account from plex.tv API. Returns an async bool indicating success
	serverData.load = async function() {
		// Ensure access token
		let serverToken  = window.localStorage.getItem("myPlexAccessToken");
		let browserToken = window.localStorage.getItem("clientID");
		if (serverToken === null || browserToken === null) {
			errorHandle(`Cannot find a valid access token (localStorage Plex token missing).`);
			return false;
		}
		
		const apiResourceUrl = new URL("https://clients.plex.tv/api/v2/resources");
		apiResourceUrl.searchParams.set("includeHttps", "1");
		apiResourceUrl.searchParams.set("includeRelay", "1");
		apiResourceUrl.searchParams.set("X-Plex-Client-Identifier", browserToken);
		apiResourceUrl.searchParams.set("X-Plex-Token", serverToken);
		
		let resourceJSON;
		try {
			let response = await fetch(apiResourceUrl.href, { headers : { accept : "application/json" } });
			if (!response.ok) {
				// If Plex responds with non-OK, then there is a non-network related issue
				// Perhaps Plex is down, serving 500s?
				errorHandle(`Could not retrieve Plex resources: received HTTP ${response.status}`);
				return false;
			}
			
			resourceJSON = await response.json();
		} catch (exception) {
			switch (exception.name) {
				case "TypeError":
					errorHandle(`Network error occurred while retrieving Plex resources: ${exception.message}`);
					break;
				
				case "SyntaxError":
					errorHandle(`Could not parse JSON while retrieving Plex resources: ${exception.message}`);
					break;
					
				default:
					errorHandle(`Unknown error occurred while retrieving Plex resources: ${exception.message}`);
					break;
			}
			
			return false;
		}
		
		
		for (let i = 0; i < resourceJSON.length; i++) {
			let server = resourceJSON[i];
			if (server.provides !== "server") continue;
			
			if (!Object.hasOwn(server, "clientIdentifier") || !Object.hasOwn(server, "accessToken")) {
				errorHandle(`Cannot find valid server information (missing ID or token in API response).`);
				continue;
			}
			
			const clientId    = server.clientIdentifier;
			const accessToken = server.accessToken;
			
			const connection = server.connections.find(connection => (!connection.local && !connection.relay));
			if (!connection || !Object.hasOwn(connection, "uri")) {
				errorHandle(`Cannot find valid server information (no connection data for server ${clientId}).`);
				continue;
			}
			
			const baseUri = connection.uri;
			serverData.update({
				servers : {
					[clientId] : {
						baseUri     : baseUri,
						accessToken : accessToken,
						mediaData   : {},
						allowsDl    : "indeterminate",
					}
				}
			});
			
			
			const relay = server.connections.find(connection => (!connection.local && connection.relay));
			if (relay && Object.hasOwn(relay, "uri")) {
				// Can ignore a possible error here as this is only a fallback option
				const fallbackUri = relay.uri;
				serverData.update({
					servers : {
						[clientId] : {
							fallbackUri : fallbackUri,
						}
					}
				});
			}
			
			
			// Run checks
			serverData.update({
				servers : {
					[clientId] : {
						check : serverData.checkServer(clientId),
					}
				}
			});
		}
		
		return true;
	};
	
	// Keep trying loading server data if it happens to fail
	serverData.available = async function() {
		if (!(await serverData.promise)) {
			// Reload
			serverData.promise = serverData.load();
			
			// If this one doesn't work we just fail and try again later
			return await serverData.promise;
		}
		
		return true;
	};
	
	// Shorthand for updating server data on a media item entry
	serverData.updateMediaDirectly = function(clientId, metadataId, newData) {
		serverData.update({
			servers : {
				[clientId] : {
					mediaData : {
						[metadataId] : newData
					}
				}
			}
		});
	};
	
	// Merge media noda data, excluding any file metadata, into the serverData media cache
	serverData.updateMediaBase = function(clientId, mediaObject, topPromise, previousRecurse) {
		// New data to add to this media item
		let mediaObjectData = {
			title : mediaObject.title,
			index : 0,
		};
		
		// Index is used for sorting correctly when displayed in the modal
		// Some items are unindexed, and that's fine, they will be displayed in whatever order
		if (Object.hasOwn(mediaObject, "index")) {
			mediaObjectData.index = mediaObject.index;
		}
		
		// Determine title
		// Note if this is a parent item, its title may be overwritten by its children .parentTitle
		// Therefore, only leaves can have these special titles apply
		switch (mediaObject.type) {
			case "episode":
				mediaObjectData.title = `Episode ${mediaObject.index}: ${mediaObject.title}`;
				break;
			
			case "movie":
				mediaObjectData.title = `${mediaObject.title} (${mediaObject.year})`;
				break;
		}
		
		// Copy the top level promise in case this is a lower recursion level.
		// If this isn't a lower recursion level, the promise is already there.
		// NOTE: this causes a bug where a media item request that is followed by a 
		// children request can be double-requested if it itself is a child of something else.
		// The API recurse will go item1 -> children -> item2 -> children, ignoring that item2
		// may already be in the media cache with a resolved promise. To avoid this, there would
		// need to be a check here if a media object already exists in the cache and then abort
		// further media data updating for it and its children. This is very annoying, and mostly
		// the fault of collections containing TV shows.
		if (previousRecurse) {
			mediaObjectData.promise = topPromise;
		}
		
		// Merge new data
		serverData.updateMediaDirectly(clientId, mediaObject.ratingKey, mediaObjectData);
		
		// Shorthand to add a child entry, if not already present, into a parent
		// Also can merge potentially otherwise missing data that the child knows about the parent
		function updateParent(childId, parentId, otherData) {
			if (otherData) {
				serverData.updateMediaDirectly(clientId, parentId, otherData);
			}
			
			serverData.updateMediaDirectly(clientId, parentId, {
				children : [],
			});
			
			// Cannot use a Set object here, since the items are ordered
			if (!serverData.servers[clientId].mediaData[parentId].children.includes(childId)) {
				serverData.servers[clientId].mediaData[parentId].children.push(childId);
			}
		}
		
		// Handle parent, if neccessary
		if (Object.hasOwn(mediaObject, "parentRatingKey")) {
			let parentData = {
				title : mediaObject.parentTitle,
			};
			
			// Copy index for sorting if we have it
			if (Object.hasOwn(mediaObject, "parentIndex")) {
				parentData.index = mediaObject.parentIndex;
			}
			
			// Copy promise to parent (season), if this was part of a show request
			// This isn't strictly required, but it reduces double-requesting
			if (previousRecurse && previousRecurse.type === "show" && mediaObject.type === "episode") {
				parentData.promise = topPromise;
			}
			
			updateParent(mediaObject.ratingKey, mediaObject.parentRatingKey, parentData);
			
			
			// Handle grandparent, if neccessary
			if (Object.hasOwn(mediaObject, "grandparentRatingKey")) {
				let grandparentData = {
					title : mediaObject.grandparentTitle,
				};
				
				// Copy index for sorting if we have it
				if (Object.hasOwn(mediaObject, "grandparentIndex")) {
					grandparentData.index = mediaObject.grandparentIndex;
				}
				
				updateParent(mediaObject.parentRatingKey, mediaObject.grandparentRatingKey, grandparentData);
			}
		}
		
		// Update collection parent, if this was part of a collection
		// Collections are weird, they contain children but the child has no idea it's part of a collection (most of the time)
		if (previousRecurse && previousRecurse.type === "collection") {
			updateParent(mediaObject.ratingKey, previousRecurse.ratingKey);
		}
	};
	
	// Merge media node file metadata from API response into the serverData media cache
	serverData.updateMediaFileInfo = function(clientId, mediaObject, previousRecurse) {
		// Values we expect plus default values for fields needed by the modal
		let fileInfo = {
			key        : mediaObject.Media[0].Part[0].key,
			filesize   : mediaObject.Media[0].Part[0].size,
			filetype   : "?",
			resolution : "?",
			runtimeMS  : -1,
			viewed     : false,
		//	letterboxd : false,
		}
		
		// Replace forward slashes with backslashes, then use the last backslash
		// This is to work on both Windows and Unix filepaths
		let filename = mediaObject.Media[0].Part[0].file;
		filename = filename.replaceAll("/", "\\");
		filename = filename.slice(filename.lastIndexOf("\\") + 1);
		fileInfo.filename = filename;
		
		// Use multiple fallbacks in case something goes weird here
		if (Object.hasOwn(mediaObject.Media[0], "container")) {
			fileInfo.filetype = mediaObject.Media[0].container;
		} else if (Object.hasOwn(mediaObject.Media[0].Part[0], "container")) {
			fileInfo.filetype = mediaObject.Media[0].Part[0].container;
		} else if (fileInfo.key.lastIndexOf(".") !== -1) {
			fileInfo.filetype = fileInfo.key.slice(fileInfo.key.lastIndexOf(".") + 1);
		}
		
		if (Object.hasOwn(mediaObject.Media[0], "videoResolution")) {
			fileInfo.resolution = mediaObject.Media[0].videoResolution.toUpperCase();
			if ([ "144", "240", "480", "720", "1080" ].includes(fileInfo.resolution)) {
				// A specific p resolution
				fileInfo.resolution += "p"; 
			}
		}
		
		if (Object.hasOwn(mediaObject.Media[0], "duration")) {
			// Duration is measured in milliseconds
			fileInfo.runtimeMS = mediaObject.Media[0].duration;
		}
		
		// Checked viewcount for viewed flag
		if (Object.hasOwn(mediaObject, "viewCount") && mediaObject.viewCount !== 0) {
			fileInfo.viewed = true;
		}
		
		/*
		if (Object.hasOwn(mediaObject, "Guid")) {
			for (let i = 0; i < mediaObject.Guid.length; i++) {
				let id = mediaObject.Guid[i].id;
				if (id.startsWith("imdb://") || id.startsWith("tmdb://")) {
					fileInfo.letterboxd = `https://letterboxd.com/${id.slice(0,4)}/${id.slice(7)}`;
					break;
				}
			}
		}
		*/
		
		serverData.updateMediaDirectly(clientId, mediaObject.ratingKey, fileInfo);
	};
	
	// Recursive function that will follow children/leaves of an API call and store them all into mediaData
	// Returns an async bool of success
	serverData.recurseMediaApi = async function(clientId, apiPath, topPromise, previousRecurse) {
		let responseJSON = await serverData.apiCall(clientId, apiPath);
		if (responseJSON === false) {
			return false;
		}
		
		// Catch empty media items (can happen!)
		if (!Object.hasOwn(responseJSON.MediaContainer, "Metadata")) {
			return true;
		}
		
		const recursionPromises = [];
		
		/*
		// Possible better method than detecting /allLeaves vs /children
		let continueRecursion = true;
		if (Object.hasOwn(responseJSON.MediaContainer, "Directory")) {
			continueRecursion = false;
			let nextPath = responseJSON.MediaContainer.Directory[0].key;
			let recursion = serverData.recurseMediaApi(clientId, nextPath, topPromise, null);
			recursionPromises.push(recursion);
		}
		*/
		
		for (let i = 0; i < responseJSON.MediaContainer.Metadata.length; i++) {
			let mediaObject = responseJSON.MediaContainer.Metadata[i];
			
			// Record basic information about this media object before looking deeper into what it is
			serverData.updateMediaBase(clientId, mediaObject, topPromise, previousRecurse);
			
			// If this object has associated media, record its file information
			if (Object.hasOwn(mediaObject, "Media")) {
				serverData.updateMediaFileInfo(clientId, mediaObject, previousRecurse);
				continue;
			}
			
			// Otherwise, check if this object has children/leaves that need to be recursed
			if (Object.hasOwn(mediaObject, "leafCount") || Object.hasOwn(mediaObject, "childCount")) {
				let nextPath = `/library/metadata/${mediaObject.ratingKey}/children`;
				
				// Very stupid quirk of the Plex API: it will tell you something has leaves, but then calling allLeaves gives nothing.
				// Only when something has children AND leaves can you use allLeaves
				// (like a TV show could have 10 children (seasons) and 100 leaves (episodes))
				if (
					Object.hasOwn(mediaObject, "childCount") && 
					Object.hasOwn(mediaObject, "leafCount") && 
					(mediaObject.childCount !== mediaObject.leafCount)
				) {
					nextPath = `/library/metadata/${mediaObject.ratingKey}/allLeaves`;
				}
				
				let recursion = serverData.recurseMediaApi(clientId, nextPath, topPromise, mediaObject);
				recursionPromises.push(recursion);
				continue;
			}
		}
		
		return await Promise.all(recursionPromises);
	};
	
	// Start pulling an API response for this media item. Returns an async bool indicating success
	serverData.loadMediaData = async function(clientId, metadataId) {
		// Make sure server data has loaded in
		if (!(await serverData.available())) {
			return false;
		}
		
		// Get access token and base URI for this server
		if (!Object.hasOwn(serverData.servers[clientId], "baseUri") ||
		    !Object.hasOwn(serverData.servers[clientId], "accessToken")) {
			errorHandle(`No server information for clientId ${clientId} when trying to load media data`);
			return false;
		}
		
		// Make sure this server is alive and allows downloads
		if (!(await serverData.servers[clientId].check)) {
			// Check again if we couldn't complete the previous check
			serverData.servers[clientId].check = serverData.checkServer(clientId);
			if (!(await serverData.servers[clientId].check)) {
				// This should have already triggered an errorHandle at the failed request
				return false;
			}
		}
		
		if (serverData.servers[clientId].allowsDl === false && serverData.servers[clientId].baseUri !== `${location.protocol}//${location.host}`) {
			// Downloading disabled by server
			return false;
		}
		
		const promise = serverData.servers[clientId].mediaData[metadataId].promise;
		return await serverData.recurseMediaApi(clientId, `/library/metadata/${metadataId}`, promise);
	};
	
	// Try to ensure media data is loaded for a given item. Returns an async bool indicating if the item is available
	serverData.mediaAvailable = async function(clientId, metadataId) {
		if (serverData.servers[clientId].mediaData[metadataId].promise) {
			return await serverData.servers[clientId].mediaData[metadataId].promise;
		} else {
			// Note we don't create a request here as this method is used 
			// in handleHashChange to detect if we need to create a new request
			return false;
		}
	};
	
	
	
	// Parse current URL to get clientId and metadataId, or `false` if unable to match
	const metadataIdRegex = /^\/library\/(?:metadata|collections)\/(\d+)$/;
	const clientIdRegex   = /^\/server\/([a-f0-9]{40})\/(?:details|activity)$/;
	function parseUrl() {
		if (!location.hash.startsWith("#!/")) {
			return false;
		}
		
		// Use a URL object to parse the shebang
		let shebang = location.hash.slice(2);
		let hashUrl = new URL(`https://dummy.plex.tv${shebang}`);
		
		// URL.pathname should be something like:
		//  /server/fd174cfae71eba992435d781704afe857609471b/details 
		let clientIdMatch = clientIdRegex.exec(hashUrl.pathname);
		if (!clientIdMatch || clientIdMatch.length !== 2) {
			return false;
		}
		
		// URL.searchParams should be something like:
		//  ?key=%2Flibrary%2Fmetadata%2F25439&context=home%3Ahub.continueWatching~0~0 
		// of which we only care about ?key=[], which should be something like:
		//  /library/metadata/25439 
		let mediaKey = hashUrl.searchParams.get("key");
		let metadataIdMatch = metadataIdRegex.exec(mediaKey);
		if (!metadataIdMatch || metadataIdMatch.length !== 2) {
			return false;
		}
		
		// Get rid of regex match and retain only capturing group
		let clientId   = clientIdMatch[1];
		let metadataId = metadataIdMatch[1];
		
		return {
			clientId   : clientId,
			metadataId : metadataId,
		};
	}
	
	
	// Start fetching a media item from the URL parameters, storing promise in serverData
	// Also handles avoiding duplicate API calls for the same media item
	async function handleHashChange() {
		let urlIds = parseUrl();
		if (!urlIds) {
			// If not on the right URL to inject new elements, don't bother observing
			// Note: this assumes the URL which triggers pulling media data is the same URL which
			//       is where the new element and functionality is to be injected. This is 
			//       currently true but may change in future plex desktop app updates.
			DOMObserver.stop();
			return;
		}
		
		// URL matches, observe the DOM for when the injection point loads
		// Also handle readyState if this is the page we start on
		if (document.readyState === "loading") {
			document.addEventListener("DOMContentLoaded", DOMObserver.observe);
		} else {
			DOMObserver.observe();
		}
		
		// Create empty media entry early
		serverData.updateMediaDirectly(urlIds.clientId, urlIds.metadataId, {});
		
		if (!(await serverData.mediaAvailable(urlIds.clientId, urlIds.metadataId))) {
			let mediaPromise = serverData.loadMediaData(urlIds.clientId, urlIds.metadataId);
			serverData.servers[urlIds.clientId].mediaData[urlIds.metadataId].promise = mediaPromise;
		}
	}
	
	window.addEventListener("hashchange", handleHashChange);
	
	
	
	let download = {};
	
	download.frameClass = `${domPrefix}downloadFrame`;
	download.trigger = document.createElement("a");
	
	// Live collection of frames
	download.frames = document.getElementsByClassName(download.frameClass);
	
	// Initiate a download of a URI using iframes
	download.fromUri = function(uri, filename) {
		let frame = document.createElement("iframe");
		frame.className = download.frameClass;
		frame.name = `USERJSINJECTED-${randToken()}`;
		frame.style = "display: none !important;";
		document.body.append(frame);
		
		// Must be same origin to use specific file names, otherwise they are just ignored
		// Must use the <a> tag with the download and target attributes to do this without opening windows or tabs
		download.trigger.href     = uri;
		download.trigger.target   = frame.name;
		download.trigger.download = filename;
		download.trigger.click();
	};
	
	// Clean up old DOM elements from previous downloads, if needed
	download.cleanUp = function() {
		// There is no way to detect when the download dialog is closed, so just clean up here to prevent DOM clutter
		while (download.frames.length !== 0) {
			download.frames[0].remove();
		}
	};
	
	// Assemble download URI from key and base URI
	download.makeUri = function(clientId, metadataId) {
		const key         = serverData.servers[clientId].mediaData[metadataId].key;
		const baseUri     = serverData.servers[clientId].baseUri;
		const accessToken = serverData.servers[clientId].accessToken;
		
		const url = new URL(`${baseUri}${key}`);
		
		url.searchParams.set("X-Plex-Token", accessToken);
		url.searchParams.set("download", "1");
		
		return url.href;
	};
	
	// Download a media item, handling parents/grandparents
	download.fromMedia = function(clientId, metadataId) {
		if (Object.hasOwn(serverData.servers[clientId].mediaData[metadataId], "key")) {
			const uri = download.makeUri(clientId, metadataId);
			const filename = serverData.servers[clientId].mediaData[metadataId].filename;
			
			if (serverData.servers[clientId].allowsDl === false && uri.startsWith(`${location.protocol}//${location.host}`)) {
				let url = new URL(uri);
				url.searchParams.set("download", "0");
				download.fromUri(url.href, filename);
			} else {
				download.fromUri(uri, filename);
			}
		}
		
		if (Object.hasOwn(serverData.servers[clientId].mediaData[metadataId], "children")) {
			for (let i = 0; i < serverData.servers[clientId].mediaData[metadataId].children.length; i++) {
				let childId = serverData.servers[clientId].mediaData[metadataId].children[i];
				download.fromMedia(clientId, childId);
			}
		}
	};
	
	
	
	// Create and add the new DOM element, return a reference to it
	function modifyDom(injectionPoint) {
		// Clone the tag of the injection point element
		const downloadButton = document.createElement(injectionPoint.tagName);
		downloadButton.id = `${domPrefix}DownloadButton`;
		downloadButton.innerHTML = domElementInnerHTML;
		
		// Steal CSS from the injection point element by copying its class name
		downloadButton.className = `${domPrefix}element ${injectionPoint.className}`;
		
		// Apply custom CSS first
		downloadButton.style.cssText = domElementStyle;
		
		// Match the font used by the text content of the injection point
		// We traverse the element and select the first text node, then use its parent
		let textNode = (function findTextNode(parent) {
			for (let child of parent.childNodes) {
				if (child.nodeType === HTMLElement.TEXT_NODE) {
					return child;
				}
				
				if (child.hasChildNodes()) {
					let recurseResult = findTextNode(child);
					if (recurseResult) {
						return recurseResult;
					}
				}
			}
			
			return false;
		})(injectionPoint);
		
		// If no text node was found as a child of the injection point, fall back to the injection point itself
		let textParentNode = textNode ? textNode.parentNode : injectionPoint;
		
		// Get computed font and apply it
		let textNodeStyle = getComputedStyle(textParentNode);
		downloadButton.style.font  = textNodeStyle.getPropertyValue("font");
		downloadButton.style.color = textNodeStyle.getPropertyValue("color");
		
		// Starts disabled
		downloadButton.style.opacity = 0.5;
		downloadButton.disabled = true;
		
		switch (injectPosition.toLowerCase()) {
			case "after":
				injectionPoint.after(downloadButton);
				break;
			
			case "before":
				injectionPoint.before(downloadButton);
				break;
			
			default:
				errorHandle(`Invalid injection position: ${injectPosition}`);
				break;
		}
		
		return downloadButton;
	}
	
	
	// Activate DOM element and hook clicking with function. Returns an async bool indicating success
	async function domCallback(domElement, clientId, metadataId) {
		// Make sure server data has loaded in
		if (!(await serverData.available())) {
			domElement.title = "Failed to load Plex resource information.";
			return false;
		}
		
		// Make sure we have media data for this item
		if (!(await serverData.mediaAvailable(clientId, metadataId))) {
			if (serverData.servers[clientId].allowsDl === false) {
				// Nothing went wrong, this server just forbids downloads
				domElement.title = "This server is configured to disallow downloads.";
			} else {
				domElement.title = "Failed to load media information from this Plex server.";
			}
			return false;
		}
		
		// Hook function to button if everything works
		const downloadFunction = function(event) {
			event.stopPropagation();
			download.cleanUp();
			
			// Open modal box for group media items
			if (Object.hasOwn(serverData.servers[clientId].mediaData[metadataId], "children")) {
				modal.open(clientId, metadataId);
			} else {
				// Download immediately for single media items
				download.fromMedia(clientId, metadataId);
			}
		};
		domElement.addEventListener("click", downloadFunction);
		
		// Add the filesize on hover, if available
		if (Object.hasOwn(serverData.servers[clientId].mediaData[metadataId], "filesize")) {
			let filesize = makeFilesize(serverData.servers[clientId].mediaData[metadataId].filesize);
			domElement.title = filesize;
		}
		
		return true;
	}
	
	
	function init() {
		// Begin loading server data immediately
		serverData.promise = serverData.load();
		
		// Check the URL we loaded in on
		handleHashChange();
		
		// Check the callback immediately too, just in case the script was not loaded before the page did
		DOMObserver.callback();
	}
	
	init();
})();
