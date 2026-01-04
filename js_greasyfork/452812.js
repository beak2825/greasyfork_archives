// ==UserScript==
// @name         Educon Improve
// @namespace    http://tampermonkey.net/
// @version      0.76
// @description  Try to make Educon better space for education!
// @author       MakAndJo
// @match        https://educon2.tyuiu.ru/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/452812/Educon%20Improve.user.js
// @updateURL https://update.greasyfork.org/scripts/452812/Educon%20Improve.meta.js
// ==/UserScript==

(function () {
	'use strict';

	class LoggerUtil {
		constructor(prefix, style) {
			this.prefix = prefix
			this.style = style
		}
		log = (...args) => console.log.apply(null, [this.prefix, this.style, ...args]);
		info = (...args) => console.info.apply(null, [this.prefix, this.style, ...args]);
		warn = (...args) => console.warn.apply(null, [this.prefix, this.style, ...args]);
		debug = (...args) => console.debug.apply(null, [this.prefix, this.style, ...args]);
		error = (...args) => console.error.apply(null, [this.prefix, this.style, ...args]);
	}


	const logger = new LoggerUtil('%c[TYUIU]', 'color: #448ccb; font-weight: bold;');

	/**
	 * Load Stylesheets
	 */
	(function loadStyle() {
		const styleList = `
		body {
			--mark-color: #3262ff;
			--color-background: #eef5f9;
			--color-background-card: #fff;
			--color-background-button: #e9ecef;
			--color-background-button-hover: #d3d9df;
			--border-color: #d7dfe3;
			--border-color-alt: #fff;
			--color-text: #333;
		}
		body.dark-tc-theme {
			--color-background: #151515;
			--color-background-card: #212121;
			--color-background-button: #313131;
			--color-background-button-hover: #3f3f3f;
			--border-color: #313131;
			--border-color-alt: #444;
			--color-text: #ddd;
		}
		body {
			font-family: Arial, sans-serif;
			overflow: hidden scroll;
			color: var(--color-text);
			background-color: var(--color-background) !important;
		}
		::-webkit-scrollbar {
			width: 15px;
			background: transparent;
		}

		::-webkit-scrollbar-thumb {
			background-color: rgb(170, 170, 170, 0.7);
		}

		::-webkit-scrollbar-thumb,
		::-webkit-scrollbar-track-piece {
			background-clip: padding-box;
			border: 4px solid transparent;
			border-radius: 10px;
		}

		::-webkit-scrollbar-track-piece {
			background-color: transparent;
		}

		::-webkit-scrollbar-corner {
			background: transparent;
		}
		#page {
			margin-top: 40px;
			margin-bottom: 40px;
		}
		#region-main {
			background-color: transparent;
		}
		h1,.h1,h2,.h2,.path-calendar .maincalendar .calendar-controls .current,h3,.h3,h4,.h4,h5,.h5,h6,.h6 {
			color: var(--color-text);
			font-family: Arial,sans-serif,system-ui;
			font-weight: 500;
		}
		h1, .h1 {
			font-size: 2em;
		}
		h2, .h2, .path-calendar .maincalendar .calendar-controls .current {
			font-size: 1.6rem;
		}
		h3, .h3 {
			font-size: 1.4rem;
		}
		.btn-secondary, .btn-default {
			border-radius: 8px;
			color: var(--color-text);
			background-color: var(--color-background-button);
			border-color: var(--border-color);
		}
		.btn-secondary:hover, .btn-default:hover {
			color: var(--color-text);
			background-color: var(--color-background-button-hover);
			border-color: var(--border-color);
		}
		.btn-outline-secondary {
			color: var(--color-text);
			border-color: var(--border-color);
			border-radius: 8px;
		}
		.btn-primary {
			border-radius: 8px;
		}
		header nav button {
			background-color: #e9ecef !important;
			border-color: #d7dfe3 !important;
		}
		.pull-left, .pull-right {
			display: flex;
			align-items: baseline;
			justify-content: flex-start;
			flex-direction: row;
			flex-wrap: nowrap;
		}
		.pull-right {
			justify-content: flex-end;
		}
		.card, #page-enrol-users #filterform, .que .history, .userprofile .profile_tree section, .groupinfobox, .well {
			border-color: var(--border-color);
			border-radius: 8px;
			overflow: inherit;
			background-color: var(--color-background-card);
		}
		.card h2 + #intro {
			border-top: 1px solid var(--border-color);
		}
		.card-footer {
			background-color: rgba(0,0,0,.05) !important;
		}
		.icon:before {
			margin-left: unset;
		}
		nav.navbar {
			min-height: 50px;
			max-height: 60px;
		}
		.nav.navbar-nav > li {
			min-width: 50px;
			background-color: #448ccb;
			line-height: 60px !important;
			max-height: 60px;
		}
		nav.navbar ul.navbar-nav .popover-region .popover-region-toggle, nav.navbar ul.navbar-nav .popover-region .lang-menu {
			line-height: 60px;
		}
		.nav.navbar-nav > li > div:first-child {
			width: 100%;
		}
		.nav.navbar-nav > li:hover, .nav.navbar-nav > li:focus {
			background-color: #346cab;
		}
		.usermenu {
			padding: 0 0.8rem;
		}
		#page-navbar .breadcrumb li > * {
			color: var(--color-text);
			background-color: var(--color-background-button);
			border-color: var(--color-background-button);
		}
		#page-navbar .breadcrumb li::after {
			border-left-color: var(--color-background-card);
		}
		#page-navbar .breadcrumb li .no-link {
			background-color: var(--color-background-button-hover);
			border-color: var(--color-background-button-hover);
		}
		.dropdown-menu {
			z-index: 1000;
			min-width: 10rem;
			padding: 0 0;
			margin: 0.125rem 0 0;
			font-size: .9375rem;
			color: #373a3c;
			background-color: #fff;
			border: 1px solid rgba(0,0,0,.15);
			border-radius: 8px;
			overflow: auto;
		}
		.dropdown-menu > .dropdown-item {
			padding: 0.2rem 0.4rem;
			color: #212529;
			background-color: transparent;
			overflow: auto;
		}
		.dropdown-item:hover, .dropdown-item:focus {
			color: #16181b;
			text-decoration: none;
			background-color: #f8f9fa;
		}
		.dropdown-divider {
			margin: 0.3rem 0;
		}
		nav.navbar ul.navbar-nav li .dropdown-menu, nav.navbar ul.navbar-nav .nav-item .dropdown-menu {
			padding: 4px 0;
		}
		nav.navbar ul.navbar-nav .usermenu .dropdown .dropdown-menu > .dropdown-item {
			padding: 0 8px;
		}
		#nav-drawer {
			top: 60px;
			height: calc(100% - 60px);
			padding-bottom: unset;
			transition: right .5s ease, left .5s ease, width .5s ease;
			overflow-x: hidden;
		}
		#nav-drawer .list-group {
			min-width: 270px;
		}
		#nav-drawer .list-group .list-group-item {
			white-space: nowrap;
			transition: all .2s ease;
		}
		#nav-drawer .list-group .list-group-item a {
			line-height: 1;
			display: inline-flex;
			align-items: center;
			gap: 8px;
			justify-content: flex-start;
			border-radius: 0;
		}
		#nav-drawer.closed .list-group {
			min-width: unset;
		}
		#nav-drawer.closed .list-group .list-group-item:hover a:hover {
			background-color: transparent;
		}
		#nav-drawer .list-group .list-group-item a {
			transition: all .1s ease;
			background-color: transparent;
		}
		#nav-drawer.closed .list-group .list-group-item:hover>ul {
			top: 42px;
		}
		.icon {
			width: 20px;
			height: 20px;
			margin-right: 3px;
		}
		.dashboard-card-deck .dashboard-card .dashboard-card-img {
			height: 10em;
		}
		.dashboard-card-deck .dashboard-card {
			overflow: hidden;
		}
		.courses .card-deck .card {
			overflow: hidden;
			background-color: rgba(0,0,0,0.02);
		}
		.courses .card-deck .card .course-contacts {
			padding: 1em;
			display: inline-flex;
			flex-direction: row;
			flex-grow: 0;
			flex-wrap: wrap;
			justify-content: flex-start;
			gap: 8px;
			padding-bottom: 0;
		}
		.courses .card-deck .card .card-body {
			padding: 1em;
		}
		.courses .card-deck .card .card-footer {
			padding: 0.8rem;
			background-color: rgba(0,0,0,.05);
			border-top: 1px solid var(--border-color);
		}
		.card-deck {
			align-items: stretch;
			justify-content: flex-start;
		}
		@media (min-width: 768px) {
			.pagelayout-mydashboard .card-deck .card,.pagelayout-mydashboard .card-deck #page-enrol-users #filterform,#page-enrol-users .pagelayout-mydashboard .card-deck #filterform,.pagelayout-mydashboard .card-deck .que .history,.que .pagelayout-mydashboard .card-deck .history,.pagelayout-mydashboard .card-deck .userprofile .profile_tree section,.userprofile .profile_tree .pagelayout-mydashboard .card-deck section,.pagelayout-mydashboard .card-deck .groupinfobox,.pagelayout-mydashboard .card-deck .well {
			flex-basis: auto;
			}
		}
		[data-region="blocks-column"] {
			width: 280px;
			background-color: var(--color-background);
			padding: 8px;
		}
		@media (min-width: 576px) {
			.courses .card-deck .card {
				width:calc(50% - .5rem);
				flex-basis: auto;
			}
		}
		@media (min-width: 840px) {
			.courses .card-deck .card {
				width:calc(33.33% - .5rem);
				flex-basis: auto;
			}
		}
		@media (min-width: 1100px) {
			.courses .card-deck .card {
				width:calc(25% - .5rem);
				flex-basis: auto;
			}
		}
		.table th, table.collection th, table.flexible th, .generaltable th, .table td, table.collection td, table.flexible td, .generaltable td {
			border-top: 1px solid var(--border-color-alt);
		}
		.table, table.collection, table.flexible, .generaltable {
			border: 1px solid var(--border-color);
		}
		.path-calendar .maincalendar .calendarmonth .header {
			background-color: var(--color-background-button);
			color: var(--color-text);
		}
		.maincalendar .calendarmonth td, .maincalendar .calendarmonth th {
			border: 1px solid var(--border-color-alt);
		}
		.path-calendar .maincalendar .calendarmonth tbody td {
			border: 1px solid var(--border-color-alt);
		}
		.modal-content, .moodle-dialogue-base .moodle-dialogue-wrap.moodle-dialogue-content {
			background-color: var(--color-background-card);
			border-radius: 8px;
			border: 1pxsolidrgba(0,0,0,.2);
		}
		.close, .moodle-dialogue-base .closebutton {
			color: var(--color-text);
		}
		.feedback {
			position: relative;
			margin-bottom: 0;
		}
		.submissionstatustable {
			margin-bottom: 0 !important;
		}
		.floating-mark {
			display: flex;
			align-items: center;
			justify-content: center;
			position: absolute;
			min-width: 50px;
			min-height: 50px;
			border: 3px solid var(--mark-color);
			border-radius: 3px;
			padding: 5px;
			bottom: 60px;
			right: 80px;
			transform: rotate(-8deg);
			text-align: center;
		}
		.floating-mark img {
			display: block;
			-webkit-user-select: none;
			margin: 0;
			min-width: 180px;
			min-height: 90px;
			max-width: 180px;
		}
		.floating-mark span {
			color: var(--mark-color);
			font-weight: 800;
			font-size: 20px;
			font-family: sans-serif;
			text-transform: uppercase;
			line-height: 24px;
			/* font-stretch: condensed; */
			padding: 0;
			background-color: transparent;
		}
      	#page-course-view-topics .course-content .single-section .sectionname,
			#page-course-view-topics .course-content .section .sectionname {
			border-color: var(--border-color);
			border-width: 3px 0 3px 0;
			border-radius: 8px;
			background: transparent;
			color: #008ec6;
			margin: 0 -25px 0 -25px;
			margin-bottom: 1em;
		}
    `;
		(function addStyle(css) {
			const style_id = "TC_EduconImprove-active";
			const style = document.getElementById(style_id) || (function createStyle(style_id) {
				const style = document.createElement('style');
				style.id = style_id;
				document.head.appendChild(style);
				return style;
			})(style_id);
			css && style.append(css);
		})(styleList);
	})();

	/* -- */

	const locationUrl = window.location.pathname;

	locationUrl == "/mod/assign/view.php" && (function enhancedMark() {
		const MARK_MODE = 2;
		const MARK_IMAGE = "https://cdn.tjmcraft.ga/images/vse_huina.png";

		const feedback_sub = document.querySelector('.feedback');
		const feedback_tab = feedback_sub.querySelector('.feedbacktable > table');
		const feedback_tab_mark = feedback_tab.querySelector('tbody > tr:first-child > td:nth-child(2)').innerText;
		const [fb_mark, fb_mark_total, fb_mark_max] = feedback_tab_mark.match(/^(\d+)\s\/\s(\d+)$/);

		logger.debug('Marks:', fb_mark, fb_mark_total, fb_mark_max);

		if (fb_mark_total / fb_mark_max < 0.8) {

			const floating_mark = (function createFloatingMark() {
				const floating_mark = document.createElement('div');
				floating_mark.classList.add("floating-mark");

				switch (MARK_MODE) {
					case 1:
						{
							const floating_mark_img = document.createElement('img');
							floating_mark_img.src = MARK_IMAGE;
							floating_mark.appendChild(floating_mark_img);
						}
						break;
					case 2:
						{
							const floating_mark_span = document.createElement('span');
							floating_mark_span.innerText = "ЭТО ВСЁ ХУЙНЯ,\nПЕРЕДЕЛЫВАЙ!";
							floating_mark.appendChild(floating_mark_span);
						}
						break;
					default:
						break;
				}

				return floating_mark;
			})();

			feedback_sub.appendChild(floating_mark);

		}
	})();

	/* -- */

	(function layoutUpdate() {
		document.getElementById("top-footer").remove();
		document.querySelector("#nav-notification-popover-container > div.popover-region-toggle.nav-link > i").classList.add('icon', 'fa');
		document.querySelectorAll(".nav.navbar-nav > li").forEach(i => !i.children.length ? i.remove() : null);
		document.querySelectorAll("[data-region=filter] > *").forEach(i => i.classList.remove('m-b-1'));
		document.body.classList.add('dark-tc-theme');
		document.querySelector("header nav ul.nav.navbar-nav").prepend(Object.assign(document.createElement("li"), {
			classList: ['list-item'], innerHTML: `
        <li>
          <div class="pull-right popover-region collapsed">
            <a id="tc_button" class="nav-link d-inline-block popover-region-toggle position-relative" href="#">
              <i class="icon fa icon-fire fa-fw " aria-hidden="true" title="Переключить тему" aria-label="Переключить тему"></i>
            </a>
          </div>
        </li>
      `
		}));
	})();

	(function themeProvider() {
		const themeKey = 'tc-dark-theme';
		const themeClass = 'dark-tc-theme';
		Element.prototype.toggle = function (state = null, class_name = null, cb = () => { }) {
			let cl = this.classList,
				c = class_name || 'hidden',
				s = state != null ? state : cl.contains(c) == 0;
			cl[s ? 'add' : 'remove'](c);
			if (cb instanceof Function) cb(s);
		}

		const button = document.getElementById('tc_button');
		function change_theme(state = null) {
			document.body.toggle(state, themeClass, (state) => {
				window.localStorage.setItem(themeKey, state);
				//button.innerHTML = state ? '<i class="fas fa-moon"></i>' : '<i class="fas fa-sun"></i>';
			});
		}
		button.addEventListener('click', () => change_theme(window.localStorage.getItem(themeKey) == 'true' ? false : true)); // onclick invert
		change_theme(window.localStorage.getItem(themeKey) == 'true' ? true : false); // initial
	})();

	/* -- */
	const script_meta = GM_info.script;
	logger.log(`${script_meta.name} v${script_meta.version} Loaded!`);

})();