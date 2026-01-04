// ==UserScript==
// @name         HN Dark Mode
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Simple Dark Mode Stylesheet for HN.
// @match        https://news.ycombinator.com/*
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489188/HN%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/489188/HN%20Dark%20Mode.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var style = document.createElement("style");
    style.type = "text/css";
    style.innerHTML = (function EOF(){ /*!<<<EOF
body  { font-family:Verdana, Geneva, sans-serif; font-size:10pt; color:#828282; background-color: #333; }
#hnmain { background-color: #444; }
.admin td   { font-family:Verdana, Geneva, sans-serif; font-size:8.5pt; color:#000000; }
textarea { font-family:monospace; font-size:10pt; background: #777; color: #EEE; }
a:link    { color:#CCCCCC; text-decoration:none; }
a:visited { color:#828282; text-decoration:none; }
.pagetop { font-family:Verdana, Geneva, sans-serif; font-size: 10pt; color:#222222; }
.c00, .c00 a:link { color:#DDDDDD; }
.pagetop a:visited { color:#000000;}
.topsel a:link, .topsel a:visited { color:#ffffff; }
EOF
*/
    }).toString().split("EOF")[2]
    .replace(/\$\{([^}]+)\}/g, function(outer, inner, pos) {
        return this[inner];
    });
    document.getElementsByTagName('head')[0].appendChild(style);
})();