// ==UserScript==
// @name        Warzone.com Wiki Dark Theme
// @namespace   Violentmonkey Scripts
// @match       https://www.warzone.com/wiki/*
// @version     1.2
// @author      https://greasyfork.org/en/users/85040-dan-wl-danwl
// @description Inverts light theme to make a dark theme and uses tints/shades when colors have intentional meaning
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/531641/Warzonecom%20Wiki%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/531641/Warzonecom%20Wiki%20Dark%20Theme.meta.js
// ==/UserScript==
(function() {
	// TODO plain inversion is too bright in some cases
	// so invert then apply [tint (if dark) or shade (if light)] 2 from https://www.color-hex.com/color/<hex code>

	/* for browser input/button color overriding */
	const ButtonBorder = '#323232';// rgb(227, 227, 227) -> #1c1c1c
	const FieldText = '#e5e5e5';// rgb(0, 0, 0) -> #fff
	const Field = '#191919';// rgb(255, 255, 255) -> #000
	const ButtonText = '#e5e5e5';// rgb(0, 0, 0) -> #fff
	const ButtonFace = '#2d2d29';// rgb(233, 233, 237) -> #161612
	const ButtonHoverText = '#e5e5e5';// rgb(0, 0, 0) -> #fff
	const ButtonHoverFace = '#43433d';// rgb(208, 208, 215) -> #2f2f28

	const style = document.createElement('style');
	const style2 = document.createElement('style');
	const style3 = document.createElement('style');
	const style4 = document.createElement('style');

	style.innerHTML = `/* override browser default colors */

textarea {
	color: ${FieldText};
	background: ${Field};
	border-color: ${ButtonBorder};
}

input:not(type),
input[type="date"],
input[type="datetime-local"],
input[type="email"],
input[type="month"],
input[type="password"],
input[type="search"],
input[type="tel"],
input[type="text"],
input[type="time"],
input[type="url"],
input[type="week"],
input[type="datetime"] {
	color: ${FieldText};
	background-color: ${Field};
	border-color: ${ButtonBorder};
}

button,
input[type="button"],
input[type="color"],
input[type="reset"],
input[type="submit"] {
	color: ${ButtonText};
	background-color: ${ButtonFace};
	/* border-radius: 4px; */
}

button:hover,
input[type="button"]:hover,
input[type="color"]:hover,
input[type="reset"]:hover,
input[type="submit"]:hover {
	color: ${ButtonHoverText};
	background-color: ${ButtonHoverFace};
}

input[type="number"] {
	/* cant style the up/down buttons */
	color: ${FieldText};
	background-color: ${Field};
	border-color: ${ButtonBorder};
}

input[type="file"] {
	/* cant style the button itself */
	color: ${FieldText};
	background-color: ${Field};
	border-color: ${ButtonBorder};
}

/* these cannot be styled: */
/* input[type="checkbox"] */
/* input[type="radio"] */
/* input[type="range"] */

/* no need to style these: */
/* input[type="hidden"] */
/* input[type="image"] */

/* load.php 410 rules */

.mw-message-box {
	/* shade 6 of https://www.color-hex.com/color/eaecf0 */
	background-color: #757678;

	color: #fff;

	/* tint 6 of https://www.color-hex.com/color/54595d */
	border-color: #a9acae;
}

.mw-message-box-error {
	/* shade 6 of https://www.color-hex.com/color/fee7e6 */
	background-color: #7f7373;

	/* border-color can be left as #591212 */
}

.mw-message-box-warning {
	/* shade 6 of https://www.color-hex.com/color/fef6e7 */
	background-color: #7f7b73;

	/* border-color can be left as #a66200 */
}

.mw-message-box-success {
	/* shade 6 of https://www.color-hex.com/color/d5fdf4 */
	background-color: #6a7e7a;

	/* border-color can be left as #096450 */
}

figure[typeof~='mw:File/Thumb'], figure[typeof~='mw:File/Frame'] {
	border-color: #37332e;
	background-color: #070605;
}

figure[typeof~='mw:File/Thumb'] > :not(figcaption) .mw-file-element, figure[typeof~='mw:File/Frame'] > :not(figcaption) .mw-file-element {
	border-color: #37332e;
	background-color: #070605;
}

figure[typeof~='mw:File/Thumb'] > figcaption, figure[typeof~='mw:File/Frame'] > figcaption {
	border-color: #37332e;
	background-color: #070605;
}

figure[typeof~='mw:File/Thumb'] > .mw-file-description::after,
figure[typeof~='mw:File/Thumb'] > .mw-file-magnify::after {
	filter: invert(100%);
}

.mw-content-ltr figure[typeof~='mw:File/Thumb'] > .mw-file-description::after,
.mw-content-ltr figure[typeof~='mw:File/Thumb'] > .mw-file-magnify::after {
	filter: invert(100%);
}

.mw-content-rtl figure[typeof~='mw:File/Thumb'] > .mw-file-description::after,
.mw-content-rtl figure[typeof~='mw:File/Thumb'] > .mw-file-magnify::after {
	filter: invert(100%);
}

.mw-image-border .mw-file-element {
	border-color: #15130f;
}

.wikitable {
	background-color: #070605;
	color: #dfdedd;
	border-color: #5d564e;
}

.wikitable > tr > th, .wikitable > tr > td, .wikitable > * > tr > th, .wikitable > * > tr > td {
	border-color: #5d564e;
}

.wikitable > tr > th, .wikitable > * > tr > th {
	background-color: #15130f;
	color: #dfdedd;
}

.catlinks {
	background-color: #070605;
	border-color: #5d564e;
}

.catlinks li {
	border-color: #5d564e;
}

#mw-content-subtitle, #contentSub2 {
	color: #aba6a2;
}

.usermessage {
	background-color: #010918;
}

a {
	/* tint 6 of https://www.color-hex.com/color/0645ad */
	color: #82a2d6;
}

a:visited {
	/* tint 6 of https://www.color-hex.com/color/0b0080 */
	color: #857fbf;
}

a:active {
	/* tint 6 of https://www.color-hex.com/color/faa700 */
	color: #fcd37f;
}

hr {
	background-color: #5d564e;
}

h1, h2, h3, h4, h5, h6 {
	color: #fff;
}

.mw-heading1, h1, .mw-heading2, h2 {
	border-bottom-color: #5d564e;
}

pre, code, wm-code {
	background-color: #070605;
	color: #fff;
	border-color: #15130f;
}

fieldset {
	border-color: #d5b472;
}

textarea {
	border-color: #5d564e;
}

.toc, .toccolours {
	background-color: #070605;
	border-color: #5d564e;
}

.tocnumber {
	color: #dfdedd;
}

.toctogglelabel {
	/* same as a using #0645ad */
	color: #82a2d6;
}

.mixin-vector-legacy-menu-heading-arrow {
	filter: invert(100%);
}

@media screen {
	.vector-body blockquote {
		border-left-color: #15130f;
	}

	.mw-parser-output a.external {
		/* dont use filter: invert(100%); */
		/* the image doesnt exist */
		/* causes bad changes */
	}

	body {
		background-color: #090909;
	}

	.mw-body, .parsoid-body {
		background-color: #000;
		color: #dfdedd;
	}

	.mw-body {
		border-color: #582806;
	}

	#mw-page-base {
		background-color: #040404;
		background-image: linear-gradient(to bottom,#000 50%,#090909 100%);
	}

	.mw-footer li {
		color: #dfdedd;
	}

	.vector-menu-dropdown .vector-menu-heading {
		color: #aba6a2;
	}

	.vector-menu-dropdown .vector-menu-heading::after {
		filter: invert(100%);
	}

	.vector-menu-dropdown .vector-menu-heading:hover,
	.vector-menu-dropdown .vector-menu-heading:focus {
		color: #dfdedd;
	}

	.vector-menu-dropdown .vector-menu-content {
		background-color: #000;
		border-color: #5d564e;
		box-shadow:0 1px 1px 0 rgba(255,255,255,0.1);
	}

	.vector-menu-dropdown .mw-list-item a {
		/* same as a using #0645ad */
		color: #82a2d6;
	}

	.vector-menu-dropdown .mw-list-item.selected a, .vector-menu-dropdown .mw-list-item.selected a:visited {
		/* tint 6 of https://www.color-hex.com/color/202122 */
		color: #8f9090;
	}

	.vector-menu-tabs-legacy li {
		background-image:linear-gradient(to top,#883e09 0,#170d07 1px,#000 100%);
	}

	.vector-menu-tabs-legacy li a {
		/* same as a using #0645ad */
		color: #82a2d6;
	}

	.vector-menu-tabs-legacy .new a, .vector-menu-tabs-legacy .new a:visited {
		/* tint 6 of https://www.color-hex.com/color/ba0000 */
		color: #5d0000;
	}

	.vector-menu-tabs-legacy .selected {
		background-color: #000
	}

	.vector-menu-tabs-legacy .selected a, .vector-menu-tabs-legacy .selected a:visited {
		/* tint 6 of https://www.color-hex.com/color/202122 */
		color: #8f9090;
	}

	.vector-menu-tabs, .vector-menu-tabs a, #mw-head .vector-menu-dropdown .vector-menu-heading {
		background-image: linear-gradient(to bottom,rgba(88,40,1,0) 0,#582806 100%);
	}

	.vector-legacy-sidebar .vector-menu-portal .vector-menu-heading {
		color: #aba6a2;
		background-image: linear-gradient(to right,rgba(55,51,46,0) 0,#37332e 33%,#37332e 66%,rgba(55,51,46,0) 100%);
	}

	.vector-legacy-sidebar .vector-menu-portal .vector-menu-content li a {
		/* same as a using #0645ad */
		color: #82a2d6;
	}

	.vector-legacy-sidebar .vector-menu-portal .vector-menu-content li a:visited {
		/* same as a using #0b0080 */
		color: #857fbf;
	}

	.vector-search-box-input {
		background-color: rgba(0,0,0,0.5);
		color: #fff;
		border-color: #5d564e;
	}

	.vector-search-box-inner:hover .vector-search-box-input {
		border-color: #8d8882;
	}

	.vector-search-box-input::-webkit-input-placeholder {
		color: #8d8882;
	}

	.vector-search-box-input:-ms-input-placeholder {
		color: #8d8882;
	}

	.vector-search-box-input::-moz-placeholder {
		color: #8d8882;
	}

	.vector-search-box-input::placeholder {
		color: #8d8882;
	}

	.searchButton[name='go'] {
		/* dont use filter: invert(100%); */
		/* the image could not be found */
		/* causes negative changes */

		/* make the Go text appear */
		text-indent: unset;
	}

	.vector-menu-tabs #ca-unwatch.icon a::before {
		filter: invert(100%);
	}

	.vector-menu-tabs #ca-unwatch.mw-watchlink-temp.icon a::before {
		filter: invert(100%);
	}

	.vector-menu-tabs #ca-watch.icon a::before {
		filter: invert(100%);
	}

	.vector-menu-tabs #ca-unwatch.icon a:hover::before,
	.vector-menu-tabs #ca-unwatch.icon a:focus::before {
		filter: invert(100%);
	}

	.vector-menu-tabs #ca-unwatch.mw-watchlink-temp.icon a:hover::before,
	.vector-menu-tabs #ca-unwatch.mw-watchlink-temp.icon a:focus::before {
		filter: invert(100%);
	}

	.vector-menu-tabs #ca-watch.icon a:hover::before,
	.vector-menu-tabs #ca-watch.icon a:focus::before {
		filter: invert(100%);
	}

	.vector-user-menu-legacy #pt-anonuserpage,
	.vector-user-menu-legacy #pt-userpage a {
		/* dont use filter: invert(100%); */
		/* the image could not be found */
		/* causes negative changes */
	}

	.vector-user-menu-legacy #pt-anonuserpage {
		color: #aba6a2;
	}
}

@media print {
	.mw-body a:not(.image) {
		/* tint 6 of https://www.color-hex.com/color/aaaaaa */
		border-bottom-color: #555555;
	}

	.firstHeading, .mw-heading2, h2 {
		border-bottom-color: #fff;
	}

	blockquote {
		border-left-color: #fff;
	}

	.printfooter {
		border-top-color: #fff;
	}

	.mw-footer {
		border-top-color: #111;
	}

	#footer-info li {
		color: #666;
	}

	#footer-info li a {
		color: #666 !important;
	}

	#footer-info-lastmod {
		color: #fff;
	}

	#footer {
		background-color: #000;
		color: #fff;
		border-top-color: #555;
	}
}

/* load.php 11 rules */

div.ambox {
	/* orange is FFA500 */
	/* tint 6 of https://www.color-hex.com/color/ffa500 */
	border-color: #ffd27f;

	background-color: #040404;
}

div.infobox {
	border-color: #fff;
	background-color: #202020;
}

div.infobox div.plainlinks a, div.infobox div.plainlinks a:hover {
	color: #fff;
}

div.infobox hr {
	color: #fff;
	background-color: #fff;
}

div.navbox {
	background-color: #0e0e0e;
	border-color: #fff;
}

div.navbox div.navbox-header {
	background-color: #212121;
	border-color: #fff;
}

/* inline stylesheet 1 10 rules */

.suggestions-special {
	background-color: #000;
	border-color: #5d564e;
}

.suggestions-results {
	background-color: #000;
	border-color: #5d564e;
}

.suggestions-result {
	color: #fff;
}

.suggestions-result-current {
	background-color: #d5b472;
	color: #000;
}

.suggestions-special .special-label {
	color: #8d8882;
}

.suggestions-special .special-query {
	color: #fff;
}

.suggestions-special .special-hover {
	background-color: #37332e;
}

.suggestions-result-current .special-label, .suggestions-result-current .special-query {
	color: #000;
}

/* inline stylesheet 3 3 rules */

.suggestions a.mw-searchSuggest-link, .suggestions a.mw-searchSuggest-link:hover, .suggestions a.mw-searchSuggest-link:active, .suggestions a.mw-searchSuggest-link:focus {
	color: #fff;
}

.suggestions-result-current a.mw-searchSuggest-link, .suggestions-result-current a.mw-searchSuggest-link:hover, .suggestions-result-current a.mw-searchSuggest-link:active, .suggestions-result-current a.mw-searchSuggest-link:focus {
	color: #000;
}`;

	style2.innerHTML = `/* load.php 1033 rules https://www.warzone.com/wiki/Special:Categories */

.mw-htmlform-ooui .mw-htmlform-matrix tbody tr:nth-child(even) td {
	color: #070605;
}

.mw-htmlform-ooui .mw-htmlform-matrix tbody tr:hover td {
	color: #15130f;
}

.mw-datatable {
	border-color: #5d564e;
}

.mw-datatable td, mw-datatable th {
	border-color: #5d564e;
}

.mw-datatable th {
	background-color: #151100;
}

.mw-datatable td {
	background-color: #000;
}

.mw-datatable tr:hover td {
	background-color: #150c00;
}

.oo-ui-pendingElement-pending {
	background-color: #15130f;
	background-image: linear-gradient(135deg,#000 25%,transparent 25%,transparent 50%,#000 50%,#000 75%,transparent 75%,transparent);
}

.oo-ui-fieldLayout-disabled > .oo-ui-fieldLayout-body > .oo-ui-fieldLayout-header > .oo-ui-labelElement-label {
	color: #8d8882;
}

.oo-ui-panelLayout-framed {
	border-color: #5d564e;
}

.oo-ui-optionWidget.oo-ui-widget-disabled {
	color: #8d8882;
}

.oo-ui-radioSelectWidget:focus [type='radio']:checked + span::before {
	border-color: #000;
}

.oo-ui-labelWidget.oo-ui-inline-help {
	color: #aba6a2;
}

.oo-ui-messageWidget.oo-ui-messageWidget-block.oo-ui-flaggedElement-error {
	/* shade 6 of https://www.color-hex.com/color/fee7e6 */
	background-color: #7f7373;

	/* border-color can be left as #b32424 */
}

.oo-ui-messageWidget.oo-ui-messageWidget-block.oo-ui-flaggedElement-warning {
	/* shade 6 of https://www.color-hex.com/color/fef6e7 */
	background-color: #7f7b73;

	/* tint 6 of https://www.color-hex.com/color/a66200 */
	border-color: #d2b07f;
}

.oo-ui-messageWidget.oo-ui-messageWidget-block.oo-ui-flaggedElement-success {
	/* shade 6 of https://www.color-hex.com/color/d5fdf4 */
	background-color: #6a7e7a;

	/* tint 6 of https://www.color-hex.com/color/096450 */
	border-color: #84b1a7;
}

.oo-ui-messageWidget.oo-ui-messageWidget-block.oo-ui-flaggedElement-notice {
	/* shade 6 of https://www.color-hex.com/color/eaecf0 */
	background-color: #757678;

	/* tint 6 of https://www.color-hex.com/color/54595d */
	border-color: #a9acae;
}

.oo-ui-messageWidget.oo-ui-flaggedElement-error:not(.oo-ui-messageWidget-block) {
	/* can be left as #d73333 */
}

.oo-ui-messageWidget.oo-ui-flaggedElement-success:not(.oo-ui-messageWidget-block) {
	/* can be left as #14866d */
}

.oo-ui-popupWidget-popup {
	background-color: #000;
	border-color: #5d564e;
	box-shadow: 0 2px 2px 0 rgba(255,255,255,0.2);
}

@supports (filter:drop-shadow(0 0 0)) {
	.oo-ui-popupWidget {
		filter: drop-shadow(0 2px 1px rgba(255,255,255,0.3));
	}
}

.oo-ui-popupWidget-anchored-top .oo-ui-popupWidget-anchor::before {
	border-bottom-color: #847a6f;
}

.oo-ui-popupWidget-anchored-top .oo-ui-popupWidget-anchor::after {
	border-bottom-color: #000;
}

.oo-ui-popupWidget-anchored-bottom .oo-ui-popupWidget-anchor::before {
	border-top-color: #5d564e;
}

.oo-ui-popupWidget-anchored-bottom .oo-ui-popupWidget-anchor::after {
	border-top-color: #000;
}

.oo-ui-popupWidget-anchored-start .oo-ui-popupWidget-anchor::before {
	border-right-color: #5d564e;
}

.oo-ui-popupWidget-anchored-start .oo-ui-popupWidget-anchor::after {
	border-right-color: #000;
}

.oo-ui-popupWidget-anchored-end .oo-ui-popupWidget-anchor::before {
	border-left-color: #5d564e;
}

.oo-ui-popupWidget-anchored-end .oo-ui-popupWidget-anchor::after {
	border-left-color: #000;
}

.oo-ui-checkboxInputWidget [type='checkbox'] + span {
	background-color: #000;
	border-color: #8d8882;
}

.oo-ui-checkboxInputWidget [type='checkbox']:indeterminate + span::before {
	background-color: #000;
}

.oo-ui-checkboxInputWidget [type='checkbox']:disabled + span {
	background-color: #37332e;
	border-color: #37332e;
}

.oo-ui-dropdownInputWidget select {
	border-color: #5d564e;
}

.oo-ui-dropdownInputWidget.oo-ui-widget-enabled {
	background-color: #070605;
}

.oo-ui-dropdownInputWidget.oo-ui-widget-enabled:hover {
	background-color: #000;
}

.oo-ui-dropdownInputWidget.oo-ui-widget-enabled select {
	color: #dfdedd;
}

.oo-ui-dropdownInputWidget.oo-ui-widget-enabled select:hover {
	color: #bfbdbb;
	border-color: #5d564e;
}

.oo-ui-dropdownInputWidget.oo-ui-widget-enabled select:active {
	color: #fff;
	border-color: #8d8882;
}

.oo-ui-dropdownInputWidget.oo-ui-widget-disabled {
	background-color: #15130f;
}

.oo-ui-dropdownInputWidget.oo-ui-widget-disabled select {
	color: #8d8882;
	border-color: #37332e;
}

.oo-ui-radioInputWidget [type='radio'] + span {
	background-color: #000;
	border-color: #8d8882;
}

.oo-ui-radioInputWidget [type='radio']:disabled + span {
	background-color: #37332e;
	border-color: #37332e;
}

.oo-ui-radioInputWidget [type='radio']:disabled:checked + span {
	background-color: #000;
}

.oo-ui-radioInputWidget.oo-ui-widget-enabled [type='radio']:checked:focus + span::before {
	border-color: #000;
}

.oo-ui-textInputWidget .oo-ui-inputWidget-input {
	background-color: #000;
	color: #fff;
	border-color: #5d564e;
}

.oo-ui-textInputWidget .oo-ui-pendingElement-pending {
	background-color: #15130f;
}

.oo-ui-textInputWidget > .oo-ui-labelElement-label {
	color: #8d8882;
}

.oo-ui-textInputWidget.oo-ui-widget-enabled .oo-ui-inputWidget-input::-webkit-input-placeholder {
	color: #8d8882;
}

.oo-ui-textInputWidget.oo-ui-widget-enabled .oo-ui-inputWidget-input:-ms-input-placeholder {
	color: #8d8882;
}

.oo-ui-textInputWidget.oo-ui-widget-enabled .oo-ui-inputWidget-input::-moz-placeholder {
	color: #8d8882;
}

.oo-ui-textInputWidget.oo-ui-widget-enabled .oo-ui-inputWidget-input::placeholder {
	color: #8d8882;
}

.oo-ui-textInputWidget.oo-ui-widget-enabled .oo-ui-inputWidget-input[readonly]:not(.oo-ui-pendingElement-pending) {
	background-color: #070605;
}

.oo-ui-textInputWidget.oo-ui-widget-enabled:hover .oo-ui-inputWidget-input {
	color: #8d8882;
}

.oo-ui-textInputWidget.oo-ui-widget-disabled .oo-ui-inputWidget-input {
	background-color: #15130f;

	-webkit-text-fill-color: #8d8882;
	color: #8d8882;

	text-shadow: 0 1px 1px #000;
	border-color: #37332e;
}

.oo-ui-textInputWidget.oo-ui-widget-disabled > .oo-ui-labelElement-label {
	color: #8d8882;

	text-shadow: 0 1px 1px #000;
}

.oo-ui-menuSelectWidget {
	background-color: #000;
	border-color: #5d564e;
	box-shadow: 0 2px 2px 0 rgba(255,255,255,0.2);
}

.oo-ui-menuOptionWidget.oo-ui-optionWidget-highlighted {
	background-color: #15130f;
	color: #fff;
}

.oo-ui-menuOptionWidget.oo-ui-optionWidget-selected, .oo-ui-menuOptionWidget.oo-ui-optionWidget-selected.oo-ui-menuOptionWidget.oo-ui-optionWidget-highlighted, .oo-ui-menuOptionWidget.oo-ui-optionWidget-pressed.oo-ui-menuOptionWidget.oo-ui-optionWidget-highlighted {
	background-color: #150c00;
}

.oo-ui-menuOptionWidget.oo-ui-widget-enabled.oo-ui-optionWidget {
	color: #dfdedd;
}

.oo-ui-menuSectionOptionWidget {
	color: #8d8882;
}

.oo-ui-dropdownWidget-handle {
	border-color: #5d564e;
}

.oo-ui-dropdownWidget.oo-ui-widget-enabled .oo-ui-dropdownWidget-handle {
	background-color: #070605;
	color: #dfdedd;
}

.oo-ui-dropdownWidget.oo-ui-widget-enabled .oo-ui-dropdownWidget-handle:hover {
	background-color: #000;
	color: #bfbdbb;
	border-color: #5d564e;
}

.oo-ui-dropdownWidget.oo-ui-widget-enabled .oo-ui-dropdownWidget-handle:active {
	color: #fff;
	border-color: #8d8882;
}

.oo-ui-dropdownWidget.oo-ui-widget-enabled.oo-ui-dropdownWidget-open .oo-ui-dropdownWidget-handle {
	background-color: #000;
}

.oo-ui-dropdownWidget.oo-ui-widget-disabled .oo-ui-dropdownWidget-handle {
	color: #8d8882;
	text-shadow:0 1px 1px #000;
	border-color: #37332e;
	background-color: #15130f;
}

.oo-ui-comboBoxInputWidget-open .oo-ui-comboBoxInputWidget-dropdownButton > .oo-ui-buttonElement-button {
	background-color: #000;
}

.oo-ui-multioptionWidget.oo-ui-widget-disabled {
	color: #8d8882;
}

.oo-ui-progressBarWidget {
	border-color: #5d564e;
	box-shadow:0 2px 2px 0 rgba(255,255,255,0.2);
}

.oo-ui-progressBarWidget:not(.oo-ui-pendingElement-pending) {
	background-color: #000;
}

.oo-ui-progressBarWidget.oo-ui-widget-disabled .oo-ui-progressBarWidget-bar {
	background-color: #37332e;
}

.oo-ui-selectFileInputWidget-dropTarget {
	background-color: #000;
	border-color: #5d564e;
}

.oo-ui-selectFileInputWidget.oo-ui-widget-enabled.oo-ui-selectFileInputWidget-dropTarget {
	background-color: #000;
}

.oo-ui-selectFileInputWidget.oo-ui-widget-enabled.oo-ui-selectFileInputWidget-dropTarget:hover {
	border-color: #8d8882;
}

.oo-ui-selectFileInputWidget.oo-ui-widget-enabled.oo-ui-selectFileInputWidget-canDrop.oo-ui-selectFileInputWidget-dropTarget, .oo-ui-selectFileInputWidget.oo-ui-widget-enabled.oo-ui-selectFileInputWidget-canDrop .oo-ui-selectFileInputWidget-info > .oo-ui-inputWidget-input {
	background-color: #150c00;
	color: #d5b472;
}

.oo-ui-selectFileInputWidget.oo-ui-widget-enabled.oo-ui-selectFileInputWidget-cantDrop.oo-ui-selectFileInputWidget-dropTarget, .oo-ui-selectFileInputWidget.oo-ui-widget-enabled.oo-ui-selectFileInputWidget-cantDrop .oo-ui-selectFileInputWidget-info > .oo-ui-inputWidget-input {
	/* shade 6 of https://www.color-hex.com/color/fee7e6 */
	background-color: #7f7373;
}

.oo-ui-selectFileInputWidget.oo-ui-widget-disabled.oo-ui-selectFileInputWidget-dropTarget, .oo-ui-selectFileInputWidget.oo-ui-selectFileInputWidget-empty.oo-ui-widget-disabled.oo-ui-selectFileInputWidget-dropTarget {
	background-color: #15130f;
	border-color: #37332e;
}

.oo-ui-toggleSwitchWidget {
	background-color: #070605;
	border-color: #8d8882
}

.oo-ui-toggleSwitchWidget.oo-ui-widget-enabled .oo-ui-toggleSwitchWidget-grip {
	background-color: #070605;
	border-color: #8d8882;
}

.oo-ui-toggleSwitchWidget.oo-ui-widget-enabled:hover {
	background-color: #000;
}

.oo-ui-toggleSwitchWidget.oo-ui-widget-enabled:hover .oo-ui-toggleSwitchWidget-grip {
	background-color: #000;
}

.oo-ui-toggleSwitchWidget.oo-ui-widget-enabled:active .oo-ui-toggleSwitchWidget-grip, .oo-ui-toggleSwitchWidget.oo-ui-widget-enabled:active:hover .oo-ui-toggleSwitchWidget-grip, .oo-ui-toggleSwitchWidget.oo-ui-widget-enabled:active:focus .oo-ui-toggleSwitchWidget-grip {
	background-color: #000;
	border-color: #000;
}

.oo-ui-toggleSwitchWidget.oo-ui-widget-enabled.oo-ui-toggleWidget-on .oo-ui-toggleSwitchWidget-grip {
	background-color: #000;
	border-color: #000;
}

.oo-ui-toggleSwitchWidget.oo-ui-widget-enabled.oo-ui-toggleWidget-on:focus::before {
	border-color: #000;
}

.oo-ui-toggleSwitchWidget.oo-ui-widget-disabled {
	background-color: #37332e;
	border-color: #37332e;
}

.oo-ui-toggleSwitchWidget.oo-ui-widget-disabled.oo-ui-toggleWidget-off .oo-ui-toggleSwitchWidget-grip {
	border-color: #000;
	box-shadow: inset 0 0 0 1px #000;
}

.oo-ui-toggleSwitchWidget.oo-ui-widget-disabled.oo-ui-toggleWidget-on .oo-ui-toggleSwitchWidget-grip {
	background-color: #000;
}

/* 2941 onwards should be fine to ignore because its rules included in first style  */

/* inline stylesheet 3 13 rules */

.mw-widget-titleWidget-menu .mw-widget-titleOptionWidget-description {
	color: #8d8882;
}

.mw-widget-titleWidget-menu-withImages .mw-widget-titleOptionWidget.oo-ui-iconElement > .oo-ui-iconElement-icon:not(.mw-widget-titleOptionWidget-hasImage) {
	background-color: #37332e;
}`;

	style3.innerHTML = `/* load.php 1090 rules https://www.warzone.com/wiki/index.php?title=Special:UserLogin&returnto=Main+Page */

.cdx-icon {
	color: #dfdedd;
}

.cdx-button:enabled,
.cdx-button.cdx-button--fake-button--enabled {
	background-color: #070605;
	color: #dfdedd;
	border-color: #5d564e;
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled .cdx-button__icon {
		background-color: #dfdedd;
	}
}

.cdx-button:enabled:hover, .cdx-button.cdx-button--fake-button--enabled:hover {
	background-color: #000;
	color: #bfbdbb;
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled:hover .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled:hover .cdx-button__icon {
		background-color: #bfbdbb;
	}
}

.cdx-button:enabled:active, .cdx-button.cdx-button--fake-button--enabled:active,
.cdx-button:enabled.cdx-button--is-active, .cdx-button.cdx-button--fake-button--enabled.cdx-button--is-active {
	background-color: #15130f;
	color: #fff;
	border-color: #8d8882;
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled:active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled:active .cdx-button__icon,
	.cdx-button:enabled.cdx-button--is-active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--is-active .cdx-button__icon {
		background-color: #fff;
	}
}

.cdx-button:enabled.cdx-button--action-progressive:active,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-progressive:active,
.cdx-button:enabled.cdx-button--action-progressive.cdx-button--is-active,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-progressive.cdx-button--is-active {
	background-color: #150c00;
}

.cdx-button:enabled.cdx-button--action-destructive:active,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive:active,
.cdx-button:enabled.cdx-button--action-destructive.cdx-button--is-active,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--action-destructive.cdx-button--is-active {
	/* shade 6 of https://www.color-hex.com/color/fee7e6 */
	background-color: #7f7373;
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive .cdx-button__icon {
		background-color: #000;
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive:hover .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:hover .cdx-button__icon {
		background-color: #000;
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive:active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive:active .cdx-button__icon,
	.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-progressive.cdx-button--is-active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-progressive.cdx-button--is-active .cdx-button__icon {
		background-color: #000;
	}
}

.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive, .cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive {
	color: #000;
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive .cdx-button__icon {
		background-color: #000;
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive:hover .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive:hover .cdx-button__icon {
		background-color: #000;
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive:active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive:active .cdx-button__icon,
	.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive.cdx-button--is-active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive.cdx-button--is-active .cdx-button__icon {
		background-color: #000;
	}
}

.cdx-button:enabled.cdx-button--weight-primary.cdx-button--action-destructive:focus:not(:active):not(.cdx-button--is-active),
.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-primary.cdx-button--action-destructive:focus:not(:active):not(.cdx-button--is-active) {
	box-shadow: inset 0 0 0 1px #d73333,inset 0 0 0 2px #000;
}

.cdx-button:enabled.cdx-button--weight-quiet:hover,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet:hover {
	background-color: rgba(255,231,182,.027);
}

.cdx-button:enabled.cdx-button--weight-quiet:active,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet:active,
.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--is-active,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--is-active {
	background-color: rgba(255,231,182,.082);
	color: #fff;
	border-color: #8d8882;
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled.cdx-button--weight-quiet:active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet:active .cdx-button__icon,
	.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--is-active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--is-active .cdx-button__icon {
		background-color: #fff;
	}
}

.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive:hover,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive:hover {
	background-color: #150c00;
}

.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive:active,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive:active,
.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive.cdx-button--is-active,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive.cdx-button--is-active {
	color: #000;
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive:active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive:active .cdx-button__icon,
	.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-progressive.cdx-button--is-active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-progressive.cdx-button--is-active .cdx-button__icon {
		background-color: #000;
	}
}

.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive:hover,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive:hover {
	/* shade 6 of https://www.color-hex.com/color/fee7e6 */
	background-color: #7f7373;
}

.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive:active,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive:active,
.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive.cdx-button--is-active,
.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive.cdx-button--is-active {
	color: #000;
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive:active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive:active .cdx-button__icon,
	.cdx-button:enabled.cdx-button--weight-quiet.cdx-button--action-destructive.cdx-button--is-active .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--enabled.cdx-button--weight-quiet.cdx-button--action-destructive.cdx-button--is-active .cdx-button__icon {
		background-color: #000;
	}
}

.cdx-button:disabled,
.cdx-button.cdx-button--fake-button--disabled {
	background-color: #37332e;
	color: #000;
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:disabled .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--disabled .cdx-button__icon {
		background-color: #000;
	}
}

.cdx-button:disabled.cdx-button--weight-quiet,
.cdx-button.cdx-button--fake-button--disabled.cdx-button--weight-quiet {
	color: #8d8882;
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-button:disabled.cdx-button--weight-quiet .cdx-button__icon,
	.cdx-button.cdx-button--fake-button--disabled.cdx-button--weight-quiet .cdx-button__icon {
		background-color: #8d8882;
	}
}

.cdx-accordion {
	border-bottom-color: #37332e;
}

.cdx-accordion>summary:hover {
	background-color: #070605;
}

.cdx-accordion>summary:active {
	background-color: #15130f;
}

.cdx-accordion .cdx-accordion__header__description {
	color: #aba6a2;
}

@supports not (((-webkit-mask-image:none) or (mask-image:none))) {
	.cdx-accordion>summary:before {
		filter: invert(100%);
	}

	.cdx-button:not(.cdx-button--weight-quiet):disabled .cdx-accordion>summary:before,
	.cdx-button--weight-primary.cdx-button--action-progressive .cdx-accordion>summary:before,
	.cdx-button--weight-primary.cdx-button--action-destructive .cdx-accordion>summary:before {
		filter: invert(0%);

		/* keep inverted #202122 background color */
		background-color: #dfdedd;
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-accordion>summary:before {
		filter: invert(100%);

		/* original background-color of #202122 */
	}
}

.cdx-button-group .cdx-button:disabled {
	box-shadow: 0 -1px #000,-1px 0 #000;
}

.cdx-thumbnail__placeholder,
.cdx-thumbnail__image {
	border-color: #37332e;
}

.cdx-thumbnail__placeholder {
	background-color: #070605;
}

@supports not (((-webkit-mask-image:none) or (mask-image:none))) {
	.cdx-thumbnail__placeholder__icon {
		filter: invert(100%);
	}

	.cdx-button:not(.cdx-button--weight-quiet):disabled .cdx-thumbnail__placeholder__icon,
	.cdx-button--weight-primary.cdx-button--action-progressive .cdx-thumbnail__placeholder__icon,
	.cdx-button--weight-primary.cdx-button--action-destructive .cdx-thumbnail__placeholder__icon {
		filter: invert(0%);

		/* keep inverted background-color of #72777d */
		background-color: #8d8882;
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-thumbnail__placeholder__icon {
		filter: invert(100%);

		/* original background-color is #72777d */
	}
}

.cdx-thumbnail__placeholder__icon--vue.cdx-icon {
	color: #8d8882;
}

.cdx-card {
	background-color: #000;
	border-color: #5d564e;
}

.cdx-card--is-link:hover {
	border-color: #8d8882;
}

.cdx-card--is-link:focus {
	box-shadow: inset 0 0 0 1px #36c,inset 0 0 0 2px #000;
}

.cdx-card__text__title {
	color: #dfdedd;
}

.cdx-card__text__description,
.cdx-card__text__supporting-text,
.cdx-card__text__description .cdx-icon,
.cdx-card__text__supporting-text .cdx-icon {
	color: #aba6a2;
}

.cdx-label:not(.cdx-label--disabled) .cdx-label__label__optional-flag,
.cdx-label:not(.cdx-label--disabled) .cdx-label__description {
	color: #aba6a2;
}

.cdx-label--disabled,
.cdx-label--disabled .cdx-label__label__icon {
	color: #8d8882;
}

.cdx-checkbox__icon {
	/* originally #fff */
	background-color: #000;
}

.cdx-checkbox__input:indeterminate+.cdx-checkbox__icon:before {
	background-color: #000;
}

.cdx-checkbox__input:checked:not(:indeterminate)+.cdx-checkbox__icon:before {
	filter: invert(100%);
}

.cdx-checkbox__input:enabled+.cdx-checkbox__icon {
	border-color: #8d8882;
}

.cdx-checkbox__input:enabled:checked:focus:not(:active)+.cdx-checkbox__icon,
.cdx-checkbox__input:enabled:indeterminate:focus:not(:active)+.cdx-checkbox__icon {
	box-shadow:inset 0 0 0 1px #36c,inset 0 0 0 2px #000;
}

.cdx-checkbox__input:disabled+.cdx-checkbox__icon {
	background-color: #37332e;
	border-color: #37332e;
}

.cdx-checkbox__input:disabled~.cdx-checkbox__label,
.cdx-checkbox__input:disabled~.cdx-checkbox__label.cdx-label {
	color: #8d8882;
}

.cdx-input-chip {
	background-color: #070605;
	color: #dfdedd;
	border-color: #37332e;
}

.cdx-input-chip:not(.cdx-input-chip--disabled):hover {
	background-color: #000;
}

.cdx-input-chip:not(.cdx-input-chip--disabled):active {
	background-color: #15130f;
	border-color: #8d8882;
}

.cdx-input-chip--disabled {
	background-color: #37332e;
	color: #000;
}

.cdx-input-chip--disabled .cdx-icon {
	color: #000;
}

.cdx-chip-input__input::placeholder {
	color: #8d8882;
}

.cdx-chip-input:not(.cdx-chip-input--disabled) .cdx-chip-input__chips,
.cdx-chip-input:not(.cdx-chip-input--disabled) .cdx-chip-input__separate-input {
	border-color: #5d564e;
}

.cdx-chip-input:not(.cdx-chip-input--disabled) .cdx-chip-input__chips .cdx-chip-input__input,
.cdx-chip-input:not(.cdx-chip-input--disabled) .cdx-chip-input__separate-input .cdx-chip-input__input {
	background-color: #000;
}

.cdx-chip-input:not(.cdx-chip-input--disabled) .cdx-chip-input__separate-input {
	background-color: #000;
}

.cdx-chip-input:not(.cdx-chip-input--disabled):not(.cdx-chip-input--has-separate-input) .cdx-chip-input__chips {
	background-color: #000;
}

.cdx-chip-input:not(.cdx-chip-input--disabled).cdx-chip-input--has-separate-input .cdx-chip-input__chips {
	background-color: #070605;
}

.cdx-chip-input:not(.cdx-chip-input--disabled):not(.cdx-chip-input--has-separate-input) .cdx-chip-input__chips:hover,
.cdx-chip-input:not(.cdx-chip-input--disabled).cdx-chip-input--has-separate-input .cdx-chip-input__separate-input:hover {
	border-color: #8d8882;
}

.cdx-chip-input--disabled .cdx-chip-input__chips,
.cdx-chip-input--disabled .cdx-chip-input__separate-input {
	background-color: #15130f;
	border-color: #37332e;
}

.cdx-chip-input--disabled .cdx-chip-input__chips .cdx-chip-input__input,
.cdx-chip-input--disabled .cdx-chip-input__separate-input .cdx-chip-input__input {
	color: #8d8882;
	-webkit-text-fill-color: #8d8882;
}

.cdx-menu-item--enabled,
.cdx-menu-item--enabled .cdx-menu-item__content {
	color: #dfdedd;
}

.cdx-menu-item--enabled .cdx-menu-item__text__supporting-text,
.cdx-menu-item--enabled .cdx-menu-item__text__description {
	color: #aba6a2;
}

.cdx-menu-item--enabled.cdx-menu-item--highlighted {
	background-color: #15130f;
}

.cdx-menu-item--enabled.cdx-menu-item--active {
	background-color: #150c00;
}

.cdx-menu-item--enabled.cdx-menu-item--selected {
	background-color: #150c00;
}

.cdx-menu-item--disabled {
	color: #8d8882;
}

.cdx-menu-item--disabled .cdx-menu-item__text__description {
	color: #8d8882;
}

.cdx-progress-bar:not(.cdx-progress-bar--inline) {
	border-color: #5d564e;
	box-shadow:0 2px 2px rgba(255,255,255,.2);
}

.cdx-progress-bar:not(.cdx-progress-bar--disabled).cdx-progress-bar--block {
	background-color: #000;
}

.cdx-progress-bar--disabled .cdx-progress-bar__bar {
	background-color: #37332e;
}

.cdx-progress-bar--disabled:not(.cdx-progress-bar--inline) {
	background-color: #15130f;
}

.cdx-menu {
	background-color: #000;
	border-color: #5d564e;
	box-shadow:0 2px 2px rgba(255,255,255,.2);
}

.cdx-menu--has-footer .cdx-menu-item:last-of-type:not(:first-of-type) {
	border-top-color: #37332e;
}

.cdx-text-input__input:enabled {
	background-color: #000;
	color: #dfdedd;
	border-color: #5d564e;
}

.cdx-text-input__input:enabled~.cdx-text-input__icon-vue {
	color: #8d8882;
}

.cdx-text-input__input:enabled:hover {
	border-color: #8d8882;
}

.cdx-text-input__input:enabled:focus~.cdx-text-input__icon-vue,
.cdx-text-input__input:enabled.cdx-text-input__input--has-value~.cdx-text-input__icon-vue {
	color: #dfdedd;
}

.cdx-text-input__input:enabled:read-only {
	background-color: #070605;
}

.cdx-text-input__input:disabled {
	background-color: #15130f;
	color: #8d8882;
	-webkit-text-fill-color: #8d8882;
	border-color: #37332e;
}

.cdx-text-input__input:disabled~.cdx-text-input__icon-vue {
	color: #8d8882;
}

.cdx-text-input__input::placeholder {
	color: #8d8882;
}

.cdx-dialog-backdrop {
	background-color: rgba(0,0,0,.65);
}

.cdx-dialog {
	background-color: #000;
	border-color: #5d564e;
	box-shadow: 0 2px 2px rgba(255,255,255,.2);
}

.cdx-dialog__header .cdx-dialog__header__subtitle {
	color: #aba6a2;
}

.cdx-dialog--dividers .cdx-dialog__header {
	border-bottom-color: #37332e;
}

.cdx-dialog__footer .cdx-dialog__footer__text {
	color: #aba6a2;
}

.cdx-dialog--dividers .cdx-dialog__footer {
	border-top-color: #37332e;
}

.cdx-message {
	/* shade 6 of https://www.color-hex.com/color/eaecf0 */
	background-color: #757678;

	color: #dfdedd;

	/* tint 6 of https://www.color-hex.com/color/54595d */
	border-color: #a9acae;
}

@supports not (((-webkit-mask-image:none) or (mask-image:none))) {
	.cdx-message .cdx-message__icon {
		filter: invert(100%);

		/* background-color can stay as inverted #202122 */
	}

	.cdx-button:not(.cdx-button--weight-quiet):disabled .cdx-message .cdx-message__icon,
	.cdx-button--weight-primary.cdx-button--action-progressive .cdx-message .cdx-message__icon,
	.cdx-button--weight-primary.cdx-button--action-destructive .cdx-message .cdx-message__icon {
		filter: invert(0%);

		/* use inverted #202122 as background-color */
		background-color: #dfdedd;
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-message .cdx-message__icon {
		filter: invert(100%);

		/* background-color can stay as inverted #202122 */
	}
}

@supports not (((-webkit-mask-image:none) or (mask-image:none))) {
	.cdx-message .cdx-message__icon:lang(ar) {
		filter: invert(100%);

		/* background-color can remain as inverted #202122 */
	}

	.cdx-button:not(.cdx-button--weight-quiet):disabled .cdx-message .cdx-message__icon:lang(ar),
	.cdx-button--weight-primary.cdx-button--action-progressive .cdx-message .cdx-message__icon:lang(ar),
	.cdx-button--weight-primary.cdx-button--action-destructive .cdx-message .cdx-message__icon:lang(ar) {
		filter: invert(0%);

		/* use inverted #202122 as background color */
		background-color: #dfdedd;
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-message .cdx-message__icon:lang(ar) {
		filter: invert(100%);

		/* background-color can remain as inverted #202122 */
	}
}

.cdx-message--warning {
	/* shade 6 of https://www.color-hex.com/color/fef6e7 */
	background-color: #7f7b73;

	/* tint 6 of https://www.color-hex.com/color/a66200 */
	border-color: #d2b07f;
}

@supports not (((-webkit-mask-image:none) or (mask-image:none))) {
	.cdx-message--warning .cdx-message__icon {
		filter: invert(100%);
	}

	.cdx-button:not(.cdx-button--weight-quiet):disabled .cdx-message--warning .cdx-message__icon,
	.cdx-button--weight-primary.cdx-button--action-progressive .cdx-message--warning .cdx-message__icon,
	.cdx-button--weight-primary.cdx-button--action-destructive .cdx-message--warning .cdx-message__icon {
		filter: invert(0%);
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-message--warning .cdx-message__icon {
		filter: invert(100%);

		/* restore original background color of #edab00 */
		background-color: #1254ff;
	}
}

.cdx-message--warning .cdx-message__icon--vue {
	/* color can be left as #edab00 */
	color: #edab00
}

.cdx-message--error {
	/* shade 6 of https://www.color-hex.com/color/fee7e6 */
	background-color: #7f7373;

	/* border-color can be left as #b32424 */
}

@supports not (((-webkit-mask-image:none) or (mask-image:none))) {
	.cdx-message--error .cdx-message__icon {
		filter: invert(100%);
	}

	.cdx-button:not(.cdx-button--weight-quiet):disabled .cdx-message--error .cdx-message__icon,
	.cdx-button--weight-primary.cdx-button--action-progressive .cdx-message--error .cdx-message__icon,
	.cdx-button--weight-primary.cdx-button--action-destructive .cdx-message--error .cdx-message__icon {
		filter: invert(0%);
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-message--error .cdx-message__icon {
		filter: invert(100%);

		/* restore original background color of #d73333 */
		background-color: #28cccc;
	}
}

.cdx-message--error .cdx-message__icon--vue {
	/* color can be left as #d73333 */
}

.cdx-message--success {
	/* shade 6 of https://www.color-hex.com/color/d5fdf4 */
	background-color: #6a7e7a;

	/* tint 6 of https://www.color-hex.com/color/096450 */
	border-color: #84b1a7;
}

@supports not (((-webkit-mask-image:none) or (mask-image:none))) {
	.cdx-message--success .cdx-message__icon {
		filter: invert(100%);
	}

	.cdx-button:not(.cdx-button--weight-quiet):disabled .cdx-message--success .cdx-message__icon,
	.cdx-button--weight-primary.cdx-button--action-progressive .cdx-message--success .cdx-message__icon,
	.cdx-button--weight-primary.cdx-button--action-destructive .cdx-message--success .cdx-message__icon {
		filter: invert(0);
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-message--success .cdx-message__icon {
		filter: invert(100%);

		/* use original background color of #14866d */
		background-color: #eb7992;
	}
}

.cdx-message--success .cdx-message__icon--vue {
	/* color can stay as #14866d */
}

.cdx-message--inline.cdx-message--error {
	/* color can stay as #d73333 */
}

.cdx-message--inline.cdx-message--success {
	/* color can stay as #14866d */
}

.cdx-field:not(.cdx-field--disabled) .cdx-field__help-text {
	color: #aba6a2;
}

.cdx-field--disabled .cdx-field__help-text {
	color: #8d8882;
}

.cdx-info-chip {
	border-color: #37332e;
}

.cdx-info-chip--text {
	color: #aba6a2;
}

.cdx-info-chip__icon--notice.cdx-icon {
	color: #dfdedd;
}

.cdx-info-chip__icon--error.cdx-icon {
	/* color can stay as #d73333 */
}

.cdx-info-chip__icon--warning.cdx-icon {
	/* color can stay as color #edab00 */
}

.cdx-info-chip__icon--success.cdx-icon {
	/* color can stay as #14866d */
}

.cdx-lookup--pending .cdx-text-input .cdx-text-input__input {
	background-color: #15130f;
	background-image:linear-gradient(135deg,#000 25%,transparent 25%,transparent 50%,#000 50%,#000 75%,transparent 75%,transparent);
}

.cdx-radio__icon {
	background-color: #000;
}

.cdx-radio__input:enabled+.cdx-radio__icon {
	border-color: #8d8882;
}

.cdx-radio__input:enabled:checked:focus+.cdx-radio__icon:before {
	border-color: #000;
}

.cdx-radio__input:enabled:checked:active+.cdx-radio__icon {
	background-color: #000;
}

.cdx-radio__input:disabled~.cdx-radio__label,
.cdx-radio__input:disabled~.cdx-radio__label.cdx-label {
	color: #8d8882;
}

.cdx-radio__input:disabled+.cdx-radio__icon {
	background-color: #37332e;
	border-color: #37332e;
}

.cdx-search-input--has-end-button {
	background-color: #000;
	border-color: #5d564e;
}

@supports not (((-webkit-mask-image:none) or (mask-image:none))) {
	.cdx-search-input .cdx-text-input__icon.cdx-text-input__start-icon {
		filter: invert(100%);
	}

	.cdx-button:not(.cdx-button--weight-quiet):disabled .cdx-search-input .cdx-text-input__icon.cdx-text-input__start-icon,
	.cdx-button--weight-primary.cdx-button--action-progressive .cdx-search-input .cdx-text-input__icon.cdx-text-input__start-icon,
	.cdx-button--weight-primary.cdx-button--action-destructive .cdx-search-input .cdx-text-input__icon.cdx-text-input__start-icon {
		filter: invert(0%);
	}
}

@supports ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-search-input .cdx-text-input__icon.cdx-text-input__start-icon {
		filter: invert(100%);

		/* background-color can stay as inverted #202122 */
	}
}

.cdx-select:disabled {
	filter: invert(100%);

	/*
	these can stay as inverted:
	background-color: #eaecf0;
	color: #72777d;
	border-color: #c8ccd1;
	*/
}

.cdx-select:enabled {
	filter: invert(100%);

	/*
	these can stay as inverted:
	background-color: #f8f9fa;
	color: #202122;
	border-color: #a2a9b1;
	*/
}

.cdx-select:enabled:hover {
	background-color: #000;
	color: #bfbdbb;
	border-color: #5d564e;
}

.cdx-select:enabled:active {
	color: #fff;
	border-color: #8d8882;
}

.cdx-select-vue__indicator.cdx-icon {
	color: #dfdedd;
}

.cdx-select-vue--enabled .cdx-select-vue__handle {
	background-color: #070605;
	color: #dfdedd;
	border-color: #5d564e;
}

.cdx-select-vue--enabled .cdx-select-vue__handle:hover {
	background-color: #000;
	color: #bfbdbb;
	border-color: #5d564e;
}

.cdx-select-vue--enabled .cdx-select-vue__handle:active {
	color: #fff;
	border-color: #8d8882;
}

.cdx-select-vue--enabled .cdx-select-vue__handle:hover .cdx-select-vue__indicator {
	color: #bfbdbb;
}

.cdx-select-vue--enabled.cdx-select-vue--expanded .cdx-select-vue__handle {
	background-color: #000;
}

.cdx-select-vue--enabled.cdx-select-vue--expanded .cdx-select-vue__handle .cdx-select-vue__indicator {
	color: #dfdedd;
}

.cdx-select-vue--disabled .cdx-select-vue__handle {
	background-color: #15130f;
	color: #8d8882;
	border-color: #37332e;
}

.cdx-select-vue--disabled .cdx-select-vue__indicator,
.cdx-select-vue--disabled .cdx-select-vue__start-icon {
	color: #8d8882;
}

.cdx-select-vue--status-error.cdx-select-vue--enabled .cdx-select-vue__handle {
	/* can stay as border-color: #b32424 */
}

.cdx-select-vue--status-error.cdx-select-vue--enabled .cdx-select-vue__handle:focus {
	/* can stay as border-color: #36c */
}

.cdx-tabs--framed>.cdx-tabs__header {
	background-color: #15130f;
}

.cdx-tabs--framed>.cdx-tabs__header .cdx-tabs__prev-scroller:after {
	background-image: linear-gradient(to right,#15130f 0,transparent 100%);
}

.cdx-tabs--framed>.cdx-tabs__header .cdx-tabs__next-scroller:before {
	background-image :linear-gradient(to left,#15130f 0,transparent 100%);
}

.cdx-tabs--framed>.cdx-tabs__header .cdx-tabs__list__item:enabled:hover {
	background-color: rgba(0,0,0,.3);
	color: #dfdedd;
}

.cdx-tabs--framed>.cdx-tabs__header .cdx-tabs__list__item:enabled:active {
	background-color: rgba(0,0,0,.65);
	color: #dfdedd;
}

.cdx-tabs--framed>.cdx-tabs__header .cdx-tabs__list__item[aria-selected=true],
.cdx-tabs--framed>.cdx-tabs__header .cdx-tabs__list__item[aria-selected=true]:hover {
	background-color: #000;
}

.cdx-tabs--framed>.cdx-tabs__header .cdx-tabs__list__item:disabled {
	background-color: #15130f;
	color: #8d8882;
}

.cdx-tabs:not(.cdx-tabs--framed)>.cdx-tabs__header {
	background-color: #000;
	border-bottom-color: #5d564e;
}

.cdx-tabs:not(.cdx-tabs--framed)>.cdx-tabs__header .cdx-tabs__prev-scroller:after {
	background-image:linear-gradient(to right,#000 0,transparent 100%)
}

.cdx-tabs:not(.cdx-tabs--framed)>.cdx-tabs__header .cdx-tabs__next-scroller:before {
	background-image:linear-gradient(to left,#000 0,transparent 100%)
}

.cdx-tabs:not(.cdx-tabs--framed)>.cdx-tabs__header .cdx-tabs__list__item:enabled {
	color: #dfdedd;
}

.cdx-tabs:not(.cdx-tabs--framed)>.cdx-tabs__header .cdx-tabs__list__item:disabled {
	color: #8d8882;
}

.cdx-text-area__textarea:enabled {
	background-color: #000;
	color: #dfdedd;
	border-color: #5d564e;
}

.cdx-text-area__textarea:enabled~.cdx-text-area__icon-vue.cdx-icon {
	color: #8d8882;
}

.cdx-text-area__textarea:enabled:hover {
	color: #8d8882;
}

.cdx-text-area__textarea:enabled:focus~.cdx-text-area__icon-vue.cdx-icon,
.cdx-text-area__textarea:enabled.cdx-text-area__textarea--has-value~.cdx-text-area__icon-vue.cdx-icon {
	color: #dfdedd;
}

.cdx-text-area__textarea:enabled:read-only {
	background-color: #070605;
}

.cdx-text-area__textarea:disabled {
	background-color: #15130f;
	color: #8d8882;
	border-color: #37332e;
}

.cdx-text-area__textarea:disabled~.cdx-text-area__icon-vue.cdx-icon {
	color: #8d8882;
}

.cdx-text-area__textarea::placeholder {
	color: #8d8882;
}

.cdx-text-area--status-error .cdx-text-area__textarea:enabled:not(:read-only) {
	/* can stay as border-color: #b32424; */
}

.cdx-text-area--status-error .cdx-text-area__textarea:enabled:not(:read-only):focus {
	/* can stay as 	border-color: #36c; */
}

.cdx-toggle-button:enabled {
	color: #dfdedd;
}

.cdx-toggle-button:enabled:active,
.cdx-toggle-button:enabled.cdx-toggle-button--is-active {
	color: #fff;
	background-color: #8d8882;
}

.cdx-toggle-button--framed:enabled {
	background-color: #070605;
	border-color: #5d564e;
}

.cdx-toggle-button--framed:enabled:hover {
	background-color: #000;
	color: #bfbdbb;
}

.cdx-toggle-button--framed:enabled:active,
.cdx-toggle-button--framed:enabled.cdx-toggle-button--is-active {
	background-color: #15130f;
}

.cdx-toggle-button--framed:disabled {
	background-color: #37332e;
	color: #000;
	border-color: #37332e;
}

.cdx-toggle-button--framed.cdx-toggle-button--toggled-on:enabled:focus {
	box-shadow:inset 0 0 0 1px #36c,inset 0 0 0 2px #000;
}

.cdx-toggle-button--framed.cdx-toggle-button--toggled-on:enabled:active,
.cdx-toggle-button--framed.cdx-toggle-button--toggled-on:enabled.cdx-toggle-button--is-active {
	background-color: #15130f;
	color: #000;
	border-color: #8d8882;
}

.cdx-toggle-button--quiet:enabled.cdx-toggle-button--toggled-on {
	background-color: #15130f;
}

.cdx-toggle-button--quiet:enabled:hover {
	background-color: #070605;
}

.cdx-toggle-button--quiet:enabled:focus {
	background-color: #070605;
}

.cdx-toggle-button--quiet:enabled:active,
.cdx-toggle-button--quiet:enabled.cdx-toggle-button--is-active {
	background-color: #15130f;
}

.cdx-toggle-button--quiet:disabled {
	color: #8d8882;
}

.cdx-toggle-button-group .cdx-toggle-button:disabled {
	box-shadow: 0 -1px #000,-1px 0 #000;
}

.cdx-toggle-button-group .cdx-toggle-button--toggled-on:enabled {
	box-shadow: 0 -1px #000,-1px 0 #000;	
}

.cdx-toggle-button-group .cdx-toggle-button--toggled-on:enabled:focus {
	box-shadow: inset 0 0 0 1px #36c,inset 0 0 0 2px #000,0 0 0 1px #000;
}

.cdx-toggle-switch__switch {
	background-color: #070605;
	border-color: #8d8882;
}

.cdx-toggle-switch__switch__grip {
	border-color: #8d8882;
}

.cdx-toggle-switch__input:checked~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip {
	background-color: #000;
	border-color: #000;
}

.cdx-toggle-switch__input:enabled~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip {
	background-color: #070605;
}

.cdx-toggle-switch__input:enabled:hover~.cdx-toggle-switch__switch {
	background-color: #000;
}

.cdx-toggle-switch__input:enabled:hover~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip {
	background-color: #000;
}

.cdx-toggle-switch__input:enabled:active~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip {
	border-color: #000;
}

.cdx-toggle-switch__input:enabled:checked~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip {
	border-color: #000;
}

.cdx-toggle-switch__input:enabled:checked:active~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip {
	background-color: #000;
	border-color: #000;
}

.cdx-toggle-switch__input:enabled:checked:focus:not(:active)~.cdx-toggle-switch__switch:before,
.cdx-toggle-switch__input:enabled:checked:focus:not(:active)~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip {
	border-color: #000;
}

.cdx-toggle-switch__input:disabled~.cdx-toggle-switch__switch {
	background-color: #37332e;
	border-color: #37332e;
}

.cdx-toggle-switch__input:disabled~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip {
	border-color: #000;
	box-shadow: inset 0 0 0 1px #000;
}

.cdx-toggle-switch__input:disabled:checked~.cdx-toggle-switch__switch .cdx-toggle-switch__switch__grip {
	background-color: #000;
}

.cdx-typeahead-search__search-footer.cdx-menu-item:visited {
	color: #dfdedd;
}

.cdx-typeahead-search__search-footer__icon.cdx-icon {
	color: #aba6a2;
}

.mw-htmlform-invalid-input td.mw-input input {
	/* can stay as border-color: #d73333; */
}

.mw-icon-question {
	filter: invert(100%);
}

.mw-htmlform .mw-secure {
	filter: invert(1900%);
}

.fancycaptcha-captcha-container {
	background-color: #070605;
	border-color: #37332e;
}

.fancycaptcha-captcha-and-reload {
	border-color: #37332e;
	background-color: #000;
}

.fancycaptcha-captcha-container .mw-ui-input {
	border-color: #37332e;
}

@supports not ((-webkit-mask-image:none) or (mask-image:none)) {
	.cdx-message .mw-userLogin-icon--user-temporary {
		filter: invert(100%);
	}

	.cdx-button:not(.cdx-button--weight-quiet):disabled .cdx-message .mw-userLogin-icon--user-temporary,
	.cdx-button--weight-primary.cdx-button--action-progressive .cdx-message .mw-userLogin-icon--user-temporary,
	.cdx-button--weight-primary.cdx-button--action-destructive .cdx-message .mw-userLogin-icon--user-temporary {
		filter: invert(0%);
	}
}

@supports (-webkit-mask-image:none) or (mask-image:none) {
	.cdx-message .mw-userLogin-icon--user-temporary {
		filter: invert(100%);

		/* background-color can stay as inverted #202122 */
	}
}

#mw-createaccount-cta {
	/* dont filter: invert(100%); */
	/* the image cannot be found anyway */
	/* causes negative impact if filter is applied */
}

/* should be fine to ignore after 3227 as it repeats the first style */

/* inline stylesheet 1 563 rules */

.oo-ui-buttonElement-frameless.oo-ui-widget-enabled > .oo-ui-buttonElement-button {
	color: #dfdedd;
}

.oo-ui-buttonElement-frameless.oo-ui-widget-enabled > .oo-ui-buttonElement-button:hover {
	background-color: rgba(255, 231, 182, 0.027);
	color: #fff;
}

.oo-ui-buttonElement-frameless.oo-ui-widget-enabled.oo-ui-buttonElement-pressed > input.oo-ui-buttonElement-button,
.oo-ui-buttonElement-frameless.oo-ui-widget-enabled > .oo-ui-buttonElement-button:active {
	background-color: rgba(255, 231, 182, 0.082);
	color: #fff;
	border-color: #8d8882;
}

.oo-ui-buttonElement-framed.oo-ui-widget-disabled > .oo-ui-buttonElement-button {
	background-color: #37332e;
	color: #000;
	border-color: #37332e;
}

.oo-ui-buttonElement-framed.oo-ui-widget-disabled.oo-ui-buttonElement-active > .oo-ui-buttonElement-button {
	background-color: #6e6046;
}

.oo-ui-buttonElement-framed.oo-ui-widget-enabled > .oo-ui-buttonElement-button {
	background-color: #070605;
	color: #dfdedd;
	border-color: #5d564e;
}

.oo-ui-buttonElement-framed.oo-ui-widget-enabled > .oo-ui-buttonElement-button:hover {
	background-color: #000;
	color: #bfbdbb;
	border-color: #5d564e;
}

.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-buttonElement-active > .oo-ui-buttonElement-button:focus {
	box-shadow: inset 0 0 0 1px #36c, inset 0 0 0 2px #000;
}

.oo-ui-buttonElement-framed.oo-ui-widget-enabled > .oo-ui-buttonElement-button:active,
.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-buttonElement-pressed > .oo-ui-buttonElement-button {
	background-color: #15130f;
	color: #fff;
	border-color: #8d8882;
}

.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-progressive > .oo-ui-buttonElement-button:hover {
	background-color: #000;
}

.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-progressive > .oo-ui-buttonElement-button:active,
.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-progressive.oo-ui-buttonElement-pressed > .oo-ui-buttonElement-button,
.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-progressive.oo-ui-buttonElement-active > .oo-ui-buttonElement-button,
.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-progressive.oo-ui-popupToolGroup-active > .oo-ui-buttonElement-button {
	background-color: #100c05;
}

.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-destructive > .oo-ui-buttonElement-button:hover {
	background-color: #000;
}

.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-destructive > .oo-ui-buttonElement-button:active,
.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-destructive.oo-ui-buttonElement-pressed > .oo-ui-buttonElement-button,
.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-destructive.oo-ui-buttonElement-active > .oo-ui-buttonElement-button,
.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-destructive.oo-ui-popupToolGroup-active > .oo-ui-buttonElement-button {
	background-color: #000;
}

.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-primary.oo-ui-flaggedElement-progressive > .oo-ui-buttonElement-button:focus {
	box-shadow: inset 0 0 0 1px #36c, inset 0 0 0 2px #000;
}

.oo-ui-buttonElement-framed.oo-ui-widget-enabled.oo-ui-flaggedElement-primary.oo-ui-flaggedElement-destructive > .oo-ui-buttonElement-button:focus {
	box-shadow: inset 0 0 0 1px #d73333, inset 0 0 0 2px #000;
}

/* not sure if these need to be inverted */
/*
@media (forced-colors: active) and (prefers-color-scheme: dark) {
	.oo-ui-iconElement-icon:not(.oo-ui-image-invert) {
		filter: invert(1) hue-rotate(180deg);
	}
}

@media (forced-colors: active) and (prefers-color-scheme: dark) {
	.oo-ui-indicatorElement-indicator:not(.oo-ui-image-invert) {
		filter: invert(1) hue-rotate(180deg);
	}
}
*/

.oo-ui-pendingElement-pending {
	background-color: #15130f;
	background-image: linear-gradient(135deg,#000 25%,transparent 25%,transparent 50%,#000 50%,#000 75%,transparent 75%,transparent);
}

.oo-ui-fieldLayout-disabled > .oo-ui-fieldLayout-body > .oo-ui-fieldLayout-header > .oo-ui-labelElement-label {
	color: #8d8882;
}

.oo-ui-panelLayout-framed {
	border-color: #5d564e;
}

.oo-ui-optionWidget.oo-ui-widget-disabled {
	color: #8d8882;
}

.oo-ui-radioSelectWidget:focus [type="radio"]:checked + span::before {
	border-color: #000;
}

.oo-ui-labelWidget.oo-ui-inline-help {
	color: #aba6a2;
}

.oo-ui-buttonGroupWidget .oo-ui-buttonElement-framed.oo-ui-widget-disabled + .oo-ui-widget-disabled > .oo-ui-buttonElement-button {
	border-left-color: #000;
}

.oo-ui-buttonGroupWidget.oo-ui-widget-enabled .oo-ui-buttonElement.oo-ui-toggleWidget-on + .oo-ui-toggleWidget-on > .oo-ui-buttonElement-button,
.oo-ui-buttonGroupWidget.oo-ui-widget-enabled .oo-ui-buttonElement.oo-ui-toggleWidget-on + .oo-ui-toggleWidget-on > .oo-ui-buttonElement-button:active {
	border-left-color: #5d564e;
}

.oo-ui-checkboxInputWidget [type="checkbox"] + span {
	background-color: #000;
	border-color: #8d8882;
}

.oo-ui-checkboxInputWidget [type="checkbox"]:indeterminate + span::before {
	background-color: #000;
}

.oo-ui-checkboxInputWidget [type="checkbox"]:disabled + span {
	background-color: #37332e;
	border-color: #37332e;
}

.oo-ui-checkboxInputWidget.oo-ui-widget-enabled[type="checkbox"]:checked:focus + span,
.oo-ui-checkboxInputWidget.oo-ui-widget-enabled[type="checkbox"]:indeterminate:focus + span {
	box-shadow: inset 0 0 0 1px #36c, inset 0 0 0 2px #000;
}

.oo-ui-icon-alert,
.mw-ui-icon-alert:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-alert,
.mw-ui-icon-alert-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-alert,
.mw-ui-icon-alert-progressive:before {
	filter: invert(100%);
}

.oo-ui-image-warning.oo-ui-icon-alert,
.mw-ui-icon-alert-warning:before {
	filter: invert(100%);
}

.oo-ui-icon-error,
.mw-ui-icon-error:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-error,
.mw-ui-icon-error-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-error,
.mw-ui-icon-error-progressive:before {
	filter: invert(100%);
}

.oo-ui-image-error.oo-ui-icon-error,
.mw-ui-icon-error-error:before {
	filter: invert(100%);
}

.oo-ui-icon-success,
.mw-ui-icon-success:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-success,
.mw-ui-icon-success-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-success,
.mw-ui-icon-success-progressive:before {
	filter: invert(100%);
}

.oo-ui-image-success.oo-ui-icon-success,
.mw-ui-icon-success-success:before {
	filter: invert(100%);
}

.oo-ui-icon-info,
.mw-ui-icon-info:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-info,
.mw-ui-icon-info-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-info,
.mw-ui-icon-info-progressive:before {
	filter: invert(100%);
}

.oo-ui-icon-infoFilled,
.mw-ui-icon-infoFilled:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-infoFilled,
.mw-ui-icon-infoFilled-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-infoFilled,
.mw-ui-icon-infoFilled-progressive:before {
	filter: invert(100%);
}

.oo-ui-icon-add,
.mw-ui-icon-add:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-add,
.mw-ui-icon-add-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-add,
.mw-ui-icon-add-progressive:before {
	filter: invert(100%);
}

.oo-ui-icon-check,
.mw-ui-icon-check:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-check,
.mw-ui-icon-check-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-check,
.mw-ui-icon-check-progressive:before {
	filter: invert(100%);
}

.oo-ui-image-destructive.oo-ui-icon-check,
.mw-ui-icon-check-destructive:before {
	filter: invert(100%);
}

.oo-ui-image-success.oo-ui-icon-check,
.mw-ui-icon-check-success:before {
	filter: invert(100%);
}

.oo-ui-icon-close,
.mw-ui-icon-close:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-close,
.mw-ui-icon-close-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-close,
.mw-ui-icon-close-progressive:before {
	filter: invert(100%);
}

.oo-ui-icon-search,
.mw-ui-icon-search:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-search,
.mw-ui-icon-search-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-search,
.mw-ui-icon-search-progressive:before {
	filter: invert(100%);
}

.oo-ui-icon-subtract,
.mw-ui-icon-subtract:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-subtract,
.mw-ui-icon-subtract-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-subtract,
.mw-ui-icon-subtract-progressive:before {
	filter: invert(100%);
}

.oo-ui-image-destructive.oo-ui-icon-subtract,
.mw-ui-icon-subtract-destructive:before {
	filter: invert(100%);
}

.oo-ui-indicator-clear {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-indicator-clear {
	filter: invert(100%);
}

.oo-ui-indicator-up {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-indicator-up {
	filter: invert(100%);
}

.oo-ui-indicator-down {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-indicator-down {
	filter: invert(100%);
}

.oo-ui-indicator-required {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-indicator-required {
	filter: invert(100%);
}

/* inline stylesheet 2 19 rules */

.oo-ui-icon-upload,
.mw-ui-icon-upload:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-upload,
.mw-ui-icon-upload-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-upload,
.mw-ui-icon-upload-progressive:before {
	filter: invert(100%);
}

.oo-ui-icon-attachment,
.mw-ui-icon-attachment:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-attachment,
.mw-ui-icon-attachment-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-attachment,
.mw-ui-icon-attachment-progressive:before {
	filter: invert(100%);
}

.oo-ui-icon-trash,
.mw-ui-icon-trash:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-trash,
.mw-ui-icon-trash-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-trash,
.mw-ui-icon-trash-progressive:before {
	filter: invert(100%);
}

.oo-ui-image-destructive.oo-ui-icon-trash,
.mw-ui-icon-trash-destructive:before {
	filter: invert(100%);
}

.oo-ui-icon-collapse,
.mw-ui-icon-collapse:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-collapse,
.mw-ui-icon-collapse-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-collapse,
.mw-ui-icon-collapse-progressive:before {
	filter: invert(100%);
}

.oo-ui-icon-expand,
.mw-ui-icon-expand:before {
	filter: invert(100%);
}

.oo-ui-image-invert.oo-ui-icon-expand,
.mw-ui-icon-expand-invert:before {
	filter: invert(100%);
}

.oo-ui-image-progressive.oo-ui-icon-expand,
.mw-ui-icon-expand-progressive:before {
	filter: invert(100%);
}

/* inline stylesheet 3 162 rules */

.oo-ui-bookletLayout-outlinePanel > .oo-ui-outlineControlsWidget {
	border-top-color: #37332e;
}

.oo-ui-bookletLayout > .oo-ui-menuLayout-menu {
	border-right-color: #37332e;
}

.oo-ui-buttonSelectWidget .oo-ui-buttonOptionWidget.oo-ui-widget-disabled + .oo-ui-widget-disabled > .oo-ui-buttonElement-button {
	border-left-color: #000;
}

.oo-ui-buttonSelectWidget.oo-ui-widget-enabled:focus .oo-ui-buttonOptionWidget.oo-ui-optionWidget-selected .oo-ui-buttonElement-button {
	box-shadow: inset 0 0 0 1px #36c,inset 0 0 0 2px #000;
}

.oo-ui-toggleButtonWidget.oo-ui-widget-enabled.oo-ui-buttonElement-frameless.oo-ui-toggleWidget-on .oo-ui-buttonElement-button {
	background-color: rgba(255,231,182,0.082);
	color: #fff;
}

.oo-ui-outlineOptionWidget.oo-ui-optionWidget-highlighted {
	background-color: #15130f;
	color: #fff;
}

.oo-ui-outlineOptionWidget.oo-ui-optionWidget-selected,
.oo-ui-outlineOptionWidget.oo-ui-optionWidget-pressed {
	background-color: #150c00;
}

.oo-ui-outlineControlsWidget {
	background-color: #000;
}

.oo-ui-tabSelectWidget-framed {
	background-color: #15130f;
}

.oo-ui-tabSelectWidget-frameless {
	box-shadow: inset 0 -1px 0 0 #5d564e;
}

.oo-ui-tabSelectWidget-mobile.oo-ui-tabSelectWidget-framed::after {
	background-color: #15130f;
	background-image: linear-gradient(to right,rgba(21,19,15,0) 0,#15130f 100%);
	background-color: transparent;
}

.oo-ui-tabSelectWidget-mobile.oo-ui-tabSelectWidget-frameless::after {
	background-color: #000;
	background-image:linear-gradient(to right,rgba(0,0,0,0) 0,#000 100%);
	background-color: transparent;
}

.oo-ui-tabSelectWidget-framed .oo-ui-tabOptionWidget.oo-ui-optionWidget-selected {
	background-color: #000;
	color: #fff;
}

.oo-ui-tabSelectWidget-framed .oo-ui-tabOptionWidget.oo-ui-optionWidget-selected .oo-ui-labelElement-label {
	border-bottom-color: #000;
}

.oo-ui-tabSelectWidget-framed .oo-ui-tabOptionWidget.oo-ui-widget-enabled:hover {
	background-color: rgba(0,0,0,0.3);
	color: #dfdedd;
}

.oo-ui-tabSelectWidget-framed .oo-ui-tabOptionWidget.oo-ui-widget-enabled:active {
	background-color: rgba(0,0,0,0.8);
	color: #fff;
}

.oo-ui-tabSelectWidget-framed .oo-ui-tabOptionWidget.oo-ui-widget-enabled.oo-ui-optionWidget-selected:hover {
	background-color: #000;
}

.oo-ui-tagMultiselectWidget-handle {
	border-color: #5d564e;
}

.oo-ui-tagMultiselectWidget-handle .oo-ui-tagMultiselectWidget-group > input {
	color: #fff;
}

.oo-ui-tagMultiselectWidget-handle .oo-ui-tagMultiselectWidget-group > input::-webkit-input-placeholder {
	color: #8d8882;
}

.oo-ui-tagMultiselectWidget-handle .oo-ui-tagMultiselectWidget-group > input:-ms-input-placeholder {
	color: #8d8882;
}

.oo-ui-tagMultiselectWidget-handle .oo-ui-tagMultiselectWidget-group > input::-moz-placeholder {
	color: #8d8882;
}

.oo-ui-tagMultiselectWidget-handle .oo-ui-tagMultiselectWidget-group > input::placeholder {
	color: #8d8882;
}

.oo-ui-tagMultiselectWidget.oo-ui-widget-enabled {
	background-color: #000;
}

.oo-ui-tagMultiselectWidget.oo-ui-widget-enabled.oo-ui-tagMultiselectWidget-inlined:hover .oo-ui-tagMultiselectWidget-handle {
	border-color: #8d8882;
}

.oo-ui-tagMultiselectWidget.oo-ui-widget-enabled.oo-ui-tagMultiselectWidget-outlined {
	background-color: #070605;
}

.oo-ui-tagMultiselectWidget.oo-ui-widget-enabled.oo-ui-tagMultiselectWidget-outlined .oo-ui-tagItemWidget.oo-ui-widget-enabled {
	background-color: #000;
}

.oo-ui-tagMultiselectWidget.oo-ui-widget-disabled .oo-ui-tagMultiselectWidget-handle {
	background-color: #15130f;
	color: #8d8882;
	text-shadow: 0 1px 1px #000;
	border-color: #37332e;
}

.oo-ui-tagItemWidget {
	border-color: #5d564e;
}

.oo-ui-tagItemWidget.oo-ui-widget-enabled:hover {
	background-color:#000;
	color: #bfbdbb;
	border-color: #5d564e;
}

.oo-ui-tagItemWidget.oo-ui-widget-enabled:not(.oo-ui-tagItemWidget-fixed) {
	background-color: #070605;
}

.oo-ui-tagItemWidget.oo-ui-widget-enabled .oo-ui-buttonElement-button:hover {
	background-color: #000;
}

.oo-ui-tagItemWidget.oo-ui-widget-enabled .oo-ui-buttonElement-button:active {
	background-color: #15130f;
}

.oo-ui-tagItemWidget.oo-ui-widget-disabled {
	background-color: #15130f;
	color: #8d8882;
	border-color: #37332e;
	text-shadow: 0 1px 1px #000;
}

.oo-ui-searchWidget-query {
	border-bottom-color: #37332e;
	box-shadow: 0 1px 1px rgba(255,255,255,0.2);
}`;

	style4.innerHTML = `/* load.php 1137 rules https://www.warzone.com/wiki/index.php?title=Special:CreateAccount&returnto=Main+Page */

/* TODO */

`;

	document.head.appendChild(style);
	document.head.appendChild(style2);
	document.head.appendChild(style3);
	// document.head.appendChild(style4);
})();