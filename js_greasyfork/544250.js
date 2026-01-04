// ==UserScript==
// @name 只用小红书搜索
// @namespace https://maxchang.me
// @version 0.0.3
// @description 使用小红书网页版作为搜索引擎，隐藏主页的时间线，搜索框页面居中。RAASE™ (Rednote as a Search Engine)
// @author Max Chang
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @include /^(?:^https://www\.xiaohongshu\.com/explore(?:\?.*)?$)$/
// @downloadURL https://update.greasyfork.org/scripts/544250/%E5%8F%AA%E7%94%A8%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/544250/%E5%8F%AA%E7%94%A8%E5%B0%8F%E7%BA%A2%E4%B9%A6%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function() {
let css = `
	#mfContainer {
		display: none;
	}
	.mask-paper {
		background: none!important;
		backdrop-filter: none!important;
		min-height: 100vh;
	}
	.input-box {
		top: 35%;
		left: 55% !important;
	}
	.side-bar {
		    z-index: 999;
	}
	@media screen and (max-width: 695px) {
		.input-box {
			width: 80% !important;
			padding: 0 84px 0 16px !important;
		}
		.min-width-search-icon {
			display: none !important
		}
		.input-button {
			opacity: 1 !important;
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
