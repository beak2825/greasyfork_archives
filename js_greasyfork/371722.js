// ==UserScript==
// @name Don't track my clicks, reddit
// @namespace http://reddit.com/u/dantesieg
// @author dantesieg
// @description Block reddit tracking clicks.
// @match *://*.reddit.com/*
// @grant none
// @version 0.0.1.20180830073054
// @downloadURL https://update.greasyfork.org/scripts/371722/Don%27t%20track%20my%20clicks%2C%20reddit.user.js
// @updateURL https://update.greasyfork.org/scripts/371722/Don%27t%20track%20my%20clicks%2C%20reddit.meta.js
// ==/UserScript==

var a_col = document.getElementsByTagName('a');
var a, actual_fucking_url;
for(var i = 0; i < a_col.length; i++) {
    a = a_col[i];
    actual_fucking_url = a.getAttribute('data-href-url');
    if(actual_fucking_url) a.setAttribute('data-outbound-url', actual_fucking_url);
}