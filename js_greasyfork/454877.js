// ==UserScript==
// @name Better Searx White Theme(plusx)
// @namespace -
// @version 0.2
// @description upgrades SearX(BE) white theme.
// @author Not You
// @match *search.plusx.tk/*
// @match search.plusx.tk/*
// @require https://code.jquery.com/jquery-3.3.1.min.js
// @license GPLv3
// @license-link https://www.gnu.org/licenses/gpl-3.0.txt
// @grant none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/454877/Better%20Searx%20White%20Theme%28plusx%29.user.js
// @updateURL https://update.greasyfork.org/scripts/454877/Better%20Searx%20White%20Theme%28plusx%29.meta.js
// ==/UserScript==

/*

﹀ Change Log ﹀

0.3 Version:
- Fixed icon for searx.be

0.2 Version:
- Fixed bug #001
- Added border-radius to all images(4 pixels)

⌜BUGS⌟

BUG #001:
Change result images to logo

Features:
- Changes all icons to CSS analogs
- Title shows your request
- Fake History
- Changed Main Logo
- Changed Favicon
- Better Main Page input & logo margin
- Fixed On/Off Switch state margin

*/

// TITLE //
document.title = 'SearX';
if(window.location.pathname.indexOf("/search") != -1) {
    const searchRequest = $('input[value]').attr('value');
    document.title = 'SearX - ' + searchRequest;
} else if(window.location.pathname.indexOf("/preferences") != -1) {
    document.title = 'SearX - Preferences';
}

// FAKE HISTORY //
window.history.pushState('', '', '/search?q=Hi%20There!');
window.history.pushState('', '', '/search?q=GNU%20Philosophy');
window.history.pushState('', '', '/search?q=Free%20Software%20Foundation');
window.history.pushState('', '', '/search?q=No%20Systemd');
window.history.pushState('', '', '/search?q=Open%20BSD');
window.history.pushState('', '', '/search');

// LOGO //
//if(window.location.pathname.indexOf('/') != -1) {
//    $('#main-logo > .center-block.img-responsive').attr('src', 'https://searx.bar/static/themes/oscar/img/logo_searx_a.png',);
//}

// FAVICON //
//$('link[rel*="icon"]').prop('href','https://searx.bar/static/themes/oscar/img/favicon.png');

// ICONS //
$('span > a[href="/"]').text('').attr('class', 'home-icon'); // Home Icon
$('a[href="/about"]').text('').attr('class', 'info-icon'); // Info Icon
$('a[href="/help/en/about"]').text('').attr('class', 'info-icon'); // Info Icon(2)
$('a[href="/donate"]').text('').attr('class', 'dollar-icon'); // Donate Icon
$('button[aria-label="Start search"]').text('').addClass('search-icon'); // Search Icon
$('button[aria-label="Clear search"]').text('').addClass('erase-icon'); // Erase Icon
$('label[for="check-advanced"]').text('').addClass('more-icon'); // Advanced Icon
$('.glyphicon.glyphicon-backward').text('').addClass('left-icon'); // Backward Icon
$('.glyphicon.glyphicon-forward').text('').addClass('right-icon'); // Forward Icon

// CSS //

if(window.location.pathname.indexOf("/search") != -1) {
    (function() {
    let css = `
        button[aria-label="Start search"]  {
        top: 0px;
        }
        .search-icon::after {
        top: 21px;
        }
        .search-icon::before {
        top: 8px;
        }
    `;
    if (typeof GM_addStyle !== 'undefined') {
        GM_addStyle(css);
    } else {
        let styleNode = document.createElement("style");
        styleNode.appendChild(document.createTextNode(css));
        (document.querySelector("head") || document.documentElement).appendChild(styleNode);
    }
})(); }

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








