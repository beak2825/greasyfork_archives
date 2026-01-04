// ==UserScript==
// @name Better Searx Dark Theme(searx.be)
// @namespace -
// @version 0.2
// @description SearX(BE) dark theme.
// @author Not You
// @match *searx.be/*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @license GPLv3
// @license-link https://www.gnu.org/licenses/gpl-3.0.txt
// @grant none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/439839/Better%20Searx%20Dark%20Theme%28searxbe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/439839/Better%20Searx%20Dark%20Theme%28searxbe%29.meta.js
// ==/UserScript==

/*
Features:
- Invisible Navigation Bar
- Darker links
- Darker categories font and color under them
- Darker description
- Darker description for Wikipedia bar
- Works With Dark Theme

Bonus Features:
- Change Title
- Replaced Main Logo with old one
- Replaced Favicon with old one
- Fixed Main Logo Margin
- Adding Fake History
*/

// Change Main Logo //
if(window.location.pathname.indexOf('/') != -1) {
    document.title = "SearX";
    $('.center-block.img-responsive').attr('src', 'https://searx.bar/static/themes/oscar/img/logo_searx_a.png')
}

// Change Title //
document.title = 'SearX'

// Change Favicon //
$('link[rel*="icon"]').prop('href','https://searx.bar/static/themes/oscar/img/favicon.png');

// Add Fake History //
window.history.pushState('', '', '/search?q=i%20<3%20GNU&categories=general');
window.history.pushState('', '', '/search?q=microsoft%20malware%20gnu&categories=general');
window.history.pushState('', '', '/search?q=google%20malware%20gnu&categories=general');
window.history.pushState('', '', '/search?q=GNU%20FSF&categories=images');
window.history.pushState('', '', '/search?q=hello%20kitty&categories=general');
window.history.pushState('', '', '/search');

// CSS //
(function() {
let css = `

body {
background: rgb(25, 25, 25) !important;
}

select, option {
background-color: rgb(25, 25, 25) !important;
border: 1px solid rgb(20, 20, 20) !important;
color: rgb(236, 236, 236) !important;
}

button, input, select, textarea {
border: 1px solid rgb(19, 19, 19) !important;
background-color: rgb(25, 25, 25) !important;
color: rgb(210, 210, 210) !important;
}

td, tr, tbody, thead, table {
color: rgb(210, 210, 210) !important;
}

span::before, span::after {
color: rgb(210, 210, 210) !important;
}

p {
color: rgb(210, 210, 210) !important;
}

li {
color: rgb(210, 210, 210) !important;
}

.small, small {
color: rgb(210, 210, 210) !important;
}

#q {
background-color: rgb(25, 25, 25) !important;
border: 1px solid rgb(20, 20, 20) !important;
color: rgb(238, 238, 238) !important;
}

.btn {
color: rgb(238, 238, 238) !important;
background-color: rgb(25, 25, 25) !important;
border: 1px solid rgb(20, 20, 20) !important;
}

.btn:hover {
color: 0 !important;
background-color: rgb(22, 22, 22) !important;
}

label[for="check-advanced"] {
color: rgb(238, 238, 238);
}

.searxng-navbar {
background: rgba(0, 0, 0, 0) !important;
}

.searxng-navbar .instance a {
color: rgb(220, 220, 220) !important;
}

.searxng-navbar a, .searxng-navbar a:hover {
color: rgb(220, 220, 220) !important;
}

#main-logo {
margin-top: 10vh;
}

#categories input[type="checkbox"]:checked + label, .search_categories input[type="checkbox"]:checked + label {
background-color: rgba(0, 0, 0, 0) !important;
border-bottom: rgb(220, 220, 220) 5px solid !important;
color: rgb(220, 220, 220) !important;
}

#categories *, .modal-wrapper * {
background: rgb(25, 25, 25) none repeat scroll 0% 0% !important;
color: rgb(219, 219, 219) !important;
}

.h1, .h2, .h3, .h4, .h5, .h6, h1, h2, h3, h4, h5, h6 {
color: rgb(110, 110, 110) !important;
}

.col-sm-3.col-md-2 {
color: rgb(110, 110, 110) !important;
}

.nav-tabs.nav-justified > .active > a, .navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:focus, .navbar-default .navbar-nav > .active > a:hover {
background-color: rgb(22, 22, 22) !important;
color: rgb(110, 110, 110) !important;
}

.nav-tabs.nav-justified > li > a {
color: rgb(110, 110, 110) !important;
}

.nav > li > a:focus, .nav > li > a:hover {
background-color: rgb(22, 22, 22) !important;
}

.table-striped > tbody > tr:nth-child(2n+1) > td, .table-striped > tbody > tr:nth-child(2n+1) > th, .table-striped > thead > tr:nth-child(2n+1) > th {
background: rgb(24, 24, 24) none repeat scroll 0% 0% !important;
color: rgb(150, 150, 150) !important;
}

.table-hover > tbody > tr:hover > td, .table-hover > tbody > tr:hover > th {
background: rgb(22, 22, 22) none repeat scroll 0% 0% !important;
}

.name {
color: rgb(110, 110, 110) !important;
}

.stacked-bar-chart-median {
background: rgb(226, 226, 226) none repeat scroll 0% 0%;
border: 1px solid rgba(12, 12, 12, 0.9);
}

.text-right {
color: rgb(110, 110, 110) !important;
}

.onoffswitch-checkbox:checked + .onoffswitch-label .onoffswitch-switch {
right: 73px !important;
}

.onoffswitch-inner::after, .onoffswitch-inner::before {
background: rgb(24, 24, 24) none repeat scroll 0% 0% !important;
}

.panel {
border: 1px solid rgb(20, 20, 20);
background: rgba(0, 0, 0, 0) none repeat scroll 0px 0px;
}

.panel-heading {
color: rgb(110, 110, 110) !important;
background: rgba(21, 21, 21, 0.4) none repeat scroll 0% 0% !important;
}

.panel-body {
color: rgb(110, 110, 110) !important;
background: rgb(22, 22, 22) none repeat scroll 0% 0% !important;
border-color: rgb(21, 21, 21) !important;
}

div#advanced-search-container div#categories label {
color: rgb(220, 220, 220) !important;
}

.text-muted > small > a {
color: rgb(255, 255, 255) !important;
}

.infobox_part {
color: rgb(230, 230, 230) !important;
}

.result-content {
color: rgb(252, 252, 252) !important;
}

.result-content, .result-format, .result-source {
margin-top: 2px !important;
margin-bottom: 0 !important;
word-wrap: break-word !important;
color: color: rgb(238, 238, 328) !important;
font-size: 13px !important;
}

.label-default {
color: rgb(11, 11, 11);
}

.external-link {
color: rgb(28, 225, 135) !important;
}

.result_header a .highlight {
color: rgb(255, 255, 255) !important;
background-color: rgba(0, 0, 0, 0) !important;
}

.highlight {
color: rgb(255, 255, 255) !important;
}

span {
color: rgb(110, 110, 110) !important;
}

.result_header {
color: rgb(110, 110, 110) !important;
}

.result_header a {
color: rgb(232, 232, 232) !important;
}

.result_header a:hover {
color: rgb(214, 214, 214) !important;
}

.result_header a:visited {
color: rgb(225, 225, 225) !important;
}

.result-code:hover, .result-default:hover, .result-map:hover, .result-torrent:hover, .result-videos:hover {
background-color: rgb(24, 24, 24) !important;
}

a:hover {
text-decoration: underline !important;
}

#categories input[type="checkbox"]:checked + label, .search_categories input[type="checkbox"]:checked + label {
border-bottom: rgb(220, 220, 220) 5px solid !important;
}

`;
if (typeof GM_addStyle !== 'undefined') {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();


























// Hi There Again (: