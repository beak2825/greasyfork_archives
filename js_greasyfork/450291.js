// ==UserScript==
// @name bilibili 选集样式
// @namespace leizingyiu.net
// @version 2022.09.02
// @description 搭配 https://greasyfork.org/zh-CN/scripts/447638 使用，优化 bilibili 选集时间显示
// @author leizingyiu <leizingyiu.net>
// @homepageURL https://www.leizingyiu.net
// @supportURL https://www.leizingyiu.net
// @license GNU AGPLv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bilibili.com/*
// @downloadURL https://update.greasyfork.org/scripts/450291/bilibili%20%E9%80%89%E9%9B%86%E6%A0%B7%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/450291/bilibili%20%E9%80%89%E9%9B%86%E6%A0%B7%E5%BC%8F.meta.js
// ==/UserScript==

(function() {
let css = `

	.multi-page .cur-list .list-box li .part {
		display: inline-block !important;
		overflow: unset !important;
		text-overflow: unset !important;
		flex-shrink: 1 !important;
		height: auto !important;
		white-space: break-spaces !important;
		line-height: 1.1em !important;
	}

	.multi-page .cur-list .list-box li {
		height: auto !important;
	}

	.multi-page .cur-list .list-box li a * {
		place-self: flex-start !important;
		line-height: 1.2em !important;
		padding: 0.2em 0 !important;
	}

	.base-video-sections .video-section-list .video-episode-card__info-title {
		overflow: unset !important;
		white-space: normal !important;
		padding: 0.2em 0 !important;
	}
	
	.video-episode-card__info-title {
		height: fit-content!important;
		max-height: fit-content!important;
	}

	.base-video-sections .video-section-list .video-episode-card__info {
		height: auto !important;
	}

	.base-video-sections .video-section-list .video-episode-card {
		height: auto !important;
	}

	.base-video-sections .video-section-list[style] {
		height: auto!important;
	}
	.base-video-sections .video-section-list[style="height: 0px;"] {
		height: 0!important;
	}



	.next-button .txt {
		word-break: keep-all;
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
