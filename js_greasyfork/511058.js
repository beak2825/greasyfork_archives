// ==UserScript==
// @name         Reddit - Big Card View
// @namespace    1N07
// @version      0.3.1
// @description  Makes the card view on Reddit bigger and improves ways content is displayed to go along with that.
// @author       1N07
// @license      Unlicense
// @match        https://www.reddit.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require      https://update.greasyfork.org/scripts/511046/1457685/DeindentTemplateLiteralString.js
// @run-at       document-body
// @grant        GM_addStyle
// @grant        GM_addElement
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/511058/Reddit%20-%20Big%20Card%20View.user.js
// @updateURL https://update.greasyfork.org/scripts/511058/Reddit%20-%20Big%20Card%20View.meta.js
// ==/UserScript==

(() => {
	//initialize settings
	let MainContainerWidthHandle;
	let MainContainerWidth = GM_getValue("MainContainerWidth", "75%");
	SetMainContainerWidthHandle();
	let PostImageHeightHandle;
	let PostImageHeight = GM_getValue("PostImageHeight", "70vh");
	SetPostImageHeightHandle();

	//add main stylesheet to DOM
	GM_addStyle(`
		.subgrid-container {
			max-width: calc(100vw - 272px);
			width: calc(100vw - 272px);
		}
		.main-container {
			justify-content: center;
		}
		#main-content {
			max-width: 100%;
			width: ${MainContainerWidth};
		}
		#right-sidebar-container:has(> aside) {
			display: none;
		}
		#main-content:has(+ #right-sidebar-container > aside) {
			max-width: 100%;
		}

		/*Single image post height*/
			#main-content [slot='post-media-container'] shreddit-aspect-ratio{
			--max-height: min(100%, ${PostImageHeight}) !important;
		}

		#main-content [slot='post-media-container'] gallery-carousel ul {
			column-gap: 5px;
		}

		#main-content [slot='post-media-container'] gallery-carousel ul > li {
			visibility: visible !important;
		}
  `);

	//start tracking multi image carousels to improve on how they are displayed.
	setInterval(() => {
		const carousels = document.querySelectorAll(
			"#main-content [slot='post-media-container'] gallery-carousel:not(.rbcv-carousel-height-set)",
		);
		for (const carousel of carousels) {
			const faceplate =
				carousel.shadowRoot?.querySelector("faceplate-carousel");
			if (faceplate) {
				faceplate.style.maxHeight = "70vh";
				faceplate.style.height = "70vh";

				carousel.classList.add("rbcv-carousel-height-set");

				const carouselImgs = carousel.querySelectorAll(
					"ul > li img:not(.rbcv-image-handled)",
				);
				for (const carouselImg of carouselImgs) {
					if (!TrySetCarouselImgWidth(carouselImg)) {
						carouselImg.onload = (e) => {
							e.target.onload = null;
							TrySetCarouselImgWidth(e.target);
						};
					}
					if (!carouselImg.src)
						carouselImg.src = carouselImg.getAttribute("data-lazy-src");
					carouselImg.classList.add("rbcv-image-handled");
				}
			}
		}
	}, 500);

	//=== FUNCTIONS ===//
	function TrySetCarouselImgWidth(img) {
		//TODO: check if image is too wide for carousel, if so, set width so it fits, preserving ratio. i.e. set smaller height.
		if (img?.naturalWidth > 0) {
			const naturalRatio = img.naturalWidth / img.naturalHeight;
			const calculatedWidth = img.clientHeight * naturalRatio;

			if (img.parentNode?.tagName === "LI") {
				const slot = img.parentNode.getAttribute("slot");
				const postId = img.closest("gallery-carousel").getAttribute("post-id");
				GM_addElement(img.parentNode, "style", {
					class: "carousel-image-widths",
					textContent: `gallery-carousel[post-id="${postId}"] li[slot=${slot}] { width: ${calculatedWidth}px !important; }`,
				});
			}
			return true;
		}

		return false;
	}
	function SetMainContainerWidthHandle() {
		GM_unregisterMenuCommand(MainContainerWidthHandle);

		MainContainerWidthHandle = GM_registerMenuCommand(
			`Set main reddit content container width (${MainContainerWidth}) -click to change-`,
			() => {
				const newMainContainerWidth = prompt(
					Deindent(`
						Set main reddit content container width.
						Values that would result in a main container wider than the viewport, fallback to 100% width.
						Use any valid CSS unit value.
                    `),
					MainContainerWidth,
				);
				if (newMainContainerWidth) {
					MainContainerWidth = newMainContainerWidth;
					GM_setValue("MainContainerWidth", MainContainerWidth);
					SetMainContainerWidthHandle();

					if (
						confirm(
							'Press "OK" to refresh the page to apply new settings or "cancel" refresh and apply later.',
						)
					) {
						location.reload();
					}
				}
			},
		);
	}
	function SetPostImageHeightHandle() {
		GM_unregisterMenuCommand(PostImageHeightHandle);

		PostImageHeightHandle = GM_registerMenuCommand(
			`Set post image height (${PostImageHeight}) -click to change-`,
			() => {
				const newPostImageHeight = prompt(
					Deindent(`
						Set post image height.
						Use any valid CSS unit value.
                    `),
					PostImageHeight,
				);
				if (newPostImageHeight) {
					PostImageHeight = newPostImageHeight;
					GM_setValue("PostImageHeight", PostImageHeight);
					SetPostImageHeightHandle();

					if (
						confirm(
							'Press "OK" to refresh the page to apply new settings or "cancel" refresh and apply later.',
						)
					) {
						location.reload();
					}
				}
			},
		);
	}
})();
