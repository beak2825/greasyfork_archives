//
// Written by Glenn Wiking
// Script Version: 1.0.0a
// Date of issue: 09/20/17
// Date of resolution: 09/20/17
//
// ==UserScript==
// @name        ShadeRoot Kvasir
// @namespace   SRKV
// @description Eye-friendly magic in your browser for Kvasir
// @version     1.0.0a
// @icon        https://i.imgur.com/rq5F3E0.png

// @include     http://*kvasir.*
// @include     https://*kvasir.*

// @downloadURL https://update.greasyfork.org/scripts/33593/ShadeRoot%20Kvasir.user.js
// @updateURL https://update.greasyfork.org/scripts/33593/ShadeRoot%20Kvasir.meta.js
// ==/UserScript==

function ShadeRootKV(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootKV(
	'html, body.homepage, .homepage #wrapper, .footer-wrap, .kvasir, .e-ready, .e-route .e-header, .mainPage .modules-content, .mainPage .search-content {background: #201d1c !important;}'
	+
	'.editor-info {border-top: 1px solid #151111 !important;}'
	+
	'.search-button-wrap input, .search-button-wrap button, #branding .logo a {background-color: #831821 !important;}'
	+
	'input, .e-clear-button {background-color: #423c3c !important; color: #DDC !important;}'
	+
	'em, .form-warning, p, i, b, em, li, h1, h2, h3, h4, h5, h6, label, span, body {color: #DCC !important;}'
	+
	'.delete-icon, #main-nav, .tab-nav .nav-menu li.active a, .tab-nav .nav-menu li.active > span, .active .tab-btn, .tab-nav .nav-menu li.active a, .tab-nav .nav-menu li.active > span, .e-searchfield-wrapper {background-color: #423c3c !important}'
	+
	'#footer a:hover, #main-nav .nav-menu li > a, #main-nav .nav-menu li > a:hover, .anchor, .anchor:hover, .anchor:visited, a {color: #cb3636 !important;}'
	+
	'#main-content {opacity: .9 !important;}'
	+
	'.search-input-wrap input.current, .search-input-wrap input.focused, .search-input-wrap input:focus, input[type="text"], input[type="email"], input[type="number"], input[type="search"], input[type="date"], textarea, .e-field, select {border: 1px solid #6c1a1a !important; background: #3b3636 !important;}'
	+
	'.module, .popup-list li {background: #2a1e1e !important;}'
	+
	'.popup .form-warning {background-color: #77141d !important;}'
	+
	'#main-nav .hr {border-top: 1px solid #1e1616 !important;}'
	+
	'#main-nav .nav-menu li > a:hover {background: #511717 !important;}'
	+
	'.tab-wrap > a {border-right: 1px solid #952323 !important;}'
	+
	'.notification-box {background: #104d93 !important;}'
	+
	'.e-contextmenu, .e-layer-select, .e-unselectable, .e-layer-select ul, .e-showonmapteaser ul {background: #352929 !important;}'
	+
	'.e-contextmenu li a:hover {background-color: #261414 !important;}'
	+
	'.e-input-wrapper::after {background: linear-gradient(to right,rgba(255,255,255,0),rgb(66, 58, 58)) !important;}'
	+
	'.e-streetview-main button, .e-zoom-slider .e-zoom-in, .e-zoom-slider .e-zoom-out, button {background: #352b2b !important; color: #DCC !important;}'
	+
	'#mapContainer {opacity: .9 !important; filter: brightness(.92) !important;}'
	+
	'#footer {background-color: rgba(26, 18, 18, 0.85) !important;}'
	+
	'.kvasir .e-showonmapteaser li.selected, .e-showonmap .e-showonmap-item.selected {background: #8c1f12 !important;}'
	+
	'.e-showonmap > ul > li {background: #271f1f !important;}'
	+
	'.e-field, .e-popup .e-content, .e-popup-modal .e-content, .e-draw-menu ul {background: #511717 !important; border: solid 1px #695353 !important;}'
	+
	'.e-options > div {border-top: dashed 1px #932f2f !important;}'
	+
	'.e-save ul li:hover {background-color: #321a1a !important;}'
	+
	'.product-header {background: #3e2d2d !important;}'
	+
	'.product-wrap {background: #211717 !important;}'
);