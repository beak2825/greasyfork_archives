// ==UserScript==
// @name         YouTube ?si Remover
// @namespace    https://code.pepega.club/
// @version      0.1
// @description  Remove the YouTube Share tracking parameter
// @author       33KK
// @match        https://www.youtube.com/*
// @icon         https://www.youtube.com/favicon.ico
// @license      CC-0
// @downloadURL https://update.greasyfork.org/scripts/476364/YouTube%20si%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/476364/YouTube%20si%20Remover.meta.js
// ==/UserScript==

const hookSetter = (object, property, callback) => {
	let objectPrototype = Object.getPrototypeOf(object);
	if (objectPrototype.hasOwnProperty(property)) {
		let descriptor = Object.getOwnPropertyDescriptor(objectPrototype, property);
		Object.defineProperty(object, property, {
			get: function () {
				return descriptor.get.call(this);
			},
			set: function (value) {
				descriptor.set.call(this, callback.call(this, this[property], value));
			},
		});
	}
};

const onNodeAdded = (root, selector, args, callback) => {
	const observer = new MutationObserver((mutations) => {
		for (const mutation of mutations) {
			for (const node of mutation.addedNodes) {
				if (node.matches && node.matches(selector)) {
					if (callback(node)) {
						observer.disconnect();
					}
				}
			}
		}
	});

	observer.observe(root, {
		childList: true,
		...args,
	});

	const node = root.querySelector(selector);

	if (node) {
		if (callback(node)) {
			observer.disconnect();
		}
	}
};

const removeSi = (url) => {
	const parsed = new URL(url);
	parsed.searchParams.delete("si");
	return parsed.href;
};

onNodeAdded(
	document.querySelector("ytd-app"),
	"ytd-popup-container",
	{},
	(node) => {
		console.log("Found ytd-popup-container");

		onNodeAdded(node, "yt-copy-link-renderer", { subtree: true }, (node) => {
			console.log("Found yt-copy-link-renderer");

			const urlField = node.querySelector("input#share-url");

			urlField.value = removeSi(urlField.value);
			hookSetter(urlField, "value", (oldValue, newValue) => removeSi(newValue));
		});

		return true;
	},
);
