//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 09/20/17
// Date of resolution: 09/20/17
//
// ==UserScript==
// @name        ShadeRoot Sol
// @namespace   SRSOL
// @description Eye-friendly magic in your browser for Sol
// @version     1.0.0a
// @icon        https://i.imgur.com/xBemRkb.png

// @include     http://sol.*
// @include     https://sol.*

// @downloadURL https://update.greasyfork.org/scripts/33594/ShadeRoot%20Sol.user.js
// @updateURL https://update.greasyfork.org/scripts/33594/ShadeRoot%20Sol.meta.js
// ==/UserScript==

function ShadeRootSOL(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootSOL(
	'.kakHXz {background: #153047 !important;}'
	+
	'.ikBvrr {background: linear-gradient(0deg,#5d5d5d,#262829 .1rem) !important;}'
	+
	'a, select, body, .logotxt, .spillevett, .verktoy, .spillproblemer {color: #DCC !important;}'
	+
	// BG 1
	'.front-app, html, body {background: #303233 !important;}'
	+
	// BG 2
	'.jeGwxX, .diGpSV a {background: #1a1a1b !important;}'
	+
	'.bcbENg {background: linear-gradient(to right,rgba(41, 44, 47, 0.3) 0%,rgb(38, 40, 42) 70%) !important;}'
	+
	'.diGpSV a, .dLrMPU a, .jutpvB a {box-shadow: none !important;}'
	+
	'.bYlyBZ:hover {background-color: #4a1313 !important;}'
	+
	'.bYlyBZ {background: #a51717 !important;}'
	+
	'h1, h2, h3, h4, dt, h5, blockquote, q, h6 {color: #ddc9c9;}'
	+
	'.rfqoN, .eJpCJV, .hgiFSg, .source, span, .article-excerpt {color: #AB9B9B !important;}'
	+
	'.BxUAa {background: #292525 !important;}'
	+
	'.bNEQUl {background: #541a1a !important;}'
	+
	'.johklH:hover, .fdJjqq:hover, .gmeHKL:hover {background: #272121 !important;}'
	+
	'.gBStbh, .iIbYro, .cQeBSt {background: #2a2323 !important;}'
	+
	'.XAWiw::after {background: #1d1515 !important;}'
	+
	'article h1, article h2, article h3, article h4, .spillsenter, header h1, .title {color: #bf1e1e !important;}'
	+
	'.kMxYZG {border-bottom: .1rem solid #423434 !important;}'
	+
	'.kvIIMi, .gmYTuA, .fBBTNc {border: .1rem solid #6c1f1f !important;}'
	+
	'.jeGwxX, .diGpSV a, .dLrMPU a, .isOudK a, .jutpvB a {background: #1a1a1bcc !important;}'
	+
	'.fWhxlY a {background-color: #362121 !important;}'
	+
	'.iFjxbh {border-bottom: .1rem solid #171313 !important;}'
	+
	'.hoGHng {background-color: #2f1d1d !important;}'
	+
	'.kvasir-search-field {border: .1rem solid #871414 !important;}'
	+
	'.bWYpOe, .JliM {background: #291c1c !important;}'
	+
	'.kvasir-search-field {border: .1rem solid #871414 !important;}'
	+
	'.JliM, .button-in-the-end {color: #e4d1d1 !important;}'
	+
	'.eErzyA {color: #392F2F !important;}'
	+
	'.bZThHf a {background-color: #3f1d1d !important;}'
	+
	'.spillsenter {background-color: #201d1d !important;}'
	+
	'.eFsEOt {border-top: 1px solid #201919 !important;}'
	+
	'.modal-window, .news-search {background: #291c1c !important;}'
	+
	'.hBWkhA section .kykOVq {background: linear-gradient(to bottom,rgba(255,255,255,0) 0%,rgb(32, 30, 30) 75%) !important;}'
	+
	'.fhCRBp, div[role="menu"], div[role="presentation"] {background: #691717 !important;}'
	+
	'.articles article {border: .1rem solid #5f1b1b !important; box-shadow: 0 0 .2rem #591717 !important; background-color: #262424 !important;}'
	+
	'.articles article a .description {color: #b7a7a7 !important;}'
	+
	'.news-search {background-color: #211f1f !important;}'
	+
	'.news-search header h1 {color: #decbcb !important;}'
	+
	'.zrbVB {border-top: .1rem solid #601b1b !important; background-color: #4e4242 !important; box-shadow: 0 0.3rem 0.3rem #4b1d1d !important;}'
	+
	'.kDBlgo {background: #1d1919 !important; color: #EDD !important;}'
	+
	'.fKbslK {background-color: #921d24 !important;}'
	+
	'.jlAhgl {background: #2a1c1c !important;}'
	+
	'.button-in-the-end, article {background: #1d1818 !important;}'
	+
	'.modal-window .hBWkhA section .kykOVq {background: linear-gradient(to bottom,rgba(71, 34, 34, 0) 0%,rgb(42, 28, 28) 75%) !important;}'
	+
	'.sol-article p {color: #ccb6b6 !important;}'
);