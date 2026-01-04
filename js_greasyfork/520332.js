// ==UserScript==
// @name OldSchool + Runescape.Wiki - Black Mode
// @namespace typpi.online
// @version 1.5.1
// @description Black theme for RS and OSRS Wiki.
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.runescape.wiki/*
// @match *://*.classic.runescape.wiki/*
// @downloadURL https://update.greasyfork.org/scripts/520332/OldSchool%20%2B%20RunescapeWiki%20-%20Black%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520332/OldSchool%20%2B%20RunescapeWiki%20-%20Black%20Mode.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "runescape.wiki" || location.hostname.endsWith(".runescape.wiki"))) {
		css += `
			#mw-panel,
			html {
				background: black;
			}

			* {
				color-scheme: dark;
				--body-background-image: url('/images/Old_School_RuneScape_Wiki_background_darkmode.jpg?f3b60');
				--body-background-color: #000000;
				--body-main: #121212;
				--body-light: #1d1d1d;
				--body-mid: #2c2c2c;
				--body-dark: #3a3a3a;
				--body-border: #444444;
				--link-color: #56aaff;
				--background-link-color: var(--link-color);
				--redlink-color: #ff4444;
				--text-color: #e6e6e6;
				--background-text-color: #e6e6e6;
				--byline-color: #888888;
				--subtle-color: var(--byline-color);
				--search-box: var(--body-light);
				--admin-blue: #0044ff;
				--bearcat-green: #00ff44;
				--awb-purple: #ff00ff;
				--sidebar: #444444;
				--button-background: #555555;
				--button-dark: #555555;
				--button-border: #555555;
				--button-light: #555555;
				--wikitable-header-bg: #2c2c2c;
				--wikitable-border: #121212;
				--wikitable-bg: #1d1d1d;
				--wikitable-bg-lighter: #2d2d2d;
				--wikitable-color: var(--text-color);
				--wikitable-alternating-bg: #2c2c2c;
				--table-na-background: rgb(0 0 0 / 20%);
				--table-na-color: var(--subtle-color);
				--table-yes-background: #2e5e05;
				--table-yes-color: #c3e8a3;
				--table-no-background: #801c13;
				--table-no-color: #fbc0ba;
				--table-maybe-background: #786300;
				--table-maybe-color: #fcea94;
				--droptable-text-color: #fff;
				--droptable-always-background: #0b5884;
				--droptable-common-background: #3c780a;
				--droptable-uncommon-background: #a48900;
				--droptable-rare-background: #b55e0c;
				--droptable-veryrare-background: #9f261e;
				--droptable-random-background: #984c89;
				--ooui-text: #e6e6e6;
				--ooui-interface: #2c2c2c;
				--ooui-interface-border: #3f3f3f;
				--ooui-window-background: rgb(25 25 25 / 60%);
				--ooui-input: #2d2d2d;
				--ooui-input-border: #3e3e3e;
				--ooui-input-border--hover: #555555;
				--ooui-normal: #1d1d1d;
				--ooui-normal--hover: #2d2d2d;
				--ooui-normal-border: #3a3a3a;
				--ooui-progressive: #555555;
				--ooui-progressive--hover: #757575;
				--ooui-accent: var(--link-color);
				--ooui-disabled: #444444;
				--ooui-disabled-border: #444444;
				--ooui-disabled-text: var(--ooui-text);
				--ooui-pending-background-image: repeating-linear-gradient(
					-45deg,
					var(--search-box),
					var(--search-box) 20px,
					var(--body-main) 20px,
					var(--body-main) 30px
				);
				--tile-border-color: var(--body-border);
				--tile-background-color: var(--body-light);
				--tile-link-button-color: var(--body-mid);
				--tile-link-button-highlight-color: #2a3956;
				--tile-dark-color: #fff;
				--tile-dark-bg: #5d6773;
				--tile-dark-link-color: #ccc;
				--tile-dark-byline-color: rgb(255 255 255 / 70%);
				--tile-dark-header-color: #fff;
				--documentation-background: var(--body-light);
				--documentation-border: var(--sidebar);
				--documentation-link-color: var(--link-color);
				--documentation-headers-color: var(--text-color);
				--documentation-header-background: var(--body-dark);
				--documentation-subheader-background: #1f293e;
				--base-text-color: var(--text-color);
				--base-heading-color: var(--text-color);
				--base-heading-border: var(--sidebar);
				--mainpage-recent-updates-description-color: var(
					--text-color
				);
				--thumb-bg: var(--body-mid);
				--thumb-caption-bg: var(--body-light);
				--diff-context-border-color: var(--body-mid);
				--diff-context-background: var(--body-mid);
				--diff-addedline-background: #438ab5;
				--diff-addedline-border-color: #438ab5;
				--diff-addedline-color: #fff;
				--diff-deletedline-background: #379541;
				--diff-deletedline-border-color: #379541;
				--diff-deletedline-color: #fff;
				--diff-inline-deletedline: #9f261e;
				--errorbox-bg: #801c13;
				--errorbox-border: #9f261e;
				--warningbox-bg: var(--errorbox-bg);
				--warningbox-border: var(--errorbox-border);
				--successbox-bg: #2e5e05;
				--successbox-border: #3c780a;
				--messagebox-obsolete-background: #464646;
				--messagebox-obsolete-border: #333;
				--messagebox-obsolete-color: #ddd;
				--messagebox-obsolete-link-color: #bbb;
				--messagebox-info-background: var(
					--messagebox-obsolete-background
				);
				--messagebox-info-border: var(
					--messagebox-obsolete-border
				);
				--messagebox-info-color: var(
					--messagebox-obsolete-color
				);
				--messagebox-info-link-color: var(
					--messagebox-obsolete-link-color
				);
				--messagebox-action-background: #45697d;
				--messagebox-action-border: #2d5266;
				--messagebox-action-color: var(--text-color);
				--messagebox-action-link-color: #b8d5e5;
				--messagebox-warn-background: #95271b;
				--messagebox-warn-border: #6b130a;
				--messagebox-warn-color: #f8ebe9;
				--messagebox-warn-link-color: #e8b8b3;
				--messagebox-safe-background: #1b8408;
				--messagebox-safe-border: #126802;
				--messagebox-safe-color: #e9f6e7;
				--messagebox-safe-link-color: #c1e0bb;
				--messagebox-disambig-background: var(
					--messagebox-obsolete-background
				);
				--messagebox-disambig-border: var(
					--messagebox-obsolete-border
				);
				--messagebox-disambig-color: var(
					--messagebox-obsolete-color
				);
				--messagebox-disambig-link-color: var(
					--messagebox-obsolete-link-color
				);
				--mw-code-background-color: #2c2c2c;
				--tabber-tab-bg: var(--body-light);
				--tabber-tab-border-color: var(--body-border);
				--tabber-active-tab-bg: var(--body-light);
				--tabber-active-tab-color: var(--text-color);
				--tabber-active-tab-hover-bg: var(--body-light);
				--tabber-active-tab-hover-border-color: var(
					--body-border
				);
				--tabber-active-tab-hover-color: var(--text-color);
				--tabber-active-tab-border-hider-color: var(
					--body-light
				);
				--tabber-inactive-tab-bg: var(--body-mid);
				--tabber-inactive-tab-border-color: var(--body-border);
				--tabber-inactive-tab-color: var(--text-color);
				--tabber-inactive-tab-hover-bg: var(--body-light);
				--tabber-inactive-tab-hover-border-color: var(
					--body-border
				);
				--scribuntoconsole-input: #3ea6e6;
				--scibuntoconsole-print: #f9d000;
				--scribuntoconsole-error: #ee4231;
				--scribuntoconsole-message: #6bc71f;
				--scribuntoconsole-tabcomplete: #855cd8;
				--scribuntoconsole-clear: #ee4231;
				--blockquote-color: var(--text-color);
				--coins-color: #6bc71f;
				--coins-pos-color: #3ea6e6;
				--coins-neg-color: #ee4231;
				--questdetails-header-background: var(--body-dark);
				--questdetails-header-background-alt: var(--body-dark);
				--fact-text-color: #3ea6e6;
				--production-selected-background: #3c780a;
				--production-selected-color: #fff;
				--wikipedia-border: var(--body-border);
				--wikipedia-background: var(--body-light);
				--keypress-background: var(--body-light);
				--keypress-border: var(--body-border);
				--keypress-color: var(--text-color);
				--ajaxpoll-background: var(--body-light);
				--ajaxpoll-text-color: var(--base-text-color);
				--ajaxpoll-answerbar-background: var(--body-mid);
				--ajaxpoll-answerbar-border: var(--body-border);
				--rc-negative-color: #ee4231;
				--rc-positive-color: #6bc71f;
				--filter-black-to-link: invert(63%) sepia(67%)
					saturate(242%) hue-rotate(182deg) brightness(93%)
					contrast(94%);
				--transcript-border-color: #596e96;
				--transcript-border-hover-color: #8596b7;
				--transcript-strikethrough-color: #fff;
				--navbox-background: var(--body-light);
				--navbox-border: var(--body-main);
				--navbox-title-background: var(--body-dark);
				--navbox-footer-background: var(
					--navbox-title-background
				);
				--navbox-group-title-background: var(
					--navbox-title-background
				);
				--infobox-bg: var(--body-light);
				--infobox-border: var(--body-border);
				--infobox-header: var(--body-dark);
				--infobox-subheader: var(--body-mid);
				--infobox-text-color: var(--text-color);
				--infobox-room-poh-color: #444e5a;
				--sourceeditor-input-background: var(--body-mid);
				--sourceeditor-background: var(--body-light);
				--sourceeditor-background-secondary: var(--body-mid);
				--sourceeditor-border: var(--body-main);
				--codemirror-gutter-background: var(--body-light);
				--toc-bg: var(--body-light);
				--toc-title-bg: var(--body-dark);
				--toc-border-color: var(--body-border);
				--toc-list-border-color: var(--body-border);
				--vector-tab-background: #222e45;
				--vector-tab-background--hover: #293753;
				--vector-tab-link-color: var(--background-link-color);
				--lighttable-bg-hover: #3c780a;
				--lighttable-bg-active: #2e5e05;
				--lighttable-link-color: #c3e8a3;
				--personal-links-bg: rgb(7 16 34 / 75%);
				--tbz-unlocked-background: repeating-linear-gradient(
					-45deg,
					#315d30 0 20px,
					#13421e 20px 30px
				);
				--tbz-unlocked-border-color: #00e417;
				--tbz-locked-background-color: #8a2525;
				--tbz-locked-border-color: #b32828;
				--tbz-partial-unlock-background: #5a5a5a;
				--tbz-partial-unlock-border-color: #13421e;
				--echo-icon-moon-bg-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg height='21' viewBox='0 0 21 21' width='21' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m8.85464918.37900488c-1.91149353 1.51069427-3.13816124 3.84973402-3.13816124 6.47527736 0 4.55564936 3.69308349 8.24873286 8.24873286 8.24873286 2.5815709 0 4.8861545-1.1859235 6.3986798-3.0426994-.8206378 4.7389755-4.9523867 8.343122-9.9259291 8.343122-5.56375572 0-10.07407088-4.5103151-10.07407088-10.0740709 0-5.02506013 3.67919933-9.19079725 8.49074856-9.95036192z' fill='%23cbd9f4' fill-rule='evenodd'/%3E%3C/svg%3E");
				--echo-icon-person-bg-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='13.836' viewBox='0 0 12 13.836'%3E%3Cpath fill='%23cbd9f4' d='M1.938,6.656c-1.32,1.485-1.47,3.15-0.97,4.25c0.323,0.707,0.78,1.127,1.313,1.375 c0.496,0.229,1.074,0.273,1.658,0.282c0.023,0,0.04,0.03,0.062,0.03h4.187c0.61,0,1.225-0.125,1.75-0.405 c0.527-0.28,0.961-0.718,1.188-1.376c0.335-0.964,0.175-2.529-1.094-4.03C9.094,7.954,7.68,8.719,6.065,8.719 c-1.677,0-3.182-0.812-4.125-2.063H1.938z'/%3E%3Cpath fill='%23cbd9f4' d='M6.063,0c-1.89,0-3.595,1.674-3.594,3.563C2.467,5.45,4.173,7.155,6.06,7.155 c1.89,0,3.564-1.705,3.563-3.593C9.625,1.673,7.95,0,6.063,0L6.063,0z'/%3E%3C/svg%3E");
				--echo-icon-bell-bg-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ctitle%3E bell %3C/title%3E%3Cpath fill='%23cbd9f4' d='M16 7a5.38 5.38 0 0 0-4.46-4.85C11.6 1.46 11.53 0 10 0S8.4 1.46 8.46 2.15A5.38 5.38 0 0 0 4 7v6l-2 2v1h16v-1l-2-2zm-6 13a3 3 0 0 0 3-3H7a3 3 0 0 0 3 3z'/%3E%3C/svg%3E");
				--echo-icon-tray-bg-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ctitle%3E tray %3C/title%3E%3Cpath fill='%23cbd9f4' d='M17 1H3a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2zm0 12h-4l-1 2H8l-1-2H3V3h14z'/%3E%3C/svg%3E");
				--echo-icon-cog-bg-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' width='20' height='20' viewBox='0 0 20 20'%3E%3Ctitle%3E settings %3C/title%3E%3Cg transform='translate(10 10)'%3E%3Cpath fill='%23cbd9f4' id='a' d='M1.5-10h-3l-1 6.5h5m0 7h-5l1 6.5h3'/%3E%3Cuse xlink:href='%23a' transform='rotate(45)'/%3E%3Cuse xlink:href='%23a' transform='rotate(90)'/%3E%3Cuse xlink:href='%23a' transform='rotate(135)'/%3E%3C/g%3E%3Cpath fill='%23cbd9f4' d='M10 2.5a7.5 7.5 0 0 0 0 15 7.5 7.5 0 0 0 0-15v4a3.5 3.5 0 0 1 0 7 3.5 3.5 0 0 1 0-7'/%3E%3C/svg%3E%0A");
				--echo-icon-fullscreen-bg-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ctitle%3E fullscreen %3C/title%3E%3Cg fill='%23cbd9f4'%3E%3Cpath d='M1 1v6h2V3h4V1zm2 12H1v6h6v-2H3zm14 4h-4v2h6v-6h-2zm0-16h-4v2h4v4h2V1z'/%3E%3C/g%3E%3Cscript xmlns=''/%3E%3C/svg%3E");
				--echo-icon-exitFullscreen-bg-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Ctitle%3E exit fullscreen %3C/title%3E%3Cg fill='%23cbd9f4'%3E%3Cpath d='M7 7V1H5v4H1v2zM5 19h2v-6H1v2h4zm10-4h4v-2h-6v6h2zm0-8h4V5h-4V1h-2v6z'/%3E%3C/g%3E%3Cscript xmlns=''/%3E%3C/svg%3E");
				--searchbutton-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath fill='%238cabe6' d='M12.2 13.6a7 7 0 1 1 1.4-1.4l5.4 5.4-1.4 1.4zM3 8a5 5 0 1 0 10 0A5 5 0 0 0 3 8z'/%3E%3C/svg%3E");
				--arrow-down: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath d='M11.05 3.996l-.965-1.053-4.035 3.86-3.947-3.86L1.05 3.996l5 5 5-5' fill='%23cbd9f4'/%3E%3C/svg%3E");
				--watch-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath fill='transparent' stroke='%238cabe6' stroke-width='.8' d='m8.1 1.1 2.2 4.5 4.8.7-3.5 3.4.9 4.8L8 12.2l-4.3 2.3.8-4.8L1 6.3l4.8-.7z'/%3E%3C/svg%3E%0A");
				--unwatch-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16'%3E%3Cpath fill='%238cabe6' stroke='%238cabe6' stroke-width='.8' d='m8.1 1.1 2.2 4.5 4.8.7-3.5 3.4.9 4.8L8 12.2l-4.3 2.3.8-4.8L1 6.3l4.8-.7z'/%3E%3C/svg%3E%0A");
				--external-icon: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%238cabe6' d='M6 1h5v5L8.86 3.85 4.7 8 4 7.3l4.15-4.16L6 1Z M2 3h2v1H2v6h6V8h1v2a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1Z'/%3E%3C/svg%3E");
				--ul-list-style-image: url("data:image/svg+xml,%3C%3Fxml version='1.0' encoding='UTF-8'%3F%3E%3Csvg xmlns='http://www.w3.org/2000/svg' width='5' height='13'%3E%3Ccircle cx='2.5' cy='9' r='2.5' fill='%23cbd9f4'/%3E%3C/svg%3E");
			}
		`;
}
if ((location.hostname === "classic.runescape.wiki" || location.hostname.endsWith(".classic.runescape.wiki"))) {
		css += `
			.mw-body {
				margin-top: 0;
				box-shadow: 0 0.25em 0.6em -0.15em rgb(0 0 0 / 15%);
				border-color: transparent;
			}
		`;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
