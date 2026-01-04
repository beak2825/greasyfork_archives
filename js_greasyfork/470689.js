// ==UserScript==
// @name         Темна тема elearn.nubip.edu.ua
// @namespace    https://greasyfork.org/uk/scripts/470689-темна-тема-elearn-nubip-edu-ua
// @version      0.3.5
// @description  Те, що бракує кожному студенту... Темна тема elearn!
// @author       Prevter
// @match        https://elearn.nubip.edu.ua/*
// @icon         https://elearn.nubip.edu.ua/pluginfile.php/1/theme_boost_union/favicon/64x64/1689168717/favicon.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/470689/%D0%A2%D0%B5%D0%BC%D0%BD%D0%B0%20%D1%82%D0%B5%D0%BC%D0%B0%20elearnnubipeduua.user.js
// @updateURL https://update.greasyfork.org/scripts/470689/%D0%A2%D0%B5%D0%BC%D0%BD%D0%B0%20%D1%82%D0%B5%D0%BC%D0%B0%20elearnnubipeduua.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // find image ".logo" and replace it
    const img = 'data:image/png;base64,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'
    const logo = document.querySelector('.logo');
    if (logo) logo.src = img;
    else {
        const logo2 = document.querySelector('#logoimage');
        if (logo2) logo2.src = img;
    }

    // create style
    const style = document.createElement('style');
    style.id = 'elearn-dark';
    style.innerHTML = `:root {
	    --bg-color: var(--elevation-0);
	    --nav-bg-color: var(--elevation-1);
	    --text-color: #ffffff;
	    --text-color-subtle: #c6c6c6;
	
	    --link-color: var(--primary);
	    --link-color-subtle: var(--primary-subtle);
	
	    --elevation-0: #121212;
	    --elevation-1: #1f1f1f;
	    --elevation-2: #212121;
	    --elevation-3: #242424;
	    --elevation-4: #272727;
	    --elevation-5: #2c2c2c;
	    --elevation-6: #2d2d2d;
	    --elevation-7: #323232;
	    --elevation-8: #353535;
	    --elevation-9: #373737;
	
	    --primary: #bb86fc;
	    --primary-subtle: #c6a2f1;
	    --primary-dark: #ab6afa;
	    --secondary: #b74113;
	    --secondary-subtle: #d15b2a;
	    --secondary-dark: #a63a0f;
	
	    --bg-info: #032830;
	    --fg-info: #6edff6;
	    --bg-primary: #031633;
	    --fg-primary: #084298;
	    --bg-danger: #842029;
	    --fg-danger: #ec4e5e;
	    --bg-success: #0f5132;
	    --fg-success: #198754;
	    --bg-warning: #9c7d1f;
	    --fg-warning: #ffc107;
	
	    --slider-bg: #424242;
	    --slider-fg: #686868;
	    --slider-fg-active: #7b7b7b;
	}
	
	body {
	    background-color: var(--bg-color) !important;
	}
	
	.fa,
	a:hover,
	.navbar.navbar-dark.bg-dark .nav-link,
	.navbar.navbar-dark.bg-primary .nav-link,
	.news-slider .slick-dots li button:before,
	.moodle-dialogue-base .closebutton,
	.table,
	.fa-check:before,
	.fa-gear:before,
	.fa-cog:before,
	.format-tiles ul.tiles .tile h3 {
	    color: var(--text-color) !important;
	}
	
	.dimmed_text,
	.message-app .day,
	.slider-col-date {
	    color: var(--text-color-subtle) !important;
	}
	
	a {
	    color: var(--link-color-subtle) !important;
	}
	
	a:focus:not(.slidesjs-pagination-item a) {
	    background: transparent !important;
	    box-shadow: none !important;
	}
	
	.navbar.fixed-top {
	    background-color: var(--nav-bg-color) !important;
	    color: var(--nav-text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
	}
	
	.main-inner {
	    background-color: var(--elevation-1) !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
	}
	
	.moremenu .nav-tabs,
	.nav .more-nav .nav-tabs,
	.block_myoverview,
	.news-slider,
	.btn.drawertoggle.icon-no-margin,
	.path-grade-report-user .user-grade thead th,
	.grade-report-user .user-grade thead th,
	.path-grade-report-user .user-grade td,
	.grade-report-user .user-grade td,
	.path-grade-report-user .user-grade tbody tr,
	.grade-report-user .user-grade tbody tr,
	.editor_atto_content_wrap,
	.message-app,
	.format-tiles #page .course-content ul li.section.main,
	.format-tiles .tiles-top-button,
	.format-tiles .course-content .section .activity:hover,
	.path-grade-report-user .user-grade th.column-itemname:not(.header,.category,.baggt,.baggb), .grade-report-user .user-grade th.column-itemname:not(.header,.category,.baggt,.baggb),
	.path-grade-report-user .user-grade .baggt, .path-grade-report-user .user-grade .baggb, .grade-report-user .user-grade .baggt, .grade-report-user .user-grade .baggb,
	.path-grade-report-user .user-grade th.category, .grade-report-user .user-grade th.category {
	    background-color: transparent !important;
	}
	
	.secondary-navigation .navigation {
	    background-color: transparent !important;
	    color: var(--text-color) !important;
	    border: 0px !important;
	}
	
	.moremenu .nav-link:hover,
	.moremenu .nav-link:focus {
	    background-color: transparent !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	}
	
	.navbar.navbar-dark.bg-dark .nav-link:hover,
	.navbar.navbar-dark.bg-dark .nav-link:focus,
	.navbar.navbar-dark.bg-primary .nav-link:hover,
	.navbar.navbar-dark.bg-primary .nav-link:focus,
	.format-tiles .course-content ul.tiles .tile {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	}
	
	.navbar.navbar-dark.bg-dark .nav-item.dropdown.show .nav-link.dropdown-toggle,
	.navbar.navbar-dark.bg-primary .nav-item.dropdown.show .nav-link.dropdown-toggle {
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	}
	
	.drawer,
	#block-region-outside-right>.block_html,
	#block-region-outside-right>.block_online_users {
	    background-color: var(--elevation-1) !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	    border-radius: 8px !important;
	}
	
	.block_rss_client,
	.block_calendar_month,
	.block_news_slider,
	.block_tags,
	.block_slider,
	.block_course_summary,
	.block_news_items,
	.block_calendar_upcoming,
	.block_recent_activity,
	.block_book_toc {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
	    border-radius: 8px !important;
	}
	
	.slidesjs-container {
	    margin-bottom: 12px !important;
	}
	
	.alert {
	    border-radius: 8px !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.3);
	}
	
	.alert-info {
	    background-color: var(--bg-info) !important;
	    color: var(--fg-info) !important;
	}
	
	.alert-danger {
	    background-color: var(--bg-danger) !important;
	    color: var(--text-color) !important;
	}
	
	.alert-warning {
	    background-color: var(--bg-warning) !important;
	    color: var(--text-color) !important;
	}
	
	.alert .close {
	    color: var(--text-color) !important;
	}
	
	#slider-container {
	    color: var(--text-color) !important;
	    border-radius: 8px !important;
	}
	
	.slider-banner-col {
	    background-color: var(--secondary) !important;
	    color: var(--text-color) !important;
	    padding: 4px !important;
	    border-radius: 8px !important;
	}
	
	.card-text {
	    margin-top: 0 !important;
	}
	
	.news-slider .newscontent .headline a,
	.news-slider .newscontent a {
	    color: var(--link-color-subtle) !important;
	}
	
	.news-slider .newscontent .headline a:hover,
	.news-slider .newscontent a:hover {
	    color: var(--link-color) !important;
	}
	
	::-webkit-scrollbar {
	    width: 10px;
	}
	
	::-webkit-scrollbar-track {
	    background: var(--slider-bg) !important;
	}
	
	::-webkit-scrollbar-thumb {
	    background: var(--slider-fg) !important;
	    border: 2px solid var(--slider-bg) !important;
	}
	
	::-webkit-scrollbar-thumb:hover {
	    background: var(--slider-fg-active) !important;
	}
	
	
	.bg-secondary,
	.btn.icon-no-margin {
	    background-color: var(--secondary) !important;
	}
	
	.dropdown-menu {
	    background-color: var(--elevation-1) !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	}
	
	#footnote,
	#theme-block-region-footer {
	    background-color: var(--elevation-1) !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	    border: 0 !important;
	}
	
	.text-body {
	    color: var(--text-color) !important;
	}
	
	.maincalendar .calendarmonth .clickable:hover {
	    background-color: var(--elevation-4) !important;
	}
	
	.select,
	.custom-select {
	    background-color: var(--elevation-5) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.news-slider .slick-prev:before,
	.news-slider .slick-next:before {
	    color: var(--text-color) !important;
	    opacity: 0.4 !important;
	}
	
	#region-main,
	.user-report-container {
	    background-color: transparent !important;
	    color: var(--text-color) !important;
	}
	
	.activity-header {
	    background-color: transparent !important;
	    color: var(--text-color) !important;
	    margin-top: 3px !important;
	}
	
	.btn-primary {
	    background-color: var(--fg-primary) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--fg-primary) !important;
	}
	
	.btn-primary:hover {
	    background-color: var(--primary-dark) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--primary-dark) !important;
	}
	
	.btn.btn-icon:hover,
	.btn.btn-icon:focus,
	.maincalendar .calendarmonth td.today .day-number-circle {
	    background-color: var(--secondary-subtle) !important;
	}
	
	.dropdown-divider {
	    border-top: 1px solid var(--elevation-5) !important;
	}
	
	.navbar.navbar-dark.bg-primary .nav-item.dropdown.show a.dropdown-item:hover,
	.navbar.navbar-dark.bg-primary .nav-item.dropdown.show a.dropdown-item:focus,
	.navbar.navbar-dark.bg-primary #user-action-menu.show a.dropdown-item:hover,
	.navbar.navbar-dark.bg-primary #user-action-menu.show a.dropdown-item:focus {
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	}
	
	div.btn.dropdown-toggle,
	li.dropdown-item {
	    color: var(--text-color) !important;
	}
	
	.generaltable {
	    color: var(--text-color) !important;
	}
	
	.submissionnotgraded {
	    color: var(--text-color-subtle) !important;
	}
	
	.overdue {
	    color: var(--fg-danger) !important;
	}
	
	.generaltable tbody tr:hover {
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	}
	
	.forumpost {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	    border: 1px solid var(--elevation-5) !important;
	    border-radius: 8px !important;
	}
	
	.forumpost .row.header {
	    border-radius: 8px !important;
	    padding: 8px 8px 0 8px !important;
	}
	
	.forumpost.unread .row.header,
	.path-course-view .unread,
	span.unread {
	    background-color: var(--bg-info) !important;
	    border-bottom: 1px solid var(--elevation-5) !important;
	}
	
	.attostylesbox.attostylesbox-callout {
	    background-color: var(--elevation-4) !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	    border: 1px solid var(--elevation-5) !important;
	    border-left-width: 5px !important;
	    border-radius: 8px !important;
	}
	
	.attostylesbox.attostylesbox-callout-green {
	    border-left-color: var(--fg-success) !important;
	}
	
	@media screen and (min-width: 992px) {
	    #page.drawers.show-drawer-left>#footnote {
	        padding-left: 3rem;
	    }
	}
	
	.full-width-bottom-border {
	    border-bottom: 1px solid var(--elevation-8) !important;
	}
	
	hr {
	    border-top: 1px solid var(--elevation-8) !important;
	}
	
	.dashboard-card {
	    background-color: var(--elevation-2) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	    border: 1px solid var(--elevation-5) !important;
	}
	
	.dashboard-card-footer {
	    background-color: transparent !important;
	}
	
	.list-group-item {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-5) !important;
	    border-radius: 8px !important;
	    margin-bottom: 5px !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	}
	
	.form-control {
	    background-color: var(--elevation-5) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.themeboostunionadvtile .card-header {
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	    border-bottom: 1px solid var(--elevation-5) !important;
	}
	
	.themeboostunionadvtile .card-body {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	}
	
	.themeboostunionadvtile .card-footer {
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	    border-top: 1px solid var(--elevation-5) !important;
	}
	
	.transparent-bg.card {
	    background-color: transparent !important;
	    border: none !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	}
	
	.path-mod-assign td.submissionstatussubmitted,
	.path-mod-assign div.submissionstatussubmitted,
	.path-mod-assign a:link.submissionstatussubmitted {
	    background-color: var(--bg-success) !important;
	    color: var(--text-color) !important;
	}
	
	.path-mod-assign td.submissiongraded,
	.path-mod-assign div.submissiongraded,
	.path-mod-assign td.submissionstatusdraft,
	.path-mod-assign div.submissionstatusdraft,
	.path-mod-assign a:link.submissionstatusdraft {
	    background-color: var(--bg-warning) !important;
	    color: var(--text-color) !important;
	}
	
	.fp-iconview .fp-filename-field .fp-filename {
	    background-color: transparent !important;
	}
	
	.fp-iconview .fp-thumbnail,
	.fp-iconview .fp-thumbnail img {
	    border: none !important;
	}
	
	.path-mod-assign td.latesubmission,
	.path-mod-assign a:link.latesubmission,
	.path-mod-assign div.latesubmission {
	    background-color: var(--bg-danger) !important;
	    color: var(--text-color) !important;
	}
	
	.generaltable th,
	.generaltable td {
	    border-top: 1px solid var(--elevation-7) !important;
	}
	
	.table-bordered th,
	.table-bordered td,
	.activity-item:not(.activityinline),
	.course-content .section-summary {
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.course-section {
	    border-bottom: 1px solid var(--elevation-7) !important;
	}
	
	.course-content .section-summary .section-summary-activities .activity-count {
	    color: var(--text-color-subtle) !important;
	}
	
	.path-grade-report-user .user-grade td.category,
	.grade-report-user .user-grade td.category {
	    background-color: transparent !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.text-danger,
	.path-grade-report-grader .gradefail,
	.path-grade-report-user .gradefail {
	    color: var(--fg-danger) !important;
	}
	
	.bg-light {
	    background-color: var(--elevation-5) !important;
	}
	
	.bg-white {
	    background-color: var(--elevation-2) !important;
	}
	
	.border {
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.page-link {
	    background-color: var(--elevation-5) !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.form-autocomplete-suggestions {
	    background-color: var(--elevation-5) !important;
	    border: 1px solid var(--elevation-7) !important;
	    padding: 8px !important;
	}
	
	.badge-secondary {
	    background-color: var(--elevation-6) !important;
	    color: var(--text-color) !important;
	}
	
	.btn-secondary {
	    background-color: var(--secondary) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--secondary) !important;
	}
	
	.modal-content,
	.moodle-dialogue-base .moodle-dialogue-wrap {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	    border-radius: 8px !important;
	}
	
	.modal-header {
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	    border-bottom: 1px solid var(--elevation-7) !important;
	}
	
	.modal-header .close {
	    color: var(--text-color) !important;
	}
	
	.modal-footer {
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	    border-top: 1px solid var(--elevation-7) !important;
	}
	
	.mform fieldset {
	    border-bottom: 1px solid var(--elevation-7) !important;
	}
	
	.editor_atto_content {
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.editor_atto_toolbar {
	    background-color: var(--elevation-7) !important;
	    border: 1px solid var(--elevation-9) !important;
	}
	
	.atto_group {
	    box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.3);
	    border: 1px solid var(--elevation-9) !important;
	    border-radius: 4px !important;
	}
	
	.editor_atto_toolbar button,
	.atto_group button {
	    background-image: none !important;
	    background-color: var(--elevation-7) !important;
	    border: none !important;
	}
	
	.editor_atto_toolbar button[disabled],
	.atto_group button[disabled] {
	    background-image: none !important;
	    background-color: var(--elevation-5) !important;
	}
	
	div.editor_atto_toolbar div.atto_group {
	    background-color: var(--elevation-5) !important;
	}
	
	.filemanager-container.card {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.fp-navbar.card {
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	    border-bottom: none !important;
	}
	
	.mform fieldset {
	    padding-bottom: 4px !important;
	}
	
	.moodle-dialogue-base .moodle-dialogue-wrap .moodle-dialogue-hd.yui3-widget-hd {
	    color: var(--text-color) !important;
	}
	
	.file-picker .fp-content {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	    border-top-left-radius: 0 !important;
	    border-top-right-radius: 0 !important;
	}
	
	.moodle-dialogue-base .moodle-dialogue-wrap .moodle-dialogue-hd,
	.border-bottom {
	    border-bottom: 1px solid var(--elevation-7) !important;
	}
	
	.col-md-4 .card,
	.node_category.card {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
	}
	
	.description .course-description-item {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.path-mod-assign table.generaltable table td.ygtvcell {
	    padding: 2px !important;
	}
	
	.login-container.login-container-80t {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	    border-radius: 8px !important;
	    box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.5);
	}
	
	.login-container .login-divider {
	    border-top: 1px solid var(--elevation-7) !important;
	}
	
	#page-login-index form#login::before {
	    color: var(--text-color) !important;
	    padding-bottom: 8px !important;
	}
	
	.login-container .login-identityproviders .login-identityprovider-btn {
	    background-color: var(--elevation-5) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	#page-login-index form#guestlogin,
	#page-login-index .login-divider+h2.login-heading {
	    display: block !important;
	}
	
	body.pagelayout-login.loginbackgroundimage1 {
	    background-image: url("https://hp.teveotecno.com.ar/wp-content/uploads/2021/06/4-ways-to-fix-keyboard-shortcuts-not-working-in-windows-10_60be93a05189c.jpeg") !important;
	    background-size: cover !important;
	    background-repeat: no-repeat !important;
	    background-position: center !important;
	}
	
	.login-form-username {
	    margin-top: 16px !important;
	}
	
	#logoimage {
	    margin: 0 !important;
	}
	
	#page-wrapper {
	    background-color: rgba(0, 0, 0, 0.5) !important;
	}
	
	.message-app .message.send {
	    background-color: var(--elevation-5) !important;
	    color: var(--text-color) !important;
	}
	
	.message-app .message.send .tail {
	    border-bottom-color: var(--elevation-5) !important;
	}
	
	.message-app .message.send .time {
	    color: var(--text-color-subtle) !important;
	}
	
	.section.card {
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	    border-radius: 8px !important;
	    margin-bottom: 8px !important;
	}
	
	.section.card .border-bottom {
	    border-bottom: none !important;
	}
	
	.form-autocomplete-suggestions li {
	    color: var(--text-color) !important;
	}
	
	.message-app {
	    background-color: var(--elevation-1) !important;
	    color: var(--text-color) !important;
	    border: none !important;
	}
	
	.border-top {
	    border-top: 1px solid var(--elevation-7) !important;
	}
	
	.border-right {
	    border-right: 1px solid var(--elevation-7) !important;
	}
	
	.popover,
	.popover-region-container {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.popover-region-footer-container {
	    background-color: var(--elevation-2) !important;
	    border-top: 1px solid var(--elevation-7) !important;
	}
	
	.popover-region-header-container {
	    border-bottom: 1px solid var(--elevation-7) !important;
	}
	
	.popover-body {
	    color: var(--text-color) !important;
	}
	
	.popover-body>div:nth-child(2) {
	    border-bottom: none !important;
	}
	
	.bs-popover-top>.arrow::after,
	.bs-popover-auto[x-placement^="top"]>.arrow::after {
	    border-top-color: var(--elevation-7) !important;
	}
	
	.que .info {
	    background: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	#mod_quiz_navblock {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    border: 1px solid var(--elevation-7) !important;
	}
	
	.path-mod-quiz #mod_quiz_navblock .qnbutton {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	}
	
	.path-mod-quiz #mod_quiz_navblock .qnbutton.complete .trafficlight, .path-mod-quiz #mod_quiz_navblock .qnbutton.answersaved .trafficlight, .path-mod-quiz #mod_quiz_navblock .qnbutton.requiresgrading .trafficlight {
	    background: var(--bg-success) !important;
	}
	
	.path-mod-quiz #mod_quiz_navblock .qnbutton.notyetanswered .trafficlight, .path-mod-quiz #mod_quiz_navblock .qnbutton.invalidanswer .trafficlight {
	    background: var(--bg-danger) !important;
	}
	
	.path-mod-quiz #mod_quiz_navblock .qnbutton .thispageholder {
	    border: 4px solid var(--elevation-7) !important;
	}
	
	#quiz-timer-wrapper #quiz-timer {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	}
	
	.que .formulation { 
	    background-color: var(--elevation-3) !important;
	    color: var(--text-color) !important;
	}
	
	#footnote > div > div:nth-child(1) > div > div > div > div:nth-child(1) {
	    padding-left: 0 !important;
	}
	
	body > #page {
	    margin-top: 18px;
	    background-color: transparent !important;
	    border-radius: 8px !important;
	}
	
	#page > #region-main {
	    background-color: var(--elevation-2) !important;
	    color: var(--text-color) !important;
	    border-radius: 8px !important;
	    box-shadow: 0 0 6px 0 rgba(0, 0, 0, 0.5);
	}
	
	#page > #region-main > .alert-danger {
	    background-color: transparent !important;
	}
	
	#page > #region-main > .alert-danger > p:nth-child(1) {
	    display: none;
	}
	
	#region-main > div > p:nth-child(4) > strong > span > img {
	    max-width: 100%;
	    height: auto;
	    content: url("https://ingoldsolutions.com/design/front/images/design/website-maintenance-1.png");
	    filter: grayscale(100%);
	    -webkit-user-drag: none;
	    -khtml-user-drag: none;
	    -moz-user-drag: none;
	    -o-user-drag: none;
	    user-drag: none;
	}
	
	.path-grade-report-user .user-grade th.category, .grade-report-user .user-grade th.category {
	    border: 1px solid var(--elevation-7) !important;
	}
	
	table.quizreviewsummary td.cell,
	table.quizreviewsummary th.cell {
	    background: transparent !important;
	}
	
	.que.ordering .sortablelist li {
	    background: var(--elevation-9) !important;
	    color: var(--text-color) !important;
	}
	`;

    // append style
    document.head.appendChild(style);

    // add notice to footer
    const footer = document.querySelector("#footnote > div > div:nth-child(1) > div > div > div > div:nth-child(1)");
    footer.innerHTML = `${footer.innerText.trim()}. <a href="https://greasyfork.org/uk/scripts/470689-темна-тема-elearn-nubip-edu-ua">Темна тема</a> від <a href="https://github.com/Prevter">Prevter</a>`;
})();