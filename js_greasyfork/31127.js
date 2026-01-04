// ==UserScript==
// @name        WikiMuch
// @namespace   https://greasyfork.org
// @description Clean and minimal theme for new Wikipedia. Press F8 for dark mode.
// @author      Guillaume
// @version     3.2.5
// @icon        https://codeberg.org/ltguillaume/wikimuch/raw/master/logo.png
// @match       https://*.wikipedia.org/*
// @homepageURL https://greasyfork.org/scripts/31127
// @grant       GM_addStyle
// @grant       GM_getValue
// @grant       GM_setValue
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/31127/WikiMuch.user.js
// @updateURL https://update.greasyfork.org/scripts/31127/WikiMuch.meta.js
// ==/UserScript==

document.addEventListener('DOMContentLoaded', function() {
	if (document.body.classList.contains('skin-vector-legacy'))
		document.location.search += '&useskin=vector-2022';

	darkMode();
	GM_addStyle(`

/* Light theme */
:root {
	--nav-bg:        #f1f1f1;
	--nav-text:      #333;
	--link-text:     #067bad;
	--main-bg:       #fafafa;
	--main-text:     #444;
	--main-border:   #bbb;
	--box-bg:        #f7f7f7;
	--box-bg2:       #fafafa;
	--box-head-bg:   #e7e7e7;
	--box-text:      #333;
	--box-border:    #e7e7e7;
	--navbox-border: #fdfdfd;
}

/* Dark theme */
:root.dark {
	--nav-bg:        #111110;
	--nav-text:      #888;
	--link-text:     #6b6b5f;
	--main-bg:       #10100f;
	--main-text:     #999;
	--main-border:   #1c1c1b;
	--box-bg:        #111110;
	--box-head-bg:   #1c1c1b;
	--box-text:      #888;
	--box-border:    #1c1c1b;
	--navbox-border: #111110;
}

/* Main page container */
body, .mw-page-container {
	max-width: unset;
	margin: 0 !important;
	padding: 0 !important;
	background: var(--main-bg);
	color: var(--main-text);
}

* {
	outline-color: var(--box-border) !important;
}

:focus {
	border-color: var(--box-border) !important;
	box-shadow: none !important;
}

/* Links */
a,
a:hover,
.vector-feature-page-tools-disabled .vector-main-menu-group .vector-menu-content li a,
.vector-feature-page-tools-disabled .vector-main-menu-action-item .vector-menu-content li a,
.skin-vector:not(.skin-vector-legacy) .wb-langlinks-link a,
.vector-toc .vector-toc-link,
.vector-menu-tabs .mw-list-item a,
.vector-pinnable-header-toggle-button,
.vector-pinnable-header-toggle-button:hover,
.vector-menu-tabs .mw-list-item a,
.mw-parser-output a.extiw, .mw-parser-output a.external {
	color: var(--link-text) !important;
}

/* Header, main menu, user menu, TOC */
.mw-header,
.vector-feature-page-tools-disabled .vector-main-menu,
.vector-menu-content,
#mw-panel-toc,
#vector-toc-pinned-container,
.vector-toc,
.vector-toc .vector-toc-list-item-active > .vector-toc-link,
.vector-toc .vector-toc-level-1-active:not(.vector-toc-list-item-expanded) > .vector-toc-link,
.vector-toc .vector-toc-list-item-active.vector-toc-level-1-active > .vector-toc-link,
.navbox-title,
.mw-parser-output .tmbox,
.catlinks {
	color: var(--nav-text);
	background: var(--nav-bg) !important;
	border-color: var(--main-border) !important;
}

/* Content width when limited content width is toggled off */
.vector-feature-limited-width-disabled .mw-content-container {
		width: unset !important;
	}


/* TOC background and content padding for pages without a TOC */
.vector-feature-page-tools-disabled #mw-sidebar-checkbox:not(:checked) ~ .vector-sidebar-container-no-toc ~ #mw-panel-toc,
.vector-feature-page-tools-disabled .vector-toc-unpinned #mw-sidebar-checkbox:not(:checked) ~ #mw-panel-toc,
.vector-feature-page-tools-disabled.vector-toc-unpinned #mw-sidebar-checkbox:not(:checked) ~ #mw-panel-toc {
	background: unset !important;
}

body.action-edit main,
body.action-history main,
body.mw-special-Search main {
	padding: 1.25em !important;
}

/* Main menu button */
.mw-ui-icon-flush-right {
	margin-right: 0 !important;
	padding-left: 1.25em;
}

/* Search field */
.vector-search-box-input,
.cdx-text-input__input {
	color: var(--main-text);
	background-color: var(--main-bg);
	border-color: var(--main-border) !important;
	box-shadow: none !important;
}

/* Main menu, TOC */
.vector-feature-page-tools-disabled .vector-main-menu,
.vector-feature-page-tools-disabled #vector-toc-pinned-container .vector-toc {
	width: 100%;
}

body.vector-toc-pinned .mw-ui-icon-flush-left,
.vector-feature-page-tools-disabled .vector-main-menu,
.vector-feature-page-tools-disabled .vector-toc-pinned #mw-panel-toc {
	margin-left: 0 !important;
}

/* Pinned Table of Contents */
body.vector-toc-pinned .mw-body-header {
	margin-top: 1.2rem;
}

.vector-feature-page-tools-disabled #vector-toc-pinned-container .vector-toc,
.vector-feature-page-tools-disabled #vector-toc-pinned-container .vector-toc::after {
	margin-left: 0;
}

/* Main menu button, language chooser */
.mw-ui-button.mw-ui-icon-element:not(.mw-ui-icon-with-label-desktop),
input[type="checkbox"]:hover + .mw-ui-button.mw-ui-progressive.mw-ui-quiet,
.mw-ui-button.mw-ui-progressive.mw-ui-quiet,
.mw-ui-button.mw-ui-progressive.mw-ui-quiet:hover,
.mw-ui-button.mw-ui-progressive.mw-ui-quiet:focus,
.uls-language-block a {
	background: transparent;
	color: var(--link-text);
	border: none;
	box-shadow: none;
}

.mw-ui-button:not(.mw-ui-icon-element) {
	padding-right: 0;
}

/* Language chooser drop-down icon color when clicked */
.vector-page-titlebar .mw-portlet-lang .vector-menu-heading.mw-ui-progressive.mw-ui-quiet::after {
	background-image: url(/w/skins/Vector/resources/common/images/arrow-down-progressive.svg?f0b59) !important;
}

/* Language chooser icon, external links icon */
.mw-ui-icon-wikimedia-language-progressive::before,
.mw-parser-output a.external {
	background: none;
}

/* Main content */
.mw-page-container-inner {
	column-gap: 0 !important;
}

.mw-content-container {
	min-width: unset;
	margin-left: 2.5em;
	margin-right: 2em;
}

/* Tabs */
.vector-menu-tabs .mw-list-item.selected a,
.vector-menu-tabs .mw-list-item.selected a:visited {
	color: var(--main-text);
}

/* Main text, tables/infoboxes */
#content.mw-body,
.client-js .vector-below-page-title .vector-page-titlebar-toc {
	background-color: var(--main-bg) !important;
	color: var(--main-text) !important;
	border-color: var(--main-border) !important;
}

/* Headers */
h1, h2, h3, h4, h5, h6 {
	color: var(--main-text);
}

/* Tables, boxes (.mw-parser-output > ...) */
.infobox,
.help-box,
.mw-message-box,
.navbox,
.navbox-subgroup,
.side-box,
.wikitable,
.thumbinner,
.module-shortcutboxplain {
	background-color: var(--box-bg) !important;
	color: var(--box-text) !important;
	border-color: var(--box-border) !important;
}

.wikitable *,
.navbox-even,
.navbox-abovebelow,
.navbox-image,
.navbox-list,
.mw-parser-output tr + tr > .navbox-group {
	border-color: var(--navbox-border) !important;
}

.wikitable th,
.navbox-even,
.navbox-abovebelow,
.infobox th.infobox-above,
.infobox th.infobox-header,
.navbox .navbox-group,
.sidebar-heading {
	background-color: var(--box-head-bg) !important;
}

/* Account links */
.vector-user-links {
	margin-right: 2em;
}

/* "Outline" colors */
input[type='checkbox']:focus,
.mw-ui-button.mw-ui-progressive.mw-ui-quiet:focus
.mw-ui-button.mw-ui-quiet:focus {
	border: none !important;
	box-shadow: inset 0 0 0 1px var(--main-border) !important;
}

.vector-menu-checkbox:focus,
.vector-menu-checkbox:focus + .vector-menu-heading {
	outline: none !important;
}

/* Adjust colors for icons */
img.noprint,
.oo-ui-iconElement-icon,
.vector-menu-checkbox::after,
.vector-dropdown > .vector-menu-heading:after {
	filter: hue-rotate(-35deg);
}

html.dark img.noprint,
html.dark .oo-ui-iconElement-icon,
html.dark .vector-menu-checkbox::after,
html.dark .vector-dropdown > .vector-menu-heading:after {
	filter: grayscale(100%);
}

html.dark .mw-logo-wordmark,
html.dark .mw-logo-tagline,
html.dark .mw-ui-icon,
html.dark .searchButton {
	filter: invert(50%);
}

/* Footer padding */
.mw-footer-container {
	padding: 0;
}

.mw-footer {
	padding: 1em 1.25em !important;
}

/* Hide site notice, TOC overflow gradient, footer icons */
.vector-sitenotice-container,
.vector-toc-pinned #vector-toc-pinned-container .vector-toc::after,
#footer-icons {
	display: none;
}

	`);
});

document.addEventListener('keydown', function(e) {
	if (e.key == 'F8') {
		e.preventDefault();
		GM_setValue('darkMode', !GM_getValue('darkMode') || false);
		darkMode();
	}
});

function darkMode() {
	if (GM_getValue('darkMode'))
		document.documentElement.classList.add('dark');
	else
		document.documentElement.classList.remove('dark');
}