// ==UserScript==
// @name         Ubuntu Manual Highlight
// @namespace    gqqnbig
// @version      0.3
// @description  Highlight Ubuntu 20.04 and Ubuntu native tool.
// @author       gqqnbig
// @match        *://manpages.ubuntu.com/cgi-bin/search.py*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/423741/Ubuntu%20Manual%20Highlight.user.js
// @updateURL https://update.greasyfork.org/scripts/423741/Ubuntu%20Manual%20Highlight.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const column=2;

    let cssRules=
`table table thead th:not(:nth-child(${column})):not(:last-child) {
    opacity: 0.2;
}
table table tbody td:not(:nth-child(${column})):not(:last-child) {
    opacity: 0.2;
}

td a[href$='.1.html'] {
    font-size:2em;
}
td a[href$='.2.html'] {
    font-size:2em;
}
td a[href$='.3.html'] {
    font-size:2em;
}
td a[href$='.4.html'] {
    font-size:2em;
}
td a[href$='.5.html'] {
    font-size:2em;
}
td a[href$='.6.html'] {
    font-size:2em;
}
td a[href$='.7.html'] {
    font-size:2em;
}
td a[href$='.8.html'] {
    font-size:2em;
}`;

    var styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerHTML = cssRules;
    document.head.appendChild(styleSheet);
})();