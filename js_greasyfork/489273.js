// ==UserScript==
// @name         Fix width of YouTube Desktop for small screen device (mobile)
// @namespace    Youtube desktop fix for mobile device
// @version      1.0.4
// @description  Fixes the width when viewing Youtube desktop mode on small screen device, useful when your using add-ons that is only available on desktop mode, ex: Comet - Reddit Comments on YouTube & Webpages, *use https://addons.mozilla.org/en-US/firefox/addon/uaswitcher/ some add-ons like comet works only when url don't contain "app=desktop"
// @match        https://www.youtube.com/*
// @grant        GM_addStyle
// @license      MIT
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/489273/Fix%20width%20of%20YouTube%20Desktop%20for%20small%20screen%20device%20%28mobile%29.user.js
// @updateURL https://update.greasyfork.org/scripts/489273/Fix%20width%20of%20YouTube%20Desktop%20for%20small%20screen%20device%20%28mobile%29.meta.js
// ==/UserScript==


// scale viewport to correct website width */
(function() {
    'use strict';
    var head = document.getElementsByTagName("head")[0];
    var meta = document.createElement("meta");
    meta.setAttribute("name", "viewport");
    meta.setAttribute("content", "width=device-width, initial-scale=1, maximum-scale=1");
    head.appendChild(meta);
})();


// apply user Agent, change it to your desired userAgent, or better use https://addons.mozilla.org/en-US/firefox/addon/uaswitcher/
Object.defineProperty(navigator, 'userAgent', {
  value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36 Edg/111.0.100.0'
});


// apply some css adjustment
function GM_addStyle(css) {
	let head = document.getElementsByTagName("head")[0];
	if (!head) {
		return;
	}
	let style = document.createElement("style");
    style.type = "text/css";
	style.innerHTML = css;
	head.appendChild(style);
}

GM_addStyle(`

	@media screen and (max-width: 999px) {
		div.style-scope[id="related"] {
			display: none !important;
		}

		ytd-watch-flexy[flexy] {
			--ytd-watch-flexy-min-player-width: 100vw !important;
		}

		.video-stream {
			width: 100vw !important;
			height: calc(100vw * var(--ytd-watch-flexy-height-ratio) / var(--ytd-watch-flexy-width-ratio)) !important;
		}

		ytd-watch-flexy[flexy]:not([fixed-panels]) #primary.ytd-watch-flexy {
			margin-left: 0 !important;
			padding-right: 0 !important;
		}

		#bottom-row.ytd-watch-metadata,
		#description.ytd-watch-metadata,
		#description-inner.ytd-watch-metadata {
			margin-left: 0 !important;
			margin-right: 0 !important;
			min-width: 100vw !important;
			max-width: 100vw !important;
		}

		#columns {
			overflow-x: hidden !important;
		}

		#container.ytd-player video {
			width: 100vw !important !important;
		}

		.ytp-progress-bar-container {
			width: calc(100vw - 20px) !important;
			left: 10px !important;
			bottom: 56px !important;
		}
		.ytp-progress-list,
        .ytp-progress-bar-padding {
             width: calc(100vw - 20px) !important;
        }
		#description-inner.ytd-watch-metadata,
		#description-inner {
			margin-left: 0px  !important;
			margin-right: 0px  !important;
		}

		.ytp-chrome-bottom {
			width: 100vw !important;
			left: 0 !important;
		}

		.ytp-tooltip {
			display: none !important;
		}

		#dismissible.ytd-video-renderer {
			flex-direction: column !important;
		}

		ytd-video-renderer[use-bigger-thumbs][bigger-thumbs-style="BIG"] ytd-thumbnail.ytd-video-renderer {
			max-width: calc(100vw - 48px) !important;
            min-width: calc(100vw - 48px) !important;
			margin: 0 0 16px 0 !important;
		}

		ytd-video-renderer[use-search-ui] .text-wrapper.ytd-video-renderer {
			max-width: calc(100vw - 48px) !important;
		}

		#thumbnail.ytd-expandable-metadata-renderer {
			display: none !important;
		}
	}

`);
