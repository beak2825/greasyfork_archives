// ==UserScript==
// @name visualstudio.com - Dark Mode
// @namespace typpi.online
// @version 1.0.4
// @description Dark mode theme for Visual Studio
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.visualstudio.com/*
// @downloadURL https://update.greasyfork.org/scripts/520674/visualstudiocom%20-%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520674/visualstudiocom%20-%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
let css = `
	/* Invert colors except images and videos */
	:is(
		html:not([stylus-iframe]),
		img,
		svg,
		video,
		.upperBand,
		.upperBandContent,
		.breadcrumb
	) {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	.uxservices-header,
	.right {
		background-color: #fff;
	}

	.ux-section-banner,
	.item-details-control-root .ux-item-shortdesc,
	.verified-domain-url-ssr,
	.ux-item-publisher-link,
	.ux-item-name,
	.ux-item-second-row-wrapper,
	.installHelpInfo > a {
		background-color: #fff !important;
		color: #000 !important;
	}

	.uxservices-header > div > a {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	.marketplacetext-header {
		filter: invert(1) hue-rotate(180deg) !important;
	}

	.item-details-control-root
		.ux-section-details
		.itemdetails-section-header {
		padding-bottom: 16px;
		color: #555;
		font-weight: 700;
		font-size: 16px;
	}

	.item-details-control-root
		.ux-section-details
		.itemdetails-section-header.right {
		margin: 0;
		padding: 0 0 5px;
	}

	.item-details-control-root
		.ux-section-details
		.ux-section-details-table {
		width: 100%;
		table-layout: fixed;
	}

	.item-details-control-root .ux-itemdetails-left {
		vertical-align: top;
		padding-right: 20px;
		font-size: 14px;
	}

	.item-details-control-root .ux-itemdetails-right {
		vertical-align: top;
		padding: 0 0 0 20px;
		width: 34.45%;
	}

	@media all and (width <= 768px) {
		.item-details-control-root .ux-itemdetails-left {
			float: left;
			padding-right: 0;
			width: 100%;
		}

		.item-details-control-root .ux-itemdetails-right {
			float: left;
			padding-left: 0 !important;
			width: 100%;
		}
	}

	.item-details-control-root .ux-section-other {
		margin-top: 16px;
	}

	.item-details-control-root .ux-section-h2 > h2 {
		border-bottom: 1px solid #eee;
		padding-bottom: 10px;
		color: #5c2d91;
	}

	.download-dropbutton-container {
		display: inline-block;
		position: relative;
	}

	.download-dropbutton-arrow {
		display: inline-block;
		transform: rotate(45deg);
		margin: 0 0 2px 5px;
		border: solid white;
		border-width: 0 2px 2px 0;
		padding: 3px;
	}

	.download-dropdown-content {
		display: none;
		position: absolute;
		z-index: 1;
		margin: 5px 0 0 16px;
		box-shadow: 0 8px 16px 0 rgb(0 0 0 / 20%);
		padding: 0;
		min-width: 202px;
		text-align: left;
	}

	.download-dropdown-content li {
		display: block;
		cursor: pointer;
		background-color: #fafafa;
		padding: 12px 16px;
		color: black;
		text-decoration: none;
	}

	.download-dropdown-content li:hover {
		background-color: #f1f1f1;
	}

	.download-dropbutton-container:hover
		.download-dropdown-content {
		display: block;
	}

	.itemDetails .markdown {
		position: relative;
		color: #222;
		line-height: 1.6;
	}

	.itemDetails .markdown blockquote {
		color: #222 !important;
	}

	.itemDetails .markdown > *:first-child {
		margin-top: 0 !important;
	}

	.item-details-control-root .markdown {
		position: relative;
		color: #222;
		line-height: 1.6;
	}

	.item-details-control-root .markdown > *:first-child {
		margin-top: 0 !important;
	}

	.ux-section-details-tabs {
		margin-top: -20px;
	}

	.ux-section-details-tabs .ms-Pivot button:first-child {
		margin-left: -8px;
	}

	.ux-section-details-tabs .ms-Pivot {
		margin-bottom: 25px;
		border-bottom: 1px solid;
		border-bottom-color: rgb(200 200 200 / 100%);
		border-bottom-color: rgba(
			var(--palette-neutral-20, 200, 200, 200),
			1
		);
	}

	.ux-section-details-tabs .ms-Pivot-text {
		font-weight: 400;
		font-size: 16px;
	}

	.ux-section-details-tabs .ms-Pivot button:focus,
	.ux-section-details-tabs .ms-Pivot button:hover {
		color: #106ebe;
	}

	.meta-data-list-container
		.ux-section-meta-data-list
		.meta-data-list {
		margin-top: 3px;
	}

	.meta-data-list-container a.meta-data-list-link:hover,
	.meta-data-list-container a.meta-data-list-link:focus {
		cursor: pointer;
		border: 1px solid #0078d4;
		background-color: #0078d4;
		color: white;
	}

	.meta-data-list-container
		.ux-section-meta-data-list
		> div:nth-last-child(1) {
		padding-bottom: 16px;
	}

	.meta-data-list-container .ux-section-meta-data-list a,
	.meta-data-list-container
		.ux-section-meta-data-list
		span {
		display: inline-block;
		margin: 0 6px 4px 0;
		border: 1px solid #ddd;
		border-radius: 3px;
		padding: 4px 6px;
		color: #333;
		font-size: 13px;
	}

	.meta-data-list-container
		.ux-section-meta-data-list
		a:hover {
		text-decoration: none;
	}

	.meta-data-list-container
		.ux-section-meta-data-list
		a.tag {
		cursor: default;
		background-color: #eff1f3;
	}

	.meta-data-list-container .ux-section-header {
		padding-bottom: 16px;
		color: #555;
		font-weight: 700;
		font-size: 16px;
	}

	.meta-data-list-container .ux-section-header.right {
		margin: 0;
		padding: 0 0 5px;
	}

	.item-details-control-root .ux-table-metadata {
		margin-top: 0;
		border-collapse: collapse;
		padding: 0;
		color: #666;
		font-size: 12px;
	}

	.item-details-control-root .ux-table-metadata td {
		padding: 4px 18px 4px 0;
	}

	.badges-container {
		margin-top: 14px;
	}

	.badges-container ul li {
		margin-left: 5px;
	}

	.item-details-control-root .ux-section-project-details {
		margin-top: 16px;
	}

	.item-details-control-root
		.ux-section-project-details
		.itemdetails-section-header.right {
		margin-bottom: 8px;
		padding: 0;
	}

	.item-details-control-root
		.ux-section-project-details-spinner
		.spinner-control-root {
		margin-top: 22px;
		width: 25px;
		height: 25px;
	}

	.item-details-control-root
		.ux-section-project-details
		ul {
		margin: 0 0 0 -3px;
		padding: 0;
		list-style-type: none;
	}

	.item-details-control-root
		.ux-section-project-details
		ul
		li {
		margin-bottom: 4px;
	}

	.item-details-control-root
		.ux-section-project-details
		ul
		li
		.api-github-response.bowtie-icon {
		color: rgb(0 0 0 / 100%);
		color: rgba(var(--palette-neutral-100, 0, 0, 0), 1);
	}

	.item-details-control-root
		.ux-section-project-details
		ul
		li
		.api-github-response.bowtie-icon.bowtie-brand-github {
		margin-top: 2px;
		margin-right: 1px;
		margin-left: 4px;
	}

	.item-details-control-root
		.ux-section-project-details
		span {
		vertical-align: top;
		margin-left: 5px;
		text-align: center;
	}

	.item-details-control-root .item-share-container {
		display: inline-block;
		vertical-align: -4px;
		margin: 20px -2px;
	}

	.item-details-control-root .item-share-container a:hover {
		text-decoration: none;
	}

	.item-details-control-root .ux-social-icons span {
		margin: 10px 0;
	}

	.item-details-control-root .social-link {
		display: inline-block;
		margin: 0 2px;
		width: 23px;
		height: 23px;
	}

	.item-share-container a:focus {
		outline: none;
	}

	.item-share-container a:focus .social-link {
		outline: 1px dotted #666;
	}

	.item-details-control-root
		.ux-table-metadata
		.info-list-callout
		td {
		padding: 0 5px 0 0;
	}

	.item-details-control-root
		.ux-table-metadata
		.info-list-callout
		.info-icon {
		margin-top: 1px;
		width: 15px;
		height: 15px;
	}

	.item-details-control-root
		.ux-table-metadata
		.info-list-callout
		.info-icon
		.ms-Button-icon {
		font-size: 12px;
	}

	.row-callout .callout-container {
		margin: 10px;
		max-width: 200px;
		font-size: 12px;
	}

	.report-abuse-callout .ms-Callout-beak {
		background-color: rgb(43 136 216 / 100%);
		background-color: rgba(
			var(--palette-primary-tint-10, 43, 136, 216),
			1
		);
	}

	.report-abuse-callout .callout-container {
		background-color: rgb(43 136 216 / 100%);
		background-color: rgba(
			var(--palette-primary-tint-10, 43, 136, 216),
			1
		);
		padding: 20px;
		color: white;
	}

	.report-abuse-callout
		.callout-container
		.report-abuse-callout-header {
		padding-bottom: 15px;
		font-weight: 200;
		font-size: 20px;
	}

	.report-abuse-callout
		.callout-container
		.report-abuse-callout-header
		.report-abuse-heading {
		display: inline-block;
		padding-left: 10px;
	}

	.calculator-container .currency-dropdown {
		width: 200px;
	}

	.calculator-container
		.currency-container
		.currency-header {
		margin-bottom: 10px;
	}

	.calculator-container .calculator-header {
		margin-top: 0;
		margin-bottom: 10px;
	}

	.calculator-container .quantity-price {
		display: flex;
		margin-top: 20px;
	}

	.calculator-container .quantity-price .quantity-header {
		margin-bottom: 10px;
	}

	.calculator-container .quantity-price .quantity-dropdown {
		width: 90px;
	}

	.calculator-container .quantity-price .price-section {
		margin-left: 60px;
	}

	.calculator-container
		.quantity-price
		.price-section
		.price-header {
		margin-bottom: 10px;
	}

	.ms-Dialog.gallery-dialog.oneclick-install-popup
		.ms-Dialog-main {
		width: 425px;
		max-width: 425px;
	}

	.ms-Dialog.gallery-dialog.oneclick-install-popup
		.ms-Dialog-main
		.ms-Dialog--lgHeader
		.ms-Dialog-title {
		font-size: 21px;
	}

	.ms-Dialog.gallery-dialog.oneclick-install-popup
		.ms-Dialog-main
		.ms-Dialog-inner
		.ms-Dialog-content {
		margin-top: 15px;
	}

	.ms-Dialog.gallery-dialog.oneclick-install-popup
		.ms-Dialog-main
		.ms-Dialog-inner
		.ms-Dialog-content
		.vscode-download-link {
		margin-left: 5px;
	}

	.ms-Dialog.gallery-dialog.oneclick-install-popup
		.ms-Dialog-main
		.ms-Dialog-inner
		.ms-Dialog-content
		.ms-Checkbox {
		margin-top: 20px;
	}

	.item-details-control-root .ux-section-resources ul li {
		margin-bottom: 4px;
	}

	.item-details-control-root .ux-section-resources ul {
		margin: 0;
		padding: 0;
		list-style-type: none;
	}

	.item-details-control-root
		.ux-section-resources
		ul
		.download-specific-version {
		border: 2px solid rgb(0 0 0 / 90%);
		border: 2px solid
			var(--text-primary-color, rgb(0 0 0 / 90%));
		background-color: transparent;
		width: 50%;
		color: rgb(0 0 0 / 90%);
		color: var(--text-primary-color, rgb(0 0 0 / 90%));
	}

	.item-details-control-root .ux-section-resources {
		margin-top: 16px;
	}

	.copied-display-container {
		position: relative;
		float: right;
		margin-left: 10px;
	}

	.copyID-display-div {
		display: none;
		position: absolute;
		left: 50px;
		border: 1px solid #ffffff;
		border-radius: 5px;
		background-color: #000000;
		padding: 2px 4px;
		width: 120px;
		color: #ffffff;
		font-size: 11px;
		text-align: center;
	}

	.item-details-download-dropbutton-container {
		display: inline-block;
		position: relative;
	}

	.item-details-download-dropbutton-container
		.item-details-download-button {
		border: none;
		padding: 0;
	}

	.item-details-download-dropbutton {
		cursor: pointer;
		padding: 0;
		color: #0078d4;
		font-weight: 400;
		font-size: 14px;
	}

	.item-details-download-dropdown-content {
		display: none;
		position: absolute;
		z-index: 1;
		margin: 5px 0 0 16px;
		box-shadow: 0 8px 16px 0 rgb(0 0 0 / 20%);
		background-color: white;
		padding: 0;
		min-width: 160px;
	}

	.item-details-download-dropdown-content li {
		display: block;
		cursor: pointer;
		background-color: white;
		padding: 12px 16px;
		color: black;
		text-decoration: none;
	}

	.item-details-download-dropbutton-arrow {
		display: inline-block;
		transform: rotate(45deg);
		margin: 0 0 2px 5px;
		border: solid #0078d4;
		border-width: 0 1px 1px 0;
		padding: 3px;
	}

	#item-details-download-dropdown-list {
		margin-bottom: 0;
	}

	.item-details-download-dropdown-content li:hover {
		background-color: #f1f1f1;
	}

	.item-details-download-dropbutton-container:hover
		.item-details-download-dropdown-content {
		display: block;
	}

	.item-details-control-root
		.ux-section-media
		.item-carousel
		> div
		> div {
		padding-bottom: 16px;
	}

	.item-details-control-root
		.ux-section-media
		.carousel-wrapper {
		border: 1px solid #b0bec5;
		height: 247.5px;
	}

	.item-details-control-root
		.ux-section-media
		.item-carousel-container {
		width: auto;
	}

	.item-details-control-root
		.ux-section-media
		.item-screenshot {
		width: 370px;
		height: 225px;
	}

	.item-details-control-root
		.item-carousel-container
		.carousel-nav {
		display: none;
	}

	.item-details-control-root
		.item-carousel-container
		.carousel {
		cursor: pointer;
	}

	.item-details-screenshot-popup {
		position: fixed;
	}

	.item-details-screenshot-popup .img-screenshot {
		max-width: 80vw;
		min-height: 0;
		max-height: 80vh;
	}

	.item-details-screenshot-popup .ms-Dialog-main {
		max-width: none;
		max-height: none;
	}

	.ux-section-details-tabs .version-history-top-container {
		width: 100%;
	}

	.version-history-top-container {
		display: inline-block;
		margin-bottom: 34px;
	}

	.version-history-top-container
		.version-history-header-container {
		padding-left: 0;
	}

	.version-history-top-container .version-history-table {
		margin-bottom: 22px;
		border-bottom: 1px solid;
		border-width: 1px 0;
		border-bottom-color: rgb(234 234 234 / 100%);
		border-bottom-color: rgba(
			var(--palette-neutral-8, 234, 234, 234),
			1
		);
		border-collapse: collapse;
		border-spacing: 0;
		padding-bottom: 10px;
		width: 60%;
		font-size: 14px;
	}

	.version-history-top-container
		.version-history-table-thead {
		display: table-header-group;
		border-color: inherit;
		width: 100%;
		text-align: left;
	}

	.version-history-top-container
		.version-history-table-body
		tr:hover {
		background-color: #d9edf7;
	}

	.version-history-top-container
		.version-history-table-body {
		display: table-row-group;
	}

	.version-history-top-container
		.version-history-container-row {
		border-bottom: 1px solid #d3d3d3;
		border-width: 1px 0;
		border-collapse: collapse;
		padding-bottom: 10px;
		width: 100%;
		height: 40px;
	}

	.version-history-top-container
		.version-history-container-column {
		display: inline-block;
		padding-top: 10px;
		width: 33%;
		text-align: left;
	}

	.version-history-top-container
		.bowtie-status-info-outline::before {
		content: '\\EA09';
	}

	.version-history-top-container
		.vh-redirection-message-bar-container {
		margin-bottom: 14px;
		background-color: rgb(244 244 244 / 100%);
		background-color: rgba(
			var(--palette-neutral-4, 244, 244, 244),
			1
		);
		padding-top: 15px;
		padding-bottom: 15px;
		width: 60%;
		color: rgb(0 0 0 / 90%);
		color: var(--text-primary-color, rgb(0 0 0 / 90%));
	}

	.version-history-top-container
		.vh-redirection-message-bar-container
		.vh-redirection-message-bar {
		font-size: 14px;
	}

	.version-history-top-container
		.vh-redirection-message-bar-container
		.vh-redirection-message-bar
		.vh-redirection-info-icon {
		padding-right: 8px;
		padding-left: 8px;
		color: rgb(0 0 0 / 90%);
		color: var(--text-primary-color, rgb(0 0 0 / 90%));
	}

	.version-history-top-container
		.vh-redirection-message-bar-container
		.vh-redirection-message-bar
		.vh-redirection-info-text {
		color: #006cbe;
	}

	.version-history-top-container
		.vh-redirection-message-bar-container
		.vh-redirection-message-bar
		.vh-redirection-info-text-anchor-tag {
		color: #006cbe;
	}

	.version-history-download-dropbutton-container {
		display: inline-block;
		position: relative;
	}

	.version-history-download-dropbutton {
		cursor: pointer;
		padding: 16px;
		color: black;
		font-weight: 600;
		font-size: 14px;
	}

	.version-history-download-dropdown-content {
		display: none;
		position: absolute;
		z-index: 1;
		margin: 5px 0 0 16px;
		box-shadow: 0 8px 16px 0 rgb(0 0 0 / 20%);
		padding: 0;
		min-width: 160px;
	}

	.version-history-download-dropdown-content li {
		display: block;
		cursor: pointer;
		background-color: #fafafa;
		padding: 12px 16px;
		color: black;
		text-decoration: none;
	}

	.version-history-download-dropbutton-arrow {
		display: inline-block;
		transform: rotate(45deg);
		margin: 0 0 2px 5px;
		border: solid black;
		border-width: 0 2px 2px 0;
		padding: 3px;
	}

	.version-history-download-dropdown-content li:hover {
		background-color: #f1f1f1;
	}

	.version-history-download-dropbutton-container:hover
		.version-history-download-dropdown-content {
		display: block;
	}

	h1.vss-HubTitle {
		display: flex;
		align-items: center;
		margin: 0 12px 0 8px;
		height: 38px;
		font-weight: 300;
		font-size: 18px;
	}

	h1.vss-HubTitle .vss-HubTitle-titleIcon {
		margin-right: 8px;
		font-size: 18px;
	}

	.vss-contextualMenu-list {
		max-width: 300px;
	}

	.vss-ContextualMenu--container {
		display: inline-block;
	}

	.vss-ContextualMenu--container
		.ms-Button.vss-ContextualMenuButton {
		border: none;
		padding: 0;
		width: 32px;
		min-width: 32px;
		max-width: 32px;
		height: 32px;
	}

	.vss-ContextualMenu--container
		.ms-Button.vss-ContextualMenuButton:focus.space-unallocated,
	.vss-ContextualMenu--container
		.ms-Button.vss-ContextualMenuButton.open.space-unallocated {
		display: inline-block;
	}

	.vss-ContextualMenu--container
		.ms-Button.vss-ContextualMenuButton:focus.space-allocated,
	.vss-ContextualMenu--container
		.ms-Button.vss-ContextualMenuButton.open.space-allocated {
		visibility: visible;
	}

	.vss-DateTimePicker {
		display: flex;
		flex-direction: row;
		width: 280px;
	}

	.vss-DateTimePicker .vss-DateTimePicker--dateField {
		width: 50%;
	}

	.vss-DateTimePicker .vss-DateTimePicker--timeField {
		padding-left: 4px;
		width: 50%;
	}

	.vss-FilterBar {
		display: flex;
	}

	.vss-FilterBar .vss-FilterBar--list {
		display: flex;
		flex-wrap: nowrap;
		align-items: flex-start;
		padding-left: 0;
		width: 100%;
	}

	.vss-FilterBar .vss-FilterBar--list .vss-FilterBar--item {
		flex-shrink: 0;
		margin-right: 10px;
		margin-bottom: 10px;
		min-width: 200px;
		max-width: 100%;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--item
		input::-ms-clear {
		display: none;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--item
		.ms-TextField {
		margin-bottom: 0;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--item
		.vss-PickListDropdown {
		width: 200px;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--item
		.vss-FilterBar--item-text
		input,
	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--item
		.vss-FilterBar--item-keyword
		input,
	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--item
		.vss-FilterBar--item-keyword
		div {
		background-color: transparent;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--item
		.vss-FilterBar--item-keyword
		input {
		padding-left: 2px;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--item
		.clear-filter-input {
		align-self: center;
		cursor: pointer;
		margin-right: 10px;
		padding: 2px;
		color: #666;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--item-keyword {
		width: 240px;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items {
		display: flex;
		flex-shrink: 0;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items.vss-FilterBar--right-items-align-right {
		margin-left: auto;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--action {
		margin-bottom: 10px;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--action.vss-FilterBar--action-apply
		.ms-Icon {
		font-size: 14px;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--action.vss-FilterBar--action-clear {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--action
		.vss-FilterBar--filter-count {
		display: flex;
		justify-content: center;
		align-items: center;
		border-radius: 50%;
		background-color: #f4f4f4;
		width: 25px;
		height: 20px;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--action.vss-FilterBar--action-clear
		.ms-Icon {
		font-size: 14px;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--action
		button {
		height: 32px;
		overflow: visible;
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-FilterBar
			.vss-FilterBar--list
			.vss-FilterBar--right-items
			.vss-FilterBar--action
			button {
			border-color: Background;
		}
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--action
		button[disabled] {
		border: none;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--page-button-container {
		display: flex;
		margin-bottom: 10px;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--page-button-container
		.vss-FilterBar-page-button {
		margin-right: 10px;
		width: 32px;
		min-width: 32px;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--page-button-container
		.vss-FilterBar-page-button
		.ms-Button-flexContainer {
		flex-direction: column;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--page-button-container
		.vss-FilterBar-page-button:not([disabled]) {
		border-color: #c8c8c8;
		background-color: #fff;
	}

	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--page-button-container
		.vss-FilterBar-page-button:not([disabled]):hover,
	.vss-FilterBar
		.vss-FilterBar--list
		.vss-FilterBar--right-items
		.vss-FilterBar--page-button-container
		.vss-FilterBar-page-button:not([disabled]):focus {
		border-color: #666;
	}

	.vss-DateTimeRangePicker .vss-DateTimeRangePicker--label {
		float: left;
		padding-left: 8px;
		width: 80px;
		line-height: 30px;
	}

	.vss-FileInput .vss-FileInput-dragDropLabel {
		vertical-align: middle;
		font-size: 12px;
		text-align: right;
	}

	.vss-FileInput .vss-FileInput-filesDropTarget {
		border: 1px dashed #c8c8c8;
		background-color: #eaeaea;
		padding-top: 15px;
		padding-bottom: 15px;
		color: #666;
		text-align: center;
	}

	.vss-FileInput .vss-FileInput-browseContainer {
		display: inline-block;
		cursor: pointer;
		margin-left: 20px;
		border: 1px solid #c8c8c8;
		border-radius: 0;
		background-color: #fff;
		padding: 5px 15px;
		color: #212121;
	}

	.vss-FileInput .vss-FileInput-browseContainer:hover {
		text-decoration: none;
	}

	.vss-focus-visible
		.vss-FileInput
		.vss-FileInput-browseContainer:focus {
		outline: 1px solid #212121;
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-focus-visible
			.vss-FileInput
			.vss-FileInput-browseContainer:focus {
			outline: 1px dashed windowtext !important;
		}
	}

	@media screen and (-ms-high-contrast: active) and (-ms-high-contrast: white-on-black) {
		.vss-focus-visible
			.vss-FileInput
			.vss-FileInput-browseContainer:focus {
			outline: 1px dashed #002033 !important;
		}
	}

	@media screen and (-ms-high-contrast: active) and (-ms-high-contrast: black-on-white) {
		.vss-focus-visible
			.vss-FileInput
			.vss-FileInput-browseContainer:focus {
			outline: 1px dashed #fff !important;
		}
	}

	.vss-FileInput .vss-FileInput-dragDropTable {
		display: flex;
		justify-content: space-between;
		align-items: center;
		width: 100%;
	}

	.vss-FileInput .vss-FileInput-browseButton {
		padding-right: 10px;
		padding-left: 10px;
		text-align: left;
	}

	.vss-FileInput-filesDropTarget.vss-FileInput-dragOver {
		background-color: #dff6dd !important;
	}

	.vss-FileInput
		.vss-FileInput-fileList
		.vss-FileInput-detailsContainer
		.vss-FileInput-status {
		color: #666;
	}

	.vss-FileInput
		.vss-FileInput-fileList
		.vss-FileInput-detailsContainer
		.vss-FileInput-links {
		margin-left: 10px;
	}

	.vss-FileInput
		.vss-FileInput-fileList
		.vss-FileInput-fileName {
		font-size: 14px;
	}

	.vss-FileInput .vss-FileInput-fileList > li {
		margin-bottom: 5px;
		list-style: none;
	}

	.vss-FileInput .vss-FileInput-fileList {
		display: none;
		padding-left: 0;
		max-height: 100px;
		overflow-y: scroll;
	}

	.vss-FileInput .vss-FileInput-overallStatusContainer {
		margin-top: 10px;
		color: #666;
		text-align: center;
	}

	.vss-FileInput
		.vss-FileInput-overallStatusContainer
		.vss-FileInput-overallStatusActions {
		margin-left: 10px;
	}

	.vss-PickList {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.vss-PickList .vss-PickList--focusContainer {
		display: flex;
		flex-direction: column;
		overflow: hidden;
	}

	.vss-PickList .ms-ChoiceFieldGroup {
		display: flex;
	}

	.vss-PickList
		.ms-ChoiceFieldGroup
		.ms-ChoiceFieldGroup-flexContainer {
		display: flex;
		flex: 1;
	}

	.vss-PickList .ms-ChoiceFieldGroup .ms-ChoiceField {
		flex: 1;
	}

	.vss-PickList
		.ms-ChoiceFieldGroup
		.ms-ChoiceField:first-child {
		margin-left: 5px;
	}

	.vss-PickList
		.ms-ChoiceFieldGroup
		.ms-ChoiceField::last-child {
		margin-right: 5px;
	}

	.vss-PickList .vss-PickList--noItemsText {
		text-align: center;
	}

	.vss-PickList .vss-PickList--searchTextField {
		margin: 8px 6px;
	}

	.vss-PickList .vss-PickList--searchTextField input {
		background-color: transparent;
	}

	.vss-PickList
		.vss-PickList--searchTextField
		input::-ms-clear {
		display: none;
	}

	.vss-PickList
		.vss-PickList--searchTextField
		.clear-filter-input {
		align-self: center;
		cursor: pointer;
		margin-right: 10px;
		padding: 2px;
		color: #666;
	}

	.vss-PickList
		.vss-PickList--searchTextField
		.ms-TextField-fieldGroup {
		display: flex;
	}

	.vss-PickList
		.vss-PickList--searchTextField
		.ms-TextField-fieldGroup
		input {
		flex-grow: 1;
		width: 0;
	}

	.vss-PickList .vss-PickList--items {
		overflow: auto;
	}

	.vss-PickList
		.vss-PickList--items
		.vss-PickList--groupHeader {
		padding-right: 10px;
		padding-left: 10px;
		color: #71afe5;
		font-size: 11px;
	}

	.vss-PickList
		.vss-PickList--items
		.vss-PickList--groupSeparator {
		border: 1px solid #eaeaea;
	}

	.vss-PickList
		.vss-PickList--items
		.vss-PickList--message {
		margin-bottom: 8px;
		padding-right: 10px;
		padding-left: 10px;
		color: #767676;
	}

	.vss-PickList
		.vss-PickList--items
		.vss-PickList--loading {
		padding: 12px;
	}

	.vss-PickList .vss-PickList--row,
	.vss-PickList .vss-PickList--action {
		position: relative;
		cursor: pointer;
	}

	.ms-Fabric.is-focusVisible
		.vss-PickList
		.vss-PickList--row:focus,
	.ms-Fabric.is-focusVisible
		.vss-PickList
		.vss-PickList--action:focus {
		outline: none;
		background-color: #f4f4f4;
	}

	@media screen and (-ms-high-contrast: active) {
		.ms-Fabric.is-focusVisible
			.vss-PickList
			.vss-PickList--row:focus,
		.ms-Fabric.is-focusVisible
			.vss-PickList
			.vss-PickList--row:focus
			.ms-Button-label,
		.ms-Fabric.is-focusVisible
			.vss-PickList
			.vss-PickList--action:focus,
		.ms-Fabric.is-focusVisible
			.vss-PickList
			.vss-PickList--action:focus
			.ms-Button-label {
			font-weight: 700;
		}
	}

	.ms-Fabric.is-focusVisible
		.vss-PickList
		.vss-PickList--row:focus::after,
	.ms-Fabric.is-focusVisible
		.vss-PickList
		.vss-PickList--action:focus::after {
		position: absolute;
		inset: 0;
		border: 1px solid #212121;
		pointer-events: none;
		content: '';
	}

	@media screen and (-ms-high-contrast: active) {
		.ms-Fabric.is-focusVisible
			.vss-PickList
			.vss-PickList--row:focus::after,
		.ms-Fabric.is-focusVisible
			.vss-PickList
			.vss-PickList--action:focus::after {
			border-color: #1aebff;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.ms-Fabric.is-focusVisible
			.vss-PickList
			.vss-PickList--row:focus::after,
		.ms-Fabric.is-focusVisible
			.vss-PickList
			.vss-PickList--action:focus::after {
			border-color: #37006e;
		}
	}

	.vss-PickList .vss-PickList--row:active,
	.vss-PickList .vss-PickList--row:focus,
	.vss-PickList .vss-PickList--action:active,
	.vss-PickList .vss-PickList--action:focus {
		outline: none;
	}

	.vss-PickList .vss-PickList--row.disabled,
	.vss-PickList .vss-PickList--action.disabled {
		cursor: default;
	}

	.vss-PickList .vss-PickList--action-tooltip {
		width: 100%;
	}

	.vss-PickList .vss-PickList--element {
		display: flex;
		flex-direction: row;
		align-items: center;
		overflow: hidden;
	}

	.vss-PickList .vss-PickList--element:hover {
		background-color: #f4f4f4;
		color: #212121;
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickList .vss-PickList--element:hover {
			border-color: #1aebff;
			background-color: #1aebff;
			color: HighlightText;
		}

		.vss-PickList .vss-PickList--element:hover:focus {
			border-color: #000;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList .vss-PickList--element:hover {
			border-color: #37006e;
			background-color: #37006e;
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: active),
		screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList .vss-PickList--element:hover {
			-ms-high-contrast-adjust: none;
		}
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickList
			.vss-PickList--element:hover
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButton-text {
			border-color: #1aebff;
			background-color: #1aebff;
			color: HighlightText;
		}

		.vss-PickList
			.vss-PickList--element:hover
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButton-text:focus {
			border-color: #000;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList
			.vss-PickList--element:hover
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButton-text {
			border-color: #37006e;
			background-color: #37006e;
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: active),
		screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList
			.vss-PickList--element:hover
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButton-text {
			-ms-high-contrast-adjust: none;
		}
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickList
			.vss-PickList--element:hover
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButtonIcon {
			border-color: #1aebff;
			background-color: #1aebff;
			color: HighlightText;
		}

		.vss-PickList
			.vss-PickList--element:hover
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButtonIcon:focus {
			border-color: #000;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList
			.vss-PickList--element:hover
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButtonIcon {
			border-color: #37006e;
			background-color: #37006e;
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: active),
		screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList
			.vss-PickList--element:hover
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButtonIcon {
			-ms-high-contrast-adjust: none;
		}
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickList .vss-PickList--element:hover a,
		.vss-PickList .vss-PickList--element:hover a:hover,
		.vss-PickList .vss-PickList--element:hover a:visited {
			border-color: #1aebff;
			background-color: #1aebff;
			color: HighlightText;
		}

		.vss-PickList .vss-PickList--element:hover a:focus,
		.vss-PickList
			.vss-PickList--element:hover
			a:hover:focus,
		.vss-PickList
			.vss-PickList--element:hover
			a:visited:focus {
			border-color: #000;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList .vss-PickList--element:hover a,
		.vss-PickList .vss-PickList--element:hover a:hover,
		.vss-PickList .vss-PickList--element:hover a:visited {
			border-color: #37006e;
			background-color: #37006e;
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: active),
		screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList .vss-PickList--element:hover a,
		.vss-PickList .vss-PickList--element:hover a:hover,
		.vss-PickList .vss-PickList--element:hover a:visited {
			-ms-high-contrast-adjust: none;
		}
	}

	.vss-PickList .vss-PickList--element:active {
		background-color: #f4f4f4;
		color: #212121;
	}

	.vss-PickList .vss-PickList--element.disabled {
		cursor: default;
		background: #fff;
		color: #a6a6a6;
	}

	.vss-PickList
		.vss-PickList--element.disabled
		.vss-PickList--selectableElementButton
		.vss-PickList--selectableElementButtonIcon {
		color: #a6a6a6;
	}

	.vss-PickList
		.vss-PickList--element.disabled
		.vss-PickList--selectableElementButton:hover,
	.vss-PickList
		.vss-PickList--element.disabled
		.vss-PickList--selectableElementButton:active {
		color: #a6a6a6;
	}

	.vss-PickList
		.vss-PickList--element.disabled
		.vss-PickList--selectableElementButton:hover
		.vss-PickList--selectableElementButtonIcon,
	.vss-PickList
		.vss-PickList--element.disabled
		.vss-PickList--selectableElementButton:active
		.vss-PickList--selectableElementButtonIcon {
		color: #a6a6a6;
	}

	.vss-PickList .vss-PickList--element .vss-IndicatorSet {
		flex-shrink: 0;
	}

	.vss-PickList
		.vss-PickList--element
		.vss-PickList--selectableElementButton {
		display: flex;
		flex-grow: 1;
		align-items: center;
		outline: transparent;
		border: none;
		padding: 0 0 0 8px;
		height: 34px;
		overflow: hidden;
		color: #333;
		text-decoration: none;
	}

	.vss-PickList
		.vss-PickList--element
		.vss-PickList--selectableElementButton:visited {
		color: #333;
	}

	.vss-PickList
		.vss-PickList--element
		.vss-PickList--selectableElementButton
		.vss-PickList--selectableElementButtonIcon {
		flex-shrink: 0;
		margin-right: 8px;
		margin-left: 0;
		height: 16px;
		font-size: 16px;
	}

	.vss-PickList
		.vss-PickList--element
		.vss-PickList--selectableElementButton
		.vss-PickList--selectableElementButton-textContainer {
		flex-grow: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vss-PickList
		.vss-PickList--element
		.vss-PickList--selectableElementButton
		.vss-PickList--selectableElementButton-textContainer
		.vss-PickList--selectableElementButton-text {
		white-space: nowrap;
	}

	.vss-PickList
		.vss-PickList--element
		.vss-PickList--selectableElementButton:hover,
	.vss-PickList
		.vss-PickList--element
		.vss-PickList--selectableElementButton:active {
		color: #212121;
	}

	.vss-PickList
		.vss-PickList--element
		.vss-PickList--selectableElementButton:hover
		.vss-PickList--selectableElementButtonIcon,
	.vss-PickList
		.vss-PickList--element
		.vss-PickList--selectableElementButton:active
		.vss-PickList--selectableElementButtonIcon {
		color: #212121;
	}

	.vss-PickList .vss-PickList--element.is-selected {
		background-color: #dadada;
	}

	.vss-PickList .vss-PickList--element.is-selected:hover {
		background-color: #dadada;
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickList .vss-PickList--element.is-selected:hover {
			border-color: #1aebff;
			background-color: #1aebff;
			color: HighlightText;
		}

		.vss-PickList
			.vss-PickList--element.is-selected:hover:focus {
			border-color: #000;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList .vss-PickList--element.is-selected:hover {
			border-color: #37006e;
			background-color: #37006e;
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: active),
		screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList .vss-PickList--element.is-selected:hover {
			-ms-high-contrast-adjust: none;
		}
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickList .vss-PickList--element.is-selected {
			border-color: #1aebff;
			background-color: #1aebff;
			color: HighlightText;
		}

		.vss-PickList .vss-PickList--element.is-selected:focus {
			border-color: #000;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList .vss-PickList--element.is-selected {
			border-color: #37006e;
			background-color: #37006e;
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: active),
		screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList .vss-PickList--element.is-selected {
			-ms-high-contrast-adjust: none;
		}
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickList
			.vss-PickList--element.is-selected
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButton-text {
			border-color: #1aebff;
			background-color: #1aebff;
			color: HighlightText;
		}

		.vss-PickList
			.vss-PickList--element.is-selected
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButton-text:focus {
			border-color: #000;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList
			.vss-PickList--element.is-selected
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButton-text {
			border-color: #37006e;
			background-color: #37006e;
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: active),
		screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList
			.vss-PickList--element.is-selected
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButton-text {
			-ms-high-contrast-adjust: none;
		}
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickList
			.vss-PickList--element.is-selected
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButtonIcon {
			border-color: #1aebff;
			background-color: #1aebff;
			color: HighlightText;
		}

		.vss-PickList
			.vss-PickList--element.is-selected
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButtonIcon:focus {
			border-color: #000;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList
			.vss-PickList--element.is-selected
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButtonIcon {
			border-color: #37006e;
			background-color: #37006e;
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: active),
		screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList
			.vss-PickList--element.is-selected
			.vss-PickList--selectableElementButton
			.vss-PickList--selectableElementButtonIcon {
			-ms-high-contrast-adjust: none;
		}
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickList .vss-PickList--element.is-selected a,
		.vss-PickList
			.vss-PickList--element.is-selected
			a:hover,
		.vss-PickList
			.vss-PickList--element.is-selected
			a:visited {
			border-color: #1aebff;
			background-color: #1aebff;
			color: HighlightText;
		}

		.vss-PickList
			.vss-PickList--element.is-selected
			a:focus,
		.vss-PickList
			.vss-PickList--element.is-selected
			a:hover:focus,
		.vss-PickList
			.vss-PickList--element.is-selected
			a:visited:focus {
			border-color: #000;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList .vss-PickList--element.is-selected a,
		.vss-PickList
			.vss-PickList--element.is-selected
			a:hover,
		.vss-PickList
			.vss-PickList--element.is-selected
			a:visited {
			border-color: #37006e;
			background-color: #37006e;
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: active),
		screen and (-ms-high-contrast: black-on-white) {
		.vss-PickList .vss-PickList--element.is-selected a,
		.vss-PickList
			.vss-PickList--element.is-selected
			a:hover,
		.vss-PickList
			.vss-PickList--element.is-selected
			a:visited {
			-ms-high-contrast-adjust: none;
		}
	}

	.vss-PickList .vss-PickList--actions {
		border-top: 1px solid #eaeaea;
	}

	.vss-PickList
		.vss-PickList--actions
		.vss-PickList--action {
		overflow: hidden;
	}

	.vss-PickList
		.vss-PickList--actions
		.vss-PickList--action:focus,
	.vss-PickList
		.vss-PickList--actions
		.vss-PickList--action:hover {
		background-color: #f4f4f4;
		color: #212121;
	}

	.vss-PickList
		.vss-PickList--actions
		.vss-PickList--action
		.vss-PickList--selectableElementButton {
		border: none;
		width: 100%;
		height: 34px;
	}

	.vss-PickList .vss-PickList--multiSelectableElement {
		display: flex;
		overflow: hidden;
	}

	.vss-PickList
		.vss-PickList--multiSelectableElement:focus {
		outline: none;
	}

	.vss-PickList
		.vss-PickList--multiSelectableElement
		.vss-PickList--checkbox {
		flex-shrink: 0;
		margin: 0 8px 0 5px;
		min-height: 34px;
	}

	.vss-PickList
		.vss-PickList--multiSelectableElement
		.vss-PickList--checkbox[disabled] {
		border: none;
	}

	.vss-PickList
		.vss-PickList--multiSelectableElement
		.vss-PickList--multiSelectIcon {
		margin-right: 5px;
		overflow: visible;
	}

	.vss-PickList
		.vss-PickList--multiSelectableElement
		.vss-PickList--multiSelectIcon
		.ms-Image
		.ms-Image-image {
		width: 24px;
		height: 24px;
	}

	.vss-PickList
		.vss-PickList--multiSelectableElement
		.vss-PickList--multiSelectTextContainer {
		flex-grow: 1;
		margin-right: 5px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vss-PickList
		.vss-PickList--multiSelectableElement
		.vss-PickList--multiSelectTextContainer
		.vss-PickList--multiSelectText {
		padding-top: 8px;
		height: 34px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.vss-PickList
		.vss-PickList--multiSelectableElement
		.vss-PickList--multiSelectTextContainer
		.vss-PickList--multiSelectText.disabled {
		color: #a6a6a6;
	}

	.vss-PickList.item-picker-list
		.vss-PickList--items
		.vss-PickList--groupHeader {
		padding: 30px 0 10px;
		color: #767676;
		font-size: inherit;
	}

	.vss-PickList.item-picker-list
		.vss-PickList--items
		.vss-PickList--groupHeader.first-group {
		padding-top: 0;
	}

	.vss-PickList.item-picker-list
		.vss-PickList--items
		.vss-PickList--row {
		border-top: 1px solid #f4f4f4;
	}

	.vss-PickList.item-picker-list
		.vss-PickList--items
		.vss-PickList--row.first-in-group {
		border-top: none;
	}

	.vss-PickList.item-picker-list
		.vss-PickList--searchTextField {
		margin: 0 0 20px;
		max-width: 400px;
	}

	.vss-IndicatorSet {
		display: flex;
		margin: 1px;
	}

	.vss-IndicatorSet .vss-ItemIndicator {
		flex-shrink: 0;
		align-self: center;
	}

	.vss-IndicatorSet .vss-ItemIndicator button {
		overflow: visible;
	}

	.vss-PickListDropdown--title {
		display: flex;
		position: relative;
		cursor: pointer;
		border: 1px solid #c8c8c8;
		background: #fff;
		padding: 0 5px;
		height: 32px;
		overflow: hidden;
		font-size: 14px;
		line-height: 30px;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.vss-PickListDropdown--title:hover {
		border-color: #767676;
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickListDropdown--title:hover {
			border-color: #1aebff;
		}
	}

	.vss-PickListDropdown--title.vss-PickListDropdown--placeholder {
		color: #666;
	}

	.vss-PickListDropdown--title.disabled {
		cursor: default;
		border-color: #f4f4f4;
		background-color: #f4f4f4;
		color: #a6a6a6;
	}

	.vss-PickListDropdown--title:focus,
	.vss-PickListDropdown--title.focused {
		outline: none;
		border-color: #0078d4;
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PickListDropdown--title:focus,
		.vss-PickListDropdown--title.focused {
			border-color: #1aebff;
		}
	}

	.vss-PickListDropdown--title
		.vss-PickListDropdown--title-caretIcon {
		margin: 0 5px;
		font-size: 14px;
	}

	.vss-PickListDropdown--title
		.vss-PickListDropdown--title-checkIcon {
		margin: 0 5px;
		color: #0078d4;
	}

	.vss-PickListDropdown--title
		.vss-PickListDropdown--title-textContainer {
		left: 12px;
		flex-grow: 1;
		margin: 0 5px;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vss-PickListDropdown--title
		.vss-PickListDropdown--title-textContainer
		.vss-PickListDropdown--title-text-withSelections {
		font-weight: 600;
	}

	.vss-PickListDropdown--list .vss-PickList--items {
		max-height: 270px;
	}

	body .vss-PickListDropdown--callout {
		animation: none;
	}

	.vss-PickList--filterBar {
		justify-content: center;
		min-height: 36px;
	}

	.vss-HubBreadcrumb--container {
		overflow: hidden;
	}

	.vss-HubBreadcrumb.ms-Breadcrumb {
		margin: 4px 0;
	}

	.vss-HubBreadcrumb li.ms-Breadcrumb-listItem {
		margin-left: 2px;
	}

	.vss-HubBreadcrumb
		li.ms-Breadcrumb-listItem:first-of-type {
		margin-left: 0;
	}

	.vss-HubBreadcrumb .vss-HubBreadcrumb--item {
		display: inline-flex;
		align-items: center;
		min-height: 30px;
	}

	.vss-HubBreadcrumb .vss-HubBreadcrumb--item:hover {
		background-color: #f4f4f4;
	}

	.vss-HubBreadcrumb .vss-HubBreadcrumb--item:active {
		background-color: #c8c8c8;
	}

	.vss-HubBreadcrumb
		.vss-HubBreadcrumb--item.no-click
		button {
		cursor: default;
	}

	.vss-HubBreadcrumb
		.vss-HubBreadcrumb--item.no-click
		button:hover {
		background-color: transparent;
	}

	.vss-HubBreadcrumb
		.vss-HubBreadcrumb--item.no-click
		button
		span.ms-Breadcrumb-item {
		cursor: default;
	}

	.vss-HubBreadcrumb
		.vss-HubBreadcrumb--item
		.vss-HubBreadcrumb--itemContainer {
		display: flex;
		align-items: center;
	}

	.vss-HubBreadcrumb
		.vss-HubBreadcrumb--item
		.vss-HubBreadcrumb--itemContainer
		span.ms-Breadcrumb-item {
		cursor: pointer;
	}

	.vss-HubBreadcrumb
		.vss-HubBreadcrumb--item
		.vss-HubBreadcrumb--itemText {
		font-weight: 300;
		font-size: 18px;
	}

	.vss-HubBreadcrumb
		.vss-HubBreadcrumb--item
		.vss-HubBreadcrumb--item-leftIcon {
		margin-right: 4px;
		margin-left: 8px;
		font-size: 18px;
	}

	.vss-HubBreadcrumb
		.vss-HubBreadcrumb--item
		.vss-HubBreadcrumb--item-dropdown {
		margin-top: 4px;
		margin-right: 8px;
	}

	.vss-PickList.picker-dropdown {
		justify-content: center;
		min-width: 220px;
		min-height: 36px;
	}

	.vss-PickList.picker-dropdown .vss-PickList--items {
		max-height: 270px;
	}

	.vss-Icon {
		font-style: normal;
	}

	.vss-Icon.vss-Icon--bowtie {
		font-family: bowtie;
	}

	.vss-HubHeader {
		display: flex;
		align-items: center;
		overflow: hidden;
	}

	.vss-HubTileRegion {
		display: flex;
		flex-shrink: 0;
		height: 38px;
	}

	.vss-HubTileRegion .vss-HubTile {
		margin-left: 10px;
		width: 120px;
	}

	.vss-HubTileRegion .vss-HubTextTile {
		display: flex;
		flex-direction: column;
		justify-content: center;
		text-align: center;
	}

	.vss-HubTileRegion
		.vss-HubTextTile
		.vss-HubTextTile--primaryText {
		color: #333;
		font-size: 14px;
	}

	.vss-HubTileRegion
		.vss-HubTextTile
		.vss-HubTextTile--primaryText.vss-HubTextTile--primaryTextOnly {
		font-weight: 600;
	}

	.vss-HubTileRegion
		.vss-HubTextTile
		.vss-HubTextTile--secondaryText {
		color: #666;
		font-size: 11px;
	}

	.vss-Splitter--container {
		position: relative;
		flex-grow: 1;
	}

	.vss-Splitter--container .vss-Splitter--pane-fixed {
		flex-grow: 0;
		flex-shrink: 0;
		max-width: 100%;
	}

	.vss-Splitter--container .vss-Splitter--pane-flexible {
		flex: 1 1 0%;
		width: 0;
		min-width: 0;
		min-height: 0;
	}

	.vss-Splitter--container .vss-Splitter--divider {
		position: relative;
		flex: 0 0 4px;
		user-select: none;
	}

	.vss-Splitter--container .vss-Splitter--divider::after {
		position: absolute;
		background-color: #a6a6a6;
		pointer-events: none;
		content: '';
		user-select: none;
	}

	.vss-Splitter--container .vss-Splitter--drag-placeholder {
		position: absolute;
		z-index: 1000;
		background-color: #a6a6a6;
	}

	.vss-Splitter--container.vss-Splitter--container-row {
		display: -webkit-box;
		display: flex;
		flex-flow: row nowrap;
	}

	.vss-Splitter--container.vss-Splitter--container-row
		.vss-Splitter--divider {
		cursor: ew-resize;
	}

	.vss-Splitter--container.vss-Splitter--container-row
		.vss-Splitter--divider::after {
		top: 0;
		bottom: 0;
		left: 50%;
		transition:
			100ms width,
			100ms left;
		width: 1px;
	}

	.vss-Splitter--container.vss-Splitter--container-row
		.vss-Splitter--divider:not(
			.vss-Splitter--divider-dragging
		):hover::after,
	.vss-Splitter--container.vss-Splitter--container-row
		.vss-Splitter--divider:focus::after {
		left: calc(50% - 2px);
		width: 4px;
	}

	.vss-Splitter--container.vss-Splitter--container-row
		.vss-Splitter--drag-placeholder {
		width: 4px;
		height: 100%;
	}

	.vss-Splitter--container.vss-Splitter--container-column {
		display: -webkit-box;
		display: flex;
		flex-flow: column nowrap;
	}

	.vss-Splitter--container.vss-Splitter--container-column
		.vss-Splitter--divider {
		cursor: ns-resize;
	}

	.vss-Splitter--container.vss-Splitter--container-column
		.vss-Splitter--divider::after {
		top: 50%;
		right: 0;
		left: 0;
		transition:
			100ms height,
			100ms top;
		height: 1px;
	}

	.vss-Splitter--container.vss-Splitter--container-column
		.vss-Splitter--divider:not(
			.vss-Splitter--divider-dragging
		):hover::after,
	.vss-Splitter--container.vss-Splitter--container-column
		.vss-Splitter--divider:focus::after {
		top: calc(50% - 2px);
		height: 4px;
	}

	.vss-Splitter--container.vss-Splitter--container-column
		.vss-Splitter--drag-placeholder {
		width: 100%;
		height: 4px;
	}

	.vss-PivotBar {
		display: flex;
		flex-direction: column;
	}

	.vss-PivotBar .vss-PivotBar--bar-one-line,
	.vss-PivotBar .vss-PivotBar--bar-two-line {
		flex-shrink: 0;
		border-bottom: 1px solid #eaeaea;
	}

	.vss-PivotBar .vss-PivotBar--bar-one-line {
		display: flex;
	}

	.vss-PivotBar
		.vss-PivotBar--bar-one-line
		.vss-PivotBar--bar {
		flex: 1;
	}

	.vss-PivotBar .vss-PivotBar--header {
		display: flex;
		flex-shrink: 0;
	}

	.vss-PivotBar .vss-PivotBar--header.vertical {
		margin-right: 20px;
		margin-left: 24px;
	}

	.vss-PivotBar .vss-PivotBar--header .vss-HubHeader {
		flex-grow: 1;
	}

	.vss-PivotBar .vss-PivotBar--pivotsContainer {
		display: flex;
		flex-grow: 1;
		margin-right: 20px;
		margin-left: 12px;
		padding-top: 5px;
		overflow: hidden;
	}

	.vss-PivotBar .vss-PivotBar--pivotsContainer.vertical {
		margin-left: 0;
	}

	.vss-PivotBar .vss-PivotBar--pivotsContainer .ms-Nav {
		max-width: 225px;
	}

	.vss-PivotBar
		.vss-PivotBar--pivotsContainer
		.ms-Nav
		.ms-Nav-group.is-expanded
		.ms-Nav-groupContent {
		visibility: visible;
		margin-bottom: 40px;
		height: auto;
		overflow: visible;
	}

	.vss-PivotBar
		.vss-PivotBar--pivotsContainer
		.ms-Nav
		.ms-Nav-groupContent {
		display: block;
		visibility: hidden;
		margin-bottom: 0;
		height: 0;
		overflow: hidden;
	}

	.vss-PivotBar
		.vss-PivotBar--pivotsContainer
		.ms-Nav
		.ms-Nav-compositeLink
		.ms-Nav-link {
		color: #333;
	}

	.vss-PivotBar
		.vss-PivotBar--pivotsContainer
		.ms-Nav
		.ms-Nav-compositeLink.is-selected
		.ms-Nav-link {
		font-weight: 600;
	}

	.vss-PivotBar
		.vss-PivotBar--pivotsContainer
		.ms-Nav
		.ms-Nav-chevronButton {
		border-bottom: 1px #eaeaea solid;
	}

	.vss-PivotBar .vss-PivotBar--barAndContentContainer {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
	}

	.vss-PivotBar .vss-PivotBar--pivots {
		flex: 0 1 auto;
		margin-right: 8px;
		white-space: nowrap;
	}

	.vss-PivotBar .vss-PivotBar--pivots.vertical {
		border-right: 1px #eaeaea solid;
		overflow-y: auto;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--itemLink {
		margin-right: 8px;
		color: inherit;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--itemLink:last-child {
		margin-right: 0;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--itemLink:focus {
		outline: none;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--button {
		display: inline-block;
		position: relative;
		border: 0;
		background-color: transparent;
		padding: 0 8px;
		overflow: visible;
		text-align: center;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--button:focus {
		outline: none;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--button:hover {
		color: inherit;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--button
		.text {
		padding: 0 1px;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--button
		.text,
	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--button
		.badge {
		display: inline-block;
		vertical-align: top;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--button
		.icon
		+ .text {
		margin-left: 4px;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--button
		.badge {
		vertical-align: baseline;
		margin-left: 4px;
		border-radius: 5px;
		background-color: #dadada;
		padding: 0 3px;
		font-size: 12px;
	}

	.vss-PivotBar
		.vss-PivotBar--pivots
		.vss-PivotBar--button.selected {
		border-bottom: 2px solid #005a9e;
		padding-top: 2px;
		font-weight: 600;
	}

	.vss-PivotBar
		.ms-Nav
		.ms-Nav-compositeLink
		.ms-Nav-linkButton,
	.vss-PivotBar
		.ms-Nav
		.ms-Nav-compositeLink
		.ms-Nav-linkButton:hover {
		color: inherit;
	}

	.vss-PivotBar .vss-PivotBar--bar {
		display: flex;
	}

	.vss-PivotBar .vss-PivotBar--bar .vss-PivotBar--dropdown {
		height: 100%;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--dropdown
		.ms-Dropdown-title {
		border: 0;
		background: transparent;
		padding-top: 4px;
		padding-left: 9px;
		font-weight: 600;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--dropdown
		.ms-Dropdown-caretDownWrapper {
		cursor: pointer;
		background: transparent;
		padding-top: 4px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--dropdown.is-open,
	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--dropdown:hover {
		background-color: #eaeaea;
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-PivotBar
			.vss-PivotBar--bar
			.vss-PivotBar--dropdown:focus,
		.vss-PivotBar
			.vss-PivotBar--bar
			.vss-PivotBar--dropdown:focus
			.ms-Dropdown-title,
		.vss-PivotBar
			.vss-PivotBar--bar
			.vss-PivotBar--dropdown:focus
			.ms-Dropdown-caretDownWrapper,
		.vss-PivotBar
			.vss-PivotBar--bar
			.vss-PivotBar--dropdown:focus
			.ms-Dropdown-caretDown {
			background: Highlight;
			color: HighlightText;
		}
	}

	.vss-PivotBar .vss-PivotBar--bar .vss-PivotBar--right {
		display: flex;
		flex: 1 1 100%;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--separator {
		flex: 0 1 auto;
		align-self: center;
		margin: 0 8px;
		background-color: #c8c8c8;
		width: 1px;
		min-width: 1px;
		height: 24px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar {
		flex: 1 1 auto;
		background-color: transparent;
		width: 100px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.vss-Icon {
		color: #0078d4;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.bowtie-icon {
		vertical-align: top;
		line-height: 40px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBarItem-link {
		padding: 0 8px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-primaryCommands {
		margin-left: 0;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands {
		padding-right: 0;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem.vss-PivotBar--commandBar-barChoiceGroup
		.ms-Button-icon {
		color: #666;
		font-size: 12px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem.vss-PivotBar--commandBar-barChoiceGroup:hover {
		background-color: inherit;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem.vss-PivotBar--commandBar-barChoiceGroup:hover
		.vss-PivotBar--commandBar-barChoiceCycle:hover,
	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem.vss-PivotBar--commandBar-barChoiceGroup:hover
		.vss-PivotBar--commandBar-barChoiceDrop:hover {
		background-color: #eaeaea;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem.vss-PivotBar--commandBar-text {
		display: inline-flex;
		align-items: center;
		cursor: default;
		padding: 0 4px;
		color: #212121;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem.vss-PivotBar--commandBar-text:hover {
		background-color: inherit;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem.vss-PivotBar--commandBar-barSlider {
		display: inline-flex;
		align-items: center;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem.vss-PivotBar--commandBar-barSlider:hover {
		background-color: inherit;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem.vss-PivotBar--commandBar-barSlider
		.vss-PivotBar--commandBar-slider.ms-Slider {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem.vss-PivotBar--commandBar-barSlider
		.vss-PivotBar--commandBar-slider.ms-Slider
		.ms-Slider-container {
		width: 100px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		> .ms-CommandBarItem
		.vss-PivotBar--commandBar-toggle {
		border: 0;
		padding: 0 8px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		.vss-ChoiceGroupButton {
		display: inline-flex;
		align-items: center;
		padding: 0 8px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		.vss-ChoiceGroupButton
		.vss-ChoiceGroupButton--separator {
		border-left: 1px solid #c8c8c8;
		height: 16px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.ms-CommandBar-sideCommands
		.vss-PivotBarSlider {
		position: relative;
		outline: 0;
		padding: 6px 8px;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.vss-PivotBar--commandBar-item
		.ms-CommandBarItem-link[disabled] {
		border: 0;
		color: #c8c8c8;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--commandBar
		.vss-PivotBar--commandBar-item
		.ms-CommandBarItem-link[disabled]
		.vss-Icon {
		color: #c8c8c8;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--inlineFilterBar {
		background-color: transparent;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--inlineFilterBar
		.vss-FilterBar {
		padding-top: 0;
		height: 100%;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--inlineFilterBar
		.vss-FilterBar
		.vss-FilterBar--list {
		align-items: center;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--inlineFilterBar
		.vss-FilterBar
		.vss-FilterBar--action {
		display: none;
	}

	.vss-PivotBar
		.vss-PivotBar--bar
		.vss-PivotBar--inlineFilterBar
		.vss-FilterBar
		.vss-FilterBar--item {
		margin-bottom: 0;
	}

	.vss-PivotBar .vss-PivotBar--content {
		display: flex;
		position: relative;
		flex-grow: 1;
		outline: 0;
		overflow-y: auto;
	}

	.vss-PivotBar .vss-PivotBar--content.hide-content {
		display: none;
	}

	.vss-PivotBar .vss-PivotBar--content .vss-PivotBarItem {
		flex-grow: 1;
	}

	.vss-PivotBar
		.vss-PivotBar--content
		.vss-PivotBarItem.content-host {
		display: flex;
	}

	.vss-PivotBar
		.vss-PivotBar--content
		.vss-PivotBarItem.content-host
		.internal-content-host,
	.vss-PivotBar
		.vss-PivotBar--content
		.vss-PivotBarItem.content-host
		.external-content-host {
		flex-grow: 1;
	}

	.vss-PivotBar
		.vss-PivotBar--content.vss-PivotBar--content-unscrollable {
		overflow-y: visible;
	}

	.vss-PivotBar .vss-FilterBar {
		flex-shrink: 0;
		padding-top: 10px;
	}

	.vss-PivotBar--commandBar-icon.vss-Icon {
		color: #0078d4;
	}

	.vss-PivotBar--commandBar-overflow {
		max-width: 300px;
	}

	.vss-PivotBar--commandBar-overflow
		.vss-PivotBar--commandBar-toggle.ms-Toggle {
		margin-top: 4px;
		padding-left: 8px;
	}

	.vss-PivotBar--commandBar-overflow
		.vss-PivotBar--commandBar-toggle.ms-Toggle
		.ms-Toggle-innerContainer {
		align-items: center;
	}

	.vss-PivotBar--commandBar-overflow
		.vss-PivotBar--commandBar-toggle.ms-Toggle
		.ms-Toggle-background {
		font-size: 15px;
	}

	.vss-PivotBar--commandBar-overflow
		.ms-ContextualMenu-header
		.ms-Icon-placeHolder {
		display: none;
	}

	.vss-PivotBar--commandBar-overflow
		.ms-ContextualMenu-header
		.ms-ContextualMenu-itemText {
		color: #666;
		font-weight: 400;
	}

	.vss-PivotBar--commandBar-item
		.ms-ContextualMenu-link[disabled],
	.vss-PivotBar--commandBar-item
		.ms-ContextualMenu-link.is-disabled {
		border: 0;
		color: #c8c8c8;
	}

	.vss-PivotBar--commandBar-item
		.ms-ContextualMenu-link[disabled]
		.vss-Icon,
	.vss-PivotBar--commandBar-item
		.ms-ContextualMenu-link.is-disabled
		.vss-Icon {
		color: #c8c8c8;
	}

	.ms-Fabric.is-focusVisible
		.vss-PivotBar
		.vss-ChoiceGroupButton
		button:focus::after,
	.ms-Fabric.is-focusVisible
		.vss-PivotBar
		.vss-PivotBarSlider:focus::after,
	.ms-Fabric.is-focusVisible
		.vss-PivotBar
		.vss-PivotBar--dropdown:focus::after,
	.ms-Fabric.is-focusVisible
		.vss-PivotBar
		.vss-PivotBar--commandBar-toggle:focus::after {
		position: absolute;
		inset: 2px;
		outline: 0;
		border: 1px solid #212121;
		pointer-events: none;
		content: '';
	}

	.vss-PivotBar--bar
		.vss-PivotBar--right
		button[data-command-key='viewOptions']
		.ms-CommandBarItem-chevronDown {
		display: none;
	}

	.vss-Hub {
		display: flex;
		flex-direction: column;
	}

	.vss-Hub.ms-Fabric {
		color: inherit;
		font-weight: inherit;
		font-size: inherit;
		font-family: inherit;
	}

	.vss-Hub.ms-Fabric {
		font-size: 14px;
		font-family:
			'Segoe UI VSS (Regular)',
			-apple-system,
			BlinkMacSystemFont,
			Segoe UI,
			Roboto,
			Helvetica Neue,
			Helvetica,
			Ubuntu,
			Arial,
			sans-serif,
			Apple Color Emoji,
			Segoe UI Emoji,
			Segoe UI Symbol;
	}

	.vss-Hub .vss-HubPivotBar {
		flex-grow: 1;
		overflow-y: hidden;
	}

	.vss-Hub .vss-HubPivotBar .vss-Hub--filterBar,
	.vss-Hub
		.vss-HubPivotBar
		> .vss-PivotBar--content
		.vss-PivotBarItem:not(.customPadding) {
		padding-right: 20px;
		padding-left: 20px;
	}

	.vss-Hub
		.vss-HubPivotBar
		> .vss-PivotBar--content
		.vss-PivotBarItem.detailsListPadding {
		padding-right: 20px;
		padding-left: 12px;
	}

	.vss-Hub
		.vss-HubPivotBar
		.vss-PivotBar--inlineFilterBar
		.vss-Hub--filterBar {
		padding-right: 0;
		padding-left: 0;
	}

	.vss-Hub .vss-HubPivotBar:not(.shadowStyle) {
		padding-top: 10px;
	}

	.vss-Hub
		.vss-HubPivotBar:not(.shadowStyle)
		> .vss-PivotBar--bar-one-line,
	.vss-Hub
		.vss-HubPivotBar:not(.shadowStyle)
		> .vss-PivotBar--bar-two-line {
		margin-right: 20px;
		margin-left: 12px;
	}

	.vss-Hub
		.vss-HubPivotBar.shadowStyle
		> .vss-PivotBar--bar-one-line,
	.vss-Hub
		.vss-HubPivotBar.shadowStyle
		> .vss-PivotBar--bar-two-line {
		padding-right: 20px;
		padding-left: 12px;
	}

	.vss-Hub
		.vss-HubPivotBar.shadowStyle
		> .vss-PivotBar--bar-one-line,
	.vss-Hub
		.vss-HubPivotBar.shadowStyle
		> .vss-PivotBar--bar-two-line {
		box-shadow:
			0 3px 9px 0 rgb(0 0 0 / 10%),
			0 0 0 1px rgb(0 0 0 / 4%);
		border-bottom: none;
		background-color: #fff;
	}

	.vss-Hub .vss-HubPivotBar.hideHeader .vss-Hub--filterBar,
	.vss-Hub
		.vss-HubPivotBar.hideHeader
		> .vss-PivotBar--bar-one-line,
	.vss-Hub
		.vss-HubPivotBar.hideHeader
		> .vss-PivotBar--bar-two-line {
		display: none;
	}

	.vss-Hub .vss-HubPivotBar .vss-PivotBar--bar-one-line {
		padding-bottom: 10px;
	}

	.vss-Hub
		.vss-HubPivotBar
		.vss-PivotBar--bar-two-line
		.vss-PivotBar--header {
		padding-bottom: 2px;
	}

	.vss-Hub .vss-HubPivotBar.vss-HubPivotBar--scrollable {
		overflow-y: auto;
	}

	.vss-IconToggleButton {
		font-weight: 400;
	}

	.icon-toggle-button.ms-Button.ms-Button--default {
		border: none;
		background: none;
		padding: 0;
		width: 30px;
		min-width: 30px;
		height: 30px;
	}

	.icon-toggle-button.ms-Button.ms-Button--default:hover,
	.icon-toggle-button.ms-Button.ms-Button--default:active,
	.icon-toggle-button.ms-Button.ms-Button--default:focus {
		box-shadow: 0 0 0 rgb(160 160 160 / 20%);
		background: none;
	}

	.vss-DetailsList.ms-DetailsList {
		font-size: 14px;
	}

	.vss-DetailsList.ms-DetailsList.noGroupExpand
		.ms-GroupSpacer {
		display: none;
	}

	.vss-DetailsList.ms-DetailsList.noGroupExpand
		.ms-DetailsHeader-cell:first-child {
		display: none;
	}

	.vss-DetailsList.ms-DetailsList .ms-GroupedList {
		font-size: 14px;
	}

	.vss-DetailsList.ms-DetailsList
		button:disabled.ms-DetailsHeader-cell {
		cursor: default;
		border: unset;
	}

	.vss-DetailsList.ms-DetailsList .ms-DetailsHeader {
		min-height: 34px;
	}

	.vss-DetailsList.ms-DetailsList .ms-List-cell {
		min-height: 36px;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow {
		margin: 0;
		border: none;
		min-height: 36px;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow::before {
		border: none;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:focus::after {
		border-color: #0078d4;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		a {
		outline: 0;
		border: 1px solid transparent;
		color: #212121;
	}

	.vss-focus-visible
		.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		a:focus {
		border: 1px solid #212121;
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-focus-visible
			.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow
			a:focus {
			border: 1px dashed windowtext !important;
		}
	}

	@media screen and (-ms-high-contrast: active) and (-ms-high-contrast: white-on-black) {
		.vss-focus-visible
			.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow
			a:focus {
			border: 1px dashed #002033 !important;
		}
	}

	@media screen and (-ms-high-contrast: active) and (-ms-high-contrast: black-on-white) {
		.vss-focus-visible
			.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow
			a:focus {
			border: 1px dashed #fff !important;
		}
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow
			a {
			outline: 0;
			border: 1px solid transparent;
		}

		.vss-focus-visible
			.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow
			a:focus {
			border: 1px solid #212121;
		}
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-focus-visible
			.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow
			a:focus {
			border: 1px dashed windowtext !important;
		}
	}

	@media screen and (-ms-high-contrast: active) and (-ms-high-contrast: white-on-black) {
		.vss-focus-visible
			.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow
			a:focus {
			border: 1px dashed #002033 !important;
		}
	}

	@media screen and (-ms-high-contrast: active) and (-ms-high-contrast: black-on-white) {
		.vss-focus-visible
			.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow
			a:focus {
			border: 1px dashed #fff !important;
		}
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		a.ms-Link:focus {
		outline: none;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell {
		align-items: center;
		margin: 0;
		padding: 0 8px;
		min-height: 34px;
		color: #212121;
		line-height: 34px;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--cellCheck {
		padding: 0;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.actions-column-wrapper {
		display: flex;
		flex-direction: row;
		overflow: hidden;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.actions-column-wrapper
		.original-content {
		display: flex;
		flex: 1;
		overflow: hidden;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-ContextualMenu--container {
		padding-top: 1px;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-ContextualMenuButton {
		margin-top: 1px;
		background-color: #f4f4f4;
		width: 36px;
		max-width: 36px;
		height: 32px;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-ContextualMenuButton:hover,
	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-ContextualMenuButton:active {
		background-color: #eaeaea;
		color: #212121;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--contextual-menu-button.space-unallocated {
		display: none;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--contextual-menu-button.space-unallocated.open {
		display: block;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--contextual-menu-button.space-allocated {
		display: block;
		visibility: hidden;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--contextual-menu-button.space-allocated.open {
		visibility: visible;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow.is-selected {
		background-color: #eff6fc;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow.is-selected
		.vss-ContextualMenuButton {
		background-color: #eff6fc;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow.is-selected
		.vss-ContextualMenuButton:focus,
	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow.is-selected
		.vss-ContextualMenuButton:hover,
	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow.is-selected
		.vss-ContextualMenuButton:active {
		background-color: #deecf9;
		color: #212121;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow.is-selected
		.vss-DetailsList--contextual-menu-button.space-unallocated {
		display: block;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow.is-selected
		.vss-DetailsList--contextual-menu-button.space-allocated {
		visibility: visible;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow.is-selected
		a {
		color: #106ebe;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow.is-selected
		a:hover {
		color: #005a9e;
		text-decoration: underline;
	}

	@media screen and (-ms-high-contrast: white-on-black) {
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			a,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			a
			:hover,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			span,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			label,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			i {
			color: #002033;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			a,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			a
			:hover,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			span,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			label,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			i {
			color: #fff;
		}
	}

	@media screen and (-ms-high-contrast: white-on-black) {
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			button
			i,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			.ms-Button-label {
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			button
			i,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow.is-selected
			.ms-Button-label {
			color: HighlightText;
		}
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:hover {
		background-color: #f4f4f4;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:hover.is-selected {
		background-color: #eff6fc;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:hover.is-selected
		.vss-ContextualMenuButton {
		background-color: #eff6fc;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:hover.is-selected
		.vss-ContextualMenuButton:focus,
	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:hover.is-selected
		.vss-ContextualMenuButton:hover,
	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:hover.is-selected
		.vss-ContextualMenuButton:active {
		background-color: #deecf9;
		color: #212121;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:hover
		.vss-DetailsList--contextual-menu-button.space-unallocated {
		display: block;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:hover
		.vss-DetailsList--contextual-menu-button.space-allocated {
		visibility: visible;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:hover
		a {
		color: #106ebe;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow:hover
		a:hover {
		color: #005a9e;
		text-decoration: underline;
	}

	@media screen and (-ms-high-contrast: white-on-black) {
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow:hover.is-selected
			a,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow:hover.is-selected
			a
			:hover,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow:hover.is-selected
			span,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow:hover.is-selected
			i {
			color: #002033;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow:hover.is-selected
			a,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow:hover.is-selected
			a
			:hover,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow:hover.is-selected
			span,
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow:hover.is-selected
			i {
			color: #fff;
		}
	}

	@media screen and (-ms-high-contrast: white-on-black) {
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow:hover.is-selected
			button
			i {
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-DetailsList.ms-DetailsList
			.ms-List-cell
			.ms-DetailsRow:hover.is-selected
			button
			i {
			color: HighlightText;
		}
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--titleCellPrimary {
		display: flex;
		flex-grow: 1;
		flex-direction: row;
		overflow: hidden;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--titleCellText {
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--titleCellText.disabled {
		color: #c8c8c8;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--titleCellText.disabled
		a:link,
	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--titleCellText.disabled
		a:hover,
	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--titleCellText.disabled
		a:visited {
		color: #c8c8c8;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--titleCellIcon {
		display: flex;
		flex: 0 0 auto;
		margin-right: 6px;
	}

	.vss-DetailsList.ms-DetailsList
		.ms-List-cell
		.ms-DetailsRow
		.vss-DetailsList--titleCellOneLine {
		display: flex;
		flex: 1;
		flex-direction: row;
		overflow: hidden;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-GroupedList {
		padding-top: 10px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-GroupedList-group {
		padding-bottom: 20px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-page:last-child
		.ms-List-cell:last-child {
		border-bottom: none;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-GroupedList
		.ms-List-cell {
		border-bottom: none;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-GroupedList-group
		.ms-List-cell {
		border-bottom: 1px solid #eaeaea;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell {
		border-bottom: 1px solid #eaeaea;
		min-height: 54px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow {
		min-height: 54px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell {
		min-height: 52px;
		line-height: 52px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell
		.vss-ContextualMenu--container {
		margin-top: 9px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell
		.vss-DetailsList--titleCellTwoLine {
		display: flex;
		flex: 1;
		flex-direction: row;
		align-items: center;
		margin-left: 10px;
		padding: 6px 0;
		overflow: hidden;
		line-height: 20px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell
		.vss-DetailsList--titleCellTwoLine.noIcon {
		margin-left: 0;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell
		.vss-DetailsList--titleCellTwoLine
		.vss-DetailsList--titleCellIcon {
		vertical-align: middle;
		margin-right: 13px;
		font-size: 28px;
		line-height: 40px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell
		.vss-DetailsList--titleCellTwoLine
		.vss-DetailsList--titleCellIcon.disabled
		img {
		opacity: 50%;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell
		.vss-DetailsList--titleCellTwoLine
		.vss-DetailsList--titleCellIcon.vss-DetailsList--titleCellIcon--image {
		margin-right: 13px;
		width: 40px;
		height: 40px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell
		.vss-DetailsList--titleCellTwoLine
		.vss-IndicatorSet {
		font-size: 16px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell
		.vss-DetailsList--titleCellTwoLine
		.vss-DetailsList--titleCellTwoLineText {
		display: flex;
		flex-grow: 1;
		flex-direction: column;
		overflow: hidden;
		font-size: 15px;
	}

	.vss-DetailsList.ms-DetailsList.vss-DetailsList--twoLine
		.ms-List-cell
		.ms-DetailsRow
		.ms-DetailsRow-cell
		.vss-DetailsList--titleCellTwoLine
		.vss-DetailsList--titleCellTwoLineText
		.vss-DetailsList--titleCellSecondary {
		flex-grow: 1;
		overflow: hidden;
		color: #666;
		font-size: 12px;
		text-overflow: ellipsis;
	}

	.vss-DetailsList--layout.ms-DetailsList {
		cursor: default;
		color: initial;
	}

	.vss-DetailsList--layout.ms-DetailsList a {
		color: initial;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.ms-DetailsHeader {
		border-color: initial;
		font-size: initial;
		line-height: initial;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.ms-DetailsHeader-cell {
		display: inline-flex;
		background: transparent;
		padding: 0;
		height: auto;
		min-height: initial;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.ms-DetailsHeader-cell
		> span {
		display: flex;
		position: relative;
		flex-grow: 1;
		overflow: hidden;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.ms-DetailsHeader-cellTitle {
		display: flex;
		position: relative;
		flex-grow: 1;
		align-items: center;
		padding: 0;
	}

	.vss-DetailsList--layout.ms-DetailsList .ms-List-cell,
	.vss-DetailsList--layout.ms-DetailsList .ms-DetailsRow,
	.vss-DetailsList--layout.ms-DetailsList
		.ms-DetailsRow-cell {
		margin: 0;
		border: none;
		min-height: inherit;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.ms-DetailsRow::before {
		border: none;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.ms-DetailsRow:hover {
		background-color: initial;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.ms-DetailsRow.is-selected {
		background-color: initial;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.ms-DetailsRow-cell {
		flex-direction: row;
		align-items: center;
		align-self: stretch;
		padding: 0;
		color: initial;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.actions-column-wrapper {
		display: flex;
		flex-grow: 1;
		flex-direction: row;
		overflow: hidden;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.original-content {
		flex-grow: 1;
		overflow: hidden;
		text-overflow: ellipsis;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.vss-ContextualMenu--container {
		display: flex;
		align-items: center;
	}

	.vss-DetailsList--layout.ms-DetailsList
		.vss-DetailsList--contextual-menu-button {
		height: auto;
	}

	.vss-DetailsList--layout.hideActionsButton
		.vss-DetailsList--contextual-menu-button.space-unallocated {
		display: none;
	}

	.vss-DetailsList--layout.hideActionsButton
		.vss-DetailsList--contextual-menu-button.space-unallocated.open {
		display: block;
	}

	.vss-DetailsList--layout.hideActionsButton
		.vss-DetailsList--contextual-menu-button.space-allocated {
		visibility: hidden;
	}

	.vss-DetailsList--layout.hideActionsButton
		.vss-DetailsList--contextual-menu-button.space-allocated.open {
		visibility: visible;
	}

	.vss-DetailsList--layout.hideActionsButton
		.ms-DetailsRow.is-selected
		.vss-DetailsList--contextual-menu-button.space-unallocated,
	.vss-DetailsList--layout.hideActionsButton
		.ms-DetailsRow:hover
		.vss-DetailsList--contextual-menu-button.space-unallocated {
		display: block;
	}

	.vss-DetailsList--layout.hideActionsButton
		.ms-DetailsRow.is-selected
		.vss-DetailsList--contextual-menu-button.space-allocated,
	.vss-DetailsList--layout.hideActionsButton
		.ms-DetailsRow:hover
		.vss-DetailsList--contextual-menu-button.space-allocated {
		visibility: visible;
	}

	.vss-DetailsList--layout.singleLine {
		font-size: 14px;
	}

	.vss-DetailsList--layout.singleLine .ms-DetailsRow-cell {
		min-height: 36px;
	}

	.vss-DetailsList--layout.singleLine
		.vss-DetailsList--contextual-menu-button {
		height: 32px;
	}

	.vss-DetailsList--layout.flexCellLayout
		.original-content {
		display: flex;
		align-items: center;
	}

	.vss-DetailsList--layout.flexCellLayout
		.ms-DetailsRow-cell {
		display: flex;
		align-items: center;
	}

	.vss-DetailsList--layout.paddingInCells
		.ms-DetailsHeader-cell,
	.vss-DetailsList--layout.paddingInCells
		.ms-DetailsRow-cell {
		padding: 0 8px;
	}

	.vss-DetailsList--layout.paddingInCells
		.ms-DetailsHeader-cellIsCheck,
	.vss-DetailsList--layout.paddingInCells
		.vss-DetailsList--cellCheck {
		padding: 0;
	}

	.vss-DetailsList--layout.paddingInCells
		.original-content {
		padding-right: 4px;
	}

	.vss-DetailsList--layout.colors {
		color: #212121;
	}

	.vss-DetailsList--layout.colors .ms-DetailsHeader-cell {
		color: #212121;
	}

	.vss-DetailsList--layout.colors .ms-DetailsRow-cell {
		color: #212121;
	}

	.vss-DetailsList--layout.colors
		.vss-ContextualMenuButton {
		background-color: #f4f4f4;
	}

	.vss-DetailsList--layout.colors
		.vss-ContextualMenuButton:hover,
	.vss-DetailsList--layout.colors
		.vss-ContextualMenuButton:active {
		background-color: #eaeaea;
		color: #212121;
	}

	.vss-DetailsList--layout.colors .ms-DetailsRow:hover {
		background-color: #f4f4f4;
	}

	.vss-DetailsList--layout.colors
		.ms-DetailsRow.is-selected {
		background-color: #eff6fc;
	}

	.vss-DetailsList--layout.colors
		.ms-DetailsRow.is-selected
		.vss-ContextualMenuButton {
		background-color: #eff6fc;
	}

	.vss-DetailsList--layout.colors
		.ms-DetailsRow.is-selected
		.vss-ContextualMenuButton:focus,
	.vss-DetailsList--layout.colors
		.ms-DetailsRow.is-selected
		.vss-ContextualMenuButton:hover,
	.vss-DetailsList--layout.colors
		.ms-DetailsRow.is-selected
		.vss-ContextualMenuButton:active {
		background-color: #deecf9;
		color: #212121;
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-DetailsList--layout.colors
			.ms-DetailsRow.is-selected
			.ms-DetailsRow-cell,
		.vss-DetailsList--layout.colors
			.ms-DetailsRow.is-selected
			span,
		.vss-DetailsList--layout.colors
			.ms-DetailsRow.is-selected
			i {
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: white-on-black) {
		.vss-DetailsList--layout.colors
			.ms-DetailsRow.is-selected
			button
			i {
			color: HighlightText;
		}
	}

	@media screen and (-ms-high-contrast: black-on-white) {
		.vss-DetailsList--layout.colors
			.ms-DetailsRow.is-selected
			button
			i {
			color: HighlightText;
		}
	}

	.vss-DetailsList--layout.linkStyles
		.ms-DetailsRow.is-selected
		a,
	.vss-DetailsList--layout.linkStyles
		.ms-DetailsRow.is-selected
		a:visited,
	.vss-DetailsList--layout.linkStyles
		.ms-DetailsRow:hover
		a {
		color: #106ebe;
	}

	.vss-DetailsList--layout.linkStyles a,
	.vss-DetailsList--layout.linkStyles a:visited {
		padding: 0 2px;
		color: inherit;
		text-decoration: none;
	}

	.vss-DetailsList--layout.linkStyles a:hover,
	.vss-DetailsList--layout.linkStyles
		.ms-DetailsRow.is-selected
		a:hover {
		color: #005a9e;
		text-decoration: underline;
	}

	@media screen and (-ms-high-contrast: active) {
		.vss-DetailsList--layout.linkStyles
			.ms-DetailsRow.is-selected
			a,
		.vss-DetailsList--layout.linkStyles
			.ms-DetailsRow.is-selected
			a:hover,
		.vss-DetailsList--layout.linkStyles
			.ms-DetailsRow.is-selected
			a:visited {
			color: HighlightText;
		}
	}

	.vss-DetailsList--layout.headerRowStyles
		.ms-DetailsHeader {
		border-color: #eaeaea;
		min-height: 34px;
	}

	.vss-DetailsList--layout.headerRowStyles
		.ms-DetailsHeader-cell {
		min-height: 32px;
		color: #212121;
	}

	.vss-DetailsList--groupHeader {
		border-bottom: 1px solid #eaeaea;
	}

	.vss-DetailsList--groupHeaderText {
		padding: 10px 8px;
		color: #666;
	}

	.vss-Persona img {
		border-radius: 50%;
		width: 100%;
		height: 100%;
	}

	.vss-Persona.extra-extra-small {
		width: 16px;
		height: 16px;
	}

	.vss-Persona.extra-small {
		width: 18px;
		height: 18px;
	}

	.vss-Persona.small {
		width: 24px;
		height: 24px;
	}

	.vss-Persona.small-plus {
		width: 28px;
		height: 28px;
	}

	.vss-Persona.medium {
		width: 32px;
		height: 32px;
	}

	.vss-Persona.medium-plus {
		width: 40px;
		height: 40px;
	}

	.vss-Persona.large {
		width: 48px;
		height: 48px;
	}

	.vss-Persona.extra-large {
		width: 72px;
		height: 72px;
	}

	.tree-column-wrapper {
		display: flex;
	}

	.vss-ZeroData {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
		margin-top: 35px;
	}

	.vss-ZeroData .vss-ZeroDataItem {
		display: flex;
		flex-direction: column;
		align-items: center;
		text-align: center;
	}

	.vss-ZeroData .vss-ZeroDataItem .vss-ZeroDataItem--image,
	.vss-ZeroData
		.vss-ZeroDataItem
		.vss-ZeroDataItem--primary,
	.vss-ZeroData
		.vss-ZeroDataItem
		.vss-ZeroDataItem--secondary {
		margin-bottom: 15px;
		max-width: 100%;
	}

	.vss-ZeroData
		.vss-ZeroDataItem
		.vss-ZeroDataItem--image:last-child,
	.vss-ZeroData
		.vss-ZeroDataItem
		.vss-ZeroDataItem--primary:last-child,
	.vss-ZeroData
		.vss-ZeroDataItem
		.vss-ZeroDataItem--secondary:last-child {
		margin-bottom: 0;
	}

	.vss-ZeroData.single .vss-ZeroDataItem {
		min-width: 10px;
		max-width: 520px;
	}

	.vss-ZeroData.single
		.vss-ZeroDataItem
		.vss-ZeroDataItem--image {
		height: 160px;
	}

	.vss-ZeroData.multiple .vss-ZeroDataItem {
		flex-grow: 1;
		margin: 0 20px;
		max-width: 235px;
	}

	.vss-ZeroData.multiple
		.vss-ZeroDataItem
		.vss-ZeroDataItem--image {
		height: 75px;
	}

	.vss-ZeroData.multiple
		.vss-ZeroDataItem
		.vss-ZeroDataItem--action {
		margin-top: auto;
	}

	.price-control {
		display: flex;
	}

	.price-control .quantity-field {
		margin-bottom: 0;
	}

	.price-control .quantity-field div {
		height: 26px;
	}

	.price-control .inner-textfield {
		padding: 0;
		width: 50px;
		text-align: center;
	}

	.price-control .button-class {
		border: 1px solid;
		border-color: rgb(200 200 200 / 100%);
		border-color: rgba(
			var(--palette-neutral-20, 200, 200, 200),
			1
		);
		background: rgb(234 234 234 / 100%);
		background: rgba(
			var(--palette-neutral-8, 234, 234, 234),
			1
		);
		width: 20px;
		height: 26px;
	}

	.price-control .button-class span {
		line-height: 20px;
	}

	.price-control .button-class i {
		margin: 0;
		color: black;
		font-size: 10px;
	}

	.price-control .button-class:hover {
		background: rgb(218 218 218 / 100%);
		background: rgba(
			var(--palette-neutral-10, 218, 218, 218),
			1
		);
	}

	.price-control .button-class.is-disabled {
		border-color: rgb(244 244 244 / 100%);
		border-color: rgba(
			var(--palette-neutral-4, 244, 244, 244),
			1
		);
		background-color: rgb(244 244 244 / 100%);
		background-color: rgba(
			var(--palette-neutral-4, 244, 244, 244),
			1
		);
	}

	.price-control .button-class.is-disabled i {
		color: rgb(200 200 200 / 100%);
		color: rgba(
			var(--palette-neutral-20, 200, 200, 200),
			1
		);
	}

	.qna-top-container .user-reply-top-container {
		border-top: 1px solid;
		border-top-color: rgb(234 234 234 / 100%);
		border-top-color: rgba(
			var(--palette-neutral-8, 234, 234, 234),
			1
		);
	}

	.qna-top-container .qna-user-image-column {
		vertical-align: top;
		border-collapse: collapse;
		padding-top: 14px;
		padding-bottom: 14px;
		text-align: center;
	}

	.qna-top-container .qna-user-image {
		width: 44px;
		height: 44px;
	}

	.qna-top-container .user-reply-container {
		border-collapse: collapse;
		padding: 10px 5px 0 10px;
	}

	.qna-top-container .action-link-container {
		margin-top: 4px;
	}

	.qna-top-container .action-link {
		margin-right: 10px;
	}

	@media (width >= 520px) {
		.ms-Dialog-main.QnAAskQuestionDialog {
			max-width: 500px;
		}

		.ms-Dialog-main.QnAAskQuestionDialog
			.ask-question-text {
			min-width: 444px;
		}
	}

	.ms-Dialog-main.QnAAskQuestionDialog
		.qna-write-review-privacy {
		color: rgb(0 0 0 / 55%);
		color: var(--text-secondary-color, rgb(0 0 0 / 55%));
		font-size: 12px;
	}

	.ms-Dialog-main.QnAAskQuestionDialog .user-img {
		vertical-align: top;
		padding-right: 5px;
		padding-bottom: 14px;
	}

	.ms-Dialog-main.QnAAskQuestionDialog .user-reviews {
		padding-right: 5px;
		padding-bottom: 14px;
	}

	.ms-Dialog-main.QnAAskQuestionDialog .qna-user-image {
		width: 44px;
		height: 44px;
	}

	.ms-Dialog-main.QnAAskQuestionDialog
		.save-progress-spinner {
		position: absolute;
		top: 45%;
		left: 45%;
	}

	.ms-Dialog-main.QnAAskQuestionDialog .invisibleButton {
		display: none;
	}

	.ux-section-details-tabs .qna-top-container {
		width: 100%;
	}

	.qna-top-container {
		display: inline-block;
		margin-bottom: 34px;
		width: 700px;
	}

	.qna-top-container .qna-header-container {
		padding-left: 0;
	}

	.qna-top-container button.ask-question-button {
		float: right;
	}

	.qna-top-container .ask-question-button-container {
		padding-right: 0;
	}

	.qna-top-container .see-more-qna-section {
		padding-right: 0;
	}

	.qna-top-container .see-more-qna-section button {
		float: right;
		margin-top: 20px;
	}

	.qna-top-container
		.see-more-qna-section
		.qna-loading-more-error-message {
		margin-top: 20px;
		min-width: 700px;
	}

	.qna-top-container
		.see-more-qna-section
		.qna-loading-more-qna-container {
		margin-top: 20px;
	}

	.qna-top-container .qna-container-row {
		border-bottom: 1px solid;
		border-width: 1px 0;
		border-bottom-color: rgb(234 234 234 / 100%);
		border-bottom-color: rgba(
			var(--palette-neutral-8, 234, 234, 234),
			1
		);
		border-collapse: collapse;
		padding-bottom: 10px;
	}

	.qna-top-container h2 {
		display: block;
		margin-top: 0;
		margin-bottom: 0;
		font-size: 20px;
	}

	.qna-top-container .no-questions-found-text {
		font-size: 14px;
	}

	.qna-top-container .qna-loading-container {
		margin-top: 20px;
	}

	.qna-top-container .qna-noitems-or-error-message {
		margin: 14px -8px 0;
		min-width: 700px;
	}

	.qna-top-container
		.qna-redirection-message-bar-container {
		margin-top: 14px;
		background-color: rgb(244 244 244 / 100%);
		background-color: rgba(
			var(--palette-neutral-4, 244, 244, 244),
			1
		);
		padding-top: 15px;
		padding-bottom: 15px;
		color: rgb(0 0 0 / 90%);
		color: var(--text-primary-color, rgb(0 0 0 / 90%));
	}

	.qna-top-container
		.qna-redirection-message-bar-container
		.qna-redirection-message-bar {
		font-size: 14px;
	}

	.qna-top-container
		.qna-redirection-message-bar-container
		.qna-redirection-message-bar
		.qna-redirection-info-icon {
		padding-right: 8px;
		padding-left: 8px;
		color: rgb(0 0 0 / 90%);
		color: var(--text-primary-color, rgb(0 0 0 / 90%));
	}

	.qna-top-container .qna-question-row {
		border-bottom: 1px solid;
		border-width: 1px 0;
		border-bottom-color: rgb(234 234 234 / 100%);
		border-bottom-color: rgba(
			var(--palette-neutral-8, 234, 234, 234),
			1
		);
		border-collapse: collapse;
	}

	.qna-top-container .qna-question-bottom-margin {
		margin-bottom: 10px;
	}

	.qna-top-container .user-question-container {
		border-collapse: collapse;
		padding: 10px 5px 10px 10px;
	}

	.qna-top-container .seemore-seeless-links {
		margin-top: 5px;
	}

	.qna-top-container .read-more-table-container {
		width: 98%;
	}

	.qna-top-container .flag-table-container {
		vertical-align: top;
		float: right;
	}

	.qna-top-container .qna-table {
		width: 100%;
		table-layout: fixed;
	}

	.ms-Dialog-inner .user-reviews .read-more-container {
		width: 370px;
	}

	.read-more-container {
		word-wrap: break-word;
	}

	.user-name-div {
		display: inline-block;
		color: rgb(0 0 0 / 55%);
		color: var(--text-secondary-color, rgb(0 0 0 / 55%));
		font-size: 12px;
	}

	@media (width >= 520px) {
		.ms-Dialog-main.ReviewDialog {
			max-width: 500px;
		}

		.ms-Dialog-main.ReviewDialog .reply-text {
			margin-top: 12px;
			min-width: 444px;
		}

		.ms-Dialog-main.ReviewDialog .reviews-row {
			padding-top: 0;
			min-width: 444px;
		}
	}

	.comments-mandatory-message {
		color: #e50000;
		font-size: 12px;
	}

	.ms-Dialog-main.ReviewDialog .write-review-privacy {
		color: rgb(0 0 0 / 55%);
		color: var(--text-secondary-color, rgb(0 0 0 / 55%));
		font-size: 12px;
	}

	.ms-Dialog-main.ReviewDialog .save-progress-spinner {
		position: absolute;
		top: 45%;
		left: 45%;
	}

	.gallery-dialog .rating-control .ms-Rating-star {
		margin-top: -5px;
		padding-bottom: 5px;
	}

	.gallery-dialog
		.rating-control
		.review-container
		.ms-Rating-star {
		margin-top: 0;
		padding-bottom: 0;
	}

	.gallery-dialog
		.rating-control
		.ms-Rating-star
		button.ms-Rating-button {
		font-size: 24px;
		line-height: 24px;
	}

	.gallery-dialog
		.rating-control
		.ms-Rating-star
		button.ms-Rating-button:focus {
		outline: 1px solid rgb(102 102 102 / 100%);
		outline: 1px solid
			rgba(var(--palette-neutral-60, 102, 102, 102), 1);
	}

	.gallery-dialog
		.rating-control
		.ms-Rating-star
		button.ms-Rating-button
		.ms-RatingStar-front {
		color: #c0442e;
	}

	.gallery-dialog
		.rating-control
		.ms-Rating-star
		button.ms-Rating-button
		.ms-RatingStar-back {
		color: #d2d2d2;
	}

	@media screen and (-ms-high-contrast: active) {
		.gallery-dialog
			.rating-control
			.ms-Rating-star
			button.ms-Rating-button:hover,
		.gallery-dialog
			.rating-control
			.ms-Rating-star
			button.ms-Rating-button:focus {
			border: 0 !important;
		}

		.gallery-dialog
			.rating-control
			.ms-Rating-star
			button.ms-Rating-button
			.ms-RatingStar-front {
			color: #c0442e;
		}

		.gallery-dialog
			.rating-control
			.ms-Rating-star
			button.ms-Rating-button
			.ms-RatingStar-back {
			color: #d2d2d2;
		}
	}

	.gallery-dialog
		.review-container
		.rating-control
		.ms-Rating {
		margin-top: 0;
		padding-bottom: 0;
	}

	.invisibleButton {
		display: none;
	}

	.rnr-top-container .reviews-row .reply-row {
		margin-top: 10px;
		border-top: 1px solid;
		border-top-color: rgb(234 234 234 / 100%);
		border-top-color: rgba(
			var(--palette-neutral-8, 234, 234, 234),
			1
		);
		padding-top: 5px;
	}

	.rnr-top-container
		.reviews-row
		.reply-row
		.publisher-image-column {
		vertical-align: top;
		border-collapse: collapse;
		padding-top: 3px;
		text-align: center;
	}

	.rnr-top-container
		.reviews-row
		.reply-row
		.publisher-image-column
		.publisher-image {
		width: 44px;
		height: 44px;
	}

	.rnr-top-container
		.reviews-row
		.reply-row
		.ux-publisher-name {
		font-weight: 700;
		font-size: 14px;
	}

	.rnr-top-container
		.reviews-row
		.reply-row
		.ux-updated-date {
		color: #666666;
		font-size: 12px;
	}

	.rnr-top-container
		.reviews-row
		.reply-row
		.reply-container {
		width: 100%;
	}

	.rnr-top-container
		.reviews-row
		.reply-row
		.read-more-container {
		margin-top: 12px;
		margin-bottom: 10px;
	}

	.rnr-top-container
		.reviews-row
		.reply-row
		.edit-action-link {
		height: 15px;
		font-size: 12px;
	}

	.rnr-top-container {
		display: inline-block;
		margin-bottom: 34px;
		width: 100%;
	}

	.rnr-top-container .rnr-loading-container {
		margin-top: 20px;
	}

	.rnr-top-container .user-reviews-section-header {
		display: block;
		margin-top: 0.83em;
		margin-bottom: 0.5em;
		margin: 0;
		padding-left: 0;
		font-size: 20px;
	}

	.rnr-top-container .rnr-container-row {
		border-bottom: 1px solid;
		border-width: 1px 0;
		border-bottom-color: rgb(234 234 234 / 100%);
		border-bottom-color: rgba(
			var(--palette-neutral-8, 234, 234, 234),
			1
		);
		border-collapse: collapse;
		padding-bottom: 10px;
	}

	.rnr-top-container .rnr-container-row .average-rating {
		padding-top: 10px;
	}

	.rnr-top-container .rnr-container-row .rating-count {
		padding-top: 10px;
		padding-left: 0;
	}

	.rnr-top-container
		.rnr-container-row
		.write-review-button-container {
		float: right;
		padding-right: 0;
	}

	.rnr-top-container
		.rnr-container-row
		.report-review-button-container {
		float: right;
		padding-right: 0;
	}

	.rnr-top-container .rnr-container-row .organize-buttons {
		display: inline;
	}

	.rnr-top-container .rnr-loading-more {
		margin-top: 10px;
	}

	.rnr-top-container .see-more-button button {
		float: right;
		margin-top: 20px;
	}

	.rnr-top-container
		.rating-control
		.ms-Rating-star
		button.ms-Rating-button {
		font-size: 11px;
		line-height: 11px;
	}

	.rnr-top-container
		.rating-control
		.ms-Rating-star
		button.ms-Rating-button
		.ms-RatingStar-front {
		color: #c0442e;
	}

	.rnr-top-container
		.rating-control
		.ms-Rating-star
		button.ms-Rating-button
		.ms-RatingStar-back {
		color: #d2d2d2;
	}

	@media screen and (-ms-high-contrast: active) {
		.rnr-top-container
			.rating-control
			.ms-Rating-star
			button.ms-Rating-button {
			border: 0 !important;
		}

		.rnr-top-container
			.rating-control
			.ms-Rating-star
			button.ms-Rating-button:hover,
		.rnr-top-container
			.rating-control
			.ms-Rating-star
			button.ms-Rating-button:focus {
			border: 0 !important;
		}

		.rnr-top-container
			.rating-control
			.ms-Rating-star
			button.ms-Rating-button
			.ms-RatingStar-front {
			color: #c0442e;
		}

		.rnr-top-container
			.rating-control
			.ms-Rating-star
			button.ms-Rating-button
			.ms-RatingStar-back {
			color: #d2d2d2;
		}
	}

	.reviews-row {
		border-bottom: 1px solid;
		border-width: 1px 0;
		border-bottom-color: rgb(234 234 234 / 100%);
		border-bottom-color: rgba(
			var(--palette-neutral-8, 234, 234, 234),
			1
		);
		border-collapse: collapse;
		padding-top: 10px;
		padding-bottom: 10px;
	}

	.reviews-row .review-container {
		padding-right: 0;
		padding-left: 4px;
	}

	.reviews-row .rnr-user-image-column {
		vertical-align: top;
		border-collapse: collapse;
		padding-top: 5px;
		text-align: center;
	}

	.reviews-row .rnr-user-image-column .rnr-user-image {
		width: 44px;
		height: 44px;
	}

	.reviews-row .ux-user-name {
		font-weight: 700;
		font-size: 14px;
	}

	.reviews-row .ux-updated-date {
		color: #666666;
		font-size: 12px;
	}

	.reviews-row .review-container .rating-control {
		padding-top: 1px;
		font-size: 11px;
	}

	.reviews-row
		.review-container
		.rating-control
		.ms-Rating-star {
		margin-top: 0;
		outline: 0;
		padding-bottom: 0;
	}

	.reviews-row
		.review-container
		.rating-control
		.ms-Rating-star
		.ms-Rating-button {
		outline: 0 !important;
		border: 0 !important;
		padding: 0;
		height: 100%;
		font-size: 12px;
		line-height: 12px;
	}

	.reviews-row .striked::after {
		position: absolute;
		top: 50%;
		right: 0;
		left: 0;
		border-top: 1px solid;
		content: '';
	}

	.reviews-row .reply-action-link {
		height: 15px;
		font-size: 12px;
	}

	.reviews-row .read-more-container {
		margin-top: 12px;
		margin-bottom: 10px;
	}

	.reviews-row .flag-table-container {
		float: right;
		padding-right: 6px;
	}

	.reviews-row .reply-readMore {
		width: 100%;
	}

	.ms-Dialog-inner .reviews-row {
		border: none;
	}

	.ms-Dialog-inner .reviews-row .rnr-user-image-column {
		width: 12%;
	}

	.ms-Dialog-inner .reviews-row .rnr-review-column {
		width: 88%;
	}

	.ms-Dialog-inner .reviews-row .read-more-container {
		width: 370px;
	}

	.carousel-container {
		position: relative;
		margin: 0;
	}

	.carousel-wrapper,
	.carousel-wrapperHomePage {
		position: relative;
		overflow: hidden;
	}

	.carousel-wrapper:hover .carousel-nav a,
	.carousel-wrapperHomePage:hover .carousel-nav a {
		display: block;
	}

	.carousel {
		position: absolute;
		/* Carousel item */
	}

	.carousel .carousel-item {
		float: left;
		margin-top: 16px;
		margin-right: 12.5px;
		margin-left: 1px;
	}

	.carousel .carousel-item:nth-last-child(1) {
		/*this is the first one so shift it to the left*/
		margin-right: 0;
	}

	.item-carousel.images .carousel .carousel-item {
		float: left;
		margin: 0;
		padding: 0;
	}

	/*
      The following style will change as we progess in making our view more close to the requirement
  */
	.carousel-spinner {
		position: absolute;
		top: 45%;
		left: 48.5%;
		vertical-align: middle;
		margin: auto;
		background: url('../../_content/big-progress.gif');
		width: 36px;
		height: 36px;
	}

	.carousel-nav a {
		position: absolute;
		top: 50%;
		z-index: 10;
		margin-top: -20px;
		padding: 2px 0 0;
		color: rgb(0 90 158 / 100%);
		color: var(
			--communication-foreground,
			rgb(0 90 158 / 100%)
		);
		font-weight: 100;
		font-size: 40px;
		font-family: monospace;
		text-align: center;
		text-decoration: none;
	}

	.carousel-nav a:hover {
		opacity: 100%;
		background-color: #e2e1e1;
		width: 38px;
		height: auto;
		color: #000000;
	}

	.carousel-nav a .bowtie-icon.bowtie-chevron-left {
		font-size: 38px;
	}

	.carousel-nav a .bowtie-icon.bowtie-chevron-right {
		font-size: 38px;
	}

	.carousel-nav a.disabled {
		color: #d5d5d5;
	}

	.carousel-nav a.disabled:hover {
		color: #d5d5d5;
	}

	.carousel-nav .carousel-prev {
		left: -40px;
	}

	.carousel-nav .carousel-next {
		right: -40px;
	}

	.carousel-indicators {
		margin-top: 5px;
		text-align: center;
	}

	.carousel-indicators .indicator {
		display: inline-block;
		margin-right: 12px;
		border: 1px solid;
		border-radius: 50%;
		background: rgb(0 0 0 / 30%);
		width: 12px;
		height: 12px;
	}

	.carousel-indicators .indicator.active,
	.carousel-indicators .indicator:hover {
		background: rgb(0 0 0 / 80%);
	}

	.flag-control {
		color: rgb(0 0 0 / 55%);
		color: var(--text-secondary-color, rgb(0 0 0 / 55%));
		font-size: 14px;
	}

	.flag-control:focus {
		color: rgb(0 69 120 / 100%);
		color: rgba(
			var(--palette-primary-shade-30, 0, 69, 120),
			1
		);
	}

	.flag-control:hover {
		cursor: pointer;
		color: rgb(0 69 120 / 100%);
		color: rgba(
			var(--palette-primary-shade-30, 0, 69, 120),
			1
		);
	}

	.link-as-button {
		height: initial;
	}

	.link-as-button:hover {
		text-decoration: underline;
	}

	.certified-badge-container {
		display: flex;
		flex-direction: row;
		margin-right: 6px;
	}

	.certified-badge-container .certified-badge-image {
		color: inherit !important;
		font-size: 17px;
		line-height: 17px;
	}

	.certified-badge-container
		.certified-badge-image
		.certified-badge-foreground {
		position: absolute;
		padding-left: 4px;
	}

	.certified-badge-container .certified-badge-text {
		margin-left: 3px;
		border-width: 1px;
		border-style: solid;
		border-color: rgb(200 200 200 / 100%);
		border-color: rgba(
			var(--palette-neutral-20, 200, 200, 200),
			1
		);
		border-radius: 13px;
		padding: 0 9px 0 16px;
		height: 18px;
		color: inherit !important;
		font-weight: 600;
		font-size: 11px;
	}

	.optIn-bar {
		padding: 8px 0 !important;
	}

	.optIn-bar .optIn-action-button {
		height: auto;
	}

	.react-read-more-text {
		font-size: 14px;
		white-space: pre-line;
	}

	.verified-domain-icon-container {
		display: flex;
		flex-direction: row;
		margin-right: 6px;
		margin-right: 10;
		color: #0078d4;
		font-size: 17px;
		line-height: 17px;
	}

	.verified-domain-icon-container
		.verified-domain-icon-background {
		position: absolute;
		color: #ffffff;
		line-height: 15px;
	}

	.verified-domain-icon-container
		.verified-domain-icon-foreground {
		position: absolute;
		z-index: 1;
		line-height: 15px;
	}

	.verified-publisher-domain-url {
		margin-left: 25px;
		font-size: 16px;
	}

	.ux-section-banner
		.item-header-content.dark
		a.verified-publisher-domain-url {
		color: white;
		text-decoration: underline;
	}

	.verified-publisher-domain-container {
		line-height: 13px;
	}

	.ux-section-capabilities .capabilities-list-item {
		margin-bottom: 4px;
		color: #666;
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
