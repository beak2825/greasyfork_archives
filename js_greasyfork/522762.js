// ==UserScript==
// @name Scrap.TF Black Theme [Updated]
// @namespace typpi.online
// @version 1.0.4
// @description Black theme for Scrap.TF
// @author Nick2bad4u
// @homepageURL https://github.com/Nick2bad4u/UserStyles
// @supportURL https://github.com/Nick2bad4u/UserStyles/issues
// @license UnLicense
// @grant GM_addStyle
// @run-at document-start
// @include https://scrap.tf*/*
// @include https://dev.scrap.tf*/*
// @downloadURL https://update.greasyfork.org/scripts/522762/ScrapTF%20Black%20Theme%20%5BUpdated%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/522762/ScrapTF%20Black%20Theme%20%5BUpdated%5D.meta.js
// ==/UserScript==

(function() {
let css = `
	/* General & Nav */
	body {
		color: #eee;
	}

	a {
		color: #0ce3ac;
	}

	a:hover,
	a:focus {
		color: #0ce3ac;
		text-decoration: underline;
	}

	.big-logo {
		filter: invert(1) hue-rotate(180deg);
	}

	.navbar-default,
	.auction-hints,
	.page-theme-light {
		background-color: #060606 !important;
	}

	#pid-index .welcome {
		filter: invert(1) hue-rotate(180deg);
	}

	nav .iconic::before {
		color: rgb(229 229 229 / 5%);
	}

	.dropdown-header,
	.input-group-addon {
		color: #ddd;
	}

	.navbar-default .navbar-nav > li > a,
	.yamm-content li > a {
		color: #ccc;
	}

	.navbar-nav > li > a:not(.nav-userdropdown):hover,
	.navbar-nav > li > a:not(.nav-userdropdown):focus,
	.yamm-content li > a:hover,
	.yamm-content li > a:focus {
		background-color: #1b1b1b !important;
		text-decoration: none;
	}

	.dropdown-menu,
	.select2-drop,
	.auction-table {
		background-color: #060606;
	}

	.dropdown-menu > li > a {
		color: #ccc;
	}

	.navbar .nav ul a:hover {
		background-color: rgb(136 134 134 / 15%) !important;
	}

	.dropdown-menu .badge {
		background-color: #060606;
	}

	.dropdown-menu .divider {
		background-color: #060606;
	}

	.yamm-row2 {
		border-top: 1px solid #444;
	}

	.bg-warning,
	.raffle-mod,
	.input-group-addon {
		border-color: #464545;
		background: #060606;
	}

	.dropdown-menu > li > a:hover,
	.dropdown-menu > li > a:focus {
		color: #fff;
	}

	/* Forms */
	.form-group.focus .form-control,
	.form-control:focus,
	.form-group.focus .select2-search input[type='text'],
	.select2-search input[type='text']:focus {
		border-color: #888;
	}

	.form-control,
	.select2-search input[type='text'] {
		color: #eee;
	}

	/* Dropdowns */

	.select-primary .select2-choice {
		background: #060606;
	}

	.select-primary .select2-choice:hover,
	.select-primary .select2-choice.hover,
	.select-primary .select2-choice:focus,
	.select-primary .select2-choice:active {
		background: #555;
	}

	.select2-drop
		.select2-result-selectable
		.select2-result-label {
		color: #eee;
	}

	.select2-drop .select2-disabled {
		color: #aaa;
	}

	.select2-drop
		.select2-result-selectable
		.select2-result-label:focus,
	.select2-drop
		.select2-result-selectable
		.select2-result-label:hover,
	.select2-drop
		.select2-result-selectable
		.select2-result-label:active {
		background: #444;
	}

	.select2-drop
		.select2-highlighted
		> .select2-result-label {
		background: #666;
	}

	/* Buttons */
	.btn-default {
		border-color: #464545;
		background-color: #464545;
		color: #ffffff;
	}

	.btn-default:focus,
	.btn-default.focus {
		border-color: #060606;
		background-color: #2c2c2c;
		color: #ffffff;
	}

	.btn-default:hover {
		border-color: #272727;
		background-color: #2c2c2c;
		color: #ffffff;
	}

	.btn-default:active,
	.btn-default.active,
	.open > .dropdown-toggle.btn-default {
		border-color: #272727;
		background-color: #2c2c2c;
		color: #ffffff;
	}

	.btn-default:active:hover,
	.btn-default.active:hover,
	.open > .dropdown-toggle.btn-default:hover,
	.btn-default:active:focus,
	.btn-default.active:focus,
	.open > .dropdown-toggle.btn-default:focus,
	.btn-default:active.focus,
	.btn-default.active.focus,
	.open > .dropdown-toggle.btn-default.focus {
		border-color: #060606;
		background-color: #1a1a1a;
		color: #ffffff;
	}

	.btn-default:active,
	.btn-default.active,
	.open > .dropdown-toggle.btn-default {
		background-image: none;
	}

	.btn-default.disabled:hover,
	.btn-default[disabled]:hover,
	fieldset[disabled] .btn-default:hover,
	.btn-default.disabled:focus,
	.btn-default[disabled]:focus,
	fieldset[disabled] .btn-default:focus,
	.btn-default.disabled.focus,
	.btn-default[disabled].focus,
	fieldset[disabled] .btn-default.focus {
		border-color: #464545;
		background-color: #464545;
	}

	.btn-default .badge {
		background-color: #ffffff;
		color: #464545;
	}

	.btn-primary {
		border-color: #375a7f;
		background-color: #375a7f;
		color: #ffffff;
	}

	.btn-primary:focus,
	.btn-primary.focus {
		border-color: #101b26;
		background-color: #28415b;
		color: #ffffff;
	}

	.btn-primary:hover {
		border-color: #253c54;
		background-color: #28415b;
		color: #ffffff;
	}

	.btn-primary:active,
	.btn-primary.active,
	.open > .dropdown-toggle.btn-primary {
		border-color: #253c54;
		background-color: #28415b;
		color: #ffffff;
	}

	.btn-primary:active:hover,
	.btn-primary.active:hover,
	.open > .dropdown-toggle.btn-primary:hover,
	.btn-primary:active:focus,
	.btn-primary.active:focus,
	.open > .dropdown-toggle.btn-primary:focus,
	.btn-primary:active.focus,
	.btn-primary.active.focus,
	.open > .dropdown-toggle.btn-primary.focus {
		border-color: #101b26;
		background-color: #1d2f43;
		color: #ffffff;
	}

	.btn-primary:active,
	.btn-primary.active,
	.open > .dropdown-toggle.btn-primary {
		background-image: none;
	}

	.btn-primary.disabled:hover,
	.btn-primary[disabled]:hover,
	fieldset[disabled] .btn-primary:hover,
	.btn-primary.disabled:focus,
	.btn-primary[disabled]:focus,
	fieldset[disabled] .btn-primary:focus,
	.btn-primary.disabled.focus,
	.btn-primary[disabled].focus,
	fieldset[disabled] .btn-primary.focus {
		border-color: #375a7f;
		background-color: #375a7f;
	}

	.btn-primary .badge {
		background-color: #ffffff;
		color: #375a7f;
	}

	.btn-success {
		border-color: #00bc8c;
		background-color: #00bc8c;
		color: #ffffff;
	}

	.btn-success:focus,
	.btn-success.focus {
		border-color: #003d2d;
		background-color: #008966;
		color: #ffffff;
	}

	.btn-success:hover {
		border-color: #007f5e;
		background-color: #008966;
		color: #ffffff;
	}

	.btn-success:active,
	.btn-success.active,
	.open > .dropdown-toggle.btn-success {
		border-color: #007f5e;
		background-color: #008966;
		color: #ffffff;
	}

	.btn-success:active:hover,
	.btn-success.active:hover,
	.open > .dropdown-toggle.btn-success:hover,
	.btn-success:active:focus,
	.btn-success.active:focus,
	.open > .dropdown-toggle.btn-success:focus,
	.btn-success:active.focus,
	.btn-success.active.focus,
	.open > .dropdown-toggle.btn-success.focus {
		border-color: #003d2d;
		background-color: #00654b;
		color: #ffffff;
	}

	.btn-success:active,
	.btn-success.active,
	.open > .dropdown-toggle.btn-success {
		background-image: none;
	}

	.btn-success.disabled:hover,
	.btn-success[disabled]:hover,
	fieldset[disabled] .btn-success:hover,
	.btn-success.disabled:focus,
	.btn-success[disabled]:focus,
	fieldset[disabled] .btn-success:focus,
	.btn-success.disabled.focus,
	.btn-success[disabled].focus,
	fieldset[disabled] .btn-success.focus {
		border-color: #00bc8c;
		background-color: #00bc8c;
	}

	.btn-success .badge {
		background-color: #ffffff;
		color: #00bc8c;
	}

	.btn-info {
		border-color: #3498db;
		background-color: #3498db;
		color: #ffffff;
	}

	.btn-info:focus,
	.btn-info.focus {
		border-color: #16527a;
		background-color: #217dbb;
		color: #ffffff;
	}

	.btn-info:hover {
		border-color: #2077b2;
		background-color: #217dbb;
		color: #ffffff;
	}

	.btn-info:active,
	.btn-info.active,
	.open > .dropdown-toggle.btn-info {
		border-color: #2077b2;
		background-color: #217dbb;
		color: #ffffff;
	}

	.btn-info:active:hover,
	.btn-info.active:hover,
	.open > .dropdown-toggle.btn-info:hover,
	.btn-info:active:focus,
	.btn-info.active:focus,
	.open > .dropdown-toggle.btn-info:focus,
	.btn-info:active.focus,
	.btn-info.active.focus,
	.open > .dropdown-toggle.btn-info.focus {
		border-color: #16527a;
		background-color: #1c699d;
		color: #ffffff;
	}

	.btn-info:active,
	.btn-info.active,
	.open > .dropdown-toggle.btn-info {
		background-image: none;
	}

	.btn-info.disabled:hover,
	.btn-info[disabled]:hover,
	fieldset[disabled] .btn-info:hover,
	.btn-info.disabled:focus,
	.btn-info[disabled]:focus,
	fieldset[disabled] .btn-info:focus,
	.btn-info.disabled.focus,
	.btn-info[disabled].focus,
	fieldset[disabled] .btn-info.focus {
		border-color: #3498db;
		background-color: #3498db;
	}

	.btn-info .badge {
		background-color: #ffffff;
		color: #3498db;
	}

	.btn-warning {
		border-color: #f39c12;
		background-color: #f39c12;
		color: #ffffff;
	}

	.btn-warning:focus,
	.btn-warning.focus {
		border-color: #7f5006;
		background-color: #c87f0a;
		color: #ffffff;
	}

	.btn-warning:hover {
		border-color: #be780a;
		background-color: #c87f0a;
		color: #ffffff;
	}

	.btn-warning:active,
	.btn-warning.active,
	.open > .dropdown-toggle.btn-warning {
		border-color: #be780a;
		background-color: #c87f0a;
		color: #ffffff;
	}

	.btn-warning:active:hover,
	.btn-warning.active:hover,
	.open > .dropdown-toggle.btn-warning:hover,
	.btn-warning:active:focus,
	.btn-warning.active:focus,
	.open > .dropdown-toggle.btn-warning:focus,
	.btn-warning:active.focus,
	.btn-warning.active.focus,
	.open > .dropdown-toggle.btn-warning.focus {
		border-color: #7f5006;
		background-color: #a66908;
		color: #ffffff;
	}

	.btn-warning:active,
	.btn-warning.active,
	.open > .dropdown-toggle.btn-warning {
		background-image: none;
	}

	.btn-warning.disabled:hover,
	.btn-warning[disabled]:hover,
	fieldset[disabled] .btn-warning:hover,
	.btn-warning.disabled:focus,
	.btn-warning[disabled]:focus,
	fieldset[disabled] .btn-warning:focus,
	.btn-warning.disabled.focus,
	.btn-warning[disabled].focus,
	fieldset[disabled] .btn-warning.focus {
		border-color: #f39c12;
		background-color: #f39c12;
	}

	.btn-warning .badge {
		background-color: #ffffff;
		color: #f39c12;
	}

	.btn-danger {
		border-color: #e74c3c;
		background-color: #e74c3c;
		color: #ffffff;
	}

	.btn-danger:focus,
	.btn-danger.focus {
		border-color: #921e12;
		background-color: #d62c1a;
		color: #ffffff;
	}

	.btn-danger:hover {
		border-color: #cd2a19;
		background-color: #d62c1a;
		color: #ffffff;
	}

	.btn-danger:active,
	.btn-danger.active,
	.open > .dropdown-toggle.btn-danger {
		border-color: #cd2a19;
		background-color: #d62c1a;
		color: #ffffff;
	}

	.btn-danger:active:hover,
	.btn-danger.active:hover,
	.open > .dropdown-toggle.btn-danger:hover,
	.btn-danger:active:focus,
	.btn-danger.active:focus,
	.open > .dropdown-toggle.btn-danger:focus,
	.btn-danger:active.focus,
	.btn-danger.active.focus,
	.open > .dropdown-toggle.btn-danger.focus {
		border-color: #921e12;
		background-color: #b62516;
		color: #ffffff;
	}

	.btn-danger:active,
	.btn-danger.active,
	.open > .dropdown-toggle.btn-danger {
		background-image: none;
	}

	.btn-danger.disabled:hover,
	.btn-danger[disabled]:hover,
	fieldset[disabled] .btn-danger:hover,
	.btn-danger.disabled:focus,
	.btn-danger[disabled]:focus,
	fieldset[disabled] .btn-danger:focus,
	.btn-danger.disabled.focus,
	.btn-danger[disabled].focus,
	fieldset[disabled] .btn-danger.focus {
		border-color: #e74c3c;
		background-color: #e74c3c;
	}

	.btn-danger .badge {
		background-color: #ffffff;
		color: #e74c3c;
	}

	.btn-embossed {
		box-shadow: none;
	}

	/* Home Page */
	.flat-slate,
	.banking-row {
		background-color: #060606;
	}

	.price-hint {
		color: #ccc;
	}

	.stats-box {
		box-shadow: 0 3px 0 0 #252525;
		border-color: #404040;
		background: #303030;
	}

	.stats-box-title {
		color: #eee;
	}

	.stats-box-value,
	.stats-value-time-indicator {
		color: #fff;
	}

	/* Panels */
	.panel,
	.modal-content,
	.items-container,
	.form-control[disabled],
	.form-control[readonly],
	fieldset[disabled] .form-control {
		border-color: #464545;
		background-color: #060606;
	}

	.flat-block {
		border-color: #464545;
		background-color: #303030;
	}

	.panel-heading {
		border-color: #464545 !important;
		background-color: #464545 !important;
		color: #ffffff !important;
	}

	.report-user {
		background-color: #3a3a3a;
	}

	.report-log:not(:last-child) {
		border-color: #464545;
	}

	.panel-raffle {
		border-color: #464545;
		background: #313131;
	}

	/* Profiles */
	.well,
	.well-sm {
		border-color: #464545;
		background-color: #060606 !important;
		color: #ccc;
	}

	.profile-about {
		border-color: #444;
	}

	.raffle-commenters {
		border-color: #464545;
	}

	.form-control {
		border-color: #464545;
		background: #333;
	}

	.input-group-btn .btn-default {
		border-color: #464545;
		background-color: #292929;
	}

	.input-group-btn .btn-default:hover,
	.input-group-btn .btn-default.hover,
	.input-group-btn .btn-default:focus,
	.input-group-btn .btn-default:active,
	.input-group-btn .btn-default.active,
	.open > .dropdown-toggle.input-group-btn .btn-default {
		border-color: #464545;
		background-color: #444;
	}

	.profile-stat:not(:last-child) {
		border-color: #464545;
	}

	/* Raffles */
	.breadcrumb {
		background: #464545 !important;
	}

	.breadcrumb a {
		color: #fff;
	}

	.breadcrumb > .active {
		color: #999999;
	}

	.raffle-well {
		background: #060606 !important;
	}

	.raffle-message,
	.raffle-info-col,
	.raffle-box-row,
	.raffle-opts-row,
	.raffle-mod-row,
	.auction-bid-desc,
	.raffle-opts-row .col-xs-7,
	.raffle-user-col,
	#raffle-entry-list,
	.auction-items,
	.raffle-items,
	.raffle-winners,
	.search-items {
		border-color: #444;
		background: #060606;
	}

	.raffle-box-row {
		border-color: #444;
	}

	.raffle-index-list {
		border-color: #444;
	}

	/* Misc */
	.table *,
	.table-bordered {
		border-color: #464545 !important;
	}

	.table > thead > tr > th,
	.table > tbody > tr > th,
	.table > tfoot > tr > th {
		color: #fff;
	}

	.table-hover > tbody > tr:hover > td,
	.table-hover > tbody > tr:hover > th {
		background: #3c3c3c;
	}

	.table-striped > tbody > tr:nth-child(odd) > td,
	.table-striped > tbody > tr:nth-child(odd) > th {
		background-color: #313131;
	}

	.table-bordered > thead > tr > th,
	.table-bordered > tbody > tr > th,
	.table-bordered > tfoot > tr > th,
	.table-bordered > thead > tr > td,
	.table-bordered > tbody > tr > td,
	.table-bordered > tfoot > tr > td {
		border-color: #464545 !important;
	}

	.panel > .panel-body + .table,
	.panel > .panel-body + .table-responsive {
		border-color: #464545 !important;
	}

	.panel > .panel-body + .table,
	.panel > .panel-body + .table-responsive,
	.panel > .table + .panel-body,
	.panel > .table-responsive + .panel-body {
		border-color: #464545 !important;
	}

	.user-helper {
		background: #383838;
	}

	.pagination > ul,
	.dataTables_paginate > ul {
		background: #444;
	}

	.pagination li > a,
	.pagination li > span,
	.dataTables_paginate li > a,
	.dataTables_paginate li > span {
		border: none;
	}

	.pagination li > a:hover,
	.pagination li > span:hover,
	.pagination li > a:focus,
	.pagination li > span:focus,
	.dataTables_paginate li > a:hover,
	.dataTables_paginate li > span:hover,
	.dataTables_paginate li > a:focus,
	.dataTables_paginate li > span:focus {
		background: #555;
	}

	.pagination li.previous > a,
	.pagination li.next > a,
	.pagination li.previous > span,
	.pagination li.next > span,
	.dataTables_paginate li.previous > a,
	.dataTables_paginate li.next > a,
	.dataTables_paginate li.previous > span,
	.dataTables_paginate li.next > span {
		border: none;
	}

	.pagination li.active > a,
	.pagination li.active > span,
	.dataTables_paginate li.active > a,
	.dataTables_paginate li.active > span {
		background: #555;
	}

	.alert-info {
		border-color: rgb(188 232 241 / 14%);
		background-color: rgb(217 237 247 / 6%);
		color: #eee;
	}

	tr.effective td.status {
		background: rgb(74 255 0 / 7%) !important;
	}

	tr.expired td.status {
		background: rgb(255 0 0 / 8%) !important;
	}

	.ban_waitingreply {
		background-color: rgb(155 89 182 / 14%) !important;
	}

	pre {
		border-color: #464545;
		background-color: transparent;
	}

	.modal-header {
		border-color: #464545;
	}

	.modal-footer,
	.panel-footer,
	footer {
		border-color: #464545;
		background-color: #060606;
		color: #eee;
	}

	.rules-accept-real {
		color: #eee;
	}

	.rules-accept-real:hover {
		color: #eee;
		text-decoration: none;
	}

	.rules-content .bg-info {
		background-color: #2c4d61;
	}

	.help-bg,
	.help-tab-content {
		background: #333;
	}

	.bg-danger {
		background-color: rgb(255 64 64 / 11%);
	}

	.jumbotron {
		background: #3c3c3c;
	}

	.panel-info
		> .panel-heading
		+ .panel-collapse
		> .panel-body {
		border-color: #464545;
	}

	.tab-content {
		border-color: #464545;
	}

	.raffle-hints {
		background-color: #383838;
	}

	/* Search */
	.search-outside .popover {
		background-color: #555;
	}

	.search-outside .popover.bottom > .arrow::after {
		border-bottom-color: #555;
	}

	/* Priority */
	.donation-item h1 {
		color: #eee;
	}

	.donation-item {
		border-color: #777;
		color: #ddd;
	}

	/* IDK */
	.checkbox
		input[type='checkbox'].custom-checkbox:indeterminate
		+ .icons::before,
	.radio
		input[type='checkbox'].custom-checkbox:indeterminate
		+ .icons::before,
	.checkbox
		input[type='radio'].custom-radio:indeterminate
		+ .icons::before,
	.radio
		input[type='radio'].custom-radio:indeterminate
		+ .icons::before {
		content: '';
	}

	@media (width >= 768px) {
		.nav-tabs > li.active > a,
		.nav-tabs > li.active > a:hover,
		.nav-tabs > li.active > a:focus {
			border-color: #303030;
			background-color: #303030;
			color: #ddd;
		}
	}

	.bootstrap-tagsinput {
		border-color: #464545;
		background: #333;
	}

	.bootstrap-tagsinput input[type='text'] {
		color: #eee;
	}

	.bootstrap-tagsinput .tag {
		background: #464545;
		color: #eee;
	}

	#generic-modal-helpcontent .panel-body {
		color: #eee;
	}

	/* For WebKit browsers (e.g., Chrome, Safari) */
	::-webkit-scrollbar {
		width: 12px;
	}

	::-webkit-scrollbar-track {
		border-radius: 0 !important;
		background: #000 !important;
	}

	::-webkit-scrollbar-thumb {
		border: 3px solid #ff7830 !important;
		border-radius: 6px !important;
		background-color: #000 !important;
	}

	/* For Edge, IE */
	body {
		-ms-overflow-style: -ms-autohiding-scrollbar;
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
