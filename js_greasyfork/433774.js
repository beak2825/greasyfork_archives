// ==UserScript==
// @name Better Searx White Theme(searx.be)
// @namespace -
// @version 0.2
// @description upgrades SearX(BE) white theme.
// @author Not You
// @match *searx.be/*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @license GPLv3
// @license-link https://www.gnu.org/licenses/gpl-3.0.txt
// @grant none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/433774/Better%20Searx%20White%20Theme%28searxbe%29.user.js
// @updateURL https://update.greasyfork.org/scripts/433774/Better%20Searx%20White%20Theme%28searxbe%29.meta.js
// ==/UserScript==

/*
Features:
- Invisible Navigation Bar
- Darker links
- Darker categories font and color under them
- Darker description
- Darker description for Wikipedia bar

Bonus Features:
- Change Title
- Replaced Main Logo with old one
- Replaced Favicon with old one
- Fixed Main Logo Margin
- Adding Fake History
*/



// Change Main Logo //
if(window.location.pathname.indexOf('/') != -1) {
    document.title  = "SearX";
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

// CSS //
(function() {
let css = `

.searxng-navbar {
background: rgba(0, 0, 0, 0);
}

.searxng-navbar .instance a {
color: rgb(22, 22, 22);
}

.searxng-navbar a, .searxng-navbar a:hover {
color: rgb(22, 22, 22);
}

#main-logo {
margin-top: 10vh;
}

#categories input[type="checkbox"]:checked + label, .search_categories input[type="checkbox"]:checked + label {
border-bottom: rgb(22, 22, 22) 5px solid;
color: rgb(22, 22, 22);
}

.text-muted > small > a {
color: rgb(10, 10, 10) !important;
}

.infobox_part {
color: rgb(23, 23, 23);
}

.result-content {
color: rgb(62, 62, 62);
}

.result-content, .result-format, .result-source {
margin-top: 2px;
margin-bottom: 0;
word-wrap: break-word;
color: color: rgb(38, 38, 38);
font-size: 13px;
}

.result_header a .highlight {
color: rgb(11, 11, 11);
}

.result_header {
color: rgb(11, 11, 11);
}

.result_header a {
color: rgb(32, 32, 32);
}

.result_header a:hover {
color: rgb(14, 14, 14);
}

.result_header a:visited {
color: rgb(25, 25, 25);
}

a:hover {
text-decoration: underline;
}

#categories input[type="checkbox"]:checked + label, .search_categories input[type="checkbox"]:checked + label {
border-bottom: rgb(22, 22, 22) 5px solid;
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


























// Hi There (: