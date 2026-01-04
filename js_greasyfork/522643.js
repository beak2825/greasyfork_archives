// ==UserScript==
// @name Uptime Robot Status Page - Dark Mode
// @namespace typpi.online
// @version 1.0.2
// @description Dark mode for Stats.uptimerobot.com pages
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.stats.uptimerobot.com/*
// @downloadURL https://update.greasyfork.org/scripts/522643/Uptime%20Robot%20Status%20Page%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/522643/Uptime%20Robot%20Status%20Page%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/*! normalize.css v5.0.0 | MIT License | github.com/necolas/normalize.css */
	html {
		line-height: 1.15;
		font-family: sans-serif;
		-ms-text-size-adjust: 100%;
		-webkit-text-size-adjust: 100%;
		background: #111b25 !important;
		letter-spacing: 0.01em;
	}

	* {
		box-sizing: border-box;
	}

	body {
		margin: 0;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		background: #111b25;
	}

	article,
	aside,
	footer,
	header,
	nav,
	section {
		display: block;
	}

	h1 {
		margin: 0.67em 0;
		font-size: 2em;
	}

	figcaption,
	figure,
	main {
		display: block;
	}

	figure {
		margin: 1em 40px;
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
		-webkit-text-decoration-skip: objects;
	}

	a:active,
	a:hover {
		outline-width: 0;
	}

	abbr[title] {
		border-bottom: none;
		text-decoration: underline;
		text-decoration: underline dotted;
	}

	code,
	kbd,
	samp {
		font-size: 1em;
		font-family: monospace;
	}

	dfn {
		font-style: italic;
	}

	mark {
		background-color: #ff0;
		color: #000;
	}

	small {
		font-size: 80%;
	}

	sub,
	sup {
		position: relative;
		font-size: 75%;
		line-height: 0;
	}

	sub {
		bottom: -0.25em;
	}

	sup {
		top: 0.15em;
	}

	audio,
	video {
		display: inline-block;
	}

	audio:not([controls]) {
		display: none;
		height: 0;
	}

	img {
		border-style: none;
	}

	svg:not(:root) {
		overflow: hidden;
	}

	button,
	input,
	optgroup,
	select,
	textarea,
	[role='button'] {
		margin: 0;
		outline: 0 !important;
		color: inherit;
		font-size: 100%;
		line-height: 1.15;
		font-family: inherit;
	}

	button,
	input {
		overflow: visible;
	}

	button {
		cursor: pointer;
		border: 0;
		background: transparent;
		padding: 0;
		text-align: inherit;
	}

	button:focus,
	button:active {
		outline: 0;
	}

	input::input-placeholder,
	textarea::input-placeholder {
		opacity: 100%;
	}

	input:input-placeholder,
	textarea:input-placeholder {
		opacity: 100%;
	}

	input::placeholder,
	textarea::placeholder {
		opacity: 100%;
	}

	input[type='checkbox'] {
		vertical-align: middle;
	}

	button,
	select {
		text-transform: none;
	}

	button,
	html [type='button'],
	[type='reset'],
	[type='submit'] {
		-webkit-appearance: button;
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
		margin: 0 2px;
		border: 1px solid #c0c0c0;
		padding: 0.35em 0.625em 0.75em;
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
		display: inline-block;
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
		-webkit-appearance: textfield;
		outline-offset: -2px;
	}

	[type='search']::-webkit-search-cancel-button,
	[type='search']::-webkit-search-decoration {
		-webkit-appearance: none;
	}

	::-webkit-file-upload-button {
		-webkit-appearance: button;
		font: inherit;
	}

	details,
	menu {
		display: block;
	}

	summary {
		display: list-item;
	}

	canvas {
		display: inline-block;
	}

	template {
		display: none;
	}

	[hidden] {
		display: none;
	}

	nav ul {
		list-style: none;
	}

	audio,
	canvas,
	iframe,
	img,
	svg,
	video {
		vertical-align: middle;
	}

	html {
		font-weight: normal;
		font-size: 18px;
		line-height: 1.33;
		font-family: Roboto, Arial, sans-serif;
		-webkit-text-size-adjust: 100%;
		background: #fff;
		color: #131a26;
	}

	body {
		margin: 0;
	}

	a:active,
	a:hover {
		outline: none;
	}

	a,
	.uk-link {
		cursor: pointer;
		color: #3bd671;
		text-decoration: underline;
	}

	a:hover,
	.uk-link:hover,
	.uk-link-toggle:hover .uk-link,
	.uk-link-toggle:focus .uk-link {
		color: #26b859;
		text-decoration: none;
	}

	abbr[title] {
		text-decoration: underline dotted;
		-webkit-text-decoration-style: dotted;
	}

	b,
	strong {
		font-weight: bolder;
	}

	:not(pre) > code,
	:not(pre) > kbd,
	:not(pre) > samp {
		color: #df484a;
		font-size: 0.875rem;
		font-family: Consolas, monaco, monospace;
		white-space: nowrap;
	}

	em {
		color: #df484a;
	}

	ins {
		background: #ffd;
		color: #131a26;
		text-decoration: none;
	}

	mark {
		background: #ffd;
		color: #131a26;
	}

	q {
		font-style: italic;
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

	sup {
		top: -0.5em;
	}

	sub {
		bottom: -0.25em;
	}

	audio,
	canvas,
	iframe,
	img,
	svg,
	video {
		vertical-align: middle;
	}

	canvas,
	img,
	video {
		box-sizing: border-box;
		max-width: 100%;
		height: auto;
	}

	@supports (display: block) {
		svg {
			box-sizing: border-box;
			max-width: 100%;
			height: auto;
		}
	}

	svg:not(:root) {
		overflow: hidden;
	}

	img:not([src]) {
		visibility: hidden;
		min-width: 1px;
	}

	iframe {
		border: 0;
	}

	p,
	ul,
	ol,
	dl,
	pre,
	address,
	fieldset,
	figure {
		margin: 0 0 45px;
	}

	* + p,
	* + ul,
	* + ol,
	* + dl,
	* + pre,
	* + address,
	* + fieldset,
	* + figure {
		margin-top: 45px;
	}

	h1,
	.uk-h1,
	h2,
	.uk-h2,
	h3,
	.uk-h3,
	h4,
	.uk-h4,
	h5,
	.uk-h5,
	h6,
	.uk-h6,
	.uk-heading-small,
	.uk-heading-medium,
	.uk-heading-large,
	.uk-heading-xlarge,
	.uk-heading-2xlarge {
		margin: 0 0 45px;
		color: inherit;
		font-weight: bold;
		font-family: Roboto, Arial, sans-serif;
		text-transform: none;
	}

	* + h1,
	* + .uk-h1,
	* + h2,
	* + .uk-h2,
	* + h3,
	* + .uk-h3,
	* + h4,
	* + .uk-h4,
	* + h5,
	* + .uk-h5,
	* + h6,
	* + .uk-h6,
	* + .uk-heading-small,
	* + .uk-heading-medium,
	* + .uk-heading-large,
	* + .uk-heading-xlarge,
	* + .uk-heading-2xlarge {
		margin-top: 45px;
	}

	h1,
	.uk-h1 {
		font-size: 2.4565rem;
		line-height: 1.096;
	}

	h2,
	.uk-h2 {
		font-size: 1.7rem;
		line-height: 1.096;
	}

	h3,
	.uk-h3 {
		font-size: 1.67rem;
		line-height: 1.2;
	}

	h4,
	.uk-h4 {
		font-size: 1.33rem;
		line-height: 1.4;
	}

	h5,
	.uk-h5 {
		font-size: 18px;
		line-height: 1.4;
	}

	h6,
	.uk-h6 {
		font-size: 0.875rem;
		line-height: 1.4;
	}

	@media (width >=960px) {
		h1,
		.uk-h1 {
			font-size: 2.89rem;
		}

		h2,
		.uk-h2 {
			font-size: 2rem;
		}
	}

	ul,
	ol {
		padding-left: 30px;
	}

	ul > li > ul,
	ul > li > ol,
	ol > li > ol,
	ol > li > ul {
		margin: 0;
	}

	dt {
		font-weight: bold;
	}

	dd {
		margin-left: 0;
	}

	hr,
	.uk-hr {
		margin: 0 0 45px;
		border: 0;
		border-top: 1px solid #e5e5e5;
		overflow: visible;
		text-align: inherit;
	}

	* + hr,
	* + .uk-hr {
		margin-top: 45px;
	}

	address {
		font-style: normal;
	}

	blockquote {
		margin: 0 0 45px;
		font-style: italic;
		font-size: 1.33rem;
		line-height: 1.5;
	}

	* + blockquote {
		margin-top: 45px;
	}

	blockquote p:last-of-type {
		margin-bottom: 0;
	}

	blockquote footer {
		margin-top: 15px;
		font-size: 0.875rem;
		line-height: 1.5;
	}

	pre {
		overflow: auto;
		color: #131a26;
		font:
			0.875rem / 1.5 Consolas,
			monaco,
			monospace;
		-moz-tab-size: 4;
		tab-size: 4;
	}

	pre code {
		font-family: Consolas, monaco, monospace;
	}

	::selection {
		background: #39f;
		color: #fff;
		text-shadow: none;
	}

	details,
	main {
		display: block;
	}

	summary {
		display: list-item;
	}

	template {
		display: none;
	}

	.uk-breakpoint-s::before {
		content: '640px';
	}

	.uk-breakpoint-m::before {
		content: '960px';
	}

	.uk-breakpoint-l::before {
		content: '1200px';
	}

	.uk-breakpoint-xl::before {
		content: '1600px';
	}

	:root {
		--uk-breakpoint-s: 640px;
		--uk-breakpoint-m: 960px;
		--uk-breakpoint-l: 1200px;
		--uk-breakpoint-xl: 1600px;
	}

	a.uk-link-muted,
	.uk-link-muted a {
		color: #687790;
	}

	a.uk-link-muted:hover,
	.uk-link-muted a:hover,
	.uk-link-toggle:hover .uk-link-muted,
	.uk-link-toggle:focus .uk-link-muted {
		color: #131a26;
	}

	a.uk-link-text,
	.uk-link-text a {
		color: inherit;
	}

	a.uk-link-text:hover,
	.uk-link-text a:hover,
	.uk-link-toggle:hover .uk-link-text,
	.uk-link-toggle:focus .uk-link-text {
		color: #687790;
	}

	a.uk-link-heading,
	.uk-link-heading a {
		color: inherit;
	}

	a.uk-link-heading:hover,
	.uk-link-heading a:hover,
	.uk-link-toggle:hover .uk-link-heading,
	.uk-link-toggle:focus .uk-link-heading {
		color: #3bd671;
		text-decoration: none;
	}

	a.uk-link-reset,
	.uk-link-reset a {
		color: inherit !important;
		text-decoration: none !important;
	}

	.uk-link-toggle {
		color: inherit !important;
		text-decoration: none !important;
	}

	.uk-link-toggle:focus {
		outline: none;
	}

	.uk-heading-small {
		font-size: 2.6rem;
		line-height: 1.096;
	}

	.uk-heading-medium {
		font-size: 2.8875rem;
		line-height: 1.1;
	}

	.uk-heading-large {
		font-size: 3.4rem;
		line-height: 1.1;
	}

	.uk-heading-xlarge {
		font-size: 4rem;
		line-height: 1;
	}

	.uk-heading-2xlarge {
		font-size: 6rem;
		line-height: 1;
	}

	@media (width >=960px) {
		.uk-heading-small {
			font-size: 3.25rem;
		}

		.uk-heading-medium {
			font-size: 3.5rem;
		}

		.uk-heading-large {
			font-size: 4rem;
		}

		.uk-heading-xlarge {
			font-size: 6rem;
		}

		.uk-heading-2xlarge {
			font-size: 8rem;
		}
	}

	@media (width >=1200px) {
		.uk-heading-medium {
			font-size: 4rem;
		}

		.uk-heading-large {
			font-size: 6rem;
		}

		.uk-heading-xlarge {
			font-size: 8rem;
		}

		.uk-heading-2xlarge {
			font-size: 11rem;
		}
	}

	.uk-heading-divider {
		border-bottom: calc(0.2px + 0.05em) solid #e5e5e5;
		padding-bottom: calc(5px + 0.1em);
	}

	.uk-heading-bullet {
		position: relative;
	}

	.uk-heading-bullet::before {
		display: inline-block;
		position: relative;
		top: calc(-0.1 * 1em);
		vertical-align: middle;
		margin-right: calc(5px + 0.2em);
		border-left: calc(5px + 0.1em) solid #e5e5e5;
		height: calc(4px + 0.7em);
		content: '';
	}

	.uk-heading-line {
		overflow: hidden;
	}

	.uk-heading-line > * {
		display: inline-block;
		position: relative;
	}

	.uk-heading-line > ::before,
	.uk-heading-line > ::after {
		position: absolute;
		top: calc(50% - (calc(0.2px + 0.05em) / 2));
		border-bottom: calc(0.2px + 0.05em) solid #e5e5e5;
		width: 2000px;
		content: '';
	}

	.uk-heading-line > ::before {
		right: 100%;
		margin-right: calc(5px + 0.3em);
	}

	.uk-heading-line > ::after {
		left: 100%;
		margin-left: calc(5px + 0.3em);
	}

	.uk-button {
		display: inline-block;
		vertical-align: middle;
		-webkit-appearance: none;
		box-sizing: border-box;
		margin: 0;
		border: none;
		border-radius: 0;
		padding: 0 30px;
		overflow: visible;
		color: inherit;
		font: inherit;
		font-size: 18px;
		line-height: 46px;
		text-align: center;
		text-decoration: none;
		text-transform: none;
	}

	.uk-button:not(:disabled) {
		cursor: pointer;
	}

	.uk-button::-moz-focus-inner {
		border: 0;
		padding: 0;
	}

	.uk-button:hover {
		text-decoration: none;
	}

	.uk-button:focus {
		outline: none;
	}

	.uk-button-default {
		background-color: #687790;
		color: #fff;
	}

	.uk-button-default:hover,
	.uk-button-default:focus {
		background-color: #5d6b81;
		color: #fff;
	}

	.uk-button-default:active,
	.uk-button-default.uk-active {
		background-color: #535f72;
		color: inherit;
	}

	.uk-button-primary {
		background-color: #3bd671;
		color: #fff;
	}

	.uk-button-primary:hover,
	.uk-button-primary:focus {
		background-color: #2bcd63;
		color: #fff;
	}

	.uk-button-primary:active,
	.uk-button-primary.uk-active {
		background-color: #26b859;
		color: #fff;
	}

	.uk-button-secondary {
		background-color: #131a26;
		color: #fff;
	}

	.uk-button-secondary:hover,
	.uk-button-secondary:focus {
		background-color: #0b0e15;
		color: #fff;
	}

	.uk-button-secondary:active,
	.uk-button-secondary.uk-active {
		background-color: #020304;
		color: #fff;
	}

	.uk-button-danger {
		background-color: #df484a;
		color: #fff;
	}

	.uk-button-danger:hover,
	.uk-button-danger:focus {
		background-color: #db3235;
		color: #fff;
	}

	.uk-button-danger:active,
	.uk-button-danger.uk-active {
		background-color: #d02427;
		color: #fff;
	}

	.uk-button-default:disabled,
	.uk-button-primary:disabled,
	.uk-button-secondary:disabled,
	.uk-button-danger:disabled {
		background-color: #687790;
		color: #687790;
	}

	.uk-button-small {
		padding: 0 15px;
		font-size: 0.875rem;
		line-height: 36px;
	}

	.uk-button-large {
		padding: 0 45px;
		font-size: 18px;
		line-height: 56px;
	}

	.uk-button-text {
		background: none;
		padding: 0;
		color: #687790;
		line-height: 1.33;
	}

	.uk-button-text:hover,
	.uk-button-text:focus {
		color: #131a26;
	}

	.uk-button-text:disabled {
		color: #687790;
	}

	.uk-button-link {
		background: none;
		padding: 0;
		color: #3bd671;
		line-height: 1.33;
	}

	.uk-button-link:hover,
	.uk-button-link:focus {
		color: #26b859;
		text-decoration: underline;
	}

	.uk-button-link:disabled {
		color: #687790;
		text-decoration: none;
	}

	.uk-button-group {
		display: -ms-inline-flexbox;
		display: inline-flex;
		position: relative;
		vertical-align: middle;
	}

	.uk-section {
		display: flow-root;
		box-sizing: border-box;
		padding-top: 45px;
		padding-bottom: 45px;
	}

	@media (width >=960px) {
		.uk-section {
			padding-top: 70px;
			padding-bottom: 70px;
		}
	}

	.uk-section > :last-child {
		margin-bottom: 0;
	}

	.uk-section-xsmall {
		padding-top: 45px;
		padding-bottom: 45px;
	}

	.uk-section-small {
		padding-top: 45px;
		padding-bottom: 45px;
	}

	.uk-section-large {
		padding-top: 70px;
		padding-bottom: 70px;
	}

	@media (width >=960px) {
		.uk-section-large {
			padding-top: 160px;
			padding-bottom: 160px;
		}
	}

	.uk-section-xlarge {
		padding-top: 160px;
		padding-bottom: 160px;
	}

	@media (width >=960px) {
		.uk-section-xlarge {
			padding-top: 230px;
			padding-bottom: 230px;
		}
	}

	.uk-section-default {
		background: #fff;
	}

	.uk-section-muted {
		background: #687790;
	}

	.uk-section-primary {
		background: #3bd671;
	}

	.uk-section-secondary {
		background: #131a26;
	}

	.uk-container {
		display: flow-root;
		box-sizing: content-box;
		margin-right: auto;
		margin-left: auto;
		padding-right: 15px;
		padding-left: 15px;
		max-width: 1000px;
	}

	@media (width >=640px) {
		.uk-container {
			padding-right: 30px;
			padding-left: 30px;
		}
	}

	@media (width >=960px) {
		.uk-container {
			padding-right: 45px;
			padding-left: 45px;
		}
	}

	.uk-container > :last-child {
		margin-bottom: 0;
	}

	.uk-container .uk-container {
		padding-right: 0;
		padding-left: 0;
	}

	.uk-container-xsmall {
		max-width: 750px;
	}

	.uk-container-small {
		max-width: 900px;
	}

	.uk-container-large {
		max-width: 1200px;
	}

	.uk-container-xlarge {
		max-width: 1200px;
	}

	.uk-container-expand {
		max-width: none;
	}

	.uk-container-expand-left {
		margin-left: 0;
	}

	.uk-container-expand-right {
		margin-right: 0;
	}

	@media (width >=640px) {
		.uk-container-expand-left.uk-container-xsmall,
		.uk-container-expand-right.uk-container-xsmall {
			max-width: calc(50% + (750px / 2) - 30px);
		}

		.uk-container-expand-left.uk-container-small,
		.uk-container-expand-right.uk-container-small {
			max-width: calc(50% + (900px / 2) - 30px);
		}
	}

	@media (width >=960px) {
		.uk-container-expand-left,
		.uk-container-expand-right {
			max-width: calc(50% + (1000px / 2) - 45px);
		}

		.uk-container-expand-left.uk-container-xsmall,
		.uk-container-expand-right.uk-container-xsmall {
			max-width: calc(50% + (750px / 2) - 45px);
		}

		.uk-container-expand-left.uk-container-small,
		.uk-container-expand-right.uk-container-small {
			max-width: calc(50% + (900px / 2) - 45px);
		}

		.uk-container-expand-left.uk-container-large,
		.uk-container-expand-right.uk-container-large {
			max-width: calc(50% + (1200px / 2) - 45px);
		}

		.uk-container-expand-left.uk-container-xlarge,
		.uk-container-expand-right.uk-container-xlarge {
			max-width: calc(50% + (1200px / 2) - 45px);
		}
	}

	.uk-container-item-padding-remove-left,
	.uk-container-item-padding-remove-right {
		width: calc(100% + 15px);
	}

	.uk-container-item-padding-remove-left {
		margin-left: -15px;
	}

	.uk-container-item-padding-remove-right {
		margin-right: -15px;
	}

	@media (width >=640px) {
		.uk-container-item-padding-remove-left,
		.uk-container-item-padding-remove-right {
			width: calc(100% + 30px);
		}

		.uk-container-item-padding-remove-left {
			margin-left: -30px;
		}

		.uk-container-item-padding-remove-right {
			margin-right: -30px;
		}
	}

	@media (width >=960px) {
		.uk-container-item-padding-remove-left,
		.uk-container-item-padding-remove-right {
			width: calc(100% + 45px);
		}

		.uk-container-item-padding-remove-left {
			margin-left: -45px;
		}

		.uk-container-item-padding-remove-right {
			margin-right: -45px;
		}
	}

	.uk-grid {
		display: flexbox;
		display: flex;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.uk-grid > * {
		margin: 0;
	}

	.uk-grid > * > :last-child {
		margin-bottom: 0;
	}

	.uk-grid {
		margin-left: -30px;
	}

	.uk-grid > * {
		padding-left: 30px;
	}

	.uk-grid + .uk-grid,
	.uk-grid > .uk-grid-margin,
	* + .uk-grid-margin {
		margin-top: 30px;
	}

	@media (width >=1200px) {
		.uk-grid {
			margin-left: -45px;
		}

		.uk-grid > * {
			padding-left: 45px;
		}

		.uk-grid + .uk-grid,
		.uk-grid > .uk-grid-margin,
		* + .uk-grid-margin {
			margin-top: 45px;
		}
	}

	.uk-grid-small,
	.uk-grid-column-small {
		margin-left: -15px;
	}

	.uk-grid-small > *,
	.uk-grid-column-small > * {
		padding-left: 15px;
	}

	.uk-grid + .uk-grid-small,
	.uk-grid + .uk-grid-row-small,
	.uk-grid-small > .uk-grid-margin,
	.uk-grid-row-small > .uk-grid-margin,
	* + .uk-grid-margin-small {
		margin-top: 15px;
	}

	.uk-grid-medium,
	.uk-grid-column-medium {
		margin-left: -30px;
	}

	.uk-grid-medium > *,
	.uk-grid-column-medium > * {
		padding-left: 30px;
	}

	.uk-grid + .uk-grid-medium,
	.uk-grid + .uk-grid-row-medium,
	.uk-grid-medium > .uk-grid-margin,
	.uk-grid-row-medium > .uk-grid-margin,
	* + .uk-grid-margin-medium {
		margin-top: 30px;
	}

	.uk-grid-large,
	.uk-grid-column-large {
		margin-left: -45px;
	}

	.uk-grid-large > *,
	.uk-grid-column-large > * {
		padding-left: 45px;
	}

	.uk-grid + .uk-grid-large,
	.uk-grid + .uk-grid-row-large,
	.uk-grid-large > .uk-grid-margin,
	.uk-grid-row-large > .uk-grid-margin,
	* + .uk-grid-margin-large {
		margin-top: 45px;
	}

	@media (width >=1200px) {
		.uk-grid-large,
		.uk-grid-column-large {
			margin-left: -60px;
		}

		.uk-grid-large > *,
		.uk-grid-column-large > * {
			padding-left: 60px;
		}

		.uk-grid + .uk-grid-large,
		.uk-grid + .uk-grid-row-large,
		.uk-grid-large > .uk-grid-margin,
		.uk-grid-row-large > .uk-grid-margin,
		* + .uk-grid-margin-large {
			margin-top: 60px;
		}
	}

	.uk-grid-collapse,
	.uk-grid-column-collapse {
		margin-left: 0;
	}

	.uk-grid-collapse > *,
	.uk-grid-column-collapse > * {
		padding-left: 0;
	}

	.uk-grid + .uk-grid-collapse,
	.uk-grid + .uk-grid-row-collapse,
	.uk-grid-collapse > .uk-grid-margin,
	.uk-grid-row-collapse > .uk-grid-margin {
		margin-top: 0;
	}

	.uk-grid-divider > * {
		position: relative;
	}

	.uk-grid-divider > :not(.uk-first-column)::before {
		position: absolute;
		top: 0;
		bottom: 0;
		border-left: 1px solid #e5e5e5;
		content: '';
	}

	.uk-grid-divider.uk-grid-stack > .uk-grid-margin::before {
		position: absolute;
		right: 0;
		left: 0;
		border-top: 1px solid #e5e5e5;
		content: '';
	}

	.uk-grid-divider {
		margin-left: -60px;
	}

	.uk-grid-divider > * {
		padding-left: 60px;
	}

	.uk-grid-divider > :not(.uk-first-column)::before {
		left: 30px;
	}

	.uk-grid-divider.uk-grid-stack > .uk-grid-margin {
		margin-top: 60px;
	}

	.uk-grid-divider.uk-grid-stack > .uk-grid-margin::before {
		top: -30px;
		left: 60px;
	}

	@media (width >=1200px) {
		.uk-grid-divider {
			margin-left: -90px;
		}

		.uk-grid-divider > * {
			padding-left: 90px;
		}

		.uk-grid-divider > :not(.uk-first-column)::before {
			left: 45px;
		}

		.uk-grid-divider.uk-grid-stack > .uk-grid-margin {
			margin-top: 90px;
		}

		.uk-grid-divider.uk-grid-stack
			> .uk-grid-margin::before {
			top: -45px;
			left: 90px;
		}
	}

	.uk-grid-divider.uk-grid-small,
	.uk-grid-divider.uk-grid-column-small {
		margin-left: -30px;
	}

	.uk-grid-divider.uk-grid-small > *,
	.uk-grid-divider.uk-grid-column-small > * {
		padding-left: 30px;
	}

	.uk-grid-divider.uk-grid-small
		> :not(.uk-first-column)::before,
	.uk-grid-divider.uk-grid-column-small
		> :not(.uk-first-column)::before {
		left: 15px;
	}

	.uk-grid-divider.uk-grid-small.uk-grid-stack
		> .uk-grid-margin,
	.uk-grid-divider.uk-grid-row-small.uk-grid-stack
		> .uk-grid-margin {
		margin-top: 30px;
	}

	.uk-grid-divider.uk-grid-small.uk-grid-stack
		> .uk-grid-margin::before {
		top: -15px;
		left: 30px;
	}

	.uk-grid-divider.uk-grid-row-small.uk-grid-stack
		> .uk-grid-margin::before {
		top: -15px;
	}

	.uk-grid-divider.uk-grid-column-small.uk-grid-stack
		> .uk-grid-margin::before {
		left: 30px;
	}

	.uk-grid-divider.uk-grid-medium,
	.uk-grid-divider.uk-grid-column-medium {
		margin-left: -60px;
	}

	.uk-grid-divider.uk-grid-medium > *,
	.uk-grid-divider.uk-grid-column-medium > * {
		padding-left: 60px;
	}

	.uk-grid-divider.uk-grid-medium
		> :not(.uk-first-column)::before,
	.uk-grid-divider.uk-grid-column-medium
		> :not(.uk-first-column)::before {
		left: 30px;
	}

	.uk-grid-divider.uk-grid-medium.uk-grid-stack
		> .uk-grid-margin,
	.uk-grid-divider.uk-grid-row-medium.uk-grid-stack
		> .uk-grid-margin {
		margin-top: 60px;
	}

	.uk-grid-divider.uk-grid-medium.uk-grid-stack
		> .uk-grid-margin::before {
		top: -30px;
		left: 60px;
	}

	.uk-grid-divider.uk-grid-row-medium.uk-grid-stack
		> .uk-grid-margin::before {
		top: -30px;
	}

	.uk-grid-divider.uk-grid-column-medium.uk-grid-stack
		> .uk-grid-margin::before {
		left: 60px;
	}

	.uk-grid-divider.uk-grid-large,
	.uk-grid-divider.uk-grid-column-large {
		margin-left: -90px;
	}

	.uk-grid-divider.uk-grid-large > *,
	.uk-grid-divider.uk-grid-column-large > * {
		padding-left: 90px;
	}

	.uk-grid-divider.uk-grid-large
		> :not(.uk-first-column)::before,
	.uk-grid-divider.uk-grid-column-large
		> :not(.uk-first-column)::before {
		left: 45px;
	}

	.uk-grid-divider.uk-grid-large.uk-grid-stack
		> .uk-grid-margin,
	.uk-grid-divider.uk-grid-row-large.uk-grid-stack
		> .uk-grid-margin {
		margin-top: 90px;
	}

	.uk-grid-divider.uk-grid-large.uk-grid-stack
		> .uk-grid-margin::before {
		top: -45px;
		left: 90px;
	}

	.uk-grid-divider.uk-grid-row-large.uk-grid-stack
		> .uk-grid-margin::before {
		top: -45px;
	}

	.uk-grid-divider.uk-grid-column-large.uk-grid-stack
		> .uk-grid-margin::before {
		left: 90px;
	}

	@media (width >=1200px) {
		.uk-grid-divider.uk-grid-large,
		.uk-grid-divider.uk-grid-column-large {
			margin-left: -120px;
		}

		.uk-grid-divider.uk-grid-large > *,
		.uk-grid-divider.uk-grid-column-large > * {
			padding-left: 120px;
		}

		.uk-grid-divider.uk-grid-large
			> :not(.uk-first-column)::before,
		.uk-grid-divider.uk-grid-column-large
			> :not(.uk-first-column)::before {
			left: 60px;
		}

		.uk-grid-divider.uk-grid-large.uk-grid-stack
			> .uk-grid-margin,
		.uk-grid-divider.uk-grid-row-large.uk-grid-stack
			> .uk-grid-margin {
			margin-top: 120px;
		}

		.uk-grid-divider.uk-grid-large.uk-grid-stack
			> .uk-grid-margin::before {
			top: -60px;
			left: 120px;
		}

		.uk-grid-divider.uk-grid-row-large.uk-grid-stack
			> .uk-grid-margin::before {
			top: -60px;
		}

		.uk-grid-divider.uk-grid-column-large.uk-grid-stack
			> .uk-grid-margin::before {
			left: 120px;
		}
	}

	.uk-grid-match > *,
	.uk-grid-item-match {
		display: flexbox;
		display: flex;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}

	.uk-grid-match > * > :not([class*='uk-width']),
	.uk-grid-item-match > :not([class*='uk-width']) {
		-ms-flex: auto;
		flex: auto;
		box-sizing: border-box;
		width: 100%;
	}

	.uk-close {
		color: #687790;
	}

	.uk-close:hover,
	.uk-close:focus {
		outline: none;
		color: #131a26;
	}

	.uk-alert {
		position: relative;
		margin-bottom: 45px;
		background: #687790;
		padding: 15px 29px 15px 15px;
		color: #131a26;
	}

	* + .uk-alert {
		margin-top: 45px;
	}

	.uk-alert > :last-child {
		margin-bottom: 0;
	}

	.uk-alert-close {
		position: absolute;
		top: 20px;
		right: 15px;
	}

	.uk-alert-close:first-child + * {
		margin-top: 0;
	}

	.uk-alert-primary {
		background: rgb(3 153 215 / 5%);
		color: #131a26;
	}

	.uk-alert-success {
		background: rgb(50 210 150 / 7%);
		color: #32d296;
	}

	.uk-alert-warning {
		background: rgb(242 144 48 / 5%);
		color: #f29030;
	}

	.uk-alert-danger {
		background: rgb(223 72 74 / 5%);
		color: #df484a;
	}

	.uk-label {
		display: inline-block;
		vertical-align: middle;
		background: #e6e7e8;
		padding: 3px 10px;
		color: #687790;
		font-size: 14px;
		line-height: 1.33;
		white-space: nowrap;
	}

	.uk-label-success {
		background-color: #32d296;
		color: #fff;
	}

	.uk-label-warning {
		background-color: #f29030;
		color: #fff;
	}

	.uk-label-danger {
		background-color: #df484a;
		color: #fff;
	}

	.uk-pagination {
		display: flexbox;
		display: flex;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		margin-left: -20px;
		padding: 0;
		list-style: none;
	}

	.uk-pagination > * {
		position: relative;
		-ms-flex: none;
		flex: none;
		padding-left: 20px;
	}

	.uk-pagination > * > * {
		display: block;
		color: #687790;
	}

	.uk-pagination > * > :hover,
	.uk-pagination > * > :focus {
		color: #131a26;
		text-decoration: none;
	}

	.uk-pagination > .uk-active > * {
		color: #131a26;
	}

	.uk-pagination > .uk-disabled > * {
		color: #687790;
	}

	.uk-dropdown {
		display: none;
		position: absolute;
		z-index: 1020;
		box-sizing: border-box;
		background: #fff;
		padding: 15px;
		min-width: 200px;
		color: #131a26;
	}

	.uk-dropdown.uk-open {
		display: block;
	}

	.uk-dropdown-nav {
		white-space: nowrap;
	}

	.uk-dropdown-nav > li > a {
		color: #687790;
	}

	.uk-dropdown-nav > li > a:hover,
	.uk-dropdown-nav > li > a:focus,
	.uk-dropdown-nav > li.uk-active > a {
		color: #131a26;
	}

	.uk-dropdown-nav .uk-nav-header {
		color: inherit;
	}

	.uk-dropdown-nav .uk-nav-divider {
		border-top: 1px solid #e5e5e5;
	}

	.uk-dropdown-nav .uk-nav-sub a {
		color: #687790;
	}

	.uk-dropdown-nav .uk-nav-sub a:hover,
	.uk-dropdown-nav .uk-nav-sub a:focus,
	.uk-dropdown-nav .uk-nav-sub li.uk-active > a {
		color: #131a26;
	}

	[class*='uk-dropdown-top'] {
		margin-top: -15px;
	}

	[class*='uk-dropdown-bottom'] {
		margin-top: 15px;
	}

	[class*='uk-dropdown-left'] {
		margin-left: -15px;
	}

	[class*='uk-dropdown-right'] {
		margin-left: 15px;
	}

	.uk-dropdown-stack .uk-dropdown-grid > * {
		width: 100% !important;
	}

	.uk-modal {
		display: none;
		position: fixed;
		z-index: 1010;
		inset: 0;
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
		opacity: 0%;
		transition: opacity 0.15s linear;
		background: rgb(0 0 0 / 60%);
		padding: 15px;
	}

	@media (width >=640px) {
		.uk-modal {
			padding: 50px 30px;
		}
	}

	@media (width >=960px) {
		.uk-modal {
			padding-right: 45px;
			padding-left: 45px;
		}
	}

	.uk-modal.uk-open {
		opacity: 100%;
	}

	.uk-modal-page {
		overflow: hidden;
	}

	.uk-modal-dialog {
		position: relative;
		-ms-transform: translateY(-100px);
		transform: translateY(-100px);
		opacity: 0%;
		transition: 0.3s linear;
		transition-property: opacity, transform;
		box-sizing: border-box;
		margin: 0 auto;
		background: #fff;
		width: 600px;
		max-width: calc(100% - 0.01px) !important;
	}

	.uk-open > .uk-modal-dialog {
		-ms-transform: translateY(0);
		transform: translateY(0);
		opacity: 100%;
	}

	.uk-modal-container .uk-modal-dialog {
		width: 1200px;
	}

	.uk-modal-full {
		background: none;
		padding: 0;
	}

	.uk-modal-full .uk-modal-dialog {
		-ms-transform: translateY(0);
		transform: translateY(0);
		margin: 0;
		width: 100%;
		max-width: 100%;
	}

	.uk-modal-body {
		display: flow-root;
		padding: 30px;
	}

	.uk-modal-header {
		display: flow-root;
		background: #687790;
		padding: 15px 30px;
	}

	.uk-modal-footer {
		display: flow-root;
		background: #687790;
		padding: 15px 30px;
	}

	.uk-modal-body > :last-child,
	.uk-modal-header > :last-child,
	.uk-modal-footer > :last-child {
		margin-bottom: 0;
	}

	.uk-modal-title {
		font-size: 2rem;
		line-height: 1.3;
	}

	[class*='uk-modal-close-'] {
		position: absolute;
		top: 15px;
		right: 15px;
		z-index: 1010;
		padding: 5px;
	}

	[class*='uk-modal-close-']:first-child + * {
		margin-top: 0;
	}

	.uk-modal-close-outside {
		top: 0;
		right: -5px;
		-ms-transform: translate(0, -100%);
		transform: translate(0, -100%);
		color: #fff;
	}

	.uk-modal-close-outside:hover {
		color: #fff;
	}

	@media (width >=960px) {
		.uk-modal-close-outside {
			right: 0;
			-ms-transform: translate(100%, -100%);
			transform: translate(100%, -100%);
		}
	}

	.uk-switcher {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	.uk-switcher > :not(.uk-active) {
		display: none;
	}

	.uk-switcher > * > :last-child {
		margin-bottom: 0;
	}

	.uk-tooltip {
		display: none;
		position: absolute;
		top: 0;
		z-index: 1030;
		box-sizing: border-box;
		border-radius: 4px;
		background: #131a26;
		padding: 10px 15px;
		max-width: 300px;
		color: #fff;
		font-size: 16px;
	}

	.uk-tooltip.uk-active {
		display: block;
	}

	[class*='uk-tooltip-top'] {
		margin-top: -15px;
	}

	[class*='uk-tooltip-bottom'] {
		margin-top: 15px;
	}

	[class*='uk-tooltip-left'] {
		margin-left: -15px;
	}

	[class*='uk-tooltip-right'] {
		margin-left: 15px;
	}

	[class*='uk-animation-'] {
		animation-duration: 0.5s;
		animation-timing-function: ease-out;
		animation-fill-mode: both;
	}

	.uk-animation-fade {
		animation-duration: 0.8s;
		animation-timing-function: linear;
		animation-name: uk-fade;
	}

	.uk-animation-scale-up {
		animation-name: uk-fade-scale-02;
	}

	.uk-animation-scale-down {
		animation-name: uk-fade-scale-18;
	}

	.uk-animation-slide-top {
		animation-name: uk-fade-top;
	}

	.uk-animation-slide-bottom {
		animation-name: uk-fade-bottom;
	}

	.uk-animation-slide-left {
		animation-name: uk-fade-left;
	}

	.uk-animation-slide-right {
		animation-name: uk-fade-right;
	}

	.uk-animation-slide-top-small {
		animation-name: uk-fade-top-small;
	}

	.uk-animation-slide-bottom-small {
		animation-name: uk-fade-bottom-small;
	}

	.uk-animation-slide-left-small {
		animation-name: uk-fade-left-small;
	}

	.uk-animation-slide-right-small {
		animation-name: uk-fade-right-small;
	}

	.uk-animation-slide-top-medium {
		animation-name: uk-fade-top-medium;
	}

	.uk-animation-slide-bottom-medium {
		animation-name: uk-fade-bottom-medium;
	}

	.uk-animation-slide-left-medium {
		animation-name: uk-fade-left-medium;
	}

	.uk-animation-slide-right-medium {
		animation-name: uk-fade-right-medium;
	}

	.uk-animation-kenburns {
		animation-duration: 15s;
		animation-name: uk-scale-kenburns;
	}

	.uk-animation-shake {
		animation-name: uk-shake;
	}

	.uk-animation-stroke {
		animation-name: uk-stroke;
		stroke-dasharray: var(--uk-animation-stroke);
		animation-duration: 2s;
	}

	.uk-animation-reverse {
		animation-timing-function: ease-in;
		animation-direction: reverse;
	}

	.uk-animation-fast {
		animation-duration: 0.1s;
	}

	.uk-animation-toggle:not(:hover, :focus)
		[class*='uk-animation-'] {
		animation-name: none;
	}

	.uk-animation-toggle {
		-webkit-tap-highlight-color: transparent;
	}

	.uk-animation-toggle:focus {
		outline: none;
	}

	@keyframes uk-fade {
		0% {
			opacity: 0%;
		}

		100% {
			opacity: 100%;
		}
	}

	@keyframes uk-fade-top {
		0% {
			transform: translateY(-100%);
			opacity: 0%;
		}

		100% {
			transform: translateY(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-bottom {
		0% {
			transform: translateY(100%);
			opacity: 0%;
		}

		100% {
			transform: translateY(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-left {
		0% {
			transform: translateX(-100%);
			opacity: 0%;
		}

		100% {
			transform: translateX(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-right {
		0% {
			transform: translateX(100%);
			opacity: 0%;
		}

		100% {
			transform: translateX(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-top-small {
		0% {
			transform: translateY(-10px);
			opacity: 0%;
		}

		100% {
			transform: translateY(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-bottom-small {
		0% {
			transform: translateY(10px);
			opacity: 0%;
		}

		100% {
			transform: translateY(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-left-small {
		0% {
			transform: translateX(-10px);
			opacity: 0%;
		}

		100% {
			transform: translateX(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-right-small {
		0% {
			transform: translateX(10px);
			opacity: 0%;
		}

		100% {
			transform: translateX(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-top-medium {
		0% {
			transform: translateY(-50px);
			opacity: 0%;
		}

		100% {
			transform: translateY(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-bottom-medium {
		0% {
			transform: translateY(50px);
			opacity: 0%;
		}

		100% {
			transform: translateY(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-left-medium {
		0% {
			transform: translateX(-50px);
			opacity: 0%;
		}

		100% {
			transform: translateX(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-right-medium {
		0% {
			transform: translateX(50px);
			opacity: 0%;
		}

		100% {
			transform: translateX(0);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-scale-02 {
		0% {
			transform: scale(0.2);
			opacity: 0%;
		}

		100% {
			transform: scale(1);
			opacity: 100%;
		}
	}

	@keyframes uk-fade-scale-18 {
		0% {
			transform: scale(1.8);
			opacity: 0%;
		}

		100% {
			transform: scale(1);
			opacity: 100%;
		}
	}

	@keyframes uk-scale-kenburns {
		0% {
			transform: scale(1);
		}

		100% {
			transform: scale(1.2);
		}
	}

	@keyframes uk-shake {
		0%,
		100% {
			transform: translateX(0);
		}

		10% {
			transform: translateX(-9px);
		}

		20% {
			transform: translateX(8px);
		}

		30% {
			transform: translateX(-7px);
		}

		40% {
			transform: translateX(6px);
		}

		50% {
			transform: translateX(-5px);
		}

		60% {
			transform: translateX(4px);
		}

		70% {
			transform: translateX(-3px);
		}

		80% {
			transform: translateX(2px);
		}

		90% {
			transform: translateX(-1px);
		}
	}

	@keyframes uk-stroke {
		0% {
			stroke-dashoffset: var(--uk-animation-stroke);
		}

		100% {
			stroke-dashoffset: 0;
		}
	}

	[class*='uk-child-width'] > * {
		box-sizing: border-box;
		width: 100%;
	}

	.uk-child-width-1-2 > * {
		width: 50%;
	}

	.uk-child-width-1-3 > * {
		width: calc(100% * 1 / 3.001);
	}

	.uk-child-width-1-4 > * {
		width: 25%;
	}

	.uk-child-width-1-5 > * {
		width: 20%;
	}

	.uk-child-width-1-6 > * {
		width: calc(100% * 1 / 6.001);
	}

	.uk-child-width-auto > * {
		width: auto;
	}

	.uk-child-width-expand > :not([class*='uk-width']) {
		-ms-flex: 1;
		flex: 1;
		min-width: 1px;
	}

	@media (width >=640px) {
		.uk-child-width-1-1\\@s > * {
			width: 100%;
		}

		.uk-child-width-1-2\\@s > * {
			width: 50%;
		}

		.uk-child-width-1-3\\@s > * {
			width: calc(100% * 1 / 3.001);
		}

		.uk-child-width-1-4\\@s > * {
			width: 25%;
		}

		.uk-child-width-1-5\\@s > * {
			width: 20%;
		}

		.uk-child-width-1-6\\@s > * {
			width: calc(100% * 1 / 6.001);
		}

		.uk-child-width-auto\\@s > * {
			width: auto;
		}

		.uk-child-width-expand\\@s>: not([class *='uk-width']) {
			-ms-flex: 1;
			flex: 1;
			min-width: 1px;
		}
	}

	@media (width >=960px) {
		.uk-child-width-1-1\\@m > * {
			width: 100%;
		}

		.uk-child-width-1-2\\@m > * {
			width: 50%;
		}

		.uk-child-width-1-3\\@m > * {
			width: calc(100% * 1 / 3.001);
		}

		.uk-child-width-1-4\\@m > * {
			width: 25%;
		}

		.uk-child-width-1-5\\@m > * {
			width: 20%;
		}

		.uk-child-width-1-6\\@m > * {
			width: calc(100% * 1 / 6.001);
		}

		.uk-child-width-auto\\@m > * {
			width: auto;
		}

		.uk-child-width-expand\\@m>: not([class *='uk-width']) {
			-ms-flex: 1;
			flex: 1;
			min-width: 1px;
		}
	}

	@media (width >=1200px) {
		.uk-child-width-1-1\\@l > * {
			width: 100%;
		}

		.uk-child-width-1-2\\@l > * {
			width: 50%;
		}

		.uk-child-width-1-3\\@l > * {
			width: calc(100% * 1 / 3.001);
		}

		.uk-child-width-1-4\\@l > * {
			width: 25%;
		}

		.uk-child-width-1-5\\@l > * {
			width: 20%;
		}

		.uk-child-width-1-6\\@l > * {
			width: calc(100% * 1 / 6.001);
		}

		.uk-child-width-auto\\@l > * {
			width: auto;
		}

		.uk-child-width-expand\\@l>: not([class *='uk-width']) {
			-ms-flex: 1;
			flex: 1;
			min-width: 1px;
		}
	}

	@media (width >=1600px) {
		.uk-child-width-1-1\\@xl > * {
			width: 100%;
		}

		.uk-child-width-1-2\\@xl > * {
			width: 50%;
		}

		.uk-child-width-1-3\\@xl > * {
			width: calc(100% * 1 / 3.001);
		}

		.uk-child-width-1-4\\@xl > * {
			width: 25%;
		}

		.uk-child-width-1-5\\@xl > * {
			width: 20%;
		}

		.uk-child-width-1-6\\@xl > * {
			width: calc(100% * 1 / 6.001);
		}

		.uk-child-width-auto\\@xl > * {
			width: auto;
		}

		.uk-child-width-expand\\@xl>: not([class *='uk-width']) {
			-ms-flex: 1;
			flex: 1;
			min-width: 1px;
		}
	}

	[class*='uk-width'] {
		box-sizing: border-box;
		width: 100%;
		max-width: 100%;
	}

	.uk-width-1-2 {
		width: 50%;
	}

	.uk-width-1-3 {
		width: calc(100% * 1 / 3.001);
	}

	.uk-width-2-3 {
		width: calc(100% * 2 / 3.001);
	}

	.uk-width-1-4 {
		width: 25%;
	}

	.uk-width-3-4 {
		width: 75%;
	}

	.uk-width-1-5 {
		width: 20%;
	}

	.uk-width-2-5 {
		width: 40%;
	}

	.uk-width-3-5 {
		width: 60%;
	}

	.uk-width-4-5 {
		width: 80%;
	}

	.uk-width-1-6 {
		width: calc(100% * 1 / 6.001);
	}

	.uk-width-5-6 {
		width: calc(100% * 5 / 6.001);
	}

	.uk-width-small {
		width: 150px;
	}

	.uk-width-medium {
		width: 300px;
	}

	.uk-width-large {
		width: 450px;
	}

	.uk-width-xlarge {
		width: 600px;
	}

	.uk-width-2xlarge {
		width: 750px;
	}

	.uk-width-auto {
		width: auto;
	}

	.uk-width-expand {
		-ms-flex: 1;
		flex: 1;
		min-width: 1px;
	}

	@media (width >=640px) {
		.uk-width-1-1\\@s {
			width: 100%;
		}

		.uk-width-1-2\\@s {
			width: 50%;
		}

		.uk-width-1-3\\@s {
			width: calc(100% * 1 / 3.001);
		}

		.uk-width-2-3\\@s {
			width: calc(100% * 2 / 3.001);
		}

		.uk-width-1-4\\@s {
			width: 25%;
		}

		.uk-width-3-4\\@s {
			width: 75%;
		}

		.uk-width-1-5\\@s {
			width: 20%;
		}

		.uk-width-2-5\\@s {
			width: 40%;
		}

		.uk-width-3-5\\@s {
			width: 60%;
		}

		.uk-width-4-5\\@s {
			width: 80%;
		}

		.uk-width-1-6\\@s {
			width: calc(100% * 1 / 6.001);
		}

		.uk-width-5-6\\@s {
			width: calc(100% * 5 / 6.001);
		}

		.uk-width-small\\@s {
			width: 150px;
		}

		.uk-width-medium\\@s {
			width: 300px;
		}

		.uk-width-large\\@s {
			width: 450px;
		}

		.uk-width-xlarge\\@s {
			width: 600px;
		}

		.uk-width-2xlarge\\@s {
			width: 750px;
		}

		.uk-width-auto\\@s {
			width: auto;
		}

		.uk-width-expand\\@s {
			-ms-flex: 1;
			flex: 1;
			min-width: 1px;
		}
	}

	@media (width >=960px) {
		.uk-width-1-1\\@m {
			width: 100%;
		}

		.uk-width-1-2\\@m {
			width: 50%;
		}

		.uk-width-1-3\\@m {
			width: calc(100% * 1 / 3.001);
		}

		.uk-width-2-3\\@m {
			width: calc(100% * 2 / 3.001);
		}

		.uk-width-1-4\\@m {
			width: 25%;
		}

		.uk-width-3-4\\@m {
			width: 75%;
		}

		.uk-width-1-5\\@m {
			width: 20%;
		}

		.uk-width-2-5\\@m {
			width: 40%;
		}

		.uk-width-3-5\\@m {
			width: 60%;
		}

		.uk-width-4-5\\@m {
			width: 80%;
		}

		.uk-width-1-6\\@m {
			width: calc(100% * 1 / 6.001);
		}

		.uk-width-5-6\\@m {
			width: calc(100% * 5 / 6.001);
		}

		.uk-width-small\\@m {
			width: 150px;
		}

		.uk-width-medium\\@m {
			width: 300px;
		}

		.uk-width-large\\@m {
			width: 450px;
		}

		.uk-width-xlarge\\@m {
			width: 600px;
		}

		.uk-width-2xlarge\\@m {
			width: 750px;
		}

		.uk-width-auto\\@m {
			width: auto;
		}

		.uk-width-expand\\@m {
			-ms-flex: 1;
			flex: 1;
			min-width: 1px;
		}
	}

	@media (width >=1200px) {
		.uk-width-1-1\\@l {
			width: 100%;
		}

		.uk-width-1-2\\@l {
			width: 50%;
		}

		.uk-width-1-3\\@l {
			width: calc(100% * 1 / 3.001);
		}

		.uk-width-2-3\\@l {
			width: calc(100% * 2 / 3.001);
		}

		.uk-width-1-4\\@l {
			width: 25%;
		}

		.uk-width-3-4\\@l {
			width: 75%;
		}

		.uk-width-1-5\\@l {
			width: 20%;
		}

		.uk-width-2-5\\@l {
			width: 40%;
		}

		.uk-width-3-5\\@l {
			width: 60%;
		}

		.uk-width-4-5\\@l {
			width: 80%;
		}

		.uk-width-1-6\\@l {
			width: calc(100% * 1 / 6.001);
		}

		.uk-width-5-6\\@l {
			width: calc(100% * 5 / 6.001);
		}

		.uk-width-small\\@l {
			width: 150px;
		}

		.uk-width-medium\\@l {
			width: 300px;
		}

		.uk-width-large\\@l {
			width: 450px;
		}

		.uk-width-xlarge\\@l {
			width: 600px;
		}

		.uk-width-2xlarge\\@l {
			width: 750px;
		}

		.uk-width-auto\\@l {
			width: auto;
		}

		.uk-width-expand\\@l {
			-ms-flex: 1;
			flex: 1;
			min-width: 1px;
		}
	}

	@media (width >=1600px) {
		.uk-width-1-1\\@xl {
			width: 100%;
		}

		.uk-width-1-2\\@xl {
			width: 50%;
		}

		.uk-width-1-3\\@xl {
			width: calc(100% * 1 / 3.001);
		}

		.uk-width-2-3\\@xl {
			width: calc(100% * 2 / 3.001);
		}

		.uk-width-1-4\\@xl {
			width: 25%;
		}

		.uk-width-3-4\\@xl {
			width: 75%;
		}

		.uk-width-1-5\\@xl {
			width: 20%;
		}

		.uk-width-2-5\\@xl {
			width: 40%;
		}

		.uk-width-3-5\\@xl {
			width: 60%;
		}

		.uk-width-4-5\\@xl {
			width: 80%;
		}

		.uk-width-1-6\\@xl {
			width: calc(100% * 1 / 6.001);
		}

		.uk-width-5-6\\@xl {
			width: calc(100% * 5 / 6.001);
		}

		.uk-width-small\\@xl {
			width: 150px;
		}

		.uk-width-medium\\@xl {
			width: 300px;
		}

		.uk-width-large\\@xl {
			width: 450px;
		}

		.uk-width-xlarge\\@xl {
			width: 600px;
		}

		.uk-width-2xlarge\\@xl {
			width: 750px;
		}

		.uk-width-auto\\@xl {
			width: auto;
		}

		.uk-width-expand\\@xl {
			-ms-flex: 1;
			flex: 1;
			min-width: 1px;
		}
	}

	[class*='uk-height'] {
		box-sizing: border-box;
	}

	.uk-height-1-1 {
		height: 100%;
	}

	.uk-height-viewport {
		min-height: 100vh;
	}

	.uk-height-small {
		height: 150px;
	}

	.uk-height-medium {
		height: 300px;
	}

	.uk-height-large {
		height: 450px;
	}

	.uk-height-max-small {
		max-height: 150px;
	}

	.uk-height-max-medium {
		max-height: 300px;
	}

	.uk-height-max-large {
		max-height: 450px;
	}

	.uk-text-lead {
		color: inherit;
		font-size: 1.67rem;
		line-height: 1.5;
	}

	.uk-text-meta {
		color: #687790;
		font-size: 0.875rem;
		line-height: 1.4;
	}

	.uk-text-small {
		font-size: 0.875rem;
		line-height: 1.5;
	}

	.uk-text-large {
		font-size: 1.67rem;
		line-height: 1.5;
	}

	.uk-text-default {
		font-size: 18px;
		line-height: 1.33;
	}

	.uk-text-light {
		font-weight: 300;
	}

	.uk-text-normal {
		font-weight: 400;
	}

	.uk-text-bold {
		font-weight: 700;
	}

	.uk-text-lighter {
		font-weight: lighter;
	}

	.uk-text-bolder {
		font-weight: bolder;
	}

	.uk-text-italic {
		font-style: italic;
	}

	.uk-text-capitalize {
		text-transform: capitalize !important;
	}

	.uk-text-uppercase {
		text-transform: uppercase !important;
	}

	.uk-text-lowercase {
		text-transform: lowercase !important;
	}

	.uk-text-muted {
		color: #687790 !important;
	}

	.uk-text-emphasis {
		color: inherit !important;
	}

	.uk-text-primary {
		color: #3bd671 !important;
	}

	.uk-text-secondary {
		color: #131a26 !important;
	}

	.uk-text-success {
		color: #32d296 !important;
	}

	.uk-text-warning {
		color: #f29030 !important;
	}

	.uk-text-danger {
		color: #df484a !important;
	}

	.uk-text-background {
		display: inline-block;
		-webkit-background-clip: text;
		color: #3bd671 !important;
	}

	@supports (-webkit-background-clip: text) {
		.uk-text-background {
			background-color: #3bd671;
			color: transparent !important;
		}
	}

	.uk-text-left {
		text-align: left !important;
	}

	.uk-text-right {
		text-align: right !important;
	}

	.uk-text-center {
		text-align: center !important;
	}

	.uk-text-justify {
		text-align: justify !important;
	}

	@media (width >=640px) {
		.uk-text-left\\@s {
			text-align: left !important;
		}

		.uk-text-right\\@s {
			text-align: right !important;
		}

		.uk-text-center\\@s {
			text-align: center !important;
		}
	}

	@media (width >=960px) {
		.uk-text-left\\@m {
			text-align: left !important;
		}

		.uk-text-right\\@m {
			text-align: right !important;
		}

		.uk-text-center\\@m {
			text-align: center !important;
		}
	}

	@media (width >=1200px) {
		.uk-text-left\\@l {
			text-align: left !important;
		}

		.uk-text-right\\@l {
			text-align: right !important;
		}

		.uk-text-center\\@l {
			text-align: center !important;
		}
	}

	@media (width >=1600px) {
		.uk-text-left\\@xl {
			text-align: left !important;
		}

		.uk-text-right\\@xl {
			text-align: right !important;
		}

		.uk-text-center\\@xl {
			text-align: center !important;
		}
	}

	.uk-text-top {
		vertical-align: top !important;
	}

	.uk-text-middle {
		vertical-align: middle !important;
	}

	.uk-text-bottom {
		vertical-align: bottom !important;
	}

	.uk-text-baseline {
		vertical-align: baseline !important;
	}

	.uk-text-nowrap {
		white-space: nowrap;
	}

	.uk-text-truncate {
		max-width: 100%;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	th.uk-text-truncate,
	td.uk-text-truncate {
		max-width: 0;
	}

	.uk-text-break {
		overflow-wrap: break-word;
		word-wrap: break-word;
	}

	th.uk-text-break,
	td.uk-text-break {
		word-break: break-all;
	}

	.uk-background-default {
		background-color: #fff;
	}

	.uk-background-muted {
		background-color: #687790;
	}

	.uk-background-primary {
		background-color: #3bd671;
	}

	.uk-background-secondary {
		background-color: #131a26;
	}

	.uk-background-cover,
	.uk-background-contain {
		background-position: 50% 50%;
		background-repeat: no-repeat;
	}

	.uk-background-cover {
		background-size: cover;
	}

	.uk-background-contain {
		background-size: contain;
	}

	.uk-background-top-left {
		background-position: 0 0;
	}

	.uk-background-top-center {
		background-position: 50% 0;
	}

	.uk-background-top-right {
		background-position: 100% 0;
	}

	.uk-background-center-left {
		background-position: 0 50%;
	}

	.uk-background-center-center {
		background-position: 50% 50%;
	}

	.uk-background-center-right {
		background-position: 100% 50%;
	}

	.uk-background-bottom-left {
		background-position: 0 100%;
	}

	.uk-background-bottom-center {
		background-position: 50% 100%;
	}

	.uk-background-bottom-right {
		background-position: 100% 100%;
	}

	.uk-background-norepeat {
		background-repeat: no-repeat;
	}

	.uk-background-fixed {
		backface-visibility: hidden;
		background-attachment: fixed;
	}

	@media (pointer: coarse) {
		.uk-background-fixed {
			background-attachment: scroll;
		}
	}

	@media (width <=639px) {
		.uk-background-image\\@s {
			background-image: none !important;
		}
	}

	@media (width <=959px) {
		.uk-background-image\\@m {
			background-image: none !important;
		}
	}

	@media (width <=1199px) {
		.uk-background-image\\@l {
			background-image: none !important;
		}
	}

	@media (width <=1599px) {
		.uk-background-image\\@xl {
			background-image: none !important;
		}
	}

	.uk-background-blend-multiply {
		background-blend-mode: multiply;
	}

	.uk-background-blend-screen {
		background-blend-mode: screen;
	}

	.uk-background-blend-overlay {
		background-blend-mode: overlay;
	}

	.uk-background-blend-darken {
		background-blend-mode: darken;
	}

	.uk-background-blend-lighten {
		background-blend-mode: lighten;
	}

	.uk-background-blend-color-dodge {
		background-blend-mode: color-dodge;
	}

	.uk-background-blend-color-burn {
		background-blend-mode: color-burn;
	}

	.uk-background-blend-hard-light {
		background-blend-mode: hard-light;
	}

	.uk-background-blend-soft-light {
		background-blend-mode: soft-light;
	}

	.uk-background-blend-difference {
		background-blend-mode: difference;
	}

	.uk-background-blend-exclusion {
		background-blend-mode: exclusion;
	}

	.uk-background-blend-hue {
		background-blend-mode: hue;
	}

	.uk-background-blend-saturation {
		background-blend-mode: saturation;
	}

	.uk-background-blend-color {
		background-blend-mode: color;
	}

	.uk-background-blend-luminosity {
		background-blend-mode: luminosity;
	}

	.uk-svg,
	.uk-svg:not(.uk-preserve) [fill*='#']:not(.uk-preserve) {
		fill: currentcolor;
	}

	.uk-svg:not(.uk-preserve)
		[stroke*='#']:not(.uk-preserve) {
		stroke: currentcolor;
	}

	.uk-svg {
		-ms-transform: translate(0, 0);
		transform: translate(0, 0);
	}

	.uk-panel {
		display: flow-root;
		position: relative;
		box-sizing: border-box;
	}

	.uk-panel > :last-child {
		margin-bottom: 0;
	}

	.uk-panel-scrollable {
		border: 1px solid #e5e5e5;
		padding: 10px;
		height: 170px;
		overflow: auto;
		-webkit-overflow-scrolling: touch;
		resize: both;
	}

	.uk-clearfix::before {
		display: table-cell;
		content: '';
	}

	.uk-clearfix::after {
		display: table;
		clear: both;
		content: '';
	}

	.uk-float-left {
		float: left;
	}

	.uk-float-right {
		float: right;
	}

	[class*='uk-float-'] {
		max-width: 100%;
	}

	.uk-overflow-hidden {
		overflow: hidden;
	}

	.uk-overflow-auto {
		overflow: auto;
		-webkit-overflow-scrolling: touch;
	}

	.uk-overflow-auto > :last-child {
		margin-bottom: 0;
	}

	.uk-resize {
		resize: both;
	}

	.uk-resize-vertical {
		resize: vertical;
	}

	.uk-display-block {
		display: block !important;
	}

	.uk-display-inline {
		display: inline !important;
	}

	.uk-display-inline-block {
		display: inline-block !important;
	}

	[class*='uk-inline'] {
		display: inline-block;
		position: relative;
		vertical-align: middle;
		-webkit-backface-visibility: hidden;
		max-width: 100%;
	}

	.uk-inline-clip {
		overflow: hidden;
	}

	.uk-preserve-width,
	.uk-preserve-width canvas,
	.uk-preserve-width img,
	.uk-preserve-width svg,
	.uk-preserve-width video {
		max-width: none;
	}

	.uk-responsive-width,
	.uk-responsive-height {
		box-sizing: border-box;
	}

	.uk-responsive-width {
		max-width: 100% !important;
		height: auto;
	}

	.uk-responsive-height {
		width: auto;
		max-width: none;
		max-height: 100%;
	}

	.uk-border-circle {
		border-radius: 50%;
	}

	.uk-border-pill {
		border-radius: 500px;
	}

	.uk-border-rounded {
		border-radius: 5px;
	}

	.uk-inline-clip[class*='uk-border-'] {
		-webkit-transform: translateZ(0);
	}

	.uk-box-shadow-small {
		box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
	}

	.uk-box-shadow-medium {
		box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
	}

	.uk-box-shadow-large {
		box-shadow: 0 14px 25px rgb(0 0 0 / 16%);
	}

	.uk-box-shadow-xlarge {
		box-shadow: 0 28px 50px rgb(0 0 0 / 16%);
	}

	[class*='uk-box-shadow-hover'] {
		transition: box-shadow 0.1s ease-in-out;
	}

	.uk-box-shadow-hover-small:hover {
		box-shadow: 0 2px 8px rgb(0 0 0 / 8%);
	}

	.uk-box-shadow-hover-medium:hover {
		box-shadow: 0 5px 15px rgb(0 0 0 / 8%);
	}

	.uk-box-shadow-hover-large:hover {
		box-shadow: 0 14px 25px rgb(0 0 0 / 16%);
	}

	.uk-box-shadow-hover-xlarge:hover {
		box-shadow: 0 28px 50px rgb(0 0 0 / 16%);
	}

	@supports (
		(-webkit-filter: blur(0)) or (filter: blur(0))
	) {
		.uk-box-shadow-bottom {
			display: inline-block;
			position: relative;
			vertical-align: middle;
			max-width: 100%;
		}

		.uk-box-shadow-bottom::before {
			position: absolute;
			right: 0;
			bottom: -30px;
			left: 0;
			-webkit-filter: blur(20px);
			filter: blur(20px);
			border-radius: 100%;
			background: #444;
			height: 30px;
			content: '';
		}

		.uk-box-shadow-bottom > * {
			position: relative;
		}
	}

	.uk-dropcap::first-letter,
	.uk-dropcap > p:first-of-type::first-letter {
		display: block;
		float: left;
		margin-right: 10px;
		font-size: 3.99em;
		line-height: 1;
	}

	@-moz-document url-prefix() {
		.uk-dropcap::first-letter,
		.uk-dropcap > p:first-of-type::first-letter {
			margin-top: 1.1%;
		}
	}

	@supports (-ms-ime-align: auto) {
		.uk-dropcap > p:first-of-type::first-letter {
			font-size: 1em;
		}
	}

	.uk-logo {
		color: #131a26;
		font-size: 1.67rem;
		font-family: Roboto, Arial, sans-serif;
		text-decoration: none;
	}

	.uk-logo:hover,
	.uk-logo:focus {
		outline: none;
		color: #131a26;
		text-decoration: none;
	}

	.uk-logo-inverse {
		display: none;
	}

	.uk-disabled {
		pointer-events: none;
	}

	.uk-drag,
	.uk-drag * {
		cursor: move;
	}

	.uk-drag iframe {
		pointer-events: none;
	}

	.uk-dragover {
		box-shadow: 0 0 20px rgb(100 100 100 / 30%);
	}

	.uk-blend-multiply {
		mix-blend-mode: multiply;
	}

	.uk-blend-screen {
		mix-blend-mode: screen;
	}

	.uk-blend-overlay {
		mix-blend-mode: overlay;
	}

	.uk-blend-darken {
		mix-blend-mode: darken;
	}

	.uk-blend-lighten {
		mix-blend-mode: lighten;
	}

	.uk-blend-color-dodge {
		mix-blend-mode: color-dodge;
	}

	.uk-blend-color-burn {
		mix-blend-mode: color-burn;
	}

	.uk-blend-hard-light {
		mix-blend-mode: hard-light;
	}

	.uk-blend-soft-light {
		mix-blend-mode: soft-light;
	}

	.uk-blend-difference {
		mix-blend-mode: difference;
	}

	.uk-blend-exclusion {
		mix-blend-mode: exclusion;
	}

	.uk-blend-hue {
		mix-blend-mode: hue;
	}

	.uk-blend-saturation {
		mix-blend-mode: saturation;
	}

	.uk-blend-color {
		mix-blend-mode: color;
	}

	.uk-blend-luminosity {
		mix-blend-mode: luminosity;
	}

	.uk-transform-center {
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
	}

	.uk-transform-origin-top-left {
		-ms-transform-origin: 0 0;
		transform-origin: 0 0;
	}

	.uk-transform-origin-top-center {
		-ms-transform-origin: 50% 0;
		transform-origin: 50% 0;
	}

	.uk-transform-origin-top-right {
		-ms-transform-origin: 100% 0;
		transform-origin: 100% 0;
	}

	.uk-transform-origin-center-left {
		-ms-transform-origin: 0 50%;
		transform-origin: 0 50%;
	}

	.uk-transform-origin-center-right {
		-ms-transform-origin: 100% 50%;
		transform-origin: 100% 50%;
	}

	.uk-transform-origin-bottom-left {
		-ms-transform-origin: 0 100%;
		transform-origin: 0 100%;
	}

	.uk-transform-origin-bottom-center {
		-ms-transform-origin: 50% 100%;
		transform-origin: 50% 100%;
	}

	.uk-transform-origin-bottom-right {
		-ms-transform-origin: 100% 100%;
		transform-origin: 100% 100%;
	}

	.uk-flex {
		display: flexbox;
		display: flex;
	}

	.uk-flex-inline {
		display: -ms-inline-flexbox;
		display: inline-flex;
	}

	.uk-flex::before,
	.uk-flex::after,
	.uk-flex-inline::before,
	.uk-flex-inline::after {
		display: none;
	}

	.uk-flex-left {
		-ms-flex-pack: start;
		justify-content: flex-start;
	}

	.uk-flex-center {
		-ms-flex-pack: center;
		justify-content: center;
	}

	.uk-flex-right {
		-ms-flex-pack: end;
		justify-content: flex-end;
	}

	.uk-flex-between {
		-ms-flex-pack: justify;
		justify-content: space-between;
	}

	.uk-flex-around {
		-ms-flex-pack: distribute;
		justify-content: space-around;
	}

	@media (width >=640px) {
		.uk-flex-left\\@s {
			-ms-flex-pack: start;
			justify-content: flex-start;
		}

		.uk-flex-center\\@s {
			-ms-flex-pack: center;
			justify-content: center;
		}

		.uk-flex-right\\@s {
			-ms-flex-pack: end;
			justify-content: flex-end;
		}

		.uk-flex-between\\@s {
			-ms-flex-pack: justify;
			justify-content: space-between;
		}

		.uk-flex-around\\@s {
			-ms-flex-pack: distribute;
			justify-content: space-around;
		}
	}

	@media (width >=960px) {
		.uk-flex-left\\@m {
			-ms-flex-pack: start;
			justify-content: flex-start;
		}

		.uk-flex-center\\@m {
			-ms-flex-pack: center;
			justify-content: center;
		}

		.uk-flex-right\\@m {
			-ms-flex-pack: end;
			justify-content: flex-end;
		}

		.uk-flex-between\\@m {
			-ms-flex-pack: justify;
			justify-content: space-between;
		}

		.uk-flex-around\\@m {
			-ms-flex-pack: distribute;
			justify-content: space-around;
		}
	}

	@media (width >=1200px) {
		.uk-flex-left\\@l {
			-ms-flex-pack: start;
			justify-content: flex-start;
		}

		.uk-flex-center\\@l {
			-ms-flex-pack: center;
			justify-content: center;
		}

		.uk-flex-right\\@l {
			-ms-flex-pack: end;
			justify-content: flex-end;
		}

		.uk-flex-between\\@l {
			-ms-flex-pack: justify;
			justify-content: space-between;
		}

		.uk-flex-around\\@l {
			-ms-flex-pack: distribute;
			justify-content: space-around;
		}
	}

	@media (width >=1600px) {
		.uk-flex-left\\@xl {
			-ms-flex-pack: start;
			justify-content: flex-start;
		}

		.uk-flex-center\\@xl {
			-ms-flex-pack: center;
			justify-content: center;
		}

		.uk-flex-right\\@xl {
			-ms-flex-pack: end;
			justify-content: flex-end;
		}

		.uk-flex-between\\@xl {
			-ms-flex-pack: justify;
			justify-content: space-between;
		}

		.uk-flex-around\\@xl {
			-ms-flex-pack: distribute;
			justify-content: space-around;
		}
	}

	.uk-flex-stretch {
		-ms-flex-align: stretch;
		align-items: stretch;
	}

	.uk-flex-top {
		-ms-flex-align: start;
		align-items: flex-start;
	}

	.uk-flex-middle {
		-ms-flex-align: center;
		align-items: center;
	}

	.uk-flex-bottom {
		-ms-flex-align: end;
		align-items: flex-end;
	}

	.uk-flex-row {
		-ms-flex-direction: row;
		flex-direction: row;
	}

	.uk-flex-row-reverse {
		-ms-flex-direction: row-reverse;
		flex-direction: row-reverse;
	}

	.uk-flex-column {
		-ms-flex-direction: column;
		flex-direction: column;
	}

	.uk-flex-column-reverse {
		-ms-flex-direction: column-reverse;
		flex-direction: column-reverse;
	}

	.uk-flex-nowrap {
		-ms-flex-wrap: nowrap;
		flex-wrap: nowrap;
	}

	.uk-flex-wrap {
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
	}

	.uk-flex-wrap-reverse {
		-ms-flex-wrap: wrap-reverse;
		flex-wrap: wrap-reverse;
	}

	.uk-flex-wrap-stretch {
		-ms-flex-line-pack: stretch;
		align-content: stretch;
	}

	.uk-flex-wrap-top {
		-ms-flex-line-pack: start;
		align-content: flex-start;
	}

	.uk-flex-wrap-middle {
		-ms-flex-line-pack: center;
		align-content: center;
	}

	.uk-flex-wrap-bottom {
		-ms-flex-line-pack: end;
		align-content: flex-end;
	}

	.uk-flex-wrap-between {
		-ms-flex-line-pack: justify;
		align-content: space-between;
	}

	.uk-flex-wrap-around {
		-ms-flex-line-pack: distribute;
		align-content: space-around;
	}

	.uk-flex-first {
		-ms-flex-order: -1;
		order: -1;
	}

	.uk-flex-last {
		-ms-flex-order: 99;
		order: 99;
	}

	@media (width >=640px) {
		.uk-flex-first\\@s {
			-ms-flex-order: -1;
			order: -1;
		}

		.uk-flex-last\\@s {
			-ms-flex-order: 99;
			order: 99;
		}
	}

	@media (width >=960px) {
		.uk-flex-first\\@m {
			-ms-flex-order: -1;
			order: -1;
		}

		.uk-flex-last\\@m {
			-ms-flex-order: 99;
			order: 99;
		}
	}

	@media (width >=1200px) {
		.uk-flex-first\\@l {
			-ms-flex-order: -1;
			order: -1;
		}

		.uk-flex-last\\@l {
			-ms-flex-order: 99;
			order: 99;
		}
	}

	@media (width >=1600px) {
		.uk-flex-first\\@xl {
			-ms-flex-order: -1;
			order: -1;
		}

		.uk-flex-last\\@xl {
			-ms-flex-order: 99;
			order: 99;
		}
	}

	.uk-flex-none {
		-ms-flex: none;
		flex: none;
	}

	.uk-flex-auto {
		-ms-flex: auto;
		flex: auto;
	}

	.uk-flex-1 {
		-ms-flex: 1;
		flex: 1;
	}

	.uk-margin {
		margin-bottom: 45px;
	}

	* + .uk-margin {
		margin-top: 45px !important;
	}

	.uk-margin-top {
		margin-top: 45px !important;
	}

	.uk-margin-bottom {
		margin-bottom: 45px !important;
	}

	.uk-margin-left {
		margin-left: 45px !important;
	}

	.uk-margin-right {
		margin-right: 45px !important;
	}

	.uk-margin-small {
		margin-bottom: 15px;
	}

	* + .uk-margin-small {
		margin-top: 15px !important;
	}

	.uk-margin-small-top {
		margin-top: 15px !important;
	}

	.uk-margin-small-bottom {
		margin-bottom: 15px !important;
	}

	.uk-margin-small-left {
		margin-left: 15px !important;
	}

	.uk-margin-small-right {
		margin-right: 15px !important;
	}

	.uk-margin-medium {
		margin-bottom: 45px;
	}

	* + .uk-margin-medium {
		margin-top: 45px !important;
	}

	.uk-margin-medium-top {
		margin-top: 45px !important;
	}

	.uk-margin-medium-bottom {
		margin-bottom: 45px !important;
	}

	.uk-margin-medium-left {
		margin-left: 45px !important;
	}

	.uk-margin-medium-right {
		margin-right: 45px !important;
	}

	.uk-margin-large {
		margin-bottom: 45px;
	}

	* + .uk-margin-large {
		margin-top: 45px !important;
	}

	.uk-margin-large-top {
		margin-top: 45px !important;
	}

	.uk-margin-large-bottom {
		margin-bottom: 45px !important;
	}

	.uk-margin-large-left {
		margin-left: 45px !important;
	}

	.uk-margin-large-right {
		margin-right: 45px !important;
	}

	@media (width >=1200px) {
		.uk-margin-large {
			margin-bottom: 70px;
		}

		* + .uk-margin-large {
			margin-top: 70px !important;
		}

		.uk-margin-large-top {
			margin-top: 70px !important;
		}

		.uk-margin-large-bottom {
			margin-bottom: 70px !important;
		}

		.uk-margin-large-left {
			margin-left: 70px !important;
		}

		.uk-margin-large-right {
			margin-right: 70px !important;
		}
	}

	.uk-margin-xlarge {
		margin-bottom: 70px;
	}

	* + .uk-margin-xlarge {
		margin-top: 70px !important;
	}

	.uk-margin-xlarge-top {
		margin-top: 70px !important;
	}

	.uk-margin-xlarge-bottom {
		margin-bottom: 70px !important;
	}

	.uk-margin-xlarge-left {
		margin-left: 70px !important;
	}

	.uk-margin-xlarge-right {
		margin-right: 70px !important;
	}

	@media (width >=1200px) {
		.uk-margin-xlarge {
			margin-bottom: 160px;
		}

		* + .uk-margin-xlarge {
			margin-top: 160px !important;
		}

		.uk-margin-xlarge-top {
			margin-top: 160px !important;
		}

		.uk-margin-xlarge-bottom {
			margin-bottom: 160px !important;
		}

		.uk-margin-xlarge-left {
			margin-left: 160px !important;
		}

		.uk-margin-xlarge-right {
			margin-right: 160px !important;
		}
	}

	.uk-margin-auto {
		margin-right: auto !important;
		margin-left: auto !important;
	}

	.uk-margin-auto-top {
		margin-top: auto !important;
	}

	.uk-margin-auto-bottom {
		margin-bottom: auto !important;
	}

	.uk-margin-auto-left {
		margin-left: auto !important;
	}

	.uk-margin-auto-right {
		margin-right: auto !important;
	}

	.uk-margin-auto-vertical {
		margin-top: auto !important;
		margin-bottom: auto !important;
	}

	@media (width >=640px) {
		.uk-margin-auto\\@s {
			margin-right: auto !important;
			margin-left: auto !important;
		}

		.uk-margin-auto-left\\@s {
			margin-left: auto !important;
		}

		.uk-margin-auto-right\\@s {
			margin-right: auto !important;
		}
	}

	@media (width >=960px) {
		.uk-margin-auto\\@m {
			margin-right: auto !important;
			margin-left: auto !important;
		}

		.uk-margin-auto-left\\@m {
			margin-left: auto !important;
		}

		.uk-margin-auto-right\\@m {
			margin-right: auto !important;
		}
	}

	@media (width >=1200px) {
		.uk-margin-auto\\@l {
			margin-right: auto !important;
			margin-left: auto !important;
		}

		.uk-margin-auto-left\\@l {
			margin-left: auto !important;
		}

		.uk-margin-auto-right\\@l {
			margin-right: auto !important;
		}
	}

	@media (width >=1600px) {
		.uk-margin-auto\\@xl {
			margin-right: auto !important;
			margin-left: auto !important;
		}

		.uk-margin-auto-left\\@xl {
			margin-left: auto !important;
		}

		.uk-margin-auto-right\\@xl {
			margin-right: auto !important;
		}
	}

	.uk-margin-remove {
		margin: 0 !important;
	}

	.uk-margin-remove-top {
		margin-top: 0 !important;
	}

	.uk-margin-remove-bottom {
		margin-bottom: 0 !important;
	}

	.uk-margin-remove-left {
		margin-left: 0 !important;
	}

	.uk-margin-remove-right {
		margin-right: 0 !important;
	}

	.uk-margin-remove-vertical {
		margin-top: 0 !important;
		margin-bottom: 0 !important;
	}

	.uk-margin-remove-adjacent + *,
	.uk-margin-remove-first-child > :first-child {
		margin-top: 0 !important;
	}

	.uk-margin-remove-last-child > :last-child {
		margin-bottom: 0 !important;
	}

	@media (width >=640px) {
		.uk-margin-remove-left\\@s {
			margin-left: 0 !important;
		}

		.uk-margin-remove-right\\@s {
			margin-right: 0 !important;
		}
	}

	@media (width >=960px) {
		.uk-margin-remove-left\\@m {
			margin-left: 0 !important;
		}

		.uk-margin-remove-right\\@m {
			margin-right: 0 !important;
		}
	}

	@media (width >=1200px) {
		.uk-margin-remove-left\\@l {
			margin-left: 0 !important;
		}

		.uk-margin-remove-right\\@l {
			margin-right: 0 !important;
		}
	}

	@media (width >=1600px) {
		.uk-margin-remove-left\\@xl {
			margin-left: 0 !important;
		}

		.uk-margin-remove-right\\@xl {
			margin-right: 0 !important;
		}
	}

	.uk-padding {
		padding: 30px;
	}

	@media (width >=1200px) {
		.uk-padding {
			padding: 45px;
		}
	}

	.uk-padding-small {
		padding: 15px;
	}

	.uk-padding-large {
		padding: 30px;
	}

	@media (width >=1200px) {
		.uk-padding-large {
			padding: 60px;
		}
	}

	.uk-padding-remove {
		padding: 0 !important;
	}

	.uk-padding-remove-top {
		padding-top: 0 !important;
	}

	.uk-padding-remove-bottom {
		padding-bottom: 0 !important;
	}

	.uk-padding-remove-left {
		padding-left: 0 !important;
	}

	.uk-padding-remove-right {
		padding-right: 0 !important;
	}

	.uk-padding-remove-vertical {
		padding-top: 0 !important;
		padding-bottom: 0 !important;
	}

	.uk-padding-remove-horizontal {
		padding-right: 0 !important;
		padding-left: 0 !important;
	}

	[class*='uk-position-top'],
	[class*='uk-position-bottom'],
	[class*='uk-position-left'],
	[class*='uk-position-right'],
	[class*='uk-position-center'] {
		position: absolute !important;
		max-width: 100%;
	}

	.uk-position-top {
		top: 0;
		right: 0;
		left: 0;
	}

	.uk-position-bottom {
		right: 0;
		bottom: 0;
		left: 0;
	}

	.uk-position-left {
		top: 0;
		bottom: 0;
		left: 0;
	}

	.uk-position-right {
		top: 0;
		right: 0;
		bottom: 0;
	}

	.uk-position-top-left {
		top: 0;
		left: 0;
	}

	.uk-position-top-right {
		top: 0;
		right: 0;
	}

	.uk-position-bottom-left {
		bottom: 0;
		left: 0;
	}

	.uk-position-bottom-right {
		right: 0;
		bottom: 0;
	}

	.uk-position-center {
		top: 50%;
		left: 50%;
		-ms-transform: translate(-50%, -50%);
		transform: translate(-50%, -50%);
		box-sizing: border-box;
		width: max-content;
		max-width: 100%;
	}

	[class*='uk-position-center-left'],
	[class*='uk-position-center-right'] {
		top: 50%;
		-ms-transform: translateY(-50%);
		transform: translateY(-50%);
	}

	.uk-position-center-left {
		left: 0;
	}

	.uk-position-center-right {
		right: 0;
	}

	.uk-position-center-left-out {
		right: 100%;
		width: max-content;
	}

	.uk-position-center-right-out {
		left: 100%;
		width: max-content;
	}

	.uk-position-top-center,
	.uk-position-bottom-center {
		left: 50%;
		-ms-transform: translateX(-50%);
		transform: translateX(-50%);
		box-sizing: border-box;
		width: max-content;
		max-width: 100%;
	}

	.uk-position-top-center {
		top: 0;
	}

	.uk-position-bottom-center {
		bottom: 0;
	}

	.uk-position-cover {
		position: absolute;
		inset: 0;
	}

	.uk-position-relative {
		position: relative !important;
	}

	.uk-position-absolute {
		position: absolute !important;
	}

	.uk-position-fixed {
		position: fixed !important;
	}

	.uk-position-z-index {
		z-index: 1;
	}

	.uk-position-small {
		margin: 15px;
		max-width: calc(100% - (15px * 2));
	}

	.uk-position-small.uk-position-center {
		-ms-transform: translate(-50%, -50%)
			translate(-15px, -15px);
		transform: translate(-50%, -50%) translate(-15px, -15px);
	}

	.uk-position-small[class*='uk-position-center-left'],
	.uk-position-small[class*='uk-position-center-right'] {
		-ms-transform: translateY(-50%) translateY(-15px);
		transform: translateY(-50%) translateY(-15px);
	}

	.uk-position-small.uk-position-top-center,
	.uk-position-small.uk-position-bottom-center {
		-ms-transform: translateX(-50%) translateX(-15px);
		transform: translateX(-50%) translateX(-15px);
	}

	.uk-position-medium {
		margin: 30px;
		max-width: calc(100% - (30px * 2));
	}

	.uk-position-medium.uk-position-center {
		-ms-transform: translate(-50%, -50%)
			translate(-30px, -30px);
		transform: translate(-50%, -50%) translate(-30px, -30px);
	}

	.uk-position-medium[class*='uk-position-center-left'],
	.uk-position-medium[class*='uk-position-center-right'] {
		-ms-transform: translateY(-50%) translateY(-30px);
		transform: translateY(-50%) translateY(-30px);
	}

	.uk-position-medium.uk-position-top-center,
	.uk-position-medium.uk-position-bottom-center {
		-ms-transform: translateX(-50%) translateX(-30px);
		transform: translateX(-50%) translateX(-30px);
	}

	.uk-position-large {
		margin: 30px;
		max-width: calc(100% - (30px * 2));
	}

	.uk-position-large.uk-position-center {
		-ms-transform: translate(-50%, -50%)
			translate(-30px, -30px);
		transform: translate(-50%, -50%) translate(-30px, -30px);
	}

	.uk-position-large[class*='uk-position-center-left'],
	.uk-position-large[class*='uk-position-center-right'] {
		-ms-transform: translateY(-50%) translateY(-30px);
		transform: translateY(-50%) translateY(-30px);
	}

	.uk-position-large.uk-position-top-center,
	.uk-position-large.uk-position-bottom-center {
		-ms-transform: translateX(-50%) translateX(-30px);
		transform: translateX(-50%) translateX(-30px);
	}

	@media (width >=1200px) {
		.uk-position-large {
			margin: 50px;
			max-width: calc(100% - (50px * 2));
		}

		.uk-position-large.uk-position-center {
			-ms-transform: translate(-50%, -50%)
				translate(-50px, -50px);
			transform: translate(-50%, -50%)
				translate(-50px, -50px);
		}

		.uk-position-large[class*='uk-position-center-left'],
		.uk-position-large[class*='uk-position-center-right'] {
			-ms-transform: translateY(-50%) translateY(-50px);
			transform: translateY(-50%) translateY(-50px);
		}

		.uk-position-large.uk-position-top-center,
		.uk-position-large.uk-position-bottom-center {
			-ms-transform: translateX(-50%) translateX(-50px);
			transform: translateX(-50%) translateX(-50px);
		}
	}

	.uk-transition-toggle {
		-webkit-tap-highlight-color: transparent;
	}

	.uk-transition-toggle:focus {
		outline: none;
	}

	.uk-transition-fade,
	[class*='uk-transition-scale'],
	[class*='uk-transition-slide'] {
		opacity: 0%;
		transition: 0.3s ease-out;
		transition-property: opacity, transform, filter,
			opacity, transform, filter;
		transition-property: opacity, transform, filter;
	}

	.uk-transition-toggle:hover .uk-transition-fade,
	.uk-transition-toggle:focus .uk-transition-fade,
	.uk-transition-active.uk-active .uk-transition-fade {
		opacity: 100%;
	}

	.uk-transition-scale-up {
		-ms-transform: scale(1, 1);
		transform: scale(1, 1);
	}

	.uk-transition-scale-down {
		-ms-transform: scale(1.1, 1.1);
		transform: scale(1.1, 1.1);
	}

	.uk-transition-toggle:hover .uk-transition-scale-up,
	.uk-transition-toggle:focus .uk-transition-scale-up,
	.uk-transition-active.uk-active .uk-transition-scale-up {
		-ms-transform: scale(1.1, 1.1);
		transform: scale(1.1, 1.1);
		opacity: 100%;
	}

	.uk-transition-toggle:hover .uk-transition-scale-down,
	.uk-transition-toggle:focus .uk-transition-scale-down,
	.uk-transition-active.uk-active
		.uk-transition-scale-down {
		-ms-transform: scale(1, 1);
		transform: scale(1, 1);
		opacity: 100%;
	}

	.uk-transition-slide-top {
		-ms-transform: translateY(-100%);
		transform: translateY(-100%);
	}

	.uk-transition-slide-bottom {
		-ms-transform: translateY(100%);
		transform: translateY(100%);
	}

	.uk-transition-slide-left {
		-ms-transform: translateX(-100%);
		transform: translateX(-100%);
	}

	.uk-transition-slide-right {
		-ms-transform: translateX(100%);
		transform: translateX(100%);
	}

	.uk-transition-slide-top-small {
		-ms-transform: translateY(-10px);
		transform: translateY(-10px);
	}

	.uk-transition-slide-bottom-small {
		-ms-transform: translateY(10px);
		transform: translateY(10px);
	}

	.uk-transition-slide-left-small {
		-ms-transform: translateX(-10px);
		transform: translateX(-10px);
	}

	.uk-transition-slide-right-small {
		-ms-transform: translateX(10px);
		transform: translateX(10px);
	}

	.uk-transition-slide-top-medium {
		-ms-transform: translateY(-50px);
		transform: translateY(-50px);
	}

	.uk-transition-slide-bottom-medium {
		-ms-transform: translateY(50px);
		transform: translateY(50px);
	}

	.uk-transition-slide-left-medium {
		-ms-transform: translateX(-50px);
		transform: translateX(-50px);
	}

	.uk-transition-slide-right-medium {
		-ms-transform: translateX(50px);
		transform: translateX(50px);
	}

	.uk-transition-toggle:hover
		[class*='uk-transition-slide'],
	.uk-transition-toggle:focus
		[class*='uk-transition-slide'],
	.uk-transition-active.uk-active
		[class*='uk-transition-slide'] {
		-ms-transform: translate(0, 0);
		transform: translate(0, 0);
		opacity: 100%;
	}

	.uk-transition-opaque {
		opacity: 100%;
	}

	.uk-transition-slow {
		transition-duration: 0.7s;
	}

	[hidden],
	.uk-hidden {
		display: none !important;
	}

	@media (width >=640px) {
		.uk-hidden\\@s {
			display: none !important;
		}
	}

	@media (width >=960px) {
		.uk-hidden\\@m {
			display: none !important;
		}
	}

	@media (width >=1200px) {
		.uk-hidden\\@l {
			display: none !important;
		}
	}

	@media (width >=1600px) {
		.uk-hidden\\@xl {
			display: none !important;
		}
	}

	@media (width <=639px) {
		.uk-visible\\@s {
			display: none !important;
		}
	}

	@media (width <=959px) {
		.uk-visible\\@m {
			display: none !important;
		}
	}

	@media (width <=1199px) {
		.uk-visible\\@l {
			display: none !important;
		}
	}

	@media (width <=1599px) {
		.uk-visible\\@xl {
			display: none !important;
		}
	}

	.uk-invisible {
		visibility: hidden !important;
	}

	.uk-visible-toggle:not(:hover, :focus)
		.uk-hidden-hover:not(:focus-within) {
		position: absolute !important;
		margin: 0 !important;
		padding: 0 !important;
		width: 0 !important;
		height: 0 !important;
		overflow: hidden !important;
	}

	.uk-visible-toggle:not(:hover, :focus)
		.uk-invisible-hover:not(:focus-within) {
		opacity: 0% !important;
	}

	.uk-visible-toggle {
		-webkit-tap-highlight-color: transparent;
	}

	.uk-visible-toggle:focus {
		outline: none;
	}

	@media (pointer: coarse) {
		.uk-hidden-touch {
			display: none !important;
		}
	}

	.uk-hidden-notouch {
		display: none !important;
	}

	@media (pointer: coarse) {
		.uk-hidden-notouch {
			display: block !important;
		}
	}

	.ct-label {
		fill: #687790;
		color: #687790;
		font-size: 12px;
		line-height: 1;
	}

	.ct-chart-line .ct-label,
	.ct-chart-bar .ct-label {
		display: block;
		display: flexbox;
		display: flex;
	}

	.ct-chart-pie .ct-label,
	.ct-chart-donut .ct-label {
		dominant-baseline: central;
	}

	.ct-label.ct-horizontal.ct-start {
		-ms-flex-align: flex-end;
		align-items: flex-end;
		-ms-flex-pack: flex-start;
		justify-content: flex-start;
		text-align: left;
		text-anchor: start;
	}

	.ct-label.ct-horizontal.ct-end {
		-ms-flex-align: flex-start;
		align-items: flex-start;
		-ms-flex-pack: flex-start;
		justify-content: flex-start;
		text-align: left;
		text-anchor: start;
	}

	.ct-label.ct-vertical.ct-start {
		-ms-flex-align: flex-end;
		align-items: flex-end;
		-ms-flex-pack: flex-end;
		justify-content: flex-end;
		text-align: right;
		text-anchor: end;
	}

	.ct-label.ct-vertical.ct-end {
		-ms-flex-align: flex-end;
		align-items: flex-end;
		-ms-flex-pack: flex-start;
		justify-content: flex-start;
		text-align: left;
		text-anchor: start;
	}

	.ct-chart-bar .ct-label.ct-horizontal.ct-start {
		-ms-flex-align: flex-end;
		align-items: flex-end;
		-ms-flex-pack: center;
		justify-content: center;
		text-align: center;
		text-anchor: start;
	}

	.ct-chart-bar .ct-label.ct-horizontal.ct-end {
		-ms-flex-align: flex-start;
		align-items: flex-start;
		-ms-flex-pack: center;
		justify-content: center;
		text-align: center;
		text-anchor: start;
	}

	.ct-chart-bar.ct-horizontal-bars
		.ct-label.ct-horizontal.ct-start {
		-ms-flex-align: flex-end;
		align-items: flex-end;
		-ms-flex-pack: flex-start;
		justify-content: flex-start;
		text-align: left;
		text-anchor: start;
	}

	.ct-chart-bar.ct-horizontal-bars
		.ct-label.ct-horizontal.ct-end {
		-ms-flex-align: flex-start;
		align-items: flex-start;
		-ms-flex-pack: flex-start;
		justify-content: flex-start;
		text-align: left;
		text-anchor: start;
	}

	.ct-chart-bar.ct-horizontal-bars
		.ct-label.ct-vertical.ct-start {
		-ms-flex-align: center;
		align-items: center;
		-ms-flex-pack: flex-end;
		justify-content: flex-end;
		text-align: right;
		text-anchor: end;
	}

	.ct-chart-bar.ct-horizontal-bars
		.ct-label.ct-vertical.ct-end {
		-ms-flex-align: center;
		align-items: center;
		-ms-flex-pack: flex-start;
		justify-content: flex-start;
		text-align: left;
		text-anchor: end;
	}

	.ct-grid {
		stroke: rgb(0 0 0 / 10%);
		stroke-width: 1px;
		stroke-dasharray: 2px;
	}

	.ct-grid-background {
		fill: none;
	}

	.ct-point {
		stroke-width: 12px;
		stroke-linecap: round;
	}

	.ct-line {
		fill: none;
		stroke-width: 2px;
	}

	.ct-area {
		stroke: none;
		fill-opacity: 40%;
	}

	.ct-bar {
		fill: none;
		stroke-width: 10px;
	}

	.ct-slice-donut {
		fill: none;
		stroke-width: 60px;
	}

	.ct-series-a .ct-point,
	.ct-series-a .ct-line,
	.ct-series-a .ct-bar,
	.ct-series-a .ct-slice-donut {
		stroke: #3bd671;
	}

	.ct-series-a .ct-slice-pie,
	.ct-series-a .ct-slice-donut-solid,
	.ct-series-a .ct-area {
		fill: #3bd671;
	}

	.ct-series-b .ct-point,
	.ct-series-b .ct-line,
	.ct-series-b .ct-bar,
	.ct-series-b .ct-slice-donut {
		stroke: #f05b4f;
	}

	.ct-series-b .ct-slice-pie,
	.ct-series-b .ct-slice-donut-solid,
	.ct-series-b .ct-area {
		fill: #f05b4f;
	}

	.ct-series-c .ct-point,
	.ct-series-c .ct-line,
	.ct-series-c .ct-bar,
	.ct-series-c .ct-slice-donut {
		stroke: #f4c63d;
	}

	.ct-series-c .ct-slice-pie,
	.ct-series-c .ct-slice-donut-solid,
	.ct-series-c .ct-area {
		fill: #f4c63d;
	}

	.ct-series-d .ct-point,
	.ct-series-d .ct-line,
	.ct-series-d .ct-bar,
	.ct-series-d .ct-slice-donut {
		stroke: #d17905;
	}

	.ct-series-d .ct-slice-pie,
	.ct-series-d .ct-slice-donut-solid,
	.ct-series-d .ct-area {
		fill: #d17905;
	}

	.ct-series-e .ct-point,
	.ct-series-e .ct-line,
	.ct-series-e .ct-bar,
	.ct-series-e .ct-slice-donut {
		stroke: #453d3f;
	}

	.ct-series-e .ct-slice-pie,
	.ct-series-e .ct-slice-donut-solid,
	.ct-series-e .ct-area {
		fill: #453d3f;
	}

	.ct-series-f .ct-point,
	.ct-series-f .ct-line,
	.ct-series-f .ct-bar,
	.ct-series-f .ct-slice-donut {
		stroke: #59922b;
	}

	.ct-series-f .ct-slice-pie,
	.ct-series-f .ct-slice-donut-solid,
	.ct-series-f .ct-area {
		fill: #59922b;
	}

	.ct-series-g .ct-point,
	.ct-series-g .ct-line,
	.ct-series-g .ct-bar,
	.ct-series-g .ct-slice-donut {
		stroke: #0544d3;
	}

	.ct-series-g .ct-slice-pie,
	.ct-series-g .ct-slice-donut-solid,
	.ct-series-g .ct-area {
		fill: #0544d3;
	}

	.ct-series-h .ct-point,
	.ct-series-h .ct-line,
	.ct-series-h .ct-bar,
	.ct-series-h .ct-slice-donut {
		stroke: #6b0392;
	}

	.ct-series-h .ct-slice-pie,
	.ct-series-h .ct-slice-donut-solid,
	.ct-series-h .ct-area {
		fill: #6b0392;
	}

	.ct-series-i .ct-point,
	.ct-series-i .ct-line,
	.ct-series-i .ct-bar,
	.ct-series-i .ct-slice-donut {
		stroke: #f05b4f;
	}

	.ct-series-i .ct-slice-pie,
	.ct-series-i .ct-slice-donut-solid,
	.ct-series-i .ct-area {
		fill: #f05b4f;
	}

	.ct-series-j .ct-point,
	.ct-series-j .ct-line,
	.ct-series-j .ct-bar,
	.ct-series-j .ct-slice-donut {
		stroke: #dda458;
	}

	.ct-series-j .ct-slice-pie,
	.ct-series-j .ct-slice-donut-solid,
	.ct-series-j .ct-area {
		fill: #dda458;
	}

	.ct-series-k .ct-point,
	.ct-series-k .ct-line,
	.ct-series-k .ct-bar,
	.ct-series-k .ct-slice-donut {
		stroke: #eacf7d;
	}

	.ct-series-k .ct-slice-pie,
	.ct-series-k .ct-slice-donut-solid,
	.ct-series-k .ct-area {
		fill: #eacf7d;
	}

	.ct-series-l .ct-point,
	.ct-series-l .ct-line,
	.ct-series-l .ct-bar,
	.ct-series-l .ct-slice-donut {
		stroke: #86797d;
	}

	.ct-series-l .ct-slice-pie,
	.ct-series-l .ct-slice-donut-solid,
	.ct-series-l .ct-area {
		fill: #86797d;
	}

	.ct-series-m .ct-point,
	.ct-series-m .ct-line,
	.ct-series-m .ct-bar,
	.ct-series-m .ct-slice-donut {
		stroke: #b2c326;
	}

	.ct-series-m .ct-slice-pie,
	.ct-series-m .ct-slice-donut-solid,
	.ct-series-m .ct-area {
		fill: #b2c326;
	}

	.ct-series-n .ct-point,
	.ct-series-n .ct-line,
	.ct-series-n .ct-bar,
	.ct-series-n .ct-slice-donut {
		stroke: #6188e2;
	}

	.ct-series-n .ct-slice-pie,
	.ct-series-n .ct-slice-donut-solid,
	.ct-series-n .ct-area {
		fill: #6188e2;
	}

	.ct-series-o .ct-point,
	.ct-series-o .ct-line,
	.ct-series-o .ct-bar,
	.ct-series-o .ct-slice-donut {
		stroke: #a748ca;
	}

	.ct-series-o .ct-slice-pie,
	.ct-series-o .ct-slice-donut-solid,
	.ct-series-o .ct-area {
		fill: #a748ca;
	}

	.ct-square {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-square::before {
		display: block;
		float: left;
		padding-bottom: 100%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-square::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-square > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-minor-second {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-minor-second::before {
		display: block;
		float: left;
		padding-bottom: 93.75%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-minor-second::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-minor-second > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-major-second {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-major-second::before {
		display: block;
		float: left;
		padding-bottom: 88.8888888889%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-major-second::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-major-second > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-minor-third {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-minor-third::before {
		display: block;
		float: left;
		padding-bottom: 83.3333333333%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-minor-third::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-minor-third > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-major-third {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-major-third::before {
		display: block;
		float: left;
		padding-bottom: 80%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-major-third::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-major-third > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-perfect-fourth {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-perfect-fourth::before {
		display: block;
		float: left;
		padding-bottom: 75%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-perfect-fourth::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-perfect-fourth > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-perfect-fifth {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-perfect-fifth::before {
		display: block;
		float: left;
		padding-bottom: 66.6666666667%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-perfect-fifth::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-perfect-fifth > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-minor-sixth {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-minor-sixth::before {
		display: block;
		float: left;
		padding-bottom: 62.5%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-minor-sixth::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-minor-sixth > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-golden-section {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-golden-section::before {
		display: block;
		float: left;
		padding-bottom: 61.804697157%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-golden-section::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-golden-section > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-major-sixth {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-major-sixth::before {
		display: block;
		float: left;
		padding-bottom: 60%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-major-sixth::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-major-sixth > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-minor-seventh {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-minor-seventh::before {
		display: block;
		float: left;
		padding-bottom: 56.25%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-minor-seventh::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-minor-seventh > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-major-seventh {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-major-seventh::before {
		display: block;
		float: left;
		padding-bottom: 53.3333333333%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-major-seventh::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-major-seventh > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-octave {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-octave::before {
		display: block;
		float: left;
		padding-bottom: 50%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-octave::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-octave > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-major-tenth {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-major-tenth::before {
		display: block;
		float: left;
		padding-bottom: 40%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-major-tenth::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-major-tenth > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-major-eleventh {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-major-eleventh::before {
		display: block;
		float: left;
		padding-bottom: 37.5%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-major-eleventh::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-major-eleventh > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-major-twelfth {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-major-twelfth::before {
		display: block;
		float: left;
		padding-bottom: 33.3333333333%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-major-twelfth::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-major-twelfth > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-double-octave {
		display: block;
		position: relative;
		width: 100%;
	}

	.ct-double-octave::before {
		display: block;
		float: left;
		padding-bottom: 25%;
		width: 0;
		height: 0;
		content: '';
	}

	.ct-double-octave::after {
		display: table;
		clear: both;
		content: '';
	}

	.ct-double-octave > svg {
		display: block;
		position: absolute;
		top: 0;
		left: 0;
	}

	.ct-label.ct-horizontal {
		width: 120px !important;
		white-space: nowrap;
	}

	.ct-area {
		fill: url('#gradient-a') !important;
	}

	.ct-point {
		opacity: 0%;
		box-shadow: 0 0 0 5px #fff;
	}

	.ct-point:hover {
		opacity: 100%;
	}

	.ct-labels span {
		display: inline-block;
		border-radius: 4px;
		background: rgb(255 255 255 / 70%);
		width: inherit !important;
		height: auto !important;
		-ms-flex-align: end !important;
		align-items: flex-end !important;
		-ms-flex-pack: start !important;
		justify-content: flex-start !important;
		text-align: left !important;
		text-anchor: start !important;
		margin-left: 5px;
		padding: 4px 5px;
	}

	.ct-labels span {
		background: rgb(0 0 0 / 50%);
	}

	.chartist-tooltip {
		display: inline-block;
		position: absolute;
		-ms-transform: scale(0.8) translateY(15px);
		transform: scale(0.8) translateY(15px);
		-ms-transform-origin: 50% 100%;
		transform-origin: 50% 100%;
		opacity: 0%;
		z-index: 1;
		transition:
			opacity 0.05s linear,
			transform 0.05s linear;
		margin-top: -5px;
		border-radius: 4px;
		background: #131a26;
		padding: 10px 15px;
		min-width: 140px;
		max-width: 280px;
		pointer-events: none;
		color: #fff;
		font-size: 16px;
		line-height: 1.2em;
	}

	.chartist-tooltip::before {
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -5px;
		border: 5px solid transparent;
		border-top-color: #131a26;
		width: 0;
		height: 0;
		content: '';
	}

	.chartist-tooltip.tooltip-show {
		-ms-transform: scale(1) translateY(0);
		transform: scale(1) translateY(0);
		opacity: 100%;
	}

	.ct-area,
	.ct-line {
		pointer-events: none;
	}

	@media (width <=640px) {
		html {
			font-size: 16px;
		}
	}

	html.compact {
		font-size: 16px;
	}

	html.dark {
		background: #131a26;
		color: #fff;
	}

	* {
		box-sizing: border-box;
	}

	#main-header {
		background: #131a26;
		padding: 45px 0 100px;
		color: #fff;
	}

	.compact #main-header {
		padding: 30px 0 60px;
	}

	@media (width <=640px) {
		#main-header {
			padding: 30px 0 60px;
		}

		#main-header.header-2 {
			padding: 30px 0 75px;
		}
	}

	.is-simple #main-header {
		padding: 45px 0;
	}

	@media (width <=640px) {
		.is-simple #main-header {
			padding: 30px 0;
		}
	}

	@media (width <=960px) {
		.psp-header-info {
			margin: 15px 0;
			width: 100%;
		}
	}

	#main-footer img {
		margin-top: -3px;
	}

	@media (width <=960px) {
		#main-footer {
			-ms-flex-pack: center;
			justify-content: center;
		}
	}

	#main-footer a {
		color: #637189 !important;
		text-decoration: none;
	}

	#main-footer a:hover {
		text-decoration: underline;
	}

	.last-update {
		opacity: 50%;
	}

	@media (width <=960px) {
		.logo-wrapper {
			-ms-flex-wrap: wrap;
			flex-wrap: wrap;
			width: 100%;
			-ms-flex-align: center;
			align-items: center;
			-ms-flex-pack: justify;
			display: flexbox;
			display: flex;
			justify-content: space-between;
		}
	}

	.header-2 .logo-wrapper {
		display: inline-block;
		margin-bottom: 25px;
		border-bottom: 1px solid rgb(170 170 170 / 50%);
		padding: 0 30px 30px;
	}

	.compact .header-2 .logo-wrapper {
		margin-bottom: 15px;
		padding: 0 15px 15px;
	}

	.header-2 .logo-wrapper > * {
		display: inline-block;
	}

	.logo-wrapper a {
		color: inherit !important;
		text-decoration: none !important;
	}

	.page-logo {
		transition: all 0.1s ease-in;
		width: 100%;
		max-width: 210px;
	}

	.compact .page-logo {
		width: auto;
		max-height: 50px;
	}

	@media (width <=960px) {
		.page-logo {
			max-width: 180px;
		}
	}

	.m-l-5 {
		margin-left: 5px;
	}

	.m-r-5 {
		margin-right: 5px;
	}

	.m-r-10 {
		margin-right: 10px;
	}

	.m-l-10 {
		margin-left: 10px;
	}

	.m-r-30 {
		margin-right: 30px;
	}

	.m-b-5 {
		margin-bottom: 5px;
	}

	.m-b-10 {
		margin-bottom: 15px;
	}

	.m-t-5 {
		margin-top: 5px;
	}

	.m-t-10 {
		margin-top: 10px;
	}

	.color-white {
		color: #fff;
	}

	.font-24 {
		font-size: 24px;
	}

	.font-21 {
		font-size: 21px;
	}

	@media (width <=640px) {
		.font-21 {
			font-size: 18px;
		}
	}

	.font-18 {
		font-size: 18px;
	}

	.font-14 {
		font-size: 14px;
	}

	.font-12 {
		font-size: 12px;
	}

	.no-underline {
		text-decoration: none !important;
	}

	.bg-white {
		background: #fff;
	}

	.icon {
		display: inline-block;
		width: 1em;
		height: 1em;
		stroke-width: 0;
		stroke: currentcolor;
		fill: currentcolor;
	}

	.card {
		box-shadow: 0 20px 60px rgb(0 0 0 / 10%);
		border-radius: 6px;
		background: #fff;
		padding: 60px;
		color: #131a26;
	}

	.compact .card {
		padding: 35px 40px;
	}

	.card {
		background: #212937;
		color: #fff;
	}

	.card *:last-child {
		margin-bottom: 0;
	}

	@media (width <=640px) {
		.card {
			padding: 30px !important;
		}
	}

	.card.is-hover {
		transition: box-shadow 0.1s ease-in;
		padding: 15px;
	}

	.card.is-hover:not(.is-shadow) {
		box-shadow: none;
	}

	.card.is-hover:hover {
		box-shadow: 0 20px 60px rgb(0 0 0 / 15%);
	}

	.dot {
		display: inline-block;
		position: relative;
		-ms-transform: none;
		transform: none;
		border-radius: 50%;
		background: #3bd671;
		width: 12px;
		height: 12px;
		color: #3bd671;
	}

	.dot::after {
		position: absolute;
		top: 0;
		left: 0;
		opacity: 100%;
		animation: pulse 2s infinite;
		border-radius: 50%;
		background: currentcolor;
		width: 100%;
		height: 100%;
		content: '';
	}

	@media (prefers-reduced-motion) {
		.dot::after {
			animation: none !important;
		}
	}

	.dot.is-big {
		width: 60px;
		height: 60px;
	}

	.dot.is-big::after {
		animation: pulseBig 2s infinite;
	}

	@media (prefers-reduced-motion) {
		.dot.is-big::after {
			animation: none !important;
		}
	}

	.compact .dot.is-big {
		width: 30px;
		height: 30px;
	}

	.dot.is-error {
		background: #df484a;
		color: #df484a;
	}

	.dot.is-warning {
		background: #f29030;
		color: #f29030;
	}

	.dot.is-grey {
		background: #637189;
		color: #637189;
	}

	.dot.is-grey::after {
		display: none;
	}

	@keyframes pulseBig {
		0% {
			opacity: 50%;
		}

		70% {
			transform: scale(1.6);
			opacity: 0%;
		}

		100% {
			opacity: 0%;
		}
	}

	@keyframes pulse {
		0% {
			opacity: 50%;
		}

		70% {
			transform: scale(2.5);
			opacity: 0%;
		}

		100% {
			opacity: 0%;
		}
	}

	#subscribe-btn {
		border-radius: 6px;
		padding: 0 16px;
		width: 46px;
	}

	.uk-button-primary:disabled {
		opacity: 70%;
		background: #3bd671;
		color: #fff;
	}

	.uk-input,
	.uk-select {
		border: 1px solid #687790;
		border-radius: 2px;
		padding: 10px 15px;
		width: 100%;
	}

	.uk-input::input-placeholder,
	.uk-select::input-placeholder {
		opacity: 50%;
		color: #687790;
	}

	.uk-input:input-placeholder,
	.uk-select:input-placeholder {
		opacity: 50%;
		color: #687790;
	}

	.uk-input::placeholder,
	.uk-select::placeholder {
		opacity: 50%;
		color: #687790;
	}

	.card .uk-input,
	.card .uk-select {
		background: rgb(0 0 0 / 20%);
		color: #fff !important;
	}

	.card .uk-input:focus,
	.card .uk-select:focus {
		background: rgb(0 0 0 / 30%);
	}

	.uk-select {
		-webkit-appearance: none;
		-moz-appearance: none;
		background-image: url('data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%2224%22%20height%3D%2216%22%20viewBox%3D%220%200%2024%2016%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%0A%20%20%20%20%3Cpolygon%20fill%3D%22%23666%22%20points%3D%2212%201%209%206%2015%206%22%20%2F%3E%0A%20%20%20%20%3Cpolygon%20fill%3D%22%23666%22%20points%3D%2212%2013%209%208%2015%208%22%20%2F%3E%0A%3C%2Fsvg%3E%0A');
		background-position: 100% 50%;
		background-repeat: no-repeat;
		padding-right: 20px;
	}

	.uk-tab {
		margin: 15px 0;
	}

	.uk-input {
		margin-top: 15px;
	}

	h1,
	.uk-h1 {
		letter-spacing: -0.02em;
	}

	.uk-button {
		transition:
			box-shadow 0.1s ease-in,
			background-color 0.1s ease-in;
		box-shadow: 0 10px 20px 0 rgb(0 0 0 / 15%);
		border-radius: 23px;
		font-weight: bold;
	}

	.uk-button:hover {
		box-shadow: 0 10px 40px 0 rgb(0 0 0 / 20%);
	}

	.uk-button-large {
		border-radius: 28px;
	}

	@media (width <=640px) {
		.uk-button-large {
			padding: 0 30px;
		}
	}

	@media (width <=359px) {
		.uk-button-large {
			padding: 0 20px;
		}
	}

	.uk-section-secondary {
		color: #fff;
	}

	.uk-section.hero {
		padding-top: 30px;
	}

	@media (width >=1920px) {
		.uk-section.hero h1,
		.uk-section.hero p {
			margin-bottom: 60px;
		}
	}

	.uk-section.hero.home {
		padding: 30px 0;
	}

	.uk-label {
		border-radius: 2px;
	}

	.uk-modal-title {
		margin-bottom: 30px;
	}

	.uk-modal-body {
		color: #131a26;
	}

	.uk-nav li {
		margin-bottom: 0;
	}

	.uk-nav .uk-nav-sub {
		margin-top: 0;
	}

	.uk-tab {
		display: flexbox;
		display: flex;
		position: relative;
		-ms-flex-wrap: wrap;
		flex-wrap: wrap;
		margin-left: -20px;
		padding: 0;
		font-size: 14px;
		list-style: none;
	}

	.uk-tab::before {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 20px;
		border-bottom: 1px solid #e6e7e8;
		content: '';
	}

	.uk-tab > * {
		position: relative;
		-ms-flex: none;
		flex: none;
		margin: 0 !important;
		padding-left: 20px;
	}

	.uk-tab > * > a {
		display: block;
		transition: color 0.1s ease-in-out;
		border-bottom: 2px solid transparent;
		padding: 9px 20px;
		color: #687790;
		font-size: 14px;
		line-height: 20px;
		text-align: center;
		text-decoration: none;
		text-transform: uppercase;
	}

	.uk-tab > *.uk-active a {
		border-color: #3bd671;
		color: #131a26;
	}

	.uk-tooltip-top-left::before {
		display: block;
		position: absolute;
		bottom: -5px;
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
		margin-left: 0;
		background: #131a26;
		width: 10px;
		height: 10px;
		content: '';
	}

	.uk-tooltip-top-center::before {
		position: absolute;
		top: 100%;
		left: 50%;
		margin-left: -5px;
		border: 5px solid transparent;
		border-top-color: #131a26;
		width: 0;
		height: 0;
		content: '';
	}

	.uk-tooltip-right-center::before {
		display: block;
		position: absolute;
		top: 50%;
		left: -4px;
		-ms-transform: rotate(45deg);
		transform: rotate(45deg);
		margin-top: -5px;
		margin-left: 0;
		background: #131a26;
		width: 10px;
		height: 10px;
		content: '';
	}

	.uk-tooltip-inner {
		word-break: break-all;
	}

	.uk-link,
	a {
		transition:
			text-shadow 0.1s ease-in,
			color 0.1s ease-in;
	}

	.uk-link:hover,
	a:hover {
		text-shadow: 0 5px 30px rgb(59 214 113 / 30%);
	}

	.uk-pagination a {
		text-decoration: none !important;
	}

	.uk-pagination .uk-active a {
		color: #fff !important;
	}

	.uk-alert {
		border-radius: 6px;
	}

	.card .uk-alert {
		color: #fff;
	}

	.uk-grid-divider > :not(.uk-first-column)::before {
		border-color: #131a26;
	}

	.uk-dropdown {
		box-shadow: 0 20px 40px 0 rgb(0 0 0 / 10%);
		border-radius: 6px;
		padding: 30px;
		max-width: 320px;
	}

	@media (width <=640px) {
		.uk-dropdown {
			width: 300px;
		}
	}

	body * {
		scrollbar-width: thin;
	}

	body *::-webkit-scrollbar {
		width: 11px;
	}

	body *::-webkit-scrollbar-thumb {
		border-radius: 6px;
	}

	html.is-fullscreen {
		scrollbar-width: thin;
	}

	html.is-fullscreen::-webkit-scrollbar {
		width: 11px;
	}

	html.is-fullscreen::-webkit-scrollbar-thumb {
		border-radius: 6px;
	}

	.psp-status {
		margin-top: -60px;
	}

	.compact .psp-status {
		margin-top: -30px;
	}

	.psp-latest-downtime {
		margin-top: 10px;
	}

	@media (width <=640px) {
		.psp-latest-downtime {
			margin-top: 15px;
		}
	}

	.psp-monitors rect {
		outline: 0 !important;
	}

	.psp-monitors rect:hover {
		opacity: 50%;
	}

	.psp-fake-uptime-bars {
		margin-bottom: 45px;
		border-radius: 6px;
		background: #e6e7e8;
		height: 30px;
	}

	.psp-fake-uptime-bars {
		background: #131a26;
	}

	.psp-fake-monitorname {
		margin-bottom: 15px;
		border-radius: 6px;
		background: #e6e7e8;
		width: 150px;
		height: 15px;
	}

	.psp-fake-monitorname {
		background: #131a26;
	}

	.psp-monitor-row {
		margin-bottom: 30px;
		border-bottom: 1px solid #e6e7e8;
		padding-bottom: 30px;
	}

	.compact .psp-monitor-row {
		margin-bottom: 15px;
		padding-bottom: 15px;
	}

	.compact .psp-monitor-row .psp-monitor-row-status {
		min-width: 70px;
		text-align: right;
	}

	.psp-monitor-row {
		border-color: #131a26;
	}

	.psp-monitor-row:last-of-type {
		margin-bottom: 0;
		border: 0;
		padding-bottom: 0;
	}

	@media (width >=640px) {
		.compact .psp-monitor-row-header {
			min-width: 280px;
			max-width: 280px;
		}
	}

	@media (width <=640px) {
		.psp-monitor-row-header {
			margin-bottom: 5px;
			width: 100%;
			-ms-flex-pack: justify;
			justify-content: space-between;
		}
	}

	.psp-monitor-row-header .icon {
		transition: color 0.2s ease-in;
		margin-top: -2px;
		color: #687790;
		font-size: 14px;
	}

	.psp-monitor-row-header .icon-help-circle {
		margin-left: 5px;
	}

	@media (width <=960px) {
		.psp-main-name-wrap {
			margin-top: 15px;
			width: 100%;
		}
	}

	@media (width <=960px) {
		.psp-main-status-wrap {
			-ms-flex-pack: center;
			justify-content: center;
			width: 100%;
		}
	}

	.compact .psp-main-status-dot {
		margin-right: 15px;
	}

	@media (width <=960px) {
		.psp-main-status-dot {
			margin-right: 0;
		}
	}

	.psp-monitor-name {
		max-width: 80%;
		color: #131a26 !important;
		text-decoration: none !important;
	}

	.psp-monitor-name {
		color: #fff !important;
	}

	.compact .psp-monitor-name {
		margin-right: 10px;
	}

	a.psp-monitor-name:hover .icon-plus-square {
		color: #3bd671 !important;
	}

	.psp-monitor-interval a {
		position: relative;
		top: 6px;
		max-width: 300px;
		color: #687790 !important;
	}

	@media (width <=640px) {
		.psp-monitor-interval a {
			top: 4px;
		}
	}

	@media (width <=640px) {
		.psp-monitor-interval {
			margin-top: 15px;
		}
	}

	@media (width <=640px) {
		.psp-calendar-link {
			margin-bottom: 15px;
		}
	}

	.psp-mon-detail-name {
		max-width: 100%;
	}

	.psp-charts {
		line-height: 0;
	}

	.psp-charts > div {
		opacity: 100%;
		transition: opacity 0.2s ease-in;
	}

	.psp-charts > div.chart-hidden {
		opacity: 0%;
		max-height: 0;
		overflow: hidden;
	}

	.compact .psp-charts {
		margin-top: 0 !important;
	}

	.psp-announcement {
		margin-bottom: 30px;
		border-bottom: 1px solid #e6e7e8;
		padding-bottom: 30px;
	}

	.compact .psp-announcement {
		margin-bottom: 20px;
		padding-bottom: 20px;
	}

	.psp-announcement {
		border-color: #131a26;
	}

	.psp-announcement:last-of-type,
	.psp-announcement.is-last {
		margin-bottom: 0;
		border: 0;
		padding-bottom: 0;
	}

	.compact .psp-announcement h4 {
		font-size: 18px;
	}

	.psp-announcement p {
		margin: 15px 0 0;
	}

	.compact .psp-announcement p {
		margin: 5px 0 0;
	}

	.psp-announcement .uk-label {
		margin-top: 5px;
	}

	.psp-announcement .uk-label {
		background: #131a26;
	}

	.psp-announcement.is-pinned {
		padding: 30px;
	}

	.psp-announcement.is-pinned p,
	.psp-announcement.is-pinned h4 {
		color: #131a26;
	}

	.psp-announcement.is-pinned p,
	.psp-announcement.is-pinned h4 {
		color: #fff;
	}

	.compact .psp-announcement.is-pinned {
		margin-top: 30px;
		padding: 20px;
	}

	@media (width <=640px) {
		.psp-announcement.is-pinned {
			padding: 15px;
		}
	}

	.compact .psp-announcement .uk-margin-small-bottom {
		margin-bottom: 5px !important;
	}

	.psp-announcement[class*='is-'] {
		position: relative;
	}

	.psp-announcement[class*='is-']::before {
		display: block;
		position: absolute;
		top: -30px;
		bottom: 0;
		left: -60px;
		width: 3px;
		content: '';
	}

	.compact .psp-announcement[class*='is-']::before {
		top: -20px;
		left: -40px;
	}

	.psp-announcement.is-info::before {
		background: #0399d7;
	}

	.psp-announcement.is-alert-triangle::before {
		background: #df484a;
	}

	.psp-announcement.is-tool::before {
		background: #f29030;
	}

	.psp-announcement-icon {
		margin-top: 4px;
		margin-right: 10px;
		font-size: 24px;
	}

	.compact .psp-announcement-icon {
		font-size: 18px;
	}

	.psp-announcement-icon.icon-info,
	.psp-announcement-icon.icon-play-circle,
	.psp-announcement-icon.icon-pause-circle {
		color: #0399d7;
	}

	.psp-announcement-icon.icon-tool {
		color: #f29030;
	}

	.psp-announcement-icon.icon-alert-triangle,
	.psp-announcement-icon.icon-arrow-down-circle {
		color: #df484a;
	}

	.psp-announcement-icon.icon-arrow-up-circle {
		color: #3bd671;
	}

	.psp-alert-reason .uk-label {
		-ms-transform: scale(0.7);
		transform: scale(0.7);
		margin-top: -2px;
		margin-left: 2px;
	}

	.psp-alert-reason.home .uk-label {
		margin-top: -14px;
	}

	.psp-alert-reason-detail.home {
		margin-top: -30px;
	}

	#chart-container {
		margin-bottom: -15px;
		height: 150px;
	}

	.calendar-prev:disabled,
	.calendar-next:disabled {
		opacity: 50%;
		cursor: default;
	}

	#calendar-monitor-chooser {
		width: 250px;
	}

	@media (width <=640px) {
		#calendar-monitor-chooser {
			margin-top: -15px;
			margin-bottom: 30px;
			width: 100%;
		}
	}

	.psp-calendar-nav.loading {
		opacity: 50%;
		cursor: wait;
		pointer-events: none;
	}

	@media (width <=640px) {
		.psp-calendar-nav {
			width: 100%;
			-ms-flex-pack: justify;
			justify-content: space-between;
		}
	}

	.select2-selection--single .select2-selection__rendered {
		padding-left: 15px !important;
		color: #131a26 !important;
		line-height: 48px !important;
	}

	.select2-selection--single .select2-selection__rendered {
		color: #fff !important;
	}

	.select2-container--default
		.select2-selection--single
		.select2-selection__arrow {
		width: 30px !important;
		height: 46px !important;
	}

	.select2-container--default
		.select2-results__option--highlighted[aria-selected] {
		background-color: #3bd671 !important;
	}

	.select2-container--default .select2-selection--single {
		height: 48px !important;
	}

	.select2-container--default .select2-selection--single {
		border-color: #131a26;
		background-color: #212937;
	}

	.select2-dropdown {
		overflow: hidden;
	}

	.select2-dropdown {
		border-color: #131a26;
		background-color: #212937;
	}

	.select2-search__field {
		border-color: #131a26 !important;
		background-color: rgb(0 0 0 / 10%);
	}

	.select2-container--default
		.select2-results__option[aria-selected='true'] {
		background-color: rgb(255 255 255 / 10%);
	}

	#floating-stats {
		position: fixed;
		right: 0;
		bottom: 0;
		left: 0;
		z-index: 99;
		box-shadow: 0 -20px 40px 0 rgb(0 0 0 / 10%);
		background: #131a26;
		padding: 7px 15px;
		color: #fff;
		font-size: 14px;
	}

	#floating-stats .card {
		box-shadow: none;
		padding-top: 0;
		padding-bottom: 0;
	}

	#ck-consent {
		position: fixed;
		bottom: 45px;
		left: 30px;
		border-radius: 30px;
		padding: 15px;
	}

	#ck-consent a,
	#ck-consent button {
		margin-left: 5px;
	}

	#ck-consent a {
		text-decoration: none;
	}

	#ck-consent a:hover {
		text-decoration: underline;
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
