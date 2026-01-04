// ==UserScript==
// @name         ScrollZoomer
// @namespace    https://greasyfork.org/en/scripts/536617-scrollzoomer
// @version      0.1
// @description  Zooms in shared screens on scroll
// @author       DonNadie
// @match        https://meet.google.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/536617/ScrollZoomer.user.js
// @updateURL https://update.greasyfork.org/scripts/536617/ScrollZoomer.meta.js
// ==/UserScript==

class ScrollZoomer {
	constructor() {
		document.body.addEventListener("wheel", (event) => {
			if (event.deltaY === 0) {
				return;
			}
			if (event.deltaY > 0) {
				this.zoomOut();
			} else {
				this.zoomIn();
			}
		});
	}

	zoomIn(secondAttempt) {
		const button = this.getButton("Zoom in");

		if (!button) {
			if (this.enableZoomButtons() && !secondAttempt) {
				setTimeout(() => {
					this.zoomIn(true);
				}, 400);
			} else {
				return;
			}
		}

		button.click();
	}

	zoomOut(secondAttempt) {
		const button = this.getButton("Zoom out");

		if (!button) {
			if (this.enableZoomButtons() && !secondAttempt) {
				setTimeout(() => {
					this.zoomOut(true);
				}, 400);
			} else {
				return;
			}
		}

		button.click();
	}

	enableZoomButtons() {
		const button = this.getButton("Zoom");

		if (!button) {
			return false;
		}
		button.click();
		return true;
	}

	getButton(text) {
		const result = document.evaluate(`//div[text()="${text}"]`, document, null, XPathResult.ANY_TYPE, null);
		if (!result) {
			return null;
		}

		const match = result.iterateNext();
		if (!match) {
			return null;
		}

		return match.parentElement.querySelector('button');
	}
}
new ScrollZoomer();