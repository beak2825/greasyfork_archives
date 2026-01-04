// ==UserScript==
// @name           Huggingface Image Downloader
// @description    Add buttons to quickly download images from Stable Diffusion models
// @author         Isaiah Odhner
// @namespace      https://isaiahodhner.io
// @version        1.4
// @license        MIT
// @match          https://*.hf.space/*
// @match          https://*.huggingface.co/*
// @icon           https://www.google.com/s2/favicons?sz=64&domain=huggingface.co
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/455267/Huggingface%20Image%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/455267/Huggingface%20Image%20Downloader.meta.js
// ==/UserScript==

// v1.1 adds support for Stable Diffusion 2. It expands the domain scope to match other applications on HuggingFace, and includes negative prompts in the filename, with format: "'<positive>' (anti '<negative>')".
// v1.2 handles updated DOM structure of the site
// v1.3 adds support for more Huggingface spaces, including https://huggingface.co/nerijs/pixel-art-xl and https://huggingface.co/spaces/songweig/rich-text-to-image and https://huggingface.co/spaces/Yntec/ToyWorldXL
//   These changes may result in false positives, i.e. unnecessary download buttons showing up. Let me know if this happens.
//   Show-on-hover code is simplified (at some negligible performance cost), and this may fix some interaction issues.
// v.14 fixes detection of the prompt input (used for the download filename) for https://huggingface.co/spaces/songweig/rich-text-to-image which uses nested iframes,
//   as well as some other spaces.
//   It also fixes an unnecessary download button for the user-uploaded input image in https://huggingface.co/spaces/editing-images/ledits

setInterval(() => {
	// assuming prompt comes before negative prompt in DOM for some of these fallbacks
	// TODO: look for "prompt"/"negative" in surrounding text (often not in a <label>) before looking for any input
	const genericInputSelector = 'input[type="text"][required], [contenteditable="true"], textarea, input[type="text"]';
	const promptInputSelector = '#prompt-text-input input, [name=prompt], [placeholder*="prompt"], [placeholder*="sentence here"], .ql-editor';
	const negativeInputSelector = '#negative-prompt-text-input input, [name=negative-prompt], [placeholder*="negative prompt"], [placeholder*="blurry"], [placeholder*="worst quality"], [placeholder*="low quality"]';
	const imageSelector = ".grid img, #gallery img, .grid-container img, .thumbnail-item img, img[src^='blob:'], img[src^='data:']";
	// #input_image is for https://huggingface.co/spaces/editing-images/ledits
	// Other spaces probably have other IDs for similar purposes.
	const excludeImageParentSelector = "#input_image";

	let input = querySelector(promptInputSelector) || querySelector(genericInputSelector);
	let negativeInput = querySelector(negativeInputSelector) || querySelector(genericInputSelector.split(",").map((selector) => `[id*="negative"] ${selector}`).join(","));
	// console.log(input, negativeInput);

	if (negativeInput === input) {
		negativeInput = null;
	}

	// const dlButtons = [];
	for (const img of document.querySelectorAll(imageSelector)) {
		if (img.closest(excludeImageParentSelector)) {
			continue; // don't add a download button for the input image
		}
		const existingA = img.parentElement.querySelector("a");
		if (existingA) {
			if (existingA._imgSrc !== img.src) {
				existingA.remove();
				// const index = dlButtons.indexOf(existingA);
				// if (index > -1) {
				// 	dlButtons.splice(index);
				// }
			} else {
				continue; // don't add a duplicate <a> or change the supposed prompt it was generated with
			}
		}

		const a = document.createElement("a");
		a.style.position = "absolute";
		a.style.opacity = "0";
		a.style.top = "0";
		a.style.left = "0";
		a.style.background = "black";
		a.style.color = "white";
		a.style.borderRadius = "5px";
		a.style.padding = "5px";
		a.style.margin = "5px";
		a.style.fontSize = "50px";
		a.style.lineHeight = "50px";
		a.textContent = "Download";
		a._imgSrc = img.src;

		let filename = sanitizeFilename(location.pathname.replace(/^spaces\//, ""));
		if (input) {
			filename = `'${sanitizeFilename(input.value || input.textContent)}'`;
			if (negativeInput) {
				filename += ` (anti '${sanitizeFilename(negativeInput.value || negativeInput.textContent)}')`;
			}
		}
		filename += ".jpeg";
		a.download = filename;

		a.href = img.src;
		img.parentElement.append(a);
		if (getComputedStyle(img.parentElement).position == "static") {
			img.parentElement.style.position = "relative";
		}
		// dlButtons.push(a);

		// Can't be delegated because it needs to stop the click event from bubbling up to the handler that zooms in
		a.addEventListener("click", (event) => {
			// Prevent also zooming into the image when clicking Download
			event.stopImmediatePropagation();
		});

		showOnHover(a, img.closest(".gallery-item, .thumbnail-item") || img.parentElement);
	}
}, 300);

function querySelector(selector, doc = document) {
	// Look in the current document, then in any iframes
	// because for example https://huggingface.co/spaces/songweig/rich-text-to-image
	// uses a contenteditable div in an iframe (file=rich-text-to-json-iframe.html),
	// within an iframe (https://songweig-rich-text-to-image.hf.space/?__theme=light).
	// This might not need to be recursive, since the images will be within the top-level iframe,
	// and thus this script will work by injection into that iframe. Might as well though.
	const el = doc.querySelector(selector);
	if (el) {
		return el;
	}
	for (const iframe of doc.querySelectorAll("iframe")) {
		try {
			const el = querySelector(selector, iframe.contentDocument);
			if (el) {
				return el;
			}
		} catch (e) { }
	}
	return null;
}

function showOnHover(revealElement, container) {
	// Show the revealElement when hovering over the container
	container.addEventListener("mouseenter", (event) => {
		revealElement.style.opacity = "1";
	});
	container.addEventListener("mouseleave", (event) => {
		revealElement.style.opacity = "0";
	});
	// Hide the revealElement when the mouse leaves the document,
	// since the mouseleave event might not fire if the mouse moves fast enough outside the iframe or window
	document.addEventListener("mouseleave", (event) => {
		revealElement.style.opacity = "0";
	});
}

function sanitizeFilename(str) {
	// Sanitize for file name, replacing symbols rather than removing them
	str = str.replace(/\//g, "⧸");
	str = str.replace(/\\/g, "⧹");
	str = str.replace(/</g, "ᐸ");
	str = str.replace(/>/g, "ᐳ");
	str = str.replace(/:/g, "꞉");
	str = str.replace(/\|/g, "∣");
	str = str.replace(/\?/g, "？");
	str = str.replace(/\*/g, "∗");
	str = str.replace(/(^|[-—\s(\["])'/g, "$1\u2018");  // opening singles
	str = str.replace(/'/g, "\u2019");                  // closing singles & apostrophes
	str = str.replace(/(^|[-—/\[(‘\s])"/g, "$1\u201c"); // opening doubles
	str = str.replace(/"/g, "\u201d");                  // closing doubles
	str = str.replace(/--/g, "\u2014");                 // em-dashes
	str = str.replace(/\.\.\./g, "…");                  // ellipses
	str = str.replace(/~/g, "\u301C");                  // Chrome at least doesn't like tildes
	str = str.trim();
	return str;
}
