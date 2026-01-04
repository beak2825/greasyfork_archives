// ==UserScript==
// @name          MTurk Worker Site Dark Theme [BETA]
// @namespace     http://userstyles.org
// @description	  A dark theme to counter the bright white of the worker side of MTurk. Viewable on https://worker.mturk.com/ and any sub-pages, not the old MTurk site. This theme is currently incomplete and is in BETA.<br><br>
// @author        Trickydude24
// @homepage      https://userstyles.org/styles/149148
// @include       http://worker.mturk.com/*
// @include       http://www.mturk.com/*
// @include       https://www.mturk.com/*
// @include       https://worker.mturk.com/*
// @include       http://*.worker.mturk.com/*
// @include       https://*.worker.mturk.com/*
// @include       https://worker.mturk.com/overwatch
// @include       https://worker.mturk.com/status*
// @run-at        document-start
// @version       0.20171009193010
// @downloadURL https://update.greasyfork.org/scripts/34002/MTurk%20Worker%20Site%20Dark%20Theme%20%5BBETA%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/34002/MTurk%20Worker%20Site%20Dark%20Theme%20%5BBETA%5D.meta.js
// ==/UserScript==
(function() {var css = "";
if (false || (document.domain == "worker.mturk.com" || document.domain.substring(document.domain.indexOf(".worker.mturk.com") + 1) == "worker.mturk.com"))
	css += [
		"/* Main Body */",
		"body {background-color: #2d2d2d; color: #fff;}",
		".me-bar {background-color: #272727;}",
		".col-xs-7 {color: #d2d2d2;}",
		".cols-sx-12 {background-color: red;}",
		".copy-container .fa-copy {color: #F49800;}",
		".sub-nav {border-bottom: 1px solid #4c4c4c;}",
		".mturk-alert {color: #d2d2d2}",
		".project-detail-bar {background-color: #272727;}",
		"",
		"/* \"No Hits Accepted\" Text */",
		".no-result-row {color: #d2d2d2;}",
		"",
		"/* Links */",
		"a {color: #fff;}",
		"a:hover {color: #d2d2d2;}",
		"a.show-visited:visited, a.visited {color: #737373;}",
		".navbar-sub-nav .nav-item.active a {color: #d2d2d2;}",
		"",
		"/* Page Navigation Buttons */",
		"nav.mturk-pagination ul li.page-item.disabled.text-only span {background-color: transparent; padding: 10px;}",
		"nav.mturk-pagination ul li.page-item.disabled span.btn {background-color: #2d2d2d; padding: 10px;}",
		"nav.mturk-pagination .page-link {background-color: #2d2d2d; color: red; padding: 10px;}",
		"nav.mturk-pagination ul li.page-item span, nav.mturk-pagination ul li.page-item a {color: #d2d2d2;}",
		"",
		"/* Table Row Colors */",
		".table-row, .mturk-table {color: #d2d2d2;}",
		".table-row {color: #d2d2d2;}",
		".table-row:hover {background-color: #525252;}",
		".table-row .expanded-row {background-color: #525252; color: #d2d2d2;}",
		".table-row:hover, .table-row.expanded {background-color: #525252;}",
		"ol.table-frame>li {border-bottom: 1px solid #4c4c4c;}",
		"table.mturk-table tr:hover td {background-image: none; background: #525252; color: #d2d2d2;}",
		"table.mturk-table tr td {border-bottom: 1px solid #4c4c4c;}",
		"",
		"/* Accept & Work Buttons */",
		".accept-qualify-container a.btn.work-btn  {background-color: #2d2d2d; border: 1px solid #FABA70; color: #d2d2d2;}",
		".accept-qualify-container a.btn.work-btn:hover {background-color: #FABA70; border: 1px solid #2d2d2d; color: #2d2d2d;}",
		".accept-qualify-container a.btn.work-btn:visited {background-color: #2d2d2d; border: 1px solid #FABA70; color: #d2d2d2;}",
		".hit-set-table-row:hover .accept-qualify-container a.btn.work-btn:visited  {background-color: #FABA70; border: 1px solid #2d2d2d; color: #2d2d2d;}",
		"",
		"/* Primary Button (Transfer Earnings, Apply, Accept, Get Time, Work, etc.) */",
		".btn-primary {background-color: #2d2d2d; border: 1px solid #FABA70; color: #d2d2d2;}",
		".btn-primary:hover {background-color: #FABA70; border: 1px solid #2d2d2d; color: #2d2d2d;}",
		"",
		"/* Secondary Button (Skip, Cancel, Dropdown boxes, etc.) */",
		".btn-secondary, select.form-control {background-color: #2d2d2d; border: 1px solid #888; color: #d2d2d2;}",
		".btn-secondary:hover, select.form-control:hover {background-color: #BBB; border: 1px solid #2d2d2d; color: #2d2d2d;}",
		"",
		"/* Qualifications in HIT Details */",
		"ol.qualifications-list li:nth-child(odd), ol.qualifications-list li:nth-child(even) {background-color: #3d3d3d;}",
		"",
		".project-detail-bar .detail-bar-label, .project-detail-bar .detail-bar-value {color: #d2d2d2;}",
		"",
		"/* Search Box */",
		".mturk-searchbox .search-input {background-color: #2d2d2d; color: #d2d2d2; border: 0px dashed #d2d2d2;}",
		"/* Search Button */",
		".input-group {background-color: #2d2d2d; border: 1px dotted #292929; color: #d2d2d2;}",
		".mturk-searchbox .search-button-holder {background-color: #2d2d2d; border: 0px dashed #d2d2d2; color: #d2d2d2;}",
		".searchbox-form .search-icon-svg .outer-ring {fill: #d2d2d2;}",
		".mturk-searchbox .search-button-holder:hover .searchbox-form .search-icon-svg .outer-ring:hover {fill: #2d2d2d;}",
		"",
		"/* Filter Box */",
		".modal-header {background-color: #2d2d2d;}",
		".modal-title {color: #d2d2d2;}",
		".modal-body {background-color: #2d2d2d;}",
		".modal-open .modal-footer {background-color: #2d2d2d;}",
		".form-control {background-color: #2d2d2d; color: #d2d2d2;}",
		"",
		"/* Captcha Section */",
		".captcha-row {background-image: none;}",
		"",
		"/* Report Box */",
		".report-task-popup {background-color: #2d2d2d;}",
		".why-report-content {color: #d2d2d2;}",
		".report-task-container i.fa {color: #d2d2d2;}",
		"",
		"/* Footer */",
		"footer {background: #272727;}",
		"",
		"/*                        */",
		"/* 3RD PARTY SCRIPTS BELOW*/",
		"/*                        */",
		"",
		"/* MTS Color Tweaks */",
		"#tpe_earnings {color: #78d043;}"
	].join("\n");
if (false || (location.href.replace(location.hash,'') == "https://worker.mturk.com/overwatch"))
	css += [
		"/* Excludes Overwatch script from taking the above styles. Values below are Overwatch\'s defaults. */",
		"body {background-color: rgb(55,59,68); color: black;}",
		"a {color: #146EB4;}"
	].join("\n");
if (false || (document.location.href.indexOf("https://worker.mturk.com/status") == 0))
	css += [
		"/* Theme fixes for Service Health page */",
		"body {color: #d2d2d2;}",
		".shdb {background-color: #2d2d2d;}",
		".shdb hr {background-color: #2d2d2d; border-top: 3px solid #4b4b4b;}",
		"img[src*=\"logo.png\"] {display: none;}",
		".shdb h1.service-health-dashboard-title {color: #F49800; margin: 0px;}",
		"",
		"/* Links */",
		".shdb a {color: #F49800; text-decoration: none;}",
		".shdb a:hover {color: #d2d2d2; text-decoration: underline;}",
		".shdb a:visited {color: #F49800; text-decoration: none;}",
		"    ",
		"/* Tables */",
		".table-outer-shell {background-image: none; background-color: #272727; border: 1px solid #4b4b4b; padding: 0px;}",
		".table-outer-shell .table-inner-shell {background-color: #2d2d2d; border: 0px;}",
		".table-outer-shell table {background-color: #2d2d2d;}",
		".table-outer-shell table th {background-image: none; background-color: #272727; color: #d2d2d2; border-bottom: 1px solid #363636;}",
		".table-outer-shell table th, .table-outer-shell table td {border-bottom: 1px solid #363636;}",
		"",
		".key-legend {border: 1px dashed #4b4b4b; width: auto;}",
		"",
		".history-table {border: 0px;}",
		"/* WIP - Will need image replacement here",
		".history-table .nav-button {background-image: none;}",
		".history-table .nav-button .btn.left-btn.disabled {background-image: none;}",
		".history-table .nav-button .btn.right-btn {background-image: none;} */",
		"",
		".service-name {background-image: none; background-color: #272727; color: #d2d2d2; border: 0px;}",
		"",
		".dates ul li {background-image: none; background-color: #272727; color: #d2d2d2; border: 0px;}",
		".blank-square {background-image: none; background-color: #272727; border: 0px;}",
		"",
		"/* Additional Information Box */",
		".additional-information-popup {background: #2d2d2d; color: #d2d2d2;}",
		".status-more-details .date {color: #F49800;}",
		".additional-information-popup .status-more-details {background: #2d2d2d; color: #d2d2d2;}"
	].join("\n");
if (typeof GM_addStyle != "undefined") {
	GM_addStyle(css);
} else if (typeof PRO_addStyle != "undefined") {
	PRO_addStyle(css);
} else if (typeof addStyle != "undefined") {
	addStyle(css);
} else {
	var node = document.createElement("style");
	node.type = "text/css";
	node.appendChild(document.createTextNode(css));
	var heads = document.getElementsByTagName("head");
	if (heads.length > 0) {
		heads[0].appendChild(node);
	} else {
		// no head yet, stick it whereever
		document.documentElement.appendChild(node);
	}
}
})();