// ==UserScript==
// @name              Tweak GitHub Icon
// @name:zh-CN        修改 GitHub 图标
// @description       Tweak the icon of GitHub's website into white color & transparent background for better contrast on dark tab backgrounds etc. , especially for dark-themed browser. White, dark and black colors as well as white, dark, black and transparent backgrounds are all predifined in case of you need to modify them. Require SVG icon support.
// @description:zh-CN 将 GitHub 的网站图标改为亮色透明背景，改善暗色标签页背景等环境下图标的对比度，适合使用暗色主题的浏览器。内置 亮、暗、黑 三种前景色和 亮、暗、黑、透明 四种背景色可供直接修改。浏览器需支持 SVG 图标。
// @namespace         RainSlide
// @version           1.1
// @license           blessing
// @icon              https://github.githubassets.com/pinned-octocat.svg
// @match             https://github.com/*
// @grant             none
// @inject-into       context
// @run-at            document-idle
// @downloadURL https://update.greasyfork.org/scripts/392651/Tweak%20GitHub%20Icon.user.js
// @updateURL https://update.greasyfork.org/scripts/392651/Tweak%20GitHub%20Icon.meta.js
// ==/UserScript==

if (
	document.head.querySelector('[rel="icon"]') &&
	document.head.querySelector('[rel="icon"]').href
) {

	function getSVGDataURL( color, background ) {
		// SVG source code based on https://github.githubassets.com/pinned-octocat.svg , all the rights belong to GitHub.Inc .
		return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 36 36'" + background + "%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd'" + color + " d='M18 1.4C9 1.4 1.7 8.7 1.7 17.7c0 7.2 4.7 13.3 11.1 15.5.8.1 1.1-.4 1.1-.8v-2.8c-4.5 1-5.5-2.2-5.5-2.2-.7-1.9-1.8-2.4-1.8-2.4-1.5-1 .1-1 .1-1 1.6.1 2.5 1.7 2.5 1.7 1.5 2.5 3.8 1.8 4.7 1.4.1-1.1.6-1.8 1-2.2-3.6-.4-7.4-1.8-7.4-8.1 0-1.8.6-3.2 1.7-4.4-.2-.4-.7-2.1.2-4.3 0 0 1.4-.4 4.5 1.7 1.3-.4 2.7-.5 4.1-.5 1.4 0 2.8.2 4.1.5 3.1-2.1 4.5-1.7 4.5-1.7.9 2.2.3 3.9.2 4.3 1 1.1 1.7 2.6 1.7 4.4 0 6.3-3.8 7.6-7.4 8 .6.5 1.1 1.5 1.1 3v4.5c0 .4.3.9 1.1.8 6.5-2.2 11.1-8.3 11.1-15.5C34.3 8.7 27 1.4 18 1.4z'/%3E%3C/svg%3E";
	}

	// Insert SVG element attribute code but not color hex code for a cleaner transparent background code
	var C = function getColor(color) {
		return " fill='%23" + color + "'";
	};
	var B = function getBackground(color) {
		return " style='background-color:%23" + color + "'";
	};

	var white_color = C("fff"),   white_background = B("fff"),
	     dark_color = C("191717"), dark_background = B("191717"),
	    black_color = C("000"),   black_background = B("000"),
	transparent_background = "";

	document.head.querySelector('[rel="icon"]').href =
		getSVGDataURL( white_color, transparent_background );

}