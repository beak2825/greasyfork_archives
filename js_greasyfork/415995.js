// ==UserScript==
// @name            GeoCheckAutoCaptcha
// @name:de         GeoCheckAutoCaptcha
// @namespace       http://gctools.bplaced.net/
// @version         1.05
// @description     fill in captcha automatically
// @description:de  Automatisches Ausfüllen des GeoCheck Captchas
// @author          Hampf
// @match           http*://*.geocheck.org/*inputchkcoord.php*
// @match           http*://*.geotjek.dk/*inputchkcoord.php*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/415995/GeoCheckAutoCaptcha.user.js
// @updateURL https://update.greasyfork.org/scripts/415995/GeoCheckAutoCaptcha.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // retrieve mds hashed captcha from HTML source
    var m = document.body.innerHTML.match(/validateChkCoordsForm\(this,\s*'([0-9a-fA-F]{32})/);

    if (!m) {
        GM_log("Hash nicht gefunden!");
        return;
    }

    var md5check=m[1];
    var i=-1
    // loop all possibilities until md5 matches
    while(hex_md5(pad(++i,5))!==md5check && i<=99999); // eslint-disable-line
    document.getElementsByName("usercaptcha")[0].value = pad(i,5)

})();

function pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
