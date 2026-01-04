// ==UserScript==
// @name cssportal.com - Dark Mode
// @namespace typpi.online
// @version 1.0.3
// @description Dark theme for CSS Portal
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.cssportal.com/*
// @downloadURL https://update.greasyfork.org/scripts/522862/cssportalcom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/522862/cssportalcom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	html,
	img,
	svg,
	video,
	iframe {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	:root [data-topbar='dark'],
	[data-bs-theme='light'] [data-topbar='dark'] {
		--bs-header-bg: #cdc5e5 !important;
		--bs-header-item-color: #f8f9fa;
		--bs-header-item-sub-color: #8795ab;
	}

	:root,
	[data-bs-theme='light'] {
		--bs-blue: #5156be;
		--bs-indigo: #564ab1;
		--bs-purple: #6f42c1;
		--bs-pink: #e83e8c;
		--bs-red: #fd625e;
		--bs-orange: #f1734f;
		--bs-yellow: #ffbf53;
		--bs-green: #2ab57d;
		--bs-teal: #050505;
		--bs-cyan: #4ba6ef;
		--bs-black: #000;
		--bs-white: #fff;
		--bs-gray: #74788d;
		--bs-gray-dark: #2c302e;
		--bs-gray-100: #f8f9fa;
		--bs-gray-200: #e9e9ef;
		--bs-gray-300: #f6f6f6;
		--bs-gray-400: #ced4da;
		--bs-gray-500: #adb5bd;
		--bs-gray-600: #74788d;
		--bs-gray-700: #313533;
		--bs-gray-800: #2c302e;
		--bs-gray-900: #212529;
		--bs-primary: #5156be;
		--bs-secondary: #74788d;
		--bs-success: #2ab57d;
		--bs-info: #4ba6ef;
		--bs-warning: #ffbf53;
		--bs-danger: #fd625e;
		--bs-light: #e9e9ef;
		--bs-dark: #2c302e;
		--bs-primary-rgb: 81, 86, 190;
		--bs-secondary-rgb: 116, 120, 141;
		--bs-success-rgb: 42, 181, 125;
		--bs-info-rgb: 75, 166, 239;
		--bs-warning-rgb: 255, 191, 83;
		--bs-danger-rgb: 253, 98, 94;
		--bs-pink-rgb: 232, 62, 140;
		--bs-light-rgb: 233, 233, 239;
		--bs-dark-rgb: 44, 48, 46;
		--bs-primary-text: #393c85;
		--bs-secondary-text: #313533;
		--bs-success-text: #196d4b;
		--bs-info-text: #2d648f;
		--bs-warning-text: #997332;
		--bs-danger-text: #ca4e4b;
		--bs-light-text: #74788d;
		--bs-dark-text: #2c302e;
		--bs-primary-bg-subtle: #b9bbe5;
		--bs-secondary-bg-subtle: #ced4da;
		--bs-success-bg-subtle: #aae1cb;
		--bs-info-bg-subtle: #b7dbf9;
		--bs-warning-bg-subtle: #ffe5ba;
		--bs-danger-bg-subtle: #fec0bf;
		--bs-light-bg-subtle: #fbfbfb;
		--bs-dark-bg-subtle: #adb5bd;
		--bs-primary-border-subtle: #a8abdf;
		--bs-secondary-border-subtle: #ced4da;
		--bs-success-border-subtle: #7fd3b1;
		--bs-info-border-subtle: #93caf5;
		--bs-warning-border-subtle: #ffd998;
		--bs-danger-border-subtle: #fea19e;
		--bs-light-border-subtle: #f6f6f6;
		--bs-dark-border-subtle: #adb5bd;
		--bs-white-rgb: 255, 255, 255;
		--bs-black-rgb: 0, 0, 0;
		--bs-body-color-rgb: 49, 53, 51;
		--bs-font-sans-serif: 'Poppins', sans-serif;
		--bs-font-monospace: sfmono-regular, menlo, monaco,
			consolas, 'Liberation Mono', 'Courier New', monospace;
		--bs-gradient: linear-gradient(
			180deg,
			rgb(255 255 255 / 15%),
			rgb(255 255 255 / 0%)
		);
		--bs-body-font-family: var(--bs-font-sans-serif);
		--bs-body-font-size: 0.875rem;
		--bs-body-font-weight: 400;
		--bs-body-line-height: 1.5;
		--bs-body-color: #313533;
		--bs-emphasis-color: #000;
		--bs-emphasis-color-rgb: 0, 0, 0;
		--bs-secondary-color: #2c302e;
		--bs-secondary-color-rgb: 44, 48, 46;
		--bs-secondary-bg: #fff;
		--bs-secondary-bg-rgb: 255, 255, 255;
		--bs-tertiary-color: #878a99;
		--bs-tertiary-color-rgb: 135, 138, 153;
		--bs-tertiary-bg: #f8f9fa;
		--bs-tertiary-bg-rgb: 248, 249, 250;
		--bs-body-bg: #fff;
		--bs-body-bg-rgb: 255, 255, 255;
		--bs-link-color: #5156be;
		--bs-link-color-rgb: 81, 86, 190;
		--bs-link-decoration: none;
		--bs-link-hover-color: #414598;
		--bs-link-hover-color-rgb: 65, 69, 152;
		--bs-link-hover-decoration: underline;
		--bs-code-color: #e83e8c;
		--bs-border-width: 1px;
		--bs-border-style: solid;
		--bs-border-color: #e9e9ef;
		--bs-border-color-translucent: #ced4da;
		--bs-border-radius: 0.25rem;
		--bs-border-radius-sm: 0.2rem;
		--bs-border-radius-lg: 0.4rem;
		--bs-border-radius-xl: 1rem;
		--bs-border-radius-2xl: 2rem;
		--bs-border-radius-pill: 50rem;
		--bs-box-shadow: rgb(116 120 141 / 10%) 0 5px 20px -6px;
		--bs-box-shadow-sm: 0 0.125rem 0.25rem
			rgba(var(--bs-body-color-rgb), 0.075);
		--bs-box-shadow-lg: 0 1rem 3rem
			rgba(var(--bs-body-color-rgb), 0.175);
		--bs-box-shadow-inset: inset 0 1px 2px
			rgba(var(--bs-body-color-rgb), 0.075);
		--bs-form-control-bg: var(--bs-body-bg);
		--bs-form-control-disabled-bg: var(--bs-secondary-bg);
		--bs-highlight-bg: #fcf8e3;
		--bs-breakpoint-xs: 0;
		--bs-breakpoint-sm: 576px;
		--bs-breakpoint-md: 768px;
		--bs-breakpoint-lg: 992px;
		--bs-breakpoint-xl: 1200px;
		--bs-breakpoint-xxl: 1400px;
	}

	.list-group {
		--bs-list-group-color: var(--bs-secondary-color);
		--bs-list-group-bg: var(--bs-secondary-bg);
		--bs-list-group-border-color: var(--bs-border-color);
		--bs-list-group-border-width: 1px;
		--bs-list-group-border-radius: 0.25rem;
		--bs-list-group-item-padding-x: 1.25rem;
		--bs-list-group-item-padding-y: 0.75rem;
		--bs-list-group-action-color: var(--bs-secondary-color);
		--bs-list-group-action-hover-color: var(
			--bs-secondary-color
		);
		--bs-list-group-action-hover-bg: var(--bs-tertiary-bg);
		--bs-list-group-action-active-color: var(
			--bs-secondary-color
		);
		--bs-list-group-action-active-bg: var(
			--bs-list-group-hover-bg
		);
		--bs-list-group-disabled-color: #74788d;
		--bs-list-group-disabled-bg: var(--bs-secondary-bg);
		--bs-list-group-active-color: #000;
		--bs-list-group-active-bg: #cdc5e5;
		--bs-list-group-active-border-color: #5156be;
		display: -webkit-box;
		display: flexbox;
		display: flex;
		-webkit-box-orient: vertical;
		-webkit-box-direction: normal;
		-ms-flex-direction: column;
		flex-direction: column;
		margin-bottom: 0;
		border-radius: var(--bs-list-group-border-radius);
		padding-left: 0;
	}

	.rightbar-overlay {
		display: none;
		position: absolute;
		z-index: 9998;
		-webkit-transition: all 0.2s ease-out;
		transition: all 0.2s ease-out;
		inset: 0;
		background-color: #ac9dc778;
	}

	body[data-topbar='dark'] .navbar-brand-box {
		box-shadow: 0 0 2px var(--bs-header-bg);
		border-color: var(--bs-list-group-active-border-color);
		background-color: var(--bs-list-group-active-bg);
	}

	.logo-txt {
		color: black;
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
