// ==UserScript==
// @name         AO3 Dark Mode Reskin
// @name:de      AO3 Dunkelmodus
// @name:fr      Mode Sombre pour AO3
// @name:es      Modo Oscuro para AO3
// @name:ja      AO3ダークモード
// @name:zh-CN   AO3暗黑模式
// @name:it      Modalità Scura per AO3
// @name:ru      Тёмный режим для AO3
// @name:pt-BR   Modo Escuro para AO3
// @name:pt-PT   Modo Escuro para AO3
// @name:ko      AO3 다크 모드
// @namespace    ko-fi.com/awesome97076
// @version      1.10
// @license      MIT
// @description  A modern, accessible dark theme for AO3 with enhanced features
// @description:de Ein modernes, zugängliches dunkles Theme für AO3 mit erweiterten Funktionen
// @description:fr Un thème sombre moderne et accessible pour AO3 avec des fonctionnalités améliorées
// @description:es Un tema oscuro moderno y accesible para AO3 con características mejoradas
// @description:ja 拡張機能付きのAO3のためのモダンでアクセシブルなダークテーマ
// @description:zh-CN 为AO3设计的现代化、易访问的暗黑主题，具有增强功能
// @description:it Un tema scuro moderno e accessibile per AO3 con funzionalità migliorate
// @description:ru Современная, доступная тёмная тема для AO3 с расширенными возможностями
// @description:pt-BR Um tema escuro moderno e acessível para AO3 com recursos aprimorados
// @description:pt-PT Um tema escuro moderno e acessível para AO3 com recursos aprimorados
// @description:ko 향상된 기능을 가진 AO3를 위한 현대적이고 접근성 있는 다크 테마
// @author       Awesome
// @match        https://archiveofourown.org/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=archiveofourown.org
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/536377/AO3%20Dark%20Mode%20Reskin.user.js
// @updateURL https://update.greasyfork.org/scripts/536377/AO3%20Dark%20Mode%20Reskin.meta.js
// ==/UserScript==

(function () {
	'use strict';

	// Configuration
	const CONFIG = {
		DEBUG: false,
		TIMEOUTS: {
			INIT: 100,
			OBSERVER: 100
		}
	};

	// Unicode symbols for stats
	const STAT_SYMBOLS = {
		'Language:': '🌐',
		'Words:': '📝',
		'Chapters:': '📚',
		'Comments:': '💬',
		'Kudos:': '❤️',
		'Bookmarks:': '🔖',
		'Hits:': '👁️',
		'Collections:': '📂',
		'Published:': '📅',
		'Status:': '📊',
		'Completed:': '✅',
		'Updated:': '🔄',
		'Reading time:': '⏱️',
		'Kudos/Hits:': '📈'
	};

	// Utility functions
	const utils = {
		log: (...args) => {
			if (CONFIG.DEBUG) console.log('[AO3 Dark Mode]', ...args);
		},

		warn: (...args) => {
			console.warn('[AO3 Dark Mode]', ...args);
		},

		debounce: (func, wait) => {
			let timeout;
			return function executedFunction(...args) {
				const later = () => {
					clearTimeout(timeout);
					func(...args);
				};
				clearTimeout(timeout);
				timeout = setTimeout(later, wait);
			};
		}
	};


	const style = document.createElement("style");
	style.innerHTML = `
/* ==================== CSS Variables ==================== */
:root {
	--background-color: #121212;
	--primary-bg-color: #1c1c1c;
	--secondary-bg-color: #2a2a2a;
	--tertiary-bg-color: #444;
	--quaternary-bg-color: #555;
	--highlight-bg-color: #111111;
	--hover-bg-color: #444444;
	--background-primary: #121212;
	--background-secondary: #1e1e1e;
	--background-tertiary: #2a2a2a;
	--background-highlight: #333333;
	--text-color: #e0e0e0;
	--text-secondary: #bbbbbb;
	--text-tertiary: #999999;
	--text-muted: #777777;
	--link-color: rgb(21, 184, 190);
	--link-visited: #c87cffcc;
	--accent-primary: #e05b5b;
	--accent-secondary: #b74040;
	--accent-tertiary: #973535;
	--ao3-red-dark: #8c1c1c;
	--ao3-red-medium: #a82828;
	--ao3-red-light: #c43535;
	--alert-error: #cf6679;
	--alert-warning: #ffe066;
	--alert-success: #81c784;
	--alert-info: #64b5f6;
	--border-primary: #424242;
	--border-secondary: #333333;
	--shadow-color: rgba(0, 0, 0, 0.4);
	--box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
	--hover-box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
	--transition: all 0.2s ease;
	--header-background: #202020;
	--footer-background: #1a1a1a;
	--font-family: 'Inter', 'Roboto', -apple-system, BlinkMacSystemFont, 'Lucida Grande', 'Lucida Sans Unicode', Verdana, Helvetica, sans-serif, 'GNU Unifont';
	--font-size-small: 0.9vw;
	--font-size-base: 1.1vw;
	--font-size-large: 1.3vw;
	--font-size-larger: 1.5vw;
	--font-size-xlarge: 1.7vw;
	--border-radius: 8px;
	--border-radius-large: 12px
}

/* ==================== Base Styles ==================== */
html, body{
  border: 0;
  outline: 0;
  font-weight: inherit;
  font-style: inherit;
  font-size: var(--font-size-base);
  font-family: inherit;
  vertical-align: baseline;
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 100%;
}

html {
	-webkit-text-size-adjust: 100%;
	-ms-text-size-adjust: 100%;
}

body {
	background: var(--background-primary)
}

@media only screen and (max-width: 42em), handheld {
	#outer {
		background: var(--background-color) !important;
		font-size: 0.875em;
	}

	body .narrow-shown {
		display: block !important;
		color: var(--text-color);
	}

	.javascript .narrow-hidden {
		display: none !important;
	}
}

.filtered .index {
    width: 69vw;
    float: left;
    margin-left: 0.5vw;
}

@media (max-width: 480px) {
	html {
		font-size: 14px;
	}
}

@media (min-width: 1200px) {
	html {
		font-size: 18px;
	}
}

/* ==================== Header Styles ==================== */
#header a, #header a:visited, #header .primary .open a, #header .primary .dropdown:hover a, #header .primary .dropdown a:focus {
	color: var(--text-color)
}

#dashboard, #dashboard.own, .error, .comment_error, .kudos_error, #header ul.primary, .LV_invalid, .LV_invalid_field, input.LV_invalid_field:hover, input.LV_invalid_field:active, textarea.LV_invalid_field:hover, textarea.LV_invalid_field:active, #header .primary a, #header .primary input, #header .search input {
	border-color: var(--border-primary) !important
}

#header ul.primary, #footer, .autocomplete .dropdown ul li:hover, .autocomplete .dropdown li.selected, a.tag:hover {
	background:var(--background-color)
}

.actions a:visited, .action:visited, .action a:link, .action a:visited {
	color: var(--text-tertiary)
}

form.verbose legend, .verbose form legend {
	background: var(--background-color);
	color: var(--text-color);
	border: 1px solid var(--border-primary);
	box-shadow: 1px 2px 3px #999
}

#outer, .javascript, .statistics .index li:nth-of-type(2n), #tos_prompt, .announcement input[type="submit"], .nomination dt {
	background: var(--background-color)
}

body, html {
	background: var(--background-color);
	color: var(--text-color);
	font-family: var(--font-family);
	margin: 0;
	padding: 0;
	line-height: 1.5;
	scroll-behavior: smooth;
	overflow-x: hidden;
}

#outer {
	background: var(--background-color);
	min-height: 100vh;
	position: relative;
}

#main {
	font-size: var(--font-size-base);
	padding: 0;
	margin: 0;
	max-width: 100vw;
	width: 100vw;
	background: var(--background-color);
	box-sizing: border-box;
	position: static !important;
}

#main.dashboard {
    max-width: 82vw;
    margin: 0.5em auto 1em 16vw;
    padding-left: 1em;
    position: static !important;
}
.dashboard > form {
width: 24% !important;
}
.dashboard .index {
    width: 69% !important;
    float: left;
    margin-left: 0.5vw;
}
.listbox .index {
    width: 99% !important;
}
@media only screen and (max-width: 42em), handheld {

	#main.errors {
		background-position: center !important;
	}

	#main.session {
		background-image: none !important;
	}

	#main.errors p, #main.errors .heading {
		margin-right: 0 !important;
	}

	#main.errors p:last-child {
		margin-bottom: 500px !important;
	}
}

/* ==================== Typography ==================== */
h1, h2, h3, h4, h5, h6, .heading {
	color: var(--text-color);
	font-family: Georgia, serif;
	font-weight: 400;
	line-height: 1.2;
	margin-bottom: 0.6em;
	word-wrap: break-word;
	overflow-wrap: break-word;
	word-break: break-word;
}

p {
	margin-bottom: 1em;
	text-align: justify;
	letter-spacing: 0.02em;
	word-wrap: break-word;
	overflow-wrap: break-word;
}

/* ==================== Links ==================== */
a, a:link {
	color: var(--link-color);
	text-decoration: none;
	border-bottom: 1px solid var(--accent-secondary);
	transition: color var(--transition), border-color var(--transition);
	word-wrap: break-word;
	overflow-wrap: break-word;
}

a:visited {
	color: var(--link-visited);
	border-bottom: 1px dashed var(--accent-tertiary)
}
.listbox > .heading, .listbox .heading a:visited {
    color: var(--link-visited);
}

a:hover, a:focus {
	color: var(--text-secondary);
	border-color: var(--accent-tertiary);
	text-decoration: none
}

a:focus, button:focus, input:focus, textarea:focus, select:focus {
	outline: 2px solid var(--link-color);
	outline-offset: 2px
}

/* ==================== Header Layout ==================== */
#header {
	background: var(--header-background);
	margin: 0 0 1em;
	border-bottom: 1px solid var(--border-primary);
	font-size: 0.875em;
	position: relative;
	z-index: 100;
	width: 100%;
	box-sizing: border-box;
}

#header .primary {
	background: var(--ao3-red-dark);
	box-shadow: inset 0 -6px 10px rgba(0, 0, 0, 0.35), 1px 1px 3px -1px rgba(0, 0, 0, 0.25);
	position: relative;
	overflow-x: auto;
	white-space: nowrap;
}

#header .primary a {
	color: var(--text-color);
	padding: 0.429em 0.75em;
	border-bottom: none;
	display: inline-block;
	white-space: nowrap;
}

#header .heading a {
	color: var(--ao3-red-light);
	font-size: 1.714em;
	line-height: 1.75em;
	border-bottom: none
}

#header .dropdown .menu, #small_login {
  background: var(--background-secondary);
  border: 1px solid var(--border-primary);
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  z-index: 9999;
  max-width: 90vw;
  overflow-x: auto;
  position: fixed !important;
  display: none;
  margin-bottom: 10px;
}

#header .dropdown .menu a {
  color: var(--text-color);
  border-bottom: none;
    border-bottom-color: currentcolor;
  display: block;
  white-space: nowrap;
  z-index: 999;
  padding: 0;
  margin: 1px 0;
}

#header .dropdown .menu a:hover, #header .dropdown .menu a:focus {
	background: var(--background-highlight);
	color: var(--accent-primary)
}

@media only screen and (max-width: 42em), handheld {
	#header .logo {
		height: 1.75em !important;
	}

	#header .dropdown a:focus {
		outline: none !important;
		background: transparent !important;
		color: #111 !important;
	}

	#header .primary > li:first-of-type {
		margin-left: 0 !important;
	}

	#header .open a:focus {
		background: #ddd !important;
	}

	#header .primary .dropdown a:focus {
		color: #fff !important;
	}

	#header .primary .open a:focus {
		color: #111 !important;
	}

	#header .user .open a:focus {
		color: #900 !important;
	}

	#header h2.collections {
		padding: 1% !important;
		margin: 0 !important;
	}

	#header #small_login {
		margin-left: 45px !important;
	}

	#header .dropdown, #greeting .user {
		position: static !important;
	}

	#header .menu {
		width: 100% !important;
		position: absolute !important;
		left: 0 !important;
	}
}

/* ==================== Header Module (Work Headers) ==================== */

.header.module ul.required-tags {
	position: absolute;
	grid-area: tags;
	display: grid;
	grid-template-columns: repeat(2, 1fr);
	grid-template-rows: repeat(2, auto);
	gap: 0.15em;
	margin: 0 0 0 10px;
	padding: 0;
	width: 60px;
	align-self: start;
    grid-column: 1;
    grid-row: 1;
}

.header.module h4.heading {
    grid-area: title;
    word-break: break-word;
    hyphens: auto;
    align-self: start;
    margin-left: 2em !important;
}

.header.module p.datetime {
	grid-area: date;
	margin: 0;
	text-align: right;
	white-space: nowrap;
	align-self: start;
	font-size: 0.9em;
	color: var(--text-tertiary);
}



/* ==================== Footer ==================== */
#footer {
	background: var(--footer-background);
	border-top: 2px solid var(--ao3-red-dark);
	padding: 1em;
	color: var(--text-color);
	width: 100%;
	box-sizing: border-box;
}

#footer a {
	color: var(--text-color);
	border-bottom: 1px solid var(--text-tertiary)
}

#footer a:hover, #footer a:focus {
	color: var(--accent-primary);
	background: transparent;
	border-color: var(--accent-primary)
}

/* ==================== Forms & Inputs ==================== */
input, textarea, select, button {
	font-family: var(--font-family);
	box-sizing: border-box;
}

input, textarea {
	width: 100%;
	max-width: 100%;
	background: var(--tertiary-bg-color);
	color: var(--text-color);
	border: 1px solid var(--border-primary);
	border-radius: var(--border-radius);
	padding: 0.5em;
	transition: var(--transition)
}

input:focus, textarea:focus, select:focus {
	background: var(--quaternary-bg-color) !important;
	border-color: var(--link-color) !important;
	color: var(--text-color) !important;
	box-shadow: 0 0 0 2px rgba(21, 184, 190, 0.25) !important;
	outline: none
}

select {
	vertical-align: text-top;
	width: 100%;
	min-width: 10.5em;
	appearance: none;
	background: var(--tertiary-bg-color);
	color: var(--text-color);
	border: 1px solid var(--border-primary);
	border-radius: var(--border-radius);
	padding: 5px 7px;
	font-size: var(--font-size-base);
	font-weight: 500;
	cursor: pointer;
	transition: var(--transition);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	padding-right: 12px;
	box-sizing: border-box;
}

select:hover {
	background-color: var(--quaternary-bg-color);
	border-color: var(--border-primary);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
	transform: scale(1.02);
	z-index: 999
}

option {
	background: var(--tertiary-bg-color);
	color: var(--text-color);
	padding: 5px
}

fieldset, form dl {
  background: var(--primary-bg-color);
  border: 1px solid var(--border-primary);
  border-radius: var(--border-radius);
  margin: 0.3em 0.3em;
  width: 95%;
  overflow: unset;
}

@media only screen and (max-width: 42em), handheld {
	.filtered .index, form.filters, form dd, form dt, form .meta dd, form .meta dt, form.inbox {
		width: 100% !important;
		max-width: 100% !important;
		min-width: 0 !important;
		float: none !important;
	}
}

/* ==================== Buttons & Actions ==================== */
.action, .action:link, .actions a, .actions a:link, .actions button, .actions input, .actions label, button, input[type="submit"] {
  background: var(--background-tertiary);
  color: var(--text-color);
  border: 1px solid var(--border-primary);
  font-size: var(--font-size-base);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  border-radius: var(--border-radius);
  cursor: pointer;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  margin: 4px;
  padding: 0.4em 0.6em;
  box-shadow: none;
  text-shadow: none;
  box-sizing: border-box;
  white-space: nowrap;
}

input[type="submit"] {
  height: fit-content;
  padding: 0 0.6em;
}

.action:hover, .actions a:hover, .actions button:hover, .actions input:hover, button:hover, input[type=submit]:hover {
	background: var(--background-highlight);
	border-color: var(--accent-primary);
	color: var(--accent-primary);
	transform: translateY(-1px)
}

/* ==================== Work Blurbs ==================== */
.group-group, #main li.blurb {
	display: flex;
	gap: 8px;
	padding: 6px;
	margin: 8px 0;
	border-radius: var(--border-radius-large);
	background: var(--primary-bg-color);
	box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
	position: relative;
	transition: all 0.2s ease;
	flex-wrap: wrap;
	flex-direction: column;
	align-items: stretch;
	width: 100%;
	box-sizing: border-box;
}

.group-group {
	box-shadow: none;
	background: transparent;
	padding: 0;
	margin: 0;
	border-radius: 0;
    max-width: 100%;
}


#main li.blurb:hover {
	transform: scale(1.02);
	box-shadow: var(--hover-box-shadow);
	background: var(--secondary-bg-color)
}

.blurb h4.heading a {
	font-size: var(--font-size-large) !important;
	color: var(--link-color);
	text-decoration: none;
	transition: color var(--transition);
	line-height: 1.3;
	white-space: normal;
	border-bottom: none;
	margin: 0 15px;
	word-wrap: break-word;
	overflow-wrap: break-word;
}

.blurb h4.heading a:hover {
	color: var(--text-secondary)
}

.blurb .datetime {
	font-size: var(--font-size-large);
	margin: 0
}

h5.heading {
	order: 4 !important
}

/* ==================== Tag Groups ==================== */
.category-group, .relationships-group, .characters-group, .meta dd {
    position: relative;
    padding: 5px;
    margin: 0 auto;
    border: none;
    border-radius: var(--border-radius);
    background: var(--secondary-bg-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 69%);
    display: flex;
    gap: 4px;
    max-height: 18em;
    overflow-y: auto;
    font-size: var(--font-size-base);
    overflow-x: hidden;
    scrollbar-width: thin;
    flex-direction: row;
    flex-wrap: wrap;
    align-content: flex-start;
    max-width: 93.9%;
    justify-content: flex-start;
    box-sizing: border-box;
    width: 100%;
}

.blurb ul li, .blurb dd ul li {
	border: 3px solid #000;
	border-radius: var(--border-radius);
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
}

.blurb ul li a, .blurb dd ul li a {
	border: none;
	text-decoration: none;
	padding: 0.2em 0.6em
}

li.relationships a {
	background: none
}

a.tag {
	display: inline-block;
	background: var(--background-tertiary);
	color: var(--text-color);
	padding: 0.2em 0.6em;
	margin: 0.2em;
	border-radius: 3px;
	border-bottom: none;
	transition: background-color 0.2s ease, color 0.2s ease;
	font-weight: 500;
	font-size: var(--font-size-base);
	line-height: 1.4;
	white-space: nowrap;
	max-height: none;
	overflow: visible;
	word-wrap: break-word;
	overflow-wrap: break-word;
}

a.tag:hover {
	background: var(--accent-primary);
	color: var(--text-color);
	transform: translateY(-1px);
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
	text-decoration: none
}

.commas li {
	display: inline-block;
	margin-right: 0px;
	margin-bottom: 0px
}

.commas li:after {
	font-size: 6px;
	content: ""
}

.tags li {
	padding-left: 0;
	padding-right: 0
}


.meta .stats dl dt, .meta .stats dl dd {
    margin-block: 0;
    margin-inline: 0;
    padding-inline-end: 0;
    width: auto;
    min-width: 0;
    clear: none;
    float: none;
    padding: 0 10px;
}


/* ==================== Stats with Unicode ==================== */
dl.stats {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
	gap: 8px;
	margin: 6px 0 3px;
	padding: 0;
	line-height: 1.4;
	float: none;
	clear: both;
	text-align: left;
	width: 100%;
	box-sizing: border-box;
}

dl.stats > div {
    align-items: center;
    display: flex !important;
    min-width: 0;
    flex-direction: column;
    margin: auto;
}


.mods li, dl.stats dt, dl.stats dd {
	max-width: 100%;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
	background: transparent;
	width: auto;
	min-width: 0;
	display: inline;
	clear: none;
	float: none;
	margin: 0
}

/* Unicode symbols for stats */
.stats dt[data-symbol]::before {
	content: attr(data-symbol);
	margin-right: 0.3em;
	font-size: 1.1em;
}

/* Hide text for smaller stats, show only symbols */
dt[data-symbol] span {
	display: none;
}

/* ==================== Required Tags ==================== */

.blurb ul.required-tags li:nth-child(1) {
	grid-column: 1;
	grid-row: 1
}

.blurb ul.required-tags li:nth-child(2) {
	grid-column: 1;
	grid-row: 2
}

.blurb ul.required-tags li:nth-child(3) {
	grid-column: 2;
	grid-row: 1
}

.blurb ul.required-tags li:nth-child(4) {
	grid-column: 2;
	grid-row: 2
}

.blurb ul.required-tags li+li+li, .blurb ul.required-tags li+li+li+li {
	position: relative;
	left: 0
}

.blurb ul.required-tags li+li+li+li {
	top: 0
}

.blurb ul.required-tags li, .blurb ul.required-tags li a, .blurb ul.required-tags li span {
	border: none;
	box-shadow: none
}

@media only screen and (max-width: 42em), handheld {
	.blurb dl.tags dt, .blurb dl.tags dd, dl.meta dt, dl.meta dd, .alphabet .listbox li, .media .listbox {
		float: none !important;
	}

  .blurb dl.tags dd, dl.meta dd {
    margin: auto;
    width: 95%;
  }

	.alphabet .listbox li {
		display: block !important;
	}
}

/* ==================== Workskin ==================== */
#workskin {
	margin: 0 auto !important;
	background: var(--background-primary) !important;
	color: var(--text-color) !important;
	padding: 1em !important;
	border-radius: var(--border-radius);
	box-shadow: var(--box-shadow);
	font-size: var(--font-size-large);
	line-height: 1.6;
	max-width: 72em;
	overflow-x: auto;
	overflow-y: hidden;
	width: 100%;
	box-sizing: border-box;
}

.chapter .secondary, .download .secondary {
    top: 8.5em;
}

@media only screen and (max-width: 42em), handheld {
	#workskin {
		margin: auto !important;
	}
}

.preface {
  background: var(--background-secondary);
  border-radius: 4px;
  border-top: none !important;
  padding: 1em !important;
  margin: 1em 0 !important;
  float: none;
  width: 100%;
  box-sizing: border-box;
}

.userstuff {
	line-height: 1.6;
	word-wrap: break-word;
	overflow-wrap: break-word;
}

.userstuff p, .userstuff details {
	margin: 1.5em 0;
	padding: 0;
	text-rendering: optimizelegibility;
	word-wrap: break-word;
	overflow-wrap: break-word;
}

.userstuff a {
	color: var(--accent-primary)
}

.userstuff blockquote {
	background: var(--background-tertiary);
	border-left: 3px solid var(--accent-primary);
	padding: 1em;
	margin: 1em 0;
	border-radius: 0 var(--border-radius) var(--border-radius) 0;
	width: 100%;
	box-sizing: border-box;
	overflow-x: auto;
}

.userstuff h3 {
	font-weight: 500;
	padding: .125em;
	border-bottom: .25em double var(--border-primary);
	word-wrap: break-word;
	overflow-wrap: break-word;
}

.userstuff code, .userstuff pre {
	background: var(--background-tertiary);
	color: var(--text-color);
	font-family: "Monaco", "Consolas", Courier, monospace;
	padding: 0.2em 0.4em;
	border-radius: 3px;
	border: 1px solid var(--border-primary);
	word-wrap: break-word;
	overflow-wrap: break-word;
}

.userstuff pre {
	padding: 1em;
	overflow-x: auto;
	width: 100%;
	box-sizing: border-box;
}

.userstuff p:only-child:empty, .userstuff p:only-child:blank, .userstuff details:only-child:empty, .userstuff details:only-child:blank {
	margin: 0;
	padding: 0;
	height: 0.5em;
	min-height: 0.5em;
	line-height: 0.5
}

/* ==================== Comments ==================== */
ol.thread {
	list-style: none;
	padding: 0;
	margin: 0;
	width: 100%;
	box-sizing: border-box;
}

li.comment {
	position: relative;
	background: var(--background-secondary);
	border-radius: 4px;
	margin-bottom: 16px;
	padding: 12px 16px 12px 60px;
	box-shadow: 0 1px 3px var(--shadow-color);
	transition: transform 0.2s ease, box-shadow 0.2s ease;
	border: 1px solid var(--border-primary);
	overflow: visible;
	width: 100%;
	box-sizing: border-box;
}

.comment div.icon {
  float: none;
  border: none;
  left: -50px;
}

.comment .icon {
  position: relative;
  width: 40px;
  height: 40px;
  border: none;
  overflow: hidden;
  z-index: 1;
}

@media only screen and (max-width: 42em), handheld {
	.comment .icon {
		height: 55px !important;
		margin-bottom: 0 !important;
		width: 55px !important;
	}

	.comment .icon .anonymous {
		background: url(/images/imageset.png) no-repeat -75px -395px !important;
	}

	.comment .icon .visitor {
		background: url(/images/imageset.png) no-repeat -130px -395px !important;
	}

	.comment h4.byline {
		padding-left: 62px !important;
	}
	.comment div.icon {
		float: none;
		border: none;
		left: -29.4px;
		top: -46.0px;
	}
}

.comment .icon img {
	width: 100%;
	height: 100%;
	object-fit: cover;
	border-radius: 50%;
}

.comment .icon .visitor {
	width: 100%;
	height: 100%;
	background: var(--background-tertiary);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 1.2em;
	color: var(--text-tertiary);
}

.comment .icon .visitor::before {
	content: "👤";
}

.comment h4.byline {
	background: transparent;
	padding: 0;
	margin: 0 0 8px 0;
	border-radius: 0;
	width: 100%;
	box-sizing: border-box;
	display: flex;
	flex-wrap: wrap;
	align-items: baseline;
	gap: 8px;
}

.comment .heading.byline a {
	color: var(--accent-primary);
	font-weight: 600;
	text-decoration: none;
	border-bottom: none;
	word-wrap: break-word;
	overflow-wrap: break-word;
}

.comment .heading.byline a:hover {
	text-decoration: underline;
}

.comment .heading.byline span:not(.posted) {
	color: var(--text-secondary);
	font-weight: normal;
}

.comment .posted.datetime {
	font-size: 0.85rem;
	color: var(--text-tertiary);
	margin-left: auto;
	white-space: nowrap;
	flex-shrink: 0;
}

li.comment:hover {
	transform: translateY(-2px);
	box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2)
}

li.odd.comment {
	background: var(--background-secondary)
}

li.even.comment {
	background: var(--background-highlight)
}

.comment blockquote.userstuff {
	clear: both;
	background: var(--background-tertiary);
	border-radius: var(--border-radius);
	border-left: 3px solid var(--accent-primary);
	padding: 12px;
	margin: 10px 0;
	font-size: 1.1rem;
	line-height: 1.6;
	color: var(--text-color);
	width: 100%;
	box-sizing: border-box;
}

.comment blockquote.userstuff p {
	margin-bottom: 0.75em
}

.comment blockquote.userstuff p:last-child {
	margin-bottom: 0
}

@media only screen and (max-width: 42em), handheld {
	.thread .thread {
		margin-left: 1em !important;
	}

	.comment .userstuff {
		min-height: 0 !important;
	}
}

.thread .thread {
	margin-left: 2em;
	border-left: 2px solid var(--border-primary);
	width: calc(100% - 2em);
	box-sizing: border-box;
}

ol.thread ol.thread {
	margin-left: 20px;
	position: relative;
	width: calc(100% - 20px);
}

ol.thread ol.thread::before {
	content: '';
	position: absolute;
	left: -20px;
	top: 0;
	bottom: 0;
	width: 2px;
	background: var(--border-primary);
	border-radius: 1px
}

ol.thread ol.thread li.comment::before {
	content: '';
	position: absolute;
	left: -20px;
	top: 20px;
	width: 18px;
	height: 2px;
	background: var(--border-primary);
	border-radius: 1px
}

/* ==================== Filters ==================== */
form.filters {
    width: 30%;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
    float: none;
    box-sizing: border-box;
    position: absolute;
    right: 0;
}

@media only screen and (max-width: 42em), handheld {
	.javascript {
		background: #ddd !important;
	}

  .javascript form.filters {
    margin: 0 !important;
    position: absolute;
    top: 0 !important;
    right: -60% !important;
    width: 100% !important;
    z-index: 400 !important;
  }

  .javascript .filters fieldset {
    border: none !important;
    margin: 0 !important;
    position: relative !important;
    z-index: 450 !important;
    box-shadow: none !important;
    width: 80% !important;
  }

	.javascript .filters p.narrow-shown {
		position: relative !important;
	}

	.filtering {
		right: 14em !important;
	}

	.filtering .filters #leave_filters {
		background: transparent none !important;
		border-bottom: none !important;
		position: fixed !important;
		top: -101em !important;
		bottom: -101em !important;
		left: -10em !important;
		right: -10em !important;
		z-index: 0 !important;
	}

	.filtering #leave_filters:focus {
		outline: none !important;
	}
    .filters .expanded .expander {
  background-image: url("/images/arrow-down.gif");
  background-size: 8px;
}
}

@media only screen and (max-width: 42em), handheld {
	form.filters dl {
		width: auto !important;
	}
}

.filters .expander {
	background: var(--tertiary-bg-color);
	border: none;
	border-radius: var(--border-radius);
	color: var(--text-color);
	width: 100%;
	box-sizing: border-box;
}

.filters .expander::before {
	content: "⮞";
	color: var(--text-color);
	position: absolute;
	left: 2%;
	top: 50%;
	transform: translateY(-50%);
	font-size: 1em
}

.filters .expanded .expander::before {
	content: "⮟";
	color: var(--text-color);
	position: absolute;
	left: 2%;
	top: 50%;
	transform: translateY(-50%);
	font-size: 1em
}

.filters .expander:hover {
	transform: scale(1.05);
	z-index: 999
}

.filters .indicator:before {
	background: var(--tertiary-bg-color);
	color: var(--text-tertiary);
	display: inline-block;
	border: 1px solid var(--border-primary);
	margin-right: .25em;
	text-align: center
}

.filters .exclude .indicator:before {
	content: " ✕";
	padding: 2px 5px;
	border-radius: 3px
}

.filters .include .indicator:before {
	content: " ✓";
	padding: 2px 5px;
	border-radius: 3px
}

.filters .exclude .indicator:hover::before {
	content: " ✕";
	background-color: rgba(203, 144, 144, 0.3);
	color: rgb(204, 110, 110);
	padding: 2px 5px;
	border-radius: 3px
}

.filters .include .indicator:hover::before {
	content: " ✓";
	background-color: rgba(156, 203, 144, 0.3);
	color: rgb(112, 204, 110);
	padding: 2px 5px;
	border-radius: 3px
}

.filters .indicator span {
	font-size: var(--font-size-base);
	white-space: normal;
	display: inline-block;
	margin-left: 14px;
	line-height: 1.4;
	word-wrap: break-word;
	overflow-wrap: break-word;
}

/* ==================== Dashboard ==================== */
#dashboard {
	background: var(--background-secondary);
	width: 15vw;
	float: left;
	padding: 1em;
	border-right: 1px solid var(--border-primary);
	box-sizing: border-box;
}

@media only screen and (max-width: 42em), handheld {
	#dashboard, #dashboard.own {
		border-bottom-width: 7px !important;
		border-top-width: 7px !important;
		padding: 0.25em 0 !important;
		width: 100% !important;
		float: none !important;
		border-right: none !important;
		margin-bottom: 1em !important;
	}

	.dashboard .index {
		float: none !important;
	}

	.dashboard .landmark {
		clear: both !important;
	}
}

#dashboard a, #dashboard span {
	color: var(--text-color);
	display: block;
	white-space: normal;
	height: auto;
	line-height: 2;
	padding: 0.5em;
	margin: 0;
	border: 0;
	border-radius: 3px;
	background: transparent;
	vertical-align: middle;
	word-wrap: break-word;
	box-shadow: none;
	overflow-wrap: break-word;
}

#dashboard a:hover {
	background: var(--background-highlight);
	color: var(--accent-primary)
}

#dashboard .current {
	background: var(--background-highlight);
	color: var(--accent-primary);
	border-left: 3px solid var(--accent-primary)
}

/* ==================== Notices & Alerts ==================== */
.notice, .comment_notice, .kudos_notice {
	background: var(--background-secondary);
	border: 1px solid var(--border-primary);
	border-left: 3px solid var(--alert-info);
	color: var(--text-color);
	padding: 1em;
	margin: 1em 0;
	border-radius: 3px;
	width: 100%;
	box-sizing: border-box;
}

.alert.flash, .error, .comment_error, .kudos_error {
	background: var(--background-secondary);
	border: 1px solid var(--border-primary);
	border-left: 3px solid var(--alert-error);
	color: var(--alert-error);
	padding: 1em;
	margin: 1em 0;
	border-radius: 3px;
	width: 100%;
	box-sizing: border-box;
}

.caution {
	background: var(--background-secondary);
	border: 1px solid var(--border-primary);
	border-left: 3px solid var(--alert-warning);
	color: var(--alert-warning);
	padding: 1em;
	margin: 1em 0;
	border-radius: 3px;
	width: 100%;
	box-sizing: border-box;
}

@media only screen and (max-width: 42em), handheld {
	.listbox .index {
		width: auto !important;
	}
}

/* ==================== Pagination ==================== */
.pagination a, .pagination span {
	display: inline-block;
	padding: 0.3em 0.7em;
	margin: 0.1em;
	border-radius: var(--border-radius);
	min-width: 2em;
	text-align: center;
}

.pagination a {
	background: var(--tertiary-bg-color);
	color: var(--text-color);
	border: 1px solid var(--border-primary)
}

.pagination a:hover {
	background: var(--quaternary-bg-color);
	color: var(--link-color)
}

.pagination .current {
	background: var(--link-color);
	color: var(--text-color);
	border: 1px solid var(--border-primary)
}

.pagination .current a {
	margin: auto;
}

/* ==================== Splash Page ==================== */
@media only screen and (max-width: 42em), handheld {
	.splash {
		padding: 0 !important;
	}

	.splash div.module, .logged-in .splash div.module {
		clear: both !important;
		margin-left: 0 !important;
		margin-right: 0 !important;
		width: 100% !important;
	}

	.splash .intro {
		padding-top: 0 !important;
	}

	.splash .intro h2 {
		font-size: 1.5em !important;
		word-break: normal !important;
	}

	.session #signin {
		margin-left: 0 !important;
		width: 100% !important;
	}
}

@media only screen and (max-width: 42em), handheld {
	.announcement .userstuff {
		margin: 1% !important;
	}

	.announcement p.submit {
		bottom: -0.5em !important;
		right: 1% !important;
	}

	.announcement .thermometer-content {
		width: 80% !important;
	}

	.announcement .goal .amount {
		display: none !important;
	}

	.announcement .thermometer .progress .amount {
		left: 0 !important;
		right: auto !important;
	}
}

/* ==================== Scrollbars ==================== */
::-webkit-scrollbar {
	width: 12px;
	height: 12px;
	background: var(--background-primary)
}

::-webkit-scrollbar-track {
	background: var(--background-primary)
}

::-webkit-scrollbar-thumb {
	background: var(--background-tertiary);
	border-radius: 6px;
	border: 3px solid var(--background-primary)
}

::-webkit-scrollbar-thumb:hover {
	background: var(--background-highlight)
}

.category-group::-webkit-scrollbar, .relationships-group::-webkit-scrollbar, .characters-group::-webkit-scrollbar {
	width: 6px;
	height: 6px
}

.category-group::-webkit-scrollbar-thumb, .relationships-group::-webkit-scrollbar-thumb, .characters-group::-webkit-scrollbar-thumb {
	border-width: 1px
}

/* ==================== Work Meta ==================== */
.work.meta.group {
	display: flex;
	gap: 12px;
	float: none;
	padding: 10px;
	margin: 8px 0;
	border-radius: 10px;
	background: var(--primary-bg-color);
	box-shadow: 0 3px 12px rgba(0, 0, 0, 0.15);
	position: relative;
	transition: all 0.2s ease;
	flex-wrap: wrap;
	align-items: baseline;
	flex-direction: column;
	width: 100%;
	box-sizing: border-box;
}

.work.meta.group:hover {
	background: var(--secondary-bg-color);
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	transform: translateY(-2px)
}

.meta dt {
	min-width: 0;
	width: 100%;
	text-align: left;
	font-weight: bold;
	margin-bottom: 0.5em;
}

.meta dd {
	width: 100%;
	margin-left: 0;
}

/* ==================== Misc Styles ==================== */
.draft, .draft .wrapper, .unread, .child, .unreviewed, .unwrangled {
	background: var(--tertiary-bg-color);
	border: 1px dashed var(--border-primary);
	border-radius: var(--border-radius);
	opacity: 0.95
}

span.claimed, span.unread {
	color: var(--link-color)
}

.replied, span.claimed, span.unread {
	background: var(--tertiary-bg-color);
	border: 1px solid var(--border-primary)
}

table {
	background: var(--primary-bg-color);
	border-collapse: collapse;
	margin: auto;
	width: 100%;
	border-radius: var(--border-radius);
	overflow: hidden;
	box-sizing: border-box;
	overflow-x: auto;
	display: block;
	white-space: nowrap;
}

table tbody, table thead, table tfoot {
	display: table;
	width: 100%;
	table-layout: fixed;
}

th {
	background: var(--secondary-bg-color);
	color: var(--text-color);
	padding: 0.5em;
	text-align: left;
	border-bottom: 1px solid var(--border-primary);
	word-wrap: break-word;
	overflow-wrap: break-word;
}

td {
	padding: 0.5em;
	background: var(--primary-bg-color);
	border-bottom: 1px solid var(--border-secondary);
	word-wrap: break-word;
	overflow-wrap: break-word;
}

tr:hover {
	background: var(--tertiary-bg-color)
}

.group-group .userstuff {
    padding: 6px;
    border-radius: var(--border-radius);
    background: var(--secondary-bg-color);
    max-height: 16em;
    overflow-y: auto;
    font-size: var(--font-size-large);
    line-height: 1.4;
    width: 93.9%;
    box-sizing: border-box;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

ul.tags.commas{
max-width:100%
}

.group-group::before {
    content: "";
    position: absolute;
    top: 1px;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(89deg, var(--ao3-red-dark), var(--ao3-red-light), var(--ao3-red-dark));
    border-radius: 55px 55px 0 0;
    opacity: 0.4;
    max-width: 93%;
    z-index: 9999;
    margin: 0 auto;
}

.group-group > div:not(:last-child) {
	margin-bottom: 8px
}

.announcement .userstuff a, .announcement .userstuff a:link, .announcement {
	color: var(--accent-secondary)
}

.userstuff a:visited:hover {
	color: var(--accent-primary)
}

/* ==================== Additional Color Overrides ==================== */
body, .toggled form, .dynamic form, .secondary, .dropdown {
	background: var(--background-primary);
	color: var(--text-color)
}

#header, #footer, #main, #dashboard {
	background: var(--background-primary)
}

a, a:link, a:visited:hover {
	color: var(--accent-primary);
	border-bottom-color: var(--accent-secondary)
}

a:visited {
	color: var(--link-visited);
	border-bottom-color: var(--accent-tertiary)
}

a:hover, a:focus {
	color: var(--accent-tertiary)
}

a:active, a:focus, button:focus {
	outline: 1px dotted var(--accent-primary)
}

fieldset, form dl, fieldset dl dl, fieldset fieldset fieldset, fieldset fieldset dl dl, dd.hideme, form blockquote.userstuff {
	background: var(--background-secondary);
	border-color: var(--border-secondary);
	box-shadow: inset 1px 0 5px var(--shadow-color)
}

fieldset fieldset, fieldset dl dl, form blockquote.userstuff {
	background: var(--background-tertiary)
}

form dt {
	border-bottom-color: var(--border-secondary)
}

input, textarea, select {
	background: var(--background-tertiary);
	color: var(--text-color);
	border-color: var(--border-primary)
}

input:focus, textarea:focus, select:focus {
	background: var(--background-highlight) !important;
	border-color: var(--accent-primary) !important;
	box-shadow: 0 0 0 1px var(--accent-secondary)
}

.LV_invalid {
	background: #efd1d1;
	border-color: var(--alert-error);
	color: var(--alert-error);
	box-shadow: 1px 1px 2px var(--shadow-color)
}

.autocomplete div.dropdown ul {
	background: var(--background-primary);
	border-color: var(--border-secondary);
	box-shadow: 1px 3px 5px var(--shadow-color);
	color: var(--text-color);
	max-width: 90vw;
	overflow-x: auto;
}

.autocomplete .dropdown ul li:hover, .autocomplete .dropdown li.selected {
	background: var(--accent-primary);
	color: var(--text-color)
}

.ui-sortable li {
	background: var(--background-tertiary);
	border-color: var(--border-primary)
}

.ui-sortable li:hover {
	background: var(--background-highlight);
	border-color: var(--border-primary);
	box-shadow: 1px 1px 3px var(--shadow-color)
}

#header .actions a:hover, #header .actions a:focus, #header .dropdown:hover a, #header .open a {
	background: var(--background-highlight)
}

#header .menu, #small_login {
	background: var(--background-secondary);
	box-shadow: 1px 1px 3px -1px var(--shadow-color)
}

#header .menu li {
	border-bottom-color: var(--border-primary)
}

#header h2 {
	border-top-color: var(--border-primary);
	color: var(--text-color)
}

#dashboard ul {
	border-top-color: var(--border-primary)
}

#dashboard.own {
	background: transparent;
	border-top-color: var(--ao3-red-dark);
	border-bottom-color: var(--ao3-red-dark)
}

#main.errors {
	background-position: top right;
	background-repeat: no-repeat
}

#main.errors p, #main.errors .heading {
	color: var(--text-color)
}

thead, tfoot {
	border-bottom-color: var(--border-primary)
}

tfoot td {
	border-top-color: var(--border-primary)
}

tbody tr {
	border-bottom-color: var(--background-highlight)
}

thead td {
	background: var(--background-tertiary);
	border-bottom-color: var(--background-highlight)
}

th, tr:hover, col.name {
	background: var(--background-secondary);
	border-color: var(--border-primary)
}

.actions a, .actions a:link, .action, .action:link, .actions button, .actions input, input[type="submit"], button, .current, .actions label {
	background: var(--background-tertiary);
	color: var(--text-color);
	border: 1px solid var(--border-primary);
	border-bottom: 1px solid var(--border-secondary);
	background-image: none;
	box-shadow: none
}

.actions a:hover, .actions button:hover, .actions input:hover, .actions a:focus, .actions button:focus, .actions input:focus, label.action:hover, .action:hover, .action:focus {
	color: var(--accent-primary);
	border-top-color: var(--border-primary);
	border-left-color: var(--border-primary);
	box-shadow: inset 2px 2px 2px var(--shadow-color)
}

.actions a:active, .current, a.current, a:link.current, .current a:visited {
	color: var(--text-color);
	background: var(--background-highlight);
	border-color: var(--text-secondary);
	box-shadow: inset 1px 1px 3px var(--shadow-color)
}

.actions label.disabled {
	background: var(--background-tertiary);
	color: var(--text-muted)
}

li.blurb, .blurb .blurb {
	border-color: var(--border-primary);
	background: var(--background-secondary);
	box-shadow: 0 1px 3px var(--shadow-color)
}

.blurb h4 a:link, .blurb h4 img {
	color: var(--accent-primary)
}

.own, .draft, .draft .wrapper, .unread, .child, .unwrangled, .unreviewed {
	background: var(--background-tertiary);
	opacity: 0.95
}

span.unread, .replied, span.claimed, .actions span.defaulted {
	background: var(--background-secondary);
	color: var(--accent-primary);
	border-color: var(--border-primary)
}

.canonical, li.requested {
	font-weight: 700;
	color: var(--accent-primary)
}

.draggable, .droppable, span.requested, .nominations .rejected {
	color: var(--alert-error)
}

span.offered, .replied, .nominations .approved {
	color: var(--alert-success)
}

.nominations .approved {
	background: rgba(129, 199, 132, 0.2)
}

.nominations .rejected {
	background: rgba(207, 102, 121, 0.2)
}

div.comment, li.comment {
	border-color: var(--border-primary);
	background: var(--background-secondary)
}

.thread .even {
	background: var(--background-highlight)
}

.comment .userstuff {
	color: var(--text-color)
}

#main > ul.actions {
    position: relative;
    right: 10%;
}

.bookmark .status span, .bookmark .status a {
    font-size: 15px;
    font-weight: 900;
}

.notice, .comment_notice, .kudos_notice, ul.notes, .caution, .error, .comment_error, .kudos_error, .alert.flash {
	background: var(--background-secondary);
	border-color: var(--alert-info);
	box-shadow: inset 1px 1px 2px var(--shadow-color);
	color: var(--text-color)
    max-width: 80%;
}

.error, .comment_error, .kudos_error, .alert.flash {
	background: var(--background-secondary);
	border-color: var(--alert-error);
	color: var(--alert-error)
}

.caution {
	border-color: var(--alert-warning);
	color: var(--alert-warning)
}

.announcement .userstuff {
	background: var(--background-tertiary);
	border-color: var(--border-primary);
	color: var(--text-color)
}

.event .userstuff {
	background: var(--ao3-red-dark);
	border-color: var(--ao3-red-medium);
	color: var(--text-color)
}

.event .userstuff a {
	color: var(--text-secondary)
}

.alert .userstuff {
	background: var(--alert-warning);
	border-color: var(--alert-warning);
	color: #333
}

.userstuff {
	color: var(--text-color)
}

.userstuff h2 {
	color: var(--text-color)
}

.userstuff hr {
	border-color: var(--border-primary);
    width: 100%
}

.userstuff blockquote {
	border-color: var(--border-primary)
}

dl.meta {
	border-color: var(--border-primary);
	background: var(--background-secondary)
}

#modal-bg {
	background: rgba(0, 0, 0, 0.7)
}

#modal {
	background: var(--background-secondary);
	border-color: var(--background-tertiary);
	color: var(--text-color);
	box-shadow: 0 0 8px 0 var(--shadow-color);
	max-width: 90vw;
	max-height: 90vh;
	overflow: auto;
}

#modal .content {
	border-bottom-color: var(--border-primary)
}

a.tag:hover, .listbox .heading a.tag:visited:hover {
	background: var(--accent-primary);
	color: var(--text-color)
}

span.symbol {
	color: var(--accent-primary);
	border-color: var(--accent-primary)
}

.question a:hover {
	background: var(--accent-primary);
	border-color: var(--accent-secondary);
	color: var(--text-color)
}

span.question {
	background: var(--background-tertiary);
	border-color: var(--accent-primary)
}

/* ==================== Responsive Fixes ==================== */
@media (max-width: 320px) {
	html {
		font-size: 13px;
	}

	#main {
		width: 100%;
		padding: 0 2px;
	}

	.group-group, #main li.blurb {
		gap: 4px;
		padding: 6px;
		margin: 2px 0;
	}

	.blurb h4.heading a {
		font-size: var(--font-size-base) !important;
	}

	a.tag {
		font-size: 0.8rem;
		padding: 0.1em 0.3em;
	}

	.action, .action:link, .actions a, .actions a:link, .actions button, .actions input, .actions label, button, input[type=submit] {
		padding: 0.3em 0.5em;
		font-size: 0.8rem;
	}

	dl.stats {
		grid-template-columns: 1fr;
		gap: 2px;
	}

	.pagination a, .pagination span {
		padding: 0.2em 0.3em;
		min-width: 1.2em;
		font-size: 0.8rem;
	}
}

/* ==================== Print Styles ==================== */
@media print {
	* {
		background: white !important;
		color: black !important;
		box-shadow: none !important;
		text-shadow: none !important;
	}

	#header, #footer, #dashboard, form.filters, .actions {
		display: none !important;
	}

	#main {
		width: 100% !important;
		margin: 0 !important;
		padding: 0 !important;
	}

	.group-group, #main li.blurb {
		break-inside: avoid;
		page-break-inside: avoid;
	}

	a {
		text-decoration: underline !important;
		border-bottom: none !important;
	}

	.userstuff {
		font-size: 12pt !important;
		line-height: 1.4 !important;
	}
}

/* ==================== Accessibility ==================== */
.skip-link {
	position: absolute;
	top: -40px;
	left: 6px;
	background: var(--accent-primary);
	color: var(--text-color);
	padding: 8px;
	text-decoration: none;
	border-radius: 4px;
	z-index: 1000;
}

.skip-link:focus {
	top: 6px;
}

@media (max-width: 768px) {
	a, button, input, select, textarea, .action {
		min-height: 24px;
		min-width: 24px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}

	a.tag {
		min-height: 20px;
		min-width: auto;
	}
}

@media (min-width: 481px) and (max-width: 1024px) and (orientation: landscape) {
	#main.dashboard {
		margin-left: 12em;
		width: calc(100% - 12em);
	}

	#dashboard {
		width: 10em;
		float: left;
		border-right: 1px solid var(--border-primary);
		border-bottom: none;
	}

	form.filters {
		width: 25%;
		float: right;
	}
}

/* ==================== RTL Support ==================== */
[dir="rtl"] .blurb .header .heading,
[dir="rtl"] .blurb .header ul {
	margin: .375em 65px 0 5.25em;
}

[dir="rtl"] .header.module ul.required-tags {
	right: 0;
	left: auto;
}

[dir="rtl"] .header.module p.datetime {
	left: 0;
	right: auto;
	text-align: left;
}

[dir="rtl"] .header.module h4.heading {
	margin: 0 50px 0.5em 100px;
}

[dir="rtl"] #dashboard.own {
	border-right-color: var(--ao3-red-dark);
	border-left-color: var(--ao3-red-dark);
}

[dir="rtl"] .meta dt {
	text-align: left;
}

[dir="rtl"] form.filters {
	float: left;
}

[dir="rtl"] #main.dashboard {
	margin-right: 14em;
	margin-left: 0;
	padding-right: 1em;
	padding-left: 0;
}

/* ==================== Dark Mode Image Optimization ==================== */
@media (prefers-color-scheme: dark) {
	img {
		opacity: 0.9;
		transition: opacity 0.2s ease;
	}

	img:hover {
		opacity: 1;
	}
}

@media (prefers-reduced-data: reduce) {
	.group-group::before {
		display: none;
	}

	.box-shadow,
	.hover-box-shadow,
	box-shadow {
		box-shadow: none !important;
	}

	.transition {
		transition: none !important;
	}
}

@supports (container-type: inline-size) {
	.blurb {
		container-type: inline-size;
	}

	@container (max-width: 400px) {
		.blurb .header {
			flex-direction: column;
			gap: 0.25em;
		}

		.blurb h4.heading a {
			font-size: var(--font-size-base) !important;
		}
	}
}

/* Force hardware acceleration */
.group-group,
#main li.blurb,
.work.meta.group,
li.comment,
.action,
.actions a,
.actions button,
a.tag {
	transform: translateZ(0);
	backface-visibility: hidden;
	perspective: 1000;
}

@media (max-width: 768px) {
	::-webkit-scrollbar {
		width: 8px;
		height: 8px;
	}

	::-webkit-scrollbar-thumb {
		border: 1px solid var(--background-primary);
	}
}

/* ==================== Mobile-specific improvements ==================== */
@media (max-width: 480px) {
	#main {
		width: 98%;
		padding: 0 4px;
		margin: 0;
	}

	#main.dashboard {
		margin-left: 0;
		padding-left: 0.5em;
		width: 100%;
	}

	form.filters {
		width: 100%;
		float: none;
		margin: 0 0 16px 0;
		order: -1;
	}

	#dashboard {
		width: 100%;
		float: none;
		border-right: none;
		border-bottom: 1px solid var(--border-primary);
		margin-bottom: 1em;
		padding: 0.5em;
	}

	.meta dt {
		width: 100%;
		text-align: left;
		margin-bottom: 0.25em;
	}

	.meta dd {
		width: 100%;
		margin-left: 0;
		margin-bottom: 1em;
	}

	dl.stats {
		grid-template-columns: repeat(3, 1fr);
		gap: 4px;
	}

	.words-group, .chapters-group, .comments-group, .kudos-group, .bookmarks-group, .hits-group, .collections-group, .language-group, .published-group, .status-group, .progress-group {
		min-width: 60px;
	}

	ol.thread ol.thread {
		margin-left: 5px;
		width: calc(100% - 5px);
	}

	ol.thread ol.thread::before {
		left: -5px;
	}

	ol.thread ol.thread li.comment::before {
		left: -5px;
		width: 3px;
	}

	.thread .thread {
		margin-left: 1em;
		width: calc(100% - 1em);
	}

	.blurb h4.heading a {
		font-size: 1.1rem !important;
	}

	h5:nth-child(2) > a {
		font-size: var(--font-size-base) !important;
	}

	#outer .group .heading {
		font-size: var(--font-size-base);
	}

	a.tag {
		font-size: 0.9rem;
		padding: 0.15em 0.4em;
		margin: 0.1em;
	}

	.category-group, .relationships-group, .characters-group, .meta dd {
		font-size: var(--font-size-base);
		gap: 4px;
		padding: 3px;
	}

	#workskin {
		font-size: 1.1rem;
		padding: 0.5em !important;
	}

	.userstuff blockquote {
		padding: 0.5em;
		margin: 0.5em 0;
	}

	.comment blockquote.userstuff {
		font-size: var(--font-size-base);
		padding: 8px;
	}

	.group-group .userstuff {
		font-size: var(--font-size-base);
		padding: 4px;
	}

	.blurb .header {
		gap: 0.25em;
	}

	.group-group, #main li.blurb {
		gap: 8px;
		padding: 8px;
		margin: 4px 0;
	}

	.action, .action:link, .actions a, .actions a:link, .actions button, .actions input, .actions label, button, input[type=submit] {
		padding: 0.4em 0.8em;
		margin: 2px;
		font-size: 0.9rem;
	}

	fieldset, form dl {
		margin: 0.3em;
		padding: 0.5em;
	}

	.pagination a, .pagination span {
		padding: 0.25em 0.5em;
		min-width: 1.5em;
		font-size: 0.9rem;
	}

	#header .primary a {
		padding: 0.3em 0.5em;
		font-size: 0.9rem;
	}

	#header .heading a {
		font-size: 1.4em;
	}

	#footer {
		padding: 0.5em;
		font-size: 0.9rem;
	}

	table {
		font-size: 0.9rem;
	}

	th, td {
		padding: 0.3em;
	}

	li.comment {
		padding: 8px 12px 8px 50px;
	}

	.comment h4.byline {
		flex-direction: column;
		align-items: flex-start;
		gap: 4px;
	}

	.comment .posted.datetime {
		margin-left: 0;
		font-size: 0.8rem;
	}
}

@media (max-width: 320px) {
	li.comment {
		padding: 6px 8px 6px 40px;
	}

	.comment .icon {
		width: 28px;
		height: 28px;
	}
}

@media (min-width: 481px) and (max-width: 768px) {
	#main {
		width: 95%;
		padding: 0 6px;
	}

	#main.dashboard {
		margin-left: 0;
		padding-left: 1em;
		width: 100%;
	}

	form.filters {
		width: 100%;
		float: none;
		margin-left: 0;
		margin-bottom: 16px;
	}

	#dashboard {
		width: 100%;
		float: none;
		border-right: none;
		border-bottom: 1px solid var(--border-primary);
		margin-bottom: 1em;
	}

	.meta dt {
		width: 100%;
		text-align: left;
	}

	.meta dd {
		width: 70%;
	}

	.work.meta.group {
		flex-direction: row;
		align-items: flex-start;
	}

	dl.stats {
		grid-template-columns: repeat(4, 1fr);

	}

	ol.thread ol.thread {
		margin-left: 10px;
		width: calc(100% - 10px);
	}

	ol.thread ol.thread::before {
		left: -10px;
	}

	ol.thread ol.thread li.comment::before {
		left: -10px;
		width: 8px;
	}
}

@media (min-width: 769px) and (max-width: 1024px) {
	#main {
		width: 92%;
	}

	form.filters {
max-width: 30%;
		width: 30%;
	}

	.meta dt {
		width: 15%;
		text-align: right;
	}

	.meta dd {
		width: 80%;
	}

	.work.meta.group {
		flex-direction: row;
		align-items: baseline;
	}

	dl.stats {
		grid-template-columns: repeat(4, 1fr);
	}
}

@media (min-width: 1025px) {
    .meta dt {
        width: 14%;
        text-align: right;
        font-size: var(--font-size-base);
    }

	.meta dd {
		width: 80%;
	}

	.work.meta.group {
		flex-direction: row;
		align-items: baseline;
	}

	dl.stats {
		display: flex;
		flex-wrap: wrap;
	}
}

@media (prefers-color-scheme: dark) {
	#workskin img {
		box-shadow: 0 0 0 1px var(--border-primary);
		border-radius: var(--border-radius);
		max-width: 100%;
		height: auto;
	}
}

/* ==================== Accessibility improvements ==================== */
@media (prefers-reduced-motion: reduce) {
	* {
		animation-duration: 0.01ms !important;
		animation-iteration-count: 1 !important;
		transition-duration: 0.01ms !important;
		scroll-behavior: auto !important;
	}

	#main li.blurb:hover {
		transform: none;
	}

	.work.meta.group:hover {
		transform: none;
	}

	li.comment:hover {
		transform: none;
	}

	.action:hover, .actions a:hover, .actions button:hover, .actions input:hover, button:hover, input[type=submit]:hover {
		transform: none;
	}

	a.tag:hover {
		transform: none;
	}

	.filters .expander:hover {
		transform: none;
	}
}

@media (prefers-contrast: high) {
	:root {
		--border-primary: #ffffff;
		--border-secondary: #cccccc;
		--text-color: #ffffff;
		--background-primary: #000000;
		--background-secondary: #111111;
		--background-tertiary: #222222;
		--link-color: #00ffff;
		--accent-primary: #ff0000;
	}
}

/* ==================== Landmark elements ==================== */
h4.landmark, h5.landmark, .landmark, .landmark a, .index .heading.landmark {
	font-size: 0;
	line-height: 0;
	height: 0;
	margin: 0;
	clear: both;
	color: transparent;
	opacity: 0;
	left: -9999px;
}

.blurb .header .heading, .blurb .header ul {
    margin: 25px 0 0 30px;
}

@media (max-width: 768px) {
	.blurb .header .heading, .blurb .header ul {
		margin: 0;
	}
}

.blurb .header img {
	position: relative;
	margin: 0;
	max-width: 100%;
	height: auto;
}

.delete a, span.delete {
	border: 0;
	color: var(--alert-error);
	font-weight: 700;
	margin-right: .375em;
	padding: 0 .1em .15em;
	box-shadow: -1px -1px 2px rgba(0, 0, 0, 0.5);
	border-radius: .875em
}

blockquote {
	font-family: var(--font-family);
	margin: .643em;
	word-wrap: break-word;
	overflow-wrap: break-word;
	width: 100%;
	box-sizing: border-box;
}

blockquote p:first-child {
	margin-top: 0
}

blockquote p:last-child {
	margin-bottom: 0
}

*:focus {
	outline: none
}

a:focus, button:focus, input:focus, select:focus, textarea:focus {
	outline: 2px solid var(--link-color);
	outline-offset: 2px
}

.listbox, fieldset fieldset.listbox {
  clear: right;
  background: var(--secondary-bg-color);
  border: 2px solid var(--border-primary);
  padding: 0;
  margin: 0.643em auto;
    margin-right: auto;
  overflow: hidden;
  box-shadow: var(--box-shadow);
}
.listbox .index {
  width: auto;
  padding: 0.643em;
  margin: 0;
  float: none;
  clear: right;
  background: var(--secondary-bg-color);
  box-shadow: inset var(--box-shadow);
}
#header .open .menu, #header .dropdown:hover .menu, .open + #small_login, #header .menu li {
  display: block;
  float: none;
}

.userstuff p {
  font-size: var(--font-size-larger);
}
blockquote p {
  font-size: var(--font-size-base) !important;
}

.chapter .secondary, .download .secondary {
  top: 6em;
}

.post .required .warnings, dd.required {
  font-weight: normal;
  color: var(--text-color);
}
.required .autocomplete, .autocomplete .notice {
  color: var(--text-color);
}
form dd.required {
  color: #939393;
}

.splash .favorite li:nth-of-type(2n+1) a {
  background: var(--quaternary-bg-color);
}

/* ==================== Splash Page Styles ==================== */
.splash {
	display: grid;
	grid-template-columns: 1fr 2fr;
	grid-template-areas:
		"sidebar main"
		"sidebar main";
	gap: 1.5em;
	padding: 1em 0;
	margin: 0 auto;
	max-width: 100%;
	width: 100%;
	box-sizing: border-box;
	align-items: start;
}

.splash-sidebar {
	grid-area: sidebar;
	display: flex;
	flex-direction: column;
	gap: 1.5em;
}

.splash-main {
	grid-area: main;
}

.splash .favorite {
	order: 1;
}

.splash .social {
	order: 2;
}

.splash .news {
	order: 3;
	grid-column: 2;
	grid-row: 1 / -1;
}
.splash .module {
	background: var(--primary-bg-color);
	border: 1px solid var(--border-primary);
	border-radius: var(--border-radius-large);
	padding: 1.5em;
	margin: 0;
	box-shadow: var(--box-shadow);
	transition: var(--transition);
	position: relative;
	overflow: hidden;
	width: 100%;
	box-sizing: border-box;
}

.splash .module:hover {
	transform: translateY(-2px);
	box-shadow: var(--hover-box-shadow);
	background: var(--secondary-bg-color);
}

.splash .module h3.heading {
	color: var(--text-color);
	font-size: var(--font-size-larger);
	margin: 0 0 1em 0;
	padding-bottom: 0.5em;
	border-bottom: 2px solid var(--accent-primary);
	display: flex;
	justify-content: space-between;
	align-items: center;
	flex-wrap: wrap;
	gap: 0.5em;
}

.splash .module h3.heading .title {
	flex-grow: 1;
	color: var(--text-color);
}

.splash .module h3.heading .link a {
	color: var(--accent-primary);
	font-size: var(--font-size-base);
	font-weight: 500;
	text-decoration: none;
	border-bottom: 1px solid transparent;
	transition: var(--transition);
}

.splash .module h3.heading .link a:hover {
	color: var(--text-secondary);
	border-bottom-color: var(--accent-secondary);
}

.splash .favorite ul {
	display: flex;
	flex-wrap: wrap;
	gap: 0.5em;
	padding: 0;
	margin: 0;
	list-style: none;
}

.splash .favorite li {
	flex: 0 0 auto;
}

.splash .favorite a.tag {
	display: inline-block;
	background: var(--background-tertiary);
	color: var(--text-color);
	padding: 0.5em 1em;
	border-radius: var(--border-radius);
	text-decoration: none;
	border-bottom: none;
	font-weight: 500;
	transition: var(--transition);
	white-space: nowrap;
}

.splash .favorite a.tag:hover {
	background: var(--accent-primary);
	color: var(--text-color);
	transform: translateY(-1px);
	box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.splash .news ul.news {
	padding: 0;
	margin: 0;
	list-style: none;
}

.splash .news li.post {
	background: var(--secondary-bg-color);
	border: 1px solid var(--border-secondary);
	border-radius: var(--border-radius);
	margin-bottom: 1em;
	padding: 1em;
	transition: var(--transition);
	position: relative;
	overflow: hidden;
}

.splash .news li.post:hover {
	background: var(--background-highlight);
	transform: translateX(4px);
}

.splash .news li.post:last-child {
	margin-bottom: 0;
}

.splash .news .header.module {
	padding: 0;
	margin: 0 0 0.5em 0;
	background: transparent;
	border: none;
	box-shadow: none;
	display: block;
	grid: none;
	min-height: auto;
}

.splash .news h4.heading {
	margin: 0 0 0.5em 0;
	line-height: 1.3;
	color: var(--text-color);
	font-size: var(--font-size-large);
}

.splash .news h4.heading a {
	color: var(--accent-primary);
	text-decoration: none;
	border-bottom: none;
	transition: var(--transition);
}

.splash .news h4.heading a:hover {
	color: var(--text-secondary);
	text-decoration: underline;
}

.splash .news .meta {
	display: flex;
	flex-wrap: wrap;
	gap: 1em;
	margin: 0;
	padding: 0;
	font-size: var(--font-size-small);
	color: var(--text-tertiary);
	border-top: 1px solid var(--border-secondary);
	padding-top: 0.5em;
}

.splash .news .meta .published,
.splash .news .meta .comments {
	margin: 0;
}

.splash .news .meta a {
	color: var(--link-color);
	text-decoration: none;
	border-bottom: 1px solid transparent;
	transition: var(--transition);
}

.splash .news .meta a:hover {
	color: var(--text-secondary);
	border-bottom-color: var(--accent-secondary);
}

.splash .news blockquote.userstuff {
	background: var(--background-tertiary);
	border-left: 3px solid var(--accent-primary);
	padding: 0.75em;
	margin: 0.5em 0;
	border-radius: 0 var(--border-radius) var(--border-radius) 0;
	font-size: var(--font-size-base);
	line-height: 1.5;
	color: var(--text-secondary);
	position: relative;
}

.splash .news blockquote.userstuff p {
	margin: 0;
	font-size: var(--font-size-base) !important;
}

.splash .news .jump {
	margin: 0.5em 0 0 0;
	text-align: right;
}

.splash .news .jump a {
	color: var(--accent-primary);
	font-weight: 500;
	text-decoration: none;
	border-bottom: 1px solid transparent;
	transition: var(--transition);
	font-size: var(--font-size-small);
}

.splash .news .jump a:hover {
	color: var(--text-secondary);
	border-bottom-color: var(--accent-secondary);
}

.splash .social .note {
	color: var(--text-secondary);
	font-size: var(--font-size-base);
	line-height: 1.5;
	margin-bottom: 1em;
}

.splash .social .note a {
	color: var(--accent-primary);
	text-decoration: none;
	border-bottom: 1px solid var(--accent-secondary);
	transition: var(--transition);
}

.splash .social .note a:hover {
	color: var(--text-secondary);
	border-bottom-color: var(--accent-tertiary);
}

.splash .social ul {
	display: flex;
	flex-wrap: wrap;
	gap: 1em;
	padding: 0;
	margin: 0;
	list-style: none;
}

.splash .social li {
	flex: 0 0 auto;
}

.splash .social a {
	background: var(--background-tertiary);
	color: var(--text-color);
	text-decoration: none;
	border-bottom: none;
}

.splash .social a:hover {
	background: var(--accent-primary);
	color: var(--text-color);
	transform: translateY(-2px);
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.splash .social .resp-sharing-button__icon {
	width: 1.2em;
	height: 1.2em;
	fill: currentColor;
	flex-shrink: 0;
}

@media only screen and (max-width: 42em), handheld {
	.splash {
		grid-template-columns: 1fr;
		grid-template-areas:
			"main"
			"sidebar";
		gap: 1em;
		padding: 0.5em 0;
	}

	.splash .news {
		order: 1;
		grid-column: 1;
		grid-row: auto;
	}

	.splash .favorite {
		order: 2;
	}

	.splash .social {
		order: 3;
	}

	.splash .module {
		padding: 1em;
		margin: 0;
	}

	.splash .module h3.heading {
		font-size: var(--font-size-large);
		flex-direction: column;
		align-items: flex-start;
		gap: 0.25em;
	}

	.splash .favorite ul {
		gap: 0.25em;
	}

	.splash .favorite a.tag {
		padding: 0.4em 0.8em;
		font-size: var(--font-size-small);
	}

	.splash .news li.post {
		padding: 0.75em;
		margin-bottom: 0.75em;
	}

	.splash .news .meta {
		flex-direction: column;
		gap: 0.25em;
	}

	.splash .social ul {
		flex-direction: column;
		gap: 0.5em;
	}

	.splash .social a {
		padding: 0.6em 0.8em;
		justify-content: center;
	}
}

@media (max-width: 768px) {
	.splash {
		grid-template-columns: 1fr;
		grid-template-areas:
			"main"
			"sidebar";
		padding: 0.25em 0;
	}

	.splash .news {
		order: 1;
		grid-column: 1;
		grid-row: auto;
	}

	.splash .module {
		padding: 0.75em;
	}

	.splash .news blockquote.userstuff {
		padding: 0.5em;
		margin: 0.25em 0;
	}
}

@media (max-width: 480px) {
	.splash {
		grid-template-columns: 1fr;
		grid-template-areas:
			"main"
			"sidebar";
	}

	.splash .news {
		order: 1;
		grid-column: 1;
		grid-row: auto;
	}

	.splash .module h3.heading {
		font-size: var(--font-size-base);
		margin-bottom: 0.75em;
		padding-bottom: 0.25em;
	}

	.splash .favorite a.tag {
		padding: 0.3em 0.6em;
		font-size: 0.8rem;
	}

	.splash .news h4.heading {
		font-size: var(--font-size-base);
		line-height: 1.2;
	}

	.splash .news .meta {
		font-size: 0.8rem;
	}

	.splash .news blockquote.userstuff {
		font-size: 0.9rem;
		padding: 0.4em;
	}

	.splash .social a {
		padding: 0.5em 0.7em;
		font-size: 0.9rem;
	}
}

@media (min-width: 1200px) {
	.splash {
		max-width: 90%;
		margin: 0 auto;
		gap: 2em;
	}

	.splash .news li.post {
		padding: 1.25em;
	}
    .splash .favorite ul {
    min-height: 470px;
}
}

.splash.masonry-enabled {
	display: block;
}

.splash.masonry-enabled .module {
	width: 100%;
	margin-bottom: 1.5em;
	break-inside: avoid;
	page-break-inside: avoid;
}

@supports (display: masonry) {
	.splash {
		display: masonry;
		masonry-direction: pack;
		grid-template-rows: masonry;
	}
}

@supports not (display: masonry) {
	@media (min-width: 769px) {
		.splash-fallback {
			column-count: 2;
			column-gap: 1.5em;
			column-fill: balance;
		}

		.splash-fallback .module {
			break-inside: avoid;
			page-break-inside: avoid;
			margin-bottom: 1.5em;
			display: inline-block;
			width: 100%;
		}

		.splash-fallback .news {
			column-span: all;
		}
        .splash .favorite ul {
            min-height: 370px;
        }
	}
}

@media print {
	.splash .social {
		display: none !important;
	}

	.splash .news .jump {
		display: none !important;
	}

	.splash .module {
		background: white !important;
		border: 1px solid #ccc !important;
		box-shadow: none !important;
		break-inside: avoid;
		page-break-inside: avoid;
	}
}

@media (prefers-contrast: high) {
	.splash .module {
		border: 2px solid var(--border-primary);
	}

	.splash .news li.post {
		border: 2px solid var(--border-secondary);
	}

	.splash .favorite a.tag,
	.splash .social a {
		border: 1px solid var(--border-primary);
	}
}

@media (prefers-reduced-motion: reduce) {
	.splash .module:hover,
	.splash .news li.post:hover,
	.splash .favorite a.tag:hover,
	.splash .social a:hover {
		transform: none;
	}
}

[dir="rtl"] .splash .news blockquote.userstuff {
	border-left: none;
	border-right: 3px solid var(--accent-primary);
	border-radius: var(--border-radius) 0 0 var(--border-radius);
}

[dir="rtl"] .splash .news .jump {
	text-align: left;
}

[dir="rtl"] .splash .news li.post:hover {
	transform: translateX(-4px);
}

.splash .favorite a.tag:focus,
.splash .social a:focus,
.splash .news a:focus {
	outline: 2px solid var(--link-color);
	outline-offset: 2px;
	position: relative;
	z-index: 10;
}

@supports (container-type: inline-size) {
	.splash .module {
		container-type: inline-size;
	}

	@container (max-width: 300px) {
		.splash .module h3.heading {
			font-size: var(--font-size-base);
		}

		.splash .favorite a.tag {
			padding: 0.25em 0.5em;
			font-size: 0.8rem;
		}
	}
}

@media (prefers-color-scheme: dark) {
	.splash .module img {
		opacity: 0.9;
		transition: opacity 0.2s ease;
	}

	.splash .module img:hover {
		opacity: 1;
	}
}

.splash .module.odd {
	background: var(--primary-bg-color);
}

.splash .module.even {
	background: var(--secondary-bg-color);
}

.splash .module .group-group {
	background: transparent;
	box-shadow: none;
	padding: 0;
	margin: 0;
	border-radius: 0;
}

.splash .module * {
	word-wrap: break-word;
	overflow-wrap: break-word;
}
.logged-in .splash > .module {
  float: none;
  margin: 0;
  width: auto;
}
.splash .browse, .splash div.news {
  width: auto;
}
.note > a:nth-child(1) {
white-space: preserve-spaces;
}
div.userstuff > p > strong {
  font-size: var(--font-size-larger) !important;
  font-weight:600 !important;
  font-weight: bold !important;
}



`;

	document.head.appendChild(style);

	/**
	 * Convert date strings to relative time format (e.g., "2y 3m 1w 2d")
	 */
	function timeSince(dateStr, format = 'YYYY-MM-DD') {
		const now = new Date();
		let date;

		try {
			if (format === 'DD MMM YYYY') {
				const [d, m, y] = dateStr.split(' ');
				const monthMap = {
					Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
					Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
					January: 0, February: 1, March: 2, April: 3, May: 4, June: 5,
					July: 6, August: 7, September: 8, October: 9, November: 10, December: 11
				};

				if (monthMap[m] === undefined) return null;
				date = new Date(parseInt(y), monthMap[m], parseInt(d));
			} else {
				date = new Date(dateStr);
			}

			if (isNaN(date)) return null;

			const days = Math.floor((now - date) / 86400000);
			if (days < 0) return null;
			if (days === 0) return 'today';

			const years = Math.floor(days / 365);
			const months = Math.floor((days % 365) / 30);
			const weeks = Math.floor(((days % 365) % 30) / 7);
			const remainingDays = ((days % 365) % 30) % 7;

			const parts = [];
			if (years) parts.push(`${years}y`);
			if (months) parts.push(`${months}m`);
			if (weeks) parts.push(`${weeks}w`);
			if (remainingDays) parts.push(`${remainingDays}d`);

			return parts.length ? parts.join(' ') : null;
		} catch (error) {
			utils.warn('Error calculating time since:', error);
			return null;
		}
	}

	/**
	 * Update time displays to relative format
	 */
	function updateTimes() {
		const selectors = {
			'p.datetime': 'DD MMM YYYY',
			'dd.published': 'YYYY-MM-DD',
			'dd.status': 'YYYY-MM-DD',
			'.header-datetime': 'DD MMM YYYY'
		};

		Object.entries(selectors).forEach(([sel, fmt]) => {
			const elements = document.querySelectorAll(sel);

			elements.forEach(el => {
				const currentText = el.textContent.trim();

				// Skip if already processed
				if (currentText.match(/^\d+[ymwd](\s+\d+[ymwd])*$/) || currentText === 'today') {
					return;
				}

				const result = timeSince(currentText, fmt);
				if (result && result !== currentText) {
					el.textContent = result;
				}
			});
		});

		// Handle reading times
		const readingTimes = document.querySelectorAll('dd.AO3E.reading-time');
		readingTimes.forEach(readingTime => {
			const text = readingTime.textContent.trim();

			// Skip if already processed
			if (text.match(/^\d+[hm](\s+\d+[hm])?$/)) return;

			const hoursMinutesMatch = text.match(/(\d+)\s*hours?,?\s*(\d+)\s*mins?/);
			const minutesMatch = text.match(/(\d+)\s*mins?/);
			const hoursMatch = text.match(/(\d+)\s*hours?/);

			if (hoursMinutesMatch) {
				const [, hours, mins] = hoursMinutesMatch;
				readingTime.textContent = `${hours}h ${mins}m`;
			} else if (minutesMatch) {
				readingTime.textContent = text.replace(/(\d+)\s*mins?/, '$1m');
			} else if (hoursMatch) {
				readingTime.textContent = text.replace(/(\d+)\s*hours?/, '$1h');
			}
		});
	}

	/**
	 * Enhanced wrapping function with duplicate prevention
	 */
	function safeWrapElements(parent, selectors, className) {
		try {
			selectors.forEach(selector => {
				const elements = parent.querySelectorAll(selector);

				if (elements.length > 0) {
					const firstElement = elements[0];

					// Check if elements are already wrapped
					if (firstElement.parentNode.classList.contains(className)) {
						return;
					}

					// Create wrapper and move elements
					const wrapper = document.createElement('div');
					wrapper.className = className;
					firstElement.parentNode.insertBefore(wrapper, firstElement);

					elements.forEach(el => wrapper.appendChild(el));
				}
			});
		} catch (error) {
			utils.warn('Error wrapping elements:', error);
		}
	}

	/**
	 * Add Unicode symbols to stats elements
	 */
	function addStatSymbols() {
		const statsElements = document.querySelectorAll('dl.stats dt');

		statsElements.forEach(dt => {
			const text = dt.textContent.trim();
			const symbol = STAT_SYMBOLS[text];

			if (symbol && !dt.hasAttribute('data-symbol')) {
				dt.setAttribute('data-symbol', symbol);

				// Wrap smaller stats in spans for styling
				const smallStats = [
					'Published:', 'Completed:', 'Kudos/Hits:', 'Hits:', 'Words:',
					'Language:', 'Chapters:', 'Reading time:', 'Comments:',
					'Kudos:', 'Bookmarks:', 'Collections:'
				];

				if (smallStats.includes(text) && !dt.querySelector('span')) {
					dt.innerHTML = `<span>${text}</span>`;
				}
			}
		});
	}

	/**
	 * Initialize theme with improved element handling
	 */
	function initializeTheme() {
		utils.log('Initializing theme...');

		// Add Unicode symbols first
		addStatSymbols();

		// Process stats lists
		const statsList = document.querySelectorAll('dl.stats');
		statsList.forEach(dl => {
			const wrappers = [
				['.status', 'status-group'],
				['.published', 'published-group'],
				['.language', 'language-group'],
				['.words', 'words-group'],
				['.chapters', 'chapters-group'],
				['.comments', 'comments-group'],
				['.kudos', 'kudos-group'],
				['.bookmarks', 'bookmarks-group'],
				['.progress', 'progress-group'],
				['.hits', 'hits-group'],
				['.collections', 'collections-group']
			];

			wrappers.forEach(([selector, className]) => {
				safeWrapElements(dl, [selector], className);
			});
		});

		// Process work items
		const workItems = document.querySelectorAll('#main li.blurb');
		workItems.forEach(work => {
			// Skip if already processed
			if (work.getAttribute('data-theme-processed')) return;
			work.setAttribute('data-theme-processed', 'true');

			const tagsList = work.querySelector('ul.tags');
			if (tagsList) {
				// Wrap tag groups
				safeWrapElements(tagsList, ['li.warnings', 'li.freeforms'], 'category-group');
				safeWrapElements(tagsList, ['li.relationships'], 'relationships-group');
				safeWrapElements(tagsList, ['li.characters'], 'characters-group');
			}

			// Group all content together
			const allContentToGroup = work.querySelectorAll(
				'ul.tags .category-group, ul.tags .relationships-group, ul.tags .characters-group, blockquote.userstuff'
			);

			if (allContentToGroup.length > 0) {
				const firstElement = allContentToGroup[0];
				const groupWrapper = document.createElement('div');
				groupWrapper.className = 'group-group';
				firstElement.parentNode.insertBefore(groupWrapper, firstElement);

				allContentToGroup.forEach(el => groupWrapper.appendChild(el));
			}
		});

		// Add accessibility skip link
		if (!document.querySelector('.skip-link')) {
			const skipLink = document.createElement('a');
			skipLink.href = '#main';
			skipLink.className = 'skip-link';
			skipLink.textContent = 'Skip to main content';
			document.body.insertBefore(skipLink, document.body.firstChild);
		}

		utils.log('Theme initialization complete');
	}

	/**
	 * Header redesign functionality
	 */
	function redesignHeaders() {

		const headerStyles = `
      /* Redesigned header styles */
      .header-redesigned {
        background: linear-gradient(135deg, var(--primary-bg-color) 0%, var(--secondary-bg-color) 100%);
        border-radius: var(--border-radius-large);
        padding: 20px;
        margin-bottom: 16px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        position: relative;
        overflow: hidden;
        border: 1px solid var(--border-primary);
        transition: all 0.3s ease;
      }

      .header-redesigned::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(90deg, var(--ao3-red-dark), var(--ao3-red-light), var(--ao3-red-dark));
        opacity: 0.8;
      }

      .header-redesigned:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 30px rgba(0, 0, 0, 0.4);
        background: linear-gradient(135deg, var(--secondary-bg-color) 0%, var(--tertiary-bg-color) 100%);
      }

      .header-top-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        gap: 20px;
      }

      .header-main-content {
        flex: 1;
        min-width: 0;
      }

      .header-title {
        font-size: 100%;
        font-weight: 600;
        margin: 0 0 8px 0;
        line-height: 1.3;
      }

      .header-title a {
        color: var(--link-color);
        text-decoration: none;
        border-bottom: 2px solid transparent;
        transition: all 0.2s ease;
        display: inline-block;
      }

      .header-title a:hover {
        color: var(--text-secondary);
        border-bottom-color: var(--accent-primary);
        transform: translateX(2px);
      }

      .header-authors {
        font-size: 0.95em;
        color: var(--text-secondary);
        margin-bottom: 8px;
      }

      .header-authors a {
        color: var(--accent-primary);
        text-decoration: none;
        border-bottom: 1px solid transparent;
        transition: all 0.2s ease;
        font-weight: 500;
      }

      .header-authors a:hover {
        color: var(--text-secondary);
        border-bottom-color: var(--accent-secondary);
      }

      .header-metadata {
        display: flex;
        align-items: center;
        gap: 20px;
        flex-wrap: wrap;
      }

      .header-tags-grid {
        display: grid;
        grid-template-columns: repeat(2, 24px);
        grid-template-rows: repeat(2, 24px);
        gap: 6px;
        flex-shrink: 0;
      }

      .header-tag-icon {
        width: 25px;
        height: 25px;
        transition: all 0.2s ease;
        cursor: pointer;
        position: relative;
        overflow: visible;
        background-image: url("/images/imageset.png");
        background-repeat: no-repeat;
        border-radius: 4px;
      }

      .header-tag-icon:hover {
        transform: scale(1.2);
        filter: brightness(1.2);
        z-index: 10;
      }

      /* Icon sprite positions */
      .header-tag-icon.rating-general-audience { background-position: -50px -25px; }
      .header-tag-icon.rating-explicit { background-position: -25px -25px; }
      .header-tag-icon.rating-mature { background-position: -75px -25px; }
      .header-tag-icon.rating-notrated { background-position: -150px 0px; }
      .header-tag-icon.rating-teen { background-position: 0px -25px; }
      .header-tag-icon.category-femslash { background-position: -25px 0px; }
      .header-tag-icon.category-gen { background-position: -50px 0px; }
      .header-tag-icon.category-slash { background-position: 0px 0px; }
      .header-tag-icon.category-het { background-position: -75px 0px; }
      .header-tag-icon.category-multi { background-position: -100px 0px; }
      .header-tag-icon.category-other { background-position: -125px 0px; }
      .header-tag-icon.category-none { background-position: -150px 0px; }
      .header-tag-icon.complete-no { background-position: -100px -25px; }
      .header-tag-icon.complete-yes { background-position: -175px -25px; }
      .header-tag-icon.warning-yes { background-position: -150px -25px; }
      .header-tag-icon.warning-no { background-position: -150px 0px; }
      .header-tag-icon.warning-choosenotto { background-position: -125px -25px; }
      .header-tag-icon.external-work { background-position: -75px -50px; }

      .header-datetime {
        background: var(--tertiary-bg-color);
        color: var(--text-tertiary);
        padding: 6px 12px;
        border-radius: 20px;
        font-size: 0.85em;
        font-weight: 500;
        white-space: nowrap;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s ease;
      }

      .header-datetime:hover {
        background: var(--quaternary-bg-color);
        color: var(--text-secondary);
        transform: scale(1.05);
      }

      .header-datetime::before {
        content: "🕐";
        font-size: 1.1em;
      }

      .header-fandoms {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        align-items: center;
        font-size: 0.9em;
      }

      .header-fandoms-label {
        color: var(--text-tertiary);
        font-weight: 500;
        margin-right: 4px;
      }

      .header-fandom-tag {
        background: var(--tertiary-bg-color);
        color: var(--text-color);
        padding: 4px 12px;
        border-radius: 16px;
        text-decoration: none;
        transition: all 0.2s ease;
        border: 1px solid var(--border-primary);
        font-weight: 500;
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }

      .header-fandom-tag:hover {
        background: var(--accent-primary);
        color: white;
        border-color: var(--accent-primary);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }

      .header-fandom-tag::before {
        content: "📚";
        font-size: 0.9em;
      }

      .bookmark p.status {
        position: absolute;
        right: 7.5%;
        width: 60px;
        margin-top: 5em;
        z-index: 1;
      }

      .header-tooltip {
        position: fixed;
        background: var(--tertiary-bg-color);
        color: var(--text-color);
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.85em;
        white-space: nowrap;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
        z-index: 10000;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        border: 1px solid var(--border-primary);
      }
      #main > ul > li > div.header-redesigned > div > div.header-main-content > h4 {
      margin-left:65px
      }

      .header-tooltip.show {
        opacity: 1;
      }

      /* Responsive adjustments */
      @media (max-width: 768px) {
        .header-redesigned {
          padding: 16px;
        }

        .header-top-row {
          flex-direction: column;
          gap: 12px;
        }

        .header-metadata {
          width: 100%;
          justify-content: space-between;
        }

        .header-title {
          font-size: 1.2em;
        }

        .header-fandoms {
          margin-top: 8px;
        }
      }
    `;

		// Add styles if not already added
		if (!document.querySelector('#header-redesign-styles')) {
			const styleElement = document.createElement('style');
			styleElement.id = 'header-redesign-styles';
			styleElement.innerHTML = headerStyles;
			document.head.appendChild(styleElement);
		}

		/**
		 * Get icon class and tooltip for required tags
		 */
		function getTagInfo(element) {
			const span = element.querySelector('span[class*="rating-"], span[class*="warning-"], span[class*="category-"], span[class*="complete-"], span[class*="external-"]');
			if (!span) return null;

			const classes = span.className.split(' ');
			let iconClass = '';
			const tooltip = span.title || 'Unknown';

			// Find the specific class for the icon
			for (const cls of classes) {
				if (cls.match(/^(rating-|warning-|category-|complete-|external-)/)) {
					iconClass = cls;
					break;
				}
			}

			return { iconClass, tooltip };
		}

		// Create tooltip element if it doesn't exist
		let tooltip = document.querySelector('.header-tooltip');
		if (!tooltip) {
			tooltip = document.createElement('div');
			tooltip.className = 'header-tooltip';
			document.body.appendChild(tooltip);
		}

		const collectionHeader = document.querySelector('#collection-page > .primary.header.module:not(.redesigned-processed)');
		if (collectionHeader) {
			collectionHeader.classList.add('redesigned-processed');

			const redesigned = document.createElement('div');
			redesigned.className = 'header-redesigned';

			const topRow = document.createElement('div');
			topRow.className = 'header-top-row';

			// Icon
			const iconDiv = collectionHeader.querySelector('.icon');
			if (iconDiv) topRow.appendChild(iconDiv.cloneNode(true));

			const mainContent = document.createElement('div');
			mainContent.className = 'header-main-content';

			// Title
			const titleElement = collectionHeader.querySelector('h2.heading');
			if (titleElement) {
				const title = document.createElement('h2');
				title.className = 'header-title';
				title.textContent = titleElement.textContent;
				mainContent.appendChild(title);
			}

			// Description
			const descElement = collectionHeader.querySelector('blockquote.userstuff');
			if (descElement) mainContent.appendChild(descElement.cloneNode(true));

			// Subnav
			const nav = collectionHeader.querySelector('ul.navigation.actions');
			if (nav) mainContent.appendChild(nav.cloneNode(true));

			topRow.appendChild(mainContent);
			redesigned.appendChild(topRow);

			collectionHeader.style.display = 'none';
			collectionHeader.parentNode.insertBefore(redesigned, collectionHeader.nextSibling);
		}

		// ----------------------------
		// Handle user home header
		// ----------------------------
		const userHomeHeader = document.querySelector('#main > div.user.home > .primary.header.module:not(.redesigned-processed)');
		if (userHomeHeader) {
			userHomeHeader.classList.add('redesigned-processed');

			const redesigned = document.createElement('div');
			redesigned.className = 'header-redesigned';

			const topRow = document.createElement('div');
			topRow.className = 'header-top-row';

			const mainContent = document.createElement('div');
			mainContent.className = 'header-main-content';

			// Title (username)
			const titleElement = userHomeHeader.querySelector('h2.heading');
			if (titleElement) {
				const title = document.createElement('h2');
				title.className = 'header-title';
				title.textContent = titleElement.textContent.trim();
				mainContent.appendChild(title);
			}

			topRow.appendChild(mainContent);

			// Icon
			const iconDiv = userHomeHeader.querySelector('p.icon');
			if (iconDiv) topRow.appendChild(iconDiv.cloneNode(true));

			redesigned.appendChild(topRow);

			// Subnav (links + forms)
			const nav = userHomeHeader.querySelector('ul.navigation.actions');
			if (nav) redesigned.appendChild(nav.cloneNode(true));

			userHomeHeader.style.display = 'none';
			userHomeHeader.parentNode.insertBefore(redesigned, userHomeHeader.nextSibling);
		}


		const profileCollectionHeader = document.querySelector('#main > div.collection.home.profile > .primary.header.module:not(.redesigned-processed)');
		if (profileCollectionHeader) {
			profileCollectionHeader.classList.add('redesigned-processed');

			const redesigned = document.createElement('div');
			redesigned.className = 'header-redesigned';

			const topRow = document.createElement('div');
			topRow.className = 'header-top-row';

			// Icon
			const iconDiv = profileCollectionHeader.querySelector('.icon');
			if (iconDiv) topRow.appendChild(iconDiv.cloneNode(true));

			const mainContent = document.createElement('div');
			mainContent.className = 'header-main-content';

			// Title
			const titleElement = profileCollectionHeader.querySelector('h2.heading a');
			if (titleElement) {
				const title = document.createElement('h2');
				title.className = 'header-title';
				const link = titleElement.cloneNode(true);
				title.appendChild(link);
				mainContent.appendChild(title);
			}

			// Description
			const descElement = profileCollectionHeader.querySelector('blockquote.userstuff');
			if (descElement) mainContent.appendChild(descElement.cloneNode(true));

			// Subnav
			const nav = profileCollectionHeader.querySelector('ul.navigation.actions');
			if (nav) mainContent.appendChild(nav.cloneNode(true));

			topRow.appendChild(mainContent);
			redesigned.appendChild(topRow);

			profileCollectionHeader.style.display = 'none';
			profileCollectionHeader.parentNode.insertBefore(redesigned, profileCollectionHeader.nextSibling);
		}

		document.querySelectorAll('#main > ul > li > .header.module:not(.redesigned-processed)').forEach(header => {
			header.classList.add('redesigned-processed');

			const redesigned = document.createElement('div');
			redesigned.className = 'header-redesigned';

			const topRow = document.createElement('div');
			topRow.className = 'header-top-row';

			const mainContent = document.createElement('div');
			mainContent.className = 'header-main-content';

			const titleElement = header.querySelector('h4.heading a');
			if (titleElement) {
				const title = document.createElement('h4');
				title.className = 'header-title';
				title.appendChild(titleElement.cloneNode(true));
				mainContent.appendChild(title);
			}

			const secondaryElement = header.querySelector('h5.heading a');
			if (secondaryElement) {
				const secondary = document.createElement('div');
				secondary.className = 'header-authors';
				secondary.appendChild(secondaryElement.cloneNode(true));
				mainContent.appendChild(secondary);
			}

			topRow.appendChild(mainContent);

			const iconDiv = header.querySelector('.icon');
			if (iconDiv) topRow.appendChild(iconDiv.cloneNode(true));

			redesigned.appendChild(topRow);

			header.style.display = 'none';
			header.parentNode.insertBefore(redesigned, header.nextSibling);
		});

		// Process each header module
		document.querySelectorAll('.header.module:not(.redesigned-processed)').forEach(header => {
			// Mark as processed
			header.classList.add('redesigned-processed');

			// Create new structure
			const redesigned = document.createElement('div');
			redesigned.className = 'header-redesigned';

			// Extract data
			const titleElement = header.querySelector('h4.heading a');
			const authorElements = header.querySelectorAll('h4.heading a[rel="author"]');
			const giftElements = header.querySelectorAll('h4.heading a[href*="/gifts"]');
			const fandomElements = header.querySelectorAll('h5.fandoms a.tag');
			const requiredTags = header.querySelectorAll('ul.required-tags li');
			const datetime = header.querySelector('p.datetime');

			// Build new structure
			const topRow = document.createElement('div');
			topRow.className = 'header-top-row';

			// Main content section
			const mainContent = document.createElement('div');
			mainContent.className = 'header-main-content';

			// Title
			const title = document.createElement('h4');
			title.className = 'header-title';
			if (titleElement) {
				const titleLink = titleElement.cloneNode(true);
				title.appendChild(titleLink);
			}
			mainContent.appendChild(title);

			// Authors and gifts
			const authors = document.createElement('div');
			authors.className = 'header-authors';
			authors.innerHTML = 'by ';

			authorElements.forEach((author, index) => {
				if (index > 0) authors.innerHTML += ', ';
				authors.appendChild(author.cloneNode(true));
			});

			if (giftElements.length > 0) {
				authors.innerHTML += ' for ';
				giftElements.forEach((gift, index) => {
					if (index > 0) authors.innerHTML += ', ';
					authors.appendChild(gift.cloneNode(true));
				});
			}

			mainContent.appendChild(authors);

			// Fandoms
			if (fandomElements.length > 0) {
				const fandoms = document.createElement('div');
				fandoms.className = 'header-fandoms';

				const label = document.createElement('span');
				label.className = 'header-fandoms-label';
				label.textContent = 'Fandoms:';
				fandoms.appendChild(label);

				fandomElements.forEach(fandom => {
					const fandomTag = document.createElement('a');
					fandomTag.className = 'header-fandom-tag';
					fandomTag.href = fandom.href;
					fandomTag.textContent = fandom.textContent;
					fandoms.appendChild(fandomTag);
				});

				mainContent.appendChild(fandoms);
			}

			topRow.appendChild(mainContent);

			// Metadata section
			const metadata = document.createElement('div');
			metadata.className = 'header-metadata';

			// Required tags grid
			const tagsGrid = document.createElement('div');
			tagsGrid.className = 'header-tags-grid';

			requiredTags.forEach(tag => {
				const tagInfo = getTagInfo(tag);
				if (!tagInfo) return;

				const tagIcon = document.createElement('div');
				tagIcon.className = `header-tag-icon ${tagInfo.iconClass}`;
				tagIcon.dataset.tooltip = tagInfo.tooltip;

				// Add hover effects for tooltip
				tagIcon.addEventListener('mouseenter', (e) => {
					tooltip.textContent = e.target.dataset.tooltip;
					tooltip.classList.add('show');

					const rect = e.target.getBoundingClientRect();
					tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
					tooltip.style.top = rect.bottom + 5 + 'px';
				});

				tagIcon.addEventListener('mouseleave', () => {
					tooltip.classList.remove('show');
				});

				tagsGrid.appendChild(tagIcon);
			});

			metadata.appendChild(tagsGrid);

			// DateTime
			if (datetime) {
				const dt = document.createElement('div');
				dt.className = 'header-datetime';
				dt.textContent = datetime.textContent;
				metadata.appendChild(dt);
			}

			topRow.appendChild(metadata);
			redesigned.appendChild(topRow);

			// Replace original header
			header.style.display = 'none';
			header.parentNode.insertBefore(redesigned, header.nextSibling);
		});
	}

	// Debounced functions for better performance
	const debouncedInitTheme = utils.debounce(initializeTheme, CONFIG.TIMEOUTS.OBSERVER);
	const debouncedRedesignHeaders = utils.debounce(redesignHeaders, CONFIG.TIMEOUTS.OBSERVER);
	const debouncedUpdateTimes = utils.debounce(updateTimes, CONFIG.TIMEOUTS.OBSERVER);

	// Initialize functions
	function init() {
		setTimeout(() => {
			updateTimes();
			initializeTheme();
			redesignHeaders();
		}, CONFIG.TIMEOUTS.INIT);
	}

	// Setup event listeners
	if (document.readyState === 'loading') {
		document.addEventListener('DOMContentLoaded', init);
	} else {
		init();
	}

	window.addEventListener('load', init);

	// Mutation observer for dynamic content
	const observer = new MutationObserver((mutations) => {
		let shouldReinit = false;
		let shouldRedesignHeaders = false;

		mutations.forEach((mutation) => {
			if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === 1) {
						// Check for work items or stats
						if (node.matches('li.blurb:not([data-theme-processed])') ||
							node.querySelector('li.blurb:not([data-theme-processed])') ||
							node.matches('dl.stats') ||
							node.querySelector('dl.stats')) {
							shouldReinit = true;
						}

						// Check for headers
						if (node.matches('.header.module:not(.redesigned-processed)') ||
							node.querySelector('.header.module:not(.redesigned-processed)')) {
							shouldRedesignHeaders = true;
						}
					}
				});
			}
		});

		if (shouldReinit) {
			debouncedInitTheme();
			debouncedUpdateTimes();
		}

		if (shouldRedesignHeaders) {
			debouncedRedesignHeaders();
		}
	});

	// Start observing
	observer.observe(document.body, {
		childList: true,
		subtree: true
	});

	utils.log('AO3 Dark Mode userscript loaded successfully');

})();