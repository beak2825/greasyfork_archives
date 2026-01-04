// ==UserScript==
// @name        alienware_time_on_site
// @namespace   http://tampermonkey.net/
// @author      jacky
// @license     jacky
// @description alienware time on site
// @match     https://*.alienwarearena.com/control-center
// @version     2025.07.31.1
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/491148/alienware_time_on_site.user.js
// @updateURL https://update.greasyfork.org/scripts/491148/alienware_time_on_site.meta.js
// ==/UserScript==

var f = false;
if (/Something went wrong/i.exec(document.body.innerHTML)){
    f = true;
}
else {
    var a = $('#control-center__tos-arp');
    var b = $('#control-center__tos-max-arp').text();
    if (a.text() < b) {
        f = true;
        a.css('color', 'red');
        var d = new Date().toLocaleTimeString();
        a.after(`<span>&nbsp;${d}</span>`)
    }
}
if (f) {
    setTimeout(function(){
        window.location.reload();
    }, 120 * 1000);
}