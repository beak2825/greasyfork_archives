// ==UserScript==
// @name         e-Aula Dark Mode
// @namespace    https://github.com/Equiel-1703
// @version      1.0
// @description  Habilita dark mode na plataforma e-aula da UFPel.
// @author       Henrique Rodrigues Barraz
// @license      MIT
// @match        https://e-aula.ufpel.edu.br/*
// @icon         https://raw.githubusercontent.com/Equiel-1703/e-aula-dark-mode/refs/heads/main/icon/e-aula-dm-icon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520749/e-Aula%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/520749/e-Aula%20Dark%20Mode.meta.js
// ==/UserScript==

(function () {
	'use strict';

	const new_css = `

:root {
	--bg-color: black;
	--cards-bg-color: #202020;
	--table-row-even: #434343;
	--text-color: white;
	--text-hover-color: #6493ff;
	--dark-blue: #06293d;
	--titles-color: #c7d8ff;
}

body {
	color: var(--text-color);
	background: linear-gradient(90deg, #000000 0%, #2f2f2f 100%) !important;
	background-size: 400% 400% !important;
}

h1,
h2,
h3,
h4,
h5,
h6 {
	color: var(--titles-color) !important;
}

/* Fundos cinza-claro */
body div.card-body,
body .card,
body #region-main,
.activity-header,
.activity,
.availabilityinfo {
	background-color: var(--cards-bg-color) !important;
	color: var(--text-color) !important;
}

/* Fundos pretos */
div#topofscroll.main-inner,
#page-header,
input[type="text"],
select {
	background-color: var(--bg-color) !important;
}

.list-group-item,
#page [role="menu"],
.dropdown-menu {
	background-color: var(--cards-bg-color) !important;
}

.row {
	align-items: center;
}

a.page-link,
.page-item.disabled a.page-link {
	background-color: var(--cards-bg-color);
	border: none;
}

input[type="text"]:focus {
	background-color: var(--cards-bg-color);
}

.text-muted,
span.categoryname {
	color: var(--text-color) !important;
}

.course-card-view {
	background-color: #151515 !important;
}

.activity-item:not(.activityinline) {
	border: 1px solid var(--dark-blue) !important;
}

.bg-light,
.bg-white {
	background-color: var(--cards-bg-color) !important;
}

.border {
	border: 1px solid var(--dark-blue) !important;
}

.dashboard-card {
	box-shadow: 1px 0px 11px var(--dark-blue) !important;
}

/* These rules are for fixing elements alignment in the course participants page */
div.border-radius.my-2.p-2.bg-white.border.d-flex.flex-column.flex-md-row.align-items-md-stretch.mr-0.ml-0.row {
	align-items: center !important;
}

div.border-radius.my-2.p-2.bg-white.border.d-flex.flex-column.flex-md-row.align-items-md-stretch.mr-0.ml-0.row> :not(button) {
	margin: 0 !important;
	margin-right: 0.25rem !important;
}

/* Buttons */
button.btn,
.btn.btn-outline-secondary,
.btn-secondary,
.custom-select {
	background-color: var(--cards-bg-color) !important;
	color: var(--text-color) !important;
}

button.btn:hover,
bod.btn.btn-outline-secondary:hover,
.btn-secondary:hover,
.custom-select:hover {
	color: var(--text-hover-color) !important;
}

/* Tables */
.generaltable tbody tr:nth-of-type(even) {
	background-color: var(--table-row-even) !important;
}

.generaltable {
	border: 0;
	border-spacing: 0 !important;
	color: var(--text-color) !important;
}

.generaltable td,
.generaltable th {
	border: 0 !important;
}

.table {
	border: 1px solid var(--dark-blue) !important;
}

table.user-grade *,
.user-report-container,
.row.header {
	background-color: var(--cards-bg-color) !important;
}

/* Icons */
.icon-no-margin {
	color: var(--text-color) !important;
	/* background-color: var(--bg-color); */
}

.course-section-header .icon-no-margin {
	color: var(--titles-color) !important;
	background-color: var(--cards-bg-color) !important;
}

.activityiconcontainer .activityicon {
	filter: invert(1) !important;
}

/* Navbar */
div#page-wrapper nav.navbar {
	background-color: var(--bg-color) !important;
	color: var(--text-color);
	border-bottom: #2ea5d7 1px solid;
}

div#page-wrapper nav.navigation,
div#page-wrapper .moremenu .nav-tabs {
	background-color: var(--bg-color) !important;
	color: var(--text-color);
}

div#page-wrapper nav.navbar a.nav-link {
	color: var(--text-color) !important;
}

div#page-wrapper nav.navbar a.nav-link:hover {
	color: var(--text-hover-color) !important;
}

div#page-wrapper nav.navbar a.navbar-brand {
	color: var(--titles-color) !important;
}

/* Modal Content */
.modal-content {
	background-color: var(--bg-color) !important;
}
	`;

	const append_css = (css) => {
		const style_tag = document.createElement('style');

		style_tag.innerHTML = css;

		document.head.appendChild(style_tag);

		return style_tag;
	};

	const add_dark_mode_copyrigth = (copyrigth_msg) => {
		const obs = new MutationObserver((_mutations) => {
			const el_copyrigth = document.querySelector('.copyleft');

			if (el_copyrigth) {
				el_copyrigth.innerHTML += copyrigth_msg;
				obs.disconnect();
			}
		});

		obs.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	let dark_mode_style_tag = null;
	const set_dark_mode = (enable) => {
		if (enable) {
			dark_mode_style_tag = append_css(new_css);
			add_dark_mode_copyrigth(' | Dark Mode by <strong><a href="https://github.com/Equiel-1703" target="_blank">Henrique G. Rodrigues Barraz</a></strong>');
		} else {
			if (dark_mode_style_tag) {
				dark_mode_style_tag.remove();
			}
		}
	}

	const save_cookie = (name, value) => {
		const expires = new Date();
		expires.setTime(expires.getTime() + 1000 * 60 * 60 * 24 * 365); // 1 year
		document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
	}

	const get_cookie = (name) => {
		const cookie = document.cookie.match(`(^|;) ?${name}=([^;]*)(;|$)`);
		return cookie ? cookie[2] : null;
	}

	const create_separation_div = () => {
		const separation_div = document.createElement('div');
		separation_div.className = 'divider border-left h-75 align-self-center ml-1 mr-3';
		return separation_div;
	}

	const create_dark_mode_button = (label_msg) => {
		const input_group_div = document.createElement('div');
		input_group_div.className = 'input-group align-items-center';
		input_group_div.style = 'width: auto;';

		const button_label = document.createElement('label');
		button_label.className = 'mr-2 mb-0'; // margin-right: 2px; margin-bottom: 0px;
		button_label.innerHTML = label_msg;

		// Add label to input group	
		input_group_div.appendChild(button_label);

		// Creating button div container
		const dark_mode_button_div = document.createElement('div');
		dark_mode_button_div.className = 'custom-control custom-switch';

		const dark_mode_button = document.createElement('input');

		dark_mode_button.type = 'checkbox';
		dark_mode_button.id = 'dark-mode-toggle';
		dark_mode_button.className = 'custom-control-input';

		dark_mode_button_div.appendChild(dark_mode_button);

		const dark_mode_span = document.createElement('span');
		dark_mode_span.innerHTML = '&nbsp;';
		dark_mode_span.className = 'custom-control-label';

		dark_mode_button_div.appendChild(dark_mode_span);
		dark_mode_button.checked = get_cookie('dark-mode') === 'true';

		// Add button to input group
		input_group_div.appendChild(dark_mode_button_div);

		input_group_div.addEventListener('click', () => {
			if (!dark_mode_button.checked) {
				dark_mode_button.checked = true;
				button_label.classList.add('text-primary');
				save_cookie('dark-mode', 'true');
				set_dark_mode(true);
			} else {
				dark_mode_button.checked = false;
				button_label.classList.remove('text-primary');
				save_cookie('dark-mode', 'false');
				set_dark_mode(false);
			}
		});

		// Return input group div
		return input_group_div;
	}

	const add_dark_mode_button = () => {
		const button = create_dark_mode_button('Dark Mode');

		const obs = new MutationObserver((_mutations) => {
			const el_navbar = document.querySelector('#usernavigation');

			if (el_navbar) {
				el_navbar.appendChild(create_separation_div());
				el_navbar.appendChild(button);
				obs.disconnect();
			}
		});

		obs.observe(document.body, {
			childList: true,
			subtree: true,
		});
	}

	const dark_mode_cookie = get_cookie('dark-mode');
	if (dark_mode_cookie === 'true') {
		set_dark_mode(true);
	}

	add_dark_mode_button();
})();