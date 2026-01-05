// ==UserScript==
// @name         YouTube force https
// @namespace    http://your.homepage/
// @version      0.1
// @description  Forsed https: for youtube. No more irritating page reloads. Very simple script.
// @author       You
// @include       http://*youtube.com*
// @grant        none
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/11926/YouTube%20force%20https.user.js
// @updateURL https://update.greasyfork.org/scripts/11926/YouTube%20force%20https.meta.js
// ==/UserScript==

var t = window.location.href;
if(window.location.protocol==='https:'){
    return;
}
var p = t.replace('http', 'https');
window.location.href = p;