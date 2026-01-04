// ==UserScript==
// @name bab.la - Dark Theme
// @namespace github.com/openstyles/stylus
// @version 1.1.2
// @description Dark Theme for bab.la online dictionary
// @author Pabli
// @homepageURL https://github.com/pabli24/bab.la-dark
// @supportURL https://github.com/pabli24/bab.la-dark/issues
// @grant GM_addStyle
// @run-at document-start
// @match *://*.bab.la/*
// @downloadURL https://update.greasyfork.org/scripts/406760/babla%20-%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/406760/babla%20-%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
:root {
	color-scheme: dark;
}
.home .search-box-submit a {
	background-color: #444;
	box-shadow: 0 3px 6px rgba(0, 0, 0, .5);
	color: #fff;
}
body.languages .navbar, body.languages .site-switch-toggle,
body.corporate .navbar, body.corporate .site-switch-toggle {
	background-color: #0d0d0d;
}
.navbar-nav>.active>a, .navbar-nav>.active>a:hover, .navbar-nav>.active>a:focus,
.navbar-nav>li>a:hover, .navbar-nav>li>a:focus {
	color: #eee;
	background-color: rgba(255, 255, 255, 0.1)
}
.action-wrapper .logo-flash, .navbar-brand .babla-logo {
	background: transparent url(https://static.bab.la/img/babla-logo-white.svg) no-repeat left center scroll;
}
#firstHeaderBar .navbar-header .material-icons {
	color: #eee;
}
#firstHeaderBar a:hover .material-icons {
	color: rgba(255, 255, 255, .7);
}
body, body.languages .image-stage, body.languages .intro-stage {
	background-color: #111;
	color: #eee;
}
.lexico_entry {
	color: #eee;
	border-color: #333;
}
.lexico_sentences:before {
	color: #ccc;
	border-bottom: solid 1px #333;
}
.lexico_posgroup {
	color: #ccc;
}
.home #firstHeaderBar .navbar-header, #firstHeaderBar .navbar-header {
	background-color: #1f1f1f;
}
.content, .trendingWords .text, .trendingWords li, #translator-header .translator-header-container, #translator-header:after {
	background-color: #1f1f1f;
}
.action-wrapper,
body.action-links-open .action-panel-form-language-switch:after {
	background-color: #1f1f1f;
}
.action-links {
	background-color: #1f1f1f;
	border-top: 1px solid rgba(255, 255, 255, 0.1);
}
.dict-select-column ul li a, .dict-select-column li:not(.bab-custom-dictsub) {
	color: #eee;
	background-color: #252525;
}
#translator-header:after {
	border-color: #111;
}
.dict-select-column ul li:hover a, 
.dict-select-column ul li:active a, 
.dict-select-column li:not(.bab-custom-dictsub):hover, 
.dict-select-column li:not(.bab-custom-dictsub):active,
.tt-suggestion:hover, .tt-cursor {
	background-color: #333;
}
.dict-select-column ul li a.more.collapsed {
	color: #eee;
}
.action-panel-form-item {
	border-right: 1px solid #333;
	border-left: 1px solid #333;
}
.home .action-panel-form .action-panel-form-item-input {
	border: 2px solid #333;
}
.did-you-mean li a {
	background-color: #252525;
}
@media screen and (max-width: 740px) {
.action-panel-form-item-input {
	border-bottom: 1px solid #333;
}
}
.action-search, .action-search:focus {
	color: #eee;
}
.action-panel-form a, .action-panel-form .form-prefix, .action-panel-form-sm a, .action-panel-form-sm .form-prefix,
a.action-panel-form-submit,
.dict-switch-help h3,
.dict-select-column ul li a.more,
.dict-switch-help p {
	color: #aaa;
}
.action-panel-form a:hover, .action-panel-form-sm a:hover, .action-panel-form .action-links-toggle:hover, .action-panel-form .swapLanguage:hover, .action-panel-form-sm .action-links-toggle:hover, .action-panel-form-sm .swapLanguage:hover, .swapLanguage:hover {
	color: #ccc;
}
body.languages .section-label,
.teaser.languages .section-label {
	background-color: #0f4f7d;
}
body.languages .section-label:after {
	border-top-color: #1172b9;
}
.teaser.magazine .section-label {
	background-color: #923a1f;
}
.quick-results-header .quick-results-h2,
.quick-results .quick-result-entry .sense-group-results a,
.quick-result-entry .toc-links a,
.quick-result-entry .toc-links a:after,
.material-icons[style*="color:#0077CC;"],
.dict-entry .dict-example .dict-source .icon-link, .dict-entry .dict-example .mono-examples .icon-link:hover, .dict-entry .dict-example .mono-examples .icon-link:focus, .dict-entry .dict-example .mono-examples .icon-link {
	color: #6fb8ec !important;
}
a, 
.teaser-wrapper span.teaser-eyecatcher,
.teaser.languages a.container:hover span.teaser-header,
.dict-select-portion-header,
body.languages .dropdown-header,
body.corporate .dropdown-header,
.content-list .content-item-calltoaction,
.content-list .content-item>a:hover .content-item-header, .collocs a.colloc-link,
.trendingWords .trendingWord, .lexico_trans {
	color: #6fb8ec;
}
a:hover, a:focus,
p.practical-alert a:hover {
	color: #558db5;
}
.teaser.magazine span.teaser-eyecatcher,
.teaser.magazine a.container:hover span.teaser-header {
	color: #f79577;
}

.breadcrumb a,
.breadcrumb>.active,
.breadcrumb a:hover, .breadcrumb a:focus {
	color: #ccc;
}
.breadcrumb>li+li:before {
	color: #ddd;
}

.result-block .result-block-toc ol {
	border-bottom: 1px solid #333;
	color: #aaa;
}
.result-block .sense-group .sense-group-header {
	color: #f79577;
	border-bottom: 1px solid #333;
}
.toc-links, .collocs .colloc-examples {
	border-top: 1px solid #333;
}
.toc-links a {
	border-top: 1px solid #333;
	border-bottom: 1px solid #333;
}
.toc-links a:hover {
	background-color: rgba(255, 255, 255, 0.1);
}
.quick-results .quick-results-header, 
.result-block .result-block-header,
.dict-entry, .collocs .example, .collocs .quick-results-h1 {
	border-bottom: 1px solid #333;
}
.dict-entry .dict-example strong, .dict-entry .dict-example b {
	background-color: #0f4f7d;
}
.conj-tense-block-header {
	color: #ff889a;
	border-bottom: 1px solid #333;
}
.quick-results .quick-result-entry span.suffix, .quick-results .quick-result-entry span.sense-group-description-text,
.dict-entry .dict-translation .dict-source,
.dict-entry span.suffix,
.toc-links-header h5,
.result-block h3 span.suffix,
.result-block .result-block-toc ol li a,
footer.synonym-copyright, p.practical-alert {
	color: #aaa;
}
a.sound, span.sound, a.sound-inline, span.sound-inline {
	color: #aaa !important;
}
a.sound:hover, a.sound-inline:hover {
	color: #6fb8ec !important;
}
.dict-entry .dict-example .dict-source {
	color: #ccc;
}
a.icon-link {
	color: #aaa;
}
a.icon-link:hover, a.icon-link:focus {
	background-color: rgba(255, 255, 255, 0.1);
	color: #eee;
}

.dropdown-menu, .tt-menu {
	background-color: #111;
	border: 1px solid rgba(255, 255, 255, 0.1);
}
.dropdown-menu>li>a, .tt-menu>li>a {
	color: #eee;
}
.dropdown-menu>li>a:hover, .tt-menu>li>a:hover, .dropdown-menu>li>a:focus, .tt-menu>li>a:focus {
	color: #eee;
	background-color: #252525;
}
.dropdown-menu>.active>a, .tt-menu>.active>a, .dropdown-menu>.active>a:hover, .tt-menu>.active>a:hover, .dropdown-menu>.active>a:focus, .tt-menu>.active>a:focus {
	color: #aaa;
}
.keyboard-wrapper {
	background-color: #1f1f1f;
	border-bottom: 1px solid #333;
}
.keyboard-wrapper .babla-extra-letter-set a {
	border: 1px solid #333;
	background-color: #333;
	color: #eee;
}
.keyboard-wrapper .babla-extra-letter-set a:hover {
	background-color: #444;
	color: #eee;
}

.site-footer,
.site-footer a:hover, .site-footer a:focus {
	color: #ccc;
}

.navigation #navItems .tab {
	color: #eee;
	background: #323232;
	border-right: 1px solid #444;
}
.nav>li>a:hover, .nav>li>a:focus {
	background-color: rgba(255, 255, 255, .1);
}
.content-list .content-item-teaser-img {
	border: 1px solid #333;
	background: #333 no-repeat center center scroll;
}
body.corporate .section-label {
	background-color: #444;
}
body.corporate .section-label:after {
	border-top-color: #555;
}
.form-control {
	color: #eee;
	background-color: #151515;
	border: 1px solid #444;
}
.bab-custom-dictsub,
.bab-custom-dictsub a:hover {
	background-color: #252525 !important;
}

#inputText-container, #outputText-container {
	background-color: #333;
	border-color: #444;
}
button, input, optgroup, select, textarea {
	background-color: #333;
}
.select2-container--default .select2-selection--single, .select2-dropdown {
	background-color: #333;
	border: 1px solid #444;
}
.select2-container--default .select2-search--dropdown .select2-search__field {
	border: 1px solid #444;
}
.select2-container--default .select2-selection--single .select2-selection__rendered {
	color: #eee;
}
.select2-container--default .select2-results__option[aria-selected="true"],
.commonVerbs-closed, .commonVerbs-closed .commonVerbs-button {
	background-color: #252525;
}
.commonVerbs-button {
	color: #6fb8ec;
	background-color: #1f1f1f;
}
#topslot_container,
.info-wrapper>div {
	display: none;
}

.dict-pag a.dict-pag-button:hover, .dict-pag a.dict-pag-button:active {
	background-color: #333;
}
.dict-pag .dict-pag-numbers .dict-pag-button {
	background-color: #252525;
}
.dict-pag a.dict-pag-button {
	color: #eee;
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
