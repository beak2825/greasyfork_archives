//
// Written by Glenn Wiking
// Script Version: 1.0.2a
// Date of issue: 08/29/17
// Date of resolution: 08/29/17
//
// ==UserScript==
// @name        ShadeRoot DuoLingo
// @namespace   SRDL
// @description Eye-friendly magic in your browser for DuoLingo
// @version     0.0.1a
// @icon        https://i.imgur.com/S5ZDUG8.png

// @include     http://*duolingo.*
// @include     https://*duolingo.*
// @downloadURL https://update.greasyfork.org/scripts/32941/ShadeRoot%20DuoLingo.user.js
// @updateURL https://update.greasyfork.org/scripts/32941/ShadeRoot%20DuoLingo.meta.js
// ==/UserScript==

function ShadeRootDL(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootDL(
	// TOP BAR BG
	'._6t5Uh {background: rgba(8, 99, 158, 0.8) linear-gradient(180deg,#125886,rgba(13, 77, 125, 0.5)) repeat-x !important; background-color: rgba(15, 113, 222, 0.8) !important;}'
	+
	// DIV BG 1
	'body {background: #07131d !important;}'
	+
	// DIV BG 2
	'._1E3L7, .a5SW0, main:not(.full-width) .page-main, .modal, ._3gvMn, ._3giip {background: #092b5f !important;}'
	+
	// MESSAGE BG COLOR 1
	'.a5SW0,._2wVgY, .box-gray {background: #135d9e !important; border: 2px solid #0c4b9c !important;}'
	+
	// TEXT COLOR SHARP
	'.af3kQ, body, h1, ._1ZY-H, ._3sWvR, ._1V9bF:hover, .contributor-footer {color: #c8e8f3 !important;}'
	+
	// TEXT COLOR DULL
	'.W1dac, h2, h3, h4, h5, h6, p, ._1lig4._28JSG, ._1lig4:disabled, .yXIVb, ._2F1Pi, ._1V9bF, .text, .dropdown-toggle, .user-flair, ._2Hv7w {color: #c2d9de !important;}'
	+
	// DARK TEXT 1
	'.icon, .icon-comment-medium {color: #0c2436 !important;}'
	+
	// LINK COLOR 1
	'._2wJ6n, ._3gRs1, ._2gvA1, .nav-sidebar a, a:hover {color: #6ca4d5 !important;}'
	+
	'._1XnsG {border-color: #1b6aa4 !important;}'
	+
	'.ewiWc, svg > circle, ._3dn5K {filter: brightness(0.9);}'
	+
	'._1lig4._28JSG, ._1lig4:disabled {background: #22607d !important;}'
	+
	'circle {stroke: #153c54; opacity: .9 !important;}'
	+
	'.bBDRc {background: #162e3f;}'
	+
	'main {background: #0a2c4d !important;}'
	+
	// BORDERS
	'._2G3uv, .qsrrc, hr, .list-discussion-item, .nav-sidebar > li.divider, ._3arKS, ._26XGQ, .discussion-comments-list-item {border-top: 2px solid #16598a !important;}'
	+
	'._39swy, .nav-tabs, ._1Vm1k, .discussion-header {border-bottom: 2px solid #16598a !important;}'
	+
	'img, ._3dn5K {opacity: .9 !important;}'
	+
	'.cQcsw {color: #eaa326 !important;}'
	+
	// IMAGES
	'._10a4d, .icon-comment-medium::after {opacity: .85 !important;}'
	+
	// BUTTON LARGE
	'._386Rr {background: #19588d !important; border-color: #1878bf !important; color: #c4e3f5 !important;}'
	+
	'._26YU4:hover {background: #155375;}'
	+
	'._2kA5V {background: #091939 !important;}'
	+
	// BUTTON SMALL
	'._2cWmF {background: #0f59b9 !important; color: #cae6f2 !important;}'
	+
	'._2HujR::after {border-bottom: 10px solid #246ca1 !important;}'
	+
	'._1ZY-H {background: #246ca1 !important;}'
	+
	'._1oVFS {background: #185283 !important;}'
	+
	'._1qBnH {color: #b3d9e9 !important;}'
	+
	'input, select, textarea, option, ._3LmPy {background: #0e4880 !important; border: 2px solid #1363a7 !important; color: #c0d9e7 !important;}'
	+
	'._2F1Pi {background-color: #072047 !important;}'
	+
	'._3UItj {background-color: #5d120e !important;}'
	+
	'._109_u {background-color: #0b5e86 !important;}'
	+
	'.sticky-discussion-message {background: #eda63d !important; color: #11274a !important;}'
	+
	'.vote-count {background: #1a64b7 !important; color: #dcebf3 !important;}'
	+
	'.nav-sidebar > li:hover, button {background: #103e6b !important;}'
	+
	'.btn-outline.btn-standard:hover {background: rgb(12, 89, 164) !important; color: #badcf2 !important;}'
	+
	'._2wJ6n, ._3gRs1, ._2gvA1, .nav-sidebar a, a:hover {color: #cedeed !important;}'
	+
	'.discussion-search-results > li {border-top: 2px solid #154777 !important;}'
	+
	'._3hV-_, ._1fjHu {filter: brightness(0.6) !important;}'
	+
	'._3hV-_ {background: #a41c1c !important;}'
	+
	'.category h2, .section h3, .side-column h3 {border-bottom: 1px solid #1d4e78 !important;}'
	+
	'.manifesto-1 {background: #0f3453 !important;}'
	+
	'.manifesto-2 {background: #156084 !important;}'
	+
	'.manifesto-3 {background: -moz-linear-gradient(top, #8f6213, #7d4c16) !important;}'
	+
	'#team.about-pages .pie-chart, #team.about-pages .diversity, .devices, #jobs.about-pages, .research-list td, .wrapper, .footer-wrapper {background: #11242c !important;}'
	+
	'.map {background: #125c80 !important;}'
	+
	'.department-container, .research, #research.about-pages {background: #102d45 !important;}'
	+
	'#jobs.about-pages .department-container .dept-flag::after {border-right: 10px solid #102d45 !important;}'
	+
	'.benefits-list li {background: #0f3c54 !important;}'
	+
	'.about-pages .founders, .about-pages .investors, .about-pages .press-release, .about-pages section {background: #183447 !important;}'
	+
	'.course-card-footer {background: #0c3e68 !important;}'
	+
	'.grey-select {border: 2px solid #0d2d51 !important;}'
	+
	'.course-page.dn .contributor-footer, .course-card.dn .contributor-footer, .course-page.el .contributor-footer, .course-card.el .contributor-footer, .course-page.en .contributor-footer, .course-card.en .contributor-footer, .course-page.he .contributor-footer, .course-card.he .contributor-footer, .course-page.ja .contributor-footer, .course-card.ja .contributor-footer, .course-page.ko .contributor-footer, .course-card.ko .contributor-footer, .course-page.nb .contributor-footer, .course-card.nb .contributor-footer, .course-page.ru .contributor-footer, .course-card.ru .contributor-footer, .course-page.sv .contributor-footer, .course-card.sv .contributor-footer, .course-page.hv .contributor-footer, .course-card.hv .contributor-footer {background: #0f5183 !important;}'
	+
	'.btn-banner {color: #2498ce !important; background-color: #0d2f4d !important; border-color: #1b63a1 !important;}'
	+
	'.course-card {background-color: #0c477a !important;}'
	+
	'.course-card .title {border-bottom: 1px solid #2f7dc0 !important;}'
	+
	'.phase-header {border-top: 1px solid #1d5995 !important;}'
	+
	'.nav > li > a:hover, .nav > li > a:focus {background-color: #1f5380 !important;}'
	+
	'.from-flag {border: 5px solid #124f83 !important;}'
	+
	'._1E3L7, .a5SW0, main:not(.full-width) .page-main, .modal, ._3gvMn, ._3giip {background: #172c44 !important;}'
	+
	'._3GXmV {background: #0f233b !important;}'
	+
	'._29dsy {opacity: .9 !important; filter: brightness(.8) !important;}'
	+
	'.MAF30 {background: #1c6390 !important; border: 2px solid #2267b6 !important;}'
	+
	'._3ZnFT {border: 2px solid #1b65b9 !important;}'
	+
	'._2RjpG {background: #1a649b !important;}'
	+
	'._1SfYc {background: #10375d !important;}'
	+
	'._1XnsG:hover:not([disabled]) {color: #abc7db !important;}'
	+
	'.vvZSt:focus {box-shadow: 0 0 20px #061424 !important;}'
	+
	'.svQU_, .svQU_ ._1l6NK {background: #360f09 !important; color: #9f2511 !important;}'
	+
	'._2KMvD {background: #369dde !important;}'
	+
	'._3uFh7, ._3uFh7 ._1l6NK {background: #214113 !important; color: #419921 !important;}'
	+
	'._2Hv7w {background: #2389c9 !important;}'
	+
	'circle:last-child {fill: #0e3459 !important;}'
	+
	'._14PRs {border: 6px solid #0c4e72 !important;}'
	+
	'._2HYAx {background: #1290ce !important;}'
	+
	'._1EVZm {background: #86a2b7 !important;}'
);