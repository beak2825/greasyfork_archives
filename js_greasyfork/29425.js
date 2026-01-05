// ==UserScript==
// @name         nixx's magnet link tool for pantsu.cat
// @namespace    https://greasyfork.org/en/users/3372-nixxquality
// @version      1.0
// @description  turns the magnet links on pantsu.cat's nyaa backup into nixx's shit tool
// @author       nixx <nixx@is-fantabulo.us>
// @match        https://nyaa.pantsu.cat/*
// @match        https://sukebei.pantsu.cat/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/29425/nixx%27s%20magnet%20link%20tool%20for%20pantsucat.user.js
// @updateURL https://update.greasyfork.org/scripts/29425/nixx%27s%20magnet%20link%20tool%20for%20pantsucat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var xtregex = /xt=([^&]+)/;
    var dnregex = /dn=([^&]+)/;

    [].forEach.call(document.getElementsByTagName("a"), function(item) {
        if (item.href.startsWith("magnet")) {
            var xtmatch = item.href.match(xtregex);
            var dnmatch = item.href.match(dnregex);

            if (xtmatch !== null) {
                item.href = "https://nixx.is-fantabulo.us/magnet_with_trackers.html#" + xtmatch[1] + "#" + dnmatch[1];
            }
        }
    });

})();