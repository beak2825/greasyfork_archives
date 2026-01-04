// ==UserScript==
// @name        Genshin.gg Accessibility
// @namespace   https://1drv.ms/t/s!Aro8fH4-piSHdGjesm7fAio2cEU
// @description Attempts to make Genshin.gg more accessible for people with astigmatism because ableism isn't acceptable.
// @include     http://genshin.gg*
// @include     https://genshin.gg*
// @include     http://*.genshin.gg*
// @include     https://*.genshin.gg*
// @grant       GM_addStyle
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/452937/Genshingg%20Accessibility.user.js
// @updateURL https://update.greasyfork.org/scripts/452937/Genshingg%20Accessibility.meta.js
// ==/UserScript==
GM_addStyle(`
	.App.genshin {
		background-image: none !important;
	}

/* Nav bar */
	.nav {
		background: #fff!important;
	}
	.nav .nav-links .nav-item .nav-link {
		color: #000!important;
	}
	.nav .nav-links .nav-item .nav-link.active {
		color: #000;
		background: #f0f0f0!important;
	}
	.dropdown .dropdown-menu {
		background: #fff!important;
	}
	.nav-games.dropdown .dropdown-toggle {
		color: #000!important;
		background: #fff!important;
	}
	.nav-games.dropdown .dropdown-menu .dropdown-item {
		background: #fff!important;
		color: #000!important;
	}
	.nav .nav-brand .brand {
		color: #000!important;
	}
	.arrow {
		border: solid #000;
		border-width: 0 2px 2px 0;
	}

/* Main parts of pages */
	body {
		color: #000!important;
		background-color: #fff!important;
	}
	.wrapper-lb1 {
		background: #fff;
	}
	.content {
		background: #f0f0f0!important;
	}
	h1, h2, h3, h5, p {
		color: #000!important;
	}
	a {
		color: #006255!important;
	}
	.footer {
		background: #fff!important;
	}
	.footer .footer-meta .footer-logo {
		color: #000!important;
	}
	.footer .footer-link-list .footer-link-item .footer-link {
		color: #000!important;
	}

/* Search bar */
	.search {
		background: #d0d0d0!important;
	}
	.search .search-input::-webkit-input-placeholder {
		color:#000!important;
	}
	.search .search-input::placeholder {
		color:#000!important;
	}
	.search.focused {
		background:#fff!important;
	}

/* Filters */
	.filters {
		background: #d0d0d0!important;
	}

	.filters .filters-list .filters-item.active {
		background: #bdbdbd!important;
	}
	.rc-tooltip .rc-tooltip-inner {
		color:#000!important;
		background:#fff!important;
	}
	.filters-tooltip {
		background:#fff!important;
	}

/* Images */
	.character-list .character-portrait .character-icon {
		background: #d7d7d7!important;
	}
	.character-list .character-portrait .character-type, .character-list .character-portrait .character-weapon {
		background: #bbb!important;
	}
	.tier .tier-list .character-portrait .character-icon {
		background: #d7d7d7!important;
	}
	.tier .tier-list .character-portrait .character-type, .tier .tier-list .character-portrait .character-weapon {
		background: #bbb!important;
	}
	.table .character-portrait, .table.ReactTable .character-portrait {
		background: #d7d7d7!important;
	}
	.table .character-portrait .character-weapon, .table.ReactTable .character-portrait .character-weapon {
		background: #bbb!important;
	}
	.table .character-portrait .character-type, .table.ReactTable .character-portrait .character-type {
		background: #bbb!important;
	}
	.character .character-header .character-meta {
		background: #d7d7d7!important;
	}
	.character .character-header .character-meta .character-type, .character .character-header .character-meta .character-weapon {
		background: #bbb!important;
	}
	.table.ReactTable .table-image, .table .table-image {
		background: #d7d7d7!important;
	}
	.table.ReactTable .table-image-wrapper .table-image-count, .table .table-image-wrapper .table-image-count {
		background: #d2d2d2!important;
	}

/* Tier list */
	.tier {
		background: #bbb!important;
	}
	.tier .tier-list-teams .teams-item {
		background: #f0f0f0!important;
	}
	.tier-description {
		background: #d0d0d0!important;
		color: #000!important;
	}

/* Tables */
	.table.ReactTable .table-bonus, .table .table-bonus {
		color: #000!important;
	}
	.table.ReactTable .rt-tbody .rt-td, .table .rt-tbody .rt-td {
		color: #000!important;
	}
	.table.ReactTable .table-bonus b, .table .table-bonus b {
		color: #0b8483!important;
	}
	.content .content-list li {
		color: #000!important;
	}
	.table.ReactTable .table-plus, .table .table-plus {
		color: #000!important;
	}
	.table.ReactTable .rt-thead, .table .rt-thead {
		color: #000!important;
		background: #ccc!important;
	}
	.table.ReactTable .rt-tbody, .table .rt-tbody {
		color: #000!important;
		background: #f0f0f0!important;
	}
	.table.ReactTable .rt-tbody .rt-td:first-child, .table .rt-tbody .rt-td:first-child {
		color: #000!important;
	}

/* Character pages*/
	.geo {
		color: #755a07!important;
	}
	.cryo {
		color: #00a1bb!important;
	}
	.pyro {
		color: #f20000!important;
	}
	.hydro {
		color: #0060bf!important;
	}
	.electro {
		color: #a400a4!important;
	}
	.anemo {
		color: #00845a!important;
	}
  /* Future-proofing? */
	.dendro {
		color: #37820F!important;
	}
	.character {
		background: #fff!important;
	}
	.character .character-header::after {
		background: rgba(255, 255, 255, 0.8);
	}
	.character .character-nav {
		background: #fff!important;
	}
	.character .character-nav .character-nav-item {
		color: #000!important;
	}
	.character .character-nav .character-nav-item:hover {
		color: #000!important;
		background: #fff!important;
	}
	.character .character-build .build-list .build-item {
		background: #f0f0f0!important;
	}
	.character .character-build .build-list .build-item .build-name {
		color: #9f5a00!important;
	}
	.character .character-build .build-list .build-item .build-er {
		color: #000!important;
		background: #e8e8e8!important;
	}
	.character .character-build .build-list .build-item .build-er span {
		color: #000!important;
	}
	.character .character-build .build-list .build-item .build-title {
		color: #9f5a00!important;
	}
	.character .character-build .build-list .build-item .build-subtitle {
		color: #000!important;
	}
	.character .character-build .build-list .build-item .build-weapon {
		background: #ececec!important;
	}
	.character .character-build .build-list .build-item .build-weapon .build-weapon-name {
		color: #9f5a00!important;
	}
	.character .character-build .build-list .build-item .build-weapon .build-weapon-bonus b {
		color: #0b8483!important;
	}
	.character .character-build .build-list .build-item .build-weapon .build-weapon-icon {
		background: #d7d7d7!important;
	}
	.character .character-build .build-list .build-item .build-artifact-list .build-artifact {
		background: #ececec!important;
	}
	.character .character-build .build-list .build-item .build-artifact-list .build-artifact .build-artifact-name {
		color: #0f6800!important;
	}
	.character .character-build .build-list .build-item .build-artifact-list .build-artifact .build-artifact-meta .build-artifact-icon {
		background: #d7d7d7!important;
	}
	.character .character-teams .teams-list .teams-item {
		background: #f0f0f0!important;
	}
	.character .character-talents .character-skills .character-skills-list .character-skills-item {
		background: #f0f0f0!important;
	}
	.character .character-talents .character-skills .character-skills-list .character-skills-item .skills-description ul li {
		color: #000!important;
	}
	.character .character-talents .character-passives .passives-list .passives-list-item {
		background: #f0f0f0!important;
	}
	.character .character-talents .character-passives .passives-list .passives-list-item .passives-meta .passives-name {
		color: #9f5a00!important;
	}
	.character .character-talents .character-skills .character-skills-list .character-skills-item .skills-meta .skills-name {
		color: #9f5a00!important;
	}
	.character .character-constellations .constellations-list .constellations-list-item {
		background: #f0f0f0!important;
	}
	.character .character-constellations .constellations-list .constellations-list-item .constellations-meta .constellations-name {
		color: #9f5a00!important;
	}
	.character .character-teams .teams-list .teams-item .character-list .character-portrait .character-icon {
		background: #d7d7d7!important;
	}
	.character .character-showcase .showcase-wrapper {
		background: #f0f0f0!important;
	}
`);