//
// Written by Glenn Wiking
// Script Version: 1.1.0a
// Date of issue: 18/02/16
// Date of resolution: 24/02/16
//
// ==UserScript==
// @name        ShadeRoot Colorzilla
// @namespace   SRCZ
// @description Eye-friendly magic in your browser for Colorzilla
// @include     *colorzilla.*

// @version     1.1.0a
// @icon        https://i.imgur.com/mb16mdy.png
// @downloadURL https://update.greasyfork.org/scripts/17422/ShadeRoot%20Colorzilla.user.js
// @updateURL https://update.greasyfork.org/scripts/17422/ShadeRoot%20Colorzilla.meta.js
// ==/UserScript==

function ShadeRootCZ(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootCZ (
	'html, body {background: #1D1919 !important;}'
	+
	'.pane, #editor-heading, .info-panel, .gradient-control, .panel-label {background: #272727 !important; border: 1px solid #1e1818 !important;}'
	+
	// background: -moz-linear-gradient(top, #4a4545 0%, #3e3535 50%, #272020 100%) !important; border: 1px solid #1e1818 !important; background: -moz-linear-gradient(top, #3e3535 0%, #272020 100%) !important; background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#4a4545), color-stop(100%,#272020)) !important; background: -webkit-linear-gradient(top, #4a4545 0%,#272020 100%); background: -o-linear-gradient(top, #4a4545 0%,#272020 100%) !important; background: -ms-linear-gradient(top, #4a4545 0%,#272020 100%) !important; background: linear-gradient(top, #4a4545 0%,#272020 100%) !important; filter: progid:DXImageTransform.Microsoft.gradient( startColorstr='#4a4545', endColorstr='#272020',GradientType=0 );
	'.pane div, .pane p, .pane h1, .pane h2, .pane h3, .pane ul {color: #DAD1D1 !important;}'
	+
	'#hd h1 a, #hd h1 a:link, #hd h1 a:visited, #hd h1 a:active, #hd h1 a:hover, h1, h1 a {color: #DAD1D1 !important;}'
	+
	'#hd h2 a, #hd h2 a:link, #hd h2 a:visited, #hd h2 a:active, #hd h2 a:hover, h2, h1 a {color: #a19090 !important;}'
	+
	'.product h2 a, .product h2 a:link, .product h2 a:visited, .product h2 a:active, .product h2 a:hover {color: #DAD1D1 !important;}'
	+
	'.product {background: #272121 !importasnt;}'
	+
	'.product:hover {background: #141212 !important;}'
	+
	'#hd {text-shadow: 1px 1px 0px #241313 !important;}'
	+
	'.feedbackform input.text, textarea, input, .presets-container, .orientation, .save-new-preset, button, .dialog-button, .ok-button {background: #262222 !important; border: 1px solid #0E0909 !important;}'
	+
	'input {border-radius: 4px !important;}'
	+
	'input, text, textarea, .panel-label, .preview, .output-options, .css-options, span {color: #DDD !important;}'
	+
	'#recaptcha_widget_div, img {opacity: .8 !important;}'
	+
	'.navigation-link, .navigation-link:link, .navigation-link:visited, .navigation-link:active {color: #C8C8C8s !important;}'
	+
	'#main-nav li a {border-right: 1px inset rgba(0, 0, 0, 0.2) !important; color: #D1CECE !important;}'
	+
	'#main-nav li a:hover {color: #D8D8D8 !important; background: #555 !important;}'
	+
	'#main-nav li a.active, #main-nav li a:hover {background: -moz-linear-gradient(top, #989898 0%, #5c5555 100%) !important; background: -webkit-gradient(linear, left top, left bottom, color-stop(0%,#989898), color-stop(100%,#5c5555)) !important; background: -webkit-linear-gradient(top, #989898 0%,#5c5555 100%); background: -o-linear-gradient(top, #989898 0%,#5c5555 100%) !important; background: -ms-linear-gradient(top, #989898 0%,#5c5555 100%) !important; background: linear-gradient(top, #989898 0%,#5c5555 100%) !important;}'
	+
	'.dialog-panel {border-top: 1px solid #1B1212 !important;}'
	+
	'.css-output div.css-output-text {border: 1px #170d0d solid !important; color: #DDD !important;}'
	+
	'.dialog-panel a {color: #4985CB !important;}'
	+
	'.feedbackform input.text, textarea, input, .presets-container, .orientation, .save-new-preset, .color-label, .stop-type-label, .details-panel, .details-panel div, .color-entry-boxes {color: #DDD !important;}'
	+
	'.dialog_n, .dialog_nw, .dialog_ne {background: #555 !important;}'
	+
	'.dialog_content {background-color: #292323 !important;}'
	+
	'.dialog_w, .dialog_e, .dialog_sw, .dialog_se, .dialog_s {background: rgba(0,0,0,0) !important;}'
	+
	'button, p, .gradient-name, .info-panel, .info-panel ul, .css-comments, .browser-compatibility th, .gradient-adjustments-panel .adjustment-ops-panel a, .gradient-adjustments-panel .adjustment-ops-panel a:link, .gradient-adjustments-panel .adjustment-ops-panel a:visited, .gradient-adjustments-panel .adjustment-ops-panel a:active {color: #DDD !important;}'
	+
	'.browser-compatibility td .more-info .syntax {background: #c9c937 !important;}'
	+
	'#editor-heading {text-shadow: 1px 1px 0 #110909 !important;}'
	+
	'.inner-sub-panel {border: 1px solid #241515 !important; background: #140d0d !important;}'
	+
	'.prefixed, .browser-compatibility td {color: #292525 !important;}'
	+
	'.css-notes {background-color: #42413A !important; border: 1px solid #666363 !important;}'
);