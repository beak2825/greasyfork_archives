// ==UserScript==
// @name Melvor Wiki Dark Theme
// @namespace https://greasyfork.org/en/users/776194-jared-g
// @version 0.1.2
// @description A quick and dirty dark theme for the Melvor Idle wiki
// @author Perp#1396
// @grant GM_addStyle
// @run-at document-start
// @match *://*.wiki.melvoridle.com/*
// @downloadURL https://update.greasyfork.org/scripts/427034/Melvor%20Wiki%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/427034/Melvor%20Wiki%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
let css = `
#mw-page-header-links li.selected a,#p-logo-text a,#searchInput,.mw-body .mw-rcfilters-ui-changesListWrapperWidget .mw-changeslist-legend,.mw-body .mw-search-profile-tabs,.mw-body fieldset#mw-searchoptions,.mw-changeslist-legend,.mwe-popups .mwe-popups-extract,.suggestions .suggestions-result,.suggestions a.mw-searchSuggest-link,.suggestions a.mw-searchSuggest-link:active,.suggestions a.mw-searchSuggest-link:focus,.suggestions a.mw-searchSuggest-link:hover,.suggestions-special .special-query,.wikitable,body {
    color: #eee
}

#mw-header-container {
    background-color: #323942;
    color: #eee
}

#simpleSearch {
    border-color: #465160
}

#mw-content-container,#simpleSearch {
    background-color: #232a35
}

.mw-parser-output a.external,a {
    color: #29d
}

.mw-parser-output a.external:visited,a:visited {
    color: #18c
}

.mw-parser-output a.external:active,.mw-parser-output a.external:hover,a:active,a:hover {
    color: #5bf
}

#mw-content {
    background-color: #2c343f;
    border-color: #2c343f
}

.tocnumber {
    color: #ccc
}

.toctogglelabel {
    color: #28c
}

.mw-body .mw-rcfilters-ui-changesListWrapperWidget .mw-changeslist-legend,.mw-body .mw-search-profile-tabs,.mw-body fieldset#mw-searchoptions,.mw-changeslist-legend,.mw-warning,.suggestions,.suggestions .suggestions-results,.suggestions .suggestions-special,.thumbinner,.toc,.wikitable,ul#filetoc {
    background-color: #323942;
    border-color: #465160
}

.thumbborder,.thumbinner .thumbimage,.wikitable>*>tr>td,.wikitable>*>tr>th,.wikitable>tr>td,.wikitable>tr>th {
    border-color: #465160
}

.wikitable>*>tr>th,.wikitable>tr>th {
    background-color: #465160
}

.mwe-popups {
    background: #323942
}

.mwe-popups .mwe-popups-extract[dir=ltr]::after {
    background-image: linear-gradient(to right,rgba(255,255,255,0),#323942 50%)
}

td[style*="background-color:lightpink;"], td[style*="background-color:#FFE8E8;"] {
    background-color: #6a2731!important
}

td[style*="background-color:lightgreen;"], td[style*="background-color:#E8FFEB;"] {
    background-color: #285128!important
}

span[style*="color:green"] {
    color: #3ec83e!important
}

table[style*="background:#FFF7F7;"] {
    background-color: #465160!important
}

#mw-header-nav-hack {
    background: #323942;
    border-top-color: #465160
}

@media only screen and (min-width:1100px) {
    #mw-related-navigation .sidebar-chunk,#mw-site-navigation .sidebar-chunk {
        background-color: #323942;
        border-color: #323942;
        border-radius: .5rem;
        box-shadow: 0 1px 2px rgb(33 34 35/50%),0 1px 2px rgb(26 26 27/50%)
    }
}

#mw-related-navigation .sidebar-inner,#mw-site-navigation .sidebar-inner,#personal .dropdown {
    background: #323942;
    border-color: #465160
}

#menus-cover {
    background: #111
}
table.lighttable .highlight-over {
    background-color:#465160;
}
table.lighttable .highlight-on {
   background-color:#285128;     
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
