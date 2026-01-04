// ==UserScript==
// @name wahoofitness.com - Dark Mode
// @namespace typpi.online
// @version 1.0.3
// @description Dark mode theme for Wahoo
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.wahoofitness.com/*
// @downloadURL https://update.greasyfork.org/scripts/520669/wahoofitnesscom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520669/wahoofitnesscom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(
		html:not([stylus-iframe]),
		img,
		svg,
		video,
		.bg-home
	) {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	:root {
		--zd-color-black: #000000;
		--zd-color-green-100: #edf8f4;
		--zd-color-green-200: #d1e8df;
		--zd-color-green-300: #aecfc2;
		--zd-color-green-400: #5eae91;
		--zd-color-green-500: #228f67;
		--zd-color-green-600: #038153;
		--zd-color-green-700: #186146;
		--zd-color-green-800: #0b3b29;
		--zd-color-grey-100: #f8f9f9;
		--zd-color-grey-200: #e9ebed;
		--zd-color-grey-300: #d8dcde;
		--zd-color-grey-400: #c2c8cc;
		--zd-color-grey-500: #87929d;
		--zd-color-grey-600: #68737d;
		--zd-color-grey-700: #49545c;
		--zd-color-grey-800: #2f3941;
		--zd-color-blue-100: #edf7ff;
		--zd-color-blue-200: #cee2f2;
		--zd-color-blue-300: #adcce4;
		--zd-color-blue-400: #5293c7;
		--zd-color-blue-500: #337fbd;
		--zd-color-blue-600: #1f73b7;
		--zd-color-blue-700: #144a75;
		--zd-color-blue-800: #0f3554;
		--zd-color-kale-100: #f5fcfc;
		--zd-color-kale-200: #daeded;
		--zd-color-kale-300: #bdd9d7;
		--zd-color-kale-400: #90bbbb;
		--zd-color-kale-500: #467b7c;
		--zd-color-kale-600: #17494d;
		--zd-color-kale-700: #03363d;
		--zd-color-kale-800: #012b30;
		--zd-color-red-100: #fff0f1;
		--zd-color-red-200: #f5d5d8;
		--zd-color-red-300: #f5b5ba;
		--zd-color-red-400: #e35b66;
		--zd-color-red-500: #d93f4c;
		--zd-color-red-600: #cc3340;
		--zd-color-red-700: #8c232c;
		--zd-color-red-800: #681219;
		--zd-color-yellow-100: #fff7ed;
		--zd-color-yellow-200: #ffeedb;
		--zd-color-yellow-300: #fed6a8;
		--zd-color-yellow-400: #ffb057;
		--zd-color-yellow-500: #f79a3e;
		--zd-color-yellow-600: #ed8f1c;
		--zd-color-yellow-700: #ad5918;
		--zd-color-yellow-800: #703815;
		--zd-color-white: #ffffff;
		--zd-color-secondary-azure-400: #3091ec;
		--zd-color-secondary-azure-600: #1371d6;
		--zd-color-secondary-crimson-400: #e34f32;
		--zd-color-secondary-crimson-600: #c72a1c;
		--zd-color-secondary-fuschia-400: #d653c2;
		--zd-color-secondary-fuschia-600: #a81897;
		--zd-color-secondary-lemon-400: #ffd424;
		--zd-color-secondary-lemon-600: #ffbb10;
		--zd-color-secondary-lime-400: #43b324;
		--zd-color-secondary-lime-600: #2e8200;
		--zd-color-secondary-mint-400: #00a656;
		--zd-color-secondary-mint-600: #058541;
		--zd-color-secondary-orange-400: #de701d;
		--zd-color-secondary-orange-600: #bf5000;
		--zd-color-secondary-pink-400: #ec4d63;
		--zd-color-secondary-pink-600: #d42054;
		--zd-color-secondary-purple-400: #b552e2;
		--zd-color-secondary-purple-600: #6a27b8;
		--zd-color-secondary-royal-400: #5d7df5;
		--zd-color-secondary-royal-600: #3353e2;
		--zd-color-secondary-teal-400: #02a191;
		--zd-color-secondary-teal-600: #028079;
		--zd-color-secondary-azure-M400: #5f8dcf;
		--zd-color-secondary-azure-M600: #3a70b2;
		--zd-color-secondary-crimson-M400: #cc6c5b;
		--zd-color-secondary-crimson-M600: #b24a3c;
		--zd-color-secondary-fuschia-M400: #cf62a8;
		--zd-color-secondary-fuschia-M600: #a8458c;
		--zd-color-secondary-lemon-M400: #e7a500;
		--zd-color-secondary-lemon-M600: #c38f00;
		--zd-color-secondary-lime-M400: #519e2d;
		--zd-color-secondary-lime-M600: #47782c;
		--zd-color-secondary-mint-M400: #299c66;
		--zd-color-secondary-mint-M600: #2e8057;
		--zd-color-secondary-orange-M400: #d4772c;
		--zd-color-secondary-orange-M600: #b35827;
		--zd-color-secondary-pink-M400: #d57287;
		--zd-color-secondary-pink-M600: #b23a5d;
		--zd-color-secondary-purple-M400: #b072cc;
		--zd-color-secondary-purple-M600: #9358b0;
		--zd-color-secondary-royal-M400: #7986d8;
		--zd-color-secondary-royal-M600: #4b61c3;
		--zd-color-secondary-teal-M400: #2d9e8f;
		--zd-color-secondary-teal-M600: #3c7873;
		--zd-color-chat-orange: #f79a3e;
		--zd-color-connect-red: #ff6224;
		--zd-color-explore-blue: #30aabc;
		--zd-color-gather-pink: #f6c8be;
		--zd-color-guide-pink: #ff6224;
		--zd-color-message-green: #37b8af;
		--zd-color-sell-gold: #c38f00;
		--zd-color-support-green: #00a656;
		--zd-color-talk-yellow: #efc93d;
		--zd-font-family-monospace: sfmono-regular,
			consolas, 'Liberation Mono', menlo, courier,
			monospace;
		--zd-font-family-system: system-ui,
			-apple-system, segoe ui, roboto, ubuntu,
			cantarell, noto sans, sans-serif,
			blinkmacsystemfont, 'Segoe UI', roboto,
			oxygen-sans, ubuntu, cantarell,
			'Helvetica Neue', arial, sans-serif;
		--zd-font-size-xs: 10px;
		--zd-font-size-sm: 12px;
		--zd-font-size-md: 14px;
		--zd-font-size-lg: 18px;
		--zd-font-size-xl: 22px;
		--zd-font-size-xxl: 26px;
		--zd-font-size-xxxl: 36px;
		--zd-font-size-sm-monospace: 11px;
		--zd-font-size-md-monospace: 13px;
		--zd-font-size-lg-monospace: 17px;
		--zd-font-weight-thin: 100;
		--zd-font-weight-extralight: 200;
		--zd-font-weight-light: 300;
		--zd-font-weight-regular: 400;
		--zd-font-weight-medium: 500;
		--zd-font-weight-semibold: 600;
		--zd-font-weight-bold: 700;
		--zd-font-weight-extrabold: 800;
		--zd-font-weight-black: 900;
		--zd-font-weight-ultralight: 200;
		--zd-font-weight-ultrabold: 800;
		--zd-font-weight-heavy: 900;
		--zd-line-height-sm: 16px;
		--zd-line-height-md: 20px;
		--zd-line-height-lg: 24px;
		--zd-line-height-xl: 28px;
		--zd-line-height-xxl: 32px;
		--zd-line-height-xxxl: 44px;
		--zd-spacing-xxs: 4px;
		--zd-spacing-xs: 8px;
		--zd-spacing-sm: 12px;
		--zd-spacing: 20px;
		--zd-spacing-lg: 32px;
		--zd-spacing-xl: 40px;
		--zd-spacing-xxl: 48px;
	}

	@charset "UTF-8";
	html {
		line-height: 1.15;
		text-size-adjust: 100%;
	}

	body {
		margin: 0;
	}

	main {
		display: block;
	}

	h1 {
		margin: 0.67em 0;
		font-size: 2em;
	}

	hr {
		box-sizing: content-box;
		height: 0;
		overflow: visible;
	}

	pre {
		font-size: 1em;
		font-family: monospace;
	}

	a {
		background-color: transparent;
	}

	abbr[title] {
		border-bottom: none;
		text-decoration: underline;
		text-decoration: underline dotted;
	}

	b,
	strong {
		font-weight: bolder;
	}

	code,
	kbd,
	samp {
		font-size: 1em;
		font-family: monospace;
	}

	small {
		font-size: 80%;
	}

	sub,
	sup {
		position: relative;
		vertical-align: baseline;
		font-size: 75%;
		line-height: 0;
	}

	sub {
		bottom: -0.25em;
	}

	sup {
		top: -0.5em;
	}

	img {
		border-style: none;
	}

	button,
	input,
	optgroup,
	select,
	.nesty-input,
	.hc-multiselect-toggle,
	textarea {
		margin: 5;
		font-size: 100%;
		line-height: 1.15;
		font-family: inherit;
	}

	button,
	input {
		overflow: visible;
	}

	button,
	select,
	.nesty-input,
	.hc-multiselect-toggle {
		text-transform: none;
	}

	button,
	[type='button'],
	[type='reset'],
	[type='submit'] {
		appearance: button;
	}

	button::-moz-focus-inner,
	[type='button']::-moz-focus-inner,
	[type='reset']::-moz-focus-inner,
	[type='submit']::-moz-focus-inner {
		border-style: none;
		padding: 0;
	}

	button:-moz-focusring,
	[type='button']:-moz-focusring,
	[type='reset']:-moz-focusring,
	[type='submit']:-moz-focusring {
		outline: 1px dotted ButtonText;
	}

	fieldset {
		padding: 0.35em 0.75em 0.625em;
	}

	legend {
		display: table;
		box-sizing: border-box;
		padding: 0;
		max-width: 100%;
		color: inherit;
		white-space: normal;
	}

	progress {
		vertical-align: baseline;
	}

	textarea {
		overflow: auto;
	}

	[type='checkbox'],
	[type='radio'] {
		box-sizing: border-box;
		padding: 0;
	}

	[type='number']::-webkit-inner-spin-button,
	[type='number']::-webkit-outer-spin-button {
		height: auto;
	}

	[type='search'] {
		appearance: textfield;
		outline-offset: -2px;
	}

	[type='search']::-webkit-search-decoration {
		appearance: none;
	}

	::-webkit-file-upload-button {
		appearance: button;
		font: inherit;
	}

	details {
		display: block;
	}

	summary {
		display: list-item;
	}

	template {
		display: none;
	}

	[hidden] {
		display: none;
	}

	@viewport {
		width: device-width;
	}

	*,
	*::before,
	*::after {
		box-sizing: border-box;
	}

	html {
		font-size: 16px;
		text-size-adjust: 100%;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		-webkit-tap-highlight-color: rgb(0 0 0 / 0%);
		-ms-overflow-style: scrollbar;
		background-color: #f7f7f7;
	}

	body {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		color: #333333;
		font-weight: 400;
		font-size: 1em;
		line-height: 1.5;
		font-family:
			Source Sans Pro,
			-apple-system,
			BlinkMacSystemFont,
			Segoe UI,
			Helvetica,
			Arial,
			sans-serif;
	}

	[role='main'] {
		flex-grow: 1;
	}

	article,
	aside,
	dialog,
	figcaption,
	figure,
	footer,
	header,
	hgroup,
	main,
	nav,
	section {
		display: block;
	}

	output {
		display: inline-block;
	}

	summary {
		display: list-item;
	}

	hr {
		box-sizing: content-box;
		height: 0;
		overflow: visible;
	}

	[tabindex='-1']:focus {
		outline: none !important;
	}

	a,
	area,
	button,
	[role='button'],
	input:not([type='range']),
	label,
	select,
	.nesty-input,
	.hc-multiselect-toggle,
	summary,
	textarea {
		touch-action: manipulation;
	}

	p {
		margin-top: 0;
		margin-bottom: 16px;
	}

	h1,
	.h1,
	h2,
	.h2,
	h3,
	.h3,
	h4,
	.h4,
	h5,
	.h5,
	h6,
	.h6 {
		margin: 1.5rem 0 1rem;
		color: #222222;
		line-height: 1.375;
		font-family:
			Source Sans Pro,
			-apple-system,
			BlinkMacSystemFont,
			Segoe UI,
			Helvetica,
			Arial,
			sans-serif;
	}

	h1,
	.h1 {
		font-weight: 600;
		font-size: 1.875rem;
	}

	h2,
	.h2 {
		font-weight: 600;
		font-size: 1.5rem;
	}

	h3,
	.h3 {
		font-weight: 700;
		font-size: 1.25rem;
	}

	h4,
	.h4 {
		font-weight: 700;
		font-size: 1.125rem;
	}

	h5,
	.h5 {
		font-weight: 700;
		font-size: 1em;
	}

	h6,
	.h6 {
		font-weight: 700;
		font-size: 0.875rem;
	}

	b,
	strong {
		font-weight: 700;
	}

	em {
		background-color: #faf089;
		padding: 0 0.25rem;
	}

	sub,
	sup {
		position: relative;
		vertical-align: baseline;
		font-size: 75%;
		line-height: 0;
	}

	sub {
		bottom: -0.25em;
	}

	sup {
		top: -0.5em;
	}

	dfn {
		font-style: italic;
	}

	abbr[title],
	abbr[data-original-title] {
		cursor: help;
		border-bottom: 0;
		text-decoration: underline;
		text-decoration: underline dotted;
	}

	address {
		margin-bottom: 16px;
		font-style: normal;
		line-height: inherit;
	}

	small,
	.small {
		font-size: 0.875rem;
	}

	mark {
		background-color: #fefcbf;
		padding: 0.2rem;
		color: #333333;
	}

	blockquote {
		margin: 0 0 1rem;
		border-width: 0 0 0 4px;
		border-style: solid;
		border-color: #e2e8f0;
		padding: 1.5em;
	}

	summary {
		cursor: pointer;
		text-decoration: none;
	}

	pre,
	code,
	samp {
		font-size: 0.875em;
		font-family:
			SFMono-Regular,
			Menlo,
			Monaco,
			Consolas,
			Liberation Mono,
			Courier New,
			monospace;
	}

	code {
		border-radius: 0.25rem;
		background-color: #f1f1f1;
		padding: 0.25em;
	}

	pre {
		margin: 0 0 1rem;
		background-color: #f1f1f1;
		padding: 1em;
		overflow: auto;
		-ms-overflow-style: scrollbar;
	}

	pre code {
		background-color: transparent;
		padding: 0;
		color: inherit;
		font-size: inherit;
	}

	kbd {
		display: inline-block;
		box-shadow: 0 1px 0 #e2e8f0;
		border: 1px solid #e2e8f0;
		border-radius: 0.25rem;
		background-color: #ffffff;
		padding: 0 0.25em;
		color: #333333;
		font-size: 0.875rem;
		font-family:
			SFMono-Regular,
			Menlo,
			Monaco,
			Consolas,
			Liberation Mono,
			Courier New,
			monospace;
		user-select: none;
		text-align: center;
	}

	img {
		vertical-align: middle;
		border-style: none;
	}

	figure {
		display: inline-block;
		margin: 0 0 1rem;
		max-width: 100%;
	}

	figcaption {
		color: #777779;
		font-size: 90%;
	}

	svg:not(:root) {
		overflow: hidden;
	}

	a {
		background-color: transparent;
		color: #002e6c;
		text-decoration: none;
	}

	a:hover {
		color: #002558;
		text-decoration: underline;
	}

	a:active {
		color: #001d43;
	}

	a.is-disabled {
		cursor: not-allowed;
		pointer-events: none;
		color: #cbd5e0;
	}

	fieldset:disabled a {
		pointer-events: none;
	}

	a[href^='#fn:'],
	a[href^='#fnref:'] {
		margin: 0 2px;
	}

	/* add underline in articles */
	.content a {
		text-decoration: underline;
	}

	/* end add underline in articles */
	ol,
	ul,
	dl {
		margin: 0 0 1rem;
	}

	ol,
	ul {
		padding: 0 0 0 1.5rem;
	}

	dt {
		font-weight: 700;
	}

	dd {
		margin-bottom: 1rem;
		margin-left: 0;
	}

	input,
	select,
	.nesty-input,
	.hc-multiselect-toggle,
	textarea {
		line-height: inherit;
	}

	input::-webkit-file-upload-button {
		appearance: button;
		font: inherit;
	}

	input[type='search'] {
		appearance: none;
		box-sizing: border-box;
	}

	input[type='search']::-webkit-search-cancel-button,
	input[type='search']::-webkit-search-decoration {
		appearance: none;
	}

	select::-ms-expand,
	.nesty-input::-ms-expand,
	.hc-multiselect-toggle::-ms-expand {
		display: none;
	}

	textarea {
		overflow: auto;
		resize: vertical;
	}

	[type='date'],
	[type='time'],
	[type='datetime-local'],
	[type='month'] {
		appearance: listbox;
	}

	[type='number']::-webkit-inner-spin-button,
	[type='number']::-webkit-outer-spin-button {
		height: auto;
	}

	button,
	input {
		overflow: visible;
	}

	button,
	select,
	.nesty-input,
	.hc-multiselect-toggle {
		text-transform: none;
	}

	fieldset {
		margin: 0;
		border: 0;
		padding: 0;
		min-width: 0;
	}

	legend {
		display: block;
		margin-bottom: 10px;
		padding: 0;
		width: 100%;
		max-width: 100%;
		color: inherit;
		line-height: inherit;
		white-space: normal;
	}

	table {
		margin-bottom: 16px;
		border-collapse: collapse;
		width: 100%;
	}

	thead {
		vertical-align: bottom;
	}

	th {
		text-align: inherit;
	}

	caption {
		caption-side: bottom;
		text-align: left;
	}

	.avatar {
		display: inline-block;
		position: relative;
		margin: 0 0.75rem 1rem 0;
		width: 3rem;
		min-width: 3rem;
		height: 3rem;
	}

	.avatar-img {
		border: 2px solid #ffffff;
		border-radius: 50%;
		max-width: 100%;
	}

	.avatar-sm {
		width: 2rem;
		min-width: 2rem;
		height: 2rem;
	}

	.avatar-lg {
		width: 4rem;
		min-width: 4rem;
		height: 4rem;
	}

	.avatar-group {
		padding-left: 0;
		list-style: none;
	}

	.avatar-group .avatar:not(:last-child) {
		margin-right: -1rem;
	}

	.badge {
		vertical-align: baseline;
		transition: 0.15s ease-in-out;
		border-radius: 0.25rem;
		background-color: #edf2f7;
		padding: 0.25em 0.375em;
		color: #1a202c;
		font-weight: 600;
		font-size: 0.75rem;
		line-height: 1;
		text-align: center;
		white-space: nowrap;
	}

	a.badge:focus,
	a.badge:hover {
		background-color: #cad9e7;
		color: #1a202c;
	}

	a.badge:focus,
	a.badge.is-focused {
		outline: 0;
		box-shadow: 0 0 0 0.2rem
			rgb(237 242 247 / 25%);
	}

	a.badge:focus,
	a.badge:hover {
		text-decoration: none;
	}

	.badge:empty {
		display: none;
	}

	.badge {
		position: relative;
		top: -1px;
	}

	.button,
	.pagination-next-link,
	.pagination-prev-link,
	.pagination-first-link,
	.pagination-last-link,
	.subscribe-article button,
	.subscribe-section button,
	.subscribe-topic button,
	.subscribe-organization button,
	.actions-user button,
	.subscribe-user button,
	.subscribe-link button,
	.form input[type='submit'],
	.search.has-button [type='submit'] {
		display: inline-block;
		vertical-align: middle;
		transition: 0.15s ease-in-out;
		cursor: pointer;
		border: 1px solid #e2e8f0;
		border-radius: 0.25rem;
		background-color: transparent;
		padding: 0.5em 1.25em;
		color: #333333;
		line-height: 1.5;
		user-select: none;
		text-align: center;
	}

	.button:hover,
	.pagination-next-link:hover,
	.pagination-prev-link:hover,
	.pagination-first-link:hover,
	.pagination-last-link:hover,
	.subscribe-article button:hover,
	.subscribe-section button:hover,
	.subscribe-topic button:hover,
	.subscribe-organization button:hover,
	.actions-user button:hover,
	.subscribe-user button:hover,
	.subscribe-link button:hover,
	.form input[type='submit']:hover,
	.search.has-button [type='submit']:hover {
		text-decoration: none;
	}

	.button:disabled,
	.pagination-next-link:disabled,
	.pagination-prev-link:disabled,
	.pagination-first-link:disabled,
	.pagination-last-link:disabled,
	.subscribe-article button:disabled,
	.subscribe-section button:disabled,
	.subscribe-topic button:disabled,
	.subscribe-organization button:disabled,
	.actions-user button:disabled,
	.subscribe-user button:disabled,
	.subscribe-link button:disabled,
	.form input[type='submit']:disabled,
	.search.has-button [type='submit']:disabled,
	.button.is-disabled,
	.is-disabled.pagination-next-link,
	.is-disabled.pagination-prev-link,
	.is-disabled.pagination-first-link,
	.is-disabled.pagination-last-link,
	.subscribe-article button.is-disabled,
	.subscribe-section button.is-disabled,
	.subscribe-topic button.is-disabled,
	.subscribe-organization button.is-disabled,
	.actions-user button.is-disabled,
	.subscribe-user button.is-disabled,
	.subscribe-link button.is-disabled,
	.form input.is-disabled[type='submit'],
	.search.has-button .is-disabled[type='submit'] {
		opacity: 65%;
		cursor: not-allowed;
		box-shadow: none;
	}

	a.button.is-disabled,
	a.is-disabled.pagination-next-link,
	a.is-disabled.pagination-prev-link,
	a.is-disabled.pagination-first-link,
	a.is-disabled.pagination-last-link,
	.search.has-button a.is-disabled[type='submit'],
	fieldset:disabled a.button,
	fieldset:disabled a.pagination-next-link,
	fieldset:disabled a.pagination-prev-link,
	fieldset:disabled a.pagination-first-link,
	fieldset:disabled a.pagination-last-link,
	fieldset:disabled
		.search.has-button
		a[type='submit'],
	.search.has-button
		fieldset:disabled
		a[type='submit'] {
		pointer-events: none;
	}

	.button-link,
	.subscribe-link button {
		border-color: transparent;
		color: #002e6c;
		text-decoration: none;
	}

	.button-link:hover,
	.subscribe-link button:hover {
		color: #002558;
		text-decoration: underline;
	}

	.button-link:focus,
	.subscribe-link button:focus {
		box-shadow: none;
	}

	.button-link:disabled,
	.subscribe-link button:disabled,
	.button-link.is-disabled,
	.subscribe-link button.is-disabled {
		pointer-events: none;
		color: #cbd5e0;
	}

	.button-sm,
	.subscribe-article button,
	.subscribe-section button,
	.subscribe-topic button,
	.actions-user button,
	.subscribe-user button,
	.search.has-button [type='submit'] {
		padding: 0.25em 0.75em;
		font-size: 0.875rem;
	}

	.button-lg,
	.form input[type='submit'] {
		padding: 0.5em 1.5em;
		font-size: 1.125rem;
	}

	.not-a-button {
		appearance: none;
		box-shadow: none;
		border: 0;
		background: none;
		padding: 0;
		overflow: visible;
		color: inherit;
		font: inherit;
		line-height: normal;
		user-select: none;
	}

	.button-primary,
	.actions-user button,
	.subscribe-user button,
	.form input[type='submit'],
	.search.has-button [type='submit'] {
		box-shadow:
			0 2px 0 rgb(0 0 0 / 5%),
			inset 0 1px 0 rgb(255 255 255 / 10%);
		border-color: #002e6c;
		background-color: #002e6c;
		color: #ffffff;
	}

	.button-primary:hover,
	.actions-user button:hover,
	.subscribe-user button:hover,
	.form input[type='submit']:hover,
	.search.has-button [type='submit']:hover {
		border-color: #002353;
		background-color: #002558;
		color: #ffffff;
	}

	.button-primary:focus,
	.actions-user button:focus,
	.subscribe-user button:focus,
	.form input[type='submit']:focus,
	.search.has-button [type='submit']:focus,
	.button-primary.is-focused,
	.actions-user button.is-focused,
	.subscribe-user button.is-focused,
	.form input.is-focused[type='submit'],
	.search.has-button .is-focused[type='submit'] {
		outline: 0;
		box-shadow:
			0 2px 0 rgb(0 0 0 / 5%),
			inset 0 1px 0 rgb(255 255 255 / 10%),
			0 0 0 0.2rem rgb(0 46 108 / 25%);
	}

	.button-primary:disabled,
	.actions-user button:disabled,
	.subscribe-user button:disabled,
	.form input[type='submit']:disabled,
	.search.has-button [type='submit']:disabled,
	.button-primary.is-disabled,
	.actions-user button.is-disabled,
	.subscribe-user button.is-disabled,
	.form input.is-disabled[type='submit'],
	.search.has-button .is-disabled[type='submit'] {
		border-color: #002e6c;
		background-color: #002e6c;
		color: #ffffff;
	}

	.button-primary:not(
			:disabled,
			.is-disabled
		):active,
	.actions-user
		button:not(:disabled, .is-disabled):active,
	.subscribe-user
		button:not(:disabled, .is-disabled):active,
	.form
		input[type='submit']:not(
			:disabled,
			.is-disabled
		):active,
	.search.has-button
		[type='submit']:not(
			:disabled,
			.is-disabled
		):active,
	.button-primary:not(
			:disabled,
			.is-disabled
		).is-active,
	.actions-user
		button:not(:disabled, .is-disabled).is-active,
	.subscribe-user
		button:not(:disabled, .is-disabled).is-active,
	.form
		input:not(
			:disabled,
			.is-disabled
		).is-active[type='submit'],
	.search.has-button
		:not(
			:disabled,
			.is-disabled
		).is-active[type='submit'] {
		box-shadow: inset 0 3px 5px rgb(0 0 0 / 12.5%);
		border-color: #001839;
		background-color: #001d43;
		color: #ffffff;
	}

	.button-primary:not(
			:disabled,
			.is-disabled
		):active:focus,
	.actions-user
		button:not(
			:disabled,
			.is-disabled
		):active:focus,
	.subscribe-user
		button:not(
			:disabled,
			.is-disabled
		):active:focus,
	.form
		input[type='submit']:not(
			:disabled,
			.is-disabled
		):active:focus,
	.search.has-button
		[type='submit']:not(
			:disabled,
			.is-disabled
		):active:focus,
	.button-primary:not(
			:disabled,
			.is-disabled
		).is-active:focus,
	.actions-user
		button:not(
			:disabled,
			.is-disabled
		).is-active:focus,
	.subscribe-user
		button:not(
			:disabled,
			.is-disabled
		).is-active:focus,
	.form
		input:not(
			:disabled,
			.is-disabled
		).is-active[type='submit']:focus,
	.search.has-button
		:not(
			:disabled,
			.is-disabled
		).is-active[type='submit']:focus {
		box-shadow:
			inset 0 3px 5px rgb(0 0 0 / 12.5%),
			0 0 0 0.2rem rgb(0 46 108 / 25%);
	}

	.button-translucent {
		box-shadow:
			0 2px 0 rgb(0 0 0 / 5%),
			inset 0 1px 0 rgb(255 255 255 / 10%);
		border-color: rgb(255 255 255 / 10%);
		background-color: rgb(255 255 255 / 10%);
		color: #ffffff;
	}

	.button-translucent:hover {
		border-color: rgb(255 255 255 / 12.5%);
		background-color: rgb(255 255 255 / 12.5%);
		color: #ffffff;
	}

	.button-translucent:focus {
		outline: 0;
		box-shadow:
			0 2px 0 rgb(0 0 0 / 5%),
			inset 0 1px 0 rgb(255 255 255 / 10%),
			0 0 0 0.2rem rgb(0 46 108 / 25%);
	}

	.button-translucent:not(
			:disabled,
			.is-disabled
		):active,
	.button-translucent:not(
			:disabled,
			.is-disabled
		).is-active {
		box-shadow: inset 0 3px 5px rgb(0 0 0 / 12.5%);
		border-color: rgb(255 255 255 / 15%);
		background-color: rgb(255 255 255 / 15%);
		color: #ffffff;
	}

	.button-translucent:not(
			:disabled,
			.is-disabled
		):active:focus,
	.button-translucent:not(
			:disabled,
			.is-disabled
		).is-active:focus {
		box-shadow:
			inset 0 3px 5px rgb(0 0 0 / 12.5%),
			0 0 0 0.2rem rgb(0 46 108 / 25%);
	}

	.button-outline-primary:hover,
	.pagination-next-link:hover,
	.pagination-prev-link:hover,
	.pagination-first-link:hover,
	.pagination-last-link:hover,
	.subscribe-article button:hover,
	.subscribe-section button:hover,
	.subscribe-topic button:hover,
	.subscribe-organization button:hover {
		border-color: #002e6c;
		color: #002e6c;
	}

	.button-outline-primary:focus,
	.pagination-next-link:focus,
	.pagination-prev-link:focus,
	.pagination-first-link:focus,
	.pagination-last-link:focus,
	.subscribe-article button:focus,
	.subscribe-section button:focus,
	.subscribe-topic button:focus,
	.subscribe-organization button:focus,
	.button-outline-primary.is-focused,
	.is-focused.pagination-next-link,
	.is-focused.pagination-prev-link,
	.is-focused.pagination-first-link,
	.is-focused.pagination-last-link,
	.subscribe-article button.is-focused,
	.subscribe-section button.is-focused,
	.subscribe-topic button.is-focused,
	.subscribe-organization button.is-focused {
		outline: 0;
		box-shadow:
			0 2px 0 rgb(0 0 0 / 5%),
			inset 0 1px 0 rgb(255 255 255 / 10%),
			0 0 0 0.2rem rgb(0 46 108 / 25%);
	}

	.button-outline-primary:disabled,
	.pagination-next-link:disabled,
	.pagination-prev-link:disabled,
	.pagination-first-link:disabled,
	.pagination-last-link:disabled,
	.subscribe-article button:disabled,
	.subscribe-section button:disabled,
	.subscribe-topic button:disabled,
	.subscribe-organization button:disabled,
	.button-outline-primary.is-disabled,
	.is-disabled.pagination-next-link,
	.is-disabled.pagination-prev-link,
	.is-disabled.pagination-first-link,
	.is-disabled.pagination-last-link,
	.subscribe-article button.is-disabled,
	.subscribe-section button.is-disabled,
	.subscribe-topic button.is-disabled,
	.subscribe-organization button.is-disabled {
		border-color: #e2e8f0;
		color: #333333;
	}

	.button-outline-primary:not(
			:disabled,
			.is-disabled
		):active,
	.pagination-next-link:not(
			:disabled,
			.is-disabled
		):active,
	.pagination-prev-link:not(
			:disabled,
			.is-disabled
		):active,
	.pagination-first-link:not(
			:disabled,
			.is-disabled
		):active,
	.pagination-last-link:not(
			:disabled,
			.is-disabled
		):active,
	.subscribe-article
		button:not(:disabled, .is-disabled):active,
	.subscribe-section
		button:not(:disabled, .is-disabled):active,
	.subscribe-topic
		button:not(:disabled, .is-disabled):active,
	.subscribe-organization
		button:not(:disabled, .is-disabled):active,
	.button-outline-primary:not(
			:disabled,
			.is-disabled
		).is-active,
	:not(
			:disabled,
			.is-disabled
		).is-active.pagination-next-link,
	:not(
			:disabled,
			.is-disabled
		).is-active.pagination-prev-link,
	:not(
			:disabled,
			.is-disabled
		).is-active.pagination-first-link,
	:not(
			:disabled,
			.is-disabled
		).is-active.pagination-last-link,
	.subscribe-article
		button:not(:disabled, .is-disabled).is-active,
	.subscribe-section
		button:not(:disabled, .is-disabled).is-active,
	.subscribe-topic
		button:not(:disabled, .is-disabled).is-active,
	.subscribe-organization
		button:not(
			:disabled,
			.is-disabled
		).is-active {
		border-color: #002558;
		color: #002558;
	}

	.button .badge,
	.pagination-next-link .badge,
	.pagination-prev-link .badge,
	.pagination-first-link .badge,
	.pagination-last-link .badge,
	.subscribe-article button .badge,
	.subscribe-section button .badge,
	.subscribe-topic button .badge,
	.subscribe-organization button .badge,
	.actions-user button .badge,
	.subscribe-user button .badge,
	.subscribe-link button .badge,
	.form input[type='submit'] .badge,
	.search.has-button [type='submit'] .badge {
		position: relative;
		top: -1px;
	}

	.button-group,
	.button-group-vertical {
		display: inline-flex;
		position: relative;
		vertical-align: middle;
	}

	.button-group > .button,
	.button-group > .pagination-next-link,
	.button-group > .pagination-prev-link,
	.button-group > .pagination-first-link,
	.button-group > .pagination-last-link,
	.subscribe-article .button-group > button,
	.subscribe-section .button-group > button,
	.subscribe-topic .button-group > button,
	.subscribe-organization .button-group > button,
	.actions-user .button-group > button,
	.subscribe-user .button-group > button,
	.subscribe-link .button-group > button,
	.form .button-group > input[type='submit'],
	.search.has-button
		.button-group
		> [type='submit'],
	.button-group-vertical > .button,
	.button-group-vertical > .pagination-next-link,
	.button-group-vertical > .pagination-prev-link,
	.button-group-vertical > .pagination-first-link,
	.button-group-vertical > .pagination-last-link,
	.subscribe-article
		.button-group-vertical
		> button,
	.subscribe-section
		.button-group-vertical
		> button,
	.subscribe-topic
		.button-group-vertical
		> button,
	.subscribe-organization
		.button-group-vertical
		> button,
	.actions-user .button-group-vertical > button,
	.subscribe-user .button-group-vertical > button,
	.subscribe-link .button-group-vertical > button,
	.form
		.button-group-vertical
		> input[type='submit'],
	.search.has-button
		.button-group-vertical
		> [type='submit'] {
		position: relative;
		flex: 1 1 auto;
	}

	.button-group > .button:hover,
	.button-group > .pagination-next-link:hover,
	.button-group > .pagination-prev-link:hover,
	.button-group > .pagination-first-link:hover,
	.button-group > .pagination-last-link:hover,
	.subscribe-article .button-group > button:hover,
	.subscribe-section .button-group > button:hover,
	.subscribe-topic .button-group > button:hover,
	.subscribe-organization
		.button-group
		> button:hover,
	.actions-user .button-group > button:hover,
	.subscribe-user .button-group > button:hover,
	.subscribe-link .button-group > button:hover,
	.form
		.button-group
		> input[type='submit']:hover,
	.search.has-button
		.button-group
		> [type='submit']:hover,
	.button-group-vertical > .button:hover,
	.button-group-vertical
		> .pagination-next-link:hover,
	.button-group-vertical
		> .pagination-prev-link:hover,
	.button-group-vertical
		> .pagination-first-link:hover,
	.button-group-vertical
		> .pagination-last-link:hover,
	.subscribe-article
		.button-group-vertical
		> button:hover,
	.subscribe-section
		.button-group-vertical
		> button:hover,
	.subscribe-topic
		.button-group-vertical
		> button:hover,
	.subscribe-organization
		.button-group-vertical
		> button:hover,
	.actions-user
		.button-group-vertical
		> button:hover,
	.subscribe-user
		.button-group-vertical
		> button:hover,
	.subscribe-link
		.button-group-vertical
		> button:hover,
	.form
		.button-group-vertical
		> input[type='submit']:hover,
	.search.has-button
		.button-group-vertical
		> [type='submit']:hover {
		z-index: 1;
	}

	.button-group > .button:focus,
	.button-group > .pagination-next-link:focus,
	.button-group > .pagination-prev-link:focus,
	.button-group > .pagination-first-link:focus,
	.button-group > .pagination-last-link:focus,
	.subscribe-article .button-group > button:focus,
	.subscribe-section .button-group > button:focus,
	.subscribe-topic .button-group > button:focus,
	.subscribe-organization
		.button-group
		> button:focus,
	.actions-user .button-group > button:focus,
	.subscribe-user .button-group > button:focus,
	.subscribe-link .button-group > button:focus,
	.form
		.button-group
		> input[type='submit']:focus,
	.search.has-button
		.button-group
		> [type='submit']:focus,
	.button-group > .button:active,
	.button-group > .pagination-next-link:active,
	.button-group > .pagination-prev-link:active,
	.button-group > .pagination-first-link:active,
	.button-group > .pagination-last-link:active,
	.subscribe-article
		.button-group
		> button:active,
	.subscribe-section
		.button-group
		> button:active,
	.subscribe-topic .button-group > button:active,
	.subscribe-organization
		.button-group
		> button:active,
	.actions-user .button-group > button:active,
	.subscribe-user .button-group > button:active,
	.subscribe-link .button-group > button:active,
	.form
		.button-group
		> input[type='submit']:active,
	.search.has-button
		.button-group
		> [type='submit']:active,
	.button-group > .button.is-active,
	.button-group > .is-active.pagination-next-link,
	.button-group > .is-active.pagination-prev-link,
	.button-group
		> .is-active.pagination-first-link,
	.button-group > .is-active.pagination-last-link,
	.subscribe-article
		.button-group
		> button.is-active,
	.subscribe-section
		.button-group
		> button.is-active,
	.subscribe-topic
		.button-group
		> button.is-active,
	.subscribe-organization
		.button-group
		> button.is-active,
	.actions-user .button-group > button.is-active,
	.subscribe-user
		.button-group
		> button.is-active,
	.subscribe-link
		.button-group
		> button.is-active,
	.form
		.button-group
		> input.is-active[type='submit'],
	.search.has-button
		.button-group
		> .is-active[type='submit'],
	.button-group-vertical > .button:focus,
	.button-group-vertical
		> .pagination-next-link:focus,
	.button-group-vertical
		> .pagination-prev-link:focus,
	.button-group-vertical
		> .pagination-first-link:focus,
	.button-group-vertical
		> .pagination-last-link:focus,
	.subscribe-article
		.button-group-vertical
		> button:focus,
	.subscribe-section
		.button-group-vertical
		> button:focus,
	.subscribe-topic
		.button-group-vertical
		> button:focus,
	.subscribe-organization
		.button-group-vertical
		> button:focus,
	.actions-user
		.button-group-vertical
		> button:focus,
	.subscribe-user
		.button-group-vertical
		> button:focus,
	.subscribe-link
		.button-group-vertical
		> button:focus,
	.form
		.button-group-vertical
		> input[type='submit']:focus,
	.search.has-button
		.button-group-vertical
		> [type='submit']:focus,
	.button-group-vertical > .button:active,
	.button-group-vertical
		> .pagination-next-link:active,
	.button-group-vertical
		> .pagination-prev-link:active,
	.button-group-vertical
		> .pagination-first-link:active,
	.button-group-vertical
		> .pagination-last-link:active,
	.subscribe-article
		.button-group-vertical
		> button:active,
	.subscribe-section
		.button-group-vertical
		> button:active,
	.subscribe-topic
		.button-group-vertical
		> button:active,
	.subscribe-organization
		.button-group-vertical
		> button:active,
	.actions-user
		.button-group-vertical
		> button:active,
	.subscribe-user
		.button-group-vertical
		> button:active,
	.subscribe-link
		.button-group-vertical
		> button:active,
	.form
		.button-group-vertical
		> input[type='submit']:active,
	.search.has-button
		.button-group-vertical
		> [type='submit']:active,
	.button-group-vertical > .button.is-active,
	.button-group-vertical
		> .is-active.pagination-next-link,
	.button-group-vertical
		> .is-active.pagination-prev-link,
	.button-group-vertical
		> .is-active.pagination-first-link,
	.button-group-vertical
		> .is-active.pagination-last-link,
	.subscribe-article
		.button-group-vertical
		> button.is-active,
	.subscribe-section
		.button-group-vertical
		> button.is-active,
	.subscribe-topic
		.button-group-vertical
		> button.is-active,
	.subscribe-organization
		.button-group-vertical
		> button.is-active,
	.actions-user
		.button-group-vertical
		> button.is-active,
	.subscribe-user
		.button-group-vertical
		> button.is-active,
	.subscribe-link
		.button-group-vertical
		> button.is-active,
	.form
		.button-group-vertical
		> input.is-active[type='submit'],
	.search.has-button
		.button-group-vertical
		> .is-active[type='submit'] {
		z-index: 1;
	}

	.button-group > .button:not(:first-child),
	.button-group
		> .pagination-next-link:not(:first-child),
	.button-group
		> .pagination-prev-link:not(:first-child),
	.button-group
		> .pagination-first-link:not(:first-child),
	.button-group
		> .pagination-last-link:not(:first-child),
	.subscribe-article
		.button-group
		> button:not(:first-child),
	.subscribe-section
		.button-group
		> button:not(:first-child),
	.subscribe-topic
		.button-group
		> button:not(:first-child),
	.subscribe-organization
		.button-group
		> button:not(:first-child),
	.actions-user
		.button-group
		> button:not(:first-child),
	.subscribe-user
		.button-group
		> button:not(:first-child),
	.subscribe-link
		.button-group
		> button:not(:first-child),
	.form
		.button-group
		> input[type='submit']:not(:first-child),
	.search.has-button
		.button-group
		> [type='submit']:not(:first-child),
	.button-group
		> .button-group:not(:first-child) {
		margin-left: -1px;
	}

	.button-group > .button:not(:last-child),
	.button-group
		> .pagination-next-link:not(:last-child),
	.button-group
		> .pagination-prev-link:not(:last-child),
	.button-group
		> .pagination-first-link:not(:last-child),
	.button-group
		> .pagination-last-link:not(:last-child),
	.subscribe-article
		.button-group
		> button:not(:last-child),
	.subscribe-section
		.button-group
		> button:not(:last-child),
	.subscribe-topic
		.button-group
		> button:not(:last-child),
	.subscribe-organization
		.button-group
		> button:not(:last-child),
	.actions-user
		.button-group
		> button:not(:last-child),
	.subscribe-user
		.button-group
		> button:not(:last-child),
	.subscribe-link
		.button-group
		> button:not(:last-child),
	.form
		.button-group
		> input[type='submit']:not(:last-child),
	.search.has-button
		.button-group
		> [type='submit']:not(:last-child),
	.button-group
		> .button-group:not(:last-child)
		> .button,
	.button-group
		> .button-group:not(:last-child)
		> .pagination-next-link,
	.button-group
		> .button-group:not(:last-child)
		> .pagination-prev-link,
	.button-group
		> .button-group:not(:last-child)
		> .pagination-first-link,
	.button-group
		> .button-group:not(:last-child)
		> .pagination-last-link,
	.subscribe-article
		.button-group
		> .button-group:not(:last-child)
		> button,
	.subscribe-section
		.button-group
		> .button-group:not(:last-child)
		> button,
	.subscribe-topic
		.button-group
		> .button-group:not(:last-child)
		> button,
	.subscribe-organization
		.button-group
		> .button-group:not(:last-child)
		> button,
	.actions-user
		.button-group
		> .button-group:not(:last-child)
		> button,
	.subscribe-user
		.button-group
		> .button-group:not(:last-child)
		> button,
	.subscribe-link
		.button-group
		> .button-group:not(:last-child)
		> button,
	.form
		.button-group
		> .button-group:not(:last-child)
		> input[type='submit'],
	.search.has-button
		.button-group
		> .button-group:not(:last-child)
		> [type='submit'] {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.button-group > .button:not(:first-child),
	.button-group
		> .pagination-next-link:not(:first-child),
	.button-group
		> .pagination-prev-link:not(:first-child),
	.button-group
		> .pagination-first-link:not(:first-child),
	.button-group
		> .pagination-last-link:not(:first-child),
	.subscribe-article
		.button-group
		> button:not(:first-child),
	.subscribe-section
		.button-group
		> button:not(:first-child),
	.subscribe-topic
		.button-group
		> button:not(:first-child),
	.subscribe-organization
		.button-group
		> button:not(:first-child),
	.actions-user
		.button-group
		> button:not(:first-child),
	.subscribe-user
		.button-group
		> button:not(:first-child),
	.subscribe-link
		.button-group
		> button:not(:first-child),
	.form
		.button-group
		> input[type='submit']:not(:first-child),
	.search.has-button
		.button-group
		> [type='submit']:not(:first-child),
	.button-group
		> .button-group:not(:first-child)
		> .button,
	.button-group
		> .button-group:not(:first-child)
		> .pagination-next-link,
	.button-group
		> .button-group:not(:first-child)
		> .pagination-prev-link,
	.button-group
		> .button-group:not(:first-child)
		> .pagination-first-link,
	.button-group
		> .button-group:not(:first-child)
		> .pagination-last-link,
	.subscribe-article
		.button-group
		> .button-group:not(:first-child)
		> button,
	.subscribe-section
		.button-group
		> .button-group:not(:first-child)
		> button,
	.subscribe-topic
		.button-group
		> .button-group:not(:first-child)
		> button,
	.subscribe-organization
		.button-group
		> .button-group:not(:first-child)
		> button,
	.actions-user
		.button-group
		> .button-group:not(:first-child)
		> button,
	.subscribe-user
		.button-group
		> .button-group:not(:first-child)
		> button,
	.subscribe-link
		.button-group
		> .button-group:not(:first-child)
		> button,
	.form
		.button-group
		> .button-group:not(:first-child)
		> input[type='submit'],
	.search.has-button
		.button-group
		> .button-group:not(:first-child)
		> [type='submit'] {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.button-group-sm > .button,
	.button-group-sm > .pagination-next-link,
	.button-group-sm > .pagination-prev-link,
	.button-group-sm > .pagination-first-link,
	.button-group-sm > .pagination-last-link,
	.subscribe-article .button-group-sm > button,
	.subscribe-section .button-group-sm > button,
	.subscribe-topic .button-group-sm > button,
	.subscribe-organization
		.button-group-sm
		> button,
	.actions-user .button-group-sm > button,
	.subscribe-user .button-group-sm > button,
	.subscribe-link .button-group-sm > button,
	.form .button-group-sm > input[type='submit'],
	.search.has-button
		.button-group-sm
		> [type='submit'] {
		padding: 0.25em 0.75em;
		font-size: 0.875rem;
	}

	.button-group-lg > .button,
	.button-group-lg > .pagination-next-link,
	.button-group-lg > .pagination-prev-link,
	.button-group-lg > .pagination-first-link,
	.button-group-lg > .pagination-last-link,
	.subscribe-article .button-group-lg > button,
	.subscribe-section .button-group-lg > button,
	.subscribe-topic .button-group-lg > button,
	.subscribe-organization
		.button-group-lg
		> button,
	.actions-user .button-group-lg > button,
	.subscribe-user .button-group-lg > button,
	.subscribe-link .button-group-lg > button,
	.form .button-group-lg > input[type='submit'],
	.search.has-button
		.button-group-lg
		> [type='submit'] {
		padding: 0.5em 1.5em;
		font-size: 1.125rem;
	}

	.button-group-vertical {
		flex-direction: column;
		place-content: flex-start center;
	}

	.button-group-vertical > .button,
	.button-group-vertical > .pagination-next-link,
	.button-group-vertical > .pagination-prev-link,
	.button-group-vertical > .pagination-first-link,
	.button-group-vertical > .pagination-last-link,
	.subscribe-article
		.button-group-vertical
		> button,
	.subscribe-section
		.button-group-vertical
		> button,
	.subscribe-topic
		.button-group-vertical
		> button,
	.subscribe-organization
		.button-group-vertical
		> button,
	.actions-user .button-group-vertical > button,
	.subscribe-user .button-group-vertical > button,
	.subscribe-link .button-group-vertical > button,
	.form
		.button-group-vertical
		> input[type='submit'],
	.search.has-button
		.button-group-vertical
		> [type='submit'],
	.button-group-vertical > .button-group {
		width: 100%;
	}

	.button-group-vertical
		> .button:not(:first-child),
	.button-group-vertical
		> .pagination-next-link:not(:first-child),
	.button-group-vertical
		> .pagination-prev-link:not(:first-child),
	.button-group-vertical
		> .pagination-first-link:not(:first-child),
	.button-group-vertical
		> .pagination-last-link:not(:first-child),
	.subscribe-article
		.button-group-vertical
		> button:not(:first-child),
	.subscribe-section
		.button-group-vertical
		> button:not(:first-child),
	.subscribe-topic
		.button-group-vertical
		> button:not(:first-child),
	.subscribe-organization
		.button-group-vertical
		> button:not(:first-child),
	.actions-user
		.button-group-vertical
		> button:not(:first-child),
	.subscribe-user
		.button-group-vertical
		> button:not(:first-child),
	.subscribe-link
		.button-group-vertical
		> button:not(:first-child),
	.form
		.button-group-vertical
		> input[type='submit']:not(:first-child),
	.search.has-button
		.button-group-vertical
		> [type='submit']:not(:first-child),
	.button-group-vertical
		> .button-group:not(:first-child) {
		margin-top: -1px;
	}

	.button-group-vertical
		> .button:not(:last-child),
	.button-group-vertical
		> .pagination-next-link:not(:last-child),
	.button-group-vertical
		> .pagination-prev-link:not(:last-child),
	.button-group-vertical
		> .pagination-first-link:not(:last-child),
	.button-group-vertical
		> .pagination-last-link:not(:last-child),
	.subscribe-article
		.button-group-vertical
		> button:not(:last-child),
	.subscribe-section
		.button-group-vertical
		> button:not(:last-child),
	.subscribe-topic
		.button-group-vertical
		> button:not(:last-child),
	.subscribe-organization
		.button-group-vertical
		> button:not(:last-child),
	.actions-user
		.button-group-vertical
		> button:not(:last-child),
	.subscribe-user
		.button-group-vertical
		> button:not(:last-child),
	.subscribe-link
		.button-group-vertical
		> button:not(:last-child),
	.form
		.button-group-vertical
		> input[type='submit']:not(:last-child),
	.search.has-button
		.button-group-vertical
		> [type='submit']:not(:last-child),
	.button-group-vertical
		> .button-group:not(:last-child)
		> .button,
	.button-group-vertical
		> .button-group:not(:last-child)
		> .pagination-next-link,
	.button-group-vertical
		> .button-group:not(:last-child)
		> .pagination-prev-link,
	.button-group-vertical
		> .button-group:not(:last-child)
		> .pagination-first-link,
	.button-group-vertical
		> .button-group:not(:last-child)
		> .pagination-last-link,
	.subscribe-article
		.button-group-vertical
		> .button-group:not(:last-child)
		> button,
	.subscribe-section
		.button-group-vertical
		> .button-group:not(:last-child)
		> button,
	.subscribe-topic
		.button-group-vertical
		> .button-group:not(:last-child)
		> button,
	.subscribe-organization
		.button-group-vertical
		> .button-group:not(:last-child)
		> button,
	.actions-user
		.button-group-vertical
		> .button-group:not(:last-child)
		> button,
	.subscribe-user
		.button-group-vertical
		> .button-group:not(:last-child)
		> button,
	.subscribe-link
		.button-group-vertical
		> .button-group:not(:last-child)
		> button,
	.form
		.button-group-vertical
		> .button-group:not(:last-child)
		> input[type='submit'],
	.search.has-button
		.button-group-vertical
		> .button-group:not(:last-child)
		> [type='submit'] {
		border-bottom-right-radius: 0;
		border-bottom-left-radius: 0;
	}

	.button-group-vertical
		> .button:not(:first-child),
	.button-group-vertical
		> .pagination-next-link:not(:first-child),
	.button-group-vertical
		> .pagination-prev-link:not(:first-child),
	.button-group-vertical
		> .pagination-first-link:not(:first-child),
	.button-group-vertical
		> .pagination-last-link:not(:first-child),
	.subscribe-article
		.button-group-vertical
		> button:not(:first-child),
	.subscribe-section
		.button-group-vertical
		> button:not(:first-child),
	.subscribe-topic
		.button-group-vertical
		> button:not(:first-child),
	.subscribe-organization
		.button-group-vertical
		> button:not(:first-child),
	.actions-user
		.button-group-vertical
		> button:not(:first-child),
	.subscribe-user
		.button-group-vertical
		> button:not(:first-child),
	.subscribe-link
		.button-group-vertical
		> button:not(:first-child),
	.form
		.button-group-vertical
		> input[type='submit']:not(:first-child),
	.search.has-button
		.button-group-vertical
		> [type='submit']:not(:first-child),
	.button-group-vertical
		> .button-group:not(:first-child)
		> .button,
	.button-group-vertical
		> .button-group:not(:first-child)
		> .pagination-next-link,
	.button-group-vertical
		> .button-group:not(:first-child)
		> .pagination-prev-link,
	.button-group-vertical
		> .button-group:not(:first-child)
		> .pagination-first-link,
	.button-group-vertical
		> .button-group:not(:first-child)
		> .pagination-last-link,
	.subscribe-article
		.button-group-vertical
		> .button-group:not(:first-child)
		> button,
	.subscribe-section
		.button-group-vertical
		> .button-group:not(:first-child)
		> button,
	.subscribe-topic
		.button-group-vertical
		> .button-group:not(:first-child)
		> button,
	.subscribe-organization
		.button-group-vertical
		> .button-group:not(:first-child)
		> button,
	.actions-user
		.button-group-vertical
		> .button-group:not(:first-child)
		> button,
	.subscribe-user
		.button-group-vertical
		> .button-group:not(:first-child)
		> button,
	.subscribe-link
		.button-group-vertical
		> .button-group:not(:first-child)
		> button,
	.form
		.button-group-vertical
		> .button-group:not(:first-child)
		> input[type='submit'],
	.search.has-button
		.button-group-vertical
		> .button-group:not(:first-child)
		> [type='submit'] {
		border-top-right-radius: 0;
		border-top-left-radius: 0;
	}

	.form-field {
		margin-bottom: 1.5rem;
	}

	.form-field > label {
		display: block;
		margin: 0 0 0.5rem;
		font-size: 0.9375rem;
	}

	.form-field > p {
		margin: 0.25rem 0 0;
		color: #777779;
		font-size: 0.875rem;
	}

	.form-field select,
	.form-field .nesty-input,
	.form-field .hc-multiselect-toggle,
	.form-field > input,
	.form-field > textarea {
		transition:
			color 0.15s ease-in-out,
			background-color 0.15s ease-in-out,
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
		border: 1px solid #e2e8f0;
		border-radius: 0.25rem;
		background-color: #ffffff;
		padding: 0.5em 0.75em;
		width: 100%;
		color: inherit;
	}

	.form-field select:hover,
	.form-field .nesty-input:hover,
	.form-field .hc-multiselect-toggle:hover,
	.form-field > input:hover,
	.form-field > textarea:hover {
		border-color: #777779;
	}

	.form-field select:focus,
	.form-field .nesty-input:focus,
	.form-field .hc-multiselect-toggle:focus,
	.form-field > input:focus,
	.form-field > textarea:focus {
		outline: 0;
		box-shadow: 0 0 0 0.2rem rgb(0 46 108 / 25%);
		border-color: #002e6c;
	}

	.form-field select:disabled,
	.form-field .nesty-input:disabled,
	.form-field .hc-multiselect-toggle:disabled,
	.form-field select.is-disabled,
	.form-field .is-disabled.nesty-input,
	.form-field .is-disabled.hc-multiselect-toggle,
	.form-field > input:disabled,
	.form-field > input.is-disabled,
	.form-field > textarea:disabled,
	.form-field > textarea.is-disabled {
		cursor: not-allowed;
		border-color: #e2e8f0;
		background-color: #e2e8f0;
	}

	.form-field select,
	.form-field .nesty-input,
	.form-field .hc-multiselect-toggle {
		appearance: none;
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 10 6' width='10' height='6'%3E%3Cpath fill='%232D3748' d='M0 0h10L5 6 0 0z'/%3E%3C/svg%3E")
			no-repeat #ffffff;
		background-position: right 0.75em center;
		padding-right: 2em;
	}

	.form-field > input::input-placeholder,
	.form-field > textarea::input-placeholder {
		color: #777779;
	}

	.form-field > input::placeholder,
	.form-field > textarea::placeholder {
		color: #777779;
	}

	.form-field > input:placeholder,
	.form-field > textarea:placeholder {
		color: #777779;
	}

	.form-field > input:input-placeholder,
	.form-field > textarea:input-placeholder {
		color: #777779;
	}

	.form-field > textarea {
		min-height: 8em;
	}

	.form-field.required > label::after {
		margin-left: 2px;
		content: '*';
		color: #fc8181;
	}

	.form-field .optional {
		margin-left: 2px;
	}

	.search {
		position: relative;
	}

	.search-icon {
		display: inline-block;
		position: absolute;
		top: 50%;
		bottom: -0.125em;
		transform: translateY(-50%);
		margin-right: 1em;
		margin-left: 1em;
		width: 1em;
		line-height: 1;
	}

	.search .form-field:hover {
		border-color: #777779;
	}

	.search .form-field.is-focused {
		box-shadow: 0 0 0 0.2rem rgb(0 46 108 / 25%);
		border-color: #002e6c;
	}

	.search .form-field.is-focused + .search-icon {
		color: #002e6c;
	}

	.search [type='search'] {
		appearance: none;
		border: none;
		background-color: transparent;
		padding-left: 2.5em;
	}

	[dir='rtl'] .search [type='search'] {
		padding-right: 2.5em;
		padding-left: 0.75em;
	}

	.search [type='search']:focus {
		box-shadow: none;
	}

	.search-translucent .form-field {
		border-color: rgb(255 255 255 / 10%);
		background-color: rgb(255 255 255 / 10%);
	}

	.search-translucent .form-field + .search-icon {
		color: #ffffff;
	}

	.search-translucent .form-field:hover {
		border-color: rgb(255 255 255 / 15%);
		background-color: rgb(255 255 255 / 15%);
	}

	.search-translucent .form-field.is-focused {
		background-color: #ffffff;
	}

	.search-translucent
		.form-field:not(.is-focused) {
		color: #ffffff;
	}

	.search-translucent
		.form-field:not(.is-focused)
		> input[type='search']::input-placeholder {
		color: #f1f1f1;
	}

	.search-translucent
		.form-field:not(.is-focused)
		> input[type='search']::placeholder {
		color: #f1f1f1;
	}

	.search-translucent
		.form-field:not(.is-focused)
		> input[type='search']:placeholder {
		color: #f1f1f1;
	}

	.search-translucent
		.form-field:not(.is-focused)
		> input[type='search']:input-placeholder {
		color: #f1f1f1;
	}

	.boolean input {
		appearance: none;
		margin-right: 0.5em;
		padding: 0.5rem;
		width: auto;
	}

	.boolean input:checked {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%23fff' d='M6.564.75l-3.59 3.612-1.538-1.55L0 4.26 2.974 7.25 8 2.193z'/%3e%3c/svg%3e");
	}

	.boolean input:indeterminate {
		background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 4 4'%3e%3cpath stroke='%23fff' d='M0 2h4'/%3e%3c/svg%3e");
	}

	.boolean input:checked,
	.boolean input:indeterminate {
		border-color: #002e6c;
		background-position: center center;
		background-size: 0.75em;
		background-repeat: no-repeat;
		background-color: #002e6c;
	}

	.boolean input:active {
		filter: brightness(90%);
	}

	.boolean input:focus {
		outline: 0;
		border-color: #002e6c;
	}

	.nesty-input,
	.hc-multiselect-toggle {
		height: auto;
	}

	.nesty-input:hover,
	.hc-multiselect-toggle:hover {
		color: inherit;
		text-decoration: none;
	}

	.nesty-input::after,
	.hc-multiselect-toggle::after {
		content: '';
	}

	.hc-multiselect-toggle li {
		margin-top: 0;
		margin-bottom: 0;
		padding: 4px 6px;
		font-size: 0.875rem;
		line-height: 1;
	}

	.upload-dropzone {
		transition:
			color 0.15s ease-in-out,
			background-color 0.15s ease-in-out,
			border-color 0.15s ease-in-out,
			box-shadow 0.15s ease-in-out;
		border: 1px solid #e2e8f0;
		border-radius: 0.25rem;
		background-color: #ffffff;
		width: 100%;
		color: inherit;
	}

	.upload-dropzone span {
		color: inherit;
	}

	.upload-dropzone:hover {
		border-color: #777779;
	}

	.upload-dropzone[data-hc-focus='true'] {
		outline: 0;
		box-shadow: 0 0 0 0.2rem rgb(0 46 108 / 25%);
		border-color: #002e6c;
	}

	.svg-icon {
		box-sizing: content-box;
		height: 1em;
	}

	.svg-icon {
		display: inline-block;
		position: relative;
		bottom: -0.125em;
		flex-shrink: 0;
		width: 1em;
		line-height: 1;
	}

	.img-fluid {
		max-width: 100%;
		height: auto;
	}

	.content img {
		max-width: 100%;
		height: auto;
	}

	.link-plain,
	.link-implied {
		text-decoration: none;
	}

	.link-plain:hover,
	.link-implied:hover {
		color: inherit;
		text-decoration: none;
	}

	.link-stretched::after {
		position: absolute;
		z-index: 1;
		inset: 0;
		background-color: rgb(0 0 0 / 0%);
		pointer-events: auto;
		content: '';
	}

	.link-anchor {
		opacity: 0%;
		margin-right: 6px;
		margin-left: 6px;
	}

	:hover > .link-anchor,
	.link-anchor:focus {
		opacity: 100%;
	}

	/*.link-anchor::before {*/
	/*  content: "#";*/
	/*}*/
	.link-anchor:hover,
	.link-anchor:focus,
	.link-anchor:active {
		text-decoration: none;
	}

	.link {
		color: currentcolor;
	}

	.link::after {
		opacity: 20%;
		background-color: currentcolor;
	}

	.link:focus,
	.link:hover {
		color: #002e6c;
	}

	.link:focus::after,
	.link:hover::after {
		opacity: 100%;
		background-color: #002e6c;
	}

	.link-article {
		color: #002e6c;
	}

	.link-article::after {
		opacity: 20%;
		background-color: #002e6c;
	}

	.link-article:focus::after,
	.link-article:hover::after {
		opacity: 100%;
	}

	.link-implied {
		color: currentcolor;
	}

	.link-implied::after {
		opacity: 0%;
		background-color: currentcolor;
	}

	.link-implied:focus::after,
	.link-implied:hover::after {
		opacity: 20%;
	}

	.link,
	.link-article,
	.link-implied {
		position: relative;
	}

	.link::after,
	.link-article::after,
	.link-implied::after {
		position: absolute;
		right: 0;
		bottom: -0.125em;
		left: 0;
		height: 0.125em;
		content: '';
	}

	.link:focus,
	.link:hover,
	.link-article:focus,
	.link-article:hover,
	.link-implied:focus,
	.link-implied:hover {
		text-decoration: none;
	}

	.link:active::after,
	.link-article:active::after,
	.link-implied:active::after {
		opacity: 100%;
	}

	.list-unstyled {
		padding-left: 0;
		list-style: none;
	}

	.list-bordered > :not(:last-child) {
		border-bottom: 1px solid #e2e8f0;
	}

	.list-item {
		margin: 0.5rem 0;
	}

	.list-divider {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 1rem;
		padding-left: 0;
		list-style: none;
	}

	.list-divider > * + * {
		padding-left: 0.5rem;
	}

	.list-divider > * + *::before {
		display: inline-block;
		padding-right: 0.5rem;
		content: '·';
	}

	.list-divider > * + *::before {
		color: #777779;
	}

	.list-divider > * + *[data-divider]::before {
		content: attr(data-divider);
	}

	.list-group {
		display: flex;
		flex-direction: column;
		margin-bottom: 0;
		padding-left: 0;
	}

	.list-group-item-action {
		width: 100%;
		color: #333333;
		text-align: inherit;
	}

	.list-group-item-action:focus,
	.list-group-item-action:hover {
		z-index: 1;
		background-color: #f1f1f1;
		color: #333333;
		text-decoration: none;
	}

	.list-group-item-action:active {
		background-color: #f1f1f1;
		color: #333333;
	}

	.list-group-item {
		display: block;
		position: relative;
		margin-bottom: -1px;
		border: 1px solid #e2e8f0;
		background-color: #ffffff;
		padding: 0.5em 1em;
	}

	.list-group-item:first-child {
		border-top-right-radius: 0.25rem;
		border-top-left-radius: 0.25rem;
	}

	.list-group-item:last-child {
		margin-bottom: 0;
		border-bottom-right-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
	}

	.list-group-item:disabled,
	.list-group-item.is-disabled {
		background-color: #ffffff;
		pointer-events: none;
		color: #777779;
	}

	.list-group-item.is-active {
		z-index: 2;
		border-color: #002e6c;
		background-color: #002e6c;
		color: #ffffff;
	}

	.list-group-horizontal {
		flex-direction: row;
	}

	.list-group-horizontal .list-group-item {
		margin-right: -1px;
		margin-bottom: 0;
	}

	.list-group-horizontal
		.list-group-item:first-child {
		border-top-right-radius: 0;
		border-top-left-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
	}

	.list-group-horizontal
		.list-group-item:last-child {
		margin-right: 0;
		border-top-right-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
		border-bottom-left-radius: 0;
	}

	@media (width >= 576px) {
		.sm\\:list-group-horizontal {
			flex-direction: row;
		}

		.sm\\:list-group-horizontal .list-group-item {
			margin-right: -1px;
			margin-bottom: 0;
		}

		.sm\\:list-group-horizontal
			.list-group-item:first-child {
			border-top-right-radius: 0;
			border-top-left-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.sm\\:list-group-horizontal
			.list-group-item:last-child {
			margin-right: 0;
			border-top-right-radius: 0.25rem;
			border-bottom-right-radius: 0.25rem;
			border-bottom-left-radius: 0;
		}
	}

	@media (width >= 768px) {
		.md\\:list-group-horizontal {
			flex-direction: row;
		}

		.md\\:list-group-horizontal .list-group-item {
			margin-right: -1px;
			margin-bottom: 0;
		}

		.md\\:list-group-horizontal
			.list-group-item:first-child {
			border-top-right-radius: 0;
			border-top-left-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.md\\:list-group-horizontal
			.list-group-item:last-child {
			margin-right: 0;
			border-top-right-radius: 0.25rem;
			border-bottom-right-radius: 0.25rem;
			border-bottom-left-radius: 0;
		}
	}

	@media (width >= 992px) {
		.lg\\:list-group-horizontal {
			flex-direction: row;
		}

		.lg\\:list-group-horizontal .list-group-item {
			margin-right: -1px;
			margin-bottom: 0;
		}

		.lg\\:list-group-horizontal
			.list-group-item:first-child {
			border-top-right-radius: 0;
			border-top-left-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.lg\\:list-group-horizontal
			.list-group-item:last-child {
			margin-right: 0;
			border-top-right-radius: 0.25rem;
			border-bottom-right-radius: 0.25rem;
			border-bottom-left-radius: 0;
		}
	}

	@media (width >= 1200px) {
		.xl\\:list-group-horizontal {
			flex-direction: row;
		}

		.xl\\:list-group-horizontal .list-group-item {
			margin-right: -1px;
			margin-bottom: 0;
		}

		.xl\\:list-group-horizontal
			.list-group-item:first-child {
			border-top-right-radius: 0;
			border-top-left-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.xl\\:list-group-horizontal
			.list-group-item:last-child {
			margin-right: 0;
			border-top-right-radius: 0.25rem;
			border-bottom-right-radius: 0.25rem;
			border-bottom-left-radius: 0;
		}
	}

	.list-group-flush .list-group-item {
		border-right: 0;
		border-left: 0;
		border-radius: 0;
	}

	.list-group-flush .list-group-item:first-child {
		border-top: 0;
	}

	.list-group-flush .list-group-item:last-child {
		margin-bottom: -1px;
	}

	.list-group-flush:last-child
		.list-group-item:last-child {
		margin-bottom: 0;
		border-bottom: 0;
	}

	.table,
	.content table:not([class*='table']) {
		color: #333333;
	}

	.table th,
	.content table:not([class*='table']) th,
	.table td,
	.content table:not([class*='table']) td {
		vertical-align: top;
		padding: 0.75rem;
	}

	.table thead th,
	.content table:not([class*='table']) thead th {
		vertical-align: bottom;
		border-bottom: 1px solid #e2e8f0;
		font-weight: 500;
		font-size: 0.9375rem;
	}

	.table tbody,
	.content table:not([class*='table']) tbody {
		font-size: 0.9375rem;
	}

	.table tr:not(:last-child),
	.content
		table:not([class*='table'])
		tr:not(:last-child) {
		border-bottom: 1px solid #e2e8f0;
	}

	.table-sm th,
	.table-sm td {
		padding: 0.375rem;
	}

	.table-flush th:first-child,
	.table-flush td:first-child {
		padding-left: 0;
	}

	.table-flush th:last-child,
	.table-flush td:last-child {
		padding-right: 0;
	}

	.table-bordered {
		border: 1px solid #e2e8f0;
	}

	.table-bordered th,
	.table-bordered td {
		border: 1px solid #e2e8f0;
	}

	.table-bordered th:first-child,
	.table-bordered td:first-child {
		padding-left: 0.75rem;
	}

	.table-bordered th:last-child,
	.table-bordered td:last-child {
		padding-right: 0.75rem;
	}

	.table-bordered thead th,
	.table-bordered thead td {
		border-bottom-width: 2px;
	}

	.table-borderless th,
	.table-borderless td,
	.table-borderless thead th,
	.table-borderless tbody + tbody {
		border: 0;
	}

	.table-borderless tr:not(:last-child) {
		border-bottom: none;
	}

	.table-flush th:first-child,
	.table-flush td:first-child {
		padding-left: 0;
	}

	.table-flush th:last-child,
	.table-flush td:last-child {
		padding-right: 0;
	}

	.hr {
		margin: 0;
		border: 0;
		border-bottom: 1px solid #e2e8f0;
		background: transparent;
	}

	.zd-comment {
		margin-bottom: 16px;
	}

	.layout {
		position: relative;
		background-color: #ffffff;
	}

	.layout--boxed {
		margin-right: auto;
		margin-left: auto;
		width: 100%;
		max-width: 1400px;
	}

	.layout--boxed ~ .powered-by-zendesk {
		margin-right: auto;
		margin-left: auto;
		width: 100%;
		max-width: 1400px;
	}

	.container {
		margin-right: auto;
		margin-left: auto;
		padding: 0 1rem;
		width: 100%;
	}

	@media (width >= 576px) {
		.container {
			padding: 0 2rem;
		}
	}

	@media (width >= 1200px) {
		.container {
			max-width: 1140px;
		}
	}

	.container-fluid {
		margin-right: auto;
		margin-left: auto;
		padding: 0 2rem;
		width: 100%;
	}

	.flex-container {
		display: flex;
		flex-direction: column;
	}

	@media (width >= 768px) {
		.flex-container {
			flex-direction: row;
			align-items: flex-end;
		}
	}

	.row,
	.recent-articles ul {
		display: flex;
		flex-grow: 1;
		flex-wrap: wrap;
		margin-right: -1rem;
		margin-left: -1rem;
	}

	.row-flush {
		margin-right: 0;
		margin-left: 0;
	}

	.row-flush > [class*='col'] {
		padding-right: 0;
		padding-left: 0;
	}

	.row-sm,
	.recent-articles ul {
		margin-right: -12px;
		margin-left: -12px;
	}

	.row-sm > [class*='col'],
	.recent-articles ul > [class*='col'] {
		padding-right: 12px;
		padding-left: 12px;
	}

	.row-lg {
		margin-right: -1.5rem;
		margin-left: -1.5rem;
	}

	.row-lg > [class*='col'] {
		padding-right: 1.5rem;
		padding-left: 1.5rem;
	}

	.col-1,
	.col-2,
	.col-3,
	.col-4,
	.col-5,
	.col-6,
	.col-7,
	.col-8,
	.col-9,
	.col-10,
	.col-11,
	.col-12,
	.col,
	.col-auto,
	.sm\\:col-1,
	.sm\\:col-2,
	.sm\\:col-3,
	.sm\\:col-4,
	.sm\\:col-5,
	.sm\\:col-6,
	.sm\\:col-7,
	.sm\\:col-8,
	.sm\\:col-9,
	.sm\\:col-10,
	.sm\\:col-11,
	.sm\\:col-12,
	.sm\\:col,
	.sm\\:col-auto,
	.md\\:col-1,
	.md\\:col-2,
	.md\\:col-3,
	.md\\:col-4,
	.md\\:col-5,
	.md\\:col-6,
	.md\\:col-7,
	.md\\:col-8,
	.md\\:col-9,
	.md\\:col-10,
	.md\\:col-11,
	.md\\:col-12,
	.md\\:col,
	.md\\:col-auto,
	.lg\\:col-1,
	.lg\\:col-2,
	.lg\\:col-3,
	.lg\\:col-4,
	.lg\\:col-5,
	.lg\\:col-6,
	.lg\\:col-7,
	.lg\\:col-8,
	.lg\\:col-9,
	.lg\\:col-10,
	.lg\\:col-11,
	.lg\\:col-12,
	.lg\\:col,
	.lg\\:col-auto,
	.xl\\:col-1,
	.xl\\:col-2,
	.xl\\:col-3,
	.xl\\:col-4,
	.xl\\:col-5,
	.xl\\:col-6,
	.xl\\:col-7,
	.xl\\:col-8,
	.xl\\:col-9,
	.xl\\:col-10,
	.xl\\:col-11,
	.xl\\:col-12,
	.xl\\:col,
	.xl\\:col-auto {
		position: relative;
		padding-right: 1rem;
		padding-left: 1rem;
		width: 100%;
		min-width: 0;
		min-height: 1px;
	}

	.col {
		flex-grow: 1;
		flex-basis: 0;
		max-width: 100%;
	}

	.col-auto {
		flex: 1 0 300px;
	}

	.col-1 {
		flex: 0 0 8.333%;
		max-width: 8.333%;
	}

	.col-2 {
		flex: 0 0 16.6667%;
		max-width: 16.6667%;
	}

	.col-3 {
		flex: 0 0 25%;
		max-width: 25%;
	}

	.col-4 {
		flex: 0 0 33.333%;
		max-width: 33.333%;
	}

	.col-5 {
		flex: 0 0 41.6667%;
		max-width: 41.6667%;
	}

	.col-6 {
		flex: 0 0 50%;
		max-width: 50%;
	}

	.col-7 {
		flex: 0 0 58.333%;
		max-width: 58.333%;
	}

	.col-8 {
		flex: 0 0 66.6667%;
		max-width: 66.6667%;
	}

	.col-9 {
		flex: 0 0 75%;
		max-width: 75%;
	}

	.col-10 {
		flex: 0 0 83.333%;
		max-width: 83.333%;
	}

	.col-11 {
		flex: 0 0 91.6667%;
		max-width: 91.6667%;
	}

	.col-12 {
		flex: 0 0 100%;
		max-width: 100%;
	}

	.col-order-1 {
		order: 1;
	}

	.col-order-2 {
		order: 2;
	}

	.col-order-3 {
		order: 3;
	}

	.col-order-4 {
		order: 4;
	}

	.col-order-5 {
		order: 5;
	}

	.col-order-6 {
		order: 6;
	}

	.col-order-7 {
		order: 7;
	}

	.col-order-8 {
		order: 8;
	}

	.col-order-9 {
		order: 9;
	}

	.col-order-10 {
		order: 10;
	}

	.col-order-11 {
		order: 11;
	}

	.col-order-12 {
		order: 12;
	}

	.col-offset-1 {
		margin-left: 8.333%;
	}

	.col-offset-2 {
		margin-left: 16.6667%;
	}

	.col-offset-3 {
		margin-left: 25%;
	}

	.col-offset-4 {
		margin-left: 33.333%;
	}

	.col-offset-5 {
		margin-left: 41.6667%;
	}

	.col-offset-6 {
		margin-left: 50%;
	}

	.col-offset-7 {
		margin-left: 58.333%;
	}

	.col-offset-8 {
		margin-left: 66.6667%;
	}

	.col-offset-9 {
		margin-left: 75%;
	}

	.col-offset-10 {
		margin-left: 83.333%;
	}

	.col-offset-11 {
		margin-left: 91.6667%;
	}

	@media (width >= 576px) {
		.sm\\:col {
			flex-grow: 1;
			flex-basis: 0;
			max-width: 100%;
		}

		.sm\\:col-auto {
			flex: 1 0 300px;
		}

		.sm\\:col-1 {
			flex: 0 0 8.333%;
			max-width: 8.333%;
		}

		.sm\\:col-2 {
			flex: 0 0 16.6667%;
			max-width: 16.6667%;
		}

		.sm\\:col-3 {
			flex: 0 0 25%;
			max-width: 25%;
		}

		.sm\\:col-4 {
			flex: 0 0 33.333%;
			max-width: 33.333%;
		}

		.sm\\:col-5 {
			flex: 0 0 41.6667%;
			max-width: 41.6667%;
		}

		.sm\\:col-6 {
			flex: 0 0 50%;
			max-width: 50%;
		}

		.sm\\:col-7 {
			flex: 0 0 58.333%;
			max-width: 58.333%;
		}

		.sm\\:col-8 {
			flex: 0 0 66.6667%;
			max-width: 66.6667%;
		}

		.sm\\:col-9 {
			flex: 0 0 75%;
			max-width: 75%;
		}

		.sm\\:col-10 {
			flex: 0 0 83.333%;
			max-width: 83.333%;
		}

		.sm\\:col-11 {
			flex: 0 0 91.6667%;
			max-width: 91.6667%;
		}

		.sm\\:col-12 {
			flex: 0 0 100%;
			max-width: 100%;
		}

		.sm\\:col-order-1 {
			order: 1;
		}

		.sm\\:col-order-2 {
			order: 2;
		}

		.sm\\:col-order-3 {
			order: 3;
		}

		.sm\\:col-order-4 {
			order: 4;
		}

		.sm\\:col-order-5 {
			order: 5;
		}

		.sm\\:col-order-6 {
			order: 6;
		}

		.sm\\:col-order-7 {
			order: 7;
		}

		.sm\\:col-order-8 {
			order: 8;
		}

		.sm\\:col-order-9 {
			order: 9;
		}

		.sm\\:col-order-10 {
			order: 10;
		}

		.sm\\:col-order-11 {
			order: 11;
		}

		.sm\\:col-order-12 {
			order: 12;
		}

		.sm\\:col-offset-0 {
			margin-left: 0;
		}

		.sm\\:col-offset-1 {
			margin-left: 8.333%;
		}

		.sm\\:col-offset-2 {
			margin-left: 16.6667%;
		}

		.sm\\:col-offset-3 {
			margin-left: 25%;
		}

		.sm\\:col-offset-4 {
			margin-left: 33.333%;
		}

		.sm\\:col-offset-5 {
			margin-left: 41.6667%;
		}

		.sm\\:col-offset-6 {
			margin-left: 50%;
		}

		.sm\\:col-offset-7 {
			margin-left: 58.333%;
		}

		.sm\\:col-offset-8 {
			margin-left: 66.6667%;
		}

		.sm\\:col-offset-9 {
			margin-left: 75%;
		}

		.sm\\:col-offset-10 {
			margin-left: 83.333%;
		}

		.sm\\:col-offset-11 {
			margin-left: 91.6667%;
		}
	}

	@media (width >= 768px) {
		.md\\:col {
			flex-grow: 1;
			flex-basis: 0;
			max-width: 100%;
		}

		.md\\:col-auto {
			flex: 1 0 300px;
		}

		.md\\:col-1 {
			flex: 0 0 8.333%;
			max-width: 8.333%;
		}

		.md\\:col-2 {
			flex: 0 0 16.6667%;
			max-width: 16.6667%;
		}

		.md\\:col-3 {
			flex: 0 0 25%;
			max-width: 25%;
		}

		.md\\:col-4 {
			flex: 0 0 33.333%;
			max-width: 33.333%;
		}

		.md\\:col-5 {
			flex: 0 0 41.6667%;
			max-width: 41.6667%;
		}

		.md\\:col-6 {
			flex: 0 0 50%;
			max-width: 50%;
		}

		.md\\:col-7 {
			flex: 0 0 58.333%;
			max-width: 58.333%;
		}

		.md\\:col-8 {
			flex: 0 0 66.6667%;
			max-width: 66.6667%;
		}

		.md\\:col-9 {
			flex: 0 0 75%;
			max-width: 75%;
		}

		.md\\:col-10 {
			flex: 0 0 83.333%;
			max-width: 83.333%;
		}

		.md\\:col-11 {
			flex: 0 0 91.6667%;
			max-width: 91.6667%;
		}

		.md\\:col-12 {
			flex: 0 0 100%;
			max-width: 100%;
		}

		.md\\:col-order-1 {
			order: 1;
		}

		.md\\:col-order-2 {
			order: 2;
		}

		.md\\:col-order-3 {
			order: 3;
		}

		.md\\:col-order-4 {
			order: 4;
		}

		.md\\:col-order-5 {
			order: 5;
		}

		.md\\:col-order-6 {
			order: 6;
		}

		.md\\:col-order-7 {
			order: 7;
		}

		.md\\:col-order-8 {
			order: 8;
		}

		.md\\:col-order-9 {
			order: 9;
		}

		.md\\:col-order-10 {
			order: 10;
		}

		.md\\:col-order-11 {
			order: 11;
		}

		.md\\:col-order-12 {
			order: 12;
		}

		.md\\:col-offset-0 {
			margin-left: 0;
		}

		.md\\:col-offset-1 {
			margin-left: 8.333%;
		}

		.md\\:col-offset-2 {
			margin-left: 16.6667%;
		}

		.md\\:col-offset-3 {
			margin-left: 25%;
		}

		.md\\:col-offset-4 {
			margin-left: 33.333%;
		}

		.md\\:col-offset-5 {
			margin-left: 41.6667%;
		}

		.md\\:col-offset-6 {
			margin-left: 50%;
		}

		.md\\:col-offset-7 {
			margin-left: 58.333%;
		}

		.md\\:col-offset-8 {
			margin-left: 66.6667%;
		}

		.md\\:col-offset-9 {
			margin-left: 75%;
		}

		.md\\:col-offset-10 {
			margin-left: 83.333%;
		}

		.md\\:col-offset-11 {
			margin-left: 91.6667%;
		}
	}

	@media (width >= 992px) {
		.lg\\:col {
			flex-grow: 1;
			flex-basis: 0;
			max-width: 100%;
		}

		.lg\\:col-auto {
			flex: 1 0 300px;
		}

		.lg\\:col-1 {
			flex: 0 0 8.333%;
			max-width: 8.333%;
		}

		.lg\\:col-2 {
			flex: 0 0 16.6667%;
			max-width: 16.6667%;
		}

		.lg\\:col-3 {
			flex: 0 0 25%;
			max-width: 25%;
		}

		.lg\\:col-4 {
			flex: 0 0 33.333%;
			max-width: 33.333%;
		}

		.lg\\:col-5 {
			flex: 0 0 41.6667%;
			max-width: 41.6667%;
		}

		.lg\\:col-6 {
			flex: 0 0 50%;
			max-width: 50%;
		}

		.lg\\:col-7 {
			flex: 0 0 58.333%;
			max-width: 58.333%;
		}

		.lg\\:col-8 {
			flex: 0 0 66.6667%;
			max-width: 66.6667%;
		}

		.lg\\:col-9 {
			flex: 0 0 75%;
			max-width: 75%;
		}

		.lg\\:col-10 {
			flex: 0 0 83.333%;
			max-width: 83.333%;
		}

		.lg\\:col-11 {
			flex: 0 0 91.6667%;
			max-width: 91.6667%;
		}

		.lg\\:col-12 {
			flex: 0 0 100%;
			max-width: 100%;
		}

		.lg\\:col-order-1 {
			order: 1;
		}

		.lg\\:col-order-2 {
			order: 2;
		}

		.lg\\:col-order-3 {
			order: 3;
		}

		.lg\\:col-order-4 {
			order: 4;
		}

		.lg\\:col-order-5 {
			order: 5;
		}

		.lg\\:col-order-6 {
			order: 6;
		}

		.lg\\:col-order-7 {
			order: 7;
		}

		.lg\\:col-order-8 {
			order: 8;
		}

		.lg\\:col-order-9 {
			order: 9;
		}

		.lg\\:col-order-10 {
			order: 10;
		}

		.lg\\:col-order-11 {
			order: 11;
		}

		.lg\\:col-order-12 {
			order: 12;
		}

		.lg\\:col-offset-0 {
			margin-left: 0;
		}

		.lg\\:col-offset-1 {
			margin-left: 8.333%;
		}

		.lg\\:col-offset-2 {
			margin-left: 16.6667%;
		}

		.lg\\:col-offset-3 {
			margin-left: 25%;
		}

		.lg\\:col-offset-4 {
			margin-left: 33.333%;
		}

		.lg\\:col-offset-5 {
			margin-left: 41.6667%;
		}

		.lg\\:col-offset-6 {
			margin-left: 50%;
		}

		.lg\\:col-offset-7 {
			margin-left: 58.333%;
		}

		.lg\\:col-offset-8 {
			margin-left: 66.6667%;
		}

		.lg\\:col-offset-9 {
			margin-left: 75%;
		}

		.lg\\:col-offset-10 {
			margin-left: 83.333%;
		}

		.lg\\:col-offset-11 {
			margin-left: 91.6667%;
		}
	}

	@media (width >= 1200px) {
		.xl\\:col {
			flex-grow: 1;
			flex-basis: 0;
			max-width: 100%;
		}

		.xl\\:col-auto {
			flex: 1 0 300px;
		}

		.xl\\:col-1 {
			flex: 0 0 8.333%;
			max-width: 8.333%;
		}

		.xl\\:col-2 {
			flex: 0 0 16.6667%;
			max-width: 16.6667%;
		}

		.xl\\:col-3 {
			flex: 0 0 25%;
			max-width: 25%;
		}

		.xl\\:col-4 {
			flex: 0 0 33.333%;
			max-width: 33.333%;
		}

		.xl\\:col-5 {
			flex: 0 0 41.6667%;
			max-width: 41.6667%;
		}

		.xl\\:col-6 {
			flex: 0 0 50%;
			max-width: 50%;
		}

		.xl\\:col-7 {
			flex: 0 0 58.333%;
			max-width: 58.333%;
		}

		.xl\\:col-8 {
			flex: 0 0 66.6667%;
			max-width: 66.6667%;
		}

		.xl\\:col-9 {
			flex: 0 0 75%;
			max-width: 75%;
		}

		.xl\\:col-10 {
			flex: 0 0 83.333%;
			max-width: 83.333%;
		}

		.xl\\:col-11 {
			flex: 0 0 91.6667%;
			max-width: 91.6667%;
		}

		.xl\\:col-12 {
			flex: 0 0 100%;
			max-width: 100%;
		}

		.xl\\:col-order-1 {
			order: 1;
		}

		.xl\\:col-order-2 {
			order: 2;
		}

		.xl\\:col-order-3 {
			order: 3;
		}

		.xl\\:col-order-4 {
			order: 4;
		}

		.xl\\:col-order-5 {
			order: 5;
		}

		.xl\\:col-order-6 {
			order: 6;
		}

		.xl\\:col-order-7 {
			order: 7;
		}

		.xl\\:col-order-8 {
			order: 8;
		}

		.xl\\:col-order-9 {
			order: 9;
		}

		.xl\\:col-order-10 {
			order: 10;
		}

		.xl\\:col-order-11 {
			order: 11;
		}

		.xl\\:col-order-12 {
			order: 12;
		}

		.xl\\:col-offset-0 {
			margin-left: 0;
		}

		.xl\\:col-offset-1 {
			margin-left: 8.333%;
		}

		.xl\\:col-offset-2 {
			margin-left: 16.6667%;
		}

		.xl\\:col-offset-3 {
			margin-left: 25%;
		}

		.xl\\:col-offset-4 {
			margin-left: 33.333%;
		}

		.xl\\:col-offset-5 {
			margin-left: 41.6667%;
		}

		.xl\\:col-offset-6 {
			margin-left: 50%;
		}

		.xl\\:col-offset-7 {
			margin-left: 58.333%;
		}

		.xl\\:col-offset-8 {
			margin-left: 66.6667%;
		}

		.xl\\:col-offset-9 {
			margin-left: 75%;
		}

		.xl\\:col-offset-10 {
			margin-left: 83.333%;
		}

		.xl\\:col-offset-11 {
			margin-left: 91.6667%;
		}
	}

	.card {
		display: flex;
		position: relative;
		flex-direction: column;
		min-width: 0;
		word-wrap: break-word;
		border: 1px solid #e2e8f0;
		border-radius: 0.25rem;
		background-clip: border-box;
	}

	.card-body {
		flex: 1 1 auto;
		padding: 1rem 1.5rem;
	}

	.hero {
		display: flex;
		position: relative;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}

	.media {
		display: flex;
		flex: 1;
		align-items: flex-start;
	}

	.media-body {
		flex: 1;
		min-width: 0;
	}

	.topbar .nav-link {
		color: #000000;
	}

	.topbar .nav-link:hover {
		color: #000000;
	}

	.topbar .nav-link:active {
		color: #000000;
	}

	.header {
		height: 100%;
	}

	.header,
	.header .nav-menu {
		background-color: #ffffff;
	}

	.header .navbar-brand,
	.header .navbar-toggle,
	.header .nav-link {
		color: #000000;
	}

	.header .navbar-brand:hover,
	.header .navbar-toggle:hover,
	.header .nav-link:hover {
		color: #000000;
	}

	.header .navbar-brand:active,
	.header .navbar-toggle:active,
	.header .nav-link:active {
		color: #000000;
	}

	.header:not(.is-visible) {
		transition: none;
	}

	@media (width <= 1199.98px) {
		.mobile-menu-open .header .nav-menu {
			background-color: #ffffff;
		}
	}

	.footer {
		background-color: #121212;
	}

	.footer .nav-link {
		color: #ffffff;
	}

	.footer .nav-link:hover {
		color: #f0f0f0;
	}

	.footer .nav-link:active {
		color: #e0e0e0;
	}

	.breadcrumbs {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 1rem;
		padding-left: 0;
		list-style: none;
	}

	.breadcrumbs > * + * {
		padding-left: 0.5rem;
	}

	.breadcrumbs > * + *::before {
		display: inline-block;
		padding-right: 0.5rem;
		content: '/';
	}

	.breadcrumbs li {
		color: #4a5568;
	}

	.breadcrumbs li + li::before {
		color: #4a5568;
	}

	.dropdown {
		display: inline-flex;
		position: relative;
	}

	.dropdown-toggle {
		cursor: pointer;
	}

	.dropdown-menu {
		display: none;
		position: absolute;
		top: 100%;
		left: 50%;
		transform: translateX(-50%);
		z-index: 99;
		box-shadow: 0 4px 6px rgb(0 0 0 / 10%);
		border: 1px solid #e2e8f0;
		background-color: #ffffff;
		padding: 0.75rem 0;
		min-width: 170px;
		font-size: 0.875rem;
	}

	.dropdown-menu-start {
		right: auto;
		left: 0;
		transform: translateX(0);
	}

	.dropdown-menu-end {
		right: 0;
		left: auto;
		transform: translateX(0);
	}

	.dropdown-menu-top {
		top: auto;
		bottom: 100%;
	}

	.dropdown-menu::before {
		border-bottom-color: #e2e8f0;
	}

	.dropdown-menu[aria-expanded='true'] {
		display: block;
	}

	[dir='rtl'] .dropdown-menu {
		right: 0;
	}

	.dropdown-item {
		display: block;
		clear: both;
		border: 0;
		background-color: transparent;
		padding: 0.5rem 1.5rem;
		width: 100%;
		color: #2d3748;
		font-weight: 400;
		text-align: inherit;
	}

	.dropdown-item:focus,
	.dropdown-item:hover {
		background-color: #f1f1f1;
		color: #232b38;
		text-decoration: none;
	}

	.dropdown-item.is-active {
		background-color: #002e6c;
		color: #ffffff;
		text-decoration: none;
	}

	.dropdown-item[aria-selected='true'] {
		cursor: default;
	}

	.dropdown-item[aria-selected='true']::after {
		display: inline-block;
		margin-left: 10px;
		background-image: url("data:image/svg+xml,%3Csvg aria-hidden='true' xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='currentColor' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M1 7l3 3 7-7'%3E%3C/path%3E%3C/svg%3E");
		width: 12px;
		height: 12px;
		content: '';
	}

	[dir='rtl']
		.dropdown-item[aria-selected='true']::after {
		float: left;
		margin-right: 10px;
		margin-left: 0;
	}

	.has-dropdown {
		position: relative;
	}

	.has-dropdown:focus > .dropdown-menu,
	.has-dropdown:hover > .dropdown-menu {
		display: block;
	}

	.nav {
		display: flex;
		flex-wrap: wrap;
		margin-bottom: 0;
		padding-left: 0;
		list-style: none;
	}

	.nav-link {
		display: block;
		padding: 0.5em 1em;
	}

	.nav-link:focus,
	.nav-link:hover {
		cursor: pointer;
		text-decoration: none;
	}

	.nav-line .nav-link {
		position: relative;
	}

	.nav-line .nav-link::after {
		display: block;
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		transition: border-color 0.15s ease-in-out;
		border-bottom: 3px solid transparent;
		border-top-right-radius: 0.25rem;
		border-top-left-radius: 0.25rem;
		content: '';
	}

	.nav-line .nav-link:hover::after {
		border-bottom-color: #e2e8f0;
	}

	.nav-line .nav-link:active,
	.nav-line .nav-link.is-active::after {
		border-bottom-color: #002e6c;
	}

	.nav-tabs {
		position: relative;
		flex-direction: column;
		margin-bottom: -1px;
		border: 1px solid #e2e8f0;
		border-width: 1px 1px 0;
		border-top-right-radius: 0.25rem;
		border-top-left-radius: 0.25rem;
	}

	.nav-tabs .nav-item {
		border-bottom: 1px solid #e2e8f0;
	}

	@media (width >= 992px) {
		.nav-tabs {
			flex-direction: row;
			border-width: 0 0 1px;
		}

		.nav-tabs .nav-item,
		.nav-tabs .nav-link {
			z-index: 1;
		}

		.nav-tabs .nav-item {
			border-bottom: none;
			border-top-right-radius: 0.25rem;
			border-top-left-radius: 0.25rem;
		}

		.nav-tabs .nav-link {
			margin-bottom: -1px;
			border-width: 1px;
			border-style: solid;
			border-color: transparent;
			border-bottom-color: #e2e8f0;
			border-top-right-radius: 0.25rem;
			border-top-left-radius: 0.25rem;
		}

		.nav-tabs .nav-link.is-active {
			border-color: #e2e8f0;
			border-bottom-color: transparent;
			background-color: #ffffff;
		}

		.nav-tabs .dropdown-menu {
			border-top: none;
			border-top-right-radius: 0;
			border-top-left-radius: 0;
		}

		.nav-tabs .dropdown-menu .is-active {
			border: none;
			font-weight: 500;
		}
	}

	.nav-pills .nav-link.is-active {
		background-color: #002e6c;
		color: #ffffff;
	}

	.nav-fill .nav-item {
		flex: 1 1 auto;
		text-align: center;
	}

	.nav-justified .nav-item {
		flex-grow: 1;
		flex-basis: 0;
		text-align: center;
	}

	@media (width <= 1199.98px) {
		.nav-menu {
			flex-flow: column nowrap;
			z-index: 99;
			background-color: #ffffff;
			overflow: hidden;
		}

		.nav-menu .nav-item {
			padding-right: 16px;
			padding-left: 16px;
		}

		.nav-menu .nav-item:last-child {
			margin-bottom: 16px;
		}

		.nav-menu {
			position: absolute;
			top: 100%;
			right: 0;
			left: 0;
			box-shadow: 0 2px 2px rgb(0 0 0 / 8%);
		}
	}

	.navbar {
		display: flex;
		position: relative;
		flex-wrap: wrap;
		justify-content: space-between;
		align-items: center;
		padding-top: 1rem;
		padding-bottom: 1rem;
	}

	.navbar-light .navbar-brand {
		color: #1a202c;
	}

	.navbar-light .navbar-toggle,
	.navbar-light .nav-link {
		color: #4a5568;
	}

	.navbar-light .navbar-toggle:focus,
	.navbar-light .navbar-toggle:hover,
	.navbar-light .nav-link:focus,
	.navbar-light .nav-link:hover {
		color: #1a202c;
	}

	.navbar-dark .navbar-brand {
		color: #ffffff;
	}

	.navbar-dark .navbar-toggle,
	.navbar-dark .nav-link {
		color: #e2e8f0;
	}

	.navbar-dark .navbar-toggle:focus,
	.navbar-dark .navbar-toggle:hover,
	.navbar-dark .nav-link:focus,
	.navbar-dark .nav-link:hover {
		color: #ffffff;
	}

	.navbar-brand {
		display: inline-block;
	}

	.navbar-toggle {
		display: block;
		position: relative;
		order: 1;
		appearance: none;
		cursor: pointer;
		box-shadow: none;
		border: none;
		background-color: transparent;
		padding: 1rem 0.5rem;
		height: auto;
	}

	.navbar-toggle span {
		display: block;
		position: relative;
		pointer-events: none;
	}

	.navbar-toggle span,
	.navbar-toggle span::before,
	.navbar-toggle span::after {
		transition:
			background-color 0.15s,
			transform 0.15s;
		outline: 1px solid transparent;
		background-color: currentcolor;
		width: 26px;
		height: 2px;
	}

	.navbar-toggle span::before,
	.navbar-toggle span::after {
		position: absolute;
		left: 0;
		content: '';
	}

	.navbar-toggle span::before {
		top: -7px;
	}

	.navbar-toggle span::after {
		top: 7px;
	}

	.navbar-toggle[aria-expanded='true'] {
		outline: none;
	}

	.navbar-toggle[aria-expanded='true'] span {
		background-color: transparent;
	}

	.navbar-toggle[aria-expanded='true']
		span::before,
	.navbar-toggle[aria-expanded='true']
		span::after {
		top: 0;
	}

	.navbar-toggle[aria-expanded='true']
		span::before {
		transform: rotate(-45deg);
	}

	.navbar-toggle[aria-expanded='true']
		span::after {
		transform: rotate(45deg);
	}

	@media (width >= 1200px) {
		.navbar-toggle {
			display: none;
		}
	}

	.pagination {
		margin: 1rem 0;
		text-align: center;
	}

	.pagination-list {
		padding-left: 0;
	}

	.pagination-next,
	.pagination-prev,
	.pagination-first,
	.pagination-last {
		display: inline-block;
	}

	.pagination-first-text,
	.pagination-last-text {
		position: absolute;
		padding: 0;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		clip-path: inset(50%);
		border: 0;
		white-space: nowrap;
	}

	@media (width <= 1199.98px) {
		.collapsible-nav {
			position: relative;
			flex-flow: column nowrap;
			transition: max-height 0.3s ease-in-out;
			cursor: pointer;
			margin-right: 0;
			margin-left: 0;
			max-height: 3em;
			overflow: hidden;
		}

		.collapsible-nav > * {
			line-height: 3em;
		}

		.collapsible-nav > [aria-selected='true'] {
			order: -1;
		}

		.collapsible-nav .nav-link {
			border: none;
			padding: 0;
		}

		.collapsible-nav .nav-link::after {
			display: none;
		}

		.collapsible-nav .nav-link.is-active {
			order: -1;
			background-color: transparent;
			color: inherit;
		}

		.collapsible-nav::after {
			position: absolute;
			top: calc(3em / 2 - 0.5em);
			right: 0;
			background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%232D3748' stroke-linecap='round' d='M3 4.5l2.6 2.6c.2.2.5.2.7 0L9 4.5'%3E%3C/path%3E%3C/svg%3E")
				no-repeat transparent center center;
			width: 1em;
			height: 1em;
			pointer-events: none;
			content: '';
		}

		[dir='rtl'] .collapsible-nav::after {
			right: auto;
			left: 0;
		}

		.collapsible-nav.is-expanded {
			max-height: 100vh;
		}

		.collapsible-nav.is-expanded::after {
			background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath stroke='%232D3748' stroke-linecap='round' d='M3 9l6-6m0 6L3 3'%3E%3C/path%3E%3C/svg%3E")
				no-repeat transparent center center;
		}

		.collapsible-nav .dropdown-menu {
			display: none !important;
		}
	}

	@media (width <= 1199.98px) {
		.collapse-title {
			display: flex;
			position: relative;
			justify-content: space-between;
			align-items: center;
			transition: color 0.15s ease-in-out;
			cursor: pointer;
			margin: 0;
			padding: 0.75rem 0;
			font-size: 1em;
			user-select: none;
		}

		.collapse-title::after {
			background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%232D3748' stroke-linecap='round' d='M3 4.5l2.6 2.6c.2.2.5.2.7 0L9 4.5'%3E%3C/path%3E%3C/svg%3E")
				no-repeat transparent center center;
			width: 1em;
			height: 1em;
			content: '';
		}

		.collapse-title.is-active::after {
			background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath stroke='%232D3748' stroke-linecap='round' d='M3 9l6-6m0 6L3 3'%3E%3C/path%3E%3C/svg%3E")
				no-repeat transparent center center;
		}

		.collapse-title:focus,
		.collapse-title:hover {
			outline: none;
			text-decoration: none;
		}
	}

	.collapse:not(.is-visible) {
		display: none;
	}

	.collapsing {
		transition: all 0.15s ease-in-out;
		height: 0;
		overflow: hidden;
	}

	.expand {
		display: flex !important;
		height: 100% !important;
		max-height: none !important;
		overflow: visible;
	}

	@media (width >= 576px) {
		.sm\\:expand {
			display: flex !important;
			height: 100% !important;
			max-height: none !important;
			overflow: visible;
		}
	}

	@media (width >= 768px) {
		.md\\:expand {
			display: flex !important;
			height: 100% !important;
			max-height: none !important;
			overflow: visible;
		}
	}

	@media (width >= 992px) {
		.lg\\:expand {
			display: flex !important;
			height: 100% !important;
			max-height: none !important;
			overflow: visible;
		}
	}

	@media (width >= 1200px) {
		.xl\\:expand {
			display: flex !important;
			height: 100% !important;
			max-height: none !important;
			overflow: visible;
		}
	}

	.tab-panel {
		margin-bottom: 16px;
		border: 1px solid #e2e8f0;
		border-bottom-right-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
		padding: 16px;
		list-style: none;
	}

	.tab-panel:not(:first-of-type) {
		display: none;
	}

	.tab-panel :last-child {
		margin-bottom: 0;
	}

	.tab {
		display: none;
	}

	.tab.is-active {
		display: block;
	}

	.fade {
		transition: opacity 150ms ease;
	}

	.fade:not(.is-shown) {
		opacity: 0%;
	}

	.scaled {
		transform: scale(1);
		transition:
			opacity 500ms ease,
			transform 500ms ease;
	}

	.scaled:not(.is-shown) {
		transform: scale(1.1);
		opacity: 0%;
	}

	.toggle {
		padding-right: 1em;
		padding-left: 1em;
	}

	.toggle:not(:last-child) {
		border-bottom: 1px solid #e2e8f0;
	}

	.toggle-title {
		display: flex;
		position: relative;
		justify-content: space-between;
		align-items: center;
		transition: color 0.15s ease-in-out;
		cursor: pointer;
		margin: 0;
		padding: 0.75rem 0;
		font-size: 1em;
		user-select: none;
	}

	.toggle-title::after {
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%232D3748' stroke-linecap='round' d='M3 4.5l2.6 2.6c.2.2.5.2.7 0L9 4.5'%3E%3C/path%3E%3C/svg%3E")
			no-repeat transparent center center;
		width: 1em;
		height: 1em;
		content: '';
	}

	.toggle-title.is-active::after {
		background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 12 12'%3E%3Cpath stroke='%232D3748' stroke-linecap='round' d='M3 9l6-6m0 6L3 3'%3E%3C/path%3E%3C/svg%3E")
			no-repeat transparent center center;
	}

	.toggle-title:focus,
	.toggle-title:hover {
		outline: none;
		text-decoration: none;
	}

	.text-transparent {
		color: transparent;
	}

	.text-inherit {
		color: inherit;
	}

	.text-base {
		color: #333333;
	}

	.text-black {
		color: #000000;
	}

	.text-white {
		color: #ffffff;
	}

	.text-translucent {
		color: rgb(255 255 255 / 10%);
	}

	.text-gray-100 {
		color: #f1f1f1;
	}

	.text-gray-200 {
		color: #f1f1f1;
	}

	.text-gray-300 {
		color: #e2e8f0;
	}

	.text-gray-400 {
		color: #cbd5e0;
	}

	.text-gray-500 {
		color: #a0aec0;
	}

	.text-gray-600 {
		color: #777779;
	}

	.text-gray-700 {
		color: #4a5568;
	}

	.text-gray-800 {
		color: #2d3748;
	}

	.text-gray-900 {
		color: #1a202c;
	}

	.text-red-100 {
		color: #fff5f5;
	}

	.text-red-300 {
		color: #feb2b2;
	}

	.text-red-500 {
		color: #f56565;
	}

	.text-red-700 {
		color: #c53030;
	}

	.text-red-900 {
		color: #742a2a;
	}

	.text-orange-100 {
		color: #fffaf0;
	}

	.text-orange-300 {
		color: #fbd38d;
	}

	.text-orange-500 {
		color: #ed8936;
	}

	.text-orange-700 {
		color: #c05621;
	}

	.text-orange-900 {
		color: #7b341e;
	}

	.text-green-100 {
		color: #f0fff4;
	}

	.text-green-300 {
		color: #9ae6b4;
	}

	.text-green-500 {
		color: #48bb78;
	}

	.text-green-700 {
		color: #2f855a;
	}

	.text-green-900 {
		color: #22543d;
	}

	.text-primary {
		color: #002e6c;
	}

	.text-primary-inverse {
		color: #ffffff;
	}

	.hover\\:text-transparent:hover {
		color: transparent;
	}

	.hover\\:text-inherit:hover {
		color: inherit;
	}

	.hover\\:text-base:hover {
		color: #333333;
	}

	.hover\\:text-black:hover {
		color: #000000;
	}

	.hover\\:text-white:hover {
		color: #ffffff;
	}

	.hover\\:text-translucent:hover {
		color: rgb(255 255 255 / 10%);
	}

	.hover\\:text-gray-100:hover {
		color: #f1f1f1;
	}

	.hover\\:text-gray-200:hover {
		color: #f1f1f1;
	}

	.hover\\:text-gray-300:hover {
		color: #e2e8f0;
	}

	.hover\\:text-gray-400:hover {
		color: #cbd5e0;
	}

	.hover\\:text-gray-500:hover {
		color: #a0aec0;
	}

	.hover\\:text-gray-600:hover {
		color: #777779;
	}

	.hover\\:text-gray-700:hover {
		color: #4a5568;
	}

	.hover\\:text-gray-800:hover {
		color: #2d3748;
	}

	.hover\\:text-gray-900:hover {
		color: #1a202c;
	}

	.hover\\:text-red-100:hover {
		color: #fff5f5;
	}

	.hover\\:text-red-300:hover {
		color: #feb2b2;
	}

	.hover\\:text-red-500:hover {
		color: #f56565;
	}

	.hover\\:text-red-700:hover {
		color: #c53030;
	}

	.hover\\:text-red-900:hover {
		color: #742a2a;
	}

	.hover\\:text-orange-100:hover {
		color: #fffaf0;
	}

	.hover\\:text-orange-300:hover {
		color: #fbd38d;
	}

	.hover\\:text-orange-500:hover {
		color: #ed8936;
	}

	.hover\\:text-orange-700:hover {
		color: #c05621;
	}

	.hover\\:text-orange-900:hover {
		color: #7b341e;
	}

	.hover\\:text-green-100:hover {
		color: #f0fff4;
	}

	.hover\\:text-green-300:hover {
		color: #9ae6b4;
	}

	.hover\\:text-green-500:hover {
		color: #48bb78;
	}

	.hover\\:text-green-700:hover {
		color: #2f855a;
	}

	.hover\\:text-green-900:hover {
		color: #22543d;
	}

	.hover\\:text-primary:hover {
		color: #002e6c;
	}

	.hover\\:text-primary-inverse:hover {
		color: #ffffff;
	}

	@media (width >= 576px) {
		.sm\\:text-transparent {
			color: transparent;
		}

		.sm\\:text-inherit {
			color: inherit;
		}

		.sm\\:text-base {
			color: #333333;
		}

		.sm\\:text-black {
			color: #000000;
		}

		.sm\\:text-white {
			color: #ffffff;
		}

		.sm\\:text-translucent {
			color: rgb(255 255 255 / 10%);
		}

		.sm\\:text-gray-100 {
			color: #f1f1f1;
		}

		.sm\\:text-gray-200 {
			color: #f1f1f1;
		}

		.sm\\:text-gray-300 {
			color: #e2e8f0;
		}

		.sm\\:text-gray-400 {
			color: #cbd5e0;
		}

		.sm\\:text-gray-500 {
			color: #a0aec0;
		}

		.sm\\:text-gray-600 {
			color: #777779;
		}

		.sm\\:text-gray-700 {
			color: #4a5568;
		}

		.sm\\:text-gray-800 {
			color: #2d3748;
		}

		.sm\\:text-gray-900 {
			color: #1a202c;
		}

		.sm\\:text-red-100 {
			color: #fff5f5;
		}

		.sm\\:text-red-300 {
			color: #feb2b2;
		}

		.sm\\:text-red-500 {
			color: #f56565;
		}

		.sm\\:text-red-700 {
			color: #c53030;
		}

		.sm\\:text-red-900 {
			color: #742a2a;
		}

		.sm\\:text-orange-100 {
			color: #fffaf0;
		}

		.sm\\:text-orange-300 {
			color: #fbd38d;
		}

		.sm\\:text-orange-500 {
			color: #ed8936;
		}

		.sm\\:text-orange-700 {
			color: #c05621;
		}

		.sm\\:text-orange-900 {
			color: #7b341e;
		}

		.sm\\:text-green-100 {
			color: #f0fff4;
		}

		.sm\\:text-green-300 {
			color: #9ae6b4;
		}

		.sm\\:text-green-500 {
			color: #48bb78;
		}

		.sm\\:text-green-700 {
			color: #2f855a;
		}

		.sm\\:text-green-900 {
			color: #22543d;
		}

		.sm\\:text-primary {
			color: #002e6c;
		}

		.sm\\:text-primary-inverse {
			color: #ffffff;
		}
	}

	@media (width >= 768px) {
		.md\\:text-transparent {
			color: transparent;
		}

		.md\\:text-inherit {
			color: inherit;
		}

		.md\\:text-base {
			color: #333333;
		}

		.md\\:text-black {
			color: #000000;
		}

		.md\\:text-white {
			color: #ffffff;
		}

		.md\\:text-translucent {
			color: rgb(255 255 255 / 10%);
		}

		.md\\:text-gray-100 {
			color: #f1f1f1;
		}

		.md\\:text-gray-200 {
			color: #f1f1f1;
		}

		.md\\:text-gray-300 {
			color: #e2e8f0;
		}

		.md\\:text-gray-400 {
			color: #cbd5e0;
		}

		.md\\:text-gray-500 {
			color: #a0aec0;
		}

		.md\\:text-gray-600 {
			color: #777779;
		}

		.md\\:text-gray-700 {
			color: #4a5568;
		}

		.md\\:text-gray-800 {
			color: #2d3748;
		}

		.md\\:text-gray-900 {
			color: #1a202c;
		}

		.md\\:text-red-100 {
			color: #fff5f5;
		}

		.md\\:text-red-300 {
			color: #feb2b2;
		}

		.md\\:text-red-500 {
			color: #f56565;
		}

		.md\\:text-red-700 {
			color: #c53030;
		}

		.md\\:text-red-900 {
			color: #742a2a;
		}

		.md\\:text-orange-100 {
			color: #fffaf0;
		}

		.md\\:text-orange-300 {
			color: #fbd38d;
		}

		.md\\:text-orange-500 {
			color: #ed8936;
		}

		.md\\:text-orange-700 {
			color: #c05621;
		}

		.md\\:text-orange-900 {
			color: #7b341e;
		}

		.md\\:text-green-100 {
			color: #f0fff4;
		}

		.md\\:text-green-300 {
			color: #9ae6b4;
		}

		.md\\:text-green-500 {
			color: #48bb78;
		}

		.md\\:text-green-700 {
			color: #2f855a;
		}

		.md\\:text-green-900 {
			color: #22543d;
		}

		.md\\:text-primary {
			color: #002e6c;
		}

		.md\\:text-primary-inverse {
			color: #ffffff;
		}
	}

	@media (width >= 992px) {
		.lg\\:text-transparent {
			color: transparent;
		}

		.lg\\:text-inherit {
			color: inherit;
		}

		.lg\\:text-base {
			color: #333333;
		}

		.lg\\:text-black {
			color: #000000;
		}

		.lg\\:text-white {
			color: #ffffff;
		}

		.lg\\:text-translucent {
			color: rgb(255 255 255 / 10%);
		}

		.lg\\:text-gray-100 {
			color: #f1f1f1;
		}

		.lg\\:text-gray-200 {
			color: #f1f1f1;
		}

		.lg\\:text-gray-300 {
			color: #e2e8f0;
		}

		.lg\\:text-gray-400 {
			color: #cbd5e0;
		}

		.lg\\:text-gray-500 {
			color: #a0aec0;
		}

		.lg\\:text-gray-600 {
			color: #777779;
		}

		.lg\\:text-gray-700 {
			color: #4a5568;
		}

		.lg\\:text-gray-800 {
			color: #2d3748;
		}

		.lg\\:text-gray-900 {
			color: #1a202c;
		}

		.lg\\:text-red-100 {
			color: #fff5f5;
		}

		.lg\\:text-red-300 {
			color: #feb2b2;
		}

		.lg\\:text-red-500 {
			color: #f56565;
		}

		.lg\\:text-red-700 {
			color: #c53030;
		}

		.lg\\:text-red-900 {
			color: #742a2a;
		}

		.lg\\:text-orange-100 {
			color: #fffaf0;
		}

		.lg\\:text-orange-300 {
			color: #fbd38d;
		}

		.lg\\:text-orange-500 {
			color: #ed8936;
		}

		.lg\\:text-orange-700 {
			color: #c05621;
		}

		.lg\\:text-orange-900 {
			color: #7b341e;
		}

		.lg\\:text-green-100 {
			color: #f0fff4;
		}

		.lg\\:text-green-300 {
			color: #9ae6b4;
		}

		.lg\\:text-green-500 {
			color: #48bb78;
		}

		.lg\\:text-green-700 {
			color: #2f855a;
		}

		.lg\\:text-green-900 {
			color: #22543d;
		}

		.lg\\:text-primary {
			color: #002e6c;
		}

		.lg\\:text-primary-inverse {
			color: #ffffff;
		}
	}

	@media (width >= 1200px) {
		.xl\\:text-transparent {
			color: transparent;
		}

		.xl\\:text-inherit {
			color: inherit;
		}

		.xl\\:text-base {
			color: #333333;
		}

		.xl\\:text-black {
			color: #000000;
		}

		.xl\\:text-white {
			color: #ffffff;
		}

		.xl\\:text-translucent {
			color: rgb(255 255 255 / 10%);
		}

		.xl\\:text-gray-100 {
			color: #f1f1f1;
		}

		.xl\\:text-gray-200 {
			color: #f1f1f1;
		}

		.xl\\:text-gray-300 {
			color: #e2e8f0;
		}

		.xl\\:text-gray-400 {
			color: #cbd5e0;
		}

		.xl\\:text-gray-500 {
			color: #a0aec0;
		}

		.xl\\:text-gray-600 {
			color: #777779;
		}

		.xl\\:text-gray-700 {
			color: #4a5568;
		}

		.xl\\:text-gray-800 {
			color: #2d3748;
		}

		.xl\\:text-gray-900 {
			color: #1a202c;
		}

		.xl\\:text-red-100 {
			color: #fff5f5;
		}

		.xl\\:text-red-300 {
			color: #feb2b2;
		}

		.xl\\:text-red-500 {
			color: #f56565;
		}

		.xl\\:text-red-700 {
			color: #c53030;
		}

		.xl\\:text-red-900 {
			color: #742a2a;
		}

		.xl\\:text-orange-100 {
			color: #fffaf0;
		}

		.xl\\:text-orange-300 {
			color: #fbd38d;
		}

		.xl\\:text-orange-500 {
			color: #ed8936;
		}

		.xl\\:text-orange-700 {
			color: #c05621;
		}

		.xl\\:text-orange-900 {
			color: #7b341e;
		}

		.xl\\:text-green-100 {
			color: #f0fff4;
		}

		.xl\\:text-green-300 {
			color: #9ae6b4;
		}

		.xl\\:text-green-500 {
			color: #48bb78;
		}

		.xl\\:text-green-700 {
			color: #2f855a;
		}

		.xl\\:text-green-900 {
			color: #22543d;
		}

		.xl\\:text-primary {
			color: #002e6c;
		}

		.xl\\:text-primary-inverse {
			color: #ffffff;
		}
	}

	.font-heading {
		font-family:
			Source Sans Pro,
			-apple-system,
			BlinkMacSystemFont,
			Segoe UI,
			Helvetica,
			Arial,
			sans-serif;
	}

	.font-text {
		font-family:
			Source Sans Pro,
			-apple-system,
			BlinkMacSystemFont,
			Segoe UI,
			Helvetica,
			Arial,
			sans-serif;
	}

	.font-code {
		font-family:
			SFMono-Regular,
			Menlo,
			Monaco,
			Consolas,
			Liberation Mono,
			Courier New,
			monospace;
	}

	.wysiwyg-font-size-small {
		font-size: 0.875rem;
	}

	.wysiwyg-font-size-medium {
		font-size: 1em;
	}

	.wysiwyg-font-size-large {
		font-size: 1.125rem;
	}

	.wysiwyg-font-size-x-large {
		font-size: 1.25rem;
	}

	.font-size-xs {
		font-size: 0.75rem;
	}

	.font-size-sm {
		font-size: 0.875rem;
	}

	.font-size-md {
		font-size: 0.9375rem;
	}

	.font-size-base {
		font-size: 1rem;
	}

	.font-size-lg {
		font-size: 1.125rem;
	}

	.font-size-xl {
		font-size: 1.25rem;
	}

	.font-size-2xl {
		font-size: 1.5rem;
	}

	.font-size-3xl {
		font-size: 1.875rem;
	}

	.font-size-4xl {
		font-size: 2.25rem;
	}

	.font-size-5xl {
		font-size: 3rem;
	}

	.font-size-6xl {
		font-size: 4rem;
	}

	@media (width >= 576px) {
		.sm\\:font-size-xs {
			font-size: 0.75rem;
		}

		.sm\\:font-size-sm {
			font-size: 0.875rem;
		}

		.sm\\:font-size-md {
			font-size: 0.9375rem;
		}

		.sm\\:font-size-base {
			font-size: 1rem;
		}

		.sm\\:font-size-lg {
			font-size: 1.125rem;
		}

		.sm\\:font-size-xl {
			font-size: 1.25rem;
		}

		.sm\\:font-size-2xl {
			font-size: 1.5rem;
		}

		.sm\\:font-size-3xl {
			font-size: 1.875rem;
		}

		.sm\\:font-size-4xl {
			font-size: 2.25rem;
		}

		.sm\\:font-size-5xl {
			font-size: 3rem;
		}

		.sm\\:font-size-6xl {
			font-size: 4rem;
		}
	}

	@media (width >= 768px) {
		.md\\:font-size-xs {
			font-size: 0.75rem;
		}

		.md\\:font-size-sm {
			font-size: 0.875rem;
		}

		.md\\:font-size-md {
			font-size: 0.9375rem;
		}

		.md\\:font-size-base {
			font-size: 1rem;
		}

		.md\\:font-size-lg {
			font-size: 1.125rem;
		}

		.md\\:font-size-xl {
			font-size: 1.25rem;
		}

		.md\\:font-size-2xl {
			font-size: 1.5rem;
		}

		.md\\:font-size-3xl {
			font-size: 1.875rem;
		}

		.md\\:font-size-4xl {
			font-size: 2.25rem;
		}

		.md\\:font-size-5xl {
			font-size: 3rem;
		}

		.md\\:font-size-6xl {
			font-size: 4rem;
		}
	}

	@media (width >= 992px) {
		.lg\\:font-size-xs {
			font-size: 0.75rem;
		}

		.lg\\:font-size-sm {
			font-size: 0.875rem;
		}

		.lg\\:font-size-md {
			font-size: 0.9375rem;
		}

		.lg\\:font-size-base {
			font-size: 1rem;
		}

		.lg\\:font-size-lg {
			font-size: 1.125rem;
		}

		.lg\\:font-size-xl {
			font-size: 1.25rem;
		}

		.lg\\:font-size-2xl {
			font-size: 1.5rem;
		}

		.lg\\:font-size-3xl {
			font-size: 1.875rem;
		}

		.lg\\:font-size-4xl {
			font-size: 2.25rem;
		}

		.lg\\:font-size-5xl {
			font-size: 3rem;
		}

		.lg\\:font-size-6xl {
			font-size: 4rem;
		}
	}

	@media (width >= 1200px) {
		.xl\\:font-size-xs {
			font-size: 0.75rem;
		}

		.xl\\:font-size-sm {
			font-size: 0.875rem;
		}

		.xl\\:font-size-md {
			font-size: 0.9375rem;
		}

		.xl\\:font-size-base {
			font-size: 1rem;
		}

		.xl\\:font-size-lg {
			font-size: 1.125rem;
		}

		.xl\\:font-size-xl {
			font-size: 1.25rem;
		}

		.xl\\:font-size-2xl {
			font-size: 1.5rem;
		}

		.xl\\:font-size-3xl {
			font-size: 1.875rem;
		}

		.xl\\:font-size-4xl {
			font-size: 2.25rem;
		}

		.xl\\:font-size-5xl {
			font-size: 3rem;
		}

		.xl\\:font-size-6xl {
			font-size: 4rem;
		}
	}

	.normal {
		font-style: normal;
	}

	.italic {
		font-style: italic;
	}

	@media (width >= 576px) {
		.sm\\:normal {
			font-style: normal;
		}

		.sm\\:italic {
			font-style: italic;
		}
	}

	@media (width >= 768px) {
		.md\\:normal {
			font-style: normal;
		}

		.md\\:italic {
			font-style: italic;
		}
	}

	@media (width >= 992px) {
		.lg\\:normal {
			font-style: normal;
		}

		.lg\\:italic {
			font-style: italic;
		}
	}

	@media (width >= 1200px) {
		.xl\\:normal {
			font-style: normal;
		}

		.xl\\:italic {
			font-style: italic;
		}
	}

	.font-hairline {
		font-weight: 100;
	}

	.font-thin {
		font-weight: 200;
	}

	.font-light {
		font-weight: 300;
	}

	.font-normal {
		font-weight: 400;
	}

	.font-medium {
		font-weight: 500;
	}

	.font-semibold {
		font-weight: 600;
	}

	.font-bold {
		font-weight: 700;
	}

	.font-extrabold {
		font-weight: 800;
	}

	.font-black {
		font-weight: 900;
	}

	@media (width >= 576px) {
		.sm\\:font-hairline {
			font-weight: 100;
		}

		.sm\\:font-thin {
			font-weight: 200;
		}

		.sm\\:font-light {
			font-weight: 300;
		}

		.sm\\:font-normal {
			font-weight: 400;
		}

		.sm\\:font-medium {
			font-weight: 500;
		}

		.sm\\:font-semibold {
			font-weight: 600;
		}

		.sm\\:font-bold {
			font-weight: 700;
		}

		.sm\\:font-extrabold {
			font-weight: 800;
		}

		.sm\\:font-black {
			font-weight: 900;
		}
	}

	@media (width >= 768px) {
		.md\\:font-hairline {
			font-weight: 100;
		}

		.md\\:font-thin {
			font-weight: 200;
		}

		.md\\:font-light {
			font-weight: 300;
		}

		.md\\:font-normal {
			font-weight: 400;
		}

		.md\\:font-medium {
			font-weight: 500;
		}

		.md\\:font-semibold {
			font-weight: 600;
		}

		.md\\:font-bold {
			font-weight: 700;
		}

		.md\\:font-extrabold {
			font-weight: 800;
		}

		.md\\:font-black {
			font-weight: 900;
		}
	}

	@media (width >= 992px) {
		.lg\\:font-hairline {
			font-weight: 100;
		}

		.lg\\:font-thin {
			font-weight: 200;
		}

		.lg\\:font-light {
			font-weight: 300;
		}

		.lg\\:font-normal {
			font-weight: 400;
		}

		.lg\\:font-medium {
			font-weight: 500;
		}

		.lg\\:font-semibold {
			font-weight: 600;
		}

		.lg\\:font-bold {
			font-weight: 700;
		}

		.lg\\:font-extrabold {
			font-weight: 800;
		}

		.lg\\:font-black {
			font-weight: 900;
		}
	}

	@media (width >= 1200px) {
		.xl\\:font-hairline {
			font-weight: 100;
		}

		.xl\\:font-thin {
			font-weight: 200;
		}

		.xl\\:font-light {
			font-weight: 300;
		}

		.xl\\:font-normal {
			font-weight: 400;
		}

		.xl\\:font-medium {
			font-weight: 500;
		}

		.xl\\:font-semibold {
			font-weight: 600;
		}

		.xl\\:font-bold {
			font-weight: 700;
		}

		.xl\\:font-extrabold {
			font-weight: 800;
		}

		.xl\\:font-black {
			font-weight: 900;
		}
	}

	.tracking-tighter {
		letter-spacing: -0.05em;
	}

	.tracking-tight {
		letter-spacing: -0.025em;
	}

	.tracking-normal {
		letter-spacing: 0;
	}

	.tracking-wide {
		letter-spacing: 0.025em;
	}

	.tracking-wider {
		letter-spacing: 0.05em;
	}

	@media (width >= 576px) {
		.sm\\:tracking-tighter {
			letter-spacing: -0.05em;
		}

		.sm\\:tracking-tight {
			letter-spacing: -0.025em;
		}

		.sm\\:tracking-normal {
			letter-spacing: 0;
		}

		.sm\\:tracking-wide {
			letter-spacing: 0.025em;
		}

		.sm\\:tracking-wider {
			letter-spacing: 0.05em;
		}
	}

	@media (width >= 768px) {
		.md\\:tracking-tighter {
			letter-spacing: -0.05em;
		}

		.md\\:tracking-tight {
			letter-spacing: -0.025em;
		}

		.md\\:tracking-normal {
			letter-spacing: 0;
		}

		.md\\:tracking-wide {
			letter-spacing: 0.025em;
		}

		.md\\:tracking-wider {
			letter-spacing: 0.05em;
		}
	}

	@media (width >= 992px) {
		.lg\\:tracking-tighter {
			letter-spacing: -0.05em;
		}

		.lg\\:tracking-tight {
			letter-spacing: -0.025em;
		}

		.lg\\:tracking-normal {
			letter-spacing: 0;
		}

		.lg\\:tracking-wide {
			letter-spacing: 0.025em;
		}

		.lg\\:tracking-wider {
			letter-spacing: 0.05em;
		}
	}

	@media (width >= 1200px) {
		.xl\\:tracking-tighter {
			letter-spacing: -0.05em;
		}

		.xl\\:tracking-tight {
			letter-spacing: -0.025em;
		}

		.xl\\:tracking-normal {
			letter-spacing: 0;
		}

		.xl\\:tracking-wide {
			letter-spacing: 0.025em;
		}

		.xl\\:tracking-wider {
			letter-spacing: 0.05em;
		}
	}

	.line-height-1 {
		line-height: 1;
	}

	.line-height-tight {
		line-height: 1.25;
	}

	.line-height-snug {
		line-height: 1.375;
	}

	.line-height-normal {
		line-height: 1.5;
	}

	.line-height-relaxed {
		line-height: 1.625;
	}

	.line-height-wide {
		line-height: 2;
	}

	.list-none {
		list-style-type: none;
	}

	.list-disc {
		list-style-type: disc;
	}

	.list-decimal {
		list-style-type: decimal;
	}

	.list-square {
		list-style-type: square;
	}

	.list-inside {
		list-style-position: inside;
	}

	.list-outside {
		list-style-position: outside;
	}

	.text-left {
		text-align: left;
	}

	.text-right {
		text-align: right;
	}

	.text-center {
		text-align: center;
	}

	.text-justify {
		text-align: justify;
	}

	@media (width >= 576px) {
		.sm\\:text-left {
			text-align: left;
		}

		.sm\\:text-right {
			text-align: right;
		}

		.sm\\:text-center {
			text-align: center;
		}

		.sm\\:text-justify {
			text-align: justify;
		}
	}

	@media (width >= 768px) {
		.md\\:text-left {
			text-align: left;
		}

		.md\\:text-right {
			text-align: right;
		}

		.md\\:text-center {
			text-align: center;
		}

		.md\\:text-justify {
			text-align: justify;
		}
	}

	@media (width >= 992px) {
		.lg\\:text-left {
			text-align: left;
		}

		.lg\\:text-right {
			text-align: right;
		}

		.lg\\:text-center {
			text-align: center;
		}

		.lg\\:text-justify {
			text-align: justify;
		}
	}

	@media (width >= 1200px) {
		.xl\\:text-left {
			text-align: left;
		}

		.xl\\:text-right {
			text-align: right;
		}

		.xl\\:text-center {
			text-align: center;
		}

		.xl\\:text-justify {
			text-align: justify;
		}
	}

	.underline {
		text-decoration: underline;
	}

	.line-through {
		text-decoration: line-through;
	}

	.no-underline {
		text-decoration: none;
	}

	.hover\\:underline:hover {
		text-decoration: underline;
	}

	.hover\\:line-through:hover {
		text-decoration: line-through;
	}

	.hover\\:no-underline:hover {
		text-decoration: none;
	}

	.lowercase {
		text-transform: lowercase;
	}

	.uppercase {
		text-transform: uppercase;
	}

	.capitalize {
		text-transform: capitalize;
	}

	.normal-case {
		text-transform: none;
	}

	@media (width >= 576px) {
		.sm\\:lowercase {
			text-transform: lowercase;
		}

		.sm\\:uppercase {
			text-transform: uppercase;
		}

		.sm\\:capitalize {
			text-transform: capitalize;
		}

		.sm\\:normal-case {
			text-transform: none;
		}
	}

	@media (width >= 768px) {
		.md\\:lowercase {
			text-transform: lowercase;
		}

		.md\\:uppercase {
			text-transform: uppercase;
		}

		.md\\:capitalize {
			text-transform: capitalize;
		}

		.md\\:normal-case {
			text-transform: none;
		}
	}

	@media (width >= 992px) {
		.lg\\:lowercase {
			text-transform: lowercase;
		}

		.lg\\:uppercase {
			text-transform: uppercase;
		}

		.lg\\:capitalize {
			text-transform: capitalize;
		}

		.lg\\:normal-case {
			text-transform: none;
		}
	}

	@media (width >= 1200px) {
		.xl\\:lowercase {
			text-transform: lowercase;
		}

		.xl\\:uppercase {
			text-transform: uppercase;
		}

		.xl\\:capitalize {
			text-transform: capitalize;
		}

		.xl\\:normal-case {
			text-transform: none;
		}
	}

	.align-baseline {
		vertical-align: baseline;
	}

	.align-top {
		vertical-align: top;
	}

	.align-middle {
		vertical-align: middle;
	}

	.align-bottom {
		vertical-align: bottom;
	}

	.align-text-top {
		vertical-align: text-top;
	}

	.align-text-bottom {
		vertical-align: text-bottom;
	}

	@media (width >= 576px) {
		.sm\\:align-baseline {
			vertical-align: baseline;
		}

		.sm\\:align-top {
			vertical-align: top;
		}

		.sm\\:align-middle {
			vertical-align: middle;
		}

		.sm\\:align-bottom {
			vertical-align: bottom;
		}

		.sm\\:align-text-top {
			vertical-align: text-top;
		}

		.sm\\:align-text-bottom {
			vertical-align: text-bottom;
		}
	}

	@media (width >= 768px) {
		.md\\:align-baseline {
			vertical-align: baseline;
		}

		.md\\:align-top {
			vertical-align: top;
		}

		.md\\:align-middle {
			vertical-align: middle;
		}

		.md\\:align-bottom {
			vertical-align: bottom;
		}

		.md\\:align-text-top {
			vertical-align: text-top;
		}

		.md\\:align-text-bottom {
			vertical-align: text-bottom;
		}
	}

	@media (width >= 992px) {
		.lg\\:align-baseline {
			vertical-align: baseline;
		}

		.lg\\:align-top {
			vertical-align: top;
		}

		.lg\\:align-middle {
			vertical-align: middle;
		}

		.lg\\:align-bottom {
			vertical-align: bottom;
		}

		.lg\\:align-text-top {
			vertical-align: text-top;
		}

		.lg\\:align-text-bottom {
			vertical-align: text-bottom;
		}
	}

	@media (width >= 1200px) {
		.xl\\:align-baseline {
			vertical-align: baseline;
		}

		.xl\\:align-top {
			vertical-align: top;
		}

		.xl\\:align-middle {
			vertical-align: middle;
		}

		.xl\\:align-bottom {
			vertical-align: bottom;
		}

		.xl\\:align-text-top {
			vertical-align: text-top;
		}

		.xl\\:align-text-bottom {
			vertical-align: text-bottom;
		}
	}

	.white-space-normal {
		white-space: normal;
	}

	.white-space-no-wrap {
		white-space: nowrap;
	}

	.white-space-pre {
		white-space: pre;
	}

	.white-space-pre-line {
		white-space: pre-line;
	}

	.white-space-pre-wrap {
		white-space: pre-wrap;
	}

	.break-normal {
		word-break: normal;
	}

	.break-words {
		word-wrap: break-word;
	}

	.break-spaces {
		word-wrap: break-spaces;
	}

	.break-all {
		word-break: break-all;
	}

	.truncate {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.text-hide {
		border: 0;
		background-color: transparent;
		color: transparent;
		font: 0/0 a;
		text-shadow: none;
	}

	.ratio {
		position: relative;
		height: 0;
	}

	.ratio iframe {
		position: absolute;
		top: 0;
		left: 0;
		z-index: 97;
		width: 100%;
		height: 100%;
	}

	.ratio-1-1 {
		padding-bottom: 100%;
	}

	.ratio-16-9 {
		padding-bottom: 56.25%;
	}

	.ratio-4-3 {
		padding-bottom: 75%;
	}

	.block {
		display: block !important;
	}

	.inline-block {
		display: inline-block !important;
	}

	.inline {
		display: inline !important;
	}

	.table,
	.content table:not([class*='table']) {
		display: table !important;
	}

	.table-header-group {
		display: table-header-group !important;
	}

	.table-row {
		display: table-row !important;
	}

	.table-cell {
		display: table-cell !important;
	}

	.flex {
		display: flex !important;
	}

	.inline-flex {
		display: inline-flex !important;
	}

	.hidden {
		display: none !important;
	}

	.empty\\:hidden:empty {
		display: none;
	}

	@media (width >= 576px) {
		.sm\\:block {
			display: block !important;
		}

		.sm\\:inline-block {
			display: inline-block !important;
		}

		.sm\\:inline {
			display: inline !important;
		}

		.sm\\:table {
			display: table !important;
		}

		.sm\\:table-header-group {
			display: table-header-group !important;
		}

		.sm\\:table-row {
			display: table-row !important;
		}

		.sm\\:table-cell {
			display: table-cell !important;
		}

		.sm\\:flex {
			display: flex !important;
		}

		.sm\\:inline-flex {
			display: inline-flex !important;
		}

		.sm\\:hidden {
			display: none !important;
		}
	}

	@media (width >= 768px) {
		.md\\:block {
			display: block !important;
		}

		.md\\:inline-block {
			display: inline-block !important;
		}

		.md\\:inline {
			display: inline !important;
		}

		.md\\:table {
			display: table !important;
		}

		.md\\:table-header-group {
			display: table-header-group !important;
		}

		.md\\:table-row {
			display: table-row !important;
		}

		.md\\:table-cell {
			display: table-cell !important;
		}

		.md\\:flex {
			display: flex !important;
		}

		.md\\:inline-flex {
			display: inline-flex !important;
		}

		.md\\:hidden {
			display: none !important;
		}
	}

	@media (width >= 992px) {
		.lg\\:block {
			display: block !important;
		}

		.lg\\:inline-block {
			display: inline-block !important;
		}

		.lg\\:inline {
			display: inline !important;
		}

		.lg\\:table {
			display: table !important;
		}

		.lg\\:table-header-group {
			display: table-header-group !important;
		}

		.lg\\:table-row {
			display: table-row !important;
		}

		.lg\\:table-cell {
			display: table-cell !important;
		}

		.lg\\:flex {
			display: flex !important;
		}

		.lg\\:inline-flex {
			display: inline-flex !important;
		}

		.lg\\:hidden {
			display: none !important;
		}
	}

	@media (width >= 1200px) {
		.xl\\:block {
			display: block !important;
		}

		.xl\\:inline-block {
			display: inline-block !important;
		}

		.xl\\:inline {
			display: inline !important;
		}

		.xl\\:table {
			display: table !important;
		}

		.xl\\:table-header-group {
			display: table-header-group !important;
		}

		.xl\\:table-row {
			display: table-row !important;
		}

		.xl\\:table-cell {
			display: table-cell !important;
		}

		.xl\\:flex {
			display: flex !important;
		}

		.xl\\:inline-flex {
			display: inline-flex !important;
		}

		.xl\\:hidden {
			display: none !important;
		}
	}

	.float-left {
		float: left;
	}

	.float-right {
		float: right;
	}

	.float-none {
		float: none;
	}

	.clearfix::after {
		display: block;
		clear: both;
		content: '';
	}

	@media (width >= 576px) {
		.sm\\:float-left {
			float: left;
		}

		.sm\\:float-right {
			float: right;
		}

		.sm\\:float-none {
			float: none;
		}

		.sm\\:clearfix::after {
			display: block;
			clear: both;
			content: '';
		}
	}

	@media (width >= 768px) {
		.md\\:float-left {
			float: left;
		}

		.md\\:float-right {
			float: right;
		}

		.md\\:float-none {
			float: none;
		}

		.md\\:clearfix::after {
			display: block;
			clear: both;
			content: '';
		}
	}

	@media (width >= 992px) {
		.lg\\:float-left {
			float: left;
		}

		.lg\\:float-right {
			float: right;
		}

		.lg\\:float-none {
			float: none;
		}

		.lg\\:clearfix::after {
			display: block;
			clear: both;
			content: '';
		}
	}

	@media (width >= 1200px) {
		.xl\\:float-left {
			float: left;
		}

		.xl\\:float-right {
			float: right;
		}

		.xl\\:float-none {
			float: none;
		}

		.xl\\:clearfix::after {
			display: block;
			clear: both;
			content: '';
		}
	}

	.overflow-auto {
		overflow: auto;
	}

	.overflow-hidden {
		overflow: hidden;
	}

	.overflow-visible {
		overflow: visible;
	}

	.overflow-scroll {
		overflow: scroll;
	}

	.overflow-x-auto {
		overflow-x: auto;
	}

	.overflow-y-auto {
		overflow-y: auto;
	}

	.overflow-x-hidden {
		overflow-x: hidden;
	}

	.overflow-y-hidden {
		overflow-y: hidden;
	}

	.overflow-x-visible {
		overflow-x: visible;
	}

	.overflow-y-visible {
		overflow-y: visible;
	}

	.overflow-x-scroll {
		overflow-x: scroll;
	}

	.overflow-y-scroll {
		overflow-y: scroll;
	}

	.scrolling-touch {
		-webkit-overflow-scrolling: touch;
	}

	.scrolling-auto {
		-webkit-overflow-scrolling: auto;
	}

	@media (width >= 576px) {
		.sm\\:overflow-auto {
			overflow: auto;
		}

		.sm\\:overflow-hidden {
			overflow: hidden;
		}

		.sm\\:overflow-visible {
			overflow: visible;
		}

		.sm\\:overflow-scroll {
			overflow: scroll;
		}

		.sm\\:overflow-x-auto {
			overflow-x: auto;
		}

		.sm\\:overflow-y-auto {
			overflow-y: auto;
		}

		.sm\\:overflow-x-hidden {
			overflow-x: hidden;
		}

		.sm\\:overflow-y-hidden {
			overflow-y: hidden;
		}

		.sm\\:overflow-x-visible {
			overflow-x: visible;
		}

		.sm\\:overflow-y-visible {
			overflow-y: visible;
		}

		.sm\\:overflow-x-scroll {
			overflow-x: scroll;
		}

		.sm\\:overflow-y-scroll {
			overflow-y: scroll;
		}

		.sm\\:scrolling-touch {
			-webkit-overflow-scrolling: touch;
		}

		.sm\\:scrolling-auto {
			-webkit-overflow-scrolling: auto;
		}
	}

	@media (width >= 768px) {
		.md\\:overflow-auto {
			overflow: auto;
		}

		.md\\:overflow-hidden {
			overflow: hidden;
		}

		.md\\:overflow-visible {
			overflow: visible;
		}

		.md\\:overflow-scroll {
			overflow: scroll;
		}

		.md\\:overflow-x-auto {
			overflow-x: auto;
		}

		.md\\:overflow-y-auto {
			overflow-y: auto;
		}

		.md\\:overflow-x-hidden {
			overflow-x: hidden;
		}

		.md\\:overflow-y-hidden {
			overflow-y: hidden;
		}

		.md\\:overflow-x-visible {
			overflow-x: visible;
		}

		.md\\:overflow-y-visible {
			overflow-y: visible;
		}

		.md\\:overflow-x-scroll {
			overflow-x: scroll;
		}

		.md\\:overflow-y-scroll {
			overflow-y: scroll;
		}

		.md\\:scrolling-touch {
			-webkit-overflow-scrolling: touch;
		}

		.md\\:scrolling-auto {
			-webkit-overflow-scrolling: auto;
		}
	}

	@media (width >= 992px) {
		.lg\\:overflow-auto {
			overflow: auto;
		}

		.lg\\:overflow-hidden {
			overflow: hidden;
		}

		.lg\\:overflow-visible {
			overflow: visible;
		}

		.lg\\:overflow-scroll {
			overflow: scroll;
		}

		.lg\\:overflow-x-auto {
			overflow-x: auto;
		}

		.lg\\:overflow-y-auto {
			overflow-y: auto;
		}

		.lg\\:overflow-x-hidden {
			overflow-x: hidden;
		}

		.lg\\:overflow-y-hidden {
			overflow-y: hidden;
		}

		.lg\\:overflow-x-visible {
			overflow-x: visible;
		}

		.lg\\:overflow-y-visible {
			overflow-y: visible;
		}

		.lg\\:overflow-x-scroll {
			overflow-x: scroll;
		}

		.lg\\:overflow-y-scroll {
			overflow-y: scroll;
		}

		.lg\\:scrolling-touch {
			-webkit-overflow-scrolling: touch;
		}

		.lg\\:scrolling-auto {
			-webkit-overflow-scrolling: auto;
		}
	}

	@media (width >= 1200px) {
		.xl\\:overflow-auto {
			overflow: auto;
		}

		.xl\\:overflow-hidden {
			overflow: hidden;
		}

		.xl\\:overflow-visible {
			overflow: visible;
		}

		.xl\\:overflow-scroll {
			overflow: scroll;
		}

		.xl\\:overflow-x-auto {
			overflow-x: auto;
		}

		.xl\\:overflow-y-auto {
			overflow-y: auto;
		}

		.xl\\:overflow-x-hidden {
			overflow-x: hidden;
		}

		.xl\\:overflow-y-hidden {
			overflow-y: hidden;
		}

		.xl\\:overflow-x-visible {
			overflow-x: visible;
		}

		.xl\\:overflow-y-visible {
			overflow-y: visible;
		}

		.xl\\:overflow-x-scroll {
			overflow-x: scroll;
		}

		.xl\\:overflow-y-scroll {
			overflow-y: scroll;
		}

		.xl\\:scrolling-touch {
			-webkit-overflow-scrolling: touch;
		}

		.xl\\:scrolling-auto {
			-webkit-overflow-scrolling: auto;
		}
	}

	@media (width <= 575.98px) {
		.sm\\:scroll-x {
			display: block;
			width: 100%;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			-ms-overflow-style: none;
			scrollbar-width: none;
		}

		.sm\\:scroll-x::-webkit-scrollbar {
			display: none;
		}
	}

	@media (width <= 767.98px) {
		.md\\:scroll-x {
			display: block;
			width: 100%;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			-ms-overflow-style: none;
			scrollbar-width: none;
		}

		.md\\:scroll-x::-webkit-scrollbar {
			display: none;
		}
	}

	@media (width <= 991.98px) {
		.lg\\:scroll-x {
			display: block;
			width: 100%;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			-ms-overflow-style: none;
			scrollbar-width: none;
		}

		.lg\\:scroll-x::-webkit-scrollbar {
			display: none;
		}
	}

	@media (width <= 1199.98px) {
		.xl\\:scroll-x {
			display: block;
			width: 100%;
			overflow-x: auto;
			-webkit-overflow-scrolling: touch;
			-ms-overflow-style: none;
			scrollbar-width: none;
		}

		.xl\\:scroll-x::-webkit-scrollbar {
			display: none;
		}
	}

	.scroll-x {
		display: block;
		width: 100%;
		overflow-x: auto;
		-webkit-overflow-scrolling: touch;
		-ms-overflow-style: none;
		scrollbar-width: none;
	}

	.scroll-x::-webkit-scrollbar {
		display: none;
	}

	.static {
		position: static;
	}

	.relative {
		position: relative;
	}

	.absolute {
		position: absolute;
	}

	.fixed {
		position: fixed;
	}

	.sticky {
		position: sticky;
	}

	.initial {
		position: initial;
	}

	.absolute-top {
		position: absolute;
		top: 0;
		right: 0;
		left: 0;
		z-index: 97;
	}

	.absolute-center {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate3d(-50%, -50%, 0);
		z-index: 97;
	}

	.fixed-top {
		position: fixed;
		top: 0;
		right: 0;
		left: 0;
		z-index: 97;
	}

	.fixed-bottom {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 97;
	}

	.sticky-top {
		position: sticky;
		top: 0;
		z-index: 98;
	}

	@media (width >= 576px) {
		.sm\\:static {
			position: static;
		}

		.sm\\:relative {
			position: relative;
		}

		.sm\\:absolute {
			position: absolute;
		}

		.sm\\:fixed {
			position: fixed;
		}

		.sm\\:sticky {
			position: sticky;
		}

		.sm\\:initial {
			position: initial;
		}

		.sm\\:absolute-top {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			z-index: 97;
		}

		.sm\\:absolute-center {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
			z-index: 97;
		}

		.sm\\:fixed-top {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			z-index: 97;
		}

		.sm\\:fixed-bottom {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 97;
		}

		.sm\\:sticky-top {
			position: sticky;
			top: 0;
			z-index: 98;
		}
	}

	@media (width >= 768px) {
		.md\\:static {
			position: static;
		}

		.md\\:relative {
			position: relative;
		}

		.md\\:absolute {
			position: absolute;
		}

		.md\\:fixed {
			position: fixed;
		}

		.md\\:sticky {
			position: sticky;
		}

		.md\\:initial {
			position: initial;
		}

		.md\\:absolute-top {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			z-index: 97;
		}

		.md\\:absolute-center {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
			z-index: 97;
		}

		.md\\:fixed-top {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			z-index: 97;
		}

		.md\\:fixed-bottom {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 97;
		}

		.md\\:sticky-top {
			position: sticky;
			top: 0;
			z-index: 98;
		}
	}

	@media (width >= 992px) {
		.lg\\:static {
			position: static;
		}

		.lg\\:relative {
			position: relative;
		}

		.lg\\:absolute {
			position: absolute;
		}

		.lg\\:fixed {
			position: fixed;
		}

		.lg\\:sticky {
			position: sticky;
		}

		.lg\\:initial {
			position: initial;
		}

		.lg\\:absolute-top {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			z-index: 97;
		}

		.lg\\:absolute-center {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
			z-index: 97;
		}

		.lg\\:fixed-top {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			z-index: 97;
		}

		.lg\\:fixed-bottom {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 97;
		}

		.lg\\:sticky-top {
			position: sticky;
			top: 0;
			z-index: 98;
		}
	}

	@media (width >= 1200px) {
		.xl\\:static {
			position: static;
		}

		.xl\\:relative {
			position: relative;
		}

		.xl\\:absolute {
			position: absolute;
		}

		.xl\\:fixed {
			position: fixed;
		}

		.xl\\:sticky {
			position: sticky;
		}

		.xl\\:initial {
			position: initial;
		}

		.xl\\:absolute-top {
			position: absolute;
			top: 0;
			right: 0;
			left: 0;
			z-index: 97;
		}

		.xl\\:absolute-center {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate3d(-50%, -50%, 0);
			z-index: 97;
		}

		.xl\\:fixed-top {
			position: fixed;
			top: 0;
			right: 0;
			left: 0;
			z-index: 97;
		}

		.xl\\:fixed-bottom {
			position: fixed;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 97;
		}

		.xl\\:sticky-top {
			position: sticky;
			top: 0;
			z-index: 98;
		}
	}

	.top-0 {
		top: 0;
	}

	.bottom-0 {
		bottom: 0;
	}

	.left-0 {
		left: 0;
	}

	.right-0 {
		right: 0;
	}

	.top-auto {
		top: auto;
	}

	.bottom-auto {
		bottom: auto;
	}

	.left-auto {
		left: auto;
	}

	.right-auto {
		right: auto;
	}

	@media (width >= 576px) {
		.sm\\:top-0 {
			top: 0;
		}

		.sm\\:bottom-0 {
			bottom: 0;
		}

		.sm\\:left-0 {
			left: 0;
		}

		.sm\\:right-0 {
			right: 0;
		}

		.sm\\:top-auto {
			top: auto;
		}

		.sm\\:bottom-auto {
			bottom: auto;
		}

		.sm\\:left-auto {
			left: auto;
		}

		.sm\\:right-auto {
			right: auto;
		}
	}

	@media (width >= 768px) {
		.md\\:top-0 {
			top: 0;
		}

		.md\\:bottom-0 {
			bottom: 0;
		}

		.md\\:left-0 {
			left: 0;
		}

		.md\\:right-0 {
			right: 0;
		}

		.md\\:top-auto {
			top: auto;
		}

		.md\\:bottom-auto {
			bottom: auto;
		}

		.md\\:left-auto {
			left: auto;
		}

		.md\\:right-auto {
			right: auto;
		}
	}

	@media (width >= 992px) {
		.lg\\:top-0 {
			top: 0;
		}

		.lg\\:bottom-0 {
			bottom: 0;
		}

		.lg\\:left-0 {
			left: 0;
		}

		.lg\\:right-0 {
			right: 0;
		}

		.lg\\:top-auto {
			top: auto;
		}

		.lg\\:bottom-auto {
			bottom: auto;
		}

		.lg\\:left-auto {
			left: auto;
		}

		.lg\\:right-auto {
			right: auto;
		}
	}

	@media (width >= 1200px) {
		.xl\\:top-0 {
			top: 0;
		}

		.xl\\:bottom-0 {
			bottom: 0;
		}

		.xl\\:left-0 {
			left: 0;
		}

		.xl\\:right-0 {
			right: 0;
		}

		.xl\\:top-auto {
			top: auto;
		}

		.xl\\:bottom-auto {
			bottom: auto;
		}

		.xl\\:left-auto {
			left: auto;
		}

		.xl\\:right-auto {
			right: auto;
		}
	}

	.visible {
		visibility: visible;
	}

	.invisible {
		visibility: hidden;
	}

	@media (width >= 576px) {
		.sm\\:visible {
			visibility: visible;
		}

		.sm\\:invisible {
			visibility: hidden;
		}
	}

	@media (width >= 768px) {
		.md\\:visible {
			visibility: visible;
		}

		.md\\:invisible {
			visibility: hidden;
		}
	}

	@media (width >= 992px) {
		.lg\\:visible {
			visibility: visible;
		}

		.lg\\:invisible {
			visibility: hidden;
		}
	}

	@media (width >= 1200px) {
		.xl\\:visible {
			visibility: visible;
		}

		.xl\\:invisible {
			visibility: hidden;
		}
	}

	.z-0 {
		z-index: 0;
	}

	.z-10 {
		z-index: 10;
	}

	.z-20 {
		z-index: 20;
	}

	.z-30 {
		z-index: 30;
	}

	.z-40 {
		z-index: 40;
	}

	.z-50 {
		z-index: 50;
	}

	.z-auto {
		z-index: auto;
	}

	.z-fixed {
		z-index: 97;
	}

	.z-sticky {
		z-index: 98;
	}

	.bg-fixed {
		background-attachment: fixed;
	}

	.bg-local {
		background-attachment: local;
	}

	.bg-scroll {
		background-attachment: scroll;
	}

	.bg-inherit {
		background-color: inherit;
	}

	.bg-transparent {
		background-color: transparent;
	}

	.bg-black {
		background-color: #000000;
	}

	.bg-white {
		background-color: #ffffff;
	}

	.bg-translucent {
		background-color: rgb(255 255 255 / 10%);
	}

	.bg-gray-100 {
		background-color: #f1f1f1;
	}

	.bg-gray-200 {
		background-color: #f1f1f1;
	}

	.bg-gray-300 {
		background-color: #e2e8f0;
	}

	.bg-gray-400 {
		background-color: #cbd5e0;
	}

	.bg-gray-500 {
		background-color: #a0aec0;
	}

	.bg-gray-600 {
		background-color: #777779;
	}

	.bg-gray-700 {
		background-color: #4a5568;
	}

	.bg-gray-800 {
		background-color: #2d3748;
	}

	.bg-gray-900 {
		background-color: #1a202c;
	}

	.bg-red-100 {
		background-color: #fff5f5;
	}

	.bg-red-300 {
		background-color: #feb2b2;
	}

	.bg-red-500 {
		background-color: #f56565;
	}

	.bg-red-700 {
		background-color: #c53030;
	}

	.bg-red-900 {
		background-color: #742a2a;
	}

	.bg-orange-100 {
		background-color: #fffaf0;
	}

	.bg-orange-300 {
		background-color: #fbd38d;
	}

	.bg-orange-500 {
		background-color: #ed8936;
	}

	.bg-orange-700 {
		background-color: #c05621;
	}

	.bg-orange-900 {
		background-color: #7b341e;
	}

	.bg-green-100 {
		background-color: #f0fff4;
	}

	.bg-green-300 {
		background-color: #9ae6b4;
	}

	.bg-green-500 {
		background-color: #48bb78;
	}

	.bg-green-700 {
		background-color: #2f855a;
	}

	.bg-green-900 {
		background-color: #22543d;
	}

	.bg-primary {
		background-color: #002e6c;
	}

	.bg-primary-inverse {
		background-color: #ffffff;
	}

	.hover\\:bg-inherit:hover {
		background-color: inherit;
	}

	.hover\\:bg-transparent:hover {
		background-color: transparent;
	}

	.hover\\:bg-black:hover {
		background-color: #000000;
	}

	.hover\\:bg-white:hover {
		background-color: #ffffff;
	}

	.hover\\:bg-translucent:hover {
		background-color: rgb(255 255 255 / 10%);
	}

	.hover\\:bg-gray-100:hover {
		background-color: #f1f1f1;
	}

	.hover\\:bg-gray-200:hover {
		background-color: #f1f1f1;
	}

	.hover\\:bg-gray-300:hover {
		background-color: #e2e8f0;
	}

	.hover\\:bg-gray-400:hover {
		background-color: #cbd5e0;
	}

	.hover\\:bg-gray-500:hover {
		background-color: #a0aec0;
	}

	.hover\\:bg-gray-600:hover {
		background-color: #777779;
	}

	.hover\\:bg-gray-700:hover {
		background-color: #4a5568;
	}

	.hover\\:bg-gray-800:hover {
		background-color: #2d3748;
	}

	.hover\\:bg-gray-900:hover {
		background-color: #1a202c;
	}

	.hover\\:bg-red-100:hover {
		background-color: #fff5f5;
	}

	.hover\\:bg-red-300:hover {
		background-color: #feb2b2;
	}

	.hover\\:bg-red-500:hover {
		background-color: #f56565;
	}

	.hover\\:bg-red-700:hover {
		background-color: #c53030;
	}

	.hover\\:bg-red-900:hover {
		background-color: #742a2a;
	}

	.hover\\:bg-orange-100:hover {
		background-color: #fffaf0;
	}

	.hover\\:bg-orange-300:hover {
		background-color: #fbd38d;
	}

	.hover\\:bg-orange-500:hover {
		background-color: #ed8936;
	}

	.hover\\:bg-orange-700:hover {
		background-color: #c05621;
	}

	.hover\\:bg-orange-900:hover {
		background-color: #7b341e;
	}

	.hover\\:bg-green-100:hover {
		background-color: #f0fff4;
	}

	.hover\\:bg-green-300:hover {
		background-color: #9ae6b4;
	}

	.hover\\:bg-green-500:hover {
		background-color: #48bb78;
	}

	.hover\\:bg-green-700:hover {
		background-color: #2f855a;
	}

	.hover\\:bg-green-900:hover {
		background-color: #22543d;
	}

	.hover\\:bg-primary:hover {
		background-color: #002e6c;
	}

	.hover\\:bg-primary-inverse:hover {
		background-color: #ffffff;
	}

	@media (width >= 576px) {
		.sm\\:bg-inherit {
			background-color: inherit;
		}

		.sm\\:bg-transparent {
			background-color: transparent;
		}

		.sm\\:bg-black {
			background-color: #000000;
		}

		.sm\\:bg-white {
			background-color: #ffffff;
		}

		.sm\\:bg-translucent {
			background-color: rgb(255 255 255 / 10%);
		}

		.sm\\:bg-gray-100 {
			background-color: #f1f1f1;
		}

		.sm\\:bg-gray-200 {
			background-color: #f1f1f1;
		}

		.sm\\:bg-gray-300 {
			background-color: #e2e8f0;
		}

		.sm\\:bg-gray-400 {
			background-color: #cbd5e0;
		}

		.sm\\:bg-gray-500 {
			background-color: #a0aec0;
		}

		.sm\\:bg-gray-600 {
			background-color: #777779;
		}

		.sm\\:bg-gray-700 {
			background-color: #4a5568;
		}

		.sm\\:bg-gray-800 {
			background-color: #2d3748;
		}

		.sm\\:bg-gray-900 {
			background-color: #1a202c;
		}

		.sm\\:bg-red-100 {
			background-color: #fff5f5;
		}

		.sm\\:bg-red-300 {
			background-color: #feb2b2;
		}

		.sm\\:bg-red-500 {
			background-color: #f56565;
		}

		.sm\\:bg-red-700 {
			background-color: #c53030;
		}

		.sm\\:bg-red-900 {
			background-color: #742a2a;
		}

		.sm\\:bg-orange-100 {
			background-color: #fffaf0;
		}

		.sm\\:bg-orange-300 {
			background-color: #fbd38d;
		}

		.sm\\:bg-orange-500 {
			background-color: #ed8936;
		}

		.sm\\:bg-orange-700 {
			background-color: #c05621;
		}

		.sm\\:bg-orange-900 {
			background-color: #7b341e;
		}

		.sm\\:bg-green-100 {
			background-color: #f0fff4;
		}

		.sm\\:bg-green-300 {
			background-color: #9ae6b4;
		}

		.sm\\:bg-green-500 {
			background-color: #48bb78;
		}

		.sm\\:bg-green-700 {
			background-color: #2f855a;
		}

		.sm\\:bg-green-900 {
			background-color: #22543d;
		}

		.sm\\:bg-primary {
			background-color: #002e6c;
		}

		.sm\\:bg-primary-inverse {
			background-color: #ffffff;
		}
	}

	@media (width >= 768px) {
		.md\\:bg-inherit {
			background-color: inherit;
		}

		.md\\:bg-transparent {
			background-color: transparent;
		}

		.md\\:bg-black {
			background-color: #000000;
		}

		.md\\:bg-white {
			background-color: #ffffff;
		}

		.md\\:bg-translucent {
			background-color: rgb(255 255 255 / 10%);
		}

		.md\\:bg-gray-100 {
			background-color: #f1f1f1;
		}

		.md\\:bg-gray-200 {
			background-color: #f1f1f1;
		}

		.md\\:bg-gray-300 {
			background-color: #e2e8f0;
		}

		.md\\:bg-gray-400 {
			background-color: #cbd5e0;
		}

		.md\\:bg-gray-500 {
			background-color: #a0aec0;
		}

		.md\\:bg-gray-600 {
			background-color: #777779;
		}

		.md\\:bg-gray-700 {
			background-color: #4a5568;
		}

		.md\\:bg-gray-800 {
			background-color: #2d3748;
		}

		.md\\:bg-gray-900 {
			background-color: #1a202c;
		}

		.md\\:bg-red-100 {
			background-color: #fff5f5;
		}

		.md\\:bg-red-300 {
			background-color: #feb2b2;
		}

		.md\\:bg-red-500 {
			background-color: #f56565;
		}

		.md\\:bg-red-700 {
			background-color: #c53030;
		}

		.md\\:bg-red-900 {
			background-color: #742a2a;
		}

		.md\\:bg-orange-100 {
			background-color: #fffaf0;
		}

		.md\\:bg-orange-300 {
			background-color: #fbd38d;
		}

		.md\\:bg-orange-500 {
			background-color: #ed8936;
		}

		.md\\:bg-orange-700 {
			background-color: #c05621;
		}

		.md\\:bg-orange-900 {
			background-color: #7b341e;
		}

		.md\\:bg-green-100 {
			background-color: #f0fff4;
		}

		.md\\:bg-green-300 {
			background-color: #9ae6b4;
		}

		.md\\:bg-green-500 {
			background-color: #48bb78;
		}

		.md\\:bg-green-700 {
			background-color: #2f855a;
		}

		.md\\:bg-green-900 {
			background-color: #22543d;
		}

		.md\\:bg-primary {
			background-color: #002e6c;
		}

		.md\\:bg-primary-inverse {
			background-color: #ffffff;
		}
	}

	@media (width >= 992px) {
		.lg\\:bg-inherit {
			background-color: inherit;
		}

		.lg\\:bg-transparent {
			background-color: transparent;
		}

		.lg\\:bg-black {
			background-color: #000000;
		}

		.lg\\:bg-white {
			background-color: #ffffff;
		}

		.lg\\:bg-translucent {
			background-color: rgb(255 255 255 / 10%);
		}

		.lg\\:bg-gray-100 {
			background-color: #f1f1f1;
		}

		.lg\\:bg-gray-200 {
			background-color: #f1f1f1;
		}

		.lg\\:bg-gray-300 {
			background-color: #e2e8f0;
		}

		.lg\\:bg-gray-400 {
			background-color: #cbd5e0;
		}

		.lg\\:bg-gray-500 {
			background-color: #a0aec0;
		}

		.lg\\:bg-gray-600 {
			background-color: #777779;
		}

		.lg\\:bg-gray-700 {
			background-color: #4a5568;
		}

		.lg\\:bg-gray-800 {
			background-color: #2d3748;
		}

		.lg\\:bg-gray-900 {
			background-color: #1a202c;
		}

		.lg\\:bg-red-100 {
			background-color: #fff5f5;
		}

		.lg\\:bg-red-300 {
			background-color: #feb2b2;
		}

		.lg\\:bg-red-500 {
			background-color: #f56565;
		}

		.lg\\:bg-red-700 {
			background-color: #c53030;
		}

		.lg\\:bg-red-900 {
			background-color: #742a2a;
		}

		.lg\\:bg-orange-100 {
			background-color: #fffaf0;
		}

		.lg\\:bg-orange-300 {
			background-color: #fbd38d;
		}

		.lg\\:bg-orange-500 {
			background-color: #ed8936;
		}

		.lg\\:bg-orange-700 {
			background-color: #c05621;
		}

		.lg\\:bg-orange-900 {
			background-color: #7b341e;
		}

		.lg\\:bg-green-100 {
			background-color: #f0fff4;
		}

		.lg\\:bg-green-300 {
			background-color: #9ae6b4;
		}

		.lg\\:bg-green-500 {
			background-color: #48bb78;
		}

		.lg\\:bg-green-700 {
			background-color: #2f855a;
		}

		.lg\\:bg-green-900 {
			background-color: #22543d;
		}

		.lg\\:bg-primary {
			background-color: #002e6c;
		}

		.lg\\:bg-primary-inverse {
			background-color: #ffffff;
		}
	}

	@media (width >= 1200px) {
		.xl\\:bg-inherit {
			background-color: inherit;
		}

		.xl\\:bg-transparent {
			background-color: transparent;
		}

		.xl\\:bg-black {
			background-color: #000000;
		}

		.xl\\:bg-white {
			background-color: #ffffff;
		}

		.xl\\:bg-translucent {
			background-color: rgb(255 255 255 / 10%);
		}

		.xl\\:bg-gray-100 {
			background-color: #f1f1f1;
		}

		.xl\\:bg-gray-200 {
			background-color: #f1f1f1;
		}

		.xl\\:bg-gray-300 {
			background-color: #e2e8f0;
		}

		.xl\\:bg-gray-400 {
			background-color: #cbd5e0;
		}

		.xl\\:bg-gray-500 {
			background-color: #a0aec0;
		}

		.xl\\:bg-gray-600 {
			background-color: #777779;
		}

		.xl\\:bg-gray-700 {
			background-color: #4a5568;
		}

		.xl\\:bg-gray-800 {
			background-color: #2d3748;
		}

		.xl\\:bg-gray-900 {
			background-color: #1a202c;
		}

		.xl\\:bg-red-100 {
			background-color: #fff5f5;
		}

		.xl\\:bg-red-300 {
			background-color: #feb2b2;
		}

		.xl\\:bg-red-500 {
			background-color: #f56565;
		}

		.xl\\:bg-red-700 {
			background-color: #c53030;
		}

		.xl\\:bg-red-900 {
			background-color: #742a2a;
		}

		.xl\\:bg-orange-100 {
			background-color: #fffaf0;
		}

		.xl\\:bg-orange-300 {
			background-color: #fbd38d;
		}

		.xl\\:bg-orange-500 {
			background-color: #ed8936;
		}

		.xl\\:bg-orange-700 {
			background-color: #c05621;
		}

		.xl\\:bg-orange-900 {
			background-color: #7b341e;
		}

		.xl\\:bg-green-100 {
			background-color: #f0fff4;
		}

		.xl\\:bg-green-300 {
			background-color: #9ae6b4;
		}

		.xl\\:bg-green-500 {
			background-color: #48bb78;
		}

		.xl\\:bg-green-700 {
			background-color: #2f855a;
		}

		.xl\\:bg-green-900 {
			background-color: #22543d;
		}

		.xl\\:bg-primary {
			background-color: #002e6c;
		}

		.xl\\:bg-primary-inverse {
			background-color: #ffffff;
		}
	}

	.bg-bottom {
		background-position: bottom;
	}

	.bg-center {
		background-position: center;
	}

	.bg-left {
		background-position: left;
	}

	.bg-right {
		background-position: right;
	}

	.bg-top {
		background-position: top;
	}

	.bg-left-bottom {
		background-position: left bottom;
	}

	.bg-left-top {
		background-position: left top;
	}

	.bg-right-bottom {
		background-position: right bottom;
	}

	.bg-right-top {
		background-position: right top;
	}

	@media (width >= 576px) {
		.sm\\:bg-bottom {
			background-position: bottom;
		}

		.sm\\:bg-center {
			background-position: center;
		}

		.sm\\:bg-left {
			background-position: left;
		}

		.sm\\:bg-right {
			background-position: right;
		}

		.sm\\:bg-top {
			background-position: top;
		}

		.sm\\:bg-left-bottom {
			background-position: left bottom;
		}

		.sm\\:bg-left-top {
			background-position: left top;
		}

		.sm\\:bg-right-bottom {
			background-position: right bottom;
		}

		.sm\\:bg-right-top {
			background-position: right top;
		}
	}

	@media (width >= 768px) {
		.md\\:bg-bottom {
			background-position: bottom;
		}

		.md\\:bg-center {
			background-position: center;
		}

		.md\\:bg-left {
			background-position: left;
		}

		.md\\:bg-right {
			background-position: right;
		}

		.md\\:bg-top {
			background-position: top;
		}

		.md\\:bg-left-bottom {
			background-position: left bottom;
		}

		.md\\:bg-left-top {
			background-position: left top;
		}

		.md\\:bg-right-bottom {
			background-position: right bottom;
		}

		.md\\:bg-right-top {
			background-position: right top;
		}
	}

	@media (width >= 992px) {
		.lg\\:bg-bottom {
			background-position: bottom;
		}

		.lg\\:bg-center {
			background-position: center;
		}

		.lg\\:bg-left {
			background-position: left;
		}

		.lg\\:bg-right {
			background-position: right;
		}

		.lg\\:bg-top {
			background-position: top;
		}

		.lg\\:bg-left-bottom {
			background-position: left bottom;
		}

		.lg\\:bg-left-top {
			background-position: left top;
		}

		.lg\\:bg-right-bottom {
			background-position: right bottom;
		}

		.lg\\:bg-right-top {
			background-position: right top;
		}
	}

	@media (width >= 1200px) {
		.xl\\:bg-bottom {
			background-position: bottom;
		}

		.xl\\:bg-center {
			background-position: center;
		}

		.xl\\:bg-left {
			background-position: left;
		}

		.xl\\:bg-right {
			background-position: right;
		}

		.xl\\:bg-top {
			background-position: top;
		}

		.xl\\:bg-left-bottom {
			background-position: left bottom;
		}

		.xl\\:bg-left-top {
			background-position: left top;
		}

		.xl\\:bg-right-bottom {
			background-position: right bottom;
		}

		.xl\\:bg-right-top {
			background-position: right top;
		}
	}

	.bg-repeat {
		background-repeat: repeat;
	}

	.bg-no-repeat {
		background-repeat: no-repeat;
	}

	.bg-repeat-x {
		background-repeat: repeat-x;
	}

	.bg-repeat-y {
		background-repeat: repeat-y;
	}

	@media (width >= 576px) {
		.sm\\:bg-repeat {
			background-repeat: repeat;
		}

		.sm\\:bg-no-repeat {
			background-repeat: no-repeat;
		}

		.sm\\:bg-repeat-x {
			background-repeat: repeat-x;
		}

		.sm\\:bg-repeat-y {
			background-repeat: repeat-y;
		}
	}

	@media (width >= 768px) {
		.md\\:bg-repeat {
			background-repeat: repeat;
		}

		.md\\:bg-no-repeat {
			background-repeat: no-repeat;
		}

		.md\\:bg-repeat-x {
			background-repeat: repeat-x;
		}

		.md\\:bg-repeat-y {
			background-repeat: repeat-y;
		}
	}

	@media (width >= 992px) {
		.lg\\:bg-repeat {
			background-repeat: repeat;
		}

		.lg\\:bg-no-repeat {
			background-repeat: no-repeat;
		}

		.lg\\:bg-repeat-x {
			background-repeat: repeat-x;
		}

		.lg\\:bg-repeat-y {
			background-repeat: repeat-y;
		}
	}

	@media (width >= 1200px) {
		.xl\\:bg-repeat {
			background-repeat: repeat;
		}

		.xl\\:bg-no-repeat {
			background-repeat: no-repeat;
		}

		.xl\\:bg-repeat-x {
			background-repeat: repeat-x;
		}

		.xl\\:bg-repeat-y {
			background-repeat: repeat-y;
		}
	}

	.bg-auto {
		background-size: auto;
	}

	.bg-cover {
		background-size: cover;
	}

	.bg-contain {
		background-size: contain;
	}

	@media (width >= 576px) {
		.sm\\:bg-auto {
			background-size: auto;
		}

		.sm\\:bg-cover {
			background-size: cover;
		}

		.sm\\:bg-contain {
			background-size: contain;
		}
	}

	@media (width >= 768px) {
		.md\\:bg-auto {
			background-size: auto;
		}

		.md\\:bg-cover {
			background-size: cover;
		}

		.md\\:bg-contain {
			background-size: contain;
		}
	}

	@media (width >= 992px) {
		.lg\\:bg-auto {
			background-size: auto;
		}

		.lg\\:bg-cover {
			background-size: cover;
		}

		.lg\\:bg-contain {
			background-size: contain;
		}
	}

	@media (width >= 1200px) {
		.xl\\:bg-auto {
			background-size: auto;
		}

		.xl\\:bg-cover {
			background-size: cover;
		}

		.xl\\:bg-contain {
			background-size: contain;
		}
	}

	.border {
		border: 1px solid #e2e8f0;
	}

	.border-top {
		border-top: 1px solid #e2e8f0;
	}

	.border-right {
		border-right: 1px solid #e2e8f0;
	}

	.border-bottom {
		border-bottom: 1px solid #e2e8f0;
	}

	.border-left {
		border-left: 1px solid #e2e8f0;
	}

	@media (width >= 576px) {
		.sm\\:border {
			border: 1px solid #e2e8f0;
		}

		.sm\\:border-top {
			border-top: 1px solid #e2e8f0;
		}

		.sm\\:border-right {
			border-right: 1px solid #e2e8f0;
		}

		.sm\\:border-bottom {
			border-bottom: 1px solid #e2e8f0;
		}

		.sm\\:border-left {
			border-left: 1px solid #e2e8f0;
		}
	}

	@media (width >= 768px) {
		.md\\:border {
			border: 1px solid #e2e8f0;
		}

		.md\\:border-top {
			border-top: 1px solid #e2e8f0;
		}

		.md\\:border-right {
			border-right: 1px solid #e2e8f0;
		}

		.md\\:border-bottom {
			border-bottom: 1px solid #e2e8f0;
		}

		.md\\:border-left {
			border-left: 1px solid #e2e8f0;
		}
	}

	@media (width >= 992px) {
		.lg\\:border {
			border: 1px solid #e2e8f0;
		}

		.lg\\:border-top {
			border-top: 1px solid #e2e8f0;
		}

		.lg\\:border-right {
			border-right: 1px solid #e2e8f0;
		}

		.lg\\:border-bottom {
			border-bottom: 1px solid #e2e8f0;
		}

		.lg\\:border-left {
			border-left: 1px solid #e2e8f0;
		}
	}

	@media (width >= 1200px) {
		.xl\\:border {
			border: 1px solid #e2e8f0;
		}

		.xl\\:border-top {
			border-top: 1px solid #e2e8f0;
		}

		.xl\\:border-right {
			border-right: 1px solid #e2e8f0;
		}

		.xl\\:border-bottom {
			border-bottom: 1px solid #e2e8f0;
		}

		.xl\\:border-left {
			border-left: 1px solid #e2e8f0;
		}
	}

	.border-transparent {
		border-color: transparent;
	}

	.border-current {
		border-color: currentcolor;
	}

	.border-black {
		border-color: #000000;
	}

	.border-top-black {
		border-top-color: #000000;
	}

	.border-right-black {
		border-right-color: #000000;
	}

	.border-bottom-black {
		border-bottom-color: #000000;
	}

	.border-left-black {
		border-left-color: #000000;
	}

	.border-white {
		border-color: #ffffff;
	}

	.border-top-white {
		border-top-color: #ffffff;
	}

	.border-right-white {
		border-right-color: #ffffff;
	}

	.border-bottom-white {
		border-bottom-color: #ffffff;
	}

	.border-left-white {
		border-left-color: #ffffff;
	}

	.border-translucent {
		border-color: rgb(255 255 255 / 10%);
	}

	.border-top-translucent {
		border-top-color: rgb(255 255 255 / 10%);
	}

	.border-right-translucent {
		border-right-color: rgb(255 255 255 / 10%);
	}

	.border-bottom-translucent {
		border-bottom-color: rgb(255 255 255 / 10%);
	}

	.border-left-translucent {
		border-left-color: rgb(255 255 255 / 10%);
	}

	.border-gray-100 {
		border-color: #f1f1f1;
	}

	.border-top-gray-100 {
		border-top-color: #f1f1f1;
	}

	.border-right-gray-100 {
		border-right-color: #f1f1f1;
	}

	.border-bottom-gray-100 {
		border-bottom-color: #f1f1f1;
	}

	.border-left-gray-100 {
		border-left-color: #f1f1f1;
	}

	.border-gray-200 {
		border-color: #f1f1f1;
	}

	.border-top-gray-200 {
		border-top-color: #f1f1f1;
	}

	.border-right-gray-200 {
		border-right-color: #f1f1f1;
	}

	.border-bottom-gray-200 {
		border-bottom-color: #f1f1f1;
	}

	.border-left-gray-200 {
		border-left-color: #f1f1f1;
	}

	.border-gray-300 {
		border-color: #e2e8f0;
	}

	.border-top-gray-300 {
		border-top-color: #e2e8f0;
	}

	.border-right-gray-300 {
		border-right-color: #e2e8f0;
	}

	.border-bottom-gray-300 {
		border-bottom-color: #e2e8f0;
	}

	.border-left-gray-300 {
		border-left-color: #e2e8f0;
	}

	.border-gray-400 {
		border-color: #cbd5e0;
	}

	.border-top-gray-400 {
		border-top-color: #cbd5e0;
	}

	.border-right-gray-400 {
		border-right-color: #cbd5e0;
	}

	.border-bottom-gray-400 {
		border-bottom-color: #cbd5e0;
	}

	.border-left-gray-400 {
		border-left-color: #cbd5e0;
	}

	.border-gray-500 {
		border-color: #a0aec0;
	}

	.border-top-gray-500 {
		border-top-color: #a0aec0;
	}

	.border-right-gray-500 {
		border-right-color: #a0aec0;
	}

	.border-bottom-gray-500 {
		border-bottom-color: #a0aec0;
	}

	.border-left-gray-500 {
		border-left-color: #a0aec0;
	}

	.border-gray-600 {
		border-color: #777779;
	}

	.border-top-gray-600 {
		border-top-color: #777779;
	}

	.border-right-gray-600 {
		border-right-color: #777779;
	}

	.border-bottom-gray-600 {
		border-bottom-color: #777779;
	}

	.border-left-gray-600 {
		border-left-color: #777779;
	}

	.border-gray-700 {
		border-color: #4a5568;
	}

	.border-top-gray-700 {
		border-top-color: #4a5568;
	}

	.border-right-gray-700 {
		border-right-color: #4a5568;
	}

	.border-bottom-gray-700 {
		border-bottom-color: #4a5568;
	}

	.border-left-gray-700 {
		border-left-color: #4a5568;
	}

	.border-gray-800 {
		border-color: #2d3748;
	}

	.border-top-gray-800 {
		border-top-color: #2d3748;
	}

	.border-right-gray-800 {
		border-right-color: #2d3748;
	}

	.border-bottom-gray-800 {
		border-bottom-color: #2d3748;
	}

	.border-left-gray-800 {
		border-left-color: #2d3748;
	}

	.border-gray-900 {
		border-color: #1a202c;
	}

	.border-top-gray-900 {
		border-top-color: #1a202c;
	}

	.border-right-gray-900 {
		border-right-color: #1a202c;
	}

	.border-bottom-gray-900 {
		border-bottom-color: #1a202c;
	}

	.border-left-gray-900 {
		border-left-color: #1a202c;
	}

	.border-red-100 {
		border-color: #fff5f5;
	}

	.border-top-red-100 {
		border-top-color: #fff5f5;
	}

	.border-right-red-100 {
		border-right-color: #fff5f5;
	}

	.border-bottom-red-100 {
		border-bottom-color: #fff5f5;
	}

	.border-left-red-100 {
		border-left-color: #fff5f5;
	}

	.border-red-300 {
		border-color: #feb2b2;
	}

	.border-top-red-300 {
		border-top-color: #feb2b2;
	}

	.border-right-red-300 {
		border-right-color: #feb2b2;
	}

	.border-bottom-red-300 {
		border-bottom-color: #feb2b2;
	}

	.border-left-red-300 {
		border-left-color: #feb2b2;
	}

	.border-red-500 {
		border-color: #f56565;
	}

	.border-top-red-500 {
		border-top-color: #f56565;
	}

	.border-right-red-500 {
		border-right-color: #f56565;
	}

	.border-bottom-red-500 {
		border-bottom-color: #f56565;
	}

	.border-left-red-500 {
		border-left-color: #f56565;
	}

	.border-red-700 {
		border-color: #c53030;
	}

	.border-top-red-700 {
		border-top-color: #c53030;
	}

	.border-right-red-700 {
		border-right-color: #c53030;
	}

	.border-bottom-red-700 {
		border-bottom-color: #c53030;
	}

	.border-left-red-700 {
		border-left-color: #c53030;
	}

	.border-red-900 {
		border-color: #742a2a;
	}

	.border-top-red-900 {
		border-top-color: #742a2a;
	}

	.border-right-red-900 {
		border-right-color: #742a2a;
	}

	.border-bottom-red-900 {
		border-bottom-color: #742a2a;
	}

	.border-left-red-900 {
		border-left-color: #742a2a;
	}

	.border-orange-100 {
		border-color: #fffaf0;
	}

	.border-top-orange-100 {
		border-top-color: #fffaf0;
	}

	.border-right-orange-100 {
		border-right-color: #fffaf0;
	}

	.border-bottom-orange-100 {
		border-bottom-color: #fffaf0;
	}

	.border-left-orange-100 {
		border-left-color: #fffaf0;
	}

	.border-orange-300 {
		border-color: #fbd38d;
	}

	.border-top-orange-300 {
		border-top-color: #fbd38d;
	}

	.border-right-orange-300 {
		border-right-color: #fbd38d;
	}

	.border-bottom-orange-300 {
		border-bottom-color: #fbd38d;
	}

	.border-left-orange-300 {
		border-left-color: #fbd38d;
	}

	.border-orange-500 {
		border-color: #ed8936;
	}

	.border-top-orange-500 {
		border-top-color: #ed8936;
	}

	.border-right-orange-500 {
		border-right-color: #ed8936;
	}

	.border-bottom-orange-500 {
		border-bottom-color: #ed8936;
	}

	.border-left-orange-500 {
		border-left-color: #ed8936;
	}

	.border-orange-700 {
		border-color: #c05621;
	}

	.border-top-orange-700 {
		border-top-color: #c05621;
	}

	.border-right-orange-700 {
		border-right-color: #c05621;
	}

	.border-bottom-orange-700 {
		border-bottom-color: #c05621;
	}

	.border-left-orange-700 {
		border-left-color: #c05621;
	}

	.border-orange-900 {
		border-color: #7b341e;
	}

	.border-top-orange-900 {
		border-top-color: #7b341e;
	}

	.border-right-orange-900 {
		border-right-color: #7b341e;
	}

	.border-bottom-orange-900 {
		border-bottom-color: #7b341e;
	}

	.border-left-orange-900 {
		border-left-color: #7b341e;
	}

	.border-green-100 {
		border-color: #f0fff4;
	}

	.border-top-green-100 {
		border-top-color: #f0fff4;
	}

	.border-right-green-100 {
		border-right-color: #f0fff4;
	}

	.border-bottom-green-100 {
		border-bottom-color: #f0fff4;
	}

	.border-left-green-100 {
		border-left-color: #f0fff4;
	}

	.border-green-300 {
		border-color: #9ae6b4;
	}

	.border-top-green-300 {
		border-top-color: #9ae6b4;
	}

	.border-right-green-300 {
		border-right-color: #9ae6b4;
	}

	.border-bottom-green-300 {
		border-bottom-color: #9ae6b4;
	}

	.border-left-green-300 {
		border-left-color: #9ae6b4;
	}

	.border-green-500 {
		border-color: #48bb78;
	}

	.border-top-green-500 {
		border-top-color: #48bb78;
	}

	.border-right-green-500 {
		border-right-color: #48bb78;
	}

	.border-bottom-green-500 {
		border-bottom-color: #48bb78;
	}

	.border-left-green-500 {
		border-left-color: #48bb78;
	}

	.border-green-700 {
		border-color: #2f855a;
	}

	.border-top-green-700 {
		border-top-color: #2f855a;
	}

	.border-right-green-700 {
		border-right-color: #2f855a;
	}

	.border-bottom-green-700 {
		border-bottom-color: #2f855a;
	}

	.border-left-green-700 {
		border-left-color: #2f855a;
	}

	.border-green-900 {
		border-color: #22543d;
	}

	.border-top-green-900 {
		border-top-color: #22543d;
	}

	.border-right-green-900 {
		border-right-color: #22543d;
	}

	.border-bottom-green-900 {
		border-bottom-color: #22543d;
	}

	.border-left-green-900 {
		border-left-color: #22543d;
	}

	.border-primary {
		border-color: #002e6c;
	}

	.border-top-primary {
		border-top-color: #002e6c;
	}

	.border-right-primary {
		border-right-color: #002e6c;
	}

	.border-bottom-primary {
		border-bottom-color: #002e6c;
	}

	.border-left-primary {
		border-left-color: #002e6c;
	}

	.border-primary-inverse {
		border-color: #ffffff;
	}

	.border-top-primary-inverse {
		border-top-color: #ffffff;
	}

	.border-right-primary-inverse {
		border-right-color: #ffffff;
	}

	.border-bottom-primary-inverse {
		border-bottom-color: #ffffff;
	}

	.border-left-primary-inverse {
		border-left-color: #ffffff;
	}

	.hover\\:border-transparent:hover {
		border-color: transparent;
	}

	.hover\\:border-current:hover {
		border-color: currentcolor;
	}

	.hover\\:border-black:hover {
		border-color: #000000;
	}

	.hover\\:border-top-black:hover {
		border-top-color: #000000;
	}

	.hover\\:border-right-black:hover {
		border-right-color: #000000;
	}

	.hover\\:border-bottom-black:hover {
		border-bottom-color: #000000;
	}

	.hover\\:border-left-black:hover {
		border-left-color: #000000;
	}

	.hover\\:border-white:hover {
		border-color: #ffffff;
	}

	.hover\\:border-top-white:hover {
		border-top-color: #ffffff;
	}

	.hover\\:border-right-white:hover {
		border-right-color: #ffffff;
	}

	.hover\\:border-bottom-white:hover {
		border-bottom-color: #ffffff;
	}

	.hover\\:border-left-white:hover {
		border-left-color: #ffffff;
	}

	.hover\\:border-translucent:hover {
		border-color: rgb(255 255 255 / 10%);
	}

	.hover\\:border-top-translucent:hover {
		border-top-color: rgb(255 255 255 / 10%);
	}

	.hover\\:border-right-translucent:hover {
		border-right-color: rgb(255 255 255 / 10%);
	}

	.hover\\:border-bottom-translucent:hover {
		border-bottom-color: rgb(255 255 255 / 10%);
	}

	.hover\\:border-left-translucent:hover {
		border-left-color: rgb(255 255 255 / 10%);
	}

	.hover\\:border-gray-100:hover {
		border-color: #f1f1f1;
	}

	.hover\\:border-top-gray-100:hover {
		border-top-color: #f1f1f1;
	}

	.hover\\:border-right-gray-100:hover {
		border-right-color: #f1f1f1;
	}

	.hover\\:border-bottom-gray-100:hover {
		border-bottom-color: #f1f1f1;
	}

	.hover\\:border-left-gray-100:hover {
		border-left-color: #f1f1f1;
	}

	.hover\\:border-gray-200:hover {
		border-color: #f1f1f1;
	}

	.hover\\:border-top-gray-200:hover {
		border-top-color: #f1f1f1;
	}

	.hover\\:border-right-gray-200:hover {
		border-right-color: #f1f1f1;
	}

	.hover\\:border-bottom-gray-200:hover {
		border-bottom-color: #f1f1f1;
	}

	.hover\\:border-left-gray-200:hover {
		border-left-color: #f1f1f1;
	}

	.hover\\:border-gray-300:hover {
		border-color: #e2e8f0;
	}

	.hover\\:border-top-gray-300:hover {
		border-top-color: #e2e8f0;
	}

	.hover\\:border-right-gray-300:hover {
		border-right-color: #e2e8f0;
	}

	.hover\\:border-bottom-gray-300:hover {
		border-bottom-color: #e2e8f0;
	}

	.hover\\:border-left-gray-300:hover {
		border-left-color: #e2e8f0;
	}

	.hover\\:border-gray-400:hover {
		border-color: #cbd5e0;
	}

	.hover\\:border-top-gray-400:hover {
		border-top-color: #cbd5e0;
	}

	.hover\\:border-right-gray-400:hover {
		border-right-color: #cbd5e0;
	}

	.hover\\:border-bottom-gray-400:hover {
		border-bottom-color: #cbd5e0;
	}

	.hover\\:border-left-gray-400:hover {
		border-left-color: #cbd5e0;
	}

	.hover\\:border-gray-500:hover {
		border-color: #a0aec0;
	}

	.hover\\:border-top-gray-500:hover {
		border-top-color: #a0aec0;
	}

	.hover\\:border-right-gray-500:hover {
		border-right-color: #a0aec0;
	}

	.hover\\:border-bottom-gray-500:hover {
		border-bottom-color: #a0aec0;
	}

	.hover\\:border-left-gray-500:hover {
		border-left-color: #a0aec0;
	}

	.hover\\:border-gray-600:hover {
		border-color: #777779;
	}

	.hover\\:border-top-gray-600:hover {
		border-top-color: #777779;
	}

	.hover\\:border-right-gray-600:hover {
		border-right-color: #777779;
	}

	.hover\\:border-bottom-gray-600:hover {
		border-bottom-color: #777779;
	}

	.hover\\:border-left-gray-600:hover {
		border-left-color: #777779;
	}

	.hover\\:border-gray-700:hover {
		border-color: #4a5568;
	}

	.hover\\:border-top-gray-700:hover {
		border-top-color: #4a5568;
	}

	.hover\\:border-right-gray-700:hover {
		border-right-color: #4a5568;
	}

	.hover\\:border-bottom-gray-700:hover {
		border-bottom-color: #4a5568;
	}

	.hover\\:border-left-gray-700:hover {
		border-left-color: #4a5568;
	}

	.hover\\:border-gray-800:hover {
		border-color: #2d3748;
	}

	.hover\\:border-top-gray-800:hover {
		border-top-color: #2d3748;
	}

	.hover\\:border-right-gray-800:hover {
		border-right-color: #2d3748;
	}

	.hover\\:border-bottom-gray-800:hover {
		border-bottom-color: #2d3748;
	}

	.hover\\:border-left-gray-800:hover {
		border-left-color: #2d3748;
	}

	.hover\\:border-gray-900:hover {
		border-color: #1a202c;
	}

	.hover\\:border-top-gray-900:hover {
		border-top-color: #1a202c;
	}

	.hover\\:border-right-gray-900:hover {
		border-right-color: #1a202c;
	}

	.hover\\:border-bottom-gray-900:hover {
		border-bottom-color: #1a202c;
	}

	.hover\\:border-left-gray-900:hover {
		border-left-color: #1a202c;
	}

	.hover\\:border-red-100:hover {
		border-color: #fff5f5;
	}

	.hover\\:border-top-red-100:hover {
		border-top-color: #fff5f5;
	}

	.hover\\:border-right-red-100:hover {
		border-right-color: #fff5f5;
	}

	.hover\\:border-bottom-red-100:hover {
		border-bottom-color: #fff5f5;
	}

	.hover\\:border-left-red-100:hover {
		border-left-color: #fff5f5;
	}

	.hover\\:border-red-300:hover {
		border-color: #feb2b2;
	}

	.hover\\:border-top-red-300:hover {
		border-top-color: #feb2b2;
	}

	.hover\\:border-right-red-300:hover {
		border-right-color: #feb2b2;
	}

	.hover\\:border-bottom-red-300:hover {
		border-bottom-color: #feb2b2;
	}

	.hover\\:border-left-red-300:hover {
		border-left-color: #feb2b2;
	}

	.hover\\:border-red-500:hover {
		border-color: #f56565;
	}

	.hover\\:border-top-red-500:hover {
		border-top-color: #f56565;
	}

	.hover\\:border-right-red-500:hover {
		border-right-color: #f56565;
	}

	.hover\\:border-bottom-red-500:hover {
		border-bottom-color: #f56565;
	}

	.hover\\:border-left-red-500:hover {
		border-left-color: #f56565;
	}

	.hover\\:border-red-700:hover {
		border-color: #c53030;
	}

	.hover\\:border-top-red-700:hover {
		border-top-color: #c53030;
	}

	.hover\\:border-right-red-700:hover {
		border-right-color: #c53030;
	}

	.hover\\:border-bottom-red-700:hover {
		border-bottom-color: #c53030;
	}

	.hover\\:border-left-red-700:hover {
		border-left-color: #c53030;
	}

	.hover\\:border-red-900:hover {
		border-color: #742a2a;
	}

	.hover\\:border-top-red-900:hover {
		border-top-color: #742a2a;
	}

	.hover\\:border-right-red-900:hover {
		border-right-color: #742a2a;
	}

	.hover\\:border-bottom-red-900:hover {
		border-bottom-color: #742a2a;
	}

	.hover\\:border-left-red-900:hover {
		border-left-color: #742a2a;
	}

	.hover\\:border-orange-100:hover {
		border-color: #fffaf0;
	}

	.hover\\:border-top-orange-100:hover {
		border-top-color: #fffaf0;
	}

	.hover\\:border-right-orange-100:hover {
		border-right-color: #fffaf0;
	}

	.hover\\:border-bottom-orange-100:hover {
		border-bottom-color: #fffaf0;
	}

	.hover\\:border-left-orange-100:hover {
		border-left-color: #fffaf0;
	}

	.hover\\:border-orange-300:hover {
		border-color: #fbd38d;
	}

	.hover\\:border-top-orange-300:hover {
		border-top-color: #fbd38d;
	}

	.hover\\:border-right-orange-300:hover {
		border-right-color: #fbd38d;
	}

	.hover\\:border-bottom-orange-300:hover {
		border-bottom-color: #fbd38d;
	}

	.hover\\:border-left-orange-300:hover {
		border-left-color: #fbd38d;
	}

	.hover\\:border-orange-500:hover {
		border-color: #ed8936;
	}

	.hover\\:border-top-orange-500:hover {
		border-top-color: #ed8936;
	}

	.hover\\:border-right-orange-500:hover {
		border-right-color: #ed8936;
	}

	.hover\\:border-bottom-orange-500:hover {
		border-bottom-color: #ed8936;
	}

	.hover\\:border-left-orange-500:hover {
		border-left-color: #ed8936;
	}

	.hover\\:border-orange-700:hover {
		border-color: #c05621;
	}

	.hover\\:border-top-orange-700:hover {
		border-top-color: #c05621;
	}

	.hover\\:border-right-orange-700:hover {
		border-right-color: #c05621;
	}

	.hover\\:border-bottom-orange-700:hover {
		border-bottom-color: #c05621;
	}

	.hover\\:border-left-orange-700:hover {
		border-left-color: #c05621;
	}

	.hover\\:border-orange-900:hover {
		border-color: #7b341e;
	}

	.hover\\:border-top-orange-900:hover {
		border-top-color: #7b341e;
	}

	.hover\\:border-right-orange-900:hover {
		border-right-color: #7b341e;
	}

	.hover\\:border-bottom-orange-900:hover {
		border-bottom-color: #7b341e;
	}

	.hover\\:border-left-orange-900:hover {
		border-left-color: #7b341e;
	}

	.hover\\:border-green-100:hover {
		border-color: #f0fff4;
	}

	.hover\\:border-top-green-100:hover {
		border-top-color: #f0fff4;
	}

	.hover\\:border-right-green-100:hover {
		border-right-color: #f0fff4;
	}

	.hover\\:border-bottom-green-100:hover {
		border-bottom-color: #f0fff4;
	}

	.hover\\:border-left-green-100:hover {
		border-left-color: #f0fff4;
	}

	.hover\\:border-green-300:hover {
		border-color: #9ae6b4;
	}

	.hover\\:border-top-green-300:hover {
		border-top-color: #9ae6b4;
	}

	.hover\\:border-right-green-300:hover {
		border-right-color: #9ae6b4;
	}

	.hover\\:border-bottom-green-300:hover {
		border-bottom-color: #9ae6b4;
	}

	.hover\\:border-left-green-300:hover {
		border-left-color: #9ae6b4;
	}

	.hover\\:border-green-500:hover {
		border-color: #48bb78;
	}

	.hover\\:border-top-green-500:hover {
		border-top-color: #48bb78;
	}

	.hover\\:border-right-green-500:hover {
		border-right-color: #48bb78;
	}

	.hover\\:border-bottom-green-500:hover {
		border-bottom-color: #48bb78;
	}

	.hover\\:border-left-green-500:hover {
		border-left-color: #48bb78;
	}

	.hover\\:border-green-700:hover {
		border-color: #2f855a;
	}

	.hover\\:border-top-green-700:hover {
		border-top-color: #2f855a;
	}

	.hover\\:border-right-green-700:hover {
		border-right-color: #2f855a;
	}

	.hover\\:border-bottom-green-700:hover {
		border-bottom-color: #2f855a;
	}

	.hover\\:border-left-green-700:hover {
		border-left-color: #2f855a;
	}

	.hover\\:border-green-900:hover {
		border-color: #22543d;
	}

	.hover\\:border-top-green-900:hover {
		border-top-color: #22543d;
	}

	.hover\\:border-right-green-900:hover {
		border-right-color: #22543d;
	}

	.hover\\:border-bottom-green-900:hover {
		border-bottom-color: #22543d;
	}

	.hover\\:border-left-green-900:hover {
		border-left-color: #22543d;
	}

	.hover\\:border-primary:hover {
		border-color: #002e6c;
	}

	.hover\\:border-top-primary:hover {
		border-top-color: #002e6c;
	}

	.hover\\:border-right-primary:hover {
		border-right-color: #002e6c;
	}

	.hover\\:border-bottom-primary:hover {
		border-bottom-color: #002e6c;
	}

	.hover\\:border-left-primary:hover {
		border-left-color: #002e6c;
	}

	.hover\\:border-primary-inverse:hover {
		border-color: #ffffff;
	}

	.hover\\:border-top-primary-inverse:hover {
		border-top-color: #ffffff;
	}

	.hover\\:border-right-primary-inverse:hover {
		border-right-color: #ffffff;
	}

	.hover\\:border-bottom-primary-inverse:hover {
		border-bottom-color: #ffffff;
	}

	.hover\\:border-left-primary-inverse:hover {
		border-left-color: #ffffff;
	}

	@media (width >= 576px) {
		.sm\\:border-transparent {
			border-color: transparent;
		}

		.sm\\:border-current {
			border-color: currentcolor;
		}

		.sm\\:border-black {
			border-color: #000000;
		}

		.sm\\:border-top-black {
			border-top-color: #000000;
		}

		.sm\\:border-right-black {
			border-right-color: #000000;
		}

		.sm\\:border-bottom-black {
			border-bottom-color: #000000;
		}

		.sm\\:border-left-black {
			border-left-color: #000000;
		}

		.sm\\:border-white {
			border-color: #ffffff;
		}

		.sm\\:border-top-white {
			border-top-color: #ffffff;
		}

		.sm\\:border-right-white {
			border-right-color: #ffffff;
		}

		.sm\\:border-bottom-white {
			border-bottom-color: #ffffff;
		}

		.sm\\:border-left-white {
			border-left-color: #ffffff;
		}

		.sm\\:border-translucent {
			border-color: rgb(255 255 255 / 10%);
		}

		.sm\\:border-top-translucent {
			border-top-color: rgb(255 255 255 / 10%);
		}

		.sm\\:border-right-translucent {
			border-right-color: rgb(255 255 255 / 10%);
		}

		.sm\\:border-bottom-translucent {
			border-bottom-color: rgb(255 255 255 / 10%);
		}

		.sm\\:border-left-translucent {
			border-left-color: rgb(255 255 255 / 10%);
		}

		.sm\\:border-gray-100 {
			border-color: #f1f1f1;
		}

		.sm\\:border-top-gray-100 {
			border-top-color: #f1f1f1;
		}

		.sm\\:border-right-gray-100 {
			border-right-color: #f1f1f1;
		}

		.sm\\:border-bottom-gray-100 {
			border-bottom-color: #f1f1f1;
		}

		.sm\\:border-left-gray-100 {
			border-left-color: #f1f1f1;
		}

		.sm\\:border-gray-200 {
			border-color: #f1f1f1;
		}

		.sm\\:border-top-gray-200 {
			border-top-color: #f1f1f1;
		}

		.sm\\:border-right-gray-200 {
			border-right-color: #f1f1f1;
		}

		.sm\\:border-bottom-gray-200 {
			border-bottom-color: #f1f1f1;
		}

		.sm\\:border-left-gray-200 {
			border-left-color: #f1f1f1;
		}

		.sm\\:border-gray-300 {
			border-color: #e2e8f0;
		}

		.sm\\:border-top-gray-300 {
			border-top-color: #e2e8f0;
		}

		.sm\\:border-right-gray-300 {
			border-right-color: #e2e8f0;
		}

		.sm\\:border-bottom-gray-300 {
			border-bottom-color: #e2e8f0;
		}

		.sm\\:border-left-gray-300 {
			border-left-color: #e2e8f0;
		}

		.sm\\:border-gray-400 {
			border-color: #cbd5e0;
		}

		.sm\\:border-top-gray-400 {
			border-top-color: #cbd5e0;
		}

		.sm\\:border-right-gray-400 {
			border-right-color: #cbd5e0;
		}

		.sm\\:border-bottom-gray-400 {
			border-bottom-color: #cbd5e0;
		}

		.sm\\:border-left-gray-400 {
			border-left-color: #cbd5e0;
		}

		.sm\\:border-gray-500 {
			border-color: #a0aec0;
		}

		.sm\\:border-top-gray-500 {
			border-top-color: #a0aec0;
		}

		.sm\\:border-right-gray-500 {
			border-right-color: #a0aec0;
		}

		.sm\\:border-bottom-gray-500 {
			border-bottom-color: #a0aec0;
		}

		.sm\\:border-left-gray-500 {
			border-left-color: #a0aec0;
		}

		.sm\\:border-gray-600 {
			border-color: #777779;
		}

		.sm\\:border-top-gray-600 {
			border-top-color: #777779;
		}

		.sm\\:border-right-gray-600 {
			border-right-color: #777779;
		}

		.sm\\:border-bottom-gray-600 {
			border-bottom-color: #777779;
		}

		.sm\\:border-left-gray-600 {
			border-left-color: #777779;
		}

		.sm\\:border-gray-700 {
			border-color: #4a5568;
		}

		.sm\\:border-top-gray-700 {
			border-top-color: #4a5568;
		}

		.sm\\:border-right-gray-700 {
			border-right-color: #4a5568;
		}

		.sm\\:border-bottom-gray-700 {
			border-bottom-color: #4a5568;
		}

		.sm\\:border-left-gray-700 {
			border-left-color: #4a5568;
		}

		.sm\\:border-gray-800 {
			border-color: #2d3748;
		}

		.sm\\:border-top-gray-800 {
			border-top-color: #2d3748;
		}

		.sm\\:border-right-gray-800 {
			border-right-color: #2d3748;
		}

		.sm\\:border-bottom-gray-800 {
			border-bottom-color: #2d3748;
		}

		.sm\\:border-left-gray-800 {
			border-left-color: #2d3748;
		}

		.sm\\:border-gray-900 {
			border-color: #1a202c;
		}

		.sm\\:border-top-gray-900 {
			border-top-color: #1a202c;
		}

		.sm\\:border-right-gray-900 {
			border-right-color: #1a202c;
		}

		.sm\\:border-bottom-gray-900 {
			border-bottom-color: #1a202c;
		}

		.sm\\:border-left-gray-900 {
			border-left-color: #1a202c;
		}

		.sm\\:border-red-100 {
			border-color: #fff5f5;
		}

		.sm\\:border-top-red-100 {
			border-top-color: #fff5f5;
		}

		.sm\\:border-right-red-100 {
			border-right-color: #fff5f5;
		}

		.sm\\:border-bottom-red-100 {
			border-bottom-color: #fff5f5;
		}

		.sm\\:border-left-red-100 {
			border-left-color: #fff5f5;
		}

		.sm\\:border-red-300 {
			border-color: #feb2b2;
		}

		.sm\\:border-top-red-300 {
			border-top-color: #feb2b2;
		}

		.sm\\:border-right-red-300 {
			border-right-color: #feb2b2;
		}

		.sm\\:border-bottom-red-300 {
			border-bottom-color: #feb2b2;
		}

		.sm\\:border-left-red-300 {
			border-left-color: #feb2b2;
		}

		.sm\\:border-red-500 {
			border-color: #f56565;
		}

		.sm\\:border-top-red-500 {
			border-top-color: #f56565;
		}

		.sm\\:border-right-red-500 {
			border-right-color: #f56565;
		}

		.sm\\:border-bottom-red-500 {
			border-bottom-color: #f56565;
		}

		.sm\\:border-left-red-500 {
			border-left-color: #f56565;
		}

		.sm\\:border-red-700 {
			border-color: #c53030;
		}

		.sm\\:border-top-red-700 {
			border-top-color: #c53030;
		}

		.sm\\:border-right-red-700 {
			border-right-color: #c53030;
		}

		.sm\\:border-bottom-red-700 {
			border-bottom-color: #c53030;
		}

		.sm\\:border-left-red-700 {
			border-left-color: #c53030;
		}

		.sm\\:border-red-900 {
			border-color: #742a2a;
		}

		.sm\\:border-top-red-900 {
			border-top-color: #742a2a;
		}

		.sm\\:border-right-red-900 {
			border-right-color: #742a2a;
		}

		.sm\\:border-bottom-red-900 {
			border-bottom-color: #742a2a;
		}

		.sm\\:border-left-red-900 {
			border-left-color: #742a2a;
		}

		.sm\\:border-orange-100 {
			border-color: #fffaf0;
		}

		.sm\\:border-top-orange-100 {
			border-top-color: #fffaf0;
		}

		.sm\\:border-right-orange-100 {
			border-right-color: #fffaf0;
		}

		.sm\\:border-bottom-orange-100 {
			border-bottom-color: #fffaf0;
		}

		.sm\\:border-left-orange-100 {
			border-left-color: #fffaf0;
		}

		.sm\\:border-orange-300 {
			border-color: #fbd38d;
		}

		.sm\\:border-top-orange-300 {
			border-top-color: #fbd38d;
		}

		.sm\\:border-right-orange-300 {
			border-right-color: #fbd38d;
		}

		.sm\\:border-bottom-orange-300 {
			border-bottom-color: #fbd38d;
		}

		.sm\\:border-left-orange-300 {
			border-left-color: #fbd38d;
		}

		.sm\\:border-orange-500 {
			border-color: #ed8936;
		}

		.sm\\:border-top-orange-500 {
			border-top-color: #ed8936;
		}

		.sm\\:border-right-orange-500 {
			border-right-color: #ed8936;
		}

		.sm\\:border-bottom-orange-500 {
			border-bottom-color: #ed8936;
		}

		.sm\\:border-left-orange-500 {
			border-left-color: #ed8936;
		}

		.sm\\:border-orange-700 {
			border-color: #c05621;
		}

		.sm\\:border-top-orange-700 {
			border-top-color: #c05621;
		}

		.sm\\:border-right-orange-700 {
			border-right-color: #c05621;
		}

		.sm\\:border-bottom-orange-700 {
			border-bottom-color: #c05621;
		}

		.sm\\:border-left-orange-700 {
			border-left-color: #c05621;
		}

		.sm\\:border-orange-900 {
			border-color: #7b341e;
		}

		.sm\\:border-top-orange-900 {
			border-top-color: #7b341e;
		}

		.sm\\:border-right-orange-900 {
			border-right-color: #7b341e;
		}

		.sm\\:border-bottom-orange-900 {
			border-bottom-color: #7b341e;
		}

		.sm\\:border-left-orange-900 {
			border-left-color: #7b341e;
		}

		.sm\\:border-green-100 {
			border-color: #f0fff4;
		}

		.sm\\:border-top-green-100 {
			border-top-color: #f0fff4;
		}

		.sm\\:border-right-green-100 {
			border-right-color: #f0fff4;
		}

		.sm\\:border-bottom-green-100 {
			border-bottom-color: #f0fff4;
		}

		.sm\\:border-left-green-100 {
			border-left-color: #f0fff4;
		}

		.sm\\:border-green-300 {
			border-color: #9ae6b4;
		}

		.sm\\:border-top-green-300 {
			border-top-color: #9ae6b4;
		}

		.sm\\:border-right-green-300 {
			border-right-color: #9ae6b4;
		}

		.sm\\:border-bottom-green-300 {
			border-bottom-color: #9ae6b4;
		}

		.sm\\:border-left-green-300 {
			border-left-color: #9ae6b4;
		}

		.sm\\:border-green-500 {
			border-color: #48bb78;
		}

		.sm\\:border-top-green-500 {
			border-top-color: #48bb78;
		}

		.sm\\:border-right-green-500 {
			border-right-color: #48bb78;
		}

		.sm\\:border-bottom-green-500 {
			border-bottom-color: #48bb78;
		}

		.sm\\:border-left-green-500 {
			border-left-color: #48bb78;
		}

		.sm\\:border-green-700 {
			border-color: #2f855a;
		}

		.sm\\:border-top-green-700 {
			border-top-color: #2f855a;
		}

		.sm\\:border-right-green-700 {
			border-right-color: #2f855a;
		}

		.sm\\:border-bottom-green-700 {
			border-bottom-color: #2f855a;
		}

		.sm\\:border-left-green-700 {
			border-left-color: #2f855a;
		}

		.sm\\:border-green-900 {
			border-color: #22543d;
		}

		.sm\\:border-top-green-900 {
			border-top-color: #22543d;
		}

		.sm\\:border-right-green-900 {
			border-right-color: #22543d;
		}

		.sm\\:border-bottom-green-900 {
			border-bottom-color: #22543d;
		}

		.sm\\:border-left-green-900 {
			border-left-color: #22543d;
		}

		.sm\\:border-primary {
			border-color: #002e6c;
		}

		.sm\\:border-top-primary {
			border-top-color: #002e6c;
		}

		.sm\\:border-right-primary {
			border-right-color: #002e6c;
		}

		.sm\\:border-bottom-primary {
			border-bottom-color: #002e6c;
		}

		.sm\\:border-left-primary {
			border-left-color: #002e6c;
		}

		.sm\\:border-primary-inverse {
			border-color: #ffffff;
		}

		.sm\\:border-top-primary-inverse {
			border-top-color: #ffffff;
		}

		.sm\\:border-right-primary-inverse {
			border-right-color: #ffffff;
		}

		.sm\\:border-bottom-primary-inverse {
			border-bottom-color: #ffffff;
		}

		.sm\\:border-left-primary-inverse {
			border-left-color: #ffffff;
		}
	}

	@media (width >= 768px) {
		.md\\:border-transparent {
			border-color: transparent;
		}

		.md\\:border-current {
			border-color: currentcolor;
		}

		.md\\:border-black {
			border-color: #000000;
		}

		.md\\:border-top-black {
			border-top-color: #000000;
		}

		.md\\:border-right-black {
			border-right-color: #000000;
		}

		.md\\:border-bottom-black {
			border-bottom-color: #000000;
		}

		.md\\:border-left-black {
			border-left-color: #000000;
		}

		.md\\:border-white {
			border-color: #ffffff;
		}

		.md\\:border-top-white {
			border-top-color: #ffffff;
		}

		.md\\:border-right-white {
			border-right-color: #ffffff;
		}

		.md\\:border-bottom-white {
			border-bottom-color: #ffffff;
		}

		.md\\:border-left-white {
			border-left-color: #ffffff;
		}

		.md\\:border-translucent {
			border-color: rgb(255 255 255 / 10%);
		}

		.md\\:border-top-translucent {
			border-top-color: rgb(255 255 255 / 10%);
		}

		.md\\:border-right-translucent {
			border-right-color: rgb(255 255 255 / 10%);
		}

		.md\\:border-bottom-translucent {
			border-bottom-color: rgb(255 255 255 / 10%);
		}

		.md\\:border-left-translucent {
			border-left-color: rgb(255 255 255 / 10%);
		}

		.md\\:border-gray-100 {
			border-color: #f1f1f1;
		}

		.md\\:border-top-gray-100 {
			border-top-color: #f1f1f1;
		}

		.md\\:border-right-gray-100 {
			border-right-color: #f1f1f1;
		}

		.md\\:border-bottom-gray-100 {
			border-bottom-color: #f1f1f1;
		}

		.md\\:border-left-gray-100 {
			border-left-color: #f1f1f1;
		}

		.md\\:border-gray-200 {
			border-color: #f1f1f1;
		}

		.md\\:border-top-gray-200 {
			border-top-color: #f1f1f1;
		}

		.md\\:border-right-gray-200 {
			border-right-color: #f1f1f1;
		}

		.md\\:border-bottom-gray-200 {
			border-bottom-color: #f1f1f1;
		}

		.md\\:border-left-gray-200 {
			border-left-color: #f1f1f1;
		}

		.md\\:border-gray-300 {
			border-color: #e2e8f0;
		}

		.md\\:border-top-gray-300 {
			border-top-color: #e2e8f0;
		}

		.md\\:border-right-gray-300 {
			border-right-color: #e2e8f0;
		}

		.md\\:border-bottom-gray-300 {
			border-bottom-color: #e2e8f0;
		}

		.md\\:border-left-gray-300 {
			border-left-color: #e2e8f0;
		}

		.md\\:border-gray-400 {
			border-color: #cbd5e0;
		}

		.md\\:border-top-gray-400 {
			border-top-color: #cbd5e0;
		}

		.md\\:border-right-gray-400 {
			border-right-color: #cbd5e0;
		}

		.md\\:border-bottom-gray-400 {
			border-bottom-color: #cbd5e0;
		}

		.md\\:border-left-gray-400 {
			border-left-color: #cbd5e0;
		}

		.md\\:border-gray-500 {
			border-color: #a0aec0;
		}

		.md\\:border-top-gray-500 {
			border-top-color: #a0aec0;
		}

		.md\\:border-right-gray-500 {
			border-right-color: #a0aec0;
		}

		.md\\:border-bottom-gray-500 {
			border-bottom-color: #a0aec0;
		}

		.md\\:border-left-gray-500 {
			border-left-color: #a0aec0;
		}

		.md\\:border-gray-600 {
			border-color: #777779;
		}

		.md\\:border-top-gray-600 {
			border-top-color: #777779;
		}

		.md\\:border-right-gray-600 {
			border-right-color: #777779;
		}

		.md\\:border-bottom-gray-600 {
			border-bottom-color: #777779;
		}

		.md\\:border-left-gray-600 {
			border-left-color: #777779;
		}

		.md\\:border-gray-700 {
			border-color: #4a5568;
		}

		.md\\:border-top-gray-700 {
			border-top-color: #4a5568;
		}

		.md\\:border-right-gray-700 {
			border-right-color: #4a5568;
		}

		.md\\:border-bottom-gray-700 {
			border-bottom-color: #4a5568;
		}

		.md\\:border-left-gray-700 {
			border-left-color: #4a5568;
		}

		.md\\:border-gray-800 {
			border-color: #2d3748;
		}

		.md\\:border-top-gray-800 {
			border-top-color: #2d3748;
		}

		.md\\:border-right-gray-800 {
			border-right-color: #2d3748;
		}

		.md\\:border-bottom-gray-800 {
			border-bottom-color: #2d3748;
		}

		.md\\:border-left-gray-800 {
			border-left-color: #2d3748;
		}

		.md\\:border-gray-900 {
			border-color: #1a202c;
		}

		.md\\:border-top-gray-900 {
			border-top-color: #1a202c;
		}

		.md\\:border-right-gray-900 {
			border-right-color: #1a202c;
		}

		.md\\:border-bottom-gray-900 {
			border-bottom-color: #1a202c;
		}

		.md\\:border-left-gray-900 {
			border-left-color: #1a202c;
		}

		.md\\:border-red-100 {
			border-color: #fff5f5;
		}

		.md\\:border-top-red-100 {
			border-top-color: #fff5f5;
		}

		.md\\:border-right-red-100 {
			border-right-color: #fff5f5;
		}

		.md\\:border-bottom-red-100 {
			border-bottom-color: #fff5f5;
		}

		.md\\:border-left-red-100 {
			border-left-color: #fff5f5;
		}

		.md\\:border-red-300 {
			border-color: #feb2b2;
		}

		.md\\:border-top-red-300 {
			border-top-color: #feb2b2;
		}

		.md\\:border-right-red-300 {
			border-right-color: #feb2b2;
		}

		.md\\:border-bottom-red-300 {
			border-bottom-color: #feb2b2;
		}

		.md\\:border-left-red-300 {
			border-left-color: #feb2b2;
		}

		.md\\:border-red-500 {
			border-color: #f56565;
		}

		.md\\:border-top-red-500 {
			border-top-color: #f56565;
		}

		.md\\:border-right-red-500 {
			border-right-color: #f56565;
		}

		.md\\:border-bottom-red-500 {
			border-bottom-color: #f56565;
		}

		.md\\:border-left-red-500 {
			border-left-color: #f56565;
		}

		.md\\:border-red-700 {
			border-color: #c53030;
		}

		.md\\:border-top-red-700 {
			border-top-color: #c53030;
		}

		.md\\:border-right-red-700 {
			border-right-color: #c53030;
		}

		.md\\:border-bottom-red-700 {
			border-bottom-color: #c53030;
		}

		.md\\:border-left-red-700 {
			border-left-color: #c53030;
		}

		.md\\:border-red-900 {
			border-color: #742a2a;
		}

		.md\\:border-top-red-900 {
			border-top-color: #742a2a;
		}

		.md\\:border-right-red-900 {
			border-right-color: #742a2a;
		}

		.md\\:border-bottom-red-900 {
			border-bottom-color: #742a2a;
		}

		.md\\:border-left-red-900 {
			border-left-color: #742a2a;
		}

		.md\\:border-orange-100 {
			border-color: #fffaf0;
		}

		.md\\:border-top-orange-100 {
			border-top-color: #fffaf0;
		}

		.md\\:border-right-orange-100 {
			border-right-color: #fffaf0;
		}

		.md\\:border-bottom-orange-100 {
			border-bottom-color: #fffaf0;
		}

		.md\\:border-left-orange-100 {
			border-left-color: #fffaf0;
		}

		.md\\:border-orange-300 {
			border-color: #fbd38d;
		}

		.md\\:border-top-orange-300 {
			border-top-color: #fbd38d;
		}

		.md\\:border-right-orange-300 {
			border-right-color: #fbd38d;
		}

		.md\\:border-bottom-orange-300 {
			border-bottom-color: #fbd38d;
		}

		.md\\:border-left-orange-300 {
			border-left-color: #fbd38d;
		}

		.md\\:border-orange-500 {
			border-color: #ed8936;
		}

		.md\\:border-top-orange-500 {
			border-top-color: #ed8936;
		}

		.md\\:border-right-orange-500 {
			border-right-color: #ed8936;
		}

		.md\\:border-bottom-orange-500 {
			border-bottom-color: #ed8936;
		}

		.md\\:border-left-orange-500 {
			border-left-color: #ed8936;
		}

		.md\\:border-orange-700 {
			border-color: #c05621;
		}

		.md\\:border-top-orange-700 {
			border-top-color: #c05621;
		}

		.md\\:border-right-orange-700 {
			border-right-color: #c05621;
		}

		.md\\:border-bottom-orange-700 {
			border-bottom-color: #c05621;
		}

		.md\\:border-left-orange-700 {
			border-left-color: #c05621;
		}

		.md\\:border-orange-900 {
			border-color: #7b341e;
		}

		.md\\:border-top-orange-900 {
			border-top-color: #7b341e;
		}

		.md\\:border-right-orange-900 {
			border-right-color: #7b341e;
		}

		.md\\:border-bottom-orange-900 {
			border-bottom-color: #7b341e;
		}

		.md\\:border-left-orange-900 {
			border-left-color: #7b341e;
		}

		.md\\:border-green-100 {
			border-color: #f0fff4;
		}

		.md\\:border-top-green-100 {
			border-top-color: #f0fff4;
		}

		.md\\:border-right-green-100 {
			border-right-color: #f0fff4;
		}

		.md\\:border-bottom-green-100 {
			border-bottom-color: #f0fff4;
		}

		.md\\:border-left-green-100 {
			border-left-color: #f0fff4;
		}

		.md\\:border-green-300 {
			border-color: #9ae6b4;
		}

		.md\\:border-top-green-300 {
			border-top-color: #9ae6b4;
		}

		.md\\:border-right-green-300 {
			border-right-color: #9ae6b4;
		}

		.md\\:border-bottom-green-300 {
			border-bottom-color: #9ae6b4;
		}

		.md\\:border-left-green-300 {
			border-left-color: #9ae6b4;
		}

		.md\\:border-green-500 {
			border-color: #48bb78;
		}

		.md\\:border-top-green-500 {
			border-top-color: #48bb78;
		}

		.md\\:border-right-green-500 {
			border-right-color: #48bb78;
		}

		.md\\:border-bottom-green-500 {
			border-bottom-color: #48bb78;
		}

		.md\\:border-left-green-500 {
			border-left-color: #48bb78;
		}

		.md\\:border-green-700 {
			border-color: #2f855a;
		}

		.md\\:border-top-green-700 {
			border-top-color: #2f855a;
		}

		.md\\:border-right-green-700 {
			border-right-color: #2f855a;
		}

		.md\\:border-bottom-green-700 {
			border-bottom-color: #2f855a;
		}

		.md\\:border-left-green-700 {
			border-left-color: #2f855a;
		}

		.md\\:border-green-900 {
			border-color: #22543d;
		}

		.md\\:border-top-green-900 {
			border-top-color: #22543d;
		}

		.md\\:border-right-green-900 {
			border-right-color: #22543d;
		}

		.md\\:border-bottom-green-900 {
			border-bottom-color: #22543d;
		}

		.md\\:border-left-green-900 {
			border-left-color: #22543d;
		}

		.md\\:border-primary {
			border-color: #002e6c;
		}

		.md\\:border-top-primary {
			border-top-color: #002e6c;
		}

		.md\\:border-right-primary {
			border-right-color: #002e6c;
		}

		.md\\:border-bottom-primary {
			border-bottom-color: #002e6c;
		}

		.md\\:border-left-primary {
			border-left-color: #002e6c;
		}

		.md\\:border-primary-inverse {
			border-color: #ffffff;
		}

		.md\\:border-top-primary-inverse {
			border-top-color: #ffffff;
		}

		.md\\:border-right-primary-inverse {
			border-right-color: #ffffff;
		}

		.md\\:border-bottom-primary-inverse {
			border-bottom-color: #ffffff;
		}

		.md\\:border-left-primary-inverse {
			border-left-color: #ffffff;
		}
	}

	@media (width >= 992px) {
		.lg\\:border-transparent {
			border-color: transparent;
		}

		.lg\\:border-current {
			border-color: currentcolor;
		}

		.lg\\:border-black {
			border-color: #000000;
		}

		.lg\\:border-top-black {
			border-top-color: #000000;
		}

		.lg\\:border-right-black {
			border-right-color: #000000;
		}

		.lg\\:border-bottom-black {
			border-bottom-color: #000000;
		}

		.lg\\:border-left-black {
			border-left-color: #000000;
		}

		.lg\\:border-white {
			border-color: #ffffff;
		}

		.lg\\:border-top-white {
			border-top-color: #ffffff;
		}

		.lg\\:border-right-white {
			border-right-color: #ffffff;
		}

		.lg\\:border-bottom-white {
			border-bottom-color: #ffffff;
		}

		.lg\\:border-left-white {
			border-left-color: #ffffff;
		}

		.lg\\:border-translucent {
			border-color: rgb(255 255 255 / 10%);
		}

		.lg\\:border-top-translucent {
			border-top-color: rgb(255 255 255 / 10%);
		}

		.lg\\:border-right-translucent {
			border-right-color: rgb(255 255 255 / 10%);
		}

		.lg\\:border-bottom-translucent {
			border-bottom-color: rgb(255 255 255 / 10%);
		}

		.lg\\:border-left-translucent {
			border-left-color: rgb(255 255 255 / 10%);
		}

		.lg\\:border-gray-100 {
			border-color: #f1f1f1;
		}

		.lg\\:border-top-gray-100 {
			border-top-color: #f1f1f1;
		}

		.lg\\:border-right-gray-100 {
			border-right-color: #f1f1f1;
		}

		.lg\\:border-bottom-gray-100 {
			border-bottom-color: #f1f1f1;
		}

		.lg\\:border-left-gray-100 {
			border-left-color: #f1f1f1;
		}

		.lg\\:border-gray-200 {
			border-color: #f1f1f1;
		}

		.lg\\:border-top-gray-200 {
			border-top-color: #f1f1f1;
		}

		.lg\\:border-right-gray-200 {
			border-right-color: #f1f1f1;
		}

		.lg\\:border-bottom-gray-200 {
			border-bottom-color: #f1f1f1;
		}

		.lg\\:border-left-gray-200 {
			border-left-color: #f1f1f1;
		}

		.lg\\:border-gray-300 {
			border-color: #e2e8f0;
		}

		.lg\\:border-top-gray-300 {
			border-top-color: #e2e8f0;
		}

		.lg\\:border-right-gray-300 {
			border-right-color: #e2e8f0;
		}

		.lg\\:border-bottom-gray-300 {
			border-bottom-color: #e2e8f0;
		}

		.lg\\:border-left-gray-300 {
			border-left-color: #e2e8f0;
		}

		.lg\\:border-gray-400 {
			border-color: #cbd5e0;
		}

		.lg\\:border-top-gray-400 {
			border-top-color: #cbd5e0;
		}

		.lg\\:border-right-gray-400 {
			border-right-color: #cbd5e0;
		}

		.lg\\:border-bottom-gray-400 {
			border-bottom-color: #cbd5e0;
		}

		.lg\\:border-left-gray-400 {
			border-left-color: #cbd5e0;
		}

		.lg\\:border-gray-500 {
			border-color: #a0aec0;
		}

		.lg\\:border-top-gray-500 {
			border-top-color: #a0aec0;
		}

		.lg\\:border-right-gray-500 {
			border-right-color: #a0aec0;
		}

		.lg\\:border-bottom-gray-500 {
			border-bottom-color: #a0aec0;
		}

		.lg\\:border-left-gray-500 {
			border-left-color: #a0aec0;
		}

		.lg\\:border-gray-600 {
			border-color: #777779;
		}

		.lg\\:border-top-gray-600 {
			border-top-color: #777779;
		}

		.lg\\:border-right-gray-600 {
			border-right-color: #777779;
		}

		.lg\\:border-bottom-gray-600 {
			border-bottom-color: #777779;
		}

		.lg\\:border-left-gray-600 {
			border-left-color: #777779;
		}

		.lg\\:border-gray-700 {
			border-color: #4a5568;
		}

		.lg\\:border-top-gray-700 {
			border-top-color: #4a5568;
		}

		.lg\\:border-right-gray-700 {
			border-right-color: #4a5568;
		}

		.lg\\:border-bottom-gray-700 {
			border-bottom-color: #4a5568;
		}

		.lg\\:border-left-gray-700 {
			border-left-color: #4a5568;
		}

		.lg\\:border-gray-800 {
			border-color: #2d3748;
		}

		.lg\\:border-top-gray-800 {
			border-top-color: #2d3748;
		}

		.lg\\:border-right-gray-800 {
			border-right-color: #2d3748;
		}

		.lg\\:border-bottom-gray-800 {
			border-bottom-color: #2d3748;
		}

		.lg\\:border-left-gray-800 {
			border-left-color: #2d3748;
		}

		.lg\\:border-gray-900 {
			border-color: #1a202c;
		}

		.lg\\:border-top-gray-900 {
			border-top-color: #1a202c;
		}

		.lg\\:border-right-gray-900 {
			border-right-color: #1a202c;
		}

		.lg\\:border-bottom-gray-900 {
			border-bottom-color: #1a202c;
		}

		.lg\\:border-left-gray-900 {
			border-left-color: #1a202c;
		}

		.lg\\:border-red-100 {
			border-color: #fff5f5;
		}

		.lg\\:border-top-red-100 {
			border-top-color: #fff5f5;
		}

		.lg\\:border-right-red-100 {
			border-right-color: #fff5f5;
		}

		.lg\\:border-bottom-red-100 {
			border-bottom-color: #fff5f5;
		}

		.lg\\:border-left-red-100 {
			border-left-color: #fff5f5;
		}

		.lg\\:border-red-300 {
			border-color: #feb2b2;
		}

		.lg\\:border-top-red-300 {
			border-top-color: #feb2b2;
		}

		.lg\\:border-right-red-300 {
			border-right-color: #feb2b2;
		}

		.lg\\:border-bottom-red-300 {
			border-bottom-color: #feb2b2;
		}

		.lg\\:border-left-red-300 {
			border-left-color: #feb2b2;
		}

		.lg\\:border-red-500 {
			border-color: #f56565;
		}

		.lg\\:border-top-red-500 {
			border-top-color: #f56565;
		}

		.lg\\:border-right-red-500 {
			border-right-color: #f56565;
		}

		.lg\\:border-bottom-red-500 {
			border-bottom-color: #f56565;
		}

		.lg\\:border-left-red-500 {
			border-left-color: #f56565;
		}

		.lg\\:border-red-700 {
			border-color: #c53030;
		}

		.lg\\:border-top-red-700 {
			border-top-color: #c53030;
		}

		.lg\\:border-right-red-700 {
			border-right-color: #c53030;
		}

		.lg\\:border-bottom-red-700 {
			border-bottom-color: #c53030;
		}

		.lg\\:border-left-red-700 {
			border-left-color: #c53030;
		}

		.lg\\:border-red-900 {
			border-color: #742a2a;
		}

		.lg\\:border-top-red-900 {
			border-top-color: #742a2a;
		}

		.lg\\:border-right-red-900 {
			border-right-color: #742a2a;
		}

		.lg\\:border-bottom-red-900 {
			border-bottom-color: #742a2a;
		}

		.lg\\:border-left-red-900 {
			border-left-color: #742a2a;
		}

		.lg\\:border-orange-100 {
			border-color: #fffaf0;
		}

		.lg\\:border-top-orange-100 {
			border-top-color: #fffaf0;
		}

		.lg\\:border-right-orange-100 {
			border-right-color: #fffaf0;
		}

		.lg\\:border-bottom-orange-100 {
			border-bottom-color: #fffaf0;
		}

		.lg\\:border-left-orange-100 {
			border-left-color: #fffaf0;
		}

		.lg\\:border-orange-300 {
			border-color: #fbd38d;
		}

		.lg\\:border-top-orange-300 {
			border-top-color: #fbd38d;
		}

		.lg\\:border-right-orange-300 {
			border-right-color: #fbd38d;
		}

		.lg\\:border-bottom-orange-300 {
			border-bottom-color: #fbd38d;
		}

		.lg\\:border-left-orange-300 {
			border-left-color: #fbd38d;
		}

		.lg\\:border-orange-500 {
			border-color: #ed8936;
		}

		.lg\\:border-top-orange-500 {
			border-top-color: #ed8936;
		}

		.lg\\:border-right-orange-500 {
			border-right-color: #ed8936;
		}

		.lg\\:border-bottom-orange-500 {
			border-bottom-color: #ed8936;
		}

		.lg\\:border-left-orange-500 {
			border-left-color: #ed8936;
		}

		.lg\\:border-orange-700 {
			border-color: #c05621;
		}

		.lg\\:border-top-orange-700 {
			border-top-color: #c05621;
		}

		.lg\\:border-right-orange-700 {
			border-right-color: #c05621;
		}

		.lg\\:border-bottom-orange-700 {
			border-bottom-color: #c05621;
		}

		.lg\\:border-left-orange-700 {
			border-left-color: #c05621;
		}

		.lg\\:border-orange-900 {
			border-color: #7b341e;
		}

		.lg\\:border-top-orange-900 {
			border-top-color: #7b341e;
		}

		.lg\\:border-right-orange-900 {
			border-right-color: #7b341e;
		}

		.lg\\:border-bottom-orange-900 {
			border-bottom-color: #7b341e;
		}

		.lg\\:border-left-orange-900 {
			border-left-color: #7b341e;
		}

		.lg\\:border-green-100 {
			border-color: #f0fff4;
		}

		.lg\\:border-top-green-100 {
			border-top-color: #f0fff4;
		}

		.lg\\:border-right-green-100 {
			border-right-color: #f0fff4;
		}

		.lg\\:border-bottom-green-100 {
			border-bottom-color: #f0fff4;
		}

		.lg\\:border-left-green-100 {
			border-left-color: #f0fff4;
		}

		.lg\\:border-green-300 {
			border-color: #9ae6b4;
		}

		.lg\\:border-top-green-300 {
			border-top-color: #9ae6b4;
		}

		.lg\\:border-right-green-300 {
			border-right-color: #9ae6b4;
		}

		.lg\\:border-bottom-green-300 {
			border-bottom-color: #9ae6b4;
		}

		.lg\\:border-left-green-300 {
			border-left-color: #9ae6b4;
		}

		.lg\\:border-green-500 {
			border-color: #48bb78;
		}

		.lg\\:border-top-green-500 {
			border-top-color: #48bb78;
		}

		.lg\\:border-right-green-500 {
			border-right-color: #48bb78;
		}

		.lg\\:border-bottom-green-500 {
			border-bottom-color: #48bb78;
		}

		.lg\\:border-left-green-500 {
			border-left-color: #48bb78;
		}

		.lg\\:border-green-700 {
			border-color: #2f855a;
		}

		.lg\\:border-top-green-700 {
			border-top-color: #2f855a;
		}

		.lg\\:border-right-green-700 {
			border-right-color: #2f855a;
		}

		.lg\\:border-bottom-green-700 {
			border-bottom-color: #2f855a;
		}

		.lg\\:border-left-green-700 {
			border-left-color: #2f855a;
		}

		.lg\\:border-green-900 {
			border-color: #22543d;
		}

		.lg\\:border-top-green-900 {
			border-top-color: #22543d;
		}

		.lg\\:border-right-green-900 {
			border-right-color: #22543d;
		}

		.lg\\:border-bottom-green-900 {
			border-bottom-color: #22543d;
		}

		.lg\\:border-left-green-900 {
			border-left-color: #22543d;
		}

		.lg\\:border-primary {
			border-color: #002e6c;
		}

		.lg\\:border-top-primary {
			border-top-color: #002e6c;
		}

		.lg\\:border-right-primary {
			border-right-color: #002e6c;
		}

		.lg\\:border-bottom-primary {
			border-bottom-color: #002e6c;
		}

		.lg\\:border-left-primary {
			border-left-color: #002e6c;
		}

		.lg\\:border-primary-inverse {
			border-color: #ffffff;
		}

		.lg\\:border-top-primary-inverse {
			border-top-color: #ffffff;
		}

		.lg\\:border-right-primary-inverse {
			border-right-color: #ffffff;
		}

		.lg\\:border-bottom-primary-inverse {
			border-bottom-color: #ffffff;
		}

		.lg\\:border-left-primary-inverse {
			border-left-color: #ffffff;
		}
	}

	@media (width >= 1200px) {
		.xl\\:border-transparent {
			border-color: transparent;
		}

		.xl\\:border-current {
			border-color: currentcolor;
		}

		.xl\\:border-black {
			border-color: #000000;
		}

		.xl\\:border-top-black {
			border-top-color: #000000;
		}

		.xl\\:border-right-black {
			border-right-color: #000000;
		}

		.xl\\:border-bottom-black {
			border-bottom-color: #000000;
		}

		.xl\\:border-left-black {
			border-left-color: #000000;
		}

		.xl\\:border-white {
			border-color: #ffffff;
		}

		.xl\\:border-top-white {
			border-top-color: #ffffff;
		}

		.xl\\:border-right-white {
			border-right-color: #ffffff;
		}

		.xl\\:border-bottom-white {
			border-bottom-color: #ffffff;
		}

		.xl\\:border-left-white {
			border-left-color: #ffffff;
		}

		.xl\\:border-translucent {
			border-color: rgb(255 255 255 / 10%);
		}

		.xl\\:border-top-translucent {
			border-top-color: rgb(255 255 255 / 10%);
		}

		.xl\\:border-right-translucent {
			border-right-color: rgb(255 255 255 / 10%);
		}

		.xl\\:border-bottom-translucent {
			border-bottom-color: rgb(255 255 255 / 10%);
		}

		.xl\\:border-left-translucent {
			border-left-color: rgb(255 255 255 / 10%);
		}

		.xl\\:border-gray-100 {
			border-color: #f1f1f1;
		}

		.xl\\:border-top-gray-100 {
			border-top-color: #f1f1f1;
		}

		.xl\\:border-right-gray-100 {
			border-right-color: #f1f1f1;
		}

		.xl\\:border-bottom-gray-100 {
			border-bottom-color: #f1f1f1;
		}

		.xl\\:border-left-gray-100 {
			border-left-color: #f1f1f1;
		}

		.xl\\:border-gray-200 {
			border-color: #f1f1f1;
		}

		.xl\\:border-top-gray-200 {
			border-top-color: #f1f1f1;
		}

		.xl\\:border-right-gray-200 {
			border-right-color: #f1f1f1;
		}

		.xl\\:border-bottom-gray-200 {
			border-bottom-color: #f1f1f1;
		}

		.xl\\:border-left-gray-200 {
			border-left-color: #f1f1f1;
		}

		.xl\\:border-gray-300 {
			border-color: #e2e8f0;
		}

		.xl\\:border-top-gray-300 {
			border-top-color: #e2e8f0;
		}

		.xl\\:border-right-gray-300 {
			border-right-color: #e2e8f0;
		}

		.xl\\:border-bottom-gray-300 {
			border-bottom-color: #e2e8f0;
		}

		.xl\\:border-left-gray-300 {
			border-left-color: #e2e8f0;
		}

		.xl\\:border-gray-400 {
			border-color: #cbd5e0;
		}

		.xl\\:border-top-gray-400 {
			border-top-color: #cbd5e0;
		}

		.xl\\:border-right-gray-400 {
			border-right-color: #cbd5e0;
		}

		.xl\\:border-bottom-gray-400 {
			border-bottom-color: #cbd5e0;
		}

		.xl\\:border-left-gray-400 {
			border-left-color: #cbd5e0;
		}

		.xl\\:border-gray-500 {
			border-color: #a0aec0;
		}

		.xl\\:border-top-gray-500 {
			border-top-color: #a0aec0;
		}

		.xl\\:border-right-gray-500 {
			border-right-color: #a0aec0;
		}

		.xl\\:border-bottom-gray-500 {
			border-bottom-color: #a0aec0;
		}

		.xl\\:border-left-gray-500 {
			border-left-color: #a0aec0;
		}

		.xl\\:border-gray-600 {
			border-color: #777779;
		}

		.xl\\:border-top-gray-600 {
			border-top-color: #777779;
		}

		.xl\\:border-right-gray-600 {
			border-right-color: #777779;
		}

		.xl\\:border-bottom-gray-600 {
			border-bottom-color: #777779;
		}

		.xl\\:border-left-gray-600 {
			border-left-color: #777779;
		}

		.xl\\:border-gray-700 {
			border-color: #4a5568;
		}

		.xl\\:border-top-gray-700 {
			border-top-color: #4a5568;
		}

		.xl\\:border-right-gray-700 {
			border-right-color: #4a5568;
		}

		.xl\\:border-bottom-gray-700 {
			border-bottom-color: #4a5568;
		}

		.xl\\:border-left-gray-700 {
			border-left-color: #4a5568;
		}

		.xl\\:border-gray-800 {
			border-color: #2d3748;
		}

		.xl\\:border-top-gray-800 {
			border-top-color: #2d3748;
		}

		.xl\\:border-right-gray-800 {
			border-right-color: #2d3748;
		}

		.xl\\:border-bottom-gray-800 {
			border-bottom-color: #2d3748;
		}

		.xl\\:border-left-gray-800 {
			border-left-color: #2d3748;
		}

		.xl\\:border-gray-900 {
			border-color: #1a202c;
		}

		.xl\\:border-top-gray-900 {
			border-top-color: #1a202c;
		}

		.xl\\:border-right-gray-900 {
			border-right-color: #1a202c;
		}

		.xl\\:border-bottom-gray-900 {
			border-bottom-color: #1a202c;
		}

		.xl\\:border-left-gray-900 {
			border-left-color: #1a202c;
		}

		.xl\\:border-red-100 {
			border-color: #fff5f5;
		}

		.xl\\:border-top-red-100 {
			border-top-color: #fff5f5;
		}

		.xl\\:border-right-red-100 {
			border-right-color: #fff5f5;
		}

		.xl\\:border-bottom-red-100 {
			border-bottom-color: #fff5f5;
		}

		.xl\\:border-left-red-100 {
			border-left-color: #fff5f5;
		}

		.xl\\:border-red-300 {
			border-color: #feb2b2;
		}

		.xl\\:border-top-red-300 {
			border-top-color: #feb2b2;
		}

		.xl\\:border-right-red-300 {
			border-right-color: #feb2b2;
		}

		.xl\\:border-bottom-red-300 {
			border-bottom-color: #feb2b2;
		}

		.xl\\:border-left-red-300 {
			border-left-color: #feb2b2;
		}

		.xl\\:border-red-500 {
			border-color: #f56565;
		}

		.xl\\:border-top-red-500 {
			border-top-color: #f56565;
		}

		.xl\\:border-right-red-500 {
			border-right-color: #f56565;
		}

		.xl\\:border-bottom-red-500 {
			border-bottom-color: #f56565;
		}

		.xl\\:border-left-red-500 {
			border-left-color: #f56565;
		}

		.xl\\:border-red-700 {
			border-color: #c53030;
		}

		.xl\\:border-top-red-700 {
			border-top-color: #c53030;
		}

		.xl\\:border-right-red-700 {
			border-right-color: #c53030;
		}

		.xl\\:border-bottom-red-700 {
			border-bottom-color: #c53030;
		}

		.xl\\:border-left-red-700 {
			border-left-color: #c53030;
		}

		.xl\\:border-red-900 {
			border-color: #742a2a;
		}

		.xl\\:border-top-red-900 {
			border-top-color: #742a2a;
		}

		.xl\\:border-right-red-900 {
			border-right-color: #742a2a;
		}

		.xl\\:border-bottom-red-900 {
			border-bottom-color: #742a2a;
		}

		.xl\\:border-left-red-900 {
			border-left-color: #742a2a;
		}

		.xl\\:border-orange-100 {
			border-color: #fffaf0;
		}

		.xl\\:border-top-orange-100 {
			border-top-color: #fffaf0;
		}

		.xl\\:border-right-orange-100 {
			border-right-color: #fffaf0;
		}

		.xl\\:border-bottom-orange-100 {
			border-bottom-color: #fffaf0;
		}

		.xl\\:border-left-orange-100 {
			border-left-color: #fffaf0;
		}

		.xl\\:border-orange-300 {
			border-color: #fbd38d;
		}

		.xl\\:border-top-orange-300 {
			border-top-color: #fbd38d;
		}

		.xl\\:border-right-orange-300 {
			border-right-color: #fbd38d;
		}

		.xl\\:border-bottom-orange-300 {
			border-bottom-color: #fbd38d;
		}

		.xl\\:border-left-orange-300 {
			border-left-color: #fbd38d;
		}

		.xl\\:border-orange-500 {
			border-color: #ed8936;
		}

		.xl\\:border-top-orange-500 {
			border-top-color: #ed8936;
		}

		.xl\\:border-right-orange-500 {
			border-right-color: #ed8936;
		}

		.xl\\:border-bottom-orange-500 {
			border-bottom-color: #ed8936;
		}

		.xl\\:border-left-orange-500 {
			border-left-color: #ed8936;
		}

		.xl\\:border-orange-700 {
			border-color: #c05621;
		}

		.xl\\:border-top-orange-700 {
			border-top-color: #c05621;
		}

		.xl\\:border-right-orange-700 {
			border-right-color: #c05621;
		}

		.xl\\:border-bottom-orange-700 {
			border-bottom-color: #c05621;
		}

		.xl\\:border-left-orange-700 {
			border-left-color: #c05621;
		}

		.xl\\:border-orange-900 {
			border-color: #7b341e;
		}

		.xl\\:border-top-orange-900 {
			border-top-color: #7b341e;
		}

		.xl\\:border-right-orange-900 {
			border-right-color: #7b341e;
		}

		.xl\\:border-bottom-orange-900 {
			border-bottom-color: #7b341e;
		}

		.xl\\:border-left-orange-900 {
			border-left-color: #7b341e;
		}

		.xl\\:border-green-100 {
			border-color: #f0fff4;
		}

		.xl\\:border-top-green-100 {
			border-top-color: #f0fff4;
		}

		.xl\\:border-right-green-100 {
			border-right-color: #f0fff4;
		}

		.xl\\:border-bottom-green-100 {
			border-bottom-color: #f0fff4;
		}

		.xl\\:border-left-green-100 {
			border-left-color: #f0fff4;
		}

		.xl\\:border-green-300 {
			border-color: #9ae6b4;
		}

		.xl\\:border-top-green-300 {
			border-top-color: #9ae6b4;
		}

		.xl\\:border-right-green-300 {
			border-right-color: #9ae6b4;
		}

		.xl\\:border-bottom-green-300 {
			border-bottom-color: #9ae6b4;
		}

		.xl\\:border-left-green-300 {
			border-left-color: #9ae6b4;
		}

		.xl\\:border-green-500 {
			border-color: #48bb78;
		}

		.xl\\:border-top-green-500 {
			border-top-color: #48bb78;
		}

		.xl\\:border-right-green-500 {
			border-right-color: #48bb78;
		}

		.xl\\:border-bottom-green-500 {
			border-bottom-color: #48bb78;
		}

		.xl\\:border-left-green-500 {
			border-left-color: #48bb78;
		}

		.xl\\:border-green-700 {
			border-color: #2f855a;
		}

		.xl\\:border-top-green-700 {
			border-top-color: #2f855a;
		}

		.xl\\:border-right-green-700 {
			border-right-color: #2f855a;
		}

		.xl\\:border-bottom-green-700 {
			border-bottom-color: #2f855a;
		}

		.xl\\:border-left-green-700 {
			border-left-color: #2f855a;
		}

		.xl\\:border-green-900 {
			border-color: #22543d;
		}

		.xl\\:border-top-green-900 {
			border-top-color: #22543d;
		}

		.xl\\:border-right-green-900 {
			border-right-color: #22543d;
		}

		.xl\\:border-bottom-green-900 {
			border-bottom-color: #22543d;
		}

		.xl\\:border-left-green-900 {
			border-left-color: #22543d;
		}

		.xl\\:border-primary {
			border-color: #002e6c;
		}

		.xl\\:border-top-primary {
			border-top-color: #002e6c;
		}

		.xl\\:border-right-primary {
			border-right-color: #002e6c;
		}

		.xl\\:border-bottom-primary {
			border-bottom-color: #002e6c;
		}

		.xl\\:border-left-primary {
			border-left-color: #002e6c;
		}

		.xl\\:border-primary-inverse {
			border-color: #ffffff;
		}

		.xl\\:border-top-primary-inverse {
			border-top-color: #ffffff;
		}

		.xl\\:border-right-primary-inverse {
			border-right-color: #ffffff;
		}

		.xl\\:border-bottom-primary-inverse {
			border-bottom-color: #ffffff;
		}

		.xl\\:border-left-primary-inverse {
			border-left-color: #ffffff;
		}
	}

	.border-radius {
		border-radius: 0.25rem;
	}

	.border-radius-0 {
		border-radius: 0;
	}

	.border-radius-top {
		border-top-right-radius: 0.25rem;
		border-top-left-radius: 0.25rem;
	}

	.border-radius-right {
		border-top-right-radius: 0.25rem;
		border-bottom-right-radius: 0.25rem;
	}

	.border-radius-bottom {
		border-bottom-right-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
	}

	.border-radius-left {
		border-top-left-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
	}

	.rounded {
		border-radius: 2rem;
	}

	.circle {
		border-radius: 50%;
	}

	@media (width >= 576px) {
		.sm\\:border-radius {
			border-radius: 0.25rem;
		}

		.sm\\:border-radius-0 {
			border-radius: 0;
		}

		.sm\\:border-radius-top {
			border-top-right-radius: 0.25rem;
			border-top-left-radius: 0.25rem;
		}

		.sm\\:border-radius-right {
			border-top-right-radius: 0.25rem;
			border-bottom-right-radius: 0.25rem;
		}

		.sm\\:border-radius-bottom {
			border-bottom-right-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.sm\\:border-radius-left {
			border-top-left-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.sm\\:rounded {
			border-radius: 2rem;
		}

		.sm\\:circle {
			border-radius: 50%;
		}
	}

	@media (width >= 768px) {
		.md\\:border-radius {
			border-radius: 0.25rem;
		}

		.md\\:border-radius-0 {
			border-radius: 0;
		}

		.md\\:border-radius-top {
			border-top-right-radius: 0.25rem;
			border-top-left-radius: 0.25rem;
		}

		.md\\:border-radius-right {
			border-top-right-radius: 0.25rem;
			border-bottom-right-radius: 0.25rem;
		}

		.md\\:border-radius-bottom {
			border-bottom-right-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.md\\:border-radius-left {
			border-top-left-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.md\\:rounded {
			border-radius: 2rem;
		}

		.md\\:circle {
			border-radius: 50%;
		}
	}

	@media (width >= 992px) {
		.lg\\:border-radius {
			border-radius: 0.25rem;
		}

		.lg\\:border-radius-0 {
			border-radius: 0;
		}

		.lg\\:border-radius-top {
			border-top-right-radius: 0.25rem;
			border-top-left-radius: 0.25rem;
		}

		.lg\\:border-radius-right {
			border-top-right-radius: 0.25rem;
			border-bottom-right-radius: 0.25rem;
		}

		.lg\\:border-radius-bottom {
			border-bottom-right-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.lg\\:border-radius-left {
			border-top-left-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.lg\\:rounded {
			border-radius: 2rem;
		}

		.lg\\:circle {
			border-radius: 50%;
		}
	}

	@media (width >= 1200px) {
		.xl\\:border-radius {
			border-radius: 0.25rem;
		}

		.xl\\:border-radius-0 {
			border-radius: 0;
		}

		.xl\\:border-radius-top {
			border-top-right-radius: 0.25rem;
			border-top-left-radius: 0.25rem;
		}

		.xl\\:border-radius-right {
			border-top-right-radius: 0.25rem;
			border-bottom-right-radius: 0.25rem;
		}

		.xl\\:border-radius-bottom {
			border-bottom-right-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.xl\\:border-radius-left {
			border-top-left-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.xl\\:rounded {
			border-radius: 2rem;
		}

		.xl\\:circle {
			border-radius: 50%;
		}
	}

	.border-solid {
		border-style: solid;
	}

	.border-dashed {
		border-style: dashed;
	}

	.border-dotted {
		border-style: dotted;
	}

	.border-none {
		border-style: none;
	}

	.border-2 {
		border-width: 2px;
	}

	.border-top-2 {
		border-top-width: 2px;
	}

	.border-right-2 {
		border-right-width: 2px;
	}

	.border-bottom-2 {
		border-bottom-width: 2px;
	}

	.border-left-2 {
		border-left-width: 2px;
	}

	.border-3 {
		border-width: 3px;
	}

	.border-top-3 {
		border-top-width: 3px;
	}

	.border-right-3 {
		border-right-width: 3px;
	}

	.border-bottom-3 {
		border-bottom-width: 3px;
	}

	.border-left-3 {
		border-left-width: 3px;
	}

	.border-4 {
		border-width: 4px;
	}

	.border-top-4 {
		border-top-width: 4px;
	}

	.border-right-4 {
		border-right-width: 4px;
	}

	.border-bottom-4 {
		border-bottom-width: 4px;
	}

	.border-left-4 {
		border-left-width: 4px;
	}

	.border-0 {
		border-width: 0;
	}

	.border-top-0 {
		border-top-width: 0;
	}

	.border-right-0 {
		border-right-width: 0;
	}

	.border-bottom-0 {
		border-bottom-width: 0;
	}

	.border-left-0 {
		border-left-width: 0;
	}

	@media (width >= 576px) {
		.sm\\:border-2 {
			border-width: 2px;
		}

		.sm\\:border-top-2 {
			border-top-width: 2px;
		}

		.sm\\:border-right-2 {
			border-right-width: 2px;
		}

		.sm\\:border-bottom-2 {
			border-bottom-width: 2px;
		}

		.sm\\:border-left-2 {
			border-left-width: 2px;
		}

		.sm\\:border-3 {
			border-width: 3px;
		}

		.sm\\:border-top-3 {
			border-top-width: 3px;
		}

		.sm\\:border-right-3 {
			border-right-width: 3px;
		}

		.sm\\:border-bottom-3 {
			border-bottom-width: 3px;
		}

		.sm\\:border-left-3 {
			border-left-width: 3px;
		}

		.sm\\:border-4 {
			border-width: 4px;
		}

		.sm\\:border-top-4 {
			border-top-width: 4px;
		}

		.sm\\:border-right-4 {
			border-right-width: 4px;
		}

		.sm\\:border-bottom-4 {
			border-bottom-width: 4px;
		}

		.sm\\:border-left-4 {
			border-left-width: 4px;
		}

		.sm\\:border-0 {
			border-width: 0;
		}

		.sm\\:border-top-0 {
			border-top-width: 0;
		}

		.sm\\:border-right-0 {
			border-right-width: 0;
		}

		.sm\\:border-bottom-0 {
			border-bottom-width: 0;
		}

		.sm\\:border-left-0 {
			border-left-width: 0;
		}
	}

	@media (width >= 768px) {
		.md\\:border-2 {
			border-width: 2px;
		}

		.md\\:border-top-2 {
			border-top-width: 2px;
		}

		.md\\:border-right-2 {
			border-right-width: 2px;
		}

		.md\\:border-bottom-2 {
			border-bottom-width: 2px;
		}

		.md\\:border-left-2 {
			border-left-width: 2px;
		}

		.md\\:border-3 {
			border-width: 3px;
		}

		.md\\:border-top-3 {
			border-top-width: 3px;
		}

		.md\\:border-right-3 {
			border-right-width: 3px;
		}

		.md\\:border-bottom-3 {
			border-bottom-width: 3px;
		}

		.md\\:border-left-3 {
			border-left-width: 3px;
		}

		.md\\:border-4 {
			border-width: 4px;
		}

		.md\\:border-top-4 {
			border-top-width: 4px;
		}

		.md\\:border-right-4 {
			border-right-width: 4px;
		}

		.md\\:border-bottom-4 {
			border-bottom-width: 4px;
		}

		.md\\:border-left-4 {
			border-left-width: 4px;
		}

		.md\\:border-0 {
			border-width: 0;
		}

		.md\\:border-top-0 {
			border-top-width: 0;
		}

		.md\\:border-right-0 {
			border-right-width: 0;
		}

		.md\\:border-bottom-0 {
			border-bottom-width: 0;
		}

		.md\\:border-left-0 {
			border-left-width: 0;
		}
	}

	@media (width >= 992px) {
		.lg\\:border-2 {
			border-width: 2px;
		}

		.lg\\:border-top-2 {
			border-top-width: 2px;
		}

		.lg\\:border-right-2 {
			border-right-width: 2px;
		}

		.lg\\:border-bottom-2 {
			border-bottom-width: 2px;
		}

		.lg\\:border-left-2 {
			border-left-width: 2px;
		}

		.lg\\:border-3 {
			border-width: 3px;
		}

		.lg\\:border-top-3 {
			border-top-width: 3px;
		}

		.lg\\:border-right-3 {
			border-right-width: 3px;
		}

		.lg\\:border-bottom-3 {
			border-bottom-width: 3px;
		}

		.lg\\:border-left-3 {
			border-left-width: 3px;
		}

		.lg\\:border-4 {
			border-width: 4px;
		}

		.lg\\:border-top-4 {
			border-top-width: 4px;
		}

		.lg\\:border-right-4 {
			border-right-width: 4px;
		}

		.lg\\:border-bottom-4 {
			border-bottom-width: 4px;
		}

		.lg\\:border-left-4 {
			border-left-width: 4px;
		}

		.lg\\:border-0 {
			border-width: 0;
		}

		.lg\\:border-top-0 {
			border-top-width: 0;
		}

		.lg\\:border-right-0 {
			border-right-width: 0;
		}

		.lg\\:border-bottom-0 {
			border-bottom-width: 0;
		}

		.lg\\:border-left-0 {
			border-left-width: 0;
		}
	}

	@media (width >= 1200px) {
		.xl\\:border-2 {
			border-width: 2px;
		}

		.xl\\:border-top-2 {
			border-top-width: 2px;
		}

		.xl\\:border-right-2 {
			border-right-width: 2px;
		}

		.xl\\:border-bottom-2 {
			border-bottom-width: 2px;
		}

		.xl\\:border-left-2 {
			border-left-width: 2px;
		}

		.xl\\:border-3 {
			border-width: 3px;
		}

		.xl\\:border-top-3 {
			border-top-width: 3px;
		}

		.xl\\:border-right-3 {
			border-right-width: 3px;
		}

		.xl\\:border-bottom-3 {
			border-bottom-width: 3px;
		}

		.xl\\:border-left-3 {
			border-left-width: 3px;
		}

		.xl\\:border-4 {
			border-width: 4px;
		}

		.xl\\:border-top-4 {
			border-top-width: 4px;
		}

		.xl\\:border-right-4 {
			border-right-width: 4px;
		}

		.xl\\:border-bottom-4 {
			border-bottom-width: 4px;
		}

		.xl\\:border-left-4 {
			border-left-width: 4px;
		}

		.xl\\:border-0 {
			border-width: 0;
		}

		.xl\\:border-top-0 {
			border-top-width: 0;
		}

		.xl\\:border-right-0 {
			border-right-width: 0;
		}

		.xl\\:border-bottom-0 {
			border-bottom-width: 0;
		}

		.xl\\:border-left-0 {
			border-left-width: 0;
		}
	}

	.align-content-start {
		align-content: flex-start;
	}

	.align-content-end {
		align-content: flex-end;
	}

	.align-content-center {
		align-content: center;
	}

	.align-content-between {
		align-content: space-between;
	}

	.align-content-around {
		align-content: space-around;
	}

	.align-content-stretch {
		align-content: stretch;
	}

	@media (width >= 576px) {
		.sm\\:align-content-start {
			align-content: flex-start;
		}

		.sm\\:align-content-end {
			align-content: flex-end;
		}

		.sm\\:align-content-center {
			align-content: center;
		}

		.sm\\:align-content-between {
			align-content: space-between;
		}

		.sm\\:align-content-around {
			align-content: space-around;
		}

		.sm\\:align-content-stretch {
			align-content: stretch;
		}
	}

	@media (width >= 768px) {
		.md\\:align-content-start {
			align-content: flex-start;
		}

		.md\\:align-content-end {
			align-content: flex-end;
		}

		.md\\:align-content-center {
			align-content: center;
		}

		.md\\:align-content-between {
			align-content: space-between;
		}

		.md\\:align-content-around {
			align-content: space-around;
		}

		.md\\:align-content-stretch {
			align-content: stretch;
		}
	}

	@media (width >= 992px) {
		.lg\\:align-content-start {
			align-content: flex-start;
		}

		.lg\\:align-content-end {
			align-content: flex-end;
		}

		.lg\\:align-content-center {
			align-content: center;
		}

		.lg\\:align-content-between {
			align-content: space-between;
		}

		.lg\\:align-content-around {
			align-content: space-around;
		}

		.lg\\:align-content-stretch {
			align-content: stretch;
		}
	}

	@media (width >= 1200px) {
		.xl\\:align-content-start {
			align-content: flex-start;
		}

		.xl\\:align-content-end {
			align-content: flex-end;
		}

		.xl\\:align-content-center {
			align-content: center;
		}

		.xl\\:align-content-between {
			align-content: space-between;
		}

		.xl\\:align-content-around {
			align-content: space-around;
		}

		.xl\\:align-content-stretch {
			align-content: stretch;
		}
	}

	.align-items-start {
		align-items: flex-start;
	}

	.align-items-end {
		align-items: flex-end;
	}

	.align-items-center {
		align-items: center;
	}

	.align-items-baseline {
		align-items: baseline;
	}

	.align-items-stretch {
		align-items: stretch;
	}

	@media (width >= 576px) {
		.sm\\:align-items-start {
			align-items: flex-start;
		}

		.sm\\:align-items-end {
			align-items: flex-end;
		}

		.sm\\:align-items-center {
			align-items: center;
		}

		.sm\\:align-items-baseline {
			align-items: baseline;
		}

		.sm\\:align-items-stretch {
			align-items: stretch;
		}
	}

	@media (width >= 768px) {
		.md\\:align-items-start {
			align-items: flex-start;
		}

		.md\\:align-items-end {
			align-items: flex-end;
		}

		.md\\:align-items-center {
			align-items: center;
		}

		.md\\:align-items-baseline {
			align-items: baseline;
		}

		.md\\:align-items-stretch {
			align-items: stretch;
		}
	}

	@media (width >= 992px) {
		.lg\\:align-items-start {
			align-items: flex-start;
		}

		.lg\\:align-items-end {
			align-items: flex-end;
		}

		.lg\\:align-items-center {
			align-items: center;
		}

		.lg\\:align-items-baseline {
			align-items: baseline;
		}

		.lg\\:align-items-stretch {
			align-items: stretch;
		}
	}

	@media (width >= 1200px) {
		.xl\\:align-items-start {
			align-items: flex-start;
		}

		.xl\\:align-items-end {
			align-items: flex-end;
		}

		.xl\\:align-items-center {
			align-items: center;
		}

		.xl\\:align-items-baseline {
			align-items: baseline;
		}

		.xl\\:align-items-stretch {
			align-items: stretch;
		}
	}

	.align-self-auto {
		align-self: auto;
	}

	.align-self-start {
		align-self: flex-start;
	}

	.align-self-end {
		align-self: flex-end;
	}

	.align-self-center {
		align-self: center;
	}

	.align-self-baseline {
		align-self: baseline;
	}

	.align-self-stretch {
		align-self: stretch;
	}

	@media (width >= 576px) {
		.sm\\:align-self-auto {
			align-self: auto;
		}

		.sm\\:align-self-start {
			align-self: flex-start;
		}

		.sm\\:align-self-end {
			align-self: flex-end;
		}

		.sm\\:align-self-center {
			align-self: center;
		}

		.sm\\:align-self-baseline {
			align-self: baseline;
		}

		.sm\\:align-self-stretch {
			align-self: stretch;
		}
	}

	@media (width >= 768px) {
		.md\\:align-self-auto {
			align-self: auto;
		}

		.md\\:align-self-start {
			align-self: flex-start;
		}

		.md\\:align-self-end {
			align-self: flex-end;
		}

		.md\\:align-self-center {
			align-self: center;
		}

		.md\\:align-self-baseline {
			align-self: baseline;
		}

		.md\\:align-self-stretch {
			align-self: stretch;
		}
	}

	@media (width >= 992px) {
		.lg\\:align-self-auto {
			align-self: auto;
		}

		.lg\\:align-self-start {
			align-self: flex-start;
		}

		.lg\\:align-self-end {
			align-self: flex-end;
		}

		.lg\\:align-self-center {
			align-self: center;
		}

		.lg\\:align-self-baseline {
			align-self: baseline;
		}

		.lg\\:align-self-stretch {
			align-self: stretch;
		}
	}

	@media (width >= 1200px) {
		.xl\\:align-self-auto {
			align-self: auto;
		}

		.xl\\:align-self-start {
			align-self: flex-start;
		}

		.xl\\:align-self-end {
			align-self: flex-end;
		}

		.xl\\:align-self-center {
			align-self: center;
		}

		.xl\\:align-self-baseline {
			align-self: baseline;
		}

		.xl\\:align-self-stretch {
			align-self: stretch;
		}
	}

	.flex-initial {
		flex: initial;
	}

	.flex-1 {
		flex: 1;
	}

	.flex-auto {
		flex: auto;
	}

	.flex-none {
		flex: none;
	}

	.flex-fill {
		flex: 1 1 auto;
	}

	.flex-grow {
		flex-grow: 1;
	}

	.flex-grow-0 {
		flex-grow: 0;
	}

	.flex-shrink {
		flex-shrink: 1;
	}

	.flex-shrink-0 {
		flex-shrink: 0;
	}

	@media (width >= 576px) {
		.sm\\:flex-initial {
			flex: initial;
		}

		.sm\\:flex-1 {
			flex: 1;
		}

		.sm\\:flex-auto {
			flex: auto;
		}

		.sm\\:flex-none {
			flex: none;
		}

		.sm\\:flex-fill {
			flex: 1 1 auto;
		}

		.sm\\:flex-grow {
			flex-grow: 1;
		}

		.sm\\:flex-grow-0 {
			flex-grow: 0;
		}

		.sm\\:flex-shrink {
			flex-shrink: 1;
		}

		.sm\\:flex-shrink-0 {
			flex-shrink: 0;
		}
	}

	@media (width >= 768px) {
		.md\\:flex-initial {
			flex: initial;
		}

		.md\\:flex-1 {
			flex: 1;
		}

		.md\\:flex-auto {
			flex: auto;
		}

		.md\\:flex-none {
			flex: none;
		}

		.md\\:flex-fill {
			flex: 1 1 auto;
		}

		.md\\:flex-grow {
			flex-grow: 1;
		}

		.md\\:flex-grow-0 {
			flex-grow: 0;
		}

		.md\\:flex-shrink {
			flex-shrink: 1;
		}

		.md\\:flex-shrink-0 {
			flex-shrink: 0;
		}
	}

	@media (width >= 992px) {
		.lg\\:flex-initial {
			flex: initial;
		}

		.lg\\:flex-1 {
			flex: 1;
		}

		.lg\\:flex-auto {
			flex: auto;
		}

		.lg\\:flex-none {
			flex: none;
		}

		.lg\\:flex-fill {
			flex: 1 1 auto;
		}

		.lg\\:flex-grow {
			flex-grow: 1;
		}

		.lg\\:flex-grow-0 {
			flex-grow: 0;
		}

		.lg\\:flex-shrink {
			flex-shrink: 1;
		}

		.lg\\:flex-shrink-0 {
			flex-shrink: 0;
		}
	}

	@media (width >= 1200px) {
		.xl\\:flex-initial {
			flex: initial;
		}

		.xl\\:flex-1 {
			flex: 1;
		}

		.xl\\:flex-auto {
			flex: auto;
		}

		.xl\\:flex-none {
			flex: none;
		}

		.xl\\:flex-fill {
			flex: 1 1 auto;
		}

		.xl\\:flex-grow {
			flex-grow: 1;
		}

		.xl\\:flex-grow-0 {
			flex-grow: 0;
		}

		.xl\\:flex-shrink {
			flex-shrink: 1;
		}

		.xl\\:flex-shrink-0 {
			flex-shrink: 0;
		}
	}

	.flex-row {
		flex-direction: row;
	}

	.flex-column {
		flex-direction: column;
	}

	.flex-row-reverse {
		flex-direction: row-reverse;
	}

	.flex-column-reverse {
		flex-direction: column-reverse;
	}

	@media (width >= 576px) {
		.sm\\:flex-row {
			flex-direction: row;
		}

		.sm\\:flex-column {
			flex-direction: column;
		}

		.sm\\:flex-row-reverse {
			flex-direction: row-reverse;
		}

		.sm\\:flex-column-reverse {
			flex-direction: column-reverse;
		}
	}

	@media (width >= 768px) {
		.md\\:flex-row {
			flex-direction: row;
		}

		.md\\:flex-column {
			flex-direction: column;
		}

		.md\\:flex-row-reverse {
			flex-direction: row-reverse;
		}

		.md\\:flex-column-reverse {
			flex-direction: column-reverse;
		}
	}

	@media (width >= 992px) {
		.lg\\:flex-row {
			flex-direction: row;
		}

		.lg\\:flex-column {
			flex-direction: column;
		}

		.lg\\:flex-row-reverse {
			flex-direction: row-reverse;
		}

		.lg\\:flex-column-reverse {
			flex-direction: column-reverse;
		}
	}

	@media (width >= 1200px) {
		.xl\\:flex-row {
			flex-direction: row;
		}

		.xl\\:flex-column {
			flex-direction: column;
		}

		.xl\\:flex-row-reverse {
			flex-direction: row-reverse;
		}

		.xl\\:flex-column-reverse {
			flex-direction: column-reverse;
		}
	}

	.flex-first {
		order: -1;
	}

	.flex-last {
		order: 13;
	}

	@media (width >= 576px) {
		.sm\\:flex-first {
			order: -1;
		}

		.sm\\:flex-last {
			order: 13;
		}
	}

	@media (width >= 768px) {
		.md\\:flex-first {
			order: -1;
		}

		.md\\:flex-last {
			order: 13;
		}
	}

	@media (width >= 992px) {
		.lg\\:flex-first {
			order: -1;
		}

		.lg\\:flex-last {
			order: 13;
		}
	}

	@media (width >= 1200px) {
		.xl\\:flex-first {
			order: -1;
		}

		.xl\\:flex-last {
			order: 13;
		}
	}

	.flex-wrap {
		flex-wrap: wrap;
	}

	.flex-no-wrap {
		flex-wrap: nowrap;
	}

	.flex-wrap-reverse {
		flex-wrap: wrap-reverse;
	}

	@media (width >= 576px) {
		.sm\\:flex-wrap {
			flex-wrap: wrap;
		}

		.sm\\:flex-no-wrap {
			flex-wrap: nowrap;
		}

		.sm\\:flex-wrap-reverse {
			flex-wrap: wrap-reverse;
		}
	}

	@media (width >= 768px) {
		.md\\:flex-wrap {
			flex-wrap: wrap;
		}

		.md\\:flex-no-wrap {
			flex-wrap: nowrap;
		}

		.md\\:flex-wrap-reverse {
			flex-wrap: wrap-reverse;
		}
	}

	@media (width >= 992px) {
		.lg\\:flex-wrap {
			flex-wrap: wrap;
		}

		.lg\\:flex-no-wrap {
			flex-wrap: nowrap;
		}

		.lg\\:flex-wrap-reverse {
			flex-wrap: wrap-reverse;
		}
	}

	@media (width >= 1200px) {
		.xl\\:flex-wrap {
			flex-wrap: wrap;
		}

		.xl\\:flex-no-wrap {
			flex-wrap: nowrap;
		}

		.xl\\:flex-wrap-reverse {
			flex-wrap: wrap-reverse;
		}
	}

	.justify-content-start {
		justify-content: flex-start;
	}

	.justify-content-end {
		justify-content: flex-end;
	}

	.justify-content-center {
		justify-content: center;
	}

	.justify-content-between {
		justify-content: space-between;
	}

	.justify-content-around {
		justify-content: space-around;
	}

	@media (width >= 576px) {
		.sm\\:justify-content-start {
			justify-content: flex-start;
		}

		.sm\\:justify-content-end {
			justify-content: flex-end;
		}

		.sm\\:justify-content-center {
			justify-content: center;
		}

		.sm\\:justify-content-between {
			justify-content: space-between;
		}

		.sm\\:justify-content-around {
			justify-content: space-around;
		}
	}

	@media (width >= 768px) {
		.md\\:justify-content-start {
			justify-content: flex-start;
		}

		.md\\:justify-content-end {
			justify-content: flex-end;
		}

		.md\\:justify-content-center {
			justify-content: center;
		}

		.md\\:justify-content-between {
			justify-content: space-between;
		}

		.md\\:justify-content-around {
			justify-content: space-around;
		}
	}

	@media (width >= 992px) {
		.lg\\:justify-content-start {
			justify-content: flex-start;
		}

		.lg\\:justify-content-end {
			justify-content: flex-end;
		}

		.lg\\:justify-content-center {
			justify-content: center;
		}

		.lg\\:justify-content-between {
			justify-content: space-between;
		}

		.lg\\:justify-content-around {
			justify-content: space-around;
		}
	}

	@media (width >= 1200px) {
		.xl\\:justify-content-start {
			justify-content: flex-start;
		}

		.xl\\:justify-content-end {
			justify-content: flex-end;
		}

		.xl\\:justify-content-center {
			justify-content: center;
		}

		.xl\\:justify-content-between {
			justify-content: space-between;
		}

		.xl\\:justify-content-around {
			justify-content: space-around;
		}
	}

	.-mt-1px {
		margin-top: -1px;
	}

	.-mb-1px {
		margin-bottom: -1px;
	}

	.m-0 {
		margin: 0;
	}

	.mt-0,
	.my-0 {
		margin-top: 0;
	}

	.mr-0,
	.mx-0 {
		margin-right: 0;
	}

	.mb-0,
	.my-0 {
		margin-bottom: 0;
	}

	.ml-0,
	.mx-0 {
		margin-left: 0;
	}

	.-m-0 {
		margin: 0;
	}

	.-mt-0,
	.-my-0 {
		margin-top: 0;
	}

	.-mr-0,
	.-mx-0 {
		margin-right: 0;
	}

	.-mb-0,
	.-my-0 {
		margin-bottom: 0;
	}

	.-ml-0,
	.-mx-0 {
		margin-left: 0;
	}

	.m-1 {
		margin: 6px;
	}

	.mt-1,
	.my-1 {
		margin-top: 6px;
	}

	.mr-1,
	.mx-1 {
		margin-right: 6px;
	}

	.mb-1,
	.my-1 {
		margin-bottom: 6px;
	}

	.ml-1,
	.mx-1 {
		margin-left: 6px;
	}

	.-m-1 {
		margin: -6px;
	}

	.-mt-1,
	.-my-1 {
		margin-top: -6px;
	}

	.-mr-1,
	.-mx-1 {
		margin-right: -6px;
	}

	.-mb-1,
	.-my-1 {
		margin-bottom: -6px;
	}

	.-ml-1,
	.-mx-1 {
		margin-left: -6px;
	}

	.m-2 {
		margin: 10px;
	}

	.mt-2,
	.my-2 {
		margin-top: 10px;
	}

	.mr-2,
	.mx-2 {
		margin-right: 10px;
	}

	.mb-2,
	.my-2 {
		margin-bottom: 10px;
	}

	.ml-2,
	.mx-2 {
		margin-left: 10px;
	}

	.-m-2 {
		margin: -10px;
	}

	.-mt-2,
	.-my-2 {
		margin-top: -10px;
	}

	.-mr-2,
	.-mx-2 {
		margin-right: -10px;
	}

	.-mb-2,
	.-my-2 {
		margin-bottom: -10px;
	}

	.-ml-2,
	.-mx-2 {
		margin-left: -10px;
	}

	.m-3 {
		margin: 12px;
	}

	.mt-3,
	.my-3 {
		margin-top: 12px;
	}

	.mr-3,
	.mx-3 {
		margin-right: 12px;
	}

	.mb-3,
	.my-3 {
		margin-bottom: 12px;
	}

	.ml-3,
	.mx-3 {
		margin-left: 12px;
	}

	.-m-3 {
		margin: -12px;
	}

	.-mt-3,
	.-my-3 {
		margin-top: -12px;
	}

	.-mr-3,
	.-mx-3 {
		margin-right: -12px;
	}

	.-mb-3,
	.-my-3 {
		margin-bottom: -12px;
	}

	.-ml-3,
	.-mx-3 {
		margin-left: -12px;
	}

	.m-4 {
		margin: 16px;
	}

	.mt-4,
	.my-4 {
		margin-top: 16px;
	}

	.mr-4,
	.mx-4 {
		margin-right: 16px;
	}

	.mb-4,
	.my-4 {
		margin-bottom: 16px;
	}

	.ml-4,
	.mx-4 {
		margin-left: 16px;
	}

	.-m-4 {
		margin: -16px;
	}

	.-mt-4,
	.-my-4 {
		margin-top: -16px;
	}

	.-mr-4,
	.-mx-4 {
		margin-right: -16px;
	}

	.-mb-4,
	.-my-4 {
		margin-bottom: -16px;
	}

	.-ml-4,
	.-mx-4 {
		margin-left: -16px;
	}

	.m-5 {
		margin: 24px;
	}

	.mt-5,
	.my-5 {
		margin-top: 24px;
	}

	.mr-5,
	.mx-5 {
		margin-right: 24px;
	}

	.mb-5,
	.my-5 {
		margin-bottom: 24px;
	}

	.ml-5,
	.mx-5 {
		margin-left: 24px;
	}

	.-m-5 {
		margin: -24px;
	}

	.-mt-5,
	.-my-5 {
		margin-top: -24px;
	}

	.-mr-5,
	.-mx-5 {
		margin-right: -24px;
	}

	.-mb-5,
	.-my-5 {
		margin-bottom: -24px;
	}

	.-ml-5,
	.-mx-5 {
		margin-left: -24px;
	}

	.m-6 {
		margin: 2rem;
	}

	.mt-6,
	.my-6 {
		margin-top: 2rem;
	}

	.mr-6,
	.mx-6 {
		margin-right: 2rem;
	}

	.mb-6,
	.my-6 {
		margin-bottom: 2rem;
	}

	.ml-6,
	.mx-6 {
		margin-left: 2rem;
	}

	.-m-6 {
		margin: -2rem;
	}

	.-mt-6,
	.-my-6 {
		margin-top: -2rem;
	}

	.-mr-6,
	.-mx-6 {
		margin-right: -2rem;
	}

	.-mb-6,
	.-my-6 {
		margin-bottom: -2rem;
	}

	.-ml-6,
	.-mx-6 {
		margin-left: -2rem;
	}

	.m-7 {
		margin: 3rem;
	}

	.mt-7,
	.my-7 {
		margin-top: 3rem;
	}

	.mr-7,
	.mx-7 {
		margin-right: 3rem;
	}

	.mb-7,
	.my-7 {
		margin-bottom: 3rem;
	}

	.ml-7,
	.mx-7 {
		margin-left: 3rem;
	}

	.-m-7 {
		margin: -3rem;
	}

	.-mt-7,
	.-my-7 {
		margin-top: -3rem;
	}

	.-mr-7,
	.-mx-7 {
		margin-right: -3rem;
	}

	.-mb-7,
	.-my-7 {
		margin-bottom: -3rem;
	}

	.-ml-7,
	.-mx-7 {
		margin-left: -3rem;
	}

	.m-8 {
		margin: 4rem;
	}

	.mt-8,
	.my-8 {
		margin-top: 4rem;
	}

	.mr-8,
	.mx-8 {
		margin-right: 4rem;
	}

	.mb-8,
	.my-8 {
		margin-bottom: 4rem;
	}

	.ml-8,
	.mx-8 {
		margin-left: 4rem;
	}

	.-m-8 {
		margin: -4rem;
	}

	.-mt-8,
	.-my-8 {
		margin-top: -4rem;
	}

	.-mr-8,
	.-mx-8 {
		margin-right: -4rem;
	}

	.-mb-8,
	.-my-8 {
		margin-bottom: -4rem;
	}

	.-ml-8,
	.-mx-8 {
		margin-left: -4rem;
	}

	.m-9 {
		margin: 6rem;
	}

	.mt-9,
	.my-9 {
		margin-top: 6rem;
	}

	.mr-9,
	.mx-9 {
		margin-right: 6rem;
	}

	.mb-9,
	.my-9 {
		margin-bottom: 6rem;
	}

	.ml-9,
	.mx-9 {
		margin-left: 6rem;
	}

	.-m-9 {
		margin: -6rem;
	}

	.-mt-9,
	.-my-9 {
		margin-top: -6rem;
	}

	.-mr-9,
	.-mx-9 {
		margin-right: -6rem;
	}

	.-mb-9,
	.-my-9 {
		margin-bottom: -6rem;
	}

	.-ml-9,
	.-mx-9 {
		margin-left: -6rem;
	}

	.m-auto {
		margin: auto;
	}

	.mt-auto,
	.my-auto {
		margin-top: auto;
	}

	.mr-auto,
	.mx-auto {
		margin-right: auto;
	}

	.mb-auto,
	.my-auto {
		margin-bottom: auto;
	}

	.ml-auto,
	.mx-auto {
		margin-left: auto;
	}

	@media (width >= 576px) {
		.sm\\:m-0 {
			margin: 0;
		}

		.sm\\:mt-0,
		.sm\\:my-0 {
			margin-top: 0;
		}

		.sm\\:mr-0,
		.sm\\:mx-0 {
			margin-right: 0;
		}

		.sm\\:mb-0,
		.sm\\:my-0 {
			margin-bottom: 0;
		}

		.sm\\:ml-0,
		.sm\\:mx-0 {
			margin-left: 0;
		}

		.sm\\:-m-0 {
			margin: 0;
		}

		.sm\\:-mt-0,
		.sm\\:-my-0 {
			margin-top: 0;
		}

		.sm\\:-mr-0,
		.sm\\:-mx-0 {
			margin-right: 0;
		}

		.sm\\:-mb-0,
		.sm\\:-my-0 {
			margin-bottom: 0;
		}

		.sm\\:-ml-0,
		.sm\\:-mx-0 {
			margin-left: 0;
		}

		.sm\\:m-1 {
			margin: 6px;
		}

		.sm\\:mt-1,
		.sm\\:my-1 {
			margin-top: 6px;
		}

		.sm\\:mr-1,
		.sm\\:mx-1 {
			margin-right: 6px;
		}

		.sm\\:mb-1,
		.sm\\:my-1 {
			margin-bottom: 6px;
		}

		.sm\\:ml-1,
		.sm\\:mx-1 {
			margin-left: 6px;
		}

		.sm\\:-m-1 {
			margin: -6px;
		}

		.sm\\:-mt-1,
		.sm\\:-my-1 {
			margin-top: -6px;
		}

		.sm\\:-mr-1,
		.sm\\:-mx-1 {
			margin-right: -6px;
		}

		.sm\\:-mb-1,
		.sm\\:-my-1 {
			margin-bottom: -6px;
		}

		.sm\\:-ml-1,
		.sm\\:-mx-1 {
			margin-left: -6px;
		}

		.sm\\:m-2 {
			margin: 10px;
		}

		.sm\\:mt-2,
		.sm\\:my-2 {
			margin-top: 10px;
		}

		.sm\\:mr-2,
		.sm\\:mx-2 {
			margin-right: 10px;
		}

		.sm\\:mb-2,
		.sm\\:my-2 {
			margin-bottom: 10px;
		}

		.sm\\:ml-2,
		.sm\\:mx-2 {
			margin-left: 10px;
		}

		.sm\\:-m-2 {
			margin: -10px;
		}

		.sm\\:-mt-2,
		.sm\\:-my-2 {
			margin-top: -10px;
		}

		.sm\\:-mr-2,
		.sm\\:-mx-2 {
			margin-right: -10px;
		}

		.sm\\:-mb-2,
		.sm\\:-my-2 {
			margin-bottom: -10px;
		}

		.sm\\:-ml-2,
		.sm\\:-mx-2 {
			margin-left: -10px;
		}

		.sm\\:m-3 {
			margin: 12px;
		}

		.sm\\:mt-3,
		.sm\\:my-3 {
			margin-top: 12px;
		}

		.sm\\:mr-3,
		.sm\\:mx-3 {
			margin-right: 12px;
		}

		.sm\\:mb-3,
		.sm\\:my-3 {
			margin-bottom: 12px;
		}

		.sm\\:ml-3,
		.sm\\:mx-3 {
			margin-left: 12px;
		}

		.sm\\:-m-3 {
			margin: -12px;
		}

		.sm\\:-mt-3,
		.sm\\:-my-3 {
			margin-top: -12px;
		}

		.sm\\:-mr-3,
		.sm\\:-mx-3 {
			margin-right: -12px;
		}

		.sm\\:-mb-3,
		.sm\\:-my-3 {
			margin-bottom: -12px;
		}

		.sm\\:-ml-3,
		.sm\\:-mx-3 {
			margin-left: -12px;
		}

		.sm\\:m-4 {
			margin: 16px;
		}

		.sm\\:mt-4,
		.sm\\:my-4 {
			margin-top: 16px;
		}

		.sm\\:mr-4,
		.sm\\:mx-4 {
			margin-right: 16px;
		}

		.sm\\:mb-4,
		.sm\\:my-4 {
			margin-bottom: 16px;
		}

		.sm\\:ml-4,
		.sm\\:mx-4 {
			margin-left: 16px;
		}

		.sm\\:-m-4 {
			margin: -16px;
		}

		.sm\\:-mt-4,
		.sm\\:-my-4 {
			margin-top: -16px;
		}

		.sm\\:-mr-4,
		.sm\\:-mx-4 {
			margin-right: -16px;
		}

		.sm\\:-mb-4,
		.sm\\:-my-4 {
			margin-bottom: -16px;
		}

		.sm\\:-ml-4,
		.sm\\:-mx-4 {
			margin-left: -16px;
		}

		.sm\\:m-5 {
			margin: 24px;
		}

		.sm\\:mt-5,
		.sm\\:my-5 {
			margin-top: 24px;
		}

		.sm\\:mr-5,
		.sm\\:mx-5 {
			margin-right: 24px;
		}

		.sm\\:mb-5,
		.sm\\:my-5 {
			margin-bottom: 24px;
		}

		.sm\\:ml-5,
		.sm\\:mx-5 {
			margin-left: 24px;
		}

		.sm\\:-m-5 {
			margin: -24px;
		}

		.sm\\:-mt-5,
		.sm\\:-my-5 {
			margin-top: -24px;
		}

		.sm\\:-mr-5,
		.sm\\:-mx-5 {
			margin-right: -24px;
		}

		.sm\\:-mb-5,
		.sm\\:-my-5 {
			margin-bottom: -24px;
		}

		.sm\\:-ml-5,
		.sm\\:-mx-5 {
			margin-left: -24px;
		}

		.sm\\:m-6 {
			margin: 2rem;
		}

		.sm\\:mt-6,
		.sm\\:my-6 {
			margin-top: 2rem;
		}

		.sm\\:mr-6,
		.sm\\:mx-6 {
			margin-right: 2rem;
		}

		.sm\\:mb-6,
		.sm\\:my-6 {
			margin-bottom: 2rem;
		}

		.sm\\:ml-6,
		.sm\\:mx-6 {
			margin-left: 2rem;
		}

		.sm\\:-m-6 {
			margin: -2rem;
		}

		.sm\\:-mt-6,
		.sm\\:-my-6 {
			margin-top: -2rem;
		}

		.sm\\:-mr-6,
		.sm\\:-mx-6 {
			margin-right: -2rem;
		}

		.sm\\:-mb-6,
		.sm\\:-my-6 {
			margin-bottom: -2rem;
		}

		.sm\\:-ml-6,
		.sm\\:-mx-6 {
			margin-left: -2rem;
		}

		.sm\\:m-7 {
			margin: 3rem;
		}

		.sm\\:mt-7,
		.sm\\:my-7 {
			margin-top: 3rem;
		}

		.sm\\:mr-7,
		.sm\\:mx-7 {
			margin-right: 3rem;
		}

		.sm\\:mb-7,
		.sm\\:my-7 {
			margin-bottom: 3rem;
		}

		.sm\\:ml-7,
		.sm\\:mx-7 {
			margin-left: 3rem;
		}

		.sm\\:-m-7 {
			margin: -3rem;
		}

		.sm\\:-mt-7,
		.sm\\:-my-7 {
			margin-top: -3rem;
		}

		.sm\\:-mr-7,
		.sm\\:-mx-7 {
			margin-right: -3rem;
		}

		.sm\\:-mb-7,
		.sm\\:-my-7 {
			margin-bottom: -3rem;
		}

		.sm\\:-ml-7,
		.sm\\:-mx-7 {
			margin-left: -3rem;
		}

		.sm\\:m-8 {
			margin: 4rem;
		}

		.sm\\:mt-8,
		.sm\\:my-8 {
			margin-top: 4rem;
		}

		.sm\\:mr-8,
		.sm\\:mx-8 {
			margin-right: 4rem;
		}

		.sm\\:mb-8,
		.sm\\:my-8 {
			margin-bottom: 4rem;
		}

		.sm\\:ml-8,
		.sm\\:mx-8 {
			margin-left: 4rem;
		}

		.sm\\:-m-8 {
			margin: -4rem;
		}

		.sm\\:-mt-8,
		.sm\\:-my-8 {
			margin-top: -4rem;
		}

		.sm\\:-mr-8,
		.sm\\:-mx-8 {
			margin-right: -4rem;
		}

		.sm\\:-mb-8,
		.sm\\:-my-8 {
			margin-bottom: -4rem;
		}

		.sm\\:-ml-8,
		.sm\\:-mx-8 {
			margin-left: -4rem;
		}

		.sm\\:m-9 {
			margin: 6rem;
		}

		.sm\\:mt-9,
		.sm\\:my-9 {
			margin-top: 6rem;
		}

		.sm\\:mr-9,
		.sm\\:mx-9 {
			margin-right: 6rem;
		}

		.sm\\:mb-9,
		.sm\\:my-9 {
			margin-bottom: 6rem;
		}

		.sm\\:ml-9,
		.sm\\:mx-9 {
			margin-left: 6rem;
		}

		.sm\\:-m-9 {
			margin: -6rem;
		}

		.sm\\:-mt-9,
		.sm\\:-my-9 {
			margin-top: -6rem;
		}

		.sm\\:-mr-9,
		.sm\\:-mx-9 {
			margin-right: -6rem;
		}

		.sm\\:-mb-9,
		.sm\\:-my-9 {
			margin-bottom: -6rem;
		}

		.sm\\:-ml-9,
		.sm\\:-mx-9 {
			margin-left: -6rem;
		}

		.sm\\:m-auto {
			margin: auto;
		}

		.sm\\:mt-auto,
		.sm\\:my-auto {
			margin-top: auto;
		}

		.sm\\:mr-auto,
		.sm\\:mx-auto {
			margin-right: auto;
		}

		.sm\\:mb-auto,
		.sm\\:my-auto {
			margin-bottom: auto;
		}

		.sm\\:ml-auto,
		.sm\\:mx-auto {
			margin-left: auto;
		}
	}

	@media (width >= 768px) {
		.md\\:m-0 {
			margin: 0;
		}

		.md\\:mt-0,
		.md\\:my-0 {
			margin-top: 0;
		}

		.md\\:mr-0,
		.md\\:mx-0 {
			margin-right: 0;
		}

		.md\\:mb-0,
		.md\\:my-0 {
			margin-bottom: 0;
		}

		.md\\:ml-0,
		.md\\:mx-0 {
			margin-left: 0;
		}

		.md\\:-m-0 {
			margin: 0;
		}

		.md\\:-mt-0,
		.md\\:-my-0 {
			margin-top: 0;
		}

		.md\\:-mr-0,
		.md\\:-mx-0 {
			margin-right: 0;
		}

		.md\\:-mb-0,
		.md\\:-my-0 {
			margin-bottom: 0;
		}

		.md\\:-ml-0,
		.md\\:-mx-0 {
			margin-left: 0;
		}

		.md\\:m-1 {
			margin: 6px;
		}

		.md\\:mt-1,
		.md\\:my-1 {
			margin-top: 6px;
		}

		.md\\:mr-1,
		.md\\:mx-1 {
			margin-right: 6px;
		}

		.md\\:mb-1,
		.md\\:my-1 {
			margin-bottom: 6px;
		}

		.md\\:ml-1,
		.md\\:mx-1 {
			margin-left: 6px;
		}

		.md\\:-m-1 {
			margin: -6px;
		}

		.md\\:-mt-1,
		.md\\:-my-1 {
			margin-top: -6px;
		}

		.md\\:-mr-1,
		.md\\:-mx-1 {
			margin-right: -6px;
		}

		.md\\:-mb-1,
		.md\\:-my-1 {
			margin-bottom: -6px;
		}

		.md\\:-ml-1,
		.md\\:-mx-1 {
			margin-left: -6px;
		}

		.md\\:m-2 {
			margin: 10px;
		}

		.md\\:mt-2,
		.md\\:my-2 {
			margin-top: 10px;
		}

		.md\\:mr-2,
		.md\\:mx-2 {
			margin-right: 10px;
		}

		.md\\:mb-2,
		.md\\:my-2 {
			margin-bottom: 10px;
		}

		.md\\:ml-2,
		.md\\:mx-2 {
			margin-left: 10px;
		}

		.md\\:-m-2 {
			margin: -10px;
		}

		.md\\:-mt-2,
		.md\\:-my-2 {
			margin-top: -10px;
		}

		.md\\:-mr-2,
		.md\\:-mx-2 {
			margin-right: -10px;
		}

		.md\\:-mb-2,
		.md\\:-my-2 {
			margin-bottom: -10px;
		}

		.md\\:-ml-2,
		.md\\:-mx-2 {
			margin-left: -10px;
		}

		.md\\:m-3 {
			margin: 12px;
		}

		.md\\:mt-3,
		.md\\:my-3 {
			margin-top: 12px;
		}

		.md\\:mr-3,
		.md\\:mx-3 {
			margin-right: 12px;
		}

		.md\\:mb-3,
		.md\\:my-3 {
			margin-bottom: 12px;
		}

		.md\\:ml-3,
		.md\\:mx-3 {
			margin-left: 12px;
		}

		.md\\:-m-3 {
			margin: -12px;
		}

		.md\\:-mt-3,
		.md\\:-my-3 {
			margin-top: -12px;
		}

		.md\\:-mr-3,
		.md\\:-mx-3 {
			margin-right: -12px;
		}

		.md\\:-mb-3,
		.md\\:-my-3 {
			margin-bottom: -12px;
		}

		.md\\:-ml-3,
		.md\\:-mx-3 {
			margin-left: -12px;
		}

		.md\\:m-4 {
			margin: 16px;
		}

		.md\\:mt-4,
		.md\\:my-4 {
			margin-top: 16px;
		}

		.md\\:mr-4,
		.md\\:mx-4 {
			margin-right: 16px;
		}

		.md\\:mb-4,
		.md\\:my-4 {
			margin-bottom: 16px;
		}

		.md\\:ml-4,
		.md\\:mx-4 {
			margin-left: 16px;
		}

		.md\\:-m-4 {
			margin: -16px;
		}

		.md\\:-mt-4,
		.md\\:-my-4 {
			margin-top: -16px;
		}

		.md\\:-mr-4,
		.md\\:-mx-4 {
			margin-right: -16px;
		}

		.md\\:-mb-4,
		.md\\:-my-4 {
			margin-bottom: -16px;
		}

		.md\\:-ml-4,
		.md\\:-mx-4 {
			margin-left: -16px;
		}

		.md\\:m-5 {
			margin: 24px;
		}

		.md\\:mt-5,
		.md\\:my-5 {
			margin-top: 24px;
		}

		.md\\:mr-5,
		.md\\:mx-5 {
			margin-right: 24px;
		}

		.md\\:mb-5,
		.md\\:my-5 {
			margin-bottom: 24px;
		}

		.md\\:ml-5,
		.md\\:mx-5 {
			margin-left: 24px;
		}

		.md\\:-m-5 {
			margin: -24px;
		}

		.md\\:-mt-5,
		.md\\:-my-5 {
			margin-top: -24px;
		}

		.md\\:-mr-5,
		.md\\:-mx-5 {
			margin-right: -24px;
		}

		.md\\:-mb-5,
		.md\\:-my-5 {
			margin-bottom: -24px;
		}

		.md\\:-ml-5,
		.md\\:-mx-5 {
			margin-left: -24px;
		}

		.md\\:m-6 {
			margin: 2rem;
		}

		.md\\:mt-6,
		.md\\:my-6 {
			margin-top: 2rem;
		}

		.md\\:mr-6,
		.md\\:mx-6 {
			margin-right: 2rem;
		}

		.md\\:mb-6,
		.md\\:my-6 {
			margin-bottom: 2rem;
		}

		.md\\:ml-6,
		.md\\:mx-6 {
			margin-left: 2rem;
		}

		.md\\:-m-6 {
			margin: -2rem;
		}

		.md\\:-mt-6,
		.md\\:-my-6 {
			margin-top: -2rem;
		}

		.md\\:-mr-6,
		.md\\:-mx-6 {
			margin-right: -2rem;
		}

		.md\\:-mb-6,
		.md\\:-my-6 {
			margin-bottom: -2rem;
		}

		.md\\:-ml-6,
		.md\\:-mx-6 {
			margin-left: -2rem;
		}

		.md\\:m-7 {
			margin: 3rem;
		}

		.md\\:mt-7,
		.md\\:my-7 {
			margin-top: 3rem;
		}

		.md\\:mr-7,
		.md\\:mx-7 {
			margin-right: 3rem;
		}

		.md\\:mb-7,
		.md\\:my-7 {
			margin-bottom: 3rem;
		}

		.md\\:ml-7,
		.md\\:mx-7 {
			margin-left: 3rem;
		}

		.md\\:-m-7 {
			margin: -3rem;
		}

		.md\\:-mt-7,
		.md\\:-my-7 {
			margin-top: -3rem;
		}

		.md\\:-mr-7,
		.md\\:-mx-7 {
			margin-right: -3rem;
		}

		.md\\:-mb-7,
		.md\\:-my-7 {
			margin-bottom: -3rem;
		}

		.md\\:-ml-7,
		.md\\:-mx-7 {
			margin-left: -3rem;
		}

		.md\\:m-8 {
			margin: 4rem;
		}

		.md\\:mt-8,
		.md\\:my-8 {
			margin-top: 4rem;
		}

		.md\\:mr-8,
		.md\\:mx-8 {
			margin-right: 4rem;
		}

		.md\\:mb-8,
		.md\\:my-8 {
			margin-bottom: 4rem;
		}

		.md\\:ml-8,
		.md\\:mx-8 {
			margin-left: 4rem;
		}

		.md\\:-m-8 {
			margin: -4rem;
		}

		.md\\:-mt-8,
		.md\\:-my-8 {
			margin-top: -4rem;
		}

		.md\\:-mr-8,
		.md\\:-mx-8 {
			margin-right: -4rem;
		}

		.md\\:-mb-8,
		.md\\:-my-8 {
			margin-bottom: -4rem;
		}

		.md\\:-ml-8,
		.md\\:-mx-8 {
			margin-left: -4rem;
		}

		.md\\:m-9 {
			margin: 6rem;
		}

		.md\\:mt-9,
		.md\\:my-9 {
			margin-top: 6rem;
		}

		.md\\:mr-9,
		.md\\:mx-9 {
			margin-right: 6rem;
		}

		.md\\:mb-9,
		.md\\:my-9 {
			margin-bottom: 6rem;
		}

		.md\\:ml-9,
		.md\\:mx-9 {
			margin-left: 6rem;
		}

		.md\\:-m-9 {
			margin: -6rem;
		}

		.md\\:-mt-9,
		.md\\:-my-9 {
			margin-top: -6rem;
		}

		.md\\:-mr-9,
		.md\\:-mx-9 {
			margin-right: -6rem;
		}

		.md\\:-mb-9,
		.md\\:-my-9 {
			margin-bottom: -6rem;
		}

		.md\\:-ml-9,
		.md\\:-mx-9 {
			margin-left: -6rem;
		}

		.md\\:m-auto {
			margin: auto;
		}

		.md\\:mt-auto,
		.md\\:my-auto {
			margin-top: auto;
		}

		.md\\:mr-auto,
		.md\\:mx-auto {
			margin-right: auto;
		}

		.md\\:mb-auto,
		.md\\:my-auto {
			margin-bottom: auto;
		}

		.md\\:ml-auto,
		.md\\:mx-auto {
			margin-left: auto;
		}
	}

	@media (width >= 992px) {
		.lg\\:m-0 {
			margin: 0;
		}

		.lg\\:mt-0,
		.lg\\:my-0 {
			margin-top: 0;
		}

		.lg\\:mr-0,
		.lg\\:mx-0 {
			margin-right: 0;
		}

		.lg\\:mb-0,
		.lg\\:my-0 {
			margin-bottom: 0;
		}

		.lg\\:ml-0,
		.lg\\:mx-0 {
			margin-left: 0;
		}

		.lg\\:-m-0 {
			margin: 0;
		}

		.lg\\:-mt-0,
		.lg\\:-my-0 {
			margin-top: 0;
		}

		.lg\\:-mr-0,
		.lg\\:-mx-0 {
			margin-right: 0;
		}

		.lg\\:-mb-0,
		.lg\\:-my-0 {
			margin-bottom: 0;
		}

		.lg\\:-ml-0,
		.lg\\:-mx-0 {
			margin-left: 0;
		}

		.lg\\:m-1 {
			margin: 6px;
		}

		.lg\\:mt-1,
		.lg\\:my-1 {
			margin-top: 6px;
		}

		.lg\\:mr-1,
		.lg\\:mx-1 {
			margin-right: 6px;
		}

		.lg\\:mb-1,
		.lg\\:my-1 {
			margin-bottom: 6px;
		}

		.lg\\:ml-1,
		.lg\\:mx-1 {
			margin-left: 6px;
		}

		.lg\\:-m-1 {
			margin: -6px;
		}

		.lg\\:-mt-1,
		.lg\\:-my-1 {
			margin-top: -6px;
		}

		.lg\\:-mr-1,
		.lg\\:-mx-1 {
			margin-right: -6px;
		}

		.lg\\:-mb-1,
		.lg\\:-my-1 {
			margin-bottom: -6px;
		}

		.lg\\:-ml-1,
		.lg\\:-mx-1 {
			margin-left: -6px;
		}

		.lg\\:m-2 {
			margin: 10px;
		}

		.lg\\:mt-2,
		.lg\\:my-2 {
			margin-top: 10px;
		}

		.lg\\:mr-2,
		.lg\\:mx-2 {
			margin-right: 10px;
		}

		.lg\\:mb-2,
		.lg\\:my-2 {
			margin-bottom: 10px;
		}

		.lg\\:ml-2,
		.lg\\:mx-2 {
			margin-left: 10px;
		}

		.lg\\:-m-2 {
			margin: -10px;
		}

		.lg\\:-mt-2,
		.lg\\:-my-2 {
			margin-top: -10px;
		}

		.lg\\:-mr-2,
		.lg\\:-mx-2 {
			margin-right: -10px;
		}

		.lg\\:-mb-2,
		.lg\\:-my-2 {
			margin-bottom: -10px;
		}

		.lg\\:-ml-2,
		.lg\\:-mx-2 {
			margin-left: -10px;
		}

		.lg\\:m-3 {
			margin: 12px;
		}

		.lg\\:mt-3,
		.lg\\:my-3 {
			margin-top: 12px;
		}

		.lg\\:mr-3,
		.lg\\:mx-3 {
			margin-right: 12px;
		}

		.lg\\:mb-3,
		.lg\\:my-3 {
			margin-bottom: 12px;
		}

		.lg\\:ml-3,
		.lg\\:mx-3 {
			margin-left: 12px;
		}

		.lg\\:-m-3 {
			margin: -12px;
		}

		.lg\\:-mt-3,
		.lg\\:-my-3 {
			margin-top: -12px;
		}

		.lg\\:-mr-3,
		.lg\\:-mx-3 {
			margin-right: -12px;
		}

		.lg\\:-mb-3,
		.lg\\:-my-3 {
			margin-bottom: -12px;
		}

		.lg\\:-ml-3,
		.lg\\:-mx-3 {
			margin-left: -12px;
		}

		.lg\\:m-4 {
			margin: 16px;
		}

		.lg\\:mt-4,
		.lg\\:my-4 {
			margin-top: 16px;
		}

		.lg\\:mr-4,
		.lg\\:mx-4 {
			margin-right: 16px;
		}

		.lg\\:mb-4,
		.lg\\:my-4 {
			margin-bottom: 16px;
		}

		.lg\\:ml-4,
		.lg\\:mx-4 {
			margin-left: 16px;
		}

		.lg\\:-m-4 {
			margin: -16px;
		}

		.lg\\:-mt-4,
		.lg\\:-my-4 {
			margin-top: -16px;
		}

		.lg\\:-mr-4,
		.lg\\:-mx-4 {
			margin-right: -16px;
		}

		.lg\\:-mb-4,
		.lg\\:-my-4 {
			margin-bottom: -16px;
		}

		.lg\\:-ml-4,
		.lg\\:-mx-4 {
			margin-left: -16px;
		}

		.lg\\:m-5 {
			margin: 24px;
		}

		.lg\\:mt-5,
		.lg\\:my-5 {
			margin-top: 24px;
		}

		.lg\\:mr-5,
		.lg\\:mx-5 {
			margin-right: 24px;
		}

		.lg\\:mb-5,
		.lg\\:my-5 {
			margin-bottom: 24px;
		}

		.lg\\:ml-5,
		.lg\\:mx-5 {
			margin-left: 24px;
		}

		.lg\\:-m-5 {
			margin: -24px;
		}

		.lg\\:-mt-5,
		.lg\\:-my-5 {
			margin-top: -24px;
		}

		.lg\\:-mr-5,
		.lg\\:-mx-5 {
			margin-right: -24px;
		}

		.lg\\:-mb-5,
		.lg\\:-my-5 {
			margin-bottom: -24px;
		}

		.lg\\:-ml-5,
		.lg\\:-mx-5 {
			margin-left: -24px;
		}

		.lg\\:m-6 {
			margin: 2rem;
		}

		.lg\\:mt-6,
		.lg\\:my-6 {
			margin-top: 2rem;
		}

		.lg\\:mr-6,
		.lg\\:mx-6 {
			margin-right: 2rem;
		}

		.lg\\:mb-6,
		.lg\\:my-6 {
			margin-bottom: 2rem;
		}

		.lg\\:ml-6,
		.lg\\:mx-6 {
			margin-left: 2rem;
		}

		.lg\\:-m-6 {
			margin: -2rem;
		}

		.lg\\:-mt-6,
		.lg\\:-my-6 {
			margin-top: -2rem;
		}

		.lg\\:-mr-6,
		.lg\\:-mx-6 {
			margin-right: -2rem;
		}

		.lg\\:-mb-6,
		.lg\\:-my-6 {
			margin-bottom: -2rem;
		}

		.lg\\:-ml-6,
		.lg\\:-mx-6 {
			margin-left: -2rem;
		}

		.lg\\:m-7 {
			margin: 3rem;
		}

		.lg\\:mt-7,
		.lg\\:my-7 {
			margin-top: 3rem;
		}

		.lg\\:mr-7,
		.lg\\:mx-7 {
			margin-right: 3rem;
		}

		.lg\\:mb-7,
		.lg\\:my-7 {
			margin-bottom: 3rem;
		}

		.lg\\:ml-7,
		.lg\\:mx-7 {
			margin-left: 3rem;
		}

		.lg\\:-m-7 {
			margin: -3rem;
		}

		.lg\\:-mt-7,
		.lg\\:-my-7 {
			margin-top: -3rem;
		}

		.lg\\:-mr-7,
		.lg\\:-mx-7 {
			margin-right: -3rem;
		}

		.lg\\:-mb-7,
		.lg\\:-my-7 {
			margin-bottom: -3rem;
		}

		.lg\\:-ml-7,
		.lg\\:-mx-7 {
			margin-left: -3rem;
		}

		.lg\\:m-8 {
			margin: 4rem;
		}

		.lg\\:mt-8,
		.lg\\:my-8 {
			margin-top: 4rem;
		}

		.lg\\:mr-8,
		.lg\\:mx-8 {
			margin-right: 4rem;
		}

		.lg\\:mb-8,
		.lg\\:my-8 {
			margin-bottom: 4rem;
		}

		.lg\\:ml-8,
		.lg\\:mx-8 {
			margin-left: 4rem;
		}

		.lg\\:-m-8 {
			margin: -4rem;
		}

		.lg\\:-mt-8,
		.lg\\:-my-8 {
			margin-top: -4rem;
		}

		.lg\\:-mr-8,
		.lg\\:-mx-8 {
			margin-right: -4rem;
		}

		.lg\\:-mb-8,
		.lg\\:-my-8 {
			margin-bottom: -4rem;
		}

		.lg\\:-ml-8,
		.lg\\:-mx-8 {
			margin-left: -4rem;
		}

		.lg\\:m-9 {
			margin: 6rem;
		}

		.lg\\:mt-9,
		.lg\\:my-9 {
			margin-top: 6rem;
		}

		.lg\\:mr-9,
		.lg\\:mx-9 {
			margin-right: 6rem;
		}

		.lg\\:mb-9,
		.lg\\:my-9 {
			margin-bottom: 6rem;
		}

		.lg\\:ml-9,
		.lg\\:mx-9 {
			margin-left: 6rem;
		}

		.lg\\:-m-9 {
			margin: -6rem;
		}

		.lg\\:-mt-9,
		.lg\\:-my-9 {
			margin-top: -6rem;
		}

		.lg\\:-mr-9,
		.lg\\:-mx-9 {
			margin-right: -6rem;
		}

		.lg\\:-mb-9,
		.lg\\:-my-9 {
			margin-bottom: -6rem;
		}

		.lg\\:-ml-9,
		.lg\\:-mx-9 {
			margin-left: -6rem;
		}

		.lg\\:m-auto {
			margin: auto;
		}

		.lg\\:mt-auto,
		.lg\\:my-auto {
			margin-top: auto;
		}

		.lg\\:mr-auto,
		.lg\\:mx-auto {
			margin-right: auto;
		}

		.lg\\:mb-auto,
		.lg\\:my-auto {
			margin-bottom: auto;
		}

		.lg\\:ml-auto,
		.lg\\:mx-auto {
			margin-left: auto;
		}
	}

	@media (width >= 1200px) {
		.xl\\:m-0 {
			margin: 0;
		}

		.xl\\:mt-0,
		.xl\\:my-0 {
			margin-top: 0;
		}

		.xl\\:mr-0,
		.xl\\:mx-0 {
			margin-right: 0;
		}

		.xl\\:mb-0,
		.xl\\:my-0 {
			margin-bottom: 0;
		}

		.xl\\:ml-0,
		.xl\\:mx-0 {
			margin-left: 0;
		}

		.xl\\:-m-0 {
			margin: 0;
		}

		.xl\\:-mt-0,
		.xl\\:-my-0 {
			margin-top: 0;
		}

		.xl\\:-mr-0,
		.xl\\:-mx-0 {
			margin-right: 0;
		}

		.xl\\:-mb-0,
		.xl\\:-my-0 {
			margin-bottom: 0;
		}

		.xl\\:-ml-0,
		.xl\\:-mx-0 {
			margin-left: 0;
		}

		.xl\\:m-1 {
			margin: 6px;
		}

		.xl\\:mt-1,
		.xl\\:my-1 {
			margin-top: 6px;
		}

		.xl\\:mr-1,
		.xl\\:mx-1 {
			margin-right: 6px;
		}

		.xl\\:mb-1,
		.xl\\:my-1 {
			margin-bottom: 6px;
		}

		.xl\\:ml-1,
		.xl\\:mx-1 {
			margin-left: 6px;
		}

		.xl\\:-m-1 {
			margin: -6px;
		}

		.xl\\:-mt-1,
		.xl\\:-my-1 {
			margin-top: -6px;
		}

		.xl\\:-mr-1,
		.xl\\:-mx-1 {
			margin-right: -6px;
		}

		.xl\\:-mb-1,
		.xl\\:-my-1 {
			margin-bottom: -6px;
		}

		.xl\\:-ml-1,
		.xl\\:-mx-1 {
			margin-left: -6px;
		}

		.xl\\:m-2 {
			margin: 10px;
		}

		.xl\\:mt-2,
		.xl\\:my-2 {
			margin-top: 10px;
		}

		.xl\\:mr-2,
		.xl\\:mx-2 {
			margin-right: 10px;
		}

		.xl\\:mb-2,
		.xl\\:my-2 {
			margin-bottom: 10px;
		}

		.xl\\:ml-2,
		.xl\\:mx-2 {
			margin-left: 10px;
		}

		.xl\\:-m-2 {
			margin: -10px;
		}

		.xl\\:-mt-2,
		.xl\\:-my-2 {
			margin-top: -10px;
		}

		.xl\\:-mr-2,
		.xl\\:-mx-2 {
			margin-right: -10px;
		}

		.xl\\:-mb-2,
		.xl\\:-my-2 {
			margin-bottom: -10px;
		}

		.xl\\:-ml-2,
		.xl\\:-mx-2 {
			margin-left: -10px;
		}

		.xl\\:m-3 {
			margin: 12px;
		}

		.xl\\:mt-3,
		.xl\\:my-3 {
			margin-top: 12px;
		}

		.xl\\:mr-3,
		.xl\\:mx-3 {
			margin-right: 12px;
		}

		.xl\\:mb-3,
		.xl\\:my-3 {
			margin-bottom: 12px;
		}

		.xl\\:ml-3,
		.xl\\:mx-3 {
			margin-left: 12px;
		}

		.xl\\:-m-3 {
			margin: -12px;
		}

		.xl\\:-mt-3,
		.xl\\:-my-3 {
			margin-top: -12px;
		}

		.xl\\:-mr-3,
		.xl\\:-mx-3 {
			margin-right: -12px;
		}

		.xl\\:-mb-3,
		.xl\\:-my-3 {
			margin-bottom: -12px;
		}

		.xl\\:-ml-3,
		.xl\\:-mx-3 {
			margin-left: -12px;
		}

		.xl\\:m-4 {
			margin: 16px;
		}

		.xl\\:mt-4,
		.xl\\:my-4 {
			margin-top: 16px;
		}

		.xl\\:mr-4,
		.xl\\:mx-4 {
			margin-right: 16px;
		}

		.xl\\:mb-4,
		.xl\\:my-4 {
			margin-bottom: 16px;
		}

		.xl\\:ml-4,
		.xl\\:mx-4 {
			margin-left: 16px;
		}

		.xl\\:-m-4 {
			margin: -16px;
		}

		.xl\\:-mt-4,
		.xl\\:-my-4 {
			margin-top: -16px;
		}

		.xl\\:-mr-4,
		.xl\\:-mx-4 {
			margin-right: -16px;
		}

		.xl\\:-mb-4,
		.xl\\:-my-4 {
			margin-bottom: -16px;
		}

		.xl\\:-ml-4,
		.xl\\:-mx-4 {
			margin-left: -16px;
		}

		.xl\\:m-5 {
			margin: 24px;
		}

		.xl\\:mt-5,
		.xl\\:my-5 {
			margin-top: 24px;
		}

		.xl\\:mr-5,
		.xl\\:mx-5 {
			margin-right: 24px;
		}

		.xl\\:mb-5,
		.xl\\:my-5 {
			margin-bottom: 24px;
		}

		.xl\\:ml-5,
		.xl\\:mx-5 {
			margin-left: 24px;
		}

		.xl\\:-m-5 {
			margin: -24px;
		}

		.xl\\:-mt-5,
		.xl\\:-my-5 {
			margin-top: -24px;
		}

		.xl\\:-mr-5,
		.xl\\:-mx-5 {
			margin-right: -24px;
		}

		.xl\\:-mb-5,
		.xl\\:-my-5 {
			margin-bottom: -24px;
		}

		.xl\\:-ml-5,
		.xl\\:-mx-5 {
			margin-left: -24px;
		}

		.xl\\:m-6 {
			margin: 2rem;
		}

		.xl\\:mt-6,
		.xl\\:my-6 {
			margin-top: 2rem;
		}

		.xl\\:mr-6,
		.xl\\:mx-6 {
			margin-right: 2rem;
		}

		.xl\\:mb-6,
		.xl\\:my-6 {
			margin-bottom: 2rem;
		}

		.xl\\:ml-6,
		.xl\\:mx-6 {
			margin-left: 2rem;
		}

		.xl\\:-m-6 {
			margin: -2rem;
		}

		.xl\\:-mt-6,
		.xl\\:-my-6 {
			margin-top: -2rem;
		}

		.xl\\:-mr-6,
		.xl\\:-mx-6 {
			margin-right: -2rem;
		}

		.xl\\:-mb-6,
		.xl\\:-my-6 {
			margin-bottom: -2rem;
		}

		.xl\\:-ml-6,
		.xl\\:-mx-6 {
			margin-left: -2rem;
		}

		.xl\\:m-7 {
			margin: 3rem;
		}

		.xl\\:mt-7,
		.xl\\:my-7 {
			margin-top: 3rem;
		}

		.xl\\:mr-7,
		.xl\\:mx-7 {
			margin-right: 3rem;
		}

		.xl\\:mb-7,
		.xl\\:my-7 {
			margin-bottom: 3rem;
		}

		.xl\\:ml-7,
		.xl\\:mx-7 {
			margin-left: 3rem;
		}

		.xl\\:-m-7 {
			margin: -3rem;
		}

		.xl\\:-mt-7,
		.xl\\:-my-7 {
			margin-top: -3rem;
		}

		.xl\\:-mr-7,
		.xl\\:-mx-7 {
			margin-right: -3rem;
		}

		.xl\\:-mb-7,
		.xl\\:-my-7 {
			margin-bottom: -3rem;
		}

		.xl\\:-ml-7,
		.xl\\:-mx-7 {
			margin-left: -3rem;
		}

		.xl\\:m-8 {
			margin: 4rem;
		}

		.xl\\:mt-8,
		.xl\\:my-8 {
			margin-top: 4rem;
		}

		.xl\\:mr-8,
		.xl\\:mx-8 {
			margin-right: 4rem;
		}

		.xl\\:mb-8,
		.xl\\:my-8 {
			margin-bottom: 4rem;
		}

		.xl\\:ml-8,
		.xl\\:mx-8 {
			margin-left: 4rem;
		}

		.xl\\:-m-8 {
			margin: -4rem;
		}

		.xl\\:-mt-8,
		.xl\\:-my-8 {
			margin-top: -4rem;
		}

		.xl\\:-mr-8,
		.xl\\:-mx-8 {
			margin-right: -4rem;
		}

		.xl\\:-mb-8,
		.xl\\:-my-8 {
			margin-bottom: -4rem;
		}

		.xl\\:-ml-8,
		.xl\\:-mx-8 {
			margin-left: -4rem;
		}

		.xl\\:m-9 {
			margin: 6rem;
		}

		.xl\\:mt-9,
		.xl\\:my-9 {
			margin-top: 6rem;
		}

		.xl\\:mr-9,
		.xl\\:mx-9 {
			margin-right: 6rem;
		}

		.xl\\:mb-9,
		.xl\\:my-9 {
			margin-bottom: 6rem;
		}

		.xl\\:ml-9,
		.xl\\:mx-9 {
			margin-left: 6rem;
		}

		.xl\\:-m-9 {
			margin: -6rem;
		}

		.xl\\:-mt-9,
		.xl\\:-my-9 {
			margin-top: -6rem;
		}

		.xl\\:-mr-9,
		.xl\\:-mx-9 {
			margin-right: -6rem;
		}

		.xl\\:-mb-9,
		.xl\\:-my-9 {
			margin-bottom: -6rem;
		}

		.xl\\:-ml-9,
		.xl\\:-mx-9 {
			margin-left: -6rem;
		}

		.xl\\:m-auto {
			margin: auto;
		}

		.xl\\:mt-auto,
		.xl\\:my-auto {
			margin-top: auto;
		}

		.xl\\:mr-auto,
		.xl\\:mx-auto {
			margin-right: auto;
		}

		.xl\\:mb-auto,
		.xl\\:my-auto {
			margin-bottom: auto;
		}

		.xl\\:ml-auto,
		.xl\\:mx-auto {
			margin-left: auto;
		}
	}

	.p-0 {
		padding: 0;
	}

	.pt-0,
	.py-0 {
		padding-top: 0;
	}

	.pr-0,
	.px-0 {
		padding-right: 0;
	}

	.pb-0,
	.py-0 {
		padding-bottom: 0;
	}

	.pl-0,
	.px-0 {
		padding-left: 0;
	}

	.p-1 {
		padding: 6px;
	}

	.pt-1,
	.py-1 {
		padding-top: 6px;
	}

	.pr-1,
	.px-1 {
		padding-right: 6px;
	}

	.pb-1,
	.py-1 {
		padding-bottom: 6px;
	}

	.pl-1,
	.px-1 {
		padding-left: 6px;
	}

	.p-2 {
		padding: 10px;
	}

	.pt-2,
	.py-2 {
		padding-top: 10px;
	}

	.pr-2,
	.px-2 {
		padding-right: 10px;
	}

	.pb-2,
	.py-2 {
		padding-bottom: 10px;
	}

	.pl-2,
	.px-2 {
		padding-left: 10px;
	}

	.p-3 {
		padding: 12px;
	}

	.pt-3,
	.py-3 {
		padding-top: 12px;
	}

	.pr-3,
	.px-3 {
		padding-right: 12px;
	}

	.pb-3,
	.py-3 {
		padding-bottom: 12px;
	}

	.pl-3,
	.px-3 {
		padding-left: 12px;
	}

	.p-4 {
		padding: 16px;
	}

	.pt-4,
	.py-4 {
		padding-top: 16px;
	}

	.pr-4,
	.px-4 {
		padding-right: 16px;
	}

	.pb-4,
	.py-4 {
		padding-bottom: 16px;
	}

	.pl-4,
	.px-4 {
		padding-left: 16px;
	}

	.p-5 {
		padding: 24px;
	}

	.pt-5,
	.py-5 {
		padding-top: 24px;
	}

	.pr-5,
	.px-5 {
		padding-right: 24px;
	}

	.pb-5,
	.py-5 {
		padding-bottom: 24px;
	}

	.pl-5,
	.px-5 {
		padding-left: 24px;
	}

	.p-6 {
		padding: 2rem;
	}

	.pt-6,
	.py-6 {
		padding-top: 2rem;
	}

	.pr-6,
	.px-6 {
		padding-right: 2rem;
	}

	.pb-6,
	.py-6 {
		padding-bottom: 2rem;
	}

	.pl-6,
	.px-6 {
		padding-left: 2rem;
	}

	.p-7 {
		padding: 3rem;
	}

	.pt-7,
	.py-7 {
		padding-top: 3rem;
	}

	.pr-7,
	.px-7 {
		padding-right: 3rem;
	}

	.pb-7,
	.py-7 {
		padding-bottom: 3rem;
	}

	.pl-7,
	.px-7 {
		padding-left: 3rem;
	}

	.p-8 {
		padding: 4rem;
	}

	.pt-8,
	.py-8 {
		padding-top: 4rem;
	}

	.pr-8,
	.px-8 {
		padding-right: 4rem;
	}

	.pb-8,
	.py-8 {
		padding-bottom: 4rem;
	}

	.pl-8,
	.px-8 {
		padding-left: 4rem;
	}

	.p-9 {
		padding: 6rem;
	}

	.pt-9,
	.py-9 {
		padding-top: 6rem;
	}

	.pr-9,
	.px-9 {
		padding-right: 6rem;
	}

	.pb-9,
	.py-9 {
		padding-bottom: 6rem;
	}

	.pl-9,
	.px-9 {
		padding-left: 6rem;
	}

	@media (width >= 576px) {
		.sm\\:p-0 {
			padding: 0;
		}

		.sm\\:pt-0,
		.sm\\:py-0 {
			padding-top: 0;
		}

		.sm\\:pr-0,
		.sm\\:px-0 {
			padding-right: 0;
		}

		.sm\\:pb-0,
		.sm\\:py-0 {
			padding-bottom: 0;
		}

		.sm\\:pl-0,
		.sm\\:px-0 {
			padding-left: 0;
		}

		.sm\\:p-1 {
			padding: 6px;
		}

		.sm\\:pt-1,
		.sm\\:py-1 {
			padding-top: 6px;
		}

		.sm\\:pr-1,
		.sm\\:px-1 {
			padding-right: 6px;
		}

		.sm\\:pb-1,
		.sm\\:py-1 {
			padding-bottom: 6px;
		}

		.sm\\:pl-1,
		.sm\\:px-1 {
			padding-left: 6px;
		}

		.sm\\:p-2 {
			padding: 10px;
		}

		.sm\\:pt-2,
		.sm\\:py-2 {
			padding-top: 10px;
		}

		.sm\\:pr-2,
		.sm\\:px-2 {
			padding-right: 10px;
		}

		.sm\\:pb-2,
		.sm\\:py-2 {
			padding-bottom: 10px;
		}

		.sm\\:pl-2,
		.sm\\:px-2 {
			padding-left: 10px;
		}

		.sm\\:p-3 {
			padding: 12px;
		}

		.sm\\:pt-3,
		.sm\\:py-3 {
			padding-top: 12px;
		}

		.sm\\:pr-3,
		.sm\\:px-3 {
			padding-right: 12px;
		}

		.sm\\:pb-3,
		.sm\\:py-3 {
			padding-bottom: 12px;
		}

		.sm\\:pl-3,
		.sm\\:px-3 {
			padding-left: 12px;
		}

		.sm\\:p-4 {
			padding: 16px;
		}

		.sm\\:pt-4,
		.sm\\:py-4 {
			padding-top: 16px;
		}

		.sm\\:pr-4,
		.sm\\:px-4 {
			padding-right: 16px;
		}

		.sm\\:pb-4,
		.sm\\:py-4 {
			padding-bottom: 16px;
		}

		.sm\\:pl-4,
		.sm\\:px-4 {
			padding-left: 16px;
		}

		.sm\\:p-5 {
			padding: 24px;
		}

		.sm\\:pt-5,
		.sm\\:py-5 {
			padding-top: 24px;
		}

		.sm\\:pr-5,
		.sm\\:px-5 {
			padding-right: 24px;
		}

		.sm\\:pb-5,
		.sm\\:py-5 {
			padding-bottom: 24px;
		}

		.sm\\:pl-5,
		.sm\\:px-5 {
			padding-left: 24px;
		}

		.sm\\:p-6 {
			padding: 2rem;
		}

		.sm\\:pt-6,
		.sm\\:py-6 {
			padding-top: 2rem;
		}

		.sm\\:pr-6,
		.sm\\:px-6 {
			padding-right: 2rem;
		}

		.sm\\:pb-6,
		.sm\\:py-6 {
			padding-bottom: 2rem;
		}

		.sm\\:pl-6,
		.sm\\:px-6 {
			padding-left: 2rem;
		}

		.sm\\:p-7 {
			padding: 3rem;
		}

		.sm\\:pt-7,
		.sm\\:py-7 {
			padding-top: 3rem;
		}

		.sm\\:pr-7,
		.sm\\:px-7 {
			padding-right: 3rem;
		}

		.sm\\:pb-7,
		.sm\\:py-7 {
			padding-bottom: 3rem;
		}

		.sm\\:pl-7,
		.sm\\:px-7 {
			padding-left: 3rem;
		}

		.sm\\:p-8 {
			padding: 4rem;
		}

		.sm\\:pt-8,
		.sm\\:py-8 {
			padding-top: 4rem;
		}

		.sm\\:pr-8,
		.sm\\:px-8 {
			padding-right: 4rem;
		}

		.sm\\:pb-8,
		.sm\\:py-8 {
			padding-bottom: 4rem;
		}

		.sm\\:pl-8,
		.sm\\:px-8 {
			padding-left: 4rem;
		}

		.sm\\:p-9 {
			padding: 6rem;
		}

		.sm\\:pt-9,
		.sm\\:py-9 {
			padding-top: 6rem;
		}

		.sm\\:pr-9,
		.sm\\:px-9 {
			padding-right: 6rem;
		}

		.sm\\:pb-9,
		.sm\\:py-9 {
			padding-bottom: 6rem;
		}

		.sm\\:pl-9,
		.sm\\:px-9 {
			padding-left: 6rem;
		}
	}

	@media (width >= 768px) {
		.md\\:p-0 {
			padding: 0;
		}

		.md\\:pt-0,
		.md\\:py-0 {
			padding-top: 0;
		}

		.md\\:pr-0,
		.md\\:px-0 {
			padding-right: 0;
		}

		.md\\:pb-0,
		.md\\:py-0 {
			padding-bottom: 0;
		}

		.md\\:pl-0,
		.md\\:px-0 {
			padding-left: 0;
		}

		.md\\:p-1 {
			padding: 6px;
		}

		.md\\:pt-1,
		.md\\:py-1 {
			padding-top: 6px;
		}

		.md\\:pr-1,
		.md\\:px-1 {
			padding-right: 6px;
		}

		.md\\:pb-1,
		.md\\:py-1 {
			padding-bottom: 6px;
		}

		.md\\:pl-1,
		.md\\:px-1 {
			padding-left: 6px;
		}

		.md\\:p-2 {
			padding: 10px;
		}

		.md\\:pt-2,
		.md\\:py-2 {
			padding-top: 10px;
		}

		.md\\:pr-2,
		.md\\:px-2 {
			padding-right: 10px;
		}

		.md\\:pb-2,
		.md\\:py-2 {
			padding-bottom: 10px;
		}

		.md\\:pl-2,
		.md\\:px-2 {
			padding-left: 10px;
		}

		.md\\:p-3 {
			padding: 12px;
		}

		.md\\:pt-3,
		.md\\:py-3 {
			padding-top: 12px;
		}

		.md\\:pr-3,
		.md\\:px-3 {
			padding-right: 12px;
		}

		.md\\:pb-3,
		.md\\:py-3 {
			padding-bottom: 12px;
		}

		.md\\:pl-3,
		.md\\:px-3 {
			padding-left: 12px;
		}

		.md\\:p-4 {
			padding: 16px;
		}

		.md\\:pt-4,
		.md\\:py-4 {
			padding-top: 16px;
		}

		.md\\:pr-4,
		.md\\:px-4 {
			padding-right: 16px;
		}

		.md\\:pb-4,
		.md\\:py-4 {
			padding-bottom: 16px;
		}

		.md\\:pl-4,
		.md\\:px-4 {
			padding-left: 16px;
		}

		.md\\:p-5 {
			padding: 24px;
		}

		.md\\:pt-5,
		.md\\:py-5 {
			padding-top: 24px;
		}

		.md\\:pr-5,
		.md\\:px-5 {
			padding-right: 24px;
		}

		.md\\:pb-5,
		.md\\:py-5 {
			padding-bottom: 24px;
		}

		.md\\:pl-5,
		.md\\:px-5 {
			padding-left: 24px;
		}

		.md\\:p-6 {
			padding: 2rem;
		}

		.md\\:pt-6,
		.md\\:py-6 {
			padding-top: 2rem;
		}

		.md\\:pr-6,
		.md\\:px-6 {
			padding-right: 2rem;
		}

		.md\\:pb-6,
		.md\\:py-6 {
			padding-bottom: 2rem;
		}

		.md\\:pl-6,
		.md\\:px-6 {
			padding-left: 2rem;
		}

		.md\\:p-7 {
			padding: 3rem;
		}

		.md\\:pt-7,
		.md\\:py-7 {
			padding-top: 3rem;
		}

		.md\\:pr-7,
		.md\\:px-7 {
			padding-right: 3rem;
		}

		.md\\:pb-7,
		.md\\:py-7 {
			padding-bottom: 3rem;
		}

		.md\\:pl-7,
		.md\\:px-7 {
			padding-left: 3rem;
		}

		.md\\:p-8 {
			padding: 4rem;
		}

		.md\\:pt-8,
		.md\\:py-8 {
			padding-top: 4rem;
		}

		.md\\:pr-8,
		.md\\:px-8 {
			padding-right: 4rem;
		}

		.md\\:pb-8,
		.md\\:py-8 {
			padding-bottom: 4rem;
		}

		.md\\:pl-8,
		.md\\:px-8 {
			padding-left: 4rem;
		}

		.md\\:p-9 {
			padding: 6rem;
		}

		.md\\:pt-9,
		.md\\:py-9 {
			padding-top: 6rem;
		}

		.md\\:pr-9,
		.md\\:px-9 {
			padding-right: 6rem;
		}

		.md\\:pb-9,
		.md\\:py-9 {
			padding-bottom: 6rem;
		}

		.md\\:pl-9,
		.md\\:px-9 {
			padding-left: 6rem;
		}
	}

	@media (width >= 992px) {
		.lg\\:p-0 {
			padding: 0;
		}

		.lg\\:pt-0,
		.lg\\:py-0 {
			padding-top: 0;
		}

		.lg\\:pr-0,
		.lg\\:px-0 {
			padding-right: 0;
		}

		.lg\\:pb-0,
		.lg\\:py-0 {
			padding-bottom: 0;
		}

		.lg\\:pl-0,
		.lg\\:px-0 {
			padding-left: 0;
		}

		.lg\\:p-1 {
			padding: 6px;
		}

		.lg\\:pt-1,
		.lg\\:py-1 {
			padding-top: 6px;
		}

		.lg\\:pr-1,
		.lg\\:px-1 {
			padding-right: 6px;
		}

		.lg\\:pb-1,
		.lg\\:py-1 {
			padding-bottom: 6px;
		}

		.lg\\:pl-1,
		.lg\\:px-1 {
			padding-left: 6px;
		}

		.lg\\:p-2 {
			padding: 10px;
		}

		.lg\\:pt-2,
		.lg\\:py-2 {
			padding-top: 10px;
		}

		.lg\\:pr-2,
		.lg\\:px-2 {
			padding-right: 10px;
		}

		.lg\\:pb-2,
		.lg\\:py-2 {
			padding-bottom: 10px;
		}

		.lg\\:pl-2,
		.lg\\:px-2 {
			padding-left: 10px;
		}

		.lg\\:p-3 {
			padding: 12px;
		}

		.lg\\:pt-3,
		.lg\\:py-3 {
			padding-top: 12px;
		}

		.lg\\:pr-3,
		.lg\\:px-3 {
			padding-right: 12px;
		}

		.lg\\:pb-3,
		.lg\\:py-3 {
			padding-bottom: 12px;
		}

		.lg\\:pl-3,
		.lg\\:px-3 {
			padding-left: 12px;
		}

		.lg\\:p-4 {
			padding: 16px;
		}

		.lg\\:pt-4,
		.lg\\:py-4 {
			padding-top: 16px;
		}

		.lg\\:pr-4,
		.lg\\:px-4 {
			padding-right: 16px;
		}

		.lg\\:pb-4,
		.lg\\:py-4 {
			padding-bottom: 16px;
		}

		.lg\\:pl-4,
		.lg\\:px-4 {
			padding-left: 16px;
		}

		.lg\\:p-5 {
			padding: 24px;
		}

		.lg\\:pt-5,
		.lg\\:py-5 {
			padding-top: 24px;
		}

		.lg\\:pr-5,
		.lg\\:px-5 {
			padding-right: 24px;
		}

		.lg\\:pb-5,
		.lg\\:py-5 {
			padding-bottom: 24px;
		}

		.lg\\:pl-5,
		.lg\\:px-5 {
			padding-left: 24px;
		}

		.lg\\:p-6 {
			padding: 2rem;
		}

		.lg\\:pt-6,
		.lg\\:py-6 {
			padding-top: 2rem;
		}

		.lg\\:pr-6,
		.lg\\:px-6 {
			padding-right: 2rem;
		}

		.lg\\:pb-6,
		.lg\\:py-6 {
			padding-bottom: 2rem;
		}

		.lg\\:pl-6,
		.lg\\:px-6 {
			padding-left: 2rem;
		}

		.lg\\:p-7 {
			padding: 3rem;
		}

		.lg\\:pt-7,
		.lg\\:py-7 {
			padding-top: 3rem;
		}

		.lg\\:pr-7,
		.lg\\:px-7 {
			padding-right: 3rem;
		}

		.lg\\:pb-7,
		.lg\\:py-7 {
			padding-bottom: 3rem;
		}

		.lg\\:pl-7,
		.lg\\:px-7 {
			padding-left: 3rem;
		}

		.lg\\:p-8 {
			padding: 4rem;
		}

		.lg\\:pt-8,
		.lg\\:py-8 {
			padding-top: 4rem;
		}

		.lg\\:pr-8,
		.lg\\:px-8 {
			padding-right: 4rem;
		}

		.lg\\:pb-8,
		.lg\\:py-8 {
			padding-bottom: 4rem;
		}

		.lg\\:pl-8,
		.lg\\:px-8 {
			padding-left: 4rem;
		}

		.lg\\:p-9 {
			padding: 6rem;
		}

		.lg\\:pt-9,
		.lg\\:py-9 {
			padding-top: 6rem;
		}

		.lg\\:pr-9,
		.lg\\:px-9 {
			padding-right: 6rem;
		}

		.lg\\:pb-9,
		.lg\\:py-9 {
			padding-bottom: 6rem;
		}

		.lg\\:pl-9,
		.lg\\:px-9 {
			padding-left: 6rem;
		}
	}

	@media (width >= 1200px) {
		.xl\\:p-0 {
			padding: 0;
		}

		.xl\\:pt-0,
		.xl\\:py-0 {
			padding-top: 0;
		}

		.xl\\:pr-0,
		.xl\\:px-0 {
			padding-right: 0;
		}

		.xl\\:pb-0,
		.xl\\:py-0 {
			padding-bottom: 0;
		}

		.xl\\:pl-0,
		.xl\\:px-0 {
			padding-left: 0;
		}

		.xl\\:p-1 {
			padding: 6px;
		}

		.xl\\:pt-1,
		.xl\\:py-1 {
			padding-top: 6px;
		}

		.xl\\:pr-1,
		.xl\\:px-1 {
			padding-right: 6px;
		}

		.xl\\:pb-1,
		.xl\\:py-1 {
			padding-bottom: 6px;
		}

		.xl\\:pl-1,
		.xl\\:px-1 {
			padding-left: 6px;
		}

		.xl\\:p-2 {
			padding: 10px;
		}

		.xl\\:pt-2,
		.xl\\:py-2 {
			padding-top: 10px;
		}

		.xl\\:pr-2,
		.xl\\:px-2 {
			padding-right: 10px;
		}

		.xl\\:pb-2,
		.xl\\:py-2 {
			padding-bottom: 10px;
		}

		.xl\\:pl-2,
		.xl\\:px-2 {
			padding-left: 10px;
		}

		.xl\\:p-3 {
			padding: 12px;
		}

		.xl\\:pt-3,
		.xl\\:py-3 {
			padding-top: 12px;
		}

		.xl\\:pr-3,
		.xl\\:px-3 {
			padding-right: 12px;
		}

		.xl\\:pb-3,
		.xl\\:py-3 {
			padding-bottom: 12px;
		}

		.xl\\:pl-3,
		.xl\\:px-3 {
			padding-left: 12px;
		}

		.xl\\:p-4 {
			padding: 16px;
		}

		.xl\\:pt-4,
		.xl\\:py-4 {
			padding-top: 16px;
		}

		.xl\\:pr-4,
		.xl\\:px-4 {
			padding-right: 16px;
		}

		.xl\\:pb-4,
		.xl\\:py-4 {
			padding-bottom: 16px;
		}

		.xl\\:pl-4,
		.xl\\:px-4 {
			padding-left: 16px;
		}

		.xl\\:p-5 {
			padding: 24px;
		}

		.xl\\:pt-5,
		.xl\\:py-5 {
			padding-top: 24px;
		}

		.xl\\:pr-5,
		.xl\\:px-5 {
			padding-right: 24px;
		}

		.xl\\:pb-5,
		.xl\\:py-5 {
			padding-bottom: 24px;
		}

		.xl\\:pl-5,
		.xl\\:px-5 {
			padding-left: 24px;
		}

		.xl\\:p-6 {
			padding: 2rem;
		}

		.xl\\:pt-6,
		.xl\\:py-6 {
			padding-top: 2rem;
		}

		.xl\\:pr-6,
		.xl\\:px-6 {
			padding-right: 2rem;
		}

		.xl\\:pb-6,
		.xl\\:py-6 {
			padding-bottom: 2rem;
		}

		.xl\\:pl-6,
		.xl\\:px-6 {
			padding-left: 2rem;
		}

		.xl\\:p-7 {
			padding: 3rem;
		}

		.xl\\:pt-7,
		.xl\\:py-7 {
			padding-top: 3rem;
		}

		.xl\\:pr-7,
		.xl\\:px-7 {
			padding-right: 3rem;
		}

		.xl\\:pb-7,
		.xl\\:py-7 {
			padding-bottom: 3rem;
		}

		.xl\\:pl-7,
		.xl\\:px-7 {
			padding-left: 3rem;
		}

		.xl\\:p-8 {
			padding: 4rem;
		}

		.xl\\:pt-8,
		.xl\\:py-8 {
			padding-top: 4rem;
		}

		.xl\\:pr-8,
		.xl\\:px-8 {
			padding-right: 4rem;
		}

		.xl\\:pb-8,
		.xl\\:py-8 {
			padding-bottom: 4rem;
		}

		.xl\\:pl-8,
		.xl\\:px-8 {
			padding-left: 4rem;
		}

		.xl\\:p-9 {
			padding: 6rem;
		}

		.xl\\:pt-9,
		.xl\\:py-9 {
			padding-top: 6rem;
		}

		.xl\\:pr-9,
		.xl\\:px-9 {
			padding-right: 6rem;
		}

		.xl\\:pb-9,
		.xl\\:py-9 {
			padding-bottom: 6rem;
		}

		.xl\\:pl-9,
		.xl\\:px-9 {
			padding-left: 6rem;
		}
	}

	.h-0 {
		height: 0;
	}

	.h-1 {
		height: 6px;
	}

	.h-2 {
		height: 10px;
	}

	.h-3 {
		height: 12px;
	}

	.h-4 {
		height: 16px;
	}

	.h-5 {
		height: 24px;
	}

	.h-6 {
		height: 2rem;
	}

	.h-7 {
		height: 3rem;
	}

	.h-8 {
		height: 4rem;
	}

	.h-9 {
		height: 6rem;
	}

	.h-px {
		height: 1px;
	}

	.h-auto {
		height: auto;
	}

	.h-full {
		height: 100%;
	}

	.h-screen {
		height: 100vh;
	}

	@media (width >= 576px) {
		.sm\\:h-0 {
			height: 0;
		}

		.sm\\:h-1 {
			height: 6px;
		}

		.sm\\:h-2 {
			height: 10px;
		}

		.sm\\:h-3 {
			height: 12px;
		}

		.sm\\:h-4 {
			height: 16px;
		}

		.sm\\:h-5 {
			height: 24px;
		}

		.sm\\:h-6 {
			height: 2rem;
		}

		.sm\\:h-7 {
			height: 3rem;
		}

		.sm\\:h-8 {
			height: 4rem;
		}

		.sm\\:h-9 {
			height: 6rem;
		}

		.sm\\:h-px {
			height: 1px;
		}

		.sm\\:h-auto {
			height: auto;
		}

		.sm\\:h-full {
			height: 100%;
		}

		.sm\\:h-screen {
			height: 100vh;
		}
	}

	@media (width >= 768px) {
		.md\\:h-0 {
			height: 0;
		}

		.md\\:h-1 {
			height: 6px;
		}

		.md\\:h-2 {
			height: 10px;
		}

		.md\\:h-3 {
			height: 12px;
		}

		.md\\:h-4 {
			height: 16px;
		}

		.md\\:h-5 {
			height: 24px;
		}

		.md\\:h-6 {
			height: 2rem;
		}

		.md\\:h-7 {
			height: 3rem;
		}

		.md\\:h-8 {
			height: 4rem;
		}

		.md\\:h-9 {
			height: 6rem;
		}

		.md\\:h-px {
			height: 1px;
		}

		.md\\:h-auto {
			height: auto;
		}

		.md\\:h-full {
			height: 100%;
		}

		.md\\:h-screen {
			height: 100vh;
		}
	}

	@media (width >= 992px) {
		.lg\\:h-0 {
			height: 0;
		}

		.lg\\:h-1 {
			height: 6px;
		}

		.lg\\:h-2 {
			height: 10px;
		}

		.lg\\:h-3 {
			height: 12px;
		}

		.lg\\:h-4 {
			height: 16px;
		}

		.lg\\:h-5 {
			height: 24px;
		}

		.lg\\:h-6 {
			height: 2rem;
		}

		.lg\\:h-7 {
			height: 3rem;
		}

		.lg\\:h-8 {
			height: 4rem;
		}

		.lg\\:h-9 {
			height: 6rem;
		}

		.lg\\:h-px {
			height: 1px;
		}

		.lg\\:h-auto {
			height: auto;
		}

		.lg\\:h-full {
			height: 100%;
		}

		.lg\\:h-screen {
			height: 100vh;
		}
	}

	@media (width >= 1200px) {
		.xl\\:h-0 {
			height: 0;
		}

		.xl\\:h-1 {
			height: 6px;
		}

		.xl\\:h-2 {
			height: 10px;
		}

		.xl\\:h-3 {
			height: 12px;
		}

		.xl\\:h-4 {
			height: 16px;
		}

		.xl\\:h-5 {
			height: 24px;
		}

		.xl\\:h-6 {
			height: 2rem;
		}

		.xl\\:h-7 {
			height: 3rem;
		}

		.xl\\:h-8 {
			height: 4rem;
		}

		.xl\\:h-9 {
			height: 6rem;
		}

		.xl\\:h-px {
			height: 1px;
		}

		.xl\\:h-auto {
			height: auto;
		}

		.xl\\:h-full {
			height: 100%;
		}

		.xl\\:h-screen {
			height: 100vh;
		}
	}

	.max-h-full {
		max-height: 100%;
	}

	.max-h-screen {
		max-height: 100vh;
	}

	.min-h-0 {
		min-height: 0;
	}

	.min-h-full {
		min-height: 100%;
	}

	.min-h-screen {
		min-height: 100vh;
	}

	.w-0 {
		width: 0;
	}

	.w-1 {
		width: 6px;
	}

	.w-2 {
		width: 10px;
	}

	.w-3 {
		width: 12px;
	}

	.w-4 {
		width: 16px;
	}

	.w-5 {
		width: 24px;
	}

	.w-6 {
		width: 2rem;
	}

	.w-7 {
		width: 3rem;
	}

	.w-8 {
		width: 4rem;
	}

	.w-9 {
		width: 6rem;
	}

	.w-px {
		width: 1px;
	}

	.w-auto {
		width: auto;
	}

	.w-full {
		width: 100%;
	}

	.w-screen {
		width: 100vw;
	}

	@media (width >= 576px) {
		.sm\\:w-0 {
			width: 0;
		}

		.sm\\:w-1 {
			width: 6px;
		}

		.sm\\:w-2 {
			width: 10px;
		}

		.sm\\:w-3 {
			width: 12px;
		}

		.sm\\:w-4 {
			width: 16px;
		}

		.sm\\:w-5 {
			width: 24px;
		}

		.sm\\:w-6 {
			width: 2rem;
		}

		.sm\\:w-7 {
			width: 3rem;
		}

		.sm\\:w-8 {
			width: 4rem;
		}

		.sm\\:w-9 {
			width: 6rem;
		}

		.sm\\:w-px {
			width: 1px;
		}

		.sm\\:w-auto {
			width: auto;
		}

		.sm\\:w-full {
			width: 100%;
		}

		.sm\\:w-screen {
			width: 100vw;
		}
	}

	@media (width >= 768px) {
		.md\\:w-0 {
			width: 0;
		}

		.md\\:w-1 {
			width: 6px;
		}

		.md\\:w-2 {
			width: 10px;
		}

		.md\\:w-3 {
			width: 12px;
		}

		.md\\:w-4 {
			width: 16px;
		}

		.md\\:w-5 {
			width: 24px;
		}

		.md\\:w-6 {
			width: 2rem;
		}

		.md\\:w-7 {
			width: 3rem;
		}

		.md\\:w-8 {
			width: 4rem;
		}

		.md\\:w-9 {
			width: 6rem;
		}

		.md\\:w-px {
			width: 1px;
		}

		.md\\:w-auto {
			width: auto;
		}

		.md\\:w-full {
			width: 100%;
		}

		.md\\:w-screen {
			width: 100vw;
		}
	}

	@media (width >= 992px) {
		.lg\\:w-0 {
			width: 0;
		}

		.lg\\:w-1 {
			width: 6px;
		}

		.lg\\:w-2 {
			width: 10px;
		}

		.lg\\:w-3 {
			width: 12px;
		}

		.lg\\:w-4 {
			width: 16px;
		}

		.lg\\:w-5 {
			width: 24px;
		}

		.lg\\:w-6 {
			width: 2rem;
		}

		.lg\\:w-7 {
			width: 3rem;
		}

		.lg\\:w-8 {
			width: 4rem;
		}

		.lg\\:w-9 {
			width: 6rem;
		}

		.lg\\:w-px {
			width: 1px;
		}

		.lg\\:w-auto {
			width: auto;
		}

		.lg\\:w-full {
			width: 100%;
		}

		.lg\\:w-screen {
			width: 100vw;
		}
	}

	@media (width >= 1200px) {
		.xl\\:w-0 {
			width: 0;
		}

		.xl\\:w-1 {
			width: 6px;
		}

		.xl\\:w-2 {
			width: 10px;
		}

		.xl\\:w-3 {
			width: 12px;
		}

		.xl\\:w-4 {
			width: 16px;
		}

		.xl\\:w-5 {
			width: 24px;
		}

		.xl\\:w-6 {
			width: 2rem;
		}

		.xl\\:w-7 {
			width: 3rem;
		}

		.xl\\:w-8 {
			width: 4rem;
		}

		.xl\\:w-9 {
			width: 6rem;
		}

		.xl\\:w-px {
			width: 1px;
		}

		.xl\\:w-auto {
			width: auto;
		}

		.xl\\:w-full {
			width: 100%;
		}

		.xl\\:w-screen {
			width: 100vw;
		}
	}

	.max-w-9 {
		max-width: 6rem;
	}

	.max-w-10 {
		max-width: 8rem;
	}

	.max-w-11 {
		max-width: 12rem;
	}

	.max-w-12 {
		max-width: 16rem;
	}

	.max-w-sm {
		max-width: 576px;
	}

	.max-w-md {
		max-width: 768px;
	}

	.max-w-lg {
		max-width: 992px;
	}

	.max-w-xl {
		max-width: 1200px;
	}

	.max-w-full {
		max-width: 100%;
	}

	.max-w-screen {
		max-width: 100vw;
	}

	.max-w-none {
		max-width: none;
	}

	@media (width >= 576px) {
		.sm\\:max-w-9 {
			max-width: 6rem;
		}

		.sm\\:max-w-10 {
			max-width: 8rem;
		}

		.sm\\:max-w-11 {
			max-width: 12rem;
		}

		.sm\\:max-w-12 {
			max-width: 16rem;
		}

		.sm\\:max-w-sm {
			max-width: 576px;
		}

		.sm\\:max-w-md {
			max-width: 768px;
		}

		.sm\\:max-w-lg {
			max-width: 992px;
		}

		.sm\\:max-w-xl {
			max-width: 1200px;
		}

		.sm\\:max-w-full {
			max-width: 100%;
		}

		.sm\\:max-w-screen {
			max-width: 100vw;
		}

		.sm\\:max-w-none {
			max-width: none;
		}
	}

	@media (width >= 768px) {
		.md\\:max-w-9 {
			max-width: 6rem;
		}

		.md\\:max-w-10 {
			max-width: 8rem;
		}

		.md\\:max-w-11 {
			max-width: 12rem;
		}

		.md\\:max-w-12 {
			max-width: 16rem;
		}

		.md\\:max-w-sm {
			max-width: 576px;
		}

		.md\\:max-w-md {
			max-width: 768px;
		}

		.md\\:max-w-lg {
			max-width: 992px;
		}

		.md\\:max-w-xl {
			max-width: 1200px;
		}

		.md\\:max-w-full {
			max-width: 100%;
		}

		.md\\:max-w-screen {
			max-width: 100vw;
		}

		.md\\:max-w-none {
			max-width: none;
		}
	}

	@media (width >= 992px) {
		.lg\\:max-w-9 {
			max-width: 6rem;
		}

		.lg\\:max-w-10 {
			max-width: 8rem;
		}

		.lg\\:max-w-11 {
			max-width: 12rem;
		}

		.lg\\:max-w-12 {
			max-width: 16rem;
		}

		.lg\\:max-w-sm {
			max-width: 576px;
		}

		.lg\\:max-w-md {
			max-width: 768px;
		}

		.lg\\:max-w-lg {
			max-width: 992px;
		}

		.lg\\:max-w-xl {
			max-width: 1200px;
		}

		.lg\\:max-w-full {
			max-width: 100%;
		}

		.lg\\:max-w-screen {
			max-width: 100vw;
		}

		.lg\\:max-w-none {
			max-width: none;
		}
	}

	@media (width >= 1200px) {
		.xl\\:max-w-9 {
			max-width: 6rem;
		}

		.xl\\:max-w-10 {
			max-width: 8rem;
		}

		.xl\\:max-w-11 {
			max-width: 12rem;
		}

		.xl\\:max-w-12 {
			max-width: 16rem;
		}

		.xl\\:max-w-sm {
			max-width: 576px;
		}

		.xl\\:max-w-md {
			max-width: 768px;
		}

		.xl\\:max-w-lg {
			max-width: 992px;
		}

		.xl\\:max-w-xl {
			max-width: 1200px;
		}

		.xl\\:max-w-full {
			max-width: 100%;
		}

		.xl\\:max-w-screen {
			max-width: 100vw;
		}

		.xl\\:max-w-none {
			max-width: none;
		}
	}

	.min-w-0 {
		min-width: 0;
	}

	.min-w-50 {
		min-width: 50%;
	}

	.min-w-full {
		min-width: 100%;
	}

	.min-w-screen {
		min-width: 100vw;
	}

	.border-collapse {
		border-collapse: collapse;
	}

	.border-separate {
		border-collapse: separate;
	}

	.table-auto {
		table-layout: auto;
	}

	.table-fixed {
		table-layout: fixed;
	}

	.shadow {
		box-shadow:
			0 1px 3px 0 rgb(0 0 0 / 10%),
			0 1px 2px 0 rgb(0 0 0 / 6%);
	}

	.shadow-xs {
		box-shadow:
			0 1px 2px rgb(0 0 0 / 8%),
			0 2px 4px rgb(0 0 0 / 8%);
	}

	.shadow-sm {
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 10%),
			0 2px 4px -1px rgb(0 0 0 / 6%);
	}

	.shadow-md {
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 10%),
			0 4px 6px -2px rgb(0 0 0 / 5%);
	}

	.shadow-lg {
		box-shadow:
			0 20px 25px -5px rgb(0 0 0 / 10%),
			0 10px 10px -5px rgb(0 0 0 / 4%);
	}

	.shadow-xl {
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
	}

	.shadow-inner {
		box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 6%);
	}

	.shadow-outline {
		box-shadow: 0 0 0 2px rgb(0 46 108 / 25%);
	}

	.shadow-solid {
		box-shadow: 0.375rem 0.375rem 0
			rgb(0 0 0 / 50%);
	}

	.shadow-none {
		box-shadow: none;
	}

	.hover\\:shadow:hover {
		box-shadow:
			0 1px 3px 0 rgb(0 0 0 / 10%),
			0 1px 2px 0 rgb(0 0 0 / 6%);
	}

	.hover\\:shadow-xs:hover {
		box-shadow:
			0 1px 2px rgb(0 0 0 / 8%),
			0 2px 4px rgb(0 0 0 / 8%);
	}

	.hover\\:shadow-sm:hover {
		box-shadow:
			0 4px 6px -1px rgb(0 0 0 / 10%),
			0 2px 4px -1px rgb(0 0 0 / 6%);
	}

	.hover\\:shadow-md:hover {
		box-shadow:
			0 10px 15px -3px rgb(0 0 0 / 10%),
			0 4px 6px -2px rgb(0 0 0 / 5%);
	}

	.hover\\:shadow-lg:hover {
		box-shadow:
			0 20px 25px -5px rgb(0 0 0 / 10%),
			0 10px 10px -5px rgb(0 0 0 / 4%);
	}

	.hover\\:shadow-xl:hover {
		box-shadow: 0 25px 50px -12px rgb(0 0 0 / 25%);
	}

	.hover\\:shadow-inner:hover {
		box-shadow: inset 0 2px 4px 0 rgb(0 0 0 / 6%);
	}

	.hover\\:shadow-outline:hover {
		box-shadow: 0 0 0 2px rgb(0 46 108 / 25%);
	}

	.hover\\:shadow-solid:hover {
		box-shadow: 0.375rem 0.375rem 0
			rgb(0 0 0 / 50%);
	}

	.hover\\:shadow-none:hover {
		box-shadow: none;
	}

	.opacity-0 {
		opacity: 0%;
	}

	.opacity-25 {
		opacity: 25%;
	}

	.opacity-50 {
		opacity: 50%;
	}

	.opacity-75 {
		opacity: 75%;
	}

	.opacity-100 {
		opacity: 100%;
	}

	.appearance-none {
		appearance: none;
	}

	.cursor-pointer {
		cursor: pointer;
	}

	.outline-none {
		outline: none;
	}

	.pointer-events-none {
		pointer-events: none;
	}

	.pointer-events-auto {
		pointer-events: auto;
	}

	.select-none {
		user-select: none;
	}

	.select-text {
		user-select: text;
	}

	.fill-current {
		fill: currentcolor;
	}

	.stroke-current {
		stroke: currentcolor;
	}

	.sr-only {
		position: absolute;
		padding: 0;
		width: 1px;
		height: 1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		clip-path: inset(50%);
		border: 0;
		white-space: nowrap;
	}

	.sr-only-focusable:active,
	.sr-only-focusable:focus {
		position: static;
		margin: 0;
		clip: auto;
		clip-path: none;
		width: auto;
		height: auto;
		overflow: visible;
		white-space: normal;
	}

	.scale-95 {
		transform: scale(0.95);
	}

	.scale-100 {
		transform: scale(1);
	}

	.scale-105 {
		transform: scale(1.05);
	}

	.scale-110 {
		transform: scale(1.1);
	}

	.rotate-45 {
		transform: rotate(45deg);
	}

	.rotate-90 {
		transform: rotate(90deg);
	}

	.rotate-180 {
		transform: rotate(180deg);
	}

	.rotate-270 {
		transform: rotate(270deg);
	}

	.transition-slow {
		transition: 0.5s;
	}

	.transition {
		transition: 0.3s;
	}

	.transition-fast {
		transition: 0.15s;
	}

	.timing-bounce {
		transition-timing-function: cubic-bezier(
			0.77,
			0,
			0.2,
			2.25
		);
	}

	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation: none !important;
			transition: none !important;
		}
	}

	.transition-none {
		transition-property: none;
	}

	.transition-all {
		transition-property: all;
	}

	.transition-colors {
		transition-property: background-color,
			border-color, color, fill, stroke;
	}

	.transition-opacity {
		transition-property: opacity;
	}

	.transition-shadow {
		transition-property: box-shadow;
	}

	.transition-transform {
		transition-property: transform;
	}

	.timing-bounce {
		transition-timing-function: cubic-bezier(
			0.77,
			0,
			0.2,
			2.25
		);
	}

	@media (prefers-reduced-motion: reduce) {
		*,
		*::before,
		*::after {
			animation: none !important;
			transition: none !important;
		}
	}

	.transition-none {
		transition-duration: 0s;
	}

	.transition-slow {
		transition-duration: 0.5s;
	}

	.transition-medium {
		transition-duration: 0.3s;
	}

	.transition-fast {
		transition-duration: 0.15s;
	}

	.timing-bounce {
		transition-timing-function: cubic-bezier(
			0.77,
			0,
			0.2,
			2.25
		);
	}

	.hover\\:grow:hover {
		transform: scale(1.05);
	}

	.hover\\:shrink:hover {
		transform: scale(0.95);
	}

	.hover\\:bounce-in:hover {
		transform: scale(1.05);
		transition-timing-function: cubic-bezier(
			0.47,
			2.02,
			0.31,
			-0.36
		);
	}

	.hover\\:bounce-out:hover {
		transform: scale(0.95);
		transition-timing-function: cubic-bezier(
			0.47,
			2.02,
			0.31,
			-0.36
		);
	}

	.hover\\:rotate:hover {
		transform: rotate(-4deg);
	}

	.hover\\:grow-rotate:hover {
		transform: scale(1.05) rotate(-4deg);
	}

	.hover\\:float {
		transition-timing-function: ease-out;
	}

	.hover\\:float:hover {
		transform: translateY(-0.5rem);
	}

	.hover\\:shadow-3d {
		transition:
			background-color 0.3s ease,
			box-shadow 0.3s ease,
			transform 0.3s ease;
	}

	.hover\\:shadow-3d:hover {
		transform: translate3d(-0.25rem, -0.25rem, 0)
			rotateZ(-1deg);
		box-shadow: 0.5rem 0.5rem 0 rgb(0 0 0 / 50%);
	}

	.hover\\:sink {
		transition-timing-function: ease-out;
	}

	.hover\\:sink:hover {
		transform: translateY(0.5rem);
	}

	.hover\\:skew:hover {
		transform: skew(-4deg);
	}

	.hover\\:skew-forward {
		transform-origin: 0 100%;
	}

	.hover\\:skew-forward:hover {
		transform: skew(-4deg);
	}

	.hover\\:skew-backward {
		transform-origin: 0 100%;
	}

	.hover\\:skew-backward:hover {
		transform: skew(4deg);
	}

	.hover\\:forward:hover {
		transform: translateX(0.5rem);
	}

	.hover\\:backward:hover {
		transform: translateX(-0.5rem);
	}

	@font-face {
		font-style: normal;
		font-weight: 500;
		src:
			url('/hc/theming_assets/01HZKQ03J9QFW19Y0Q5FD1MF90')
				format('woff2'),
			url('/hc/theming_assets/01HZKQ04N6A1XCGF46M74KTBSW')
				format('woff');
		font-family: rbno21a;
	}

	@font-face {
		font-style: normal;
		font-weight: 700;
		src:
			url('/hc/theming_assets/01HZKQ04TZH30SF1TGV4Q8WBN6')
				format('woff2'),
			url('/hc/theming_assets/01HZKQ027PRZ0CX9WJKFB1AX6D')
				format('woff');
		font-family: rbno21a;
	}

	.font-rbno21a {
		font-family: rbno21a;
		letter-spacing: 0.03em;
		text-transform: uppercase;
	}

	.notification {
		display: table;
		transition: height 0.2s;
		border: 1px solid;
		padding: 13px 15px;
		width: 100%;
		color: #555555;
		font-size: 13px;
		font-family: sans-serif;
	}

	.notification a {
		color: #158ec2;
	}

	.notification-inner {
		margin: 0 auto;
		padding: 0 20px;
		max-width: 980px;
	}

	.notification-icon,
	.notification-text,
	.notification-dismiss {
		display: table-cell;
		vertical-align: middle;
	}

	.notification-text {
		padding: 0 15px;
		width: 100%;
	}

	.notification + .notification {
		position: relative;
		top: -1px;
		margin-bottom: -1px;
	}

	.notification-error {
		border-color: #f7cbcb;
		background: #ffeded;
	}

	.notification-error .notification-icon::before,
	.notification-error
		.notification-inline.notification-error::before {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' viewBox='0 0 12 12'%3E%3Cg fill='none' stroke='%23555555'%3E%3Ccircle cx='5.5' cy='6.5' r='5'/%3E%3Cpath stroke-linecap='round' d='M5.5 3.5v3'/%3E%3C/g%3E%3Ccircle cx='5.5' cy='9' r='1' fill='%23555555'/%3E%3C/svg%3E");
	}

	.notification-notice {
		border-color: #b5e0f5;
		background: #dbf3ff;
	}

	.notification-notice .notification-icon::before,
	.notification-notice
		.notification-inline.notification-error::before {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' viewBox='0 0 12 12'%3E%3Cg fill='none' stroke='%23555555'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' d='M3.5 6l2 2L9 4.5'/%3E%3Ccircle cx='6' cy='6' r='5.5'/%3E%3C/g%3E%3C/svg%3E");
	}

	.notification-alert {
		border-color: #fcdba9;
		background: #fff8ed;
		color: #ad5e18;
	}

	.notification-alert .notification-icon::before,
	.notification-alert
		.notification-inline.notification-error::before {
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' viewBox='0 0 12 12'%3E%3Cpath fill='none' stroke='%23ad5e18' stroke-linecap='round' d='M5.06 1.27l-4.5 8.5c-.18.33.06.73.44.73h9c.38 0 .62-.4.44-.73l-4.5-8.5a.494.494 0 00-.88 0zM5.5 4v2'/%3E%3Ccircle cx='5.5' cy='8' r='.8' fill='%23ad5e18'/%3E%3C/svg%3E");
	}

	.notification-icon::before,
	.notification-inline.notification-error::before {
		display: inline-block;
		vertical-align: middle;
		background-size: cover;
		width: 14px;
		height: 14px;
		content: '';
	}

	.notification-dismiss,
	a.notification-dismiss {
		opacity: 60%;
		transition: opacity 100ms ease;
		cursor: pointer;
		color: #555555;
		text-decoration: none !important;
	}

	.notification-dismiss:hover {
		opacity: 100%;
	}

	.notification-inline {
		position: relative;
		vertical-align: middle;
		margin-top: 5px;
		border-radius: 4px;
		padding: 5px;
		line-height: 14px;
		text-align: left;
	}

	[dir='rtl'] .notification-inline {
		text-align: right;
	}

	.notification-inline[aria-hidden='true'] {
		display: none;
	}

	.notification-inline.notification-error::before {
		margin: -2px 5px 0 0;
		background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' focusable='false' viewBox='0 0 12 12'%3E%3Cg fill='none' stroke='%23e35b66'%3E%3Ccircle cx='5.5' cy='6.5' r='5'/%3E%3Cpath stroke-linecap='round' d='M5.5 3.5v3'/%3E%3C/g%3E%3Ccircle cx='5.5' cy='9' r='1' fill='%23e35b66'/%3E%3C/svg%3E");
	}

	[dir='rtl']
		.notification-inline.notification-error::before {
		margin: 0 0 0 5px;
	}

	.notification-inline.notification-error {
		border: 1px solid #e35b66;
		background-color: #fff0f1;
		color: #cc3340;
	}

	.notification-inline.notification-large {
		margin-bottom: 25px;
		padding: 13px 15px;
	}

	.notification-left-aligned {
		padding-left: 0;
		text-align: left;
	}

	html[dir='rtl'] .notification-left-aligned {
		padding-right: 0;
		padding-left: auto;
		text-align: right;
	}

	.badge-white {
		background-color: #ffffff;
		color: #1a202c;
	}

	a.badge-white:focus,
	a.badge-white:hover {
		background-color: #e6e6e6;
		color: #1a202c;
	}

	a.badge-white:focus,
	a.badge-white.is-focused {
		outline: 0;
		box-shadow: 0 0 0 0.2rem
			rgb(255 255 255 / 25%);
	}

	.badge-new {
		background-color: #d69e2e;
		color: #ffffff;
	}

	a.badge-new:focus,
	a.badge-new:hover {
		background-color: #af8022;
		color: #ffffff;
	}

	a.badge-new:focus,
	a.badge-new.is-focused {
		outline: 0;
		box-shadow: 0 0 0 0.2rem rgb(214 158 46 / 25%);
	}

	.badge-open {
		background-color: #e53e3e;
		color: #ffffff;
	}

	a.badge-open:focus,
	a.badge-open:hover {
		background-color: #d41c1c;
		color: #ffffff;
	}

	a.badge-open:focus,
	a.badge-open.is-focused {
		outline: 0;
		box-shadow: 0 0 0 0.2rem rgb(229 62 62 / 25%);
	}

	.badge-answered {
		background-color: #3490dc;
		color: #ffffff;
	}

	a.badge-answered:focus,
	a.badge-answered:hover {
		background-color: #2176bd;
		color: #ffffff;
	}

	a.badge-answered:focus,
	a.badge-answered.is-focused {
		outline: 0;
		box-shadow: 0 0 0 0.2rem rgb(52 144 220 / 25%);
	}

	.badge-hold {
		background-color: #1a202c;
		color: #ffffff;
	}

	a.badge-hold:focus,
	a.badge-hold:hover {
		background-color: #07090c;
		color: #ffffff;
	}

	a.badge-hold:focus,
	a.badge-hold.is-focused {
		outline: 0;
		box-shadow: 0 0 0 0.2rem rgb(26 32 44 / 25%);
	}

	.badge-solved {
		background-color: #718096;
		color: #ffffff;
	}

	a.badge-solved:focus,
	a.badge-solved:hover {
		background-color: #5a677a;
		color: #ffffff;
	}

	a.badge-solved:focus,
	a.badge-solved.is-focused {
		outline: 0;
		box-shadow: 0 0 0 0.2rem
			rgb(113 128 150 / 25%);
	}

	.badge-answered {
		background-color: #3490dc;
		color: #ffffff;
	}

	a.badge-answered:focus,
	a.badge-answered:hover {
		background-color: #2176bd;
		color: #ffffff;
	}

	a.badge-answered:focus,
	a.badge-answered.is-focused {
		outline: 0;
		box-shadow: 0 0 0 0.2rem rgb(52 144 220 / 25%);
	}

	.badge-completed {
		background-color: #3490dc;
		color: #ffffff;
	}

	a.badge-completed:focus,
	a.badge-completed:hover {
		background-color: #2176bd;
		color: #ffffff;
	}

	a.badge-completed:focus,
	a.badge-completed.is-focused {
		outline: 0;
		box-shadow: 0 0 0 0.2rem rgb(52 144 220 / 25%);
	}

	.badge-planned {
		background-color: #3490dc;
		color: #ffffff;
	}

	a.badge-planned:focus,
	a.badge-planned:hover {
		background-color: #2176bd;
		color: #ffffff;
	}

	a.badge-planned:focus,
	a.badge-planned.is-focused {
		outline: 0;
		box-shadow: 0 0 0 0.2rem rgb(52 144 220 / 25%);
	}

	.subscribe-article,
	.subscribe-section,
	.subscribe-topic {
		align-self: center;
		white-space: nowrap;
	}

	.actions-user button,
	.subscribe-user button {
		width: 100%;
	}

	@media (width >= 768px) {
		.actions-user button,
		.subscribe-user button {
			width: auto;
		}
	}

	.actions-user > .button:not(:first-child),
	.actions-user
		> .pagination-next-link:not(:first-child),
	.actions-user
		> .pagination-prev-link:not(:first-child),
	.actions-user
		> .pagination-first-link:not(:first-child),
	.actions-user
		> .pagination-last-link:not(:first-child),
	.subscribe-article
		.actions-user
		> button:not(:first-child),
	.subscribe-section
		.actions-user
		> button:not(:first-child),
	.subscribe-topic
		.actions-user
		> button:not(:first-child),
	.subscribe-organization
		.actions-user
		> button:not(:first-child),
	.actions-user > button:not(:first-child),
	.subscribe-user
		.actions-user
		> button:not(:first-child),
	.subscribe-link
		.actions-user
		> button:not(:first-child),
	.form
		.actions-user
		> input[type='submit']:not(:first-child),
	.search.has-button
		.actions-user
		> [type='submit']:not(:first-child),
	.actions-user > .button-group:not(:first-child),
	.subscribe-user > .button:not(:first-child),
	.subscribe-user
		> .pagination-next-link:not(:first-child),
	.subscribe-user
		> .pagination-prev-link:not(:first-child),
	.subscribe-user
		> .pagination-first-link:not(:first-child),
	.subscribe-user
		> .pagination-last-link:not(:first-child),
	.subscribe-article
		.subscribe-user
		> button:not(:first-child),
	.subscribe-section
		.subscribe-user
		> button:not(:first-child),
	.subscribe-topic
		.subscribe-user
		> button:not(:first-child),
	.subscribe-organization
		.subscribe-user
		> button:not(:first-child),
	.actions-user
		.subscribe-user
		> button:not(:first-child),
	.subscribe-user > button:not(:first-child),
	.subscribe-link
		.subscribe-user
		> button:not(:first-child),
	.form
		.subscribe-user
		> input[type='submit']:not(:first-child),
	.search.has-button
		.subscribe-user
		> [type='submit']:not(:first-child),
	.subscribe-user
		> .button-group:not(:first-child) {
		margin-left: -1px;
	}

	.actions-user > .button:not(:last-child),
	.actions-user
		> .pagination-next-link:not(:last-child),
	.actions-user
		> .pagination-prev-link:not(:last-child),
	.actions-user
		> .pagination-first-link:not(:last-child),
	.actions-user
		> .pagination-last-link:not(:last-child),
	.subscribe-article
		.actions-user
		> button:not(:last-child),
	.subscribe-section
		.actions-user
		> button:not(:last-child),
	.subscribe-topic
		.actions-user
		> button:not(:last-child),
	.subscribe-organization
		.actions-user
		> button:not(:last-child),
	.actions-user > button:not(:last-child),
	.subscribe-user
		.actions-user
		> button:not(:last-child),
	.subscribe-link
		.actions-user
		> button:not(:last-child),
	.form
		.actions-user
		> input[type='submit']:not(:last-child),
	.search.has-button
		.actions-user
		> [type='submit']:not(:last-child),
	.actions-user
		> .button-group:not(:last-child)
		> .button,
	.actions-user
		> .button-group:not(:last-child)
		> .pagination-next-link,
	.actions-user
		> .button-group:not(:last-child)
		> .pagination-prev-link,
	.actions-user
		> .button-group:not(:last-child)
		> .pagination-first-link,
	.actions-user
		> .button-group:not(:last-child)
		> .pagination-last-link,
	.subscribe-article
		.actions-user
		> .button-group:not(:last-child)
		> button,
	.subscribe-section
		.actions-user
		> .button-group:not(:last-child)
		> button,
	.subscribe-topic
		.actions-user
		> .button-group:not(:last-child)
		> button,
	.subscribe-organization
		.actions-user
		> .button-group:not(:last-child)
		> button,
	.actions-user
		> .button-group:not(:last-child)
		> button,
	.subscribe-user
		.actions-user
		> .button-group:not(:last-child)
		> button,
	.subscribe-link
		.actions-user
		> .button-group:not(:last-child)
		> button,
	.form
		.actions-user
		> .button-group:not(:last-child)
		> input[type='submit'],
	.search.has-button
		.actions-user
		> .button-group:not(:last-child)
		> [type='submit'],
	.subscribe-user > .button:not(:last-child),
	.subscribe-user
		> .pagination-next-link:not(:last-child),
	.subscribe-user
		> .pagination-prev-link:not(:last-child),
	.subscribe-user
		> .pagination-first-link:not(:last-child),
	.subscribe-user
		> .pagination-last-link:not(:last-child),
	.subscribe-article
		.subscribe-user
		> button:not(:last-child),
	.subscribe-section
		.subscribe-user
		> button:not(:last-child),
	.subscribe-topic
		.subscribe-user
		> button:not(:last-child),
	.subscribe-organization
		.subscribe-user
		> button:not(:last-child),
	.actions-user
		.subscribe-user
		> button:not(:last-child),
	.subscribe-user > button:not(:last-child),
	.subscribe-link
		.subscribe-user
		> button:not(:last-child),
	.form
		.subscribe-user
		> input[type='submit']:not(:last-child),
	.search.has-button
		.subscribe-user
		> [type='submit']:not(:last-child),
	.subscribe-user
		> .button-group:not(:last-child)
		> .button,
	.subscribe-user
		> .button-group:not(:last-child)
		> .pagination-next-link,
	.subscribe-user
		> .button-group:not(:last-child)
		> .pagination-prev-link,
	.subscribe-user
		> .button-group:not(:last-child)
		> .pagination-first-link,
	.subscribe-user
		> .button-group:not(:last-child)
		> .pagination-last-link,
	.subscribe-article
		.subscribe-user
		> .button-group:not(:last-child)
		> button,
	.subscribe-section
		.subscribe-user
		> .button-group:not(:last-child)
		> button,
	.subscribe-topic
		.subscribe-user
		> .button-group:not(:last-child)
		> button,
	.subscribe-organization
		.subscribe-user
		> .button-group:not(:last-child)
		> button,
	.actions-user
		.subscribe-user
		> .button-group:not(:last-child)
		> button,
	.subscribe-user
		> .button-group:not(:last-child)
		> button,
	.subscribe-link
		.subscribe-user
		> .button-group:not(:last-child)
		> button,
	.form
		.subscribe-user
		> .button-group:not(:last-child)
		> input[type='submit'],
	.search.has-button
		.subscribe-user
		> .button-group:not(:last-child)
		> [type='submit'] {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.actions-user > .button:not(:first-child),
	.actions-user
		> .pagination-next-link:not(:first-child),
	.actions-user
		> .pagination-prev-link:not(:first-child),
	.actions-user
		> .pagination-first-link:not(:first-child),
	.actions-user
		> .pagination-last-link:not(:first-child),
	.subscribe-article
		.actions-user
		> button:not(:first-child),
	.subscribe-section
		.actions-user
		> button:not(:first-child),
	.subscribe-topic
		.actions-user
		> button:not(:first-child),
	.subscribe-organization
		.actions-user
		> button:not(:first-child),
	.actions-user > button:not(:first-child),
	.subscribe-user
		.actions-user
		> button:not(:first-child),
	.subscribe-link
		.actions-user
		> button:not(:first-child),
	.form
		.actions-user
		> input[type='submit']:not(:first-child),
	.search.has-button
		.actions-user
		> [type='submit']:not(:first-child),
	.actions-user
		> .button-group:not(:first-child)
		> .button,
	.actions-user
		> .button-group:not(:first-child)
		> .pagination-next-link,
	.actions-user
		> .button-group:not(:first-child)
		> .pagination-prev-link,
	.actions-user
		> .button-group:not(:first-child)
		> .pagination-first-link,
	.actions-user
		> .button-group:not(:first-child)
		> .pagination-last-link,
	.subscribe-article
		.actions-user
		> .button-group:not(:first-child)
		> button,
	.subscribe-section
		.actions-user
		> .button-group:not(:first-child)
		> button,
	.subscribe-topic
		.actions-user
		> .button-group:not(:first-child)
		> button,
	.subscribe-organization
		.actions-user
		> .button-group:not(:first-child)
		> button,
	.actions-user
		> .button-group:not(:first-child)
		> button,
	.subscribe-user
		.actions-user
		> .button-group:not(:first-child)
		> button,
	.subscribe-link
		.actions-user
		> .button-group:not(:first-child)
		> button,
	.form
		.actions-user
		> .button-group:not(:first-child)
		> input[type='submit'],
	.search.has-button
		.actions-user
		> .button-group:not(:first-child)
		> [type='submit'],
	.subscribe-user > .button:not(:first-child),
	.subscribe-user
		> .pagination-next-link:not(:first-child),
	.subscribe-user
		> .pagination-prev-link:not(:first-child),
	.subscribe-user
		> .pagination-first-link:not(:first-child),
	.subscribe-user
		> .pagination-last-link:not(:first-child),
	.subscribe-article
		.subscribe-user
		> button:not(:first-child),
	.subscribe-section
		.subscribe-user
		> button:not(:first-child),
	.subscribe-topic
		.subscribe-user
		> button:not(:first-child),
	.subscribe-organization
		.subscribe-user
		> button:not(:first-child),
	.actions-user
		.subscribe-user
		> button:not(:first-child),
	.subscribe-user > button:not(:first-child),
	.subscribe-link
		.subscribe-user
		> button:not(:first-child),
	.form
		.subscribe-user
		> input[type='submit']:not(:first-child),
	.search.has-button
		.subscribe-user
		> [type='submit']:not(:first-child),
	.subscribe-user
		> .button-group:not(:first-child)
		> .button,
	.subscribe-user
		> .button-group:not(:first-child)
		> .pagination-next-link,
	.subscribe-user
		> .button-group:not(:first-child)
		> .pagination-prev-link,
	.subscribe-user
		> .button-group:not(:first-child)
		> .pagination-first-link,
	.subscribe-user
		> .button-group:not(:first-child)
		> .pagination-last-link,
	.subscribe-article
		.subscribe-user
		> .button-group:not(:first-child)
		> button,
	.subscribe-section
		.subscribe-user
		> .button-group:not(:first-child)
		> button,
	.subscribe-topic
		.subscribe-user
		> .button-group:not(:first-child)
		> button,
	.subscribe-organization
		.subscribe-user
		> .button-group:not(:first-child)
		> button,
	.actions-user
		.subscribe-user
		> .button-group:not(:first-child)
		> button,
	.subscribe-user
		> .button-group:not(:first-child)
		> button,
	.subscribe-link
		.subscribe-user
		> .button-group:not(:first-child)
		> button,
	.form
		.subscribe-user
		> .button-group:not(:first-child)
		> input[type='submit'],
	.search.has-button
		.subscribe-user
		> .button-group:not(:first-child)
		> [type='submit'] {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	.subscribe-link button {
		padding: 0;
	}

	.actions-comment button {
		appearance: none;
		margin-right: -0.5rem;
		box-shadow: none;
		border: 0;
		background: none;
		padding: 0;
		padding: 0.5rem;
		overflow: visible;
		color: inherit;
		font: inherit;
		line-height: normal;
		user-select: none;
	}

	.form input[type='submit'] {
		margin-top: 1.5rem;
		margin-bottom: 1.5rem;
	}

	.sticky-header {
		transition: all 0.15s ease-in-out;
	}

	.fixed-header {
		border-bottom-color: transparent;
	}

	.fixed-header,
	.fixed-header .nav-menu {
		background-color: transparent;
	}

	.fixed-header .navbar-toggle,
	.fixed-header .nav-link {
		color: #e2e8f0;
	}

	.fixed-header .navbar-toggle:hover,
	.fixed-header .nav-link:hover {
		color: #ced8e6;
	}

	.fixed-header .navbar-toggle:active,
	.fixed-header .nav-link:active {
		color: #bac8db;
	}

	.mobile-menu-open .fixed-header,
	.fixed-header.is-stuck {
		background-color: #ffffff;
	}

	.mobile-menu-open .fixed-header .navbar-toggle,
	.mobile-menu-open .fixed-header .nav-link,
	.fixed-header.is-stuck .navbar-toggle,
	.fixed-header.is-stuck .nav-link {
		color: #000000;
	}

	.mobile-menu-open
		.fixed-header
		.navbar-toggle:hover,
	.mobile-menu-open .fixed-header .nav-link:hover,
	.fixed-header.is-stuck .navbar-toggle:hover,
	.fixed-header.is-stuck .nav-link:hover {
		color: #000000;
	}

	.mobile-menu-open
		.fixed-header
		.navbar-toggle:active,
	.mobile-menu-open
		.fixed-header
		.nav-link:active,
	.fixed-header.is-stuck .navbar-toggle:active,
	.fixed-header.is-stuck .nav-link:active {
		color: #000000;
	}

	.fixed-header:not(.is-visible) ~ main > .hero,
	.fixed-header.sticky-header ~ main > .hero {
		margin-top: -100%;
	}

	.fixed-header .is-stuck,
	.sticky-header .is-stuck {
		border-bottom-color: transparent;
	}

	.fixed-header:not(.is-visible),
	.sticky-header:not(.is-visible) {
		visibility: hidden;
	}

	.search.has-button .form-field {
		display: flex;
		min-width: 320px;
	}

	.search.has-button [type='search'] {
		padding: 0.5em 0.75em;
	}

	.search.has-button [type='submit'] {
		flex: 0;
	}

	[dir='ltr'] .search.has-button [type='submit'] {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	[dir='rtl'] .search.has-button [type='submit'] {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
	}

	.search.has-button .search-icon {
		display: none;
	}

	.hero {
		color: rgb(255 255 255 / 100%);
	}

	.hero h1 {
		color: rgb(255 255 255 / 100%);
	}

	.icon-circle {
		display: inline-flex;
		border-radius: 50%;
		background-color: #f6f7ff;
		padding: 1em;
	}

	.icon-circle [class*='icon-']::before,
	.icon-circle .svg-icon {
		bottom: auto;
	}

	a:hover .icon-circle {
		border-color: #002e6c;
		background-color: #ffffff;
		color: #002e6c;
		text-decoration: none;
	}

	.img-left {
		float: left;
		margin-right: 16px;
		text-align: left;
	}

	.img-right {
		float: right;
		margin-left: 16px;
		text-align: right;
	}

	.img-thumbnail {
		border: 1px solid #e2e8f0;
		border-radius: 0.25rem;
		padding: 16px;
	}

	@media (width >= 768px) {
		.img-left {
			margin-left: -16px;
		}

		.img-right {
			margin-right: -16px;
		}
	}

	.share {
		padding-left: 0;
		list-style: none;
	}

	.share svg {
		width: 1em;
		height: 1em;
	}

	.share li {
		display: inline-block;
		margin-right: 0.5rem;
	}

	.share a {
		color: inherit;
	}

	.share-facebook:focus,
	.share-facebook:hover {
		color: #3b5998;
	}

	.share-twitter:focus,
	.share-twitter:hover {
		color: #00aced;
	}

	.share-linkedin:focus,
	.share-linkedin:hover {
		color: #007bb6;
	}

	.list-check,
	.list-number {
		margin-top: 24px;
		margin-bottom: 24px;
		padding-left: 0;
		list-style: none;
	}

	.list-check > li,
	.list-number > li {
		position: relative;
		margin-top: 12px;
		margin-bottom: 12px;
		padding-left: 2.75em;
	}

	.list-check > li::before,
	.list-number > li::before {
		display: inline-block;
		position: absolute;
		left: 0.5em;
		border-radius: 50%;
		width: 1.725em;
		height: 1.725em;
		font-weight: 500;
		font-size: 0.875em;
		line-height: 1.725em;
		text-align: center;
	}

	.list-check > li::before {
		background-color: #e2e8f0;
		content: '✓';
	}

	.list-number {
		counter-reset: list;
	}

	.list-number > li {
		counter-increment: list;
	}

	.list-number > li::before {
		background-color: #e2e8f0;
		content: counter(list);
	}

	.suggestion-list label {
		display: block;
		border-bottom: 1px solid #e2e8f0;
		padding-bottom: 0.5rem;
		font-size: 0.9375rem;
	}

	.suggestion-list ul {
		padding-bottom: 1rem;
		padding-left: 0;
		font-size: 0.9375rem;
		list-style: none;
	}

	.suggestion-list a {
		display: block;
		padding-top: 0.5rem;
		padding-bottom: 0.5rem;
	}

	#logo {
		height: 32px;
	}

	@media (width >= 992px) {
		.meta-block::before {
			display: none;
		}
	}

	.sidebar {
		position: relative;
	}

	.sidebar::before {
		position: absolute;
		top: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
		background-color: inherit;
		width: 100vw;
		content: '';
	}

	.svg-shape {
		position: absolute;
		bottom: 0;
		left: 0;
		z-index: 0;
		width: 100%;
		height: 4rem;
	}

	.requests-sort-symbol {
		position: absolute;
		bottom: 0;
		left: calc(100% + 0.25em);
		font-size: 0.625em;
	}

	.content table:not([class*='table']) {
		border: none;
		max-height: 20rem;
		overflow-y: scroll;
	}

	.note,
	.warning,
	.disclaimer {
		position: relative;
		z-index: 1;
		margin: 2rem 0;
		border-radius: 0.25rem;
		padding: 1.5rem;
		overflow: hidden;
	}

	.note::before,
	.warning::before,
	.disclaimer::before {
		display: block;
		margin-bottom: 12px;
		font-weight: 700;
	}

	.note::after,
	.warning::after .disclaimer::after {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 5%;
		z-index: -1;
		width: 100%;
		height: 100%;
		content: '';
	}

	.note {
		border-left: 4px solid #61a5ff;
	}

	.note::before {
		content: 'Note';
		color: #61a5ff;
	}

	.note::before:empty {
		display: none;
	}

	.note::after {
		background-color: #61a5ff;
	}

	.warning {
		border-left: 4px solid rgb(255 130 0 / 100%);
	}

	.warning::before {
		content: 'Warning';
		color: rgb(255 130 0 / 100%);
	}

	.warning::after {
		background-color: rgb(255 130 0 / 100%);
	}

	.disclaimer {
		border-left: 4px solid rgb(255 130 0 / 100%);
	}

	.disclaimer::before {
		content: 'Disclaimer';
		color: rgb(255 130 0 / 100%);
	}

	.disclaimer::after {
		background-color: rgb(255 130 0 / 100%);
	}

	.pull-left,
	.pull-right {
		font-weight: 700;
	}

	.content em {
		background-color: transparent;
		padding: 0;
		color: inherit;
	}

	.content img,
	.content iframe {
		max-width: 100%;
	}

	@media (width >= 992px) {
		.pull-left {
			float: left;
			margin-right: 24px;
			margin-left: -16px;
			text-align: left;
		}

		.pull-right {
			float: right;
			margin-right: -16px;
			margin-left: 24px;
			text-align: right;
		}

		.pull-left,
		.pull-right {
			margin-top: 10px;
			margin-bottom: 10px;
			max-width: 20rem;
		}
	}

	.bg-community {
		background-image: url('/hc/theming_assets/01HZKQ0KZB6NZZQ917DEA66QV4');
	}

	.bg-home {
		background-image: url('/hc/theming_assets/01HZKQ0KRKSACFQRKPE7VBDKCB');
	}

	.bg-hero {
		background: linear-gradient(#002e6c, #002e6c);
	}

	.group:hover .group-hover\\:text-white {
		color: #ffffff;
	}

	.group:hover .group-hover\\:text-primary {
		color: #002e6c;
	}

	[class*='column-count-'] {
		column-gap: 1.5rem;
	}

	[class*='column-count-'] > * {
		-webkit-column-break-inside: avoid;
		break-inside: avoid;
		page-break-inside: avoid;
	}

	.column-count-auto {
		columns: 20em auto;
	}

	.column-count-2 {
		column-count: 2;
	}

	.column-count-3 {
		column-count: 3;
	}

	.column-count-4 {
		column-count: 4;
	}

	@media (width >= 576px) {
		.sm\\:column-count-auto {
			columns: 20em auto;
		}

		.sm\\:column-count-2 {
			column-count: 2;
		}

		.sm\\:column-count-3 {
			column-count: 3;
		}

		.sm\\:column-count-4 {
			column-count: 4;
		}
	}

	@media (width >= 768px) {
		.md\\:column-count-auto {
			columns: 20em auto;
		}

		.md\\:column-count-2 {
			column-count: 2;
		}

		.md\\:column-count-3 {
			column-count: 3;
		}

		.md\\:column-count-4 {
			column-count: 4;
		}
	}

	@media (width >= 992px) {
		.lg\\:column-count-auto {
			columns: 20em auto;
		}

		.lg\\:column-count-2 {
			column-count: 2;
		}

		.lg\\:column-count-3 {
			column-count: 3;
		}

		.lg\\:column-count-4 {
			column-count: 4;
		}
	}

	@media (width >= 1200px) {
		.xl\\:column-count-auto {
			columns: 20em auto;
		}

		.xl\\:column-count-2 {
			column-count: 2;
		}

		.xl\\:column-count-3 {
			column-count: 3;
		}

		.xl\\:column-count-4 {
			column-count: 4;
		}
	}

	@keyframes skeleton {
		100% {
			left: 100%;
		}
	}

	.skeleton {
		display: inline-block;
		border-radius: 4px;
		background-color: rgb(47 57 65 / 10%);
		width: 100%;
		overflow: hidden;
		line-height: 0.6;
	}

	.skeleton::before {
		position: absolute;
		top: 0;
		left: -1800px;
		animation: 1.5s ease-in-out 300ms infinite
			normal none running skeleton;
		background-image: linear-gradient(
			45deg,
			transparent,
			rgb(255 255 255 / 60%),
			transparent
		);
		width: 1000px;
		height: 100%;
		content: '';
	}

	.background-chevron {
		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;
		height: 100%;
	}

	@media (width >= 768px) {
		.background-chevron {
			left: 2rem;
			transform: scale(1.2);
		}
	}

	@media (width >= 1200px) {
		.background-chevron {
			left: 6rem;
			transform: scale(1.5);
		}
	}

	.promoted-article {
		margin-bottom: -1px;
	}

	.promoted-article .media {
		border: 1px solid #e2e8f0;
	}

	.promoted-article:first-child .media {
		border-top-right-radius: 0.25rem;
		border-top-left-radius: 0.25rem;
	}

	.promoted-article:last-child .media {
		border-bottom-right-radius: 0.25rem;
		border-bottom-left-radius: 0.25rem;
	}

	@media (width >= 768px) {
		.promoted-article:nth-child(2) .media {
			border-top-right-radius: 0.25rem;
			border-top-left-radius: 0.25rem;
		}

		.promoted-article:nth-last-child(2) .media {
			border-bottom-right-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}

		.promoted-article:nth-last-child(1) .media {
			border-bottom-right-radius: 0.25rem;
			border-bottom-left-radius: 0.25rem;
		}
	}

	@media (width >= 992px) {
		.promoted-article {
			margin-bottom: 20px;
		}

		.promoted-article .media {
			border-radius: 0.25rem;
		}
	}

	.recent-articles h2 {
		margin-top: 2rem;
		line-height: 28px;
	}

	.recent-articles ul {
		padding: 0;
		list-style: none;
	}

	.recent-articles li {
		flex: 0 0 100%;
		margin-bottom: -1px;
		padding-right: 12px;
		padding-left: 12px;
		max-width: 100%;
	}

	.recent-articles li:not(:last-child) a {
		border-bottom: 1px solid #e2e8f0;
	}

	@media (width >= 768px) {
		.recent-articles li {
			flex: 0 0 50%;
			max-width: 50%;
		}

		.recent-articles
			li:nth-last-of-type(-n + 2)
			a {
			border-bottom: none;
		}
	}

	.recent-articles a {
		display: block;
		background-image: url("data:image/svg+xml,%3Csvg width='8' height='12' viewBox='0 0 8 12' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0.339966 10.59L4.91997 6L0.339966 1.41L1.74997 0L7.74997 6L1.74997 12L0.339966 10.59Z' fill='black' fill-opacity='0.82'/%3E%3C/svg%3E");
		background-position: right 0.75em center;
		background-repeat: no-repeat;
		padding-top: 1rem;
		padding-right: 2rem;
		padding-bottom: 1rem;
		height: 100%;
		font-weight: 600;
		line-height: 1.25;
	}

	@media (width >= 992px) {
		.header .search {
			width: 325px;
		}
	}

	.sidebar {
		max-width: 348px;
	}

	.level-1 {
		padding-left: 1rem;
	}

	.level-2 {
		padding-left: 2rem;
	}

	.level-3 {
		padding-left: 3rem;
	}

	.level-4 {
		padding-left: 4rem;
	}

	.yonyx {
		border: 0;
		width: 100%;
	}

	@media (width >= 576px) and (width <= 767.98px) {
		.category-list .sm\\:last-children {
			border-bottom: none !important;
		}
	}

	@media (width >= 768px) and (width <= 991.98px) {
		.category-list .md\\:last-children {
			border-bottom: none !important;
		}
	}

	@media (width >= 992px) {
		.category-list .lg\\:last-children {
			border-bottom: none !important;
		}
	}

	.home-page .header .search {
		display: none;
	}

	h2 {
		line-height: 28px;
	}

	@media (width >= 992px) {
		.tagline {
			font-size: 24px;
			line-height: 24px;
		}
	}

	.hero-title {
		font-size: 28px;
		line-height: 1.15;
	}

	@media (width >= 992px) {
		.hero-title {
			font-size: 1.875rem;
		}
	}

	[x-cloak] {
		display: none !important;
	}

	.breadcrumbs > :first-child {
		display: none;
	}

	.breadcrumbs > :nth-child(2) {
		padding-left: 0;
	}

	.breadcrumbs > :nth-child(2)::before {
		display: none;
	}

	.section-card {
		padding: 8px;
	}

	.section-image {
		width: 84px;
		height: 84px;
	}

	.article-title {
		font-size: 28px;
		line-height: 32px;
	}

	/**** GOOGLE TRANSLATE ****/
	.topbar {
		position: relative;
	}

	div#google_translate_element {
		position: absolute;
		top: 50%;
		right: 5px;
		transform: translateY(-50%);
		margin-left: 32px;
		height: 25px;
		overflow: hidden;
	}

	.goog-te-gadget {
		color: #666666;
		font-family: rbno21a;
	}

	.goog-te-gadget span {
		display: none;
	}

	.goog-te-combo {
		appearance: none;
		margin: 2px 0 !important;
		border: 0;
		background-color: transparent;
		background: url("data:image/svg+xml;utf8,<svg fill='black' height='24' viewBox='0 0 24 24' width='24' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/><path d='M0 0h24v24H0z' fill='none'/></svg>")
			no-repeat right center;
		padding: 0;
		padding-right: 20px;
		color: black;
		font-weight: regular;
		font-size: 12px !important;
		line-height: 2;
		font-family:
			Source Sans Pro,
			-apple-system,
			BlinkMacSystemFont,
			Segoe UI,
			Helvetica,
			Arial,
			sans-serif !important;
		text-align: right;
	}

	.goog-te-combo:focus-visible {
		outline: 0;
		border: 0;
	}

	.goog-te-combo:focus {
		outline: 0;
	}

	/*** TOP NAV MOBILE ***/
	@media (width <= 575px) {
		.topbar .navbar {
			justify-content: space-evenly;
			padding-right: 8px;
			padding-left: 8px;
		}

		div#google_translate_element {
			position: inherit;
			transform: none;
			height: 26px;
		}

		.goog-te-combo {
			font-size: 12px !important;
		}

		.topbar .px-6 {
			padding-right: 1%;
			padding-left: 0;
			font-size: 14px;
			line-height: 1em;
			text-align: center;
		}
	}

	/*** Footer phone numbers ***/
	.country_phone img {
		margin-right: 10px;
		width: 50px;
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
