// ==UserScript==
// @name        htmlsp_to_html
// @namespace   http://catherine.v0cyc1pp.com/htmlsp_to_html.user.js
// @include     *?sp*
// @exclude     *.html$
// @run-at      document-start
// @author      greg10
// @license     GPL 3.0
// @version     1.1
// @require     http://code.jquery.com/jquery-3.1.1.min.js
// @grant       none
// @description Replace 'html?sp' to 'html'
// @downloadURL https://update.greasyfork.org/scripts/26021/htmlsp_to_html.user.js
// @updateURL https://update.greasyfork.org/scripts/26021/htmlsp_to_html.meta.js
// ==/UserScript==


var str = document.location + "";

var newstr = str.replace( /\.html\?sp.*$/, ".html");

if ( newstr === str ) return;

window.location.replace( newstr );


