// ==UserScript==
// @name 虎扑移动端适配
// @namespace github.com/openstyles/stylus
// @version 1.0.0
// @description A new userstyle for hupu.
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.hupu.com/*
// @downloadURL https://update.greasyfork.org/scripts/445591/%E8%99%8E%E6%89%91%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/445591/%E8%99%8E%E6%89%91%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D.meta.js
// ==/UserScript==

(function() {
let css = `
		.backToTop_2mZa6 {
			display: none !important;
		}

		.gamecenter {
			display: none;
		}

		.footer-floor {
			display: none;
		}

		@media screen and (max-width: 1050px) {
			body {
				width: 100vw !important;
				overflow-x: hidden;
			}

			.bannerlogonew {
				display: none !important;
			}

			.hp-topbarNav-bd {
				display: none;
			}

			.bbs-index-web-header {
				width: 100vw;
			}

			.banneritem {
				float: left;
				font-size: 10px;
				overflow: auto;
			}

			.hp-pc-rc-menu-banner {
				width: 100vw;
			}

			.bbs-index-web-right {
				display: none;
			}

			.cardListContainer {
				display: none;
			}

			.bbs-index-web-middle {
				width: 100vw !important;
			}

			.middle-label-noneleft {
				width: 90vw !important;
			}

			.bbs-index-web-body {
				width: 100vw !important;
			}

			.bbs-index-web-holder {
				width: 100vw !important;
			}

			.flex-shrink {
				width: 100vw !important;
			}

			.list-item {
				height: 50vh;
				width: 90vw;
			}

			.list-item-desc-has.list-item-desc {
				display: none !important;
			}
		}
	`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
