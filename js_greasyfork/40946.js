// ==UserScript==
// @name         Toranoana: detailed search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  detailed search GET to POST
// @author       Rafael Vuijk
// @match        http://www.toranoana.jp/cgi-bin/R2/d_search.cgi?*
// @grant        none
// @run-at       document-body
// @downloadURL https://update.greasyfork.org/scripts/40946/Toranoana%3A%20detailed%20search.user.js
// @updateURL https://update.greasyfork.org/scripts/40946/Toranoana%3A%20detailed%20search.meta.js
// ==/UserScript==

// e.g: http://www.toranoana.jp/cgi-bin/R2/d_search.cgi?item_kind=0401&bl_fg=0&adl=0&obj=1&dms=01&dme=01&img=1&stk=1&nam=%s

(function() {
    'use strict';

    var f = document.createElement('form');
    f.style = "display: inline";
    f.action = "http://www.toranoana.jp/cgi-bin/R2/d_search.cgi";
    f.method = 'post';
    // f.target = '_blank';
    f.setAttribute('accept-charset', 'shift-jis');

    var inp = function(name, value) {
        var i = document.createElement('input');
        i.type = 'hidden';
        i.name = name;
        i.value = value;
        return i;
    };

    for (let q of window.location.search.split(/[?&]/).filter(String)) {
        let kv = q.split('=', 2);
        f.appendChild(inp(kv[0], decodeURIComponent(kv[1])));
    }

    document.body.appendChild(f);

    f.submit();

})();