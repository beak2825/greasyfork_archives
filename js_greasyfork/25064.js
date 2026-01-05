// ==UserScript==
// @name        ShowPasswords
// @namespace   http://g-uberdork.homeip.net/~jweida/userjs
// @description Shows passwords in form controls on the page
// @include     *
// @version 0.0.1.20161123063142
// @downloadURL https://update.greasyfork.org/scripts/25064/ShowPasswords.user.js
// @updateURL https://update.greasyfork.org/scripts/25064/ShowPasswords.meta.js
// ==/UserScript==

// Credit goes to http://www.whatsmypass.com/?p=26 for the idea

(function() {
    var F,j,f,i;

    F = document.forms;
    for(j=0; j<F.length; ++j) {
        f = F[j];
        for (i=0; i<f.length; ++i) {
            if (f[i].type.toLowerCase() == "password")
                f[i].type = "text";
        }
    }    
})();