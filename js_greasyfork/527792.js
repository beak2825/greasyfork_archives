// ==UserScript==
// @name         Hatena Redirect
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Redirects b.hatena.ne.jp to hatenafilter.com
// @author       You
// @match        https://b.hatena.ne.jp/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/527792/Hatena%20Redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/527792/Hatena%20Redirect.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (location.href === "https://b.hatena.ne.jp/") {
        location.replace("https://hatenafilter.com");
    }
})();
