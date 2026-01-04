//
// Written by Glenn Wiking
// Script Version: 0.0.1a
// Date of issue: 09/05/17
// Date of resolution: 09/05/17
//
// ==UserScript==
// @name        ShadeRoot Mega
// @namespace   SRME
// @description Eye-friendly magic in your browser for Mega
// @version     0.0.1a
// @icon        https://i.imgur.com/f6FIniz.png

// @include        http://*mega.nz*
// @include        https://*mega.nz*

// @downloadURL https://update.greasyfork.org/scripts/32953/ShadeRoot%20Mega.user.js
// @updateURL https://update.greasyfork.org/scripts/32953/ShadeRoot%20Mega.meta.js
// ==/UserScript==

function ShadeRootME(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootME(
	'.bottom-page.scroll-block, input, body {background: #260d0d !important;}'
	+
	'.bottom-menu.body, .loading-mid-white-block {background-color: #1a1111 !important;}'
	+
	// TEXT COLOR 1
	'body, p, h1, h2, h3, h4, h5, h6, strong, .bottom-menu company-info, .top-menu-item:hover, .top-menu-item.active, .nw-conversations-header, .nw-tree-panel-header, .copy-dialog-panel-header, .move-dialog-panel-header, .share-dialog-panel-header, .nw-fm-tree-folder, .transfer-table td, .grid-table td, .grid-share-table td, .contacts-grid-table td, .tranfer-filetype-txt, .fm-browsers-txt, .fm-flags-txt, .fm-member-icon-txt, .dropdown-item, .loading-info li, .step1, .step2, .step3, .toast-notification, .fm-right-files-block, .link-button {color: #EDD !important;}'
	+
	'body, .light-overlay {background-image: linear-gradient(to bottom, rgba(35,0,8,1) 0%,rgba(35,0,8,1) 100%) !important;}'
	+
	'.login-register-input {border: 2px solid #721515 !important;}'
	+
	// TEXT COLOR 2
	'.link, .top-menu-item, a, .support-article-heading, .file, .folder {color: #c5b0b0 !important;}'
	+
	'.link:hover, input, a.blog-new-archive-lnk, .fm-share-permissions, .account-history-drop-items, .permissions-menu-item, .fm-dialogs-dropdown-item, .default-dropdown-item {color: #bf6a6a !important;}'
	+
	// TEXT COLOR 3
	'.company-info {color: #927272 !important;}'
	+
	// IMAGES
	'img {opacity: .9 !important; filter: brightness(.9) !important;}'
	+
	'.default-white-button, .default-grey-button, .default-red-button {background: rgb(138, 22, 22) !important; color: #EDD !important;}'
	+
	'.top-menu-popup, .dev-nw-gray {background-color: #200c0c !important;}'
	+
	'.top-menu-scroll .jspContainer::before, .top-menu-scroll .jspContainer::after {background: linear-gradient(to bottom, rgb(33, 10, 10) 0%, rgba(255,255,255,0) 100%) !important;}'
	+
	'.login-check, .checkboxOff {background: rgb(170, 20, 27) !important;}'
	+
	'.top-head {background-color: #5f2020 !important;}'
	+
	'p .blog-new-read-more, p a.blog-new-read-more {background-color: #621a1a !important;}'
	+
	'.blog-new-search {border: 2px solid #861515 !important; background-color: #2d0909 !important;}'
	+
	'.blog-archive-number {color: #dbc2c2 !important; background-color: #721515 !important;}'
	+
	'.blog-new-date-div {background-color: #772929 !important;}'
	+
	'.dev-nw-gray-bg {background: #241616 !important;}'
	+
	'.blog-pagination {border-top: 2px solid #591515 !important;}'
	+
	'.blog-pagination-button.unavailable, .blog-pagination-button {background-color: #5c1515 !important;}'
	+
	'.blog-pagination-button.unavailable:hover, .blog-pagination-button:hover, .blog-pagination-button:hover, .blog-pagination-button.active {background-color: #A72A11 !important;}'
	+
	'.top-change-language-name {color: #ffdada !important;}'
	+
	'.main-pad-block {background: #260D0D !important;}'
	+
	'.about-top-block {background-color: #351515 !important;}'
	+
	'.fm-share-permissions-block, .account-history-dropdown, .permissions-menu, .fm-dialogs-dropdown, .default-select-dropdown {background-color: #411313 !important;}'
	+
	'textarea {border: 1px solid #6c1212 !important; background: #211313 !important; color: #EDD !important;}'
	+
	'a.contact-new-button {background-color: #8d1414 !important; color: #ccacac !important;}'
	+
	'.fm-share-dropdown, .share-dialog-permissions, .share-dialog-icon.permissions-icon, .fm-dialogs-select, .default-select, .ui-selectmenu-button {background-color: rgb(138, 26, 26) !important; color: #EDD !important;}'
	+
	'.dropdown.body {background-color: #4d2020 !important;}'
	+
	'.dropdown-white-arrow {display: none !important;}'
	+
	'.help-background-block, #popnotifications {background-color: #721818 !important;}'
	+
	'#support-search {background: #260c0c !important;}'
	+
	'.help-home-page, .help-background-block {background: #2a1010 !important;}'
	+
	'.help-background-block, .help-home-page {background-image: linear-gradient(to bottom, rgba(109,0,25,1) 0%,rgba(109,0,25,1) 100%) !important;}'
	+
	'.popular-question-block, .first-support-block {border-top: 1px solid #5a1717 !important;}'
	+
	'#help2-main .block:nth-child(1), #help2-main .block:nth-child(2), #help2-main .block:nth-child(3), #help2-main .block:nth-child(4) {border-bottom: 1px solid #8d1c1c !important;}'
	+
	'#help2-main .block:nth-child(1), #help2-main .block:nth-child(2), #help2-main .block:nth-child(3) {border-right: 1px solid #931212 !important;}'
	+
	'.block, .dashboard {background-color: #501515 !important;}'
	+
	'.block:hover:not(.disabled) {background: #801c1c !important; color: #EDD !important;}'
	+
	'#help2-main .popular-question-title, #help2-main .support-block-title, #help2-main .support-section-header-clone .support-go-back-heading {color: #EDD !important;}'
	+
	'.client-name {color: #d54545 !important;}'
	+
	'.email-button span {background: #6f1e1e !important; color: #EDD !important;}'
	+
	'.email-button span:hover {color: #ec6e6e !important;}'
	+
	'.block-mobile-device {background-color: #682929 !important;}'
	+
	'.device-selector, .sidebar-menu-link {background: #381111 !important;}'
	+
	'.sidebar-menu-link:hover:not(.active), .fm-dialog, .warning-dialog-a, .fm-notifications-bottom {background-color: #230c0c !important;}'
	+
	'.fm-dialog-header, .fm-notifications-bottom {outline-color: #451616 !important;}'
	+
	'.d-section-container {border-bottom: 1px solid #2d1212 !important; background-color: #2a0e0e !important;}'
	+
	'.active {background-color: #801818 !important; background-image: linear-gradient(90deg, #870f0f 0%, #8f1414 100%) !important;}'
	+
	'.device-selector-top {background: #351212 !important;}'
	+
	'.device-select:hover, .fm-left-panel {background-color: #451616 !important;}'
	+
	'.support-article {background-color: #3c0f0f !important;}'
	+
	'.article-end {border-top: 0.5px solid #390e0e !important;}'
	+
	'#help2-main .feedback-yes, #help2-main .feedback-no {background: #891717 !important; color: #EDD !important;}'
	+
	'#help2-main .support-image-container {background-color: #261414 !important; border: 1px solid #4d0e0e !important;}'
	+
	'#help2-main .support-article-info li {color: #b49696 !important;}'
	+
	'.bullet-number, .fm-dialog {background-color: #391c1c !important;}'
	+
	'.info-txt, .account, .left-pane, .small-txt, .fm-account-header {color: #EDD !important;}'
	+
	'.achievements-cell::before, .achievements-cell::after, .account.widget.body::before, .account.widget.body::after {background-color: #3e1616 !important;}'
	+
	'.content-block, .fm-main, .fm-right-header, .new-notification-top, .fm-transfers-header {background-color: #231616 !important;}'
	+
	'.fm-right-block.dashboard .jspContainer::before {background: linear-gradient(to bottom, rgb(93, 35, 35) 0%, rgba(250,250,250,0) 100%) !important;}'
	+
	'.grid-table-header, .transfer-table-header, .contacts-grid-table {background-color: #602323 !important;}'
	+
	'.files-grid-view.fm .grid-scrolling-table, .files-grid-view.fm .grid-scrolling-table .jspPane, .transfer-scrolling-table, .transfer-scrolling-table .jspPane {background-image: none !important;}'
	+
	'.grid-table tr:nth-child(2n+1) td, .fm-account-main .grid-table tr:nth-child(2n) td, .grid-share-table tr:nth-child(2n+1) td, .contacts-grid-table tr:nth-child(2n+1) td, .transfer-table tr:nth-child(2n+1) td, .contact-requests-grid tr:nth-child(2n+1) td, .sent-requests-grid tr:nth-child(2n+1) td {background-color: rgb(66, 27, 27) !important;}'
	+
	'.grid-table tr:hover td, .grid-share-table tr:hover td, .contacts-grid-table tr:hover td, .grid-table tr:hover:nth-child(2n+1) td, .grid-share-table tr:hover:nth-child(2n+1) td, .contacts-grid-table tr:hover:nth-child(2n+1) td, .transfer-table tr:hover:nth-child(2n+1) td, .transfer-table tr:hover td, .contact-requests-grid tr:hover td, .sent-requests-grid tr:hover td {background-color: rgb(117, 50, 50) !important;}'
	+
	'.nw-fm-tree-header {background: #2c0b0b !important;}'
	+
	'.fm-empty-cloud-bg, .fm-empty-folder-bg, .fm-empty-conversations-bg, .fm-empty-incoming-bg, .fm-empty-contacts-bg, .fm-invalid-folder-bg, .fm-empty-folder-link-bg, .fm-empty-trashbin-bg, .fm-empty-transfers-bg, .fm-empty-search-bg {filter: brightness(.8) !important;}'
	+
	'.fm-empty-button, .fm-not-logged-button, .fmholder, #fmholder {background-color: #1a1616 !important;}'
	+
	'.fm-dialog-footer, .fm-move-bottom-block, .fm-share-bottom-block, .fm-notifications-bottom, .top-login-bott-gray-block, .fm-mega-dialog-bottom, .create-folder-bottom, .default-dialog-bottom {background-color: #211919 !important;}'
	+
	'.fm-contact-requests, .fm-received-requests {background-color: #1e1414 !important; border-top: 1px solid #560e0e !important; border-bottom: 1px solid #440e0e !important; color: #EDD !important;}'
	+
	'.fm-account-button:hover {background-color: #5a1717 !important; color: #EDD !important;}'
	+
	'.account.tabs-bl {background-color: #3b0e0e !important; border-bottom: 1px solid #651111 !important;}'
	+
	'.tab-content {background-color: #2c1515 !important;}'
	+
	'label, .transfer-started .transfer-status, .transfer-error .transfer-status, .transfer-completed .transfer-status {color: #ae9999 !important;}'
	+
	'.quota-txt span, .dropdown-color-txt {color: #ba2424 !important;}'
	+
	'.progress-block.tiny {background-color: #231d1d !important; box-shadow: inset 0px 0px 0px 1px rgb(84, 20, 20) !important;}'
	+
	'.fm-header-buttons, .toast-notification, .fm-right-files-block {background-color: #330f0f !important;}'
	+
	'hr::before {background-color: #7B3333 !important;}'
	+
	'.disabled {color: #ba2424 !important;}'
	+
	'.fm-account-history-head {background-color: #531414 !important;}'
	+
	'.fm-account-main .grid-table tr:nth-child(2n+1) td, .fm-account-main .grid-table, .grey-bar {background-color: #271919 !important;}'
	+
	'.settings-logout {background-color: #6b4747 !important;}'
	+
	'.expired-session-txt {background-color: #860b0b !important; border: 1px solid #921717 !important;}'
	+
	'.fm-account-button, .account-italic-txt, .radio-txt, .size-txt {color: #c2bebe !important;}'
	+
	'.ui-slider-handle, .ui-slider-handle::before {background-color: #901212 !important;}'
);