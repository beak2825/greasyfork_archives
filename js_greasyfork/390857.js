// ==UserScript==
// @name         Redirect away
// @include      http*
// @locale      en
// @version      0.20
// @description  Remove redirects across the web speeding up performance
// @author       Danny J Kendall (MANICX100)
// @grant        none
// @namespace https://greasyfork.org/users/169145

// @downloadURL https://update.greasyfork.org/scripts/390857/Redirect%20away.user.js
// @updateURL https://update.greasyfork.org/scripts/390857/Redirect%20away.meta.js
// ==/UserScript==

(function() {

    var k, x, t, i, j, p;
    for (k = 0; x = document.links[k]; k++) {
        t = x.href.replace(/[%]3A/ig, ':').replace(/[%]2f/ig, '/');
        i = t.lastIndexOf('http');
        if (i > 0) {
            t = t.substring(i);
            j = t.indexOf('&');
            if (j > 0) t = t.substring(0, j);
            p = /https?\:\/\/[^\s]*[^.,;'">\s\)\]]/.exec(unescape(t));
            if (p) x.href = p[0];
        } else if (x.onmouseover && x.onmouseout) {
            x.onmouseover();
            if (window.status && window.status.indexOf('://') != -1) x.href = window.status;
            x.onmouseout();
        }
        x.onmouseover = null;
        x.onmouseout = null;
    }

})();