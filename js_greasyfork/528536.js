// ==UserScript==
// @name			OzBargain Dark Mode Classic
// @namespace		http://tampermonkey.net/
// @version			0.7
// @description		The classic OzBargain Dark Mode from before the February 2025 site changes
// @match			https://www.ozbargain.com.au/*
// @icon			https://www.ozbargain.com.au/favicon.ico
// @run-at			document-start
// @grant			GM_addStyle
// @license			MIT
// @downloadURL https://update.greasyfork.org/scripts/528536/OzBargain%20Dark%20Mode%20Classic.user.js
// @updateURL https://update.greasyfork.org/scripts/528536/OzBargain%20Dark%20Mode%20Classic.meta.js
// ==/UserScript==

const css = `
[data-color-scheme="dark"] {
	/* main.css */
	--border-clr: #484848 !important;
	--borderhl-clr: #666 !important;
	--comment-hl-bg: #124 !important;
	--comment-op-bg: #333 !important;
	--comment-user-bg: #422 !important;
	--footer-bg: #080808 !important;
	--footer-fg: #888 !important;
	--input-fg: #ddd !important;
	--input-bg: #222226 !important;
	--input-border: #444 !important;
	--light-bg: #333338 !important;
	--light2-bg: #222226 !important;
	--link-fg: #89e !important;
	--link2-fg: #b0c0f0 !important;
	--linkv-fg: #abf !important;
	--meta-fg: #aaa !important;
	--meta-emphasis-fg: #aaa !important;
	--page-bg: #181818 !important;
	--page-fg: #c8c8c8 !important;
	--pageads-bg: #0000007f !important;
	--titlehl-fg: #f63 !important;
	--tooltip-clr: #666 !important;

	/* Inherited from light mode */
	--menu-fg: #000 !important;
	--navmenu-bg: #333 !important;

	/* live.css */
	--live-ad-bg: #030 !important;
	--live-comp-bg: #331 !important;
	--live-forum-bg: #003 !important;

	/* style.css */
	--menuhl-bg: #663300 !important;
	--shade1-bg: #cd6702 !important;
	--shade2-bg: #f7a859 !important;
	--shade3-bg: #b35a02 !important;
	--extra-birthday-bg: #7e5160 !important;
}

#forum > table th {
	background-color: var(--shade3-bg);
	color: #fff;
}

#tooltip-title {
	background-color: var(--tooltip-clr);
	color: #fff;
}

#noti-snippet > h3 {
	background-color: var(--shade3-bg);
	color: #fff;
}
`;

//Function to inject style
function injectStyle() {
	if (typeof GM_addStyle === 'function') {
		GM_addStyle(css);
	} else {
		const style = document.createElement('style');
		style.textContent = css;
		document.head.appendChild(style);
	}
}

//If <head> already exists, inject immediately
if (document.head) {
	injectStyle();
} else {
	//Fallback to observe DOM until <head> is available
	const observer = new MutationObserver(() => {
		if (document.head) {
			observer.disconnect();
			injectStyle();
		}
	});
	observer.observe(document.documentElement, { childList: true, subtree: true });
}