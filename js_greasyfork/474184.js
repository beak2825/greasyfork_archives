// ==UserScript==
// @name         Jnovels infinite scroll
// @namespace    http://tampermonkey.net/
// @version      0.4.3
// @license      MIT
// @description  Do the pagination automatically and filter out cards of little interest.
// @author       You
// @match        https://jnovels.com/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=jnovels.com
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/474184/Jnovels%20infinite%20scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/474184/Jnovels%20infinite%20scroll.meta.js
// ==/UserScript==

(function () {
	"use strict";

	GM_addStyle(`
.GM-filtered-out .featured-media, .GM-filtered-out .post-content, .GM-filtered-out .post-meta {
	display: none;
}

.GM-filtered-out {
	display: none;
}

@media only screen and (min-width: 600px) {
	.post-container article {
		height: 1150px;
		display: flex;
		flex-direction: column;
	}

	.post-container .post-content {
		flex: 1;
		overflow: auto;
	}
}

.GM-loading-page {
	width: 20px;
	height: 20px;
	left: calc(50% - 10px);
	display: inline-block;
	position: absolute;
	background: red;

	animation-name: spin;
	animation-duration: 500ms;
	animation-iteration-count: infinite;
	animation-timing-function: linear;
}

@keyframes spin {
	from {
		transform:rotate(0deg);
	}
	to {
		transform:rotate(360deg);
	}
}

.attachment-baskerville-2-post-thumbnail, .attachment-baskerville-2-post-image {
  filter: blur(15px);
  height: 100px !important;
}

@media only screen and (min-width: 600px) {
  .post-container article {
    height: 600px !important;
  }
}

#posts.posts {
    height: 100vh !important;
}
   `);

   async function loadNextPageIfScrolledToBottom() {
	const documentHeight = document.body.scrollHeight;
	const currentScroll = window.scrollY + window.innerHeight;
	// When the user is [modifier]px from the bottom, fire the event.
	const modifier = 400; // height of footer
	if (currentScroll + modifier > documentHeight) {
		await loadNextPage();

		loadNextPageIfScrolledToBottom();
	}
}

	document.addEventListener("scrollend", function () {
		loadNextPageIfScrolledToBottom();
	});

	setTimeout(async () => {
		doFiltering();

		await loadNextPage();
		await loadNextPage();
	}, 2 * 1000);

	async function loadNextPage() {
		const loadingEl = document.createElement("div");
		loadingEl.classList.add("GM-loading-page");
		document.querySelector(".nav-links").appendChild(loadingEl);

		try {
			const nextLinkEl = document.querySelector(".post-nav-older");
			const nextPageLink = nextLinkEl.href;

			const response = await fetch(nextPageLink);
			const respHtml = await response.text();

			const vDom = document.createElement("html");
			vDom.innerHTML = respHtml;

			const nextPostsEl = vDom.querySelectorAll("#posts .post-container");
			const mainPostEl = document.querySelector("#posts");
			nextPostsEl.forEach((postEl) => {
				postEl.classList.add("post-loaded", "fade-in");
				mainPostEl.appendChild(postEl);

				doFilteringOnPost(postEl);
			});

			const nextNavEl = vDom.querySelector(".posts-navigation");
			const mainNavEl = document.querySelector(".posts-navigation");
			mainNavEl.innerHTML = nextNavEl.innerHTML;
		} finally {
			loadingEl.remove();
		}
	}

	function doFiltering() {
		const mainPostsEl = document.querySelectorAll("#posts .post-container");
		mainPostsEl.forEach((postEl) => {
			doFilteringOnPost(postEl);
		});
	}

	const filterOutRegexes = [
		/Zerobooks ios Available/,
		/Zerobooks Light Novel Android & IOS App/,
		/Top Light Novels to Read/,
        /Support Needed/i,
		/\[Manga\]/i,
		/Pdf$/i,
        /moving new manga updates/i,
	];

	/**
	 * @param {Element} element
	 */
	function doFilteringOnPost(element) {
		element.removeAttribute("style");

		const title = element.querySelector("h1.post-title").textContent;
		if (filterOutRegexes.some((regex) => regex.test(title))) {
			element.classList.add("GM-filtered-out");
		}
	}
})();
