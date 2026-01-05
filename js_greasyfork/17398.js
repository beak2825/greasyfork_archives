//
// Written by Glenn Wiking
// Script Version: 1.1.0d
// Date of issue: 18/02/16
// Date of resolution: 24/02/16
//
// ==UserScript==
// @name        ShadeRoot Greasyfork
// @namespace   SRGF
// @description Eye-friendly magic in your browser for Greasyfork
// @include     *greasyfork.org*
// @version     1.1.0d
// @icon		http://i.imgur.com/idZttjB.png

// @downloadURL https://update.greasyfork.org/scripts/17398/ShadeRoot%20Greasyfork.user.js
// @updateURL https://update.greasyfork.org/scripts/17398/ShadeRoot%20Greasyfork.meta.js
// ==/UserScript==

function ShadeRootGF(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

ShadeRootGF (
  	'html, body {background-color: #332E2E !important; color: #D8BDBD !important;}'
  	+
  	'div::-moz-selection, span::-moz-selection, a::-moz-selection, h1::-moz-selection, h2::-moz-selection, h3::-moz-selection, h4::-moz-selection, h5::-moz-selection, h6::-moz-selection, p::-moz-selection, img::-moz-selection, li::-moz-selection {background-color: #6E170C !important; color: #DCC !important;}'
	+
	'a {color: #AD2424 !important;}'
	+
	'a:visited {color: #9B4545 !important;}'
	+
	'#nav-user-info a, .SiteMenu a {color: #D43B3B !important;}'
	+
	'#main-header, #main-header a, #main-header a:visited, #main-header a:active {color: #FFE9E9 !important;}'
	+
	'.list-option-group {background-color: #4E2727 !important;}'
	+
	'pre, code, #code-container {background: #602414 !important; border: 1px solid #872A11 !important;}'
	+
	'select, input, button {background-color: #561010 !important; border: 1px solid #331E1E !important; border-radius: 3px !important; color: #D8C0C0 !important;}'
	+
	'.Button {background: rgb(147,30,30); background: -moz-linear-gradient(top, rgba(147,30,30,1) 0%, rgba(98,19,19,1) 100%)!important; background: -webkit-linear-gradient(top, rgba(147,30,30,1) 0%,rgba(98,19,19,1) 100%)!important;   background: linear-gradient(to bottom, rgba(147,30,30,1) 0%,rgba(98,19,19,1) 100%)!important; border: 1px solid #421414 !important; text-shadow: 0px 1px 0px #411F1F !important; box-shadow: 0px 1px 0px #3E1919 inset, 0px -1px 2px #4D1717 inset !important; color: #EDD !important;}'
	+
	'.Number, .MenuItems a, .MenuItems a:link, .MenuItems a:visited, .MenuItems a:active {color: #EDD !important;}'
	+
	'#site-name-text h1 a {color: #EDD !important;}'
	+
	'.MenuItems {background: #561010 !important; border: 1px solid #682828;}'
	+
	'.MenuItems hr {border-color: -moz-use-text-color -moz-use-text-color #6E1F1F !important;}'
	+
	'.MenuItems a:hover {color: #EDD !important; background-color: #B5361C !important;}'
	+
	'.Flyout::before, .Flyout::after {border-bottom: 7px solid #782E2E !important; border-left: 7px solid rgba(255, 0, 0, 0) !important; border-right: 7px solid rgba(255, 0, 0, 0) !important;}'
	+
	'.MeButton, table.PreferenceGroup tbody tr:hover td {background: #670000 !important;}'
	+
	'img, canvas, .PoweredByVanilla {opacity: .8 !important;}'
	+
	'.good-rating-count {background-color: rgba(0, 255, 0, 0.2) !important;}'
	+
	'.ok-rating-count {background-color: rgba(255, 255, 0, 0.3) !important;}'
	+
	'.bad-rating-count {background-color: rgba(255, 0, 0, 0.2) !important;}'
	+
	'#script-links .current {background: #670000 !important;}'
	+
	'#script-links li {border-color: #752424 !important;}'
	+
	'#script-links li:not(.current) {background-color: #331C1C !important;}'
	+
	'.install-link, .install-link:visited, .install-link:active, .install-link:hover, .install-help-link, .CodeRay .line-numbers a {color: #EDD !important;}'
	+
	'#additional-info > div {background-color: #271A1A !important;}'
	+
	'.CodeRay .line-numbers, textarea {background-color: #481F1A !important; border: 1px #351111 !important;}'
	+
	'#code-container, .CodeRay pre, .CodeRay code {background: #2D1008 !important; !important; border: 1px solid #2A140E !important;}'
	+
	'.CodeRay, a.install-help-link {color: #EDD !important;}'
	+
	'.CodeRay .integer {color: #E39634 !important; text-shadow: 0 0 1px #A82424 !important;}'
	+
	'.CodeRay .key {color: #943DE4 !important;}'
	+
	'.CodeRay .function {color: #147ED7 !important;}'
	+
	'.CodeRay .predefined-constant {color: #6DB7F6 !important;}'
	+
	'.CodeRay .string {background-color: rgba(18, 1, 1, 0.50) !important;}'
	+
	'.alert {background-color: #771010 !important;}'
	+
	'#script-info, .text-content, .MeBox, .FilterMenu, #Content, .PanelCategories, .script-list, .user-list, .list-option-group ul {border: 1px solid #201313 !important; background-color: #1d1616 !important; box-shadow: 0 0 5px #201212 !important;}'
	+
	'.script-list li {border-bottom: 1px solid #5F2828 !important;}'
	+
	'#Panel .FilterMenu .Active a, #Panel .PanelCategories .Active a, #Panel .FilterMenu a:hover, #Panel .PanelCategories a:hover, #Panel .FilterMenu a:focus, #Panel .PanelCategories a:focus, .list-current, .list-option-group a:hover, .list-option-group a:focus {background: linear-gradient(#451515, #2A0B0B) !important;}'
	+
	'.list-option-group a:hover, .list-option-group a:focus {box-shadow: inset 0 -1px #651e1e, inset 0 1px #4B1111 !important; color: #edd !important;}'
	+
	'#Panel .FilterMenu a:hover, #Panel .PanelCategories a:hover, #Panel .FilterMenu a:focus, #Panel .PanelCategories a:focus {box-shadow: inset 0 -1px #A82222, inset 0 1px #681010 !important;}'
	+
	'.SiteMenu li a, input.DateBox, input.InputBox, input.SmallInput, textarea {color: #e7c0c0 !important;}'
	+
	'.MenuItems hr {border-bottom: 1px solid #783523 !important;}'
	+
	'.FlyoutMenu {background: #5f1717 !important; color: #f3cccc !important; border: solid 1px #380a0a !important;}'
	+
	'.token-input-list {background-color: #2f1616 !important; border: 1px solid #620a0a !important; color: #ead3d3 !important;}'
	+
	'.token-input-dropdown {background-color: #471919 !important; border: 1px solid #771515 !important;}'
	+
	'.token-input-dropdown * {background-color: #471919 !important;}'
	+
	'.pagination > *, .script-list + .pagination > *, .user-list + .pagination > * {background-color: #2A1818 !important;}'
// ACE
	+
	'#ace-editor {border: 1px inset #651717 !important;}'
	+
	'.ace-tm {background-color: #4A2E2E !important;}'
	+
	'.form-control textarea, #ace-editor {color: #EDD !important;}'
	+
	'.ace-tm .ace_gutter {background: #350707 !important; color: #D4C9C9 !important;}'
	+
	'.ace_folding-enabled > .ace_gutter-cell {background: #2A1B1B !important;}'
	+
	'.ace_content {text-shadow: 1px 1px 1px #1B0909 , -1px -1px 1px #1B0C0C !important;}'
	+
	'.notice {background-color: #292E30 !important;}'
	+
	'#additional-info > div, figure {border: 1px solid #471C17 !important;}'
	+
	'form.external-login-form, form.new_user {background-color: #331b1b !important; border: 1px solid #572416 !important;}'
	+
	'#home-script-nav {border-bottom: 1px solid #471C17;}'
);