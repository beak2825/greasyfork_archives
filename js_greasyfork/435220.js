// ==UserScript==
// @name        4chan anonymize file names
// @namespace   a508vdvu3inxqz4zeagu
// @match       https://boards.4chan.org/*
// @match       https://boards.4channel.org/*
// @grant       none
// @version     1.1
// @description Anonymizes file names when posting on 4chan
// @inject-into content
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/435220/4chan%20anonymize%20file%20names.user.js
// @updateURL https://update.greasyfork.org/scripts/435220/4chan%20anonymize%20file%20names.meta.js
// ==/UserScript==

(function () {
	"use strict";

	const { window, document, Set, String, Math, performance, MutationObserver } = globalThis;
	const File = window.File;


	// Changes the file name to a random plausible timestamp
	const genFileName = (oldName) => {
		const minute = 60 * 1_000_000;  // microseconds
		const year = minute * 60 * 24 * 365;
		const now = Math.floor((performance.timeOrigin + performance.now()) * 1000);

		// Random timestamp 1 minute to 1 year in the past
		let newName = String(now - Math.floor(Math.random() * (year - minute + 1) + minute));

		const dot = oldName.lastIndexOf(".");
		if (dot !== -1) {
			// Copy over file extension
			newName += oldName.substring(dot).toLowerCase();
		}

		return newName;
	};


	// Set up UI elements (2 paired checkboxes)
	const checkbox = document.createElement("input");
	const label = document.createElement("label");
	const checkboxQR = document.createElement("input");
	const labelQR = document.createElement("label");

	checkbox.type = checkboxQR.type = "checkbox";
	label.title = labelQR.title =  "Send actual filename when uploading";

	label.append(checkbox, " Filename");
	labelQR.append(checkboxQR, " Filename");


	// Turn off file name rewriting via the checkboxes
	let rewritingEnabled = true;

	const checkboxListener = function () {
		rewritingEnabled = !this.checked;

		// Transfer state to the other checkbox since it's global
		if (this === checkbox) {
			checkboxQR.checked = this.checked;
		} else {
			checkbox.checked = this.checked;
		}
	};

	checkbox.addEventListener("input", checkboxListener);
	checkboxQR.addEventListener("input", checkboxListener);


	// Watch for forms being serialized, and change file names.
	window.addEventListener("formdata", ({ formData }) => {
		// Use global var instead of unregistering/re-registering this listener.
		// Keeping it in place ensures we always run first.
		if (!rewritingEnabled) {
			return;
		}

		// Gather keys pointing to at least 1 file entry.
		const fileEntries = new Set();

		for (const [key, val] of formData) {
			if (val instanceof File) {
				fileEntries.add(key);
			}
		}

		// For each key...
		for (const key of fileEntries) {
			// Get all entry values
			const values = formData.getAll(key);

			// Remove them
			formData.delete(key);

			// Re-add them
			for (const val of values) {
				// ... with a new file name, if it is a File.
				if (val instanceof File) {
					formData.append(key, val, genFileName(val.name));
				} else {
					formData.append(key, val);
				}
			}
		}
	}, { capture: true, passive: true });


	const tryAddQuickReply = () => {
		if (!labelQR.isConnected) {
			document.getElementById("qrFile")?.after(" ", labelQR);
		}
	};


	// Insert post form checkbox on load
	window.addEventListener("DOMContentLoaded", () => {
		document.getElementById("postFile").after(" ", label);
		tryAddQuickReply();

		// Wait for quick reply form to show up
		new MutationObserver(tryAddQuickReply).observe(document.body, { childList: true });
	});
})();
