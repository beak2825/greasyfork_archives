// ==UserScript==
// @name         Passthrough traderdoubler
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  squize traderdoubler redirect
// @author       You
// @match        http://userscripts-mirror.org/scripts/show/69797
// @run-at        document-start
// @run-at document-start
// @grant         unsafeWindow
// @grant         GM_log
// @include        http://clk.tradedoubler.com/click?*
// @downloadURL https://update.greasyfork.org/scripts/16795/Passthrough%20traderdoubler.user.js
// @updateURL https://update.greasyfork.org/scripts/16795/Passthrough%20traderdoubler.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var urlparams = getQueryParams(window.location.href);
    window.location.replace(urlparams["url"]);
    
})();


function getQueryParams(qs) {
    qs = qs.split('+').join(' ');

    var params = {},
        tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
    }

    return params;
}